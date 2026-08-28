# Offline Push Webhook Events

## Feature overview

After EasyIM sends an offline push notification through a third-party offline push service, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain information about the push notification and whether it was delivered successfully, and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A [message is sent](/document/android/message_send.html) in a one-to-one or group chat on the client while the recipient is offline.
- A message is sent through the REST API in a [one-to-one chat](/rest/message_single.html) or [group chat](/rest/message_group.html) while the recipient is offline.
- A message is sent through the console in a [one-to-one chat](/product/console/operation_user.html#send-a-rest-message) or [group chat](/value-added/moderation/moderation_manual_review.html#chat-group-moderation-management) while the recipient is offline.

## Webhook request

### Successful push webhook request

```json
{
    "callId": "XXXX#XXXX_1029XXXX29922197880",
    "appkey":"XXXX#XXXX",
    "channel":"APNS",
    "chat_type":"chat",
    "data":{
        "accepted":true,
        "apnsId":"7d988394-XXXX-XXXX-2b9f-e7a13a92fb96",
        "pushNotification":{
            "expiration":1656484422884,
            "payload":"{\"t\":\"wzy_apns\",\"aps\":{\"badge\":1,\"alert\":{\"body\":\"Please click to view\",\"title\":\"You have a new message\"},\"sound\":\"ring.caf\"},\"e\":{\"em_push_sound\":\"ring.caf\"},\"f\":\"wzy_vivo\",\"m\":\"626473521765161477\"}",
            "priority":"IMMEDIATE",
            "token":"XXXX",
            "topic":"com.easemob.XXXX.easeim"
        }
    },
    "device_id":"bcf1eb81-XXXX-XXXX-bb9f-284e9943a045",
    "device_token":"XXXX",
    "msg_id":"1029XXXX29922197880",
    "notifier_name":"EaseIM_APNS_Product",
    "status":"success",
    "step":"push",
    "target":"wzy_XXXX",
    "timestamp":1656398024142
}
```

### Request fields

| Field   | Always present | Type   | Description          |
| :----- | :------- | :---------- | :----------- |
| `callId`    | String   | Unique identifier of the webhook request, in the format `App Key_message ID of the new offline message`. |
| `appkey`        | Yes               | String | Unique app identifier consisting of Orgname and Appname.      |
| `channel`       | No               | String | Push channel: APNS, ANDROID, XIAOMI, HUAWEI, MEIZU, OPPO, or VIVO. This field is associated with the push certificate platform.   |
| `chat_type`     | Yes               | String | Chat type: `chat` for a one-to-one chat and `groupchat` for a group chat.     |
| `data`          | No    | Object | Third-party response content.   |
| `device_id`     | No   | String | Device ID of the offline push notification recipient.   |
| `device_token`  | No     | String | Third-party push identifier. |
| `msg_id`        | Yes               | String | Message ID of the offline message.  |
| `notifier_name` |  No               |  String  | Push certificate name.                   |
| `status`   | Yes    | String | Push status:<br/> - `success`: Push succeeded;<br/> - `fail`: Push failed because of a third-party failure or unmet push conditions;<br/> - `error`: Push exception. |
| `step`   | Yes   | String | Fixed string `push`.  |
| `target`| Yes   | String | User ID of the offline push notification recipient. |
| `timestamp`     | Yes    | String | Timestamp when the event is sent.           |
| `e_message`     | No               | String | Exception information. This field is provided only when an error occurs.|
| `from`          | Yes               | String | User ID of the sender.  |
| `group_id`      | No               | String | Chat group ID. This field appears only for a group chat message. |
| `payload`       | Yes    | Object | Message payload containing the offline message payload.  |

### Common failure examples

1. No push device is bound:

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029172947949980024",
    "security": "79e87c892ec0159ac9175f295d587a51",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no push binding",
    "msg_id": "1029172947949980024",
    "status": "fail",
    "target": "test1",
    "timestamp": 1657187799974
}
```

2. The offline push notification recipient does not exist:

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029XXXX29922197880",
    "security": "c2d1352efc3f0b9bbf7e447c54ccb11d",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no user exist",
    "msg_id": "1029174929922197880",
    "status": "fail",
    "target": "test11",
    "timestamp": 1657188261464
}
```

3. The certificate does not exist:

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029188050686577016",
    "security": "baf6ff663587e705efd39d91e995c306",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no notifier exist",
    "notifier_name": "102920687",
    "msg_id": "1029188050686577016",
    "status": "fail",
    "target": "test1",
    "timestamp": 1657191316366
}
```

4. Push certificate authentication fails:

```json
{
    "callId": "XXXX#XXXX_1029518239182358904",
    "data": {
    "result": 10206,
    "desc": "Incorrect sign"
    },
    "device_id": "0f581e52-XXXX-XXXX-8774-f804a49571f5",
    "channel": "VIVOPUSH",
    "target": "Test4",
    "chat_type": "chat",
    "security": "afa9bd9d372XXXX5bedde37e275e",
    "device_token": "160403XXXX055106740XXXX",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "get push token fail",
    "notifier_name": "104510674#XXXX30bc2c54a6d078bc69a8b6d7807d",
    "msg_id": "1029518239182358904",
    "status": "fail",
    "timestamp": 1657268194889
}
```

### Push failure reasons

If a push fails, the `detail` field in the webhook request returns the reason, as described in the following table.

| Offline push failure reason    | Description          |
| :------------------- | :----- |
| `no push binding`           | No push device is bound.       |
| `illegal binding`           | Invalid binding information. This means that the certificate name or `deviceToken` is an empty string. This generally does not occur, but may exist in historical data. |
| `no user exist`             | The recipient does not exist.       |
| `notifier out of limit`     | The certificate has exceeded its push limit.     |
| `notifier disabled`         | The certificate is disabled after being banned once.  |
| `notifier is ban`           | The certificate is banned.        |
| `no notifier exist`         | The certificate does not exist.     |
| `invalid notifier`          | The certificate is invalid.        |
| `message ignore push`       | The message ignores push notifications, as specified by the offline extension field `em_ignore_notification=true`. |
| `invalid message`           | Invalid message. This error generally does not occur in protocol content.                     |
| `expire message`            | Expired message. A message whose push has been delayed for more than one day is no longer pushed.                 |
| `user ignore push`          | The user has actively enabled Do Not Disturb (DND).      |
| `ignore push device id`     | Push to the user's device is ignored because the extension limits which devices receive or do not receive push notifications.    |
| `invalid VOIP notification` | Invalid APNs VoIP push.   |
| `get push token fail`       | Failed to obtain the push token.       |
| `push yet but fail `        | The push was sent but returned a failure.       |
