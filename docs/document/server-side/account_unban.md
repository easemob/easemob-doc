# 账号解禁

## 功能说明

- 解禁单个用户。
- 用户被封后，不会在一段时间后自动解禁，需调用该 API 解禁。
- 解禁后，用户可正常连接并使用即时通讯服务，再次上线可以收到被封禁期间的离线消息。请注意，离线消息默认最长存储 7 天，如果 7 天内客户端都没有上线，服务端将丢弃过期的消息。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/activate
```

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------- |
| username            | String   | 是 | 要解禁的用户 ID。      |

关于请求 URL 中其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/activate'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "activate user",
  "timestamp": 1542602404132,
  "duration": 9
}
```

## 响应 body 字段

| 字段       | 类型   | 描述        |
| :------------ | :----- | :------------ |
| `action` | String | 执行的操作。在该响应中，该参数的值为 `activate user`，表示解禁用户。 |
| `timestamp` | Number | 响应时间戳。 |
| `duration` | Number | 服务器处理时间。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示      | 可能原因       | 处理建议    |
| :---------- | :---------| :---------------------| :----------| :--------|
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。    |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。    | 检查 `orgName` 和 `appName` 是否正确或 [创建应用](/product/console/app_create.html)。 |
| 404         | service_resource_not_found         | Service resource not found   | 用户不存在。  | 先 [注册用户](account_register_open.html)或者检查用户名是否正确。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。