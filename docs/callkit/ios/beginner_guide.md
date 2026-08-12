# 入门指引

环信音视频通话 CallKit 是基于环信即时通讯 IM 和声网实时音视频 RTC 深度整合开发的实时音视频通话框架，实现了一对一及群组音视频通话功能。本文提供从零开始接入音视频通话 CallKit 的完整指南。

## 集成流程

<div style="text-align: center">
  <img src=/images/callkit/ios/beginner_guide.png   width="350"/>
</div>

## 集成步骤

| 步骤            | 描述 | 
| :-------------- | :----- | 
| [注册账号](/product/console/account_register.html#注册账号) | 使用环信产品前，你首先需要在 [环信控制台](https://console.easemob.com/user/login)[注册账号](/product/console/account_register.html#注册账号)。<br/>环信账号是开发者在环信控制台的唯一身份标识，开发者利用账号登录控制台，对应用进行配置和管理。开发者在将自身应用与环信即时通讯 IM 对接时，需注册 IM 账号与自身应用中的账号映射。 |
| [创建应用](/product/console/app_create.html) <br/><br/>[实现获取 App Key](/product/console/app_manage.html#获取应用凭证) | 1. 要接入即时通讯 IM 服务，你必须首先在环信控制台 [创建应用](/product/console/app_create.html)。<br/> 2. 环信会给创建的应用分配 App Key，作为应用的唯一标识。你需要 [获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，集成 SDK 时传入 App Key。  |
| [开通 IM 套餐](/product/pricing_method.html#订阅-升级套餐包) <br/><br/> [开通 RTC](/callkit/ios/product_activation.html) 和 [订阅套餐](/callkit/ios/product_purchase.html)  | 1. 即时通讯 IM 支持免费版、专业版和旗舰版，请参考 [购买指引](/product/pricing_method.html#订阅-升级套餐包) 根据需要订阅套餐包。除了套餐包，你还可以 [开通和订阅 IM 的增值服务](/product/console/purchase_value_added.html)，例如，内容审核、消息翻译和即时推送。<br/>2. 实时音视频服务 RTC 是即时通讯 IM 的增值服务。若要使用该服务，你需要首先 [开通](/callkit/ios/product_activation.html)，[订阅套餐包](/callkit/ios/product_purchase.html)。|
| [创建用户](/document/ios/login.html#用户注册) <br/><br/>[实现获取 Token](/document/server-side/easemob_app_token.html)  | - **创建用户**:你可以 [调用 REST API 创建用户](/document/server-side/account_register_open.html)，也可以在 [环信控制台](https://console.easemob.com/user/login) 创建用户。详见 [用户注册文档](/document/ios/login.html#用户注册)。<br/> - **获取 Token**：在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，你的应用可以调用自身服务端，从环信服务器获取 Token。   |
| [集成 CallKit](integration.html)          | 将 CallKit [集成到你的应用](integration.html)，主要包括以下步骤：<br/> 1. 安装 CallKit<br/> 2. 初始化 CallKit<br/> 3. 配置监听器<br/>4. 登录 IM<br/>5. 发起通话<br/>6. 接通通话<br/>7. 离线推送  |
| [使用 LiveCommunicationKit](livecommunicationkit.html)    | 环信 CallKit 中的 `LiveCommunicationManager` 是一个用于管理 iOS VoIP 通话的单例管理器类，集成了 Apple 的 PushKit 和 LiveCommunicationKit 框架，提供完整的 VoIP 通话解决方案，包括来电推送、通话管理和音频会话控制。关于 VoIP 推送以及通话流程和通话管理，详见 [使用 LiveCommunicationManager 介绍](livecommunicationkit.html)。  |
| [使用视频通话画中画](picture_in_picture.html)      | 画中画（Picture-in-Picture，PiP）功能允许用户在视频通话时，将通话界面最小化为悬浮窗口，同时使用其他应用。使用前，你需要开启画中画功能，申请摄像头后台权限。CallKit 中提供 [一对一视频通话 PiP](picture_in_picture.html#一对一视频通话-pip)。关于群组视频通话 PiP，环信提供了实现方案，详见 [相关文档](picture_in_picture.html#群组视频通话-pip-实现方案)。  |
| [自定义资源](customization.html)       | 你可以修改 UI 配置项、修改原有资源和修改业务可配项。|

