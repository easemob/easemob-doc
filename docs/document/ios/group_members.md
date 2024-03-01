# 管理群组成员

<Toc />

群组是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中实现群组成员管理相关功能。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMGroupManager` 类和 `EMGroup` 类用于群组管理，支持你通过调用 API 在项目中实现如下功能：

- 加入、退出群组
- 管理群成员的自定义属性
- 管理群主及群管理员
- 管理群组白名单
- 管理群组黑名单
- 管理群组禁言

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。
- 了解群成员角色，详见 [群组功能介绍](group_overview.html)。
- 了解群组和群成员的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 加入群组

用户进群分为两种方式：主动申请入群和群成员邀请入群。

公开群和私有群在两种入群方式方面存在差别：

| 入群方式                   | 公开群                                                                                             | 私有群                                                                                             |
| :------------------------- | :------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------- |
| 是否支持用户申请入群       | 支持 <br/>任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型 `EMGroupStyle` 的设置。 | 不支持                                                                                             |
| 是否支持群成员邀请用户入群 | 支持 <br/>只能由群主和管理员邀请。                                                                 | 支持 <br/>除了群主和群管理员，群成员是否也能邀请其他用户进群取决于群组类型 `EMGroupStyle` 的设置。 |

#### 用户申请入群

只有公开群支持用户申请入群，私有群不支持。用户可获取公开群列表，选择相应的群组 ID，然后调用相应方法加入该群组。

任何用户均可申请入群，是否需要群主和群管理员审批，取决于群组类型（`EMGroupStyle`）的设置：

- `EMGroupStyle` 为 `EMGroupStylePrivateOnlyOwnerInvite` 时，群主和群管理员审批后，用户才能加入群组；
- `EMGroupStyle` 为 `EMGroupStylePrivateMemberCanInvite` 时，用户可直接加入群组，无需群主和群管理员审批。

若申请加入公开群，申请人需执行以下步骤：

1. 调用 `getPublicGroupsFromServerWithCursor` 方法从服务器获取公开群列表，查询到想要加入的群组 ID。示例代码如下：

```objective-c
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

2. 调用 `joinPublicGroup` 或 `requestToJoinPublicGroup` 方法传入群组 ID，申请加入对应群组。

- 调用 `joinPublicGroup` 方法加入无需群主或管理员审批的公开群，即 `EMGroupStyle` 为 `EMGroupStylePublicOpenJoin`。申请人不会收到任何回调，其他群成员会收到 `EMGroupManagerDelegate#userDidJoinGroup` 回调。

示例代码如下：

```objective-c
// 异步方法
[[EMClient sharedClient].groupManager joinPublicGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
 }];
```

- 调用 `requestToJoinPublicGroup` 方法加入需要群主或管理员审批的公开群，即 `EMGroupStyle` 为 `EMGroupStylePublicJoinNeedApproval`。示例代码如下：

```objective-c
// 异步方法
[[EMClient sharedClient].groupManager requestToJoinPublicGroup:@"groupId" message:nil completion:^(EMGroup *aGroup1, EMError *aError) {
}];
```

群主或群管理员收到 `EMGroupManagerDelegate#joinGroupRequestDidReceive` 回调。

- 若同意加入群组，需要调用 `approveJoinGroupRequest` 方法。

申请人会收到 `EMGroupManagerDelegate#joinGroupRequestDidApprove` 回调，其他群成员会收到 `EMGroupManagerDelegate#userDidJoinGroup` 回调。

示例代码如下：

```objective-c
// 异步方法
[[EMClient sharedClient].groupManager approveJoinGroupRequest:@"groupId" sender:@"userId" completion:^(EMGroup *aGroup, EMError *aError) {

}];
```

- 若群主或群管理员拒绝申请人入群，需要调用 `declineJoinGroupRequest` 方法。申请人会收到 `EMGroupManagerDelegate#joinGroupRequestDidDecline` 回调。

示例代码如下：

```objective-c
// 异步方法
[[EMClient sharedClient].groupManager declineJoinGroupRequest:@"groupId" sender:@"userId" reason:@"reason" completion:^(EMGroup *aGroup, EMError *aError) {

 }];
```

