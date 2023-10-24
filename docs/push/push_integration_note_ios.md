# iOS 推送集成

本文档为IM SDK中关于推送功能的集成说明。

## iOS SDK 使用须知

使用 SDK 之前，你需先创建应用，获取应用的唯一标识 App Key，请参见[创建应用](/product/enable_and_configure_IM.html#创建应用)。

环信推送分为在线推送和远程推送，远程推送时通过 APNS 下发，所以你需要配置应用对应的证书，请参见[APNS 推送配置](/document/ios/push.html#开启推送权限并上传推送证书)。

## 集成 SDK

环信 SDK 支持 pod 方式导入和手动导入两种方式，任选其一即可，下面分别介绍这两种导入方式。

**注意**

自 3.8.7 版本开始，SDK 只支持 iOS 10 及以上版本。

### Pod 导入 SDK

推荐使用 CocoaPods 集成环信 SDK。CocoaPods 提供了一个简单的依赖管理系统，避免手动导入产生的错误（首先需要确认已经安装了 Cocoapods，如果没有安装过 Cocoapods，请参考[安装使用指南](https://www.cnblogs.com/wangluochong/p/5567082.html)。

```pod
sudo gem install cocoapods
pod setup
```

在 Xcode 项目的根目录下，新建一个空文件，命名为 `Podfile`，向此文件添加以下行：

```pod
pod 'HyphenateChat'
```

在 `Podfile` 目录下，执行以下指令：

```pod
pod install --repo-update 
```

执行 `pod install` 后，打开工程目录，找到 `.xcworkspace` 文件运行即可。

### 手动导入

[下载环信 demo](https://www.easemob.com/download/demo)。

开发者最开始集成，如果选择手动导入文件集成的方式，只需要向工程中添 HyphenateChat 就可以，下面会介绍具体的集成方式。

demo 中的 SDK 文件夹为 **Hyphenate SDK**，将 SDK 文件夹拖入到工程中，并勾选截图中标注的三项。

![img](@static/images/instantpush/push_iossdk_import.png)

### 设置工程属性

在 Xcode 中，向 **General > Embedded Binaries** 中添加依赖库。

:::notice
将**Do Not Embed** 改成**Embed & Sign**。
:::

![img](@static/images/instantpush/push_ios_projectpropertysetting.png)

## SDK 基础功能

环信推送和环信 IM 使用相同的 SDK，使用功能都需要初始化 SDK 并进行登录操作。

### 初始化 SDK

第 1 步：引入相关头文件 `#import `。

第 2 步：在工程的 AppDelegate 中的以下方法中，调用 SDK 对应方法。

```objectiveC
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    //AppKey：注册的 AppKey，详细见下面注释。
    //apnsCertName：推送证书名（不需要加后缀），详细见下面注释。
    EMOptions *options = [EMOptions optionsWithAppkey:@"easemob-demo#easeim"];
    options.apnsCertName = @"EaseIM_APNS_Developer";
    [[EMClient sharedClient] initializeSDKWithOptions:options];

    return YES;
}

// APP 进入后台。
- (void)applicationDidEnterBackground:(UIApplication *)application
{
    [[EMClient sharedClient] applicationDidEnterBackground:application];
}

// APP 将要从后台返回。
- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [[EMClient sharedClient] applicationWillEnterForeground:application];
}
```

调用的 SDK 接口参数解释如下：
- App Key: 区别 APP 的标识，请参考[开发者注册及管理后台](https://docs-im.easemob.com/im/quickstart/guide/experience#注册并创建应用)。
- apnsCertName: iOS 中推送证书名称，请参考[制作与上传推送证书](https://docs-im.easemob.com/im/ios/apns/deploy)。

### SDK 登录流程

登录：调用 SDK 的登录接口进行的操作。建议使用异步登录方法，防止网络不好的情况下，出现卡 UI 主线程的情况出现。

```objectiveC
[[EMClient sharedClient] loginWithUsername:@"8001" password:@"111111" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"登录成功");
    } else {
        NSLog(@"登录失败的原因---%@", aError.errorDescription);
    }
}];
```

有关更多注册登录等基础功能，请参考[iOS SDK基础功能](https://docs-im.easemob.com/im/ios/sdk/basic)。

## SDK 推送集成

##### 1.注册开启推送通知

```objectiveC
if (NSClassFromString(@"UNUserNotificationCenter")) {
        //注册推送，用于 iOS 10 及以上版本。
        [[UNUserNotificationCenter currentNotificationCenter] requestAuthorizationWithOptions:UNAuthorizationOptionBadge | UNAuthorizationOptionSound | UNAuthorizationOptionAlert completionHandler:^(BOOL granted, NSError *error) {
            if (granted) {
                dispatch_async(dispatch_get_main_queue(), ^{
                    [application registerForRemoteNotifications];
                });
            }
        }];
        return;
    }
    
    if([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
        //iOS 8 至 iOS 10 推送样式设置。
        UIUserNotificationType notificationTypes = UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert;
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:notificationTypes categories:nil];
        [application registerUserNotificationSettings:settings];
    }
    
    if ([application respondsToSelector:@selector(registerForRemoteNotifications)]) {
        //注册推送，用于 iOS 8 及以上版本。
        [application registerForRemoteNotifications];
    } else {
        //注册推送，用于 iOS 8 之前版本。
        UIRemoteNotificationType notificationTypes = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeSound | UIRemoteNotificationTypeAlert;
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:notificationTypes];
    }
```

##### 2.将获得的 deviceToken 传到 SDK

:::notice
如果是 iOS 13 及以上的系统，请将 SDK 更新至 v3.6.4 或以上版本。
:::

```objectiveC
// 将获得的 deviceToken 传给 SDK。 
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [[EMClient sharedClient] bindDeviceToken:deviceToken];
    });
}
```

3.开启环信推送处理

```objectiveC
[[EMLocalNotificationManager sharedManager] launchWithDelegate:self];
```

##### 4.处理代理

如果你需要推送相关信息，可以通过实现代理获取，环信提供的代理如下：

方式一

实现以下两个代理，通过 completionHandler 您可以更改通知方式：

```objectiveC
- (void)emuserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    NSDictionary *userInfo = notification.request.content.userInfo;
    if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        NSLog(@"APNS userInfo : %@ ",userInfo);
    }else{
        NSLog(@"EaseMob userInfo : %@ \n ext : %@",userInfo,userInfo[@"ext"]);
    }
    completionHandler(UNNotificationPresentationOptionBadge|UNNotificationPresentationOptionSound|UNNotificationPresentationOptionAlert);//通知方式 可选 badge，sound，alert 如果实现了这个代理方法，则必须有 completionHandler 回调。
}

- (void)emuserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)(void))completionHandler
{
    NSDictionary *userInfo = response.notification.request.content.userInfo;
    if ([response.notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        NSLog(@"APNS userInfo : %@ \n ",userInfo);
    }else{
        NSLog(@"EaseMob userInfo : %@ \n ext : %@",userInfo,userInfo[@"ext"]);
    }
    completionHandler();//如果实现了这个代理方法 ，则必须有 ''%%completionHandler%%'' 回调。
}
```

方式二

通过下面代理获取推送相关信息：

```objectiveC
//如果需要获取数据，只实现这一个代理方法即可。
- (void)emGetNotificationMessage:(UNNotification *)notification state:(EMNotificationState)state
{
    NSDictionary *userInfo = notification.request.content.userInfo;
    if ([notification.request.trigger isKindOfClass:[UNPushNotificationTrigger class]]) {
        //APNS 推送。
        NSLog(@"APNS userInfo : %@ \n ",userInfo);
    }else{
        //本地推送。
        NSLog(@"userInfo : %@ \n ext : %@",userInfo,userInfo[@"ext"]);
    }
    
    if (state == EMDidReceiveNotificationResponse) {
        //打开通知 可通过扩展字段自己实现跳转。
    }else{
        //展示通知。
    }
}
```

推送通知透传消息获取

```objectiveC
//当应用收到环信推送透传消息时，此方法会被调用。 
- (void)emDidReceivePushSilentMessage:(NSDictionary *)messageDic
{
    NSLog(@"emDidReceivePushSilentMessage : %@",messageDic);
}
```

##### 5.进阶

iOS 的本地通知管理模块 `UNUserNotificationCenter` 是单例，一个 App 中只能有一个实例。如果在启用 SDK 在线推送后，App 又重写了 `[UNUserNotificationCenter currentNotificationCenter].delegate`，会将 SDK 中的 delegate 覆盖，此时，需要在 App 实现的 `UNUserNotificationCenterDelegate` 中调用 SDK 的相关处理，过程如下：

```objectiveC
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
    [[EMLocalNotificationManager sharedManager] userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler
{
    [[EMLocalNotificationManager sharedManager] userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
```

环信推送和 IM 使用相同的 SDK，可以查看 IMSDK [更多推送功能](https://docs-im.easemob.com/im/ios/apns/offline)。