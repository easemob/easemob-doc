# 上传推送证书及绑定推送信息

1. 除了满足用户离线条件外，要使用第三方离线推送，你还需在[环信控制台](https://console.easemob.com/user/login)配置推送证书信息，例如，对于 FCM 推送，需配置 **证书类型** 和 **证书名称**，上传证书，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

2. 从第三方服务获取推送 token 后，将你的用户 ID 与推送证书和推送 token `deviceToken` 进行绑定。

## 上传推送证书

在第三方推送服务后台注册应用，获取应用信息，开启推送服务后，你需要在 [环信控制台](https://console.easemob.com/user/login) 上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

![img](/images/react-native/push/push_add_certificate.png)

关于各推送证书相关信息以及 [环信控制台](https://console.easemob.com/user/login)上的推送证书参数描述，详见下表中 [iOS 离线推送文档](/document/ios/push/push_overview.html)和 [Android 离线推送文档](/document/android/push/push_overview.html)中的相关链接。

| 推送服务类型      | 在推送厂商后台获取推送证书信息   | 在环信控制台上传推送证书 |
| :--------- | :----- | :------- | 
| APNs 推送       | 详见 [iOS 端 APNs 推送集成文档](/document/ios/push/push_apns.html#创建推送证书)。   | 详见 [iOS 端 APNs 推送文档](/document/ios/push/push_apns.html#上传推送证书)。   |        
| PushKit（VoIP）推送 | 在 Apple Developer 中为对应 App ID 创建 VoIP Services 证书。 | 详见 [iOS 端 APNs 推送文档](/document/ios/push/push_apns.html#上传推送证书)。上传 VoIP 证书时，Bundle ID 末尾需添加 `.voip`。 |
| FCM 推送   | 详见 [Android 端 FCM 推送集成文档](/document/android/push/push_fcm.html#fcm-推送集成)。   | 详见 [Android 端 FCM 推送集成文档](/document/android/push/push_fcm.html#步骤三-上传推送证书)。       |        
| 华为推送       | 详见 [Android 端华为推送集成文档](/document/android/push/push_huawei.html#步骤一-在华为开发者后台创建应用)。   | 详见 [Android 端华为推送集成文档](/document/android/push/push_huawei.html#步骤二-上传推送证书)。       |
| 荣耀推送       | 详见 [Android 端荣耀推送集成文档](/document/android/push/push_honor.html#步骤一-在-荣耀开发者服务平台-创建应用并申请开通推送服务)。   | 详见 [Android 端荣耀推送集成文档](/document/android/push/push_honor.html#步骤二-上传荣耀推送证书)。       |
| OPPO 推送      | 详见 [Android 端 OPPO 推送集成文档](/document/android/push/push_oppo.html#步骤一-在-oppo-开发者后台创建应用)。    | 详见 [Android 端 OPPO 推送集成文档](/document/android/push/push_oppo.html#步骤二-上传推送证书)。       |  
| vivo 推送     | 详见 [Android 端 vivo 推送集成文档](/document/android/push/push_vivo.html#步骤一-在-vivo-开发者后台创建应用)。    | 详见 [Android 端 vivo 推送集成文档](/document/android/push/push_vivo.html#步骤二-上传推送证书)。       |         
| 小米推送      |  详见 [Android 端小米推送集成文档](/document/android/push/push_xiaomi.html#步骤一-在小米开放平台创建应用)。    | 详见 [Android 端小米推送集成文档](/document/android/push/push_xiaomi.html#步骤二-上传推送证书)。       | 
| 魅族推送       | 详见 [Android 端魅族推送集成文档](/document/android/push/push_meizu.html#步骤一-在魅族开发者后台创建应用)。    | 详见 [Android 端魅族推送集成文档](/document/android/push/push_meizu.html#步骤二-上传推送证书)。       |   

## 配置 iOS 推送证书名称

自 Flutter SDK 4.25.0 起，你可以在初始化 SDK 时配置 iOS 的 APNs 与 PushKit 推送证书名称：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  apnsCertName: 'apns_certificate_name',
  pushKitCertName: 'pushkit_certificate_name',
);

await ChatClient.getInstance.init(options);
```

- `apnsCertName`：APNs 推送证书名称，用于 iOS 离线推送。
- `pushKitCertName`：PushKit 推送证书名称，用于 iOS VoIP 推送。调用 `bindPushKitToken` 前需完成该配置。

这两个参数仅对 iOS 生效，其他平台会忽略。证书名称必须与环信控制台中配置的名称一致，并且必须在 SDK 初始化时设置，运行期间不可修改。

## 管理推送 Token

### 绑定普通推送 Token

调用 `bindDeviceToken` 方法将你的用户 ID 与推送证书和推送 token `deviceToken` 进行绑定。绑定推送信息前，你需要自行实现如何从第三方服务获取推送 token。

推送 token `deviceToken` 是第三方推送服务提供的推送 token。例如，对于 FCM 推送来说，初次启动你的应用时，FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。该 token 用于标识每台设备上的每个应用，FCM 通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。你可以调用 `await FirebaseMessaging.instance.getToken()` 方法获得 token。另外，如果退出即时通讯 IM 登录时不解绑 device token（调用 `logout` 方法时将 `unbindDeviceToken` 参数传 `false`），用户在推送证书有效期和 token 有效期内仍会接收到离线推送通知。

在 iOS 上，`notifierName` 表示 APNs 证书名称。传入非空值时，该值的优先级高于初始化时设置的 `ChatOptions.apnsCertName`。在 Android 上，`notifierName` 表示对应厂商的推送凭据，不能为空。

```dart
try {
  await ChatClient.getInstance.pushManager.bindDeviceToken(
    notifierName: notifierName,
    deviceToken: deviceToken,
  );
} on ChatError catch (e) {
  debugPrint('bindDeviceToken error: $e');
}
```

### 绑定 PushKit Token

自 Flutter SDK 4.25.0 起，支持调用 `bindPushKitToken` 将当前用户与 PushKit token 绑定，用于 iOS VoIP 推送。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

调用该方法前，需完成以下操作：

1. 在初始化 SDK 时通过 `ChatOptions.pushKitCertName` 配置 PushKit 证书名称。
2. 通过 `PKPushRegistry` 获取 PushKit token，并将其转换为十六进制字符串。

```dart
try {
  await ChatClient.getInstance.pushManager.bindPushKitToken(
    deviceToken: pushKitToken,
  );
} on ChatError catch (e) {
  debugPrint('bindPushKitToken error: $e');
}
```

原生 SDK 会先缓存 token，再尝试执行绑定。如果当前用户尚未登录，本次调用会抛出 `ChatError`，但 token 已被缓存；下次登录成功后，SDK 会自动完成绑定。

### 解绑 PushKit Token

自 Flutter SDK 4.25.0 起，支持调用 `unbindPushKitToken` 单独解绑当前用户的 PushKit token。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

```dart
try {
  await ChatClient.getInstance.pushManager.unbindPushKitToken();
} on ChatError catch (e) {
  debugPrint('unbindPushKitToken error: $e');
}
```

调用 `ChatClient.getInstance.logout(true)` 退出登录时，会同时解绑普通推送 token 和 PushKit token。因此，只有在当前用户保持登录状态且需要单独解绑 PushKit token 时，才需要调用 `unbindPushKitToken`。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`apnsCertName`](#配置-ios-推送证书名称) | `ChatOptions` | 配置 iOS APNs 推送证书名称。 |
| [`pushKitCertName`](#配置-ios-推送证书名称) | `ChatOptions` | 配置 iOS PushKit 推送证书名称。 |
| [`bindDeviceToken`](#绑定普通推送-token) | `ChatPushManager` | 绑定普通推送 token。 |
| [`bindPushKitToken`](#绑定-pushkit-token) | `ChatPushManager` | 绑定 iOS PushKit token。 |
| [`unbindPushKitToken`](#解绑-pushkit-token) | `ChatPushManager` | 解绑 iOS PushKit token。 |

