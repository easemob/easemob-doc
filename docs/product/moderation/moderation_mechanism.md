# 消息审核机制

消息审核时，内容审核服务只对具体的消息内容进行审核，即消息的 bodies 中指定字段的内容。不同类型的消息，该字段的名称和内容不同，你需确保该字段只能传待审核的消息内容，否则会影响审核效果。本节介绍各类型消息的 bodies 中的消息内容字段。

消息示例如下所示：

```json 
{
  "msg_id": "5I02W-XX-8278a",
  "timestamp": 1403099033211,
  "direction":"outgoing",
  "to": "XXXX",
  "from": "XXXX",
  "chat_type": "chat",
  "payload":
  {
    "bodies": [    {
      }
      ],
      "ext":
      {
        "key1": "value1",     ...},
        "from":"XXXX",
        "to":"XXXX"
  }
}
```

## 文本消息

对于文本消息，内容审核服务仅对消息 bodies 中的 `msg` 字段的内容进行审核。

| 参数   | 类型   | 描述                             |
| :----- | :----- | :------------------------------- |
| `msg`  | String   | 消息内容。                       |

示例：

```json
"bodies": [{"msg":"welcome to easemob!", "type":"txt"}]
```

## 图片/语音/视频消息

对于图片、语音和视频消息，内容审核服务从文件的 URL 地址中下载文件进行审核。因此，审核服务会关注这些消息的 bodies 中的 `url` 字段。

| 参数          | 类型   | 描述                                                         |
| :------------ | :----- | :----------------------------------------------------------- |
| `url`         | String | 图片、语音或视频消息的 URL 地址。                   |

1. 图片消息 bodies 示例：

```json
"bodies": [    {       "file_length":128827,      "filename":"test1.jpg",       "secret":"DRGM8OZrEeO1vaXXXXXXXXHBeKlIhDp0GCnFu54xOF3M6KLr",       "size":{"height":1325,"width":746},       "type":"img",      "url":"https://XXXX/XXXX/chatdemoui/chatfiles/65e54a4a-XXXX-XXXX-b821-ebde7b50cc4b",   }]
```

2. 语音消息 bodies 示例：

```json
"bodies":
   [
     {
  "file_length":6630,
  "filename":"test1.amr",
  "length":10,
  "secret":"DRGM8OZrEeO1vafuJSo2IjHBeKlIhDp0GCnFu54xOF3M6KLr",
  "type":"audio",
  "url":"https://XXXX/XXXX/chatdemoui/chatfiles/0637e55a-f606-XXXX-XXXX-51f25fd1215b"
      }
   ]
```
3. 视频消息 bodies 示例：

```json
"bodies": [   {
  "file_length": 58103,
  "filename": "14XXXX.mp4",
  "length": 10,
  "secret": "VfEpSmSvEeS7yU8dwa9rAQc-DIL2HhmpujTNfSTsrDt6eNb_",
  "size":{"height":480,"width":360},
  "thumb": "https://XXXX/XXXX/chatdemoui/chatfiles/67279b20-XXXX-XXXX-8eee-21d3334b3a97",
  "thumb_secret": "ZyebKn9pEeSSfY03ROk7ND24zUf74s7HpPN1oMV-1JxN2O2I",
  "type": "video",
  "url": "https://XXXX/XXXX/chatdemoui/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"}]
```

## 自定义消息

如果使用自定义消息审核，**需首先要在[环信控制台](https://console.easemob.com/)上[开通文本审核](moderation_enable.html)和[图片审核](moderation_enable.html)，再联系商务开通自定义消息审核。**

对于提交审核的自定义消息，消息中的 `customExts` 参数必须包含 `moderation` 节点，示例如下：

```json
{
    "customExts":
    {
        "moderation": "{\"enable\": true,\"contents\":[{\"type\": \"text\",\"data\": \"你好\"}]}"
    }
}
```

`moderation` 节点中的参数描述如下表所示：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `enable`  | Boolean   | 是否进行审核。<br/> - 若需审核，必须设置为 `true`。<br/> - 若不审核，设置为 `false`。|
| `contents` | Array | 消息内容。                                 |
| `type`        | String | 消息类型。目前，审核服务只支持文本消息和图片消息，即该字段只能设置为 `text` 或 `img`。               |
| `data`        | String | 要审核的消息内容。<br/> - 对于文本消息，该字段为具体的消息内容；<br/> - 对于图片消息，该字段为图片 URL。    |








