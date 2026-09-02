# Tag Conversations

## Feature overview

Conversation tags are used to assign business categories to conversations, such as starred, pending, or important customers. The iOS SDK supports adding tags to or removing tags from one-to-one, group, and chat room conversations.

The SDK provides 20 tags, from `EMMarkType0` through `EMMarkType19`. A conversation can contain up to 20 tags at the same time. Your application defines and maintains the mapping between each tag and its business meaning. In Swift, the corresponding enum values are `.markType0` through `.markType19`.

```swift
let markMapping: [EMMarkType: String] = [
    .markType0: "important",
    .markType1: "pending",
    .markType2: "customer"
]
```

:::tip
Conversation tags are used only for business classification and filtering. They do not affect conversation unread counts, message sending and receiving, message read status, or conversation pin status.
:::

## Feature activation

Conversation tags are part of the server-side conversation list feature. Before using them, activate the server-side conversation list feature in [EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Activate the [server-side conversation list feature](/product/console/basic_message_conversation.html#server-side-conversation-list).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Add conversation tags

Call `addConversationMark` to add a specified tag to one or more conversations. This operation updates the server-side and local conversation tags at the same time. You can pass up to 20 conversation IDs in a single call.

After a conversation tag is added, the SDK updates the server-side and local tag data at the same time. Before initializing the SDK, configure `EMOptions#dataSyncType` to include `EMDataSyncTypeConversations`. After login, when `syncDataFinished` reports that conversation data synchronization has succeeded, you can retrieve an `EMConversation` object through a local conversation list API and retrieve all tags of the conversation through `EMConversation#marks`.

If the server-side conversation list reaches its quantity limit, which is 100 conversations by default, the server may remove inactive conversations based on conversation activity. Their tags might also no longer be synchronized to the local device with the server-side conversation list.

```swift
let conversationIds = [
    "user2",
    "group1"
]

EMClient.shared().chatManager?.addConversationMark(
    conversationIds,
    mark: .markType0
) { error in
    if let error {
        print("Failed to add the conversation tag: \(error.errorDescription)")
    } else {
        print("Conversation tag added successfully")
    }
}
```

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationIds` | `[String]` | The array of conversation IDs. It cannot be empty and can contain up to 20 IDs in a single call.<br/> - One-to-one chat: The peer user ID.<br/> - Group chat: The chat group ID.<br/> - Chat room: The chat room ID. |
| `mark` | `EMMarkType` | The tag to add. The value ranges from `.markType0` through `.markType19`. |
| `completion` | `(EMError?) -> Void` | The result of the asynchronous operation. `error == nil` indicates success. Otherwise, handle the failure based on `EMError#code` and `EMError#errorDescription`. |

:::tip
Conversation tags do not mark a conversation as "messages read" or "messages unread." To clear a conversation unread count, use the conversation unread count API.
:::

## Remove conversation tags

Call `removeConversationMark` to remove a specified tag from one or more conversations. This operation updates the server-side and local conversation tags at the same time. You can pass up to 20 conversation IDs in a single call.

```swift
let conversationIds = [
    "user2",
    "group1"
]

EMClient.shared().chatManager?.removeConversationMark(
    conversationIds,
    mark: .markType0
) { error in
    if let error {
        print("Failed to remove the conversation tag: \(error.errorDescription)")
    } else {
        print("Conversation tag removed successfully")
    }
}
```

The parameter rules for `removeConversationMark` are the same as those for [adding tags](#add-conversation-tags). Removing a tag does not affect other existing tags of the conversation.

## Filter the conversation list by tag

Before initializing the SDK, configure `EMOptions#dataSyncType` to include `.conversations`. After login, wait for conversation data synchronization to finish and then filter conversations by the local `EMConversation#marks` property.

Configure conversation synchronization before initializing the SDK:

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}
```

Use `syncDataFinished` to monitor the completion of conversation data synchronization. When `error == nil` and `type` includes `.conversations`, you can read and filter the local conversation list:

```swift
final class ConversationMarkSyncListener: NSObject, EMClientDelegate {
    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)
        let markedConversations = conversations.filter { conversation in
            conversation.marks.contains(targetMark)
        }

        // Refresh the business list with markedConversations.
    }
}

