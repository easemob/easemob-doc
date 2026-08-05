# 创建和管理群组

## 功能说明

群组是支持多人实时沟通的即时通讯场景。

### 群组分类

群组按照是否对用户公开，可以分为公开群和私有群。

| 群组分类 | 加群方式   |  获取群组信息       |
| :------- | :---------- | :---------- | 
| 公开群   | 任何用户可以搜索到该群，可申请加入群或者被管理员和群主邀请入群。任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组的设置。 | - 对于群组详情和公开群列表，用户即使不加入群也能获取。<br/> - 对于群公告和群共享文件列表，用户只有加入群时才能获取。 |
| 私有群   | 群外用户不能搜索到此类群组，需要被邀请才能入群。除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组的设置。 | 用户只有加入群后才能获取群详情、群公告、群共享文件列表、和群成员列表等群组信息。   |

### 群组成员角色  

| 群成员角色 | 描述 | 管理权限 |
| :------ | :-------------- | :------------ |
| 普通成员   | 不具备管理权限的普通成员。 | 普通成员可以在群组内发送和接收消息、获取群成员列表、群组详情、上传、下载和删除群共享文件、以及创建消息话题等。|
| 群管理员   | 由群主指定，协助群主进行管理，拥有一定的管理权限。 | 除了普通成员的权限，管理员还具备修改群组名称、群组描述和群公告、审批是否允许用户加入群组、邀请用户加入群组、将群成员被移出群组以及管理群组白名单、黑名单、禁言列表、全员禁言等权限。 |
| 群主       | 群组的创建者默认成为群主，在群中拥有最高权限。 | 除了管理员权限，群主还具备以下权限：<br/> - 添加和移除管理员；<br/> - 解散群组；<br/> - 将群主权限转移给群组中的其他成员。 |

如需查看群组消息相关内容，参见 [消息管理](message_overview.html)。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- SDK 初始化时，已注册 `GroupManager`。
- 已了解环信即时通讯 IM API 的接口调用频率限制，详见 [使用限制](/product/limitation.html)。
- 已了解群组数量和群成员数量限制，详见 [使用限制](/product/limitation.html)。

## 创建群组

你可以调用 `createGroup` 方法创建群组，并在创建时设置群组名称、群描述、初始成员、群组类型以及入群规则等信息。

示例代码如下：

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

创建群组时，主要参数如下：

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `name` | String | 是 | 群组名称。 |
| `description` | String | 是 | 群组描述。 |
| `public` | Boolean | 是 | 是否为公开群。<br/> - `true` 表示公开群，可通过公开群列表查询到，用户可按群组设置主动申请加入。<br/> - `false` 表示私有群。不可被搜索到，用户不能主动申请加入，通常通过邀请方式入群。 |
| `joinApprovalRequired` | Boolean | 是 | 用户申请加入群组时是否需要群主或管理员审批。 |
| `allowInvites` | Boolean | 是 | 是否允许普通成员邀请其他用户加入群组。 |
| `inviteNeedConfirm` | Boolean | 是 | 被邀请用户加入群组前是否需要确认邀请。 |
| `memberIds` | Array | 否 | 初始成员的用户 ID 列表。 |
| `maxMembers` | Number | 否 | 群组允许的最大成员数。 |
| `ext` | String | 否 | 群组扩展信息。 |
| `avatar` | String | 否 | 群头像地址或标识。 |

