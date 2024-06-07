# 创建和管理聊天室以及监听事件

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，一旦离线后，不会收到聊天室中的任何消息，超过 2 分钟会自动退出聊天室。聊天室可以应用于直播、消息广播等。若需调整该时间，需联系环信商务经理。
 
本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理聊天室，并实现聊天室的相关功能。

消息相关内容见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM SDK 提供 `ChatRoomManager` 类 和 `ChatRoom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 创建聊天室
- 从服务器获取聊天室列表
- 加入聊天室
- 获取聊天室详情
- 退出聊天室
- 解散聊天室
- 监听聊天室事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom.html#添加超级管理员)。
- 聊天室创建者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建聊天室

建议直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom.html#创建聊天室)。

### 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `fetchPublicChatroomsFromServer` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatroom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `onMemberJoined` 回调。

:::tip
若传入的聊天室 ID 不存在，你可以联系环信商务实现自动创建聊天室。若开启了该功能，环信服务器会自动创建聊天室，`joinChatroom` 方法中的参数无变化。
:::

示例代码如下：

```TypeScript
// 获取公开聊天室列表，每次最多可获取 1,000 个。
ChatClient.getInstance().chatroomManager()?.fetchPublicChatroomsFromServer(pageNumber, pageSize).then(roomArray => {
    // success logic
});

// 加入聊天室
ChatClient.getInstance().chatroomManager()?.joinChatroom(chatRoomId).then(room => {
    // success logic
});
```

### 退出聊天室

聊天室所有成员均可以调用 `leaveChatroom` 方法退出当前聊天室。成员退出聊天室时，其他成员收到 `onMemberExited` 回调。

示例代码如下：

```TypeScript
ChatClient.getInstance().chatroomManager()?.leaveChatroom(chatRoomId).then(()=> {
    // success logic
});
```

退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `ChatOptions#setDeleteMessagesOnLeaveChatroom` 设置为 `false`。

示例代码如下：

```TypeScript
let options = new ChatOptions();
options.setDeleteMessagesOnLeaveChatroom(false);
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。若 `ChatOptions#canChatroomOwnerLeave` 参数在初始化时设置为 `true` 时，聊天室所有者可以离开聊天室；若该参数设置为 `false`，聊天室所有者调用 `leaveChatRoom` 方法离开聊天室时会提示错误 706 `ChatError#CHATROOM_OWNER_NOT_ALLOW_LEAVE`。

### 监听聊天室事件

`ChatroomListener` 类中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除。

示例代码如下：


```TypeScript
// 注册聊天室回调
ChatClient.getInstance().chatroomManager()?.addListener(chatroomListener);
// 移除聊天室回调
ChatClient.getInstance().chatroomManager()?.removeListener(chatroomListener);
```

具体事件如下：

```TypeScript
interface ChatroomListener{
    /**
     * 有新成员加入聊天室。
     * 聊天室的所有成员会收到该事件。
     */
    onMemberJoined?: (roomId: string, userId: string) => void;
    /**
     * 有新成员退出聊天室。
     * 聊天室的所有成员会收到该事件。
     */
    onMemberExited?: (roomId: string, roomName: string, userId: string) => void;
    /**
     * 有新成员被移出聊天室。
     * 被移出的成员收到该事件。
     */
    onRemovedFromChatroom?: (reason: LEAVE_REASON, roomId: string, roomName: string) => void
    /**
     * 有成员被禁言。
     * 被添加的成员收到该事件。禁言期间成员不能发送发消息。
     */
    onMutelistAdded?: (roomId: string, mutes: Array<string>, expireTime: number) => void;
    /**
     * 有成员从禁言列表中移除。
     * 被解除禁言的成员会收到该事件。
     */
    onMutelistRemoved?: (roomId: string, mutes: Array<string>) => void;
    /**
     * 有成员被加入白名单。
     * 被添加的成员收到该事件。
     */
    onWhitelistAdded?: (roomId: string, whitelist: Array<string>) => void;
    /**
     * 有成员被移出白名单。
     * 被移出白名单的成员收到该事件。
     */
    onWhitelistRemoved?: (roomId: string, whitelist: Array<string>) => void;
    /**
     * 全员禁言状态有变更。
     * 聊天室所有成员会收到该事件。
     */
    onAllMemberMuteStateChanged?: (roomId: string, isMuted: boolean) => void;
    /**
     * 有成员被设置为管理员。
     * 所有成员会收到此通知。
     */
    onAdminAdded?: (roomId: string, adminId: string) => void;
    /**
     * 有成员被移出管理员列表。
     * 所有成员会收到此通知。
     */
    onAdminRemoved?: (roomId: string, adminId: string) => void;
    /**
     * 聊天室所有者变更。
     * 聊天室所有成员会收到该事件。
     */
    onOwnerChanged?: (roomId: string, newOwner: string, oldOwner: string) => void;
    /**
     * 聊天室公告变更。
     * 聊天室所有成员会收到该事件。
     */
    onAnnouncementChanged?: (roomId: string, announcement: string) => void;
    /**
     * 聊天室信息有更新。
     * 聊天室所有成员会收到该事件。
     */
    onSpecificationChanged?: (room: Chatroom) => void;
}
```
