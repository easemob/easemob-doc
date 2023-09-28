# iOS 端 EaseCallKit 使用指南

<Toc />

## 功能概述

`EaseCallKit` 是一套基于声网音视频服务，使用环信 IM 作为信令通道的开源音视频 UI 库。UI 库提供了单人语音通话、视频通话，以及多人会议的功能接口。

使用 `EaseCallKit` 库可以快速实现常用的音视频场景，通过信令的交互确认，保证 **用户多端登录时，收到呼叫同时振铃，一端处理后，其他端自动停止**。

`EaseCallKit` 库在 Github 上进行了保存，请参见 [EaseCallKit iOS 端使用指南](https://github.com/easemob/easecallkitui-ios)。

**`EaseCallKit` 在通话过程中，使用环信 ID 加入频道，方便音视频视图中显示用户名。如果用户不使用 `EaseCallKit` 而直接调用声网 API，也可以直接使用数字 UID 加入频道。**

:::notice
本 UI 库只和移动端 3.8.0 以上版本 Demo 互通。3.8.1 的 UI 库使用声网数字 UID 加入频道，而 3.8.0 使用字符串加入频道，3.8.1 版本不与 3.8.0 互通，Demo 中 EaseCallKit 使用的 token 和 UID 均由你自己生成。若你需要使用声网对应的音视频服务，需单独在声网申请。
:::

## 跑通 Demo

`EaseCallKit` 集成在环信提供的开源 IM Demo 中，你可以通过进入 [环信 IM Demo 下载页面](https://www.easemob.com/download/im)，选择 iOS 端 Demo 下载，或直接进入 [Github 开源网站](https://github.com/easemob/chat-ios) 下载。

- 安装 SDK 与 `EaseCallKit`

Demo 源码中不涉及 SDK 和 `EaseCallKit`，你可以通过直接导入或通过 CocoaPods 安装。

如果当前系统上没有安装 CocoaPods，需参考 [CocoaPods 安装说明](https://guides.cocoapods.org/using/getting-started.html)进行安装。

使用 CocoaPods 安装需要进入 `podfile` 所在目录，然后在终端执行如下命令：

```
pod install
```

- 运行 demo

安装完成 SDK 与 `EaseCallKit` 后，在 Xcode 打开工作空间 `EaseIM.xcworkspace`，连接手机，然后就可以运行了。

## 准备条件

在集成该库前，你需要满足以下条件：

- 分别创建 [环信应用](/product/enable_and_configure_IM.html) 及 [声网应用](https://docportal.shengwang.cn/cn/video-legacy/run_demo_video_call_ios?platform=iOS#1-创建声网项目)；
- 已完成环信 IM 的基本功能，包括登录、好友、群组以及会话等的集成；
- 上线之前开通声网 token 验证时，用户需要实现自己的 [App Server](https://github.com/easemob/easemob-im-app-server/tree/master/agora-app-server)，用于生成 token。利用 App Server 生成 token 的过程参见 [声网 token](https://docportal.shengwang.cn/cn/video-call-4.x/token_server_ios_ng?platform=iOS)。

## 快速集成

使用 `EaseCallKit` 库完成音视频通话的基本流程如下：

1. 用户调用 `EaseCallKit` 库初始化接口；
2. 主叫方调用发起通话邀请接口，自动进入通话页面；
3. 被叫方自动弹出通话请求页面，在 UI 界面选择接听，进入通话；
4. 结束通话时，点击 UI 界面挂断按钮。

### 导入 EaseCallKit 库

`EaseCallKit` UI 库依赖于 `HyphenateChat`、`AgoraRtcEngine_iOS`、`Masonry` 和 `SDWebImage` 库，导入该 UI 库时需要同步导入工程，依赖库可通过 CocoaPods 导入。

**`EaseCallKit` 是动态库，在 `podfile` 中必须加入 `use_frameworks!`**。

`EaseCallKit` 库可通过手动导入，也可利用 CocoaPods 导入。

#### 使用 CocoaPods 导入 EaseCallKit

- 在 Terminal 里进入项目根目录，并运行 `pod init` 命令。项目文件夹下会生成一个 `Podfile` 文本文件。
- 打开 `Podfile` 文件，修改文件为如下内容。注意将 `AppName` 替换为你的 app 名称。

```
use_frameworks!
target 'AppName' do
    pod 'HyphenateChat'
    pod 'Masonry'
    pod 'AgoraRtcEngine_iOS'
    pod 'SDWebImage'
    pod 'EaseCallKit', '~> version'
end
```

- 在 Terminal 内运行 `pod update` 命令更新本地库版本。
- 运行 `pod install` 命令安装 `EaseCallKit` UI 库。成功安装后，Terminal 中会显示 **Pod installation complete!**，此时项目文件夹下会生成一个 `xcworkspace` 文件。
- 打开新生成的 `xcworkspace` 文件，连接手机，运行 demo。

#### 手动导入 EaseCallKit

- 将在跑通 Demo 阶段下载的 `EaseCallKit.framework` 复制到项目工程目录下；
- 打开 Xcode，选择 **工程设置** > **General** 菜单，将 `EaseCallKit.framework` 拖拽到工程下，在 `Frameworks`、`libraries` 和 `Embedded Content` 中设置 `EaseCallKit.framework` 为 `Embed & Sign`。

### 添加权限

应用需要音频设备及摄像头权限。在 `info.plist` 文件中，点击 `+` 图标，添加如下信息：

| Key                                    | Type   | Value                                   |
| :------------------------------------- | :----- | :-------------------------------------- |
| Privacy - Microphone Usage Description | String | 描述信息，如“环信需要使用您的麦克风”。  |
| Privacy - Camera Usage Description     | String | 描述信息，如“环信需要使用您的摄像头” 。 |

如果希望在后台运行，还需要添加后台运行音视频权限，在 `info.plist` 文件中，点击 `+` 图标，添加 `Required background modes`，`Type` 为 `Array`，在 `Array` 下添加元素 `App plays audio or streams audio/video using AirPlay`。

### 初始化

在环信 IM SDK 初始化完成后，同时初始化 `EaseCallKit`，初始化的同时开启回调监听，设置常用配置项。代码如下：

```objectivec
EaseCallConfig* config = [[EaseCallConfig alloc] init];
EaseCallUser* usr = [[EaseCallUser alloc] init];
usr.nickName = @"自定义昵称";
usr.headImage = [NSURL fileURLWithPath:[[NSBundle mainBundle] pathForResource:@"headImage" ofType:@"png"]];
config.users = @{@"环信 ID":usr};
config.agoraAppId=@"声网 AppID";
[[EaseCallManager sharedManager] initWithConfig:config delegate:self];
```

可设置的配置项包括以下内容：

```objectivec
@interface EaseCallConfig : NSObject
// 默认头像。  
@property (nonatomic)  NSURL*  defaultHeadImage;
// 呼叫超时时间，单位为秒。
@property (nonatomic) UInt32 callTimeOut;
// 用户信息字典，key 为环信 ID，value 为 `EaseCallUser`。
@property (nonatomic) NSMutableDictionary* users;
// 振铃文件。
@property (nonatomic) NSURL* ringFileUrl;
// 声网 appId。
@property (nonatomic) NSString* agoraAppId;
// 声网 token 验证开关，默认不开启。
@property (nonatomic) BOOL enableRTCTokenValidate
@end
```

### 发起通话邀请

`EaseCallKit` 初始化完成后，可以开始发起音视频通话。

#### 一对一音视频通话

一对一通话分为语音通话与视频通话，发起过程如下：

```objectivec
// 发起一对一通话。
// remoteUser   邀请对象的环信 ID。
// type   通话类型。`EaseCallType1v1Audio` 表示语音通话，`EaseCallType1v1Video` 表示视频通话。 
// ext    通话扩展信息，为用户信息字典。
[[EaseCallManager sharedManager] startSingleCallWithUId:remoteUser type:aType ext:nil completion:^(NSString * callId, EaseCallError * aError) {
    
}];
```

#### 多人音视频通话

你可以从群组成员列表或者好友列表中选择用户，发起多人音视频通话。具体实现可参考 Demo 中的 `ConfInviteUsersViewController`。

```objectivec
//邀请用户加入多人通话。 
// aInviteUsers   受邀用户的环信 ID 数组。
// ext   可设置扩展信息，如果从群组发起，可通过 `ext` 设置群组 ID，其他用户也可邀请该群组成员。
[[EaseCallManager sharedManager] startInviteUsers:aInviteUsers ext:@{@"groupId":aConversationId} completion:^(NSString * callId, EaseCallError * aError) {
    
}];
```

发起通话后的 UI 界面如下：

<img src="@static/images/ios/sendcall.png" width="400" />

### 收到邀请

主叫方调用邀请接口后，如果被叫方在线且并未处于通话过程中，将弹出通话页面，被叫用户可选择接听或者拒绝。通话页面如下：

<img src="@static/images/ios/recvcall.png" width="400" />

被叫振铃的同时，会触发以下回调：

```objectivec
- (void)callDidReceive:(EaseCallType)aType inviter:(NSString*_Nonnull)user ext:(NSDictionary*)aExt
  {

  }
```

### 多人通话中间发起邀请

多人通话中，当前用户可以点击通话界面右上角的邀请按钮再次向其他用户发起邀请。这种情况下，会触发 `EaseCallKitListener` 中的 `multiCallDidInvitingWithCurVC` 回调：

```objectivec
// 多人音视频邀请按钮的回调。
// vc     当前视图控制器。
// users  通话中已存在的用户。
// aExt   通话扩展信息。
- (void)multiCallDidInvitingWithCurVC:(UIViewController*_Nonnull)vc excludeUsers:(NSArray<NSString*> *_Nullable)users ext:(NSDictionary *)aExt
  {
    //若只邀请群组中的用户加入通话，发起通话时在扩展信息里添加 `groupId`。 
    NSString* groupId = nil;
    if(aExt) {
        groupId = [aExt objectForKey:@"groupId"];
    }

    ConfInviteUsersViewController * confVC = nil;
    if([groupId length] == 0) {
        confVC = [[ConfInviteUsersViewController alloc] initWithType:ConfInviteTypeUser isCreate:NO excludeUsers:users groupOrChatroomId:nil];
    }else{
        confVC = [[ConfInviteUsersViewController alloc] initWithType:ConfInviteTypeGroup isCreate:NO excludeUsers:users groupOrChatroomId:groupId];
    }
    [confVC setDoneCompletion:^(NSArray *aInviteUsers) {
        [[EaseCallManager sharedManager] startInviteUsers:aInviteUsers ext:aExt completion:nil];
    }];
    confVC.modalPresentationStyle = UIModalPresentationPopover;
    [vc presentViewController:confVC animated:NO completion:nil];
  }
  
```

通话邀请界面的实现，可以参考 Demo 中的 `ConfInviteUsersViewController` 实现。

### 当前用户成功加入频道回调

自 `EaseCallKit` 3.8.1 新增 `callDidJoinChannel` 方法，在用户加入通话后会收到回调：

```objectivec
- (void)callDidJoinChannel:(NSString*_Nonnull)aChannelName uid:(NSUInteger)aUid
  {
    //此时，可以获取当前频道中已有用户的声网 ID 与环信 ID 的映射表，并将映射表设置到 `EaseCallKit`，同时也可以更新用户的头像和昵称。
    //[self _fetchUserMapsFromServer:aChannelName];
    [[EaseCallManager sharedManager] setUsers:users channelName:channelName];
  }
  
```

### 对方成功加入频道回调

自 `EaseCallKit` 3.8.1 新增 `remoteUserDidJoinChannel` 方法，在对方用户加入通话后会收到回调。

```objectivec
-(void)remoteUserDidJoinChannel:( NSString*_Nonnull)aChannelName uid:(NSInteger)aUid username:(NSString*_Nullable)aUserName
{
    // 此时，可以获取当前频道中已有用户的声网 RTC UID 与环信 ID 的映射表，并将映射表设置到 `EaseCallKit`，同时也可以更新用户的头像和昵称。
    //[self _fetchUserMapsFromServer:aChannelName];
    [[EaseCallManager sharedManager] setUsers:users channelName:channelName];
}
```

### 通话结束

在一对一音视频通话中，若其中一方挂断，双方的通话会自动结束，而多人音视频通话中需要主动挂断才能结束通话。通话结束后，会触发 `callDidEnd` 回调：

```objectivec
// 通话结束回调。
// aChannelName  通话使用的声网频道名称，用户可以根据频道名称，到声网 Console 的水晶球查询通话质量。
// aTm    通话时长，单位为秒。
// aCallType  通话类型。
- (void)callDidEnd:(NSString*)aChannelName reason:(EaseCallEndReason)aReason time:(int)aTm type:(EaseCallType)aCallType
  {
    NSString* msg = @"";
    switch (aReason) {
        case EaseCallEndReasonHandleOnOtherDevice:
            msg = @"已在其他设备处理。";
            break;
        case EaseCallEndReasonBusy:
            msg = @"对方忙。";
            break;
        case EaseCallEndReasonRefuse:
            msg = @"对方拒绝接听。";
            break;
        case EaseCallEndReasonCancel:
            msg = @"您已取消通话。";
            break;
        case EaseCallEndReasonRemoteCancel:
            msg = @"对方取消通话。";
            break;
        case EaseCallEndReasonRemoteNoResponse:
            msg = @"对方无响应。";
            break;
        case EaseCallEndReasonNoResponse:
            msg = @"您未接听。";
            break;
        case EaseCallEndReasonHangup:
            msg = [NSString stringWithFormat:@"通话已结束，通话时长：%d秒",aTm];
            break;
        default:
            break;
    }
    if([msg length] > 0)
       [self showHint:msg];
  }
```

## 进阶功能

### 通话异常回调

通话过程中如果有异常或者错误发生，会触发 `callDidOccurError` 回调：

异常包括业务逻辑异常、音视频异常以及 Easemob IM 异常。

```objectivec
// 通话异常回调。
// aError 为异常信息，包括了 Easemob IM 异常，RTC 异常，业务异常三种情况。
- (void)callDidOccurError:(EaseCallError *)aError
  {

  }
```

`EaseCallError` 异常包括 IM 异常，RTC 异常以及业务逻辑异常。

```objectivec
@interface EaseCallError : NSObject
// 异常类型，包括 Easemob IM 异常、RTC 异常和业务逻辑异常。   
@property (nonatomic) EaseCallErrorType aErrorType;
// 异常代号。
@property (nonatomic) NSInteger errCode;
// 异常描述。
@property (nonatomic) NSString* errDescription;
```

### 配置修改

`EaseCallKit` 库初始化之后，可调用该方法修改配置：

```objectivec
// 以下为修改铃声过程。 
EaseCallConfig* config = [[EaseCallManager sharedManager] getEaseCallConfig];
NSString* path = [[NSBundle mainBundle] pathForResource:@"huahai128" ofType:@"mp3"];
config.ringFileUrl = [NSURL fileURLWithPath:path];
```

### 头像昵称修改

自 `EaseCallKit` 3.8.1 开始，新增了修改头像昵称的接口，用户加入频道后可修改自己和通话中其他人的头像昵称，修改方法如下：

```objectivec
EaseCallUser* user = [EaseCallUser userWithNickName:info.nickName image:[NSURL URLWithString:info.avatarUrl]];
[[[EaseCallManager sharedManager] getEaseCallConfig] setUser:username info:user];
```

## 参考

### 获取声网 token

用户加入音视频通话时，如果需要进行声网 token 鉴权，需要先开启 token 验证开关，开启过程如下：

```objectivec
EaseCallUser* callUser = [[EaseCallUser alloc] init];
config.enableRTCTokenValidate = YES;// 开启 RTC Token 验证，默认不开启。  
[[EaseCallManager sharedManager] initWithConfig:config delegate:self];
```

获取 token 的过程由用户自己完成，开启后在通话时，会收到 `callDidRequestRTCTokenForAppId`回调，用户需要在回调中，实现从用户自己的 App Server 中获取 token（App Server 的实现参见 [生成声网 Token](https://docportal.shengwang.cn/cn/video-call-4.x/token_server_ios_ng)，然后调用 `setRTCToken:channelName:` 接口。

```objectivec
- (void)callDidRequestRTCTokenForAppId:(NSString * _Nonnull)aAppId
      channelName:(NSString * _Nonnull)aChannelName
          account:(NSString * _Nonnull)aUserAccount
  {
  [[EaseCallManager sharedManager] setRTCToken:@"自己的RTC Token"channelName:aChannelName];
  }

// 自 EaseCallKit 3.8.1 版本开始，`callDidRequestRTCTokenForAppId` 方法中添加了 `uid` 参数，你可以使用数字 uid 加入声网频道。
- (void)callDidRequestRTCTokenForAppId:(NSString *)aAppId channelName:(NSString *)aChannelName account:(NSString *)aUserAccount uid:(NSInteger)aAgoraUid
  {
    [[EaseCallManager sharedManager] setRTCToken:@"自己的RTC Token" channelName:aChannelName uid:自己的声网uid];
  }
```

### 离线推送

为保证被叫用户 App 在后台运行或离线时也能收到通话请求，用户需开启离线推送。关于如何开启离线推送，请参见 [iOS SDK 集成](push.html)。开启离线推送后，用户在离线情况下收到呼叫请求时，其手机通知页面会弹出一条通知消息，用户点击该消息可唤醒 App 并进入振铃页面。 关于离线推送场景方案，请参见 [iOS 端设置推送](push.html)。

## API 列表

从 API 的角度看，`EaseCallKit` 库的主要包括管理模块 `EaseCallManager` 和回调模块 `EaseCallDelegate`。

管理模块 `EaseCallManager` 的 API 列表如下：

| 方法                                       | 说明                                                         |
| :----------------------------------------- | :----------------------------------------------------------- |
| initWithConfig:delegate                    | 初始化方法                                                   |
| startSingleCallWithUId:type:ext:completion | 发起一对一通话。                                             |
| startInviteUsers:type:ext:completion:      | 邀请用户加入多人通话。                                       |
| getEaseCallConfig                          | 获取 `EaseCallKit` 相关配置。                                |
| setRTCToken:channelName:                   | 设置声网 Token。该方法自 `EaseCallKit` 3.8.1 版本添加。      |
| setRTCToken:channelName:uid:               | 设置声网 Token。该方法自 `EaseCallKit` 3.8.1 版本添加。      |
| setUsers:channelName:                      | 设置环信 ID 与声网 uid 的映射表。该方法自 `EaseCallKit` 3.8.1 版本添加。 |

回调模块 `EaseCallDelegate` 的 API 列表如下：

| 方法                                                    | 说明                                                         |
| :------------------------------------------------------ | :----------------------------------------------------------- |
| callDidEnd:reason:time:type:                            | 通话结束时触发该事件。                                       |
| multiCallDidInvitingWithCurVC:excludeUsers:ext:         | 多人通话中点击邀请按钮触发该事件。                           |
| callDidReceive:inviter:ext:                             | 振铃时触发该事件。                                           |
| callDidRequestRTCTokenForAppId:channelName:account:     | 获取声网 token 回调。该方法自 `EaseCallKit` 3.8.1 版本添加。 |
| callDidRequestRTCTokenForAppId:channelName:account:uid: | 获取声网 token 回调。该方法自 `EaseCallKit` 3.8.1 版本添加。 |
| callDidOccurError:                                      | 通话异常时触发该事件。                                       |
| remoteUserDidJoinChannel:uid:                           | 对方加入频道时触发。该方法自 `EaseCallKit` 3.8.1 版本添加。  |
| callDidJoinChannel:uid:                                 | 当前用户加入频道时触发。该方法自 `EaseCallKit` 3.8.1 版本添加。 |