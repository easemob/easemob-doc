# Reaction 回调事件

若对消息中的表情回复 Reaction 进行了操作，环信服务器会向你的 app server 发送回调请求。

Reaction 回调请求中主要包含消息中的 Reaction 的信息（即 Reaction 数量和添加 Reaction 的用户列表）以及被操作的 Reaction 的相关信息（即被操作的 Reaction、执行操作的用户列表和用户数量以及 Reaction 操作类型）。

## 回调请求的字段描述

Reaction 回调请求中的字段含义如下表所示：

| 字段             | 数据类型   | 含义             |
|:---------------|:-------|:---------------|
| `chat_type` | String | 固定值为 `notify`。通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 type 字段确定具体类型。｜
| `host`            | String | 服务器名称。              |
| `appkey`          | String | 即时通讯服务分配给每个应用的唯一标识，由 `orgname` 和 `appname` 参数的值组成，生成后无法修改。 |
| `from`            | String | 消息的发送方。     |
| `to`              | String | 消息的接收方。   |
| `eventType`       | String | “chat” 上行消息、“chat_offline” 离线消息。   |
| `msg_id`          | String | 该回调请求的消息 ID。       |
| `timestamp`       | long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。 |
| `payload.num`          | Int | 操作次数。       |
| `payload.channel_type` | String | 会话类型：<br/> - `chat`：单聊。<br/> - `groupchat`：群聊。  |
| `payload.type`         | String | 固定值 `reaction`。 |
| `payload.data`         | List   | Reaction 操作详细内容。 |
| `payload.data.messageId`         | String   | Reaction 对应的消息 ID。 |
| `payload.data.from`         | String   | Reaction 消息的发送方。 |
| `payload.data.ts` | Long | 当前 Reaction 操作的 Unix 时间戳，单位为毫秒。 |
| `payload.data.to` | String | 消息接收方。 |
| `payload.data.reactions`    | List | Reaction 通知数据结构。 |
| `payload.data.reactions.reaction`  | String | Reaction 表情。 |  
| `payload.data.reactions.userList`  | List | 添加该 Reaction 表情人的员列表。 |
| `payload.data.reactions.count`    | Int  | Reaction 表情被添加的次数。 |
| `payload.data.reactions.op`    | List | Reaction 当前操作详情。 |
| `payload.data.reactions.op.reaction`    | String | 表情。 |
| `payload.data.reactions.op.userList`    | List | 操作表情的用户。 |
| `payload.data.reactions.op.count`  | List | 表情操作人数。 |
| `payload.data.reactions.op.reactionType`  | String | Reaction 当前操作类型。`create` 为添加 Reaction。 |
| `payload.data.reactions.op.operator`    | String | Reaction 当前操作人。 |

## 回调请求示例

例如，在下面回调请求示例中，消息 ID 为 `99XXXX32` 的消息，当前存在 Reaction `test`，用户 `user2` 添加了 Reaction `test-1`，则 Chat 服务器会向你的 app server 发送回调：

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