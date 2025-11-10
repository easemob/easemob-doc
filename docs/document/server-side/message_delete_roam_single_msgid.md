# 根据消息 ID 单向删除单聊漫游消息

## 功能说明

- 根据消息 ID 单向删除指定用户的单聊会话的一条或多条（每次最多 50 条）漫游消息。
- 只能单向删除消息：
  - 该用户的指定漫游消息会从服务器和本地删除，该用户无法在客户端拉取到这些消息。若该会话的全部漫游消息均被删除了，该用户的会话在服务端也会被清除，在客户端拉取会话列表时拉不到该会话。
  - 会话的对端用户不受影响，仍然可以拉取与该用户的漫游消息和会话。
- 调用该接口前，可通过 [获取历史消息记录](message_historical.html) 获取要删除的消息 ID。如果客户使用 [消息回调](callback_overview.html) 功能的话，也可以从自己的服务器上获取，因为消息回调给你的服务器时包含消息 ID。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}?userId={peer_userId}&msgIdList={msgIdList}&isNotify={isNotify}
```

| 参数     | 类型   | 是否必需 | 描述                                |
| :------- | :----- | :------- | :---------------------------------- |
| `userId` | String | 是       | 要删除的单聊漫游消息的所属用户 ID。 |
| `peer_userId` | String | 是    | 单聊会话中的对端用户 ID。     |
| `msgIdList` | String | 是    | 要删除的消息的消息 ID。每次最多可传入 50 个消息 ID，消息 ID 之间以英文逗号分隔，例如 message ID 1,message ID 2。 |
| `isNotify` | Boolean | 否       | 消息删除后，是否同步到消息所属用户的所有在线设备。<br/> - （默认）`true`：是<br/> -  `false`：否 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/chat/user/XXXX?userId=XXXX&msgIdList=XXXX&isNotify=false' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | 返回 `ok` 表示消息成功删除。 |
| `timestamp`          | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。    |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型      | 错误提示                                          | 可能原因            | 处理建议           |
|:---------|:-------------------|:----------------------------------------------|:----------------|:---------------|
| 400      | service open exception  | this appKey not open message roaming   | 消息漫游服务未开通。  | 联系商务开通。  |
| 400      | param exception  | delete msg list limit can not greater than 50 | 一次删除的消息 ID 数量超过限制（50）。 | 减少一次删除的消息 ID 数量。 |
| 400      | Bad Request  | Bad Request    | 缺少必填参数，例如查询参数 `userId` 或 `msgIdList`。 | 校验参数是否传入正确。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。