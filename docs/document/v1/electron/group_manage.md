# 群组管理

环信桌面端 SDK 支持群组功能的集成，集成后可以进行如下操作：

- 获取群组

- 群组管理

- 群成员管理

- 加群处理

- 群消息

- 群文件

- 群组变更的监听

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

群组管理模块为 EMGroupManager ，由 EMClient 模块加载时主动创建，可以使用 EMClient 模块的 getGroupManager 方法获取，代码如下

```
var groupManager = emclient.getGroupManager();
```

------

## 获取群组

获取群组包含以下处理操作：

- 本地获取群组

- 服务器获取群组

- ID 获取群组

- 获取群组信息

- 获取公开群组

- 查找公开群组

所有处理操作的示例下面会一一说明。

------

### 本地获取群组

本地获取用户所在的所有群组，接口 API 如下：

```
/**  
 * 本地获取用户所有的组
 * return GroupListResult
 */
allMyGroups()
```

调用方法如下:

```
let res = groupManager.allMyGroups()
```

------

### 服务器获取群组

服务器获取用户所在的所有群组，接口 API 如下：

```
/**  
 * 服务器获取用户所有的组
 * return 返回 Promise 对象，response 参数为 GroupListResult
 */
fetchAllMyGroups()
```

调用方法如下:

```
groupManager.fetchAllMyGroups().then((res)=>{},(error) => {});
```

------

### ID 获取群组

根据 ID 获取群组

```
let group = groupManager.groupWithId(groupId);
```

------

### 获取群组信息

```
// 获取组 ID
console.log("group.groupId" + group.groupId());
// 获取组名
console.log("group.groupSubject" + group.groupSubject());
// 获取组描述
console.log("group.groupDescription" + group.groupDescription());
// 获取群主
console.log("group.groupOwner" + group.groupOwner());
// 获取成员计数
console.log("group.groupMembersCount" + group.groupMembersCount());
// 获取群设置类型
console.log("group.groupMemberType" + group.groupMemberType());
// 获取群成员
console.log("members:"+group.groupMembers().join(' || '));
// 获取群设置对象
var set = group.groupSetting();
console.log("set.style() = " + set.style());
console.log("set.maxUserCount() = " + set.maxUserCount());
console.log("set.extension() = " + set.extension());
```

------

### 获取公开群组

接口 API 如下：

```
/**  
 * 分页获取公开群组
 * param pageNum 第几页，输入参数，Number，0表示不分页，获取所有公开组，1为分页起始
 * param pageSize 每页计数，输入参数，Number,最大200
 * return 返回 Promise 对象，response 参数为 GroupListResult
 */
fetchPublicGroupsWithPage(pageNum, pageSize);
```

调用方法如下:

```
groupManager.fetchPublicGroupsWithPage(1,20).then((res) => {
  },(error) => {})
```

------

### 查找公开群组

接口 API 如下：

```
/**  
 * 根据群 ID 查找公开群
 * param1 groupId 群组 ID，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
searchPublicGroup(groupId);
```

调用方法如下:

```
groupManager.searchPublicGroup(groupId).then((res) => {
  },(error) => {})
```

------

## 群组管理

群组管理包含以下处理操作：

- 创建群组

- 解散群组

- 退出群组

- 转移群组

- 修改群信息

- 群组公告管理

所有处理操作的示例下面会一一说明。

------

### 创建群组

创建群组时，需要先实例化一个群组设置对象，然后创建群组。实例化群组设置接口 API 如下：

```
/**  
 * 实例化区群组设置
 * param style 组类型, Number ,0为私有群，只有群主可以邀请成员加入，1为私有群，成员也可以邀请成员加入，2为公开群，但申请入群需要群主同意，3为公开群，成员可以随意申请加入
 * param maxUserCount 最大成员数, Number ，最大200
 * param inviteNeedConfirm 邀请是否需要确认，Bool
 * param extension 扩展信息，String
 * return 返回组设置对象
 */
EMMucSetting(style, maxUserCount, inviteNeedConfirm, extension)
```

调用方法如下：

```
var setting = new easemob.EMMucSetting(1, 20, false, "test");
```

创建群组接口 API 如下：

