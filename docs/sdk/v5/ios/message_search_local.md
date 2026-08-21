# Search Messages

## Feature overview

The message search methods in this document can search all message types except command messages in the local database because command messages are not stored in the local database.

:::tip
To search server-side messages, contact the Easemob business team to activate the feature. For details, see [Server-side Message Search](/value-added/search/message_search_android.html).
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and [open the current user's local database](login.html#登录完成前使用本地数据库). For details, see [Quickstart](quickstart.html). Local message search does not require the client to remain connected to the server.
- Understand the EasyIM API [limitations](/product/limitation.html).

## Search messages sent by a user in a conversation by keyword

Call `loadMessagesWithKeyword` to search the local database for messages sent by a specified user in a single conversation based on a keyword.

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | The ID of the local conversation to search. |
| `keyword` | `NSString *` | The search keyword. |
| `timeStamp` | `long long` | The search start timestamp, in milliseconds. Pass a negative value to start from the current time. The result does not include messages whose timestamp is the same as `timeStamp`. |
| `count` | `int` | The number of messages returned each time. If the value is less than or equal to `0`, one message is returned. |
| `fromUsers` | `NSArray<NSString *> *` | The list of specified sender user IDs. Pass `nil` to place no restriction on the sender. |
| `searchDirection` | `EMMessageSearchDirection` | The message search direction:<br/> - `EMMessageSearchDirectionUp`: Searches by message timestamp in descending order.<br/> - `EMMessageSearchDirectionDown`: Searches by message timestamp in ascending order. |
| `scope` | `EMMessageSearchScope` | Searches message content, extensions, or both. |

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:@"conversationId"];
// Asynchronously search local messages in the current conversation by keyword, sender, and scope.
[conversation loadMessagesWithKeyword:@"keyword" timestamp:-1 count:50 fromUsers:nil searchDirection:EMMessageSearchDirectionDown scope:EMMessageSearchScopeContent completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    if (!error) {
        // Process the search results.
    }
}];
```

## Search messages in all conversations by search scope

Call `loadMessagesWithKeyword` to set a keyword, message timestamp, message count, sender, and search direction, and choose to search only message content, only message extensions, or both.

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `keyword` | `NSString *` | The search keyword. |
| `timestamp` | `long long` | The search start timestamp, in milliseconds. Pass a negative value to start from the current time. |
| `count` | `int` | The number of messages returned each time. If the value is less than or equal to `0`, one message is returned. |
| `fromUser` | `NSString *` | The specified sender user ID. Pass `nil` to place no restriction on the sender. |
| `searchDirection` | `EMMessageSearchDirection` | The message search direction:<br/> - `EMMessageSearchDirectionUp`: Searches by message timestamp in descending order.<br/> - `EMMessageSearchDirectionDown`: Searches by message timestamp in ascending order.|
| `scope` | `EMMessageSearchScope` | Searches only message content, only message extensions, or both. |

```swift
EMClient.shared().chatManager?.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUser: nil, searchDirection: .down, scope: .content, completion: { messages, aError in
            
        })
```

## Search messages in the current conversation by search scope

Call `loadMessagesWithKeyword` to set a keyword, message timestamp, message count, sender, and search direction, and choose to search only message content, only message extensions, or both.

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | The ID of the local conversation to search. |
| `keyword` | `NSString *` | The search keyword. |
| `timestamp` | `long long` | The search start timestamp, in milliseconds. Pass a negative value to start from the current time. |
| `count` | `int` | The number of messages returned each time. If the value is less than or equal to `0`, one message is returned. |
| `fromUsers` | `NSArray<NSString *> *` | The list of specified sender user IDs. Pass `nil` to place no restriction on the sender. |
| `searchDirection` | `EMMessageSearchDirection` | The message search direction:<br/> - `EMMessageSearchDirectionUp`: Searches by message timestamp in descending order.<br/> - `EMMessageSearchDirectionDown`: Searches by message timestamp in ascending order. |
| `scope` | `EMMessageSearchScope` | Searches only message content, only message extensions, or both. |

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationsId") {
    conversation.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUsers: nil, searchDirection: .down, scope: .content, completion: { messages, aError in
                
    })
}
```

## Search messages in all conversations by message type

Call `searchMessagesWithTypes` to set one or more message types in addition to the message timestamp, message count, sender, and search direction, and search messages in all conversations in the local database.

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `types` | `NSArray<NSNumber *> *` | The array of message types to search. Each element is an `EMMessageBodyType` enum value. |
| `timestamp` | `long long` | The search start timestamp, in milliseconds. Pass a negative value to start from the current time. |
| `count` | `int` | The number of messages returned each time. The value range is `[1, 400]`. |
| `fromUser` | `NSString *` | The specified sender user ID. Pass `nil` to place no restriction on the sender. |
| `searchDirection` | `EMMessageSearchDirection` | The message search direction:<br/> - `EMMessageSearchDirectionUp`: Searches by message timestamp in descending order.<br/> - `EMMessageSearchDirectionDown`: Searches by message timestamp in ascending order. |

