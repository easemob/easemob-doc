# 群组管理


**注意**：`1、群主+管理员 一起一共不超过 100 个，也就是不超过 99 个管理员。2、群组成员最大数（包括群主）取决于所选择的版本，不同版本最大数不同。`


群组管理主要涉及到的环信 SDK 头文件如下:

```
// 群组部分，有群组id等属性
EMGroup.h

// 群组属性选项部分，用于创建群组时的属性设置
EMGroupOptions.h

// 群组共享文件部分
EMGroupSharedFile.h

// 群组方法调用部分，比如添加代理，移除代理，创建群组，获取群组列表等
IEMGroupManager.h

// 群组的协议回调方法部分，比如监听有用户加群的回调方法等
EMGroupManagerDelegate.h
```

注册群组模块回调：

```
协议: EMGroupManagerDelegate

代理：
//注册群组回调
[[EMClient sharedClient].groupManager addDelegate:self delegateQueue:nil];

//移除群组回调
[[EMClient sharedClient].groupManager removeDelegate:self];
```

------

群组分为四种类型。

```
/*!
 @enum
 @brief 群组类型
 @constant EMGroupStylePrivateOnlyOwnerInvite 私有群组，创建完成后，只允许 Owner 邀请用户加入
 @constant EMGroupStylePrivateMemberCanInvite 私有群组，创建完成后，只允许 Owner 和群成员邀请用户加入
 @constant EMGroupStylePublicJoinNeedApproval 公开群组，创建完成后，只允许 Owner 邀请用户加入; 非群成员用户需发送入群申请，Owner 同意后才能入组
 @constant EMGroupStylePublicOpenJoin         公开群组，创建完成后，允许非群组成员加入，不需要管理员同意
 @discussion
    eGroupStyle+Private：私有群组，只允许群组成员邀请人进入
    eGroupStyle+Public： 公有群组，允许非群组成员加入
 */
typedef NS_ENUM(NSInteger, EMGroupStyle){
    EMGroupStylePrivateOnlyOwnerInvite  = 0,
    EMGroupStylePrivateMemberCanInvite,
    EMGroupStylePublicJoinNeedApproval,
    EMGroupStylePublicOpenJoin,
};
```

## 群组操作

### 创建群组

目前创建群组支持的配置属性有：

- 群名称
- 群描述
- 群人数（默认2000人，支持修改）
- 群类型（即上面提到的四种群组类型）

异步方法：

```
EMGroupOptions *setting = [[EMGroupOptions alloc] init]; // 群组属性选项
    setting.maxUsersCount = 500; // 群组的最大成员数(含群主、管理员，默认是2000，最大8000)
    setting.IsInviteNeedConfirm = NO; //邀请群成员时，是否需要发送邀请通知.若NO，被邀请的人自动加入群组
    setting.style = EMGroupStylePublicOpenJoin;// 创建不同类型的群组，这里需要才传入不同的类型
    setting.ext = @"群组扩展信息"; // 扩展信息
    
/*!
 *  创建群组
 *  
 *  异步方法
 *
 *  @param aSubject        群组名称
 *  @param aDescription    群组描述
 *  @param aInvitees       群组成员（不包括创建者自己，不能超过100个）
 *  @param aMessage        邀请消息
 *  @param aSetting        群组属性
 *  @param pError          出错信息
 *
 *  @return    创建的群组
 */
- (void)createGroupWithSubject:(NSString *)aSubject
                   description:(NSString *)aDescription
                      invitees:(NSArray *)aInvitees
                       message:(NSString *)aMessage
                       setting:(EMGroupOptions *)aSetting
                    completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
               
// 调用:                    
[[EMClient sharedClient].groupManager createGroupWithSubject:@"群组名称" description:@"群组描述" invitees:@[@"6001",@"6002"] message:@"邀请您加入群组" setting:setting completion:^(EMGroup *aGroup, EMError *aError) {
    if(!aError){
        NSLog(@"创建群组成功 -- %@",aGroup);
    } else {
        NSLog(@"创建群组失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取群详情

```
注意:从3.7.4版本开始支持 “是否获取群组成员”参数
/*!
 *  获取群组详情,包含群组ID,群组名称，群组描述，群组基本属性，群组Owner, 群组管理员
 *
 *  @param aGroupId              群组ID
 *  @param fetchMembers     是否获取群组成员，默认最多取200人数
 *  @param aCompletionBlock      完成的回调
 *
 */
- (void)getGroupSpecificationFromServerWithId:(NSString *)aGroupId
                                   fetchMembers:(BOOL)fetchMembers
                                   completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                                   
