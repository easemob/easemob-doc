# 在环信即时通讯控制台上传推送证书

在第三方推送服务后台注册应用，获取应用信息，开启推送服务后，你需要在即时通讯云控制台上传推送证书，实现第三方推送服务与环信即时通讯 IM 的通信。

![img](/images/react-native/push/push_add_certificate.png)

关于各推送相关的环信即时控制台上的推送证书参数描述，详见下表中 [iOS 离线推送文档](/document/ios/push/push_overview.html)和 [Android 离线推送文档](/document/android/push/push_overview.html)中的相关链接。

**对于 FCM、华为和荣耀推送，即使你只使用其中一种推送服务，同样需要配置其他推送证书。例如，若你只使用 FCM 推送，你需要配置 FCM、华为和荣耀推送证书。**

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


