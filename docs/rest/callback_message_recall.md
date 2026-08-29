# Message Recall Webhook Events

## Feature overview

After a message is recalled successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain the recalled message and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

1. A [user recalls a message on the client](/sdk/v5/android/message_recall.html).
2. A RESTful API is called to recall a [single message](/rest/message_recall_single.html) or [recall messages in batches](/rest/message_recall_batch.html).

## Webhook request

### Request example

```json
{
    "chat_type":"recall",
    "callId":"XXXX#XXXX_966475585536657404",
    "security":"ea7a867314fb0e0833d5f4f169eb4f8d",
    "payload":{
        "ext":{},
        "ack_message_id":"966475220900644860",
        "bodies":[]
    },
    "host":"******",
    "appkey":"orgname#appname",
    "from":"tst",
    "recall_id":"966475220900644860",
    "to":"170908972023810",
    "eventType":"chat",
    "msg_id":"966475585536657404",
    "timestamp":1642589932646
}
```

### Request fields

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request, in the format “App Key_message ID of the recall event”. |
| `eventType`       | String   | `chat`: Uplink message; `chat_offline`: Offline message.                   |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |
| `chat_type`       | String   | `recall`, indicating message recall.                                     |
| `group_id`        | String   | The chat group or chat room where the webhook message occurs. This field applies only to group chats and chat rooms. |
| `from`            | String   | Message sender.                                               |
| `to`              | String   | Message recipient.                                               |
| `recall_id`       | String   | ID of the message to recall.                                            |
| `msg_id`          | String   | Message ID of the recall event, which is the same as the `msg_id` used when the message was sent.          |
| `payload`         | object   | For a message recall, the `bodies` and `ext` fields are empty.<br/> `ack_message_id` indicates the original message ID. |
| `securityVersion` | String   | Security verification version, currently 1.0.0. Ignore this field. It will be configured in the EasyIM Console in the future. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                           |
| `host`            | String   | Server name.                                                 |
