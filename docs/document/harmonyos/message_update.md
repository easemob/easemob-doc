# 更新消息

## 功能说明

环信即时通讯 IM HarmonyOS SDK 支持更新当前设备本地数据库中已有的消息。应用可以根据业务需求修改消息的本地状态或内容，并刷新会话中的消息展示。

本地消息更新仅对当前设备生效，不会修改服务端保存的消息，也不会将变更同步给消息接收方或当前账号的其他设备。如需修改已经发送成功的服务端消息，详见 [编辑消息](message_modify.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并确认当前用户的本地数据库已经打开，详见 [获取连接状态](connection.html#获取连接状态) 和 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 更新消息到本地数据库

你可以通过以下两种方式更新当前设备本地数据库中的消息。更新成功后，消息 ID 不会变化。该操作不会修改服务端消息，也不会通知消息接收方或当前账号的其他设备。

:::tip
透传消息不会保存到本地数据库。调用 `ChatManager#updateMessage` 更新透传消息时，方法返回 `false`。
:::

- 调用 `ChatManager#updateMessage` 更新本地消息。该方法同步返回 `boolean` 类型的更新结果。

```typescript
let chatManager = ChatClient.getInstance().chatManager();
if (chatManager) {
  let isUpdated = chatManager.updateMessage(message);
  if (!isUpdated) {
    // 处理消息更新失败。
  }
}
```

- 若已经持有 `Conversation` 对象，可以调用 `Conversation#updateMessage` 更新该会话中的本地消息。该方法同样同步返回 `boolean` 类型的更新结果。

```typescript
let conversation = ChatClient.getInstance()
  .chatManager()
  ?.getConversation(conversationId, conversationType, false);

if (conversation) {
  let isUpdated = conversation.updateMessage(message);
  if (!isUpdated) {
    // 处理消息更新失败。
  }
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updateMessage`](#更新消息到本地数据库) | `ChatManager` | 更新当前设备本地数据库中的消息。 |
| [`getConversation`](#更新消息到本地数据库) | `ChatManager` | 根据会话 ID 和会话类型获取本地会话对象。 |
| [`updateMessage`](#更新消息到本地数据库) | `Conversation` | 更新指定会话在本地数据库中的消息。 |
