# 管理子区消息 iOS

[[toc]]

子区消息消息类型属于群聊消息类型，与普通群组消息的区别是需要添加 `isChatThread` 标记。本文介绍环信即时通讯 IM iOS SDK 如何发送、接收以及撤回子区消息。

## 技术原理

环信即时通讯 IM iOS SDK 提供 `EMManager`、`EMChatMessage` 和 `EMChatThreadInfo` 类，用于管理子区消息，支持你通过调用 API 在项目中实现如下功能：

- 发送子区消息
- 接收子区消息
- 撤回子区消息
- 从服务端获取子区消息（消息漫游）

消息收发流程如下：

1. 用户 A 发送一条消息到环信的消息服务器;
2. 单聊时消息时，服务器投递消息给用户 B；对于群聊时消息，服务器投递给群内其他每一个成员;
3. 用户收到消息。

![img](@static/images/Android/sendandreceivemsg.png)

子区创建和查看如下图：

![img](@static/images/iOS/threads.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 `3.9.3 以上版本` SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM API 的 [使用限制](/product/limitation.html)。
- 了解子区和子区成员数量限制，详见 [使用限制](/product/limitation.html)。
- 联系商务开通子区功能。

## 实现方法

本节介绍如何使用环信即时通讯 IM SDK 提供的 API 实现上述功能。

### 发送子区消息

发送子区消息和发送群组消息的方法基本一致，详情请参考 [发送消息](message_send_receive.html#发送文本消息)。唯一不同的是，发送子区消息需要指定标记 `isChatThread` 为 `YES`。

单设备登录时，子区所属群组的所有成员会收到 `EMChatThreadManagerDelegate#onChatThreadUpdated` 回调。

示例代码如下：

```objectivec
// 创建一条文本消息，`content` 为消息文字内容，`chatThreadId` 为子区 ID。
NSString *from = [[EMClient sharedClient] currentUsername];
NSString *to = self.currentConversation.conversationId;
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:to from:from to:to body:aBody ext:aExt];
// 是否需要消息已读回执。
if([aExt objectForKey:MSG_EXT_READ_RECEIPT]) {
    message.isNeedGroupAck = YES;
}
message.chatType = (EMChatType)self.conversationType;
message.isChatThread = self.isChatThread;
// 发送消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {

}];
```

### 接收子区消息

接收消息的具体逻辑，请参考 [接收消息](message_send_receive.html#接收消息)，此处只介绍子区消息和其他消息的区别。

子区成员可以设置消息监听回调 `EMManagerDelegate#messagesDidReceive` 对子区消息的接收进行监听。

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

### 撤回子区消息

接收消息的具体逻辑，请参考 [撤回消息](message_send_receive.html#撤回消息)，此处只介绍子区消息和其他消息的区别。

子区成员可以设置消息监听回调 `EMChatManagerDelegate#messagesInfoDidRecall` 对子区消息的撤回进行监听。

示例代码如下：

```objectivec
- (void)messagesInfoDidRecall:(NSArray<EMRecallMessageInfo *> *)aRecallMessagesInfo
{}
```

### 从服务器获取子区消息 (消息漫游)

进入单个子区会话后默认展示最早消息，iOS 端默认直接从服务器按时间顺序获取子区历史消息。

从服务器获取子区消息，请参考 [从服务器获取消息 (消息漫游)](message_retrieve.html)。
