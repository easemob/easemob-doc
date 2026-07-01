# 敏感词监测回调事件

## 功能说明

消息内容命中敏感词（涉政词库）后，环信服务器将根据 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，你可以通过该回调获取消息处理动作的相关信息（如敏感词拦截或替换），便于进行数据同步和后续分析。

## 前提条件

- 已开通发送后回调服务，详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

消息命中敏感词库（涉政词库）后，在以下任一处理动作完成后触发回调：

- 消息审核通过（放行），正常下发。
- 消息因包含敏感词被拦截。
- 消息中的敏感内容被替换。

## 回调请求

### 敏感词审核通过示例

```json
{
    "callId": "XXXX#XXXX_0e1b4c8e-a95c-4db1-85f3-2cbf6197d73c",
    "alertReason": "through",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "36e8e82243ce96e1ac3f530fb815cef8",
    "contentUri": "msync:1218049757197370792",
    "host": "msync@ebs-ali-beijing-msync62",
    "appkey": "XXXX#XXXX",
    "contentType": "message",
    "timestamp": 1701164109042,
    "chatType": "chat:user:text",
    "status": "pass"
}
```

### 敏感词拦截示例

```json
{
    "callId": "XXXX#XXXX_16396528-2a9c-4d96-8219-15723e436fd6",  
    "alertReason": "intercepted",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [
        "12"
    ],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "47ce006af8a8f9ad26acf125244093ab",
    "contentUri": "msync:1232040174779635136",
    "host": "msync@ebs-ali-beijing-msync68",
    "appkey": "XXXX#XXXX",
    "contentType": "message",
    "timestamp": 1704421506954,
    "chatType": "chat:user:text",
    "status": "refuse"
}
```

### 敏感词替换示例

```json
{
    "callId": "XXXX#XXXX_3a49331a-e554-48d2-bacb-797739020e2a",  
    "alertReason": "intercepted",
    "contentReceiver": "XXXX#XXXX_test1@easemob.com",
    "eventType": "keyword_alert",
    "sensitiveWords": [
        "12"
    ],
    "contentOwner": "XXXX#XXXX_test2@easemob.com",
    "security": "e8b50122636487eacb55ada441f8f3cb",
    "contentUri": "msync:1218049329273505228",
    "host": "msync@ebs-ali-beijing-msync71",
    "appkey": "easemob-demo#restys",
    "contentType": "message",
    "timestamp": 1701164009349,
    "chatType": "chat:user:text",
    "status": "replace"
}
```

## 请求字段说明

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 `App Key_UUID`。 | 
| `alertReason`  | String   | 敏感词是否合规：<br/> - `through`：表示敏感词为合规内容；<br/> - `intercepted`：表示敏感词为违规词，包含敏感词的消息被拦截。<br/> - `replaced`：表示敏感词为违规词，使用 *** 代替。 | 
| `contentReceiver`  | String   |  内容接收方的用户 ID。 | 
| `eventType`  |  String |  事件类型，用于标识为敏感词检测还是其他类型的事件。 | 
| `sensitiveWords`  | List   | 敏感词内容。  | 
| `contentOwner`  |  String | 内容发送方的用户 ID。  | 
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。`secret` 详见 [环信控制台的回调规则配置](/product/console/basic_webhook.html#配置消息回调规则)。  | 
| `contentUri`  |  String | 消息唯一标识，格式为 msync:msgId。 | 
| `host`  | String  | 服务器名称。  | 
| `appkey`  | String  | 即时通讯服务分配给每个应用的唯一标识，由 `orgname` 和 `appname` 参数的值组成。  |  
| `contentType`  |  String |  内容类型，目前为 `message`，表示为消息。 |  
| `timestamp`  | Long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。 | 
| `chatType`  | String  | 会话类型，默认全选：<br/> - `chat`：单聊回调；<br/> - `groupchat`：群聊回调包含了群组和聊天室的消息回调；<br/> - `notify`：通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 `type` 字段确定具体类型。  | 
| `status`  | String  | 对敏感词或消息的处理动作。<br/> - `pass`：敏感词为合规内容，包含敏感词的消息通过审核。<br/> - `refuse`：敏感词为违规词，对包含敏感词的消息进行拦截，不下发。<br/> - `replace`：敏感词为违规词，由 `***` 替换。  | 