# 消息扩展

## 功能说明

当内置消息字段无法满足业务需求时，可以通过消息扩展字段携带自定义业务数据，例如被回复消息信息、图文消息展示数据或业务标识等。

iOS SDK 通过 `EMChatMessage#ext` 设置和获取消息扩展字段。`ext` 为 `NSDictionary *` 类型，Key 应为 `NSString *`，Value 支持 `NSString *` 或 `NSNumber *`，可用于存储布尔值、整数、浮点数等数值类型。

接收方收到消息后，可通过 `message.ext` 获取全部扩展字段，并按业务约定读取相应 Key 的值。

## 示例代码

```objectivec
// 创建文本消息体。content 为要发送的文本内容。
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:content];

// 设置消息扩展字段。Key 为 NSString，Value 支持 NSString 或 NSNumber。
NSDictionary *messageExt = @{@"attribute": @"value"};

// 创建消息，并在 ext 参数中传入扩展字段。
// toChatUsername 为单聊对端用户 ID；群聊或聊天室时传对应的群组或聊天室 ID。
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:toChatUsername
                                                                   body:body
                                                                    ext:messageExt];

// 设置会话类型：单聊为 EMChatTypeChat，群聊为 EMChatTypeGroupChat，聊天室为 EMChatTypeChatRoom。
message.chatType = EMChatTypeChat;

// 发送携带扩展字段的消息。
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:nil];

// 接收消息时读取扩展字段。
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        // 根据业务约定的 Key 获取扩展字段值。
        NSString *value = message.ext[@"attribute"];
    }
}
```

## 接口列表

| API 名称 | 所属模块/类型 | 说明 |
| :--- | :--- | :--- |
| [`ext`](#示例代码) | `EMChatMessage` | 设置或获取消息扩展字段。 |
| [`sendMessage`](#示例代码) | `IEMChatManager` | 发送携带扩展字段的消息。 |
