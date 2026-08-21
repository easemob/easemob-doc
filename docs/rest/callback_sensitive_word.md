# Sensitive Word Detection Webhook Events

## Feature overview

When message content matches a sensitive word in the politically sensitive word library, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). You can use the webhook to obtain information about the message processing action, such as interception or replacement of sensitive words, for data synchronization and subsequent analysis.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easemob.com/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

When a message matches a word in the politically sensitive word library, the webhook is triggered after any of the following processing actions is completed:

- The message passes moderation and is delivered normally.
- The message is intercepted because it contains a sensitive word.
- Sensitive content in the message is replaced.

## Webhook request

### Sensitive word approval example

```json
{
    "callId": "XXXX#XXXX_0e1b4c8e-a95c-4db1-85f3-2cbf6197d73c",
    "alertReason": "through",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "36e8e82243ce96e1ac3f530fb815cef8",
    "contentUri": "msync:1218049757197370792",
    "host": "msync@ebs-ali-beijing-msync62",
    "appkey": "XXXX#XXXX",
    "contentType": "message",
    "timestamp": 1701164109042,
    "chatType": "chat:user:text",
    "status": "pass"
}
```

### Sensitive word interception example

```json
{
    "callId": "XXXX#XXXX_16396528-2a9c-4d96-8219-15723e436fd6",
    "alertReason": "intercepted",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [
        "12"
    ],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "47ce006af8a8f9ad26acf125244093ab",
    "contentUri": "msync:1232040174779635136",
    "host": "msync@ebs-ali-beijing-msync68",
    "appkey": "XXXX#XXXX",
    "contentType": "message",
    "timestamp": 1704421506954,
    "chatType": "chat:user:text",
    "status": "refuse"
}
```

### Sensitive word replacement example

```json
{
    "callId": "XXXX#XXXX_3a49331a-e554-48d2-bacb-797739020e2a",
    "alertReason": "intercepted",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [
        "12"
    ],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "e8b50122636487eacb55ada441f8f3cb",
    "contentUri": "msync:1218049329273505228",
    "host": "msync@ebs-ali-beijing-msync71",
    "appkey": "easemob-demo#restys",
    "contentType": "message",
    "timestamp": 1701164009349,
    "chatType": "chat:user:text",
    "status": "replace"
}
```

## Request fields

| Field        | Type | Description                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `alertReason`  | String   | Whether the sensitive word is compliant:<br/> - `through`: The sensitive word is compliant content;<br/> - `intercepted`: The sensitive word is prohibited, and the message containing it is intercepted.<br/> - `replaced`: The sensitive word is prohibited and is replaced with ***. |
| `contentReceiver`  | String   | User ID of the content recipient. |
| `eventType`  |  String | Event type, used to distinguish sensitive word detection from other event types. |
| `sensitiveWords`  | List   | Sensitive word content.  |
| `contentOwner`  |  String | User ID of the content sender.  |
| `security`  | String   | Signature in the format `MD5（callId+secret+timestamp）`. For the `secret`, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).  |
| `contentUri`  |  String | Unique message identifier in the format msync:msgId. |
| `host`  | String  | Server name.  |
| `appkey`  | String  | Unique identifier assigned to each app by EasyIM, consisting of the values of the `orgname` and `appname` fields.  |
| `contentType`  |  String | Content type. The current value is `message`, indicating a message. |
| `timestamp`  | Long   | Unix timestamp when the EasyIM server receives the message, in milliseconds. |
| `chatType`  | String  | Conversation type. All types are selected by default:<br/> - `chat`: One-to-one chat webhook;<br/> - `groupchat`: Group chat webhook, including message webhooks for chat groups and chat rooms;<br/> - `notify`: Notification webhook, including Thread and Reaction webhooks. Use the `type` field in the payload to determine the specific type.  |
| `status`  | String  | Processing action for the sensitive word or message.<br/> - `pass`: The sensitive word is compliant, and the message containing it passes moderation.<br/> - `refuse`: The sensitive word is prohibited, and the message containing it is intercepted and not delivered.<br/> - `replace`: The sensitive word is prohibited and is replaced with `***`.  |
