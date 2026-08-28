# Conversation List

## Feature overview

- **Local conversation list:** For one-to-one, group, and chat room conversations, the SDK creates or updates a local conversation when a user sends or receives messages and maintains it in the local conversation list cache. The app can read the list from local memory or the database to display names, avatars, latest messages, unread counts, pin states, and conversation tags.
- **Server-side and local data:** Both the EasyIM server and the local SDK maintain conversation list data. The server stores the current user's conversation state, while the local cache enables quick client-side reading and display. After SDK initialization and login, the SDK automatically maintains the local list. Synchronization, explicit refreshes, message sending or receiving, deletion, unread-count clearing, pinning or unpinning, and adding or removing tags may update it.
- **Synchronization and change notifications:** To obtain the latest server-maintained data, configure automatic conversation data synchronization before initializing the SDK, wait for synchronization after login, and then read the local list. The SDK notifies the app through a conversation list update event when the local list changes. The current device can also detect conversation pin changes made by the same account on another device through multi-device events.

## Feature activation

Before use, activate the server-side conversation list feature in [EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html).
- Register `ChatManager` during initialization so message and conversation APIs can be called through `client.chatManager`.
- Understand the EasyIM API [limitations](/product/limitation.html).

:::tip
The local conversation list cache depends on browser local storage. Use a modern browser such as Chrome, Firefox, Safari, or another browser based on these engines, such as Microsoft Edge. **Internet Explorer (IE) is not supported.**
:::

## Automatically synchronize the conversation list after login

