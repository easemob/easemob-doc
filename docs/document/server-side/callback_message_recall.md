# 消息撤回

| 事件   | payload 中类型 | 触发事件       |
| :----- | :------------- | :------------- |
| recall | 无             | 进行消息撤回。 |

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_该撤回事件消息的 ID”。 |
| `eventType`       | String   | “chat” 上行消息、“chat_offline” 离线消息。                   |
| `timestamp`       | long     | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为 ms。        |
| `chat_type`       | String   | `recall`，表示消息撤回。 |
| `group_id`        | String   | 该参数对于群组聊天或聊天室有效，表示回调消息所在的群组或聊天室。 |
| `from`            | String   | 消息的发送方。                                               |
| `to`              | String   | 消息的接收方。                                               |
| `recall_id`       | String   | 要撤回的消息 ID。                                            |
| `msg_id`          | String   | 该撤回事件消息的 ID，与发送消息时的 `msg_id` 一致。                                       |
| `payload`         | object   | 事件内容，与通过 REST API 发送过来的一致，查看 [历史消息内容](message_historical.html#历史消息记录的内容)。 |
| `securityVersion` | String   | 安全校验版本，目前为 1.0.0。忽略此参数，以后会改成 Console 后台做设置。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [Console 后台回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `host`            | String   | 服务器名称。                                                 |

payload 中字段含义：

| 参数             | 数据类型 | 描述                                     |
| :--------------- | :------- | :--------------------------------------- |
| `ext`            | object   | 消息扩展字段，撤回行为时为空。         |
| `ack_message_id` | String   | 跟 `recall_id` 一致，为要撤回的消息 ID。 |
| `bodies`         | object   | 该回调的主体内容，撤回行为时为空。       |

回调请求的包体示例：

```json
{
    "chat_type":"recall",
    "callId":"XXXX#XXXX_966475585536657404",
    "security":"ea7a867314fb0e0833d5f4f169eb4f8d",
    "payload":{
        "ext":{},
        "ack_message_id":"966475220900644860",
        "bodies":[]
    },
    "host":"******",
    "appkey":"orgname#appname",
    "from":"tst",
    "recall_id":"966475220900644860",
    "to":"170908972023810",
    "eventType":"chat",
    "msg_id":"966475585536657404",
    "timestamp":1642589932646
}
```