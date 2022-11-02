# 管理子区

<Toc />

子区是群组成员的子集，是支持多人沟通的即时通讯系统，本文介绍如何使用环信即时通讯 IM iOS SDK 在实时互动 app 中创建和管理子区，并实现子区相关功能。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `EMChatThreadManager`、`EMChatThread`、`EMChatThreadManagerDelegate` 和 `EMChatThreadEvent` 类，用于管理子区，支持你通过调用 API 在项目中实现如下功能：

- 创建、解散子区
- 加入、退出子区
- 子区踢人
- 修改子区名称
- 获取子区详情
- 获取子区成员列表
- 获取子区列表
- 批量获取子区中的最新消息
- 监听子区事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 `3.9.3 或以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解子区和子区成员数量限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建子区

所有群成员均可以调用 `createChatThread` 方法，基于一条群组消息新建子区。

单设备登录时，子区所属群组的所有成员均会收到 `EMChatThreadManagerDelegate#onChatThreadCreated` 回调；多设备登录时，其他设备会同时收到 `- (void)multiDevicesThreadEventDidReceive:(EMMultiDevicesEvent)aEvent threadId:(NSString *)aThreadId ext:(id)aExt;` 回调，回调事件为 `EMMultiDevicesEventThreadCreate`。

示例代码如下：

```objectivec
// threadName：子区名称，长度不超过 64 个字符
// messageId：消息 ID，基于这条消息创建子区
// parentId：群组 ID
// 异步方法
[[EMClient sharedClient].threadManager createChatThread:self.threadName messageId:self.message.message.messageId parentId:self.message.message.to completion:^(EMChatThread *thread, EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### 解散子区

仅子区所在群组的群主和群管理员可以调用 `destroyChatThread` 方法解散子区。

单设备登录时，子区所属群组的所有成员均会收到 `EMChatThreadManagerDelegate#onChatThreadDestroyed` 回调；多设备登录时，其他设备会同时收到 `- (void)multiDevicesThreadEventDidReceive:(EMMultiDevicesEvent)aEvent threadId:(NSString *)aThreadId ext:(id)aExt;` 回调，回调事件为 `EMMultiDevicesEventThreadDestroy`。

:::notice
解散子区后，将删除本地数据库及内存中的群相关信息及群会话，谨慎操作。
:::

示例代码如下：

```objectivec
// 异步方法
    [EMClient.sharedClient.threadManager destroyChatThread:self.conversationId completion:^(EMError *aError) {
        if (!aError) {
            
        } else {
            
        }
    }];
```

### 加入子区

子区所在群组的所有成员均可以调用 `joinChatThread` 方法加入群组，

加入子区的具体步骤如下：

1. 收到 `EMChatThreadManagerDelegate#onChatThreadCreated` 回调或 `EMChatThreadManagerDelegate#onChatThreadUpdated` 回调，或调用 `getChatThreadsFromServer` 方法从服务器获取指定群组的子区列表，从中获取到想要加入的子区 ID。
2. 调用 `joinChatThread` 传入子区 ID 加入对应子区。  

多设备登录时，其他设备会同时收到 `- (void)multiDevicesThreadEventDidReceive:(EMMultiDevicesEvent)aEvent threadId:(NSString *)aThreadId ext:(id)aExt;` 回调，回调事件为 `EMMultiDevicesEventThreadJoin`。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.threadManager joinChatThread:model.message.threadOverView.threadId completion:^(EMChatThread *thread,EMError *aError) {
    if (!aError || aError.code == EMErrorUserAlreadyExist) {
        
    }
}];
```

### 退出子区

子区成员均可以主动调用 `leaveChatThread` 方法退出子区，退出子区后，该成员将不会再收到子区消息。

多设备登录时，其他设备会同时收到 `- (void)multiDevicesThreadEventDidReceive:(EMMultiDevicesEvent)aEvent threadId:(NSString *)aThreadId ext:(id)aExt;` 回调，回调事件为 `EMMultiDevicesEventThreadLeave`。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.threadManager leaveChatThread:self.conversationId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### 从子区移出成员

仅群主和群管理员可以调用 `removeMemberFromChatThread` 方法将指定成员 (群管理员或普通成员) 踢出子区，被踢出子区的成员将不再接收到子区消息。

被踢出子区的成员会收到 `EMChatThreadManagerDelegate#onUserKickOutOfChatThread` 回调。多设备登录时，执行踢人操作的成员的其他设备会同时收到 `EMMultiDevicesDelegate#multiDevicesThreadEventDidReceive` 回调，回调事件为 `EMMultiDevicesEventThreadKick`。

示例代码如下：

