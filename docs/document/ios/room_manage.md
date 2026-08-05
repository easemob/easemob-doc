# 创建和管理聊天室

## 功能说明

聊天室是支持多人沟通的即时通讯系统，适用于直播互动、消息广播和开放讨论等大量用户实时互动场景。聊天室中的成员没有固定关系，一旦离线后，不会收到聊天室中的任何消息。普通成员离线超过约 2 分钟会自动退出聊天室（白名单成员以及通过 REST API 创建聊天室时拉入且从未登录的用户除外）。

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

 - 已完成 SDK 初始化并登录。
 - 已了解 [使用限制](/product/limitation.html) 和聊天室数量限制。

## 创建聊天室

创建聊天室需调用服务端 REST API [从服务端创建聊天室](/document/server-side/chatroom_create.html)。创建成功后，客户端可以 [加入该聊天室](#加入聊天室)，也可以 [获取聊天室详情](room_attributes.html#获取聊天室详情)。

## 解散聊天室

解散聊天室需调用服务端 REST API [解散聊天室](/document/server-side/chatroom_delete.html)。聊天室解散后，聊天室内其他在线成员会收到 `didDismissFromChatroom` 回调，且 `reason` 为 `EMChatroomBeKickedReasonDestroyed`，随后被移出该聊天室。

## 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `getChatroomsFromServerWithPage` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatroom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `userDidJoinChatroom` 回调。

示例代码如下：

```objectivec
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:1
                                                           pageSize:20
                                                         completion:^(EMPageResult<EMChatroom *> *result, EMError *error) {
    if (!error) {
        EMChatroom *chatroom = result.list.firstObject;
        [[EMClient sharedClient].roomManager joinChatroom:chatroom.chatroomId
                                               completion:^(EMChatroom *joinedChatroom, EMError *joinError) {
            // 处理加入结果。
        }];
    }
}];
```

同时，你可以调用 `joinChatroom` 方法，设置加入聊天室时携带的扩展信息，并指定是否退出所有其他聊天室。调用该方法后，聊天室内其他成员会收到 `userDidJoinChatroom` 回调；当用户加入聊天室携带扩展信息时，其他成员可在该回调中获取该扩展信息。

```objectivec
[[EMClient sharedClient].roomManager joinChatroom:chatroomId
                                               ext:@"source=live"
                                   leaveOtherRooms:NO
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    // 处理加入结果。
}];
```

## 退出聊天室

### 主动退出

聊天室所有成员均可调用 `leaveChatroom` 退出当前聊天室。成员退出聊天室时，其他成员收到 `userDidLeaveChatroom` 回调。


```objectivec
[[EMClient sharedClient].roomManager leaveChatroom:chatroomId completion:^(EMError *error) {
    // 处理退出结果。
}];
```

退出聊天室时，SDK 默认删除该聊天室本地消息；若要保留消息，在初始化前设置 `EMOptions#deleteMessagesOnLeaveChatroom` 为 `NO`。


```objectivec
EMOptions *options = [EMOptions optionsWithAppkey:@"appkey"];
options.deleteMessagesOnLeaveChatroom = NO;
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。若 `EMOptions#canChatroomOwnerLeave` 在初始化时设置为 `NO` 时，聊天室所有者离开会收到错误码 706 `EMErrorChatroomOwnerNotAllowLeave`；设置为 `YES` 后，聊天室所有者可离开。

### 被移出

仅聊天室所有者和管理员可调用 `removeMembers` 异步将单个或多个成员移出聊天室。

被移出的成员会收到 `didDismissFromChatroom` 回调；其他聊天室成员会收到 `userDidLeaveChatroom` 回调。

被移出的成员可以重新加入聊天室。

示例代码如下：

```objectivec
// 异步方法。
NSArray<NSString *> *members = @[@"user_1", @"user_2"];

[[EMClient sharedClient].roomManager removeMembers:members
                                      fromChatroom:chatroomId
                                        completion:^(EMChatroom *chatroom, EMError *error) {
    if (!error) {
        // 成员移出成功。
    } else {
        // 成员移出失败。
    }
}];
```

### 离线后自动退出

由于网络等原因，聊天室中的普通成员离线超过 2 分钟会自动退出聊天室。若需调整该时间，请联系环信商务。

以下两类成员即使离线也不会自动退出聊天室：

- 聊天室白名单成员，聊天室所有者和管理员默认处于白名单中。
- 通过 [REST API 创建聊天室](/document/server-side/chatroom_create.html) 时拉入、且从未登录过的用户。

若已启用聊天室多端多设备功能，白名单成员在某台设备离线后重新连接时，该设备不会自动重新加入聊天室，因此无法接收聊天室消息。需要在该设备登录后调用 `joinChatroom` 手动加入聊天室。

## 获取聊天室列表

你可以调用 `getChatroomsFromServerWithPage` 分页获取聊天室列表。

该接口获取当前应用下的聊天室列表，不限于当前用户已加入的聊天室。若需要聊天室详情，应调用 `getChatroomSpecificationFromServerWithId` 从服务器获取。若业务需要维护当前用户已加入的聊天室列表，应结合本地业务数据维护。

```objectivec
// 异步方法。
// page：当前页码，从 1 开始。
// pageSize：每页期望返回的聊天室数量，取值范围为 [1, 1000]。
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:page
                                                           pageSize:pageSize
                                                         completion:^(EMPageResult<EMChatroom *> *result, EMError *error) {
    if (!error) {
        // result.list 为当前页聊天室列表。
        NSArray<EMChatroom *> *chatrooms = result.list;
    } else {
        // 获取聊天室列表失败。
    }
}];
```

返回结果 `EMPageResult<EMChatroom *>` 的主要字段如下：

| 字段                 | 类型                      | 描述                                                         |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| `EMPageResult#list`  | `NSArray<EMChatroom *> *` | 当前页的聊天室列表。                                         |
| `EMPageResult#count` | `NSInteger`               | 当前页返回的聊天室数量。若该值小于请求时的 `pageSize`，通常表示服务端没有更多聊天室数据。 |

`EMPageResult#list` 中每个 `EMChatroom` 对象可读取以下主要属性：

| 字段                         | 类型         | 描述                           |
| ---------------------------- | ------------ | ------------------------------ |
| `EMChatroom#chatroomId`      | `NSString *` | 聊天室 ID。                    |
| `EMChatroom#subject`         | `NSString *` | 聊天室名称。                   |
| `EMChatroom#description`     | `NSString *` | 聊天室描述。                   |
| `EMChatroom#owner`           | `NSString *` | 聊天室所有者的用户 ID。        |
| `EMChatroom#occupantsCount`  | `NSInteger`  | 聊天室当前成员人数。           |
| `EMChatroom#createTimestamp` | `NSInteger`  | 聊天室创建时间戳，单位为毫秒。 |

## 监听聊天室事件

SDK 通过 `IEMChatroomManager` 提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

示例代码如下：

```objectivec
// 实现 EMChatroomManagerDelegate。

// 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
// ext 为加入者携带的扩展信息。
- (void)userDidJoinChatroom:(EMChatroom *)chatroom
                       user:(NSString *)userId
                        ext:(NSString *)ext {
}

// 有成员主动退出聊天室。聊天室的所有成员（除退出成员外）会收到该事件。
- (void)userDidLeaveChatroom:(EMChatroom *)chatroom
                        user:(NSString *)userId {
}

// 当前用户被移出聊天室、聊天室被解散或当前账号离线时，会收到该事件。
- (void)didDismissFromChatroom:(EMChatroom *)chatroom
                        reason:(EMChatroomBeKickedReason)reason {
    switch (reason) {
        case EMChatroomBeKickedReasonBeRemoved:
            // 当前用户被聊天室所有者或管理员移出。
            break;
        case EMChatroomBeKickedReasonDestroyed:
            // 聊天室被解散。
            break;
        case EMChatroomBeKickedReasonOffline:
            // 当前账号离线后被移出聊天室。
            break;
    }
}

// 聊天室详情有变更。聊天室的所有成员会收到该事件。
// 收到后，应调用 IEMChatroomManager#getChatroomSpecificationFromServerWithId:completion: 获取最新详情。
- (void)chatroomSpecificationDidUpdate:(EMChatroom *)chatroom {
}

// 有成员被加入禁言列表。被添加的成员会收到该事件。
// mutedMembers 的 Key 为用户 ID，Value 为禁言到期时间戳（毫秒）；-1 表示永久禁言。
- (void)chatroomMuteListDidUpdate:(EMChatroom *)chatroom
                addedMutedMembers:(NSDictionary<NSString *, NSNumber *> *)mutedMembers {
}

// 有成员被移出禁言列表。被解除禁言的成员会收到该事件。
- (void)chatroomMuteListDidUpdate:(EMChatroom *)chatroom
              removedMutedMembers:(NSArray<NSString *> *)members {
}

// 有成员被加入白名单。被添加的成员会收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)chatroom
             addedWhiteListMembers:(NSArray<NSString *> *)members {
}

// 有成员被移出白名单。被移出的成员会收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)chatroom
           removedWhiteListMembers:(NSArray<NSString *> *)members {
}

// 聊天室全员禁言状态变更。聊天室的所有成员会收到该事件。
- (void)chatroomAllMemberMuteChanged:(EMChatroom *)chatroom
                    isAllMemberMuted:(BOOL)isMuted {
}

// 有成员被设为管理员。被添加的管理员会收到该事件。
- (void)chatroomAdminListDidUpdate:(EMChatroom *)chatroom
                        addedAdmin:(NSString *)admin {
}

// 有成员被移除管理员权限。被移除的管理员会收到该事件。
- (void)chatroomAdminListDidUpdate:(EMChatroom *)chatroom
                      removedAdmin:(NSString *)admin {
}

// 聊天室所有者变更。聊天室的所有成员会收到该事件。
- (void)chatroomOwnerDidUpdate:(EMChatroom *)chatroom
                      newOwner:(NSString *)newOwner
                      oldOwner:(NSString *)oldOwner {
}

// 聊天室公告更新。聊天室的所有成员会收到该事件。
- (void)chatroomAnnouncementDidUpdate:(EMChatroom *)chatroom
                          announcement:(NSString *)announcement {
}

// 聊天室自定义属性更新。聊天室的所有成员会收到该事件。
- (void)chatroomAttributesDidUpdated:(NSString *)roomId
                        attributeMap:(NSDictionary<NSString *, NSString *> *)attributeMap
                                from:(NSString *)fromId {
}

// 聊天室自定义属性被删除。聊天室的所有成员会收到该事件。
- (void)chatroomAttributesDidRemoved:(NSString *)roomId
                           attributes:(NSArray<__kindof NSString *> *)attributes
                                 from:(NSString *)fromId {
}
```


## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`getChatroomsFromServerWithPage`](#获取聊天室列表) | `IEMChatroomManager` | 异步获取应用下的聊天室列表。 |
| [`joinChatroom`](#加入聊天室) | `IEMChatroomManager` | 异步加入聊天室。可携带扩展信息加入聊天室，并可指定是否退出其他聊天室。 |
| [`leaveChatroom`](#主动退出) | `IEMChatroomManager` | 异步退出聊天室。 |
