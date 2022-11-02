# 管理本地消息数据

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何管理本地消息数据。SDK 内部使用 SQLite 保存本地消息，方便消息处理。

除了发送和接收消息外，环信即时通讯 IM SDK 还支持以会话为单位对本地的消息数据进行管理，如获取与管理未读消息、删除聊天记录、搜索历史消息等。其中，会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息或查看历史消息，还可进行清空聊天记录等操作。

## 技术原理

环信即时通讯 IM iOS SDK 支持管理用户设备上存储的消息会话数据，其中包含如下主要方法：

- `getAllConversations` 加载本地存储的会话列表；
- `deleteConversations` 删除本地存储的会话；
- `conversation.unreadMessagesCount` 获取指定会话的未读消息数；
- `deleteConversation` 删除指定会话；
- `conversation.loadMessagesStartFromId` 在本地存储的消息中搜索；
- `insertMessage` 在指定会话中写入消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 获取本地所有会话

你可以调用 API 获取本地所有会话：

```objectivec
NSArray *conversations = [[EMClient sharedClient].chatManager getAllConversations];
```

### 从数据库中读取指定会话的消息

可以从数据库中读取指定会话的消息：

```objectivec
// 获取指定会话 ID 的会话。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
//SDK 初始化时，为每个会话加载 1 条聊天记录。如需更多消息，请到数据库中获取。该方法获取 `startMsgId` 之前的 `count` 条消息，SDK 会将这些消息自动存入此会话，app 无需添加到会话中。
NSArray<EMChatMessage *> *messages = [conversation loadMessagesStartFromId:startMsgId count:count searchDirection:MessageSearchDirectionUp];
```

### 获取指定会话的未读消息数

你可以调用接口获取特定会话的未读消息数，示例代码如下：

```objectivec
// 获取指定会话 ID 的会话。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
// 获取未读消息数。
NSInteger unreadCount = conversation.unreadMessagesCount;
```

### 获取所有会话的未读消息数

示例代码如下：

```objectivec
NSArray *conversations = [[EMClient sharedClient].chatManager getAllConversations];
NSInteger unreadCount = 0;
for (EMConversation *conversation in conversations) {
    unreadCount += conversation.unreadMessagesCount;
}
```

### 指定会话的未读消息数清零

你可以调用接口将指定会话的未读消息数清零，示例代码如下：

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
// 将指定会话的消息未读数清零。
[conversation markAllMessagesAsRead:nil];
// 将一条消息置为已读。
[conversation markMessageAsReadWithId:messageId error:nil];
```

### 删除会话及聊天记录

SDK 提供两个接口，分别可以删除本地会话和聊天记录或者删除当前用户在服务器端的会话和聊天记录。

- 删除本地会话和聊天记录示例代码如下：

```objectivec
// 删除指定会话，如果需要保留聊天记录，`isDeleteMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteConversation:conversationId isDeleteMessages:YES completion:nil];
// 删除一组会话。
NSArray *conversations = @{@"conversationID1",@"conversationID2"};
[[EMClient sharedClient].chatManager deleteConversations:conversations isDeleteMessages:YES completion:nil];
```

```objectivec
// 删除当前会话中指定的一条聊天记录。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation deleteMessageWithId:.messageId error:nil];
```

- 删除服务器端会话和聊天记录，示例代码如下：

```objectivec
// 删除指定会话，如果需要保留聊天记录，`isDeleteServerMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteServerConversation:@"conversationId1" conversationType:EMConversationTypeChat isDeleteServerMessages:YES completion:^(NSString *aConversationId, EMError *aError) {
    // 删除回调
}];
```

### 根据关键字搜索会话消息

你可以根据关键字搜索会话消息，示例代码如下：

```objectivec
// 同步方法，异步方法见[EMChatManager loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:completion]
NSArray<EMChatMessage *> *messages = [conversation loadMessagesWithKeyword:keyword timestamp:0 count:50 fromUser:nil searchDirection:MessageSearchDirectionDown];
```

### 批量导入消息到数据库

如果你需要使用批量导入方式在本地会话中插入消息可以使用下面的接口，构造 `Message` 对象，将消息导入本地数据库。

```objectivec
// 异步方法
[[EMClient sharedClient].chatManager importMessages:messages completion:nil];
```

### 插入消息

如果你需要在本地会话中加入一条消息，比如收到某些通知消息时，可以构造一条消息写入会话。
例如插入一条无需发送但有需要显示给用户看的内容，类似 “XXX 撤回一条消息”、“XXX 入群”、“对方正在输入” 等。

```objectivec
// 将消息插入到指定会话中。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation insertMessage:message error:nil];
```

### 更新消息到 SDK 本地数据库

如果需要更新消息用以下方法：

```objectivec
// 异步方法
[EMClient.sharedClient.chatManager updateMessage:message completion:^(EMChatMessage *aMessage, EMError *aError) {
    if (!aError) {
        // 更新本地消息完成。
    }
}];
```