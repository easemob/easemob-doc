# Pin Conversations

## Feature overview

Conversation pinning places important one-to-one, group, or chat room conversations near the top of the conversation list, making it easier for users to quickly find frequently used or important conversations. The pin status is saved on the server and synchronized to the current user's other devices and local conversation data.

## Feature activation

Conversation pinning is part of the server-side conversation list feature. Before using it, activate the server-side conversation list feature in [Easemob Console](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Activate the [server-side conversation list feature](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Pin or unpin a conversation

Call `pinConversation` to pin or unpin a conversation. The pin status is stored on the server, and changes to the status update both the server-side and local data. Set `isPinned` to `true` to pin the conversation or `false` to unpin it. The operation result is returned through `EMError?` in the completion. `error == nil` indicates success.

With multi-device login, after the current user pins or unpins a conversation on one device, the other online devices receive the corresponding event through `multiDevicesConversationEvent`.

You can pin up to 50 conversations.

```swift
let conversationId = "conversationId"
let isPinned = true

EMClient.shared().chatManager?.pinConversation(
    conversationId,
    isPinned: isPinned
) { error in
    if let error {
        print("Failed to set the conversation pin status: \(error.errorDescription)")
    } else {
        print(isPinned ? "Conversation pinned successfully" : "Conversation unpinned successfully")
    }
}
```

The parameters are described as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | The conversation ID.<br/> - One-to-one chat: The peer user ID.<br/> - Group chat: The chat group ID.<br/> - Chat room: The chat room ID. |
| `isPinned` | Boolean | Whether to pin the conversation.<br/> - `true`: Pins the conversation.<br/> - `false`: Unpins the conversation. |
| `completionBlock` | `(EMError?) -> Void` | The result of the asynchronous operation. `error == nil` indicates success. Otherwise, handle the failure based on `EMError#code` and `EMError#errorDescription`. |

`pinConversation` does not directly return the updated conversation object. After the call succeeds, you can read the local conversation again and check its pin status:

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: false
)

if let conversation {
    let pinned = conversation.isPinned
    // The time when the conversation was pinned, in milliseconds. The value is `0` when the conversation is not pinned.
    let pinnedTime = conversation.pinnedTime
}
```

## Retrieve pinned conversations

The pin status is automatically synchronized with conversation data after login and written locally. Your application should read the local conversation list after synchronization is complete.

Before initializing the SDK, configure `EMOptions#dataSyncType` to include `.conversations`:

```swift
let options = EMOptions(appkey: "your-org#your-app")
options.dataSyncType = [.conversations]

if let error = EMClient.shared().initializeSDK(with: options) {
    print("Failed to initialize the SDK: \(error.errorDescription)")
}
```

Use `syncDataFinished` to monitor the completion of conversation data synchronization. When `error == nil` and `type` includes `.conversations`, you can read the sorted local conversation list and filter the pinned conversations:

```swift
final class PinnedConversationSyncListener: NSObject, EMClientDelegate {
    func syncDataFinished(_ error: EMError?, type: EMDataSyncType) {
        guard error == nil, type.contains(.conversations) else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        let pinnedConversations = conversations.filter { conversation in
            conversation.isPinned
        }

        // Refresh the pinned conversation list with pinnedConversations.
    }
}

let syncListener = PinnedConversationSyncListener()
EMClient.shared().add(syncListener, delegateQueue: nil)

// Remove the listener when it is no longer needed.
EMClient.shared().removeDelegate(syncListener)
```

The properties of `EMConversation` related to conversation pinning are as follows:

| Property | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | The conversation ID. |
| `type` | `EMConversationType` | The conversation type. The value is `.chat`, `.groupChat`, or `.chatRoom`. |
| `isPinned` | Boolean | Whether the conversation is pinned. |
| `pinnedTime` | Int64 | The UNIX timestamp when the conversation was pinned, in milliseconds. The value is `0` when the conversation is not pinned. |

:::tip
To load empty conversations from the local database, set `EMOptions#loadEmptyConversations` to `true` before initializing the SDK. The default value of this property is `false`, which does not load empty conversations.
:::

## Monitor local conversation list updates

When the local conversation list changes, the SDK returns the updated conversation array through `conversationListDidUpdate`. Your application can use the array returned in the callback to refresh the UI or read the sorted list with pinned conversations first again.

```swift
final class PinnedConversationListListener:
    NSObject,
    EMConversationDelegate {

    func conversationListDidUpdate(
        _ conversationList: [EMConversation]
    ) {
        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        // Refresh the UI with the latest conversations.
    }
}

let listListener = PinnedConversationListListener()
// When `nil` is passed for `delegateQueue`, the current implementation dispatches the callback to the main queue. If a custom queue is passed, switch to the main thread before updating the UI.
EMClient.shared().chatManager?.addConversation(delegate: listListener, queue: nil)

// Remove the listener when it is no longer needed.
EMClient.shared().chatManager?.removeConversation(delegate: listListener)
```

## Monitor multi-device conversation pin events

When the same user pins or unpins a conversation on another device, the current device receives a multi-device conversation event through `multiDevicesConversationEvent`:

| Swift event | Description |
| :--- | :--- | 
| `.conversationPinned` | The current user pinned a conversation on another device. |
| `.conversationUnpinned` | The current user unpinned a conversation on another device. |

```swift
final class PinnedConversationMultiDeviceListener:
    NSObject,
    EMMultiDevicesDelegate {

    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        guard event == .conversationPinned ||
                event == .conversationUnpinned else {
            return
        }

        let conversations =
            EMClient.shared().chatManager?.getAllConversations(true) ?? []

        // Refresh the UI with the latest conversations.
    }
}

let multiDeviceListener = PinnedConversationMultiDeviceListener()
EMClient.shared().addMultiDevices(
    delegate: multiDeviceListener,
    queue: nil
)

// Remove the listener when it is no longer needed.
EMClient.shared().removeMultiDevicesDelegate(multiDeviceListener)
```

:::tip
Multi-device events notify the current user's other online devices. After the current device initiates a pin operation, use the completion of `pinConversation` as the operation result and read the local conversation list again as needed.
:::

## Sorting and display recommendations

When you call `getAllConversations` and pass `true` for `isSort`, the SDK returns conversations in the following order:

- Pinned conversations precede unpinned conversations.
- Within the pinned and unpinned conversation groups, conversations are sorted by the timestamp of the last message in descending order.

When displaying the conversation list, use the order returned by the SDK directly. If your business needs to sort multiple pinned conversations by the most recent pin time, you can sort them by `EMConversation#pinnedTime` in descending order so that recently pinned conversations appear first.

```swift
// Retrieve the local conversation list.
// Pass true to sort conversations by the timestamp of the last message in descending order, with pinned conversations first.
let conversations = EMClient.shared().chatManager?
    .getAllConversations(true) ?? []

// Separate pinned and unpinned conversations.
// `isPinned` indicates whether a conversation is pinned.
let pinnedConversations = conversations.filter { $0.isPinned }
let unpinnedConversations = conversations.filter { !$0.isPinned }

// Sort pinned conversations by pin time in descending order so that recently pinned conversations appear first.
// pinnedTime is the Unix timestamp when the conversation was pinned, in milliseconds. The value is 0 for an unpinned conversation.
let sortedPinnedConversations = pinnedConversations.sorted {
    $0.pinnedTime > $1.pinnedTime
}

// Merge the lists, keeping pinned conversations before unpinned conversations.
// Retain the order returned by the SDK for unpinned conversations.
let sortedConversations =
    sortedPinnedConversations + unpinnedConversations
```

## Notes

- Conversation pinning supports one-to-one, group, and chat room conversations.
- `conversationId` cannot be empty. If the call fails, handle the failure based on `EMError#code` and `EMError#errorDescription` in the completion.
- You can pin up to 50 conversations.
- The conversation pin status is stored on the server and synchronized to the current user's other devices and local conversation data.
- Read and filter pinned conversations through local APIs after conversation data synchronization is complete.
- Conversation pinning does not affect message sending and receiving, conversation unread counts, message read status, or conversation tags.
- By default, the local database does not load empty conversations. To include them, set `EMOptions#loadEmptyConversations = true` before initialization.

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`pinConversation`](#pin-or-unpin-a-conversation) | `IEMChatManager` | Pins or unpins a specified conversation. |
| [`getConversation`](#pin-or-unpin-a-conversation) | `IEMChatManager` | Retrieves a local conversation object of the specified type. |
| [`pinnedTime`](#pin-or-unpin-a-conversation) | `EMConversation` | Retrieves the conversation pin timestamp. |
| [`dataSyncType`](#retrieve-pinned-conversations) | `EMOptions` | Sets the data types that are automatically synchronized after login. |
| [`initializeSDKWithOptions`](#retrieve-pinned-conversations) | `EMClient` | Initializes the iOS SDK with the specified configuration. |
| [`getAllConversations`](#retrieve-pinned-conversations) | `IEMChatManager` | Retrieves the local conversation array and determines whether to sort it based on the parameter. |
| [`loadEmptyConversations`](#retrieve-pinned-conversations) | `EMOptions` | Sets whether to include empty conversations when loading conversations from the local database. |
