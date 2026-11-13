# Conversation List

## Feature overview

- **Local conversation list:** For one-to-one, group, and chat room conversations, the SDK locally creates or updates the corresponding conversation when a user sends or receives messages and maintains it in the local conversation list cache. The application can read the conversation list from local memory or the database to display information such as the conversation name, avatar, last message, unread count, pin status, and conversation tags. **Starting from SDK v5.1.0, the local conversation list excludes chat room conversations by default.**
- **Server-side and local data:** Both the EasyIM server and the local SDK can maintain conversation list data. The server stores the current user's conversation status, and the SDK's local cache enables the client to quickly read and display the conversation list. After the SDK is initialized and the user logs in successfully, the SDK automatically maintains the local conversation list. Operations such as conversation synchronization, proactive refresh, message sending and receiving, conversation deletion, clearing unread counts, pinning or unpinning conversations, and adding or removing conversation tags may update the local list.
- **Synchronization and change notifications:** Server-side conversation data is automatically synchronized after login by default. Therefore, after login, wait for synchronization to finish before reading the local conversation list. When the local conversation list changes, the SDK notifies the application through a conversation list update event. When the same account pins or unpins a conversation on another device, the current device can also detect the change through a multi-device event.

## Feature activation

Before using this feature, activate the server-side conversation list feature in [EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Retrieve the conversation list

To retrieve the latest conversation data, your app should automatically synchronize it after login, monitor synchronization completion, and then read the local conversation list.

### Automatically synchronize the conversation list after login

The default value of `EMOptions#dataSyncType` is `.conversations`. After the user logs in successfully, the SDK automatically synchronizes server-side conversation data and writes it locally.

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}
```

To also synchronize the contact list or joined chat group list, include `.contacts` or `.joinedGroups` in the configuration:

```swift
options.dataSyncType = [.conversations, .contacts, .joinedGroups]
```

`EMDataSyncType` is a bitmask option. To disable automatic data synchronization after login, set `dataSyncType` to `.none`. For details about automatically synchronizing data after login, see [SDK initialization documentation](initialization.html#set-automatic-data-synchronization-after-login).

### Monitor conversation list synchronization

Use `EMClientDelegate` to monitor the data synchronization status after login. When `type` includes `.conversations`, the current notification concerns conversation list synchronization.

```swift
final class ConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataStart(with type: EMDataSyncType) {
        if type.contains(.conversations) {
            // Conversation list synchronization started.
        }
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard type.contains(.conversations) else {
            return
        }

        if let error {
            print("Failed to synchronize the conversation list: \(error.errorDescription)")
        } else {
            // Conversation list synchronization succeeded. You can read the local conversation list.
            let conversations =
                EMClient.shared().chatManager?.getAllConversations(true) ?? []
        }
    }
}

let syncListener = ConversationSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)

// Remove the listener when it is no longer needed.
EMClient.shared().removeDelegate(syncListener)
```

`syncDataFinished(_:type:)` is triggered when synchronization succeeds, fails, times out, or ends because of a disconnection. Only `error == nil` indicates that the synchronization succeeded.

### Conversation-related options

During initialization, you can set the following conversation-related options in `EMOptions`:

| Option | Description |
| :--- | :--- |
| `enableChatroomConversation` | Sets whether to include chat room conversations when retrieving the local conversation list. This configuration does not control the creation or storage of chat room conversations and does not affect the normal sending or receiving of chat room messages. This feature is supported starting from SDK v5.1.0.<br/> - `true`: Includes chat room conversations in the local conversation list.<br/> - (Default) `false`: Excludes chat room conversations from the local conversation list. Set this option before initializing the SDK.<br/> Read the `EMOptions#enableChatroomConversation` property to query the current configuration. |
| `deleteMessagesOnLeaveChatroom` | Sets whether to delete a chat room's local messages when the user actively or passively leaves the chat room.<br/> - (Default) `true`: Deletes local messages.<br/> - `false`: Retains local messages. |
| `loadEmptyConversations` | Sets whether to include empty conversations when loading conversations from the local database. Set this option before initializing the SDK.<br/> - `true`: Includes empty conversations.<br/> - (Default) `false`: Excludes empty conversations. |
| `autoLoadConversations` | Sets whether to automatically load all conversations from the local database into memory after login succeeds. Set this option before initializing the SDK.<br/> - (Default) `true`: Automatically loads all conversations.<br/> - `false`: Does not automatically load all conversations. You can load them as needed through pagination or filtering APIs. |

