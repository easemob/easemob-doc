# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

HarmonyOS SDK 使用本地数据库保存消息，应用既可以从服务器分页拉取漫游消息，也可以从本地数据库分页读取或按条件搜索消息。

本文介绍如何通过 HarmonyOS SDK 获取服务器和本地历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的消息

你可以调用 `ChatManager#fetchHistoryMessages`，基于 `FetchMessageOption` 从服务器分页拉取指定会话的历史消息。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `conversationType` | `ConversationType` | 会话类型：单聊、群聊和聊天室分别传 `Chat`、`GroupChat` 和 `ChatRoom`。 |
| `pageSize` | `number` | 每页获取的消息数，默认值为 `20`，取值范围为 `[1,50]`。若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。 |
| `cursor` | `String` | 分页游标。首次查询传空字符串；后续传入上一次结果中 `CursorResult#getNextCursor()` 返回的游标。 |
| `fetchOption` | `FetchMessageOption` |拉取选项，可设置以下条件：<br/> - 消息发送方；<br/> - 消息类型；<br/> - 消息时间段；<br/> - 消息搜索方向；<br/> - 是否将拉取的消息保存到数据库；<br/> - 对于群组聊天，你可以通过 `setFrom` 拉取群组中单个成员发送的历史消息。 |

`fetchHistoryMessages` 返回 `Promise<CursorResult<ChatMessage>>`。通过 `getResult()` 获取当前页消息，通过 `getNextCursor()` 获取下一页游标；游标为空字符串表示已经拉取到最后一页。

:::tip
1. 默认支持获取单聊和群聊历史消息。若要获取聊天室历史消息，请联系环信商务开通。
2. 获取单聊历史消息时读取服务端保存的送达状态和已读状态。该功能默认关闭，如需使用请联系环信商务。
3. 历史消息的服务端保存时长与产品套餐相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
4. `FetchMessageOption#setIsSave` 默认为 `false`。设置为 `true` 后，SDK 将拉取到的消息保存到本地数据库。
:::

```typescript
async function fetchAllHistoryMessages(
  conversationId: string,
  conversationType: ConversationType
): Promise<Array<ChatMessage>> {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return [];
  }

  let option = new FetchMessageOption();
  // 是否将拉取到的消息保存到本地数据库，默认值为 false。
  option.setIsSave(true);
  // UP 表示按消息时间戳逆序获取，DOWN 表示正序获取。
  option.setDirection(SearchDirection.UP);

  let pageSize = 20;
  let cursor = '';
  let messages = new Array<ChatMessage>();

  do {
    let result = await chatManager.fetchHistoryMessages(
      conversationId,
      conversationType,
      pageSize,
      cursor,
      option
    );

    result.getResult().forEach((message: ChatMessage): void => {
      messages.push(message);
    });
    cursor = result.getNextCursor();
  } while (cursor.length > 0);

  return messages;
}
```

### 从服务器获取指定群成员发送的消息

对于群组会话，可以通过 `FetchMessageOption#setFrom` 设置一个或多个群成员 ID，只获取这些成员发送的服务器历史消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `String` | 群组 ID。 |
| `conversationType` | `ConversationType` | 传 `ConversationType.GroupChat`。 |
| `pageSize` | `Number` | 每页获取的消息数，默认值为 `20`，取值范围为 `[1,50]`。 |
| `cursor` | `String` | 首次查询传空字符串，后续传入上一页返回的游标。 |
| `fetchOption` | `FetchMessageOption` | 调用 `setFrom(string \| Array<string>)` 设置要查询的群成员 ID，最多可设置 10 个。 |

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
  let option = new FetchMessageOption();
  option.setFrom(['user1', 'user2']);
  option.setDirection(SearchDirection.UP);
  option.setIsSave(true);

  chatManager.fetchHistoryMessages(
    groupId,
    ConversationType.GroupChat,
    20,
    '',
    option
  ).then((result: CursorResult<ChatMessage>): void => {
    let messages = result.getResult();
    let nextCursor = result.getNextCursor();
    // 处理当前页消息；nextCursor 非空时可继续获取下一页。
  }).catch((error: ChatError): void => {
    // 根据 error.errorCode 和 error.description 处理错误。
  });
}
```

### 根据关键字获取本地会话中的消息

调用 `ChatManager#loadConversationMessagesWithKeyword` 可以在本地数据库的所有会话中搜索消息。SDK 返回 `Map<string, Array<string>>`：键为会话 ID，值为该会话中匹配的消息 ID 列表。消息 ID 按 `direction` 指定的时间顺序排列。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keyword` | `string` | 搜索关键词。传空字符串表示忽略该参数。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒。传负数表示从最新消息开始搜索，默认值为 `-1`。 |
| `sender` | `string` | 消息发送方。传空字符串表示不按发送方筛选。 |
| `direction` | `SearchDirection` | `UP` 表示按时间戳逆序搜索，`DOWN` 表示正序搜索。 |
| `scope` | `MessageSearchScope` | 搜索范围，可搜索消息内容、扩展属性或两者。默认值为 `ALL`。 |

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
  chatManager.loadConversationMessagesWithKeyword(
    '时间',
    -1,
    '',
    SearchDirection.UP,
    MessageSearchScope.CONTENT
  ).then((resultMap: Map<string, Array<string>>): void => {
    resultMap.forEach((messageIds: Array<string>, conversationId: string): void => {
      // 使用 conversationId 和 messageIds 获取并展示消息。
    });
  }).catch((error: ChatError): void => {
    // 处理搜索错误。
  });
}
```

### 根据消息 ID 获取本地消息

调用 `ChatManager#loadMessages` 可以根据一个或多个消息 ID 从本地数据库获取消息。每次应传入 `1-20` 个消息 ID，返回结果按照消息时间倒序排列。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageIds` | `Array<string>` | 要查询的消息 ID 列表，不可为空，每次最多传入 20 个。 |

