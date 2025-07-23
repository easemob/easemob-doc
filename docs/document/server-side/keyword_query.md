# 查询关键词

## 功能说明

- 在单个关键词名单中查询关键词。
- 该接口为模糊查询。例如，若传入关键词 `message`，响应中会返回关键词名单中包含该关键词的词条，包括 `message``messageid`、`addmessage` 和 `deletemessage` 等词条。

**调用频率上限**：100 次/秒/App Key 

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 RESTful API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。


## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`    | String | 是       | 关键词名单 ID。查询该名单中的关键词。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `word`        | String | 是 | 要查询的关键词名称。 |
| `page` | Int   | 否 | 当前页码，默认值为 `0`。|
| `size` | Int   | 否   | 每页返回的关键词数量，取值范围为 [1,200]，默认值为 `10`。|

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entities` | JSON Array | 查询详情。 |
| - `id` | String | 关键词 ID。 |
| - `word` | String  | 关键词名称。 |
| - `userId` | String | 查询关键词的用户。 |
| - `listId` | String | 关键词名单 ID。 |
| - `createDateTime` | Long  | 关键词添加时间。 |
| - `updateDateTime` | Long | 关键词修改时间。|
| `first` | Boolean | 当前页面是否为首页：<br/> - `true`：是 <br/> - `false`：否  |
| `last` | Boolean | 当前页面是否为最后一页：<br/> - `true`：是 <br/> - `false`：否 |
| `size` | Int | 当前页面返回的与查询关键词模糊匹配的词条。|
| `number` | Int | 当前页码。 |
| `numberOfElements` | Int | 当前页面中获取的词条数量。 |
| `totalPages` | Int | 页面总数。 |
| `totalElements` | Int | 与查询关键词匹配的词条总数量。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "word": "music",
      "size": "3",
      "page": "0"
    }' 
```

### 响应示例

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1xXXXX7uZXqAfXzk0Y2OZ3JOhJt",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "musicvideo",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752501847581,
            "updateDateTime": 1752501847581
        },
        {
            "id": "1xXXXXUjdvN1LE68wFeILywpks2",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "musicraudio",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752501847581,
            "updateDateTime": 1752501847581
        },
        {
            "id": "1xXXXXNiiIOSZmGNMBGgNEZ6jj9",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "music",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752489316741,
            "updateDateTime": 1752490995382
        }
    ],
    "first": true,
    "last": true,
    "size": 3,
    "number": 0,
    "numberOfElements": 3,
    "totalPages": 1,
    "totalElements": 3
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad request | textList data is empty | 未传 `list_id`。 | 请传入有效的 `list_id`。 |
| 400 | Bad request | appkey is not exist | App Key 是环信即时通讯 IM 分配给每个应用的唯一标识，由 `orgname` 和 `appname` 参数的值组成。上报该错误表示 `org_name` 或者 `app_name` 不正确。 | 请传入正确的 `org_name` 和 `app_name` 参数。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。