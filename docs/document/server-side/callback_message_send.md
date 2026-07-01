# 消息发送回调事件

## 功能说明

成功发送消息后，环信服务器会按照 [发送后回调规则](/product/console/basic_webhook.html#配置消息回调规则) 向你的 App Server 发送回调请求，App Server 可通过该回调查看发送的消息，进行数据同步。

单聊、群组和聊天室消息的回调请求均包含一组公共参数，详见 [公共参数](#公共参数)。不同消息类型的 `payload` 字段结构有所不同，下文将分别介绍。

## 前提条件

- 已开通发送后回调服务。详见 [开通消息回调服务](/product/console/basic_webhook.html#开通服务) 和 [回调说明](/document/server-side/callback_postsending.html)。
- 已在 [环信控制台](https://console.easemob.com/user/login) 设置发送后回调规则。详见 [配置回调规则](/product/console/basic_webhook.html#配置消息回调规则)。

## 公共参数

单聊、群聊、聊天室中发消息回调请求的公共参数如下表所示：

| 参数 | 类型   | 描述 |
| :---------------- | :----- |:------------------------------------------------------------------|
| `callId`    | String   | 回调请求的唯一标识，格式为 `{App Key}_{发送的消息的ID}`。 | 
| `eventType`       | String | 事件类型：`chat`（上行消息）、`chat_offline`（离线消息）。                    |
| `timestamp`       | long   | 环信服务器接收到该消息的 Unix 时间戳，单位为毫秒。                           |
| `chat_type`       | String | 会话类型（默认全选）：<br/> - `chat`：单聊回调；<br/> - `groupchat`：群聊回调包含了群组和聊天室的消息回调；<br/> - `notify`：通知回调包含了消息话题（Thread）和表情回复（Reaction）的回调，需结合 `payload` 中的 `type` 字段确定具体类型。 |
| `group_id`        | String | 当 `chat_type` 为 `groupchat` 时存在，表示回调消息所在的群组或聊天室。                |
| `from`            | String | 消息发送方。     |
| `to`              | String | 消息接收方。   |
| `msg_id`    | String   | 发送的消息 ID。 | 
| `payload`         | object | 事件内容，与通过 REST API 发送的消息内容一致，查看 [历史消息内容](message_historical.html#历史消息记录的内容)。      |
| `securityVersion` | String | 安全校验版本，当前为 `1.0.0`。请忽略此参数，以后会改成 Console 后台做设置。                   |
| `security`        | String | 签名，格式为 `MD5（callId+secret+timestamp）`。 `Secret` 见控制台 [回调规则配置](/product/console/basic_webhook.html#配置消息回调规则)。     |
| `appkey`          | String | 你在环信控制台注册的应用唯一标识。        |
| `host`            | String | 服务器名称。              |
| `content_type`            | String | 消息类型：<br/> - `chat:user:*`：单聊消息  <br/> - `chat:group:*`：群组消息   <br/> - `chat:room:*`：聊天室消息  <br/>  各类消息对应的具体参数值，详见[发送单聊消息](#发送单聊消息)、[发送群组消息](#发送群组消息)和[发送聊天室消息](#发送聊天室消息)章节。   |

## 调用时机

- 客户端上在单聊、群组聊天和聊天室中 [发送了消息](/document/android/message_send.html#发送文本消息)。
- 调用 REST API 在[单聊](/document/server-side/message_single.html#发送文本消息)、[群组聊天](/document/server-side/message_group.html#发送文本消息) 和 [聊天室](/document/server-side/message_chatroom.html#发送文本消息) 中 发送了消息。
- 在控制台上在[单聊](/product/console/operation_user.html#发送-rest-消息)、[群组聊天](/product/console/operation_group.html#发送-rest-消息) 和 [聊天室](/product/console/operation_chatroom.html#聊天室审核管理) 中 发送了消息。

## 发送单聊消息

### 文本和透传消息

#### 请求示例

发送文本消息的回调请求中的 `payload` 字段如下所示。透传消息的回调请求结构与文本消息相同，`type` 字段值为 `cmd`。

```json
"payload":{
    "ext":{},
    "bodies":[{"msg":"rr","type":"txt"}]
}
```

#### 请求字段说明

下表为发送文本消息的回调请求中的 `payload` 字段：

| 字段     | 数据类型 | 描述                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含 `msg`，`type` 两个字段。           |
| `msg`    | String    | 消息内容。                                                   |
| `type`   | String   | 消息类型：<br/> - 文本消息：`txt` <br/> - 透传消息：`cmd` |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 图片消息

#### 请求示例

发送图片消息的回调请求中的 `payload` 字段：

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

#### 请求字段说明

下表为发送图片消息的回调请求中 `payload` 字段：

| 字段          | 类型   | 描述                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | Json   | 消息扩展字段。                                             |
| `bodies`      | object | 该回调的主体内容，包含 `filename`、`secret`、`file_length`、`size`、`url` 和 `type` 字段。 |
| `filename`    | String | 图片名称。                                                   |
| `secret`      | String | 成功上传文件后返回的访问密钥。                              |
| `file_length` | Int    | 图片文件大小，单位为字节。                                 |
| `size`        | Json   | 图片尺寸：`height`：高度；`width`：宽度。                    |
| `url`         | String | 域名 `/orgname/appname/chatfiles/` 成功上传文件返回的 UUID。参考请求示例。 |
| `type`        | String | 消息类型：`img` |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 语音消息

#### 请求示例

发送语音消息的回调请求中 `payload` 字段：

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

#### 请求字段说明

下表为发送图片消息的回调请求中 `payload` 字段：

| 字段          | 类型   | 描述                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | JSON   | 消息扩展字段。                                             |
| `bodies`      | object | 消息主体内容，包含 `filename`、`length`、`secret`、`file_length`、`type` 和 `url` 字段。 |
| `filename`    | String | 文件名称。                                                   |
| `secret`      | String | 成功上传文件后返回的 secret。                                |
| `file_length` | Long   | 语音文件大小（单位：字节）。                                 |
| `length`      | Int    | 语音时间（单位：秒）。                                       |
| `url`         | String | 域名 `/org_name/app_name/chatfiles/` 成功上传文件返回的 UUID。 |
| `type`        | String | 消息类型：`audio` |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 视频消息

#### 请求示例

发送视频消息的回调请求中 `payload` 字段：

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

#### 请求字段说明

下表为发送图片消息的回调请求中 `payload` 字段：

| 字段           | 类型   | 描述                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `ext`          | JSON   | 消息扩展字段。                                             |
| `bodies`       | object | 该回调的主体内容，包含以下字段 `thumb_secret`、`thumb`、`filename`、`secret`、`file_length`、`size`、`url` 和 `type`。 |
| `thumb_secret` | String | 成功上传视频缩略图后返回的访问密钥。                          |
| `filename`     | String | 视频文件名称。                                                   |
| `size`         | JSON   | 缩略图图片尺寸：`height`：高度；`width`：宽度。              |
| `thumb`        | String | 成功上传视频缩略图返回的 UUID。                              |
| `secret`       | String | 成功上传视频文件后返回的访问密钥。                            |
| `length`       | Int    | 视频播放长度。                                               |
| `file_length`  | Long   | 视频文件大小，单位为字节。                                 |
| `type`         | String | 消息类型，视频消息为 `video`。   |
| `url`          | String | 视频文件的 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`，其中 `file_uuid` 为视频文件 ID。成功上传视频文件后，从文件上传的响应 body 中获取。  |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 文件消息

#### 请求示例

发送文件消息的回调请求中 `payload` 字段：

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

#### 请求字段说明

下表为发送文件消息的回调请求中 `payload` 字段：

| 参数          | 类型   | 描述         |
| :------------ | :----- | :---------------- |
| `ext`          | JSON   | 消息扩展字段。     |
| `bodies`       | object | 该回调的主体内容，包含 `file_length`、`filename`、`secret`、`type` 和 `url` 字段。 |
| `file_length`  | Long   | 文件大小。单位为字节。   |
| `filename`     | String | 文件名称，包含后缀名。     |
| `secret`       | String | 文件访问密钥。如果 [文件上传](message_upload_file.html) 时设置了文件访问限制，则该字段存在。 |
| `type`         | String | 消息类型。文件消息为 `file`。  |
| `url`          | String | 文件的 URL 地址。你可以访问该 URL 下载历史消息文件。  |


回调请求的其他参数详见 [公共参数](#公共参数)。

### 位置消息

#### 请求示例

发送位置消息的回调请求中的 `payload` 字段：

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

#### 请求字段说明

下表为发送文件消息的回调请求中的 `payload` 字段：

| 字段   | 类型   | 描述             |
| :----- | :----- | :--------------- |
| `lat`  | String | 纬度。           |
| `type` | String   | 消息类型。位置消息为 `loc`。 |
| `lng`  | String | 经度。           |
| `addr` | String | 位置的文字描述。 |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 自定义消息

#### 请求示例

发送自定义消息的回调请求中的 `payload` 字段：

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

#### 请求字段说明

下表为发送自定义消息的回调请求中的 `payload` 字段：

| 参数          | 类型 | 描述                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `customEvent` | String   | 用户自定义的事件类型，必须为字符串，长度 1–32 个字符，值必须符合正则表达式 `[a-zA-Z0-9-_/.]{1,32}`。 |
| `customExts`/`v2:customExts`  | Array/JSON     | 用户自定义的事件属性。该参数为可选，不需要可以不传。<br/> - `customExts` 为旧版参数，数组类型，最多可包含 16 个元素。<br/> - `v2:customExts` 为新版参数，Map<String,String> 类型，最多包含 16 个元素。推荐使用该新版参数。 |
| `from`        | String   | 消息发送方。该字段为可选，不传时服务端默认赋值为 `admin`；若传入但值为空字符串 ""，则请求将被拒绝。 |
| `ext`         | JSON     | 扩展属性字段，用于存放应用自定义内容。该字段为可选，若未提供则忽略；若提供，其值不能为字符串 `ext:null`，否则会导致错误。 |

回调请求的其他参数详见 [公共参数](#公共参数)。

### 合并消息

#### 请求示例

以下示例为包含文本、图片和文件消息的合并消息的 `payload` 格式：

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

#### 请求字段说明

下表为发送合并消息的回调请求中 `payload` 字段：

| 参数          | 类型   | 描述                                             |
| :------------ | :----- | :----------------------------------------------- |
| `combineLevel`  | Int   | 合并消息的嵌套层级数。 |
| `file_length` | Int | 合并消息附件的大小，单位为字节。               |
| `filename`        | String | 合并消息的附件名称。     |
| `msg`        | String | 合并消息的兼容文本。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。      |
| `secret`        | String | 合并消息附件的访问密钥。如果[文件上传](message_upload_file.html) 时设置了文件访问限制，则该字段存在。  |
| `subType`        | String | 消息类型。合并消息为 `sub_combine`。       |
| `summary`        | String | 合并消息的概要。                |
| `title`        | String | 合并消息的标题。                |
| `url`        | String | 合并消息附件的访问地址。                |
| `ext`        | JSON | 扩展信息。                |
| `from`        | String | 合并消息的发送方的用户 ID。                |
| `to`        | String | 接收方用户 ID。                |
| `type`        | String | 会话类型：<br/> - `chat`: 单聊；<br/> - `groupchat`: 群聊；<br/> - `chatroom`: 聊天室。              |

回调请求的其他参数详见 [公共参数](#公共参数)。

## 发送群组消息

本节介绍在群组中发送各类消息后，环信服务器向你的 App Server 发送的回调请求的包体示例。

| content_type          | payload 中类型                                      | 触发事件                 |
| :-------------------- | :-------------------------------------------------- | :----------------------- |
| `chat:group:*`        | -                                                   | 群组中发送任何类型的消息 |
| `chat:group:text`     | `{"bodies":{"type":"txt"}}`                         | 群组中发送文本消息       |
| `chat:group:image`    | `{"bodies":{"type":"img"}}`                         | 群组中发送图片消息       |
| `chat:group:voice`    | `{"bodies":{"type":"audio"}}`                       | 群组中发送语音消息       |
| `chat:group:location` | `{"bodies":{"type":"loc"}}`                         | 群组中发送位置消息       |
| `chat:group:video`    | `{"bodies":{"type":"video"}}`                       | 群组中发送视频消息       |
| `chat:group:file`     | `{"bodies":{"type":"file"}}`                        | 群组中发送文件消息       |
| `chat:group:command`  | `{"bodies":{"type":"cmd"}}`                         | 群组中发送透传消息       |
| `chat:group:custom`   | `{"bodies":{"type":"custom"}}`                      | 群组中发送自定义消息     |
| `chat:group:txt`      | `{"bodies":{"type":"txt","subType":"sub_combine"}}` | 群组中发送合并消息       |
| `chat:group:unknown`  | `{"bodies":{"type":"unknown"}}`                     | 群组中发送未知消息       |

### 请求示例

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

### 请求字段说明

| 字段     | 数据类型 | 描述                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | String   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含 `msg` 和 `type` 字段。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 透传消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

回调请求的其他参数详见 [公共参数](#公共参数)。

群组消息的 payload 与单聊消息相同，详见[发送单聊消息](#发送单聊消息)。

## 发送聊天室消息

本节介绍在聊天室中发送各类消息后，环信服务器向你的 App Server 发送的回调请求的包体示例。

| content_type         | payload 中类型                                      | 触发事件                   |
| :------------------- | :-------------------------------------------------- | :------------------------- |
| `chat:room:*`        | -                                                   | 聊天室中发送任何类型的消息 |
| `chat:room:text`     | `{"bodies":{"type":"txt"}}`                         | 聊天室中发送文本消息       |
| `chat:room:image`    | `{"bodies":{"type":"img"}}`                         | 聊天室中发送图片消息       |
| `chat:room:voice`    | `{"bodies":{"type":"audio"}}`                       | 聊天室中发送语音消息       |
| `chat:room:location` | `{"bodies":{"type":"loc"}}`                         | 聊天室中发送位置消息       |
| `chat:room:video`    | `{"bodies":{"type":"video"}}`                       | 聊天室中发送视频消息       |
| `chat:room:file`     | `{"bodies":{"type":"file"}}`                        | 聊天室中发送文件消息       |
| `chat:room:command`  | `{"bodies":{"type":"cmd"}}`                         | 聊天室中发送透传消息       |
| `chat:room:custom`   | `{"bodies":{"type":"custom"}}`                      | 聊天室中发送自定义消息     |
| `chat:room:txt`      | `{"bodies":{"type":"txt","subType":"sub_combine"}}` | 聊天室中发送合并消息       |
| `chat:room:unknown`  | `{"bodies":{"type":"unknown"}}`                     | 聊天室中发送未知消息       |

### 请求示例

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
        // 具体的消息内容，与对应类型的单聊消息相同
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### 请求字段说明

| 字段     | 数据类型 | 描述                                                       |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含 `msg` 和 `type` 字段。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 透传消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

回调请求的其他参数详见 [公共参数](#公共参数)。

聊天室消息的 `payload` 结构与单聊消息相同，详见 [发送单聊消息](#发送单聊消息)。

