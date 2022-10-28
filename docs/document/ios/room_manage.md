# 创建和管理聊天室以及监听器介绍

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，用户离线后，超过 5 分钟会自动退出聊天室。聊天室成员在离线后，不会收到推送消息。聊天室可以应用于直播、消息广播等。

本文介绍如何使用环信即时通讯 IM SDK 在实时互动 app 中创建和管理聊天室，并实现聊天室的相关功能。

消息相关内容见 [消息管理](message_overview.html)。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMChatroomManager` 类、`EMChatroomManagerDelegate` 类和 `EMChatroom` 类用于聊天室管理，支持你通过调用 API 在项目中实现如下功能：

- 创建聊天室
- 从服务器获取聊天室列表
- 加入聊天室
- 获取聊天室详情
- 退出聊天室
- 解散聊天室
- 监听聊天室事件

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解环信即时通讯 IM 不同版本的聊天室相关数量限制，详见 [环信即时通讯 IM 价格](https://www.easemob.com/pricing/im)。
- 只有超级管理员才有创建聊天室的权限，因此你还需要确保已调用 RESTful API 添加了超级管理员，详见 [添加聊天室超级管理员](/document/server-side/chatroom.html#添加超级管理员)。
- 聊天室创建者和管理员的数量之和不能超过 100 ，即管理员最多可添加 99 个。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 创建聊天室

仅 [超级管理员](/document/server-side/chatroom.html#管理超级管理员) 可以调用 `createChatroomWithSubject` 方法创建聊天室，并设置聊天室的名称、描述、最大成员数等信息。成功创建聊天室后，该超级管理员为该聊天室的所有者。

你也可以直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom.html#创建聊天室)。

示例代码如下：

```objectivec
EMError *error = nil;
EMChatroom *retChatroom = [[EMClient sharedClient].roomManager createChatroomWithSubject:@"aSubject" description:@"aDescription" invitees:@[@"user1",@[user2]]message:@"aMessage" maxMembersCount:aMaxMembersCount error:&error];
```

### 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `getChatroomsFromServerWithPage` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatroom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `userDidJoinChatroom` 回调。

示例代码如下：

```objectivec
// 获取公开聊天室列表，每次最多可获取 1,000 个。
EMError *error = nil;
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:1 pageSize:50 error:&error];

