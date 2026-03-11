# 删除用户的所有好友

## 功能说明

- 删除用户的所有好友。
- 该接口为双向删除好友，即该接口调用后，该当前用户以及被删除的好友在彼此的好友列表中都会删除。
- 若当前用户为好友设置了好友备注，调用该接口后，好友备注会从服务端删除。
- 该接口不影响黑名单。若有些用户被当前用户加入了黑名单，调用该接口后，这些用户仍在黑名单中。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/contacts/users/{username}
```

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `username`  | String | 是         | 用户 ID。要删除该用户 ID 的所有好友。               |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/contacts/users/XXXX' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/contacts/users/XXXX",
  "uri": "https://XXXX/XXXX/XXXX/contacts/users/XXXX",
  "entities": [],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `action`             | String | 响应操作， `delete` 表示删除好友。                                   |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`                | String | 请求 URL。                |
| `entities`           | Array  | 响应实体。     |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `applicationName`    | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401  | unauthorized | Unable to authenticate (OAuth) | Token 不合法，可能过期或 Token 错误。 | 使用新的 Token 访问。 |
| 429 | reach_limit | This request has reached api limit. | 接口调用超过频率限制。 | 联系商务调整限流或者控制调用速率。 |
| 403   | forbidden_service_operation | Service operation not allowed | app 或用户被封禁。 | 先解禁 app 或用户后再调用该接口。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

