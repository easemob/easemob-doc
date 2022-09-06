# 消息–管理会话和消息

[[toc]]

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

#### 获取所有会话

环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。我们建议在 app 安装时，或本地没有会话时调用该方法。否则调用从本地获取所有会话的方法即可。

该功能需联系商务开通，开通后，用户默认可拉取 7 天内的 10 个最新会话（每个会话包含最新一条历史消息），如需调整会话数量或时间限制请联系商务。

你可以调用 `fetchAllConversations` 方法从服务器获取所有会话，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.fetchAllConversations()
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

#### 分页获取指定会话的历史消息

你可以调用 `fetchHistoryMessages` 方法从服务器分页获取指定会话的历史消息。建议该方法每次调用获取的消息不超过 50 条。若获取较大数量的消息，你可以多次调用该方法，确保数据可靠。获取数据后，SDK 会自动将消息更新到本地数据库。

```typescript
// 会话 ID
const convId = "convId";
// 会话类型。详见 `ChatConversationType` 枚举类型。
const convType = ChatConversationType.PeerChat;
// 获取的最大消息数目
const pageSize = 10;
// 搜索的起始消息 ID
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
// convId: 会话 ID
// convType： 会话类型
// createIfNeed：如果不存在则创建设置该值为 true
ChatClient.getInstance()
  .chatManager.getConversation(convId, convType, createIfNeed)
  .then(() => {
    console.log("get conversions success");
  })
  .catch((reason) => {
    console.log("get conversions fail.", reason);
  });
```

#### 删除会话及其中的消息

你可以调用 `removeConversationFromServer` 方法删除服务器端会话及其对应的消息，示例代码如下：

```typescript
// convId: 会话 ID
// convType：会话类型
// isDeleteMessage：删除会话时是否同时删除该会话中的消息
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
// convId: 会话 ID
// withMessage：删除会话时是否同时删除该会话中的消息
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
// convId: 会话 ID
// contType：会话类型
// msg: 要更新的消息
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

#### 获取本地消息

你可以通过调用不同的方法获取指定的本地消息。

##### 获取指定消息 ID 对应的消息

你可以调用 `getMessage` 方法根据消息 ID 获取指定消息。

```typescript
// msgId: 消息 ID
ChatClient.getInstance()
  .chatManager.getMessage(msgId)
  .then((message) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

##### 获取指定会话中包含特定关键字的消息

你可以调用 `getMessagesWithKeyword` 方法获取指定会话中包含特定关键字的消息。

```typescript
// convId: 会话 ID
// convType：会话类型
// keywords: 搜索关键字
// direction：消息的搜索方向
// timestamp：搜索起始时间戳
// count: 期望获取的最大消息数
// sender：消息发送者
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

##### 获取指定用户在一定时间内发送包含关键字的消息

你可以调用 `searchMsgFromDB` 方法获取指定用户在一定时间内发送的包含关键字的消息。

```typescript
// keywords: 搜索消息的关键字
// timestamp：起始时间戳
// maxCount: 期望获取的最大消息数
// from: 消息的发送者
// direction：消息的搜索方向
ChatClient.getInstance()
  .chatManager.searchMsgFromDB(keywords, timestamp, maxCount, from, direction)
  .then((messages) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

##### 获取指定会话的最新消息

你可以调用 `getLatestMessage` 方法获取指定会话中的最新一条消息。

```typescript
// convId: 会话 ID
// convType：会话类型
ChatClient.getInstance()
  .getLatestMessage(convId, convType)
  .then((message) => {
    console.log("get message success");
  })
  .catch((reason) => {
    console.log("get message fail.", reason);
  });
```

除了以上方法，你还可以调用下面的方法获取消息：

- `getMessages`：获取指定会话中一定数量的消息；
- `getLastReceivedMessage`：获取指定会话最新接收到的消息；
- `getMessagesWithMsgType`：获取指定会话中特定类型的消息；
- `getMessageWithTimestamp`：获取指定会话中一定时间内发送和接收的消息。

#### 获取未读消息数

##### 获取所有会话的未读消息数

你可以调用 `getUnreadCount` 方法获取所有会话的未读消息数。

```typescript
ChatClient.getInstance()
  .chatManager.getUnreadCount()
  .then((count) => {
    console.log("get count success");
  })
  .catch((reason) => {
    console.log("get count fail.", reason);
  });
```

##### 获取指定会话的未读消息数

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

#### 标记消息已读

这几个方法调用后，会导致指定会话以及所有会话的未读消息数的变化？

##### 标记所有会话中的消息已读

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

##### 标记指定会话所有消息已读

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

##### 标记指定会话中的指定消息已读

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

当前用户只能导入自己发送或接收的消息。导入后，消息按照其包含的时间戳添加到对应的会话中。问小明？

```typescript
// msgs 将要插入的消息数组
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