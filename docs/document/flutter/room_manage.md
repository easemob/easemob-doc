# 创建和管理聊天室以及监听聊天室事件

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，一旦离线后，不会收到聊天室中的任何消息，（除了聊天室白名单中的成员）超过 2 分钟会自动退出聊天室。聊天室可以应用于直播、消息广播等。若需调整该时间，需联系环信商务经理。

本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理聊天室，并实现聊天室的相关功能。

消息相关内容见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM Flutter SDK 提供 `ChatRoom`、`ChatRoomManager` 和 `ChatRoomEventHandler` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 创建聊天室
- 从服务器获取聊天室列表
- 加入聊天室
- 获取聊天室详情
- 解散聊天室
- 监听聊天室事件
- 实时更新聊天室成员人数

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom_superadmin_add.html)。
- 聊天室创建者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建聊天室

仅 [超级管理员](/document/server-side/chatroom_superadmin_add.html) 可以调用 `ChatRoomManager#createChatRoom` 方法创建聊天室，并设置聊天室的名称、描述、最大成员数等信息。成功创建聊天室后，该超级管理员为该聊天室的所有者。

建议直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。

示例代码如下：

```dart
try {
  ChatRoom room = await ChatClient.getInstance.chatRoomManager.createChatRoom(name);
} on ChatError catch (e) {
}
```

### 加入聊天室

获取聊天室 ID 后，你可以根据业务需求选择以下方式加入聊天室：

- **普通加入**：仅需加入指定聊天室时，调用基础 `ChatRoomManager#joinChatRoom` 方法。
- **携带扩展信息加入**：需要在加入聊天室时传递自定义业务信息，或控制是否退出已加入的其他聊天室时，调用 `ChatRoomManager.joinChatRoom` 方法。

用户申请加入聊天室的步骤如下：

1. 调用 `ChatRoomManager#fetchPublicChatRoomsFromServer` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用基础 `ChatRoomManager#joinChatRoom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `ChatRoomEventHandler#onMemberJoinedFromChatRoom` 事件。

以下示例演示如何获取聊天室列表并通过基础方法加入聊天室：

```dart
// 获取公开聊天室列表，每次最多可获取 1,000 个。
try {
  ChatPageResult<ChatRoom> result = await ChatClient
      .getInstance.chatRoomManager
      .fetchPublicChatRoomsFromServer(
    pageNum: pageNum,
    pageSize: pageSize,
  );
} on ChatError catch (e) {
}

// 加入聊天室
try {
   await ChatClient.getInstance.chatRoomManager.joinChatRoom(roomId);
} on ChatError catch (e) {
}
```

#### 携带扩展信息加入聊天室

如果需要在加入聊天室时传递自定义业务信息，请调用 `ChatRoomManager.joinChatRoom` 方法。该方法还支持控制用户加入当前聊天室时，是否退出已加入的其他聊天室。

该方法包含以下两个重要参数：

- `ext`：加入聊天室时携带的自定义扩展信息。
- `leaveOtherRooms`：指定加入当前聊天室时是否退出已加入的其他聊天室。

用户成功加入聊天室后，聊天室内的其他成员会收到 `ChatRoomEventHandler.onMemberJoinedFromChatRoom(String roomId, String participant, String? ext)` 回调。如果加入聊天室时传入了扩展信息，其他成员可以通过该回调的 `ext` 参数获取。

以下示例演示如何携带扩展信息加入聊天室，并获取其他成员加入聊天室时携带的扩展信息：

```dart
ChatClient.getInstance.chatRoomManager.joinChatRoom(
  "roomId",
  leaveOtherRooms: false,
  ext: 'ext',
);

// 添加聊天室事件监听
ChatClient.getInstance.chatRoomManager.addEventHandler(
  "identifier",
  ChatRoomEventHandler(
    onMemberJoinedFromChatRoom: (roomId, participant, ext) {},
  ),
);

// 移除聊天室事件监听
ChatClient.getInstance.chatRoomManager.removeEventHandler("identifier");
```

### 获取聊天室详情

聊天室所有成员均可以调用 `ChatManager#fetchChatRoomInfoFromServer` 获取聊天室详情，包括聊天室 ID、聊天室名称，聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及聊天室权限类型。聊天室公告、管理员列表、成员列表、黑名单列表、禁言列表需单独调用接口获取。

