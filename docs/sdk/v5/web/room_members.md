# Manage Chat Room Members

## Feature overview

Chat rooms are suitable for real-time multi-user scenarios such as live streaming interactions, open discussions, and message broadcasting. This document describes how to use the SDK to manage chat room members, including retrieving the member list and managing admins, the allowlist, blocklist, and mute list.

## API usage

The SDK provides the `ChatRoomManager` manager and `ChatRoom` objects for managing chat room members:

- `client.chatRoomManager` is suitable for performing chat room member operations directly by `chatRoomId`.
- `client.chatRoomManager.getChatRoom(chatRoomId)` returns a `ChatRoom` object bound to the specified chat room. It is suitable for repeatedly performing operations such as managing the member list, admins, mute list, allowlist, blocklist, and announcement on a page where the chat room ID is known.
- For operations on a single chat room, such as managing the member list, admins, mute list, allowlist, and blocklist, we recommend using a `ChatRoom` object where possible.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK and logged in successfully.
- You registered `ChatRoomManager` during SDK initialization and can call chat room APIs through `client.chatRoomManager`.
- You understand service limitations such as the number of chat rooms, number of chat room members, API call frequency, and plan capabilities. For details, see [Limitations](/product/limitation.html).

## Retrieve the chat room member list

First call `getChatRoom` to obtain an object for a single chat room, and then call `getMembers` to retrieve the chat room member list by page. The result contains member information, member roles, the time when members joined the chat room, and other information.

The server does not sort members, so the returned member list is not guaranteed to be ordered.

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

const result = await chatRoom.getMembers({
  // Pagination cursor. For the first request, omit this parameter or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` returned in the previous result. An empty `cursor` indicates that the last page has been reached.
  cursor: '',
  // Number of members retrieved per page. The value range is [1,50], and the default is 50.
  pageSize: 50,
});

console.log(result.items);
console.log(result.cursor);
console.log(result.hasMore);
```

In the result, `items` is the member list on the current page; `cursor` is the cursor for the next page and may be empty if the server does not return a cursor; and `hasMore` indicates whether there is another page and may be empty if the server does not return it.

Each item in `items` is a `ChatRoomMemberEntry` with the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | Object | Member information. This field contains at least `userId`; other information depends on the local cache or server response. |
| `role` | String | Role of the member in the chat room. Possible values are `owner`, `admin`, and `member`. This field may be empty if the server does not return it. |
| `joinedAt` | Number | Timestamp when the member joined the chat room. This field may be empty if the server does not return it. |

## Manage the chat room owner and admins

### Transfer chat room ownership

The current SDK does not provide a client API for transferring chat room ownership. To change the chat room owner, call the [server-side API](/rest/chatroom_owner_transfer.html).

### Add a chat room admin

Only the chat room owner can call `addAdmin` to add a chat room admin. After the admin is added successfully, the new admin and the other admins receive the `onAdminAdded` event.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').addAdmin({
  userId: 'user1',
});
```

### Remove a chat room admin

Only the chat room owner can call `removeAdmin` to remove a chat room admin. After the admin is removed successfully, the removed admin and the other admins receive the `onAdminRemoved` event.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').removeAdmin({
  userId: 'user1',
});
```

### Retrieve the chat room admin list

The chat room owner and admins can call `getAdminList` to retrieve the chat room admin list.

```typescript
const admins = await client.chatRoomManager.getChatRoom('chatroomId').getAdminList();
console.log(admins);
```

## Manage the chat room allowlist

Members on the chat room allowlist can still send messages when all members are muted. The chat room owner and admins are on the allowlist by default.

Messages sent by members on the allowlist have a higher delivery priority, but delivery is not guaranteed. Under high system load, the server may discard low-priority messages first. If the load continues to increase, the server may also discard high-priority messages.

### Add members to the allowlist

The chat room owner or an admin can call `addUsersToAllowlist` to add specified members to the chat room allowlist. After a member is added successfully, the member receives the `onAllowListAdded` event. The chat room owner and admins also receive it, except for the operator.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').addUsersToAllowlist({
  userIds: ['user1'],
});

console.log(result);
```

### Remove members from the allowlist