//调用:                       
[[EMClient sharedClient].groupManager getGroupSpecificationFromServerWithId:self.group.groupId fetchMembers:YES completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        // EMGroup中包含了很多群组属性，比如群组id，群组成员，是否屏蔽群组消息(isBlocked属性)等，具体到SDK中EMGroup.h头文件查看
        NSLog(@"获取群组详情成功");
    } else {
        NSLog(@"获取群组详情失败的原因 --- %@", aError.errorDescription);
    }                
}];             
```

### 加入群组

群组分4种类型，目前 SDK 不支持自主选择是否进群。我们将针对每种类型讲解加入群组要进行的操作。

- EMGroupStylePrivateOnlyOwnerInvite: 该类型的群组只允许群主（Owner）添加人进群，其他人无法主动加入。
- EMGroupStylePrivateMemberCanInvite: （推荐使用）该类型的群组允许所有群成员添加人进群，其他人无法主动加入。
- EMGroupStylePublicJoinNeedApproval: （推荐使用）该类型的群组只允许群主（Owner）添加人进群；其他人想进入群组的话，需要先发送申请，群主同意申请之后才能进群；其他人无法主动加入。
- EMGroupStylePublicOpenJoin: （不推荐使用）该类型的群组允许任何人主动加入群组。

#### 添加人进群

被添加的人会收到回调：

```
/*!
 *  SDK自动同意了用户A的加B入群邀请后，用户B接收到该回调，需要设置EMGroupOptions的isAutoAcceptGroupInvitation为YES
 *
 *  @param aGroup    群组实例
 *  @param aInviter  邀请者
 *  @param aMessage  邀请消息
 */
- (void)didJoinGroup:(EMGroup *)aGroup
             inviter:(NSString *)aInviter
             message:(NSString *)aMessage;     
```

加人接口如下：

```
/*!
 *  邀请用户加入群组
 *
 *  @param aUsers           被邀请的用户名列表
 *  @param aGroupId         群组ID
 *  @param aMessage         欢迎信息
 *  @param aCompletionBlock 完成的回调
 */
- (void)addMembers:(NSArray *)aUsers
           toGroup:(NSString *)aGroupId
           message:(NSString *)aMessage
        completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
        
// 调用:        
[[EMClient sharedClient].groupManager addMembers:@[@"user1"] toGroup:@"groupId" message:@"邀请您加入群组" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"邀请加群成功 --- %@", aGroup);
    } else {
        NSLog(@"邀请加群失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 发送进群申请

```
/*!
 *  申请加入一个需批准的公开群组，群类型应该是EMGroupStylePublicJoinNeedApproval
 *
 *  @param aGroupId         公开群组的ID
 *  @param aMessage         请求加入的信息
 *  @param aCompletionBlock 完成的回调
 */
- (void)requestToJoinPublicGroup:(NSString *)aGroupId
                         message:(NSString *)aMessage
                      completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                      
// 调用:                     
[[EMClient sharedClient].groupManager requestToJoinPublicGroup:@"groupId" message:@"申请加入群组" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"申请加公开群成功 --- %@", aGroup);
    } else {
        NSLog(@"申请加公开群失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 处理进群申请

只有 Owner 有权限处理进群申请。

1. 收到进群申请。

```
/*!
 *  群组的群主收到用户的入群申请，群的类型是EMGroupStylePublicJoinNeedApproval
 *
 *  @param aGroup     群组实例
 *  @param aApplicant 申请者
 *  @param aReason    申请者的附属信息
 */
- (void)joinGroupRequestDidReceive:(EMGroup *)aGroup
                              user:(NSString *)aUsername
                            reason:(NSString *)aReason;
```

2. 同意进群申请。

```
/*!
 *  批准入群申请, 需要Owner权限
 *
 *  @param aGroupId         所申请的群组ID
 *  @param aUsername        申请人
 *  @param aCompletionBlock 完成的回调
 */
- (void)approveJoinGroupRequest:(NSString *)aGroupId
                         sender:(NSString *)aUsername
                     completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

//调用:
[[EMClient sharedClient].groupManager approveJoinGroupRequest:@"groupId" sender:@"userId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"批准入群申请成功 --- %@", aGroup);
    } else {
        NSLog(@"批准入群申请失败的原因 --- %@", aError.errorDescription);
    }
}];
```

3. 拒绝加群申请。

```
/*!
 *  拒绝入群申请, 需要Owner权限
 *
 *  @param aGroupId         被拒绝的群组ID
 *  @param aUsername        申请人
 *  @param aReason          拒绝理由
 *  @param aCompletionBlock 完成的回调
 */
