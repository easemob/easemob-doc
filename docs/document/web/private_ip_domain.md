# 私有化 IP/域名配置

SDK 默认连接公有云服务。使用私有云时，需要在初始化 SDK 前配置私有云的 REST 地址以及 IM 长连接地址。

如果国内 2 区的公有云应用使用环信控制台分配的应用专属域名，请参见 [配置应用专属域名](initialization.html#配置应用专属域名)。本页介绍私有云部署的服务器地址配置。

私有云可使用固定服务地址模式，也可配置自定义 DNS 地址列表。

## 配置方式

### 固定服务地址

通过 `serviceConfig.serverUrls` 配置固定地址。至少需要提供：

- `restApiUrl`
- `wsUrl`

自 SDK **5.1.2** 起，同步 REST 请求复用 `restApiUrl`，数据同步 WebSocket 地址根据 REST 地址自动确定，无需再配置 `syncRestApiUrl`、`syncWsUrl`。使用本页两地址方案时，请采用 5.1.2 及以上版本。配置 `serverUrls` 后，SDK 使用指定的服务连接地址。

### DNS 发现

如果不传 `serviceConfig.serverUrls`，SDK 默认使用内置 DNS 配置。

如需自定义 DNS 配置，可传入 `serviceConfig.dnsConfigUrls`。

`serviceConfig.dnsConfigUrls` 和 `serviceConfig.serverUrls` 不能同时使用。

## 示例代码

```typescript
import { ChatClient, ChatManager } from 'easemob-websdk';

const client = ChatClient.init({
  appKey: 'your-org#your-app',
  managers: [ChatManager],
  serviceConfig: {
    serverUrls: {
      restApiUrl: 'https://rest.example.com',
      wsUrl: 'wss://ws.example.com',
    },
  },
});
```

## 读取当前固定地址

如果初始化时传入了 `serviceConfig.serverUrls`，可以通过 `client.getServerUrlsConfig()` 读取当前固定服务地址配置。
