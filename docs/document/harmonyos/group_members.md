# 群组成员管理

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用 HarmonyOS SDK 管理群组成员，包括查询成员列表、管理成员自定义属性、群主和管理员、白名单、黑名单及禁言等功能。用户入群、退出和移出群组的操作详见 [创建和管理群组](group_manage.html#加入群组)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 [SDK 初始化](initialization.html) 并 [登录成功](login.html)。
- 已了解群成员角色及其权限，详见 [群组概述](group_overview.html)。
- 已了解群成员数量、接口调用频率和群成员属性大小等限制，详见 [使用限制](/product/limitation.html)。

## 获取群成员列表

可通过三种方式获取群成员列表：

- 分页获取群成员信息：通过 `fetchGroupMemberDetails` 从服务器分页获取成员详情。
- 分页获取群成员 ID：通过 `fetchGroupMembers` 从服务器分页获取成员 ID。
- 从本地群组对象获取成员 ID：通过 `Group#getUsers` 读取已获取的 `Group` 对象中的成员 ID。

### 分页获取群成员信息

调用 `GroupManager#fetchGroupMemberDetails` 分页获取群成员信息，返回的成员信息包括群成员的用户 ID、角色、入群时间、群名片、昵称和头像。

```typescript
// 首次请求时 cursor 可传空字符串或省略；后续请求传入上一次结果中的游标。
let cursor: string = "";

ChatClient.getInstance().groupManager()?.fetchGroupMemberDetails(
    groupId,
    50, // pageSize：每页期望返回的群成员数量，上限取决于服务端，详见 https://doc.easemob.com/document/server-side/group_member_list_obtain.html#请求-url。
    cursor
).then((result: CursorResult<GroupMember>): void => {
    let members: GroupMember[] = result.getResult();
    let nextCursor: string = result.getNextCursor();

    for (let member of members) {
        let userId: string = member.memberId;
        let joinedAt: number = member.joinTime;
        let role: GroupPermissionType = member.role;
        let namecard: string = member.namecard;
        let nickname: string = member.nickname;
        let avatarUrl: string = member.avatarUrl;
    }

    // nextCursor 为空字符串表示已到最后一页。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

`GroupMember` 的主要属性如下：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `memberId` | `string` | 群成员的用户 ID。 |
| `joinTime` | `number` | 入群时间，Unix 时间戳，单位为毫秒。 |
| `role` | `GroupPermissionType` | 成员角色：`OWNER`、`ADMIN`、`MEMBER` 或 `NONE`。 |
| `namecard` | `string` | 群成员名片。 |
| `nickname` | `string` | 群成员昵称。 |
| `avatarUrl` | `string` | 群成员头像 URL。 |

### 分页获取群成员 ID

如果只需要群成员用户 ID，可以调用 `GroupManager#fetchGroupMembers` 分页获取：

```typescript
let cursor: string = "";

ChatClient.getInstance().groupManager()?.fetchGroupMembers(
    groupId,
    50,
    cursor
).then((result: CursorResult<string>): void => {
    let userIds: string[] = result.getResult();
    let nextCursor: string = result.getNextCursor();
    // nextCursor 为空字符串表示已到最后一页。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

### 从本地群组对象获取成员 ID

如已获取 `Group` 对象，可调用 `Group#getUsers` 获取该对象中包含的全部成员用户 ID。该方法按群主、管理员和普通成员的顺序合并本地数据，返回列表中可能包含重复的用户 ID，业务侧可按需去重：

```typescript
let userIds: string[] = group.getUsers();
```

## 管理群成员自定义属性

群成员自定义属性是群组维度的成员信息，适用于业务标签等场景，采用字符串 key-value 结构。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 单个属性的 key 不能超过 16 字节，value 不能超过 512 字节。
- 群主可以修改所有群成员的属性，其他群成员只能修改自己的属性。

### 设置群成员的自定义属性

调用 `GroupManager#setMemberAttributes` 设置指定成员的属性。将某个 key 对应的 value 设置为空字符串表示删除该属性。设置成功后，群内其他成员会收到 `GroupListener#onGroupMemberAttributeChanged` 事件。

```typescript
let attributes: Map<string, string> = new Map<string, string>();
attributes.set("department", "product");
attributes.set("roleTag", "speaker");

ChatClient.getInstance().groupManager()?.setMemberAttributes(
    groupId,
    userId,
    attributes
).then((): void => {
    // 设置成功。
}).catch((error: ChatError): void => {
    // 设置失败，根据错误码和错误信息处理。
});
```

### 获取单个群成员的自定义属性

调用 `GroupManager#fetchMemberAttributes` 获取指定群成员的全部自定义属性。该方法返回 `Map<string, string>`，其中 key 为属性名称，value 为属性值。

若该成员未设置自定义属性，返回的 `Map` 为空，业务侧应按需处理。

```typescript
ChatClient.getInstance().groupManager()?.fetchMemberAttributes(
    groupId,
    userId
).then((attributes: Map<string, string>): void => {
    let department: string | undefined = attributes.get("department");
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

### 根据属性 key 获取群成员自定义属性

调用 `GroupManager#fetchMembersAttributes` 可以按属性 key 批量获取多个群成员的属性。`keys` 为空数组或省略时，返回这些成员的全部属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```typescript
let userIds: string[] = ["user1", "user2"];
let keys: string[] = ["department", "roleTag"];

ChatClient.getInstance().groupManager()?.fetchMembersAttributes(
    groupId,
    userIds,
    keys
).then((result: Map<string, Map<string, string>>): void => {
    let user1Attributes: Map<string, string> | undefined = result.get("user1");
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

## 管理群主和群管理员

### 变更群主

仅群主可以调用 `GroupManager#changeOwner` 将群所有权转让给指定群成员。转让成功后，原群主变为普通成员，新群主拥有群主权限，群成员会收到 `GroupListener#onOwnerChanged` 事件。

```typescript
ChatClient.getInstance().groupManager()?.changeOwner(
    groupId,
    newOwner
).then((group: Group): void => {
    // 群主变更成功。
}).catch((error: ChatError): void => {
    // 变更失败，根据错误码和错误信息处理。
});
```

### 添加群管理员

仅群主可以调用 `GroupManager#addGroupAdmin` 添加群管理员。添加成功后，新管理员、群主及其他管理员会收到 `GroupListener#onAdminAdded` 事件。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分管理权限。

```typescript
ChatClient.getInstance().groupManager()?.addGroupAdmin(
    groupId,
    userId
).then((group: Group): void => {
    // 管理员添加成功。
}).catch((error: ChatError): void => {
    // 添加失败，根据错误码和错误信息处理。
});
```

### 移除群管理员

仅群主可以调用 `GroupManager#removeGroupAdmin` 移除群管理员。移除成功后，被移除的管理员、群主及其他管理员会收到 `GroupListener#onAdminRemoved` 事件。

群管理员被移除管理权限后将只拥有普通群成员的权限。

```typescript
ChatClient.getInstance().groupManager()?.removeGroupAdmin(
    groupId,
    userId
).then((group: Group): void => {
    // 管理员移除成功。
}).catch((error: ChatError): void => {
    // 移除失败，根据错误码和错误信息处理。
});
```

### 获取群管理员列表

通过 `Group#adminList` 获取群组管理员列表。若需要最新数据，应先调用 [获取群组详情的方法 `fetchGroupFromServer`](group_attributes.html#获取群组详情) 刷新群组详情。

```typescript
let adminList: string[] = group.adminList();
```

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和群管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；如果该成员同时被单独禁言，则单独禁言优先，该成员仍不能发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可以调用 `GroupManager#addToGroupWhitelist` 将指定成员加入群白名单。添加成功后，被添加的成员、群主和群管理员（除操作者外）会收到 `GroupListener#onWhitelistAdded` 事件。

即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().groupManager()?.addToGroupWhitelist(
    groupId,
    members
).then((): void => {
    // 添加成功。
}).catch((error: ChatError): void => {
    // 添加失败，根据错误码和错误信息处理。
});
```

### 从白名单移除成员

仅群主或群管理员可以调用 `GroupManager#removeFromGroupWhitelist` 将指定成员移出群白名单。移除成功后，被移除的成员、群主和群管理员（除操作者外）会收到 `GroupListener#onWhitelistRemoved` 事件。

```typescript
ChatClient.getInstance().groupManager()?.removeFromGroupWhitelist(
    groupId,
    members
).then((): void => {
    // 移除成功。
}).catch((error: ChatError): void => {
    // 移除失败，根据错误码和错误信息处理。
});
```

### 查询当前用户是否在白名单中

群成员可以调用 `GroupManager#checkIfInGroupWhitelist` 查询当前登录用户是否在群白名单中。

```typescript
ChatClient.getInstance().groupManager()?.checkIfInGroupWhitelist(groupId)
    .then((inWhitelist: boolean): void => {
        // inWhitelist 为 true 表示当前用户在白名单中。
    })
    .catch((error: ChatError): void => {
        // 查询失败，根据错误码和错误信息处理。
    });
```

### 获取白名单列表

仅群主或群管理员可以调用 `GroupManager#fetchGroupWhitelist` 从服务器获取当前群组的白名单。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupWhitelist(groupId)
    .then((members: string[]): void => {
        // 获取成功。
    })
    .catch((error: ChatError): void => {
        // 获取失败，根据错误码和错误信息处理。
    });
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后会被移出群组，无法继续收发该群消息；只有先从黑名单中移除，才可再次申请或被邀请加入。

### 添加成员到黑名单

仅群主或群管理员可以调用 `GroupManager#blockUsers` 将一个或多个成员加入群黑名单。被加入黑名单的成员会收到 `GroupListener#onUserRemoved` 事件。默认情况下，其他群成员不会收到成员退出事件通知；如需该事件，请联系商务开通。

```typescript
let members: string[] = ["user1", "user2"];

ChatClient.getInstance().groupManager()?.blockUsers(
    groupId,
    members,
    "violation"
).then((group: Group): void => {
    // 添加成功。
}).catch((error: ChatError): void => {
    // 添加失败，根据错误码和错误信息处理。
});
```

### 从黑名单移除成员

仅群主或群管理员可以调用 `GroupManager#unblockUsers` 将一个或多个用户移出群黑名单。移除后，用户可以再次申请或被邀请加入群组。

```typescript
ChatClient.getInstance().groupManager()?.unblockUsers(
    groupId,
    members
).then((group: Group): void => {
    // 移除成功。
}).catch((error: ChatError): void => {
    // 移除失败，根据错误码和错误信息处理。
});
```

### 获取黑名单列表

仅群主或群管理员可以调用 `GroupManager#fetchGroupBlocklist` 分页获取黑名单成员列表。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupBlocklist(
    groupId,
    1,  // pageNum：当前页码，从 1 开始。
    20  // pageSize：每页返回的黑名单成员数。
).then((members: string[]): void => {
    // 获取成功。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

## 管理群组禁言

群主和群管理员可以对指定成员单独禁言，也可以开启全员禁言。这两种禁言方式相互独立：

- 单独禁言：将指定用户加入禁言列表。被禁言成员不能发送群消息，禁言时长的单位为毫秒。
- 全员禁言：禁言群组所有普通成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

仅群主或群管理员可以调用 `GroupManager#muteGroupMembers` 禁言指定成员。禁言成功后，被禁言成员、群主和群管理员（除操作者外）会收到 `GroupListener#onMutelistAdded` 事件。

```typescript
let members: string[] = ["user1", "user2"];
// duration 的单位为毫秒，传入 -1 表示永久禁言。
let duration: number = 60 * 60 * 1000;

ChatClient.getInstance().groupManager()?.muteGroupMembers(
    groupId,
    members,
    duration
).then((group: Group): void => {
    // 禁言成功。
}).catch((error: ChatError): void => {
    // 禁言失败，根据错误码和错误信息处理。
});
```

### 解除指定成员禁言

仅群主或群管理员可以调用 `GroupManager#unmuteGroupMembers` 解除指定成员禁言。解除成功后，被解除禁言的成员、群主和群管理员（除操作者外）会收到 `GroupListener#onMutelistRemoved` 事件。

```typescript
ChatClient.getInstance().groupManager()?.unmuteGroupMembers(
    groupId,
    members
).then((group: Group): void => {
    // 解除禁言成功。
}).catch((error: ChatError): void => {
    // 解除禁言失败，根据错误码和错误信息处理。
});
```

### 查询当前用户是否被禁言

群成员可以调用 `GroupManager#checkIfInGroupMutelist` 查询当前登录用户是否在群禁言列表中。

```typescript
ChatClient.getInstance().groupManager()?.checkIfInGroupMutelist(groupId)
    .then((muted: boolean): void => {
        // muted 为 true 表示当前用户已被禁言。
    })
    .catch((error: ChatError): void => {
        // 查询失败，根据错误码和错误信息处理。
    });
```

### 获取禁言列表

仅群主或群管理员可以调用 `GroupManager#fetchGroupMutelist` 分页获取禁言列表。返回 `Map` 的 `key` 为成员 ID，`value` 为禁言时长，单位为毫秒。

```typescript
ChatClient.getInstance().groupManager()?.fetchGroupMutelist(
    groupId,
    1,  // pageNum：当前页码，从 1 开始。
    20  // pageSize：每页返回的禁言成员数。
).then((muteList: Map<string, number>): void => {
    // 获取成功。
}).catch((error: ChatError): void => {
    // 获取失败，根据错误码和错误信息处理。
});
```

### 开启全员禁言

仅群主或群管理员可以调用 `GroupManager#muteAllMembers` 开启全员禁言。开启后，群成员会收到 `GroupListener#onAllMemberMuteStateChanged` 事件。除白名单成员外，其他普通成员将无法发送群消息。

全员禁言不会自动到期，如要关闭需主动调用关闭接口。

```typescript
ChatClient.getInstance().groupManager()?.muteAllMembers(groupId)
    .then((group: Group): void => {
        // 全员禁言已开启。
    })
    .catch((error: ChatError): void => {
        // 操作失败，根据错误码和错误信息处理。
    });
```

### 关闭全员禁言

仅群主或群管理员可以调用 `GroupManager#unmuteAllMembers` 关闭全员禁言。关闭后，群成员会收到 `GroupListener#onAllMemberMuteStateChanged` 事件。

```typescript
ChatClient.getInstance().groupManager()?.unmuteAllMembers(groupId)
    .then((group: Group): void => {
        // 全员禁言已关闭。
    })
    .catch((error: ChatError): void => {
        // 操作失败，根据错误码和错误信息处理。
    });
```

## 监听群组成员事件

群组成员相关操作成功后，SDK 会触发对应的 `GroupListener` 事件。监听器的注册、移除及完整事件说明详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `groupId`、`userId` 和成员列表不能为空；参数无效时，Promise 会抛出 `ChatError`。
- `fetchGroupMemberDetails` 和 `fetchGroupMembers` 使用游标分页，参数顺序为 `groupId`、`pageSize`、`cursor`；禁言列表和黑名单使用页码分页，页码从 `1` 开始。
- `muteGroupMembers` 的禁言时长单位为毫秒，`-1` 表示永久禁言。
- `checkIfInGroupWhitelist` 和 `checkIfInGroupMutelist` 仅查询当前登录用户自身的状态，不能指定其他用户。
- 管理员、白名单、黑名单和禁言操作要求当前用户具备相应权限。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchGroupMemberDetails`](#分页获取群成员信息) | `GroupManager` | 分页获取包含角色、入群时间和资料的群成员信息。 |
| [`fetchGroupMembers`](#分页获取群成员-id) | `GroupManager` | 分页获取群成员用户 ID。 |
| [`getUsers`](#从本地群组对象获取成员-id) | `Group` | 获取群组对象中包含的群主、管理员和普通成员的用户 ID 列表。 |
| [`setMemberAttributes`](#设置群成员的自定义属性) | `GroupManager` | 设置群成员自定义属性。 |
| [`fetchMemberAttributes`](#获取单个群成员的自定义属性) | `GroupManager` | 获取单个群成员的全部自定义属性。 |
| [`fetchMembersAttributes`](#根据属性-key-获取群成员自定义属性) | `GroupManager` | 获取多个群成员的指定或全部自定义属性。 |
| [`changeOwner`](#变更群主) | `GroupManager` | 转让群主权限。 |
| [`addGroupAdmin`](#添加群管理员) / [`removeGroupAdmin`](#移除群管理员) | `GroupManager` | 添加或移除群管理员。 |
| [`fetchGroupFromServer`](#获取群管理员列表) | `GroupManager` | 从服务器获取最新群组详情。 |
| [`adminList`](#获取群管理员列表) | `Group` | 获取群管理员列表。 |
| [`addToGroupWhitelist`](#添加成员到白名单) / [`removeFromGroupWhitelist`](#从白名单移除成员) | `GroupManager` | 添加或移除群白名单成员。 |
| [`checkIfInGroupWhitelist`](#查询当前用户是否在白名单中) / [`fetchGroupWhitelist`](#获取白名单列表) | `GroupManager` | 查询当前用户是否在白名单中或获取白名单。 |
| [`blockUsers`](#添加成员到黑名单) / [`unblockUsers`](#从黑名单移除成员) | `GroupManager` | 添加或移除群黑名单成员。 |
| [`fetchGroupBlocklist`](#获取黑名单列表) | `GroupManager` | 分页获取群黑名单。 |
| [`muteGroupMembers`](#禁言指定成员) / [`unmuteGroupMembers`](#解除指定成员禁言) | `GroupManager` | 禁言或解除禁言指定成员。 |
| [`checkIfInGroupMutelist`](#查询当前用户是否被禁言) / [`fetchGroupMutelist`](#获取禁言列表) | `GroupManager` | 查询当前用户是否被禁言或分页获取禁言列表。 |
| [`muteAllMembers`](#开启全员禁言) / [`unmuteAllMembers`](#关闭全员禁言) | `GroupManager` | 开启或关闭全员禁言。 |
