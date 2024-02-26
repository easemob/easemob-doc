# Android集成1对1通话

## 跑通Demo

### 1. 示例代码

- [下载 Android SDK + Demo 代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/easemob-sdk-3.7.6.3.zip)
- [体验Demo](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/app-prod-release.apk) 

或进入环信[客户端下载](common_clientsdk.html#音视频sdk下载)页面，选择Android SDK + Demo下载

### 2. 前提条件

- Android Studio 3.0 或以上版本 
- Android SDK API 等级 19 或以上
- Android 4.4 或以上版本的设备

### 3. 运行Demo

#### 3.1 Demo代码目录简介

![img](@static/images/privitization/android_demo.png)
源码目录如上所示，主要目录如以下介绍：
- widget是有关所有Activity的具体实现
- permission是有关运行是有关动态权限的获取的封装
- untils是有关工具类的封装
- DemoHelper和DemoApplication类是全局单例，用来做一些初始化

#### 3.2 工程设置，SDK导入

选择如下任意一种方式将环信语音SDK集成到你的项目中：

**方法一：使用 JCenter 自动集成**

在项目的 /app/build.gradle 文件中，添加如下行

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
- hyphenatechat_3.7.0.jar 文件 /app/libs/<br>
- arm-v8a 文件夹 /app/src/main/jniLibs/<br>
- armeabi-v7a 文件夹 /app/src/main/jniLibs/<br>
- x86文件夹 /app/src/main/jniLibs/<br>
- x86_64文件夹 /app/src/main/jniLibs/<br>

#### 3.3 运行项目

用Android Studio 运行examples\ChatDemoUI3.0 或者 连接Android 手机，直接运行即可。<br>
需要注意的的是项目build.gradle中的，配置成和自己Android Studio相匹配的 gradle 版本，如下所示

```
dependencies {
    classpath 'com.android.tools.build:gradle:3.2.1'
 }
```

## 快速集成

### 1. 环信后台注册AppKey

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

### 6. 创建UI

根据场景需要，为你的项目创建语音通话的用户界面。若已有界面，可以直接查看导入类；<br>
可以参考 Demo SDK示例项目的 [em_activity_voice_call.xml](https://github.com/easemob/sdkdemoapp3.0_android/blob/sdk3.0/app/src/main/res/layout/em_activity_voice_call.xml) 文件中的代码。

### 7. 初始化SDK

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

### 8. 环信ID注册登录

在进行音视频通话前，需要首先登录IM账户，登录过程参见[账号登录](http://doc.easemob.com/document/android/overview.html#%E7%94%A8%E6%88%B7%E7%99%BB%E5%BD%95)。

若您还没有IM账户，需要先注册账户，注册过程参见[账号注册](http://doc.easemob.com/document/android/overview.html#%E6%B3%A8%E5%86%8C%E7%94%A8%E6%88%B7)

### 9. 音视频功能初始化

账号登录成功后，需要进行音视频通话功能的初始化，设置监听类；<br>
主要有监听呼入通话和监听呼入通话状态；<br>

通过注册相应action的BroadcastReceiver来监听呼叫过来的通话，接到广播后开发者可以调起APP里的通话Activity；<br>
具体调用如下代码所示：

```
protected void setGlobalListeners(){
    IntentFilter callFilter = new IntentFilter(EMClient.getInstance().
                              callManager().getIncomingCallBroadcastAction());
    if(callReceiver == null){
       callReceiver = new CallReceiver();
     }
     appContext.registerReceiver(callReceiver, callFilter); 
 }
 private class CallReceiver extends BroadcastReceiver { 
     @Override 
     public void onReceive(Context context, Intent intent) {
      // 拨打方username String from = intent.getStringExtra("from");
     // call type String type = intent.getStringExtra("type"); //跳转到通话页面
    }
}
```


通过addCallStateChangeListener监听通话状态，在onCreate里面增加这个监听，包括网络连接状态呼入电话状态，听电话状态等都可以在这监听。<br>
:::notice
在收到 DISCONNECTED回调时才能finish当前页面保证通话所占用的资源都释放完，然后开始下一个通话;
:::

调用如下代码所示:

```
void addCallStateListener() {
     callStateListener = new EMCallStateChangeListener() {
     
       @Override
     public void EMCallStateChangeListener(CallState callState, final CallError error) {
              // Message msg = handler.obtainMessage();
              EMLog.d("EMCallManager", "onCallStateChanged:" + callState);
               switch (callState) {
                  case CONNECTING: //正在连接
                       break;
                  case CONNECTED: //已经连接 等等状态                        
               break;
                    .....
              }   
        
     //增加监听
     EMClient.getInstance().callManager().addCallStateChangeListener(callStateListener);
  }
```

### 10. 发起通话请求

当A方给B方进行视频通话时候，A可以调用下面三个方法中的任意一个来发起通话，后边两个是多参的。

```
try {//单参数
   EMClient.getInstance().callManager().makeVideoCall(username);
     } catch (EMServiceNotReadyException e) {
    // TODO Auto-generated catch block
   e.printStackTrace();
    }
  try {//多参数
     EMClient.getInstance().callManager().makeVideoCall(username，"ext 扩展内容");
  } catch (EMServiceNotReadyException e) {
    / / TODO Auto-generated catch block
    e.printStackTrace();
  }
   try {//多参数, recordOnServer:是否在服务器端录制该通话, mergeStream:服务器端录制时是否合并流
     EMClient.getInstance().callManager().makeVideoCall(username，"ext 扩展内容", recordOnServer, mergeStream);
  } catch (EMServiceNotReadyException e) {
    // TODO Auto-generated catch block
     e.printStackTrace();
}
```

### 11. 接听通话

当A方给B方进行视频通话时候，B可以调用下面的方法，去接通视频，B视频电话以后，A会收到上面已经注册好的EMCallStateChangeListener回调里边的 ACCEPTED 状态，表示B已经接通视频。

```
try {
EMClient.getInstance().callManager().answerCall();
} catch (EMNoActiveCallException e) {
// TODO Auto-generated catch block
e.printStackTrace();
} catch (EMNetworkUnconnectedException e) {
// TODO Auto-generated catch block
e.printStackTrace();
}
```

### 12. 拒绝通话

当A方给B方进行通话时候，B可以调用下面的方法拒绝通话，B拒绝以后，A会收到上面已经注册好的EMCallStateChangeListener 回调里边的 DISCONNECTED 状态，具体原因为 CallError 中的 REJECTED 表示B拒绝视频。

```
try {
 EMClient.getInstance().callManager().rejectCall();
 
} catch (EMNoActiveCallException e) {
 
 // TODO Auto-generated catch block
 
 e.printStackTrace();
 
}
```

### 13. 结束通话

A方给B方进行语音通话时候，通话过程中任意一方可以调用下面的方法去挂断电话，另一方会收到已经注册好的EMCallStateChangeListener回调里边的DISCONNECTED状态，<br>
具体原因为 CallError 中的 ERROR_NONE 表示对方正常挂断电话。

```
EMClient.getInstance().callManager().endCall()；
```

## 进阶功能

### 取日志

SDK会写入日志文件到本地，日志文件路径如下：sdcard/Android/data/(自己App包名)/(appkey)/core_log/easemob.log。<br>
以Demo为例，通过adb命令获取本地的log：

```
adb pull /sdcard/Android/data/com.hyphenate.chatuidemo/easemob-demo#chatdemoui/core_log/easemob.log
```

### 通话中音视频控制

#### 音频管理

在视频通话过程中可以暂停和恢复语音传输，具体方法如下：<br>
A和B通话，当A停止或恢复语音传输时候，B会收到已经注册好的EMCallStateChangeListener回调里边的VOICE_PAUSE或者VOICE_RESUME状态，表示A的音频传输暂停或者恢复，<br>
方法如下所示：

```
暂停音频数据传输：
EMClient.getInstance().callManager().pauseVoiceTransfer()；
恢复音频数据传输：
EMClient.getInstance().callManager().resumeVoiceTransfer()；
```

#### 视频管理

在语音通话过程中可以暂停和恢复视频传输，具体方法如下：<br>
A和B通话，当A停止或恢复视频传输时候，B会收到已经注册好的 EMCallStateChangeListener回调里边的VIDEO_PAUSE 或者 VIDEO_RESUME 状态，表示A的音频传输暂停或者恢复。<br>
方法如下所示：

```
暂停视频数据传输：
EMClient.getInstance().callManager().pauseVideoTransfer();
恢复视频数据传输：
EMClient.getInstance().callManager().resumeVideoTransfer()；
```

#### 切换摄像头

视频通话时如果有前置摄像头，默认使用前置的，提供切换 API 切换到后置或者前置摄像头。

```
EMClient.getInstance().callManager().switchCamera();
```

### 设置通话参数

#### 最大音频码率

通话之前，可以设置通话音频的最大音频码率，设置方法如下
:::notice
设置最大音频比特率，取值范围 6 ~ 510。
:::


```
EMClient.getInstance().callManager().getCallOptions().setMaxAudioKbps(50);
```

#### 设置视频分辨率

可以通过以下方法设置本地视频通话分辨率 默认是(640, 480)，例如设置720P分辨率。

```
EMClient.getInstance().callManager().getCallOptions().setVideoResolution(1280, 720);
```

#### 设置通话最大帧率

可以通过以下方法设置本地通话最大帧率，SDK 最大支持(30)，默认(20)，例如以下设置为25。

```
EMClient.getInstance().callManager().getCallOptions().setMaxVideoFrameRate(25);
```

#### 设置视频比特率

可以通过以下方法设置视频通话最大和最小比特率（可以不设置，SDK会根据手机分辨率和网络情况自动适配），
最大值默认800，最小值默认80

```
EMClient.getInstance().callManager().getCallOptions().setMaxVideoKbps(800);
EMClient.getInstance().callManager().getCallOptions().setMinVideoKbps(80);
```

#### 设置流畅度或者清晰度优先

可以通过以下方法设置视频流畅度优先还是清晰度优先（true 为清晰度优先，false为流畅度优先)。

```
EMClient.getInstance().callManager().getCallOptions().setClarityFirst(true);
```

### 离线推送

**场景描述**：A，B都开启离线推送后，当A呼叫B，而B离线时，B会收到推送消息，点击推送消息可以打开APP，进入通话页面（true推送，false不推送)。<br>
目前小米、魅族、OPPO、VIVO推送的主要实现集成在了环信 IM SDK 中，尽量提供给开发者最简单的集成三方推送的形式。<br>
Google FCM 和华为推送的实现仍在 Demo 层，需要开发者自己集成，详情请参考环信的 Google FCM 和华为的推送集成文档,有个集成， 关于第三方推送集成，大家可以参考:[设置推送](https://docs-im.easemob.com/im/android/push/thirdpartypush)。

```
//开启离线推送
 EMClient.getInstance().callManager().getCallOptions().setIsSendPushIfOffline(true);
```

### 云端录制

呼叫方呼叫时可以指定是否开启服务器录制，如要录制，
使用以下方法呼叫(recordOnServer 是否在服务器端录制该通话 ; mergeStream 服务器端录制时是否合并流)。

```
EMClient.getInstance().callManager().makeVoiceCall(username, "", recordOnServer , mergeStream);
```

### 通话统计数据

通话数据的数据统计功能,
可以从保存的会话callSession中获取到通话的实时码率、帧率、分辨率等数据。

### 弱网监测

语音通话中会实时监测通话网络状态，有变化时通过回调通知应用，
会收到已经注册好的 EMCallStateChangeListener中有关网络状态的回调,有以下几种状态。

```
enum CallState{
   NETWORK_UNSTABLE("network_unstable"),  //网络不稳定，丢包率较高的场景下提示
   NETWORK_NORMAL("network_normal"), //网络正常
   NETWORK_DISCONNECTED("network_disconnected"); //对方的视频流断开，一般是断网或者app被kill等
}；
enum CallError{
   ERROR_TRANSPORT("error_transport"),
   ERROR_UNAVAILABLE("error_unavailable"),
   ERROR_NO_DATA("error_no_data"),//传输无数据
}；
```

### 本地视频镜像显示

设置本地view预览是否开启镜像显示，前置摄像头默认为开启镜像。

```
EMClient.getInstance().callManager().getCallOptions().setLocalVideoViewMirror(EMMirror.OFF);
```

### 变声/自定义音频

#### 开启外边音频输入

用户使用自定义音频数据时，需要配置外部输入音频数据的开关，以及音频采样率，通道数(当前通道数只支持1)，开启方式如下（true 为开启，false为不开启)。

```
EMClient.getInstance().callManager().getCallOptions().setExternalAudioParam(true, 44100,1);
```

#### 输入音频数据

音频数据采集可参考Demo中的ExternalAudioInputRecord.java类实现，音频数据的输入必须在会话接通后开始，否则会导致网络阻塞，影响通话质量。<br>
建议用户将音频数据采集的开始放在会话接通的回调及callDidAccept回调中。

```
callStateListener = new EMCallStateChangeListener() {
 
       @Override
       public void onCallStateChanged(CallState callState, final CallError error) {
          case ACCEPTED:
               //启动外部音频输入
               if(PreferenceManager.getInstance().isExternalAudioInputResolution()){
                     ExternalAudioInputRecord.getInstance().startRecording();
               }
               ....
               break;
       }
```

音频采集过程参考Demo中的ExternalAudioInputRecord类实现，音频采集过程开始后，在音频数据采集线程里调用外部输入音频数据接口，具体参考Demo中的实现。

```
EMClient.getInstance().conferenceManager().inputExternalAudioData(byteBuffer.array(), byteBuffer.capacity());
```

#### 停止音频输入

会话挂断时，停止音频采集及输入过程

```
if(PreferenceManager.getInstance().isExternalAudioInputResolution()){
                     ExternalAudioInputRecord.getInstance().stopRecording();
  }
```

### 美颜/自定义视频

如果用户需要自己采集特定的数据或者对于数据需要先进行一些处理，可以使用SDK的外部输入数据的方法进行。<br>
例如：如果想要使用美颜等功能，需要用户使用系统的摄像头，然后启动监听系统设备，获取到数据后进行处理，处理后再调用我们输入数据的api发布出去。<br>
使用自定义视频接口如下：开启外边视频输入；<br>
用户使用自定义视频数据时，需要配置外部输入数据数据的开关（true 为开启，false为不开启)。

```
EMClient.getInstance().callManager().getCallOptions().setEnableExternalVideoData(true);
```

输入视频数据

然后就是自己获取视频数据，进行美颜等处理，循环调用以下方法输入数据就行了，
这个调用频率就相当于你的帧率，调用间隔可以自己进行控制，一般最大30帧/秒）
输入视频数据的方法如下：

```
/**
 *
 * 视频数据的格式是摄像头采集的格式即：NV21 420sp 自己手动传入时需要将自己处理的数据转为 yuv 格式输入
 */
 EMClient.getInstance().callManager().inputExternalVideoData(data, width, height, rotate);
```

### 视频水印

在Android系统可以将图片资源设置为视频流的水印。首先将图片资源转换为Bitmap对象，
然后设置WaterMarkOption中的属性，比如位置，分辨率及距离边缘的margin等。

```
try {
    InputStream in = this.getResources().getAssets().open("watermark.png");
    watermarkbitmap = BitmapFactory.decodeStream(in);
} catch (Exception e) {
    e.printStackTrace();
}
watermark = new WaterMarkOption(watermarkbitmap, 75, 25, WaterMarkPosition.TOP_RIGHT, 8, 8);
//设置水印
EMClient.getInstance().callManager().setWaterMark(watermark);
```


### 私有部署

私有部署设置方法参见[私有云 Android SDK集成配置](../im/uc_android_private.md)。

## 客户端API

1V1音视频通话的API包括以下接口

- EMCallOptions 视频通话配置类
- EMACallManager 视频通话的主要管理类，提供了语音通话的拨打、接听、挂断等接口
- EMCallStateChangeListener 视频通话的监听回调类，实时语音通话相关的回调
- EMCallSession 视频通话的会话实例接口类
- EMVideoCallHelper 视频通话获取通话统计信息类
- EMCallSurfaceView 视频通话UI显示视图类
- EMWaterMarkOption 视频通话水印对象类
- EMWaterMarkPosition 视频通话水印位置设置类

### EMCallOptions

| 方法                                                         | 描述                                          |
| :----------------------------------------------------------- | :-------------------------------------------- |
| [pingInterval](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#adcda2ab5ab431592ef906983c8a9df26) | 心跳时间间隔，单位秒，默认30s，最小10s        |
| [setIsSendPushIfOffline](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a8f99a36fbbb6190a2f911d5e9d8ee331) | 被叫方不在线时，是否开启推送                  |
| [setLocalVideoViewMirror](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a4cb1cfe6a11e21a99eb28df1c660c9da) | 是否开启镜像模式                              |
| [setMaxAudioKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a90b11b4c40bbbc4757287efdb8312ec4) | 最大音频码率                                  |
| [setIsSendPushIfOffline](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a0acf32a7afc578f477a3dbb6272c93ae) | 是否开启外部音频输入                          |
| [setAudioSampleRate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#ae7725792786081e688e785c910f98e03) | 自定义音频数据的采样率，默认48000             |
| [setRotation](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a94d9a6abe6925507eac4451b31c460cf) | 设置视频旋转角度，启动前和视频通话中均可设置  |
| [setEnableExternalVideoData](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#abd8146585edd2f4f38dcfdb8ae50f619) | 是否开启外部输入视频                          |
| [setVideoResolution](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a10ffc50fd622524d2e07def0c9e602f9) | 设置传输视频分辨率                            |
| [setMaxVideoKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a237df350c5e19dbb5f596b6d78e895fb) | 设置最大视频码率                              |
| [setMinVideoKbps](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a7ab32f5b511ee467a727e943a08ff2a9) | 设置最小视频码率                              |
| [setMaxVideoFrameRate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a334a5bfb414903da4b919539eac4dde4) | 设置最大的视频帧率                            |
| [setUse2channelsInput](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a334a5bfb414903da4b919539eac4dde4:~:text=setUse2channelsInput) | 是否开启双声道，当前只支持单通道，必须为false |
| [setClarityFirst](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallOptions.html#a334a5bfb414903da4b919539eac4dde4:~:text=void%20com.hyphenate.chat.EMCallOptions.setClarityFirst) | 设置清晰度还是流畅度优先                      |

### EMACallManager

| 方法                                                         | 描述                                         |
| :----------------------------------------------------------- | :------------------------------------------- |
| [addCallStateChangeListener](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a80b224a48a9019501bc724c5ff65a267) | 增加通话监听                                 |
| [removeCallStateChangeListener](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#ab2023190fb75c661343e0b0b8443ab29) | 移除通话监听                                 |
| [setPushProvider](http://sdkdocs.easemob.com/apidoc/ios/chat3.0/protocol_i_e_m_call_manager-p.html#ab186d489c2779e2984498f79b63432fd) | 添加离线推送回调代理，该代理只能设置一个     |
| [pauseVoiceTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a13470d6e6725c31285f97b4ed0b7217e) | 暂停音频数据传输                             |
| [resumeVoiceTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#ae294c324c0fa3a08e83111c3cb5207b1) | 恢复音频数据传输                             |
| [pauseVideoTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 暂停视频数据传输                             |
| [resumeVideoTransfer](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a4c0c6ba346d7432185d49dc594c5fe72) | 恢复视频数据传输                             |
| [muteRemoteAudio](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19d8c3b170bed1359226861f45be39d9) | mute远端音频                                 |
| [muteRemoteVideo](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#ac0ec72a6bbd6f19f8c78f28df6b0cb20) | mute远端视频                                 |
| [makeVideoCall](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a3e49344c1ff527960e8978f2ba6858db) | 发起视频通话（有多参数方法，可选择是否录制） |
| [makeVoiceCall](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a0dab7508a3592c17c2d3c4023c73c3d3) | 发起语音通话（有多参数方法，可选择是否录制） |
| [setSurfaceView](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a1d49e876527c6e79e25ffe4ee19516f8) | 设置视频通话本地和对端视频显示视图           |
| [isDirectCall](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a866daea70ddec39101b7da293f254eb9) | 当前通话时是否为P2P直连                      |
| [setCameraFacing](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a2982d7b6c6f870568b0fdd2bc6e487c2) | 开启相机拍摄                                 |
| switchCamera                                                 | 切换前后摄像头                               |
| [inputExternalVideoData](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a75c1911842e876ffe2cff7619072e7e1) | 外部输入视频数据（有多参方法）               |
| [inputExternalAudioData](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a1dd9ce23f11e6e7aff53d1e151396368) | 自定义外部音频数据                           |
| setWaterMark                                                 | 通话设置水印                                 |
| [answerCall](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a51fa517af552f757d716c29492a11064) | 接受方同意通话请求                           |
| [endCall](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a1e48d8764d6ffa3b0fc26ea29dca8689) | 结束通话                                     |
| getCallOptions                                               | 获取视频通话配置                             |
| getVideoCallHelper                                           | 获取视频通话统计信息                         |
| getCallState                                                 | 获取当前通话状态                             |
| getCurrentCallSession                                        | 获取当前通话Session                          |

### EMCallStateChangeListener

| CallState 回调状态                                           | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [CONNECTED](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallState.html#a4d71b0fb259693e52a4a5edb27971eb7) | 通话通道建立完成，用户A和用户B都会收到这个回调               |
| [ACCEPTED](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallState.html#a6904d6921621f2f91cb1ac9fecbe871e) | 用户B同意用户A拨打的通话后，用户A和B会收到这个回调           |
| [DISCONNECTED](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallState.html#a9d270eeeddaedf1259c127d0e563f41b) | 用户A或用户B结束通话后 或者 通话出现错误，双方都会收到该回调 |
| [VOICE_PAUSE](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户A和用户B正在通话中，用户A中断音频传输时，用户B会收到该回调 |
| [VOICE_RESUME](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户A和用户B正在通话中，用户A中恢复音频传输时，用户B会收到该回调 |
| [VIDEO_PAUSE](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户A和用户B正在通话中，用户A中断视频传输时，用户B会收到该回调 |
| [VIDEO_RESUME](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户A和用户B正在通话中，用户A中恢复视频传输时，用户B会收到该回调 |
| [NETWORK_UNSTABLE](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户网络状态不可用                                           |
| [NETWORK_NORMAL](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户网络状态正常                                             |
| [NETWORK_DISCONNECTED](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMCallManager.html#a19e6305d014c0cc0f19e94c40cee7c63) | 用户网络状态断开                                             |

| CallError 回调状态                                           | 描述                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------- |
| [ERROR_NONE](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#a05e939dde5b09411416d444918cc46df) | 用户正常挂断或者结束通话                               |
| [ERROR_TRANSPORT](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#a9d445232fbf19ab6b97999ecf3432c0b) | P2P连接失败                                            |
| [ERROR_UNAVAILABLE](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#ad9aa8a289a588b0c4ecea5ceb81bd047) | P2P连接不可用                                          |
| [REJECTED](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#a9b6779b9b6d22aefc61d626b480db2af) | 用户A拨打用户B，用户B拒绝语音通话，用户A会收到这个回调 |
| [ERROR_BUSY](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#aabd50d9ec74067b4a02aa9421239912f) | 用户A拨打用户B，用户B忙线中                            |
| [ERROR_NO_DATA](http://sdkdocs.easemob.com/apidoc/android/chat3.0/enumcom_1_1hyphenate_1_1chat_1_1EMCallStateChangeListener_1_1CallError.html#ac53371aa3c3342b8dab4fea366df51af) | 无音频数据传输状态                                     |

### EMCallPushProvider

| 回调事件                                                     | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [onRemoteOffline](http://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1chat_1_1EMCallManager_1_1EMCallPushProvider.html#a2f7eb2e385bb767d19c523e35541b7b0) | 用户A给用户B拨打实时通话，用户B不在线，并且用户A启用了推送功能,则用户A会收到该回调 |

### EMCallSession

| 方法              | 描述                   |
| :---------------- | :--------------------- |
| getCallId         | 获取会话标识符         |
| getLocalName      | 获取通话本地的username |
| getType           | 获取通话的类型         |
| getIscaller       | 是否为主叫方           |
| getRemoteName     | 获取对方的username     |
| getConnectType    | 连接类型               |
| isRecordOnServer  | 是否启用服务器录制     |
| getServerRecordId | 获取录制ID             |
| getExt            | 获取消息扩展           |

### EMVideoCallHelper

| 方法                                                         | 描述                   |
| :----------------------------------------------------------- | :--------------------- |
| [setPreferMovFormatEnable](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#ae195a239bbdae089eaa88bb55982dd55) | 录制的视频文件的路径   |
| [getVideoLatency](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a433e891df1e8fbb2e8535c744cecba3e) | 视频发送时延           |
| [getVideoFrameRate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#ac83387d292e78d7d9fca7c5a8820385f) | 视频帧率               |
| [getVideoLostRate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a0fff93c903d00dcf03d79410cb68a1bb) | 每一百个包中丢包个数   |
| [getVideoWidth](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a0d5a9060d753f057228b5f1bb17382fd) | 对端视频宽度           |
| [getVideoHeight](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#ac9987c9e7f672feadc600edcc11312d0) | 对端视频高度           |
| [getRemoteBitrate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a9f025b264ccc6adfefd66ec7c278de41) | 接收视频比特率（kbps） |
| [getLocalBitrate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a6c10265ec15af009a0b21017652edc1a) | 发送视频比特率（kbps） |
| [getLocalAudioBitrate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#af76d7ce55e0121872f2d2b62f071ffaf) | 发送音频比特率（kbps)  |
| [getRemoteAudioBitrate](http://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1EMVideoCallHelper.html#a490453dbb94cc50750f654c5dde8b170) | 接收音频比特率 (kbps)  |

### EMWaterMarkOption

| 方法           | 描述                        |
| :------------- | :-------------------------- |
| setMarkImg     | 水印图片资源 (格式为bitmap) |
| setOrientation | 水印位置                    |
| setHeight      | 水印高度                    |
| setWeight      | 水印宽度                    |
| setwMargin     | 距离边缘水平距离            |
| sethMargin     | 距离边缘垂直距离            |

### EMWaterMarkPosition

| 方法         | 描述   |
| :----------- | :----- |
| TOP_LEFT     | 左上角 |
| TOP_RIGHT    | 右上角 |
| BOTTOM_LEFT  | 左下角 |
| BOTTOM_RIGHT | 右下角 |