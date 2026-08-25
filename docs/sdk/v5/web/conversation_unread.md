# Clear Conversation Unread Counts

## Feature overview

Clearing conversation unread counts sets the number of unread messages in a specified conversation or all conversations to `0` for the current user. A typical use case is to call the clearing API after the user enters a conversation page. The SDK marks the conversation as read for the current user and synchronously updates its unread count (`unreadCount`) and clearing time (`readAt`) in the local conversation list cache.

**Currently, one-to-one and group conversations support clearing unread counts; chat room conversations do not.**

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully.
- Register `ChatManager` during SDK initialization so that conversation and message APIs can be called through `client.chatManager`.
- Connect the client to the server. A clearing operation must be sent through the connection channel.
- Understand the EasyIM [limitations](/product/limitation.html).

## Process

The core process is as follows:

![](/images/web/conversation_unread_count_clear.png)

The basic steps are as follows:

1. When the user enters a conversation page, first call `setCurrentConversation` to set the conversation currently being viewed so subsequent online messages do not continue incrementing its local unread count.
2. If the conversation has unread messages, call `clearConversationUnreadMessageCount` to clear its unread count.
3. After the call succeeds, the SDK updates the current device's local cache: it sets the target conversation's `unreadCount` to `0` and updates `readAt` in the conversation list item.
4. If the local conversation list snapshot changes, the SDK triggers `onConversationListUpdate`, which you can use to refresh the conversation list UI.
5. With multi-device login, the operation does not notify the conversation peer and is synchronized only to the current user's other online devices, which receive `onConversationUnreadMessageCountCleared`.
6. When `clearAllConversationUnreadMessageCount` is called, the SDK clears all conversation unread counts in the current device's local cache and triggers `onAllConversationsUnreadMessageCountCleared` on the current user's other online devices.

:::tip
- Clearing a conversation unread count does not notify the conversation peer or trigger a message read receipt event for the peer. To inform the message sender that specific messages have been read, use [message read receipts](message_receipt.html).
- A conversation list snapshot is the SDK's local in-memory view of synchronized conversations and display information such as their unread counts and latest messages.
:::

## Set the conversation currently being viewed

When a user enters a conversation page, call `setCurrentConversation` to set the conversation currently being viewed. When an online message subsequently arrives, the SDK still updates the latest message and conversation order but does not increment the local unread count.

```typescript
client.chatManager.setCurrentConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});
```

This state is stored only in the memory of the current SDK instance. When the user switches conversations, leaves, or closes the page, call `resetCurrentConversation` to restore the default unread-count increment rule.

```typescript
client.chatManager.resetCurrentConversation();
```

To confirm the current conversation, call `getCurrentConversation`:

```typescript
const currentConversation = client.chatManager.getCurrentConversation();
console.log(currentConversation);
```

## Clear the unread count of a single conversation

After the user enters a conversation page, if it has unread messages, call `clearConversationUnreadMessageCount` to clear its unread count.

```typescript
await client.chatManager.clearConversationUnreadMessageCount({
  // Conversation ID. For one-to-one chat, it is the peer user ID; for group chat, the chat group ID.
  conversationId: 'user2',
  // Conversation type. Only singleChat and groupChat are supported.
  conversationType: 'singleChat',
});
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `conversationId` | String | Yes | Conversation ID. For one-to-one chat, it is the peer user ID; for group chat, the chat group ID. |
| `conversationType` | String | Yes | Conversation type. Only `singleChat` and `groupChat` are supported. |

After the call succeeds:

- The SDK sends the unread-count clearing operation to the server, but not to the conversation peer.
- The target conversation's `unreadCount` in the current device's local cache is set to `0`.
- `readAt` in the current device's local conversation list item is updated to the clearing time.
- If the local conversation list changes, the current device triggers `onConversationListUpdate`, whose `reason` is usually `local`.
- The current user's other online devices receive `onConversationUnreadMessageCountCleared`.

## Clear unread counts of all conversations

To clear all conversation unread counts for the current user at once, call `clearAllConversationUnreadMessageCount`.

```typescript
await client.chatManager.clearAllConversationUnreadMessageCount();
```

After the call succeeds:

- The SDK sends the clearing operation for all conversations to the server, but not to conversation peers.
- `unreadCount` is set to `0` for all conversations in the current device's local cache.
- `readAt` in the current device's local conversation list items is updated to the clearing time.
- If the local conversation list changes, the current device triggers `onConversationListUpdate`.
- The current user's other online devices receive `onAllConversationsUnreadMessageCountCleared`.

## Monitor conversation list updates on the current device

After clearing one or all conversation unread counts, the SDK triggers `onConversationListUpdate` if the local conversation list snapshot changes. We recommend monitoring this event and using its `items` to refresh the conversation list UI.

```typescript
client.chatManager.addEventHandler('conversation-unread-listener', {
  onConversationListUpdate: event => {
    console.log('Reason for conversation list update:', event.reason);
    console.log('Current complete conversation list:', event.items);
    console.log('Changes in this update:', event.patch);
  },
});
```

The main fields in `onConversationListUpdate` are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `version` | Number | Conversation list snapshot version. |
| `items` | Array | Current complete and sorted conversation list snapshot. |
| `reason` | String | Reason for the update. A local change caused by clearing unread counts is usually `local`. |
| `patch` | JSON | Patch for this change. Use it for incremental merging when retaining custom local business fields. |

To explicitly read the current local conversation list, call `getConversationList`:

```typescript
const conversations = client.chatManager.getConversationList();
```

## Monitor unread-count changes across devices

To synchronize conversation unread counts across devices, activate multi-device login. For details, see [Log in on multiple devices](multi_device.html).

Assume that the current user is logged in on devices A and B:

- After the user clears a specified conversation's unread count on device A, device B receives `onMultiDeviceConversation` with `operation` set to `CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED`.
- After the user clears all conversation unread counts on device A, device B receives `onMultiDeviceConversation` with `operation` set to `ALL_CONVERSATIONS_UNREAD_MESSAGE_COUNT_CLEARED`.

Register a multi-device event listener through `client.addEventHandler`. After receiving an event, we recommend rereading the SDK's local conversation list and refreshing the list, unread counts, or app badge.

```typescript
// Monitor multi-device conversation unread-count clearing events.
client.addEventHandler('multi-device-conversation-unread-listener', {
  onMultiDeviceConversation: event => {
    const conversations = client.chatManager.getConversationList();

    if (event.operation === 'CONVERSATION_UNREAD_MESSAGE_COUNT_CLEARED') {
      // The specified conversation's unread count was cleared on another device.
      const conversation = conversations.find(
        item =>
          item.conversationId === event.conversationId &&
          item.conversationType === event.conversationType
      );

      const unreadCount = conversation?.unreadCount ?? 0;

      // Refresh this conversation's unread count based on the latest unreadCount.
      refreshConversationUnreadCount(event.conversationId, unreadCount);
      return;
    }

    if (event.operation === 'ALL_CONVERSATIONS_UNREAD_MESSAGE_COUNT_CLEARED') {
      // All conversation unread counts were cleared on another device.
      const totalUnreadCount = conversations.reduce(
        (total, conversation) => total + conversation.unreadCount,
        0
      );

      // Refresh the list and app badge based on the latest conversation list.
      refreshConversationList(conversations);
      updateAppBadge(totalUnreadCount);
    }
  },
});