// 加入聊天室
EMError *error = nil;
[[EMClient sharedClient].roomManager joinChatroom:@"aChatroomId" error:&error];
```

### 获取聊天室详情

聊天室所有成员均可调用 [`getChatroomSpecificationFromServerWithId`](room_manage.html#获取聊天室详情) 获取聊天室的详情，包括聊天室 ID、聊天室名称，聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及聊天室角色类型。聊天室公告、成员列表、管理员列表、黑名单列表、禁言列表需单独调用接口获取。

示例代码如下：

```objectivec
EMError *error = nil;
EMChatroom *chatroom = [[EMClient sharedClient].roomManager getChatroomSpecificationFromServerWithId:@“chatroomId” error:&error];
```

### 退出聊天室

聊天室所有成员均可以调用 `leaveChatroom` 方法退出指定聊天室。成员退出聊天室时，其他成员收到 `userDidLeaveChatroom` 回调。

示例代码如下：

```objectivec
EMError *error = nil;
[EMClient sharedClient].roomManager leaveChatroom:@"aChatroomId" error:&error];
```

退出聊天室时，SDK 默认删除该聊天室所有本地消息，若要保留这些消息，可在 SDK 初始化时将 `isDeleteMessagesWhenExitChatRoom` 设置为 `NO`。

```objectivec
@property (nonatomic, assign) BOOL isDeleteMessagesWhenExitChatRoom;
```

示例代码如下：

```objectivec
EMOptions *retOpt = [EMOptions optionsWithAppkey:@"appkey"];
retOpt.isDeleteMessagesWhenExitChatRoom = NO;
```

与群主无法退出群组不同，聊天室所有者可以离开聊天室，例如所有者从服务器下线则 5 分钟后自动离开聊天室。如果所有者重新进入聊天室仍是该聊天室的所有者。

### 解散聊天室

仅聊天室所有者可以调用 `destroyChatroom` 方法解散聊天室。聊天室解散时，其他成员收到 `didDismissFromChatroom` 回调并被踢出聊天室。

示例代码如下：

```objectivec
EMError *error = nil;
[[EMClient sharedClient].roomManager destroyChatroom:self.chatroom.chatroomId error:&error];
```

### 设置聊天室消息优先级

环信即时通讯提供聊天室消息分级功能，将消息的优先级划分为高、普通和低三种级别。设置后，高优先级的消息会优先送达，确保在聊天室内消息并发量很大或消息发送频率过高时，重要消息能够优先送达，从而提升重要消息的可靠性。

用户可将指定的聊天室消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。当服务器的负载较高时，会优先丢弃低优先级的消息，将资源留给高优先级的消息。不过，消息分级功能只确保消息优先到达，并不保证必达。服务器负载过高的情况下，即使是高优先级消息依然会被丢弃。

```ObjectiveC
    NSString from = [[EMClient sharedClient] currentUsername];
    EMChatMessage message = [[EMChatMessage alloc] initWithConversationID:aTo from:from to:aTo body:aBody ext:aExt];
    message.chatType = EMChatTypeChatRoom;
    //聊天室消息优先级。
    message.priority = EMChatRoomMessagePriorityHigh;//如果不传任何值，默认为 `Normal`，即“普通”优先级。 
    __weak typeof(self) weakself = self;
    [[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];
```

### 监听聊天室事件

SDK 中提供了聊天室事件的监听接口。你可以通过注册聊天室监听器，获取聊天室事件，并作出相应处理。如不再使用该监听器，需要移除，防止出现内存泄露。

示例代码如下：

```objectivec
// 注册聊天室回调。
[[EMClient sharedClient].roomManager addDelegate:self delegateQueue:nil];
// 移除聊天室回调。
[[EMClient sharedClient].roomManager removeDelegate:self];
```

具体事件如下：

```objectivec
// 有用户加入聊天室。聊天室的所有成员（除新成员外）会收到该事件。
- (void)userDidJoinChatroom:(EMChatroom *)aChatroom
      user:(NSString *)aUsername{
}

// 有成员主动退出聊天室。聊天室的所有成员（除退出成员外）会收到该事件。
- (void)userDidLeaveChatroom:(EMChatroom *)aChatroom
         user:(NSString *)aUsername {
}

// 有成员被踢出聊天室。被踢出聊天室的成员会收到该事件。
- (void)didDismissFromChatroom:(EMChatroom *)aChatroom
      reason:(EMChatroomBeKickedReason)aReason {
  }

// 聊天室详情有变更。聊天室的所有成员会收到该事件。
- (void)chatroomSpecificationDidUpdate:(EMChatroom *)aChatroom;

// 有成员被添加至聊天室白名单。被添加的成员收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)aChatroom
              addedWhiteListMembers:(NSArray<NSString *> *)aMembers;

// 有成员被移出白名单。被移出的成员收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)aChatroom
            removedWhiteListMembers:(NSArray<NSString *> *)aMembers;

// 聊天室一键禁言状态变化。聊天室所有成员（除操作者外）会收到该事件。
- (void)chatroomAllMemberMuteChanged:(EMChatroom *)aChatroom
                     isAllMemberMuted:(BOOL)aMuted;

// 更新聊天室公告。聊天室的所有成员会收到该事件。
- (void)chatroomAnnouncementDidUpdate:(EMChatroom *)aChatroom
                          announcement:(NSString *_Nullable)aAnnouncement;

// 有成员被加入禁言列表。被禁言的成员会收到该事件。

- (void)chatroomMuteListDidUpdate:(EMChatroom *)aChatroom
      addedMutedMembers:(NSArray *)aMutes
             muteExpire:(NSInteger)aMuteExpire {
  }

// 有成员被移除禁言列表。被解除禁言的成员会收到该事件。
- (void)chatroomMuteListDidUpdate:(EMChatroom *)aChatroom
      removedMutedMembers:(NSArray *)aMutes {
  }

// 有成员被设为管理员。被添加的管理员会收到该事件。
- (void)chatroomAdminListDidUpdate:(EMChatroom *)aChatroom
      addedAdmin:(NSString *)aAdmin {
  }

// 有成员被移除管理员权限。被移除权限的管理员会收到该事件。
- (void)chatroomAdminListDidUpdate:(EMChatroom *)aChatroom
      removedAdmin:(NSString *)aAdmin {
  }

// 聊天室所有者变更。聊天室全体成员会收到该事件。
- (void)chatroomOwnerDidUpdate:(EMChatroom *)aChatroom
                      newOwner:(NSString *)aNewOwner
                      oldOwner:(NSString *)aOldOwner {

// 有成员修改/设置聊天室自定义属性，聊天室的所有成员会收到该事件。
- (void)chatroomAttributesDidUpdated:(NSString *_Nonnull)roomId attributeMap:(NSDictionary<NSString *, NSString *> *_Nullable)attributeMap from:(NSString *_Nonnull)fromId;
  }

// 有成员删除聊天室自定义属性。聊天室所有成员会收到该事件。
- (void)chatroomAttributesDidRemoved:(NSString *_Nonnull)roomId attributes:(NSArray<__kindof NSString *> *_Nullable)attributes from:(NSString *_Nonnull)fromId;
```