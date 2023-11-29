# 创建和管理群组及监听群组事件

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理群组，并实现群组相关功能。

如需查看消息相关内容，参见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMGroupManager` 类和 `EMGroup` 类用于管理群组，支持你通过调用 API 在项目中实现如下功能：

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

用户可以创建群组，设置群组的名称、描述、群组成员、创建群组的原因等属性。用户还可以设置 `EMGroupStyle` 参数指定群组的大小和类型。创建群组后，群组创建者自动成为群主。

创建群组前，需设置群组类型（`EMGroupStyle`）和进群邀请是否需要对方同意 (`EMGroupOptions#IsInviteNeedConfirm`)。

- 群组类型（`EMGroupStyle`）可以设置为如下值：

  - `EMGroupStylePrivateOnlyOwnerInvite`——私有群，只有群主和管理员可以邀请人进群；
  - `EMGroupStylePrivateMemberCanInvite`——私有群，所有群成员均可以邀请人进群；
  - `EMGroupStylePublicJoinNeedApproval`——公开群，申请人通过群主和群管理同意后才能进群；
  - `EMGroupStylePublicOpenJoin`——公开群，任何人都可以进群，无需群主和群管理同意。

- 邀请进群是否需要对方同意（`EMGroupOptions#IsInviteNeedConfirm`）

公开群只支持群主和管理员邀请用户入群。对于私有群，除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `EMGroupStyle` 的设置。

邀请入群是否需受邀用户确认取决于群组选项 `EMGroupOptions#IsInviteNeedConfirm` 和受邀用户的参数 `isAutoAcceptGroupInvitation` 的设置，前者的优先级高于后者，即若 `EMGroupOptions#IsInviteNeedConfirm` 设置为 `false`，不论 `isAutoAcceptGroupInvitation` 设置为何值，受邀用户无需确认直接进群。

1. 受邀用户无需确认，直接进群。

以下两种设置的情况下，用户直接进群：

- 若 `EMGroupOptions#IsInviteNeedConfirm` 设置为 `false`，不论 `isAutoAcceptGroupInvitation` 设置为 `false` 或 `true`，受邀用户均无需确认，直接进群。
- 若 `EMGroupOptions#IsInviteNeedConfirm` 和 `isAutoAcceptGroupInvitation` 均设置为 `true`，用户自动接受群组邀请，直接进群。

受邀用户直接进群，会收到如下回调：

- 新成员会收到 `EMGroupManagerDelegate#didJoinGroup` 回调；
- 邀请人收到 `EMGroupManagerDelegate#groupInvitationDidAccept` 回调和 `EMGroupManagerDelegate#userDidJoinGroup` 回调；
- 其他群成员收到 `EMGroupManagerDelegate#userDidJoinGroup` 回调。

2. 受邀用户需要确认才能进群。

只有 `AgoraChatGroupOptions#IsInviteNeedConfirm` 设置为 `true` 和 `isAutoAcceptGroupInvitation` 设置为 `false` 时，受邀用户需要确认才能进群。这种情况下，受邀用户收到 `EMGroupManagerDelegate#onInvitationReceived` 回调，并选择同意或拒绝进群邀请：

- 用户同意入群邀请后，邀请人收到 `EMGroupManagerDelegate#groupInvitationDidAccept` 回调和 `EMGroupManagerDelegate#userDidJoinGroup` 回调；其他群成员收到 `EMGroupManagerDelegate#userDidJoinGroup` 回调；
- 用户拒绝入群邀请后，邀请人收到 `EMGroupManagerDelegate#groupInvitationDidDecline` 回调。

用户可以调用 `createGroup` 方法创建群组，并通过 `EMGroupOptions` 中的参数设置群组名称、群组描述、群组成员和建群原因。

用户加入群组后，将可以收到群消息。

示例代码如下：

```objectivec
EMGroupOptions *options = [[EMGroupOptions alloc] init];
// 设置群组最大成员数量。
options.maxUsersCount = self.maxMemNum;
// 设置 `IsInviteNeedConfirm` 为 `YES`，则邀请用户入群需要用户确认。
options.IsInviteNeedConfirm = YES;
// 设置群组类型。此处示例为成员可以邀请用户入群的私有群组。
options.style = EMGroupStylePrivateMemberCanInvite;
NSArray *members = @{@"member1",@"member2"};
// 调用 `createGroupWithSubject` 创建群组。同步方法，异步方法见 [EMGroupManager createGroupWithSubject:description:invitees:message:setting:completion:]
[[EMClient sharedClient].groupManager createGroupWithSubject:@"subject"
                         description:@"description"
                         invitees:members
                         message:@"message"
                         setting:options
                         error:nil];
```