#### 邀请用户入群

邀请用户入群的方式详见 [邀请用户入群的配置](./group_manage.html#创建群组)。

邀请用户入群流程如下：

1. 群成员邀请用户入群。

   - 群主或群管理员可以邀请人入群，对于私有群 `EMGroupStyle` 设置为 `EMGroupStylePrivateMemberCanInvite` 时，普通群成员也可以邀请人进群。邀请人入群需要调用 `addMembers` 方法：

   ```objective-c
   // 异步方法
   [[EMClient sharedClient].groupManager addMembers:@{@"member1",@"member2"}
                         toGroup:@"groupID"
                         message:@"message"
                         completion:nil];
   ```

2. 受邀用户自动进群或确认是否加入群组：

   - 受邀用户同意加入群组，需要调用 `acceptInvitationFromGroup` 方法。

   ```objective-c
   [[EMClient sharedClient].groupManager acceptInvitationFromGroup:@"groupId" inviter:@"userId" completion:^(EMGroup *aGroup, EMError *aError) {
   }];
   ```

   - 受邀人拒绝入群组，需要调用 `declineGroupInvitation` 方法。

   ```objective-c
   [[EMClient sharedClient].groupManager declineGroupInvitation:@"groupId" inviter:@"inviter" reason:@"reason" completion:^(EMError *aError) {

   }];
   ```

### 退出群组

#### 群成员主动退出群组

群成员可以调用 `leaveGroup` 方法退出群组，其他成员将会收到群组事件回调 `EMGroupManagerDelegate#userDidLeaveGroup`。

退出群组后，该用户将不再收到群消息。群主不能调用该接口退出群组，只能调用 `destroyGroup` 解散群组。

示例代码如下：

```objectivec
// 同步方法，异步方法见 [EMGroupManager leaveGroup:completion:]
[[EMClient sharedClient].groupManager leaveGroup:@"groupID" error:nil];
```

#### 群成员被移出群组

仅群主和群管理员可以调用 `removeMembers` 方法将单个或多个成员移出群组。被踢出群组后，被踢群成员将会收到群组事件回调 `EMGroupManagerDelegate#didLeaveGroup`，其他成员将会收到回调 `EMGroupManagerDelegate#userDidLeaveGroup`。被移出群组后，该用户还可以再次加入群组。

示例代码如下：

```objectivec
// 异步方法
 [EMClient.sharedClient.groupManager removeMembers:@[@"member1",@"member2"] fromGroup:@"groupId" completion:^(EMGroup * _Nullable aGroup, EMError * _Nullable aError) {
            
    }];
```

### 管理群成员的自定义属性

群成员可设置自定义属性（key-value），例如在群组中的昵称和头像等。

- 单个群成员的自定义属性总长度不能超过 4 KB。对于单个自定义属性，属性 key 不能超过 16 字节，value 不能超过 512 个字节，否则会报错。

- 群主可修改所有群成员的自定义属性，其他群成员只能修改自己的自定义属性。

#### 设置群成员自定义属性

你可以调用 `EMGroupManager#setMemberAttribute` 方法设置指定群成员的自定义属性。自定义属性为 key-value 格式，key 表示属性名称，value 表示属性值，若 value 设置空字符串即删除该自定义属性。

设置后，群内其他成员会收到 `EMGroupManagerDelegate#onAttributesChangedOfGroupMember` 事件。

示例代码如下：

```objectivec
        [EMClient.sharedClient.groupManager setMemberAttribute:groupId userId:userName attributes:@{key:value} completion:^(EMError * _Nullable error) {
        if (error == nil) {
            [self updateCacheWithGroupId:groupId userName:userName key:key value:value];
        }
        if (completion) {
            completion(error);
        }
    }];
```

#### 获取单个群成员的所有自定义属性

你可以调用 `EMGroupManager#fetchMemberAttribute` 方法获取单个群成员的所有自定义属性。

示例代码如下：

```objectivec
        [EMClient.sharedClient.groupManager fetchMemberAttribute:aGroupId userId:EMClient.sharedClient.currentUsername completion:^(NSDictionary<NSString *,NSString *> * _Nullable attributes, EMError * _Nullable error) {
            if (error == nil) {
                //refresh UI according to attributes or cache.
            }
        }];
```

#### 根据属性 key 获取多个群成员的自定义属性

你可调用 `EMGroupManager#fetchMembersAttributes` 方法根据指定的属性 key 获取多个群成员的自定义属性。

:::notice
每次最多可获取 10 个群成员的自定义属性。
:::

示例代码如下：

```objectivec
   // keys：要获取自定义属性的 key 的数组。若 keys 为空数组或不传则获取这些成员的所有自定义属性。
    [EMClient.sharedClient.groupManager fetchMembersAttributes:groupId userIds:@[userId] keys:@[@"1",@"2"] completion:^(NSDictionary<NSString *,NSDictionary<NSString *,NSString *> *> * _Nullable attributes, EMError * _Nullable error) {
            //根据获取的自定义属性或缓存刷新 UI。
    }];
```

### 管理群主和群管理员

#### 变更群主

仅群主可以调用 `updateGroupOwner` 方法将群所有权移交给指定群成员。成功移交后，原群主变为普通成员，其他群组成员收到 `EMGroupManagerDelegate#groupOwnerDidUpdate` 回调。

示例如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager updateGroupOwner:@"groupID"
                         newOwner:@"newOwner"
                       completion:nil];
