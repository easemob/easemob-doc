# 定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 4.0.3 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 群组定向消息的漫游功能默认关闭，使用前需联系商务开通。
4. 聊天室定向消息的漫游功能默认关闭，使用前需联系商务开通聊天室消息漫游和定向消息漫游功能。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```objectivec
// 创建一条文本消息。
EMTextMessageBody* textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage* msg = [[EMChatMessage alloc] initWithConversationID:@"groupId" body:textBody ext:nil];
// 会话类型：群组和聊天室聊天，分别为 `EMChatTypeGroupChat` 和 `EMChatTypeChatRoom`。
msg.chatType = EMChatTypeGroupChat;
// 设置消息接收方列表。最多可传 20 个接收方的用户 ID。若传入 `nil`，则消息发送给群组或聊天室的所有成员。
msg.receiverList = @[@"A",@"B"];
// 发送消息。
[EMClient.sharedClient.chatManager sendMessage:msg progress:nil completion:^(EMChatMessage * _Nullable message, EMError * _Nullable error) {

}];
```

接收定向消息与接收普通消息的操作相同，详见 [接收文本消息](message_extension.html#接收文本消息)。
