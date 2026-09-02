# Delete Conversations

## Feature overview

After you delete a friend, leave a chat group, or leave a chat room, the SDK does not automatically delete the corresponding one-to-one, group, or chat room conversation or its messages. You can call conversation deletion APIs to delete a specified conversation only for the current user, or clear all conversations and server-side roaming messages for the current user.

Conversation deletion affects only the current user. It does not delete conversations or messages for the peer user or other chat group members.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. For details, see [Quickstart](quickstart.html).
- Register `ChatManager` during SDK initialization so that message and conversation APIs can be called through `client.chatManager`.
- Understand the EasyIM API [limitations](/product/limitation.html).

## Delete a single conversation

Before deleting a specified conversation, obtain its conversation ID and type. To select the conversation from the current conversation list, call [getConversationList](conversation_list.html#retrieve-the-local-conversation-list) to read the list from the SDK's local conversation list cache. To refresh the list from the server first, call `refreshSessionList`. For details, see [Retrieve the conversation list from the server](conversation_list.html#retrieve-the-conversation-list-from-the-server).

After obtaining the conversation ID and type, call `deleteConversation` to delete the specified conversation for the current user. Use `deleteRoamingMessages` to control whether its server-side roaming messages are also deleted. This operation affects only the current user and does not delete conversations or messages for the peer user or other chat group members.

```typescript
const conversations = client.chatManager.getConversationList();

const targetConversation = conversations.find(
  conversation =>
    conversation.conversationId === 'user2' &&
    conversation.conversationType === 'singleChat'
);

if (targetConversation) {
  const result = await client.chatManager.deleteConversation({
    conversationId: targetConversation.conversationId,
    conversationType: targetConversation.conversationType,
    deleteRoamingMessages: true,
  });

  console.log(result.conversationId, result.conversationType, result.operation);
}
```

:::tip
If messages are subsequently sent or received after a conversation is deleted, the SDK recreates the corresponding local conversation. If `deleteRoamingMessages: false` is set when deleting a conversation, its server-side roaming messages are retained and can be retrieved as needed before they expire. If `deleteRoamingMessages: true` is set, the server-side roaming messages are also deleted and can no longer be retrieved through the SDK.
:::

## Delete multiple conversations

To delete multiple specified conversations, iterate over them in your app and call `deleteConversation`. For information about setting `deleteRoamingMessage`, see [Delete a single conversation](#delete-a-single-conversation).

```typescript
const conversations = [
  { conversationId: 'user1', conversationType: 'singleChat' },
  { conversationId: 'group1', conversationType: 'groupChat' },
] as const;

await Promise.all(
  conversations.map(conversation =>
    client.chatManager.deleteConversation({
      ...conversation,
      deleteRoamingMessages: false,
    })
  )
);
```

## Clear all conversations and messages

Call `clearAllMessagesAndConversations` to clear all conversations and server-side roaming messages for the current user. After they are cleared, the current user can no longer retrieve them from the server. Other users are unaffected.

```typescript
await client.chatManager.clearAllMessagesAndConversations();
```

After the call succeeds, the SDK clears both the local conversation cache and the conversation list cache. If the local conversation list snapshot changes, the SDK triggers `onConversationListUpdate` with `reason` set to `local`.

## Monitor conversation list updates

After a conversation is deleted or all conversations are cleared, the SDK triggers `onConversationListUpdate` if the local conversation list changes. Monitor this event to refresh the conversation list UI.

```typescript
client.chatManager.addEventHandler('conversation-delete-listener', {
  onConversationListUpdate: payload => {
    console.log('Reason for conversation list update:', payload.reason);
    console.log('Current complete conversation list:', payload.items);
    console.log('Changes in this update:', payload.patch);
  },
});
```

In the event callback, `items` is the SDK's current complete and sorted conversation list snapshot. A simple UI can use this field directly to refresh the list. If the business layer must retain custom local fields, use `patch.removed`, `patch.upserted`, `patch.reset`, and `patch.orderChanged` for incremental merging.

## Considerations

- Deleting a conversation or clearing all conversations is a one-way operation that affects only conversations and messages for the current user, not other users.
- The SDK does not automatically delete a corresponding conversation after a friend is deleted or a chat group is left. Call `deleteConversation` explicitly if needed.
- When calling `deleteConversation`, if `deleteRoamingMessages` is `false`, only the current user's conversation record is deleted; its server-side roaming messages are retained.
- If new messages are subsequently generated in a deleted conversation, or the app refreshes that conversation from the server again, it may reappear in the conversation list.
- `clearAllMessagesAndConversations` clears all conversations and server-side roaming messages for the current user. Call it with caution.
- If a parameter is invalid, such as an incorrect type for `conversationId`, `conversationType`, or `deleteRoamingMessages`, the SDK returns parameter error `110`.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`deleteConversation`](#delete-a-single-conversation) | `ChatManager` | Delete a specified conversation for the current user, with the option to also delete its server-side roaming messages. |
| [`clearAllMessagesAndConversations`](#clear-all-conversations-and-messages) | `ChatManager` | Clear all conversations and server-side roaming messages for the current user. |
