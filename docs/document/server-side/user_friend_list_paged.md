# 分页获取好友列表

## 功能说明

- 分页获取指定用户的好友列表。服务器按照添加好友时间的倒序返回，先返回最近添加的好友。
- 获取好友列表时，你可以选择是否需要返回好友备注。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/user/{username}/contacts?limit={N}&cursor={cursor}&needReturnRemark={true/false}
```

| 参数      | 类型      | 是否必需 | 描述                                               |
|:--------|:--------|:-----|:-------------------------------------------------|
| `username`  | String | 是       | 要获取哪个用户的好友列表。  |
| `limit` | Int     | 否    | 每次期望返回的好友的数量。取值范围为 [1,50]。该参数仅在分页获取时为必需，默认为 `10`。 |
| `cursor` | String  | 否    | 数据查询的起始位置。该参数仅在分页获取时为必需。第一次调用该接口不传 `cursor`，获取 `limit` 指定的好友数量。| 
| `needReturnRemark` | Boolean | 否    | 是否需要返回好友备注：<br/> - `true`：返回；<br/> - （默认）`false`：不返回。|

## 请求示例

```shell
curl -L -X GET 'https://XXXX/XXXX/XXXX/user/XXXX/contacts?limit=10&needReturnRemark=true' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer  <YourAppToken>'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "uri": "http://XXXX/XXXX/XXXX/users/XXXX/rostersByPage",  
  "timestamp": 1706238297509,
  "entities": [],
  "count": 1,
  "action": "get",
  "data": {
    "contacts": [
      {
        "remark": null,
        "username": "username"
      }
    ]
  },
  "duration": 27
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段                       | 类型     | 描述             |
|:-------------------------|:-------|:---------------|
| `data`                   | Object | 返回的好友列表对象。     |
| `data.contacts`          | Array  | 返回的好友列表数据。      |
| `data.contacts.remark`   | String | 好友备注。           |
| `data.contacts.username` | String | 好友的用户 ID。 |

其他字段的说明如下：

| 字段                       | 类型     | 描述             |
|:-------------------------|:-------|:---------------|
| `uri`             | String | 请求 URL。              |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。     |
| `entities`           | Array | 响应实体。        |
| `count`                  | Int    | 当前页的好友数量。     | 
| `action`             | String | 请求方法。                                   |
| `duration`        | String | 请求响应时间，单位为毫秒。      |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

| HTTP 状态码 | 错误类型 | 错误提示          | 可能原因                               | 处理建议                 |
|:---------| :--- | :------------- |:-----------------------------------|:---------------------|
| 401      | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。       |
| 404      | service_resource_not_found | Service resource not found | 获取好友列表的用户 ID 不存在。   | 检查获取好友列表的用户 ID 是否存在。 |
| 400      | illegal_argument | getContacts | page size more than max limit : 50 | 传入的每页好友数 `limit` 超过 50。 | 下调 `limit` 参数的值。 | 