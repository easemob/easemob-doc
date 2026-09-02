# Conversation List

## Feature overview

- **Local conversation list:** For one-to-one, group, and chat room conversations, the SDK creates or updates a local conversation when a user sends or receives messages and maintains it in the local conversation list cache. The app can read the list from local memory or the database to display names, avatars, latest messages, unread counts, pin states, and conversation tags.
- **Server-side and local data:** Both the EasyIM server and the local SDK maintain conversation list data. The server stores the current user's conversation state, while the local cache enables quick client-side reading and display. After SDK initialization and login, the SDK automatically maintains the local list. Synchronization, explicit refreshes, message sending or receiving, deletion, unread-count clearing, pinning or unpinning, and adding or removing tags may update it.
- **Synchronization and change notifications:** To obtain the latest server-maintained data, configure automatic conversation data synchronization before initializing the SDK, wait for synchronization after login, and then read the local list. The SDK notifies the app through a conversation list update event when the local list changes. The current device can also detect conversation pin changes made by the same account on another device through multi-device events.

## Feature activation

Before use, activate the server-side conversation list feature in [EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Retrieve the conversation list

To retrieve the latest conversation data, your app should automatically synchronize it after login, monitor synchronization completion, and then read the local conversation list.

### Automatically synchronize the conversation list after login

Before calling `EMClient#init` to initialize the SDK, configure `EMDataSyncType.CONVERSATIONS` through `EMOptions#setDataSyncType`. After login succeeds, the SDK automatically synchronizes the conversation list and writes it locally.

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS
));

EMClient.getInstance().init(getApplicationContext(), options);
```

To also synchronize the friend list or joined chat group list, add `CONTACTS` or `JOINED_GROUPS` to the same `EnumSet`. For details about automatically synchronizing data after login, see [SDK Initialization](initialization.html).

### Monitor conversation list synchronization

Use `EMConnectionListener` to monitor the conversation list synchronization state. A `type` value of `EMDataSyncType.CONVERSATIONS` indicates that the conversation list is being synchronized.

```java
EMConnectionListener connectionListener = new EMConnectionListener() {
    @Override
    public void onConnected() {
        // The SDK has successfully connected to the EasyIM server.
    }

    @Override
    public void onDisconnected(int errorCode) {
        // The SDK is disconnected from the EasyIM server. Determine the cause based on errorCode.
    }

    @Override
    public void onDataSyncStart(EMOptions.EMDataSyncType type) {
        if (type == EMOptions.EMDataSyncType.CONVERSATIONS) {
            // Conversation list synchronization starts.
        }
    }

    @Override
    public void onDataSyncFinish(
            EMOptions.EMDataSyncType type,
            int errorCode) {
        if (type != EMOptions.EMDataSyncType.CONVERSATIONS) {
            return;
        }

        if (errorCode == EMError.EM_NO_ERROR) {
            // Conversation list synchronization succeeds. The local conversation list can now be read.
        } else {
            // Conversation list synchronization fails. Handle the error based on errorCode.
        }
    }
};

