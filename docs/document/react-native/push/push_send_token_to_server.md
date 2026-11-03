# 发送推送 Token 到环信服务器

在 IM 登录成功且取得推送 Token 后，应用需将当前用户与推送证书和设备 Token 绑定至环信服务器。Token 的获取方式见 [获取或更新推送 Token](push_get_device_token.html)，证书上传和 iOS 初始化配置见 [上传推送证书](push_easemob_console.html)。

推送 Token（Device Token）由第三方推送服务生成，与 `ChatClient#loginWithToken` 使用的 IM 用户登录 Token 不同，不能混用。React Native SDK 不依赖特定推送插件，应用可使用已集成的推送方案获取 Token。

## 前提条件

1. 已在项目中 [集成 SDK](/document/react-native/integration.html)，并在环信控制台配置与当前应用及推送环境匹配的证书或厂商凭据。
2. 已完成推送服务的原生工程配置。Android 的厂商推送依赖、Manifest 和 `EMPushConfig` 初始化需在原生工程侧完成；iOS 的证书名称需在 IM SDK 初始化时设置，详见 [配置 iOS 推送证书名称](push_easemob_console.html#配置-ios-推送证书名称)。
3. 当前用户已通过 IM 用户 Token 登录，且已获取本设备上应用的推送 Token。

## 管理推送 Token

### 绑定普通推送 Token

在 IM 登录成功且取得推送 Token 后，调用 `ChatClient#bindDeviceToken` 将当前用户与推送证书和推送 Token `deviceToken` 进行绑定。绑定推送信息前，你需要自行实现如何从第三方服务获取推送 Token。

- Android：获取所用厂商推送服务返回的 Token。以 FCM 为例，应用接入 FCM SDK 后，通过其 Token 获取接口或更新回调取得注册令牌。
- iOS：普通 APNs 推送应获取 APNs Device Token，并以十六进制字符串传入，不能用 FCM 注册令牌或 PushKit Token 代替。

绑定时，`notifierName` 的传入要求如下：

- Android：`notifierName` 必须传入对应厂商的推送凭据，不能为空，也不能传入任意证书别名、`"fcm"` 或 `"huawei"` 等厂商标识字符串。取值见下表。
- iOS：`notifierName` 被忽略，绑定普通 APNs Token 时无需传入。SDK 使用初始化时通过 `ChatOptions.apnsCertName` 配置的证书名称，详见 [配置 iOS 推送证书名称](push_easemob_console.html#配置-ios-推送证书名称)。

Android 各推送服务的 `notifierName` 取值如下：

| 推送服务 | `notifierName` 取值 |
| :--- | :--- |
| Google FCM | Sender ID。 |
| 华为 HMS | App ID。 |
| 荣耀 | App ID。 |
| 小米 | App ID。 |
| OPPO | App Key。 |
| VIVO | `App ID` 与 `App Key` 以 `#` 连接，即 `appId#appKey`。 |
| 魅族 | App ID。 |

以下示例中，`deviceToken` 为第三方服务返回的推送 Token；`notifierName` 为 Android 对应厂商的推送凭据，iOS 可省略该参数。接口返回 `Promise<void>`，成功完成表示绑定完成：

```typescript
async function bindPushToken(
  deviceToken: string,
  notifierName?: string
): Promise<void> {
  try {
    // 绑定当前设备的普通推送 Token；Android 必须传入厂商推送凭据
    await ChatClient.getInstance().bindDeviceToken({
      notifierName,
      deviceToken,
    });
    console.log('普通推送 Token 绑定成功');
  } catch (error: unknown) {
    console.error('绑定普通推送 Token 失败：', error);
  }
}
```

若在 IM 登录前已获取推送 Token，可先保存该 Token，在登录成功后再调用 `bindDeviceToken`。Token 发生变化后，应在用户已登录的状态下重新调用该接口绑定最新 Token。切换账号时，应在新账号登录成功后为其绑定当前设备的 Token。

### 登出时是否解绑推送 Token

退出 IM 登录时，可通过 `ChatClient#logout` 的可选位置参数 `unbindDeviceToken` 控制是否解绑设备 Token，默认为 `true`：

- `ChatClient.getInstance().logout()` 或 `ChatClient.getInstance().logout(true)`：退出登录并解绑设备 Token。iOS 的配置限制见下方注意事项。
- `ChatClient.getInstance().logout(false)`：退出登录但不解绑设备 Token。在推送证书和 Token 有效且满足离线推送条件时，用户仍可收到离线推送通知，详见 [离线推送概述](1_push_overview.html)。

```typescript
try {
  // 退出登录并请求解绑设备 Token；true 为默认值
  await ChatClient.getInstance().logout(true);
} catch (error: unknown) {
  console.error('退出登录失败：', error);
}
```

在 iOS 端，当前用户已登录且初始化时已配置 `ChatOptions.apnsCertName` 的情况下，调用 `ChatClient#logout(true)` 会依次解绑普通推送 Token 和 PushKit Token，然后退出登录。任一步解绑失败，都会中断后续登出流程。

// TODO：研发确认
:::notice
React Native SDK 5.x 的 iOS 端未配置 `ChatOptions.apnsCertName` 时，登出会跳过 Token 解绑，即使 `unbindDeviceToken` 为 `true`。若仅使用 PushKit 推送且需要在登出时解绑，请先调用 `ChatClient#unbindPushKitToken`，确认成功后再退出登录。
:::

### 绑定 PushKit Token

React Native SDK 支持调用 `ChatClient#bindPushKitToken` 将当前用户与 PushKit Token 绑定，用于 iOS VoIP 推送。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

VoIP 推送使用独立于普通 APNs 推送的证书和 Token；`bindDeviceToken` 不用于绑定 PushKit Token。

调用该方法前，需完成以下操作：

1. 在初始化 SDK 时通过 `ChatOptions.pushKitCertName` 配置 PushKit 证书名称。
2. 通过 `PKPushRegistry` 获取 PushKit Token，并将其转换为十六进制字符串，详见 [获取 PushKit Token](push_get_device_token.html#获取-pushkit-token)。

以下示例中，`pushKitToken` 为上述步骤获取的十六进制字符串：

```typescript
async function bindVoipToken(pushKitToken: string): Promise<void> {
  try {
    // 绑定当前用户的 PushKit Token，仅 iOS 生效
    await ChatClient.getInstance().bindPushKitToken({
      deviceToken: pushKitToken,
    });
  } catch (error: unknown) {
    console.error('绑定 PushKit Token 失败：', error);
  }
}
```

原生 SDK 会先缓存有效的 Token，再尝试执行绑定。如果当前用户尚未登录，本次调用会失败，但 Token 已被缓存；下次登录成功后，SDK 会自动尝试绑定。

### 解绑 PushKit Token

调用 `ChatClient#unbindPushKitToken` 可单独解绑当前用户的 PushKit Token，无需退出登录。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

```typescript
try {
  // 在保持登录状态时，单独解绑 PushKit Token
  await ChatClient.getInstance().unbindPushKitToken();
} catch (error: unknown) {
  console.error('解绑 PushKit Token 失败：', error);
}
```

## 验证绑定结果

绑定接口成功只表示 Token 绑定完成，不保证所有场景都会展示通知。验证时，使用另一账号发送消息，确保接收方满足 [离线推送条件](1_push_overview.html)，并检查设备通知权限、通知渠道、推送通知方式及免打扰设置。不要将杀死应用作为接收离线推送的唯一前提。

若绑定失败，先检查初始化和登录状态、Token 来源及格式、Android 的厂商凭据或 iOS 的证书名称。若绑定成功但未收到通知，再核对控制台证书、包名或 Bundle ID、推送环境、设备推送服务和网络状态。

## 接口列表

| API 名称 | 所属模块/类 | 返回类型 | 说明 |
| :--- | :--- | :--- | :--- |
| [`bindDeviceToken`](#绑定普通推送-token) | `ChatClient` | `Promise<void>` | 绑定普通推送 Token。 |
| [`logout`](#登出时是否解绑推送-token) | `ChatClient` | `Promise<void>` | 退出登录，可控制是否解绑设备 Token。 |
| [`bindPushKitToken`](#绑定-pushkit-token) | `ChatClient` | `Promise<void>` | 绑定 iOS PushKit Token。 |
| [`unbindPushKitToken`](#解绑-pushkit-token) | `ChatClient` | `Promise<void>` | 解绑 iOS PushKit Token。 |
| [`apnsCertName`](push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 配置 iOS APNs 证书名称。 |
| [`pushKitCertName`](push_easemob_console.html#配置-ios-推送证书名称) | `ChatOptions` | `string \| undefined` | 配置 iOS PushKit 证书名称。 |
