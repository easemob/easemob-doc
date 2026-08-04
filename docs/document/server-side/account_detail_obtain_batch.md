# 批量获取用户详情

## 功能说明

- 该接口查询多个用户的信息列表，按照用户创建时间顺序返回。
- 你可以指定要查询的用户数量。
- 若数据库中的用户数量大于你要查询的用户数量（`limit`），返回的信息中会携带游标 `cursor` 标示下次数据获取的开始位置。你可以分页获取多个用户的详情，直到返回的信息中不再包含 `cursor`，即已经达到最后一页。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users?limit={N}&cursor={cursor}
```

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `limit`  | Int    | 否       | 请求查询用户的数量。取值范围为 [1,100]，默认值为 10。若实际用户数量超过 100，返回 100 个用户。   |
| `cursor` | String | 否       | 开始获取数据的游标位置，用于分页显示用户列表。第一次发起批量查询用户请求时若不设置 `cursor`，请求成功后会获得最早创建的用户。从响应 body 中获取 `cursor`，并在下一次请求的 URL 中传入该 `cursor`，直到响应 body 中不再有 `cursor` 字段，则表示已查询到 app 中所有用户。 | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例一

按照注册时间的顺序查询 2 个用户的信息列表：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2'   \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>' 
```

使用返回的 cursor 获取下一页：

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX2tB'    \
-H 'Accept: application/json'   \ 
-H 'Authorization: Bearer <YourAppToken>' 
```

## 响应示例一

返回注册时间较早的 2 个用户的信息列表：

```json
{
  "action": "get",
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
    },
    {
      "uuid": "b2aade90-XXXX-XXXX-a974-f3368f82e4f1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542356523769,
      "username": "user2",
      "activated": true,
      "nickname": "user2"
    }
  ],
  "timestamp": 1542558467056,
  "duration": 11,
  "cursor": "LTgzXXXX2tB",
  "count": 2
}
```

## 请求示例二

使用响应示例一中的 `cursor`，继续按照注册时间的顺序查询下一页用户列表，该页面用户数量为 2：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX2tB'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 响应示例二

继续返回 2 个 用户的信息列表：

```json
{
  "action": "get",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "fef7f250-XXXX-XXXX-ba39-0fed7dcc3cdd",
      "type": "user",
      "created": 1542361376245,
      "modified": 1542361376245,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542559337702,
  "cursor": "LTgzXXXX2tB",
  "duration": 2,
  "count": 1
}
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应 body 字段

| 字段   | 类型   | 描述    |
| :-------------------------------------------- | :----- | :------------------------------- |
| `entities`| JSON Array | 响应实体。 |
|  - `uuid`      | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。      |
|  - `type`      | String | 对象类型，无需关注。             |
|  - `created`   | Long   | 注册用户的 Unix 时间戳，单位为毫秒。      |
|  - `modified`  | Long   | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。       |
|  - `username`  | String | 用户 ID。            |
|  - `nickname`  | String | 推送消息时，在消息推送通知栏内显示的昵称。     |
|  - `activated` | Bool   | 用户是否为正常状态：<br/> - `true`：用户为正常状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](account_unban.html)方法解除封禁。 |
|  - `notification_display_style`         | Int    | 消息推送方式：<br/> - `0`：仅通知。推送标题为“您有一条新消息”，推送内容为“请点击查看”；<br/> - `1`：通知以及消息详情。推送标题为“您有一条新消息”，推送内容为发送人昵称和离线消息的内容。<br/>若用户未设置该参数，则响应中不会返回。   |
|  - `notification_no_disturbing`         | Bool   | 是否开启免打扰模式。<br/> - `true`：免打扰开启。若用户未设置改参数，则响应中不返回。<br/> - `false`：代表免打扰关闭。     |
|  - `notification_no_disturbing_start`   | String | 免打扰的开始时间。例如，`8` 代表每日 8:00 开启免打扰。若用户未设该参数，则响应中不返回。     |
|  - `notification_no_disturbing_end`     | String | 免打扰的结束时间。例如，`18` 代表每日 18:00 关闭免打扰。若用户未设该参数，则响应中不返回。  |
|  - `notification_ignore_63112447328257` | Bool   | 是否屏蔽了群组消息的离线推送的设置。数字表示群组 ID。 <br/> -`true`：已屏蔽。 <br/> - `false`：未屏蔽，没有设置则不会返回。   |
|  - `notifier_name`                      | String | 客户端推送证书名称。若用户未设置推送证书名称，则响应中不返回。   |
|  - `device_token`                       | String | 推送 token。若用户没有推送 token，则响应中不返回。   |
| `cursor`                                      | String | 游标，用于分页显示用户列表。<br>第一次发起批量查询用户请求时无需设置 `cursor`，请求成功后，从响应 body 中获取 `cursor`，并在下一次请求的 URL 中传入该 `cursor`，直到响应 body 中不再有 `cursor` 字段，则表示已查询到 app 中所有用户。 |
| `count`                                       | Number | 返回用户数量。      |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型  | 错误提示     | 可能原因     | 处理建议   |
| :---------- | :---------- | :-------------- | :------------- | :--------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth)     | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。|
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。 | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。