EMClient.getInstance().addConnectionListener(connectionListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().removeConnectionListener(connectionListener);
```

### Retrieve all or filtered local conversations

Call `asyncFilterConversationsFromDB` to retrieve all conversations from the local database or filter them by criteria:

- Pass `null` for `filter`: Retrieves all conversations in the local database.
- Pass an `EMCustomConversationFilter` instance for `filter`: Filters conversations by custom criteria.
- Set `cleanConversationsCache` to `true`: Clears the existing conversation memory cache before loading the filtered results.
- Set `cleanConversationsCache` to `false`: Retains the existing conversation memory cache.

When implementing `EMCustomConversationFilter#filter`, determine whether to retain a conversation based on the passed `EMConversation` object:

- Return `true`: The conversation is included in the callback result and loaded into memory.
- Return `false`: The conversation is filtered out, excluded from the callback result, and not loaded into memory.

```java
EMClient.getInstance()
        .chatManager()
        .asyncFilterConversationsFromDB(
                new EMCustomConversationFilter() {
                    @Override
                    public boolean filter(EMConversation conversation) {
                        // Determine whether to retain the conversation based on its attributes.
                        return true;
                    }
                },
                false,
                new EMValueCallBack<List<EMConversation>>() {
                    @Override
                    public void onSuccess(
                            List<EMConversation> conversations) {
                        // conversations contains the final filtered results.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

The following table lists conversation-related options that can be set during initialization:

| Option | Description |
| ------------------------------------------- | ------------------------------------------------------------ |
| `EMOptions#setDeleteMessagesAsExitChatRoom` | Sets whether to delete a chat room's local messages when leaving it. <br/> - (Default) `true`: Deletes local messages. <br/> - `false`: Retains local messages. |
| `EMOptions#setLoadEmptyConversations` | Sets whether to include empty conversations when loading conversations from the local database.<br/> -  `true`: Includes empty conversations.<br/> - (Default) `false`: Excludes empty conversations. This option must be set before initializing the SDK. |

### Retrieve all local conversations at once

Call `getAllConversationsBySort` to retrieve a sorted local conversation list. This API returns `List<EMConversation>` using the following sorting rules:

- Pinned conversations appear before unpinned conversations.
- Within the pinned and unpinned sections, conversations are sorted by the timestamp of the latest message in descending order.

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();
```

If you do not need a sorted list from the SDK, call `getAllConversations` to retrieve a `Map<String, EMConversation>` keyed by conversation ID:

```java
Map<String, EMConversation> conversationMap = EMClient.getInstance()
        .chatManager()
        .getAllConversations();
```

**Relationship between local conversation read APIs and automatic conversation loading**

Before initializing the SDK, use `EMOptions#setAutoLoadAllConversations` to set whether all conversations in the local database are automatically loaded into memory after login succeeds:

- (Default) `true`: Automatically loads all conversations after login succeeds. Your app can directly call `getAllConversationsBySort`, `getAllConversations`, or `getUnreadMessageCount` to read conversations and unread counts from memory.

- `false`: Does not automatically load all conversations after login succeeds, reducing memory usage. The APIs above may then return no conversations, and the total unread message count may be `0`. To read local conversations by criteria, call [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations).

:::tip
`EMOptions#setDataSyncType` and `EMOptions#setAutoLoadAllConversations` control different data processing stages:

- `setDataSyncType` includes `EMDataSyncType.CONVERSATIONS`: Synchronizes server-side conversation data locally after login succeeds.
- `setAutoLoadAllConversations(true)`: Loads all conversations in the local database into memory after login succeeds. The default value is `true`.

If automatic conversation list synchronization is enabled but automatic loading is disabled, the SDK still synchronizes server-side conversation data but does not automatically load all local conversations into memory. Your app can call [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations) to read local conversations by criteria.
:::

## Retrieve the conversation name and avatar

Call `EMConversation#getConversationName()` and `EMConversation#getConversationAvatar()` to retrieve the conversation display name and avatar:

- One-to-one conversation: The peer user's nickname and avatar.
- Group conversation: The chat group name and avatar.
- Chat room conversation: Usually the chat room name and avatar.
- If the relevant data has not yet been synchronized, these methods may return an empty string.

```java
String conversationName = conversation.getConversationName();
String conversationAvatar = conversation.getConversationAvatar();
```

## Clear conversations from memory

Call `cleanConversationsMemoryCache` to clear all conversations from memory and release memory. After clearing, `getAllConversations` and `getAllConversationsBySort` may return no conversations, and `getUnreadMessageCount` may return a total unread message count of `0`.

To read conversations by criteria again, call [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations).

```java
EMClient.getInstance()
        .chatManager()
        .cleanConversationsMemoryCache();
```

## Example of reducing conversation memory usage

When there are many conversations, reduce conversation data memory usage as follows:

1. Before initializing the SDK, set `EMOptions#setAutoLoadAllConversations` to `false` to prevent all local conversations from being automatically loaded into memory after login succeeds.
2. Call [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations) as needed to load some conversations, and set `cleanConversationsCache` to `true` so the SDK clears the existing conversation memory cache before loading the filtered results.
3. When your app detects high memory usage and temporarily does not need conversation data in memory, call `cleanConversationsMemoryCache` to clear the conversation memory cache.

:::tip
Calling `cleanConversationsMemoryCache` clears conversation data from memory and may affect the results returned when reading the local conversation list and unread counts. For details about the effects and how to reload conversations, see [Clear conversations from memory](#clear-conversations-from-memory).
:::

```java
// Step 1: Disable automatic loading of all conversations before initializing the SDK.
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setAutoLoadAllConversations(false);

EMClient.getInstance().init(getApplicationContext(), options);

// Step 2: Load some conversations from the database based on business criteria.
EMClient.getInstance()
        .chatManager()
        .asyncFilterConversationsFromDB(
                new EMCustomConversationFilter() {
                    @Override
                    public boolean filter(EMConversation conversation) {
                        // Example: Load only conversations that contain unread messages.
                        return conversation.getUnreadMsgCount() > 0;
                    }
                },
                true,
                new EMValueCallBack<List<EMConversation>>() {
                    @Override
                    public void onSuccess(
                            List<EMConversation> conversations) {
                        // conversations is the list of conversations that meet the criteria.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

When your app detects high memory usage and no longer needs conversation data in memory, clear it separately:

```java
EMClient.getInstance()
        .chatManager()
        .cleanConversationsMemoryCache();
```

## Conversation list update scenarios

| Scenario | Affects server-side data | Affects the local conversation list |
| :--- | :--- | :--- |
| Synchronize conversation data from the server after login and write it locally without changing server-side conversation state | No | Yes |
| Create or update a local conversation's latest message, order, and unread count when messages are sent or received | Depends on server configuration | Yes |
| Pin or unpin a conversation, updating the server-side and local pin status<br/>Method: `asyncPinConversation` | Yes | Yes |
| Add or remove server-side and local conversation tags<br/>Methods: `asyncAddConversationMark` / `asyncRemoveConversationMark` | Yes | Yes |
| Delete a local conversation and use `deleteMessages` to determine whether to also delete local messages<br/>Method: `deleteConversation` | No | Yes |
| Delete a specified server-side and local conversation and use `isDeleteServerMessages` to determine whether to delete server-side historical messages<br/>Method: `deleteConversationFromServer` | Yes | Yes |
| Clear the unread message count of a specified conversation and synchronize the multi-device state<br/>Method: `asyncClearConversationUnreadMessageCount` | Yes | Yes |
| Clear the unread message counts of all conversations and synchronize the multi-device state<br/>Method: `asyncClearAllConversationUnreadMessageCount` | Yes | Yes |

## Monitor conversation list updates

When a local conversation changes, the SDK triggers `EMConversationListener#onConversationUpdate`. This callback does not directly return the complete conversation list. Your app should call `getAllConversationsBySort` again to retrieve the latest sorted result and refresh the UI.

```java
EMConversationListener conversationListener = new EMConversationListener() {
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

## API best practices

| Scenario | Recommendation |
| :--- | :--- |
| Retrieve the latest conversation list | Configure `EMDataSyncType.CONVERSATIONS` before initializing the SDK, and read local data after conversation synchronization succeeds. Do not call the server-side conversation list retrieval API removed in V5. |
| Display the conversation list | Prefer `getAllConversationsBySort` and directly use the SDK's pinned-first list sorted by latest message time in descending order. |
| Respond to conversation changes | Register `EMConversationListener`. After receiving `onConversationUpdate`, read the local conversation list again and refresh the UI. |
| Manage listeners | Remove `EMConnectionListener` and `EMConversationListener` when the page or component is destroyed to avoid duplicate callbacks and memory leaks. |
| Release and restore conversation memory | After calling `cleanConversationsMemoryCache`, call [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations) to read conversations by criteria again as needed. |

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setAppKey`](#automatically-synchronize-the-conversation-list-after-login) | `EMOptions` | Sets the App Key of the app. |
| [`setDataSyncType`](#automatically-synchronize-the-conversation-list-after-login) | `EMOptions` | Sets the data types automatically synchronized after login succeeds. |
| [`setLoadEmptyConversations`](#retrieve-all-or-filtered-local-conversations) | `EMOptions` | Sets whether to include empty conversations when loading from the local database. |
| [`setDeleteMessagesAsExitChatRoom`](#retrieve-all-or-filtered-local-conversations) | `EMOptions` | Sets whether to delete a chat room's local messages when leaving it. |
| [`setAutoLoadAllConversations`](#retrieve-all-local-conversations-at-once) | `EMOptions` | Sets whether to automatically load all local conversations into memory after login succeeds. |
| [`init`](#automatically-synchronize-the-conversation-list-after-login) | `EMClient` | Initializes the Android SDK with the specified configuration. |
| [`asyncFilterConversationsFromDB`](#retrieve-all-or-filtered-local-conversations) | `EMChatManager` | Retrieves all conversations from the local database or filters them by criteria. |
| [`getAllConversationsBySort`](#retrieve-all-local-conversations-at-once) | `EMChatManager` | Retrieves the pinned-first local conversation list sorted by latest message time in descending order. |
| [`getAllConversations`](#retrieve-all-local-conversations-at-once) | `EMChatManager` | Retrieves the local conversation map keyed by conversation ID. |
| [`getConversationName`](#retrieve-the-conversation-name-and-avatar) / [`getConversationAvatar`](#retrieve-the-conversation-name-and-avatar) | `EMConversation` | Retrieves the display name and avatar of a one-to-one or group conversation. |
| [`cleanConversationsMemoryCache`](#clear-conversations-from-memory) | `EMChatManager` | Clears all conversations from memory. |
| [`getUnreadMessageCount`](#retrieve-all-local-conversations-at-once) | `EMChatManager` | Retrieves the total unread message count of all local conversations. |
| [`asyncPinConversation`](#conversation-list-update-scenarios) | `EMChatManager` | Pins or unpins a conversation. |
| [`asyncAddConversationMark`](#conversation-list-update-scenarios) / [`asyncRemoveConversationMark`](#conversation-list-update-scenarios) | `EMChatManager` | Adds or removes conversation tags. |
| [`deleteConversation`](#conversation-list-update-scenarios) | `EMChatManager` | Deletes a local conversation and optionally its local messages. |
| [`deleteConversationFromServer`](#conversation-list-update-scenarios) | `EMChatManager` | Deletes a specified server-side and local conversation. |
| [`asyncClearConversationUnreadMessageCount`](#conversation-list-update-scenarios) | `EMChatManager` | Clears the unread message count of a specified conversation. |
| [`asyncClearAllConversationUnreadMessageCount`](#conversation-list-update-scenarios) | `EMChatManager` | Clears the unread message counts of all conversations. |
| [`filter`](#retrieve-all-or-filtered-local-conversations) | `EMCustomConversationFilter` | Determines whether a conversation is retained in the filtered results and loaded into memory. |
