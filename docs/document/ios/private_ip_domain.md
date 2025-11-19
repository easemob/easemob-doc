# 私有云 SDK IP 地址/域名配置

<Toc />

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
```

:::tip
如果需要配置 HTTPS 只需加一个属性即可。
:::

```objectivec
options.usingHttpsOnly = YES;
```

## 动态配置地址

1. 服务器端配置 DNS 地址表。
2. 设置服务器端配置的 URL 地址。

```objectivec
options.dnsURL = @"xxxx";//设置服务器端配置的 URL 地址
```