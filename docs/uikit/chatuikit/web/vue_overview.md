# 产品概述

## Vue UIKit 介绍

环信 Vue UIKit 是面向 Vue 3 项目的即时通讯 UI 组件库，基于环信即时通讯 IM SDK 构建。它封装了消息收发、会话管理、联系人管理和群组管理等常用能力，提供可直接使用的业务界面与组件，帮助开发者快速为应用加入单聊和群聊功能。

开发者可以组合会话列表、聊天、通讯录等业务容器搭建界面，也可以使用基础组件、配置项和插槽定制局部交互，满足不同业务需求。

- **UIKit**：提供界面与交互，封装常用 IM 业务逻辑。
- **IM SDK**：提供连接、消息、会话、联系人和群组等基础通讯能力。
- **业务应用**：对接自身账号、数据和业务流程，并按需扩展功能。

你可以先 [体验 Vue Demo](demo_vue.html) ，了解界面效果；需要接入时，从 [开发文档导航](vue_guide.html) 查找指南、组件和 API。

![Vue UIKit 主界面](/images/uikit/chatuikit/web/vue/overview/main.png)

## 功能概览

| 功能模块 | 主要组件或入口 | 主要能力 |
| :--- | :--- | :--- |
| 会话列表 | [EmConversationContainer](https://webim-vue-uikit-docs.easemob.com/components/conversation-container.html) | 展示单聊和群聊会话，管理未读、置顶和免打扰等状态。 |
| 聊天与消息 | [EmChatContainer](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) 、 [EmMessageList](https://webim-vue-uikit-docs.easemob.com/components/message-list.html) | 收发消息，展示消息状态，提供引用、撤回、删除等操作。 |
| 通讯录与好友 | [EmContactContainer](https://webim-vue-uikit-docs.easemob.com/components/contact-container.html) 、 [EmAddressBookContainer](https://webim-vue-uikit-docs.easemob.com/components/address-book-container.html) | 展示联系人，处理好友申请，提供好友与群组入口。 |
| 群组与群管理 | [EmGroupListContainer](https://webim-vue-uikit-docs.easemob.com/components/group-container.html) 、 [EmGroupManagementSection](https://webim-vue-uikit-docs.easemob.com/components/group-management.html) | 展示群组，提供群资料、成员和管理功能。 |
| 搜索 | 会话、通讯录、群组及聊天模块 | 按模块提供搜索入口；消息搜索范围和配置见 [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) 。 |
| 基础 UI 与交互 | [Button](https://webim-vue-uikit-docs.easemob.com/components/button.html) 、 [Avatar](https://webim-vue-uikit-docs.easemob.com/components/avatar.html) 等组件 | 提供按钮、头像、弹窗、提示和空状态等通用界面能力。 |

![功能模块全景](/images/uikit/chatuikit/web/vue/overview/modules.png)

## 聊天与消息

聊天界面支持单聊和群聊，由 [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) 组合消息列表、输入区和相关操作入口。需要深度定制布局时，也可以单独使用 [消息列表](https://webim-vue-uikit-docs.easemob.com/components/message-list.html) 。

![聊天界面](/images/uikit/chatuikit/web/vue/overview/chat-main.png)

### 消息类型

支持文本、表情、图片、语音、视频和文件等消息，并提供自定义消息渲染扩展能力。

![消息类型](/images/uikit/chatuikit/web/vue/overview/chat-message-types.png)

### 消息操作

提供复制、引用、编辑、撤回、删除、置顶、转发和多选等操作，并支持消息翻译、语音转文字等能力。可用操作会随消息类型、用户权限和配置变化，详见 [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) 。

![消息操作](/images/uikit/chatuikit/web/vue/overview/chat-actions.png)

### 消息状态

展示发送中、发送成功、发送失败等发送状态，并结合回执配置展示已送达、已读等状态。会话列表提供未读消息数；消息发送状态、已读回执与会话未读数的区别见 [术语与数据模型](https://webim-vue-uikit-docs.easemob.com/guide/data-model.html) 。

![消息状态](/images/uikit/chatuikit/web/vue/overview/chat-status.png)

### 群聊互动

支持群聊 @ 提及、群成员头像与昵称展示、群组详情入口等交互。群已读回执需按所选 SDK 的能力与聊天配置启用，具体限制见 [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) 。

![群聊互动](/images/uikit/chatuikit/web/vue/overview/chat-group.png)

## 会话列表

[会话模块](https://webim-vue-uikit-docs.easemob.com/components/conversation-container.html) 集中展示用户的单聊和群聊会话，帮助用户查看最新消息并切换聊天对象。

![会话列表](/images/uikit/chatuikit/web/vue/overview/conversation-main.png)

- **信息展示**：会话头像、名称、最新消息、消息时间、未读消息数和草稿提示。
- **会话管理**：置顶与取消置顶、标记已读、消息免打扰和删除会话。
- **状态提示**：置顶、免打扰、未读、消息发送状态和群聊 @ 提醒。
- **常用入口**：发起单聊、创建群聊和添加联系人。

![会话操作](/images/uikit/chatuikit/web/vue/overview/conversation-actions.png)

## 通讯录与好友

[通讯录模块](https://webim-vue-uikit-docs.easemob.com/components/contact-container.html) 用于查看和管理联系人，提供搜索、好友与群组入口、好友申请处理及添加好友等功能。 [黑名单模块](https://webim-vue-uikit-docs.easemob.com/components/block-list.html) 提供黑名单查看和管理能力。

需要自定义通讯录子视图时，可以通过 [地址簿容器](https://webim-vue-uikit-docs.easemob.com/components/address-book-container.html) 组合所需界面。

![通讯录](/images/uikit/chatuikit/web/vue/overview/contact-main.png)

## 群组与群管理

[群组模块](https://webim-vue-uikit-docs.easemob.com/components/group-container.html) 提供群组列表，支持搜索、排序、分组、字母导航和选择模式。 [群管理模块](https://webim-vue-uikit-docs.easemob.com/components/group-management.html) 提供群详情及配套管理界面。

- **群资料**：查看或修改群名称、群公告等信息。
- **群成员**：查看、搜索、添加或移除成员。
- **群管理**：管理入群申请、禁言、黑名单和白名单，查看共享文件。
- **群聊操作**：通过聊天详情设置会话免打扰、置顶或清空记录等；群组操作按成员角色和权限展示。

![群组管理](/images/uikit/chatuikit/web/vue/overview/group-main.png)

## 主题与扩展能力

### 外观定制

支持调整主题色、明暗模式、字号、圆角、消息气泡与聊天背景、容器间距等样式。可以使用主题配置，也可以通过 CSS 变量进一步定制。详见 [主题定制](https://webim-vue-uikit-docs.easemob.com/guide/theme.html) 、 [设计变量](https://webim-vue-uikit-docs.easemob.com/guide/design-tokens.html) 和 [图标](https://webim-vue-uikit-docs.easemob.com/guide/icons.html) 。

![主题定制](/images/uikit/chatuikit/web/vue/overview/theme-custom.png)

### 界面与交互定制

支持按业务需要配置会话列表操作、消息操作菜单和输入区功能，通过事件与插槽接管指定入口或渲染区域。全局能力见 [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) ，局部定制见对应业务组件文档。

![功能扩展](/images/uikit/chatuikit/web/vue/overview/extension-config.png)

### 业务扩展

| 扩展方向 | 说明 | 参考文档 |
| :--- | :--- | :--- |
| 功能开关 | 按业务启用或关闭好友、在线状态、黑名单等能力。 | [Provider 全局配置](https://webim-vue-uikit-docs.easemob.com/components/provider.html) |
| 数据接管 | 对接业务自有的用户资料、联系人、群组等数据获取逻辑。 | [进阶指南](https://webim-vue-uikit-docs.easemob.com/guide/advanced.html) |
| 自定义渲染与插件 | 扩展消息渲染、输入区、操作菜单和聊天页插件。 | [聊天模块](https://webim-vue-uikit-docs.easemob.com/components/chat-container.html) |
| 国际化与文案 | 切换语言，合并或覆盖内置文案。 | [进阶指南](https://webim-vue-uikit-docs.easemob.com/guide/advanced.html) |
| 移动端适配 | 配置安全区、键盘避让和移动布局等能力。 | [H5 适配指南](https://webim-vue-uikit-docs.easemob.com/guide/h5-adaptation.html) |

具体功能是否可用，以所选 UIKit、SDK 版本、服务开通情况和组件配置为准。