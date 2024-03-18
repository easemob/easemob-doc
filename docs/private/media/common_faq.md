# 常见问题

## 概述
本文主要列举使用服务时遇到的常见问题，列举如下：

### 业务开通

-  [如何开通音视频云服务](#如何开通音视频云服务)


### 服务集成

-  [网络异常和用户异常退出的处理](#网络异常和用户异常退出的处理)
-  [接受通话邀请方在收到邀请后杀死APP，发起方是否可以收到通知并挂断](#接受通话邀请方在收到邀请后杀死app-发起方是否可以收到通知并挂断)
-  [主叫发起后，被叫未接受。主叫挂断后，被叫的接受页面也需要挂断，如何实现](#主叫发起后-被叫未接受。主叫挂断后-被叫的接受页面也需要挂断-如何实现)
-  [1对1呼叫对方不在线如何推送](#_1对1呼叫对方不在线如何推送)
-  [Web版如何对自己的预览画面镜像](#web版如何对自己的预览画面镜像)
-  [Web版如何等比例显示视频](#web版如何等比例显示视频)
-  [音视频通话内容是否加密](#音视频通话内容是否加密)
-  [美颜实现Demo](#美颜实现demo)



## 详细信息

### 如何开通音视频云服务

-----


开通环信私有化音视频服务，请联系商务经理何先生 (Tel:15910649500) 或者微信 扫一扫，快速添加

![img](@static/images/privitization/deploy_wechat_code.png)

### 网络异常和用户异常退出的处理

-----

关于一对一音视频和多人音视频过程中网络异常等事件的处理，建议如下：

- 本机网络信号不好，会收到SDK发出的回调，APP可以利用此回调展示网络不好的提示。
- 本机如果网络中断，SDK会持续的进行自动重连，并从SDK发出回调。如果不希望一直进行重连，APP在收到此回调后，可以做一个倒计时。如果在一段时间内，都没有重连成功，则APP可以终止此次音视频。
- 会议的一个用户异常离开的情况下，是无法发出leave事件的。这种情况下，参会人员会看到掉线的人的画面是卡住的。服务器有心跳检测，超过超时时间后，服务器会广播onMemberExited事件，在EMConferenceListener中会收到该回调，详见各端文档。

### 接受通话邀请方在收到邀请后杀死APP，发起方是否可以收到通知并挂断

-----

当会议通知发送给对方后，如果对方杀死APP，这个行为和对方收到会话邀请弹屏但不点击接受邀请是没有区别的。发起方无法检测到对方为何不接受会议。所以发起方无法收到通知并挂断。此外，这个和微信的行为是一致的。

### 主叫发起后，被叫未接受。主叫挂断后，被叫的接受页面也需要挂断，如何实现

-----

这个功能需要通过APP自己的应用服务器来实现，需要应用服务器记住当前有哪些人是处于正在加入会议状态，然后主叫挂断后通知给APP自己的业务服务器，业务服务器给这些人发消息告诉他们主叫已经终止会议了。
:::tip
针对利用多人会议实现一对一通话的场景（为了兼容小程序)，因为实质是一对一，所以是知道被邀请方的ID的，直接给对方发个消息就可以实现了。
:::

### 1对1呼叫对方不在线如何推送

-----

推荐使用IM消息提醒对方来电，对方会在通知栏看到来电提醒，点击后可以打开app接收来电。 需要先打开EMCallOption#setIsSendPushIfOffline()中的开关，并实现并注册对方离线的回调。

以Android为例：

```
public interface EMCallPushProvider {
 /**
 * Function is called when remote peer is offline, we want to let remote peer known we are calling. For IOS that's go through APNS, for Android that's will go through GCM, MiPush, HuaweiPush. Condition: Only works when EMOptions's configuration setPushCall to be true.
*/
        void onRemoteOffline(final String to);
    }
    
    EMClient.getInstance().callManager().setPushProvider(pushProvider);
```

### Web版如何对自己的预览画面镜像

-----

设置 video 标签的 css 属性

```
video {
   transform: rotateY(180deg);
}
```
### Web版如何等比例显示视频

-----

可以设置 video 的 css属性 object-fit : fill | contain | cover | none | scale-down, 会输出不同的宽高比

详见 https://developer.mozilla.org/zh-CN/docs/Web/CSS/object-fit

### 音视频通话内容是否加密

-----

通话内容数据是加密的；加密算法使用AES128。

### 美颜实现Demo

-----

如果想集成美颜功能，可以自行集成第三方美颜SDK。下面是基于环信IM Demo 集成相芯美颜SDK的 Demo, 可以参考下。

如果用户需要使用该方案，需要自行申请相芯的证书，代码repo：

https://github.com/Faceunity/FUEaseIMDemoDroid

https://github.com/Faceunity/FUEMiOSDemo