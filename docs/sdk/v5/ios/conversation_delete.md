# Delete Conversations

## Feature overview

In the iOS SDK, local conversations and local messages are handled as follows when you delete a friend or leave a chat group or chat room:

| Item | Default behavior | Setting for retaining local conversations and messages |
| :--- | :--- | :--- |
| Delete a friend | Deletes the local one-to-one conversation with the friend and its local messages by default. | When calling `deleteContact`, set `isDeleteConversation` to `NO`. |
| Leave a chat group | Retains the local group conversation and deletes its local messages by default. | Set `EMOptions#deleteMessagesOnLeaveGroup = NO` to retain the local messages. The group conversation is retained by default. |
| Leave a chat room | Deletes the local chat room conversation and its local messages by default. | Set `EMOptions#deleteMessagesOnLeaveChatroom = NO` to retain the local chat room conversation and messages. |

You can also use `IEMChatManager` to delete a specified server-side and local conversation for the current user, delete only local conversations, batch delete local conversations, or clear all conversations. You can use `EMConversation` to delete specified local messages.

:::warning
Deletion might be irreversible. Confirm the deletion scope before making the call.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).

## Delete a server-side conversation for the current user

Call `deleteServerConversation` to delete a specified server-side and local conversation for the current user. After the conversation and messages are deleted, the current user cannot retrieve them from the server. Other users' conversations and messages are unaffected.


The `isDeleteServerMessages` parameter controls whether the historical messages of this conversation stored on the server for the current user are also deleted:

- `true`: Deletes the server-side and local conversation, as well as its server-side and local historical messages.
- `false`: Deletes the server-side and local conversation but retains its server-side and local historical messages.

```swift
let conversationId = "conversationId"
let conversationType: EMConversationType = .chat

EMClient.shared().chatManager?.deleteServerConversation(
    conversationId,
    conversationType: conversationType,
    isDeleteServerMessages: true
) { deletedConversationId, error in
    if let error {
        print("Failed to delete the server-side conversation: \(error.errorDescription)")
    } else {
        print("Deleted conversation: \(deletedConversationId ?? "")")
    }
}
```

To retain the server-side and local historical messages, pass `false` for `isDeleteServerMessages`:

```swift
EMClient.shared().chatManager?.deleteServerConversation(
    conversationId,
    conversationType: .groupChat,
    isDeleteServerMessages: false
) { _, error in
    if error == nil {
        // The server-side and local conversation has been deleted, and the historical messages are retained.
    }
}
```

:::tip
After a conversation is deleted, the SDK recreates the corresponding local conversation if messages are subsequently sent or received. If `isDeleteServerMessages` is `false`, server-side roaming messages are not deleted with the conversation and can be retrieved as needed within their retention period. If `isDeleteServerMessages` is `true`, the server-side roaming messages of this conversation are also deleted and can no longer be retrieved through the SDK.
:::

## Delete a local conversation

### Delete a specified local conversation

Call `deleteConversation` to delete a specified local conversation.

The `isDeleteMessages` parameter controls whether the local historical messages of this conversation are also deleted:

- `true`: Deletes the local conversation and its local historical messages.
- `false`: Deletes the local conversation but retains its local historical messages.

```swift
// Delete the local conversation and its local historical messages.
EMClient.shared().chatManager?.deleteConversation(
    conversationId,
    isDeleteMessages: true
) { deletedConversationId, error in
    if let error {
        print("Failed to delete the local conversation: \(error.errorDescription)")
    } else {
        print("Deleted local conversation: \(deletedConversationId ?? "")")
    }
}
```

To retain the local historical messages, pass `false` for `isDeleteMessages`:

```swift
EMClient.shared().chatManager?.deleteConversation(
    conversationId,
    isDeleteMessages: false
) { _, error in
    if error == nil {
        // The local conversation has been deleted, and the local historical messages are retained.
    }
}
```

:::tip
After a conversation is deleted, the SDK recreates the corresponding local conversation if messages are subsequently sent or received. If `isDeleteMessages` is `false`, server-side roaming messages are not deleted with the conversation and can be retrieved as needed within their retention period. If `isDeleteMessages` is `true`, the server-side roaming messages of this conversation are also deleted and can no longer be retrieved through the SDK.
:::

