# Pin Conversations

## Feature overview

Conversation pinning keeps important one-to-one, group, or chat room conversations near the top of the conversation list so users can quickly find frequently used or important conversations. The pin state is written to the server-side conversation list, and the SDK synchronously updates it in the local conversation list cache so the frontend can refresh the UI directly.

## Feature activation

Before pinning conversations, [activate the server-side conversation list feature](conversation_list.html#retrieve-the-conversation-list-from-the-server). Conversation pinning is part of that feature and should be integrated together with conversation list synchronization and local reading.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in.
- Register `ChatManager` during SDK initialization so that conversation APIs can be called through `client.chatManager`.
- [Activate the server-side conversation list feature](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Pin or unpin a conversation

Call `setConversationPinned` to pin or unpin a conversation. This method requests the server to update the pin state and, after success, writes the state back to the SDK's local conversation list cache. If the local conversation list changes as a result, the SDK triggers `onConversationListUpdate`.

To automatically synchronize the conversation list after login, retain or configure `conversation` in `enableSyncData` during SDK initialization.

You can pin up to 50 conversations.

```typescript
// Pin a one-to-one conversation.
const pinnedResult = await client.chatManager.setConversationPinned({
  conversationId: 'user2',
  conversationType: 'singleChat',
  pinned: true,
});

console.log(pinnedResult);

// Unpin a one-to-one conversation.
const unpinnedResult = await client.chatManager.setConversationPinned({
  conversationId: 'user2',  
  conversationType: 'singleChat',
  pinned: false,
});

console.log(unpinnedResult);
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | Yes | Conversation ID. For one-to-one chat, it is the peer user ID; for group chat, the chat group ID; and for chat room chat, the chat room ID. |
| `conversationType` | String | Yes | Conversation type. Possible values are `singleChat`, `groupChat`, and `chatRoom`. |
| `pinned` | Boolean | Yes | Whether to pin the conversation. `true` pins it and `false` unpins it. |

The result is returned as `ConversationMutationResult` with the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID. |
| `conversationType` | String | Conversation type. |
| `operation` | String | Operation type. The value is `setPinned` when pinning or unpinning. |
| `isPinned` | Boolean | Pin state after the operation. |
| `pinnedTime` | Number | Pin timestamp, in milliseconds. The value is usually `0` after unpinning. |

## Retrieve pinned conversations

After pinning a conversation, use [getConversationList({ isPinned: true })](conversation_list.html#retrieve-the-local-conversation-list) to read pinned conversations from the SDK's local conversation list cache. This method does not initiate a network request and can be used directly when rendering the list.

```typescript
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

pinnedConversations.forEach(conversation => {
  console.log('Conversation ID:', conversation.conversationId);
  console.log('Conversation type:', conversation.conversationType);
  console.log('Is pinned:', conversation.isPinned);
  console.log('Pin time:', conversation.pinnedTimestamp);
});
```

To synchronize the latest conversation list from the server first, call [refreshSessionList](conversation_list.html#retrieve-the-conversation-list-from-the-server), and then read the local pinned conversations:

```typescript
await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});
```

Each item returned by `getConversationList` is a `ConversationItem`. The fields most relevant to pinning are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID. |
| `conversationType` | String | Conversation type. |
| `lastMessage` | JSON \| null | Latest message summary. |
| `lastMessageAt` | Number | Timestamp of the latest message, in milliseconds. |
| `isPinned` | Boolean | Whether the conversation is pinned. |
| `pinnedTimestamp` | Number | Conversation pin timestamp, in milliseconds. |
| `marks` | Array | Conversation tag list. |
| `unreadCount` | Number | Number of unread messages in the conversation. |
| `remindType` | String | Conversation notification type. |

:::tip
The pin time field in the result of `setConversationPinned` is `pinnedTime`, while that in a conversation list item is `pinnedTimestamp`. Both are millisecond pin timestamps but occur in different data structures.
:::

## Monitor local conversation list updates

After `setConversationPinned` succeeds, if the SDK's local conversation list cache changes, `onConversationListUpdate` is triggered and `reason` is usually `local`. We recommend monitoring this event and using its `items` to refresh the conversation list UI.

```typescript
client.chatManager.addEventHandler('conversation-pin-listener', {
  onConversationListUpdate: payload => {
    console.log('Reason for conversation list update:', payload.reason);
    console.log('Current complete conversation list:', payload.items);
    console.log('Changes in this update:', payload.patch);
  },
});
```

In the callback, `items` is the SDK's current complete and sorted conversation list snapshot. Pinned conversations contain `isPinned` and `pinnedTimestamp`, so the frontend can refresh the display directly from this list.

## Monitor multi-device conversation pin events

When the same user pins or unpins a conversation on another device, the current device can monitor the multi-device event through `onMultiDeviceConversation`. The SDK normalizes server-issued pin operations to the following types:

| Operation | Description |
| :--- | :--- |
| `CONVERSATION_PINNED` | A conversation is pinned on another device. |
| `CONVERSATION_UNPINNED` | A conversation is unpinned on another device. |

```typescript
client.addEventHandler('multi-device-conversation-pin-listener', {
  onMultiDeviceConversation: event => {
    if (
      event.operation === 'CONVERSATION_PINNED' ||
      event.operation === 'CONVERSATION_UNPINNED'
    ) {
      console.log('Multi-device conversation pin event:', event);
    }
  },
});
```

Common fields in a multi-device event are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `category` | String | Event category. The value for a conversation event is `conversation`. |
| `operation` | String | Operation type, such as `CONVERSATION_PINNED` or `CONVERSATION_UNPINNED`. |
| `conversationId` | String | Conversation ID. |
| `conversationType` | String | Conversation type. |
| `operatorId` | String | Operator user ID. |
| `deviceId` | String | Source device ID. |
| `timestamp` | Number | Event timestamp. |

:::tip
Multi-device events notify the current user's other online devices. After a pin operation initiated on the current device succeeds, update the local UI primarily through the result of `setConversationPinned` and `onConversationListUpdate`.
:::

## Sorting and display recommendations

`client.chatManager.getConversationList` returns a local conversation list snapshot already sorted according to the SDK's default rules. We recommend using the returned order directly.

The sorting rules are as follows:

- Pinned conversations precede unpinned conversations.
- Pinned conversations are sorted by `pinnedTimestamp` in descending order, with the most recently pinned first.
- Unpinned conversations are sorted by recent activity in descending order, generally equivalent to descending `lastMessageAt`.

```typescript
const conversations = client.chatManager.getConversationList();

