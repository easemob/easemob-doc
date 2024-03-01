# 管理聊天室属性

<Toc />

聊天室是支持多人沟通的即时通讯系统。聊天室属性可分为聊天室名称、描述和公告等基本属性和自定义属性（key-value）。若聊天室基本属性不满足业务要求，用户可增加自定义属性并同步给所有成员。利用自定义属性可以存储直播聊天室的类型、狼人杀等游戏中的角色信息和游戏状态以及实现语聊房的麦位管理和同步等。聊天室自定义属性以键值对（key-value）形式存储，属性信息变更会实时同步给聊天室成员。

本文介绍如何管理聊天室属性信息。

## 技术原理

环信即时通讯 IM SDK 提供 `IEMChatRoomManager` 类、`EMChatRoomManagerDelegate` 类和 `EMChatroom` 类用于聊天室属性管理，支持你通过调用 API 在项目中实现如下功能：

- 获取和更新聊天室基本属性；
- 获取聊天室自定义属性；
- 设置和强制设置聊天室自定义属性；
- 删除和强制删除聊天室自定义属性。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)；
- 了解环信即时通讯 IM 的 [使用限制](/product/limitation.html)。
- 了解聊天室的数量限制，详见 [套餐包详情](https://www.easemob.com/pricing/im)。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 管理聊天室基本属性

#### 获取聊天室名称和描述

对于聊天室名称和描述，你可以调用 `getChatroomSpecificationFromServerWithId` 方法[获取聊天室详情](room_manage.html#获取聊天室详情)时查看。

#### 获取聊天室公告

聊天室所有成员均可调用 `getChatroomAnnouncementWithId` 方法获取聊天室公告。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager getChatroomAnnouncementWithId:@"chatRoomId" completion:nil];
```

#### 更新聊天室公告

仅聊天室所有者和聊天室管理员可以调用 `updateChatroomAnnouncementWithId` 方法设置和更新聊天室公告，聊天室公告的长度限制为 512 个字符。公告更新后，其他聊天室成员收到 `chatroomAnnouncementDidUpdate` 回调。

示例代码如下：

```objectivec
EMError *error =  nil;
// 异步方法
[[EMClient sharedClient].roomManager updateChatroomAnnouncementWithId:_chatroomId announcement:textString completion:nil];
```

#### 修改聊天室名称

仅聊天室所有者和聊天室管理员可以调用 `updateSubject` 方法设置和修改聊天室名称，聊天室名称的长度限制为 128 个字符。

示例代码如下：

```objectivec
EMError *error = nil;
// 异步方法
[[EMClient sharedClient].roomManager updateSubject:textString forChatroom:self.chatroom.chatroomId completion:nil];
```

#### 修改聊天室描述

仅聊天室所有者和聊天室管理员可以调用 `updateDescription` 方法设置和修改聊天室描述，聊天室描述的长度限制为 512 个字符。

示例代码如下：

```objectivec
EMError *error = nil;
// 异步方法
[[EMClient sharedClient].roomManager updateDescription:textString forChatroom:self.chatroom.chatroomId completion:nil];
```

### 管理聊天室自定义属性（key-value）

#### 获取聊天室指定自定义属性

聊天室所有成员均可调用 `fetchChatroomAttributes` 方法获取聊天室指定自定义属性。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager fetchChatroomAttributes:self.currentConversation.conversationId keys:@[@"123"] completion:^(NSDictionary * _Nullable map, EMError * _Nullable error) {

            }];
```

#### 获取聊天室所有自定义属性

聊天室成员可以调用 `fetchChatroomAllAttributes` 方法获取聊天室所有自定义属性。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager fetchChatroomAllAttributes:self.currentConversation.conversationId completion:^(NSDictionary * _Nullable map, EMError * _Nullable error) {

            }];
```

#### 设置单个聊天室属性

聊天室成员可以调用 `setChatroomAttributes` 方法设置和更新单个聊天室自定义属性。该方法只可添加新自定义属性字段和更新自己设置的现有属性。设置后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager setChatroomAttributes:self.currentConversation.conversationId key:@"234" value:@"123" autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 强制设置单个聊天室属性

如果除了设置自己的单个自定义属性还需覆盖其他聊天室成员设置的该属性，需调用 `setChatroomAttributesForced` 方法。设置成功后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager setChatroomAttributesForced:self.currentConversation.conversationId key:@"234" value:@"123" autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 设置多个聊天室自定义属性

聊天室成员可以调用 `setChatroomAttributes` 方法设置多个聊天室自定义属性。该方法只能添加新属性字段以及更新当前用户已添加的属性字段。设置成功后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager setChatroomAttributes:self.currentConversation.conversationId attributes:@{@"testKey":@"123"} autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 强制设置多个聊天室属性

如果除了设置自己的多个自定义属性还需覆盖其他聊天室成员设置的这些属性，需调用 `setChatroomAttributesForced` 方法。设置成功后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidUpdated` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager setChatroomAttributesForced:self.currentConversation.conversationId attributes:@{@"testKey":@"123"} autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {
                }];
```

#### 删除单个聊天室自定义属性

聊天室成员可以调用 `removeChatroomAttributes` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。移除后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager removeChatroomAttributes:self.currentConversation.conversationId key:@"234" autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 强制删除单个聊天室自定义属性

如果除了删除自己设置的单个自定义属性还需删除其他聊天室成员设置的该属性，需调用 `removeChatroomAttributesForced` 方法。删除后聊天室其他成员收到 `EMChatRoomManagerDelegate` 中 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager removeChatroomAttributesForced:self.currentConversation.conversationId key:@"234" autoDelete:YES completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 删除多个聊天室自定义属性

聊天室成员可以调用 `removeChatroomAttributes` 方法删除多个聊天室自定义属性。该方法只能删除自己设置的自定义属性。设置成功后，其他聊天室成员收到 `EMChatRoomManagerDelegate` 中的 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager removeChatroomAttributes:self.currentConversation.conversationId attributes:@[@"testKey"] completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

#### 强制删除多个聊天室自定义属性

如果除了删除自己设置的多个自定义属性还需删除其他聊天室成员设置的这些属性，需调用 `removeChatroomAttributesForced` 方法。删除后，聊天室其他成员收到 `EMChatRoomManagerDelegate` 中 `chatroomAttributesDidRemoved` 回调。

示例代码如下：

```objectivec
// 异步方法
[EMClient.sharedClient.roomManager removeChatroomAttributesForced:self.currentConversation.conversationId attributes:@[@"testKey"] completionBlock:^(EMError * _Nullable aError, NSDictionary<NSString *,NSString *> * _Nullable failureKeys) {

                }];
```

### 监听聊天室事件

详见 [监听聊天室事件](room_manage.html#监听聊天室事件)。
