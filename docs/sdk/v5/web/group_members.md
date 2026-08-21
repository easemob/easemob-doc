# Manage Chat Group Members

## Feature overview

Chat groups are an instant messaging use case that supports real-time multi-user communication. This document describes how to use the SDK to manage chat group members, including joining, inviting, leaving, removing members, retrieving the member list, managing member attributes, managing the group owner and admins, managing the allowlist and blocklist, and muting members.

## API usage

The SDK provides the `GroupManager` manager and a `Group` object for managing chat group members:

- `client.groupManager` is suitable for handling join requests and group invitations, as well as managing group members directly by `groupId`.
- `client.groupManager.getGroup(groupId)` retrieves a `Group` object bound to the specified chat group. Use it to perform a series of operations on a page where the group ID is known, such as retrieving the member list, leaving the group, removing members, managing admins, muting members, managing the allowlist and blocklist, and managing member attributes.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- You have completed [SDK initialization](initialization.html) and [logged in](login.html).
- You registered `GroupManager` during SDK initialization and can call chat group APIs through `client.groupManager`.
- The current logged-in user has the chat group role or permissions required for the target operation. For example, the group owner can transfer ownership and add or remove admins. The group owner and admins can generally remove members and manage the allowlist, blocklist, and mute list.
- You understand the service limits on the number of groups and group members, API call frequency, and group member attribute size. For details, see [Limitations](/product/limitation.html).

## Retrieve the group member list

First, call `getGroup` to retrieve a chat group object, and then call `getMembers` to retrieve the group member list by page. The result contains members' user information, roles, and the times when they joined the group.

```typescript
const group = client.groupManager.getGroup('groupId');

const result = await group.getMembers({
  // Pagination cursor. For the first request, omit this parameter or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. An empty `cursor` in the result indicates that the last page has been reached.
  cursor: '',
  // Expected number of group members returned per page. The maximum depends on the server. For details, see https://doc.easemob.com/document/server-side/group_member_list_obtain.html#请求-url.
  pageSize: 50,
});

console.log(result.items);
console.log(result.cursor);
console.log(result.hasMore);
```

In the result, `items` is the group member list on the current page. Each item in `items` is a `GroupMemberEntry` object that contains the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `user` | UserInfo | User profile of the member. This field contains at least `userId`. Other profile fields depend on the local cache or server response. |
| `role` | String | Role of the member in the chat group. Valid values are `owner`, `admin`, and `member`. This field may be empty. |
| `joinedAt` | Number | Timestamp when the member joined the chat group. This field is not returned if the server does not return the join time. |

The fields in `UserInfo` are described as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | String | User ID. |
| `nickname` | String | Nickname. This field may be empty. |
| `avatarUrl` | String | Avatar URL. This field may be empty. |
| `mail` | String | Email address. This field may be empty. |
| `phone` | String | Phone number. This field may be empty. |
| `gender` | String/Number/Boolean | Gender or a custom gender identifier. This field may be empty. |
| `sign` | String | Signature. This field may be empty. |
| `birth` | String | Date of birth. This field may be empty. |
| `ext` | String | Extension field. This field may be empty. |

## Manage custom group member attributes

Group member attributes are custom member information specific to a chat group. They are commonly used for group member name cards, in-group role display, department information, or business tags. Attributes use a key-value structure, where both keys and values are strings.

- The total length of the custom attributes for a group member cannot exceed 4 KB.
- For each custom attribute, `key` cannot exceed 16 bytes and `value` cannot exceed 512 bytes. Otherwise, an error occurs.
- The group owner can modify the custom attributes of all group members. Other group members can modify only their own custom attributes.

### Set custom group member attributes

Call `setMemberAttributes` to set the attributes of the specified member in the current chat group. Custom attributes use a key-value structure. Setting an attribute's value to an empty string deletes that attribute.

- The group owner can modify the attributes of all group members. Regular members can generally modify only their own attributes.
- When the current user updates only their own group member name card attribute, the SDK uses the group member name card API and synchronizes the local group member name card cache.

After the attributes are set, other members in the chat group receive the `onGroupMemberAttributeChanged` event. The member's other devices receive the `onMultiDeviceGroup` event, where `operation` is `GROUP_MEMBER_METADATA_CHANGED`.

```typescript
await client.groupManager.getGroup('groupId').setMemberAttributes({
  userId: 'user1',
  memberAttributes: {
    groupNamecard: 'Alice',
    roleTag: 'speaker',
  },
});
```

