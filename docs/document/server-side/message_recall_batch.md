# 批量撤回消息

## 功能说明

- 一次可以撤回发送成功的多条消息，包括客户端发送的消息以及通过 RESTful API 发送的消息。**每次最多可撤回 30 条消息。** 
- 调用该 API 后，服务端的消息（历史消息，离线消息或漫游消息）以及消息发送方和接收方的内存和数据库中的消息均会撤销。
- 对于附件类型消息，包括图片、音频和视频和文件消息，撤回消息后，消息附件也相应删除。
- 撤回消息前，需要通过调用 [获取历史消息记录 API](https://doc.easemob.com/document/server-side/message_historical.html) 或 [消息回调](https://doc.easemob.com/document/server-side/callback_overview.html) 获取要撤回的消息 ID。
- 支持设置是否将单聊消息撤回同步给消息发送方的所有在线设备（`sync_device` 参数）。
- 撤回消息会触发发送后回调，请参见 [回调事件文档](https://doc.easemob.com/document/server-side/callback_message_recall.html)。
- 如果发送消息或撤回消息时单聊/群聊/聊天室的接收方离线，在上线时可感知到消息撤回，原因是服务器有事件通知给客户端 SDK。

#### 设置撤回时长

默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在 [环信控制台](https://console.easemob.com/user/login)的 **功能配置** > **基础功能** > **消息** 页面设置消息撤回时长，该时长不超过 7 天。

#### 强制撤回

支持强制撤回消息，即撤回已过期的消息。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/messages/batch_recall
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

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

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数    | 类型   | 是否必需 | 描述        |
| :---------- | :----- | :------- | :------------------ |
| `msgs`    | JSON Array | 是       | 要撤回的消息的详情。单次请求最多可撤回 30 条消息。 |
| - `msg_id`    | String | 是       | 要撤回消息的消息 ID。|
| - `to`        | String | 是       | 要撤回消息的接收方。<br/> - 单聊为接收方的用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。<br/> 若不传入该参数，请求失败。        |
| - `from`      | String | 否       | 消息撤回方的用户 ID。若不传该参数，默认为 `admin`。    |
| - `chat_type` | String | 是       | 要撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊 ；<br/> - `chatroom`：聊天室 。  |
| - `sync_device`| Bool | 否       | 是否支持单聊消息撤回同步给消息发送方的所有在线设备：<br/> - (默认) `true`：是； <br/> - `false`：否。<Container type="tip" title="提示">当参数 `force` 设置为 `true` 且消息已过期，此时若要将消息撤回同步发送方，则需将 `from` 参数设置为消息发送方。</Container>|
| - `force`     | Bool   | 是       | 是否支持强制撤回消息。<br/> - `true`：是。这种情况下，无论消息是否过期，你都可以撤回。若需撤回已过期的消息，`force` 须设置为 `true`。 <br/> - `false`：否。这种情况下，你只能在撤回时长内撤销服务端存在的消息。  |
| `recallMessageExtensionInfo`    | String | 否       | 消息撤回相关的扩展信息。 |

## 响应示例

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

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体的 `data` 中包含以下字段：

| 参数       | 类型   | 描述             |
| :--------- | :----- | :-------------------------- |
| `msg_id`   | String | 需要撤回的消息 ID。      |
| `recalled` | String | 消息撤回结果，成功是 `yes`。      |
| `from`     | String | 消息撤回方的用户 ID。    |
| `to`       | String | 撤回消息的送达方。<br/> - 单聊为送达方用户 ID；<br/> - 群聊为群组 ID；<br/> - 聊天室聊天为聊天室 ID。 |
| `chattype` | String | 撤回消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊；<br/> - `chatroom`：聊天室。     |

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 错误码

详见[撤回单条消息](message_recall_single.html#错误码)。