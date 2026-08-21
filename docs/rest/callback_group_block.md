# Chat Group Block Status Change Webhook Events

## Feature overview

After a chat group is successfully blocked or unblocked, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the webhook to obtain information about the block or unblock and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easemob.com/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Block a chat group

### Trigger conditions

A user [blocks chat group messages on the client](/document/android/group_manage.html#block-group-messages).

### Webhook request

#### Request example

```json
{
    "callId": "XXXX#XXXX_a64cbdc6-XXXX-XXXX-81b0-b64285c5f711",
    "security": "eed92d60XXXXa3f30c39b111fc0dfffa",
    "payload": {
        "type": "ADD"
    },
    "appkey": "XXXX#XXXX",
    "id": "test_123",
    "type": "GROUP",
    "event": "group_op_event",
    "operation": "SHIELD",
    "operator": "wzy",
    "timestamp": 1732518372734
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `payload`       | Object | Event content.                                                     |
| `payload.type` | String | Chat group block event. The value is `ADD`. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `SHIELD` when a chat group is blocked. |
| `operator`     | String | Operator. If an app admin blocks the chat group, the value is fixed as `@ppAdmin`.                                      |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Unblock a chat group

### Trigger conditions

A user [unblocks chat group messages on the client](/document/android/group_manage.html#unblock-group-messages).

### Webhook request

#### Request example

```json
{
    "callId": "XXXX#XXXX_124b1da0-XXXX-XXXX-8b2f-d5d376c3ad16",
    "security": "895b3f0dfXXXX0a8efb6104d67232961",
    "payload": {
        "type": "REMOVE"
    },
    "appkey": "XXXX#XXXX",
    "id": "test_123",
    "type": "GROUP",
    "event": "group_op_event",
    "operation": "SHIELD",
    "operator": "wzy",
    "timestamp": 1732518426833
}
```

#### Request fields

| Field         | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `callId`       | String | The `callId` field is the unique identifier of each webhook request, in the format `App Key_UUID`. |
| `security`     | String | Signature in the format `MD5(callId+secret+timestamp)`. For details, see [Configure webhook rules in the EasyIM Console](/product/console/basic_webhook.html#configure-message-callback-rules).|
| `paylod`       | Object | Event content.                                                     |
| `payload.type` | String | Chat group unblock event. The value is `REMOVE`. |
| `appkey`       | String | Unique identifier of the app registered in the EasyIM Console.                                |
| `id`           | String | Chat group or chat room ID.                                                |
| `type`         | String | Event type:<br/> - `GROUP`: Chat group <br/> - `CHATROOM`: Chat room     |
| `event`        | String | For chat groups and chat rooms, the value is fixed as `group_op_event`. The receiver can use this field to identify a chat group or chat room operation event. |
| `operation`    | String | Operation. The value is `SHIELD` when a chat group is unblocked. |
| `operator`     | String | Operator. If an app admin unblocks the chat group, the value is fixed as `@ppAdmin`.             |
| `timestamp`    | Long   | Unix timestamp when the operation is completed.                             |

## Other information

**More chat group operation events and sub-events will be added in the future. If your business strongly depends on these events or sub-events, implement strict checks for `operation` and `payload.type`.**
