# 私有云 SDK IP 地址/域名配置

## 静态配置 IP 地址/域名

SDK 默认启用 DNS 地址配置并连接公有云服务。自 HarmonyOS SDK 1.14.0 起，静态配置私有云时，需要在调用 `ChatClient#init` 前主动调用 `ChatOptions#setEnableDnsConfig(false)` 关闭 DNS 地址配置，并设置私有云的 REST 服务器及 IM TCP 或 WebSocket 服务器地址。此前该开关由 SDK 内部自动处理；如果使用 DNS 服务动态下发服务器地址，则应保持 DNS 地址配置开启，详见[动态配置地址](#动态配置地址)。

### 方式一：TCP 连接

```typescript
const options = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 设置私有云 REST 地址。根据部署配置填写域名或 IP 及端口。
options.setRestServer('https://rest.example.com:443');
// 设置私有云 IM TCP 服务器地址和端口。
options.setIMServer('im.example.com');
options.setImPort(443);
// 是否为 IM TCP 连接启用 TLS。
options.setEnableTLSConnection(true);
// 使用静态私有云地址时，关闭 SDK 的 DNS 地址配置。默认为 `true`。
options.setEnableDnsConfig(false);

// 使用上述配置初始化 SDK。
ChatClient.getInstance().init(context, options);
```

### 方式二：WebSocket 连接

```typescript
const options = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 设置私有云 REST 地址。使用 HTTPS 时需包含 https:// 前缀。
options.setRestServer('https://rest.example.com:443');
// 设置私有云 WebSocket 服务器地址和端口。
options.setWebSocketServer('ws.example.com');
options.setWebSocketPort(443);
// 是否为 WebSocket 连接启用 TLS。启用后使用 WSS。
options.setEnableTLSConnection(true);
// 使用静态私有云地址时，关闭 SDK 的 DNS 地址配置。
options.setEnableDnsConfig(false);

ChatClient.getInstance().init(context, options);
```

:::tip
REST 服务使用 HTTPS 时，REST 地址需包含 `https://` 前缀。`ChatOptions#setEnableTLSConnection(true)` 用于设置 IM TCP 或 WebSocket 连接是否启用 TLS，不会自动为 REST 地址补充 HTTPS 协议。
:::

```typescript
options.setRestServer('https://10.10.10.10:8080');
```

可调用 `ChatOptions#getEnableDnsConfig()` 查询当前配置。返回 `false` 表示已关闭 SDK 的 DNS 地址配置，SDK 将使用业务设置的私有云服务器地址。

### 配置数据同步第二通道

自 HarmonyOS SDK 1.14.0 起，如果私有云环境部署了数据同步第二通道，还可以通过以下方法设置该通道的 WebSocket 服务器地址和端口：

```typescript
// 仅在调用 setEnableDnsConfig(false) 且初始化 SDK 前设置有效。
options.setSyncDataWebSocketServer('sync-ws.example.com');
options.setSyncDataWebSocketPort(443);
```

服务器地址和端口请以私有云部署环境的实际配置为准。

## 动态配置地址

若私有云部署了用于下发服务地址的 DNS 服务，可在 SDK 初始化前设置 DNS 服务地址。SDK 默认启用 DNS 地址配置；使用动态地址配置时无需调用 `ChatOptions#setEnableDnsConfig(false)`。

```typescript
const options = new ChatOptions({
  appKey: 'your-org#your-app'
});

// 配置用于下发服务地址的 DNS 服务地址。
options.setDnsURL('https://dns.example.com');

ChatClient.getInstance().init(context, options);
```
