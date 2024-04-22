# 创建和管理聊天室以及监听器介绍

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室中的成员没有固定关系，一旦离线后，不会收到聊天室中的任何消息，（除了聊天室白名单中的成员）超过 2 分钟会自动退出聊天室。聊天室可以应用于直播、消息广播等。若需调整该时间，需联系环信商务经理。

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
- 实时更新聊天室成员人数

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

建议直接调用 REST API [从服务端创建聊天室](/document/server-side/chatroom.html#创建聊天室)。

示例代码如下：

```objectivec
EMError *error;
    EMChatroom *chatroom = [[EMClient sharedClient].roomManager createChatroomWithSubject:@"Subject" description:@"description" invitees:@[@"user1",@"user2"] message:@"message" maxMembersCount:100 error:&error];
```

### 加入聊天室

用户申请加入聊天室的步骤如下：

1. 调用 `getChatroomsFromServerWithPage` 方法从服务器获取聊天室列表，查询到想要加入的聊天室 ID。
2. 调用 `joinChatroom` 方法传入聊天室 ID，申请加入对应聊天室。新成员加入聊天室时，其他成员收到 `userDidJoinChatroom` 回调。

:::tip
若传入的聊天室 ID 不存在，你可以联系环信商务实现自动创建聊天室。若开启了该功能，环信服务器会自动创建聊天室，`joinChatRoom` 方法中的参数无变化。
:::

示例代码如下：

```objectivec
// 获取公开聊天室列表，每次最多可获取 1,000 个。
// 异步方法
[[EMClient sharedClient].roomManager getChatroomsFromServerWithPage:1 pageSize:50 completion:nil];

// 加入聊天室
// 异步方法
[[EMClient sharedClient].roomManager joinChatroom:@"aChatroomId" completion:nil];
```

### 获取聊天室详情

聊天室所有成员均可调用 [`getChatroomSpecificationFromServerWithId`](room_manage.html#获取聊天室详情) 获取聊天室的详情，包括聊天室 ID、聊天室名称，聊天室描述、最大成员数、聊天室所有者、是否全员禁言以及聊天室角色类型。聊天室公告、成员列表、管理员列表、黑名单列表、禁言列表需单独调用接口获取。

示例代码如下：

```objectivec
// 异步方法
EMChatroom *chatroom = [[EMClient sharedClient].roomManager getChatroomSpecificationFromServerWithId:@“chatroomId” completion:nil];
```

### 退出聊天室

聊天室所有成员均可以调用 `leaveChatroom` 方法退出指定聊天室。成员退出聊天室时，其他成员收到 `userDidLeaveChatroom` 回调。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].roomManager leaveChatroom:@"aChatroomId" completion:nil];
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

与群主无法退出群组不同，聊天室所有者可以离开聊天室，重新进入聊天室仍是该聊天室的所有者。若 `EMOptions#canChatroomOwnerLeave` 参数在初始化时设置为 `YES` 时，聊天室所有者可以离开聊天室；若该参数设置为 `NO`，聊天室所有者调用 `leaveChatroom` 方法离开聊天室时会提示错误 706 `EMErrorChatroomOwnerNotAllowLeave`。

### 解散聊天室

仅聊天室所有者可以调用 `destroyChatroom` 方法解散聊天室。聊天室解散时，其他成员收到 `didDismissFromChatroom` 回调并被踢出聊天室。

示例代码如下：

```objectivec
// 异步方法
[[EMClient sharedClient].roomManager destroyChatroom:self.chatroom.chatroomId completion:nil];
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
      user:(NSString *)aUsername {
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
- (void)chatroomSpecificationDidUpdate:(EMChatroom *)aChatroom {
  
  }

// 有成员被添加至聊天室白名单。被添加的成员收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)aChatroom
              addedWhiteListMembers:(NSArray<NSString *> *)aMembers {
  
  }

// 有成员被移出白名单。被移出的成员收到该事件。
- (void)chatroomWhiteListDidUpdate:(EMChatroom *)aChatroom
            removedWhiteListMembers:(NSArray<NSString *> *)aMembers {
  
  }

// 聊天室一键禁言状态变化。聊天室所有成员（除操作者外）会收到该事件。
- (void)chatroomAllMemberMuteChanged:(EMChatroom *)aChatroom
                     isAllMemberMuted:(BOOL)aMuted {
  
  }

// 更新聊天室公告。聊天室的所有成员会收到该事件。
- (void)chatroomAnnouncementDidUpdate:(EMChatroom *)aChatroom
                          announcement:(NSString *_Nullable)aAnnouncement {
  
  }

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

   }
// 有成员修改/设置聊天室自定义属性，聊天室的所有成员会收到该事件。
- (void)chatroomAttributesDidUpdated:(NSString *_Nonnull)roomId attributeMap:(NSDictionary<NSString *, NSString *> *_Nullable)attributeMap from:(NSString *_Nonnull)fromId {
  
  }

// 有成员删除聊天室自定义属性。聊天室所有成员会收到该事件。
- (void)chatroomAttributesDidRemoved:(NSString *_Nonnull)roomId attributes:(NSArray<__kindof NSString *> *_Nullable)attributes from:(NSString *_Nonnull)fromId {
  
  }
```

### 实时更新聊天室成员人数

如果聊天室短时间内有成员频繁加入或退出时，实时更新聊天室成员人数的逻辑如下：

1. 聊天室内有成员加入时，其他成员会收到 `userDidJoinChatroom:user:` 事件。有成员主动或被动退出时，其他成员会收到 `userDidLeaveChatroom:user:`  事件。

2. 收到通知事件后，通过 `EMChatroom#occupantsCount` 获取聊天室当前人数。

```Swift
extension ViewController: EMChatroomManagerDelegate {
    func userDidJoin(_ aChatroom: EMChatroom, user aUsername: String) {
        let memberCount = aChatroom.occupantsCount
    }
    func userDidLeave(_ aChatroom: EMChatroom, user aUsername: String) {
        let memberCount = aChatroom.occupantsCount
    }
}

EMClient.shared().roomManager?.add(self, delegateQueue: nil)
```