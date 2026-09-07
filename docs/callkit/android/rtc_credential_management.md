# 自定义 RTC 凭证接入

## 概述

默认情况下，CallKit 使用声网提供的 RTC 凭证体系，即登录即时通讯 IM 后，由 IM SDK 自动下发 RTC AppId、Token、UID 以及 UID 和 IM 用户 ID（`userId`）的映射关系。你只需通过 `CallKitClient.init(context, callKitConfig)` 完成初始化即可。

**如果你已有自己的声网 App ID，并希望在自己的应用服务端独立签发 RTC Token、自行维护 IM userId 与 RTC UID 的映射关系**，你可以使用 `RTCConfigProvider` 接口进行自定义配置。源码详见 [RTCConfigProvider.kt](https://github.com/easemob/easemob-callkit-android/blob/409cb85eee2b1dd77d5f3098d53efd5c7b9445ef/ease-call-kit/src/main/java/com/hyphenate/callkit/interfaces/RTCConfigProvider.kt)。

你可根据业务场景选择 CallKit 的两种凭证管理方式：

| 项 | 默认方式 | `RTCConfigProvider` |
| :--- | :-------- | :-------- |
| **RTC App ID** | 从 IM SDK 初始化配置 `EMClient.getInstance().options.appId` 读取 | 由你的应用通过 `RTCConfigProvider.onSyncGetAppId()` 提供 |
| **RTC Token / UID** | 登录后向 IM SDK 请求下发 | 由你的应用服务端通过 `RTCConfigProvider.onAsyncFetchRtcToken(channelName, callback)` 签发 |
| **声网 UID 与 IM 用户 ID（`userId`）的映射** | 依赖 IM SDK 内置映射 | 由你的应用服务端通过 `RTCConfigProvider.onAsyncFetchUserIdByUid(uids, callback)` 维护 |

:::tip
同一个 RTC 引擎生命周期内不能更换 App ID。如需更换 Provider 或 RTC App ID，应先结束当前通话，确保 RTC 引擎销毁，并在下一次通话开始前完成配置。

`RTCConfigProvider` 的三个方法均可返回 `null`，此时 CallKit 会分别回退到 IM SDK 的默认实现。但如果自定义 RTC App ID 与默认 RTC App ID 不同，回退得到的 Token 可能与当前 App ID 不匹配，因此不应把返回 `null` 作为始终可用的容错方案。
:::

## API

`RTCConfigProvider` 提供以下三个可选方法，用于自定义 RTC 凭证管理。不实现某个方法或采用其默认实现时，该方法会返回 `null`，CallKit 将对相应配置使用 IM SDK 的默认实现。

:::warning
**异步 API 回调要求**：<br/>
`onAsyncFetchRtcToken(channelName, callback)` 和 `onAsyncFetchUserIdByUid(uids, callback)` 内部均以协程挂起等待结果，**必须保证 callback 被调用**，否则对应流程会一直卡住。
:::

**onSyncGetAppId()**

- **说明：** 同步提供你的声网 App ID（不是 IM App ID），勿做耗时操作，并保证实现可重复调用且幂等。
- **调用时机：** 发起呼叫前检查 App ID 时，以及创建 RTC 引擎时；后续通话重新创建引擎时可能再次调用。
- **回退逻辑（返回 `null` 时）：** 使用 IM SDK 配置中的 App ID。
- **返回值约束：** 返回有效的 RTC App ID 字符串。该方法必须轻量、同步，并支持重复调用。

**onAsyncFetchRtcToken(channelName, callback)**

- **说明：** 异步提供 RTC Token，通过 `callback(EMRTCTokenInfo?)` 返回结果。`channelName` 为非空值时，服务端必须签发与该频道匹配的 Token。
- **调用时机：** 加入 RTC 频道前；RTC SDK 触发 `onTokenPrivilegeWillExpire` 或 `onRequestToken` 时。
- **回退逻辑（返回 `null` 时）：** 使用 IM SDK 的内部缓存或获取逻辑。
- **返回值约束：**
  - `uid` 必须大于 0，同一用户应尽量保持稳定。
  - `expireTimeStamp` 为 Unix 时间戳（秒）。CallKit 当前不读取该字段来计算续期时间；续期由 RTC SDK 的 Token 过期相关回调触发。字段取值（包括 `0` 的含义）应与服务端 Token 签发规则保持一致。
  - `rtcToken` 不能为空。

**onAsyncFetchUserIdByUid(uids, callback)**

- **说明：** 批量返回声网 UID 与 IM `userId` 的映射关系。
- **调用时机：** 通话中远端用户进房后，需要反查用户信息（头像、昵称等）时调用。
- **回退逻辑（返回 `null` 时）：** 通过 IM SDK 的 `asyncGetUserIdsWithRTCUids` 查询；返回的映射中缺少某个 UID 时，该 UID 也会使用此回退逻辑。
- **返回值约束：** 通过 `callback` 返回 `Map<Int, String>?`，键为声网 UID，值为对应的 IM `userId`。

## 接入流程

本节介绍从初始化到呼叫的流程。

### 步骤 1：通过自有 IM App ID 初始化 IM SDK

使用你的 IM App ID 初始化 IM SDK。

**不要将 RTC App ID 填入 `EMOptions`，它将在后续由 `RTCConfigProvider.onSyncGetAppId()` 单独提供。**

```kotlin
val options = EMOptions().apply {
    appId = "YOUR_IM_APP_ID"
}
EMClient.getInstance().init(context, options)
EMClient.getInstance().setDebugMode(true)
```

### 步骤 2：通过 RTCConfigProvider 初始化 CallKit

在发起第一通电话前设置 `RTCConfigProvider`。发起呼叫前和创建 RTC 引擎时，CallKit 会调用 `onSyncGetAppId()` 获取你的声网 App ID；加入 RTC 频道和 Token 续期时，会优先通过 `RTCConfigProvider` 获取所需数据。任一方法返回 `null` 时，CallKit 会对该项回退到 IM SDK 的默认实现。

:::tip
接口全路径：`com.hyphenate.callkit.interfaces.RTCConfigProvider`。
:::

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        // 初始化 IM SDK（需先完成）
        val options = EMOptions().apply {
            appId = "YOUR_IM_APP_ID"
        }
        EMClient.getInstance().init(this, options)
        EMClient.getInstance().setDebugMode(true)

        // 设置自定义 RTC 配置提供者
        CallKitClient.rtcConfigProvider = MyRTCConfigProvider()

        // 初始化 CallKit
        CallKitClient.init(this, CallKitConfig())
    }
}
```

### 步骤 3：实现 RTCConfigProvider 接口

下面给出 `RTCConfigProvider` 三个方法的组合实现示例。有关各方法的说明、调用时机、回退逻辑和返回值约束，参见 [API](#api) 章节。

```kotlin
class MyRTCConfigProvider : RTCConfigProvider {

