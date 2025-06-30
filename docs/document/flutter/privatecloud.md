# 私有云 SDK 集成配置

<Toc />

## 静态配置 IP（域名）地址

SDK 默认指向公有云地址，在部署私有云后，需要将地址重新指向到新的地址，以下是地址修改方法：

```java
void init() async {
    // 静态
    final options = ChatOptions(
      appKey: 'appkey',
      restServer: "10.10.10.10:00",
      imServer: "10.10.10.10",
      imPort: 0,
      enableDNSConfig: false,
    );
    await ChatClient.getInstance.init(options);
  }

```
:::tip
如果需要配置 HTTPS 只需在 REST 地址前加一个前缀。
:::


## 动态配置地址

1. 服务器端配置 DNS 地址表
2. 从服务器端动态获取地址

```java
void init() async {

    // 动态
    final options = ChatOptions(
      appKey: 'appkey',
      dnsUrl: "url",
    );

    await ChatClient.getInstance.init(options);
  }

```