# Conversation Overview

## Feature overview

A conversation is a collection of the message list and display state in a one-to-one chat, group chat, or chat room. It contains information such as the latest message, unread count, pin status, conversation tags, notification state, display name, and avatar.

The SDK maintains a local conversation list cache. After login, it can automatically synchronize the server-side conversation list, or your app can explicitly call an API to refresh the list from the server.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Register `ChatManager` during SDK initialization to use methods of `client.chatManager`.
- To use conversation-level Do Not Disturb (DND), also register `PushManager` during SDK initialization.
- Understand the EasyIM API [limitations](/product/limitation.html).

## Conversation model

### Conversation type and conversation ID

The SDK uniquely identifies a conversation by its type and ID. The conversation ID for each type is as follows:

| Conversation type | Conversation ID | Description |
| :--- | :--- | :--- |
| `singleChat` | Peer user ID | One-to-one conversation. |
| `groupChat` | Chat group ID | Group conversation. |
| `chatRoom` | Chat room ID | Chat room conversation. |

### Conversation list item

Each item in the conversation list is a `ConversationItem`, which is projected data from the SDK's local conversation list cache. Its main fields are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID. |
| `conversationType` | String | Conversation type. Possible values are `singleChat`, `groupChat`, and `chatRoom`. |
| `unreadCount` | Number | Number of unread messages in the conversation. |
| `lastMessage` | JSON \| null | Latest message summary. This field is `null` in an empty conversation. |
| `lastMessageAt` | Number | Timestamp of the latest message, in milliseconds. |
| `isPinned` | Boolean | Whether the conversation is pinned. |
| `pinnedTimestamp` | Number | Conversation pin timestamp, in milliseconds. |
| `marks` | Array | List of tags applied to the conversation. Tag slots range from 0 through 19, and their business meanings are maintained by the developer. |
| `readAt` | Number | Read position or read timestamp of the conversation. |
| `remindType` | String | Conversation notification type. Possible values are `DEFAULT`, `ALL`, `AT`, and `NONE`. |
| `conversationName` | String | Conversation display name. |
| `conversationAvatar` | String | Conversation avatar URL. |

:::tip
`ConversationItem` provides the basic fields required to display the conversation list, but it is not equivalent to complete user attributes, chat group details, or chat room details. Retrieve more complete information through the relevant user attribute, chat group, or chat room API as needed.
:::

## Create and update conversations

### Create or update conversations through messages

When a user sends or receives a message, the SDK creates or updates the local conversation list cache based on the conversation to which the message belongs:

- One-to-one message: The SDK creates or updates a one-to-one conversation based on the sender-recipient relationship.
- Group message: The SDK creates or updates a group conversation based on the chat group ID.
- Chat room message: The SDK creates or updates a chat room conversation based on the chat room ID.

