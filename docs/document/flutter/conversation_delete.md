# 删除会话

## 功能说明

Flutter SDK 中，删除好友、退出群组或退出聊天室时，本地会话及本地消息的处理方式如下：

| 删除项 | 默认情况 | 保留本地会话和消息的设置 |
| :--- | :--- | :--- |
| 删除好友 | 按 Dart API 定义及 Android 行为，默认删除该好友对应的本地单聊会话及其中的本地消息。 | 按 Dart API 定义，将 `keepConversation` 设置为 `true` 可保留；当前 iOS 桥接存在行为差异，详见 [删除好友](user_relationship.html#删除好友)。 |
| 退出群组 | 保留本地群聊会话并移除其内存缓存；默认删除本地群聊消息。 | 本地群聊会话默认保留。若需保留本地消息，在初始化前将 `ChatOptions.deleteMessagesAsExitGroup` 设置为 `false`。 |
| 退出聊天室 | 默认删除本地聊天室会话及其中的本地消息。 | 在初始化前将 `ChatOptions.deleteMessagesAsExitChatRoom` 设置为 `false`。 |

你还可以通过 `ChatManager` 删除当前用户服务端和本地的指定会话、仅删除本地会话、批量删除本地会话或清空全部会话；通过 `ChatConversation` 可删除指定的本地消息。

:::warning
删除操作可能无法恢复。调用前应明确删除范围。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向删除服务端会话

你可以调用 `ChatManager#deleteRemoteConversation` 删除当前用户服务端和本地的指定会话。会话和消息删除后，当前用户无法从服务器获取该会话和消息，不影响其他用户的会话和消息。

`isDeleteMessage` 参数控制是否同时删除当前用户在服务端保存的该会话历史消息：

- `true`：删除服务端和本地会话，以及服务端和本地历史消息。
- `false`：删除服务端和本地会话，但保留服务端和本地历史消息。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatManager.deleteRemoteConversation(
    conversationId,
    // 会话类型：单聊、群聊和聊天室分别为 Chat、GroupChat 和 ChatRoom。
    conversationType: conversationType,
    isDeleteMessage: isDeleteServerMessages,
  );
  // 当前用户服务端和本地的指定会话已删除。
} on ChatError catch (e) {
  // 根据错误码和错误信息处理。
}
```

如果需要保留服务端及本地历史消息，将 `isDeleteMessage` 传入 `false`：

```dart
try {
  await ChatClient.getInstance.chatManager.deleteRemoteConversation(
    conversationId,
    conversationType: ChatConversationType.GroupChat,
    isDeleteMessage: false,
  );
  // 服务端和本地会话已删除，历史消息保留。
} on ChatError catch (e) {
  // 删除失败。
}
```

:::tip
删除会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。删除会话时，若 `isDeleteMessage` 设置为 `false`，服务端漫游消息不会随会话删除，后续可在消息有效期内按需拉取；若 `isDeleteMessage` 设置为 `true`，该会话的服务端漫游消息会同时删除，删除后无法再通过 SDK 拉取。
:::

## 删除本地会话

调用 `ChatManager#deleteConversation` 删除单个指定的本地会话。

`deleteMessages` 参数控制是否同时删除该会话的本地历史消息：

- `true`：删除本地会话及其本地历史消息。
- `false`：删除本地会话，但保留本地历史消息。

```dart
try {
  // 删除本地会话，同时删除该会话的本地历史消息。
  final bool deleted =
      await ChatClient.getInstance.chatManager.deleteConversation(
    conversationId,
    deleteMessages: true,
  );

  if (!deleted) {
    // 删除失败，可检查 conversationId 是否为空以及本地数据库是否已打开。
  }
} on ChatError catch (e) {
  // 删除失败，根据错误码和错误信息处理。
}
```

若需要删除本地多个会话，可调用 `deleteConversations` 方法：

```dart
try {
  await ChatClient.getInstance.chatManager.deleteConversations(
    <String>[conversationId],
    deleteMessages: true,
  );
  // 本地会话及其本地历史消息删除成功。
} on ChatError catch (e) {
  // 删除失败，根据错误码和错误信息进行处理。
}
```

