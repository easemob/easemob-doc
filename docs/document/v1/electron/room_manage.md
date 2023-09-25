# 聊天室管理

环信桌面端 SDK 支持聊天室功能的集成，集成后可以进行如下操作：

- 查询聊天室信息

- 加入聊天室

- 退出聊天室

- 监听回调

通过这些操作，可以组合帮助您完成多种场景下的 IM 需求。

**注意：**聊天室只能有服务端创建，客户端只可以查询、加入和退出聊天室

------

## 查询聊天室信息

```
// 获取聊天室控制对象
var chatroomManager = emclient.getChatroomManager();
// 获取所有聊天室
var chatroomlist = chatroomManager.fetchAllChatrooms(error);
// 获取聊天室属性
chatroomlist.map((chatroom) => {
  console.log("chatroom id:"+chatroom.chatroomId());
  console.log("chatroom chatroomSubject:"+chatroom.chatroomSubject());
  console.log("chatroom chatroomDescription:"+chatroom.chatroomDescription());
  console.log("chatroom owner:"+chatroom.owner());
  console.log("chatroom chatroomMemberCount:"+chatroom.chatroomMemberCount());
  console.log("chatroom chatroomMemberMaxCount:"+chatroom.chatroomMemberMaxCount());
  console.log("chatroom chatroomAnnouncement:"+chatroom.chatroomAnnouncement());
  var adminlist = chatroom.chatroomAdmins();
  var memberlist = chatroom.chatroomMembers();
  var banslist = chatroom.chatroomBans();
});
```

------

## 加入聊天室

接口 API 说明如下：

```
/** 
 *  加入聊天室
 * param chatroomid 聊天室 ID
 * param error 操作结果
 * return Promise 对象，该对象的 response 参数 EMChatroom 对象
 */
joinChatroom(chatroomid,error);
```

调用方法如下：

```
chatroomManager.joinChatroom(chatroomId, error).then((res)=>{},(error) => {});
```

------

## 退出聊天室

接口 API 说明如下：

```
/** 
 *  离开聊天室
 * param chatroomid 聊天室 ID
 * param error 操作结果
 * return Promise 对象，该对象的 response 参数为空
 */
leaveChatroom(chatroomid,error);
```

调用方法如下：

```
chatroomManager.leaveChatroom(chatroomId, error).then((res)=>{},(error) => {});
```

------

## 回调监听

```
// 添加消息回调
var emchatroomlistener = new easemob.EMChatroomManagerListener();
console.log(emchatroomlistener);

emchatroomlistener.onMemberJoinedChatroom((chatroom,member) => {
    console.log("onMemberJoinedChatroom" + chatroom.chatroomSubject());
    console.log("onMemberJoinedChatroom" + member);
});
emchatroomlistener.onMemberLeftChatroom((chatroom,member) => {
    console.log("onMemberLeftChatroom" + chatroom.chatroomSubject());
    console.log("onMemberLeftChatroom" + member);
});
//注册监听
chatroomManager.addListener(emchatroomlistener);
// 移除监听
chatroomManager.removeListener(emchatroomlistener);
```