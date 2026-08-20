# Pre-Delivery Webhook

## Overview

After the EasyIM server receives an uplink one-to-one, group, or chat room message from a user and before it delivers the message to the target user, it notifies your app server through an HTTP/HTTPS POST request. Your app server can use the pre-delivery webhook to process chat messages in real time, for example, by intercepting text, image, custom, and other message types.

- **The pre-delivery webhook applies only to messages sent by clients, not messages sent through the RESTful API.**
- **The pre-delivery webhook supports text, image, location, voice, video, file, command, custom, and combined messages.**
- **The pre-delivery webhook does not support targeted messages in chat groups or chat rooms.**

![](/images/server-side/im-webhook.jpeg)

## Implementation steps

1. Activate the webhook service: In the [Easemob Console](https://console.easemob.com/user/login), [activate the message webhook service](/product/console/basic_webhook.html#activate-the-service).
2. Configure pre-delivery webhook rules: In the [Easemob Console](https://console.easemob.com/user/login), see [Webhook rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules).
3. The EasyIM server sends an HTTP/HTTPS POST request to your app server.

## Webhook rules

To use the pre-delivery webhook, configure webhook rules in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Webhook rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules).

For the same app, you can configure different rules for different message types. You can also select two or more message types in the same rule and send their webhooks to one specified server address. After receiving a message, you can process it according to its message type.

## Relationship with the post-delivery webhook

If both pre-delivery and post-delivery webhooks are configured and the pre-delivery webhook rejects a message, the post-delivery webhook is not triggered.

## Webhook example

Before a message is delivered to the recipient, the EasyIM server sends an HTTP/HTTPS POST request to your app server. The request body is a JSON-formatted string that uses the UTF-8 character set.

### Request example

The following example shows a message sent in a chat room:

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"chatroom",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      // Specific message content.
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

| Parameter              | Type    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` is in the format `{appkey}_{uuid}`, where `uuid` is randomly generated as the unique identifier of each webhook.  |
| `timestamp`       | Timestamp when the EasyIM server receives the message.       |
| `chat_type`       | Chat type: `chat` for a one-to-one chat, `group` for a group chat, and `chatroom` for a chat room.|
| `group_id`        | Chat group or chat room where the webhook message occurs. This field applies only to message webhooks in group chats or chat rooms.        |
| `from`            | Message sender.      |
| `to`              | Message recipient. For a one-to-one chat, the message recipient; for a group chat or chat room, the chat group ID or chat room ID.  |
| `msg_id`          | Message ID.   |
| `payload`         | Message content, in the same format as a message sent through the RESTful API. See [Message format](message_historical.html#historical-message-content).     |
| `security`        | Signature in the format MD5（callId+Secret+timestamp）. For the Secret, see the [Easemob Console](https://console.easemob.com/user/login) [webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). |

### Request fields

### Response example

```json
{
  "valid": true,
  "code": "HX:10000",
  "chatroom_msg_level": "high",
  "payload": {
    // Specific message content.
    // Only text messages are supported.
  }
}
```

### Response fields

After the message is sent to your app server, the app server must return HTTP status code 200 and the `valid` field. Whether the message is delivered depends on the value of `valid`. If EasyIM receives no response or your app server does not return `valid`, the message is processed according to the default setting (**Default policy upon a call failure** in the rule) without a retry. Subsequent messages continue to trigger webhooks normally.

The response cannot exceed 1,000 characters. Otherwise, the EasyIM server treats it as an attack and the webhook fails.

| Parameter      | Type   | Required<div style="width: 80px;"></div> | Description      |
| :-------- | :----- | :----------------- | :----------- |
| `valid`   | bool   | Yes   | Whether the message is valid according to the rules configured on your server:<br/> - `true`: The message is valid and the EasyIM server delivers it; `false`: The message is invalid and the EasyIM server intercepts it.|
| `chatroom_msg_level`   | String   | No   | Chat room message priority:<br/> - `high`: High<br/> - `normal`: Normal<br/> - `low`: Low|
| `code`    | String | No    | Custom pre-delivery webhook error reported by the client. If **Display upon a message interception error** on the **Pre-delivery webhook** page of the Easemob Console is set to **Display an error**, the content of `code` is shown as the client error. The following cases apply:<br/> - If `code` contains a string, the client displays that string as the error;<br/> - If the response does not contain the `code` field, the client displays `custom logic denied`;<br/> - If `code` is an empty string, the mobile client displays `Message blocked by external logic`;<br/> - If no response is received within the specified time, the default configuration is applied and the client displays `custom internal error`;<br/> - If the response is invalid, including when the required `valid` field is missing or a field has an unexpected type, the client displays `custom internal error`.|
| `payload` | Object | No   | Modified message content. If the message content does not need to be modified, **do not pass this field**. To modify it, return the modified content in the same format as the incoming message content.<br/> - By default, only the content and extensions of text messages can currently be modified, and the message size cannot exceed 1 KB.<br/> - To support modification of the content and extensions of image, voice, video, location, and custom messages, with a maximum message size of 5 KB, contact the Easemob business team. For an attachment message, to modify the `url` field, disable access restrictions. Otherwise, the client may fail to download the attachment because the access key (secret) verification fails.<br/> - Command messages cannot be modified.  |

## FAQ

1. Q: Why was the message still delivered when `valid` in the pre-delivery webhook response was `false`?

   A: Your server may not have returned a response within the wait time configured in the pre-delivery webhook rule. In this case, if **Default policy upon a call failure** on the pre-delivery webhook rule page in the Easemob Console is set to **Deliver**, the message is delivered. To avoid this issue, increase **Wait for response** (**EasyIM** > **Feature Configuration** > **Message Webhook** > **Add Webhook URL** > **Pre-delivery Webhook**), which defaults to 200 milliseconds, for example, to 3000 milliseconds.
