# 获取黑名单列表

## 功能说明

分页获取加入黑名单的用户列表。服务器按用户加入黑名单时间的逆序返回，即先返回最新加入黑名单的用户。

## 功能开通

若使用该 API，你需要在环信控制台免费开通黑名单功能。详见 [环信控制台文档](/product/console/basic_user.html#用户黑名单)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users?pageSize={N}&cursor={cursor}
```

| 参数     | 类型   | 是否必需 | 描述                                  |
| :------- | :----- | :------- | :-------------------------- |
| `pageSize`  | Int    | 否       | 每次期望返回的黑名单用户的数量。取值范围为 [1,50]。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。     |
| `owner_username` | String | 是       | 获取哪个用户的黑名单。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/blocks/users?pageSize=2'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

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

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段    | 类型  | 描述         |
| :------ | :---- | :----------------------- |
| `data`  | Array | 获取的黑名单列表，例如 ["user1", "user2"]。 |

其他字段的说明如下：

| 字段    | 类型  | 描述         |
| :------ | :---- | :----------------------- |
| `uri`                | String | 请求 URL。                |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `entities`        | Array | 响应实体。            |
| `cursor`        | String | 下次开始获取数据的游标位置。            |
| `count` | Int   | 获取的黑名单上的用户数量。                        |
| `action`          | String | 请求方法。          |
| `duration`        | Int | 请求响应时间，单位为毫秒。         |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要查询的用户 ID 不存在。 | 检查查询的用户 ID 是否存在。 | 