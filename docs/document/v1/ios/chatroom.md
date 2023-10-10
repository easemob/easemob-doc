# 聊天室管理

:::notice
客户端SDK不支持创建聊天室，可以调用REST接口来创建
:::

聊天室管理主要涉及到的环信SDK头文件如下:

```
// 聊天室部分，有聊天室id等属性
EMChatroom.h

// 聊天室方法调用部分，比如添加代理，移除代理，获取聊天室等
IEMChatroomManager.h

// 聊天室的协议回调方法部分，比如监听有用户加群的回调方法等
EMChatroomManagerDelegate.h
```

环信聊天室模型默认最大成员数为5000，和群组不同，聊天室内成员离线2分钟后，服务器会将此成员踢出聊天室，不会再给此成员发推送，上线后无法自动进入聊天室。聊天室成员数可调整，请联系商务。

- 默认支持最大成员数5000，调整请联系商务；
- 环信的聊天室内有所有者，管理员和游客三种身份；
- 支持禁言，黑名单，踢人等操作；
- 不支持客户端邀请；
- 不支持 REST 邀请。
- 聊天室API通常是同步操作，需要在单独的线程中执行，如需使用异步API，请使用async前缀对应的API

环信聊天室客户端的主要特性包括：

- 支持查询所有 APP 聊天室；
- 支持查询聊天室详情；
- 加入聊天室；
- 退出聊天室；

### 服务器端API

服务器端聊天室有关的 REST 操作请参考[聊天室管理](/document/v1/server-side/chatroom.html)。

### 分页获取聊天室列表

```
/*!
 *  从服务器获取指定数目的聊天室
 *
 *  @param aPageNum              获取第几页
 *  @param aPageSize             获取多少条
 *  @param aCompletionBlock      完成的回调
 */

- (void)getChatroomsFromServerWithPage:(NSInteger)aPageNum
                              pageSize:(NSInteger)aPageSize
                            completion:(void (^)(EMPageResult *aResult, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:0 pageSize:50 completion:^(EMPageResult *aResult, EMError *aError) {
    if (!aError) {
        NSLog(@"从服务器获取指定数目的聊天室成功");
    } else {
       NSLog(@"从服务器获取指定数目的聊天室失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 加入聊天室

```
/*!
 *  加入聊天室
 *
 *  @param aChatroomId           聊天室的ID
 *  @param aCompletionBlock      完成的回调
 */
- (void)joinChatroom:(NSString *)aChatroomId
          completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock; 

// 调用:
[[EMClient sharedClient].roomManager joinChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
       NSLog(@"加入聊天室成功");
    } else {
        NSLog(@"加入聊天室失败的原因 --- %@", aError.errorDescription);
    }
}];                          
```

### 离开聊天室

```
/*!
 *  退出聊天室
 *
 *  @param aChatroomId          聊天室ID
 *  @param aCompletionBlock      完成的回调
 */
- (void)leaveChatroom:(NSString *)aChatroomId
           completion:(void (^)(EMError *aError))aCompletionBlock;   

// 调用:
[[EMClient sharedClient].roomManager leaveChatroom:@"chatroomId" completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"退出聊天室成功");
    } else {
        NSLog(@"退出聊天室失败的原因 --- %@", aError.errorDescription);
    }
}];
离开聊天室时，SDK默认会删除此聊天室本地所有消息，如果不想删除，可以设置以下属性为NO
/*!
 *  \~chinese
 *  离开聊天室时是否删除所有消息, 默认为YES
 *
 *  \~english 
 *  Whether to delete all the chat room messages when leaving the chat room, default is YES
 */
@property (nonatomic, assign) BOOL isDeleteMessagesWhenExitChatRoom;

// 调用:
EMOptions *retOpt = [EMOptions optionsWithAppkey:@"appkey"];
retOpt.isDeleteMessagesWhenExitChatRoom = NO;
```

### 获取聊天室详情

```
/*!
 *  获取聊天室详情
 *
 *  @param aChatroomId           聊天室ID
 *  @param aCompletionBlock      完成的回调
 *
 */
