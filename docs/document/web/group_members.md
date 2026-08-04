# 群组成员管理

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用 SDK 管理群组成员，包括入群、邀请、退出、移除成员、查询成员列表、成员属性、群主与管理员、白名单、黑名单和禁言等能力。

## 接口使用方式

SDK 提供 `GroupManager` 管理器和 `Group` 单群对象用于管理群组成员：

- `client.groupManager` 适合处理入群申请、群邀请，以及直接按 `groupId` 操作群成员。
- `client.groupManager.getGroup(groupId)` 可获取绑定指定群组的 `Group` 对象，适合在已知群组 ID 的页面内连续执行成员列表、退出、移除、管理员、禁言、白名单、黑名单和成员属性等操作。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 [SDK 初始化](initialization.html) 并 [登录成功](login.html)。
- 初始化 SDK 时已注册 `GroupManager`，能够通过 `client.groupManager` 调用群组相关接口。
- 当前登录用户已具备执行目标操作所需的群组角色或权限。例如，群主可转让群主、添加或移除管理员；群主和管理员通常可移除成员、管理白名单、黑名单和禁言列表。
- 已了解群组数量、群成员数量、接口调用频率和群成员属性大小等服务限制。详见 [使用限制](/product/limitation.html)。

## 获取群成员列表

先调用 `getGroup` 获取单群对象，再调用 `getMembers` 分页获取群成员列表。返回结果中包含成员用户信息、成员角色和加入群组时间等信息。

```typescript
const group = client.groupManager.getGroup('groupId');

const result = await group.getMembers({
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
  // 每页期望返回的群成员数量，上限取决于服务端，详见 https://doc.easemob.com/document/server-side/group_member_list_obtain.html#请求-url。
  pageSize: 50,
});

console.log(result.items);
console.log(result.cursor);
console.log(result.hasMore);
```

返回结果中，`items` 为当前页的群成员列表。`items` 中的每一项均为 `GroupMemberEntry`，包含如下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `user` | UserInfo | 成员的用户资料。该字段至少包含 `userId`，其他资料字段取决于本地缓存或服务端返回结果。 |
| `role` | String | 该成员在群组中的角色，取值为 `owner`、`admin` 或 `member`。该字段可能为空。 |
| `joinedAt` | Number | 该成员加入群组的时间戳。若服务端未返回加入时间，则该字段不返回。 |

`UserInfo` 的字段说明如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `userId` | String | 用户 ID。 |
| `nickname` | String | 昵称。该字段可能为空。 |
| `avatarUrl` | String | 头像 URL。该字段可能为空。 |
| `mail` | String | 邮箱。该字段可能为空。 |
| `phone` | String | 手机号。该字段可能为空。 |
| `gender` | String/Number/Boolean | 性别或自定义性别标识。该字段可能为空。 |
| `sign` | String | 签名。该字段可能为空。 |
| `birth` | String | 生日。该字段可能为空。 |
| `ext` | String | 扩展字段。该字段可能为空。 |

## 管理群成员自定义属性

群成员属性是群内维度的成员自定义信息，常用于群名片、群内角色展示、部门或业务标签等场景。属性采用 key-value 结构，key 和 value 均为字符串。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 对于单个自定义属性，`key` 不能超过 16 字节，`value` 不能超过 512 字节，否则会报错。
- 群主可以修改所有群成员的自定义属性，其他群成员只能修改自己的自定义属性。

### 设置群成员的自定义属性

调用 `setMemberAttributes` 可设置指定成员在当前群组中的属性。自定义属性采用 key-value 结构；如果将某个属性的 value 设置为空字符串，则表示删除该属性。

- 群主可修改所有群成员的属性，普通成员通常只能修改自己的属性。
- 当前用户只更新自己的群名片属性时，SDK 会使用群名片相关接口处理，并同步更新本地群名片缓存。

设置成功后，群内其他成员会收到 `onGroupMemberAttributeChanged` 事件。该成员的其他设备会收到 `onMultiDeviceGroup` 事件，`operation` 为 `GROUP_MEMBER_METADATA_CHANGED`。

