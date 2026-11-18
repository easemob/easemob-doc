# 入门指引

环信单群聊 UIKit 是基于环信即时通讯 IM SDK 开发的一款即时通讯 UI 组件库。Web 单群聊 UIKit 提供 React 和 Vue 两种组件库。请选择与你的项目技术栈对应的版本，快速集成会话列表、聊天、通讯录和群组管理等功能。

| 产品 | 适用项目 | 主要入口 |
| --- | --- | --- |
| [React UIKit](chatuikit_integrated_react.html) | React 项目 |- [快速开始](chatuikit_quickstart.html)<br> - [集成文档](chatuikit_integrated_react.html)<br> - [Demo](demo_react.html)<br> - [源码](https://github.com/easemob/easemob-uikit-react) |
| [Vue UIKit](vue_guide.html) | Vue 3 项目 | - [快速开始](https://webim-vue-uikit-docs.easemob.com/guide/quickstart.html)<br> - [集成文档](vue_guide.html)<br>● [Demo](demo_vue.html)<br> - [源码](https://github.com/Easemob-Community/easemob-uikit-vue) |

需要先了解产品能力时，可以查看 [React 产品概述](chatuikit_overview.html) 或 [Vue3 产品概述](vue_overview.html)。Demo 文档介绍在线体验和本地运行方式；集成文档用于将 UIKit 接入自己的项目。

## 集成流程

<div style="text-align: center">
  <img src="/images/uikit/chatuikit/web/beginner_guide.png" width="350"/>
</div>

## 集成步骤

| 步骤 | 说明 |
| --- | --- |
| 注册开发者账号 | 在[环信控制台](https://console.easemob.com/user/login)[注册账号](/product/console/account_register.html#注册账号)，用于创建和管理应用。开发者账号与应用中的 IM 用户账号用途不同。 |
| 创建应用并获取 App Key | 在控制台[创建应用](/product/console/app_create.html)，并[获取 App Key](/product/console/app_manage.html#获取应用凭证)。初始化 UIKit 时，使用对应应用的配置。 |
| 创建用户并获取用户 Token | 在控制台[创建测试用户](/product/console/operation_user.html#创建用户)，或[调用 REST API 创建用户](/document/server-side/account_register_open.html)。在应用服务器获取 [App Token](/document/server-side/easemob_app_token.html)，再获取并向客户端分发[用户 Token](/document/server-side/easemob_user_token.html)。客户端使用所属用户的 Token 登录，Client Secret 和 App Token 不应写入前端代码。 |
| 集成 UIKit | **React 项目**：按照 [React 集成单群聊 UIKit](chatuikit_integrated_react.html)安装、初始化并搭建界面。<br>**Vue 3 项目**：从 [Vue3 开发文档导航](vue_guide.html)进入快速开始和 Provider 配置，完成接入。<br>完成接入后，使用同一应用下的两个测试用户验证单聊或群聊消息收发。 |
| 自定义界面与功能 | **React UIKit**：查阅[自定义会话列表](chatuikit_custom_conversation_list_basic.html)、[自定义聊天页面](chatuikit_custom_chat.html)和[自定义通讯录](chatuikit_contactlist.html)。<br>**Vue3 UIKit**：查阅[开发指南](vue_guide.html#开发指南)、[组件文档](vue_guide.html#组件文档)和 [API 参考](vue_guide.html#api-参考)。 |
| 音视频通话 | **可选，仅适用于 React UIKit**：React UIKit 内部集成了声网音视频 SDK，完成相关配置后，可在单聊或群组会话中使用 [音视频通话](chatuikit_video.html)。 |

## 后续开发

- **React UIKit**：按需查阅[国际化](chatuikit_internationalization.html)和[主题](chatuikit_theme.html)等文档。
- **Vue3 UIKit**：从[开发文档导航](vue_guide.html)查阅业务扩展、主题、H5 适配和 AI 辅助开发等内容。

两套 UIKit 的组件 API 和功能配置分别维护，请使用所选技术栈对应的文档。
