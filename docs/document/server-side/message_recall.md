# 撤回消息

<Toc />

你一次可以撤回发送成功的单条或多条消息，包括客户端发送的消息以及通过 RESTful API 发送的消息。调用 RESTful API 撤回消息后，服务端的消息（历史消息，离线消息或漫游消息）以及消息发送方和接收方的内存和数据库中的消息均会撤销。 

默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。

对于附件类型消息，包括图片、音频和视频和文件消息，撤回消息后，消息附件也相应删除。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

#### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

#### 响应参数

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                          |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。                                     |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 撤回单条消息

发送方可以撤回一条发送成功的消息。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/msg_recall
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数    | 类型   | 是否必需 | 描述        |
| :---------- | :----- | :------- | :------------------ |
| `msg_id`    | String | 是       | 要撤回消息的消息 ID。由于每次只能撤销一条消息，因此只能传入一个消息 ID。 |
| `to`        | String | 是       | 要撤回消息的接收方。<br/> - 单聊为接收方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。<br/> 若不传入该参数，请求失败。        |
| `chat_type` | String | 是       | 要撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊 ；<br/> - `chatroom`：聊天室 。  |
| `from`      | String | 否       | 消息撤回方的用户 ID。若不传该参数，默认为 `admin`。    |
| `sync_device`| Bool | 否       | 是否支持单聊消息撤回同步给消息发送方的所有在线设备：<br/> - (默认) `true`：是； <br/> - `false`：否。<Container type="tip" title="提示">当参数 `force` 设置为 `true` 且消息已过期，此时若要将消息撤回同步发送方，则需将 `from` 参数设置为消息发送方。</Container>|
| `force`     | Bool   | 否       | 是否支持强制撤回消息。<br/> - `true`：是。这种情况下，无论消息是否过期，你都可以撤回。若需撤回已过期的消息，`force` 须设置为 `true`。 <br/> - `false`：否。这种情况下，你只能在撤回时长内撤销服务端存在的消息。  |
| `recallMessageExtensionInfo`    | String | 否       | 消息撤回相关的扩展信息。 |

#### HTTP 响应

##### 响应 body

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

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -i -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H "Authorization: Bearer <YourAppToken>"
"https://XXXX/XXXX/XXXX/messages/msg_recall"
-d '{
    "msg_id": "1028442084794698104",
    "to": "user2",
    "from": "user1",
    "chat_type": "chat",
    "force": true,
    "recallMessageExtensionInfo": "{\"type\": \"chat\"}"
}'
```

##### 响应示例

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

#### 错误码

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

## 批量撤回消息

你一次可撤回多条消息，每次可同时撤回单聊、聊天室或群组聊天的多条消息。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/messages/batch_recall
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数    | 类型   | 是否必需 | 描述        |
| :---------- | :----- | :------- | :------------------ |
| `msgs`    | JSON Array | 是       | 要撤回的消息的详情。单次请求最多可撤回 30 条消息。 |
| - `msg_id`    | String | 是       | 要撤回消息的消息 ID。|
| - `to`        | String | 是       | 要撤回消息的接收方。<br/> - 单聊为接收方的用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。<br/> 若不传入该参数，请求失败。        |
| - `from`      | String | 否       | 消息撤回方的用户 ID。若不传该参数，默认为 `admin`。    |
| - `chat_type` | String | 是       | 要撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊 ；<br/> - `chatroom`：聊天室 。  |
| - `sync_device`| Bool | 否       | 是否支持单聊消息撤回同步给消息发送方的所有在线设备：<br/> - (默认) `true`：是； <br/> - `false`：否。<Container type="tip" title="提示">当参数 `force` 设置为 `true` 且消息已过期，此时若要将消息撤回同步发送方，则需将 `from` 参数设置为消息发送方。</Container>|
| - `force`     | Bool   | 否       | 是否支持强制撤回消息。<br/> - `true`：是。这种情况下，无论消息是否过期，你都可以撤回。若需撤回已过期的消息，`force` 须设置为 `true`。 <br/> - `false`：否。这种情况下，你只能在撤回时长内撤销服务端存在的消息。  |
| `recallMessageExtensionInfo`    | String | 否       | 消息撤回相关的扩展信息。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体的 `data` 中包含以下字段：

| 参数       | 类型   | 描述             |
| :--------- | :----- | :-------------------------- |
| `msg_id`   | String | 需要撤回的消息 ID。      |
| `recalled` | String | 消息撤回结果，成功是 `yes`。      |
| `from`     | String | 消息撤回方的用户 ID。    |
| `to`       | String | 撤回消息的送达方。<br/> - 单聊为送达方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。 |
| `chattype` | String | 撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。     |

其他参数及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST --location "https://XXXX/XXXX/XXXX/messages/batch_recall" \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-d '{
  "msgs": [
   {
    "msg_id": "7126XXXX2581", 
    "to": "d95XXXX81c64",      
    "from": "18XXXXebf262",   
    "chat_type": "chatroom",
    "force": false,
    "sync_device": false
    },
    {
    "msg_id": "10436XXXX4564398104",
    "to": "d9571XXXXc64",
    "from": "18e4XXXXf262",
    "chat_type": "chat",
    "force": false,
    "sync_device": false
    }
  ]
}'
```

##### 响应示例

```json
{
  "path": "/messages/batch_recall",
  "uri": "https://XXXX/XXXX/XXXX/messages/batch_recall",
  "timestamp": 1657529588473,
  "organization": "XXXX",
  "application": "09ebbf8b-XXXX-XXXX-XXXX-d47c3b38e434",
  "action": "post",
  "data": [
    {
      "recalled": "yes",
      "chattype": "chat",
      "from": "XXXX",
      "to": "XXXX",
      "msg_id": "1028442XXXX94698104"
    },
    {
      "recalled": "yes",
      "chattype": "chat",
      "from": "XXXX",
      "to": "XXXX",
      "msg_id": "104367XXXX564398104"
    }
  ], 
  "duration": 8,
  "applicationName": "XXXX"
}
```

#### 错误码

详见[撤回单条消息](#错误码)。