```typescript
await client.groupManager.getGroup('groupId').setMemberAttributes({
  userId: 'user1',
  memberAttributes: {
    groupNamecard: 'Alice',
    roleTag: 'speaker',
  },
});
```

### 获取群成员的自定义属性

调用 `getMembersAttributes` 可批量获取指定成员的群成员属性。`keys` 不传时返回这些成员的全部属性；传入 `keys` 时仅返回指定属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```typescript
const result = await client.groupManager.getGroup('group-1').getMembersAttributes({
  // 每次最多可传 10 个用户 ID。
  userIds: ['user-1', 'user-2', 'user-3'],
  keys: ['department', 'roleTag'],
});

console.log(result.items);

// 例如读取某个成员的属性
const user1Attrs = result.items['user-1'];
console.log('user-1 的部门:', user1Attrs?.department);
console.log('user-1 的角色标签:', user1Attrs?.roleTag);
```

返回结果为按用户 ID 索引的成员属性集合：

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

## 管理群主和群管理员

### 变更群主

仅群主可以调用 `changeOwner` 将群所有权转移给指定群成员。转让成功后，原群主变为普通成员，新群主拥有群主权限，群成员会收到 `onOwnerChanged` 事件。

```typescript
await client.groupManager.getGroup('groupId').changeOwner({
  newOwner: 'user1',
});
```

### 添加群管理员

仅群主可以调用 `addAdmin` 添加群管理员。添加成功后，新管理员及其他管理员会收到 `onAdminAdded` 事件。

群管理员除不能解散群组等少数限制外，拥有群组的大部分管理权限。

```typescript
await client.groupManager.getGroup('groupId').addAdmin({
  userId: 'user1',
});
```

### 移除群管理员

仅群主可以调用 `removeAdmin` 移除群管理员。移除成功后，被移除的管理员及其他管理员会收到 `onAdminRemoved` 事件。

管理员被移出群管理员列表后，仅保留普通群成员权限。

```typescript
await client.groupManager.getGroup('groupId').removeAdmin({
  userId: 'user1',
});
```

### 获取群管理员列表

所有群成员均可调用调用 `getAdmins` 获取当前群组的管理员列表。

```typescript
const admins = await client.groupManager.getGroup('groupId').getAdmins();
console.log(admins);
```

