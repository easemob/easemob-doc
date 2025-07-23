# 查询关键词名单列表

## 功能说明

你可以查询单个关键词名单或分页查询关键词名单列表。

**调用频率上限**：100 次/秒/App Key 

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 REST API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/search
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

- 若只传入 `name`，则返回指定名称的关键词名单。
- 若只传入 `tagId`，则返回匹配指定标签的关键词名单。
- 若你只传入了 `size` 和 `page`，则返回指定页面的关键词名单。
- 若你这四个参数都不传，默认返回第 `0` 页的 10 个关键词名单（若应用的关键词名单总数量小于 10，则返回所有名单）。

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | 否       | 关键词名单的名称。 |
| `tagId`        | String | 否       | 标签 ID。|
| `size` | Int   | 否   | 每页返回的关键词数量，取值范围为 [1,200]，默认值为 `10`。| 
| `page` | Int   | 否 | 当前页码，默认值为 `0`。|  

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entities` | JSON Array | 关键词名单的详情。 |
| - `id` | String | 关键词名单 ID。 |
| - `name` | String  | 关键词名单的名称。 |
| - `moderationId` | String | 审核 ID。开发者可忽略该参数。 |
| - `appkey` | String | 应用的 App Key。 |
| - `category` | String | 值为 `DEFAULT`，表示关键词名单。 |
| - `scope` | String | 关键词名单的生效范围。  |
| - `tagId` | String | 标签 ID。 |
| - `fullMatch` | Boolean | 关键词与消息内容是否要精确匹配。 |
| - `suggestion` | String | 对匹配关键词的消息内容的处理建议。该字段的值以及值的含义与 `disposition` 字段相同。  |
| - `disposition` | String | 对匹配关键词的消息内容的处理。  |
| - `quantity` | Int | 名单中关键词的总数量。 |
| - `status` | String | 关键词名单的状态：<br> - `ACTIVE`：开启<br> - `CLOSE`：关闭 |
| - `createDataTime` | Long | 关键词名单的创建时间。|
| - `updateDataTime` | Long | 关键词名单的修改时间。|
| `first` | Boolean | 当前页面是否为首页：<br/> - `true`：是 <br/> - `false`：否|
| `last` | Boolean | 当前页面是否为最后一页：<br/> - `true`：是 <br/> - `false`：否|
| `size` | Int | 每页查询的关键词名单数量。 |
| `number` | Int | 当前页码。 |
| `numberOfElements` | Int | 当前页面中获取的关键词名单数量。|
| `totalPages` | Int | 页面总数。|
| `totalElements` | Int | 应用的关键词名单总数量。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

- 查询指定名称的关键词名单：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "14"
    }' 
```

- 查询匹配指定用户标签的关键词名单：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "tagId": "111"
    }' 
```

- 查询指定页面的关键词名单，例如，查询第 `1` 页的关键词名单：
  
```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "page": 1,
      "size": 5
    }' 
```

### 响应示例

- 返回指定名称的关键词名单：

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1r14aXXXX2vv3ob5wctsjB970y6",
            "name": "14",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:24.888+00:00",
            "updateDataTime": "2025-02-28T08:50:24.888+00:00"
        }
    ],
    "first": true,
    "last": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "totalPages": 1,
    "totalElements": 1
}
```

- 返回匹配指定用户标签的关键词名单，例如，以下响应示例表明没有匹配指定标签的关键词名单：

```json
{
    "status": "OK",
    "entities": [],
    "first": true,
    "last": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 0,
    "totalPages": 0,
    "totalElements": 0
}
```

- 返回指定页面的关键词名单，例如，返回第 `1` 页的 5 个关键词名单：

```json 
{
    "status": "OK",
    "entities": [
        {
            "id": "1r1XXXX8f5zh3Tu9PMKIyu7AwED",
            "name": "8",
            "moderationId": "159XXXXL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:49:57.156+00:00",
            "updateDataTime": "2025-02-28T08:49:57.156+00:00"
        },
        {
            "id": "1r1XXXXUhZAQwknj7mJWUTlyFYP",
            "name": "9",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:04.228+00:00",
            "updateDataTime": "2025-02-28T08:50:04.228+00:00"
        },
        {
            "id": "1r14XXXXDxBnH3oMuSzhroY1shB",
            "name": "12",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:14.528+00:00",
            "updateDataTime": "2025-02-28T08:50:14.528+00:00"
        },
        {
            "id": "1r14XXXXeuqtBfaHcvJaZuandVR",
            "name": "13",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:20.616+00:00",
            "updateDataTime": "2025-02-28T08:50:20.616+00:00"
        },
        {
            "id": "1xXXXXmhFTjU2LvOooO1IEGpeut",
            "name": "111111",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-07-22T09:44:12.917+00:00",
            "updateDataTime": "2025-07-22T09:44:12.917+00:00"
        }
    ],
    "first": false,
    "last": false,
    "size": 5,
    "number": 1,
    "numberOfElements": 5,
    "totalPages": 5,
    "totalElements": 24  
}   
```    

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。