# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。本文介绍如何管理聊天室的属性信息。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMChatroomManager` 类、 `EMChatroomManagerDelegate` 类 和 `EMChatroom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取聊天室公告
- 更新聊天室公告
- 更新聊天室名称
- 更新聊天室描述

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 获取聊天室公告

聊天室所有成员均可调用 `getChatroomAnnouncementWithId` 方法获取聊天室公告。

示例代码如下：

```objectivec
[EMClient.sharedClient.roomManager getChatroomAnnouncementWithId:@"chatRoomId" error:&error];
```

### 修改聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatroomAnnouncementWithId` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `chatroomAnnouncementDidUpdate` 回调。

示例代码如下：

```objectivec
EMError *error =  nil;
[[EMClient sharedClient].roomManager updateChatroomAnnouncementWithId:_chatroomId announcement:textString error:&error];
```

### 更新聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `updateSubject` 方法设置和更新聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```objectivec
EMError *error = nil;
[[EMClient sharedClient].roomManager updateSubject:textString forChatroom:self.chatroom.chatroomId error:&error];
```

### 更新聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `updateDescription` 方法设置和更新聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```objectivec
EMError *error = nil;
[[EMClient sharedClient].roomManager updateDescription:textString forChatroom:self.chatroom.chatroomId error:&error];
```

## 更多操作

你可以参考如下文档，在项目中实现更多的聊天室相关功能：

- [聊天室概述](room_overview.html)
- [创建和管理聊天室以及监听器介绍](room_manage.html)
- [管理聊天室成员](room_members.html)
