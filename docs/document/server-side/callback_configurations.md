# 发送后事件回调过滤规则设置

<Toc />

通过回调过滤规则的设置，可以根据需求选择回调中的有用信息。在环信管理后台设置发送后回调规则后，默认会回调所有事件信息，如需单独设置特定类型不回调，请联系环信商务经理。

## 从环信服务器向你的应用服务器发送请求

请求采用 POST 方式，支持 HTTP/HTTPS，正文部分为 JSON 格式的字符串，字符集为 UTF-8。

回调时，会对发送的正文做 MD5 签名。 环信 IM 使用的 MD5 为 `org.apache.commons.codec.digest.DigestUtils#md5Hex`。

app 的响应内容不能超过 1,000 个字符。

## 回调事件

### 回调内容中单聊、群聊、聊天室事件的公共参数说明

| 参数 | 类型   | 含义 |
| :---------------- | :----- |:------------------------------------------------------------------------------------------------------------------------------------------------|
| `callId`          | String | `callId` 为 `{appkey}_{uuid}` 其中 `uuid` 为随机生成，作为每条回调的唯一标识。                                                                                             |
| `eventType`       | String | “chat” 上行消息、“chat_offline” 离线消息。                                                                                                                |
| `timestamp`       | long   | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为 ms。                                                                                                               |
| `chat_type`       | String | 会话类型（默认全选）：<br/> - "chat"：单聊回调；<br/> - "groupchat"：群聊回调包含了群组和聊天室的消息回调；<br/> - "notify"：通知回调包含了Thread 和 Reaction 的回调，需要结合 payload 中的 type 字段确定具体类型。 |
| `group_id`        | String | 当 `chat_type` 为 `groupchat` 有此参数，表示回调消息所在的群组或聊天室。                                                                                               |
| `from`            | String | 消息的发送方。                                                                                                                                         |
| `to`              | String | 消息的接收方。                                                                                                                                         |
| `msg_id`          | String | 该回调消息的 ID。                                                                                                                                      |
| `payload`         | object | 事件内容，与通过 REST API 发送过来的一致，查看 [历史消息内容](message.html#历史消息内容)。                                     |
| `securityVersion` | String | 安全校验版本，目前为 1.0.0。忽略此参数，以后会改成 Console 后台做设置。                                                                                                     |
| `security`        | String | 签名，格式如下: `MD5（callId+secret+timestamp）`。 Secret 见 Console 后台回调规则。                                                                                 |
| `appkey`          | String | 你在环信管理后台注册的应用唯一标识。                                                                                                                              |
| `host`            | String | 服务器名称。                                                                                                                                          |

### 单聊

| 事件         | payload 中类型                | 触发事件           |
| :----------- | :---------------------------- | :----------------- |
| chat         | -                             | 单聊中所有事件     |
| chat:txt     | {“bodies”:{“type”:“txt”}}     | 单聊中发文本消息   |
| chat:img     | {“bodies”:{“type”:“img”}}     | 单聊中发图片消息   |
| chat:audio   | {“bodies”:{“type”:“audio”}}   | 单聊中发语音消息   |
| chat:loc     | {“bodies”:{“type”:“loc”}}     | 单聊中发位置消息   |
| chat:video   | {“bodies”:{“type”:“video”}}   | 单聊中发视频消息   |
| chat:file    | {“bodies”:{“type”:“file”}}    | 单聊中发文件消息   |
| chat:cmd     | {“bodies”:{“type”:“cmd”}}     | 单聊中发命令消息   |
| chat:custom  | {“bodies”:{“type”:“custom”}}  | 单聊中发自定义消息 |
| chat:unknown | {“bodies”:{“type”:“unknown”}} | 单聊中发未知消息   |

#### 单聊 payload 中消息的字段解释及回调请求的包体示例

##### 文字以及透传消息

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息的扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | Json     | 消息内容。                                                   |
| `type`   | String   | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

回调请求中 payload 示例：

```json
"payload":{
    "ext":{},
    "bodies":[{"msg":"rr","type":"txt"}]
}
```

##### 图片消息

| 字段          | 类型   | 说明                                                         |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | Json   | 消息的扩展字段。                                             |
| `bodies`      | object | 该回调的主体内容，包含以下六个字段 `filename`，`secret`，`file_length`，`size`，`url`，`type`。 |
| `filename`    | String | 图片名称。                                                   |
| `secret`      | String | 成功上传文件后返回的 `secret`。                              |
| `file_length` | Int    | 图片文件大小（单位：字节）。                                 |
| `size`        | Json   | 图片尺寸；`height`：高度，`width`：宽度。                    |
| `url`         | String | 域名 /orgname/appname/chatfiles/ 成功上传文件返回的 UUID。参考请求示例。 |
| `type`        | String | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

payload 示例：

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

##### 语音消息 payload 字段

| 字段          | 类型   | 说明                                                         |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | Json   | 消息的扩展字段。                                             |
| `filename`    | String | 文件名称。                                                   |
| `secret`      | String | 成功上传文件后返回的 secret。                                |
| `file_length` | Long   | 语音文件大小（单位：字节）。                                 |
| `Length`      | Int    | 语音时间（单位：秒）。                                       |
| `url`         | String | 域名 `/org_name/app_name/chatfiles/` 成功上传文件返回的 UUID。 |

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

##### 视频消息

| 字段           | 类型   | 说明                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `ext`          | Json   | 消息的扩展字段。                                             |
| `bodies`       | object | 该回调的主体内容，包含以下字段 `thumb_secret`、`thumb`、`filename`，`secret`，`file_length`，`size`，`url`，`type`。 |
| `thumb_secret` | String | 成功上传视频缩略图后返回的 secret。                          |
| `filename`     | String | 文件名称。                                                   |
| `size`         | Json   | 缩略图图片尺寸；`height`：高度，`width`：宽度。              |
| `thumb`        | String | 成功上传视频缩略图返回的 UUID。                              |
| `secret`       | String | 成功上传视频文件后返回的 secret。                            |
| `length`       | Int    | 视频播放长度。                                               |
| `file_length`  | Long   | 视频文件大小（单位：字节）。                                 |
| `type`         | String | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |
| `url`          | String | 成功上传视频文件返回的 UUID。                                |

payload 示例：

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

##### 位置消息

| 字段   | 类型   | 描述             |
| :----- | :----- | :--------------- |
| `lat`  | String | 纬度。           |
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

##### 自定义消息

| 参数          | 参数类型 | 描述                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `customEvent` | String   | 用户自定义的事件类型，必须是 string，值必须满足正则表达式。 [a-zA-Z0-9-_/.]{1,32}，最短 1 个字符 最长 32 个字符。 |
| `customExts`/`v2:customExts`  | Json     | 用户自定义的事件属性，类型必须是 Map<String,String>，最多可以包含 16 个元素。customExts 是可选的，不需要可以不传。<br/>`customExts` 为旧版参数，`v2:customExts` 为新版参数。 |
| `from`        | String   | 表示消息发送者;无此字段 Server 会默认设置为 “from”:“admin”，有 from 字段但值为空串 (“”) 时请求失败。 |
| `ext`         | Json     | 扩展属性，支持 app 自定义内容。可以没有这个字段；但是如果有，值不能是 “ext:null” 这种形式，否则会发生错误。 |

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

### 群聊

| 事件              | payload 中类型                | 触发事件           |
| :---------------- | :---------------------------- | :----------------- |
| groupchat         | -                             | 群聊中所有事件     |
| groupchat:txt     | {“bodies”:{“type”:“txt”}}     | 群聊中发文本消息   |
| groupchat:img     | {“bodies”:{“type”:“img”}}     | 群聊中发图片消息   |
| groupchat:audio   | {“bodies”:{“type”:“audio”}}   | 群聊中发语音消息   |
| groupchat:loc     | {“bodies”:{“type”:“loc”}}     | 群聊中发位置消息   |
| groupchat:video   | {“bodies”:{“type”:“video”}}   | 群聊中发视频消息   |
| groupchat:file    | {“bodies”:{“type”:“file”}}    | 群聊中发文件消息   |
| groupchat:cmd     | {“bodies”:{“type”:“cmd”}}     | 群聊中发命令消息   |
| groupchat:custom  | {“bodies”:{“type”:“custom”}}  | 群聊中发自定义消息 |
| groupchat:unknown | {“bodies”:{“type”:“unknown”}} | 群聊中发未知消息   |

#### 群聊中发送消息 payload 中的字段解释

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | String   | 消息的扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

回调请求的包体示例：

```json
{
    "callId":"{appkey}_{uuid}",
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

### 聊天室

| 事件             | payload 中类型                | 触发事件             |
| :--------------- | :---------------------------- | :------------------- |
| chatroom         | -                             | 聊天室中所有事件     |
| chatroom:txt     | {“bodies”:{“type”:“txt”}}     | 聊天室中发文本消息   |
| chatroom:img     | {“bodies”:{“type”:“img”}}     | 聊天室中发图片消息   |
| chatroom:audio   | {“bodies”:{“type”:“audio”}}   | 聊天室中发语音消息   |
| chatroom:loc     | {“bodies”:{“type”:“loc”}}     | 聊天室中发位置消息   |
| chatroom:video   | {“bodies”:{“type”:“video”}}   | 聊天室中发视频消息   |
| chatroom:file    | {“bodies”:{“type”:“file”}}    | 聊天室中发文件消息   |
| chatroom:cmd     | {“bodies”:{“type”:“cmd”}}     | 聊天室中发命令消息   |
| chatroom:custom  | {“bodies”:{“type”:“custom”}}  | 聊天室中发自定义消息 |
| chatroom:unknown | {“bodies”:{“type”:“unknown”}} | 聊天室中发未知消息   |

#### 聊天室中发送消息 payload 中的字段解释

| 字段     | 数据类型 | 含义                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | 消息的扩展字段。                                             |
| `bodies` | object   | 该回调的主体内容，包含以下两个字段 `msg`，`type`。           |
| `msg`    | String   | 消息内容。                                                   |
| `type`   | String   | 消息类型，包括：<br/> - 文本消息：`txt`；<br/> - 图片消息：`img`；<br/> - 语音消息：`audio`；<br/> - 位置消息：`loc`；<br/> - 视频消息：`video` ；<br/> - 文件消息：`file`；<br/> - 命令消息：`cmd`； <br/> - 自定义消息：`custom`；<br/> - 未知消息：`unknown`。 |

回调请求示例：

```json
{
    "callId":"{appkey}_{uuid}",
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

### 消息撤回

| 事件   | payload 中类型 | 触发事件       |
| :----- | :------------- | :------------- |
| recall | 无             | 进行消息撤回。 |

回调请求包体字段描述：

| 字段              | 数据类型 | 描述                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | `callId` 为 `{appkey}_{uuid}` 其中 `uuid` 为随机生成，作为每条回调的唯一标识。 |
| `eventType`       | String   | “chat” 上行消息、“chat_offline” 离线消息。                   |
| `timestamp`       | long     | 环信 IM 服务器接收到此消息的 Unix 时间戳，单位为 ms。        |
| `chat_type`       | String   | “chat” 单聊回调、“groupchat” 群聊回调包含了群组和聊天室的消息回调，默认全选。 |
| `group_id`        | String   | 当 `chat_type` 为 `groupchat` 有此参数，表示回调消息所在的群组或聊天室。 |
| `from`            | String   | 消息的发送方。                                               |
| `to`              | String   | 消息的接收方。                                               |
| `recall_id`       | String   | 要撤回的消息 ID。                                            |
| `msg_id`          | String   | 该撤回事件消息的 ID。                                        |
| `payload`         | object   | 事件内容，与通过 REST API 发送过来的一致，查看 [历史消息内容](message.html#历史消息内容)。 |
| `securityVersion` | String   | 安全校验版本，目前为 1.0.0。忽略此参数，以后会改成 Console 后台做设置。 |
| `security`        | String   | 签名，格式如下: MD5（callId+secret+timestamp）。Secret 见 Console 后台回调规则。 |
| `appkey`          | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `host`            | String   | 服务器名称。                                                 |

payload 中字段含义：

| 参数             | 数据类型 | 描述                                     |
| :--------------- | :------- | :--------------------------------------- |
| `ext`            | object   | 消息的扩展字段，撤回行为时为空。         |
| `ack_message_id` | String   | 跟 `recall_id` 一致，为要撤回的消息 ID。 |
| `bodies`         | object   | 该回调的主体内容，撤回行为时为空。       |

回调请求的包体示例：

```json
{
    "chat_type":"recall",
    "callId":"orgname#appname_966475585536657404",
    "security":"ea7a867314fb0e0833d5f4f169eb4f8d",
    "payload":{
        "ext":{},
        "ack_message_id":"966475220900644860",
        "bodies":[]
    },
    "host":"******",
    "appkey":"orgname#appname",
    "from":"tst",
    "recall_id":"966475220900644860",
    "to":"170908972023810",
    "eventType":"chat",
    "msg_id":"966475585536657404",
    "timestamp":1642589932646
}
```

### 群组和聊天室操作

注意：目前 muc:create 仅在开通多设备服务后，才支持回调。

| 事件                       | payload 中类型                         | 群聊触发事件                                   | 聊天室触发事件         |
| :------------------------- | :------------------------------------- | :--------------------------------------------- | :--------------------- |
| muc                        | -                                      | 群聊操作所有事件                               | 聊天室操作所有事件     |
| muc:create                 | {“operation”:“create”}                 | 创建群                                         | 不支持                 |
| muc:destroy                | {“operation”:“destroy”}                | 删除群                                         | 删除聊天室             |
| muc:apply                  | {“operation”:“apply”}                  | 用户申请加入群                                 | 不支持                 |
| muc:apply_accept           | {“operation”:“apply_accept”}           | 同意用户加群申请                               | 不支持                 |
| muc:invite                 | {“operation”:“invite”}                 | 邀请新用户进群                                 | 不支持                 |
| muc:invite_accept          | {“operation”:“invite_accept”}          | 受邀用户同意入群                               | 不支持                 |
| muc:invite_decline         | {“operation”:“invite_decline”}         | 受邀用户拒绝入群                               | 不支持                 |
| muc:kick                   | {“operation”:“kick”}                   | 踢出群                                         | 踢出聊天室             |
| muc:ban                    | {“operation”:“ban”}                    | 封禁群成员，即管理员将用户添加到群组黑名单     | 不支持                 |
| muc:allow                  | {“operation”:“allow”}                  | 解除群成员封禁，即管理员将用户添加到群组黑名单 | 不支持                 |
| muc:update                 | {“operation”:“update”}                 | 群信息修改                                     | 聊天室信息修改         |
| muc:block                  | {“operation”:“block”}                  | 用户屏蔽群                                     | 不支持                 |
| muc:unblock                | {“operation”:“unblock”}                | 用户解除屏蔽群                                 | 不支持                 |
| muc:presence               | {“operation”:“presence”}               | 成员进入群                                     | 成员进入聊天室         |
| muc:absence                | {“operation”:“absence”}                | 有成员退出了群                                 | 有成员离开了聊天室     |
| muc:leave                  | {“operation”:“leave”}                  | 成员主动退出群                                 | 成员主动退出聊天室     |
| muc:assing_owner           | {“operation”:“assing_owner”}           | 转让群                                         | 不支持                 |
| muc:add_admin              | {“operation”:“add_admin”}              | 添加群管理员                                   | 添加聊天室管理员       |
| muc:remove_admin           | {“operation”:“remove_admin”}           | 移除群管理员                                   | 移除聊天室管理员       |
| muc:add_mute               | {“operation”:“add_mute”}               | 将群成员禁言                                   | 将聊天室成员禁言       |
| muc:remove_mute            | {“operation”:“remove_mute”}            | 将群成员解除禁言                               | 将聊天室成员解除禁言   |
| muc:update_announcement    | {“operation”:“update_announcement”}    | 更新群公告                                     | 更新聊天室公告         |
| muc:delete_announcement    | {“operation”:“delete_announcement”}    | 删除群公告                                     | 删除聊天室公告         |
| muc:upload_file            | {“operation”:“upload_file”}            | 上传群文件                                     | /                      |
| muc:delete_file            | {“operation”:“delete_file”}            | 删除群文件                                     | /                      |
| muc:add_user_white_list    | {“operation”:“add_user_white_list”}    | 将成员加入群白名单                             | 将成员加入聊天室白名单 |
| muc:remove_user_white_list | {“operation”:“remove_user_white_list”} | 将成员移除群白名单                             | 将成员移除聊天室白名单 |
| muc:ban_group              | {“operation”:“ban_group”}              | 群全局禁言                                     | 聊天室全局禁言         |
| muc:remove_ban_group       | {“operation”:“remove_ban_group”}       | 解除群全局禁言                                 | 解除聊天室全局禁言     |

#### 创建群聊

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。<br> - `true`：是；<br> - `false`：否。             |
| `operation`   | String   | `create` 创建群聊或聊天室。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 创建群聊或聊天室失败的原因描述。                             |
| `error_code`  | String   | 创建失败对应的错误码。                                       |

创建群聊回调请求示例：

```json
{ 
    "chat_type": "muc",
    "callId": "XXXX#XXXX_976459883882744164", 
    "security": "f0f8645cb9b2ccdab3c16db239b13e83", 
    "payload": {
        "muc_id": "XXXX#XXXX_173556296122369@conference.easemob.com", 
        "reason": "",
        "is_chatroom": false,
        "operation": "create",
        "status": {
            "description":"",
            "error_code": "ok"
            }
        },
    "group_id": "173556296122369",
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-795eb6e63d",
    "to": "1111",
    "eventType": "chat",
    "msg_id": "976459883882744164",
    "timestamp": 1644914583273
}
```

#### 删除群/聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `operation`   | String   | `destroy` 删除群/聊天室。                                    |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 删除群聊或聊天室失败的原因描述。                             |
| `error_code`  | String   | 操作失败对应的错误码。                                       |

删除群聊回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976430482738645348", 
    "security": "c6f411dedb43ebc499b14779eaa9a82b", 
    "payload": { 
        "muc_id": "XXXX#XXXX_173548612157441@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "destroy", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "173548612157441", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_a3-af9c-2a3ae9d778b0", 
    "to": "admin", 
    "eventType": "chat", 
    "msg_id": "976430482738645348", 
    "timestamp": 1644907737798 
}
```

删除聊天室回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "776cbf0b06df9a59d660f6c024aeeb81", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "destroy", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        },
    "group_id": "XXXX",
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "XXXX#XXXX",
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912946446
}
```

#### 用户申请加入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `apply`：申请加入群。                                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 申请加入群聊或聊天室失败的原因描述。                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "08eaa57abe898b83df9c84bb4a50c5a5", 
    "payload": { 
        "muc_id": "XXXX#XXXX_.com", 
        "reason": "join group123", 
        "is_chatroom": false, 
        "operation": "apply", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXXcom", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908512194 
}
```

#### 同意成员加群申请

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite`：申请加入群或聊天室。                               |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976435003388856676", 
    "security": "d86bb27395e87e0dffe56e061669a2d9", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "apply_accept", 
        "status": { 
            "description": ""
            }
        },
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976435003388856676", 
    "timestamp": 1644908790333 
}
```

#### 邀请新用户进群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite`：邀请新成员加入群。                                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 邀请新用户加入群聊失败的原因描述。                           |
| `error_code`  | String   | 失败对应的错误码。                                           |

回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976447662725273956", 
    "security": "2ae5959b661c26cbf55f4582cb2a8931", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com",
        "reason": "你好啊", 
        "is_chatroom": false, 
        "operation": "invite", 
        "status": { 
            "description": "",
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_@XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976447662725273956", 
    "timestamp": 1644911737827 
}
```

#### 受邀用户同意入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite_accept`：受邀用户同意加入群。                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

回调示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976447989306362212", 
    "security": "1881ae2f25c7f92a8b05c6ce0866929f", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "invite_accept", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976447989306362212", 
    "timestamp": 1644911813866 
}
```

#### 受邀用户拒绝入群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `invite_decline`：受邀用户拒绝加入群。                       |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976448350272358756", 
    "security": "5f5dea4fec2582c20a9ff5b3e1330a02", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "invite_decline", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX",
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976448350272358756", 
    "timestamp": 1644911897910 
}
```

