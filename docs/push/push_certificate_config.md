# 证书管理

使用即时推送前，你需完成各平台的证书配置。即时通讯 IM 支持苹果 APNs、谷歌 FCM、华为、小米、OPPO、魅族、VIVO 和荣耀。

## 添加推送证书

你可以按照以下步骤添加推送证书：

1. 登录 [环信控制台](https://console.easemob.com/user/login)。
2. 选择页面上方的 **应用管理**。在弹出的应用列表页面，单击你的应用的 **操作** 栏中的 **管理**。
3. 在左侧导航栏，选择 **功能配置** > **增值功能** > **即时推送**。
4. 在 **证书管理** 页面，点击 **添加推送证书**。

### 谷歌 FCM 证书

在 **添加推送证书** 页面打开后，默认显示 **谷歌** 页签。你可以在该页面配置谷歌 FCM 推送证书。

![img](/images/console/push_certificate_fcm.png)

| 参数             | 类型 | 是否必需 | 描述               |
| :-------------- | :----- | :------- | :---------------------------- |
| 证书类型     |  文件    | 是    | 选择使用 V1 或旧版证书。<br/> - **V1**：推荐使用。你需要点击 **上传证书** 上传FCM V1 版本证书文件，并且设置 **证书名称**。<br/> -**旧版**：已弃用，不推荐使用。你需要配置 **证书名称** 和 **推送密钥**。 |
| 上传文件        | 文件 | 是   | 点击 **上传证书** 上传获取的 FCM V1 版本证书文件（.json 文件）。此项仅对 V1 证书有效。 |
| 证书名称       | String | 是   | FCM 的发送者 ID。<br/> - v1 证书：在 [Firebase 控制台](https://console.firebase.google.com/?hl=zh-cn) 的 **项目设置** > **云消息传递** 页面的 **Firebase Cloud Messaging API（V1）** 区域中获取发送者 ID，如下图所示。<br/> - 旧版证书：在 [Firebase 控制台](https://console.firebase.google.com/?hl=zh-cn)的 **项目设置 > 云消息传递** 页面的 **Cloud Messaging API（旧版）** 区域中获取发送者 ID，如下图所示。 |
| 推送密钥     | String | 是   | FCM 服务器密钥。你需在 [Firebase 控制台](https://console.firebase.google.com/) 的 **项目设置** > **云消息传递**页面的 **云消息传递 API（旧版）** 区域中获取服务器密钥，如下图所示。此参数仅对旧版证书有效。|
| 通道 ID         | String | 否     | FCM 通道 ID。该参数仅对离线推送有效。       |
| 推送优先级设置  |      | 否    | 消息传递优先级。请参见 [设置消息优先级](https://firebase.google.cn/docs/cloud-messaging/concept-options#setting-the-priority-of-a-message)。<br/> 该参数仅对离线推送有效。|
| 推送消息类型 |      | 否    | 通过 FCM 发送给客户端的消息类型：<br/> - **数据**：数据消息，由客户端应用程序处理。<br/> - **通知**：通知消息，由 FCM SDK 自动处理。**数据+通知**：通知消息和数据消息都可以通过 FCM 客户端发送。 <br/>请参见 FCM 的 [消息类型介绍](https://firebase.google.com/docs/cloud-messaging/concept-options#notifications_and_data_messages)。<br/> 该参数仅对离线推送有效。|
| APNs跨平台推送支持 | String | 否 | 是否开启 APNs 跨平台推送支持。非跨平台应用建议不要启用。该参数仅对离线推送有效。|

- 获取 V1 版证书名称

![image](/images/android/push/fcm_v1.png)

- 获取旧版证书名称和推送密钥

![image](/images/android/push/fcm_old_version.png)

#### **旧版证书无缝切换至 V1 证书**

旧版 HTTP 或 XMPP API 已在 2024 年 6 月 20 日停用，请尽快迁移到最新的 FCM API（HTTP v1）版本证书，详见 [FCM 控制台](https://console.firebase.google.com)。请确保 V1 证书可用，因为执行转换证书后，旧证书会被删除，若 V1 证书不可用会导致推送失败。

你可以参考以下步骤从旧版证书无缝切换到 V1 新证书： 

1. 在 **证书管理** 页面的旧版证书的 **操作** 栏中点击 **编辑**。
2. 在**编辑推送证书** 窗口的 **谷歌** 页签，将**证书类型**切换为 **V1**。
3. 点击 **上传证书** 上传本地保存的 V1 证书文件（.json）。
4. 点击 **保存** 完成切换。

### 苹果 APNs 证书

在 **添加推送证书** 页面，点击 **苹果** 页签，配置苹果 APNs 推送证书。

![img](/images/console/push_certificate_apns.png)

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| 证书类型    |  | 是 | 消息推送证书类型，目前支持 **p8** 和 **p12**。        |
| 证书名称     | String  | 是 | 消息推送证书名称。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书) 的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书)  中创建的消息推送证书名称。 |
| 推送密钥      | String  | 否 | 消息推送证书密钥。填写在 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书) 中导出消息推送证书文件时设置的证书密钥。该参数仅在使用 p12 证书时需要配置。  |
| 上传文件     | File  | 是 | 点击 **上传证书** 上传推送证书文件。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书) 中获取的消息推送证书文件。  |
| key id     | String  | 是 | 输入推送证书的 Key ID。该参数仅对 p8 证书有效。  |
| team id     | String  | 是 | 输入推送证书的 Team ID。该参数仅对 p8 证书有效。  |
| 集成环境      | | 是 | 集成环境，包括开发环境和生产环境。 |
| Bundle ID     | String  | 是 | 绑定 ID。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤二](/document/ios/push/push_apns.html#步骤二-创建-app-id) 中创建 App ID 时设置的 Bundle ID。<br/> - 上传 VoIP 服务证书时，Bundle ID 末尾需要加 .voip 后缀 `nvyvtp.dabaoiian`，例如，**Bundle ID** 为 **com.example.demo**，上传对应 VoIP 证书时需要填写 **com.example.demo.voip**。|
| 铃声    | String  | 否 | 接收方收到推送通知时的铃声提醒，该参数仅对离线推送有效：<br/> - 设置的铃声最多为 30 秒。若超过该时间，系统会启用默认铃声 default。<br/> - 铃声文件只支持 aiff、wav 和 caf 格式，例如铃声命名 test.caf。<br/> - 铃声文件必须放在 app 的 /Library/Sounds 目录中。<br/> - 如果铃声文件未找到，或不填，响铃为系统默认铃声。 |

### 华为推送证书

在 **添加推送证书** 页面，点击 **华为** 页签，配置华为推送证书。

![img](/images/console/push_certificate_huawei.png)

华为推送参数相关信息，详见你在华为开发者后台创建的 [应用信息中的 App ID 和 SecretKey 以及程序的包名](https://developer.huawei.com/consumer/cn/doc/development/HMSCore-Guides/android-config-agc-0000001050170137#section125831926193110)。

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 华为 Client ID。  |
| 推送密钥    | String | 是     | 华为 Client Secret。|
| 应用包名     | String | 是     | 华为 App package name。   |
| 项目 ID      | String | 否     | 项目 ID。                     |
| Category    | String |  否    | 自动分类权益申请 Category。该参数仅对离线推送有效。       |
| Action       | String |  否    | 点击通知后的动作。组件定义的 intent-filter action name。该参数仅对离线推送有效。   |
| ActivityClass | String | 否     | 角标显示，应用入口类路径。示例：com.easemob.MainActivity。该参数仅对离线推送有效。 |

### 小米推送证书

在 **添加推送证书** 页面，点击 **小米** 页签，配置小米推送证书。

![img](/images/console/push_certificate_xiaomi.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 小米 App ID。  |
| 推送密钥     | String | 是     | 小米 App Secret。|
| 应用包名     | String | 是     | 小米 App package name。   |
| Channel ID  | String | 是     |  Channel ID。该参数仅对离线推送有效。            |
| Action      | String | 否     | 点击通知后的动作。该参数仅对离线推送有效。           |

### OPPO 推送证书

在 **添加推送证书** 页面，点击 **OPPO** 页签，配置 OPPO 推送证书。

![img](/images/console/push_certificate_oppo.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | OPPO App Key。  |
| 推送密钥     | String | 是     | OPPO Master Secret。详见 [OPPO 推送平台](https://open.oppomobile.com/) > **配置管理** > **应用配置** 页面。|
| 应用包名     | String | 是     | OPPO App package name。   |
| Channel ID     | String |  否    | Channel ID。该参数仅对离线推送有效。   |
| Activity | String | 否     | 选择点击通知后的动作。 该参数仅对离线推送有效。 |
| Category | String | 否     | 消息分类。该参数仅对离线推送有效。  |
| NotifyLevel | String | 否     | 通知栏消息提醒等级取值定义: <br/> - **1**：通知栏<br/> - **2**：通知栏+锁屏 <br/> - **16**：通知栏+锁屏+横幅+震动+铃声  <br/> 该参数仅对离线推送有效。|

### 魅族推送证书

在 **添加推送证书** 页面，点击 **魅族** 页签，配置魅族推送证书。

![img](/images/console/push_certificate_meizu.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 魅族 App ID。  |
| 推送密钥    | String | 是     | 魅族 App Secret。|
| 应用包名     | String | 是     | 魅族 App package name。   |
| Activity| String | 否     | 点击通知后的动作。该参数仅对离线推送有效。  |
| 推送送达回执     | String |  否    | 是否开启推送送达回执。<br/> - 开发者需要在 Flyme 推送平台新建回执后，才能开启推送送达回执，获取到魅族推送通道送达到设备的推送数据。<br/> - 该参数仅对离线推送有效。 |

### VIVO 推送证书

在 **添加推送证书** 页面，点击 **VIVO** 页签，配置 VIVO 推送证书。

![img](/images/console/push_certificate_vivo.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | VIVO App ID。  |
| 证书标识     | String | 是     | VIVO App Key。|
| 推送密钥     | String | 是     | VIVO App Secret。|
| Category     | String |  否    | Category 类型。关于该参数，详见 [VIVO 推送文档](https://dev.vivo.com.cn/documentCenter/doc/359#w2-67805227)。该参数仅对离线推送有效。                      |
| 应用包名     | String | 是     | VIVO App package name。该参数仅对离线推送有效。   |
| Activity| String | 否     | 点击通知后的动作。 该参数仅对离线推送有效。 |
| 推送类型     | String |  否    |可选择 **运营消息** 或 **系统消息**。该参数仅对离线推送有效。 |

### 荣耀推送证书

在 **添加推送证书** 页面，点击 **荣耀** 页签，配置荣耀推送证书。

![img](/images/console/push_certificate_rongyao.png)

| 推送证书参数    | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :--------------------------------------- |
| App ID        | String | 是       | 应用标识符，应用的唯一标识，在荣耀开发者服务平台开通对应用的荣耀推送服务时生成。                   |
| Client ID     | String | 是       | 应用的客户 ID，用于获取发送消息令牌的 ID，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。   |
| Client Secret | String | 是       | 应用的客户密钥，用于获取发送消息令牌的密钥，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。 |
| Badge Class   | String | 否       | 应用入口 Activity 类全路径，例如 com.example.test.MainActivity。 <br/> 该参数仅对离线推送有效。                                  |
| Action        | String | 否       | 消息接收方在收到离线推送通知时，单击通知栏时打开的应用指定页面的自定义标记。<br/> - 该参数需要与客户端 `AndroidManifest.xml` 文件中注册启动的 `Activity` 类中 `intent-filter` 页签中设置的 `action` 一致。 <br/> - 该参数仅对离线推送有效。 |

:::tip
关于 **App ID**、**Client ID** 和 **Client Secret**，可在荣耀开发者服务平台申请开通推送服务后，在 **推送服务** 页面选择创建的应用，在 [**查看推送服务**](https://developer.honor.com/cn/docs/11002/guides/app-registration#申请开通推送服务) 页面查看。
:::

### 鸿蒙推送证书

在 **添加推送证书** 页面，点击 **鸿蒙** 页签，配置鸿蒙推送证书。

![img](/images/console/push_certificate_harmony.png)

| 参数    | 类型   | 是否必需 | 描述   |
| :-------- | :----- | :------- | :---------------- |
| 证书名称        | String | 是  | 推送证书名称，即鸿蒙 Client ID。<br/>证书名称是环信服务器用来判断目标设备使用哪种推送通道的唯一条件，因此 **必须确保与 HarmonyOS 终端设备上传的证书名称一致。** <br/>详见 [**创建服务账号密钥** 页面的 **名称** 参数的值](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)。|
| 上传文件     | - | 是  | 点击 **上传证书**，上传 JSON 推送证书，即服务账号的密钥文件。关于申请服务器密钥，可参见官方文档：[华为 API Console 操作指南-服务帐号密钥](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)，选择启用推送服务后，再生成服务器密钥。 |
| Category | - | 否      | 通知消息类别。详见 [HarmonyOS NEXT 官网相关文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-apply-right-V5#section16708911111611)。<br/> 该参数仅对离线推送有效。|
| Action        | - | 否  | 消息接收方收到离线推送通知时，单击通知栏时打开的应用指定页面的自定义标记。<br/> 该参数仅对离线推送有效。 |