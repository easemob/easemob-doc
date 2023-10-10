# 私有云SDK集成配置


## 静态配置ip（域名）地址

SDK 默认指向公有云地址，在部署私有云后，需要将地址重新指向到新的地址，以下是地址修改方法：

```
WebIM.conn = new websdk.connection({
    isHttpDNS: false, // 关闭DNS动态域名
    url: 'http://im-api-v2.easemob.com/ws', // 设置为私有云的websocket server url
    apiUrl: 'http://a1.easemob.com' // 设置为私有云的rest server url
})
```

注意：如果需要配置https只需将url、apiUrl指定为https协议：

```
WebIM.conn = new websdk.connection({
    isHttpDNS: false, // 关闭DNS动态域名
    url: 'https://im-api-v2.easemob.com/ws',
    apiUrl: 'https://a1.easemob.com'
})
```

## 动态配置地址

```
1.服务器端配置dns地址表
2.设置isHttpDNS = true
3.设置服务器端配置的url地址：WebIM.conn.dnsArr = ['dns server url']， 例如：['https://rs.easemob.com']
```

注意：发送请求时的url是在dnsArr中的url上拼接上了固定路径：'/easemob/server.json'