# 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现过程

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](/images/common/typing_indicator.png)

监听用户 A 的输入状态。一旦有文本输入，通过透传消息将输入状态发送给用户 B，用户 B 收到该消息，了解到用户 A 正在输入文本。

- 用户 A 向用户 B 发送消息，通知其开始输入文本。
- 收到消息后，如果用户 B 与用户 A 的聊天页面处于打开状态，则显示用户 A 的输入指示器。
- 如果用户 B 在几秒后未再次收到用户 A 的输入状态，则自动取消输入指示器。

:::tip
输入状态属于瞬时状态，建议设置发送间隔，避免在每次文本变化时都发送消息。接收方每次收到输入状态时应重新计时，并在一段时间内未再次收到该状态时自动隐藏输入指示器。
:::

### 发送输入状态的透传消息

以下示例代码展示如何每隔至少 5 秒发送一次输入状态的透传消息。将 `deliverOnlineOnly` 设置为 `true` 后，接收方离线时 SDK 会丢弃该瞬时状态消息。

```dart
const String typingBeginAction = 'TypingBegin';
const Duration typingSendInterval = Duration(seconds: 5);

DateTime? previousTypingSentAt;

Future<void> onTextChanged(String text) async {
  if (text.isEmpty) return;

  final now = DateTime.now();
  final previous = previousTypingSentAt;
  if (previous != null && now.difference(previous) < typingSendInterval) {
    return;
  }

  final message = ChatMessage.createCmdSendMessage(
    targetId: conversationId,
    action: typingBeginAction,
    deliverOnlineOnly: true,
    chatType: ChatType.Chat,
  );

  try {
    await ChatClient.getInstance.chatManager.sendMessage(message);
    previousTypingSentAt = now;
  } on ChatError catch (e) {
    debugPrint('发送输入状态失败：$e');
  }
}
```

### 接收和解析输入状态的透传消息

通过 `ChatEventHandler.onCmdMessagesReceived` 接收透传消息。收到当前单聊会话的输入状态后显示输入指示器，并重新启动一次性定时器；定时器到期后隐藏输入指示器。

```dart
const String typingBeginAction = 'TypingBegin';
const Duration typingDisplayDuration = Duration(seconds: 10);
const String chatHandlerId = 'typing-indicator';

Timer? typingTimer;

void registerTypingHandler() {
  ChatClient.getInstance.chatManager.addEventHandler(
    chatHandlerId,
    ChatEventHandler(
      onCmdMessagesReceived: (messages) {
        for (final message in messages) {
          if (message.conversationId != currentConversationId) continue;

          final body = message.body;
          if (body is ChatCmdMessageBody &&
              body.action == typingBeginAction) {
            showTypingIndicator();
            restartTypingTimer();
          }
        }
      },
    ),
  );
}

void restartTypingTimer() {
  typingTimer?.cancel();
  typingTimer = Timer(typingDisplayDuration, hideTypingIndicator);
}

void unregisterTypingHandler() {
  typingTimer?.cancel();
  ChatClient.getInstance.chatManager.removeEventHandler(chatHandlerId);
}
```

页面销毁时，应取消定时器并移除事件监听，避免重复回调。
