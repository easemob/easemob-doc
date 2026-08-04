# 批量删除用户

## 功能说明

- 该 API 用于 **删除你在集成了即时通讯 IM 后上线前的测试阶段创建的用户**。
- 建议一次删除的用户数量不要超过 100。
- 该 API 只指定了要删除的用户数量，**并未指定要删除的具体用户**，你可以在响应中查看删除的用户。
- 如果删除的多个用户中包含群主或聊天室所有者，**对应的群组或聊天室会解散**。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/users?limit={N}&cursor={cursor}
```

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `limit`  | Int    | 否       | 要删除的用户的数量。取值范围为 [1,100]，默认值为 `10`。      |
| `cursor` | String | 否       | 开始删除用户的游标位置。第一次批量删除时若不设置 `cursor`，请求成功后会从最先创建的用户开始删除 `limit` 指定的用户数量。从响应 body 中获取 `cursor`，并在下一次请求的 URL 中传入该 `cursor`，直到响应 body 中不再有 `cursor` 字段，则表示已完全删除 app 中的所有用户。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/users?limit=2'  \
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
  "uri": "https://XXXX/XXXX/testapp/users",
  "entities": [
    {
      "uuid": "b2aade90-XXXX-XXXX-a974-f3368f82e4f1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    },
    {
      "uuid": "b98ad170-XXXX-XXXX-XXXX-7f76daa76557",
      "type": "user",
      "created": 1542356535303,
      "modified": 1542356535303,
      "username": "user3",
      "activated": true,
      "nickname": "user3"
    }
  ],
  "timestamp": 1542867197779,
  "duration": 504,
  "organization": "XXXX",
  "applicationName": "testapp",
  "cursor": "LTgXXXXDNR"
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
|  - `activated` | Bool   | 用户是否为正常状态：<br/> - `true`：用户为正常状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](account_unban.html)方法解除封禁。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 执行的操作。 `delete` 表示删除用户操。                                                                  |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `cursor` | String | 下次请求时的数据起始位置。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型 | 错误提示     | 可能原因         | 处理建议   |
| :---------- | :----------- | :------------ | :---------- | :---------------- |
| 401         | unauthorized   | Unable to authenticate (OAuth)  | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。  |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。  | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |