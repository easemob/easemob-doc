# 私有云 SDK IP 地址/域名配置

## 静态配置 IP 地址/域名

SDK 默认连接公有云服务。使用私有云时，应在初始化 SDK 前通过 `EMOptions` 配置私有云的 REST 和 IM 服务地址。静态配置私有云地址时，需要调用 `enableDNSConfig(false)` 关闭 SDK 的 DNS 地址配置。

### 方式一：TCP 连接

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// REST 服务地址。根据私有云部署配置填写域名或 IP 及端口。
options.setRestServer("https://rest.example.com:443");
// IM 服务地址和 TCP 端口。
options.setIMServer("im.example.com");
options.setImPort(443);
// 是否为 IM 连接启用 TLS。
options.setEnableTLSConnection(true);
// 使用静态私有云地址时，关闭 SDK 的 DNS 地址配置。
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

### 方式二：WebSocket 连接

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// REST 服务地址。使用 HTTPS 时需包含 https:// 前缀。
options.setRestServer("https://rest.example.com:443");
// WebSocket 服务地址和端口。
options.setWebSocketServer("ws.example.com");
options.setWebSocketPort(443);
// 是否为 WebSocket 连接启用 TLS。启用后使用 WSS。
options.setEnableTLSConnection(true);
// 使用静态私有云地址时，关闭 SDK 的 DNS 地址配置。
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

:::tip
REST 服务使用 HTTPS 时，REST 地址需包含 `https://` 前缀。`setEnableTLSConnection(true)` 用于设置 IM TCP 或 WebSocket 连接是否启用 TLS，不会自动为 REST 地址补充 HTTPS 协议。
:::

```java
options.setRestServer("https://10.10.10.10:443");
```

## 动态配置地址

若私有云部署了用于下发服务地址的 DNS 服务，可在 SDK 初始化前设置 DNS 服务地址。SDK 默认启用 DNS 地址配置；使用动态地址配置时无需调用 `enableDNSConfig(false)`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// 配置用于下发服务地址的 DNS 服务地址。
options.setDnsUrl("https://dns.example.com");
EMClient.getInstance().init(context, options);
```
