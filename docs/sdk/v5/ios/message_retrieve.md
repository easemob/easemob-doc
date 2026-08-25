# Retrieve Historical Messages

## Feature overview

EasyIM provides message roaming, which stores historical messages from all of a user's conversations on the message server. Users can retrieve historical messages on any device and maintain a consistent conversation experience when switching between devices.

The SDK uses SQLite internally to store local messages, which you can retrieve. This document describes how the EasyIM SDK retrieves historical messages from the server and locally.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Retrieve messages in a specified conversation from the server

You can call `fetchMessagesFromServerBy` to retrieve historical messages from one-to-one chats, group chats, and chat rooms for which the service has been enabled from the server by page based on `EMFetchServerMessagesOption`. We recommend retrieving 20 messages per page, with a maximum of 50. When the number of returned messages is less than `pageSize`, there are no more messages.

Through `EMFetchServerMessagesOption`, you can set the message sender, message type, time range, search direction, and whether to save messages to the local database. For group chats, you can set `fromIds` to retrieve historical messages sent by one or more specified members of the group.
If `EMOptions#regardImportMessagesAsRead` is enabled during initialization, messages imported [through the server-side API](/document/server-side/message_import_single.html) are marked as read after they are retrieved, and the conversation's `unreadMessagesCount` does not increase. If this setting is disabled, the count increases.

:::tip
1. **By default, you can retrieve historical messages from one-to-one and group chats. To retrieve chat room historical messages, contact the EasyIM business manager.**
2. When retrieving one-to-one historical messages, the feature for reading the delivery and read states stored on the server is disabled by default. To use it, contact the EasyIM business manager.
3. The server-side retention period for historical messages depends on the product plan. See [EasyIM Plan Features](/product/product_package_feature.html).
:::

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room. |
| `conversationType` | `EMConversationType` | Conversation type. |
| `cursor` | `NSString *` | Pagination cursor. Pass an empty string for the first call and the `cursor` returned by the previous call for subsequent calls. |
| `pageSize` | `NSUInteger` | The number of messages to retrieve per page. The value range is `[1, 50]`. |
| `option` | `EMFetchServerMessagesOption *` | Server-side historical message retrieval options. |

```objectivec
EMFetchServerMessagesOption *option = [EMFetchServerMessagesOption new];
option.isSave = YES;
option.direction = EMMessageSearchDirectionDown;

[[EMClient sharedClient].chatManager fetchMessagesFromServerBy:conversationId
                                               conversationType:EMConversationTypeChat
                                                         cursor:@""
                                                       pageSize:20
                                                         option:option
                                                     completion:^(EMCursorResult<EMChatMessage *> *result, EMError *error) {
    if (!error) {
        // result.list contains the messages on the current page. result.cursor is used to retrieve the next page.
    }
}];
```

## Retrieve messages sent by specified group members from the server

For a single group conversation, you can retrieve messages sent by specified members, rather than all members, from the server. Set `fromIds` to the user ID list of the target members.

The parameters are described below:

| Parameter | Type | Description |
| ------------------ | ----------------------------------- | ----------------------------------------------------------- |
| `conversationId` | `NSString *` | Pass the group ID for group chat. |
| `conversationType` | `EMConversationType` | Conversation type. Set it to `EMConversationTypeGroupChat` here. |
| `cursor` | `NSString *` | Pagination cursor. Pass an empty string for the first call and the `cursor` returned by the previous call for subsequent calls. |
| `pageSize` | `NSUInteger` | The number of messages to retrieve per page. The value range is `[1, 50]`. |
| `option` | `EMFetchServerMessagesOption *` | Server-side historical message retrieval options. |
| `option.isSave` | `BOOL` | Whether to save the retrieved messages to the local database. |
| `option.direction` | `EMMessageSearchDirection` | Search direction. - `EMMessageSearchDirectionUp`: Retrieve messages in reverse chronological order by message timestamp. - `EMMessageSearchDirectionDown`: Retrieve messages in chronological order by message timestamp. |
| `option.fromIds` | `NSArray<NSString *> *` | The user ID list of the group members whose messages you want to retrieve. |
| `messages` | `NSMutableArray<EMChatMessage *> *` | The array used by the business logic to accumulate the results retrieved from each page. |