### Retrieve custom group member attributes

Call `getMembersAttributes` to retrieve group member attributes for specified members in a batch. If `keys` is omitted, all attributes of these members are returned. If `keys` is specified, only the specified attributes are returned.

:::tip
You can retrieve the custom attributes of up to 10 group members at a time.
:::

```typescript
const result = await client.groupManager.getGroup('group-1').getMembersAttributes({
  // You can pass up to 10 user IDs at a time.
  userIds: ['user-1', 'user-2', 'user-3'],
  keys: ['department', 'roleTag'],
});

console.log(result.items);

// For example, retrieve the attributes of a member.
const user1Attrs = result.items['user-1'];
console.log('user-1 的部门:', user1Attrs?.department);
console.log('user-1 的角色标签:', user1Attrs?.roleTag);
```

The result is a collection of member attributes indexed by user ID:

```typescript
{
  items: {
    user1: {
      department: 'product team',
      roleTag: 'speaker',
    },
  },
}
```

## Manage the group owner and admins

### Transfer chat group ownership

Only the group owner can call `changeOwner` to transfer chat group ownership to a specified group member. After the transfer, the former group owner becomes a regular member, the new group owner obtains owner permissions, and group members receive the `onOwnerChanged` event.

```typescript
await client.groupManager.getGroup('groupId').changeOwner({
  newOwner: 'user1',
});
```

### Add a group admin

Only the group owner can call `addAdmin` to add a group admin. After the admin is added, the new admin and other admins receive the `onAdminAdded` event.

A group admin has most chat group management permissions, except for a few operations such as destroying the group.

```typescript
await client.groupManager.getGroup('groupId').addAdmin({
  userId: 'user1',
});
```

### Remove a group admin

Only the group owner can call `removeAdmin` to remove a group admin. After the admin is removed, the removed admin and other admins receive the `onAdminRemoved` event.

After being removed from the group admin list, the admin retains only regular group member permissions.

```typescript
await client.groupManager.getGroup('groupId').removeAdmin({
  userId: 'user1',
});
```

### Retrieve the group admin list

All group members can call `getAdmins` to retrieve the admin list of the current chat group.

```typescript
const admins = await client.groupManager.getGroup('groupId').getAdmins();
console.log(admins);
```

