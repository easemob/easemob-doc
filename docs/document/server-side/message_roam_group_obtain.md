# 获取群聊漫游消息

## 功能说明

通过该接口，你可以从环信服务器分页获取指定用户在某个群组中可见的漫游消息。

接口采用游标分页方式，每次返回一页消息，可使用返回的游标继续查询下一页，直至查询完成。支持按指定时间范围查询，并选择从新到旧或从旧到新的查询方向。

**查询结果包括该用户发送的群消息，以及其他群成员发送且对该用户可见的消息。** 实际返回范围受以下条件限制：

- [**消息保存期限**](/product/pricing_policy.html#扩展服务费用)：仅返回仍在服务端保存期限内的漫游消息。
- [**消息删除**](message_delete_roam_group_room_msgid.html) **与** [**清空**](message_delete_roam_user.html)：对该用户已单向删除或清空的漫游消息，不会返回。
- **入群前历史消息的查询限制**：能否查询入群前的历史消息取决于应用配置。若不允许查询，则仅返回本次入群后的消息；若允许查询，则可返回入群前仍保存在服务端、且对该用户可见的消息。
- **定向消息可见性**：对于群定向消息，仅返回该用户发送的消息，或该用户作为定向接收者收到的消息。

如果需要按小时下载应用的历史消息记录文件，详见 [获取历史消息记录](message_historical.html)。

如果需要获取单聊会话中的历史消息，详见 [获取单聊漫游消息](message_roam_single_obtain.html)。

## 功能开通

调用该接口前，应用需要已开通消息漫游功能。

## 调用频率上限

默认 100 次/秒/App Key，支持上调。

## 请求 URL

```http
POST https://{host}/api/server/v6/{org_name}/{app_name}/roaming/group
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

### 获取第一页消息

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/api/server/v6/XXXX/XXXX/roaming/group' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "username": "alice",
    "groupId": "321582707834881",
    "limit": 20,
    "order": "down"
}'
```

### 按时间范围分页获取消息

首次请求时，设置 `startTimestamp` 和 `endTimestamp`，省略 `cursor`。若响应表示还有下一页，后续请求示例如下：

```bash
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
# 将 <上一页返回的游标> 替换为上一页响应中的 data.pagination.cursor
curl -X POST 'https://XXXX/api/server/v6/XXXX/XXXX/roaming/group' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "username": "alice",
    "groupId": "321582707834881",
    "limit": 20,
    "order": "down",
    "cursor": "<上一页返回的游标>",
    "startTimestamp": 1700000000000,
    "endTimestamp": 1700003600000
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求 body 为 JSON 对象。

| 参数             | 类型   | 是否必需 | 描述                                                         |
| ---------------- | ------ | -------- | ------------------------------------------------------------ |
| `username`       | String | 是       | 要查询其漫游消息的用户 ID。该用户用于确定消息可见范围，不表示只查询该用户发送的消息。 |
| `groupId`        | String | 是       | 要获取历史消息的群组 ID。                                    |
| `limit`          | Number | 是       | 每页获取的消息数量，以十进制整数字符串传入，例如 `20`。取值范围为 1–20。 |
| `order`          | String | 否       | 查询方向，请使用小写值：<br/> - `up`：从旧到新查询，先取较早的消息。<br/> - （默认）`down`：从新到旧查询，先取较新的消息。 |
| `cursor`         | String | 否       | 分页游标。首次请求时不传入，后续请求使用上一次响应返回的游标。具体用法详见 [分页获取](#分页获取)。 |
| `startTimestamp` | Number | 否       | 查询的起始时间，以十进制整数字符串表示 Unix 时间戳，单位为毫秒。仅返回该时间点之后的消息，不包含该时间点。不传入时，不额外设置起始时间条件。 |
| `endTimestamp`   | Number | 否       | 查询的结束时间，以十进制整数字符串表示 Unix 时间戳，单位为毫秒。仅返回该时间点之前的消息，不包含该时间点。不传入时，不额外设置结束时间条件。 |

使用参数时，请注意：

- 必须传入 `limit`，省略该参数会导致请求失败。
- 同时传入 `startTimestamp` 和 `endTimestamp` 时，应确保 `startTimestamp` 小于 `endTimestamp`。
- 不使用的可选参数请直接省略，不要设置为空字符串或 `null`。

#### 分页获取

1. 首次请求时，不传入 `cursor`，并设置每页获取数量 `limit`。如需限定时间范围或查询方向，同时设置相应参数。
2. 读取响应中的 `data.pagination.finished`。若为 `false`，将 `data.pagination.cursor` 原样传入下一次请求的 `cursor`，继续查询下一页。
3. 翻页时，保持请求 URL、`username`、`groupId`、`order`、`startTimestamp` 和 `endTimestamp` 不变。
4. 当 `data.pagination.finished` 为 `true` 时，结束本次查询。

请原样使用服务端返回的游标，不要自行构造或解析。是否还有下一页应以 `data.pagination.finished` 为准，不要仅根据 `data.list` 的长度判断。

#### 未指定时间范围时的查询行为

在传入必填参数的基础上，若设置 `"limit": 20`，但不设置 `cursor`、`startTimestamp` 和 `endTimestamp`，则从第一页开始查询，且不额外限定查询时间范围。查询结果取决于 `order` 的设置：

- 若不设置 `order`，默认使用 `down`，查询当前群组中对指定用户可见的 **最多 20 条最新漫游消息**。
- 若设置 `"order": "up"`，则查询可见范围内 **最早的最多 20 条漫游消息**。

查询范围仍受消息保存期限、用户删除或清空记录，以及是否在群中和定向消息可见性等条件限制。

## 响应示例

以下以文本消息为例，展示响应中的消息列表和分页信息。

- 查询成功，且还有下一页：

```json
{
    "data": {
        "list": [
            {
                "msg_id": "1234567890123456789",
                "timestamp": 1700001800000,
                "chat_type": "groupchat",
                "payload": {
                    "from": "alice",
                    "to": "321582707834881",
                    "bodies": [
                        {
                            "type": "txt",
                            "msg": "Hello"
                        }
                    ],
                    "ext": {
                        "businessId": "example"
                    }
                }
            }
        ],
        "pagination": {
            "finished": false,
            "cursor": "1234567890123456789"
        }
    }
}
```

- 没有符合条件的消息：

```json
{
    "data": {
        "list": [],
        "pagination": {
            "finished": true,
            "cursor": null
        }
    }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应中的消息列表和分页信息包含以下字段：

| 字段 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data` | JSON | 本次查询返回的数据。 |
| `data.list` | Array | 本页的消息列表。 |
| `data.pagination` | JSON | 分页信息。 |
| `data.pagination.finished` | Boolean | 是否已完成查询：<br/> - `true`：没有下一页；<br/> - `false`：需要继续拉取下一页。 |
| `data.pagination.cursor` | String | 查询下一页所需的游标。查询完成时，代码设置为 `null`；调用方无需继续使用该字段。 |
| `data.list[].msg_id` | String | 消息 ID。 |
| `data.list[].timestamp` | Number | 消息时间戳，单位为毫秒。 |
| `data.list[].chat_type` | String | 会话类型：`chat` 表示单聊，`groupchat` 表示群聊。 |
| `data.list[].from` | String | 消息的内部路由信息，开发者可忽略。业务侧获取发送方时，请使用 `payload.from`。 |
| `data.list[].to` | String | 消息的内部路由信息，开发者可忽略。业务侧获取接收方时，请使用 `payload.to`。 |
| `data.list[].meta_ext` | JSON | 消息的元扩展信息。 |
| `data.list[].payload` | JSON | 消息的具体内容。 |
| `data.list[].payload.from` | String | 消息发送方的用户 ID。 |
| `data.list[].payload.to` | String | 消息接收方 ID。单聊中为接收方用户 ID，群聊中为群组 ID。 |
| `data.list[].payload.bodies` | Array | 消息体列表。不同消息类型的消息体字段不同。 |
| `data.list[].payload.bodies[].type` | String | 消息类型。例如，`txt` 表示文本消息。 |
| `data.list[].payload.bodies[].msg` | String | 文本消息的内容，仅适用于文本消息。 |
| `data.list[].payload.ext` | JSON | 发送消息时设置的自定义扩展信息。 |
| `data.list[].payload.type` | String | 消息的目标类型标识。 |
| `data.list[].payload.meta` | JSON | 消息的元数据。|

各类消息的 `payload.bodies` 结构可参考 [历史消息记录的内容](message_historical.html#历史消息记录的内容)。

若没有查到符合条件的消息，消息列表为空，分页信息表示查询完成。即使某一页的消息列表为空，调用方也应读取分页信息后决定是否继续请求。

如果返回的 HTTP 状态码非 `200`，表示请求失败。

### 错误码

响应体中的 `error` 为对象时，读取 `error.code` 和 `error.message`。为字符串时，`error` 表示错误类型，`error_description` 提供具体原因。

```json
{
    "meta": {
        "requestId": "17945493481988702",
        "timestamp": 1794549348260
    },
    "error": {
        "code": 4000005,
        "message": "请求体格式错误或缺少必需参数"
    }
}
```

| HTTP 状态码 | 错误码或错误类型 | 错误提示 | 可能原因 | 处理建议 |
| --- | --- | --- | --- | --- |
| 400 | `4000005` | 请求体格式错误或缺少必需参数 | 缺少 `username` 或 `groupId`，或者 `order`、`limit` 或时间戳的格式不符合要求。 | 检查必填字段，将 `order` 设为 `up` 或 `down`，并检查数字参数。 |
| 401 | `4010103` | 权限验证失败 | 调用身份不具备请求路径所指定应用的管理权限。 | 核对请求路径中的组织和应用，使用具备对应权限的 App Token。 |
| 403 | `4030201` | 功能未开通 | 当前应用未开通消息漫游功能。 | 联系环信商务确认开通。 |
| 500 | `Internal Server Error` | 具体原因见 `error_description`。 | 服务端处理请求时发生未被单独处理的异常。 | 稍后重试。若持续失败，请联系环信技术支持。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
