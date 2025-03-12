# 修改消息

消息修改后，环信服务器会按照[发送后回调规则](callback_postsending.html#发送后回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看修改后的消息，进行数据同步。

:::tip
1. 如果需要消息修改事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置发送后回调规则](callback_postsending.html#发送后回调规则)。
2. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 回调时机

1. 客户端修改各类消息。
2. 调用 RESTful API 修改文本或自定义消息。
 
## 回调请求

### 请求示例

```json
{
    "callId":"XXXX#XXXX_8924312242322", 
    "timestamp": 1737454241444,
    "appkey": "XXXX#XXXX",
    "from": "user1",
    "to": "user2",
    "msg_id": "1373914689292994516",
    "chat_type": "edit",
    "payload": {
        "bodies": [
            {
                "msg": "rest消息",
                "type": "txt"
            }
        ],
        "edit_message_id": "1373914550281177044",
        "from": "p1",
        "meta": {
            "edit_msg": {
                "count": 1, 
                "edit_time": 1737454241444,
                "operator": "easemob_rest_app_admin", 
                "send_time": 1737454209069,
                "sender": "p1" 
            }
        },
        "to": "p2",
        "type": "edit"
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求字段说明

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为 ms。        |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 内部字段，开发者可忽略。                                     | 
| `to`              | String   | 内部字段，开发者可忽略。                                            |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `securityVersion` | String   | 安全校验版本，目前为 1.0.0。开发者可忽略该参数。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见[配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `bodies`         | JSON Array   | 修改消息的具体内容。与通过 RESTful API 发送过来的一致，查看 [历史消息内容](message_historical.html#历史消息记录的内容)。 |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `from`            | String   | 修改消息的发送方。                                               |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `to`            | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。 |
| `type`            | String   | 消息修改事件，值为 `edit`。       |


