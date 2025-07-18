# 添加好友

## 功能说明

- 添加一个好友，好友必须是与当前用户在一个 App Key 下的用户。
- 该接口为双向添加好友，即添加好友后，双方分别会出现在对方的好友列表上。
- 对于免费版即时通讯服务，单个 App Key 下的每个用户的好友数量上限为 100，不同服务版本的 App Key 的该数量上限不同，具体可参考 [IM 套餐包功能详情](/product/product_package_feature.html)。
- 调用该接口会触发添加好友的发送后回调事件，详见 [回调事件文档](callback_contact.html#添加好友)。

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
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username`  | String | 是       | 为哪个用户添加好友。 |
| `friend_username` | String | 是       | 要添加的用户 ID。   |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述                   |
| :-------------- | :----- | :------- | :------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。               |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。           |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

## HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `action`             | String | 请求方法。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `entities`           | JSON Array | 添加的好友的详情。                                                      |
|  - `uuid`      | String     | 系统内为好友生成的系统内唯一标识，开发者无需关心。                      |
|  - `type`      | String     | 对象类型，值为 `user` 或 `group`。                                      |
|  - `created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                 |
|  - `modified`  | Long       | 好友的用户信息如密码或者昵称等最新修改时间，Unix 时间戳，单位为毫秒。   |
|  - `username`  | String     | 添加的好友的用户 ID。                                                   |
|  - `activated` | Bool       | 好友是否为正常状态：<br/> • `true` 正常状态。<br/> • `false` 已被封禁。 |
|  - `nickname`  | String     | 好友的用户昵称。                                                        |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'
```

### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "path": "/users/475XXXXba/contacts",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/contacts",
  "entities": [
    {
      "uuid": "b2aXXXXf1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | user contact number exceed limit | 好友数量达到上限。 | 检查添加的和被添的用户好友数量是否达到上限。 |
| 404     | service_resource_not_found | Service resource not found | 要添加的好友或被添加好友的用户 ID 不存在。 | 检查添加和被添加的用户 ID 是否存在。 | 