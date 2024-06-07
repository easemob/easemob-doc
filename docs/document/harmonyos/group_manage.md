# 创建和管理群组及监听群组事件

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理群组，并实现群组相关功能。

如需查看消息相关内容，参见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供 `GroupManager` 类和 `Group` 类用于管理群组，支持你通过调用 API 在项目中实现如下功能：

- 创建、解散群组
- 获取群组详情
- 获取群成员列表
- 获取群组列表
- 屏蔽、解除屏蔽群消息
- 监听群组事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建群组

群组可分为私有群和公有群。私有群不可被搜索到，公开群可以通过群组 ID 搜索到。

用户可以创建群组，设置群组的名称、描述、群组成员、创建群组的原因等属性，还可以设置 `GroupStyle` 参数指定群组的大小和类型。创建群组后，群组创建者自动成为群主。

创建群组前，需设置群组类型（`GroupStyle`）和进群邀请是否需要对方同意 (`GroupOptions#inviteNeedConfirm`)。

- 设置群组类型（`GroupStyle`）以及入群是否需要群主和群管理员同意：

   - GroupStylePrivateOnlyOwnerInvite——私有群，只有群主和管理员可以邀请人进群；
   - GroupStylePrivateMemberCanInvite——私有群，所有群成员均可以邀请人进群；
   - GroupStylePublicJoinNeedApproval——公开群，用户入群需要获得群主和群管理员同意；
   - GroupStylePublicOpenJoin ——公开群，任何人都可以进群，无需群主和群管理员同意。

- 邀请进群是否需要受邀用户确认（`GroupOptions#inviteNeedConfirm`）

公开群只支持群主和管理员邀请用户入群。对于私有群，除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `GroupStyle` 的设置。

邀请入群是否需受邀用户确认取决于群组选项 `GroupOptions#inviteNeedConfirm` 和受邀用户的参数 `ChatOptions#setAutoAcceptGroupInvitations` 的设置，前者的优先级高于后者，即若 `GroupOptions#inviteNeedConfirm` 设置为 `false`，不论 `ChatOptions#setAutoAcceptGroupInvitations` 设置为何值，受邀用户无需确认直接进群。

1. 受邀用户无需确认，直接进群。

以下两种设置的情况下，用户直接进群：

- 若 `GroupOptions#inviteNeedConfirm` 设置为 `false`，不论 `ChatOptions#setAutoAcceptGroupInvitations` 设置为 `false` 或 `true`，受邀用户均无需确认，直接进群。
- 若 `GroupOptions#inviteNeedConfirm` 和 `ChatOptions#setAutoAcceptGroupInvitations` 均设置为 `true`，用户自动接受群组邀请，直接进群。

受邀用户直接进群，会收到如下回调：

- 新成员会收到 `GroupChangeListener#onAutoAcceptInvitationFromGroup` 回调；
- 邀请人收到 `GroupChangeListener#onInvitationAccepted` 回调和 `GroupChangeListener#onMemberJoined` 回调；
- 其他群成员收到 `GroupChangeListener#onMemberJoined` 回调。

2. 受邀用户需要确认才能进群。

只有 `GroupOptions#inviteNeedConfirm` 设置为 `true` 和 `ChatOptions#setAutoAcceptGroupInvitations` 设置为 `false` 时，受邀用户需要确认才能进群。这种情况下，受邀用户收到 `GroupChangeListener#onInvitationReceived` 回调，并选择同意或拒绝进群邀请：

- 用户同意入群邀请后，邀请人收到 `GroupChangeListener#onInvitationAccepted` 回调和 `GroupChangeListener#onMemberJoined` 回调，其他群成员收到 `GroupChangeListener#onMemberJoined` 回调；
- 用户拒绝入群邀请后，邀请人收到 `GroupChangeListener#onInvitationDeclined` 回调。

邀请用户入群的流程如下图所示：

![img](@static/images/android/group-flow.png)

用户可以调用 `createGroup` 方法创建群组，并通过 `GroupOptions` 中的参数设置群组名称、群组描述、群组成员和建群原因。

用户加入群组后，将可以收到群消息。示例代码如下：

```TypeScript
let option: GroupOptions = {
    groupName: "groupName",
    desc: "A description of a group",
    members: ["user1", "user2"],
    style: GroupStyle.GroupStylePrivateMemberCanInvite,
    inviteNeedConfirm: true,
    maxUsers: 100,
    extField: "group detail extensions",
};
ChatClient.getInstance().groupManager()?.createGroup(option).then(res => console.log(res.groupName()));
```

