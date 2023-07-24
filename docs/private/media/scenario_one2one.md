# 1对1音视频场景介绍

## 概述

环信音视频能力有几种典型的应用模式，包括：一对一音视频、多人音视频会议、多人音视频互动直播。

![img](@static/images/privitization/em-rtcsdk-scenarios.png)

一对一音视频用于实现1对1语音通话和1对1视频通话，典型场景包括社交交友，远程心理咨询、远程医疗、视频面试、一对一在线教育、远程视频辅助等。

## 需求

1对1音视频场景的主要功能需求包括：

- 1对1音频通话
- 1对1视频通话
- 外部视频源输入：用户可自行采集视频数据，比如接入外部摄像头；这个功能也可以用于对接第三方美颜，变声等。以Android为例，请参考[用户自定义数据采集及数据处理](one2one_android.html#变声-自定义音频)接口文档
- 美颜
- AI鉴黄
- 服务器端录制及下载
- 即时沟通：在使用音视频服务时，也可以通过集成环信即时通讯实现IM沟通，如发文字、图片、语音片段、各种自定义消息等

## 实现方案

1. 一对一音视频开发的入口文档是：[1对1通话简介](one2one_introduction.html)，这个文档包含了以下部分：

- 功能列表：各端功能清单
- 通话流程：通话流程描述
- 客户端SDK及demo源码：开发者可以先下载demo，体验demo中的一对一音视频功能。如有需要，还可以查看demo的源代码。
- 计费说明

2. 一对一音视频还需要用到环信即时通讯云的基础IM功能，请详见文档：

服务器端：[服务端集成](https://docs-im.easemob.com/im/server/ready/intro)

Android：[Android SDK 介绍及导入](https://docs-im.easemob.com/im/android/sdk/import#android_sdk_导入)

iOS：[iOS SDK 快速集成](https://docs-im.easemob.com/im/ios/sdk/prepare#集成_sdk)

web端： [Web IM 介绍](https://docs-im.easemob.com/im/web/intro/start)

微信小程序： [微信小程序SDK简介](https://docs-im.easemob.com/im/applet/intro#开发者集成)

PC端： [桌面端集成说明](https://docs-im.easemob.com/im/pc/intro/integration)