群组创建成功后，`createGroup` 方法会返回新群组的 `groupId`。用户加入群组通常有两种方式：[主动申请加入](#用户申请入群) 和 [邀请加入](#邀请用户入群)。

## 解散群组

仅群主可以解散群组。你可以先调用 `client.groupManager.getGroup(groupId)` 获取单群对象，再调用 `destroy()` 方法解散该群组。群组解散后，群内成员会收到 `onGroupDestroyed` 事件并被移出该群。

```typescript
await client.groupManager.getGroup('groupId').destroy();
```

## 加入群组

用户加入群组通常有两种方式：被邀请入群和主动申请入群。

实际是否需要用户确认或管理员审批，取决于群组创建或更新时配置的 `inviteNeedConfirm`、`joinApprovalRequired`、`allowInvites` 和群组是否公开。

### 邀请用户入群

对于公开群，通常只有群主和管理员可以邀请用户入群；对于私有群，普通成员能否邀请其他用户入群，取决于群组的 `allowInvites` 配置。调用 `inviteUsersToGroup` 可邀请一个或多个用户加入群组。

邀请流程如下：

![](/images/web/goup_member_invite.png)

邀请用户加入群组的示例代码如下：

```typescript
await client.groupManager.inviteUsersToGroup({
  groupId: 'groupId',
  userIds: ['user1', 'user2'],
});
```

受邀用户的处理流程由群组的 `inviteNeedConfirm` 配置决定：

- 如果 `inviteNeedConfirm` 为 `false`，受邀用户无需确认即可加入群组。
- 如果 `inviteNeedConfirm` 为 `true`，受邀用户需要确认是否接受邀请：
  - 同意加入群组时，调用 `acceptInvitation`。
  - 拒绝加入群组时，调用 `rejectInvitation`。

```typescript
// 受邀用户同意加入群组
await client.groupManager.acceptInvitation({
  groupId: 'groupId',
});

// 受邀用户拒绝加入群组
await client.groupManager.rejectInvitation({
  groupId: 'groupId',
});
```

用户加入群组后，即可在该群中收发消息。

### 用户申请入群

公开群支持用户主动申请加入，私有群不支持用户主动申请加入。

用户申请加入公开群的流程如下：

![](/images/web/group_member_apply.png)

若用户申请加入公开群，可采用如下步骤：

1. 用户可先获取 [公开群列表](group_manage.html#获取群组列表)。
2. 调用 `joinGroup` 方法并传入群组 ID，申请加入指定群组。

```typescript
await client.groupManager.joinGroup({
  groupId: 'groupId',
  message: 'Please approve my request',
});
```

关于入群是否需要审批，规则如下：

- 如果 `joinApprovalRequired` 为 `false`，用户调用 `joinGroup` 后可直接加入群组。
- 如果 `joinApprovalRequired` 为 `true`，用户调用 `joinGroup` 后需要等待群主或管理员审批。
  - 群主或管理员同意入群申请时，调用 `acceptGroupJoinRequest`。
  - 群主或管理员拒绝入群申请时，调用 `rejectGroupJoinRequest`。

```typescript
// 群主或管理员同意入群申请
await client.groupManager.acceptGroupJoinRequest({
  groupId: 'groupId',
  userId: 'user1',
});

// 群主或管理员拒绝入群申请
await client.groupManager.rejectGroupJoinRequest({
  groupId: 'groupId',
  userId: 'user1',
  reason: 'group is full',
});
```

## 退出群组

#### 主动退出

当前登录用户可调用 `leave` 主动退出群组。退出后，该用户不再接收该群消息。其他群成员会收到 `onMembersExited` 事件。

:::tip
群主不能直接退出群组，需要先转让群主后再退出。
:::

```typescript
await client.groupManager.getGroup('groupId').leave();
```

#### 移出成员

群主和管理员可调用 `removeMembers` 将一个或多个成员移出群组。成员被移出群组后，将不再接收该群消息。被移出的成员会收到 `onUserRemoved` 事件，其他群成员会收到 `onMembersExited` 事件。

被移出的用户后续是否可以再次申请或被邀请入群，取决于群组配置以及该用户是否被加入群黑名单。

移除群成员的示例代码如下：

```typescript
await client.groupManager.getGroup('groupId').removeMembers({
  userIds: ['user1', 'user2'],
});
```

## 获取群组列表

### 获取公开群列表

你可以调用 `getPublicGroupList` 方法分页获取公开群列表：

```typescript
const publicGroups = await client.groupManager.getPublicGroupList({
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log(publicGroups.items);
console.log(publicGroups.cursor);
console.log(publicGroups.hasMore);
```

### 获取当前用户已加入的群组列表

你可以调用 `getJoinedGroupList` 方法读取当前用户已加入群组的本地同步列表。该方法仅返回 SDK 当前内存中的运行时数据及本地已加载的同步快照，不会主动发起网络请求。

```typescript
const joinedGroups = client.groupManager.getJoinedGroupList();
console.log(joinedGroups);
```

:::tip
若需要 SDK 在登录成功后自动同步当前用户已加入的群组数据，需在初始化 SDK 时在 `enableSyncData` 中包含 `group`。同步完成后，可调用 `getJoinedGroupList` 读取本地已同步的群组列表。关于登录成功后自动同步数据，详见 [初始化文档](initialization.html)。
:::

## 查询当前用户已加入的群组数

你可以先调用 `getJoinedGroupList` 获取当前用户已加入的本地群组列表，再对结果进行计数。

单个用户可加入的群组数量上限取决于订阅的即时通讯套餐包，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。

```typescript
const joinedGroups = client.groupManager.getJoinedGroupList();
console.log(joinedGroups.length);
```

## 检查当前用户是否已屏蔽群消息

若服务端返回了相关状态，你可以通过获取群组详情读取 `GroupDetail.messageBlocked`，判断当前用户是否已屏蔽该群组消息。

```typescript
const detail = await client.groupManager.getGroup('groupId').refresh();

console.log(detail.messageBlocked);
```

## 常用单群操作

获取 `Group` 对象后，你还可以调用以下方法管理单个群组：

```typescript
const group = client.groupManager.getGroup('groupId');
```

| 功能 | 方法 | 描述 |
| :--- | :--- | :--- |
| [退出群组](#主动退出) | `group.leave()` | 当前登录用户主动退出群组。 |
| [移除群成员](#移出成员) | `group.removeMembers({ userIds })` | 从群组中移除指定成员。 |
| [变更群主](group_members.html#变更群主) | `group.changeOwner({ newOwner })` | 将当前群组转让给其他群成员。 |
| [获取管理员列表](group_members.html#获取群管理员列表) | `group.getAdmins()` | 获取当前群组的管理员列表。 |
| [添加管理员](group_members.html#添加群管理员) | `group.addAdmin({ userId })` | 将指定成员设为群管理员。 |
| [移除管理员](group_members.html#移除群管理员) | `group.removeAdmin({ userId })` | 移除指定成员的管理员权限。 |
| [获取禁言列表](group_members.html#获取禁言列表) | `group.getMuteList({ pageNum, pageSize })` | 分页获取当前群组的禁言列表。 |
| [禁言成员](group_members.html#禁言指定成员) | `group.muteMembers({ userIds, muteDuration })` | 将指定成员加入禁言列表，`muteDuration` 单位为秒。 |
| [解除成员禁言](group_members.html#解除指定成员禁言) | `group.unmuteMembers({ userIds })` | 将指定成员移出禁言列表。 |
| [开启全员禁言](group_members.html#开启全员禁言) | `group.muteAllMembers()` | 开启当前群组的全员禁言。 |
| [关闭全员禁言](group_members.html#关闭全员禁言) | `group.unmuteAllMembers()` | 关闭当前群组的全员禁言。 |
| [查询当前用户是否被禁言](group_members.html#查询当前用户是否被禁言) | `group.checkIfInMuteList()` | 查询当前登录用户是否在该群组的禁言列表中。 |
| [获取群黑名单](group_members.html#获取黑名单列表) | `group.getBlocklist({ pageNum, pageSize })` | 分页获取当前群组的黑名单列表。 |
| [加入群黑名单](group_members.html#添加成员到白名单) | `group.blockMembers({ userIds })` | 将指定成员加入群黑名单。 |
| [移出群黑名单](group_members.html#从白名单移除成员) | `group.unblockMembers({ userIds })` | 将指定成员移出群黑名单。 |
| [获取群白名单](group_members.html#获取白名单列表) | `group.getAllowlist()` | 获取当前群组的白名单列表。 |
| [加入群白名单](group_members.html#添加成员到白名单) | `group.addUsersToAllowlist({ userIds })` | 将指定成员加入群白名单。 |
| [移出群白名单](group_members.html#从白名单移除成员) | `group.removeUsersFromAllowlist({ userIds })` | 将指定成员移出群白名单。 |
| [查询当前用户是否在白名单中](group_members.html#查询当前用户是否在白名单中) | `group.checkIfInAllowList()` | 查询当前登录用户是否在该群组的白名单中。 |
| [获取群公告](group_attributes.html#获取群公告) | `group.getAnnouncement()` | 获取当前群组公告。 |
| [更新群公告](group_attributes.html#设置群公告) | `group.updateAnnouncement({ announcement })` | 更新当前群组公告。 |
| [获取群共享文件列表](group_attributes.html#获取群共享文件列表) | `group.getSharedFileList({ pageNum, pageSize })` | 分页获取当前群组的共享文件列表。 |
| [上传群共享文件](group_attributes.html#上传群共享文件) | `group.uploadSharedFile({ file, ...callbacks })` | 上传文件到当前群组共享文件列表。 |
| [删除群共享文件](group_attributes.html#删除群共享文件) | `group.deleteSharedFile({ fileId })` | 删除当前群组中的指定共享文件。 |
| [下载群共享文件](group_attributes.html#下载群共享文件) | `group.downloadSharedFile({ fileId, secret, ...callbacks })` | 下载当前群组中的指定共享文件。 |
| [设置群成员属性](group_members.html#设置群成员的自定义属性) | `group.setMemberAttributes({ userId, memberAttributes })` | 设置指定成员的群成员属性，常用于设置群成员名片。 |
| [获取群成员属性](group_members.html#获取群成员的自定义属性) | `group.getMembersAttributes({ userIds, keys })` | 批量获取指定成员的群成员属性。 |

示例代码如下：

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

## 监听群组事件

SDK 提供 `addEventHandler` 方法用于注册事件监听器。你可以通过该方法监听群组中的各类事件，并在事件回调中刷新群组列表、群详情、群成员列表或相关 UI。

示例代码如下：

```typescript
// 创建一个群组事件监听器
// 在下面的说明中，用户 A 表示当前用户。
client.groupManager.addEventHandler('group-events', {
  // 当前用户收到了入群邀请。受邀用户会收到该回调。
  // 例如，用户 B 邀请用户 A 入群，则用户 A 会收到该回调。
  onInvitationReceived: event => {
    console.log('onInvitationReceived', event);
  },

  // 当前用户发送入群申请。群主和群管理员会收到该回调。
  onRequestToJoinReceived: event => {
    console.log('onRequestToJoinReceived', event);
  },

  // 当前用户的入群申请被接受。申请人会收到该回调。
  // 例如，用户 B 接受用户 A 的入群申请后，用户 A 会收到该回调。
  onRequestToJoinAccepted: event => {
    console.log('onRequestToJoinAccepted', event);
  },

  // 当前用户的入群申请被拒绝。申请人会收到该回调。
  // 例如，用户 B 拒绝用户 A 的入群申请后，用户 A 会收到该回调。
  onRequestToJoinDeclined: event => {
    console.log('onRequestToJoinDeclined', event);
  },

  // 当前用户的入群邀请被接受。邀请人会收到该回调。
  // 例如，用户 B 接受了用户 A 的入群邀请，则用户 A 会收到该回调。
  onInvitationAccepted: event => {
    console.log('onInvitationAccepted', event);
  },

  // 当前用户的入群邀请被拒绝。邀请人会收到该回调。
  // 例如，用户 B 拒绝了用户 A 的入群邀请，用户 A 会收到该回调。
  onInvitationDeclined: event => {
    console.log('onInvitationDeclined', event);
  },

  // 用户被移出群组。被踢出的成员会收到该回调。
  onUserRemoved: event => {
    console.log('onUserRemoved', event);
  },

  // 群组被解散。群主解散群组时，所有群成员均会收到该回调。
  onGroupDestroyed: event => {
    console.log('onGroupDestroyed', event);
  },

  // 群组所有者和管理员拉用户进群时，无需用户确认时会触发该回调。
  // 被拉进群的用户会收到该回调。
  onAutoAcceptInvitationFromGroup: event => {
    console.log('onAutoAcceptInvitationFromGroup', event);
  },

  // 有群组成员被加入禁言列表。
  // 被禁言的成员及群主和群管理员会收到该回调。
  onMuteListAdded: event => {
    console.log('onMuteListAdded', event);
  },

  // 有成员被移出禁言列表。
  // 被解除禁言的成员及群主和群管理员会收到该回调。
  onMuteListRemoved: event => {
    console.log('onMuteListRemoved', event);
  },

  // 有成员添加至群白名单。
  // 被添加的成员及群主和群管理员会收到该回调。
  onAllowListAdded: event => {
    console.log('onAllowListAdded', event);
  },

  // 有成员从群白名单中移出。
  // 被移出的成员及群主和群管理员会收到该回调。
  onAllowListRemoved: event => {
    console.log('onAllowListRemoved', event);
  },

  // 群组禁用状态变更。群组所有成员会收到该回调。
  onAllMemberMuteStateChanged: event => {
    console.log('onAllMemberMuteStateChanged', event);
  },

  // 添加群管理员。群主、新管理员和其他管理员会收到该回调。
  onAdminAdded: event => {
    console.log('onAdminAdded', event);
  },

  // 移除管理员。群主、被移除的管理员和其他管理员会收到该回调。
  onAdminRemoved: event => {
    console.log('onAdminRemoved', event);
  },

  // 群主变更。群成员会收到该回调。
  onOwnerChanged: event => {
    console.log('onOwnerChanged', event);
  },

  // 有成员加入群组。群组内其他成员会收到该回调。
  onMembersJoined: event => {
    console.log('onMembersJoined', event);
  },

  // 有成员退出群组。群组内其他成员会收到该回调。
  onMembersExited: event => {
    console.log('onMembersExited', event);
  },

  // 更新或删除群公告。群组所有成员会收到该回调。
  onAnnouncementChanged: event => {
    console.log('onAnnouncementChanged', event);
  },

  // 新增群共享文件。群组所有成员会收到该回调。
  onSharedFileAdded: event => {
    console.log('onSharedFileAdded', event);
  },

  // 删除群共享文件。群组所有成员会收到该回调。
  onSharedFileDeleted: event => {
    console.log('onSharedFileDeleted', event);
  },

  // 更新群组信息，如群组名称、群组描述、群头像或扩展信息。
  // 群组所有成员会收到该回调。
  onGroupInfoChanged: event => {
    console.log('onGroupInfoChanged', event);
  },

  // 群组禁用状态变更。群组所有成员会收到该回调。
  onGroupDisabledChanged: event => {
    console.log('onGroupDisabledChanged', event);
  },

  // 群成员的自定义属性变更。群组内其他成员均会收到该回调。
  onGroupMemberAttributeChanged: event => {
    console.log('onGroupMemberAttributeChanged', event);
  },

  // 群成员名片更新。群组内其他成员均会收到该回调。
  onUserGroupNamecardUpdated: event => {
    console.log('onUserGroupNamecardUpdated', event);
  },
});
```

如需移除监听器，可调用 `removeEventHandler`：

```typescript
client.groupManager.removeEventHandler('group-events');
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createGroup`](#创建群组) | `GroupManager` | 创建群组。 |
| [`destroy`](#解散群组) | `Group` | 解散当前群组。 |
| [`inviteUsersToGroup`](#邀请用户入群) | `GroupManager` | 邀请一个或多个用户加入群组。 |
| [`acceptInvitation`](#邀请用户入群) | `GroupManager` | 接受群组邀请。 |
| [`rejectInvitation`](#邀请用户入群) | `GroupManager` | 拒绝群组邀请。 |
| [`joinGroup`](#用户申请入群) | `GroupManager` | 申请加入公开群。 |
| [`acceptGroupJoinRequest`](#用户申请入群) | `GroupManager` | 群主或管理员同意入群申请。 |
| [`rejectGroupJoinRequest`](#用户申请入群) | `GroupManager` | 群主或管理员拒绝入群申请。 |
| [`leave`](#主动退出) | `Group` | 当前登录用户主动退出群组。 |
| [`removeMembers`](#移出成员) | `Group` | 将一个或多个成员移出群组。 |
| [`getPublicGroupList`](#获取公开群列表) | `GroupManager` | 分页获取公开群列表。 |
| [`getJoinedGroupList`](#获取当前用户已加入的群组列表) | `GroupManager` | 读取当前用户已加入群组的本地同步列表。 |
| [`refresh`](#检查当前用户是否已屏蔽群消息) | `Group` | 强制从服务端刷新当前群组详情。 |

