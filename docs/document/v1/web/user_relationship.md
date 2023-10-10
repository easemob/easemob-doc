# 好友管理

更新时间：2021-12-31

新版文档见：[用户关系管理](https://docs-im.easemob.com/ccim/web/relationship)。

好友管理能让您更好的体验 IM 功能，环信 Web IM SDK 支持好友体系管理，好友相关的操作如下：

- 查询好友列表

- 监听好友状态事件

- 添加好友

- 处理好友请求

- 删除好友

- 黑名单

多种好友体系的管理操作，覆盖丰富的集成场景。

------

## 参数解释

| 名称    | 字段名   | 数据类型 | 描述                                                 |
| :------ | :------- | :------- | :--------------------------------------------------- |
| 环信 ID | username | String   | 环信 ID 是环信用户的唯一标识，在 AppKey 的范围内唯一 |

## 查询好友列表

调用getRoster查询好友列表，示例代码如下：

```
conn.getRoster().then( (res) => {
  console.log(res) // res.data > ['user1', 'user2']
});
```

------

## 监听好友状态事件

通过在SDK conn.listen()中注册以下事件来监听好友状态, 示例代码如下：

```
conn.listen({
  onContactInvited: function(msg){}, // 收到好友邀请
  onContactDeleted: function(){}, // 被删除时回调此方法
  onContactAdded: function(){}, // 增加了联系人时回调此方法
  onContactRefuse: function(){}, // 好友请求被拒绝
  onContactAgreed: function(){} // 好友请求被同意
}）
```

------

## 添加好友

调用 addContact 添加好友，示例代码如下：

```
let message = '加个好友呗!';
conn.addContact('username', message);
```

------

## 处理好友请求

当收到**“添加好友”**的请求时，会有两种处理方式：

- 同意添加对方为好友

- 拒绝添加对方为好友

具体代码实现示例如下：

### 同意添加对方为好友

调用 acceptInvitation 同意添加好友，示例代码如下：

```
conn.acceptInvitation('username')
```

### 拒绝添加对方为好友

调用 declineInvitation 拒绝添加好友，示例代码如下：

```
conn.declineInvitation('username')
```

------

## 删除好友

调用 deleteContact 删除好友，代码示例如下：

```
conn.deleteContact('username');
```

------

## 黑名单

集成黑名单操作中，有以下几种黑名单功能操作：

- 将好友加入黑名单

- 获取黑名单列表

- 将好友移除黑名单

### 将好友加入黑名单

将好友加入黑名单后，对方好友列表依然可以看到己方，但无法向己方发送消息。

```
// 用户ID,添加一个为单个用户ID；批量添加为用户ID数组，如["user1","user2",...]
conn.addToBlackList({
  name:['user1','user2']
});
```

------

### 获取黑名单列表

调用 getBlacklist 函数获取好友黑名单列表，示例代码如下：

```
conn.getBlacklist().then((res)=>{
          console.log('>>>>>>获取黑名单成功',res);  // res.data > ['user1', 'user2']
        })
```

------

### 将好友移出黑名单

```
// 删除一个为单个用户ID；批量删除为用户ID数组，如["user1","user2"]
conn.removeFromBlackList({
  name: ['user1']
});
```