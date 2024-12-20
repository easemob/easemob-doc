# 离线推送

回调请求主要字段含义：

| 字段   | 字段是否一定存在 | 类型   | 描述          |
| :----- | :------- | :---------- | :----------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_离线消息的消息 ID`。 |
| `appkey`        | 是               | String | 应用的唯一标识，由 Orgname 和 Appname 组成。      |
| `channel`       | 否               | String | 推送通道，APNS、ANDROID、XIAOMI、HUAWEI、MEIZU、OPPO、VIVO。该参数关联推送证书平台。   |
| `chat_type`     | 是               | String | 聊天类型，单聊和群聊分别为 `chat` 和 `groupchat` 。     |
| `data`          | 否    | Object | 第三方响应结果内容。   | 
| `device_id`     | 否   | String | 离线推送通知的接收方的设备 ID。   | 
| `device_token`  | 否     | String | 第三方推送标识。 | 
| `msg_id`        | 是               | String | 离线消息的消息 ID。  |
| `notifier_name` |  否               |  String  | 推送证书名称。                   | 
| `status`   | 是    | String | 推送状态:<br/> - `success`：推送成功;<br/> - `fail`：推送失败（第三方失败或不具备推送条件）；<br/> - `error`：推送异常。 |
| `step`   | 是   | String | 固定字符串内容 `push`。  |
| `target`| 是   | String | 离线推送通知的接收方的用户 ID。 |
| `timestamp`     | 是    | String | 事件发出时间戳。           |
| `e_message`     | 否               | String | 异常信息。该参数在出现错误时才提供。| 
| `from`          | 是               | String | 发送方的用户 ID。  |
| `group_id`      | 否               | String | 群组 ID，消息类型是群聊消息时才出现。 |
| `payload`       | 是    | Object | 消息负载，携带离线消息负载内容。  |

## 推送成功的回调请求示例

```json
{
    "callId": "XXXX#XXXX_1029XXXX29922197880",
    "appkey":"XXXX#XXXX",
    "channel":"APNS",
    "chat_type":"chat",
    "data":{
        "accepted":true,
        "apnsId":"7d988394-XXXX-XXXX-2b9f-e7a13a92fb96",
        "pushNotification":{
            "expiration":1656484422884,
            "payload":"{\"t\":\"wzy_apns\",\"aps\":{\"badge\":1,\"alert\":{\"body\":\"请点击查看\",\"title\":\"您有一条新消息\"},\"sound\":\"ring.caf\"},\"e\":{\"em_push_sound\":\"ring.caf\"},\"f\":\"wzy_vivo\",\"m\":\"626473521765161477\"}",
            "priority":"IMMEDIATE",
            "token":"XXXX",
            "topic":"com.easemob.XXXX.easeim"
        }
    },
    "device_id":"bcf1eb81-XXXX-XXXX-bb9f-284e9943a045",
    "device_token":"XXXX",
    "msg_id":"1029XXXX29922197880",
    "notifier_name":"EaseIM_APNS_Product",
    "status":"success",
    "step":"push",
    "target":"wzy_XXXX",
    "timestamp":1656398024142
}
```

## 推送失败原因

| 离线推送失败的原因    | 描述          |
| :------------------- | :----- | 
| `no push binding`           | 未绑定推送设备。       |
| `illegal binding`           | 绑定信息不合法(此处指证书名或 `deviceToken` 为空字符串, 一般不存在，不排除历史数据)。 |
| `no user exist`             | 接收用户不存在。       |  
| `notifier out of limit`     | 证书推送超限。     | 
| `notifier disabled`         | 证书未启用（封禁一次后即为未启用）。  |
| `notifier is ban`           | 证书封禁。        |
| `no notifier exist`         | 证书不存在。     |
| `invalid notifier`          | 证书无效。        |
| `message ignore push`       | 消息忽略推送，指离线扩展字段 `em_ignore_notification=true`。 |
| `invalid message`           | 无效的消息（协议内容一般不会有这个错误）。                     |
| `expire message`            | 过期的消息，推送延迟超过一天的消息，不再推送。                 |
| `user ignore push`          | 主动免打扰。      | 
| `ignore push device id`     | 忽略用户设备推送（扩展限制接收或不接收推送设备）。    |
| `invalid VOIP notification` | 无效的 APNs VoIP 类型推送。   | 
| `get push token fail`       | 获取推送 token 失败。       |
| `push yet but fail `        | 已经推送，但是返回失败。       |

### 常见推送失败回调请求示例

1. 未绑定推送设备

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029172947949980024",
    "security": "79e87c892ec0159ac9175f295d587a51",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no push binding",
    "msg_id": "1029172947949980024",
    "status": "fail",
    "target": "test1",
    "timestamp": 1657187799974
}
```

2. 离线推送通知的接收用户不存在

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029XXXX29922197880",
    "security": "c2d1352efc3f0b9bbf7e447c54ccb11d",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no user exist",
    "msg_id": "1029174929922197880",
    "status": "fail",
    "target": "test11",
    "timestamp": 1657188261464
}
```

3. 证书不存在

```json
{
    "chat_type": "chat",
    "callId": "XXXX#XXXX_1029188050686577016",
    "security": "baf6ff663587e705efd39d91e995c306",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "no notifier exist",
    "notifier_name": "102920687",
    "msg_id": "1029188050686577016",
    "status": "fail",
    "target": "test1",
    "timestamp": 1657191316366
}
```

4. 推送证书认证失败

```json
{
    "callId": "XXXX#XXXX_1029518239182358904",
    "data": {
    "result": 10206,
    "desc": "sign 不正确"
    },
    "device_id": "0f581e52-XXXX-XXXX-8774-f804a49571f5",
    "channel": "VIVOPUSH",
    "target": "Test4",
    "chat_type": "chat",
    "security": "afa9bd9d372XXXX5bedde37e275e",
    "device_token": "160403XXXX055106740XXXX",
    "appkey": "XXXX#XXXX",
    "step": "push",
    "detail": "get push token fail",
    "notifier_name": "104510674#XXXX30bc2c54a6d078bc69a8b6d7807d",
    "msg_id": "1029518239182358904",
    "status": "fail",
    "timestamp": 1657268194889
}
```