You can also retrieve admin information by [retrieving chat group details](group_attributes.html#retrieve-chat-group-details).

## Manage the group allowlist

The group allowlist specifies the members who can still speak when all members are muted. The group owner and admins are on the allowlist by default.

:::tip
Muting all members and muting individual members are independent. When all members are muted, allowlisted members can still send group messages. However, if an allowlisted member is also individually muted, the individual mute takes precedence and the member cannot send group messages.
:::

### Add members to the allowlist

Only the group owner or an admin can call `addUsersToAllowlist` to add specified members to the group allowlist. After the members are added, they receive the `onAllowListAdded` event. The group owner and admins also receive the event, except for the operator.

Members on the allowlist can still send group messages even when all members are muted. However, a member who is also on the mute list cannot send group messages.

```typescript
await client.groupManager.getGroup('groupId').addUsersToAllowlist({
  userIds: ['user1'],
});
```

### Remove members from the allowlist

The group owner or an admin can call `removeUsersFromAllowlist` to remove specified members from the group allowlist. After the members are removed, they receive the `onAllowListRemoved` event. The group owner and admins also receive the event, except for the operator.

```typescript
await client.groupManager.getGroup('groupId').removeUsersFromAllowlist({
  userIds: ['user1'],
});
```

### Check whether the current user is on the allowlist

Call `checkIfInAllowList` to check whether the current logged-in user is on the group allowlist.

```typescript
const inAllowlist = await client.groupManager.getGroup('groupId').checkIfInAllowList();
console.log(inAllowlist);
```

### Retrieve the allowlist

The group owner or an admin can call `getAllowlist` to retrieve the group allowlist.

```typescript
const allowlist = await client.groupManager.getGroup('groupId').getAllowlist();
console.log(allowlist);
```

## Manage the group blocklist

The group blocklist prevents specified users from joining or remaining in the chat group. After members are added to the blocklist, they are removed from the chat group and can no longer send or receive group messages. They can apply or be invited to join again only after being removed from the blocklist.

### Add members to the blocklist

The group owner or an admin can call `blockMembers` to add specified members to the group blocklist.

- After being added to the blocklist, the member receives the `onUserRemoved` event.
- By default, other group members do not receive this event. To enable this event notification, contact the EasyIM business manager.
- Members added to the blocklist are removed from the chat group and can no longer send or receive group messages. They can apply or be invited to join again only after being removed from the blocklist.

```typescript
await client.groupManager.getGroup('groupId').blockMembers({
  userIds: ['user1'],
});
```

### Remove members from the blocklist

The group owner or an admin can call `unblockMembers` to remove specified users from the group blocklist. After being removed from the blocklist, these users can apply to join the chat group again.

```typescript
await client.groupManager.getGroup('groupId').unblockMembers({
  userIds: ['user1'],
});
```

### Retrieve the blocklist

The group owner or an admin can call `getBlocklist` to retrieve the group blocklist by page.

```typescript
const blocklist = await client.groupManager.getGroup('groupId').getBlocklist({
  // Current page, starting from 1.
  pageNum: 1,
  // Number of blocklisted users retrieved per page. The value range is [1,50] and the default value is 20.
  pageSize: 20,
});

console.log(blocklist);
```

## Manage chat group muting

The group owner and admins can mute individual group members or all members.

These two mute methods are independent and do not affect each other:
- Mute individual members: Add specified users to the mute list.
- Mute all members: Mute all chat group members at once. Allowlisted members can speak. If a member is also individually muted, the individual mute takes precedence and the member cannot speak.
- Enabling or disabling the mute-all setting does not affect the mute list for individual members.

### Mute specified members

The group owner or an admin can call `muteMembers` to add one or more members to the group mute list. After the members are added to the mute list, they receive the `onMuteListAdded` event. Group admins and the group owner also receive the event, except for the operator.

After group members are added to the mute list, they cannot speak. Even if a muted member is on the group allowlist, they still cannot speak.

```typescript
await client.groupManager.getGroup('groupId').muteMembers({
  // List of user IDs to mute.
  userIds: ['user1'],
  // Mute duration in seconds. Pass -1 to mute permanently.
  muteDuration: 3600,
});
```

### Unmute specified members

The group owner or an admin can call `unmuteMembers` to remove one or more members from the group mute list. After the members are unmuted, they receive the `onMuteListRemoved` event. Group admins and the group owner also receive the event, except for the operator.

```typescript
await client.groupManager.getGroup('groupId').unmuteMembers({
  userIds: ['user1'],
});
```

### Check whether the current user is muted

Group members can call `checkIfInMuteList` to check whether the current logged-in user is on the group mute list.

```typescript
const muted = await client.groupManager.getGroup('groupId').checkIfInMuteList();
if (muted) {
  console.log('当前用户已被该群禁言');
} else {
  console.log('当前用户未被该群禁言');
}
```

### Retrieve the mute list

The group owner or an admin can call `getMuteList` to retrieve the group mute list by page.

```typescript
const muteList = await client.groupManager.getGroup('groupId').getMuteList({
  // Current page number, starting from 1.
  pageNum: 1,
  // Number of muted members returned per page.
  pageSize: 20,
});

console.log(muteList);
```

### Mute all members

The group owner or an admin can call `muteAllMembers` to mute all members. The mute-all setting does not expire automatically. To disable it, you must call the API that disables mute all.

After the mute-all setting is enabled, group members receive the `onAllMemberMuteStateChanged` event. Members other than allowlisted members cannot send group messages.

```typescript
await client.groupManager.getGroup('groupId').muteAllMembers();
```

### Unmute all members

The group owner or an admin can call `unmuteAllMembers` to unmute all members. After the mute-all setting is disabled, group members receive the `onAllMemberMuteStateChanged` event.

```typescript
await client.groupManager.getGroup('groupId').unmuteAllMembers();
```

## Monitor chat group member events

After an operation related to group members succeeds, the SDK triggers the corresponding chat group event. For details, see [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## Considerations

- `groupId`, `userId`, and `userIds` cannot be empty. The SDK throws a parameter error if a parameter is invalid.
- For batch member operations, `userIds` cannot be an empty array. The SDK normalizes duplicate user IDs.
- `getMembers` uses cursor-based pagination. `getMuteList` and `getBlocklist` use page-number-based pagination.
- The mute duration parameter of `muteMembers` and `unmuteMembers` is `muteDuration`, in seconds.
- `checkIfInAllowList` and `checkIfInMuteList` check the current logged-in user's own status. You cannot pass another user ID.
- `setMemberAttributes` uses `memberAttributes`, which is commonly used to set a group member name card.
- The group member attribute parameter is `memberAttributes`. Both keys and values must be strings.
- Operations involving admins, the allowlist, blocklist, and muting require the current user to have group owner or group admin permissions. The SDK throws an error if the user lacks permission or authentication fails.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`inviteUsersToGroup`](group_manage.html#invite-users-to-join-a-chat-group) | `GroupManager` | Invites one or more users to join a chat group. |
| [`acceptInvitation`](group_manage.html#invite-users-to-join-a-chat-group) | `GroupManager` | Accepts a chat group invitation received by the current user. |
| [`rejectInvitation`](group_manage.html#invite-users-to-join-a-chat-group) | `GroupManager` | Rejects a chat group invitation received by the current user. |
| [`joinGroup`](group_manage.html#apply-to-join-a-chat-group) | `GroupManager` | Applies to join or directly joins the specified chat group. |
| [`acceptGroupJoinRequest`](group_manage.html#apply-to-join-a-chat-group) | `GroupManager` | Allows the group owner or an admin to approve a user's join request. |
| [`rejectGroupJoinRequest`](group_manage.html#apply-to-join-a-chat-group) | `GroupManager` | Allows the group owner or an admin to reject a user's join request. |
| [`getGroup`](#retrieve-the-group-member-list) | `GroupManager` | Retrieves a `Group` object bound to the specified group ID. |
| [`getMembers`](#retrieve-the-group-member-list) | `Group` | Retrieves the group member list by page through a `Group` object. |
| [`leave`](group_manage.html#leave-voluntarily) | `Group` | Allows the current logged-in user to voluntarily leave the chat group. |
| [`removeMembers`](group_manage.html#remove-members) | `Group` | Removes one or more group members through a `Group` object. |
| [`setMemberAttributes`](#set-custom-group-member-attributes) | `Group` | Sets group member attributes through a `Group` object. |
| [`getMembersAttributes`](#retrieve-custom-group-member-attributes) | `Group` | Retrieves group member attributes for specified members in a batch through a `Group` object. |
| [`changeOwner`](#transfer-chat-group-ownership) | `Group` | Transfers chat group ownership through a `Group` object. |
| [`addAdmin`](#add-a-group-admin) | `Group` | Adds a group admin through a `Group` object. |
| [`removeAdmin`](#remove-a-group-admin) | `Group` | Removes a group admin through a `Group` object. |
| [`getAdmins`](#retrieve-the-group-admin-list) | `Group` | Retrieves the group admin list through a `Group` object. |
| [`addUsersToAllowlist`](#add-members-to-the-allowlist) | `Group` | Adds members to the allowlist through a `Group` object. |
| [`removeUsersFromAllowlist`](#remove-members-from-the-allowlist) | `Group` | Removes members from the allowlist through a `Group` object. |
| [`checkIfInAllowList`](#check-whether-the-current-user-is-on-the-allowlist) | `Group` | Checks whether the current user is on the allowlist through a `Group` object. |
| [`getAllowlist`](#retrieve-the-allowlist) | `Group` | Retrieves the group allowlist through a `Group` object. |
| [`blockMembers`](#add-members-to-the-blocklist) | `Group` | Adds members to the group blocklist through a `Group` object. |
| [`unblockMembers`](#remove-members-from-the-blocklist) | `Group` | Removes members from the group blocklist through a `Group` object. |
| [`getBlocklist`](#retrieve-the-blocklist) | `Group` | Retrieves the group blocklist through a `Group` object. |
| [`muteMembers`](#mute-specified-members) | `Group` | Mutes specified members through a `Group` object. |
| [`unmuteMembers`](#unmute-specified-members) | `Group` | Unmutes specified members through a `Group` object. |
| [`checkIfInMuteList`](#check-whether-the-current-user-is-muted) | `Group` | Checks whether the current user is muted through a `Group` object. |
| [`getMuteList`](#retrieve-the-mute-list) | `Group` | Retrieves the group mute list through a `Group` object. |
| [`muteAllMembers`](#mute-all-members) | `Group` | Mutes all members through a `Group` object. |
| [`unmuteAllMembers`](#unmute-all-members) | `Group` | Unmutes all members through a `Group` object. |
