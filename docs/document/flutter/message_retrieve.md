# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

本文介绍环信即时通讯 IM Flutter SDK 如何从服务器获取历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 从服务器获取指定会话的消息

你可以调用 `fetchHistoryMessagesByOption` 方法基于 `FetchMessageOptions` 类从服务端分页拉取单聊和群组聊天的历史消息。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `type` | `ChatConversationType` | 会话类型。单聊传 `Chat`，群聊传 `GroupChat`，聊天室传 `ChatRoom`。 |
| `pageSize` | `int` | 每页拉取的消息数。建议为 20，取值范围为 `[1,50]`。若满足查询条件的消息总数大于 `pageSize`，则返回 `pageSize` 条消息；若小于 `pageSize`，则返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize`。 |
| `cursor` | `String?` | 分页游标。首次拉取传 `null` 或不传，后续传入上一次结果中 `ChatCursorResult.cursor` 返回的游标。 |
| `options` | `FetchMessageOptions?` | 拉取选项，可设置以下条件：<br/> - 消息发送方；<br/> - 消息类型；<br/> - 消息时间段；<br/> - 消息搜索方向；<br/> - 是否将拉取的消息保存到数据库；<br/> - 对于群组聊天，可以通过 `senders` 拉取一个或多个群成员发送的历史消息。 |
| 返回值 | `Future<ChatCursorResult<ChatMessage>>` | 拉取成功后，通过 `ChatCursorResult.data` 获取消息列表，通过 `cursor` 获取下一页游标。调用失败时抛出 `ChatError`。 |

:::tip
1. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
2. 获取单聊历史消息时会读取服务端保存的消息送达状态和已读状态。该功能默认关闭，如果需要，请联系环信商务开通。
3. 历史消息在服务器上的存储时间与产品的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

```dart
Future<List<ChatMessage>> fetchAllHistoryMessages({
  required String conversationId,
  required ChatConversationType type,
}) async {
  final FetchMessageOptions options = FetchMessageOptions(
    // 例如，将获取的消息保存到本地数据库。
    needSave: true,
    // 例如，按时间正序获取消息。
    direction: ChatSearchDirection.Down,
  );

  const int pageSize = 40;
  String? cursor;
  final List<ChatMessage> messages = <ChatMessage>[];

  do {
    final ChatCursorResult<ChatMessage> result =
        await ChatClient.getInstance.chatManager
            .fetchHistoryMessagesByOption(
      conversationId,
      type,
      pageSize: pageSize,
      cursor: cursor,
      options: options,
    );

    messages.addAll(result.data);
    // 拉取到最后一页时，返回的 cursor 为空或 null。
    cursor = result.cursor;
  } while (cursor?.isNotEmpty == true);

  return messages;
}
```

## 从服务器获取指定群成员发送的消息

对于单个群组会话，你可以从服务器获取指定成员（而非全部成员）发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 群组 ID。 |
| `type` | `ChatConversationType` | 会话类型。获取群聊消息时传 `GroupChat`。 |
| `pageSize` | `int` | 每页拉取的消息数。建议为 20，最大不超过 50。 |
| `cursor` | `String?` | 分页游标。首次拉取传 `null` 或不传，后续传入上一次结果返回的游标。 |
| `options` | `FetchMessageOptions` | 拉取选项。通过 `senders` 设置要查询的群成员 ID，最多可设置 10 个。 |
| 返回值 | `Future<ChatCursorResult<ChatMessage>>` | 拉取成功后返回消息列表和下一页游标；调用失败时抛出 `ChatError`。 |

```dart
Future<List<ChatMessage>> fetchGroupMemberMessages({
  required String groupId,
}) async {
  const FetchMessageOptions options = FetchMessageOptions(
    // 例如，获取群组中两个用户发送的消息。
    senders: <String>['user1', 'user2'],
    // 例如，将获取的消息保存到本地数据库。
    needSave: true,
    // 例如，按时间正序获取消息。
    direction: ChatSearchDirection.Down,
  );

  const int pageSize = 40;
  String? cursor;
  final List<ChatMessage> messages = <ChatMessage>[];

  do {
    final ChatCursorResult<ChatMessage> result =
        await ChatClient.getInstance.chatManager
            .fetchHistoryMessagesByOption(
      groupId,
      ChatConversationType.GroupChat,
      pageSize: pageSize,
      cursor: cursor,
      options: options,
    );

    messages.addAll(result.data);
    cursor = result.cursor;
  } while (cursor?.isNotEmpty == true);

  return messages;
}
```

## 根据关键字获取本地会话中的消息

你可通过设置关键词获取本地数据库中会话的某些消息。SDK 返回会话 ID 及消息 ID 列表的映射关系，消息 ID 根据你设置的 `direction` 参数按照消息时间戳的正序或倒序列明。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyword` | `String` | 要搜索的关键词。 |
| `timestamp` | `int` | 搜索起始时间戳，单位为毫秒。传负数表示从最新消息开始搜索。 |
| `sender` | `String?` | 发送方用户 ID。传 `null` 表示不按发送方筛选。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`Up` 为按消息时间戳逆序搜索，`Down` 为正序搜索。 |
| `scope` | `MessageSearchScope` | 搜索范围，例如 `Content` 表示搜索消息内容。 |
| 返回值 | `Future<Map<String, List<String>>>` | 搜索成功后返回会话 ID 与消息 ID 列表的映射；调用失败时抛出 `ChatError`。 |

