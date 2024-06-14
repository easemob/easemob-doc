# 推送标签管理

即时通讯服务支持通过设置标签自定义推送用户，实现精准推送。标签用于描述用户的生活习惯、兴趣爱好、行为特征等信息。对用户设置标签后，推送消息时，指定某一推送标签，即可向该标签下的用户发送消息。例如，可以为一些用户打上“时尚弄潮儿”标签后，可定期向该人群推送国内外潮流品牌的相关信息。

你可以通过环信即时通讯控制台创建和管理标签，也可以通过 REST API 进行标签管理。用户与标签是多对多的关系，即一个用户可以对应多个标签，一个标签也可以对应多个用户。

本文档主要介绍如何调用即时推送 REST API 实现创建及管理推送标签。调用以下方法前，请先参考 [接口频率限制](/product/limitation.html)了解即时通讯 RESTful API 的调用频率限制。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                |
| :--------- | :----- | :------- | :-------------------------------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。  |
| `username` | String | 是       | 用户 ID。                                           |

### 响应参数

| 参数        | 类型 | 描述                                 |
| :---------- | :--- | :----------------------------------- |
| `timestamp` | Long | 响应的 Unix 时间戳，单位为毫秒。     |
| `duration`  | Long | 从发送请求到响应的时长，单位为毫秒。 |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 token 鉴权](/product/easemob_app_token.html)。

## 创建推送标签

为推送的目标用户添加标签，对用户进行分组，实现精细化推送。当前最多可创建 100 个推送标签。如需提升该上限，请联系商务。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/label
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型。请填 `application/json`。                          | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段          | 类型   | 描述                                                         | 是否必需 |
| :------------ | :----- | :----------------------------------------------------------- | :------- |
| `name`        | String | 要创建的推送标签的名称，不能超过 64 个字符。支持以下字符集：<br/> - 26 个小写英文字母 a-z <br/> - 26 个大写英文字母 A-Z <br/> - 10 个数字 0-9 <br/> - “_“,”-“,”.” 标签名称区分大小写，因此 `Aa` 和 `aa` 为两个标签名称 。<br/>同一个 app 下，标签名称必须唯一。 | 是       |
| `description` | String | 推送标签的描述，不能超过 255 个字符。                        | 否       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                   |
| :------------ | :----- | :----------------------------------------------------- |
| `data`        | JSON   | 推送标签的数据。                                       |
| `name`        | String | 推送标签的名称。                                       |
| `description` | String | 推送标签的描述。                                       |
| `createdAt`   | Long   | 推送标签的创建时间。该时间为 Unix 时间戳，单位为毫秒。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X POST 'localhost/hx/hxdemo/push/label' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "name":"post-90s",
    "description":"hah"
}'
```

#### 响应示例

```json
{
    "timestamp": 1648720341157,
    "data": {
        "name": "post-90s",
        "description": "hah",
        "createdAt": 1648720341118
    },
    "duration": 13
}
```

## 查询指定的推送标签

查询指定的推送标签。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/push/label/{labelname}
```

#### 路径参数

| 参数        | 类型   | 描述                     | 是否必需 |
| :---------- | :----- | :----------------------- | :------- |
| `labelname` | String | 要查询的推送标签的名称。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                   |
| :------------ | :----- | :----------------------------------------------------- |
| `data`        | JSON   | 推送标签的数据。                                       |
| `name`        | String | 推送标签的名称。                                       |
| `description` | String | 推送标签的描述。                                       |
| `count`       | Int    | 该推送标签下的用户数量。                               |
| `createdAt`   | Long   | 推送标签的创建时间。该时间为 Unix 时间戳，单位为毫秒。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'localhost/hx/hxdemo/push/label/90' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "timestamp": 1648720562644,
    "data": {
        "name": "90",
        "description": "hah",
        "count": 0,
        "createdAt": 1648720341118
    },
    "duration": 0
}
```

## 分页查询推送标签

分页查询推送标签。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/push/label
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 查询参数

| 字段     | 类型   | 描述                                                       | 是否必需 |
| :------- | :----- | :--------------------------------------------------------- | :------- |
| `limit`  | Int    | 每页显示的推送标签的数量，取值范围为 [1,100]，默认为 `100`。 | 否       |
| `cursor` | String | 数据查询的起始位置。                                       | 否       |

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是  |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                   |
| :------------ | :----- | :----------------------------------------------------- |
| `data`        | JSON   | 推送标签的数据。                                       |
| `name`        | String | 推送标签的名称。                                       |
| `description` | String | 推送标签的描述。                                       |
| `count`       | Int    | 该推送标签下的用户数量。                               |
| `createdAt`   | Long   | 推送标签的创建时间。该时间为 Unix 时间戳，单位为毫秒。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'localhost/hx/hxdemo/push/label' \
-H 'Authorization: Bearer <YourAppToken>'
```

