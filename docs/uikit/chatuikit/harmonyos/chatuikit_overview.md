# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表及后续界面等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

你可以查看 [UIKit 源码](https://github.com/easemob/easemob-uikit-harmonyos)。

在 UIKit 中主要使用状态管理 V2 版本，如果开发者项目中主要使用状态管理 V1 版本，使用时可参考[自定义组件混用场景指导](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/arkts-custom-component-mixed-scenarios)。

## UIKit 基本项目结构

```
└── chatuikit
    ├── ChatUIKitClient                      // UIKit SDK 入口
    ├── ChatUIKitConfigs                     // UIKit SDK 配置类
    ├── pages                                // UIKit 页面
    │   ├── ChatPage                           // 聊天页面
    │   ├── ConversationListPage               // 会话列表页面
    │   ├── ContactListPage                    // 联系人列表页面
    │   └── CreateGroupPage                    // 创建群组页面
    ├── components                           // UIKit 组件模块
    │   ├── chat                               // 聊天组件模块
    │   │   ├── ChatView                         // 聊天集成组件
    │   │   ├── ChatComponents                   // 聊天页面相关子组件
    │   │   ├── MessageComponents                // 消息相关子组件
    │   │   ├── MessageBuilders                  // 消息相关自定义构件函数
    │   │   └── bubbles                          // 消息不同类型气泡组件
    │   │       ├── MessageTextBubbleView          // 文本消息气泡组件
    │   │       ├── MessageImageBubbleView         // 图片消息气泡组件
    │   │       └── ......                         // 其他消息气泡组件
    │   ├── conversation                       // 会话列表组件模块
    │   │   ├── ConversationListView             // 会话列表集成组件
    │   │   ├── ConversationComponents           // 会话相关子组件
    │   │   └── ConversationBuilders             // 会话相关自定义构件函数
    │   └── contact                            // 联系人组件模块
    │       ├── ContactListView                  // 联系人列表集成组件
    │       ├── ContactComponents                // 联系人列表相关子组件
    │       └── ContactBuilders                  // 联系人相关自定义构件函数
    ├── viewmodels                           // UIKit SDK ViewModel 文件夹
    ├── model                                // UIKit SDK 数据类文件夹
    ├── repositories                         // UIKit SDK 数据仓库类文件夹
    └── constants                            // UIKit SDK 常量类文件夹
```

## 功能介绍

单群聊 UIKit 中业务相关的 UI 页面主要包含在以下三个 Page 中：`ChatPage`、`ConversationListPage` 和 `ContactListPage`。下图展示单群聊 UIKit 的主要功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/main_chat_group.png" title="群聊" />
</ImageGallery>

### 聊天页面功能

`ChatPage` 是提供所有聊天组件的容器。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/message_types_2.png" title="发送多种类型的消息" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/message_longpress.png" title="消息长按操作" />
  <ImageItem src="/images/uikit/chatuikit/android/message_reply.png" title="消息引用" />
  <ImageItem src="/images/uikit/chatuikit/android/message_deliveryreceipt.png" title="送达回执" />
  <ImageItem src="/images/uikit/chatuikit/android/message_readreceipt.png" title="已读回执" />
</ImageGallery>

### 会话列表页面功能

`ConversationListPage` 是提供会话列表组件的容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/harmonyos/conversation_slide.png" title="会话左滑操作" />
  <ImageItem src="/images/uikit/chatuikit/harmonyos/conversation_operation.png" title="会话操作" />
</ImageGallery>

### 通讯录页面功能

`ContactListPage` 是提供联系人列表的容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contact_list.png" title="联系人列表" />
  <ImageItem src="/images/uikit/chatuikit/android/group_list.png" title="群组列表" />
</ImageGallery>

### 页面搜索功能

单群聊 UIKit 提供以下搜索功能：

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/search_conversation.png" title="搜索会话名称" />
  <ImageItem src="/images/uikit/chatuikit/android/search_contact.png" title="搜索联系人名称" />
</ImageGallery>


