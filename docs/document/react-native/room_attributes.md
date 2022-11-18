# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM React Native SDK 提供 `ChatRoomManager` 类和 `ChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 获取和更新聊天室基本属性；
- 获取聊天室自定义属性；
- 设置聊天室自定义属性；
- 删除聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 管理聊天室基本属性

对于聊天室名称和描述，你可以调用 [`fetchChatRoomInfoFromServer`](room_manage.html#获取聊天室详情) 获取聊天室详情时查看。

#### 获取聊天室公告

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

#### 更新聊天室公告

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

#### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `changeChatRoomSubject` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

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

#### 更新聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `changeChatroomDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

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
### 管理聊天室自定义属性（key-value）

#### 获取聊天室属性

聊天室所有成员均可调用 `fetchChatRoomAttributes` 方法获取聊天室指定自定义属性。

```typescript
// 通过指定聊天室 ID 和属性 key 检索某些自定义属性。 如果 key 为 `null` 或空字符串，则获取所有内容。
ChatClient.getInstance()
  .roomManager.fetchChatRoomAttributes(roomId, keys)
  .then((response) => {
    rollLog(`success: ${response}`);
  })
  .catch((error) => {
    rollLog(`fail: ${error}`);
  });
```

#### 设置聊天室自定义属性

所有聊天室成员均可调用 `addAttributes` 方法设置一个或多个聊天室自定义属性。利用该方法可设置新属性，也可以修改自己或其他成员设置的现有属性。设置后，其他聊天室成员收到  `onAttributesUpdated` 回调。

```typescript
// 通过指定聊天室 ID、属性 key、属性值、deleteWhenLeft 和 overwrite 设置自定义属性。
// deleteWhenLeft：当前成员退出聊天室时是否自动删除其设置的自定义属性。
// overwrite：是否覆盖其他成员设置的 key 相同的属性。
// 属性可以是数组，支持多对 key-value 属性。
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

#### 删除聊天室属性

聊天室成员可以调用 `removeAttributes` 方法删除聊天室自定义属性。利用该方法可删除自己和其他成员设置的自定义属性。删除后，聊天室其他成员收到  `onAttributesRemoved` 回调。

```typescript
// 通过指定聊天室 ID、属性 key 和 `forced` 删除自定义属性。
// keys 可为数组格式，表示同时删除多个属性，失败返回错误信息。
// `forced` 表示是否删除其他成员设置的 key 相同的属性。
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

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。