### 响应示例

```json
{
    "timestamp": 1648720425599,
    "data": [
        {
            "name": "post-90s",
            "description": "hah",
            "count": 0,
            "createdAt": 1648720341118
        },
        {
            "name": "post-80s",
            "description": "post-80s generation",
            "count": 0,
            "createdAt": 1647512525642
        }
    ],
    "duration": 1
}
```

## 删除指定的推送标签

删除指定的推送标签。每次只能删除单个推送标签。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/push/label/{labelname}
```

#### 路径参数

| 参数        | 类型   | 描述                     | 是否必需 |
| :---------- | :----- | :----------------------- | :------- |
| `labelname` | String | 要删除的推送标签的名称。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `data` | JSON | 推送标签成功删除的结果。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'localhost/hx/hxdemo/push/label/post-90s' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "timestamp": 1648721097405,
    "data": "success",
    "duration": 0
}
```

## 在推送标签下添加用户

为用户分配指定的推送标签。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/push/label/{labelname}/user
```

#### 路径参数

| 参数        | 类型   | 描述             | 是否必需 |
| :---------- | :----- | :--------------- | :------- |
| `labelname` | String | 推送标签的名称。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型。请填 `application/json`。                          | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段        | 类型 | 描述                                               | 是否必需 |
| :---------- | :--- | :------------------------------------------------- | :------- |
| `usernames` | List | 推送标签下的用户 ID 列表，最多可传 100 个用户 ID。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型 | 描述                                                         |
| :-------- | :--- | :----------------------------------------------------------- |
| `data`    | JSON | 用户添加结果。                                               |
| `success` | List | 列明成功添加的用户 ID。                                      |
| `fail`    | JSON | 返回的用户添加失败的结果，为键值对格式，其中 key 为添加失败的用户 ID，value 为失败原因。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X POST 'localhost/hx/hxdemo/push/label/post-90s/user' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "usernames":["hx1","hx2"]
}'
```

### 响应示例

```json
{
    "timestamp": 1648721496345,
    "data": {
        "success": [
            "hx1",
            "hx2"
        ],
        "fail": {}
    },
    "duration": 18
}
```

## 查询指定标签下的指定用户

查询推送标签是否存在指定用户。若存在，返回该用户的用户 ID 以及为该用户添加标签的时间；若不存在则不返回这些信息。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/push/label/{labelname}/user/{username}
```

#### 路径参数

| 参数        | 类型   | 描述              | 是否必需 |
| :---------- | :----- | :---------------- | :------- |
| `labelname` | String | 推送标签的名称。  | 是       |
| `username`  | String | 要查询的用户 ID。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型。请填 `application/json`。                          | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述                                 |
| :--------- | :----- | :----------------------------------- |
| `data`     | JSON   | 用户数据。                           |
| `username` | String | 要查询的用户 ID。                    |
| `created`  | Long   | 添加用户的 Unix 时间戳，单位为毫秒。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'localhost/hx/hxdemo/push/label/post-90s/user/hx1' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "timestamp": 1648721589676,
    "data": {
        "username": "hx1",
        "created": 1648721496324
    },
    "duration": 1
}
```

