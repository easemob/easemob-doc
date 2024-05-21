# 搜索消息

<Toc />

本文介绍环信即时通讯 IM Flutter SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM Flutter SDK 支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `EMChatManager.searchMsgFromDB`：根据关键字搜索会话消息。
- `EMChatManager#loadMessagesWithKeyword`：根据搜索范围搜索所有会话中的消息。
- `EMConversation#loadMessagesWithKeyword`：根据搜索范围搜索当前会话中的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话消息

你可以调用 `loadMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：


```dart
EMConversation? conv =
        await EMClient.getInstance.chatManager.getConversation("convId");
        
    List<EMMessage>? msgs = await conv?.loadMessagesWithKeyword(
      // 搜索关键字。
      "key",
      // 消息发送方。
      sender: "tom",
      // 搜索开始的 Unix 时间戳，单位为毫秒。
      timestamp: 1653971593000,
      // 搜索的最大消息数。
      count: 10,
      // 消息的搜索方向：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
      direction: EMSearchDirection.Up,
    );
```

### 根据搜索范围搜索所有会话中的消息

你可以调用 `EMChatManager#loadMessagesWithKeyword` 方法，除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索所有会话中的消息时，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

:::tip
若使用该功能，需将 SDK 升级至 V4.5.0 或以上版本。
:::

```dart
try {
  await EMClient.getInstance.chatManager.loadMessagesWithKeyword(
    keywords,
    sender: sender,
    timestamp: timestamp,
    count: 20,
    direction: EMSearchDirection.Up,
    searchScope: MessageSearchScope.All,
  );
} on EMError catch (e) {
  debugPrint("loadMessagesWithKeyword error: ${e.code}, ${e.description}");
}
```

### 根据搜索范围搜索当前会话中的消息

你可以调用 `EMConversation#loadMessagesWithKeyword` 方法除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

:::tip
若使用该功能，需将 SDK 升级至 V4.5.0 或以上版本。
:::

```dart
EMConversation? conversation = await EMClient.getInstance.chatManager.getConversation(userId);
try {
  await conversation?.loadMessagesWithKeyword(
    keywords,
    sender: sender,
    timestamp: timestamp,
    count: 20,
    direction: EMSearchDirection.Up,
    searchScope: MessageSearchScope.All,
  );
} on EMError catch (e) {
  debugPrint("loadMessagesWithKeyword error: ${e.code}, ${e.description}");
}

```