# 删除会话

<Toc />

删除好友或退出群组后，SDK 不会自动删除对应的单聊或群聊会话。你可以调用相应的接口从服务器和本地删除单个会话及其历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 技术原理

环信即时通讯 IM 支持从服务器和本地删除单个会话及其历史消息，主要方法如下：

- `EMChatManager#deleteRemoteConversation`：单向删除服务端会话及其历史消息。
- `EMChatManager#deleteConversation`：删除本地单个会话及其历史消息。

## 实现方法

### 单向删除服务端会话及其历史消息

你可以调用 `deleteRemoteConversation` 方法删除服务器端会话，并选择是否删除服务端和本地的历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息。调用该接口不会删除本地会话。该接口不影响其他用户的会话和消息。

```dart
// 会话 ID。
String conversationId = "conversationId";
// 删除会话时是否同时删除服务端和本地的历史消息。
bool deleteMessage = true;
EMConversationType conversationType = EMConversationType.Chat;
await EMClient.getInstance.chatManager.deleteRemoteConversation(
  conversationId,
  conversationType: conversationType,
  isDeleteMessage: deleteMessage,
);
```

### 删除本地会话及其历史消息

- 删除会话时是否同时删除本地的历史消息。

```dart
// 会话 ID。
String conversationId = "conversationId";
// 删除会话时是否同时删除本地的历史消息
bool deleteMessage = true;
await EMClient.getInstance.chatManager
    .deleteConversation(conversationId, deleteMessage);
```

- 删除本地指定会话中的指定消息。

```dart
EMConversation? conversation =
    await EMClient.getInstance.chatManager.getConversation(
  conversationId,
);
conversation?.deleteMessage(messageId);
```
