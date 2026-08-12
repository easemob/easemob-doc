# 管理消息话题

## 功能说明

消息话题（Thread）是群组内围绕某条父消息展开的独立讨论空间。开启该功能后，群成员可以基于指定群消息创建话题，并在该话题内进行集中回复和管理。

本文介绍如何使用环信即时通讯 IM Web SDK 在项目中创建和管理消息话题，并实现消息话题相关功能。

## 功能开通

使用消息话题功能前，你需要在联系商务开通。

## 前提条件

开始前，请确保满足以下条件：

- 已完成 SDK 初始化并登录，详见 [快速开始](quickstart.html)。
- SDK 初始化时，已注册 `ChatThreadManager`。
- 已了解消息话题及其成员数量等限制，详见[使用限制](/product/limitation.html)。
- 已联系商务开通了消息话题功能。

## 创建消息话题

群成员可调用 `createChatThread` 方法，基于一条群消息创建消息话题。

创建成功后，消息话题所属群组的所有成员会收到 `onChatThreadCreated` 事件。若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_CREATE`。

示例代码如下：

```typescript
const result = await client.chatThreadManager.createChatThread({
  // 话题所属的父级群组 ID。
  parentId: 'group1',
  // 话题名称。
  name: '讨论主题',
  // 作为话题根消息的父消息 ID。
  messageId: 'msg-id-123',
});

console.log('Thread ID:', result.chatThreadId);
```

## 解散消息话题

通常情况下，仅话题所属群组的群主和群管理员可调用 `destroyChatThread` 方法解散消息话题。

解散成功后，消息话题所属群组的所有成员会收到 `onChatThreadDestroyed` 事件。若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_DESTROY`。

示例代码如下：

```typescript
await client.chatThreadManager.destroyChatThread({
  // 待解散的话题 ID。
  chatThreadId: 'thread1',
});
```

## 加入消息话题

话题所属群组的成员可调用 `joinChatThread` 方法加入消息话题。

加入消息话题的推荐步骤如下：

1. 通过 `onChatThreadCreated` 事件，或调用 `getChatThreadList` 方法，获取目标群组中的消息话题列表。
2. 确定要加入的话题 ID。
3. 调用 `joinChatThread` 方法加入该话题。

若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_JOIN`。

示例代码如下：

```typescript
await client.chatThreadManager.joinChatThread({
  // 待加入的话题 ID。
  chatThreadId: 'thread1',
});
```

## 退出消息话题

### 主动退出

消息话题成员可调用 `leaveChatThread` 方法主动退出消息话题。退出后，该成员将不再接收该话题中的后续消息。

若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_LEAVE`。

示例代码如下：

```typescript
await client.chatThreadManager.leaveChatThread({
  // 待退出的话题 ID。
  chatThreadId: 'thread1',
});
```

### 移出成员

通常情况下，仅群主和群管理员可调用 `removeChatThreadMember` 方法将指定成员移出消息话题。被移出后，该成员将不再接收该话题中的后续消息。

被移出的当前登录用户会收到 `onChatThreadUserRemoved` 事件。若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_KICK`。

示例代码如下：

```typescript
await client.chatThreadManager.removeChatThreadMember({
  // 目标话题 ID。
  chatThreadId: 'thread1',
  // 待移出的成员用户 ID。
  memberId: 'user3',
});
```

## 修改消息话题名称

通常情况下，仅群主、群管理员以及话题创建者可调用 `updateChatThreadName` 方法修改消息话题名称。

修改成功后，消息话题所属群组的所有成员会收到 `onChatThreadUpdated` 事件。若当前用户同时在其他设备登录，其余设备会收到 `onMultiDeviceThread` 多设备事件，事件类型为 `THREAD_UPDATE`。

示例代码如下：

```typescript
await client.chatThreadManager.updateChatThreadName({
  // 待修改的话题 ID。
  chatThreadId: 'thread1',
  // 新的话题名称。
  name: '新主题名称',
});
```

## 获取消息话题详情

话题相关成员可调用 `getChatThreadInfo` 方法从服务器获取消息话题详情。

示例代码如下：

```typescript
const detail = await client.chatThreadManager.getChatThreadInfo({
  // 目标话题 ID。
  chatThreadId: 'thread1',
});