#### 踢出群/聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `kick`：将成员踢出群聊或聊天室。                             |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

踢出群回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976432657191668068", 
    "security": "f8956ab6d6f78df93efb2dbca5f2eb83", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "kick", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "aaa111", 
    "eventType": "chat", 
    "msg_id": "976432657191668068", 
    "timestamp": 1644908244060 
}
```

踢出聊天室请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976453352206371172", 
    "security": "693b47daf71607ddd748bf923357e965", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "kick", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "976453352206371172", 
    "timestamp": 1644913062505 
}
```

#### 封禁群成员（将群成员添加到黑名单）

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `ban`：封禁群成员（将群成员添加到黑名单）。                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

封禁群成员（将群成员添加到黑名单）回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "57a539e96d9cc5c8de9ff779b029c10e", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "ban", 
        "status": { 
            "description": "",
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644916572276 
}
```

#### 解除群成员封禁

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `allow`：解除群聊或聊天室成员封禁。                          |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

payload 示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "f16b58abc9819e9c24b44e062910fd96", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "undefined", 
        "is_chatroom": false, 
        "operation": "allow", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908410143 
}
```

#### 群/聊天室信息修改

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `update`：群/聊天室信息修改。                                |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

群信息修改回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976436197985356132", 
    "security": "635636b9e800bbf1387734b206552c5f", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "update", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "976436197985356132", 
    "timestamp": 1644909068475 
}
```

聊天室信息修改回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "07796ba1504c284f49710b55fa42dd47", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "update", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912742341 
}
```

