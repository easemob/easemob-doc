# Private Deployment IP Address/Domain Name Configuration


To connect to a private deployment environment, we recommend using fixed service addresses. If you still want to use DNS discovery, configure a custom list of DNS addresses.

## Configuration methods

### Fixed service addresses

Configure fixed addresses through `serviceConfig.serverUrls`. You must provide at least:

- `restApiUrl`
- `wsUrl`

To also support automatic synchronization of conversations and friend data after login, we recommend providing:

- `syncRestApiUrl`
- `syncWsUrl`

After you configure `serverUrls`, the SDK connects directly to these addresses and no longer requests DNS configuration.

### DNS discovery

If you do not pass `serviceConfig.serverUrls`, the SDK uses its built-in DNS configuration by default.

To use custom DNS configuration, pass `serviceConfig.dnsConfigUrls`.

You cannot use `serviceConfig.dnsConfigUrls` and `serviceConfig.serverUrls` at the same time.

## Example code

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

## Retrieve the current fixed addresses

If you pass `serviceConfig.serverUrls` during initialization, call `client.getServerUrlsConfig()` to retrieve the current fixed service address configuration.
