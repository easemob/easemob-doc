# 自定义 RTC 凭证接入

## 概述

默认情况下，CallKit 使用声网提供的 RTC 凭证体系，即登录即时通讯 IM 后，由 IM SDK 自动下发 RTC AppId、Token、UID 以及 UID 和 IM 用户 ID（`userId`）的映射，你只需要通过 `CallKitManager.shared.setup(config)` 完成配置即可。

**如果你已有自己的声网 App ID，并希望在自己的应用服务端独立签发 RTC Token、自行维护 IM userId 与 RTC UID 的映射关系**，你可以使用 `CallTokenProvider`方式接入。[示例项目](https://github.com/easemob/easemob-callkit-iOS)的首页点击 **Token Provider** 可进入完整可运行示例，源码详见 [Example/EaseCallUIKit/TokenProviderViewController.swift](https://github.com/easemob/easemob-callkit-iOS/blob/dev/Example/EaseCallUIKit/TokenProviderViewController.swift)。

你可根据业务场景选择 CallKit 的两种凭证管理方式：

| 项    | 默认方式   | `CallTokenProvider`              |
| :--- | :-------- | :-------- |
| **RTC App ID**        | 登录 IM 后从 IM SDK 的 `options.appId` 读取 | 由你的应用服务端通过 `CallTokenProvider.getAppId()` 提供     |
| **RTC Token / UID**   | 登录后向 IM SDK 请求下发                    | 由你的应用服务端通过 `CallTokenProvider.getRTCToken(withChannel:)` 签发 |
| **声网 UID 与 IM 用户 ID（`userId`）的映射** | 依赖 IM SDK 内置映射 | 由你的应用服务端通过 `CallTokenProvider.getRelations(rtc:)` 维护 |

:::tip
两种方式只能选其一。RTC 引擎创建后 **无法切换凭证来源**。如需从默认方式切换至 `CallTokenProvider` 方式，请 **重启 App** 后直接进入 Token Provider 页面，不要在首页先完成 IM 登录。
:::

## API

`CallTokenProvider` 提供以下三个方法用于自定义 RTC 凭证管理。**不实现某个方法或方法返回空值时，CallKit 会降级到 IM SDK 内部逻辑**。

**getAppId()**

- **说明：** 同步返回你的声网 App ID（不是 IM 提供的 App ID）。
- **调用时机：** 初始化 RTC 引擎时调用，仅调用一次；后续通话重新创建引擎时可能再次调用。
- **回退逻辑（返回空时）：** 使用 IM SDK 配置中的 App ID（`ChatClient.shared().options.appId`）。
- **返回值约束：** 必须返回有效的声网 RTC App ID 字符串。该方法必须轻量、同步，并支持重复调用。

**getRTCToken(withChannel: String?) async throws -> CallRTCTokenInfo**

- **说明：** 异步返回 RTC Token、UID 和过期时间。当前 `channelName` 固定传 `nil`，请签发 **对所有频道有效的应用级 Token**。
- **调用时机：** 登录后、加入 RTC 频道前、Token 即将过期时、App 从后台回到前台等时机。
- **回退逻辑（返回 `nil` 或抛出异常时）：** 使用 IM SDK 的获取逻辑（调用 `ChatClient.shared().getRTCToken(withChannel:)`）。
- **返回值约束：**
  - `uid` 必须大于 0，同一用户应尽量保持稳定。
  - `expiration` 为 Unix 时间戳（秒）。CallKit 当前不读取该字段来计算续期时间；续期由 RTC SDK 的 Token 过期回调触发。字段取值（包括 `0` 的含义）应与服务端 Token 签发规则保持一致。
  - `token` 不能为空（除非将 `CallKitConfig.disableRTCTokenValidation` 设为 `true`）。

```swift
public struct CallRTCTokenInfo: Sendable {
    public let uid: UInt32
    public let token: String
    public let expiration: Int64
}
```

## 接入流程

本节介绍从初始化到呼叫的流程。

### 步骤 1：通过自有 App ID 初始化 IM SDK

与默认方式相同，使用你的 IM 的 App ID 初始化 IM SDK。

**不要将 RTC App ID 填入 IM Options，它将在后续由 `CallTokenProvider.getAppId()` 单独提供。** 

```Swift
let option = ChatSDKOptions(appID: appID)
option.enableConsoleLog = true
option.isAutoLogin = false
ChatClient.shared().initializeSDK(with: option)
```

### 步骤 2：通过 CallTokenProvider 初始化 CallKit

调用 `setup(_:tokenProvider:)` 时，`CallKit` 会立即调用 `getAppId()` 创建 RTC 引擎。此后，登录、进房、Token 续期等所有 RTC 凭证需求均通过 `CallTokenProvider` 从你的服务端获取，不再依赖 IM SDK。

```Swift
let config = CallKitConfig()
config.enablePIPOn1V1VideoScene = true
CallKitManager.shared.setup(config, tokenProvider: self)
CallKitManager.shared.profileProvider = self
CallKitManager.shared.addListener(self)
```

### 步骤 3：实现 CallTokenProvider 协议

下面给出 `CallTokenProvider` 三个方法的组合实现示例。有关各方法的说明、调用时机、回退逻辑和返回值约束，参见 [API](#api) 章节。

```Swift
final class ExampleCallTokenProvider: CallTokenProvider {

    func getAppId() -> String {
        agoraAppId
    }

    func getRTCToken(withChannel channelName: String?) async throws -> CallRTCTokenInfo {
        // channelName 当前为 nil，服务端应按应用级 Token 签发。
        // 建议服务端返回：{ "uid": 123456, "token": "007eJx...", "expiration": 1710000000 }
        let currentUserId = ChatClient.shared().currentUsername ?? ""
        var request = URLRequest(url: URL(string: "https://your-server.com/rtc/token")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "userId": currentUserId,
            "channelName": channelName as Any
        ])
        let (data, _) = try await URLSession.shared.data(for: request)
        let object = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        return CallRTCTokenInfo(
            uid: (object?["uid"] as? NSNumber)?.uint32Value ?? 0,
            token: object?["token"] as? String ?? "",
            expiration: (object?["expiration"] as? NSNumber)?.int64Value ?? 0
        )
    }

    func getRelations(rtc uids: [UInt32]) async throws -> [UInt32: String] {
        // 建议服务端返回：{ "123456": "userA", "234567": "userB" }
        var request = URLRequest(url: URL(string: "https://your-server.com/rtc/relations")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "uids": uids.map { NSNumber(value: $0) }
        ])
        let (data, _) = try await URLSession.shared.data(for: request)
        let object = try JSONSerialization.jsonObject(with: data) as? [String: String] ?? [:]
        return object.reduce(into: [UInt32: String]()) { result, item in
            guard let uid = UInt32(item.key), uid > 0, !item.value.isEmpty else { return }
            result[uid] = item.value
        }
    }
}
```

### 步骤 4：登录 IM 并发起呼叫

IM 登录仍使用 IM 用户 Token，**RTC Token 不会在登录时获取**，而是由 `CallTokenProvider` 在进房或续期时按需回调。呼叫 API 与默认方式完全相同。

```Swift
ChatClient.shared().login(withUsername: userId, token: token) { userId, error in
    if error == nil, !userId.isEmpty {
        let profile = CallUserProfile()
        profile.id = userId
        profile.nickname = "\(userId)昵称"
        CallKitManager.shared.currentUserInfo = profile
    }
}

CallKitManager.shared.call(with: peerUserId, type: .singleAudio)
// 或
CallKitManager.shared.groupCall(groupId: groupId)
```

## 完整示例代码

```swift
import UIKit
import EaseCallUIKit
import AgoraRtcKit

// MARK: - 配置常量
let AppKey = "YOUR_IM_APP_KEY"
let userId = "YOUR_USER_ID"
let token = "YOUR_IM_TOKEN"
let agoraAppId = "YOUR_AGORA_APP_ID"
let tokenProviderBaseURL = "https://your-server.com"
let agoraRTCUid: UInt32 = 0
let agoraRTCToken = ""
let agoraRTCTokenExpiration: Int64 = 0
let agoraRTCUidToUserId: [UInt32: String] = [:]

// MARK: - AppDelegate
@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        // 1. 初始化 IM SDK
        let option = ChatSDKOptions(appkey: AppKey)
        option.enableConsoleLog = true
        option.isAutoLogin = false
        ChatClient.shared().initializeSDK(with: option)
    
        // 2. 设置自定义 RTC 配置提供者（可选）
        let config = CallKitConfig()
        config.enablePIPOn1V1VideoScene = true
        CallKitManager.shared.setup(config, tokenProvider: MyCallTokenProvider())
        CallKitManager.shared.profileProvider = MyCallProfileProvider()
        CallKitManager.shared.addListener(MyCallServiceListener())
        
        return true
    }
}

// MARK: - 自定义 RTC 配置提供者实现
final class MyCallTokenProvider: CallTokenProvider {

    func getAppId() -> String {
        agoraAppId
    }
    
    func getRTCToken(withChannel channelName: String?) async throws -> CallRTCTokenInfo {
        // 如果只是本地验证协议是否接通，可以临时返回下面这组调试值。
        // 真机通话前请改成真实的服务端请求，并删除这段调试返回。
        if !agoraRTCToken.isEmpty, agoraRTCUid > 0 {
            return CallRTCTokenInfo(
                uid: agoraRTCUid,
                token: agoraRTCToken,
                expiration: agoraRTCTokenExpiration
            )
        }
    
        let currentUserId = ChatClient.shared().currentUsername ?? ""
        var request = URLRequest(url: URL(string: "\(tokenProviderBaseURL)/rtc/token")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "userId": currentUserId,
            "channelName": channelName as Any
        ])
        let (data, _) = try await URLSession.shared.data(for: request)
        let object = try JSONSerialization.jsonObject(with: data) as? [String: Any]
        return CallRTCTokenInfo(
            uid: (object?["uid"] as? NSNumber)?.uint32Value ?? 0,
            token: object?["token"] as? String ?? "",
            expiration: (object?["expiration"] as? NSNumber)?.int64Value ?? 0
        )
    }
    
    func getRelations(rtc uids: [UInt32]) async throws -> [UInt32: String] {
        // 建议服务端返回：{ "123456": "userA", "234567": "userB" }
        var request = URLRequest(url: URL(string: "\(tokenProviderBaseURL)/rtc/relations")!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: [
            "uids": uids.map { NSNumber(value: $0) }
        ])
        let (data, _) = try await URLSession.shared.data(for: request)
        let object = try JSONSerialization.jsonObject(with: data) as? [String: String] ?? [:]
        return object.reduce(into: [UInt32: String]()) { result, item in
            guard let uid = UInt32(item.key), uid > 0, !item.value.isEmpty else { return }
            result[uid] = item.value
        }
    }
}

// MARK: - 用户信息提供者
final class MyCallProfileProvider: CallUserProfileProvider {
    func fetchUserProfiles(profileIds: [String]) async -> [any CallProfileProtocol] {
        var resultProfiles: [CallProfileProtocol] = []
        var unknownIds: [String] = []
        for profileId in profileIds {
            if let profile = CallKitManager.shared.usersCache[profileId] {
                resultProfiles.append(profile)
            } else {
                unknownIds.append(profileId)
            }
        }
        guard !unknownIds.isEmpty else { return resultProfiles }
        let result = await ChatClient.shared().userInfoManager?.fetchUserInfo(byId: unknownIds)
        if result?.1 == nil, let infoMap = result?.0 {
            for (userId, info) in infoMap {
                let profile = CallUserProfile()
                profile.id = userId
                profile.nickname = info.nickname ?? ""
                profile.avatarURL = info.avatarUrl ?? ""
                resultProfiles.append(profile)
            }
        }
        return resultProfiles
    }

    func fetchGroupProfiles(profileIds: [String]) async -> [any CallProfileProtocol] {
        let groups = ChatClient.shared().groupManager?.getJoinedGroups() ?? []
        return profileIds.compactMap { groupId in
            guard let group = groups.first(where: { $0.groupId == groupId }) else { return nil }
            let profile = CallUserProfile()
            profile.id = groupId
            profile.nickname = group.groupName
            profile.avatarURL = group.settings.ext
            return profile
        }
    }
}

// MARK: - 通话事件监听
final class MyCallServiceListener: CallServiceListener {
    func didOccurError(error: CallError) {
        DispatchQueue.main.async {
            print("通话错误: \(error.errorMessage)")
        }
    }

    func didUpdateCallEndReason(reason: CallEndReason, info: CallInfo) {
        print("通话结束: \(reason)")
    }
    
    func remoteUserDidJoined(userId: String, uid: UInt, channelName: String, type: CallType) {}
    func remoteUserDidLeft(userId: String, uid: UInt, channelName: String, type: CallType) {}
    func onRtcEngineCreated(engine: AgoraRtcEngineKit) {}
}

// MARK: - 业务服务器实现
struct MyTokenServer {
    static func fetchRtcToken(userId: String, channelName: String?) async throws -> TokenResponse {
        // 实现你的网络请求逻辑，调用你的服务器获取 Token
        // 返回格式应为：{ "uid": 123456, "token": "007eJx...", "expiration": 1710000000 }
        return TokenResponse(
            uid: userId.hashCode().toInt().let { if ($0 < 0) -$0 else $0 },
            token: "your_agora_rtc_token",
            expireTime: Int64(Date().timeIntervalSince1970) + 24 * 3600
        )
    }
}

struct MyUserServer {
    static func queryUserIdsByUids(_ uids: [UInt32]) async throws -> [UInt32: String] {
        // 实现你的网络请求逻辑，调用你的服务器查询 uid 映射
        // 返回格式应为：{ "123456": "userA", "234567": "userB" }
        return uids.reduce(into: [UInt32: String]()) { result, uid in
            result[uid] = "user_\(uid)"
        }
    }
}

struct TokenResponse {
    let uid: UInt32
    let token: String
    let expireTime: Int64
}

// MARK: - 使用示例 ViewController
class MyViewController: UIViewController {
    
    @IBOutlet weak var userIdTextField: UITextField!
    @IBOutlet weak var callIdTextField: UITextField!
    @IBOutlet weak var callTypeSegment: UISegmentedControl!
    
    @IBAction func loginAction(_ sender: UIButton) {
        guard let userId = userIdTextField.text, !userId.isEmpty else { return }
        
        ChatClient.shared().login(withUsername: userId, token: token) { [weak self] loginUserId, error in
            if error == nil, !loginUserId.isEmpty {
                let profile = CallUserProfile()
                profile.id = loginUserId
                profile.nickname = loginUserId
                CallKitManager.shared.currentUserInfo = profile
            }
        }
    }
    
    @IBAction func callAction(_ sender: UIButton) {
        guard let callId = callIdTextField.text?.trimmingCharacters(in: .whitespacesAndNewlines), !callId.isEmpty else { return }
        
        let callType: CallType
        switch callTypeSegment.selectedSegmentIndex {
        case 1:
            callType = .singleVideo
        case 2:
            callType = .groupCall
        default:
            callType = .singleAudio
        }
    
        if callType != .groupCall {
            CallKitManager.shared.call(with: callId, type: callType)
        } else {
            CallKitManager.shared.groupCall(groupId: callId)
        }
    }
}
```

## 常见问题

| 问题 | 解决方法 |
| :-------------- | :----- |
| 收到 `App ID is not set` 或 `RTC App ID from CallTokenProvider is empty` 错误 | 使用自定义 `CallTokenProvider` 时，RTC App ID 由应用通过 `getAppId()` 提供，IM SDK 不负责提供或兜底。请检查 `getAppId()` 是否返回非空、有效的声网 RTC App ID（不是环信 AppKey）。已有声网 RTC 项目的用户应填写原项目的 App ID；如果使用环信提供的 RTC 服务，请先在环信控制台为当前应用开通音视频服务。RTC App ID 只在 RTC 引擎创建时读取一次，之后不能改变。 |
| 收到 `RTC credential source returned an invalid credential` 或其他 Token 相关错误 | 该错误表示 CallKit 未取得有效的 `CallRTCTokenInfo`。使用自定义 `CallTokenProvider` 时，RTC Token 由应用通过 `getRTCToken(withChannel:)` 提供，IM SDK 不负责获取 Token。请确认返回结果满足以下条件：`uid > 0`、`token` 为非空字符串（除非启用了 `disableRTCTokenValidation`）、`expiration >= 0` 且大于当前时间戳。当前 `channelName` 参数固定为 `nil`，请签发**应用级 Token**（对所有频道有效），不要按单个频道签发。如果 Provider 方法抛出异常或返回无效数据，CallKit 会报凭证错误。 |
| 能发送通话邀请，但无法进入 RTC 频道 | 确认以下条件一致：(1) 生成 Token 时使用的 RTC App ID 与初始化时的一致；(2) **生成 Token 时必须按应用级签发**（`channelName` 为 `nil`，有效对所有频道）；(3) 加入频道时使用的 UID 与生成 Token 时的 UID 一致；(4) Token 未过期（`expiration` 大于当前时间戳）。若混用不同 Agora 项目、不同频道的 Token，或使用已过期的 Token，会导致加入频道失败。 |
| 已有声网 RTC 项目的用户如何接入 CallKit | `CallTokenProvider` 用于让已有声网 RTC 项目的用户直接使用 CallKit。配置 Provider 后，通过 `getAppId()` 提供原声网项目的 RTC App ID，通过 `getRTCToken(withChannel:)` 提供由业务服务端签发的 RTC Token，并通过 `getRelations(rtc:)` 提供 RTC UID 与 IM 用户 ID 的映射。RTC App ID 和 Token 均由应用提供，IM SDK 不负责获取；IM SDK 仍用于 IM 登录和通话信令。 |
| 多人通话中远端用户的昵称或头像未正确显示 | 首先检查 `getRelations(rtc:)` 返回的字典是否包含所有请求的 RTC UID。该字典的键应为 RTC UID（`UInt32`），值应为对应的 IM 用户 ID（`String`）。该方法只负责 RTC UID 到 IM 用户 ID 的映射；昵称、头像等用户资料还需由 `CallUserProfileProvider.fetchUserProfiles()` 正确返回。缺失的 UID 会自动使用 IM SDK 的查询逻辑（`ChatClient.shared().getUserId(byRTCUIds:)`）。注：UID 解析失败会被记录在负缓存中，30 秒内不再重试。 |
| 通话过程中收到 Token 续期相关的错误或 Token 无法续期 | RTC SDK 在以下两种情况下触发 Token 续期回调：(1) `rtcEngine(_:tokenPrivilegeWillExpire:)` - Token 即将过期时（在过期前约 5 分钟自动触发）；(2) `rtcEngineRequestToken(_:)` - Token 已完全过期，需要重新加入频道。此时 CallKit 会调用 `getRTCToken(withChannel:)` 请求新的 Token。请确认该方法及时返回有效的新 Token（必须是新签发的、过期时间在当前时间戳之后），不要重复返回已过期的 Token 或返回 `nil`。 |
| 收到 `Failed to renew token` 或加入频道后立即断连 | 这通常是因为 Token 过期。CallKit 在 Token 有效期内会在到期前约 5 分钟自动更新一次（不需要开发者手动处理），但如果 `getRTCToken(withChannel:)` 返回的 Token 已过期或无效，会导致续期失败。请确保服务端生成的 Token 有足够的有效期（建议至少 24 小时）。当 Token 完全过期时（超过 `expiration` 时间戳），RTC SDK 会触发 `rtcEngineRequestToken(_:)` 回调，此时 CallKit 会重新加入频道。 |
| 更换 RTC App ID 或 Token 后配置未生效，或收到 `RTC App ID changed after the RTC engine was created` 错误 | RTC App ID 只在 RTC 引擎创建时读取，同一个 RTC 引擎生命周期内不能改变。若需更换 App ID 或 Provider，必须先结束当前通话（调用 `hangup()`），等待 RTC 引擎销毁完成，再在下一次通话开始前重新设置新的 `CallTokenProvider` 或新的 App ID。为避免同一次通话中的配置混乱，**严禁在通话过程中更换 Provider**。 |
| 切换 IM 账号后出现 Token 失效、UID 错误或 `UID changed` 异常 | 请先结束当前通话（调用 `hangup()`）并完成 IM 账号切换（调用 `ChatClient.shared().logout()`），再用新账号发起新通话。同时确认自定义 `CallTokenProvider` 按当前登录用户正确生成 Token 和 UID，不要复用上一个账号的 Token。**关键是 UID 必须在同一次通话中保持一致**，如果 `getRTCToken(withChannel:)` 在通话中途返回不同的 UID，会被检测为异常。登出时调用 `CallKitManager.shared.cleanUserDefaults()` 清理本地缓存的 Token 和 UID 映射。如需完全释放所有资源，调用 `CallKitManager.shared.tearDown()` 而不是 `cleanUserDefaults()`。 |
| 收到 `RTC credential has expired` 或 `RTC credential request no longer matches the active call` 错误 | 这通常表示以下情况之一：(1) 返回的 Token 已过期（`expiration` 小于当前时间戳）；(2) 在等待 Token 或 UID 映射的过程中，通话状态发生了变化（如用户中途切换、IM 状态改变、通话被中断）；(3) 返回的 UID 值与之前不一致。请确认 `getRTCToken(withChannel:)` 返回的 Token 有效期在当前时间戳之后，并且返回的 UID **始终保持一致**（同一用户，同一通话中 UID 不能改变）。 |
| 多人通话中某些用户显示为 `uid-N` 占位符，或同一个人出现两个格子 | CallKit 在解析 RTC UID 到 IM 用户 ID 失败时，会使用 `uid-N` 作为临时占位符显示用户。这表示 `getRelations(rtc:)` 未能返回该 UID 对应的用户 ID。请检查：(1) 是否在所有需要的回调中都实现了该方法；(2) 返回的字典中是否包含了所有请求的 UID；(3) UID 解析是否由于网络等原因多次失败（失败会被负缓存 30 秒）。一旦真实的 IM 用户 ID 被解析出来，占位符会被自动替换，同一用户只会显示一个格子。 |
| Token 未按应用级签发导致频道加入失败 | **重要**：CallKit 固定使用 **应用级 Token**（`channelName` 为 `nil`），而不是频道级 Token。若服务端按频道级签发 Token，即使 UID 和 App ID 正确，仍然无法加入 RTC 频道。请确保服务端在调用 Agora Token Server API 时，对应的请求中 `channelName` 参数为空或不指定，以获取应用级 Token。 |