- (void)declineJoinGroupRequest:(NSString *)aGroupId
                         sender:(NSString *)aUsername
                         reason:(NSString *)aReason
                     completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                     
// 调用:
[[EMClient sharedClient].groupManager declineJoinGroupRequest:@"groupId" sender:@"userId" reason:@"拒绝的原因" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"拒绝入群申请成功 --- %@", aGroup);
    } else {
        NSLog(@"拒绝入群申请失败的原因 --- %@", aError.errorDescription);
    }
}];                     
```

#### 加入 EMGroupStylePublicOpenJoin 类型的群组

```
/*!
 *  加入一个公开群组，群类型应该是EMGroupStylePublicOpenJoin
 *
 *  @param aGroupId         公开群组的ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)joinPublicGroup:(NSString *)aGroupId
             completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
             
// 调用:
[[EMClient sharedClient].groupManager joinPublicGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"加入公开群成功 --- %@", aGroup);
    } else {
        NSLog(@"加入公开群失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 退出群组

群主（Owner）不支持退群操作，只能解散群。

退出群组分为主动退群和被动退群。被动退群即为被 Owner 踢出群组。

#### 主动退群

```
/*!
 *  退出群组，owner不能退出群，只能销毁群
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)leaveGroup:(NSString *)aGroupId
        completion:(void (^)(EMError *aError))aCompletionBlock;
        
// 调用:
[[EMClient sharedClient].groupManager leaveGroup:@"groupId" completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"退出群组成功");
    } else {
        NSLog(@"退出群组失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 被动退群

会通过以下回调通知被踢者。

```
/*!
 *  离开群组回调
 *
 *  @param aGroup    群组实例
 *  @param aReason   离开原因
 */
- (void)didLeaveGroup:(EMGroup *)aGroup
               reason:(EMGroupLeaveReason)aReason;
```

### 解散群组

解散群组需要 Owner 权限。

```
/*!
 *  解散群组, 需要owner权限
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)destroyGroup:(NSString *)aGroupId
    finishCompletion:(void (^)(EMError *aError))aCompletionBlock;
    
// 调用:    
[[EMClient sharedClient].groupManager destroyGroup:@"groupId" finishCompletion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"解散群组成功");
    } else {
        NSLog(@"解散群组失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 修改群主题(名称)

只有 Owner 有权限修改。

```
/*!
 *  \~chinese
 *  更改群组主题, 需要owner权限
 *
 *  @param aSubject         新主题
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 *
 *
 *  \~english
 *  Change the group subject, owner‘s authority is required
 *
 *  @param aSubject         New group‘s subject
 *  @param aGroupId         Group id
 *  @param aCompletionBlock The callback block of completion
 *
 */
- (void)updateGroupSubject:(NSString *)aSubject
                  forGroup:(NSString *)aGroupId
                completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                
