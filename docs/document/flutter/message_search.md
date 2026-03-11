# 搜索消息

<Toc />

本文介绍环信即时通讯 IM Flutter SDK 如何搜索本地消息。

## 技术原理

环信即时通讯 IM Flutter SDK 支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `EMChatManager.searchMsgFromDB`：根据关键字搜索会话中的用户发送的消息。
- `EMChatManager#loadMessagesWithKeyword`：根据搜索范围搜索所有会话中的消息。
- `EMConversation#loadMessagesWithKeyword`：根据搜索范围搜索当前会话中的消息。
- `EMChatManager#searchMsgsByOptions`：根据单个或多个消息类型，搜索本地数据库中所有会话的消息。
- `EMConversation#searchMsgsByOptions` 根据单个或多个消息类型，搜索本地数据库中单个会话的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话中的用户发送的消息

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
      // 要获取的消息条数。
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

### 根据消息类型搜索所有会话中的消息

你可以调用 `EMChatManager#searchMsgsByOptions` 方法除了设置消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以设置单个或多个消息类型搜索本地数据库中所有会话的消息。

:::tip
若使用该功能，需将 SDK 升级至 V4.8.1 或以上版本。
:::

```dart
// from：会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制。
// count：要查询的消息条数。取值范围为 [1,400]。
try {
  const searchOptions = MessageSearchOptions(
    types: [MessageType.TXT, MessageType.IMAGE],
    from: fromUser,
    ts: startTime,
    direction: EMSearchDirection.Up,
    count: 50
  );
  List<EMMessage> msgs =
      await EMClient.getInstance.chatManager.searchMsgsByOptions(
    searchOptions,
  );
} on EMError catch (e) {
  debugPrint("error code: ${e.code}, desc: ${e.description}");
}
```

### 根据消息类型搜索当前会话中的消息

你可以调用 `EMConversation#searchMsgsByOptions` 方法除了设置消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以设置单个或多个消息类型搜索本地数据库中单个会话的消息。

:::tip
若使用该功能，需将 SDK 升级至 V4.8.1 或以上版本。
:::

```dart
// from：当前会话中发送方的用户 ID。若传空字符串，搜索对发送方不限制。
// count：要查询的消息条数。取值范围为 [1,400]。
  try {
    const searchOptions = MessageSearchOptions(
        types: [MessageType.TXT, MessageType.IMAGE],
        from: fromUser,
        ts: startTime,
        direction: EMSearchDirection.Up,
        count: 50);
    conversation.searchMsgsByOptions(
      searchOptions,
    );
  } on EMError catch (e) {
    debugPrint("error code: ${e.code}, desc: ${e.description}");
  }
```     

## 关键字搜索规则

调用以下消息搜索 API 搜索不同类型的消息时，其中的 `keywords` 参数对应不同的内容。

- [根据关键字搜索本地数据库中单个会话中指定用户发送的消息](#根据关键字搜索会话中的用户发送的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索](#根据搜索范围搜索所有会话中的消息)。
- [根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索](#根据搜索范围搜索当前会话中的消息)。

### 只搜索消息内容

|消息类型 | 关键字匹配的消息内容 | 关键字搜索内容示例 |
| :-------------- | :----- |:----- |
|文本消息  | `EMTextMessageBody.content`      | 文本消息的实际内容“你好世界”。|
|图片消息  | `EMImageMessageBody.displayName`     | 图片文件名“photo.jpg”|
|语音消息  | `EMVoiceMessageBody.displayName`    | 语音文件名“audio.amr”|
|视频消息  | `EMVideoMessageBody.displayName`     | 视频文件名“video.mp4”|
|文件消息  | `EMFileMessageBody.displayName`       |文件名“report.pdf”|
|位置消息  | `EMLocationMessageBody.address`     | 地址\建筑物名称“北京市朝阳区\国贸大厦”|
|自定义消息| `EMCustomMessageBody.event`    | 自定义事件名“gift”|
|合并消息  | `EMCombineMessageBody.title` + `EMCombineMessageBody.summary`    | 标题\摘要“聊天记录\包含5条消息”|

### 只搜索扩展信息

若只搜索消息的扩展属性（`attributes`）JSON 字符串，`keywords` 字段匹配用户自定义添加的扩展属性，例如：

```json
{"key1":"value1", "key2":"value2"}
```

### 全搜索

同时搜索消息内容和扩展信息，任一匹配即返回。

