# 产品概述

<Toc />

环信即时通讯为开发者提供高可靠、低时延、高并发、安全、全球化的通信云服务，支持单聊、群聊、聊天室。提供多平台 SDK 支持，包括：Android、iOS、Web、Windows、Linux、Unity、Flutter、React Native、小程序、uni-app 和 Electron；同时，提供 EaseIM 和 EaseIMKit 以及服务端 REST API，帮助开发者快速构建端到端通信的场景。

## 平台架构

![环信 IM 后台](@static/images/product/framework.png)

## 集成概述

在 [环信即时通讯控制台](enable_and_configure_IM.html) 注册和开通服务后，开发者需要了解服务端和客户端的交互过程，如下图所示。

![img](@static/images/product/integration-overview.png)

服务端和客户端集成以及 Demo 介绍详见下表中的链接文档。

| 项目       | 链接   | 
| :--------- | :----- | 
| 服务端集成 | [环信即时通讯 REST API 概览](/document/server-side/overview.html)。 |
| 客户端 Demo 体验 |<br/> - [Android Demo（EaseIM App)](/document/android/demo.html) <br/> - [iOS Demo（EaseIM App）](/document/ios/demo.html)<br/> - [React Demo（WebIM）](/document/web/demo_react.html)<br/> - [Vue Demo（WebIM）](/document/web/demo_vue.html) |
| 客户端集成| <br/> - [Android 快速开始](/document/android/quickstart.html) 和 [集成概述](/document/android/overview.html)<br/> - [iOS 快速开始](/document/ios/quickstart.html)和 [集成概述](/document/ios/overview.html)<br/> - [Web 快速开始](/document/web/quickstart.html)和[集成概述](/document/web/overview.html)<br/> - [Windows 快速开始](/document/windows/quickstart.html)和 [集成概述](/document/windows/overview.html) <br/> - [Linux 集成概述](/document/linux/overview.html)<br/> - [Unity 快速开始](/document/unity/quickstart.html)和[集成概述](/document/unity/overview.html)<br/> - [Flutter 快速开始](/document/flutter/quickstart.html)和[集成概述](/document/flutter/overview.html)；<br/> - [React Native 快速开始](/document/react-native/quickstart.html)和[集成概述](/document/react-native/overview.html)<br/> - [Electron 集成概述](/document/electron/overview.html)<br/> - [uni-app 集成概述](/document/applet/uniapp.html)|


## 功能概述

用环信即时通讯能实现以下功能：

### 单聊

单聊，即一对一聊天，支持丰富的消息类型，以及离线消息、漫游消息等功能。

### 群组聊天和聊天室

[群组聊天](/document/android/group_overview.html)和[聊天室](/document/android/room_overview.html)，支持丰富的消息类型，支持完整的群组和聊天室管理能力。

