# 获取历史消息

## 功能说明

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

本文介绍环信即时通讯 IM SDK 如何从服务器获取历史消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

仅查询本地消息时，不要求客户端保持服务器连接，但需确保当前用户的本地数据库已打开，详见 [登录](login.html)。

## 从服务器获取指定会话的消息

你可以调用 `ChatManager#fetchHistoryMessagesByOptions` 方法基于 `ChatFetchMessageOptions` 类从服务端分页拉取单聊和群组聊天的历史消息。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` | `string` | 会话 ID。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID。 |
| `convType` | `ChatConversationType` | 会话类型。单聊传 `PeerChat`，群聊传 `GroupChat`，聊天室传 `RoomChat`。 |
| `params.pageSize` | `number` | 每页拉取的消息数，建议为 20，最大不超过 50。若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。 |
| `params.cursor` | `string` | 分页游标。首次拉取传空字符串，后续传入上一次返回结果中 `ChatCursorResult.cursor` 的值。 |
| `params.options` | `ChatFetchMessageOptions` | 可选的拉取选项，可设置以下条件：<br/> - 消息发送方；<br/> - 消息类型；<br/> - 消息时间段；<br/> - 消息搜索方向；<br/> - 是否将拉取的消息保存到数据库；<br/> - 对于群组聊天，你可以设置 `senders` 属性拉取群组中指定成员发送的历史消息。 |

方法返回 `Promise<ChatCursorResult<ChatMessage>>`，通过 `list` 获取当前页消息，通过 `cursor` 获取下一页游标。`list` 为可选值，读取时使用 `result.list ?? []`；最后一页的 `cursor` 为空字符串。

传入 `options` 时，字段说明如下：

| 属性 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `senders` | `string[]` | 否 | 群聊中指定发送方，最多 10 个用户 ID。 |
| `msgTypes` | `ChatMessageType[]` | 否 | 消息类型；不传表示不按类型筛选。 |
| `startTs` / `endTs` | `number` | 是 | 查询时间范围，Unix 时间戳，单位为毫秒；设为 `-1` 表示不指定对应边界。 |
| `direction` | `ChatSearchDirection` | 是 | `UP` 为按消息时间戳逆序查询，`DOWN` 为正序查询。 |
| `needSave` | `boolean` | 是 | 是否将拉取结果保存到本地数据库。 |

:::tip
1. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
2. 获取单聊历史消息时会读取服务端保存的消息送达状态和已读状态。该功能默认关闭，如果需要，请联系环信商务开通。
3. 历史消息在服务器上的存储时间与产品的套餐包相关，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
:::

```typescript
async function fetchAllHistoryMessages(): Promise<void> {
  const conversationId = '<conversation_id>';
  const conversationType = ChatConversationType.PeerChat;
  const options = new ChatFetchMessageOptions({
    startTs: -1,
    endTs: -1,
    direction: ChatSearchDirection.UP,
    needSave: false,
  });

  // 例如，设置获取的消息保存到数据库
  // options.needSave = true;
  // 例如，设置按时间正序获取消息
  // options.direction = ChatSearchDirection.DOWN;

  const pageSize = 40;
  let cursor = '';
  const messages: ChatMessage[] = [];

  try {
    do {
      // 分页获取服务端历史消息
      const result = await ChatClient.getInstance().chatManager
        .fetchHistoryMessagesByOptions(
          conversationId,
          conversationType,
          { pageSize, cursor, options }
        );

      messages.push(...(result.list ?? []));

      // 拉取到最后一页时，返回的 cursor 为空字符串
      cursor = result.cursor;
    } while (cursor);

    // 处理获取到的消息列表
    console.log('历史消息：', messages);
  } catch (error: unknown) {
    // 处理出错信息
    console.error('获取历史消息失败：', error);
  }
}

void fetchAllHistoryMessages();
```

## 从服务器获取指定群成员发送的消息

对于单个群组会话，你可以从服务器获取指定成员（而非全部成员）发送的消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` | `string` | 群组 ID。 |
| `convType` | `ChatConversationType` | 会话类型。获取群聊消息时传 `GroupChat`。 |
| `params.pageSize` | `number` | 每页拉取的消息数，建议为 20，最大不超过 50。 |
| `params.cursor` | `string` | 分页游标。首次拉取传空字符串，后续传入上一次返回的游标。 |
| `params.options` | `ChatFetchMessageOptions` | 拉取选项。通过 `senders` 属性设置要查询的群成员 ID，最多可设置 10 个。其余必需字段与上一节相同。 |

方法返回 `Promise<ChatCursorResult<ChatMessage>>`，成功时获取消息列表和下一页游标。

