# Set Push Notification with Message Extensions

When creating a push message, you can set the message extension field to customize the push title `title` and push content `content` to display.

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

| Parameter | Description |
| :-------------------- | :----------------------------------------------------------- |
| `body` | Message body. |
| `ConversationID` | The conversation ID to which the message belongs. |
| `from` | The message sender, usually the current logged-in ID. |
| `to` | The message receiver ID, usually the same as `ConversationID`. |
| `em_push_ext` | Message extension. Use the extension to add custom fields to the push notification. The value is fixed and cannot be changed. |
| `title` | The custom title of the push notification. |
| `content` | The custom content displayed in the push notification. |

**Parsed content**

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
    "m":"373360335316321408"
}
```

| Parameter | Description |
| :------ | :-------------- |
| `body` | Display content. |
| `badge` | Badge count. |
| `sound` | Notification sound. |
| `f` | Message sender ID. |
| `t` | Message receiver ID. |
| `m` | Message ID. |
