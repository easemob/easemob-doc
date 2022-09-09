# 消息表情回复 Reaction REST API

<Toc />

消息表情回复（下文统称 “Reaction” ）支持用户在单聊和群聊场景中对单条消息回复表情，从而增加用户聊天时的互动方式。本文主要介绍 Reaction 相关 REST API 接口。

## 公共参数

### 请求参数

| 参数      | 类型   | 是否必需 | 描述                                         |
| :-------- | :----- | :------- | -------------------------------------------- |
| `host`     | String | 必需     | 你在环信即时通讯云控制台注册项目时所在的集群服务器地址。 |
| `org_name` | String | 必需     | 即时通讯服务分配给每个企业（组织）的唯一标识。你可以通过控制台获取该字段。 |
| `app_name` | String | 必需     | 你在环信即时通讯云控制台注册项目时填入的应用名称。         |
| `userId`   | String | 必需     | 用户 ID。                                                  |

### 响应参数

| 参数        | 描述                                     |
| :---------- | :--------------------------------------- |
| `data`      | 实际取到的数据详情。                     |
| `username`  | 用户 ID。                          |
| `groupname` | 群组名。                                 |
| `timestamp` | 请求响应的时间，Unix 时间戳，单位为 ms。 |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 仅支持使用 app token 的鉴权方式，详见 [使用 app token 鉴权](easemob_app_token.html)。

## 创建/追加 Reaction

在单聊和群聊场景中在单条消息上创建或追加 Reaction。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/reaction/user/{userId}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | ------------------------------------------------------------ |
| `Content-Type`  | String | 必需     | 内容类型：`application/json`                                 |
| `Authorization` | String | 必需     | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 |

#### 请求 body

| 参数      | 类型   | 是否必需<div style="width: 80px;"></div> | 说明                                             |
| --------- | ------ | -------- | ------------------------------------------------ |
| `msgId`   | String | 必需     | 消息 ID。                                        |
| `message` | String | 必需     | 表情 ID。长度不可超过 128 个字符。与客户端一致。允许的字符集包括：<br/> - 26 个大写字母 (A-Z)；<br/> - 26 个小写字母(a-z)；<br/> - 10 个数字(0-9)；<br/> - 特殊字符（建议不使用）：''*'' ''~'' ''!'' ''@'' ''#'' ''$'' ''('' '')'' ''_'' ''-'' ''='' ''?'' ''/'' ''.'' '','' ''<'' ''>'' ''''' '':'' '';'' ''！'' ''¥'' ''（'' ''）'' ''——'' ''【'' ''】'' ''、'' ''；'' ''“'' ''：'' ''？'' ''。'' ''，'' ''《'' ''》''。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型    | 说明                                                        |
| ------------------- | ------- | ----------------------------------------------------------- |
| `requestStatusCode` | String  | 接口相应 code 状态。`OK` 表示操作成功。                     |
| `id`                | String  | Reaction ID。                                               |
| `msgId`             | String  | 消息 ID。                                                   |
| `msgType`           | String  | 消息类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊。 |
| `groupId`           | Long    | 群组 ID（单聊时为 null）。                                  |
| `reaction`          | String  | 表情 ID，与客户端一致。同请求参数中 “message”。             |
| `createAt`          | Instant | 创建时间。                                                  |
| `updateAt`          | Instant | 修改时间。                                                  |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X POST 'http://localhost:8089/easemob-demo/easeim/reaction/user/e1' -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type: application/json' --data-raw '{
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
        "reaction": "message123456",
        "createdAt": "2022-02-24T10:57:43.138934Z",
        "updatedAt": "2022-02-24T10:57:43.138939Z"
    }
}
```

## 根据消息 ID 获取 Reaction

该方法根据单聊或群聊中的消息 ID 获取指定消息的 Reaction 信息，包括 Reaction ID、使用的表情 ID、以及使用该 Reaction 的用户 ID 及用户人数。获取的 Reaction 的用户列表只展示最早三个添加 Reaction 的用户。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | ------------------------------------------------------------ |
| `Content-Type`  | String | 必需     | 内容类型：`application/json`                                 |
| `Authorization` | String | 必需     | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 |

#### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                      |
| :---------- | :----- | :------- | --------------------------------------------------------- |
| `msgIdList` | Array  | 必需     | 需要查询的消息 ID 列表。                                  |
| `msgType`   | String | 必需     | 消息类型（单聊：`chat`； 群聊：`groupchat`）。            |
| `groupId`   | String | 非必需   | 群组 ID（若要拉取群中的 Reaction，需要传当前群组的 ID）。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 说明                                                         |
| ------------------- | ------ | ------------------------------------------------------------ |
| `requestStatusCode` | String | 接口相应 code 状态。`OK` 表示操作成功。                      |
| `msgId`             | String | 消息 ID。                                                    |
| `reactionId`        | String | Reaction ID。                                                |
| `reaction`          | String | 表情 ID，与客户端一致。同请求参数中 “message”。              |
| `count`             | Number | 添加该 Reaction 的用户人数。                         |
| `state`             | Bool   | 当前请求用户是否添加过该 Reaction。 <br/> - `true`: 是； <br/> - `false`：否。 |
| `userList`          | Array  | 追加 Reaction 的用户 ID 列表。只返回最早操作 Reaction 的三个用户的 ID。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X GET 'http://localhost:8089/easemob-demo/easeim/reaction/user/{{userId}}?msgIdList=msgId1&msgType=chat' -H 'Authorization: Bearer <YourAppToken>'
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
                    "reaction": message123456,
                    "count": 0,
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
                    "reaction": message123456,
                    "count": 0,
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

删除当前用户对该 Reaction 的追加操作。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/reaction/user/{userId}
```

### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | ------------------------------------------------------------ |
| `Content-Type`  | String | 必需     | 内容类型：`application/json`                                 |
| `Authorization` | String | 必需     | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 |

#### 请求 body

| 参数      | 类型   | 是否必需 | 描述                                             |
| :-------- | :----- | :------- | ------------------------------------------------ |
| `msgId`   | String | 必需     | 消息 ID。                                        |
| `message` | String | 必需     | 表情 ID。长度不可超过 128 个字符。与客户端一致。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 说明                                      |
| ------------------- | ------ | ----------------------------------------- |
| `requestStatusCode` | String | 接口相应 code 状态。`OK` 表示操作成功。   |
| `timestamp`         | long   | 请求响应的时间，Unix 时间戳，单位为毫秒。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -g -X DELETE 'http://localhost:8089/easemob-demo/easeim/reaction/user/wz?msgId=997625372793113144&message=emoji_40' -H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "requestStatusCode": "ok",
    "timestamp": 1645774821181
}
```

## 根据消息 ID 和表情 ID 获取 Reaction 信息

该方法根据指定的消息的 ID 和表情 ID 获取对应的 Reaction 信息，包括使用了该 Reaction 的用户名及用户人数。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}/detail
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | ------------------------------------------------------------ |
| `Content-Type`  | String | 必需     | 内容类型：`application/json`                                 |
| `Authorization` | String | 必需     | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 |

#### 请求 body

| 参数      | 类型    | 是否必需 | 说明                                                         |
| --------- | ------- | -------- | ------------------------------------------------------------ |
| `msgId`   | String  | 必需     | 消息 ID。                                                    |
| `message` | String  | 必需     | 表情 ID。长度不可超过 128 个字符。与客户端一致。             |
| `limit`   | Integer | 非必需   | 分页获取时使用，每页显示的 Reaction 条数（默认值和最大值都为 50）。 |
| `cursor`  | String  | 非必需   | 分页获取时使用，传入游标后便从游标起始的地方进行查询，类似于数据库 limit 1,5 中 1 的作用，可以理解为页码。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 说明                                                         |
| ------------------- | ------ | ------------------------------------------------------------ |
| `requestStatusCode` | String | 接口相应 code 状态。`OK` 表示操作成功。                      |
| `reactionId`        | String | Reaction ID。                                                |
| `reaction`          | String | 表情 ID，与客户端一致。同请求参数中 “message”。              |
| `count`             | Number | 添加该 Reaction 的用户人数。                                 |
| `state`             | Bool   | 当前请求用户是否添加过该 Reaction。 <br/> - `true`：是；<br/> - `false`：否。 |
| `userList`          | Array  | 追加 Reaction 的用户 ID 列表。只返回最早操作 Reaction 的三个用户的 ID。 |
| `cursor`            | String | 分页获取时使用，传入游标后便从游标起始的地方进行查询，类似于数据库 limit 1,5 中 1 的作用，可以理解为页码。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例(第一页)

```shell
curl -g -X GET 'http://localhost:8089/easemob-demo/easeim/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&limit=50' -H 'Authorization: Bearer <YourAppToken>'
```

#### 请求示例(第 N 页)

```shell
curl -g -X GET 'http://localhost:8089/easemob-demo/easeim/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&cursor=944330529971449164&limit=50' -H 'Authorization: Authorization: Bearer <YourAppToken>'
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
        "userList": [
            "wz1"
        ],
        "cursor": "946463471296555192"
    }
}
```