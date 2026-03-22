# 查询单个用户 ID 全局禁言

## 功能说明

查询单个用户的单聊、群聊和聊天室的全局禁言详情。

## 开通功能

使用用户全局禁言功能前，你需在环信控制台开通。详见 [环信控制台文档](/product/console/basic_user.html#用户全局禁言)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/mutes/{username}
```

| 参数       | 类型   | 是否必需 | 描述                           |
| :--------- | :----- | :------- | :----------------------------- |
| `username` | String | 是       | 要查询哪个用户的全局禁言详情。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/mutes/zs1' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "path": "/mutes",
  "uri": "https://XXXX/XXXX/XXXX/mutes",
  "timestamp": 1631609831800,
  "organization": "XXXX",
  "application": "357169f0-XXXX-XXXX-9b3a-f1af649cc48d",
  "action": "get",
  "data": {
    "userid": "XXXX#restys_zs1",
    "chat": 96,
    "groupchat": 96,
    "chatroom": 96,
    "unixtime": 1631609831
  },
  "duration": 13,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述      |
| :--------------- | :----- | :------------------ |
| `data`               | JSON   | 用户的全局禁言详情。            |
| `data.userid`    | String | 设置禁言的用户 ID。      |
| `data.chat`      | Int    | 单聊剩余禁言时间，单位为秒。最大值为 `2147483647`。<br/> - > 0：该用户 ID 剩余的单聊禁言时长。<br/> - `0`：该用户的单聊禁言已取消。 <br/> - `-1`：该用户被设置永久单聊禁言。 |
| `data.groupchat` | Int    | 群组剩余禁言时长，单位为秒，规则同单聊禁言。     |
| `data.chatroom`  | Int    | 聊天室剩余禁言时长，单位为秒，规则同单聊禁言。       |
| `data.unixtime`  | Int    | 当前操作的 Unix 时间戳。    |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示        | 可能原因  | 处理建议                         |
| :---------- | :------------------| :-------------------| :-----------| :------------|
| 400         | required_property_not_found        | Entity user requires a property named username     | 用户不存在。 | 先注册用户或者检查用户名是否正确。 |
| 401         | unauthorized      | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。              |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。    | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。|

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。