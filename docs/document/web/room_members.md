# 聊天室成员管理

## 功能说明

聊天室适用于直播互动、开放讨论和消息广播等多人实时互动场景。本文介绍如何使用 SDK 管理聊天室成员，包括查询成员列表、管理员、白名单、黑名单和禁言等功能。

## 接口使用方式

SDK 提供 `ChatRoomManager` 管理器和 `ChatRoom` 单聊天室对象用于管理聊天室成员：

- `client.chatRoomManager` 适合处理直接按 `chatRoomId` 操作聊天室成员。
- `client.chatRoomManager.getChatRoom(chatRoomId)` 可获取绑定指定聊天室的 `ChatRoom` 对象，适合在已知聊天室 ID 的页面内连续执行成员列表、管理员、禁言、白名单、黑名单和公告等操作。
- 对于成员列表、管理员、禁言、白名单和黑名单等单聊天室操作，推荐优先使用 `ChatRoom` 单聊天室对象写法。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录成功。
- 初始化 SDK 时已注册 `ChatRoomManager`，能够通过 `client.chatRoomManager` 调用聊天室相关接口。
- 已了解聊天室数量、聊天室成员数量、接口调用频率和套餐能力等服务限制，详见 [使用限制](/product/limitation.html)。

## 获取聊天室成员列表

先调用 `getChatRoom` 获取单聊天室对象，再调用 `getMembers` 分页获取聊天室成员列表。返回结果中包含成员用户信息、成员角色和加入聊天室时间等信息。

服务器不对成员进行排序，因此，返回的成员列表不保证有序。

```typescript
const chatRoom = client.chatRoomManager.getChatRoom('chatroomId');

const result = await chatRoom.getMembers({
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
  // 每页获取的成员数。取值范围为 [1,50]，默认为 50。
  pageSize: 50,
});

console.log(result.items);
console.log(result.cursor);
console.log(result.hasMore);
```

返回结果中，`items` 为当前页成员列表；`cursor` 为下一页游标，若服务端未返回游标则该字段可能为空；`hasMore` 表示是否还有下一页，服务端未返回时该字段可能为空。

`items` 中的每一项均为 `ChatRoomMemberEntry`，主要字段如下：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `user` | Object | 成员用户信息。至少包含 `userId`，其他信息字段取决于本地缓存或服务端返回结果。 |
| `role` | String | 成员在聊天室中的角色，可能为 `owner`、`admin` 或 `member`。服务端未返回时，该字段可能为空。 |
| `joinedAt` | Number | 成员加入聊天室的时间戳。服务端未返回时，该字段可能为空。 |

## 管理聊天室所有者和管理员

### 变更聊天室所有者

当前 SDK 未提供客户端转让聊天室所有者的接口。若业务要变更聊天室所有者，需调用 [服务端接口](/document/server-side/chatroom_owner_transfer.html)。

### 添加聊天室管理员

仅聊天室所有者可调用 `addAdmin` 添加聊天室管理员。添加成功后，新管理员及其他管理员会收到 `onAdminAdded` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').addAdmin({
  userId: 'user1',
});
```

### 移除聊天室管理员

仅聊天室所有者可调用 `removeAdmin` 移除聊天室管理员。移除成功后，被移除的管理员及其他管理员会收到 `onAdminRemoved` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').removeAdmin({
  userId: 'user1',
});
```

### 获取聊天室管理员列表

聊天室所有者和管理员可调用 `getAdminList` 获取聊天室管理员列表。

```typescript
const admins = await client.chatRoomManager.getChatRoom('chatroomId').getAdminList();
console.log(admins);
```

## 管理聊天室白名单

聊天室白名单成员在全员禁言场景下仍可发言；聊天室所有者和管理员默认属于白名单。

白名单成员发送的消息具有更高的投递优先级，但不保证一定能够送达。当系统负载较高时，服务端可能优先丢弃低优先级消息；若负载持续升高，也可能丢弃高优先级消息。

### 添加成员到白名单

聊天室所有者或管理员可调用 `addUsersToAllowlist` 将指定成员加入聊天室白名单。添加成功后，该成员以及聊天室所有者和管理员（除操作者外）会收到 `onAllowListAdded` 事件。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').addUsersToAllowlist({
  userIds: ['user1'],
});

