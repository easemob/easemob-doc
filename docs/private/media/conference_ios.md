# iOS 多人音视频通话

## 跑通Demo



### 1. 示例代码

- [下载视频会议Demo代码 ](https://github.com/easemob/videocall-ios)

或进入环信[客户端下载](common_clientsdk.html#场景demo及源码下载)页面，选择下载iOS端视频会议 Demo。

### 2. 前提条件

运行Demo前需要具备以下条件：

- mac操作系统10.11以上
- 安装Xcode 11以上
- iPhone设备iPhone 6以上，安装系统iOS 9.0以上

### 3. 运行Demo

#### 3.1 Demo代码目录简介

目录 VideoCallDemo/EMiOSVideoCallDemo 中的 Demo 关键类介绍

![img](/images/privitization/conference_ios_demo.png)

多人音视频Demo主要包含3个target，SharedDesktop和SharedDesktopSetupUI用于实现共享桌面功能，EMiOSVideoCallDemo是会议target，实现类如下：

- RoomJoinViewController 加入房间页面
- ConferenceViewController 视频展示页面
- AccountSettingViewController 个人设置页面
- RoomSettingViewController 房间设置页面
- SpeakerListViewController 主播列表页面
- KickSpeakerViewController 选人下麦页面
- EMStreamView 视频小窗口类
- EMDemoOption 会议管理类，存储会议的设置和单例属性
- ChangeRoleView 管理员处理上麦申请页面
- ProfileVidwController 个人资料页面
- UpdateNicknameViewController 修改昵称页面
- SelectHeadImageViewController 修改头像页面

#### 3.2 工程设置

Demo中的源码不包含SDK，SDK可以从cocospods安装，或者从官网下载，然后拷贝到当前工程下

- 使用cocoapods安装SDK

如果当前系统上没有安装cocoapods，需要用户自己安装，安装过程参考 [Getting Started with CocoaPods 安装说明](https://guides.cocoapods.org/using/getting-started.html#getting-started)。

修改VideoCallDemo/EMiOSVideoCallDemo目录下的Podfile文件，添加如下：

```
pod 'Hyphenate', '~> 3.7.1'
```

Terminal进入该目录，运行命令：

```
pod install
```

成功安装后，Terminal 中会显示 Pod installation complete!，此时项目文件夹下会生成podfile目录，Pod已加入工作空间中

- 手动导入SDK

下载 iOS SDK + Demo，目录中包含HyphenateFullSDK目录，该目录下的Hyphenate.framework即为SDK，将SDK拷贝到VideoCallDemo/EMiOSVideoCallDemo/目录下。

Terminal进入VideoCallDemo/EMiOSVideoCallDemo/目录，运行命令：

```
pod install
```

打开EMiOSVideoCallDemo.xcworkspace工作空间，进入工程TARGETS > Project Name > General > Frameworks, Libraries, and Embedded Content 菜单，将Hyphenate.framework拖拽进来完成添加。<br>

为保证动态库的签名和 app 的签名一致，需要将动态库的 Embed 属性设置为 Embed & Sign。

#### 3.3 运行项目

连接iPhone手机，选择目标设备，点击运行

## 快速集成

多人音视频会议主要涉及到的环信SDK头文件如下:

```
// 多人会议部分，包含会议id，会议类型等
EMCallConference.h

// 数据流部分，包含数据流id，上传数据流的成员名称等
EMCallStream.h

// 多人实时通话会议方法调用部分，比如添加代理，移除代理，创建并加入会议，上传数据流，订阅其他人的数据流等
IEMConferenceManager.h

// 多人实时通话会议的协议回调方法部分，比如监听有人加入会议，有新的数据流上传回调方法等
EMConferenceManagerDelegate.h
```

创建音视频通信的过程简单来说，可以分为以下几步：

```
  1. 初始化 SDK，设置监听代理
  2. create: 创建会议
  3. join: 加入会议
  4. pub: 发布音视频数据流
  5. sub: 订阅并播放音视频数据流
  6. leave: 离开会议
```

### 1. 环信后台注册appkey

在开始集成前，你需要注册环信开发者账号并在后台创建应用，参见[创建应用](../im/uc_configure.html#创建应用) 。

### 2. 创建项目

参考以下步骤创建一个iOS 应用项目，如果已有项目，可以直接进行下一步集成。创建过程如下：

- 打开 Xcode 并点击 Create a new Xcode project。
- 选择项目类型为 Single View App，并点击 Next。
- 输入项目信息，如项目名称、开发团队信息、组织名称和语言，语言为Object-C，并点击 Next。
- 选择项目存储路径，并点击 Create。
- 进入工程设置页面的Signing & Capaabilities菜单，选择 Automatically manage signing，并在弹出菜单中点击 Enable Automatic。

### 3. 导入SDK到工程

集成SDK有两种方法，分别是使用cocoapods和手动导入SDK

#### 使用cocoapods导入SDK

开始前确保你已安装 Cocoapods。

- 在 Terminal 里进入项目根目录，并运行 pod init 命令。项目文件夹下会生成一个 Podfile 文本文件。
- 打开 Podfile 文件，修改文件为如下内容。注意将 AppName 替换为你的 Target 名称，并将 version 替换为你需集成的 SDK 版本，如3.7.1。

```
target 'AppName' do
    pod 'Hyphenate', '~> version'
end
```

- 在 Terminal 内运行 pod update 命令更新本地库版本。
- 运行 pod install 命令安装Hyphenate SDK。成功安装后，Terminal 中会显示 Pod installation complete!，此时项目文件夹下会生成一个 xcworkspace 文件。
- 打开新生成的 xcworkspace 文件。

#### 手动导入SDK

- 将在跑通Demo阶段下载的HyphenateFullSDK下的Hyphenate.framework拷贝到项目工程目录下
- 打开工程设置/Genaral菜单下，将Hyphenate.framework拖拽到Frameworks，libraries,and Embedded Content下，并设置为Embed and Signed

工程中引入SDK，需要引用头文件Hyphenate.h

```
#import <Hyphenate/Hyphenate.h>
```

### 4. 添加权限

应用需要音频设备及摄像头权限，在 info.plist 文件中，点击 + 图标，添加如下信息。

| Key                                    | Type   | Value                                |
| :------------------------------------- | :----- | :----------------------------------- |
| Privacy - Microphone Usage Description | String | 描述信息，如“环信需要使用您的麦克风” |
| Privacy - Camera Usage Description     | String | 描述信息，如“环信需要使用您的摄像头” |

如果希望在后台运行，还需要添加后台运行音视频权限，在info.plist文件中，点击 + 图标，添加Required background modes ,Type为Array，在Array下添加元素App plays audio or streams audio/video using AirPlay。

### 5. 创建UI

video视图参考Demo中的EMStreamView，会议控制界面展示参考Demo中的ConferenceViewController。

### 6. 初始化SDK

初始化HyhpenateSDK使用initializeSDKWithOptions:接口，需要设置自己的appkey，调用如下：

```
// 这里替换成自己的appkey
EMOptions *retOpt = [EMOptions optionsWithAppkey:@"easemob-demo#chatdemoui"];
// 这里打开日志输出
retOpt.enableConsoleLog = YES;
[[EMClient sharedClient] initializeSDKWithOptions:retOpt];
```

### 7. 环信ID注册、登录

在进行音视频通话前，需要首先登录IM账户，登录过程参见[账号登录](http://doc.easemob.com/document/android/overview.html#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95)。<br>
若您还没有IM账户，需要先注册账户，注册过程参见[账号注册](http://doc.easemob.com/document/android/overview.html#%E6%B3%A8%E5%86%8C%E7%94%A8%E6%88%B7)。<br>

### 8. 音视频功能初始化

账号登录成功后，需要进行音视频通话功能的初始化，设置监听类。

```
[[EMClient sharedClient].conferenceManager addDelegate:self delegateQueue:nil];
```

### 9. 加入会议

用户可以根据房间名和密码，快速加入一个会议，若该会议不存在，服务器将会自动创建。

加入房间使用的接口在IEMConferenceManager.h中，用户加入时可以选择使用的角色为观众还是主播，主播可以发布自己的音视频，观众只能订阅音视频。

加入房间时，可以选择房间的会议类型，是否开启服务端录制，是否混音以及是否支持小程序。调用方法如下：

```
//Objective-C
    RoomConfig* roomConfig = [[RoomConfig alloc] init];
    roomConfig.confrType = EMConferenceTypeCommunication;
    roomConfig.nickName = @"昵称";
    //是否开启服务端录制
    roomConfig.isRecord = YES;
    //录制时是否合并数据流
    roomConfig.isMerge = YES;
    [[[EMClient sharedClient] conferenceManager] joinRoom:roomName password:pswd role:role roomConfig:roomConfig completion:^(EMCallConference *aCall, EMError *aError) {
    self.conference = aCall;
    }];
```

加入房间成功后，返回的回调中有EMCallConference会议实例，需要本地保存下来。

其中RoomConfig定义如下：

```
//Objective-C
@interface RoomConfig:NSObject
/*!
*  \~chinese
*  会议类型
*/
@property (nonatomic) EMConferenceType confrType;
/*!
*  \~chinese
*  录制时是否合并数据流
*/
@property (nonatomic) BOOL isMerge;
/*!
*  \~chinese
*  是否开启服务端录制
*/
@property (nonatomic) BOOL isRecord;
/*!
*  \~chinese
*  是否支持微信小程序
*/
@property (nonatomic) BOOL isSupportWechatMiniProgram;
/*!
*  \~chinese
*  会议中使用的昵称
*/
@property (nonatomic) NSString* nickName;
/*!
*  \~chinese
*  成员扩展信息
*/
@property (nonatomic) NSString* ext;
/*!
*  \~chinese
*  会议最大主播数
*/
@property (nonatomic) NSInteger maxTalkerCount ;
/*!
*  \~chinese
*  会议最大视频上传数
*/
@property (nonatomic) NSInteger maxVideoCount;
/*!
*  \~chinese
*  会议最大观众数
*/
@property (nonatomic) NSInteger maxAudienceCount;
/*!
*  \~chinese
*  cdn 直播推流配置
*/
@property (nonatomic) LiveConfig* liveConfig;
@end
```

注：RoomConfig中的ext表示会议成员的扩展信息，一般用于存储头像等信息，与pub流的接口中的ext信息是不同的。

加入会议后，会议中的其他人员会收到回调通知，如下：

```
- (void)memberDidJoin:(EMCallConference *)aConference
               member:(EMCallMember *)aMember
{
    // aMember中包含加入用户的信息，如ID，昵称等
}
```

### 10. 发布流

成员加入会议后，可以在会议中发布音视频流，发流过程如下：

```
EMStreamParam *pubConfig = [[EMStreamParam alloc] init];
EMCallLocalView *localView = [[EMCallLocalView alloc] init];
//显示本地视频的页面
pubConfig.localView = localView;
//上传本地摄像头的数据流
 [[EMClient sharedClient].conferenceManager publishConference:[EMDemoOption sharedOptions].conference streamParam:pubConfig completion:^(NSString *aPubId, EMError *aError) {
// 若发流成功，aError应为nil，否则为失败信息。
// 发流成功时，aPubId为本地流的pubId，此时应把localView添加到界面上,pubId需要在本地保存,用于操作音视频流
}];
streamParam参数提供了更丰富的发流选项

当成员发流成功后，会议中的其他成员会收到有流加入的回调通知，通知如下：
<code>
//有新的数据流上传
- (void)streamDidUpdate:(EMCallConference *)aConference
              addStream:(EMCallStream *)aStream
{
    // aStream中包含了流信息，此时应该订阅流
}
```

### 11. 订阅流

成员收到有数据流加入的通知后，可以订阅该流，订阅后可以接收到流内的音视频，订阅过程如下：

```
// remoteView用于在UI上展示对方的视频
    EMCallRemoteView *remoteView = [[EMCallRemoteView alloc] init];
    //订阅其他人的数据流，，即订阅当前会议上麦主播的数据流
    [[EMClient sharedClient].conferenceManager subscribeConference:[EMDemoOption sharedOptions].conference streamId:aStream.streamId remoteVideoView:remoteView completion:^(EMError *aError) {
        // 若订阅成功，aError应为nil，否则为失败信息。
        // 订阅成功后，应把remoteView展示到UI上
    }];
```

### 12. 退出会议

用户退出会议的过程如下：

```
[[EMClient sharedClient].conferenceManager leaveConference:[EMDemoOption sharedOptions].conference completion:nil];
```

用户退出会议后，会议中的其他成员会收到以下回调通知：

```
- (void)memberDidLeave:(EMCallConference *)aConference
                member:(EMCallMember *)aMember
{
   // aMember为退出的成员信息
}
```

## 进阶功能

### 会议管理

#### **取日志**

SDK会写入日志文件到本地。日志文件路径如下：沙箱Documents/HyphenateSDK/easemoblog，以真机为例，获取过程如下：

- 打开Xcode连接设备，前往Xcode –> Window –> Devices and Simulators
- 进入Devices选项卡，在左侧选择目标设备，界面如下：

[![img](https://docs-im.easemob.com/_media/rtc/one2one/fetchlogfile.png?w=400&tok=6c005b)](https://docs-im.easemob.com/_detail/rtc/one2one/fetchlogfile.png?id=rtc%3Aconference%3Aios)

日志文件easemob.log文件在下载包内容的AppData/Library/Application Support/HyphenateSDK/easemobLog目录下。

#### **创建会议并加入**

除根据房间名和房间密码加入会议的api外，SDK还提供了直接创建并加入会议的api，接口如下：

```
//Objective-C
- (void)createAndJoinConference
{
    __weak typeof(self) weakself = self;
    void (^block)(EMCallConference *aCall, NSString *aPassword, EMError *aError) = ^(EMCallConference *aCall, NSString *aPassword, EMError *aError) {
        if (aError) {
            //错误提示
            return ;
        }
            
        //更新页面显示
    };
        
    EMConferenceType type = EMConferenceTypeCommunication;
    // record 与 mergeStream、isSupportWechatMiniProgram 根据自己场景需求设置
    [[EMClient sharedClient].conferenceManager createAndJoinConferenceWithType:type password:@"password" record:NO mergeStream:NO isSupportWechatMiniProgram:NO completion:block];
}
```

调用该接口后，将拥有一个会议实例Conference，同时成员将成为该Conference的管理员。

用户创建会议时可以设置参数指定是否支持小程序音视频，是否需要在服务器端录制，录制时是否合并流、是否支持微信小程序。

创建会议成功以后，默认超时时间为三分钟，超过三分钟没有人加入，会议会自动销毁；另外当会议中所有人离开2分钟后，会议也会被销毁。

如果想在创建会议时指定会议中的最大视频数、最大主播数，或开启cdn推流，可以使用带RoomCofnig参数的创建会议接口，此时roomconfig中指定的会议类型无效。接口如下：

```
/*!
 *  \~chinese
 *  创建并加入会议
 *
 *  @param aType             会议类型
 *  @param aPassword         会议密码
 *  @param aConfrConfig   会议属性配置
 *  @param aCompletionBlock  完成的回调
 */
- (void)createAndJoinConferenceWithType:(EMConferenceType)aType
                               password:(NSString *)aPassword
                            confrConfig:(RoomConfig*)aConfrConfig
                             completion:(void (^)(EMCallConference *aCall, NSString *aPassword, EMError *aError))aCompletionBlock;
```

#### **邀请成员加入会议**

SDK没有提供邀请接口，可以自己实现，比如使用环信IM通过发消息邀请，比如通过发邮件邀请等等。

至于需要发送哪些邀请信息，可以参照SDK中的join接口，可以发送Conference的confrId和password，如果是用joinRoom接口创建的会议，也可以发送房间名和房间密码。

比如用环信IM发消息邀请

```
//Objective-C
- (void)inviteUser:(NSString *)aUserName
{
    NSString *confrId = self.conference.confId;
    NSString *password = self.password;
    EMConferenceType type = self.type;
    NSString *currentUser = [EMClient sharedClient].currentUsername;
    EMTextMessageBody *textBody = [[EMTextMessageBody alloc] initWithText:[[NSString alloc] initWithFormat:@"%@ 邀请你加入会议: %@", currentUser, confrId]];
    EMMessage *message = [[EMMessage alloc] initWithConversationID:aUserName from:currentUser to:aUserName body:textBody ext:@{@"em_conference_op":@"invite", @"em_conference_id":confrId, @"em_conference_password":password, @"em_conference_type":@(type)}];
    message.chatType = EMChatTypeChat;
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
}
```
:::notice
  使用环信IM邀请多个人时，建议使用群组消息。如果使用单聊发消息请注意每条消息中间的时间间隔，以防触发环信的垃圾消息防御机制。
  
  被邀请人解析出邀请消息中带的confrId和password，调用SDK的join接口加入会议，成为会议成员且角色是Speaker。
:::
```
//Objective-C
- (void)joinConferenceWithConfrId:(NSString *)aConfrId password:(NSString *)aPassword
{
    __weak typeof(self) weakself = self;
    void (^block)(EMCallConference *aCall, EMError *aError) = ^(EMCallConference *aCall, EMError *aError) {
        if (aError) {
            //错误提示
            return ;
        }
            
        //更新页面显示
    };
        
    [[EMClient sharedClient].conferenceManager joinConferenceWithConfId:aConfrId password:aPassword completion:block];
}
```

用户B成功加入会议后，会议中其他成员会收到回调[EMConferenceManagerDelegate memberDidJoin:member:]

#### **管理员销毁会议**

会议中的管理员可以主动销毁会议，销毁会议过程如下：

```
[[EMClient sharedClient].conferenceManager destroyConferenceWithId:self.conference.confId completion:nil];
```

会议销毁后，会议中的其他成员将收到会议结束的回调通知。

```
- (void)conferenceDidEnd:(EMCallConference *)aConference
                  reason:(EMCallEndReason)aReason
                   error:(EMError *)aError
{
}
```

#### **设置会议人数限制**

使用createAndJoinConference接口创建会议或者第一个使用joinRoom接口加入的成员为会议创建者，会议创建者在创建会议时可以设置会议中的最大视频数、主播数、观众数、共享桌面数的上限。<br>
默认最大视频数12，最大主播数100，最大观众数600，最大共享桌面数2。创建会议时使用RoomConfig参数指定人数限制，过程如下：

```
RoomConfig* roomConfig = [[RoomConfig alloc] init];
    roomConfig.maxVideoCount = 6;
    roomConfig.maxTalkerCount = 9;
    roomConfig.maxAudienceCount = 30;
    roomConfig.maxPubDesktopCount = 1;
    [[[EMClient sharedClient] conferenceManager] joinRoom:roomName password:pswd role:role roomConfig:roomConfig completion:block];
```

若加入会议时，超过最大主播数上限，加入会议返回失败，error为EMErrorCallSpeakerFull

若发视频流时，超过最大视频数上限，将收到如下回调通知：

```
- (void)streamPubDidFailed:(EMCallConference *)aConference error:(EMError*)aError
{
}
```

若发共享桌面流时，超过最大数上限，将收到如下回调通知：

```
- (void)DesktopStreamDidPubFailed:(EMCallConference *)aConference error:(EMError*)aError
{
}
```

#### **获取会议信息**

在会议进行中，可以通过getConference 方法来查询会议信息，从而可以拿到主播列表，观众人数等信息。

```
/*!
 *  \~chinese
 *  获取会议信息
 *
 *  @param aConfId           会议ID(EMCallConference.confId)
 *  @param aPassword         会议密码
 *  @param aCompletionBlock  完成的回调
 */
- (void)getConference:(NSString *)aConfId
             password:(NSString *)aPassword
           completion:(void (^)(EMCallConference *aCall, EMError *aError))aCompletionBlock;
```

#### **会议属性**

会议属性是会议的状态信息，由一组（key，value）组成。会议中的所有角色成员（管理员、主播、观众）都可以设置/删除会议频道属性，设置的会议属性会通知给会议中的所有人。

设置会议属性的api方法如下：

```
/**
 * \~chinese
 * 设置频道属性,该会议中的所有人(包括自己)都会收到
 * {@link EMConferenceManagerDelegate#conferenceAttributeUpdated:attributeAction:attributeKey:}回调.
 * 该方法需要在加入会议后调用.
 *
 * @param attrKey
 * @param attrValue
 * @param aCompletionBlock
 */
- (void)setConferenceAttribute:(NSString *)attrKey
                         value:(NSString *)attrValue
                    completion:(void(^)(EMError *aError))aCompletionBlock;
```

删除会议属性的api方法如下：

```
/**
 * \~chinese
 * 删除频道属性,该会议中的所有人(包括自己)都会收到
 * {@link EMConferenceManagerDelegate#conferenceAttributeUpdated:attributeAction:attributeKey:}回调.
 * 该方法需要在加入会议后调用.
 *
 * @param aKey
 * @param aCompletionBlock
 */
- (void)deleteAttributeWithKey:(NSString *)aKey
                    completion:(void(^)(EMError *aError))aCompletionBlock;
```

当会议属性信息改变时，会议中的成员会收到以下通知。

```
- (void)conferenceAttributeUpdated:(EMCallConference *)aConference
                        attributes:(NSArray <EMConferenceAttribute *>*)attrs
```

每一个EMConferenceAttribute包括了会议属性中的key，value，以及本次修改的action，action包括ADD、UPDATE、DELETE。

#### **cdn合流推流**

多人音视频支持将会议中的音视频流合并成一个流，推送到第三方的cdn直播服务器。整个合流推流过程包括开启cdn推流，更新推流布局，停止推流。

##### **开启cdn推流**

会议的创建者在创建会议时使用RoomConfig的接口，可以决定是否开启cdn推流，推流配置LiveConfig是RoomConfig的一个参数，可设置cdn推流的相关信息。开启过程如下：

```
LiveConfig* liveconfig = [[LiveConfig alloc] init];
CDNCanvas* canvas = [[CDNCanvas alloc] init];
canvas.fps = 18;
canvas.kbps = 900;
canvas.codec = @"H264";
canvas.bgclr = 0x0000ff;
canvas.width = [EMDemoOption sharedOptions].liveWidth;
canvas.height = [EMDemoOption sharedOptions].liveHeight;
liveconfig.canvas = canvas;
liveconfig.cdnUrl = [EMDemoOption sharedOptions].cdnUrl;
liveconfig.layoutStyle = CUSTOM;
liveconfig.record = YES; //是否录制推流到cdn的音视频
roomConfig.liveConfig = liveconfig;
```

当canvas设置的width、height为0时，cdn推流为**纯音频推流**。

推流成功后，可以在EMConference对象中查看liveId，如果只有一路推流，可直接使用EMConference对象的liveId；如果存在多路推流，可访问EMConference对象的liveCfgs对象，liveCfgs存储了所有的推流信息。

LiveConfig可设置的参数如下：

```
/*!
*  \~chinese
*  cdn 画布设置，创建会议时使用
*/
@interface CDNCanvas : NSObject
 /*! \~chinese 画布宽度  */
@property (nonatomic) NSInteger width;
/*! \~chinese 画布高度  */
@property (nonatomic) NSInteger height;
/*! \~chinese 画布的背景色，格式为 RGB 定义下的 Hex 值，不要带 # 号，如 0xFFB6C1 表示浅粉色。默认0x000000，黑色。
*/
@property (nonatomic) NSInteger bgclr;
/*! \~chinese 推流帧率，可设置范围10-30 */
@property (nonatomic) NSInteger fps;
/*! \~chinese 推流码率，单位kbps，width和height较大时，码率需要提高，可设置范围1-5000  */
@property (nonatomic) NSInteger kbps;
/*! \~chinese 推流编码格式，目前只支持"H264" */
@property (nonatomic) NSString* codec;

@end

/*!
*  \~chinese
*  cdn推流使用的画布类型
*/
typedef NS_ENUM(NSInteger, LayoutStyle) {
    CUSTOM,
    DEMO,
    GRID
};
/*!
*  \~chinese
*  cdn推流设置
*/
@interface LiveConfig : NSObject

/*! \~chinese 推流url地址*/
@property (nonatomic,strong) NSString *cdnUrl;

/*! \~chinese 推流画布的配置*/
@property (nonatomic) CDNCanvas* canvas;

/*! \~chinese 推流方式，GRID或者CUSTOM，GRID将由服务器设置位置信息，CUSTOM将由用户自定义流的位置信息*/
@property (nonatomic) LayoutStyle layoutStyle;

/*! \~chinese 是否开启自定义录制*/
@property (nonatomic) BOOL record;

/*! \~chinese 音频录制参数*/
@property (nonatomic) AudioConfig* audioCfg;

@end
```

##### **更新布局**

当用户调用更新布局接口后，cdn推流方式将强制变成CUSTOM模式，所有流的位置信息都由用户自己定义。 更新布局的接口如下：

```
/*!
*  \~chinese
*  修改会议的cdn推流位置
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aReagionList 媒体流的位置信息
*  @param aLiveId           推流Id
*  @param aCompletionBlock 回调函数
*/
- (void)updateConference:(EMCallConference*)aCall
                  liveId:(NSString*)aLiveId
              setRegions:(NSArray<LiveRegion*>*)aReagionList
              completion:(void(^)(EMError *aError))aCompletionBlock;
```

LiveRegion的结构如下：

```
/*!
*  \~chinese
*  cdn推流的每一路流的模式
*/
typedef NS_ENUM(NSInteger, LiveRegionStyle) {
    /*! \~chinese FIt模式 */
    LiveRegionStyleFit,
    /*! \~chinese FIll模式 */
    LiveRegionStyleFill
};

/*!
*  \~chinese
*  cdn推流的每一路流的区域位置信息
*/
@interface LiveRegion : NSObject

/*! \~chinese 流ID */
@property (nonatomic) NSString* streamId;

/*! \~chinese 流的左上角在x轴坐标  */
@property (nonatomic) NSInteger x;

/*! \~chinese 流的左上角在y轴坐标  */
@property (nonatomic) NSInteger y;

/*! \~chinese 流的宽度  */
@property (nonatomic) NSInteger w;

/*! \~chinese 流的高度 */
@property (nonatomic) NSInteger h;

/*! \~chinese 流的图层顺序，越小越在底层，从1开始 */
@property (nonatomic) NSInteger z;

/*! \~chinese 流的显示模式，Fit或Fill */
@property (nonatomic) LiveRegionStyle style;

@end
```

使用方法如下：

```
NSMutableArray<LiveRegion*>* regionsList = [NSMutableArray array];
LiveRegion* region = [[LiveRegion alloc] init];
region.streamId = _streamId;
region.style = LiveRegionStyleFill;
region.x = 80;
region.y = 60;
region.w = 320;
region.h = 240;
region.z = 9;
[regionsList addObject:region];
[[[EMClient sharedClient] conferenceManager] updateConference:[EMDemoOption sharedOptions].conference liveId:aLiveId setRegions:regionsList completion:^(EMError *aError) {
    }];
```

##### **多路推流**

多人音视频支持加入会议后，增加一路推流，只有管理员权限可进行次操作。增加一路推流的api方法如下：

```
/*!
*  \~chinese
*  添加一路推流
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aLiveConfig 推流配置
*  @param aCompletionBlock 回调函数
*/
- (void)addConferenceLive:(EMCallConference*)aCall
                  LiveCfg:(LiveConfig*)aLiveConfig
               completion:(void(^)(EMError *aError))aCompletionBlock;
```

##### **停止推流**

管理员可以控制停止某一路推流，停止推流接口如下：

```
/*!
*  \~chinese
*  删除一路推流
*/
- (void)deleteConferenceLive:(EMCallConference*)aCall
                      liveId:(NSString*)aLiveId
                  completion:(void(^)(EMError *aError))aCompletionBlock;
```

#### **云端录制**

多人音视频会议支持云端录制功能，包括服务器默认录制以及自定义布局录制两种

##### **服务器默认录制**

服务器默认录制为九宫格布局，在会议创建时，由创建者指定是否开启，开启方法为创建会议时指定isRecord为YES，如下：

```
//Objective-C
    RoomConfig* roomConfig = [[RoomConfig alloc] init];
    roomConfig.isMerge = YES;
    roomConfig.isRecord = YES;
    [[[EMClient sharedClient] conferenceManager] joinRoom:roomName password:pswd role:role roomConfig:roomConfig completion:^(EMCallConference *aCall, EMError *aError) {
    self.conference = aCall;
    }];
```

##### **自定义布局录制**

在推流的LiveConfig设置里，设record为YES，可以开启自定义录制，开启后会把推流到cdn的音视频按照推流布局录制下来。如果推流时未开启，也可以在推流后进行开启/停止自定义录制布局操作。开启/停止自定义录制布局的api如下：

```
/*!
*  \~chinese
*  启动/停止自定义录制
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aLiveId 推流/录制Id
*  @param aEnabled 操作，启动/停止
*  @param aCompletionBlock 回调函数
*/
- (void)enableRecordLiveStream:(EMCallConference*)aCall
                        liveId:(NSString*)aLiveId
                       enabled:(BOOL)aEnabled
                    completion:(void(^)(EMError *aError))aCompletionBlock;
```

#### **设置昵称，头像解决方案**

多人音视频通话提供设置昵称的接口，在加入会议时设置；不直接提供头像设置接口，但提供头像设置方案，在加入会议时将头像url设置到RoomConfig的ext中，过程如下：

```
//Objective-C
    RoomConfig* roomConfig = [[RoomConfig alloc] init];
    roomConfig.nickName = @"昵称";
    NSMutableDictionary* extDic = [NSMutableDictionary dictionary];
    NSString* headImage = [EMDemoOption sharedOptions].headImage;
    [extDic setObject:headImage forKey:@"headImage"];
    NSError *jsonError = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:extDic options:NSJSONWritingPrettyPrinted error:&jsonError];
    NSString *jsonStr = @"";
    if (jsonData && !jsonError) {
        jsonStr = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    }
    roomConfig.ext = jsonStr;
    [[[EMClient sharedClient] conferenceManager] joinRoom:roomName password:pswd role:role roomConfig:roomConfig completion:^(EMCallConference *aCall, EMError *aError) {
    self.conference = aCall;
    }];
```

#### 私有部署

私有部署设置方法参见[私有云sdk集成配置](../im/uc_iOS_private.md)

### 音视频管理

#### **设置通话参数**

通话之前，可以设置音频通话的最大音频码率，最小视频码率、最大视频码率、分辨率和是否清晰度优先，设置方法如下：

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.maxAudioKBps = 32;
options.maxVideoKBps = 3000;
options.minVideoKBps = 500;
options.maxVideoFrameRate = 20;
options.videoResolution = EMCallVideoResolution352_288;
options.isClarityFirst = YES;//若设为清晰度优先，将在弱网环境下保证视频的分辨率
```

#### **停止发布流**

成员A可以调用unpublish接口取消自己已经发布的数据流，操作成功后，会议中的其他成员会收到回调[EMConferenceManagerDelegate streamDidUpdate:removeStream:] ，将对应的数据流信息移除。

```
//Objective-C
- (void)unpubStream
{
    [[EMClient sharedClient].conferenceManager unpublishConference:self.conference 
                                                          streamId:self.pubStreamId completion:^(EMError *aError) 
                                                          {
                                                              //code
                                                          }];
}
```

#### **停止订阅流**

成员B如果不想再看成员A的音视频，可以调用SDK接口unsubscribe。

```
//Objective-C
- (void)unsubStream
{
    __weak typeof(self) weakself = self;
    [[EMClient sharedClient].conferenceManager unsubscribeConference:self.conference streamId:self.pubStreamId completion:^(EMError *aError) {
        //code
    }];
}
```

#### **操作自己订阅的流**

对于订阅成功的流，可以有以下操作：

```
/**
 * \~chinese
 * mute远端音频
 *
 * @param aStreamId        要操作的Steam id
 * @param isMute            是否静音
 */
- (void)muteRemoteAudio:(NSString *)aStreamId mute:(BOOL)isMute;

/**
 * \~chinese
 * mute远端视频
 *
 * @param aStreamId        要操作的Steam id
 * @param isMute            是否关闭
 */
- (void)muteRemoteVideo:(NSString *)aStreamId mute:(BOOL)isMute;
```

#### **通话中音视频控制**

成员发布了自己的音视频流后，在会议过程中，可以进行以下操作：

- 切换前后摄像头，调用如下

```
[[[EMClient sharedClient] conferenceManager] updateConferenceWithSwitchCamera:self.conference];
```

- 开关静音

```
[[[EMClient sharedClient] conferenceManager] updateConference:self.conference isMute:YES];
```

- 开关视频

```
[[[EMClient sharedClient] conferenceManager] updateConference:self.conference enableVideo:YES];
```

当成员对自己的数据流做开关静音/视频时，会议中的其他成员会收到回调[EMConferenceManagerDelegate streamDidUpdate:stream:]

```
//Objective-C
- (void)streamDidUpdate:(EMCallConference *)aConference stream:(EMCallStream *)aStream
{
    if ([aConference.callId isEqualToString:self.conference.callId] && aStream != nil) {
        //判断本地缓存的EMCallStream实例与aStream有哪些属性不同，并做相应更新
    }
}
```

#### **音视频首帧回调**

当成员发布流成功，发送第一帧音视频数据时，成员收到以下通知：

```
/*!
 * \~chinese
 * 发送第一帧音视频数据时，收到此回调
 *
 * @param aConference     会议
 * @param aType 流类型，音频或视频
 * @param streamId 流ID
*/
- (void)streamDidFirstFrameSended:(EMCallConference*)aConference type:(EMMediaType)aType streamId:(NSString*)streamId;
```

当成员订阅流成功，收到第一帧音视频数据时，成员会收到以下通知：

```
/*!
 * \~chinese
 * 接收流第一帧音视频数据时，收到此回调
 *
 * @param aConference     会议
 * @param aType 流类型，音频或视频
 * @param streamId 流ID
*/
- (void)streamDidFirstFrameReceived:(EMCallConference*)aConference type:(EMMediaType)aType streamId:(NSString*)streamId;
```

#### **音视频无数据回调**

当会议中的成员A因断网或异常退出，而无音视频数据上传时，订阅该流的其他成员会收到下面的回调通知。

```
/*!
 * \~chinese
 * 下行音频流无数据时，收到此回调
 *
 * @param aConference     会议
 * @param aType 流类型，音频或视频
 * @param streamId 流ID
*/
- (void)streamStateUpdated:(EMCallConference*)aConference type:(EMMediaType)aType state:(EMMediaState)state streamId:(NSString*)streamId;
```

该功能需要会议中开启质量统计（必须在创建或者加入会议成功之后，在调用此方法）

```
[[EMClient sharedClient].conferenceManager enableStatistics:YES];
```

#### **弱网检测**

SDK提供多人音视频会议的网络连接状态检测，当本地网络断开、重连、质量差时收到以下回调。该功能需要会议中开启质量统计。

```
- (void)conferenceNetworkDidChange:(EMCallConference *)aSession
                            status:(EMCallNetworkStatus)aStatus
                            {
                            }
```

#### **通话质量**

使用[conferenceManager enableStatistics:YES]开启视频质量统计后，用户会周期性收到视频质量数据的回调，回调函数定义如下：

```
/*!
 * \~chinese
 * 当前会议的媒体流质量报告回调
 *
 * @param aConference     会议
 * @param streamId 流ID
 * @param aReport   会议的质量参数
*/
- (void)conferenceDidUpdate:(EMCallConference*)aConference streamId:(NSString*)streamId statReport:(EMRTCStatsReport *)aReport;
```

[查看EMRTCStatsReport详细信息](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_r_t_c_stats_report.html)

#### **监听谁在说话**

多人音视频会议可以实时监听谁在说话，该功能需要开启，启动/停止控制如下：

```
// 开始监听说话者，参数为间隔时间
 [[[EMClient shareClient] conferenceManager] startMonitorSpeaker:(EMCallConference *)aCall
                                                    timeInterval:(long long)aTimeMillisecond
                                                      completion:(void (^)(EMError *aError))aCompletionBlock];
 
 // 停止监听说话者
 [[[EMClient shareClient] conferenceManager] stopMonitorSpeaker:(EMCallConference *)aCall];
```

有人说话时，会议成员会收到如下回调通知

```
- (void)conferenceSpeakerDidChange:(EMCallConference *)aConference
                 speakingStreamIds:(NSArray *)aStreamIds
{
}
```

#### **mute远端音视频流**

会议成员可以对自己订阅的远端音视频流进行mute操作，操作后自己不接收远端的音视频流，不影响会议中的其他人。操作接口如下：

```
/**
 * \~chinese
 * mute远端音频
 *
 * @param aStreamId        要操作的Steam id
 * @param isMute            是否静音
 */
- (void)muteRemoteAudio:(NSString *)aStreamId mute:(BOOL)isMute;

/**
 * \~chinese
 * mute远端视频
 *
 * @param aStreamId        要操作的Steam id
 * @param isMute            是否显示
 */
- (void)muteRemoteVideo:(NSString *)aStreamId mute:(BOOL)isMute;
```

#### **变声/自定义音频**

用户可以通过自己采集音频数据，使用外部输入音频数据的接口进行通话，从而实现变声等音频数据加工功能。

##### **配置属性**

用户使用自定义音频数据时，需要配置外部输入音频数据的开关，以及音频采样率，通道数(当前通道数只支持1)，配置方法如下：

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.enableCustomAudioData = YES;
options.audioCustomSamples = 48000;
options.audioCustomChannels = 1;
//这里调用加入会议接口
```

##### **输入音频数据**

音频数据采集可参考1v1音视频通话Demo中的AudioRecord类实现，音频数据的输入必须在加入会议成功的回调后开始，否则会导致网络阻塞，影响通话质量。

```
[[[EMClient sharedClient] conferenceManager] joinRoom:roomName password:pswd role:role roomConfig:roomConfig completion:^(EMCallConference *aCall, EMError *aError) {
    self.conference = aCall;
    EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
    if(options.enableCustomAudioData){
        [self audioRecorder].channels = options.audioCustomChannels;
        [self audioRecorder].samples = options.audioCustomSamples;
        [[self audioRecorder] startAudioDataRecord];
    }
    }];
```

音频采集过程开始后，在音频数据的回调里调用外部输入音频数据接口

```
[[[EMClient sharedClient] conferenceManager] inputCustomAudioData:data];
```

会话挂断时，停止音频采集及输入过程。

```
//多人会议挂断触发事件
- (void)hangupAction
{
      EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
      if(options.enableCustomAudioData) {
           [[self audioRecorder] stopAudioDataRecord];
      }
}
```

#### **美颜/自定义视频**

如果用户需要自己采集特定的数据或者对于数据需要先进行一些处理，如滤镜、美颜等，可以使用SDK的外部输入视频数据的方法进行。

##### **配置属性**

使用外部输入视频数据接口前，需要先进行配置，配置参数为EMStreamParam中的enableCustomizeVideoData，设为YES可开启外部输入视频功能，开启后需要在publishConference的成功回调中开始视频数据采集。

```
__block NSString *publishId = @"";
EMStreamParam *streamParam = [[EMStreamParam alloc] init];
streamParam.enableCustomizeVideoData = YES; // 开启自定义视频流

[[EMClient sharedClient].conferenceManager publishConference:self.conference
                                                 streamParam:streamParam
                                                  completion:^(NSString *aPubStreamId, EMError*aError) {
       if(!aError) {
            publishId = aPubStreamId;
            // **TODO：这里开启视频数据采集过程**
            [self startCapture]
       } 
}];
```

在视频数据采集的回调中调用外部输入视频数据接口inputVideoSampleBuffer。

```
- (void)captureOutput:(AVCaptureOutput *)output didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection
{
    if ([self.delegate respondsToSelector:@selector(videoCaptureDataCallback:)])
    {
        // 输入视频流
        [[EMClient sharedClient].conferenceManager inputVideoSampleBuffer:sampleBuffer
                                                         rotation:orientation
                                                       conference:self.conference
                                                publishedStreamId:publishId
                                                       completion:^(EMError *aError) {
            }];
    }
}
```

在关闭视频传输或会议结束的回调中，停止视频数据的采集。

```
//多人会议挂断触发事件
- (void)hangupAction
{
      [self stopCapture];
}
```

#### **共享桌面**

使用sdk共享桌面，只能共享指定的view。

```
EMStreamParam *streamParam = [[EMStreamParam alloc] init];
streamParam.type = EMStreamTypeDesktop;
streamParam.desktopView = self.view;
[[EMClient sharedClient].conferenceManager publishConference:self.conference
                                                 streamParam:streamParam
                                                  completion:^(NSString *aPubStreamId, EMError *aError) {
            
}];
```

因为上面方法的实现原理是不停的截取指定view的快照，并转换成流发送，这种方式的效率并不高，ios10以上用户建议使用系统的replaykit + 自定义输入流的方式实现共享桌面，具体replaykit使用可以参考[官方文档](https://developer.apple.com/documentation/replaykit?language=objc)

（需要集成3.6.3或以上版本的sdk）

特别指出，如果需要在共享桌面时输入自己的流，需要修改上一步中的设置：

```
EMStreamParam *streamParam = [[EMStreamParam alloc] init];
streamParam.type = EMStreamTypeDesktop;
streamParam.desktopView = nil; // 使用自定义输入流，此处需要传nil
streamParam.videoResolution = EMCallVideoResolution_Custom;//为了防止共享桌面被裁剪，需要使用自定义分辨率
CGFloat screenX = [UIScreen mainScreen].bounds.size.width;
CGFloat screenY = [UIScreen mainScreen].bounds.size.height;
streamParam.videoWidth = screenY*[UIScreen mainScreen].scale;
streamParam.videoHeight = screenX*[UIScreen mainScreen].scale;

[[EMClient sharedClient].conferenceManager publishConference:self.conference
                                                 streamParam:streamParam
                                                  completion:^(NSString *aPubStreamId, EMError *aError) {
   if(!aError) {
      publishId = aPubStreamId;
   } 
}];

// 输入视频流
[[EMClient sharedClient].conferenceManager inputVideoSampleBuffer:sampleBuffer
                                                         rotation:orientation
                                                       conference:self.conference
                                                publishedStreamId:publishId
                                                       completion:^(EMError *aError) {
            
}];
```

#### **水印**

视频通话时，可以添加图片作为水印，添加时使用[IEMConferenceManager addVideoWatermark]接口，需要指定水印图片的NSUrl，添加位置参见[EMWaterMarkOption](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_water_mark_option.html)。

清除水印使用[IEMConferenceManager clearVideoWatermark]接口。

显示remoteVideo需要使用EMCallViewScaleModeAspectFit模式，否则对方的水印设在边缘位置可能显示不出来。

```
/*!
*  \~chinese
*  开启水印功能
*
*  @param option 水印配置项，包括图片URL，marginX,marginY以及起始点
*/
- (void)addVideoWatermark:(EMWaterMarkOption*)option;
/*!
*  \~chinese
*  取消水印功能
*
*/
- (void)clearVideoWatermark;
// 添加水印
NSString * imagePath = [[NSBundle mainBundle] pathForResource:@"watermark" ofType:@"png"];
EMWaterMarkOption* option = [[EMWaterMarkOption alloc] init];
option.marginX = 60;
option.startPoint = LEFTTOP;
option.marginY = 40;
option.enable = YES;
option.url = [NSURL fileURLWithPath:imagePath];
[[EMClient sharedClient].conferenceManager addVideoWatermark:option];

// 清除水印
[[EMClient sharedClient].conferenceManager clearVideoWatermark];
```

### 角色管理

#### **观众申请主播**

会议中的观众角色可以向管理员发申请成为主播，管理员可以选择同意或者拒绝。观众申请主播的接口需要管理员的memId，先通过获取会议属性接口获取到管理员的memName，然后根据memName以及成员加入的回调中获取到的EMCallMember，获取到memId。接口如下：

```
/*!
*  \~chinese
*  观众申请连麦成为主播，观众角色调用
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aAdminId 管理员的memId
*  @param aCompletionBlock 回调函数
*/
- (void)requestTobeSpeaker:(EMCallConference *)aCall adminId:(NSString *)aAdminId completion:(void (^)(EMError *aError))aCompletionBlock;
```

观众发出申请后，管理员将会收到以下回调：

```
/*!
 * \~chinese
 * 收到观众申请主播的请求，只有管理员会触发
 *
 * @param aConference     会议
 * @param aMemId   申请人memId
 * @param aNickName 申请人昵称
 * @param aMemName 申请人memName
*/
- (void)conferenceReqSpeaker:(EMCallConference*)aConference memId:(NSString*)aMemId nickName:(NSString*)aNickName memName:(NSString*)aMemName;
```

在回调中，管理员可以选择同意或者拒绝，如果同意，需要调用接口changeMemberRoleWithConfId授权，然后回复申请人；如果拒绝，则直接调用回复接口。回复接口如下：

```
/*!
*  \~chinese
*  管理员同意/拒绝观众的上麦申请，管理员调用
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aMemId 上麦申请的观众的memId
*  @param aResult 操作结果，0为同意，1为拒绝
*  @param aCompletionBlock 回调函数
*/
- (void)responseReqSpeaker:(EMCallConference *)aCall
                     memId:(NSString *)aMemId
                    result:(NSInteger)aResult
                completion:(void (^)(EMError *aError))aCompletionBlock;
```

#### **主播申请管理员**

会议中的主播角色可以向管理员发申请成为管理员，管理员可以选择同意或者拒绝，成为管理员后，各管理员之间的权限是相同的。主播申请管理员的接口需要管理员的memId，先通过获取会议属性接口获取到管理员的memName，然后根据memName以及成员加入的回调中获取到的EMCallMember，获取到管理员memId，调用接口changeMemberRoleWithConfId授权，然后回复申请人，接口如下：

```
/*!
*  \~chinese
*  主播申请成为管理员，主播角色调用
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aAdminId 管理员的memId
*  @param aCompletionBlock 回调函数
*/
- (void)requestTobeAdmin:(EMCallConference *)aCall adminId:(NSString *)aAdminId completion:(void (^)(EMError *aError))aCompletionBlock;
```

主播发出申请后，管理员将会收到以下回调：

```
/*!
 * \~chinese
 * 收到主播申请管理员的请求，只有管理员会触发
 *
 * @param aConference     会议
 * @param aMemId   申请人memId
 * @param aNickName 申请人昵称
 * @param aMemName 申请人memName
*/
- (void)conferenceReqAdmin:(EMCallConference*)aConference memId:(NSString*)aMemId nickName:(NSString*)aNickName memName:(NSString*)aMemName;
```

在回调中，管理员可以选择同意或者拒绝，如果同意，需要调用改变用户权限的接口changeMemberRoleWithConfId，然后调用回复接口；如果拒绝，则直接调用回复接口。回复接口如下：

```
/*!
*  \~chinese
*  管理员同意/拒绝主播的申请管理员请求，管理员调用
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aMemId 申请管理员的主播的memId
*  @param aResult 操作结果，0为同意，1为拒绝
*  @param aCompletionBlock 回调函数
 */
- (void)responseReqAdmin:(EMCallConference *)aCall memId:(NSString *)aMemId result:(NSInteger)aResult completion:(void (^)(EMError *aError))aCompletionBlock;
```

管理员对其他观众、主播的角色进行升级、降级处理的接口如下：

aMemberName 是appkey拼接环信id，例如：easemob-demo#chatdemoui_lulu1

**管理员/主播也可以直接使用该接口对自己进行降级**

```
/*!
*  \~chinese
*  改变成员角色，需要管理员权限
* 用户角色: Admin > Talker > Audience
* 当角色升级时,用户需要给管理员发送申请,管理通过该接口改变用户接口.
* 当角色降级时,用户直接调用该接口即可.
*
*  @param aConfId           会议ID(EMCallConference.confId)
*  @param aMemberName        成员在会议中的memName
*  @param aRole             成员角色
*  @param aCompletionBlock  完成的回调
*/
- (void)changeMemberRoleWithConfId:(NSString *)aConfId
                        memberName:(NSString *)aMemberName
                              role:(EMConferenceRole)toRole
                        completion:(void (^)(EMError *aError))aCompletionBlock;
```

#### **管理员踢人**

管理员可以强制会议成员离开会议，使用接口：

```
/*!
 *  \~chinese
 *  踢人，需要管理员权限
 *
 *  @param aConfId           会议ID(EMCallConference.confId)
 *  @param aMemberNameList   成员名列表
 *  @param aCompletionBlock  完成的回调
 */
- (void)kickMemberWithConfId:(NSString *)aConfId
                 memberNames:(NSArray<NSString *> *)aMemberNameList
                  completion:(void (^)(EMError *aError))aCompletionBlock;
```

#### 全体静音/指定成员静音

该系列接口调用需要加入会议后，先获取一下会议信息，调用getConference接口。

##### **全体静音**

管理员可以对会议进行全体静音/解除全体静音设置，设置后，会议中的主播都将处于静音状态，新加入的主播也将自动处于静音状态。只有管理员可以调用此接口。 接口API如下：

```
/**
* \~chinese
* 开启/停止全体静音,只有管理员可调用此接口
*
* @param enable 是否启用全体静音
* @param completion 回调
*/
- (void)muteAll:(BOOL)mute
     completion:(void(^)(EMError *aError))aCompletionBlock;
```

管理员调用此接口后，会议中的主播将收到全体静音状态的回调，回调函数如下：

```
/*!
 * \~chinese
 * 收到全体静音/解除全体静音的回调
 *
 * @param aConference     会议
 * @param aMuteAll   是否全体静音
*/
- (void)conferenceDidUpdated:(EMCallConference *)aConference
                  muteAll:(BOOL)aMuteAll;
```

##### **指定成员静音**

管理员可以对会议中的指定成员进行静音/解除静音设置，被指定成员可以是主播也可以是管理员。设置后，被指定成员将静音/解除静音。只有管理员可以调用此接口。 接口API如下：

```
/*!
*  \~chinese
*  将指定成员静音/解除静音，管理员调用
*
*  @param aCall             会议实例（自己创建的无效）
*  @param aMemId 指定成员的memId
*  @param aMute 操作，YES为静音，NO为解除静音
*  @param aCompletionBlock 回调函数
*/
- (void)setMuteMember:(EMCallConference *)aCall
                memId:(NSString *)aMemId
                 mute:(BOOL)aMute
           completion:(void (^)(EMError *aError))aCompletionBlock;
```

管理员调用此接口后，被指定的成员将收到静音状态的回调，回调函数如下：

```
/*!
 * \~chinese
 * 收到静音/解除静音的回调
 *
 * @param aConference     会议
 * @param aMute   是否静音
*/
- (void)conferenceDidUpdated:(EMCallConference*)aConference
                        mute:(BOOL)aMute;
```

#### **本身角色变更回调**

当成员本身的角色发生变化时，收到以下回调：

```
/*!
 *  \~chinese
 *  自己的角色发生变化
 *
 *  @param aConference       会议实例
 */
- (void)roleDidChanged:(EMCallConference *)aConference;
```

#### **管理员变更回调**

当会议中的普通成员成为管理员，或管理员降级为普通成员时，会议中的其他成员将收到管理员变更的回调。管理员变更回调分为管理员新增和管理员移除，回调接口如下：

```
/*!
 *  \~chinese
 *  管理员新增
 *
 *  @param aConference       会议实例
 *  @param adminmemid         新的管理员memid
 */
- (void)adminDidChanged:(EMCallConference *)aConference
               newAdmin:(NSString*)adminmemid;

/*!
 *  \~chinese
 *  管理员放弃
 *
 *  @param aConference       会议实例
 *  @param adminmemid         放弃管理员的memid
 */
- (void)adminDidChanged:(EMCallConference *)aConference
            removeAdmin:(NSString*)adminmemid;
```

## 客户端API

多人音视频通话的API包括以下接口：

- EMCallOption 多人音视频通话配置类
- EMConferenceManager 是多人音视频通话的主要管理类，提供了加入会议、退出、发流、订阅等接口
- EMConferenceManagerDelegate 是多人音视频通话的监听回调类，多人音视频通话相关的回调
- EMCallConference 多人音视频通话的会议实例接口

### EMCallOption

| 属性                                                         | 描述                              |
| :----------------------------------------------------------- | :-------------------------------- |
| [maxAudioKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#aea45547ce623a0fd5d53a36f00334520) | 最大音频码率                      |
| [maxVideoKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a4130c8f7488d6d6f58c3783dc63be5fd) | 最大视频码率                      |
| [minVideoKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#ae070e260597c913634a21c03aa31826a) | 最小视频码率                      |
| [maxVideoFrameRate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a45f020f84b4513fdc0cb3f8a123fe678) | 最大视频帧率                      |
| [videoResolution](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#af49ac4f01b9bca538fbce40e1de5f866) | 视频分辨率                        |
| [enableReportQuality](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#af2129acdd0d3d73a583e8d37dfc087e2) | 是否监听通话质量                  |
| [enableCustomAudioData](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#ae927cb60d05c59b389517648941e7ec8) | 是否使用自定义音频数据            |
| [audioCustomSamples](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a76482a8e2702e1905c036142e41c8a6d) | 自定义音频数据的采样率，默认48000 |
| [enableCustomizeVideoData](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a89f38b15e05ed5d6636af5fde628d114) | 是否使用自定义视频数据            |
| [isClarityFirst](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a38497058ab86b80f156ba3b362100b4e) | 是否清晰度优先                    |

###  EMConferenceManager

| 方法                                                         | 描述                                            |
| :----------------------------------------------------------- | :---------------------------------------------- |
| [addDelegate:delegateQueue:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a2b985523160a8a9f47346e1065667dfb) | 添加回调代理                                    |
| [removeDelegate:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#acc88916806c943608d41c307012d2113) | 移除回调代理                                    |
| [setAppkey:username:token:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a16c1d9b53642b97e07e6ae1c55925519) | 设置应用Appkey, 环信ID, 环信ID对应的Token       |
| [getConference:password:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a53da60e7a584697191b52734c4517669) | 获取会议信息                                    |
| [createAndJoinConferenceWithType:password:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a838273c88e5264cbf0508de0d0e3aeef) | 创建并加入会议                                  |
| [createAndJoinConferenceWithType:password:confrConfig:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a0f5820f9c560ca0a6ccfee963c423185) | 创建并加入会议                                  |
| [joinConferenceWithConfId:password:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#acead28618cffee8a9068897bbb238df8) | 加入已有会议                                    |
| [joinConferenceWithTicket:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a1a81bcafde9fa0d9a826a80dee15f981) | 加入已有会议                                    |
| [joinRoom:password:role:roomConfig:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a9dc56f6f8c505322baff4074964640d8) | 加入房间                                        |
| [publishConference:streamParam:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a45cb75e64fd0abd04d71ae7cbaa39668) | 上传音视频数据流                                |
| [unpublishConference:streamId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ab80d817ea9953a75d59284bece48e7ac) | 取消上传本地音视频数据流                        |
| [subscribeConference:streamId:remoteVideoView:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a5bc905bb6427f586c18ea6a3b87fb58a) | 订阅其他人的数据流                              |
| [unsubscribeConference:streamId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#af95a48dc945a95062e868db32615b1d0) | 取消订阅的数据流                                |
| [changeMemberRoleWithConfId:memberName:role:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ac6df4fd1e2b16c98e4f515d45aa08d21) | 改变成员角色，需要管理员权限                    |
| [kickMemberWithConfId:memberNames:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a094785f9b5ee245226399234bd72fe58) | 踢人，需要管理员权限                            |
| [destroyConferenceWithId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ac3c7426a3b6dc1b50bad419d2f722ee8) | 销毁会议，需要管理员权限                        |
| [leaveConference:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ae54239e73e21df83450961a8263a14f7) | 离开会议                                        |
| [startMonitorSpeaker:timeInterval:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a28726fcdc8ce28006a30d713f40227c0) | 开始监听说话者                                  |
| [stopMonitorSpeaker:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#aa67291522b649278e770c7bb1b3ee9b3) | 结束监听说话者                                  |
| [updateConference:liveId:setRegions:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a00098d155bc5b6b8a0941f2b7b140b3f) | 修改会议的cdn推流布局                           |
| [addConferenceLive:LiveCfg:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ad36907936af8fcf74f64cd311d6456c7) | 添加一路推流                                    |
| [enableRecordLiveStream:liveId:enabled:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a391e86342e05c90345c6f0594008c368) | 启动/停止自定义录制                             |
| [deleteConferenceLive:liveId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ad879b9caafabcfcbc271e5e23937805a) | 删除一路推流                                    |
| [requestTobeSpeaker:adminId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a94e5010c1349d40fddde33b7cc489274) | 观众申请连麦成为主播                            |
| [requestTobeAdmin:adminId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#af2e99d266d5d3f67490903b17818b17c) | 主播申请成为管理员，                            |
| [responseReqSpeaker:memId:result:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a097c52f9ea833b9ac289290247c25860) | 管理员同意/拒绝观众的上麦申请，管理员调用       |
| [responseReqAdmin:memId:result:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a34ff57a1a78c507d5118249e4863b8ff) | 管理员同意/拒绝主播的申请管理员请求，管理员调用 |
| [setMuteMember:memId: mute:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a6432c2f2a68760b1cad2dabb6e9cba6d) | 将指定成员静音/解除静音，管理员调用             |
| [updateConferenceWithSwitchCamera:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a28bd7490cb8e238a07a5aec62d164cea) | 切换前后摄像头                                  |
| [updateConference:isMute:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#abc3d1658875a99bdd1f5f1158a74e789) | 设置是否静音                                    |
| [updateConference:enableVideo:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a478c1c8b08758a55fdea520d6772ae9e) | 设置视频是否可用                                |
| [updateConference:maxVideoKbps:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ab57a72f199fa779b7b3158712e2d0a0a) | 更新视频最大码率                                |
| [inputVideoSampleBuffer:rotation:conference:publishedStreamId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#af906e2f6de9ca0d9005bf6c46c9d46e8) | 输入自定义本地视频数据                          |
| [inputVideoPixelBuffer:sampleBufferTime:rotation:conference:publishedStreamId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a544a757e0f2a16c9b265243c784f1fd4) | 输入自定义本地视频数据                          |
| [setConferenceAttribute:value:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#ae98d762cb6aed35de22da40779455fcb) | 设置会议属性，                                  |
| [deleteAttributeWithKey:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a226dbe5816201a32fa3850dd1bb3c991) | 删除频道属性                                    |
| [startAudioMixing: loop:sendMix:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#aa7e7d1a088f746f98b796d94b3eb631d) | 开启本地伴音功能                                |
| [stopAudioMixing](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a703c15925f723cc3c4ec59f347226a91) | 关闭本地混音功能                                |
| [adjustAudioMixingVolume:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a9b9a168a7e160ff08b5ccf13d2b8ab2f) | 设置伴奏音量                                    |
| [muteRemoteAudio: mute:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a28f9297ad2411c6aa9bdbb291bb8df26) | mute远端音频                                    |
| [muteRemoteVideo: mute:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a870a36303635529c953194b9d240521b) | mute远端视频                                    |
| [enableStatistics:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#aa57d7c7aaec58f84fb0f81b38f36a2e4) | 启用统计                                        |
| [muteAll:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a0a7340e4fe935143ba0ff529858ad295) | 全体静音                                        |
| [inputCustomAudioData:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a2fb9faf9d767ed2e58315c1db354df37) | 输入自定义外部音频数据                          |
| [addVideoWatermark:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a64ed13e19b65e3c8fb06113a96da37c5) | 开启水印功能                                    |
| [clearVideoWatermark](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_conference_manager-p.html#a950faf99db0d40e2a89c62fd8113f34d) | 取消水印功能                                    |

###  EMConferenceManagerDelegate

| 回调事件                                                     | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [memberDidJoin:member:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a35ae6bcf830548162cc9c7e6f6df0cd8) | 有人加入会议                                                 |
| [memberDidLeave:member:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a2349384a054912620858346dff81eb41) | 有人离开会议                                                 |
| [roleDidChanged:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ada8c07dac796d492a5165b28b50fb02c) | 自己的角色发生变化                                           |
| [adminDidChanged:newAdmin:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a0532f12f9e7ae6cf5f7837793062f4ea) | 管理员新增                                                   |
| [adminDidChanged:removeAdmin:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a56cc91df21df41aad12e33940bff987c) | 管理员放弃                                                   |
| [streamPubDidFailed:error:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a99ce878eb647a0ae04b8de3829e41f9b) | 本地pub流失败                                                |
| [DesktopStreamDidPubFailed:error:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a3d7f3ca91389d95c6fe29f15d3d41fbb) | 发布共享桌面流失败                                           |
| [streamUpdateDidFailed:error:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a0ac987ff2ecb9e34dc786f1da50466df) | 本地update流失败,视频超限                                    |
| [streamDidUpdate:addStream:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#aaec86cf13eaa8930fa5261c1f3848785) | 有新的数据流上传                                             |
| [streamDidUpdate:stream:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#adee2f6109508e383000d5e99e33b9bde) | 数据流有更新（是否静音，视频是否可用）                       |
| [streamDidUpdate:removeStream:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a4a92350f846d00e913c48a3286e9da77) | 有数据流移除                                                 |
| [conferenceDidEnd:reason:error:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a9e35574e2e6fcedcc5cf3d4f0f9a26e6) | 会议已经结束                                                 |
| [streamStartTransmitting:streamId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a37025ed1fda0ff26798c31aabbcf7105) | 数据流已经开始传输数据                                       |
| [conferenceDidUpdated:muteAll:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a2db2fd8d67522325ecb8412479842ccd) | 收到全体静音/解除全体静音的回调                              |
| [conferenceSpeakerDidChange:speakingStreamIds:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a0917065a18ca3ce9433d6677288830c3) | 用户A用户B在同一个会议中，用户A开始说话时，用户B会收到该回调 |
| [conferenceAttributeUpdated:attributes:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a0917065a18ca3ce9433d6677288830c3) | 会议属性变更                                                 |
| [conferenceReqSpeaker:memId:nickName:memName:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#afca1af08d628fd0be0ddd1bed1bf9138) | 收到观众申请主播的请求，只有管理员会触发                     |
| [conferenceReqAdmin:memId:nickName:memName:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ad90e5d598c1b8cb57a02cd6b81fc929e) | 收到主播申请管理员的请求，只有管理员会触发                   |
| [conferenceDidUpdated: mute:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a2b09dd5dbb6144cc561027378bc3f1e7) | 收到静音/解除静音的回调                                      |
| [conferenceReqSpeakerRefused:adminId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ae598e6c668121780573ce2402be3d745) | 收到申请主播请求被拒绝的回调                                 |
| [conferenceReqAdminRefused:adminId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#aa285cef35bc14db40ef17be9245798ed) | 收到申请管理员请求被拒绝的回调                               |
| [conferenceDidUpdated:liveCfg:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#acccb25d9f4eef388781be85cfeefb5ff) | 会议开启cdn推流或自定义录制，收到LiveCfg的回调，只有管理员能收到 |
| [streamIdDidUpdate:rtcId:streamId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#adde6567323a5ffaf249841da585174b8) | 收到本地流streamId的回调，发布流成功后收到此回调             |
| [streamStateUpdated:type:state:streamId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#aff906c9db5f6be3685a44e5c83d0ca0e) | 下行音频流无数据时，收到此回调                               |
| [streamDidFirstFrameSended:type:streamId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ab7ce7a7c76c5dca0918c8f8b5875b5e9) | 发送第一帧音视频数据时，收到此回调                           |
| [streamDidFirstFrameReceived:type:streamId:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a1879f50eea95cdabbf0e265bc1a03fef) | 接收流第一帧音视频数据时，收到此回调                         |
| [confrenceDidUpdated:state:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#ac03c8bd548fd6ae0623eb0b6f99f8b80) | 会议状态改变时，收到此回调                                   |
| [onferenceDidUpdate:streamId:statReport:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_conference_manager_delegate-p.html#a8940c01890169f6c5a68f8d6787264e9) | 当前会议的媒体流质量报告回调                                 |

###  EMCallConference

参见http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_conference.html