#### 用户屏蔽群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `block`：用户屏蔽群。                                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

用户屏蔽群回调请求示例：

```json
{
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "e8d00a68ea63e76a3d86d6853cf1f5e1", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "block", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_3333@easemob.com/ios_f43087fc-5823-4f53-9276-52546f3a4649", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644918981507 
}
```

#### 用户解除屏蔽群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `unblock`：用户屏蔽群/聊天室。                               |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "2f217429e4c2d8c09330cb5e2946aa90", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "unblock", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            }
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_3333@easemob.com/ios_f43087fc-5823-4f53-9276-52546f3a4649", 
    "to": "3333", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644919019526 
}
```

#### 成员进群/聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `presence`：成员进群/聊天室。                                |
| `is_chatroom` | bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |

成员进群回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976428411540998500", 
    "security": "13abc508b407d38d9c0d0e11bb8b9903", 
    "payload": {
        "muc_id": "XXXX#XXXX_173548612157441@conference.easemob.com", 
        "is_chatroom": false,
        "operation": "presence" 
        }, 
    "group_id": "173548612157441", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com",
    "to": "173548612157441", 
    "eventType": "chat",
    "msg_id": "976428411540998500",
    "timestamp": 1644907255555
}
```

成员进聊天室回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "dde4f43158aea3e142bc6cbc21862f91", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "presence" 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_2222@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912467208 
}
```

#### 有成员退出了群/有成员离开了聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `absence`：成员离开群/聊天室。                               |
| `is_chatroom` | bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |

有成员退出了群回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "d738f1b0379179677827f3da023d1195", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "absence" 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_aaa111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908244062 
}
```

