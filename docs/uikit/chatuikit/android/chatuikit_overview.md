# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表及后续界面等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/chatuikit-android)。

## UIKit 基本项目结构

```
└── easeui
    ├── EaseIM                                   // UIKit SDK 入口
    ├── EaseIMConfig                             // UIKit SDK 配置类
    ├── feature                                  // UIKit 功能模块
    │   ├── chat                                   // 聊天功能模块
    │   │   ├── activities                            // 聊天功能模块的 Activity 文件夹
    │   │   │   └── EaseChatActivity                    // UIKit 内置的聊天界面
    │   │   ├── adapter                               // 聊天功能模块的适配器文件夹
    │   │   │   └── EaseMessagesAdapter                 // 聊天功能模块的消息列表适配器
    │   │   ├── reply                                 // 聊天功能模块的回复功能相关
    │   │   ├── report                                // 聊天功能模块的举报消息功能相关
    │   │   ├── viewholders                           // 聊天功能模块的消息类型 ViewHolder
    │   │   ├── widgets                               // 聊天功能模块的自定义 View
    │   │   └── EaseChatFragment                      // UIKit 内提供的聊天 Fragment
    │   ├── conversation                           // 会话列表功能模块
    │   │   ├── adapter                               // 会话列表功能模块的适配器文件夹
    │   │   │   └── EaseConversationListAdapter         // 会话列表功能模块的会话列表适配器
    │   │   ├── viewholders                           // 会话列表功能模块的会话类型 ViewHolder
    │   │   ├── widgets                               // 会话列表功能模块的自定义 View
    │   │   └── EaseConversationListFragment          // UIKit 内提供的会话列表 Fragment
    │   ├── contact                                // 联系人列表功能模块
    │   │   ├── adapter                               // 联系人列表功能模块的适配器文件夹
    │   │   │   └── EaseContactListAdapter              // 联系人列表功能模块的联系人列表适配器
    │   │   ├── viewholders                           // 联系人列表功能模块的联系人相关 ViewHolder
    │   │   ├── widgets                               // 联系人列表功能模块的自定义 View
    │   │   └── EaseContactsListFragment              // UIKit 内提供的联系人列表 Fragment
    │   └── group                                  // 群组功能模块
    ├── repository                               // UIKit SDK 数据仓库
    ├── viewmodel                                // UIKit SDK ViewModel
    ├── provider                                 // UIKit SDK Provider
    ├── common                                   // UIKit SDK 公共类
    ├── interfaces                               // UIKit SDK 接口类
    └── widget                                   // UIKit SDK 自定义 View
```

## 功能介绍

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个 Fragment 中：Chat Fragment、Conversation Fragment 和 Contact Fragment。下图展示单群聊 UIKit 的主要功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
  <ImageItem src="/images/uikit/chatuikit/android/main_chat_group.png" title="群聊" />
</ImageGallery>

### 聊天页面功能

Chat Fragment 提供所有聊天视图的容器。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/chat_detail.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/message_types.png" title="发送多种类型的消息" />
  <ImageItem src="/images/uikit/chatuikit/android/message_longpress.png" title="消息长按操作" />
  <ImageItem src="/images/uikit/chatuikit/android/message_reply.png" title="消息引用" />
  <ImageItem src="/images/uikit/chatuikit/android/message_deliveryreceipt.png" title="已发送回执" />
  <ImageItem src="/images/uikit/chatuikit/android/message_readreceipt.png" title="已读回执" />
</ImageGallery>

### 会话列表页面功能

Conversation Fragment 提供会话列表容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/conversation_longpress.png" title="会话长按操作" />
  <ImageItem src="/images/uikit/chatuikit/android/conversation_operation.png" title="会话操作" />
</ImageGallery>

### 通讯录页面功能

Contact Fragment 提供联系人、群组及其详情等容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contact list.png" title="联系人列表" />
  <ImageItem src="/images/uikit/chatuikit/android/contact_detail.png" title="联系人详情" />
  <ImageItem src="/images/uikit/chatuikit/android/block_list.png" title="联系人黑名单" />
  <ImageItem src="/images/uikit/chatuikit/android/group_list.png" title="群组列表" />
</ImageGallery>

### 群组管理页面功能

群组管理页面提供以下功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/group_detail.png" title="群详情管理" />
  <ImageItem src="/images/uikit/chatuikit/android/group_member.png" title="群成员管理" />
  <ImageItem src="/images/uikit/chatuikit/android/group_thread.png" title="话题" />
  <ImageItem src="/images/uikit/chatuikit/android/group_pin.png" title="消息置顶" />
</ImageGallery>

### 页面搜索功能

单群聊 UIKit 提供以下搜索功能：

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/search_conversation.png" title="搜索会话名称" />
  <ImageItem src="/images/uikit/chatuikit/android/search_contact.png" title="搜索联系人名称" />
  <ImageItem src="/images/uikit/chatuikit/android/search_chat_history.png" title="搜索聊天历史" />
</ImageGallery>

