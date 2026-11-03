# 管理消息话题

## 功能说明

消息话题是群组成员的子集，是支持多人沟通的即时通讯系统。使用消息话题功能前，你需要联系商务开通。

本文介绍如何使用环信即时通讯 IM React Native SDK 在实时互动 app 中创建和管理消息话题，并实现消息话题相关功能。如需查看消息相关内容，参见 [消息话题中的消息管理](thread_message.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并登录成功，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 创建消息话题

所有群成员均可以调用 `ChatManager#createChatThread` 方法，基于一条群组消息新建消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `ChatMessageEventListener#onChatMessageThreadCreated` 回调；Android 端多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_CREATE`。

// TODO：研发确认
:::notice
React Native SDK 5.0.0 的 iOS 端无法正常将消息话题多设备事件转发至 `ChatMultiDeviceEventListener#onThreadEvent`，请勿依赖该回调刷新消息话题界面。应用可按需重新查询消息话题列表或详情。此限制不影响 `ChatMessageEventListener` 中的消息话题事件回调。
:::

示例代码如下：

```typescript
// parentId：群组 ID
const parentId = '<group_id>';
// msgId：消息 ID，基于该消息创建消息话题
const msgId = '<group_message_id>';
// name：消息话题名称，长度不超过 64 个字符
const name = '消息话题名称';

try {
  // 基于群组消息创建消息话题，注意参数顺序为名称、消息 ID、群组 ID
  const thread = await ChatClient.getInstance().chatManager
    .createChatThread(name, msgId, parentId);
  // 处理创建成功的消息话题
  console.log('消息话题创建成功：', thread);
} catch (error: unknown) {
  // 处理创建失败
  console.error('创建消息话题失败：', error);
}
```

## 解散消息话题

仅消息话题所在群组的群主和群管理员可以调用 `ChatManager#destroyChatThread` 方法解散消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `ChatMessageEventListener#onChatMessageThreadDestroyed` 回调；Android 端多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_DESTROY`。

:::tip
解散消息话题后，将删除其本地会话和消息；消息话题所在群组解散后，也无法再使用该消息话题，需谨慎操作。
:::

示例代码如下：

```typescript
const chatThreadId = '<chat_thread_id>';

try {
  // 解散指定消息话题
  await ChatClient.getInstance().chatManager.destroyChatThread(chatThreadId);
  // 处理解散成功
  console.log('消息话题已解散');
} catch (error: unknown) {
  // 处理解散失败
  console.error('解散消息话题失败：', error);
}
```

## 加入消息话题

消息话题所在群组的所有成员均可以调用 `ChatManager#joinChatThread` 方法加入消息话题。

加入消息话题的具体步骤如下：

1. 收到 `ChatMessageEventListener#onChatMessageThreadCreated` 回调或 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调，或调用 `ChatManager#fetchChatThreadWithParentFromServer` 方法从服务器获取指定群组的消息话题列表，从中获取到想要加入的消息话题 ID。
2. 调用 `ChatManager#joinChatThread` 传入消息话题 ID 加入对应消息话题。

Android 端多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_JOIN`。

示例代码如下：

```typescript
const chatThreadId = '<chat_thread_id>';

try {
  // 加入指定消息话题
  const thread = await ChatClient.getInstance().chatManager
    .joinChatThread(chatThreadId);
  // 处理加入成功后返回的消息话题详情
  console.log('已加入消息话题：', thread);
} catch (error: unknown) {
  // 处理加入失败
  console.error('加入消息话题失败：', error);
}
```

## 退出消息话题

### 主动退出

消息话题成员均可以主动调用 `ChatManager#leaveChatThread` 方法退出消息话题，退出消息话题后，该成员将不会再收到消息话题中的消息。

Android 端多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_LEAVE`。

示例代码如下：

```typescript
const chatThreadId = '<chat_thread_id>';

try {
  // 主动退出指定消息话题
  await ChatClient.getInstance().chatManager.leaveChatThread(chatThreadId);
  // 处理退出成功
  console.log('已退出消息话题');
} catch (error: unknown) {
  // 处理退出失败
  console.error('退出消息话题失败：', error);
}
```

### 被移出消息话题

群主和群管理员可以调用 `ChatManager#removeMemberWithChatThread` 方法将指定成员 (群管理员或普通成员) 踢出消息话题，被踢出消息话题的成员将不再接收到消息话题中的消息。

被踢出消息话题的成员会收到 `ChatMessageEventListener#onChatMessageThreadUserRemoved` 回调。Android 端多设备登录时，执行踢人操作的成员的其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_KICK`。

// TODO：研发确认

:::notice
React Native SDK 5.0.0 的 iOS 端未正确传递消息话题 ID 和成员用户 ID，不能按该接口的公开参数顺序正常完成移除操作。当前版本的 iOS 应用可通过业务服务器调用 [移出消息话题成员接口](/document/server-side/group_thread_member_remove.html) 完成操作。不要通过交换公开接口参数规避该问题。
:::

以下示例适用于 Android 端：

```typescript
// chatThreadId：消息话题 ID
const chatThreadId = '<chat_thread_id>';
// memberId：消息话题成员的用户 ID
const memberId = '<member_user_id>';

try {
  // 将指定成员移出消息话题
  await ChatClient.getInstance().chatManager
    .removeMemberWithChatThread(chatThreadId, memberId);
  // 处理移除成功
  console.log('成员已移出消息话题');
} catch (error: unknown) {
  // 处理移除失败
  console.error('移出消息话题成员失败：', error);
}
```

## 修改消息话题名称

仅群主和群管理员以及消息话题的创建者可以调用 `ChatManager#updateChatThreadName` 方法修改消息话题名称。

单设备登录时，消息话题所属群组的所有成员会收到 `ChatMessageEventListener#onChatMessageThreadUpdated` 回调；Android 端多设备登录时，其他设备会同时收到 `ChatMultiDeviceEventListener#onThreadEvent` 回调，回调事件为 `ChatMultiDeviceEvent.THREAD_UPDATE`。

示例代码如下：

```typescript
// chatThreadId：消息话题 ID
const chatThreadId = '<chat_thread_id>';
// newName：修改的消息话题名称，长度不超过 64 个字符
const newName = '新的消息话题名称';

try {
  // 修改消息话题名称
  await ChatClient.getInstance().chatManager
    .updateChatThreadName(chatThreadId, newName);
  // 处理修改成功
  console.log('消息话题名称已修改');
} catch (error: unknown) {
  // 处理修改失败
  console.error('修改消息话题名称失败：', error);
}
```

## 获取消息话题详情

消息话题所属群组的所有成员均可以调用 `ChatManager#fetchChatThreadFromServer` 方法从服务器获取消息话题详情。

该方法返回 `Promise<ChatMessageThread | undefined>`，使用返回的消息话题对象前，请进行空值判断。

示例代码如下：

```typescript
// chatThreadId：消息话题 ID
const chatThreadId = '<chat_thread_id>';

try {
  // 从服务器获取消息话题详情
  const thread = await ChatClient.getInstance().chatManager
    .fetchChatThreadFromServer(chatThreadId);
  if (thread) {
    // 处理消息话题详情
    console.log('消息话题详情：', thread);
  }
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取消息话题详情失败：', error);
}
```

## 获取消息话题成员列表

消息话题所属群组的所有成员均可以调用 `ChatManager#fetchMembersWithChatThreadFromServer` 方法从服务器分页获取消息话题成员列表。

```typescript
// chatThreadId：消息话题 ID
const chatThreadId = '<chat_thread_id>';
// pageSize：单次请求返回的成员数，取值范围为 [1,50]，默认为 20
const pageSize = 20;
// cursor：开始获取数据的游标位置，首次调用方法时传空字符串
const cursor = '';

try {
  // 从服务器分页获取消息话题成员列表
  // `cursor` 默认为空字符串，首次查询可省略或传入空字符串，后续传入上一页返回的游标。
  // `pageSize`单次请求返回的成员数，取值范围为 [1,50]。
  // 结果中的 `list` 为成员用户 ID 列表。
  const result = await ChatClient.getInstance().chatManager
    .fetchMembersWithChatThreadFromServer(chatThreadId, cursor, pageSize);
  // 处理本页成员列表和后续查询的游标
  console.log('消息话题成员：', result.list, '游标：', result.cursor);
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取消息话题成员列表失败：', error);
}
```

## 获取消息话题列表

- 用户可以调用 `ChatManager#fetchJoinedChatThreadFromServer` 方法从服务器分页获取自己加入和创建的消息话题列表：

```typescript
// pageSize：单次请求返回的消息话题数，取值范围为 [1,50]。
const pageSize = 20;
// cursor：开始获取数据的游标位置，首次查询可省略或传入空字符串，后续传入上一页返回的游标。
const cursor = '';

try {
  // 分页获取自己加入和创建的消息话题列表
  const result = await ChatClient.getInstance().chatManager
    .fetchJoinedChatThreadFromServer(cursor, pageSize);
  // 处理本页消息话题列表和后续查询的游标
  // 结果中的 `list` 为消息话题列表
  console.log('已加入的消息话题：', result.list, '游标：', result.cursor);
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取已加入的消息话题列表失败：', error);
}
```

- 用户可以调用 `ChatManager#fetchJoinedChatThreadWithParentFromServer` 方法从服务器分页获取指定群组中自己加入和创建的消息话题列表：

```typescript
// parentId：群组 ID
const parentId = '<group_id>';
// pageSize：单次请求返回的消息话题数，取值范围为 [1,50]。
const pageSize = 20;
// cursor：开始获取数据的游标位置，首次查询可省略或传入空字符串，后续传入上一页返回的游标。
const cursor = '';

try {
  // 分页获取指定群组中自己加入和创建的消息话题列表
  const result = await ChatClient.getInstance().chatManager
    .fetchJoinedChatThreadWithParentFromServer(parentId, cursor, pageSize);
  // 处理本页消息话题列表和后续查询的游标
  // 结果中的 `list` 为消息话题列表
  console.log('群组中已加入的消息话题：', result.list, '游标：', result.cursor);
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取群组中已加入的消息话题列表失败：', error);
}
```

- 用户还可以调用 `ChatManager#fetchChatThreadWithParentFromServer` 方法从服务器分页获取指定群组的消息话题列表：

```typescript
// parentId：群组 ID
const parentId = '<group_id>';
// pageSize：单次请求返回的消息话题数，取值范围为 [1,50]。
const pageSize = 20;
// cursor：开始获取数据的游标位置，首次查询可省略或传入空字符串，后续传入上一页返回的游标。
const cursor = '';

try {
  // 从服务器分页获取指定群组的消息话题列表
  const result = await ChatClient.getInstance().chatManager
    .fetchChatThreadWithParentFromServer(parentId, cursor, pageSize);
  // 处理本页消息话题列表和后续查询的游标
  // 结果中的 `list` 为消息话题列表
  console.log('群组消息话题：', result.list, '游标：', result.cursor);
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取群组消息话题列表失败：', error);
}
```

## 批量获取消息话题中的最新一条消息

用户可以调用 `ChatManager#fetchLastMessageWithChatThread` 方法从服务器批量获取消息话题中的最新一条消息。

该方法返回 `Promise<Map<string, ChatMessage>>`，其中键为消息话题 ID，值为该消息话题的最新一条消息。

示例代码如下：

```typescript
// chatThreadIds：要查询的消息话题 ID 列表，每次最多可传入 20 个消息话题 ID
const chatThreadIds = ['<chat_thread_id_1>', '<chat_thread_id_2>'];

try {
  // 从服务器批量获取消息话题中的最新一条消息
  const messages = await ChatClient.getInstance().chatManager
    .fetchLastMessageWithChatThread(chatThreadIds);
  // 处理以消息话题 ID 为键的最新消息 Map
  console.log('消息话题最新消息：', messages);
} catch (error: unknown) {
  // 处理获取失败
  console.error('获取消息话题最新消息失败：', error);
}
```

## 监听消息话题事件

`ChatManager` 类中提供消息话题事件的监听接口。开发者可以通过设置此监听，获取消息话题中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```typescript
const threadListener: ChatMessageEventListener = {
  // 消息话题创建。消息话题所属群组的所有成员收到该事件。
  onChatMessageThreadCreated(event: ChatMessageThreadEvent): void {
    console.log('消息话题创建：', event.thread);
  },
  // 消息话题名称修改、消息话题中新增或撤回消息。消息话题所属群组的所有成员会收到该事件。
  onChatMessageThreadUpdated(event: ChatMessageThreadEvent): void {
    console.log('消息话题更新：', event.thread);
  },
  // 消息话题解散。消息话题所属群组的所有成员会收到该事件。
  onChatMessageThreadDestroyed(event: ChatMessageThreadEvent): void {
    console.log('消息话题解散：', event.thread);
  },
  // 消息话题成员被移除。被踢出消息话题的成员收到该事件。
  onChatMessageThreadUserRemoved(event: ChatMessageThreadEvent): void {
    console.log('被移出消息话题：', event.thread);
  },
};

// 注册监听
ChatClient.getInstance().chatManager.addMessageListener(threadListener);

function stopListeningToThreads(): void {
  // 不再需要监听时，移除同一个监听器对象
  ChatClient.getInstance().chatManager.removeMessageListener(threadListener);
}
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatManager#createChatThread`](#创建消息话题) | `ChatManager` | 基于群组消息创建消息话题。 |
| [`ChatManager#destroyChatThread`](#解散消息话题) | `ChatManager` | 解散消息话题。 |
| [`ChatManager#joinChatThread`](#加入消息话题) | `ChatManager` | 加入消息话题。 |
| [`ChatManager#leaveChatThread`](#主动退出) | `ChatManager` | 主动退出消息话题。 |
| [`ChatManager#removeMemberWithChatThread`](#被移出消息话题) | `ChatManager` | 将成员移出消息话题，iOS 端限制见正文。 |
| [`ChatManager#updateChatThreadName`](#修改消息话题名称) | `ChatManager` | 修改消息话题名称。 |
| [`ChatManager#fetchChatThreadFromServer`](#获取消息话题详情) | `ChatManager` | 从服务器获取消息话题详情。 |
| [`ChatManager#fetchMembersWithChatThreadFromServer`](#获取消息话题成员列表) | `ChatManager` | 分页获取消息话题成员列表。 |
| [`ChatManager#fetchJoinedChatThreadFromServer`](#获取消息话题列表) | `ChatManager` | 分页获取当前用户已加入或创建的消息话题列表。 |
| [`ChatManager#fetchJoinedChatThreadWithParentFromServer`](#获取消息话题列表) | `ChatManager` | 分页获取指定群组中当前用户已加入或创建的消息话题列表。 |
| [`ChatManager#fetchChatThreadWithParentFromServer`](#获取消息话题列表) | `ChatManager` | 分页获取指定群组的消息话题列表。 |
| [`ChatManager#fetchLastMessageWithChatThread`](#批量获取消息话题中的最新一条消息) | `ChatManager` | 批量获取消息话题中的最新一条消息。 |
