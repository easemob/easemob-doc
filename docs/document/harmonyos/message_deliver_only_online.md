# 消息仅投递在线用户

## 功能说明

环信即时通讯 IM 支持只将消息投递给在线用户。若接收方不在线，则无法收到消息。该功能适用于只需向在线用户展示实时变化的场景。例如，应用可以通过透传消息实时更新群投票票数；在线用户关注实时变化，离线用户再次上线后直接获取最终状态。

## 使用限制

- **适用会话类型**： 仅支持单聊和群聊，**不适用于聊天室**。
- **支持消息类型**：各类型消息均支持仅向在线用户投递。
- **离线存储限制**：**不支持离线存储**。若发送消息时接收方离线，则消息会被丢弃；接收方再次上线后也不会收到该消息。普通消息在接收方在线时实时送达；接收方离线时可以触发离线推送，并在其再次上线后由环信 IM 服务器下发离线期间的消息。
- **漫游存储限制：** 默认不支持漫游存储。仅向在线用户投递的消息默认不存储在环信消息服务器，用户无法在其他终端设备上获取该消息。**如需开通在线消息的漫游存储，请联系环信商务。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 仅向在线用户投递消息

发送消息前，调用 `ChatMessage#deliverOnlineOnly(true)`，将消息设置为仅向在线用户投递。该配置的默认值为 `false`，即无论接收方是否在线均正常投递；接收方离线时，消息将在其再次上线后投递。

下面以发送文本消息为例：

```typescript
// conversationId 为消息接收方：单聊时传对端用户 ID，群聊时传群组 ID。
// content 为消息文本内容。
let message = ChatMessage.createTextSendMessage(conversationId, content);
if (message) {
  // 设置为 true 后，消息只投递给在线用户；接收方离线时，服务器会丢弃该消息。
  message.deliverOnlineOnly(true);

  // 会话类型默认为单聊；发送群聊消息时设置为 ChatType.GroupChat。
  message.setChatType(ChatType.Chat);

  ChatClient.getInstance().chatManager()?.sendMessage(message);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#仅向在线用户投递消息) | `ChatMessage` | 创建待发送的文本消息。 |
| [`deliverOnlineOnly`](#仅向在线用户投递消息) | `ChatMessage` | 设置消息是否只投递给在线用户。 |
| [`sendMessage`](#仅向在线用户投递消息) | `ChatManager` | 发送消息。 |
