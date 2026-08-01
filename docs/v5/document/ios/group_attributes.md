# 管理群组属性

## 功能说明

群组是支持多人沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM iOS SDK 获取和管理群组详情、配置、名称、描述、头像、公告、共享文件及扩展字段。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已登录并连接到 IM 服务器。
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 获取群组详情

调用 `getGroupSpecificationFromServerWithId` 可以从服务器获取最新群组详情。返回的 `EMGroup` 包含群组 ID、名称、描述、头像、配置、群主和管理员等信息。

该接口不返回完整群成员列表。如需获取群成员列表，调用 `getGroupMemberListFromServerWithId`，详见 [获取群成员列表](group_members.html#获取群成员列表)。

:::tip
对于公开群，用户未加入群组时也可以获取群组详情；对于私有群，用户加入群组后才能获取群组详情。
:::

```swift
let groupId = "groupId"

EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: groupId
) { group, error in
    guard error == nil, let group = group else {
        print("获取群组详情失败：\(error?.errorDescription ?? "unknown error")")
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

## 修改群组配置

群主或群管理员可调用 `updateGroupWithId:types:configs:completion:` 按指定字段批量修改群组配置。

`types` 为 `EMGroupConfigsType`，支持按位组合；只有 `types` 中指定的字段会从 `EMGroupConfigs` 中读取，未指定的字段不会被覆盖。


| Swift 配置类型 | `EMGroupConfigs` 字段 | 说明 |
| :--- | :--- | :--- |
| `.isPublic` | `isPublic` | 是否为公开群。 |
| `.joinApprovalRequired` | `joinApprovalRequired` | 公开群的入群申请是否需要审批。 |
| `.allowInvites` | `allowInvites` | 私有群普通成员是否可以邀请其他用户。 |
| `.maxUsers` | `maxUsers` | 群组最大成员数，默认值为 200。 |
| `.inviteNeedConfirm` | `isInviteNeedConfirm` | 邀请其他用户入群时是否需要对方确认。 |
| `.ext` | `ext` | 群组扩展字段。 |

以下示例仅修改群组最大成员数：

```swift
let configs = EMGroupConfigs()
configs.maxUsers = 300

EMClient.shared().groupManager?.updateGroup(
    withId: "groupId",
    types: .maxUsers,
    configs: configs
) { group, error in
    if let error = error {
        print("修改群组配置失败：\(error.errorDescription)")
        return
    }

    print("修改群组配置成功：\(group?.groupId ?? "")")
}
```

更新成功后，其他群成员会收到 `groupSpecificationDidUpdate` 回调。若需完整、最新的群组配置，建议在回调中调用 `getGroupSpecificationFromServerWithId:completion:` 重新获取。

## 修改群组名称

仅群主和群管理员可以调用 `updateGroupSubject` 修改群组名称。修改成功后，其他群成员会收到 `groupSpecificationDidUpdate` 回调。群名称的长度限制为 128 个字符。

```swift
EMClient.shared().groupManager?.updateGroupSubject(
    "new group name",
    forGroup: "groupId"
) { group, error in
    if let error = error {
        print("修改群组名称失败：\(error.errorDescription)")
        return
    }

    print("修改后的群组名称：\(group?.groupName ?? "")")
}
```

## 修改群组描述

仅群主和群管理员可以调用 `updateDescription` 修改群组描述。修改成功后，其他群成员会收到 `groupSpecificationDidUpdate` 回调。群描述的长度限制为 512 个字符。

```swift
EMClient.shared().groupManager?.updateDescription(
    "new group description",
    forGroup: "groupId"
) { group, error in
    if let error = error {
        print("修改群组描述失败：\(error.errorDescription)")
        return
    }

    print("修改后的群组描述：\(group?.description ?? "")")
}
```

## 管理群组头像

iOS SDK 支持在创建群组时设置群头像，也支持在群组创建后修改或获取群头像。

### 设置群组头像

创建群组时，将头像地址作为 `createGroupWithSubject` 的 `avatar` 参数传入。iOS SDK 使用 `EMGroupConfigs` 配置群组属性。

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
        print("创建群组失败：\(error.errorDescription)")
        return
    }

    print("群组创建成功：\(group?.groupId ?? "")")
}
```

创建群组后，可以通过 [修改群组头像](#修改群组头像)接口设置或更新头像。

### 修改群组头像

群组创建后，仅群主可以调用 `updateGroupAvatar` 修改群头像。修改成功后，其他群成员会收到 `groupSpecificationDidUpdate` 回调。

```swift
EMClient.shared().groupManager?.updateGroupAvatar(
    "https://example.com/new-group-avatar.png",
    groupId: "groupId"
) { group, error in
    if let error = error {
        print("修改群头像失败：\(error.errorDescription)")
        return
    }

    print("修改后的群头像：\(group?.groupAvatar ?? "")")
}
```

### 获取群组头像

调用 `getGroupSpecificationFromServerWithId` 获取最新群组详情，然后通过 `groupAvatar` 读取群头像。

```swift
EMClient.shared().groupManager?.getGroupSpecificationFromServer(
    withId: "groupId"
) { group, error in
    guard error == nil, let group = group else {
        return
    }

    let avatar = group.groupAvatar
    print("群头像：\(avatar)")
}
```

## 更新群公告

仅群主和群管理员可以调用 `updateGroupAnnouncementWithId` 设置或更新群公告。更新成功后，群成员会收到 `groupAnnouncementDidUpdate` 回调。

群公告的长度限制为 512 个字符。

```swift
EMClient.shared().groupManager?.updateGroupAnnouncement(
    withId: "groupId",
    announcement: "new announcement"
) { group, error in
    if let error = error {
        print("更新群公告失败：\(error.errorDescription)")
        return
    }

    print("群公告更新成功：\(group?.groupId ?? "")")
}
```

## 获取群公告

所有群成员均可以调用 `getGroupAnnouncementWithId` 从服务器获取群公告。

```swift
EMClient.shared().groupManager?.getGroupAnnouncement(
    withId: "groupId"
) { announcement, error in
    if let error = error {
        print("获取群公告失败：\(error.errorDescription)")
        return
    }

    print("群公告：\(announcement ?? "")")
}
```

## 管理共享文件

群成员可以上传、下载、获取和删除群共享文件。普通成员只能删除自己上传的文件，群主和群管理员可以删除群组中的任意共享文件。

### 上传共享文件

所有群成员均可以调用 `uploadGroupSharedFileWithId` 上传群共享文件。上传成功后，其他群成员会收到 `groupFileListDidUpdate` 回调。

单个群共享文件大小限制为 10 MB。

```swift
EMClient.shared().groupManager?.uploadGroupSharedFile(
    withId: "groupId",
    filePath: localFilePath,
    progress: { progress in
        print("上传进度：\(progress)%")
    },
    completion: { sharedFile, error in
        if let error = error {
            print("上传共享文件失败：\(error.errorDescription)")
            return
        }

        print("共享文件 ID：\(sharedFile?.fileId ?? "")")
    }
)
```

### 下载共享文件

先调用 `getGroupFileListWithId` 获取共享文件信息，再调用 `downloadGroupSharedFileWithId` 下载指定文件。

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
            print("下载进度：\(progress)%")
        },
        completion: { _, error in
            if let error = error {
                print("下载共享文件失败：\(error.errorDescription)")
                return
            }

            print("共享文件下载成功")
        }
    )
}
```

### 删除共享文件

所有群成员均可以调用 `removeGroupSharedFileWithId` 删除指定共享文件。删除成功后，其他群成员会收到 `groupFileListDidUpdate` 回调。

普通成员只能删除自己上传的文件，群主和群管理员可以删除任意共享文件。

```swift
EMClient.shared().groupManager?.removeGroupSharedFile(
    withId: "groupId",
    sharedFileId: "fileId"
) { _, error in
    if let error = error {
        print("删除共享文件失败：\(error.errorDescription)")
        return
    }

    print("共享文件删除成功")
}
```

### 从服务器获取共享文件

所有群成员均可以调用 `getGroupFileListWithId` 从服务器分页获取群共享文件列表。`pageNumber` 从 1 开始。

```swift
EMClient.shared().groupManager?.getGroupFileList(
    withId: "groupId",
    pageNumber: 1,
    pageSize: 20
) { sharedFiles, error in
    if let error = error {
        print("获取共享文件列表失败：\(error.errorDescription)")
        return
    }

    sharedFiles?.forEach { file in
        print(file.fileId, file.fileName)
    }
}
```

## 更新群扩展字段

仅群主和群管理员可以更新群组扩展字段。群扩展字段可用于存储 JSON 字符串格式的自定义群组信息，长度不能超过 8 KB。

可以调用 `updateGroupExtWithId` 单独更新扩展字段，也可以调用 `updateGroupWithId` 并指定 `.ext` 更新。更新成功后，其他群成员会收到 `groupSpecificationDidUpdate` 回调。

```swift
let ext = #"{"category":"music"}"#