```dart
final Map<String, List<String>> result =
    await ChatClient.getInstance.chatManager
        .loadConversationMessagesWithKeyword(
  keyword: '时间',
  timestamp: -1,
  sender: null,
  direction: ChatSearchDirection.Up,
  scope: MessageSearchScope.Content,
);
```

## 根据消息 ID 获取本地消息

你可以传入单个或多个消息 ID 获取单个本地会话中的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageIds` | `List<String>` | 要查询的消息 ID 列表。每次最多传入 20 个消息 ID。 |
| `conversationId` | `String` | 消息所属的会话 ID。 |
| 返回值 | `Future<List<ChatMessage>>` | 查询成功后返回找到的本地消息列表；调用失败时抛出 `ChatError`。 |

```dart
// messageIds：消息 ID 列表。每次最多可传入 20 个消息 ID。
final List<ChatMessage> messages =
    await ChatClient.getInstance.chatManager.loadMessagesWithIds(
  messageIds,
  conversationId,
);
```

## 从本地获取指定群成员发送的消息

对于单个群组会话，你可以从本地获取指定成员（而非全部成员）发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keywords` | `String` | 要搜索的关键词。 |
| `timestamp` | `int` | 搜索起始时间戳，单位为毫秒。传负数表示从当前时间开始搜索。 |
| `count` | `int` | 每次最多返回的消息数，取值范围为 `[1,400]`。 |
| `senders` | `List<String>?` | 要筛选的发送方用户 ID 列表，最多 10 个；传 `null` 或空列表表示不限制发送方。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`Up` 为按消息时间戳逆序搜索，`Down` 为正序搜索。 |
| `searchScope` | `MessageSearchScope` | 搜索范围，例如 `Content` 表示搜索消息内容。 |
| 返回值 | `Future<List<ChatMessage>>` | 搜索成功后返回消息列表；调用失败时抛出 `ChatError`。 |

```dart
const String conversationId = 'group_id';
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.GroupChat,
  createIfNeed: false,
);

if (conversation != null) {
  final List<ChatMessage> messages =
      await conversation.loadMessagesWithKeyword(
    'hello',
    timestamp: -1,
    count: 20,
    senders: <String>['user1', 'user2'],
    direction: ChatSearchDirection.Up,
    searchScope: MessageSearchScope.Content,
  );

  for (final ChatMessage message in messages) {
    final String msgId = message.msgId;
    final String? from = message.from;
    final int msgTime = message.serverTime;
    // 处理搜索结果。
  }
}
```

## 从本地读取指定会话的消息

你可以调用 `loadMessages` 方法从本地数据库中分页加载消息，加载的消息会基于消息中的时间戳放入当前会话的内存中。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `type` | `ChatConversationType` | 会话类型。单聊传 `Chat`，群聊传 `GroupChat`，聊天室传 `ChatRoom`。 |
| `createIfNeed` | `bool` | 会话不存在时是否创建会话，默认为 `true`。仅读取现有会话时建议传 `false`。 |
| `startMsgId` | `String` | 分页查询的起始消息 ID。传空字符串时，从最新消息开始加载。 |
| `loadCount` | `int` | 每页加载的消息数，取值范围为 `[1,400]`。 |
| `direction` | `ChatSearchDirection` | 消息加载方向，默认为 `Up`，即按消息时间戳逆序加载。 |

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.Chat,
  createIfNeed: false,
);

