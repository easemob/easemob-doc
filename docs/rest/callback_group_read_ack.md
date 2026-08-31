# Group Message Read Receipt Webhook Events

## Feature overview

After a group message read receipt is sent successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain the read receipt information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

A user [sends a group message read receipt on the client](/sdk/v5/android/message_receipt.html#one-to-one-and-group-message-read-receipts).

## Webhook request

### Request example

The following example shows a request generated when a group message read receipt is sent.

```json
{
    "callId": "XXXX#XXXX_1406088760298309588",
    "channel_channel": "XXXX#XXXX_277721224642561@conference.easemob.com",
    "eventType": "chat",
    "channel_user": "XXXX#XXXX_tst@easemob.com",
    "chat_type": "read_ack",
    "security": "bc392b82e70e24cc1ea29e08aa41765d",
    "content_type": "chat:ack:read",
    "payload": {
        "ext": {},
        "ack_message_id": "1406088702140090324",
        "msg_config": {
            "allow_group_ack": true
        },
        "type": "read_ack"
    },
    "writed_channel": false,
    "host": "easemob@hsb-im-msync0",
    "appkey": "eXXXX#XXXX",
    "from": "tst",
    "to": "277721224642561",
    "msg_id": "1406088760298309588",
    "timestamp": 1744945351097
}
```

### Request fields

| Field        | Type | Description                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_message ID of the receipt message`. |
| `channel_channel` | String   | Read receipt for a group message, in the format `App Key_group ID@conference.easemob.com`, such as `easemob-demo#wang_277721224642561@conference.easemob.com` in the example.|
| `eventType`       | String | `chat`: An uplink message.                      |
| `security`  | String   | Signature in the format `MD5（callId+secret+timestamp）`. For the Secret, see [Webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules). |
| `payload`   | object   | Contains:<br/> - `ext`: Message extension field<br/> - `ack_message_id`: Message ID<br/> - `msg_config.allow_group_ack`: Whether a group message read receipt is required <br/> - `type`: `read_ack` indicates a message read receipt.|
| `host`      | String   | Server name.                                                 |
| `appkey`    | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`      | String   | ID of the user who sends the read receipt.                                        |
| `to`        | String   | Chat group ID.  |
| `msg_id`    | String   | Message ID of the receipt message.                                        |
| `timestamp` | long     | Unix timestamp when the EasyIM server receives the message read receipt, in milliseconds.  |