:::notice
如果 `options.IsInviteNeedConfirm` 设置为 `false`，即直接加被邀请人进群。在此情况下，被邀请人设置非自动进群是不起作用的。
:::

### 解散群组

:::notice
该操作只能群主才能进行。该操作是危险操作，解散群组后，将删除本地数据库及内存中的群相关信息及群会话。
:::

示例代码如下：

```objectivec
//群组解散后，群成员将会收到 `EMGroupManagerDelegate#didLeaveGroup` 回调。
// 同步方法，异步方法见 [EMGroupManager destroyGroup:finishCompletion:]
[[EMClient sharedClient].groupManager destroyGroup:@"groupID"];
```

### 获取群组详情

:::notice
从 3.7.4 版本开始支持是否获取群组成员参数 `fetchMembers`。
对于公有群，用户即使不加入群也能获取群组详情，而对于私有群，用户只有加入了群组才能获取群详情。
:::

群成员也可以调用 `getGroupSpecificationFromServerWithId` 方法从服务器获取群组详情。返回的结果包括群组 ID、群组名称、群组描述、群组基本属性、群主、群组管理员列表、是否已屏蔽群组消息以及群组是否禁用。另外，若将该方法的 `fetchMembers` 参数设置为 `true`，可获取群成员列表，默认最多包括 200 个成员。

```objectivec
// 原型 异步方法
- (void)getGroupSpecificationFromServerWithId:(NSString *)aGroupId
                                   fetchMembers:(BOOL)fetchMembers
                                   completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

// 根据群组 ID 从服务器获取群组详情。
[[EMClient sharedClient].groupManager getGroupSpecificationFromServerWithId:self.group.groupId fetchMembers:YES completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        // EMGroup 中包含了很多群组属性，比如群组 ID、群组成员和是否屏蔽群组消息(isBlocked 属性)等。详情请查看 SDK 中 EMGroup.h 头文件查看。
        NSLog(@"获取群组详情成功");
    } else {
        NSLog(@"获取群组详情失败的原因 --- %@", aError.errorDescription);
    }
}];

// 获取群组管理员列表。
NSArray *admins = aGroup.adminList;
...
```

### 获取群成员列表

- 当群成员少于 200 人时，你可以调用从服务器获取群组详情的方法 `getGroupSpecificationFromServerWithId` 获取获取群成员列表，包括群主、群管理员和普通群成员：

```objectivec
// 第二个参数传入 TRUE，默认取 200 人的群成员列表。
// 同步方法，异步方法见 [EMGroupManager getGroupSpecificationFromServerWithId:fetchMembers:completion:]
EMGroup *group = [[EMClient sharedClient].groupManager
                                          getGroupSpecificationFromServerWithId:@"groupID"
                                          fetchMembers:YES
                                          error:nil];
NSArray *memberList = group.memberList;
```

- 当群成员数量大于等于 200 时，你可以首先调用 `getGroupSpecificationFromServerWithId` 方法获取群主和群管理员，然后调用 `getGroupMemberListFromServerWithId` 方法获取普通群成员列表：

```objectivec
EMGroup *group = [[EMClient sharedClient].groupManager
                                          getGroupSpecificationFromServerWithId:@"groupID"
                                          fetchMembers:NO
                                          error:nil];
NSMutableArray *memberList = [[NSMutableArray alloc]init];
NSInteger pageSize = 50;
NSString *cursor = nil;
EMCursorResult *result = [[EMCursorResult alloc]init];
do {
  // 同步方法，异步方法见 [EMGroupManager getGroupMemberListFromServerWithId:cursor:pageSize:completion:]
    result = [[EMClient sharedClient].groupManager
                                      getGroupMemberListFromServerWithId:@"groupID"
                                      cursor:cursor
                                      pageSize:pageSize
                                      error:nil];
    [memberList addObjectsFromArray:result.list];
    cursor = result.cursor;
} while (result && result.list < pageSize);
```

### 获取群组列表

用户可以调用 `getJoinedGroupsFromServer` 方法从服务器获取自己加入和创建的群组列表。示例代码如下：

```objectivec
// 异步方法
NSArray *groupList = [[EMClient sharedClient].groupManager getJoinedGroupsFromServerWithPage:0 pageSize:20 needMemberCount:YES needRole:YES completion:^(NSArray<EMGroup *> * _Nullable aList, EMError * _Nullable aError) {
        // got group list
    }];