function refreshConversationUnreadCount(
  conversationId: string,
  unreadCount: number
) {
  // Refresh the specified conversation UI.
}

function refreshConversationList(conversations) {
  // Refresh the conversation list UI.
}

function updateAppBadge(unreadCount: number) {
  // Update the app badge or unread-count UI.
}
```

:::tip 
A multi-device event only indicates that the current user's conversation unread state changed on another device. Reread the SDK's local conversation list in the callback instead of updating only the number cached by the UI. After `clearConversationUnreadMessageCount` or `clearAllConversationUnreadMessageCount` succeeds, the current device detects the local list change through `onConversationListUpdate`, while the user's other devices detect it through `onMultiDeviceConversation`.
:::

## Differences from message read receipts

`sendMessageReadReceipts` sends read receipts for specified messages, while `clearConversationUnreadMessageCount` and `clearAllConversationUnreadMessageCount` operate on the current user's conversation unread counts.

```typescript
await client.chatManager.sendMessageReadReceipts({
  conversationId: 'user2',
  conversationType: 'singleChat',
  messageIds: ['msg1', 'msg2'],
});
```

The differences are as follows:

| Feature | Target | Clears the local conversation unread count | Main event |
| :--- | :--- | :--- | :--- |
| Clear conversation unread counts | Current user's conversation unread state | Yes | `onConversationListUpdate`, `onConversationUnreadMessageCountCleared`, `onAllConversationsUnreadMessageCountCleared` |
| [Message read receipts](message_receipt.html#one-to-one-message-read-receipts) | Read state of specified messages | No | `onMessageReadReceipts` |

## Considerations

- `clearConversationUnreadMessageCount` supports only one-to-one and group conversations. `conversationType` can only be `singleChat` or `groupChat`; chat rooms are not supported.
- When calling `clearConversationUnreadMessageCount`, `conversationId` cannot be empty and `conversationType` must be valid. Invalid parameters cause SDK parameter error `110`.
- The client must be connected before a clearing API is called; otherwise, a connection-related error is thrown.
- Clearing a conversation unread count does not notify the peer or trigger a conversation read event or message read receipt event for the peer.
- A clearing operation updates the current user's local conversation unread state. If the local conversation list snapshot changes, `onConversationListUpdate` is triggered.
- `setCurrentConversation` affects only the online-message unread-count increment rule in the current SDK instance's memory. Call `resetCurrentConversation` when switching or leaving pages.
- `sendMessageReadReceipts` only indicates that specified messages have been read. It does not advance conversation-level `readAt` or directly clear the local unread count.

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`setCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Set the current conversation so subsequent online messages do not increment its local unread count. |
| [`resetCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Reset the current conversation and restore the default unread-count increment rule. |
| [`getCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Retrieve the current conversation; returns `null` if none is set. |
| [`clearConversationUnreadMessageCount`](#clear-the-unread-count-of-a-single-conversation) | `ChatManager` | Clear the unread count of a specified one-to-one or group conversation. |
| [`clearAllConversationUnreadMessageCount`](#clear-unread-counts-of-all-conversations) | `ChatManager` | Clear all conversation unread counts for the current user. |
| [`getConversationList`](#monitor-conversation-list-updates-on-the-current-device) | `ChatManager` | Explicitly read the SDK's local conversation list cache. |
| [`sendMessageReadReceipts`](#differences-from-message-read-receipts) | `ChatManager` | Send read receipts for specified messages without directly clearing the conversation unread count. |
