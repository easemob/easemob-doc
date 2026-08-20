# Conversation Tags

## Feature overview

Conversation tags are used to assign business categories to conversations, such as starred, pending, or important customer. The SDK supports adding tags to or removing them from one-to-one, group, and chat room conversations.

The SDK provides 20 tags, from `MARK_0` through `MARK_19`. A conversation can have up to 20 tags at the same time. Your app defines and maintains the business meaning of each tag.

```java
Map<EMConversation.EMMarkType, String> markMapping = new HashMap<>();
markMapping.put(EMConversation.EMMarkType.MARK_0, "important");
markMapping.put(EMConversation.EMMarkType.MARK_1, "pending");
markMapping.put(EMConversation.EMMarkType.MARK_2, "customer");
```

:::tip
Conversation tags are used only to categorize and filter conversations. They do not affect conversation unread counts, message sending or receiving, pin status, or message read status.
:::

## Feature activation

Conversation tags are part of the server-side conversation list feature. Before using them, [activate the server-side conversation list feature in Easemob Console](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Activate the [server-side conversation list feature](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Add conversation tags

Call `EMChatManager#asyncAddConversationMark` to add a specified tag to one or more conversations. This operation updates the conversation tags on both the server and the local device. You can pass up to 20 conversation IDs in a single call.

After a conversation tag is added, the tag data is updated on both the server and the local device. After login, conversation tags are automatically synchronized with the conversation data and written locally. When synchronization is complete, retrieve the `EMConversation` object through the local conversation list API, and then call `EMConversation#marks` to retrieve all tags for the conversation.

If the server-side conversation list reaches its limit, which is 100 conversations by default, the server may remove inactive conversations based on conversation activity. The tags for those conversations may also no longer be synchronized locally with the server-side conversation list.

:::tip 

Conversation tags are used only for business categorization and filtering. They do not affect message sending or receiving, conversation unread counts, message read status, or conversation pin status.

 :::

```java
List<String> conversationIds = Arrays.asList(
        "user2",
        "group1");

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncAddConversationMark(
                conversationIds,
                EMConversation.EMMarkType.MARK_0,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The conversation tag is added successfully.
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
| `conversationIds` | `List<String>` | List of conversation IDs. It cannot be empty, and a single call accepts up to 20 conversation IDs. For a one-to-one chat, specify the peer user ID; for a group chat, specify the chat group ID; for a chat room, specify the chat room ID. |
| `mark` | `EMConversation.EMMarkType` | Tag to add. Possible values range from `MARK_0` through `MARK_19`. |
| `callback` | `EMCallBack` | Operation result callback. `onSuccess` is triggered on success, and `onError` is triggered on failure. |

## Remove conversation tags

Call `EMChatManager#asyncRemoveConversationMark` to remove a specified tag from one or more conversations. This operation updates the conversation tags on both the server and the local device. You can pass up to 20 conversation IDs in a single call.

```java
List<String> conversationIds = Arrays.asList(
        "user2",
        "group1");

// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncRemoveConversationMark(
                conversationIds,
                EMConversation.EMMarkType.MARK_0,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The conversation tag is removed successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the error based on the error code and error message.
                    }
                });
```

The parameter rules for `asyncRemoveConversationMark` are the same as those for `asyncAddConversationMark`.

## Filter the conversation list by tag

After login, conversation tags are automatically synchronized with the conversation data and written locally. Your app should read the local conversation list after synchronization is complete and use `EMConversation#marks` to filter conversations that have a specified tag.

Before initializing the SDK, configure `EMDataSyncType.CONVERSATIONS` through `EMOptions#setDataSyncType`:

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDataSyncType(EnumSet.of(
        EMOptions.EMDataSyncType.CONVERSATIONS));

EMClient.getInstance().init(getApplicationContext(), options);
```

When `type` is `CONVERSATIONS` and `errorCode` is `EMError.EM_NO_ERROR` in the `EMConnectionListener#onDataSyncFinish` callback, you can read the local conversation list and filter it by tag:

```java
List<EMConversation> conversations = EMClient.getInstance()
        .chatManager()
        .getAllConversationsBySort();

List<EMConversation> markedConversations = new ArrayList<>();
for (EMConversation conversation : conversations) {
    Set<EMConversation.EMMarkType> marks = conversation.marks();
    if (marks.contains(EMConversation.EMMarkType.MARK_0)) {
        markedConversations.add(conversation);
    }
}
```

To retrieve all tags for a single local conversation, first call `getConversation` to retrieve the conversation object, and then call `marks`:

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

Set<EMConversation.EMMarkType> marks = conversation == null
        ? Collections.emptySet()
        : conversation.marks();
```

:::tip
`getAllConversationsBySort` and `getConversation` read local conversations and do not explicitly request data from the server. To obtain the latest server-side tag state, wait until conversation data synchronization is complete.
:::

## Monitor conversation list updates

When a local conversation changes, the SDK triggers `EMConversationListener#onConversationUpdate`. This callback does not return the complete conversation list. Your app should read the local conversation list again and refresh the UI.

```java
EMConversationListener conversationListener =
        new EMConversationListener() {
            @Override
            public void onConversationUpdate() {
                List<EMConversation> conversations = EMClient.getInstance()
                        .chatManager()
                        .getAllConversationsBySort();
                // Filter conversations with the target tag again and refresh the UI.
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

When the same user updates conversation tags on another device, the current device can receive a `CONVERSATION_MARK_UPDATE` event through `EMMultiDeviceListener#onConversationEvent`. After receiving the event, read the local conversation list again and refresh the UI.

```java
EMMultiDeviceListener multiDeviceListener =
        new EMMultiDeviceListener() {
            @Override
            public void onConversationEvent(
                    int event,
                    String conversationId,
                    EMConversation.EMConversationType type) {
                if (event == EMMultiDeviceListener.CONVERSATION_MARK_UPDATE) {
                    // Another device updated conversation tags. Read the local conversation list again.
                }
            }
        };

EMClient.getInstance().addMultiDeviceListener(multiDeviceListener);

// Remove the listener when it is no longer needed.
EMClient.getInstance().removeMultiDeviceListener(multiDeviceListener);
```

## Considerations

- Conversation tags are supported for one-to-one, group, and chat room conversations.
- Conversation tag values range from `MARK_0` through `MARK_19`. Your app maintains the business meaning of each tag.
- A conversation can have up to 20 tags at the same time.
- `asyncAddConversationMark` and `asyncRemoveConversationMark` can operate on multiple conversations at once, with up to 20 conversation IDs in a single call.
- The conversation ID list and the tag cannot be empty. If the call fails, handle the error based on the error code and error message in the callback.
- Conversation tags are updated in both the server-side and local conversation data and synchronized to the current user's other devices.
- Conversation tags do not affect the unread count, message read status, message sending or receiving, or pin status.
- After conversation data synchronization is complete, read and filter conversations through local APIs.
- If the server-side conversation list reaches its limit, inactive conversations may be removed from it, and their tags may no longer be returned with the list.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncAddConversationMark`](#add-conversation-tags) | `EMChatManager` | Adds a specified tag to one or more conversations. |
| [`asyncRemoveConversationMark`](#remove-conversation-tags) | `EMChatManager` | Removes a specified tag from one or more conversations. |
| [`setAppKey`](#filter-the-conversation-list-by-tag) | `EMOptions` | Sets the App Key of the app. |
| [`setDataSyncType`](#filter-the-conversation-list-by-tag) | `EMOptions` | Sets the data types that are automatically synchronized after login succeeds. |
| [`init`](#filter-the-conversation-list-by-tag) | `EMClient` | Initializes the SDK with the specified configuration. |
| [`getAllConversationsBySort`](#filter-the-conversation-list-by-tag) | `EMChatManager` | Retrieves the local conversation list with pinned conversations first. |
| [`getConversation`](#filter-the-conversation-list-by-tag) | `EMChatManager` | Retrieves a specified local conversation object. |
| [`marks`](#filter-the-conversation-list-by-tag) | `EMConversation` | Retrieves all tags for a conversation. |
