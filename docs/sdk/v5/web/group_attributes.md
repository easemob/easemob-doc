# Manage Chat Group Attributes

## Feature overview

Chat group attributes describe and configure a group, including its name, description, avatar, extension information, join approval, invitation policy, maximum number of members, announcement, and shared files. This document describes how to manage these attributes with the SDK.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully.
- Register `GroupManager` during initialization so group APIs can be called through `client.groupManager`.
- Understand service limits such as the number of groups and members, announcement length, shared-file size, and API call frequency. See [Limitations](/product/limitation.html).

## Get a chat group object

Before managing attributes of a single group, we recommend calling `getGroup` to obtain a `Group` object. This method only creates or reuses a local object and does not initiate a network request.

```typescript
const group = client.groupManager.getGroup('groupId');
```

The following examples use a `Group` object where possible. To operate directly by `groupId`, use the corresponding `GroupManager` API.

## Retrieve chat group details

Retrieve group details through a `Group` object:

- `getDetail`: Retrieves current group details. The SDK preferentially reuses an available group snapshot in the current session and retrieves data from the server only when necessary.
- `refresh`: Forces a refresh of the current group details from the server.

:::tip
Users can retrieve details of a public group even if they have not joined it. For a private group, users generally must join it first.
:::

Example code:

```typescript
const group = client.groupManager.getGroup('groupId');

const detail = await group.getDetail();
console.log(detail);
// To force a refresh of the current group details from the server, call `refresh`:
const latestDetail = await group.refresh();
console.log(latestDetail);
```

To retrieve details directly by group ID, call `client.groupManager.getGroupInfo` or `client.groupManager.getGroupInfoList`:

```typescript
// Retrieve details of a single chat group
const groupInfo = await client.groupManager.getGroupInfo({ groupId: 'groupId' });
// Retrieve details of multiple chat groups
const groupInfoList = await client.groupManager.getGroupInfoList({
  groupIds: ['groupId1', 'groupId2'],
});
```

Group details are returned as `GroupDetail` with the following main fields:

| Category | Field | Type | Description |
| :--- | :--- | :--- | :--- |
| Basic information | `groupId` | String | Chat group ID. |
| Basic information | `name` | String | Chat group name. |
| Basic information | `description` | String | Chat group description. |
| Basic information | `owner` | UserInfo | User information of the group owner. |
| Basic information | `avatarUrl` | String | Chat group avatar URL. |
| Basic information | `ext` | String | Chat group extension information. |
| Basic information | `createdAt` | Number | Chat group creation timestamp. |
| Configuration | `public` | Boolean | Whether the group is public. |
| Configuration | `joinApprovalRequired` | Boolean | Whether admin approval is required to join. |
| Configuration | `allowInvites` | Boolean | Whether regular members can invite other users. |
| Configuration | `inviteNeedConfirm` | Boolean | Whether invited users must confirm before joining. |
| Configuration | `maxMembers` | Number | Maximum number of group members. |
| Configuration | `muteAllMembers` | Boolean | Whether all members are muted. |
| Configuration | `disabled` | Boolean | Whether the group is disabled. |
| Basic statistics | `memberCount` | Number | Current number of group members. |
| Current-user information | `role` | String | Current user's role: `owner`, `admin`, or `member`. |
| Current-user information | `joinedAt` | Number | Timestamp when the current user joined. |
| Current-user information | `messageBlocked` | Boolean | Whether the current user blocks messages from the group. |

## Update chat group information

Use a `Group` object to update group information or configuration.

- `updateInfo`: Updates basic information such as the name, description, avatar, and extension. The name cannot exceed 128 characters and the description cannot exceed 512 characters.
- `updateConfigs`: Updates settings such as public status, join approval, member invitation permission, invitation confirmation, and maximum number of members.

After a successful update, group members receive `onGroupInfoChanged`.

```typescript
const group = client.groupManager.getGroup('groupId');

await group.updateInfo({
  name: 'new group name',
  description: 'new description',
  avatar: 'https://example.com/new-group-avatar.png',
  ext: JSON.stringify({ info: 'new group info' }),
});

await client.groupManager.updateGroupInfo({
  groupId: 'groupId',
  public: true,
  joinApprovalRequired: true,
  allowInvites: false,
  inviteNeedConfirm: true,
  maxMembers: 500,
});
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | No | New chat group name. |
| `description` | String | No | New chat group description. |
| `avatar` | String | No | New avatar URL or identifier. |
| `ext` | String | No | New group extension information, generally a custom business string. |
| `public` | Boolean | No | Whether the group is public. |
| `joinApprovalRequired` | Boolean | No | Whether the group owner or an admin must approve join requests. |
| `allowInvites` | Boolean | No | Whether regular members can invite other users. |
| `inviteNeedConfirm` | Boolean | No | Whether invitees must confirm before joining. |
| `maxMembers` | Number | No | Maximum number of group members. |

:::tip
`updateInfo` and `updateGroupInfo` update only the passed fields. Unspecified fields remain unchanged.
:::

## Manage the chat group avatar

Set an avatar when creating a group or update it afterward through the group information API.

### Set the chat group avatar

Set `avatar` when creating a group:

```typescript
const result = await client.groupManager.createGroup({
  name: 'SDK discussion group',
  description: 'For SDK discussions',
  public: true,
  joinApprovalRequired: false,
  allowInvites: true,
  inviteNeedConfirm: true,
  memberIds: ['user1', 'user2'],
  avatar: 'https://example.com/group-avatar.png',
});

