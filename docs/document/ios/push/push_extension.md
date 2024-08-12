# 设置推送扩展

你可以利用扩展字段实现自定义推送设置，包括自定义铃声、强制推送、发送静默消息以及富文本推送功能。

## 自定义推送字段

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"extern":@"custom string"}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `body`           | 消息体。                                                     |
| `ConversationID` | 消息属于的会话 ID。                                          |
| `from`           | 消息发送方，一般为当前登录 ID。                              |
| `to`             | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `extern`         | 自定义字段 key，用于设置自定义的内容，该值为固定值，不可修改。 |
| `custom string`  | 自定义字段内容。                                             |

**解析的内容**

```plaintext
{
    "apns": {
        "alert": {
            "body": "test"
        }, 
        "badge": 1, 
        "sound": "default"
    }, 
    "e": "custom string", 
    "f": "6001", 
    "t": "6006", 
    "m": "373360335316321408"
}
```

| 参数    | 描述            |
| :------ | :-------------- |
| `body`  | 显示内容。      |
| `badge` | 角标数。        |
| `sound` | 提示铃声。      |
| `f`     | 消息发送方 ID。 |
| `t`     | 消息接收方 ID。 |
| `e`     | 自定义信息。    |
| `m`     | 消息 ID。       |

## 设置某些群成员收到推送通知 

在离线推送免打扰模式下，若你在群组中发送消息时只希望某些群成员收到离线推送通知，可通过设置消息扩展字段实现。

```Objective-C
EMTextMessageBody* body = [[EMTextMessageBody alloc] initWithText:@"hello"];
    EMChatMessage* msg = [[EMChatMessage alloc] initWithConversationID:@"groupId" body:body ext:nil];
    // 推送给群中所有成员时，设置为 `All`。
    msg.ext = @{@"em_apns_ext":@{@"em_at_list":@"All"}};
    //推送给指定群成员,设置为成员列表。
    msg.ext = @{@"em_apns_ext":@{@"em_at_list":@[@"userId1",@"userId2"]}};
    message.chatType = EMChatTypeGroupChat; 
    [EMClient.sharedClient.chatManager sendMessage:msg progress:nil completion:nil];
```

该扩展字段的数据结构如下：

```json
{
    "em_apns_ext": {
        "em_at_list": "All"
    }
}
```

| 参数             | 描述               |
| :--------------- | :----------------- |
| `em_apns_ext`    | 内置的推送扩展字段。 |
| `em_at_list`          | 内置的扩展字段 key，对应的 value 为数组类型，表示接收推送通知的群成员的用户 ID，设置为 `All` 表示向所有群成员推送通知。  |

## 设置通知栏折叠 

你可以将通知栏中的多条消息折叠起来，示例代码如下：

```Objective-C
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_collapse_key":@"collapseKey"}};

[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

通知栏折叠字段的数据结构如下：

```json
{
    "em_apns_ext": {
        "em_push_collapse_key": "collapseKey"
    }
}
```

| 参数             | 描述               |
| :--------------- | :----------------- |
| `em_apns_ext`    | 内置的消息扩展字段。  |
| `em_push_collapse_key`   | 指定一组可折叠的消息（例如，含有 collapse_key: “Updates Available”），以便恢复传送时只发送最后一条消息，从而避免设备恢复在线状态或变为活跃状态时重复发送过多相同的消息。   |

## 自定义铃声

推送铃声是指用户收到推送时的提示音，你需要将音频文件加入到 app 中，并在推送中配置使用的音频文件名称。

- 支持格式 Linear PCM MA4 (IMA/ADPCM) µLaw aLaw。
- 音频文件存放路径 AppData/Library/Sounds，时长不得超过 30 秒。

更多内容可以参考苹果官方文档：[生成远程推送通知](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification?language=objc)。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_sound":@"custom.caf"}};
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数             | 描述                                                         |
| :--------------- | :----------------------------------------------------------- |
| `body`           | 消息体。                                                     |
| `ConversationID` | 消息属于的会话 ID。                                          |
| `from`           | 消息发送方，一般为当前登录 ID。                              |
| `to`             | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`    | 消息扩展，使用扩展的方式向推送中添加自定义字段，该值为固定值，不可修改。 |
| `em_push_sound`  | 自定义字段，用于设置自定义要显示的内容，该值为固定值，不可修改。 |
| `custom.caf`     | 音频文件名称。                                               |

