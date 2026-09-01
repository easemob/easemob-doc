# Delete Messages

## Feature overview

The SDK supports one-way deletion of server-side messages:

- One-way clearing of server-side chat history: Clears the current user's chat history on the server, including messages and conversations in one-to-one chats, chat groups, and chat rooms. After the operation succeeds, the SDK also clears cached local conversations and messages and updates the local conversation list cache.
- One-way deletion of server-side historical messages: Deletes the current user's historical messages stored on the server by message ID or timestamp and deletes the corresponding local messages in the current device's conversation. If the app has stored or displayed these messages locally, update the local message list after the API call succeeds.

After you clear server-side chat history or delete historical messages one way, you cannot retrieve the conversations or messages from the server. Other users are not affected.

## Prerequisite

Before you start, make sure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Understand the API usage limits of EasyIM. For details, see [IM feature limits](/product/limitation.html).

## Clear chat history one way

Call `deleteAllMessagesAndConversations` to clear all local conversations and their messages for the current user, including one-to-one, group, and chat room conversations. The `clearServerData` parameter determines whether to also clear the current user's server-side conversations and messages one way:

- `YES`: Clears all conversations and messages both locally and on the server for the current user. After clearing, the current user cannot retrieve the data from the server, while other users are not affected.
- `NO`: Clears only local conversations and messages; server-side data is retained.

After the operation succeeds, the SDK clears the in-memory conversation cache. If the local conversation list changes, the SDK triggers `conversationListDidUpdate`, in which the app can retrieve the local conversation list again and refresh the UI.

```objectivec
// YES means that all of the current user's server-side conversations and messages are also cleared one way.
[[EMClient sharedClient].chatManager deleteAllMessagesAndConversations:YES
                                                            completion:^(EMError *error) {
    if (!error) {
        // Local conversations and messages have been cleared, and the server-side data has also been cleared for the current user.
    } else {
        // Clearing failed.
    }
}];
```

## Delete server-side historical messages one way

Call `removeMessagesFromServerWithTimeStamp` or `removeMessagesFromServerMessageIds` to delete the current user's historical messages stored on the server by timestamp or message ID. This operation applies only to the current user: after deletion, the current user cannot retrieve these messages as roaming messages from the server. Other users in the same one-to-one chat, group chat, or chat room are not affected and can still retrieve the messages according to the roaming policy.

The following deletion methods are supported:

- Delete by message ID: Call `removeMessagesFromServerMessageIds`. You can delete at most 50 messages each time.
- Delete by time: Call `removeMessagesFromServerWithTimeStamp` to delete historical messages whose timestamps are less than or equal to the specified timestamp. The timestamp is in milliseconds.

When the user is logged in on multiple devices, the user's other online devices receive the `multiDevicesMessageBeRemoved` callback after the deletion succeeds.

:::tip
1. After one of the APIs above successfully deletes server-side historical messages one way, the SDK removes the corresponding messages from local storage and the in-memory cache of the current device's conversation. The main purpose of this API is to delete the current user's server-side historical messages one way. Refresh the message list in the success callback to avoid continuing to display stale data.
2. Chat room message roaming is disabled by default. To use it, contact the EasyIM business manager to enable it.
:::

Example:

```objectivec
// Retrieve the local conversation object by conversation ID.
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (!conversation) {
    return;
}

// Delete by time: beforeTimeStamp is a timestamp in milliseconds. Messages at or before this time are deleted.
[conversation removeMessagesFromServerWithTimeStamp:beforeTimeStamp
                                          completion:^(EMError *error) {
    if (!error) {
        // The corresponding historical messages have been deleted from the server and from this conversation on the current device.
    } else {
        // Deletion failed.
    }
}];

// Delete by message ID: messageIds contains at most 50 message IDs.
[conversation removeMessagesFromServerMessageIds:messageIds
                                        completion:^(EMError *error) {
    if (!error) {
        // The specified messages have been deleted from the server and from this conversation on the current device.
    } else {
        // Deletion failed.
    }
}];
```

## Delete all messages in a specified local conversation

You can delete all local messages in a specified conversation:

```objectivec
// Retrieve the local conversation object by conversation ID.
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    EMError *error = nil;
    // Delete all messages in this conversation from the local database and in-memory cache.
    [conversation deleteAllMessages:&error];
    if (!error) {
        // Deletion succeeded.
    } else {
        // Deletion failed.
    }
}
```

## Delete messages in a time range from a local conversation

You can delete local messages in a specified time range from a local conversation:

```objectivec
// Retrieve the local conversation object by conversation ID.
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation) {
    // startTime and endTime are timestamps in milliseconds, and both boundaries are included in the deletion range.
    EMError *error = [conversation removeMessagesStart:startTime to:endTime];
    if (!error) {
        // Deletion succeeded.
    } else {
        // Deletion failed.
    }
}
```

## Delete a specified message from a local conversation

Call `deleteMessageWithId` to delete a specified message from the local database and the conversation's in-memory cache. This operation does not delete the server-side message.

```objectivec
// Retrieve the local conversation object by conversation ID.
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversationWithConvId:conversationId];
if (conversation && deleteMsg) {
    EMError *error = nil;
    // Delete the specified message only from the local database and the conversation's in-memory cache.
    [conversation deleteMessageWithId:deleteMsg.messageId error:&error];
    if (!error) {
        // Deletion succeeded.
    } else {
        // Deletion failed.
    }
}
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`deleteAllMessagesAndConversations`](#clear-chat-history-one-way) | `IEMChatManager` | Asynchronously clears all local conversations and messages and uses the parameter to determine whether to also clear server-side data one way. |
| [`getConversationWithConvId`](#delete-server-side-historical-messages-one-way) | `IEMChatManager` | Retrieves a local conversation object by conversation ID. |
| [`removeMessagesFromServerWithTimeStamp`](#delete-server-side-historical-messages-one-way) | `EMConversation` | Deletes server-side historical messages one way by timestamp and deletes the corresponding local messages from the current device's conversation. |
| [`removeMessagesFromServerMessageIds`](#delete-server-side-historical-messages-one-way) | `EMConversation` | Deletes server-side historical messages one way by message ID and deletes the corresponding local messages from the current device's conversation. |
| [`deleteAllMessages`](#delete-all-messages-in-a-specified-local-conversation) | `EMConversation` | Deletes all messages in a specified conversation from the local database and in-memory cache. |
| [`removeMessagesStart`](#delete-messages-in-a-time-range-from-a-local-conversation) | `EMConversation` | Deletes local messages in a specified time range. |
| [`deleteMessageWithId`](#delete-a-specified-message-from-a-local-conversation) | `EMConversation` | Deletes a specified message from the local database and conversation cache. |
| [`messageId`](#delete-a-specified-message-from-a-local-conversation) | `EMChatMessage` | Retrieves the message ID. |
