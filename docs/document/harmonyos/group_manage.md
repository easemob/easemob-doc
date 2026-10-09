# 创建和管理群组

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用环信即时通讯 IM HarmonyOS SDK 创建、加入、退出、解散和管理群组，并监听群组事件。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

HarmonyOS SDK 使用 `GroupOptions` 的多个字段定义群组类型：

| 群组类型 | HarmonyOS 配置 | 说明 |
| :--- | :--- | :--- |
| 私有群，仅群主和管理员邀请 | `isPublic = false`、`allowInvites = false` | 普通成员不能邀请其他用户。 |
| 私有群，成员可邀请 | `isPublic = false`、`allowInvites = true` | 普通成员可以邀请其他用户。 |
| 公开群，申请需审批 | `isPublic = true`、`joinApprovalRequired = true` | 用户提交入群申请后，等待群主或管理员审批。 |
| 公开群，可直接加入 | `isPublic = true`、`joinApprovalRequired = false` | 用户可直接加入群组。 |

:::tip
`joinApprovalRequired` 仅对公开群有效，`allowInvites` 仅对私有群有效。
:::

### 群组成员角色

群组包含以下角色：

| 角色 | 说明 |
| :--- | :--- |
| 群主 | 创建群组的用户，拥有解散群组、转让群主、修改群配置和移出成员等权限。 |
| 群管理员 | 由群主设置，具备部分群管理权限。例如，审批入群申请、邀请或移出成员，以及管理禁言、白名单和黑名单等。 |
| 普通成员 | 可以在权限允许的范围内收发群消息、退出群组，以及在私有群允许邀请时邀请其他用户。 |