```

- 用户可以调用 `getJoinedGroups` 方法加载本地群组列表。为了保证数据的正确性，需要先从服务器获取自己加入和创建的群组列表。示例代码如下：

```objectivec
// 同步方法，本地缓存加载
NSArray *groupList = [[EMClient sharedClient].groupManager getJoinedGroups];
```

- 用户还可以调用 `getPublicGroupsFromServerWithCursor` 方法分页获取公开群列表：

```objectivec
NSMutableArray *memberList = [[NSMutableArray alloc]init];
NSInteger pageSize = 50;
NSString *cursor = nil;
EMCursorResult *result = [[EMCursorResult alloc]init];
do {
  // 同步方法，异步方法见 [EMGroupManager getPublicGroupsFromServerWithCursor:pageSize:completion:]
    result = [[EMClient sharedClient].groupManager
                                      getPublicGroupsFromServerWithCursor:cursor
                                      pageSize:50
                                      error:nil];
    [memberList addObjectsFromArray:result.list];
    cursor = result.cursor;
} while (result && result.list < pageSize);
```

### 查询当前用户已加入的群组数量

你可以调用 `EMGroupManager#getJoinedGroupsCountFromServerWithCompletion` 方法用于从服务器获取当前用户已加入的群组数量。单个用户可加入群组数量的上限取决于你订阅的即时通讯的套餐包，详见[产品价格](/product/pricing.html#套餐包功能详情)。

```objectivec
[EMClient.sharedClient.groupManager getJoinedGroupsCountFromServerWithCompletion:^(NSInteger groupCount, EMError * _Nullable aError) {
            
    }];
```

### 屏蔽和解除屏蔽群消息

#### 屏蔽群消息

群成员可以调用 `blockGroup` 方法屏蔽群消息。屏蔽群消息后，该成员不再从指定群组接收群消息，群主和群管理员不能进行此操作。示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager blockGroup:completion:]
[[EMClient sharedClient].groupManager blockGroup:@"groupID" error:nil];
```

#### 解除屏蔽群消息

群成员可以调用 `unblockGroup` 方法解除屏蔽群消息。示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager unblockGroup:completion:]
[[EMClient sharedClient].groupManager unblockGroup:@"groupID" error:nil];
```

#### 检查是否已经屏蔽群消息

群成员可以调用 `EMGroup#isBlocked` 检查是否屏蔽了该群的消息。为了保证检查结果的准确性，调用该方法前需先从服务器获取群详情，即调用 `EMGroup#getGroupSpecificationFromServerWithId`。

### 监听群组事件

`IEMGroupManager` 中提供群组事件的监听接口。开发者可以通过设置此监听，获取群组中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```objectivec
// 添加代理。
- (void)viewDidLoad
  {
    [super viewDidLoad];
    [[EMClient sharedClient].groupManager addDelegate:self delegateQueue:nil];
  }
// 移除代理。
- (void)dealloc
  {
    [[EMClient sharedClient].groupManager removeDelegate:self];
  }
```

群组事件如下（在该方法的举例中，用户 A 表示当前用户）：

