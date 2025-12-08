# 强制用户下线

## 功能说明

- 强制用户即将用户状态改为离线，用户需要重新登录才能正常使用。
- 用户再次上线可以收到被封禁期间的离线消息。请注意，离线消息默认最长存储 7 天，如果 7 天内客户端都没有上线，服务端将丢弃过期的消息。
- 多设备登录情况下，调用该接口会强制将指定用户从所有登录的设备下线；若将用户从指定设备下线，你可以调用 [强制指定账号从单设备下线](account_offline_device_single.html) 接口。
  
## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/disconnect
```

| 参数       | 类型     | 描述               |
|:---------|:-------|:-----------------|
| `username` | String | 用户 ID。强制将用户下线。|

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/disconnect'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/disconnect",
  "entities": [],
  "data": {
    "result": true
  },
  "timestamp": 1542602601332,
  "duration": 6
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段          | 类型 | 描述                                                            |
| :------------ | :--- | :----------------------------------- |
| `data.result` | Bool | 用户是否已被强制下线：<br/> - `true`：是；<br/> - `false`：否。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。      |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示    | 可能原因    | 处理建议     |
| :---------- | :-------| :------| :---------| :------------------|
| 401   | unauthorized     | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。  |
| 404   | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。    | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
