# Delete Conversations

## Feature overview

In the Android SDK, local conversations and messages are handled as follows when you delete a friend or leave a chat group or chat room:

| Action | Default behavior | Setting for retaining local conversations and messages |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------ |
| Delete a friend | Deletes the local one-to-one conversation with the friend and its local messages. | Call the synchronous method `deleteContact` and set `keepConversation` to `true`. |
| Leave a chat group | Retains the local group conversation and removes it from the memory cache. Local group messages are deleted by default. | The local group conversation is retained by default. To retain local messages, call `EMOptions#setDeleteMessagesAsExitGroup(false)` before initialization. |
| Leave a chat room | Deletes the local chat room conversation and its local messages by default. | Call `EMOptions#setDeleteMessagesAsExitChatRoom(false)` before initialization. |

You can also use `EMChatManager` to delete a specified conversation for the current user from the server and local device, delete only local conversations, bulk delete local conversations, or clear all conversations. Use `EMConversation` to delete a specified local message.

:::warning
Deletion might be irreversible. Confirm the scope before making the call.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Delete a server-side conversation for the current user

Call `deleteConversationFromServer` to delete a specified conversation for the current user from the server and local device. After the conversation and messages are deleted, the current user cannot retrieve them from the server. Other users' conversations and messages are unaffected.

The `isDeleteServerMessages` parameter controls whether to also delete the conversation's historical messages stored on the server for the current user:

- `true`: Deletes the server-side and local conversation, as well as its server-side and local historical messages.
- `false`: Deletes the server-side and local conversation but retains its server-side and local historical messages.

The following is sample code:

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .deleteConversationFromServer(
                conversationId,
                // Conversation type: Chat, GroupChat, or ChatRoom for a one-to-one chat, group chat, or chat room, respectively.
                conversationType,
                isDeleteServerMessages,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The specified server-side and local conversation has been deleted for the current user.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the error based on the error code and error message.
                    }
                });
```

To retain server-side and local historical messages, pass `false` for `isDeleteServerMessages`:

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .deleteConversationFromServer(
                conversationId,
                EMConversation.EMConversationType.GroupChat,
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The server-side and local conversation has been deleted, and historical messages are retained.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Deletion failed.
                    }
                });
```

:::tip
After a conversation is deleted, the SDK recreates the corresponding local conversation when messages are subsequently sent or received. If `isDeleteServerMessages` is `false`, server-side roaming messages are not deleted with the conversation and can be retrieved as needed within their retention period. If `isDeleteServerMessages` is `true`, the conversation's server-side roaming messages are also deleted and can no longer be retrieved through the SDK.
:::

## Delete a local conversation

Call `deleteConversation` to delete a specified local conversation.

The `deleteMessages` parameter controls whether to also delete the conversation's local historical messages:

- `true`: Deletes the local conversation and its local historical messages.
- `false`: Deletes the local conversation but retains its local historical messages.

```java
// Delete the local conversation and its local historical messages.
boolean deleted = EMClient.getInstance()
        .chatManager()
        .deleteConversation(conversationId, true);

if (!deleted) {
    // Deletion failed. Check whether conversationId is empty and whether the local database is open.
}
```

To delete multiple local conversations, call `asyncDeleteConversations`:

```java
// Asynchronously delete a local conversation and its local historical messages.
List<String> conversationIds =
        Collections.singletonList(conversationId);

EMClient.getInstance()
        .chatManager()
        .asyncDeleteConversations(
                conversationIds,
                true,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The local conversation and its local historical messages are deleted successfully.
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Deletion failed. Handle the error based on the error code and error message.
                    }
                });
```

:::tip
After a conversation is deleted, the SDK recreates the corresponding local conversation when messages are subsequently sent or received. If `deleteMessages` is `false`, server-side roaming messages are not deleted with the conversation and can be retrieved as needed within their retention period. If `deleteMessages` is `true`, the conversation's server-side roaming messages are also deleted and can no longer be retrieved through the SDK.
:::