    override fun onSyncGetAppId(): String? {
        // 返回你自己的声网 App ID，该方法必须立即返回，不能做耗时操作
        return "YOUR_AGORA_APP_ID"
    }

    override fun onAsyncFetchRtcToken(
        channelName: String?,
        callback: OnValueSuccess<EMRTCTokenInfo?>
    ) {
        // 从你的业务服务器异步获取 RTC Token
        // channelName 非空时，服务端必须签发与该频道匹配的 Token
        // 建议服务端返回：{ "uid": 123456, "token": "007eJx...", "expireTimeStamp": 1710000000 }
        val userId = EMClient.getInstance().currentUser        
        MyTokenServer.fetchRtcToken(userId,channelName)
            .onSuccess { resp ->
                callback(
                    EMRTCTokenInfo(
                        // 声网 RTC Token，由你的服务端签发
                        resp.token,
                        // Token 过期时间戳（秒）
                        resp.expireTimeStamp,
                        // 当前用户对应的声网 RTC UID，必须大于 0
                        resp.uid
                    )
                )
            }
            .onFailure { error ->
                // 返回 null 会回退到 IM SDK；使用自定义 App ID 时需确保回退 Token 与其匹配
                callback(null)
            }
    }         
    override fun onAsyncFetchUserIdByUid(
        uids: List<Int>,
        callback: OnValueSuccess<Map<Int, String>?>
    ) {
        // 从你的业务服务器查询 uid 到 IM userId 的映射关系
        // 建议服务端返回：{ "123456": "userA", "234567": "userB" }
        
        MyUserServer.queryUserIdsByUids(uids)
            .onSuccess { map ->
                callback(map)
            }
            .onFailure { error ->
                // 返回 null 或缺失部分会回退到 SDK 默认查询逻辑
                callback(null)
            }
    }
}
```

### 步骤 4：登录 IM 并发起呼叫

IM 登录仍使用 IM 用户 Token，**RTC Token 不会在登录时获取**，而是由 `RTCConfigProvider` 在进房或续期时按需回调。呼叫 API 与默认方式完全相同。

:::tip
切换账号时，应先结束当前通话并完成 IM 账号切换，不建议仅为普通账号切换而调用 `CallKitClient.cleanUp()`。如需完整释放 CallKit 资源，可调用 `CallKitClient.cleanUp()`；调用后如需继续使用 CallKit，需要重新初始化。
:::

```kotlin
EMClient.getInstance().loginWithToken(userId, imToken, object : EMCallBack {
    override fun onSuccess() {
        // IM 登录成功
    }

    override fun onError(code: Int, error: String?) {
        // 处理登录失败
    }
})

