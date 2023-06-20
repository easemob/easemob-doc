# 管理会话和消息

<Toc />

会话是一个单聊、群聊或者聊天室所有消息的集合。除了在会话中发送和接收消息，环信即时通讯 IM React Native SDK 支持以会话为单位对消息数据进行管理，如获取与管理未读消息、搜索和删除历史消息等。

本文介绍环信即时通讯 IM React Native SDK 如何管理会话和消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 和 `ChatConversation` 类实现对会话和消息的管理。

- 管理服务器端和本地的会话；
- 管理本地消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 管理服务端和本地的会话

#### 获取会话列表

对于单聊或群聊，用户发消息时，会自动将对方添加到用户的会话列表。

你可以调用 `fetchConversationsFromServerWithPage` 方法从服务端分页获取会话列表，每个会话包含最新一条历史消息。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

:::tip

1. 建议在 app 安装时或本地没有会话时调用该方法，否则调用 `getAllConversations` 方法获取本地会话即可。
2. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
   :::

```typescript
// pageNum：当前页面，从 1 开始。
// pageSize：每页获取的会话数量。取值范围为 [1,20]。
ChatClient.getInstance()
  .chatManager.fetchConversationsFromServerWithPage(pageSize, pageNum)
  .then((result) => {
    console.log("test:success:", result);
  })
  .catch((error) => {
    console.warn("test:error:", error);
  });
```

对于还不支持 `fetchConversationsFromServerWithPage` 方法的用户，可以调用 `fetchAllConversations` 方法从服务端获取会话列表，SDK 默认可拉取 7 天内的 10 个会话（每个会话包含最新一条历史消息）。如需调整会话数量或时间限制请联系商务。

你可以调用 `getAllConversations` 方法获取本地所有会话，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.getAllConversations()
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

#### 分页获取指定会话的历史消息

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

你可以调用 `fetchHistoryMessages` 方法从服务器分页获取指定会话的历史消息。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```typescript
// 会话 ID。
const convId = "convId";
// 会话类型。详见 `ChatConversationType` 枚举类型。
const convType = ChatConversationType.PeerChat;
// 获取的最大消息数目。
const pageSize = 10;
// 搜索的起始消息 ID。
const startMsgId = "";
ChatClient.getInstance()
  .chatManager.fetchHistoryMessages(convId, chatType, pageSize, startMsgId)
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
若使用该功能，需将 SDK 升级至 V1.1.0 或以上版本并联系商务。
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

#### 单向删除服务端会话及其历史消息

你可以调用 `removeConversationFromServer` 方法删除服务器端会话和历史消息。会话和消息删除后，当前用户无法从服务器获取该会话和消息，对本地的会话无影响，但会删除本地消息，而其他用户不受影响。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

示例代码如下：

```typescript
// convId: 会话 ID。
// convType：会话类型。
// isDeleteMessage：删除会话时是否同时删除该会话中的消息。
ChatClient.getInstance()
  .chatManager.removeConversationFromServer(convId, convType, isDeleteMessage)
  .then(() => {
    console.log("remove conversions success");
  })
  .catch((reason) => {
    console.log("remove conversions fail.", reason);
  });
```

你可以调用 `deleteConversation` 方法删除本地保存的指定会话，示例代码如下：

```typescript
// convId: 会话 ID。
// withMessage：删除会话时是否同时删除该会话中的消息。
ChatClient.getInstance()
  .chatManager.deleteConversation(convId, withMessage)
  .then(() => {
    console.log("remove conversions success");
  })
  .catch((reason) => {
    console.log("remove conversions fail.", reason);
  });
```

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

### 管理本地消息

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

#### 获取所有会话的未读消息数

你可以调用 `getUnreadCount` 方法获取所有会话的未读消息数。

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .chatManager.getUnreadCount()
  .then((count) => {
    console.log("get count success");
  })
  .catch((reason) => {
    console.log("get count fail.", reason);
  });
```

#### 获取指定会话的未读消息数

你可以调用 `getConversationUnreadCount` 方法获取指定会话的未读消息数。

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .chatManager.getConversationUnreadCount(convId, convType)
  .then((count) => {
    console.log("get count success");
  })
  .catch((reason) => {
    console.log("get count fail.", reason);
  });
```

#### 标记所有会话中的消息已读

你可以调用 `markAllConversationsAsRead` 方法标记所有会话中的消息已读。

```typescript
ChatClient.getInstance()
  .chatManager.markAllConversationsAsRead()
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
  });
```

#### 标记指定会话所有消息已读

你可以调用 `markAllMessagesAsRead` 方法标记指定会话所有消息已读。

```typescript
// convId：会话 ID
// convType: 会话类型
ChatClient.getInstance()
  .chatManager.markAllMessagesAsRead(convId, convType)
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
  });
```

#### 标记指定会话中的指定消息已读

你可以调用 `markMessageAsRead` 方法标记指定会话中的指定消息已读。

```typescript
// convId：会话 ID
// convType: 会话类型
// msgId：消息 ID
ChatClient.getInstance()
  .chatManager.markMessageAsRead(convId, convType, msgId)
  .then(() => {
    console.log("conversions had read success");
  })
  .catch((reason) => {
    console.log("conversions had read fail.", reason);
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
