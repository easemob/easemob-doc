# 在环信控制台上传证书

在第三方推送服务后台注册应用，获取应用信息，开启推送服务后，你需要在[环信控制台](https://console.easemob.com/user/login)上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

![img](/images/react-native/push/push_add_certificate.png)

关于各推送证书相关信息以及[环信控制台](https://console.easemob.com/user/login)上的推送证书参数描述，详见下表中 [iOS 离线推送文档](/document/ios/push/push_overview.html)和 [Android 离线推送文档](/document/android/push/push_overview.html)中的相关链接。

| 推送服务类型      | 在推送厂商后台获取推送证书信息   | 在环信控制台上传证书 |
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

自 React Native SDK 1.21.0 起，你可以在初始化 SDK 时配置 iOS 的 APNs 与 PushKit 推送证书名称：

```typescript
const options = ChatOptions.withAppKey({
  appKey: 'your-org#your-app',
  apnsCertName: 'apns_certificate_name',
  pushKitCertName: 'pushkit_certificate_name',
});

await ChatClient.getInstance().init(options);
```

- `apnsCertName`：APNs 推送证书名称，用于 iOS 离线推送。
- `pushKitCertName`：PushKit 推送证书名称，用于 iOS VoIP 推送。调用 `ChatClient.bindPushKitToken` 前需完成该配置。

这两个参数仅对 iOS 生效，其他平台会忽略。证书名称必须与环信控制台中配置的名称一致，并且必须在 SDK 初始化时设置，运行期间不可修改。
