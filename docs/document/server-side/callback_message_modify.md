# 修改消息

消息修改后，环信服务器会按照[发送后回调规则](callback_postsending.html#发送后回调规则)向你的 App Server 发送回调请求，App Server 可通过该回调查看修改后的消息，进行数据同步。

:::tip
1. 如果需要消息修改事件，你需要在[环信控制台](https://console.easemob.com/user/login)设置发送后回调规则，详见[配置发送后回调规则](callback_postsending.html#发送后回调规则)。
2. 发送后回调的相关介绍，详见[回调说明](/document/server-side/callback_postsending.html)。
:::

## 回调时机

1. 客户端修改了各类消息。
2. 调用 RESTful API 修改了消息。
 
## 回调请求

以下各类消息支持的修改内容如下表所示： 

| 消息类型 | 支持的修改内容        |
| :------- | :-------------------- |
| 文本     | 文本内容，`ext` 字段        |
| 图片     | `ext` 字段                   |
| 语音     | `ext` 字段                   |
| 位置     | `ext` 字段                   |
| 文件     | `ext` 字段                  |
| 视频     | `ext` 字段                  |
| 合并     | `ext` 字段                   |
| 自定义   | `customEvent`，`customExts`，`ext` 字段 |

### 文本消息

```json
{
    "callId": "easemob-demo#support_1418038921190704764",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "19b85beee242a1266c87ab84c6c3883d",
    "payload": {
        "edit_message_id": "1418038712905770616",
        "ext": {
            "key1": "value_rewrite"
        },
        "bodies": [
            {
                "msg": "testmessages1",
                "type": "txt"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747727666259,
                "edit_time": 1747727714765,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1418038921190704764",
    "timestamp": 1747727714765
}
```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | Long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `bodies`         | JSON Array   | 修改消息的具体内容。与通过 RESTful API 发送过来的一致，查看 [历史消息内容](message_historical.html#历史消息记录的内容)。 |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 位置消息

```json
{
    "callId": "easemob-demo#support_1415008698962544248",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "36583253ca0d3a718388f1134b180baf",
    "payload": {
        "edit_message_id": "1415008466669405936",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "lng": 116.322,
                "addr": "中国北京市海淀区中关村",
                "type": "loc",
                "lat": 39.966
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022132072,
                "edit_time": 1747022186159,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415008698962544248",
    "timestamp": 1747022186159
}
```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。         |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`  | JSON   | 消息扩展。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容。<br/> - `lng`：String，经度。<br/> - `addr`：String，位置的文字描述。<br/> - `type` String，消息类型。位置消息为 `loc`。<br/> - `lat`：String，纬度。 |
| `from`            | String   | 修改消息的发送方。                                               |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg_chat_type`            | String   | 消息所属会话类型，即单聊、群聊或聊天室。         |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。     |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `type`   | String   | 消息修改事件，值为 `edit`。       |


### 图片消息

```json
{
    "callId": "hx#hxdemo_1414991177169504212",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "78708dd54808525a8a4c0e51bacec2c2",
    "payload": {
        "edit_message_id": "1414988420945545172",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
           			"filename": "image5406881348368656892.jpg",
                "size": {
                    "width": 624,
                    "height": 832
                },
                "file_length": 96238,
                "secret": "vJkjMC7gEfC_Vjf9xuovCZm5-awdNh5rIdKZBvmBLpYreWTo",
                "thumbFilename": "image%3A1000156028",
                "type": "img",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/bc98fc20-2ee0-11f0-b174-0946be6f6fbc"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747017464831,
                "edit_time": 1747018106558,
                "sender": "wzy1",
                "count": 3,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "hx#hxdemo",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1414991177169504212",
    "timestamp": 1747018106558
}
```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `filename`：String，图片名称。<br/> - `size`，JSON，图片尺寸，单位为像素，包含以下字段：`height` 为图片高度；`width` 为图片宽度。 <br/> - `file_length`：String，图片文件大小。<br/> - `secret`：String，图片的访问密钥，即成功上传图片后，从 [文件上传](/document/server-side/message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。 <br/> - `thumbFilename`：String，缩略图大小。<br/> - `type`：文件类型，`img` 表示图片消息。 <br/> - `url`: String，图片 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传图片文件后，从 [文件上传](message_download.html#上传文件) 的响应 body 中获取。 |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 语音消息

```json
{
    "callId": "easemob-demo#support_1415000359922828916",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "d2575840b44fb1b67f2911bd69a56473",
    "payload": {
        "edit_message_id": "1415000223524062680",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "filename": "wzy20250512T112327.amr",
                "length": 3,
                "file_length": 3282,
                "secret": "e4FRsC7gEfCk-ScLfMCJWdgzY621gM-Nwm_vnVcGwRL8SJYF",
                "type": "audio",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/7b810390-2ee0-11f0-b4c7-03224649d943"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747020212833,
                "edit_time": 1747020244585,
                "sender": "wzy",
                "count": 1,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy",
    "to": "wzy1",
    "msg_id": "1415000359922828916",
    "timestamp": 1747020244585
}

```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `filename`：String，图片名称。<br/> - `size`，JSON，图片尺寸，单位为像素，包含以下字段：`height` 为图片高度；`width` 为图片宽度。 <br/> - `file_length`：String，图片文件大小。<br/> - `secret`：String，图片的访问密钥，即成功上传图片后，从 [文件上传](/document/server-side/message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。 <br/> - `thumbFilename`：String，缩略图大小。<br/> - `type`：文件类型，`img` 表示图片消息。 <br/> - `url`: String，图片 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传图片文件后，从 [文件上传](message_download.html#上传文件) 的响应 body 中获取。 |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 视频消息

```json
{
    "callId": "easemob-demo#support_1415009227012835056",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "9cf75f2e2dec09ab70df4ced8caa2148",
    "payload": {
        "edit_message_id": "1415009139259606640",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "thumb_secret": "ZyXXXX2I",
                "filename": "test.avi",
                "thumb": "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
                "length": 0,
                "file_length": 58103,
                "secret": "VfXXXXNb_",
                "type": "video",
                "url": "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022288686,
                "edit_time": 1747022309104,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415009227012835056",
    "timestamp": 1747022309104
}

```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `thumb_secret`：视频缩略图访问密钥，即成功上传视频文件后，从 [文件上传](message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。如果缩略图文件上传时设置了文件访问限制（`restrict-access`），则该字段为必填。<br/> - `filename`：String，视频文件名称。<br/> - `thumb`：String，缩略图 URL。<br/> - `length`：视频时长，单位为秒。<br/> - `secret`：String，视频文件的访问密钥，即成功上传视频后，从 [文件上传](/document/server-side/message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。 <br/> - `type`：文件类型，`video` 表示视频消息。 <br/> - `url`: String，视频 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从 [文件上传](message_download.html#上传文件) 的响应 body 中获取。 |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 文件消息

```json
{
    "callId": "easemob-demo#support_1415009628512585332",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "8ae190480ff8f4206eece47665e1eb49",
    "payload": {
        "edit_message_id": "1415009594568083068",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "filename": "test.txt",
                "secret": "1-g0XXXXua",
                "type": "file",
                "url": "https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022394696,
                "edit_time": 1747022402597,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415009628512585332",
    "timestamp": 1747022402597
}

```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `filename`：String，文件名称。<br/> - `secret`：String，文件的访问密钥，即成功上传文件后，从 [文件上传](/document/server-side/message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。 <br/> - `type`：文件类型，`file` 表示文件消息。 <br/> - `url`: String，文件 URL 地址，格式为 `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`。其中 `file_uuid` 为文件 ID，成功上传视频文件后，从 [文件上传](message_download.html#上传文件) 的响应 body 中获取。 |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 合并消息

```json
{
    "callId": "easemob-demo#support_1415001238604355312",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "3539b3b166e2f3401076664629d98ef1",
    "payload": {
        "edit_message_id": "1415001054172415464",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "combineLevel": 1,
                "msg": "当前版本过低，无法展示对应内容。",
                "summary": "wzy1: [图片]\nwzy: [语音]\nwzy: [图片]",
                "filename": "17470204055850033",
                "subType": "sub_combine",
                "file_length": 701,
                "secret": "7sUSEC7gEfCYlE9p85BBKlYH1ZsF2VFN49QS85LJMTNIkBKw",
                "title": "聊天记录",
                "type": "txt",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/eec4eb00-2ee0-11f0-8f24-b3ce6aa9421a"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:group",
                "send_time": 1747020406219,
                "edit_time": 1747020449159,
                "sender": "wzy",
                "count": 1,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy",
    "to": "278265393643526",
    "msg_id": "1415001238604355312",
    "timestamp": 1747020449159
}
```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：
  
| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `combineLevel`：Int，合并消息的嵌套层级数。<br/> - `msg`：String，合并消息的兼容文本。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。<br/> - `summary`：String，合并消息的概要。<br/> - `filename`：String，文件名称。<br/> -  `subType`：String，消息类型。合并消息为 `sub_combine`。<br/> - `file_length`：Int，合并消息附件的大小，单位为字节。<br/> - `secret`：String，文件的访问密钥，即成功上传文件后，从 [文件上传](/document/server-side/message_download.html#上传文件) 的响应 body 中获取的 `share-secret`。 <br/> - `title`：String，合并消息的标题。<br/> - `type`：消息附件类型，`txt` 表示文本文件。 <br/> - `url`: String，合并消息的附件的 URL 地址。你可以访问该 URL 下载该附件。 |
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

### 自定义消息

```json
{
    "callId": "easemob-demo#support_1415010565809505916",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "989b921d92b411d3c30364ccda87aad4",
    "payload": {
        "edit_message_id": "1415010541239273084",
        "ext": {
            "key1": "value_rewrite"
        },
        "bodies": [
            {
                "customExts": [
                    {
                        "key1": "value_rewrite"
                    }
                ],
                "customEvent": "ce_rewrite",
                "v2:customExts": {
                    "key1": "value_rewrite"
                },
                "type": "custom"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022615096,
                "edit_time": 1747022620834,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415010565809505916",
    "timestamp": 1747022620834
}

```

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为每个回调请求的唯一标识。 |
| `eventType`       | String | `chat` 上行消息、`chat_offline` 离线消息。                      |
| `chat_type`       | String   | `edit`，表示修改消息。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 [配置环信控制台回调规则](callback_postsending.html#发送后回调规则)。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`            | String   | 消息发送方的用户 ID。                                     | 
| `to`              | String   | 消息接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。   |
| `msg_id`          | String   | 该消息修改事件消息的 ID。                                       |
| `timestamp`       | long     | 环信服务器接收到此消息的 Unix 时间戳，单位为毫秒 ms。        |

`payload` 为事件内容，其中的字段如下表所示：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | 被修改的原消息 ID。                                       |
| `ext`          | JSON  | 消息扩展字段。                                       |
| `bodies`         | JSON Array   | 修改消息的具体内容：<br/> - `customEvent`： String 类型，用户自定义的事件类型。该参数的值必须满足正则表达式 `[a-zA-Z0-9-_/\.]{1,32}`，长度为 1-32 个字符。 <br/> - `customExts`/`v2:customExts`: Array/JSON ，用户自定义的事件属性。`customExts` 为旧版参数，数组类型，最多可包含 16 个元素。`v2:customExts` 为新版参数，`Map<String,String>` 类型，最多可以包含 16 个元素。推荐使用该新版参数。<br/> - `type`：消息类型，`custom` 为自定义消息。|
| `meta.edit_msg`            | JSON   | 消息修改详情。                                               |
| `meta.edit_msg.chat_type`            | String   | 会话类型。     |
| `meta.edit_msg.count`            | JSON   | 消息修改次数。                                               |
| `meta.edit_msg.edit_time`            | Long   | 消息修改时间。                                               |
| `meta.edit_msg.operator`          | String   | 修改消息的用户。`easemob_rest_app_admin` 表示 app 管理员。    |
| `meta.edit_msg.send_time`          | Long   | 原消息的发送时间。                                      |
| `meta.edit_msg.sender`          | String   | 原消息的发送方。                                      |
| `type`            | String   | 消息修改事件，值为 `edit`。       |

