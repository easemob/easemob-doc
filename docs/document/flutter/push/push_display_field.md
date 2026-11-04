# 使用消息扩展字段设置推送通知显示内容

## 通过消息扩展字段设置推送通知显示内容

发送消息时，可以通过固定消息扩展字段 `em_push_ext` 设置自定义推送展示内容。在 Flutter 中，通过 `ChatMessage.attributes` 设置消息扩展，`em_push_ext` 的值为 `Map<String, dynamic>`，其中使用 `title` 和 `content` 分别设置推送标题和推送内容。

完成 SDK 初始化并成功登录后，在发送消息前设置上述字段。下面以单聊文本消息为例，图片等附件消息的推送扩展设置方法相同。

```dart
Future<void> sendMessageWithPushContent(String toChatUsername) async {
  // 创建文本消息并设置消息体；单聊时 targetId 为对端用户 ID。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: toChatUsername,
    content: 'message content',
    chatType: ChatType.Chat,
  );

  // 获取或创建推送扩展 Map，保留已有的其他推送配置。
  final Map<String, dynamic> pushExt = Map<String, dynamic>.from(
    (message.attributes?['em_push_ext'] as Map?) ?? <String, dynamic>{},
  );
  // 固定字段 title：自定义推送标题，字段名不可修改。
  pushExt['title'] = 'custom push title';
  // 固定字段 content：自定义推送内容，字段名不可修改。
  pushExt['content'] = 'custom push content';

  // 将推送扩展设置到消息中，并保留已有的其他消息扩展。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_push_ext': pushExt,
  };

  final ChatManager manager = ChatClient.getInstance.chatManager;
  // 保存发送前的消息 ID，用于筛选当前消息的发送事件。
  final String localId = message.msgId;
  final String listenerId = 'push_content_$localId';

  // 发送前注册消息状态监听；此监听也会收到其他消息的发送或下载事件。
  manager.addMessageEvent(
    listenerId,
    ChatMessageEvent(
      onSuccess: (msgId, sentMessage) {
        if (msgId != localId) return;
        // 消息最终发送成功；使用回调返回的消息读取服务端消息 ID。
        debugPrint('Message sent: ${sentMessage.msgId}');
        // 异步移除监听，避免在回调分发过程中修改监听器集合。
        scheduleMicrotask(() => manager.removeMessageEvent(listenerId));
      },
      onError: (msgId, failedMessage, error) {
        if (msgId != localId) return;
        // 消息最终发送失败，根据错误码和错误信息处理。
        debugPrint('Send failed: ${error.code}, ${error.description}');
        scheduleMicrotask(() => manager.removeMessageEvent(listenerId));
      },
      onProgress: (msgId, progress) {
        if (msgId != localId) return;
        // 附件上传进度；文本消息通常没有上传进度回调。
        debugPrint('Upload progress: $progress%');
      },
    ),
  );

  try {
    // 提交发送任务；await 返回不代表消息最终发送成功。
    await manager.sendMessage(message);
  } on ChatError catch (error) {
    // 处理提交发送任务时的异常，并移除本次监听。
    manager.removeMessageEvent(listenerId);
    debugPrint('Submit failed: ${error.code}, ${error.description}');
  }
}
```

消息发送成功不代表离线推送已送达设备。推送还需满足设备 Token 绑定、离线推送策略等条件，详见 [离线推送概述](push_overview.html)。

`attributes` 对应服务端消息 JSON 的 `ext`。直接设置 `attributes['em_push_ext']` 即可，不要再在 `attributes` 中嵌套一层 `ext`，也不要将 `em_push_ext` 的值转换成 JSON 字符串。若原消息已包含 `em_push_ext` 中的其他字段，应合并该 Map 后再更新 `title`、`content`，避免覆盖已有配置。

| 参数 | 描述 |
| :--- | :--- |
| `toChatUsername` | 单聊消息接收方的用户 ID，对应 `createTxtSendMessage` 的 `targetId`。群聊或聊天室场景应传入对应的群组或聊天室 ID，并分别设置 `chatType` 为 `ChatType.GroupChat` 或 `ChatType.ChatRoom`；会话类型设置不代表该场景一定支持离线推送，聊天室不支持离线推送。 |
| `em_push_ext` | 用于自定义推送展示内容的固定消息扩展字段，值为可 JSON 序列化的 `Map<String, dynamic>`。字段名不可修改。 |
| `title` | `em_push_ext` 中用于设置自定义推送标题的固定 Key，值为 `String`。 |
| `content` | `em_push_ext` 中用于设置自定义推送内容的固定 Key，值为 `String`。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTxtSendMessage`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessage` | 创建文本消息，同时设置接收方、消息体和会话类型。 |
| [`attributes`](#使用消息扩展字段设置推送通知显示内容) | `ChatMessage` | 设置消息扩展字段，类型为 `Map<String, dynamic>?`。 |
| [`addMessageEvent`](#使用消息扩展字段设置推送通知显示内容) | `ChatManager` | 注册消息发送或下载状态监听，最终结果由 `ChatMessageEvent` 通知。 |
| [`removeMessageEvent`](#使用消息扩展字段设置推送通知显示内容) | `ChatManager` | 移除指定的消息状态监听。 |
| [`sendMessage`](#使用消息扩展字段设置推送通知显示内容) | `ChatManager` | 提交发送消息任务，返回 `Future<ChatMessage>`。 |