console.log('Conversation list:', conversations);
```

For custom sorting, use `isPinned`, `pinnedTimestamp`, and `lastMessageAt` in `ConversationItem`:

```typescript
const conversations = client.chatManager.getConversationList();

const sortedConversations = [...conversations].sort((first, second) => {
  const firstPinned = first.isPinned === true;
  const secondPinned = second.isPinned === true;

  if (firstPinned !== secondPinned) {
    return firstPinned ? -1 : 1;
  }

  if (firstPinned && secondPinned) {
    return (second.pinnedTimestamp ?? 0) - (first.pinnedTimestamp ?? 0);
  }

  return (second.lastMessageAt ?? 0) - (first.lastMessageAt ?? 0);
});

console.log('Custom-sorted conversation list:', sortedConversations);
```

## Considerations

- When calling `setConversationPinned`, `conversationId` cannot be empty, `conversationType` must be valid, and `pinned` must be Boolean. Invalid parameters cause SDK parameter error `110`.
- Pinning is written to the server and synchronized to the SDK's local conversation list cache. If local data changes, `onConversationListUpdate` is triggered.
- The local list does not return empty conversations whose `lastMessage` is empty by default. To refresh empty conversations from the server, call `refreshSessionList({ includeEmpty: true })` and use its result.
- Pinning does not affect message sending or receiving, the unread count, message read status, or conversation tags.
- The server-side conversation list has a limit of 100 conversations per end user by default. At the limit, inactive conversations may be removed, and their pin state may no longer be visible in the list.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setConversationPinned`](#pin-or-unpin-a-conversation) | `ChatManager` | Pin or unpin a specified conversation. |
| [`getConversationList`](#retrieve-pinned-conversations) | `ChatManager` | Read the SDK's local conversation list and filter pinned conversations through `isPinned`. |
| [`refreshSessionList`](#retrieve-pinned-conversations) | `ChatManager` | Refresh the conversation list from the server and update the SDK's local cache. |
