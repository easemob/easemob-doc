# 私有云 SDK 集成配置

## 静态配置 IP（域名）地址

SDK 默认连接公有云服务。使用私有云时，应在初始化 SDK 前通过 `EMOptions` 配置私有云的 REST 和 IM 服务地址。使用静态地址配置时，需要调用 `enableDNSConfig(false)` 关闭 SDK 的 DNS 地址配置。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// REST 服务地址。使用 HTTPS 时需包含 https:// 前缀。
options.setRestServer("https://rest.example.com:443");
// IM 服务地址和端口。
options.setIMServer("im.example.com");
options.setImPort(443);
// 使用静态私有云地址时，关闭 SDK 的 DNS 地址配置。
options.enableDNSConfig(false);

EMClient.getInstance().init(context, options);
```
:::tip
REST 服务使用 HTTPS 时，REST 地址需包含 `https://` 前缀。
:::

```java
options.setRestServer("https://10.10.10.10:443");
```

## 动态配置地址

若私有云部署了用于下发服务地址的 DNS 服务，可在初始化 SDK 前设置 DNS 服务地址。SDK 默认启用 DNS 地址配置；使用动态地址配置时，无需调用 `enableDNSConfig(false)`。

```java
EMOptions options = new EMOptions();
options.setAppKey("your-org#your-app");
// 配置用于下发服务地址的 DNS 服务地址。
options.setDnsUrl("https://dns.example.com");
EMClient.getInstance().init(context, options);
```
