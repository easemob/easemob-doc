# Create and Manage Chat Rooms

## Feature overview

A chat room is an instant messaging use case that supports real-time interaction among a large number of users. It is commonly used for live streaming interactions, message broadcasting, open discussions, and other scenarios. Chat room members do not have fixed relationships and generally do not continue receiving chat room messages after going offline. Except for members on the chat room allowlist, regular members automatically leave the chat room after being offline for approximately 2 minutes. To adjust the automatic exit period, contact your EasyIM business manager.

The following table describes chat room member roles:

| Member role | Description | Management permissions |
| :--- | :--- | :--- |
| Regular member | A user who participates in interactions after joining the chat room. | Can send and receive chat room messages, retrieve chat room details and the member list, and perform other operations. |
| Chat room admin | Appointed by the chat room owner to help manage the chat room. | Can remove members, manage the mute list, allowlist, blocklist, and chat room announcement, and perform other management operations. |
| Chat room owner | The chat room creator or a user to whom ownership is transferred. | Has the highest management permissions in the chat room and can destroy the chat room, add or remove admins, modify chat room information, and perform other management operations. |

This document describes how to create, destroy, join, leave, and manage chat rooms and monitor chat room events. For information about sending, receiving, and managing chat room messages, see [Message management](message_overview.html).

:::tip
The combined number of the chat room owner and admins cannot exceed 100, meaning that up to 99 admins can be added.
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have initialized the SDK. For details, see [Quickstart](quickstart.html).
- You registered `ChatRoomManager` during SDK initialization.
- You understand the EasyIM API call frequency limits. For details, see [Limitations](/product/limitation.html).
- You understand the limits on the number of chat rooms, number of chat room members, and plan capabilities. For details, see [EasyIM plan features](/product/product_package_feature.html).
- Only a [superadmin](/document/server-side/chatroom_superadmin_add.html) can create chat rooms.

## Create a chat room

To create a chat room, call the server-side REST API for [creating a chat room](/document/server-side/chatroom_create.html). After the chat room is created, the client can [join it](#join-a-chat-room) or [retrieve its details](#).

## Destroy a chat room

To destroy a chat room, call the server-side REST API for [destroying a chat room](/document/server-side/chatroom_delete.html). After the chat room is destroyed, the other online members receive the `onChatRoomDestroyed` event and are removed from the chat room.

## Join a chat room

1. Call the `getChatRoomList` method to retrieve the chat room list from the server and find the ID of the chat room you want to join. For details, see [Retrieve the chat room list](#retrieve-the-chat-room-list).
2. Call the `joinChatRoom` method to join the specified chat room. Members in the chat room receive the `onMembersJoined` event.
  - You can pass extension information in `ext` when joining. Chat room members can obtain this extension information from the event.
  - You can specify whether to leave all other chat rooms when joining.

```typescript
await client.chatRoomManager.joinChatRoom({
  chatRoomId: 'chatroomId',
  // Extension information
  ext: JSON.stringify({ source: 'live-page' }),
  // Whether to leave other chat rooms
  leaveOtherRooms: false,
});
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `chatRoomId` | String | Yes | Chat room ID. |
| `ext` | String | No | Extension information passed to the server when joining the chat room. |
| `leaveOtherRooms` | Boolean | No | Whether to leave other chat rooms joined by the current account. If this parameter is not passed, the server's default policy applies. |

## Leave a chat room

### Leave voluntarily

The current user can call `leaveChatRoom` to voluntarily leave a chat room. After leaving, the user no longer receives messages from that chat room. The other online chat room members receive the `onMembersExited` event.

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').leaveChatRoom();
```

### Remove members

The chat room owner and admins can call `removeMembers` to remove one or more members from a chat room. After members are removed, they receive the `onRemovedFromChatRoom` event, while the other chat room members receive the `onMembersExited` event.

A removed user can rejoin the chat room if the user is not on the chat room blocklist.

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').removeMembers({
  userIds: ['user1', 'user2'],
});

console.log(result.succeeded);
console.log(result.failed);
```

### Leave after going offline

A regular chat room member automatically leaves the chat room after being offline for approximately 2 minutes because of network issues or an extended period of inactivity. To adjust this period, contact your EasyIM business manager.

The following members generally do not leave a chat room automatically after going offline:

- Members on the chat room allowlist. The chat room owner and admins are on the allowlist by default.
- Users who were added when the chat room was [created through the server-side REST API](/document/server-side/chatroom_create.html) and have never logged in.

If multi-device login for chat rooms is enabled, a member on the allowlist may no longer receive messages from a chat room on a device after that device reconnects from an offline state. To resume receiving chat room messages on that device, call `joinChatRoom` to rejoin the chat room after logging in again.

## Retrieve the chat room list

You can call the `getChatRoomList` method to retrieve the chat room list from the server by page. The result contains chat room summaries for the current page, pagination information, and the total returned by the server.

```typescript
const result = await client.chatRoomManager.getChatRoomList({
  pageNum: 1,
  pageSize: 20,
});

