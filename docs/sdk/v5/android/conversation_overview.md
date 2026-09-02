# Conversation Overview

## Feature overview

A conversation is a collection of messages in a one-to-one chat, group chat, or chat room. The SDK represents a local conversation with `EMConversation`. Your app can read data such as the conversation ID, conversation type, latest message, unread count, pin status, conversation tags, and local extension field.

The SDK can [automatically synchronize server-side conversation data after login and write it locally](initialization.html#set-automatic-data-synchronization-after-login). After synchronization is complete, your app reads and displays the conversation list through local APIs.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- To use value-added features such as the server-side conversation list, conversation pinning, or conversation tags, activate the corresponding features in EasyIM Console.

## Conversation model

### Conversation type and conversation ID

The SDK identifies a conversation by its type and ID:

| Conversation type | `EMConversationType` | Conversation ID |
| :--- | :--- | :--- |
| One-to-one chat | `Chat` | Peer user ID. |
| Group chat | `GroupChat` | Chat group ID. |
| Chat room | `ChatRoom` | Chat room ID. |

### Conversation object

Each item in the conversation list is an `EMConversation`. Common APIs are as follows:

| API | Description |
| :--- | :--- |
| `conversationId()` | Retrieves the conversation ID. |
| `getType()` | Retrieves the conversation type. |
| `getUnreadMsgCount()` | Retrieves the local unread message count of the conversation. |
| `getLastMessage()` | Retrieves the latest message in the conversation. |
| `isPinned()` | Retrieves whether the conversation is pinned. |
| `getPinnedTime()` | Retrieves the conversation pin time in milliseconds. Returns `0` if the conversation is not pinned. |
| `marks()` | Retrieves the set of conversation tags. |
| `getExtField()` / `setExtField(String)` | Retrieves or sets the conversation's local extension field. |

:::tip
`EMConversation` mainly contains data related to local conversations and messages. It is not equivalent to complete user attributes, chat group details, or chat room details. To display complete information such as names and avatars, call the relevant user attribute, chat group, or chat room APIs based on the conversation type.
:::

## Create and update conversations

### Create or update conversations through messages

When messages are sent or received, the SDK creates or updates the local conversation to which the message belongs:

- One-to-one message: Creates or updates a one-to-one conversation based on the peer user ID.
- Group message: Creates or updates a group conversation based on the chat group ID.
- Chat room message: Creates or updates a chat room conversation based on the chat room ID.

After receiving an online message, the SDK updates local state such as the conversation's latest message, order, and unread count.

### Create a local conversation through an API

When calling `getConversation(String, EMConversationType, boolean)`, set `createIfNotExists` to `true` to create a conversation object if the specified conversation does not exist locally. If it is `false`, the SDK does not create the conversation and returns `null` when it is not found.

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(
                conversationId,
                EMConversationType.Chat,
                true);
```

`getConversation(String)` and `getConversation(String, EMConversationType)` only look for existing conversations and do not create them automatically.

### Update the conversation list through server synchronization

Before calling `EMClient#init`, configure `EMDataSyncType.CONVERSATIONS` through `EMOptions#setDataSyncType`. After login succeeds, the SDK automatically synchronizes server-side conversation data and writes it locally.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

Your app can monitor conversation data synchronization through `EMConnectionListener#onDataSyncStart` and `onDataSyncFinish`. When `type` is `CONVERSATIONS` and `errorCode` is `EMError.EM_NO_ERROR`, the latest conversation list can be read locally.

## Conversation lists and empty conversations

The SDK provides the following ways to read the local conversation list:

| Method | API | Description |
| :--- | :--- | :--- |
| Sorted list | `getAllConversationsBySort()` | Returns a list with pinned conversations first. Within the pinned and unpinned sections, conversations are sorted by the timestamp of the latest message in descending order. |
| Conversation map | `getAllConversations()` | Returns a `Map<String, EMConversation>` keyed by conversation ID. |
| Database filter | `asyncFilterConversationsFromDB(...)` | Loads all conversations from the local database or filters them using custom criteria. |

An empty conversation contains no messages. For example, a conversation may become empty after all its messages expire, are cleared, or are recalled.

When your app loads conversations from the local database, `EMOptions#setLoadEmptyConversations` controls whether empty conversations are included. This option defaults to `false`. To include empty conversations, set it to `true` before calling `EMClient#init`.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setLoadEmptyConversations(true);

EMClient.getInstance().init(getApplicationContext(), options);
```

You can also pin, tag, and delete empty conversations.

## Current conversation and unread count

After your app enters a conversation page and finishes processing messages, clear the conversation unread count as required by your business:

| API | Description |
| :--- | :--- |
| `asyncClearConversationUnreadMessageCount` | Clears the local unread count of a specified conversation and synchronizes the change to the current account's other devices. |
| `asyncClearAllConversationUnreadMessageCount` | Clears the local unread counts of all conversations and synchronizes the change to the current account's other devices. |

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncClearConversationUnreadMessageCount(
                conversationId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The unread message count of the specified conversation has been cleared.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

:::tip
Clearing a conversation unread count does not send a message read receipt to the peer. To notify the original sender that messages have been read, call `asyncSendMessageReadReceipts`. For details, see [Message Read Receipts](message_receipt.html).
:::

## Conversation feature list

| Feature | Main API | Description |
| :--- | :--- | :--- |
| Conversation list | `getAllConversationsBySort`, `getAllConversations`, `asyncFilterConversationsFromDB` | Reads the conversation list from local memory or the database. See [Conversation List](conversation_list.html). |
| Conversation unread count | `getUnreadMessageCount`, `getUnreadMsgCount`, `asyncClearConversationUnreadMessageCount`, `asyncClearAllConversationUnreadMessageCount` | Retrieves or clears conversation unread counts. See [Conversation Unread Counts](conversation_unread.html). |
| Delete conversations | `deleteConversation`, `asyncDeleteConversations`, `deleteConversationFromServer`, `asyncDeleteAllMsgsAndConversations` | Deletes local or server-side conversations and messages. See [Delete Conversations](conversation_delete.html). |
| Pin conversations | `asyncPinConversation` | Pins or unpins a conversation. See [Pin Conversations](conversation_pin.html). |
| Conversation tags | `asyncAddConversationMark`, `asyncRemoveConversationMark` | Adds tags to or removes them from one or more conversations. See [Tag Conversations](conversation_mark.html). |
| Conversation DND | Conversation DND APIs in `EMPushManager` | Sets or queries DND rules for one-to-one and group conversations. |
| Messages in a conversation | `loadMoreMsgFromDB`, `searchMsgFromDB`, `removeMessage`, `clearAllMessages` | Retrieves, searches for, or deletes local messages in a conversation. |
| Pinned messages in a conversation | `asyncPinMessage`, `asyncUnPinMessage`, `asyncGetPinnedMessagesFromServer` | Pins, unpins, or retrieves pinned messages in a conversation. |

## Conversation events

#### Conversation list events

When a local conversation changes, the SDK triggers `EMConversationListener#onConversationUpdate`. This callback does not return the complete conversation list. Your app should read the local conversation list again and refresh the UI.

```java
EMConversationListener conversationListener =
        new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                List<EMConversation> conversations = EMClient.getInstance()
                        .chatManager()
                        .getAllConversationsBySort();
                // Refresh the UI with the latest conversation list.
            }
        };

EMClient.getInstance()
        .chatManager()
        .addConversationListener(conversationListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance()
        .chatManager()
        .removeConversationListener(conversationListener);
```

Monitor the start and completion of automatic conversation synchronization through `EMConnectionListener#onDataSyncStart` and `onDataSyncFinish`.

#### Multi-device conversation events

Register `EMMultiDeviceListener` through `EMClient#addMultiDeviceListener` to receive conversation operations performed on the current account's other devices in `onConversationEvent`. Common events include:

- `CONVERSATION_PINNED`: Another device pins a conversation.
- `CONVERSATION_UNPINNED`: Another device unpins a conversation.
- `CONVERSATION_DELETED`: Another device deletes a server-side conversation.
- `CONVERSATION_MARK_UPDATE`: Another device updates conversation tags.
- `CONVERSATION_MUTE_INFO_CHANGED`: Another device updates conversation DND settings.
- `CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`: Another device clears the unread count of a specified conversation.
- `ALL_CONVERSATION_UNREAD_MESSAGECOUNT_CLEARED`: Another device clears the unread counts of all conversations.

When monitoring is no longer needed, call `EMClient#removeMultiDeviceListener` to remove the listener.

## Best practices

- Configure `EMDataSyncType.CONVERSATIONS` before initializing the SDK, and read the local conversation list after conversation data synchronization succeeds.
- Prefer `getAllConversationsBySort` when displaying the conversation list, and directly use the pinned-first order returned by the SDK.
- Register `EMConversationListener`. After receiving `onConversationUpdate`, read the conversation list again and refresh the UI.
- Remove `EMConversationListener`, `EMConnectionListener`, and `EMMultiDeviceListener` when the page or component is destroyed to avoid duplicate callbacks and memory leaks.
- Clearing a conversation unread count and sending a message read receipt are independent features. The former updates the current account's conversation unread state, while the latter notifies the original sender that messages have been read.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`conversationId`](#conversation-object) / [`getType`](#conversation-object) | `EMConversation` | Retrieves the conversation ID and type. |
| [`getUnreadMsgCount`](#conversation-object) / [`getLastMessage`](#conversation-object) | `EMConversation` | Retrieves the conversation unread count and latest message. |
| [`getConversation`](#create-a-local-conversation-through-an-api) | `EMChatManager` | Finds a local conversation and optionally creates it if it does not exist. |
| [`setAppKey`](#update-the-conversation-list-through-server-synchronization) | `EMOptions` | Sets the App Key of the app. |
| [`setDataSyncType`](#update-the-conversation-list-through-server-synchronization) | `EMOptions` | Sets the data types automatically synchronized after login succeeds. |
| [`init`](#update-the-conversation-list-through-server-synchronization) | `EMClient` | Initializes the SDK with the specified configuration. |
| [`getAllConversationsBySort`](#conversation-lists-and-empty-conversations) | `EMChatManager` | Retrieves the local conversation list with pinned conversations first. |
| [`getAllConversations`](#conversation-lists-and-empty-conversations) | `EMChatManager` | Retrieves the local conversation map keyed by conversation ID. |
| [`asyncFilterConversationsFromDB`](#conversation-lists-and-empty-conversations) | `EMChatManager` | Loads all conversations from the local database or filters them. |
| [`setLoadEmptyConversations`](#conversation-lists-and-empty-conversations) | `EMOptions` | Sets whether to include empty conversations when loading from the local database. |
| [`asyncClearConversationUnreadMessageCount`](#current-conversation-and-unread-count) | `EMChatManager` | Clears the local unread message count of a specified conversation. |
| [`asyncClearAllConversationUnreadMessageCount`](#current-conversation-and-unread-count) | `EMChatManager` | Clears the local unread message counts of all conversations. |
| [`asyncSendMessageReadReceipts`](#current-conversation-and-unread-count) | `EMChatManager` | Sends read receipts for one-to-one or group messages. |
| [`getUnreadMessageCount`](#conversation-feature-list) | `EMChatManager` | Retrieves the total unread message count of local one-to-one and group conversations. |
| [`deleteConversation`](#conversation-feature-list) / [`deleteConversationFromServer`](#conversation-feature-list) | `EMChatManager` | Deletes a local conversation or a specified server-side and local conversation for the current user. |
| [`asyncDeleteConversations`](#conversation-feature-list) | `EMChatManager` | Asynchronously batch deletes local conversations and optionally their local messages. |
| [`asyncDeleteAllMsgsAndConversations`](#conversation-feature-list) | `EMChatManager` | Deletes all messages and conversations and optionally clears server-side data. |
| [`asyncPinConversation`](#conversation-feature-list) | `EMChatManager` | Pins or unpins a conversation. |
| [`asyncAddConversationMark`](#conversation-feature-list) / [`asyncRemoveConversationMark`](#conversation-feature-list) | `EMChatManager` | Adds tags to or removes them from conversations. |
| [`loadMoreMsgFromDB`](#conversation-feature-list) / [`searchMsgFromDB`](#conversation-feature-list) | `EMConversation` | Loads or searches for conversation messages in the local database by page. |
| [`removeMessage`](#conversation-feature-list) / [`clearAllMessages`](#conversation-feature-list) | `EMConversation` | Deletes a specified local message or clears all local messages in a conversation. |
| [`asyncPinMessage`](#conversation-feature-list) / [`asyncUnPinMessage`](#conversation-feature-list) | `EMChatManager` | Pins or unpins a message in a conversation. |
| [`asyncGetPinnedMessagesFromServer`](#conversation-feature-list) | `EMChatManager` | Retrieves pinned messages in a conversation from the server. |
