# 入门指引

环信即时通讯 IM 可实现发送文本、图片、位置、语音、视频等各类型消息，提供单聊、群聊、聊天室、离线推送、账号鉴权、用户属性和用户关系等服务。

## 集成流程

<div style="text-align: center">
  <img src=/images/android/beginner_guide.png  width="400"/>
</div>

## 集成步骤

| 步骤            | 描述 | 
| :-------------- | :----- | 
| [注册账号](/product/console/account_register.html#注册账号)  | 使用环信产品前，你首先需要在 [环信控制台](https://console.easemob.com/user/login)[注册账号](/product/console/account_register.html#注册账号)。<br/>环信账号是开发者在环信控制台的唯一身份标识，开发者利用账号登录控制台，对应用进行配置和管理。开发者在将自身应用与环信即时通讯 IM 对接时，需注册 IM 账号与自身应用中的账号映射。 |
| [创建应用](/product/console/app_create.html)<br/><br/>[获取 App Key](/product/console/app_manage.html#获取应用凭证) | 1. 要接入即时通讯 IM 服务，你必须首先在环信控制台 [创建应用](/product/console/app_create.html)。<br/> 2. 环信会给创建的应用分配 App Key，作为应用的唯一标识。你需要 [获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，集成 SDK 时传入 App Key。  |
| [开通 IM 套餐](/product/pricing_method.html#订阅套餐包)     | 即时通讯 IM 支持免费版、专业版和旗舰版，请参考 [购买指引](/product/pricing_method.html#订阅套餐包) 根据需要订阅套餐包。<br/>除了套餐包，你还可以 [开通和订阅 IM 的增值服务](/product/console/purchase_value_added.html)，包括实时音视频服务、内容审核、消息翻译和即时推送。|
| [创建用户](/document/web/login.html#用户注册) <br/><br/>[实现获取 Token](/document/server-side/easemob_app_token.html)    | - **创建用户**:你可以 [调用 REST API 创建用户](/document/server-side/account_register_open.html)，也可以在 [环信控制台](https://console.easemob.com/user/login) 创建用户。详见 [用户注册文档](login.html#用户注册)。<br/> - **获取 Token**：在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，你的应用可以调用自身服务端，从环信服务器获取 Token。   |
| [导入 SDK](/document/web/integration.html)          | 将 SDK [集成到你的项目](/document/web/integration.html)中。 |
| [初始化 SDK](/document/web/initialization.html)         | 使用 IM 的各项功能前，必须先初始化。传入你应用的 App Key 进行 [初始化](/document/web/initialization.html)。 初始化时，可配置自动登录、加群、退群推送等重要特性。|
| [登录 IM](/document/web/login.html)       | 使用创建的用户登录 IM。登录成功后，你可以使用 IM 的功能。 |
| 集成特性         | 集成主要特性：<br/> - [消息管理](/document/web/message_send.html) <br/> - [会话管理](/document/web/conversation_overview.html)<br/> - [群组管理](/document/web/group_overview.html) <br/> - [聊天室管理](/document/web/room_overview.html) <br/> - [用户管理](/document/web/user_relationship.html)|

