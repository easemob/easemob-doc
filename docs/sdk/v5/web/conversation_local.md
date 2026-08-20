# Manage Local Conversations

## Feature overview

Local conversations are the conversation list cache maintained by the SDK for the current user. When the user sends or receives messages, synchronizes after login, explicitly refreshes the server-side list, or performs operations such as pinning, tagging, deletion, or unread-count clearing, the SDK creates or updates this cache. The business layer can render the conversation list from it.

This document describes how to read, refresh, and maintain the local conversation list cache. Conversation list update events are used only to explain monitoring and are not counted as APIs in the final list.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully.
- Register `ChatManager` during initialization so conversation and message APIs can be called through `client.chatManager`.
- To use the server-side conversation list, pinning, or tags, [activate the server-side conversation list feature in Easemob Console](/product/console/basic_conversation_group_chatroom.html#服务端会话列表).

## Local conversation data sources

The SDK's local conversation list cache mainly comes from the following sources:

- After login, the SDK initializes the local cache and reads the current user's previously cached local conversation list. This does not depend on whether `enableSyncData` contains `conversation`.
- If `enableSyncData` contains `conversation`, after reading the local cache the SDK automatically synchronizes the server-side conversation list and updates the cache with the result.
- The business layer can call `refreshSessionList` to explicitly refresh the list from the server and write the result to the local cache.
- When the current user sends or receives messages, the SDK creates or updates local display information such as the latest message, unread count, and sorting time.
- After operations such as pinning, tagging, deletion, clearing all conversations, or clearing unread counts succeed, the SDK synchronously updates the local conversation list cache.

The local cache is intended for conversation list display and is not equivalent to complete user attributes, chat group information, or all historical messages. Retrieve complete content from the corresponding module as needed.

## Automatically synchronize the conversation list after login

During initialization, `enableSyncData` includes `conversation` by default. After login, the SDK first initializes and reads the local cache; if `enableSyncData` contains `conversation`, it then automatically synchronizes the server-side list and refreshes the local cache.

If `enableSyncData` is configured without `conversation`, the SDK still initializes and reads the existing local cache but does not automatically synchronize from the server after login. To retrieve the latest server-side list, call [refreshSessionList](conversation_list.html#retrieve-the-conversation-list-from-the-server) when appropriate.

If explicitly configuring synchronization items, retain `conversation`:

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  managers: [ChatManager],
  enableSyncData: ['conversation'],
});
```

To include [empty conversations](conversation_overview.html#conversation-lists-and-empty-conversations) during automatic synchronization, configure `syncConversationListConfig.includeEmpty`:

```typescript
const client = ChatClient.init({
  appKey: 'your appKey',
  managers: [ChatManager],
  enableSyncData: ['conversation'],
  syncConversationListConfig: {
    includeEmpty: true,
  },
});
```

:::tip
`syncConversationListConfig.includeEmpty` affects the results of automatic login synchronization and explicit server-side refreshes. When `getConversationList` reads the local cache directly, the SDK filters out empty conversations whose `lastMessage` is `null`.
:::

## Read the conversation list from the local cache

Call `getConversationList` to read the current list from the SDK's local cache. This API does not initiate a network request and is suitable for page initialization, rereading a local snapshot after an update event, or filtering locally by pin state or tag.

```typescript
// Retrieve all non-empty local conversations.
const conversations = client.chatManager.getConversationList();

// Retrieve pinned local conversations.
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

// Retrieve local conversations with a specified tag. mark ranges from 0-19.
const markedConversations = client.chatManager.getConversationList({
  mark: 3,
});
```

`getConversationList` supports the following filter parameters:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `isPinned` | Boolean | No | Whether to return only pinned or only unpinned conversations. |
| `mark` | Number | No | Conversation tag. Must be an integer from `0` through `19`; otherwise, the SDK throws a parameter error. |

:::tip
`getConversationList` only reads the current local cache and does not refresh data from the server. To retrieve the latest server-side list, call `refreshSessionList` first.
:::

## Explicitly refresh the local conversation list cache

Call `refreshSessionList` to retrieve the latest list from the server and refresh the SDK's local cache. The API returns the refreshed list.

```typescript
const conversations = await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

console.log(conversations);
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `includeEmpty` | Boolean | No | Whether to return empty conversations. They are not returned by default; set this parameter to `true` to return them. |

:::tip
Server-side conversation list updates may be delayed. The SDK automatically synchronizes after login by default, so your app generally does not need to call `refreshSessionList` immediately after every message.
:::

## Conversation list item fields

Each item returned by `getConversationList` and `refreshSessionList` is a `ConversationItem` with the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID: peer user ID, chat group ID, or chat room ID. |
| `conversationType` | String | `singleChat`, `groupChat`, or `chatRoom`. |
| `unreadCount` | Number | Local unread-message count. |
| `lastMessage` | Object \| null | Latest message summary; may be `null` for an empty conversation. |
| `lastMessageAt` | Number | Latest-message timestamp, in milliseconds. |
| `isPinned` | Boolean | Whether the conversation is pinned. |
| `pinnedTimestamp` | Number | Pin timestamp, in milliseconds. |
| `marks` | Array | Applied conversation tags. |
| `readAt` | Number | Read position or read timestamp. |
| `remindType` | String | Notification type, such as default, all messages, @ messages, or DND. |
| `conversationName` | String | Conversation display name. |
| `conversationAvatar` | String | Conversation avatar URL. |