console.log(result);
```

### 从白名单移除成员

聊天室所有者或管理员可调用 `removeUsersFromAllowlist` 将指定成员移出聊天室白名单。移除成功后，该成员以及聊天室所有者和管理员（除操作者外）会收到 `onAllowListRemoved` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').removeUsersFromAllowlist({
  userIds: ['user1'],
});
```

### 查询当前用户是否在白名单中

调用 `checkIfInAllowList` 可查询当前登录用户是否在该聊天室白名单中。

```typescript
const inAllowlist = await client.chatRoomManager.getChatRoom('chatroomId').checkIfInAllowList();
console.log(inAllowlist);
```

### 获取白名单列表

聊天室所有者或管理员可调用 `getAllowlist` 获取聊天室白名单列表。

```typescript
const allowlist = await client.chatRoomManager.getChatRoom('chatroomId').getAllowlist();
console.log(allowlist);
```

## 管理聊天室黑名单

聊天室黑名单用于禁止指定用户加入或继续留在聊天室。成员被加入黑名单后，会被移出聊天室，无法继续收发该聊天室消息；只有先从黑名单移除，才可再次加入聊天室。

### 添加成员到黑名单

聊天室所有者或管理员可调用 `blockMembers` 将指定成员加入聊天室黑名单。被加入黑名单后，该成员收到 `onMembersExited` 回调事件。

- 被加入黑名单的成员会被移出聊天室，且无法继续收发该聊天室消息。
- 默认情况下，其他聊天室成员不会收到该事件通知；如需此类事件通知，请联系商务支持。
- 黑名单中的成员如需再次加入聊天室，必须先由聊天室所有者或管理员将其移出黑名单。

```typescript
const result = await client.chatRoomManager.getChatRoom('chatroomId').blockMembers({
  userIds: ['user1'],
});

console.log(result);
```

### 从黑名单移除成员

聊天室所有者或管理员可调用 `unblockMembers` 将指定成员移出聊天室黑名单。移出黑名单后，该用户可以再次加入聊天室。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unblockMembers({
  userIds: ['user1'],
});
```

### 获取黑名单列表

聊天室所有者或管理员可调用 `getBlocklist` 分页获取聊天室黑名单列表。

```typescript
const blocklist = await client.chatRoomManager.getChatRoom('chatroomId').getBlocklist({
  // 当前页码，从 1 开始。
  pageNum: 1,
  // 每页获取的黑名单用户数。取值范围为 [1,50]，默认值是 20。
  pageSize: 20,
});

console.log(blocklist);
```

## 管理聊天室禁言

聊天室所有者和管理员可以对指定成员单独禁言，也可以开启全员禁言。

这两种禁言方式相互独立，互不影响：

- 单独禁言：将指定用户加入禁言列表。
- 全员禁言：一键禁言聊天室普通成员。白名单成员在全员禁言场景下仍可发言。
- 开启或关闭全员禁言不会影响单个成员的禁言列表。

### 禁言指定成员

聊天室所有者或管理员可调用 `muteMembers` 将一个或多个成员加入聊天室禁言列表。加入禁言列表后，被禁言成员、聊天室管理员和聊天室所有者（除操作者外）会收到 `onMuteListAdded` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').muteMembers({
  userIds: ['user1'],
  // 禁言时长，单位为秒。传 -1 表示永久禁言。
  duration: 3600,
});
```

### 解除指定成员禁言

聊天室所有者或管理员可调用 `unmuteMembers` 将单个或多个成员移出聊天室禁言列表。解除禁言后，被解除禁言的成员、聊天室管理员和聊天室所有者（除操作者外）会收到 `onMuteListRemoved` 事件。

:::tip
聊天室所有者可解除所有成员的禁言状态；聊天室管理员通常只能解除普通成员的禁言状态。
:::

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unmuteMembers({
  userIds: ['user1'],
});
```

### 查询当前用户是否被禁言

聊天室成员可以调用 `checkIfInMuteList` 查询当前登录用户是否在该聊天室禁言列表中。

```typescript
const status = await client.chatRoomManager.getChatRoom('chatroomId').checkIfInMuteList();

console.log(status.muted);
console.log(status.muteExpireAt);
```

### 获取禁言列表

聊天室所有者或管理员可调用 `getMuteList` 分页获取聊天室禁言列表。

```typescript
const muteList = await client.chatRoomManager.getChatRoom('chatroomId').getMuteList({
  // 当前页码，从 1 开始。
  pageNum: 1,
  // 每页返回的禁言成员数。
  pageSize: 20,
});

