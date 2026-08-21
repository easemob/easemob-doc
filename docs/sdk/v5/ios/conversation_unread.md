# Conversation Unread Counts

## Feature overview

A conversation unread count indicates the number of messages that the current user has not read in a conversation. You can retrieve the unread message count of a specified conversation or all local conversations, and you can clear the unread message count of a specified conversation or all conversations.

With multi-device login, clearing conversation unread counts is synchronized to the other devices on which the current account is logged in.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Understand the tech

The core process for clearing conversation unread counts is as follows:

![](/images/ios/conversation_unread_count_clear.png)

The basic steps for clearing conversation unread counts are as follows:

1. After the user enters a conversation page, the application records the current conversation ID and calls `IEMChatManager#clearConversationUnreadMessageCount:completion:` as needed to clear the unread count of this conversation.
2. After the call succeeds, the SDK updates the unread count of the target conversation in the local database to `0` and synchronizes the operation to the other devices on which the current user is logged in.
3. The application should refresh the current conversation and conversation list UI after the `completion` callback succeeds. You can also monitor conversation list changes through `EMConversationDelegate#conversationListDidUpdate:`.
4. The clear operation does not notify the conversation peer or trigger a message read receipt on the peer device. With multi-device login, the current user's other devices can detect this operation through multi-device conversation events provided by `EMMultiDevicesDelegate`.
5. To clear the unread counts of all conversations, call `IEMChatManager#clearAllConversationUnreadMessageCount:`. This API clears the unread counts of all conversations in the local database and synchronizes the operation to the other devices on which the current user is logged in.

:::tip 
Clearing a conversation unread count does not send a notification to the conversation peer or automatically send message read receipts. To let the message sender know that a message has been read, use the message read receipt feature. 
:::

## Retrieve the unread count for all conversations

Call `getUnreadMessageCount` to directly retrieve the total number of unread messages in local conversations that meet the counting criteria, without iterating over the conversation list and adding the counts manually.

The API counts conversations as follows:

- Chat room conversations are not counted.
- Unread messages in message threads are not counted.
- Conversations whose push notification mode is `EMPushRemindTypeMentionOnly` or `EMPushRemindTypeNone` are not counted. Even if these conversations contain unread messages, they are excluded from the count.
- Only one-to-one and group conversations whose push notification mode is `EMPushRemindTypeAll` are counted.

```swift
let unreadCount = EMClient.shared().chatManager?.getUnreadMessageCount() ?? 0
```

## Retrieve the unread count for a specified conversation

Call `getConversation` to retrieve a specified conversation locally and then read the `unreadMessagesCount` property of the conversation.

When querying the unread count, set `createIfNotExist` to `false` to avoid creating an empty local conversation for a conversation that does not exist. The example returns `0` for both "the conversation does not exist" and "the conversation unread count is `0`." If your business needs to distinguish these two cases, separately check whether `conversation` is `nil`.

```swift
let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    // Use `.chat`, `.groupChat`, or `.chatRoom` for a one-to-one chat, group chat, or chat room, respectively.
    type: .chat,
    // Whether to automatically create the conversation if it does not exist.
    createIfNotExist: false
)

let unreadCount = Int(conversation?.unreadMessagesCount ?? 0)
```

## Clear the unread counts of all conversations

Call `clearAllConversationUnreadMessageCount(_:)` to clear the unread counts of all local conversations. The cleared status is synchronized to the current account's other devices, but no read receipt is sent to the message sender.

Other logged-in devices receive an `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` event through `multiDevicesConversationEvent`.

The completions for clearing a specified conversation and clearing all conversations are both executed on the main queue. You can refresh the UI directly after the operation succeeds.

```swift
EMClient.shared().chatManager?
    .clearAllConversationUnreadMessageCount { error in
        if let error {
            print("Failed to clear the unread counts of all conversations: \(error.errorDescription)")
        } else {
            print("Cleared the unread counts of all conversations")
        }
    }
```

:::tip
Clearing conversation unread counts does not send read receipts to message senders. To send message-level read receipts, call `sendMessageReadReceipts` separately. This API supports only one-to-one and group chats, not chat rooms. For details, see [Message receipt documentation](message_receipt.html).
:::

## Clear the unread count of a specified conversation

Call `clearConversationUnreadMessageCount` to clear the local unread count of a specified conversation. This status is synchronized to the current account's other devices, but the message sender is not notified.

Other logged-in devices receive an `EMMultiDevicesEventConversationUnreadMessageCountCleared` event through `multiDevicesConversationEvent`. The callback also contains the conversation ID and conversation type.

:::tip
Clearing a conversation unread count does not send read receipts to message senders. To send message-level read receipts, call `sendMessageReadReceipts` separately. This API supports only one-to-one and group chats, not chat rooms. For details, see [Message receipt documentation](message_receipt.html).
:::

```swift
EMClient.shared().chatManager?.clearConversationUnreadMessageCount(
    conversationId
) { error in
    if let error {
        print("Failed to clear the conversation unread count: \(error.errorDescription)")
    } else {
        print("Conversation unread count cleared")
    }
}
```

