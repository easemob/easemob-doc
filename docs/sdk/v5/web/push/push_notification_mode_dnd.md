# Configure Push Notification Modes and DND

To improve the user experience when handling large numbers of push notifications, the SDK provides fine-grained configuration of push notification modes and Do Not Disturb (DND) at the global and conversation levels through `client.pushManager`. You can centrally control mobile offline push based on the push notification mode, a specified duration, or a daily period.

## Feature activation

[Push notification modes](push_notification_mode_dnd.html#push-notification-modes) and [DND](push_notification_mode_dnd.html#do-not-disturb) are advanced push features. Before using them, enable them for free in the [EasyIM Console](https://console.easyim.ai/user/login). **After activation, to disable advanced push features, you must contact the EasyIM business manager because this operation deletes all configurations related to the advanced features.**

1. Log in to [EasyIM Console](https://console.easyim.ai/user/login). 
2. On the **Applications** page, click the App Key of the app of the development or production environment.
3. Select **Push** in the left navigation pane and click the **Offline Push** tab.
4. Click **Enable for free**.

![image](/images/android/push/push_advanced_feature_enable.png)

## Push notification modes

The following table describes the three push notification modes. These settings apply globally to the app and to individual one-to-one and group conversations. **A conversation-level push notification mode takes precedence over the global setting.** A conversation for which no mode is configured inherits the global setting by default.

For example, suppose the global push notification mode is `AT`, while the mode for a specified conversation is `ALL`. You receive all push notifications from that conversation, while for other conversations, you receive push notifications only for messages that mention you.

| Push notification mode | Description            | 
| :---- | :------------- |
| `ALL`          | Receive push notifications for all offline messages.                                 |
| `AT`           | Receive push notifications only for messages that mention the current user. This value is generally more suitable for group chats. To mention one or more users in a message, pass "em_at_list":["user1", "user2" ...] through the message extension field ext when sending it. To mention everyone, pass "em_at_list":"all" to this field. |
| `NONE`        | Do not receive push notifications for offline messages.                                   |

## DND

After initializing and successfully logging in to the SDK, configure DND globally at the app level or for a specified conversation. While DND is in effect, EasyIM does not send push notifications to offline users in the corresponding scope.

DND supports the following rule types:

- `DURATION` (one-time DND): Takes effect immediately after configuration and automatically ends when it expires. It is suitable when the user temporarily does not want to be disturbed.
- `INTERVAL` (daily recurring DND): Configures a period that recurs daily, such as `23:00` to `07:00` the following day. It is suitable for a regular rest period.

The following table describes the DND time parameters:

| Rule mode | Parameter | Type | Description | Scope |
| :--- | :--- | :--- | :--- | :--- |
| `INTERVAL` | `startTime` and `endTime` | Object | Daily recurring DND period, using the 24-hour clock with minute-level precision in the format `{ hours, minutes }`. Value ranges: 0–23 for hours and 0–59 for minutes.<br/> - **Daily scheduled trigger**: After configuration, DND starts automatically during the specified period each day.<br/> - **Cross-day support**: If the end time is earlier than the start time, the period crosses midnight and continues from the start time on the current day to the end time on the next day. For example, 10:00–8:00 means that DND applies from 10:00 on the current day to 8:00 on the next day.<br/> - **All day and disable**: If the start and end times are the same, DND applies all day. Set 0:00–0:00 to disable DND.<br/> - **Single-period limit**: Only one daily DND period is supported. A new configuration overwrites the old configuration.<br/> - **Effective time**: The configuration takes effect immediately. For example, if 8:00–12:00 is configured at 11:00, it takes effect from 11:00 to 12:00 that day and then applies from 8:00 to 12:00 each day. | App-wide only. |
| `DURATION` | `duration` | Int | One-time DND duration in minutes. The value range is `0`–`10080`, or 0 to 7 days, where `0` means that the parameter has no effect.<br/> - **Effective once**: Unlike a daily recurring DND period, this parameter applies once and begins counting down immediately after configuration.<br/> - **Example**: If `duration = 240` (4 hours) is configured at 8:00 AM, the app is in DND from 8:00 AM to 12:00 PM that day. | App-wide or for a specified one-to-one or group conversation. |

**Combined behavior when `INTERVAL` and `DURATION` are both configured**

- Both apply on the current day, and overlapping time is not counted twice.
- Starting the next day, only the DND period recurs daily. The DND duration is not triggered again.

**Example**: At 8:00 AM, set `startTime/endTime` to 8:00–10:00 and `duration = 240` (4 hours). The result is:

- **Current day**: DND applies from 8:00 AM to 12:00 PM. The period setting covers 8:00–10:00, and the duration setting covers 10:00–12:00.
- **Starting the next day**: DND applies from 8:00 AM to 10:00 AM each day. Only the period setting applies.

**Relationship between push notification modes and DND**

DND has a higher priority than the push notification mode. For example, if a conversation's push notification mode is `ALL`, but the conversation is currently within a DND period or duration, you still do not receive offline push notifications for the conversation while DND is in effect.

If one-time DND is configured only for a conversation and DND is not configured globally for the app, offline push notifications are not sent for that conversation while DND is in effect. Other conversations continue sending push notifications according to their own push notification modes or the inherited global setting.

## Set global notification receiving rules

Call `client.pushManager.setGlobalSilentMode` to set global push notification receiving rules, and specify the rule type through `rule.mode`:

- `REMIND_TYPE`: Sets the push notification mode. Possible values are `ALL`, `AT`, and `NONE`.
- `DURATION`: Sets a one-time DND duration.
- `INTERVAL`: Sets a daily recurring DND period.

```typescript
await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'REMIND_TYPE',
    remindType: 'ALL', // Can be set to `ALL`, `AT`, or `NONE`.
  },
});

await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'DURATION',
    duration: 7200, // One-time DND duration.
  },
});

await client.pushManager.setGlobalSilentMode({
  rule: {
    mode: 'INTERVAL', // Daily recurring DND period
    startTime: {
      hours: 8,
      minutes: 0,
    },
    endTime: {
      hours: 12,
      minutes: 0,
    },
  },
});
```

## Retrieve global notification receiving rules

Call `client.pushManager.getGlobalSilentMode` to retrieve the global push notification receiving settings, as shown in the following example:

```typescript
const result = await client.pushManager.getGlobalSilentMode();
```

## Retrieve the list of conversations with a configured push notification mode

Call `client.pushManager.getConversationListByRemindType` to retrieve the list of conversations with a configured push notification mode.

[Push notification modes](#push-notification-modes) include the following three types:
- **ALL**: Receive push notifications for all offline messages.
- **AT**: Receive push notifications only for messages that mention the current user.
- **NONE**: Do not receive push notifications for offline messages.

In the SDK, this API uses pagination to filter the local conversation cache for conversations with a configured push notification mode. The SDK locally generates and returns the pagination cursor.

```typescript
const result = await client.pushManager.getConversationListByRemindType({
  // Number of conversations retrieved per page. The value range is [1,100], and the default is 10.
  pageSize: 10,
  // Pagination cursor. For the first request, omit it or pass `null` / `''` at runtime. For subsequent requests, pass the `cursor` from the previous result. If the returned `cursor` is empty, the last page has been reached. 
  cursor: '',
});
```

## Clear the push notification mode for a specified conversation

Call `client.pushManager.clearConversationRemindType` to clear the push notification mode for a specified conversation. After it is cleared, the conversation inherits the global setting again by default.

Example code:

```typescript
const result = await client.pushManager.clearConversationRemindType({
  conversationId: '12345', // Conversation ID: peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationType: 'groupChat', // Conversation type: singleChat (one-to-one chat), groupChat (group chat), or chatRoom (chat room).
});
```

## Set push-receiving rules for a specified conversation

Call `client.pushManager.setConversationSilentMode` to set the push notification receiving rules for a specified conversation, including the push notification mode, DND duration, or DND period, as shown in the following example.

The SDK currently supports only `singleChat` and `groupChat` conversations, not `chatRoom`.

```typescript
// Set the push notification mode for a conversation
await client.pushManager.setConversationSilentMode({
  conversationId: 'test', // Conversation ID: peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationType: 'singleChat', // Conversation type: singleChat (one-to-one chat), groupChat (group chat), or chatRoom (chat room).
  rule: {
    mode: 'REMIND_TYPE', // Push notification mode.
    remindType: 'ALL', // Can be set to `ALL`, `AT`, or `NONE`.
  },
});
// Set DND for a conversation
await client.pushManager.setConversationSilentMode({
  conversationId: '12345567',
  conversationType: 'groupChat',
  rule: {
    mode: 'DURATION', // DND duration.
    duration: 7200, // DND duration in milliseconds.
  },
});

await client.pushManager.setConversationSilentMode({
  conversationId: '12345',
  conversationType: 'groupChat',
  rule: {
    mode: 'INTERVAL',
    startTime: {
      hours: 23,
      minutes: 0,
    },
    endTime: {
      hours: 7,
      minutes: 30,
    },
  },
});
```

## Retrieve notification receiving rules for a specified conversation

Call `client.pushManager.getConversationSilentMode` to retrieve the push notification receiving settings for a specified conversation, as shown in the following example:

```typescript
const result = await client.pushManager.getConversationSilentMode({
  conversationId: 'test', // Conversation ID: peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationType: 'singleChat', // Conversation type: singleChat (one-to-one chat), groupChat (group chat), or chatRoom (chat room).
});
```

## Retrieve notification receiving rules for conversations in bulk

Call `client.pushManager.getConversationSilentModes` to retrieve the push notification receiving rules for multiple conversations in bulk.

Note the following when using this API:

1. You can query up to 20 conversations per call.
2. The result contains the push-notification receiving rule for each conversation in the input conversation list. If no individual rule is configured for a conversation, the global push-notification receiving rule is returned.

Example code:

```typescript
const result = await client.pushManager.getConversationSilentModes({
  conversationList: [
    {
      conversationId: 'test',  // Conversation ID: peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
      conversationType: 'singleChat',  // Conversation type: singleChat (one-to-one chat), groupChat (group chat), or chatRoom (chat room).
    },
    {
      conversationId: '1234',
      conversationType: 'groupChat',
    },
  ],
});
```

## API List

| API name | Module/type | Description |
| :--- | :--- | :--- |
| [`setGlobalSilentMode`](#set-global-notification-receiving-rules) | `client.pushManager` | Sets global push notification and DND rules. |
| [`getGlobalSilentMode`](#retrieve-global-notification-receiving-rules) | `client.pushManager` | Retrieves global push notification and DND rules. |
| [`getConversationListByRemindType`](#retrieve-the-list-of-conversations-with-a-configured-push-notification-mode) | `client.pushManager` | Retrieves conversations with an explicitly configured push notification mode. |
| [`clearConversationRemindType`](#clear-the-push-notification-mode-for-a-specified-conversation) | `client.pushManager` | Clears a conversation's push notification mode. |
| [`setConversationSilentMode`](#set-push-receiving-rules-for-a-specified-conversation) | `client.pushManager` | Sets push notification and DND rules for a conversation. |
| [`getConversationSilentMode`](#retrieve-notification-receiving-rules-for-a-specified-conversation) | `client.pushManager` | Retrieves push notification and DND rules for a conversation. |
| [`getConversationSilentModes`](#retrieve-notification-receiving-rules-for-conversations-in-bulk) | `client.pushManager` | Retrieves push notification and DND rules for multiple conversations. |
