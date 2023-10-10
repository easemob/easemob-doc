# 好友管理


注：环信不是好友也可以聊天，不推荐使用环信的好友机制。如果你有自己的服务器或好友关系，请自己维护好友关系。

好友管理涉及到的环信SDK头文件如下:

```
// 好友方法调用部分，比如添加代理，移除代理，添加，删除好友等
IEMContactManager.h

// 好友的协议回调方法部分，比如监听接收好友请求的回调方法等
EMContactManagerDelegate.h
```

## 获取好友列表

获取好友列表，环信提供了两种方法。

### 从服务器获取所有的好友

```
[[EMClient sharedClient].contactManager getContactsFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取所有好友成功 -- %@",aList);
    } else {
        NSLog(@"获取所有好友失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 从数据库获取所有的好友

```
// 从服务器获取所有好友之后，才能从本地获取到好友
NSArray *userlist = [[EMClient sharedClient].contactManager getContacts];
```

## 好友申请

### 发送加好友申请

环信 iOS SDK 提供了添加好友的方法。

```
/*!
 *  添加好友
 *
 *  @param aUsername        要添加的用户
 *  @param aMessage         邀请信息
 *  @param aCompletionBlock 完成的回调
 */
- (void)addContact:(NSString *)aUsername
           message:(NSString *)aMessage
        completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
        
// 调用        
[[EMClient sharedClient].contactManager addContact:@"6001" message:@"我想添加您为好友" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"添加好友成功 -- %@",aUsername);
    } else {
        NSLog(@"添加好友失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 监听加好友请求

当您收到好友请求，如果您没有处理，请自己保存数据，新协议下不会每次都发送。

```
协议:EMContactManagerDelegate

代理:
//注册好友回调
[[EMClient sharedClient].contactManager addDelegate:self delegateQueue:nil];
//移除好友回调
[[EMClient sharedClient].contactManager removeDelegate:self];
```

监听回调

```
/*!
 *  用户A发送加用户B为好友的申请，用户B会收到这个回调
 *
 *  @param aUsername   用户名
 *  @param aMessage    附属信息
 */
- (void)friendRequestDidReceiveFromUser:(NSString *)aUsername
                                message:(NSString *)aMessage; 
```

### 同意加好友申请

```
/*!
 *  同意加好友的申请
 *
 *  @param aUsername        申请者
 *  @param aCompletionBlock 完成的回调
 */
- (void)approveFriendRequestFromUser:(NSString *)aUsername
                          completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
                          
// 调用:                          
[[EMClient sharedClient].contactManager approveFriendRequestFromUser:@"6001" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"同意加好友申请成功");
    } else {
        NSLog(@"同意加好友申请失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 拒绝加好友申请

```
/*!
 *  拒绝加好友的申请
 *
 *  @param aUsername        申请者
 *  @param aCompletionBlock 完成的回调
 */
- (void)declineFriendRequestFromUser:(NSString *)aUsername
                          completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
                          
// 调用:
[[EMClient sharedClient].contactManager declineFriendRequestFromUser:@"6001" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"拒绝加好友申请成功");
    } else {
        NSLog(@"拒绝加好友申请失败的原因 --- %@", aError.errorDescription);
    }
}];                          
```

### 好友申请处理结果回调

监听回调

```
/*!
 @method
 @brief 用户A发送加用户B为好友的申请，用户B同意后，用户A会收到这个回调
 */
- (void)friendRequestDidApproveByUser:(NSString *)aUsername;

/*!
 @method
 @brief 用户A发送加用户B为好友的申请，用户B拒绝后，用户A会收到这个回调
 */
- (void)friendRequestDidDeclineByUser:(NSString *)aUsername;
```

## 删除好友

```
/*!
 *  删除好友
 *
 *  @param aUsername                要删除的好友
 *  @param aIsDeleteConversation    是否删除会话
 *  @param aCompletionBlock         完成的回调
 */
- (void)deleteContact:(NSString *)aUsername
 isDeleteConversation:(BOOL)aIsDeleteConversation
           completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
           
// 调用:
[[EMClient sharedClient].contactManager deleteContact:@"6001" isDeleteConversation:YES completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"删除好友成功");
    } else {
        NSLog(@"删除好友失败的原因 --- %@", aError.errorDescription);
    }
}];           
```

### 删除好友回调

监听回调

```
/*!
 @method
 @brief 用户B删除与用户A的好友关系后，用户A，B会收到这个回调
*/
- (void)friendshipDidRemoveByUser:(NSString *)aUsername;
```

## 黑名单

### 获取好友黑名单

环信的黑名单体系是独立的，与好友无任何关系。也就是说，您可以将任何人加入黑名单，不论他是否与您是好友关系。同时，如果您将好友加入黑名单，则他仍然是您的好友，只不过同时也在黑名单中。

查询黑名单列表，环信提供了两种方法。

#### 异步方法

```
/*!
 *  从服务器获取黑名单列表
 *
 *  @param aCompletionBlock 完成的回调
 */
- (void)getBlackListFromServerWithCompletion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;

// 调用:
[[EMClient sharedClient].contactManager getBlackListFromServerWithCompletion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        NSLog(@"获取黑名单列表成功 -- %@",aList);
    } else {
        NSLog(@"获取黑名单列表失败的原因 --- %@", aError.errorDescription);
    }
}];
```

#### 从数据库获取黑名单列表

```
// 从服务器获取黑名单列表之后，才能从本地获取到黑名单列表
NSArray *blockList = [[EMClient sharedClient].contactManager getBlackList];
```

### 加入黑名单

```
/*!
 *  将用户加入黑名单
 *
 *  @param aUsername        要加入黑名单的用户
 *  @param aCompletionBlock 完成的回调
 */
- (void)addUserToBlackList:(NSString *)aUsername
                completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
                
// 调用:                
[[EMClient sharedClient].contactManager addUserToBlackList:@"6001" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户加入黑名单成功");
    } else {
        NSLog(@"将用户加入黑名单失败的原因 --- %@", aError.errorDescription);
    }
}];
```

### 移出黑名单

接口调用

```
/*!
 *  将用户移出黑名单
 *
 *  @param aUsername        要移出黑命单的用户
 *  @param aCompletionBlock 完成的回调
 */
- (void)removeUserFromBlackList:(NSString *)aUsername
                     completion:(void (^)(NSString *aUsername, EMError *aError))aCompletionBlock;
                     
// 调用:
[[EMClient sharedClient].contactManager removeUserFromBlackList:@"6001" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"将用户移出黑名单成功");
    } else {
        NSLog(@"将用户移出黑名单失败的原因 --- %@", aError.errorDescription);
    }
}];                     
```