# Android集成多人通话

## 跑通Demo

### 1. 示例代码

- [下载视频会议Demo代码](https://github.com/easemob/videocall-android)
- [体验Demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/rtcdemo/videocall-android.apk) 

或进入环信[客户端下载](common_clientsdk.html#场景demo及源码下载)页面，选择下载Android端视频会议 Demo。

### 2. 前提条件

- Android Studio 3.0 或以上版本 
- Android SDK API 等级 19 或以上
- Android 4.4 或以上版本的设备

### 3. 运行Demo

#### 3.1 Demo代码目录简介

![img](@static/images/privitization/conference_android_demo.png)
源码目录如上所示，主要目录如以下介绍：<br>
- ui是有关所有Activity的具体实现
- runtimepermissions是有关运行是有关动态权限的获取的封装
- untils是有关工具类的封装
- DemoHelper和DemoApplication类是全局单例，用来做一些初始化

#### 3.2 工程设置，SDK导入

选择如下任意一种方式将环信语音SDK集成到你的项目中：

**方法一：使用 JCenter 自动集成**

在项目的 /app/build.gradle 文件中，添加如下行：

```
dependencies { 
   ... 
   // x.x.x 请填写具体版本号，如：3.7.0 
   // 可通过 SDK 发版说明取得最新版本号 
   api 'com.hyphenate:hyphenate-sdk:x.x.x' 
 } 
```

**方法二：手动复制 SDK 文件**

前往SDK载页面，获取最新版的环信音视频SDK，然后解压；<br>
将SDK包内libs路径下的如下文件，拷贝到你的项目路径下：<br>
- hyphenatechat_3.7.0.jar 文件 /app/libs/
- arm-v8a 文件夹 /app/src/main/jniLibs/
- armeabi-v7a 文件夹 /app/src/main/jniLibs/
- x86文件夹 /app/src/main/jniLibs/
- x86_64文件夹 /app/src/main/jniLibs/

#### 3.3 运行项目

用Android Studio 运行examples\ChatDemoUI3.0 或者 连接Android 手机，直接运行即可。<br>
需要注意的的是项目build.gradle中的，配置成和自己Android Studio相匹配的 gradle 版本，如下所示<br>

```
dependencies {
    classpath 'com.android.tools.build:gradle:3.2.1'
 }
```

## 快速集成

### 1. 环信后台注册appkey

环信为管理者与开发者提供了方便易用的App工作台– **环信管理后台**。<br>
通过环信管理后台可以完成应用创建、服务配置、企业信息修改基础功能；同时，管理后台也提供了发送消息、用户管理、群组管理、聊天室管理和数据统计等管理监控功能。<br>
在开始集成前，你需要注册环信开发者账号并在后台创建应用，参见[创建应用](../im/uc_configure.html#创建应用) 。

### 2. 创建项目

- 打开 Android Studio点击Start a new Android Studio project；<br>
- 在Select a Project Template界面，选择 Phone and Tablet > Empty Activity；<br>
- 点击 Next；<br>
- 在 Configure Your Project界面，依次填入以下内容：Name：你的Android项目名称，如 HelloWrold；<br>
- Package name:你的项目包的名称，如 package.easemob.helloworld；<br>
- Save location：项目的存储路径；<br>
- Language：项目的编程语言，如 Java；<br>
- Minimum API level：项目的最低 API 等级；(**注意本SDK 支持API 19或以上**)<br>
- 点击 Finish；<br>
- 根据屏幕提示，安装可能需要的插件；<br>
上述步骤使用 Android Studio 3.6.2 示例，你也可以直接参考Android Studio 官网文档创建首个应用。

### 3. 导入SDK到工程

新建项目完成以后，可以选择以上任何一种导入SDK的方法，把环信音视频SDK集成到你的项目里面，参考[导入SDK](#_3-2-工程设置-sdk导入)。

### 4. 添加权限

根据场景需要，在 /app/src/main/AndroidManifest.xml 文件中添加如下行，获取相应的设备权限；<br>
在清单文件 AndroidManifest.xml 里加入以下权限，以及写上你注册的 AppKey；<br>
权限配置（实际开发中可能需要更多的权限，可参考 Demo）；

```
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
 xmlns:tools="http://schemas.android.com/tools"
 package="com.a.b">

 <uses-feature android:name="android.hardware.camera" />
 <uses-feature android:name="android.hardware.camera.autofocus" />
 <uses-permission android:name="android.permission.VIBRATE" />
 <uses-permission android:name="android.permission.INTERNET" />
 <uses-permission android:name="android.permission.RECORD_AUDIO" />
 <uses-permission android:name="android.permission.CAMERA" />
 <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
 <uses-permission android:name="android.permission.CHANGE_NETWORK_STATE" />
 <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
 <uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS" />
 <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
 <uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
 <uses-permission android:name="android.permission.BLUETOOTH" />
 <uses-permission android:name="android.permission.READ_PHONE_STATE" />
 <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
 <uses-permission android:name="com.android.launcher.permission.READ_SETTINGS" />
 <uses-permission android:name="android.permission.BROADCAST_STICKY" />
 <uses-permission android:name="android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS" />
<!-- 设置环信应用的appkey -->
 <meta-data
 android:name="EASEMOB_APPKEY"
 android:value="easemob-demo#chatdemoui" />
 <!-- 声明sdk所需的service -->
 <service
 android:name="com.hyphenate.chat.EMChatService"
 android:exported="true"
 tools:ignore="ExportedService" />
 <service
 android:name="com.hyphenate.chat.EMJobService"
 android:exported="true"
 android:permission="android.permission.BIND_JOB_SERVICE" />

 <!-- 声明sdk所需的receiver -->
 <receiver android:name="com.hyphenate.chat.EMMonitorReceiver">
 <intent-filter>
 <action android:name="android.intent.action.PACKAGE_REMOVED" />

 <data android:scheme="package" />
 ...
</manifest>
```

:::notice
在创建应用后，获取EASEMOB_APPKEY对应的value
:::


```
   申请 AppKey并进行相关配置，环信Demo中AppKey为easemob-demo#chatdemoui;
```

### 5. 打包混淆

在 app/proguard-rules.pro 文件中添加如下行，防止混淆环信SDK的代码。

```
-keep class com.hyphenate.** {*;}
  -dontwarn  com.hyphenate.**
  //3.6.8版本之后移除apache，无需再添加
  -keep class internal.org.apache.http.entity.** {*;}
  //如果使用了实时音视频功能
  -keep class com.superrtc.** {*;}
  -dontwarn  com.superrtc.**
```

### 6. 初始化SDK

初始化环信SDK，可以参考使用DemoHelper中的init方法，可设置私有部署地址或者是否允许日志输出，调用如下：

```
public void init(Context context) {
    EMOptions options = initChatOptions(context);
        appContext = context;
        //可设置私有服务地址
        options.setRestServer("a.b.c"); 
        options.setIMServer("1.2.3.4");
        options.setImPort(8081);
        EMClient.getInstance().init(context, options);
        //打开日志输出
        EMCallManager manager = EMClient.getInstance().callManager();
    EMClient.getInstance().setDebugMode(true);
}
```

### 7. 音视频功能初始化

**设置会议监听**<br>
DemoHelper还有一个重要的功能就是设置[EMConferenceListener](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html) 进行会议监听，
通过这个监听可以在加入会议的时候获取到已经在会议的流或人员，
调用EMConferenceManager#addConferenceListener(EMConferenceListener listener)方法指定回调监听
成员加入或离开会议，数据流更新等。
:::notice
回调监听中的所有方法运行在子线程中，请勿在其中操作UI
:::

```
EMConferenceListener listener = new EMConferenceListener() {
    @Override public void onMemberJoined(String username) {
        // 有成员加入
    }
                                                            
    @Override public void onMemberExited(String username) {
        // 有成员离开
    }
                                                                
    @Override public void onStreamAdded(EMConferenceStream stream) {
        // 有流加入
    }
                                                                
    @Override public void onStreamRemoved(EMConferenceStream stream) {
        // 有流移除
    }
                                                                
    @Override public void onStreamUpdate(EMConferenceStream stream) {
        // 有流更新
    }
                                                                
    @Override public void onPassiveLeave(int error, String message) {
        // 被动离开
    }
                                                                
    @Override public void onConferenceState(ConferenceState state) {
        // 聊天室状态回调
    }
                                                                
    @Override public void onStreamSetup(String streamId) {
        // 流操作成功回调
    }
                                                                    
    @Override public void onSpeakers(final List<String> speakers) {
        // 当前说话者回调
    }
                                                                    
    @Override public void onReceiveInvite(String confId, String password, String extension) {
        // 收到会议邀请
        if(easeUI.getTopActivity().getClass().getSimpleName().equals("ConferenceActivity")) {
            return;
        }
        Intent conferenceIntent = new Intent(appContext, ConferenceActivity.class);
        conferenceIntent.putExtra(Constant.EXTRA_CONFERENCE_ID, confId);
        conferenceIntent.putExtra(Constant.EXTRA_CONFERENCE_PASS, password);
        conferenceIntent.putExtra(Constant.EXTRA_CONFERENCE_IS_CREATOR, false);
        conferenceIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        appContext.startActivity(conferenceIntent);
    }
    
    // 在Activity#onCreate()中添加监听
    EMClient.getInstance().conferenceManager().addConferenceListener(conferenceListener);
});     
```

### 8. 加入会议

在进行音视频通话前，需要首先登录IM账户，登录过程参见[账号登录](http://docs-im-beta.easemob.com/document/android/overview.html#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95)。<br>
若您还没有IM账户，需要先注册账户，注册过程参见[账号注册](http://docs-im-beta.easemob.com/document/android/overview.html#%E6%B3%A8%E5%86%8C%E7%94%A8%E6%88%B7)。<br>
登录环信ID以后，可以加入会议了，通过 [EMConferenceManager#joinRoom](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8940f54febf2086ccd978d75980c7763) API加入房间。<br>
- 创建会议成功以后，默认超时时间为三分钟，超过三分钟没有人加入，会议会自动销毁；
- 另外当会议中所有人离开2分钟后，会议也会被销毁；

joinRoom api在会议不存在会自动去创建，joinRoom有以下两个接口，请看下面详细介绍（第二个多参的方法可以指定所创建会议的各种属性）

```
/**
     * \~chinese
     * 加入多人音视频加议房间
     * @param room        会议房间名
     * @param password    会议房间密码
     * @param role    当前用户加入时指定角色 (EMConferenceRole类型)
     * @param callback    回调
     */
    public void joinRoom(final String room ,final String password,final EMConferenceRole role, final EMValueCallBack<EMConference> callback)
 
    /**
     * \~chinese
     * 加入多人音视频加议房间
     * @param room        会议房间名
     * @param password    会议房间密码
     * @param roletype    当前用户加入时指定角色 (EMConferenceRole类型)
     * @param param       设置会议参数 (EMRoomConfig类型)
     * @param callback    回调函数
     */
    public void joinRoom(final String room ,final String password,final EMConferenceRole roletype ,final EMRoomConfig param, final EMValueCallBack<EMConference> callback)
     
   有关EMRoomConfig定义如下：
   /**
    * 会议房间属性类
    * confrTyp   会议类型
    * isSupportVxmini  是否支持小程序
    * isRecord    是否支持录制
    * isMergeRecord  是否支持和流
    * nickName  用户昵称
    * ext     用户头像
    * maxTalkerCount   房间最多主播
    * maxVideoCount    房间最多视频流媒体
    * maxAudienceCount 房间最多观众
    * maxPubDesktopCount  房间最多共享桌面流
  */
  public class EMRoomConfig {
       EMConferenceManager.EMConferenceType confrTyp = EMConferenceManager.EMConferenceType.SmallCommunication;
        private boolean isSupportMiniProgram = false;
        private boolean isRecord = false;
        private boolean isMergeRecord = false;
        private String  nickName = null;
        private String  ext = null;
        private int  maxTalkerCount = -1;
        private int  maxVideoCount = -1;
        private int  maxAudienceCount = -1;
        private int  maxPubDesktopCount = -1;
        private EMLiveConfig liveConfig = null;
           
       public EMRoomConfig(EMConferenceManager.EMConferenceType confrTyp,
                               boolean  isSupportMiniProgram,boolean isRecord,
                               boolean  isMergeRecord , String  nickName,
                               String ext, int maxTalkerCount,
                               int maxVideoCount,int maxAudienceCount,
                               int maxPubDesktopCount)
                               {...};
      }
```

### 9. 发布流

展示从DemoHelper类EMConferenceListener中的onStreamAdded回调和onMemberJoined获取到的流和主播列表。<br>
在ConferenceActivity中实现EMConferenceListener，然后直接把 ConferenceActivity 注册监听，可以用以下方法：<br>EMClient.getInstance().conferenceManager().addConferenceListener(this)
这样就可实现 EMConferenceListener 事件的处理，比如主播 **进出房间** **增加流** **移除流** **角色变更** **管理员信息变更**等事件。<br>

进入会议房间以后如果用户角色为主播可以进行发布视频流 ，观众只能订阅视频流，不能发布视频流；<br>
可以调用SDK的publish接口发布流，该接口用到了EMStreamParam参数，你可以自由配置，
比如**是否上传视频** **是否上传音频** **使用前置或后置摄像头** **视频码率** **显示视频页面**等等。<br>
具体实现可以参考中发布订阅视频流的内容，关于以上的代码逻辑如以 如以下：<br>

```
pirvate void pubLocalStream() {   
    EMStreamParam param = new EMStreamParam();
    param.setStreamType(EMConferenceStream.StreamType.NORMAL);
    param.setVideoOff(false);
    param.setAudioOff(false);
    param.setVideoWidth(720);
    param.setVideoHeight(480);     
    EMClient.getInstance().conferenceManager().publish(param, new EMValueCallBack<String>() {
        @Override
        public void onSuccess(String streamId) {
        }
         
        @Override
        public void onError(int error, String errorMsg) {
            EMLog.e(TAG, "publish failed: error=" + error + ", msg=" + errorMsg);
        }
    });
}
```
:::notice
注意：如果是纯音频会议，只需要在发布数据流时将EMStreamParam中的setVideoOff置为true即可，
      共享桌面时候发布的是桌面流 EMConferenceStream.StreamType.DESKTOP  
:::

**设置视频流的参数**

如果用户想对发布的音频或者视频流的参数进行调整，可以使用EMStreamParam中的参数进行设置。 <br>只发布音频流，可以设置关闭视频，
设置视频流的分辨率

```
 normalParam.setVideoOff(true);
 normalParam.setVideoHeight(720);   
 normalParam.setVideoWidth(1280);
```

### 10. 订阅流

成员A成功发布数据流后，会议中其他成员会收到，监听类回调EMConferenceListener#onStreamAdded<br>
如果成员B想看成员A的音视频，可以调用subscribe接口进行订阅

```
@Override
 public void onStreamAdded(final EMConferenceStream stream) {
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            ConferenceMemberView memberView = new ConferenceMemberView(activity);
            // 添加当前view到界面
            callConferenceViewGroup.addView(memberView);
            // 设置当前view的一些状态
            memberView.setUsername(stream.getUsername());
            memberView.setStreamId(stream.getStreamId());
            memberView.setAudioOff(stream.isAudioOff());
            memberView.setVideoOff(stream.isVideoOff());
            memberView.setDesktop(stream.getStreamType() == EMConferenceStream.StreamType.DESKTOP);
                 
            EMClient.getInstance().conferenceManager().subscribe(stream, memberView.getSurfaceView(), new EMValueCallBack<String>() {
                @Override
                public void onSuccess(String value) {
                }
                 
                @Override
                public void onError(int error, String errorMsg) {
                 
                }
            });
        }
    });
}
```

### 11. 退出会议

成员B可以调用EMConferenceManager#exitConference接口离开会议，
会议中的其他成员会收到回调EMConferenceListener#onMemberExited
:::notice
注意：当最后一个成员调用leave接口后，会议会自动销毁
:::
```
EMClient.getInstance().conferenceManager().exitConference()
@Override
 public void onMemberExited(final EMConferenceMember member) {
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            Toast.makeText(activity, member.memberName + " removed conference!", Toast.LENGTH_SHORT).show();
        }
    });
}
```

## 进阶功能

### 会议管理

#### **取日志**

SDK会写入日志文件到本地。日志文件路径如下：sdcard/Android/data/(自己App包名)/(appkey)/core_log/easemob.log；<br>
以Demo为例，通过adb命令获取本地的log：

```
adb pull /sdcard/Android/data/com.hyphenate.chatuidemo/easemob-demo#chatdemoui/core_log/easemob.log
```

#### **创建会议并加入**

SDK还提供了createAndJoinConference接口创建并加入会议。
- A调用该接口后，将拥有一个会议实例Conference，同时A将成为该Conference的成员且角色是Admin；
- 用户创建会议时可以设置参数指定是否支持小程序音视频，是否需要在服务器端录制，录制时是否合并流；
- 通过这个AIP创建会议以后，其他人可以通过joinConference通过会议ID，密码方式加入会议；<br>

createAndJoinConference可以有以下四种方法去创建，请看以下方法详细介绍

```
**方法一：参数(会议类型，会议密码，是否支持小程序，是否录制，是否合流, 回调);**
 
 public void createAndJoinConference(final EMConferenceType type, final String password,
                                     final boolean isSupportMiniProgram,final 
                                     boolean recordOnServer,final boolean mergeStream,
                                     final EMValueCallBack<EMConference> callback)
 EMClient.getInstance().conferenceManager().createAndJoinConference(emConferenceType,
                password, true, false, false, new EMValueCallBack<EMConference>() {
                    @Override
                    public void onSuccess(EMConference value) {
                        // 返回当前会议对象实例 value
                        // 可进行推流等相关操作
                        // 运行在子线程中，勿直接操作UI
                    }
     
                    @Override
                    public void onError(int error, String errorMsg) {
                        // 运行在子线程中，勿直接操作UI
                    }
                });
                 
 
** 方法二：参数(会议类型，会议密码，回调);**
 
 public void createAndJoinConference(final EMConferenceType type, final String password,
                                     final EMValueCallBack<EMConference> callback){}
 EMClient.getInstance().conferenceManager().createAndJoinConference(emConferenceType,
                password, new EMValueCallBack<EMConference>() {
                    @Override
                    public void onSuccess(EMConference value) {
                        // 返回当前会议对象实例 value
                        // 可进行推流等相关操作
                        // 运行在子线程中，勿直接操作UI
                    }
     
                    @Override
                    public void onError(int error, String errorMsg) {
                        // 运行在子线程中，勿直接操作UI
                    }
                });
                   
 **方法三：参数(会议类型，会议密码，是否录制，是否合流, 回调);**
 
 public void createAndJoinConference(final EMConferenceType type, final String password,
                                     final  boolean recordOnServer,final boolean mergeStream,
                                     final EMValueCallBack<EMConference> callback) {};
 EMClient.getInstance().conferenceManager().createAndJoinConference(emConferenceType,
                password, false, false, new EMValueCallBack<EMConference>() {
                    @Override
                    public void onSuccess(EMConference value) {
                        // 返回当前会议对象实例 value
                        // 可进行推流等相关操作
                        // 运行在子线程中，勿直接操作UI
                    }
     
                    @Override
                    public void onError(int error, String errorMsg) {
                        // 运行在子线程中，勿直接操作UI
                    }
                });
                   
 **方法四：参数(会议类型，会议密码，房间信息对象，推流信息, 回调);** 
              
 public void createAndJoinConference(final @NonNull EMConferenceType type, final String password,
                                     final EMRoomConfig roomConfig, final EMStreamParam param,
                                     final EMValueCallBack<EMConference> callback){};
 有关EMRoomConfig定义如下：
   /**
    * 会议房间属性类
    * confrTyp   会议类型
    * isSupportVxmini  是否支持小程序
    * isRecord    是否支持录制
    * isMergeRecord  是否支持和流
    * nickName  用户昵称
    * ext     用户头像
    * maxTalkerCount   房间最多主播
    * maxVideoCount    房间最多视频流媒体
    * maxAudienceCount 房间最多观众
    * maxPubDesktopCount  房间最多共享桌面流
  */
  public class EMRoomConfig {
       EMConferenceManager.EMConferenceType confrTyp = EMConferenceManager.EMConferenceType.SmallCommunication;
        private boolean isSupportMiniProgram = false;
        private boolean isRecord = false;
        private boolean isMergeRecord = false;
        private String  nickName = null;
        private String  ext = null;
        private int  maxTalkerCount = -1;
        private int  maxVideoCount = -1;
        private int  maxAudienceCount = -1;
        private int  maxPubDesktopCount = -1;
        private EMLiveConfig liveConfig = null;
           
       public EMRoomConfig(EMConferenceManager.EMConferenceType confrTyp,
                               boolean  isSupportMiniProgram,boolean isRecord,
                               boolean  isMergeRecord , String  nickName,
                               String ext, int maxTalkerCount,
                               int maxVideoCount,int maxAudienceCount,
                               int maxPubDesktopCount)
                               {...};
      }
EMClient.getInstance().conferenceManager().joinConference(confId,
                password,new EMValueCallBack<EMConference>() {
                    @Override
                    public void onSuccess(EMConference value) {
                        // 返回当前会议对象实例 value
                        // 可进行推流等相关操作
                        // 运行在子线程中，勿直接操作UI
                    }
     
                    @Override
                    public void onError(int error, String errorMsg) {
                        // 运行在子线程中，勿直接操作UI
                    }
                });
```

#### **邀请成员加入会议**

SDK没有提供邀请接口，你可以自己实现，比如使用环信IM通过发消息邀请，比如通过发邮件邀请等等。<br> 
至于需要发送哪些邀请信息，可以参照SDK中的join接口，
目前是需要Conference的confrId和password比如用环信IM发消息邀请，如下所示：

```
final EMMessage message = EMMessage.createTxtSendMessage("邀请你观看直播", to);
message.setAttribute(Constant.EM_CONFERENCE_ID, conference.getConferenceId());
message.setAttribute(Constant.EM_CONFERENCE_PASSWORD, conference.getPassword());
EMClient.getInstance().chatManager().sendMessage(message);
```

#### **管理员销毁会议**

会议中的成员可以调用SDK中的 [EMConferenceManager#destoryConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8d95d4e839a2598d76be85ed69e06244)接口销毁会议，<br>
会议被销毁以后，会议中的其他成员会收到回调[EMConferenceListener#onPassiveLeave](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html)。

```
EMClient.getInstance().conferenceManager().destoryConference()
``` 
:::notice
  注意：只有管理员角色可以调用这个接口，可以在会议中显式调用这个接口，强制结束进行中的会议，会议中其他人在EMConferenceListener#onPassiveLeave回调里收到 error为 -411，message为 reason-conference-dismissed，收到这个以后调EMClient.getInstance().conferenceManager().exitConference() 主动退出会议。
:::
```
EMClient.getInstance().conferenceManager().destroyConference(new EMValueCallBack() {
            @Override
            public void onSuccess(Object value) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(activity, "destroy conference succeed!", Toast.LENGTH_SHORT).show();
                    }
                });
            }

            @Override
            public void onError(int error, String errorMsg) {             
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        Toast.makeText(activity, "destroy conference failed:"+errorMsg, Toast.LENGTH_SHORT).show();
                    }
                });
            }
        });
```

#### **设置会议人数限制**

通过带EMRoomConfig参数的joinRoom接口加入会议的时候 可以设置：**房间最多视频主播数**、**房间最多视频数**、 **房间最多观众**、 **房间最多共享桌面流**等会议信息。<br>
默认设置限制：最多主播是100个，最大视频数是9个，房间最多观众是600个 ，最多共享桌面流2个，如下所示：

```
/**
     * \~chinese
     * 加入多人音视频加议房间
     * @param room        会议房间名
     * @param password    会议房间密码
     * @param roletype    当前用户加入时指定角色 (EMConferenceRole类型)
     * @param param       设置会议参数 (EMRoomConfig类型)
     * @param callback    回调函数
     */
    public void joinRoom(final String room ,final String password,final EMConferenceRole roletype ,final EMRoomConfig param, final EMValueCallBack<EMConference> callback)
     
   有关EMRoomConfig定义如下：
   /**
    * 会议房间属性类
    * confrTyp   会议类型
    * isSupportVxmini  是否支持小程序
    * isRecord    是否支持录制
    * isMergeRecord  是否支持和流
    * nickName  用户昵称
    * ext     用户头像
    * maxTalkerCount   房间最多主播
    * maxVideoCount    房间最多视频流媒体
    * maxAudienceCount 房间最多观众
    * maxPubDesktopCount  房间最多共享桌面流
  */
  public class EMRoomConfig {
       EMConferenceManager.EMConferenceType confrTyp = EMConferenceManager.EMConferenceType.SmallCommunication;
        private boolean isSupportMiniProgram = false;
        private boolean isRecord = false;
        private boolean isMergeRecord = false;
        private String  nickName = null;
        private String  ext = null;
        private int  maxTalkerCount = -1;
        private int  maxVideoCount = -1;
        private int  maxAudienceCount = -1;
        private int  maxPubDesktopCount = -1;
        private EMLiveConfig liveConfig = null;
           
       public EMRoomConfig(EMConferenceManager.EMConferenceType confrTyp,
                               boolean  isSupportMiniProgram,boolean isRecord,
                               boolean  isMergeRecord , String  nickName,
                               String ext, int maxTalkerCount,
                               int maxVideoCount,int maxAudienceCount,
                               int maxPubDesktopCount)
                               {...};
      }
```
:::notice
注意：设置会议人数限制只有是加入会议的第一个设置才有效，也就是会议的创建者。
:::

#### **获取会议信息**

在会议进行中，可以通过getConferenceInfo 方法来查询会议信息，从而可以拿到主播列表、观众人数等信息。

```
/**
     * \~chinese
     * 查询会议信息
     *
     * @param confId   会议id
     * @param password 会议密码
     * @param callback 获取结果
     */
    public void getConferenceInfo(final String confId, final String password,
                                          final EMValueCallBack<EMConference> callback)
                                          
    
    /**
     * 获取主播列表
     */
    public String[] getTalkers() 
    /**
     * 获取观众总数
     */                                     
    public int getAudienceTotal()
```

#### **cdn合流推流**

多人音视频支持将会议中的音视频流合并成一个流，推送到第三方的cdn直播服务器。<br>
整个合流推流过程包括开启cdn推流，更新推流布局，停止推流。

**开启cdn推流**

会议的创建者在创建会议时使用EMRoomConfig的接口，可以决定是否开启cdn推流，推流配置EMLiveConfig是EMRoomConfig的一个参数，可设置cdn推流的相关信息，然后调用 **创建会议接口**，可以开启cdn推流（注意：只有会议创建者才能开启cdn推流，如果会议已经创建好，其他人再调用开启cdn推流无效）。 开启过程如下：

```
EMCDNCanvas canvas = new EMCDNCanvas(ConferenceInfo.CanvasWidth, ConferenceInfo.CanvasHeight, 0,30,900,"H264");
 String url = PreferenceManager.getInstance().getCDNUrl();
 EMLiveConfig liveConfig = new EMLiveConfig(url, canvas);
 roomConfig.setLiveConfig(liveConfig);
 EMClient.getInstance().conferenceManager().joinRoom(currentRoomname, currentPassword, conferenceRole,roomConfig,
                                                     new EMValueCallBack<EMConference>()                                                    
```

当EMCDNCanvas设置的width、height为0时，cdn推流为**纯音频推流**

推流成功后，可以在EMConferenceManager中 getLiveCfgs() 方法可以获取到liveId,liveCfgs存储了所有的推流信息，liveCfgs为一个Map，key为liveId，value为对应的推流Url。

EMLiveConfig可设置的参数如下：

```
/**
 *  \~chinese
 *  CDN 画布设置，创建会议时使用
 *  width (画布 宽)
 *  height(画布 高)
 * 	bgclr (画布 背景色 ,格式为 RGB 定义下的 Hex 值，不要带 # 号，
 * 	       如 0xFFB6C1 表示浅粉色。默认0x000000，黑色)
 *  fps (推流帧率，可设置范围10-30 )
 *  kpbs (推流码率，单位kbps，width和height较大时，码率需要提高，可设置范围1-5000)
 *  codec (推流编码格式，目前只支持"H264")
 *
 *  \~english
 *  The cdn canvas config
 *  width (Canvas width)
 *  height(Canvas height)
 *  bgclr (Canvas background color, Hex value defined by RGB, no #,
 *         such as 0xFFB6C1 means light pink.Default 0x000000, black))
 *  fps （The fps of cdn live，valid valuei is 10-30）
 *  kpbs (The birateBps of cdn live，the unit is kbps,valid value is 1-5000 )
 *  codec (The codec of cdn live，now only support H264)
 */
public class EMCDNCanvas {
    private  int  width = -1;
    private  int  height = -1;
    private  int  bgclr = 0;
    private  int  fps = -1;
    private  int  kpbs = -1;
    private  String  codec = null;

    public EMCDNCanvas(){

    }
    public EMCDNCanvas(int width, int height, int bgclr,int fps,int kpbs,String codec){
        this.width = width;
        this.height = height;
        this.bgclr = bgclr;
        this.fps = fps;
        this.kpbs = kpbs;
        this.codec  = codec;
    } 
}

/**
 \~chinese
 *  音频录制的配置信息
 *  bps        音频比特率，类型为 EMAudioBpsType枚举；
 *  channels   音频通道数,可选(1,2)，类型为ChannelsType枚举；
 *  samples    音频采样率，类型为 EMAudioSamplesType枚举；
 *
 *
 *  \~english
 *  The config of audio record.
 *  bps       audio bit rate,  type is EMAudioBpsType enum；
 *  channels  number of audio channels, optional (1,2), type is ChannelsType enum;
 *  samples   audio sampling rate, type is EMAudioSamplesType enum;
 *
 */

public class EMAudioConfig {
    EMAudioBpsType bps = EMAudioBpsType.BPS_64K;
    ChannelsType channels = ChannelsType.DUAL;
    EMAudioSamplesType samples = EMAudioSamplesType.SAMPLES_16K;

    public enum ChannelsType{
        SINGLE,  //单声道
        DUAL    //双声道
    }

    public EMAudioConfig(EMAudioBpsType bps, ChannelsType channels,EMAudioSamplesType samples){
        this.bps = bps;
        this.channels = channels;
        this.samples = samples;
    }
 }

/**
 *  \~Chinese
 *  CDN推流设置
 *  cdnurl     cdn推流地址
 *  cdnCanvas  画布设置 （cdnCanvas可以缺省）
 *  record     设置是否录制推往CDN的流
 *  audioConfig  设置音频录制的配置信息
 *  liveLayoutStyle 设置CDN推流使用的画布类型
 *
 *  \~English
 *  The CDN push stream config
 *  cdnurl      cdn push stream address
 *  cdnCanvas   canvas settings (cdnCanvas can be default)
 *  record      whether to enable the recording push network CDN to remain
 *  audioConfig   set the audio recording configuration information
 *  liveLayoutStyle  sets the canvas type used by the CDN push stream
 */

public class EMLiveConfig {
    private String cdnurl;
    private EMCDNCanvas cdnCanvas = null;
    private boolean record = false;
    private EMAudioConfig audioConfig = null;

    private EMLiveLayoutStyle liveLayoutStyle = EMLiveLayoutStyle.GRID;

    public EMLiveConfig(){

    }
 }
```

##### **获取cdn推流LiveId**

推流成功后，可以在EMConferenceManager中 getLiveCfgs() 方法可以获取到liveId，liveCfgs存储了所有的推流信息，liveCfgs为一个Map，key为liveId，value为对应的推流Url。

```
/**
     * CDN推流liveID (key为推流liveID,value为推流URL)
     * @return
     */
    public Map<String, String> getLiveCfgs();
```

**更新布局**

当用户调用更新布局接口后，cdn推流方式将强制变成CUSTOM模式，所有流的位置信息都由用户自己定义。 更新布局的接口如下：

```
/**
     * \~chinese
     * CDN 推流更新布局(只有管理员可操作)
     * 用户角色: Admin > Talker > Audience
     * 注意:  更新布局只允许Admin 去操作
     *
     * @param liveId  推流CDN的liveId
     * @param regions EMCanvasRegion布局对象列表
     * @param callback 结果回调
     *
     * \~english
     * CDN pushes to update the layout
     *
     * @param liveId  Push the liveId of CDN
     * @param regions Layout EMCanvasRegion list
     * @param callback Result callback
     */
    public void updateLiveLayout(String liveId ,List<EMLiveRegion> regions , final EMValueCallBack<String> callback){}
```

EMLiveRegion的结构如下：

```
/**
 *  \~Chinese
 *  视频流在画布宽高及显示位置等参数
 *  x         在画布横坐标位置
 *  y         在画布纵坐标位置
 *  width     视频流宽度(64~1280)
 *  height    视频流高度(64~1280)
 *  zorder    视频流zorder层位置(最小值为 0（默认值），表示该区域图像位于最下层
 *                              最大值为 100，表示该区域图像位于最上层)
 *  style     视频流显示方式（fit模式或者fill模式)
 *  streamId  视频流ID
 *
 *
 *  \~English
 *  Video streaming in the canvas width and height and display location and other parameters
 *  x         On the horizontal position of the canvas
 *  y         On the vertical position of the canvas
 *  width     Video stream width
 *  height    Video stream height
 *  zorder    Video stream zorder layer location
 *  style     Video stream display mode (fit mode or fill mode)
 *  streamId  The video stream ID
 */
public class EMLiveRegion {
    private int x;
    private int y;
    private int width;
    private int height;
    private int zorder;
    private EMRegionStyle style;
    private String streamId;

    public EMLiveRegion(){}
    public EMLiveRegion(int x,int y, int width, int height, int zorder, EMRegionStyle style, String streamId){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.zorder = zorder;
        this.style = style;
        this.streamId = streamId;
    }  
    public enum EMRegionStyle {
        FIT, // fit模式
        FILL // fill模式
    }
}
```

使用方法如下：

```
List<EMLiveRegion> regionsList = new LinkedList<>();
EMLiveRegion region = new EMLiveRegion();
region.setStreamId(streamInfo.getStreamId());           
region.setStyle(EMLiveRegion.EMRegionStyle.FILL);
region.setX(80);
region.setY(60);
region.setWidth(320);
region.setHeight(640);
region.setZorder(1);
regionsList.add(region);
Map<String, String> livecfgs = EMClient.getInstance().conferenceManager().getLiveCfgs();
String liveId = null;      
Iterator<String> iter = livecfgs.keySet().iterator();
while(iter.hasNext()) {
       liveId = iter.next();
       break;
}
EMClient.getInstance().conferenceManager().updateLiveLayout(liveId,regionsList,new EMValueCallBack<String>();
```

**多路推流**

多人音视频支持加入会议后，增加一路推流，只有管理员权限可进行次操作。增加一路推流的api方法如下：

```
/**
     * \~chinese
     * 增加CDN多路推流
     * @param liveConfig  CDN推流布局配置
     * @param callback 结果回调
     *
     * \~english
     * Add CDN multiplex push stream
     * @param liveConfig  CDN push stream layout configuration
     * @param callback Result callback
     */
    public void addLiveStream(EMLiveConfig liveConfig , final EMValueCallBack<String> callback){}
```

**自定义录制布局**

在推流的EMLiveConfig设置里，设record为true，可以开启自定义录制，开启后会把推流到cdn的音视频按照推流布局录制下来。如果推流时未开启，也可以在推流后进行开启/停止自定义录制布局操作。开启/停止自定义录制布局的api如下：

```
/**
     * \~chinese
     * 开启或停止录制CDN的流
     * @param liveId  CDN推流 liveID
     * @param enable  是否开启录制，true为开启 false为停止
     * @param callback 结果回调
     *
     * \~english
     * Start or stop recording CDN streams
     * @param liveId  CDN liveID push stream
     * @param enable  Whether recording is on or off, true means false or stop
     * @param callback Result callback
     *
     */
    public void enableRecordLivestream(String liveId, boolean enable, final EMValueCallBack<String> callback){}
```

**停止推流**

多人音视频支持停止向某一个地址的推流，停止推流接口如下：

```
/**
     * \~chinese
     * 停止CDN推流
     * @param liveId  推流CDN的liveId
     * @param callback 结果回调
     *
     * \~english
     *@param liveId  Push the liveId of CDN
     *@param callback Result callback
     * Stop the CDN push
     *
     * @param callback Result callback
     */
    public void stopLiveStream(String liveId, final EMValueCallBack<String> callback)
```

#### **云端录制**

通过带EMRoomConfig参数的joinRoom接口加入会议的时候，可以通过
isRecord(是否支持录制)和isMergeRecord(是否支持和流)这两个参数设置是否开始云端录制和合流，如下所示：

```
/**
     * \~chinese
     * 加入多人音视频加议房间
     * @param room        会议房间名
     * @param password    会议房间密码
     * @param roletype    当前用户加入时指定角色 (EMConferenceRole类型)
     * @param param       设置会议参数 (EMRoomConfig类型)
     * @param callback    回调函数
     */
    public void joinRoom(final String room ,final String password,final EMConferenceRole roletype ,
                         final EMRoomConfig param, final EMValueCallBack<EMConference> callback)
     
   有关EMRoomConfig定义如下：
   /**
    * 会议房间属性类
    * confrTyp   会议类型
    * isSupportVxmini  是否支持小程序
    * isRecord    是否支持录制
    * isMergeRecord  是否支持和流
    * nickName  用户昵称
    * ext     用户头像
    * maxTalkerCount   房间最多主播
    * maxVideoCount    房间最多视频流媒体
    * maxAudienceCount 房间最多观众
    * maxPubDesktopCount  房间最多共享桌面流
  */
  public class EMRoomConfig {
       EMConferenceManager.EMConferenceType confrTyp = EMConferenceManager.EMConferenceType.SmallCommunication;
        private boolean isSupportMiniProgram = false;
        private boolean isRecord = false;
        private boolean isMergeRecord = false;
        private String  nickName = null;
        private String  ext = null;
        private int  maxTalkerCount = -1;
        private int  maxVideoCount = -1;
        private int  maxAudienceCount = -1;
        private int  maxPubDesktopCount = -1;
        private EMLiveConfig liveConfig = null;
           
       public EMRoomConfig(EMConferenceManager.EMConferenceType confrTyp,
                               boolean  isSupportMiniProgram,boolean isRecord,
                               boolean  isMergeRecord , String  nickName,
                               String ext, int maxTalkerCount,
                               int maxVideoCount,int maxAudienceCount,
                               int maxPubDesktopCount)
                               {...};
      }
```
:::notice
注意：设置会议人数限制只有是加入会议的第一个设置才有效，也就是会议的创建者。
:::

#### **设置昵称 头像**

通过带EMRoomConfig参数的joinRoom接口加入会议的时候，可以通过nickName(昵称)和ext(可设置扩展字段比如 用户头像等)这两个参数设置昵称和头像等扩展字段，如下所示：

```
/**
     * \~chinese
     * 加入多人音视频加议房间
     * @param room        会议房间名
     * @param password    会议房间密码
     * @param roletype    当前用户加入时指定角色 (EMConferenceRole类型)
     * @param param       设置会议参数 (EMRoomConfig类型)
     * @param callback    回调函数
     */
    public void joinRoom(final String room ,final String password,final EMConferenceRole roletype ,
                         final EMRoomConfig param, final EMValueCallBack<EMConference> callback)
     
   有关EMRoomConfig定义如下：
   /**
    * 会议房间属性类
    * confrTyp   会议类型
    * isSupportVxmini  是否支持小程序
    * isRecord    是否支持录制
    * isMergeRecord  是否支持和流
    * nickName  用户昵称
    * ext     用户头像
    * maxTalkerCount   房间最多主播
    * maxVideoCount    房间最多视频流媒体
    * maxAudienceCount 房间最多观众
    * maxPubDesktopCount  房间最多共享桌面流
  */
  public class EMRoomConfig {
       EMConferenceManager.EMConferenceType confrTyp = EMConferenceManager.EMConferenceType.SmallCommunication;
        private boolean isSupportMiniProgram = false;
        private boolean isRecord = false;
        private boolean isMergeRecord = false;
        private String  nickName = null;
        private String  ext = null;
        private int  maxTalkerCount = -1;
        private int  maxVideoCount = -1;
        private int  maxAudienceCount = -1;
        private int  maxPubDesktopCount = -1;
        private EMLiveConfig liveConfig = null;
           
       public EMRoomConfig(EMConferenceManager.EMConferenceType confrTyp,
                               boolean  isSupportMiniProgram,boolean isRecord,
                               boolean  isMergeRecord , String  nickName,
                               String ext, int maxTalkerCount,
                               int maxVideoCount,int maxAudienceCount,
                               int maxPubDesktopCount)
                               {...};
      }
```

#### **会议属性**

会议属性是会议的状态信息，由一组（key，value）组成， 会议中的所有角色成员（管理员、主播、观众）都可以 **设置/删除会议频道属性** **设置的会议属性会通知给会议中的所有人** ，设置会议属性的api方法如下：

```
/**
     * \~chinese
     * 设置频道属性,该会议中的所有人(包括自己)都会收到{@link EMConferenceListener#onAttributesUpdated}回调.
     * 该方法需要在加入会议后调用.
     *
     * @param key
     * @param value
     * @param callback
     *
     * \~english
     * Set conference attribute,All members in this conference(include myself) will receive a callback
     * in {@link EMConferenceListener#onAttributesUpdated}.
     * this method can only be used after join a conference.
     *
     * @param key
     * @param value
     * @param callback
     */
    public void setConferenceAttribute(@NonNull String key, @NonNull String value, final EMValueCallBack<Void> callback) {}
```

删除会议属性的api方法如下：

```
/**
     * \~chinese
     * 删除频道属性,该会议中的所有人(包括自己)都会收到{@link EMConferenceListener#onAttributesUpdated}回调.
     * 该方法需要在加入会议后调用.
     *
     * @param key
     * @param callback
     *
     * \~english
     * Delete conference attribute,All members in this conference(include myself) will receive a callback
     * in {@link EMConferenceListener#onAttributesUpdated}.
     * this method can only be used after join a conference.
     *
     * @param key
     * @param callback
     */
    public void deleteConferenceAttribute(@NonNull String key, final EMValueCallBack<Void> callback) {}
```

当会议属性信息改变时，会议中的在EMConferenceListener中的 onAttributesUpdated 回调方法收到通知，如下：

```
public void onAttributesUpdated(EMConferenceAttribute[] attributes) {}
```

每一个EMConferenceAttribute包括了会议属性中的key，value，以及本次修改的action，action包括ADD、UPDATE、DELETE。



#### **私有部署**

私有部署设置方法参见[私有云 Android SDK集成配置](../im/uc_android_private.md)。

### 音视频管理

#### **设置视频流参数**

如果用户想对发布的音频或者视频流的参数进行调整，可以进行一些设置：<br>
用EMStreamParam中的参数进行设置，只发布音频流，可以设置关闭视频；<br>
设置视频流的分辨率 最小码率 最大码率 最大音频码率等，如下所示：

```
//设置分辨率
 normalParam.setVideoOff(true);
 normalParam.setVideoHeight(720);   
 normalParam.setVideoWidth(1280);

//设置最大 最小码率
 normalParam.setMinVideoKbps(200);
 normalParam.setMaxVideoKbps(300);
 normalParam.setMaxAudioKbps(300);
```

**设置流畅度或者清晰度优先**

可以通过以下方法设置视频流畅度优先还是清晰度优先（true 为清晰度优先，false为流畅度优先)。

```
EMClient.getInstance().callManager().getCallOptions().setClarityFirst(true);
```

#### **停止发布流**

成员A可以调用unpublish接口取消自己已经发布的数据流，操作成功后，会议中的其他成员会收到回调<br>`EMConferenceListener#onStreamRemoved(EMConferenceStream stream)`，将对应的数据流信息移除。

```
@Override
public void onStreamRemoved(final EMConferenceStream stream) {
    runOnUiThread(new Runnable() {
        @Override
        public void run() {
            Toast.makeText(activity, stream.getUsername() + " stream removed!", Toast.LENGTH_SHORT).show();
            if (streamList.contains(stream)) {
                removeConferenceView(stream);
            }
        }
    });
}
```

#### **停止订阅流**

成员B如果不想再看成员A的音视频，可以调用SDK接口unsubscribe。

```
EMClient.getInstance().conferenceManager().unsubscribe(emConferenceStream, new EMValueCallBack<String>() {
    @Override
    public void onSuccess(String value) {
    }
    
    @Override
    public void onError(int error, String errorMsg) {
    
    }
});
```

#### **通话中音视频控制**

会议过程中可以做一些音视频进行控制，比如**开启关闭音频**、**视频**、**切换前后摄像头**，
具体API如下所示：

```
// 开启音频传输  
 EMClient.getInstance().conferenceManager().openVoiceTransfer(); 
 // 关闭音频传输  
 EMClient.getInstance().conferenceManager().closeVoiceTransfer();  
 // 开启视频传输  
 EMClient.getInstance().conferenceManager().openVideoTransfer();  
 // 关闭视频传输 
 EMClient.getInstance().conferenceManager().closeVideoTransfer();
```
:::notice
以上这四个方法都是修改 stream，群里其他成员都会收到 EMConferenceListener.onStreamUpdate()回调。
:::
```
// 切换摄像头 
 EMClient.getInstance().conferenceManager().switchCamera();  
 // 设置展示本地画面的 view  
 EMClient.getInstance().conferenceManager().setLocalSurfaceView(localView); 
 // 更新展示本地画面 view 
 EMClient.getInstance().conferenceManager().updateLocalSurfaceView(localView);  
 // 更新展示远端画面的 view  
 EMClient.getInstance().conferenceManager().updateRemoteSurfaceView(streamId, remoteView); 
```

#### **音视频首帧回调**

当成员发布流成功，发送第一帧音视频数据时，会触发EMConferenceListener的以下回调函数。

```
/**
     * \~chinese
     * Pub 首帧回调
     * streamId  流ID
     * frameType    the first frame callback type of the stream
     *
     * \~english
     * Pub first frame callback
     * streamId   streamId
     * frameType    the first frame callback type of the stream
     */
    public void onFirstFrameSent(String stremId,StreamFrameType frameType){}
```

当成员订阅流成功，收到第一帧音视频数据时，会触发EMConferenceListener的以下回调函数。

```
/**
     * \~chinese
     * Sub 首帧回调
     * streamId  流ID
     * frameType    the first frame callback type of the stream
     *
     * \~english
     * Sub first frame callback
     * streamId  streamId
     * state    the first frame callback type of the stream
     *
     */
    public void onFirstFrameRecived(String streamId,StreamFrameType frameType){}
```

#### **音视频无数据回调**

当会议中的成员A因断网或异常退出，而无音视频数据上传时，订阅该流的其他成员会收到EMConferenceListener 中的以下回调通知。

```
/**
     * \~chinese
     * 订阅流的数据状态回调
     * @param streamId  订阅的流ID
     * @param state  流的视频或音频数据状态
     *
     * \~english
     * A data state callback for a subscription stream
     * @param streamId  StreamId
     * @param state  Stream video or audio data status
     */
    default void onStreamStateUpdated(String streamId,StreamState state){};
```

该功能需要会议中开启质量统计

```
/**
     * \~chinese
     * 启用统计
     *
     * @param enable 是否启用统计
     *
     * \~english
     * enable statistics
     * @params enable enable statistics
     */
    public void enableStatistics(boolean enable) {}；
```

#### **弱网监控**

在会议中可以实时获取到自己的网络状态，通过EMConferenceListener中的以下回调通知。

```
@Override
  public void onConferenceState(final ConferenceState state) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
            }
        });
    }
    //有以下状态
     STATE_NORMAL,   // 正常状态
     STATE_DISCONNECTION,   // 连接断开
     STATE_RECONNECTION,    // 重新连接
     STATE_POOR_QUALITY,    // 通话质量差
```

#### **通话质量**

通话过程中可以实时获取到自己或者订阅流的通话信息，比如：**视频宽高**、**丢包率**、**帧率**等等。<br>
具体信息可参考 [EMStreamStatistics](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_statistics.html) 该功能需要会议中开启质量统计，如下面的接口：

```
/**
     * \~chinese
     * 启用统计
     *
     * @param enable 是否启用统计
     *
     * \~english
     * enable statistics
     * @params enable enable statistics
     */
    public void enableStatistics(boolean enable) {}；
```

开启质量统计后，在视频过程中会实时触发EMConferenceListener 中的回调函数 onStreamStatistics。<br>
如下所示，从而可以获取到每路流的质量统计信息：

```
@Override
    public void onStreamStatistics(EMStreamStatistics statistics) {
        EMLog.e(TAG,  "Encode Resolution: " + statistics.getLocalEncodedWidth() + "  " 
        + statistics.getLocalEncodedHeight() + " bps: " +statistics.getLocalVideoActualBps() + 
        "  FPS: " + statistics.getLocalEncodedFps());
    }
```

#### **监听谁在说话**

多人音视频会议可以实时监听谁在说话，该功能需要开启，启动/停止控制如下：

```
//开始监听说话者，参数为间隔时间
 EMClient.getInstance().conferenceManager().startMonitorSpeaker(int interval);
 
 //停止监听说话者
EMClient.getInstance().conferenceManager().stopMonitorSpeaker();
```

有人说话时，会议成员会收到如下回调通知。

```
@Override
public void onSpeakers(final List<String> speakers)(){ }
```

#### **mute远端音视频流**

在视频会议过程中可以 mute订阅的流的音频或者视频，方法如下所示：

```
/**
     * \~chinese
     * mute远端音频
     *
     * \~english
     * Mute remote audio
     *
     * @param mute
     */
    public void muteRemoteAudio(String streamId, boolean mute) {
        mediaManager.muteRemoteAudio(streamId, mute);
    }

    /**
     * ~\chinese
     * mute远端视频
     *
     * \~english
     * Mute remote video
     *
     * @param mute
     */
    public void muteRemoteVideo(String streamId, boolean mute) {
        mediaManager.muteRemoteVideo(streamId, mute);
    }
```

#### **变声/自定义音频**

**开启外边音频输入**

用户使用自定义音频数据时，需要配置外部输入音频数据的开关以及音频采样率，通道数(当前通道数只支持1)，开启方式如下（true 为开启，false为不开启)。

```
EMClient.getInstance().callManager().getCallOptions().setExternalAudioParam(true, 44100,1);
```

**输入音频数据**

音频数据采集可参考Demo中的ExternalAudioInputRecord.java类实现，
音频数据的输入必须在会话接通后开始，否则会导致网络阻塞，影响通话质量。
建议用户将音频数据采集的开始放在**会话接通的回调里**及**callDidAccept回调中**。

```
EMClient.getInstance().conferenceManager().publish(normalParam, new EMValueCallBack<String>() {
            @Override
            public void onSuccess(String value) {

                //如果启动外部音频输入 ，启动音频录制
                if(PreferenceManager.getInstance().isExternalAudioInputResolution()){
                    ExternalAudioInputRecord.getInstance().startRecording();
                }
                ....
 }               
```

音频采集过程参考Demo中的ExternalAudioInputRecord类实现，
音频采集过程开始后，在音频数据采集线程里调用外部输入音频数据接口，具体参考Demo中的实现。

```
EMClient.getInstance().conferenceManager().inputExternalAudioData(byteBuffer.array(), byteBuffer.capacity());
```

**停止音频输入**

会话挂断时，停止音频采集及输入过程：

```
if(PreferenceManager.getInstance().isExternalAudioInputResolution()){
                     ExternalAudioInputRecord.getInstance().stopRecording();
  }
```

#### **美颜/自定义视频**

如果用户需要自己采集特定的数据或者对于数据需要先进行一些处理，可以使用SDK的外部输入数据的方法进行。<br>

例如想要使用美颜等功能，需要用户使用系统的摄像头，
然后启动监听系统设备，获取到数据后进行处理，处理后再调用我们输入数据的api发布出去。<br>

使用自定义视频接口如下：开启外边视频输入，
用户使用自定义视频数据时，需要配置外部输入数据数据的开关（true 为开启，false为不开启)。

```
EMStreamParam normalParam = new EMStreamParam();
normalParam.setUsingExternalSource(true); //设置使用外部视频数据输入
EMClient.getInstance().conferenceManager().publish(normalParam, new EMValueCallBack<String>() {}
```

**输入视频数据**

当需要自己获取视频数据，进行美颜等处理时，循环调用以下方法输入数据。<br>
这个调用频率就相当于你的帧率，调用间隔可以自己进行控制，一般最大30帧/秒），
输入视频数据的方法如下：

```
/**
 *
 * 视频数据的格式是摄像头采集的格式即：NV21 420sp 自己手动传入时需要将自己处理的数据转为 yuv 格式输入
 */
 EMClient.getInstance().conferenceManager().inputExternalVideoData(data, width, height, rotate);
```

#### **视频水印**

在Android系统可以将图片资源设置为视频流的水印。首先将图片资源转换为Bitmap对象，
然后设置WaterMarkOption中的属性，比如**位置**，**分辨率**及**距离边缘的margin**等。

```
try {
    InputStream in = this.getResources().getAssets().open("watermark.png");
    watermarkbitmap = BitmapFactory.decodeStream(in);
} catch (Exception e) {
    e.printStackTrace();
}
watermark = new WaterMarkOption(watermarkbitmap, 75, 25, WaterMarkPosition.TOP_RIGHT, 8, 8);
//设置水印
EMClient.getInstance().conferenceManager().setWaterMark(watermark);
```

#### **共享桌面**

在android 5.0以上系统中，可以使用外部输入视频数据的方法，将采集的桌面图像数据发布出去。 主要方法如下：

```
desktopParam = new EMStreamParam();
desktopParam.setAudioOff(true);
desktopParam.setVideoOff(true);
desktopParam.setStreamType(EMConferenceStream.StreamType.DESKTOP);

public void publishDesktop() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            desktopParam.setShareView(null);
        } else {
            desktopParam.setShareView(activity.getWindow().getDecorView());
        }
        EMClient.getInstance().conferenceManager().publish(desktopParam, new EMValueCallBack<String>() {
            @Override
            public void onSuccess(String value) {
                conference.setPubStreamId(value, EMConferenceStream.StreamType.DESKTOP);
                startScreenCapture();
            }

            @Override
            public void onError(int error, String errorMsg) {

            }
        });
    }
    
    
    private void startScreenCapture() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            if (ScreenCaptureManager.getInstance().state == ScreenCaptureManager.State.IDLE) {
                ScreenCaptureManager.getInstance().init(activity);
                ScreenCaptureManager.getInstance().setScreenCaptureCallback(new ScreenCaptureManager.ScreenCaptureCallback() {
                    @Override
                    public void onBitmap(Bitmap bitmap) {
                        EMClient.getInstance().conferenceManager().inputExternalVideoData(bitmap);
                    }
                });
            }
        }
    }
   
```

具体实现可以参考videocall-android中的ConferenceActivity.java文件

### 角色管理

#### **角色管理**

**申请主播**

会议中的观众角色可以向管理员发申请成为主播，管理员可以选择同意或者拒绝。<br>
观众申请管理员的接口需要管理员的memId，先通过获取会议属性接口获取到管理员的memName，然后根据memName以及成员加入的回调中获取到的EMConferenceMember，获取到memId接口如下：

```
/**
     * \~chinese
     * 发送上麦请求
     *
     * @param memberId 管理员的memberId(只有管理员可处理上麦请求)；
     *
     * \~english
     * Request to be speaker
     *
     * @param  memberId of the admin (only the admin can process the request on the mic);
     */
    public void applyTobeSpeaker(String memberId);
```

观众发出申请后，管理员将会收到以下回调：

```
/**
     * \~chinese
     * 请求上麦通知 (只有管理员能收到)
     *
     * \~english
     * Request On wheat notification
     */
    default void onReqSpeaker(String memId,String memName,String nickName);
```

在回调中，管理员可以选择同意或者拒绝；<br>
- 同意：先调用改变用户权限的接口，然后调用回复接口；
- 拒绝：则直接调用回复接口；

修改用户的权限接口如下：

```
/**
     * \~chinese
     * 用户角色: Admin > Talker > Audience
     * 当角色升级时,用户需要给管理员发送申请,管理通过该接口改变用户接口.
     * 当角色降级时,用户直接调用该接口即可.
     * 注意: 暂时不支持Admin降级自己
     *
     * @param confId   会议id
     * @param member   {@link EMConferenceMember},目前使用memberName进行的操作
     * @param toRole   目标角色，{@link EMConferenceRole}
     * @param callback 结果回调
     *
     * \~english
     * Role: Admin > Talker > Audience
     * When role upgrade, you need to send a request to Admin, only Admin can upgrade a role.
     * When role degrade, you can degrade with this method yourself.
     * Attention: Admin can not degrade self.
     *
     * @param confId   Conference id
     * @param member   {@link EMConferenceMember}
     * @param toRole   Target role，{@link EMConferenceRole}
     * @param callback Result callback
     */
    public void grantRole(final String confId, final EMConferenceMember member, final EMConferenceRole toRole,
                          final EMValueCallBack<String> callback)；
```

回复接口如下：

```
/**
     * \~chinese
     * 管理员处理 上麦请求
     * 注意：只允许Admin 去操作
     *
     * @param memberId  请求者 memberId；
     * @param accept   true 代表同意  false 代表不同意
     *
     * \~english
     * Admin handle to be speak requests
     *
     * @param memberId  requestor memberId；
     * @param accept   true means agree , false means disagree
     * */
    public void handleSpeakerApplication(String memberId, boolean accept);
```

**申请管理员**

会议中的主播角色可以向管理员发申请成为管理员，管理员可以选择同意或者拒绝。<br>
成为管理员后，各管理员之间的权限是相同的，主播申请管理员的接口需要管理员的memId，先通过获取会议属性接口获取到管理员的memName，
然后根据memName以及成员加入的回调中获取到的EMConferenceMember，获取到管理员memId。接口如下：

```
/**
     * \~chinese
     * 发送申请管理员请求
     *
     * @param memberId 管理员的memberId；
     *
     * \~english
     * Request to be admin
     *
     * @param memberId of the admin;
     */
    public void applyTobeAdmin(String memberId);
```

主播发出申请后，管理员将会收到以下回调：

```
/**
     * \~chinese
     * 请求成为管理员通知（只有管理员能收到）
     *
     * \~english
     * Request administrator notification
     */
    default void onReqAdmin(String memId,String memName,String nickName){}
```

在回调中，管理员可以选择同意或者拒绝；<br>
- 同意：先调用改变用户权限的接口，然后调用回复接口；
- 拒绝：则直接调用回复接口。

修改用户的权限接口如下：

```
/**
     * \~chinese
     * 用户角色: Admin > Talker > Audience
     * 当角色升级时,用户需要给管理员发送申请,管理通过该接口改变用户接口.
     * 当角色降级时,用户直接调用该接口即可.
     * 注意: 暂时不支持Admin降级自己
     *
     * @param confId   会议id
     * @param member   {@link EMConferenceMember},目前使用memberName进行的操作
     * @param toRole   目标角色，{@link EMConferenceRole}
     * @param callback 结果回调
     *
     * \~english
     * Role: Admin > Talker > Audience
     * When role upgrade, you need to send a request to Admin, only Admin can upgrade a role.
     * When role degrade, you can degrade with this method yourself.
     * Attention: Admin can not degrade self.
     *
     * @param confId   Conference id
     * @param member   {@link EMConferenceMember}
     * @param toRole   Target role，{@link EMConferenceRole}
     * @param callback Result callback
     */
    public void grantRole(final String confId, final EMConferenceMember member, final EMConferenceRole toRole,
                          final EMValueCallBack<String> callback);
```

回复接口如下：

```
/**
     * \~chinese
     * 管理员处理 申请管理员请求
     * 注意: 只允许Admin 去操作
     *
     * @param memberId  请求者 memberId;
     * @param accept   true 代表同意  false 代表不同意
     *
     * \~english
     * Admin handle to be admin requests
     *
     * @param memberId  requestor memberId;
     * @param accept   true means agree false means disagree
     * */
    public void handleAdminApplication(String memberId, boolean accept);
```

#### **管理员踢人**

管理员可以调用kickMember api强制将成员从会议中移除。

:::notice
只有管理员角色可以调用踢人接口，可以在会议中踢走主播，被踢的主播在EMConferenceListener#onPassiveLeave回调里
收到  error为 -412，message为 reason-beenkicked 。<br>收到这个以后调用 EMClient.getInstance().conferenceManager().
exitConference()主动退出会议。
:::
```
/**
     * \~chinese
     * 踢走会议中存在的主播
     * 用户角色: Admin > Talker > Audience
     * 注意: 踢人只允许Admin 去操作，Admin 不能踢自己
     *
     * @param confId   会议id
     * @param members  移除的主播列表
     * @param callback 结果回调
     *
     * \~english
     * Remove talkers from the Conference
     *
     * @param confId   Conference id
     * @param members  Removed list of talkers
     * @param callback Result callback
     */
    public void kickMember(final String confId, final List<String> members, final EMValueCallBack<String> callback)
```

调用踢人接口，会议中被踢的主播收到回调

```
EMConferenceListener#onPassiveLeave(final int error, final String message)
```

#### **全体静音/管理员指定成员静音**

管理员可以对会议中的指定成员进行静音/解除静音设置，被指定成员可以是主播也可以是管理员。
设置后，被指定成员将静音/解除静音。只有管理员可以调用此接口。
接口API如下：

```
/**
     * \~chinese
     * 发送静音命令
     * 注意: 只允许Admin 去操作
     *
     * @param memberId  memberId  被静音的成员的memberId；
     *
     * \~english
     * Send the mute command
     *
     * @param memberId  MemberId of the member being mute (only admin can sends mute command);
     *
     * */
    public void muteMember(String memberId);
/**
     * \~chinese
     * 发送解除静音命令
     * 注意: 只允许Admin 去操作
     *
     * @param memberId  被取消静音的成员的memberId;
     *
     * \~english
     * Send the unmute command
     *
     * @param memberId  Send the memberId of the member whose unmute command is cancelled;
     *
     *
     * */
    public void unmuteMember(String memberId);
```

管理员调用此接口后，被指定的成员将收到静音状态的回调，回调函数如下

```
/**
     * \~chinese
     * 被静音通知
     *
     * \~english
     * Be muted notification
     */
    default void onMute(String adminId, String memId){};
/**
     * \~chinese
     * 被取消静音通知
     *
     * \~english
     * Be unmuted notification
     */
    default void onUnMute(String adminId, String memId){};
```

#### **本身角色变更回调**

在会议中如果 申请主播或者管理员成功等角色改变，则触发EMConferenceListener中以下角色变更回调，
回调中参数为自己目前的角色

```
@Override
 public void onRoleChanged(EMConferenceManager.EMConferenceRole role) {
        EMLog.i(TAG, "onRoleChanged, role: " + role);
 }
```

#### **管理员变更回调**

在会议中如果其他人新增管理员或者移除管理员，则会触发EMConferenceListener中以下回调函数

```
/**
     * 管理员增加回调
     *
     * @param streamId
     */
    @Override
    public void onAdminAdded(String streamId){
       ...
    }
    
    /**
     * 管理员移除回调
     *
     * @param streamId
     */
    @Override
    public void onAdminRemoved(String streamId) {
     ...
    }
```

## 客户端API

多人视频会议的API包括以下接口

- EMConferenceManager 会议管理单例类
- EMConference 会议实体类
- EMConferenceListener 会议监听类
- EMConferenceMember 会议人员实体类
- EMConferenceStream 会议流实体类
- EMStreamParam 会议流参数类
- EMStreamStatistics 音视频通话统计信息实体类
- EMConferenceAttribute 会议属性实体类
- EMRoomConfig 会议房间属性类
- EMLiveConfig CDN推流设置类
- EMAudioConfig 音频录制的配置信息
- EMCDNCanvas CDN画布设置类
- EMLiveRegion 视频流在画布宽高及显示位置等参数类

### EMConferenceManager

| 方法                                                         | 描述                                             |
| :----------------------------------------------------------- | :----------------------------------------------- |
| [joinRoom](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8940f54febf2086ccd978d75980c7763) | 加入会议房间                                     |
| [createAndJoinConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a420a13e4bc932f7ee98502ee40168d50) | 创建并加入会议                                   |
| isCreator                                                    | 是否为会议创建者                                 |
| [addConferenceListener](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a62bb92e3ae75f9c55a5da4b63471c34b) | 增加会议监听                                     |
| [removeConferenceListener](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a254acf2c8ea56054157baa4bfacb811d) | 移除会议监听                                     |
| [startAudioMixing](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a339fc678b9a22b05e6cd441a6f2c1128) | 开启本地伴音功能                                 |
| [stopAudioMixing](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8940f54febf2086ccd978d75980c7763:~:text=int%20com.hyphenate.chat.EMConferenceManager.stopAudioMixing) | 停止本地伴音功能                                 |
| [adjustAudioMixingVolume](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a0546239a8e45778d59deeb5796770505) | 设置伴奏音量                                     |
| [getConferenceInfo](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a4b76f361f9f94a9aa6a38c1af4dd0a05) | 获取会议信息                                     |
| [joinConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aa04a85ab5f36f3f4ac14dc23ac18afb8) | 加入会议房间                                     |
| [updateLiveLayout](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a08f1d1f058cb40a6bf745dfa4e0ab1e1) | 更新CDN推流布局                                  |
| [stopLiveStream](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a6f154980142e31629ca5786d756f38fa) | 停止CDN推流                                      |
| [addLiveStream](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a1682b222486d14ffd77da06a6c111c88) | 增加CDN旁路推流                                  |
| [stopLiveStream](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a6f154980142e31629ca5786d756f38fa) | 停止CDN推流                                      |
| [enableRecordLivestream](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#abf0e222c3ec094c9dea7ec9c7b89a1a1) | 开启或停止录制CDN的流                            |
| [joinConferenceWithTicket](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aab4ae14065e192f9a1f284443c911149) | 通过Ticket加入会议                               |
| [inviteUserToJoinConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a46185b19b85ee8366c0f22ef36a3e05e) | 邀请其他人加入会议                               |
| [grantRole](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a52a1e73bc4b588bc57227c7a57512409) | 改变会议角色                                     |
| [kickMember](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#af8762ac9fa0fd293f05b4bcf1efbef10) | 会议中踢人                                       |
| [muteAll](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a6f7709002fb62d3279f101e4032954bf) | 设置全体静音                                     |
| [setConferenceAttribute](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a785be01c2f30dbe661fb91c9c8cac7a9) | 设置会议属性                                     |
| [deleteConferenceAttribute](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a5527cfbd5bcb9851eb01bdb8ffd97eaa) | 删除会议属性                                     |
| [destroyConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8d95d4e839a2598d76be85ed69e06244) | 销毁会议                                         |
| [exitConference](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a1b52063a838ac0a89b0c5bd2ef0187ad) | 退出会议                                         |
| [publish](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aa087a548e2d8f79ce06f50927decc137) | 开始推流                                         |
| [unpublish](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a926c631717ce04a6c2a31401c8e095f7) | 停止推流                                         |
| [subscribe](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a405c38df38cbb0e6bf11420ff80540e0) | 订阅流                                           |
| [updateSubscribe](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a084981244bf4840d717a7d49ba472bcb) | 更新订阅流                                       |
| [unsubscribe](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a87f0977b0e7aa91fe5c1b5a6855d311b) | 取消订阅流                                       |
| setWaterMark                                                 | 设置水印                                         |
| clearWaterMark                                               | 取消水印                                         |
| [inputExternalAudioData](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ace04306620a500e1892d6759af9c34f5) | 外部属于音频                                     |
| [inputExternalVideoData](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a606c489f65d2ca02ca8269604b9b5ef4) | 外部视频输入                                     |
| [startMonitorSpeaker](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ade491f1314d5275d8880d0466aa044ed) | 开启正在说话监听器                               |
| [stopMonitorSpeaker](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ac1bd1ff347f4ddcf55395c855bdafc60) | 停止正在说话监听器                               |
| [setLocalSurfaceView](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a9594aa797296a3e7327fadd699f2ac53) | 设置本地视频视图                                 |
| [updateLocalSurfaceView](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a63bd88ed797f3eeb650ac592dc1464b2) | 更新本地视频视图                                 |
| [updateRemoteSurfaceView](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a4e1350c5b350054474ba85c8d29d67d5) | 更新远端视图                                     |
| [switchCamera](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a0be64c2071bb8275a64fe877f31b8648) | 切换前后置摄像头                                 |
| [closeVideoTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#afce9a2bea4d0ee1397d696da5940d9dd) | 停止视频传输                                     |
| [openVideoTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a807cea2439323c341c5111e30e6aac8b) | 恢复视频传输                                     |
| [closeVoiceTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a7b4bd022d9daf8fe127d89494897bf99) | 停止音频传输                                     |
| [openVoiceTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ab140d5e3185760c5dcefabf367385df6) | 恢复音频传输                                     |
| [muteRemoteAudio](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#aa55d14555c59930263659b1f608e8f18) | mute远端音频                                     |
| [enableStatistics](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8332e86b981056d930dde2965c047274) | 开始会议质量统计                                 |
| [getConferenceMemberList](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ae9183eaa2c0d105d426ddf917aff0fd4) | 获取当前会议成员                                 |
| [getAvailableStreamMap](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a4f0bad698a8c6e0b62d781b8225129a3) | 获取当前会议可订阅Stream                         |
| [getSubscribedStreamMap](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a8332e86b981056d930dde2965c047274) | 获取当前会议已订阅 Stream                        |
| [setLocalVideoViewMirror](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#acc62694d0c18068081209f6d987b0db6) | 设置本地视频view镜像                             |
| [setRotation](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ad29c3544ec98b0ac4596d7d9abe35df9) | 设置视频会议中Camera采集到的VideoFrame的rotation |
| [createWhiteboardRoom](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ad386890a370780b0dd4f80a1406a65b7) | 创建白板房间                                     |
| [destroyWhiteboardRoom](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a887013e116d229c48b45ce12177051f4) | 销毁白板房间                                     |
| [joinWhiteboardRoomWithId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a4aaf75f7416029bca4c3dc98bcbb81b9) | 通过白板id加入房间                               |
| [joinWhiteboardRoomWithName](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a39704e3e68b7786261d4de0b3005409f) | 通过白板名称加入房间                             |
| [updateWhiteboardRoomWithRoomId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#ae005fa11c9f9087f6582fff84340f363) | 通过白板id修改白板操作权限                       |
| [applyTobeSpeaker](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a59d53f3c392714f201486d788f38cf07) | 发送上麦请求                                     |
| [handleSpeakerApplication](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#affaa83f9c32e5a99caa7ec0627ddfcb2) | 管理员处理上麦请求                               |
| [applyTobeAdmin](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a5240c7d53051f0d14b27f0a59a2fc945) | 发送申请管理员请求                               |
| [handleAdminApplication](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a5240c7d53051f0d14b27f0a59a2fc945:~:text=hyphenate.chat.EMConferenceManager.-,handleAdminApplication) | 管理员处理申请管理员请求                         |
| [muteMember](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a5176c44768bec0b59578315281dae6ad) | 发送静音命令                                     |
| [unmuteMember](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_manager.html#a5176c44768bec0b59578315281dae6ad:~:text=hyphenate.chat.EMConferenceManager.-,unmuteMember) | 发送解除静音命令                                 |

### EMConference

| 属性                                                         | 描述               |
| :----------------------------------------------------------- | :----------------- |
| [PubStreamId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#adcda2ab5ab431592ef906983c8a9df26) | pub流id            |
| [ConferenceId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#abbc72b5f188a81ce4ca5838e0d978279) | 会议id             |
| [ConferenceType](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#ac4670d3c5bdf52c470bb86153038a781) | 会议类型           |
| [Admins](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#a55d2d906bc8338b457dac33277a196f9) | 会议中的管理员列表 |
| [Talkers](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#a705ffe7f293ec11ec4fe41c431eb9557) | 会议中的主播列表   |
| [RecordOnServer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#ad9d0782589e50a43a7c9ce3f17497994) | 是否开启云端录制   |
| [AudienceTotal](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#af1de8816baeca6f69d49c7d4539740d0) | 会议中的观众人数   |
| [Extension](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference.html#a38a2d557655a55f51f1376a9497d64e4) | 会议扩展信息       |

### EMConferenceListener

| 方法                                                         | 描述                                   |
| :----------------------------------------------------------- | :------------------------------------- |
| [onMemberJoined](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#af1d01093be1c3ba9301a23ca094cbb7a) | 成员加入会议                           |
| [onMemberExited](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#aff81ccb071666c3f06197bedf1ed0f39) | 成员离开会议                           |
| [onStreamAdded](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#ad06a034d00575fbf41798b98bebe6089) | 有新的成员推流                         |
| [onStreamUpdate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a11fd34c44310869dc1b610d8929bdb65) | 有成员更新自己的推流                   |
| [onPassiveLeave](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a1582a269102203e93373853d50ca7a74) | 被动离开会议                           |
| [onAdminAdded](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a544928e7b0fb91b5d86edfc86bad7bfa) | 管理员增加通知                         |
| [onAdminRemoved](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a9cb74ec8dc164d5e8be0ef41db4ed2fa) | 管理员移除通知                         |
| [onApplyAdminRefused](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#af1d01093be1c3ba9301a23ca094cbb7a:~:text=default%20void%20com.hyphenate.EMConferenceListener.onApplyAdminRefused) | 申请管理员失败通知(只有申请管理者收到) |
| [onApplySpeakerRefused](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a995b85e550b2de8c3055a9b1709267a1) | 申请主播失败通知(只有申请管理者收到)   |
| [onPubStreamFailed](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a0208f1a6c8610a1bc89bedfd8c1583bf) | pub 流失败                             |
| [onUpdateStreamFailed](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a63bdfe9b48ff313cd3d4458fd91fc262) | update 流失败                          |
| [onConferenceState](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#af54f319c0388bf4a9f0bbaa118baa4b0) | 会议状态通知回调                       |
| [onStreamStatistics](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#aa1bd09bf1b7532a234e66968c33b7c34) | 统计信息回调                           |
| [onStreamSetup](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#ad27bc75a608abc06c48ddbbbe8449d52) | 推本地流或订阅成员流成功回调           |
| [onStreamStateUpdated](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a3e7bec56a7a6b12da1314911a451871a) | 订阅流的数据状态回调                   |
| [onSpeakers](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a4e9febe04b53b334e5c11b69fbf27749) | 当前说话者回调                         |
| [onReceiveInvite](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a6ff0dfbd9286181dbfd5a5a26b3bc07a) | 收到会议邀请                           |
| [onRoleChanged](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a6df0e567fc534314cee3008c310dfe72) | 当前登录用户角色被管理员改变           |
| [onReqSpeaker](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a316b29cdcf4b6e0b4887ba2ef7a339a3) | 请求成为主播通知                       |
| [onReqAdmin](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a745d99b8f8d7560a67f009cd1c280a4c) | 请求成为管理员通知                     |
| [onMuteAll](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#acc356b01d68a1182a3ff658e1739cc66) | 被全体静音                             |
| [onMute](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#acc356b01d68a1182a3ff658e1739cc66) | 被静音通知                             |
| [onUnMute](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a42ed6aba161a01a7374311047a55e3a7) | 被取消静音通知                         |
| [onGetLivecfg](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a469617faf2cba13273c903875ad6c7a8) | 获取直播推流CDN 信息                   |
| [onGetLocalStreamId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#ae6f40a14bf9b7e198877ba06178fb32b) | 获取自己StreamId                       |
| [onPubDesktopStreamFailed](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a427cf03bbd681f6e5a4c7d8cec24d0ef) | 发布共享桌面流失败回调                 |
| [onFirstFrameSent](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a95313ebf76b573192f91fa586ebc832c) | Pub 首帧回调streamId流ID               |
| [onFirstFrameRecived](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a98e14b220cfa43ff992406cb3a9089e5) | Pub 首帧回调                           |
| [onFirstFrameSent](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_conference_listener.html#a95313ebf76b573192f91fa586ebc832c) | Sub 首帧回调                           |

### EMConferenceMember

| 属性                                                         | 描述             |
| :----------------------------------------------------------- | :--------------- |
| [memberName](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_member.html) | 会议成员Name     |
| [memberId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_member.html) | 会议成员Id       |
| [nickName](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_member.html) | 会议成员昵称     |
| [extension](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_member.html) | 会议成员扩展字段 |

### EMConferenceStream

| 属性                                                         | 描述                     |
| :----------------------------------------------------------- | :----------------------- |
| [StreamId](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a2c05fdc542e7de1fe510c86e5d2ffae7) | 流id                     |
| [StreamName](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a1f138ff27a4550e0660f013ff7a479cc) | 流Name                   |
| [MemberName](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a558e8149e02a2bed7ede363db600f8ca) | 流的所属成员的MemberName |
| [Username](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a851e77d978ef23db876d9f99c59789a8) | 流的所属成员的Username   |
| [Extension](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a243ef8254bd354b6038e0779b9342115) | 流的扩展字段             |
| [VideoOff](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#adf570ce4deafeff59ca289949fd3d48f) | 流视频是否关闭           |
| [AudioOff](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a9de7ca96da69e90ba7c6fb8091938a40) | 流音频是否关闭           |
| [StreamType](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_stream.html#a9de7ca96da69e90ba7c6fb8091938a40) | 流的类型                 |

### EMStreamParam

| 属性                                                         | 描述               |
| :----------------------------------------------------------- | :----------------- |
| [name](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a210fcb233701b4c2e5698b08aa029fe9) | 推流配置名称       |
| [videoOff](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a2cbb57448a013c854f552adf2837d0e6) | 是否关闭视频       |
| [audioOff](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a4e4bc1d46d1c82f324950aea9b0c8a0f) | 是否静音           |
| [useBackCamera](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a682014ca04fe6e692ee0470f3d59d325) | 使用后置摄像头     |
| [videoHeight](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a4d7f3be9c29fe1146160fe81050076e5) | 视频高度           |
| [videoWidth](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#af9e0a4165400cc07113936e976841ace) | 视频宽度           |
| [extension](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a65daa3acf8e0fc0b0e5b684b4265df77) | 扩展字段           |
| [maxAudioKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a337e2c42212282ff188f119e478c885a) | 设置最大音频比特率 |
| [minVideoKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#adb8eb12d1d37b28f9a2216e57aa651d4) | 设置最小的网络带宽 |
| [maxVideoKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a0065046c59c8fda054ad833b8c3cae5a) | 最大视频码率       |
| [streamType](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a1a196f933b8504073732bcb19900699a) | stream 类型        |
| [shareView](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#af6c63073334df4b09fc81a4f5a3b2c8e) | 分享的view         |
| [audioSampleRate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_param.html#a2818857429c256757573eb0ade1084a3) | 设置音频采样频率   |

### EMStreamStatistics

音视频通话统计信息实体类，具体请看[EMStreamStatistics ](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_stream_statistics.html)的详细介绍

### EMConferenceAttribute

会议属性设置类，具体请看[EMConferenceAttribute](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_conference_attribute.html) 的详细介绍

### EMRoomConfig

会议房间属性类 ，具体请看[EMRoomConfig](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_room_config.html) 的详细介绍

### EMLiveConfig

CDN推流设置类，具体请看[EMLiveConfig](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_live_config.html) 的详细介绍

### EMAudioConfig

自定义录制格式定义类，具体请看[EMAudioConfig](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_audio_config.html) 的详细介绍

### EMCDNCanvas

CDN 画布设置类，具体请看[EMCDNCanvas](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_c_d_n_canvas.html) 的详细介绍

### EMLiveRegion

视频流在画布宽高及显示位置等参数类，具体请看[EMLiveRegion](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_live_region.html) 的详细介绍