:::tip
删除本地会话后，若后续再次收发消息，SDK 会重新创建对应的本地会话。`deleteMessages` 为 `false` 时保留本地消息；为 `true` 时删除该会话的本地消息。该接口不删除服务端会话或服务端漫游消息。
:::

### 批量删除本地会话

调用 `ChatManager#deleteConversations` 可批量删除本地会话。不存在的会话 ID 会被忽略。

`deleteMessages` 参数控制是否同时删除各会话中的本地消息：

- `true`：删除本地会话及其中的本地消息。
- `false`：仅删除本地会话，保留本地消息。

```dart
try {
  await ChatClient.getInstance.chatManager.deleteConversations(
    conversationIds,
    deleteMessages: true,
  );
  // 批量删除成功。
} on ChatError catch (e) {
  // 处理批量删除失败。
}
```

### 删除全部会话及消息

调用 `ChatManager#deleteAllMessageAndConversation` 可清空全部会话及其中的消息：

- `clearServerData` 为 `false`：仅清空全部本地会话及本地消息，服务端数据保留。
- `clearServerData` 为 `true`：同时清空当前用户服务端保存的全部会话及消息；当前用户之后无法再从服务端获取这些数据，其他用户不受影响。

```dart
try {
  await ChatClient.getInstance.chatManager.deleteAllMessageAndConversation(
    clearServerData: false,
  );
  // 已清空全部本地会话及消息。
} on ChatError catch (e) {
  // 处理清空失败。
}
```

:::warning
将 `clearServerData` 设为 `true` 会删除当前用户服务端保存的全部会话及消息。执行前应再次向用户确认删除范围。
:::

### 删除会话中的指定本地消息

如需删除某条本地消息，可先获取对应的 `ChatConversation`，再调用 `deleteMessage`。该接口会从 SDK 的本地数据库和内存缓存中删除该消息。

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  await conversation.deleteMessage(messageId);
}
```

### 删除好友时处理会话

调用 `ChatContactManager#deleteContact` 删除好友时，可通过 `keepConversation` 控制是否保留与该好友对应的本地单聊会话及其中的本地消息。按照 Dart API 定义及 Android 行为，该参数默认为 `false`，表示删除本地会话及消息；设为 `true` 表示保留。

当前 iOS 桥接存在行为差异，不能将下方示例视为两端删除本地会话的统一保证。详见 [删除好友](user_relationship.html#删除好友) 中的平台差异说明。

```dart
try {
  await ChatClient.getInstance.contactManager.deleteContact(
    'contactUserId',
    keepConversation: false,
  );
  // 已删除好友；按 Dart API 定义及 Android 行为，同时删除本地会话和消息。
  // 当前 iOS 桥接差异见上方说明。
} on ChatError catch (e) {
  // 处理删除好友失败。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteRemoteConversation`](#单向删除服务端会话) | `ChatManager` | 删除当前用户服务端和本地的指定会话，并可设置是否同时删除服务端历史消息。 |
| [`deleteConversation`](#删除本地会话) | `ChatManager` | 删除指定的本地会话，并可设置是否同时删除本地历史消息。 |
| [`deleteConversations`](#批量删除本地会话) | `ChatManager` | 异步批量删除本地会话，并可设置是否同时删除本地消息。 |
| [`deleteAllMessageAndConversation`](#删除全部会话及消息) | `ChatManager` | 异步清空全部本地会话和消息，并可选择是否同时清空当前用户的服务端数据。 |
| [`getConversation`](#删除会话中的指定本地消息) | `ChatManager` | 获取指定的本地会话。 |
| [`deleteMessage`](#删除会话中的指定本地消息) | `ChatConversation` | 删除会话中的指定本地消息。 |
| [`deleteContact`](#删除好友时处理会话) | `ChatContactManager` | 删除好友，并通过 `keepConversation` 参数设置是否保留对应的本地会话和消息；当前 iOS 桥接差异见对应章节。 |
