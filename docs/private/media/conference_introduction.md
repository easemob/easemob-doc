# 多人通话简介

## 产品概述

- 以会议为单位，支持创建会议，加入会议，发布流，订阅流，退出会议等功能；
- 发布流是指参会者发布媒体流（即发言，包括视频流和音频流）到服务器，其他人收到发布事件然后去订阅拉取媒体流。
- 只依赖即时通讯的用户登录功能，不依赖即时通讯的消息机制，所以和即时通讯功能(例如环信即时通讯云）是松耦合的；
- 本身不支持呼叫邀请功能，开发者可以通过发送自定义即时通讯消息来实现邀请其他人加入会议；
- 纯音频会议最高可以支持千人会议；视频会议支持12个主播视频互动，支持百人以上的观众；

## 功能列表

| 功能           | Android 原生 | iOS 原生 | Web      | 微信小程序 | PC桌面 |
| :------------- | :----------- | :------- | :------- | :--------- | :----- |
| 音频通话       | 支持         | 支持     | 支持     | 支持       | 支持   |
| 视频通话       | 支持         | 支持     | 支持     | 支持       | 支持   |
| 共享桌面       | 支持         | 支持     | 部分支持 | 不支持     | 支持   |
| 静音自己       | 支持         | 支持     | 支持     | 支持       | 支持   |
| 不听他人       | 支持         | 支持     | 支持     | 支持       | 支持   |
| 外部视频源输入 | 支持         | 支持     | 不支持   | 不支持     | 不支持 |
| 管理员踢人     | 支持         | 支持     | 支持     | 支持       | 支持   |
| 管理员全体静音 | 支持         | 支持     | 支持     | 支持       | 支持   |
| 管理员授权上麦 | 支持         | 支持     | 支持     | 支持       | 支持   |
| 观众申请上麦   | 支持         | 支持     | 支持     | 支持       | 支持   |
| 伴音           | 支持         | 支持     | 不支持   | 不支持     | 不支持 |
| 视频流水印     | 支持         | 支持     | 不支持   | 不支持     | 不支持 |
| 开启云录制     | 支持         | 支持     | 支持     | 支持       | 支持   |
| 会议属性       | 支持         | 支持     | 支持     | 支持       | 支持   |
| 合流旁路CDN    | 支持         | 支持     | 支持     | 不支持     | 支持   |

## 通话流程

SDK端创建和操作音视频会议的过程简单来说，可以分为以下几步：

- 设置监听
- create: 创建会议
- join: 加入会议
- pub: 发布音视频数据流
- sub: 订阅并播放音视频数据流
- leave: 离开会议
- destroy：销毁会议

## 角色权限

- 参会用户中有管理员，主播和观众三种角色
  - 管理员（也称作主持人）：拥有最高权限，可以发布媒体流，订阅媒体流，设定其他人是主播还是观众；一个会议中可以有多个管理员；
  - 主播：可以发布媒体流，订阅媒体流
  - 观众：只有订阅媒体流权限
- 会议创建者自动是管理员
- 创建会议时可以指定其他人默认最高权限
  - 如果指定默认其他人最高权限是主播，则其他人可以主播角色加入会议，也可以观众角色加入会议
  - 如果指定默认其他人最高权限是观众，则其他人只能以观众角色加入会议，不能以主播角色加入会议
- 在会议中，管理员可以随时修改某个参会者的最高权限
- 管理员退出会议时，系统会自动指定一名主播为管理员，如果没有主播则不会指定；
- 观众加入会议是静默的，即管理员，主播和其他观众不会收到通知（为了避免通知风暴）

## 会议属性

- 会议属性是一个Key:Value字符串对，Key和Value由开发者自由设置
- 当一个会议属性被修改时，所有人都会收到通知
- 开发者可以使用会议属性来实现更灵活的会议控制，满足各种场景的需求

## 场景应用下载

[>>下载场景应用Demo及源码](common_clientsdk.html#场景demo及源码下载)


<table>
<thead>
<tr>
<td>方案</td><td width="250px">说明</td><td>平台</td><td>下载SDK及Demo</td><td>下载应用</td>
</tr>
</thead>
<tbody>
<tr>
<td rowspan="4">视频会议</td><td rowspan="4">音视频会议可以支持创建会议、加入会议等功能</td><td>Android</td><td><a href="https://github.com/easemob/videocall-android">下载代码</a></td><td><a href="https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/rtcdemo/videocall-android.apk">体验Demo</a></td>
</tr>
<tr>
<td>iOS</td><td><a href="https://github.com/easemob/videocall-ios">下载代码</a></td><td>\</td>
</tr>
<tr>
<td>Web</td><td><a href="https://github.com/easemob/videocall-web">下载代码</a></td><td><a href="https://zim-rtc.easemob.com:12007/">体验Demo</a></td>
</tr>
<tr>
<td>桌面端</td><td><a href="https://github.com/easemob/videocall-web">下载代码</a></td><td><a href="https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/rtcdemo/%E7%8E%AF%E4%BF%A1%E8%A7%86%E9%A2%91%E4%BC%9A%E8%AE%AE.2.0.1.win.setup.exe">体验Windows Demo</a><br><br><a href="https://download-sdk.oss-cn-beijing.aliyuncs.com/mp/rtcdemo/%E7%8E%AF%E4%BF%A1%E8%A7%86%E9%A2%91%E4%BC%9A%E8%AE%AE.2.0.1.mac.dmg">体验MAC Demo</a></td>
</tr>
<!--
<tr>
<td rowspan="3">互动白板</td><td rowspan="3">互动白板可以进行多人实时互动，支持画笔、文本、图形、文档上传等功能</td><td>Android</td><td><a href="https://github.com/easemob/whiteboard_demo_android">下载代码</a></td><td>\</td>
</tr>
<tr>
<td>iOS</td><td><a href="https://github.com/easemob/whiteboard_demo_ios">下载代码</a></td><td>\</td>
</tr>
<tr>
<td>Web</td><td><a href="https://github.com/easemob/whiteboard_demo_web">下载代码</a></td><td>\</td>
</tr>
-->
<!--
<tr>
<td rowspan="2">语音连麦聊天室</td><td rowspan="2">支持创建房间，上下麦，送礼物，声音美声，空间音效，表情图片文字聊天等</td><td>Android</td><td><a href="https://github.com/easemob/liveroom-android">下载代码</a></td><td></td>
</tr>
<tr>
<td>iOS</td><td><a href="https://github.com/easemob/liveroom-ios">下载代码</a></td><td>\</td>
</tr>
-->
</tbody>
</table>

<!--
### “环信视频会议”demo

**Demo 下载**

Demo下载请见： [demo下载](https://www.easemob.com/download/rtc)


**Demo 源码**

我们在 Github 已经提供了一套完整的 Demo，大家可以在 Github 上获取。

- [Android](https://github.com/easemob/videocall-android)

- [iOS](https://github.com/easemob/videocall-ios)

- [Web](https://github.com/easemob/videocall-web)

- [桌面](https://github.com/easemob/videocall-web) （桌面端使用electron打包了web端的代码，跟web端是同一套代码）

在 Demo 的基础上，开发者只需要不到1周的时间，对 UI 和功能做简单修改即可准备测试上线。


**Demo 功能介绍**

“环信视频会议”demo是面向开发者的，以演示基本API调用为目的的demo。而不是用来演示一个视频会议的完整功能以及对应的UI/UE设计。

***创建或加入房间***

在本页面，输入一个不存在的房间号和密码，可以创建新房间

如果输入当前存在的房间号，则加入现有房间

请注意，请选择“以主播身份进入房间”。“以观众身份进入房间”属于环信多人音视频互动直播API的一部分，使用说明请见 [环信多人音视频互动直播集成介绍](http://docs-im.easemob.com/im/other/integrationcases/interactive-broadcast)

![img](https://docs-im.easemob.com/_media/im/other/integrationcases/meeting-demo4.jpeg?w=360&tok=045696)

***音视频会议主界面***

在音视频会议的主界面，演示了以下功能：

- 打开或关闭麦克风。

- 打开或关闭摄像头。切换前后摄像头。

- 查看当前会议室参会人员名单

- 踢人

- 上麦、下麦

- 退出会议室

请注意，“上麦/下麦”属于环信多人音视频互动直播API的一部分，使用说明请见 [环信多人音视频互动直播集成介绍](http://docs-im.easemob.com/im/other/integrationcases/interactive-broadcast)

![img](https://docs-im.easemob.com/_media/im/other/integrationcases/meeting-demo5.jpeg?w=360&tok=cc0510)


### 体验环信即时通讯demo中的音视频会议

环信即时通讯IM demo中也实现了音视频会议功能，您可以下载即时通讯demo对其中的音视频功能进行体验。

**Demo 下载**

Demo下载请见： [下载](https://www.easemob.com/download/im)


**Demo 源码**

Demo源代码请见下载页： [下载](https://www.easemob.com/download/im)

在 Demo 的基础上，开发者只需要不到1周的时间，对 UI 和功能做简单修改即可准备测试上线。


**Demo 功能介绍**

“环信官方demo”演示了一对一音视频，也演示了类似微信群聊的方式发起多人音视频会议。

下载demo后，在联系人tab，点击多人视频，选择普通会议或者混音会议（注：不需要理解这这2种会议的含义。这2种会议模式在新版本API中已经取消了），即可体验。

![img](https://docs-im.easemob.com/_media/im/other/integrationcases/meeting-demo3.png?w=640&tok=e42f8b)

### 互动白板demo

**Demo 下载**

Demo下载请见： [demo下载](https://www.easemob.com/download/rtc)


**Demo 源码**

我们在 Github 已经提供了一套完整的 Demo，大家可以在 Github 上获取。

- [Android](https://github.com/easemob/whiteboard_demo_android)

- [iOS](https://github.com/easemob/whiteboard_demo_ios)

在 Demo 的基础上，开发者可以快速在自己的应用中集成白板功能。


**Demo 功能介绍** 更多关于白板的功能介绍，请参见： [互动白板](whiteboard_introduction.html)
-->
## 计费说明

环信私有化音视频服务计费规则及功能详情，请联系商务经理何先生 (Tel:15910649500) 或者微信 扫一扫，快速添加

![img](@static/images/privitization/deploy_wechat_code.png)