```objectivec
// Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room.
NSString *conversationId = @"groupId";
EMConversationType conversationType = EMConversationTypeGroupChat;

EMFetchServerMessagesOption *option = [[EMFetchServerMessagesOption alloc] init];

// Optional: Save the retrieved messages to the local database.
option.isSave = YES;

// Optional: Retrieve messages in chronological order.
option.direction = EMMessageSearchDirectionDown;

// Optional: Retrieve messages sent by specified members of the group.
option.fromIds = @[@"user1", @"user2"];

NSInteger pageSize = 40;
NSMutableArray<EMChatMessage *> *messages = [NSMutableArray array];

[self fetchHistoryMessagesWithConversationId:conversationId
                            conversationType:conversationType
                                      cursor:@""
                                    pageSize:pageSize
                                      option:option
                                    messages:messages];

- (void)fetchHistoryMessagesWithConversationId:(NSString *)conversationId
                              conversationType:(EMConversationType)conversationType
                                        cursor:(NSString *)cursor
                                      pageSize:(NSInteger)pageSize
                                        option:(EMFetchServerMessagesOption *)option
                                      messages:(NSMutableArray<EMChatMessage *> *)messages {
    [[EMClient sharedClient].chatManager fetchMessagesFromServerBy:conversationId
                                                  conversationType:conversationType
                                                            cursor:cursor
                                                          pageSize:pageSize
                                                            option:option
                                                        completion:^(EMCursorResult<EMChatMessage *> *result, EMError *error) {
        if (error) {
            // Failed to retrieve the messages.
            return;
        }

        // Add the messages on the current page.
        if (result.list.count > 0) {
            [messages addObjectsFromArray:result.list];
        }

        // An empty string or nil cursor indicates that there are no more messages.
        NSString *nextCursor = result.cursor;
        if (nextCursor.length > 0) {
            [self fetchHistoryMessagesWithConversationId:conversationId
                                        conversationType:conversationType
                                                  cursor:nextCursor
                                                pageSize:pageSize
                                                  option:option
                                                messages:messages];
        }
    }];
}
```

## Retrieve messages in local conversations by keyword

You can retrieve certain messages in conversations from the local database by keyword. The SDK returns a mapping between conversation IDs and message ID lists. Message IDs are listed in chronological or reverse chronological order by message timestamp based on `searchDirection`.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `keyword` | `NSString *` | The keyword to search. |
| `timestamp` | `long long` | The search start timestamp in milliseconds. Pass a negative value to start from the latest message. |
| `fromUser` | `NSString *` | The specified sender's user ID. Pass `nil` to apply no restriction. |
| `searchDirection` | `EMMessageSearchDirection` | Search direction.<br/> - `EMMessageSearchDirectionUp`: Retrieve messages in reverse chronological order by message timestamp.<br/> - `EMMessageSearchDirectionDown`: Retrieve messages in chronological order by message timestamp. |
| `scope` | `EMMessageSearchScope` | Search the content, extension fields, or both. |

```objectivec
[[EMClient sharedClient].chatManager loadConversationMessagesWithKeyword:@"time"
                                                                 timestamp:-1
                                                                  fromUser:nil
                                                           searchDirection:EMMessageSearchDirectionUp
                                                                     scope:EMMessageSearchScopeContent
                                                                completion:^(NSDictionary<NSString *, NSArray<NSString *> *> *result, EMError *error) {
    if (!error) {
        // Each key in result is a conversation ID, and its value is a list of matching message IDs.
    }
}];
```

## Retrieve local messages by message ID

You can pass one or more message IDs to retrieve messages from a single local conversation. You can pass up to 20 message IDs each time.

```objectivec
// messageIds: A list of message IDs. You can pass up to 20 message IDs each time.
[[EMClient sharedClient].chatManager getMessages:messageIds
                              withConversationId:conversationId
                                      completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // messages contains the local messages found.
    }
}];
```

## Retrieve messages sent by specified group members locally

For a single group conversation, you can retrieve locally stored messages sent by specified members rather than all members.

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:groupId];
if (conversation) {
    // senders can contain up to 10 user IDs. nil or an empty array applies no sender restriction.
    // searchDirection: Message search direction. EMMessageSearchDirectionUp retrieves messages in reverse chronological order by message timestamp. EMMessageSearchDirectionDown retrieves messages in chronological order by message timestamp.
    [conversation loadMessagesWithKeyword:nil timestamp:-1 count:20 fromUsers:@[@"user1", @"user2"] searchDirection:EMMessageSearchDirectionUp scope:EMMessageSearchScopeContent completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
        if (!error) {
            // Process the search results.
        }
    }];
}
```

## Read messages in a specified conversation locally

You can call `loadMessagesStartFromId` to load messages from a specified conversation from the local database by page. When you pass an empty message ID, `EMMessageSearchDirectionUp` loads messages in reverse chronological order starting with the latest message, while `EMMessageSearchDirectionDown` loads messages in chronological order starting with the earliest message.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `startMessageId` | `NSString *` | The start message ID for the query. Pass an empty value to start with the latest or earliest message based on the search direction. |
| `count` | `int` | The number of messages to load each time. If the value is less than or equal to `0`, one message is loaded. |
| `searchDirection` | `EMMessageSearchDirection` | Message search direction:<br/> - `EMMessageSearchDirectionUp`: Retrieve messages in reverse chronological order by message timestamp.<br/> - `EMMessageSearchDirectionDown`: Retrieve messages in chronological order by message timestamp. |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    [conversation loadMessagesStartFromId:startMessageId count:20 
    searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
        if (!error) {
            // messages contains the local messages on the current page.
        }
    }];
}
```

