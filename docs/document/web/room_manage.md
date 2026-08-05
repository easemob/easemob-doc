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

- 已完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- SDK 初始化时，已注册 `ChatRoomManager`。
- 已了解环信即时通讯 IM API 的接口调用频率限制，详见 [使用限制](/product/limitation.html)。
- 已了解聊天室数量、聊天室成员数量和套餐能力限制，详见 [IM 套餐包功能详情](/product/product_package_feature.html)。
- 仅 [超级管理员](/document/server-side/chatroom_superadmin_add.html) 可以创建聊天室。

## 创建聊天室

创建聊天室需调用服务端 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。创建成功后，客户端可 [加入该聊天室](#加入聊天室)，也可以 [获取聊天室详情](#)。

## 解散聊天室

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。聊天室解散后，聊天室内其他在线成员会收到 `onChatRoomDestroyed` 事件，并被移出该聊天室。

## 加入聊天室

1. 调用 `getChatRoomList` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。详见 [获取聊天室列表](#获取聊天室列表) 说明。
2. 调用 `joinChatRoom` 方法加入指定聊天室。聊天室内成员收到 `onMembersJoined` 事件。
  - 加入时可以传入扩展信息 `ext`，聊天室内成员可以从事件中获取该扩展信息。
  - 加入时可设置是否退出所有其他聊天室。

```typescript
await client.chatRoomManager.joinChatRoom({
  chatRoomId: 'chatroomId',
  // 扩展信息
  ext: JSON.stringify({ source: 'live-page' }),
  // 是否退出其他聊天室
  leaveOtherRooms: false,
});
```

主要参数如下：

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `chatRoomId` | String | 是 | 聊天室 ID。 |
| `ext` | String | 否 | 加入聊天室时透传给服务端的扩展信息。 |
| `leaveOtherRooms` | Boolean | 否 | 是否离开当前账号已加入的其他聊天室。未传时由服务端默认策略决定。 |

## 退出聊天室

### 主动退出

当前登录用户可调用 `leaveChatRoom` 主动退出聊天室。退出后，该用户不再接收该聊天室消息。聊天室内其他在线成员会收到 `onMembersExited` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').leaveChatRoom();
```

### 移出成员

聊天室所有者和管理员可调用 `removeMembers` 将单个或多个成员移出聊天室。成员被移出后，被移出的成员会收到 `onRemovedFromChatRoom` 事件，聊天室内其他成员会收到 `onMembersExited` 事件。

被移出的用户若不在聊天室黑名单中则可重新进入聊天室。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').removeMembers({
  userIds: ['user1', 'user2'],
});

console.log(result.succeeded);
console.log(result.failed);
```

### 离线退出

由于网络异常或长时间离线等原因，聊天室普通成员离线超过约 2 分钟后会自动退出聊天室。如需调整该时间，请联系环信商务经理。

以下成员离线后通常不会自动退出聊天室：

- 聊天室白名单中的成员。聊天室所有者和管理员默认在白名单中。
- 通过 [服务端 REST API 创建聊天室](/document/server-side/chatroom_create.html) 时加入、且从未登录过的用户。

若开启了聊天室多端多设备功能，白名单成员在某台设备离线重连后，可能无法继续接收该聊天室中的消息。如需在该设备上恢复接收聊天室消息，需在重新登录后再次调用 `joinChatRoom` 加入聊天室。

## 获取聊天室列表

你可以调用 `getChatRoomList` 方法从服务器分页获取聊天室列表。返回结果包含当前页的聊天室摘要、分页信息以及服务端返回的总数。

```typescript
const result = await client.chatRoomManager.getChatRoomList({
  pageNum: 1,
  pageSize: 20,
});

console.log(result.items);
console.log(result.pageNum);
console.log(result.pageSize);
console.log(result.total);
console.log(result.hasMore);
```

主要参数如下：

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `pageNum` | Number | 否 | 当前页码，从 1 开始。 |
| `pageSize` | Number | 否 | 每页返回的聊天室数量。取值范围为 [1,1000]，默认值为 `20`。 |

返回结果中，`items` 为当前页的聊天室摘要列表。每个聊天室摘要包含如下主要字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `chatRoomId` | String | 聊天室 ID。 |
| `name` | String | 聊天室名称。 |
| `owner` | UserInfo | 聊天室所有者信息。SDK 会尽量从缓存或 [用户属性接口](userprofile.html) 补齐该字段。 |
| `memberCount` | Number | 当前成员数量。 |
| `disabled` | Boolean | 聊天室是否被禁用。 |

## 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `onMembersJoined` 事件。有成员主动或被动退出时，其他成员会收到 `onMembersExited` 事件。

```typescript
let memberCount = 0;

client.chatRoomManager.addEventHandler('chatroom-member-count', {
  onMembersJoined: event => {
    memberCount += event.members.length;
    console.log('成员加入:', event.members, '当前本地成员数:', memberCount);
  },
  onMembersExited: event => {
    memberCount = Math.max(0, memberCount - event.members.length);
    console.log('成员退出:', event.members, '当前本地成员数:', memberCount);
  },
});
```

2. 收到成员变更事件后调用 `getInfo` 或 `getChatRoomInfo` 重新 [获取聊天室详情](room_attributes.html#获取聊天室详情)，通过 `memberCount` 参数获取聊天室当前人数。

## 常用单聊天室操作

获取 `ChatRoom` 对象后，你还可以调用以下方法管理单个聊天室：

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');
```

| 功能 | 方法 | 描述 |
| :--- | :--- | :--- |
| 退出聊天室 | `chatRoom.leaveChatRoom()` | 当前登录用户主动退出聊天室。 |
| 移除成员 | `chatRoom.removeMembers({ userIds })` | 从当前聊天室移除指定成员。 |
| 获取管理员列表 | `chatRoom.getAdminList()` | 获取当前聊天室管理员列表。 |
| 添加管理员 | `chatRoom.addAdmin({ userId })` | 将指定成员设为聊天室管理员。 |
| 移除管理员 | `chatRoom.removeAdmin({ userId })` | 移除指定成员的管理员权限。 |
| 获取禁言列表 | `chatRoom.getMuteList({ pageNum, pageSize })` | 分页获取当前聊天室禁言列表。 |
| 禁言成员 | `chatRoom.muteMembers({ userIds, duration })` | 将指定成员加入禁言列表，`duration` 单位为秒。 |
| 解除成员禁言 | `chatRoom.unmuteMembers({ userIds })` | 将指定成员移出禁言列表。 |
| 开启全员禁言 | `chatRoom.muteAllMembers()` | 开启当前聊天室全员禁言。 |
| 关闭全员禁言 | `chatRoom.unmuteAllMembers()` | 关闭当前聊天室全员禁言。 |
| 查询当前用户是否被禁言 | `chatRoom.checkIfInMuteList()` | 查询当前登录用户是否在当前聊天室禁言列表中。 |
| 获取黑名单 | `chatRoom.getBlocklist({ pageNum, pageSize })` | 分页获取当前聊天室黑名单列表。 |
| 加入黑名单 | `chatRoom.blockMembers({ userIds })` | 将指定成员加入聊天室黑名单。 |
| 移出黑名单 | `chatRoom.unblockMembers({ userIds })` | 将指定成员移出聊天室黑名单。 |
| 获取白名单 | `chatRoom.getAllowlist()` | 获取当前聊天室白名单列表。 |
| 加入白名单 | `chatRoom.addUsersToAllowlist({ userIds })` | 将指定成员加入聊天室白名单。 |
| 移出白名单 | `chatRoom.removeUsersFromAllowlist({ userIds })` | 将指定成员移出聊天室白名单。 |
| 查询当前用户是否在白名单中 | `chatRoom.checkIfInAllowList()` | 查询当前登录用户是否在当前聊天室白名单中。 |
| 获取公告 | `chatRoom.getAnnouncement()` | 获取当前聊天室公告。 |
| 更新公告 | `chatRoom.updateAnnouncement({ announcement })` | 更新当前聊天室公告。 |

示例代码如下：

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

await chatRoom.muteMembers({
  userIds: ['user1'],
  duration: 3600,
});

await chatRoom.updateAnnouncement({
  announcement: 'Welcome to the chat room.',
});

const allowlist = await chatRoom.getAllowlist();
console.log(allowlist);
```

## 监听聊天室事件

你可以调用 `addEventHandler` 方法注册聊天室事件监听器，并在事件回调中刷新聊天室详情、成员列表或相关 UI。

```typescript
client.chatRoomManager.addEventHandler('chatroom-events', {
  // 聊天室被解散。聊天室的所有成员会收到该事件。 
  onChatRoomDestroyed: event => { 
    console.log('聊天室被解散:', event.chatRoomId, event.chatRoomName);
  },

  // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
  onMembersJoined: event => {  
    console.log('成员加入聊天室:', event.chatRoomId, event.members, event.ext);
  },

  // 有成员主动退出或被移出聊天室。聊天室的所有成员（除退出的成员）会收到该事件。
  onMembersExited: event => {
    console.log('成员退出聊天室:', event.chatRoomId, event.members);
  },

  // 有成员被移出聊天室。被移出的成员收到该事件。
  onRemovedFromChatRoom: event => {
    console.log('当前用户被移出聊天室:', event.chatRoomId, event.reason, event.participant);
  },

  // 有成员被加入禁言列表。被添加的成员收到该事件。
  onMuteListAdded: event => {
    console.log('聊天室禁言列表新增成员:', event.chatRoomId, event.mutes, event.muteExpire);
  },

  // 有成员被移出禁言列表。被解除禁言的成员会收到该事件。
  onMuteListRemoved: event => {
    console.log('聊天室禁言列表移除成员:', event.chatRoomId, event.mutes);
  },

  // 有成员被加入白名单列表。被添加的成员收到该事件。
  onAllowListAdded: event => {
    console.log('聊天室白名单新增成员:', event.chatRoomId, event.allowlist);
  },

  // 有成员被移出白名单列表。被移出白名单的成员会收到该事件。
  onAllowListRemoved: event => {
    console.log('聊天室白名单移除成员:', event.chatRoomId, event.allowlist);
  },

  // 全员禁言状态变更。聊天室所有成员会收到该事件。
  onAllMemberMuteStateChanged: event => {
    console.log('聊天室全员禁言状态变更:', event.chatRoomId, event.isMuted);
  },

  // 有成员被设为管理员。被添加的管理员会收到该事件。
  onAdminAdded: event => {
    console.log('聊天室新增管理员:', event.chatRoomId, event.admin);
  },

  // 有成员被移除管理员权限。被移除的管理员会收到该事件。
  onAdminRemoved: event => {
    console.log('聊天室移除管理员:', event.chatRoomId, event.admin);
  },

  // 聊天室所有者变更。聊天室所有成员会收到该事件。
  onOwnerChanged: event => {
    console.log('聊天室所有者变更:', event.chatRoomId, event.oldOwner, event.newOwner);
  },

  // 聊天室公告变更。聊天室的所有成员会收到该事件。
  onAnnouncementChanged: event => {
    console.log('聊天室公告变更:', event.chatRoomId, event.announcement);
  },

  // 聊天室详情有变更。聊天室的所有成员会收到该事件。
  onChatRoomInfoChanged: event => {
    console.log('聊天室信息变更:', event.chatRoomId, event.chatRoomInfo);
  },

  // 聊天室自定义属性有更新。聊天室所有成员会收到该事件。
  onAttributesUpdate: event => {
    console.log('聊天室属性更新:', event.chatRoomId, event.attributes, event.from);
  },

  // 有聊天室自定义属性被移除。聊天室所有成员会收到该事件。
  onAttributesRemoved: event => {
    console.log('聊天室属性删除:', event.chatRoomId, event.keyList, event.from);
  },
});
```

如需移除监听器，可调用 `removeEventHandler`：

```typescript
client.chatRoomManager.removeEventHandler('chatroom-events');
```

## 接口列表

SDK 支持通过 `ChatRoomManager` 管理器和 `ChatRoom` 单聊天室对象实现以下接口能力：

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [从服务端创建聊天室](#创建聊天室) | 服务端 REST API | 创建聊天室。 |
| [解散聊天室](#解散聊天室) | 服务端 REST API | 解散聊天室。 |
| [`getChatRoomList`](#获取聊天室列表) | `ChatRoomManager` | 分页获取公开聊天室列表。 |
| [`joinChatRoom`](#加入聊天室) | `ChatRoomManager` | 加入指定聊天室。 |
| [`getChatRoom`](#退出聊天室) | `ChatRoomManager` | 获取绑定指定聊天室 ID 的 `ChatRoom` 单聊天室对象。 |
| [`leaveChatRoom`](#退出聊天室) | `ChatRoom` | 退出当前聊天室。 |
