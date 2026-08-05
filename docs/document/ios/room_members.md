# 管理聊天室成员

## 功能说明

聊天室是支持多人沟通的即时通讯系统，适用于直播互动、开放讨论和消息广播等多人实时互动场景。本文介绍如何使用 iOS SDK 管理聊天室成员，包括查询成员列表、管理员、白名单、黑名单和禁言等功能。

## 前提条件

开始前，请确保满足以下条件：

 - 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
 - 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
 - 了解环信即时通讯 IM 聊天室相关限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。

## 获取聊天室成员列表

所有聊天室成员均可调用 `getChatroomMemberListFromServerWithId` 获取当前聊天室成员列表。服务器不对成员进行排序，因此返回的成员列表不保证有序。

```objectivec
// 异步方法。
// cursor：首次调用传 nil；后续传入上次返回的 result.cursor。
// pageSize：每页期望返回的成员数，最大值为 1,000。
[[EMClient sharedClient].roomManager getChatroomMemberListFromServerWithId:chatroomId
                                                                      cursor:nil
                                                                    pageSize:20
                                                                  completion:^(EMCursorResult<NSString *> *result, EMError *error) {
    if (!error) {
        NSArray<NSString *> *members = result.list;
        NSString *cursor = result.cursor;
    }
}];
```

## 管理聊天室黑名单

### 将成员加入聊天室黑名单

仅聊天室所有者和管理员可调用 `blockMembers` 将指定成员添加至黑名单。

被加入黑名单后，该成员收到 `didDismissFromChatroom` 回调。默认情况下，其他成员不会收到事件通知。如需该事件，请联系商务开通。

被加入黑名单后，该成员无法再收发聊天室消息并被移出聊天室。黑名单成员如想再次加入聊天室，聊天室所有者或管理员必须先将其移出黑名单列表。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager blockMembers:@[@"userName"]
                                      fromChatroom:chatroomId
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 将成员移出聊天室黑名单

仅聊天室所有者和管理员可以调用 `unblockMembers` 将成员移出聊天室黑名单。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager unblockMembers:@[@"userName"]
                                        fromChatroom:chatroomId
                                          completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 获取聊天室黑名单列表

仅聊天室所有者和管理员可以调用 `getChatroomBlacklistFromServerWithId` 获取当前聊天室黑名单。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager getChatroomBlacklistFromServerWithId:chatroomId
                                                                pageNumber:1
                                                                  pageSize:20
                                                                completion:^(NSArray<NSString *> *members, EMError *error) {
    // members 为黑名单成员。
}];
```

## 管理聊天室白名单

聊天室所有者和管理员默认会被加入聊天室白名单。

聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

### 获取聊天室白名单列表

仅聊天室所有者和管理员可以调用 `getChatroomWhiteListFromServerWithId` 获取当前聊天室白名单成员列表。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager getChatroomWhiteListFromServerWithId:chatroomId
                                                               completion:^(NSArray<NSString *> *members, EMError *error) {
    // members 为白名单成员。
}];
```

### 检查自己是否在聊天室白名单中

