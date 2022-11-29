# SDK 集成概述

<Toc />

介绍 iOS 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号并获得 App key，详见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

详见 [开发环境要求](quickstart.html#前提条件)。

## SDK 初始化

初始化是使用 SDK 的必要步骤，需在执行所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化示例代码：

```Objective-C
// appkey 替换成你在环信即时通讯 IM 管理后台注册应用中的 App Key 
EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];
[[EMClient sharedClient] initializeSDKWithOptions:options];
```


## 注册用户

可以使用如下代码创建账号：

```Objective-C
// 异步方法 
[[EMClient sharedClient] registerWithUsername:@"username"
                                         password:@"your password"
                                       completion:^(NSString *aUsername, EMError *aError) {                             
                                   }];
```

:::notice
- 以上注册模式为在客户端注册，旨在方便测试，并不推荐在正式环境中使用；
- 正式环境应使用服务器端调用 REST API 接口 [注册用户](https://docs-im.easemob.com/ccim/rest/accountsystem#注册用户)。
:::

## 用户登录

目前登录服务器支持手动和自动登录。手动登录有三种方式：

- 通过 **用户 ID + 密码** 登录；
- 通过 **用户 ID + token** 登录；
- 通过 **用户 ID + agoraToken** 登录。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如每次登录时更新 token 等机制。
:::

### 手动登录

**用户 ID + 密码** 是传统的登录方式。用户名和密码均由你的终端用户自行决定，密码需要符合密码规则要求。

```Objective-C
// 异步方法 
[[EMClient sharedClient] loginWithUsername:@"username"
                                     password:@"your password"
                                   completion:^(NSString *aUsername, EMError *aError) {
                                                                 
}];


```

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取，详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。

```Objective-C
// 异步方法 
[EMClient.sharedClient loginWithUsername:@"username" token:@"token" completion:^(NSString * _Nonnull aUsername, EMError * _Nullable aError) {
        
}];
```

**用户 ID + agoraToken** 是支持声网 token 直接登录的方式，一般用于同时使用声网和环信产品的情况。token 获取请参考 [使用 token 鉴权](https://docs.agora.io/en/agora-chat/develop/authentication?platform=android)。

```Objective-C
// 异步方法 
[EMClient.sharedClient loginWithUsername:@"username" agoraToken:@"agoraToken" completion:^(NSString * _Nonnull aUsername, EMError * _Nullable aError) {
            
}];
```

### 自动登录

在初始化的时候，可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录。

自动登录完成后，触发 `EMClientDelegate` 中的以下回调：

```Objective-C
- (void)autoLoginDidCompleteWithError:(EMError * _Nullable)aError
{
}
```

## 退出登录

```Objective-C
// 异步方法 
[EMClient.sharedClient logout:YES completion:^(EMError * _Nullable aError) {
        
}];
```

## 连接状态相关

你可以通过注册连接监听 `EMClientDelegate` 确认连接状态。

```Objective-C
- viewDidLoad
{
    ...
    // 注册连接状态监听，在 SDK 初始化之后调用。
    [EMClient.sharedClient addDelegate:self delegateQueue:nil];
    ...
}

// 连接状态变更时触发该回调
- (void)connectionStateDidChange:(EMConnectionState)aConnectionState
{
    if(aConnectionState == EMConnectionConnected) {
        // 连接成功
    }else {
        // 断开连接
    }
}

// token 已过期，使用 agoraToken 登录可能触发
- (void)tokenDidExpire:(EMErrorCode)aErrorCode
{
}

// token 已过期，使用 agoraToken 登录可能触发
- (void)tokenWillExpire:(EMErrorCode)aErrorCode
{
}
```

### 断网自动重连

如果由于网络信号弱、切换网络等原因引起的连接中断，SDK 会自动尝试重连。重连成功或者失败会触发回调 `- (void)connectionStateDidChange:(EMConnectionState)aConnectionState`。

### 被动退出登录

你可以通过监听 `EMClientDelegate` 中的以下回调，调用 `EMClient#logout:completion:`  退出登录并返回登录界面。

```
// 当前登录账号在其它设备登录时会触发回调
- (void)userAccountDidLoginFromOtherDevice
{
}

// 当前登录账号被强制退出时会收到该回调，如密码被修改、登录设备过多、服务被封禁、被强制下线等原因
- (void)userAccountDidForcedToLogout:(EMError *_Nullable)aError
{
}

// 当前登录账号已被从服务器端删除时会收到该回调
- (void)userAccountDidRemoveFromServer
{
}

// 当前用户账号被禁用时会收到该回调
- (void)userDidForbidByServer
{
}
```

## 输出信息到日志文件

SDK 默认的日志输出级别为 `DEBUG`，开发阶段如果希望在环信即时通讯云管理后台上输出 SDK 日志，可在 SDK 初始化时开启以下开关：

```Objective-C
EMOptions* option = [EMOptions optionsWithAppkey:@"<#appkey#>"];
// 日志输出到环信即时通讯管理后台
option.enableConsoleLog = YES;
// 调整日志输出级别，默认为 `Debug`
option.logLevel = EMLogLevelDebug;
[EMClient.sharedClient initializeSDKWithOptions:option];
```

### 获取本地日志

SDK 会写入日志文件到本地。日志文件路径如下：沙箱Library/Application Support/HyphenateSDK/easemobLog/easemob.log。

以真机为例，获取本地日志过程如下：

- 打开 Xcode，连接设备，选择 **Xcode** > **Window** > **Devices and Simulators**。
- 进入 **Devices** 选项卡，在左侧选择目标设备，例如 Easemob IM，点击设置图标，然后选择 **Download Container**。

![img](@static/images/ios/overview_fetchlogfile.png)

日志文件 `easemob.log` 文件在下载包的 AppData/Library/Application Support/HyphenateSDK/easemobLog 目录下。
