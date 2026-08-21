# One-to-One Conversation Read Receipt Webhook Events

## Feature overview

After the message recipient successfully sends a conversation read receipt in a one-to-one chat, the EasyIM server sends a webhook request to your app server. Your app server can obtain the conversation read receipt information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easemob.com/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

A client [sends a one-to-one conversation read receipt](/v4/document/android/conversation_receipt.html).

## Webhook request

### Request example

```json
{
"callId": "XXXX-XXXX#testy_1252106597610555348",
"eventType": "chat",
"chat_type": "channel_ack",
"security": "203e3cXXXX0ebdbd776d8aa9cc057b2d",
"payload": {
"ack_message_id": "1252106100258375636",
"type": "channel_ack"
},
"host": "XXXX@hsb-XXXX-msync0",
"appkey": "XXXX-XXXX#testy",
"from": "wzy",
"to": "wzy1",
"msg_id": "1252106597610555348",
"timestamp": 1709093585046
}
```

### Request fields

| Field          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `callId`    | String   | The `callId` field is the unique identifier of each webhook request, in the format “App Key_message ID of the receipt message”. |
| `eventType` | String   | `chat`: Uplink message.                                               |
| `chat_type` | String    | Conversation read receipt.           |
| `security`  | String   | Signature in the format `MD5（callId+secret+timestamp）`. For the `Secret`, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules). |
| `payload`   | object   | Conversation read receipt details. |
| `payload.ack_message_id` | String     | ID of the message in the conversation.                  |
| `payload.type` | String | Conversation read receipt type.       |                |
| `host`      | String   | Server name.                                                 |
| `appkey`    | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from` | String          | User who sends the read receipt.|
| `to` | String    | User who receives the read receipt.                 |
| `msg_id` | String      | Message ID of the read receipt. |
| `timestamp` | long     | Unix timestamp when the EasyIM server receives the conversation read receipt, in milliseconds. |