// 调用:                
[[EMClient sharedClient].groupManager updateGroupSubject:@"更改群组主题" forGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"更改群组主题成功 --- %@", aGroup.subject);
    } else {
        NSLog(@"更改群组主题失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 修改群描述

**不推荐使用** ，只有 Owner 有权限操作。

```
/*!
 *  更改群组说明信息, 需要owner权限
 *
 *  @param aDescription     说明信息
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateDescription:(NSString *)aDescription
                 forGroup:(NSString *)aGroupId
               completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
               
// 调用:               
[[EMClient sharedClient].groupManager updateDescription:@"更改群组说明信息" forGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"群组说明信息更改成功 --- %@", aGroup.description);
    } else {
        NSLog(@"群组说明信息更改失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取群组成员列表

按照群成员进群时间先后排序，后进群排在前面。

```
/*!
 *  获取群组成员列表
 *
 *  @param aGroupId         群组ID
 *  @param aCursor          游标
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupMemberListFromServerWithId:(NSString *)aGroupId
                                    cursor:(NSString *)aCursor
                                  pageSize:(NSInteger)aPageSize
                                completion:(void (^)(EMCursorResult *aResult, EMError *aError))aCompletionBlock;

// 调用:                                 
[[EMClient sharedClient].groupManager getGroupMemberListFromServerWithId:@"groupId" cursor:@"cursor" pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
    if (!aError) {
        // aResult.list: 返回的成员列表，内部的值是成员的环信id。
        // aResult.cursor: 返回的cursor，如果要取下一页的列表，需要将这个cursor当参数传入到获取群组成员列表中。
        NSLog(@"获取群组成员列表成功 --- %@", aResult);
    } else {
        NSLog(@"获取群组成员列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取群组群主及群组管理员

建议先获取到群组详情，然后从返回的aGroup对象中获取群主以及管理员。

```
// 获取群组详情的方法
[[EMClient sharedClient].groupManager getGroupSpecificationFromServerWithId:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        // 获取群主
        NSString *owner = aGroup.owner;

        // 获取群管理
        NSArray *adminList = aGroup.adminList;
    } else {
        NSLog(@"获取失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取群组黑名单列表

需要owner或admin权限

```
/*!
 *  获取群组黑名单列表, 需要owner/admin权限
 *
 *  @param aGroupId         群组ID
 *  @param aPageNum         获取第几页
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupBlacklistFromServerWithId:(NSString *)aGroupId
                               pageNumber:(NSInteger)aPageNum
                                 pageSize:(NSInteger)aPageSize
                               completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].groupManager getGroupBlacklistFromServerWithId:@"groupId" pageNumber:1 pageSize:50 completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取群组黑名单列表成功 --- %@", aList);
    } else {
        NSLog(@"获取群组黑名单列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以运行白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
/*!
 *  \~chinese
 *  添加白名单，需要Owner / Admin权限
 *
 *  @param aMembers         被添加的列表<NSString>
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)addWhiteListMembers:(NSArray *)aMembers
                  fromGroup:(NSString *)aGroupId
                 completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                 
/*!
 *  \~chinese
 *  移除白名单，需要Owner / Admin权限
 *
 *  @param aMembers         被移除的列表<NSString>
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeWhiteListMembers:(NSArray *)aMembers
                   fromGroup:(NSString *)aGroupId
                  completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                    
                    
/*!
 *  \~chinese
 *  查看自己是否在群组白名单中
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)isMemberInWhiteListFromServerWithGroupId:(NSString *)aGroupId
                                      completion:(void (^)(BOOL inWhiteList, EMError *aError))aCompletionBlock;
                                              
                                              
/*!
 *  \~chinese
 *  获取群组白名单列表
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupWhiteListFromServerWithId:(NSString *)aGroupId
                               completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
```

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
/*!
 *  \~chinese
 *  设置全员禁言，需要Owner / Admin权限
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)muteAllMembersFromGroup:(NSString *)aGroupId
                     completion:(void(^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
                        
                        
/*!
 *  \~chinese
 *  解除全员禁言，需要Owner / Admin权限
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unmuteAllMembersFromGroup:(NSString *)aGroupId
                       completion:(void(^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
```

### 获取被禁言列表

需要owner或admin权限

```
/*!
 *  获取群组被禁言列表
 *
 *  @param aGroupId         群组ID
 *  @param aPageNum         获取第几页
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupMuteListFromServerWithId:(NSString *)aGroupId
                              pageNumber:(NSInteger)aPageNum
                                pageSize:(NSInteger)aPageSize
                              completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
   
// 调用:                             
[[EMClient sharedClient].groupManager getGroupMuteListFromServerWithId:@"groupId" pageNumber:1 pageSize:50 completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取群组被禁言列表成功 --- %@", aList);
    } else {
        NSLog(@"获取群组被禁言列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取群公告

```
/*!
 *  获取群公告
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupAnnouncementWithId:(NSString *)aGroupId
                        completion:(void (^)(NSString *aAnnouncement, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager getGroupAnnouncementWithId:@"groupId" completion:^(NSString *aAnnouncement, EMError *aError) {
    if(!aError){
        NSLog(@"获取群公告成功 --- %@", aAnnouncement);
    } else {
        NSLog(@"获取群公告失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 修改群公告

```
/*!
 *  修改群公告，需要Owner / Admin权限
 *
 *  @param aGroupId         群ID
 *  @param aAnnouncement    群公告
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateGroupAnnouncementWithId:(NSString *)aGroupId
                         announcement:(NSString *)aAnnouncement
                           completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
// 调用:
[[EMClient sharedClient].groupManager updateGroupAnnouncementWithId:@"groupId" announcement:@"announcement" completion:^(EMGroup *aGroup, EMError *aError) {
    if(!aError){
        NSLog(@"修改群公告成功");
    } else {
        NSLog(@"修改群公告失败的原因 --- %@", aError.errorDescription);
    }
}];
```

当群主或者管理员修改群公告时，其它群成员会收到群公告更新的回调

```
/*!
 *  群公告有更新
 *
 *  @param aGroup           群组
 *  @param aAnnouncement    群公告
 */
- (void)groupAnnouncementDidUpdate:(EMGroup *)aGroup
                      announcement:(NSString *)aAnnouncement;
```

### 获取群共享文件列表

```
/*!
 *  获取群共享文件列表
 *
 *  @param aGroupId         群组ID
 *  @param aPageNum         获取第几页
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getGroupFileListWithId:(NSString *)aGroupId
                    pageNumber:(NSInteger)aPageNum
                      pageSize:(NSInteger)aPageSize
                    completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager getGroupFileListWithId:@"groupId" pageNumber:1 pageSize:10 completion:^(NSArray *aList, EMError *aError) {
    if(!aError){
        // aList数组里面是 EMGroupSharedFile 对象
        NSLog(@"获取群共享文件列表成功 --- %@", aList);
    } else {
        NSLog(@"获取群共享文件列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 上传下载群共享文件

```
/*!
 *  上传群共享文件
 *
 *  @param aGroupId         群ID
 *  @param aFilePath        文件路径
 *  @param pError           错误信息
 *
 *  @result    群实例
 */
- (void)uploadGroupSharedFileWithId:(NSString *)aGroupId
                           filePath:(NSString*)aFilePath
                           progress:(void (^)(int progress))aProgressBlock
                         completion:(void (^)(EMGroupSharedFile *aSharedFile, EMError *aError))aCompletionBlock;

/*!
 *  下载群共享文件
 *
 *  @param aGroupId         群ID
 *  @param aFilePath        文件路径
 *  @param aSharedFileId    共享文件ID
 *  @param aProgressBlock   文件下载进度回调block
 *  @param aCompletionBlock 完成回调block
 */
- (void)downloadGroupSharedFileWithId:(NSString *)aGroupId
                             filePath:(NSString *)aFilePath
                         sharedFileId:(NSString *)aSharedFileId
                             progress:(void (^)(int progress))aProgressBlock
                           completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager uploadGroupSharedFileWithId:@"groupId" filePath:@"filePath" progress:^(int progress) {
    NSLog(@"上传文件进度 --- %d", progress);
} completion:^(EMGroupSharedFile *aSharedFile, EMError *aError) {
    if(!aError){
        // EMGroupSharedFile中包含文件名称，文件发布者，文件创建时间，文件大小
        NSLog(@"上传群共享文件成功");
    } else {
        NSLog(@"上传群共享文件失败的原因 --- %@", aError.errorDescription);
    }
}];

// 调用:
[[EMClient sharedClient].groupManager downloadGroupSharedFileWithId:@"groupId" filePath:@"filePath" sharedFileId:@"sharedFileId" progress:^(int progress) {
    NSLog(@"下载文件进度 --- %d", progress);
} completion:^(EMGroup *aGroup, EMError *aError) {
    if(!aError){
        NSLog(@"下载群共享文件成功");
    } else {
        NSLog(@"下载群共享文件失败的原因 --- %@", aError.errorDescription);
    }
}];
```

当群中有人上传群共享文件时，其它群成员会受到新有群文件上传的回调

```
/*!
 *  有用户上传群共享文件
 *
 *  @param aGroup       群组
 *  @param aSharedFile  共享文件
 */
- (void)groupFileListDidUpdate:(EMGroup *)aGroup
               addedSharedFile:(EMGroupSharedFile *)aSharedFile;
```

### 删除群共享文件

```
/*!
 *  删除群共享文件
 *
 *  @param aGroupId         群ID
 *  @param aSharedFileId    共享文件ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeGroupSharedFileWithId:(NSString *)aGroupId
                       sharedFileId:(NSString *)aSharedFileId
                         completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager removeGroupSharedFileWithId:@"groupId" sharedFileId:@"sharedFileId" completion:^(EMGroup *aGroup, EMError *aError) {
    if(!aError){
        NSLog(@"删除群共享文件成功");
    } else {
        NSLog(@"删除群共享文件失败的原因 --- %@", aError.errorDescription);
    }
}];
```

当群中有人删除群共享文件时，其它群成员会受到有人删除群文件的回调

```
/*!
 *  有用户删除群共享文件
 *
 *  @param aGroup       群组
 *  @param aFileId      共享文件ID
 */
- (void)groupFileListDidUpdate:(EMGroup *)aGroup
             removedSharedFile:(NSString *)aFileId;
```

### 修改群扩展

```
/*!
 *  修改群扩展信息，需要Owner权限
 *
 *  @param aGroupId         群ID
 *  @param aExt             扩展信息
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateGroupExtWithId:(NSString *)aGroupId
                         ext:(NSString *)aExt
                  completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager updateGroupExtWithId:@"groupId" ext:@"ext" completion:^(EMGroup *aGroup, EMError *aError) {
    if(!aError){
        NSLog(@"修改群扩展信息成功");
    } else {
        NSLog(@"修改群扩展信息失败的原因 --- %@", aError.errorDescription);
    }
}];
```

## 群成员管理

### 改变群主

只有 Owner 权限才能调用该接口。

***Api:***

```
/*!
 *  改变群主，需要Owner权限
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param aGroupId   群ID
 *  @param aNewOwner  新群主
 *  @param pError     错误信息
 *
 *  @result    返回群组实例
 */
- (EMGroup *)updateGroupOwner:(NSString *)aGroupId
                     newOwner:(NSString *)aNewOwner
                        error:(EMError **)pError;

/*! 
 *  改变群主，需要Owner权限
 *
 *  @param aGroupId   群ID
 *  @param aNewOwner  新群主
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateGroupOwner:(NSString *)aGroupId
                newOwner:(NSString *)aNewOwner
              completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
```

***Delegate:***

```
/*!
 *  群组创建者有更新
 *
 *  @param aGroup       群组
 *  @param aNewOwner    新群主
 *  @param aOldOwner    旧群主
 */
- (void)groupOwnerDidUpdate:(EMGroup *)aGroup
                   newOwner:(NSString *)aNewOwner
                   oldOwner:(NSString *)aOldOwner;
                   
// 调用:
[[EMClient sharedClient].groupManager updateGroupOwner:@"groupId" newOwner:@"newOwner" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"群组创建者更新成功");
    } else {
        NSLog(@"群组创建者更新失败的原因 --- %@", aError.errorDescription);
    }   
}];                   
                   