如需了解群组消息相关能力，参见 [消息管理](message_overview.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并成功登录，详见 [快速开始](quickstart.html)。
- 已了解接口调用频率、群组数量及群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 创建群组

调用 `GroupManager#createGroup` 创建群组。创建成功后，当前用户成为群主，Promise 返回新建的 `Group` 对象。

SDK 使用 `GroupOptions` 配置群组信息、群组类型和入群规则。**所有字段均为可选字段**：

| 字段 | 类型 | 默认值 | 描述 |
| :--- | :--- | :--- | :--- |
| `groupName` | `string` | `""` | 群组名称，长度不能超过 255 个字符。 |
| `avatar` | `string` | 空 | 群头像 URL。 |
| `desc` | `string` | `""` | 群组描述，长度不能超过 2048 个字符。 |
| `members` | `string[]` | `[]` | 初始群成员的用户 ID 数组，不需要包含群主。 |
| `reason` | `string` | `""` | 邀请初始成员入群的说明。 |
| `maxUsers` | `number` | `200` | 群组最大成员数。 |
| `isPublic` | `boolean` | `false` | 是否为公开群。`true` 表示公开群，`false` 表示私有群。 |
| `joinApprovalRequired` | `boolean` | `false` | 申请加入公开群时是否需要群主或管理员审批。仅对公开群有意义。 |
| `allowInvites` | `boolean` | `false` | 私有群是否允许普通成员邀请其他用户。仅对私有群有意义。 |
| `inviteNeedConfirm` | `boolean` | `true` | 被邀请用户加入群组前是否需要确认邀请。 |
| `extField` | `string` | 空 | 群组扩展信息，可以使用 JSON 字符串。 |

```typescript
let option: GroupOptions = {
    groupName: "group name",
    avatar: "https://example.com/group-avatar.png",
    desc: "group description",
    members: ["user1", "user2"],
    reason: "Join our group",
    maxUsers: 200,
    isPublic: false,
    joinApprovalRequired: false,
    allowInvites: true,
    inviteNeedConfirm: true,
    extField: "{\"source\":\"harmonyos\"}",
};

ChatClient.getInstance().groupManager()?.createGroup(option)
    .then((group: Group): void => {
        let groupId: string = group.groupId();
    })
    .catch((error: ChatError): void => {
        // 创建失败，根据 error.errorCode 和 error.description 处理。
    });
```

## 解散群组

仅群主可以调用 `GroupManager#destroyGroup` 解散群组。群组解散后，其他成员会收到 `GroupListener#onGroupDestroyed` 事件并被移出群组。

:::warning
解散群组是不可恢复的操作。解散成功后，群组将不再存在，所有群成员均会被移出群组。执行该操作前，建议在应用侧进行二次确认。
:::

```typescript
ChatClient.getInstance().groupManager()?.destroyGroup(groupId)
    .then((): void => {
        // 群组已解散。
    })
    .catch((error: ChatError): void => {
        // 解散失败，根据错误信息处理。
    });
```

## 加入群组

用户可以通过邀请加入群组，也可以主动加入公开群。具体流程由群组的 `isPublic`、`joinApprovalRequired`、`allowInvites` 和 `inviteNeedConfirm` 配置，以及受邀用户是否自动接受群组邀请的设置共同决定。

### 邀请用户入群

群主和群管理员可以调用 `addUsersToGroup` 添加一个或多个用户。对于私有群，普通成员是否可以邀请其他用户由 `allowInvites` 控制：

- `allowInvites = false`：普通成员不能邀请其他用户，只有群主和群管理员可以添加成员。
- `allowInvites = true`：普通成员可调用 `inviteUsers` 邀请其他用户加入群组。

邀请流程如下：

![](/images/harmonyos/goup_member_invite.png)

```typescript
let userIds: string[] = ["user1", "user2"];

// 群主或群管理员添加用户。
ChatClient.getInstance().groupManager()?.addUsersToGroup(
    groupId,
    userIds,
    "Join our group"
).then((group: Group): void => {
    // 操作成功。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误信息处理。
});

// 允许邀请的私有群普通成员发出邀请。
ChatClient.getInstance().groupManager()?.inviteUsers(
    groupId,
    userIds,
    "Join our group"
).then((group: Group): void => {
    // 邀请已发送或成员已加入，具体流程由群组和客户端配置决定。
}).catch((error: ChatError): void => {
    // 邀请失败，根据错误信息处理。
});
```

邀请处理流程由群组的 `inviteNeedConfirm` 和受邀用户客户端的 `ChatOptions#setAutoAcceptGroupInvitations` 共同决定：

- `inviteNeedConfirm = false`：受邀用户无需确认，直接加入群组。此时，受邀用户是否开启自动接受群组邀请不影响结果。
- `inviteNeedConfirm = true` 且受邀用户开启自动接受群组邀请：SDK 自动接受邀请，受邀用户收到 `onAutoAcceptInvitationFromGroup` 事件。
- `inviteNeedConfirm = true` 且受邀用户关闭自动接受群组邀请：受邀用户收到 `onInvitationReceived` 事件，可调用 `acceptInvitation` 或 `declineInvitation` 接受或拒绝邀请。

`setAutoAcceptGroupInvitations` 默认为 `true`。如需由用户手动处理群组邀请，应在 SDK 初始化前将其设置为 `false`：

```typescript
let options: ChatOptions = new ChatOptions({
    appKey: "your-org#your-app"
});
options.setAutoAcceptGroupInvitations(false);

ChatClient.getInstance().init(context, options);
```

受邀用户可以通过已获取的 `Group` 对象调用 `isInviteNeedConfirm()`，查询当前群组是否要求受邀用户确认。为确保配置为最新值，可先调用 `fetchGroupFromServer` 获取群组详情：

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId)
    .then((group: Group): void => {
        let inviteNeedConfirm: boolean = group.isInviteNeedConfirm();
    })
    .catch((error: ChatError): void => {
        // 获取群组详情失败。
    });
```

手动接受或拒绝邀请的示例如下：

```typescript
// 接受群组邀请。
ChatClient.getInstance().groupManager()?.acceptInvitation(groupId)
    .then((group: Group): void => {
        // 已接受邀请并加入群组。
    })
    .catch((error: ChatError): void => {
        // 接受邀请失败。
    });

