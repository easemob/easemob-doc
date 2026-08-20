# Edit Messages

## Feature overview

EasyIM provides message editing. Users can modify messages that were sent successfully, and the server-side and locally stored messages are updated synchronously without sending another message.

### Supported scope

This feature applies to one-to-one chats, group chats, and chat rooms:

- Text and custom messages: You can modify the message body `body` and extension fields `ext`.
- File, video, audio, image, location, and combined forwarded messages: You can modify only `ext`; the message body cannot be modified.
- Command messages: Editing is not supported.

### Message editing process

1. The app calls the message editing API and passes the message to edit and the modified content.
2. The SDK sends the edit request to the server. After the server updates the message, it returns the edited message to the SDK.
3. The SDK updates the corresponding message in the local database and returns the edited message to the app through the completion callback.
4. After other members in the conversation receive the message edit event, they can obtain the edited message through the chat manager delegate and update the UI.

### Message editing permissions by conversation type

- In a one-to-one conversation, only the message sender can edit the message.
- In a group chat or chat room, regular members can edit only their own messages. The group owner, chat room owner, and admins can edit their own messages and messages sent by regular members. In this case, the sender remains unchanged, while the editor's user ID is recorded in the message body.

### Message lifecycle after editing

Message editing has no time limit: a message can be edited as long as it is still stored on the server. After a message is edited, its lifecycle (the time it is retained on the server) is recalculated. For example, if a message can be stored on the server for 180 days and the user edits it on day 30, when 150 days remain, the message can be stored for another 180 days after the edit succeeds.

## Feature activation

Contact the Easemob business team to enable this feature.

## Prerequisite

Before you start, make sure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html) and [Initialization](initialization.html).
- Understand the API usage limits of EasyIM. For details, see [Usage limits](/product/limitation.html).
- Contact the Easemob business team to enable message editing.

## Edit a message

Call `modifyMessage` to edit a successfully sent message. This method updates the server-side and local messages at the same time; the message ID does not change. In addition to the changed content, the edited message body contains the last editor's user ID, edit time, and edit count. Except for the message body and extension fields `ext`, information such as the message ID, sender, and recipient does not change.

`body` and `ext` cannot both be `nil`. When a non-`nil` `ext` is passed, the new extension fields overwrite all extension fields in the original message. To retain the original extension fields, merge them into a new `NSDictionary` before passing it.

In the iOS SDK, `ext` is of type `NSDictionary *`. Keys should be `NSString *`, and values can be `NSString *` or `NSNumber *`, the latter of which can represent Boolean, integer, and floating-point values.

:::tip
A message can be edited up to 10 times by default.
:::

```objectivec
    // Text message: Modify the message body and extension fields.
    EMTextMessageBody* newMessageBody = [[EMTextMessageBody alloc] initWithText:@"new  content"];
    NSDictionary* newExt = @{ @"newKey": @"newValue" };
    // textBody and ext cannot both be nil.
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:newMessageBody ext:newExt completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
    
    // Custom message: Modify the message body and extension fields.
    EMCustomMessageBody* newCustomMessageBody = [[EMCustomMessageBody alloc] initWithEvent:@"event" customExt:@{@"key": @"value"}];
    NSDictionary* newExt1 = @{ @"newKey": @"newValue" };
    // customBody and ext cannot both be nil.
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:newCustomMessageBody ext:newExt1 completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
    
    // File/video/audio/image/location/combined forwarded message: Modify only the message extension fields.
    NSDictionary* newExt2 = @{ @"newKey": @"newValue" };
    // ext cannot be nil, and body must be nil.
    [EMClient.sharedClient.chatManager modifyMessage:@"messageId" body:nil ext:newExt2 completion:^(EMError * _Nullable error, EMChatMessage * _Nullable message) {
            
    }];
```

After a message is edited, the recipient and the current account's other online devices receive the `onMessageContentChanged` callback. The callback carries the edited message, the user ID of the last editor, and the latest edit time. In group chats and chat rooms, all other members except the user who performed the edit receive the callback.

:::tip
If a custom message is edited through the [RESTful API](/document/server-side/message_modify.html), the recipient also receives the edited custom message through the `onMessageContentChanged` callback.
:::

```objectivec
// Add the delegate.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];

// Implement the callback.
- (void)onMessageContentChanged:(EMChatMessage *)message operatorId:(NSString *)operatorId operationTime:(NSUInteger)operationTime {
    // New message body.
    EMMessageBody* newBody = message.body;
    // New ext.
    NSDictionary* newExt = message.ext;
    // Edit count.
    NSInteger operatorCount = message.body.operatorCount;
}
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`modifyMessage`](#edit-a-message) | `IEMChatManager` | Edits a server-side and local message. |
