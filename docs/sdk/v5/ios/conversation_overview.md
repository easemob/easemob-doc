# Conversation Overview

## Feature overview

A conversation is a collection of messages in a one-to-one chat, group chat, or chat room. The iOS SDK represents a local conversation through `EMConversation`. The application can read data such as the conversation ID, conversation type, latest message, unread count, pin status, conversation tags, local extension properties, conversation name, and avatar.

The iOS SDK supports [automatically synchronizing server-side conversation data locally after successful login](initialization.html#set-automatic-data-synchronization-after-login). After synchronization is complete, the application reads and displays the conversation list through local APIs.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- To use value-added features such as the server-side conversation list, conversation pinning, or conversation tags, activate the corresponding feature in EasyIM Console.

## Conversation model

### Conversation type and ID

The iOS SDK identifies a conversation by `EMConversationType` and the conversation ID:

| Conversation type | Objective-C enum value | Swift enum value | Conversation ID |
| :--- | :--- | :--- | :--- |
| One-to-one chat | `EMConversationTypeChat` | `.chat` | The peer user ID. |
| Group chat | `EMConversationTypeGroupChat` | `.groupChat` | The chat group ID. |
| Chat room | `EMConversationTypeChatRoom` | `.chatRoom` | The chat room ID. |

### Conversation object

Each item in the conversation list is an `EMConversation`. Common properties and methods are as follows:

| API | Type or return type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | The conversation ID. |
| `type` | `EMConversationType` | The conversation type. |
| `unreadMessagesCount` | `Int32` | The local unread message count. |
| `messagesCount` | `Int32` | The number of local messages. |
| `latestMessage` | `EMChatMessage?` | The latest message in the conversation. |
| `lastReceivedMessage()` | `EMChatMessage?` | The latest message received by the current user. |
| `ext` | `[AnyHashable: Any]` | The local extension properties of the conversation. They cannot currently be set for a message thread conversation. |
| `isChatThread` | `Bool` | Whether the conversation is a message thread conversation. |
| `isPinned` | `Bool` | Whether the conversation is pinned. |
| `pinnedTime` | `Int64` | The pin timestamp, in milliseconds. The value is `0` when the conversation is not pinned. |
| `marks` | `[NSNumber]` | The conversation tag array. |
| `disturbType` | `EMPushRemindType` | The conversation do-not-disturb type. |
| `conversationName()` | `String?` | Returns the peer user's nickname for a one-to-one chat or the chat group name for a group chat. |
| `conversationAvatar()` | `String?` | Returns the peer user's avatar for a one-to-one chat or the chat group avatar for a group chat. |
| `pinnedMessages()` | `[EMChatMessage]?` | The pinned messages saved locally for the current conversation. |

```swift
func renderConversation(_ conversation: EMConversation) {
    let conversationId = conversation.conversationId
    let type = conversation.type
    let unreadCount = conversation.unreadMessagesCount
    let latestMessage = conversation.latestMessage
    let name = conversation.conversationName()
    let avatar = conversation.conversationAvatar()
}
```

:::tip
`EMConversation#conversationName` and `EMConversation#conversationAvatar` retrieve the name and avatar required to display the conversation list. These APIs provide only basic display information and do not represent complete user properties, chat group information, or chat room information. To retrieve complete business data, call the corresponding API in the user property, chat group, or chat room module based on the conversation type.
:::

## Create and update conversations

### Create or update conversations through messages

When messages are sent or received, the SDK creates or updates the local conversation to which the message belongs:

- One-to-one message: Creates or updates the one-to-one conversation based on the peer user ID.
- Group message: Creates or updates the group conversation based on the chat group ID.
- Chat room message: Creates or updates the chat room conversation based on the chat room ID.

After receiving an online message, the SDK updates local status such as the latest message in the conversation (`EMConversation#latestMessage`), list sorting, and unread count (`EMConversation#unreadMessagesCount`).

### Create a local conversation through an API

When calling `getConversation`, set `createIfNotExist` to `true` to create a conversation object when the specified conversation does not exist locally. If it is set to `false`, the SDK searches only for an existing conversation and returns `nil` if none is found.

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: true
)
```

Pass the correct conversation type when creating or querying a conversation. This API creates only a local conversation object. It does not create a server-side user, chat group, or chat room.

### Update the conversation list through server synchronization

To update the conversation list through server synchronization, configure automatic synchronization before initialization, wait for synchronization to finish after login, and then read the local data.

Before calling `initializeSDKWithOptions`, configure `EMOptions#dataSyncType` to include `.conversations`. After the user logs in successfully, the SDK automatically synchronizes server-side conversation data and writes it locally.

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}
```

The application monitors synchronization status through `syncDataStartWithType` and `syncDataFinished`. When `error == nil` and `type` includes `.conversations`, the application can read the latest local conversation list.

```swift
final class ConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataStart(with type: EMDataSyncType) {
        if type.contains(.conversations) {
            // Conversation data synchronization started.
        }
    }

    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
        // Refresh the conversation list with conversations.
    }
}
```

## Conversation lists and empty conversations

The iOS SDK provides the following methods for reading the local conversation list:

| Method | API | Description |
| :--- | :--- | :--- |
| Sorted list | `getAllConversations` | When `true` is passed for `isSort`, pinned conversations take precedence. Within the pinned and unpinned conversation groups, conversations are sorted by the latest message time in descending order. |
| List without specified sorting | `getAllConversations` | Equivalent to `getAllConversations(false)` and returns the local conversation array. |
| Database filtering | `filterConversationsFromDB` | Loads all conversations from the local database or filters conversations based on a closure. The conversation memory cache can optionally be cleared first. |

```swift
let sortedConversations =
    EMClient.shared().chatManager?.getAllConversations(true) ?? []

let filteredConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: { conversation in
            conversation.unreadMessagesCount > 0
        }
    ) ?? []
```

An empty conversation is a conversation without messages. For example, a conversation may become empty after all of its messages expire, are cleared, or are recalled.

When loading conversations from the local database, `EMOptions#loadEmptyConversations` controls whether empty conversations are included. The default value is `false`. To include empty conversations, set it to `true` before calling `initializeSDKWithOptions`.

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.loadEmptyConversations = true

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}
```

Empty conversations can also be pinned, tagged, and deleted.

## Current conversation and unread counts

After the application enters a conversation page and finishes processing messages, it can clear the conversation unread count based on business requirements:

| API | Description |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | Clears the local unread count of a specified conversation and synchronizes the change to the current account's other devices. |
| `clearAllConversationUnreadMessageCount` | Clears the local unread counts of all conversations and synchronizes the change to the current account's other devices. |

```swift
EMClient.shared().chatManager?.clearConversationUnreadMessageCount(
    conversationId
) { error in
    if let error {
        print("Failed to clear the unread count: \(error.errorDescription)")
    } else {
        print("Conversation unread count cleared")
    }
}
```

:::tip
Clearing a conversation unread count does not send a read receipt to the message sender. To notify the original message sender, call `sendMessageReadReceipts`. For details, see [Message read receipts](message_receipt.html).
:::

## Conversation feature list

| Feature | Main API | Description |
| :--- | :--- | :--- |
| Conversation list | `getAllConversations`, `getAllConversations`, `filterConversationsFromDB` | Reads the conversation list from local memory or the database. For details, see [Conversation List](conversation_list.html). |
| Conversation unread counts | `unreadMessagesCount`, `clearConversationUnreadMessageCount`, `clearAllConversationUnreadMessageCount` | Retrieves or clears conversation unread counts. For details, see [Conversation Unread Counts](conversation_unread.html). |
| Conversation deletion | `deleteConversation`, `deleteServerConversation`, `deleteAllMessagesAndConversations` | Deletes local conversations and messages or the current user's server-side conversations and messages. For details, see [Delete Conversations](conversation_delete.html). |
| Conversation pinning | `pinConversation` | Pins or unpins a conversation. For details, see [Pin Conversations](conversation_pin.html). |
| Conversation tags | `addConversationMark`, `removeConversationMark` | Adds tags to or removes tags from one or more conversations. For details, see [Conversation Tags](conversation_mark.html). |
| Conversation do-not-disturb | Conversation do-not-disturb APIs of `IEMPushManager` | Sets or queries conversation do-not-disturb rules. |
| Local messages in a conversation | `loadMessageWithId`, `loadMessagesStartFromId`, `deleteMessageWithId`, `deleteAllMessages` | Retrieves or deletes local conversation messages. |
| Server-side message deletion | `removeMessagesFromServerMessageIds`, `removeMessagesFromServerWithTimeStamp` | Deletes specified messages from the local and server-side data of the current conversation. |
| Pinned messages in a conversation | `pinMessage:completion`, `unpinMessage`, `getPinnedMessagesFromServer` | Pins, unpins, or retrieves pinned messages in a conversation. |

## Conversation events

#### Conversation list events

When the local conversation list changes, the SDK returns the updated conversation array through `conversationListDidUpdate`. The application can use the callback data to refresh the UI or read the sorted list again.

```swift
final class ConversationListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
        // Refresh the UI with the latest conversations.
    }
}

let listListener = ConversationListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// Remove the listener when it is no longer needed.
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

The start and end status of automatic conversation synchronization is reported through `syncDataStartWithType` and `syncDataFinished`.

#### Multi-device conversation events

Register `EMMultiDevicesDelegate` through `addMultiDevicesDelegate` to receive conversation operations performed on the current account's other devices in `multiDevicesConversationEvent`:

