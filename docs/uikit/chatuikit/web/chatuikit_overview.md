# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 React UI 组件库。该组件库提供了聊天相关的组件，包括会话列表、聊天界面、联系人列表和群组设置等组件，组件内部集成了 IM SDK，可以帮助开发者不关心内部实现和数据管理就能根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/Easemob-UIKit-web/tree/main)。

## 技术原理

环信单群聊 UIKit 组件内部集成 IM SDK 和环信服务器连接，实现收发消息等功能。组件使用 React Context API 管理内部状态，用户可以使用 UIKit 提供的自定义 hooks 从全局数据获取需要的数据，也可以用自定义 hooks 获取操作这些数据的方法。

![img](@static/images/uikit/chatuikit/web/uikit.png =600x730)

## 功能

`easemob-chat-uikit` 目前提供如下组件：

- 容器组件：`Provider`、`Chat` 、`ConversationList`、`ContactList`。
- module 组件：`BaseMessage`、`AudioMessage`、`FileMessage`、 `VideoMessage`、`ImageMessage`、`TextMessage`、`CombinedMessage`、`UserCardMessage`、`GroupDetail`、`UserSelect`、`Header`、`Empty`、`MessageList`、`ConversationItem`、`MessageInput`、`MessageStatus`、`Typing`。
- 纯 UI 组件：`Avatar`、`Badge`、`Button`、`Checkbox`、`Icon`、`Modal`、`Tooltip`、`scrollList`、`Switch`、`UserItem`、`Broadcast`、`Dropdown`。

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个组件中：

- Chat 提供所有聊天视图的容器。

![img](@static/images/uikit/chatuikit/web/page_chat.png =500x550) 

- ConversationList 提供会话列表容器。

![img](@static/images/uikit/chatuikit/web/page_conversation.png =400x900) 

- ContactList 提供联系人、群组及其详情等容器。

![img](@static/images/uikit/chatuikit/web/page_contact_list.png =400x900) 
