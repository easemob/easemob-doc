# 搜索服务端消息

## 功能说明

服务端消息搜索用于按关键词从服务端搜索当前用户可见的历史消息，适用于全局消息搜索、会话内搜索、按消息类型过滤搜索以及按时间范围检索消息等场景。

**自 Flutter SDK 4.25.0 起**，SDK 提供 `ChatManager#searchMessagesFromServer` 方法进行服务端消息搜索。该接口支持以下功能：

- 支持使用一个或多个关键词搜索历史消息，并设置多关键词匹配关系。
- 支持按指定会话、消息类型和消息发送时间范围筛选结果。
- 支持搜索消息内容、消息扩展字段（`ext`）或同时搜索两者。
- 搜索范围仅限于当前用户参与且有权访问的会话。
- 搜索结果按照相关性排序，支持分页查询和关键词高亮。

## 功能开通

要使用服务端消息搜索功能，需要在环信控制台开通，详见 [开通说明](/product/console/purchase_value_added.html#消息搜索)。

**关于扩展字段搜索**：开通消息搜索服务后，消息扩展字段（`ext`）搜索默认不开启。如需使用该功能，可在开通时一并说明，或后续联系环信商务单独开通。

:::tip
目前，仅国内二区集群支持该功能。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 Flutter SDK 4.25.0 或以上版本的 [初始化](/document/flutter/initialization.html) 并 [登录](/document/flutter/login.html) 成功。
- 当前应用已开通消息搜索服务。
- 已了解消息搜索服务的使用限制和接口调用频率限制，详见 [使用限制](/product/limitation.html)。

## 搜索服务端消息

### 调用方法

你可以创建 `ChatMessageSearchOption` 对象设置搜索条件，然后调用 `ChatManager#searchMessagesFromServer` 从服务端搜索历史消息。

#### 搜索条件和内容

服务端消息搜索支持以下搜索条件和内容：

| 搜索维度 | 支持能力 | 设置属性 |
| :--- | :--- | :--- |
| 关键词 | 支持使用一个或多个关键词搜索历史消息，并可设置匹配任一关键词或匹配全部关键词。 | `keywordList`、`keywordMatchType` |
| 会话 | 支持搜索全部会话，也可以指定单聊、群聊或聊天室会话。单聊传对方用户 ID，群聊或聊天室传对应的群组 ID 或聊天室 ID。 | `conversationId` |
| 消息类型 | 支持搜索文本、图片、视频、位置、文件和合并消息，不支持搜索自定义消息、语音消息和透传消息。 | `msgTypes` |
| 时间范围 | 支持按消息发送时间范围搜索。开始时间和结束时间必须同时设置。 | `startTime`、`endTime` |
| 搜索内容 | 支持仅搜索消息内容、仅搜索消息扩展字段（`ext`），或同时搜索两者。消息内容包括文本消息内容以及自动翻译后的文本内容。 | `searchScope` |

#### 消息可见范围

服务端消息搜索仅返回当前用户参与且有权访问的会话中的消息：

- 单聊可返回当前用户作为发送方或接收方的消息。
- 搜索群聊或聊天室消息时，服务端会校验当前用户的成员身份。
- 搜索的消息必须是在服务端保存期限内的历史消息。
- 未设置会话 ID 时，搜索当前用户有权访问的全部会话；设置会话 ID 时，仅搜索指定会话。

#### 示例代码

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  // 关键词列表。
  keywordList: const ['hello'],
  // 多关键词之间默认使用 OR 关系。
  keywordMatchType: ChatKeywordListMatchType.OR,
  // 可选。单聊传对方用户 ID，群聊传群组 ID，聊天室传聊天室 ID。
  conversationId: 'groupId',
  // 可选。服务端消息搜索不支持自定义消息、语音消息和透传消息。
  msgTypes: const [MessageType.TXT, MessageType.IMAGE],
  // 可选。起止时间必须同时设置，单位为毫秒。
  startTime: 1700000000000,
  endTime: 1700100000000,
  // 可选。默认仅搜索消息内容。
  searchScope: MessageSearchScope.All,
);