### 解散群组

仅群主可以调用 `destroyGroup` 方法解散群组。群组解散时，其他群组成员收到 `GroupChangeListener#onGroupDestroyed` 回调并被踢出群组。

:::notice
该操作是危险操作，解散群组后，将删除本地数据库及内存中的群相关信息及群会话。
:::

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.destroyGroup(groupId).then(() => console.log("Destroy group success"));
```

### 获取群组详情

群成员可以调用 `getGroup(groupId)` 方法从内存获取群组详情。返回的结果包括群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表，默认不包含群成员。

群成员也可以调用 `fetchGroupFromServer` 方法从服务器获取群组详情。返回的结果包括群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表、是否已屏蔽群组消息以及群组是否禁用等信息。

:::tip
对于公有群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

示例代码如下：

```TypeScript
// 根据群组 ID 从本地获取群组详情。
let group: Group | undefined = ChatClient.getInstance().groupManager()?.getGroup(groupId);

// 根据群组 ID 从服务器获取群组详情。
let group = await ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId);

// 获取群主用户 ID。
let owner = group.owner();

// 获取内存中管理员列表。
let adminList = group.adminList();

/**
 * 获取是否已屏蔽群组消息。
 * - `true`：是；
 * - `false`：否。
 */
let isMsgBlocked: boolean = group.isMsgBlocked();
...
```

### 获取群成员列表

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupMembers(groupId, pageSize, cursor).then((res) => {
    // success logic
});
```

### 获取群组列表

用户可以调用 `getJoinedGroupsFromServer` 方法从服务器获取自己加入和创建的群组列表。

示例代码如下：

```TypeScript
// pageIndex：当前页码，从 0 开始。
// pageSize：每页期望返回的群组数。取值范围为[1,20]。
ChatClient.getInstance().groupManager()?.fetchJoinedGroupsFromServer(pageNum, pageSize).then((res) => {
    // success logic
});;
```

- 用户可以调用 `getAllGroups` 方法加载本地群组列表。为了保证数据的正确性，需要先从服务器获取自己加入和创建的群组列表。示例代码如下：

```TypeScript
let groupList = await ChatClient.getInstance().groupManager()?.getAllGroups();
```

- 用户还可以分页获取公开群列表：

```TypeScript
let result = await ChatClient.getInstance().groupManager()?.fetchPublicGroupsFromServer(pageSize, cursor);
if (result) {
    let groupsList = result.getResult();
    let cursor = result.getNextCursor();
}
```

### 查询当前用户已加入的群组数量

