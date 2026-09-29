# 私有云 SDK IP 地址/域名配置

SDK 默认连接公有云服务。使用私有云时，需要在初始化 SDK 前配置私有云的 REST 地址以及 IM 长连接地址。配置前，请引入 `EMOptions+PrivateDeploy.h`。

:::tip
自 SDK v5.1.0 起，数据同步 WebSocket 地址由 SDK 根据配置的私有云 REST 地址自动确定，无需单独配置。`EMOptions#syncDataWSHost` 和 `EMOptions#syncDataWSPort` 已移除。

`EMOptions#webSocketServer` 和 `EMOptions#webSocketPort` 配置的是 IM 长连接 WebSocket，并非数据同步 WebSocket。
:::

## 静态配置 IP 地址/域名

静态配置时，需要将 `EMOptions#enableDnsConfig` 设置为 `NO`，并根据 IM 长连接方式设置对应地址。以下地址和端口仅为示例，请替换为私有云部署提供的实际配置。

### 方式一：TCP 连接

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// 设置私有云 REST 地址。SDK 根据该地址自动确定数据同步 WebSocket 地址。
options.restServer = @"https://private-rest.example.com";

// 设置用于收发 IM 消息的 TCP 长连接地址和端口。
options.chatServer = @"private-im.example.com";
options.chatPort = 6717;
options.enableTLSConnection = YES; // 使用 TLS 加密 TCP 连接。

// 使用上述静态地址，不从 DNS 配置服务获取地址。
options.enableDnsConfig = NO;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

### 方式二：WebSocket 连接

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// 设置私有云 REST 地址。SDK 根据该地址自动确定数据同步 WebSocket 地址。
options.restServer = @"https://private-rest.example.com";

// 设置用于收发 IM 消息的 WebSocket 长连接地址和端口。
options.webSocketServer = @"private-im.example.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES; // 使用 WSS 加密连接。

// 使用上述静态地址，不从 DNS 配置服务获取地址。
options.enableDnsConfig = NO;

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 动态配置地址

1. 在私有云服务器端配置 DNS 地址表，其中包括 REST 和 IM 长连接地址。
2. 初始化 SDK 前，通过 `EMOptions#dnsURL` 设置 DNS 配置服务地址。

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];
options.dnsURL = @"https://private-dns.example.com/server.json";
options.enableDnsConfig = YES; // 默认值为 YES。
options.usingHttpsOnly = YES; // REST 请求仅使用 HTTPS。

[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`optionsWithAppkey`](#静态配置-ip-地址-域名) | `EMOptions` | 创建 SDK 配置对象。 |
| [`enableDnsConfig`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 控制是否使用 DNS 配置；设为 `NO` 时使用静态服务器地址。 |
| [`chatServer`](#方式一-tcp-连接) | `EMOptions (PrivateDeploy)` | 设置 TCP Chat 服务器地址。 |
| [`chatPort`](#方式一-tcp-连接) | `EMOptions (PrivateDeploy)` | 设置 TCP Chat 服务器端口。 |
| [`restServer`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 设置 REST 服务器地址；SDK 根据该地址自动确定数据同步 WebSocket 地址。 |
| [`webSocketServer`](#方式二-websocket-连接) | `EMOptions (PrivateDeploy)` | 设置 IM 长连接 WebSocket 服务器地址。 |
| [`webSocketPort`](#方式二-websocket-连接) | `EMOptions (PrivateDeploy)` | 设置 IM 长连接 WebSocket 服务器端口。 |
| [`enableTLSConnection`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 为 TCP 或 WebSocket IM 长连接启用 TLS。 |
| [`usingHttpsOnly`](#动态配置地址) | `EMOptions` | 仅使用 HTTPS 发送 REST 请求。 |
| [`dnsURL`](#动态配置地址) | `EMOptions (PrivateDeploy)` | 设置服务器端 DNS 地址表的 URL。 |
| [`initializeSDKWithOptions`](#静态配置-ip-地址-域名) | `EMClient` | 使用上述配置初始化 SDK。 |
