# EaseCallKit 使用指南

<Toc />

## 功能概述

`EaseCallKit` 是一套基于环信 IM 和声网音视频结合开发的音视频 UI 库，实现了一对一语音和视频通话以及多人音视频通话的功能。基于 `EaseCallKit` 可以快速实现通用音视频功能。

**利用 `EaseCallKit` 通话过程中，使用环信 ID 加入频道，方便音视频视图中显示用户名。如果用户不使用 `EaseCallKit` 而直接调用声网 API，也可以直接使用数字 UID 加入频道。**

:::notice
本 UI 库只和移动端 3.8.0 及以上版本 Demo 互通。3.8.1 的 UI 库使用声网数字 uid 加入频道，而 3.8.0 使用字符串加入频道，3.8.1 版本不与 3.8.0 互通，Demo 中 EaseCallKit 使用的 token 和 UID 均由你自己生成。若你需要使用声网对应的音视频服务，需单独在声网申请。
:::

## 跑通 Demo

EaseCallKit 集成在环信开源 IM Demo 中，你可以通过进入 [环信 Demo 及源码](https://www.easemob.com/download/im) 下载页面，选择 Android 端进行下载，直接下载: [Android IM 源码](https://github.com/easemob/chat-android)。

环境准备：

- Android Studio 3.5 及以上版本；
- Gradle 4.6 及以上版本；
- targetSdkVersion 29；
- minSdkVersion 19；
- Java JDK 1.8 及以上版本。

运行 Demo：

- 下载源码后，用 Android Studio 打开项目，连接手机，然后运行。

## 准备条件

集成该库之前，你需要满足以下条件：

- 分别创建 [环信应用](/product/enable_and_configure_IM.html) 及 [声网应用](https://docportal.shengwang.cn/cn/video-legacy/run_demo_video_call_ios?platform=iOS#1-创建声网项目)；
- 已完成环信 IM 的基本功能，包括登录、好友、群组以及会话等的集成；
- 上线之前开通声网 Token 验证时，用户需要实现自己的 [App Server](https://github.com/easemob/easemob-im-app-server/tree/master/agora-app-server)，用于生成 Token。具体请参见 [创建 Token 服务及使用 App Server 生成 Token](https://docportal.shengwang.cn/cn/video-call-4.x/token_server_ios_ng)。

## 快速集成

使用 `EaseCallKit` 库完成音视频通话的基本流程如下：

1. `EaseCallKit` 库进行初始化并设置 `EaseCallKit` 监听；
2. 主叫方调用发起通话邀请接口，进入通话界面；
3. 被叫方收到邀请自动弹出通话邀请界面，在通话邀请界面选择接通或者拒绝；
4. 主叫或者被叫挂断通话。

### 导入 EaseCallKit 库

`EaseCallKit` 主要依赖于 `com.hyphenate:hyphenate-chat:xxx` 版本和 `io.agora.rtc:full-sdk:xxx` 版本等库;

`EaseCallKit` 库可通过 Gradle 方式和源码两种方式集成。

#### Gradle 方式集成

- 在 `build.gradle` 中添加以下代码，重新 build 你的项目即可。

```gradle
implementation 'io.hyphenate:ease-call-kit:3.8.9'
```

:::notice
`EaseCallKit` 必须依赖环信 IM SDK (即 hyphenate-chat) ，因而在使用 `EaseCallKit` 时必须同时添加环信 IM SDK 依赖。
:::

#### 源码集成

- 下载 [EaseCallKit 源码](https://github.com/easemob/easecallkitui-android)；
- 在 `build.gradle` 中增加以下内容，重新 build 你的项目即可。

```gradle
implementation project(':ease-call-kit')
```

`EaseCallKit` 中如果要修改 `hyphenate-chat` 和 `agora.rtc` 中版本号，可修改以下依赖:

```gradle
//环信 SDK
implementation 'io.hyphenate:hyphenate-chat:3.8.0' (`hyphenate-chat` 只支持 3.8.0 及以上版本)
//声网 SDK
implementation 'io.agora.rtc:full-sdk:3.8.0'
```

使用 easecallkit 4.0.1 或以上版本 时，请使用声网音视频库 `io.agora.rtc:full-sdk:4.1.0`。

### 添加权限

根据场景需要，本库需要增加麦克风、相机和悬浮窗等权限:

```xml
<manifest xmlns:android="https://schemas.android.com/apk/res/android"
    package="com.hyphenate.easeim">

    <!-- 添加悬浮窗权限 -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <!-- 添加访问网络权限.-->
    <uses-permission android:name="android.permission.INTERNET" />
    <!-- 添加麦克风权限 -->
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <!-- 添加相机权限 -->
    <uses-permission android:name="android.permission.CAMERA" />
    ...

</manifest>
```

### 添加 EaseCallKit Activity

在清单中增加 `EaseCallKit` 中的 `EaseVideoCallActivity` 和 `EaseMultipleVideoActivity`:

```xml
//添加 Activity
<activity
    android:name="com.hyphenate.easecallkit.ui.EaseVideoCallActivity"
    android:configChanges="orientation|keyboardHidden|screenSize"
    android:excludeFromRecents="true"
    android:launchMode="singleInstance"
    android:screenOrientation="portrait"/>
<activity
    android:name="com.hyphenate.easecallkit.ui.EaseMultipleVideoActivity"
    android:configChanges="orientation|keyboardHidden|screenSize"
    android:excludeFromRecents="true"
    android:launchMode="singleInstance"
    android:screenOrientation="portrait"/>
```

### 初始化

在环信 IM SDK 初始化完成后，可以开始初始化 `EaseCallKit`，同时增加监听回调，设置常用配置项。代码如下：

```java
//初始化 `EaseCallUIKit`。
EaseCallKitConfig callKitConfig = new EaseCallKitConfig();
//设置默认头像。
String headImage = EaseFileUtils.getModelFilePath(context,"watermark.png");
callKitConfig.setDefaultHeadImage(headImage);
//设置振铃文件。
String ringFile = EaseFileUtils.getModelFilePath(context,"huahai.mp3");
callKitConfig.setRingFile(ringFile);
//设置呼叫超时时间，单位为秒。
callKitConfig.setCallTimeOut(30 * 1000);
//设置声网的 appId。
callKitConfig.setAgoraAppId("*****");
Map<String, EaseCallUserInfo> userInfoMap = new HashMap<>();
userInfoMap.put("***",new EaseCallUserInfo("****",null));
callKitConfig.setUserInfoMap(userInfoMap);
EaseCallKit.getInstance().init(context,callKitConfig);
addCallkitListener();
```

可设置的配置项包括以下内容：

```java
/**
 * EaseCallKit 相关的用户配置选项。
 * defaultHeadImage  用户默认头像。该参数的值为本地文件绝对路径或者 URL。
 * userInfoMap      用户相关信息。该信息为 key-value 格式，key 为用户的环信 ID，value 为 `EaseCallUserInfo`。
 * callTimeOut      呼叫超时时间，单位为毫秒，默认为 30 秒。
 * audioFile       振铃文件。该参数的值为本地文件绝对路径。
 * enableRTCToken  是否开启 RTC 验证。该功能通过声网后台控制，默认为关闭。
 */
public class EaseCallKitConfig {
    private String defaultHeadImage;
    private Map<String,EaseCallUserInfo> userInfoMap = new HashMap<>();
    private String RingFile;
    private String agoraAppId = "****";
    private long callTimeOut = 30 * 1000;
    public EaseCallKitConfig(){
    ...
}
```

### 发起通话邀请

`EaseCallKit` 初始化完成后，可以发起音视频通话。

#### 一对一音视频通话

一对一通话可分为视频通话和语音通话，接口如下所示：

```java
/**
 * 发起一对一通话。
 * @param type 通话类型。该参数只能设置为 `SIGNAL_VOICE_CALL` 或 `SIGNAL_VIDEO_CALL`。
 * @param user 被叫用户 ID，即环信 ID。
 * @param ext  自定义扩展字段，描述通话扩展信息。
 */
public void startSingleCall(final EaseCallType type, final String user,final  String ext){}
```

#### 多人音视频通话

你可以从群组成员列表或者好友列表中选择，发起多人音视频邀请，具体实现可参考 demo 中的 `ConferenceInviteActivity`。

```java
/**
 * 邀请用户加入多人通话。
 * @param users 用户 ID 列表，即环信 ID 列表。
 * @param ext  自定义扩展字段，描述通话扩展信息。
 */
public void startInviteMultipleCall(final String[] users,final String ext){}
```

发起通话后的 UI 界面如下：

![img](/images/android/sendcall.png)

### 被叫收到通话邀请

主叫方发起邀请后，如果被叫方在线且当前不在通话中，会弹出邀请通话界面，被叫可以选择接听或者拒绝。

被叫收到邀请后会触发 `EaseCallKitListener` 中的 `onRevivedCall` 回调：

```java
/**
 * 收到通话邀请回调。
 * @param callType  通话类型。
 * @param userId    邀请方的用户 ID。
 * @param ext       自定义扩展字段，描述通话扩展信息。
 */
void onRevivedCall(EaseCallType callType, String userId,String ext){}
```

收到通话邀请后的界面如下:

![img](/images/android/called.jpeg)

### 多人通话中邀请

多人通话中，当前用户可以点击通话界面右上角的邀请按钮再次向其他用户发起邀请。这种情况下，会触发 `EaseCallKitListener` 中的 `onInviteUsers` 回调：

```java
/**
 * 邀请好友进行多人通话。
 * @param context  通话上下文。
 * @param users    当前通话中已经存在的成员。
 * @param ext      自定义扩展字段，描述通话扩展信息。
 */
public void onInviteUsers(Context context,String userId[],String ext) {
}
```

### 加入频道成功回调

用户加入通话后，当前用户以及其他与会者会收到 `EaseCallKitListener` 中的 `onRemoteUserJoinChannel` 回调。该接口自从 SDK 3.8.1 新增。

```java
@Override
public void onRemoteUserJoinChannel(String channelName, String userName, int uid, EaseGetUserAccountCallback callback){
    //此时，可以获取当前频道中已有用户的声网 ID 与环信 ID 的映射表，并将映射表设置到 `EaseCallKit`，同时也可以更新用户的头像和昵称。
    // callback.onUserAccount(accounts);
}
```

### 通话结束

在一对一音视频通话中，若其中一方挂断，双方的通话会自动结束，而多人音视频通话中需要主动挂断才能结束通话。通话结束后，会触发 `onEndCallWithReason` 回调：

```java
/**
 * 通话结束回调。
 * @param callType    通话类型。
 * @param reason      通话结束原因。
 * @param callTime    通话时长。
 */
void onEndCallWithReason(EaseCallType callType, String channelName, EaseCallEndReason reason, long callTime){}

//通话结束原因如下：
public enum EaseCallEndReason {
    EaseCallEndReasonHangup(0), //正常挂断。
    EaseCallEndReasonCancel(1), //您已取消通话。
    EaseCallEndReasonRemoteCancel(2), //对方取消通话。
    EaseCallEndReasonRefuse(3),//对方拒绝接听。
    EaseCallEndReasonBusy(4), //忙线中。
    EaseCallEndReasonNoResponse(5), //您未接听。
    EaseCallEndReasonRemoteNoResponse(6), //对端无响应。
    EaseCallEndReasonHandleOnOtherDevice(7); //已在其他设备处理。
   ....
}
```

## 进阶功能

### 通话异常回调

通话过程中如果有异常或者错误发生，会触发 `EaseCallKitListener` 中的 `onCallError` 回调：

```java
/**
 * 通话异常回调。
 * @param type            错误类型。
 * @param errorCode       错误码。
 * @param description     错误描述。
 */
void onCallError(EaseCallKit.EaseCallError type, int errorCode, String description){}
```

`EaseCallError` 异常包括业务逻辑异常、音视频异常以及 Easemob IM 异常。

```java
/**
 * 通话错误类型。
 *
 */
public enum EaseCallError{
    PROCESS_ERROR, //业务逻辑异常。
    RTC_ERROR, //音视频异常。
    IM_ERROR  //Easemob IM 异常。
}
```

### 配置修改

`EaseCallKit` 库初始化之后，可修改有关配置，接口和示例如下:

```java
/**
 * 获取当前 `EaseCallKit` 的配置。
 *
 */
public EaseCallKitConfig getCallKitConfig(){}

//修改默认头像。
EaseCallKitConfig config = EaseCallKit.getInstance().getCallKitConfig();
if(config != null){
     String Image = EaseFileUtils.getModelFilePath(context,"bryant.png");
     callKitConfig.setDefaultHeadImage(Image);
}
```

### 头像昵称修改

自 `EaseCallKit` 3.8.1 开始，新增了修改头像昵称的接口，用户可以在加入频道后，修改自己和通话中其他人的头像昵称，修改方法如下：

```java
@Override
public void onRemoteUserJoinChannel(String channelName, String userName, int uid, EaseGetUserAccountCallback callback){
    if(userName == null || userName == ""){
        // 根据用户的 Agora ID 获取 环信 ID。url 为获取用户信息的请求 URL，请参考 [Easemob IM demo](https://www.easemob.com/download/demo)。
        getUserIdAgoraUid(uid, url, callback);
        // 将获取到的用户信息设置给回调，具体实现请参考 [Easemob IM demo](https://www.easemob.com/download/demo)。
        //callback.onUserAccount(userAccounts);
    }else{
        // 设置用户昵称和头像。
        setEaseCallKitUserInfo(userName);
        EaseUserAccount account = new EaseUserAccount(uid,userName);
        List<EaseUserAccount> accounts = new ArrayList<>();
        accounts.add(account);
        callback.onUserAccount(accounts);
    }
}
```

## 参考

### 获取声网 token

加入音视频时，你需获取声网 token 以进行鉴权，需要在 `EaseCallKitListener` 中将 token 回调给 `EaseCallKit`。

如果不需要鉴权，可以直接回调 token 为 `null`，或者在设置 `callKitConfig.setEnableRTCToken(false)` 的前提下不实现该回调, 具体接口和使用如下：

```java
/**
 * 用户生成 token 回调。
 * @param userId       用户 ID，即用户的环信 ID。
 * @param channelName  频道名称。
 * @param agoraAppId   声网的 App ID。
 * @param callback     生成的 token 回调。若成功生成 token，即返回 token；若未能成功生成 token，返回错误码和错误消息。
 */
default void onGenerateToken(String userId,String channelName,String agoraAppId,EaseCallKitTokenCallback callback){};

@Override
public void onGenerateToken(String userId, String channelName, String agoraAppId, EaseCallKitTokenCallback )callback{
    if(callback != null){
        // 若无需 token 鉴权，你需向 `token` 传 `null`，向 `uid` 传 `0`。
        //callback.onSetToken(null, 0);


        // 若需要 token 鉴权，则调用你的 App Server 生成 token，然后将生成的 token 回调给 `EaseCallKit`。
        // url 为拼接参数请求 token 的 URL，可参考[官网上的 Easemob IM demo](https://www.easemob.com/download/demo)。
        getRtcToken(url, callback);
        //获取到 token 及 uid 后，将其回调给 callback 即可。
        //callback.onSetToken(token, uid);
    }
}
```

自 EaseCallKit 3.8.1 版本开始，`EaseCallKitTokenCallback` 中的 `onSetToken` 方法添加了 `uid` 参数，你可以使用数字 uid 加入声网频道。

```java
void onSetToken(String token, int uId);
```

### 离线推送

为保证被叫用户 App 在后台运行或离线时也能收到通话请求，用户需开启离线推送。关于如何开启离线推送，请参见 [开启 Android Push](push.html)。开启离线推送后，用户在离线情况下收到呼叫请求时，其手机通知页面会弹出一条通知消息，用户点击该消息可唤醒 App 并进入振铃页面。

关于离线推送场景方案，请参见 [安卓端设置推送](push.html)。

## API 列表

`EaseCallKit` 中提供的 API 列表如下：

| 方法                    | 说明                          |
| :---------------------- | :---------------------------- |
| init                    | 初始化 `EaseCallKit`。        |
| setCallKitListener      | 设置监听。                    |
| startSingleCall         | 发起单人通话。                |
| startInviteMultipleCall | 邀请用户加入多人通话。        |
| getCallKitConfig        | 获取 `EaseCallKit` 相关配置。 |

回调模块 `EaseCallKitListener` 的 API 列表如下：

| 事件                    | 说明                                                             |
| :---------------------- | :--------------------------------------------------------------- |
| onEndCallWithReason     | 通话结束时触发该事件。                                           |
| onInviteUsers           | 多人通话中点击邀请按钮触发该事件。                               |
| onReceivedCall          | 振铃时触发该事件。                                               |
| onGenerateToken         | 获取声网 token 回调。用户将获取到的 token 回调到 `EaseCallKit`。 |
| onCallError             | 通话异常时触发该回调。                                           |
| onInViteCallMessageSent | 通话邀请消息回调。                                               |
| onRemoteUserJoinChannel | 用户加入频道时触发。该方法自 `EaseCallKit` 3.8.1 版本添加。      |

`EaseGetUserAccountCallback` 的 API 列表如下：

| 事件                  | 说明                                                                    |
| :-------------------- | :---------------------------------------------------------------------- |
| onUserAccount         | 传入环信 ID 与声网 uid 的映射。 该方法自 `EaseCallKit` 3.8.1 版本添加。 |
| onSetUserAccountError | 获取用户信息失败触发。方法自 `EaseCallKit` 3.8.1 版本添加。             |
