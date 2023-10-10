# APNs 离线推送

## 必备条件

1. 后台上传了推送证书，具体步骤见[集成 iOS SDK 前的准备工作-制作并上传推送证书](deploy.html#配置推送)。
2. 代码配置 APNs 使用的推送证书。

```
EMOptions *options = [EMOptions optionsWithAppkey:@"appkey"];
options.apnsCertName = @"apnsCertName";
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

3. 代码注册离线推送。

```
UIApplication *application = [UIApplication sharedApplication];

//iOS10 注册APNs
if (NSClassFromString(@"UNUserNotificationCenter")) {
    [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert completionHandler:^(BOOL granted, NSError *error) {
        if (granted) {
#if !TARGET_IPHONE_SIMULATOR
            [application registerForRemoteNotifications];
#endif
        }
    }];
    return;
}

if([application respondsToSelector:@selector(registerUserNotificationSettings:)])
{
    UIUserNotificationType notificationTypes = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:notificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
}

#if !TARGET_IPHONE_SIMULATOR
if ([application respondsToSelector:@selector(registerForRemoteNotifications)]) {
    [application registerForRemoteNotifications];
}else{
    UIRemoteNotificationType notificationTypes = UIRemoteNotificationTypeBadge |
    UIRemoteNotificationTypeSound |
    UIRemoteNotificationTypeAlert;
    [[UIApplication sharedApplication] registerForRemoteNotificationTypes:notificationTypes];
}
#endif
```

您注册了推送功能，iOS 会自动回调以下方法，得到 deviceToken，您需要将 deviceToken 传给 SDK。

```
如果是iOS13及以上的系统，请将SDK更新到v3.6.4及以上版本
// 将得到的deviceToken传给SDK
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [[EMClient sharedClient] bindDeviceToken:deviceToken];
    });
}

// 注册deviceToken失败
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
    NSLog(@"error -- %@",error);
}
```

**注：必须是真机，模拟器不支持APNs。APNs 注册失败，一般是由于使用了通用证书或者是模拟器调试导致，请检查证书并用真机调试。此处是 iOS 系统报的错，如仍不能确定，请从网上查找相关资料。**

## 获取 APNs 配置

APNs 属性需要从服务器获取端获取。

登录成功后调用。

```
/*!
 *  \~chinese
 *  从服务器获取推送属性
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param pError  错误信息
 *
 *  @result 推送属性
 */
- (EMPushOptions *)getPushOptionsFromServerWithError:(EMError **)pError;

/*!
 *  \~chinese
 *  从服务器获取推送属性
 *
 *  @param aCompletionBlock 完成的回调
 */
- (void)getPushNotificationOptionsFromServerWithCompletion:(void (^)(EMPushOptions *aOptions, EMError *aError))aCompletionBlock;
```

示例代码：

```
EMError *err;
EMPushOptions *options = [EMClient.sharedClient.pushManager getPushOptionsFromServerWithError:&err];
if (err) {
  // 获取失败
}else {
  // 获取成功
}
```

## 设置APNs显示名称

当您给对方发消息，对方不在线时，推送中显示的发送方将为您设置的昵称；

登录成功后调用。

```
/*!
 *  \~chinese
 *  设置推送消息显示的昵称
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param aNickname  要设置的昵称
 *
 *  @result 错误信息
 */
- (EMError *)updatePushDisplayName:(NSString *)aDisplayName;

/*!
 *  \~chinese
 *  设置推送的显示名
 *
 *  @param aDisplayName     推送显示名
 *  @param aCompletionBlock 完成的回调
 */
- (void)updatePushDisplayName:(NSString *)aDisplayName
                   completion:(void (^)(NSString *aDisplayName, EMError *aError))aCompletionBlock;
```

示例代码

```
EMError *err = [EMClient.sharedClient.pushManager updatePushDisplayName:@"推送昵称"];
if (err) {
  // 设置失败
}else {
  // 设置成功
}
```

## 设置 APNs 显示风格

当您不在线时，如果有人给您发消息会收到推送，您可以设置显示详情(xxx: 消息内容)，或者只显示有新消息(您有一条新消息)；

```
/*!
 *  \~chinese 
 *  推送消息的显示风格
 */
