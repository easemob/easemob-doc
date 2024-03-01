# 搜索消息

<Toc />

本文介绍环信即时通讯 IM React Native SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `getMessagesWithKeyword`：根据关键字搜索本地数据库中单个会话中指定用户发送的消息。
- `searchMsgFromDB`：根据关键字搜索指定用户在一定时间内发送的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 获取指定会话中包含特定关键字的消息

你可以调用 `getMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

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

### 获取指定用户在一定时间内发送包含关键字的消息

你可以调用 `searchMsgFromDB` 方法根据关键字搜索指定用户在一定时间内发送的消息。

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