if (conversation != null) {
  // SDK 从该消息 ID 开始按指定方向加载。
  // startMsgId 为空字符串时，从最新消息开始加载。
  final List<ChatMessage> pagedMessages =
      await conversation.loadMessages(
    startMsgId: startMsgId,
    loadCount: pageSize,
    direction: ChatSearchDirection.Up,
  );
}
```

### 根据消息 ID 获取单个本地消息

你可以调用 `loadMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageId` | `String` | 要获取的消息 ID。 |

```dart
// messageId：要获取的消息 ID。
final ChatMessage? message =
    await ChatClient.getInstance.chatManager.loadMessage(messageId);
```

### 获取本地会话中特定类型的消息

你可以调用 `loadMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要搜索的会话 ID。 |
| `type` | `MessageType` | 要搜索的消息类型，例如 `TXT`。 |
| `timestamp` | `int` | 搜索起始时间戳，单位为毫秒。传负数时从当前时间开始搜索。 |
| `count` | `int` | 每次获取的消息数，取值范围为 `[1,400]`。 |
| `sender` | `String?` | 发送方用户 ID。传 `null` 表示不按发送方筛选。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`Up` 为按消息时间戳逆序搜索，`Down` 为正序搜索。 |

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.Chat,
  createIfNeed: false,
);

if (conversation != null) {
  final List<ChatMessage> messages =
      await conversation.loadMessagesWithMsgType(
    type: MessageType.TXT,
    timestamp: DateTime.now().millisecondsSinceEpoch,
    count: 50,
    sender: null,
    direction: ChatSearchDirection.Up,
  );
}
```

### 获取一定时间内本地会话的消息

你可以调用 `loadMessagesFromTime` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。

每次最多可获取 400 条消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要搜索的会话 ID。 |
| `startTime` | `int` | 搜索起始时间戳，单位为毫秒。 |
| `endTime` | `int` | 搜索结束时间戳，单位为毫秒。 |
| `count` | `int` | 每次获取的消息数，取值范围为 `[1,400]`。 |

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.Chat,
  createIfNeed: false,
);

if (conversation != null) {
  final List<ChatMessage> messages =
      await conversation.loadMessagesFromTime(
    startTime: startTime,
    endTime: endTime,
    count: 50,
  );
}
```

### 获取会话在一定时间内的消息数

你可以调用 `getLocalMessageCount` 方法从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 要统计的会话 ID。 |
| `startMs` | `int` | 统计起始时间戳，单位为毫秒。 |
| `endMs` | `int` | 统计结束时间戳，单位为毫秒。 |

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: ChatConversationType.Chat,
  createIfNeed: false,
);

if (conversation != null) {
  final int endMs = DateTime.now().millisecondsSinceEpoch;
  final int startMs = endMs - const Duration(days: 1).inMilliseconds;
  final int count = await conversation.getLocalMessageCount(
    startMs: startMs,
    endMs: endMs,
  );
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchHistoryMessagesByOption`](#从服务器获取指定会话的消息) | `ChatManager` | 从服务端分页获取指定会话的历史消息。 |
| [`direction`](#从服务器获取指定会话的消息) | `FetchMessageOptions` | 设置服务端历史消息的查询方向。 |
| [`needSave`](#从服务器获取指定会话的消息) | `FetchMessageOptions` | 设置拉取的历史消息是否保存到本地数据库。 |
| [`senders`](#从服务器获取指定群成员发送的消息) | `FetchMessageOptions` | 设置群聊历史消息的指定发送成员。 |
| [`loadConversationMessagesWithKeyword`](#根据关键字获取本地会话中的消息) | `ChatManager` | 根据关键词从本地数据库搜索消息。 |
| [`loadMessagesWithIds`](#根据消息-id-获取本地消息) | `ChatManager` | 根据消息 ID 获取本地消息。 |
| [`loadMessagesWithKeyword`](#从本地获取指定群成员发送的消息) | `ChatConversation` | 根据关键词和发送方从本地会话搜索消息。 |
| [`loadMessages`](#从本地读取指定会话的消息) | `ChatConversation` | 从本地数据库分页加载会话消息。 |
| [`loadMessage`](#根据消息-id-获取单个本地消息) | `ChatManager` | 根据消息 ID 获取单条本地消息。 |
| [`loadMessagesWithMsgType`](#获取本地会话中特定类型的消息) | `ChatConversation` | 按消息类型、时间和发送方搜索本地消息。 |
| [`loadMessagesFromTime`](#获取一定时间内本地会话的消息) | `ChatConversation` | 按时间范围搜索本地会话消息。 |
| [`getLocalMessageCount`](#获取会话在一定时间内的消息数) | `ChatConversation` | 统计指定时间范围内的本地消息数。 |
