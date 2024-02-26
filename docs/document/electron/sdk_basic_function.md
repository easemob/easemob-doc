# SDK基础功能

## 加载SDK

直接加载 index.js 模块,代码如下：

```
var easemob = require('../../node/index');
```

------

## 用户登录

登录前，需要先创建配置对象和 client 对象，用户可以使用 **用户名+密码** 和 **用户名+token** 两种方式登录。

### 创建配置对象

```
/**  
 * 首先构造 sdk 配置信息
 * param1 为资源存储路径，输入参数
 * param2 为工作路径，输入参数，日志存储在这里
 * param3 为 appkey ，输入参数，easemob-demo#chatdemoui 为 DemoAppKey ，需填写自己的 Appkey
 * param4 为设备 ID ，默认 0
 * return 配置模块对象
 */
var emchatconfigs = new easemob.EMChatConfig(".", ".", "easemob-demo#chatdemoui", 0);
```

### 创建 client 对象

```
var emclient = new easemob.EMClient(emchatconfigs);
```

#### 用户名+密码登录方式代码如下：

```
/** 
 *  密码登录 api ,异步操作
 * param username 为用户名，输入, String
 * param password 为密码，输入, String
 * return 返回 Promise 对象，response 参数为 #Result
 */
login(username, password)
```

调用用方法如下：

```
emclient.login("jwfan", "jwfan").then((res) =>{
if(res.code == 0)
  console.log("login success");
},(error) => {});
```

#### 用户名+token 登录方式代码如下：

```
/** 
 *  token 登录 api ,异步操作
 * param username 用户名，输入, String
 * param token 用户 token ,输入, String
 * return 返回 Promise 对象，response 参数为 #Result
 */
loginWithToken(username, token)
```

调用方法如下：

```
emclient.loginWithToken("jwfan", "Mytoken").then((res) =>{
if(res.code == 0)
  console.log("login success");
},(error) => {});
```

登录接口返回值 ret 为 EMError 对象，登录成功则 ret 的 errorCode 为 0，否则可以用 description 获取错误信息 登录后获取用户信息方法如下：

```
// 获取用户信息，包括用户名，密码，token
var loginInfo = emclient.getLoginInfo();
console.log("loginInfo.loginUser = " + loginInfo.loginUser);
console.log("loginInfo.loginPassword = " + loginInfo.loginPassword);
console.log("loginInfo.loginToken = " + loginInfo.loginToken);
```

------

## 用户退出

用户退出代码如下：

```
// 返回退出结果 EMError 对象
emclient.logout().then((res) => {
if(res.code == 0)
  console.log("logout success");
},(error) => {});
```

------

## 用户注册

接口API如下：

```
/** 
 *  账户注册api，异步操作
 * param username 用户名，输入,String
 * param password 密码，输入,String
 * return Promise对象，该对象的response参数为Result
 */
createAccount(username, password);
<code>

调用方法如下：
<code>
emclient.createAccount("newAccount","password").then((res) => {
  if(res.errorCode == 0)
      console.log("createAccount success");
  else
      console.log("createAccount fail:" + res.description);
  },(error) => {})
```

------

## 连接监听管理

通过注册回调函数，可以监听 SDK 的连接与断开状态，在用户登录成功后调用，代码如下

```
// 实例化监听模块
var listener = new easemob.EMConnectionListener();
// 添加到client
emclient.addConnectionListener(listener);

// 连接成功，什么都不需要做
listener.onConnect(() => {
console.log("EMConnectionListener onConnect");
});

// 连接断开，可能是断网或异地登录被踢，可通过error.errorCode判断，若为206，即为被踢,需要退出登录
listener.onDisconnect((res) => {
console.log(res.errorCode);
console.log(res.description);
console.log("EMConnectionListener onDisconnect");
if(res.errorCode == 206)
    emclient.logout();
    console.log("你的账户已在其他地方登录");
});

// 移除监听
emclient.removeConnectionListener(listener);
```

------

## 系统配置

系统配置信息模块为 EMChatConfig ，可以使用 emclient 的 getChatConfigs() 接口获取

```
let config = emclient.getChatConfigs();
```

配置信息包括日志路径，资源路径、下载路径、是否自动同意好友申请、是否自动同意组邀请、退出群组时是否删除消息等，[详见](https://github.com/easemob/sdkdemoapp_windows/blob/electron/jsdoc/out/EmChatConfigs.html)

------

## 私有化部署

sdk 提供私有化部署中的服务器设置接口，私有化部署设置使用 api 中的 **EMChatPrivateConfigs**，可以由系统配置模块的 **privateConfigs** 接口获取，代码如下：

```
let privateconfigs = config.privateConfigs();
```

**EMChatPrivateConfigs** 使用属性配置服务器部署信息，设置及获取的方法如下：

```
privateconfigs.enableDns=false;
privateconfigs.chatServer="192.168.1.100";
privateconfigs.chatPort=5000;
privateconfigs.restServer="http://192.168.1.101:5001";
privateconfigs.resolverServer="http://192.168.1.101:5002";
console.log(privateconfigs.enableDns);
console.log(privateconfigs.chatServer);
console.log(privateconfigs.chatPort);
console.log(privateconfigs.restServer);
console.log(privateconfigs.resolverServer);
```

------

## 日志输出

SDK 提供输出到日志文件的 js 接口，需要先创建 EMLog 对象，可以输出 String 和数字，代码如下：

```
// 实例化日志对象，日志按等级可分为error,warn,Debug 3级
var log = new easemob.EMLog();

// 设置日志等级，0为debug，1为warn,2为error
log.setLogLevel(0);

// 可以控制日志是否输出到控制台,默认不输出
log.setIsDisplayOnConsole(true);

//输出日志
log.Log("Log Test");
log.Log(5);
log.Debug("Debug Test");
log.Debug(5);
log.Warn("Warn Test");
log.Warn(5);
log.Error("Error Test");
log.Error(5);
```

**注：**由于 EMChatConfig 对象创建时会指定日志输出路径，日志对象的创建一般放到 EMChatConfig 创建之后。

Windows 桌面端日志生成在 c:/用户/{user}/AppData/Roaming/{ProcessName}/easemob-desktop/easemobLog 路径下的`easemob.log`，{user}为操作系统用户名，{ProcessName}为进程名称，热启动时为**electron**，安装后启动时为**IM-SDK桌面端Demo**。

Mac 桌面端日志生成在 /Users/{user}/Library/Application Support/{ProcessName}/easemob-desktop/easemobLog 路径下的`easemolog.log`，{user}为操作系统用户名，{ProcessName}为进程名称，热启动时为**electron**，安装后启动时为**IM-SDK桌面端Demo**。