## 分页查询指定标签下的用户

分页查询指定标签下包含的用户。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/push/label/{labelname}/user
```

#### 路径参数

| 参数        | 类型   | 描述             | 是否必需 |
| :---------- | :----- | :--------------- | :------- |
| `labelname` | String | 推送标签的名称。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

### 查询参数

| 字段     | 类型   | 描述                                                 | 是否必需 |
| :------- | :----- | :--------------------------------------------------- | :------- |
| `limit`  | String | 每次获取的用户数量，取值范围为 [1,100]，默认为 100。 | 否       |
| `cursor` | String | 数据查询的起始位置。                                 | 否       |

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型。请填 `application/json`。                          | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述                                 |
| :--------- | :----- | :----------------------------------- |
| `cursor`   | String | 下次查询的起始位置。                 |
| `data`     | JSON   | 获得的用户的数据。                   |
| `username` | String | 获得的该标签下的用户 ID。            |
| `created`  | Long   | 添加用户的 Unix 时间戳，单位为毫秒。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'localhost/hx/hxdemo/push/label/post-90s/user?limit=1' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
    "timestamp": 1648721736670,
    "cursor": "ZWFzZW1vYjpwdXNoOmxhYmVsOmN1cnNvcjo5NTkxNTMwMDM4ODQxMzgwMjc",
    "data": [
        {
            "username": "hx1",
            "created": 1648721496324
        }
    ],
    "duration": 1
}
```

## 批量移出指定推送标签下的用户

一次移除指定推送标签下的单个或多个用户。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/push/label/{labelname}/user
```

#### 路径参数

| 参数        | 类型   | 描述             | 是否必需 |
| :---------- | :----- | :--------------- | :------- |
| `labelname` | String | 推送标签的名称。 | 是       |

其他参数及说明详见[公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 描述                                                         | 是否必需 |
| :-------------- | :----- | :----------------------------------------------------------- | :------- |
| `Content-Type`  | String | 内容类型。请填 `application/json`。                          | 是       |
| `Authorization` | String | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 是       |

#### 请求 body

| 字段        | 类型 | 描述                                               | 是否必需 |
| :---------- | :--- | :------------------------------------------------- | :------- |
| `usernames` | List | 要移出标签的用户 ID 列表，最多可传 100 个用户 ID。 | 是       |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型 | 描述                                                         |
| :-------- | :--- | :----------------------------------------------------------- |
| `data`    | JSON | 用户移出标签的结果。                                         |
| `Success` | List | 被移出标签的用户 ID。                                        |
| `fail`    | JSON | 返回的用户移出标签的结果，为键值对格式，其中 key 为移出失败的用户 ID，value 为失败原因。 |

其他参数及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#常见错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X DELETE 'localhost/hx/hxdemo/push/label/post-90s/user' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "usernames":["hx1","hx2"]
}'
```

#### 响应示例

```json
{
    "timestamp": 1648722018636,
    "data": {
        "success": [
            "hx1",
            "hx2"
        ],
        "fail": {}
    },
    "duration": 1
}
```

## 常见错误码

调用推送标签管理相关的 REST API 时，若返回的 HTTP 状态码非 200，则请求失败，提示错误。本节列出这些接口的常见错误码。 
| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403 | ServiceNotOpenException | push service not open | 即时推送功能未开通 | 确认并开通即时推送功能。 |
| 403 | LimitException | limit request | 因为数量或其他限制导致请求失败 | 根据返回信息的限制原因处理。 |
| 400 | ResourceNotFoundException | push label not exists of XXX | 即时推送标签不存在 | 检查并修改，使用正确存在的标签名。 |
| 404 | 请求路径不存在 | url is invalid | 请求路径错误 | 检查并修改，使用正确的请求路径。 |
| 5xx | 服务器内部错误   | 任意      | 服务器在尝试处理请求时发生内部错误 | 联系环信技术支持。 |

其他错误，你可以参考 [错误码](/document/server-side/error.html) 了解可能的原因。