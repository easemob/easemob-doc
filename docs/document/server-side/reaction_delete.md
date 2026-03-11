# 删除 Reaction

消息表情回复（“Reaction”）指用户在单聊和群聊场景中对单条消息回复表情，可丰富用户聊天时的互动方式。

## 功能说明

- 删除当前用户添加的单个 Reaction。
- 目前，**Reaction 仅适用于单聊和群组。聊天室暂不支持 Reaction 功能。**
- 关于 Reaction 的详细使用限制，详见 [产品使用限制](limitation.html) 文档。

## 功能开通

要使用 Reaction 功能，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_message.html#消息表情回复)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/reaction/user/{userId}?msgId={msgId}&message={message}
```

| 参数      | 类型   | 是否必需 | 描述                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `userId`  | String | 是       | 当前用户的用户 ID。 |
| `msgId`   | String | 是       | 消息 ID。                                                      |
| `message` | String | 是       | 表情 ID。长度不可超过 128 个字符。该参数的值必须与客户端一致。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -g -X DELETE 'https://localhost:8089/easemob-demo/easeim/reaction/user/wz?msgId=997625372793113144&message=emoji_40'    \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 描述                                      |
| :------------------ | :----- | :---------------------------------------- |
| `requestStatusCode` | String | 操作结果。`ok` 表示成功删除 Reaction。    |
| `timestamp`         | Long   | 请求响应的时间，Unix 时间戳，单位为毫秒。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因                     | 处理建议        |
| :----------- | :--- | :------------- |:-------------------------|:------------|
| 400     | Bad Request   | the user operation is illegal!        | 传入的用户 ID 没有操作过该 Reaction。 | 传入正确的用户 ID。 |
| 400      | Bad Request  | this appKey is not open reaction service!   | Reaction 服务未开通。 | 请在环信控制台开通 Reaction 服务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。