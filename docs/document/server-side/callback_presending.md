# 发送前回调

## 概述

环信服务器收到用户发送的上行单聊、群组或聊天室消息之后、将该消息下发给目标用户之前，环信服务器会通过 HTTP/HTTPS POST 请求通知给你的应用服务器。应用服务器可以通过发送前回调实时处理用户的聊天消息，例如，拦截包含文本、图片、自定义消息等类型的消息。

- **发送前回调只对客户端发送的消息有效，不包含通过 RESTful API 发送的消息。**
- **发送前回调支持文本、图片、位置、音频、视频、文件、透传、自定义消息和合并消息。**
- **发送前回调不支持群组/聊天室的定向消息**。

![](/images/server-side/im-callback.jpeg)

## 实现步骤

1. 开通回调服务：在[环信即时通讯云控制台](https://console.easemob.com/user/login)[开通消息回调服务](/product/enable_and_configure_IM.html#开通消息回调)。
2. 配置发送前回调规则：详见[环信即时通讯云控制台](https://console.easemob.com/user/login)[规则配置说明](/product/enable_and_configure_IM.html#配置回调规则)。
3. 环信服务器向你的应用服务器发送 HTTP/HTTPS POST 请求。

## 回调规则

要使用发送前回调，你需要在[环信即时通讯云控制台](https://console.easemob.com/user/login)配置回调规则，详见[规则配置说明](/product/enable_and_configure_IM.html#配置回调规则)。

对同一 app，可针对不同消息类型配置不同的规则，也支持通过同一规则选择两种以上消息类型同时回调至一个指定服务器地址。接收到消息后，你可以根据消息类型进行分类处理。

## 与发送后回调的关系

若同时设置了消息发送前和发送后两种回调，且消息发送前回调返回拒绝，则消息发送后回调将不会被触发。

## 回调示例

请求采用 POST 方式，支持 `HTTP/HTTPS`，正文部分为 JSON 格式的字符串，字符集为 UTF-8。

### 请求 header

| 字段名         | 值                                  |
| :------------- | :---------------------------------- |
| `Content-Type` | 内容类型，请填 `application/json`。 |

### 请求示例-文本消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "msg":"welcome to easemob!", 
      "type":"txt"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-文本消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `msg`： String 类型，表示消息内容。<br/> - `type`： String 类型，表示消息类型，文本消息为 `txt`。      |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-位置消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "addr":"西城区西便门桥 ",
      "lat":39.9053,
      "lng":116.36302,
      "type":"loc"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-位置消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `addr`： String 类型，表示位置的地址描述。<br/> - `lat`：Long 类型，表示位置的纬度。 <br/> - `lng`：Long 类型，表示位置的经度。 <br/> - `type`： String 类型，表示消息类型，位置消息类型为 `loc`。      |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-图片消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "file_length": 128827,
      "filename": "test1.jpg",
      "secret": "DRGM8OZrEeO1vaXXXXXXXXHBeKlIhDp0GCnFu54xOF3M6KLr",
      "size": {
        "height": 1325,
        "width": 746
      },
      "type": "img",
      "url": "https://XXXX/XXXX/chatdemoui/chatfiles/65e54a4a-XXXX-XXXX-b821-ebde7b50cc4b"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-图片消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `file_length`： Long 类型，表示图片附件大小，单位为字节。<br/> - `filename`： String 类型，表示图片文件名称，包含文件后缀名。 <br/> - `secret`：String 类型，图片文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。<br/> - `size`：JSON 格式，表示图片的尺寸。单位为像素。`height` 表示图片高度， `width` 表示图片宽度。<br/> - `type`：String 类型，表示消息类型。图片消息为 `img`。<br/> - `url`：String 类型，表示图片 URL 地址。   |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-语音消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "file_length":6630,
      "filename":"test1.amr",
      "length":10,
      "secret":"DRGM8OZrEeO1vafuJSo2IjHBeKlIhDp0GCnFu54xOF3M6KLr",
      "type":"audio",
      "url":"https://XXXX/XXXX/chatdemoui/chatfiles/0637e55a-f606-XXXX-XXXX-51f25fd1215b"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-语音消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `file_length`： Long 类型，表示语音附件大小，单位为字节。<br/> - `filename`： String 类型，表示语音文件名称，包含文件后缀名。 <br/> - `length`：Int 类型，表示语音时长。单位为秒。 <br/> - `secret`：String 类型，语音文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 <br/> - `type`：String 类型，表示消息类型。语音消息为 `audio`。<br/> - `url`：String 类型，表示语音文件的 URL 地址。  |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-视频消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "file_length": 58103,
      "filename": "14XXXX.mp4",
      "length": 10,
      "secret": "VfEpSmSvEeS7yU8dwa9rAQc-DIL2HhmpujTNfSTsrDt6eNb_",
      "size":{"height":480,"width":360},
      "thumb": "https://XXXX/XXXX/chatdemoui/chatfiles/67279b20-XXXX-XXXX-8eee-21d3334b3a97",
      "thumb_secret": "ZyebKn9pEeSSfY03ROk7ND24zUf74s7HpPN1oMV-1JxN2O2I",
      "type": "video",
      "url": "https://XXXX/XXXX/chatdemoui/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-视频消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `file_length`： Long 类型，表示视频附件大小。单位为字节。<br/> - `filename`： String 类型，表示视频文件名称，包含文件后缀名。 <br/> - `length`：Int 类型，表示视频时长。单位为秒。 <br/> - `secret`：String 类型，视频文件的访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 <br/> - `size`：JSON 格式，表示视频缩略图尺寸。单位为像素。`height` 表示视频缩略图的高度，`width` 表示视频缩略图的宽度。<br/> - `thumb`：视频缩略图的 URL 地址，格式为 https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}。其中，`file_uuid` 为视频缩略图上传后，环信服务器返回的缩略图的 UUID。 <br/> - `thumb_secret`：缩略图文件访问密钥。如果文件上传时设置了文件访问限制，则该字段存在。<br/> - `type`：String 类型，表示消息类型。视频消息为 `video`。<br/> - `url`：String 类型，表示视频文件的 URL 地址。  |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-文件消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "file_length":3279,
      "filename":"record.md",
      "secret":"2RNXCgeeEeeXXXX-XXXXbtZXJH4cgr2admVXn560He2PD3RX",
      "type":"file",
      "url":"https://XXXX/XXXX/XXXX/chatfiles/d9135700-XXXX-XXXX-b000-a7039876610f"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-文件消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `file_length`： Long 类型，表示文件大小。单位为字节。<br/> - `filename`： String 类型，表示文件名称，包含文件后缀名。<br/> - `secret`：String 类型，文件的访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。<br/> - `type`：String 类型，表示消息类型。文件消息为 `file`。<br/> - `url`：String 类型，表示文件的 URL 地址。你可以访问该 URL 下载历史消息文件。 |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-透传消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "action":"run",
      "type":"cmd"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-透传消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `action`： String 类型，表示命令内容。<br/> - `type`： String 类型，表示消息类型，透传消息为 `cmd`。      |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-自定义消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "v2:customExts": {
            "name": "flower",
            "size": "16",
            "price": "100"
        },
        "customExts": [
            {
                "name": "flower"
            },
            {
                "size": "16"
            },
            {
                "price": "100"
            }
        ],
        "customEvent": "gift_1",
        "type": "custom"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-自定义消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `customExts`/`v2:customExts`： Array/JSON 类型，用户自定义的事件属性。该参数为可选，不需要可以不传。`customExts` 为旧版参数，数组类型，最多可包含 16 个元素。`v2:customExts` 为新版参数，Map<String,String> 类型，最多可以包含 16 个元素。推荐使用该新版参数。<br/> - `customEvent`：String 类型，自定义事件类型。<br/> - `type`： String 类型，表示消息类型，自定义消息为 `custom`。      |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 请求示例-合并消息

```json
{
    "callId":"XXXX-XXXX#test_0990a64f-XXXX-XXXX-8696-cf3b48b20e7e",
    "timestamp":1600060847294,
    "chat_type":"groupchat",
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload": {
      "combineLevel": 1,
      "file_length": 550,
      "filename": "17289718748990036",
      "secret": "a_OTmoq6Ee-CygH0PRzcUyFniZDmSsX1ur0j-9RtCj3tK6Gr",
      "subType": "sub_combine",
      "summary": ":yyuu\n:[图片]\n:[文件]\n",
      "title": "聊天记录",
      "url": "https://XXXX/XXXX/XXXX/chatfiles/6bf39390-8aba-11ef-a8ae-6f545c50ca23"
    },
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求包字段说明-合并消息

| 参数              | 类型    |
| :---------------- | :--------------------------------------- |
| `callId`          | `callId` 为 `{appkey}_{uuid}`，其中 `uuid` 为随机生成，作为每条回调的唯一标识。  |
| `timestamp`       | 环信 IM 服务器接收到此消息的时间戳。       |
| `chat_type`       | 聊天类型：`chat` 为单聊，`group` 为群组聊天，`chatroom` 为聊天室。|
| `group_id`        | 回调消息所在的群组或聊天室。该参数仅对群组聊天或聊天室中的消息回调生效。        |
| `from`            | 消息的发送方。      |
| `to`              | 消息的接收方。单聊为消息接收方，群组聊天和聊天室为群组 ID 和聊天室 ID。  |
| `msg_id`          | 消息的 ID。   |
| `payload`         | 消息内容，与通过 REST API 发送过来的一致：<br/> - `combineLevel`：Int 类型，合并消息的嵌套层级数。<br/> - `file_length`： Int 类型，表示合并消息附件的大小，单位为字节。<br/> - `filename`： String 类型，表示合并消息的附件名称。<br/> - `secret`：String 类型，文件的访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。<br/> - `subType`：String 类型，表示消息类型为合并消息。<br/> - `summary`：String 类型，合并消息的概要。<br/> - `title`：合并消息的标题。<br/> - `url`：String 类型，表示合并消息的附件的 URL 地址。你可以访问该 URL 下载该附件。  |
| `security`        | 签名，格式如下: MD5（callId+Secret+timestamp）。Secret 见 [环信即时通讯云控制台](https://console.easemob.com/user/login)[回调规则](/product/enable_and_configure_IM.html#配置回调规则)。 |

### 响应示例

```json
{
  "valid": true,
  "code": "HX:10000",
  "chatroom_msg_level": "high",
  "payload": {
    // 具体的消息内容。
    // 仅支持文本类型消息。
  }
}
```

### 响应字段说明

消息发送到你的应用服务器后，应用服务器需返回 HTTP 响应码 200 和 `valid` 属性，根据 `valid` 状态决定是否进行下发。环信服务若未收到响应或你的应用服务器没有返回 `valid` 状态，该条消息会根据默认设置（规则中的**调用失败时默认策略**）处理，不会重试；后续消息依然正常执行回调。

响应内容不能超过 1,000 个字符，否则环信服务器会认为是攻击，导致回调失败。

| 参数      | 类型   | 是否必需<div style="width: 80px;"></div> | 描述      |
| :-------- | :----- | :----------------- | :----------- |
| `valid`   | bool   | 是   | 根据你的服务器设定的规则判断消息是否合法：<br/> - `true` ：消息合法，环信服务器应下发该消息；`false` ：消息非法，环信服务器应拦截该消息。|
| `chatroom_msg_level`   | String   | 否   | 聊天室消息的优先级：<br/> - `high`：高<br/> - `normal`：普通<br/> - `low`：低|
| `code`    | String | 否    | 客户端上报的自定义发送前回调错误。环信控制台上的**发送前回调**页面中的**消息拦截报错时显示**设置为**报错** 时，该 `code` 的内容为客户端提示的错误。错误分为以下几种情况：<br/> - 若 `code` 的内容为字符串类型，客户端上的错误为该参数的内容；<br/> - 响应中不包含 `code` 字段， 客户端提示 `custom logic denied`；<br/> - 若 `code` 为空字符串，移动客户端提示 `Message blocked by external logic` 错误；<br/> - 若在指定时间内未收到应答包，则按默认配置处理，客户端提示 `custom internal error` 错误；<br/> - 如果返回的应答包出现错误，包括缺少必填字段 `valid` 或字段类型不符合约定类型，客户端提示 `custom internal error` 错误。|
| `payload` | Object | 否   | 修改后的消息内容。若无需修改消息内容，**请勿传该参数**。若需修改消息内容，可以回传修改后的内容，格式需与传入的消息内容一致。<br/> - 目前，默认仅支持文本消息的消息内容和扩展信息，并且消息大小不能超过 1 KB。<br/> - 若要支持修改图片、音频、视频、位置和自定义类型的相关内容和扩展信息（消息大小不能超过 5 KB），需要联系商务。注意，对于附件类型的消息，若要修改 `url` 字段，需关闭访问限制开关，否则端上可能因访问密钥（secret）验证失败，导致下载附件失败。<br/> - 不支持修改透传消息。  |

## 常见问题

1. Q: 发送前回调响应中的 `valid` 为 `false`，但为什么消息还是下发了？

   A：可能是你的服务器在发送前回调规则中配置的等待时间内未返回响应。这种情况下，如果你在环信控制台的发送前回调规则页面配置的**调用失败时默认策略**为**放行**，消息则会下发。为了避免这种情况，建议将**等待响应时间**（**即时通讯** > **功能配置** > **消息回调** > **添加回调地址** > **发送前回调**，默认为 200 毫秒）参数的值提升，例如，增加至 3000 毫秒。