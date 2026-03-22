# 单向清空指定用户的漫游消息

## 功能说明

- 清空单个用户当前时间及之前的所有漫游消息。
- 单向删除消息：
  - 调用该接口后，该用户的漫游消息会从服务器和本地清空，该用户无法从服务端拉取到漫游消息，而且该用户的所有会话也会被清除，也拉不到会话列表。
  - 会话中的其他用户不受影响，仍然可以拉取与该用户的漫游消息和会话。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/rest/message/roaming/user/{userId}/delete/all
```

| 参数     | 类型   | 是否必需 | 描述                         |
| :------- | :----- | :------- | :--------------------------- |
| `userId` | String | 是       | 要清空该用户 ID 的漫游消息。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/rest/message/roaming/user/XXXX/delete/all' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
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
| `requestStatusCode`      | String | 操作结果，返回 `ok` 表示该用户的漫游消息清除成功。 |
| `timestamp`          | Long | HTTP 响应的 Unix 时间戳，单位为毫秒。|

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示       | 可能原因    | 处理建议       |
|:---------|:-----------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | 消息漫游服务未开通。 | 联系商务开通。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。