成员离开聊天室回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5aed52a1df02d8103afd2d8dd2dce04b", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "absence" 
        },
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644912308123 
}
```

#### 有成员主动退出群/有成员主动离开聊天室

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `operation`   | String   | `leave`：有成员主动退出群/主动离开聊天室。                   |
| `is_chatroom` | bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

有成员主动退出群回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976437246481664356", 
    "security": "a44839d3599f71c4ce237e216bd502aa", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "leave", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_aaa111@easemob.com", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437246481664356", 
    "timestamp": 1644909312600 
}
```

有成员主动离开聊天室回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976450112211388772", 
    "security": "52f2b10050c763a64067bf339e5dc2b1", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": true, 
        "operation": "leave", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976450112211388772", 
    "timestamp": 1644912308125
}
```

#### 转让群

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群}@conference.easemob.com`。 |
| `operation`   | String   | `assing_owner`：转让群。                                     |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

转让群回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "fccdff91bd5e0cc3c4758ee3670a5ec2", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "assing_owner", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "2222", 
    "eventType": "chat",
    "msg_id": "XXXX", 
    "timestamp": 1644907917897
}
```

#### 添加群/聊天室管理员

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_admin`：添加群/聊天室管理员。                           |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

添加群管理员回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5f7e42423ad70312a3e024ee02ac849a", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "add_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908059969 
}
```

添加聊天室管理员回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "d48c298d2356d8e1799bf9ef2d6bc4f3", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913136541 
}
```

