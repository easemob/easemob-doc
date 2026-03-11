# 发送单聊流式消息

## 功能说明

即时通讯 IM 支持在单聊和群组聊天时发送流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制。它将长文本或复杂内容拆分为连续的数据片段，以低延迟、分批次的方式实时推送给接收方，无需等待整个内容完全生成即可开始传输。

目前，即时通讯 IM 仅在 **单聊和群组聊天** 中支持 **文本类型的流式消息**，不支持 **聊天室**。流式消息的典型应用场景如下：

- **AI 对话**：大语言模型（LLM）生成较长回复时，可逐段输出与展示，避免用户长时间等待，确保提供更流畅的交互体验。
- **协同编辑与实时分享**：在内容尚未完全构思完成时，即可逐步分享思路或文稿。

流式消息 **仅支持通过服务端 API 下发**，SDK 负责接收，但不提供发送能力。

## 使用限制

发送 **一条流式消息** 时，必须遵守以下规则：

- **发送间隔**：相邻分片的发送间隔不能超过 30 秒，超时则返回错误 14033 并终止流式消息。
- **发送时长**：所有分片的发送总时长不能超过 30 分钟，超时再发送分片则返回错误 14034。
- **总长度**：所有分片的文本内容总长度不能超过 128 KB，超限则返回错误 14032 并终止流式消息。
- **终止后**：流式消息一旦被终止，其后续的所有分片发送请求都将被拒绝。

## 发送与接收流程

![img](/images/server-side/message_stream_flowchart.png)

## 调用发送单聊消息 API

### 调用频率上限

100 条/秒/App Key

### 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/stream_message/user
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

例如，一条流式消息包含三个消息分片，各分片的请求示例如下。

若发送的是单片流式消息（即整个消息只有一个分片），则需将 `finish` 参数设为 `true` 以表示传输结束；如有必要，可同时传入 `finishReason`。

- 发送首个消息分片：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

```bash
curl -X POST -i 'http://XXXX/XXXX/XXXX/stream_message/user' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "from": "111",
    "to": "222",
    "body": {
        "msg": "第一个分片",
        "seq": 0,
        "type": "markdown"
    },
    "ext": {
    }
}'
```

- 发送第二个消息分片：

```bash
curl -X POST -i 'http://XXXX/XXXX/XXXX/stream_message/user' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "from": "111",
    "to": "222",
    "body": {
        "msgId": "1499696395467098072",
        "msg": "第二个分片",
        "seq": 1,
        "finish": false,
        "finishReason": 0,
        "type": "markdown"
    }
}'
```

- 发送最后一个消息分片：
  
```bash
curl -X POST -i 'http://XXXX/XXXX/XXXX/stream_message/user' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "from": "111",
    "to": "222",
    "body": {
        "msgId": "1499696395467098072",
        "msg": "第三个分片",
        "seq": 2,
        "finish": true,
        "finishReason": 1,
        "type": "markdown"
    }
}'
```

### 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

### 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :----------------- | :-------------------- |
| `from` | String | 是   | 消息发送方的用户 ID。默认为 `admin`。<Container type="tip" title="提示"><br/>- 服务器不会校验该用户 ID 是否存在。即使传入不存在的 ID，消息仍会正常下发。<br/>- 服务器不会检查接收方是否已将发送方加入黑名单，也不会校验发送方是否被禁言。<br/>- 若传入空字符串 ("")，请求将失败。</Container> |
| `to`   | String | 是   | 消息接收方的用户 ID。<br/><Container type="tip" title="提示">服务器不会校验该用户 ID 是否存在。即使传入不存在的 ID，消息仍会正常下发。</Container> |
| `body` | JSON   | 是   | 消息内容。字段说明请见下方 `body` 参数详情。                        |
| `ext`  | JSON   | 否   | 消息扩展字段，可用于传递自定义数据。不允许为 `null`。服务端会以 **首个分片** 的 `ext` 为准，后续分片的该字段会被透传。|

请求体中的 `body` 字段说明详见下表。

| 参数           | 类型    | 是否必需 | 描述                                                         |
| :------------- | :------ | :------- | :----------------------------------------------------------- |
| `msgId`        | String  | 是       | 消息 ID。首次发起流式消息时本字段为空，后续分片需传入首次 API 调用返回的 `msgId`。<br/>该 ID 对应完整的流式消息，其下的各个分片通过 `seq` 字段编号区分。 |
| `msg`          | String  | 是       | 当前分片的文本内容。整条流式消息的总长度不得超过 128 KB。    |
| `seq`          | Int | 是       | 分片序号。流式消息按序拆分为多个分片发送，首个分片序号为 `0`，后续依次递增，用于将分片合并为原消息。 |
| `finish`       | Bool    | 否       | 标识当前分片是否为最后一个。<br/> - （默认）`false`：否<br/> - `true`：是 <br/>发送最后一个分片时需设为 `true`。若消息结束后仍对同一 `msgId` 发送新分片，将返回错误码 14035。 |
| `finishReason` | Int | 否       | 自定义结束原因码，仅当 `finish` 为 `true` 时生效。可用于标识消息正常结束、被中止等场景。 |
| `type`         | String  | 否       | 文本格式类型，仅首个分片需传入。<br/> - （默认）`text`：纯文本 <br/> - `markdown`：Markdown 格式 |

