# 内容审核回调事件

## 功能说明

消息经 [内容审核服务](/value-added/moderation/moderation_overview.html) 审核后，环信服务器将依据 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看消息审核的详细信息，并实现数据同步。

## 前提条件

- 已 [开通内容审核服务](/value-added/moderation/moderation_enable.html)，并配置了 [审核规则](/value-added/moderation/moderation_rule_config.html)。
- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 回调时机

消息触发了环信控制台上配置的 [内容审核规则](/value-added/moderation/moderation_overview.html)。

## 回调请求

完成消息审核后，环信 IM 服务器将审核结果以 POST 方式发送到你设置的 HTTP 回调通知地址。

### 请求示例

审核结果回调示例（如放行）代码如下：

```json
 {
    "callId": "100220419126072#demo_54ae7e93-xxxx-xxxx-92f5-323e33187243",
    "moderationResult": "PASS",
    "providerResult": "PASS",
    "security": "1f4857f120b2789b7d0abcd372c4f9e8", 
    "messageType": "txt", 
    "messageId": "1F4MX6iSdI7VFnN7Hm0vrcr3Uwr",
    "targetType": "chat", 
    "appkey": "100220419126072#lydemo", 
    "source": {
       
    },
    "riskType": "广告",
    "eventType": "moderation", 
    "from": "qa2",
    "to": "qa1",
    "url": "",
    "msg": "你好",
    "timestamp": 1668766253245
}
```

### 请求字段说明

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `callId` | String| 回调的标识。格式为 {appkey}_{uuid}，其中 UUID 为随机生成，作为每条回调的唯一标识。|
| moderationResult  | String  | 消息处理结果：<br/> - `PASS`：通过，直接下发消息；<br/> - `REJECT`：拒绝下发；<br/> - `EXCHANGE`：替换消息中的违规内容；<br/> - `RECALL`：撤回发送的音频和视频。 |
| `providerResult` | String | 审核结果：<br/> - `PASS`：消息中不包含违规内容；<br/> - `REVIEWED`：消息中疑似包含违规内容；<br/> - `REJECT`：消息存在违规内容。|
| `security`       | String | 签名，格式如下: MD5（callId+Secret+timestamp），其中 Secret 详见[环信控制台](https://console.easemob.com/user/login)的回调规则。 |
| `messageType`       | String | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `custom`：自定义消息。   |
| `messageId`       | String  | 消息 ID。   |
| `targetType`       | String | 会话类型。<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。  |
| `appkey`       | String | 你的 App Key。   |
| `riskType`       | String |  风险类型，例如，`无风险`、`涉政`、`仇恨言论`、`色情`、`成人内容`、`暴恐`、`违禁`、`广告`、`二维码` 和 `未知`。   |
| `eventType`       | String | 事件类型，审核服务为 `moderation`。|
| `from`      | String | 消息发送方。   |
| `to`      | String | 消息接收方：<br/> - 单聊为对端用户 ID；<br/> - 群聊时为群组 ID；<br/> - 聊天室聊天为聊天室 ID。  |
| `msg`      | String | 文本消息的内容。该参数仅在 `messageType` 为 `txt` 时存在。|
| `url`      | String | 音频消息、视频消息、图片消息中附件 URL。该参数仅在 `messageType` 为 `img`、`audio` 或 `video` 时存在。 |
| `timestamp`      | Long | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。   |