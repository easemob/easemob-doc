# Message Quotes

## Feature overview

Quoting a message means replying to a sent message and including a summary of the quoted message in the new message so that the recipient can understand the reply context.

Except for command messages, all successfully sent message types can carry quote information through the new message's extension fields. The SDK does not provide a dedicated API for creating quote messages, nor does it verify whether the quoted message exists, belongs to the current conversation, or was actually sent. The app passes quote information as custom fields in the new message's `ext`, so any string can be used as a message ID.

The app should validate that the quoted message ID belongs to the current conversation and save summary fields such as `msgPreview`, `msgSender`, and `msgType` in `ext`. This allows the quote to be displayed even if the original message has been deleted or is not loaded locally.

:::tip
`msgQuote` is a custom business field in the new message's `ext`. Keep it JSON-serializable with the other extension fields and within the overall message size limit.
:::

Examples of quote UI displays for different message types:

| Message type | Original message exists | Original message does not exist |
| :--- | :--- | :--- |
| Text message | ![img](/images/product/solution_common/message_reply/text_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/text_no_mobile.png) |
| Image message | ![img](/images/product/solution_common/message_reply/image_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/image_no_mobile.png) |
| Voice message | ![img](/images/product/solution_common/message_reply/voice_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/voice_no_mobile.png) |
| Video message | ![img](/images/product/solution_common/message_reply/video_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/video_no_mobile.png) |
| File message | ![img](/images/product/solution_common/message_reply/file_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/file_no_mobile.png) |
| Name card message | ![img](/images/product/solution_common/message_reply/card_no_mobile.png) | ![img](/images/product/solution_common/message_reply/card_normal_mobile.png) |
| Combined message | ![img](/images/product/solution_common/message_reply/combine_normal_mobile.png) | ![img](/images/product/solution_common/message_reply/combine_no_mobile.png) |

## Prerequisite

Before you start, make sure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- You can already send and receive messages.
- Understand the usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).

## Implementation process

Implement message quotes as follows:

1. Before sending a reply, retrieve key information from the original message and verify that it belongs to the current conversation.
2. Create an `EMChatMessage` and write the original message summary to the `msgQuote` field in its `ext`.
3. After receiving the new message, the recipient reads and parses `msgQuote` from `EMChatMessage#ext` and renders the quote area in the message list.
4. To support tapping the quote area to jump to the original message, locate the original message in the local message list by using `msgID` in `msgQuote`. If the original message has been deleted or is not loaded, display the summary as a fallback.

The app defines the `msgQuote` data structure. You can use the following structure as a reference:

```json
{
  "msgQuote": {
    "msgID": "Original message ID",
    "msgPreview": "Preview of the original message",
    "msgSender": "User ID of the original message sender",
    "msgType": "Original message type"
  }
}
```

The fields are described as follows:

- `msgID`: The ID of the quoted message recorded by the app. We recommend verifying that it belongs to the current conversation so that the original message can be located.
- `msgPreview`: A preview of the quoted message, used as a fallback when the original message cannot be found.
- `msgSender`: The user ID of the quoted message sender recorded by the app.
- `msgType`: The type of the quoted message recorded by the app, used to render the quote summary by type.

When displaying a quote in the message list, combine the information in `msgQuote` from `EMChatMessage#ext`, for example, `${msgSender}: ${msgPreview}`.

To support jumping to the original message, locate it in the local message list by `msgID`, scroll to its position, and highlight it. If the quoted message has been deleted or has not been loaded locally, display `msgPreview` or a prompt such as **The quoted content does not exist**.

### Send a quoted message

The following example replies to a text message with a quote:

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"Okay, got it!"];
NSDictionary *quote = @{
    @"msgID": @"original-message-id",
    @"msgPreview": @"Preview of the original message content",
    @"msgSender": @"user1",
    @"msgType": @"text"
};
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId
                                                                   body:body
                                                                    ext:@{@"msgQuote": quote}];

[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // Handle the send result.
}];
```

### Parse a received quoted message

After receiving a message, the recipient can check whether `EMChatMessage#ext` contains `msgQuote`. If it does, read and parse the quote information from `ext[@"msgQuote"]`, and then refresh the UI.

```objectivec
- (void)handleQuotedMessage:(EMChatMessage *)message {
    NSDictionary *quote = message.ext[@"msgQuote"];
    if (![quote isKindOfClass:[NSDictionary class]]) {
        return;
    }

    NSString *quotedMessageId = quote[@"msgID"];
    NSString *quotedPreview = quote[@"msgPreview"];
    NSString *quotedSender = quote[@"msgSender"];
    NSString *quotedType = quote[@"msgType"];
    // Update the UI with the quote information.
}

- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        [self handleQuotedMessage:message];
    }
}
```

Remove the message delegate when it is no longer needed:

```objectivec
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## FAQ

1. Q: Does the SDK provide a dedicated API for creating quote messages?
   A: No. Quote messages are currently implemented through the `msgQuote` extension field of a new message.

2. Q: How should a quote be displayed when the original message does not exist?
   A: Display the `msgPreview` content or **The quoted content does not exist**.

3. Q: What should I do if there are too many messages between the current message and the quoted message when jumping to the quoted message?
   A: Loading all messages between the two messages into the UI at once may consume considerable memory. We recommend setting a per-load threshold. Stop loading or do not perform the jump when the threshold is exceeded.

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`initWithConversationID`](#send-a-quoted-message) | `EMChatMessage` | Creates a message for replying to the original message. |
| [`ext`](#parse-a-received-quoted-message) | `EMChatMessage` | Retrieves message extension fields. |
| [`sendMessage`](#send-a-quoted-message) | `IEMChatManager` | Sends a message carrying quote information. |
