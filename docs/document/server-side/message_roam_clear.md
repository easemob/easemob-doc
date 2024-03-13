# 清空指定用户的漫游消息

清空指定用户当前时间及之前的所有漫游消息。

清空后，该用户无法从服务端拉取到漫游消息，而且该用户的所有会话也会被清除，也拉不到会话列表。不过，其他用户不受影响，仍然可以拉取与该用户的漫游消息和会话。

**调用频率**：100 次/秒/App Key

## 前提条件

要调用环信即时通讯 REST API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文涉及的所有消息管理 REST API 都需要使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/rest/message/roaming/user/{username}/delete/all
```

### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username`  | String | 是       | 要清空哪个用户的漫游消息。需传入该用户的用户 ID。  |

### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述     |
| :-------------- | :----- | :------------- | :--------------- |
| `Content-Type`  | String | 是      | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是    | 内容类型。请填 `application/json`。   |
| `Authorization` | String | 是    App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示该用户的漫游消息清除成功。 |
| `timestamp`          | Long | HTTP 响应的 Unix 时间戳，单位为毫秒。|

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl --location --request POST 'https://XXXX/XXXX/XXXX/rest/message/roaming/user/XXXX/delete/all' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: Content-Type: application/json' \
-H 'Accept: Accept: application/json'
```

### 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```