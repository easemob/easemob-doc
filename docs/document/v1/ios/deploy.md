# APNs推送

## SDK的运行状态

- 当 App 在前台可见的时候，SDK 处于前台活跃状态，此时是使用 SDK 长连接接收消息。

- 当 App 进入后台，短时间内 SDK 处于后台活跃状态，此时是使用 SDK 长连接接收消息(用户根据需要实现本地通知，否则将不会有本地通知提示弹出)。

- 当 App 进入后台被系统挂起，此时 SDK 处于不活跃状态，或者是主动把App进程杀死，此时如果有新消息，是通过苹果的 APNs 服务进行提醒的。当 App 再次启动，SDK 会去服务器拉取不活跃期间的消息。

**注意：**`由于本地通知和 APNs 不好区分，调试时建议您将 App 进程杀死，确保所有的提醒都是来自于 APNs 推送。`

## 消息推送流程

### 当SDK处于前台或后台活跃状态时:

![img](@static/images/privitization/apns_image006.png)

### 当SDK处于不活跃状态或App进程被杀死时：

![img](@static/images/privitization/apns_image007.png)

:::tip
APNs只是起到通知作用，当用户启动App，消息会通过SDK长连接收取到客户端。
:::

## 配置推送

### 申请远程推送证书

1. 首先，登录苹果的[开发者中心](https://developer.apple.com/), 创建App 

<img src=@static/images/privitization/apns_setting_1.jpg  title=apns_setting_1 width="600"/><br/>
<img src=@static/images/privitization/apns_setting_2.jpg  title=apns_setting_2 width="600"/><br/>
<img src=@static/images/privitization/apns_setting_3.jpg  title=apns_setting_3 width="600"/><br/>

--------
2. 为App命名，此处bundle id不能用通配符，否则无法收到推送。

<img src=@static/images/privitization/apns_setting_4.jpg  title=apns_setting_4 width="600"/><br/>

--------
3. 打开推送功能

<img src=@static/images/privitization/apns_setting_5.jpg  title=apns_setting_5 width="600"/><br/>
<img src=@static/images/privitization/apns_setting_6.jpg  title=apns_setting_6 width="600"/><br/>


--------
4. 创建推送证书

<img src=@static/images/privitization/apns_setting_7.jpg  title=apns_setting_7 width="600"/><br/>

如果您是测试开发环境，选择Services下的Apple Push Notification service SSL(Sandbox)，如果是生产环境，则需要选择Services下的Apple Push Notification service SSL(Sandbox & Production)

<img src=@static/images/privitization/apns_setting_8.jpg  title=apns_setting_8 width="600"/><br/>

--------
5. 选择证书所属的App

<img src=@static/images/privitization/apns_setting_9.jpg  title=apns_setting_9 width="600"/><br/>

--------
6. 上传CSR文件

<img src=@static/images/privitization/apns_setting_10.jpg  title=apns_setting_10 width="600"/><br/>

下面，我们来创建一个CSR文件，首先，选择“钥匙串访问”

<img src=@static/images/privitization/apns_create9.jpg  title=apns_create9 width="600"/><br/>

钥匙串访问 – 证书助理 – 从证书颁发机构请求证书

<img src=@static/images/privitization/apns_create10.jpg  title=apns_create10 width="600"/><br/>

电子邮件没有要求，符合邮件格式就可以，常用名也没有限制，要注意将“请求是”的参数改为**“存储到磁盘”**, 之后会得到一个CSR文件。

<img src=@static/images/privitization/apns_create11.jpg  title=apns_create11 width="600"/><br/>

返回到“上传CRS文件”页面，将刚刚生成的CSR文件上传。

<img src=@static/images/privitization/apns_create12.jpg  title=apns_create12 width="600"/><br/>

点击继续，会得到一个下载页面。

<img src=@static/images/privitization/apns_setting_11.jpg  title=apns_setting_11 width="600"/><br/>

<img src=@static/images/privitization/apns_setting_12.jpg  title=apns_setting_12 width="600"/><br/>

点击下载，就会下载一个aps_development.cer。(production的是aps.cer)

<img src=@static/images/privitization/apns_create15.jpg  title=apns_create15 width="600"/><br/>

双击下载的cer文件，就会将它添加到“钥匙串访问”中。查看证书，会看到一个以bundle id 证书，这个就是新添加进去的。

<img src=@static/images/privitization/apns_create16.jpg  title=apns_create16 width="600"/><br/>

:::tip
右键导出，注意右键的时候不要展开，就在证书上点击右键
:::

<img src=@static/images/privitization/apns_create17.jpg  title=apns_create17 width="600"/><br/>

保存

<img src=@static/images/privitization/apns_create18.jpg  title=apns_create18 width="600"/><br/>

此处需要记住密码，后面需要用到。 `注意：导出p12证书时，设置证书的密码长度不要超过20个字符，建议使用纯英文或者数字组合，不建议带特殊字符`

<img src=@static/images/privitization/apns_create19.jpg  title=apns_create19 width="600"/><br/>

允许钥匙串访问此项目。

<img src=@static/images/privitization/apns_create20.jpg  title=apns_create20 width="600"/><br/>

保存，您将得到一个p12后缀的文件。

<img src=@static/images/privitization/apns_create21.jpg  title=apns_create21 width="600"/><br/>

### 上传推送证书到环信

登录环信管理后台，找到要上传证书的Appkey，点击`管理->即时推送->配置证书`下配置证书，选择`添加推送证书`下的苹果选项。

<img src=@static/images/privitization/push_cert.png  title=push_cert width="600"/><br/>

选择`上传证书`按钮

<img src=@static/images/privitization/apns_create12.jpg  title=apns_create12 width="600"/><br/>


为证书起名，并记住名称，后续有用。选择上传证书，将上一步中生成的P12文件上传，并设置导出时设置的密码。选择证书类型，此处是【开发环境】(如果之前用的是production，则此处应该选择生产)。填写应用包名，应为**bundle id**，点击上传，完成上传证书操作。

:::tip
注意：证书的名称和密码的长度不要超过20个字符，建议使用纯英文或者数字组合，不建议带特殊字符
:::

<img src=@static/images/privitization/push_setcert.png title=push_setcert width="600"/><br/>

### 客户端如何申请DeviceToken

1、 注册远程通知

```
if ([application respondsToSelector:@selector(registerUserNotificationSettings:)]) {
    //注册推送, 用于iOS8以及iOS8之后的系统
    UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:(UIUserNotificationTypeBadge | UIUserNotificationTypeSound | UIUserNotificationTypeAlert) categories:nil];
    [application registerUserNotificationSettings:settings];
} else {
    //注册推送，用于iOS8之前的系统
    UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound;
    [application registerForRemoteNotificationTypes:myTypes];
}
	
- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
    [application registerForRemoteNotifications];
}
```

2、 将得到的deviceToken传到SDK

```
如果是iOS13及以上的系统，请将SDK更新到v3.6.4或以上版本
// 将得到的deviceToken传给SDK
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        [[EMClient sharedClient] bindDeviceToken:deviceToken];
    });
}
```

**注：必须是真机，模拟器不支持APNs。APNs 注册失败，一般是由于使用了通用证书或者是模拟器调试导致，请检查证书并用真机调试。此处是 iOS 系统报的错，如仍不能确定，请从网上查找相关资料。**

### 客户端如何配置推送证书

SDK在初始化的时候，设置要使用的推送证书。

```
// 设置Appkey
EMOptions *options = [EMOptions optionsWithAppkey:@"easemob-demo#chatdemoui"];
// 设置推送证书名称
options.apnsCertName = @"apnsTest";
// 初始化SDK
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 使用在线推送通道

与APNs离线推送使用苹果厂商推送通道不同，在线推送通道使用环信长连接接收推送，之后以本地通知的形式展示推送消息，可以有效提升推送到达率。 集成在线推送过程如下：

1. 申请本地通知权限
2. 启用SDK在线推送
3. 处理Delegate

### 申请本地通知权限

由于要使用本地通知展示推送消息，你需要在App中需要申请权限，过程如下：

```
UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
    [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound) completionHandler:^(BOOL granted, NSError * _Nullable error) {
        
    }];
