# 定向消息

## 功能说明

发送定向消息是指向群组或聊天室的单个或多个指定成员发送消息，其他成员不会收到该消息。

## 使用限制

- **支持消息类型：** 适用于文本、图片、语音、视频等各类消息。
- **接收人数限制：** 每条定向消息最多可指定群组或聊天室中的 20 名成员接收。
- **会话列表与未读数：** 定向消息不会写入服务端会话列表，也不计入服务端会话的未读消息数。
- **群组消息漫游：** 群组定向消息默认不支持漫游。如需使用，需联系环信商务开通。
- **聊天室消息漫游：** 聊天室定向消息默认不支持漫游。如需使用，需联系环信商务同时开通聊天室消息漫游和定向消息漫游功能。

## 发送定向消息

发送定向消息的流程与发送普通消息相似，唯一区别在于发送前需要通过 `receiverList` 设置消息的接收方。具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方列表。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息：

```objectivec
// 创建一条文本消息。
EMTextMessageBody *textBody = [[EMTextMessageBody alloc] initWithText:@"hello"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:@"groupId" body:textBody ext:nil];
// 会话类型：群组和聊天室聊天，分别为 EMChatTypeGroupChat 和 EMChatTypeChatRoom。
message.chatType = EMChatTypeGroupChat;
// 设置消息接收方列表。最多可传 20 个接收方的用户 ID。传 nil 时，消息发送给全部成员。
message.receiverList = @[@"A", @"B"];

[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
    // 处理发送结果。
}];
```

接收定向消息与接收普通消息的操作相同，详见 [接收文本消息](message_receive.html#接收文本消息)。

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`initWithConversationID`](#发送定向消息) | `EMChatMessage` | 创建消息。 |
| [`chatType`](#发送定向消息) | `EMChatMessage` | 将消息的会话类型设置为群聊或聊天室。 |
| [`receiverList`](#发送定向消息) | `EMChatMessage` | 设置定向消息的接收方列表。 |
| [`sendMessage`](#发送定向消息) | `IEMChatManager` | 发送定向消息。 |