// 拒绝群组邀请。
ChatClient.getInstance().groupManager()?.declineInvitation(groupId, "No, thanks")
    .then((): void => {
        // 已拒绝邀请。
    })
    .catch((error: ChatError): void => {
        // 拒绝邀请失败。
    });
```

邀请被接受后，邀请人会收到 `onInvitationAccepted` 事件；邀请被拒绝后，邀请人会收到 `onInvitationDeclined` 事件。用户成功加入群组后，即可在该群组中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

![](/images/harmonyos/group_member_apply.png)

具体调用方式由 `joinApprovalRequired` 决定：

- `false`：调用 `joinGroup` 直接加入公开群。
- `true`：调用 `applyJoinToGroup` 提交入群申请，等待群主或群管理员审批。

`joinGroup(groupId, message)` 会先获取群组配置：对于无需审批的公开群，直接加入；对于需要审批的公开群，提交入群申请；对于私有群，返回 `ChatError.INVALID_PARAM`。

```typescript
// 加入公开群。SDK 根据群组配置直接加入或提交申请。
ChatClient.getInstance().groupManager()?.joinGroup(
    groupId,
    "Please approve my request"
).then((group: Group): void => {
    // 无需审批时表示已加入；需要审批时表示申请已提交。
}).catch((error: ChatError): void => {
    // 操作失败，根据错误信息处理。
});

// 明确向需要审批的公开群提交入群申请。
ChatClient.getInstance().groupManager()?.applyJoinToGroup(
    groupId,
    "Please approve my request"
).then((group: Group): void => {
    // 入群申请已提交。
}).catch((error: ChatError): void => {
    // 申请提交失败。
});
```

需要审批时，群主和群管理员会收到 `onRequestToJoinReceived` 事件，并可同意或拒绝申请：

- 申请被同意后，申请人、群主和管理员（除操作者外）会收到 `onRequestToJoinAccepted` 事件。
- 申请被拒绝后，申请人、群主和管理员（除操作者外）会收到 `onRequestToJoinDeclined` 事件。

```typescript
// 群主或群管理员同意入群申请。
ChatClient.getInstance().groupManager()?.acceptApplication(groupId, applicant)
    .then((group: Group): void => {
        // 已同意入群申请。
    })
    .catch((error: ChatError): void => {
        // 操作失败。
    });

// 群主或群管理员拒绝入群申请。
ChatClient.getInstance().groupManager()?.declineApplication(
    groupId,
    applicant,
    "Group is full"
).then((group: Group): void => {
    // 已拒绝入群申请。
}).catch((error: ChatError): void => {
    // 操作失败。
});
```

## 退出群组

### 主动退出

群成员可以调用 `GroupManager#leaveGroup` 主动退出群组。退出后，该用户不再接收群消息，其他群成员会收到 `onMembersExited` 事件。

群主不能直接退出群组。如需退出，应先转让群主身份再退出，或直接解散群组。

```typescript
ChatClient.getInstance().groupManager()?.leaveGroup(groupId)
    .then((): void => {
        // 已退出群组。
    })
    .catch((error: ChatError): void => {
        // 退出失败，根据错误信息处理。
    });
```

