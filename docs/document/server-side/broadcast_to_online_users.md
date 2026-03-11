# 向 app 在线用户发送广播消息

## 功能说明

可通过该接口向 app 下的所有在线用户发送广播消息，支持所有消息类型。

- 广播消息只向 app 下的在线用户发送。
- 广播消息不支持离线存储，即离线用户收不到这些消息。
- 广播消息写入服务端会话列表，默认不支持漫游功能。**如果需要，请联系商务开通。**
- 广播消息没有消息 ID，只有广播 ID。
- 广播消息不触发 [发送前回调](callback_presending.html)。

## 功能开通

发送 app 全局广播消息功能的开通取决于即时通讯 IM 的套餐版本：

- **专业版**：此功能默认关闭，**若要使用，需联系环信商务开通**。
- **旗舰版**：此功能默认开启。

开通后，你可以 [向 app 所有用户发送广播消息](broadcast_to_all_users.html)、向 app 在线用户发送广播消息。

## 调用频率上限

- 每分钟限 1 次，不支持上调，超限上报 429 错误，即 "This request has reached api limit"。
- 每天限 50 次，支持上调，超限上报 403 错误，即 "online user broadcast limit exceeded"。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/messages/users/broadcast
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

- 发送文本广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "txt",
        "msg": "send broadcast to all online users"
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "video",
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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

curl -X POST 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
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
| `from`          | String | 否       | 广播消息发送方的用户 ID。若不传入该字段，服务器默认设置为管理员，即 `admin`；若传入字段但值为空字符串 ("")，请求失败。  |
| `msg` | JSON | 是 | 消息体包含的信息。  |
| `msg.type` | String | 是 | 广播消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `msg.msg` | String | 是 | 消息内容。  |
| `ext`           | JSON   | 否       | 广播消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。 | 

不同类型的消息的请求体只在 `msg` 字段有差别，其他参数相同。除了 `type` 字段，`msg` 字段中包含的参数与单聊、群聊和聊天室消息的请求体中的 `body` 字段含义相同，详见[发送单聊消息](message_single.html)、[发送群聊消息](message_group.html) 或 [发送聊天室消息](message_chatroom.html)中的消息 body 的参数说明。

## 响应示例

```json
{
  "path": "/messages/users/broadcast",
  "uri": "https://XXXX/XXXX/XXXX/messages/users/broadcast",
  "timestamp": 1699944653964,
  "organization": "XXXX",
  "application": "331d42e6-ad85-XXXX-XXXX-d1fb6fef9f12",
  "action": "post",
  "data": {
    "id": 1173998498812376874
   },
  "duration": 1,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

对于各类型的广播消息来说，响应中包含的各字段相同。

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 中的 `data` 字段说明如下：

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

对于应用全局广播消息，如果返回的 HTTP 状态码非 `200`，表示请求失败。除了发送普通消息的常见错误码，还可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因    | 处理建议     |
|:---------|:-------------------|:-----------------|:-----------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | 请求体格式不正确。 | 检查请求体内容是否合法(字段类型是否正确)。  |
| 400      | illegal_argument | from can't be empty  | 请求参数 `from` 是空字符串。  | 输入正确的请求参数 `from` 。若不传该字段， 服务器会默认设置为 `admin`。   |
| 400      | illegal_argument | ext must be JSONObject | 请求参数 `ext` 类型不正确。  | 输入正确的请求参数 `ext`（JSON 格式）。  |
| 429     | - | This request has reached api limit | 每分钟限调接口 1 次。 | 该限制不支持上调，请降低发送频率。   |
| 403      | forbidden_op | online user broadcast limit exceeded |  每天接口调用次数超限（默认 50 次）。| 联系商务上调频率限制。 | 
| 403      | forbidden_op | message broadcast service is unopened | 未开通发送广播消息的功能配置。| 联系商务开通。 |
| 405       |  |   | 请求方法错误。| 该 REST API 的请求方法为 POST，请勿使用 GET、PUT 或 DELETE 等方法。 |

此外，你可以参考[发送单聊消息](message_single.html#错误码)、[发送群聊消息](message_group.html#错误码)、[发送聊天室消息](message_chatroom.html#错误码) 或 [响应状态码](error.html#错误状态码概述) 了解可能的原因。