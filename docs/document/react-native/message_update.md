# 更新消息

## 功能说明

环信即时通讯 IM React Native SDK 支持更新当前设备本地内存和数据库中已有的消息。应用可以根据业务需求修改消息的本地状态或内容，并刷新会话中的消息展示。

本地消息更新仅对当前设备生效，不会修改服务端保存的消息，也不会将变更同步给消息接收方或当前账号的其他设备。

如需修改已经发送成功的服务端消息，详见 [编辑消息](message_modify.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并确保当前用户的 [本地数据库已打开](login.html#登录完成前使用本地数据库)，详见 [快速开始](quickstart.html) 和 [登录](login.html)。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。

## 更新消息到本地数据库

你可以修改消息体 `body` 中的内容（例如文本消息的 `content`），或添加、更新消息扩展字段 `attributes`，再调用 `ChatManager#updateMessage` 将修改保存到当前设备的本地数据库。该操作不会修改服务端消息，也不会通知消息接收方或当前账号的其他设备。

该方法接收已存在于本地数据库中的 `ChatMessage` 对象，返回 `Promise<ChatMessage>`，成功时返回更新后的消息对象。

以下示例修改一条本地文本消息的文本内容和扩展字段：

```typescript
// message 为已存在于本地数据库中的文本消息
const textBody = message.body as ChatTextMessageBody;

// 修改文本内容
textBody.content = '修改后的文本内容';

// 添加或更新扩展字段，保留其他已有字段
message.attributes = {
  ...message.attributes,
  businessStatus: 'processed',
};

try {
  // 将修改后的消息保存到本地数据库
  const updatedMessage = await ChatClient.getInstance().chatManager
    .updateMessage(message);
} catch (error: unknown) {
  console.error('更新本地消息失败：', error);
}
```

无法通过该方法修改消息 ID、收发方向、发送方、接收方或所属会话。`isRead`、`isPeerRead` 和 `groupReadReceiptCount` 为只读字段，不能直接赋值修改。消息回执处理详见 [实现消息回执](message_receipt.html)，会话未读数处理详见 [管理会话未读数](conversation_unread.html)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`updateMessage`](#更新消息到本地数据库) | `ChatManager` | 更新当前设备本地内存和数据库中的消息。 |
| [`getConversation`](#更新消息到本地数据库) | `ChatManager` | 根据会话 ID 和类型获取本地会话对象。 |
| [`updateMessage`](#更新消息到本地数据库) | `ChatConversation` | 更新指定会话在本地数据库和内存缓存中的消息。 |
