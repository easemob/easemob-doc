# 管理聊天室成员

## 功能说明

聊天室是支持多人沟通的即时通讯系统，适用于直播互动、开放讨论和消息广播等多人实时互动场景。本文介绍如何使用 SDK 管理聊天室成员，包括查询成员列表、管理员、白名单、黑名单和禁言等功能。

成员加入、退出和被移出聊天室的操作详见 [创建和管理聊天室](room_manage.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 获取聊天室成员列表

所有聊天室成员均可调用 `fetchChatRoomMembers` 方法获取当前聊天室成员列表。服务器不对成员进行排序，因此，返回的成员列表不保证有序。

示例代码如下：

```dart
// cursor：从该游标位置开始取数据。首次调用时不传，从最新数据开始获取。
// pageSize：每页期望返回的成员数，最大值为 1,000，默认值为 200。
try {
  final ChatCursorResult<String> result = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomMembers(
        chatRoomId,
        cursor: cursor,
        pageSize: pageSize,
      );

  final List<String> members = result.data;
  cursor = result.cursor;
  // cursor 为空字符串时，表示没有更多数据。
} on ChatError catch (e) {
  // 获取成员列表失败。
}
```

## 管理聊天室黑名单

聊天室黑名单中的成员不能加入聊天室，也不能在该聊天室中收发消息。

### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `ChatRoomManager.blockChatRoomMembers` 方法将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `ChatRoomEventHandler.onRemovedFromChatRoom` 回调。默认情况下，其他成员不会收到事件通知。如需该事件，请联系商务开通。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

```dart
try {
  await ChatClient.getInstance.chatRoomManager.blockChatRoomMembers(
    chatRoomId,
    members,
  );
  // 加入黑名单成功。
} on ChatError catch (e) {
  // 加入黑名单失败。
}
```

### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `ChatRoomManager.unBlockChatRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.unBlockChatRoomMembers(
    chatRoomId,
    members,
  );
  // 移出黑名单成功。
} on ChatError catch (e) {
  // 移出黑名单失败。
}
```

### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager.fetchChatRoomBlockList` 方法获取当前聊天室黑名单。

示例代码如下：

```dart
// pageNum：当前页码，从 1 开始，默认值为 1。
// pageSize：每页期望获取的黑名单成员数，默认值为 200。
try {
  final List<String> blockList = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomBlockList(
        chatRoomId,
        pageNum: pageNum,
        pageSize: pageSize,
      );
  // 获取黑名单成功。
} on ChatError catch (e) {
  // 获取黑名单失败。
}
```

## 管理聊天室白名单

聊天室所有者和管理员默认会被加入聊天室白名单。聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

开启全员禁言后，聊天室所有者、管理员和白名单成员仍可发送消息；若成员同时被单独禁言，则仍不能发送消息。

### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `fetchChatRoomAllowListFromServer` 获取当前聊天室白名单成员列表。

示例代码如下：

```dart
try {
  final List<String> allowList = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomAllowListFromServer(chatRoomId);
} on ChatError catch (e) {
}
```

### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `isMemberInChatRoomAllowList` 方法检查自己是否在聊天室白名单中，示例代码如下：

```dart
try {
  final bool isInAllowList = await ChatClient
      .getInstance.chatRoomManager
      .isMemberInChatRoomAllowList(chatRoomId);
} on ChatError catch (e) {
}
```

### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `addMembersToChatRoomAllowList` 将成员加入聊天室白名单。被添加白名单的成员会收到 `onAllowListAddedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.addMembersToChatRoomAllowList(
    chatRoomId,
    members,
  );
} on ChatError catch (e) {
}
```

### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `removeMembersFromChatRoomAllowList` 将成员从聊天室白名单移出。被移出白名单的成员会收到 `onAllowListRemovedFromChatRoom` 事件。

示例代码如下：

```dart
try {
  await ChatClient
      .getInstance.chatRoomManager
      .removeMembersFromChatRoomAllowList(
        chatRoomId,
        members,
      );
} on ChatError catch (e) {
}
```

## 管理聊天室禁言列表

被单独禁言的成员不能在聊天室中发送消息。即使该成员同时在白名单中，单独禁言仍然生效。

### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager.muteChatRoomMembers` 方法将指定成员添加至聊天室禁言列表。被禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `ChatRoomEventHandler.onMuteListAddedFromChatRoom` 回调。

:::tip
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```dart
// duration：禁言时长，单位为毫秒。传 -1 表示永久禁言，默认值为 -1。
try {
  await ChatClient.getInstance.chatRoomManager.muteChatRoomMembers(
    chatRoomId,
    members,
    duration: duration,
  );
  // 添加禁言成功。
} on ChatError catch (e) {
  // 添加禁言失败。
}
```

### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager.unMuteChatRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `ChatRoomEventHandler.onMuteListRemovedFromChatRoom` 回调。

