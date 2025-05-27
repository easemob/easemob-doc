# 上传推送证书及绑定推送信息

1. 除了满足用户离线条件外，要使用第三方离线推送，你还需在[环信即时通讯云控制台](https://console.easemob.com/user/login)配置推送证书信息，例如，对于 FCM 推送，需配置**证书类型**和**证书名称**，上传证书，并调用客户端 SDK 提供的 API 向环信服务器上传 device token。

2. 从第三方服务获取推送 token 后，将你的用户 ID 与推送证书和推送 token `deviceToken` 进行绑定。

## 上传推送证书

在第三方推送服务后台注册应用，获取应用信息，开启推送服务后，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

![img](/images/react-native/push/push_add_certificate.png)

关于各推送证书相关信息以及[环信即时通讯云控制台](https://console.easemob.com/user/login)上的推送证书参数描述，详见下表中 [iOS 离线推送文档](/document/ios/push/push_overview.html)和 [Android 离线推送文档](/document/android/push/push_overview.html)中的相关链接。

| 推送服务类型      | 在推送厂商后台获取推送证书信息   | 在环信即时通讯控制台上传推送证书 |
| :--------- | :----- | :------- | 
| APNs 推送       | 详见 [iOS 端 APNs 推送集成文档](/document/ios/push/push_apns.html#创建推送证书)。   | 详见 [iOS 端 APNs 推送文档](/document/ios/push/push_apns.html#上传推送证书)。   |        
| FCM 推送   | 详见 [Android 端 FCM 推送集成文档](/document/android/push/push_fcm.html#fcm-推送集成)。   | 详见 [Android 端 FCM 推送集成文档](/document/android/push/push_fcm.html#步骤三-上传推送证书)。       |        
| 华为推送       | 详见 [Android 端华为推送集成文档](/document/android/push/push_huawei.html#步骤一-在华为开发者后台创建应用)。   | 详见 [Android 端华为推送集成文档](/document/android/push/push_huawei.html#步骤二-在环信即时通讯云控制台上传推送证书)。       |      
| 荣耀推送       | 详见 [Android 端荣耀推送集成文档](/document/android/push/push_honor.html#步骤一-在荣耀开发者服务平台创建应用并申请开通推送服务)。   | 详见 [Android 端荣耀推送集成文档](/document/android/push/push_honor.html#步骤二-在环信即时通讯云控制台上传荣耀推送证书)。       | 
| OPPO 推送      | 详见 [Android 端 OPPO 推送集成文档](/document/android/push/push_oppo.html#步骤一-在-oppo-开发者后台创建应用)。    | 详见 [Android 端 OPPO 推送集成文档](/document/android/push/push_oppo.html#步骤二-上传推送证书)。       |  
| vivo 推送     | 详见 [Android 端 vivo 推送集成文档](/document/android/push/push_vivo.html#步骤一-在-vivo-开发者后台创建应用)。    | 详见 [Android 端 vivo 推送集成文档](/document/android/push/push_vivo.html#步骤二-上传推送证书)。       |         
| 小米推送      |  详见 [Android 端小米推送集成文档](/document/android/push/push_xiaomi.html#步骤一-在小米开放平台创建应用)。    | 详见 [Android 端小米推送集成文档](/document/android/push/push_xiaomi.html#步骤二-上传推送证书)。       | 
| 魅族推送       | 详见 [Android 端魅族推送集成文档](/document/android/push/push_meizu.html#步骤一-在魅族开发者后台创建应用)。    | 详见 [Android 端魅族推送集成文档](/document/android/push/push_meizu.html#步骤二-上传推送证书)。       |   

## 绑定推送信息

调用 `bindDeviceToken` 方法将你的用户 ID 与推送证书和推送 token `deviceToken` 进行绑定。绑定推送信息前，你需要自行实现如何从第三方服务获取推送 token。

推送 token `deviceToken` 是第三方推送服务提供的推送 token。例如，对于 FCM 推送来说，初次启动你的应用时，FCM SDK 为客户端应用实例生成的注册令牌 (registration token)。该 token 用于标识每台设备上的每个应用，FCM 通过该 token 明确消息是发送给哪个设备的，然后将消息转发给设备，设备再通知应用程序。你可以调用 `await FirebaseMessaging.instance.getToken()` 方法获得 token。另外，如果退出即时通讯 IM 登录时不解绑 device token（调用 `logout` 方法时对 `unbindToken` 参数传 `false` 时不解绑 device token，传 `true` 表示解绑 token），用户在推送证书有效期和 token 有效期内仍会接收到离线推送通知。

```dart
    try {
    // notifierName: 对应平台在环信后台的推送证书名称
    // deviceToken: 推送token
    EMClient.getInstance.pushManager.bindDeviceToken(
        notifierName: notifierName,
        deviceToken: deviceToken,
    );
    } catch (e) {
    debugPrint("bindDeviceToken error: $e");
    }
```



