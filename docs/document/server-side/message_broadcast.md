# 发送全局广播消息

即时通讯 IM 支持向 app 所有在线用户发送全局广播消息以及发送聊天室全局广播消息。**该功能默认关闭，使用前需联系环信商务开通。**

## 向 app 在线用户发送广播消息

可通过该接口向 app 下的所有在线用户发送广播消息，支持所有消息类型。

- 广播消息只向 app 下的在线用户发送。
- 广播消息不支持离线存储，即离线用户收不到这些消息。
- 广播消息写入服务端会话列表，默认不支持漫游功能。**如果需要，请联系商务开通。**

**发送频率**：每分钟限 1 次，每天限 50 次（可联系商务提升该上限）。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/users/broadcast
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

以下为发送文本类型的广播消息的请求 body。

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `from`          | String | 否       | 广播消息发送方的用户 ID。若不传入该字段，服务器默认设置为管理员，即 `admin`；若传入字段但值为空字符串 (“”)，请求失败。  |
| `msg` | JSON | 是 | 消息体包含的信息。  |
| `msg.type` | String | 是 | 广播消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `msg.msg` | String | 是 | 消息内容。  |
| `ext`           | JSON   | 否       | 广播消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。 | 

不同类型的消息的请求体只在 `msg` 字段有差别，其他参数相同。除了 `type` 字段，`msg` 字段中包含的参数与单聊、群聊和聊天室消息的请求体中的 `body` 字段含义相同，详见[发送单聊消息](message_single.html)、[发送群聊消息](message_group.html)和[发送聊天室消息](message_chatroom.html)中的消息 body 的参数说明。

#### HTTP 响应

##### 响应 body

对于各类型的广播消息来说，响应中包含的各字段相同。

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述   |
| :----- | :--- | :----------- |
| `data.id` | JSON | 广播 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html)了解可能的原因。

#### 示例

##### 请求示例

- 发送文本广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
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

