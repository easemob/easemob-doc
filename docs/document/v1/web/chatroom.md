# 聊天室管理

更新时间：2021-12-31

新版文档见：[聊天室管理](https://docs-im.easemob.com/ccim/web/chatroom1)。

环信聊天室模型支持默认最大成员数为5000，聊天室成员数可调整，请联系商务。 环信 Web IM SDK 支持聊天室管理功能的集成，集成后可以进行如下操作：

- 获取聊天室列表

- 加入聊天室

- 退出聊天室

- 发送消息

- 接收及处理消息

- 聊天室相关回调

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

## 创建聊天室

创建聊天室需要 [超级管理员权限](http://docs-im.easemob.com/im/server/basics/chatroom#管理超级管理员)， 调用“createChatRoom”函数创建聊天室，示例如下：

```
let options = {
    name: 'chatRoomName', // 聊天室名称
    description: 'description', // 聊天室描述
    maxusers: 200, // 聊天室成员最大数（包括聊天室创建者），默认值200，聊天室人数最大默认5000。
    members: ['user1', 'user2'] // 聊天室成员，此属性为可选的，但是如果加了此项，数组元素至少一个
}
conn.createChatRoom(options).then((res) => {
    console.log(res)
})
```

------

## 销毁聊天室

销毁聊天室需要 [超级管理员权限](http://docs-im.easemob.com/im/server/basics/chatroom#管理超级管理员)， 调用“destroyChatRoom”函数销毁聊天室，示例如下：

```
let options = {
    chatRoomId: '1234567890'   // 聊天室id
}
conn.destroyChatRoom(options).then((res) => {
    console.log(res)
})
```

## 获取聊天室列表

调用`getChatRooms`函数获取聊天室列表，示例如下：

```
// 列出所有聊天室，支持分页查询
let option = {
    pagenum: 1,                                 // 页数
    pagesize: 20                                // 每页个数
};
conn.getChatRooms(option).then((res) => {
    console.log(res)
})
```

------

## 获取聊天室详情

调用`getChatRoomDetails`函数获取聊天室详情，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId'   // 聊天室id
}
conn.getChatRoomDetails(options).then((res) => {
    console.log(res)
})
```

## 更改聊天室详情

调用`modifyChatRoom`函数更改聊天室详情，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId',     // 聊天室id
    chatRoomName: 'chatRoomName', // 聊天室名称
    description: 'description',   // 聊天室描述
    maxusers: 200                 // 聊天室最大人数
}
conn.modifyChatRoom(options).then((res) => {
    console.log(res)
})
```

## 加入聊天室

调用`joinChatRoom`加入聊天室，示例如下：

```
let options = {
    roomId: 'roomId',   // 聊天室id
    message: 'reason'   // 原因（可选参数）
}
conn.joinChatRoom(options).then((res) => {
    console.log(res)
})
```

------

## 退出聊天室

调用`quitChatRoom`退出聊天室，示例如下：

```
let options = {
    roomId: 'roomId' // 聊天室id
}
conn.quitChatRoom(options).then((res) => {
    console.log(res)
})
```

------

## 获取聊天室成员

调用`listChatRoomMember`分页获取聊天室成员，示例如下：

```
let options = {
    pageNum: 1,
    pageSize: 10,
    chatRoomId: 'chatRoomId'
}
conn.listChatRoomMember(options).then((res) => {
    console.log(res)
})
```

## 设置聊天室管理员

调用`setChatRoomAdmi`设置聊天室管理员，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId', // 聊天室id
    username: 'user1'         // 用户id
}
conn.setChatRoomAdmin(options).then((res) => {
    console.log(res)
})
```

## 移除聊天室管理员

调用`removeChatRoomAdmin`移除聊天室管理员，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId', // 聊天室id
    username: 'user1'         // 用户id
}
conn.removeChatRoomAdmin(options).then((res) => {
    console.log(res)
})
```

## 获取聊天室下所有管理员

调用`getChatRoomAdmin`获取聊天室下所有管理员，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId'   // 聊天室id
}
conn.getChatRoomAdmin(options).then((res) => {
    console.log(res)
})
```

## 发送消息

见[发送消息](https://docs-im.easemob.com/im/web/basics/message#发送消息)。

------

## 聊天室公告

聊天室公告管理包含以下处理操作：

- 上传/修改聊天室公告

- 获取聊天室公告

所有处理操作的示例下面会一一说明。

### 上传/修改聊天室公告

调用updateChatRoomAnnouncement函数上传/修改聊天室公告，示例如下：

```
let options = {
    roomId: 'roomId',                 // 聊天室id   
    announcement: 'hello everyone'    // 公告内容                        
};
conn.updateChatRoomAnnouncement(options).then((res) => {
    console.log(res)
})
```

------

### 获取聊天室公告

调用`fetchChatRoomAnnouncement`函数获取聊天室公告，示例如下：

```
var options = {
    roomId: 'roomId'            // 聊天室id                          
};
conn.fetchChatRoomAnnouncement(options).then((res) => {
    console.log(res)
})
```

------

## 聊天室禁言

### 将成员禁言

调用`muteChatRoomMember`禁止聊天室用户发言，示例如下：

```
let options = {
    chatRoomId: "chatRoomId", // 聊天室id
    username: 'username',     // 被禁言的聊天室成员的id
    muteDuration: -1000       // 被禁言的时长，单位ms，如果是“-1000”代表永久
};
conn.muteChatRoomMember(options).then((res) => {
    console.log(res)
})
```

------

### 将成员解除禁言

调用`removeMuteChatRoomMember`解除聊天室用户禁言，示例如下：

```
let options = {
    chatRoomId: "1000000000000", // 聊天室id
    username: 'username'         // 解除禁言的聊天室成员的id
};
conn.removeMuteChatRoomMember(options).then((res) => {
    console.log(res)
})
```

------

### 获取聊天室所有禁言成员

调用`getChatRoomMuted`获取聊天室下所有被禁言的成员，示例如下：

```
let options = {
    chatRoomId: "chatRoomId" // 聊天室id
};
conn.getChatRoomMuted(options).then((res) => {
    console.log(res)
})
```

------

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
// 聊天室中禁言所有成员
let options = {
    chatRoomId: "chatRoomId"  // 聊天室id
};
conn.disableSendChatRoomMsg(options).then((res) => {
    console.log(res)
})

// 聊天室中解除所有成员禁言
conn.enableSendChatRoomMsg(options).then((res) => {
    console.log(res)
})
```

