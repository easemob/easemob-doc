# 管理消息话题中的消息

## 功能说明

消息话题中的消息属于群聊消息类型，与普通群组消息的区别是需要将 `isChatThreadMessage` 标记设置为 `true`。使用消息话题中的消息功能前，你需要联系商务开通。

本文介绍环信即时通讯 IM Flutter SDK 如何发送、接收以及撤回消息话题中的消息。

## 消息收发流程

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图所示：

![img](/images/android/threads.png)

## 功能开通

使用消息话题功能前，你需要联系商务开通该功能。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录成功，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要将 `isChatThreadMessage` 标记设置为 `true`。

发送前应按 [发送消息统一流程](message_send.html#发送消息统一流程) 注册消息状态监听。`sendMessage` 返回表示发送任务已提交，最终发送成功或失败通过 `ChatMessageEvent` 的 `onSuccess` 或 `onError` 通知。

示例代码如下：

```dart
// content：消息文字内容
// chatThreadId：消息话题 ID
final ChatMessage message = ChatMessage.createTxtSendMessage(
  targetId: chatThreadId,
  content: content,
  // 消息话题中的消息需要将 chatType 设置为群聊。
  chatType: ChatType.GroupChat,
);

// 将消息标记为消息话题中的消息。
message.isChatThreadMessage = true;

try {
  // 提交发送任务。最终发送结果通过 ChatMessageEvent 的 onSuccess / onError 获取。
  final ChatMessage submittedMessage =
      await ChatClient.getInstance.chatManager.sendMessage(message);
} on ChatError catch (error) {
  // 提交发送任务时发生错误，根据错误信息处理。
}
```

## 接收消息话题中的消息

接收消息的具体逻辑，请参考 [接收消息](message_receive.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有新增消息时，消息话题所属群组的所有成员收到 `ChatThreadEventHandler.onChatThreadUpdate` 回调，消息话题成员收到 `ChatEventHandler.onMessagesReceived` 回调。

示例代码如下：

```dart
const String messageHandlerId = 'THREAD_MESSAGE_HANDLER_ID';

ChatClient.getInstance.chatManager.addEventHandler(
  messageHandlerId,
  ChatEventHandler(
    // 收到消息，遍历消息列表，解析和显示。
    onMessagesReceived: (List<ChatMessage> messages) {
      for (final ChatMessage message in messages) {
        if (message.isChatThreadMessage) {
          // 接收到消息话题中的消息，添加处理逻辑。
        }
      }
    },
  ),
);

// 不再接收消息事件时，移除监听。
ChatClient.getInstance.chatManager.removeEventHandler(messageHandlerId);
```

## 撤回消息话题中的消息

撤回消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题有消息撤回时，消息话题所属群组的所有成员收到 `ChatThreadEventHandler.onChatThreadUpdate` 回调，消息话题成员收到 `ChatEventHandler.onMessagesRecalledInfo` 回调。

示例代码如下：

```dart
const String recallHandlerId = 'THREAD_RECALL_HANDLER_ID';

ChatClient.getInstance.chatManager.addEventHandler(
  recallHandlerId,
  ChatEventHandler(
    // 收到撤回消息回调，遍历撤回信息列表，解析和显示。
    onMessagesRecalledInfo: (List<RecallMessageInfo> recallInfoList) {
      for (final RecallMessageInfo recallInfo in recallInfoList) {
        final ChatMessage? message = recallInfo.recallMessage;
        if (message != null && message.isChatThreadMessage) {
          // 接收到消息话题中的消息被撤回，添加处理逻辑。
        }
      }
    },
  ),
);

// 不再接收消息撤回事件时，移除监听。
ChatClient.getInstance.chatManager.removeEventHandler(recallHandlerId);
```

## 获取消息话题中的消息

从服务器还是本地数据库获取消息话题中的消息取决于你的生产环境。

你可以通过 `ChatConversation.isChatThread` 属性判断当前会话是否为消息话题会话。

### 从服务器获取单个消息话题的消息（消息漫游）

调用 `fetchHistoryMessagesByOption` 从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

```dart
String? cursor;
const int pageSize = 10;
const FetchMessageOptions options = FetchMessageOptions(
  direction: ChatSearchDirection.Down,
);

try {
  final ChatCursorResult<ChatMessage> result =
      await ChatClient.getInstance.chatManager.fetchHistoryMessagesByOption(
    chatThreadId,
    ChatConversationType.GroupChat,
    options: options,
    cursor: cursor,
    pageSize: pageSize,
  );
  cursor = result.cursor;
  final List<ChatMessage> messages = result.data;
} on ChatError catch (error) {
  // 获取失败。
}
```

### 从本地获取单个消息话题的消息

调用 `ChatManager.loadAllConversations` 方法只能获取单聊或群聊会话。你可以调用以下方法从本地获取单个消息话题的消息：

```dart
try {
  // chatThreadId：消息话题 ID
  final ChatConversation? conversation =
      await ChatClient.getInstance.chatManager.getThreadConversation(
    chatThreadId,
  );

  if (conversation != null) {
    // 从本地数据库加载消息。如果 startMsgId 为空字符串，则从最新消息开始加载。
    final List<ChatMessage> messages = await conversation.loadMessages(
      startMsgId: startMsgId,
      loadCount: pageSize,
      direction: ChatSearchDirection.Up,
    );
  }
} on ChatError catch (error) {
  // 获取失败。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTxtSendMessage`](#发送消息话题中的消息) | `ChatMessage` | 创建文本消息。 |
| [`sendMessage`](#发送消息话题中的消息) | `ChatManager` | 发送消息话题中的消息。 |
| [`fetchHistoryMessagesByOption`](#从服务器获取单个消息话题的消息-消息漫游) | `ChatManager` | 从服务器分页获取消息话题中的历史消息。 |
| [`getThreadConversation`](#从本地获取单个消息话题的消息) | `ChatManager` | 获取本地消息话题会话。 |
| [`loadMessages`](#从本地获取单个消息话题的消息) | `ChatConversation` | 从本地数据库加载消息。 |
