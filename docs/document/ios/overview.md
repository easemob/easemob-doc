# SDK 集成概述

<Toc />

介绍 iOS 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号并获得 App key，详见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

详见 [开发环境要求](quickstart.html#前提条件)。

## SDK 初始化

初始化是使用 SDK 的必要步骤，需在所有接口方法调用前完成。

如果进行多次初始化操作，只有第一次初始化以及相关的参数生效。

初始化示例代码：

```objectivec
// appkey 替换成你在环信即时通讯 IM 管理后台注册应用中的 App Key
EMOptions *options = [EMOptions optionsWithAppkey:@"<#appkey#>"];
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 注册用户

目前用户注册方式有以下几种：
- 通过控制台注册。
- 通过 REST API 接口注册。
- 调用 SDK 接口注册。

### 控制台注册

通过控制台注册用户，详见[创建 IM 用户](/product/enable_and_configure_IM.html#创建-im-用户)。

### REST API 注册

请参考 [注册用户](/document/server-side/account_system.html#注册用户)。

### SDK 注册

若支持 SDK 注册，需登录[环信即时通讯云控制台](https://console.easemob.com/user/login)，选择 **即时通讯** > **服务概览**，将 **设置**下的 **用户注册模式** 设置为 **开放注册**。

```Objective-C
// 异步方法
[[EMClient sharedClient] registerWithUsername:@"username"
                                         password:@"your password"
                                       completion:^(NSString *aUsername, EMError *aError) {
                                   }];
```

:::notice
该注册模式为在客户端注册，旨在方便测试，并不推荐在正式环境中使用。
:::

## 用户登录

目前登录服务器支持手动和自动登录。手动登录有两种方式：

- 用户 ID + 密码
- 用户 ID + token

### 手动登录

登录时传入的用户 ID 必须为 String 类型，支持的字符集详见[用户注册的 RESTful 接口](/document/server-side/account_system.html#注册用户)。

手动登录后，收到 `connectionStateDidChange` 回调表明 SDK 与环信服务器连接成功。

**用户 ID + 密码** 是传统的登录方式。用户名和密码均由你的终端用户自行决定，密码需要符合密码规则要求。

```Objective-C
    //SDK 初始化 `EMOptions` 时可以传入 `loginExtensionInfo` 属性投递给被踢下线的设备。该属性需要开启多设备登录的情况下才能生效。
    EMOptions *options = [EMOptions optionsWithAppkey:<#AppKey#>];
    options.loginExtensionInfo = @"you was kicked out by other device";
    [EMClient.sharedClient initializeSDKWithOptions:options];
// 异步方法
[[EMClient sharedClient] loginWithUsername:@"username"
                                     password:@"your password"
                                   completion:^(NSString *aUsername, EMError *aError) {

}];


```

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取，详见 [环信用户 token 的获取](/document/server-side/easemob_user_token.html)。

:::notice
使用 token 登录时需要处理 token 过期的问题，比如每次登录时更新 token 等机制。
:::

```objectivec
// 异步方法
[EMClient.sharedClient loginWithUsername:@"username" token:@"token" completion:^(NSString * _Nonnull aUsername, EMError * _Nullable aError) {

}];
```

登录重试机制如下：

- 登录时，若服务器返回明确的失败原因，例如，token 不正确，SDK 不会重试登录。
- 若登录因超时失败，SDK 会重试登录。

### 自动登录

在初始化的时候，可以设置是否自动登录。如果设置为自动登录，则登录成功之后，后续启动初始化的时候会自动登录。

自动登录完成后，触发 `EMClientDelegate` 中的以下回调：

```objectivec
- (void)autoLoginDidCompleteWithError:(EMError * _Nullable)aError
{
}
```

自动登录时，SDK 尝试连接服务器失败后，延时随机一段时间后自动重连。

## 退出登录

```objectivec
// 异步方法
[EMClient.sharedClient logout:YES completion:^(EMError * _Nullable aError) {

}];
```

## 连接状态相关

你可以通过注册连接监听 `EMClientDelegate` 确认连接状态。

```objectivec
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

你可以通过监听 `EMClientDelegate` 中的以下回调，调用 `EMClient#logout:completion:` 退出登录并返回登录界面。

```objectivec
// 当前登录账号在其它设备登录时，当前登录的设备被踢下线时会触发该回调。该回调在 4.7.0 及其以后版本已经被弃用，由 `userAccountDidLoginFromOtherDeviceWithInfo` 回调替换。
- (void)userAccountDidLoginFromOtherDevice 
{
}
// 当前登录账号在其它设备登录时，当前的登录设备被踢下线时会触发该回调。
- (void)userAccountDidLoginFromOtherDeviceWithInfo:(EMLoginExtensionInfo* _Nullable)info {
    //`EMLoginExtensionInfo` 中包含 `deviceName`（将当前设备踢下线的设备）以及 `loginExtensionInfo` 属性。`loginExtensionInfo` 即 SDK 初始化时传入的登录时携带给其他设备的扩展信息。
}

    //若每次登录都设置 `loginExtensionInfo`，需要通过 `EMClient` 获取 SDK 初始化时的options 属性进行设置。
    EMClient.sharedClient.options.loginExtensionInfo = @"";
    //然后再调用登录

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

环信即时通讯 IM 日志记录 SDK 相关的信息和事件。环信技术支持团队帮你排查问题时可能会请你发送 SDK 日志。

默认情况下，SDK 最多可生成和保存三个文件，`easemob.log` 和两个 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件。这些文件为 UTF-8 编码，每个不超过 2 MB。SDK 会将最新的日志写入 `easemob.log` 文件，写满时则会将其重命名为对应时间点的 `easemob_YYYY-MM-DD_HH-MM-SS.log` 文件，若日志文件超过三个，则会删除最早的文件。

例如，SDK 在 2024 年 1 月 1 日上午 8:00:00 记录日志时会生成 `easemob.log` 文件，若在 8:30:00 将 `easemob.log` 文件写满则会将其重命名为 `easemob_2024-01-01_08-30-00.log` 文件，随后在 9:30:30 和 10:30:30 分别生成了 `easemob_2024-01-01_09-30-30.log` 和 `easemob_2024-01-01_10-30-30.log` 文件，则此时 `easemob_2024-01-01_08-30-00.log` 文件会被移除。

SDK 的 `EMOptions#logLevel` 指定了日志输出级别，默认为 `EMLogLevelDebug`，即所有等级日志。

- (默认)EMLogLevelDebug：所有等级的日志；
- EMLogLevelWarning：警告及错误；
- EMLogLevelError：错误。

开发阶段若希望在 XCode console 上输出 SDK 日志，可在 SDK 初始化时打开开关。

```objectivec
EMOptions* option = [EMOptions optionsWithAppkey:@"<#appkey#>"];
// 日志输出到 XCode console
option.enableConsoleLog = YES;
// 调整日志输出级别，默认为所有级别。
option.logLevel = EMLogLevelDebug;
[EMClient.sharedClient initializeSDKWithOptions:option];
```

### 获取本地日志

SDK 会写入日志文件到本地。日志文件路径如下：沙箱 Library/Application Support/HyphenateSDK/easemobLog。

以真机为例，获取本地日志过程如下：

- 打开 Xcode，连接设备，选择 **Xcode** > **Window** > **Devices and Simulators**。
- 进入 **Devices** 选项卡，在左侧选择目标设备，例如 Easemob IM，点击设置图标，然后选择 **Download Container**。

![img](@static/images/ios/overview_fetchlogfile.png)

日志文件 `easemob.log` 文件在下载包的 AppData/Library/Application Support/HyphenateSDK/easemobLog 目录下。
