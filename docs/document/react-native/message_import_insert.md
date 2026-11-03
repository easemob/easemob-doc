# 导入和插入消息

## 功能说明

本文介绍环信即时通讯 IM React Native SDK 如何将消息导入本地数据库，以及如何在本地会话中插入消息。

这些操作仅更新当前设备上的本地消息和会话数据，不会将消息发送给会话对端，也不会向服务器上传消息或同步到当前账号的其他设备。常见使用场景包括迁移历史消息、恢复本地消息记录，以及插入撤回提示、入群通知等仅用于本地展示的消息。

React Native SDK 提供以下方式：

- 批量导入消息：调用 `ChatManager#importMessages`，将当前用户发送或接收的多条消息导入本地数据库。
- 插入单条消息：调用 `ChatManager#insertMessage`，SDK 根据消息的会话信息确定目标会话，并按消息时间戳插入。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，且当前用户的本地数据库 [打开当前用户的本地数据库](initialization.html#设置登录后自动同步数据)，详见 [登录](login.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 批量导入消息到数据库

先将待导入数据转换为 `ChatMessage[]`，再调用 `ChatManager#importMessages(messages)`。

当前用户只能导入自己发送或接收的消息。导入后，SDK 按照消息中的时间戳将消息添加到对应会话。建议每次导入不超过 1,000 条消息。

```typescript
// messages 为业务侧根据历史数据准备的消息对象数组
async function importLocalMessages(messages: ChatMessage[]): Promise<void> {
  try {
    await ChatClient.getInstance().chatManager.importMessages(messages);
    console.log('本地消息导入完成');
  } catch (error: unknown) {
    console.error('导入本地消息失败：', error);
  }
}
```

:::tip
`ChatOptions#regardImportMessagesAsRead` 不用于设置通过 `importMessages` 导入的本地消息是否已读。该配置适用于通过 [服务端消息导入接口](/document/server-side/message_import_single.html) 导入、之后由客户端从服务器拉取的历史消息。
:::

## 插入消息

如需在本地会话中加入一条无需发送、仅用于本地展示的消息，例如“某用户撤回了一条消息”或“某用户入群”，可构造消息后调用 `ChatManager#insertMessage(message)`。

SDK 根据消息的会话类型和收发信息确定会话，并按照消息中的 Unix 时间戳插入，同时更新会话的最新消息等数据。该接口不上传附件，也不发送消息。透传消息不应作为持久化的本地展示消息。

示例代码如下：

```typescript
async function insertLocalNotice(groupId: string): Promise<void> {
  const message = ChatMessage.createTextMessage(
    groupId,
    '某用户已加入群组',
    ChatMessageChatType.GroupChat
  );
  // 如需迁移旧消息，应使用原消息的时间戳，单位为毫秒
  message.localTime = Date.now();
  message.serverTime = message.localTime;

  try {
    await ChatClient.getInstance().chatManager.insertMessage(message);
    console.log('本地插入调用完成');
  } catch (error: unknown) {
    console.error('插入本地消息失败：', error);
  }
}
```

:::notice
应避免重复插入已有 `msgId` 或 `localMsgId` 的消息。当前 Android 桥接未将底层 `insertMessage` 的布尔返回值传回 JavaScript，因此 Promise 正常完成不能单独证明消息已写入；关键迁移流程应在插入后通过 `getMessage` 查询核对结果，并刷新业务界面。
:::

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`importMessages`](#批量导入消息到数据库) | `ChatManager` | 将当前用户发送或接收的消息批量导入本地数据库。 |
| [`createTextMessage`](#插入消息) | `ChatMessage` | 创建用于本地展示的文本消息对象。 |
| [`insertMessage`](#插入消息) | `ChatManager` | 按消息的会话信息和时间戳插入单条本地消息。 |
| [`getMessage`](#插入消息) | `ChatManager` | 根据消息 ID 查询本地写入结果。 |
