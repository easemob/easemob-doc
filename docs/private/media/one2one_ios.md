# iOS集成1对1通话

## 跑通Demo

### 1. 示例代码

- [下载 iOS SDK + Demo 代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/downloads/iOS_IM_SDK_V3.7.4.7.zip)

或进入环信[客户端下载](common_clientsdk.html#音视频sdk下载)页面，选择iOS SDK + Demo下载

### 2. 前提条件

运行Demo前你需要具备以下条件

- mac操作系统10.11以上
- 安装Xcode 11以上
- iPhone设备iPhone 6以上，安装系统iOS 9.0以上

### 3. 运行Demo

#### 3.1 Demo代码目录简介

目录 EaseIM —>Class 中的 Demo 目录介绍

![img](@static/images/privitization/ios_demo.png)

- Account：主要是 demo 的注册，登录
- AppDelegate：主要是 demo 中初始化环信SDK，注册推送等
- Chat：demo 的聊天功能页面
- Contact：demo 的好友功能页面
- Conversation：demo 的会话列表功能页面
- EMIMHelper：demo 的单例类，包含全局监听接收消息，好友，群组，聊天室等相关事件的回调，从而进行对应的处理
- Group：demo 的群组功能页面
- Helper：demo 的功能性文件，全局通用的配置
- Home：demo 的根控制器页面
- Settings：demo 的功能设置页面

#### 3.2 工程设置

进入iOS Demo目录，打开EMiOSDemo.xcworkspace ，进入工程设置的Signing & Capaabilities菜单，修改签名Team和bundleId为自己的团队开发。

#### 3.3 运行

连接iPhone手机，选择目标设备，点击运行

## 快速集成

本章节介绍如何使用HyhpenateSDK 快速实现1v1音视频通话

### 1. 环信后台注册appkey

在开始集成前，你需要注册环信开发者账号并在后台创建应用，参见[创建应用](../im/uc_configure.html#创建应用) 。

### 2. 创建项目

参考以下步骤创建一个iOS 应用项目，如果已有项目，可以直接进行下一步集成。创建过程如下：

- 打开 Xcode 并点击 Create a new Xcode project。
- 选择项目类型为 Single View App，并点击 Next。
- 输入项目信息，如项目名称、开发团队信息、组织名称和语言，语言为Object-C，并点击 Next。
- 选择项目存储路径，并点击 Create。
- 进入工程设置页面的Signing & Capaabilities菜单，选择 Automatically manage signing，并在弹出菜单中点击 Enable Automatic

### 3. 导入SDK到工程

集成SDK有两种方法，分别是使用cocoapods和手动导入SDK

#### 使用cocoapods导入SDK

开始前确保你已安装 Cocoapods。

- 在 Terminal 里进入项目根目录，并运行 pod init 命令。项目文件夹下会生成一个 Podfile 文本文件。
- 打开 Podfile 文件，修改文件为如下内容。注意将 AppName 替换为你的 Target 名称，并将 version 替换为你需集成的 SDK 版本，如3.7.0。

```
target 'AppName' do
    pod 'Hyphenate', '~> version'
end
```

- 在 Terminal 内运行 pod update 命令更新本地库版本。
- 运行 pod install 命令安装 Agora SDK。成功安装后，Terminal 中会显示 Pod installation complete!，此时项目文件夹下会生成一个 xcworkspace 文件。
- 打开新生成的 xcworkspace 文件。

#### 手动导入SDK

- 将在跑通Demo阶段下载的HyphenateFullSDK下的Hyphenate.framework拷贝到项目工程目录下
- 打开工程设置/Genaral菜单下，将Hyphenate.framework拖拽到Frameworks，libraries,and Embedded Content下，并设置为Embed and Signed

工程中引入SDK，需要引用头文件Hyphenate.h

```
#import <Hyphenate/Hyphenate.h>
```

### 4. 添加权限

应用需要音频设备及摄像头权限，在 info.plist 文件中，点击 + 图标，添加如下信息

| Key                                    | Type   | Value                                |
| :------------------------------------- | :----- | :----------------------------------- |
| Privacy - Microphone Usage Description | String | 描述信息，如“环信需要使用您的麦克风” |
| Privacy - Camera Usage Description     | String | 描述信息，如“环信需要使用您的摄像头” |

如果希望在后台运行，还需要添加后台运行音视频权限，在info.plist文件中，点击 + 图标，添加Required background modes，Type为Array，在Array下添加元素App plays audio or streams audio/video using AirPlay

### 5. 创建UI

音视频通话窗口中，一般包括以下几个UI控件

- 暂停/恢复语音按钮
- 结束通话按钮
- 扬声器/耳机切换按钮
- 后置摄像头切换按钮（视频）
- 打开/关闭摄像头按钮（视频）
- 本地图像显示与对端图像显示（视频）

通话界面可以参考Demo中Call1v1VideoViewController，效果如下：

![img](@static/images/privitization/1v1video.png)

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

在进行音视频通话前，需要首先登录IM账户，登录过程参见[账号登录](http://doc.easemob.com/document/ios/overview.html#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95)。

若您还没有IM账户，需要先注册账户，注册过程参见[账号注册](http://doc.easemob.com/document/ios/overview.html#%E6%B3%A8%E5%86%8C%E7%94%A8%E6%88%B7)

### 8. 音视频功能初始化

账号登录成功后，需要进行音视频通话功能的初始化，设置监听类

```
[[EMClient sharedClient].callManager addDelegate:self delegateQueue:nil];
```

### 9. 发起通话请求

主叫方发起呼叫通话请求的过程如下：

```
[[EMClient sharedClient].callManager startCall:EMCallTypeVideo 
                                    remoteName:aUsername
                                           ext:@"123" 
                                    completion:^(EMCallSession *aCallSession, EMError *aError) {
                                        self.callSession = aCallSession;
}];
```

回调的aCallSession为本次会话session，需要在本地保存下来。

在发起视频通话，等待对方接听过程中，已经可以显示本地图像，显示本地图像的过程如下

```
self.callSession.localVideoView = [[EMCallLocalView alloc] init];
    self.callSession.localVideoView.scaleMode = EMCallViewScaleModeAspectFill;
    [self.minVideoView addSubview:self.callSession.localVideoView];
    [self.view bringSubviewToFront:self.minVideoView];
    [self.callSession.localVideoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.minVideoView);
    }];
```

主叫方发起通话请求后，被叫方若已登录，将会收到如下回调通知

```
- (void)callDidReceive:(EMCallSession *)aSession
{
    self.callSession = aSession;
}
```

aSession为本次通话的session，被叫方应该在本地保存。

### 10. 接听通话

被叫方在收到通话请求回调后，可以选择接听/拒绝通话，若选择接听通话，调用如下：

```
[[EMClient sharedClient].callManager answerIncomingCall:self.callSession.callId];
```

此时被叫方可以显示本地视频图像

```
self.callSession.localVideoView = [[EMCallLocalView alloc] init];
    self.callSession.localVideoView.scaleMode = EMCallViewScaleModeAspectFill;
    [self.minVideoView addSubview:self.callSession.localVideoView];
    [self.view bringSubviewToFront:self.minVideoView];
    [self.callSession.localVideoView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.edges.equalTo(self.minVideoView);
    }];
```

当通话接通后，双方会收到callDidAccept回调通知，在这里可以设置远端图像

```
if (self.callSession.remoteVideoView == nil) {
        self.callSession.remoteVideoView = [[EMCallRemoteView alloc] init];
        self.callSession.remoteVideoView.backgroundColor = [UIColor clearColor];
        self.callSession.remoteVideoView.scaleMode = EMCallViewScaleModeAspectFit;
        self.callSession.remoteVideoView.userInteractionEnabled = YES;
    }
```

### 11. 拒绝通话

被叫方收到呼叫请求后，可以选择拒绝通话，调用过程如下：

```
[[EMClient sharedClient].callManager endCall:self.callSession.callId reason:EMCallEndReasonDecline];
```

拒绝后，主叫方收到如下回调, aReason为EMCallEndReasonDecline

```
- (void)callDidEnd:(EMCallSession *)aSession
            reason:(EMCallEndReason)aReason
             error:(EMError *)aError
```

### 12. 结束通话

通话中双方随时都可以结束通话，调用过程如下：

```
[[EMClient sharedClient].callManager endCall:@"callId" reason:EMCallEndReasonHangup];
```

结束后双方收到以下回调：

```
- (void)callDidEnd:(EMCallSession *)aSession
            reason:(EMCallEndReason)aReason
             error:(EMError *)aError
```

## 进阶功能

在实现基本视频通话的基础上，SDK提供更为丰富的API，可以实现更为复杂的音视频通话场景

### 取日志

SDK会写入日志文件到本地。日志文件路径如下：沙箱Documents/HyphenateSDK/easemoblog，以真机为例，获取过程如下：

- 打开Xcode连接设备，前往Xcode –> Window –> Devices and Simulators
- 进入Devices选项卡，在左侧选择目标设备，界面如下：

[![img](https://docs-im.easemob.com/_media/rtc/one2one/fetchlogfile.png?w=400&tok=6c005b)](https://docs-im.easemob.com/_detail/rtc/one2one/fetchlogfile.png?id=rtc%3Aone2one%3Aios)

日志文件easemob.log文件在下载包内容的AppData/Library/Application Support/HyphenateSDK/easemobLog目录下

### 音视频控制

使用通话过程中保存的EMCallSession的对象，可以分别进行音频、视频的开关控制，切换前后摄像头等操作，操作过程如下

```
/*!
 *  暂停语音数据传输
 *
 *  @result 错误
 */
- (EMError *)pauseVoice;

// 调用:
[aCallSession pauseVoice];

/*!
 *  恢复语音数据传输
 *
 *  @result 错误
 */
- (EMError *)resumeVoice;

// 调用:
[aCallSession resumeVoice];

/*!
 *  暂停视频图像数据传输
 *
 *  @result 错误
 */
- (EMError *)pauseVideo;

// 调用:
[aCallSession pauseVideo];

/*!
 *  恢复视频图像数据传输
 *
 *  @result 错误
 */
- (EMError *)resumeVideo;

// 调用:
[aCallSession resumeVideo];
```

通话过程中可以切换前后摄像头

```
#pragma mark - Camera

/*!
 *  设置使用前置摄像头还是后置摄像头,默认使用前置摄像头
 *
 *  @param  aIsFrontCamera    是否使用前置摄像头, YES使用前置, NO使用后置
 */
- (void)switchCameraPosition:(BOOL)aIsFrontCamera;

// 调用:
[aCallSession switchCameraPosition:YES];
```

当通话一方进行音频、视频的开关控制时，另一方会收到如下回调通知

```
/*!
 *  用户A和用户B正在通话中，用户A中断或者继续数据流传输时，用户B会收到该回调
 *
 *  @param aSession  会话实例
 *  @param aType     改变类型
 */
- (void)callStateDidChange:(EMCallSession *)aSession
                      type:(EMCallStreamingStatus)aType;
```

### 设置通话参数

通话之前，可以设置音频通话的最大音频码率，最小视频码率、最大视频码率、分辨率和是否清晰度优先，设置方法如下

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.maxAudioKBps = 32;
options.maxVideoKBps = 3000;
options.minVideoKBps = 500;
options.maxVideoFrameRate = 20;
options.videoResolution = EMCallVideoResolution352_288;
options.isClarityFirst = YES;//若设为清晰度优先，将在弱网环境下保证视频的分辨率
```

### 离线推送

iOS离线推送分为pushKit强推送和APNs普通推送，开启离线推送需要上传推送证书，参见[APNs推送证书上传](http://docs-im.easemob.com/im/ios/apns/deploy)和[pushKit推送集成](http://docs-im.easemob.com/knowledge/pushkit)

配置属性(在登录环信服务器成功之后设置)

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
//当对方不在线时，是否给对方发送离线消息和推送，并等待对方回应
options.isSendPushIfOffline = YES;
[[EMClient sharedClient].callManager setCallOptions:options];
```

协议

```
<EMCallBuilderDelegate>
```

添加代理

```
[[EMClient sharedClient].callManager setBuilderDelegate:self];
```

监听回调

```
- (void)callRemoteOffline:(NSString *)aRemoteName
{
    NSString *text = [[EMClient sharedClient].callManager getCallOptions].offlineMessageText;
    EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:text];
    NSString *fromStr = [EMClient sharedClient].currentUsername;
    EMMessage *message = [[EMMessage alloc] initWithConversationID:aRemoteName from:fromStr to:aRemoteName body:body ext:@{@"em_apns_ext":@{@"em_push_title":text}}];
    message.chatType = EMChatTypeChat;
    // 通过消息的ext来自定义提示铃声,其中customSound.caf为自定义铃声名称
    message.ext = @{ 
        @"em_apns_ext":@{
                @"em_push_sound":@"customSound.caf" 
        }
    };
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
}
```

因为该消息为提示铃声，所以使用自定义铃声来播放，时长需要控制在30秒以内，此处可以参考文档[自定义铃声](http://docs-im.easemob.com/im/ios/apns/content#自定义推送提示音)

协议，代理，回调方法建议写到工程的根控制器或者appdelegate中监听，起到全局监听的作用。

### 云端录制

主叫方呼叫时可以指定是否开启服务器录制，如要录制，使用以下方法呼叫,isRecord输入YES，isMerge为是否录制合流，根据需要进行设置

```
- (void)startCall:(EMCallType)aType
  remoteName:(NSString *)aRemoteName
      record:(BOOL)isRecord
 mergeStream:(BOOL)isMerge
         ext:(NSString *)aExt
  completion:(void (^)(EMCallSession *aCallSession, EMError *aError))aCompletionBlock;
```

### 通话统计数据

通话数据的统计功能需要主动开启，开启方法为在通话前进行如下设置

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.enableReportQuality = YES;
```

开启后可以从保存的会话callSession中获取到通话的实时码率、帧率、分辨率等数据

### 弱网检测

SDK提供实时检测通话网络质量的功能，同样需要开启通话数据统计，开启方法同上。开启后，可以通过回调通知应用当前实时通话网络状态。

```
typedef enum{
    EMCallNetworkStatusNormal = 0,  /*! 正常 */
    EMCallNetworkStatusUnstable,    /*! 不稳定 */
    EMCallNetworkStatusNoData,      /*! 没有数据 */
}EMCallNetworkStatus;

/*!
 *  用户A和用户B正在通话中，用户A的网络状态出现不稳定，用户A会收到该回调
 *
 *  @param aSession  会话实例
 *  @param aStatus   当前状态
 */
- (void)callNetworkDidChange:(EMCallSession *)aSession
                      status:(EMCallNetworkStatus)aStatus
```

### 变声/自定义音频

用户可以通过自己采集音频数据，使用外部输入音频数据的接口进行通话，从而实现变声等音频数据加工功能

##### 配置属性

用户使用自定义音频数据时，需要配置外部输入音频数据的开关，以及音频采样率，通道数(当前通道数只支持1)，配置方法如下：

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.enableCustomAudioData = YES;
options.audioCustomSamples = 48000;
options.audioCustomChannels = 1;
[[EMClient sharedClient].callManager startCall:aType remoteName:aUsername ext:@"123" completion:^(EMCallSession *aCallSession, EMError *aError) {
        completionBlock(aCallSession, aError);
}];
```

##### 输入音频数据

音频数据采集可参考Demo中的AudioRecord类实现,音频数据的输入必须在会话接通后开始，否则会导致网络阻塞，影响通话质量。建议用户将音频数据采集的开始放在会话接通的回调里，及callDidAccept回调中

```
- (void)callDidAccept:(EMCallSession *)aSession
{
    if ([aSession.callId isEqualToString:self.currentCall.callId]) {
        [self _stopCallTimeoutTimer];
        self.currentController.callStatus = EMCallSessionStatusAccepted;
    }
    EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
    if(options.enableCustomAudioData){
        [self audioRecorder].channels = options.audioCustomChannels;
        [self audioRecorder].samples = options.audioCustomSamples;
        [[self audioRecorder] startAudioDataRecord];
    }
}
```

音频采集过程开始后，在音频数据的回调里调用外部输入音频数据接口

```
[[[EMClient sharedClient] callManager] inputCustomAudioData:data
```

会话挂断时，停止音频采集及输入过程

```
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
if(options.enableCustomAudioData) {
    [[self audioRecorder] stopAudioDataRecord];
}
```

### 美颜/自定义视频

用户可以通过自己采集视频数据，使用外部输入视频数据的接口，实现自定义视频传输功能，可以对视频数据进行添加滤镜、美颜等功能。

##### 配置属性

使用外部输入视频数据接口前，需要先进行配置，配置如下

```
//进行1v1自定义视频之前，必须设置 EMCallOptions.enableCustomizeVideoData=YES
EMCallOptions *options = [[EMClient sharedClient].callManager getCallOptions];
options.enableCustomizeVideoData = YES;
[[EMClient sharedClient].callManager startCall:aType remoteName:aUsername ext:@"123" completion:^(EMCallSession *aCallSession, EMError *aError) {
        completionBlock(aCallSession, aError);
}];
```

##### 自定义摄像头数据

设置 **EMCallOptions.enableCustomizeVideoData=YES** 后，必须自定义摄像头数据。采集视频数据可使用AVCaptureSession实现，呼叫方的视频数据采集可以在呼叫对方时开始，而接听方的数据采集可以在按下接听按钮后开始。 外部输入视频数据的接口如下：

```
/*!
 *  \~chinese
 *  自定义本地视频数据
 *
 *  @param aSampleBuffer      视频采样缓冲区
 *  @param aRotation          旋转方向
 *  @param aCallId            1v1会话实例ID，即[EMCallSession callId]
 *  @param aCompletionBlock   完成后的回调
 */
- (void)inputVideoSampleBuffer:(CMSampleBufferRef)aSampleBuffer
                      rotation:(UIDeviceOrientation)aRotation
                        callId:(NSString *)aCallId
                    completion:(void (^)(EMError *aError))aCompletionBlock;

/*!
 *  \~chinese
 *  自定义本地视频数据
 *
 *  @param aPixelBuffer      视频像素缓冲区
 *  @param aCallId           1v1会话实例ID，即[EMCallSession callId]
 *  @param aTime             视频原始数据时间戳，CMTime time = CMSampleBufferGetPresentationTimeStamp((CMSampleBufferRef)sampleBuffer);
 *  @param aRotation         旋转方向
 *  @param aCompletionBlock  完成后的回调
 */
- (void)inputVideoPixelBuffer:(CVPixelBufferRef)aPixelBuffer
             sampleBufferTime:(CMTime)aTime
                     rotation:(UIDeviceOrientation)aRotation
                       callId:(NSString *)aCallId
                   completion:(void (^)(EMError *aError))aCompletionBlock;
```

接口的调用在视频数据的回调中，即captureOutput:didOutputSampleBuffer:fromConnection中调用，调用前需要判断当前会话通话状态，若状态为EMCallSessionStatusAccepted，则可以调用外部输入视频数据接口。

当视频通话挂断时，需要终止视频数据采集过程

### 水印

视频通话时，可以添加图片作为水印，添加时使用[IEMCallManager addVideoWatermark]接口，需要指定水印图片的NSUrl，添加位置.参见[EMWaterMarkOption](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_water_mark_option.html)。

清除水印使用[IEMCallManager clearVideoWatermark]接口。

显示remoteVideo需要使用EMCallViewScaleModeAspectFit模式，否则对方的水印设在边缘位置可能显示不出来。

##### 接口

```
/*!
*  \~chinese
*  开启水印功能
*
*  @param option 水印配置项，包括图片URL，marginX,marginY以及起始点
*
*  \~english
*  Enable water mark feature
*
*  @param option the option of watermark picture,include url,margingX,marginY,margin point
 */
- (void)addVideoWatermark:(EMWaterMarkOption*)option;
/*!
*  \~chinese
*  取消水印功能
*
*  \~english
*  Disable water mark feature
*
 */
- (void)clearVideoWatermark;
```


### 私有部署

私有部署设置方法参见[私有云sdk集成配置](../im/uc_iOS_private.md)

## 客户端API

1V1音视频通话的API包括以下接口

- EMCallOption 视频通话配置类
- EMCallManager 是视频通话的主要管理类，提供了语音通话的拨打、接听、挂断等接口
- EMCallManagerDelegate 是视频通话的监听回调类，实时语音通话相关的回调
- EMCallBuilderDelegate 提供了拨打视频通话时对方不在线的回调
- EMCallSession 语音通话的会话实例接口类

### EMCallOption

| 属性                                                         | 描述                                                 |
| :----------------------------------------------------------- | :--------------------------------------------------- |
| [pingInterval](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a3186d2e45fcd6c5697c724679d0affc7) | 心跳时间间隔，单位秒，默认30s，最小10s               |
| [isSendPushIfOffline](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a387a20ee25e1d735b61b0c31bf834556) | 被叫方不在线时，是否推送来电通知                     |
| [offlineMessageText](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a62d88c4b292cdfb13b4ea8d723ba2f65) | 当isSendPushIfOffline=YES时起作用,离线推送显示的内容 |
| [maxAudioKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#aea45547ce623a0fd5d53a36f00334520) | 最大音频码率                                         |
| [maxVideoKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a4130c8f7488d6d6f58c3783dc63be5fd) | 最大视频码率                                         |
| [minVideoKbps](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#ae070e260597c913634a21c03aa31826a) | 最小视频码率                                         |
| [maxVideoFrameRate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a45f020f84b4513fdc0cb3f8a123fe678) | 最大视频帧率                                         |
| [videoResolution](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#af49ac4f01b9bca538fbce40e1de5f866) | 视频分辨率                                           |
| [enableReportQuality](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#af2129acdd0d3d73a583e8d37dfc087e2) | 是否监听通话质量                                     |
| [enableCustomAudioData](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#ae927cb60d05c59b389517648941e7ec8) | 是否使用自定义音频数据                               |
| [audioCustomSamples](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a76482a8e2702e1905c036142e41c8a6d) | 自定义音频数据的采样率，默认48000                    |
| [enableCustomizeVideoData](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_options.html#a89f38b15e05ed5d6636af5fde628d114) | 是否使用自定义视频数据                               |

### EMCallManager

| 方法                                                         | 功能                                     |
| :----------------------------------------------------------- | :--------------------------------------- |
| [addDelegate:delegateQueue:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a367328bcd0bf83a51dc08ddaec68872f) | 添加回调代理                             |
| [removeDelegate:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#aa9b3da07b69c09e892f828791b1370cb) | 移除回调代理                             |
| [setBuilderDelegate:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#ab186d489c2779e2984498f79b63432fd) | 添加离线推送回调代理，该代理只能设置一个 |
| [setCallOptions:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a8bdffc278012912e6b647496f950f2d0) | 设置设置项                               |
| [getCallOptions](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#aa57c5e2e99d712a9e228fa4a3456cab4) | 获取设置项                               |
| [startCall:remoteName:ext:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#afb034d6e9e45e8712f6ce152c83cde51) | 发起实时会话                             |
| [startCall:remoteName:record:mergeStream:ext:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a96844b40a066c066bc0e1dd99d98c535) | 发起实时会话,可选择是否录制              |
| [answerIncomingCall:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#acc32a00500f5ff029035a723fc4234c2) | 接收方同意通话请求                       |
| [endCall:reason:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a3964f06814f26a3f3f9b435f59ee3385) | 结束通话                                 |
| [inputCustomAudioData:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a39f332f19d39159b7fdcb5667e38db5d) | 自定义外部音频数据                       |
| [inputVideoSampleBuffer:rotation:callId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a09537a70ba5c40c1de38db2398b9bd95) | 自定义本地视频数据                       |
| [inputVideoPixelBuffer:sampleBufferTime:rotation:callId:completion:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a04e9c0e4e1bdbe060552865e39daab73) | 自定义本地视频数据                       |
| [addVideoWatermark:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a5618360f7593b6acc429fd2318962724) | 开启水印                                 |
| [clearVideoWatermark](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#a16bddaff9383df6da73e08919019d322) | 清除水印                                 |

### EMCallManagerDelegate

| 回调事件                                                     | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [callDidReceive:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#a3eba09d467fd76b4af04e5bf47154b77) | 用户A拨打用户B，用户B会收到这个回调                          |
| [callDidConnect:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#a5203fbf604e29cacedf483c5f52b9923) | 通话通道建立完成，用户A和用户B都会收到这个回调               |
| [callDidAccept:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#aa0f4c7b3f5a9c6613f6726420910e76c) | 用户B同意用户A拨打的通话后，用户A和B会收到这个回调           |
| [callDidEnd:reason:error:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#a82a5133f2175c94c4b39cf6f42010601) | 1. 用户A或用户B结束通话后，双方会收到该回调. 2. 通话出现错误，双方都会收到该回调 |
| [callStateDidChange: type:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#a3b78b91a87d76a4ec5f79f60cb213228) | 用户A和用户B正在通话中，用户A中断或者继续数据流传输时，用户B会收到该回调 |
| [callNetworkDidChange:status:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_manager_delegate-p.html#aae5150a53d6c69c278b9bdde4cac2022) | 用户A和用户B正在通话中，用户A的网络状态出现不稳定，用户A会收到该回调。若未开启录制，用户B也会收到该回调 |

### EMCallBuilderDelegate

| 回调事件                                                     | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [callRemoteOffline:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_e_m_call_builder_delegate-p.html#a14ac31090d0283a3229cc665aa1b34d2) | 用户A给用户B拨打实时通话，用户B不在线，并且用户A设置了[EMCallOptions.isSendPushIfOffline == YES],则用户A会收到该回调 |

### EMCallSession

属性

| 属性                                                         | 描述                                                  |
| :----------------------------------------------------------- | :---------------------------------------------------- |
| [callId](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a66283c44edfc5ae767b382f63176d953) | 会话标识符                                            |
| [localName](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a97e3bea964a2228e08cbc77587f5402e) | 通话本地的username                                    |
| [type](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#aa12fc9a028f5ae16869a302894ffdb4f) | 通话的类型                                            |
| [isCaller](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a782bad856c936638349d96e8520cc0ef) | 是否为主叫方                                          |
| [remoteName](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a0652ad964df50c2bafe76281026cde69) | 对方的username                                        |
| [status](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a7ac723de33f96d1f05777c5e53001636) | 通话的状态                                            |
| [localVideoView](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#ad8ed75a4fedb8ae9573d8c5ce296867a) | 视频通话时本地的图像显示区域                          |
| [remoteVideoView](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a74cf99cc4f08c2694459b878b04f3829) | 视频通话时对方的图像显示区域                          |
| [connectType](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#ab31443f1605498f4bb80a4e98925fecb) | 连接类型                                              |
| [videoLatency](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a218b700793cbd72fb0bd1a5556bf0e06) | 视频的延迟时间，单位是毫秒                            |
| [localVideoFrameRate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a6d05d54be6d7508b959f2ef020ca0eee) | 本地视频的帧率，实时变化 未获取到返回-1               |
| [remoteVideoFrameRate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#ac1e60bc6f19f4cf2d50c2264702928dd) | 对方视频丢包率，实时变化 未获取到返回-1               |
| [localVideoBitrate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#aecc7d56536bfedcb924e19e0bc860109) | 本地视频通话对方的比特率kbps，实时变化 未获取到返回-1 |
| [remoteVideoBitrate](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#adf4ac941a4a002e5025b78d01b98b2c0) | 对方视频通话对方的比特率kbps，实时变化 未获取到返回-1 |
| [localVideoLostRateInPercent](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#ab42eb2571e0bb1111ab33f84c80588a0) | 本地视频丢包率，实时变化 未获取到返回-1               |
| [remoteVideoLostRateInPercent](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#aea427d3dd20376f3a9a5f37fb157358a) | 对方视频丢包率，实时变化 未获取到返回-1               |
| [remoteVideoResolution](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a3ef044730afda942a2e7955b23bc9d75) | 对方视频分辨率 未获取到返回 (-1,-1)                   |
| [serverVideoId](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#ac0aa89265a9e30dbb23d3d605cf91172) | 服务端录制文件的id                                    |
| [willRecord](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a6b76c8b2df03bcf4fab8b459fcc60407) | 是否启用服务器录制                                    |
| [ext](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a7c446f7fa3e2d23fd3cb2c8eb448dcd1) | 消息扩展                                              |

方法

| 方法                                                         | 功能             |
| :----------------------------------------------------------- | :--------------- |
| [pauseVoice](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a42467f8c736ca48b7d97d0281e52e0c7) | 暂停语音数据传输 |
| [resumeVoice](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a52119fa0310787b4041fab33248abf0e) | 恢复语音数据传输 |
| [pauseVideo](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a36946520d5b65fbe1900c3fc87d7d6c9) | 暂停视频传输     |
| [resumeVideo](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a5529c28cebfd1959f37934028464b2a6) | 恢复视频传输     |
| [switchCameraPosition:](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/interface_e_m_call_session.html#a5c3eb19b609b57c4842a4ef8900c984b) | 切换前后摄像头   |