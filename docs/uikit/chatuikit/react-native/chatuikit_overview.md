# 概述

<Toc />

环信聊天 UIKit 是基于环信即时通讯云 IM SDK 开发的一款即时通讯 UI 组件库，提供各种组件实现会话列表、聊天界面、联系人列表等功能，帮助开发者根据实际业务需求快速搭建包含 UI 界面的即时通讯应用。

若要访问源码，请点击[这里](https://github.com/easemob/react-native-chat-library)。

## UIKit 基本项目结构

环信即时通讯 `Chat UIKit SDK` 是基于 `Chat SDK`，增加相关的 UI 页面和组件，提供主题、国际化等常用工具的产品。

以下是 `Chat UIKit SDK` 项目的结构概览。

```sh
├── CHANGELOG.md // 更新日志
├── CODE_OF_CONDUCT.md // 行为准则
├── CONTRIBUTING.md  // 贡献指南
├── LICENSE // 开源协议
├── README.md // 项目介绍
├── README.zh.md // 项目介绍
├── lib // 编译后的文件，类型定义
│   ├── commonjs // commonjs
│   ├── module // esm
│   └── typescript // typescript
├── node_modules // 依赖
├── package.json // 项目配置
├── src // 源码
│   ├── assets // 静态资源
│   ├── biz // 业务代码
│   ├── chat // Chat SDK 封装，提供基础服务
│   ├── config // 配置组件
│   ├── config.local.ts // 本地配置
│   ├── const.tsx // 常量
│   ├── container // 容器组件，程序入口组件
│   ├── error // 错误处理
│   ├── hook // 自定义 hook
│   ├── i18n // 国际化
│   ├── index.tsx // 源码入口
│   ├── services // 服务组件
│   ├── theme // 主题组件
│   ├── types.tsx // 类型定义
│   ├── ui // 基础 UI 组件，为业务组件提供基础服务
│   ├── utils // 工具函数
│   └── version.ts // Chat UIKit SDK 版本信息
├── tsconfig.build.json // 编译配置
└── tsconfig.json // 编译配置
```

## 功能

环信即时通讯 `Chat UIKit SDK` 提供的主要功能包括：主题、国际化、多媒体处理、联系人页面、会话列表、会话详情、错误处理等。

核心组件介绍如下：

| 组件集合名称 | 描述                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| Container    | 入口组件，在应用程序入口使用，设置全局配置和初始化 UI 组件库。                                                       |
| Theme        | 主题组件，由 `Palette` 和 `Theme` 组成，可以配置 UI 组件的颜色和样式。                                               |
| i18n         | 国际化组件，默认提供中英文 UI 组件的国际化内容，支持更改内容和自定义目标语言。                                       |
| biz          | 页面级业务组件集合。包括`ConversationList`,`ContactList`,`GroupList`, `GroupParticipantList`和`ConversationDetail`等 |
| chat         | 消息服务组件。所有关于消息的非页面处理都在这里。                                                                     |
| config       | 配置服务组件。全局配置设置都在这里。                                                                                 |
| dispatch     | 事件分发组件。可以进行组件之间通信。                                                                                 |
| error        | 对错对象。`uikit`里面的错误错误对象都在这里定义。                                                                    |
| hook         | 自定义的钩子组件。为其它组件服务。                                                                                   |

| 页面级组件名称       | 描述                                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------------- |
| ConversationList     | 会话列表组件，提供显示和管理会话列表。                                                                               |
| ContactList          | 联系人列表组件，提供显示和管理联系人列表。在联系人列表、新会话、创建群组、添加群成员、分享名片、转发消息页面中复用。 |
| ConversationDetail   | 消息页面组件，可以收发消息、加载历史消息，支持单群聊。在聊天、搜索、话题、创建话题页面中复用。                       |
| GroupList            | 群组列表组件，提供显示和管理群组列表。                                                                               |
| GroupParticipantList | 群成员列表组件，提供显示和管理群成员列表。在添加成员、删除成员、修改群拥有者、多人音视频中复用。                     |
| NewRequests          | 新通知列表组件，接收和处理好友请求处理。                                                                             |
| CreateGroup          | 创建群组组件。                                                                                                       |
| ContactInfo          | 联系人详情组件。                                                                                                     |
| GroupInfo            | 群组详情组件。                                                                                                       |

## 组件样例

单群聊 UIKit 中业务相关的 UI 控件主要包含在以下三个组件中：

- `ConversationDetail` 提供会话列表容器。

![img](@static/images/uikit/chatuikit/android/page_chat.png =400x890)

- `ConversationList` 提供所有聊天视图的容器。

![img](@static/images/uikit/chatuikit/android/page_conversation.png =400x850)

- `ContactList` 提供联系人、群组及其详情等容器。

![img](@static/images/uikit/chatuikit/android/page_contact_list.png =400x850)
