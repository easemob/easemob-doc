# 概述

本页介绍 Web 集成相关内容。

## 前提条件

开始前，请注册有效的环信即时通讯 IM 开发者账号且获得 App key，请参见 [环信即时通讯云管理后台](https://console.easemob.com/user/login)。

## 集成环境

具体见 [开发环境要求](https://docs-im.easemob.com/ccim/web/quickstart#前提条件)。

## 导入 SDK

对于 JavaScript SDK，导入代码如下：

```javascript
import EC from 'easemob-websdk';
```

对于 TypeScript SDK，导入代码如下, EasemobChat 是 SDK 类型的命名空间。

```javascript
import EC, { EasemobChat } from 'easemob-websdk';
```

如果对 SDK 大小有要求，可根据功能按需导入 SDK 文件。

| 功能             | 导入文件                | 使用方式            |
| ---------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 联系人和消息管理 | import \* as contactPlugin from "easemob-websdk/publish/websdk/contact/contact";             | miniCore.usePlugin(contactPlugin, "contact");         |
| 群组        | import \* as groupPlugin from "easemob-websdk/publish/websdk/group/group";                   | miniCore.usePlugin(groupPlugin, "group");             |
| 聊天室      | import \* as chatroomPlugin from "easemob-websdk/publish/websdk/chatroom/chatroom";          | miniCore.usePlugin(chatroomPlugin, "chatroom");       |
| 子区        | import \* as threadPlugin from "easemob-websdk/publish/websdk/thread/thread";                | miniCore.usePlugin(threadPlugin, "thread");           |
| 翻译         | import \* as translationPlugin from "easemob-websdk/publish/websdk/translation/translation"; | miniCore.usePlugin(translationPlugin, "translation"); |
| 在线状态订阅     | import \* as presencePlugin from "easemob-websdk/publish/websdk/presence/presence";          | miniCore.usePlugin(presencePlugin, "presence");       |

示例代码如下：

```javascript
import MiniCore from 'easemob-websdk/publish/websdk/miniCore/miniCore';
import * as contactPlugin from 'easemob-websdk/publish/websdk/contact/contact';

const miniCore = new MiniCore({
	appKey: 'your appKey',
});

// "contact" 为固定值
miniCore.usePlugin(contactPlugin, 'contact');

// 获取联系人列表
miniCore.contact.getContacts();

// 添加监听事件
miniCore.addEventHandler('handlerId', {
	onTextMessage: (message) => {},
});

// 登录
miniCore.open({
	username: 'username',
	password: 'password',
});
```

## SDK 初始化

使用 SDK 前需要进行初始化，示例代码如下：

```javascript
const conn = new EC.connection({
	appKey: 'your appKey',
});
```

初始化 SDK 参数说明：

| 参数             | 描述                                                         |
| :----------| :----------------------------------------------------------- |
| appKey | 在管理后台注册的应用唯一标识。                                   |
| isHttpDNS   | 是否开启 DNS，防止 DNS 劫持。<br/> -（默认）`true`：开启 DNS；<br/> - `false`：关闭 DNS。  |
| delivery | 是否开启送达回执：<br/> - `true`：开启；<br/> -（默认）`false`：关闭。  |
| https | 是否支持通过 HTTPS 访问即时通讯 IM：<br/> - （默认）`true`：支持 HTTPS 和 HTTP；<br/> -`false`：浏览器根据使用的域名自行判断。  |
| heartBeatWait | 心跳间隔，单位为秒，默认为 30000 秒。  |
| deviceId | 设备 ID，为默认随机值。  |
| useOwnUploadFun | 是否支持通过自己的路径将图片、文件上传到自己的服务器。<br/> -`true`：支持，需要指定路径；<br/> -（默认）`false`：关闭，通过消息服务器上传下载文件。 |
| autoReconnectNumMax | 最大重连次数。  |
| apiUrl | 指定的 REST 服务器。在未开启 DNS 的情况下使用，一般适用于开发者要实现数据隔离、特别注重数据安全的场景。如有需求，请联系商务获取指定的服务器地址。  |
| url  | 指定的消息服务器。在未开启 DNS 的情况下使用，一般适用于开发者要实现数据隔离、特别注重数据安全的场景。如有需求，请联系商务获取指定的服务器地址。  |

## 注册用户

本节介绍三种用户注册方式。

### 控制台注册

控制台的注册请到 [这里](https://console.easemob.com/app/im-service/operative-service/user)。

### REST API 注册

请参考 [注册用户](https://docs-im.easemob.com/ccim/rest/accountsystem#注册用户)。

### SDK 注册

该方法需在 [控制台](https://console.easemob.com/app/im-service/detail) 设置允许 **开放注册**。

```javascript
conn.registerUser({
	/** 用户 ID。 */
	username: string;
	/** 密码。 */
	password: string;
	/** 显示昵称。用于移动端推送的时候通知栏显示。 */
	nickname?: string;
}).then((res) => {
  console.log(res)
})
```

## 用户登录

目前登录服务器有三种方式：

- **用户 ID + 密码**； 
- **用户 ID + token**； 
- **用户 ID + agoraToken**。

**注意**
- 使用 token 登录时需要处理 token 过期的问题，比如在每次登录时更新 token 等机制。
- Web 端只支持手动登录，不支持自动登录。

### **用户 ID +密码** 

**用户 ID +密码** 登录是传统的登录方式。用户 ID 和密码都是你的终端用户自行决定，密码需要符合密码规则要求。

```javascript
conn.open({
	user: 'username',
	pwd: 'password',
})
	.then(() => {
		console.log('login success');
	})
	.catch((reason) => {
		console.log('login fail', reason);
	});
```

### **用户 ID + token**

**用户 ID + token** 是更加安全的登录方式。token 可以通过调用 REST API 获取，详见 [环信用户 token 的获取](https://docs-im.easemob.com/ccim/rest/usertoken)。

```javascript
conn.open({
	user: 'username',
	accessToken: 'token',
})
	.then(() => {
		console.log('login success');
	})
	.catch((reason) => {
		console.log('login fail', reason);
	});
```

### **用户 ID + agoraToken**

**用户 ID + agoraToken** 是支持声网 token 直接登录的方式，一般同时使用声网和环信产品时利用该方法登录。token 获取请参考 [使用声网 user token 鉴权](https://docs.agora.io/en/agora-chat/generate_user_tokens?platform=React%20Native)。

```javascript
conn.open({
	user: 'username',
	agoraToken: 'agoraToken',
})
	.then(() => {
		console.log('login success');
	})
	.catch((reason) => {
		console.log('login fail', reason);
	});
```

## 退出登录

```typescript
conn.close();
```

## 连接状态相关

你可以通过注册连接监听器确认连接状态。

```javascript
conn.addEventHandler('handlerId', {
	onConnected: () => {
		console.log('onConnected');
	},
	onDisconnected: () => {
		console.log('onDisconnected');
	},
	onTokenWillExpire: () => {
		console.log('onTokenWillExpire');
	},
	onTokenExpired: () => {
		console.log('onTokenExpired');
	},
});
```

### 断网自动重连

如果由于网络信号弱、切换网络等引起的连接中断，系统会自动尝试重连。重连成功或者失败分别会收到 `onConnected` 和 `onDisconnected` 通知。

### 被动退出登录

对于 `onDisconnected` 通知，错误码（`errorCode`）可能为以下几种，建议 App 返回登录界面。

| 错误码            | 描述                                                         |
| :----------| :----------------------------------------------------------- |
| WEBIM_CONNCTION_USER_LOGIN_ANOTHER_DEVICE=206 | 用户已经在其他设备登录。                                 |
| WEBIM_CONNCTION_USER_REMOVED=207 | 用户账户已经被移除。                                 |
| WEBIM_CONNCTION_USER_KICKED_BY_CHANGE_PASSWORD=216 | 由于密码变更被踢下线。                                 |
| WEBIM_CONNCTION_USER_KICKED_BY_OTHER_DEVICE=217 | 由于其他设备登录被踢下线                                |


## 输出信息到日志文件

开启日志输出：

```javascript
logger.enableAll();
```

关闭日志输出：

```javascript
logger.disableAll();
```

设置日志输出等级：

```javascript
// 0 - 5 或者 'TRACE'，'DEBUG'，'INFO'，'WARN'，'ERROR'，'SILENT';
logger.setLevel(0);
```

设置缓存日志：

```javascript
logger.setConfig({
	useCache: false, // 是否缓存
	maxCache: 3 * 1024 * 1024, // 最大缓存字节
});
// 缓存全部等级日志
logger.setLevel(0);
```

下载日志：

```javascript
logger.download();
```
