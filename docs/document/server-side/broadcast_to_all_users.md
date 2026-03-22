# 向 app 所有用户发送广播消息

## 功能说明

可通过该接口向 app 下的所有用户发送广播消息，支持所有消息类型：

- 广播消息向 app 下的所有用户发送。
- 广播消息支持离线存储，若用户离线，服务器会存储离线消息（默认 7 天），若你集成了离线推送，则服务器会发送离线通知。
- 广播消息写入服务端会话列表，支持消息漫游。
- 广播消息支持计入消息未读数。
- 广播消息没有消息 ID，只有广播 ID。
- 广播消息不触发 [发送前回调](callback_presending.html)。

## 功能开通

发送 app 全局广播消息功能的开通取决于即时通讯 IM 的套餐版本：

- **专业版**：此功能默认关闭，**若要使用，需联系环信商务开通**。
- **旗舰版**：此功能默认开启。

开通后，你可以向 app 所有用户发送广播消息、[向 app 在线用户发送广播消息](broadcast_to_online_users.html)。

## 调用频率上限

1. 每 30 分钟限 1 次，不支持上调。超限上报 429 错误，即 "This request has reached api limit"。
2. 每天限 3 次，支持联系商务上调。超限上报 403 错误，即 "broadcast message limit exceeded"。
3. 每秒最多可向 1000 个用户发消息，不支持上调。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/messages/broadcast
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

- 发送文本广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "txt",
        "msg": "send broadcast to all users"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送图片广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "img",
        "filename":"testimg.jpg",
        "secret":"VfXXXXNb_",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252",
        "size":{
           "width":480,
           "height":720
        }
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送语音广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "audio",
        "url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42",
        "filename": "testaudio.amr",
        "length": 10,
        "secret": "HfXXXXCjM"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送视频广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "video",
        "filename": "1418105136313.mp4",
        "thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
        "length" : 0,
        "secret":"VfXXXXNb_",
        "file_length" : 58103,
        "thumb_secret" : "ZyXXXX2I",
        "url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送文件广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "file",
        "filename":"test.txt",
        "secret":"1-g0XXXXua",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送位置广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "loc",
        "lat": "39.966",
        "lng":"116.322",
        "addr":"中国北京市海淀区中关村"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送透传广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "cmd",
        "action":"action1"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

- 发送自定义广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "target_type": "users",
    "msg": {
        "type": "custom",
        "customEvent": "custom_event"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

以下为发送文本类型的广播消息的请求 body。

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `target_type`          | String | 是       | 广播消息接收方。固定值为 `users`，表示 app 下的所有用户。  |
| `from`          | String | 否       | 广播消息发送方的用户 ID。若不传入该字段，服务器默认设置为管理员，即 `admin`；若传入字段但值为空字符串 ("")，请求失败。  |
| `msg` | JSON | 是 | 消息体包含的信息。  |
| `msg.type` | String | 是 | 广播消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `msg.msg` | String | 是 | 消息内容。  |
| `ext`           | JSON   | 否       | 广播消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。 |

不同类型的消息的请求体只在 `msg` 字段有差别，其他参数相同。除了 `type` 字段，`msg` 字段中包含的参数与单聊、群聊和聊天室消息的请求体中的 `body` 字段含义相同，详见 [发送单聊消息](message_single.html)、[发送群聊消息](message_group.html) 或 [发送聊天室消息](message_chatroom.html)中的消息 body 的参数说明。

## 响应示例

```json
{
    "path": "/messages/broadcast",
    "uri": "https://XXXX/XXXX/XXXX/messages/broadcast",
    "timestamp": 1745565192019,
    "organization": "XXXX",
    "application": "5371aaa4-4a53-XXXX-XXXX-2bc6b3e401d7",
    "action": "post",
    "data": {
        "id": 1365344904091349007
    },
    "duration": 0,
    "applicationName": "XXXX"
}
```

## 响应 body 字段

对于各类型的广播消息来说，响应中包含的各字段相同。

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述   |
| :----- | :--- | :----------- |
| `data.id` | JSON | 广播 ID。 |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html)了解可能的原因。

## 错误码

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因    | 处理建议     |
|:---------|:-------------------|:-----------------|:-----------|:----------|
| 400      | illegal_argument | ext must be JSONObject  | `ext` 不为空时，必须是 JSON 结构。| 若设置 `ext`，只能传入 JSON 格式的数据。 |
| 400      | illegal_argument | from can't be empty  | `from` 不能为空。| `from` 为必填字段，必须设置。 |
| 400      | illegal_argument | target_type can only be 'users'  | `target_type` 的值只能为 `users`。| `target_type` 的值只能为 `users`，不能传入其他值。 |
| 400      | illegal_argument | target_type must be provided  | `target_type` 不能为空。| `target_type` 不能为空，只能传入 `users`。 |
| 403      | forbidden_op | message broadcast service is unopened  | 未开通发送广播消息的功能配置。| 联系商务开通。 |
| 429      | - | This request has reached api limit  | 每 30 分钟限调接口 1 次。| 该限制不支持上调，请降低发送频率。 |
| 403      | forbidden_op | broadcast message limit exceeded  | 每天接口调用次数超限（默认 3 次）。| 联系商务上调 API 调用频率上限。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。