```objectivec
// 当前用户收到了入群邀请。受邀用户会收到该回调。例如，用户 B 邀请用户 A 入群，则用户 A 会收到该回调。
- (void)groupInvitationDidReceive:(NSString *)aGroupId inviter:(NSString *)aInviter message:(NSString *)aMessage
  {

  }

// 群主或群管理员收到进群申请。群主和所有管理员收到该回调。
- (void)joinGroupRequestDidReceive:(EMGroup *)aGroup user:(NSString *)aUsername reason:(NSString *)aReason
  {

  }

// 群主或群管理员同意用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
- (void)joinGroupRequestDidApprove:(EMGroup *)aGroup
  {

  }

// 群主或群管理员拒绝用户的进群申请。申请人、群主和管理员（除操作者）收到该回调。
- (void)joinGroupRequestDidDecline:(NSString *)aGroupId reason:(NSString *)aReason decliner:(NSString *)aDecliner applicant:(NSString *)aApplicant
  {
    
  }

// 用户同意进群邀请。邀请人收到该回调。
- (void)groupInvitationDidAccept:(EMGroup *)aGroup invitee:(NSString *)aInvitee
  {

  }

// 用户拒绝进群邀请。邀请人收到该回调。
- (void)groupInvitationDidDecline:(EMGroup *)aGroup invitee:(NSString *)aInvitee reason:(NSString *)aReason
  {

  }

// 有用户自动同意加入群组。邀请人收到该回调。
- (void)didJoinGroup:(EMGroup *)aGroup inviter:(NSString *)aInviter message:(NSString *)aMessage
  {

  }

// 有成员被加入群组禁言列表。被禁言的成员及群主和群管理员（除操作者外）会收到该回调。
- (void)groupMuteListDidUpdate:(EMGroup *)aGroup addedMutedMembers:(NSArray *)aMutedMembers muteExpire:(NSInteger)aMuteExpire
  {

  }

// 有成员被移出禁言列表。被解除禁言的成员及群主和群管理员（除操作者外）会收到该回调。
- (void)groupMuteListDidUpdate:(EMGroup *)aGroup removedMutedMembers:(NSArray *)aMutedMembers
  {

  }

// 有成员被加入群组白名单。被添加的成员及群主和群管理员（除操作者外）会收到该回调。
- (void)groupWhiteListDidUpdate:(EMGroup *)aGroup addedWhiteListMembers:(NSArray *)aMembers
  {

  }

// 有成员被移出群组白名单。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
- (void)groupWhiteListDidUpdate:(EMGroup *)aGroup removedWhiteListMembers:(NSArray *)aMembers
  {

  }

// 全员禁言状态变化。群组所有成员（除操作者外）会收到该回调。
- (void)groupAllMemberMuteChanged:(EMGroup *)aGroup isAllMemberMuted:(BOOL)aMuted
  {

  }

// 设置管理员。群主、新管理员和其他管理员会收到该回调。
- (void)groupAdminListDidUpdate:(EMGroup *)aGroup addedAdmin:(NSString *)aAdmin
  {

  }

// 群组管理员被移除。被移出的成员及群主和群管理员（除操作者外）会收到该回调。
- (void)groupAdminListDidUpdate:(EMGroup *)aGroup removedAdmin:(NSString *)aAdmin
  {

  }

// 群主变更。原群主和新群主会收到该回调。
- (void)groupOwnerDidUpdate:(EMGroup *)aGroup newOwner:(NSString *)aNewOwner oldOwner:(NSString *)aOldOwner
  {

  }

// 有新成员加入群组。除了新成员，其他群成员会收到该回调。
- (void)userDidJoinGroup:(EMGroup *)aGroup user:(NSString *)aUsername
  {

  }

// 有成员主动退出群。除了退群的成员，其他群成员会收到该回调。
- (void)userDidLeaveGroup:(EMGroup *)aGroup user:(NSString *)aUsername
  {

  }

// 有成员被移出群组。被移出的成员收到该事件。
- (void)didLeaveGroup:(EMGroup *_Nonnull)aGroup reason:(EMGroupLeaveReason)aReason
  {
    
  }  

// 群组公告更新。群组所有成员会收到该回调。
- (void)groupAnnouncementDidUpdate:(EMGroup *)aGroup announcement:(NSString *)aAnnouncement
  {

  }

// 有成员新上传群组共享文件。群组所有成员会收到该回调。
- (void)groupFileListDidUpdate:(EMGroup *)aGroup addedSharedFile:(EMGroupSharedFile *)aSharedFile
  {

  }

// 群组共享文件被删除。群组所有成员会收到该回调。
- (void)groupFileListDidUpdate:(EMGroup *)aGroup removedSharedFile:(NSString *)aFileId
  {

  }

// 群组详情变更。群组所有成员会收到该回调。
- (void)groupSpecificationDidUpdate:(EMGroup *)aGroup
  {

  }

// 设置群成员自定义属性。群内其他成员会收到该回调。
- (void)onAttributesChangedOfGroupMember:(NSString *)groupId userId:(NSString *)userId attributes:(NSDictionary<NSString *,NSString *> *)attributes operatorId:(NSString *)operatorId {
    [self showAlertWithMessage:[NSString stringWithFormat:@"%@ changed %@ attributes %@ in %@",operatorId,userId,attributes,groupId]];
}
```