console.log(result.items);
console.log(result.pageNum);
console.log(result.pageSize);
console.log(result.total);
console.log(result.hasMore);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `pageNum` | Number | No | Current page number, starting from 1. |
| `pageSize` | Number | No | Number of chat rooms returned per page. The value range is [1,1000], and the default is `20`. |

In the result, `items` is the list of chat room summaries on the current page. Each chat room summary contains the following main fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `chatRoomId` | String | Chat room ID. |
| `name` | String | Chat room name. |
| `owner` | UserInfo | Information about the chat room owner. The SDK attempts to populate this field from the cache or the [user attribute API](userprofile.html). |
| `memberCount` | Number | Current number of members. |
| `disabled` | Boolean | Whether the chat room is disabled. |

## Update the chat room member count in real time

If members frequently join or leave a chat room within a short period, update the chat room member count in real time as follows:

1. When a member joins the chat room, the other members receive the `onMembersJoined` event. When a member leaves voluntarily or is removed, the other members receive the `onMembersExited` event.

```typescript
let memberCount = 0;

client.chatRoomManager.addEventHandler('chatroom-member-count', {
  onMembersJoined: event => {
    memberCount += event.members.length;
    console.log('成员加入:', event.members, '当前本地成员数:', memberCount);
  },
  onMembersExited: event => {
    memberCount = Math.max(0, memberCount - event.members.length);
    console.log('成员退出:', event.members, '当前本地成员数:', memberCount);
  },
});
```