```

#### 添加群组管理员

仅群主可以调用 `addAdmin` 方法添加群管理员。成功添加后，新管理员和其他管理员会接收到群组事件回调 `EMGroupManagerDelegate#groupAdminListDidUpdate`。

管理员除了不能解散群组等少数权限外，拥有对群组的绝大部分权限。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager addAdmin:@"member"
                         toGroup:@"groupID"
                      completion:nil];
```

#### 移除群组管理员权限

仅群主可以调用 `removeAdmin` 方法移除群管理员。

群管理员被移除群管理权限后将只具备普通群成员的权限。移除管理员权限的成员和其他管理员会接收到群组事件回调 `EMGroupManagerDelegate#groupAdminListDidUpdate`。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager removeAdmin:@"admin"
                         fromGroup:@"groupID"
                        completion:nil];
```

### 管理群组白名单

群主和群组中的管理员默认会被加入群组白名单。

#### 将成员加入群组白名单

仅群主和群管理员可以调用 `addWhiteListMembers` 方法将指定群成员加入群白名单。群成员被添加至群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调`EMGroupManagerDelegate#groupWhiteListDidUpdate`。

即使开启了群组全员禁言，群组白名单中的成员仍可以发送群组消息。不过，禁言列表上的用户即使加入了群白名单仍无法在群组中发送消息。

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager addWhiteListMembers:members
                         fromGroup:@"groupID"
                         error:nil];
```

#### 将成员移出群组白名单

仅群主和群管理员可以调用 `removeWhiteListMembers` 方法将指定群成员移出群白名单。

群成员被群主或者群管理员移除群白名单后，该群成员及其他未操作的群管理员和群主将会收到群组事件回调 `EMGroupManagerDelegate#groupWhiteListDidUpdate`。

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager removeWhiteListMembers:members
                         fromGroup:@"groupID"
                         completion:nil];
```

#### 检查自己是否在白名单中

所有群成员可以调用 `isMemberInWhiteListFromServerWithGroupId` 方法检查自己是否在群白名单中，示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager
                         isMemberInWhiteListFromServerWithGroupId:@"groupID"
                         completion:nil];
```

#### 获取群组白名单

