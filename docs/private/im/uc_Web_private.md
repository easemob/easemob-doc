# 私有云 Web SDK 集成配置

## Web Vue 2 Demo

对于 Web Vue Demo，进行私有化配置需在 [Vue 2 Demo 源代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/zq/private-vue2-20230104.zip)中进行修改。

### 修改环境配置

在 `src/utils/WebIMConfig.js` 文件中，进行如下修改：

```javascript
appkey: 'easemob#easeim',	// 私有化的 App Key
isHttpDNS: false,	// 是否允许通过 DNS 获取。由于私有云需自己配置，这里必须为 `false`。
socketServer: 'https://xxx.xxxxx.com',  // 私有化的 WebSocket 地址
restServer: 'https://xxx.xxxxx.com',	// 私有化的 RESTful 服务器地址。对于 Uniapp 全平台，需要全局搜索，查找 `a1.easemob.com` 替换为 `restServer`。
```

### 修改 SDK 初始化配置

在 `src/utils/WebIM.js` 文件中，进行如下修改：

```javascript
 appKey: WebIM.config.appkey,
 url: WebIM.config.socketServer,
 apiUrl: WebIM.config.restServer,
 isHttpDNS：WebIM.config.isHttpDNS，  // 对于私有云，该参数必须为 `false`。
 // 其他配置可酌情添加
```

## Web Vue 3 Demo

对于 Web Vue 3 Demo，进行私有化配置需在 [Vue 3 Demo 源代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/zq/private-vue3-20230104.zip)中进行修改。

### 修改环境配置

在 `src/IM/initwebsdk.js` 文件中，进行如下修改：

```javascript
const DEFAULT_APPKEY = "easemob#easeim"; // 私有化的 App Key
const DEFAULT_URL = "https://xxx.xxxxx.com"; // 私有化的 WebSocket 地址
const DEFAULT_APIURL = "https://xxx.xxxxx.com"; // 私有化的 RESTful 服务器地址
```

## Web React Demo

对于 Web React Demo，进行私有化配置需在 [React Demo 源代码](https://download-sdk.oss-cn-beijing.aliyuncs.com/zq/private-demo-20230104.zip)中进行修改。

修改配置如下：

1. 在 `/demo/src/config/WebIMConfig.js` 中修改配置信息，如下所示：

```javascript
	appkey: appkey || 'easemob-demo#zim',
	isHttpDNS: false,
	restServer: rest.restServer || (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//xxx.xxxxx.com',
	restServer: rest.restServer || (window.location.protocol === 'https:' ? 'https:' : 'http:') + '//xxx.xxxxx.com',
```

2. 在 `/demo/src/config/WebIM.js` 中修改初始化配置，如下所示：

```javascript
    appKey: WebIM.config.appkey,
    url: WebIM.config.socketServer,
    apiUrl: WebIM.config.restServer,
```

然后，将 `if(WebIM.config.isSandbox)` 判断去掉，只使用 `options` 中配置的地址。