退出群组时，SDK 默认删除本地群聊消息，但保留本地群聊会话。如需保留本地消息，应在 SDK 初始化前调用 `ChatOptions#setDeleteMessagesOnLeaveGroup(false)`。详见 [删除会话](conversation_delete.html#功能说明)。

### 移出成员

群主和群管理员可以调用 `removeUsersFromGroup` 将一个或多个成员移出群组。被移出的成员会收到 `onUserRemoved` 事件，其他群成员会收到 `onMembersExited` 事件。用户被移出后仍可按群组规则重新加入。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().groupManager()?.removeUsersFromGroup(groupId, members)
    .then((group: Group): void => {
        // 成员已被移出群组。
    })
    .catch((error: ChatError): void => {
        // 操作失败，根据错误信息处理。
    });
```

## 获取当前用户加入的群组列表

本地数据库打开后，可调用 `GroupManager#getAllGroups` 读取当前用户本地已加入的群组列表。首次调用会从本地数据库加载群组数据，之后从内存读取。

为在登录后获取最新的已加入群组数据，可在初始化 SDK 前调用 `ChatOptions#setDataSyncType` 配置 `DataSyncType.JOINED_GROUPS`：

```typescript
let options: ChatOptions = new ChatOptions({
    appKey: "your-org#your-app"
});
options.setDataSyncType([
    DataSyncType.CONVERSATIONS,
    DataSyncType.JOINED_GROUPS,
]);

ChatClient.getInstance().init(context, options);
```

`DataSyncType` 默认仅包含 `CONVERSATIONS`，不会自动同步已加入群组。登录后，通过 `ConnectionListener#onDataSyncFinish` 监听同步结果；当 `type` 为 `JOINED_GROUPS` 且 `errorCode` 为 `ChatError.EM_NO_ERROR` 时，表示群组数据同步成功。此时可调用 `getAllGroups()` 获取同步后的本地群组列表并刷新页面：

```typescript
let connectionListener: ConnectionListener = {
    onConnected: (): void => {
    },
    onDisconnected: (errorCode: number): void => {
    },
    onDataSyncFinish: (type: DataSyncType, errorCode: number): void => {
        if (type === DataSyncType.JOINED_GROUPS
            && errorCode === ChatError.EM_NO_ERROR) {
            ChatClient.getInstance().groupManager()?.getAllGroups()
                .then((groups: Group[]): void => {
                    // 使用同步后的已加入群组列表刷新页面。
                })
                .catch((error: ChatError): void => {
                    // 读取本地群组列表失败。
                });
        }
    },
};

ChatClient.getInstance().addConnectionListener(connectionListener);
```

如果只需要优先展示本地数据，可监听 `ConnectionListener#onDatabaseOpened`，在当前用户的数据库打开后调用 `getAllGroups()`；如需展示服务端最新数据，再等待 `JOINED_GROUPS` 同步成功后刷新。

## 查询当前用户已加入的群组数量

调用 `GroupManager#fetchJoinedGroupsCount` 从服务器获取当前用户已加入的群组数量。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```typescript
ChatClient.getInstance().groupManager()?.fetchJoinedGroupsCount()
    .then((count: number): void => {
        // 使用 count 更新页面。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误信息处理。
    });
```

## 屏蔽和解除屏蔽群消息

群成员可以屏蔽或解除屏蔽指定群组的消息。屏蔽群消息只影响当前用户是否继续接收该群组的后续消息，不会退出群组，也不会影响其他群成员。

### 屏蔽群消息

调用 `GroupManager#blockGroupMessage` 屏蔽指定群组的消息。群主和群管理员不能执行该操作。

```typescript
ChatClient.getInstance().groupManager()?.blockGroupMessage(groupId)
    .then((group: Group): void => {
        // 已屏蔽该群组的消息。
    })
    .catch((error: ChatError): void => {
        // 屏蔽失败，根据错误信息处理。
    });
```

### 解除屏蔽群消息

调用 `GroupManager#unblockGroupMessage` 解除屏蔽。操作成功后，当前用户可以继续接收该群组的后续消息。

```typescript
ChatClient.getInstance().groupManager()?.unblockGroupMessage(groupId)
    .then((group: Group): void => {
        // 已解除屏蔽该群组的消息。
    })
    .catch((error: ChatError): void => {
        // 解除屏蔽失败，根据错误信息处理。
    });
```

### 检查当前用户是否已屏蔽群消息

先调用 `fetchGroupFromServer` 获取最新群组详情，再通过 `Group#isMsgBlocked` 判断当前用户是否已屏蔽指定群组的消息。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId)
    .then((group: Group): void => {
        let messageBlocked: boolean = group.isMsgBlocked();
    })
    .catch((error: ChatError): void => {
        // 获取群组详情失败。
    });
