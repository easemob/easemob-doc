# Conversation List

## Feature overview

- **Local conversation list:** For one-to-one, group, and chat room conversations, the SDK locally creates or updates the corresponding conversation when a user sends or receives messages and maintains it in the local conversation list cache. The application can read the conversation list from local memory or the database to display information such as the conversation name, avatar, last message, unread count, pin status, and conversation tags.
- **Server-side and local data:** Both the EasyIM server and the local SDK can maintain conversation list data. The server stores the current user's conversation status, and the SDK's local cache enables the client to quickly read and display the conversation list. After the SDK is initialized and the user logs in successfully, the SDK automatically maintains the local conversation list. Operations such as conversation synchronization, proactive refresh, message sending and receiving, conversation deletion, clearing unread counts, pinning or unpinning conversations, and adding or removing conversation tags may update the local list.
- **Synchronization and change notifications:** To retrieve the latest conversation data maintained by the server, configure automatic conversation data synchronization before initializing the SDK, wait for synchronization to finish after login, and then read the local conversation list. When the local conversation list changes, the SDK notifies the application through a conversation list update event. When the same account pins or unpins a conversation on another device, the current device can also detect the change through a multi-device event.

## Feature activation

Before using this feature, activate the server-side conversation list feature in [EasyIM Console](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Retrieve the conversation list

To retrieve the latest conversation data, configure automatic synchronization before initialization, monitor the completion of synchronization, and then read the local conversation list.

### Automatically synchronize the conversation list after login

Before calling `initializeSDK(with:)`, configure `EMOptions#dataSyncType` to include `.conversations`. After the user logs in successfully, the SDK automatically synchronizes server-side conversation data and writes it locally.

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

`EMDataSyncType` is a bitmask option. To ensure explicit behavior that is not affected by differences in default values between versions, explicitly set `dataSyncType`. For details about automatically synchronizing data after login, see [SDK initialization documentation](initialization.html#设置登录后自动同步数据).

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

The following table lists conversation-related options that can be set during initialization:

| Option | Description |
| :--- | :--- |
| `EMOptions#deleteMessagesOnLeaveChatroom` | Sets whether to delete the local messages of a chat room when leaving it.<br/> - (Default) `true`: Deletes them. The local conversation list usually no longer contains the chat room conversation.<br/> - `false`: Retains them. The chat room conversation can remain in the local conversation list. |
| `EMOptions#loadEmptyConversations` | Sets whether to include empty conversations when loading conversations locally.<br/> - `true`: Includes them.<br/> - (Default) `false`: Excludes them. Set this option before initialization. |
| `EMOptions#autoLoadConversations` | Sets whether to automatically load conversations from the local database into memory after successful login.<br/> - (Default) `true`: Automatically loads them.<br/> - `false`: Does not automatically load them, which can reduce memory usage. |

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
- Chat room conversation: Usually the chat room name and avatar.
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
| Retrieve the latest conversation data maintained by the server | Before initialization, configure `dataSyncType` to include `.conversations`. After login, wait for synchronization to succeed and then read the local data. |
| Display a sorted conversation list | Call `getAllConversations(true)` and use the conversation array with pinned conversations first and conversations sorted by the last message time in descending order. |
| Load database conversations by criteria | Call `filterConversationsFromDB`. To retrieve all conversations, pass `nil` for `filter`. |
| Respond to conversation changes | Register `EMConversationDelegate`. After receiving `conversationListDidUpdate`, refresh the UI with the callback list or read the sorted list again. |
| Manage listeners | Remove `EMClientDelegate` and `EMConversationDelegate` when the page or component is destroyed to avoid duplicate callbacks. |
| Release and restore conversation memory | After calling `cleanConversationsMemoryCache()`, use `filterConversationsFromDB` to reload the complete list from the database if needed. |
| Read conversation display information | Use `conversationName()`, `conversationAvatar()`, `latestMessage`, `unreadMessagesCount`, `isPinned`, and `marks`. |

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`loadEmptyConversations`](#retrieve-all-or-filtered-local-conversations) | `EMOptions` | Sets whether to include empty conversations when loading conversations locally. |
| [`deleteMessagesOnLeaveChatroom`](#retrieve-all-or-filtered-local-conversations) | `EMOptions` | Sets whether to delete a chat room's local messages when leaving the chat room. |
| [`autoLoadConversations`](#retrieve-all-local-conversations-at-once) | `EMOptions` | Sets whether to automatically load local conversations into memory after login. |
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