```

### 添加群组管理员

只有 Owner 权限才能调用。

***Api:***

```
/*!
 *  添加群组管理员，需要Owner权限
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param aAdmin     要添加的群组管理员
 *  @param aGroupId   群ID
 *  @param pError     错误信息
 *
 *  @result    返回群组实例
 */
- (EMGroup *)addAdmin:(NSString *)aAdmin
              toGroup:(NSString *)aGroupId
                error:(EMError **)pError;

/*!
 *  添加群组管理员，需要Owner权限
 *
 *  @param aAdmin     要添加的群组管理员
 *  @param aGroupId   群ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)addAdmin:(NSString *)aAdmin
         toGroup:(NSString *)aGroupId
      completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
      
// 调用示例:
[[EMClient sharedClient].groupManager addAdmin:@"adminName" toGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"添加群组管理员成功");
    } else {
        NSLog(@"添加群组管理员失败的原因 --- %@", aError.errorDescription);
    }       
}];           
```

***Delegate:***

```
/*!
 *  有成员被加入管理员列表
 *
 *  @param aGroup    群组
 *  @param aAdmin    加入管理员列表的成员
 */
- (void)groupAdminListDidUpdate:(EMGroup *)aGroup
                     addedAdmin:(NSString *)aAdmin;
```

### 移除群组管理员

只有 Owner 权限才能调用。

***Api:***

```
/*!
 *  移除群组管理员，需要Owner权限
 *
 *  @param aAdmin     要添加的群组管理员
 *  @param aGroupId   群ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeAdmin:(NSString *)aAdmin
          fromGroup:(NSString *)aGroupId
         completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
         
// 调用:
[[EMClient sharedClient].groupManager removeAdmin:@"adminName" fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"移除群组管理员成功");
    } else {
        NSLog(@"移除群组管理员失败的原因 --- %@", aError.errorDescription);
    }  
}];         
```

***Delegate:***

```
/*!
 *  有成员被移出禁言列表
 *
 *  @param aGroup           群组
 *  @param aMutedMembers    移出禁言列表的成员
 */