When an online message is received, the SDK updates local display state such as the latest message, conversation order, and unread count. If the user is currently viewing that conversation, the SDK still updates its latest message and order but does not increment its local unread count. For details, see [Current conversation and unread count](#current-conversation-and-unread-count).

### Update the conversation list through server synchronization

During SDK initialization, `enableSyncData` includes `conversation` by default. After login succeeds, the SDK automatically synchronizes the conversation list from the server and updates the local conversation list cache.

To explicitly retrieve the latest conversation list from the server, call `refreshSessionList`. This method triggers the conversation list synchronization process and returns the refreshed list.

:::tip
To use the server-side conversation list, conversation pinning, and conversation tags, activate the corresponding features in EasyIM Console.
:::

## Conversation lists and empty conversations

The SDK provides the following two ways to read a conversation list:

| Method | API | Description |
| :--- | :--- | :--- |
| Refresh from the server | `refreshSessionList` | Retrieves the latest conversation list from the server and updates the SDK's local cache. Use `includeEmpty` to control whether empty conversations are returned. |
| Read locally | `getConversationList` | Reads existing non-empty conversations from the SDK's local conversation list cache without initiating a network request. Supports filtering by pin status or conversation tag. |

An empty conversation has no messages or has an empty latest message. For example, a conversation may become empty after all of its messages [expire](/product/product_package_feature.html), are [deleted](message_delete.html), or are [recalled](message_recall.html).

By default, `refreshSessionList` does not return empty conversations. To return them, set `includeEmpty` to `true`. When automatically synchronizing the conversation list after login, use `syncConversationListConfig.includeEmpty` to configure whether empty conversations are synchronized.

You can also [pin](conversation_pin.html) an empty conversation or [add a tag](conversation_mark.html#conversation-tags) to it.

:::tip
`getConversationList` reads non-empty conversations from the local conversation list cache and does not return empty conversations. To retrieve empty conversations, use the result of `refreshSessionList({ includeEmpty: true })`.
:::

## Current conversation and unread count

When a user enters a conversation page, we recommend calling `setCurrentConversation` to set the conversation currently being viewed. After it is set, when an online message arrives in that conversation, the SDK updates its latest message and order but does not increment its local unread count. This state is stored only in the memory of the current SDK instance. When the user leaves or switches conversation pages, call `resetCurrentConversation` to reset the current conversation state.

Call the following methods to clear conversation unread counts:

| Method | Description |
| :--- | :--- |
| `clearConversationUnreadMessageCount` | Clears the unread count of a specified one-to-one or group conversation. After the call succeeds, the SDK updates the conversation list cache on the current device; the current user's other logged-in devices receive `onConversationUnreadMessageCountCleared`. |
| `clearAllConversationUnreadMessageCount` | Clears the unread counts of all conversations. After the call succeeds, the SDK updates the conversation list cache on the current device; the current user's other logged-in devices receive `onAllConversationsUnreadMessageCountCleared`. |

:::tip
Clearing a conversation unread count updates the conversation's unread state for the current user and does not send a message read receipt to the peer. To inform the message sender that particular messages have been read, use [message read receipts](message_receipt.html).
:::

## Conversation feature list

Common conversation features provided by the SDK are as follows:

| Feature | Main API | Description |
| :--- | :--- | :--- |
| Conversation list | `refreshSessionList`, `getConversationList` | Refresh the list from the server or read non-empty conversations from the local cache. See [Conversation list](conversation_list.html). |
| Current conversation | `setCurrentConversation`, `resetCurrentConversation`, `getCurrentConversation` | Identifies the conversation currently being viewed to control local unread-count increments when online messages arrive. |
| Conversation unread count | `clearConversationUnreadMessageCount`, `clearAllConversationUnreadMessageCount` | Clear the unread count of one or all conversations. See [Clear Conversation Unread Counts](conversation_unread.html). |
| Delete conversations | `deleteConversation`, `clearAllMessagesAndConversations` | Delete a specified conversation, or clear all conversations and server-side roaming messages for the current user. See [Delete Conversations](conversation_delete.html). |
| Pin conversations | `setConversationPinned` | Pin or unpin a conversation. See [Pin Conversations](conversation_pin.html). |
| Conversation tags | `addConversationMark`, `removeConversationMark` | Add tags to or remove them from one or more conversations. See [Tag Conversations](conversation_mark.html). |
| Conversation DND | Conversation DND methods in `PushManager` | Set, query, or clear DND rules for one-to-one and group conversations. Chat room conversations do not support this feature. |
| Messages in a conversation | `getHistoryMessages`, `removeHistoryMessages`, and others | Retrieve or delete historical messages in a specified conversation. See [Retrieve Historical Messages](message_retrieve.html) and [Delete Messages](message_delete.html). |
| Pinned messages in a conversation | `pinMessage`, `unpinMessage`, `getPinnedMessageList` | Pin, unpin, or retrieve pinned messages in a specified conversation. Up to 20 messages are returned. See [Pin Messages](message_pin.html). |

## Conversation events

#### Conversation list events

The SDK provides conversation and conversation list events through `client.chatManager.addEventHandler` and `client.addEventHandler`.

| Conversation event | Trigger conditions | Description |
| :--- | :--- | :--- |
| `onConversationListUpdate` | Triggered when the conversation list changes, such as during conversation synchronization, message sending or receiving, user profile changes, pinning, tagging, deletion, or unread-count clearing. | `items` is the SDK's current complete and sorted conversation list snapshot. To retain custom business fields, use `patch` for incremental merging. |
| `onSyncDataStart` | Triggered when the SDK starts automatic data synchronization. | This is a global synchronization event. A `payload.dataType` value of `conversation` indicates that conversation list synchronization has started. |
| `onSyncDataFinished` | Triggered when the SDK finishes automatic data synchronization. | This is a global synchronization event. A `payload.dataType` value of `conversation` indicates that conversation list synchronization has finished. Obtain the result from `status` and `error`. |

#### Multi-device conversation events

| Conversation event | Trigger conditions | Description |
| :--- | :--- | :--- |
| `onConversationUnreadMessageCountCleared` | Received on this device after the current user clears a single conversation's unread count on another device. | Synchronizes the cleared unread-count state across devices. The event contains `conversationId`, `conversationType`, and `timestamp`. |
| `onAllConversationsUnreadMessageCountCleared` | Received on this device after the current user clears all conversation unread counts on another device. | Synchronizes the cleared state of all conversation unread counts across devices. This event has no payload. |
| `onMultiDeviceConversation` | Triggered when the current user performs a conversation operation on another device, such as deleting, pinning or unpinning a conversation, adding a tag, or changing conversation DND. | Reports multi-device conversation operations. The event contains `operation`, `conversationId`, `conversationType`, and other information. |

## Best practices

- When displaying the conversation list, preferentially monitor `onConversationListUpdate` and use its `items` to refresh the UI.
- To explicitly read the current local conversation list, call `getConversationList`. It does not initiate a network request or return empty conversations.
- To refresh the conversation list from the server or retrieve empty conversations, call `refreshSessionList`.
- When the user enters a conversation page, call `setCurrentConversation`; when the user leaves or switches pages, call `resetCurrentConversation`.
- Clearing a conversation unread count and sending a message read receipt are different features. The former updates the current user's conversation unread state, while the latter notifies the original sender that a message was read.
- Messages sent through the RESTful API do not create or enter the conversation list by default. To write such messages to the conversation list, activate the corresponding feature in EasyIM Console.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`refreshSessionList`](#conversation-lists-and-empty-conversations) | `ChatManager` | Refresh the conversation list from the server and optionally return empty conversations. |
| [`getConversationList`](#conversation-lists-and-empty-conversations) | `ChatManager` | Read existing non-empty conversations from the SDK's local conversation list cache. |
| [`setCurrentConversation`](#current-conversation-and-unread-count) | `ChatManager` | Set the conversation currently being viewed so subsequent online messages do not increment its local unread count. |
| [`resetCurrentConversation`](#current-conversation-and-unread-count) | `ChatManager` | Reset the current conversation and restore the default unread-count increment rule. |
| [`getCurrentConversation`](#current-conversation-and-unread-count) | `ChatManager` | Retrieve the conversation currently being viewed. |
| [`clearConversationUnreadMessageCount`](#current-conversation-and-unread-count) | `ChatManager` | Clear the unread count of a specified one-to-one or group conversation. |
| [`clearAllConversationUnreadMessageCount`](#current-conversation-and-unread-count) | `ChatManager` | Clear the unread counts of all conversations. |
| [`deleteConversation`](#conversation-feature-list) | `ChatManager` | Delete a specified conversation. |
| [`clearAllMessagesAndConversations`](#conversation-feature-list) | `ChatManager` | Clear all conversations and server-side roaming messages for the current user. |
| [`setConversationPinned`](#conversation-feature-list) | `ChatManager` | Pin or unpin a specified conversation. |
| [`addConversationMark`](#conversation-feature-list) | `ChatManager` | Add a tag to a conversation. |
| [`removeConversationMark`](#conversation-feature-list) | `ChatManager` | Remove a conversation tag. |
| [`getHistoryMessages`](#conversation-feature-list) | `ChatManager` | Retrieve historical messages in a specified conversation. |
| [`removeHistoryMessages`](#conversation-feature-list) | `ChatManager` | Delete historical messages in a specified conversation. |
| [`pinMessage`](#conversation-feature-list) | `ChatManager` | Pin a specified message in a conversation. |
| [`unpinMessage`](#conversation-feature-list) | `ChatManager` | Unpin a specified message in a conversation. |
| [`getPinnedMessageList`](#conversation-feature-list) | `ChatManager` | Retrieve pinned messages in a specified conversation. |
