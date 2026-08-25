# Manage Message Threads

## Feature overview

A message thread is an independent discussion space centered on a parent message in a chat group. After this feature is enabled, group members can create a thread from a specified group message and reply and manage discussion within that thread.

This document describes how to use the EasyIM Web SDK to create and manage message threads and implement message-thread features in your project.

## Feature activation

Before using message threads, contact the EasyIM business manager to enable the feature.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized and logged in to the SDK. For details, see [Quickstart](quickstart.html).
- You registered `ChatThreadManager` during SDK initialization.
- You understand the limits on message threads and their number of members. For details, see [Limitations](/product/limitation.html).
- You contacted the EasyIM business manager to enable message threads.

## Create a message thread

A group member can call `createChatThread` to create a message thread from a group message.

After creation succeeds, all members of the chat group to which the message thread belongs receive the `onChatThreadCreated` event. If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_CREATE`.

Example code:

```typescript
const result = await client.chatThreadManager.createChatThread({
  // ID of the parent chat group to which the thread belongs.
  parentId: 'group1',
  // Thread name.
  name: 'Discussion topic',
  // ID of the parent message used as the thread's root message.
  messageId: 'msg-id-123',
});

console.log('Thread ID:', result.chatThreadId);
```

## Destroy a message thread

Generally, only the owner and admins of the chat group to which a message thread belongs can call `destroyChatThread` to destroy the thread.

After destruction succeeds, all members of the chat group to which the message thread belongs receive the `onChatThreadDestroyed` event. If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_DESTROY`.

Example code:

```typescript
await client.chatThreadManager.destroyChatThread({
  // ID of the thread to destroy.
  chatThreadId: 'thread1',
});
```

## Join a message thread

A member of the chat group to which a thread belongs can call `joinChatThread` to join the message thread.

We recommend joining a message thread as follows:

1. Obtain the message thread list in the target chat group through the `onChatThreadCreated` event or by calling `getChatThreadList`.
2. Identify the ID of the thread to join.
3. Call `joinChatThread` to join the thread.

If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_JOIN`.

Example code:

```typescript
await client.chatThreadManager.joinChatThread({
  // ID of the thread to join.
  chatThreadId: 'thread1',
});
```

## Leave a message thread

### Leave voluntarily

A message thread member can call `leaveChatThread` to voluntarily leave the message thread. After leaving, the member no longer receives subsequent messages in the thread.

If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_LEAVE`.

Example code:

```typescript
await client.chatThreadManager.leaveChatThread({
  // ID of the thread to leave.
  chatThreadId: 'thread1',
});
```

### Remove a member

Generally, only the group owner and group admins can call `removeChatThreadMember` to remove a specified member from a message thread. After removal, the member no longer receives subsequent messages in the thread.

The removed user receives the `onChatThreadUserRemoved` event if they are currently logged in. If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_KICK`.

Example code:

```typescript
await client.chatThreadManager.removeChatThreadMember({
  // Target thread ID.
  chatThreadId: 'thread1',
  // User ID of the member to remove.
  memberId: 'user3',
});
```

## Change a message thread's name

Generally, only the group owner, group admins, and thread creator can call `updateChatThreadName` to change a message thread's name.

After the change succeeds, all members of the chat group to which the message thread belongs receive the `onChatThreadUpdated` event. If the current user is logged in on other devices, those devices receive the `onMultiDeviceThread` multi-device event with the event type `THREAD_UPDATE`.

Example code:

```typescript
await client.chatThreadManager.updateChatThreadName({
  // ID of the thread to change.
  chatThreadId: 'thread1',
  // New thread name.
  name: 'New topic name',
});
```

## Retrieve message thread details

A relevant thread member can call `getChatThreadInfo` to retrieve message thread details from the server.

Example code:

```typescript
const detail = await client.chatThreadManager.getChatThreadInfo({
  // Target thread ID.
  chatThreadId: 'thread1',
});

console.log('Thread details:', detail);
```

## Retrieve a message thread's member list

A member of the chat group to which a thread belongs can call `getChatThreadMemberList` to retrieve the message thread's member list from the server with pagination.

Example code:

```typescript
const result = await client.chatThreadManager.getChatThreadMemberList({
  // Target thread ID.
  chatThreadId: 'thread1',
  // Number of members returned per page. The default is 20, and the value range is 1-50.
  pageSize: 20,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates that the last page has been reached.
  cursor: '',
});

console.log('Member list:', result.items);
console.log('Next-page cursor:', result.cursor);
```

## Retrieve message thread lists

1. Call `getJoinedChatThreadList` to retrieve, from the server and with pagination, the list of message threads that the current user has joined:

```typescript
const joined = await client.chatThreadManager.getJoinedChatThreadList({
  // Optional: Parent chat group ID. If omitted, queries all threads that the current user has joined.
  parentId: 'group1',
  // Number of threads returned per page. The default is 20, and the value range is 1-50.
  pageSize: 20,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates that the last page has been reached.
  cursor: '',
});

