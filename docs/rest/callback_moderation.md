# Content Moderation Webhook Events

## Feature overview

After a message is reviewed by the [content moderation service](/value-added/moderation/moderation_overview.html), the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain message moderation details and synchronize data.

## Prerequisite

- The [content moderation service is activated](/value-added/moderation/moderation_enable.html), and [moderation rules](/value-added/moderation/moderation_rule_config.html) are configured.
- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

A message triggers a [content moderation rule](/value-added/moderation/moderation_overview.html) configured in the EasyIM Console.

## Webhook request

After message moderation is completed, the EasyIM server sends the moderation result in a POST request to the configured HTTP webhook URL.

### Request example

The following example shows a moderation result webhook when the message passes review:

```json
 {
    "callId": "100220419126072#demo_54ae7e93-xxxx-xxxx-92f5-323e33187243",
    "moderationResult": "PASS",
    "providerResult": "PASS",
    "security": "1f4857f120b2789b7d0abcd372c4f9e8",
    "messageType": "txt",
    "messageId": "1F4MX6iSdI7VFnN7Hm0vrcr3Uwr",
    "targetType": "chat",
    "appkey": "100220419126072#lydemo",
    "source": {

    },
    "riskType": "广告",
    "eventType": "moderation",
    "from": "qa2",
    "to": "qa1",
    "url": "",
    "msg": "你好",
    "timestamp": 1668766253245
}
```

### Request fields

| Parameter          | Type   | Description                                             |
| :------------ | :----- | :----------------------------------------------- |
| `callId` | String| Webhook identifier in the format {appkey}_{uuid}, where UUID is randomly generated as the unique identifier of each webhook.|
| moderationResult  | String  | Message processing result:<br/> - `PASS`: Deliver the message;<br/> - `REJECT`: Reject message delivery;<br/> - `EXCHANGE`: Replace prohibited content in the message;<br/> - `RECALL`: Recall the delivered audio or video message. |
| `providerResult` | String | Moderation result:<br/> - `PASS`: The message contains no prohibited content;<br/> - `REVIEWED`: The message may contain prohibited content;<br/> - `REJECT`: The message contains prohibited content.|
| `security`       | String | Signature in the format MD5（callId+Secret+timestamp）. For the Secret, see the webhook rules in the [EasyIM Console](https://console.easyim.ai/user/login). |
| `messageType`       | String | Message type:<br/> - `txt`: Text message;<br/> - `img`: Image message;<br/> - `audio`: Voice message;<br/> - `video`: Video message;<br/> - `custom`: Custom message.   |
| `messageId`       | String  | Message ID.   |
| `targetType`       | String | Conversation type:<br/> - `chat`: One-to-one chat;<br/> - `groupchat`: Group chat;<br/> - `chatroom`: Chat room.  |
| `appkey`       | String | Your App Key.   |
| `riskType`       | String | Risk type, such as `无风险`, `涉政`, `仇恨言论`, `色情`, `成人内容`, `暴恐`, `违禁`, `广告`, `二维码`, or `未知`.   |
| `eventType`       | String | Event type. The value is `moderation` for the moderation service.|
| `from`      | String | Message sender.   |
| `to`      | String | Message recipient:<br/> - For a one-to-one chat, the peer user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.  |
| `msg`      | String | Text message content. This field exists only when `messageType` is `txt`.|
| `url`      | String | Attachment URL in an audio, video, or image message. This field exists only when `messageType` is `img`, `audio`, or `video`. |
| `timestamp`      | Long | Unix timestamp when the EasyIM server receives the message, in milliseconds.   |
