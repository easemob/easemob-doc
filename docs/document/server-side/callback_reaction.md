# 表情回复回调事件

## 功能说明

在消息上添加或移除表情回复（下文统称 “Reaction”）后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看表情回复，进行数据同步。

## 前提条件

- 已开通发送后回调服务，详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

- 客户端在消息上 [添加](/document/android/reaction.html#在消息上添加-reaction) 或 [移除](/document/android/reaction.html#删除消息的-reaction) Reaction。
- 调用 REST API 在消息上 [添加](/document/server-side/reaction_add.html) 或 [移除](/document/server-side/reaction_delete.html) Reaction。

## 回调请求

### 请求示例

Reaction 回调请求中，`reactions` 数组包含了消息当前所有的 Reaction 记录，每条记录结构如下：
- Reaction 基本信息：Reaction 名称（`reaction`）、当前累积数量（`count`）及添加该 Reaction 的用户列表（`userList`）。
- 操作溯源信息（`op` 字段，可选）： 当该条 Reaction 记录为本次操作所产生时，该字段会标记其操作类型（如新增 `create`）及操作者，便于追溯变化来源。

以下述回调请求为例：消息 ID 为 `99XXXX32` 的消息，当前共有两条 Reaction 记录：`test`（由用户 `user2` 添加）和 `test-1`（同样由用户 `user2` 添加）。其中 `test-1` 的 `op` 字段表明该 Reaction 本次为新建（`reactionType: "create"`），操作者为 `user2`。

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

### 请求字段说明

| 字段             | 数据类型   | 含义             |
|:---------------|:-------|:---------------|
| `chat_type` | String | 固定值为 `notify`。通知回调包含了消息话题（message thread）和表情回复（Reaction）的回调，需要结合 `payload` 中的 `type` 字段确定具体类型。|
| `host`            | String | 服务器名称。              |
| `appkey`          | String | 即时通讯服务分配给每个应用的唯一标识，由 `orgname` 和 `appname` 参数的值组成，生成后无法修改。 |
| `from`            | String | 消息的发送方。     |
| `to`              | String | 消息的接收方。   |
| `eventType`       | String | `chat` 表示上行消息、`chat_offline` 表示离线消息。   |
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

