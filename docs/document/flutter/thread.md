# 管理消息话题

## 功能说明

消息话题是群组成员的子集，是支持多人沟通的即时通讯系统。使用消息话题功能前，你需要联系商务开通。

本文介绍如何使用环信即时通讯 IM Flutter SDK 在实时互动 app 中创建和管理消息话题，并实现消息话题相关功能。如需查看消息相关内容，参见 [消息话题中的消息管理](thread_message.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 创建消息话题

所有群成员均可以调用 `createChatThread` 方法，基于一条群组消息新建消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `ChatThreadEventHandler.onChatThreadCreate` 回调；多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_CREATE`。

示例代码如下：

```dart
// parentId：群组 ID
// messageId：消息 ID，基于该消息创建消息话题
// threadName：消息话题名称，长度不超过 64 个字符
try {
  final ChatThread chatThread =
      await ChatClient.getInstance.chatThreadManager.createChatThread(
    parentId: parentId,
    messageId: messageId,
    name: threadName,
  );
} on ChatError catch (error) {
  // 创建失败。
}
```

## 解散消息话题

仅消息话题所在群组的群主和群管理员可以调用 `destroyChatThread` 方法解散消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `ChatThreadEventHandler.onChatThreadDestroy` 回调；多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_DESTROY`。

:::tip
解散消息话题或解散消息话题所在的群组后，将删除本地数据库及内存中关于该消息话题的全部数据，需谨慎操作。
:::

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatThreadManager.destroyChatThread(
    chatThreadId: chatThreadId,
  );
} on ChatError catch (error) {
  // 解散失败。
}
```

## 加入消息话题

消息话题所在群组的所有成员均可以调用 `joinChatThread` 方法加入消息话题。

加入消息话题的具体步骤如下：

1. 收到 `ChatThreadEventHandler.onChatThreadCreate` 回调或 `ChatThreadEventHandler.onChatThreadUpdate` 回调，或调用 `fetchChatThreadsWithParentId` 方法从服务器获取指定群组的消息话题列表，从中获取到想要加入的消息话题 ID。
2. 调用 `joinChatThread` 传入消息话题 ID 加入对应消息话题。

多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_JOIN`。

示例代码如下：

```dart
try {
  final ChatThread chatThread =
      await ChatClient.getInstance.chatThreadManager.joinChatThread(
    chatThreadId: chatThreadId,
  );
} on ChatError catch (error) {
  // 加入失败。
}
```

## 退出消息话题

### 主动退出

消息话题成员均可以主动调用 `leaveChatThread` 方法退出消息话题，退出消息话题后，该成员将不会再收到消息话题中的消息。

多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_LEAVE`。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatThreadManager.leaveChatThread(
    chatThreadId: chatThreadId,
  );
} on ChatError catch (error) {
  // 退出失败。
}
```

### 被移出消息话题

仅群主和群管理员可以可以调用 `removeMemberFromChatThread` 方法将指定成员（群管理员或普通成员）移出消息话题，被移出消息话题的成员将不再接收到消息话题中的消息。

被移出消息话题的成员会收到 `ChatThreadEventHandler.onUserKickOutOfChatThread` 回调。多设备登录时，执行移出操作的成员的其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_KICK`。

示例代码如下：

```dart
// chatThreadId：消息话题 ID
// memberId：消息话题成员的用户 ID
try {
  await ChatClient.getInstance.chatThreadManager.removeMemberFromChatThread(
    chatThreadId: chatThreadId,
    memberId: memberId,
  );
} on ChatError catch (error) {
  // 移出失败。
}
```

## 修改消息话题名称

仅群主和群管理员以及消息话题的创建者可以调用 `updateChatThreadName` 方法修改消息话题名称。

单设备登录时，消息话题所属群组的所有成员会收到 `ChatThreadEventHandler.onChatThreadUpdate` 回调；多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventHandler.onChatThreadEvent` 回调，回调事件为 `ChatMultiDevicesEvent.CHAT_THREAD_UPDATE`。

示例代码如下：

```dart
// chatThreadId：消息话题 ID
// newChatThreadName：修改的消息话题名称，长度不超过 64 个字符
try {
  await ChatClient.getInstance.chatThreadManager.updateChatThreadName(
    chatThreadId: chatThreadId,
    newName: newChatThreadName,
  );
} on ChatError catch (error) {
  // 修改失败。
}
```

## 获取消息话题详情

消息话题所属群组的所有成员均可以调用 `fetchChatThread` 方法从服务器获取消息话题详情。

示例代码如下：