```
/** 
  * 创建群组 api
  * param subject 群组名称，输入参数，String
  * param description 群组描述，输入参数，String
  * param welcomeMessage 欢迎信息，输入参数，String
  * param setting 群组设置，输入参数，Object
  * param members 群组初始成员，输入参数，StringArray
  * return 返回 Promise 对象，response 参数为 GroupResult
  */
createGroup(subject, description, welcomeMessage, setting, members)
```

调用方法如下:

```
groupManager.createGroup("subject","description","welcome message",setting,["jwfan1", "jwfan2"]).then((res) => {},(error) => {})
```

------

### 解散群组

接口 API 如下：

```
/**  
 * 解散群组 api
 * param groupId 组 ID，输入参数
 * return 返回 Promise 对象，response 参数为 Result
 */
destroyGroup(groupId);
```

调用方法如下:

```
groupManager.destroyGroup("55139673112577").then((res)=>{},(error) => {})
```

------

### 退出群组

接口 API 如下：

```
/** 
 *  成员主动退出群组
 * param groupId 群组 ID，输入参数，String
 * 返回 Promise 对象，response 参数为 Result
 */
leaveGroup(groupId)
```

调用方法如下:

```
groupManager.leaveGroup(groupId).then((res)=>{},(error) => {})
```

------

### 转移群组

接口 API 如下：

```
/**  
 * 转移群主，只有群主能操作
 * param groupId 群组ID，输入参数，String
 * param member 新群主用户名，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
transferGroupOwner(groupId, member)
```

调用方法如下:

```
groupManager.transferGroupOwner(groupId, member).then((res) =>{},(error) => {});
```

------

### 修改群组信息

接口 API 如下：

```
/**  
 * 修改群标题
 * param groupId 群组 ID ，输入参数，String
 * param newSubject 群组新组名，输入参数，String
 * return 返回 Promise对象，response 参数为 GroupResult
 */
groupManager.changeGroupSubject(groupId, newSubject);


/** 
 *  修改群描述
 * param groupId 群组 ID，输入参数，String
 * param newDescription 群组新描述，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
changeGroupDescription(groupId, newDescription)
```

调用方法如下:

```
groupManager.changeGroupSubject(groupId, "new Subject", error).then((res) =>{},(error) => {});
groupManager.changeGroupDescription(groupId, "new Description", error).then((res) =>{},(error) => {});
```

------

### 群组公告管理

接口 API 如下：

```
/**  
 * 设置群组公告
 * param groupId 群组 ID，输入参数，String
 * param announcement 群组公告，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
updateGroupAnnouncement(groupId, announcement,error)

/**  
 * 获取群组公告
 * param groupId 群组 ID，输入参数，String
 * return 返回 Promise 对象，response 参数为 AnnouncementResult
 */
fetchGroupAnnouncement(groupId)
```

调用方法如下:

```
groupManager.fetchGroupAnnouncement(groupId).then((res) =>{},(error) => {}); groupManager.updateGroupAnnouncement(groupId, "new announcement").then((res) =>{},(error) => {});
```

------

## 群成员管理

群成员管理包含以下处理操作：

- 群成员邀请

- 群成员移除

- 添加管理员

- 删除管理员

- 获取禁言成员列表

- 成员禁言

- 取消成员禁言

- 加入群组黑名单

- 从群组黑名单移除

所有处理操作的示例下面会一一说明。

------

### 群成员邀请

接口 API 如下：

```
/**  
 * 邀请成员入群，一次可邀请多个成员
 * param groupId 群组 ID，输入参数，String
 * param members 邀请的成员，输入参数，StringArray,["ID1","ID2"]
 * param welcomeMessage 欢迎信息，输入参数，String
 * 返回 Promise 对象，response 参数为 GroupResult
 */
addGroupMembers(groupId, members, welcomeMessage);
```

调用方法如下:

```
groupManager.addGroupMembers(groupId, ["jwfan3", "jwfan4"], "hahaha").then((res)=>{},(error) => {})
```

------

### 群成员移除

接口 API 如下：

```
/** 
 *  将成员踢出群，同样可踢出多人
 * param groupId 群组ID，输入参数，String
 * param members 踢出的成员，输入参数，StringArray,["ID1","ID2"]
 * 返回 Promise 对象，response 参数为 Result
 */
removeGroupMembers(groupId, members, error);
```