try {
  final ChatPageResult<ChatSearchServerMessageResult> result =
      await ChatClient.getInstance.chatManager.searchMessagesFromServer(
    option: option,
    // 每页返回的结果数量，取值范围为 [1,100]。
    pageSize: 20,
    // 当前页码，从 1 开始。
    pageNum: 1,
  );

  final List<ChatSearchServerMessageResult> messages = result.data;
  final int? count = result.pageCount;

  for (final ChatSearchServerMessageResult message in messages) {
    final String messageId = message.msgId;
    final ChatMessageBody? body = message.body;
    final List<String>? highlightTexts = message.highlightTexts;
  }
} on ChatError catch (e) {
  // 处理搜索失败。
}
```

#### 搜索参数

`ChatMessageSearchOption` 参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keywordList` | `List<String>` | 是 | 关键词列表。每个关键词长度为 1-120 个字符，所有关键词总长度不超过 120 个字符，最多设置 5 个关键词。 |
| `keywordMatchType` | `ChatKeywordListMatchType` | 否 | 多关键词匹配关系。`OR` 表示匹配任一关键词，`AND` 表示同时匹配全部关键词。默认值为 `OR`。 |
| `conversationId` | `String?` | 否 | 会话 ID。单聊传对方用户 ID；群聊传群组 ID；聊天室传聊天室 ID。不设置表示搜索所有会话。Flutter SDK 不需要额外传入会话类型。 |
| `msgTypes` | `List<MessageType>?` | 否 | 消息类型过滤条件。可使用 `TXT`、`IMAGE`、`VIDEO`、`LOCATION`、`FILE` 和 `COMBINE`。不支持 `CUSTOM`、`VOICE` 和 `CMD`。 |
| `startTime` | `int?` | 否 | 查询开始时间，Unix 时间戳，单位为毫秒。需与结束时间同时设置。 |
| `endTime` | `int?` | 否 | 查询结束时间，Unix 时间戳，单位为毫秒。需与开始时间同时设置，而且不应早于开始时间。 |
| `searchScope` | `MessageSearchScope` | 否 | 搜索范围。`Content` 表示仅搜索消息内容，`Attribute` 表示仅搜索消息扩展字段，`All` 表示同时搜索消息内容和扩展字段。默认值为 `Content`。 |

#### 返回结果

搜索结果由服务端按照相关性排序，支持分页查询，并返回与关键词匹配的高亮文本。

搜索成功后，SDK 返回 `ChatPageResult<ChatSearchServerMessageResult>`：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data` | `List<ChatSearchServerMessageResult>` | 当前页的搜索结果列表。 |
| `pageCount` | `int?` | 获取服务端返回的分页计数。当该值小于请求的 `pageSize` 时，表示服务端没有更多搜索结果。 |

搜索结果为 `ChatSearchServerMessageResult` 对象列表。你可以从结果对象中获取消息 ID、消息体、扩展字段、发送方、接收方、会话 ID、会话类型、消息时间戳以及服务端返回的高亮文本列表。

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `msgId` | `String` | 消息 ID。 |
| `body` | `ChatMessageBody?` | 消息体。可根据实际消息体类型转换为 `ChatTextMessageBody`、`ChatImageMessageBody` 等具体类型。 |
| `attributes` | `Map<String, dynamic>?` | 消息扩展属性。 |
| `from` | `String` | 消息发送方。 |
| `to` | `String` | 消息接收方。 |
| `convId` | `String` | 会话 ID。 |
| `chatType` | `ChatType` | 会话类型，可能为 `ChatType.Chat`、`ChatType.GroupChat` 或 `ChatType.ChatRoom`。 |
| `timestamp` | `int` | 消息时间戳，单位为毫秒。 |
| `highlightTexts` | `List<String>?` | 服务端返回的搜索高亮文本列表，可能为空。 |

### 常见搜索场景

#### 搜索指定会话的消息

如果需要搜索指定会话中的消息，只需设置 `conversationId`。

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  keywordList: const ['订单'],
  conversationId: 'userId',
);

final ChatPageResult<ChatSearchServerMessageResult> result =
    await ChatClient.getInstance.chatManager.searchMessagesFromServer(
  option: option,
  pageSize: 20,
  pageNum: 1,
);
final List<ChatSearchServerMessageResult> messages = result.data;
```

#### 使用多个关键词搜索

如果需要搜索多个关键词，可通过 `ChatKeywordListMatchType` 指定匹配方式。

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  // 关键词列表最多包含 5 个关键词；每个关键词长度为 1-120 个字符；
  // 所有关键词总长度不超过 120 个字符。
  keywordList: const ['会议', '明天'],
  keywordMatchType: ChatKeywordListMatchType.AND,
);

