# 好友管理

环信桌面端 SDK 支持好友功能的集成，集成后可以进行如下操作：

- 好友处理

- 黑名单处理

- 监听联系人变更

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

好友管理模块为 EMContactManager ，由 EMClient 模块加载时主动创建，可以使用 EMClient 模块的 getContactManager 方法获取，代码如下：

```
var contactManager = emclient.getContactManager();
```

------

## 好友处理

好友处理包含以下处理操作：

- 获取好友列表

- 添加好友

- 删除好友

- 同意好友申请

- 拒绝好友申请

所有处理操作的示例下面会一一说明。

------

### 获取好友列表

好友列表可以从**本地**和**服务器**获取，各接口说明如下：

#### 从本地中获取

接口 API 如下：

```
/** 
 *  获取当前缓存中的好友列表，若缓存中没有则从数据库中获取
 * return 返回 ContactListResult
 */
allContacts()
```

调用方法如下：

```
let res = contactManager.allContacts();
console.log()
```

#### 从服务器获取

接口API如下：

```
/** 
 *  从服务端拉取好友列表,异步操作
 * return 返回 Promise 对象，response 参数为 ContactListResult
 */
getContactsFromServer()；
```

调用方法如下：

```
contactManager.getContactsFromServer().then(ContactListResult => {
  },(error) => {});
```

------

### 添加好友

接口API如下：

```
/** 
 *  添加好友 api，异步操作
 * param String,username 为对方用户名，输入参数
 * param String,message 为欢迎信息，输入参数，对方收到好友申请时可以看到
 * return Promise 对象,response 参数为 Result
 */
inviteContact(username, message);
```

调用方法如下：

```
contactManager.inviteContact("jwfan1", "welcome").then((res) => {
  },(error) => {})
```

------

### 删除好友

接口API如下：

```
/** 
 *  从好友列表移除好友 api，异步操作
 * param username 移除目标好友的用户名，输入参数
 * param keepConversation 移除好友后，是否保留会话，输入参数，布尔型，true 为保留，false 为不保留
 * return Promise 对象，response 参数 Result
 */
deleteContact(username,keepConversation);
```

调用方法如下：

```
contactManager.deleteContact("jwfan1", true).then((res) => {
  },(error) => {})
```

------

### 同意好友申请

接口 API 如下：

```
/** 
 *  用户收到好友申请后的操作，同意好友申请,异步操作
 * param username 发起好友申请的用户名，输入参数
 * return Promise 对象，response 参数为 Result
 */
acceptInvitation(username);
```

调用方法如下：

```
contactManager.acceptInvitation(username).then((res) => {
  },(error) => {})
```

------

### 拒绝好友申请

接口 API 如下：

```
/** 
 * 用户收到好友申请后的操作,拒绝好友申请,异步操作
 * param username 发起好友申请的用户名，输入参数
 * return Promise 对象，response 参数为 Result
 */
declineInvitation(username)
```

调用方法如下：

```
contactManager.declineInvitation(username).then((res) => {
  },(error) => {})
```

------

## 黑名单

黑名单包含以下处理操作：

- 获取黑名单

- 设置黑名单

- 移入黑名单

- 从黑名单移除

所有处理操作的示例下面会一一说明。

------

### 获取黑名单

黑名单列表可以从**本地**和**服务器**获取，各接口说明如下：

#### 从本地中获取

接口 API 如下：

```
/**  
 * 从本地获取用户的黑名单列表，黑名单的用户无法发送消息
 * return ContactListResult 黑名单列表，data 为 String 数组
 */
blacklist();
```

调用方法如下：

```
let res = contactManager.blacklist()
```

#### 从服务器获取

接口 API 如下：

```
/**  
 * 从服务器获取用户的黑名单列表，黑名单的用户无法发送消息
 * return Promise 对象，response 参数为 ContactListResult
 */
getBlackListFromServer();
```

调用方法如下：

```
contactManager.getBlackListFromServer().then((res) => {},(error) => {})
```

------

### 设置黑名单

接口 API 如下：

```
/** 
 *  设置用户的黑名单列表,异步操作
 * param blacklist 输入参数，黑名单列表，StringArray,["ID1","ID2"]
 * return Promise 对象，response 参数为 Result
 */
saveBlackList(blacklist);
```

调用方法如下：

```
contactManager.saveBlackList(['jwfan2', 'jwfan3']).then((res)=>{},(error) => {});
```

### 移入黑名单

接口 API 如下：

```
/** 
 *  添加用户到黑名单列表,异步操作
 * param username 输入参数，要添加的黑名单用户名，String
 * return Promise 对象，response 参数为 Result
 */
addToBlackList(username);
```

调用方法如下：

```
contactManager.addToBlackList('jwfan2').then((res)=>{},(error) => {});
```

------

### 从黑名单移除

接口 API 如下：

```
/**  
 * 从黑名单列表移除用户,异步操作
 * param username 输入参数，要从黑名单移除的用户名，String
 * return Promise 对象，response 参数为 Result
 */
removeFromBlackList(username);
```

调用方法如下：

```
contactManager.removeFromBlackList('jwfan2').then((res)=>{},(error) => {});
```

------

## 监听联系人变更

通过注册回调函数，监听联系人的变动，代码如下：

```
// 实例化监听对象
var listener = new easemob.EMContactListener();

// 有好友添加的回调
listener.onContactAdded((username) => {
console.log("onContactAdded username: " + username);
});

// 有好友删除的回调
listener.onContactDeleted((username) => {
console.log("onContactDeleted username: " + username);
});

// 收到好友申请的回调，用户可以在这里同意或拒绝好友申请
listener.onContactInvited((username, reason) => {
console.log("onContactInvited username: " + username + " reason: " + reason);
if (username == "jwfan1") {
  let res = contactManager.acceptInvitation(username);
} else {
  let res = contactManager.declineInvitation(username);
}
});

// 群组邀请成员同意
listener.onContactAgreed((username) => {
console.log("onContactAgreed username: " + username);
});

// 群组邀请成员拒绝
listener.onContactRefused((username) => {
console.log("onContactRefused username: " + username);
});

// 注册回调函数
contactManager.registerContactListener(listener);
<code>

===== 结束联系人监听 =====
<code>
// 移除回调监听
contactManager.removeContactListener(listener);
```