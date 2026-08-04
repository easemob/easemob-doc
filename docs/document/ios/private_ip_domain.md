# 私有云 SDK IP 地址/域名配置

使用私有云部署配置前，请引入 `EMOptions+PrivateDeploy.h`。以下配置均只能在调用 `initializeSDKWithOptions:` 时设置，运行期间不能动态修改。

## 静态配置 IP 地址/域名

SDK 默认指向公有云地址，在部署私有云后，需要将地址重新指向到新的地址，以下是地址修改方法：

### 方式一：TCP 连接

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:appkey];
options.enableDnsConfig = NO;
options.chatPort = 8080;//设置端口号
options.chatServer = @"xxx.xxx.xxx.xxx";//设置 IP 地址
options.restServer = @"xxx.xxx.xxx.xxx:8080";//设置ip:port
options.enableTLSConnection = YES;// 是否使用加密连接。TCP 连接为 TLS 加密
[[EMClient sharedClient] initializeSDKWithOptions:options];
```
### 方式二：WebSocket 连接

```objectivec
EMOptions* options = [EMOptions optionsWithAppkey:@"Your appkey"];
options.enableDnsConfig = NO;
options.restServer = @"https://restaddress";
options.webSocketServer = @"im-api-wechat.easemob.com";
options.webSocketPort = 443;
options.enableTLSConnection = YES;// 是否使用加密连接。webSocket 为 WSS 协议。
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

:::tip
如需只使用 HTTPS，请在调用 `initializeSDKWithOptions:` 前设置该属性。
:::

```objectivec
options.usingHttpsOnly = YES;
```

## 动态配置地址

1. 服务器端配置 DNS 地址表。
2. 设置服务器端配置的 URL 地址。

```objectivec
options.enableDnsConfig = YES;
options.dnsURL = @"xxxx";//设置服务器端配置的 URL 地址
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`optionsWithAppkey`](#静态配置-ip-地址-域名) | `EMOptions` | 创建 SDK 配置对象。 |
| [`enableDnsConfig`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 控制是否使用 DNS 配置；设为 `NO` 时使用静态服务器地址。 |
| [`chatServer`](#方式一-tcp-连接) | `EMOptions (PrivateDeploy)` | 设置 TCP Chat 服务器地址。 |
| [`chatPort`](#方式一-tcp-连接) | `EMOptions (PrivateDeploy)` | 设置 TCP Chat 服务器端口。 |
| [`restServer`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 设置 REST 服务器地址。 |
| [`webSocketServer`](#方式二-websocket-连接) | `EMOptions (PrivateDeploy)` | 设置 WebSocket 服务器地址。 |
| [`webSocketPort`](#方式二-websocket-连接) | `EMOptions (PrivateDeploy)` | 设置 WebSocket 服务器端口。 |
| [`enableTLSConnection`](#静态配置-ip-地址-域名) | `EMOptions (PrivateDeploy)` | 为 Chat 或 WebSocket 连接启用 TLS。 |
| [`usingHttpsOnly`](#静态配置-ip-地址-域名) | `EMOptions` | 仅使用 HTTPS 协议。 |
| [`dnsURL`](#动态配置地址) | `EMOptions (PrivateDeploy)` | 设置服务器端 DNS 地址表的 URL。 |
| [`initializeSDKWithOptions`](#静态配置-ip-地址-域名) | `EMClient` | 使用上述配置初始化 SDK。 |
