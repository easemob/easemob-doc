# 概述

<Toc />

环信单群聊 UIKit 是基于环信即时通讯 IM  IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表及后续界面等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

你可以查看 [UIKit 源码](https://github.com/easemob/easemob-uikit-uniapp)。

## 体验 Demo

- [H5](https://uniapp-h5.easemob.com/)；
- [Android](https://www.pgyer.com/unggU6xu)；
- [iOS](https://www.pgyer.com/LvuQvWCN)；

## UIKit 基本项目结构

```
└── ChatUIKit
    ├── assets                                 // UIKit 资源文件
    ├── components                             // UIKit 通用组件
    ├── const                                  // UIKit 常量
    ├── locales                                // UIKit 国际化
    ├── modules                                // UIKit 页面组件
    │   ├── Chat                                  // 聊天功能模块
    │   ├── ChatNew                               // 发起新会话模块
    │   ├── ContactAdd                            // 添加联系人模块
    │   ├── ContactList                           // 联系人列表模块      
    │   ├── ContactRequestList                    // 联系人好友请求列表模块
    │   ├── ContactSearchList                     // 联系人搜索列表模块
    │   ├── Conversation                          // 会话列表模块
    │   ├── ConversationSearchList                // 会话搜索列表模块
    │   ├── GroupCreate                           // 创建群组模块
    │   ├── GroupList                             // 群组列表模块
    │   ├── VideoPreview                          // 视频消息预览模块
    ├── store                                  // UIKit store
    │   ├── appUser.ts                            // UIKit用户属性store
    │   ├── chat.ts                               // IM连接状态和事件处理
    │   ├── config.ts                             // UIKit Config
    │   ├── conn.ts                               // 管理 SDK 实例
    │   ├── contact.ts                            // 联系人相关 store
    │   ├── conversation.ts                       // 会话相关 store
    │   ├── group.ts                              // 群组相关 store
    │   ├── message.ts                            // 消息相关 store
    ├── styles                                 // UIKit 通用样式
    ├── types                                  // UIKit 类型定义
    ├── utils                                  // UIKit 通用工具函数
    ├── configTypes.ts                         // UIKit 配置类型定义
    ├── index.ts                               // UIKit 入口文件
    ├── log.ts                                 // UIKit 日志类
    ├── sdk.ts                                 // UIKit IM SDK 类型
```

## 功能介绍

单群聊 UIKit 中业务相关的 UI 组件在 `ChatUIKit/modules` 目录下，下图展示单群聊 UIKit 的主要功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/main_chat.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/android/main_conversation_list.png" title="会话列表" />
  <ImageItem src="/images/uikit/chatuikit/android/main_contact_list.png" title="通讯录" />
  <ImageItem src="/images/uikit/chatuikit/uniapp/main_chat_group.png" title="群聊" />
</ImageGallery>

### 聊天页面功能

`ChatUIKit/modules/Chat` 提供所有聊天视图的容器。

<ImageGallery :columns="3">
  <ImageItem src="/images/uikit/chatuikit/android/chat_detail.png" title="聊天页面" />
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_types.png" title="发送多种类型的消息" />
  <ImageItem src="/images/uikit/chatuikit/uniapp/message_operation.png" title="消息操作" />
  <ImageItem src="/images/uikit/chatuikit/android/message_reply.png" title="消息引用" />
  <ImageItem src="/images/uikit/chatuikit/android/message_deliveryreceipt.png" title="已发送回执" />
  <ImageItem src="/images/uikit/chatuikit/android/message_readreceipt.png" title="已读回执" />
</ImageGallery>

### 会话列表页面功能

`ChatUIKit/modules/Conversation` 提供会话列表容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/uniapp/conversation_swipe_left.png" title="会话左滑操作" />
</ImageGallery>

### 通讯录页面功能

`ChatUIKit/modules/ContactList` 提供联系人列表容器, `ChatUIKit/modules/GroupList` 提供群组列表容器。

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/contact_list.png" title="联系人列表" />
  <ImageItem src="/images/uikit/chatuikit/android/group_list.png" title="群组列表" />
</ImageGallery>

### 页面搜索功能

单群聊 UIKit 提供以下搜索功能：

<ImageGallery>
  <ImageItem src="/images/uikit/chatuikit/android/search_conversation.png" title="搜索会话名称" />
  <ImageItem src="/images/uikit/chatuikit/android/search_contact.png" title="搜索联系人名称" />
</ImageGallery>