curl -L 'https://XXXX/XXXX/XXXX/messages/users/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "custom",
        "customEvent": "custom_event",
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    }
}'
```

##### 响应示例

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

#### 错误码

对于应用全局广播消息，如果返回的 HTTP 状态码非 `200`，表示请求失败。除了发送普通消息的常见错误码，还可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因    | 处理建议     |
|:---------|:-------------------|:-----------------|:-----------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | 请求体格式不正确。 | 检查请求体内容是否合法(字段类型是否正确)。  |
| 400      | illegal_argument | from can't be empty  | 请求参数 `from` 是空字符串。  | 输入正确的请求参数 `from` 。若不传该字段， 服务器会默认设置为 `admin`。   |
| 400      | illegal_argument | ext must be JSONObject | 请求参数 `ext` 类型不正确。  | 输入正确的请求参数 `ext`（JSON 格式）。  |
| 403      | forbidden_op | message broadcast service is unopened  | 未开通发送广播消息的功能配置。| 联系商务开通。 | 
| 403      | message_send_error | online user broadcast limit exceeded | app 全局广播消息发送频率超出限制(默认每分钟限 1 次，每天限 50 次)。 | 限制消息发送频率，详见[文档说明](#向-app-在线用户发送广播消息)。 |

此外，你可以参考[发送单聊消息](message_single.html#错误码)、[发送群聊消息](message_group.html#错误码)和[发送聊天室消息](message_chatroom.html#错误码)的错误码了解可能的原因。

## 发送聊天室全局广播消息

即时通讯 IM 支持向 app 下的所有活跃聊天室（聊天室至少存在一个成员，而且曾经至少发送过一条消息）发送广播消息，支持所有消息类型。

**发送频率**：每分钟限发 10 次，每天限发 100 次广播消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms/broadcast
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数       | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

以下为发送文本类型的广播消息的请求 body。

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `from`          | String | 否       | 广播消息发送方的用户 ID。若不传入该字段，服务器默认设置为管理员，即 “admin”；若传入字段但值为空字符串 (“”)，请求失败。  |
| `chatroom_msg_level` | String | 否       | 聊天室消息优先级：<br/> - `high`：高； <br/> - （默认）`normal`：普通；<br/> - `low`：低。 |
| `msg` | JSON | 是 | 消息体包含的信息。  |
| `msg.type` | String | 是 | 广播消息类型：<br/> - `txt`：文本消息；<br/> - `img`：图片消息；<br/> - `audio`：语音消息；<br/> - `video`：视频消息；<br/> - `file`：文件消息；<br/> - `loc`：位置消息；<br/> - `cmd`：透传消息；<br/> - `custom`：自定义消息。 |
| `msg.msg` | String | 是 | 消息内容。  |
| `ext`           | JSON   | 否       | 广播消息支持扩展字段，可添加自定义信息。不能对该参数传入 `null`。同时，推送通知也支持自定义扩展字段，详见 [APNs 自定义显示](/document/ios/push/push_display.html#使用消息扩展字段设置推送通知显示内容) 和 [Android 推送字段说明](/document/android/push/push_display.html#使用消息扩展字段设置推送通知显示内容)。 |

不同类型的消息的请求体只在 `msg` 字段有差别，其他参数相同。除了 `type` 字段，`msg` 字段中包含的参数与发送聊天室消息的请求体中的 `body` 字段含义相同，详见各类消息的参数说明。
- [发送图片消息](message_chatroom.html#发送图片消息)
- [发送语音消息](message_chatroom.html#发送语音消息)
- [发送视频消息](message_chatroom.html#发送视频消息)
- [发送文件消息](message_chatroom.html#发送文件消息)
- [发送位置消息](message_chatroom.html#发送位置消息)
- [发送透传消息](message_chatroom.html#发送透传消息)
- [发送自定义消息](message_chatroom.html#发送自定义消息)

#### HTTP 响应

##### 响应 body

对于各类型的广播消息来说，响应中包含的各字段相同。

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应 body 包含如下字段：

| 参数   | 类型 | 描述   |
| :----- | :--- | :----------- |
| `data.id` | JSON | 广播 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

#### 请求示例

- 发送文本广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "txt",
        "msg": "send broadcast to all chatroom"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- 发送图片广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送语音广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送视频广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送文件广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送位置广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送透传广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
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
    },
    "chatroom_msg_level": "low"
}'
```

- 发送自定义广播消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "custom",
        "customEvent": "custom_event",
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

#### 响应示例

```json
{
  "path": "/messages/chatrooms/broadcast",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast",
  "timestamp": 1699944653964,
  "organization": "easemob-demo",
  "application": "331d42e6-ad85-460f-b6b0-d1fb6fef9f12",
  "action": "post",
  "data": {
    "id": 1173998498812376874
   },
  "duration": 1,
  "applicationName": "wang"
}
```

#### 错误码

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因    | 处理建议     |
|:---------|:-------------------|:-----------------|:-----------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | 请求体格式不正确。 | 检查请求体内容是否合法(字段类型是否正确)。  |
| 400      | illegal_argument | from can't be empty  | 请求参数 `from` 是空字符串。  | 输入正确的请求参数 `from` 。若不传该字段， 服务器会默认设置为 `admin`。   |
| 400      | illegal_argument | ext must be JSONObject | 请求参数 `ext` 类型不正确。  | 输入正确的请求参数 `ext`（JSON 格式）。  |
| 403      | forbidden_op | message broadcast service is unopened  | 未开通发送聊天室广播消息的功能配置。| 联系商务开通。 |
| 403      | message_send_error | chatroom broadcast limit exceeded | 聊天室全局广播消息发送频率超出限制(默认每分钟限发 10 次，每天限发 100 次广播消息)。 | 限制消息发送频率，详见[文档说明](#发送聊天室全局广播消息)。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。