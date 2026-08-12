# 批量授权注册用户

## 功能说明

- 批量注册为授权注册方式，服务端需要校验有效的 App Token 权限才能进行操作。
- 单次请求最多可注册 60 个用户 ID。
- 注册用户时，需满足用户 ID 和密码的设置要求。

## 设置授权注册

要使用授权注册方式，你需要在环信控制台进行如下配置：

在环信控制台的 **应用管理** 页面点击目标应用的 **操作** 一栏中的 **管理**，然后选择 **功能配置 > 基础功能** > **用户**，将 **用户注册模式** 设置为**授权注册**。

## 调用频率上限

该 API、用户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例一

注册 2 个用户：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H "Authorization: Bearer <YourAppToken>" -i  "https://XXXX/XXXX/XXXX/users" -d '[{"username":"user1", "password":"123"}, {"username":"user2", "password":"456"}]'
```

## 响应示例一

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
      "type": "user",
      "created": 1541587920710,
      "modified": 1541587920710,
      "username": "user1",
      "activated": true
    },
    {
      "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
      "type": "user",
      "created": 1541587920712,
      "modified": 1541587920712,
      "username": "user2",
      "activated": true
    }
  ],
  "timestamp": 1541587920714,
  "data": [],
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 请求示例二

当请求 body 中存在已经注册过的用户 user 3 时，user 3 注册失败并在响应 body 中的 `data` 数组内返回，用户 user 1、user 2 仍然注册成功。

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -i  "https://XXXX/XXXX/XXXX/users"  \
-H "Authorization: Bearer <YourAppToken>"  \
-d '[
      {"username":"user1", "password":"123"}, 
      {"username":"user2", "password":"456"}, 
      {"username":"user3", "password":"789"}
  ]'
```

## 响应示例二

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/testapp/users",
  "entities": [
    {
      "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
      "type": "user",
      "created": 1541587920710,
      "modified": 1541587920710,
      "username": "user1",
      "activated": true
    },
    {
      "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
      "type": "user",
      "created": 1541587920712,
      "modified": 1541587920712,
      "username": "user2",
      "activated": true
    }
  ],
  "timestamp": 1541587920714,
  "data": [
    {
      "username": "user3",
      "registerUserFailReason": "the user3 already exists"
    }
  ],
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :----------------------------- |
| `username` | String | 是       | 用户 ID，长度不可超过 64 个字节。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 10 个数字 0-9；<br/>- "\_", "-", "."。 <br/><Container type="notice" title="注意"><br/>- 请勿使用大写英文字母 A-Z。若你同时使用了大写字母和小写字母，响应中返回的用户 ID 只包含小写字母。<br/>- 请确保同一个 app 下，用户 ID 唯一；<br/>- 用户 ID 为公开信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。</Container> |
| `password` | String | 是       | 用户的登录密码，长度不可超过 64 个字符。      |

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `entities` 字段如下：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `entities`        | JSON Array | 响应实体。                                                   |
| - `uuid`          | String     | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。 |
| - `type`          | String     | 对象类型，无需关注。                                         |
| - `created`       | Long       | 注册用户的 Unix 时间戳，单位为毫秒。                         |
| - `modified`      | Long       | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。             |
| - `username`      | String     | 用户 ID。                                                    |
| - `activated`     | Bool       | 用户是否为正常状态： - `true`：用户为正常状态。 - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](account_unban.html)方法解除封禁。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示      | 可能原因   | 处理建议       |
| :----- | :----------- | :----| :-------| :---------------|
| 400         | illegal_argument                   | username XXX is not legal  | 用户名不合法。| 查看注册用户名 [规范](account_register_open.html)。 |
| 400         | illegal_argument                   | USERNAME_TOO_LONG    | 用户长度超过限制。 | 查看注册用户名 [规范](account_register_open.html)。 |
| 400         | illegal_argument                   | password or pin must provided  | 注册用户请求 body 中没有提供 `password` 参数。  | 注册用户请求 body 中提供 `password`。  |
| 400         | illegal_argument                   | NICKNAME_TOO_LONG    | 注册用户的推送昵称长度超过限制。  | 查看注册用户名 [规范](account_register_open.html)。 |
| 400         | duplicate_unique_property_exists   | Application XXX Entity user requires that property named username be unique, value of XXX exists | 注册用户名已经存在。  | 更换用户名重新注册。  |
| 400         | duplicate_unique_property_exists   | the same user XXX has a different password, the passwords are XXX | 注册用户时，请求 body 中存在 `username` 相同但密码不同的情况。 | 对相同的 `username` 进行修改重新注册。    |
| 400         | illegal_argument                   | username [XXX] is not legal    | 注册用户的 `username` 不合法。 | 请按照用户名的规范进行注册用户。 |
| 400         | illegal_argument                   | USERNAME_TOO_LONG      | 注册用户的 `username` 长度超限。| 请按照用户名的规范进行注册用户。 |
| 400         | illegal_argument                   | password or pin must provided       | 注册用户时没有提供密码。 | 请为用户提供密码在进行注册。|
| 400         | illegal_argument                   | NICKNAME_TOO_LONG       | 注册用户的 `nickname` 长度超限。 | 请按照用户推送昵称的规范进行注册用户。 |
| 400         | illegal_argument                   | Request body array size[XXX] had almost reached or been greater than the upper range value[XXX] | 可注册的用户数量超过限制。  | 请更改注册用户的数量。  |
| 401         | unauthorized                       | token is illegal.     | token 不合法，生成 token 使用信息与请求携带的信息不匹配。  | 使用新的 token 访问。 |
| 401         | unauthorized                       | Unable to authenticate (OAuth)     | token 不合法，可能过期或 token 错误。  | 使用新的 token 访问。  |
| 401         | unauthorized                       | Open registration doesn't allow, so register user need token, | 授权注册模式，注册用户时需要 token。  | 请求时携带 token。 |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。 | 检查 `orgName` 和 `appName` 是否正确或 [创建应用](/product/console/app_create.html)。 |
| 429         | resource_limited                   | You have exceeded the limit of the community edition,Please upgrade to the enterprise edition | 注册用户的数量超过当前产品套餐版本的限制。 | 免费套餐包最多支持 100 个注册用户。你可以 [升级至付费套餐包](/product/pricing_method.html#订阅-升级套餐包)。专业版和旗舰版对注册用户数量无限制。 |
