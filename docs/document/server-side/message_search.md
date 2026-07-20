# 搜索消息

## 功能说明

该接口支持根据关键词搜索服务端历史消息。

搜索条件与内容如下表所示：

| 搜索维度     | 支持能力                                                     |
| :----------- | :----------------------------------------------------------- |
| 关键词   | 支持使用一个或多个关键词搜索历史消息，并可设置匹配 **任一关键词** 或 **匹配全部关键词**。 |
| 会话范围 | 支持搜索全部会话，也可指定单聊、群聊或聊天室会话。**限制**：仅限搜索 **当前用户已参与** 的会话。单聊需传对方用户 ID；群聊/聊天室需传对应 ID，且 **通过成员校验** 后才返回结果。 |
| 消息类型 | 支持搜索：文本、图片、视频、位置、文件、合并消息。**不支持**：自定义消息、语音消息和透传消息。 |
| 时间范围 | 支持按消息发送时间范围筛选。**注意**：开始时间和结束时间必须同时设置（缺一不可）。 |
| 搜索内容 | 支持 **仅搜索消息内容**、**仅搜索消息扩展字段（`ext`）**，或 **同时搜索两者**。消息内容指 **原始文本消息内容** 及 **自动翻译后的文本内容**。<br/>开通消息搜索后，消息扩展字段搜索默认不开启。如需使用该功能，需联系环信商务单独开通。|

搜索结果如下表所示：

| 项         | 说明                                                    |
| :--------------- | :----------------------------------------------------------- |
| 排序与分页   | 搜索结果支持按 **相关性** 或 **发送时间** 排序，并支持 **分页加载** 与搜索关键词的 **高亮显示**。 |
| 删除消息处理 | 如果当前用户已 **单方删除** 某条消息，则该消息 **不会** 出现在搜索结果中。若对方单方删除不影响当前用户的搜索结果。 |

## 功能开通

要使用消息搜索功能，你需要 **联系环信商务开通**。开通后，系统会为你的应用创建搜索索引资源并开始同步消息数据。

**关于扩展字段搜索**： 开通消息搜索服务后，消息扩展字段（`ext`）搜索默认不开启。如需使用该功能，可在开通时一并说明，或后续联系商务单独开通。

:::tip
目前，仅国内二区集群支持该功能。
:::

## 调用频率上限

