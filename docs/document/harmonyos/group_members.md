+# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文指导你如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM HarmonyOS SDK 提供 `GroupManager` 类和 `Group` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 加入、退出群组
- 管理群成员的自定义属性
- 管理群主及群管理员
- 管理群组白名单
- 管理群组黑名单
- 管理群组禁言

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)；
- 了解群成员角色，详见 [群组概述](group_overview.html#群组成员角色)；
- 了解群组和群成员的数量限制，详见 [套餐包详情](/product/pricing.html#套餐包功能详情)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 加入群组

用户进群分为两种方式：主动申请入群和群成员邀请入群。

公开群和私有群在两种入群方式方面存在差别：

| 入群方式                   | 公开群       | 私有群          |
| :------------------------- | :------------------ | :------------------------------------ |
| 是否支持用户申请入群       | 支持 <br/>任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型 `GroupStyle` 的设置。 | 不支持                                                                                             |
| 是否支持群成员邀请用户入群 | 支持 <br/>只能由群主和管理员邀请。    | 支持 <br/>除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `GroupStyle` 的设置。 |

#### 用户申请入群

只有公开群支持用户申请入群，私有群不支持。用户可获取公开群列表，选择相应的群组 ID，然后调用相应方法加入该群组。

任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型（`GroupStyle`）的设置：

- `GroupStyle` 为 `GroupStylePublicJoinNeedApproval` 时，群主和群管理员审批后，用户才能加入群组；
- `GroupStyle` 为 `GroupStylePublicOpenJoin` 时，用户可直接加入群组，无需群主和群管理员审批。

若申请加入公开群，申请人需执行以下步骤：

1. 调用 `fetchPublicGroupsFromServer` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.fetchPublicGroupsFromServer(pageSize, cursor).then((result)=> {
    let groupList = result.getResult();
    let cursor = result.getNextCursor();
});
```

2. 调用 `joinGroup` 或 `applyJoinToGroup` 方法传入群组 ID，申请加入对应群组。

   - 调用 `joinGroup` 方法加入无需群主或管理员审批的公开群，即 `GroupStyle` 设置为 `GroupStylePublicOpenJoin`。申请人不会收到任何回调，其他群成员会收到 `GroupChangeListener#onMemberJoined` 回调。

   示例代码如下：

   ```TypeScript
   ChatClient.getInstance().groupManager()?.joinGroup(groupId).then((group) => {
    // success logic
   });
   ```

   - 调用 `applyJoinToGroup` 方法加入需要群主或管理员审批的公开群，即 `GroupStyle` 设置为 `GroupStylePublicJoinNeedApproval`。示例代码如下：

   ```TypeScript
   ChatClient.getInstance().groupManager()?.applyJoinToGroup(groupId, "your reason").then((group) => {
    // success logic
   });
   ```

   群主或群管理员收到 `GroupChangeListener#onRequestToJoinReceived` 回调：

   - 若同意加入群组，需要调用 `acceptApplication` 方法。

   申请人会收到 `GroupChangeListener#onRequestToJoinAccepted` 回调，其他群成员会收到 `GroupChangeListener#onMemberJoined` 回调。

   示例代码如下：

   ```TypeScript
   ChatClient.getInstance().groupManager()?.acceptApplication(groupId, userId).then((group) => {
    // success logic
   });
   ```

   - 若群主或群管理员拒绝申请人入群，需要调用 `declineApplication` 方法。申请人会收到 `GroupChangeListener#onRequestToJoinDeclined` 回调。

   示例代码如下：

   ```TypeScript
   ChatClient.getInstance().groupManager()?.declineApplication(groupId, userId, "your reason").then((group) => {
    // success logic
   });
   ```

#### 邀请用户入群

邀请用户入群的方式详见 [邀请用户入群的配置](./group_manage.html#创建群组)。

邀请用户入群流程如下：

1. 群成员邀请用户入群。

   - 群主或群管理员加人，需要调用 `addUsersToGroup` 方法：

   ```TypeScript
   ChatClient.getInstance().groupManager()?.addUsersToGroup(groupId, newMembers).then((group) => {
    // success logic
   });
   ```

   - 普通成员邀请人入群，需要调用 `inviteUser` 方法：

   对于私有群，`GroupStyle` 设置为 `GroupStylePrivateMemberCanInvite` 时，所有群成员均可以邀请人进群。

   ```TypeScript
   ChatClient.getInstance().groupManager()?.inviteUsers(groupId, newMembers, "your reason").then((group) => {
    // success logic
   });
   ```

2. 受邀用户自动进群或确认是否加入群组：

   - 受邀用户同意加入群组，需要调用 `acceptInvitation` 方法。

   ```TypeScript
   ChatClient.getInstance().groupManager()?.acceptInvitation(groupId).then((group) => {
    // success logic
   });
   ```

   - 受邀人拒绝入群组，需要调用 `declineInvitation` 方法。

   ```TypeScript
   ChatClient.getInstance().groupManager()?.declineInvitation(groupId, "your reason").then(() => {
    // success logic
   });
   ```

### 退出群组

#### 群成员主动退出群组

群成员可以调用 `leaveGroup` 方法退出群组。其他成员收到 `GroupChangeListener#onMemberExited` 回调。

退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 `destroyGroup` 解散群组。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.leaveGroup(groupId).then(() => {
    // success logic
});
```

#### 群成员被移出群组

仅群主和群管理员可以调用 `removeUsersFromGroup` 方法将单个或多个成员移出群组。被踢出群组后，被踢成员将会收到群组事件回调 `GroupChangeListener#onUserRemoved`，其他成员将会收到回调 `GroupChangeListener#onMemberExited`。被移出群组后，用户还可以再次加入群组。

- 移出群成员，示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.removeUsersFromGroup(groupId, members).then((group) => {
    // success logic
});
```

### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `changeOwner` 方法将群所有权移交给指定群成员。成功移交后，原群主变为普通成员，新群主收到 `GroupChangeListener#onOwnerChanged` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.changeOwner(groupId, newOwner).then((group) => {
    // success logic
});
```

#### 添加群组管理员

仅群主可以调用 `addGroupAdmin` 方法添加群管理员。成功添加后，新管理员及其他管理员收到 `GroupChangeListener#onAdminAdded` 回调。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.addGroupAdmin(groupId, admin).then((group) => {
    // success logic
});
```

#### 移除群组管理员权限

仅群主可以调用 `removeGroupAdmin` 方法移除群管理员。成功移除后，被移除的管理员及其他管理员收到 `GroupChangeListener#onAdminRemoved` 回调。

