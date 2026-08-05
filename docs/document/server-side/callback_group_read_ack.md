# 发送群组消息已读回执回调事件

## 功能说明

成功发送群组消息已读回执后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调已读回执信息，进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

[客户端发送了群组消息已读回执](/document/android/message_receipt.html#单聊和群聊消息已读回执)。

## 回调请求

### 请求示例

下面的请求示例为发送群组消息已读回执。

```json
{
    "callId": "XXXX#XXXX_1406088760298309588",
    "channel_channel": "XXXX#XXXX_277721224642561@conference.easemob.com",
    "eventType": "chat",
    "channel_user": "XXXX#XXXX_tst@easemob.com",
    "chat_type": "read_ack",
    "security": "bc392b82e70e24cc1ea29e08aa41765d",
    "content_type": "chat:ack:read",
    "payload": {
        "ext": {},
        "ack_message_id": "1406088702140090324",
        "msg_config": {
            "allow_group_ack": true
        },
        "type": "read_ack"
    },
    "writed_channel": false,
    "host": "easemob@hsb-im-msync0",
    "appkey": "eXXXX#XXXX",
    "from": "tst",
    "to": "277721224642561",
    "msg_id": "1406088760298309588",
    "timestamp": 1744945351097
}
```

### 请求字段说明

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_回执消息的消息 ID`。 | 
| `channel_channel` | String   | 群聊消息的已读回执，格式为 `App Key_群组 ID@conference.easemob.com`，例如，示例中的 `easemob-demo#wang_277721224642561@conference.easemob.com`。|
| `eventType`       | String | `chat`：表示上行消息。                      |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。Secret 见 [环信控制台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。 |  
| `payload`   | object   | 包括：<br/> - `ext`：消息扩展字段<br/> - `ack_message_id`：消息 ID<br/> - `msg_config.allow_group_ack`：是否需要群消息已读回执 <br/> - `type`：`read_ack` 表示消息已读回执。|
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信控制台注册的应用唯一标识。                         |
| `from`      | String   | 发送已读回执的用户 ID。                                        |
| `to`        | String   | 群组 ID。  |
| `msg_id`    | String   | 该回执消息的消息 ID。                                        |
| `timestamp` | long     | 环信 IM 服务器收到消息已读回执的 Unix 时间戳，单位为 ms。  |