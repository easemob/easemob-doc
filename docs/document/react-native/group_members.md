# 群组成员管理

## 功能说明

群组是支持多人实时沟通的即时通讯场景。本文介绍如何使用 React Native SDK 管理群组成员，包括查询成员列表、管理成员自定义属性、群主和管理员、白名单、黑名单及禁言等功能。用户入群、退出和移出群组的操作详见 [创建和管理群组](group_manage.html#加入群组)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 [SDK 初始化](initialization.html) 并 [登录成功](login.html)。
- 已了解群成员角色及其权限，详见 [群组概述](group_overview.html)。
- 已了解群成员数量、接口调用频率和群成员属性大小等限制，详见[使用限制](/product/limitation.html)。

## 获取群成员列表

可通过三种方式获取群成员列表：

- 分页获取群成员信息：通过 `ChatGroupManager#fetchMemberInfoListFromServer` 从服务器分页获取成员详情。
- 分页获取群成员 ID：通过 `ChatGroupManager#fetchMemberListFromServer` 从服务器分页获取成员 ID。
- 从本地群组对象获取成员 ID：通过已获取的 `ChatGroup` 对象中的 `owner`、`adminList` 和 `memberList` 读取本地已知的成员 ID。

### 分页获取群成员信息

调用 `ChatGroupManager#fetchMemberInfoListFromServer` 分页获取群成员信息，返回的成员信息包括群成员的用户 ID、角色、入群时间和群名片。

`nickname` 和 `avatarUrl` 为可选字段。初始化时将 `ChatOptions.enableUserInfo` 设为 `true`（默认为 `false`）后，SDK 会尝试补充成员的昵称和头像。获取群成员基本信息和群成员名片本身不要求开启该功能。

```typescript
try {
  // cursor：首次请求传空字符串；后续传入上一次结果中的游标
  // 当返回的游标为空时，表示已到最后一页
  const cursor = '';
  // limit：每页期望返回的群成员数量，默认 200，上限取决于服务端，详见 [获取群成员列表](/document/server-side/group_member_list_obtain.html#请求-url)。
  const result = await ChatClient.getInstance().groupManager
    .fetchMemberInfoListFromServer(groupId, cursor, 50);
  const members = result.list ?? [];
  const nextCursor = result.cursor;

  for (const member of members) {
    const userId = member.memberId;
    const joinedAt = member.joinedTimestamp;
    const role = member.role;
    const namecard = member.namecard;
    const nickname = member.nickname;
    const avatarUrl = member.avatarUrl;
  }
} catch (error: unknown) {
  console.error('获取群成员信息失败：', error);
}
```

`ChatGroupMember` 的主要属性如下：

| 属性 | 类型 | 描述 |
| :--- | :--- | :--- |
| `memberId` | `string` | 群成员的用户 ID。 |
| `joinedTimestamp` | `number` | 入群时间，Unix 时间戳，单位为毫秒。 |
| `role` | `ChatGroupPermissionType` | 成员角色：`Owner`、`Admin`、`Member` 或 `None`。 |
| `namecard` | `string \| undefined` | 群成员名片。 |
| `nickname` | `string \| undefined` | 群成员昵称。 |
| `avatarUrl` | `string \| undefined` | 群成员头像 URL。 |

### 分页获取群成员 ID

如果只需要群成员用户 ID，也可以调用 `ChatGroupManager#fetchMemberListFromServer` 分页获取。

```typescript
try {
  // cursor：首次请求传空字符串；后续传入上一次结果中的游标
  // 当返回的游标为空时，表示已到最后一页
  // pageSize：每页获取的群成员 ID 数量，默认为 200。
  const result = await ChatClient.getInstance().groupManager
    .fetchMemberListFromServer(groupId, 50, '');
  const userIds = result.list ?? [];
  const nextCursor = result.cursor;
} catch (error: unknown) {
  console.error('获取群成员 ID 失败：', error);
}
```

### 从本地群组对象获取成员 ID

如已获取 `ChatGroup` 对象，可通过 `owner`、`adminList` 和 `memberList` 分别读取群主、管理员和普通成员的用户 ID。需要完整名单时应使用 [服务端分页接口](#分页获取群成员-id)。

```typescript
// group 为已获取的 ChatGroup 对象，以下字段仅表示本地已知的数据
const ownerId = group.owner;
const adminIds = group.adminList;
const memberIds = group.memberList;
```

## 管理群成员自定义属性

群成员自定义属性是群组维度的成员信息，适用于业务标签等场景，采用字符串 key-value 结构。

- 单个群成员的自定义属性总长度不能超过 4 KB。
- 单个属性的 key 不能超过 16 字节，value 不能超过 512 字节。
- 群主可以修改所有群成员的属性，其他群成员只能修改自己的属性。

### 设置群成员的自定义属性

调用 `ChatGroupManager#setMemberAttribute` 设置指定成员的属性。将某个 key 对应的 value 设置为空字符串表示删除该属性。设置成功后，群内其他成员会收到 `ChatGroupEventListener#onMemberAttributesChanged` 回调。

```typescript
const attributes: Record<string, string> = {
  department: 'product',
  roleTag: 'speaker',
};

try {
  // 设置指定群成员的自定义属性
  await ChatClient.getInstance().groupManager
    .setMemberAttribute(groupId, userId, attributes);
} catch (error: unknown) {
  console.error('设置群成员属性失败：', error);
}
```

### 获取单个群成员的自定义属性

调用 `ChatGroupManager#fetchMemberAttributes` 获取指定群成员的全部自定义属性。成功时，返回 `Record<string, string> | undefined`，即该成员的属性键值对，不包含成员用户 ID 外层。

若该成员未设置自定义属性，返回结果可能为 `undefined` 或空对象；业务侧应按需判空处理。

```typescript
try {
  // 获取指定群成员的全部自定义属性
  const attributes = await ChatClient.getInstance().groupManager
    .fetchMemberAttributes(groupId, userId);
} catch (error: unknown) {
  console.error('获取群成员属性失败：', error);
}
```

### 根据属性 key 获取群成员自定义属性

调用 `ChatGroupManager#fetchMembersAttributes` 可以按属性 key 批量获取多个群成员的属性。`attributeKeys` 省略或为空数组时，返回这些成员的全部属性。返回结果为 `Map<string, Record<string, string>>`，通过 `result.get(userId)` 读取指定成员的属性。

:::tip
每次最多可获取 10 个群成员的自定义属性。
:::

```typescript
const userIds = ['user1', 'user2'];
const attributeKeys = ['department', 'roleTag'];

try {
  // attributeKeys：要获取自定义属性的 key 的数组，传空数组或省略则获取这些成员的所有属性
  const result = await ChatClient.getInstance().groupManager
    .fetchMembersAttributes(groupId, userIds, attributeKeys);
} catch (error: unknown) {
  console.error('批量获取群成员属性失败：', error);
}
```

## 管理群主和群管理员

### 变更群主

仅群主可以调用 `ChatGroupManager#changeOwner` 将群所有权转让给指定群成员。转让成功后，原群主变为普通成员，新群主拥有群主权限，群成员会收到 `onOwnerChanged` 回调。

```typescript
try {
  // 将群所有权转让给指定群成员
  await ChatClient.getInstance().groupManager
    .changeOwner(groupId, newOwner);
} catch (error: unknown) {
  console.error('转让群主失败：', error);
}
```

### 添加群管理员

仅群主可以调用 `ChatGroupManager#addAdmin` 添加群管理员。添加成功后，新管理员、群主及其他管理员会收到 `onAdminAdded` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分管理权限。

```typescript
try {
  // 添加群管理员
  await ChatClient.getInstance().groupManager
    .addAdmin(groupId, userId);
} catch (error: unknown) {
  console.error('添加群管理员失败：', error);
}
```

### 移除群管理员

仅群主可以调用 `ChatGroupManager#removeAdmin` 移除群管理员。移除成功后，被移除的管理员、群主及其他管理员会收到 `onAdminRemoved` 回调。

群管理员被移除群管理权限后将只拥有普通群成员的权限。

```typescript
try {
  // 移除群管理员
  await ChatClient.getInstance().groupManager
    .removeAdmin(groupId, userId);
} catch (error: unknown) {
  console.error('移除群管理员失败：', error);
}
```

### 获取群管理员列表

通过 `ChatGroup.adminList` 获取群组管理员列表。若需要最新数据，应先调用 [获取群组详情的方法 `ChatGroupManager#fetchGroupInfoWithoutMembersFromServer`](group_attributes.html#获取群组详情) 刷新群详情。

```typescript
// 获取内存中管理员列表
const adminList = group.adminList;
```

## 管理群组白名单

群组白名单用于控制全员禁言场景下仍可发言的成员。群主和群管理员默认属于白名单。

:::tip
全员禁言和单独禁言相互独立。全员禁言时，白名单成员仍可发送群消息；如果该成员同时被单独禁言，则单独禁言优先，该成员仍不能发送群消息。
:::

### 添加成员到白名单

仅群主或群管理员可以调用 `ChatGroupManager#addAllowList` 将指定成员加入群白名单。添加成功后，该成员以及群主和群管理员（除操作者外）会收到 `ChatGroupEventListener#onAllowListAdded` 回调。
即使开启了全员禁言，白名单中的成员仍可发送群消息；但如果某个成员同时在禁言列表中，则无法发送群消息。

```typescript
const members = ['user1', 'user2'];

try {
  // 将指定成员加入群白名单
  await ChatClient.getInstance().groupManager
    .addAllowList(groupId, members);
} catch (error: unknown) {
  console.error('添加白名单失败：', error);
}
```

### 从白名单移除成员

仅群主或群管理员可以调用 `ChatGroupManager#removeAllowList` 将指定成员移出群白名单。群成员被移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到 `ChatGroupEventListener#onAllowListRemoved` 回调。

```typescript
try {
  // 将指定成员移出群白名单
  await ChatClient.getInstance().groupManager
    .removeAllowList(groupId, members);
} catch (error: unknown) {
  console.error('移除白名单失败：', error);
}
```
// TODO：等待研发确认
:::notice
React Native SDK 5.0.0 在 Android 端的白名单变更回调中无法正确返回 `members`。请将 `ChatGroupEventListener#onAllowListAdded` 和 `ChatGroupEventListener#onAllowListRemoved` 作为变更通知，按需重新查询白名单；iOS 端可正常读取该字段。
:::

### 查询当前用户是否在白名单中

所有群成员均可调用 `ChatGroupManager#isMemberInAllowListFromServer` 查询当前登录用户是否在群白名单中。

```typescript
try {
  // 查询当前登录用户是否在群白名单中
  const inAllowList = await ChatClient.getInstance().groupManager
    .isMemberInAllowListFromServer(groupId);
} catch (error: unknown) {
  console.error('查询白名单状态失败：', error);
}
```

### 获取白名单列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchAllowListFromServer` 方法从服务器获取当前群组的白名单。

```typescript
try {
  // 从服务器获取当前群组的白名单
  const members = await ChatClient.getInstance().groupManager
    .fetchAllowListFromServer(groupId);
} catch (error: unknown) {
  console.error('获取白名单失败：', error);
}
```

## 管理群组黑名单

群组黑名单用于禁止指定用户加入或继续留在群组。成员被加入黑名单后会被移出群组，无法继续收发该群消息；只有先从黑名单中移除，才可再次申请或被邀请加入。

### 添加成员到黑名单

仅群主或群管理员可以调用 `ChatGroupManager#blockMembers` 将一个或多个成员加入群黑名单。被加入黑名单的成员会收到 `ChatGroupEventListener#onMemberRemoved` 回调。默认情况下，其他群成员不会收到事件通知。如需该事件，请联系商务开通。

黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

```typescript
const members = ['user1', 'user2'];

try {
  // 将指定成员加入群黑名单
  await ChatClient.getInstance().groupManager
    .blockMembers(groupId, members);
} catch (error: unknown) {
  console.error('添加黑名单失败：', error);
}
```

### 从黑名单移除成员

仅群主或群管理员可以调用 `ChatGroupManager#unblockMembers` 将一个或多个用户移出群黑名单。移除后，用户可以再次申请或被邀请加入群组。

```typescript
try {
  // 将指定用户移出群黑名单
  await ChatClient.getInstance().groupManager
    .unblockMembers(groupId, members);
} catch (error: unknown) {
  console.error('移除黑名单失败：', error);
}
```

### 获取黑名单列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchBlockListFromServer` 分页获取黑名单成员列表。

```typescript
try {
  // pageSize 为每页黑名单用户数量，默认为 200；pageNum 从 1 开始。
  const members = await ChatClient.getInstance().groupManager
    .fetchBlockListFromServer(groupId, 20, 1);
} catch (error: unknown) {
  console.error('获取黑名单失败：', error);
}
```

## 管理群组禁言

群主和管理员可以对群成员单独禁言，也可以对全员禁言。这两种禁言方式相互独立，互不影响：
- 单独禁言：将指定用户加入禁言列表。被禁言成员不能发送群消息。禁言时长的单位为毫秒。
- 全员禁言：一键禁言群组所有成员。白名单成员可发言；若成员同时被单独禁言，则单独禁言优先，禁止发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

仅群主或群管理员可以调用 `ChatGroupManager#muteMembers` 禁言指定成员。`duration` 默认为 `-1`，表示永久禁言。加入禁言列表后，被禁言成员、群管理员和群主（除操作者外）会收到 `onMuteListAdded` 回调。

```typescript
const members = ['user1', 'user2'];
// duration 的单位为毫秒，传入 -1 表示永久禁言
const duration = 60 * 60 * 1000;

try {
  // 禁言指定成员
  await ChatClient.getInstance().groupManager
    .muteMembers(groupId, members, duration);
} catch (error: unknown) {
  console.error('禁言成员失败：', error);
}
```

### 解除指定成员禁言

仅群主或群管理员可以调用 `ChatGroupManager#unMuteMembers` 解除指定成员禁言。解除禁言后，被解除禁言的成员、群管理员和群主（除操作者外）会收到 `onMuteListRemoved` 回调。

```typescript
try {
  // 解除指定成员禁言
  await ChatClient.getInstance().groupManager
    .unMuteMembers(groupId, members);
} catch (error: unknown) {
  console.error('解除禁言失败：', error);
}
```

### 获取禁言列表

仅群主或群管理员可以调用 `ChatGroupManager#fetchMuteListFromServer` 分页获取禁言列表。返回成员 ID 数组，不包含禁言时长或到期时间。

```typescript
try {
  // pageSize 为每页禁言用户的数量，默认为 200；pageNum 从 1 开始
  const muteList = await ChatClient.getInstance().groupManager
    .fetchMuteListFromServer(groupId, 20, 1);
} catch (error: unknown) {
  console.error('获取禁言列表失败：', error);
}
```

### 开启全员禁言

仅群主或群管理员可以调用 `ChatGroupManager#muteAllMembers` 开启全员禁言。开启后，群成员会收到 `ChatGroupEventListener#onAllGroupMemberMuteStateChanged` 回调。除白名单成员外，其他成员将无法发送群消息。

全员禁言不会自动到期，如要关闭需主动调用关闭接口。

```typescript
try {
  // 开启全员禁言
  await ChatClient.getInstance().groupManager
    .muteAllMembers(groupId);
} catch (error: unknown) {
  console.error('开启全员禁言失败：', error);
}
```

### 关闭全员禁言

仅群主或群管理员可以调用 `ChatGroupManager#unMuteAllMembers` 关闭全员禁言。关闭后，群成员会收到 `ChatGroupEventListener#onAllGroupMemberMuteStateChanged` 回调。

```typescript
try {
  // 关闭全员禁言
  await ChatClient.getInstance().groupManager
    .unMuteAllMembers(groupId);
} catch (error: unknown) {
  console.error('关闭全员禁言失败：', error);
}
```

## 监听群组成员事件

群组成员相关操作成功后，SDK 会触发对应的 `ChatGroupEventListener` 回调。监听器的注册、移除及完整事件说明详见 [监听群组事件](group_manage.html#监听群组事件)。

## 注意事项

- `groupId`、`userId` 和成员列表不能为空；参数无效时，SDK 会通过 Promise 返回错误。
- `ChatGroupManager#fetchMemberInfoListFromServer` 和 `ChatGroupManager#fetchMemberListFromServer` 使用游标分页；禁言列表和黑名单使用页码分页，页码从 `1` 开始。
- `ChatGroupManager#muteMembers` 的禁言时长单位为毫秒，`-1` 表示永久禁言。
- `ChatGroupManager#isMemberInAllowListFromServer` 仅查询当前登录用户自身的状态，不能指定其他用户。
- 管理员、白名单、黑名单和禁言操作要求当前用户具备相应权限。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatGroupManager#fetchMemberInfoListFromServer`](#分页获取群成员信息) | `ChatGroupManager` | 分页获取包含角色、入群时间和资料的群成员信息。 |
| [`ChatGroupManager#fetchMemberListFromServer`](#分页获取群成员-id) | `ChatGroupManager` | 分页获取群成员用户 ID。 |
| [`owner`](#从本地群组对象获取成员-id) / [`adminList`](#从本地群组对象获取成员-id) / [`memberList`](#从本地群组对象获取成员-id) | `ChatGroup` | 本地已知的群主、管理员和普通成员用户 ID。 |
| [`ChatGroupManager#setMemberAttribute`](#设置群成员的自定义属性) | `ChatGroupManager` | 设置群成员自定义属性。 |
| [`ChatGroupManager#fetchMemberAttributes`](#获取单个群成员的自定义属性) | `ChatGroupManager` | 获取单个群成员的全部自定义属性。 |
| [`ChatGroupManager#fetchMembersAttributes`](#根据属性-key-获取群成员自定义属性) | `ChatGroupManager` | 获取多个群成员的指定或全部自定义属性。 |
| [`ChatGroupManager#changeOwner`](#变更群主) | `ChatGroupManager` | 转让群主权限。 |
| [`ChatGroupManager#addAdmin`](#添加群管理员) / [`ChatGroupManager#removeAdmin`](#移除群管理员) | `ChatGroupManager` | 添加或移除群管理员。 |
| [`ChatGroupManager#fetchGroupInfoWithoutMembersFromServer`](#获取群管理员列表) | `ChatGroupManager` | 从服务器获取最新群详情。 |
| [`adminList`](#获取群管理员列表) | `ChatGroup` | 群管理员用户 ID 列表。 |
| [`ChatGroupManager#addAllowList`](#添加成员到白名单) / [`ChatGroupManager#removeAllowList`](#从白名单移除成员) | `ChatGroupManager` | 添加或移除群白名单成员。 |
| [`ChatGroupManager#isMemberInAllowListFromServer`](#查询当前用户是否在白名单中) / [`ChatGroupManager#fetchAllowListFromServer`](#获取白名单列表) | `ChatGroupManager` | 查询当前用户是否在白名单中或获取白名单。 |
| [`ChatGroupManager#blockMembers`](#添加成员到黑名单) / [`ChatGroupManager#unblockMembers`](#从黑名单移除成员) | `ChatGroupManager` | 添加或移除群黑名单成员。 |
| [`ChatGroupManager#fetchBlockListFromServer`](#获取黑名单列表) | `ChatGroupManager` | 分页获取群黑名单。 |
| [`ChatGroupManager#muteMembers`](#禁言指定成员) / [`ChatGroupManager#unMuteMembers`](#解除指定成员禁言) | `ChatGroupManager` | 禁言或解除禁言指定成员。 |
| [`ChatGroupManager#fetchMuteListFromServer`](#获取禁言列表) | `ChatGroupManager` | 分页获取禁言列表。 |
| [`ChatGroupManager#muteAllMembers`](#开启全员禁言) / [`ChatGroupManager#unMuteAllMembers`](#关闭全员禁言) | `ChatGroupManager` | 开启或关闭全员禁言。 |
