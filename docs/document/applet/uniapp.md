# uni-app 全平台方案简介

<Toc />

环信小程序 SDK 为各端小程序开发提供一套完整的技术解决方案，在各端小程序的开发环境下，集成 IM 相关的功能更加便捷、高效。让您的小程序快速获得安全稳定的 IM 能力，集成简单，使用方便，帮助您快速拓展业务，赢得先机。

:::tip
- uni-app SDK 目前支持Web、H5、微信、支付宝、QQ、百度小程序、抖音（请使用低于 1.70.0 以下的版本基础库）、uni-app 编译的 原生 Android 以及 iOS。
- uni-app SDK 4.11.0 及以上版本支持鸿蒙系统。
:::

## 体验小程序

点击链接，扫描二维码，即可快速体验环信 Uniapp 编译生成的移动端原生应用：

- 安卓： [https://www.pgyer.com/h4XF](https://www.pgyer.com/h4XF)
- iOS： [https://www.pgyer.com/9ISC](https://www.pgyer.com/9ISC)

:::tip

- 小程序 Demo 只包含部分 IM 功能，详细参考 **功能说明**。
- 你可以查看 [uni-app Demo GitHub 源码地址](https://github.com/easemob/easemob-uikit-uniapp) 。
:::
  
## 功能说明

- 支持账户注册登录
- 支持 IM 基本功能收发文本、图片、语音、视频、音频、文件、透传、扩展消息等
- 支持 群组聊天室功能
- 支持个人设置
- 支持发送语音功能

## 开发者集成

### 集成前准备

[注册并创建应用](/product/console/app_create.html)

### 搭建开发环境

1. 下载 HBuilderx 编辑器 [https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html)。
2. DCloud 开发者中心注册 [https://dev.dcloud.net.cn/](https://dev.dcloud.net.cn/)。

之后登录 HBuilderx 编辑器。这样，小程序的开发环境准备完毕。

即将开发的平台配置服务

### 配置服务器域名（以微信为例）

为满足不同客户的业务需求，环信在多地部署了数据中心。不同数据中心的 REST API 请求域名、Socket 访问域名不同。请根据您所在数据中心进行配置。

环信不同数据中心的 REST API 请求域名、WebSocket 访问域名：

| 数据中心      | REST API 请求地址      | WebSocket 访问域名          |
| ------------- | ------------------ | -------------------------------- |
| 国内 1 区   | a1.easemob.com    | im-api-wechat.easemob.com 或 im-api-wechat.easecdn.com   |
| 国内 2 区   | a31.easemob.com   | im-api-wechat-31.easemob.com 或 im-api-wechat-31.easecdn.com |
| 国内 VIP 区 | 请咨询商务经理    | 请咨询商务经理     |
| 客服专用    | 请咨询商务经理    | 请咨询商务经理   |
| 新加坡 1 区   | a1-sgp.easemob.com 或 a1-sgp.easecdn.com | im-api-wechat-sgp.easemob.com  或 im-api-wechat-sgp.easecdn.com  |
| 新加坡 2 区   | a61.easemob.com 或 a61.easecdn.com | im-api-wechat-61.easemob.com 或 im-api-wechat-61.easecdn.com |
| 美东 1 区     | a41.easemob.com 或 a41.easecdn.com       | im-api-wechat-41.easemob.com 或 im-api-wechat-41.easecdn.com   |
| 德国 2 区 | a71.easemob.com 或 a71.easecdn.com       | im-api-wechat-71.easemob.com 或 im-api-wechat-71.easecdn.com   |

应用所在数据中心可以在环信控制台的 **应用概览** 页面中查看：

![img](/images/applet/service_overview.png)

登录 [微信公众平台](https://mp.weixin.qq.com/)，进入 **开发 > 开发设置** 页面，配置以下服务器地址（其他平台小程序配置与微信一致）：

| 域名类型 | 具体域名   | 
| :------ | :----- |
| request 合法域名<br/>uploadFile 合法域名<br/>downloadFile 合法域名  | https://a1.easemob.com<br/>https://a2.easemob.com<br/>https://a3.easemob.com<br/>https://a4.easemob.com<br/>https://a5.easemob.com<br/>https://a31.easemob.com<br/>https://a1-sgp.easemob.com<br/>https://a41.easemob.com<br/>https://a51.easemob.com<br/>https://a1-chatfile.easemob.com<br/>https://rs.chat.agora.io<br/>https://rs.easemob.com   | 
| WebSocket 合法域名 | wss://im-api-wechat.easemob.com（3.0 IM SDK）<br/> wss://im-api-wechat-31.easemob.com<br/>wss://im-api-alipay.easemob.com/websocket（支付宝小程序专用）<br/>wss://im-api-alipay-31.easemob.com/websocket（支付宝小程序专用）   | 

### 各端小程序 WebSocket 连接数量

- QQ、微信小程序： `**1.7.0**` 及以上版本，最多可以同时存在 **5** 个 WebSocket 连接
- 字节小程序： `**1.0.0**` 及以上版本 （在当前小程序页面已经有一个 WebSocket 连接的情况下，如果再创建一个 WebSocket 连接，会重新创建一个 WebSocket 连接，但是之前创建的 WebSocket 连接并不会自动关闭。）
- 百度小程序：`**1.9.4**` 及以上版本，支持存在多个 WebSokcet 连接，每次成功调用会返回一个新的 SocketTask
- 支付宝小程序：支付宝小程序在一段时间内只能保留一个 WebSocket 连接，如果当前已存在 WebSocket 连接，那么会自动关闭该连接，并重新创建一个新的 WebSocket 连接。

### 将 SDK 添加到自己的小程序

#### 下载 SDK

可以通过以下方式获取 SDK：

- 从 npm [easemob-websdk](https://www.npmjs.com/package/easemob-websdk/) 中获取。

#### 引入 SDK

- 开始一个全新的项目：
  1. 安装 `easemob-websdk` npm 包。
  2. 直接使用 `import/require` 方式获取引用，如果使用 mpvue 保持引文件方式的统一。
- 基于 Demo 二次开发。

拉取代码，HBuilder 运行。

#### 调用示例

若项目之前未使用 npm 管理依赖（项目根目录下无 package.json 文件），先在项目根目录执行命令初始化 npm 工程：

```bash 
npm init -y
```
在项目根目录执行命令安装 npm 包：

```bash 
npm i easemob-websdk
```
引入 uni-app SDK

```javascript
import SDK from 'easemob-websdk/uniApp/Easemob-chat';
```

#### 实例调用方式

实例化 SDK，并挂载在全局对象下。

```javascript
const WebIM = wx.WebIM = SDK;
const conn = new WebIM.connection({
    appKey: 'your appKey', //注意这里的 "K" 需大写
    url: 'wss://im-api-wechat.easemob.com/websocket', // websocket 连接地址
    apiUrl: 'https://a1.easemob.com',// REST API 连接地址
    useOwnUploadFun: true // 是否使用自己的上传方式（如将图片文件等上传到自己的服务器，构建消息时只传 URL）
});
```

## 注意事项

uni-app 在 **Vue3 模式** 下，HBuilderX 会默认开启 [**摇树优化（tree-shaking）**](https://uniapp.dcloud.net.cn/collocation/manifest.html#treeshaking)。  

该优化会在点击发行至 `网站-PC Web或手机H5` 后出现误删除环信 SDK 中未被显式引用的模块，导致发行后出现登录失败等异常情况。为了避免这些异常情况，你可以采用以下两种解决方案：

**（推荐）方案一：手动关闭摇树优化**  

1. 在 HBuilderX 顶部菜单打开 `manifest.json` > **Web 配置**（H5 配置）。  
2. 找到 **发行时启用摇树优化（自动裁剪没有使用的组件和 API 库）**。  
3. 先 **勾选**，再 **取消勾选**，然后点击 **重新发行**。  
   该操作会强制 HBuilderX 重新生成编译缓存，关闭摇树优化。
   
**方案二：手动配置关闭摇树优化**  

在 `manifest.json` > 源码视图 > H5 节点下增加以下配置，然后重新编译即可：

```json
"h5": {
  "optimization": {
    "treeShaking": {
      "enable": false
    }
  }
}
```