该接口的调用频率上限为 **100 次/秒/App Key**。超过限制时，接口返回 HTTP 状态码 `429`。如需提升频率上限，请 **联系环信商务**。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/messages/search/get
```

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `username` | String | 是 | 发起搜索的用户 ID。搜索结果仅返回该用户参与会话中的消息。 |  

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

以下示例为搜索单个关键词 `hello`：

```shell
curl -X POST "https://XXXX/XXXX/XXXX/users/XXXX/messages/search/get" \
-H "Content-Type: application/json; charset=utf-8" \
-H "Authorization: Bearer <YourAppToken>" \
-H "X-Request-Id: <id>" \  
-d '{
  "data": {
    "keyword": "hello",
    "conversationType": "chat",
    "participantPairs": [
      {"userId1": "user01", "userId2": "user02"}
    ],
    "contentType": "text",
    "startTime": 1740787200000,
    "endTime": 1741305599000,
    "searchMode": "default",
    "searchExt": "none",
    "sort": "sentTime:desc",
    "page": 1,
    "size": 20,
    "highlightEnable": true,
    "highlightPreTags": "<em>",
    "highlightPostTags": "</em>"
  }
}'
```

以下示例为多关键词搜索：传入 `keywords` 并用 `keywordMatch` 控制关键词之间的组合方式：

```shell
curl -X POST "https://XXXX/XXXX/XXXX/users/XXXX/messages/search/get" \
-H "Content-Type: application/json; charset=utf-8" \
-H "Authorization: Bearer <YourAppToken>" \
-H "X-Request-Id: <id>" \
-d '{
  "data": {
    "keywords": ["项目会议", "预算"],
    "keywordMatch": "all",
    "conversationType": "groupchat",
    "groupIds": ["group01"],
    "searchMode": "default",
    "sort": "relevance:desc",
    "page": 1,
    "size": 20,
    "highlightEnable": true
  }
}'
```

上例中 `keywordMatch` 为 `all`，表示同时命中“项目会议”和“预算”的消息才会返回；改为 `any` 则命中任意一个关键词即可。

## 请求 header 参数

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json; charset=utf-8`。                          |
| `Authorization` | String | 是       | App 管理权限的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入该字段。关于如何获取动态密钥 app token，详见 [使用环信 App Token 鉴权](https://doc.easemob.com/document/server-side/easemob_app_token.html)。 |
| `Accept`        | String | 否       | 期望响应格式。请填 `application/json; charset=utf-8`。                         |
| `X-Request-Id` | String | 否 | 请求追踪 ID。若传入，服务端在响应中原样返回，便于问题排查。 |

## 请求 body 参数

所有搜索参数通过 JSON 请求体中的 `data` 对象传递。下表中的参数均为 `data` 对象内的字段。

:::tip
**长度单位说明**：本文中所有以“字符”为单位的长度限制，例如 `keyword`/`keywords`、各类用户 ID/会话 ID、高亮标签及 `highlightFragmentSize` 等，均以 Unicode 字符（码点）数量计数，而非字节数。例如，1 个中文、日文或韩文字符按 1 个字符计；在 UTF-8 编码下，此类字符通常占用 3 个字节。
:::

### 基础参数

| 参数 | 类型 | 是否必需 | 描述 |
| :--- | :--- | :--- | :--- |
| `keyword` | String | 与 `keywords` 须二选一 | 单关键词搜索。长度 1-120 个字符，不能为空或仅包含空格。支持中、日、韩、英混合搜索。 |
| `keywords` | Array | 与 `keyword` 须二选一 | 多关键词搜索，数组每个元素为一个关键词。最多 5 个（重复项去重后计数），每个关键词 1-120 个字符且不能为空或仅空格，去重后所有关键词的合计长度不超过 120 个字符。配合 `keywordMatch` 控制多个关键词之间的组合方式。 |
| `keywordMatch` | String | 否 | 多关键词的组合方式，仅在传入 `keywords` 时生效，默认为 `any`，表示命中任意一个关键词即可（OR）；`all` 表示必须同时命中所有关键词（AND）。 |

:::tip
若 `keyword` 与 `keywords` 两者同时传入，以 `keywords` 为准。
:::

### 过滤参数

| 参数               | 类型   | 是否必需 | 描述                                                          |
| :--- | :--- | :--- | :--- |
| `conversationType` | String | 否       | 会话类型。<br/> - `chat`：单聊<br/> - `groupchat`：群聊<br/> - `chatroom`：聊天室。<br/>支持传入多个值，多个值之间使用英文逗号分隔，按“或”关系匹配；未传时，系统将结合其他过滤条件自动推断。 |
| `participantPairs` | Array  | 否       | 单聊会话过滤条件。<br/>数组元素为对象，每个对象固定包含 `userId1` 和 `userId2` 两个字段，二者均为非空字符串，长度为 1-512 个字符，可相同（例如用户与自己建立的单聊会话）。<br/>每个对象表示一组单聊双方用户 ID，可传入多个对象以指定多个单聊会话。 |
| `groupIds`         | Array  | 否       | 群组 ID 列表，用于按群聊会话过滤。<br/>数组元素为非空字符串，长度为 1-512 个字符。支持传入多个群组 ID。 |
| `chatroomIds`      | Array  | 否       | 聊天室 ID 列表，用于按聊天室会话过滤。<br/>数组元素为非空字符串，长度为 1-512 个字符。支持传入多个聊天室 ID。 |
| `contentType`      | String | 否       | 消息类型：<br/> - `text`：文本<br/> - `image`：图片<br/> - `video`：视频<br/> - `file`：文件<br/> - `location`：位置<br/> - `combine`：合并消息<br/>支持传入多个值，多个值之间使用英文逗号分隔，按“或”关系匹配。 |
| `startTime`        | Long   | 否       | 查询起始时间，Unix 毫秒时间戳。<br/>需与 `endTime` 一并传入。     |
| `endTime`          | Long   | 否       | 查询结束时间，Unix 毫秒时间戳。<br/>需与 `startTime` 一并传入，且必须大于或等于 `startTime`。单次查询的时间范围最长为 90 天。 |

使用上述过滤参数时，请注意以下限制和规则：

**会话数量限制**：`participantPairs`、`groupIds` 和 `chatroomIds` 指定的会话总数不得超过 20，且每个数组内的元素数量也不得超过 20。

**搜索范围说明**：搜索结果仅限于发起用户 `username` 参与的会话，且该用户已单方删除的消息不会返回。
- **单聊**：仅返回发起用户作为发送方或接收方的消息；若同时指定 `participantPairs`，则每组用户对都必须包含发起用户，否则返回 `400`，错误码为 `4000005`。
- **群聊和聊天室**：仅在请求中指定 `groupIds` 或 `chatroomIds` 时生效；未指定时，不返回任何群聊或聊天室消息。服务端会逐一校验成员关系，非成员会话将被自动过滤且不报错；若全部会话均被过滤，且未同时指定 `participantPairs`，则返回成功响应但结果为空（`count` 为 `0`）。
- **加入时间限定**：对于可获取加入时间的群组或聊天室，仅返回该用户加入时间及之后发送的消息；若与 `startTime` 同时存在，以较晚者为准，`endTime` 不受影响。
- **定向消息**：群聊和聊天室中的定向消息仅对发送者及其指定接收者可见；若发起用户既不是发送者，也不在接收者列表中，则不会出现在结果中。
- **成员身份校验**：若校验失败，则请求失败，返回 `502`，错误码为 `5020801`。

### 排序与分页参数

搜索结果支持按 **相关性** 或 **发送时间** 排序，并支持 **分页加载**。

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `sort` | String | 否 | 排序规则：<br/> - （默认）`relevance:desc`：按相关性得分降序。<br/> - `sentTime:desc`：按发送时间降序，最新消息优先。<br/> - `sentTime:asc`：按发送时间升序，最早消息优先。 |
| `page` | Integer | 否 | 页码，从 `1` 开始，默认值为 `1`。 |
| `size` | Integer | 否 | 每页返回的消息条数，取值范围为 `1-100`，默认值为 `20`。 |

:::tip
**分页限制**：`page × size` 必须小于或等于 `10000`。超过该限制时，接口返回 `400`，错误码为 `4000005`。如需搜索更大范围的数据，建议缩小时间范围或进一步细化会话类型、会话范围及消息类型等过滤条件。
:::

### 高级搜索参数

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `searchMode` | String | 否 | 搜索模式：<br/> - （默认）`default`：分词匹配。<br/> - `exact`：精确匹配。<br/> - `phrase`：短语匹配。<br/> - `fuzzy`：模糊匹配。<br/>关于各类模式的说明，详见该表下方描述。 |
| `searchExt` | String | 否 | 扩展字段 `ext` 的搜索范围：<br/> - （默认）`none`：不搜索 `ext`。<br/> - `with`：同时搜索消息内容和 `ext`。<br/> - `only`：仅搜索 `ext`。<br/>默认不支持通过消息扩展字段 `ext` 进行搜索。如需该功能，请联系环信商务开通。关于扩展字段搜索与白名单的说明，详见该表下方描述。 |

**`searchMode` 各模式说明如下**：

- `default`：对关键词进行分词匹配，命中包含任一分词的消息，并按相关性得分排序。例如，关键词“项目会议”可能被拆分为“项目”和“会议”，包含任一分词的消息均可能被命中。
- `exact`：将关键词作为完整内容进行匹配，不进行分词扩展。例如，关键词“项目会议”仅匹配包含完整“项目会议”的消息，不会因仅包含“项目”或“会议”而命中。
- `phrase`：将关键词作为短语进行匹配，要求各词按原有顺序连续出现。例如，关键词“项目会议”可匹配“项目会议”，但不匹配“会议项目”。
- `fuzzy`：支持一定程度的拼写容错。例如，关键词“hello”可匹配“hallo”。

**扩展字段搜索与白名单**：

`searchExt` 仅控制是否搜索消息扩展字段 `ext`。`ext` 的可搜索字段由白名单决定，未纳入白名单的字段不参与搜索，仅随搜索结果返回。

- **默认白名单**：`ext` 默认不配置白名单，即不搜索任何 `ext` 字段。
- **扩展白名单**：如需支持 `ext` 字段参与搜索，**请联系环信商务** 增加对应的字段白名单配置。只有被加入白名单的字段，才会被纳入搜索范围。
- **生效范围**：白名单变更仅对配置生效后新写入或更新的消息生效。对于已存在的历史消息，即使其字段内容符合新增白名单配置，也不会立即参与搜索；如需让历史消息支持此类搜索，需联系环信商务完成相应同步。
  
### 高亮显示参数

搜索结果中支持搜索关键词的高亮显示。相关高亮参数如下：

| 参数 | 类型 | 是否必填 | 描述 |
| :--- | :--- | :--- | :--- |
| `highlightEnable` | Boolean | 否 | 是否启用关键词高亮，默认值为 `false`。 |
| `highlightFragmentSize` | Integer | 否 | 单个高亮片段的长度，按字符数计，取值范围为 `1-10000`，默认值为 `150`。 |
| `highlightNumberOfFragments` | Integer | 否 | 返回的高亮片段数量，取值范围为 `0-100`，默认值为 `3`。取值为 `0` 时，返回完整字段内容。 |
| `highlightPreTags` | String | 否 | 高亮开始标签，长度范围为 `1-32` 个字符，默认值为 `<em>`。 |
| `highlightPostTags` | String | 否 | 高亮结束标签，长度范围为 `1-32` 个字符，默认值为 `</em>`。 |

高亮片段以命中关键词所在位置为中心，从匹配文本中截取。命中结果较多时，系统按相关性返回最相关的片段，实际返回数量不超过 `highlightNumberOfFragments`；当 `highlightNumberOfFragments` 取值为 `0` 时，返回完整字段内容而非片段。

**高亮内容限制**：高亮返回内容总量受 `highlightFragmentSize`、`highlightNumberOfFragments` 和 `size` 共同影响。若参数组合导致单次请求返回的高亮内容过多，接口将返回 `400`，错误码为 `4000005`。建议适当减小这些参数的值后重试。

## 响应示例

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应体遵循 `data` + `meta` 结构，搜索结果位于 `data.list`，分页信息位于 `data.pagination`。

以下示例为按相关性得分降序对搜索结果排序：

```json
{
  "data": {
    "list": [
      {
        "messageId": 1525683241653109136,
        "appKey": "myorg#myapp",
        "conversationType": "chat",
        "contentType": "text",
        "sentTime": 1741260600000,
        "senderId": "user01",
        "receiverId": "user02",
        "content": {
          "message": "我刚买了一台苹果手机，感觉很不错"
        },
        "ext": {
          "device": "iPhone"
        },
        "highlight": {
          "content.message": [
            "我刚买了一台<em>苹果手机</em>，感觉很不错"
          ]
        },
        "relevanceScore": 8.25
      }
    ],
    "pagination": {
      "totalPages": 5,
      "page": 1,
      "count": 1,
      "isFinished": 0
    }
  },
  "meta": {
    "timestamp": 1711843200000,
    "requestId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## 响应 body 参数

搜索结果支持按 相关性 或 发送时间 排序，并支持分页加载与搜索关键词的高亮显示。

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体遵循 `data` + `meta` 结构，分为以下三部分：
- `data.list`：消息结果数组。
- `data.pagination`：分页信息。
- `meta`：其他元信息。

### 消息结果数组

消息结果包含命中的原始文本消息内容、自动翻译后的文本内容和消息扩展字段（已开通消息扩展字段搜索）。

搜索命中的消息位于 `data.list` 数组中，数组每个元素（`list[]`）为一条消息，包含以下字段：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data.list` | JSON Array | 消息结果数组。 |
| `list[].messageId` | Long | 消息 ID。 |
| `list[].appKey` | String | 应用标识，格式为 `{org_name}#{app_name}`。 |
| `list[].conversationType` | String | 会话类型：<br/> - `chat`：单聊。<br/> - `groupchat`：群聊。<br/> - `chatroom`：聊天室。 |
| `list[].contentType` | String | 消息类型：<br/> - `text`：文本/合并消息（通过 `content.subtype` 为 `sub_combine` 区分）。<br/> - `image`：图片。<br/> - `video`：视频。<br/> - `file`：文件。<br/> - `location`：位置。|
| `list[].sentTime` | Long | 消息发送时间，Unix 毫秒级时间戳。 |
| `list[].senderId` | String | 发送者用户 ID。 |
| `list[].receiverId` | String | 接收者 ID（单聊为对方用户 ID，群聊为群组 ID，聊天室为聊天室 ID）。 |
| `list[].content` | JSON Object | 消息内容对象，具体结构由 `contentType` 决定，详见 [不同消息类型的 content 结构](#不同消息类型的-content-结构)。 |
| `list[].ext` | JSON Object | 消息扩展字段。仅当消息包含 ext 时返回。 |
| `list[].translations` | JSON Array | 自动翻译结果数组。仅当消息包含翻译时返回。 |
| - `code` | String | 翻译目标语言代码，如 `en`、`zh`。 |
| - `text` | String | 翻译后的文本内容，支持全文搜索和高亮。 |
| `list[].highlight` | JSON Object | 高亮片段。仅当请求中 `highlightEnable` 为 `true` 且命中可高亮字段时返回。key 为命中的字段名（如 `content.message`），value 为高亮片段数组。 |
| `list[].relevanceScore` | Float | 相关性评分。仅当 `sort` 为 `relevance:desc` 时返回。 |

### 分页信息

分页信息位于 `data.pagination` 对象中，包含以下字段：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `data.pagination` | JSON Object | 分页信息。 |
| - `totalPages` | Integer | 总页数。无法确定时返回 `-1`。 |
| - `page` | Integer | 当前页码。 |
| - `count` | Integer | 当前页实际返回的消息数量。 |
| - `isFinished` | Integer | 是否为最后一页：<br/> - `0`：还有下一页。<br/> - `1`：没有下一页。 |

### 其他元信息

其他元信息位于 `meta` 对象中，包含以下字段：

| 参数 | 类型 | 描述 |
| :--- | :--- | :--- |
| `meta.timestamp` | Long | 毫秒级 UTC 时间戳。 |
| `meta.requestId` | String | 请求追踪 ID。 |

### 不同消息类型的 content 结构

`data.list[].content` 字段的内部结构由消息的 `data.list[].contentType` 决定。以下为各类型消息的 `data.list[].content` 示例。

**`text`（文本消息）**

```json
{
  "message": "你好，abc，123！"
}
```

**`image`（图片消息）**

```json
{
  "filename": "screenshot.png",
  "size": 376440,
  "secret": "zb3-ECEQEfGSllUnys_ADO1Pv-XyjBqhyoH3LWjpxZsdm6ph",
  "dimensions": { "height": 544, "width": 362 },
  "thumb_filename": "screenshot.png",
  "url": "https://example.com/chatfiles/cdbdd700-2110-11f1-95ed-05f670def632"
}
```

**`video`（视频消息）**

```json
{
  "filename": "IMG_1704.MOV",
  "size": 8780234,
  "duration": 10,
  "secret": "frGlcCEUEfGlcl08ctsvycTffjkdpPOM6Dp1fzLrvzNxWaaA",
  "thumb": "https://example.com/chatfiles/7a78ddc0-2114-11f1-80df-75c619ad7062?vframe=true",
  "thumb_secret": "frGlcCEUEfGlcl08ctsvycTffjkdpPOM6Dp1fzLrvzNxWaaA",
  "thumb_filename": "IMG_1704.MOV",
  "url": "https://example.com/chatfiles/7a78ddc0-2114-11f1-80df-75c619ad7062"
}
```

**`file`（文件消息）**

```json
{
  "filename": "test.txt",
  "size": 16,
  "secret": "e1as4CEPEfGMN7V23qwViK7EKL7K8Z6qonckfe3Be4vjb7ii",
  "thumb_filename": "test.txt",
  "url": "https://example.com/chatfiles/7b55e990-210f-11f1-bc8f-4fb41cea76ca"
}
```

**`location`（位置消息）**

```json
{
  "address": "深圳市南山区高新南一道009号",
  "building_name": "腾讯大厦",
  "coordinates": "22.543096,114.057865"
}
```

**`combine`（合并消息）**

```json
{
  "subtype": "sub_combine",
  "title": "Chat History",
  "summary": "yxd02:Hello呀\n:噢\n:aaaa\n",
  "combine_level": 1,
  "filename": "17737278928543011",
  "size": 645,
  "msg": "[Chat History]",
  "secret": "<your-file-secret>",
  "url": "https://example.com/chatfiles/2597b0b0-21c8-11f1-afb8-776a2d018d6b"
}
```

合并消息作为一种特殊的文本消息存储与返回，响应 body 中 `contentType` 为 `text`，通过 `content.subtype` 为 `sub_combine` 区分。其 `content` 中包含合并消息的标题（`title`）、摘要（`summary`）、合并层级（`combine_level`）以及文件信息（`filename`、`size`、`secret`、`url`）等字段。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败。可能提示以下错误：

| HTTP 状态码 | 错误码 | 错误提示 | 可能原因 | 处理建议 |
| :--- | :--- | :--- | :--- | :--- |
| 400 | 4000005 | 请求体格式错误或缺少必需参数 | `keyword` 未传入、为空，或其他参数格式不合法。 | 检查请求体格式，确保 `keyword` 必传且为有效字符，其余参数符合取值范围。 |
| 400 | 4000006 | 搜索条件过于复杂 | 关键词过长，或搜索范围过宽，超出了单次搜索的处理上限。 | 请缩短关键词、减少关键词数量，或通过会话、消息类型、时间范围等过滤条件缩小搜索范围后重试。该错误为确定性错误，原样重试不会成功。 |
| 401 | 4010101 | Token 不合法或已过期 | `Authorization` 中的 Token 无效或已过期。 | 重新获取有效的 App Token 后再发起请求。 |
| 403 | 4030204 | 搜索服务未激活 | 当前应用未开通搜索服务，或搜索服务已关闭。 | 搜索为增值服务，请先联系环信商务开通后再调用。 |
| 404 | 4040302 | 应用不存在 | 请求 URL 中的 `org_name` 或 `app_name` 不正确。 | 检查请求 URL 中的组织名和应用名是否正确。 |
| 429 | 4290501 | API 调用频率超出限制 | 调用频率超过限制。 | 请降低调用频率，或联系环信商务提升频率上限。响应 `meta.retryAfter` 给出建议的重试等待秒数。 |
| 500 | 5000701 | 服务器内部错误 | 服务端处理请求时发生异常。 | 请稍后重试，若持续出现请联系环信技术支持。 |
| 502 | 5020801 | 下游服务暂时不可用 | 搜索服务依赖的下游服务（如群组成员校验服务）暂时不可用，或本次搜索仅取得部分结果而未能完整返回。 | 请稍后重试，若持续出现请联系环信技术支持。 |
