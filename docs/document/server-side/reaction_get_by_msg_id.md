# 根据消息 ID 获取 Reaction

消息表情回复（“Reaction”）指用户在单聊和群聊场景中对单条消息回复表情，可丰富用户聊天时的互动方式。目前，**Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。**

## 功能说明

- 该方法根据单聊或群聊中的消息 ID 获取单条或多条消息的 Reaction 信息，包括 Reaction ID、使用的表情 ID、以及使用该 Reaction 的用户 ID 及用户人数。
- 获取的 Reaction 的用户列表只展示最早三个添加 Reaction 的用户。
- 关于 Reaction 的详细使用限制，详见 [产品使用限制](limitation.html) 文档。

## 功能开通

要使用 Reaction 功能，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}?msgIdList={N,M}&msgType={msgType}&groupId={groupId}
```

| 参数        | 类型   | 是否必需 | 描述                                                                                 |
| :---------- | :----- | :------- | :----------------------------------------------------------------------------------- |
| `userId` | String | 是       | 当前用户的用户 ID。 |
| `msgIdList` | Array  | 是       | 需要查询的消息 ID 列表，最多可传 20 个消息 ID。                                      |
| `msgType`   | String | 是       | 消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊。                    |
| `groupId`   | String | 否       | 群组 ID。如果 `msgType` 设置为 `groupchat`，即拉取群中的 Reaction，必须指定群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

- 获取单条消息的 Reaction：

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/XXXX?msgIdList=msgId1&msgType=chat'    \
-H 'Authorization: Bearer <YourAppToken>'
```

- 获取多条消息的 Reaction：

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/XXXX?msgIdList=msgId1,msgId2&msgType=chat'    \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

以下示例为获取两条消息的 Reaction 信息：

```json
{
    "requestStatusCode": "ok",
    "timestamp": 1645774821181,
    "data": [
        {
            "msgId": "msg123",
            "reactionList": [
                {
                    "reactionId": "944330310986837168",
                    "reaction": "message123456",
                    "count": 3,
                    "state": false,
                    "userList": [
                        "test123",
                        "test456",
                        "test1"
                    ]
                }
            ]
        },
        {
            "msgId": "msg1234",
            "reactionList": [
                {
                    "reactionId": "945272584050659838",
                    "reaction": "message123456",
                    "count": 1,
                    "state": false,
                    "userList": [
                        "test5"
                    ]
                }
            ]
        }
    ]
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                           | 类型       | 描述                                                                                                    |
| :----------------------------- | :--------- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode`            | String     | 接口相应 code 状态。`OK` 表示操作成功。                                                                 |
| `timestamp`                    | Long       | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                               |
| `data`                         | JSON Array | 单条消息添加的 Reaction 的详情。                                                                        |
| `data.msgId`                   | String     | Reaction 对应的消息 ID。                                                                                |
| `data.reactionList`            | JSON Array | 单条消息的 Reaction 列表。                                                                              |
| `data.reactionList.reactionId` | String     | Reaction ID。                                                                                           |
| `data.reactionList.reaction`   | String     | 表情 ID，与客户端一致。该参数与[添加 Reaction API](reaction_add.html)的请求参数 `message` 相同。 |
| `data.reactionList.count`      | Int        | 添加该 Reaction 的用户人数。                                                                            |
| `data.reactionList.state`      | Bool       | 当前请求用户是否添加过该 Reaction： <br/> - `true`: 是； <br/> - `false`：否。                          |
| `data.reactionList.userList`   | Array      | 添加 Reaction 的用户 ID 列表。只返回最早操作 Reaction 的三个用户的 ID。                                 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型 | 错误提示          | 可能原因            | 处理建议        |
|:---------| :--- | :------------- |:-----------------------------------|:------------|
| 400      | Bad Request          | msgIdList exceeds the maximum number limit   | 单次传入的消息 ID 超过了数量限制。  | 减少单次传入的消息 ID。最多可传 20 个消息 ID。 |
| 400      | Bad Request          | groupId can not be null!        | 群组聊天时（即 `msgType` 为 `groupchat`），群组 ID 参数（`groupId`）设置为了 `null`。 | 请传入群组 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。