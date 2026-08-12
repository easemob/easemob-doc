# 发送群组流式消息

## 功能说明

即时通讯 IM 支持在单聊和群组聊天中接收流式消息。流式消息是一种边生成、边发送、边接收的实时消息传输机制，适用于长文本逐段输出的场景，例如 AI 对话、实时协作写作和分段生成内容展示等。

流式消息由业务服务端生成并通过 RESTful API 发送，[SDK 负责接收、排序、合并和回调](/document/android/message_stream_receive.html)，不提供客户端主动发送流式消息的能力。

## 核心概念

在阅读下文前，你可以先了解以下核心概念：

- **流式消息**：将一条完整消息拆分为多个分片，并按顺序逐步发送和接收的消息传输方式。
- **消息分片**：流式消息中的单个数据片段。多个分片按顺序组合后构成一条完整消息。
- **`msgId`**：消息 ID。整条流式消息的唯一标识。
- **seq**：消息分片标识。流式消息按序拆分为多个分片发送，首个分片序号为 `0`，后续依次递增，用于将分片合并为原消息。
- **finish**：标识当前分片是否为最后一个。

## 支持范围与限制

- 会话类型：仅支持单聊和群聊，不支持聊天室。
- 消息类型：仅支持文本类型的流式消息。
- 发送方式：仅支持通过 [服务端 RESTful API](/document/server-side/message_stream_send_single.html) 发送。
- 客户端能力：[SDK 仅支持接收](/document/android/message_stream_receive.html)，不支持发送。
- 消息标识：`msgId` 标识整条流式消息。
- 消息限制：发送一条流式消息的限制如下：
  - **分片发送间隔**：相邻分片的发送间隔不能超过 30 秒，超时则返回 [错误 14033](#错误码) 并终止流式消息。
  - **总传输时长**：所有分片的总传输时长不能超过 30 分钟，超时再发送分片则返回 [错误 14034](#错误码)。
  - **总长度**：所有分片的文本内容总长度不能超过 128 KB，超限则返回 [错误 14032](#错误码) 并终止流式消息。
  - **终止后**：流式消息一旦被终止，其后续的所有分片发送请求都将被拒绝。

## 发送与接收流程

![img](/images/server-side/message_stream_flowchart.png)

## 调用发送群聊流式消息 API

### 调用频率上限

100 条/秒/App Key

### 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/stream_message/chatgroup
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

例如，一条流式消息包含两个消息分片，各分片的请求示例如下。

- 发送首个消息分片：

当发送单片流式消息（即整个消息仅由一个分片组成）时，需传入 `finish` 参数设为 `true`，以表示本次传输结束。如有需要，还可同时传入 `finishReason` 参数，用于说明传输结束的原因。

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L 'https://XXXX/XXXX/XXXX/stream_message/chatgroup' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "from": "222",
    "to": "301018534445057",
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
curl -L 'https://XXXX/XXXX/XXXX/stream_message/chatgroup' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "from": "222",
    "to": "301018534445057",
    "body": {
        "msgId": "1499712384170721280",
        "msg": "第二个分片，finish。",
        "seq": 1,
        "finish": true,
        "finishReason": 0,
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
| `to`   | String | 是 | 消息接收方所属群组的 ID。<br/><Container type="tip" title="提示"><br/> - 只能传入一个群组 ID，且该群组的成员数量不得超过 200 人。<br/> - 服务器不会校验群组 ID 是否存在。即使传入的群组 ID 不存在，消息仍会正常发送，不会收到错误提示。</Container> |
| `body` | JSON   | 是                     | 消息内容。字段说明请见下方 `body` 参数详情。  |
| `ext`  | JSON   | 否                     | 消息扩展字段，可用于传递自定义数据。不允许为 `null`。服务端会以 **首个分片** 的 `ext` 为准，后续分片的该字段会被透传。 |

请求体中的 `body` 字段说明详见下表。

|  参数            | 类型       |是否必须     | 描述                                                              |
| ------------ | ------- | ---- | ------------------------------------------------------------ |
| `seq`          | Int | 是   | 分片序号。流式消息按序拆分为多个分片发送，首个分片序号为 `0`，后续依次递增，用于将分片合并为原消息。 |
| `type`         | String  | 否   | 文本格式类型，仅首个分片需传入。<br/> - （默认）`text`：纯文本 <br/> - `markdown`：Markdown 格式          |
| `finish`       | Bool    | 否   | 标识当前分片是否为最后一个。<br/> - （默认）`false`：否<br/> - `true`：是 <br/>发送最后一个分片时需设为 `true`。若消息结束后仍对同一 `msgId` 发送新分片，将返回错误码 14035。  |
| `msgId`        | String  | 是   | 消息 ID。<br/>该 ID 对应完整的流式消息，其下的各个分片通过 `seq` 字段编号区分。<br/>**首片不传，后续分片必传**：首次发起流式消息时本字段为空，后续分片需传入首次 API 调用返回的 `msgId`。 |
| `msg`          | String  | 是   | 消息内容。                                                   |
| `finishReason` | Int | 否   | 自定义结束原因码，仅当 `finish` 为 `true` 时生效。可用于标识消息正常结束、被中止等场景。|

### 响应示例

```json
{
    "path": "/stream_message/chatgroup",
    "uri": "https://a1-qa-hsb.agora.com/113230417254974/moderation/stream_message/chatgroup",
    "timestamp": 1766743799730,
    "organization": "113230417254974",
    "application": "dd7f0328-5f3e-448d-9674-2e0434c5931b",
    "action": "post",
    "data":
    {
        "msgId": "1499712384170721280"
    },
    "duration": 0,
    "applicationName": "moderation"
}
```

### 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `data`  | JSON | 响应内容。 |
| `data.msgId`  | String | 流式消息的唯一 ID。**仅在首次分片请求的响应中返回**，后续分片请求需携带此 `msgId`。 |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
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
| 14037       | stream message to mismatch                | 当前请求的 `to` 值与首个分片中传入的值不一致。               |
| 14038       | stream message chunk seq too small        | 当前分片的 `seq` 值必须大于上一个分片的 `seq`。分片序号需连续递增。 |

## 消息功能支持

流式消息支持的消息功能如下表所示：
 
| 功能             | 是否支持                          |
| :--------------- | :-------------------------------- |
| [发送消息](/document/server-side/message_stream_send_single.html)         | 是（仅支持通过 RESTful API 发送） |
| [消息漫游（客户端）](/document/android/message_retrieve.html#从服务器获取指定会话的消息)         | 是                                |
| [消息扩展](message_stream_send_single.html#请求示例)         | 是                                |
| [定向发送](/document/android/message_target.html)         | 否                                |
| [消息已读回执（客户端）](/document/android/message_receipt.html)     | 否                                |
| 消息输入状态 | 否                                |
| [消息回复（Reaction）](reaction_add.html)         | 是                                |
| [消息置顶（客户端）](/document/android/message_pin.html)         | 是                                |
| [消息撤回](message_recall_single.html)         | 是                                |
| [消息单向删除](message_delete_roam_single_msgid.html)     | 是                                |
| [消息编辑](message_modify.html)         | 是                                |
| [消息搜索（客户端）](/document/android/message_search_local.html)         | 是                                |
| [会话未读数（客户端）](/document/android/conversation_unread.html)       | 是                                |
| 会话最后一条消息 | 是                                |
| [离线推送](/document/server-side/push_settings_set.html)     | 是                                |
| [内容审核](/value-added/moderation/moderation_overview.html)     | 否                                |
| [消息翻译](message_translation_text.html)         | 是                                |
| [发送前回调](/document/server-side/callback_presending.html)         | 否                               |
| [发送后回调](/document/server-side/callback_postsending.html)         | 否      |
| 消息发送成功后在发送方多客户端同步        |   否  |
| [发送方和接收方的本地数据库存储](/product/limitation.html#消息存储)         | 是 |




