# 删除单个好友

## 功能说明

- 从用户的好友列表中删除一个用户，解除这两个用户的好友关系。例如，用户 A 将 用户 B 删除好友后，双方均会从彼此的好友列表消失。
- 调用该接口会触发删除好友的发送后回调事件，详见 [回调事件文档](callback_contact.html#删除好友)。

## HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

### 路径参数

| 参数              | 类型   | 是否必需 | 描述                  |
| :---------------- | :----- | :------- | :-------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `owner_username`  | String | 是       | 删除哪个用户的好友。   |
| `friend_username` | String | 是       | 被删除好友的用户 ID。 |

### 请求 header

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`。 |

## HTTP 响应

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型       | 描述                                                                               |
| :------------------- | :--------- | :------------------------------------------------ |
| `action`             | String | 请求方法。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `entities`           | JSON Array | 被删除的好友的详情。                                                               |
| `entities.uuid`      | String     | 系统内为好友生成的系统内唯一标识，开发者无需关心。                                 |
| `entities.type`      | String     | 对象类型，值为 `user` 或 `group`。                                                 |
| `entities.created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                            |
| `entities.modified`  | Long       | 好友的用户信息如密码或者昵称等最近一次修改时间，Unix 时间戳，单位为毫秒。          |
| `entities.username`  | String     | 被删除好友的用户 ID。                                                              |
| `entities.activated` | Bool       | 好友是否为正常状态：<ul><li>`true` 正常状态。</li><li>`false` 已被封禁。</li></ul> |
| `entities.nickname`  | String     | 好友的用户昵称。                                                                   |
| `timestamp`          | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'
```

### 响应示例

```json
{
  "action": "delete",
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
  "timestamp": 1542599266616,
  "duration": 350,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要删除或被删除好友的用户 ID 不存在。 | 检查要删除和被删除的用户 ID 是否存在。 | 