```typescript
async function fetchMemberHistory(): Promise<void> {
  const conversationId = '<group_id>';
  const conversationType = ChatConversationType.GroupChat;
  const options = new ChatFetchMessageOptions({
    startTs: -1,
    endTs: -1,
    direction: ChatSearchDirection.UP,
    needSave: false,
  });
  // 例如，设置获取的消息保存到数据库
  // options.needSave = true;
  // 例如，设置按时间正序获取消息
  // options.direction = ChatSearchDirection.DOWN;
  // 例如，你可以获取群组中某 2 个用户 ID 的消息
  options.senders = ['<member_user_id_1>', '<member_user_id_2>'];

  const pageSize = 40;
  let cursor = '';
  const messages: ChatMessage[] = [];

  try {
    do {
      // 按指定群成员分页获取服务端历史消息
      const result = await ChatClient.getInstance().chatManager
        .fetchHistoryMessagesByOptions(
          conversationId,
          conversationType,
          { pageSize, cursor, options }
        );
      messages.push(...(result.list ?? []));
      // 拉取到最后一页时，返回的 cursor 为空字符串
      cursor = result.cursor;
    } while (cursor);

    // 处理获取到的消息列表
    console.log('群成员历史消息：', messages);
  } catch (error: unknown) {
    // 处理出错信息
    console.error('获取群成员历史消息失败：', error);
  }
}

void fetchMemberHistory();
```

## 根据关键字获取本地会话中的消息

你可通过设置关键词获取本地数据库中会话的某些消息。SDK 返回会话 ID 及消息 ID 列表的映射关系，消息 ID 根据你设置的 `direction` 参数按照消息时间戳的正序或倒序列明。

调用 `ChatManager#getConvsMsgsWithKeyword`，返回 `Promise<Map<string, string[]>>`。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keywords` | `string` | 要搜索的关键词。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒，默认 `-1`。传负数表示从当前时间开始搜索。 |
| `from` | `string` | 发送方用户 ID。不传表示不按发送方筛选。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索。建议显式传入；当前实现省略时使用 `DOWN`。 |
| `searchScope` | `ChatMessageSearchScope` | 搜索范围，例如 `Content` 表示搜索消息内容，默认 `All`。 |

```typescript
const keyword = '时间';
// 根据关键词搜索本地会话，返回会话 ID 与消息 ID 列表的映射
ChatClient.getInstance().chatManager.getConvsMsgsWithKeyword({
  keywords: keyword,
  timestamp: -1,
  direction: ChatSearchDirection.UP,
  searchScope: ChatMessageSearchScope.Content,
}).then((result) => {
  console.log('搜索成功：', result);
}).catch((error: unknown) => {
  console.error('搜索本地会话消息失败：', error);
});
```

## 根据消息 ID 获取本地消息

你可以传入单个或多个消息 ID 获取单个本地会话中的消息。

调用 `ChatManager#getMessagesWithIds`，返回 `Promise<ChatMessage[]>`，成功时返回找到的本地消息列表。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `msgIds` | `string[]` | 要查询的消息 ID 列表。每次最多传入 20 个消息 ID。 |
| `convId` | `string` | 消息所属的会话 ID。 |
| `convType` | `ChatConversationType` | 消息所属的会话类型。 |

```typescript
// msgIds：消息 ID 列表。每次最多可传入 20 个消息 ID
ChatClient.getInstance().chatManager.getMessagesWithIds({
  convId: '<group_id>',
  convType: ChatConversationType.GroupChat,
  msgIds: ['<message_id_1>', '<message_id_2>'],
}).then((messages) => {
  console.log('查询成功：', messages);
}).catch((error: unknown) => {
  console.error('批量获取本地消息失败：', error);
});
```

## 从本地获取指定群成员发送的消息

对于单个群组会话，你可以从本地获取指定成员（而非全部成员）发送的消息。

调用 `ChatConversation#getMsgsWithKeyword`，返回 `Promise<ChatMessage[]>`。也可以调用 `ChatManager#getConvMsgsWithKeyword`，传入群组 ID 和会话类型。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `keywords` | `string` | 要搜索的关键词。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒，默认 `-1`。传负数表示从当前时间开始搜索。 |
| `count` | `number` | 每次最多返回的消息数，默认 20，取值范围为 `[1,400]`。 |
| `senders` | `string[]` | 要筛选的发送方用户 ID 列表，最多 10 个；不传或空数组表示不限制发送方。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索，默认 `UP`。 |
| `searchScope` | `ChatMessageSearchScope` | 搜索范围，例如 `Content` 表示搜索消息内容，默认 `All`。 |

