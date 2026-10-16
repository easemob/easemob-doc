# 删除消息

## 功能说明

SDK 支持单向删除服务端的消息：

- 单向清空服务端的聊天记录：单向清空当前用户在服务端保存的全部聊天记录，包括单聊、群聊和聊天室的消息及会话。清空成功后，SDK 会同步清除当前设备本地缓存的会话和消息，并更新本地会话列表。
- 单向删除服务端的历史消息：按消息 ID 或时间戳删除当前用户在服务端保存的指定会话历史消息。删除成功后，SDK 会从当前设备的会话缓存中移除相应消息。应用应及时刷新消息列表，避免继续展示旧数据。

单向清空或删除服务端数据后，当前用户无法再从服务端获取相应会话和消息，同一会话中的其他用户不受影响。

SDK 还支持清除本地指定会话的全部消息，以及删除本地指定消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 单向清空聊天记录

调用 `ChatManager#deleteAllConversationsAndMessages` 可以清空当前用户的全部本地会话及其消息，包括单聊、群聊和聊天室会话。通过 `clearServerData` 参数决定是否同时单向清空当前用户在服务端保存的全部会话及消息：

- `true`：清空本地以及当前用户服务端的全部会话和消息。清空后，当前用户无法再从服务端获取这些数据，其他用户不受影响。
- `false`：仅清空本地全部会话和消息，服务端数据仍保留。

清空成功后，SDK 会清除内存中的会话缓存。本地会话列表发生变化时，SDK 会通过 `ConversationListener#onConversationUpdate` 通知应用，应用可以重新读取本地会话列表并刷新界面。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
  let clearServerData = true;
  chatManager.deleteAllConversationsAndMessages(clearServerData)
    .then((): void => {
      // 清空成功，刷新会话列表。
    })
    .catch((error: ChatError): void => {
      // 根据 error.errorCode 和 error.description 处理错误。
    });
}
```

## 单向删除服务端的历史消息

调用 `ChatManager#removeMessagesFromServer` 可以按消息 ID 或时间戳，单向删除当前用户在服务端保存的指定会话历史消息。该操作仅对当前用户生效：删除后，当前用户无法再从服务端获取这些消息，同一单聊、群聊或聊天室中的其他用户不受影响。

支持以下删除方式：

- 按消息 ID 删除：传入消息 ID 数组，每次最多删除 50 条消息。
- 按时间戳删除：传入 Unix 时间戳，删除服务器接收时间早于该时间戳的历史消息，时间戳单位为毫秒。

多端多设备登录时，删除成功后，当前用户的其他在线设备会收到 `MultiDevicesListener#onMessageRemoved` 回调，并从本地移除相应消息。

:::tip
1. 删除成功后，SDK 会从当前设备的会话缓存中移除相应消息。应用应刷新消息列表，避免继续展示旧数据。
2. 聊天室漫游消息功能默认关闭。如需单向删除聊天室的服务端历史消息，请联系环信商务开通该功能。
:::

示例代码如下：

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
  // 删除服务器接收时间早于 beforeTimeStamp 的历史消息。
  chatManager.removeMessagesFromServer(
    conversationId,
    conversationType,
    beforeTimeStamp
  ).then((): void => {
    // 删除成功，刷新消息列表。
  }).catch((error: ChatError): void => {
    // 处理删除错误。
  });

  // 按消息 ID 删除历史消息，每次最多传入 50 个消息 ID。
  let messageIds = ['msgId1', 'msgId2'];
  chatManager.removeMessagesFromServer(
    conversationId,
    conversationType,
    messageIds
  ).then((): void => {
    // 删除成功，刷新消息列表。
  }).catch((error: ChatError): void => {
    // 处理删除错误。
  });
}
```

## 删除本地指定会话的所有消息

调用 `Conversation#clearAllMessages` 可以清除本地数据库中指定会话的全部消息。该操作不会删除会话，也不会删除服务端保存的消息。

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  conversation.clearAllMessages();
}
```

## 删除本地会话指定时间段的消息

应用可以先调用 `Conversation#searchMessagesBetweenTime` 查询该时间段内的本地消息，再调用 `Conversation#removeMessage` 逐条删除。

`searchMessagesBetweenTime` 每次最多返回 400 条消息，且不包含消息时间戳等于起始时间或结束时间的消息。如果指定时间段内的消息超过 400 条，需要将时间范围拆分为多个区间并分别处理。

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  conversation.searchMessagesBetweenTime(
    startTimestamp,
    endTimestamp,
    400
  ).then((messages: Array<ChatMessage>): void => {
    messages.forEach((message: ChatMessage): void => {
      let isRemoved = conversation.removeMessage(message);
      if (!isRemoved) {
        // 处理单条消息删除失败。
      }
    });
  }).catch((error: ChatError): void => {
    // 处理消息查询错误。
  });
}
```

## 删除本地会话的指定消息

调用 `Conversation#removeMessage` 可以根据消息对象或消息 ID，从本地数据库中删除指定消息。该操作不会删除服务端保存的消息。方法返回 `true` 表示删除成功，返回 `false` 表示删除失败。

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  let isRemoved = conversation.removeMessage(messageId);
  if (!isRemoved) {
    // 处理消息删除失败。
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`deleteAllConversationsAndMessages`](#单向清空聊天记录) | `ChatManager` | 清空本地所有会话及消息，并按参数决定是否同时单向清空服务端数据。 |
| [`getConversation`](#删除本地指定会话的所有消息) | `ChatManager` | 根据会话 ID 和会话类型获取本地会话对象。 |
| [`removeMessagesFromServer`](#单向删除服务端的历史消息) | `ChatManager` | 按时间戳或消息 ID 单向删除服务端历史消息。 |
| [`clearAllMessages`](#删除本地指定会话的所有消息) | `Conversation` | 清除指定会话在本地数据库中的全部消息。 |
| [`searchMessagesBetweenTime`](#删除本地会话指定时间段的消息) | `Conversation` | 查询指定时间段内的本地会话消息。 |
| [`removeMessage`](#删除本地会话的指定消息) | `Conversation` | 根据消息对象或消息 ID 删除本地消息。 |