### Batch delete local conversations

Call `deleteConversations` to batch delete local conversations. The parameter must be an array of `EMConversation` objects, not an array of conversation IDs.

```swift
let conversations: [EMConversation] = [conversation1, conversation2]

EMClient.shared().chatManager?.deleteConversations(
    conversations,
    isDeleteMessages: true
) { error in
    if let error {
        print("Batch deletion failed: \(error.errorDescription)")
    } else {
        print("Batch deletion succeeded")
    }
}
```

If the array is `nil` or empty, the completion returns `EMErrorInvalidConversation`. `isDeleteMessages` only controls whether local messages are deleted with the conversations. For details, see [Delete a specified local conversation](#delete-a-specified-local-conversation).

### Delete all conversations and messages

Call `deleteAllMessagesAndConversations` to clear all conversations and their messages:

- If `clearServerData` is `false`, only all local conversations and local messages are cleared. Server-side data is retained.
- If `clearServerData` is `true`, all conversations and messages stored on the server for the current user are also cleared. The current user can no longer retrieve this data from the server. Other users are unaffected.

```swift
// Clear only all local conversations and local messages.
EMClient.shared().chatManager?.deleteAllMessagesAndConversations(
    false
) { error in
    if let error {
        print("Failed to clear the conversations and messages: \(error.errorDescription)")
    } else {
        print("Cleared all local conversations and messages")
    }
}
```

:::warning
Setting `clearServerData` to `true` deletes all conversations and messages stored on the server for the current user. Reconfirm the deletion scope with the user before proceeding.
:::

### Delete specified local messages from a conversation

To delete a specific local message, first retrieve the `EMConversation` and then call `deleteMessage`. This API deletes the message only from the SDK's local database.

```swift
guard let conversation = EMClient.shared().chatManager?.getConversation(
    conversationId,
    type: .chat,
    createIfNotExist: false
) else {
    return
}

var error: EMError?
conversation.deleteMessage(withId: "messageId", error: &error)

if let error {
    print("Failed to delete the local message: \(error.errorDescription)")
}
```

### Handle a conversation when deleting a friend

When deleting a friend, you can use the asynchronous API and use `isDeleteConversation` to control whether the local conversation with the friend is also deleted:

- `isDeleteConversation = true`: Deletes the friend and the local conversation with the friend.
- `isDeleteConversation = false`: Deletes only the friend and retains the local conversation.

```swift
EMClient.shared().contactManager?.deleteContact(
    "contactUserId",
    isDeleteConversation: true
) { username, error in
    if let error {
        print("Failed to delete the friend: \(error.errorDescription)")
    } else {
        print("Deleted friend: \(username ?? "")")
    }
}
```

## API list

| API | Module/Type | Description |
| :--- | :--- | :--- |
| [`deleteServerConversation`](#delete-a-server-side-conversation-for-the-current-user) | `IEMChatManager` | Deletes a specified server-side and local conversation for the current user and determines whether to delete historical messages based on the parameter. |
| [`deleteConversation`](#delete-a-specified-local-conversation) | `IEMChatManager` | Deletes a specified local conversation and determines whether to delete local historical messages based on the parameter. |
| [`deleteConversations`](#batch-delete-local-conversations) | `IEMChatManager` | Batch deletes local conversations and determines whether to delete local historical messages based on the parameter. |
| [`deleteAllMessagesAndConversations`](#delete-all-conversations-and-messages) | `IEMChatManager` | Clears all conversations and messages and determines whether to also clear the current user's server-side data based on the parameter. |
| [`getConversation`](#delete-specified-local-messages-from-a-conversation) | `IEMChatManager` | Retrieves a specified local conversation. Pass `false` for `createIfNotExist` when automatic creation is not required. |
| [`deleteMessageWithId`](#delete-specified-local-messages-from-a-conversation) | `EMConversation` | Deletes a specified message from the SDK's local database. |
| [`deleteContact`](#handle-a-conversation-when-deleting-a-friend) | `IEMContactManager` | Deletes a friend and determines whether to also delete the corresponding local conversation based on the parameter. |
