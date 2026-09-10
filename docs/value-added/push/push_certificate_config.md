# 证书管理

使用即时推送前，你需完成各平台的证书配置。即时通讯 IM 支持苹果 APNs、谷歌 FCM、华为、小米、OPPO、魅族、VIVO 和荣耀。

## 添加推送证书

在 [声网控制台](https://console.shengwang.cn/overview) 上传推送证书。

1. 展开控制台左上角下拉框，选择需要开通即时通讯 IM 服务的项目。

2. 点击左侧导航栏的**全部产品**。

3. 在下拉列表中找到**即时通讯 IM** 并点击。

4. 在**即时通讯 IM** 页面，进入**功能配置**标签页。

5. 在**推送证书** 页签下，点击**添加推送证书**。

### 谷歌 FCM 证书

在 **添加推送证书** 页面打开后，默认显示 **谷歌** 页签。你可以在该页面配置谷歌 FCM 推送证书。

![image](/images/android/push/fcm_certificate_v1.png)

| 参数       | 是否必需 | 描述         |
| :--------- | :------- | :---------------- |
| `证书类型`     | 是     | 值为 **V1**。  |
| `上传文件`     | 是     | 点击 **上传证书** 上传获取的 FCM V1 版本证书文件（.json 文件）。|
| `证书名称`     | 是     | 设置为 FCM 的发送者 ID。你需要在[Firebase 控制台](https://console.firebase.google.com/?hl=zh-cn)的 **项目设置** > **云消息传递** 页面中，在 **Firebase Cloud Messaging API（V1）** 区域中获取发送者 ID，如下图所示。 |
| `铃声`      | 否     | 铃声。                     |
| 通道 ID         | 否     | FCM 通道 ID。该参数仅对离线推送有效。       |
| `推送优先级设置`  | 否    | 消息传递优先级。请参见 [设置消息优先级](https://firebase.google.cn/docs/cloud-messaging/customize-messages/setting-message-priority?hl=zh-cn)。<br/> 该参数仅对离线推送有效。|
| `推送消息类型` | 否    | 通过 FCM 发送给客户端的消息类型：<br/> - **数据**：数据消息，由客户端应用程序处理。<br/> - **通知**：通知消息，由 FCM SDK 自动处理。**数据+通知**：通知消息和数据消息都可以通过 FCM 客户端发送。 <br/>请参见 FCM 的 [消息类型介绍](https://firebase.google.cn/docs/cloud-messaging/customize-messages/set-message-type?hl=zh-cn)。<br/> 该参数仅对离线推送有效。|
| `APNs跨平台推送支持` | String | 否 | 是否开启 APNs 跨平台推送支持。非跨平台应用建议不要启用。该参数仅对离线推送有效。|

![image](/images/android/push/fcm_v1.png)

### 苹果 APNs 证书

在 **添加推送证书** 页面，点击 **苹果** 页签，配置苹果 APNs 推送证书。

![image](/images/ios/push/push_ios_25_upload_cert.png)

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| 证书类型    |  | 是 | 消息推送证书类型，目前支持 **p8** 和 **p12**。        |
| 证书名称     | String  | 是 | 消息推送证书名称。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书) 的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书)  中创建的消息推送证书名称。 |
| 推送密钥      | String  | 否 | 消息推送证书密钥。填写在 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书) 中导出消息推送证书文件时设置的证书密钥。该参数仅在使用 p12 证书时需要配置。  |
| 上传文件     | File  | 是 | 点击 **上传证书** 上传推送证书文件。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤四](/document/ios/push/push_apns.html#步骤四-生成推送证书) 中获取的消息推送证书文件。  |
| Key ID     | String  | 是 | 输入推送证书的 Key ID。该参数仅对 p8 证书有效。  |
| Team ID     | String  | 是 | 输入推送证书的 Team ID。该参数仅对 p8 证书有效。  |
| 集成环境      | | 是 | 集成环境，包括开发环境和生产环境。 |
| Bundle ID     | String  | 是 | 绑定 ID。详见 APNs 集成文档中 [创建推送证书](/document/ios/push/push_apns.html#创建推送证书)的 [步骤二](/document/ios/push/push_apns.html#步骤二-创建-app-id) 中创建 App ID 时设置的 Bundle ID。<br/> - 上传 VoIP 服务证书时，Bundle ID 末尾需要加 .voip 后缀 `nvyvtp.dabaoiian`，例如，**Bundle ID** 为 **com.example.demo**，上传对应 VoIP 证书时需要填写 **com.example.demo.voip**。|
| 铃声    | String  | 否 | 接收方收到推送通知时的铃声提醒。该参数仅对离线推送有效：<br/> - 设置的铃声最多为 30 秒。若超过该时间，系统会启用默认铃声 default。<br/> - 铃声文件只支持 aiff、wav 和 caf 格式，例如，铃声文件名为  `test.caf`。<br/> - 如果铃声文件未找到或不填，响铃为系统默认铃声。 |

### 华为推送证书

在 **添加推送证书** 页面，点击 **华为** 页签，配置华为推送证书。

![image](/images/android/push/add_huawei_push_certificate.png)

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

![image](/images/android/push/add_xiaomi_push_certificate.png) 

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 小米 App ID。  |
| 推送密钥     | String | 是     | 小米 App Secret。|
| 应用包名     | String | 是     | 小米 App package name。   |
| Channel ID  | String | 是     |  Channel ID。该参数仅对离线推送有效。            |
| Action      | String | 否     | 点击通知后的动作。该参数仅对离线推送有效。           |

### OPPO 推送证书

在 **添加推送证书** 页面，点击 **OPPO** 页签，配置 OPPO 推送证书。

![image](/images/android/push/add_oppo_push_certificate.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 填写 OPPO App Key。  |
| 推送密钥     | String | 是     | 填写 OPPO Master Secret。Master Secret 需要到 [OPPO 推送平台](https://open.oppomobile.com/) > **配置管理** > **应用配置** 页面查看。|
| 应用包名     | String | 是     | 填写 OPPO App package name。   |
| Channel ID     | String |  否    | 填写 Channel ID。   |
| Activity | String | 否     | 选择点击通知后的动作。  |

### 魅族推送证书

在 **添加推送证书** 页面，点击 **魅族** 页签，配置魅族推送证书。参数相关信息，详见你在 [flyme 推送平台](https://login.flyme.cn/sso?appuri=https%3A%2F%2Fapiopen.flyme.cn%2Flogin&useruri=https%3A%2F%2Fopen.flyme.cn%3Ft%3D1722914343470&sid=node0mpa52w0llp341dncyz6wr7yi56208487&service=open&autodirct=true) 创建的应用的 `APP ID` 和 `APP SECRET` 以及程序的 `包名`。

![image](/images/android/push/add_meizu_push_certificate.png)

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :---------------- |
| 证书名称     | String | 是     | 魅族 App ID。  |
| 推送密钥    | String | 是     | 魅族 App Secret。|
| 应用包名     | String | 是     | 魅族 App package name。   |
| Activity| String | 否     | 点击通知后的动作。该参数仅对离线推送有效。  |
| 推送送达回执     | String |  否    | 是否开启推送送达回执。<br/> - 开发者需要在 Flyme 推送平台新建回执后，才能开启推送送达回执，获取到魅族推送通道送达到设备的推送数据。<br/> - 该参数仅对离线推送有效。 |

### VIVO 推送证书

在**添加推送证书**对话框中，选择 **VIVO** 页签，配置 VIVO 推送参数。参数相关信息，详见你在 [VIVO 开发者后台](https://vpush.vivo.com.cn/#/appdetail)创建的应用的 `APP ID`，`APP KEY` 和 `APP SECRET` 以及程序的 `包名`。

![image](/images/android/push/add_vivo_push_certificate.png)

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

![image](/images/android/push/add_honor_push_template.png)

| 推送证书参数    | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :--------------------------------------- |
| App ID        | String | 是       | 应用标识符，应用的唯一标识，在荣耀开发者服务平台开通对应用的荣耀推送服务时生成。                   |
| Client ID     | String | 是       | 应用的客户 ID，用于获取发送消息令牌的 ID，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。   |
| Client Secret | String | 是       | 应用的客户密钥，用于获取发送消息令牌的密钥，在荣耀开发者服务平台开通对应应用的荣耀推送服务时生成。 |
| Badge Class   | String | 否       | 应用入口 Activity 类全路径，例如 com.example.test.MainActivity。 <br/> 该参数仅对离线推送有效。                                  |
| Action        | String | 否       | 消息接收方在收到离线推送通知时，单击通知栏时打开的应用指定页面的自定义标记。<br/> - 该参数需要与客户端 `AndroidManifest.xml` 文件中注册启动的 `Activity` 类中 `intent-filter` 页签中设置的 `action` 一致。 <br/> - 该参数仅对离线推送有效。 |

:::tip
关于 **App ID**、**Client ID** 和 **Client Secret**，可在荣耀开发者服务平台申请开通推送服务后，在 **推送服务** 页面选择创建的应用，在 [**查看推送服务**](https://developer.honor.com/cn/docs/11002/guides/app-registration#申请开通推送服务)页面查看。
:::

![image](/images/android/push/view_push_service.png)

### 鸿蒙推送证书

在 **添加推送证书** 页面，点击 **鸿蒙** 页签，配置鸿蒙推送证书。

![img](/images/harmonyos/push/harmonyos_certificate.png)

| 推送证书参数    | 类型   | 是否必需 | 描述   |
| :-------- | :----- | :------- | :---------------- |
| 证书名称        | String | 是  | 推送证书名称，请填写鸿蒙 Client ID。<br/>证书名称是IM 服务器用来判断目标设备使用哪种推送通道的唯一条件，因此**必须确保与 HarmonyOS 终端设备上传的证书名称一致。** <br/>详见 [**创建服务账号密钥**窗口中 **名称** 参数的值](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)。|
| 上传文件     | - | 是  | 点击 **上传证书**，上传 JSON 推送证书，即服务账号的密钥文件。申请服务器密钥可参考官方文档：[华为 API Console操作指南-服务帐号密钥](https://developer.huawei.com/consumer/cn/doc/start/api-0000001062522591#section11695162765311)，选择启用推送服务后，再生成服务器密钥。 |
| Category | - | 否      | 通知消息类别。详见 [HarmonyOS NEXT 官网相关文档](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-V5/push-apply-right-V5#section16708911111611)。 |
| Action        | - | 否  | 消息接收方在收到离线推送通知时单击通知栏时打开的应用指定页面的自定义标记。 |