你也可以通过 [获取群组详情](group_attributes.html#获取群组详情) 获取管理员相关信息。

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；但若该成员同时被单独禁言，则单独禁言优先，禁止发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可调用 `addUsersToAllowlist` 将指定成员加入群组白名单。添加成功后，该成员以及群主和群管理员（除操作者外）会收到 `onAllowListAdded` 事件。

即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```typescript
await client.groupManager.getGroup('groupId').addUsersToAllowlist({
  userIds: ['user1'],
});
```

### 从白名单移除成员

群主或管理员可调用 `removeUsersFromAllowlist` 将指定成员移出群组白名单。移出成功后，该成员以及群主和群管理员（除操作者外）会收到 `onAllowListRemoved` 事件。

```typescript
await client.groupManager.getGroup('groupId').removeUsersFromAllowlist({
  userIds: ['user1'],
});
```

### 查询当前用户是否在白名单中

调用 `checkIfInAllowList` 可查询当前登录用户是否在该群白名单中。

```typescript
const inAllowlist = await client.groupManager.getGroup('groupId').checkIfInAllowList();
console.log(inAllowlist);
```

### 获取白名单列表

群主或管理员可调用 `getAllowlist` 获取群组白名单列表。

```typescript
const allowlist = await client.groupManager.getGroup('groupId').getAllowlist();
console.log(allowlist);
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后，会被移出群组，无法继续收发该群消息；只有先从黑名单移除，才可再次申请或被邀请入群。

### 添加成员到黑名单

群主或管理员可调用 `blockMembers` 将指定成员加入群组黑名单。

- 被加入黑名单后，该成员会收到 `onUserRemoved` 事件。
- 默认情况下，其他群成员不会收到该事件通知；如需此类事件通知，请联系商务支持。
- 被加入黑名单的成员会被移出群组，无法继续收发群消息。只有先从黑名单中移除，才可再次申请或被邀请加入群组。

```typescript
await client.groupManager.getGroup('groupId').blockMembers({
  userIds: ['user1'],
});
```

### 从黑名单移除成员

群主或管理员可调用 `unblockMembers` 将指定用户移出群组黑名单。移出黑名单后，该用户可以再次申请加入群组。

```typescript
await client.groupManager.getGroup('groupId').unblockMembers({
  userIds: ['user1'],
});
```

### 获取黑名单列表

群主或管理员可调用 `getBlocklist` 分页获取群组黑名单。

```typescript
const blocklist = await client.groupManager.getGroup('groupId').getBlocklist({
  // 当前页面，从 1 开始。
  pageNum: 1,
  // 每页获取的黑名单用户数。取值范围为 [1,50]，默认值是 20。
  pageSize: 20,
});

console.log(blocklist);
```

## 管理群组禁言

群主和管理员可以对群成员单独禁言，也可以对全员禁言。

这两种禁言方式相互独立，互不影响：
- 单独禁言：将指定用户加入禁言列表。
- 全员禁言：一键禁言群组所有成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

群主或管理员可调用 `muteMembers` 将一个或多个成员加入群组禁言列表。加入禁言列表后，被禁言成员、群管理员和群主（除操作者外）会收到 `onMuteListAdded` 事件。

群成员被加入禁言列表后，将无法发言；即使该成员在群白名单中，也无法发言。

```typescript
await client.groupManager.getGroup('groupId').muteMembers({
  // 被禁言的用户 ID 列表。
  userIds: ['user1'],
  // 禁言时长，单位为秒。传 -1 表示永久禁言。
  muteDuration: 3600,
});
```

### 解除指定成员禁言

群主或管理员可调用 `unmuteMembers` 将一个或多个成员移出群组禁言列表。解除禁言后，被解除禁言的成员、群管理员和群主（除操作者外）会收到 `onMuteListRemoved` 事件。

```typescript
await client.groupManager.getGroup('groupId').unmuteMembers({
  userIds: ['user1'],
});
```

### 查询当前用户是否被禁言

群成员可以调用 `checkIfInMuteList` 可查询当前登录用户是否在该群禁言列表中。

```typescript
const muted = await client.groupManager.getGroup('groupId').checkIfInMuteList();
if (muted) {
  console.log('当前用户已被该群禁言');
} else {
  console.log('当前用户未被该群禁言');
}
```

### 获取禁言列表

群主或管理员可调用 `getMuteList` 分页获取群组禁言列表。

```typescript
const muteList = await client.groupManager.getGroup('groupId').getMuteList({
  // 当前页码，从 1 开始。
  pageNum: 1,
  // 每页返回的禁言成员数。
  pageSize: 20,
});

console.log(muteList);
```

### 开启全员禁言

群主或管理员可调用 `muteAllMembers` 开启全员禁言。全员禁言不会自动到期，如要关闭需主动调用关闭接口。

开启后，群成员会收到 `onAllMemberMuteStateChanged` 事件。除白名单成员外，其他成员将无法发送群消息。

```typescript
await client.groupManager.getGroup('groupId').muteAllMembers();
```

### 关闭全员禁言

群主或管理员可调用 `unmuteAllMembers` 关闭全员禁言。关闭后，群成员会收到 `onAllMemberMuteStateChanged` 事件。

```typescript
await client.groupManager.getGroup('groupId').unmuteAllMembers();
```

## 监听群组成员事件

群组成员相关操作成功后，SDK 会触发对应群组事件，详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `groupId`、`userId` 和 `userIds` 均不能为空；参数非法时 SDK 会抛出参数错误。
- `userIds` 用于批量操作成员，不能为空数组；SDK 会对重复用户 ID 做归一化处理。
- `getMembers` 使用游标分页；`getMuteList` 和 `getBlocklist` 使用页码分页。
- `muteMembers` 和 `unmuteMembers` 的禁言时长参数为 `muteDuration`，单位为秒。
- `checkIfInAllowList` 和 `checkIfInMuteList` 查询的是当前登录用户自身状态，不支持传入其他用户 ID。
- `setMemberAttributes` 的 `memberAttributes` 常用于设置群成员名片。
- 群成员属性参数名为 `memberAttributes`，key 和 value 均应为字符串。
- 管理员、白名单、黑名单和禁言等操作需要当前用户具备群主或群管理员权限；无权限或鉴权失败时 SDK 会抛出错误。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`inviteUsersToGroup`](group_manage.html#邀请用户入群) | `GroupManager` | 邀请一个或多个用户加入群组。 |
| [`acceptInvitation`](group_manage.html#邀请用户入群) | `GroupManager` | 当前用户接受收到的群组邀请。 |
| [`rejectInvitation`](group_manage.html#邀请用户入群) | `GroupManager` | 当前用户拒绝收到的群组邀请。 |
| [`joinGroup`](group_manage.html#用户申请入群) | `GroupManager` | 申请加入或直接加入指定群组。 |
| [`acceptGroupJoinRequest`](group_manage.html#用户申请入群) | `GroupManager` | 群主或管理员同意用户的入群申请。 |
| [`rejectGroupJoinRequest`](group_manage.html#用户申请入群) | `GroupManager` | 群主或管理员拒绝用户的入群申请。 |
| [`getGroup`](#获取群成员列表) | `GroupManager` | 获取绑定指定群组 ID 的 `Group` 单群对象。 |
| [`getMembers`](#获取群成员列表) | `Group` | 通过 `Group` 单群对象分页获取群成员列表。 |
| [`leave`](group_manage.html#主动退出) | `Group` | 当前登录用户主动退出群组。 |
| [`removeMembers`](group_manage.html#移出成员) | `Group` | 通过 `Group` 单群对象移除一个或多个群成员。 |
| [`setMemberAttributes`](#设置群成员的自定义属性) | `Group` | 通过 `Group` 单群对象设置群成员属性。 |
| [`getMembersAttributes`](#获取群成员的自定义属性) | `Group` | 通过 `Group` 单群对象批量获取群成员属性。 |
| [`changeOwner`](#变更群主) | `Group` | 通过 `Group` 单群对象转让群主。 |
| [`addAdmin`](#添加群管理员) | `Group` | 通过 `Group` 单群对象添加群管理员。 |
| [`removeAdmin`](#移除群管理员) | `Group` | 通过 `Group` 单群对象移除群管理员。 |
| [`getAdmins`](#获取群管理员列表) | `Group` | 通过 `Group` 单群对象获取群管理员列表。 |
| [`addUsersToAllowlist`](#添加成员到白名单) | `Group` | 通过 `Group` 单群对象将成员加入白名单。 |
| [`removeUsersFromAllowlist`](#从白名单移除成员) | `Group` | 通过 `Group` 单群对象将成员移出白名单。 |
| [`checkIfInAllowList`](#查询当前用户是否在白名单中) | `Group` | 通过 `Group` 单群对象查询当前用户是否在白名单中。 |
| [`getAllowlist`](#获取白名单列表) | `Group` | 通过 `Group` 单群对象获取群组白名单。 |
| [`blockMembers`](#添加成员到黑名单) | `Group` | 通过 `Group` 单群对象将成员加入群组黑名单。 |
| [`unblockMembers`](#从黑名单移除成员) | `Group` | 通过 `Group` 单群对象将成员移出群组黑名单。 |
| [`getBlocklist`](#获取黑名单列表) | `Group` | 通过 `Group` 单群对象获取群组黑名单。 |
| [`muteMembers`](#禁言指定成员) | `Group` | 通过 `Group` 单群对象禁言指定成员。 |
| [`unmuteMembers`](#解除指定成员禁言) | `Group` | 通过 `Group` 单群对象解除指定成员禁言。 |
| [`checkIfInMuteList`](#查询当前用户是否被禁言) | `Group` | 通过 `Group` 单群对象查询当前用户是否被禁言。 |
| [`getMuteList`](#获取禁言列表) | `Group` | 通过 `Group` 单群对象获取群组禁言列表。 |
| [`muteAllMembers`](#开启全员禁言) | `Group` | 通过 `Group` 单群对象开启全员禁言。 |
| [`unmuteAllMembers`](#关闭全员禁言) | `Group` | 通过 `Group` 单群对象关闭全员禁言。 |
