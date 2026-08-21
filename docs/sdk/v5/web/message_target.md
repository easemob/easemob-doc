# Targeted Messages

## Feature overview

A targeted message is sent to one or more specified members of a chat group or chat room. Other members do not receive the message.

## Limitations

- **Supported message types:** Targeted messages support text, image, voice, video, and other message types.
- **Recipient limit:** Each targeted message can specify up to 20 recipients in a chat group or chat room.
- **Conversation list and unread count:** Targeted messages are not written to the server-side conversation list or included in the unread message count of a server-side conversation.
- **Group message roaming:** Roaming is not supported for targeted group messages by default. To enable it, contact the EasyIM business manager.
- **Chat room message roaming:** Roaming is not supported for targeted chat room messages by default. To enable it, contact the EasyIM business manager to activate both chat room message roaming and targeted message roaming.

## Send a targeted message

Sending a targeted message is similar to sending a regular message, except that you must set the targeted recipient list `receiverList` when creating the message.

The following example sends a text message:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'group1',
  // Conversation type: `groupChat` for a group chat and `chatRoom` for a chat room.
  conversationType: 'groupChat',
  content: '这条消息只有指定的人能看到',
  // Recipient list for the message. You can pass up to 20 recipient user IDs. If this field is omitted or a value other than an array, such as a string, is passed, the message is sent to all members of the chat group or chat room.
  receiverList: ['user1', 'user2', 'user3'],
});

await client.chatManager.sendMessage(message);
```

The `receiverList` parameter is described as follows:

- `receiverList` is a message creation parameter, not a callback option of `sendMessage`.
- `receiverList` must be a non-empty array of strings. If omitted, a regular group message is sent.

Receiving a targeted message is the same as receiving a regular message. For details, see [Receive messages of various types](message_receive.html).


## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| `createTextMessage` | `ChatManager` | Creates a targeted message. |