所有聊天室成员可以调用 `isMemberInWhiteListFromServerWithChatroomId` 检查自己是否在白名单中。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager isMemberInWhiteListFromServerWithChatroomId:chatroomId
                                                                        completion:^(BOOL inWhiteList, EMError *error) {
    // inWhiteList 表示当前用户是否在白名单中。
}];
```

### 将成员加入聊天室白名单

仅聊天室所有者和管理员可以调用 `addWhiteListMembers` 将成员加入聊天室白名单。被添加后，该成员和其他未操作的聊天室管理员或所有者收到 `chatroomWhiteListDidUpdate` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager addWhiteListMembers:@[@"userId1", @"userId2"]
                                              fromChatroom:chatroomId
                                                completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 将成员移出聊天室白名单列表

仅聊天室所有者和管理员可以调用 `removeWhiteListMembers` 将成员从聊天室白名单移出。被移出后，该成员和其他未操作的聊天室管理员或所有者收到 `chatroomWhiteListDidUpdate` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeWhiteListMembers:@[@"userId1", @"userId2"]
                                                 fromChatroom:chatroomId
                                                   completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

## 管理聊天室禁言列表

### 添加成员至聊天室禁言列表

仅聊天室所有者和管理员可以调用 `muteMembers` 将指定成员添加至聊天室禁言列表。被禁言的成员和其他未操作的聊天室管理员或聊天室所有者收到 `chatroomMuteListDidUpdate` 回调。

:::tip
聊天室所有者可禁言聊天室所有成员，聊天室管理员可禁言聊天室普通成员。
:::

```objectivec
// 异步方法。
// muteMilliseconds 传 -1 表示永久禁言。
[[EMClient sharedClient].roomManager muteMembers:@[@"userName"]
                                 muteMilliseconds:-1
                                     fromChatroom:chatroomId
                                       completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 将成员移出聊天室禁言列表

仅聊天室所有者和管理员可以调用 `unmuteMembers` 将成员移出聊天室禁言列表。被解除禁言的成员和其他未操作的聊天室管理员或所有者收到 `chatroomMuteListDidUpdate` 回调。

:::tip
聊天室所有者可对聊天室所有成员解除禁言，聊天室管理员可对聊天室普通成员解除禁言。
:::

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager unmuteMembers:@[@"userName"]
                                   fromChatroom:chatroomId
                                     completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 获取聊天室禁言列表

仅聊天室所有者和管理员可以调用 `getChatroomMuteListFromServerWithId` 获取聊天室禁言列表。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager getChatroomMuteListFromServerWithId:chatroomId
                                                               pageNumber:1
                                                                 pageSize:20
                                                               completion:^(NSArray<NSString *> *members, EMError *error) {
    // members 为禁言成员。
}];
```

### 检查自己是否在聊天室禁言列表

聊天室成员可以调用 `isMemberInMuteListFromServerWithChatroomId` 查看自己是否在聊天室禁言列表。

```objectivec
[[EMClient sharedClient].roomManager isMemberInMuteListFromServerWithChatroomId:chatroomId
                                                                       completion:^(BOOL inMuteList, EMError *error) {
    if (!error && inMuteList) {
        NSLog(@"You are in the mute list of room");
    }
}];
```

## 开启和关闭聊天室全员禁言

为了快捷管理聊天室发言，聊天室所有者和管理员可以开启和关闭聊天室全员禁言。全员禁言和单独的成员禁言不冲突，设置或者解除全员禁言，原禁言列表不会变化。

### 开启全员禁言

仅聊天室所有者和管理员可以调用 `muteAllMembersFromChatroom` 开启全员禁言。全员禁言开启后不会自动解除，需要调用 `unmuteAllMembersFromChatroom` 解除。
全员禁言开启后，除了在白名单中的成员，其他成员不能发言。调用成功后，聊天室成员会收到 `chatroomAllMemberMuteChanged` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager muteAllMembersFromChatroom:chatroomId
                                                      completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 关闭全员禁言

仅聊天室所有者和管理员可以调用 `unmuteAllMembersFromChatroom` 取消全员禁言。调用成功后，聊天室成员会收到 `chatroomAllMemberMuteChanged` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager unmuteAllMembersFromChatroom:chatroomId
                                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

## 管理聊天室所有者和管理员

聊天室创建者和管理员数量之和不能超过 100，即管理员最多可添加 99 个。

### 变更聊天室所有者

仅聊天室所有者可以调用 `updateChatroomOwner` 将权限移交给聊天室中指定成员。成功移交后，原聊天室所有者变为聊天室成员，新的聊天室所有者和聊天室管理员收到 `chatroomOwnerDidUpdate` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager updateChatroomOwner:chatroomId
                                                 newOwner:@"userName"
                                               completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 添加聊天室管理员

仅聊天室所有者可以调用 `addAdmin` 添加聊天室管理员。成功添加后，新管理员及其他管理员收到 `chatroomAdminListDidUpdate` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager addAdmin:@"userName"
                                    toChatroom:chatroomId
                                    completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

### 移除聊天室管理员

仅聊天室所有者可以调用 `removeAdmin` 移除聊天室管理员。成功移除后，被移除的管理员及其他管理员收到 `chatroomAdminListDidUpdate` 回调。

```objectivec
// 异步方法。
[[EMClient sharedClient].roomManager removeAdmin:@"userName"
                                       fromChatroom:chatroomId
                                         completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理结果。
}];
```

## 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`getChatroomMemberListFromServerWithId`](#获取聊天室成员列表) | `IEMChatroomManager` | 异步分页获取成员列表。 |
| [`blockMembers`](#将成员加入聊天室黑名单) | `IEMChatroomManager` | 异步将成员加入黑名单。 |
| [`unblockMembers`](#将成员移出聊天室黑名单) | `IEMChatroomManager` | 异步将成员移出黑名单。 |
| [`getChatroomBlacklistFromServerWithId`](#获取聊天室黑名单列表) | `IEMChatroomManager` | 异步查询黑名单。 |
| [`getChatroomWhiteListFromServerWithId`](#获取聊天室白名单列表) | `IEMChatroomManager` | 异步查询白名单。 |
| [`isMemberInWhiteListFromServerWithChatroomId`](#检查自己是否在聊天室白名单中) | `IEMChatroomManager` | 查询当前用户是否在白名单中。 |
| [`muteMembers`](#添加成员至聊天室禁言列表) | `IEMChatroomManager` | 异步禁言成员。 |
| [`unmuteMembers`](#将成员移出聊天室禁言列表) | `IEMChatroomManager` | 异步解除禁言。 |
| [`muteAllMembersFromChatroom`](#开启全员禁言) | `IEMChatroomManager` | 异步开启全员禁言。 |
| [`unmuteAllMembersFromChatroom`](#关闭全员禁言) | `IEMChatroomManager` | 异步关闭全员禁言。 |
| [`updateChatroomOwner`](#变更聊天室所有者) | `IEMChatroomManager` | 异步变更所有者。 |
| [`addAdmin`](#添加聊天室管理员) | `IEMChatroomManager` | 异步添加管理员。 |
| [`removeAdmin`](#移除聊天室管理员) | `IEMChatroomManager` | 异步移除管理员。 |