### Bulk delete local conversations

Call `asyncDeleteConversations` to delete local conversations.

The `deleteMessages` parameter controls whether to also delete local messages in each conversation:

- `true`: Deletes the local conversations and their local messages.
- `false`: Deletes only the local conversations and retains their local messages.

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncDeleteConversations(
                conversationIds,
                true,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // Batch deletion succeeded.
                    }

                    @Override
                    public void onError(int code, String error) {
                        // Handle the batch deletion failure.
                    }
                });
```

### Delete all conversations and messages

Call `asyncDeleteAllMsgsAndConversations` to clear all conversations and their messages:

- If `clearServerData` is `false`, only all local conversations and messages are cleared; server-side data is retained.
- If `clearServerData` is `true`, all conversations and messages stored on the server for the current user are also cleared. The current user can no longer retrieve this data from the server; other users are unaffected.

```java
// Asynchronous method.
EMClient.getInstance()
        .chatManager()
        .asyncDeleteAllMsgsAndConversations(
                false,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // All local conversations and messages have been cleared.
                    }

                    @Override
                    public void onError(int code, String error) {
                        // Handle the failure to clear the data.
                    }
                });
```

:::warning
Setting `clearServerData` to `true` deletes all conversations and messages stored on the server for the current user. Reconfirm the deletion scope with the user before proceeding.
:::

### Delete a specified local message in a conversation

To delete a local message, retrieve the corresponding `EMConversation` and then call `removeMessage`. This API deletes the message from the SDK's local database and memory cache.

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(
                conversationId,
                EMConversation.EMConversationType.Chat,
                false);

if (conversation != null) {
    conversation.removeMessage(messageId);
}
```

### Handle a conversation when deleting a friend

When you call the asynchronous method `asyncDeleteContact` to delete a friend, the SDK also deletes the local one-to-one conversation with the friend and its local messages.

To retain the local conversation and messages when deleting a friend, use the synchronous `deleteContact` API provided by the Android SDK and pass `true` for `keepConversation`.

```java
// Asynchronous method.
EMClient.getInstance()
        .contactManager()
        .asyncDeleteContact(
                "contactUserId",
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                        // The friend and the corresponding local one-to-one conversation and messages have been deleted.
                    }

                    @Override
                    public void onError(int code, String error) {
                        // Handle the failure to delete the friend.
                    }
                });
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`deleteConversationFromServer`](#delete-a-server-side-conversation-for-the-current-user) | `EMChatManager` | Deletes a specified conversation for the current user from the server and local device, with an option to also delete server-side historical messages. |
| [`deleteConversation`](#delete-a-local-conversation) | `EMChatManager` | Deletes a specified local conversation, with an option to also delete local historical messages. |
| [`asyncDeleteConversations`](#bulk-delete-local-conversations) | `EMChatManager` | Asynchronously bulk deletes local conversations, with an option to also delete local messages. |
| [`asyncDeleteAllMsgsAndConversations`](#delete-all-conversations-and-messages) | `EMChatManager` | Asynchronously clears all local conversations and messages, with an option to also clear the current user's server-side data. |
| [`getConversation`](#delete-a-specified-local-message-in-a-conversation) | `EMChatManager` | Retrieves a specified local conversation. |
| [`removeMessage`](#delete-a-specified-local-message-in-a-conversation) | `EMConversation` | Deletes a specified local message from a conversation. |
| [`asyncDeleteContact`](#handle-a-conversation-when-deleting-a-friend) | `EMContactManager` | Asynchronously deletes a friend and the corresponding local one-to-one conversation and messages. |
| [`deleteContact`](#handle-a-conversation-when-deleting-a-friend) | `EMContactManager` | Deletes a friend and uses `keepConversation` to specify whether to retain the corresponding local conversation and messages. |