```

## 监听群组事件

`GroupManager` 提供群组事件监听接口。应用可以通过 `addListener` 注册 `GroupListener`，根据群组事件更新相关 UI。不再使用监听器时，需要调用 `removeListener` 移除同一个监听器实例，避免内存泄漏。

```typescript
// 以下注释中的“当前用户”表示当前登录用户。
let groupListener: GroupListener = {
    // 当前用户收到入群邀请。
    onInvitationReceived: (groupId: string, groupName: string,
        inviter: string, reason: string): void => {
    },

    // 群主和所有群管理员收到入群申请。
    onRequestToJoinReceived: (groupId: string, groupName: string,
        applicant: string, reason: string): void => {
    },

    // 入群申请被同意。申请人、群主和管理员（除操作者外）收到该事件。
    onRequestToJoinAccepted: (groupId: string, groupName: string,
        accepter: string): void => {
    },

    // 入群申请被拒绝。注意 reason 位于 applicant 之前。
     // 申请人、群主和管理员（除操作者外）收到该回调。
    onRequestToJoinDeclined: (groupId: string, groupName: string,
        decliner: string, reason: string, applicant: string): void => {
    },

    // 用户接受入群邀请，邀请人收到该事件。
    onInvitationAccepted: (groupId: string, invitee: string,
        reason: string): void => {
    },

    // 用户拒绝入群邀请，邀请人收到该事件。
    onInvitationDeclined: (groupId: string, invitee: string,
        reason: string): void => {
    },

   // 有成员被移出群组。被移出的成员收到该回调。
    onUserRemoved: (groupId: string, groupName: string): void => {
    },

    // 群组被解散。群主解散群组时，所有群成员收到该回调。
    onGroupDestroyed: (groupId: string, groupName: string): void => {
    },

    // SDK 自动接受群组邀请，受邀用户收到该事件。
    onAutoAcceptInvitationFromGroup: (groupId: string, inviter: string,
        inviteMessage: string): void => {
    },

    // 有成员被加入群禁言列表。
    // 被禁言成员及群主和群管理员（除操作者外）收到该回调。
    onMutelistAdded: (groupId: string, mutes: string[],
        muteExpire: number): void => {
    },

    // 有成员被移出群禁言列表。
    // 被解除禁言成员及群主和群管理员（除操作者外）收到该回调。
    onMutelistRemoved: (groupId: string, mutes: string[]): void => {
    },

    // 有成员被加入群白名单。
    // 被添加成员及群主和群管理员（除操作者外）收到该回调。
    onWhitelistAdded: (groupId: string, whitelist: string[]): void => {
    },

    // 有成员被移出群白名单。
    // 被移出成员及群主和群管理员（除操作者外）收到该回调。
    onWhitelistRemoved: (groupId: string, whitelist: string[]): void => {
    },

    // 全员禁言状态发生变化。群组所有成员（除操作者外）收到该回调。
    onAllMemberMuteStateChanged: (groupId: string,
        isMuted: boolean): void => {
    },

    // 成员被设置为群管理员。群主、新管理员和其他管理员收到该回调。
    onAdminAdded: (groupId: string, administrator: string): void => {
    },

    // 群管理员权限被移除。
    // 被移除的管理员及群主和群管理员（除操作者外）收到该回调。
    onAdminRemoved: (groupId: string, administrator: string): void => {
    },

    // 群主发生变更。群成员收到该回调。
    onOwnerChanged: (groupId: string, newOwner: string,
        oldOwner: string): void => {
    },

    // 一个或多个成员加入群组。除新成员外，其他群成员收到该回调。
    onMembersJoined: (groupId: string, members: string[]): void => {
    },

    // 一个或多个成员主动或被动退出群组。
    // 除退出成员外，其他群成员收到该回调。
    onMembersExited: (groupId: string, members: string[]): void => {
    },

    // 群公告发生变化。群组所有成员收到该回调。
    onAnnouncementChanged: (groupId: string,
        announcement: string): void => {
    },

    // 有成员上传了群共享文件。群组所有成员收到该回调。
    onSharedFileAdded: (groupId: string,
        sharedFile: SharedFile): void => {
    },

    // 群共享文件被删除。群组所有成员收到该回调。
    onSharedFileDeleted: (groupId: string, fileId: string): void => {
    },

    // 群组详情发生变化。群组所有成员收到该回调。
    onSpecificationChanged: (group: Group): void => {
    },

    // 群组禁用状态发生变化。群组所有成员收到该回调。
    onStateChanged: (group: Group, isDisabled: boolean): void => {
    },

    // 群成员自定义属性发生变化。群内其他成员收到该回调。
    onGroupMemberAttributeChanged: (groupId: string, member: string,
        attributes: Map<string, string>, from: string): void => {
    },

    // 群成员名片发生变化。群组其他在线成员收到该回调。
    onUserGroupNamecardUpdated: (groupId: string, userId: string,
        namecard: string): void => {
    },
};