#### 删除群/聊天室管理员

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_admin`：删除群/聊天室管理员。                        |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

删除群管理员回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "bb1cea362da70f2f47424e526382e5f1", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX",
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644908095988 
}
```

删除聊天室管理员回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "f9cab6ee655af0e9de66e8be3de978a4", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_admin", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "1111", 
    "eventType":"chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913174560
}
```

#### 将群/聊天室成员禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_mute`：将群/聊天室成员禁言。                            |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

将群成员禁言回调示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "57a539e96d9cc5c8de9ff779b029c10e", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "ban", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com/android_8070d7b2-7be0-4959-b4a2-06795eb6e63d",
    "to": "1111", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644916572276 
}
```

将聊天室成员禁言回调示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454013950101860", 
    "security": "6a6445651e66043b1cbc7b605ef1692a", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976454013950101860", 
    "timestamp": 1644913216581 
}
```

#### 将群/聊天室成员解除禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | /                                                            |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_mute`：将群/聊天室成员解除禁言。                     |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

将群成员解除禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976435338580855140", 
    "security": "710b5e43699a35d98a6de6a9fc89d937", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
          } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976435338580855140", 
    "timestamp": 1644908868377 
}
```

将聊天室成员解除禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454039732488548", 
    "security": "40b3accd9c2403c387808e92204db200", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_mute", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976454039732488548", 
    "timestamp": 1644913222584 
}
```

#### 更新群/聊天室公告

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | 群公告内容。                                                 |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `update_announcement`：更新群/聊天室公告。                   |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

更新群公告示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976445325097044324", 
    "security": "06091170b6e9b9c20cd7c29266ad038c", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "gogngao", 
        "is_chatroom": false, 
        "operation": "update_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976445325097044324", 
    "timestamp": 1644911193549 
}
```

更新聊天室公告示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454374907709796", 
    "security": "0d6cdf339ec1d78ec6ee8337892ae52f", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "reason": "1111", 
        "is_chatroom": true, 
        "operation": "update_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        },
    "group_id": "XXXX",
    "host": "XXXX",
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454374907709796", 
    "timestamp": 1644913300624 
}
```

#### 删除群/聊天室公告

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `reason`      | String   | 删除后群公告内容，为空。                                     |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `delete_announcement`：删除群/聊天室公告。                   |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

删除群公告回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454194401642852", 
    "security": "d8f31984da8d33462a4c9558c9b793fc", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": false, 
        "operation": "delete_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            }
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_1111@easemob.com", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454194401642852", 
    "timestamp": 1644913258595 
}
```

删除聊天室公告回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976471348589103460", 
    "security": "f809f2d2099a3d58323ec879da08b689", 
    "payload": { 
        "muc_id": "XXXX#XXXX_173558850453505@conference.easemob.com", 
        "reason": "", 
        "is_chatroom": true, 
        "operation": "delete_announcement", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "173558850453505",
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "173558850453505", 
    "eventType": "chat", 
    "msg_id": "976471348589103460", 
    "timestamp": 1644917252616 
}
```

#### 上传群共享文件

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | object   | 包含 `file_id`、`file_name`、`file_owner`、`file_size`、`created` 几个字段。 |
| `file_id`     | String   | 文件 ID。                                                    |
| `file_name`   | String   | 文件名称。                                                   |
| `file_owner`  | String   | 文件所有者。                                                 |
| `file_size`   | Int      | 文件大小，单位为字节。                                       |
| `created`     | long     | 文件创建的 Unix 时间戳，单位为 ms。                          |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `upload_file`：上传群文件。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

上传群共享文件回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976438097292036452", 
    "security": "426c327006ccc3283d157d7da22db27f", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "{
            \"data\":{
                \"file_id\":\"79ddf840-8e2f-11ec-bec3-ad40868b03f9\",
                \"file_name\":\"a.csv\",
                \"file_owner\":\"@ppAdmin\",
                \"file_size\":6787,
                \"created\":1644909510085
                }
            }",
        "is_chatroom": false, 
        "operation": "upload_file", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976438097292036452", 
    "timestamp": 1644909510697 
}
```

#### 删除群共享文件

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群 ID}@conference.easemob.com`。 |
| `reason`      | object   | 跟上传群文件时 `file_id` 一致。                              |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `delete_file`：删除群文件。                                  |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

删除群共享文件回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976438501211900260", 
    "security": "63820599e494260f350d3bf1d8d2ffea", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "reason": "79ddf840-8e2f-11ec-bec3-ad40868b03f9", 
        "is_chatroom": false, 
        "operation": "delete_file", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976438501211900260", 
    "timestamp": 1644909604744 
}
```

#### 添加用户进群/聊天室白名单

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `add_user_white_list`：添加用户进群/聊天室白名单。           |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

添加用户进群白名单回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX", 
    "security": "93cd067cebd7313c7fcfcb0a682e30a8", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "add_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437461330692452", 
    "timestamp": 1644909362624 
}
```

添加用户进聊天室白名单回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976456222645422436", 
    "security": "b0996aa98a641988f897b30feea32c88", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "add_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976456222645422436", 
    "timestamp": 1644913730839 
}
```

#### 将用户移出群/聊天室白名单

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `remove_user_white_list`：将用户从群/聊天室白名单移除。      |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

将用户移出群白名单回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976437487104690532", 
    "security": "b1c9ddc90c220a5aec2094d99a057b27", 
    "payload": { 
        "muc_id": "XXXX#XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976437487104690532", 
    "timestamp": 1644909368625 
}
```

将用户移出聊天室白名单回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976456643757738340", 
    "security": "986f3b741cc28092768e0ff3b5b668e7", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_user_white_list", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "976456643757738340", 
    "timestamp": 1644913828888 
}
```

#### 群/聊天室全局禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | bool     | 是否是聊天室。 <br/> - `true`：是；<br/> - `false`：否。                 |
| `operation`   | String   | `ban_group`：将群或聊天室全局禁言。                          |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

群全局禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976455861675231588", 
    "security": "b647e5b0c0c07f61426b1143f107b362", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976455861675231588", 
    "timestamp": 1644913646792 
}
```

