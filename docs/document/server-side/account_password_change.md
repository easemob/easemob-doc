# 修改用户密码

## 功能说明

- 修改用户的登录密码，不需要提供原密码。
- 设置的新密码的长度不可超过 64 个字符。
- 若用户在线，修改密码后会导致用户被踢下线。
- 修改密码后，用户原来的密码和用户 Token 失效，对客户端设备影响如下：
  - 对于在线设备，修改密码会导致这些设备被踢下线。需要使用新密码或重新获取 Token 登录。
  - 对于离线设备，用户上线时会提示鉴权失败，需要使用新密码或重新获取 Token 登录。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/password
```

| 参数            | 类型   | 是否必需 | 描述              |
| :-------------- | :----- | :------- | :---------------------------------------------- |
| `username`  | String | 是       | 修改该用户 ID 的登录密码。      |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/password'   \
-H 'Accept: application/json'    \
-H 'Content-Type: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'    \
-d '{
      "newpassword":"newPassword"
    }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `newpassword`  | String | 是       | 新密码。密码长度至少为 6 个字符。   |

## 响应示例

```json
{
  "action": "set user password",
  "timestamp": 1542595598924,
  "duration": 8
}
```

## 响应 body 字段

| 字段       | 类型   | 描述        |
| :------------ | :----- | :------------ |
| `action` | String | 响应操作。`set user password` 表示修改用户密码操作。 |
| `timestamp` | Number | HTTP 响应的 Unix 时间戳，单位为毫秒。 |
| `duration` | Number | 从发送 HTTP 请求到响应的时长, 单位为毫秒。  |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示   | 可能原因    | 处理建议     |
| :---------- | :--------------- | :------------- | :------------ | :-----|
| 401         | unauthorized    | Unable to authenticate (OAuth)    | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。  |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。   | 检查 `orgName` 和 `appName` 是否正确或 [创建应用](/product/console/app_create.html)。 |
| 404         | entity_not_found  | User null not found    | 用户不存在。  | 先注册用户或者检查用户名是否正确。    |
| 400         | illegal_argument  | "newpassword is required"   | 修改用户密码的请求体未提供 `newpassword` 属性。 |   |