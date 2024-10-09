# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 React UI 组件库。该组件库提供了聊天相关的组件，包括会话列表、聊天界面、联系人列表和群组设置等组件，组件内部集成了 IM SDK，可以帮助开发者不关心内部实现和数据管理就能根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/Easemob-UIKit-web/tree/main)。

## 技术原理

环信单群聊 UIKit 组件内部集成 IM SDK 和环信服务器连接，实现收发消息等功能。组件使用 React Context API 管理内部状态，用户可以使用 UIKit 提供的自定义 hooks 从全局数据获取需要的数据，也可以用自定义 hooks 获取操作这些数据的方法。

![img](/images/uikit/chatuikit/web/uikit.png =600x730)

## 功能介绍

`easemob-chat-uikit` 目前提供如下组件：

- 容器组件：`Provider`、`Chat` 、`ConversationList`、`ContactList`。
- module 组件：`BaseMessage`、`AudioMessage`、`FileMessage`、 `VideoMessage`、`ImageMessage`、`TextMessage`、`CombinedMessage`、`UserCardMessage`、`GroupDetail`、`UserSelect`、`Header`、`Empty`、`MessageList`、`ConversationItem`、`MessageInput`、`MessageStatus`、`Typing`。
- 纯 UI 组件：`Avatar`、`Badge`、`Button`、`Checkbox`、`Icon`、`Modal`、`Tooltip`、`scrollList`、`Switch`、`UserItem`、`Broadcast`、`Dropdown`。

单群聊 UIKit 中业务相关的 UI 控件主要包含在三个组件中：`Chat`、`ConversationList` 和 `ContactList`。

下图展示单群聊 UIKit 的主要功能：

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_chat.png" title="会话列表+聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_group_detail.png" title="会话列表+群组设置" />
  <ImageItem src="/images/uikit/chatuikit/web/main_conversation_list_contact_detail.png" title="会话列表+联系人设置" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_group.png" title="联系人列表+群组" />
  <ImageItem src="/images/uikit/chatuikit/web/main_contact_list_contact.png" title="联系人列表+联系人" />
</ImageGallery>

### 聊天页面功能

`Chat` 提供所有聊天视图的容器。

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/message_types.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/web/message_operation.png" title="消息操作" />
  <ImageItem src="/images/uikit/chatuikit/web/message_reply.png" title="消息引用" />
  <ImageItem src="/images/uikit/chatuikit/web/message_deliveryreceipt.png" title="已发送回执" />
  <ImageItem src="/images/uikit/chatuikit/web/message_readreceipt.png" title="已读回执" />
</ImageGallery>

### 会话列表页面功能

`ConversationList` 提供会话列表容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/web/conversation_operation.png" title="会话操作" />
</ImageGallery>

### 通讯录页面功能

`ContactList` 提供联系人、群组及其详情等容器。

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/contact_list_info.png" title="联系人列表及详情" />
  <ImageItem src="/images/uikit/chatuikit/web/contact_block_list.png" title="联系人黑名单" />
</ImageGallery>

### 群组管理页面功能

群组管理页面提供以下功能：

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/group_mgmt.png" title="群组管理" />
  <ImageItem src="/images/uikit/chatuikit/web/group_thread.png" title="话题" />
</ImageGallery>

### 页面搜索功能

单群聊 UIKit 提供以下搜索功能：

<ImageGallery :columns="1">
  <ImageItem src="/images/uikit/chatuikit/web/search_conversation.png" title="搜索会话名称" />
  <ImageItem src="/images/uikit/chatuikit/web/search_contact.png" title="搜索联系人名称" />
  <ImageItem src="/images/uikit/chatuikit/web/search_chat_history.png" title="搜索聊天历史" />
</ImageGallery>

