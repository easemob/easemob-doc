# 连接

## 功能说明

应用客户端成功连接到环信服务器后，才能使用即时通讯 SDK 的消息收发及其他需要访问服务器的功能。

调用 `login` 登录后，SDK 会建立并维护长连接。连接运行期间，SDK 通过 `EMClientDelegate` 通知应用连接状态、异常登出、Token 生命周期、本地数据库打开、离线消息同步和登录后业务数据同步等状态变化。

关于登录、登出和登录状态，详见 [登录](login.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [初始化](initialization.html)。
- 已从你的应用服务器获取有效的环信用户 ID 和用户 Token。
- 已了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 连接生命周期

iOS SDK 的连接生命周期通常包括以下阶段：

1. 调用 `initializeSDK(with:)` 初始化 SDK。
2. 通过 `add(_:delegateQueue:)` 注册 `EMClientDelegate`，建议在登录前完成注册。
3. 调用 `login(withUsername:token:completion:)` 显式登录并建立长连接。
4. 用户本地数据库打开结束后触发 `onDatabaseOpened(_:username:)`。该回调仅表示数据库打开流程结束，不表示已连接服务器；应检查其 `error` 参数。
5. 成功连接服务器后触发 `connectionStateDidChange(_:)`，状态值为 `.connected`。SDK 随后同步离线消息，并按初始化配置同步业务数据。
6. 连接中断后，SDK 根据断开原因自动重连，或者通过相应的账号异常回调通知应用处理不可恢复的登出。
7. 调用 `logout(_:completion:)` 主动登出并关闭当前连接。

```swift
final class ConnectionListener: NSObject, EMClientDelegate {
    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        switch connectionState {
        case .connected:
            // SDK 已连接到服务器。
            break
        case .disconnected:
            // SDK 与服务器断开；可恢复的网络问题由 SDK 自动重连。
            break
        @unknown default:
            break
        }
    }
}

let connectionListener = ConnectionListener()
EMClient.shared().add(connectionListener, delegateQueue: nil)

EMClient.shared().login(
    withUsername: "userId",
    token: "token"
) { username, error in
    if let error {
        print("登录失败：\(error.errorDescription)")
    } else {
        print("登录成功：\(username)")
    }
}
```

## 获取连接状态

通过 `EMClient.isConnected` 查询 SDK 当前是否已连接到服务器：

```swift
let connected = EMClient.shared().isConnected
```

通过 `EMClient.isLoggedIn` 查询当前用户是否处于登录状态：

```swift
let loggedIn = EMClient.shared().isLoggedIn
```

| API | 说明 |
| :--- | :--- |
| `isConnected` | 当前是否已连接到聊天服务器。 |
| `isLoggedIn` | 当前用户是否已登录聊天服务器。 |

:::tip
连接状态与登录状态含义不同。弱网或切换网络时，用户可能仍处于登录状态，但长连接暂时断开并由 SDK 自动重连。业务 UI 应结合代理回调处理状态变化，不要只依赖一次属性查询。
:::

## 监听连接变化

通过 `EMClient.add(_:delegateQueue:)` 注册 `EMClientDelegate`。建议在调用登录接口前注册，以免遗漏登录建连及后续同步状态。

`delegateQueue` 传 `nil` 时，iOS SDK 的当前实现会将代理回调分发到主队列；传入自定义队列时，回调在指定队列执行。

### 回调说明

| Swift 回调 | 触发时机 | 说明 |
| :--- | :--- | :--- |
| `connectionStateDidChange(_:)` | SDK 与服务器的连接状态发生变化时触发。 | 参数为 `.connected` 或 `.disconnected`。首次登录连接成功、连接断开及自动重连成功时均可能触发。 |
| `onDatabaseOpened(_:username:)` | 登录后的本地数据库打开流程结束时触发。 | `error == nil` 表示数据库打开成功；失败、超时或断连结束时也会触发。该回调不能替代连接成功回调。 |
| `userAccountDidLoginFromOtherDevice(with:)` | 当前账号在其他设备登录，或出现设备变更时触发。 | `EMLoginExtensionInfo?` 可包含新登录设备的名称和扩展信息。当前实现随后会清理本地登录信息。 |
| `userAccountDidRemoveFromServer()` | 当前账号被服务端删除时触发。 | 当前实现会登出并清理本地登录信息。 |
| `userDidForbidByServer()` | 当前账号或应用服务被服务端禁用时触发。 | 当前实现会登出并清理本地登录信息。 |
| `userAccountDidForced(toLogout:)` | 密码变更、设备数超限、被其他设备强制下线、鉴权失败或 DAU/MAU 超限时触发。 | 参数为可空的 `EMError`，应根据 `code` 处理原因。当前实现会清理本地登录信息。 |
| `tokenWillExpire(_:)` | Token 剩余约 20% 有效期时触发。 | 应从应用服务器获取新 Token，并调用异步 `renewToken(_:completion:)`。 |
| `tokenDidExpire(_:)` | Token 已过期时触发。 | 当前实现会登出；获取新 Token 后应重新登录。 |
| `onOfflineMessageSyncStart()` | SDK 开始从服务器同步离线消息时触发。 | 没有离线消息时可能不触发。 |
| `onOfflineMessageSyncFinish()` | SDK 完成离线消息同步时触发。 | 同步过程中连接断开时可能不触发。 |
| `syncDataStart(with:)` | 登录后某类业务数据开始自动同步时触发。 | `type` 为 `EMDataSyncType`，表示会话、好友或已加入群组等数据。 |
| `syncDataFinished(_:type:)` | 某类业务数据同步结束时触发。 | 成功、失败、超时或断连结束时均会触发；`error == nil` 表示同步成功。 |

### 示例代码

```swift
final class ConnectionListener: NSObject, EMClientDelegate {
    func connectionStateDidChange(_ connectionState: EMConnectionState) {
        if connectionState == .connected {
            // 连接成功或自动重连成功。
        } else {
            // 连接断开。可恢复的网络问题由 SDK 自动重连。
        }
    }

    func onDatabaseOpened(_ error: EMError?, username: String) {
        if error == nil {
            // username 对应的本地数据库已打开。
        }
    }

    func userAccountDidLoginFromOtherDevice(
        with info: EMLoginExtensionInfo?
    ) {
        // 当前账号在其他设备登录。
        print("设备名称：\(info?.deviceName ?? "")")
        print("扩展信息：\(info?.extensionInfo ?? "")")
    }

    func userAccountDidRemoveFromServer() {
        // 当前账号已被服务端删除。
    }

    func userDidForbidByServer() {
        // 当前账号或应用服务已被禁用。
    }

    func userAccountDidForced(toLogout error: EMError?) {
        // SDK 因不可恢复原因强制退出登录。
        if let error {
            print("强制登出：\(error.code), \(error.errorDescription)")
        }
    }

    func tokenWillExpire(_ errorCode: EMErrorCode) {
        // 从应用服务器获取新 Token 后调用 renewToken(_:completion:)。
    }

    func tokenDidExpire(_ errorCode: EMErrorCode) {
        // Token 已过期。获取新 Token 后重新登录。
    }

    func onOfflineMessageSyncStart() {
        // 开始同步离线消息。
    }

    func onOfflineMessageSyncFinish() {
        // 离线消息同步完成。
    }

    func syncDataStart(with type: EMDataSyncType) {
        // type 对应的数据开始自动同步。
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        if error == nil {
            // type 对应的数据同步成功。
        }
    }
}

let connectionListener = ConnectionListener()
EMClient.shared().add(connectionListener, delegateQueue: nil)

// 不再需要监听时移除代理。
EMClient.shared().removeDelegate(connectionListener)
```

:::tip
请持有监听对象，直到调用 `removeDelegate(_:)`。如果将自定义队列传给 `delegateQueue`，请切换到主线程后再更新 UI，也不要在回调中执行大量耗时操作。
:::

## 连接恢复与异常处理

### 自动重连

登录成功后，如果因网络信号弱、网络切换或其他可恢复原因导致连接中断，SDK 会自动尝试重连，无需应用重复调用登录接口。

连接断开时，`connectionStateDidChange(_:)` 返回 `.disconnected`；重连成功后返回 `.connected`。iOS SDK 仅公开“已连接”和“未连接”两种 `EMConnectionState`，不提供独立的“正在连接”或“重连失败”状态。应用应结合该回调、`isConnected` 和系统网络状态展示连接状态。

以下情况不能仅靠自动重连恢复，应用需要根据专用回调处理账号、Token、设备或服务限制：

- 用户主动调用 `logout(_:completion:)`。
- Token 无效、鉴权失败或 Token 已过期。
- 账号被删除、禁用、在其他设备登录或被强制退出。
- 登录设备数、应用活跃用户数或服务配额达到限制。

### 连接断开和异常登出处理

`.disconnected` 仅表示长连接当前断开，不一定表示用户已退出登录。账号异常回调表示底层 SDK 遇到不可恢复原因，并会按实现清理登录信息。常见场景如下：

| 场景 | iOS 错误码 | iOS 回调或处理方式 |
| :--- | :--- | :--- |
| Token 无效 | `EMErrorInvalidToken`（104） | 登录 completion 返回错误；获取正确 Token 后重新登录。 |
| Token 已过期 | `EMErrorTokenExpire`（108） | `tokenDidExpire(_:)`；获取新 Token 后重新登录。 |
| 用户鉴权失败 | `EMErrorUserAuthenticationFailed`（202） | `userAccountDidForced(toLogout:)`；检查用户 ID 和 Token。 |
| 用户在其他设备登录 | `EMErrorUserLoginOnAnotherDevice`（206） | `userAccountDidLoginFromOtherDevice(with:)`。 |
| 用户账号被服务端删除 | `EMErrorUserRemoved`（207） | `userAccountDidRemoveFromServer()`；先处理账号状态。 |
| 用户已绑定其他设备 | `EMErrorUserBindAnotherDevice`（213） | 登录 completion 返回错误；根据设备绑定策略处理。 |
| 登录设备数超过限制 | `EMErrorUserLoginTooManyDevices`（214） | `userAccountDidForced(toLogout:)`；先处理设备数量限制。 |
| 用户修改密码后被踢下线 | `EMErrorUserKickedByChangePassword`（216） | `userAccountDidForced(toLogout:)`；重新获取 Token 后登录。 |
| 用户被其他设备、API 或控制台强制退出 | `EMErrorUserKickedByOtherDevice`（217） | `userAccountDidForced(toLogout:)`；按业务策略提示并重新登录。 |
| 登录设备发生变化 | `EMErrorUserDeviceChanged`（220） | `userAccountDidLoginFromOtherDevice(with:)`；根据设备策略处理。 |
| DAU 或 MAU 达到上限 | `EMErrorAppActiveNumbersReachLimitation`（8） | `userAccountDidForced(toLogout:)`；检查应用配额或联系商务。 |
| 服务被禁用 | `EMErrorServerServingForbidden`（305） | `userDidForbidByServer()`；检查服务开通及应用状态。 |

当其他设备登录或设备发生变化时，`EMLoginExtensionInfo` 可提供新登录设备的 `deviceName` 和 `extensionInfo`，应用可据此展示更明确的提示。

### Token 生命周期

SDK 会根据登录 Token 的有效期触发以下回调：

- `tokenWillExpire(_:)`：Token 剩余约 20% 有效期时触发。
- `tokenDidExpire(_:)`：Token 已过期时触发，当前实现会执行登出。

收到 `tokenWillExpire(_:)` 后，应从应用服务器获取新 Token，并调用异步 `renewToken(_:completion:)`：

```swift
EMClient.shared().renewToken("newToken") { error in
    if let error {
        print("Token 更新失败：\(error.errorDescription)")
    } else {
        print("Token 更新成功")
    }
}
```

如果已经触发 `tokenDidExpire(_:)`，应获取新 Token 后重新调用 `login(withUsername:token:completion:)`，不要继续依赖自动重连。

### 离线消息和业务数据同步

登录成功或连接恢复后，如果服务端存在离线消息，SDK 会自动同步。通过 `onOfflineMessageSyncStart()` 和 `onOfflineMessageSyncFinish()` 监听离线消息同步过程。

会话、好友和已加入群组等数据的登录后自动同步状态，则通过 `syncDataStart(with:)` 和 `syncDataFinished(_:type:)` 监听。业务数据同步类型由初始化前设置的 `EMOptions.dataSyncType` 决定。两类同步回调含义不同，不应混用。

## 最佳实践

- 在调用 Token 登录接口前注册 `EMClientDelegate`，避免遗漏连接、Token 和同步状态回调。
- iOS SDK 不再依赖自动登录；应用启动或需要建立 IM 会话时应显式登录。
- 弱网断开后不要立即重复调用登录接口；可恢复场景由 SDK 自动重连。
- 使用 `isConnected` 查询当前连接状态，使用 `isLoggedIn` 查询登录状态，并优先以代理回调驱动 UI 更新。
- 收到 `tokenWillExpire(_:)` 后尽快续期 Token；收到 `tokenDidExpire(_:)` 后获取新 Token 并重新登录。
- 使用账号异常回调处理设备、账号和服务限制，并根据 `EMError.code` 给出明确提示。
- 不再需要监听时调用 `removeDelegate(_:)`，避免重复回调。
- 使用自定义回调队列时，不要直接更新 UI 或执行耗时操作。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`initializeSDKWithOptions`](#连接生命周期) | `EMClient` | 初始化 iOS SDK，Swift 调用为 `initializeSDK(with:)`。 |
| [`loginWithUsername`](#连接生命周期) | `EMClient` | 使用用户 ID 和 Token 显式登录并建立连接。 |
| [`logout`](#连接生命周期) | `EMClient` | 主动登出并关闭当前连接。 |
| [`isConnected`](#获取连接状态) | `EMClient` | 查询 SDK 当前是否已连接到服务器。 |
| [`isLoggedIn`](#获取连接状态) | `EMClient` | 查询当前用户是否已登录聊天服务器。 |
| [`renewToken`](#token-生命周期) | `EMClient` | 异步更新当前登录用户的 Token。 |
