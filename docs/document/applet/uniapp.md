# Uniapp 全平台方案简介

<Toc />

环信小程序 SDK 为各端小程序开发提供一套完整的技术解决方案，在各端小程序的开发环境下，集成 IM 相关的功能更加便捷、高效。让您的小程序快速获得安全稳定的 IM 能力，集成简单，使用方便，帮助您快速拓展业务，赢得先机。

:::notice
SDK 目前支持微信、QQ、百度小程序、抖音（请使用低于 1.70.0 以下的版本基础库）、uni-app 编译的 原生 Android 以及 iOS。
:::

## 体验小程序

扫描下方小程序二维码，或者微信搜索 **环信 IM Uniapp** 即可快速体验环信小程序 Demo 在线版本

![img](@static/images/applet/applet-demo.jpeg)

:::notice

- 小程序 Demo 只包含部分 IM 功能，详细参考 **功能说明**。
- Uni-app Demo Git 源码地址 [https://github.com/easemob/webim-uniapp-demo](https://github.com/easemob/webim-uniapp-demo)
  :::

## 功能说明

- 支持账户注册登录
- 支持 IM 基本功能收发文本、图片、语音、视频、音频、文件、透传、扩展消息等
- 支持 群组聊天室功能
- 支持个人设置
- 支持发送语音功能

## 开发者集成

### 集成前准备

[注册并创建应用](/product/enable_and_configure_IM.html#创建应用)

### 搭建开发环境

1. 下载 HBuilderx 编辑器 [https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html)。
2. DCloud 开发者中心注册 [https://dev.dcloud.net.cn/](https://dev.dcloud.net.cn/)。

之后登录 HBuilderx 编辑器。这样，小程序的开发环境准备完毕。

即将开发的平台配置服务

### 配置服务器域名（以微信为例）

为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名、WebSocket 访问域名不同。请根据您所在数据中心进行配置。

环信不同数据中心的 REST API 请求域名、WebSocket 访问域名：

| 数据中心      | REST API 请求地址                        | WebSocket 访问域名                                     |
| ------------- | ---------------------------------------- | ------------------------------------------------------ |
| 国内 1 区     | a1.easemob.com 或 a1.easecdn.com         | im-api-v2.easemob.com 或 im-api-v2.easecdn.com         |
| 国内 2 区     | a31.easemob.com 或 a31.easecdn.com       | im-api-v2-31.easemob.com 或 im-api-v2-31.easecdn.com   |
| 国内 VIP 区   | 请咨询商务经理                           | 请咨询商务经理                                         |
| 客服专用      | 请咨询商务经理                           | 请咨询商务经理                                         |
| 新加坡 1 区   | a1-sgp.easemob.com 或 a1-sgp.easecdn.com | im-api-sgp-v2.easemob.com 或 im-api-sgp-v2.easecdn.com |
| 美东 1 区     | a41.easemob.com 或 a41.easecdn.com       | msync-api-41.easemob.com 或 msync-api-41.easecdn.com   |
| 法兰克福 1 区 | a51.easemob.com 或 a51.easecdn.com       | msync-api-51.easemob.com 或 msync-api-51.easecdn.com   |

应用所在数据中心可以在环信用户管理后台>应用信息中查看：Console 中查看请求域名

![img](@static/images/applet/console.jpeg)

登录 [微信公众平台](https://mp.weixin.qq.com/)，进入 “开发 > 开发设置” 页面，配置以下服务器地址（其他平台小程序配置与微信一致）：

:::tip
request 合法域名，uploadFile 合法域名，downloadFile 合法域名

1. https://a1.easemob.com
2. https://a2.easemob.com
3. https://a3.easemob.com
4. https://a4.easemob.com
5. https://a5.easemob.com
6. https://a31.easemob.com
7. https://a1-sgp.easemob.com
8. https://a41.easemob.com
9. https://a51.easemob.com
10. https://a1-chatfile.easemob.com
:::

:::tip
socket 合法域名:

1. wss://im-api-wechat.easemob.com（3.0 IM SDK）
2. wss://im-api-wechat-31.easemob.com
3. wss://im-api-alipay.easemob.com/websocket（支付宝小程序专用）
4. wss://im-api-alipay-31.easemob.com/websocket（支付宝小程序专用）
:::

### 各端小程序 WebSocket 连接数量

- QQ、微信小程序： `**1.7.0**` 及以上版本，最多可以同时存在 **5** 个 WebSocket 连接
- 字节小程序： `**1.0.0**` 及以上版本 （在当前小程序页面已经有一个 WebSocket 连接的情况下，如果再创建一个 WebSocket 连接，会重新创建一个 WebSocket 连接，但是之前创建的 WebSocket 连接并不会自动关闭。）
- 百度小程序：`**1.9.4**` 及以上版本，支持存在多个 WebSokcet 连接，每次成功调用会返回一个新的 SocketTask
- 支付宝小程序：支付宝小程序在一段时间内只能保留一个 WebSocket 连接，如果当前已存在 WebSocket 连接，那么会自动关闭该连接，并重新创建一个新的 WebSocket 连接。

### 将 SDK 添加到自己的小程序

#### 下载 SDK

可以通过以下方式获取 SDK：

- 从环信的 [github 仓库](https://github.com/easemob/webim-uniapp-demo/tree/master/newSDK) 中获取 SDK 中的文件，从 3.3.1 开始支持 uniapp。

#### 引入 SDK

- 开始一个全新的项目
  1. 将 SDK 目录下（src/sdk/）的文件全部导入到自己的项目中。
  2. 直接使用 import/require 方式获取引用，如果使用 mpvue 保持引文件方式的统一。
- 基于 Demo 二次开发

拉取代码，HBuilder 运行

#### 调用示例

```javascript
//使用示例
import SDK from "../newSDK/uni_sdk3.6.3";
```

#### 实例调用方式

实例化 SDK，并挂载在全局对象下

```javascript
//实例化 SDK 对象
const WebIM = wx.WebIM = SDK;
WebIM.conn = new WebIM.connection({
    appKey: 'your appKey'//注意这里的 "K" 需大写
    isMultiLoginSessions: false, //是否可以登录多个，并在所有端上接收消息
    https: false, //是否使用 HTTPS
    url: 'wss://im-api-wechat.easemob.com/websocket', // socket server (3.0 SDK)
    apiUrl: 'https://a1.easemob.com',    // rest server
    heartBeatWait: 30000, //心跳间隔
    autoReconnectNumMax: 5, //自动重连次数
    useOwnUploadFun: false // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传 URL）
});
```
