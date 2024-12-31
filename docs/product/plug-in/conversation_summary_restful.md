# 会话摘要 RESTful API

你可以使用 RESTful API 生成、获取和删除群组会话一段时间内的聊天内容的摘要。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](/product/enable_and_configure_IM.html#创建应用)。
- 已[开通会话摘要插件](conversation_summary_enable.html#开通功能)。
- 了解环信 IM RESTful API 的调用频率限制，详见[接口频率限制](/product/limitationapi.html)。

## 公共请求参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](/product/enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。  |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](/document/server-side/easemob_app_token.html)。

## 生成会话摘要

你可以为群聊会话中指定时间范围内的消息生成摘要，列明该摘要涉及的各个话题的详细信息。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/agent/v1/messages/summary
```

##### 路径参数

参数及描述详见 [公共参数](#公共请求参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :--------------------------- |
| `Content-Type`  | String | 是       | 内容类型。填入 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。填入 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数              | 类型      | 是否必须 | 描述           |
| :------------ | :-------- | :------- | :----------------------- |
| `conversationId` | String  | 是  | 群组 ID。目前，即时通讯 IM 仅支持群组的会话内容摘要。   |
| `username`     | String  | 否  | 会话摘要生成者的用户 ID。<br/> - 若传入了指定的用户 ID，则该会话摘要由该用户生成，属于该用户私有的摘要。对于单个群组会话，最多可为单个用户生成 20 个会话摘要。<br/> - 若不传入任何用户 ID，则该会话摘要没有特定生成者，属于群组的公开摘要。对于单个群组会话，最多可生成 20 个群聊的公开摘要。 |
| `chatType` | String    | 是 | 聊天类型，`chatgroup` 为群组类型。      |
| `startTimestamp` | Long      | 是       | 生成会话内容摘要的起始时间，UNIX 时间戳，单位为毫秒。  |
| `endTimestamp` | Long      | 是       | 生成会话内容摘要的结束时间，UNIX 时间戳，单位为毫秒。你最多可生成 48 小时内聊天内容的摘要。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型  | 描述                       |
| :----- | :---- | :------------------------- |
| `code` | String | 请求是否成功。`200` 表示请求成功。 |
| `data` | JSON | 请求结果。 |
| `data.summaryId` | String | 会话摘要 ID。 |
| `data.topicInfos` | JSONArray | 会话摘要中的话题信息。 |
| `data.topicInfos.title` | String | 话题的标题。 |
| `data.topicInfos.content` | String | 话题的内容。 |
| `data.topicInfos.participants` | Array | 话题中参与者的用户 ID。 |
| `data.topicInfos.msgCount` | Int | 该话题涉及的消息数量。 |
| `data.topicInfos.firstMsgId` | Long | 该话题涉及的首条消息的时间戳。 |
| `data.topicInfos.lastMsgId`  | Long | 该话题涉及的最后一条消息的时间戳。 |
| `data.generator` | String | 会话摘要的生成者。如果为 `null`，表示该会话摘要是利用 app token 调用 RESTful API 生成且没有指定生成者（未传入查询参数 `username`）。 |
| `data.summaryTimestamp` | Long | 会话摘要生成的时间戳。 |
| `data.imageUrls` | Array | 会话摘要涉及的图片的 URL。 |
| `data.videoUrls` | Array | 会话摘要涉及的视频的 URL。 |
| `data.messageContentList` | Array | 会话摘要涉及的消息内容列表。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考错误码了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST http://XXXX/XXXX/XXXX/agent/v1/messages/summary  \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-d '{
    "conversationId" : "260052191608833",
    "username" : "u3",
    "chatType" : "chatgroup",
    "startTimestamp" : 1727403468000,
    "endTimestamp" : 1727403679000
}'
```

##### 响应示例

```json
{
    "code": 200,
    "data": {
        "summaryId": "e23689e29647415b9799f2d9b11c3861",
        "topicInfos": [
            {
                "title": "午饭吃什么的讨论",
                "content": "讨论关于今天午饭的选择，包括饺子和其他可能的食物。",
                "participants": [
                    "u5"
                ],
                "msgCount": "3",
                "firstMsgId": "1330747175658850260",
                "lastMsgId": "1330747200933726164"
            }
        ],
        "generator" : "u3", 
        "summaryTimestamp": 1727423674695,
        "imageUrls": [],
        "videoUrls": [],
        "messageContentList" : [] 
    }
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

## 获取会话摘要

你可以获取指定群聊会话的摘要信息，查看摘要中各话题的信息。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/agent/v1/messages/summaries?conversationId={groupId}&username={username}&chatType={chatType}
```

##### 路径参数

参数及描述详见 [公共参数](#公共请求参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :--------------------------- |
| `Accept`        | String | 是       | 内容类型。填入 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 查询参数

| 参数              | 类型      | 是否必须 | 描述           |
| :------------ | :-------- | :------- | :----------------------- |
| `conversationId` | String  | 是  | 群组 ID。目前，即时通讯 IM 仅支持群组的会话内容摘要。   |
| `username`     | String  | 否  | 会话摘要的生成者。<br/> - 若传入指定的用户 ID，即时通讯 IM 仅获取该用户生成的所有私有会话摘要。<br/> - 若不传入任何用户 ID，则获取该该群组会话的所有公开摘要，即[调用 RESTful API 生成会话摘要](#生成会话摘要)时，未传入指定用户 ID（`username`）而生成的摘要。 |
| `chatType` | String    | 是 | 聊天类型，`chatgroup` 为群组类型。      |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型  | 描述                       |
| :----- | :---- | :------------------------- |
| `code` | String | 请求是否成功。`200` 表示请求成功。 |
| `data` | JSON | 请求结果。 |
| `data.summaryId` | String | 会话摘要 ID。 |
| `data.topicInfos` | JSONArray | 会话摘要中的话题信息。 |
| `data.topicInfos.title` | String | 话题的标题。 |
| `data.topicInfos.content` | String | 话题的内容。 |
| `data.topicInfos.participants` | Array | 该话题的参与者的用户 ID。 |
| `data.topicInfos.msgCount` | Int | 该话题涉及的消息数量。 |
| `data.topicInfos.firstMsgId` | Long | 该话题涉及的首条消息的时间戳。 |
| `data.topicInfos.lastMsgId`  | Long | 该话题涉及的最后一条消息的时间戳。 |
| `data.generator` | String | 会话摘要的生成者。如果为 `null`，表示该会话摘要是群组的公开摘要，即该摘要是利用 app token 调用 RESTful API 生成且未指定生成者（未传入查询参数 `username`）。|
| `data.summaryTimestamp` | Long | 会话摘要生成的时间戳。 |
| `data.imageUrls` | Array | 会话摘要涉及的图片的 URL。 |
| `data.videoUrls` | Array | 会话摘要涉及的视频的 URL。 |
| `data.messageContentList` | Array | 会话摘要涉及的消息内容列表。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考错误码了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'http://XXXX/XXXX/XXXX/agent/v1/messages/summaries?conversationId=260052191608833&username=u3&chatType=chatgroup' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
    "code": 200,
    "data": [
        {
            "summaryId": "e23689e29647415b9799f2d9b11c3861",
            "topicInfos": [
                {
                    "title": "午饭吃什么的讨论",
                    "content": "讨论关于今天午饭的选择，包括饺子和其他可能的食物。",
                    "participants": [
                        "u5"
                    ],
                    "msgCount": "3",
                    "firstMsgId": "1330747175658850260",
                    "lastMsgId": "1330747200933726164"
                }
            ],
            "generator" : "u5", // 新增参数摘要的生成者，如果为null说明是调用rest api使用app token生成的
            "summaryTimestamp": 1727423674695,
            "imageUrls": [],
            "videoUrls": [],
            "messageContentList" : [] // 新增参数消息内容列表
        },
        {
            "summaryId": "dbbb3e40c3694e428d5251a40cd74107",
            "topicInfos": [
                {
                    "title": "午餐吃什么的讨论",
                    "content": "讨论关于午餐的选择，包括饺子和其他可能的食物。",
                    "participants": [
                        "u5"
                    ],
                    "msgCount": "3",
                    "firstMsgId": "1330747175658850260",
                    "lastMsgId": "1330747200933726164"
                }
            ],
            "generator" : "u5", // 新增参数摘要的生成者，如果为null说明是调用rest api使用app token生成的
            "summaryTimestamp": 1727422710699,
            "imageUrls": [],
            "videoUrls": [],
            "messageContentList" : [] 
        }
    ]
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。

## 删除会话摘要

你可以删除群组会话中指定的会话摘要。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/agent/v1/messages/summary/{summaryId}?conversationId={groupId}&username={username}&chatType={chatType}
```

##### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `summaryId`        | String | 是       | 要删除的会话摘要 ID。 |

参数及描述详见 [公共参数](#公共请求参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :--------------------------- |
| `Accept`        | String | 是       | 内容类型。填入 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 查询参数

| 参数              | 类型      | 是否必须 | 描述           |
| :------------ | :-------- | :------- | :----------------------- |
| `conversationId` | String  | 是  | 群组 ID。目前，即时通讯 IM 仅支持群组会话的内容摘要。   |
| `username`     | String  | 否  | 会话摘要生成者的用户 ID。<br/> - 若传入了指定的用户 ID，即时通讯 IM 删除该用户生成的特定的私有会话摘要。<br/> - 若不传入任何用户 ID，则删除群组指定的公开摘要，即[生成](#生成会话摘要)时未指定用户 ID (`username`) 的摘要。 |
| `chatType` | String    | 是 | 聊天类型，`chatgroup` 为群组类型。      |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型  | 描述                       |
| :----- | :---- | :------------------------- |
| `code` | String | 请求是否成功。`200` 表示请求成功。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考错误码了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'http://XXXX/XXXX/XXXX/agent/v1/messages/summary/38c30ced8cc24fbd86b6ba79d4f57397?conversationId=260052191608833&username=u3&chatType=chatgroup' \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
    "code": 200
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。







