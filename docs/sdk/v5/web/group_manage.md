# Create and Manage Chat Groups

## Feature overview

Chat groups are an instant messaging use case that supports real-time multi-user communication.

### Chat group categories

Based on visibility to users, chat groups are classified as public or private.

| Category | How to join   |  Accessible group information       |
| :------- | :---------- | :---------- | 
| Public group   | Any user can search for the group and apply to join, or be invited by the group owner or an admin. Whether an application requires owner or admin approval depends on the group settings. | - Users can retrieve group details and the public group list without joining.<br/> - Users must join to retrieve the announcement and shared file list. |
| Private group   | Users outside the group cannot find it and must be invited. Whether regular members can invite other users depends on the group settings. | Users must join before retrieving details, the announcement, shared file list, member list, and other information.   |

### Chat group member roles  

| Member role | Description | Management permissions |
| :------ | :-------------- | :------------ |
| Regular member   | A regular member without management permissions. | Can send and receive messages, retrieve the member list and group details, upload, download, and delete shared files, create message threads, and more.|
| Group admin   | Appointed by the group owner to assist with management and granted certain management permissions. | In addition to regular-member permissions, can update the name, description, and announcement; approve join requests; invite users; remove members; and manage the allowlist, blocklist, mute list, and mute-all setting. |
| Group owner       | The group creator becomes the owner by default and has the highest permissions. | In addition to admin permissions, can:<br/> - Add and remove admins;<br/> - Destroy the group;<br/> - Transfer ownership to another member. |

For group messages, see [Message Management](message_overview.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Quickstart](quickstart.html).
- Register `GroupManager` during SDK initialization.
- Understand the EasyIM API call frequency [limitations](/product/limitation.html).
- Understand limits on the number of groups and members. See [Limitations](/product/limitation.html).

## Create a chat group

Call `createGroup` to create a group and set its name, description, initial members, type, join rules, and other information.

Example code:

```typescript
const result = await client.groupManager.createGroup({
  name: 'groupname',
  avatar: 'https://example.com/group-avatar.png',
  description: 'this is my group',
  memberIds: ['user1', 'user2'],
  public: true,
  joinApprovalRequired: false,
  allowInvites: true,
  inviteNeedConfirm: false,
  maxMembers: 200,
  ext: JSON.stringify({ info: 'group info' }),
});

console.log(result.groupId);
```

The main parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Yes | Chat group name. |
| `description` | String | Yes | Chat group description. |
| `public` | Boolean | Yes | Whether the group is public.<br/> - `true`: A public group that appears in the public group list and users can apply to join according to its settings.<br/> - `false`: A private group that cannot be found through search. Users generally join by invitation and cannot apply. |
| `joinApprovalRequired` | Boolean | Yes | Whether the group owner or an admin must approve join applications. |
| `allowInvites` | Boolean | Yes | Whether regular members can invite other users. |
| `inviteNeedConfirm` | Boolean | Yes | Whether invited users must confirm before joining. |
| `memberIds` | Array | No | User IDs of initial members. |
| `maxMembers` | Number | No | Maximum number of group members. |
| `ext` | String | No | Chat group extension information. |
| `avatar` | String | No | Group avatar URL or identifier. |

