# 获取历史消息

<Toc />

本文介绍环信即时通讯 IM SDK 如何从服务器和本地获取历史消息。

- 环信即时通讯 IM 提供消息漫游功能，即将用户的所有会话的历史消息保存在消息服务器，用户在任何一个终端设备上都能获取到历史信息，使用户在多个设备切换使用的情况下也能保持一致的会话场景。

- SDK 内部使用 SQLite 保存本地消息，你可以获取本地消息。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `IEMChatManager` 和 `EMConversation` 类支持获取服务器和本地的消息，包含如下主要方法：

- `IEMChatManager#asyncFetchHistoryMessagesFromServer`：从服务器分页获取指定会话的历史消息
- `EMConversation#loadMessagesStartFromId`：从数据库中读取指定会话的消息；
- `IEMChatManager#getMessageWithMessageId`：根据消息 ID 获取本地消息；
- `EMConversation#loadMessagesWithType`：获取本地存储的指定会话中特定类型的消息；
- `EMConversation#loadMessagesFrom:to:count:completion:` 获取指定时间段内本地指定会话中发送和接收的消息；

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从服务器获取指定会话的消息

你可以调用 `asyncFetchHistoryMessagesFromServer` 方法从服务器获取指定会话的消息（消息漫游）。你可以指定消息查询方向，即明确按时间顺序或逆序获取。

为确保数据可靠，我们建议你每次最多获取 50 条消息，可多次获取。拉取后，SDK 会自动将消息更新到本地数据库。

:::tip
1. 历史消息和离线消息在服务器上的存储时间与你订阅的套餐包有关，详见[产品价格](/product/pricing.html#套餐包功能详情)。
2. 各类事件通知发送时，若接收的用户离线时，事件通知的存储时间与离线消息的存储时间一致，即也取决于你订阅的套餐包。
:::

```objectivec
// 异步方法
 [[EMClient sharedClient].chatManager asyncFetchHistoryMessagesFromServer:conversation.conversationId conversationType:conversation.type startMessageId:self.moreMsgId pageSize:10 completion:^(EMCursorResult *aResult, EMError *aError) {
             [self.conversation loadMessagesStartFromId:self.moreMsgId count:10 searchDirection:EMMessageSearchDirectionUp completion:block];
          }];
```

### 从本地读取指定会话的消息

你可以调用以下方法从数据库中读取指定会话的消息：

```objectivec
// 获取指定会话 ID 的会话。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
//startMsgId：查询的起始消息 ID； count：每次获取的消息条数。如果设为小于等于 0，SDK 获取 1 条消息。
//searchDirection：消息搜索方向。若消息方向为 `UP`，按消息时间戳的降序获取；若为 `DOWN`，按消息时间戳的升序获取。
NSArray<EMChatMessage *> *messages = [conversation loadMessagesStartFromId:startMsgId count:count searchDirection:MessageSearchDirectionUp];
```

### 根据消息 ID 获取本地消息

你可以调用 `getMessageWithMessageId` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```objectivec
// 同步方法
EMConversation* conv = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
EMError* err = nil;
// messageId：要获取消息的消息 ID。
EMChatMessage* message = [EMClient.sharedClient.chatManager getMessageWithMessageId:@"messageId"];
```

### 获取本地会话中特定类型的消息

你可以调用 `loadMessagesWithType` 方法从本地存储中获取指定会话中特定类型的消息。每次最多可获取 400 条消息。若未获取到任何消息，SDK 返回空列表。

```objectivec
// 异步方法
EMConversation* conv = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
// timestamp：消息搜索的起始时间戳，单位为毫秒。该参数设置后，SDK 从指定的时间戳的消息开始，按照搜索方向对消息进行搜索。若设置为负数，SDK 从当前时间开始，按消息时间戳的逆序搜索。
// count：每次搜索的消息数量。取值范围为 [1,400]。
// searchDirection：消息搜索方向：（默认）`UP`：按消息时间戳的逆序搜索；`DOWN`：按消息时间戳的正序搜索。
[conv loadMessagesWithType:EMMessageBodyTypeText timestamp:1671761876000 count:50 fromUser:@"" searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> * _Nullable aMessages, EMError * _Nullable aError) {
        
}];
```

### 获取一定时间内本地会话的消息

你可以调用 `loadMessagesFrom:to:count:completion:` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。

每次最多可获取 400 条消息。

```objectivec
// 异步方法
EMConversation* conv = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
// startTime：查询的起始时间戳，单位为毫秒；endTime：查询的结束时间戳，单位为毫秒；count：每次获取的消息数量。取值范围为 [1,400]。
[conv loadMessagesFrom:startTime to:endTime count:50 completion:^(NSArray<EMChatMessage *> * _Nullable aMessages, EMError * _Nullable aError) {
            
}];
```
