# Set Push Notification Mode and DND

To optimize the user experience when users handle a large number of push notifications, the SDK provides fine-grained configuration of push notification mode and Do Not Disturb (DND) mode at both the global and conversation levels. You can control offline push in a unified way based on push notification mode, a specified DND duration, or a daily time period.

## Feature activation

[Push notification mode](push_notification_mode_dnd.html#push-notification-mode) and [DND mode](push_notification_mode_dnd.html#dnd) are advanced push features. Before using them, you need to enable them for free in [EasyIM Console](https://console.easyim.ai/user/login). **After activation, if you need to disable advanced push features, you must contact the EasyIM business manager, because this operation deletes all configurations related to advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). 
2. On the **Applications** page, click the App Key of the app of the development or production environment.
3. Select **Push** in the left navigation pane and click the **Offline Push** tab.
4. Click **Enable for free**.

![image](/images/android/push/push_advanced_feature_enable.png)

## Push notification mode

The push notification mode `disturbType` contains the following three types. This setting applies to the app globally and to specific one-to-one and group chat conversations. **Conversation-level push notification mode settings take precedence over global-level settings**. Conversations for which the push notification mode is not set inherit the global setting by default.

For example, assume that the global push mode is set to `EMPushRemindTypeMentionOnly`, while the push mode of a specified conversation is set to `EMPushRemindTypeAll`. You receive all push notifications from that conversation, while for other conversations, you receive push notifications only for messages that mention you.

| Push notification mode | Description |
| :---- | :------------- |
| `EMPushRemindTypeAll` | Receives push notifications for all offline messages. |
| `EMPushRemindTypeMentionOnly` | Receives push notifications only for messages that mention the current user. This parameter is usually more suitable for group chat scenarios. If a message needs to mention one or more users, you can pass `"em_at_list":["user1", "user2" ...]` in the message extension field `ext` when sending the message. If everyone is mentioned, pass `"em_at_list":"all"` for this field. |
| `EMPushRemindTypeNone` | Does not receive push notifications for offline messages. |

### Retrieve global push notification mode settings

You can call `syncSilentModeConversationsFromServerCompletion:` to synchronize the push notification mode settings of all conversations from the server. After synchronization succeeds, the result is stored in the local database. Then you can query the push notification mode of the current conversation through `EMConversation#disturbType`.

```swift
EMClient.shared().pushManager?.syncSilentModeConversations(fromServerCompletion: { err in
    if err == nil {
        if let conversations = EMClient.shared().chatManager?.getAllConversations() {
            for conversation in conversations {
                let disturbType = conversation.disturbType
                }
        }
    }
})

```

### Set the push notification mode of a conversation

Call `EMPushManager#setSilentModeForConversation` on the local device to set the push notification mode of a conversation. The current operation is called back in the multi-device event `EMMultiDeviceListener#onConversationEvent`, and the value of the `event` parameter is `EMMultiDeviceListener#CONVERSATION_MUTE_INFO_CHANGED`.

```swift
// Set the push notification mode for a conversation.
let param = EMSilentModeParam(paramType: .remindType)
        param.remindType = .none
        EMClient.shared().pushManager?.setSilentModeForConversation("conversationId", conversationType: .chat, params: param, completion: { result, err in
    if err == nil {
        print("setSilentModeForConversation success")
    }
})


// Listen for multi-device events.
EMClient.shared().addMultiDevices(delegate: self, queue: nil)

// Receive the multi-device event callback.
extension ViewController: EMMultiDevicesDelegate {
    func multiDevicesConversationEvent(_ event: EMMultiDevicesEvent, conversationId: String, conversationType: EMConversationType) {
        switch event {
        case .conversationMuteInfoChanged:
            print("multiDevicesConversationEvent mute info changed")
        default:
            break
        }
    }
}
```

### Clear the push notification mode setting of a conversation

You can call `clearRemindTypeForConversation` to clear the push notification mode setting of a conversation. After it is cleared, this conversation inherits the app setting by default.

```objectivec
// Clear the push notification mode setting for the specified conversation. After it is cleared, the conversation inherits the app setting.
// Asynchronous method.
EMConversationType conversationType = EMConversationTypeGroupChat;
[[EMClient sharedClient].pushManager clearRemindTypeForConversation:@"conversationId" conversationType:conversationType completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"clearRemindTypeForConversation error---%@",aError.errorDescription);
    }
}];
```

## DND

After SDK initialization is completed and login succeeds, you can set the DND mode for the app globally or for specified one-to-one and group chat conversations. While the DND mode is in effect, EasyIM does not send push notifications to offline users within the corresponding scope.

The Android SDK uses `EMSilentModeParam` to configure DND rules and supports the following two modes:

- `EMSilentModeParamTypeDuration` (one-time DND): Takes effect immediately after being set and automatically restores after expiration. This is suitable for scenarios where users temporarily do not want to be disturbed.
- `EMSilentModeParamTypeInterval` (daily recurring DND): Sets a daily recurring time period, such as from `23:00` to `07:00` the next day. This is suitable for fixed rest periods.

The DND time parameters are described in the following table:

| Rule mode | Configuration method | Type | Description | Scope |
| :--------------------- | :------------------------------------------ | :----------------- | :----------------------------------------------------------- | :----------------------------- |
| `EMSilentModeParamTypeInterval` | Set `silentModeStartTime` and `silentModeEndTime` | `EMSilentModeTime` | A daily recurring DND time period. It uses the 24-hour format and is accurate to the minute. The hour range of `startTime` and `endTime` is `0`-`23`, and the minute range is `0`-`59`.<br/> - **Triggered daily at the specified time**: After being set, DND is automatically entered every day during the specified time period.<br/> - **Cross-day support**: If the end time is earlier than the start time, the time period spans days. For example, `10:00`-`08:00` means DND is enabled from `10:00` of the current day to `08:00` of the next day.<br/> - **All-day and disabled**: If the start time is the same as the end time, it is considered all-day DND. When it is set to `00:00`-`00:00`, DND is disabled.<br/> - **Single time period limit**: Only one DND time period can be set per day. A new configuration overwrites the old one.<br/> - **Effective time**: The setting takes effect immediately. For example, if `08:00`-`12:00` is set at `11:00` of the current day, it takes effect from `11:00` to `12:00` on that day, and then follows `08:00`-`12:00` every day. | App global only. |
| `EMSilentModeParamTypeDuration` | `Set `silentModeDuration`` | `Int` | One-time DND duration, in minutes. The value range is `0`-`10080` (0 to 7 days). `0` indicates that this parameter is invalid.<br/><br/> - **Valid once**: After this mode is set, timing starts immediately and is not triggered repeatedly by day.<br/> - **Effective example**: If `duration = 240` is set at `08:00`, DND is active from `08:00` to `12:00` on that day. | App global or specified one-to-one/group chat conversations. |

**Superposition rules when `EMSilentModeParamTypeInterval` and `EMSilentModeParamTypeDuration` are both set**

- On the current day, both settings **take effect in combination**, and overlapping time periods are not counted repeatedly.
- Starting from the next day, only the daily recurring DND time period continues to take effect. The one-time DND duration is not triggered repeatedly.

**Example**: Set the daily DND time period to `08:00`-`10:00` at `08:00`, and set `duration = 240` (4 hours) at the same time:

- **Current day**: DND is active from `08:00` to `12:00`.
- **Starting from the next day**: DND is active from `08:00` to `10:00` every day.

**Relationship between push notification mode and DND mode**

DND has a higher priority than push notification mode. For example, if the push notification mode of a conversation is set to `EMPushRemindTypeAll`, but the conversation currently matches the DND duration, or the app globally currently matches the DND time period, offline push notifications for this conversation are not received while DND is in effect.

If only one-time DND is set for a conversation and no app-level DND is set, offline push notifications are not sent only for this conversation while DND is in effect. Other conversations still send push notifications according to their own push notification mode or inherited global settings.

:::tip
If you need to send offline push notifications to specified users while DND is in effect, you can set [force push](push_extension.html#force-push).
:::

## Set global notification receiving rules

You can call `setSilentModeForAll` to set app-level push notifications, and set the push notification mode and DND mode by specifying fields in `EMSilentModeParam`, as shown in the following example:

```objectivec
// Set the push notification mode to `EMPushRemindTypeMentionOnly`.
EMSilentModeParam *remindTypeParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeRemindType];
remindTypeParam.remindType = EMPushRemindTypeMentionOnly;
// Set the app-level DND mode for offline push notifications.
// Asynchronous method.
[[EMClient sharedClient].pushManager setSilentModeForAll:remindTypeParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];

// Set the DND duration for offline push notifications to 15 minutes.
EMSilentModeParam *durationParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeDuration];
durationParam.silentModeDuration = 15;
[[EMClient sharedClient].pushManager setSilentModeForAll:durationParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];

// Set the DND period for offline push notifications from 08:30 to 15:00.
EMSilentModeParam *intervalParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeInterval];
intervalParam.silentModeStartTime = [[EMSilentModeTime alloc] initWithHours:8 minutes:30];
intervalParam.silentModeEndTime = [[EMSilentModeTime alloc] initWithHours:15 minutes:0];
[[EMClient sharedClient].pushManager setSilentModeForAll:intervalParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForAll error---%@", aError.errorDescription);
    }
}];
```

## Get global notification receiving rules

You can call `getSilentModeForAll` to get app-level push notification settings, as shown in the following example:

```objectivec
// Asynchronous method.
[[EMClient sharedClient].pushManager getSilentModeForAllWithCompletion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (!aError) {
        // Get the app-level push notification mode.
        EMPushRemindType remindType = aResult.remindType;
        // Get the Unix timestamp when the app-level DND setting for offline push notifications expires.
        NSTimeInterval ex = aResult.expireTimestamp;
        // Get the start time of the app-level DND period for offline push notifications.
        EMSilentModeTime *startTime = aResult.silentModeStartTime;
        EMSilentModeTime *endTime = aResult.silentModeEndTime;
    }else{
        NSLog(@"getSilentModeForAll error---%@",aError.errorDescription);
    }
}];
```

## Set notification receiving rules for a conversation

You can call `setSilentModeForConversation` to set push notifications for a specified conversation, and set the push notification mode and DND mode by specifying fields in `EMSilentModeParam`, as shown in the following example:

```objectivec
EMConversationType conversationType = EMConversationTypeGroupChat;

// Set the push notification mode to `EMPushRemindTypeMentionOnly`.
EMSilentModeParam *remindTypeParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeRemindType];
remindTypeParam.remindType = EMPushRemindTypeMentionOnly;
// Asynchronous method.
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:remindTypeParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@", aError.errorDescription);
    }
}];

// Set the DND duration for offline push notifications to 15 minutes.
EMSilentModeParam *durationParam = [[EMSilentModeParam alloc] initWithParamType:EMSilentModeParamTypeDuration];
durationParam.silentModeDuration = 15;
[[EMClient sharedClient].pushManager setSilentModeForConversation:@"conversationId" conversationType:conversationType params:durationParam completion:^(EMSilentModeResult *aResult, EMError *aError) {
    if (aError) {
        NSLog(@"setSilentModeForConversation error---%@", aError.errorDescription);
    }
}];
```

## Retrieve notification receiving rules for a conversation

You can call `getSilentModeForConversation` to retrieve push notification settings for a specified conversation, as shown in the following example:

```objectivec
    [EMClient.sharedClient.pushManager getSilentModeForConversation:@"conversationId" conversationType:EMConversationTypeGroupChat completion:^(EMSilentModeResult * _Nullable aResult, EMError * _Nullable aError) {
            if (aError == nil) {
                // Get the push notification mode of the conversation.
                EMPushRemindType remindType = aResult.remindType;
                // Get the Unix timestamp when the conversation-level DND setting for offline push notifications expires.
                NSTimeInterval ex = aResult.expireTimestamp;
            }
    }];
```

## Retrieve notification receiving rules for conversations in bulk

1. You can get settings for up to 20 conversations in each call.

2. If a conversation inherits the app settings or its push notification settings have expired, the returned dictionary does not contain this conversation.

You can call `getSilentModeForConversations` to get push notification settings for multiple conversations, as shown in the following example:

```objectivec
NSArray *conversations = @[conversation1,conversation2];
// Asynchronous method.
    [[EMClient sharedClient].pushManager getSilentModeForConversations:conversations completion:^(NSDictionary<NSString*,EMSilentModeResult*>*aResult, EMError *aError) {
        if (aError) {
            NSLog(@"getSilentModeForConversations error---%@",aError.errorDescription);
        }
    }];
```





## API List

| API name | Module/type | Description |
| :--- | :--- | :--- |
| [`syncSilentModeConversationsFromServerCompletion:`](#retrieve-global-push-notification-mode-settings) | `IEMPushManager` | Synchronizes push notification mode settings for all conversations from the server. |
| [`setSilentModeForConversation:conversationType:params:completion:`](#set-the-push-notification-mode-of-a-conversation) | `IEMPushManager` | Sets the push notification mode or DND rules for a conversation. |
| [`clearRemindTypeForConversation:conversationType:completion:`](#clear-the-push-notification-mode-setting-of-a-conversation) | `IEMPushManager` | Clears the push notification mode setting of a conversation. |
| [`setSilentModeForAll:completion:`](#set-global-notification-receiving-rules) | `IEMPushManager` | Sets global push notification mode and DND rules. |
| [`getSilentModeForAllWithCompletion:`](#get-global-notification-receiving-rules) | `IEMPushManager` | Retrieves global push notification mode and DND rules. |
| [`getSilentModeForConversation:conversationType:completion:`](#retrieve-notification-receiving-rules-for-a-conversation) | `IEMPushManager` | Retrieves push notification mode and DND rules for a conversation. |
| [`getSilentModeForConversations:completion:`](#retrieve-notification-receiving-rules-for-conversations-in-bulk) | `IEMPushManager` | Retrieves push notification mode and DND rules for multiple conversations. |