```swift
NSArray<NSNumber *> *types = @[@(EMMessageBodyTypeText), @(EMMessageBodyTypeImage)];
[[EMClient sharedClient].chatManager searchMessagesWithTypes:types timestamp:-1 count:10 fromUser:@"user123" searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // Process messages or error.
}];
``` 

## Search messages in the current conversation by message type

Call `searchMessagesWithTypes` to set one or more message types in addition to the message timestamp, message count, sender, and search direction, and search messages in a single conversation in the local database.

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `NSString *` | The ID of the local conversation to search. |
| `types` | `NSArray<NSNumber *> *` | The array of message types to search. Each element is an `EMMessageBodyType` enum value. |
| `timestamp` | `long long` | The search start timestamp, in milliseconds. Pass a negative value to start from the current time. |
| `count` | `int` | The number of messages returned each time. The value range is `[1, 400]`. |
| `fromUser` | `NSString *` | The specified sender user ID. Pass `nil` to place no restriction on the sender. |
| `searchDirection` | `EMMessageSearchDirection` | The message search direction:<br/> - `EMMessageSearchDirectionUp`: Searches by message timestamp in descending order.<br/> - `EMMessageSearchDirectionDown`: Searches by message timestamp in ascending order. |

```swift
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:@"conversationId"];
NSArray<NSNumber *> *types = @[@(EMMessageBodyTypeText), @(EMMessageBodyTypeImage)];
[conversation searchMessagesWithTypes:types timestamp:-1 count:20 fromUser:@"user123" searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> *messages, EMError *error) {
    // Process messages or error.
}];
```     

## Keyword search rules

When the following message search APIs search different message types, the `keywords` parameter corresponds to different content.

- [Search messages sent by a specified user in a single conversation in the local database by keyword](#search-messages-sent-by-a-user-in-a-conversation-by-keyword).
- [Search messages in all conversations by keyword and search scope](#search-messages-in-all-conversations-by-search-scope).
- [Search messages in the current conversation by keyword and search scope](#search-messages-in-the-current-conversation-by-search-scope).

### Search message content only

| Message type | Message content matched by the keyword | Keyword search content example |
| :-------------- | :----- |:----- |
| Text message | `EMTextMessageBody#text` | The actual text message content, "Hello world." |
| Image message | `EMImageMessageBody#displayName` | The image file name, "photo.jpg." |
| Voice message | `EMVoiceMessageBody#displayName` | The voice file name, "audio.amr." |
| Video message | `EMVideoMessageBody#displayName` | The video file name, "video.mp4." |
| File message | `EMFileMessageBody#displayName` | The file name, "report.pdf." |
| Location message | `EMLocationMessageBody#address 和 EMLocationMessageBody#buildingName` | The address or building name, "Chaoyang District, Beijing" or "China World Trade Center." |
| Custom message | `EMCustomMessageBody#event` | The custom event name, "gift." |
| Combined message | `EMCombineMessageBody#title 和 EMCombineMessageBody#summary` | The title or summary, "Chat history" or "Contains 5 messages." |

### Search extensions only

When searching only the JSON string of message extensions (`ext`), the `keywords` field matches custom extensions added by the user, for example:

```json
{"key1":"value1", "key2":"value2"}
```

### Search all content

Searches both message content and extensions. A message is returned if either matches.

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`loadMessagesWithKeyword`](#search-messages-sent-by-a-user-in-a-conversation-by-keyword) | `EMConversation` | Asynchronously searches local messages in the current conversation by keyword. |
| [`loadMessagesWithKeyword`](#search-messages-in-all-conversations-by-search-scope) | `IEMChatManager` | Asynchronously searches local messages in all conversations by keyword and search scope. |
| [`loadMessagesWithKeyword`](#search-messages-in-the-current-conversation-by-search-scope) | `EMConversation` | Asynchronously searches local messages in the current conversation by keyword and search scope. |
| [`searchMessagesWithTypes`](#search-messages-in-all-conversations-by-message-type) | `IEMChatManager` | Asynchronously searches local messages in all conversations by message type. |
| [`searchMessagesWithTypes`](#search-messages-in-the-current-conversation-by-message-type) | `EMConversation` | Asynchronously searches local messages in the current conversation by message type. |