## Retrieve a local message by message ID

You can call `getMessageWithMessageId` to retrieve a specified locally stored message by message ID. If the message does not exist, `nil` is returned.

```objectivec
// messageId: The ID of the message to retrieve.
EMChatMessage *message = [[EMClient sharedClient].chatManager getMessageWithMessageId:messageId];
```

## Retrieve messages of a specified type in a local conversation

You can call `loadMessagesWithType` to retrieve messages of a specified type in a specified conversation from local storage. You can retrieve up to 400 messages each time. If no messages are retrieved, the SDK returns an empty list.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `type` | `EMMessageBodyType` | The message type to search. |
| `timestamp` | `long long` | The search start timestamp in milliseconds. Pass a negative value to start from the current time. |
| `count` | `int` | The number of messages to search for each time. The value range is `[1, 400]`. |
| `fromUser` | `NSString *` | The sender's user ID. Pass `nil` to apply no restriction. |
| `searchDirection` | `EMMessageSearchDirection` | Message search direction:<br/> - `EMMessageSearchDirectionUp`: Retrieve messages in reverse chronological order by message timestamp.<br/> - `EMMessageSearchDirectionDown`: Retrieve messages in chronological order by message timestamp. |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
[conversation loadMessagesWithType:EMMessageBodyTypeText timestamp:timestamp count:50 fromUser:fromUser searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // Process messages or error.
}];
```

## Retrieve messages in a local conversation within a specified period

You can call `loadMessagesFrom` to retrieve messages sent and received in a specified conversation within a specified period from local storage. You can retrieve up to 400 messages each time.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `startTime` | `long long` | The query start timestamp in milliseconds. |
| `endTime` | `long long` | The query end timestamp in milliseconds. |
| `count` | `int` | The number of messages to retrieve each time. The value range is `[1, 400]`. |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
[conversation loadMessagesFrom:startTime to:endTime count:50 completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // Process messages or error.
}];
```

## Retrieve the message count of a conversation within a specified period

You can call `getMessageCountStart` to retrieve the total number of messages in a conversation within a specified period from the SDK's local database.

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
// Count the local messages within the start and end times in milliseconds.
NSInteger count = [conversation getMessageCountStart:startTimestamp to:endTimestamp];
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`fetchMessagesFromServerBy`](#retrieve-messages-in-a-specified-conversation-from-the-server) | `IEMChatManager` | Retrieve historical messages from a specified conversation from the server by page. |
| [`loadConversationMessagesWithKeyword`](#retrieve-messages-in-local-conversations-by-keyword) | `IEMChatManager` | Search for messages in the local database by keyword. |
| [`getMessages`](#retrieve-local-messages-by-message-id) | `IEMChatManager` | Retrieve local messages by message ID. |
| [`loadMessagesWithKeyword`](#retrieve-messages-sent-by-specified-group-members-locally) | `EMConversation` | Search for messages in a local conversation by keyword and sender. |
| [`loadMessagesStartFromId`](#read-messages-in-a-specified-conversation-locally) | `EMConversation` | Load conversation messages from the local database by page. |
| [`getMessageWithMessageId`](#retrieve-a-local-message-by-message-id) | `IEMChatManager` | Retrieve a local message by message ID. |
| [`loadMessagesWithType`](#retrieve-messages-of-a-specified-type-in-a-local-conversation) | `EMConversation` | Search for local messages by message type, time, and sender. |
| [`loadMessagesFrom`](#retrieve-messages-in-a-local-conversation-within-a-specified-period) | `EMConversation` | Search for local conversation messages by time range. |
| [`getMessageCountStart`](#retrieve-the-message-count-of-a-conversation-within-a-specified-period) | `EMConversation` | Count local messages within a specified time range. |
