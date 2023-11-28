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

对于单聊或群聊，用户发消息时会自动将对方添加到用户的会话列表。

你可以调用 `fetchConversationsFromServerWithCursor` 方法从服务端分页获取会话列表。SDK 按照会话活跃时间（会话的最新一条消息的时间戳）的倒序返回会话列表，每个会话对象中包含会话 ID、会话类型、是否为置顶状态、置顶时间（对于未置顶的会话，值为 `0`）以及最新一条消息。从服务端拉取会话列表后会更新本地会话列表。

服务器默认存储 100 条会话，可存储 7 天。若提升这两个上限，需联系环信商务。

:::tip
1. 若使用该功能，需将 SDK 升级至 1.2.0。 
2. 建议你在首次下载、卸载后重装应用等本地数据库无数据情况下拉取服务端会话列表。其他情况下，调用 `getAllConversations` 方法获取本地所有会话即可。
3. 通过 RESTful 接口发送的消息默认不创建或写入会话。若会话中的最新一条消息通过 RESTful 接口发送，获取会话列表时，该会话中的最新一条消息显示为通过非 RESTful 接口发送的最新消息。若要开通 RESTful 接口发送的消息写入会话列表的功能，需联系商务。
:::

示例代码如下：

```typescript
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。如果为空字符串或传 `undefined`，SDK 从最新活跃的会话开始获取。
ChatClient.getInstance()
  .chatManager.fetchConversationsFromServerWithCursor(cursor, pageSize)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

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

#### 获取服务端的置顶会话列表

你可以调用 `fetchPinnedConversationsFromServerWithCursor` 方法从服务端分页获取置顶会话列表。SDK 按照会话置顶时间的倒序返回。 

你最多可以拉取 50 个置顶会话。

:::notice
若使用该功能，需将 SDK 升级至 1.2.0。
:::

示例代码如下： 

```typescript
// pageSize: 每页返回的会话数。取值范围为 [1,50]。
// cursor: 开始获取数据的游标位置。若获取数据时传 `undefined` 或者空字符串（""），SDK 从最新置顶的会话开始查询。
ChatClient.getInstance()
  .chatManager.fetchPinnedConversationsFromServerWithCursor(cursor, pageSize)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

#### 置顶会话

会话置顶指将单聊或群聊会话固定在会话列表的顶部，方便用户查找。例如，将重点会话置顶，可快速定位会话。

你可以调用 `pinConversation` 方法设置是否置顶会话。置顶状态会存储在服务器上，多设备登录情况下，更新的置顶状态会同步到其他登录设备，其他登录设备分别会收到 `CONVERSATION_PINNED` 和 `CONVERSATION_UNPINNED` 事件。你最多可以置顶 50 个会话。

:::notice
若使用该功能，需将 SDK 升级至 1.2.0。
:::

示例代码如下： 

```typescript
// isPinned: 设置是否置顶会话。
ChatClient.getInstance()
  .chatManager.pinConversation(convId, isPinned)
  .then(() => {
    console.log("pin conversions success");
  })
  .catch((reason) => {
    console.log("pin conversions fail.", reason);
  });
```

你可以通过 `ChatConversation` 对象的 `isPinned` 字段检查会话是否为置顶状态，或查看 `pinnedTime` 字段获取会话置顶时间。

#### 分页获取指定会话的历史消息

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

你可以调用 `fetchHistoryMessages` 方法从服务器分页获取指定会话的历史消息。该功能需在[环信即时通讯 IM 管理后台](https://console.easemob.com/user/login)开通。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

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
