# 多设备管理


多设备主要涉及到的环信 SDK 头文件如下:

```
// 已登录设备的信息部分，包含设备的UUID，设备名称等
EMDeviceConfig.h

// 多设备方法调用部分，比如从服务器获取所有已经登录的设备信息，强制指定的设备退出等
EMClient.h

// 多设备的协议回调方法部分，比如监听好友多设备事件，群组多设备事件回调方法等
EMMultiDevicesDelegate.h
```

## 其他端登录的设备ID

当PC端和手机端登录同一个账号时，在手机端可以通过特定方法获取到PC端的设备ID，该设备ID相当于特殊的好友Username，可以直接使用于聊天，使用方法与好友类似。

#### 接口

```
/*!
 *  从服务器获取所有已经登录的设备信息
 *
 *  @param aUsername        用户名
 *  @param aPassword        密码
 *  @param aCompletionBlock 完成的回调
 *  @result aList           Information of logged in device <EMDeviceConfig>
 */
- (void)getLoggedInDevicesFromServerWithUsername:(NSString *)aUsername
                                        password:(NSString *)aPassword
                                      completion:(void (^)(NSArray *aList, EMError *aError))aCompletionBlock;
```

#### 使用示例

```
[[EMClient sharedClient] getLoggedInDevicesFromServerWithUsername:@"username" password:@"password" completion:^(NSArray *aList, EMError *aError) {
    if (!aError) {
        // 返回的aList数组里面是 EMDeviceConfig 对象，EMDeviceConfig 是已登录设备的信息，具体请到环信SDK EMDeviceConfig.h 头文件中查看介绍
        NSLog(@"从服务器获取所有已经登录的设备信息成功 --- %@", aList);
    } else {
        NSLog(@"从服务器获取所有已经登录的设备信息失败的原因 --- %@", aError.errorDescription);
    }
}];
```

## 多设备事件回调

账号A同时在设备A和设备B上登录，账号A在设备A上进行一些操作，设备B上会收到这些操作对应的通知，具体说明如下：

#### 接口 EMMultiDevicesDelegate

```
/*!
 *  多设备事件类型
 *  用户UserA，登录2台机子DeviceA1和DeviceA2，另有一个用户UserB
 */
typedef NS_ENUM(NSInteger, EMMultiDevicesEvent) {
    EMMultiDevicesEventUnknow = -1,         // 默认
    EMMultiDevicesEventContactRemove = 2,   // UserB和UserA是好友，UserA在DeviceA1上删除了UserB，DeviceA2会收到该回调
    EMMultiDevicesEventContactAccept = 3,   // UserB向UserA发送加好友申请，UserA在DeviceA1上同意了该请求，DeviceA2会收到该回调 
    EMMultiDevicesEventContactDecline = 4,  // UserB向UserA发送加好友申请，UserA在DeviceA1上拒绝了该请求，DeviceA2会收到该回调 
    EMMultiDevicesEventContactBan = 5,      // UserA在DeviceA1上将UserB加入黑名单，DeviceA2会收到该回调
    EMMultiDevicesEventContactAllow = 6,    // UserA在DeviceA1上将UserB从黑名单中移除，DeviceA2会收到该回调 
    
    EMMultiDevicesEventGroupCreate = 10,    // UserA在DeviceA1上创建了群组Group，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupDestroy = 11,   // UserA在DeviceA1上销毁了群组Group，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupJoin = 12,      // UserA在DeviceA1上主动加入了群组Group，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupLeave = 13,     // UserA在DeviceA1上退出了群组Group，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupApply = 14,     // UserA在DeviceA1上发送了申请进入Group，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupApplyAccept = 15,   // UserA收到UserB的入群申请，UserA在DeviceA1上同意了该申请，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupApplyDecline = 16,  // UserA收到UserB的入群申请，UserA在DeviceA1上拒绝了该申请，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupInvite = 17,    // UserA在DeviceA1上邀请了某些人进入GroupA，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupInviteAccept = 18,  //e UserBUserA加入群组,UserA在DeviceA1上同意了UserB的邀请，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupInviteDecline = 19, // UserB邀请UserA加入群组,UserA在DeviceA1上拒绝了UserB的邀请，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupKick = 20,      // UserA在DeviceA1上将某些成员从GroupA中踢出，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupBan = 21,       // UserA在DeviceA1上将某些成员加入GroupA黑名单，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupAllow = 22,     // UserA在DeviceA1上将某些成员从GroupA黑名单中移除，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupBlock = 23,     // UserA在DeviceA1上屏蔽了GroupA的消息，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupUnBlock = 24,   // UserA在DeviceA1上取消了屏蔽GroupA的消息，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupAssignOwner = 25,   // UserA在DeviceA1上更新了GroupA的群主，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupAddAdmin = 26,  // UserA在DeviceA1上添加了GroupA的管理员，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupRemoveAdmin = 27,   // UserA在DeviceA1上移除了GroupA的管理员，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupAddMute = 28,   // UserA在DeviceA1上禁言了GroupA的某些成员，DeviceA2会收到该回调 
    EMMultiDevicesEventGroupRemoveMute = 29,    // UserA在DeviceA1上移除了GroupA的某些禁言成员，DeviceA2会收到该回调
};

/*!
 *  好友多设备事件回调
 *
 *  @param aEvent       多设备事件类型
 *  @param aUsername    用户名
 *  @param aExt         扩展信息
 */
- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)aEvent
                                  username:(NSString *)aUsername
                                       ext:(NSString *)aExt;

/*!
 *  群组多设备事件回调
 *
 *  @param aEvent       多设备事件类型
 *  @param aGroupId     群组ID
 *  @param aExt         扩展信息, 是被操作对象的数组（NSMutableArray）
 */
- (void)multiDevicesGroupEventDidReceive:(EMMultiDevicesEvent)aEvent
                                 groupId:(NSString *)aGroupId
                                     ext:(id)aExt;
```

#### 使用示例

```
//注册监听
[[EMClient sharedClient] addMultiDevicesDelegate:aDelegate delegateQueue:aQueue];

//监听回调
- (void)multiDevicesContactEventDidReceive:(EMMultiDevicesEvent)aEvent
                                  username:(NSString *)aTarget
                                       ext:(NSString *)aExt
{
    NSString *message = [NSString stringWithFormat:@"%li-%@-%@", (long)aEvent, aTarget, aExt];
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"alert.multi.contact", @"Contact Multi-devices") message:message delegate:self cancelButtonTitle:NSLocalizedString(@"ok", @"OK") otherButtonTitles:nil, nil];
    [alertView show];
}

- (void)multiDevicesGroupEventDidReceive:(EMMultiDevicesEvent)aEvent
                                 groupId:(NSString *)aGroupId
                                     ext:(id)aExt
{
    NSString *message = [NSString stringWithFormat:@"%li-%@-%@", (long)aEvent, aGroupId, aExt];
    UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"alert.multi.group", @"Group Multi-devices") message:message delegate:self cancelButtonTitle:NSLocalizedString(@"ok", @"OK") otherButtonTitles:nil, nil];
    [alertView show];
}
```