**解析的内容**

```plaintext
{
    "aps":{
        "alert":{
            "body":"你有一条新消息"
        },  
        "badge":1,  
        "sound":"custom.caf"  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
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

## 强制推送

使用该方式设置后，本条消息会忽略接收方的免打扰设置，不论是否处于免打扰时间段都会正常向对方推送通知；

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_force_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                    | 描述                                          |
| :---------------------- | :-------------------------------------------- |
| `body`                  | 消息体。                                      |
| `ConversationID`        | 消息属于的会话 ID。                           |
| `from`                  | 消息发送方，一般为当前登录 ID。               |
| `to`                    | 消息接收方 ID，一般与 `ConversationID` 一致。 |
| `em_force_notification` | 是否为强制推送：<br/> - `YES`：强制推送<br/> - （默认）`NO`：非强制推送。<br/>该字段名固定，不可修改。   |

## 发送静默消息

发送静默消息指发送方在发送消息时设置不推送消息，即用户离线时，环信即时通讯 IM 服务不会通过第三方厂商的消息推送服务向该用户的设备推送消息通知。因此，用户不会收到消息推送通知。当用户再次上线时，会收到离线期间的所有消息。

发送静默消息和免打扰模式下均为不推送消息，区别在于发送静默消息为发送方在发送消息时设置，而免打扰模式为接收方设置在指定时间段内不接收推送通知。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_ignore_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                    | 描述                                          |
| :---------------------- | :-------------------------------------------- |
| `body`                  | 消息体。                                      |
| `ConversationID`        | 消息属于的会话 ID。                           |
| `from`                  | 消息发送方，一般为当前登录 ID。               |
| `to`                    | 消息接收方 ID，一般与 `ConversationID` 一致。 |
| `em_ignore_notification` | 是否发送静默消息。<br/> - `YES`：发送静默消息；<br/> - （默认）`NO`：推送该消息。<br/>该字段名固定，不可修改。 |

## 实现富文本推送

如果你的目标平台是 iOS 10.0 或以上版本，你可以参考如下代码实现 [`UNNotificationServiceExtension`](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension?language=objc) 的富文本推送功能。

```plaintext
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_mutable_content":@YES}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| 参数                      | 描述                                                         |
| :------------------------ | :----------------------------------------------------------- |
| `body`                    | 消息体。                                                     |
| `ConversationID`          | 消息属于的会话 ID。                                          |
| `from`                    | 消息发送方，一般为当前登录 ID。                              |
| `to`                      | 消息接收方 ID，一般与 `ConversationID` 一致。                |
| `em_apns_ext`             | 消息扩展字段，该字段名固定，不可修改。该字段用于配置富文本推送通知，包含自定义字段。 |
| `em_push_mutable_content` | 是否使用富文本推送通知（`em_apns_ext`）：<br/> - `YES`：富文本推送通知；<br/> - （默认）`NO`：普通推送通知。<br/>该字段名固定，不可修改。   |

接收方收到富文本推送时，会进入回调 `didReceiveNotificationRequest:withContentHandler:`，示例代码如下：
```Objective-C
- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    // 推送扩展字段
    NSDictionary *userInfo = request.content.userInfo;
    // 通知内容
    UNNotificationContent *content = [request.content mutableCopy];
    contentHandler(content);
}
```

**解析的内容**

```plaintext
{
    "aps":{
        "alert":{
            "body":"test"
        },  
        "badge":1,  
        "sound":"default",
        "mutable-content":1  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

| 参数              | 描述                                                         |
| :---------------- | :----------------------------------------------------------- |
| `body`            | 显示内容。                                                   |
| `badge`           | 角标数。                                                     |
| `sound`           | 提示铃声。                                                   |
| `mutable-content` | 苹果要求的关键字，存在之后才可唤醒 UNNotificationServiceExtension。 |
| `f`               | 消息发送方 ID。                                              |
| `t`               | 消息接收方 ID。                                              |
| `m`               | 消息 ID。                                                    |