let syncListener = ConversationMarkSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)
```

To load conversations from the local database and filter them by tag, you can also use `filterConversationsFromDB` directly:

```swift
let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)

let markedConversations = EMClient.shared().chatManager?
    .filterConversationsFromDB(
        cleanMemoryCache: false,
        filter: { conversation in
            conversation.marks.contains(targetMark)
        }
    ) ?? []
```

To retrieve all tags of a single local conversation, call `getConversation` to retrieve the conversation and then read `EMConversation#marks`:

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    "conversationId",
    type: .chat,
    createIfNotExist: false
)

let marks = conversation?.marks ?? []
```

:::tip
`getAllConversations`, `filterConversationsFromDB`, and `getConversation` all read local data and do not proactively request the latest tags from the server. To obtain the latest server-side status, first wait until conversation data synchronization succeeds.
:::

## Monitor conversation list updates

When the local conversation list changes, the SDK returns the updated conversation array through `conversationListDidUpdate`. Your application can filter the conversations with the target tag again and refresh the UI.

```swift
final class ConversationMarkListListener: NSObject, EMConversationDelegate {
    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let targetMark = NSNumber(value: EMMarkType.markType0.rawValue)
        let markedConversations = conversationList.filter { conversation in
            conversation.marks.contains(targetMark)
        }

        // Refresh the UI with markedConversations.
    }
}

let listListener = ConversationMarkListListener()
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// Remove the listener when it is no longer needed.
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

When the same user adds or removes a conversation tag on another device, the current device can receive a `.conversationUpdateMark` event through `multiDevicesConversationEvent`. The corresponding Objective-C enum value is `EMMultiDevicesEventConversationUpdateMark`, whose numeric value is 63.

```swift
final class ConversationMarkMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        guard event == .conversationUpdateMark else {
            return
        }

        // Another device updated a conversation tag. Read the local conversations again and refresh the UI.
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []
    }
}

let multiDeviceListener = ConversationMarkMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// Remove the listener when it is no longer needed.
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

## Notes

- Conversation tags support one-to-one, group, and chat room conversations.
- The Objective-C tag values range from `EMMarkType0` through `EMMarkType19`, and the corresponding Swift values range from `.markType0` through `.markType19`. Your application maintains their specific business meanings.
- A single conversation can contain up to 20 tags at the same time.
- `addConversationMark` and `removeConversationMark` can operate on multiple conversations at the same time. You can pass up to 20 conversation IDs in a single call.
- The conversation ID array cannot be empty. If the call fails, handle the failure based on `EMError#code` and `EMError#errorDescription` in the completion.
- Conversation tags update the server-side and local conversation data at the same time and are synchronized to the current user's other devices.
- Conversation tags do not affect conversation unread counts, message read status, message sending and receiving, or conversation pin status.
- Read and filter conversations through local APIs after conversation data synchronization is complete.
- If the server-side conversation list reaches its quantity limit, inactive conversations may be removed from the server-side conversation list. Their tags might also no longer be returned with the conversation list.

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`addConversationMark`](#add-conversation-tags) | `IEMChatManager` | Adds a specified tag to one or more conversations and updates the server-side and local data at the same time. |
| [`removeConversationMark`](#remove-conversation-tags) | `IEMChatManager` | Removes a specified tag from one or more conversations and updates the server-side and local data at the same time. |
| [`dataSyncType`](#filter-the-conversation-list-by-tag) | `EMOptions` | Sets the data types that are automatically synchronized after login. |
| [`initializeSDKWithOptions`](#filter-the-conversation-list-by-tag) | `EMClient` | Initializes the iOS SDK with the specified configuration. |
| [`getAllConversations`](#filter-the-conversation-list-by-tag) | `IEMChatManager` | Retrieves the sorted local conversation array. |
| [`filterConversationsFromDB`](#filter-the-conversation-list-by-tag) | `IEMChatManager` | Reads and filters conversations from the local database. |
| [`getConversation`](#filter-the-conversation-list-by-tag) | `IEMChatManager` | Retrieves a local conversation object of the specified type. |
| [`marks`](#filter-the-conversation-list-by-tag) | `EMConversation` | Retrieves all tags of the conversation. The return type is `NSArray<NSNumber *>`, or `[NSNumber]` in Swift. |
