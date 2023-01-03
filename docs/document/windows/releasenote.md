# Windows IM SDK 更新日志

<Toc />

## 版本 V1.0.8 Dev 2022-9-30（开发版）

#### 新增特性

- 新增聊天室自定义属性功能。
- `ChatGroup` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `IGroupManager` 中的 `GetGroupSpecificationFromServer` 方法获取群组详情时返回。
#### 优化

- 移除 SDK 一部分冗余日志；
- 将命名空间由 ChatSDK 改为 AgoraChat。
        
#### 修复

  1. 修复极少数场景下，从服务器获取较大数量的消息时失败的问题。
  2. 修复数据统计不正确的问题。       
  3. 修复极少数场景下打印日志导致的崩溃。
  4. 修复连接监听器有时无法接收到连接回调的问题。

## 版本 V1.0.5 2022-08-05

新增特性

- [在线状态订阅](presence.html)
- [消息表情回复](reaction.html)
- [管理子区](thread.html)
- [内容举报](moderation.html)

## 版本 V1.0.2.1 2022-06-22

这是环信即时通讯 IM Windows SDK 第一个正式发布的版本，包含以下功能：

- 在单聊、群聊、聊天室中发送和接收消息；
- 管理会话和消息；
- 管理群组和聊天室；
- 关于详细功能概述请参见：[产品概述](/product/introduction.html)

具体集成请参考以下文档：

- [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)
- [环信即时通讯 IM Windows 快速入门](quickstart.html)
- [消息管理 Windows](message_overview.html)
- [群组 Windows](group_overview.html)
- [聊天室 Windows](room_overview.html)
- [Windows API Reference](apireference.html)