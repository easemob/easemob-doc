# 私有云 SDK 集成配置

<Toc />

## 静态配置 IP（域名）地址

SDK 默认指向公有云地址，在部署私有云后，需要将地址重新指向到新的地址，以下是地址修改方法：

```java
EMOptions emOptions = new EMOptions();//实例化 EMOptions 对象
emOptions.setRestServer("10.10.10.10:00");//设置私有云 REST 地址（ip/域名：port）
emOptions.setIMServer("10.10.10.10");//设置私有云 IM 地址
emOptions.setImPort(00);//设置私有云 IM 端口号
emOptions.enableDNSConfig(false);//默认是 true，在私有云下，需要关闭（设置成 false）

EMClient.getInstance().init(context,emOptions);//最后初始化 SDK
```
:::NOTICE
如果需要配置 HTTPS 只需在 REST 地址前加一个前缀。
:::

```java
emOptions.setRestServer("https://10.10.10.10:00");//设置私有云 REST 地址（ip：port）
```

## 动态配置地址

1. 服务器端配置 DNS 地址表
2. 从服务器端动态获取地址

```java
EMOptions emOptions = new EMOptions();
emOptions.setDnsUrl("url");//从服务器端动态获取地址
EMClient.getInstance().init(context,emOptions);//初始化 SDK
```