console.log('Joined thread list:', joined.items);
console.log('Next-page cursor:', joined.cursor);
```

2. You can also call `getJoinedChatThreadList` to retrieve, from the server and with pagination, the list of message threads that the current user has joined in a specified chat group:

```typescript
const joinedInGroup = await client.chatThreadManager.getJoinedChatThreadList({
  // Specified chat group ID.
  parentId: 'group1',
  // Number of threads returned per page. The default is 20, and the value range is 1-50.
  pageSize: 20,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates that the last page has been reached.
  cursor: '',
});

console.log('Joined thread list in the specified group:', joinedInGroup.items);
console.log('Next-page cursor:', joinedInGroup.cursor);
```

3. You can also call `getChatThreadList` to retrieve the message thread list in a specified chat group from the server with pagination:

```typescript
const result = await client.chatThreadManager.getChatThreadList({
  // Parent chat group ID.
  parentId: 'group1',
  // Number of threads returned per page. The default is 20, and the value range is 1-50.
  pageSize: 20,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates that the last page has been reached.
  cursor: '',
});

console.log('Thread list in the group:', result.items);
console.log('Next-page cursor:', result.cursor);
```

## Retrieve the last messages in message threads in batches

Call `getChatThreadLastMessageList` to retrieve the last-message summaries for one or more message threads from the server in batches.

Example code:

```typescript
const result = await client.chatThreadManager.getChatThreadLastMessageList({
  // List of thread IDs to query. You can pass up to 20 IDs per call.
  chatThreadIds: ['thread1', 'thread2'],
});

console.log('Last message list:', result.items);
```

## Monitor message thread events

The SDK provides `chatThreadManager.addEventHandler` for registering a message-thread event listener. Use this listener to receive thread creation, destruction, update, and current-user-removal events.

The currently public message-thread events are:

- `onChatThreadCreated`
- `onChatThreadDestroyed`
- `onChatThreadUpdated`
- `onChatThreadUserRemoved`

To monitor message-thread operations synchronized across multiple devices, use `client.addEventHandler` to monitor `onMultiDeviceThread`.

Example code:

```typescript
// Monitor public message-thread events.
client.chatThreadManager.addEventHandler('thread-events', {
  onChatThreadCreated: (event) => {
    console.log('Thread created:', event.chatThreadId, event.chatThreadName);
  },
  onChatThreadDestroyed: (event) => {
    console.log('Thread destroyed:', event.chatThreadId);
  },
  onChatThreadUpdated: (event) => {
    console.log('Thread updated:', event.chatThreadId, event.messageCount);
  },
  onChatThreadUserRemoved: (event) => {
    console.log('Current user removed from the thread:', event.chatThreadId, event.memberId);
  },
});

// To monitor multi-device message-thread events, register the listener on ChatClient.
client.addEventHandler('thread-multi-device-events', {
  onMultiDeviceThread: (event) => {
    console.log('Multi-device thread event:', event.operation, event.threadId, event.deviceId);
  },
});
```

## API list

| API name     | Module/Class         | Description            |
| :-------------- | :----- | :------- |
| [`createChatThread`](#create-a-message-thread)                          | `ChatThreadManager` | Creates a message thread from a specified group message.                     |
| [`destroyChatThread`](#destroy-a-message-thread)                         | `ChatThreadManager` | Destroys a message thread.                                   |
| [`joinChatThread`](#join-a-message-thread)                            | `ChatThreadManager` | Joins a message thread.                                   |
| [`leaveChatThread`](#leave-a-message-thread)                           | `ChatThreadManager` | Voluntarily leaves a message thread.                               |
| [`removeChatThreadMember`](#remove-a-member)      | `ChatThreadManager` | Removes a specified member from a message thread.                         |
| [`updateChatThreadName`](#change-a-message-threads-name)                  | `ChatThreadManager` | Changes a message thread's name.                               |
| [`getChatThreadInfo`](#retrieve-message-thread-details)                     | `ChatThreadManager` | Retrieves message thread details.                               |
| [`getChatThreadMemberList`](#retrieve-a-message-threads-member-list)           | `ChatThreadManager` | Retrieves a message thread's member list with pagination.                       |
| [`getJoinedChatThreadList`](#retrieve-message-thread-lists)               | `ChatThreadManager` | Retrieves the current user's joined-message-thread list with pagination.           |
| [`getChatThreadList`](#retrieve-message-thread-lists)                     | `ChatThreadManager` | Retrieves the message thread list in a specified chat group with pagination.               |
| [`getChatThreadLastMessageList`](#retrieve-the-last-messages-in-message-threads-in-batches) | `ChatThreadManager` | Retrieves the last-message summaries for one or more message threads in batches. |