### Retrieve local conversations by page

Starting from SDK v5.1.0, you can call `IEMChatManager#getConversationsFromDBWithCursor:pageSize:completion:` to retrieve the conversation list from the local database by page. The SDK returns pinned conversations first. Conversations with the same pin status are sorted by the server timestamp of the latest message in descending order. If the timestamps are also the same, conversations are sorted case-insensitively by conversation ID in descending order.
.

Before calling this method, set `EMOptions#autoLoadConversations` to `NO` during SDK initialization to disable automatic loading of all local conversations. This property defaults to `YES`. Otherwise, the SDK loads all conversations from the database into memory after login succeeds, preventing pagination from reducing the initial loading volume and memory usage.

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
// Disable automatic loading of all local conversations before initializing the SDK.
options.autoLoadConversations = NO;
[[EMClient sharedClient] initializeSDKWithOptions:options];

// For the first query, pass nil or @"" for cursor to start from the first page.
NSString *cursor = @"";
// pageSize is the expected number of conversations returned per page. The value range is [1,100].
NSInteger pageSize = 20;

[EMClient.sharedClient.chatManager getConversationsFromDBWithCursor:cursor
                                                            pageSize:pageSize
                                                          completion:^(EMCursorResult<EMConversation *> * _Nullable result,
                                                                       EMError * _Nullable error) {
    if (error) {
        // If cursor is invalid, error.code is EMErrorInvalidParam.
        return;
    }

    NSArray<EMConversation *> *conversations = result.list;
    NSString *nextCursor = result.cursor;

    if (nextCursor.length > 0) {
        // Save nextCursor and pass it as the cursor parameter when retrieving the next page.
    } else {
        // An empty nextCursor string indicates that the current page is the last page. No further requests are needed.
    }
}];
```

### Retrieve all or filtered local conversations

Call `filterConversationsFromDB` to retrieve all conversations from the local database or filter conversations by criteria. This API must be called after successful login and synchronously returns `[EMConversation]?`.

- Pass `nil` for `filter`: Retrieves all conversations in the local database.
- `filter` returns `true`: Retains the conversation and includes it in the result.
- `filter` returns `false`: Filters out the conversation.
- Set `cleanMemoryCache` to `true`: Clears the existing conversation memory cache before loading.
- Set `cleanMemoryCache` to `false`: Retains the existing conversation memory cache.

Retrieve all conversations from the database:

```swift
let conversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: nil
    ) ?? []
```

The following example loads only conversations that contain unread messages:

```swift
let unreadConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: true,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

The filter closure can also determine whether to retain a conversation based on conversation properties such as `conversationId`, `type`, `ext`, `isPinned`, `latestMessage`, or `marks`.

