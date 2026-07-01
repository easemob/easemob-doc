# 获取单个用户加入的消息话题

## 功能说明

- 根据用户 ID 获取该用户加入的所有消息话题。
- 使用该接口前，你需要联系商务开通消息话题功能。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/threads/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

| 参数     | 类型   | 是否必需 | 描述      |
| :------- | :----- | :------- | :------------------ |
| `username`  | Int    | 是       | 用户 ID。获取该用户加入的消息话题。  |
| `limit`  | Int    | 否       | 每次期望返回的消息话题数量，取值范围为 [1,50]，默认值为 `50`。                                                                           |
| `cursor` | String | 否       | 数据查询的起始位置。                                                                                                  |
| `sort`   | String | 否       | 获取的消息话题的排序顺序：<br/> - `asc`：按用户加入消息话题的时间的正序；<br/> - （默认）`desc`：按用户加入消息话题的时间的倒序。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/threads/user/test4   \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 4,
  "entities": [
    {
      "name": "1",
      "owner": "test4",
      "id": "17XXXX69",
      "msgId": "1920",
      "groupId": "17XXXX61",
      "created": 1650856033420
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXzg"
  },
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/threads/user/test4"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                                     |
| :------------------ | :----- | :--------------------------------------- |
| `entities`       | JSON Array | 响应数据。                          |
| - `name`     | String | 消息话题名称。                               |
| - `owner`    | String | 消息话题创建者的用户 ID。                    |
| - `id`       | String | 消息话题 ID。                                |
| - `msgId`    | String | 消息话题的父消息 ID。                        |
| - `groupId`  | String | 消息话题所属群组 ID。                        |
| - `created`  | Long   | 消息话题创建时间，Unix 时间戳。              |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `properties.cursor` | String | 查询游标，指定服务器下次查询的起始位置。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。   | 检查查询参数 `limit` 是否在取值范围（[1,50]）内。   |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 消息话题功能未开通。 | 调用该接口前，你需要联系商务开通消息话题功能。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。