聊天室全局禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_976454710078736740", 
    "security": "f1da0b9cfbf3a265ce26bf974ba442db", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "976454710078736740", 
    "timestamp": 1644913378662
}
```

#### 解除群/聊天室全局禁言

payload 字段含义：

| 字段          | 数据类型 | 含义                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `muc_id`      | String   | 该回调事件所在群组/聊天室在服务器的唯一标识，`{appkey}_{群/聊天室 ID}@conference.easemob.com`。 |
| `is_chatroom` | bool     | 是否是聊天室。<br/> - `true`：是；<br/> - `false`：否。                |
| `operation`   | String   | `remove_ban_group`：解除群或聊天室全局禁言。                 |
| `status`      | object   | 状态，包括 `description` 和 `error_code`。                   |
| `description` | String   | 操作失败的原因描述。                                         |
| `error_code`  | String   | 失败对应的错误码。                                           |

解除群全局禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "XXXX", 
    "payload": { 
        "muc_id": "XXXX#XXXX_XXXX@conference.easemob.com", 
        "is_chatroom": false, 
        "operation": "remove_ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913644791 
}
```

解除聊天室全局禁言回调请求示例：

```json
{ 
    "chat_type": "muc", 
    "callId": "XXXX#XXXX_XXXX", 
    "security": "5edfc6329c37e83e4602943663320797", 
    "payload": { 
        "muc_id": "XXXX#XXXX", 
        "is_chatroom": true, 
        "operation": "remove_ban_group", 
        "status": { 
            "description": "", 
            "error_code": "ok" 
            } 
        }, 
    "group_id": "XXXX", 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX", 
    "to": "XXXX", 
    "eventType": "chat", 
    "msg_id": "XXXX", 
    "timestamp": 1644913522735 
}
```

### 好友关系操作

| 事件                  | payload 中类型                 | 触发事件             |
| :-------------------- | :----------------------------- | :------------------- |
| `roster`                | -                              | 好友关系操作所有事件 |
| `roster:add`            | `{“operation”:“add”}`           | 添加好友             |
| `roster:remove`         | `{“operation”:“remove”}`         | 删除好友             |
| `roster:accept`         | `{“operation”:“accept”}`         | 同意好友申请         |
| `roster:decline`        | `{“operation”:“decline”}`        | 拒绝好友申请         |
| `roster:ban`            | `{“operation”:“ban”}`           | 拉黑好友             |
| `roster:allow`          | `{“operation”:“allow”}`          | 解除拉黑好友         |
| `roster:remote_accept`  | `{“operation”:“remote_accept”}`  | 远程同意             |
| `roster:remote_decline` | `{“operation”:“remote_decline”}` | 远程拒绝             |

#### 添加好友

payload 字段含义：

| 字段        | 数据类型 | 含义              |
| :---------- | :------- | :---------------- |
| `reason`    | object   | /                 |
| `operation` | String   | `add`：添加好友。 |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX",
    "security":"XXXX",
    "payload":{
        "reason":"",
        "operation":"add"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"9XXXX2",
    "timestamp":1642648175092
    }
```

#### 删除好友

payload 字段含义：

| 字段         | 数据类型 | 含义                 |
| :----------- | :------- | :------------------- |
| `roster_ver` | String   | 好友列表的版本号。   |
| `operation`  | String   | `remove`：移除好友。 |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX736",
    "security":"2e7XXXX2d7",
    "payload":{
        "roster_ver":"003DD920ADD15B51EB0B806E83BDD97F089B0092",
        "operation":"remove"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"XXXX463736",
    "timestamp":1642648138571
    }
```

#### 同意好友申请

payload 字段含义：

| 字段         | 数据类型 | 含义                     |
| :----------- | :------- | :----------------------- |
| `roster_ver` | String   | 好友列表的版本号。       |
| `operation`  | String   | `accept`：同意好友申请。 |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725899779049516",
    "security":"a2e1545231e8acf60513b50984af0c6c",
    "payload":{
        "roster_ver":"DD6E14FE5EE5A9ABC52CA86C5DE1601CF729BFD6",
        "operation":"accept"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst01",
    "eventType":"chat",
    "msg_id":"96XXXX516",
    "timestamp":1642648213494
    }
```

#### 拒绝好友申请

payload 字段含义：

| 字段         | 数据类型 | 含义                      |
| :----------- | :------- | :------------------------ |
| `roster_ver` | String   | 好友列表的版本号。        |
| `operation`  | String   | `decline`：拒绝好友申请。 |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966726099692161068",
    "security":"747d6297660e57bcf38315aa98c206ac",
    "payload":{
        "roster_ver":"3D81EC24A6E732B2EB1B654AA446930DB9BAFE59",
        "operation":"remote_decline"
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX68",
    "timestamp":1642648260029
    }
```

#### 拉黑好友

payload 字段含义：

| 字段         | 数据类型 | 含义                   |
| :----------- | :------- | :--------------------- |
| `operation`  | String   | `ban`：拉黑好友。      |
| `status`     | object   | 包含 `error_code`。    |
| `error_code` | String   | 操作失败对应的错误码。 |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725184268539960",
    "security":"00f070116668034ddecf3fb7db92087c",
    "payload":{
        "operation":"ban",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"9XXXX0",
    "timestamp":1642648046912
}
```

#### 解除拉黑好友

payload 字段含义：

| 字段         | 数据类型 | 含义                    |
| :----------- | :------- | :---------------------- |
| `operation`  | String   | `allow`：解除拉黑好友。 |
| `status`     | object   | 包含 `error_code`。     |
| `error_code` | String   | 操作失败对应的错误码。  |

payload 示例：

```json
{
    "chat_type":"roster",
    "callId":"XXXX#XXXX_966725018736134200",
    "security":"cbe8a5f1ba384107b63ef61637f55cad",
    "payload":{
        "operation":"allow",
        "status":{
            "error_code":"ok"
            }
        },
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "from":"XXXX#XXXX",
    "to":"tst",
    "eventType":"chat",
    "msg_id":"966725018736134200",
    "timestamp":1642648008357
}
```

#### 远程同意

payload 字段含义：

| 字段         | 数据类型 | 含义                                                        |
| :----------- | :------- | :---------------------------------------------------------- |
| `roster_ver` | String   | 好友列表的版本号。                                          |
| `operation`  | String   | `remote_accept`：远程同意，服务端上给好友申请发起人的回调。 |

payload 示例：

```json
{ 
    "chat_type": "roster", 
    "callId": "XXXX#XXXX_967182720616630320", 
    "security": "f4bc73eb6e7764e383521c2e88dc2729", 
    "payload": { 
        "roster_ver": "1BD5718E9C9D3F0C572A5157CFC711D4F6FA490F", 
        "operation": "remote_accept" 
        }, 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX_XXXX/android_XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "967182720616630320", 
    "timestamp": 1642754575382 
    }