- (void)groupMuteListDidUpdate:(EMGroup *)aGroup
           removedMutedMembers:(NSArray *)aMutedMembers;
```

### 移除群组成员

只有 Owner或者Admin 权限才能调用。

```
/*!
 *  将群成员移出群组
 *
 *  @param aUsers           要移出群组的用户列表
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeMembers:(NSArray *)aUsers
            fromGroup:(NSString *)aGroupId
           completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
           
// 调用:
[[EMClient sharedClient].groupManager removeMembers:@[@"user1"] fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"将群成员移出群组成功");
    } else {
        NSLog(@"将群成员移出群组失败的原因 --- %@", aError.errorDescription);
    }       
}];           
```

### 禁言群成员

权限高者可禁言权限低者，反之不允许

***Api:***

```
/*!
 *  将一组成员禁言，需要Owner / Admin权限
 *
 *  @param aMuteMembers         要禁言的成员列表<NSString>
 *  @param aMuteMilliseconds    禁言时长（单位毫秒，如果是“-1”代表永久禁言）
 *  @param aGroupId             群ID
 *  @param aCompletionBlock     完成的回调
 */
- (void)muteMembers:(NSArray *)aMuteMembers
   muteMilliseconds:(NSInteger)aMuteMilliseconds
          fromGroup:(NSString *)aGroupId
         completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
         
