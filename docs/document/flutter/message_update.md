# 更新消息

## 功能说明

环信即时通讯 IM Flutter SDK 支持更新当前设备本地内存和数据库中已有的消息。应用可以根据业务需求修改消息的本地状态或内容，并刷新会话中的消息展示。
本地消息更新仅对当前设备生效，不会修改服务端保存的消息，也不会将变更同步给消息接收方或当前账号的其他设备。
如需修改已经发送成功的服务端消息，详见 [编辑消息](message_modify.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并确保当前用户的 [本地数据库已打开](login.html#登录完成前使用本地数据库)，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 更新消息到本地数据库

你可以通过以下两种方式更新当前设备本地数据库中的消息。该操作不会修改服务端消息，也不会通知消息接收方或当前账号的其他设备。

- 直接调用 `ChatManager#updateMessage` 方法更新 SDK 本地数据库中的消息。

```dart
try {
  await ChatClient.getInstance.chatManager.updateMessage(message);
} on ChatError catch (e) {
  // 更新失败，根据错误码和错误信息处理。
}
```

- 若正在使用 `ChatConversation` 类，可以先获取会话，再调用 `ChatConversation#updateMessage` 方法更新 SDK 本地数据库会话中的消息。

```dart
final ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  try {
    await conversation.updateMessage(message);
  } on ChatError catch (e) {
    // 更新失败，根据错误码和错误信息处理。
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updateMessage`](#更新消息到本地数据库) | `ChatManager` | 更新当前设备本地内存和数据库中的消息。 |
| [`getConversation`](#更新消息到本地数据库) | `ChatManager` | 根据会话 ID 获取本地会话对象。 |
| [`updateMessage`](#更新消息到本地数据库) | `ChatConversation` | 更新指定会话在本地数据库和内存缓存中的消息。 |
