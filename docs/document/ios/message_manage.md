# 管理本地消息

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何管理本地消息，例如获取消息、搜索消息、导入消息、插入消息、更新消息以及统计消息流量等。
 
## 技术原理

环信即时通讯 IM iOS SDK 支持管理用户设备上存储的消息会话数据，其中包含如下主要方法：

- `EMConversation.loadMessagesStartFromId` 从数据库中读取指定会话的消息；
- `IEMChatManager.getMessageWithMessageId` 根据消息 ID 搜索消息；
- `EMConversation.loadMessagesWithType` 获取指定会话中特定类型的消息；
- `EMConversation.loadMessagesFrom:to:count:completion:` 获取指定会话中一定时间段内的消息；
- `IEMChatManager.loadMessagesWithKeyword` 根据关键字搜索会话消息；
- `IEMChatManager.importMessages` 批量导入消息到数据库；
- `EMConversation.insertMessage` 插入消息；
- `IEMChatManager.updateMessage` 更新消息到本地数据库；
- `getMessageStatisticsById` 根据消息 ID 获取消息流量统计信息；
- `getMessageCountWithStart` 获取一定时间段内发送和/或接收的指定或全部类型的消息条数；
- `getMessageStatisticsSizeWithStart` 获取一定时间段内发送和/或接收的指定或全部类型的消息的总流量。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 从数据库中读取指定会话的消息

可以从数据库中读取指定会话的消息：

```objectivec
// 获取指定会话 ID 的会话。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
//startMsgId：查询的起始消息 ID； count：每次获取的消息条数。如果设为小于等于 0，SDK 获取 1 条消息。
//searchDirection：消息搜索方向。若消息方向为 `UP`，按消息时间戳的降序获取；若为 `DOWN`，按消息时间戳的升序获取。
NSArray<EMChatMessage *> *messages = [conversation loadMessagesStartFromId:startMsgId count:count searchDirection:MessageSearchDirectionUp];
```

### 根据消息 ID 搜索消息

你可以调用 `getMessageWithMessageId` 方法根据消息 ID 获取本地存储的指定消息。如果消息不存在会返回空值。

```objectivec
// 同步方法
EMConversation* conv = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
EMError* err = nil;
// messageId：要获取消息的消息 ID。
EMChatMessage* message = [EMClient.sharedClient.chatManager getMessageWithMessageId:@"messageId"];
```

### 获取指定会话中特定类型的消息

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

### 获取指定会话中一定时间段内的消息

你可以调用 `loadMessagesFrom:to:count:completion:` 方法从本地存储中获取指定的单个会话中一定时间内发送和接收的消息。每次最多可获取 400 条消息。

```objectivec
// 异步方法
EMConversation* conv = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
// startTime：搜索的起始时间戳，单位为毫秒；endTime：搜索的结束时间戳，单位为毫秒；count：每次获取的消息数量。取值范围为 [1,400]。
[conv loadMessagesFrom:startTime to:endTime count:50 completion:^(NSArray<EMChatMessage *> * _Nullable aMessages, EMError * _Nullable aError) {
            
}];
```

### 根据关键字搜索会话消息

你可以调用 `loadMessagesWithKeyword` 方法从本地数据库获取会话中的指定用户发送的包含特定关键字的消息，示例代码如下：

```objectivec
// 同步方法，异步方法见[EMConversation loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:completion]
    EMConversation* conversation = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
    NSArray<EMChatMessage *> *messages = [conversation loadMessagesWithKeyword:@"keyword" timestamp:0 count:50 fromUser:nil searchDirection:EMMessageSearchDirectionDown];
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

### 更新消息到本地数据库

如果需要更新消息用以下方法：

```objectivec
// 异步方法
[EMClient.sharedClient.chatManager updateMessage:message completion:^(EMChatMessage *aMessage, EMError *aError) {
    if (!aError) {
        // 更新本地消息完成。
    }
}];
```

### 获取本地消息的流量统计信息

本地消息的流量统计功能默认关闭。若要使用该功能，需在 SDK 初始化前设置 `EMOptions#enableStatistics` 开启。

SDK 只支持统计该功能开启后最近 30 天内发送和接收的消息。各类消息的流量计算方法如下：

- 对于文本、透传、位置消息，消息流量为消息体的流量；
- 对于图片和视频消息，消息流量为消息体、图片或视频文件以及缩略图的流量之和；
- 对于文件和语音消息，消息流量为消息体和附件的流量。

:::notice
 1. 统计时间段的开始时间和结束时间均为服务器接收消息的 Unix 时间戳。
 2. 对于携带附件的消息，下载成功后 SDK 才统计附件的流量。若附件下载多次，则会对下载的流量进行累加。
 3. 对于从服务器拉取的漫游消息，如果本地数据库中已经存在，则不进行统计。
:::

SDK 仅统计本地消息的流量，而非消息的实际流量。一般而言，该统计数据小于实际流量，原因如下：
- 未考虑发送消息时通用协议数据的流量；
- 对于接收到的消息，服务端会进行消息聚合，添加通用字段，而消息流量统计为各消息的流量，未考虑通用字段的流量消耗。

#### 根据消息 ID 获取消息流量统计信息

你可以根据消息 ID 获取指定消息的统计信息。该方法返回的消息流量统计信息包括消息 ID、消息的发送方和接收方
、消息体类型、会话类型、消息方向、消息流量大小（单位为字节）以及服务器收到该消息的 Unix 时间戳。

示例代码如下：

```objectivec
EMChatMessageStatistics * msgStatistics = [[[EMClient sharedClient] statisticsManager] getMessageStatisticsById:@"msgId"];
```

#### 获取一定时间段内发送和/或接收的消息条数

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息，示例代码如下：

```objectivec
NSInteger count = [EMClient.sharedClient.statisticsManager getMessageCountWithStart:startTime end:endTime direction:EMMessageStatisticsDirectionAll type:EMMessageStatisticsTypeText];
```

#### 获取一定时间段内发送和/或接收的消息的总流量

你可以统计一定时间段内发送和/或接收的指定或全部类型的消息的总流量，流量单位为字节。

示例代码如下：

```objectivec
NSInteger bytes = [EMClient.sharedClient.statisticsManager getMessageStatisticsSizeWithStart:startTime end:endTime direction:EMMessageStatisticsDirectionAll type:EMMessageStatisticsTypeAll];
```