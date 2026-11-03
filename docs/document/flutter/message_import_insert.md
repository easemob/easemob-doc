# 导入和插入消息

## 功能说明

本文介绍环信即时通讯 IM Flutter SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

Flutter SDK 提供以下方式：

- 批量导入消息：调用 `ChatManager#importMessages`，将当前用户发送或接收的多条消息导入本地数据库。
- 向指定会话插入消息：调用 `ChatConversation#insertMessage`，按照消息中的 Unix 时间戳将消息插入指定会话。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并已 [打开当前用户的本地数据库](initialization.html#设置登录后自动同步数据)，详见[快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见[使用限制](/product/limitation.html)。

## 批量导入消息到数据库

如需在本地会话中批量导入消息，应先将待导入数据转换为 `ChatMessage` 对象列表，再调用 `ChatManager#importMessages(List<ChatMessage>)`。

当前用户只能导入自己发送或接收的消息。导入后，SDK 会按照消息中的时间戳将消息添加到对应会话。建议每次导入不超过 1,000 条消息。

`importMessages` 是异步方法，返回 `Future<void>`；调用失败时抛出 `ChatError`。调用前，应确保 SDK 已初始化，并且当前用户的本地数据库已经打开。

```dart
// messages 为已准备好的消息列表，类型为 List<ChatMessage>。
await ChatClient.getInstance.chatManager.importMessages(messages);
```

:::tip
`ChatOptions#regardImportMessagesAsRead` 不用于设置通过 `ChatManager#importMessages` 导入的本地消息是否已读。该配置适用于通过[服务端消息导入接口](/document/server-side/message_import_single.html)导入、之后由客户端从服务器拉取的历史消息。
:::

## 插入消息

如果需要在本地会话中加入一条无需发送、仅用于本地展示的消息，例如“XXX 撤回一条消息”“XXX 入群”或“对方正在输入”等，可以调用 `ChatConversation#insertMessage`，将消息插入指定的已有会话。消息会按照其中的 Unix 时间戳插入本地数据库，SDK 同时更新会话的 `latestMessage` 等属性。调用前应确保消息的会话 ID 与目标会话 ID 一致。

该接口仅更新当前设备的本地数据，不会将消息发送到服务器或会话对端，也不会同步到当前账号的其他设备。

示例代码如下：

```dart
// 将消息插入指定的已有会话。
ChatConversation? conversation =
    await ChatClient.getInstance.chatManager.getConversation(
  conversationId,
  type: conversationType,
  createIfNeed: false,
);

if (conversation != null) {
  // 消息的会话 ID 应与目标会话 ID 一致。
  // SDK 按消息中的 Unix 时间戳确定插入位置。
  await conversation.insertMessage(message);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`importMessages`](#批量导入消息到数据库) | `ChatManager` | 将当前用户发送或接收的消息批量导入本地数据库。 |
| [`getConversation`](#插入消息) | `ChatManager` | 获取指定 ID 和类型的本地会话；未找到时返回 `null`。 |
| [`insertMessage`](#插入消息) | `ChatConversation` | 按消息中的 Unix 时间戳将消息插入指定本地会话。 |

