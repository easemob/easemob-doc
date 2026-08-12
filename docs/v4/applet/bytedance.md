# 抖音小程序集成介绍

<Toc />

本文介绍如何将环信即时通讯 IM SDK 快速集成到抖音小程序中。集成步骤如下：

## 步骤 1： 注册环信账号

开发者需要在环信控制台 [注册账号](/product/console/account_register.html)，[创建应用](/product/console/app_create.html)，获取唯一 App Key，SDK 初始化时需要配置 App Key。

## 步骤 2 搭建抖音小程序开发环境

首先需要下载并安装 [开发者工具](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/developer-instrument-update-and-download/)，然后按照抖音小程序的 [接入流程](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/guide/start/kick-off) 创建一个小程序。

## 步骤 3 配置服务器域名

小程序在发布前，需要配置合法域名。

登录抖音小程序 [开发者平台](https://microapp.bytedance.com/)，选择当前小程序（如果没有需要创建一个小程序），进入 **开发管理 > 开发设置** 页面配置以下服务器地址。

| 域名类型 | 具体域名   | 
| :------ | :----- |
| request 合法域名<br/>uploadFile 合法域名<br/>downloadFile 合法域名  | <br/> - https://a1.easemob.com（国内 1 区）<br/> - https://a1-v2.easemob.com（国内 1 区）<br/> - https://ngi-a1.easemob.com（国内 2 区）<br/> - https://a1-sgp.easemob.com （新加披1 区）<br/> - https://a61.easemob.com （新加坡 2 区）<br/> - https://a41.easemob.com （美东1 区）<br/> - https://a71.easemob.com （德国 2 区）<br/> - https://a1-chatfile.easemob.com （downloadFile）   | 
| WebSocket 合法域名 | <br/> - wss://im-api-wechat.easemob.com/websocket（国内 1 区）<br/> - wss://ngi-im-api-wechat.easemob.com/websocket（国内 2 区）<br/> - wss://im-api-alipay.easemob.com/websocket/websocket（支付宝小程序专用）<br/> - wss://im-api-wechat-sgp.easemob.com/websocket （新加披1 区）<br/> - wss://im-api-wechat-61.easemob.com/websocket（新加披2 区）<br/> - wss://im-api-wechat-41.easemob.com/websocket （美东1 区）<br/> - wss://im-api-wechat-71.easemob.com/websocket （德国 2 区） | 

为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名、WebSocket 访问域名不同。请根据您所在数据中心进行配置。

| 数据中心      | REST API 请求地址      | WebSocket 访问域名          |
| ------------- | ------------------ | -------------------------------- |
| 国内 1 区   | https://a1.easemob.com    | wss://im-api-wechat.easemob.com/websocket 或 wss://im-api-wechat.easecdn.com/websocket   |
| 国内 2 区   | https://ngi-a1.easemob.com    | wss://ngi-im-api-wechat.easemob.com/websocket  |
| 国内 VIP 区 | 请咨询商务经理    | 请咨询商务经理     |
| 客服专用    | 请咨询商务经理    | 请咨询商务经理   |
| 新加坡 1 区   | https://a1-sgp.easemob.com 或 https://a1-sgp.easecdn.com | wss://im-api-wechat-sgp.easemob.com/websocket  或 wss://im-api-wechat-sgp.easecdn.com/websocket  |
| 新加坡 2 区   | https://a61.easemob.com 或 https://a61.easecdn.com | wss://im-api-wechat-61.easemob.com/websocket 或 wss://im-api-wechat-61.easecdn.com/websocket |
| 美东 1 区     | https://a41.easemob.com 或 https://a41.easecdn.com       | wss://im-api-wechat-41.easemob.com/websocket 或 wss://im-api-wechat-41.easecdn.com/websocket   |
| 德国 2 区 | https://a71.easemob.com 或 https://a71.easecdn.com       | wss://im-api-wechat-71.easemob.com/websocket 或 wss://im-api-wechat-71.easecdn.com/websocket   |

应用所在数据中心可以在环信控制台的 **应用概览** 页面中查看：

![img](/images/applet/service_overview.png)

## 步骤 4 下载 SDK

可以通过以下两种方式获取 SDK：

- 通过官网 [下载 SDK](https://www.easemob.com/download/im#applets)。
- 从环信的 [GitHub](https://github.com/easemob/webim-weixin-xcx/tree/master/src/sdk) 或 [Gitee 仓库](https://gitee.com/easemob-code/webim-weixin-xcx/tree/master/src/sdk) 中获取 SDK 中的文件。

## 步骤 5 引入 SDK

- 开始一个全新的项目
  1. 将下载的 SDK（src/sdk/）导入到自己的项目中。
  2. 引入 SDK：`import EasemobChat from "../sdk/Easemob-chat-4.x.x.js";`
- 基于 Demo 二次开发

将下载的代码导入开发者工具即可运行起来。调用示例如下：

```javascript
//使用示例
import EasemobChat from "../sdk/Easemob-chat-4.x.x.js"; // 4.0 版本 SDK
```

## 步骤 6 实例调用方式

实例化 SDK，并挂载在全局对象下。

```javascript
const WebIM = (wx.WebIM = EasemobChat);
WebIM.conn = new WebIM.connection({
  appKey: "your appKey",
  url: "wss://im-api-wechat.easemob.com/websocket", // socket server (3.0 SDK)
  apiUrl: "https://a1.easemob.com", // rest server
  useOwnUploadFun: false, // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传url）
  isHttpDNS: false, // 在小程序上需设置为false
});
```

小程序端的基本功能和 Web 端一致，请参考 [Web 端文档](/v4/web/user_relationship.html)。