final ChatPageResult<ChatSearchServerMessageResult> result =
    await ChatClient.getInstance.chatManager.searchMessagesFromServer(
  option: option,
  pageSize: 20,
  pageNum: 1,
);
```

#### 按消息类型搜索

若按消息类型搜索，可通过 `msgTypes` 设置消息类型：

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  keywordList: const ['图片'],
  msgTypes: const [
    MessageType.TXT,
    MessageType.IMAGE,
    MessageType.FILE,
  ],
);

final ChatPageResult<ChatSearchServerMessageResult> result =
    await ChatClient.getInstance.chatManager.searchMessagesFromServer(
  option: option,
  pageSize: 20,
  pageNum: 1,
);
```

#### 搜索消息扩展字段

若仅搜索消息扩展字段，将 `searchScope` 设置为 `MessageSearchScope.Attribute`：

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  keywordList: const ['order-10001'],
  searchScope: MessageSearchScope.Attribute,
);

final ChatPageResult<ChatSearchServerMessageResult> result =
    await ChatClient.getInstance.chatManager.searchMessagesFromServer(
  option: option,
  pageSize: 20,
  pageNum: 1,
);
```

搜索范围还支持以下取值：

- `MessageSearchScope.Content`：仅搜索消息内容，默认值。
- `MessageSearchScope.Attribute`：仅搜索消息扩展字段。
- `MessageSearchScope.All`：同时搜索消息内容和消息扩展字段。

#### 按时间范围搜索

若按时间范围搜索，需同时设置 `startTime` 和 `endTime`。这两个参数均为 Unix 时间戳，单位为毫秒，且结束时间不能早于开始时间。

```dart
final ChatMessageSearchOption option = ChatMessageSearchOption(
  keywordList: const ['hello'],
  startTime: 1700000000000,
  endTime: 1700100000000,
);

final ChatPageResult<ChatSearchServerMessageResult> result =
    await ChatClient.getInstance.chatManager.searchMessagesFromServer(
  option: option,
  pageSize: 20,
  pageNum: 1,
);
```

## 注意事项

- 搜索服务需要单独开通。若未开通，服务端可能返回错误码 `505`。
- 参数错误可能返回错误码 `110`；鉴权失败可能返回错误码 `202`；未知服务端错误可能返回错误码 `303`。详见 [错误码文档](/document/flutter/error.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`searchMessagesFromServer`](#调用方法) | `ChatManager` | 根据搜索条件从服务端分页搜索当前用户有权访问的历史消息。 |
| [`ChatMessageSearchOption`](#搜索参数) | `ChatMessageSearchOption` | 设置关键词、会话、消息类型、时间范围和搜索内容等条件。 |
| [`keywordList`](#搜索参数) | `ChatMessageSearchOption` | 设置搜索关键词列表。 |
| [`keywordMatchType`](#搜索参数) | `ChatMessageSearchOption` | 设置多个关键词之间的匹配关系。 |
| [`conversationId`](#搜索参数) | `ChatMessageSearchOption` | 设置要搜索的会话 ID。 |
| [`msgTypes`](#搜索参数) | `ChatMessageSearchOption` | 设置消息类型过滤条件。 |
| [`startTime`](#搜索参数) | `ChatMessageSearchOption` | 设置消息查询的开始时间。 |
| [`endTime`](#搜索参数) | `ChatMessageSearchOption` | 设置消息查询的结束时间。 |
| [`searchScope`](#搜索参数) | `ChatMessageSearchOption` | 设置搜索消息内容、扩展字段或二者。 |
| [`data`](#返回结果) | `ChatPageResult` | 获取当前页的搜索结果列表。 |
| [`pageCount`](#返回结果) | `ChatPageResult` | 获取当前页的结果数。 |
| [`msgId`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息 ID。 |
| [`body`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息体。 |
| [`attributes`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息扩展字段。 |
| [`from`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息发送方。 |
| [`to`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息接收方。 |
| [`convId`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息所属的会话 ID。 |
| [`chatType`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息所属的会话类型。 |
| [`timestamp`](#返回结果) | `ChatSearchServerMessageResult` | 获取消息时间戳。 |
| [`highlightTexts`](#返回结果) | `ChatSearchServerMessageResult` | 获取与关键词匹配的高亮文本列表。 |
