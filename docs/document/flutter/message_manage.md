# 管理本地消息

<Toc />

本文介绍环信即时通讯 IM Flutter SDK 如何管理本地消息，例如获取消息、搜索消息、导入消息、插入消息、更新消息以及统计消息流量等。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 和 `EMConversation` 类实现对本地消息的管理，其中核心方法如下：

- `EMChatManager.getConversation`：读取指定会话的消息。
- `EMChatManager.loadMessage`：根据消息 ID 获取消息。
- `EMConversation.loadMessagesWithMsgType`：获取指定会话中特定类型的消息。
- `EMConversation.loadMessagesFromTime`：获取指定会话中一定时间段内的消息。
- `EMChatManager.searchMsgFromDB`：根据关键字搜索会话消息。
- `EMChatManager.importMessages`：批量导入消息到数据库。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 读取指定会话的消息

你可以根据会话 ID 和会话类型调用 API 获取本地会话：

```dart
// 会话 ID。
String convId = "convId";
// 如果会话不存在是否创建。设置为 `true`，则会返回会话对象。
bool createIfNeed = true;
// 会话类型。详见 `EMConversationType` 枚举类型。
EMConversationType conversationType = EMConversationType.Chat;
// 执行操作。
EMConversation? conversation =
    await EMClient.getInstance.chatManager.getConversation(
  convId,
  conversationType,
  true,
);
List<EMMessage>? list = await conversation?.loadMessages();
```

### 根据消息 ID 搜索消息

你可以调用 `loadMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```dart
// msgId：要获取消息的消息 ID。
EMMessage? msg = await EMClient.getInstance.chatManager.loadMessage("msgId");
```

### 获取指定会话中特定类型的消息

你可以调用 `loadMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```dart
EMConversation? conv =
        await EMClient.getInstance.chatManager.getConversation("convId");
    List<EMMessage>? list = await conv?.loadMessagesWithMsgType(
      // 消息类型。
      type: MessageType.TXT,
      // 每次获取的消息数量。取值范围为 [1,400]。
      count: 50,
      // 消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
      direction: EMSearchDirection.Up,
    );
```

### 获取指定会话中一定时间段内的消息

你可以调用 `loadMessagesFromTime` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。每次最多可获取 400 条消息。

```dart
EMConversation? conv =
        await EMClient.getInstance.chatManager.getConversation("convId");
    List<EMMessage>? list = await conv?.loadMessagesFromTime(
      // 搜索的起始时间戳，单位为毫秒。
      startTime: startTime,
      // 搜索的结束时间戳，单位为毫秒。
      endTime: endTime,
      // 每次获取的消息数量。取值范围为 [1,400]。
      count: 50,
    );
```

### 根据关键字搜索会话消息

你可以调用 `loadMessagesWithKeyword` 方法从本地数据库获取会话中的指定用户发送的包含特定关键字的消息，示例代码如下：


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

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息，可以使用下面的接口，构造 `EMMessage` 对象，将消息导入本地数据库。

示例代码如下：

```dart
// messages: 需要导入的消息。
await EMClient.getInstance.chatManager.importMessages(messages);
```
