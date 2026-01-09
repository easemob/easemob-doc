# 使用消息扩展字段设置推送通知显示内容

创建推送消息时，你可以设置消息扩展字段自定义要显示的推送标题 `em_push_title` 和推送内容 `em_push_content`。

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{
    @"em_push_title": @"customTitle",
    @"em_alert_subTitle": @"customSubTitle",
    @"em_push_content": @"customContent",
    @"em_push_badge": 1,
    @"em_push_sound": @"a.caf"
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
| `em_apns_ext`         | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_title`          | 推送通知的自定义标题。 |
| `em_alert_subTitle`        | 推送通知的自定义副标题。 |
| `em_push_content`          | 推送通知展示的自定义内容。 |
| `em_push_badge`          | 推送通知的自定义角标数。 |
| `em_push_sound`          | 推送通知的自定义铃声文件，如"a.caf"，铃声文件要放到app的主bundle下。 |

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
