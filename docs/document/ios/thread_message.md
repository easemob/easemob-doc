# 管理消息话题中的消息

消息话题中的消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。

本文介绍环信即时通讯 IM iOS SDK 如何发送、接收以及撤回消息话题中的消息。

## 功能开通

使用消息话题中的消息功能前，你需要联系商务开通消息话题功能。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `EMManager`、`EMChatMessage` 和 `EMChatThreadInfo` 类，用于管理消息话题中的消息，支持你通过调用 API 在项目中实现发送、接收、撤回和获取消息话题中的消息。

消息收发流程如下：

客户端 A 向客户端 B 发送消息。消息发送至即时通讯 IM 服务器，服务器将消息传递给客户端 B。对于消息话题中的消息，服务器投递给消息话题内其他每一个成员。客户端 B 收到消息后，SDK 触发事件。客户端 B 监听事件并获取消息。

消息话题创建和查看如下图：

![img](/images/ios/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 iOS SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解消息话题和消息话题成员数量限制，详见 [使用限制](/product/limitation.html)。
- 已联系商务开通消息话题功能。

## 发送消息话题中的消息

发送消息话题中的消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send.html)。唯一不同的是，发送消息话题中的消息需要指定标记 `isChatThread` 为 `YES`。

单设备登录时，消息话题所属群组的所有成员会收到 `onChatThreadUpdate` 回调。

示例代码如下：

```objectivec
// 创建一条文本消息，`content` 为消息文字内容，`chatThreadId` 为消息话题 ID。
NSString *from = [[EMClient sharedClient] currentUsername];
NSString *chatThreadId = self.currentConversation.conversationId;
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:chatThreadId from:from to:chatThreadId body:aBody ext:aExt];
// 是否需要消息已读回执。
if([aExt objectForKey:MSG_EXT_READ_RECEIPT]) {
    message.isNeedReadReceipt = YES;
}
message.chatType = (EMChatType)self.conversationType;
message.isChatThread = self.isChatThread;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {

}];
```

## 接收消息话题中的消息

接收消息的具体逻辑，请参考 [接收消息](message_receive.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题成员可以设置消息监听回调 `messagesDidReceive` 对消息话题中的消息的接收进行监听。

示例代码如下：

```objectivec
- (void)messagesDidReceive:(NSArray *)aMessages
{
    // 做相关处理。
}
// 添加消息监听器。
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
// 移除消息监听器。
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## 撤回消息话题中的消息

撤回消息的具体逻辑，请参考 [撤回消息](message_recall.html)，此处只介绍消息话题中的消息和其他消息的区别。

消息话题成员可以设置消息监听回调 `messagesInfoDidRecall` 对消息话题中的消息的撤回进行监听。

示例代码如下：

```objectivec
- (void)messagesInfoDidRecall:(NSArray<EMRecallMessageInfo *> *)aRecallMessagesInfo
{}
```

## 获取消息话题中的消息

从服务器还是本地数据库获取消息话题中的消息取决于你的生产环境。

你可以通过 `isChatThread` 属性判断当前会话是否为消息话题会话。

### 从服务器获取单个消息话题中的消息 (消息漫游)

调用 `fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:` 方法从服务器获取消息话题中的消息。从服务器获取消息话题中的消息与获取群组消息的唯一区别为前者需传入消息话题 ID，后者需传入群组 ID。

```objectivec
[EMClient.sharedClient.chatManager fetchMessagesFromServerBy:@"threadId" conversationType:EMConversationTypeGroupChat cursor:nil pageSize:20 option:nil completion:^(EMCursorResult<EMChatMessage *> * _Nullable aResult, EMError * _Nullable aError) {
            
    }];
```

### 从本地获取单个消息话题的消息

调用 `getAllConversations` 方法只能获取单聊或群聊会话。要获取本地单个消息话题会话中的消息，参考以下示例代码：

```objectivec
// 需设置会话类型为 `EMConversationTypeGroupChat` 和 `isThread` 为 `YES`
EMConversation* conversation = [EMClient.sharedClient.chatManager getConversation:conversationId type:EMConversationTypeGroupChat createIfNotExist:NO isThread:YES];
// 获取该消息话题会话的消息
[conversation loadMessagesStartFromId:@"" count:20 searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> * _Nullable aMessages, EMError * _Nullable aError) {
            
}];
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`sendMessage`](#发送消息话题中的消息) | `EMChatManager` | 发送带 `isChatThread` 标记的消息话题消息。 |
| [`fetchMessagesFromServerBy`](#从服务器获取单个消息话题中的消息-消息漫游) | `EMChatManager` | 分页从服务器获取指定消息话题的历史消息。 |
| [`getConversation`](#从本地获取单个消息话题的消息) | `EMChatManager` | 获取本地消息话题会话。 |
| [`loadMessagesStartFromId`](#从本地获取单个消息话题的消息) | `EMConversation` | 从本地会话加载消息话题消息。 |