```

#### 远程拒绝

payload 字段含义：

| 字段         | 数据类型 | 含义                                                         |
| :----------- | :------- | :----------------------------------------------------------- |
| `roster_ver` | String   | 好友列表的版本号。                                           |
| `operation`  | String   | `remote_decline`：远程拒绝，服务端上给好友申请发起人的回调。 |

payload 示例：

```json
{ 
    "chat_type": "roster", 
    "callId": "XXXX#XXXX_967182895737210928", 
    "security": "27f5b919623380cc11d863ef957aa61b", 
    "payload": { 
        "roster_ver": "CFC06E0BA39E8B7FD493D102E2F8F3CAE678B380", 
        "operation": "remote_decline" 
        }, 
    "host": "XXXX", 
    "appkey": "XXXX#XXXX", 
    "from": "XXXX#XXXX/android_XXXX", 
    "to": "2222", 
    "eventType": "chat", 
    "msg_id": "967182895737210928", 
    "timestamp": 1642754616149 
}
```

### ack 事件

| 事件         | payload 中类型 | 触发事件     |
| :----------- | :------------- | :----------- |
| `read_ack`     | 无             | 发送已读回执 |
| `delivery_ack` | 无             | 发送送达回执 |

#### 发送已读回执

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `chat_type` | String   | `read_ack` 已读回执。                                        |
| `callId`    | String   | `callId` 为 `{appkey}_{uuid}` 其中 uuid 为随机生成，作为每条回调的唯一标识。 |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。 Secret 见 Console 后台回调规则。 |
| `payload`   | object   | 包括：<br/> - `ext`：消息的扩展字段、<br/> - `ack_message_id`：消息 ID、<br/> - `bodies`：消息体内容。 |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `from`      | String   | 发送已读回执用户 ID。                                        |
| `to`        | String   | 接收已读回执用户 ID。                                        |
| `eventType` | String   | `chat`：单聊。                                               |
| `timestamp` | long     | 到环信 IM 服务器的 Unix 时间戳，单位为 ms。                  |
| `msg_id`    | String   | 该回执消息的消息 ID。                                        |

回调请求示例：

```json
{
    "chat_type": "read_ack",
    "callId": "XXXX#XXXX_968665325555943556",
    "security": "bd63d5fa8f72823e6d33e09a43aa4239",
    "payload": {
        "ext": {},
        "ack_message_id": "968665323572037776",
        "bodies": []
    },
    "host": "msync@ebs-ali-beijing-msync45",
    "appkey": "XXXX#XXXX",
    "from": "1111",
    "to": "2222",
    "eventType": "chat",
    "msg_id": "968665325555943556",
    "timestamp": 1643099771248
}
```

### 用户登入登出

| 事件                | 主要字段                                 | 触发事件             |
| :------------------ | :--------------------------------------- | :------------------- |
| `userStatus`          | -                                        | 用户在线状态变更事件 |
| `userStatus:login`    | `{“status”:“online”,”reason“:“login”}`     | 用户登录             |
| `userStatus:logout`   | `{“status”:“offline”,”reason“:“logout”}`   | 用户登出             |
| `userStatus:replaced` | `{“status”:“offline”,”reason“:“replaced”}` | 用户登出             |

#### 用户登录

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为 `{appkey}_{uuid}` 其中 `uuid` 为随机生成，作为每条回调的唯一标识。 |
| `reason`    | object   | `login`，用户登录。                                          |
| `security`  | String   | 签名，格式如下: MD5（callId+secret+timestamp）。 Secret 见 Console 后台回调规则。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，为 {App Key/设备类型_设备 ID}。              |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 登录请求到环信 IM 服务器的 Unix 时间戳，单位为 ms。          |
| `status`    | String   | `online`，在线。                                             |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX",
    "reason":"login",
    "security":"XXXX",
    "os":"ios",
    "ip":"XXXX",
    "host":"XXXX",
    "appkey":"XXXX#XXXX",
    "user":"XXXX",
    "version":"3.8.9.1",
    "timestamp":1642585154644,
    "status":"online"
}
```

