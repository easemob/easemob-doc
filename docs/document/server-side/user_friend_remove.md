# 删除单个好友

## 功能说明

- 从用户的好友列表中删除一个用户，解除这两个用户的好友关系。例如，用户 A 将 用户 B 删除好友后，双方均会从彼此的好友列表消失。
- 调用该接口会触发删除好友的发送后回调事件，详见 [回调事件文档](callback_contact.html#删除好友)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

| 参数              | 类型   | 是否必需 | 描述                  |
| :---------------- | :----- | :------- | :-------------------- |
| `owner_username`  | String | 是       | 删除哪个用户的好友。   |
| `friend_username` | String | 是       | 被删除好友的用户 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X DELETE 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 字段

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

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

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `entities` 字段的说明如下：

| 字段                 | 类型       | 描述                                                                               |
| :------------------- | :--------- | :------------------------------------------------ |
| `entities`           | JSON Array | 被删除的好友的详情。                                                               |
| `entities.uuid`      | String     | 系统内为好友生成的系统内唯一标识，开发者无需关心。                                 |
|  - `type`      | String     | 对象类型，值为 `user` 或 `group`。                                                 |
|  - `created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                            |
|  - `modified`  | Long       | 好友的用户信息如密码或者昵称等最近一次修改时间，Unix 时间戳，单位为毫秒。          |
|  - `username`  | String     | 被删除好友的用户 ID。                                                              |
|  - `activated` | Bool       | 好友是否为正常状态：<ul><li>`true` 正常状态。</li><li>`false` 已被封禁。</li></ul> |
|  - `nickname`  | String     | 好友的用户昵称。                                                                   |

响应体中其他字段的说明如下：

| 字段                 | 类型       | 描述       |
| :------------------- | :--------- | :------------------------------------------------ |
| `action`             | String | 响应操作， `delete` 表示删除好友。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `timestamp`          | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `applicationName`    | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要删除或被删除好友的用户 ID 不存在。 | 检查要删除和被删除的用户 ID 是否存在。 | 