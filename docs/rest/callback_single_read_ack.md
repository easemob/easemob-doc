# One-to-One Message Read Receipt Event

## Feature overview

After a one-to-one message read receipt is sent successfully, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain read receipt information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

The [client sends a one-to-one message read receipt](/sdk/v5/android/message_receipt.html#one-to-one-and-group-message-read-receipts).

## Webhook request

### Request example

The following example shows a one-to-one message read receipt being sent.

```json
{
    "chat_type": "read_ack",
    "callId": "XXXX#XXXX_968665325555943556",
    "channel_channel": "XXXX#XXXX_2222@conference.easemob.com",
    "security": "bd63d5fa8f72823e6d33e09a43aa4239",
    "os": "ios",
    "payload": {
        "ext": {},
        "ack_message_id": "968665323572037776",
        "bodies": []
    },
    "host": "msync@ebs-ali-beijing-msync45",
    "appkey": "XXXX#XXXX",
    "from": "1111",
    "to": "2222",
    "eventType": "chat",
    "msg_id": "968665325555943556",
    "timestamp": 1643099771248
}
```

### Request fields

| Field        | Type | Description                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `chat_type` | String   | `read_ack`: Read receipt.                                        |
| `callId`    | String   | The `callId` field is the unique identifier of each webhook request, in the format “App Key_message ID of the receipt message”. |
| `channel_channel` | String   | Read receipt for a one-to-one message, in the format `App Key_user ID that receives the read receipt@conference.easemob.com`, such as `easemob-demo#wang_277721224642561@conference.easemob.com` in the example.|
| `security`  | String   | Signature in the format `MD5（callId+secret+timestamp）`. For the Secret, see [Webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-webhook-rules). |
| `os` | String | The IM SDK platform identifier used by the client that sends the one-to-one message read receipt. Common values are:<br/> - `android`: Android. Applies to clients using the Android IM SDK and clients using cross-platform IM SDKs such as Flutter, React Native, or Unity that run on Android.<br/> - `ios`: iOS. Applies to clients using the iOS IM SDK and clients using cross-platform IM SDKs such as Flutter, React Native, or Unity that run on iOS.<br/> - `webim`: Web SDK. Applies to clients using the Web IM SDK.<br/> - `harmony`: HarmonyOS.<br/> - `win`: Windows.<br/> - `custom`: Custom platform. EasyIM supports custom device platforms so you can manage login devices more precisely. For details, see [Set a login device platform](/sdk/v5/android/multi_device.html#set-a-login-device-platform). |
| `payload`   | object   | Contains:<br/> - `ext`: Message extension field<br/> - `ack_message_id`: Message ID<br/> - `bodies`: Message body content. |
| `host`      | String   | Server name.                                                 |
| `appkey`    | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`      | String   | ID of the user who sends the read receipt.                                        |
| `to`        | String   | ID of the user who receives the read receipt.                                        |
| `eventType`       | String | `chat`: An uplink message.                      |
| `timestamp` | long     | Unix timestamp when the EasyIM server receives the message read receipt, in milliseconds.                  |
| `msg_id`    | String   | Message ID of the receipt message.                                        |
