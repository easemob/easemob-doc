# Manage Chat Group Attributes

## Feature overview

Chat groups support multi-user communication. This document describes how to use the EasyIM Android SDK to retrieve and manage chat group details, names, descriptions, avatars, announcements, shared files, and extensions.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in successfully. See [Quickstart](quickstart.html).
- Log in and connect to the EasyIM server.
- Understand API call frequency limits and chat group and group member limits. See [Limitations](/product/limitation.html).

## Retrieve chat group details

Call `EMGroupManager#getGroup` to retrieve chat group details by group ID from local memory. This API does not initiate a network request. Call `asyncGetGroupFromServer` to retrieve the latest chat group details from the server and update the local cache.

`asyncGetGroupFromServer` does not return the group member list. To retrieve the member list, call `asyncFetchGroupMembersInfo` or `asyncFetchGroupMembers`. See [Retrieve the group member list](group_members.html#retrieve-the-group-member-list).

:::tip
Users can retrieve the details of a public group without joining it. To retrieve the details of a private group, a user must first join the group.
:::

```java
// Retrieve chat group details from local memory without sending a request to the server.
EMGroup localGroup = EMClient.getInstance()
        .groupManager()
        .getGroup(groupId);

// Retrieve the latest chat group details from the server and update the local cache.
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        // Retrieve the chat group ID.
                        String id = group.getGroupId();

                        // Retrieve the chat group name.
                        String name = group.getGroupName();

                        // Retrieve the chat group description.
                        String description = group.getDescription();

                        // Retrieve the chat group avatar URL.
                        String avatar = group.getGroupAvatar();

                        // Retrieve the group owner's user ID.
                        String owner = group.getOwner();

                        // Retrieve the list of group admin user IDs.
                        List<String> admins = group.getAdminList();

                        // Check whether the current user has blocked messages from this group.
                        boolean messageBlocked = group.isMsgBlocked();

                        // Check whether the chat group is disabled.
                        boolean disabled = group.isDisabled();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                        // Handle the failure based on the error code and error message.
                    }
                });
```
## Update chat group configurations

The group owner or a group admin can call `asyncUpdateGroupConfigs` to update specified chat group configurations. Fields that are not specified are not overwritten.

Use `EMGroupConfigsType` to specify the fields to update, as described in the following table:

| Configuration type                 | `EMGroupConfigs` field  | Description                                 |
| ------------------------ | ---------------------- | ------------------------------------ |
| `IS_PUBLIC`              | `isPublic`             | Whether the chat group is public.                       |
| `JOIN_APPROVAL_REQUIRED` | `joinApprovalRequired` | Whether joining a public group requires approval from the group owner or a group admin. |
| `ALLOW_INVITES`          | `allowInvites`         | Whether regular members of a private group can invite other users. |
| `MAX_USERS`              | `maxUsers`             | The maximum number of group members. The default value is `200`.                    |
| `INVITE_NEED_CONFIRM`    | `inviteNeedConfirm`    | Whether an invited user must confirm before joining the group.   |
| `EXT`                    | `extField`             | The chat group extension.                       |

For example, to update only the maximum number of group members, use the following sample code:

```java
// Asynchronous method.
// Configuration items not included in `EnumSet` are not updated.
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 300;
EMClient.getInstance().groupManager().asyncUpdateGroupConfigs(
        groupId,
        EnumSet.of(EMGroupManager.EMGroupConfigsType.MAX_USERS),
        configs,
        new EMValueCallBack<EMGroup>() {
            @Override
            public void onSuccess(EMGroup group) {
            }

            @Override
            public void onError(int errorCode, String errorMessage) {
            }
        });
```

Group members receive the chat group details update through `onSpecificationChanged(EMGroup group)`. The `EMGroup` object in the callback contains the updated chat group information. To ensure that the complete and latest configurations are available, call `asyncGetGroupFromServer` in the callback to retrieve chat group details from the server.

## Update the chat group name

Only the group owner and group admins can call `asyncChangeGroupName` to update the chat group name. After the update succeeds, other group members receive `EMGroupChangeListener#onSpecificationChanged`. The chat group name can contain up to 128 characters.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupName(
                groupId,
                changedGroupName,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## Update the chat group description

Only the group owner and group admins can call `asyncChangeGroupDescription` to update the chat group description. After the update succeeds, other group members receive `EMGroupChangeListener#onSpecificationChanged`. The chat group description can contain up to 512 characters.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupDescription(
                groupId,
                description,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## Manage the chat group avatar

The Android SDK supports setting a chat group avatar when creating a group and updating or retrieving the avatar after the group is created.

### Set the chat group avatar

When creating a chat group, pass the avatar URL as the `avatar` parameter of `asyncCreateGroup`. The Android SDK uses `EMGroupConfigs` to configure chat group attributes.

```java
EMGroupConfigs configs = new EMGroupConfigs();
configs.maxUsers = 200;
configs.isPublic = false;
configs.allowInvites = true;
configs.inviteNeedConfirm = true;

EMClient.getInstance()
        .groupManager()
        .asyncCreateGroup(
                groupName,
                avatar,
                description,
                new String[0],
                null,
                configs,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

After creating the chat group, you can set or update the avatar through the [update the chat group avatar](#update-the-chat-group-avatar) API.

### Update the chat group avatar

After a chat group is created, the group owner or a group admin can call `asyncChangeGroupAvatar` to set or update the chat group avatar. After the update succeeds, other group members receive `onSpecificationChanged`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncChangeGroupAvatar(
                groupId,
                changedAvatar,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Retrieve the chat group avatar

Call `asyncGetGroupFromServer` to retrieve the latest chat group details, and then call `EMGroup#getGroupAvatar` to read the chat group avatar.

```java
EMClient.getInstance()
        .groupManager()
        .asyncGetGroupFromServer(
                groupId,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String avatar = group.getGroupAvatar();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Update the chat group announcement

Only the group owner and group admins can call `asyncUpdateGroupAnnouncement` to set or update the chat group announcement. After the update succeeds, group members receive `EMGroupChangeListener#onAnnouncementChanged`.

The chat group announcement can contain up to 512 characters.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncUpdateGroupAnnouncement(
                groupId,
                announcement,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## Retrieve the chat group announcement

All group members can call `asyncFetchGroupAnnouncement` to retrieve the chat group announcement from the server.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncFetchGroupAnnouncement(
                groupId,
                new EMValueCallBack<String>() {
                    @Override
                    public void onSuccess(String announcement) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## Manage shared chat group files

Group members can download, retrieve, and delete shared chat group files. Regular members can delete only files they uploaded, whereas the group owner and group admins can delete any shared file in the group.

### Upload a shared chat group file

Call `asyncUploadGroupSharedFile` to upload a shared chat group file. After the file is uploaded, all group members receive `onSharedFileAdded`.

A single shared chat group file can be up to 10 MB.

```java
String groupId = "group_id";
// Point to an existing and readable local file.
String filePath = getExternalFilesDir(null) + "/docs/test.pdf";

EMClient.getInstance()
        .groupManager()
        .asyncUploadGroupSharedFile(
                groupId,
                filePath,
                new EMValueCallBack<EMMucSharedFile>() {
                    @Override
                    public void onProgress(int progress, String status) {
                        // The callback thread is not necessarily the main thread.
                        runOnUiThread(() -> {
                            uploadProgressBar.setProgress(progress);
                        });
                    }

                    @Override
                    public void onSuccess(EMMucSharedFile sharedFile) {
                        runOnUiThread(() -> {
                            String fileId = sharedFile.getFileId();
                            String fileName = sharedFile.getFileName();
    
                            Toast.makeText(
                                    MyActivity.this,
                                    "上传成功：" + fileName,
                                    Toast.LENGTH_SHORT
                            ).show();
                        });
                    }
    
                    @Override
                    public void onError(int error, String errorMsg) {
                        runOnUiThread(() -> {
                            Toast.makeText(
                                    MyActivity.this,
                                    "上传失败：" + errorMsg,
                                    Toast.LENGTH_SHORT
                            ).show();
                        });
                    }
                }
        );
```

After the upload succeeds, you can obtain the following information through `EMMucSharedFile`:

```java
sharedFile.getFileId();         // Shared file ID
sharedFile.getFileName();       // File name
sharedFile.getFileOwner();      // Uploader
sharedFile.getFileSize();       // File size, in bytes
sharedFile.getFileUpdateTime(); // Update time, as a Unix timestamp in milliseconds
```

### Download a shared chat group file

First call `asyncFetchGroupSharedFileList` to retrieve shared file information, and then call `asyncDownloadGroupSharedFile` to download a specified file.

```java
EMClient.getInstance()
        .groupManager()
         // pageNum: The current page number, starting from 1.
         // pageSize: The number of shared files returned per page.
        .asyncFetchGroupSharedFileList(
                groupId,
                1,
                20,
                new EMValueCallBack<List<EMMucSharedFile>>() {
                    @Override
                    public void onSuccess(
                            List<EMMucSharedFile> sharedFiles) {
                        if (sharedFiles.isEmpty()) {
                            return;
                        }

                        String fileId = sharedFiles.get(0).getFileId();
                        EMClient.getInstance()
                                .groupManager()
                                .asyncDownloadGroupSharedFile(
                                        groupId,
                                        fileId,
                                        savePath,
                                        new EMCallBack() {
                                            @Override
                                            public void onSuccess() {
                                            }

                                            @Override
                                            public void onProgress(
                                                    int progress,
                                                    String status) {
                                            }

                                            @Override
                                            public void onError(
                                                    int errorCode,
                                                    String errorMessage) {
                                            }
                                        });
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

### Delete a shared chat group file

All group members can call `asyncDeleteGroupSharedFile` to delete a specified shared chat group file. After the deletion succeeds, other group members receive `onSharedFileDeleted`.

Regular members can delete only files they uploaded, whereas the group owner and group admins can delete any shared file.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncDeleteGroupSharedFile(
                groupId,
                fileId,
                new EMCallBack() {
                    @Override
                    public void onSuccess() {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


### Retrieve shared chat group files from the server

All group members can call `asyncFetchGroupSharedFileList` to retrieve the shared chat group file list from the server by page.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        // pageNum: The current page number, starting from 1.
        // pageSize: The number of shared files returned per page.
        .asyncFetchGroupSharedFileList(
                groupId,
                pageNum,
                pageSize,
                new EMValueCallBack<List<EMMucSharedFile>>() {
                    @Override
                    public void onSuccess(
                            List<EMMucSharedFile> sharedFiles) {
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```


## Update the chat group extension

Only the group owner and group admins can update the chat group extension. The extension can store custom chat group information in JSON format and can contain up to 8 KB.

We recommend calling `asyncUpdateGroupExtension` to update the chat group extension separately. After the update succeeds, the callback returns the updated `EMGroup` object, and other group members receive `onSpecificationChanged`.

```java
// Asynchronous method.
EMClient.getInstance()
        .groupManager()
        .asyncUpdateGroupExtension(
                groupId,
                extension,
                new EMValueCallBack<EMGroup>() {
                    @Override
                    public void onSuccess(EMGroup group) {
                        String updatedExtension = group.getExtension();
                    }

                    @Override
                    public void onError(
                            int errorCode,
                            String errorMessage) {
                    }
                });
```

## Monitor chat group events

When the chat group name, description, avatar, announcement, shared files, or extension changes, the SDK triggers the corresponding `EMGroupChangeListener` callback. For listener registration and removal and complete event descriptions, see [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getGroup`](#retrieve-chat-group-details) | `EMGroupManager` | Retrieve chat group details from local memory. |
| [`asyncGetGroupFromServer`](#retrieve-chat-group-details) | `EMGroupManager` | Retrieve the latest chat group details from the server. |
| [`getGroupId`](#retrieve-chat-group-details) / [`getGroupName`](#retrieve-chat-group-details) / [`getDescription`](#retrieve-chat-group-details) | `EMGroup` | Retrieve the chat group ID, name, and description. |
| [`getOwner`](#retrieve-chat-group-details) / [`getAdminList`](#retrieve-chat-group-details) | `EMGroup` | Retrieve the group owner and group admin list. |
| [`isMsgBlocked`](#retrieve-chat-group-details) / [`isDisabled`](#retrieve-chat-group-details) | `EMGroup` | Retrieve the group message blocking status and group disabled status. |
| [`asyncUpdateGroupConfigs`](#update-chat-group-configurations) | `EMGroupManager` | Update specified chat group configurations. |
| [`asyncChangeGroupName`](#update-the-chat-group-name) | `EMGroupManager` | Update the chat group name. |
| [`asyncChangeGroupDescription`](#update-the-chat-group-description) | `EMGroupManager` | Update the chat group description. |
| [`asyncCreateGroup`](#set-the-chat-group-avatar) | `EMGroupManager` | Create a chat group and set its avatar. |
| [`asyncChangeGroupAvatar`](#update-the-chat-group-avatar) | `EMGroupManager` | Update the chat group avatar. |
| [`getGroupAvatar`](#retrieve-the-chat-group-avatar) | `EMGroup` | Retrieve the chat group avatar. |
| [`asyncUpdateGroupAnnouncement`](#update-the-chat-group-announcement) | `EMGroupManager` | Update the chat group announcement. |
| [`asyncFetchGroupAnnouncement`](#retrieve-the-chat-group-announcement) | `EMGroupManager` | Retrieve the chat group announcement. |
| [`asyncUploadGroupSharedFile`](#upload-a-shared-chat-group-file) | `EMGroupManager` | Upload a shared chat group file. |
| [`asyncDownloadGroupSharedFile`](#download-a-shared-chat-group-file) | `EMGroupManager` | Download a shared chat group file. |
| [`asyncDeleteGroupSharedFile`](#delete-a-shared-chat-group-file) | `EMGroupManager` | Delete a shared chat group file. |
| [`asyncFetchGroupSharedFileList`](#retrieve-shared-chat-group-files-from-the-server) | `EMGroupManager` | Retrieve the shared chat group file list by page. |
| [`getFileId`](#download-a-shared-chat-group-file) | `EMMucSharedFile` | Retrieve the shared chat group file ID. |
| [`asyncUpdateGroupExtension`](#update-the-chat-group-extension) | `EMGroupManager` | Update the chat group extension. |
| [`getExtension`](#update-the-chat-group-extension) | `EMGroup` | Retrieve the chat group extension. |

