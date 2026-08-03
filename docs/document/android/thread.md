# 管理消息话题

## 功能说明

消息话题是群组成员的子集，是支持多人沟通的即时通讯系统。使用消息话题功能前，你需要联系商务开通。

本文介绍如何使用环信即时通讯 IM Android SDK 在实时互动 app 中创建和管理消息话题，并实现消息话题相关功能。如需查看消息相关内容，参见 [消息话题中的消息管理](thread_message.html)。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 创建消息话题

所有群成员均可以调用 `createChatThread` 方法，基于一条群组消息新建消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `EMChatThreadChangeListener#onChatThreadCreated` 回调；多设备登录时，其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_CREATE`。

示例代码如下：

```java
// parentId：群组 ID
// messageId：消息 ID，基于该消息创建消息话题
// threadName：消息话题名称，长度不超过 64 个字符
EMClient.getInstance().chatThreadManager().createChatThread(parentId, messageId, threadName, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) {
        
    }
    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

## 解散消息话题

仅消息话题所在群组的群主和群管理员可以调用 `destroyChatThread` 方法解散消息话题。

单设备登录时，消息话题所属群组的所有成员均会收到 `EMChatThreadChangeListener#onChatThreadDestroyed` 回调；多设备登录时，其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_DESTROY`。

:::tip
解散消息话题或解散消息话题所在的群组后，将删除本地数据库及内存中关于该消息话题的全部数据，需谨慎操作。
:::

示例代码如下：

```java
EMClient.getInstance().chatThreadManager().destroyChatThread(chatThreadId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }
    @Override
    public void onError(int code, String error) {
    }
});
```

## 加入消息话题

消息话题所在群组的所有成员均可以调用 `joinChatThread` 方法加入消息话题。

加入消息话题的具体步骤如下：

1. 收到 `EMChatThreadChangeListener#onChatThreadCreated` 回调或 `EMChatThreadChangeListener#onChatThreadUpdated` 回调，或调用 `getChatThreadsFromServer` 方法从服务器获取指定群组的消息话题列表，从中获取到想要加入的消息话题 ID。
2. 调用 `joinChatThread` 传入消息话题 ID 加入对应消息话题。  

多设备登录时，其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_JOIN`。

示例代码如下：

```java
EMClient.getInstance().chatThreadManager().joinChatThread(chatThreadId, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) {
        
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 退出消息话题

### 主动退出

消息话题成员均可以主动调用 `leaveChatThread` 方法退出消息话题，退出消息话题后，该成员将不会再收到消息话题中的消息。

多设备登录时，其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_LEAVE`。

示例代码如下：

```java
EMClient.getInstance().chatThreadManager().leaveChatThread(chatThreadId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }
    @Override
    public void onError(int code, String error) {
    }
});
```

### 被移出消息话题

仅群主和群管理员可以调用 `removeMemberFromChatThread` 方法将指定成员 (群管理员或普通成员) 踢出消息话题，被踢出消息话题的成员将不再接收到消息话题中的消息。

被踢出消息话题的成员会收到 `EMChatThreadChangeListener#onChatThreadUserRemoved` 回调。多设备登录时，执行踢人操作的成员的其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_KICK`。

示例代码如下：

```java
// chatThreadId: 消息话题 ID
// member: 消息话题成员的用户 ID
EMClient.getInstance().chatThreadManager().removeMemberFromChatThread(chatThreadId, member, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

## 修改消息话题名称

仅群主和群管理员以及消息话题的创建者可以调用 `updateChatThreadName` 方法修改消息话题名称。

单设备登录时，消息话题所属群组的所有成员会收到 `EMChatThreadChangeListener#onChatThreadUpdated` 回调；多设备登录时，其他设备会同时收到 `EMMultiDeviceListener#onChatThreadEvent` 回调，回调事件为 `THREAD_UPDATE`。

示例代码如下：

