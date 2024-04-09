# 消息表情回复 Reaction REST API

<Toc />

消息表情回复（“Reaction”）指用户在单聊和群聊场景中对单条消息回复表情，可丰富用户聊天时的互动方式。对于单个消息，一个消息表情即为一个 Reaction，若不同用户重复添加同一消息表情，Reaction 数量计为 1。每条消息默认可添加 20 个 Reaction，若需提升该上限，需联系环信商务。

本页介绍如何使用即时通讯 IM RESTful API 实现 Reaction 功能。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                            |
| :--------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 仅支持使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 创建/追加 Reaction

在单聊或群聊场景中对单条消息创建或追加 Reaction。

创建 Reaction 指对消息添加第一条 Reaction，后续的 Reaction 添加称为追加。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/reaction/user/{username}
```

#### 路径参数

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------------------------------------- |
| `username` | String | 是       | 当前用户的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。填入 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数      | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                                                                                                                                                          |
| :-------- | :----- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `msgId`   | String | 是                                       | 消息 ID。                                                                                                                                                     |
| `message` | String | 是                                       | 表情 ID。长度不能超过 128 个字符，必须与客户端的设置一致。该参数对支持的字符集类型没有限制，若使用特殊字符，获取和删除 Reaction 时需对特殊字符进行 URL 编码。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型    | 描述                                                                                              |
| :------------------ | :------ | :------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String  | 操作结果，`ok` 表示成功创建或追加 Reaction。                                                      |
| `timestamp`         | Long    | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                         |
| `data`              | JSON    | 添加的 Reaction 的详情。                                                                          |
| `data.id`           | String  | Reaction ID。                                                                                     |
| `data.msgId`        | String  | 添加 Reaction 的消息 ID。                                                                         |
| `data.msgType`      | String  | 消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊。                                 |
| `data.groupId`      | String  | 群组 ID。该参数在单聊时为 null。                                                                  |
| `data.reaction`     | String  | 表情 ID，与客户端一致，与[创建/追加 Reaction API](#创建/追加-Reaction)的请求参数 `message` 相同。 |
| `data.createAt`     | Instant | Reaction 的创建时间。                                                                             |
| `data.updateAt`     | Instant | Reaction 的修改时间。                                                                             |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X POST 'https://localhost:8089/easemob-demo/easeim/reaction/user/e1' -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type: application/json' --data-raw '{
    "msgId":"997625372793113144",
    "message":"emoji_40"
}'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181,
  "data": {
    "id": "946481033434607420",
    "msgId": "msg3333",
    "msgType": "chat",
    "groupId": null,
    "reaction": "emoji_40",
    "createdAt": "2022-02-24T10:57:43.138934Z",
    "updatedAt": "2022-02-24T10:57:43.138939Z"
  }
}
```

## 根据消息 ID 获取 Reaction

该方法根据单聊或群聊中的消息 ID 获取单个或多个消息的 Reaction 信息，包括 Reaction ID、使用的表情 ID、以及使用该 Reaction 的用户 ID 及用户人数。获取的 Reaction 的用户列表只展示最早三个添加 Reaction 的用户。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{username}?msgIdList={N,M}&msgType={msgType}&groupId={groupId}
```

#### 路径参数

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------------------------------------- |
| `username` | String | 是       | 当前用户的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数        | 类型   | 是否必需 | 描述                                                                                 |
| :---------- | :----- | :------- | :----------------------------------------------------------------------------------- |
| `msgIdList` | Array  | 是       | 需要查询的消息 ID 列表，最多可传 20 个消息 ID。                                      |
| `msgType`   | String | 是       | 消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊。                    |
| `groupId`   | String | 否       | 群组 ID。如果 `msgType` 设置为 `groupchat`，即拉取群中的 Reaction，必须指定群组 ID。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                           | 类型       | 描述                                                                                                    |
| :----------------------------- | :--------- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode`            | String     | 接口相应 code 状态。`OK` 表示操作成功。                                                                 |
| `timestamp`                    | Long       | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                               |
| `data`                         | JSON Array | 单个消息添加的 Reaction 的详情。                                                                        |
| `data.msgId`                   | String     | Reaction 对应的消息 ID。                                                                                |
| `data.reactionList`            | JSON Array | 单个消息的 Reaction 列表。                                                                              |
| `data.reactionList.reactionId` | String     | Reaction ID。                                                                                           |
| `data.reactionList.reaction`   | String     | 表情 ID，与客户端一致。该参数与[创建/追加 Reaction API](#创建/追加-Reaction)的请求参数 `message` 相同。 |
| `data.reactionList.count`      | Int        | 添加该 Reaction 的用户人数。                                                                            |
| `data.reactionList.state`      | Bool       | 当前请求用户是否添加过该 Reaction： <br/> - `true`: 是； <br/> - `false`：否。                          |
| `data.reactionList.userList`   | Array      | 添加 Reaction 的用户 ID 列表。只返回最早操作 Reaction 的三个用户的 ID。                                 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X GET 'https://localhost:8089/easemob-demo/easeim/reaction/user/{{userId}}?msgIdList=msgId1&msgType=chat' -H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "requestStatusCode": "ok",
    "timestamp": 1645774821181,
    "data": [
        {
            "msgId": "msg123",
            "reactionList": [
                {
                    "reactionId": "944330310986837168",
                    "reaction": "message123456",
                    "count": 3,
                    "state": false,
                    "userList": [
                        "test123",
                        "test456",
                        "test1"
                    ]
                }
            ]
        },
        {
            "msgId": "msg1234",
            "reactionList": [
                {
                    "reactionId": "945272584050659838",
                    "reaction": "message123456",
                    "count": 1,
                    "state": false,
                    "userList": [
                        "test5"
                    ]
                }
            ]
        }
    ]
}
```

## 删除 Reaction

删除当前用户追加的 Reaction。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/reaction/user/{username}?msgId={msgId}&message={message}
```