```objectivec
// chatThreadId：子区 ID
// member：子区成员的用户 ID
// 异步方法
[EMClient.sharedClient.threadManager removeMemberFromChatThread:member threadId:self.threadId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### 修改子区名称

仅群主和群管理员以及子区的创建者可以调用 `updateChatThreadName` 方法修改子区名称。

单设备登录时，子区所属群组的所有成员会收到 `EMChatThreadManagerDelegate#onChatThreadUpdated` 回调；多设备登录时，其他设备会同时收到 `- (void)multiDevicesThreadEventDidReceive:(EMMultiDevicesEvent)aEvent threadId:(NSString *)aThreadId ext:(id)aExt;` 回调，回调事件为 `EMMultiDevicesEventThreadUpdate`。

示例代码如下：

```objectivec
// threadId：子区 ID
// ThreadName：你想要修改的名称（不超过 64 个字符）
// 异步方法
[EMClient.sharedClient.threadManager updateChatThreadName:self.threadNameField.text threadId:self.threadId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### 获取子区详情

子区所在群的所有成员均可以调用 `getChatThreadDetail` 从服务器获取子区详情。

示例代码如下：

```objectivec
// threadId：子区 ID
// 异步方法
[EMClient.sharedClient.threadManager getChatThreadDetail:self.currentConversation.conversationId completion:^(EMChatThread *thread, EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### 获取子区成员列表

子区所属群组的所有成员均可以调用 `getChatThreadMemberListFromServerWithId` 方法从服务器分页获取子区成员列表。

```objectivec
// threadId：子区 ID
// pageSize：单次请求返回的成员数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
// 异步方法
[[EMClient sharedClient].threadManager getChatThreadMemberListFromServerWithId:self.threadId cursor:aCursor pageSize:pageSize completion:^(EMCursorResult *aResult, EMError *aError) {
    if !aError { self.cursor = aResult; }
}];
```

### 获取子区列表

1. 用户可以调用 `getJoinedChatThreadsFromServer` 方法从服务器分页获取自己加入和创建的子区列表：

```objectivec
// limit：单次请求返回的子区数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串 
// 异步方法
[EMClient.sharedClient.threadManager getJoinedChatThreadsFromServerWithCursor:@"" pageSize:20 completion:^(EMCursorResult * _Nonnull result, EMError * _Nonnull aError) {
        
}];
```

2. 用户可以调用 `getJoinedChatThreadsFromServer` 方法从服务器分页获取指定群组中自己加入和创建的子区列表：

```objectivec
// parentId：群组 ID
// pageSize：单次请求返回的子区数，取值范围为 [1, 50]
// cursor：开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
// 异步方法
[EMClient.sharedClient.threadManager getJoinedChatThreadsFromServerWithParentId:self.group.groupId cursor:self.cursor ? self.cursor.cursor:@"" pageSize:20 completion:^(EMCursorResult * _Nonnull result, EMError * _Nonnull aError) {
    if (!aError) {
        
    }
}];
```

3. 用户还可以调用 `getChatThreadsFromServer` 方法从服务器分页获取指定群组的子区列表：

```objectivec
// parentId: 群组 ID
// pageSize: 单次请求返回的子区数，取值范围为 [1, 50]
// cursor: 开始获取数据的游标位置，首次调用方法时传 `null` 或空字符串
// 异步方法
[[EMClient sharedClient].threadManager getChatThreadsFromServerWithParentId:self.group.groupId cursor:self.cursor ? self.cursor.cursor:@"" pageSize:20 completion:^(EMCursorResult *result, EMError *aError) {
    if (!aError) {
        
    }
}];
```

### 批量获取子区中的最新消息

用户可以调用 `getLastMessageFromSeverWithChatThreads` 方法从服务器批量获取子区中的最新一条消息。

示例代码如下：

```objectivec
// threadIds：要查询的子区 ID 列表，每次最多可传入 20 个子区 ID
// 异步方法
[[EMClient sharedClient].threadManager getLastMessageFromSeverWithChatThreads:ids completion:^(NSDictionary<NSString *,EMChatMessage *> * _Nonnull messageMap, EMError * _Nonnull aError) {
    if (!aError) {
        
    }
}];
```

### 监听子区事件

`EMChatThreadManager` 类中提供子区事件的监听接口。开发者可以通过设置此监听，获取子区中的事件，并做出相应处理。如果不再使用该监听，需要移除，防止出现内存泄漏。

示例代码如下：

```objectivec
EMChatThreadManagerDelegate 

// 子区创建
- (void)onChatThreadCreate:(EMChatThreadEvent *)event;

// 子区名称修改、子区中新增或撤回消息
- (void)onChatThreadUpdate:(EMChatThreadEvent *)event;

// 子区解散
- (void)onChatThreadDestroy:(EMChatThreadEvent *)event;

// 子区成员被移除
- (void)onUserKickOutOfChatThread:(EMChatThreadEvent *)event;

// 注册监听
[[EMClient sharedClient].threadManager addDelegate:self delegateQueue:nil];
// 移除监听
[[EMClient sharedClient].threadManager removeDelegate:self];
```