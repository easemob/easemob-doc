# SDK 初始化

初始化是使用 SDK 的必要步骤,需在所有接口方法调用前完成。

## 前提条件

有效的环信即时通讯 IM 开发者账号和 App key，详见[环信控制台的相关文档](/product/console/app_create.html)。

## SDK 初始化

使用 SDK 前需要进行初始化，示例代码如下：

```javascript
const conn = new WebIM.connection({
  appKey: "your appKey",
  url: "wss://im-api-wechat.easemob.com/websocket",
  apiUrl: "https://a1.easemob.com",
  isHttpDNS: false, // 在小程序上需设置为false
});
```

初始化 SDK 参数说明：

| 参数       | 类型   | 是否必需 | 描述                               |
| :--------- | :----- | :------- | :--------------------------------- |
| `appKey`    | String     | 是      | 环信控制台为你的应用生成的唯一标识，由应用名称（`Appname`）和组织名称（`Orgname`）组成。                  |
| `isHttpDNS` | Bool | 否 | 自 SDK 4.12.0 起支持，默认 `true`，自动获取服务地址，使用集群域名时无需修改。国内 2 区应用使用应用专属域名时的设置见 [配置应用专属域名](#配置应用专属域名)。 |
| `delivery`         | Bool  | 否    | 是否开启送达回执：<br/> - `true`：开启；<br/> -（默认）`false`：关闭。      |
| `deviceId`           | String  | 否  | 设备 ID，为默认随机值。               |
| `useOwnUploadFun`   | Bool  | 否   | 是否支持通过自己的路径将图片、文件上传到自己的服务器。<br/> -`true`：支持，需要指定路径；<br/> -（默认）`false`：关闭，通过消息服务器上传下载文件。 |
| `autoReconnectNumMax` | Int  | 否 | 最大重连次数。      |
| `apiUrl` | String | 按需 | 自 SDK 4.0.0 起支持。设置 REST API 基准地址。国内 2 区应用使用应用专属域名时需要配置，详见 [配置应用专属域名](#配置应用专属域名)。 |
| `url` | String | 按需 | 自 SDK 4.0.0 起支持。设置完整消息 WSS URL，与 `apiUrl` 配合使用，详见 [配置应用专属域名](#配置应用专属域名)。 |

## 配置应用专属域名

目前仅国内 2 区支持应用专属域名。国内 2 区应用的服务器域名分为两类：**集群域名** 由同一集群内的应用共用，**应用专属域名** 按应用分配。其他数据中心使用集群域名。域名查看入口及展示规则见 [查看应用服务器域名](/product/console/app_manage.html#查看应用服务器域名)。

小程序 SDK 自 **4.12.0** 起默认自动获取服务地址。使用集群域名时，保持 `isHttpDNS` 的默认值 `true`，无需手动设置 `apiUrl` 和 `url`。使用更早版本，或显式将 `isHttpDNS` 设为 `false`（如本文的基础初始化示例）时，仍需手动填写当前应用的 REST 和 WebSocket 集群地址。

国内 2 区应用使用应用专属域名时，需要使用当前应用的 REST 和 WebSocket 地址配置 SDK。小程序 SDK 自 **4.0.0** 起支持以下 REST 和 WebSocket 服务地址配置。

#### 初始化前配置地址

在控制台进入目标应用的详情页，从 **开发配置信息 > 域名配置** 中复制 **REST API** 和 **Websocket** 地址，并使用同一页面的 App Key。请按以下格式填写 SDK 参数。

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `apiUrl` | string | 是 | REST API 基准地址，保留 `https://` 及实际端口，例如 `https://api-your-app.example.com`；不追加组织名、应用名或业务接口路径。 |
| `url` | string | 是 | 完整 WSS URL，包含 `/websocket` 路径，例如 `wss://ws-your-app.example.com/websocket`。 |
| `isHttpDNS` | boolean | 是 | 使用指定的服务连接地址时设为 `false`。自 SDK 4.12.0 起，HTTPDNS 默认开启。 |

:::notice
选择 **创建新的正式版应用** 上线时，正式版与测试版是两个应用，应从正式版详情页重新获取 App Key 和两项地址，不能只替换 App Key。详见 [应用上线](/product/console/app_launch.html#上线事项)。
:::

以下代码替换现有初始化入口中的配置。请沿用业务所需的其他初始化设置，不要在已经初始化后通过再次调用初始化接口切换地址。`WebIM` 为项目已引入的小程序 SDK 对象；沿用小程序构建包，不使用浏览器专用的 SDK 构建。

```javascript
const conn = new WebIM.connection({
  appKey: 'your-org#your-app',
  apiUrl: 'https://api-your-app.example.com',
  url: 'wss://ws-your-app.example.com/websocket',
  isHttpDNS: false,
});
```

控制台只给出 `wss://主机名` 时，在 `url` 中追加 `/websocket`；已有该路径时不要重复追加。请同时按 [配置服务器域名](serverconfig.html) 添加小程序合法域名，后台设置不能替代 SDK 地址配置。

#### 检查配置结果

地址设置方法和初始化接口不提供独立的“域名连接成功”回调。初始化完成后，按 [连接](connection.html) 文档注册连接监听，再按 [登录](login.html) 文档登录。确认连接成功，并通过 SDK 日志检查实际连接的服务主机。

分别验证消息收发、REST 请求和启用的自动同步功能。消息连接成功不代表所有请求和数据同步均已成功；失败时请记录错误信息，并对照 [错误码](error.html) 排查 App Key、域名、端口、TLS 和网络访问情况。