```typescript
try {
  const conversationId = '<group_id>';
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation(conversationId, ChatConversationType.GroupChat, false);
  if (conversation) {
    const keywords = 'hello';
    const timestamp = -1; // 小于 0 表示从当前时间开始搜索
    const count = 20;
    // 限制发送人，最多 10 个；如果不限制发送人，不传或传空数组
    const senders = ['<member_user_id_1>', '<member_user_id_2>'];
    const messages = await conversation.getMsgsWithKeyword({
      keywords,
      timestamp,
      count,
      senders,
      direction: ChatSearchDirection.UP,
      searchScope: ChatMessageSearchScope.Content,
    });
    for (const message of messages) {
      const msgId = message.msgId;
      const from = message.from;
      const msgTime = message.serverTime;
      // TODO: 处理搜索结果
    }
  }
} catch (error: unknown) {
  // TODO: 处理错误
  console.error('获取本地群成员消息失败：', error);
}
```

## 从本地读取指定会话的消息

你可以调用 `ChatConversation#getMsgs` 方法从本地数据库中分页加载消息，加载的消息会基于消息中的时间戳放入当前会话的内存中。也可以调用 `ChatManager#getMsgs`，传入会话 ID 和类型。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` / `convType` | `string` / `ChatConversationType` | 会话 ID 和类型。单聊传对端用户 ID，群聊传群组 ID，聊天室传聊天室 ID；获取会话对象时传入。 |
| `startMsgId` | `string` | 分页查询的起始消息 ID。传空字符串并使用 `UP` 时，从最新消息开始加载。结果不包含起始消息。 |
| `loadCount` | `number` | 每页期望加载的消息数，取值范围为 [1,50]，默认为 20。 |
| `direction` | `ChatSearchDirection` | 默认 `UP`，按消息时间戳逆序加载；`DOWN` 为正序加载。 |

```typescript
try {
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation('<conversation_id>', ChatConversationType.PeerChat, false);
  if (conversation) {
    // startMsgId：查询的起始消息 ID。传空字符串时，从最新消息开始按消息时间戳逆序加载
    // loadCount：每页期望加载的消息数，取值范围为 [1,50]，默认为 20
    const pagedMessages = await conversation.getMsgs({
      startMsgId: '',
      loadCount: 20,
      direction: ChatSearchDirection.UP,
    });
  }
} catch (error: unknown) {
  console.error('加载本地会话消息失败：', error);
}
```

### 根据消息 ID 获取单个本地消息

你可以调用 `ChatManager#getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回 `undefined`。

方法返回 `Promise<ChatMessage | undefined>`。该接口只查询本地，不会自动拉取服务端消息，也不会将消息标记为已读或清零会话未读数。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `msgId` | `string` | 要获取的消息 ID。 |

```typescript
try {
  // msgId：要获取消息的消息 ID
  const msg = await ChatClient.getInstance().chatManager
    .getMessage('<message_id>');
} catch (error: unknown) {
  console.error('获取本地消息失败：', error);
}
```

### 获取本地会话中特定类型的消息

你可以调用 `ChatConversation#getMsgsWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。也可以调用 `ChatManager#getMsgsWithMsgType`，传入会话 ID 和类型。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` / `convType` | `string` / `ChatConversationType` | 要搜索的会话 ID 和类型；获取会话对象时传入。 |
| `msgType` | `ChatMessageType` | 要搜索的消息类型，例如 `TXT`。 |
| `timestamp` | `number` | 搜索起始时间戳，单位为毫秒，默认 `-1`。传负数时从当前时间开始搜索。 |
| `count` | `number` | 每次获取的消息数，取值范围为 `[1,400]`。 |
| `sender` | `string` | 发送方用户 ID。不传表示不按发送方筛选。 |
| `direction` | `ChatSearchDirection` | 搜索方向：`UP` 为按消息时间戳逆序搜索，`DOWN` 为正序搜索，默认 `UP`。 |

```typescript
try {
  // conversationId：会话 ID
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation('<conversation_id>', ChatConversationType.GroupChat, false);
  if (conversation) {
    // msgType：消息类型；timestamp：搜索起始时间戳，单位为毫秒；负数表示从当前时间开始逆序搜索
    // count：每次获取的消息数量，取值范围为 [1,400]；direction：UP 为逆序搜索，DOWN 为正序搜索
    const messages = await conversation.getMsgsWithMsgType({
      msgType: ChatMessageType.TXT,
      timestamp: Date.now(),
      count: 20,
      sender: '<sender_user_id>',
      direction: ChatSearchDirection.UP,
    });
  }
} catch (error: unknown) {
  console.error('按类型获取本地消息失败：', error);
}
```

