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

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。聊天室解散后，聊天室内其他在线成员会收到 `ChatRoomEventListener#onDestroyed` 事件，并被移出该聊天室。

## 加入聊天室

获取聊天室 ID 后，你可以根据业务需求选择以下方式加入聊天室：

- **普通加入**：仅需加入指定聊天室时，调用 `ChatRoomManager#joinChatRoomEx` 方法。
- **携带扩展信息加入**：需要在加入聊天室时传递自定义业务信息，或控制是否退出已加入的其他聊天室时，调用 `ChatRoomManager#joinChatRoomEx` 方法。

用户申请加入聊天室的步骤如下：

1. 调用 `ChatRoomManager#fetchPublicChatRoomsFromServer` 方法从服务器获取聊天室列表，查询要加入的聊天室 ID。
2. 调用 `ChatRoomManager#joinChatRoomEx` 方法并通过 `roomId` 传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室后，其他成员会收到 `ChatRoomEventListener#onMemberJoined` 回调。

`ChatRoomManager#joinChatRoomEx` 返回 `Promise<void>`，不返回聊天室对象；如需详情，可调用 `ChatRoomManager#fetchChatRoomInfoFromServer`。

以下示例演示如何获取聊天室列表并加入聊天室：

```typescript
try {
  // 获取应用的聊天室列表；页码从 1 开始，每页期望返回 20 条记录
  const result = await ChatClient.getInstance().roomManager
    .fetchPublicChatRoomsFromServer(1, 20);
  // 通过 result.list 获取当前页聊天室列表
  console.log(result.list);
} catch (error: unknown) {
  // 获取聊天室列表失败
  console.error('获取聊天室列表失败：', error);
}

try {
  // 加入聊天室
  await ChatClient.getInstance().roomManager
    .joinChatRoomEx({ roomId: '<room_id>' });
} catch (error: unknown) {
  // 加入聊天室失败
  console.error('加入聊天室失败：', error);
}
```

### 携带扩展信息加入聊天室

如果需要在加入聊天室时传递自定义业务信息，请调用 `ChatRoomManager#joinChatRoomEx` 方法。该方法还支持控制用户加入当前聊天室时，是否退出已加入的其他聊天室。

该方法包含以下两个重要参数：

- `ext`：加入聊天室时携带的自定义扩展信息，可选；省略时不携带扩展信息。
- `exitOtherRoom`：指定加入当前聊天室时是否退出已加入的其他聊天室，默认为 `false`。

用户成功加入聊天室后，聊天室内的其他成员会收到 `ChatRoomEventListener#onMemberJoined` 回调。如果加入聊天室时传入了扩展信息，其他成员可以通过该回调的 `ext` 参数获取。

以下示例演示如何携带扩展信息加入聊天室，并获取其他成员加入聊天室时携带的扩展信息：

```typescript
const joinListener: ChatRoomEventListener = {
  onMemberJoined: ({ roomId, participant, ext }) => {
    // 获取其他成员加入聊天室时携带的扩展信息
    console.log(roomId, participant, ext);
  },
};
ChatClient.getInstance().roomManager.addRoomListener(joinListener);

try {
  // 携带扩展信息加入聊天室，并退出已加入的其他聊天室
  await ChatClient.getInstance().roomManager.joinChatRoomEx({
    roomId: '<room_id>',
    exitOtherRoom: true,
    ext: 'your ext info',
  });
} catch (error: unknown) {
  console.error('加入聊天室失败：', error);
}

// 不再需要监听时，移除同一个监听器对象
function removeJoinListener(): void {
  ChatClient.getInstance().roomManager.removeRoomListener(joinListener);
}
```

## 退出聊天室

用户退出聊天室时分为两三种情况：主动退出、被聊天室所有者或管理员移出、以及离线后自动退出。

用户退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `ChatOptions.deleteMessagesAsExitChatRoom` 设置为 `false`，该属性默认为 `true`。

示例代码如下：

```typescript
const options = ChatOptions.withAppKey({
  appKey: '<org_name>#<app_name>',
  // 退出聊天室时保留本地消息，默认值为 true
  deleteMessagesAsExitChatRoom: false,
});
try {
  // 初始化 SDK 时应用该配置
  await ChatClient.getInstance().init(options);
} catch (error: unknown) {
  console.error('初始化 SDK 失败：', error);
}
```

### 主动退出

聊天室所有成员均可以调用 `ChatRoomManager#leaveChatRoom` 方法退出当前聊天室。成员退出聊天室时，其他成员收到 `ChatRoomEventListener#onMemberExited` 回调。

示例代码如下：

```typescript
try {
  // 退出聊天室
  await ChatClient.getInstance().roomManager
    .leaveChatRoom('<room_id>');
} catch (error: unknown) {
  // 退出聊天室失败
  console.error('退出聊天室失败：', error);
}
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。若 `ChatOptions.isChatRoomOwnerLeaveAllowed` 参数在初始化时设置为 `true`（默认）时，聊天室所有者可以离开聊天室；若该参数设置为 `false`，则不允许聊天室所有者主动离开聊天室。

:::tip
Android 端在提交退出操作后即返回，不通过该 Promise 报告原生退出结果；iOS 端在退出完成后返回结果。不要将方法返回成功视为其他成员均已收到退出事件。
:::

### 被移出

仅聊天室所有者和管理员可调用 `ChatRoomManager#removeChatRoomMembers` 方法将单个或多个成员移出聊天室。

