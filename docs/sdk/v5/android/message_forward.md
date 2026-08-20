# Forward Messages

## Feature overview

Forwarding a message means sending a successfully sent or received message in the current conversation to another conversation. For example, after user A sends a message to user B, user B can forward it to user C, a chat group, or a chat room.

The EasyIM Android SDK supports the following forwarding methods:

- **Forward a single message**: Create a new message based on the original message object, reuse the original message body and extensions, and send it to a target one-to-one chat, group chat, chat room, or message thread. This method supports text, image, voice, video, file, location, command, custom, combined, and other message types.
- **Forward multiple messages**: Combine multiple messages into a combined message and send it to the target conversation. The recipient can expand the combined message to view its contents. See [Send combined messages](message_send.html#send-combined-messages).

Forwarding creates and sends a new message with its own message ID, sender, recipient, and sending time. It does not change the original message or its conversation data. For an attachment message, the SDK can reuse the server-side attachment URL in the original message without uploading the attachment again. If the original attachment has been deleted from the server after its storage period expires, the recipient cannot download it.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Quickstart](quickstart.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Forward a single message

To forward a single message, create a new message of the same type as the original and call `EMMessage#setBody` to set the original message body. To retain the original message's extensions, call `EMMessage#setAttribute` to copy each supported extension type to the new message. After setting the target conversation and conversation type, call `EMChatManager#sendMessage` to send the new message.

A single message can be forwarded to a one-to-one chat, group chat, chat room, or message thread. Text, image, audio, video, file, location, custom, combined, and other message types are supported.

When forwarding an attachment message, the SDK can reuse the server-side attachment URL in the original message without uploading the attachment again. If the attachment has been deleted from the server after its storage period expires, the forwarded message can still contain the original attachment URL, but the recipient cannot download the attachment.

:::tip 
A combined message can also be forwarded directly as a single message. 
:::

```java
// messageId is the ID of the message to forward.
String messageId = "messageId";
EMMessage targetMessage = EMClient.getInstance()
        .chatManager()
        .getMessage(messageId);

if (targetMessage == null) {
    return;
}

// Pass the peer user ID for one-to-one chat, group ID for group chat, or chat room ID for a chat room.
String to = "conversationId";

// Create a new message of the same type as the original message.
EMMessage newMessage = EMMessage.createSendMessage(
        targetMessage.getType());
newMessage.setTo(to);

// The default is one-to-one chat. For a group chat or chat room, set the type to GroupChat or ChatRoom, respectively.
newMessage.setChatType(EMMessage.ChatType.GroupChat);

// To forward to a message thread, set to to the thread ID and mark the message as a thread message.
// newMessage.setIsChatThreadMessage(true);

// Reuse the original message body.
EMMessageBody targetMessageBody = targetMessage.getBody();
newMessage.setBody(targetMessageBody);

// Copy extension fields of SDK-supported types from the original message to the new message.
Map<String, Object> ext = targetMessage.ext();
if (ext != null) {
    for (Map.Entry<String, Object> entry : ext.entrySet()) {
        String key = entry.getKey();
        Object value = entry.getValue();

        if (value instanceof Long) {
            newMessage.setAttribute(key, (Long) value);
        } else if (value instanceof Integer) {
            newMessage.setAttribute(key, (Integer) value);
        } else if (value instanceof String) {
            newMessage.setAttribute(key, (String) value);
        } else if (value instanceof Boolean) {
            newMessage.setAttribute(key, (Boolean) value);
        } else if (value instanceof Double) {
            newMessage.setAttribute(key, (Double) value);
        } else if (value instanceof Float) {
            newMessage.setAttribute(key, (Float) value);
        } else if (value instanceof JSONArray) {
            newMessage.setAttribute(key, (JSONArray) value);
        } else if (value instanceof JSONObject) {
            newMessage.setAttribute(key, (JSONObject) value);
        }
    }
}

EMClient.getInstance()
        .chatManager()
        .sendMessage(newMessage);
```

## Forward multiple messages

To forward multiple messages, EasyIM supports combining them into a single combined message. See [Send combined messages](message_send.html#send-combined-messages).

## Considerations

- A forwarded message is a new message. It has its own message ID, sender, recipient, and sending time and does not change the original message or its conversation data.
- When the SDK receives a single forwarded message, it still returns a standard `EMMessage` object and does not automatically indicate that the message was forwarded. To distinguish regular and forwarded messages, add a custom marker through `ext` when forwarding and parse it on receipt.
- Forwarding a single message recreates and sends a message. Although the new message usually reuses the original message body and extensions, its metadata has changed and it must not be treated as the original message itself.
- When forwarding an attachment message, the SDK can reuse the server-side attachment URL in the original message without uploading the attachment again. If the original attachment has been deleted from the server after its storage period expires, the recipient may still receive the forwarded message but cannot download the corresponding attachment.
- A received combined message has the message type `EMMessage.Type.COMBINE`. To view the messages it contains, call `EMChatManager#downloadAndParseCombineMessage` to download and parse it.
- If a message is forwarded to a message thread, call `EMMessage#isChatThreadMessage()` to determine whether it is a thread message. To further obtain its conversation ID and conversation type, call `EMMessage#conversationId()` and `EMMessage#getChatType()`.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getMessage`](#forward-a-single-message) | `EMChatManager` | Retrieve a local message by message ID. |
| [`createSendMessage`](#forward-a-single-message) | `EMMessage` | Create a message of a specified type to send. |
| [`ext`](#forward-a-single-message) | `EMMessage` | Retrieve the original message's extensions. |
| [`sendMessage`](#forward-a-single-message) | `EMChatManager` | Send a forwarded message. |
