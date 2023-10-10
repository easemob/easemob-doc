#  SDK集成概述


在您阅读此文档时，我们假定您已经具备了基础的 iOS 应用开发经验，并能够理解相关基础概念。

## SDK 同步/异步方法区分

SDK 中，大部分接口都提供了同步和异步方法（注：同步方法会阻塞主线程，需要用户自己创建异步线程执行；带有 block 的方法为异步方法。）

## 初始化 SDK

第 1 步：引入相关头文件 #import <HyphenateChat/HyphenateChat.h>。

第 2 步：在工程的 AppDelegate 中的以下方法中，调用 SDK 对应方法。

```
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    //AppKey:注册的AppKey，详细见下面注释。
    //apnsCertName:推送证书名（不需要加后缀），详细见下面注释。
    EMOptions *options = [EMOptions optionsWithAppkey:@"douser#istore"];
    options.apnsCertName = @"istore_dev";
    [[EMClient sharedClient] initializeSDKWithOptions:options];

    return YES;
}

// APP进入后台
- (void)applicationDidEnterBackground:(UIApplication *)application
{
    [[EMClient sharedClient] applicationDidEnterBackground:application];
}

// APP将要从后台返回
- (void)applicationWillEnterForeground:(UIApplication *)application
{
    [[EMClient sharedClient] applicationWillEnterForeground:application];
}
```

调用的 SDK 接口参数解释如下：

- AppKey: 区别 APP 的标识，参考[开发者注册及管理后台](/document/v1/privatization/uc_configure.html#创建应用)。
- apnsCertName: iOS 中推送证书名称，参考[制作与上传推送证书](quickstart)。

环信为 IM 部分提供了 APNS 推送功能，如果您要使用，请跳转到[APNS离线推送](offline)。

## 注册

注册模式分两种，开放注册和授权注册。

建议使用异步注册方法，防止网络不好的情况下，出现卡UI主线程的情况出现。

- 只有开放注册时，才可以客户端注册。开放注册是为了测试使用，正式环境中不推荐使用该方式注册环信账号。
- 授权注册的流程应该是您服务器通过环信提供的 REST API 注册，之后保存到您的服务器或返回给客户端。

```
[[EMClient sharedClient] registerWithUsername:@"8001" password:@"111111" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"注册成功");
    } else {
        NSLog(@"注册失败的原因---%@", aError.errorDescription);
    }
}];
```

## 登录

登录：调用 SDK 的登录接口进行的操作。

建议使用异步登录方法，防止网络不好的情况下，出现卡UI主线程的情况出现。

```
[[EMClient sharedClient] loginWithUsername:@"8001" password:@"111111" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"登录成功");
    } else {
        NSLog(@"登录失败的原因---%@", aError.errorDescription);
    }
}];
```

## 使用token登录

SDK也支持使用token登录，比如在app的服务器获取token，然后交给应用使用token登录。

**`请注意： 使用token 登录时需要处理token过期的问题，比如在每次登录时更新token 等机制。`**

```
[[EMClient sharedClient] loginWithUsername:@"8001" token:@"111111" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        NSLog(@"登录成功");
    } else {
        NSLog(@"登录失败的原因---%@", aError.errorDescription);
    }
}];
```

## 自动登录

自动登录：sdk在初始化的时候会根据options中的isAutoLogin来决定是否执行自动登录，如果为YES，则sdk会直接登录上次登录且未做退出操作的账号，如果值为NO，则为未登录任何账号的状态。

```
注意：3.6.5版本之后，isAutoLogin默认为YES，SDK会自动登录
3.6.5之前的版本，isAutoLogin默认为NO，SDK是不会自动登录的，如果要使用自动登录需要按照下面的方式主动设置。
[[EMClient sharedClient] loginWithUsername:@"8001" password:@"111111" completion:^(NSString *aUsername, EMError *aError) {
    if (!aError) {
        // 设置自动登录
        [[EMClient sharedClient].options setIsAutoLogin:YES];
        NSLog(@"登录成功-----");
    } else {
        NSLog(@"登录失败----%@", aError.errorDescription);
    }
}];
```

当出现以下几种情况时，建议调用 SDK 的登出操作。

- 用户的账号从服务器端删除

```
/*!
 *  当前登录账号已经被从服务器端删除时会收到该回调
 */
- (void)userAccountDidRemoveFromServer;
```

- 用户的账号被禁用(被封禁用户自动登录的时候触发)

```
/*!
 *  服务被禁用
 */
- (void)userDidForbidByServer;
```

- 用户的账号从服务器端被强制下线
- 用户在别的设备上登录，把当前设备上登录的用户踢出
- 用户在别的设备上更改了密码

```
/*!
 *  当前登录账号被强制退出时会收到该回调，有以下原因：
 *    1.密码被修改；
 *    2.登录设备数过多；
 *    3.服务被封禁;
 *    4.被强制下线;
 */
- (void)userAccountDidForcedToLogout:(EMError *)aError;
```

SDK 中，如果发生自动登录，会有以下回调：

```
/*!
 *  自动登录返回结果
 *
 *  @param error 错误信息
 */
- (void)autoLoginDidCompleteWithError:(EMError *)error

//添加回调监听代理: [[EMClient sharedClient] addDelegate:self delegateQueue:nil];
```

## 重连

当掉线时，iOS SDK 会自动重连，只需要监听重连相关的回调，无需进行任何操作。

```
/*!
 *  SDK连接服务器的状态变化时会接收到该回调
 *
 *  有以下几种情况，会引起该方法的调用：
 *  1. 登录成功后，手机无法上网时，会调用该回调
 *  2. 登录成功后，网络状态变化时，会调用该回调
 *
 *  @param aConnectionState 当前状态
 */
- (void)connectionStateDidChange:(EMConnectionState)aConnectionState;
```

## 退出登录

退出登录分两种类型：主动退出登录和被动退出登录。

建议使用异步退出登录方法，防止网络不好的情况下，出现卡UI主线程的情况出现。

- 主动退出登录：调用 SDK 的退出接口；
- 被动退出登录：1. 正在登录的账号在另一台设备上登录；2. 正在登录的账号被从服务器端删除。

logout:YES：是否解除 device token 的绑定，在被动退出时 SDK 内部处理，需要调用退出方法。

```
[[EMClient sharedClient] logout:YES completion:^(EMError *aError) {
    if (!aError) {
        NSLog(@"退出登录成功");
    } else {
        NSLog(@"退出登录失败的原因---%@", aError.errorDescription);
    }
}];
```

## 被动退出登录

使用回调方法监听被动退出登录。

```
/*!
 *  当前登录账号在其它设备登录时会接收到该回调
 */
- (void)userAccountDidLoginFromOtherDevice;

/*!
 *  当前登录账号已经被从服务器端删除时会收到该回调
 */
- (void)userAccountDidRemoveFromServer;
```

## 输出信息到日志文件

用户可以在App中将需要的信息输出到SDK日志文件中，该接口从SDK 3.8.1开始支持，需要在完成SDK初始化之后调用。调用方法如下

```
[[EMClient sharedClient] log:@"这里完成初始化"];
```

## 用户被封禁后的提示

在[IM管理后台](/document/v1/privatization/uc_configure.html#用户管理)可以对用户进行管理，例如可以在后台封禁用户。 用户被封禁后会提示SDK登录会返回 SERVER_SERVING_DISABLED(305), 可以根据用户这个返回值来进行相应的提示或者处理。

需要注意的是app整个被禁用时也会返回上述错误码，由于app一般不会被禁用，所以可以用来提示用户被封禁。