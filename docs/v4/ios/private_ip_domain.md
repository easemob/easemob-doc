# 私有云 SDK IP 地址/域名配置

<Toc />

SDK 默认连接公有云服务。使用私有云时，需要在初始化 SDK 前配置私有云的 REST 地址以及 IM 长连接地址。配置前，请引入 `EMOptions+PrivateDeploy.h`。

:::tip
iOS SDK 4.25.0 及以上版本中，数据同步 WebSocket 地址由 SDK 根据配置的私有云 REST 地址自动确定，无需单独配置。

`EMOptions#webSocketServer` 和 `EMOptions#webSocketPort` 配置的是 IM 长连接 WebSocket，并非数据同步 WebSocket。
:::

## 静态配置 IP 地址/域名

静态配置时，需要将 `EMOptions#enableDnsConfig` 设置为 `NO`，并根据 IM 长连接方式设置对应地址。以下地址和端口仅为示例，请替换为私有云部署提供的实际配置。

### 方式一：TCP 连接

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"your-org#your-app"];

// 设置私有云 REST 地址。SDK 根据该地址自动确定数据同步 WebSocket 地址。
options.restServer = @"https://private-rest.example.com";
options.usingHttpsOnly = YES; // REST 请求仅使用 HTTPS。

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
options.usingHttpsOnly = YES; // REST 请求仅使用 HTTPS。

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
options.dnsURL = @"https://private-dns.example.com";
options.enableDnsConfig = YES; // 默认值为 YES。
options.usingHttpsOnly = YES; // REST 请求仅使用 HTTPS。

[[EMClient sharedClient] initializeSDKWithOptions:options];
```
