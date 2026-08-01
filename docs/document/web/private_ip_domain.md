# 私有化 IP/域名配置


如果你要接入私有部署环境，优先使用固定服务地址模式；如果仍希望走 DNS 发现流程，可配置自定义 DNS 地址列表。

## 配置方式

### 固定服务地址

通过 `serviceConfig.serverUrls` 配置固定地址。至少需要提供：

- `restApiUrl`
- `wsUrl`

如果还需要支持登录后自动同步会话、好友数据，建议同时配置：

- `syncRestApiUrl`
- `syncWsUrl`

配置 `serverUrls` 后，SDK 会直接连接这些地址，不再请求 DNS 配置。

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
      syncRestApiUrl: 'https://sync-rest.example.com',
      syncWsUrl: 'wss://sync-ws.example.com',
    },
  },
});
```

## 读取当前固定地址

如果初始化时传入了 `serviceConfig.serverUrls`，可以通过 `client.getServerUrlsConfig()` 读取当前固定服务地址配置。