// 注册群组监听器。
ChatClient.getInstance().groupManager()?.addListener(groupListener);

// 页面或组件销毁且不再需要监听时，移除同一个监听器实例。
ChatClient.getInstance().groupManager()?.removeListener(groupListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createGroup`](#创建群组) | `GroupManager` | 创建群组。 |
| [`updateGroupConfigs`](#创建群组) | `GroupManager` | 按指定配置类型更新群组配置。 |
| [`destroyGroup`](#解散群组) | `GroupManager` | 解散群组。 |
| [`addUsersToGroup`](#邀请用户入群) / [`inviteUsers`](#邀请用户入群) | `GroupManager` | 添加或邀请用户加入群组。 |
| [`acceptInvitation`](#邀请用户入群) / [`declineInvitation`](#邀请用户入群) | `GroupManager` | 接受或拒绝群组邀请。 |
| [`isInviteNeedConfirm`](#邀请用户入群) | `Group` | 查询邀请用户入群是否需要对方确认。 |
| [`joinGroup`](#用户申请入群) / [`applyJoinToGroup`](#用户申请入群) | `GroupManager` | 加入公开群或提交入群申请。 |
| [`acceptApplication`](#用户申请入群) / [`declineApplication`](#用户申请入群) | `GroupManager` | 同意或拒绝入群申请。 |
| [`leaveGroup`](#主动退出) | `GroupManager` | 主动退出群组。 |
| [`removeUsersFromGroup`](#移出成员) | `GroupManager` | 将一个或多个成员移出群组。 |
| [`setDataSyncType`](#获取当前用户加入的群组列表) | `ChatOptions` | 配置登录后自动同步已加入群组数据。 |
| [`getAllGroups`](#获取当前用户加入的群组列表) | `GroupManager` | 获取本地已加入群组列表。 |
| [`fetchJoinedGroupsCount`](#查询当前用户已加入的群组数量) | `GroupManager` | 从服务器获取当前用户已加入的群组数量。 |
| [`fetchGroupFromServer`](#检查当前用户是否已屏蔽群消息) | `GroupManager` | 从服务器获取群组详情。 |
| [`isMsgBlocked`](#检查当前用户是否已屏蔽群消息) | `Group` | 判断当前用户是否已屏蔽指定群组消息。 |
| [`blockGroupMessage`](#屏蔽群消息) / [`unblockGroupMessage`](#解除屏蔽群消息) | `GroupManager` | 屏蔽或解除屏蔽群消息。 |
| [`addListener`](#监听群组事件) / [`removeListener`](#监听群组事件) | `GroupManager` | 添加或移除群组事件监听器。 |
