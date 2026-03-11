# 私有云 SDK IP 地址/域名配置

## Web Vue 3 Demo

对于 Web Vue 3 Demo，进行私有化配置需在 [Vue 3 Demo 源代码](https://github.com/easemob/webim-vue-demo/tree/vue3-miniCore) 中进行修改。

在 `src/IM/config/index.js` 文件中，修改环境配置：

```javascript
//环信appKey默认配置项
export const DEFAULT_EASEMOB_APPKEY = 'easemob#easeim';// 私有化的 App Key
export const DEFAULT_EASEMOB_SOCKET_URL = 'http://im-api-v2.easemob.com/ws';//私有化的 WebSocket 地址
export const DEFAULT_EASEMOB_REST_URL = 'ws://a1.easemob.com';//私有化的 RESTful 服务器地址
```

## Web React Demo

对于 Web React Demo，进行私有化配置需在 [React Demo 源代码](https://github.com/easemob/easemob-demo-react/tree/dev_4.0)中进行修改。

在 `easemob-demo-react/src/App.tsx` 中修改配置信息，如下所示：

```javascript
		initConfig={{
  		  appKey: 'easemob#easeim',// 私有化的 App Key
        isHttpDNS: false,//固定为 false
        restUrl:'http://a1.easemob.com',//私有化的 RESTful 服务器地址
        msyncUrl: 'ws://im-api-v2.easemob.com/ws',//私有化的 WebSocket 地址
		    useUserInfo: true,
        translationTargetLanguage: state.translationTargetLanguage,
      }}
```