After creation, `createGroup` returns the new `groupId`. Users generally join by [applying](#apply-to-join-a-chat-group) or [invitation](#invite-users-to-join-a-chat-group).

## Destroy a chat group

Only the group owner can destroy a group. Call `client.groupManager.getGroup(groupId)` to obtain a group object, and then call `destroy()`. After destruction, members receive `onGroupDestroyed` and are removed.

```typescript
await client.groupManager.getGroup('groupId').destroy();
```

## Join a chat group

Users generally join by invitation or application.

Whether confirmation or admin approval is required depends on `inviteNeedConfirm`, `joinApprovalRequired`, `allowInvites`, and whether the group is public.

### Invite users to join a chat group

For a public group, generally only the owner and admins can invite users. For a private group, whether regular members can invite users depends on `allowInvites`. Call `inviteUsersToGroup` to invite one or more users.

The invitation process is as follows:

![](/images/web/group_member_invite.png)

Example code:

```typescript
await client.groupManager.inviteUsersToGroup({
  groupId: 'groupId',
  userIds: ['user1', 'user2'],
});
```

The handling process depends on `inviteNeedConfirm`:

- If `inviteNeedConfirm` is `false`, invitees join without confirmation.
- If `inviteNeedConfirm` is `true`, invitees choose whether to accept:
  - Call `acceptInvitation` to accept.
  - Call `rejectInvitation` to decline.

```typescript
// The invited user accepts the invitation
await client.groupManager.acceptInvitation({
  groupId: 'groupId',
});

// The invited user declines the invitation
await client.groupManager.rejectInvitation({
  groupId: 'groupId',
});
```

After joining, the user can send and receive group messages.

### Apply to join a chat group

Users can apply to join public groups but not private groups.

The application process is as follows:

![](/images/web/group_member_apply.png)

To apply to join a public group:

1. Retrieve the [public group list](group_manage.html#retrieve-the-chat-group-list).
2. Call `joinGroup` with the group ID.

```typescript
await client.groupManager.joinGroup({
  groupId: 'groupId',
  message: 'Please approve my request',
});
```

The approval rules are as follows:

- If `joinApprovalRequired` is `false`, calling `joinGroup` joins the group directly.
- If `joinApprovalRequired` is `true`, the user must wait for owner or admin approval after calling `joinGroup`.
  - Call `acceptGroupJoinRequest` to approve.
  - Call `rejectGroupJoinRequest` to reject.

```typescript
// The group owner or an admin approves the join request
await client.groupManager.acceptGroupJoinRequest({
  groupId: 'groupId',
  userId: 'user1',
});

// The group owner or an admin rejects the join request
await client.groupManager.rejectGroupJoinRequest({
  groupId: 'groupId',
  userId: 'user1',
  reason: 'group is full',
});
```

## Leave a chat group

#### Leave voluntarily

The current user can call `leave` to leave voluntarily. The user no longer receives group messages, and other members receive `onMembersExited`.

:::tip
The group owner cannot leave directly and must first transfer ownership.
:::

```typescript
await client.groupManager.getGroup('groupId').leave();
```

#### Remove members

The owner and admins can call `removeMembers` to remove one or more members. Removed members no longer receive group messages; they receive `onUserRemoved`, while other members receive `onMembersExited`.

Whether a removed user can apply or be invited again depends on the configuration and whether the user is on the group blocklist.

Example code:

```typescript
await client.groupManager.getGroup('groupId').removeMembers({
  userIds: ['user1', 'user2'],
});
```

## Retrieve the chat group list

### Retrieve the public chat group list

Call `getPublicGroupList` to retrieve public groups by page:

```typescript
const publicGroups = await client.groupManager.getPublicGroupList({
  pageSize: 20,
  // Pagination cursor. Omit it or pass `null` / `''` for the first request. For subsequent requests, pass the `cursor` from the previous result. An empty returned `cursor` indicates the last page.
  cursor: '',
});

console.log(publicGroups.items);
console.log(publicGroups.cursor);
console.log(publicGroups.hasMore);
```

### Retrieve the groups joined by the current user

Call `getJoinedGroupList` to read the locally synchronized list of groups joined by the current user. It returns only runtime data in SDK memory and loaded local snapshots without initiating a network request.

```typescript
const joinedGroups = client.groupManager.getJoinedGroupList();
console.log(joinedGroups);
```

:::tip
To automatically synchronize joined groups after login, include `group` in `enableSyncData` during initialization. After synchronization, call `getJoinedGroupList` to read the local list. See [Initialization](initialization.html).
:::

## Query the number of groups joined by the current user

Call `getJoinedGroupList` and count the results.

The maximum number a user can join depends on the EasyIM plan. See [EasyIM plan features](/product/product_package_feature.html).

```typescript
const joinedGroups = client.groupManager.getJoinedGroupList();
console.log(joinedGroups.length);
```

## Check whether the current user blocks group messages

If the server returns the relevant state, retrieve `GroupDetail.messageBlocked` from group details.

```typescript
const detail = await client.groupManager.getGroup('groupId').refresh();

console.log(detail.messageBlocked);
```

## Common operations on a single chat group

After obtaining a `Group` object, call the following methods:

```typescript
const group = client.groupManager.getGroup('groupId');
```

| Feature | Method | Description |
| :--- | :--- | :--- |
| [Leave a chat group](#leave-voluntarily) | `group.leave()` | The current user leaves voluntarily. |
| [Remove group members](#remove-members) | `group.removeMembers({ userIds })` | Remove specified members. |
| [Transfer ownership](group_members.html#transfer-chat-group-ownership) | `group.changeOwner({ newOwner })` | Transfer the current group to another member. |
| [Retrieve the admin list](group_members.html#retrieve-the-group-admin-list) | `group.getAdmins()` | Retrieve current group admins. |
| [Add an admin](group_members.html#add-a-group-admin) | `group.addAdmin({ userId })` | Appoint a specified member as an admin. |
| [Remove an admin](group_members.html#remove-a-group-admin) | `group.removeAdmin({ userId })` | Revoke a member's admin permissions. |
| [Retrieve the mute list](group_members.html#retrieve-the-mute-list) | `group.getMuteList({ pageNum, pageSize })` | Retrieve the mute list by page. |
| [Mute members](group_members.html#mute-specified-members) | `group.muteMembers({ userIds, muteDuration })` | Add members to the mute list. `muteDuration` is in seconds. |
| [Unmute members](group_members.html#unmute-specified-members) | `group.unmuteMembers({ userIds })` | Remove members from the mute list. |
| [Mute all members](group_members.html#mute-all-members) | `group.muteAllMembers()` | Mute all members in the current group. |
| [Unmute all members](group_members.html#unmute-all-members) | `group.unmuteAllMembers()` | Unmute all members in the current group. |
| [Check whether the current user is muted](group_members.html#check-whether-the-current-user-is-muted) | `group.checkIfInMuteList()` | Check whether the current user is on the mute list. |
| [Retrieve the group blocklist](group_members.html#retrieve-the-blocklist) | `group.getBlocklist({ pageNum, pageSize })` | Retrieve the blocklist by page. |
| [Add members to the group blocklist](group_members.html#add-members-to-the-allowlist) | `group.blockMembers({ userIds })` | Add specified members to the group blocklist. |
| [Remove members from the group blocklist](group_members.html#remove-members-from-the-allowlist) | `group.unblockMembers({ userIds })` | Remove specified members from the blocklist. |
| [Retrieve the group allowlist](group_members.html#retrieve-the-allowlist) | `group.getAllowlist()` | Retrieve the group allowlist. |
| [Add members to the group allowlist](group_members.html#add-members-to-the-allowlist) | `group.addUsersToAllowlist({ userIds })` | Add specified members to the allowlist. |
| [Remove members from the group allowlist](group_members.html#remove-members-from-the-allowlist) | `group.removeUsersFromAllowlist({ userIds })` | Remove specified members from the allowlist. |
| [Check whether the current user is on the allowlist](group_members.html#check-whether-the-current-user-is-on-the-allowlist) | `group.checkIfInAllowList()` | Check whether the current user is on the allowlist. |
| [Retrieve the announcement](group_attributes.html#retrieve-the-chat-group-announcement) | `group.getAnnouncement()` | Retrieve the current announcement. |
| [Update the announcement](group_attributes.html#set-the-chat-group-announcement) | `group.updateAnnouncement({ announcement })` | Update the current announcement. |
| [Retrieve the shared file list](group_attributes.html#retrieve-the-shared-file-list) | `group.getSharedFileList({ pageNum, pageSize })` | Retrieve shared files by page. |
| [Upload a shared file](group_attributes.html#upload-a-shared-chat-group-file) | `group.uploadSharedFile({ file, ...callbacks })` | Upload a file to the shared file list. |
| [Delete a shared file](group_attributes.html#delete-a-shared-chat-group-file) | `group.deleteSharedFile({ fileId })` | Delete a specified shared file. |
| [Download a shared file](group_attributes.html#download-a-shared-chat-group-file) | `group.downloadSharedFile({ fileId, secret, ...callbacks })` | Download a specified shared file. |
| [Set group member attributes](group_members.html#set-custom-group-member-attributes) | `group.setMemberAttributes({ userId, memberAttributes })` | Set member attributes, often used for a name card. |
| [Retrieve group member attributes](group_members.html#retrieve-custom-group-member-attributes) | `group.getMembersAttributes({ userIds, keys })` | Batch-retrieve attributes of specified members. |

Example code:

```typescript
const group = client.groupManager.getGroup('groupId');

await group.muteMembers({
  userIds: ['user1'],
  muteDuration: 3600,
});

await group.updateAnnouncement({
  announcement: 'Welcome to the group.',
});

const attributes = await group.getMembersAttributes({
  userIds: ['user1', 'user2'],
  keys: ['groupNamecard'],
});

console.log(attributes.items);
```

## Monitor chat group events

Register an event listener through `addEventHandler` and refresh the group list, details, member list, or UI in callbacks.

Example code:

```typescript
// Create a chat group event listener
// In the following descriptions, user A is the current user.
client.groupManager.addEventHandler('group-events', {
  // The current user receives a group invitation. The invitee receives this callback.
  // For example, if user B invites user A, user A receives it.
  onInvitationReceived: event => {
    console.log('onInvitationReceived', event);
  },

  // The current user sends a join request. The group owner and admins receive it.
  onRequestToJoinReceived: event => {
    console.log('onRequestToJoinReceived', event);
  },

  // The current user's join request is accepted. The applicant receives it.
  // For example, after user B accepts user A's request, user A receives it.
  onRequestToJoinAccepted: event => {
    console.log('onRequestToJoinAccepted', event);
  },

  // The current user's join request is declined. The applicant receives it.
  // For example, after user B declines user A's request, user A receives it.
  onRequestToJoinDeclined: event => {
    console.log('onRequestToJoinDeclined', event);
  },

  // The current user's invitation is accepted. The inviter receives it.
  // For example, if user B accepts user A's invitation, user A receives it.
  onInvitationAccepted: event => {
    console.log('onInvitationAccepted', event);
  },

  // The current user's invitation is declined. The inviter receives it.
  // For example, if user B declines user A's invitation, user A receives it.
  onInvitationDeclined: event => {
    console.log('onInvitationDeclined', event);
  },

  // A user is removed. The removed member receives it.
  onUserRemoved: event => {
    console.log('onUserRemoved', event);
  },

  // The group is destroyed. All members receive it.
  onGroupDestroyed: event => {
    console.log('onGroupDestroyed', event);
  },

  // Triggered when the owner or admins add a user without requiring confirmation.
  // The added user receives it.
  onAutoAcceptInvitationFromGroup: event => {
    console.log('onAutoAcceptInvitationFromGroup', event);
  },

  // A member is added to the mute list.
  // The muted member, owner, and admins receive it.
  onMuteListAdded: event => {
    console.log('onMuteListAdded', event);
  },

  // A member is removed from the mute list.
  // The unmuted member, owner, and admins receive it.
  onMuteListRemoved: event => {
    console.log('onMuteListRemoved', event);
  },

  // A member is added to the group allowlist.
  // The added member, owner, and admins receive it.
  onAllowListAdded: event => {
    console.log('onAllowListAdded', event);
  },

  // A member is removed from the group allowlist.
  // The removed member, owner, and admins receive it.
  onAllowListRemoved: event => {
    console.log('onAllowListRemoved', event);
  },

  // The mute-all state changes. All members receive it.
  onAllMemberMuteStateChanged: event => {
    console.log('onAllMemberMuteStateChanged', event);
  },

  // An admin is added. The owner, new admin, and other admins receive it.
  onAdminAdded: event => {
    console.log('onAdminAdded', event);
  },

  // An admin is removed. The owner, removed admin, and other admins receive it.
  onAdminRemoved: event => {
    console.log('onAdminRemoved', event);
  },

  // The group owner changes. Group members receive it.
  onOwnerChanged: event => {
    console.log('onOwnerChanged', event);
  },

  // A member joins. Other members receive it.
  onMembersJoined: event => {
    console.log('onMembersJoined', event);
  },

  // A member leaves. Other members receive it.
  onMembersExited: event => {
    console.log('onMembersExited', event);
  },

  // The announcement is updated or deleted. All members receive it.
  onAnnouncementChanged: event => {
    console.log('onAnnouncementChanged', event);
  },

  // A shared file is added. All members receive it.
  onSharedFileAdded: event => {
    console.log('onSharedFileAdded', event);
  },

  // A shared file is deleted. All members receive it.
  onSharedFileDeleted: event => {
    console.log('onSharedFileDeleted', event);
  },

  // Group information such as the name, description, avatar, or extension is updated.
  // All members receive it.
  onGroupInfoChanged: event => {
    console.log('onGroupInfoChanged', event);
  },

  // The disabled state changes. All members receive it.
  onGroupDisabledChanged: event => {
    console.log('onGroupDisabledChanged', event);
  },

  // A group member's custom attributes change. Other members receive it.
  onGroupMemberAttributeChanged: event => {
    console.log('onGroupMemberAttributeChanged', event);
  },

  // A group member name card is updated. Other members receive it.
  onUserGroupNamecardUpdated: event => {
    console.log('onUserGroupNamecardUpdated', event);
  },
});
```

To remove the listener, call `removeEventHandler`:

```typescript
client.groupManager.removeEventHandler('group-events');
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createGroup`](#create-a-chat-group) | `GroupManager` | Create a chat group. |
| [`destroy`](#destroy-a-chat-group) | `Group` | Destroy the current group. |
| [`inviteUsersToGroup`](#invite-users-to-join-a-chat-group) | `GroupManager` | Invite one or more users. |
| [`acceptInvitation`](#invite-users-to-join-a-chat-group) | `GroupManager` | Accept a group invitation. |
| [`rejectInvitation`](#invite-users-to-join-a-chat-group) | `GroupManager` | Decline a group invitation. |
| [`joinGroup`](#apply-to-join-a-chat-group) | `GroupManager` | Apply to join a public group. |
| [`acceptGroupJoinRequest`](#apply-to-join-a-chat-group) | `GroupManager` | Approve a join request. |
| [`rejectGroupJoinRequest`](#apply-to-join-a-chat-group) | `GroupManager` | Reject a join request. |
| [`leave`](#leave-voluntarily) | `Group` | Leave the group voluntarily. |
| [`removeMembers`](#remove-members) | `Group` | Remove one or more members. |
| [`getPublicGroupList`](#retrieve-the-public-chat-group-list) | `GroupManager` | Retrieve public groups by page. |
| [`getJoinedGroupList`](#retrieve-the-groups-joined-by-the-current-user) | `GroupManager` | Read the locally synchronized joined-group list. |
| [`refresh`](#check-whether-the-current-user-blocks-group-messages) | `Group` | Force a refresh of current group details from the server. |
