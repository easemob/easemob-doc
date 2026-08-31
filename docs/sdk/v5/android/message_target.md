# Targeted Messages

## Feature overview

A targeted message is sent to one or more specified members of a chat group or chat room. Other members do not receive the message.

## Limitations

- **Supported message types:** This feature applies to text, image, voice, video, and other message types.
- **Recipient limit:** Each targeted message can specify up to 20 recipients in a chat group or chat room.
- **Conversation list and unread count:** Targeted messages are not written to the server-side conversation list or included in a server-side conversation's unread message count.
- **Group message roaming:** Roaming is not supported for targeted group messages by default. To use it, contact the EasyIM business manager.
- **Chat room message roaming:** Roaming is not supported for targeted chat room messages by default. To use it, contact the EasyIM business manager to enable both chat room message roaming and targeted message roaming.

## Send a targeted message

The process for sending a targeted message is similar to that for sending a regular message. The only difference is that you must call `EMMessage#setReceiverList` before sending to set the targeted recipient list:

1. Create a group or chat room message.
2. Set the message recipient list.
3. Send the targeted message.

The following example shows how to send a targeted text message:

```java
// Create a group text message.
EMMessage message = EMMessage.createTextSendMessage(
        "Only specified members can see this message",
        groupId);

// Set the chat type to GroupChat for group chat or ChatRoom for a chat room.
message.setChatType(EMMessage.ChatType.GroupChat);

List<String> receivers = new ArrayList<>();
receivers.add("user1");
receivers.add("user2");

// Set the targeted recipient list. You can pass the user IDs of up to 20 members.
// If null is passed, the message is sent to all members of the chat group or chat room.
message.setReceiverList(receivers);

EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

Receiving a targeted message is the same as receiving a regular message. See [Receive Messages](message_receive.html).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#send-a-targeted-message) | `EMMessage` | Create a text message. |
| [`sendMessage`](#send-a-targeted-message) | `EMChatManager` | Send a targeted message. |
