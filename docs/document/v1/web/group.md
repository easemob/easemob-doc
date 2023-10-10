# 群组

更新时间：2021-12-31

新版文档见：[群组管理](https://docs-im.easemob.com/ccim/web/group1)。

环信 Web IM SDK 支持群组功能的集成，集成后可以进行如下操作：

- 群组管理

- 群成员管理

- 加群处理

- 禁言管理

- 黑名单管理

- 群消息管理

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

**注意：**

从 Web SDK V1.4.11 开始，群组管理的接口都已更新了 Rest 版本，V1.4.10 (包括V1.4.10)以下版本仍然保留 XMPP 版本，如果需要继续使用XMPP 版本的接口，请参考[群组管理](https://docs-im.easemob.com/im/400webimintegration/40groupchat)

**SDK从3.3.0版本开始支持promise, 3.3.0版本之前采用回调的方式，如使用promise报错请检查SDK版本。**

**注意**：`1、群主+管理员 一起一共不超过100个，也就是不超过99个管理员。2、群组成员最大数（包括群主）取决于所选择的版本，不同版本最大数不同。`

------

------

## 群组管理

群组管理包含以下处理操作：

- 获取用户加入的群组列表

- 分页获取公开群

- 创建群组

- 获取群组信息

- 修改群组信息

- 移除成员

- 解散群组

- 退出群组

所有处理操作的示例下面会一一说明。

### 获取用户加入的群组列表

调用`getGroup`函数获取当前登录用户加入的群组列表，示例如下：

```
// 列出当前登录用户加入的所有群组
conn.getGroup().then((res) => {
    console.log(res)
})
```

------

### 分页获取公开群

调用`listGroups`函数分页获取APP下所有的公开群组列表，示例如下：

```
let limit = 20,
    cursor = globalCursor;
let options = {
    limit: limit,                                            // 预期每页获取的记录数
    cursor: cursor,                                          // 游标
};
conn.listGroups(options).then((res) => {
    console.log(res)
})
```

**注意：**

- cursor: 如果数据还有下一页，API 返回值会包含此字段，传递此字段可获取下一页的数据，默认为`null`，为`null`时获取第一页数据

------

### 创建群组

调用`createGroupNew`函数创建群组，示例代码如下

```
let options = {
    data: {
        groupname: 'groupName',          // 群组名
        desc: 'group description',       // 群组描述
        members: ['user1', 'user2'],     // 用户名组成的数组
        public: true,                    // pub等于true时，创建为公开群
        approval: true,                  // approval为true，加群需审批，为false时加群无需审批
        allowinvites: allowInvites,      // true：允许群成员邀请人加入此群，false：只有群主才可以往群里加人 注意公开群（public：true),则不允许群成员邀请别人加入此群
        inviteNeedConfirm: false         // 邀请加群，被邀请人是否需要确认。true 为需要被邀请者同意才会进群
    },
    success(res){},
    error(err){},
};
conn.createGroupNew(options).then((res) => {
    console.log(res)
})
```

**注意：**

- 创建群组成功后会在回调函数里调用`onCreateGroup`函数

------

### 获取群组信息

调用 `getGroupInfo` 根据群组 ID 获取群组详情，示例如下：

```
let options = {
    groupId: 'groupId'    // 群组id
};
conn.getGroupInfo(options).then((res) => {
    console.log(res)
})
```

------

### 修改群组信息

只有群组的管理员可以修改群组名称和群组简介，调用`modifyGroup`修改群组信息，示例如下：

```
// 修改群信息
let option = {
    groupId: 'groupId',
    groupName: 'ChangeTest',                         // 群组名称
    description: 'Change group information test'     // 群组简介
};
conn.modifyGroup(option).then((res) => {
    console.log(res)
})
```

**注意：**

- 在获取群组时候就可以获取群管理员的 ID ，从而前端可决定是否显示修改信息按钮。

------

### 移除群组成员

只有群组的管理员可以移除群组成员，调用`removeSingleGroupMember`移除群组成员，示例如下：

```
// 移除群组成员
let option = {
    groupId: 'groupId',
    username: 'username'                         // 群组成员名称
};
conn.removeSingleGroupMember(option).then((res) => {
    console.log(res)
})
```

------

### 解散群组

- 只有群组的管理员有权限将成员踢出群组；

- 群组解散后，所有群成员均退出该群。

调用`dissolveGroup`解散群组，示例如下：

```
// 解散一个群组
let option = {
    groupId: 'groupId'
};
conn.dissolveGroup(option).then((res) => {
    console.log(res)
})
```

**注意：**

- 在获取群组时候就可以获取群管理员的ID，从而前端可决定是否显示解散按钮。

------

### 退出群组

群成员可以主动退出群组，调用`quitGroup`退出群组，示例如下：

```
// 成员主动退出群
let option = {
    groupId: 'groupId' 
};
conn.quitGroup(option).then((res) => {
    console.log(res)
})
```

------

## 群公告管理

群公告管理包含以下处理操作：

- 上传/修改群公告

- 获取群公告

所有处理操作的示例下面会一一说明。

### 上传/修改群公告

调用updateGroupAnnouncement函数上传/修改群公告，示例如下：

```
let options = {
    groupId: 'groupId',                 // 群组id   
    announcement: 'announcement'        // 公告内容                        
};
conn.updateGroupAnnouncement(options).then((res) => {
    console.log(res)
})
```

------

### 获取群公告

调用fetchGroupAnnouncement函数获取群公告，示例如下：

```
let options = {
    groupId: 'groupId'            // 群组id                          
};
conn.fetchGroupAnnouncement(options).then((res) => {
    console.log(res)
})
```

------

## 群文件管理

群文件管理包含以下处理操作：

- 上传群文件

- 下载群文件

- 删除群文件

- 获取群文件列表

所有处理操作的示例下面会一一说明。

### 上传群文件

调用uploadGroupSharedFile函数上传群文件，示例如下：

```
let options = {
    groupId: 'groupId',                        // 群组id 
    file: file,                                // <input type="file"/>获取的file文件对象                         
    onFileUploadProgress: function(resp) {},   // 上传进度的回调
    onFileUploadComplete: function(resp) {},   // 上传完成时的回调
    onFileUploadError: function(e) {},         // 上传失败的回调
    onFileUploadCanceled: function(e) {}       // 上传取消的回调
};
conn.uploadGroupSharedFile(options);
```

------

### 下载群文件

调用downloadGroupSharedFile函数下载群文件，示例如下：

```
let options = {
    groupId: 'groupId',                        // 群组id 
    fileId: 'fileId',                          // 文件id                        
    onFileDownloadComplete: function(resp) {}, // 下载成功的回调
    onFileDownloadError: function(e) {},       // 下载失败的回调
};
conn.downloadGroupSharedFile(options);
```

------

### 删除群文件

调用deleteGroupSharedFile函数删除群文件，示例如下：

```
let options = {
    groupId: 'groupId',                        // 群组id 
    fileId: 'fileId'                           // 文件id                        
};
conn.deleteGroupSharedFile(options).then((res) => {
    console.log(res)
})
```

------

### 获取群文件列表

调用fetchGroupSharedFileList函数获取群文件列表，示例如下：

```
let options = {
    groupId: 'groupId'                 // 群组id                        
};
conn.fetchGroupSharedFileList(options).then((res) => {
    console.log(res)
})
```

------

## 群成员管理

群成员管理包含以下处理操作：

- 查询群组成员

- 将成员设为管理员

- 将管理员撤销

- 获取群组下所有管理员

所有处理操作的示例下面会一一说明。

### 查询群组成员

调用`listGroupMember`函数分页获取当前群组的所有成员，示例如下：

```
let pageNum = 1,
    pageSize = 1000;
let options = {
    pageNum: pageNum,                                               // 页码
    pageSize: pageSize,                                             // 预期每页获取的记录数
    groupId: 'groupId'                                       
};
conn.listGroupMember(options).then((res) => {
    console.log(res)
})
```

------

### 将成员设为管理员

调用`setAdmin`将成员设为管理员，示例如下：

```
let options = {
    groupId: "groupId",            // 群组id
    username: "user"               // 用户名
};
conn.setAdmin(options).then((res) => {
    console.log(res)
})
```

------

### 将管理员撤销

调用`removeAdmin`将管理员撤销，示例如下：

```
let options = {
    groupId: "groupId",             // 群组id
    username: "user"                // 用户名
};
conn.removeAdmin(options).then((res) => {
    console.log(res)
})
```

------

### 获取群组所有管理员

调用`getGroupAdmin`获取群组下所有管理员，示例如下：

```
let options = {
    groupId: "groupId"                 // 群组id
};
conn.getGroupAdmin(options).then((res) => {
    console.log(res)
})
```

------

## 加群处理

加群包含以下处理操作：

- 将好友加入群组

- 向群组发出入群申请

- 同意用户加入群

- 拒绝用户加入群

所有处理操作的示例下面会一一说明。

### 将好友加入群组

管理员可以将好友加入群组。调用`inviteToGroup`将好友加入群组，示例如下：

```
let option = {
    users: ['user1', 'user2'],
    groupId: 'groupId'
};
conn.inviteToGroup(option).then((res) => {
    console.log(res)
})
```

------

### 向群组发出入群申请

调用`joinGroup`向群组发出入群申请，示例如下：

```
let options = {
    groupId: "groupId",         // 群组ID
    message: "I am Tom"         // 请求信息
};
conn.joinGroup(options).then((res) => {
    console.log(res)
})
```

------

### 同意用户加入群

只有管理员才有权限同意用户加入群组的请求。

调用`agreeJoinGroup`同意用户加群请求，示例如下：

```
let options = {
    applicant: 'userId',                          // 申请加群的用户名
    groupId: 'groupId'                            // 群组ID
};
conn.agreeJoinGroup(options).then((res) => {
    console.log(res)
})
```

------

### 拒绝用户加入群

只有管理员才有权限拒绝用户加入群组的请求。

调用`rejectJoinGroup`拒绝用户加群请求，示例如下：

```
let options = {
    applicant: 'user',                 // 申请加群的用户名
    groupId: 'groupId'                 // 群组ID
};
conn.rejectJoinGroup(options).then((res) => {
    console.log(res)
})
```

------

## 禁言管理

禁言管理包含以下处理操作：

- 将成员禁言

- 将成员解除禁言

- 获取群组下禁言成员

所有处理操作的示例下面会一一说明。

### 将成员禁言

调用`mute`将成员禁言，示例如下：

```
let options = {
    username: "user",                      // 成员用户名
    muteDuration: 886400000,               // 禁言的时长，单位是毫秒
    groupId: "groupId"
};
conn.mute(options).then((res) => {
    console.log(res)
})
```

------

### 将成员解除禁言

调用`removeMute`将成员解除禁言，示例如下：

```
let options = {
    groupId: "groupId",                  // 群组ID
    username: "user"                     // 成员用户名
};
conn.removeMute(options).then((res) => {
    console.log(res)
})
```

------

### 获取群组下禁言成员

调用`getMuted`获取群组下所有被禁言的成员，示例如下：

```
let options = {
    groupId: "groupId"                // 群组ID
};
conn.getMuted(options).then((res) => {
    console.log(res)
})
```

------

### 开启和关闭全员禁言

owner和管理员可以开启和关闭全员禁言。

```
//群组中禁言所有成员
let options = {
    groupId: "groupId", //群组id
};
conn.disableSendGroupMsg(options).then((res) => {
    console.log(res)
})

//群组中解除所有成员禁言
conn.enableSendGroupMsg(options).then((res) => {
    console.log(res)
})
```

------

### 白名单管理

可以将用户添加到白名单中，用户白名单在管理员开启了全员禁言时生效，可以运行白名单用户发出消息。 另外可以将用户移出白名单，检查自己是否在白名单中以及获取白名单列表。

```
//添加用户到白名单
let options = {
    groupId: "groupId",          // 群组id
    users: ["user1", "user2"]    // 成员id列表
};
conn.addUsersToGroupWhitelist(options);

//将用户从白名单移除
let options = {
    groupId: "groupId", // 群组id
    userName: "user"    // 要移除的成员
}
conn.rmUsersFromGroupWhitelist(options);

//从服务器获取白名单成员列表
let options = {
    groupId: "groupId"  // 群组id
}
conn.getGroupWhitelist(options);

//查询群成员是否是白名单用户，操作权限：app admin可查询所有用户；app user可查询自己
let options = {
    groupId: "groupId", // 群组id
    userName: "user"    // 要查询的成员
}
conn.isGroupWhiteUser(options);
```

------

## 黑名单管理

黑名单管理包含以下处理操作：

- 将成员加入群黑名单（单个）

- 将成员加入群黑名单（批量）

- 将成员移除群组黑名单（单个）

- 将成员移除群组黑名单（批量）

- 获取群组黑名单

所有处理操作的示例下面会一一说明。

### 将成员加入群黑名单（单个）

调用`groupBlockSingle`将单个成员加入群组黑名单，示例如下：

```
let options = {
    groupId: 'groupId',                     // 群组ID
    username: 'username'                    // 将要被加入黑名单的用户名
};
conn.groupBlockSingle(options).then((res) => {
    console.log(res)
})
```

------

### 将成员加入群黑名单（批量）

调用`groupBlockMulti`将成员批量加入群组黑名单，示例如下：

```
let options = {
    groupId: 'groupId',                           // 群组ID
    usernames: ['user1', 'user2', ...users]       // 将要被加入黑名单的用户名数组
};
conn.groupBlockMulti(options).then((res) => {
    console.log(res)
})
```

------

### 将成员移除群组黑名单（单个）

调用`removeGroupBlockSingle`将单个成员从群组黑名单中移除，示例如下：

```
let options = {
    groupId: "groupId",                     // 群组ID              
    username: "user"                        // 需要移除的用户名
}
conn.removeGroupBlockSingle(options).then((res) => {
    console.log(res)
})
```

------

### 将成员移除群组黑名单（批量）

调用`removeGroupBlockMulti`将成员批量从群组黑名单中移除，示例如下：

```
let options = {
    groupId: "groupId",                         // 群组ID
    username: ["user1", "user2"]                // 需要移除的用户名数组
}
conn.removeGroupBlockMulti(options).then((res) => {
    console.log(res)
})
```

------

### 获取群组黑名单

调用`getGroupBlacklistNew`获取群组黑名单，示例如下：

```
// 获取群组黑名单
let option = {
    groupId: 'groupId',
};
conn.getGroupBlacklistNew(option).then((res) => {
    console.log(res)
})
```

------

## 群组事件监听

可以在注册的监听事件onPresence里监听群组相关的事件：

```
conn.listen({
  onPresence: function(msg){
    switch(msg.type){
    case 'rmGroupMute':
      // 解除群组一键禁言
      break;
    case 'muteGroup':
      // 群组一键禁言
      break;
    case 'rmUserFromGroupWhiteList':
      // 删除群白名单成员
      break;
    case 'addUserToGroupWhiteList':
      // 增加群白名单成员
      break;
    case 'deleteFile':
      // 删除群文件
      break;
    case 'uploadFile':
      // 上传群文件
      break;
    case 'deleteAnnouncement':
      // 删除群公告
      break;
    case 'updateAnnouncement':
      // 更新群公告
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
      // 转让群组
      break;
    case 'direct_joined':
      // 直接被拉进群
      break;
    case 'leaveGroup':
      // 退出群
      break;
    case 'memberJoinPublicGroupSuccess':
      // 加入公开群成功
      break;
    case 'removedFromGroup':
      // 从群组移除
      break;
    case 'invite_decline':
      // 拒绝加群邀请
      break;
    case 'invite_accept':
      // 接收加群邀请（群含权限情况）
      break;
    case 'invite':
      // 接收加群邀请
      break;
    case 'joinPublicGroupDeclined':
      // 拒绝入群申请
      break;
    case 'joinPublicGroupSuccess':
      // 同意入群申请
      break;
    case 'joinGroupNotifications':
      // 申请入群
      break;
    case 'leave':
      // 退出群
      break;
    case 'join':
      // 加入群
      break;
    case 'deleteGroupChat':
      // 解散群
      break;
    default:
      break;
  }}
})
```

------

## 群消息

群消息包含以下处理操作：

- 发送消息

- 接收及处理消息

所有处理操作下面会一一说明。

### 发送消息

见[发送消息](https://docs-im.easemob.com/im/web/basics/message#发送消息)。

### 接收及处理消息

- 群聊接收及处理消息同单聊;

- 消息体与单聊消息根据 message 的 type 进行区分;

- 单聊为：chat，群聊为：groupchat，聊天室为：chatroom;

- 根据消息的类型进行不同处理即可。