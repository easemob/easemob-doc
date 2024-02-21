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

## 功能

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个 Fragment 中：

- Chat Fragment 提供所有聊天视图的容器。

![img](@static/images/uikit/chatuikit/android/page_chat.png =400x890) 

- Conversation Fragment 提供会话列表容器。

![img](@static/images/uikit/chatuikit/android/page_conversation.png =400x850) 

- Contact Fragment 提供联系人、群组及其详情等容器。

![img](@static/images/uikit/chatuikit/android/page_contact_list.png =400x850) 