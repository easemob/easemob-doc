# uni-app 全平台集成指南

## 概述

环信小程序 SDK 为 uni-app 多端应用提供即时通讯（IM）能力。开发者可以基于一套代码，在 Web、H5、主流小程序以及部分原生 App 平台中集成账户、消息、群组和聊天室等功能。

本文介绍 uni-app 项目的环境准备、服务器域名配置、SDK 安装与初始化方法，并说明自动登录和 Vue 3 H5 发布时的注意事项。

## 支持平台

uni-app SDK 支持以下平台：

- Web 和 H5；
- 微信、支付宝、QQ、百度和抖音小程序；
- 通过 uni-app 编译的 Android 和 iOS 原生应用；
- HarmonyOS（自 uni-app SDK 4.11.0 起支持）。

:::warning
抖音小程序需使用低于 1.70.0 的基础库版本。
:::

## 前置条件

开始集成前，请准备以下账号、工具和信息：

- [环信账号](/product/console/account_register.html) 及已 [创建的应用](/product/console/app_create.html)；
- [应用的 App Key](/product/console/app_manage.html#管理应用)；
- DCloud 开发者账号；
- HBuilderX 最新版本；
- 项目所属的 [数据中心及对应服务地址](/product/console/app_manage.html#管理应用)；
- 目标小程序平台的开发者账号和管理权限。

## 快速开始

首次接入时，建议按照以下顺序操作：

1. 注册环信账号并 [创建应用](/product/console/app_create.html)，获取 App Key；
2. 安装 HBuilderX，并注册、登录 DCloud 开发者账号；
3. 确认应用所属的 [数据中心](/product/console/app_manage.html#管理应用)；
4. 在目标小程序平台配置合法域名；
5. 安装并引入 `easemob-websdk`；
6. 创建 SDK 连接实例并配置 App Key 和服务地址；
7. 运行项目，验证登录和消息收发功能。

## 体验 Demo

可以下载安装以下 Demo，体验 uni-app 构建的移动端原生应用：

- Android：[下载 Demo](https://www.pgyer.com/h4XF)
- iOS：[下载 Demo](https://www.pgyer.com/9ISC)

Demo 源码：

- [GitHub](https://github.com/easemob/easemob-uikit-uniapp)
- [Gitee](https://gitee.com/easemob-code/easemob-uikit-uniapp)

Demo 主要包含以下功能：

- 账户注册与登录；
- 文本、图片、语音、视频、音频、文件、透传和扩展消息的收发；
- 群组和聊天室；
- 个人设置；
- 语音消息发送。

:::tip
Demo 仅包含部分 IM 功能，完整能力请以 SDK 的实际支持范围为准。
:::

## 集成 SDK

### 步骤 1：准备开发环境

#### 注册环信账号并创建应用

1. 在环信控制台 [注册账号](/product/console/account_register.html)；
2. [创建应用](/product/console/app_create.html)；
3. 获取应用的 App Key，并妥善保存。初始化 SDK 时需要使用该参数。

#### 安装 HBuilderX

1. 从 [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html) 下载并安装最新版本；
2. 在 [DCloud 开发者中心](https://dev.dcloud.net.cn/) 注册账号；
3. 启动 HBuilderX，并登录 DCloud 开发者账号。

完成以上操作后，即可创建、运行和发布 uni-app 项目。

### 步骤 2：配置服务器域名

#### 确认应用所属的数据中心

环信在多个地区部署了数据中心。不同数据中心对应不同的 REST API 和 WebSocket 服务地址，因此必须根据应用所属的数据中心进行配置。

你可以在环信控制台的 **应用概览** 页面查看应用所属的数据中心，再选择对应的 REST API 和 WebSocket 地址。

![应用概览中的数据中心信息](/images/applet/service_overview.png)

:::tip
请以环信控制台显示的数据中心和实际分配的服务地址为准，不要直接将示例地址用于所有应用。
:::

#### 配置小程序合法域名

以微信小程序为例，登录 [微信公众平台](https://mp.weixin.qq.com/)，进入 **开发 > 开发设置** 页面，然后配置服务器域名。其他小程序平台的配置方式与微信小程序类似。

根据应用所属的数据中心，从下表选择对应地址：

| 域名类型 | 可配置地址 |
| :-------------- | :----- |
| `request`、`uploadFile`、`downloadFile` 合法域名 | 国内 1 区：`https://a1.easemob.com`、`https://a1-v2.easemob.com`<br/>国内 2 区：`https://ngi-a1.easemob.com`<br/>新加坡 1 区：`https://a1-sgp.easemob.com`<br/>新加坡 2 区：`https://a61.easemob.com`<br/>美东 1 区：`https://a41.easemob.com`<br/>德国 2 区：`https://a71.easemob.com`<br/>文件下载：`https://a1-chatfile.easemob.com` |
| WebSocket 合法域名 | 国内 1 区：`wss://im-api-wechat.easemob.com/websocket`<br/>国内 2 区：`wss://ngi-im-api-wechat.easemob.com/websocket`<br/>支付宝小程序专用：`wss://im-api-alipay.easemob.com/websocket/websocket`<br/>新加坡 1 区：`wss://im-api-wechat-sgp.easemob.com/websocket`<br/>新加坡 2 区：`wss://im-api-wechat-61.easemob.com/websocket`<br/>美东 1 区：`wss://im-api-wechat-41.easemob.com/websocket`<br/>德国 2 区：`wss://im-api-wechat-71.easemob.com/websocket` |

#### 各小程序平台的 WebSocket 连接限制

| 平台 | 版本要求与连接限制 |
| :-------------- | :----- |
| QQ、微信小程序 | 1.7.0 及以上版本最多可同时存在 5 个 WebSocket 连接。 |
| 字节小程序 | 1.0.0 及以上版本支持创建新的 WebSocket 连接；创建新连接时，已有连接不会自动关闭。 |
| 百度小程序 | 1.9.4 及以上版本支持多个 WebSocket 连接；每次成功调用均会返回新的 `SocketTask`。 |
| 支付宝小程序 | 一段时间内只能保留一个 WebSocket 连接；如果已有连接，创建新连接时会自动关闭原连接。 |


### 步骤 3：SDK 接入方式

开发者可以选择以下任一种方式接入 SDK：

- 在已有 uni-app 项目中集成 SDK；
- 基于 Demo 进行二次开发。

#### 方式一：在已有项目中集成 SDK

适用于已经创建 uni-app 项目，需要在现有项目中增加环信 IM 功能的场景。

**1. 安装 SDK**

如果项目根目录中没有 `package.json`，请先初始化 npm 项目：

```bash
npm init -y
```

然后在项目根目录安装 SDK：

// 下面两个示例代码？选择哪个？第二个是 AI 给的。
```bash 
npm i easemob-websdk
```

```bash
npm install easemob-websdk
```

**2. 引入 SDK**

安装完成后，在需要初始化 SDK 的代码文件中引入 uni-app 版本：

```
import SDK from "easemob-websdk/uniApp/Easemob-chat";
```

也可以使用 `require` 引入。如果项目使用 mpvue，请保持 SDK 的模块引入方式一致。

#### 方式二：基于 Demo 进行二次开发

适用于希望快速运行示例项目，并在现有功能基础上进行开发的场景。

1. 从 GitHub 或 Gitee 下载 Demo 源码；
2. 使用 HBuilderX 打开项目； 
3. 根据项目说明安装依赖；
4. 配置 App Key 和服务器地址；
5. 运行项目并验证 IM 功能。
   - [GitHub Demo](https://github.com/easemob/easemob-uikit-uniapp)
   - [Gitee Demo](https://gitee.com/easemob-code/easemob-uikit-uniapp)

### 步骤 4：初始化 SDK

#### 创建连接实例

引入 SDK 后，将其挂载到全局对象，并创建连接实例：

```javascript
const WebIM = uni.WebIM = SDK;

const conn = new WebIM.connection({
  appKey: "your appKey", //注意这里的 "K" 需大写
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com",
  useOwnUploadFun: true,
  isHttpDNS: false,
  isAutoLogin: false,
});
```

#### 初始化参数说明

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `appKey` | String | 环信应用的唯一标识。**参数名中的 `K` 必须大写**。 |
| `url` | String | WebSocket 服务地址。**应根据应用所属的数据中心进行配置**。 |
| `apiUrl` | String | REST API 服务地址。**应根据应用所属的数据中心进行配置**。 |
| `useOwnUploadFun` | Boolean | 是否使用自定义上传方式。启用后，可先将图片等文件上传至自有服务器，再在构建消息时传入文件 URL。 |
| `isHttpDNS` | Boolean | 是否启用 HTTP DNS。小程序平台需设置为 `false`，其他平台设置为 `true`。 |
| `isAutoLogin` | Boolean | 是否启用自动登录。自 uni-app SDK 4.19.0 起支持。 |

## 自动登录

自 uni-app SDK 4.19.0 起，SDK 支持自动登录。初始化时将 `isAutoLogin` 设置为 `true` 即可启用：

```javascript
const conn = new WebIM.connection({
  appKey: "your appKey",
  isAutoLogin: true,
});
```

自动登录的有效期取决于登录所使用的用户 Token 或密码的有效期。例如，Token 的有效期为 24 小时，则 Token 失效后需要重新获取并登录。

#### 相关错误码

- [错误码 214](error.html)：当前登录设备数量已达到上限，无法继续登录；
- [错误码 220](error.html)：当前登录设备与上一次登录的设备不一致。

#### 设备安全检查机制

自动登录设备上线时，默认会将当前已登录设备踢下线；在多设备登录场景中，默认踢下线最早登录的设备。

如需保留当前登录设备，请联系环信商务进行配置。配置后，如果设备数量已达到上限，自动登录将失败，并返回错误码 214。

## Vue 3 项目发布至 H5 的注意事项

在 Vue 3 模式下，HBuilderX 默认启用 [摇树优化（tree-shaking）](https://uniapp.dcloud.net.cn/collocation/manifest.html#treeshaking)。将项目发行至“网站-PC Web 或手机 H5”时，该优化可能会移除环信 SDK 中未被显式引用的模块，导致发布后的应用出现登录失败等问题。

可以使用以下任一方式关闭摇树优化。

#### （推荐）方式一：通过 HBuilderX 关闭

1. 在 HBuilderX 中打开 `manifest.json`；
2. 进入 **Web 配置（H5 配置）**；
3. 找到 **发行时启用摇树优化（自动裁剪没有使用的组件和 API 库）**；
4. 先选中该选项，再 **取消选中**，然后点击 **重新发行**。  

该操作会触发 HBuilderX 重新生成编译缓存，并关闭摇树优化。

#### 方式二：修改 manifest.json

在 `manifest.json` > 源码视图 > H5 节点中添加以下配置，然后重新编译：

```json
{
  "h5": {
    "optimization": {
      "treeShaking": {
        "enable": false
      }
    }
  }
}
```

## 接入检查清单

完成集成后，建议逐项检查：

- 已获取正确的 App Key；
- `url` 和 `apiUrl` 与应用所属数据中心一致；
- 目标小程序平台已配置全部必要的合法域名；
- 小程序平台的 `isHttpDNS` 已设置为 `false`；
- SDK 已正确安装并引入；
- 登录、断线重连和消息收发功能验证通过；
- Vue 3 H5 项目已根据需要关闭摇树优化；
- 已在目标平台和真机环境中完成兼容性测试。