调用方法如下:

```
groupManager.removeGroupMembers(groupId, ["jwfan3", "jwfan4"]).then((res)=>{},(error) => {})
```

------

### 添加管理员

接口 API 如下：

```
/**  
 * 将普通群成员提升为管理员
 * param groupId 群组 ID，输入参数，String
 * param member 成员用户名，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
addGroupAdmin(groupId, member)
```

调用方法如下:

```
groupManager.addGroupAdmin(groupId, member).then((res) =>{},(error) => {});
```

------

### 删除管理员

接口 API 如下：

```
/**  
 * 将管理员降级为普通成员
 * param groupId 群组ID，输入参数，String
 * param member 管理员用户名，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
removeGroupAdmin(groupId, member)
```

调用方法如下:

```
groupManager.removeGroupAdmin(groupId, member).then((res) =>{},(error) => {});
```

------

### 获取禁言列表

接口API如下：

```
/**  
 * 获取禁言列表
 * param groupId 群组 ID，输入参数，String
 * param pageNum 第几页，输入参数，Number，1为起始页
 * param pageSize 每页计数，输入参数，Number，最大200
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
fetchGroupMutes(groupId, pageNum, pageSize)
```

------

### 群组禁言

接口API如下：

```
/**  
 * 将成员加入禁言列表，被禁言的成员无法在群组内发消息
 * param {String} groupId 群组ID，输入参数，String
 * param {Array} members 成员列表，输入参数，String 数组
 * param {Number} muteDuration 禁言时间，单位毫秒
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
muteGroupMembers(groupId,members,muteDuration)
```

------

### 取消禁言

接口API如下：

```
/**  
 * 将成员从禁言列表移除
 * param {String} groupId 群组ID，输入参数，String
 * param {Array} members 成员列表，输入参数，String 数组
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
unmuteGroupMembers(groupId,members)
```

------

### 获取群组黑名单列表

接口 API 如下：

```
/**  
 * 分页获取群组黑名单列表
 * param groupId 群组 ID，输入参数，String
 * param pageNum 第几页，输入参数，Number，1为起始页
 * param pageSize 每页计数，输入参数，Number，最大200
 * return 返回 Promise 对象，response 参数为 GroupListResult
 */
fetchGroupBans(groupId,pageNum, pageSize)
```

调用方法如下:

```
groupManager.fetchGroupBans(groupId, 1, 20).then((res) =>{},(error) => {});
```

------

### 加入群组黑名单

接口 API 如下：

```
/**  
 * 将成员加入群组黑名单，黑名单中的人员无法加入群组
 * param groupId 群组ID，输入参数，String
 * param members 成员列表，输入参数，String 数组
 * param reason 加入黑名单原因，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
blockGroupMembers(groupId,members,reason)
```

调用方法如下:

```
groupManager.blockGroupMembers(groupId, members, "reason").then((res) =>{},(error) => {});
```

------

### 从群组黑名单移除

接口 API 如下：

```
/**  
 * 将人员从群组黑名单移除
 * param groupId 群组 ID，输入参数，String
 * param members 成员列表，输入参数，StringArray
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
unblockGroupMembers(groupId, members)
```

调用方法如下:

```
groupManager.unblockGroupMembers(groupId, members).then((res) =>{},(error) => {});
```

------

## 加群处理

加群处理包含以下处理操作：

- 加入公开群组

- 申请加入公开群组

- 接受群邀请

- 拒绝群邀请

- 接受入群申请

- 拒绝入群申请

所有处理操作的示例下面会一一说明。

------

### 加入公开群组

接口 API 如下：

```
/** 
 *  加入 PUBLIC_JOIN_OPEN 类型公开群组
 * param groupId 群组 ID，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
joinPublicGroup(groupId,error)
```

调用方法如下:

```
groupManager.joinPublicGroup(groupId,error).then((res) =>{},(error) => {});
```

------

### 申请加入公开群组

接口 API 如下：

```
/** 
 *  申请加入 applyJoinPublicGroup 类型公开群组,需要群主或管理员同意
 * param groupId 群组 ID，输入参数，String
 * param nickname 用户在群内的昵称，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
applyJoinPublicGroup(groupId,nickname,message)
```

调用方法如下:

```
groupManager.applyJoinPublicGroup(groupId,nickname,message).then((res) =>{},(error) => {});
```

------

### 接受群邀请

接口 API 如下：

```
/**  
 * 接受群组发来的入群邀请
 * param groupId 群组ID，输入参数，String
 * param inviter 邀请人，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
acceptInvitationFromGroup(groupId,inviter)
```

调用方法如下:

```
groupManager.acceptInvitationFromGroup(groupId,inviter).then((res) =>{},(error) => {});
```

### 拒绝群邀请

接口 API 如下：

```
/**  
 * 拒绝群组发来的入群邀请
 * param groupId 群组 ID，输入参数，String
 * param inviter 邀请人，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
declineInvitationFromGroup(groupId,inviter)
```

调用方法如下:

```
groupManager.declineInvitationFromGroup(groupId,inviter).then((res) =>{},(error) => {});
```

------

### 接受加入群申请

接口 API 如下：

```
/**  
 * 同意成员的入群邀请，由群主操作
 * param groupId 群组ID，输入参数，String
 * param from 入群申请人，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
acceptJoinGroupApplication(groupId,from)
```

调用方法如下:

```
groupManager.acceptJoinGroupApplication(groupId,from).then((res) =>{},(error) => {});
```

------

### 拒绝加入群申请

接口 API 如下：

```
/**  
 * 拒绝成员的入群邀请，由群主操作
 * param groupId 群组 ID，输入参数，String
 * param from 入群申请人，输入参数，String
 * param reason 拒绝原因，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
declineJoinGroupApplication(groupId,from,reason)
```

调用方法如下:

```
groupManager.declineJoinGroupApplication(groupId,from,"decline reason").then((res) =>{},(error) => {});
```

------

## 群消息

群消息包含以下处理操作：

- 屏蔽群组消息

- 取消屏蔽群组消息

所有处理操作的示例下面会一一说明。

------

### 屏蔽群组消息

接口 API 如下：

```
/**  
 * 屏蔽群组消息
 * param groupId 群组ID，输入参数，String
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
blockGroupMessage(groupId)
```

调用方法如下:

```
groupManager.blockGroupMessage(groupId).then((res) =>{},(error) => {});
```

------

### 取消屏蔽群组消息

接口 API 如下：

```
/**  
 * 取消屏蔽群组消息
 * param groupId 群组 ID，输入参数，String
 * return 返回 Promise 对象，response 参数为GroupResult
 */
unblockGroupMessage(groupId)
```

调用方法如下:

```
groupManager.unblockGroupMessage(groupId).then((res) =>{},(error) => {});
```

------

## 群文件

群文件包含以下处理操作：

- 获取群文件列表

- 上传群文件

- 下载群文件

- 删除群文件

所有处理操作的示例下面会一一说明。

------

### 获取群文件列表

接口 API 如下：

```
/**  
 * 分页获取群文件列表
 * param groupId 群组ID，输入参数，String
 * param pageNum 当前页数，从1开始
 * param pageSize 每页计数，最大200
 * return 返回 Promise 对象，response 参数为 SharedFileListResult
 */
fetchGroupSharedFiles(groupId, pageNum, pageSize)
```

调用方法如下:

```
groupManager.fetchGroupSharedFiles(groupId, 1, 20).then((res) => {},(error) => {});
```

------

### 上传群文件

上传群文件过程中，需要使用回调监控上传进度及结果

```
// 设置回调函数显示上传进度和结果
var emUploadCallback = new easemob.EMCallback();
console.log("create upload emCallback success");

// 上传成功
emUploadCallback.onSuccess(() => {
    console.log("upload emCallback call back success");
    return true;
});
// 上传失败
emUploadCallback.onFail((error) => {
    console.log("upload emCallback call back fail");
    console.log(error.description);
    console.log(error.errorCode);
    return true;
});
// 上传进度
emUploadCallback.onProgress((progress) => {
    if (progress >= 98) {
        console.log("upload call back progress " + progress);
    }
});
```

接口 API 如下：

```
/**  
 * 上传群文件
 * param groupId 群组 ID，输入参数，String
 * param filepath 文件路径，输入参数，String
 * param emUploadCallback 设置回调，输入
 * 返回 Promise 对象，response 参数为 SharedFileResult
 */
uploadGroupSharedFile(groupId, filepath, emUploadCallback)
```