console.log(result.groupId);
```

- After creating a group, call the [update group avatar](#update-the-chat-group-avatar) API to set its avatar.

### Update the chat group avatar

After group creation, the group owner or an admin can call `updateInfo` to set or update the avatar.

After it changes, other group members receive `onGroupInfoChanged`.

```typescript
await client.groupManager.getGroup('groupId').updateInfo({
  avatar: 'https://example.com/new-group-avatar.png',
});
```

### Retrieve the chat group avatar

Group members can retrieve the avatar through the group details API:

```typescript
const detail = await client.groupManager.getGroup('groupId').getDetail();
console.log(detail.avatarUrl);
```

## Manage the chat group announcement

### Retrieve the chat group announcement

Call `getAnnouncement` to retrieve the current announcement:

```typescript
const announcement = await client.groupManager.getGroup('groupId').getAnnouncement();
console.log(announcement.announcement);
```

### Set the chat group announcement

The group owner or an admin can call `updateAnnouncement` to set or update the announcement, which cannot exceed 512 characters.

When it changes, group members receive `onAnnouncementChanged`.

```typescript
await client.groupManager.getGroup('groupId').updateAnnouncement({
  announcement: 'Welcome to the group!',
});
```

The parameters are as follows:

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `announcement` | String | Yes | New chat group announcement. |

## Manage shared chat group files

Shared files allow file resources to be shared within a group.

### Retrieve the shared file list

Call `getSharedFileList` to retrieve the current group's shared files by page.

```typescript
const result = await client.groupManager.getGroup('groupId').getSharedFileList({
  // Current page number. Retrieval starts from page 1 by default.
  pageNum: 1,
  // The value range is [1,1000], and the default is 20.
  pageSize: 20,
});

console.log(result.items);
console.log(result.hasMore);
```

The main shared-file fields are as follows:

| Field | Type | Description |
| :--- | :--- | :--- |
| `fileId` | String | Shared file ID. |
| `fileName` | String | File name. |
| `fileOwner` | Object | Information about the uploader. |
| `fileSize` | Number | File size, in bytes. |
| `createdAt` | Number | File creation timestamp. |

### Upload a shared chat group file

Call `uploadSharedFile` to upload a file to the current group's shared file list. A shared file cannot exceed 10 MB. After upload, other members receive `onSharedFileAdded`.

```typescript
await client.groupManager.getGroup('groupId').uploadSharedFile({
  file: selectedFile,
  onFileUploadProgress: event => {
    console.log(event.loaded);
  },
});
```

### Download a shared chat group file

Call `downloadSharedFile` to download a specified shared file. After completion, the SDK returns the data through `onFileDownloadComplete`.

If an access restriction was set through the [server-side API for uploading a shared group file](/document/server-side/group_shared_file_download.html), pass `secret` when downloading on the client.

```typescript
await client.groupManager.getGroup('groupId').downloadSharedFile({
  fileId: 'fileId',
  secret: 'fileSecret',
  onFileDownloadComplete: data => {
    console.log(data);
  },
});
```

### Delete a shared chat group file

Call `deleteSharedFile` to delete a specified shared file. Other members then receive `onSharedFileDeleted`.

The group owner and admins can delete any shared file; regular members can delete only files they uploaded.

```typescript
await client.groupManager.getGroup('groupId').deleteSharedFile({
  fileId: 'fileId',
});
```

## Monitor chat group attribute events

After basic information, configuration, the announcement, or shared files change, the SDK triggers corresponding events. See [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## Considerations

- `getGroup` returns only a local object bound to the specified group ID and does not initiate a network request. Call `refresh` for the latest server-side details.
- `getDetail` preferentially reuses an available snapshot and retrieves data from the server only when necessary; `refresh` forces a server refresh.
- `updateInfo` updates the name, description, avatar, and extension; `updateGroupInfo` directly updates basic information or configuration by group ID.
- `updateInfo` and `updateGroupInfo` update only passed fields. Passing an empty object is not recommended.
- `ext` is a string. Serialize structured business information to a JSON string in your business layer.
- `secret` in the download example is optional and depends on the returned shared-file information and download validation requirements.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getGroup`](#get-a-chat-group-object) | `GroupManager` | Obtain a `Group` object bound to a specified chat group ID. |
| [`getDetail`](#retrieve-chat-group-details) | `Group` | Retrieve current details, reusing an available snapshot first and querying the server when necessary. |
| [`refresh`](#retrieve-chat-group-details) | `Group` | Force a refresh of current details from the server. |
| [`getGroupInfo`](#retrieve-chat-group-details) | `GroupManager` | Retrieve one group's details by ID from the server. |
| [`getGroupInfoList`](#retrieve-chat-group-details) | `GroupManager` | Batch-retrieve details of multiple groups. |
| [`createGroup`](group_manage.html#create-a-chat-group) | `GroupManager` | Create a chat group. |
| [`updateInfo`](#update-chat-group-information) | `Group` | Update basic information such as the name, description, avatar, and extension. |
| [`updateGroupInfo`](#update-chat-group-information) | `GroupManager` | Directly update basic information or configuration by group ID. |
| [`getAnnouncement`](#retrieve-the-chat-group-announcement) | `Group` | Retrieve the current announcement. |
| [`updateAnnouncement`](#set-the-chat-group-announcement) | `Group` | Update the announcement. |
| [`getSharedFileList`](#retrieve-the-shared-file-list) | `Group` | Retrieve the shared file list by page. |
| [`uploadSharedFile`](#upload-a-shared-chat-group-file) | `Group` | Upload a file to the shared file list. |
| [`downloadSharedFile`](#download-a-shared-chat-group-file) | `Group` | Download a specified shared file. |
| [`deleteSharedFile`](#delete-a-shared-chat-group-file) | `Group` | Delete a specified shared file. |
