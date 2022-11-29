# 管理本地消息数据

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何管理本地消息数据。SDK 内部使用 SQLite 保存本地消息，方便消息处理。

除了发送和接收消息外，环信即时通讯 IM SDK 还支持以会话为单位对本地的消息数据进行管理，如获取与管理未读消息、删除聊天记录、搜索历史消息以及统计消息流量等。其中，会话是一个单聊、群聊或者聊天室所有消息的集合。用户需在会话中发送消息或查看历史消息，还可进行清空聊天记录等操作。

## 技术原理

环信即时通讯 IM iOS SDK 支持管理用户设备上存储的消息会话数据，其中包含如下主要方法：

- `getAllConversations` 加载本地存储的会话列表；
- `deleteConversations` 删除本地存储的会话；
- `conversation.unreadMessagesCount` 获取指定会话的未读消息数；
- `deleteConversation` 删除指定会话；
- `conversation.loadMessagesStartFromId` 在本地存储的消息中搜索；
- `insertMessage` 在指定会话中写入消息；
- `getMessageStatisticsById` 根据消息 ID 获取消息流量统计信息；
- `getMessageCountWithStart` 获取一定时间段内发送和/或接收的指定或全部类型的消息条数；
- `getMessageStatisticsSizeWithStart` 获取一定时间段内发送和/或接收的指定或全部类型的消息的总流量。

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

### 删除会话及历史消息

你可以删除本地会话和历史消息，示例代码如下：

```objectivec
// 删除指定会话，如果需要保留历史消息，`isDeleteMessages` 参数传 `NO`，异步方法。
[[EMClient sharedClient].chatManager deleteConversation:conversationId isDeleteMessages:YES completion:nil];
// 删除一组会话。
NSArray *conversations = @{@"conversationID1",@"conversationID2"};
[[EMClient sharedClient].chatManager deleteConversations:conversations isDeleteMessages:YES completion:nil];
```

```objectivec
// 删除当前会话中指定的一条历史消息。
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
[conversation deleteMessageWithId:.messageId error:nil];
```

删除服务端的会话及其历史消息，详见 [删除服务端会话及其历史消息](message_retrieve.html#删除服务端会话及其历史消息)。

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
