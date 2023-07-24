# uni-app集成多人音视频通话

## 前言

[uni-app](https://uniapp.dcloud.io/README)是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/QQ/钉钉/淘宝）、快应用等多个平台，uni-app需要使用[hbuilderX](https://www.dcloud.io/hbuilderx.html)进行开发。

环信为用户使用uni-app开发原生应用并拥有音视频功能，特别提供了适配uni-app的音视频SDK和[uni-app原生插件](https://ext.dcloud.net.cn/plugin?id=3507)，用户可以集成后快速在android和ios原生客户端使用音视频功能。

:::notice
目前音视频插件仅支持运行在iOS以及Android，暂不支持运行在微信小程序使用。如需运行到微信小程序我们为此提供了小程序音视频SDK，请移步小程序集成多人音视频文档部分。
:::
使用 uni-app 集成多人音视频SDK，需要下载环信uni-app原生插件**emlive-pusher**、**emlive-player**配合一起使用。音视频SDK依赖IM SDK， 所以要先集成IM，并把IM SDK实例挂载在全局变量下：uni.WebIM = websdk， 可以参考[uni-app demo]() utils/WebIM 文件。

------
  
## 运行demo

下载好[uniapp demo]()后，导入hbuilderX，需要检查manifest.json/原生插件配置中是否选中了插件，否则需要自己选择nativeplugins中的EMLiveplugin插件，然后点击hbuilderX的运行→运行到手机或模拟器→制作自定义调试基座。 此时hbuilderX会进行打包，等打包成功后，点击运行→运行到手机或模拟器→运行基座选择→自定义调试基座，选择好后重新点击运行→运行到手机或模拟器→找到自己的设备 等安装好后，就可以在群组聊天中点击电话的icon，发起多人会议。

------

## uniapp音视频插件

### 导入插件

在[插件市场](https://ext.dcloud.net.cn/plugin?id=3507)下载好插件后，放到uniapp工程的nativeplugins目录下，如果没有此目录需要自己创建。导入好插件后需要在工程目录manifest.json中选择：App原生插件配置/本地插件中选择刚导入的插件[EMLivePlugin(适用平台： Android,IOS)]，最后需要在hbuilderX上选择： 运行→运行到手机或模拟器→制作自定义调试基座，这样插件就导入成功了，下次运行时在运行→运行到手机或模拟器→运行基座选择中选择自定义调试基座。

### 插件参数说明

**emlive-pusher**插件参数说明：

| 属性名称        | 类型        | 描述                                                         |
| :-------------- | :---------- | :----------------------------------------------------------- |
| ref             | string      | 页面根据ref找到该组件                                        |
| style           | string      | 组件样式，参考原生组件支持样式                               |
| muted           | boolean     | 是否静音                                                     |
| enableCamera    | boolean     | 是否打开摄像头                                               |
| devicePosition  | string      | 默认使用摄像头，front为前置，back为后置                      |
| videoWidth      | number      | 视频分辨率宽                                                 |
| videoHeight     | number      | 视频分辨率高                                                 |
| minBitrate      | number      | 最小视频码率                                                 |
| maxBitrate      | number      | 最大视频码率                                                 |
| mirror          | boolean     | 是否镜像，Android独有，iOS没有                               |
| objectFit       | string      | 填充方式，fit和fill                                          |
| isClarityFirst  | boolean     | 是否清晰度优先                                               |
| rtcLogToConsole | boolean     | 是否将Rtc日志输出到控制台                                    |
| bindstatechange | eventhandle | 状态变化事件，detail={code, info}                            |
| bindnetstatus   | eventhandle | 网络状态通知，detail={code, info}                            |
| callbackData    | eventhandle | 数据回调通知，需要将回调出来的数据传给SDK                    |
| callbackStats   | eventhandle | 通话质量统计，detail={data}，data为通话质量数据，包括视频分辨率、码率、丢包率等 |

示例代码：

```
<emlive-player>
    ref="livePlayer" 
    style="width:350px;height:300px" 
    :muted="false" 
    :enable-camera="true" 
    object-fit="fill" 
    :rtcLogToConsole="true" 
    @bindstatechange="onStateChange" 
    @bindnetstatus="onNetStatusChange" 
    @callbackData="onData" 
    @callbackStats="onStats">
</emlive-player>
```

**emlive-player**插件参数说明：

| 属性名称        | 类型        | 描述                                                         |
| :-------------- | :---------- | :----------------------------------------------------------- |
| ref             | string      | 页面根据ref找到该组件                                        |
| style           | string      | 组件样式，参考原生组件支持样式                               |
| muted           | boolean     | 是否静音                                                     |
| enableCamera    | boolean     | 是否打开视频                                                 |
| openSpeaker     | boolean     | 是否打开扬声器                                               |
| objectFit       | string      | 填充方式，fit和fill                                          |
| rtcLogToConsole | boolean     | 是否将Rtc日志输出到控制台                                    |
| bindstatechange | eventhandle | 状态变化事件，detail={code, info}                            |
| bindnetstatus   | eventhandle | 网络状态通知，detail={code, info}                            |
| callbackData    | eventhandle | 数据回调通知，需要将回调出来的数据传给SDK                    |
| callbackStats   | eventhandle | 通话质量统计，detail={data}，data为通话质量数据，包括视频分辨率、码率、丢包率等 |

示例代码：

```
<emlive-player>
    ref="livePlayer" 
    style="width:350px;height:300px" 
    :muted="false" 
    :enable-camera="true" 
    object-fit="fill" 
    :rtcLogToConsole="true" 
    @bindstatechange="onStateChange" 
    @bindnetstatus="onNetStatusChange" 
    @callbackData="onData" 
    @callbackStats="onStats">
</emlive-player>
```

**bindstatechange**回调参数说明：

| code值 | info                              | 描述               |
| :----- | :-------------------------------- | :----------------- |
| 2000   | RTCIceConnectionStateNew          | 建立流媒体链接     |
| 2001   | RTCIceConnectionStateChecking     | 检测流媒体连接状态 |
| 2002   | RTCIceConnectionStateConnected    | 流媒体连接成功     |
| 2003   | RTCIceConnectionStateCompleted    | 流媒体连接过程完成 |
| 2004   | RTCIceConnectionStateFailed       | 流媒体连接失败     |
| 2005   | RTCIceConnectionStateDisconnected | 流媒体断开连接     |
| 2006   | RTCIceConnectionStateClosed       | 流媒体关闭连接     |
| 2102   | receive first audio frame         | 接收到音频首帧     |
| 2102   | receive first audio frame         | 接收到音频首帧     |
| 2103   | receive first video frame         | 接收到视频首帧     |
| 2104   | audio has no data                 | 音频无数据         |
| 2105   | video has no data                 | 视频无数据         |

**bindnetstatus**回调参数说明：

| code值 | info             | 描述       |
| :----- | :--------------- | :--------- |
| 4000   | net connected    | 网络已连接 |
| 4001   | net poor quality | 网络不稳定 |
| 4002   | net disconnected | 网络已断开 |

------

## 音视频SDK集成

uniapp音视频SDK的集成和微信小程序音视频SDK的集成类似，主要分为以下几个步骤：

- 1、引入SDK
- 2、创建会议
- 3、自己加入会议并发出邀请（邀请方式为：发送携带会议信息的邀请信息，可以是文本消息亦可以是自定义消息等方式。）
- 4、发布自己的音视频流
- 5、其他人收到邀请加入会议
- 6、其他人发布音视频流
- 7、监听SDK onMemberJoined、onStreamAdded事件，收到其他人的流之后订阅流
- 8、监听插件 callbackData、bindstatechange事件，将数据传给SDK
- 9、显示画面
- 10、退出会议

------

### 引入SDK

SDK下载地址：

- 通过github[仓库地址]()

音视频SDK在emediaSDK/emedia_for_miniProgram.js

引入：

```
let emedia = uni.emedia = require("./emediaSDK/emedia_for_miniProgram");
    emedia.config({useUniappPlugin: true}) // 设置使用uniapp插件
```

------

### 创建会议

调用createConference创建会议，示例代码：

```
/**
 * @param {number} confrType - 会议类型, 建议使用 10
 * @param {string} password - 会议密码
 * @param {boolean} rec - 是否录制
 * @param {boolean} recMerge 是否合并录制
 */
uni.emedia.mgr.createConference(confrType, password, rec, recMerge).then( (data) => {
    let ticket = data.data.ticket
    let ticketJosn = JSON.parse(ticket)
    let confrId = ticketJosn.confrId
})
```

------

### 加入会议

调用joinConference加入会议，示例代码：

```
/**
 * @param {string} confrId - 会议id
 * @param {string} password - 会议密码
 */
uni.emedia.mgr.joinConference(confrId, password)
```

------

### 发布流

调用publish加入会议，示例代码：

```
/**
 * @param {string} confrId - 会议id
 * @param {object} livePusher - emlivePusher 插件
 */
uni.emedia.mgr.publish(confrId, this.$refs.livePusher)
```

------

### 监听有人加入会议

使用onMemberJoined监听有人加入会议，示例代码：

```
uni.emedia.mgr.onMemberJoined = function(member){
    // member 人员信息
}
```

------

### 监听有媒体流加入

使用onStreamAdded回调监听有媒体流加入，示例代码：

```
uni.emedia.mgr.onStreamAdded = function(stream) {
    // stream 媒体流
}
```

------

### 订阅流

调用subscribe订阅媒体流，示例代码：

```
/**
 * @prama {string} confrId - 会议id
 * @prama {object} stream - 媒体流
 * @prama {object} livePlayer - emlivePlayer 插件
 */
uni.emedia.mgr.subscribe(confrId, stream, this.$refs.livePlayer)
```

------

### 将插件数据传给SDK

将插件callbackData 和 bindstatechange 返回的数据传给SDK，示例代码：

```
<!-- template -->
<emlive-pusher>
    ref="livePusher" 
    objectFit="fill"
    :videoWidth="640"
    :videoHeight="480"
    :muted="muted" 
    :enableCamera="enableCamera" 
    :devicePosition="devicePosition"
    :rtcLogToConsole="true"
    @bindnetstatus="netstatus" 
    @bindstatechange="statechange" 
    @callbackData="onData"
    >
</emlive-pusher>

<emlive-player>
    ref="livePlayer" 
    objectFit="fit" 
    @bindstatechange="playerStateChange"
    @bindnetstatus="playerNetChange"
    :muted="false"
    :enableCamera="true" 
    :openSpeaker="openSpeaker"
    @callbackData="onPlayerData"
    >
</emlive-player>
// script
onData(data){
    uni.emedia.mgr.postMessage(confrId, data, this.$refs.livePusher)
}
onPlayerData(data){
    uni.emedia.mgr.postMessage(confrId, data, this.$refs.livePlayer)
}
statechange(state){
    uni.emedia.mgr.onStateChange(state)
}
```

------

## SDK APIs

### 常量

```
// 会议类型
emedia.mgr.ConfrType = {
   COMMUNICATION: 10, //普通会议模式
   COMMUNICATION_MIX: 11, //大会议模式
   LIVE: 12, //直播模式
};

// 角色
emedia.mgr.Role = {
    ADMIN: 7, //管理员(可推送视频、可解散会议、可踢人、可变更其他人角色，会议创建者默认为管理员)
    TALKER: 3, // 主播（可发言、可观看）
    AUDIENCE: 1 // 观众（仅可以观看）
};
```

### APIs

1、创建会议

```
/**
 * @method createConference 创建会议
 * @param {string} confrType - 会议类型
 * @param {string} password - 会议密码
 * @param {boolean} rec - 是否录制 默认false
 * @param {boolean} recMerge - 是否合并 默认false
 */
emedia.mgr.createConference(confrType, password, rec, recMerge)
```

2、加入会议

```
/**
 * @method joinConference 加入会议
 * @param {string} confrId - 会议id
 * @param {string} password - 会议密码
 */
uni.emedia.mgr.joinConference(confrId, password)
```

3、发布流

```
/**
 * @method publish 发布流
 * @param {string} confrId - 会议id
 * @param {object} livePusher - emlivePusher 插件
 */
uni.emedia.mgr.publish(confrId, this.$refs.livePusher)
```

4、订阅流

```
/**
 * @method publish 订阅流
 * @param {string} confrId - 会议id
 * @param {object} livePusher - emlivePusher 插件
 */
uni.emedia.mgr.subscribe(confrId, stream, this.$refs.livePlayer)
```

5、把插件callbackData返回的数据传给SDK

```
/**
 * @method postMessage 把插件数据传给SDK
 * @param {string} confrId - 会议id
 * @param {object} data - 插件会烦数据
 * @param {object} emlivePlugin - emlivePusher 或者 emlivePlayer
 */
uni.emedia.mgr.postMessage(confrId, data, emlivePlugin)
```

6、将插件bindstatechange返回的数据传给SDK

```
/**
 * @method onStateChange 把插件state数据传给SDK
 * @param {object} state - 插件状态
 */
uni.emedia.mgr.postMessage(state)
```

7、退出会议

```
/**
 * @method exitConference 退出会议
 * @param {string} confrId - 会议id
 */
uni.emedia.mgr.exitConference(confrId)
```

8、解散会议

```
/**
 * @method destroyConference 解散会议
 * @param {string} confrId - 会议id
 */
uni.emedia.mgr.destroyConference(confrId)
```

9、踢人

```
/**
 * @method kickMembersById 解散会议
 * @param {string} confrId - 会议id
 * @param {Array} memberNames 踢出的人
 */
uni.emedia.mgr.kickMembersById(confrId, memberNames)
```

10、改变角色

```
/**
 * @method grantRole 改变角色
 * @param {string} confrId 会议id
 * @param {Array} memberNames 人员
 * @param {string} role 角色
 */
emedia.mgr.grantRole(confrId, memberNames, role)
```

### 回调

1、有人加入会议，已经在会议中的人将会收到回调

```
emedia.mgr.onMemberJoined = function (member) {};
```

2、有人退出会议，已经在会议中的人将会收到回调

```
emedia.mgr.onMemberExited = function (member) {};
```

3、有媒体流加入，如有人推流之后

```
emedia.mgr.onStreamAdded = function (stream) {};
```

4、有媒体流移除，如有人退出之后

```
emedia.mgr.onStreamRemoved = function (stream) {};
```

5、角色改变

```
emedia.mgr.onRoleChanged = function (role) {};
```

6、媒体流发生变化，比如有人关闭摄像头

```
emedia.mgr.onMediaChanaged = function (stream) {};
```

7、会议退出，自己主动退出，服务端主动关闭

```
emedia.mgr.onConferenceExit = function (reason) {};
```

## 温馨提示

1、如何排查问题？

- 将插件的rtcLogToConsole设置为true, 在bindstatechange、callbackData可以查看到相关日志

2、demo基于hbuilderX版本？

- demo基于hbuilderX 2.9.10版本

3、使用插件报错？

- 插件是原生插件，需要在nvue页面里使用（uni-app不容许做成组件使用，只容许作为单独页面使用）