#### 用户登出

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为 `{appkey}_{uuid}` 其中 `uuid` 为随机生成，作为每条回调的唯一标识。 |
| `reason`    | object   | `logout` 该用户登出账号。                                    |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。Secret 见 Console 后台回调规则。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，为 `{App Key/设备类型_设备 ID}`。              |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 请求到环信 IM 服务器的 Unix 时间戳，单位为 ms。              |
| `status`    | String   | `offline`，离线。                                            |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX_25b54a81-1376-4669-bb3d-178339a8f11b",
    "reason":"logout",
    "security":"2c7dd77e61b8f26801627fdaadca987e",
    "os":"ios",
    "ip":"XXXX",
    "host":"********",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX/ios_6d580737-db3a-d2b5-da18-b6045ffd195b",
    "version":"3.8.9.1",
    "timestamp":1642648914742,
    "status":"offline"
}
```

#### 用户登出（被其他设备踢掉）

回调请求主要字段含义：

| 字段        | 数据类型 | 含义                                                         |
| :---------- | :------- | :----------------------------------------------------------- |
| `callId`    | String   | `callId` 为 `{appkey}_{uuid}` 其中 `uuid` 为随机生成，作为每条回调的唯一标识。 |
| `reason`    | object   | `replaced`，该用户登出，原因是被其他设备登录踢掉。           |
| `security`  | String   | 签名，格式如下: `MD5（callId+secret+timestamp）`。Secret 见 Console 后台回调规则。 |
| `os`        | String   | 设备类型。                                                   |
| `ip`        | String   | 用户登录 IP。                                                |
| `host`      | String   | 服务器名称。                                                 |
| `appkey`    | String   | 你在环信管理后台注册的应用唯一标识。                         |
| `user`      | String   | 登录用户识别号，为 `{App Key/设备类型_设备 ID}`。              |
| `version`   | String   | SDK 版本号。                                                 |
| `timestamp` | long     | 请求到环信 IM 服务器的 Unix 时间戳，单位为毫秒 。              |
| `status`    | String   | `offline`，离线。                                            |

回调请求示例：

```json
{
    "callId":"XXXX#XXXX_260ae3eb-ba31-4f01-9a62-8b3b05f3a16c",
    "reason":"replaced",
    "security":"0ac500b1a1e44fe76dbfdc664cbaa76b",
    "os":"ios","ip":"223.71.97.198:52709",
    "host":"msync@ebs-ali-beijing-msync40",
    "appkey":"XXXX#XXXX",
    "user":"XXXX#XXXX_XXXX/ios_a5fa01fd-b5a4-84d5-ebeb-bf10e8950442",
    "version":"3.8.9.1",
    "timestamp":1642648955563,
    "status":"offline"
}
```

### 敏感词监测

| 事件                       | payload 中类型                | 触发事件             |
| :------------------------- | :---------------------------- | :------------------- |
| `sensitiveWords`             | -                             | 敏感词所有事件       |
| `sensitiveWords:intercepted` | `{“alertReason”:“intercepted”}` | 因为触发敏感词被拦截 |

### Reaction 回调事件

响应体字段含义：

| 字段             | 数据类型   | 含义             |
|:---------------|:-------|:---------------|
| `chat_type` | String | 会话类型（默认全选）：<br/> - "chat"：单聊回调；<br/> - "groupchat"：群聊回调包含了群组和聊天室的消息回调；<br/> - "notify"：通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 type 字段确定具体类型。｜
| `payload.type`         | String | 固定值 "reaction"。 |
| `payload.channel_type` | String | 会话类型：<br/> - "chat"：单聊。<br/> - "groupchat"：群聊。  |
| `payload.data.ts` | Long | 当前 Reaction 操作的 Unix 时间戳，单位为毫秒。
| `payload.num`          | Number | 操作次数。       |
| `payload.data`         | List   | Reaction 操作详细内容。 |
| `payload.data.to` | String | 消息接收方。 |
| `payload.data.reactions`    | List | Reaction 通知数据结构。 |
| `payload.data.reactions.reaction`  | String | Reaction 表情。 |  
| `payload.data.reactions.userList`  | List | Reaction 表情操作人员列表。 |
| `payload.data.reactions.count`    | Number  | Reaction 表情被操作次数。 |
| `payload.data.reactions.op`    | List | Reaction 当前操作详情。 |
| `payload.data.reactions.op.reactionType`    | String| Reaction 当前操作类型。 |
| `payload.data.reactions.op.operator`    | String | Reaction 当前操作人。 ｜

其他字段见 [公共参数](#回调内容中单聊_群聊_聊天室事件的公共参数说明)。

回调请求示例：

```json
{
    "chat_type": "notify",
    "payload":
    {
        "data":
        [
            {
                "messageId": "99XXXX32",
                "from": "user2",
                "reactions":
                [
                    {
                        "reaction": "test",
                        "userList":
                        [
                            "user2"
                        ],
                        "count": 1
                    },
                    {
                        "op":
                        [
                            {
                                "reactionType": "create",
                                "operator": "user2"
                            }
                        ],
                        "reaction": "test-1",
                        "userList":
                        [
                            "user2"
                        ],
                        "count": 1
                    }
                ],
                "to": "user3",
                "channel_type": "chat",
                "ts": 1648722783700
            }
        ],
        "num": 2,
        "channel_type": "chat",
        "type": "reaction"
    },
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "user1",
    "to": "user2",
    "eventType": "chat",
    "msg_id": "99XXXX56",
    "timestamp": 1648722784819
}
```

### Thread 回调事件

主要字段含义：

| 字段                 | 数据类型 | 含义                              |
| :------------------- | :------- | :-------------------------------- |
| `chat_type` | String | 会话类型（默认全选）：<br/> - "chat"：单聊回调；<br/> - "groupchat"：群聊回调包含了群组和聊天室的消息回调；<br/> - "notify"：通知回调包含了 Thread 和 Reaction 的回调，需要结合 payload 中的 type 字段确定具体类型。 |
| `payload.type`               | String   | 固定值 "thread"。                 |
| `payload.data`               | JSON     | Thread 操作数据结构。             |
| `payload.data.id`            | String   | Thread 的 ID。                    |
| `payload.data.name`          | String   | Thread 名称。                     |
| `payload.data.from`          | String   | Thread 消息的操作人。             |
| `payload.data.operation`     | String   | Thread 发送消息的事件：`update_msg`：消息更新。           |
| `payload.data.msg_parent_id` | String   | 创建 Thread 的消息 ID，可能为空。 |
| `payload.data.message_count` | Number   | Thread 消息的总数。               |
| `payload.data.muc_parent_id` | String   | 创建 Thread 时所在的群组 ID。     |
| `payload.data.last_message`  | JSON     | 最近一条消息的内容。              |

其他字段见 [公共参数](#回调内容中单聊_群聊_聊天室事件的公共参数说明)。

回调请求示例：

```json
{
    "chat_type": "notify",
    "payload":
    {
        "data":
        {
            "msg_parent_id": "98XXXX12",
            "name": "test",
            "from": "user1",
            "last_message":
            {
                "payload":
                {
                    "ext":
                    {},
                    "bodies":
                    [
                        {
                            "msg": "thread test",
                            "type": "txt"
                        }
                    ],
                    "meta":
                    {
                        "thread":
                        {
                            "msg_parent_id": "98XXXX12",
                            "thread_name": "test",
                            "muc_parent_id": "user2"
                        }
                    },
                    "from": "user1",
                    "to": "17XXXX93",
                    "type": "groupchat"
                },
                "from": "XXXX#XXXX_yifan2",
                "id": "10XXXX28",
                "to": "XXXX#XXXX_17XXXX93",
                "timestamp": 1651029973455
            },
            "id": "17XXXX93",
            "message_count": 49,
            "operation": "update_msg",
            "muc_parent_id": "user2",
            "timestamp": 1651029973455
        },
        "type": "thread"
    },
    "host": "XXXX",
    "appkey": "XXXX#XXXX",
    "from": "admin",
    "to": "user2",
    "eventType": "chat",
    "msg_id": "10XXXX24",
    "timestamp": 1651029973480
}
```