```java
// chatThreadId: 消息话题 ID
// newChatThreadName: 修改的消息话题名称，长度不超过 64 个字符
EMClient.getInstance().chatThreadManager().updateChatThreadName(chatThreadId, newChatThreadName, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

## 获取消息话题详情

消息话题所属群组的所有成员均可以调用 `getChatThreadFromServer` 方法从服务器获取消息话题详情。

示例代码如下：

```java
// chatThreadID: 消息话题 ID
EMClient.getInstance().chatThreadManager().getChatThreadFromServer(chatThreadId, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) { 
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 获取消息话题成员列表

消息话题所属群组的所有成员均可以调用 `getChatThreadMembers` 方法从服务器分页获取消息话题成员列表。

```java
// chatThreadId: 消息话题 ID
// limit: 单次请求返回的成员数，取值范围为 [1,50]
// cursor: 开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
EMClient.getInstance().chatThreadManager().getChatThreadMembers(chatThreadId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<String>>() {
    @Override
    public void onSuccess(EMCursorResult<String> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 获取消息话题列表

- 用户可以调用 `getJoinedChatThreadsFromServer` 方法从服务器分页获取自己加入和创建的消息话题列表：

```java
// limit: 单次请求返回的消息话题数，取值范围为 [1,50]
// cursor: 开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
EMClient.getInstance().chatThreadManager().getJoinedChatThreadsFromServer(limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

- 用户可以调用 `getJoinedChatThreadsFromServer` 方法从服务器分页获取指定群组中自己加入和创建的消息话题列表：

```java
// parentId: 群组 ID
// limit: 单次请求返回的消息话题数，取值范围为 [1,50]
// cursor: 开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
EMClient.getInstance().chatThreadManager().getJoinedChatThreadsFromServer(parentId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

- 用户还可以调用 `getChatThreadsFromServer` 方法从服务器分页获取指定群组的消息话题列表：

```java
// parentId: 群组 ID
// limit: 单次请求返回的消息话题数，取值范围为 [1,50]
// cursor: 开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
EMClient.getInstance().chatThreadManager().getChatThreadsFromServer(parentId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 批量获取消息话题中的最新一条消息

用户可以调用 `getChatThreadLatestMessage` 方法从服务器批量获取消息话题中的最新一条消息。

示例代码如下：

```java
// chatThreadIdList: 要查询的消息话题 ID 列表，每次最多可传入 20 个消息话题 ID
EMClient.getInstance().chatThreadManager().getChatThreadLatestMessage(chatThreadIdList, 
        new EMValueCallBack<Map<String, EMMessage>>() {
    @Override
    public void onSuccess(Map<String, EMMessage> value) {
    }
    
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## 监听消息话题事件

`EMChatThreadManager` 类中提供消息话题事件的监听接口。开发者可以通过设置此监听，获取消息话题中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```java
EMChatThreadChangeListener chatThreadChangeListener = new EMChatThreadChangeListener() {
    @Override
    // 消息话题创建。消息话题所属群组的所有成员收到该事件。
    public void onChatThreadCreated(EMChatThreadEvent event) {}
    @Override
    // 消息话题名称修改、消息话题中新增或撤回消息。消息话题所属群组的所有成员会收到该事件。
    public void onChatThreadUpdated(EMChatThreadEvent event) {}
    @Override
    // 消息话题解散。消息话题所属群组的所有成员会收到该事件。
    public void onChatThreadDestroyed(EMChatThreadEvent event) {}
    @Override
    // 消息话题成员被移除。被踢出消息话题的成员收到该事件。
    public void onChatThreadUserRemoved(EMChatThreadEvent event) {}
};
// 注册监听
EMClient.getInstance().chatThreadManager().addChatThreadChangeListener(chatThreadChangeListener);

// 移除监听
EMClient.getInstance().chatThreadManager().removeChatThreadChangeListener(chatThreadChangeListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createChatThread`](#创建消息话题) | `EMChatThreadManager` | 基于群组消息创建消息话题。 |
| [`destroyChatThread`](#解散消息话题) | `EMChatThreadManager` | 解散消息话题。 |
| [`joinChatThread`](#加入消息话题) | `EMChatThreadManager` | 加入消息话题。 |
| [`leaveChatThread`](#主动退出) | `EMChatThreadManager` | 主动退出消息话题。 |
| [`removeMemberFromChatThread`](#被移出消息话题) | `EMChatThreadManager` | 将成员移出消息话题。 |
| [`updateChatThreadName`](#修改消息话题名称) | `EMChatThreadManager` | 修改消息话题名称。 |
| [`getChatThreadFromServer`](#获取消息话题详情) | `EMChatThreadManager` | 从服务器获取消息话题详情。 |
| [`getChatThreadMembers`](#获取消息话题成员列表) | `EMChatThreadManager` | 分页获取消息话题成员列表。 |
| [`getJoinedChatThreadsFromServer`](#获取消息话题列表) | `EMChatThreadManager` | 分页获取当前用户已加入或创建的消息话题列表。 |
| [`getChatThreadsFromServer`](#获取消息话题列表) | `EMChatThreadManager` | 分页获取指定群组的消息话题列表。 |
| [`getChatThreadLatestMessage`](#批量获取消息话题中的最新一条消息) | `EMChatThreadManager` | 批量获取消息话题中的最新一条消息。 |
| [`addChatThreadChangeListener`](#监听消息话题事件) | `EMChatThreadManager` | 注册消息话题事件监听器。 |
| [`removeChatThreadChangeListener`](#监听消息话题事件) | `EMChatThreadManager` | 移除消息话题事件监听器。 |