:::tip
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.unMuteChatRoomMembers(
    chatRoomId,
    members,
  );
  // 解除禁言成功。
} on ChatError catch (e) {
  // 解除禁言失败。
}
```

### 获取聊天室禁言列表

仅聊天室所有者和管理员可调用 `fetchChatRoomMuteList` 获取聊天室禁言列表。该方法返回禁言成员的用户 ID 列表，不返回禁言到期时间。

示例代码如下：

```dart
// pageNum：当前页码，从 1 开始，默认值为 1。
// pageSize：每页期望返回的禁言成员数，默认值为 200。
try {
  final List<String> muteList = await ChatClient
      .getInstance.chatRoomManager
      .fetchChatRoomMuteList(
        chatRoomId,
        pageNum: pageNum,
        pageSize: pageSize,
      );
  // 获取禁言列表成功。
} on ChatError catch (e) {
  // 获取禁言列表失败。
}
```

### 检查自己是否在聊天室禁言列表

聊天室成员可以调用 `isMemberInChatRoomMuteList` 方法查看自己是否在聊天室禁言列表。

```dart
try {
  final bool isInMuteList = await ChatClient
      .getInstance.chatRoomManager
      .isMemberInChatRoomMuteList(chatRoomId);

  if (isInMuteList) {
    // 当前用户在聊天室禁言列表中。
  } else {
    // 当前用户不在聊天室禁言列表中。
  }
} on ChatError catch (e) {
}
```

## 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

### 开启全员禁言

仅聊天室所有者和管理员可以调用 `ChatRoomManager.muteAllChatRoomMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `ChatRoomManager.unMuteAllChatRoomMembers` 方法解除禁言。

全员禁言开启后，除了聊天室所有者、管理员和白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `ChatRoomEventHandler.onAllChatRoomMemberMuteStateChanged` 回调。

示例代码如下：

```dart
try {
  await ChatClient
      .getInstance.chatRoomManager
      .muteAllChatRoomMembers(chatRoomId);
} on ChatError catch (e) {
}
```

### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `ChatRoomManager.unMuteAllChatRoomMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `ChatRoomEventHandler.onAllChatRoomMemberMuteStateChanged` 回调。

示例代码如下：

```dart
try {
  await ChatClient
      .getInstance.chatRoomManager
      .unMuteAllChatRoomMembers(chatRoomId);
} on ChatError catch (e) {
}
```

## 管理聊天室所有者和管理员

聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

### 变更聊天室所有者

仅聊天室所有者可以调用 `ChatRoomManager.changeOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `ChatRoomEventHandler.onOwnerChangedFromChatRoom` 回调。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.changeOwner(
    chatRoomId,
    newOwner,
  );
  // 所有者变更成功。
} on ChatError catch (e) {
  // 所有者变更失败。
}
```

### 添加聊天室管理员

仅聊天室所有者可以调用 `ChatRoomManager.addChatRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `ChatRoomEventHandler.onAdminAddedFromChatRoom` 回调。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.addChatRoomAdmin(
    chatRoomId,
    admin,
  );
  // 添加管理员成功。
} on ChatError catch (e) {
  // 添加管理员失败。
}
```

### 移除聊天室管理员

仅聊天室所有者可以调用 `ChatRoomManager.removeChatRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `ChatRoomEventHandler.onAdminRemovedFromChatRoom` 回调。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.removeChatRoomAdmin(
    chatRoomId,
    admin,
  );
  // 移除管理员成功。
} on ChatError catch (e) {
  // 移除管理员失败。
}
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchChatRoomMembers`](#获取聊天室成员列表) | `ChatRoomManager` | 分页获取聊天室成员列表。 |
| [`blockChatRoomMembers`](#将成员加入聊天室黑名单) | `ChatRoomManager` | 将成员加入聊天室黑名单。 |
| [`unBlockChatRoomMembers`](#将成员移出聊天室黑名单) | `ChatRoomManager` | 将成员移出聊天室黑名单。 |
| [`fetchChatRoomBlockList`](#获取聊天室黑名单列表) | `ChatRoomManager` | 获取聊天室黑名单。 |
| [`fetchChatRoomAllowListFromServer`](#获取聊天室白名单列表) | `ChatRoomManager` | 获取聊天室白名单。 |
| [`isMemberInChatRoomAllowList`](#检查自己是否在聊天室白名单中) | `ChatRoomManager` | 检查当前用户是否在白名单中。 |
| [`addMembersToChatRoomAllowList`](#将成员加入聊天室白名单) | `ChatRoomManager` | 将成员加入白名单。 |
| [`removeMembersFromChatRoomAllowList`](#将成员移出聊天室白名单列表) | `ChatRoomManager` | 将成员移出白名单。 |
| [`muteChatRoomMembers`](#添加成员至聊天室禁言列表) | `ChatRoomManager` | 将成员加入禁言列表。 |
| [`unMuteChatRoomMembers`](#将成员移出聊天室禁言列表) | `ChatRoomManager` | 将成员移出禁言列表。 |
| [`fetchChatRoomMuteList`](#获取聊天室禁言列表) | `ChatRoomManager` | 获取禁言列表。 |
| [`isMemberInChatRoomMuteList`](#检查自己是否在聊天室禁言列表) | `ChatRoomManager` | 检查当前用户是否在禁言列表中。 |
| [`muteAllChatRoomMembers`](#开启全员禁言) | `ChatRoomManager` | 开启聊天室全员禁言。 |
| [`unMuteAllChatRoomMembers`](#关闭全员禁言) | `ChatRoomManager` | 关闭聊天室全员禁言。 |
| [`changeOwner`](#变更聊天室所有者) | `ChatRoomManager` | 变更聊天室所有者。 |
| [`addChatRoomAdmin`](#添加聊天室管理员) | `ChatRoomManager` | 添加聊天室管理员。 |
| [`removeChatRoomAdmin`](#移除聊天室管理员) | `ChatRoomManager` | 移除聊天室管理员。 |
