# 获取用户加入的聊天室

## 功能说明

根据用户 ID 分页获取该用户加入的聊天室。

## 调用频率上限

50 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/joined_chatrooms?pagenum={N}&pagesize={N}
```

| 参数       | 类型 | 是否必需 | 描述                                    |
| :--------- | :--- | :------- | :-------------------------------------- |
| `username`  | String  | 是       | 用户 ID。获取该用户加入的聊天室。                  |
| `pagenum`  | Int  | 否       | 当前页码，默认值为 1。                  |
| `pagesize` | Int  | 否       | 每页返回的聊天室数量，取值范围为 [1,1000]，默认值为 `1000`。该参数仅在分页获取时为必需。若传入的值超过了 `1000`，则返回 1000 个聊天室。 |

:::tip
若查询参数 `pagenum` 和 `pagesize` 均不传，服务器返回用户最新加入的 500 个聊天室。
:::

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/joined_chatrooms?pagenum=1&pagesize=10' \ 
-H 'Accept: application/json'   \  
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
    "action": "get",
    "application": "48472d89-5846-XXXX-XXXX-5fa4b79af9b1",
    "applicationName": "XXXX",
    "count": 2,
    "data": [
        {
            "id": "216295074234369",
            "name": "fd",
            "disabled": "false"
        },
        {
            "id": "216294461865985",
            "name": "testChatRoom",
            "disabled": "false"
        }
    ],
    "duration": 0,
    "entities": [],
    "organization": "XXXX",
    "params": {
        "pagesize": [
            "10"
        ],
        "pagenum": [
            "1"
        ]
    },
    "properties": {},
    "timestamp": 1685673568976,
    "uri": "http://XXXX/XXXX/XXXX/users/user2/joined_chatrooms"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 参数说明如下表所示：

| 字段        | 类型   | 描述                                                      |
| :---------- | :----- | :-------------------------------------------------------- |
| `data` | JSON Array | 聊天室详情。 |
|  - `id`   | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
|  - `name` | String | 聊天室名称，最大长度为 128 字符。                         |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `count` | String | 获取的聊天室数量。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。      |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `params`        | JSON | 查询参数。  |
|  - `pagesize`        | Array | 每页期望返回的聊天室数量。  |
|  - `pagenum`        | Array | 当前页码。  |
| `properties`      | String | 响应属性。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`            | String | 请求 URL。                              |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。