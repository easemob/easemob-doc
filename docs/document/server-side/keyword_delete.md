# 删除单个关键词

## 功能说明

删除单个关键词。

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
DELETE https://{host}/{org_name}/{app_name}/moderation/text/list/(list_id)/word?wordId={word_id}
```

### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `list_id`        | String | 是       | 关键词名单 ID。 |

### 查询参数

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `word_id`  | String    | 是       | 要删除的关键词的 ID。   |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |
| `entity` | Boolean | 是否删除成功：<br/> - `true`：删除成功 <br/> - `false`：删除失败 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word?wordId={word_id}' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
```

### 响应示例

```json
{
  "status": "OK",
  "entity": true
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad Request | request data is empty | 名单 ID 不存在 | 传输正确的名单 ID。 |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。