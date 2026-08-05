# 消息仅投递在线用户

## 功能说明

环信即时通讯 IM 支持只将消息投递给在线用户。若接收方不在线，则无法收到消息。该功能用于实现应用只需要向在线用户进行展示目的，例如，利用透传消息实现群投票的票数实时变化, 只有在线用户需要关注实时变化的动态, 离线用户只需要再次上线时获取最终状态。

## 使用限制

- **适用会话类型**： 仅支持单聊和群组聊天，**不适用于聊天室**。
- **支持消息类型：** 各类型的消息均支持该功能，仅投递给在线用户。
- **离线存储限制：** **不支持离线存储。** 若发送消息时接收方离线，则无法收到消息；即使重新登录后，也不会收到该消息。普通消息在接收方在线时实时送达；接收方离线时会触发离线推送，并在再次上线后由环信 IM 服务器下发离线期间的消息。
- **漫游存储限制：** 默认不支持漫游存储。发送的消息默认不存储在环信消息服务器，用户无法在其他终端设备获取该消息。**如需开通在线消息的漫游存储，需联系环信商务。**

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 仅向在线用户投递消息

要将消息只投递给在线用户，你需要发送消息时将 `EMMessage#deliverOnlineOnly` 设置为 `true`。

下面以发送文本消息为例进行说明：

```java
// 创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊时为对端用户 ID、群聊时为群组 ID。
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
// 设置为 true 时，消息只投递给在线用户；若接收方离线，服务器会丢弃该消息。
// 默认值为 false：不论用户是否在线均投递。接收方离线时，消息会在其再次上线后投递。
message.deliverOnlineOnly(true);
// 会话类型：单聊为 EMMessage.ChatType.Chat，群聊为 EMMessage.ChatType.GroupChat，默认为单聊。
message.setChatType(EMMessage.ChatType.Chat);
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#仅向在线用户投递消息) | `EMMessage` | 创建待发送的文本消息。 |
| [`deliverOnlineOnly`](#仅向在线用户投递消息) | `EMMessage` | 设置消息是否只投递给在线用户。 |
| [`sendMessage`](#仅向在线用户投递消息) | `EMChatManager` | 发送消息。 |

