# 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见 [环信控制台的相关文档](/product/console/app_create.html)。

## 初始化 SDK

初始化时通过传入 `appKey` 来获取 SDK 实例。

```javascript
import WebIM from "easemob-websdk";
const conn = new WebIM.connection({
  appKey: "Your appKey",
});
```

:::tip
1. `WebIM` 表示环信即时通信 IM SDK。
2. 对于特性或接口示例代码，`conn.方法名()` 中的 `conn` 为环信即时通信 IM SDK 实例。
:::

下表明确初始化 SDK 时的一些参数。全部参数详见 [API 参考](https://doc.easemob.com/apidoc/web/modules/Connection.html#ConnectionParameters)。

| 属性       | 类型 | 是否必需   | 描述            |
| :----------------- | :---------------- | :------ | :-------- |
| `appKey`    | String         | 是                   | `appkey` 为创建 app 时在环信控制台上注册的 app 唯一识别符。 |
| `apiUrl` | String | 按需 | 自 SDK 4.0.0 起支持。设置 REST API 基准地址。国内 2 区应用使用应用专属域名时需要配置，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `url` | String | 按需 | 自 SDK 4.0.0 起支持。设置完整消息 WSS URL，与 `apiUrl` 配合使用，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `isHttpDNS` | Boolean | 否 | 自 SDK 4.0.0 起支持。默认 `true`，SDK 自动获取服务地址，使用集群域名时无需修改。国内 2 区应用使用应用专属域名时的设置见 [配置应用专属域名](#配置应用专属域名)。 |
| `delivery`       | Boolean | 否   | 是否开启已送达回执。<br/> - `true`：开启。<br/> -（默认）`false`：关闭。           |
| `isFixedDeviceId`       | Boolean | 否   | 是否使用固定的设备标识（`deviceId`）。<br/> -（默认）`true`：SDK 对设备生成一个设备标识并存入本地存储，即对一个浏览器来说，所有 SDK 实例的连接都被认为是同一设备。 <br/> - `false`：每一个 SDK 实例连接时，使用随机字符串作为设备标识，即每个实例采用的不同的设备连接。该参数会影响多端登录互踢的策略，详见 [多设备登录文档](multi_device.html)。   |

## 配置应用专属域名

目前仅国内 2 区支持应用专属域名。国内 2 区应用的服务器域名分为两类：**集群域名** 由同一集群内的应用共用，**应用专属域名** 按应用分配。其他数据中心使用集群域名。域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

**自 2026 年 11 月 27 日起在国内 2 区创建的应用，必须使用为该应用分配的专属域名。**

使用集群域名时，SDK 默认自动获取服务地址，无需手动设置 REST 和消息长连接地址，保持 `isHttpDNS` 的默认值 `true` 即可。

国内 2 区应用使用应用专属域名时，需要使用当前应用的 REST 和 WebSocket 地址配置 SDK。Web SDK 自 **4.0.0** 起支持以下 REST 和 WebSocket 服务地址配置。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `apiUrl` | string | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `url` | string | 是 | 完整 WSS URL，包含 `/websocket` 路径，例如 `wss://ws-your-app.example.com/websocket`。 |
| `isHttpDNS` | boolean | 是 | 默认 `true`；本文设为 `false`，避免走默认服务地址发现流程。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。

```javascript
import WebIM from 'easemob-websdk';

const conn = new WebIM.connection({
  appKey: 'your-org#your-app',
  apiUrl: 'https://api-your-app.example.com',
  url: 'wss://ws-your-app.example.com/websocket',
  isHttpDNS: false,
});

conn.addEventHandler('domain-connection', {
  onConnected: () => console.log('消息连接已建立'),
  onDisconnected: () => console.log('消息连接已断开'),
});
```

控制台只给出 `wss://主机名` 时，在 `url` 中追加 `/websocket`；已有该路径时不要重复追加。小程序使用 V4.x 小程序构建包时，参数含义见 [小程序初始化](/v4/applet/initialization.html#配置应用专属域名)，并完成 [小程序合法域名配置](/v4/applet/serverconfig.html)。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [初始化后设置监听](#初始化后设置监听) 注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。


## 初始化后设置监听

初始化后，你可以设置所需的监听，例如，连接监听和接收消息的监听，及时知晓长连接的建立和消息的收发。

```javascript
conn.addEventHandler("connectionListener", {
  // SDK 成功连接到 IM 服务器时触发。
  onConnected: () => {
    console.log("连接成功");
  },
  // SDK 与 IM 服务器断开连接时触发。
  // 自 4.8.0 版本，`onDisconnected` 事件新增断开原因回调参数, 告知用户触发 `onDisconnected` 的原因。
  onDisconnected: () => {
    console.log("连接断开");
  },
  // SDK 与 IM 服务器正在连接时触发。
  onReconnecting: () => {
    console.log("重连中");
  },
});
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onTextMessage: function (message) {},
}); 
```