## Monitor unread count changes on other devices

To synchronize conversation unread counts across multiple devices, activate the multi-device service. For details, see [Log in on multiple devices](multi_device.html).

Assume that the current user is logged in on device A and device B at the same time:

 - After the user clears the unread count of a specified conversation on device A, device B receives an `EMMultiDevicesEventConversationUnreadMessageCountCleared` event.
 - After the user clears the unread counts of all conversations on device A, device B receives an `EMMultiDevicesEventAllConversationUnreadMessageCountCleared` event.

Implement the `EMMultiDevicesDelegate` protocol and call `addMultiDevices` to register the multi-device delegate. After receiving the `multiDevicesConversationEvent` callback, read the conversation data in the SDK again and refresh the UI.

```swift
final class ConversationListViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()

        // When nil is passed for queue, the SDK executes the callback on the main queue.
        EMClient.shared().addMultiDevices(delegate: self, queue: nil)
    }

    deinit {
        // Remove the multi-device delegate.
        EMClient.shared().removeMultiDevicesDelegate(self)
    }
}

extension ConversationListViewController: EMMultiDevicesDelegate {
    func multiDevicesConversationEvent(
        _ event: EMMultiDevicesEvent,
        conversationId: String,
        conversationType: EMConversationType
    ) {
        switch event {
        case .conversationUnreadMessageCountCleared:
            // The unread count of the specified conversation was cleared on another device.
            // Read the latest local conversation data again.
            let conversations = EMClient.shared().chatManager?.getAllConversations() ?? []
            let conversation = conversations.first {
                $0.conversationId == conversationId && $0.type == conversationType
            }
            let unreadCount = conversation?.unreadMessagesCount ?? 0
            // Refresh the unread count of this conversation based on unreadCount.

        case .allConversationUnreadMessageCountCleared:
            // The unread counts of all conversations were cleared on another device.
            let unreadCount = EMClient.shared().chatManager?.getUnreadMessageCount() ?? 0
            // Refresh the conversation list and application badge based on unreadCount.

        default:
            break
        }
    }
}
```

:::tip 
Multi-device callbacks notify the application that data has changed. Read the SDK's local conversation data again in the callback instead of changing only the number cached in the UI. The APIs for clearing unread counts do not automatically update the application UI or iOS application badge. Update them based on the latest unread count in the completion or multi-device callback.
:::

## Read status and read receipts for individual messages

You can query the read status of a one-to-one message through `EMChatMessage.isRead`, but you cannot modify it through this API.

To notify the message sender that the message has been read, call `sendMessageReadReceipts`. The message sender can receive a unified list of read receipts for one-to-one and group chats through `EMChatManagerDelegate.onMessageReadReceipts`. The element type is `EMMessageReadReceipt`.

For details about message read receipts and read status, see [Message receipt documentation](message_receipt.html).

:::tip
[Sending message read receipts](message_receipt.html) and clearing conversation unread counts are two independent operations:<br> - `sendMessageReadReceipts`: Notifies the message sender. It supports only one-to-one and group chats and does not change the conversation unread count.<br> - `clearConversationUnreadMessageCount`: Clears the local unread count of a specified conversation and synchronizes the change to the current account's other devices. It does not notify the message sender.
:::

## API list

| API | Module/Type | Supports chat rooms | Description |
| :--- | :--- | :--- | :--- |
| [`getUnreadMessageCount`](#retrieve-the-unread-count-for-all-conversations) | `IEMChatManager` | No | Retrieves the total number of unread messages in local conversations that meet the counting criteria. |
| [`filterConversationsFromDB`](#retrieve-the-unread-count-for-all-conversations) | `IEMChatManager` | Yes | Loads all or filtered conversations from the local database. |
| [`cleanConversationsMemoryCache`](#retrieve-the-unread-count-for-all-conversations) | `IEMChatManager` | Yes | Clears all conversation caches from memory. This affects the completeness of subsequent unread count statistics. |
| [`getConversation`](#retrieve-the-unread-count-for-a-specified-conversation) | `IEMChatManager` | Yes | Retrieves a local conversation object of the specified type. |
| [`unreadMessagesCount`](#retrieve-the-unread-count-for-a-specified-conversation) | `EMConversation` | Yes | Retrieves the local unread message count of a specified conversation. |
| [`clearAllConversationUnreadMessageCount`](#clear-the-unread-counts-of-all-conversations) | `IEMChatManager` | Yes | Clears the unread counts of all local conversations and synchronizes the change to the current account's other devices. |
| [`clearConversationUnreadMessageCount`](#clear-the-unread-count-of-a-specified-conversation) | `IEMChatManager` | Yes | Clears the local unread count of a specified conversation and synchronizes the change to the current account's other devices. |
| [`sendMessageReadReceipts`](#read-status-and-read-receipts-for-individual-messages) | `IEMChatManager` | No | Batch sends read receipts for up to 50 messages in the same one-to-one or group conversation. |
