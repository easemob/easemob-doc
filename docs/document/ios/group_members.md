# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 群组加人、踢人
- 管理群主及群管理员
- 管理群组黑名单
- 管理群组禁言列表
- 开启、关闭群组全员禁言
- 管理群组白名单

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群成员角色，详见 [群组功能介绍](group_overview.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 群组加人

根据创建群组时的群组类型 (`EMGroupStyle`) 和进群邀请是否需要对方同意 (`EMGroupOptions#inviteNeedConfirm`) 设置，群组加人的处理逻辑有差别。具体规则可以参考 [创建群组](group_manage.html#创建群组)。

示例代码如下：

- 邀请加群：

```objectivec
[[EMClient sharedClient].groupManager addMembers:@{@"member1",@"member2"}
                         toGroup:@"groupID"
                         message:@"message"
                         completion:nil];
```

### 群组踢人

仅群主和群管理员可以调用 `removeMembers` 方法将指定成员移出群组。被踢出群组后，被踢群成员将会收到群组事件回调 `EMGroupChangeListener#onUserRemoved`，其他成员将会收到回调 `EMGroupChangeListener#onMemberExited`。被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager removeMembers:@{@"member"}
                         fromGroup:@"groupsID"
                         completion:nil];
```

### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `updateGroupOwner` 方法将权限移交给群组中指定成员。成功移交后，原群主变为普通成员，其他群组成员收到 `EMGroupManagerDelegate#groupOwnerDidUpdate` 回调。

示例如下：

```objectivec
[[EMClient sharedClient].groupManager updateGroupOwner:@"groupID"
                         newOwner:@"newOwner"
                         error:nil];
```

#### 添加群组管理员

仅群主可以调用 `addAdmin` 方法添加群管理员。成功添加后，添加为管理员的成员和其他管理员会接收到群组事件回调 `EMGroupManagerDelegate#groupAdminListDidUpdate`。

管理员除了不能散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager addAdmin:@"member"
                         toGroup:@"groupID"
                         error:nil];
```

#### 移除群组管理员权限

仅群主可以调用 `removeAdmin` 方法移除群管理员。

指定群管理员若被群主移除管理员权限，只具备普通群成员的权限。移除管理员权限的成员和其他管理员会接收到群组事件回调 `EMGroupManagerDelegate#groupAdminListDidUpdate`。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager removeAdmin:@"admin"
                         fromGroup:@"groupID"
                         error:nil];
```

### 管理群组黑名单

群主及群管理员可以将群组中的指定群成员加入或者移出群黑名单。群成员被加入黑名单后将无法收发群消息。

#### 将群成员拉入群组黑名单

仅群主和群管理员可以调用 `blockMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `EMGroupManagerDelegate#OnUserRemovedFromGroup` 回调。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。被加入黑名单后，该成员无法再收发群组消息并被移出群组，黑名单中的成员如想再次加入群组，群主或群管理员必须先将其移除黑名单。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager blockMembers:members
                         fromGroup:@"groupID"
                         completion:nil];
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `unblockUser` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```objectivec
ChatClient.getInstance().groupManager().unblockUser(groupId, username);
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `getGroupBlacklistFromServerWithId` 方法获取当前群组的黑名单。默认最多取 200 个。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager getGroupBlacklistFromServerWithId:@"groupId"
                         pageNumber:pageNumber
                         pageSize:pageSize
                         completion:nil];
```

### 管理群组禁言列表

为了方便管理群组，环信即时通讯 IM SDK 提供了针对成员和群组的禁言操作。

#### 将成员加入群组禁言列表

为了精细化管理群成员发言，群主和群成员可以根据情况将指定群成员加入或者移出群禁言列表。群成员被加入群禁言列表后，将不能够发言，即使其被加入群白名单也不能发言。

仅群主和群管理员可以调用 `muteMembers` 方法将指定成员添加至群组禁言列表。

群成员被群主或者群管理员加入禁言列表后，被禁言成员和其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupManagerDelegate#groupMuteListDidUpdate`。

```objectivec
[[EMClient sharedClient].groupManager muteMembers:members
                         muteMilliseconds:60
                         fromGroup:@"groupID"
                         error:nil];
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `unmuteMembers` 方法将指定成员移出群组禁言列表。

群成员被群主或者群管理员移出禁言列表后，被移出的群成员及其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupManagerDelegate#groupMuteListDidUpdate`。

```objectivec
[[EMClient sharedClient].groupManager unmuteMembers:members
                         fromGroup:@"groupID"
                         error:nil];
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `getGroupMuteListFromServerWithId` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager getGroupMuteListFromServerWithId:@"groupID"
                         pageNumber:pageNumber
                         pageSize:pageSize
                         error:nil];
```

### 开启和关闭全员禁言

为了快捷管理群成员发言，群主和群成员可以开启和关闭群组全员禁言。

#### 开启全员禁言

仅群主和群管理员可以调用 `muteAllMembersFromGroup` 方法开启全员禁言。

群主和群管理员开启群组全员禁言后，除了白名单中的群成员，其他成员将不能发言。开启群组全员禁言后，群成员会收到群组事件回调 `EMGroupManagerDelegate#groupAllMemberMuteChanged`。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager muteAllMembersFromGroup:@"groupID" error:nil];
```

#### 关闭全员禁言

仅群主和群管理员可以调用 `unmuteAllMembersFromGroup` 方法取消全员禁言。关闭群组全员禁言后，群成员将会收到群组事件回调 `EMGroupManagerDelegate#groupAllMemberMuteChanged`。

示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager unmuteAllMembersFromGroup:@"groupID" error:nil];
```

### 管理群组白名单

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `addWhiteListMembers` 方法将指定群成员加入群白名单。白名单用户不受全员禁言的限制，但是如果白名单用户在群禁言列表中，则该用户不能发言。

群成员被群主或者群管理员添加到群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupManagerDelegate#groupWhiteListDidUpdate`。

```objectivec
[[EMClient sharedClient].groupManager addWhiteListMembers:members
                         fromGroup:@"groupID"
                         error:nil];
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `removeWhiteListMembers` 方法将指定群成员移出群白名单。

群成员被群主或者群管理员移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupManagerDelegate#groupWhiteListDidUpdate`。

```objectivec
[[EMClient sharedClient].groupManager removeWhiteListMembers:members
                         fromGroup:@"groupID"
                         error:nil];
```

#### 检查自己是否在白名单中

所有群成员可以调用 `isMemberInWhiteListFromServerWithGroupId` 方法检查自己是否在群白名单中，示例代码如下：

```objectivec
[[EMClient sharedClient].groupManager
                         isMemberInWhiteListFromServerWithGroupId:@"groupID"
                         error:nil];
```

#### 获取群组白名单

仅群主和群管理员可以调用 `getGroupWhiteListFromServerWithId` 方法从服务器获取当前群组的白名单。

```objectivec
[[EMClient sharedClient].groupManager getGroupWhiteListFromServerWithId:@"groupID" error:nil];
```

## 更多操作

详见 [监听群组事件](group_manage.html)。