The chat room owner or an admin can call `removeUsersFromAllowlist` to remove specified members from the chat room allowlist. After a member is removed successfully, the member receives the `onAllowListRemoved` event. The chat room owner and admins also receive it, except for the operator.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').removeUsersFromAllowlist({
  userIds: ['user1'],
});
```

### Check whether the current user is on the chat room allowlist

Call `checkIfInAllowList` to check whether the current user is on the chat room allowlist.

```typescript
const inAllowlist = await client.chatRoomManager.getChatRoom('chatroomId').checkIfInAllowList();
console.log(inAllowlist);
```

### Retrieve the chat room allowlist

The chat room owner or an admin can call `getAllowlist` to retrieve the chat room allowlist.

```typescript
const allowlist = await client.chatRoomManager.getChatRoom('chatroomId').getAllowlist();
console.log(allowlist);
```

## Manage the chat room blocklist

The chat room blocklist prevents specified users from joining or remaining in the chat room. After a member is added to the blocklist, the member is removed from the chat room and can no longer send or receive chat room messages. The member can rejoin only after being removed from the blocklist.

### Add members to the blocklist

The chat room owner or an admin can call `blockMembers` to add specified members to the chat room blocklist. After being added to the blocklist, a member receives the `onMembersExited` callback event.

- A member added to the blocklist is removed from the chat room and can no longer send or receive chat room messages.
- By default, the other chat room members do not receive this event notification. To enable this type of event notification, contact the EasyIM business manager.
- Before a member on the blocklist can rejoin the chat room, the chat room owner or an admin must remove the member from the blocklist.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').blockMembers({
  userIds: ['user1'],
});

console.log(result);
```

### Remove members from the blocklist

The chat room owner or an admin can call `unblockMembers` to remove specified members from the chat room blocklist. After being removed from the blocklist, a user can rejoin the chat room.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unblockMembers({
  userIds: ['user1'],
});
```

### Retrieve the chat room blocklist

The chat room owner or an admin can call `getBlocklist` to retrieve the chat room blocklist by page.

```typescript
const blocklist = await client.chatRoomManager.getChatRoom('chatroomId').getBlocklist({
  // Current page number, starting from 1.
  pageNum: 1,
  // Number of users on the blocklist retrieved per page. The value range is [1,50], and the default is 20.
  pageSize: 20,
});

console.log(blocklist);
```

## Manage chat room muting

The chat room owner and admins can mute specified members individually or mute all members.

These two muting methods are independent and do not affect each other:

- Muting individual members adds specified users to the mute list.
- Muting all members mutes all regular chat room members at once. Members on the allowlist can still send messages when all members are muted.
- Muting or unmuting all members does not affect the mute list for individual members.

### Mute specified members

The chat room owner or an admin can call `muteMembers` to add one or more members to the chat room mute list. After the members are added to the mute list, the muted members receive the `onMuteListAdded` event. The chat room owner and admins also receive it, except for the operator.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').muteMembers({
  userIds: ['user1'],
  // Mute duration, in seconds. Pass -1 to mute permanently.
  duration: 3600,
});
```

### Unmute specified members

The chat room owner or an admin can call `unmuteMembers` to remove one or more members from the chat room mute list. After the members are unmuted, the unmuted members receive the `onMuteListRemoved` event. The chat room owner and admins also receive it, except for the operator.

:::tip
The chat room owner can unmute any member, while chat room admins can generally unmute only regular members.
:::

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unmuteMembers({
  userIds: ['user1'],
});
```

### Check whether the current user is muted

Chat room members can call `checkIfInMuteList` to check whether the current user is on the chat room mute list.

```typescript
const status = await client.chatRoomManager.getChatRoom('chatroomId').checkIfInMuteList();

console.log(status.muted);
console.log(status.muteExpireAt);
```

### Retrieve the chat room mute list

The chat room owner or an admin can call `getMuteList` to retrieve the chat room mute list by page.

```typescript
const muteList = await client.chatRoomManager.getChatRoom('chatroomId').getMuteList({
  // Current page number, starting from 1.
  pageNum: 1,
  // Number of muted members returned per page.
  pageSize: 20,
});

console.log(muteList);
```

### Mute all members

The chat room owner or an admin can call `muteAllMembers` to mute all members. This setting does not expire automatically. To unmute all members, you must call `unmuteAllMembers`.

After all members are muted, chat room members receive the `onAllMemberMuteStateChanged` event. Only members on the allowlist can send chat room messages.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').muteAllMembers();
```

### Unmute all members

