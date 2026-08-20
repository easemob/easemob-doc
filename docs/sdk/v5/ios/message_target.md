# Targeted Messages

## Feature overview

A targeted message is sent to one or more specified members in a chat group or chat room. Other members do not receive the message.

## Usage limits

- **Supported message types:** Text, image, voice, video, and other message types.
- **Recipient limit:** Each targeted message can specify at most 20 members in a chat group or chat room.
- **Conversation list and unread count:** Targeted messages are not written to the server-side conversation list and are not included in the unread message count of server-side conversations.
- **Chat group message roaming:** Roaming is not supported for targeted chat group messages by default. To use it, contact the Easemob business team to enable it.
- **Chat room message roaming:** Roaming is not supported for targeted chat room messages by default. To use it, contact the Easemob business team to enable both chat room message roaming and targeted message roaming.

## Send a targeted message

Sending a targeted message is similar to sending a regular message. The only difference is that you must set the recipients through `receiverList` before sending. The steps are as follows:

1. Create a chat group or chat room message.
2. Set the message's recipient list.
3. Send the targeted message.

The following example sends a text message:

```objectivec
// Create a text message.
EMTextMessageBody *textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"groupId" body:textBody ext:nil];
// Conversation type: EMChatTypeGroupChat for a group chat and EMChatTypeChatRoom for a chat room.
message.chatType = EMChatTypeGroupChat;
// Set the recipient list. You can pass at most 20 recipient user IDs. Pass nil to send the message to all members.
message.receiverList = @[@"A", @"B"];

[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // Handle the send result.
}];
```

Receiving a targeted message is the same as receiving a regular message. For details, see [Receive text messages](message_receive.html#receive-text-messages).

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`initWithConversationID`](#send-a-targeted-message) | `EMChatMessage` | Creates a message. |
| [`chatType`](#send-a-targeted-message) | `EMChatMessage` | Sets the conversation type to a group chat or chat room. |
| [`receiverList`](#send-a-targeted-message) | `EMChatMessage` | Sets the recipient list for a targeted message. |
| [`sendMessage`](#send-a-targeted-message) | `IEMChatManager` | Sends a targeted message. |