### 路径参数

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------------------------------------- |
| `username` | String | 是       | 当前用户的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 查询参数

| 参数      | 类型   | 是否必需 | 描述                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `msgId`   | String | 是       | 消息 ID。                                                      |
| `message` | String | 是       | 表情 ID。长度不可超过 128 个字符。该参数的值必须与客户端一致。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 描述                                      |
| :------------------ | :----- | :---------------------------------------- |
| `requestStatusCode` | String | 操作结果。`ok` 表示成功删除 Reaction。    |
| `timestamp`         | Long   | 请求响应的时间，Unix 时间戳，单位为毫秒。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X DELETE 'https://localhost:8089/easemob-demo/easeim/reaction/user/wz?msgId=997625372793113144&message=emoji_40' -H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181
}
```

## 根据消息 ID 和表情 ID 获取 Reaction 信息

该方法根据指定的消息的 ID 和表情 ID 获取对应的 Reaction 信息，包括使用了该 Reaction 的用户 ID 及用户人数。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{username}/detail?msgId={msgId}&message={message}&limit={limit}&cursor={cursor}
```

#### 路径参数

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :-------------------------------------------------------- |
| `username` | String | 是       | 当前用户的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数      | 类型   | 是否必需 | 描述                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `msgId`   | String | 是       | 消息 ID。                                                      |
| `message` | String | 是       | 表情 ID。长度不可超过 128 个字符。该参数的值必须与客户端一致。 |
| `limit`   | Int    | 否       | 每页显示添加 Reaction 的用户数量。取值范围为 [1,50]，默认值为 `50`。   |
| `cursor`  | String | 否       | 查询游标，指定数据查询的起始位置，分页获取时使用。             |

:::notice

分页获取时，服务器按用户 Reaction 添加时间的正序返回。若 `limit` 和 `cursor` 均不传值，服务器返回最早添加 Reaction 的 50 个用户。

:::

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 描述                                                                                                    |
| :------------------ | :----- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String | 操作结果，`ok` 表示成功获取 Reaction 信息。                                                             |
| `timestamp`         | Long   | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                               |
| `data`              | JSON   | 消息添加的 Reaction 的详情。                                                                            |
| `data.reactionId`   | String | Reaction ID。                                                                                           |
| `data.reaction`     | String | 表情 ID，与客户端一致。该参数与[创建/追加 Reaction API](#创建/追加-Reaction)的请求参数 `message` 相同。 |
| `data.count`        | Int    | 添加该 Reaction 的用户人数。                                                                            |
| `data.state`        | Bool   | 当前请求用户是否添加过该 Reaction。 <br/> - `true`：是；<br/> - `false`：否。                           |
| `data.userList`     | Array  | 按 Reaction 添加时间正序返回的用户 ID 列表。                           |
| `data.cursor`       | String | 查询游标，指定下次查询的起始位置。                                                                      |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例(第一页)

```shell
curl -g -X GET 'https://localhost:8089/easemob-demo/easeim/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&limit=50' -H 'Authorization: Bearer <YourAppToken>'
```

#### 请求示例(第 N 页)

```shell
curl -g -X GET 'https://localhost:8089/easemob-demo/easeim/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&cursor=944330529971449164&limit=50' -H 'Authorization: Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645776986146,
  "data": {
    "reactionId": "946463470818405943",
    "reaction": "message123456",
    "count": 1,
    "state": true,
    "userList": ["wz1"],
    "cursor": "946463471296555192"
  }
}
```
