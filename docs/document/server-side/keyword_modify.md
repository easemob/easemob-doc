# 修改关键词

## 功能说明

修改单个关键词。

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
PUT https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`    | String | 是       | 关键词名单 ID。要修改该名单中的关键词。  |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### 请求 body

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :----------------------- |
| `id`        | String | 是 | 要修改的关键词 ID。 |
| `word`        | String | 是 | 修改后的关键词。|
| `userId`        | String | 是 | 修改关键词的用户 ID。|

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entity` | JSON | 修改后的关键词的详情。 |
| - `id` | String | 修改后的关键词的 ID。 |
| - `appId` | String | 应用 ID。开发者可忽略该参数。 |
| - `word` | String  | 修改后的关键词。 |
| - `userId` | String | 修改关键词的用户 ID。 |
| - `listId` | String | 关键词名单 ID。 |
| - `status` | String | 关键词状态。开发者可忽略该参数。 |
| - `createDateTime` | Long | 关键词的创建时间。 |
| - `updateDateTime` | Long | 关键词的修改时间。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例


```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9", 
      "word": "music",
      "userId": "v1"
}' 
```

### 响应示例

```json
{
    "status": "OK",
    "entity": {
        "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9",
        "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
        "word": "music",
        "userId": "v1",
        "listId": "1r14XXXXZ3iSBbR3WTczWj92qsq",
        "status": true,
        "createDateTime": 1752489316741,
        "updateDateTime": 1752490995382
    }
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad request  | textList id is empty           | 关键词名单 ID 参数 `list_id` 为空，App Key 与 `list_id` 无法对应。 | 请传入正确的关键词名单 ID `list_id`。 |
| 400 | Bad request | the param can not be empty | 请求 body 中的关键词 ID `id` 为空，App Key 与 `id` 无法对应。 | 请传入正确的关键词 ID `id`。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。