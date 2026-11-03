# 搜索消息

本文介绍环信即时通讯 IM Flutter SDK 如何按照关键词、搜索范围、消息类型、发送方和时间戳等条件搜索本地消息。本文中的接口仅查询当前用户设备上的本地数据库，不会向服务端发起搜索请求。由于透传消息不会保存到本地数据库，因此无法通过这些接口搜索透传消息。

:::tip
若要搜索服务端的消息，请联系商务开通。详见 [服务端消息搜索文档](/value-added/search/message_search_flutter.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已 [打开当前用户的本地数据库](login.html#登录完成前使用本地数据库)，详见 [快速开始](quickstart.html)。本地消息搜索不要求客户端保持服务器连接。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话中的用户发送的消息

你可以调用 `ChatConversation#loadMessagesWithKeyword`，按照关键词搜索指定会话中一个或多个用户发送的消息。

`timestamp` 为搜索起始时间戳，设为负数时从当前时间开始搜索；返回结果不包含时间戳与 `timestamp` 相同的消息。

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  // count 取值范围为 1–400；Up 表示按时间戳倒序搜索。
  // senders 最多可包含 10 个用户 ID；传入 null 或空列表时，
  // 不限制消息发送方。
  final List<ChatMessage> messages =
      await conversation.loadMessagesWithKeyword(
    keywords,
    timestamp: timestamp,
    count: maxCount,
    senders: <String>[senderId],
    direction: ChatSearchDirection.Up,
  );
}
```

### 根据搜索范围搜索所有会话中的消息

你可以调用 `ChatManager#loadMessagesWithKeyword`，按照关键词、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

通过 `searchScope` 还可以指定仅搜索消息内容、仅搜索消息扩展字段，或同时搜索二者。

```dart
const String keyword = '123';

final List<ChatMessage> messages =
    await ChatClient.getInstance.chatManager.loadMessagesWithKeyword(
  keyword,
  timestamp: -1,
  count: 200,
  sender: null,
  direction: ChatSearchDirection.Up,
  searchScope: MessageSearchScope.All,
);
```

### 根据搜索范围搜索当前会话中的消息

你可以调用 `ChatConversation#loadMessagesWithKeyword`，按照关键词、起始时间戳、最大返回数量、一个或多个发送方、搜索方向及搜索范围，异步搜索当前会话中的消息。

```dart
const String keyword = '123';
const String conversationId = 'jack';

final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  try {
    final List<String> senders = <String>['user1', 'user2'];
    // senders 最多可包含 10 个用户 ID；传入 null 或空列表时，
    // 不限制消息发送方。
    final List<ChatMessage> messages =
        await conversation.loadMessagesWithKeyword(
      keyword,
      timestamp: -1,
      count: 200,
      senders: senders,
      direction: ChatSearchDirection.Up,
      searchScope: MessageSearchScope.All,
    );
    // messages 为当前会话中符合条件的本地消息。
  } on ChatError catch (e) {
    // 搜索失败，根据错误码和错误信息处理。
  }
}
```

### 根据消息类型搜索所有会话中的消息

你可以调用 `ChatManager#searchMsgsByOptions`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

```dart
// count：要查询的消息条数。取值范围为 [1,400]。
// from：会话中发送方的用户 ID。若不设置，搜索对发送方不限制。
const MessageSearchOptions options = MessageSearchOptions(
  types: <MessageType>[MessageType.TXT, MessageType.VOICE],
  ts: -1,
  count: 400,
  from: 'xu',
  direction: ChatSearchDirection.Up,
);

final List<ChatMessage> messages =
    await ChatClient.getInstance.chatManager.searchMsgsByOptions(options);

for (final ChatMessage message in messages) {
  if (message.body is ChatTextMessageBody) {
    final ChatTextMessageBody body = message.body as ChatTextMessageBody;
    debugPrint('message: ${body.content}, time: ${message.serverTime}');
  } else {
    debugPrint('message: ${message.body}, time: ${message.serverTime}');
  }
}
```

### 根据消息类型搜索当前会话中的消息

你可以调用 `ChatConversation#searchMsgsByOptions`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在指定会话中搜索消息。

```dart
// count：要查询的消息条数。取值范围为 [1,400]。
// from：当前会话中发送方的用户 ID。若不设置，搜索对发送方不限制。
const MessageSearchOptions options = MessageSearchOptions(
  types: <MessageType>[MessageType.TXT, MessageType.VOICE],
  ts: -1,
  count: 400,
  from: 'xu',
  direction: ChatSearchDirection.Up,
);

final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  'xu',
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  final List<ChatMessage> messages =
      await conversation.searchMsgsByOptions(options);

  for (final ChatMessage message in messages) {
    if (message.body is ChatTextMessageBody) {
      final ChatTextMessageBody body = message.body as ChatTextMessageBody;
      debugPrint('message: ${body.content}, time: ${message.serverTime}');
    } else {
      debugPrint('message: ${message.body}, time: ${message.serverTime}');
    }
  }
}
```

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索本地数据库中单个会话中指定用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索](#根据搜索范围搜索所有会话中的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

| 消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :--- | :--- | :--- |
| 文本消息 | `ChatTextMessageBody.content` | 文本消息的实际内容“你好世界”。 |
| 图片消息 | `ChatImageMessageBody.displayName` | 图片文件名“photo.jpg”。 |
| 语音消息 | `ChatVoiceMessageBody.displayName` | 语音文件名“audio.amr”。 |
| 视频消息 | `ChatVideoMessageBody.displayName` | 视频文件名“video.mp4”。 |
| 文件消息 | `ChatFileMessageBody.displayName` | 文件名“report.pdf”。 |
| 位置消息 | `ChatLocationMessageBody.address` 和 `ChatLocationMessageBody.buildingName` | 地址或建筑物名称，例如“北京市朝阳区”或“国贸大厦”。 |
| 自定义消息 | `ChatCustomMessageBody.event` | 自定义事件名“gift”。 |
| 合并消息 | `CombineMessageBody.title` 和 `CombineMessageBody.summary` | 标题或摘要，例如“聊天记录”或“包含 5 条消息”。 |

### 只搜索扩展信息

若只搜索消息的扩展属性（`attributes`）JSON 字符串，`keywords` 字段匹配用户自定义添加的扩展属性，例如：

```json
{"key1":"value1", "key2":"value2"}
```

### 全搜索

同时搜索消息内容和扩展信息，任一匹配即返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getConversation`](#根据关键字搜索会话中的用户发送的消息) | `ChatManager` | 获取指定 ID 的本地会话；未找到时返回 `null`。 |
| [`loadMessagesWithKeyword`](#根据关键字搜索会话中的用户发送的消息) | `ChatConversation` | 按照关键词搜索指定会话中一个或多个用户发送的本地消息。 |
| [`loadMessagesWithKeyword`](#根据搜索范围搜索所有会话中的消息) | `ChatManager` | 按照关键词和搜索范围，在全部本地会话中搜索消息。 |
| [`loadMessagesWithKeyword`](#根据搜索范围搜索当前会话中的消息) | `ChatConversation` | 按照关键词、发送方列表及搜索范围，异步搜索指定会话中的消息。 |
| [`searchMsgsByOptions`](#根据消息类型搜索所有会话中的消息) | `ChatManager` | 按照一种或多种消息类型，在全部本地会话中搜索消息。 |
| [`searchMsgsByOptions`](#根据消息类型搜索当前会话中的消息) | `ChatConversation` | 按照一种或多种消息类型，在指定会话中搜索消息。 |
