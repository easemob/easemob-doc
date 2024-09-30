# 搜索消息

<Toc />

本文介绍环信即时通讯 IM HarmonyOS SDK 如何搜索本地消息。调用本文中的消息搜索方法可以搜索本地数据库中除命令消息之外的所有类型的消息，因为命令消息不在本地数据库中存储。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 通过 `Conversation` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `ChatManager#searchMessagesFromDB(keywords: string, timestamp: number, maxCount: number, from: string, direction?: SearchDirection)`: 从本地数据库获取包含特定关键字的消息。
- `Conversation#searchMessagesByKeywords(keywords: string, timestamp: number, maxCount: number, from: string, direction: SearchDirection)`：从本地数据库获取`会话`中的指定用户发送的包含特定关键词的消息。
- `Conversation#loadMoreMessagesFromDB(startMsgId: string, pageSize: number, direction: SearchDirection)`：从`指定会话`中指定消息 ID 开始分页加载数据库中的消息。
- `ChatManager#searchMessagesFromDB(types: Array<ContentType>, timestamp: number, maxCount: number, from?: string, direction?: SearchDirection)`: 按照消息类型从本地数据库搜索消息。
- `Conversation#searchMessagesByType(type: ContentType | Array<ContentType>, timestamp: number, maxCount: number, from?: string, direction?: SearchDirection)`：从本地数据库获取`指定会话`的一定数量的特定类型的消息。
- `Conversation#searchMessagesFromDB(timestamp: number, maxCount: number, direction?: SearchDirection)`: 基于 Unix 时间戳搜索本地数据库中`指定会话`的消息。
- `Conversation#searchMessagesBetweenTime(startTimestamp: number, endTimestamp: number, maxCount: number)`：从本地数据库中`指定会话`中搜索指定时间段内发送或接收的一定数量的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从指定消息 ID 开始搜索会话消息

你可以调用 `Conversation#loadMoreMessagesFromDB` 方法从指定消息 ID 开始分页加载数据库中的消息，示例代码如下：

```TypeScript
// conversationId：会话 ID。
const conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
// startMsgId: 查询的起始消息 ID。该参数设置后，SDK 从指定的消息 ID 开始按消息检索方向加载。如果传入消息的 ID 为空，SDK 忽略该参数。
// pageSize: 每页要加载的消息数。取值范围为 [1,400]。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = conversation?.loadMoreMessagesFromDB(startMsgId, pageSize, direction);
```

### 根据关键字搜索会话消息

你可以调用 `ChatManager#searchMessagesFromDB(keywords: string, timestamp: number, maxCount: number, from?: string, direction?: SearchDirection)` 方法根据关键字搜索本地数据库中指定用户发送的消息，示例代码如下：

```TypeScript
// keywords：搜索关键字；
// timestamp：搜索的起始时间戳；
// maxCount：每次获取的消息数量，取值范围为 [1,400]。
// from: 单聊或群聊中的消息发送方的用户 ID。若设置为空字符串，SDK 将在整个会话中搜索消息。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = ChatClient.getInstance().chatManager()?.searchMessagesFromDB(keywords, timestamp, maxCount, from, direction);
```

你可以调用 `Conversation#searchMessagesByKeywords` 方法根据关键字搜索本地数据库中`单个会话`中指定用户发送的消息，示例代码如下：

```TypeScript
// conversationId：会话 ID。
const conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
// keywords：搜索关键字；
// timestamp：搜索的起始时间戳；
// maxCount：每次获取的消息数量，取值范围为 [1,400]。
// from: 单聊或群聊中的消息发送方的用户 ID。若设置为空字符串，SDK 将在整个会话中搜索消息。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = conversation?.searchMessagesByKeywords(keywords, timestamp, maxCount, from, direction);
```

### 根据消息类型搜索会话消息

你可以调用 `ChatManager#searchMessagesFromDB(contentType: ContentType | Array<ContentType>, timestamp: number, maxCount: number, from?: string, direction?: SearchDirection)` 方法除了设置消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以设置单个或多个消息类型搜索本地数据库中所有会话的消息。

:::tip
使用设置多个消息类型搜索消息的功能，需将 SDK 升级至 V1.4.0 或以上版本。
:::

```TypeScript
const types = [ContentType.TXT, ContentType.IMAGE];
// timestamp：查询的起始消息 Unix 时间戳，单位为毫秒。该参数设置后，SDK 从指定时间戳的消息开始，按消息搜索方向获取。如果该参数设置为负数，SDK 从当前时间开始搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]。
// from: 单聊或群聊中的消息发送方的用户 ID。若设置为空字符串，SDK 将在整个会话中搜索消息。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = ChatClient.getInstance().chatManager()?.searchMessagesFromDB(types, timestamp, maxCount, from, direction);
``` 

你可以调用 `Conversation#searchMessagesByType` 方法通过设置单个或多个消息类型搜索本地数据库中`指定会话`的消息，示例代码如下：

```TypeScript
// conversationId：会话 ID。
const conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
const types = [ContentType.TXT, ContentType.IMAGE];
// timestamp：查询的起始消息 Unix 时间戳，单位为毫秒。该参数设置后，SDK 从指定时间戳的消息开始，按消息搜索方向获取。如果该参数设置为负数，SDK 从当前时间开始搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]。
// from: 单聊或群聊中的消息发送方的用户 ID。若设置为空字符串，SDK 将在整个会话中搜索消息。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = conversation?.searchMessagesByType(types, timestamp, maxCount, from, direction);
``` 

### 根据时间戳搜索当前会话中的消息

你可以调用 `Conversation#searchMessagesFromDB(timestamp: number, maxCount: number, direction?: SearchDirection)` 方法设置消息时间戳、消息数量和搜索方向等条件搜索当前会话中的消息。

```TypeScript
// conversationId：会话 ID。
const conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
// timestamp：查询的起始消息 Unix 时间戳，单位为毫秒。该参数设置后，SDK 从指定时间戳的消息开始，按消息搜索方向获取。如果该参数设置为负数，SDK 从当前时间开始搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
const messages = conversation?.searchMessagesFromDB(timestamp, maxCount, direction);
```         

### 根据时间段搜索当前会话中的消息

你可以调用 `Conversation#searchMessagesBetweenTime` 方法设置消息起始时间戳、结束时间戳和消息数量等条件搜索当前会话中的消息。

```TypeScript
// conversationId：会话 ID。
const conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
// startTimestamp: 搜索的起始时间戳。单位为毫秒。
// endTimestamp: 搜索的结束时间戳。单位为毫秒。
// maxCount: 每次要获取的消息数量。取值范围为 [1,400]。
const messages = conversation?.searchMessagesBetweenTime(startTimestamp, endTimestamp, maxCount);
```  
