# 私有云 SDK 集成配置

## Web Vue 3 Demo

对于 Web Vue Demo，进行私有化配置需在 [Vue 3 源代码](https://github.com/easemob/webim-vue-demo/tree/demo-vue3)中进行修改。

### 修改环境配置

在 `webim-vue-demo/src/IM/initwebsdk.js` 文件中，进行如下修改： 

```javascript
const DEFAULT_APPKEY = 'easemob#easeim';  	// 私有化的 App Key
const DEFAULT_URL = '//xxx.xxxxx.com';		// 私有化的 WebSocket 地址
const DEFAULT_APIURL = '//xxx.xxxxx.com'; 	// 私有化的 RESTful 服务器地址
```

### 修改登录方式

私有化环境使用用户名和密码登录，因此需在 `webim-vue-demo/src/views/Login/components/LoginInput/index.vue` 文件中取消注释 SDK 登录方式代码。 

```javascript
/* SDK 登陆的方式 */
  try {
    let { accessToken } = await EaseIM.conn.open({
      user: loginValue.username.toLowerCase(),
      pwd: loginValue.password.toLowerCase(),
    });
    window.localStorage.setItem(`EASEIM_loginUser`, JSON.stringify({ user: loginValue.username, accessToken: accessToken }))
  } catch (error) {
    console.log('>>>>登陆失败', error);
    const { data: { extraInfo } } = error
    handleSDKErrorNotifi(error.type, extraInfo.errDesc);
    loginValue.username = '';
    loginValue.username = '';
  }
  finally {
    buttonLoding.value = false;
  }
```

## 其他 Demo 

对于 webim-vue-demo，即 Vue 2 Demo 和 React Demo，需要在对应的 GitHub 地址中进行修改：

- [Vue 2 Demo 源码](https://github.com/easemob/webim-vue-demo/tree/dev-4.0)

- [React Demo 源码](https://github.com/easemob/webim)

### 修改环境配置

在 `WebIMConfig.js` 文件中，进行如下修改：

```javascript
appkey: 'easemob#easeim',	// 私有化的 App Key
isHttpDNS: false,	// 是否允许通过 DNS 获取。由于私有云需自己配置，这里必须为 `false`。
socketServer: '//xxx.xxxxx.com',  // 私有化的 WebSocket 地址
restServer: '//xxx.xxxxx.com',	// 私有化的 RESTful 服务器地址。对于 Uniapp 全平台，需要全局搜索，查找 `a1.easemob.com` 替换为 `restServer`。
```

### 修改 SDK 初始化配置

在 `WebIM.js` 文件中，进行如下修改：

```javascript
 url: WebIM.config.socketServer,
 apiUrl: WebIM.config.restServer,
 isHttpDNS：WebIM.config.isHttpDNS，  // 对于私有云，该参数必须为 `false`。
 // 其他配置可酌情添加
```



