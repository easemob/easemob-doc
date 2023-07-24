# 音视频概览

## 概述

私有化音视频平台是为政企用户提供实时音视频能力的系统，该系统支持构建在物理隔离或逻辑隔离的网络环境下。通过该平台，用户可以获得安全可靠的音视频通信能力，并根据自身需求定制化部署和管理私有化音视频服务。

## 产品特性

- 支持超低延迟的语音通话和视频通话
- 支持1对1通话时进行P2P传输
- 支持多人通话的权限控制
- 支持会议属性，灵活自定义控制
- 支持云录制
- 支持超高清视频
- 支持自适应动态视频码率和帧率
- 支持对接第三方美颜
- 增强的弱网适应，抗丢包，抗抖动
- 增强的语音处理，回音消除，噪声抑制等
- 支持多集群代理
- 支持cdn推流

## SDK架构

![img](@static/images/privitization/em-rtcsdk-architecture.png)

环信音视频SDK提供3套API体系，[1对1通话](one2one_introduction)，[多人通话](conference_introduction)，[互动白板](whiteboard_introduction)，以上API能满足客户的绝大多数使用场景。

## 典型场景

环信音视频能力有几种典型的应用模式，包括：一对一音视频、多人音视频会议、多人音视频互动直播。

![img](@static/images/privitization/em-rtcsdk-scenarios.png)

## 兼容性说明

环信音视频SDK支持Android、iOS、Web、微信小程序、Windows、macOS、Linux，支持各平台互通，平台兼容性见下表:

![img](@static/images/privitization/em-rtcsdk-compatibility.png)

对于浏览器的支持情况见下表：


![img](@static/images/privitization/em-rtcsdk-compatibility-web.png)

注意：

1. 由于Android碎片化严重，微信H5、APP内嵌H5支持大部分手机，有少量手机不支持，如发现不支持手机型号，请反馈给环信工作人员；
2. Android APP内嵌H5建议使用腾讯浏览器内核：https://x5.tencent.com/tbs/product/tbs.html；
3. iOS APP内嵌H5，从iOS13开始支持SFSafariViewController控件，UIWebView和WKWebView目前尚未支持。

## 视频编码和码率

- 支持的视频编码：H264，VP8
- 视频码率（带宽占用）是自适应的，不是固定值，会自动根据网络拥塞情况调整清晰度，码率，帧率；
- 各个分辨率的码率范围
  - 240p：150k～400kbps，推荐 200kbps
  - 480p：300k～1000bps，推荐 500kbps
  - 720p：900k ～2500kbps，推荐 1100kbps
  - 1080p: 2000k ~ 5000kbps，推荐 3000kbps

## 音频编码和码率

- 支持的音频编码：Opus，G.711，G.722等，默认使用opus编码
- 支持可配置码率范围 6k ～ 510kbps，默认32kbps

## 通话数据流量

实时语音(每分钟)：

- 45KB ～ 3.8MB

实时视频（每分钟）：

- 240p: 1.1MB ~ 3MB
- 480p: 2.2MB ~ 7.5MB
- 720p: 6.7MB ~ 18.7MB
- 1080p: 15MB ~ 37.5MB