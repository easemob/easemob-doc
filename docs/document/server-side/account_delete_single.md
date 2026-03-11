# 删除单个用户

## 功能说明

- 删除单个用户。
- 用户删除时，该用户的好友关系、用户属性、消息、会话等数据在服务端也会被删除。
- 用户删除后，该用户的数据将无法恢复，**请谨慎使用该接口**。
- 如果该用户是群主或者聊天室所有者，系统会同时删除对应的群组和聊天室。**请在操作前进行确认**。

## 调用频率上限

该 API、用户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}
```

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `username`  | Int    | 是       | 要删除的用户。     |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/users/XXXX'    \
-H 'Accept: application/json'     \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "ab90eff0-XXXX-XXXX-9174-8f161649a182",
      "type": "user",
      "created": 1542356511855,
      "modified": 1542356511855,
      "username": "XXXX",
      "activated": true,
      "nickname": "user1"
    }
  ],
  "timestamp": 1542559539776,
  "duration": 39,
  "organization": "XXXX",
  "applicationName": "XXXX"
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
| `action`            | String | 执行的操作。在该响应中，该参数的值为 `delete`，表示删除用户。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型       | 错误提示         | 可能原因       | 处理建议           |
| :---------- | :---------- | :-------------- | :------------- | :--------------- |
| 400         | management     | User with id null does not exist in app XXX      | 用户不存在。  | 先注册用户或者检查用户名是否正确。  |
| 401         | unauthorized   | Unable to authenticate (OAuth)    | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。  |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。  | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |
| 404         | service_resource_not_found         | Service resource not found   | 用户不存在。    | 先注册用户或者检查用户名是否正确。  |
