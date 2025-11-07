# 设置离线推送时显示的昵称

## 功能说明

设置离线推送时显示的昵称。

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{userId}
```

| 参数       | 类型   | 描述   | 是否必需 | 
| :--------- | :----- | :------- | :------------------ |
| `userId` | String | 要设置哪个用户的推送显示昵称。传入该用户的用户 ID。    | 是       | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
curl -X PUT https://XXXX/XXXX/XXXX/users/XXXX  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{ "nickname": "testuser"   }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求包体为 JSON Object 类型，包含以下字段：

| 参数       | 类型   | 描述         | 是否必需 |
| :--------- | :----- | :------------------- | :------- |
| `nickname` | String | 离线推送时在接收方的客户端推送通知栏中显示的发送方的昵称。你可以自定义该昵称，长度不能超过 100 个字符。<br/>支持以下字符集：<br/> - 26 个小写英文字母 a-z；<br/> - 26 个大写英文字母 A-Z；<br/> - 10 个数字 0-9；<br/> - 中文；<br/> - 特殊字符。<br/><Container type="tip" title="提示">1. 若不设置昵称，推送时会显示发送方的用户 ID，而非昵称。<br/>2. 该昵称可与用户属性中的昵称设置不同，不过我们建议这两种昵称的设置保持一致。因此，修改其中一个昵称时，也需调用相应方法对另一个进行更新，确保设置一致。更新用户属性中的昵称的方法，详见 [设置用户属性](user_attribute_set.html)。</Container>| 否       |

## 响应示例

```json
{
  "action": "put",
  "application": "8be024f0-XXXX-XXXX-XXXX-5d598d5f8402",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/XXXX",
  "entities": [
    {
      "uuid": "4759aa70-XXXX-XXXX-XXXX-6fa0510823ba",
      "type": "user",
      "created": 1542595573399,
      "modified": 1542596083687,
      "username": "user1",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542596083685,
  "duration": 6,
  "organization": "agora-demo",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型    | 描述      |
| :------------------- | :------ | :-------------- |
| `entities`           | JSON Array  | 用户在推送通知中显示的昵称以及用户相关信息。     |
|  - `uuid`      | String  | 用户的 UUID。系统为该请求中的 app 或用户生成的唯一内部标识，用于生成用户权限 token。      |
|  - `type`      | String  | 用户类型，即 `user`。 |
|  - `created`   | Number  | 用户注册的 Unix 时间戳，单位为毫秒。       |
|  - `modified`  | Number  | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。      |
|  - `username`  | String  | 用户 ID。用户登录的唯一账号。         |
|  - `activated` | Boolean | 用户是否为活跃状态：<ul><li>`true`：用户为活跃状态。</li><li>`false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](account_unban.html)解除封禁。</li></ul> |
|  - `nickname`  | String  | 推送通知中显示的昵称。 |

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

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。