### 响应示例

```json
{
    "path": "/stream_message/users",
    "uri": "https://XXXX/XXXX/XXXX/stream_message/users",
    "timestamp": 1766740077265,
    "organization": "113230417254974",
    "application": "dd7f0328-5f3e-XXXX-XXXX-2e0434c5931b",
    "action": "post",
    "data":
    {
        "msgId": "1499696395467098072"
    },
    "duration": 74,
    "applicationName": "moderation"
}
```

```json
{
    "error": "message_send_error",
    "exception": "MessageSendException",
    "timestamp": 1766737700561,
    "duration": 1,
    "error_code": 14035,
    "error_description": "stream message has already finished"
}
```

### 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `data`  | JSON | 响应内容。 |
| `data.msgId`  | String | 流式消息的唯一 ID。**仅在首次分片请求的响应中返回**，后续分片请求需携带此 `msgId`。 |

响应体中的其他参数说明如下表所示：

| 字段              | 类型   | 描述                                                         |
| :---------------- | :----- | :----------------------------------------------------------- |
| `path`            | String | 请求路径，为请求 URL 的一部分，开发者无需关注。 |
| `uri`             | String | 请求 URL。                                             |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                      |
| `organization`    | String | 组织唯一标识，与请求参数 `org_name` 一致，由环信分配给每个组织。 |
| `application`     | String | 应用在环信系统中的唯一标识，由系统自动生成，开发者无需处理。 |
| `action`          | String | 请求对应的 HTTP 方法。                                       |
| `duration`        | Int    | 请求从发起到响应的总耗时，单位为毫秒。                         |
| `applicationName` | String | 应用名称，即环信控制台中创建应用时填写的名称，与请求参数 `app_name` 一致。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](#错误码) 了解可能的原因。

### 错误码

| HTTP 状态码 | 错误提示                                  | 说明                                                         |
| :---------- | :---------------------------------------- | :----------------------------------------------------------- |
| 14001       | param from can't be empty                 | `from` 为必填参数，不能为空。                                |
| 14002       | param to can't be empty                   | `to` 为必填参数，不能为空。                                  |
| 14005       | param body can't be empty                 | `body` 为必填参数，不能为空。                                |
| 14030       | param body.seq is illegal                 | `body.seq` 参数无效。若未传入或传入值小于 `0`，会触发此错误。  |
| 14031       | can not find stream message by msgId      | 未找到与传入的 `msgId` 对应的流式消息。例如，在发送第二个分片时传入了错误或已不存在的 `msgId`。 |
| 14032       | stream message total length exceeds limit | 流式消息的总长度超过 128 KB 限制。                           |
| 14033       | stream message chunk interval timeout     | 相邻两个分片的发送间隔超过 30 秒。                           |
| 14034       | stream message total timeout              | 整条流式消息的发送总时长超过 30 分钟。                       |
| 14035       | stream message has already finished       | 流式消息已完成传输。当 `finish` 已设为 `true` 后，若再尝试对同一消息发送分片，会触发此错误。 |
| 14036       | stream message from user mismatch         | 当前请求的 `from` 值与首个分片中传入的值不一致。             |
| 14037       | stream message to user mismatch           | 当前请求的 `to` 值与首个分片中传入的值不一致。               |
| 14038       | stream message chunk seq too small        | 当前分片的 `seq` 值必须大于上一个分片的 `seq`。分片序号需连续递增。 |

## 其他消息功能

流式消息支持的消息功能如下表所示：
 
| 功能             | 是否支持                          |
| :--------------- | :-------------------------------- |
| [发送消息](/document/server-side/message_single.html)         | 是（仅支持通过 RESTful API 发送） |
| [消息漫游](/document/android/message_retrieve.html#从服务器获取指定会话的消息)         | 是                                |
| [消息扩展](/document/android/message_extension.html)         | 是                                |
| [定向发送](/document/android/message_target.html)         | 否                                |
| [消息已读回执](/document/android/message_receipt.html)     | 否                                |
| 消息输入状态 | 否                                |
| [消息回复（Reaction）](/document/android/reaction.html)         | 是                                |
| [消息置顶](/document/android/message_pin.html)         | 是                                |
| [消息撤回](/document/android/message_recall.html)         | 是                                |
| [消息单向删除](/document/android/message_delete.html#单向删除服务端的历史消息)     | 是                                |
| [消息修改](/document/android/message_modify.html)         | 是                                |
| [消息搜索](/document/android/message_search.html)         | 是                                |
| [会话未读数](/document/android/conversation_unread.html)       | 是                                |
| 会话最后一条消息 | 是                                |
| [离线推送](/document/server-side/push_settings_set.html)     | 是                                |
| [内容审核](/value-added/moderation/moderation_overview.html)     | 否                                |
| [消息翻译](/value-added/translation/message_translation_android.html)         | 是                                |
| [发送前回调](/document/server-side/callback_presending.html)         | 否                               |
| [发送后回调](/document/server-side/callback_postsending.html)         | 否      |
| 消息发送成功后在发送方多客户端同步        |   否  |
| [发送方和接收方的本地数据库存储](limitation.html#消息存储)         | 