The chat room owner or an admin can call `unmuteAllMembers` to disable the mute-all setting. After the operation succeeds, chat room members receive the `onAllMemberMuteStateChanged` event.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unmuteAllMembers();
```

## Monitor chat room member events

After a chat room member operation succeeds, the SDK triggers the corresponding chat room event. You can call `addEventHandler` to register a chat room event listener.

```typescript
client.chatRoomManager.addEventHandler('chatroom-member-events', {
  // A member is appointed as an admin. The new admin receives this event.
  onAdminAdded: event => {
    console.log('Chat room admin added:', event.chatRoomId, event.admin);
  },
  // A member's admin permissions are revoked. The removed admin receives this event.
  onAdminRemoved: event => {
    console.log('Chat room admin removed:', event.chatRoomId, event.admin);
  },
  // A member is added to the mute list. The added member receives this event.
  onMuteListAdded: event => {
    console.log('Members added to the chat room mute list:', event.chatRoomId, event.mutes, event.muteExpire);
  },
  // A member is removed from the mute list. The unmuted member receives this event.
  onMuteListRemoved: event => {
    console.log('Members removed from the chat room mute list:', event.chatRoomId, event.mutes);
  },
  // A member is added to the allowlist. The added member receives this event.
  onAllowListAdded: event => {
    console.log('Members added to the chat room allowlist:', event.chatRoomId, event.allowlist);
  },
  // A member is removed from the allowlist. The removed member receives this event.
  onAllowListRemoved: event => {
    console.log('Members removed from the chat room allowlist:', event.chatRoomId, event.allowlist);
  },
  // The state for muting all members changes. All chat room members receive this event.
  onAllMemberMuteStateChanged: event => {
    console.log('Chat room mute-all status changed:', event.chatRoomId, event.isMuted);
  },
});
```

To remove the listener, call `removeEventHandler`:

```typescript
client.chatRoomManager.removeEventHandler('chatroom-member-events');
```

## Considerations

- The `chatRoomId`, `userId`, and `userIds` values in this document cannot be empty. The SDK throws a parameter error if a parameter is invalid.
- `userIds` is used for bulk member operations and cannot be an empty array. The SDK filters out empty strings and normalizes duplicate user IDs.
- `getMembers` uses cursor-based pagination, while `getMuteList` and `getBlocklist` use page-based pagination.
- The mute duration parameter of `muteMembers` is `duration`, in seconds.
- `checkIfInAllowList` and `checkIfInMuteList` query the current user's own status and do not support passing another user ID.
- Operations involving admins, the allowlist, blocklist, and mute list require the current user to have chat room owner or admin permissions. The SDK throws an error if the user does not have permission or authentication fails.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getChatRoom`](#retrieve-the-chat-room-member-list) | `ChatRoomManager` | Obtain a `ChatRoom` object bound to the specified chat room ID. |
| [`getMembers`](#retrieve-the-chat-room-member-list) | `ChatRoom` | Retrieve the chat room member list by page through a `ChatRoom` object. |
| [`leaveChatRoom`](room_manage.html#leave-voluntarily) | `ChatRoom` | The current user voluntarily leaves the chat room. |
| [`removeMembers`](room_manage.html#remove-members) | `ChatRoom` | Remove one or more chat room members through a `ChatRoom` object. |
| [`addAdmin`](#add-a-chat-room-admin) | `ChatRoom` | Add a chat room admin through a `ChatRoom` object. |
| [`removeAdmin`](#remove-a-chat-room-admin) | `ChatRoom` | Remove a chat room admin through a `ChatRoom` object. |
| [`getAdminList`](#retrieve-the-chat-room-admin-list) | `ChatRoom` | Retrieve the chat room admin list through a `ChatRoom` object. |
| [`addUsersToAllowlist`](#add-members-to-the-allowlist) | `ChatRoom` | Add members to the allowlist through a `ChatRoom` object. |
| [`removeUsersFromAllowlist`](#remove-members-from-the-allowlist) | `ChatRoom` | Remove members from the allowlist through a `ChatRoom` object. |
| [`checkIfInAllowList`](#check-whether-the-current-user-is-on-the-chat-room-allowlist) | `ChatRoom` | Check whether the current user is on the allowlist through a `ChatRoom` object. |
| [`getAllowlist`](#retrieve-the-chat-room-allowlist) | `ChatRoom` | Retrieve the chat room allowlist through a `ChatRoom` object. |
| [`blockMembers`](#add-members-to-the-blocklist) | `ChatRoom` | Add members to the chat room blocklist through a `ChatRoom` object. |
| [`unblockMembers`](#remove-members-from-the-blocklist) | `ChatRoom` | Remove members from the chat room blocklist through a `ChatRoom` object. |
| [`getBlocklist`](#retrieve-the-chat-room-blocklist) | `ChatRoom` | Retrieve the chat room blocklist through a `ChatRoom` object. |
| [`muteMembers`](#mute-specified-members) | `ChatRoom` | Mute specified members through a `ChatRoom` object. |
| [`unmuteMembers`](#unmute-specified-members) | `ChatRoom` | Unmute specified members through a `ChatRoom` object. |
| [`checkIfInMuteList`](#check-whether-the-current-user-is-muted) | `ChatRoom` | Check whether the current user is muted through a `ChatRoom` object. |
| [`getMuteList`](#retrieve-the-chat-room-mute-list) | `ChatRoom` | Retrieve the chat room mute list through a `ChatRoom` object. |
| [`muteAllMembers`](#mute-all-members) | `ChatRoom` | Mute all members through a `ChatRoom` object. |
| [`unmuteAllMembers`](#unmute-all-members) | `ChatRoom` | Unmute all members through a `ChatRoom` object. |