群管理员被移除群管理权限后将只拥有群成员的权限。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.removeGroupAdmin(groupId, admin).then((group) => {
    // success logic
});
```

### 获取群管理员列表

获取群管理员列表示例如下：

```TypeScript
// 获取内存中管理员列表。
let adminList: Array<string> = group.adminList();
```

或者也可以用 [获取群组详情](group_manage.html#获取群组详情) 获取群组管理员列表。

### 管理群组白名单

群主和群组中的管理员默认会被加入群组白名单。

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `addToGroupWhitelist` 方法将指定群成员加入群白名单。群成员被添加至群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `GroupChangeListener#onWhitelistAdded`。

即使开启了群组全员禁言，群组白名单中的成员仍可以发送群组消息。不过，禁言列表上的用户即使加入了群白名单仍无法在群组中发送消息。

```TypeScript
ChatClient.getInstance().groupManager()?.addToGroupWhitelist(groupId, members).then(() => {
    // success logic
});
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `removeFromGroupWhitelist` 方法将指定群成员移出群白名单。

群成员被移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `GroupChangeListener#onWhitelistRemoved`。

```TypeScript
ChatClient.getInstance().groupManager()?.removeFromGroupWhitelist(groupId, members).then(() => {
    // success logic
});
```

#### 检查自己是否在白名单中

所有群成员可以调用 `checkIfInGroupWhitelist` 方法检查自己是否在群白名单中，示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.checkIfInGroupWhitelist(groupId).then((res) => {
    // success logic
});
```

#### 获取群组白名单

仅群主和群管理员可以调用 `fetchGroupWhitelist` 方法从服务器获取当前群组的白名单。

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupWhitelist(groupId).then((whitelist) => {
    // success logic
});
```

### 管理群组黑名单

#### 将成员加入群组黑名单

仅群主和群管理员可以调用 `blockUsers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `GroupChangeListener#OnUserRemoved` 回调。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.blockUsers(groupId, userIds).then((group) => {
    // success logic
});
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `unblockUsers` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.unblockUsers(groupId, userIds).then((group) => {
    // success logic
});
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `fetchGroupBlocklist` 方法获取当前群组的黑名单。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupBlocklist(groupId, pageNum, pageSize).then((blocklist) => {
    // success logic
});
```

### 管理群组禁言

群主和群管理员若对单个或多个群成员禁言或解除禁言，可将其添加至或移出群组禁言列表。此外，群主和群管理员也可开启或关闭全员禁言。

全员禁言和单独的成员禁言不冲突，开启和关闭全员禁言，并不影响群组禁言列表。

#### 将成员加入群组禁言列表

仅群主和群管理员可以调用 `muteGroupMembers` 方法将指定成员添加至群组禁言列表。群成员被群主或者群管理员加入禁言列表中后，被禁言成员和其他未操作的管理员或者群主将会收到群组事件回调 `GroupChangeListener#onMutelistAdded`。群成员被加入群禁言列表后，将不能够发言，即使其被加入群白名单也不能发言。

```TypeScript
// `duration`：禁言时间。传 -1 表示永久禁言。
ChatClient.getInstance().groupManager()?.muteGroupMembers(groupId, muteMembers, duration).then((group) => {
    // success logic
});
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `unmuteGroupMembers` 方法将指定成员移出群组禁言列表。

群成员被移出禁言列表后可以在群组中正常发送消息，被移出的群成员及其他未操作的管理员或者群主将会收到群组事件回调 `GroupChangeListener#onMutelistRemoved`。

```TypeScript
ChatClient.getInstance().groupManager()?.unmuteGroupMembers(groupId, members).then((group) => {
    // success logic
});
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `fetchGroupMutelist` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.fetchGroupMutelist(groupId, pageNum, pageSize).then((res) => {
    // success logic
});
```

#### 开启群组全员禁言

仅群主和群管理员可以调用 `muteAllMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `unmuteAllMembers` 方法解除全员禁言。

开启群组全员禁言后，除了在白名单中的群成员，其他成员将不能发言。开启群组全员禁言后，群成员将会收到群组事件回调 `GroupChangeListener#onAllMemberMuteStateChanged`。

群组全员禁言状态（`isAllMemberMuted` 的返回值）存储在本地数据库中，下次登录时可以直接从本地获取到。
 
示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.muteAllMembers(groupId).then((group) => {
    // success logic
});
```

#### 关闭群组全员禁言

仅群主和群管理员可以调用 `unmuteAllMembers` 方法取消全员禁言。关闭群组全员禁言后，群成员将会收到群组事件回调 `GroupChangeListener#onAllMemberMuteStateChanged`。

示例代码如下：

```TypeScript
ChatClient.getInstance().groupManager()?.unmuteAllMembers(groupId).then((group) => {
    // success logic
});
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
