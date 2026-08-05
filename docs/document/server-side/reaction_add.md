# 添加 Reaction

消息表情回复（“Reaction”）指用户在单聊和群聊场景中对单条消息回复表情，可丰富用户聊天时的互动方式。

## 功能说明

- 在单聊或群聊场景中对单条消息添加 Reaction。
- 目前，**Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。**
- 添加 Reaction 会触发发送后回调，详见 [发送后回调事件](callback_group_room_create.html)。
- 关于 Reaction 的详细使用限制，详见 [产品使用限制](limitation.html) 文档。

## 功能开通

要使用 Reaction 功能，需在 [环信控制台](https://console.easemob.com/user/login) 开通。具体操作步骤详见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/reaction/user/{userId}
```

| 参数     | 类型   | 是否必需 | 描述                      |
| :------- | :----- | :------- | :------------------------ |
| `userId` | String | 是       | 添加 Reaction 的用户 ID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -g -X POST 'https://localhost:8089/easemob-demo/easeim/reaction/user/e1'    \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type: application/json'   \
-d '{
    "msgId":"997625372793113144",
    "message":"emoji_40"
}'
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数      | 类型   | 是否必需<div style="width: 80px;"></div> | 描述     |
| :-------- | :----- | :--------------------------------------- | :-------------- |
| `msgId`   | String | 是                                       | 消息 ID。 |
| `message` | String | 是                                       | 表情 ID。长度不能超过 128 个字符，必须与客户端的设置一致。该参数对支持的字符集类型没有限制，若使用特殊字符，获取和删除 Reaction 时需对特殊字符进行 URL 编码。 |

## 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181,
  "data": {
    "id": "946481033434607420",
    "msgId": "msg3333",
    "msgType": "chat",
    "groupId": null,
    "reaction": "emoji_40",
    "createdAt": "2022-02-24T10:57:43.138934Z",
    "updatedAt": "2022-02-24T10:57:43.138939Z"
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型    | 描述                                                                                              |
| :------------------ | :------ | :------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String  | 操作结果，`ok` 表示成功添加 Reaction。                                                      |
| `timestamp`         | Long    | 请求响应的时间，Unix 时间戳，单位为毫秒。                                                         |
| `data`              | JSON    | 添加的 Reaction 的详情。                                                                          |
| `data.id`           | String  | Reaction ID。                                                                                     |
| `data.msgId`        | String  | 添加 Reaction 的消息 ID。                                                                         |
| `data.msgType`      | String  | 消息的会话类型：<br/> - `chat`：单聊；<br/> - `groupchat`：群聊。                                 |
| `data.groupId`      | String  | 群组 ID。该参数在单聊时为 null。                                                                  |
| `data.reaction`     | String  | 表情 ID，与客户端一致，与[添加 Reaction API](#添加-reaction)的请求参数 `message` 相同。 |
| `data.createAt`     | Instant | Reaction 的添加时间。                                                                            |
| `data.updateAt`     | Instant | Reaction 的修改时间。                                                                             |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示      | 可能原因      | 处理建议        |
|:---------|:--------------------|:-----------|:----------|:------------|
| 400      | Bad Request         | this appKey is not open reaction service!   | Reaction 功能未开通。 | 请在环信控制台开通 Reaction 服务。 |
| 400      | Bad Request         | The quantity has exceeded the limit!  | 一条消息上的 Reaction 数量达到上限。| 每条消息默认可添加 20 个 Reaction。若需提升该上限，需联系环信商务。|
| 400      | Bad Request                | the user operation is illegal!                      | 不是会话双方。 | 只有会话双方才能操作 Reaction。       |
| 400      | Bad Request                | the user is already operation this message                      | 同一个用户重复添加相同的 Reaction。 | 同一用户不能重复添加相同的 Reaction。     |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。