# 搜索消息

<Toc />

本文介绍环信即时通讯 IM React Native SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `ChatManager#getMessagesWithKeyword`：根据关键字搜索本地数据库中单个会话中指定用户发送的消息。
- `ChatManager#searchMsgFromDB`：根据关键字搜索指定用户在一定时间内发送的消息。
- `ChatManager#getMessagesWithKeyword`：根据搜索范围搜索所有会话中的消息。
- `ChatConversation#getMessagesWithKeyword`：根据搜索范围搜索当前会话中的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 获取指定会话中包含特定关键字的消息

你可以调用 `ChatManager#getMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

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

你可以调用 `ChatManager#searchMsgFromDB` 方法根据关键字搜索指定用户在一定时间内发送的消息。

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

### 根据搜索范围搜索所有会话中的消息

你可以调用 `ChatManager#getMessagesWithKeyword` 方法，除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索所有会话中的消息时，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

:::tip
若使用该功能，需将 SDK 升级至 V1.4.0 或以上版本。
:::

```typescript
ChatClient.getInstance()
  .chatManager.getMsgsWithKeyword({
    keywords, // 搜索关键字
    direction, // 搜索方向
    timestamp, // 搜索消息的时间戳，从该时间戳开始按照搜索方向 `direction` 搜索。
    maxCount: 20, // 请求的消息数量
    from: "", // 消息发送者
    searchScope: ChatMessageSearchScope.All, // 搜索范围，详见 `ChatMessageSearchScope` 类型。
  })
  .then((res) => {
    // todo: 操作成功, 处理返回的结果
  })
  .catch((error) => {
    // todo: 发生错误
  });
```

### 根据搜索范围搜索当前会话中的消息

除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。你可以通过以下两种方式获取消息。

:::tip
若使用该功能，需将 SDK 升级至 V4.5.0 或以上版本。
:::

- 方式一：

```typescript
// 直接调用
ChatClient.getInstance()
  .chatManager.getConvMsgsWithKeyword({
    convId, // 会话ID。
    convType, // 会话类型：个人、群组
    keywords, // 搜索关键字
    direction, // 搜索方向
    timestamp, // 搜索消息的时间戳，从该时间戳开始按照搜索方向 `direction` 搜索。
    count: 20, // 请求的消息数量
    sender: "", // 消息发送者
    isChatThread: false, // 是否是话题消息。话题消息只在话题中使用。
    searchScope: ChatMessageSearchScope.All, // 搜索范围，详见 `ChatMessageSearchScope` 类型。
  })
  .then((res) => {
    // todo: 操作成功, 处理返回的结果
  })
  .catch((error) => {
    // todo: 发生错误
  });
```

- 方式二：

```typescript
// 通过会话对象调用
const conv = ChatClient.getInstance().chatManager.getConversation(
  convId,
  convType
);
conv
  .getMsgsWithKeyword({
    keywords, // 搜索关键字
    direction, // 搜索方向
    timestamp, // 搜索消息的时间戳，从该时间戳开始按照搜索方向 `direction` 搜索。
    count: 20, // 请求的消息数量
    sender: "", // 消息发送者
    searchScope: ChatMessageSearchScope.All, // 搜索范围，详见 `ChatMessageSearchScope` 类型。
  })
  .then((res) => {
    // todo: 操作成功, 处理返回的结果
  })
  .catch((error) => {
    // todo: 发生错误
  });
```
