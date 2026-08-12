# 根据消息 ID 和表情 ID 获取 Reaction 信息

消息表情回复（“Reaction”）指用户在单聊和群聊场景中对单条消息回复表情，可丰富用户聊天时的互动方式。目前，**Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。**

## 功能说明

- 该 API 根据指定的消息的 ID 和表情 ID 获取对应的 Reaction 信息，包括使用了该 Reaction 的用户 ID 及用户人数。
- 关于 Reaction 的详细使用限制，详见 [产品使用限制](limitation.html) 文档。

## 功能开通

要使用 Reaction 功能，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}/detail?msgId={msgId}&message={message}&limit={limit}&cursor={cursor}
```

| 参数      | 类型   | 是否必需 | 描述                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `userId` | String | 是       | 当前用户的用户 ID。 |
| `msgId`   | String | 是       | 消息 ID。                                                      |
| `message` | String | 是       | 表情 ID。长度不可超过 128 个字符。该参数的值必须与客户端一致。 |
| `limit`   | Int    | 否       | 每页显示添加 Reaction 的用户数量。取值范围为 [1,50]，默认值为 `50`。   |
| `cursor`  | String | 否       | 查询游标，指定数据查询的起始位置，分页获取时使用。             |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

:::tip

分页获取时，服务器按用户 Reaction 添加时间的正序返回。若 `limit` 和 `cursor` 均不传值，服务器返回最早添加 Reaction 的 50 个用户。

:::

## 请求示例

- 请求第一页

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&limit=50'   \
-H 'Authorization: Bearer <YourAppToken>'
```

- 请求第 N 页

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&cursor=944330529971449164&limit=50'   \
-H 'Authorization: Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645776986146,
  "data": {
    "reactionId": "946463470818405943",
    "reaction": "message123456",
    "count": 1,
    "state": true,
    "userList": ["wz1"],
    "cursor": "946463471296555192"
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 描述                                                                                                    |
| :------------------ | :----- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String | 操作结果，`ok` 表示成功获取 Reaction 信息。                                                             |
| `timestamp`         | Long   | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                               |
| `data`              | JSON   | 消息添加的 Reaction 的详情。                                                                            |
| `data.reactionId`   | String | Reaction ID。                                                                                           |
| `data.reaction`     | String | 表情 ID，与客户端一致。该参数与 [添加 Reaction API](reaction_add.html) 的请求参数 `message` 相同。 |
| `data.count`        | Int    | 添加该 Reaction 的用户人数。                                                                            |
| `data.state`        | Bool   | 当前请求用户是否添加过该 Reaction。 <br/> - `true`：是；<br/> - `false`：否。                           |
| `data.userList`     | Array  | 按 Reaction 添加时间正序返回的用户 ID 列表。                           |
| `data.cursor`       | String | 查询游标，指定下次查询的起始位置。                                                                      |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因           | 处理建议       |
| :----------- | :--- | :------------- |:---------------|:-----------|
| 400     | Bad Request    | Limit exceeds the maximum quantity limit    | 传入的 `limit` 超过单次限制（50）。 | 传入的 `limit` 值需在 [1,50] 范围内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。