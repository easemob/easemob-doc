# Message Extensions

## Feature overview

When built-in message fields cannot meet an app's needs, you can use message extension fields to carry custom business data, such as information about a replied-to message, data for displaying rich messages, or business identifiers.

The iOS SDK uses `EMChatMessage#ext` to set and retrieve message extension fields. `ext` is of type `NSDictionary *`. Keys should be of type `NSString *`, and values can be of type `NSString *` or `NSNumber *`, so you can store Boolean, integer, floating-point, and other numeric values.

After receiving a message, the recipient can use `message.ext` to retrieve all extension fields and read the corresponding key values according to the app's agreement.

## Example code

```objectivec
// Create a text message body. content is the text to send.
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];

// Set message extension fields. The key is an NSString, and the value can be an NSString or NSNumber.
NSDictionary *messageExt = @{ @"attribute": @"value" };

// Create a message and pass the extension fields in the ext parameter.
// toChatUsername is the other party's user ID in a one-to-one chat. For a group chat or chat room, pass the corresponding ID.
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername
                                                                   body:body
                                                                    ext:messageExt];

// Set the conversation type: EMChatTypeChat for a one-to-one chat, EMChatTypeGroupChat for a group chat, and EMChatTypeChatRoom for a chat room.
message.chatType = EMChatTypeChat;

// Send a message carrying extension fields.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];

// Read extension fields when receiving messages.
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        // Retrieve the extension field value for the key agreed on by the app.
        NSString *value = message.ext[@"attribute"];
    }
}
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`ext`](#example-code) | `EMChatMessage` | Sets or retrieves message extension fields. |
| [`sendMessage`](#example-code) | `IEMChatManager` | Sends a message carrying extension fields. |
