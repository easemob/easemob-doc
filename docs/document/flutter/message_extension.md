# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，你可以通过消息扩展字段携带自定义业务数据，例如被回复消息信息、图文消息展示数据或业务标识等。

Flutter SDK 通过 `ChatMessage#attributes` 设置消息扩展字段，支持 `bool`、`int`、`double`、`String`、`Map` 和 `List` 类型。接收方收到消息后，可以通过 `ChatMessage#attributes` 获取消息中的全部扩展字段，并根据业务需求进行处理。

## 示例代码

```dart
final message = ChatMessage.createTxtSendMessage(
  targetId: targetId,
  content: content,
);

// 增加自定义属性。
message.attributes = {
  'attribute1': 'value',
  'attribute2': true,
};

try {
  // 发送携带扩展字段的消息。
  await ChatClient.getInstance.chatManager.sendMessage(message);

  // 接收消息后读取自定义属性。
  final String? attribute1 = message.attributes?['attribute1'] as String?;
  final bool attribute2 = message.attributes?['attribute2'] as bool? ?? false;

  // 获取消息中的全部扩展字段。
  final Map<String, dynamic>? attributes = message.attributes;
} on ChatError catch (e) {
  // 发送失败，根据错误码和错误信息处理。
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTxtSendMessage`](#示例代码) | `ChatMessage` | 创建待发送的文本消息。 |
| [`sendMessage`](#示例代码) | `ChatManager` | 发送携带扩展字段的消息。 |
