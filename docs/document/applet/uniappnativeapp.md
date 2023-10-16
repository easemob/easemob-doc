# uni-app 打包原生 app（Android、iOS）方案简介

<Toc />

使用 环信小程序 SDK 在 **`HBuilderX`** 中编译 Android、iOS 应用，可实现一套代码多端同时打包。IM 相关的集成方式同 Web、小程序一样便捷、高效。

## 体验 IM 应用

- 安卓： [https://www.pgyer.com/h4XF](https://www.pgyer.com/h4XF)
- iOS： [https://www.pgyer.com/9ISC](https://www.pgyer.com/9ISC)

:::notice

- Demo 只包含部分 IM 功能，详细参考 **功能说明**
- Uni-app Demo Git 源码地址 [https://github.com/easemob/webim-uniapp-demo](https://github.com/easemob/webim-uniapp-demo):::

## 功能说明

- 支持账户注册登录
- 支持 IM 基本功能收发文本、图片、语音、视频、音频、文件、透传、扩展消息等
- 支持 群组聊天室功能
- 支持个人设置

## 开发者集成

[注册并创建应用](/product/enable_and_configure_IM.html#创建应用)

### 搭建 app 开发环境

1. 下载 HBuilderx 编辑器 https://www.dcloud.io/hbuilderx.html

:::notice
项目中 HBuilderx 目前使用的最新版本，如果此前下载过 HBuilderx，为保证开发环境统一请更新到最新版本
:::

2. DCloud 开发者中心注册 [https://dev.dcloud.net.cn/](https://dev.dcloud.net.cn/)

之后登陆 HBuilderx 编辑器。 至此 app 的开发环境差不多完成。

### 将 SDK 添加到自己的小程序

#### 下载 SDK

可以通过以下两种方式获取 SDK：

- 通过官网 [下载 SDK](https://www.easemob.com/download/im)
- Uni-app Demo 源码中获取 [https://github.com/easemob/webim-uniapp-demo](https://github.com/easemob/webim-uniapp-demo)

#### 引入 SDK

- 开始一个全新的项目
  1. 将 SDK 目录下（src/sdk/）的文件全部导入到自己的项目中。
  2. 直接使用 import/require 方式获取引用, 如果使用 mpvue 请保持引用文件方式的统一。

#### 基于 Demo 二次开发

拉取代码，连接手机，打开手机开发者模式，连接手机授权传输文件，即可运行起来。

#### 调用示例

```javascript
//使用示例
import SDK from "../sdk/webimSDK3.x.x"; // 3.0sdk
```

#### 实例调用方式

实例化 SDK，并挂载在全局对象下

```javascript
//实例化 SDK 对象
const WebIM = (wx.WebIM = SDK);
WebIM.conn = new WebIM.connection({
  isMultiLoginSessions: false, //是否可以登录多个，并在所有端上接收消息
  https: false, //是否使用 HTTPS
  url: "wss://im-api-wechat.easemob.com/websocket", // socket server (3.0 SDK)
  apiUrl: "https://a1.easemob.com", // rest server
  heartBeatWait: 30000, //心跳间隔
  autoReconnectNumMax: 2, //自动重连次数
  useOwnUploadFun: false, // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传url）
});
```

IM 基本功能，请参考 [消息管理](/document/web/message_overview.html)。

## 打包发布

1. 原生 App-云打包：HBuilder 编辑器 → 发行 → 原生 App-云打包 （app 图标，启动页等详细配置可在 **`manifest.json`** 进行配置）
2. 原生 App-离线打包：HBuilder 编辑器 → 发行 → 生成本地打包 App 资源 （详细打包方案请看 **`iOS、Android 本地打包指南`**。）

## Demo 兼容性

Demo 在以下安卓机器中存在一定兼容性能问题：

- 魅族魅蓝 E （无法运行）
- 华为 p20（运行卡顿）

## APP 开发者常见问题（重要）

- App/uni-app 离线本地存储方案：[https://ask.dcloud.net.cn/article/166](https://ask.dcloud.net.cn/article/166)
- uni-app 实现全局变量：[https://ask.dcloud.net.cn/article/35021](https://ask.dcloud.net.cn/article/35021)
- 原生控件层级过高无法覆盖的解决方案：[https://uniapp.dcloud.io/component/native-component](https://uniapp.dcloud.io/component/native-component)
- 导航栏开发指南：[https://ask.dcloud.net.cn/article/34921](https://ask.dcloud.net.cn/article/34921)
- 关于推送：[https://ask.dcloud.net.cn/article/35622](https://ask.dcloud.net.cn/article/35622)
- 更多详情：[https://uniapp.dcloud.io/faq](https://uniapp.dcloud.io/faq)
