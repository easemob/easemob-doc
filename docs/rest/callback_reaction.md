# Reaction Webhook Events

## Feature overview

After a Reaction is added to or removed from a message, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](/product/console/basic_webhook.html#configure-webhook-rules). Your app server can use the webhook to obtain Reaction information and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A Reaction is [added](/document/android/reaction.html#add-a-reaction-to-a-message) to or [removed](/document/android/reaction.html#remove-a-reaction-from-a-message) from a message on the client.
- A REST API is called to [add](/rest/reaction_add.html) a Reaction to or [remove](/rest/reaction_delete.html) a Reaction from a message.

## Webhook request

### Request example

In a Reaction webhook request, the `reactions` array contains all current Reaction records for the message. Each record has the following structure:
- Basic Reaction information: The Reaction name (`reaction`), current total count (`count`), and list of users who added the Reaction (`userList`).
- Operation tracking information (optional `op` field): If the Reaction record was produced by the current operation, this field identifies the operation type, such as `create`, and the operator, making it possible to trace the source of the change.

In the following webhook request, the message with ID `99XXXX32` currently has two Reaction records: `test`, added by `user2`, and `test-1`, also added by `user2`. For `test-1`, the `op` field indicates that this Reaction was created in the current operation (`reactionType: "create"`) by `user2`.

```json
{
    "chat_type": "notify",
    "payload":
    {
        "data":
        [
            {
                "messageId": "99XXXX32",
                "from": "user2",
                "reactions":
                [
                    {
                        "reaction": "test",
                        "userList":
                        [
                            "user2"
                        ],
                        "count": 1
                    },
                    {
                        "op":
                        [
                            {
                                "reactionType": "create",
                                "operator": "user2"
                            }
                        ],
                        "reaction": "test-1",
                        "userList":
                        [
                            "user2"
                        ],
                        "count": 1
                    }
                ],
                "to": "user3",
                "channel_type": "chat",
                "ts": 1648722783700
            }
        ],
        "num": 2,
        "channel_type": "chat",
        "type": "reaction"
    },
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "user1",
    "to": "user2",
    "eventType": "chat",
    "msg_id": "99XXXX56",
    "timestamp": 1648722784819
}
```

### Request fields

| Field             | Type   | Description             |
|:---------------|:-------|:---------------|
| `chat_type` | String | The value is fixed as `notify`. Notification webhooks include webhooks for message threads and Reactions. Use `payload` and its `type` field to determine the specific type.|
| `host`            | String | Server name.              |
| `appkey`          | String | Unique identifier assigned to each app by EasyIM. It consists of the values of `orgname` and `appname` and cannot be changed after it is generated. |
| `from`            | String | Message sender.     |
| `to`              | String | Message recipient.   |
| `eventType`       | String | `chat` indicates an uplink message, and `chat_offline` indicates an offline message.   |
| `msg_id`          | String | Message ID of the webhook request.       |
| `timestamp`       | long   | Unix timestamp when the EasyIM server receives the message, in milliseconds. |
| `payload.num`          | Int | Number of operations.       |
| `payload.channel_type` | String | Conversation type:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.  |
| `payload.type`         | String | The value is fixed as `reaction`. |
| `payload.data`         | List   | Reaction operation details. |
| `payload.data.messageId`         | String   | ID of the message associated with the Reaction. |
| `payload.data.from`         | String   | Sender of the Reaction message. |
| `payload.data.ts` | Long | Unix timestamp of the current Reaction operation, in milliseconds. |
| `payload.data.to` | String | Message recipient. |
| `payload.data.reactions`    | List | Reaction notification data structure. |
| `payload.data.reactions.reaction`  | String | Reaction. |
| `payload.data.reactions.userList`  | List | List of users who added the Reaction. |
| `payload.data.reactions.count`    | Int  | Number of times the Reaction was added. |
| `payload.data.reactions.op`    | List | Details of the current Reaction operation. |
| `payload.data.reactions.op.reaction`    | String | Reaction. |
| `payload.data.reactions.op.userList`    | List | Users who operated on the Reaction. |
| `payload.data.reactions.op.count`  | List | Number of users who operated on the Reaction. |
| `payload.data.reactions.op.reactionType`  | String | Current Reaction operation type. `create` indicates adding a Reaction. |
| `payload.data.reactions.op.operator`    | String | Operator of the current Reaction. |
