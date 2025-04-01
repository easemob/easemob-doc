# 发送消息

单聊、群聊、聊天室中发消息回调的公共参数如下表所示：

| 参数 | 类型   | 描述 |
| :---------------- | :----- |:------------------------------------------------------------------|
| `callId`    | String   | `callId` 为每个回调请求的唯一标识，格式为 “App Key_发送的消息的 ID”。 | 
| `eventType`       | String | “chat” 上行消息、“chat_offline” 离线消息。                      |
| `timestamp`       | long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为毫秒。                           |
| `chat_type`       | String | 会话类型（默认全选）：<br/> - "chat"：单聊回调；<br/> - "groupchat"：群聊回调包含了群组和聊天室的消息回调；<br/> - "notify"：通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 type 字段确定具体类型。 |
| `group_id`        | String | 当 `chat_type` 为 `groupchat` 有此参数，表示回调消息所在的群组或聊天室。                |
| `from`            | String | 消息的发送方。     |
| `to`              | String | 消息的接收方。   |
| `msg_id`    | String   | 发送的消息 ID。 | 
| `payload`         | object | 事件内容，与通过 REST API 发送过来的一致，查看 [历史消息内容](message_historical.html#历史消息记录的内容)。      |
| `securityVersion` | String | 安全校验版本，目前为 1.0.0。忽略此参数，以后会改成 Console 后台做设置。                   |
| `security`        | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。 Secret 见 Console 后台回调规则。     |
| `appkey`          | String | 你在环信管理后台注册的应用唯一标识。        |
| `host`            | String | 服务器名称。              |
| `content_type`            | String | 消息类型：<br/> - `chat:user:*`：单聊消息  <br/> - `chat:group:*`：群组消息   <br/> - `chat:room:*`：聊天室消息  <br/>  文本、图片、音视频等消息对应的参数值，详见[发送单聊消息](#发送单聊消息)、[发送群组消息](#发送群组消息)和[发送聊天室消息](#发送聊天室消息)章节。   |

## 发送单聊消息

本节展示发送各类消息后，环信服务器向你的 App Server 发送的回调请求的包体示例。

| content_type         | payload 中类型                | 触发事件           |
| :----------- | :---------------------------- | :----------------- |
| chat:user:*         | -                          | 单聊中发送任何类型的消息     |
| chat:user:text     | {“bodies”:{“type”:“txt”}}     | 单聊中发送文本消息   |
| chat:user:image     | {“bodies”:{“type”:“img”}}     | 单聊中发送图片消息   |
| chat:user:voice   | {“bodies”:{“type”:“audio”}}   | 单聊中发送语音消息   |
| chat:user:location     | {“bodies”:{“type”:“loc”}}     | 单聊中发送位置消息   |
| chat:user:video   | {“bodies”:{“type”:“video”}}   | 单聊中发送视频消息   |
| chat:user:file    | {“bodies”:{“type”:“file”}}    | 单聊中发送文件消息   |
| chat:user:command     | {“bodies”:{“type”:“cmd”}}     | 单聊中发送命令消息   |
| chat:user:custom  | {“bodies”:{“type”:“custom”}}  | 单聊中发送自定义消息 |
| chat:user:txt  | {“bodies”:{“type”:“txt”,“subType”:“sub_combine”}}  | 单聊中发送合并消息 | 
| chat:user:unknown | {“bodies”:{“type”:“unknown”}} | 单聊中发送未知消息   |

### 文本和命令消息

下面的示例以文本消息为例展示回调请求中 payload：

| 字段     | 数据类型 | 描述                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | String    | 消息内容。                                                   |
| `type`   | String   | 消息类型：<br/> - 文本消息：`txt` <br/> - 命令消息：`cmd` |

```json
"payload":{
    "ext":{},
    "bodies":[{"msg":"rr","type":"txt"}]
}
```

### 图片消息

| 字段          | 类型   | 描述                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | Json   | 消息扩展字段。                                             |
| `bodies`      | object | 该回调的主体内容，包含以下六个字段 `filename`，`secret`，`file_length`，`size`，`url`，`type`。 |
| `filename`    | String | 图片名称。                                                   |
| `secret`      | String | 成功上传文件后返回的 `secret`。                              |
| `file_length` | Int    | 图片文件大小（单位：字节）。                                 |
| `size`        | Json   | 图片尺寸：`height`：高度，`width`：宽度。                    |
| `url`         | String | 域名 `/orgname/appname/chatfiles/` 成功上传文件返回的 UUID。参考请求示例。 |
| `type`        | String | 消息类型：`img` |

回调请求的包体示例：

```json
"payload":{
    "ext":{},
    "bodies":[{
        "filename":"image",
        "size":{"width":746,"height":1325},
        "secret":"EsYYqnkREeyZAUHNhFQyIhTJxWxvGOwyx1",
        "file_length":118179,
        "type":"img",
        "url":"https://XXXX.com/"
    }]
}
```

### 语音消息

| 字段          | 类型   | 描述                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | JSON   | 消息扩展字段。                                             |
| `filename`    | String | 文件名称。                                                   |
| `secret`      | String | 成功上传文件后返回的 secret。                                |
| `file_length` | Long   | 语音文件大小（单位：字节）。                                 |
| `Length`      | Int    | 语音时间（单位：秒）。                                       |
| `url`         | String | 域名 `/org_name/app_name/chatfiles/` 成功上传文件返回的 UUID。 |
| `type`        | String | 消息类型：`audio` |

回调请求的包体示例：

```json
"payload":{
    "ext":{},
    "bodies":[{
        "filename":"audio",
        "length":4,
        "secret":"anmSynkREey91e0Ksmmt2Ym6AzpRr9SxsUpF",
        "file_length":6374,
        "type":"audio",
        "url":"https://XXXX.com/"
    }]
}
```

### 视频消息

| 字段           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `ext`          | JSON   | 消息扩展字段。                                             |
| `bodies`       | object | 该回调的主体内容，包含以下字段 `thumb_secret`、`thumb`、`filename`，`secret`，`file_length`，`size`，`url`，`type`。 |
| `thumb_secret` | String | 成功上传视频缩略图后返回的 secret。                          |
| `filename`     | String | 文件名称。                                                   |
| `size`         | JSON   | 缩略图图片尺寸：`height`：高度，`width`：宽度。              |
| `thumb`        | String | 成功上传视频缩略图返回的 UUID。                              |
| `secret`       | String | 成功上传视频文件后返回的 secret。                            |
| `length`       | Int    | 视频播放长度。                                               |
| `file_length`  | Long   | 视频文件大小，单位为字节。                                 |
| `type`         | String | 消息类型：`video`    |
| `url`          | String | 视频文件的 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`，其中 `file_uuid` 为视频文件 ID。成功上传视频文件后，从文件上传的响应 body 中获取。  |

回调请求的包体示例：

```json
"payload":{
    "ext":{},
    "bodies":[{
        "thumb_secret":"t1AECnqLEeyS81-d10_HOpjSZc8TD-ud40pFCkOStQrr7Mbc",
        "filename":"video.mp4",
        "size":{
          "width":360,
          "height":480},
        "thumb":"https://XXXX.com/XXXX/XXXX/chatfiles/b7500400-7a8b-11ec-8d83-7106bf6633e6",
        "length":10,
        "secret":"uFtZgHqLEeycBfuoalZCJPD7PVcoOu_RHTRa78bjU_KQAPr2",
        "file_length":601404,
        "type":"video",
        "url":"https://XXXX.com/XXXX/XXXX/chatfiles/b85b3270-7a8b-11ec-9735-6922a85eb891"
    }]
}
```

### 文件消息

| 参数          | 类型   | 描述         |
| :------------ | :----- | :---------------- |
| `ext`          | JSON   | 消息扩展字段。     |
| `bodies`       | object | 该回调的主体内容，包含以下字段 `file_length`、`filename`、`secret`、`type` 和 `url`。 |
| `file_length`  | Long   | 文件大小。单位为字节。   |
| `filename`     | String | 文件名称，包含文件后缀名。     |
| `secret`       | String | 文件访问密钥。如果 [文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。 |
| `type`         | String | 消息类型。文件消息为 `file`。  |
| `url`          | String | 文件的 URL 地址。你可以访问该 URL 下载历史消息文件。  |

回调请求的包体示例：

```json
"payload":{
    "ext":{},
    "bodies":[{
        "file_length":3279,
        "filename":"record.md",
        "secret":"2RNXCgeeEeeXXXX-XXXXbtZXJH4cgr2admVXn560He2PD3RX",
        "type":"file",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/d9135700-XXXX-XXXX-b000-a7039876610f"
    }]
}
```

### 位置消息

| 字段   | 类型   | 描述             |
| :----- | :----- | :--------------- |
| `lat`  | String | 纬度。           |
| `type` | String   | 消息类型。位置消息为 `loc`。 |
| `lng`  | String | 经度。           |
| `addr` | String | 位置的文字描述。 |

回调请求的包体示例：

```json
"payload":{
    "ext":{},
    "bodies":[{
        "lng":116.32309156766605,
        "type":"loc",
        "addr":"********",
        "lat":39.96612729238626
    }]
}
```

### 自定义消息

| 参数          | 类型 | 描述                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `customEvent` | String   | 用户自定义的事件类型，必须是 String，值必须满足正则表达式。 [a-zA-Z0-9-_/.]{1,32}，最短 1 个字符 最长 32 个字符。 |
| `customExts`/`v2:customExts`  | Array/JSON     | 用户自定义的事件属性。该参数为可选，不需要可以不传。<br/> - `customExts` 为旧版参数，数组类型，最多可包含 16 个元素。<br/> - `v2:customExts` 为新版参数，Map<String,String> 类型，最多可以包含 16 个元素。推荐使用该新版参数。 |
| `from`        | String   | 表示消息发送者;无此字段 Server 会默认设置为 “from”:“admin”，有 from 字段但值为空串 (“”) 时请求失败。 |
| `ext`         | JSON     | 扩展属性，支持 app 自定义内容。可以没有这个字段；但是如果有，值不能是 “ext:null” 这种形式，否则会发生错误。 |

回调请求的包体示例：

```json
"payload": {
    "ext": {}, 
    "bodies": [{ 
        "customExts": [ {"name": 1 } ],
        "v2:customExts":{"k":"v","k1":"v1"},
        "customEvent": "flower", 
        "type": "custom" 
    }] 
}
```

### 合并消息

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `combineLevel`  | Int   | 合并消息的嵌套层级数。 |
| `file_length` | Int | 合并消息附件的大小，单位为字节。               |
| `filename`        | String | 合并消息的附件名称。     |
| `msg`        | String | 合并消息的兼容文本。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。      |
| `secret`        | String | 合并消息附件的访问密钥。如果[文件上传](message_download.html#上传文件) 时设置了文件访问限制，则该字段存在。  |
| `subType`        | String | 消息类型。合并消息为 `sub_combine`。       |
| `summary`        | String | 合并消息的概要。                |
| `title`        | String | 合并消息的标题。                |
| `url`        | String | 合并消息的附件的 URL 地址。你可以访问该 URL 下载该附件。                |
| `ext`        | JSON | 合并消息的扩展信息。                |
| `from`        | String | 合并消息的发送方的用户 ID。                |
| `to`        | String | 接收方的用户 ID。                |
| `type`        | String | 会话类型：<br/> - `chat`: 单聊；<br/> - `groupchat`: 群聊；<br/> - `chatroom`: 聊天室。              |

例如，下面示例为源消息包括文本、图片和文件消息的合并消息格式：

```json
  "payload": {
        "bodies": [
            {
                "combineLevel": 1,
                "file_length": 1059,
                "filename": "17326799853580001",
                "msg": "当前版本过低，无法展示对应内容。",
                "secret": "CeycYKx0Ee-I3fU0d5v4X9BduteO1RZNVsePAgkDQ9sxoVJM",
                "subType": "sub_combine",
                "summary": "wzy1: 你在哪里？\nwzy1: 你在哪里？\nwzy1: 你在哪里？",
                "title": "聊天记录",
                "type": "txt",
                "url": "https://a1-hsb.easemob.com/easemob-demo/testy/chatfiles/09ec7550-ac74-11ef-83ce-4719989e3c82"
            }
        ],
        "ext": {
            "ease_chat_uikit_user_info": {
                "nickname": "公子小白有点黑"
            }
        },
        "from": "user1",
        "to": "user2",
        "type": "chat"
    }
```        

## 发送群组消息

本节介绍在群组中发送各类消息后，环信服务器向你的 App Server 发送的回调请求的包体示例。

| content_type             | payload 中类型                | 触发事件           |
| :---------------- | :---------------------------- | :----------------- |
| chat:group:*        | -                             | 群组中发送任何类型的消息     |
| chat:group:text     | {“bodies”:{“type”:“txt”}}     | 群组中发送文本消息   |
| chat:group:image     | {“bodies”:{“type”:“img”}}     | 群组中发送图片消息   |
| chat:group:voice   | {“bodies”:{“type”:“audio”}}   | 群组中发送语音消息   |
| chat:group:location    | {“bodies”:{“type”:“loc”}}     | 群组中发送位置消息   |
| chat:group:video   | {“bodies”:{“type”:“video”}}   | 群组中发送视频消息   |
| chat:group:file    | {“bodies”:{“type”:“file”}}    | 群组中发送文件消息   |
| chat:group:command     | {“bodies”:{“type”:“cmd”}}     | 群聊中发送命令消息   |
| chat:group:custom  | {“bodies”:{“type”:“custom”}}  | 群组中发送自定义消息 |
| chat:group:txt  | {“bodies”:{“type”:“txt”,“subType”:“sub_combine”}}  | 群组中发送合并消息 |
| chat:group:unknown | {“bodies”:{“type”:“unknown”}} | 群组中发送未知消息   |

回调请求的包体中的主要字段和示例如下所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | String   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

群组消息的 payload 与单聊消息相同，详见[发送单聊消息](#发送单聊消息)。

```json
{
    "callId":"{appkey}_8924312242322", 
    "eventType":"chat_offline",
    "timestamp":1600060847294,
    "chat_type":"groupchat", 
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload":{
        // 具体的消息内容
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
 }
```

## 发送聊天室消息

本节介绍在聊天室中发送各类消息后，环信服务器向你的 App Server 发送的回调请求的包体示例。

| content_type             | payload 中类型                | 触发事件             |
| :--------------- | :---------------------------- | :------------------- |
| chat:room:*         | -                             | 聊天室中发送任何类型的消息     |
| chat:room:text     | {“bodies”:{“type”:“txt”}}     | 聊天室中发送文本消息   |
| chat:room:image    | {“bodies”:{“type”:“img”}}     | 聊天室中发送图片消息   |
| chat:room:voice   | {“bodies”:{“type”:“audio”}}   | 聊天室中发送语音消息   |
| chat:room:location     | {“bodies”:{“type”:“loc”}}     | 聊天室中发送位置消息   |
| chat:room:video   | {“bodies”:{“type”:“video”}}   | 聊天室中发送视频消息   |
| chat:room:file    | {“bodies”:{“type”:“file”}}    | 聊天室中发送文件消息   |
| chat:room:command     | {“bodies”:{“type”:“cmd”}}     | 聊天室中发送命令消息   |
| chat:room:custom  | {“bodies”:{“type”:“custom”}}  | 聊天室中发送自定义消息 |
| chat:room:txt  | {“bodies”:{“type”:“txt”,“subType”:“sub_combine”}}  | 聊天室中发送合并消息 |
| chat:room:unknown | {“bodies”:{“type”:“unknown”}} | 聊天室中发送未知消息   |

回调请求的包体中的主要字段和示例如下所示：

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

```json
{
    "callId":"{appkey}_8924312242322",
    "eventType":"chat_offline",
    "timestamp":1600060847294,
    "chat_type":"groupchat", 
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322", 
    "payload":{
        // 具体的消息内容
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

聊天室消息的 payload 与单聊消息相同，详见[发送单聊消息](#发送单聊消息)。