群组和聊天室的聊天功能类似，区别详见 [群组概述](/document/android/group_overview.html#群组与聊天室的区别)。下表以群组为例，介绍群组和聊天室的功能。

| 功能 | 描述 |
| :--------- | :----- | 
| [群组管理](/document/android/group_manage.html) | <br/> - 创建、解散群组；<br/> - 获取群组详情、群组列表和群成员列表；<br/> - 查询当前用户已加入的群组数量；<br/> - 屏蔽和解除屏蔽群消息。 |
| [群成员管理](/document/android/group_members.html) | <br/> - 加入、退出群组；<br/> - 设置和获取群成员的自定义属性；<br/> - 变更群主和群管理员的管理；<br/> - 白名单；<br/> - 黑名单；<br/> - 禁言。|
| [群组属性管理](/document/android/group_attributes.html) | <br/> - 修改群组名称、描述和公告；<br/> - 管理群组共享文件；<br/> - 支持群扩展字段|

### 消息

消息表示发送方对接收方发送的内容，消息包括多种类型，如：文本、图片、语音、视频、位置、透传、红包和礼物等自定义消息、合并消息和定向消息等。消息功能如下所示：

- [发送、接收消息](/document/android/message_send_receive.html)；
- [获取服务端和本地消息](/document/android/message_retrieve.html)；
- [撤回消息](/document/android/message_recall.html)；
- [修改消息](/document/android/message_modify.html)；
- [消息回执](/document/android/message_receipt.html)：送达回执和已读回执；
- [消息翻译](/document/android/message_translation.html)；
- [搜索](/document/android/message_search.html)、[导入、插入](/document/android/message_import_insert.html)和[删除](/document/android/message_delete.html)消息；
- [获取消息流量统计](/document/android/message_traffic_statis.html)。

### 会话

会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息、查看或清空历史消息等操作。

会话功能如下所示：

- [会话列表](/document/android/conversation_list.html)：获取服务端和本地的会话列表。
- [会话未读数](/document/android/conversation_unread.html)：获取会话未读数和清零。
- [置顶](/document/android/conversation_pin.html)、[标记](/document/android/conversation_mark.html)、[删除](/document/android/conversation_delete.html)会话。

### 用户管理

支持用户体系、用户属性和用户关系管理功能：

- [用户体系](/document/server-side/user_relationship.html)：用户账号的注册、删除、修改用户密码、获取用户在线状态和指定账号的在线登录设备。
- [用户属性](/document/android/userprofile.html)：设置和获取用户属性，包括用户头像、昵称和自定义信息。
- [用户关系](/document/android/user_relationship.html)：好友管理，包括添加/删除好友，将好友添加或移除黑名单等。

### 离线推送

客户端断开连接或应用进程被关闭等原因导致用户离线时，即时通讯 IM 会通过第三方消息推送服务向该离线用户的设备推送消息通知。当用户再次上线时，服务器会将离线期间的消息发送给用户，确保用户收到离线期间的消息。

[Android 推送](/document/android/push.html)支持 Firebase Cloud Message(FCM)、华为、OPPO、小米、vivo 和魅族推送。[iOS 推送](/document/ios/push.html)使用 Apple Push Notification service(APNs) 。

### 多设备登录

环信支持同一账号同时登录多台设备，可实现终端用户的消息通过服务器保存和同步，确保各端均能收发消息同步。

[多设备登录](/document/android/multi_device.html)的情况下，可同步以下信息和操作：

- 消息：包括在线消息、离线消息、推送通知（若开启了第三方推送服务，离线设备收到）以及对应的回执和已读状态等；
- 好友和群组相关操作；
- 子区相关操作；
- 会话相关操作。

### 在线状态订阅

[用户在线状态](/document/android/presence.html)（即 Presence）包含用户的在线、离线以及自定义状态。

- [发布自定义在线状态](/document/android/presence.html#发布自定义在线状态)；
- [订阅](/document/android/presence.html#订阅指定用户的在线状态)/[取消订阅](/document/android/presence.html#取消订阅指定用户的在线状态)用户的在线状态；
- [查询订阅列表](/document/android/presence.html#查询被订阅用户列表)、[查询用户当前在线状态](/document/android/presence.html#获取用户的当前在线状态)。

### 消息表情回复

环信即时通讯 IM 提供消息表情回复（简称 “Reaction”）功能。用户可以在单聊和群聊中对消息添加、删除表情。表情可以直观地表达情绪，利用 Reaction 可以提升用户的使用体验。同时在群组中，利用 Reaction 可以发起投票，根据不同表情的追加数量来确认投票。

Reaction 的功能如下：

- [添加](/document/android/reaction.html#在消息上添加-reaction)、[删除](/document/android/reaction.html#删除消息的-reaction) Reaction；
- [获取消息的 Reaction 列表](/document/android/reaction.html#获取消息的-reaction-列表)；
- [获取 Reaction 详情](/document/android/reaction.html#获取-reaction-详情)。

### 子区

子区是群组成员的子集，是支持多人沟通的即时通讯系统，支持以下功能：

- [子区管理](/document/android/thread.html)：创建、解散、加入、退出子区；
- [获取子区信息](/document/android/thread.html#获取子区详情)：获取子区详情、最新消息、子区列表和成员列表；
- [子区消息管理](/document/android/thread_message.html)：发送、接收、撤回和获取子区消息。

### 内容审核

支持使用 IM [内容审核服务](/product/moderation/moderation_overview.html)对消息内容进行多样化场景检测，帮助您对应用消息内容进行管控，规避内容违规风险。

- 多消息类型审核：智能识别文本、图片和音视频文件；

- 自定义消息处置规则：自定义消息下发或拦截的策略；

- 消息审核结果可回调：支持将消息审核结果回调至客户服务器；

- 一站式内容审核后台：提供可视化的内容审核后台，支持查询审核记录、审核数据统计。

### 场景方案

#### 超级社区

[环信超级社区（Circle）](/product/circle/circle_overview.html)是一款基于环信 IM 打造的类 Discord 实时社区应用场景方案，支持社区（Server）、频道（Channel） 和子区（Thread） 三层结构。一个 App 下可以有多个社区，同时支持陌生人/好友单聊。用户可创建和管理自己的社区，在社区中设置和管理频道将一个话题下的子话题进行分区，在频道中根据感兴趣的某条消息发起子区讨论，实现万人实时群聊，满足超大规模用户的顺畅沟通需求。

#### 语聊房

[环信语聊房（Easemob Chat Room）](/product/voiceroom/demo_scenario_introduction.html)场景方案是环信打造的一款低门槛、高可用的语聊房场景方案。该场景方案融合了环信即时通讯云的聊天室和声网 RTC 的音频技术，提供市面主流的语聊房 App 的功能，其核心功能包括房间管理、麦位控制、聊天打赏和音频特效等，覆盖语音游戏、语音社交、相亲交友等场景，能够较为全面满足客户的语聊房开发需求。同时，环信 IM 的聊天室中的 KV 属性管理和自动销毁以及消息优先级等功能能够对语聊房的功能性进行有效补充和拓展。

## 适用场景

环信适用于端到端实时消息沟通的场景：

- 应用内聊天（如：陌生人社交、相亲等）
  - 支持丰富的消息类型、好友关系管理
  - 支持群管理能力、群公告设置、群角色设置等
- 应用内通知
  - 支持广播消息、自定义通知消息等
  - 支持用户管理，包括储存用户信息、用户封禁等
- 视频/语音直播
  - 支持聊天室管理能力
  - 支持丰富类型的聊天室消息，包括弹幕、红包、礼物等
- 企业协作
  - 支持用户管理，设置企业组织架构、好友关系管理
  - 支持群管理能力、群公告设置、群附件发送、群角色设置等
- 买家卖家沟通
  - 支持订单通知、问候语设置、自定义消息发送
  - 支持卖家内部管理、公告设置、成员管理等
- 线上问诊
  - 支持丰富的消息类型，图文病情描述、语音消息等
  - 支持用户信息存储、用户身份管理等

## 产品优势

环信主要有以下优势：

### 全球部署

环信在全球设有五大数据中心、200+ 边缘加速节点，网络服务覆盖全球 200 多个国家和地区。

### 低延时

环信全球平均延时小于 200 毫秒，相同区域平均延时小于 100 毫秒。

### 高并发

环信支持同时在线人数无上限，聊天室亿级消息并发。

### 高可靠性

环信数据中心同城三中心部署，SLA 99.95%。 优异的弱网对抗能力，70% 丢包情况下消息到达率 100%。

### 多平台

环信即时通讯 IM 支持 Android、iOS、Web 等平台，而且各平台之间可互通。下表为即时通讯支持的各平台版本：

| 平台     | 支持的版本                                   |
| ------------ | ------------------------------------------------------------ |
| Android      | Android 5.0 或以上版本（API 级别 21 或以上）   |
| iOS          | iOS 10.0 或以上版本                                            |
| Web          | <br/> - Internet Explorer 9 或以上 <br/> - FireFox 10 或以上 <br/> - Chrome 54 或以上 Safari 6 或以上<br/> - Edge 12 或以上 <br/> - Opera 58 或以上<br/> - iOS Safari 7 或以上<br/> - Android Browser 4.4 (KitKat) 或以上 |
| Unity        | Unity 2017 或以上版本                                         |
| Windows      | Windows 10 或以上版本                                       |
| React Native | React Native 0.63.4 或以上版本                              |
| Flutter      | Flutter 2.10                                                 |