仅群主和群管理员可以调用 `getGroupWhiteListFromServerWithId` 方法从服务器获取当前群组的白名单。

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager getGroupWhiteListFromServerWithId:@"groupID" completion:nil];
```

### 管理群组黑名单

群主及群管理员可以将指定群成员加入或者移出群黑名单。群成员被加入黑名单后将无法收发群消息。

#### 将群成员加入群组黑名单

仅群主和群管理员可以调用 `blockMembers` 方法将指定成员添加至黑名单。被加入黑名单后，该成员收到 `EMGroupManagerDelegate#didLeaveGroup` 回调。其他群成员会收到该成员退出群组的回调，如需该回调，请联系商务开通。黑名单中的成员会被移出群组，无法再收发群消息，只有先被移出黑名单才能重新加入群组。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager blockMembers:members
                         fromGroup:@"groupID"
                         completion:nil];
```

#### 将成员移出群组黑名单

仅群主和群管理员可以调用 `unblockUser` 方法将成员移出群组黑名单。指定用户被群主或者群管理员移出群黑名单后，可以再次申请加入群组。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager unblockMembers:members
                         fromGroup:@"groupID"
                         completion:nil];
```

#### 获取群组的黑名单用户列表

仅群主和群管理员可以调用 `getGroupBlacklistFromServerWithId` 方法获取当前群组的黑名单。默认最多取 200 个。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager getGroupBlacklistFromServerWithId:@"groupId"
                         pageNumber:pageNumber
                         pageSize:pageSize
                         completion:nil];
```

### 管理群组禁言

群主和群管理员若对单个或多个群成员禁言或解除禁言，可将其添加至或移出群组禁言列表。此外，群主和群管理员也可开启或关闭全员禁言。

全员禁言和单独的成员禁言不冲突，开启和关闭全员禁言，并不影响群组禁言列表。

#### 将成员加入群组禁言列表

为了精细化管理群成员发言，群主和群成员可以根据情况将指定群成员加入或者移出群禁言列表。群成员被加入群禁言列表后，将不能够发言，即使其被加入群白名单也不能发言。

仅群主和群管理员可以调用 `muteMembers` 方法将指定成员添加至群组禁言列表。

群成员被移出禁言列表后可以在群组中正常发送消息，被禁言成员和其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupManagerDelegate#groupMuteListDidUpdate`。

```objectivec
// 异步方法
// `muteMilliseconds`：禁言时间。传 -1 表示永久禁言。
[[EMClient sharedClient].groupManager muteMembers:members
                         muteMilliseconds:60
                         fromGroup:@"groupID"
                        completion:nil];
```

#### 将成员移出群组禁言列表

仅群主和群管理员可以调用 `unmuteMembers` 方法将指定成员移出群组禁言列表。

群成员被群主或者群管理员移出禁言列表后，被移出的群成员及其他未操作的管理员或者群主将会收到群组事件回调 `EMGroupManagerDelegate#groupMuteListDidUpdate`。

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager unmuteMembers:members
                         fromGroup:@"groupID"
                        completion:nil];
```

#### 获取群组禁言列表

仅群主和群管理员可以调用 `getGroupMuteListFromServerWithId` 方法从服务器获取当前群组的禁言列表。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager getGroupMuteListFromServerWithId:@"groupID"
                         pageNumber:pageNumber
                         pageSize:pageSize
                       completion:nil];
```

#### 开启群组全员禁言

仅群主和群管理员可以调用 `muteAllMembersFromGroup` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `unmuteAllMembersFromGroup` 方法解除全员禁言。

群主和群管理员开启群组全员禁言后，除了白名单中的群成员，其他成员将不能发言。开启群组全员禁言后，群成员会收到群组事件回调 `EMGroupManagerDelegate#groupAllMemberMuteChanged`。

群组全员禁言状态（`EMGroup#isMuteAllMembers`）存储在本地数据库中，下次登录时可以直接从本地获取到。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager muteAllMembersFromGroup:@"groupID" completion:nil];
```

#### 关闭群组全员禁言

仅群主和群管理员可以调用 `unmuteAllMembersFromGroup` 方法取消全员禁言。关闭群组全员禁言后，群成员将会收到群组事件回调 `EMGroupManagerDelegate#groupAllMemberMuteChanged`。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].groupManager unmuteAllMembersFromGroup:@"groupID" completion:nil];
```

### 监听群组事件

详见 [监听群组事件](group_manage.html#监听群组事件)。