被移出后，该成员收到 `ChatRoomEventListener#onMemberRemoved` 回调，其他成员收到 `ChatRoomEventListener#onMemberExited` 回调。

被移出的成员可以重新进入聊天室。

示例代码如下：

```typescript
try {
  // 将指定成员移出聊天室
  await ChatClient.getInstance().roomManager
    .removeChatRoomMembers('<room_id>', ['<member_user_id>']);
  // 成员移出成功
} catch (error: unknown) {
  // 成员移出失败
  console.error('成员移出失败：', error);
}
```

### 离线后自动退出

由于网络等原因，聊天室中的成员离线超过 2 分钟会自动退出聊天室。若需调整该时间，需联系环信商务。

以下两类成员即使离线也不会退出聊天室：

- 聊天室白名单中的成员（聊天室所有者和管理员默认加入白名单）。
- [调用 RESTful API 创建聊天室](/document/server-side/chatroom_create.html) 时拉入的用户从未登录过。

若开启了聊天室多端多设备功能，聊天室白名单中的成员在一台设备上离线重连后，无法收到聊天室的消息。若使该设备收到收到聊天室的消息，需要登录后手动调用 API 加入聊天室。

## 获取聊天室列表

你可以调用 `ChatRoomManager#fetchPublicChatRoomsFromServer` 方法分页获取聊天室列表。

该接口获取当前应用下的聊天室列表，不仅限于当前用户已加入的聊天室。若要获取本地已加入的聊天室详情，可使用 `ChatRoomManager#getChatRoomWithId`；若要获取当前用户加入的聊天室列表，需要结合业务侧本地维护。

本地读取不会主动请求服务端详情，返回对象也可能仅包含 ID 等默认信息，不能仅凭对象存在判断当前用户已加入该聊天室。

```typescript
try {
// pageSize：每页期望返回的聊天室数量，取值范围为 [1, 1000]。
  const result = await ChatClient.getInstance().roomManager
    .fetchPublicChatRoomsFromServer(1, 20);
  // 通过 result.list 获取当前页聊天室列表
  console.log(result.list);
} catch (error: unknown) {
  // 获取聊天室列表失败
  console.error('获取聊天室列表失败：', error);
}
```

返回结果 `ChatPageResult<ChatRoom>` 的主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `list` | `ChatRoom[] \| undefined` | 当前页的聊天室列表。 |
| `pageCount` | `number` | 服务端返回的数量字段。若该值小于请求时传入的 `pageSize`，表示服务端没有更多聊天室数据。 |

`list` 返回的每个 `ChatRoom` 对象可读取以下主要字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `roomId` | `string` | 聊天室 ID。 |
| `roomName` | `string \| undefined` | 聊天室名称。 |
| `description` | `string \| undefined` | 聊天室描述。 |
| `owner` | `string` | 聊天室所有者的用户 ID。 |
| `memberCount` | `number \| undefined` | 聊天室当前在线成员数。 |
| `createTimestamp` | `number \| undefined` | 聊天室创建时间戳，单位为毫秒。 |

## 监听聊天室事件

`ChatRoomEventListener` 接口中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

先定义监听器，具体事件如下：

