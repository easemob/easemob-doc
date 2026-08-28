# Pin Conversations

## Feature overview

Conversation pinning keeps important one-to-one, group, or chat room conversations near the top of the conversation list so users can quickly find frequent or high-priority conversations. The pin status is stored on the server and synchronized to the current user's other devices and local conversation data.

## Feature activation

Conversation pinning is part of the server-side conversation list feature. Before using it, [activate the server-side conversation list feature in EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Activate the [server-side conversation list feature](/product/console/basic_message_conversation.html#server-side-conversation-list).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Pin or unpin a conversation

Call `EMChatManager#asyncPinConversation` to pin or unpin a conversation. The pin status is stored on the server, and a status change updates both the server-side and local data. Set `isPinned` to `true` to pin the conversation or `false` to unpin it.
With multi-device login, after the current user pins or unpins a conversation on one device, their other online devices receive a multi-device conversation event through `EMMultiDeviceListener#onConversationEvent`. `CONVERSATION_PINNED` indicates pinning, and `CONVERSATION_UNPINNED` indicates unpinning.

You can pin up to 50 conversations.

```java
boolean isPinned = true;

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncPinConversation(
                // For a one-to-one chat, pass the peer user ID; for a group chat, pass the chat group ID; for a chat room, pass the chat room ID.
                conversationId,
                // Set to `true` to pin the conversation or `false` to unpin it.
                isPinned,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The conversation pin status is set successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the error based on the error code and error message.
                    }
                });
```

The parameters are as follows:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID. For a one-to-one chat, specify the peer user ID; for a group chat, specify the chat group ID; for a chat room, specify the chat room ID. |
| `isPinned` | Boolean | Whether to pin the conversation: `true` pins it and `false` unpins it. |
| `callback` | `EMCallBack` | Operation result callback. |

`asyncPinConversation` does not directly return the updated conversation object. After the call succeeds, read the local conversation again and retrieve its pin status through the following APIs:

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    boolean pinned = conversation.isPinned();
    // Returns the UNIX timestamp when the conversation was pinned, in milliseconds; returns `0` if the conversation is not pinned.
    long pinnedTime = conversation.getPinnedTime();
}
```

## Retrieve pinned conversations

After login, the pin status is automatically synchronized with the conversation data and written locally. Your app should read the local conversation list after synchronization is complete.

Before initializing the SDK, configure `EMDataSyncType.CONVERSATIONS` through `EMOptions#setDataSyncType`:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

When `type` is `CONVERSATIONS` and `errorCode` is `EMError.EM_NO_ERROR` in the `EMConnectionListener#onDataSyncFinish` callback, call `getAllConversationsBySort` to retrieve the local conversation list, and then filter the pinned conversations:

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();

List<EMConversation> pinnedConversations = new ArrayList<>();
for (EMConversation conversation : conversations) {
    if (conversation.isPinned()) {
        pinnedConversations.add(conversation);
    }
}
```

The APIs in `EMConversation` related to conversation pinning are as follows:

| API | Return type | Description |
| :--- | :--- | :--- |
| `conversationId()` | String | Conversation ID. |
| `getType()` | `EMConversationType` | Retrieves the conversation type. |
| `isPinned()` | Boolean | Whether the conversation is pinned. |
| `getPinnedTime()` | long | Retrieves the pin timestamp, in milliseconds. Returns `0` if the conversation is not pinned. |

:::tip
To load empty conversations from the local database, call `EMOptions#setLoadEmptyConversations(true)` before initializing the SDK. Otherwise, empty conversations are excluded by default when conversations are loaded from the local database.
:::

## Monitor local conversation list updates

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

## Monitor multi-device conversation pin events

When the same user pins or unpins a conversation on another device, the current device can receive multi-device conversation events through `EMMultiDeviceListener#onConversationEvent`:

| Event | Description |
| :--- | :--- |
| `CONVERSATION_PINNED` | The current user pins a conversation on another device. |
| `CONVERSATION_UNPINNED` | The current user unpins a conversation on another device. |

```java
EMMultiDeviceListener multiDeviceListener =
        new EMMultiDeviceListener() {
            @Override
            public void onConversationEvent(
                    int event,
                    String conversationId,
                    EMConversationType type) {
                if (event == EMMultiDeviceListener.CONVERSATION_PINNED
                        || event == EMMultiDeviceListener.CONVERSATION_UNPINNED) {
                    List<EMConversation> conversations = EMClient.getInstance()
                            .chatManager()
                            .getAllConversationsBySort();
                    // Refresh the UI with the latest conversation list.
                }
            }
        };

EMClient.getInstance().addMultiDeviceListener(multiDeviceListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
```

:::tip
Multi-device events notify the current user's other online devices. After the current device initiates a pin operation, use the result callback of `asyncPinConversation` as the operation result and read the local conversation list again as needed.
:::

## Sorting and display recommendations

The conversation list returned by `getAllConversationsBySort` follows these sorting rules:
  - Pinned conversations appear before unpinned conversations.
  - Within the pinned and unpinned sections, conversations are sorted by the timestamp of the latest message in descending order.
When displaying the conversation list, we recommend using the order returned by the SDK directly. If your business needs to arrange multiple pinned conversations by the most recent pin time, sort them by the timestamp returned by `EMConversation#getPinnedTime()` in descending order so that the most recently pinned conversations appear first.

```java
List<EMConversation> conversations =
        EMClient.getInstance()
                .chatManager()
                .getAllConversationsBySort();

// Separate pinned and unpinned conversations.
List<EMConversation> pinnedConversations = new ArrayList<>();
List<EMConversation> unpinnedConversations = new ArrayList<>();

for (EMConversation conversation : conversations) {
    if (conversation.isPinned()) {
        pinnedConversations.add(conversation);
    } else {
        unpinnedConversations.add(conversation);
    }
}

// Sort pinned conversations by pin time in descending order so the most recently pinned conversations appear first.
Collections.sort(
        pinnedConversations,
        (first, second) ->
                Long.compare(
                        second.getPinnedTime(),
                        first.getPinnedTime()));

// Merge the lists, keeping pinned conversations before unpinned conversations.
List<EMConversation> sortedConversations = new ArrayList<>();
sortedConversations.addAll(pinnedConversations);
sortedConversations.addAll(unpinnedConversations);
```

## Considerations

- Conversation pinning is supported for one-to-one, group, and chat room conversations.
- `conversationId` cannot be empty. If the call fails, handle the error based on the error code and error message in the callback.
- You can pin up to 50 conversations.
- Conversation pin status is stored on the server and synchronized to the current user's other devices.
- After conversation data synchronization is complete, read and filter pinned conversations through local APIs.
- Pinning does not affect message sending or receiving, the unread count, message read status, or conversation tags.
- By default, the local conversation list does not include empty conversations loaded from the database. To include them, call `setLoadEmptyConversations(true)` before initializing the SDK.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncPinConversation`](#pin-or-unpin-a-conversation) | `EMChatManager` | Pins or unpins a specified conversation. |
| [`getConversation`](#pin-or-unpin-a-conversation) | `EMChatManager` | Retrieves a specified local conversation object. |
| [`setAppKey`](#retrieve-pinned-conversations) | `EMOptions` | Sets the App Key of the app. |
| [`setDataSyncType`](#retrieve-pinned-conversations) | `EMOptions` | Sets the data types that are automatically synchronized after login succeeds. |
| [`init`](#retrieve-pinned-conversations) | `EMClient` | Initializes the SDK with the specified configuration. |
| [`getAllConversationsBySort`](#retrieve-pinned-conversations) | `EMChatManager` | Retrieves the local conversation list with pinned conversations first. |
| [`conversationId`](#retrieve-pinned-conversations) / [`getType`](#retrieve-pinned-conversations) | `EMConversation` | Retrieves the conversation ID and type. |
| [`setLoadEmptyConversations`](#retrieve-pinned-conversations) | `EMOptions` | Sets whether to include empty conversations when loading conversations from the local database. |
