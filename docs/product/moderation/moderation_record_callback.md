# 审核回调通知

## 配置审核回调通知

审核记录支持回调，具体操作步骤如下：

1. 登录环信后台，进入**即时通讯 > 功能配置 > 消息回调**。

![img](/images/moderation/moderation_callback_01.png)

2. 点击添加回调地址，选择**发送后回调**。

![img](/images/moderation/moderation_callback_02.png)

3. 勾选 **内容审核**，其他字段的设置详见[设置回调](/document/server-side/callback.html)。

![img](/images/moderation/moderation_callback_03.png)


## 审核回调内容

完成消息审核后，环信 IM 服务器将审核结果以 POST 方式发送到你设置的 HTTP 回调通知地址。

审核结果回调的示例代码如下所示：

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
    "eventType": "moderation", 
    "from": "qa2",
    "to": "qa1",
    "url": "",
    "msg": "你好",
    "timestamp": 1668766253245
}
```

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| callId | String| 回调的标识。格式为 {appkey}_{uuid}，其中 UUID 为随机生成，作为每条回调的唯一标识。|
| moderationResult  | String  | 消息处理结果：<br/> - `PASS`：通过，直接下发消息；<br/> - `REJECT`：拒绝下发；<br/> - `EXCHANGE`：替换消息中的违规内容；<br/> - `RECALL`：撤回发送的音频和视频。 |
| providerResult | String | 审核结果：<br/> - `PASS`：消息中不包含违规内容；<br/> - `REVIEWED`：消息中疑似包含违规内容；<br/> - `REJECT`：消息存在违规内容。|
| security       | String | 签名，格式如下: MD5（callId+Secret+timestamp），其中 Secret 详见[环信 IM 管理后台](https://console.easemob.com/user/login)的回调规则。 |
| messageType       | String | 消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `custom`：自定义消息。   |
| messageId       | String  | 消息 ID。   |
| targetType       | String | 会话类型。<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。  |
| appkey       | String | 你的 App Key。   |
| eventType       | String | 事件类型，审核服务为 `moderation`。|
| from      | String | 消息发送方。   |
| to      | String | 消息接收方：<br/> - 单聊为对端用户 ID；<br/> - 群聊时为群组 ID；<br/> - 聊天室聊天为聊天室 ID。  |
| msg      | String | 文本消息的内容。该参数仅在 `messageType` 为 `txt` 时存在。|
| url      | String | 音频消息、视频消息、图片消息中附件 URL。该参数仅在 `messageType` 为 `img`、`audio` 或 `video` 时存在。 |
| timestamp       | Long | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。   |