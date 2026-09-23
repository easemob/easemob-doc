# 私有云 SDK IP 地址/域名配置

<Toc />

SDK 默认连接公有云服务。使用私有云时，需要在初始化 SDK 前配置私有云的 REST 地址以及 IM 长连接地址。

:::tip
Android SDK 4.25.0 及以上版本中，数据同步 WebSocket 地址由 SDK 根据配置的私有云 REST 地址自动确定，无需单独配置。

`EMOptions#setWebSocketServer` 和 `EMOptions#setWebSocketPort` 配置的是 IM 长连接 WebSocket，并非数据同步 WebSocket。
:::

## 静态配置 IP 地址/域名

静态配置时，需要关闭 DNS 动态配置，并根据 IM 长连接方式设置对应地址。

以下地址和端口仅为示例，请替换为私有云部署提供的实际配置。若 REST 服务使用 HTTPS，应在地址中显式添加 `https://`；未指定协议时，SDK 按 HTTP 处理。

### 方式一：TCP 连接

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");

// 设置私有云 REST 地址。
options.setRestServer("https://private-rest.example.com");

// 设置用于收发 IM 消息的 TCP 长连接地址和端口。
options.setIMServer("private-im.example.com");
options.setImPort(6717);
options.setEnableTLSConnection(true); // 使用 TLS 加密 TCP 连接。

// 使用上述静态地址，不从 DNS 配置服务获取地址。
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

### 方式二：WebSocket 连接

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");

// 设置私有云 REST 地址。
options.setRestServer("https://private-rest.example.com");

// 设置用于收发 IM 消息的 WebSocket 长连接地址和端口。
options.setWebSocketServer("private-im.example.com");
options.setWebSocketPort(443);
options.setEnableTLSConnection(true); // 使用 WSS 加密连接。

// 使用上述静态地址，不从 DNS 配置服务获取地址。
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```

## 动态配置地址

1. 在私有云服务器端配置 DNS 地址表，其中包括 REST 和 IM 长连接地址。
2. 初始化 SDK 前，通过 `EMOptions#setDnsUrl` 设置 DNS 配置服务地址。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
options.setDnsUrl("https://private-dns.example.com/server.json");
options.enableDNSConfig(true); // 默认值为 true。

EMClient.getInstance().init(context, options);
```
