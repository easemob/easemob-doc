# Deliver Messages to Online Users Only

## Feature overview

EasyIM supports delivering messages only to online users. If a recipient is offline, the recipient cannot receive the message. This feature is intended for scenarios in which your app needs to display information only to online users. For example, command messages can be used to show real-time changes in group poll results. Only online users need to follow the changes, while offline users need only retrieve the final state when they get online again.

## Limitations

- **Applicable conversation types**: This feature supports only one-to-one and group chats. It **does not apply to chat rooms**.
- **Supported message types:** All message types support this feature and can be delivered only to online users.
- **Offline storage limitation:** **Offline storage is not supported.** If the recipient is offline when the message is sent, the recipient cannot receive it, even after logging in again. A regular message is delivered in real time when the recipient is online. When the recipient is offline, an offline push notification is triggered, and the EasyIM server delivers messages sent during the offline period after the recipient gets online again.
- **Roaming storage limitation:** Roaming storage is not supported by default. By default, sent messages are not stored on the EasyIM message server, so users cannot retrieve them on other devices. **To enable roaming storage for online-only messages, contact the Easemob business team.**

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Deliver messages to online users only

To deliver a message only to online users, set `EMMessage#deliverOnlineOnly` to `true` when sending the message.

The following example uses a text message:

```java
// Create a text message. `content` is the message text.
// `conversationId` is the recipient: the peer user ID for one-to-one chat or the group ID for group chat.
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
// When set to true, the message is delivered only to online users. If the recipient is offline, the server discards the message.
// The default value is false: The message is delivered regardless of whether the recipient is online. If the recipient is offline, the message is delivered after the recipient gets online again.
message.deliverOnlineOnly(true);
// Conversation type: EMMessage.ChatType.Chat for one-to-one chat or EMMessage.ChatType.GroupChat for group chat. The default is one-to-one chat.
message.setChatType(EMMessage.ChatType.Chat);
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#deliver-messages-to-online-users-only) | `EMMessage` | Create a text message to send. |
| [`deliverOnlineOnly`](#deliver-messages-to-online-users-only) | `EMMessage` | Set whether to deliver the message only to online users. |
| [`sendMessage`](#deliver-messages-to-online-users-only) | `EMChatManager` | Send a message. |