For details about setting whether the local conversation list includes chat room conversations by default or loads empty conversations, see [Conversation-related options](#conversation-related-options).

### Retrieve all local conversations at once

Call `getAllConversations(_:)` to retrieve the local conversation array. When you pass `true`, the SDK returns a sorted conversation list:

- Pinned conversations precede unpinned conversations.
- Within the pinned and unpinned conversation groups, conversations are sorted by the timestamp of the last message in descending order.
- The current implementation filters out message thread conversations.

```swift
let conversations =
    EMClient.shared().chatManager?.getAllConversations(true) ?? []
```

If SDK sorting is not required, call `getAllConversations()` without a parameter. In the iOS implementation, this method is equivalent to `getAllConversations(false)`:

```swift
let conversations =
    EMClient.shared().chatManager?.getAllConversations() ?? []
```

**Relationship between local conversation read APIs and automatic conversation loading**

Before initializing the SDK, use `EMOptions#autoLoadConversations` to set whether conversations in the local database are automatically loaded into memory after successful login:

- (Default) `true`: Automatically loads local conversations after login. The application can directly read conversations and individual conversation unread counts from memory.
- `false`: Does not automatically load all conversations after login, which can reduce memory usage. To retrieve complete or filtered database conversations, explicitly call `filterConversationsFromDB`.

:::tip
`dataSyncType` and `autoLoadConversations` control different data processing stages:

- `dataSyncType` includes `.conversations`: Synchronizes server-side conversation data locally after login.
- `autoLoadConversations = true`: Automatically loads conversations from the local database into memory after login.

If conversation list synchronization is enabled but automatic loading is disabled, server-side data can still be synchronized locally. The application should filter and load conversations from the database as needed.
:::

## Retrieve conversation names and avatars

Call `EMConversation#conversationName` and `EMConversation#conversationAvatar` to retrieve the names and avatars required to display the conversation list:

- One-to-one conversation: Usually the peer user's nickname and avatar.
- Group conversation: Usually the chat group name and avatar.
- If the related user or chat group information has not been synchronized or loaded, or is unavailable, the properties may be empty strings.

```swift
let conversationName = conversation.conversationName()
let conversationAvatar = conversation.conversationAvatar()
```

## Clear conversations from memory

Call `cleanConversationsMemoryCache` to clear all conversations from memory and release memory. This operation clears the memory cache and does not delete conversations or messages from the local database.

```swift
EMClient.shared().chatManager?.cleanConversationsMemoryCache()
```

After the cache is cleared, to read the complete conversation list from the database again, call `filterConversationsFromDB` and pass `nil` for `filter`.

## Example of reducing conversation memory usage

When there are many conversations, use the following methods to reduce the memory usage of conversation data:

1. Before initializing the SDK, set `autoLoadConversations` to `false` to disable automatic conversation loading after login.
2. Call `filterConversationsFromDB` as needed to load some conversations. To replace the current cache, set `cleanMemoryCache` to `true`.
3. When the business layer detects high memory usage and temporarily does not need the conversation data in memory, call `cleanConversationsMemoryCache()`.

```swift
// Step 1: Disable automatic conversation loading before initializing the SDK.
let options = EMOptions(appkey: "your-org#your-app")
options.autoLoadConversations = false
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}

// Step 2: After successful login, load some conversations from the database based on business criteria.
let unreadConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: true,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

When the business layer detects high memory usage and no longer needs the conversation data in memory, clear it separately:

```swift
EMClient.shared().chatManager?.cleanConversationsMemoryCache()
```

:::tip
After automatic loading is disabled or the memory cache is cleared, conversations and unread counts read directly from memory may be incomplete. To obtain complete data, first load the corresponding conversations from the local database.
:::

## Scenarios that update conversation list data

| Scenario | Affects server-side data | Affects the local conversation list |
| :--- | :--- | :--- |
| Automatically synchronize server-side conversation data and write it locally after login | No. Does not modify server-side conversation status. | Yes |
| The SDK creates or updates a conversation's latest message, sorting, and unread count when messages are sent or received | Depends on the message and server-side configuration | Yes |
| Pin or unpin a conversation<br/>Method: `pinConversation:isPinned:completionBlock:` | Yes | Yes |
| Add or remove conversation tags<br/>Methods: `addConversationMark:mark:completion:` / `removeConversationMark:mark:completion:` | Yes | Yes |
| Delete a local conversation and determine whether to delete local messages based on the parameter<br>Method: `deleteConversation:isDeleteMessages:completion:` | No | Yes |
| Delete a specified server-side and local conversation and determine whether to delete server-side messages based on the parameter<br>Method: `deleteServerConversation:conversationType:isDeleteServerMessages:completion:` | Yes | Yes |
| Clear the unread count of a specified conversation and synchronize the change to the current user's other devices<br>Method: `clearConversationUnreadMessageCount:completion:` | Yes, with multi-device synchronization | Yes |
| Clear the unread counts of all conversations and synchronize the change to the current user's other devices<br/>Method: `clearAllConversationUnreadMessageCount:` | Yes, with multi-device synchronization | Yes |
| Clear the conversation memory cache<br/>Method: `cleanConversationsMemoryCache` | No | Affects only memory and does not delete database data |

:::tip
`clearConversationUnreadMessageCount:completion:` only clears the unread count and synchronizes the multi-device status. It does not send a read receipt to the conversation peer. Use the corresponding receipt API to send message-level read receipts.
:::

## Monitor conversation list updates

When the local conversation list changes, the SDK returns the updated conversation array through `conversationListDidUpdate`. Register the delegate through `addConversation` and call `removeConversation` when the delegate is no longer needed.

```swift
final class ConversationListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        // Refresh the UI with the conversation list returned in the callback.
        // If the business requires pinned conversations first and sorting by the latest message, you can also read the sorted list again:
        let sortedConversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
    }
}

