# 单聊会话已读回执回调事件

## 功能说明

在单聊中，消息接收方成功发送会话已读回执后，环信服务器会向你的 App Server 发送回调请求，App Server 可查看会话已读回执相关信息，进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则，详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

客户端 [发送单聊会话已读回执](/v4/document/android/conversation_receipt.html)。

## 回调请求

### 请求示例

```json
{
"callId": "XXXX-XXXX#testy_1252106597610555348",
"eventType": "chat",  
"chat_type": "channel_ack", 
"security": "203e3cXXXX0ebdbd776d8aa9cc057b2d",
"payload": {
"ack_message_id": "1252106100258375636", 
"type": "channel_ack" 
},
"host": "XXXX@hsb-XXXX-msync0",
"appkey": "XXXX-XXXX#testy",
"from": "wzy",   
"to": "wzy1",   
"msg_id": "1252106597610555348",  
"timestamp": 1709093585046
}
```

### 请求字段说明

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_回执消息的消息 ID”。 |
| `eventType` | String   | `chat`：上行消息。                                               |
| `chat_type` | String    |  会话已读回执。           |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。关于 `Secret`，详见 [环信控制台配置回调规则的描述](/product/console/basic_webhook.html#配置消息回调规则)。 |
| `payload`   | object   | 会话已读回执详情。 |
| `payload.ack_message_id` | String     | 会话中消息的消息 ID。                  |
| `payload.type` | String | 会话已读回执类型。       |                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信控制台注册的应用唯一标识。                         |
| `from` | String          | 发送已读回执的用户。|
| `to` | String    |  接收已读回执的用户。                 |
| `msg_id` | String      | 已读回执的消息 ID。 |
| `timestamp` | long     | 环信 IM 服务器收到会话已读回执的 Unix 时间戳，单位为毫秒。 |

