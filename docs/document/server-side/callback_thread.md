## Thread 回调事件

若对 Thread 中的一条消息进行相关操作，包括发送、撤回或修改，环信服务器会向你的 app server 发送回调请求。

## 回调请求的字段描述

Thread 回调请求中的字段含义如下表所示：

| 字段                 | 数据类型 | 含义                              |
| :------------------- | :------- | :-------------------------------- |
| `chat_type` | String | 固定值为 `notify`。通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 `type` 字段确定具体类型。 |
| `host`            | String | 服务器名称。              |
| `appkey`          | String | 即时通讯服务分配给每个应用的唯一标识，由 `orgname` 和 `appname` 参数的值组成，生成后无法修改。 |
| `from`            | String | 固定为 `admin`。  |
| `to`              | String | 消息所属的 Thread 的群组 ID。 |
| `eventType`       | String | 事件类型，固定为 `chat`。     |
| `msg_id`          | Long   | 回调事件的消息 ID。       |
| `timestamp`       | Long   | 生成回调事件的时间。 |
| `payload.type`               | String   | 固定值 `thread`。                 |
| `payload.data`               | JSON     | Thread 操作数据结构。             |
| `payload.data.msg_parent_id` | String   | 创建 Thread 的消息 ID，可能为空。 |
| `payload.data.name`          | String   | Thread 名称。    |
| `payload.data.from`          | String   | Thread 消息的操作人。             |
| `payload.data.id`            | String   | Thread ID。                    |
| `payload.data.message_count` | Number   | Thread 中的消息数量。               |
| `payload.data.operation`     | String   | Thread 中的消息操作：`update_msg`，表示消息的发送、撤回或修改。|
| `payload.data.muc_parent_id` | String   | 创建 Thread 时所在的群组 ID。     |
| `payload.data.timestamp` | Long   | 操作消息的时间。     |
| `payload.data.last_message`  | JSON     | 最近一条消息的内容。              |
| `payload.data.last_message.from`   | String   | Thread 中最新一条消息的操作者。 |
| `payload.data.last_message.id`   | String  | 最新一条消息的消息 ID。  |
| `payload.data.last_message.to`   | String  | Thread 中最新一条消息的接收方，即 Thread ID。 |
| `payload.data.last_message.timestamp`   | Long  | 操作最新一条消息的时间。 |
| `payload.data.last_message.payload.ext` | JSON  | Thread 中最新一条消息包含的扩展内容   |
| `payload.data.last_message.payload.bodies` | List  | Thread 中最新一条消息的消息体。   |
| `payload.data.last_message.payload.bodies.msg` | String  | Thread 中最新一条消息的消息内容。   |
| `payload.data.last_message.payload.bodies.txt` | String  | Thread 中最新一条消息的消息类型。   |
| `payload.data.last_message.meta` | JSON | 最新一条消息的界面不可见的元数据。 |
| `payload.data.last_message.meta.thread.msg_parent_id`   | String  | 创建 Thread 的消息 ID。 |
| `payload.data.last_message.meta.thread.thread_name`   | String  | Thread 名称。 |
| `payload.data.last_message.meta.thread.muc_parent_id`   | String  | 创建 Thread 时所在的群组 ID。 |
| `payload.data.last_message.payload.from` | String  | 消息操作者传入的 `from` 字段的值。  |
| `payload.data.last_message.payload.to`   | String    | Thread 中最新一条消息的接收方，即 Thread ID。  |
| `payload.data.last_message.payload.type`   | String  | 群聊，固定为 `groupchat`。 |

## 回调请求示例

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