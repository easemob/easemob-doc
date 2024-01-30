# 搜索消息

<Toc />

本文介绍环信即时通讯 IM iOS SDK 如何搜索本地消息。
 
## 技术原理

环信即时通讯 IM iOS SDK 支持搜索用户设备上存储的消息数据，其中包含如下主要方法：

- `IEMChatManager.loadMessagesWithKeyword` 根据关键字搜索本地数据库中单个会话中指定用户发送的消息。
- `EMChatManager#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:`: 根据关键字搜索消息时，可以选择搜索范围在所有会话中进行消息搜索。
- `EMConversation#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:`：根据关键字搜索消息时，可以选择搜索范围在当前会话中进行消息搜索。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 根据关键字搜索会话中的用户发送的消息  

你可以调用 `loadMessagesWithKeyword` 方法根据关键字搜索本地数据库中单个会话中指定用户发送的消息，示例代码如下：

```swift
// 同步方法，异步方法见[EMConversation loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:completion]
EMConversation* conversation = [EMClient.sharedClient.chatManager getConversationWithConvId:@"conversationId"];
NSArray<EMChatMessage *> *messages = [conversation loadMessagesWithKeyword:@"keyword" timestamp:0 count:50 fromUser:nil searchDirection:EMMessageSearchDirectionDown];
```

### 根据搜索范围搜索所有会话中的消息 

你可以调用 `EMChatManager#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:` 方法，除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索所有会话中的消息时，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。 

```swift
EMClient.shared().chatManager?.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUser: "", searchDirection: .down, scope: .content, completion: { messages, aError in
            
        })
```

### 根据搜索范围搜索当前会话中的消息 

你可以调用 `EMConversation#loadMessagesWithKeyword:timestamp:count:fromUser:searchDirection:scope:completion:` 方法除了设置关键字、消息时间戳、消息数量、发送方、搜索方向等条件搜索当前会话中的消息，你还可以选择搜索范围，如只搜索消息内容、只搜索消息扩展信息以及同时搜索消息内容以及扩展信息。

```swift
if let conversation = EMClient.shared().chatManager?.getConversationWithConvId("conversationsId") {
    conversation.loadMessages(withKeyword: "keyword", timestamp: 0, count: 50, fromUser: "", searchDirection: .down, scope: .content, completion: { messages, aError in
                
    })
}
```