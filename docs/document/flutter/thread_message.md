# 管理消息话题中的消息

<Toc />

消息话题中的消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。使用消息话题中的消息功能前，你需要联系商务开通。

本文介绍即时通讯 IM Flutter SDK 如何发送、接收以及撤回消息话题中的消息。

## 技术原理

即时通讯 IM Flutter SDK 提供 `EMChatThreadManager`、`EMMessage` 和 `EMChatThread` 类，用于管理消息话题中的消息，支持你通过调用 API 在项目中实现发送、接收、撤回和获取消息话题中的消息。

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图：

![](/images/ios/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 已集成 `1.0.5 或版本` SDK 的基本功能，完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 实现方法

本节介绍如何使用即时通讯 IM Flutter SDK 提供的 API 实现上述功能。

### 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要指定标记 `isChatThreadMessage` 为 `true`。

示例代码如下：

```dart
// `chatThreadId` 为消息话题 ID

EMMessage msg = EMMessage.createTxtSendMessage(
  targetId: threadId,
  content: content,
  // `chatType` 设置为 `GroupChat`，即群聊
  chatType: ChatType.GroupChat,
);
// isChatThreadMessage: 是否是消息话题中的消息，这里设置为 `true`，即是消息话题中的消息。
msg.isChatThreadMessage = true;
EMClient.getInstance.chatManager.sendMessage(msg);
```

### 接收消息话题中的消息

接收消息的具体逻辑，请参考 [接收消息](message_receive.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有新增消息时，消息话题所属群组的所有成员收到 `EMChatThreadEventHandler#onChatThreadUpdated` 事件，消息话题成员收到 `EMChatEventHandler#onMessagesReceived` 事件。

示例代码如下：

```dart
// 注册消息话题监听
EMClient.getInstance.chatThreadManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
  EMChatThreadEventHandler(
    onChatThreadUpdate: (event) {},
      ),
    );

// 添加消息监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesReceived: (messages) {},
      ),
    );

// 移除消息话题监听
EMClient.getInstance.chatThreadManager.removeEventHandler("UNIQUE_HANDLER_ID");
    // 移除消息监听
    EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 撤回消息话题中的消息

接收消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有消息撤回时，消息话题所属群组的所有成员收到 `EMChatThreadEventHandler#onChatThreadUpdated` 事件，消息话题成员收到 `EMChatEventHandler#onMessagesRecalledInfo` 事件。

示例代码如下：

```dart
// 注册消息话题监听
EMClient.getInstance.chatThreadManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatThreadEventHandler(
    onChatThreadUpdate: (event) {},
  ),
);

// 添加消息监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  EMChatEventHandler(
    onMessagesRecalledInfo: (messages) {},
  ),
);

// 移除消息话题监听
EMClient.getInstance.chatThreadManager.removeEventHandler("UNIQUE_HANDLER_ID");
// 移除消息监听
EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 获取消息话题中的消息

从服务器还是本地数据库获取消息话题中的消息取决于你的生产环境。

你可以通过 `EMConversation#isChatThread()` 判断当前会话是否为消息话题会话。

#### 从服务器获取单个消息话题的消息 (消息漫游)

调用 `fetchHistoryMessages` 方法从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

```dart
try {
  // 消息话题 ID。
  String threadId = "threadId";
  // 会话类型，设置为群聊，即 `GroupChat`。
  EMConversationType convType = EMConversationType.GroupChat;
  // 每页期望获取的消息数量。
  int pageSize = 10;
  // 搜索的起始消息 ID。
  String startMsgId = "";
  EMCursorResult<EMMessage> result =
      await EMClient.getInstance.chatManager.fetchHistoryMessages(
    conversationId: threadId,
    type: convType,
    startMsgId: startMsgId,
    pageSize: pageSize,
  );
} on EMError catch (e) {}
```

#### 从本地获取单个消息话题的消息

调用 `EMChatManager#loadAllConversations` 方法只能获取单聊或群聊会话。你可以调用以下方法从本地获取单个消息话题的消息：

```dart
try {
  // 消息话题 ID。
  String threadId = "threadId";
  // 会话类型，即群聊 `GroupChat`。
  EMConversationType convType = EMConversationType.GroupChat;
  EMConversation? converrsation =
        await EMClient.getInstance.chatManager.getThreadConversation(threadId);
  // 搜索的起始消息 ID。
  String startMsgId = "startMsgId";
  // 每页期望获取的消息数量。
  int pageSize = 10;
  List<EMMessage>? list = await conversation?.loadMessages(
      startMsgId: startMsgId, loadCount: pageSize);
} on EMError catch (e) {}
```