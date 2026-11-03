# 消息仅投递在线用户

## 功能说明

环信即时通讯 IM 支持只将消息投递给在线用户。若接收方不在线，则无法收到消息。该功能适用于只需向在线用户展示的实时信息，例如通过透传消息更新群投票票数：在线用户关注实时变化，离线用户再次上线时由业务侧获取最终状态。

## 使用限制

- **适用会话类型**：仅支持单聊和群组聊天，**不适用于聊天室**。
- **支持消息类型**：各类型的消息均支持仅投递给在线用户。
- **离线存储限制**：**不支持离线存储**。若发送时接收方离线，即使其再次上线，也不会收到该消息。普通消息则会在接收方离线时按推送配置触发离线推送，并在其再次上线后下发离线消息。
- **漫游存储限制**：默认不支持漫游存储，用户无法在其他终端设备获取该消息。如需开通在线消息的漫游存储，需联系环信商务。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 仅向在线用户投递消息

发送消息前，将 `ChatMessage#deliverOnlineOnly` 设置为 `true`。该属性默认为 `false`，也可通过消息创建方法的可选参数传入。

下面以发送文本消息为例进行说明：

```typescript
// 单聊传入对端用户 ID，群聊传入群组 ID
const message = ChatMessage.createTextMessage(
  '<target_user_id>',
  '仅在线用户可见的消息',
  ChatMessageChatType.PeerChat, // 群聊使用 GroupChat
  { deliverOnlineOnly: true }
);

ChatClient.getInstance().chatManager.sendMessage(message, {
  onSuccess: (sentMessage) => {
    console.log('发送成功：', sentMessage.msgId);
  },
  onError: (localMsgId, error) => {
    console.error('发送失败：', localMsgId, error.code, error.description);
  },
}).catch((error: unknown) => {
  console.error('发起发送失败：', error);
});
```

`sendMessage` 返回的 `Promise<void>` 用于报告调用错误，最终发送结果通过发送状态回调返回。发送成功不代表离线接收方之后仍能收到该消息。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextMessage`](#仅向在线用户投递消息) | `ChatMessage` | 创建待发送的文本消息。 |
| [`deliverOnlineOnly`](#仅向在线用户投递消息) | `ChatMessage` | 设置消息是否只投递给在线用户。 |
| [`sendMessage`](#仅向在线用户投递消息) | `ChatManager` | 发送消息。 |