示例代码如下：

```dart
try {
  ChatRoom room = await ChatClient.getInstance.chatRoomManager.fetchChatRoomInfoFromServer(roomId);
} on ChatError catch (e) {
}
```

### 解散聊天室

仅聊天室所有者可以调用 `ChatRoomManager#destroyChatRoom` 方法解散聊天室。聊天室解散时，其他聊天室成员收到 `ChatRoomEventHandler#onChatRoomDestroyed` 回调并被踢出聊天室。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.destroyChatRoom(roomId);
} on ChatError catch (e) {
}
```

### 监听聊天室事件

`ChatRoomEventHandler` 类中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听，需要移除，防止出现内存泄露。

示例代码如下：

```dart
    // 添加监听器
ChatClient.getInstance.chatRoomManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  ChatRoomEventHandler(
    // 转让聊天室。聊天室全体成员会收到该事件。
    onOwnerChangedFromChatRoom: (roomId, newOwner, oldOwner) {},
    // 禁言指定成员。被禁言的成员会收到该事件。
    onMuteListAddedFromChatRoom: (roomId, mutes, expireTime) {},
    // 解除对指定成员的禁言。被解除禁言的成员会收到该事件。
    onMuteListRemovedFromChatRoom: (roomId, mutes) {},
    // 解散聊天室。聊天室全体成员会收到该事件。
    onChatRoomDestroyed: (roomId, roomName) {},
    // 聊天室详情有变更。聊天室的所有成员会收到该事件。
    onSpecificationChanged: (room) {},
    // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
    onMemberJoinedFromChatRoom: (roomId, participant) {},
    // 有成员主动退出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
    onMemberExitedFromChatRoom: (roomId, roomName, participant) {},
    // 有成员被移出聊天室。被移出的成员收到该事件。
    onRemovedFromChatRoom: (roomId, roomName, participant) {},
    // 聊天室公告变更。聊天室的所有成员会收到该事件。
    onAnnouncementChangedFromChatRoom: (roomId, announcement) {},
    // 有成员被加入白名单列表。被添加的成员收到该事件。
    onAllowListAddedFromChatRoom: (roomId, members) {},
    // 有成员被移出白名单列表。被移出白名单的成员会收到该事件。
    onAllowListRemovedFromChatRoom: (roomId, members) {},
    // 全员禁言状态变更。聊天室所有成员会收到该事件。
    onAllChatRoomMemberMuteStateChanged: (roomId, isAllMuted) {},
    // 有成员被设为管理员。被添加的管理员会收到该事件。
    onAdminAddedFromChatRoom: (roomId, admin) {},
    // 有成员被移除管理员权限。被移除的管理员会收到该事件。
    onAdminRemovedFromChatRoom: (roomId, admin) {},
    // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
    onAttributesUpdated: (roomId, attributes, from) {},
    // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
    onAttributesRemoved: (roomId, keys, fromId) {},
  ),
);

    // 移除监听器
    ChatClient.getInstance.chatRoomManager.removeEventHandler("UNIQUE_HANDLER_ID");
```

### 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `ChatRoomEventHandler#onMemberJoinedFromChatRoom` 事件。有成员主动或被动退出时，其他成员会收到 `ChatRoomEventHandler#onMemberExitedFromChatRoom` 事件。

2. 收到通知事件后，调用 `ChatRoomManager#getChatRoomWithId` 方法获取本地聊天室详情，其中包括聊天室当前人数。

```dart
ChatClient.getInstance.chatRoomManager.addEventHandler(
    'UNIQUE_HANDLER_ID',
    ChatRoomEventHandler(
      onMemberJoinedFromChatRoom: (roomId, participant) async {
        ChatRoom? room = await ChatClient.getInstance.chatRoomManager.getChatRoomWithId(roomId);
        debugPrint("current room member count ${room?.memberCount}");
      },
      onMemberExitedFromChatRoom: (roomId, roomName, participant) async {
        ChatRoom? room = await ChatClient.getInstance.chatRoomManager.getChatRoomWithId(roomId);
        debugPrint("current room member count ${room?.memberCount}");
      },
    ));

// ...
ChatClient.getInstance.chatRoomManager.removeEventHandler('UNIQUE_HANDLER_ID');
```
