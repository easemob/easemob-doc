# 私有云 SDK IP 地址/域名配置

<Toc />

## 静态配置 IP 地址/域名

SDK 默认指向公有云地址。部署私有云后，需要将地址重新指向新的地址，以下是地址修改方法：

### 方式一：TCP 连接

```java
EMOptions emOptions = new EMOptions();//实例化 EMOptions 对象
emOptions.setRestServer("10.10.10.10:00");//设置私有云 REST 地址（IP/域名：port）
emOptions.setIMServer("10.10.10.10");//设置私有云 IM 地址
emOptions.setImPort(00);//设置私有云 IM 端口号
emOptions.setEnableTLSConnection(true);//设置是否开启加密，TCP 连接为 TLS 加密

emOptions.enableDNSConfig(false);//默认是 true，在私有云下，需要关闭（设置成 false）
EMClient.getInstance().init(context,emOptions);//最后初始化 SDK
```

### 方式二：WebSocket 连接

```java
EMOptions emOptions = new EMOptions();//实例化 EMOptions 对象
emOptions.setRestServer("https://restaddress");//设置私有云 REST 地址（IP/域名：port）
emOptions.setWebSocketServer("im-api-wechat.easemob.com");//设置 WebSocket 服务器地址
emOptions.setWebSocketPort(443);//设置 WebSocket 服务器端口号
emOptions.setEnableTLSConnection(true);//设置是否开启加密，WebSocket为 WSS 协议

emOptions.enableDNSConfig(false);//默认是 true，在私有云下，需要关闭（设置成 false）
EMClient.getInstance().init(context,emOptions);//最后初始化 SDK
```

:::tip
如果需要配置 HTTPS，只需在 REST 地址前加一个前缀。
:::

```java
emOptions.setRestServer("https://10.10.10.10:00");//设置私有云 REST 地址（ip：port）
```

## 动态配置地址

1. 服务器端配置 DNS 地址表。
2. 从服务器端动态获取地址。

```java
EMOptions emOptions = new EMOptions();
emOptions.setDnsUrl("url");//从服务器端动态获取地址
EMClient.getInstance().init(context,emOptions);//初始化 SDK
```