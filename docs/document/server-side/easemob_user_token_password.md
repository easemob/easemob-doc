# 通过用户 ID 和密码获取用户 token

用户注册后，使用 “用户 ID” 和 “密码” 登录。登录成功后，你的 App Server 会为客户端提供一个用户 token。

这种方式**已废弃**，请 [通过用户 ID 获取用户 Token](easemob_user_token.html#通过用户-id-获取用户-token) 或 [使用动态用户 Token](easemob_user_token.html#生成动态的用户-token)，推荐前者。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/token'    \
-H 'Content-Type: application/json'    \
-H 'Accept: application/json'   \
-d '{
   "grant_type": "password",
   "username": "C",
   "password": "1",
   "ttl": "1024000"
 }' 
```

## 请求 header 参数

关于 `Content-Type` 和 `Accept` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数         | 类型   | 是否必需 | 描述 |
| :----------- | :----- | :------- | :------------------- |
| `grant_type` | String | 是       | 授权方式。将值设为 `password`，通过用户 ID 和密码获取 token，需设置 `username` 和 `password` 参数。 |
| `username`   | String | 是       | 用户 ID。                |
| `password`   | String | 是       | 用户的登录密码。   |
| `ttl`        | Long   | 否       | token 有效期，单位为秒。<br/> - 若传入该参数，token 有效期以传入的值为准。<br/> - 若不传该参数，以 [环信控制台](https://console.easemob.com/user/login/)的 **用户管理** 页面的 token 有效期的设置为准。<br/> - 若设置为 `0`，则 token 永久有效。<br/>注意：VIP 5 集群该参数单位为毫秒。 |

## 响应示例

```json
{
    "access_token": "YWMtrR6ECkz8EeyXXXXj1eX9kbsMrFep3U6BvVj7KSnNonWqRx7gTPwR7Kzl-Q_xISNOAwMAAAF9UPZqbQAPoAAtYK9fWgaTNyuWoB3-6nGf_TXBx3Nt3XRZST-elU0x2A",
    "expires_in": 1024000,
    "user": {
        "uuid": "aa471ee0-XXXX-XXXX-ace5-f90ff121234e",
        "type": "user",
        "created": 1637740861395,
        "modified": 1637740861395,
        "username": "c",
        "activated": true
    }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                               |
| :-------------- | :----- | :---------------- |
| `access_token`  | String | 有效的用户 token。                                     |
| `expires_in`    | Long   | token 有效期，单位为秒。在有效期内无需重复获取。<br/> 注意：VIP 5 集群该参数单位为毫秒。 |
| `user`          | JSON   | 用户相关信息。                                             |
| `user.uuid`    | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成用户 token。   |
| `user.type`    | String | 对象类型，无需关注。       |
| `user.created`  | Long  | 注册用户的 Unix 时间戳，单位为毫秒。            |
| `user.modified`  | Long  | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。          |
| `user.username`  | String | 用户 ID。                                                       |
| `user.activated` | Bool  | 用户是否为活跃状态：<br/> - `true`：用户为活跃状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户的 API](/document/server-side/account_unban.html)对账号解除封禁。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考[响应状态码](/document/server-side/error.html)了解可能的原因。
