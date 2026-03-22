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

自定义消息支持文本内容与图片 URL 审核：

- 文本内容匹配文本审核规则
- 图片 URL 匹配图片审核规则

使用前请确保：

1. 已在 [环信控制台](https://console.easemob.com/) 分别开通 [文本审核](https://moderation_enable.html/) 与  [图片审核](https://moderation_enable.html/) 服务。
2. 已联系商务团队开通自定义消息审核功能。

对于需审核的自定义消息，在 `customExts` 参数中必须包含 `moderation` 节点，格式如下：

```json
{
    "customExts":
    {
        "moderation": "{\"enable\": true,\"contents\":[{\"type\": \"text\",\"data\": \"你好\"}]}"
    }
}
```

`moderation` 节点中的参数说明如下：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `enable`  | Boolean   | 是否启用审核。<br/> - 若需审核，必须设为 `true`。<br/> - 若不审核，设为 `false`。|
| `contents` | Array | 消息内容。                                 |
| `type`        | String | 消息类型。当前仅支持文本与图片消息，可选值为 `text` 或 `img`。  |
| `data`        | String | 要审核的消息内容。<br/> - 文本消息：该字段为具体的消息内容，匹配文本审核规则；<br/> - 图片消息：该字段为图片 URL，匹配图片审核规则。    |








