# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM SDK 提供 `ChatRoomManager` 类和 `ChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- `ChatRoomManager#fetchChatroomAnnouncement`：获取聊天室公告。
- `ChatRoomManager#changeChatroomAnnouncement`：更新聊天室公告。
- `ChatRoomManager#changeChatroomName`：修改聊天室名称。
- `ChatRoomManager#changeChatroomDescription`：修改聊天室描述。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)；
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法



### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatroomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.fetchChatroomAnnouncement(chatRoomId).then(announcement => console.log(announcement));
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChanged` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomAnnouncement(chatRoomId, announcement).then(chatroom => {
    // success logic
});
```

### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomName` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomName(chatRoomId, newName).then(chatroom => {
    // success logic
});
```

### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.changeChatroomDescription(chatRoomId, newDescription).then(chatroom => {
    // success logic
});
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。