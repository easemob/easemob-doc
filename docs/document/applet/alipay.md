# 支付宝小程序集成介绍

<Toc />

### 注册环信账号

开发者需要在环信管理后台 [注册并创建应用](/product/enable_and_configure_IM.html#创建应用)，来获取唯一 appKey，SDK 初始化时需要配置 appKey。

### 搭建支付宝小程序开发环境

首先需要下载并安装 [开发者工具](https://opendocs.alipay.com/mini/ide/download)，然后按照支付宝小程序的 [接入流程](https://opendocs.alipay.com/mini/006kyi) 一步步创建一个小程序。

### 配置服务器域名

小程序在发布前，需要配置合法域名。

登录 [支付宝开放平台](https://open.alipay.com/platform/home.htm), 配置以下服务器域名。

:::tip request合法域名
1. https://a1.easemob.com
2. https://a2.easemob.com
3. https://a3.easemob.com
4. https://a4.easemob.com
5. https://a5.easemob.com
:::

:::tip socket合法域名
wss://im-api-alipay.easemob.com/websocket
:::

### 说明

支付宝小程序：支付宝小程序在一段时间内只能保留一个 WebSocket 连接，如果当前已存在 WebSocket 连接，那么会自动关闭该连接，并重新创建一个新的 WebSocket 连接。

### 集成 SDK

#### 下载 SDK

可以通过以下两种方式获取 SDK：

- 通过官网[下载 SDK](http://www.easemob.com/download/im)
- 从环信的[github 仓库](https://github.com/easemob/webim-weixin-xcx/tree/master/src/sdk) 中获取 SDK 中的文件

#### 引入 SDK

- 开始一个全新的项目
    1. 将下载的 SDK（src/sdk/）导入到自己的项目中。
    2. 引入 SDK：`import IMSDK from "../sdk/Easemob-chat-miniProgram";`
- 基于 Demo 二次开发

将下载的代码导入开发者工具即可运行起来。

#### 调用示例

```javascript
//使用示例
import SDK from "../sdk/connection"; // 2.0 SDK
import SDK from "../sdk/Easemob-chat-miniProgram"; // 3.0 SDK
```

#### 实例调用方式

实例化 SDK，并挂载在全局对象下。

```javascript
//实例化 SDK 对象
const WebIM = wx.WebIM = SDK;
WebIM.conn = new WebIM.connection({
    appKey: 'your appKey',
    https: true, //是否使用 HTTPS 
    url: 'wss://im-api-alipay.easemob.com/websocket', // socket server (3.0 SDK)
    apiUrl: 'https://a1.easemob.com',    // rest server
    heartBeatWait: 30000, //心跳间隔
    autoReconnectNumMax: 5, //自动重连次数
    useOwnUploadFun: false // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传 URL）
});
```

IM 基本功能和 Web 端一致，请参考 Web 端文档。