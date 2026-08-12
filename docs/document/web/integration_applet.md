# 小程序集成指南

本文介绍如何将环信即时通讯 IM Web SD 集成到小程序项目中。Web SDK 通过统一的跨平台适配层支持小程序运行环境，SDK 会根据当前宿主环境自动装配网络请求、WebSocket、文件上传、本地存储和运行时监听等能力。

当前 SDK 支持微信、QQ、百度、抖音/头条、支付宝等小程序运行环境和 uniAPP、taro 跨平台框架。各平台的集成流程基本一致，主要差异集中在开发者工具、服务器合法域名配置。

## 集成 SDK

### 步骤 1：注册环信账号

在环信控制台完成以下操作：

1. [注册环信账号](/product/console/account_register.html)。
2. [创建应用](/product/console/app_create.html)。
3. 获取应用唯一的 App Key。初始化 SDK 时需要传入该 App Key。

### 步骤 2：搭建小程序开发环境

根据目标平台下载对应的开发者工具，并按照平台接入流程创建小程序项目。

| 平台 | 开发者工具 | 接入流程 |
| :--- | :--- | :--- |
| 微信 | [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | [微信小程序快速开始](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/getstart.html) |
| QQ | [QQ 小程序开发者工具](https://q.qq.com/wiki/tools/devtool/) | [QQ 小程序接入流程](https://q.qq.com/wiki/) |
| 百度 | [百度开发者工具](https://smartprogram.baidu.com/docs/introduction/tool/) | [百度智能小程序开发教程](https://smartprogram.baidu.com/docs/develop/tutorial/startdevelop/) |
| 抖音/头条 | [抖音开发者工具](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/developer-instrument/developer-instrument-update-and-download) | [抖音小程序接入流程](https://https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/introduction/develop-process/privacy-policy-process-guidelines) |
| 支付宝 | [支付宝开发者工具](https://opendocs.alipay.com/mini/ide/download) | [支付宝小程序接入流程](https://opendocs.alipay.com/mini/006kyi) |

:::tip
百度小程序的注册主体不能为个人，必须使用企业、媒体、政府等主体。
:::

### 步骤 3：配置服务器域名

#### 确认应用所属的数据中心

小程序发布前，需在对应平台后台配置合法域名。请先在环信控制台的 **应用概览** 页面确认应用所在数据中心，再选择对应的 REST API 和 WebSocket 地址。

![应用所在数据中心](/images/applet/service_overview.png)

:::tip
文件下载相关域名需按数据中心进行配置：国内 1 区配置 `https://a1-chatfile.easemob.com`，国内 2 区配置 `ngi-chatfile.easemob.com`。<br/>实际需要配置的 `request`、`uploadFile`、`downloadFile` 以及 WebSocket 合法域名，应以应用所在数据中心和服务端实际下发的服务地址为准。若小程序使用文件消息、图片消息、语音消息或视频消息，需确保相关上传、下载域名已在小程序后台完成配置。
:::

#### 在平台后台配置域名

| 平台 | 配置平台 | 配置入口 | WebSocket 地址选择 |
| :--- | :--- | :--- | :--- |
| 微信 | [微信公众平台](https://mp.weixin.qq.com/) | **开发** > **开发设置** | 使用表中“微信、QQ、百度和抖音”地址 |
| QQ | [QQ 小程序开发者平台](https://q.qq.com/) | **开发** > **开发设置** | 使用表中“微信、QQ、百度和抖音”地址 |
| 百度 | [百度智能小程序官网](https://smartprogram.baidu.com/) | 小程序的开发设置页面 | 使用表中“微信、QQ、百度和抖音”地址 |
| 抖音/头条 | [抖音小程序开发者平台](https://developer.open-douyin.com/) | **开发管理** > **开发设置** | 使用表中“微信、QQ、百度和抖音”地址 |
| 支付宝 | [支付宝开放平台](https://open.alipay.com/platform/home.htm) | 小程序服务端域名配置 | 使用表中“支付宝”地址 |

在平台后台按需配置 `request`、`uploadFile`、`downloadFile` 和 WebSocket（或 socket）合法域名。配置 WebSocket 地址时，**不要将地址末尾重复写成 `/websocket/websocket`**。

### 步骤 4：安装或获取 SDK

推荐通过 npm 安装 SDK：

```bash
npm install easemob-websdk
```

### 步骤 5：引入 SDK

若项目构建流程支持 npm 包导入，可直接从主入口引入 SDK。小程序场景建议优先从主入口导入 `ChatClient`、需要使用的 Manager 以及平台常量。

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';
```

### 步骤 6：初始化 SDK

调用 `ChatClient.init` 初始化 SDK。小程序环境下，SDK 默认会自动识别当前运行平台并装配小程序适配器。若运行在非标准宿主环境，或自动识别结果不符合预期，可通过 `platformAdapterOptions.prefer` 指定目标平台。

```typescript
const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
});
```

参数说明如下：

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `appKey` | String | 是 | 应用唯一标识，格式为 `org#app`。 |
| `managers` | Array | 否 | 初始化时注册的功能管理器列表。若需要使用消息和会话能力，需注册 `ChatManager`。 |
| `serviceConfig.serverUrls.restApiUrl` | String | 是 | REST API 服务地址。小程序中使用固定服务地址时需配置。 |
| `serviceConfig.serverUrls.wsUrl` | String | 是 | 消息长连接 WebSocket 地址。小程序中使用固定服务地址时需配置。 |
| `serviceConfig.serverUrls.syncRestApiUrl` | String | 否 | 会话、好友等同步能力使用的 REST API 地址。仅在服务端提供独立同步地址时配置。 |
| `serviceConfig.serverUrls.syncWsUrl` | String | 否 | 会话、好友等同步能力使用的 WebSocket 地址。仅在服务端提供独立同步地址时配置。 |
| `platformAdapterOptions.prefer` | String | 否 | 优先使用的平台适配类型。缺省时 SDK 自动识别运行环境。 |

:::tip
- 配置 `serviceConfig.serverUrls` 后，SDK 会直连指定服务地址，不再请求 DNS_CONFIG。`restApiUrl` 和 `wsUrl` 需同时配置。
- `serviceConfig.dnsConfigUrls` 和 `serviceConfig.serverUrls` 不能同时配置。
- `ChatClient` 为单例。如果已经初始化过，再修改初始化配置需要重启小程序或重新创建运行上下文。
:::

小程序平台适配类型可参考下表：

| 小程序平台 | `platformAdapterOptions.prefer` 取值 |
| :--- | :--- |
| 微信小程序 | `RUNTIME_PLATFORMS.WECHAT_MINIAPP` 或 `'wechat-miniapp'` |
| QQ 小程序 | `RUNTIME_PLATFORMS.QQ_MINIAPP` 或 `'qq-miniapp'` |
| 抖音/头条小程序 | `RUNTIME_PLATFORMS.TOUTIAO_MINIAPP` 或 `'toutiao-miniapp'` |
| 百度小程序 | `RUNTIME_PLATFORMS.BAIDU_MINIAPP` 或 `'baidu-miniapp'` |
| 支付宝小程序 | `RUNTIME_PLATFORMS.ALIPAY_MINIAPP` 或 `'alipay-miniapp'` |

### 步骤 7：登录 SDK

SDK 当前通过用户 ID 和 IM Token 登录。调用 `client.login` 时，需传入 `userId` 和 `token`。

```typescript
await client.login({
  userId: 'username',
  token: 'token',
});
```

登录成功后，`login` 返回的 Promise resolve，不携带返回值。若需要获取当前连接状态或当前登录用户 ID，可调用：

```typescript
console.log(client.getConnectionState());
console.log(client.getCurrentUserId());
```

:::tip
生产环境中，建议由你的应用服务器集成环信用户 Token 获取逻辑，客户端从应用服务器获取用户 Token 后再登录 SDK。不要在小程序客户端保存 App Token 或 App Secret。
:::

### 步骤 8：监听连接和消息事件

建议在登录前注册事件监听，以便及时感知连接状态变化、Token 状态和新消息。

```typescript
client.addEventHandler('miniapp-listener', {
  onConnecting: () => {
    console.log('正在连接');
  },
  onConnected: event => {
    console.log('连接成功:', event);
  },
  onDisconnected: event => {
    console.log('连接断开:', event);
  },
  onReconnectFailed: event => {
    console.log('自动重连失败:', event);
  },
  onTokenWillExpire: () => {
    console.log('Token 即将过期，请及时续期');
  },
  onTokenExpired: () => {
    console.log('Token 已过期，请重新获取 Token 后登录');
  }
});
```

### 步骤 9：验证消息收发

注册 `ChatManager` 后，可通过 `client.chatManager` 创建并发送消息。

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  content: 'hello',
});

await client.chatManager.sendMessage(message);
```

如需发送图片、语音、视频或文件消息，可将小程序文件对象传入对应消息创建接口，SDK 会通过小程序平台适配层完成附件上传。

## 平台限制与注意事项

以下限制主要来自小程序运行环境，不属于 SDK 接口差异。实际限制可能随小程序基础库版本变化，请以目标平台最新规则为准。

小程序对同时存在的 WebSocket 连接数量有限制。应用需合理管理连接生命周期，避免同一小程序内创建过多长连接。

## 后续步骤

完成 SDK 初始化和登录后，可继续集成消息、会话、用户关系、群组、聊天室、用户属性和推送等功能。小程序端的业务接口与 Web 端基本一致，差异主要体现在运行环境、合法域名配置和本地文件对象处理方式。