```dart
// chatThreadId：消息话题 ID
try {
  final ChatThread? chatThread =
      await ChatClient.getInstance.chatThreadManager.fetchChatThread(
    chatThreadId: chatThreadId,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

## 获取消息话题成员列表

消息话题所属群组的所有成员均可以调用 `fetchChatThreadMembers` 方法从服务器分页获取消息话题成员列表。

```dart
// chatThreadId：消息话题 ID
// limit：单次请求返回的成员数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
try {
  final ChatCursorResult<String> result =
      await ChatClient.getInstance.chatThreadManager.fetchChatThreadMembers(
    chatThreadId: chatThreadId,
    limit: limit,
    cursor: cursor,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

## 获取消息话题列表

- 用户可以调用 `fetchJoinedChatThreads` 方法从服务器分页获取自己加入和创建的消息话题列表：

```dart
// limit：单次请求返回的消息话题数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
try {
  final ChatCursorResult<ChatThread> result =
      await ChatClient.getInstance.chatThreadManager.fetchJoinedChatThreads(
    limit: limit,
    cursor: cursor,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

- 用户可以调用 `fetchJoinedChatThreadsWithParentId` 方法从服务器分页获取指定群组中自己加入和创建的消息话题列表：

```dart
// parentId：群组 ID
// limit：单次请求返回的消息话题数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
try {
  final ChatCursorResult<ChatThread> result = await ChatClient
      .getInstance.chatThreadManager
      .fetchJoinedChatThreadsWithParentId(
    parentId: parentId,
    limit: limit,
    cursor: cursor,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

- 用户还可以调用 `fetchChatThreadsWithParentId` 方法从服务器分页获取指定群组的消息话题列表：

```dart
// parentId：群组 ID
// limit：单次请求返回的消息话题数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
try {
  final ChatCursorResult<ChatThread> result = await ChatClient
      .getInstance.chatThreadManager
      .fetchChatThreadsWithParentId(
    parentId: parentId,
    limit: limit,
    cursor: cursor,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

## 批量获取消息话题中的最新一条消息

用户可以调用 `fetchLatestMessageWithChatThreads` 方法从服务器批量获取消息话题中的最新一条消息。

示例代码如下：

```dart
// chatThreadIds：要查询的消息话题 ID 列表，每次最多可传入 20 个消息话题 ID
try {
  final Map<String, ChatMessage> messages = await ChatClient
      .getInstance.chatThreadManager
      .fetchLatestMessageWithChatThreads(
    chatThreadIds: chatThreadIds,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

## 监听消息话题事件

`ChatThreadManager` 类中提供消息话题事件的监听接口。开发者可以通过设置此监听，获取消息话题中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```dart
const String threadHandlerId = 'THREAD_HANDLER_ID';

final ChatThreadEventHandler threadEventHandler = ChatThreadEventHandler(
  // 消息话题创建。消息话题所属群组的所有成员收到该事件。
  onChatThreadCreate: (ChatThreadEvent event) {},
  // 消息话题名称修改、消息话题中新增或撤回消息。消息话题所属群组的所有成员会收到该事件。
  onChatThreadUpdate: (ChatThreadEvent event) {},
  // 消息话题解散。消息话题所属群组的所有成员会收到该事件。
  onChatThreadDestroy: (ChatThreadEvent event) {},
  // 消息话题成员被移出。被移出消息话题的成员收到该事件。
  onUserKickOutOfChatThread: (ChatThreadEvent event) {},
);

// 注册监听。
ChatClient.getInstance.chatThreadManager.addEventHandler(
  threadHandlerId,
  threadEventHandler,
);

// 移除监听。
ChatClient.getInstance.chatThreadManager.removeEventHandler(threadHandlerId);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createChatThread`](#创建消息话题) | `ChatThreadManager` | 基于群组消息创建消息话题。 |
| [`destroyChatThread`](#解散消息话题) | `ChatThreadManager` | 解散消息话题。 |
| [`joinChatThread`](#加入消息话题) | `ChatThreadManager` | 加入消息话题。 |
| [`leaveChatThread`](#主动退出) | `ChatThreadManager` | 主动退出消息话题。 |
| [`removeMemberFromChatThread`](#被移出消息话题) | `ChatThreadManager` | 将成员移出消息话题。 |
| [`updateChatThreadName`](#修改消息话题名称) | `ChatThreadManager` | 修改消息话题名称。 |
| [`fetchChatThread`](#获取消息话题详情) | `ChatThreadManager` | 从服务器获取消息话题详情。 |
| [`fetchChatThreadMembers`](#获取消息话题成员列表) | `ChatThreadManager` | 分页获取消息话题成员列表。 |
| [`fetchJoinedChatThreads`](#获取消息话题列表) | `ChatThreadManager` | 分页获取当前用户已加入或创建的消息话题列表。 |
| [`fetchJoinedChatThreadsWithParentId`](#获取消息话题列表) | `ChatThreadManager` | 分页获取指定群组中当前用户已加入或创建的消息话题列表。 |
| [`fetchChatThreadsWithParentId`](#获取消息话题列表) | `ChatThreadManager` | 分页获取指定群组的消息话题列表。 |
| [`fetchLatestMessageWithChatThreads`](#批量获取消息话题中的最新一条消息) | `ChatThreadManager` | 批量获取消息话题中的最新一条消息。 |