你可以调用 `GroupManager#fetchJoinedGroupsCount` 方法从服务器获取当前用户已加入的群组数量。单个用户可加入群组数量的上限取决于订阅的即时通讯的套餐包，详见[产品价格](/product/pricing.html#套餐包功能详情)。

```TypeScript
ChatClient.getInstance().groupManager()?.fetchJoinedGroupsCount().then(res => console.log(res.toString()));
```

### 屏蔽和解除屏蔽群消息

群成员可以屏蔽群消息和解除屏蔽群消息。

#### 屏蔽群消息

群成员可以调用 `blockGroupMessage` 方法屏蔽群消息。屏蔽群消息后，该成员不再从指定群组接收群消息，群主和群管理员不能进行此操作。示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.blockGroupMessage(groupId).then(res => console.log(res.groupName()));
```

#### 解除屏蔽群消息

群成员可以调用 `unblockGroupMessage` 方法解除屏蔽群消息。示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.unblockGroupMessage(groupId).then(res => console.log(res.groupName()));
```

#### 检查自己是否已经屏蔽群消息

群成员可以调用 `Group#isMsgBlocked` 方法检查是否屏蔽了该群的消息。为了保证检查结果的准确性，调用该方法前需先从服务器获取群详情，即调用 `GroupManager#fetchGroupFromServer`。

示例代码如下：

```TypeScript
// 1、获取群组详情
ChatClient.getInstance().groupManager()?.fetchGroupFromServer(groupId).then((group) => {
    // 2、检查用户是否屏蔽了该群的消息
    if(group.isMsgBlocked()) {

    }
});
```

### 监听群组事件

`GroupManager` 中提供群组事件的监听接口。开发者可以通过设置此监听，获取群组中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```TypeScript
// 创建一个群组事件监听
// 在该方法的举例中，用户 A 表示当前用户。
let groupListener: GroupListener = {
  onInvitationReceived: (groupId: string, groupName: string, inviter: string, reason: string): void => {
    // 当前用户收到了入群邀请。受邀用户会收到该回调。例如，用户 B 邀请用户 A 入群，则用户 A 会收到该回调。
  },
  onRequestToJoinReceived: (groupId: string, groupName: string, applicant: string,
    reason: string): void => {
    // 群主或群管理员收到进群申请。群主和所有管理员收到该回调。
  },
  onRequestToJoinAccepted: (groupId: string, groupName: string, accepter: string): void => {
    // 群主或群管理员同意用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
  },
  onRequestToJoinDeclined: (groupId: string, groupName: string, decliner: string, applicant: string,
    reason: string): void => {
    // 群主或群管理员拒绝用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
  },
  onInvitationAccepted: (groupId: string, invitee: string, reason: string): void => {
    // 用户同意进群邀请。邀请人收到该回调。
  },
  onInvitationDeclined: (groupId: string, invitee: string, reason: string): void => {
    // 用户拒绝进群邀请。邀请人收到该回调。
  },
  onUserRemoved: (groupId: string, groupName: string): void => {
    // 有成员被移出群组。被踢出群组的成员会收到该回调。
  },
  onGroupDestroyed: (groupId: string, groupName: string): void => {
    // 群组解散。群主解散群组时，所有群成员均会收到该回调。
  },
  onAutoAcceptInvitationFromGroup: (groupId: string, inviter: string, inviteMessage: string): void => {
    // 有用户自动同意加入群组。邀请人收到该回调。
  },
  onMutelistAdded: (groupId: string, mutes: string[], muteExpire: number): void => {
    // 有成员被加入群组禁言列表。被禁言的成员及群主和群管理员（除操作者外）会收到该回调。
  },
  onMutelistRemoved: (groupId: string, mutes: string[]): void => {
    // 有成员被移出禁言列表。被解除禁言的成员及群主和群管理员（除操作者外）会收到该回调。
  },
  onWhitelistAdded: (groupId: string, whitelist: string[]): void => {
    // 有成员被加入群组白名单。被添加的成员及群主和群管理员（除操作者外）会收到该回调。
  },
  onWhitelistRemoved: (groupId: string, whitelist: string[]): void => {
    // 有成员被移出群组白名单。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
  },
  onAllMemberMuteStateChanged: (groupId: string, isMuted: boolean): void => {
    // 全员禁言状态变化。群组所有成员（除操作者外）会收到该回调。
  },
  onAdminAdded: (groupId: string, administrator: string): void => {
    // 设置管理员。群主、新管理员和其他管理员会收到该回调。
  },
  onAdminRemoved: (groupId: string, administrator: string): void => {
    // 群组管理员被移除。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
  },
  onOwnerChanged: (groupId: string, newOwner: string, oldOwner: string): void => {
    // 群主转移权限。原群主和新群主会收到该回调。
  },
  onMemberJoined: (groupId: string, member: string): void => {
    // 有新成员加入群组。除了新成员，其他群成员会收到该回调。
  },
  onMemberExited: (groupId: string, member: string): void => {
    // 有成员主动退出群。除了退群的成员，其他群成员会收到该回调。
  },
  onAnnouncementChanged: (groupId: string, announcement: string): void => {
    // 群组公告更新。群组所有成员会收到该回调。
  },
  onSharedFileAdded: (groupId: string, sharedFile: SharedFile): void => {
    // 有成员新上传群组共享文件。群组所有成员会收到该回调。
  },
  onSharedFileDeleted: (groupId: string, fileId: string): void => {
    // 群组共享文件被删除。群组所有成员会收到该回调。
  },
  onSpecificationChanged: (group: Group): void => {
    // 群组详情变更。群组所有成员会收到该回调。
  },
  onStateChanged: (group: Group, isDisabled: boolean): void => {
    // 群组禁用或启动状态回调。
  }
}

// 注册群组监听
ChatClient.getInstance().groupManager()?.addListener(groupListener);

// 移除群组监听
ChatClient.getInstance().groupManager()?.removeListener(groupListener);
```
