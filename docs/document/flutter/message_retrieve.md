# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM Flutter SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 和 `EMConversation` 类实现对本地消息的管理，其中核心方法如下：

- `EMChatManager#fetchHistoryMessages`：根据 `FetchMessageOptions` 类获取服务器保存的指定会话中的消息。
- `EMChatManager.getConversation`：读取本地指定会话的消息。
- `EMChatManager.loadMessage`：根据消息 ID 获取消息。
- `EMConversation.loadMessagesWithMsgType`：获取本地存储的指定会话中特定类型的消息。
- `EMConversation.loadMessagesFromTime`：获取一定时间段内本地指定会话中发送和接收的消息

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的消息

你可以调用 `fetchHistoryMessagesByOption` 方法基于 `FetchMessageOptions` 类从服务端分页拉取单聊和群组聊天的历史消息（消息漫游）。为确保数据可靠，我们建议你每次获取 20 条消息，最大不超过 50。分页查询时，若满足查询条件的消息总数大于 `pageSize` 的数量，则返回 `pageSize` 数量的消息，若小于 `pageSize` 的数量，返回实际条数。消息查询完毕时，返回的消息条数小于 `pageSize` 的数量。

通过设置 `FetchMessageOptions` 类，你可以根据以下条件拉取历史消息：

- 消息发送方；
- 消息类型；
- 消息时间段；
- 消息搜索方向；
- 是否将拉取的消息保存到数据库；
- 对于群组聊天，你可以设置 `from` 参数拉取群组中单个成员发送的历史消息。

:::tip
1. 若使用该 API，需将 SDK 版本升级至 V4.0.2 版本或以上。
2. **默认可获取单聊和群组聊天的历史消息。若要获取聊天室的历史消息，需联系环信商务。**
3. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
4. 各类事件通知发送时，若接收的用户离线，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```dart
// fromUserId: 消息发送方的用户 ID。
    // msgTypes: 消息类型，可以是 [MessageType.TXT, MessageType.IMAGE, MessageType.VIDEO, MessageType.LOCATION, MessageType.VOICE, MessageType.FILE, MessageType.CUSTOM, MessageType.COMBINE]
    // startTs: 查询开始时间戳。
    // endTs: 查询结束时间戳。
    // needSave: 是否需要保存到本地数据库。

    FetchMessageOptions options = FetchMessageOptions(
      from: fromUserId,
      msgTypes: [MessageType.TXT],
      startTs: 1709284487000,
      endTs: 1709284499000,
      needSave: true,
    );

    // conversationId: 会话 ID：单聊为对方用户 ID, 群聊时为群组 ID，聊天室聊天为聊天室 ID。
    // type: 会话类型：Chat 为单聊；GroupChat 为群聊；ChatRoom 为聊天室。
    // options: 查询条件。
    // cursor: 分页查询时的游标， 首次可以传 null 或不传，如果是分页查询，传上一次查询结果的游标 result.cursor。
    // pageSize: 每页查询的消息数量。
    EMCursorResult<EMMessage> result =
        await EMClient.getInstance.chatManager.fetchHistoryMessagesByOption(
      conversationId,
      type,
      options: options,
      cursor: cursor,
      pageSize: 20,
    );
```

此外，你也可以调用 `fetchHistoryMessages` 方法从服务器获取指定会话的消息。

为确保数据可靠，我们建议你多次调用该方法，且每次获取的消息数小于 50 条。获取到数据后，SDK 会自动将消息更新到本地数据库。

```dart
try {
  // 会话 ID
  String convId = "convId";
  // 会话类型：Chat 为单聊；GroupChat 为群聊；ChatRoom 为聊天室。
  EMConversationType convType = EMConversationType.Chat;
  // 获取的最大消息数
  int pageSize = 10;
  // 搜索的起始消息 ID
  String startMsgId = "";
  EMCursorResult<EMMessage?> cursor =
      await EMClient.getInstance.chatManager.fetchHistoryMessages(
    conversationId: convId,
    type: convType,
    pageSize: pageSize,
    startMsgId: startMsgId,
  );
} on EMError catch (e) {
}
```

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

### 根据消息 ID 获取消息

你可以调用 `loadMessage` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```dart
// msgId：要获取消息的消息 ID。
EMMessage? msg = await EMClient.getInstance.chatManager.loadMessage("msgId");
```

### 获取指定会话中特定类型的消息

你可以调用 `loadMessagesWithMsgType` 方法从本地存储中获取指定会话中特定类型的消息。

每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

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

你可以调用 `loadMessagesFromTime` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。

每次最多可获取 400 条消息。

```dart
EMConversation? conv =
        await EMClient.getInstance.chatManager.getConversation("convId");
    List<EMMessage>? list = await conv?.loadMessagesFromTime(
      // 查询的起始时间戳，单位为毫秒。
      startTime: startTime,
      // 查询的结束时间戳，单位为毫秒。
      endTime: endTime,
      // 每次获取的消息数量。取值范围为 [1,400]。
      count: 50,
    );
```

### 获取会话在一定时间内的消息数

你可以调用 `getLocalMessageCount` 方法从 SDK 本地数据库中获取会话在某个时间段内的全部消息数。

```java
String conversationId = "pu";
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation!=null) {
    long startTimestamp = System.currentTimeMillis() - 24 * 60 * 60 * 1000;
    int count = conversation.getAllMsgCount(startTimestamp, System.currentTimeMillis());
    EMLog.i(TAG, "queryMsgCountWithDuration count:" + count);
}
```