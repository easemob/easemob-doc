# Deliver Messages Only to Online Users

## Feature overview

EasyIM supports delivering messages only to online users. If the recipient is offline, they cannot receive the message. This feature is useful when an app needs to display information only to online users, such as using command messages to update group poll counts in real time. Only online users need to follow the real-time changes; offline users can retrieve the final state after they get online again.

## Usage limits

- **Applicable conversation types:** Supported only in one-to-one chats and chat groups, and **not supported in chat rooms**.
- **Supported message types:** All message types support this feature and are delivered only to online users.
- **Offline storage:** **Offline storage is not supported.** If the recipient is offline when a message is sent, they cannot receive it, even after logging in again. Regular messages are delivered in real time when the recipient is online. When the recipient is offline, offline push is triggered, and the EasyIM server delivers messages accumulated during the offline period after the recipient gets online again.
- **Roaming storage:** Roaming storage is not supported by default. Sent messages are not stored on the EasyIM message server by default, so users cannot retrieve them on another device. **To enable roaming storage for online-only messages, contact the Easemob business team.**

## Prerequisite

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).

## Deliver messages only to online users

To deliver a message only to online users, set `deliverOnlineOnly` to `YES` when sending the message. The server does not deliver the message when the recipient is offline.

The following example sends a text message:

```objectivec
// Call initWithText to create a text message. `content` is the text message content.
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];
// Message recipient: The user ID of the other party in a one-to-one chat, or the chat group ID in a group chat.
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
// Conversation type: `EMChatTypeChat` for a one-to-one chat and `EMChatTypeGroupChat` for a group chat.
message.chatType = EMChatTypeChat;
// Whether to deliver the message only to online users. (Default) `NO`: Deliver regardless of the user's online status. `YES`: Deliver only to online users. The message is not delivered if the user is offline.
message.deliverOnlineOnly = YES;
// Send the message.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`deliverOnlineOnly`](#deliver-messages-only-to-online-users) | `EMChatMessage` | Sets whether to deliver the message only to online users. |
| [`sendMessage`](#deliver-messages-only-to-online-users) | `IEMChatManager` | Sends a message. |
