# 创建和管理聊天室

## 功能说明

聊天室是支持大量用户实时互动的即时通讯场景，常用于直播互动、消息广播和开放讨论等业务。聊天室成员没有固定关系，用户离线后通常不会继续接收聊天室消息；除聊天室白名单成员外，普通成员离线超过约 2 分钟会自动退出聊天室。如需调整自动退出时间，请联系环信商务经理。

聊天室成员角色如下表所示：

| 成员角色 | 描述 | 管理权限 |
| :--- | :--- | :--- |
| 普通成员 | 加入聊天室后参与互动的用户。 | 可以发送和接收聊天室消息、获取聊天室详情和成员列表等。 |
| 聊天室管理员 | 由聊天室所有者设置，协助管理聊天室。 | 可以移除成员、管理禁言列表、白名单、黑名单和聊天室公告等。 |
| 聊天室所有者 | 聊天室创建者或被转让所有权的用户。 | 拥有聊天室最高管理权限，可解散聊天室、添加或移除管理员、修改聊天室信息等。 |

本文介绍如何创建、解散、加入、退出和管理聊天室，并监听聊天室相关事件。聊天室消息的发送、接收和管理，参见 [消息管理](message_overview.html)。

:::tip
聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。
:::

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom_superadmin_add.html)。

## 创建聊天室

创建聊天室需调用服务端 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。创建成功后，客户端可以 [加入该聊天室](#加入聊天室)，也可以 [获取聊天室详情](room_attributes.html#获取聊天室详情)。

## 解散聊天室

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。聊天室解散后，聊天室内其他在线成员会收到 `onChatRoomDestroyed` 事件，并被移出该聊天室。

## 加入聊天室

获取聊天室 ID 后，你可以根据业务需求选择以下方式加入聊天室：

- **普通加入**：仅需加入指定聊天室时，调用 `joinChatRoom` 方法并仅传入聊天室 ID。
- **携带扩展信息加入**：需要在加入聊天室时传递自定义业务信息，或控制是否退出已加入的其他聊天室时，调用 `joinChatRoom` 方法并传入可选参数。

用户申请加入聊天室的步骤如下：

1. 调用 `fetchPublicChatRoomsFromServer` 方法从服务器获取聊天室列表，查询要加入的聊天室 ID。
2. 调用 `joinChatRoom` 方法并传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室后，其他成员会收到 `onMemberJoinedFromChatRoom` 回调。

以下示例演示如何获取聊天室列表并通过基础方式加入聊天室：

```dart
// 获取应用的聊天室列表。
// pageNum：当前页码，从 1 开始。
// pageSize：每页期望返回的记录数，取值范围为 [1, 1000]，默认值为 200。
try {
  final ChatPageResult<ChatRoom> result = await ChatClient
      .getInstance.chatRoomManager
      .fetchPublicChatRoomsFromServer(
        pageNum: pageNum,
        pageSize: pageSize,
      );
  // 获取聊天室列表成功。
} on ChatError catch (e) {
  // 获取聊天室列表失败。
}

// 加入聊天室。
try {
  await ChatClient.getInstance.chatRoomManager.joinChatRoom(chatRoomId);
} on ChatError catch (e) {
}
```

### 携带扩展信息加入聊天室

如果需要在加入聊天室时传递自定义业务信息，请调用 `joinChatRoom` 方法并传入 `ext`。该方法还支持通过 `leaveOtherRooms` 控制用户加入当前聊天室时，是否退出已加入的其他聊天室。

该方法包含以下两个重要可选参数：

- `ext`：加入聊天室时携带的自定义扩展信息。
- `leaveOtherRooms`：指定加入当前聊天室时是否退出已加入的其他聊天室，默认为 `false`。

用户成功加入聊天室后，聊天室内的其他成员会收到 `ChatRoomEventHandler.onMemberJoinedFromChatRoom` 回调。如果加入聊天室时传入了扩展信息，其他成员可以通过该回调的 `ext` 参数获取。

以下示例演示如何携带扩展信息加入聊天室，并获取其他成员加入聊天室时携带的扩展信息：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.joinChatRoom(
    chatRoomId,
    leaveOtherRooms: true,
    ext: 'your ext info',
  );
} on ChatError catch (e) {
}

