# 环信即时通讯 SDK 合规使用说明

根据中国法律法规和监管部门规章要求，App 开发运营者（以下简称“开发者”或“您”）在提供网络产品服务时应尊重和保护最终用户个人信息，不得违法违规收集使用个人信息，保证和承诺个人信息处理行为获得最终用户的授权同意，遵循最小必要原则，并且应当采取有效的技术措施和组织措施，确保个人信息安全。

为帮助开发者在使用 SDK 的过程中更好地落实用户个人信息保护相关要求，避免出现侵害用户个人信息权益情形，北京亿思摩博网络科技有限公司（以下简称“我们”）特制定本环信即时通讯 SDK 合规使用说明文档（以下简称“文档”）。

## 一、App 个人信息保护的合规要求

为保护 App 最终用户的个人信息，App 及 App 的开发者需要满足如下合规要求：

- App 开发者应该制定隐私政策，并在 App 界面中显著展示。
- App 隐私政策应该单独成文，而不是作为用户协议等文件中的一部分进行展示。
- App 隐私政策应该明示收集和使用个人信息的目的、方式和范围，并且确保隐私政策链接正常有效，易于访问和阅读。
- App 隐私政策应逐项说明 App 各项业务功能以及对应收集的个人信息类型，不应使用“等、例如”等方式概括说明。
- App 隐私政策应显著标识个人敏感信息类型（如：字体加粗等）。
- App 隐私政策应逐项说明调用的第三方 SDK，包括明示 SDK 名称、SDK 开发者名称；SDK 收集和处理的个人信息类型、目的、方式、范围；SDK 隐私政策链接。

## 二、App 使用环信即时通讯 SDK 时的合规指引

### 1. 环信即时通讯 SDK 所需的系统权限说明

本 SDK 功能所需的权限，您可以参考如下表格，了解相关权限功能和时机。SDK 只会检查 App 是否获得相应授权，不会主动向最终用户申请权限。

权限配置，请查阅相关配置文档：

