# Manage Chat Group Attributes

## Feature overview

Chat groups support communication among multiple users. This document describes how to use the EasyIM iOS SDK to retrieve and manage chat group details, settings, names, descriptions, avatars, announcements, shared files, and extension fields.

## Prerequisite

Before you start, make sure that the following requirements are met:

- The SDK is initialized and the user is logged in successfully. For details, see [Quickstart](quickstart.html).
- The user is logged in and connected to the EasyIM server.
- You understand the API call frequency limits and the limits on the number of chat groups and chat group members. For details, see [Usage limits](/product/limitation.html).

## Retrieve chat group details

Call `getGroupSpecificationFromServerWithId` to retrieve the latest chat group details from the server. The returned `EMGroup` contains the chat group ID, name, description, avatar, settings, owner, admins, and other information.

This API does not return the complete member list. To retrieve the member list, call `getGroupMemberListFromServerWithId`. For details, see [Retrieve the chat group member list](group_members.html#retrieve-the-chat-group-member-list).

:::tip
Users can retrieve the details of a public group without joining it. To retrieve the details of a private group, a user must first join the group.
:::

```swift
let groupId = "groupId"

EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: groupId
) { group, error in
    guard error == nil, let group = group else {
        print("Failed to retrieve group details: \(error?.errorDescription ?? "unknown error")")
        return
    }

    let id = group.groupId
    let name = group.groupName
    let description = group.description
    let avatar = group.groupAvatar
    let owner = group.owner
    let admins = group.adminList
    let messageBlocked = group.isBlocked
    let disabled = group.isDisabled

    print(id, name, description, avatar, owner, admins,
          messageBlocked, disabled)
}
```

## Modify chat group settings

The chat group owner or an admin can call `updateGroupWithId:types:configs:completion:` to modify multiple chat group settings at once.

`types` is of type `EMGroupConfigsType` and supports bitwise combinations. Only the fields specified in `types` are read from `EMGroupConfigs`; unspecified fields are not overwritten.

| Swift configuration type | `EMGroupConfigs` field | Description |
| :--- | :--- | :--- |
| `.isPublic` | `isPublic` | Whether the chat group is public. |
| `.joinApprovalRequired` | `joinApprovalRequired` | Whether a join request for a public group requires approval. |
| `.allowInvites` | `allowInvites` | Whether regular members of a private group can invite other users. |
| `.maxUsers` | `maxUsers` | The maximum number of chat group members. The default value is 200. |
| `.inviteNeedConfirm` | `isInviteNeedConfirm` | Whether the invitee must confirm an invitation to join the chat group. |
| `.ext` | `ext` | Chat group extension fields. |

The following example modifies only the maximum number of chat group members:

```swift
let configs = EMGroupConfigs()
configs.maxUsers = 300

EMClient.shared().groupManager?.updateGroup(
    withId: "groupId",
    types: .maxUsers,
    configs: configs
) { group, error in
    if let error = error {
        print("Failed to modify the group configuration: \(error.errorDescription)")
        return
    }

    print("Group configuration modified successfully: \(group?.groupId ?? "")")
}
```

After a successful update, other chat group members receive the `groupSpecificationDidUpdate` callback. To obtain the complete and latest chat group settings, we recommend calling `getGroupSpecificationFromServerWithId:completion:` again in the callback.

## Modify the chat group name

Only the chat group owner and admins can call `updateGroupSubject` to modify the chat group name. After a successful update, other chat group members receive the `groupSpecificationDidUpdate` callback. The chat group name cannot exceed 255 characters.

```swift
EMClient.shared().groupManager?.updateGroupSubject(
    "new group name",
    forGroup: "groupId"
) { group, error in
    if let error = error {
        print("Failed to modify the group name: \(error.errorDescription)")
        return
    }

    print("Updated group name: \(group?.groupName ?? "")")
}
```

## Modify the chat group description

Only the chat group owner and admins can call `updateDescription` to modify the chat group description. After a successful update, other chat group members receive the `groupSpecificationDidUpdate` callback. The chat group description cannot exceed 2048 characters.

```swift
EMClient.shared().groupManager?.updateDescription(
    "new group description",
    forGroup: "groupId"
) { group, error in
    if let error = error {
        print("Failed to modify the group description: \(error.errorDescription)")
        return
    }

    print("Updated group description: \(group?.description ?? "")")
}
```

## Manage the chat group avatar

The iOS SDK supports setting an avatar when creating a chat group and modifying or retrieving the avatar after the chat group is created.

### Set the chat group avatar

When creating a chat group, pass the avatar URL in the `avatar` parameter of `createGroupWithSubject`. The iOS SDK uses `EMGroupConfigs` to configure chat group attributes.

```swift
let configs = EMGroupConfigs()
configs.maxUsers = 200
configs.isPublic = false
configs.allowInvites = true

EMClient.shared().groupManager?.createGroup(
    withSubject: "group name",
    avatar: "https://example.com/group-avatar.png",
    description: "group description",
    invitees: ["user1", "user2"],
    message: "Join the group",
    setting: configs
) { group, error in
    if let error = error {
        print("Failed to create the group: \(error.errorDescription)")
        return
    }

    print("Group created successfully: \(group?.groupId ?? "")")
}
```

After creating the chat group, you can set or update the avatar through [Modify the chat group avatar](#modify-the-chat-group-avatar).

### Modify the chat group avatar

After a chat group is created, only the owner can call `updateGroupAvatar` to modify its avatar. After a successful update, other chat group members receive the `groupSpecificationDidUpdate` callback.

```swift
EMClient.shared().groupManager?.updateGroupAvatar(
    "https://example.com/new-group-avatar.png",
    groupId: "groupId"
) { group, error in
    if let error = error {
        print("Failed to modify the group avatar: \(error.errorDescription)")
        return
    }

    print("Updated group avatar: \(group?.groupAvatar ?? "")")
}
```

### Retrieve the chat group avatar

Call `getGroupSpecificationFromServerWithId` to retrieve the latest chat group details, and then read the avatar through `groupAvatar`.

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    guard error == nil, let group = group else {
        return
    }

    let avatar = group.groupAvatar
    print("Group avatar: \(avatar)")
}
```

## Update the chat group announcement

Only the chat group owner and admins can call `updateGroupAnnouncementWithId` to set or update the chat group announcement. After a successful update, chat group members receive the `groupAnnouncementDidUpdate` callback.

The chat group announcement cannot exceed 512 characters.

```swift
EMClient.shared().groupManager?.updateGroupAnnouncement(
    withId: "groupId",
    announcement: "new announcement"
) { group, error in
    if let error = error {
        print("Failed to update the group announcement: \(error.errorDescription)")
        return
    }

    print("Group announcement updated successfully: \(group?.groupId ?? "")")
}
```

## Retrieve the chat group announcement

All chat group members can call `getGroupAnnouncementWithId` to retrieve the announcement from the server.

```swift
EMClient.shared().groupManager?.getGroupAnnouncement(
    withId: "groupId"
) { announcement, error in
    if let error = error {
        print("Failed to retrieve the group announcement: \(error.errorDescription)")
        return
    }

    print("Group announcement: \(announcement ?? "")")
}
```

## Manage shared files

Chat group members can upload, download, retrieve, and delete shared files. Regular members can delete only files they uploaded, while the owner and admins can delete any shared file in the chat group.

### Upload a shared file

All chat group members can call `uploadGroupSharedFileWithId` to upload a shared file. After a successful upload, other chat group members receive the `groupFileListDidUpdate` callback.

The size of a single shared file cannot exceed 10 MB.

```swift
EMClient.shared().groupManager?.uploadGroupSharedFile(
    withId: "groupId",
    filePath: localFilePath,
    progress: { progress in
        print("Upload progress: \(progress)%")
    },
    completion: { sharedFile, error in
        if let error = error {
            print("Failed to upload the shared file: \(error.errorDescription)")
            return
        }

        print("Shared file ID: \(sharedFile?.fileId ?? "")")
    }
)
```

### Download a shared file

First call `getGroupFileListWithId` to retrieve shared file information, and then call `downloadGroupSharedFileWithId` to download the specified file.

```swift
EMClient.shared().groupManager?.getGroupFileList(
    withId: "groupId",
    pageNumber: 1,
    pageSize: 20
) { sharedFiles, error in
    guard error == nil, let fileId = sharedFiles?.first?.fileId else {
        return
    }

    EMClient.shared().groupManager?.downloadGroupSharedFile(
        withId: "groupId",
        filePath: localSavePath,
        sharedFileId: fileId,
        progress: { progress in
            print("Download progress: \(progress)%")
        },
        completion: { _, error in
            if let error = error {
                print("Failed to download the shared file: \(error.errorDescription)")
                return
            }

            print("Shared file downloaded successfully")
        }
    )
}
```

### Delete a shared file

All chat group members can call `removeGroupSharedFileWithId` to delete a specified shared file. After a successful deletion, other chat group members receive the `groupFileListDidUpdate` callback.

Regular members can delete only files they uploaded. The owner and admins can delete any shared file.

```swift
EMClient.shared().groupManager?.removeGroupSharedFile(
    withId: "groupId",
    sharedFileId: "fileId"
) { _, error in
    if let error = error {
        print("Failed to delete the shared file: \(error.errorDescription)")
        return
    }

    print("Shared file deleted successfully")
}
```

### Retrieve shared files from the server

All chat group members can call `getGroupFileListWithId` to retrieve the shared file list from the server by page. `pageNumber` starts at 1.

```swift
EMClient.shared().groupManager?.getGroupFileList(
    withId: "groupId",
    pageNumber: 1,
    pageSize: 20
) { sharedFiles, error in
    if let error = error {
        print("Failed to retrieve the shared file list: \(error.errorDescription)")
        return
    }

    sharedFiles?.forEach { file in
        print(file.fileId, file.fileName)
    }
}
```

## Update chat group extension fields

Only the chat group owner and admins can update chat group extension fields. Extension fields can store custom chat group information in JSON string format and cannot exceed 8 KB.

You can call `updateGroupExtWithId` to update extension fields separately, or call `updateGroupWithId` and specify `.ext`. After a successful update, other chat group members receive the `groupSpecificationDidUpdate` callback.

```swift
let ext = #"{"category":"music"}"#

EMClient.shared().groupManager?.updateGroupExt(
    withId: "groupId",
    ext: ext
) { group, error in
    if let error = error {
        print("Failed to update the group extension: \(error.errorDescription)")
        return
    }

    print("Updated group extension: \(group?.settings.ext ?? "")")
}
```

## Monitor chat group events

When the chat group name, description, avatar, announcement, shared files, or extension fields change, the SDK triggers the corresponding `EMGroupManagerDelegate` callback. For delegate registration, removal, and complete event details, see [Monitor chat group events](group_manage.html#monitor-chat-group-events).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getGroupSpecificationFromServerWithId`](#retrieve-chat-group-details) | `IEMGroupManager` | Retrieves the latest chat group details from the server. |
| [`groupId`](#retrieve-chat-group-details) / [`groupName`](#retrieve-chat-group-details) / [`description`](#retrieve-chat-group-details) | `EMGroup` | Retrieves the chat group ID, name, and description. |
| [`owner`](#retrieve-chat-group-details) / [`adminList`](#retrieve-chat-group-details) | `EMGroup` | Retrieves the owner and admin list. |
| [`isBlocked`](#retrieve-chat-group-details) / [`isDisabled`](#retrieve-chat-group-details) | `EMGroup` | Retrieves the message-blocked and disabled status of the chat group. |
| [`updateGroupWithId`](#modify-chat-group-settings) | `IEMGroupManager` | Updates specified chat group settings. |
| [`updateGroupSubject`](#modify-the-chat-group-name) | `IEMGroupManager` | Modifies the chat group name. |
| [`updateDescription`](#modify-the-chat-group-description) | `IEMGroupManager` | Modifies the chat group description. |
| [`createGroupWithSubject`](#set-the-chat-group-avatar) | `IEMGroupManager` | Creates a chat group and sets its avatar. |
| [`updateGroupAvatar`](#modify-the-chat-group-avatar) | `IEMGroupManager` | Modifies the chat group avatar. |
| [`groupAvatar`](#retrieve-the-chat-group-avatar) | `EMGroup` | Retrieves the chat group avatar. |
| [`updateGroupAnnouncementWithId`](#update-the-chat-group-announcement) | `IEMGroupManager` | Updates the chat group announcement. |
| [`getGroupAnnouncementWithId`](#retrieve-the-chat-group-announcement) | `IEMGroupManager` | Retrieves the announcement from the server. |
| [`uploadGroupSharedFileWithId`](#upload-a-shared-file) | `IEMGroupManager` | Uploads a shared file. |
| [`downloadGroupSharedFileWithId`](#download-a-shared-file) | `IEMGroupManager` | Downloads a shared file. |
| [`removeGroupSharedFileWithId`](#delete-a-shared-file) | `IEMGroupManager` | Deletes a shared file. |
| [`getGroupFileListWithId`](#retrieve-shared-files-from-the-server) | `IEMGroupManager` | Retrieves the shared file list by page. |
| [`fileId`](#download-a-shared-file) | `EMGroupSharedFile` | Retrieves the shared file ID. |
