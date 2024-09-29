# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM HarmonyOS SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供 `ChatManager` 和 `Conversation` 类支持获取服务器和本地的消息，包含如下主要方法：

- `ChatManager.fetchHistoryMessages`：根据 `FetchMessageOption` 类从服务端分页获取指定会话的历史消息；
- `Conversation.loadMoreMessagesFromDB`：读取本地指定会话的消息；
- `ChatManager.getMessage`：根据消息 ID 获取本地消息；
- `Conversation.searchMessagesByType`：获取本地存储的指定会话中特定类型的消息；
- `Conversation.searchMessagesBetweenTime`：获取本地存储的一定时间内的消息；
- `Conversation.searchMessagesByKeywords`：根据关键字搜索本地数据库中单个会话中指定用户发送的消息；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的消息

你可以调用 `fetchHistoryMessages` 方法基于 `FetchMessageOption` 类从服务端分页拉取单聊和群组聊天的历史消息。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。分页查询时，若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。

通过设置 `FetchMessageOption` 类，你可以根据以下条件拉取历史消息：

- 消息发送方；
- 消息类型；
- 消息时间段；
- 消息搜索方向；
- 是否将拉取的消息保存到数据库；
- 对于群组聊天，你可以设置 `from` 参数拉取群组中单个成员发送的历史消息。

:::tip
1. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
2. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
3. 各类事件通知发送时，若接收的用户离线，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```TypeScript
ChatClient.getInstance().chatManager()?.fetchHistoryMessages(conversationId, conversationType, pageSize, cursor, fetchMessageOption).then((result) => {
  let cursor = result.getNextCursor();
  let list = result.getResult();
  if (cursor && list.length === pageSize) {
    // get more history messages logic
  }
})
```

### 从本地读取指定会话的消息

你可以调用 `loadMoreMessagesFromDB` 方法从本地数据库中分页加载消息。

```TypeScript
// startMessageId：查询的起始消息 ID。SDK 从该消息 ID 开始按消息时间戳的逆序加载。如果传入消息的 ID 为空，SDK 从最新消息开始按消息时间戳的逆序获取。
// pageSize：每页期望加载的消息数。取值范围为 [1,400]。
conversation.loadMoreMessagesFromDB(startMessageId, pageSize).then((result) => {
  // success logic
})
```

### 根据消息 ID 获取本地消息

你可以调用 `getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```TypeScript
// msgId：要获取消息的消息 ID。
let msg = ChatClient.getInstance().chatManager()?.getMessage(msgId);
if (msg) {
    // success logic
}
```

### 获取本地会话中特定类型的消息

你可以调用 `searchMessagesByType` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```TypeScript
//conversationId：会话 ID
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if (!conversation) {
    return;
}
// ContentType：消息类型；timeStamp：消息搜索的起始时间戳，单位为毫秒。该参数设置后，SDK 从指定的时间戳的消息开始，按照搜索方向对消息进行搜索。若设置为负数，SDK 从当前时间开始，按消息时间戳的逆序搜索。
// maxCount：每次获取的消息数量，取值范围为 [1,400]；direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
conversation.searchMessagesByType(ContentType.TXT, systemDateTime.getTime(), maxCount, from, SearchDirection.UP).then((messages) => {
    // success logic      
});
```

### 获取一定时间内本地会话的消息

你可以调用 `searchMessagesBetweenTime` 方法从本地存储中搜索一定时间段内指定会话中发送和接收的消息。

每次最多可获取 400 条消息。

```TypeScript
//conversationId：会话 ID
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if (!conversation) {
    return;
}
// startTimeStamp：搜索的起始时间戳；endTimeStamp：搜索的结束时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
conversation.searchMessagesBetweenTime(startTimeStamp, endTimeStamp, maxCount).then((messages) => {
    // success logic
});
```
### 根据关键字搜索会话消息

你可以调用 `searchMessagesByKeywords` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

```TypeScript
//conversationId：会话 ID
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if (!conversation) {
    return;
}
// keywords：搜索关键字；timestamp：搜索的起始时间戳；maxCount：每次获取的消息数量，取值范围为 [1,400]。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
conversation.searchMessagesByKeywords(keywords, timestamp, maxCount, from, direction).then((messages) => {
    // success logic
});
```

### 获取会话在一定时间内的消息数

你可以调用 `getMsgCountInRange` 方法从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。

```TypeScript
//conversationId：会话 ID
let conversation = ChatClient.getInstance().chatManager()?.getConversation(conversationId);
if (!conversation) {
  return;
}
// startTimestamp：起始时间戳(包含)，单位为毫秒。
// endTimestamp：结束时间戳(包含)，单位为毫秒。
const msgCount = conversation.getMsgCountInRange(startTimestamp, endTimestamp);
```