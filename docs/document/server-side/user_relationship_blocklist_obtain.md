# 获取黑名单列表

## 功能说明

分页获取加入黑名单的用户列表。服务器按用户加入黑名单时间的逆序返回，即先返回最新加入黑名单的用户。

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
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users?pageSize={N}&cursor={cursor}
```

### 路径参数

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username` | String | 是       | 获取哪个用户的黑名单。 |

### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                  |
| :------- | :----- | :------- | :-------------------------- |
| `pageSize`  | Int    | 否       | 每次期望返回的黑名单用户的数量。取值范围为 [1,50]。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。     |

### 请求 header

| 参数   | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :---------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

### HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述         |
| :------ | :---- | :----------------------- |
| `uri`                | String | 请求 URL。                |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `entities`        | Array | 响应实体。            |
| `cursor`        | String | 下次开始获取数据的游标位置。            |
| `count` | Int   | 获取的黑名单上的用户数量。                        |
| `action`          | String | 请求方法。          |
| `data`  | Array | 获取的黑名单列表，例如 ["user1", "user2"]。 |
| `duration`        | Int | 请求响应时间，单位为毫秒。         |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/blocks/users?pageSize=2'
```

### 响应示例

```json
{
    "uri": "https://XXXX/XXXX/XXXX/users/XXXX/blocks/users",
    "timestamp": 1682064422108,
    "entities": [],
    "cursor": "MTA5OTAwMzMwNDUzNTA2ODY1NA==",
    "count": 2,
    "action": "get",
    "data": [
        "tst05",
        "tst04"
    ],
    "duration": 52
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要查询的用户 ID 不存在。 | 检查查询的用户 ID 是否存在。 | 