调用方法如下:

```
groupManager.uploadGroupSharedFile(groupId, filepath, emUploadCallback).then((res) => {},(error) => {});
```

------

### 下载群文件

下载群文件过程中需要使用回调监控下载进度及结果

```
var emDownloadCallback = new easemob.EMCallback();
console.log("create download emCallback success");

// 下载成功
emDownloadCallback.onSuccess(() => {
    console.log("download emCallback call back success");
    return true;
});
// 下载失败
emDownloadCallback.onFail((error) => {
    console.log("download emCallback call back fail");
    console.log(error.description);
    console.log(error.errorCode);
    return true;
});
// 下载进度
emDownloadCallback.onProgress((progress) => {
    if (progress >= 98) {
        console.log("download call back progress " + progress);
    }
});
```

接口 API 如下：

```
/**  
 * 下载群文件
 * param groupId 群组 ID，输入参数，String
 * param filePath 文件本地存储路径，输入参数，String
 * param fileId 文件 ID，输入参数，由文件列表数组获取
 * param callback 设置回调，输入
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
downloadGroupSharedFile(groupId, filePath, fileId, callback)
```

调用方法如下:

```
let fileId = sharedFile.fileId();
groupManager.downloadGroupSharedFile(groupid, filelocalpath, fileId, emDownloadCallback);
```

------

### 删除群文件

接口 API 如下：

```
/**  
 * 删除群文件
 * param groupId 群组 ID，输入参数，String
 * param fileId 文件 ID，输入参数，由文件列表获取
 * return 返回 Promise 对象，response 参数为 GroupResult
 */
deleteGroupSharedFile(groupId, fileId)
```

调用方法如下:

```
let fileId = sharedFile.fileId();
groupManager.deleteGroupSharedFile(groupId, fileId).then((res) =>{},(error) => {});
```

------

## 群组变更的监听

```
groupManager = emclient.getGroupManager();
groupListener = new easemob.EMGroupManagerListener(groupManager);
// 添加群管理员时触发(只有是自己时才能收到通知)
// group : 发生操作的群组
// admin : 被提升的群管理员
groupListener.onAddAdminFromGroup((groupId, admin) => {
    console.log("onAddAdminFromGroup:"+groupId+" admin:"+admin);
});

// 删除群管理员时触发(只有是自己时才能收到通知)
// group : 发生操作的群组
// admin : 被删除的群管理员（群管理员变成普通群成员）
groupListener.onRemoveAdminFromGroup((groupId, admin) => {
    console.log("onRemoveAdminFromGroup:"+groupId+" admin:"+admin);
});

// 转让群主的时候触发
// group : 发生操作的群组
// newOwner : 新群主
// oldOwner : 原群主
groupListener.onAssignOwnerFromGroup((groupId, newOwner, oldOwner) => {
    console.log("onAssignOwnerFromGroup:"+groupId+" newOwner:"+newOwner + " oldOwner:" + oldOwner);
});

// 我接收到自动进群时被触发
// group : 发生操作的群组
// inviter : 邀请人
// inviteMessage : 邀请信息
groupListener.onAutoAcceptInvitationFromGroup((groupId, inviter, inviteMessage)=>{
    console.log("onAutoAcceptInvitationFromGroup:"+groupId+" inviter:"+inviter + " inviteMessage:" + inviteMessage);
    });

// 成员加入群组时触发
// group : 发生操作的群组
// member : 加入群组的成员名称
groupListener.onMemberJoinedGroup((groupId, member)=>{
    console.log("onMemberJoinedGroup:"+groupId+" member:"+member);
});

// 成员离开群组时触发
// group : 发生操作的群组
// member : 离开群组的成员名称
groupListener.onMemberLeftGroup((groupId, member)=>{
    console.log("onMemberLeftGroup:"+groupId+" member:"+member);
});

// 离开群组时触发
// group : 发生操作的群组
// reason : 离开群组的原因（0: 被踢出 1:群组解散 2:被服务器下线）
groupListener.onLeaveGroup((groupId, reason)=>{
    console.log("onLeaveGroup:"+groupId+" reason:"+reason);
});
groupManager.addListener(groupListener);
// 移除监听
groupManager.removeListener(groupListener);
```