```typescript
const roomListener: ChatRoomEventListener = {
  // 聊天室被解散。聊天室的所有成员会收到该事件
  onDestroyed: ({ roomId, roomName }) => {
    console.log('聊天室被解散：', roomId, roomName);
  },
  // 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件
  onMemberJoined: ({ roomId, participant, ext }) => {
    console.log('成员加入：', roomId, participant, ext);
  },
  // 有成员主动退出或被移出聊天室。聊天室的所有成员（除退出的成员）会收到该事件
  onMemberExited: ({ roomId, participant }) => {
    console.log('成员退出：', roomId, participant);
  },
  // 有成员被移出聊天室。被移出的成员收到该事件
  onMemberRemoved: ({ roomId, participant, reason }) => {
    console.log('被移出聊天室：', roomId, participant, reason);
  },
  // 有成员被加入禁言列表。被禁言成员和其他未操作的所有者或管理员收到该事件
  onMuteListAddedV2: ({ roomId, mutes }) => {
    console.log('添加禁言：', roomId, mutes);
  },
  // 有成员被移出禁言列表。被解除禁言成员和其他未操作的所有者或管理员收到该事件
  onMuteListRemoved: ({ roomId, mutes }) => {
    console.log('解除禁言：', roomId, mutes);
  },
  // 有成员被加入白名单列表。被添加的成员收到该事件
  onAllowListAdded: ({ roomId }) => {
    // 根据通知重新查询白名单状态，当前 Android 端不提供可用的 members 字段
    console.log('白名单增加：', roomId);
  },
  // 有成员被移出白名单列表。被移出白名单的成员会收到该事件
  onAllowListRemoved: ({ roomId }) => {
    console.log('白名单移除：', roomId);
  },
  // 全员禁言状态变更。聊天室所有成员会收到该事件
  onAllChatRoomMemberMuteStateChanged: ({ roomId, isAllMuted }) => {
    console.log('全员禁言状态：', roomId, isAllMuted);
  },
  // 有成员被设为管理员。新管理员及其他管理员收到该事件
  onAdminAdded: ({ roomId, admin }) => {
    console.log('添加管理员：', roomId, admin);
  },
  // 有成员被移除管理员权限。被移除的管理员及其他管理员收到该事件
  onAdminRemoved: ({ roomId, admin }) => {
    console.log('移除管理员：', roomId, admin);
  },
  // 聊天室所有者变更。新所有者及管理员收到该事件
  onOwnerChanged: ({ roomId, newOwner, oldOwner }) => {
    console.log('所有者变更：', roomId, newOwner, oldOwner);
  },
  // 聊天室详情有变更。聊天室的所有成员会收到该事件
  onSpecificationChanged: (room) => {
    console.log('聊天室详情变更：', room);
  },
  // 聊天室公告变更。聊天室的所有成员会收到该事件
  onAnnouncementChanged: ({ roomId, announcement }) => {
    console.log('公告变更：', roomId, announcement);
  },
  // 聊天室自定义属性有更新。将回调作为变更通知，再查询最新属性
  onAttributesUpdated: ({ roomId, from }) => {
    console.log('自定义属性更新：', roomId, from);
  },
  // 有聊天室自定义属性被移除
  onAttributesRemoved: ({ roomId, removedKeys, from }) => {
    console.log('自定义属性删除：', roomId, removedKeys, from);
  },
};
```

定义完成后注册监听器；不再需要监听时，调用清理函数移除同一个监听器对象：

```typescript
// 注册聊天室回调
ChatClient.getInstance().roomManager.addRoomListener(roomListener);

function removeRoomListener(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().roomManager.removeRoomListener(roomListener);
}
```

// TODO：研发确认

:::notice
React Native SDK 5.0.0 的以下事件字段存在使用限制：

- `ChatRoomEventListener#onMemberRemoved` 的 `reason` 声明为可选字符串，但原生端实际传入数值，SDK 未导出对应原因枚举，不应按字符串或其他平台枚举判断。
- Android 端 `ChatRoomEventListener#onAllowListAdded` 和 `ChatRoomEventListener#onAllowListRemoved` 的 `members` 字段可能缺失，可将事件作为通知，再查询白名单或自身白名单状态。
- `ChatRoomEventListener#onAttributesUpdated` 的 `attributes` 不能直接按属性名读取。可将事件作为变更通知，再调用 `ChatRoomManager#fetchChatRoomAttributes` 查询最新属性；查询结果为当前状态，而非本次变更的历史快照。
:::

## 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `ChatRoomEventListener#onMemberJoined` 事件。有成员主动或被动退出时，其他成员会收到 `ChatRoomEventListener#onMemberExited` 事件，被移出的成员收到 `ChatRoomEventListener#onMemberRemoved` 事件。

2. 收到通知事件后，调用 `ChatRoomManager#getChatRoomWithId` 方法获取本地聊天室详情，再通过 `ChatRoom.memberCount` 读取聊天室当前人数。该属性为可选值，缺失时不要直接当作 `0`。

```typescript
const countListener: ChatRoomEventListener = {
  onMemberJoined: ({ roomId }) => {
    // 获取聊天室在线人数
    void ChatClient.getInstance().roomManager.getChatRoomWithId(roomId)
      .then((room) => console.log('聊天室在线人数：', room?.memberCount))
      .catch((error: unknown) => console.error('读取聊天室人数失败：', error));
  },
  onMemberExited: ({ roomId }) => {
    // 成员退出时，同样读取本地聊天室的在线人数
    void ChatClient.getInstance().roomManager.getChatRoomWithId(roomId)
      .then((room) => console.log('聊天室在线人数：', room?.memberCount))
      .catch((error: unknown) => console.error('读取聊天室人数失败：', error));
  },
};
ChatClient.getInstance().roomManager.addRoomListener(countListener);

// 不再需要监听时，移除同一个监听器对象
function removeCountListener(): void {
  ChatClient.getInstance().roomManager.removeRoomListener(countListener);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatRoomManager#fetchPublicChatRoomsFromServer`](#获取聊天室列表) | `ChatRoomManager` | 获取应用下的聊天室列表。 |
| [`ChatRoomManager#joinChatRoomEx`](#加入聊天室) | `ChatRoomManager` | 加入聊天室。 |
| [`ChatRoomManager#leaveChatRoom`](#主动退出) | `ChatRoomManager` | 主动退出聊天室。 |
| [`ChatRoomManager#removeChatRoomMembers`](#被移出) | `ChatRoomManager` | 将成员移出聊天室。 |
| [`ChatRoomManager#getChatRoomWithId`](#实时更新聊天室成员人数) | `ChatRoomManager` | 获取本地聊天室详情。 |
