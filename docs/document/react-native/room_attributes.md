# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。本文介绍如何管理聊天室的属性信息。

## 技术原理

环信即时通讯 IM React Native SDK 提供 `ChatRoomManager` 类和 `ChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取聊天室公告
- 更新聊天室公告
- 更新聊天室名称
- 更新聊天室描述
- 添加聊天室属性
- 获取聊天室属性
- 删除聊天室属性

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 获取聊天室公告

聊天室所有成员均可调用 `fetchChatRoomAnnouncement` 方法获取聊天室公告。

示例代码如下：

```typescript
ChatClient.getInstance()
  .roomManager.fetchChatRoomAnnouncement(roomId)
  .then((ann) => {
    console.log("get ann success.", ann);
  })
  .catch((reason) => {
    console.log("get ann fail.", reason);
  });
```

### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatRoomAnnouncement` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `onAnnouncementChanged` 回调。

示例代码如下：

```typescript
ChatClient.getInstance()
  .roomManager.updateChatRoomAnnouncement(roomId, announcement)
  .then(() => {
    console.log("update ann success.");
  })
  .catch((reason) => {
    console.log("update ann fail.", reason);
  });
```

### 更新聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatRoomSubject` 方法设置和更新聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```typescript
ChatClient.getInstance()
  .roomManager.changeChatRoomSubject(roomId, subject)
  .then(() => {
    console.log("change subject success.");
  })
  .catch((reason) => {
    console.log("change subject fail.", reason);
  });
```

### 更新聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomDescription` 方法设置和更新聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```typescript
ChatClient.getInstance()
  .roomManager.changeChatRoomDescription(roomId, desc)
  .then(() => {
    console.log("change desc success.");
  })
  .catch((reason) => {
    console.log("change desc fail.", reason);
  });
```

### 添加聊天室属性

聊天室成员可以调用 `addAttributes` 方法设置聊天室自定义属性。该方法只针对未设置的自定义属性字段和更新自己设置的属性。设置后，其他聊天室成员收到 `onAttributesUpdated` 回调。

```typescript
// 通过指定聊天室 ID、属性键、属性值、deleteWhenLeft 和覆盖来设置自定义属性。
// deleteWhenLeft 表示离开房间时删除该属性。
// overwrite 表示强制覆盖同一个key的属性。
// 属性可以是数组，支持多对k-v属性。
ChatClient.getInstance()
  .roomManager.addAttributes({
    roomId,
    attributes,
    deleteWhenLeft,
    overwrite,
  })
  .then((response) => {
    rollLog(`success: ${response}`);
  })
  .catch((error) => {
    rollLog(`fail: ${error}`);
  });
```


### 获取聊天室属性

聊天室所有成员均可调用 `fetchChatRoomAttributes` 方法获取聊天室指定自定义属性。

```typescript
// 通过指定聊天室 ID 和属性键检索某些自定义属性。 如果 key 为空，则获取所有内容。
ChatClient.getInstance()
  .roomManager.fetchChatRoomAttributes(roomId, keys)
  .then((response) => {
    rollLog(`success: ${response}`);
  })
  .catch((error) => {
    rollLog(`fail: ${error}`);
  });
```

### 删除聊天室属性

聊天室成员可以调用 `removeAttributes` 方法删除聊天室自定义属性。该方法只能删除自己设置的自定义属性。删除后，聊天室其他成员收到 `onAttributesRemoved` 回调。

```typescript
// 通过指定聊天室 ID、属性键和强制删除自定义属性。
// keys可以做一个数组，同时删除多个属性，失败返回错误信息。
// 强制意味着强制删除一个属性。
ChatClient.getInstance()
  .roomManager.removeAttributes({
    roomId,
    keys,
    forced,
  })
  .then((response) => {
    rollLog(`success: ${response}`);
  })
  .catch((error) => {
    rollLog(`fail: ${error}`);
  });
```

### 更多

你可以参考如下文档，在项目中实现聊天室事件监听：

- [监听器介绍](room_manage.html)