# 添加用户至黑名单

## 功能说明

- 将一个或多个用户添加到黑名单。
- 用户黑名单服务限制用户之间通过客户端发送单聊消息。
- 用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。
- 每个用户的黑名单人数上限为 500。
- 好友被加入黑名单后仍在好友列表上显示。
- 调用该接口会触发拉黑好友的发送后回调事件，详见 [回调事件文档](callback_contact.html#拉黑好友)。

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
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users
```

### 路径参数

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username` | String | 是       | 添加到哪个用户的黑名单。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述   |
| :-------------- | :----- | :------- | :------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

### 请求 body

| 参数        | 类型  | 是否必需 | 描述                                             |
| :---------- | :---- | :------- | :----------------------------------------------- |
| `usernames` | Array | 是       | 要加入黑名单的用户 ID，例如 ["user1", "user2"]。 |

## HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                    |
| :----- | :---- | :---------------------- |
| `action`             | String | 请求方法。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `uri`                | String | 请求 URL。                |
| `entities`           | Array | 响应实体。                                                      |
| `data` | Array | 添加至黑名单的用户 ID。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | String | 请求响应时间，单位为毫秒。                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "usernames": [
     "user2"
   ]
 }' 'https://XXXX/XXXX/XXXX/users/user1/blocks/users'
```

### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "uri": "https://XXXX.com/XXXX/testapp",
  "entities": [],
  "data": ["user2"],
  "timestamp": 1542600372046,
  "duration": 11,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要添加或被添加的用户 ID 不存在。 | 检查添加和被添加的用户 ID 是否存在。 | 