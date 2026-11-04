# 上传推送证书及绑定推送信息

1. 在 [环信控制台](https://console.easemob.com/user/login) 为应用配置推送证书或厂商凭据，并确保与客户端使用的推送项目、应用及环境一致。控制台配置可以在客户端初始化和登录前完成。

2. 完成客户端推送配置并获取第三方服务的推送 Token 后，在 IM 登录成功后调用绑定接口，将当前用户与推送证书和设备 Token 进行绑定。iOS 的推送证书名称需在 SDK 初始化时配置，Android 的厂商推送凭据在绑定时传入。

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

你可以在初始化 SDK 时配置 iOS 的 APNs 与 PushKit 推送证书名称：

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

在 IM 登录成功且取得推送 Token 后，调用 `ChatPushManager.bindDeviceToken` 将当前用户与推送证书和推送 Token `deviceToken` 进行绑定。绑定推送信息前，你需要自行实现如何从第三方服务获取推送 Token。

推送 Token（Device Token）是第三方推送服务为应用实例生成的标识，用于将通知投递至目标设备上的应用。它与 `loginWithToken` 使用的 IM 用户登录 Token 不同，不能混用。Flutter IM SDK 不提供推送 Token 的获取接口，需由应用接入对应推送服务并获取：

- Android：获取所用厂商推送服务返回的 Token。以 FCM 为例，应用初次启动时，FCM SDK 会生成注册令牌（registration token）；若已集成 `firebase_messaging` 插件，可通过 `await FirebaseMessaging.instance.getToken()` 获取 FCM Token。
- iOS：普通 APNs 推送应获取 APNs Device Token，不能用 FCM 注册令牌或 PushKit Token 代替。

Token 获取及原生工程配置可参考 [Android FCM 推送集成文档](/document/android/push/push_fcm.html#步骤四-fcm-推送集成) 和 [iOS APNs 推送集成文档](/document/ios/push/push_apns.html)。Flutter V5 的证书配置与 Token 绑定调用以本文为准。

绑定时，`notifierName` 的传入要求如下：

- Android：`notifierName` 必须传入对应厂商的推送凭据，不能为空，也不能传入任意证书别名、`"fcm"` 或 `"huawei"` 等厂商标识字符串。取值见下表。
- iOS：`notifierName` 被忽略，绑定普通 APNs Token 时无需传入。SDK 使用初始化时通过 `ChatOptions.apnsCertName` 配置的证书名称，详见 [配置 iOS 推送证书名称](#配置-ios-推送证书名称)。

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

```dart
try {
  await ChatClient.getInstance.pushManager.bindDeviceToken(
    // Android：传入上表中对应厂商的推送凭据；iOS：省略此参数。
    notifierName: notifierName,
    deviceToken: deviceToken,
  );
} on ChatError catch (e) {
  debugPrint('bindDeviceToken error: $e');
}
```

若在 IM 登录前已获取推送 Token，可先保存该 Token，在登录成功后再调用 `bindDeviceToken`。Token 发生变化后，应在用户已登录的状态下重新调用该接口绑定最新 Token。

退出 IM 登录时，可通过 `ChatClient.logout` 的可选位置参数 `unbindDeviceToken` 控制是否解绑设备 Token，该参数不是命名参数：

- `ChatClient.getInstance.logout()` 或 `ChatClient.getInstance.logout(true)`：解绑设备 Token，默认行为。
- `ChatClient.getInstance.logout(false)`：不解绑设备 Token。在推送证书和 Token 有效且满足离线推送条件时，用户仍可收到离线推送通知，详见 [离线推送概述](push_overview.html)。

### 绑定 PushKit Token

Flutter SDK 自 5.0.0 起支持调用 `bindPushKitToken` 将当前用户与 PushKit Token 绑定，用于 iOS VoIP 推送。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

VoIP 推送使用独立于普通 APNs 推送的证书和 Token；`bindDeviceToken` 不用于绑定 PushKit Token。

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

Flutter SDK 支持调用 `unbindPushKitToken` 单独解绑当前用户的 PushKit token。该方法仅在 iOS 上生效，其他平台调用时不做任何处理。

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