// 调用:
[[EMClient sharedClient].groupManager muteMembers:@[@"user1"] muteMilliseconds:10000 fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"将一组成员禁言成功");
    } else {
        NSLog(@"将一组成员禁言失败的原因 --- %@", aError.errorDescription);
    }        
}];        
```

***Delegate:***

```
/*!
 *  有成员被加入禁言列表
 *
 *  @param aGroup           群组
 *  @param aMutedMembers    被禁言的成员
 *  @param aMuteExpire      禁言失效时间，当前不可用
 */
- (void)groupMuteListDidUpdate:(EMGroup *)aGroup
             addedMutedMembers:(NSArray *)aMutedMembers
                    muteExpire:(NSInteger)aMuteExpire;
```

### 解除禁言

权限高者可禁言权限低者，反之不允许

***Api:***

```
/*!
 *  解除禁言，需要Owner / Admin权限
 *
 *  @param aMuteMembers     被解除的列表<NSString>
 *  @param aGroupId         群ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unmuteMembers:(NSArray *)aMembers
            fromGroup:(NSString *)aGroupId
           completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
           
// 调用:
[[EMClient sharedClient].groupManager unmuteMembers:@[@"user1"] fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"解除禁言成功");
    } else {
        NSLog(@"解除禁言失败的原因 --- %@", aError.errorDescription);
    }       
}];           
 
```

***Delegate:***

```
/*!
 *  有成员被移出禁言列表
 *
 *  @param aGroup           群组
 *  @param aMutedMembers    移出禁言列表的成员
 */
- (void)groupMuteListDidUpdate:(EMGroup *)aGroup
           removedMutedMembers:(NSArray *)aMutedMembers;
```

### 设置全员禁言

群主和群组管理员默认不会被禁言

***Api:***

```
/*!
 *  \~chinese
 *  设置全员禁言，需要Owner / Admin权限
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 *
 *  \~english
 *  mute all members, need Owner / Admin permissions
 *
 *  @param aGroupId         Group id
 *  @param aCompletionBlock The callback block of completion
 *
 */
- (void)muteAllMembersFromGroup:(NSString *)aGroupId
                     completion:(void(^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
         
// 调用:
[[EMClient sharedClient].groupManager muteAllMembersFromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"全员禁言成功");
    } else {
        NSLog(@"全员禁言失败的原因 --- %@", aError.errorDescription);
    }
}];        
```

***Delegate:***

```
/*!
*  \~chinese
*  群组全部禁言状态变化
*
*  @param aGroup           群组
*  @param aMuted           是否被全部禁言
*
*  \~english
*  Group members are all muted
*
*  @param aGroup           Group
*  @param aMuted           All member muted
*/
- (void)groupAllMemberMuteChanged:(EMGroup *)aGroup
                 isAllMemberMuted:(BOOL)aMuted;
```

### 解除全员禁言

***Api:***

```
/*!
 *  \~chinese
 *  解除全员禁言，需要Owner / Admin权限
 *
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 *
 *  \~english
 *  unmute all members, need Owner / Admin permissions
 *
 *  @param aGroupId         Group id
 *  @param aCompletionBlock The callback block of completion
 *
 */
- (void)unmuteAllMembersFromGroup:(NSString *)aGroupId
                       completion:(void(^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
           
// 调用:
[[EMClient sharedClient].groupManager unmuteAllMembersFromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"解除全员禁言成功")
    } else {
        NSLog(@"解除全员禁言失败的原因 --- %@", aError.errorDescription);
    }
}];          
 
```

***Delegate:***

```
/*!
*  \~chinese
*  群组全部禁言状态变化
*
*  @param aGroup           群组
*  @param aMuted           是否被全部禁言
*
*  \~english
*  Group members are all muted
*
*  @param aGroup           Group
*  @param aMuted           All member muted
*/
- (void)groupAllMemberMuteChanged:(EMGroup *)aGroup
                 isAllMemberMuted:(BOOL)aMuted;