ChatClient.getInstance.chatRoomManager.addEventHandler(
  'UNIQUE_HANDLER_ID',
  ChatRoomEventHandler(
    onMemberJoinedFromChatRoom: (roomId, participant, ext) {
      // ext 为该成员加入聊天室时携带的扩展信息。
    },
  ),
);
```

## 退出聊天室

### 主动退出

聊天室所有成员均可以调用 `leaveChatRoom` 方法退出当前聊天室。成员退出聊天室时，其他成员收到 `onMemberExitedFromChatRoom` 回调。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.leaveChatRoom(chatRoomId);
} on ChatError catch (e) {
}
```

退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `ChatOptions.deleteMessagesAsExitChatRoom` 设置为 `false`。

示例代码如下：

```dart
final ChatOptions options = ChatOptions.withAppKey(
  appKey,
  deleteMessagesAsExitChatRoom: false,
);
await ChatClient.getInstance.init(options);
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。`ChatOptions.isChatRoomOwnerLeaveAllowed` 默认为 `true`，表示允许聊天室所有者离开；若在初始化时将该参数设置为 `false`，聊天室所有者调用 `leaveChatRoom` 方法离开聊天室时会提示错误 706。

### 被移出

仅聊天室所有者和管理员可调用 `ChatRoomManager.removeChatRoomMembers` 方法将单个或多个成员移出聊天室。

被移出后，该成员收到 `onRemovedFromChatRoom` 回调，其他成员收到 `onMemberExitedFromChatRoom` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```dart
try {
  await ChatClient.getInstance.chatRoomManager.removeChatRoomMembers(
    chatRoomId,
    members,
  );
  // 成员移出成功。
} on ChatError catch (e) {
  // 成员移出失败。
}
```

### 离线后自动退出

由于网络等原因，聊天室中的成员离线超过 2 分钟会自动退出聊天室。若需调整该时间，需联系环信商务。

以下两类成员即使离线也不会退出聊天室：

- 聊天室白名单中的成员（聊天室所有者和管理员默认加入白名单）。
- [调用 RESTful API 创建聊天室](/document/server-side/chatroom_create.html) 时拉入的用户从未登录过。

若开启了聊天室多端多设备功能，聊天室白名单中的成员在一台设备上离线重连后，无法收到聊天室的消息。若使该设备收到聊天室的消息，需要登录后手动调用 API 加入聊天室。

## 获取聊天室列表

你可以调用 `fetchPublicChatRoomsFromServer` 方法分页获取聊天室列表。

该接口获取当前应用下的聊天室列表，不仅限于当前用户已加入的聊天室。若要获取本地已加入的聊天室详情，可使用 `ChatRoomManager.getChatRoomWithId`；若要获取当前用户加入的聊天室列表，需要结合业务侧本地维护。

```dart
// pageSize：每页期望返回的聊天室数量，取值范围为 [1, 1000]，默认值为 200。
try {
  final ChatPageResult<ChatRoom> result = await ChatClient
      .getInstance.chatRoomManager
      .fetchPublicChatRoomsFromServer(
        pageNum: pageNum,
        pageSize: pageSize,
      );

  // 通过 result.data 获取当前页聊天室列表。
} on ChatError catch (e) {
  // 获取聊天室列表失败。
}
```

返回结果 `ChatPageResult<ChatRoom>` 的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data` | `List<ChatRoom>` | 当前页的聊天室列表。 |
| `pageCount` | `int?` | 当前页的聊天室数量。若该值小于请求时传入的 `pageSize`，表示服务端没有更多聊天室数据。 |

