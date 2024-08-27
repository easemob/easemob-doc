# 撤回消息和单向删除会话

<Toc />

你可以撤回发送成功的消息，包括客户端发送的消息以及通过 RESTful API 发送的消息。调用 RESTful API 撤回消息后，服务端的该条消息（历史消息，离线消息或漫游消息）以及消息发送方和接收方的内存和数据库中的消息均会撤销。 

此外，你也可以从服务器中单向删除会话，并且设置是否删除该会话在服务端的漫游消息。

## 撤回消息

发送方可以撤回一条发送成功的消息。默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/msg_recall
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数    | 类型   | 是否必需 | 描述        |
| :---------- | :----- | :------- | :------------------ |
| `msg_id`    | String | 是       | 要撤回消息的消息 ID。由于每次只能撤销一条消息，因此只能传入一个消息 ID。 |
| `to`        | String | 是       | 要撤回消息的接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。<br/> 若不传入该参数，请求失败。        |
| `chat_type` | String | 是       | 要撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊 ；<br/> - `chatroom`：聊天室 。  |
| `from`      | String | 否       | 消息撤回方的用户 ID。若不传该参数，默认为 `admin`。    |
| `sync_device`| Bool | 否       | 是否支持单聊消息撤回同步给 `from` 参数设置的消息撤回方（支持多端多设备撤回）：<br/> - (默认) `true`：是； <br/> - `false`：否。 |
| `force`     | Bool   | 否       | 是否支持强制撤回消息。<br/> - `true`：是。这种情况下，无论消息是否过期，你都可以撤回。<br/> - `false`：否。这种情况下，你只能在撤回时长内撤销服务端存在的消息。  |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述             |
| :--------- | :----- | :-------------------------- |
| `msg_id`   | String | 需要撤回的消息 ID。      |
| `recalled` | String | 消息撤回结果，成功是 `yes`。      |
| `from`     | String | 消息撤回方的用户 ID。    |
| `to`       | String | 撤回消息的送达方。<br/> - 单聊为送达方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。 |
| `chattype` | String | 撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。     |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -i -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer <YourAppToken>"
"https://XXXX/XXXX/XXXX/messages/msg_recall"
-d '{
    "msg_id": "1028442084794698104",
    "to": "user2",
    "from": "user1",
    "chat_type": "chat",
    "force": true
}'
```

#### 响应示例

```json
{
  "path": "/messages/msg_recall",
  "uri": "https://XXXX/XXXX/XXXX/messages/msg_recall",
  "timestamp": 1657529588473,
  "organization": "XXXX",
  "application": "09ebbf8b-XXXX-XXXX-XXXX-d47c3b38e434",
  "action": "post",
  "data": {
    "recalled": "yes",
    "chattype": "chat",
    "from": "XXXX",
    "to": "XXXX",
    "msg_id": "1028442084794698104"
  },
  "duration": 8,
  "applicationName": "XXXX"
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                  | 可能原因    | 处理建议      |
|:---------|:-------------------|:----------------------|:--------|:----------|
| 400      | message_recall_error | param msg_id can't be empty | 请求参数 `msg_id` 是空字符串。 | 输入正确的请求参数 `msg_id`。 |
| 400      | message_recall_error | param to can't be empty | 请求参数 `to` 是空字符串。| 输入正确的请求参数 `to`。 |
| 400      | message_recall_error | param chat_type can't be empty | 请求参数 `chat_type` 是空字符串。| 输入正确的请求参数`chat_type`。  |
| 400      | message_recall_error | param force can't be empty | 请求参数 `force` 是空。 | 输入正确的请求参数 `force`。  |
| 400      | message_recall_error | can’t find msg to | 未找到撤回消息的接收⽅。 | 需传入正确的消息接收方。 |
| 403        | message_recall_error | exceed recall time limit | 消息撤回超时。 | 消息撤回时长默认为消息发送后的 2 分钟。  |
| 403      | message_recall_error | not_found msg | 消息因过期在服务端删除或消息已被撤回。 | 若撤回过期的消息，你需要开启强制撤回，即将 `force` 设置为 `true`。这种情况下，会撤回接收方在本地保存的消息，但发送方本地消息仍存在。<br/>若消息已被撤回，则无需重复撤回。        |
| 403       | forbidden_op         | message recall service is unopened | 消息撤回服务未在环信即时通讯云管理后台开通。| 请先在环信即时通讯云管理后台开通该服务。 |
| 500      |                      | internal error | 后端服务出现异常。 |      |

例如，消息撤回服务未在环信即时通讯云管理后台开通，返回示例如下：

```json
{
  "error": "forbidden_op",
  "exception": "EasemobForbiddenOpException",
  "timestamp": 1644402553845,
  "duration": 0,
  "error_description": "message recall service is unopened"
}
```

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 单向删除会话

该方法使聊天用户能够从服务器中删除会话。删除会话后，该用户将从服务器获取不到该会话。该会话的其他参与聊天用户仍然可以从服务器获取会话内容。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/user_channel
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                      |
| :--------- | :----- | :------- | :---------------------------------------- |
| `username` | String | 是       | 要删除会话的用户的唯一标识符，即用户 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数          | 类型   | 是否必需 | 描述   |
| :------------ | :----- | :------- | :------------------------- |
| `channel`     | String | 是       | 要删除的会话 ID。该参数的值取决于会话类型 `type` 的值:<br/> - `type` 为 `chat`，即单聊时，会话 ID 为对端用户 ID；<br/> - `type` 为 `groupchat`，即群聊时，会话 ID 为群组 ID。 |
| `type`        | String | 是       | 会话类型。<br/> - `chat`：单聊会话；<br/> -`groupchat`：群聊会话。       |
| `delete_roam` | Bool   | 是       | 是否删除该会话在服务端的漫游消息。<br/> - `true`：是。若删除了该会话的服务端消息，则用户无法从服务器拉取该会话的漫游消息。<br/> - `false`：否。用户仍可以从服务器拉取该会话的漫游消息。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                  |
| :------- | :----- | :---------------------------------------------------- |
| `result` | String | 删除结果，`ok` 表示成功，失败则直接返回错误码和原因。 |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L -X DELETE 'https://XXXX/XXXX/XXXX/users/u1/user_channel' \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-d '

{ "channel": "u2", "type": "chat", "delete_roam": true }
'
```

#### 响应示例

```json
{
  "path": "/users/user_channel",
  "uri": "https://XXXX/XXXX/XXXX/users/u1/user_channel",
  "timestamp": 1638440544078,
  "organization": "XXXX",
  "application": "c3624975-XXXX-XXXX-9da2-ee91ed4c5a76",
  "entities": [],
  "action": "delete",
  "data": {
    "result": "ok"
  },
  "duration": 3,
  "applicationName": "XXXX"
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                  | 可能原因             | 处理建议      |
|:---------|:-------------------|:----------------------|:-----------------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | 请求体格式不正确。  | 检查请求体内容是否合法(字段类型是否正确) 。    |
| 400      | illegal_argument | field channel cannot be null or empty | 请求参数 `channel` 是空字符串 | 输入正确的请求参数 `channel`。|
| 400      | illegal_argument | field type cannot be null or empty | 请求参数 `type` 是空字符串。 | 输入正确的请求参数 `type`。 |
| 400      | illegal_argument | field delete_roam cannot be null | 请求参数 `delete_roam` 是空。 | 输入正确的请求参数`delete_roam`。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。