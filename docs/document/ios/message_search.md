# 搜索消息

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何搜索本地消息。
 
## 技术原理

环信即时通讯 IM iOS SDK 支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `IEMChatManager.loadMessagesWithKeyword` 根据关键字搜索本地数据库中单个会话中指定用户发送的消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话消息

你可以调用 `loadMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

```objectivec
// 同步方法，异步方法见[EMConversation loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:completion]
    EMConversation* conversation = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
    NSArray<EMChatMessage *> *messages = [conversation loadMessagesWithKeyword:@"keyword" timestamp:0 count:50 fromUser:nil searchDirection:EMMessageSearchDirectionDown];
```