typedef enum {
    EMPushDisplayStyleSimpleBanner = 0, /*! 
                                         *  简单显示"您有一条新消息"
                                         */

    EMPushDisplayStyleMessageSummary,   /*! 
                                         *  显示消息内容
                                         */
} EMPushDisplayStyle;
/*!
 *  \~chinese
 *  设置推送消息显示的样式
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param pushDisplayStyle  要设置的推送样式
 *
 *  @result 错误信息
 */
- (EMError *)updatePushDisplayStyle:(EMPushDisplayStyle)pushDisplayStyle;


/*!
 *  \~chinese
 *  设置推送的显示名
 *
 *  @param pushDisplayStyle     推送显示样式
 *  @param aCompletionBlock     完成的回调
 */
- (void)updatePushDisplayStyle:(EMPushDisplayStyle)pushDisplayStyle
                    completion:(void (^)(EMError *))aCompletionBlock;
```

示例代码

```
// 设置为“您有一条新消息”
EMError *err = [EMClient.sharedClient.pushManager updatePushDisplayStyle:EMPushDisplayStyleSimpleBanner];
if (err) {
    // 设置失败
}else {
    // 设置成功
}
```

## 设置免打扰时段

当您不想，或者某些时间段不想接收离线推送的时候，您可以设置免打扰时间段，设置后，在您指定的时间段内，环信不会给您发离线推送。 该设置优先级最高，当设置后，群组，单聊的推送在指定时间段内都无法收到。

开启离线推送

```
/*!
 *  \~chinese
 *  开启离线推送
 *
 *  同步方法，会阻塞当前线程
 *
 *  @result 错误信息
 *
 */
- (EMError *)enableOfflinePush;
```

示例代码

```
EMError *err = [EMClient.sharedClient.pushManager enableOfflinePush];
if (err) {
    // 设置失败
}else {
    // 设置成功
}
```

指定时间不接收离线推送

```
/*!
 *  \~chinese
 *  关闭离线推送
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param aStartHour    开始时间
 *  @param aEndHour      结束时间
 *
 *  @result              错误信息
 */
- (EMError *)disableOfflinePushStart:(int)aStartHour end:(int)aEndHour;
```

示例代码

```
// 如果您想全天不接收推送，start:0, end:24;
// 如果您想早7点到下午5天不接收推送，start:7, end:17;
// 如果您想晚10点到早晨8点不接收推送，start:22, end:8;
EMError *err = [EMClient.sharedClient.pushManager disableOfflinePushStart:0 end:24];
if (err) {
    // 设置失败
}else {
    // 设置成功
}
```

## 设置群组免打扰

当您不想收到某个群的离线推送时，您可以设置群组免打扰

```
/*!
 *  \~chinese
 *  设置群组是否接收推送
 *
 *  同步方法，会阻塞当前线程
 *
 *  @param aGroupIds    群组id
 *  @param disable      是否接收推送
 *
 *  @result             错误信息
 */
- (EMError *)updatePushServiceForGroups:(NSArray *)aGroupIds
                            disablePush:(BOOL)disable;


/*!
 *  \~chinese
 *  设置群组是否接收推送
 *
 *  @param aGroupIds            群组id
 *  @param disable              是否接收推送
 *  @param aCompletionBlock     完成的回调
 */
- (void)updatePushServiceForGroups:(NSArray *)aGroupIds
                       disablePush:(BOOL)disable
                        completion:(void (^)(EMError *))aCompletionBlock;
```

示例代码

```
// 不接受群id是82000139的群组推送。
EMError *err = [EMClient.sharedClient.pushManager updatePushServiceForGroups:@[@"82000139"] disablePush:YES];
if (err) {
   // 设置失败
}else {
   // 设置成功
}
```