2. After receiving a member change event, call `getInfo` or `getChatRoomInfo` to [retrieve the chat room details](room_attributes.html#retrieve-chat-room-details) again, and obtain the current member count from the `memberCount` parameter.

## Common operations on a single chat room

After obtaining a `ChatRoom` object, you can also call the following methods to manage a single chat room:

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');
```

| Feature | Method | Description |
| :--- | :--- | :--- |
| Leave a chat room | `chatRoom.leaveChatRoom()` | The current user voluntarily leaves the chat room. |
| Remove members | `chatRoom.removeMembers({ userIds })` | Removes specified members from the current chat room. |
| Retrieve the admin list | `chatRoom.getAdminList()` | Retrieves the admin list of the current chat room. |
| Add an admin | `chatRoom.addAdmin({ userId })` | Appoints a specified member as a chat room admin. |
| Remove an admin | `chatRoom.removeAdmin({ userId })` | Revokes the admin permissions of a specified member. |
| Retrieve the mute list | `chatRoom.getMuteList({ pageNum, pageSize })` | Retrieves the mute list of the current chat room by page. |
| Mute members | `chatRoom.muteMembers({ userIds, duration })` | Adds specified members to the mute list. The unit of `duration` is seconds. |
| Unmute members | `chatRoom.unmuteMembers({ userIds })` | Removes specified members from the mute list. |
| Mute all members | `chatRoom.muteAllMembers()` | Mutes all members in the current chat room. |
| Unmute all members | `chatRoom.unmuteAllMembers()` | Unmutes all members in the current chat room. |
| Check whether the current user is muted | `chatRoom.checkIfInMuteList()` | Checks whether the current user is on the mute list of the current chat room. |
| Retrieve the blocklist | `chatRoom.getBlocklist({ pageNum, pageSize })` | Retrieves the blocklist of the current chat room by page. |
| Add members to the blocklist | `chatRoom.blockMembers({ userIds })` | Adds specified members to the chat room blocklist. |
| Remove members from the blocklist | `chatRoom.unblockMembers({ userIds })` | Removes specified members from the chat room blocklist. |
| Retrieve the allowlist | `chatRoom.getAllowlist()` | Retrieves the allowlist of the current chat room. |
| Add members to the allowlist | `chatRoom.addUsersToAllowlist({ userIds })` | Adds specified members to the chat room allowlist. |
| Remove members from the allowlist | `chatRoom.removeUsersFromAllowlist({ userIds })` | Removes specified members from the chat room allowlist. |
| Check whether the current user is on the allowlist | `chatRoom.checkIfInAllowList()` | Checks whether the current user is on the allowlist of the current chat room. |
| Retrieve the announcement | `chatRoom.getAnnouncement()` | Retrieves the announcement of the current chat room. |
| Update the announcement | `chatRoom.updateAnnouncement({ announcement })` | Updates the announcement of the current chat room. |

Example code:

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

await chatRoom.muteMembers({
  userIds: ['user1'],
  duration: 3600,
});

await chatRoom.updateAnnouncement({
  announcement: 'Welcome to the chat room.',
});

const allowlist = await chatRoom.getAllowlist();
console.log(allowlist);
```

## Monitor chat room events

You can call the `addEventHandler` method to register a chat room event listener and refresh chat room details, the member list, or the relevant UI in event callbacks.

```typescript
client.chatRoomManager.addEventHandler('chatroom-events', {
  // The chat room is destroyed. All chat room members receive this event. 
  onChatRoomDestroyed: event => { 
    console.log('聊天室被解散:', event.chatRoomId, event.chatRoomName);
  },

  // A user joins the chat room. All chat room members except the new member receive this event.
  onMembersJoined: event => {  
    console.log('成员加入聊天室:', event.chatRoomId, event.members, event.ext);
  },

  // A member leaves voluntarily or is removed. All chat room members except the member who leaves receive this event.
  onMembersExited: event => {
    console.log('成员退出聊天室:', event.chatRoomId, event.members);
  },

  // A member is removed from the chat room. The removed member receives this event.
  onRemovedFromChatRoom: event => {
    console.log('当前用户被移出聊天室:', event.chatRoomId, event.reason, event.participant);
  },

  // A member is added to the mute list. The added member receives this event.
  onMuteListAdded: event => {
    console.log('聊天室禁言列表新增成员:', event.chatRoomId, event.mutes, event.muteExpire);
  },

  // A member is removed from the mute list. The unmuted member receives this event.
  onMuteListRemoved: event => {
    console.log('聊天室禁言列表移除成员:', event.chatRoomId, event.mutes);
  },

  // A member is added to the allowlist. The added member receives this event.
  onAllowListAdded: event => {
    console.log('聊天室白名单新增成员:', event.chatRoomId, event.allowlist);
  },

  // A member is removed from the allowlist. The removed member receives this event.
  onAllowListRemoved: event => {
    console.log('聊天室白名单移除成员:', event.chatRoomId, event.allowlist);
  },

  // The state for muting all members changes. All chat room members receive this event.
  onAllMemberMuteStateChanged: event => {
    console.log('聊天室全员禁言状态变更:', event.chatRoomId, event.isMuted);
  },

  // A member is appointed as an admin. The new admin receives this event.
  onAdminAdded: event => {
    console.log('聊天室新增管理员:', event.chatRoomId, event.admin);
  },

  // A member's admin permissions are revoked. The removed admin receives this event.
  onAdminRemoved: event => {
    console.log('聊天室移除管理员:', event.chatRoomId, event.admin);
  },

  // The chat room owner changes. All chat room members receive this event.
  onOwnerChanged: event => {
    console.log('聊天室所有者变更:', event.chatRoomId, event.oldOwner, event.newOwner);
  },

  // The chat room announcement changes. All chat room members receive this event.
  onAnnouncementChanged: event => {
    console.log('聊天室公告变更:', event.chatRoomId, event.announcement);
  },

  // The chat room details change. All chat room members receive this event.
  onChatRoomInfoChanged: event => {
    console.log('聊天室信息变更:', event.chatRoomId, event.chatRoomInfo);
  },

  // Chat room custom attributes are updated. All chat room members receive this event.
  onAttributesUpdate: event => {
    console.log('聊天室属性更新:', event.chatRoomId, event.attributes, event.from);
  },

  // Chat room custom attributes are removed. All chat room members receive this event.
  onAttributesRemoved: event => {
    console.log('聊天室属性删除:', event.chatRoomId, event.keyList, event.from);
  },
});
```

To remove the listener, call `removeEventHandler`:

```typescript
client.chatRoomManager.removeEventHandler('chatroom-events');
```

## API list

The SDK provides the following capabilities through `ChatRoomManager` and a `ChatRoom` object for a single chat room:

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [Create a chat room on the server](#create-a-chat-room) | Server-side REST API | Create a chat room. |
| [Destroy a chat room](#destroy-a-chat-room) | Server-side REST API | Destroy a chat room. |
| [`getChatRoomList`](#retrieve-the-chat-room-list) | `ChatRoomManager` | Retrieve the public chat room list by page. |
| [`joinChatRoom`](#join-a-chat-room) | `ChatRoomManager` | Join the specified chat room. |
| [`getChatRoom`](#leave-a-chat-room) | `ChatRoomManager` | Obtain a `ChatRoom` object bound to the specified chat room ID. |
| [`leaveChatRoom`](#leave-a-chat-room) | `ChatRoom` | Leave the current chat room. |
