# 私有云 SDK 集成配置

[[toc]]

## 静态配置 ip（域名）地址

SDK 默认指向公有云地址，在部署私有云后，需要将地址重新指向到新的地址，以下是地址修改方法：

```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:appkey];
options.enableDnsConfig = NO;
options.chatPort = 8080;//设置端口号
options.chatServer = "xxx.xxx.xxx.xxx";//设置ip
options.restServer = "xxx.xxx.xxx.xxx:8080";//设置ip:port
options.rtcUrlDomain= "wss://mprtc.easemob.com";//设置多人音视频的服务器域名，此为线上地址
[[EMClient sharedClient] initializeSDKWithOptions:options];
```

:::notice
如果需要配置 https 只需加一个属性即可
:::

```objectivec
options.usingHttpsOnly = YES;
```

## 动态配置地址

1. 服务器端配置 DNS 地址表
2. 设置服务器端配置的 URL 地址

```objectivec
options.dnsURL = @"xxxx";//设置服务器端配置的 URL 地址
```