```typescript
let messageIds = ['msgId1', 'msgId2'];
let chatManager = ChatClient.getInstance().chatManager();

chatManager?.loadMessages(messageIds)
  .then((messages: Array<ChatMessage>): void => {
    // messages 按消息时间倒序排列。
  })
  .catch((error: ChatError): void => {
    // 处理查询错误。
  });
```

### 从本地获取指定群成员发送的消息

对于群组会话，可以调用 `Conversation#searchMessagesByKeywords`，通过 `from` 参数筛选一个或多个群成员发送的本地消息。该接口还可以同时指定关键词、起始时间、返回数量、搜索方向和搜索范围。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keywords` | `string` | 搜索关键词。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒。传负数表示从当前时间开始搜索。 |
| `maxCount` | `number` | 每次最多返回的消息数，默认值为 `20`，取值范围为 `[1,400]`。 |
| `from` | `string \| Array<string>` | 消息发送方的用户 ID 或用户 ID 列表；传空字符串表示不限制发送方。 |
| `direction` | `SearchDirection` | `UP` 表示按时间戳逆序搜索，`DOWN` 表示正序搜索。 |
| `searchScope` | `MessageSearchScope` | 搜索消息内容、扩展属性或两者。 |

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(groupId, ConversationType.GroupChat, false);

if (conversation) {
  conversation.searchMessagesByKeywords(
    'hello',
    -1,
    20,
    ['user1', 'user2'],
    SearchDirection.UP,
    MessageSearchScope.CONTENT
  ).then((messages: Array<ChatMessage>): void => {
    // 处理指定群成员发送的本地消息。
  }).catch((error: ChatError): void => {
    // 处理搜索错误。
  });
}
```

### 从本地读取指定会话的消息

HarmonyOS SDK 通过 `Conversation#loadMoreMessagesFromDB` 从本地数据库分页读取指定会话的消息。返回的消息不包含作为查询起点的 `startMsgId` 对应消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `conversationId` | `string` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `conversationType` | `ConversationType` | 会话类型。 |
| `startMsgId` | `string` | 分页起始消息 ID。传空字符串时，`UP` 从最新消息开始，`DOWN` 从最早消息开始。 |
| `pageSize` | `number` | 每页加载的消息数，默认值为 `20`，取值范围为 `[1,400]`。 |
| `direction` | `SearchDirection` | 默认值为 `UP`，按时间戳逆序加载；`DOWN` 按时间戳正序加载。 |

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  conversation.loadMoreMessagesFromDB(
    // startMsgId：查询的起始消息 ID。SDK 从该消息 ID 开始按消息时间戳的逆序加载。如果传入消息的 ID 为空，SDK 从最新消息开始按消息时间戳的逆序获取。
    startMsgId,
    // pageSize：每页期望加载的消息数。取值范围为 [1,400]。
    20,
    SearchDirection.UP
  ).then((messages: Array<ChatMessage>): void => {
    // 处理当前页消息。
  }).catch((error: ChatError): void => {
    // 处理加载错误。
  });
}
```

### 根据消息 ID 获取单个本地消息

调用 `ChatManager#getMessage` 可以根据消息 ID 获取本地存储的单条消息。消息不存在时返回 `undefined`。查询消息不会自动将消息标记为已读。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `messageId` | `string` | 要获取的消息 ID。 |