## Set the conversation currently being viewed

When a user enters a conversation page, call `setCurrentConversation`. Subsequent online messages still update the latest message and list order but no longer increment the conversation's local unread count.

```typescript
client.chatManager.setCurrentConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});
```

This state exists only in the current SDK instance's memory. When the user switches or leaves the conversation page, call `resetCurrentConversation` to restore the default unread-count rule:

```typescript
client.chatManager.resetCurrentConversation();
```

To confirm the current conversation, call `getCurrentConversation`:

```typescript
const currentConversation = client.chatManager.getCurrentConversation();
console.log(currentConversation);
```

## Common operations that update the local conversation list cache

After the following operations succeed, the SDK synchronously updates the local cache. If its snapshot changes, the SDK triggers a conversation list update event that the business layer can use to refresh the UI.

| Scenario | API | Local cache change |
| :--- | :--- | :--- |
| Pin or unpin | `setConversationPinned` | Updates `isPinned`, `pinnedTimestamp`, and list order. |
| Add a tag | `addConversationMark` | Updates `marks`. |
| Remove a tag | `removeConversationMark` | Updates `marks`. |
| Delete a conversation | `deleteConversation` | Removes the specified conversation locally. |
| Clear all conversations and messages | `clearAllMessagesAndConversations` | Clears the current user's local conversation/session-list cache. |
| Clear one unread count | `clearConversationUnreadMessageCount` | Sets `unreadCount` to `0` and updates `readAt`. |
| Clear all unread counts | `clearAllConversationUnreadMessageCount` | Sets all local `unreadCount` values to `0` and updates `readAt`. |

Example code:

```typescript
// Delete a specified conversation.
await client.chatManager.deleteConversation({
  conversationId: 'user_2',
  conversationType: 'singleChat',
  deleteRoamingMessages: false,
});

// Clear all conversations and server-side roaming messages for the current user.
await client.chatManager.clearAllMessagesAndConversations();

// Clear a specified conversation's unread count.
await client.chatManager.clearConversationUnreadMessageCount({
  conversationId: 'user_2',
  conversationType: 'singleChat',
});

// Clear all conversation unread counts.
await client.chatManager.clearAllConversationUnreadMessageCount();
```

## Monitor local conversation list updates

When the local cache changes, the SDK triggers a conversation list update event. Register a listener through `addEventHandler` and use its snapshot to refresh the UI.

```typescript
client.chatManager.addEventHandler('conversation-list-listener', {
  onConversationListUpdate: event => {
    console.log('会话列表更新原因:', event.reason);
    console.log('当前完整会话列表:', event.items);
    console.log('本次变化补丁:', event.patch);
  },
});
```

Common event fields are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `items` | Array | Current complete and sorted conversation list snapshot. |
| `reason` | String | Update reason. Changes caused by local operations are usually `local`. |
| `patch` | Object | Patch for this change. Use it for incremental merging when retaining custom local fields. |

:::tip
The event name and fields explain the local update mechanism and are not counted separately as APIs in this document.
:::

## Considerations

- The SDK maintains the local cache internally; no additional local-storage plugin is required.
- `getConversationList` reads only the local cache, does not refresh network data, and filters empty conversations whose `lastMessage` is `null`.
- `refreshSessionList({ includeEmpty: true })` refreshes and returns empty conversations from the server; your business layer decides whether to display them.
- In `getConversationList({ mark })`, `mark` must be an integer from `0` through `19`, or the SDK throws a parameter error.
- `setCurrentConversation` affects only the online-message unread-count rule in the current SDK instance's memory and is neither synchronized nor persisted.
- Deletion, clearing, and unread-count operations may require a connected client. Handle failures according to the SDK error information.
- Use consistent letter casing for login user IDs to avoid inconsistent server-side and local conversation data.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`ChatClient.init`](#automatically-synchronize-the-conversation-list-after-login) | `ChatClient` | Initialize the SDK, register `ChatManager`, and configure automatic conversation list synchronization. |
| [`getConversationList`](#read-the-conversation-list-from-the-local-cache) | `ChatManager` | Read non-empty local conversations and filter by pin state or tag. |
| [`refreshSessionList`](#explicitly-refresh-the-local-conversation-list-cache) | `ChatManager` | Retrieve the latest server-side list and refresh the local cache. |
| [`setCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Set the current conversation so online messages do not increment its local unread count. |
| [`resetCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Reset the current conversation and restore the default rule. |
| [`getCurrentConversation`](#set-the-conversation-currently-being-viewed) | `ChatManager` | Retrieve the current conversation; returns `null` if none is set. |
| [`setConversationPinned`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Pin or unpin a conversation and update the local cache. |
| [`addConversationMark`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Add a conversation tag and update the local cache. |
| [`removeConversationMark`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Remove a conversation tag and update the local cache. |
| [`deleteConversation`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Delete a conversation and remove it from the local cache. |
| [`clearAllMessagesAndConversations`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Clear all conversations, roaming messages, and the local list cache for the current user. |
| [`clearConversationUnreadMessageCount`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Clear one unread count and update local `unreadCount` and `readAt`. |
| [`clearAllConversationUnreadMessageCount`](#common-operations-that-update-the-local-conversation-list-cache) | `ChatManager` | Clear all unread counts and update the local cache. |