console.log(muteList);
```

### 开启全员禁言

聊天室所有者或管理员可调用 `muteAllMembers` 开启全员禁言。全员禁言不会自动到期，如要关闭需主动调用 `unmuteAllMembers`。

开启后，聊天室成员会收到 `onAllMemberMuteStateChanged` 事件。除白名单成员外，其他成员将无法发送聊天室消息。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').muteAllMembers();
```

### 关闭全员禁言

聊天室所有者或管理员可调用 `unmuteAllMembers` 关闭全员禁言。关闭后，聊天室成员会收到 `onAllMemberMuteStateChanged` 事件。

```typescript
await client.chatRoomManager.getChatRoom('chatroomId').unmuteAllMembers();
```

## 监听聊天室成员事件

聊天室成员相关操作成功后，SDK 会触发对应聊天室事件。你可以调用 `addEventHandler` 注册聊天室事件监听器。

```typescript
client.chatRoomManager.addEventHandler('chatroom-member-events', {
  // 有成员被设为管理员。被添加的管理员会收到该事件。
  onAdminAdded: event => {
    console.log('聊天室新增管理员:', event.chatRoomId, event.admin);
  },
  // 有成员被移除管理员权限。被移除的管理员会收到该事件。
  onAdminRemoved: event => {
    console.log('聊天室移除管理员:', event.chatRoomId, event.admin);
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
});
```

如需移除监听器，可调用 `removeEventHandler`：

```typescript
client.chatRoomManager.removeEventHandler('chatroom-member-events');
```

## 注意事项

- 本文中的 `chatRoomId`、`userId` 和 `userIds` 均不能为空；参数非法时 SDK 会抛出参数错误。
- `userIds` 用于批量操作成员，不能为空数组；SDK 会过滤空字符串并对重复用户 ID 做归一化处理。
- `getMembers` 使用游标分页；`getMuteList` 和 `getBlocklist` 使用页码分页。
- `muteMembers` 的禁言时长参数为 `duration`，单位为秒。
- `checkIfInAllowList` 和 `checkIfInMuteList` 查询的是当前登录用户自身状态，不支持传入其他用户 ID。
- 管理员、白名单、黑名单和禁言等操作需要当前用户具备聊天室所有者或管理员权限；无权限或鉴权失败时 SDK 会抛出错误。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`getChatRoom`](#获取聊天室成员列表) | `ChatRoomManager` | 获取绑定指定聊天室 ID 的 `ChatRoom` 单聊天室对象。 |
| [`getMembers`](#获取聊天室成员列表) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象分页获取聊天室成员列表。 |
| [`leaveChatRoom`](room_manage.html#主动退出) | `ChatRoom` | 当前登录用户主动退出聊天室。 |
| [`removeMembers`](room_manage.html#移出成员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象移除一个或多个聊天室成员。 |
| [`addAdmin`](#添加聊天室管理员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象添加聊天室管理员。 |
| [`removeAdmin`](#移除聊天室管理员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象移除聊天室管理员。 |
| [`getAdminList`](#获取聊天室管理员列表) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室管理员列表。 |
| [`addUsersToAllowlist`](#添加成员到白名单) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象将成员加入白名单。 |
| [`removeUsersFromAllowlist`](#从白名单移除成员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象将成员移出白名单。 |
| [`checkIfInAllowList`](#查询当前用户是否在白名单中) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象查询当前用户是否在白名单中。 |
| [`getAllowlist`](#获取白名单列表) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室白名单。 |
| [`blockMembers`](#添加成员到黑名单) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象将成员加入聊天室黑名单。 |
| [`unblockMembers`](#从黑名单移除成员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象将成员移出聊天室黑名单。 |
| [`getBlocklist`](#获取黑名单列表) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室黑名单。 |
| [`muteMembers`](#禁言指定成员) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象禁言指定成员。 |
| [`unmuteMembers`](#解除指定成员禁言) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象解除指定成员禁言。 |
| [`checkIfInMuteList`](#查询当前用户是否被禁言) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象查询当前用户是否被禁言。 |
| [`getMuteList`](#获取禁言列表) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象获取聊天室禁言列表。 |
| [`muteAllMembers`](#开启全员禁言) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象开启全员禁言。 |
| [`unmuteAllMembers`](#关闭全员禁言) | `ChatRoom` | 通过 `ChatRoom` 单聊天室对象关闭全员禁言。 |