`data` 返回的每个 `ChatRoom` 对象可读取以下主要字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `roomId` | `String` | 聊天室 ID。 |
| `name` | `String?` | 聊天室名称。 |
| `description` | `String?` | 聊天室描述。 |
| `owner` | `String?` | 聊天室所有者的用户 ID。 |
| `memberCount` | `int?` | 聊天室当前在线成员数。 |
| `createTimestamp` | `int` | 聊天室创建时间戳，单位为毫秒。 |

## 监听聊天室事件

`ChatRoomEventHandler` 类中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

示例代码如下：

```dart
// 注册聊天室回调。
ChatClient.getInstance.chatRoomManager.addEventHandler(
  'UNIQUE_HANDLER_ID',
  chatRoomEventHandler,
);

// 移除聊天室回调。
ChatClient.getInstance.chatRoomManager.removeEventHandler(
  'UNIQUE_HANDLER_ID',
);
```

具体事件如下：

```dart
final ChatRoomEventHandler chatRoomEventHandler = ChatRoomEventHandler(
  // 聊天室被解散。聊天室的所有成员会收到该事件。
  onChatRoomDestroyed: (roomId, roomName) {},

  // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
  onMemberJoinedFromChatRoom: (roomId, participant, ext) {},

  // 有成员主动退出或被移出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
  onMemberExitedFromChatRoom: (roomId, roomName, participant) {},

  // 当前用户被移出聊天室。reason 为 LeaveReason.Kicked 或 LeaveReason.Offline。
  onRemovedFromChatRoom: (roomId, roomName, participant, reason) {},

  // 有成员被加入禁言列表。被添加的成员收到该事件。
  onMuteListAddedFromChatRoom: (roomId, mutes) {},

  // 有成员被移出禁言列表。被解除禁言的成员会收到该事件。
  onMuteListRemovedFromChatRoom: (roomId, mutes) {},

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

  // 聊天室所有者变更。聊天室所有成员会收到该事件。
  onOwnerChangedFromChatRoom: (roomId, newOwner, oldOwner) {},

  // 聊天室详情有变更。聊天室的所有成员会收到该事件。
  onSpecificationChanged: (room) {},

  // 聊天室公告变更。聊天室的所有成员会收到该事件。
  onAnnouncementChangedFromChatRoom: (roomId, announcement) {},

  // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
  onAttributesUpdated: (roomId, attributes, from) {},

  // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
  onAttributesRemoved: (roomId, removedKeys, from) {},
);
```

## 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `onMemberJoinedFromChatRoom` 事件。有成员主动或被动退出时，其他成员会收到 `onMemberExitedFromChatRoom` 事件，被移出的当前用户会收到 `onRemovedFromChatRoom` 事件。

2. 收到通知事件后，调用 `ChatRoomManager.getChatRoomWithId` 方法获取本地聊天室详情，再通过 `ChatRoom.memberCount` 获取聊天室当前人数。

```dart
ChatClient.getInstance.chatRoomManager.addEventHandler(
  'UNIQUE_HANDLER_ID',
  ChatRoomEventHandler(
    onMemberJoinedFromChatRoom: (roomId, participant, ext) async {
      final ChatRoom? room = await ChatClient
          .getInstance.chatRoomManager
          .getChatRoomWithId(roomId);
      final int? memberCount = room?.memberCount;
    },
    onMemberExitedFromChatRoom: (roomId, roomName, participant) async {
      final ChatRoom? room = await ChatClient
          .getInstance.chatRoomManager
          .getChatRoomWithId(roomId);
      final int? memberCount = room?.memberCount;
    },
  ),
);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`fetchPublicChatRoomsFromServer`](#获取聊天室列表) | `ChatRoomManager` | 获取应用下的聊天室列表。 |
| [`joinChatRoom`](#加入聊天室) | `ChatRoomManager` | 加入聊天室。 |
| [`leaveChatRoom`](#主动退出) | `ChatRoomManager` | 主动退出聊天室。 |
| [`removeChatRoomMembers`](#被移出) | `ChatRoomManager` | 将成员移出聊天室。 |
| [`getChatRoomWithId`](#实时更新聊天室成员人数) | `ChatRoomManager` | 获取本地聊天室详情。 |