```

### 加入群黑名单

只有 Owner 权限才能调用该接口，并且只有 Owner 权限的才能查看群黑名单。

可以将群成员和非群成员的人加入群黑名单。

```
/*!
 *  加人到群组黑名单, 需要owner权限
 *
 *  @param aMembers         要加入黑名单的用户
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)blockMembers:(NSArray *)aMembers
           fromGroup:(NSString *)aGroupId
          completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock; 

// 调用:
[[EMClient sharedClient].groupManager blockMembers:@[@"users1"] fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"加人到群组黑名单成功");
    } else {
        NSLog(@"加人到群组黑名单失败的原因 --- %@", aError.errorDescription);
    }       
}];
```

### 移出群黑名单

只有 Owner 权限才能调用该接口，并且只有 Owner 权限的才能查看群黑名单。

从群黑名单移除出去，该用户已经不在群组里了，需要重新加入群组。

```
/*!
 *  从群组黑名单中减人, 需要owner权限
 *
 *  @param aMembers         要从黑名单中移除的用户名列表
 *  @param aGroupId         群组ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unblockMembers:(NSArray *)aMembers
             fromGroup:(NSString *)aGroupId
            completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].groupManager unblockMembers:@[@"users1"] fromGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"从群组黑名单中减人成功");
    } else {
        NSLog(@"从群组黑名单中减人失败的原因 --- %@", aError.errorDescription);
    } 
}];
```

## 群消息

### 屏蔽/取消屏蔽群组消息

不允许 Owner 权限的调用。

```
/*!
 *  屏蔽群消息，服务器不再发送此群的消息给用户，owner不能屏蔽群消息
 *
 *  @param aGroupId         要屏蔽的群ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)blockGroup:(NSString *)aGroupId
        completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
        
// 调用:
[[EMClient sharedClient].groupManager blockGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"屏蔽群消息成功");
    } else {
        NSLog(@"屏蔽群消息失败的原因 --- %@", aError.errorDescription);
    }        
}];        

/*!
 *  取消屏蔽群消息
 *
 *  @param aGroupId         要取消屏蔽的群ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unblockGroup:(NSString *)aGroupId
          completion:(void (^)(EMGroup *aGroup, EMError *aError))aCompletionBlock;
          
// 调用:
[[EMClient sharedClient].groupManager unblockGroup:@"groupId" completion:^(EMGroup *aGroup, EMError *aError) {
    if (!aError) {
        NSLog(@"取消屏蔽群消息成功");
    } else {
        NSLog(@"取消屏蔽群消息失败的原因 --- %@", aError.errorDescription);
    }       
}];         
```

## 管理群组的 APNS 离线推送

见 [APNS离线推送-设置指定群组是否接收APNS](offline#设置群组免打扰)。

## 获取与登录者相关的群组

查看所有当前登录账号所在群组，包括创建的和加入的群组，提供了2种方法。

1.从服务器获取与我相关的群组列表

```
[[EMClient sharedClient].groupManager getJoinedGroupsFromServerWithPage:1 pageSize:50 completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取群组列表成功 --- %@", aList);
    } else {
        NSLog(@"获取群组列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

2. 取内存中的值

从服务器获与登录者相关的群组列表之后，才能从本地获取到群组列表

```
// 从内存中获取所有群组，第一次从数据库加载
NSArray *groupList = [[EMClient sharedClient].groupManager getJoinedGroups];
```

## 获取公开群组

获取指定范围内的公开群。

```
/*!
 *  从服务器获取指定范围内的公开群
 *
 *  @param aCursor          获取公开群的cursor，首次调用传空
 *  @param aPageSize        期望返回结果的数量, 如果 < 0 则一次返回所有结果
 *  @param aCompletionBlock 完成的回调
 */
- (void)getPublicGroupsFromServerWithCursor:(NSString *)aCursor
                                   pageSize:(NSInteger)aPageSize
                                 completion:(void (^)(EMCursorResult *aResult, EMError *aError))aCompletionBlock;
                                 
// 调用:                                 
[[EMClient sharedClient].groupManager getPublicGroupsFromServerWithCursor:nil pageSize:50 completion:^(EMCursorResult *aResult, EMError *aError) {
    if (!aError) {
        NSLog(@"获取公开群组成功 --- %@", aResult);
    } else {
        NSLog(@"获取公开群组失败的原因 --- %@", aError.errorDescription);
    }  
}];
```

------