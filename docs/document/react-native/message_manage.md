# 管理消息

<Toc />

本文介绍环信即时通讯 IM React Native SDK 如何管理消息，例如获取消息、搜索和删除历史消息等。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 和 `ChatConversation` 类实现对会话和消息的管理。

- 管理服务器端消息；
- 管理本地消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 管理服务端消息

#### 分页获取指定会话的历史消息

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

你可以调用 `fetchHistoryMessages` 方法从服务器分页获取指定会话的历史消息。为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

:::notice
1. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
2. 各类事件通知发送时，若接收的用户离线时，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

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

### 单向删除服务端的历史消息

你可以调用 `removeMessagesFromServerWithTimestamp` 或者 `removeMessagesFromServerWithMsgIds` 方法单向删除服务端的历史消息，每次最多可删除 50 条消息。消息删除后，该用户无法从服务端拉取到该消息，已删除的消息自动从设备本地移除。其他用户不受该操作影响。

:::tip
若使用该功能，需将 SDK 升级至 V1.1.0 或以上版本并联系商务开通。
:::

示例代码如下：

```typescript
// 按消息 ID 删除
ChatClient.getInstance()
  .chatManager.removeMessagesFromServerWithMsgIds(convId, convType, msgIds)
  .then((result) => {
    console.log("test:success:", result);
  })
  .catch((error) => {
    console.warn("test:error:", error);
  });
// 按时间戳删除
ChatClient.getInstance()
  .chatManager.removeMessagesFromServerWithTimestamp(
    convId,
    convType,
    timestamp
  )
  .then((result) => {
    console.log("test:success:", result);
  })
  .catch((error) => {
    console.warn("test:error:", error);
  });
```

### 管理本地消息

#### 更新本地会话中的消息

你可以调用 `updateConversationMessage` 方法更新本地会话中的消息，示例代码如下：

```typescript
// convId: 会话 ID。
// contType：会话类型。
// msg: 要更新的消息。
ChatClient.getInstance()
  .chatManager.updateConversationMessage(convId, convType, msg)
  .then(() => {
    console.log("update success");
  })
  .catch((reason) => {
    console.log("update fail.", reason);
  });
```

#### 根据消息 ID 搜索消息

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

#### 获取指定会话中特定类型的消息

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

#### 获取指定会话中一定时间段内的消息

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

#### 获取指定会话中包含特定关键字的消息

你可以调用 `getMessagesWithKeyword` 方法从本地数据库获取会话中的指定用户发送的包含特定关键字的消息，示例代码如下：

```typescript
// convId: 会话 ID。
// convType：会话类型。
// keywords: 搜索关键字。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
// timestamp：搜索起始时间戳。
// count: 每次获取的消息数量。取值范围为 [1,400]。
// sender：消息发送方。
ChatClient.getInstance()
  .getMessagesWithKeyword(
    convId,
    convType,
    keywords,
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

#### 获取指定用户在一定时间内发送包含关键字的消息

你可以调用 `searchMsgFromDB` 方法获取指定用户在一定时间内发送的包含关键字的消息。

```typescript
// keywords: 搜索消息的关键字。
// timestamp：搜索起始时间戳。
// maxCount: 每次获取的消息数量。取值范围为 [1,400]。
// from: 消息发送方。
// direction：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
ChatClient.getInstance()
  .chatManager.searchMsgFromDB(keywords, timestamp, maxCount, from, direction)
  .then((messages) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

#### 获取指定会话中一定数量的消息

你可以调用 `getMessages` 获取指定会话中一定数量的消息。

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

#### 获取指定会话的最新消息

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

#### 获取指定会话最新接收到的消息

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

#### 更新指定消息

你可以调用 `updateMessage` 方法更新指定消息。

```typescript
ChatClient.getInstance()
  .chatManager.updateMessage(newMsg)
  .then(() => {
    console.log("update message success");
  })
  .catch((reason) => {
    console.log("update message fail.", reason);
  });
```

#### 导入消息列表

你可以调用 `importMessages` 方法通过导入消息列表插入多条消息。典型应用为导入历史消息到本地数据库。

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。

```typescript
// msgs：将要插入的消息数组
ChatClient.getInstance()
  .chatManager.importMessages(msgs)
  .then(() => {
    console.log("update message success");
  })
  .catch((reason) => {
    console.log("update message fail.", reason);
  });
```

#### 删除指定会话的指定本地消息

你可以调用 `deleteMessage` 方法删除指定会话的指定本地消息。

```typescript
// convId：会话 ID
// convType: 会话类型
// msgId：消息 ID
ChatClient.getInstance()
  .chatManager.deleteMessage(convId, convType, msgId)
  .then(() => {
    console.log("delete message success");
  })
  .catch((reason) => {
    console.log("delete message fail.", reason);
  });
```

#### 删除指定会话的所有本地消息

你可以调用 `deleteAllMessages` 方法删除指定会话的所有本地消息。

```typescript
// convId：会话 ID
// convType：会话类型
ChatClient.getInstance()
  .chatManager.deleteAllMessages(convId, convType)
  .then(() => {
    console.log("delete message success");
  })
  .catch((reason) => {
    console.log("delete message fail.", reason);
  });
```

#### 删除指定时间段的本地消息

你可以调用 `deleteMessagesWithTimestamp` 方法删除指定时间段的消息。

```typescript
// startTs: 开始点的时间戳
// endTs: 结束点的时间戳
ChatClient.getInstance()
  .chatManager.deleteMessagesWithTimestamp({ startTs, endTs })
  .then(() => {
    console.log("delete message success");
  })
  .catch((reason) => {
    console.log("delete message fail.", reason);
  });
```