During SDK initialization, `enableSyncData` includes `conversation` by default. After login, the SDK automatically synchronizes the conversation list from the server and updates the local cache. Monitor synchronization through `onSyncDataStart` and `onSyncDataFinished`. See [Monitor conversation list synchronization](#monitor-conversation-list-synchronization).

To include empty conversations during automatic synchronization, set `syncConversationListConfig.includeEmpty` to `true` during initialization:

```typescript
const client = ChatClient.init({
  appKey: 'easemob-demo#chatdemoui',
  enableSyncData: ['conversation'],
  syncConversationListConfig: {
    includeEmpty: true,
  },
});
```

:::tip
1. Conversation tags are always synchronized and require no extra configuration.
2. For automatic data synchronization after login, see [SDK initialization](initialization.html).
:::

## Retrieve the conversation list from the server

Call `refreshSessionList` to retrieve the latest list from the server and refresh the SDK's local cache. The returned items contain the conversation ID and type, unread count, latest-message summary, pin state, tags, display name, avatar, and other information.

The SDK sorts the returned list according to its conversation list rules: pinned conversations appear first, and unpinned conversations are generally sorted in descending order by update time or latest-message time.

The server stores 100 conversations for each end user by default. Beyond this limit, new conversations overwrite old ones. If all historical messages in a conversation expire, it may become an [empty conversation](conversation_overview.html#conversation-lists-and-empty-conversations). `refreshSessionList` does not return empty conversations by default; set `includeEmpty` to `true` to return them.

:::tip
1. **To use this feature, [activate it in EasyIM Console](/product/console/basic_message_conversation.html#server-side-conversation-list). Only then can you use conversation pinning and tags.**
2. Mixed letter cases in login user IDs may cause an empty or inconsistent list. Use lowercase user IDs consistently.
3. Server-side list updates may be delayed. Do not call this method immediately after every message. The SDK synchronizes automatically after login; explicitly refresh only as required.
4. Messages sent through the RESTful API do not create or enter a conversation by default. If the latest message was sent through RESTful API, the conversation may still show the latest message sent through a non-RESTful API. To write RESTful API messages to the list, [activate the feature in EasyIM Console](/product/console/basic_conversation_group_chatroom.html#rest-发消息写会话列表).
:::

```typescript
const conversations = await client.chatManager.refreshSessionList({
  includeEmpty: false,
});

console.log(conversations);
```

## Retrieve the local conversation list

Call `getConversationList` to retrieve non-empty conversations from the local cache at once and optionally filter pinned conversations or conversations with a specified tag. This method does not initiate a network request.

:::tip
`getConversationList` does not return empty conversations whose `lastMessage` is empty. To retrieve them from the server, call `refreshSessionList({ includeEmpty: true })` and use its result.
:::

```typescript
// Retrieve all non-empty conversations.
const allConversations = client.chatManager.getConversationList();

// Retrieve pinned conversations.
const pinnedConversations = client.chatManager.getConversationList({
  isPinned: true,
});

// Retrieve conversations with a specified tag.
const markedConversations = client.chatManager.getConversationList({
  mark: 3,
});
```

Each item returned by `getConversationList` is a `ConversationItem` with the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | String | Conversation ID: peer user ID for one-to-one chat, chat group ID for group chat, or chat room ID for chat room chat. |
| `conversationType` | String | Conversation type: `singleChat`, `groupChat`, or `chatRoom`. |
| `unreadCount` | Number | Number of unread messages. |
| `lastMessage` | JSON | Latest message summary. |
| `lastMessageAt` | Number | Timestamp of the latest message, in milliseconds. |
| `isPinned` | Boolean | Whether the conversation is pinned. |
| `pinnedTimestamp` | Number | Pin timestamp, in milliseconds. |
| `marks` | Array | Applied conversation tags. |
| `readAt` | Number | Read position or read timestamp. |
| `remindType` | String | Push notification mode: `DEFAULT`, `ALL`, `AT`, or `NONE`. |
| `conversationName` | String | Conversation display name. |
| `conversationAvatar` | String | Conversation avatar URL. |

## Retrieve the conversation name and avatar

The Web SDK provides `conversationName` and `conversationAvatar` in `ConversationItem` for conversation list display.

- One-to-one conversation: The peer user's nickname and avatar.
- Group conversation: The chat group name and avatar.
- Chat room conversation: The SDK generally does not automatically populate the chat room name and avatar. Retrieve chat room details and maintain the display information in your business layer if needed.
- If related user, friend, or chat group information is not synchronized, loaded, or available, `conversationName` may be the conversation ID and `conversationAvatar` may be `undefined`.

```typescript
const conversations = client.chatManager.getConversationList();

conversations.forEach(conversation => {
  const conversationName = conversation.conversationName;
  const conversationAvatar = conversation.conversationAvatar;

  console.log('Conversation name:', conversationName);
  console.log('Conversation avatar:', conversationAvatar);
});
```

To refresh the list from the server first, call [`refreshSessionList`](#retrieve-the-conversation-list-from-the-server).

## Conversation list update scenarios

| Scenario | Affects the server-side list | Affects the local list | Description |
| :--- | :--- | :--- | :--- |
| Conversation synchronization after login | No | Yes | Pulls the list from the server into the local cache without modifying server data. |
| Explicit `refreshSessionList` | No | Yes | Refreshes from the server and updates the local cache without modifying server data. |
| Send or receive messages | Yes | Yes | Updates server-side state and local information such as the latest message, order, and unread count. |
| Pin or unpin a conversation | Yes | Yes | Synchronizes the server-side pin state and updates the local pin state. |
| Add or remove a conversation tag | Yes | Yes | Synchronizes server-side tags and updates local `marks`. |
| Delete a conversation | Yes | Yes | Deletes the current user's server-side record and local cache. Whether roaming messages are deleted depends on `deleteRoamingMessages`. |
| Clear one conversation unread count | Yes | Yes | Synchronizes the server-side unread state and updates local `unreadCount` and `readAt`. |
| Clear all conversation unread counts | Yes | Yes | Synchronizes all server-side unread states and updates unread-count snapshots locally. |

:::tip
“Affects the server-side list” means modifying the current user's server-side conversation state, such as latest message, pin state, tags, deletion state, or unread state. “Affects the local list” means modifying the SDK's local cached data and possibly triggering `onConversationListUpdate`. Login synchronization and `refreshSessionList` only pull data and update the local cache; they do not modify the server-side list.
:::

## Monitor conversation list events

### Monitor conversation list synchronization

To monitor synchronization after login, use `client.addEventHandler` for `onSyncDataStart` and `onSyncDataFinished`. A `dataType` value of `conversation` identifies conversation list synchronization.

```typescript
client.addEventHandler('conversation-sync-listener', {
  onSyncDataStart: payload => {
    if (payload.dataType === 'conversation') {
      console.log('Conversation list synchronization started');
    }
  },
  onSyncDataFinished: payload => {
    if (payload.dataType === 'conversation') {
      console.log('Conversation list synchronization completed:', payload.status, payload.error);
    }
  },
});
```

The `status` in `onSyncDataFinished` indicates the result:

| Field | Type | Description |
| :--- | :--- | :--- |
| `dataType` | String | Synchronized data type. `conversation` indicates conversation list synchronization. |
| `status` | String | Completion status. `success` means success and `failed` means failure. |
| `error` | JSON | Failure details, returned only when `status` is `failed`. |

### Monitor conversation list updates

When the list changes, the SDK triggers `onConversationListUpdate`. Synchronization, messages, user profile changes, pinning, tagging, deletion, and unread-count clearing may trigger it.

`items` is the SDK's current complete and sorted snapshot. Use it directly for a simple UI, or use `patch` for incremental merging when retaining custom local fields.

```typescript
client.addEventHandler('conversation-listener', {
  onConversationListUpdate: payload => {
    console.log('Reason for conversation list update:', payload.reason);
    console.log('Current complete conversation list:', payload.items);
    console.log('Changes in this update:', payload.patch);
  },
});
```

When the page is destroyed or monitoring is no longer needed, call `client.removeEventHandler` to remove the handler:

```typescript
client.removeEventHandler('conversation-listener');
```

## API best practices

| Scenario | Description | Recommendation |
| :--- | :--- | :--- |
| Conversation list updates | `getConversationList` reads existing non-empty conversations locally without a network request. Messages, synchronization, pinning, tagging, deletion, and unread-count clearing may update the local list and trigger `onConversationListUpdate`. | 1. After login, automatically synchronize or call `refreshSessionList` to update the cache.<br/>2. Monitor `onConversationListUpdate` and use `items` to refresh the UI.<br/>3. Call `getConversationList` to explicitly read current local non-empty conversations. |
| Conversation display information | `ConversationItem` provides basic display fields such as `conversationName`, `conversationAvatar`, `lastMessage`, and `unreadCount`, but not complete user attributes or group details. | 1. Prefer the display fields in `ConversationItem` when rendering.<br/>2. Retrieve complete information through the [user attribute API](userprofile.html#retrieve-all-user-attributes-from-the-server) or [chat group details API](group_attributes.html#retrieve-chat-group-details) as needed. |

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`refreshSessionList`](#retrieve-the-conversation-list-from-the-server) | `ChatManager` | Retrieve the latest list from the server and update the local cache. |
| [`getConversationList`](#retrieve-the-local-conversation-list) | `ChatManager` | Read the local list and filter by pin state or tag. |
