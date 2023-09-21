# 视频会议场景方案介绍

## 概述

环信音视频能力有几种典型的应用模式，包括：一对一音视频、多人音视频会议、多人音视频互动直播。

![img](@static/images/privitization/em-rtcsdk-scenarios.png)

多人音视频会议的典型场景包括企业多人视频会议、移动协同办公、远程医疗会诊、会诊模式的视频客服等。

## 典型需求

多人视频会议场景的典型功能需求包括：

- 多人音频通话
- 多人视频通话
- 共享桌面
- 外部视频源输入
- 美颜
- 服务器端录制及下载
- 即时沟通：在使用多人会议时，也可以通过集成环信即时通讯实现IM沟通，如发文字、图片、语音片段、各种自定义消息等）
- 视频流水印
- 会议室的管理：创建会议、删除会议、获取指定会议室详情、加入会议室、退出会议室
- 会议室的人员管理：获取会议室参会人名列表、踢人，设置观众为主播，设置主播为观众等
- 多端支持：Android、iOS、Web、PC、小程序
<!--- 互动白板 -->
:::notice
在多人视频会议场景下用到的某些功能需要在特定的浏览器、版本或插件下才能使用。<br>所以为了简化用户体验，不推荐直接使用浏览器，**建议引导用户使用本地应用（如PC端应用）**。

:::
## 实现方案

1. 多人视频会议开发的入口文档是：[多人通话简介](conference_introduction)，这个文档包含了以下部分：

- 功能列表：各端功能清单
- 通话流程：通话流程描述
- 角色权限：会议室的角色权限说明
- 客户端SDK及demo源码：开发者可以先下载demo，体验demo中的一对一音视频功能。如有需要，还可以查看demo的源代码。
- 计费说明


2. 多人视频会议如果需要环信即时通讯云的文字聊天室实现IM沟通功能，请详见文档：

服务器端：[服务端集成](/document/v2/server-side/overview.html)

Android：[Android SDK 介绍及导入](/document/v2/android/quickstart.html)

iOS：[iOS SDK 快速集成](/document/v2/ios/quickstart.html)

web端： [Web IM 介绍](/document/v2/web/quickstart.html)

微信小程序： [微信小程序SDK简介](/document/v2/applet/wechat.html)

PC端： [桌面端集成说明](https://docs-im.easemob.com/im/pc/intro/integration)


<!--3. 如果需要互动白板高级功能，请详见文档：

[互动白板简介](whiteboard_introduction)

[Android集成](whiteboard_android)

[iOS集成](whiteboard_ios)

[Web集成](whiteboard_web)

[微信小程序集成](whiteboard_vxmini)

[PC桌面集成](whiteboard_pcdesktop)-->

## 客户端应用源码

“环信视频会议”Demo主要面向开发者，用于演示如何通过调用音视频API实现视频会议基础功能，如需打造产品级别应用，要按自身项目需求完成UI/UE设计。

### Demo 下载

Demo下载地址请见： [demo下载](common_clientsdk#场景demo及源码下载)

### Demo 源码

我们在 Github 提供了完整的 Demo源代码，大家可以在 Github 上获取。

- [Android](https://github.com/easemob/videocall-android)

- [iOS](https://github.com/easemob/videocall-ios)

- [Web](https://github.com/easemob/videocall-web)

- [桌面](https://github.com/easemob/videocall-web) （桌面端使用electron打包了web端的代码，跟web端是同一套代码）


### Demo 功能介绍

#### **创建或加入房间**

1. 创建房间：在本页面，输入一个不存在的房间号和密码，可以创建新房间<br>
2. 加入房间：如果输入当前存在的房间号，则加入现有房间

:::notice
请选择“以主播身份进入房间”。<br>
“以观众身份进入房间”属于环信多人音视频互动直播API的一部分，使用说明请见 [互动直播介绍](scenario_live)
:::
![img](@static/images/privitization/meeting-demo4.png?w=300)
#### **音视频会议主界面**

在音视频会议的主界面，演示了以下功能：

- 打开或关闭麦克风。
- 打开或关闭摄像头。切换前后摄像头。
- 查看当前会议室参会人员名单
- 踢人
- 上麦、下麦
- 退出会议室

:::notice
“上麦/下麦”属于环信多人音视频互动直播API的一部分，使用说明请见 [互动直播介绍](scenario_live)
:::

![img](@static/images/privitization/meeting-demo5.png?w=300)