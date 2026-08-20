# Delete Messages

## Feature overview

The SDK supports deleting server-side messages for the current user only:

- Clear the current user's server-side chat history: Clears the current user's messages and conversations for one-to-one chats, group chats, and chat rooms from the server. After the chat history is cleared, the SDK also clears locally cached conversation and message data and updates the local conversation list cache.
- Delete the current user's server-side historical messages: Deletes historical messages saved for the current user on the server by message ID or timestamp. This operation does not automatically delete the local message cache on the current device. If your app has saved or displayed these messages locally, update the local message list after the API call succeeds.

After you clear server-side chat history or delete historical messages for the current user, you can no longer retrieve those conversations and messages from the server. Other users are not affected.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and connected to the server. For details, see [Quickstart](quickstart.html).
- You registered `ChatManager` during SDK initialization and can call message- and conversation-deletion APIs through `client.chatManager`.

## Clear chat history for the current user

Call `clearAllMessagesAndConversations` to clear the current user's server-side chat history, including messages and conversations for one-to-one chats, group chats, and chat rooms. After you clear the chat history, you can no longer retrieve those conversations and messages from the server. Other users are not affected.

After the chat history is cleared, the SDK also clears locally cached conversation and message data and updates the local conversation list cache. If the local conversation list changes, the `onConversationListUpdate` event is triggered with `reason` set to `local`.

```typescript
await client.chatManager.clearAllMessagesAndConversations();
```

## Delete server-side historical messages for the current user

Call `removeHistoryMessages` to delete historical messages saved for the current user on the server by message ID or timestamp. This operation affects only the current user. After deletion, the current user can no longer retrieve these messages from the server through message roaming. Other users in the same one-to-one chat, group chat, or chat room are not affected and can still retrieve the messages according to the roaming policy.

The following deletion methods are supported:

- Delete by message ID: Use `messageIds` to specify the messages to delete. You can delete up to 50 messages at a time.
- Delete by time: Use `beforeTimestamp` to specify a timestamp and delete historical messages received by the server before that timestamp. The timestamp is in milliseconds.

You must pass at least one of `messageIds` and `beforeTimestamp`:

- Pass only `messageIds` to delete by message ID.
- Pass only `beforeTimestamp` to delete by timestamp.
- If you pass both, the SDK deletes by `messageIds` first.

With multi-device login, after deletion succeeds, the current user's other online devices receive the `onMultiDeviceMessageRemoved` callback.

:::tip 
1. `removeHistoryMessages` deletes only the current user's historical messages saved on the server. It does not automatically delete the local message cache on the current device. If your app has saved or displayed these messages locally, update the local message list after the call succeeds.
2. Chat room message roaming is disabled by default. To use this feature, contact the Easemob business team.
:::

- Delete by message ID

```typescript
await client.chatManager.removeHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
  messageIds: ['msg-1', 'msg-2', 'msg-3'], // Up to 50 messages
});
```

- Delete by time

Delete all messages before the specified timestamp:

```typescript
await client.chatManager.removeHistoryMessages({
  conversationId: 'user2',
  conversationType: 'singleChat',
  beforeTimestamp: Date.now(), 
});
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`clearAllMessagesAndConversations`](#clear-chat-history-for-the-current-user) | `ChatManager` | Clears all conversations and server-side roaming messages for the current user. |
| [`removeHistoryMessages`](#delete-server-side-historical-messages-for-the-current-user) | `ChatManager` | Deletes server-side historical messages in the specified conversation for the current user by message ID or time range. |
