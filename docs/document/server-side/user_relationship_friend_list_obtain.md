# 一次性获取好友列表

## 功能说明

- 服务器按照好友添加时间的倒序返回。
- 一次最多获取用户的 3000 个好友。
- 若用户的好友数量超过 3000，建议使用 [分页获取好友列表的接口](#分页获取好友列表)。
- 拉取的好友列表中只包括好友的用户 ID，不包括好友的任何用户资料。

**调用频率上限**：100 次/秒/App Key 

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 IM RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users
```

### 路径参数

| 参数             | 类型   | 是否必需 | 描述                      |
| :--------------- | :----- | :------- | :------------------------ |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username` | String | 是       | 好友列表所有者的用户 ID。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述   |
| :-------------- | :----- | :------- | :------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

### HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述                                    |
| :------ | :---- | :-------------------------------------- |
| `action`             | String | 请求方法。                                   |
| `uri`                | String | 请求 URL。                |
| `entities`           | Array | 响应实体。        |
| `data`  | Array | 获取的好友列表，例如 "user1", "user2"。 |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `count` | Int   | 好友数量。                              |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/contacts/users' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

### 响应示例

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/contacts/users",
  "entities": [],
  "data": ["user3", "user2"],
  "timestamp": 1543819826513,
  "duration": 12,
  "count": 2
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 获取好友列表的用户 ID 不存在。 | 检查获取好友列表的用户 ID 是否存在。 | 