EMClient.shared().groupManager?.updateGroupExt(
    withId: "groupId",
    ext: ext
) { group, error in
    if let error = error {
        print("更新群扩展字段失败：\(error.errorDescription)")
        return
    }

    print("更新后的群扩展字段：\(group?.settings.ext ?? "")")
}
```

## 监听群组事件

群名称、描述、头像、公告、共享文件和扩展字段发生变化时，SDK 会触发对应的 `EMGroupManagerDelegate` 回调。代理的注册、移除及完整事件说明详见[监听群组事件](group_manage.html#监听群组事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getGroupSpecificationFromServerWithId`](#获取群组详情) | `IEMGroupManager` | 从服务器获取最新群组详情。 |
| [`groupId`](#获取群组详情) / [`groupName`](#获取群组详情) / [`description`](#获取群组详情) | `EMGroup` | 获取群组 ID、名称和描述。 |
| [`owner`](#获取群组详情) / [`adminList`](#获取群组详情) | `EMGroup` | 获取群主和群管理员列表。 |
| [`isBlocked`](#获取群组详情) / [`isDisabled`](#获取群组详情) | `EMGroup` | 获取群消息屏蔽状态和群禁用状态。 |
| [`updateGroupWithId`](#修改群组配置) | `IEMGroupManager` | 按指定字段更新群组配置。 |
| [`updateGroupSubject`](#修改群组名称) | `IEMGroupManager` | 修改群组名称。 |
| [`updateDescription`](#修改群组描述) | `IEMGroupManager` | 修改群组描述。 |
| [`createGroupWithSubject`](#设置群组头像) | `IEMGroupManager` | 创建群组并设置群头像。 |
| [`updateGroupAvatar`](#修改群组头像) | `IEMGroupManager` | 修改群头像。 |
| [`groupAvatar`](#获取群组头像) | `EMGroup` | 获取群头像。 |
| [`updateGroupAnnouncementWithId`](#更新群公告) | `IEMGroupManager` | 更新群公告。 |
| [`getGroupAnnouncementWithId`](#获取群公告) | `IEMGroupManager` | 从服务器获取群公告。 |
| [`uploadGroupSharedFileWithId`](#上传共享文件) | `IEMGroupManager` | 上传群共享文件。 |
| [`downloadGroupSharedFileWithId`](#下载共享文件) | `IEMGroupManager` | 下载群共享文件。 |
| [`removeGroupSharedFileWithId`](#删除共享文件) | `IEMGroupManager` | 删除群共享文件。 |
| [`getGroupFileListWithId`](#从服务器获取共享文件) | `IEMGroupManager` | 分页获取群共享文件列表。 |
| [`fileId`](#下载共享文件) | `EMGroupSharedFile` | 获取群共享文件 ID。 |