- (void)getChatroomSpecificationFromServerWithId:(NSString *)aChatroomId
                                      completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager getChatroomSpecificationFromServerWithId:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"获取聊天室详情成功");
    } else {
        NSLog(@"获取聊天室详情失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 分页获取聊天室成员列表

```
/*!
 *  获取聊天室成员列表
 *
 *  @param aChatroomId      聊天室ID
 *  @param aCursor          游标
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getChatroomMemberListFromServerWithId:(NSString *)aChatroomId
                                       cursor:(NSString *)aCursor
                                     pageSize:(NSInteger)aPageSize
                                   completion:(void (^)(EMCursorResult *aResult, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager getChatroomMemberListFromServerWithId:@"chatroomId" cursor:@"cursor" pageSize:50 completion:^(EMCursorResult *aResult, EMError *aError) {
    if (!aError) {
        // EMCursorResult类中有游标属性
        NSLog(@"获取聊天室成员列表成功");
    } else {
        NSLog(@"获取聊天室成员列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 分页获取聊天室黑名单列表

需要Owner或Admin权限

```
/*!
 *  获取聊天室黑名单列表, 需要owner/admin权限
 *
 *  @param aChatroomId      聊天室ID
 *  @param aPageNum         获取第几页
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getChatroomBlacklistFromServerWithId:(NSString *)aChatroomId
                                  pageNumber:(NSInteger)aPageNum
                                    pageSize:(NSInteger)aPageSize
                                  completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager getChatroomBlacklistFromServerWithId:@"chatroomId" pageNumber:1 pageSize:50 completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取聊天室黑名单列表成功");
    } else {
        NSLog(@"获取聊天室黑名单列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 分页获取聊天室禁言列表

```
/*!
 *  获取聊天室被禁言列表
 *
 *  @param aChatroomId      聊天室ID
 *  @param aPageNum         获取第几页
 *  @param aPageSize        获取多少条
 *  @param aCompletionBlock 完成的回调
 */
- (void)getChatroomMuteListFromServerWithId:(NSString *)aChatroomId
                                 pageNumber:(NSInteger)aPageNum
                                   pageSize:(NSInteger)aPageSize
                                 completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager getChatroomMuteListFromServerWithId:@"chatroomId" pageNumber:1 pageSize:50 completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取聊天室被禁言列表成功");
    } else {
        NSLog(@"获取聊天室被禁言列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 更新聊天室名称

需要Owner权限

```
/*!
 *  更改聊天室主题, 需要owner权限
 *
 *  @param aSubject         新主题
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateSubject:(NSString *)aSubject
          forChatroom:(NSString *)aChatroomId
           completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager updateSubject:@"newSubject" forChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"更改聊天室主题成功");
    } else {
        NSLog(@"更改聊天室主题失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 更新聊天室说明

需要Owner权限

```
/*!
 *  更改聊天室说明信息, 需要owner权限
 *
 *  @param aDescription     说明信息
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateDescription:(NSString *)aDescription
              forChatroom:(NSString *)aChatroomId
               completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager updateDescription:@"newDescription" forChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"更改聊天室说明信息成功");
    } else {
        NSLog(@"更改聊天室说明信息失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 获取聊天室公告

```
/*!
 *  获取聊天室公告
 *
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)getChatroomAnnouncementWithId:(NSString *)aChatroomId
                           completion:(void (^)(NSString *aAnnouncement, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].roomManager getChatroomAnnouncementWithId:@"chatroomId" completion:^(NSString *aAnnouncement, EMError *aError) {
    if (!aError) {
        NSLog(@"获取聊天室公告成功");
    } else {
        NSLog(@"获取聊天室公告失败的原因 --- %@", aError.errorDescription);
    }
}];
```

也可以通过聊天室监听接口来获取聊天室公告的消息推送。见[聊天室相关的回调](http://docs-im.easemob.com/im/ios/basics/chatroom#聊天室相关的回调)

### 更新聊天室公告

```
/*!
 *  修改聊天室公告，需要Owner / Admin权限
 *
 *  @param aChatroomId      聊天室ID
 *  @param aAnnouncement    群公告
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateChatroomAnnouncementWithId:(NSString *)aChatroomId
                            announcement:(NSString *)aAnnouncement
                              completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].roomManager updateChatroomAnnouncementWithId:@"chatroomId" announcement:@"newAnnouncement" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"修改聊天室公告成功");
    } else {
        NSLog(@"修改聊天室公告失败的原因 --- %@", aError.errorDescription);
    }
}];
```

聊天室owner/Admin修改聊天室公告时，其它成员会收到聊天室公告有更新的通知

```
/*!
 *  聊天室公告有更新
 *
 *  @param aChatroom        聊天室
 *  @param aAnnouncement    公告
 */
- (void)chatroomAnnouncementDidUpdate:(EMChatroom *)aChatroom
                         announcement:(NSString *)aAnnouncement;
```

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
/*!
 *  \~chinese
 *  设置全员禁言，需要Owner / Admin权限
 *
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)muteAllMembersFromChatroom:(NSString *)aChatroomId
                        completion:(void(^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                        
                        
/*!
 *  \~chinese
 *  解除全员禁言，需要Owner / Admin权限
 *
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unmuteAllMembersFromChatroom:(NSString *)aChatroomId
                          completion:(void(^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
```

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以运行白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
/*!
 *  \~chinese
 *  添加白名单，需要Owner / Admin权限
 *
 *  @param aMembers         被添加的列表<NSString>
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)addWhiteListMembers:(NSArray *)aMembers
               fromChatroom:(NSString *)aChatroomId
                 completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                 
/*!
 *  \~chinese
 *  移除白名单，需要Owner / Admin权限
 *
 *  @param aMembers         被移除的列表<NSString>
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeWhiteListMembers:(NSArray *)aMembers
                  fromChatroom:(NSString *)aChatroomId
                    completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                    
                    
/*!
 *  \~chinese
 *  查看自己是否在聊天室白名单中
 *
 *  @param aChatroomId      聊天室ID
 *  @param pError           错误信息
 */
- (BOOL)isMemberInWhiteListFromServerWithChatroomId:(NSString *)aChatroomId
                                              error:(EMError **)pError;
                                              
                                              
/*!
 *  \~chinese
 *  获取聊天室白名单列表
 *
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)getChatroomWhiteListFromServerWithId:(NSString *)aChatroomId
                                  completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
```

### 将成员移出聊天室

需要Owner或Admin权限

```
/*!
 *  将成员移出聊天室, 需要owner/admin权限
 *
 *  @param aMembers         要移出的用户列表
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeMembers:(NSArray *)aMembers
         fromChatroom:(NSString *)aChatroomId
           completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                
[[EMClient sharedClient].roomManager removeMembers:@[@"username"] fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"将成员移出聊天室成功");
    } else {
        NSLog(@"将成员移出聊天室失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 将用户加到聊天室黑名单

需要Owner或Admin权限

```
/*!
 *  加人到聊天室黑名单
 *
 *  @param aMembers         要加入黑名单的用户
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)blockMembers:(NSArray *)aMembers
        fromChatroom:(NSString *)aChatroomId
          completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager blockMembers:@[@"username"] fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"加人到聊天室黑名单成功");
    } else {
        NSLog(@"加人到聊天室黑名单失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 将用户移出聊天室黑名单

需要Owner或Admin权限

```
/*!
 *  从聊天室黑名单中减人
 *
 *  @param aMembers         要从黑名单中移除的用户名列表
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unblockMembers:(NSArray *)aMembers
          fromChatroom:(NSString *)aChatroomId
            completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager unblockMembers:@[@"username"] fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"从聊天室黑名单中减人成功");
    } else {
        NSLog(@"从聊天室黑名单中减人失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 改变聊天室创建者

需要Owner权限

```
/*!
 *  改变聊天室创建者，需要Owner权限
 *
 *  @param aChatroomId      聊天室ID
 *  @param aNewOwner        新Owner
 *  @param aCompletionBlock 完成的回调
 */
- (void)updateChatroomOwner:(NSString *)aChatroomId
                   newOwner:(NSString *)aNewOwner
                 completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager updateChatroomOwner:@"chatroomId" newOwner:@"newOwner" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"改变聊天室创建者成功");
    } else {
        NSLog(@"改变聊天室创建者失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 添加聊天室管理员

需要Owner权限

```
/*!
 *  添加聊天室管理员，需要Owner权限
 *
 *  @param aAdmin           要添加的群组管理员
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)addAdmin:(NSString *)aAdmin
      toChatroom:(NSString *)aChatroomId
      completion:(void (^)(EMChatroom *aChatroomp, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager addAdmin:@"adminId" toChatroom:@"chatroomId" completion:^(EMChatroom *aChatroomp, EMError *aError) {
    if (!aError) {
        NSLog(@"添加聊天室管理员成功");
    } else {
        NSLog(@"添加聊天室管理员失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 移除聊天室管理员

需要Owner权限

```
/*!
 *  移除聊天室管理员，需要Owner权限
 *
 *  @param aAdmin           要添加的群组管理员
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeAdmin:(NSString *)aAdmin
       fromChatroom:(NSString *)aChatroomId
         completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager removeAdmin:@"adminId" fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"移除聊天室管理员成功");
    } else {
        NSLog(@"移除聊天室管理员失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 禁言聊天室成员

权限高者可禁言权限低者，反之不允许

```
/*!
 *  将一组成员禁言，需要Owner / Admin权限
 *
 *  @param aMuteMembers         要禁言的成员列表<NSString>
 *  @param aMuteMilliseconds    禁言时长（单位毫秒，如果是“-1”代表永久禁言）
 *  @param aChatroomId          聊天室ID
 *  @param aCompletionBlock     完成的回调
 */
- (void)muteMembers:(NSArray *)aMuteMembers
   muteMilliseconds:(NSInteger)aMuteMilliseconds
       fromChatroom:(NSString *)aChatroomId
         completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager muteMembers:@[@"userName"] muteMilliseconds:10000 fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"将一组成员禁言成功");
    } else {
        NSLog(@"将一组成员禁言失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 解除禁言

权限高者可禁言权限低者，反之不允许

```
/*!
 *  解除禁言，需要Owner / Admin权限
 *
 *  @param aMuteMembers     被解除的列表<NSString>
 *  @param aChatroomId      聊天室ID
 *  @param aCompletionBlock 完成的回调
 */
- (void)unmuteMembers:(NSArray *)aMembers
         fromChatroom:(NSString *)aChatroomId
           completion:(void (^)(EMChatroom *aChatroom, EMError *aError))aCompletionBlock;
                               
// 调用:                                 
[[EMClient sharedClient].roomManager unmuteMembers:@[@"userName"] fromChatroom:@"chatroomId" completion:^(EMChatroom *aChatroom, EMError *aError) {
    if (!aError) {
        NSLog(@"解除禁言成功");
    } else {
        NSLog(@"解除禁言失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 聊天室相关的回调

注册聊天室回调

```
协议:EMChatroomManagerDelegate

代理:
//注册聊天室回调
[[EMClient sharedClient].roomManager addDelegate:self delegateQueue:nil];
//移除聊天室回调
[[EMClient sharedClient].roomManager removeDelegate:self];
```

回调方法:

```
/*!
 *  有用户加入聊天室
 *
 *  @param aChatroom    加入的聊天室
 *  @param aUsername    加入者
 */
- (void)userDidJoinChatroom:(EMChatroom *)aChatroom
                       user:(NSString *)aUsername;

/*!
 *  有用户离开聊天室
 *
 *  @param aChatroom    离开的聊天室
 *  @param aUsername    离开者
 */
- (void)userDidLeaveChatroom:(EMChatroom *)aChatroom
                        user:(NSString *)aUsername;

/*!
 *  被踢出聊天室
 *
 *  @param aChatroom    被踢出的聊天室
 *  @param aReason      被踢出聊天室的原因
 */
- (void)didDismissFromChatroom:(EMChatroom *)aChatroom
                        reason:(EMChatroomBeKickedReason)aReason;

/*!
 *  有成员被加入禁言列表
 *
 *  @param aChatroom        聊天室
 *  @param aMutedMembers    被禁言的成员
 *  @param aMuteExpire      禁言失效时间，暂时不可用
 */
- (void)chatroomMuteListDidUpdate:(EMChatroom *)aChatroom
                addedMutedMembers:(NSArray *)aMutes
                       muteExpire:(NSInteger)aMuteExpire;

/*!
 *  有成员被移出禁言列表
 *
 *  @param aChatroom        聊天室
 *  @param aMutedMembers    移出禁言列表的成员
 */
- (void)chatroomMuteListDidUpdate:(EMChatroom *)aChatroom
              removedMutedMembers:(NSArray *)aMutes;

/*!
 *  有成员被加入管理员列表
 *
 *  @param aChatroom    聊天室
 *  @param aAdmin       加入管理员列表的成员
 */
- (void)chatroomAdminListDidUpdate:(EMChatroom *)aChatroom
                        addedAdmin:(NSString *)aAdmin;

/*!
 *  有成员被移出管理员列表
 *
 *  @param aChatroom    聊天室
 *  @param aAdmin       移出管理员列表的成员
 */
- (void)chatroomAdminListDidUpdate:(EMChatroom *)aChatroom
                      removedAdmin:(NSString *)aAdmin;

/*!
 *  聊天室创建者有更新
 *
 *  @param aChatroom    聊天室
 *  @param aNewOwner    新群主
 *  @param aOldOwner    旧群主
 */
- (void)chatroomOwnerDidUpdate:(EMChatroom *)aChatroom
                      newOwner:(NSString *)aNewOwner
                      oldOwner:(NSString *)aOldOwner;
```