### 获取一定时间内本地会话的消息

你可以调用 `ChatConversation#getMsgWithTimestamp` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。也可以调用 `ChatManager#getMsgWithTimestamp`，传入会话 ID 和类型。

每次最多可获取 400 条消息。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` / `convType` | `string` / `ChatConversationType` | 要搜索的会话 ID 和类型；获取会话对象时传入。 |
| `startTime` | `number` | 搜索起始时间戳，单位为毫秒。 |
| `endTime` | `number` | 搜索结束时间戳，单位为毫秒。 |
| `count` | `number` | 每次获取的消息数，默认 20，取值范围为 `[1,400]`。 |
| `direction` | `ChatSearchDirection` | 可选，TypeScript 层默认 `UP`；当前双端原生桥接未向时间范围查询传递该参数，不应依赖它控制返回顺序。 |

方法返回 `Promise<ChatMessage[]>`，没有结果时返回空数组；返回结果不包含时间戳与起止边界相同的消息。

```typescript
try {
  // conversationId：会话 ID
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation('<conversation_id>', ChatConversationType.PeerChat, false);
  if (conversation) {
    const endTime = Date.now();
    // startTime：搜索的起始时间戳；endTime：搜索的结束时间戳；count：每次获取的消息数量，取值范围为 [1,400]
    const messageList = await conversation.getMsgWithTimestamp({
      startTime: endTime - 24 * 60 * 60 * 1000,
      endTime,
      count: 20,
    });
  }
} catch (error: unknown) {
  console.error('按时间获取消息失败：', error);
}
```

### 获取会话在一定时间内的消息数

你可以调用 `ChatManager#getMessageCountWithTimestamp` 方法从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。返回 `Promise<number>`。

参数说明如下：

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| `convId` | `string` | 要统计的会话 ID。 |
| `convType` | `ChatConversationType` | 要统计的会话类型。 |
| `start` | `number` | 统计起始时间戳，单位为毫秒。 |
| `end` | `number` | 统计结束时间戳，单位为毫秒。 |
| `isChatThread` | `boolean` | 是否为消息话题，普通会话传 `false`。 |

```typescript
try {
  const conversationId = '<conversation_id>';
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation(conversationId, ChatConversationType.PeerChat, false);
  if (conversation) {
    const end = Date.now();
    const start = end - 24 * 60 * 60 * 1000;
    // 统计指定时间段内的本地消息数
    const count = await ChatClient.getInstance().chatManager
      .getMessageCountWithTimestamp({
        convId: conversation.convId,
        convType: conversation.convType,
        start,
        end,
        isChatThread: conversation.isChatThread,
      });
    console.log('指定时间段的消息数：', count);
  }
} catch (error: unknown) {
  console.error('统计消息数量失败：', error);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchHistoryMessagesByOptions`](#从服务器获取指定会话的消息) | `ChatManager` | 从服务端分页获取指定会话的历史消息。 |
| [`getConvsMsgsWithKeyword`](#根据关键字获取本地会话中的消息) | `ChatManager` | 根据关键词从本地数据库搜索消息，返回会话 ID 与消息 ID 列表的映射。 |
| [`getMessagesWithIds`](#根据消息-id-获取本地消息) | `ChatManager` / `ChatConversation` | 根据消息 ID 获取本地消息。 |
| [`getMsgsWithKeyword`](#从本地获取指定群成员发送的消息) | `ChatConversation` | 根据关键词和发送方从本地会话搜索消息。 |
| [`getConvMsgsWithKeyword`](#从本地获取指定群成员发送的消息) | `ChatManager` | 根据关键词和发送方从指定本地会话搜索消息。 |
| [`getMsgs`](#从本地读取指定会话的消息) | `ChatManager` / `ChatConversation` | 从本地数据库分页加载会话消息。 |
| [`getMessage`](#根据消息-id-获取单个本地消息) | `ChatManager` | 根据消息 ID 获取单条本地消息。 |
| [`getMsgsWithMsgType`](#获取本地会话中特定类型的消息) | `ChatManager` / `ChatConversation` | 按消息类型、时间和发送方搜索本地消息。 |
| [`getMsgWithTimestamp`](#获取一定时间内本地会话的消息) | `ChatManager` / `ChatConversation` | 按时间范围搜索本地会话消息。 |
| [`getMessageCountWithTimestamp`](#获取会话在一定时间内的消息数) | `ChatManager` | 统计指定时间范围内的本地消息数。 |
