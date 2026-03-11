# 一次性获取好友列表

## 功能说明

- 服务器按照好友添加时间的倒序返回。
- 一次最多获取用户的 3000 个好友。
- 若用户的好友数量超过 3000，建议使用 [分页获取好友列表的接口](user_friend_list_paged.html)。
- 拉取的好友列表中只包括好友的用户 ID，不包括好友的任何用户资料。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users
```

| 参数             | 类型   | 是否必需 | 描述                      |
| :--------------- | :----- | :------- | :------------------------ |
| `owner_username` | String | 是       | 好友列表所有者的用户 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/contacts/users' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

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

## 响应 body 字段

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

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 获取好友列表的用户 ID 不存在。 | 检查获取好友列表的用户 ID 是否存在。 | 