------

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以运行白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
// 添加用户到白名单
let options = {
    chatRoomId: "chatRoomId",   // 聊天室id
    users: ["user1", "user2"]   // 成员id列表
};
conn.addUsersToChatRoomWhitelist(options);

// 将用户从白名单移除
let options = {
    chatRoomId: "chatRoomId",  // 群组id
    userName: "user"           // 要移除的成员
}
conn.rmUsersFromChatRoomWhitelist(options);

// 从服务器获取白名单成员列表
let options = {
    chatRoomId: "chatRoomId"   // 聊天室id
}
conn.getChatRoomWhitelist(options);

// 查询成员是否是白名单用户，操作权限：app admin可查询所有用户；app user可查询自己
let options = {
    chatRoomId: "chatRoomId", // 聊天室id
    userName: "user"          // 要查询的成员
}
conn.isChatRoomWhiteUser(options);
```

------

## 黑名单管理

黑名单管理包含以下处理操作：

- 将成员加入群黑名单（单个）

- 将成员加入群黑名单（批量）

- 将成员移除群组黑名单（单个）

- 将成员移除群组黑名单（批量）

- 获取聊天室黑名单

所有处理操作的示例下面会一一说明。

### 将成员加入聊天室黑名单（单个）

调用chatRoomBlockSingle将单个成员加入聊天室黑名单，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId',       // 聊天室id
    username: 'username'            // 将要被加入黑名单的用户名
};
conn.chatRoomBlockSingle(options);
```

------

### 将成员加入聊天室黑名单（批量）

调用chatRoomBlockMulti将单个成员加入聊天室黑名单，示例如下：

```
let options = {
    chatRoomId: 'chatRoomId',          // 聊天室id
    usernames: ['user1', 'user2']      // 用户id数组
};
conn.chatRoomBlockMulti(options);
```

------

### 将成员移除聊天室黑名单（单个）

调用`removeChatRoomBlockSingle`将单个成员从聊天室黑名单中移除，示例如下：

```
let options = {
    chatRoomId: "chatRoomId",                     // 群组id              
    username: "user"                              // 需要移除的用户名
}
conn.removeChatRoomBlockSingle(options);
```

------

### 将成员移除聊天室黑名单（批量）

调用`removeChatRoomBlockMulti`将成员批量从聊天室黑名单中移除，示例如下：

```
let options = {
    chatRoomId: "chatRoomId",                      // 聊天室id
    usernames: ["user1", "user2"]                  // 需要移除的用户名数组
}
conn.removeChatRoomBlockMulti(options);
```

------

### 获取聊天室黑名单

调用`getChatRoomBlacklistNew`获取聊天室黑名单，示例如下：

```
let options = {
    chatRoomId: "chatRoomId",                    // 聊天室id
};
conn.getChatRoomBlacklistNew(options);
```

------

## 接收及处理消息

- 群聊接收及处理消息同单聊;

- 消息体与单聊消息根据 message 的 type 进行区分;

- 单聊为：chat，群聊为：groupchat，聊天室为：chatroom;

- 根据消息的类型进行不同处理即可。

## 聊天室事件监听

可以在注册的监听事件onPresence里监听聊天室相关的事件：

```
conn.listen({
  onPresence: function(msg){
    switch(msg.type){
    case 'rmChatRoomMute':
      // 解除聊天室一键禁言
      break;
    case 'muteChatRoom':
      // 聊天室一键禁言
      break;
    case 'rmUserFromChatRoomWhiteList':
      // 删除聊天室白名单成员
      break;
    case 'addUserToChatRoomWhiteList':
      // 增加聊天室白名单成员
      break;
    case 'deleteFile':
      // 删除聊天室文件
      break;
    case 'uploadFile':
      // 上传聊天室文件
      break;
    case 'deleteAnnouncement':
      // 删除聊天室公告
      break;
    case 'updateAnnouncement':
      // 更新聊天室公告
      break;
    case 'removeMute':
      // 解除禁言
      break;
    case 'addMute':
      // 禁言
      break;
    case 'removeAdmin':
      // 移除管理员
      break;
    case 'addAdmin':
      // 添加管理员
      break;
    case 'changeOwner':
      // 转让聊天室
      break;
    case 'leaveChatRoom':
      // 退出聊天室
      break;
    case 'memberJoinChatRoomSuccess':
      // 加入聊天室
      break;
    case 'leave':
      // 退出群
      break;
    case 'join':
      // 加入群
      break;
    default:
      break;
  }}
})
```

------