# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM React Native SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 和 `ChatConversation` 类实现对会话和消息的管理。

- `fetchHistoryMessages`：从服务器分页获取指定会话的历史消息；
- `getMessage`：根据消息 ID 获取本地消息；
- `getMessagesWithMsgType`：获取本地指定会话中特定类型的消息；
- `getMessageWithTimestamp` ：获取本地指定会话中一定时间段内的消息；
- `getMessages`：获取本地指定会话中一定数量的消息；
- `getLatestMessage`：获取本地指定会话的最新消息；
- `getLastReceivedMessage`：获取本地指定会话最新接收到的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的历史消息

你可以调用 `fetchHistoryMessagesByOptions` 方法基于 `ChatFetchMessageOptions` 类从服务端分页拉取单聊和群组聊天的历史消息（消息漫游）。为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。

通过设置 `ChatFetchMessageOptions` 类，你可以根据以下条件拉取历史消息：

- 消息发送方；
- 消息类型；
- 消息时间段；
- 消息搜索方向；
- 是否将拉取的消息保存到数据库；
- 对于群组聊天，你可以设置 `from` 参数拉取群组中单个成员发送的历史消息。

:::tip
1. 若使用该 API，需将 SDK 版本升级至 V1.1.2 版本或以上。
2. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
3. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
4. 各类事件通知发送时，若接收的用户离线，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```tsx
// convId 会话 ID：单聊、群聊和聊天室分别为对端用户 ID、群组 ID 和聊天室 ID。
// convType 会话类型：单聊、群聊和聊天室分别为 PeerChat、GroupChat 和 RoomChat。
// cursor 查询的起始消息 ID。若该参数设置为空字符串，从最新消息开始。
// pageSize 每页期望获取的消息条数。取值范围为 [1,50]，默认值为 10。
// option
// option.from 消息发送者
// option.msgTypes 过滤获取消息的类型
// option.startTs 过滤消息开始时间
// option.endTs 过滤消息结束时间
// option.direction 消息方向
// option.needSave 消息是否保存
ChatClient.getInstance()
  .chatManager.fetchHistoryMessagesByOptions(convId, convType, {
    cursor: cursor,
    pageSize: pageSize,
    options: options as ChatFetchMessageOptions,
  })
  .then((res) => {
    console.log('fetchHistoryMessagesByOptions is success.', res);
  })
  .catch();
```

此外，你也可以调用 `fetchHistoryMessages` 方法从服务器分页获取指定会话的历史消息。为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```typescript
// 会话 ID。
const convId = "convId";
// 会话类型。详见 `ChatConversationType` 枚举类型。
const convType = ChatConversationType.PeerChat;
// 获取的最大消息数目。
const pageSize = 10;
// 搜索的起始消息 ID。
const startMsgId = "";
// 消息搜索方向
const direction = ChatSearchDirection.UP;
ChatClient.getInstance()
  .chatManager.fetchHistoryMessages(convId, chatType, {
    pageSize,
    startMsgId,
    direction,
  })
  .then((messages) => {
    console.log("get message success: ", messages);
  })
  .catch((reason) => {
    console.log("load conversions fail.", reason);
  });
```

你可以调用 `getConversation` 方法从本地获取指定会话 ID 的会话，如果不存在可以创建。

```typescript
// convId: 会话 ID。
// convType： 会话类型。
// createIfNeed：如果不存在则创建设置该值为 true。
ChatClient.getInstance()
  .chatManager.getConversation(convId, convType, createIfNeed)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

### 根据消息 ID 获取本地消息

你可以调用 `getMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```typescript
// msgId: 要获取的消息的消息 ID。
ChatClient.getInstance()
  .chatManager.getMessage(msgId)
  .then((message) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

### 获取本地会话中特定类型的消息

你可以调用 `getMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```typescript
// convId: 会话 ID。
// convType：会话类型：单聊、群聊和聊天室分别为 `PeerChat`、`GroupChat` 和 `RoomChat`。
// msgType: 消息类型。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
// timestamp：消息搜索的起始时间戳，单位为毫秒。该参数设置后，SDK 从指定的时间戳的消息开始，按照搜索方向对消息进行搜索。若设置为负数，SDK 从当前时间开始，按消息时间戳的逆序搜索。
// count: 每次搜索的消息数量。取值范围为 [1,400]。
// sender：消息发送方。
ChatClient.getInstance()
  .getMessagesWithMsgType(
    convId,
    convType,
    msgType,
    direction,
    timestamp,
    count,
    sender
  )
  .then((messages) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

### 获取一定时间内本地会话的消息

你可以调用 `getMessageWithTimestamp` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。每次最多可获取 400 条消息。

```typescript
// convId：会话 ID。
// convType：会话类型：单聊、群聊和聊天室分别为 `PeerChat`、`GroupChat` 和 `RoomChat`。
// startTime：搜索的起始时间戳，单位为毫秒。
// endTime：搜索的结束时间戳，单位为毫秒。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
// count：每次获取的消息数量。取值范围为 [1,400]。
ChatClient.getInstance()
  .getMessageWithTimestamp(
    convId,
    convType,
    startTime,
    endTime,
    direction,
    count
  )
  .then((messages) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

### 获取本地会话中一定数量的消息

你可以调用 `getMessages` 获取本地指定会话中一定数量的消息。

```typescript
// convId: 会话 ID。
// convType：会话类型。
// startMsgId: 搜索的起始消息 ID。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
// loadCount: 每次获取的消息数量。取值范围为 [1,400]。
ChatClient.getInstance()
  .getMessages(convId, convType, startMsgId, direction, loadCount)
  .then((messages) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

### 获取指定会话的最新消息

你可以调用 `getLatestMessage` 方法获取指定会话中的最新一条消息。

```typescript
// convId: 会话 ID。
// convType：会话类型。
ChatClient.getInstance()
  .getLatestMessage(convId, convType)
  .then((message) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

### 获取指定会话最新接收到的消息

你可以调用 `getLastReceivedMessage` 方法获取指定会话中最新收到的一条消息。

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .getLastReceivedMessage(convId, convType)
  .then((message) => {
    if (message) {
      console.log("get message success");
    } else {
      console.log("message not find.");
    }
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

