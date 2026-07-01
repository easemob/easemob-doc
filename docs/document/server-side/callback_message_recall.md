# 消息撤回回调事件

## 功能说明

成功撤回消息后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看撤回的消息，进行数据同步。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

1. [用户通过客户端撤回了消息](/document/android/message_recall.html)。
2. 调用 RESTful API 撤回了 [单条消息](/document/server-side/message_recall_single.html) 或 [批量撤回](/document/server-side/message_recall_batch.html)。
3. 在 [环信控制台](https://console.easemob.com/user/login) 上撤回了消息。例如，在 [消息举报管理](/value-added/moderation/moderation_message_report.html#查看消息举报详情)、[群管理](/value-added/moderation/moderation_manual_review.html#群组审核管理) 或 [聊天室管理](/value-added/moderation/moderation_manual_review.html#聊天室审核管理) 等页面执行撤回操作。

## 回调请求

### 请求示例

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

### 请求字段说明

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_该撤回事件消息的 ID”。 |
| `eventType`       | String   | `chat` 上行消息、`chat_offline` 离线消息。                   |
| `timestamp`       | long     | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为 ms。        |
| `chat_type`       | String   | `recall`，表示消息撤回。                                     |
| `group_id`        | String   | 该参数对于群组聊天或聊天室有效，表示回调消息所在的群组或聊天室。 |
| `from`            | String   | 消息的发送方。                                               |
| `to`              | String   | 消息的接收方。                                               |
| `recall_id`       | String   | 要撤回的消息 ID。                                            |
| `msg_id`          | String   | 该撤回事件消息的 ID，与发送消息时的 `msg_id` 一致。          |
| `payload`         | object   | - 对于消息撤回行为，`bodies` 和 `ext` 字段为空。<br/> `ack_message_id` 表示原消息 ID。 |
| `securityVersion` | String   | 安全校验版本，目前为 1.0.0。忽略此参数，以后会改成 Console 后台做设置。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [Console 后台回调规则](/product/console/basic_webhook.html#配置消息回调规则)。 |
| `appkey`          | String   | 你在环信控制台注册的应用唯一标识。                           |
| `host`            | String   | 服务器名称。                                                 |
