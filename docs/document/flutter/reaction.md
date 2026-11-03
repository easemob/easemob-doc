# 消息表情回复 Reaction

## 功能说明

环信即时通讯 IM 提供消息表情回复功能。用户可以在单聊和群聊中对消息添加或删除表情。表情可以直观表达情绪；在群聊场景下，也可以结合不同表情的数量实现轻量投票、反馈收集等互动能力。

Reaction 场景示例如下，分别展示如何添加 Reaction，群聊中 Reaction 的效果，以及查看 Reaction 列表。

![img](/images/android/reactions.png)

## 功能开通

使用 Reaction 前，需在[环信控制台](https://console.easemob.com/user/login)开通该功能，具体操作请参见[环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 使用限制

- Reaction 仅适用于单聊和群聊，聊天室暂不支持。
- 同一用户对同一条消息上的同一个 Reaction 只能添加一次。
- Reaction 的计数规则和存储时间、用户添加限制、每条消息可添加的 Reaction 数量，以及表情 ID 规范，详见 [使用限制文档](limitation.html)。

## 前提条件

开始前，请确保满足以下条件：

1. 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
2. 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
3. 已在 [环信控制台](https://console.easemob.com/user/login) 开通 Reaction 功能。

## 在消息上添加 Reaction

调用 `addReaction` 可为消息添加 Reaction。对于单聊，会话对端用户会收到 `onMessageReactionDidChange` 回调；对于群聊，除操作者外的其他群成员会收到该回调。回调信息包括会话 ID、消息 ID、当前消息的 Reaction 列表以及 Reaction 操作列表。操作列表会记录操作者用户 ID、发生变化的 Reaction 和操作类型，业务侧可据此实时更新消息上的 Reaction 展示。

同一用户对同一条消息上的同一个 Reaction 只能添加一次。重复添加时，SDK 会返回错误码 `1301`，业务侧可统一按“该 Reaction 已添加过”进行处理。

示例代码如下：

```dart
// 添加 Reaction。
try {
  await ChatClient.getInstance.chatManager.addReaction(
    messageId: message.msgId,
    reaction: reaction,
  );
} on ChatError catch (error) {
  // 添加失败。
}

// 监听 Reaction 更新。
const String reactionHandlerId = 'REACTION_HANDLER_ID';
ChatClient.getInstance.chatManager.addEventHandler(
  reactionHandlerId,
  ChatEventHandler(
    onMessageReactionDidChange: (
      List<ChatMessageReactionEvent> events,
    ) {
      // 处理 Reaction 更新逻辑。
    },
  ),
);
```

## 删除消息的 Reaction

调用 `removeReaction` 删除当前用户为消息添加的 Reaction。删除成功后，单聊中的对端用户以及群聊中除操作者外的其他成员会收到 `onMessageReactionDidChange` 回调。回调信息包括会话 ID、消息 ID、当前消息的 Reaction 列表和 Reaction 操作列表；操作列表会记录操作者用户 ID、被删除的 Reaction 以及操作类型。业务侧可据此实时更新消息上的 Reaction 展示。

执行删除操作的一方可通过等待 `removeReaction` 执行完成并捕获 `ChatError` 获取操作结果，在成功后更新当前界面。

示例代码如下：

```dart
// 删除 Reaction。
try {
  await ChatClient.getInstance.chatManager.removeReaction(
    messageId: message.msgId,
    reaction: reaction,
  );
} on ChatError catch (error) {
  // 删除失败。
}

// 监听 Reaction 更新。
const String reactionHandlerId = 'REACTION_HANDLER_ID';
ChatClient.getInstance.chatManager.addEventHandler(
  reactionHandlerId,
  ChatEventHandler(
    onMessageReactionDidChange: (
      List<ChatMessageReactionEvent> events,
    ) {
      // 处理 Reaction 更新逻辑。
    },
  ),
);
```

## 获取消息的 Reaction 列表

调用 `fetchReactionList` 可从服务器获取一条或多条指定消息的 Reaction 概览。

每条 Reaction 概览包含 Reaction 内容、添加该 Reaction 的用户数量，以及最早添加 Reaction 的三个用户的用户 ID。该用户列表仅用于概览展示，并不代表全部用户。若需要获取完整用户列表，可调用 `fetchReactionDetail` 分页查询。对于已获取并缓存的消息，也可以通过 `ChatMessage.reactionList()` 读取消息中的 Reaction 列表。

示例代码如下：

```dart
// chatType 仅支持单聊 ChatType.Chat 和群聊 ChatType.GroupChat。
// 在群聊场景下，还需传入对应的 groupId。
try {
  final Map<String, List<ChatMessageReaction>> reactionMap =
      await ChatClient.getInstance.chatManager.fetchReactionList(
    messageIds: messageIds,
    chatType: chatType,
    groupId: groupId,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

对于已获取并缓存的消息，可以通过以下方式读取 Reaction 列表：

```dart
try {
  final List<ChatMessageReaction> reactions =
      await message.reactionList();
} on ChatError catch (error) {
  // 获取失败。
}
```

## 获取 Reaction 详情

调用 `fetchReactionDetail` 可从服务器分页获取指定消息中指定 Reaction 的详细信息，包括 Reaction 内容、当前添加该 Reaction 的用户数量，以及当前添加该 Reaction 的全部用户 ID。
接口返回 `ChatCursorResult<ChatMessageReaction>`，其中包含当前页数据和分页游标；当仍有后续数据时，业务侧可使用游标继续查询下一页。

```dart
try {
  final ChatCursorResult<ChatMessageReaction> result =
      await ChatClient.getInstance.chatManager.fetchReactionDetail(
    messageId: messageId,
    reaction: reaction,
    cursor: cursor,
    pageSize: 30,
  );
} on ChatError catch (error) {
  // 获取失败。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addReaction`](#在消息上添加-reaction) | `ChatManager` | 添加消息 Reaction。 |
| [`removeReaction`](#删除消息的-reaction) | `ChatManager` | 删除消息 Reaction。 |
| [`fetchReactionList`](#获取消息的-reaction-列表) | `ChatManager` | 获取多条消息的 Reaction 概览。 |
| [`fetchReactionDetail`](#获取-reaction-详情) | `ChatManager` | 分页获取指定 Reaction 的详情。 |
| [`conversationId`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 获取会话 ID。 |
| [`messageId`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 获取消息 ID。 |
| [`reactions`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 获取消息 Reaction 列表。 |
| [`operations`](#在消息上添加-reaction) | `ChatMessageReactionEvent` | 获取 Reaction 操作列表。 |
