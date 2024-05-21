# 删除消息

<Toc />

本文介绍用户如何单向删除服务端以及删除本地的历史消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类实现单向删除服务端以及本地的历史消息，主要方法如下：

- `ChatManager#deleteAllMessageAndConversation`：清空聊天记录；
- `ChatManager#removeMessagesFromServerWithTimestamp`/`removeMessagesFromServerWithMsgIds` ：单向删除服务端的历史消息；
- `ChatManager#deleteAllMessages`：删除本地指定会话的所有消息；
- `ChatManager#deleteMessagesWithTimestamp`：删除本地单个会话在指定时间段的消息；
- `ChatManager#deleteMessage`：删除本地单个会话的指定消息；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 清空聊天记录

你可以调用 `ChatManager#deleteAllMessageAndConversation` 方法清空当前用户的聊天记录，包括单聊、群组聊天和聊天室的消息和会话。同时你也可以选择是否清除服务端的聊天记录。若你清除了服务端的聊天记录，你无法从服务端拉取到会话和消息，而其他用户不受影响。

:::tip
若使用该功能，需将 SDK 升级至 V1.4.0 或以上版本。
:::

```typescript
ChatClient.getInstance()
  .chatManager.deleteAllMessageAndConversation(clearServerData)
  .then(() => {
    // todo: 操作成功
  })
  .catch((error) => {
    // todo: 发生错误
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

### 删除本地指定会话的所有消息

你可以调用 `deleteAllMessages` 方法删除指定会话的所有消息。

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

### 删除本地单个会话在指定时间段的消息

你可以调用 `deleteMessagesWithTimestamp` 方法删除指定时间段的本地消息。

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

### 删除本地单个会话的指定消息

你可以调用 `deleteMessage` 方法删除本地单个会话的指定消息。

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