// 发起一对一音频通话
CallKitClient.startSingleCall(CallType.SINGLE_VOICE_CALL, peerUserId)

// 发起一对一视频通话
CallKitClient.startSingleCall(CallType.SINGLE_VIDEO_CALL, peerUserId)

// 发起群组通话
CallKitClient.startGroupCall(groupId)
```

## 完整示例代码

```kotlin
import android.app.Application
import com.hyphenate.callkit.CallKitClient
import com.hyphenate.callkit.CallKitConfig
import com.hyphenate.callkit.interfaces.OnValueSuccess
import com.hyphenate.callkit.interfaces.RTCConfigProvider
import com.hyphenate.chat.EMClient
import com.hyphenate.chat.EMOptions
import com.hyphenate.chat.EMRTCTokenInfo

class MyApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        // 1. 初始化 IM SDK（需先完成）
        val options = EMOptions().apply {
            appId = "YOUR_IM_APP_ID"
        }
        EMClient.getInstance().init(this, options)
        EMClient.getInstance().setDebugMode(true)

        // 2. 设置自定义 RTC 配置提供者（可选）
        CallKitClient.rtcConfigProvider = MyRTCConfigProvider()

        // 3. 初始化 CallKit
        val config = CallKitConfig().apply {
            callTimeout = 30 // 单位为秒；按需配置
            // 其他配置...
        }
        CallKitClient.init(this, config)
    }
}

/**
 * 自定义 RTC 配置提供者实现
 */
class MyRTCConfigProvider : RTCConfigProvider {

    override fun onSyncGetAppId(): String? {
        // 同步返回你的声网 App ID（不能做耗时操作）
        return "YOUR_AGORA_APP_ID"
    }

    override fun onAsyncFetchRtcToken(
        channelName: String?,
        callback: OnValueSuccess<EMRTCTokenInfo?>
    ) {
        // 从你的业务服务器异步获取 RTC Token
        Thread {
            try {
                val currentUserId = EMClient.getInstance().currentUser
                val tokenInfo = MyTokenServer.fetchRtcToken(currentUserId, channelName)
                callback(
                    EMRTCTokenInfo(
                        tokenInfo.token,
                        tokenInfo.expireTime,
                        tokenInfo.uid
                    )
                )
            } catch (e: Exception) {
                e.printStackTrace()
                // 返回 null 会回退到 IM SDK；使用自定义 App ID 时需确保回退 Token 与其匹配
                callback(null)
            }
        }.start()
    }

    override fun onAsyncFetchUserIdByUid(
        uids: List<Int>,
        callback: OnValueSuccess<Map<Int, String>?>
    ) {
        // 从你的业务服务器批量查询 uid 到 IM userId 的映射
        Thread {
            try {
                val uidToUserIdMap = MyUserServer.queryUserIdsByUids(uids)
                callback(uidToUserIdMap)
            } catch (e: Exception) {
                e.printStackTrace()
                // 返回 null 会回退到 SDK 默认查询逻辑
                callback(null)
            }
        }.start()
    }
}

/**
 * 模拟的业务服务器实现
 */
object MyTokenServer {
    fun fetchRtcToken(userId: String, channelName: String?): TokenResponse {
        // 实现你的网络请求逻辑，调用你的服务器获取 Token
        // 返回格式应为：{ "uid": 123456, "token": "007eJx...", "expireTime": 1710000000 }
        return TokenResponse(
            uid = (userId.hashCode() and Int.MAX_VALUE).coerceAtLeast(1),
            token = "your_agora_rtc_token",
            expireTime = System.currentTimeMillis() / 1000 + 24 * 3600
        )
    }
}

