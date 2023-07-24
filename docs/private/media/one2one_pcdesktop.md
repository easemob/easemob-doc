# PC桌面集成1对1通话

------

1v1实时通话允许用户发起、接听、挂断单人的音视频会话，可以在会话过程中进行暂停、恢复，并对会话过程进行监听。

1v1实时通话管理模块为EMCallManager，由EMClient模块加载时主动创建，可以使用EMClient模块的getCallManager方法获取，代码如下

```
var callManager = emclient.getCallManager();
```

## 注册消息回调监听

```
function setCallManagerListener(callManager, listener) {
// 收到会话请求
listener.onRecvCallIncoming((callsession) => {
// 在这里可以选择接通或者拒绝会话
});
// 会话连接上
listener.onRecvCallConnected((callsession) => {
// 会话连接上之后，如果是应答方，需要Answer信息
if(!callsession.getIsCaller())
callManager.sendAnswer(callsession.getCallId());
});
// 会话已接通
listener.onRecvCallAccepted((callsession) => {});
// 会话挂断，reason为挂断原因，0挂掉，1无响应，2拒绝，3忙碌，4失败，5不支持，6离线
listener.onRecvCallEnded((callsession,reason,error) => {});
// 网络状态变化,toStatus状态：0连接，1不稳定，2断开
listener.onRecvCallNetworkStatusChanged((callsession,toStatus) => {});
// 对方会话状态变化，type值：0音频暂停，1音频恢复，2视频暂停，3视频恢复
listener.onRecvCallStateChanged((callsession,type) => {});
}
var managerlistener = new easemob.EMCallManagerListener();
setCallManagerListener(callManager, managerlistener);
// 添加回调监听
callManager.addListener(managerlistener);
//移除回调监听
callManager.removeListener(managerlistener);
```

## 发起音视频会话

用户可以主动发起单人会话，方法如下

```
/**
* 发起音视频会话asyncMakeCall
* @param remoteName Srign，对方用户ID，输入参数
* @param type Number，会话类型，0为音频，1为视频，输入参数
* @param ext String，会话扩展信息，应答方可见
* return {code:{Number},description:{String},data:{EMCallSession}}
*/
let result = callManager.asyncMakeCall(remoteName,type,ext);
```

## 接听音视频会话

接听会话方法一般在收到onRecvCallIncoming后调用，方法如下

```
/**
* 接听音视频会话asyncAnswerCall
* @param callId,String，呼叫方ID，输入参数
*/
callManager.asyncAnswerCall(callId);
```

callId可以通过callsession的getCallId()方法获取。

## 发送Answer消息

发送Answer消息由接听方在会话连接上之后调用，即onRecvCallConnected中调用，只有接听方才需要调用此接口，方法如下

```
/**
* 发送Answer消息
* @param callId,String，呼叫方ID，输入参数
*/
callManager.sendAnswer(callId);
```

## 挂断音视频会话

用户可以在收到会话请求时，直接挂断会话，也可以在通话过程中挂断，调用挂断电话API时，需要传入挂断原因

```
/**
* 接听音视频会话asyncEndCall
* @param callId,String，呼叫方ID，输入参数
* @param reason,Number 结束原因，0挂掉，1无响应，2拒绝，3忙碌，4失败，5不支持，6离线
*/
callManager.asyncEndCall(callId,reason);
```

## 切换语音视频状态

```
/**
* 修改会话类型，切换语音视频状态
* @param {String} callId 呼叫方Id
* @param {Number} controlType 修改后的类型，0语音暂停，1为语音继续，2视频暂停，3视频继续
*/
callManager.updateCal(callId,controlType);
```

## 音视频配置

获取配置

```
let emcallconfigs = callManager.getCallConfigs();
// 呼叫时，若对方不在线，是否发送离线通知
console.log("IsSendPushIfOffline:" + emcallconfigs.getIsSendPushIfOffline());
// 视频宽度
console.log("VideoResolutionWidth:" + emcallconfigs.getVideoResolutionWidth());
// 视频高度
console.log("VideoResolutionHeight:" + emcallconfigs.getVideoResolutionHeight());
// 音视频心跳周期
console.log("PingInterval:" + emcallconfigs.getPingInterval());
```

设置配置

```
// 呼叫时，若对方不在线，是否发送离线通知
emcallconfigs.setIsSendPushIfOffline(true);
// 视频宽度，高度
emcallconfigs.setVideoResolution(640,480);
// 音视频心跳周期
emcallconfigs.setPingInterval(60);
callManager.setCallConfigs(emcallconfigs);
```

## 注册媒体流回调

会话接通后，需要使用音视频控件展示通话的音视频流，音视频流可通过注册回调得到，注册过程在注册消息回调监听时设置一次即可

```
// 处理对方的音视频流，回调函数参数：remoteStream为对方音视频流，type为类型，0音频，1视频
callManager.getRemoteStream((remoteStream,type) => {});
// 处理本地的音视频流，回调函数参数：remoteStream为本地音视频流，type为类型，0音频，1视频
callManager.getLocalStream((localStream,type) => {});
```

## 发送离线通知

设置了若呼叫时，对方处于离线状态，执行的回调。当配置中设置了setIsSendPushIfOffline(true)，该API可以应用。应用方法如下：

```
// 传入回调函数，回调函数的三个参数分别为本地发送方ID，对方ID，呼叫类型(0语音，1视频)
callManager.setSendPushMessage((from,to,type) => {
let textMsgBody = new easemob.EMTextMessageBody(type == 0?"语音请求":"视频请求");
let textMsg = easemob.createSendMessage(from, to, textMsgBody);
let callback = new easemob.EMCallback();

textMsg.setCallback(callback)
emclient.getChatManager().sendMessage(textMsg);
})
```

## 会话控制接口

音视频会话控制模块为EMCallSesssion，呼叫方通过asyncMakeCall返回，接听方通过监听回调的onRecvCallIncoming获取到。通过会话控制模块可以获取到以下会话信息

```
// 获取CallId
console.log(callsession.getCallId());
// 获取本地名称
console.log(callsession.getLocalName());
// 获取会话类型，0音频，1视频
console.log(callsession.getType());
// 获取对方名称
console.log(callsession.getRemoteName());
// 获取是否呼叫方
console.log(callsession.getIsCaller());
// 获取会话状态，0断开，1振铃，2正在连接，3已连接，4已接听
console.log(callsession.getStatus());
// 获取会话详情EMCallSessionStatistics
console.log(callsession.getStatistics());
// 获取会话扩展信息
console.log(callsession.getExt());
// 修改会话状态，0音频暂停，1音频恢复，2视频暂停，3视频恢复
console.log(callsession.update(controltype));
```