```

### 启用SDK在线推送

在启用APNs在线推送前，你需要完成IM SDK的初始化工作

SDK初始化完成后，启用APNs在线推送过程如下：

```
[[EMLocalNotificationManager sharedManager] launchWithDelegate:self];
```

### 处理Delegate

在启用在线通道过程中，SDK会重写 **[UNUserNotificationCenter currentNotificationCenter]** 的delegate，如果要处理其他本地通知，需要实现**EMLocalNotificationDelegate**，过程如下

```
#pragma mark - EMLocalNotificationDelegate
- (void)emuserNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
    // // 这里处理其他本地通知
    completionHandler(UNNotificationPresentationOptionAlert);
}
- (void)emuserNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler
{
    NSDictionary* userInfo = response.notification.request.content.userInfo;
    // 这里处理其他本地通知
    completionHandler();
}
```

### 进阶

iOS的本地通知管理模块**UNUserNotificationCenter**是单例，一个App 中只能有一个实例，如果在启用SDK在线推送之后，App又重写了 **[UNUserNotificationCenter currentNotificationCenter].delegate**，会把SDK中的delegate覆盖掉，此时需要在App实现的**UNUserNotificationCenterDelegate**中，调用SDK的相关处理，过程如下

```
#pragma mark - UNUserNotificationCenterDelegate

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
    // 处理其他通知
    ...
    // 调用SDK推送在线通道处理
    [[EMLocalNotificationManager sharedManager] userNotificationCenter:center willPresentNotification:notification withCompletionHandler:completionHandler];
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void(^)(void))completionHandler
{
    
    // 处理其他通知
    ...
    // 调用SDK推送在线通道处理
    [[EMLocalNotificationManager sharedManager] userNotificationCenter:center didReceiveNotificationResponse:response withCompletionHandler:completionHandler];
}
```

## 常见问题

### 如何实现本地通知

本地通知，是在长连接还存在的时候，`通过环信收消息的回调接收到消息`，之后判断当前App的状态，如果是在后台的情况下，就可以`通过代码主动弹出一个通知`，来起到通知用户的作用。具体参考如下:

```
- (void)messagesDidReceive:(NSArray *)aMessages {
		for (EMMessage *msg in aMessages) {
	        UIApplicationState state = [[UIApplication sharedApplication] applicationState];
	        // App在后台
	        if (state == UIApplicationStateBackground) {
					//发送本地推送
	   	         if (NSClassFromString(@"UNUserNotificationCenter")) { // ios 10
                // 设置触发时间
                UNTimeIntervalNotificationTrigger *trigger = [UNTimeIntervalNotificationTrigger triggerWithTimeInterval:0.01 repeats:NO];
                UNMutableNotificationContent *content = [[UNMutableNotificationContent alloc] init];
                content.sound = [UNNotificationSound defaultSound];
                // 提醒，可以根据需要进行弹出，比如显示消息详情，或者是显示“您有一条新消息”
                content.body = @"提醒内容";
                UNNotificationRequest *request = [UNNotificationRequest requestWithIdentifier:msg.messageId content:content trigger:trigger];
                [[UNUserNotificationCenter currentNotificationCenter] addNotificationRequest:request withCompletionHandler:nil];
            }else {
                UILocalNotification *notification = [[UILocalNotification alloc] init];
                notification.fireDate = [NSDate date]; //触发通知的时间
                notification.alertBody = @"提醒内容";
                notification.alertAction = @"Open";
                notification.timeZone = [NSTimeZone defaultTimeZone];
                notification.soundName = UILocalNotificationDefaultSoundName;
                [[UIApplication sharedApplication] scheduleLocalNotification:notification];
            }
        }
    }
}
```

### 推送内容解析

在环信中，APNs是在长连接不存在的时候，才会产生(即App进程不存在或者被挂起)。此时iOS是不允许直接得到APNs内容的，但是当用户点击推送的提示栏，此时是可以在
launchOptions中得到APNs的内容。具体解析结构如下：

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
```



```
{
    "aps":{
        "alert":{
            "body":"您有一条新消息" // 消息内容
        },	 
        "badge":1,	// 角标数
        "sound":"default"	// 提示音	 
     },
    "f":"6001",	// 消息发送方
    "t":"6006",	// 消息接收方	 
    "m":"373360335316321408"， // 消息id
    "g":"1421300621769"  // 群组id（如果是单聊则没有该字段）
 }
```

更多用法，可以参考 （[APNs解析](content)）

### 证书到期后如何更新

证书到期后，要更换新的推送证书，需要在环信管理后台将旧的删除，之后重新上传，`上传时的命名要与旧证书的命名一致`。

### 一个Appkey下是否可以传多组推送证书

一个appkey下可以传多个证书，这就可以实现夸App聊天，在不同App中初始化sdk的时候，指定不同的推送证书，每个证书对应当前App的bundle id，这样，用户在登录不同的App的时候就会绑定到不同的推送证书，从而实现夸App的聊天和推送。