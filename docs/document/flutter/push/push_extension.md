# 设置推送扩展功能

你可以利用扩展字段实现自定义推送设置，本文以强制推送和发送静默消息为例介绍如何实现推送扩展功能。

对于推送扩展字段，详见 [离线推送扩展字段文档](/document/server-side/push_extension.html)。

## 设置自定义推送字段

创建推送消息时，可以在消息中添加自定义字段，实现自定义推送设置。Flutter 通过 `ChatMessage.attributes` 设置消息扩展，`em_push_ext` 和其中的 `custom` 均使用 Map，不要转换成 JSON 字符串。

```dart
Future<void> sendCustomPushMessage(String toChatUsername) async {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同。
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: toChatUsername,
    content: 'message content',
    chatType: ChatType.Chat,
  );

  // 获取或创建推送扩展 Map，保留已有的其他推送配置。
  final Map<String, dynamic> pushExt = Map<String, dynamic>.from(
    (message.attributes?['em_push_ext'] as Map?) ?? <String, dynamic>{},
  );
  // 在固定字段 custom 中添加自定义推送字段。
  pushExt['custom'] = <String, dynamic>{
    'key1': 'value1',
    'key2': 'value2',
  };
  // 将推送扩展设置到消息中，保留已有的其他消息扩展。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_push_ext': pushExt,
  };

  final ChatManager manager = ChatClient.getInstance.chatManager;
  // 保存发送前的消息 ID，用于筛选当前消息的发送事件。
  final String localId = message.msgId;
  final String listenerId = 'custom_push_$localId';

  // 发送前注册状态监听；监听也会收到其他消息的发送或下载事件。
  manager.addMessageEvent(
    listenerId,
    ChatMessageEvent(
      onSuccess: (msgId, sentMessage) {
        if (msgId != localId) return;
        // 消息最终发送成功。
        debugPrint('Message sent: ${sentMessage.msgId}');
        // 延后移除监听，避免在事件分发过程中修改监听器集合。
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onError: (msgId, failedMessage, error) {
        if (msgId != localId) return;
        // 消息最终发送失败，根据错误码和错误信息处理。
        debugPrint('Send failed: ${error.code}, ${error.description}');
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onProgress: (msgId, progress) {
        if (msgId != localId) return;
        // 附件上传进度；文本消息通常没有上传进度回调。
        debugPrint('Upload progress: $progress%');
      },
    ),
  );

  try {
    // 提交发送任务；最终发送结果由上述消息状态回调通知。
    await manager.sendMessage(message);
  } on ChatError catch (error) {
    // 处理提交发送任务时的异常，并移除本次监听。
    manager.removeMessageEvent(listenerId);
    debugPrint('Submit failed: ${error.code}, ${error.description}');
  }
}
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
上述字段说明如下：

| 参数 | 描述 |
| :--- | :--- |
| `em_push_ext` | 消息推送扩展的固定字段名，不可修改，值为 `Map<String, dynamic>`。 |
| `custom` | `em_push_ext` 中用于添加自定义推送字段的固定字段名，值为 `Map<String, dynamic>`。 |
| `key1`/`key2` | 自定义消息推送扩展的具体内容，可按业务需要设置字段名和值。 |

应用端解析自定义字段，可参考 [Android 解析收到的推送字段](/document/android/push/push_parsing.html) 和 [iOS 解析收到的推送字段](/document/ios/push/push_parsing.html)。

## 强制推送

设置强制推送后，用户发送消息时会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向接收方推送消息。

`em_force_notification` 为 `true` 时启用强制推送；未设置或为 `false` 时，按正常推送规则处理。强制推送仅绕过免打扰设置，不会替代设备 Token 绑定、系统通知权限等推送条件。

```dart
Future<void> sendForcePushMessage(String toChatUsername) async {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同。
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: toChatUsername,
    content: 'test',
    chatType: ChatType.Chat,
  );

  // 设置内置扩展字段 em_force_notification。
  // true：强制推送；（默认）false：非强制推送。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_force_notification': true,
  };

  final ChatManager manager = ChatClient.getInstance.chatManager;
  // 保存发送前的消息 ID，用于筛选当前消息的发送事件。
  final String localId = message.msgId;
  final String listenerId = 'force_push_$localId';

  // 发送前注册状态监听；监听也会收到其他消息的发送或下载事件。
  manager.addMessageEvent(
    listenerId,
    ChatMessageEvent(
      onSuccess: (msgId, sentMessage) {
        if (msgId != localId) return;
        // 消息最终发送成功。
        debugPrint('Message sent: ${sentMessage.msgId}');
        // 延后移除监听，避免在事件分发过程中修改监听器集合。
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onError: (msgId, failedMessage, error) {
        if (msgId != localId) return;
        // 消息最终发送失败，根据错误码和错误信息处理。
        debugPrint('Send failed: ${error.code}, ${error.description}');
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onProgress: (msgId, progress) {
        if (msgId != localId) return;
        // 附件上传进度；文本消息通常没有上传进度回调。
        debugPrint('Upload progress: $progress%');
      },
    ),
  );

  try {
    // 提交发送任务；最终发送结果由上述消息状态回调通知。
    await manager.sendMessage(message);
  } on ChatError catch (error) {
    // 处理提交发送任务时的异常，并移除本次监听。
    manager.removeMessageEvent(listenerId);
    debugPrint('Submit failed: ${error.code}, ${error.description}');
  }
}
```

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，仍可接收服务端保存的离线消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

`em_ignore_notification` 为 `true` 时不发送离线推送通知；未设置或为 `false` 时，按正常推送规则处理。

```dart
Future<void> sendSilentMessage(String toChatUsername) async {
  // 下面以文本消息为例，图片、文件等消息的推送扩展设置方法相同。
  // 创建消息并设置接收方和消息体；单聊时 targetId 为对端用户 ID。
  final ChatMessage message = ChatMessage.createTxtSendMessage(
    targetId: toChatUsername,
    content: 'test',
    chatType: ChatType.Chat,
  );

  // 设置内置扩展字段 em_ignore_notification。
  // true：不发送离线推送通知；（默认）false：按正常推送规则处理。
  message.attributes = <String, dynamic>{
    ...?message.attributes,
    'em_ignore_notification': true,
  };

  final ChatManager manager = ChatClient.getInstance.chatManager;
  // 保存发送前的消息 ID，用于筛选当前消息的发送事件。
  final String localId = message.msgId;
  final String listenerId = 'silent_push_$localId';

  // 发送前注册状态监听；监听也会收到其他消息的发送或下载事件。
  manager.addMessageEvent(
    listenerId,
    ChatMessageEvent(
      onSuccess: (msgId, sentMessage) {
        if (msgId != localId) return;
        // 消息最终发送成功。
        debugPrint('Message sent: ${sentMessage.msgId}');
        // 延后移除监听，避免在事件分发过程中修改监听器集合。
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onError: (msgId, failedMessage, error) {
        if (msgId != localId) return;
        // 消息最终发送失败，根据错误码和错误信息处理。
        debugPrint('Send failed: ${error.code}, ${error.description}');
        Future<void>.microtask(() => manager.removeMessageEvent(listenerId));
      },
      onProgress: (msgId, progress) {
        if (msgId != localId) return;
        // 附件上传进度；文本消息通常没有上传进度回调。
        debugPrint('Upload progress: $progress%');
      },
    ),
  );

  try {
    // 提交发送任务；最终发送结果由上述消息状态回调通知。
    await manager.sendMessage(message);
  } on ChatError catch (error) {
    // 处理提交发送任务时的异常，并移除本次监听。
    manager.removeMessageEvent(listenerId);
    debugPrint('Submit failed: ${error.code}, ${error.description}');
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTxtSendMessage`](#设置自定义推送字段) | `ChatMessage` | 创建文本消息，同时设置接收方、消息体和会话类型。 |
| [`attributes`](#设置自定义推送字段) | `ChatMessage` | 设置自定义推送、强制推送或静默消息所需的消息扩展字段。 |
| [`addMessageEvent`](#设置自定义推送字段) | `ChatManager` | 注册消息发送或下载状态监听。 |
| [`removeMessageEvent`](#设置自定义推送字段) | `ChatManager` | 移除指定的消息状态监听。 |
| [`sendMessage`](#设置自定义推送字段) | `ChatManager` | 提交发送消息任务，返回 `Future<ChatMessage>`。 |
