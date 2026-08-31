# Forward Messages

## Feature overview

Forwarding a message means forwarding a successfully sent or received message from the current conversation to another conversation. For example, after user A sends a message to user B, user B can forward it to user C, a chat group, or a chat room.

The EasyIM iOS SDK supports the following forwarding methods:

- **Forward a single message:** Create a new message from the original message object, reuse the original message body and extension fields, and send it to a target one-to-one chat, group chat, chat room, or message thread. This method supports text, image, audio, video, file, location, command, custom, and combined messages.
- **Forward multiple messages:** Combine multiple messages into one combined message and send it to the target conversation. The recipient can expand the combined message to view its contents. For details, see [Send combined messages](message_send.html#send-combined-messages).

Forwarding creates and sends a new message. The new message has its own message ID, sender, recipient, and send time and does not change the original message or its conversation. For attachment messages, the SDK can reuse the server-side attachment URL in the original message and does not need to upload the attachment again. If the original attachment has been deleted from the server because its storage period expired, the recipient cannot download it.

## Prerequisite

Before you start, make sure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).

## Forward a single message

To forward a single message, create a new message of the same type as the original and reuse its `body` and `ext`. After setting the target conversation and conversation type, call `sendMessage` to send the new message.

A single message can be forwarded to a one-to-one chat, group chat, chat room, or message thread. Supported types include text, image, audio, video, file, location, custom, and combined messages.

When forwarding an attachment message, the SDK can reuse the original server-side attachment URL and does not need to upload the attachment again. If the attachment has been deleted from the server because its storage period expired, the forwarded message can still contain the original URL, but the recipient cannot download the attachment.

:::tip
A combined message can also be forwarded directly as a single message.
:::

```objectivec
// messageId is the local message ID to forward.
NSString *messageId = @"messageId";
EMChatMessage *sourceMessage = [[EMClient sharedClient].chatManager getMessageWithMessageId:messageId];
if (!sourceMessage) {
    return;
}

// Pass the other party's user ID for a one-to-one chat, the chat group ID for a group chat, or the chat room ID for a chat room.
NSString *conversationId = @"conversationId";

// Create a new message with the original message's body and ext. The new message has an independent message ID.
EMChatMessage *forwardMessage = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                                          body:sourceMessage.body
                                                                           ext:sourceMessage.ext];

// One-to-one chat by default. Set this to EMChatTypeGroupChat or EMChatTypeChatRoom when forwarding to a group chat or chat room.
forwardMessage.chatType = EMChatTypeGroupChat;

// When forwarding to a message thread, set the conversation ID to the thread ID and mark it as a thread message.
// forwardMessage.isChatThreadMessage = YES;

// Send the forwarded message.
[[EMClient sharedClient].chatManager sendMessage:forwardMessage
                                        progress:nil
                                      completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        // Forwarding succeeded.
    }
}];
```

## Forward multiple messages

For multiple messages, EasyIM supports combining them into one message before forwarding. For details, see [Send combined messages](message_send.html#send-combined-messages).

## Notes

- A forwarded message is essentially a new message. The new message has its own message ID, sender, recipient, and send time and does not change the original message or its conversation.
- When the iOS SDK receives a forwarded message, it still returns a standard `EMChatMessage` object and does not automatically mark whether the message was forwarded. If the app needs to distinguish regular and forwarded messages, add a custom marker field through `ext` when forwarding and parse it when receiving.
- For a single forwarded message, the recipient receives a newly created and sent message. Although the message body is usually the same as the original, its metadata has changed, so it should not be treated as the original message itself.
- For attachment messages, forwarding usually reuses the original server-side attachment URL and does not require another upload. If the original attachment has expired and been deleted by the server, the recipient may still receive the forwarded message but cannot download the attachment.
- For a combined message, the recipient first receives an `EMChatMessage` whose body type is `EMMessageBodyTypeCombine`. To view the original messages it contains, call `downloadAndParseCombineMessage:completion:` to download and parse the combined message.
- If a message is forwarded to a message thread, use the `isChatThreadMessage`, `conversationId`, and `chatType` properties of `EMChatMessage` to determine whether it belongs to a message thread and identify the corresponding conversation.

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`getMessageWithMessageId`](#forward-a-single-message) | `IEMChatManager` | Retrieves a local message by message ID. |
| [`initWithConversationID`](#forward-a-single-message) | `EMChatMessage` | Creates a message to send with the same type as the original. |
| [`ext`](#forward-a-single-message) | `EMChatMessage` | Retrieves the original message's extension fields. |
| [`chatType`](#forward-a-single-message) | `EMChatMessage` | Sets the conversation type of the new message. |
| [`sendMessage`](#forward-a-single-message) | `IEMChatManager` | Sends a forwarded message. |
