# Message Thread Operation Webhook Events

## Feature overview

When a message in a message thread (Thread) is sent, recalled, or modified, the EasyIM server sends a webhook request to your app server.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/document/server-side/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Trigger conditions

- A message in a message thread is [sent](/document/android/thread_message.html#send-a-message-in-a-message-thread), [recalled](/document/android/thread_message.html#recall-a-message-in-a-message-thread), or [edited](/document/android/message_modify.html) on the client.
- A RESTful API is called to [send](/document/server-side/message_group.html), [recall](/document/server-side/message_recall_single.html), or [edit](/document/server-side/message_modify.html) a message in a message thread.

## Webhook request

### Request example

```json
{
    "chat_type": "notify",
    "payload":
    {
        "data":
        {
            "msg_parent_id": "98XXXX12",
            "name": "test",
            "from": "user1",
            "last_message":
            {
                "payload":
                {
                    "ext":
                    {},
                    "bodies":
                    [
                        {
                            "msg": "thread test",
                            "type": "txt"
                        }
                    ],
                    "meta":
                    {
                        "thread":
                        {
                            "msg_parent_id": "98XXXX12",
                            "thread_name": "test",
                            "muc_parent_id": "user2"
                        }
                    },
                    "from": "user1",
                    "to": "17XXXX93",
                    "type": "groupchat"
                },
                "from": "XXXX#XXXX_yifan2",
                "id": "10XXXX28",
                "to": "XXXX#XXXX_17XXXX93",
                "timestamp": 1651029973455
            },
            "id": "17XXXX93",
            "message_count": 49,
            "operation": "update_msg",
            "muc_parent_id": "user2",
            "timestamp": 1651029973455
        },
        "type": "thread"
    },
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "admin",
    "to": "user2",
    "eventType": "chat",
    "msg_id": "10XXXX24",
    "timestamp": 1651029973480
}
```

### Request fields

| Field                 | Type | Description                              |
| :------------------- | :------- | :-------------------------------- |
| `chat_type` | String | The value is fixed as `notify`. Notification webhooks include webhooks for message threads (Thread) and Reactions. Use `payload` and its `type` field to determine the specific type. |
| `host`            | String | Server name.              |
| `appkey`          | String | Unique identifier assigned to each app by EasyIM. It consists of the values of `orgname` and `appname` and cannot be changed after it is generated. |
| `from`            | String | The value is fixed as `admin`.  |
| `to`              | String | ID of the chat group containing the Thread. |
| `eventType`       | String | Event type. The value is fixed as `chat`.     |
| `msg_id`          | Long   | Message ID of the webhook event.       |
| `timestamp`       | Long   | Time when the webhook event is generated. |
| `payload.type`               | String   | The value is fixed as `thread`.                 |
| `payload.data`               | JSON     | Thread operation data structure.             |
| `payload.data.msg_parent_id` | String   | ID of the message used to create the Thread. This field may be empty. |
| `payload.data.name`          | String   | Thread name.    |
| `payload.data.from`          | String   | Operator of the message in the Thread.             |
| `payload.data.id`            | String   | Thread ID.                    |
| `payload.data.message_count` | Number   | Number of messages in the Thread.               |
| `payload.data.operation`     | String   | Message operation in the Thread. `update_msg` indicates sending, recalling, or modifying a message.|
| `payload.data.muc_parent_id` | String   | ID of the chat group where the Thread was created.     |
| `payload.data.timestamp` | Long   | Time of the message operation.     |
| `payload.data.last_message`  | JSON     | Content of the latest message.              |
| `payload.data.last_message.from`   | String   | Operator of the latest message in the Thread. |
| `payload.data.last_message.id`   | String  | Message ID of the latest message.  |
| `payload.data.last_message.to`   | String  | Recipient of the latest message in the Thread, which is the Thread ID. |
| `payload.data.last_message.timestamp`   | Long  | Time of the operation on the latest message. |
| `payload.data.last_message.payload.ext` | JSON  | Extensions contained in the latest message in the Thread.   |
| `payload.data.last_message.payload.bodies` | List  | Message body of the latest message in the Thread.   |
| `payload.data.last_message.payload.bodies.msg` | String  | Content of the latest message in the Thread.   |
| `payload.data.last_message.payload.bodies.txt` | String  | Type of the latest message in the Thread.   |
| `payload.data.last_message.meta` | JSON | UI-invisible metadata of the latest message. |
| `payload.data.last_message.meta.thread.msg_parent_id`   | String  | ID of the message used to create the Thread. |
| `payload.data.last_message.meta.thread.thread_name`   | String  | Thread name. |
| `payload.data.last_message.meta.thread.muc_parent_id`   | String  | ID of the chat group where the Thread was created. |
| `payload.data.last_message.payload.from` | String  | Value of the `from` field passed by the message operator.  |
| `payload.data.last_message.payload.to`   | String    | Recipient of the latest message in the Thread, which is the Thread ID.  |
| `payload.data.last_message.payload.type`   | String  | Group chat. The value is fixed as `groupchat`. |