```typescript
let message = ChatClient.getInstance()
  .chatManager()
  ?.getMessage(messageId);

if (message) {
  // 处理本地消息。
}
```

### 获取本地会话中特定类型的消息

调用 `Conversation#searchMessagesByType` 可以获取指定会话中单个或多个类型的本地消息。未找到匹配消息时返回空数组。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `type` | `ContentType \| Array<ContentType>` | 要搜索的消息类型或消息类型列表。数组不可为空。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒。传负数表示从当前时间开始搜索，默认值为 `-1`。 |
| `maxCount` | `number` | 每次最多返回的消息数，默认值为 `20`，取值范围为 `[1,400]`。 |
| `from` | `string` | 消息发送方。传空字符串表示不按发送方筛选。 |
| `direction` | `SearchDirection` | `UP` 表示按时间戳逆序搜索，`DOWN` 表示正序搜索。 |

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  conversation.searchMessagesByType(
    [ContentType.TXT, ContentType.IMAGE],
    -1,
    20,
    '',
    SearchDirection.UP
  ).then((messages: Array<ChatMessage>): void => {
    // 处理文本和图片消息。
  }).catch((error: ChatError): void => {
    // 处理搜索错误。
  });
}
```

### 获取一定时间内本地会话的消息

调用 `Conversation#searchMessagesBetweenTime` 可以搜索指定会话在一定时间范围内发送和接收的本地消息。返回结果不包含时间戳等于起始时间或结束时间的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `startTimestamp` | `number` | 搜索起始时间戳，单位为毫秒。 |
| `endTimestamp` | `number` | 搜索结束时间戳，单位为毫秒。 |
| `maxCount` | `number` | 每次最多返回的消息数，默认值为 `20`，取值范围为 `[1,400]`。 |

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  conversation.searchMessagesBetweenTime(
    startTimestamp,
    endTimestamp,
    20
  ).then((messages: Array<ChatMessage>): void => {
    // 处理指定时间范围内的消息。
  }).catch((error: ChatError): void => {
    // 处理搜索错误。
  });
}
```

### 获取会话在一定时间内的消息数

调用 `Conversation#getMsgCountInRange` 可以统计 SDK 本地数据库中指定会话在一定时间范围内的消息数。起始和结束时间戳对应的消息均计入统计结果。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `startTimestamp` | `number` | 统计起始时间戳，单位为毫秒，包含该时间点。 |
| `endTimestamp` | `number` | 统计结束时间戳，单位为毫秒，包含该时间点。 |

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  let startTimestamp = Date.now() - 24 * 60 * 60 * 1000;
  let endTimestamp = Date.now();
  let messageCount = conversation.getMsgCountInRange(
    startTimestamp,
    endTimestamp
  );
  // 使用 messageCount 更新界面或执行业务逻辑。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchHistoryMessages`](#从服务器获取指定会话的消息) | `ChatManager` | 从服务器分页获取指定会话的历史消息。 |
| [`setDirection`](#从服务器获取指定会话的消息) | `FetchMessageOption` | 设置服务器历史消息的查询方向。 |
| [`setIsSave`](#从服务器获取指定会话的消息) | `FetchMessageOption` | 设置是否将拉取的消息保存到本地数据库。 |
| [`setFrom`](#从服务器获取指定群成员发送的消息) | `FetchMessageOption` | 设置服务器历史消息的指定发送方。 |
| [`loadConversationMessagesWithKeyword`](#根据关键字获取本地会话中的消息) | `ChatManager` | 根据关键词搜索本地消息并返回会话 ID 与消息 ID 的映射。 |
| [`loadMessages`](#根据消息-id-获取本地消息) | `ChatManager` | 根据消息 ID 列表获取本地消息。 |
| [`searchMessagesByKeywords`](#从本地获取指定群成员发送的消息) | `Conversation` | 根据关键词和发送方搜索本地会话消息。 |
| [`loadMoreMessagesFromDB`](#从本地读取指定会话的消息) | `Conversation` | 从本地数据库分页读取会话消息。 |
| [`getMessage`](#根据消息-id-获取单个本地消息) | `ChatManager` | 根据消息 ID 获取单条本地消息。 |
| [`searchMessagesByType`](#获取本地会话中特定类型的消息) | `Conversation` | 按消息类型、时间和发送方搜索本地消息。 |
| [`searchMessagesBetweenTime`](#获取一定时间内本地会话的消息) | `Conversation` | 按时间范围搜索本地会话消息。 |
| [`getMsgCountInRange`](#获取会话在一定时间内的消息数) | `Conversation` | 统计指定时间范围内的本地消息数。 |
