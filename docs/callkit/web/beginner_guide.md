# 入门指引

环信音视频通话 CallKit 是基于环信即时通讯 IM 和声网实时音视频 RTC 深度整合开发的实时音视频通话框架，实现了一对一及群组音视频通话功能。本文提供从零开始接入音视频通话 CallKit 的完整指南。

## 集成流程

<div style="text-align: center">
  <img src=/images/callkit/web/beginner_guide.png   width="350"/>
</div>

## 集成步骤

| 步骤            | 描述 | 
| :-------------- | :----- | 
| [注册账号](/product/console/account_register.html#注册账号)         | 使用环信产品前，你首先需要在 [环信控制台](https://console.easemob.com/user/login)[注册账号](/product/console/account_register.html#注册账号)。<br/>环信账号是开发者在环信控制台的唯一身份标识，开发者利用账号登录控制台，对应用进行配置和管理。开发者在将自身应用与环信即时通讯 IM 对接时，需注册 IM 账号与自身应用中的账号映射。 |
| [创建应用](/product/console/app_create.html) <br/><br/>[实现获取 App Key](/product/console/app_manage.html#获取应用凭证)         | 1. 要接入即时通讯 IM 服务，你必须首先在环信控制台 [创建应用](/product/console/app_create.html)。<br/> 2. 环信会给创建的应用分配 App Key，作为应用的唯一标识。你需要 [获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，集成 SDK 时传入 App Key。  |
| [开通 IM 套餐](/product/pricing_method.html#订阅-升级套餐包) <br/><br/> [开通 RTC](/callkit/android/product_activation.html) 和 [订阅套餐](/callkit/android/product_purchase.html)       | 1. 即时通讯 IM 支持免费版、专业版和旗舰版，请参考 [购买指引](/product/pricing_method.html#订阅-升级套餐包) 根据需要订阅套餐包。除了套餐包，你还可以 [开通和订阅 IM 的增值服务](/product/console/purchase_value_added.html)，例如，内容审核、消息翻译和即时推送。<br/>2. 实时音视频服务 RTC 是即时通讯 IM 的增值服务。若要使用该服务，你需要首先 [开通](/callkit/android/product_activation.html)，然后 [订阅套餐包](/callkit/android/product_purchase.html)。|
| [创建用户](/document/web/login.html#用户注册) <br/><br/>[实现获取 Token](/document/server-side/easemob_app_token.html)        | - **创建用户**:你可以 [调用 REST API 创建用户](/document/server-side/account_register_open.html)，也可以在 [环信控制台](https://console.easemob.com/user/login) 创建用户。详见 [用户注册文档](/document/web/login.html#用户注册)。<br/> - **获取 Token**：在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，你的应用可以调用自身服务端，从环信服务器获取 Token。   |
| [集成 CallKit](integration.html)         | 将 CallKit [集成到你的应用](integration.html)，主要包括以下步骤：<br/> 1. 安装与引入 CallKit<br/> 2. 配置 CallKit 组件<br/> 3. 配置监听器<br/>4. 登录 IM<br/>5. 发起通话<br/>6. 接通通话  |
| [自定义资源](customization.html)       | 你可以进行自定义通话背景、设置呼叫超时时间、配置铃声以及自定义图标（如麦克风打开时的图标）等。|

