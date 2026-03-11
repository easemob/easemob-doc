# 封禁用户

## 功能说明

- 封禁单个用户。封禁操作即刻生效。
- 用户被封禁后，不会在一段时间后自动解禁，只能调用 [解禁用户 API](account_unban.html) 解禁。
- 用户被封禁后，会立即下线并无法登录进入环信即时通讯 IM，直到被解禁后才能恢复登录。
- 被封禁期间，其他用户可向被封禁用户发送消息，但被封禁用户无法接收消息，无法收到推送通知。解禁后，用户可正常连接并使用即时通讯服务，再次上线可以收到被封禁期间的离线消息。请注意，离线消息默认最长存储 7 天，如果 7 天内客户端都没有上线，服务端将丢弃过期的消息。
- 该功能常用于对异常用户的即时处理场景。
- 若用户在线，封禁后会导致用户被踢下线。

## 调用频率上限

该 API、用户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/deactivate
```

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------- |
| username            | String   | 是 | 要封禁的用户 ID。      |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/deactivate'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "Deactivate user",
  "entities": [
    {
      "uuid": "4759aa70-XXXX-XXXX-925f-6fa0510823ba",
      "type": "user",
      "created": 1542595573399,
      "modified": 1542597578147,
      "username": "user1",
      "activated": false,
      "nickname": "user"
    }
  ],
  "timestamp": 1542602157258,
  "duration": 12
}

```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `entities` 字段如下：

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `entities`           | JSON Array | 响应实体。          |
|  - `uuid`      | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。      |
|  - `type`      | String | 对象类型，无需关注。             |
|  - `created`   | Long   | 注册用户的 Unix 时间戳，单位为毫秒。      |
|  - `modified`  | Long   | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。       |
|  - `username`  | String | 用户 ID。            |
|  - `nickname`  | String | 推送消息时，在消息推送通知栏内显示的昵称。     |
|  - `activated` | Bool   | 用户是否为正常状态：<br/> - `true`：用户为正常状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户，你需要调用[解禁用户](account_unban.html)方法解除封禁。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`            | String | 执行的操作。在该响应中，该参数的值为 `Deactivate user`，表示封禁用户。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型      | 错误提示     | 可能原因       | 处理建议      |
| :---------- | :------------------| :-------------------| :------------------| :-------------|
| 401         | unauthorized     | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。    | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |
| 404         | service_resource_not_found         | Service resource not found   | 用户不存在。  | 先[注册用户](account_register_open.html)或者检查用户名是否正确。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。