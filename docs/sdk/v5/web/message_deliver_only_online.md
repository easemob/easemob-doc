# Deliver Messages to Online Users Only

## Feature overview

EasyIM supports delivering messages only to online users. If a recipient is offline, the recipient cannot receive the message. This feature is intended for scenarios in which an app needs to display information only to online users. For example, command messages can be used to show real-time changes in group voting results. Only online users need to see the changes in real time, while offline users can retrieve the final state when they get online again.

## Limitations

- **Applicable conversation types**: Only one-to-one chats and group chats are supported. **Chat rooms are not supported**.
- **Supported message types:** All message types support delivery to online users only.
- **Offline storage limitation:** **Offline storage is not supported.** If a recipient is offline when the message is sent, the recipient cannot receive it, even after logging in again. Regular messages are delivered in real time when the recipient is online. When the recipient is offline, an offline push notification is triggered, and the EasyIM server delivers messages sent during the offline period after the recipient gets online again.
- **Roaming storage limitation:** Roaming storage is not supported by default. By default, sent messages are not stored on the EasyIM server, so users cannot retrieve them on other devices. **To enable roaming storage for online-only messages, contact the EasyIM business manager.**

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Register `ChatManager` during SDK initialization so that you can call message APIs through `client.chatManager`.
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Deliver messages to online users only

To deliver a message only to online users, set `deliverOnlineOnly: true` when creating the message, or set `message.deliverOnlineOnly` to `true` before sending it.

The following example sends a text message:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: '这条消息只有在线才能收到',
  deliverOnlineOnly: true,
});

await client.chatManager.sendMessage(message);
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextMessage`](#deliver-messages-to-online-users-only) | `ChatManager` | Creates a text message. |
| [`sendMessage`](#deliver-messages-to-online-users-only) | `ChatManager` | Sends a message. |
