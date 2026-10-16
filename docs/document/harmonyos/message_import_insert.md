# 导入和插入消息

## 功能说明

本文介绍环信即时通讯 IM HarmonyOS SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

HarmonyOS SDK 提供以下方式：

- 批量导入消息：调用 `ChatManager#importMessages`，将当前用户发送或接收的多条消息导入本地数据库。
- 向指定会话插入消息：调用 `Conversation#insertMessage`，按照消息中的 Unix 时间戳将消息插入指定会话。
- 直接保存消息：调用 `ChatManager#saveMessage`，将消息保存到本地数据库；若对应会话不存在，SDK 会自动创建会话。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，并确认当前用户的本地数据库已经打开，详见 [获取连接状态](connection.html#获取连接状态) 和 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 批量导入消息到数据库

如果需要使用批量导入方式在本地会话中插入消息，可以构造 `ChatMessage` 对象并调用 `ChatManager#importMessages`。当前用户只能导入自己发送或接收的消息。导入后，消息按照其中的时间戳添加到对应会话中。

推荐每次导入不超过 1,000 条消息。

你可以通过 `ChatOptions#setRegardImportedMsgAsRead` 设置是否将导入的消息视为已读。该配置默认为 `false`；设置为 `true` 时，导入的消息将被视为已读。可以通过 `ChatOptions#regardImportedMsgAsRead` 查询当前配置。

如需修改该配置，可以在初始化 SDK 时进行设置：

```typescript
const options: ChatOptions = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 将导入的消息视为已读。
options.setRegardImportedMsgAsRead(true);

// 获取当前配置。
const regardImportedMsgAsRead: boolean = options.regardImportedMsgAsRead();

ChatClient.getInstance().init(context, options);
```

初始化 SDK 且当前用户的本地数据库打开后，调用以下方法批量导入消息：

```typescript
ChatClient.getInstance().chatManager()?.importMessages(messages)
  .then((success: boolean): void => {
    if (success) {
      // 消息导入成功。
    } else {
      // 未导入消息，例如 messages 为空数组。
    }
  })
  .catch((error: ChatError): void => {
    // 消息导入失败。
  });
```

## 插入消息

如果需要在本地会话中加入一条无需发送、仅用于本地展示的消息，例如“XXX 撤回一条消息”“XXX 入群”或“对方正在输入”等，可以使用以下两种方式：

- 调用 `Conversation#insertMessage`，将消息插入指定的已有会话。消息会按照其中的 Unix 时间戳插入本地数据库，SDK 同时更新会话的最新消息等属性。调用前应确保消息的会话 ID 与目标会话 ID 一致，并传入正确的会话类型。
- 调用 `ChatManager#saveMessage`，将消息保存到本地数据库。SDK 会根据消息的会话类型和收发方向确定会话；若对应会话不存在，SDK 会自动创建会话。透传消息（命令消息）不会保存到本地。

以上两个接口仅更新当前设备的本地数据，不会将消息发送到服务器或会话对端，也不会同步到当前账号的其他设备。

示例代码如下：

```typescript
const chatManager: ChatManager | undefined = ChatClient.getInstance().chatManager();

// 方式一：将消息插入指定的已有会话。
// conversationType 根据实际会话传入 ConversationType.Chat、
// ConversationType.GroupChat 或 ConversationType.ChatRoom。
const conversation: Conversation | undefined = chatManager?.getConversation(
  conversationId,
  conversationType
);

if (conversation) {
  // 消息的会话 ID 应与目标会话 ID 一致。
  // SDK 按消息中的 Unix 时间戳确定插入位置。
  const inserted: boolean = conversation.insertMessage(message);
}

// 方式二：直接保存消息。
// SDK 会根据消息信息确定会话；若会话不存在，则自动创建。
// 注意：透传消息不会保存到本地。
chatManager?.saveMessage(message);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`setRegardImportedMsgAsRead`](#批量导入消息到数据库) | `ChatOptions` | 设置是否将导入的消息视为已读。 |
| [`regardImportedMsgAsRead`](#批量导入消息到数据库) | `ChatOptions` | 查询是否将导入的消息视为已读。 |
| [`importMessages`](#批量导入消息到数据库) | `ChatManager` | 将当前用户发送或接收的消息批量导入本地数据库。 |
| [`getConversation`](#插入消息) | `ChatManager` | 获取指定 ID 和类型的本地会话；未找到时返回 `undefined`。 |
| [`insertMessage`](#插入消息) | `Conversation` | 按消息中的 Unix 时间戳将消息插入指定本地会话。 |
| [`saveMessage`](#插入消息) | `ChatManager` | 将消息保存到本地数据库；必要时自动创建会话。 |
