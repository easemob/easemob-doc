# 私有云接入配置

如果你的环境是私有部署，直接在 `ChatClient.init` 中配置 `serviceConfig.serverUrls` 即可。

## 配置方式

### 私有部署

私有部署场景下，通常使用固定服务地址模式：

- `restApiUrl`
- `wsUrl`

如果业务还需要登录后自动同步会话列表、好友列表及好友信息，建议继续补充：

- `syncRestApiUrl`
- `syncWsUrl`

### 使用 DNS 配置

如果你的部署方式仍依赖 DNS 发现，可改用 `serviceConfig.dnsConfigUrls`。  
SDK 默认会使用内置 DNS 配置，无需额外设置。

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

## 注意事项

- `serviceConfig.dnsConfigUrls` 与 `serviceConfig.serverUrls` 不能同时使用。
- 如果你需要读取当前固定地址，可调用 `client.getServerUrlsConfig()`。

更多初始化说明，详见 [初始化](initialization.html)。
