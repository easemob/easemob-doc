# 管理聊天室成员

<Toc />

聊天室是支持多人沟通的即时通讯系统。本文介绍如何使用环信即时通讯 IM Flutter SDK 在实时互动 app 中管理聊天室成员，并实现聊天室的相关功能。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `EMChatRoom`、`EMRoomManager` 和 `EMChatRoomEventHandler` 类，支持对聊天室成员的管理，包括添加和移出聊天室成员等，主要方法如下：

- 将成员移出聊天室
- 获取聊天室成员列表
- 管理聊天室黑名单
- 管理聊天室白名单
- 管理聊天室禁言列表
- 开启和关闭聊天室全员禁言
- 管理聊天室所有者及管理员

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 获取聊天室成员列表

所有聊天室成员均可调用 `EMChatRoomManager#fetchChatRoomMembers` 方法获取当前聊天室成员列表。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.fetchChatRoomMembers(
    roomId,
    pageSize: pageSize,
    cursor: cursor,
  );
} on EMError catch (e) {
}
```

### 将成员移出聊天室

仅聊天室所有者和管理员可调用 `EMChatRoomManager#removeChatRoomMembers` 方法将指定成员移出聊天室。
被移出后，该成员收到 `EMChatRoomEventHandler#onRemovedFromChatRoom` 回调，其他成员收到 `EMChatRoomEventHandler#onMemberExitedFromChatRoom` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.removeChatRoomMembers(
    roomId,
    members,
  );
} on EMError catch (e) {
}
```

### 管理聊天室黑名单

#### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `EMChatRoomManager#blockChatRoomMembers` 方法将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `EMChatRoomEventHandler#onRemovedFromChatRoom` 事件，其他成员收到 `EMChatRoomEventHandler#onMemberExitedFromChatRoom` 事件。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.blockChatRoomMembers(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unBlockChatRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.unBlockChatRoomMembers(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#fetchChatRoomBlockList` 方法获取当前聊天室黑名单。

示例代码如下：

```dart
try {
  List<String>? list= await EMClient.getInstance.chatRoomManager.fetchChatRoomBlockList(
    roomId,
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on EMError catch (e) {
}
```

### 管理聊天室白名单

#### 添加成员至聊天室白名单列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#addMembersToChatRoomAllowList` 方法将指定成员添加至聊天室白名单。被添加后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomEventHandler#onAllowListAddedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.addMembersToChatRoomAllowList(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#removeMembersFromChatRoomAllowList` 方法将成员移出聊天室禁言列表。被解除禁言后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomEventHandler#onAllowListRemovedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.removeMembersFromChatRoomAllowList(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `EMChatRoomManager#isMemberInChatRoomAllowList` 方法检查自己是否在白名单中，示例代码如下：

```dart
try {
  bool isInAllowList = await EMClient.getInstance.chatRoomManager.isMemberInChatRoomAllowList(roomId);
} on EMError catch (e) {
}
```

### 管理聊天室禁言列表

#### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#muteChatRoomMembers` 方法将指定成员添加至聊天室禁言列表。被禁言后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomEventHandler#onMuteListAddedFromChatRoom` 事件。

:::notice
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.muteChatRoomMembers(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unMuteChatRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言后，该成员和其他未操作的聊天室管理员或聊天室所有者收到 `EMChatRoomEventHandler#onMuteListRemovedFromChatRoom` 事件。

:::notice
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.unMuteChatRoomMembers(
    roomId,
    members
  );
} on EMError catch (e) {
}
```

#### 获取聊天室禁言列表

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#fetchChatRoomMuteList` 方法获取当前聊天室的禁言列表。

示例代码如下：

```dart
try {
  List<String>? list =
      await EMClient.getInstance.chatRoomManager.fetchChatRoomMuteList(
    roomId,
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on EMError catch (e) {
}
```

### 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

#### 开启聊天室全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#muteAllChatRoomMembers` 方法开启全员禁言。全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `EMChatRoomEventHandler#onAllChatRoomMemberMuteStateChanged` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.muteAllChatRoomMembers();
} on EMError catch (e) {
}
```

#### 关闭聊天室全员禁言

仅聊天室所有者和管理员可以调用 `EMChatRoomManager#unMuteAllChatRoomMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `EMChatRoomEventHandler#onAllChatRoomMemberMuteStateChanged` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.unMuteAllChatRoomMembers();
} on EMError catch (e) {
}
```

### 管理聊天室所有者和管理员

#### 变更聊天室所有者

仅聊天室所有者可以调用 `EMChatRoomManager#changeOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `EMChatRoomEventHandler#onOwnerChangedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.changeOwner(
    roomId,
    newOwner,
  );
} on EMError catch (e) {
}
```

#### 添加聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#addChatRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `EMChatRoomEventHandler#onAdminAddedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.addChatRoomAdmin(
    roomId,
    memberId,
  );
} on EMError catch (e) {
}
```

#### 移除聊天室管理员

仅聊天室所有者可以调用 `EMChatRoomManager#removeChatRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `EMChatRoomEventHandler#onAdminRemovedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await EMClient.getInstance.chatRoomManager.removeChatRoomAdmin(
    roomId,
    adminId,
  );
} on EMError catch (e) {
}
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。
