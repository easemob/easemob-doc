# 管理聊天室成员

## 功能说明

聊天室是支持多人沟通的即时通讯系统，适用于直播互动、开放讨论和消息广播等多人实时互动场景。本文介绍如何使用 SDK 管理聊天室成员，包括查询成员列表、管理员、白名单、黑名单和禁言等功能。

成员加入、退出和被移出聊天室的操作详见 [创建和管理聊天室](room_manage.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 获取聊天室成员列表

所有聊天室成员均可调用 `ChatRoomManager#fetchChatRoomMembers` 方法获取当前聊天室成员列表。服务器不对成员进行排序，因此，返回的成员列表不保证有序。

示例代码如下：

```typescript
// 首次调用时传空字符串，从最新数据开始获取。后续查询传入上一页返回的 `cursor`，空游标表示没有更多数据。
const cursor = ''; 
// 每页期望返回的成员数，最大值为 1,000。
const pageSize = 200; 
try {
  // 分页获取当前聊天室成员列表
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomMembers('<room_id>', cursor, pageSize);
  // 获取成员列表成功；后续查询传入 result.cursor
  console.log(result.list, result.cursor);
} catch (error: unknown) {
  // 获取成员列表失败
  console.error('获取成员列表失败：', error);
}
```

## 管理聊天室黑名单

聊天室黑名单中的成员不能加入聊天室，也不能在该聊天室中收发消息。

### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `ChatRoomManager#blockChatRoomMembers` 方法将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `ChatRoomEventListener#onMemberRemoved` 回调。默认情况下，其他成员不会收到事件通知。如需该事件，请联系商务开通。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室，黑名单中的成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

```typescript
try {
  // 将指定成员加入聊天室黑名单
  await ChatClient.getInstance().roomManager
    .blockChatRoomMembers('<room_id>', ['<member_user_id>']);
  // 加入黑名单成功
} catch (error: unknown) {
  // 加入黑名单失败
  console.error('加入黑名单失败：', error);
}
```

### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `ChatRoomManager#unBlockChatRoomMembers` 方法将成员移出聊天室黑名单。

示例代码如下：

```typescript
try {
  // 将成员移出聊天室黑名单
  await ChatClient.getInstance().roomManager
    .unBlockChatRoomMembers('<room_id>', ['<member_user_id>']);
  // 移出黑名单成功
} catch (error: unknown) {
  // 移出黑名单失败
  console.error('移出黑名单失败：', error);
}
```

### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager#fetchChatRoomBlockList` 方法获取当前聊天室黑名单。

示例代码如下：

```typescript
try {
  // pageNum	当前页码，从 1 开始。
  // pageSize	每页期望获取的黑名单中的成员数。取值范围为 [1,50]。
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomBlockList('<room_id>', 1, 20);
  // 获取黑名单成功
  console.log(result);
} catch (error: unknown) {
  // 获取黑名单失败
  console.error('获取黑名单失败：', error);
}
```

## 管理聊天室白名单

聊天室所有者和管理员默认会被加入聊天室白名单。聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

开启全员禁言后，聊天室所有者、管理员和白名单成员仍可发送消息；若成员同时被单独禁言，则仍不能发送消息。

### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager#fetchChatRoomAllowListFromServer` 获取当前聊天室白名单成员列表。

示例代码如下：

```typescript
try {
  // 获取当前聊天室白名单成员列表
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomAllowListFromServer('<room_id>');
  console.log('白名单：', result);
} catch (error: unknown) {
  // 获取白名单失败
  console.error('获取白名单失败：', error);
}
```

### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `ChatRoomManager#isMemberInChatRoomAllowList` 方法检查自己是否在聊天室白名单中，示例代码如下：

```typescript
try {
  // 检查自己是否在聊天室白名单中
  const result = await ChatClient.getInstance().roomManager
    .isMemberInChatRoomAllowList('<room_id>');
  console.log('是否在白名单中：', result);
} catch (error: unknown) {
  // 查询白名单状态失败
  console.error('查询白名单状态失败：', error);
}
```

// TODO：研发确认
:::notice
React Native SDK 5.0.0 的 Android 端，白名单变更回调中的 `members` 字段可能缺失。可将 `ChatRoomEventListener#onAllowListAdded` 和 `ChatRoomEventListener#onAllowListRemoved` 作为变更通知，再查询白名单或自身白名单状态。
:::

### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `ChatRoomManager#addMembersToChatRoomAllowList` 将成员加入聊天室白名单。被添加白名单的成员会收到 `ChatRoomEventListener#onAllowListAdded` 事件。

示例代码如下：

```typescript
try {
  // 将成员加入聊天室白名单
  await ChatClient.getInstance().roomManager
    .addMembersToChatRoomAllowList('<room_id>', ['<member_user_id>']);
} catch (error: unknown) {
  // 加入白名单失败
  console.error('加入白名单失败：', error);
}
```

### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager#removeMembersFromChatRoomAllowList` 将成员从聊天室白名单移出。被移出白名单的成员会收到 `ChatRoomEventListener#onAllowListRemoved` 事件。

示例代码如下：

```typescript
try {
  // 将成员移出聊天室白名单
  await ChatClient.getInstance().roomManager
    .removeMembersFromChatRoomAllowList('<room_id>', ['<member_user_id>']);
} catch (error: unknown) {
  // 移出白名单失败
  console.error('移出白名单失败：', error);
}
```

## 管理聊天室禁言列表

被单独禁言的成员不能在聊天室中发送消息。即使该成员同时在白名单中，单独禁言仍然生效。

### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager#muteChatRoomMembers` 方法将指定成员添加至聊天室禁言列表。被禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `ChatRoomEventListener#onMuteListAddedV2` 回调。

:::tip
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

示例代码如下：

```typescript
try {
  // 添加禁言；duration 单位为毫秒，默认 -1，表示永久禁言
  await ChatClient.getInstance().roomManager
    .muteChatRoomMembers('<room_id>', ['<member_user_id>'], -1);
  // 添加禁言成功
} catch (error: unknown) {
  // 添加禁言失败
  console.error('添加禁言失败：', error);
}
```

### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `ChatRoomManager#unMuteChatRoomMembers` 方法将成员移出聊天室禁言列表。被解除禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `ChatRoomEventListener#onMuteListRemoved` 回调。

:::tip
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

示例代码如下：

```typescript
try {
  // 将成员移出聊天室禁言列表
  await ChatClient.getInstance().roomManager
    .unMuteChatRoomMembers('<room_id>', ['<member_user_id>']);
  // 解除禁言成功
} catch (error: unknown) {
  // 解除禁言失败
  console.error('解除禁言失败：', error);
}
```

### 获取聊天室禁言列表

仅聊天室所有者和管理员可调用 `ChatRoomManager#fetchChatRoomMuteList` 获取聊天室禁言列表。返回 `Promise<string[]>`，仅包含用户 ID，不包含禁言到期时间。

示例代码如下：

```typescript
try {
  // pageNum	当前页码，从 1 开始。
  // pageSize	每页期望返回的禁言成员数。取值范围为 [1,50]。
  const result = await ChatClient.getInstance().roomManager
    .fetchChatRoomMuteList('<room_id>', 1, 20);
  // 获取禁言列表成功，返回用户 ID 数组
  console.log(result);
} catch (error: unknown) {
  // 获取禁言列表失败
  console.error('获取禁言列表失败：', error);
}
```

### 检查自己是否在聊天室禁言列表

聊天室成员可以调用 `ChatRoomManager#isMemberInChatRoomMuteList` 方法查看自己是否在聊天室禁言列表。

```typescript
try {
  // 检查自己是否在聊天室禁言列表中
  const result = await ChatClient.getInstance().roomManager
    .isMemberInChatRoomMuteList('<room_id>');
  if (result) {
    console.log('当前用户在聊天室禁言列表中');
  } else {
    console.log('当前用户不在聊天室禁言列表中');
  }
} catch (error: unknown) {
  // 查询禁言状态失败
  console.error('查询禁言状态失败：', error);
}
```

## 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表并不会变化。

### 开启全员禁言

仅聊天室所有者和管理员可以调用 `ChatRoomManager#muteAllChatRoomMembers` 方法开启全员禁言。全员禁言开启后不会在一段时间内自动解除禁言，需要调用 `ChatRoomManager#unMuteAllChatRoomMembers` 方法解除禁言。

全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `ChatRoomEventListener#onAllChatRoomMemberMuteStateChanged` 回调。

示例代码如下：

```typescript
try {
  // 开启聊天室全员禁言
  await ChatClient.getInstance().roomManager
    .muteAllChatRoomMembers('<room_id>');
} catch (error: unknown) {
  // 开启全员禁言失败
  console.error('开启全员禁言失败：', error);
}
```

### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `ChatRoomManager#unMuteAllChatRoomMembers` 方法取消全员禁言。调用成功后，聊天室成员会收到 `ChatRoomEventListener#onAllChatRoomMemberMuteStateChanged` 回调。

示例代码如下：

```typescript
try {
  // 关闭聊天室全员禁言
  await ChatClient.getInstance().roomManager
    .unMuteAllChatRoomMembers('<room_id>');
} catch (error: unknown) {
  // 关闭全员禁言失败
  console.error('关闭全员禁言失败：', error);
}
```

## 管理聊天室所有者和管理员

聊天室所有者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。

### 变更聊天室所有者

仅聊天室所有者可以调用 `ChatRoomManager#changeOwner` 方法将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `ChatRoomEventListener#onOwnerChanged` 回调。

示例代码如下：

```typescript
try {
  // 将聊天室所有权移交给指定成员
  await ChatClient.getInstance().roomManager
    .changeOwner('<room_id>', '<new_owner_user_id>');
  // 所有者变更成功
} catch (error: unknown) {
  // 所有者变更失败
  console.error('所有者变更失败：', error);
}
```

### 添加聊天室管理员

仅聊天室所有者可以调用 `ChatRoomManager#addChatRoomAdmin` 方法添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `ChatRoomEventListener#onAdminAdded` 回调。

示例代码如下：

```typescript
try {
  // 添加聊天室管理员
  await ChatClient.getInstance().roomManager
    .addChatRoomAdmin('<room_id>', '<admin_user_id>');
  // 添加管理员成功
} catch (error: unknown) {
  // 添加管理员失败
  console.error('添加管理员失败：', error);
}
```

### 移除聊天室管理员

仅聊天室所有者可以调用 `ChatRoomManager#removeChatRoomAdmin` 方法移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `ChatRoomEventListener#onAdminRemoved` 回调。

示例代码如下：

```typescript
try {
  // 移除聊天室管理员
  await ChatClient.getInstance().roomManager
    .removeChatRoomAdmin('<room_id>', '<admin_user_id>');
  // 移除管理员成功
} catch (error: unknown) {
  // 移除管理员失败
  console.error('移除管理员失败：', error);
}
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`ChatRoomManager#fetchChatRoomMembers`](#获取聊天室成员列表) | `ChatRoomManager` | 异步分页获取聊天室成员列表。 |
| [`ChatRoomManager#blockChatRoomMembers`](#将成员加入聊天室黑名单) | `ChatRoomManager` | 异步将成员加入聊天室黑名单。 |
| [`ChatRoomManager#unBlockChatRoomMembers`](#将成员移出聊天室黑名单) | `ChatRoomManager` | 异步将成员移出聊天室黑名单。 |
| [`ChatRoomManager#fetchChatRoomBlockList`](#获取聊天室黑名单列表) | `ChatRoomManager` | 异步获取聊天室黑名单。 |
| [`ChatRoomManager#fetchChatRoomAllowListFromServer`](#获取聊天室白名单列表) | `ChatRoomManager` | 获取聊天室白名单。 |
| [`ChatRoomManager#isMemberInChatRoomAllowList`](#检查自己是否在聊天室白名单中) | `ChatRoomManager` | 检查当前用户是否在白名单中。 |
| [`ChatRoomManager#addMembersToChatRoomAllowList`](#将成员加入聊天室白名单) | `ChatRoomManager` | 将成员加入白名单。 |
| [`ChatRoomManager#removeMembersFromChatRoomAllowList`](#将成员移出聊天室白名单列表) | `ChatRoomManager` | 将成员移出白名单。 |
| [`ChatRoomManager#muteChatRoomMembers`](#添加成员至聊天室禁言列表) | `ChatRoomManager` | 异步将成员加入禁言列表。 |
| [`ChatRoomManager#unMuteChatRoomMembers`](#将成员移出聊天室禁言列表) | `ChatRoomManager` | 异步将成员移出禁言列表。 |
| [`ChatRoomManager#fetchChatRoomMuteList`](#获取聊天室禁言列表) | `ChatRoomManager` | 异步获取禁言列表。 |
| [`ChatRoomManager#isMemberInChatRoomMuteList`](#检查自己是否在聊天室禁言列表) | `ChatRoomManager` | 检查当前用户是否在禁言列表中。 |
| [`ChatRoomManager#muteAllChatRoomMembers`](#开启全员禁言) | `ChatRoomManager` | 开启聊天室全员禁言。 |
| [`ChatRoomManager#unMuteAllChatRoomMembers`](#关闭全员禁言) | `ChatRoomManager` | 关闭聊天室全员禁言。 |
| [`ChatRoomManager#changeOwner`](#变更聊天室所有者) | `ChatRoomManager` | 异步变更聊天室所有者。 |
| [`ChatRoomManager#addChatRoomAdmin`](#添加聊天室管理员) | `ChatRoomManager` | 异步添加聊天室管理员。 |
| [`ChatRoomManager#removeChatRoomAdmin`](#移除聊天室管理员) | `ChatRoomManager` | 异步移除聊天室管理员。 |