let listListener = ConversationListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// Remove the listener when the page or component is destroyed or the listener is no longer needed.
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

When `nil` is passed for `delegateQueue`, the current implementation dispatches the callback to the main queue. If a custom queue is passed, switch to the main thread before updating the UI.

## API best practices

| Scenario | Recommendation |
| :--- | :--- |
| Retrieve the latest conversation data maintained by the server | Use the default `.conversations` configuration of `EMOptions#dataSyncType` or explicitly configure this type before initialization. After login, wait for synchronization to succeed and then read the local data. |
| Load local conversations by page | Set `autoLoadConversations` to `false` before initialization, and then call `getConversationsFromDBWithCursor` to load conversations by cursor. |
| Display a sorted conversation list | Call `getAllConversations(true)` and use the conversation array with pinned conversations first and conversations sorted by the last message time in descending order. |
| Load database conversations by criteria | Call `filterConversationsFromDB`. To retrieve all conversations, pass `nil` for `filter`. |
| Respond to conversation changes | Register `EMConversationDelegate`. After receiving `conversationListDidUpdate`, refresh the UI with the callback list or read the sorted list again. |
| Manage listeners | Remove `EMClientDelegate` and `EMConversationDelegate` when the page or component is destroyed to avoid duplicate callbacks. |
| Release and restore conversation memory | After calling `cleanConversationsMemoryCache()`, use `filterConversationsFromDB` to reload the complete list from the database if needed. |
| Read conversation display information | Use `conversationName()`, `conversationAvatar()`, `latestMessage`, `unreadMessagesCount`, `isPinned`, and `marks`. |

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`dataSyncType`](#automatically-synchronize-the-conversation-list-after-login) | `EMOptions` | Sets the data types automatically synchronized after login succeeds. |
| [`enableChatroomConversation`](#conversation-related-options) | `EMOptions` | Sets whether to include chat room conversations when retrieving the local conversation list. Read this property to query the current configuration. |
| [`loadEmptyConversations`](#conversation-related-options) | `EMOptions` | Sets whether to include empty conversations when loading conversations locally. |
| [`deleteMessagesOnLeaveChatroom`](#conversation-related-options) | `EMOptions` | Sets whether to delete a chat room's local messages when leaving the chat room. |
| [`autoLoadConversations`](#retrieve-local-conversations-by-page) | `EMOptions` | Sets whether to automatically load local conversations into memory after login. |
| [`getConversationsFromDBWithCursor`](#retrieve-local-conversations-by-page) | `IEMChatManager` | Retrieves the conversation list from the local database by page. |
| [`filterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations) | `IEMChatManager` | Retrieves all conversations from the local database or filters them by criteria. |
| [`getAllConversations`](#retrieve-all-local-conversations-at-once) | `IEMChatManager` | Retrieves the local conversation array and determines whether to sort it based on the parameter. |
| [`getAllConversations`](#retrieve-all-local-conversations-at-once) | `IEMChatManager` | Retrieves the local conversation array without requesting sorting. |
| [`cleanConversationsMemoryCache`](#clear-conversations-from-memory) | `IEMChatManager` | Clears all conversation caches from memory. |
| [`pinConversation`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Pins or unpins a conversation. |
| [`addConversationMark`](#scenarios-that-update-conversation-list-data) / [`removeConversationMark`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Adds or removes server-side and local conversation tags. |
| [`deleteConversation`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Deletes a local conversation and determines whether to delete local messages based on the parameter. |
| [`deleteServerConversation`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Deletes a specified server-side and local conversation. |
| [`clearConversationUnreadMessageCount`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Clears the unread count of a specified conversation and synchronizes the multi-device status. |
| [`clearAllConversationUnreadMessageCount`](#scenarios-that-update-conversation-list-data) | `IEMChatManager` | Clears the unread counts of all conversations and synchronizes the multi-device status. |
