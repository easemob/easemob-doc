# 获取单个用户的详情

## 功能说明

获取单个应用用户的详细信息，包括用户 ID、用户的 UUID、用户注册时间、用户信息最近一次修改时间、用户的推送设置（例如，消息推送方式、是否开启免打扰、免打扰开始和结束时间、推送证书、推送 token、是否屏蔽了群组消息的离线推送设置）等。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :-------------------------- |
| `username`  | String  | 是 | 要获取哪个用户的详情。          |     

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXXX/XXXX/XXXX/users/XXXX'  \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'  
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/XXXX",
  "entities": [
    {
      "uuid": "0ffe2d80-XXXX-XXXX-8d66-279e3e1c214b",
      "type": "user",
      "created": 1542795196504,
      "modified": 1542795196504,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542798985011,
  "duration": 6,
  "count": 1
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段说明如下：

| 字段       | 类型   | 描述        |
| :------------ | :----- | :------------ |
| `entities` | JSON Array | 响应实体。 |
|  - `uuid`      | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。      |
|  - `type`      | String | 对象类型，无需关注。             |
|  - `created`   | Long   | 注册用户的 Unix 时间戳，单位为毫秒。      |
|  - `modified`  | Long   | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。       |
|  - `username`  | String | 用户 ID。            |
|  - `nickname`  | String | 推送消息时，在消息推送通知栏内显示的昵称。     |
|  - `activated` | Bool   | 用户是否为正常状态：<br/> - `true`：用户为正常状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](account_unban.html)方法解除封禁。 |
|  - `notification_display_style`         | Int    | 消息推送方式：<br/> - `0`：仅通知。推送标题为“您有一条新消息”，推送内容为“请点击查看”；<br/> - `1`：通知以及消息详情。推送标题为“您有一条新消息”，推送内容为发送人昵称和离线消息的内容。<br/>若用户未设置该参数，则响应中不返回。 |
|  - `notification_no_disturbing`         | Boolean   | 是否开启免打扰。<br/> - `true`：免打扰开启。若用户未设置该参数，则响应中不返回。<br/> - `false`：免打扰关闭。 |
|  - `notification_no_disturbing_start`   | String | 免打扰的开始时间。例如，“8” 代表每日 8:00 开启免打扰。若用户未设该参数，则响应中不返回。 |
|  - `notification_no_disturbing_end`     | String | 免打扰的结束时间。例如，“18” 代表每日 18:00 关闭免打扰。若用户未设该参数，则响应中不返回。     |
|  - `notification_ignore_63112447328257` | Bool   | 是否屏蔽了群组消息的离线推送的设置。参数中的数字，例如 `63112447328257` 表示群组 ID。 <br/> -`true`：已屏蔽。<br/> - `false`：未屏蔽。若用户未设该参数，则响应中不返回。   |
|  - `notifier_name`                      | String | 客户端推送证书名称。若用户未设置推送证书名称，则响应中不返回。  |
|  - `device_token`                       | String | 推送 token。若用户没有推送 token，则响应中不返回。   |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `action`          | String | 请求方法。                                                                     |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `count`   | Int    | 用户数量。      |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示      | 可能原因      | 处理建议    |
| :---------- | :---------- | :--------- | :----------- | :---------- |
| 401         | unauthorized                       | Unable to authenticate (OAuth)    | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。    |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。   | 检查 `orgName` 和 `appName` 是否正确或[创建应用](https://doc.easemob.com/product/console/app_create.html)。 |
| 404         | service_resource_not_found         | Service resource not found  | 用户不存在。  | 先注册用户或者检查用户名是否正确。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
