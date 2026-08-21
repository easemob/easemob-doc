# Message Reactions

## Feature overview

EasyIM provides message reactions (hereinafter referred to as “Reactions”). Users can add or remove reactions on messages in one-to-one and group chats. Reactions visually express emotions. In group chats, reaction counts can also support lightweight voting, feedback collection, and other interactions.

The following figure shows examples of adding a Reaction, how Reactions appear in a group chat, and viewing the Reaction list.

![img](/images/ios/reactions.png)

## Feature activation

Before using Reactions, activate the feature in [EasyIM Console](https://console.easemob.com/user/login). For instructions, see the [EasyIM Console documentation](/product/console/basic_message.html#消息表情回复).

## Limitations

 - Reactions apply only to one-to-one and group chats. Chat rooms are not currently supported.
 - For Reaction counting rules, storage duration, per-user addition limits, the number of Reactions allowed per message, and emoji ID requirements, see [Feature Limitations](limitation.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

1. Initialize the iOS SDK and log in. For details, see [Quickstart](quickstart.html).
2. Understand the EasyIM API [limitations](/product/limitation.html).
3. Activate the Reaction feature in [EasyIM Console](https://console.easemob.com/user/login).

## Add a Reaction to a message

Call `addReaction` to add a Reaction to a message.

For a one-to-one chat, the peer user receives the `messageReactionDidChange` callback. For a group chat, all chat group members except the operator receive the callback. The callback information includes the conversation ID, message ID, current Reaction list for the message, and Reaction operation list. The operation list records the operator's user ID, the changed Reaction, and the operation type. Your app can use this information to update the Reactions displayed on the message in real time.

The same user can add the same Reaction to a message only once. If the user adds it repeatedly, the SDK returns error code `1301`, or `EMErrorReactionHasBeenOperated`. Your app can handle this as “This Reaction has already been added.”

The following is sample code:

```objectivec
NSString *messageId = message.messageId;
NSString *reaction = @"👍";

[[EMClient sharedClient].chatManager addReaction:reaction
                                        toMessage:messageId
                                       completion:^(EMError *error) {
    if (!error) {
        // Added successfully.
    } else {
        // Failed to add.
    }
}];
```

## Remove a Reaction from a message

Call `removeReaction` to remove a Reaction that the current user added to a message.

After removal succeeds, the peer user in a one-to-one chat and all chat group members except the operator in a group chat receive the `messageReactionDidChange` callback. The callback information includes the conversation ID, message ID, current Reaction list for the message, and Reaction operation list. The operation list records the operator's user ID, the removed Reaction, and the operation type. Your app can use this information to update the Reactions displayed on the message in real time.

The party performing the removal can obtain the result through the completion and update the current UI after the operation succeeds.

The following is sample code:

```objectivec
NSString *messageId = message.messageId;
NSString *reaction = @"👍";

[[EMClient sharedClient].chatManager removeReaction:reaction
                                          fromMessage:messageId
                                          completion:^(EMError *error) {
    if (!error) {
        // Removed successfully.
    } else {
        // Failed to remove.
    }
}];
```

## Retrieve the Reaction list of a message

Call `getReactionList` to retrieve Reaction overviews for one or more specified messages from the server.

Each Reaction overview contains the Reaction content, the number of users who added the Reaction, whether the current user added the Reaction, and the user IDs of the first three users who added the Reaction. The user list is used only for the overview and does not represent all users. For messages that have been retrieved and cached, you can also use `reactionList` to read the Reaction list from the message. To retrieve the complete user list for a specified Reaction on a group message, call `getReactionDetail` to query it by page.

The following is sample code:

```objectivec
NSArray<NSString *> *messageIds = @[@"messageId1", @"messageId2"];

// For a one-to-one chat, pass EMChatTypeChat and nil for groupId. For a group chat, pass EMChatTypeGroupChat and the corresponding chat group ID.
[[EMClient sharedClient].chatManager getReactionList:messageIds
                                              groupId:nil
                                            chatType:EMChatTypeChat
                                          completion:^(NSDictionary<NSString *, NSArray<EMMessageReaction *> *> *result, EMError *error) {
    if (!error) {
        NSArray<EMMessageReaction *> *reactions = result[@"messageId1"];
        // reactions contains the Reaction overview list for the message.
    } else {
        // Failed to retrieve.
    }
}];
```

## Retrieve Reaction details

Call `getReactionDetail` to retrieve details of a specified Reaction on a specified **group message** from the server by page. The details include the Reaction content, the current number of users who added the Reaction, and the user ID list on the current page.

```objectivec
// For the first call, pass `nil` or `@""` for `cursor`. The SDK retrieves data in ascending order by Reaction creation time. The completion returns the cursor for the next page. A `nil` cursor indicates that all data has been retrieved.
// The value range of `pageSize` is `[1,100]`.
[[EMClient sharedClient].chatManager getReactionDetail:@"messageId"
                                              reaction:@"👍"
                                                cursor:nil
                                              pageSize:30
                                            completion:^(EMMessageReaction *reaction, NSString *cursor, EMError *error) {
    if (!error) {
        NSArray<NSString *> *userList = reaction.userList;
        // Use userList to display users on the current page. If cursor is not nil, you can continue querying by page.
    } else {
        // Failed to retrieve.
    }
}];
```

## Monitor Reaction updates

Implement `messageReactionDidChange` to receive Reaction updates for subscribed messages. Register the listener before use and remove it when it is no longer required to avoid duplicate callbacks and lifecycle issues.

```objectivec
@interface ReactionViewController () <EMChatManagerDelegate>
@end

@implementation ReactionViewController

- (void)startObserveReactions {
    [[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
}

- (void)stopObserveReactions {
    [[EMClient sharedClient].chatManager removeDelegate:self];
}

- (void)messageReactionDidChange:(NSArray<EMMessageReactionChange *> *)changes {
    for (EMMessageReactionChange *change in changes) {
        NSString *conversationId = change.conversationId;
        NSString *messageId = change.messageId;
        NSArray<EMMessageReaction *> *reactions = change.reactions;
        NSArray<EMMessageReactionOperation *> *operations = change.operations;
        // Update the UI based on conversationId, messageId, reactions, and operations.
    }
}

@end
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`addReaction`](#add-a-reaction-to-a-message) | `IEMChatManager` | Asynchronously adds a Reaction to a message. |
| [`removeReaction`](#remove-a-reaction-from-a-message) | `IEMChatManager` | Asynchronously removes a message Reaction added by the current user. |
| [`getReactionList`](#retrieve-the-reaction-list-of-a-message) | `IEMChatManager` | Asynchronously retrieves Reaction overviews for one or more messages. |
| [`getReactionDetail`](#retrieve-reaction-details) | `IEMChatManager` | Asynchronously retrieves details of a specified Reaction on a group message by page. |
| [`reactionList`](#retrieve-the-reaction-list-of-a-message) | `EMChatMessage` | Retrieves the cached Reaction list from the message object. |
| [`conversationId`](#monitor-reaction-updates) | `EMMessageReactionChange` | Retrieves the ID of the conversation to which the Reaction change belongs. |
| [`messageId`](#monitor-reaction-updates) | `EMMessageReactionChange` | Retrieves the ID of the message whose Reactions changed. |
| [`reactions`](#monitor-reaction-updates) | `EMMessageReactionChange` | Retrieves the updated Reaction list. |
| [`operations`](#monitor-reaction-updates) | `EMMessageReactionChange` | Retrieves details of the changed operations. |
| [`userId`](#monitor-reaction-updates) | `EMMessageReactionOperation` | Retrieves the user ID of the Reaction operator. |
| [`reaction`](#monitor-reaction-updates) / [`operate`](#monitor-reaction-updates) | `EMMessageReactionOperation` | Retrieves the changed Reaction and operation type. |
| [`reaction`](#retrieve-reaction-details) | `EMMessageReaction` | Retrieves the Reaction content. |
| [`count`](#retrieve-the-reaction-list-of-a-message) | `EMMessageReaction` | Retrieves the number of users who added the Reaction. |
| [`userList`](#retrieve-reaction-details) | `EMMessageReaction` | Retrieves the Reaction user list on the current page or in the overview. |
