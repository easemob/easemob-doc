# 使用消息扩展字段

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题和推送内容。

```dart
EMMessage msg = EMMessage.createTxtSendMessage(
  targetId: 'receiveId',
  content: 'content',
);
msg.attributes = {
  // 将推送扩展设置到消息中。该字段为内置的推送扩展字段。
  'em_push_ext': {
    // 自定义推送消息标题。该字段为内置内置字段，字段名不可修改。
    'title': 'custom push title',
    // 自定义推送消息内容。该字段为内置内置字段，字段名不可修改。
    'content': 'custom push content'
  }
};

try {
  await EMClient.getInstance.chatManager.sendMessage(msg);
} on EMError catch (e) {}
```

自定义显示字段的数据结构如下：

```dart
{
    "em_push_ext": {
        "title": "custom push title",
        "content": "custom push content"
    }
}
```

| 参数              | 描述          |
| :---------------- | :----------- |
| `em_push_ext`     | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `title`   | 自定义字段 key，用于设置自定义的标题，该值为固定值，不可修改。           |
| `content` | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。           |