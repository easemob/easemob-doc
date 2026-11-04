# 设置推送扩展功能

你可以实现推送扩展功能，包括设置自定义推送字段、强制推送和发送静默消息。

## 设置自定义推送字段

创建推送消息时，可以在消息中添加自定义字段，满足个性化业务需求。

```dart
// 本示例以文本消息为例，图片和文件等消息类型的设置方法相同。
ChatMessage msg = ChatMessage.createTxtSendMessage(
  targetId: 'receiveId',
  content: 'content',
);
msg.attributes = {
  // 将推送扩展设置到消息中。
  "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
};

try {
  await ChatClient.getInstance.chatManager.sendMessage(msg);
} on ChatError catch (e) {}

```

自定义字段的数据结构如下：

```json
{
    "em_push_ext": {
        "custom": {
            "key1": "value1",
            "key2": "value2"
        }
    }
}
```

| 参数             | 描述               |
| :--------------- | :----------------- |
| `em_push_ext`    | 消息推送扩展固定值，不可修改。 |
| `custom`         | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值。 |
| `key1`/`key2`    | 自定义消息推送扩展的具体内容。 |

## 强制推送

设置强制推送后，用户发送消息时会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向接收方推送消息。

```dart
// 本示例以文本消息为例，图片和文件等消息类型的设置方法相同。
ChatMessage msg = ChatMessage.createTxtSendMessage(
  targetId: 'receiveId',
  content: 'content',
);
msg.attributes = {
  'em_force_notification': true,
};

try {
  await ChatClient.getInstance.chatManager.sendMessage(msg);
} on ChatError catch (e) {}

```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，即时通讯 IM 服务不会通过推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```dart
// 本示例以文本消息为例，图片和文件等消息类型的设置方法相同。
ChatMessage msg = ChatMessage.createTxtSendMessage(
  targetId: 'receiveId',
  content: 'content',
);
msg.attributes = {
  'em_ignore_notification': true,
};

try {
  await ChatClient.getInstance.chatManager.sendMessage(msg);
} on ChatError catch (e) {}

```