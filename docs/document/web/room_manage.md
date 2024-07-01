# 创建和管理聊天室及监听聊天室事件

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，一旦离线后，不会收到聊天室中的任何消息，（除了聊天室白名单中的成员）超过 2 分钟会自动退出聊天室。聊天室可以应用于直播、消息广播等。若需调整该时间，需联系环信商务经理。

本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理聊天室，并实现聊天室的相关功能。

消息内容详见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM SDK 支持你通过调用 API 在项目中实现如下聊天室管理功能：

- 创建聊天室；
- 从服务器获取聊天室列表；
- 获取当前用户加入的聊天室列表；
- 加入聊天室；
- 获取聊天室详情；
- 解散聊天室；
- 监听聊天室事件；
- 实时更新聊天室成员人数。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 API 使用限制，详见 [使用限制](/product/limitation)；
- 了解环信即时通讯 IM 聊天室不同版本的数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)；
- 仅 [超级管理员](/document/server-side/chatroom.html#管理超级管理员) 可以创建聊天室；
- 聊天室创建者和管理员的数量之和不能超过 100 ，即管理员最多可添加 99 个。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建聊天室

仅 [超级管理员](/document/server-side/chatroom.html#管理超级管理员) 可以调用 `createChatRoom` 方法创建聊天室，并设置聊天室的名称、描述、最大成员数等信息。成功创建聊天室后，该超级管理员为该聊天室的所有者。

建议直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom.html#创建聊天室)。

示例代码如下：

```javascript
let options = {
    name: 'chatRoomName', // 聊天室名称。
    description: 'description', // 聊天室描述。
    maxusers: 200, // 聊天室允许的最大成员数（包括聊天室创建者），默认值 200，最大不超过 5,000。
    members: ['user1', 'user2'] // 聊天室成员。此属性可选，但是如果包含此项，数组元素至少一个。
}
conn.createChatRoom(options).then(res => console.log(res))
```

### 从服务器获取聊天室列表

你可以调用 `getChatRooms` 方法从服务器获取指定数目的聊天室列表，能获取到的最大数量为 1,000。

### 加入聊天室

申请加入聊天室的步骤如下：

- 调用 `getChatRooms` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
- 调用 `joinChatRoom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `onChatRoomEvent#memberPresence` 事件。
  该方法支持设置加入聊天室时携带的扩展信息，并指定是否退出所有其他聊天室。若进行了设置，当用户加入聊天室携带了扩展信息时，聊天室内其他人可以在用户加入聊天室的回调中，获取到扩展信息。

示例代码如下：

```javascript
// 获取聊天室列表，最多可获取 1000 个。
let option = {
    pagenum: 1,
    pagesize: 20
};
conn.getChatRooms(option).then(res => console.log(res))

// 加入聊天室。聊天室所有成员均可调用该接口。
let option = {
    roomId: 'roomId',
    // 加入聊天室时携带的扩展信息
    ext: 'custom ext',
    // 加入聊天室时，是否退出已加入的聊天室
    leaveOtherRooms: false
}
conn.joinChatRoom(option).then(res => console.log(res))

// 监听聊天室事件
conn.addEventHandler("CHATROOM", {
        onChatroomEvent: (e) => {
    switch (e.operation) {
      // 用户加入聊天室事件
      case "memberPresence":
        // 用户加入聊天室时携带的扩展信息
        console.log(e.ext);
        break;
      default:
        break;
    }
  }
});
```

### 获取当前用户加入的聊天室列表

你可以调用 `getJoinedChatRooms` 方法获取当前用户加入的聊天室列表，示例代码如下：

```javascript
conn
  .getJoinedChatRooms({
    pageNum: 1,
    pageSize: 20
  })
  .then((res) => {
    console.log(res);
  });
```

### 获取聊天室详情

聊天室所有成员均可调用 `getChatRoomDetails` 方法获取聊天室详情，包括聊天室 ID、名称、描述和允许的最大成员数等。聊天室成员列表、管理员列表、聊天室公告、黑名单列表和禁言列表需单独调用接口获取。

示例代码如下：

```javascript
let option = {
    chatRoomId: 'chatRoomId'
}
conn.getChatRoomDetails(option).then(res => console.log(res))
```

### 解散聊天室

仅聊天室所有者可以调用 `destroyChatRoom` 方法解散聊天室。聊天室解散时，其他成员收到 `destroy` 事件并被踢出聊天室。

示例代码如下：

```javascript
let option = {
    chatRoomId: 'chatRoomId'
}
conn.destroyChatRoom(option).then(res => console.log(res))
```

### 监听聊天室事件

你可以调用 `addEventHandler` 方法注册聊天室监听器，获取聊天室事件，并作出相应处理。

示例代码如下：

```javascript
conn.addEventHandler("eventName", {
    onChatroomEvent: function(msg){
        switch(msg.operation){
            // 解除聊天室一键禁言。聊天室所有成员（除操作者外）会收到该事件。
            case 'unmuteAllMembers':
                break;
            // 聊天室一键禁言。聊天室所有成员（除操作者外）会收到该事件。
            case 'muteAllMembers':
                break;
            // 将成员移出聊天室白名单。被移出的成员收到该事件。
            case 'removeAllowlistMember':
                break;
            // 添加成员至聊天室白名单。被添加的成员收到该事件。
            case 'addUserToAllowlist':
                break;
            // 删除聊天室公告。聊天室的所有成员会收到该事件。
            case 'deleteAnnouncement':
                break;
            // 更新聊天室公告。聊天室的所有成员会收到该事件。
            case 'updateAnnouncement':
                break;
            // 更新聊天室详情。聊天室的所有成员会收到该事件。
            case 'updateInfo':
                break;    
            // 解除对指定成员的禁言。被解除禁言的成员会收到该事件。
            case 'unmuteMember':
                break;
            // 有成员被移出聊天室黑名单。被移出的成员会收到该事件。
            case 'unblockMember':
                break;
            // 禁言指定成员。被禁言的成员会收到该事件。
            case 'muteMember':
                break;
            // 移除管理员。被移除的管理员会收到该事件。
            case 'removeAdmin':
                break;
            // 设置管理员。被添加的管理员会收到该事件。
            case 'setAdmin':
                break;
            // 转让聊天室。聊天室全体成员会收到该事件。
            case 'changeOwner':
                break;
            // 解散聊天室。聊天室的所有成员会收到该事件。
            case 'destroy':
                break;   
            // 主动退出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
            case 'memberAbsence':
                break;
            // 有成员被移出聊天室。被踢出聊天室的成员会收到该事件。   
            case 'removeMember':
                break;
            // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
            case 'memberPresence':
                break;
             // 有成员修改/设置聊天室自定义属性，聊天室的所有成员会收到该事件。
            case 'updateChatRoomAttributes':
                break;
            // 有成员删除聊天室自定义属性，聊天室所有成员会收到该事件。
            case 'removeChatRoomAttributes':
                break;
            default:
                break;
        }
    }
})
```

### 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `onChatroomEvent` 的 `memberPresence` 事件。有成员主动或被动退出时，其他成员会收到 `onChatroomEvent` 的 `memberAbsence` 事件。

2. 收到通知事件后，可以通过事件回调参数获取聊天室当前人数。

```javascript
conn.addEventHandler("CHATROOM", {
        onChatroomEvent: (e) => {
          switch (e.operation) {
            case "memberPresence":
              // 当前聊天室在线人数
              console.log(e?.memberCount);
              break;
            case "memberAbsence":
              // 当前聊天室在线人数
              console.log(e?.memberCount);
              break;
            default:
              break;
          }
        }
      });
```