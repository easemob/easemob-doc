# React-Native IM SDK 更新日志

<Toc />

## 版本 V1.0.9 Dev 2022-10-08

#### 新增特性

`ChatGroupEventListener` 中新增两个事件：
- `onDetailChanged`：群组详情变更事件。
- `onStateChanged`：群组禁用状态变更事件。

#### 修复

修复聊天室自定义属性问题。

## 版本 V1.0.8 Dev 2022-09-30

#### 新增特性

- 新增聊天室自定义属性功能。
- 在 `ChatOptions` 类中新增 `areaCode` 参数限制连接边缘节点的范围。
- `ChatGroupOptions` 中增加 `isDisabled` 属性显示群组禁用状态，需要开发者在服务端设置。该属性在调用 `ChatGroupManager` 中的 `fetchGroupInfoFromServer` 方法获取群组详情时返回。

#### 修复

- 修复极少数场景下，从服务器获取较大数量的消息时失败的问题。
- 修复数据统计不正确的问题。
- 修复极少数场景下打印日志导致的崩溃。

## 版本 V1.0.5 Dev 2022-6-21

这是 React Native SDK 第一个正式发布的版本，包含以下功能：

- 在单聊、群聊、聊天室和子区中发送和接收消息；
- 管理会话和消息；
- 管理群组和聊天室；
- 用户在线状态订阅；
- 消息表情回复；
- 管理子区等。

关于详细功能概述请参见： [产品概述](/product/introduction.html).

具体集成请参考以下文档：

- [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html)
- [环信即时通讯 IM React-Native 快速开始](quickstart.html)
- [消息管理 React Native](message_overview.html)
- [群组](group_overview.html)
- [聊天室](room_overview.html)
- [用户在线状态订阅 Presence](presence.html)
- [消息表情回复](reaction.html)
- [子区管理](thread.html)
- [API Reference](apireference.html)