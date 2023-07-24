# Web集成1对1通话

## 跑通Demo

### 1. 示例代码

- [下载 Web SDK + Demo 代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/downloads/webdemo-3.4.2.7.zip)
- [体验Demo](https://zim-rtc.easemob.com:12005/) 

或进入环信[客户端下载](common_clientsdk.html#音视频sdk下载)页面，选择Web SDK + Demo下载

### 2. 前提条件

```
1.安装一款 Easemob Web SDK  支持的浏览器
2.本地安装 node 环境 >= 6.3.0 
```

### 3. 运行 Demo

1. demo 目录结构 webim/demo
2. 进入 webim/demo 文件夹
3. 安装依赖包

```
npm install
```

4. 启动项目

```
HTTPS=true npm start
```

## 快速集成

### 1. 环信后台注册 appkey

在开始集成前，你需要注册环信开发者账号并在后台创建应用，参见[创建应用](../im/uc_configure.html#创建应用) 。

### 2. 创建项目

```
a.可以简单的写一个 html,引入 SDK 测试 
b.或者使用 脚手架搭建一个项目
```

### 3. 引入 SDK

**1v1 需要依赖 IM SDK 进行通信，所以首先需要引入 IM SDK**

#### 3.1 通过 scrpit 标签的 src 引入

```
<script src="../sdk/webimSDK.js"></script> //im SDK
<script src="../sdk/EMedia_x1v1.js"></script>
```

#### 3.2 使用 npm 获取 SDK

```
npm install easemob-websdk --save
npm install easemob-webrtc --save
```

### 4. 初始化 SDK


#### 4.1 引入 sdk

```
import webrtc from 'easemob-webrtc'
```

#### 4.2 初始化 WebRTC Call，用于实现 1v1 音视频通话

```
var rtcCall = new webrtc.Call({
    connection: conn, // WebIM 的链接信息
	mediaStreamConstaints: {
            audio: true,
            video: true
            /**
            * 修改默认摄像头，可以按照以下设置，不支持视频过程中切换
            * video:{ 'facingMode': "user" } 调用前置摄像头
            * video: { facingMode: { exact: "environment" } } 后置
            */
    },

    listener: {
		onAcceptCall: function (from, options) {
			console.log('onAcceptCall::', 'from: ', from, 'options: ', options);
		},
		//通过streamType区分视频流和音频流，streamType: 'VOICE'(音频流)，'VIDEO'(视频流)
		onGotRemoteStream: function (stream, streamType) {
			console.log('onGotRemoteStream::', 'stream: ', stream, 'streamType: ', streamType);
			var video = document.getElementById('video');
			video.srcObject = stream;
		},
		onGotLocalStream: function (stream, streamType) {
			console.log('onGotLocalStream::', 'stream:', stream, 'streamType: ', streamType);
			var video = document.getElementById('localVideo');
			video.srcObject = stream;
		},
		onRinging: function (caller, streamType) {
                        console.log("onRinging", caller)
		},
		onTermCall: function (reason) {
			console.log('onTermCall::');
			console.log('reason:', reason);
		},
		onIceConnectionStateChange: function (iceState) {
			console.log('onIceConnectionStateChange::', 'iceState:', iceState);
		},
        // 通话断网监听
        onNetWorkDisconnect(endType) { // endType: local || remote, 哪一端断网
            console.log('1v1 onNetWorkDisconnect', endType);
        },
        onError: function (e) {
            console.log(e);
        }
     }
});
```

### 5. 视频呼叫

**整个呼叫过程：**

1. 主叫发起呼叫
2. 被叫收到呼叫（主叫被叫分属于两个页面，通过服务器发送消息）
3. 被叫接受呼叫或者拒绝呼叫
4. 主叫收到被叫接受或者拒绝的回调
5. 通话建立成功
6. 一方挂断另一方收到挂断的回调

**config 参数为主动呼叫时的配置参数（该功能主要用作web端对APP端呼叫时使用）**

```
var config = {
        push: true, // 对方(app端)不在线时是否推送
        timeoutTime: 30000, // 超时时间
        txtMsg: 'I gave you a video call.', // 给对方发送的消息
        pushMsg: 'user is calling you' //推送内容
    };
```

#### 5.1 主叫发起呼叫

```
callBtn.onclick = function () {
    rtcCall.caller = 'mengyuanyuan'; // 指定呼叫方名字
    rtcCall.makeVideoCall(callee,null,true,true,config);
};
```

在 rtcCall.makeVideoCall 方法中 注意以下参数的设置

- 第一个参数callee: 被呼叫人名字 必需 string
- 第二个参数 指定传 null 必需 null
- 第三个参数 是否开启录制 非必需 boolean
- 第四个参数 是否开启录制合并 非必需 boolean
- 第五个参数 主动呼叫扩展配置 非必需 object

#### 5.2 被叫方收到呼叫回调

```
// 初始化的函数
var rtcCall = new webrtc.Call({
    ...
    listener: {
		...
		onRinging: function (caller, streamType) {
                   console.log("onRinging", caller)
		},
     }
});
```

#### 5.3 被叫方接受呼叫

```
rtcCall.acceptCall() // 无参数
```

#### 5.4 主叫方收到被叫接受呼叫的回调

```
// 初始化的函数
var rtcCall = new webrtc.Call({
    ...
    listener: {
		...
		onGotLocalStream: function (stream, streamType) {
			// stream：媒体流，streamType：流类型 VIDEO 视频流、VOICE 语音流， 可根据不同的流类型做不同的UI展示
			var video = document.getElementById('localVideo');
			video.srcObject = stream; // 将流设置给 video标签 用于显示
		},
     }
});
```

### 6. 关掉/拒绝通话

```
rtcCall.endCall() // 无参数
```

#### 6.1 收到通话结束的回调

```
// 初始化的函数
var rtcCall = new webrtc.Call({
    ...
    listener: {
		...
		onTermCall: function (reason) {
			
		},
     }
});
```

### 7. 音频通话

```
音频通话步骤与视频通话一致
回调方法共用
只是在回调中的 streamType 不同
结束通话方法相同 
```

#### 7.1 发起音频通话

```
callBtn.onclick = function () {
    rtcCall.caller = 'mengyuanyuan'; // 指定呼叫方名字
    rtcCall.makeVoiceCall('asdfghj',null,true,true,config);
};
```

## 进阶功能

### 取日志

在控制台 调用 WebIM.EMedia.fileReport 方法可下载日志文件

```
WebIM.EMedia.fileReport() // 无参数
```

### 通话中音视频控制

调用 rtcCall.controlStream 方法可以控制 音视频的打开/关闭

```
rtcCall.controlStream(controlType, to)
```

在 rtcCall.controlStream 方法中 注意以下参数的设置

- controlType: 操作类型 **0:打开麦克风；1:关闭麦克风；2:关闭摄像头；3:打开摄像头** ,必需 number
- to: 对方 userId，,必需 string

**对方会收到回调函数**

```
// 对方操作音频的回调 opened: true:打开音频、false:关闭音频
onOtherUserOpenVoice: function (from, opened) { } ,

// 对方操作视频的回调 opened: true:打开视频、false:关闭视频
onOtherUserOpenVideo: function (from, opened) { },
```

### 设置通话参数

可以在初始化 **rtcCall** 的时候，指定 **mediaStreamConstaints** 字段
自定义分辨率、采样率

```
var rtcCall = new webrtc.Call({
      ...
      mediaStreamConstaints: {
            audio: { //音频采样率
                  sampleRate: 44100,
                  sampleSize: 16
            },
            video: { // 视频分辨率 宽度和高度
                  width: {
                    exact: 1280
                  },
                  height: {
                    exact: 720
                  }
            }
      },
},
```

### 离线推送

在进行视频或者音频呼叫的时候，可指定是否推送消息

```
var config = {
    push: true, // 对方(app端)不在线时是否推送
    ...
};
callBtn.onclick = function () {
    rtcCall.caller = 'mengyuanyuan'; // 指定呼叫方名字
    rtcCall.makeVideoCall(callee,null,true,true,config);
};
```

### 云端录制

在进行视频或者音频呼叫的时候，可指定是否录制和录制合并

```
var option = {
  callee: //被叫者，
  rec: //是否开启录制，
  recMerge: //是否开启录制合并，
  config: //其他配置参数
}
callBtn.onclick = function () {
    rtcCall.caller = 'mengyuanyuan'; // 指定呼叫方名字
    rtcCall.makeVideoCall(option.callee,null,option.rec,option.recMerge,option.config);
};
```

### 断网检测

**在通话进行前指定监听函数 onNetWorkDisconnect**

```
var rtcCall = new webrtc.Call({
      ...
      listener: {
        ...
        onNetWorkDisconnect(endType) { // endType: local || remote, 哪一端断网
            console.log('1v1 onNetWorkDisconnect', endType);
        },
      }
})
```


### 私有部署

私有部署设置方法参见[私有云sdk集成配置](../im/uc_Web_private.md)。

## 客户端API

1V1音视频通话的API包括以下接口

- option 创建通话类的参数配置
- makeVideoCall 发起视频呼叫
- makeVoiceCall 发起音频呼叫

| 方法                                                         |                |
| :----------------------------------------------------------- | -------------- |
| [option](http://webim-h5.easemob.com/webrtc/jsdoc/out/-_Call.html) | 创建类时的配置 |
| [makeVideoCall](http://webim-h5.easemob.com/webrtc/jsdoc/out/global.html#makeVideoCall) | 发起视频通话   |
| [makeVoiceCall](http://webim-h5.easemob.com/webrtc/jsdoc/out/global.html#makeVoiceCall) | 发起音频通话   |