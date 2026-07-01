# 获取消息话题成员列表

## 功能说明

- 获取指定消息话题的成员列表。
- 使用该接口前，你需要联系商务开通消息话题功能。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/thread/{thread_id}/users?limit={N}&cursor={cursor}
```

| 参数     | 类型   | 是否必需 | 描述           |
| :------- | :----- | :------- | :-------------------------- |
| `thread_id` | String | 是       | 消息话题 ID。 |
| `limit`  | Int    | 否       | 每次期望返回的消息话题成员数量，取值范围为 [1,50]，默认值为  `50`。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。                            |

关于请求 URL 中其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/thread/1XXXX7/users   \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

## 响应示例

```json
{
  "action": "get",
  "data": {
    "affiliations": ["test4"]
  },
  "duration": 4,
  "properties": {
    "cursor": "ZGNXXXXyMA"
  },
  "timestamp": 1650872048366,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中 `data` 字段的说明如下：

| 字段                | 类型   | 描述                               |
| :------------------ | :----- | :--------------------------------- |
| `affiliations`      | Array  | 消息话题成员的用户 ID 列表。           |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `properties.cursor` | String | 查询游标，指定下次查询的起始位置。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。 | 检查查询参数 `limit` 是否在取值范围内。  |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. |  消息话题功能未开通。 | 调用该接口前，你需要联系商务开通消息话题功能。 |
| 404     | group_error | thread not found. | 消息话题不存在。 | 输入正确的消息话题 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。