| Swift event | Objective-C enum value | Numeric value | Description |
| :--- | :--- | :--- | :--- |
| `.conversationPinned` | `EMMultiDevicesEventConversationPinned` | 60 | Another device pinned a conversation. |
| `.conversationUnpinned` | `EMMultiDevicesEventConversationUnpinned` | 61 | Another device unpinned a conversation. |
| `.conversationDelete` | `EMMultiDevicesEventConversationDelete` | 62 | Another device deleted a conversation. |
| `.conversationUpdateMark` | `EMMultiDevicesEventConversationUpdateMark` | 63 | Another device updated conversation tags. |
| `.conversationMuteInfoChanged` | `EMMultiDevicesEventConversationMuteInfoChanged` | 64 | Another device updated conversation do-not-disturb settings. |
| `.conversationUnreadMessageCountCleared` | `EMMultiDevicesEventConversationUnreadMessageCountCleared` | 65 | Another device cleared the unread count of a specified conversation. |
| `.allConversationUnreadMessageCountCleared` | `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` | 66 | Another device cleared the unread counts of all conversations. |

```swift
final class ConversationMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        // Update the corresponding conversation based on event and refresh the conversation list as needed.
    }
}

let multiDeviceListener = ConversationMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// Remove the listener when it is no longer needed.
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

## Best practices

- Before initializing the SDK, configure `EMOptions#dataSyncType` to include `.conversations`, and read the local list after conversation data synchronization succeeds.
- When displaying the conversation list, preferentially call `getAllConversations` and pass `true` for `isSort` to directly use the SDK's sorting result with pinned conversations first.
- When querying only local conversations, pass `false` for `createIfNotExist` in `getConversation` to avoid accidentally creating empty conversations.
- Register `EMConversationDelegate` and refresh the conversation list after receiving `conversationListDidUpdate`.
- Remove `EMClientDelegate`, `EMConversationDelegate`, and `EMMultiDevicesDelegate` when the page or component is destroyed to avoid duplicate callbacks.
- Clearing conversation unread counts and sending message read receipts are two independent features. The former updates the current account's conversation status, while the latter notifies the original message sender.

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`conversationId`](#conversation-object) / [`type`](#conversation-object) | `EMConversation` | Retrieves the conversation ID and conversation type. |
| [`unreadMessagesCount`](#conversation-object) / [`latestMessage`](#conversation-object) | `EMConversation` | Retrieves the conversation unread count and latest message. |
| [`marks`](#conversation-object) / [`ext`](#conversation-object) | `EMConversation` | Retrieves the conversation tags and local extension properties. |
| [`conversationName`](#conversation-object) / [`conversationAvatar`](#conversation-object) | `EMConversation` | Retrieves the conversation display name and avatar. |
| [`getConversation`](#create-a-local-conversation-through-an-api) | `IEMChatManager` | Finds a local conversation and optionally creates it based on the parameter if it does not exist. |
| [`dataSyncType`](#update-the-conversation-list-through-server-synchronization) | `EMOptions` | Sets the data types that are automatically synchronized after login. |
| [`initializeSDKWithOptions`](#update-the-conversation-list-through-server-synchronization) | `EMClient` | Initializes the iOS SDK with the specified configuration. |
| [`getAllConversations`](#conversation-lists-and-empty-conversations) / [`getAllConversations`](#conversation-lists-and-empty-conversations) | `IEMChatManager` | Retrieves the local conversation array. |
| [`filterConversationsFromDB`](#conversation-lists-and-empty-conversations) | `IEMChatManager` | Loads all conversations from the local database or filters conversations. |
| [`loadEmptyConversations`](#conversation-lists-and-empty-conversations) | `EMOptions` | Sets whether to include empty conversations when loading conversations from the local database. |
| [`clearConversationUnreadMessageCount`](#current-conversation-and-unread-counts) | `IEMChatManager` | Clears the local unread count of a specified conversation. |
| [`clearAllConversationUnreadMessageCount`](#current-conversation-and-unread-counts) | `IEMChatManager` | Clears the local unread counts of all conversations. |
| [`sendMessageReadReceipts`](#current-conversation-and-unread-counts) | `IEMChatManager` | Sends read receipts for one-to-one or group messages. |
| [`deleteConversation`](#conversation-feature-list) / [`deleteServerConversation`](#conversation-feature-list) | `IEMChatManager` | Deletes a local conversation or a specified server-side conversation for the current user. |
| [`deleteAllMessagesAndConversations`](#conversation-feature-list) | `IEMChatManager` | Deletes all conversations and messages and determines whether to clear server-side data based on the parameter. |
| [`pinConversation`](#conversation-feature-list) | `IEMChatManager` | Pins or unpins a conversation. |
| [`addConversationMark`](#conversation-feature-list) / [`removeConversationMark`](#conversation-feature-list) | `IEMChatManager` | Adds tags to or removes tags from conversations. |
| [`deleteMessageWithId`](#conversation-feature-list) / [`deleteAllMessages`](#conversation-feature-list) | `EMConversation` | Deletes a specified local message or clears all local messages in the conversation. |
| [`pinMessage`](#conversation-feature-list) / [`unpinMessage`](#conversation-feature-list) | `IEMChatManager` | Pins or unpins a message in the conversation. |
| [`getPinnedMessagesFromServer`](#conversation-feature-list) | `IEMChatManager` | Retrieves pinned messages in the conversation from the server. |
