# 搜索消息

本文介绍环信即时通讯 IM React Native SDK 如何按照关键词、搜索范围、消息类型、发送方和时间戳等条件搜索本地消息。本文中的接口仅查询当前用户设备上的本地数据库，不会向服务端发起搜索请求。由于透传消息不会保存到本地数据库，因此无法通过这些接口搜索透传消息。

:::tip
若要搜索服务端的消息，请联系商务开通。详见 [服务端消息搜索文档](/value-added/search/message_search_rn.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已打开当前用户的本地数据库，详见 [快速开始](quickstart.html) 和 [登录](login.html)。本地消息搜索不要求客户端保持服务器连接。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话中的用户发送的消息

你可以调用 `ChatConversation#getMsgsWithKeyword`，按照关键词搜索指定会话中某个用户发送的消息。通过 `senders` 传入单个用户 ID。

`timestamp` 为搜索起始时间戳，设为负数时从当前时间开始搜索；返回结果不包含时间戳与 `timestamp` 相同的消息。时间戳单位为毫秒，方法返回 `Promise<ChatMessage[]>`。

```typescript
try {
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation('<conversation_id>', ChatConversationType.GroupChat, false);

  if (conversation) {
    // count 取值范围为 1–400；UP 表示按时间戳倒序搜索
    const messages = await conversation.getMsgsWithKeyword({
      keywords: '会议',
      timestamp: -1,
      count: 20,
      senders: ['<sender_user_id>'],
      direction: ChatSearchDirection.UP,
      searchScope: ChatMessageSearchScope.Content,
    });
  }
} catch (error: unknown) {
  console.error('搜索用户消息失败：', error);
}
```

### 根据搜索范围搜索所有会话中的消息

你可以调用 `ChatManager#getMsgsWithKeyword`，按照关键词、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

通过 `searchScope` 还可以指定仅搜索消息内容、仅搜索消息扩展字段，或同时搜索二者。

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keywords` | `string` | 是 | 搜索关键词。 |
| `timestamp` | `number` | 否 | 毫秒时间戳，默认 `-1`，从当前时间开始。 |
| `maxCount` | `number` | 否 | 默认 20，取值范围为 1–400。 |
| `from` | `string` | 否 | 发送方用户 ID，默认空字符串，表示不限发送方。 |
| `direction` | `ChatSearchDirection` | 否 | 默认 `UP`，按消息时间戳逆序搜索；`DOWN` 为正序搜索。 |
| `searchScope` | `ChatMessageSearchScope` | 否 | `Content` 只搜索内容，`Attribute` 只搜索扩展字段，`All` 同时搜索两者，默认为 `All`。 |

```typescript
try {
  const keyword = '会议';
  // 按关键词和搜索范围搜索全部本地会话
  const messages = await ChatClient.getInstance().chatManager
    .getMsgsWithKeyword({
      keywords: keyword,
      timestamp: -1,
      maxCount: 200,
      from: '',
      direction: ChatSearchDirection.UP,
      searchScope: ChatMessageSearchScope.All,
    });
} catch (error: unknown) {
  console.error('搜索全部本地会话失败：', error);
}
```

### 根据搜索范围搜索当前会话中的消息

你可以调用 `ChatConversation#getMsgsWithKeyword`，按照关键词、起始时间戳、最大返回数量、一个或多个发送方、搜索方向及搜索范围，异步搜索当前会话中的消息。也可以调用 `ChatManager#getConvMsgsWithKeyword`，在参数中传入 `convId` 和 `convType`。

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keywords` | `string` | 是 | 搜索关键词。 |
| `timestamp` | `number` | 否 | 毫秒时间戳，默认 `-1`。 |
| `count` | `number` | 否 | 默认 20，范围为 1–400。 |
| `senders` | `string[]` | 否 | 最多 10 个发送方用户 ID；不传或空数组表示不限发送方。 |
| `direction` | `ChatSearchDirection` | 否 | 默认 `UP`，可设为 `DOWN`。 |
| `searchScope` | `ChatMessageSearchScope` | 否 | `Content`、`Attribute` 或 `All`，默认 `All`。 |

```typescript
try {
  const keyword = '会议';
  const conversationId = '<group_id>';
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation(conversationId, ChatConversationType.GroupChat, false);

  if (conversation) {
    const senders = ['<sender_user_id_1>', '<sender_user_id_2>'];
    // senders 最多可包含 10 个用户 ID；不传或传空数组时，不限制消息发送方
    const messages = await conversation.getMsgsWithKeyword({
      keywords: keyword,
      timestamp: -1,
      count: 200,
      senders,
      direction: ChatSearchDirection.UP,
      searchScope: ChatMessageSearchScope.All,
    });
    // messages 为当前会话中符合条件的本地消息
  }
} catch (error: unknown) {
  console.error('搜索当前会话失败：', error);
}
```

### 根据消息类型搜索所有会话中的消息

你可以调用 `ChatManager#searchMessages`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `msgTypes` | `ChatMessageType[]` | 是 | 要搜索的消息类型数组。 |
| `timestamp` | `number` | 是 | 搜索起始毫秒时间戳；传 `-1` 从当前时间开始。 |
| `count` | `number` | 否 | 每次期望返回的消息数，取值范围为 [1,100]，默认为 20。 |
| `from` | `string` | 否 | 发送方用户 ID，不是消息 ID；不限发送方时显式传空字符串。 |
| `direction` | `ChatSearchDirection` | 否 | 默认 `UP`，可设为 `DOWN`。 |

:::notice
调用按消息类型搜索的接口时，请显式传入 `from`。不限制发送方时传入空字符串，避免 Android 端因缺少该字段而调用失败。
:::

```typescript
try {
  // count：每次期望返回的消息数，取值范围为 [1,100]，默认为 20
  // from：会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制
  const types = [ChatMessageType.TXT, ChatMessageType.VOICE];
  const messages = await ChatClient.getInstance().chatManager.searchMessages({
    msgTypes: types,
    timestamp: -1,
    count: 100,
    from: '<sender_user_id>',
    direction: ChatSearchDirection.UP,
  });
  for (const message of messages) {
    if (message.body.type === ChatMessageType.TXT) {
      const body = message.body as ChatTextMessageBody;
      console.log('消息：', body.content, '时间：', message.serverTime);
    } else {
      console.log('消息：', message.body, '时间：', message.serverTime);
    }
  }
} catch (error: unknown) {
  console.error('按类型搜索全部会话失败：', error);
}
```

### 根据消息类型搜索当前会话中的消息

你可以调用 `ChatConversation#searchMessages`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在指定会话中搜索消息。也可以调用 `ChatManager#searchMessagesInConversation`，在参数中传入 `convId` 和 `convType`。

查询参数与上一节相同；会话对象使用自身的会话 ID 和类型。

```typescript
try {
  // count：每次期望返回的消息数，取值范围为 [1,100]，默认为 20
  // from：当前会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制
  const types = [ChatMessageType.TXT, ChatMessageType.VOICE];
  const conversation = await ChatClient.getInstance().chatManager
    .getConversation('<conversation_id>', ChatConversationType.GroupChat, false);

  if (conversation) {
    const messages = await conversation.searchMessages({
      msgTypes: types,
      timestamp: -1,
      count: 100,
      from: '<sender_user_id>',
      direction: ChatSearchDirection.UP,
    });

    for (const message of messages) {
      if (message.body.type === ChatMessageType.TXT) {
        const body = message.body as ChatTextMessageBody;
        console.log('消息：', body.content, '时间：', message.serverTime);
      } else {
        console.log('消息：', message.body, '时间：', message.serverTime);
      }
    }
  }
} catch (error: unknown) {
  console.error('按类型搜索当前会话失败：', error);
}
```

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索本地数据库中单个会话中指定用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索](#根据搜索范围搜索所有会话中的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

设置 `ChatMessageSearchScope.Content` 时，匹配内容如下：

// TODO：研发确认：自定义消息中还支持搜索  `params` 中的字符串值？

| 消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :--- | :--- | :--- |
| 文本消息 | `ChatTextMessageBody.content` | 文本消息的实际内容“你好世界”。 |
| 图片消息 | `ChatImageMessageBody.displayName` | 图片文件名“photo.jpg”。 |
| 语音消息 | `ChatVoiceMessageBody.displayName` | 语音文件名“audio.amr”。 |
| 视频消息 | `ChatVideoMessageBody.displayName` | 视频文件名“video.mp4”。 |
| 文件消息 | `ChatFileMessageBody.displayName` | 文件名“report.pdf”。 |
| 位置消息 | `ChatLocationMessageBody.address` | 地址，例如“北京市朝阳区”。 |
| 自定义消息 | `ChatCustomMessageBody.event` 和 `params` 中的字符串值 | 自定义事件名“gift”，或自定义参数中的值“completed”。 |
| 合并消息 | `ChatCombineMessageBody.title` 和 `ChatCombineMessageBody.summary` | 标题或摘要，例如“聊天记录”或“包含 5 条消息”。 |

React Native SDK 的位置消息体没有公开独立的 `buildingName` 属性；发送位置消息时，可将建筑物名称包含在 `address` 中。

### 只搜索扩展信息

若只搜索消息的扩展属性（`attributes`）JSON 字符串，`keywords` 字段匹配用户自定义添加的扩展属性，例如：

```json
{"key1":"value1", "key2":"value2"}
```

选择 `ChatMessageSearchScope.Attribute` 可只搜索扩展信息。这不是针对对象属性的精确键值过滤；应用需要精确业务筛选时，应对返回结果再次判断。

### 全搜索

同时搜索消息内容和扩展信息，任一匹配即返回。对应的搜索范围为 `ChatMessageSearchScope.All`。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getConversation`](#根据关键字搜索会话中的用户发送的消息) | `ChatManager` | 获取指定 ID 和类型的本地会话；`createIfNeed` 为 `false` 且未找到时返回 `undefined`。 |
| [`getMsgsWithKeyword`](#根据关键字搜索会话中的用户发送的消息) | `ChatConversation` | 按照关键词搜索指定会话中某个用户发送的本地消息。 |
| [`getMsgsWithKeyword`](#根据搜索范围搜索所有会话中的消息) | `ChatManager` | 按照关键词和搜索范围，在全部本地会话中搜索消息。 |
| [`getMsgsWithKeyword`](#根据搜索范围搜索当前会话中的消息) | `ChatConversation` | 按照关键词、发送方列表及搜索范围，异步搜索指定会话中的消息。 |
| [`getConvMsgsWithKeyword`](#根据搜索范围搜索当前会话中的消息) | `ChatManager` | 按照关键词、发送方列表及搜索范围，异步搜索指定会话中的消息。 |
| [`searchMessages`](#根据消息类型搜索所有会话中的消息) | `ChatManager` | 按照一种或多种消息类型，在全部本地会话中搜索消息。 |
| [`searchMessages`](#根据消息类型搜索当前会话中的消息) | `ChatConversation` | 按照一种或多种消息类型，在指定会话中搜索消息。 |
| [`searchMessagesInConversation`](#根据消息类型搜索当前会话中的消息) | `ChatManager` | 按照一种或多种消息类型，在指定会话中搜索消息。 |
