# 入门指引

环信单群聊 UIKit 是基于环信即时通讯 IM SDK 开发的一款即时通讯 UI 组件库。本文提供从零开始接入单群聊 UIKit 的完整指南。

## 集成流程

<div style="text-align: center">
  <img src="/images/uikit/chatuikit/uniapp/beginner_guide.png" width="350"/>
</div>

## 集成步骤

| 步骤            | 描述 | 
| :-------------- | :----- | 
| [注册账号](/product/console/account_register.html#注册账号)         | 使用环信产品前，你首先需要在 [环信控制台](https://console.easemob.com/user/login)[注册账号](/product/console/account_register.html#注册账号)。<br/>环信账号是开发者在环信控制台的唯一身份标识，开发者利用账号登录控制台，对应用进行配置和管理。开发者在将自身应用与环信即时通讯 IM 对接时，需注册 IM 账号与自身应用中的账号映射。 |
| [创建应用](/product/console/app_create.html)<br/><br/>[获取 App Key](/product/console/app_manage.html#获取应用凭证)         | 1. 要接入即时通讯 IM 服务，你必须首先在环信控制台 [创建应用](/product/console/app_create.html)。<br/> 2. 环信会给创建的应用分配 App Key，作为应用的唯一标识。你需要 [获取应用的 App Key](/product/console/app_manage.html#获取应用凭证)，集成 SDK 时传入 App Key。  |
| [开通 IM 套餐](/product/pricing_method.html#订阅套餐包)         | 即时通讯 IM 支持免费版、专业版和旗舰版，请参考 [购买指引](/product/pricing_method.html#订阅套餐包) 根据需要订阅套餐包。<br/>除了套餐包，你还可以 [开通和订阅 IM 的增值服务](/product/console/purchase_value_added.html)，包括实时音视频服务、内容审核、消息翻译和即时推送。|
| [创建用户](/document/applet/login.html#用户注册) <br/><br/>[实现获取 Token](/document/server-side/easemob_app_token.html)        | - **创建用户**：你可以 [调用 REST API 创建用户](/document/server-side/account_register_open.html)，也可以在 [环信控制台](https://console.easemob.com/user/login) 创建用户。详见 [用户注册文档](/document/applet/login.html#用户注册)。<br/> - **实现获取 Token**：在你的应用服务器集成 [获取 App Token API](/document/server-side/easemob_app_token.html) 和 [获取用户 Token API](/document/server-side/easemob_user_token.html) 实现获取 Token 的业务逻辑，你的应用可以调用自身服务端，从环信服务器获取 Token。   |
| [集成 UIKit](chatuikit_integrated.html#项目集成)  | 将单群聊 UIKit 集成到你的应用：<br/> - 创建项目<br/> - 下载 UIKit 源码<br/> - 添加依赖<br/> - 初始化并设置通用样式<br/> - 配置路由<br/> - 运行 Demo |
| [自定义页面](chatuikit_integrated.html#自定义开发)        | - **自定义开发**：单群聊 UIKit 内置了 Store 模块，你可以通过阅读 `ChatUIKit/Store` 模块源码，进行自定义开发。<br/> - **隐藏 UIKit 功能**：调用 `ChatUIKit.hideFeature` 方法隐藏。你可以在 `ChatUIKit/configType.ts` 文件查看所有可隐藏的功能。|

