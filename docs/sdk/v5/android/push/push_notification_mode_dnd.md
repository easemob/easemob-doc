# Set Push Notification Mode and Do Not Disturb Mode

To optimize the user experience when users handle a large number of push notifications, the SDK provides fine-grained configuration of push notification mode and Do Not Disturb mode at both the global and conversation levels. You can control offline push in a unified way based on push notification mode, a specified Do Not Disturb duration, or a daily time period.

## Feature activation

[Push notification mode](push_notification_mode_dnd.html#push-notification-mode) and [Do Not Disturb mode](push_notification_mode_dnd.html#do-not-disturb-mode) are advanced push features. Before using them, you need to enable them for free in [EasyIM Console](https://console.easyim.ai/user/login). **After activation, if you need to disable advanced push features, you must contact the EasyIM business manager, because this operation deletes all configurations related to advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login).
2. Select **App Management** at the top of the page. On the app list page that appears, click the App Key of your test or production app.
3. Select **Value-Added Services > Message Push > Offline Push**.
4. Click **Enable for free**.

![image](/images/android/push/push_advanced_feature_enable.png)

## Push notification mode

The push notification mode `pushRemindType` contains the following three types. This setting applies to the app globally and to specific one-to-one and group chat conversations. **Conversation-level push notification mode settings take precedence over global-level settings**. Conversations for which the push notification mode is not set inherit the global setting by default.

For example, assume that the global push mode is set to `MENTION_ONLY`, while the push mode of a specified conversation is set to `ALL`. You receive all push notifications from that conversation, while for other conversations, you receive push notifications only for messages that mention you.

| Push notification mode | Description |
| :---- | :------------- |
| `ALL` | Receives push notifications for all offline messages. |
| `MENTION_ONLY` | Receives push notifications only for messages that mention the current user. This parameter is usually more suitable for group chat scenarios. If a message needs to mention one or more users, you can pass `"em_at_list":["user1", "user2" ...]` in the message extension field `ext` when sending the message. If everyone is mentioned, pass `"em_at_list":"all"` for this field. |
| `NONE` | Does not receive push notifications for offline messages. |

### Get the push notification mode settings of all conversations

You can call `EMPushManager#syncSilentModeConversationsFromServer` to synchronize the push notification mode settings of all conversations from the server. After synchronization succeeds, the result is stored in the local database. Then you can query the push notification mode of the current conversation through `EMConversation#pushRemindType`.

```java
// Synchronize the push notification mode of conversations.
EMClient.getInstance().pushManager().syncSilentModeConversationsFromServer(new EMCallBack() {
    @Override
    public void onSuccess() {
        EMLog.i(TAG, "syncNoDisturb onSuccess");
    }

    @Override
    public void onError(int code, String error) {
        EMLog.i(TAG, "syncNoDisturb onError code:" + code + " error:" + error);
    }
});

// Query the push notification mode of a conversation.
String conversationId = "pu";
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation!=null) {
    EMPushManager.EMPushRemindType emPushRemindType = conversation.pushRemindType();
    EMLog.i(TAG, "conversationRemindType emPushRemindType:" + emPushRemindType);
}
```

### Set the push notification mode of a specified conversation

Call `EMPushManager#setSilentModeForConversation` on the local device to set the push notification mode of a conversation. The current operation is called back in the multi-device event `EMMultiDeviceListener#onConversationEvent`, and the value of the `event` parameter is `EMMultiDeviceListener#CONVERSATION_MUTE_INFO_CHANGED`.

```java
// Set the push notification mode for the conversation.
String conversationId = "pu";
EMSilentModeParam emSilentModeParam = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE);
emSilentModeParam.setRemindType(EMPushManager.EMPushRemindType.NONE);
EMClient.getInstance().pushManager().setSilentModeForConversation(conversationId, EMConversation.EMConversationType.Chat, emSilentModeParam, new EMValueCallBack<EMSilentModeResult>() {
    @Override
    public void onSuccess(EMSilentModeResult value) {
        EMLog.i(TAG, "conversationRemindType onSuccess value:" + value);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.i(TAG, "conversationRemindType onError error:" + error + " errorMsg:" + errorMsg);
    }
});


// Multi-device event.
EMClient.getInstance().addMultiDeviceListener(new EMMultiDeviceListener() {
    ……

    @Override
    public void onConversationEvent(int event, String conversationId, EMConversation.EMConversationType type) {
        EMLog.i(TAG, "onConversationEvent event:" + event + " conversationId:" + conversationId + " type:" + type);
    }
});

```

### Clear the push notification mode setting of a specified conversation

You can call `clearRemindTypeForConversation` to clear the push notification mode setting of a specified conversation. After it is cleared, this conversation inherits the app setting by default.

```java
EMClient.getInstance().pushManager().clearRemindTypeForConversation(conversationId, conversationType, new EMCallBack(){});
```

## Do Not Disturb mode

After SDK initialization is completed and login succeeds, you can set Do Not Disturb mode for the app globally or for specified one-to-one and group chat conversations. While Do Not Disturb mode is in effect, EasyIM does not send push notifications to offline users within the corresponding scope.

The Android SDK uses `EMSilentModeParam` to configure Do Not Disturb rules and supports the following two modes:

- `SILENT_MODE_DURATION` (one-time Do Not Disturb): Takes effect immediately after being set and automatically restores after expiration. This is suitable for scenarios where users temporarily do not want to be disturbed.
- `SILENT_MODE_INTERVAL` (daily recurring Do Not Disturb): Sets a daily recurring time period, such as from `23:00` to `07:00` the next day. This is suitable for fixed rest periods.

The Do Not Disturb time parameters are described in the following table:

| Rule mode | Configuration method | Type | Description | Scope |
| :--------------------- | :------------------------------------------ | :----------------- | :----------------------------------------------------------- | :----------------------------- |
| `SILENT_MODE_INTERVAL` | `setSilentModeInterval(startTime, endTime)` | `EMSilentModeTime` | A daily recurring Do Not Disturb time period. It uses the 24-hour format and is accurate to the minute. The hour range of `startTime` and `endTime` is `0`-`23`, and the minute range is `0`-`59`.<br/> - **Triggered daily at the specified time**: After being set, Do Not Disturb mode is automatically entered every day during the specified time period.<br/> - **Cross-day support**: If the end time is earlier than the start time, the time period spans days. For example, `10:00`-`08:00` means Do Not Disturb is enabled from `10:00` of the current day to `08:00` of the next day.<br/> - **All-day and disabled**: If the start time is the same as the end time, it is considered all-day Do Not Disturb. When it is set to `00:00`-`00:00`, Do Not Disturb mode is disabled.<br/> - **Single time period limit**: Only one Do Not Disturb time period can be set per day. A new configuration overwrites the old one.<br/> - **Effective time**: The setting takes effect immediately. For example, if `08:00`-`12:00` is set at `11:00` of the current day, it takes effect from `11:00` to `12:00` on that day, and then follows `08:00`-`12:00` every day. | App global only. |
| `SILENT_MODE_DURATION` | `setSilentModeDuration(duration)` | `Int` | One-time Do Not Disturb duration, in minutes. The value range is `0`-`10080` (0 to 7 days). `0` indicates that this parameter is invalid.<br/><br/> - **Valid once**: After this mode is set, timing starts immediately and is not triggered repeatedly by day.<br/> - **Effective example**: If `duration = 240` is set at `08:00`, Do Not Disturb mode is active from `08:00` to `12:00` on that day. | App global or specified one-to-one/group chat conversations. |

**Superposition rules when `SILENT_MODE_INTERVAL` and `SILENT_MODE_DURATION` are both set**

- On the current day, both settings **take effect in combination**, and overlapping time periods are not counted repeatedly.
- Starting from the next day, only the daily recurring Do Not Disturb time period continues to take effect. The one-time Do Not Disturb duration is not triggered repeatedly.

**Example**: Set the daily Do Not Disturb time period to `08:00`-`10:00` at `08:00`, and set `duration = 240` (4 hours) at the same time:

- **Current day**: Do Not Disturb is active from `08:00` to `12:00`.
- **Starting from the next day**: Do Not Disturb is active from `08:00` to `10:00` every day.

**Relationship between push notification mode and Do Not Disturb mode**

Do Not Disturb mode has a higher priority than push notification mode. For example, if the push notification mode of a conversation is set to `ALL`, but the conversation currently matches the Do Not Disturb duration, or the app globally currently matches the Do Not Disturb time period, offline push notifications for this conversation are not received while Do Not Disturb is in effect.

If only one-time Do Not Disturb is set for a conversation and no app-level Do Not Disturb is set, offline push notifications are not sent only for this conversation while Do Not Disturb is in effect. Other conversations still send push notifications according to their own push notification mode or inherited global settings.

:::tip
If you need to send offline push notifications to specified users while Do Not Disturb is in effect, you can set [force push](push_extension.html#force-push).
:::

## Set global push receiving rules

You can call `setSilentModeForAll` to set app-level push notifications, and set the push notification mode and Do Not Disturb mode by specifying fields in `EMSilentModeParam`, as shown in the following example:

```java
// Set the push notification mode to `MENTION_ONLY`.
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE)
                                .setRemindType(EMPushManager.EMPushRemindType.MENTION_ONLY);

// Set the offline push Do Not Disturb duration to 15 minutes.
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_DURATION)
                                .setSilentModeDuration(15);

// Set the offline push Do Not Disturb time period from 8:30 to 15:00.
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_INTERVAL)
                                .setSilentModeInterval(new EMSilentModeTime(8, 30), new EMSilentModeTime(15, 0));

// Set offline push for the app.
EMClient.getInstance().pushManager().setSilentModeForAll(param, new EMValueCallBack<EMSilentModeResult>(){});
```

## Get global push receiving rules

You can call `getSilentModeForAll` to get app-level push notification settings, as shown in the following example:

```java
EMClient.getInstance().pushManager().getSilentModeForAll(new EMValueCallBack<EMSilentModeResult>(){
    @Override
    public void onSuccess(EMSilentModeResult result) {
        // Get the app push notification mode.
        EMPushManager.EMPushRemindType remindType = result.getRemindType();

        // Get the Unix timestamp when app offline push Do Not Disturb expires.
        long timestamp = result.getExpireTimestamp();

        // Get the start time of the app offline push Do Not Disturb time period.
        EMSilentModeTime startTime = result.getSilentModeStartTime();
        startTime.getHour();// The hour in the start time of the Do Not Disturb time period.
        startTime.getMinute();// The minute in the start time of the Do Not Disturb time period.

        // Get the end time of the app offline push Do Not Disturb time period.
        EMSilentModeTime endTime = result.getSilentModeEndTime();
    }

    @Override
    public void onError(int error, String errorMsg) {}
});
```

## Set push receiving rules for a specified conversation

You can call `setSilentModeForConversation` to set push notifications for a specified conversation, and set the push notification mode and Do Not Disturb mode by specifying fields in `EMSilentModeParam`, as shown in the following example:

```java
// Set the push notification mode to `MENTION_ONLY`.
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.REMIND_TYPE)
                                .setRemindType(EMPushManager.EMPushRemindType.MENTION_ONLY);

// Set the offline push Do Not Disturb duration to 15 minutes.
EMSilentModeParam param = new EMSilentModeParam(EMSilentModeParam.EMSilentModeParamType.SILENT_MODE_DURATION)
                                .setSilentModeDuration(15);
// Set the offline push Do Not Disturb mode for the conversation. Setting a conversation Do Not Disturb time period is not supported currently.
EMClient.getInstance().pushManager().setSilentModeForConversation(conversationId, conversationType, param, new EMValueCallBack<EMSilentModeResult>(){});
```

## Get push receiving rules for a specified conversation

You can call `getSilentModeForConversation` to get push notification settings for a specified conversation, as shown in the following example:

```java
EMClient.getInstance().pushManager().getSilentModeForConversation(conversationId, conversationType, new EMValueCallBack<EMSilentModeResult>(){
    @Override
    public void onSuccess(EMSilentModeResult result) {
        // Get whether the conversation has a push notification mode set.
        boolean enable = result.isConversationRemindTypeEnabled();
        // Check whether the conversation has a push notification mode set.
        if(enable){
            // Get the push notification mode of the conversation.
            EMPushManager.EMPushRemindType remindType = result.getRemindType();
        }

        // Get the Unix timestamp when conversation offline push Do Not Disturb expires.
        long timestamp = result.getExpireTimestamp();
    }

    @Override
    public void onError(int error, String errorMsg) {}
});
```

## Get push receiving rules for conversations in batches

1. You can get settings for up to 20 conversations in each call.

2. If a conversation inherits the app settings or its push notification settings have expired, the returned dictionary does not contain this conversation.

You can call `getSilentModeForConversations` to get push notification settings for multiple conversations, as shown in the following example:

```java
EMClient.getInstance().pushManager().getSilentModeForConversations(conversationList, new EMValueCallBack<Map<String, EMSilentModeResult>>(){
    @Override
    public void onSuccess(Map<String, EMSilentModeResult> value) {}

    @Override
    public void onError(int error, String errorMsg) {}
});
```

## API list

| API name | Module/class | Description |
| :--- | :--- | :--- |
| [`syncSilentModeConversationsFromServer`](#get-the-push-notification-mode-settings-of-all-conversations) | `EMPushManager` | Asynchronously synchronizes conversation push notification modes saved on the server. |
| [`setSilentModeForConversation`](#set-the-push-notification-mode-of-a-specified-conversation) | `EMPushManager` | Sets the push notification mode of a specified conversation. |
| [`getSilentModeForConversation`](#get-push-receiving-rules-for-a-specified-conversation) | `EMPushManager` | Gets push receiving rules for a specified conversation. |
| [`setSilentModeForAll`](#set-global-push-receiving-rules) | `EMPushManager` | Sets global push receiving rules. |
| [`getSilentModeForAll`](#get-global-push-receiving-rules) | `EMPushManager` | Gets global push receiving rules. |
| [`getSilentModeForConversations`](#get-push-receiving-rules-for-conversations-in-batches) | `EMPushManager` | Gets push receiving rules for conversations in batches. |
| [`clearRemindTypeForConversation`](#clear-the-push-notification-mode-setting-of-a-specified-conversation) | `EMPushManager` | Clears the push notification mode setting of a specified conversation. |
