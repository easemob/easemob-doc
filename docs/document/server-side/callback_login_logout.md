# 用户状态变更回调事件

## 功能说明

当用户的在线或离线状态发生变更时，IM 服务器会向你的 App Server 同步用户的最新状态及变更原因。

用户状态变更的原因说明如下：

| 变更原因 | 说明 |
| :--- | :--- |
| 登录（`login`） | 用户上线。 |
| 登出（`logout`） | 用户离线。 |
| 被踢（`replaced`） | 用户被其他设备踢下线或被服务端强制下线。 |

回调请求的响应规则和重试机制，详见 [发送后回调](callback_postsending.html)。

## 状态变更感知的实时性

#### Android/iOS/HarmonyOS/Flutter/React Native 

用户可实时感知用户状态变化：

- 用户登录成功，状态变成在线；
- 用户登出成功，状态变成离线。若调用登出接口时，设置了解绑推送 token（device token），则用户无法收到离线推送通知；若不解绑，则用户可以收到离线推送通知。
- 用户主动杀掉客户端进程或用户将 App 切后台后进程被设备的操作系统杀掉，状态变成离线。
- 当网络不可用，例如，用户打开移动设备飞行模式或进入无网络的隧道，环信即时通讯 IM 服务端等待 5 分钟后发现心跳包超时，用户状态会变成离线。

#### Web

用户成功登录 Web 端时，环信服务器可以实时感知到状态变成在线：

- 直接关闭页面，可以实时感知，状态变成离线。
- 页面不关闭时，网络断开，需要 5 分钟左右才能感知到，状态变成离线。
- 主动调用 `close` 接口，可以实时感知，变成离线。
- 当网络不可用，例如，用户打开移动设备飞行模式或进入无网络的隧道，环信即时通讯 IM 服务端等待 5 分钟后发现心跳包超时，用户状态会变成离线。

#### 小程序

用户成功登录小程序端时，环信服务器可以实时感知到状态变成在线：

- 点右上角退出，5s 内感知到状态变成离线。
- 断网(如手机开启飞行模式) ，需要 5 分钟左右 感知到状态变成离线。
- 微信切后台，30s 左右状态变成离线。
- 杀掉微信进程，可以实时感知，变成离线。
- 主动调用 `close` 接口，可以实时感知，变成离线。
- 当网络不可用，例如，用户打开移动设备飞行模式或进入无网络的隧道，环信即时通讯 IM 服务端等待 5 分钟后发现心跳包超时，用户状态会变成离线。

#### Unity/Windows

用户可实时感知用户状态变化：

- 用户登录成功，状态变成在线；
- 用户登出成功，状态变成离线。
- 用户主动杀掉客户端进程或用户将 App 切后台后进程被设备的操作系统杀掉，状态变成离线。
- 当网络不可用，例如，用户打开移动设备飞行模式或进入无网络的隧道，环信即时通讯 IM 服务端等待 5 分钟后发现心跳包超时，用户状态会变成离线。

## 回调时机

1. 客户端和即时通讯 IM 服务端成功建立了网络连接。
2. 用户从客户端成功登出环信即时通讯 IM。
3. 用户主动关闭客户端网络。
4. 客户端网络完全不可用，例如，进入没有网络信号的隧道或打开移动设备的飞行模式，环信即时通讯 IM 服务端等待 5 分钟后发现心跳包超时，状态会变成离线。
5. 用户主动杀掉 App 进程，或者将 App 切后台后进程后被设备的操作系统杀掉，或者 crash 导致进程异常退出。
6. 用户被从 [单设备](/document/server-side/account_offline_device_single.html) 或 [所有登录设备强制下线](/document/server-side/account_offline_forced.html)。该操作可由 [客户端](/document/android/multi_device.html#强制指定账号从单个设备下线)、[服务端](/document/server-side/account_offline_device_single.html) 或 [环信控制台](/product/console/operation_user.html#强制下线) 发起。
7. 单设备登录场景下，后登录的设备将之前登录的设备踢下线。
8. [多设备登录](/document/android/multi_device.html) 时达到了登录设备数量的上限，新登录的设备将之前登录的设备踢下线。多端登录时，IM 每端默认最多支持 4 个设备同时在线。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调请求

### 请求示例

用户登录、登出或被踢下线时，环信 IM 服务器会向你的 App Server 发送状态变更回调。三种回调的请求字段结构相同，区别仅在于 `reason` 和 `status` 字段的值。

**用户登录（`reason` = `login`，`status` = `online`）**

```json
{
    "callId":"XXXX#XXXX_25b64a81-1376-4669-bb3d-178449a8f11b",
    "reason":"login",
    "security":"2c6dd77e61b8f26801627fdaadca893e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642585154644,
    "status":"online"
}
```

**用户登出（`reason` = `logout`，`status` = `offline`）**

```json
{
    "callId":"XXXX#XXXX_25b54a81-1376-4669-bb3d-178339a8f11b",
    "reason":"logout",
    "security":"2c7dd77e61b8f26801627fdaadca987e",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642648914742,
    "status":"offline"
}
```

**用户被踢下线（`reason` = `replaced`，`status` = `offline`）**

```json
{
    "callId":"XXXX#XXXX_260ae3eb-ba31-4f01-9a62-8b3b05f3a16c",
    "reason":"replaced",
    "security":"0ac500b1a1e44fe76dbfdc664cbaa76b",
    "os":"ios",
    "ip":"223.71.97.198:52709",
    "host":"msync@ebs-ali-beijing-msync40",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX@easemob.com/ios_a5fa01fd-b5a4-84d5-ebeb-bf10e8950442",
    "name":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642648955563,
    "status":"offline"
}
```

### 请求字段说明

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | 回调请求的唯一标识，格式为 `App Key_UUID`。              |
| `reason`    | String   | 状态变更原因，取值：`login`（登录）、`logout`（登出）、`replaced`（被踢下线）。 |
| `security`  | String   | 签名，格式为 `MD5(callId + secret + timestamp)`。`secret` 见 [控制台回调规则配置](/product/console/basic_webhook.html#配置消息回调规则)。 |
| `os`        | String   | 设备操作系统类型。                                           |
| `ip`        | String   | 用户登录的 IP 地址。                                         |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 环信控制台注册的应用唯一标识。                               |
| `user`      | String   | 状态变更用户的唯一标识。格式为 `{appkey}_{username}@easemob.com/{os}_{deviceId}`，其中 `@easemob.com` 为固定后缀，`deviceId` 由 SDK 随机生成。 |
| `name`      | String   | 状态变更用户的用户名，对应 `user` 字段中的 `{username}` 部分。                                   |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | Long     | 请求到达 IM 服务器的 UNIX 时间戳，单位为毫秒。               |
| `status`    | String   | 变更后的状态，取值：`online`（在线）或 `offline`（离线）。   |
