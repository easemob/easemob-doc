# 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题 `title` 和推送内容 `content`。

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_push_ext":@{
    @"title": @"customTitle",
    @"content": @"customContent"
}};

message.chatType = EMChatTypeChat;
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                  | 描述                                                         |
| :-------------------- | :----------------------------------------------------------- |
| `body`                | 消息体。                                                     |
| `ConversationID`      | 消息所属的会话 ID。                                          |
| `from`                | 消息发送方，一般为当前登录 ID。                              |
| `to`                  | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_push_ext`         | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `title`          | 推送通知的自定义标题。 |
| `content`          | 推送通知展示的自定义内容。 |

**解析的内容**

```json
{
    "aps":{
        "alert":{
            "body":"custom push content"
        },   
        "badge":1,               
        "sound":"default"        
    },
    "f":"6001",                  
    "t":"6006",                  
    "m":"373360335316321408",
}
```

| 参数    | 描述            |
| :------ | :-------------- |
| `body`  | 显示内容。      |
| `badge` | 角标数。        |
| `sound` | 提示铃声。      |
| `f`     | 消息发送方 ID。 |
| `t`     | 消息接收方 ID。 |
| `m`     | 消息 ID。       |