- Android: [快速开始](https://doc.easemob.com/document/android/quickstart.html)
- iOS: [快速开始](https://doc.easemob.com/document/ios/quickstart.html)
- HarmonyOS：[快速开始](https://doc.easemob.com/document/harmonyos/quickstart.html)

Android 操作系统应用权限列表

| 权限    | 权限功能说明     | 必选或可选 | 申请时机                 |
| :----- | :-------- | :-------- | :-------- |
| 网络连接状态（ACCESS_NETWORK_STATE）                    | 判断网络连接状态及网络是否可用         | 必选           | 需要接入网络时。               |
| 访问网络权限（INTERNET）                                | 判断是否能联网，以实现SDK 功能正常运行 | 必选           | 需要接入网络时。               |
| Wi-Fi网络状态（ACCESS_Wi-Fi_STATE和CHANGE_Wi-Fi_STATE） | 判断网络连接状态及网络是否可用         | 必选           | 需要接入网络时。               |
| 地理位置信息                                            | 提供发送地理位置消息的功能             | 可选           | 需要发送位置消息时             |
| 设备存储（WRITE_EXTERNAL_STORAGE）                      | 提供发送本地文件消息功能               | 必选           | 需要收发图片，文件等附件消息时 |
| 设备存储（READ_EXTERNAL_STORAGE）                       | 提供发送本地文件消息功能               | 必选           | 需要收发图片，文件等附件消息时 |
| 摄像头（CAMERA）                                        | 提供拍照并发送图片消息功能             | 可选           | 需要拍摄图片视频时             |
| 麦克风（RECORD_AUDIO）                                  | 提供发送音频消息功能                   | 可选           | 需要录制音频消息时             |
| 保持后台运行（WAKE_LOCK）                               | 最大程度保证长链接心跳投递             | 可选           | 需要尽量保持后台运行时         |

iOS 操作系统应用权限列表

| 权限     | 权限功能说明           | 必选或可选 | 申请时机      |
| :----- | :-------- | :-------- | :-------- |
| 摄像头       | 提供拍照并发送图片消息功能 | 可选           | 需要拍摄图片视频时 |
| 麦克风       | 提供发送音频消息功能       | 可选           | 需要录制音频消息时 |
| 地理位置信息 | 提供发送地理位置消息的功能 | 可选           | 需要发送位置消息时 |

HarmonyOS 操作系统应用权限列表

| 权限     | 权限功能说明           | 必选或可选 | 申请时机      |
| :----- | :-------- | :-------- | :-------- |
| 访问网络权限                      | 访问网络权限                     | 必选           | 需要接入网络时。     |
| 获取网络信息（GET_NETWORK_INFO）  | 判断网络连接状态及网络是否可用   | 必选           | 需要接入网络时。     |
| 地理位置信息                      | 提供发送地理位置消息的功能       | 可选           | 需要收发位置信息时   |
| 设备存储（STORE_PERSISTENT_DATA） | 持久化存储业务系统运行所需的数据 | 可选           | 需要保存业务的数据时 |
| 麦克风                            | 提供发送音频消息功能             | 可选           | 需要录制音频消息时   |

### 2. SDK 初始化及业务功能调用时机说明

您应确保在登录注册页面及 App 首次运行时，通过简洁、明显且易于访问方式向最终用户告知涵盖个人信息处理主体、处理目的、处理方式、处理类型、保存期限等内容的 App 个人信息处理规则（App 隐私政策）。

您应确保在最终用户同意 App 隐私政策后，再进行 SDK 的初始化。并且，在用户同意隐私政策前，您应避免动态申请涉及用户个人信息的敏感设备权限；也应避免私自采集和上报个人信息。如果最终用户不同意 App 隐私政策，则不能初始化本SDK，无法使用 SDK 功能。

SDK 初始化和相关功能配置，请查阅相关配置文档：

- Android: [初始化](https://doc.easemob.com/document/android/initialization.html)
- iOS: [初始化](https://doc.easemob.com/document/ios/initialization.html)
- HarmonyOS：[初始化](https://doc.easemob.com/document/harmonyos/initialization.html)
  
SDK 功能、接口配置方式及示例说明：

- Android：[接口集成](https://doc.easemob.com/document/android/login.html)
- iOS：[接口集成](https://doc.easemob.com/document/ios/login.html)
- HarmonyOS：[接口集成](https://doc.easemob.com/document/harmonyos/login.html)

Android 操作系统 SDK 功能、接口配置方式及示例说明：

| 系统    | 业务功能    | 相关个人信息     | 配置方式及示例          | 时机          |
| :----- | :-------- | :-------- | :-------- | :-------- |
| 样例 Android | 登录即时通讯 IM | 设备品牌、设备型号、操作系统版本、IP 地址、网络接入方式和类型 | 1. 配置开启示例：<br/> `EMClient.getInstance().loginWithToken(mAccount, mToken, new EMCallBack() {//登录成功回调@Overridepublic void onSuccess() { }//登录失败回调，包含错误信息 @Overridepublic void onError(int code, String error) { } });` <br/>2. 配置关闭示例：<br/> `EMClient.getInstance().logout(true);` | 用户登录即时通讯 IM |

iOS 操作系统 SDK 功能、接口配置方式及示例说明：

| 系统    | 业务功能    | 相关个人信息     | 配置方式及示例          | 时机          |
| :----- | :-------- | :-------- | :-------- | :-------- |
| 样例 iOS  | 登录即时通讯 IM | 设备品牌、设备型号、操作系统版本、IP 地址、网络接入方式和类型 | 1. 配置开启示例：<br/>`EMClient.shared().login(withUsername: "userId", token: "token")` <br/>2. 配置关闭示例：<br/> `EMClient.shared().logout(true)` | 用户登录即时通讯 IM |

HarmonyOS 操作系统 SDK 功能、接口配置方式及示例说明：

| 系统    | 业务功能    | 相关个人信息     | 配置方式及示例          | 时机          |
| :----- | :-------- | :-------- | :-------- | :-------- |
| 样例 Harmony OS | 登录即时通讯 IM | 设备品牌、设备型号、操作系统版本、IP 地址、网络接入方式和类型 | 1. 配置开启示例：<br/> `ChatClient.getInstance().loginWithToken(userId, token).then(() => {//登录成功回调}).catch((e: ChatError) => {//登录失败回调，包含错误信息});` <br/>2. 配置关闭示例：<br/> `ChatClient.getInstance().logout().then(()=> {//success logic})` | 用户登录即时通讯 IM |

### 3. SDK 隐私政策披露要求与示例说明

请您根据集成本SDK的实际情况，在您的 App 隐私政策中披露：第三方 SDK 名称、SDK 公司名称、SDK 使用目的和功能场景、SDK 涉及个人信息类型、实现 SDK 功能所需的权限、SDK 隐私政策链接。

请在您的 App 隐私政策中，以文字或列表的方式向公众披露第三方SDK的相关信息。

第三方 SDK 披露示例（仅供参考）：

**Android 示例**

- SDK 名称：环信即时通讯 SDK
- SDK 公司名称：北京亿思摩博网络科技有限公司
- SDK 使用目的和功能场景：提供即时通讯服务功能和服务
- SDK 涉及的个人信息类型：设备类型、设备名称及型号、操作系统版本、网络类型及状态、IP 地址
- 实现 SDK 功能所需权限：网络相关权限、存储权限、地理位置（可选）、摄像头（可选）、麦克风（可选）
- SDK 隐私政策：[https://www.easemob.com/protocol](https://www.easemob.com/protocol)

**iOS 示例**

- SDK 名称：环信即时通讯 SDK
- SDK 公司名称： 北京亿思摩博网络科技有限公司
- SDK 使用目的和功能场景：提供即时通讯服务功能和服务
- SDK 涉及的个人信息类型：设备类型、设备名称及型号、操作系统版本、网络类型及状态、IP 地址、设备识别码（APNS Token）、Bundle ID
- 实现 SDK 功能所需权限：地理位置（可选）、摄像头（可选）、麦克风（可选）
- SDK 隐私政策：[https://www.easemob.com/protocol](https://www.easemob.com/protocol)

**HarmonyOS 示例**

- SDK 名称：环信即时通讯 SDK
- SDK 公司名称： 北京亿思摩博网络科技有限公司
- SDK 使用目的和功能场景：提供即时通讯服务功能和服务
- SDK 涉及的个人信息类型：设备类型、设备名称及型号、操作系统版本、网络类型及状态、IP 地址
- 实现 SDK 功能所需权限：网络相关权限、存储权限、地理位置（可选）、麦克风（可选）
- SDK 隐私政策：[https://www.easemob.com/protocol](https://www.easemob.com/protocol)

### 4. 最终用户同意方式的建议方式说明

App 首次运行时应当有隐私弹窗，隐私弹窗中应公示隐私政策内容并附完整隐私政策链接，并明确提示最终用户阅读并选择是否同意隐私政策；隐私弹窗应提供同意按钮和拒绝同意的按钮，并由最终用户主动选择。

App 取得敏感权限前，应通过隐私弹窗获得用户单独授权同意（如：麦克风权限）。

### 5. 最终用户行使权利的配置说明

开发者在其 App 中集成本 SDK 后，SDK 的正常运行会收集和处理必要的最终用户的个人信息用于提供相关功能的目的。

SDK 提供以下接口配置，以便您帮助最终用户实现其个人信息权利的请求。在最终用户撤销同意处理其个人信息的授权时，您可以通过调用接口，停止和关闭 SDK 功能，并停止收集相应的用户数据。

App 开发者应根据相关法律法规为最终用户提供行使个人信息主体权利的路径功能，需要本 SDK 配合的，请与 SDK 及时进行联系。

相关配置操作，请查阅相关配置文档：

- Android：[退出登录](https://doc.easemob.com/document/android/login.html#退出登录)
- iOS：[退出登录](https://doc.easemob.com/document/ios/login.html#退出登录)
- HarmonyOS：[退出登录](https://doc.easemob.com/document/harmonyos/login.html#退出登录)

## 三、合规文件指引

1. [《个人信息保护法》](http://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)
2. [《工业和信息化部关于开展信息通信服务感知提升行动的通知》](https://www.gov.cn/zhengce/zhengceku/2021-11/06/content_5649420.htm)
3. [《工业和信息化部关于开展纵深推进 App 侵害用户权益专项整治行动的通知》](https://www.gov.cn/zhengce/zhengceku/2020-08/02/content_5531975.htm)
4. [《工业和信息化部关于开展 App 侵害用户权益专项整治工作的通知》](https://www.gov.cn/xinwen/2019-11/07/content_5449660.htm)
5. [《App 违法违规收集使用个人信息行为认定方法》](http://www.cac.gov.cn/2019-12/27/c_1578986455686625.htm)
6. [《App 违法违规收集使用个人信息自评估指南》](https://www.tc260.org.cn/upload/2020-07-22/1595396892533085831.pdf)
7. [《常见类型移动互联网应用程序必要个人信息范围规定》](https://www.gov.cn/zhengce/zhengceku/2021-03/23/content_5595088.htm)
8. [《GB/T 35273-2020信息安全技术个人信息安全规范》](http://c.gb688.cn/bzgk/gb/showGb?type=online&hcno=4568F276E0F8346EB0FBA097AA0CE05E)
9. [《网络安全标准实践指南—移动互联网应用程序（App）使用软件开发工具包（SDK）安全指引》](https://www.tc260.org.cn/front/postDetail.html?id=20201126161240)

## 四、联系方式

我们设立了专门的个人信息保护团队和负责人，如果您和/或最终用户对本规则或个人信息保护相关事宜有疑问或投诉、建议时，可以通过以下方式与我们联系：

- 通过客服咨询（400-622-1776）或者登录 [环信控制台](https://console.easemob.com/user/login) 与我们联系进行在线咨询；
- 发送邮件至 [support@easemob.com](mailto:support@easemob.com) 。

我们将尽快审核所涉问题，并在 15 个工作日或法律法规规定的期限内予以反馈。