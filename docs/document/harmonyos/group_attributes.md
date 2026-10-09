# 管理群组属性

## 功能说明

群组是支持多人沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM HarmonyOS SDK 获取和管理群组详情、名称、描述、头像、公告、共享文件及扩展字段。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已登录并连接到 IM 服务器。
- 已了解接口调用频率、群组及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 获取群组详情

调用 `GroupManager#getGroup` 可以根据群组 ID 从本地内存获取群组详情，该方法不会发起网络请求。调用 `fetchGroupFromServer` 可以从服务器获取最新群组详情，并更新本地缓存。

若要在登录后从本地读取最新的已加入群组数据，需在 SDK 初始化时启用已加入群组数据同步，并等待同步完成，详见 [获取当前用户加入的群组列表](group_manage.html#获取当前用户加入的群组列表)。

`fetchGroupFromServer` 不返回群成员列表。如果需要群成员列表，需调用 `fetchGroupMemberDetails` 或 `fetchGroupMembers`，详见 [获取群成员列表](group_members.html#获取群成员列表)。

:::tip
对于公开群，用户即使未加入群组也可以获取群组详情；对于私有群，用户加入群组后才能获取群组详情。
:::

```typescript
// 从本地内存获取群组详情，不会向服务器发起请求。
let localGroup: Group | undefined = ChatClient.getInstance()
    .groupManager()
    ?.getGroup(groupId);

// 从服务器获取最新群组详情，并更新本地缓存。
ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId)
    .then((group: Group): void => {
        // 获取群组 ID。
        let id: string = group.groupId();

        // 获取群组名称。
        let name: string = group.groupName();

        // 获取群组描述。
        let description: string = group.description();

        // 获取群头像 URL。
        let avatar: string = group.groupAvatar();

        // 获取群主的用户 ID。
        let owner: string = group.owner();

        // 获取群管理员的用户 ID 列表。
        let admins: string[] = group.adminList();

        // 判断当前用户是否已屏蔽该群组的消息。
        let messageBlocked: boolean = group.isMsgBlocked();

        // 判断群组是否已被禁用。
        let disabled: boolean = group.isDisabled();
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

## 修改群组配置

群主或群管理员可调用 `GroupManager#updateGroupConfigs` 按指定配置项修改群组配置，未指定的字段不会被覆盖。

通过 `GroupConfigsType` 指定要更新的字段，如下表所示：

| 配置类型 | `GroupConfigs` 字段 | 说明 |
| :--- | :--- | :--- |
| `IS_PUBLIC` | `isPublic` | 是否为公开群。 |
| `JOIN_APPROVAL_REQUIRED` | `joinApprovalRequired` | 申请加入公开群是否需要群主或管理员审批。 |
| `ALLOW_INVITES` | `allowInvites` | 私有群普通成员是否可以邀请其他用户。 |
| `MAX_USERS` | `maxUsers` | 群组最大成员数，默认值为 `200`。 |
| `INVITE_NEED_CONFIRM` | `inviteNeedConfirm` | 被邀请用户加入群组前是否需要确认。 |
| `EXT` | `extField` | 群组扩展字段。 |

例如，仅修改群组最大成员数，示例代码如下：

```typescript
let configs: GroupConfigs = new GroupConfigs();
configs.maxUsers = 300;

// 未包含在 types 中的配置项不会被更新。
ChatClient.getInstance().groupManager()?.updateGroupConfigs(
    groupId,
    [GroupConfigsType.MAX_USERS],
    configs
).then((group: Group): void => {
    // 群组配置修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

群成员会通过 `GroupListener#onSpecificationChanged` 收到群组详情更新事件。为确保获取完整且最新的配置，建议在事件中调用 `fetchGroupFromServer` 从服务器获取群组详情。

## 修改群组名称

仅群主和群管理员可以调用 `GroupManager#changeGroupName` 修改群组名称。修改成功后，其他群成员会收到 `GroupListener#onSpecificationChanged` 事件。群组名称的长度限制为 255 个字符。

```typescript
ChatClient.getInstance().groupManager()?.changeGroupName(
    groupId,
    changedGroupName
).then((group: Group): void => {
    // 群组名称修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

## 修改群组描述

仅群主和群管理员可以调用 `GroupManager#changeGroupDescription` 修改群组描述。修改成功后，其他群成员会收到 `GroupListener#onSpecificationChanged` 事件。群组描述的长度限制为 2048 个字符。

```typescript
ChatClient.getInstance().groupManager()?.changeGroupDescription(
    groupId,
    description
).then((group: Group): void => {
    // 群组描述修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

## 管理群组头像

HarmonyOS SDK 支持在创建群组时设置群头像，也支持在群组创建后修改或获取群头像。

### 设置群组头像

创建群组时，将头像 URL 赋给 `GroupOptions` 的 `avatar` 字段，然后调用 `GroupManager#createGroup`。

```typescript
let option: GroupOptions = {
    groupName: "group name",
    avatar: "https://example.com/group-avatar.png",
    desc: "group description",
    members: [],
    maxUsers: 200,
    isPublic: false,
    joinApprovalRequired: false,
    allowInvites: true,
    inviteNeedConfirm: true,
};

ChatClient.getInstance().groupManager()?.createGroup(option)
    .then((group: Group): void => {
        // 群组创建成功。
    })
    .catch((error: ChatError): void => {
        // 创建失败，根据错误码和错误信息处理。
    });
```

创建群组后，可以通过 [修改群组头像](#修改群组头像) 接口设置或更新头像。

### 修改群组头像

群组创建后，群主或群管理员可以调用 `GroupManager#changeGroupAvatar` 设置或修改群头像。修改成功后，其他群成员会收到 `GroupListener#onSpecificationChanged` 事件。

```typescript
ChatClient.getInstance().groupManager()?.changeGroupAvatar(
    groupId,
    changedAvatar
).then((group: Group): void => {
    // 群头像修改成功。
}).catch((error: ChatError): void => {
    // 修改失败，根据错误码和错误信息处理。
});
```

### 获取群组头像

调用 `GroupManager#fetchGroupFromServer` 获取最新群组详情，然后通过 `Group#groupAvatar` 读取群头像。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId)
    .then((group: Group): void => {
        let avatar: string = group.groupAvatar();
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

## 更新群公告

仅群主和群管理员可以调用 `GroupManager#updateGroupAnnouncement` 设置或更新群公告。更新成功后，群成员会收到 `GroupListener#onAnnouncementChanged` 事件。

群公告的长度限制为 512 个字符。

```typescript
ChatClient.getInstance().groupManager()?.updateGroupAnnouncement(
    groupId,
    announcement
).then((group: Group): void => {
    // 群公告更新成功。
}).catch((error: ChatError): void => {
    // 更新失败，根据错误码和错误信息处理。
});
```

## 获取群公告

所有群成员均可以调用 `GroupManager#fetchGroupAnnouncement` 从服务器获取群公告。该方法直接返回公告字符串。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupAnnouncement(groupId)
    .then((announcement: string): void => {
        // 获取到群公告。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

## 管理共享文件

群成员可以上传、下载、获取和删除群共享文件。普通成员只能删除自己上传的文件，群主和群管理员可以删除群组中的任意共享文件。

### 上传共享文件

调用 `GroupManager#uploadGroupSharedFile` 上传群共享文件。文件上传后，群组所有成员都会收到 `GroupListener#onSharedFileAdded` 事件。

单个群共享文件大小限制为 10 MB。

```typescript
let groupId: string = "group_id";
// 指向存在且可读的本地文件。
let filePath: string = context.filesDir + "/test.pdf";

ChatClient.getInstance().groupManager()?.uploadGroupSharedFile(
    groupId,
    filePath,
    {
        onProgress: (progress: number): void => {
            // 更新上传进度。
        }
    }
).then((sharedFile: SharedFile): void => {
    let fileId: string = sharedFile.fileId();
    let fileName: string = sharedFile.fileName();
}).catch((error: ChatError): void => {
    // 上传失败，根据错误码和错误信息处理。
});
```

上传成功后，可通过 `SharedFile` 获取文件信息：

```typescript
sharedFile.fileId();         // 共享文件 ID。
sharedFile.fileName();       // 文件名。
sharedFile.fileOwner();      // 上传者的用户 ID。
sharedFile.fileSize();       // 文件大小，单位为字节。
sharedFile.fileUpdateTime(); // 更新时间，Unix 时间戳，单位为毫秒。
```

### 下载共享文件

先调用 `GroupManager#fetchGroupSharedFileList` 获取共享文件信息，再调用 `downloadGroupSharedFile` 下载指定文件。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupSharedFileList(
    groupId,
    1,  // pageNum：当前页码，从 1 开始。
    20  // pageSize：每页返回的共享文件数。
).then((sharedFiles: SharedFile[]): void => {
    if (sharedFiles.length === 0) {
        return;
    }

    let fileId: string = sharedFiles[0].fileId();
    let savePath: string = context.filesDir + "/" + sharedFiles[0].fileName();
    ChatClient.getInstance().groupManager()?.downloadGroupSharedFile(
        groupId,
        fileId,
        savePath,
        {
            onProgress: (progress: number): void => {
                // 更新下载进度。
            }
        }
    ).then((): void => {
        // 下载成功。
    }).catch((error: ChatError): void => {
        // 下载失败，根据错误码和错误信息处理。
    });
}).catch((error: ChatError): void => {
    // 获取共享文件列表失败。
});
```

### 删除共享文件

所有群成员均可以调用 `GroupManager#deleteGroupSharedFile` 删除指定群共享文件。删除成功后，其他群成员会收到 `GroupListener#onSharedFileDeleted` 事件。

普通成员只能删除自己上传的文件，群主和群管理员可以删除任意共享文件。

```typescript
ChatClient.getInstance().groupManager()?.deleteGroupSharedFile(
    groupId,
    fileId
).then((): void => {
    // 删除成功。
}).catch((error: ChatError): void => {
    // 删除失败，根据错误码和错误信息处理。
});
```

### 从服务器获取共享文件

所有群成员均可以调用 `GroupManager#fetchGroupSharedFileList` 从服务器分页获取群共享文件列表。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupSharedFileList(
    groupId,
    pageNum,  // 当前页码，从 1 开始。
    pageSize  // 每页返回的共享文件数。
).then((sharedFiles: SharedFile[]): void => {
    // 获取成功。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

## 更新群扩展字段

仅群主和群管理员可以更新群组扩展字段。群扩展字段可用于存储 JSON 格式的自定义群组信息，长度不能超过 8 KB。

建议调用 `GroupManager#updateGroupExtension` 单独更新群扩展字段。更新成功后，Promise 返回更新后的 `Group` 对象，其他群成员会收到 `GroupListener#onSpecificationChanged` 事件。

```typescript
ChatClient.getInstance().groupManager()?.updateGroupExtension(
    groupId,
    extension
).then((group: Group): void => {
    let updatedExtension: string = group.extension();
}).catch((error: ChatError): void => {
    // 更新失败，根据错误码和错误信息处理。
});
```

## 监听群组事件

群组名称、描述、头像、公告、共享文件和扩展字段发生变化时，SDK 会触发对应的 `GroupListener` 事件。监听器的注册、移除及完整事件说明详见 [监听群组事件](group_manage.html#监听群组事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getGroup`](#获取群组详情) | `GroupManager` | 从本地内存获取群组详情。 |
| [`fetchGroupFromServer`](#获取群组详情) | `GroupManager` | 从服务器获取最新群组详情。 |
| [`groupId`](#获取群组详情) / [`groupName`](#获取群组详情) / [`description`](#获取群组详情) | `Group` | 获取群组 ID、名称和描述。 |
| [`owner`](#获取群组详情) / [`adminList`](#获取群组详情) | `Group` | 获取群主和群管理员列表。 |
| [`isMsgBlocked`](#获取群组详情) / [`isDisabled`](#获取群组详情) | `Group` | 获取群消息屏蔽状态和群禁用状态。 |
| [`updateGroupConfigs`](#修改群组配置) | `GroupManager` | 按指定配置项修改群组配置。 |
| [`changeGroupName`](#修改群组名称) | `GroupManager` | 修改群组名称。 |
| [`changeGroupDescription`](#修改群组描述) | `GroupManager` | 修改群组描述。 |
| [`createGroup`](#设置群组头像) | `GroupManager` | 创建群组并设置群头像。 |
| [`changeGroupAvatar`](#修改群组头像) | `GroupManager` | 修改群头像。 |
| [`groupAvatar`](#获取群组头像) | `Group` | 获取群头像 URL。 |
| [`updateGroupAnnouncement`](#更新群公告) / [`fetchGroupAnnouncement`](#获取群公告) | `GroupManager` | 更新或获取群公告。 |
| [`uploadGroupSharedFile`](#上传共享文件) / [`downloadGroupSharedFile`](#下载共享文件) | `GroupManager` | 上传或下载群共享文件。 |
| [`deleteGroupSharedFile`](#删除共享文件) / [`fetchGroupSharedFileList`](#从服务器获取共享文件) | `GroupManager` | 删除或分页获取群共享文件。 |
| [`updateGroupExtension`](#更新群扩展字段) | `GroupManager` | 更新群扩展字段。 |
