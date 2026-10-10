# 搜索消息

本文介绍环信即时通讯 IM HarmonyOS SDK 如何按照关键词、搜索范围、消息类型、发送方和时间戳等条件搜索本地消息。本文中的接口仅查询当前用户设备上的本地数据库，不会向服务端发起搜索请求。由于透传消息不会保存到本地数据库，因此无法通过这些接口搜索透传消息。

消息搜索使用消息创建时间还是服务器接收时间，取决于 `ChatOptions#setSortMessageByServerTime` 的配置。该配置默认为 `true`，即使用服务器接收消息的时间；设置为 `false` 时使用消息的本地创建时间。

:::tip
若要搜索服务端消息，需要联系环信商务开通服务端消息搜索功能，详见 [服务端消息搜索文档](/value-added/search/message_search_harmonyos.html)。
:::

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并确认当前用户的本地数据库已经打开，详见 [获取连接状态](connection.html#获取连接状态) 和 [快速开始](quickstart.html)。本地消息搜索不要求客户端保持服务器连接。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

除必填的关键词或消息类型外，以下搜索接口的常用参数均有默认值：
- `timestamp` 默认为 `-1`，表示从当前时间开始；
- `maxCount` 默认为 `20`；
- `from` 默认为空字符串，表示不限制发送方；
- `direction` 默认为 `SearchDirection.UP`，表示按时间戳倒序搜索；
- 关键词搜索的 `searchScope` 默认为 `MessageSearchScope.ALL`。

### 根据关键字搜索会话中的用户发送的消息

你可以调用 `Conversation#searchMessagesByKeywords`，按照关键词搜索指定会话中某个用户发送的消息。

`timestamp` 为搜索起始时间戳，设为负数时从当前时间开始搜索；返回结果不包含时间戳与 `timestamp` 相同的消息。`maxCount` 的取值范围为 `[1,400]`。

```typescript
const conversation: Conversation | undefined = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType);

if (conversation) {
  conversation.searchMessagesByKeywords(  
    keywords,
    timestamp,
   // maxCount 取值范围为 1–400。
    maxCount,
    senderId,
    // UP 表示按时间戳倒序搜索。
    SearchDirection.UP,
    MessageSearchScope.CONTENT
  )
    .then((messages: Array<ChatMessage>): void => {
      // messages 为符合条件的本地消息，按时间戳倒序排列。
    })
    .catch((error: ChatError): void => {
      // 搜索失败。
    });
}
```

### 根据搜索范围搜索所有会话中的消息

你可以调用 `ChatManager#searchMessagesFromDB`，按照关键词、起始时间戳、最大返回数量、发送方、搜索方向和搜索范围，在全部本地会话中搜索消息。

`MessageSearchScope.CONTENT` 表示仅搜索消息内容，`MessageSearchScope.EXT` 表示仅搜索消息扩展字段，`MessageSearchScope.ALL` 表示同时搜索两者。

```typescript
const keyword: string = '123';

ChatClient.getInstance().chatManager()?.searchMessagesFromDB(
  keyword,
  -1,
  200,
  '',
  SearchDirection.UP,
  MessageSearchScope.ALL
)
  .then((messages: Array<ChatMessage>): void => {
    // messages 为全部本地会话中符合条件的消息。
  })
  .catch((error: ChatError): void => {
    // 搜索失败。
  });
```

### 根据搜索范围搜索当前会话中的消息

你可以调用 `Conversation#searchMessagesByKeywords`，按照关键词、起始时间戳、最大返回数量、一个或多个发送方、搜索方向及搜索范围，搜索当前会话中的消息。

参数 `from` 可以传入单个用户 ID 或用户 ID 数组。用户 ID 数组最多包含 10 个用户 ID；传入空字符串或空数组时，不限制消息发送方。

```typescript
const conversation: Conversation | undefined = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType);

if (conversation) {
  const senders: Array<string> = ['user1', 'user2'];

  conversation.searchMessagesByKeywords(
    '123',
    -1,
    200,
    senders,
    SearchDirection.UP,
    MessageSearchScope.ALL
  )
    .then((messages: Array<ChatMessage>): void => {
      // messages 为当前会话中符合条件的本地消息。
    })
    .catch((error: ChatError): void => {
      // 搜索失败。
    });
}
```

### 根据消息类型搜索所有会话中的消息

你可以调用 `ChatManager#searchMessagesFromDB`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在全部本地会话中搜索消息。消息类型数组不能为空。

```typescript
const types: Array<ContentType> = [ContentType.TXT, ContentType.VOICE];

ChatClient.getInstance().chatManager()?.searchMessagesFromDB(
  types,
  -1,
  400,
  'xu',
  SearchDirection.UP
)
  .then((messages: Array<ChatMessage>): void => {
    // messages 为全部本地会话中符合类型和发送方条件的消息。
  })
  .catch((error: ChatError): void => {
    // 搜索失败。
  });
```

### 根据消息类型搜索当前会话中的消息

你可以调用 `Conversation#searchMessagesByType`，按照一种或多种消息类型、起始时间戳、最大返回数量、发送方和搜索方向，在指定会话中搜索消息。消息类型数组不能为空。

```typescript
const conversation: Conversation | undefined = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType);

if (conversation) {
  const types: Array<ContentType> = [ContentType.TXT, ContentType.VOICE];

  conversation.searchMessagesByType(
    types,
    -1,
    400,
    'xu',
    SearchDirection.UP
  )
    .then((messages: Array<ChatMessage>): void => {
      // messages 为当前会话中符合类型和发送方条件的消息。
    })
    .catch((error: ChatError): void => {
      // 搜索失败。
    });
}
```

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索会话中的用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据搜索范围搜索所有会话中的消息](#根据搜索范围搜索所有会话中的消息)。
- [根据搜索范围搜索当前会话中的消息](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

| 消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :--- | :--- | :--- |
| 文本消息 | `TextMessageBody#getContent` | 文本消息的实际内容，例如“你好世界”。 |
| 图片消息 | `ImageMessageBody#getFileName` | 图片文件名，例如“photo.jpg”。 |
| 语音消息 | `VoiceMessageBody#getFileName` | 语音文件名，例如“audio.amr”。 |
| 视频消息 | `VideoMessageBody#getFileName` | 视频文件名，例如“video.mp4”。 |
| 文件消息 | `FileMessageBody#getFileName` | 文件名，例如“report.pdf”。 |
| 位置消息 | `LocationMessageBody#getAddress` 和 `LocationMessageBody#getBuildingName` | 地址或建筑物名称，例如“北京市朝阳区”或“国贸大厦”。 |
| 自定义消息 | `CustomMessageBody#event` | 自定义事件名，例如“gift”。 |
| 合并消息 | `CombineMessageBody#getTitle` 和 `CombineMessageBody#getSummary` | 标题或摘要，例如“聊天记录”或“包含 5 条消息”。 |

### 只搜索扩展信息

若只搜索消息的扩展字段 `ext`，`keywords` 匹配扩展字段序列化后的 JSON 字符串。例如：

```json
{"key1":"value1", "key2":"value2"}
```

### 全搜索

同时搜索消息内容和扩展字段，任一匹配即返回。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setSortMessageByServerTime`](#搜索消息) | `ChatOptions` | 设置本地消息排序和搜索使用服务器时间还是本地创建时间。 |
| [`getConversation`](#根据关键字搜索会话中的用户发送的消息) | `ChatManager` | 获取指定 ID 和类型的本地会话；未找到时返回 `undefined`。 |
| [`searchMessagesByKeywords`](#根据关键字搜索会话中的用户发送的消息) | `Conversation` | 按照关键词搜索指定会话中某个用户发送的本地消息。 |
| [`searchMessagesFromDB`](#根据搜索范围搜索所有会话中的消息) | `ChatManager` | 按照关键词和搜索范围，在全部本地会话中搜索消息。 |
| [`searchMessagesByKeywords`](#根据搜索范围搜索当前会话中的消息) | `Conversation` | 按照关键词、发送方列表及搜索范围，搜索指定会话中的消息。 |
| [`searchMessagesFromDB`](#根据消息类型搜索所有会话中的消息) | `ChatManager` | 按照一种或多种消息类型，在全部本地会话中搜索消息。 |
| [`searchMessagesByType`](#根据消息类型搜索当前会话中的消息) | `Conversation` | 按照一种或多种消息类型，在指定会话中搜索消息。 |
