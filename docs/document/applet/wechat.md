# 微信小程序集成介绍

<Toc />

### Demo 体验

你可以[体验微信小程序 Demo](/product/demo.html#各端原生开发-demo)，使用微信扫描二维码，并查看 Demo 源码。

### 注册环信账号

开发者需要在环信控制台 [注册并创建应用](/product/console/app_create.html)，来获取唯一 App Key，SDK 初始化时需要配置 App Key。

### 搭建微信小程序开发环境

首先需要下载并安装 [开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，然后按照微信小程序的 [接入流程](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html#%E7%94%B3%E8%AF%B7%E5%B8%90%E5%8F%B7)一步步创建一个小程序。

### 配置服务器域名

小程序在发布前，需要配置合法域名。

登录[微信公众平台](https://mp.weixin.qq.com/), 在开发设置页面配置以下服务器域名。

| 域名类型 | 具体域名   | 
| :------ | :----- |
| request 合法域名 | https://a1.easemob.com<br/>https://a2.easemob.com<br/>https://a3.easemob.com<br/>https://a4.easemob.com<br/>https://a5.easemob.com<br/>https://a1-chatfile.easemob.com<br/>https://rs.chat.agora.io<br/>https://rs.easemob.com   | 
| socket 合法域名 | wss://im-api-wechat.easemob.com（3.0 IM SDK）   | 
| uploadFile 合法域名 | https://a1.easemob.com    | 
| downloadFile 合法域名 | https://a1-v2.easemob.com<br/>https://a4.easemob.com<br/>https://a1.easemob.com<br/>https://a4-v2.easemob.com<br/>https://a3-v2.easemob.com<br/>https://a5-v2.easemob.com<br/>https://a2-v2.easemob.com<br/>https://a1-chatfile.easemob.com   | 

为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名、WebSocket 访问域名不同。请根据您所在数据中心进行配置。

| 数据中心      | REST API 请求地址      | Socket 访问域名          |
| ------------- | ------------------ | -------------------------------- |
| 国内 1 区   | https://a1.easemob.com    | wss://im-api-wechat.easemob.com 或 wss://im-api-wechat.easecdn.com   |
| 国内 2 区   | https://a31.easemob.com   | wss://im-api-wechat-31.easemob.com 或 wss://im-api-wechat-31.easecdn.com |
| 国内 VIP 区 | 请咨询商务经理    | 请咨询商务经理     |
| 客服专用    | 请咨询商务经理    | 请咨询商务经理   |
| 新加坡 1 区   | https://a1-sgp.easemob.com 或 https://a1-sgp.easecdn.com | wss://im-api-wechat-sgp.easemob.com  或 wss://im-api-wechat-sgp.easecdn.com  |
| 新加坡 2 区   | https://a61.easemob.com 或 https://a61.easecdn.com | wss://im-api-wechat-61.easemob.com 或 wss://im-api-wechat-61.easecdn.com |
| 美东 1 区     | https://a41.easemob.com 或 https://a41.easecdn.com       | wss://im-api-wechat-41.easemob.com 或 wss://im-api-wechat-41.easecdn.com   |
| 德国 2 区 | https://a71.easemob.com 或 https://a71.easecdn.com       | wss://im-api-wechat-71.easemob.com 或 wss://im-api-wechat-71.easecdn.com   |

应用所在数据中心可以在环信控制台的 **应用概览** 页面中查看：

![img](/images/applet/service_overview.png)

### 集成 SDK

#### 下载 SDK

可以通过以下两种方式获取 SDK：

- 通过官网 [下载 SDK](https://www.easemob.com/download/im)
- 从环信的 [github 仓库](https://github.com/easemob/webim-weixin-xcx/tree/master/src/sdk) 中获取 SDK 中的文件

#### 引入 SDK

- 开始一个全新的项目
  1. 将下载的 SDK（src/sdk/）导入到自己的项目中。
  2. 引入 SDK：`import IMSDK from "../sdk/Easemob-chat-miniProgram";`
- 基于 Demo 二次开发

将下载的代码导入开发者工具即可运行起来。

#### 调用示例

```javascript
//使用示例
import SDK from "../sdk/connection"; // 2.0sdk
import SDK from "../sdk/Easemob-chat-miniProgram"; // 3.0sdk
```

#### 实例调用方式

实例化 SDK，并挂载在全局对象下。

```javascript
//实例化SDK对象
// url 和 apiUrl 属性仅在 4.11.0 及之前版本需手动传入。4.12.0 及之后版本，SDK 会自动获取。
const WebIM = (wx.WebIM = SDK);
WebIM.conn = new WebIM.connection({
  appKey: "your appKey",
  https: true, //是否使用HTTPS
  url: "wss://im-api-wechat.easemob.com/websocket", // socket server (3.0 SDK)
  apiUrl: "https://a1.easemob.com", // rest server
  heartBeatWait: 30000, //心跳间隔
  autoReconnectNumMax: 5, //自动重连次数
  useOwnUploadFun: false, // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传url）
});
```

小程序端的基本功能和 Web 端一致，请参考 [Web 端文档](/document/web/integration.html)。
