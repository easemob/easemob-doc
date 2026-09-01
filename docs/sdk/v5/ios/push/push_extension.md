# Configure Push Extension Features

You can use extension fields to configure custom push behavior, including force push, silent messages, and rich media push notifications.

For details about push extension fields, see [Offline push extension fields](/rest/push_extension.html).

## Set custom push fields

When creating a push message, you can add custom fields to the message to implement custom push settings.

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"extern":@"custom string"}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :--------------- | :----------------------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_apns_ext` | The message extension used to add custom fields to a push notification. This field name is fixed and cannot be changed. |
| `extern` | The key used to define custom content. This field name is fixed and cannot be changed. |
| `custom string` | The custom field content. |

**Parsed content**

```json
{
    "aps": {
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

| Parameter | Description |
| :------ | :-------------- |
| `body` | The displayed content. |
| `badge` | The badge count. |
| `sound` | The notification sound. |
| `f` | The message sender ID. |
| `t` | The message recipient ID. |
| `e` | The custom information. |
| `m` | The message ID. |

## Set a custom notification sound

The push notification sound is played when a user receives a push notification. Add the audio file to your app and specify its file name in the push notification configuration.

- Supported formats: Linear PCM, MA4 (IMA/ADPCM), µLaw, and aLaw.
- The audio duration cannot exceed 30 seconds.

For more information, see Apple documentation: [Generating a remote notification](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/generating_a_remote_notification?language=objc).

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_sound":@"custom.caf"}};
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :--------------- | :----------------------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_apns_ext` | The message extension used to add custom fields to a push notification. This field name is fixed and cannot be changed. |
| `em_push_sound` | The custom field used to specify the notification sound. This field name is fixed and cannot be changed. |
| `custom.caf` | The audio file name. |

**Parsed content**

```json
{
    "aps":{
        "alert":{
            "body":"You've got a new message"
        },  
        "badge":1,  
        "sound":"custom.caf"  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

| Parameter | Description |
| :------ | :-------------- |
| `body` | The displayed content. |
| `badge` | The badge count. |
| `sound` | The notification sound. |
| `f` | The message sender ID. |
| `t` | The message recipient ID. |
| `m` | The message ID. |

## Set a custom badge count

The push badge is the unread message count displayed on the app icon when a push notification arrives. Set `em_push_badge` to customize the badge count.

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_badge":@9}};
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :--------------- | :----------------------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_apns_ext` | The message extension used to add custom fields to a push notification. This field name is fixed and cannot be changed. |
| `em_push_badge` | The custom field used to set the badge count. This field name is fixed and cannot be changed. |
| `9` | The custom badge count. |

**Parsed content**

```json
{
    "aps":{
        "alert":{
            "body":"You have a new message"
        },  
        "badge":9,  
        "sound":"default"  
    },
    "f":"6001",  
    "t":"6006",  
    "m":"373360335316321408"  
}
```

| Parameter | Description |
| :------ | :-------------- |
| `body` | The displayed content. |
| `badge` | The badge count. |
| `sound` | The notification sound. |
| `f` | The message sender ID. |
| `t` | The message recipient ID. |
| `m` | The message ID. |

## Force push

After force push is enabled for a message, the message ignores the recipient DND settings and is pushed normally whether or not the recipient is currently in a DND period.

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_force_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :---------------------- | :-------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_force_notification` | Whether to force a push notification:<br/> - `YES`: Force push.<br/> - (Default) `NO`: Normal push.<br/>This field name is fixed and cannot be changed. |

## Send a silent message

For a silent message, the sender specifies that no push notification is sent with the message. When the recipient is offline, EasyIM does not send a notification to the recipient device through a third-party push service. The recipient therefore receives no push notification, but receives all messages sent during the offline period after coming back online.

Both sending silent messages and Do Not Disturb mode result in no message push. The difference is that a silent message is configured by the sender when sending it, whereas DND is configured by the recipient to not receive push notifications during a specified period.

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_ignore_notification":@YES};
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :---------------------- | :-------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_ignore_notification` | Whether to send a silent message:<br/> - `YES`: Send a silent message.<br/> - (Default) `NO`: Push the message.<br/>This field name is fixed and cannot be changed. |

## Implement rich media push notifications

If your target platform is iOS 10.0 or later, refer to the following code to implement rich media push notifications using [`UNNotificationServiceExtension`](https://developer.apple.com/documentation/usernotifications/unnotificationserviceextension?language=objc).

```objectivec
EMTextMessageBody *body = [[EMTextMessageBody alloc] initWithText:@"test"];
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:conversationId from:currentUsername to:conversationId body:body ext:nil];
message.ext = @{@"em_apns_ext":@{@"em_push_mutable_content":@YES}}; 
message.chatType = EMChatTypeChat; 
[EMClient.sharedClient.chatManager sendMessage:message progress:nil completion:nil];
```

| Parameter | Description |
| :------------------------ | :----------------------------------------------------------- |
| `body` | The message body. |
| `ConversationID` | The ID of the conversation to which the message belongs. |
| `from` | The message sender, generally the ID of the current logged-in user. |
| `to` | The message recipient ID, generally the same as `ConversationID`. |
| `em_apns_ext` | The message extension field used to configure rich media push notifications and custom fields. This field name is fixed and cannot be changed. |
| `em_push_mutable_content` | Whether to use a rich media push notification (`em_apns_ext`):<br/> - `YES`: Rich media push notification.<br/> - (Default) `NO`: Regular push notification.<br/>This field name is fixed and cannot be changed. |

When the recipient receives a rich media push notification, the `didReceiveNotificationRequest:withContentHandler:` callback is triggered, as shown in the following example:

```objectivec
- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {
    // Push extension fields
    NSDictionary *userInfo = request.content.userInfo;
    // Notification content
    UNNotificationContent *content = [request.content mutableCopy];
    contentHandler(content);
}
```

**Parsed content**

```json
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

| Parameter | Description |
| :---------------- | :----------------------------------------------------------- |
| `body` | The displayed content. |
| `badge` | The badge count. |
| `sound` | The notification sound. |
| `mutable-content` | The Apple-required key that enables the system to wake `UNNotificationServiceExtension`. |
| `f` | The message sender ID. |
| `t` | The message recipient ID. |
| `m` | The message ID. |

## API List

| API name | Module/type | Description |
| :--- | :--- | :--- |
| [`initWithText:`](#set-custom-push-fields) | `EMTextMessageBody` | Creates a text message body. |
| [`initWithConversationID:from:to:body:ext:`](#set-custom-push-fields) | `EMChatMessage` | Creates a chat message to send. |
| [`ext`](#set-custom-push-fields) | `EMChatMessage` | Sets message extension fields for custom push parameters. |
| [`chatType`](#set-custom-push-fields) | `EMChatMessage` | Sets the message conversation type. |
| [`sendMessage:progress:completion:`](#set-custom-push-fields) | `IEMChatManager` | Sends a message containing push extension fields. |
| [`setPushTemplate:completion:`](push_template.html#the-message-recipient-uses-a-push-template) | `IEMPushManager` | Sets the offline push template used by the recipient. |

