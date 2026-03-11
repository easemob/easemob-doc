# 消息扩展

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```dart
try {
  final msg = EMMessage.createTxtSendMessage(
    targetId: targetId,
    content: 'content',
  );

  msg.attributes = {'k': 'v'};
  EMClient.getInstance.chatManager.sendMessage(msg);
} on EMError catch (e) {}
```