console.log('话题详情:', detail);
```

## 获取消息话题成员列表

话题所属群组的成员可调用 `getChatThreadMemberList` 方法从服务器分页获取消息话题成员列表。

示例代码如下：

```typescript
const result = await client.chatThreadManager.getChatThreadMemberList({
  // 目标话题 ID。
  chatThreadId: 'thread1',
  // 每页返回的成员数量，默认 20，取值范围为 1-50。
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log('成员列表:', result.items);
console.log('下一页游标:', result.cursor);
```

## 获取消息话题列表

1. 你可以调用 `getJoinedChatThreadList` 方法，从服务器分页获取当前用户已加入的消息话题列表：

```typescript
const joined = await client.chatThreadManager.getJoinedChatThreadList({
  // 可选：父级群组 ID。不传时查询当前用户加入的所有话题。
  parentId: 'group1',
  // 每页返回的话题数量，默认 20，取值范围为 1-50。
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log('已加入的话题列表:', joined.items);
console.log('下一页游标:', joined.cursor);
```

2. 你也可以调用 `getJoinedChatThreadList` 方法，从服务器分页获取当前用户在指定群组内已加入的消息话题列表：

```typescript
const joinedInGroup = await client.chatThreadManager.getJoinedChatThreadList({
  // 指定群组 ID。
  parentId: 'group1',
  // 每页返回的话题数量，默认 20，取值范围为 1-50。
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log('指定群组内已加入的话题列表:', joinedInGroup.items);
console.log('下一页游标:', joinedInGroup.cursor);
```

3. 你还可以调用 `getChatThreadList` 方法，从服务器分页获取指定群组中的消息话题列表：

```typescript
const result = await client.chatThreadManager.getChatThreadList({
  // 父级群组 ID。
  parentId: 'group1',
  // 每页返回的话题数量，默认 20，取值范围为 1-50。
  pageSize: 20,
  // 分页游标。首次请求可不传，或在运行时传 `null` / `''`；后续请求传入上次返回结果中的 `cursor`。当返回的 `cursor` 为空字符串时，表示已到达最后一页。
  cursor: '',
});

console.log('群组内的话题列表:', result.items);
console.log('下一页游标:', result.cursor);
```

## 批量获取消息话题中的最后一条消息

你可以调用 `getChatThreadLastMessageList` 方法，从服务器批量获取一个或多个消息话题中的最后一条消息摘要。

示例代码如下：

```typescript
const result = await client.chatThreadManager.getChatThreadLastMessageList({
  // 待查询的话题 ID 列表，每次最多可传 20 个。
  chatThreadIds: ['thread1', 'thread2'],
});

console.log('最后一条消息列表:', result.items);
```

## 监听消息话题事件

SDK 提供 `chatThreadManager.addEventHandler` 方法用于注册消息话题事件监听。你可以通过该监听获取话题创建、解散、更新以及当前用户被移出话题等事件。

当前公开的消息话题事件包括：

- `onChatThreadCreated`
- `onChatThreadDestroyed`
- `onChatThreadUpdated`
- `onChatThreadUserRemoved`

若需监听多设备同步的消息话题操作，应通过 `client.addEventHandler` 监听 `onMultiDeviceThread`。

示例代码如下：

```typescript
// 监听公开的消息话题事件。
client.chatThreadManager.addEventHandler('thread-events', {
  onChatThreadCreated: (event) => {
    console.log('话题创建:', event.chatThreadId, event.chatThreadName);
  },
  onChatThreadDestroyed: (event) => {
    console.log('话题解散:', event.chatThreadId);
  },
  onChatThreadUpdated: (event) => {
    console.log('话题更新:', event.chatThreadId, event.messageCount);
  },
  onChatThreadUserRemoved: (event) => {
    console.log('当前用户被移出话题:', event.chatThreadId, event.memberId);
  },
});

// 如需监听多设备消息话题事件，可在 ChatClient 上注册。
client.addEventHandler('thread-multi-device-events', {
  onMultiDeviceThread: (event) => {
    console.log('多设备话题事件:', event.operation, event.threadId, event.deviceId);
  },
});
```

## 接口列表

| API 名称     | 所属模块/类         | 说明            |
| :-------------- | :----- | :------- |
| [`createChatThread`](#创建消息话题)                          | `ChatThreadManager` | 基于指定群消息创建消息话题。                     |
| [`destroyChatThread`](#解散消息话题)                         | `ChatThreadManager` | 解散消息话题。                                   |
| [`joinChatThread`](#加入消息话题)                            | `ChatThreadManager` | 加入消息话题。                                   |
| [`leaveChatThread`](#退出消息话题)                           | `ChatThreadManager` | 主动退出消息话题。                               |
| [`removeChatThreadMember`](#移出成员)      | `ChatThreadManager` | 将指定成员移出消息话题。                         |
| [`updateChatThreadName`](#修改消息话题名称)                  | `ChatThreadManager` | 修改消息话题名称。                               |
| [`getChatThreadInfo`](#获取消息话题详情)                     | `ChatThreadManager` | 获取消息话题详情。                               |
| [`getChatThreadMemberList`](#获取消息话题成员列表)           | `ChatThreadManager` | 分页获取消息话题成员列表。                       |
| [`getJoinedChatThreadList`](#获取消息话题列表)               | `ChatThreadManager` | 分页获取当前用户已加入的消息话题列表。           |
| [`getChatThreadList`](#获取消息话题列表)                     | `ChatThreadManager` | 分页获取指定群组中的消息话题列表。               |
| [`getChatThreadLastMessageList`](#批量获取消息话题中的最后一条消息) | `ChatThreadManager` | 批量获取一个或多个消息话题中的最后一条消息摘要。 |