object MyUserServer {
    fun queryUserIdsByUids(uids: List<Int>): Map<Int, String> {
        // 实现你的网络请求逻辑，调用你的服务器查询 uid 映射
        // 返回格式应为：{ "123456": "userA", "234567": "userB" }
        return mutableMapOf<Int, String>().apply {
            uids.forEach { uid ->
                this[uid] = "user_$uid"
            }
        }
    }
}

data class TokenResponse(
    val uid: Int,
    val token: String,
    val expireTime: Long
)
```

## 常见问题

| 问题 | 解决方法 |
| --- | --- |
| 收到 `Agora App ID is null or empty` 错误 | 如果使用自定义 RTC 配置，请检查 `onSyncGetAppId()` 是否返回非空、有效的 RTC App ID，并确认已在发起通话前设置 `RTCConfigProvider`。如果该方法返回 `null` 或空字符串，CallKit 会从 IM SDK 获取 App ID；此时请确认 IM SDK 已正确初始化，且当前应用已开通 RTC 服务。 |
| 收到 `Failed to get RTC token` 错误 | 该错误表示 CallKit 最终未取得 `EMRTCTokenInfo`。请确认 `onAsyncFetchRtcToken()` 在每次调用后都调用且仅调用一次 `callback`，并返回非 `null` 的 `EMRTCTokenInfo`。如果 Provider 返回 `null`，CallKit 会回退到 IM SDK 获取 Token；回退也失败时会报此错误。 |
| 能发送通话邀请，但无法进入 RTC 频道 | 确认生成 Token 时使用的 RTC App ID、频道名称以及用户身份（UID 或 User Account）与实际加入频道时传入的参数一致，并检查 Token 是否有效或已经过期。使用自定义 RTC App ID 时，不能混用其他 RTC 项目生成的 Token。 |
| 配置 `RTCConfigProvider` 后仍然请求 IM SDK 的 RTC 接口 | `RTCConfigProvider` 按配置项生效，并不会在设置后自动接管所有 RTC 配置。当 `onSyncGetAppId()` 返回 `null` 或空字符串、`onAsyncFetchRtcToken()` 返回 `null`，或 `onAsyncFetchUserIdByUid()` 返回 `null`、未包含目标 UID 时，CallKit 会回退到 IM SDK 获取对应数据。请检查通话所需的方法是否均已实现，并返回有效、完整的数据。如果使用自定义 RTC App ID，应同时提供由同一 Agora 项目生成的 RTC Token，避免与 IM SDK 返回的 Token 混用。 |
| 多人通话中远端用户的昵称或头像未正确显示 | 首先检查 `onAsyncFetchUserIdByUid()` 返回的映射是否包含请求的 RTC UID，并确认 Map 的键为 RTC UID、值为对应的 IM 用户 ID。该方法只负责 RTC UID 到 IM 用户 ID 的映射；昵称、头像等用户资料还需由 `CallInfoProvider.asyncFetchUsers()` 正确返回。 |
| 通话过程中出现 `Failed to renew token` 错误 | 该错误仅在 RTC SDK 触发 `onRequestToken` 后，CallKit 未取得新的 `EMRTCTokenInfo` 时上报，并会结束当前通话。`onTokenPrivilegeWillExpire` 触发后获取 Token 失败时，CallKit 只记录日志，不会上报该错误或结束通话。请确认 `onAsyncFetchRtcToken()` 及时调用 `callback`，并返回适用于当前频道和当前用户身份的新 Token，不要重复返回已经过期的 Token。CallKit 不会根据 `expireTimeStamp` 主动计算续期时间，而是依赖 RTC SDK 的 Token 过期回调。 |
| 更换 RTC App ID 后配置未生效 | RTC App ID 只在 RTC 引擎创建时读取，同一个 RTC 引擎生命周期内不能更换。请先结束当前通话，并在下一次通话开始前设置新的 `RTCConfigProvider` 和 RTC App ID；下一次创建 RTC 引擎时，CallKit 会等待上一个引擎销毁完成。为避免同一次通话中的 App ID、Token 和 UID 映射来自不同配置，不建议在通话过程中更换 Provider。 |
| 切换账号后 RTC 数据异常 | 请先结束当前通话并完成 IM 账号切换，再发起新通话；同时确认自定义 `RTCConfigProvider` 或业务服务没有复用上一个账号的 Token 和用户映射。CallKit 的 IM SDK 回退 Token 缓存按当前 IM 用户 ID 隔离。`CallKitClient.cleanUp()` 属于完整资源释放操作，不建议仅为普通账号切换而调用。 |

