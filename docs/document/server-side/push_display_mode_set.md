# 设置离线推送通知的展示方式

## 功能说明

- 设置离线推送通知在客户端的展示方式，设置即时生效。
- 服务端根据设置的展示方式向用户推送离线消息。
  
## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{userId}
```

| 参数       | 类型   | 描述   | 是否必需 | 
| :--------- | :----- | :------- | :------------------ |
| `userId` | String | 要设置哪个用户的推送通知的展示方式。传入该用户的用户 ID。   | 是       | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
curl -X PUT https://XXXX/XXXX/XXXX/users/XXXX   \
-H 'Content-Type: application/json'  \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{"notification_display_style": "1"}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求包体为 JSON Object 类型，包含以下字段：

| 参数                         | 类型 | 描述             | 是否必需 |
| :--------------------------- | :--- | :--------------------------------- | :------- |
| `notification_display_style` | Int  | 离线推送通知的展示方式：<ul><li>（默认）`0`：推送标题为“您有一条新消息”，推送内容为“请点击查看”；</li><li>`1`：推送标题为“您有一条新消息”，推送内容为发送人昵称和离线消息的内容。</li></ul> | 是       |

## 响应示例

```json
{
  "action": "put",
  "application": "17d59e50-XXXX-XXXX-XXXX-0dc80c0f5e99",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/XXXX",
  "entities": [
    {
      "uuid": "3b8c9890-XXXX-XXXX-XXXX-f50bf55cafad",
      "type": "user",
      "created": 1530276298905,
      "modified": 1534407146060,
      "username": "user1",
      "activated": true,
      "notification_display_style": 1,
      "nickname": "testuser",
      "notifier_name": "2882303761517426801"
    }
  ],
  "timestamp": 1534407146058,
  "duration": 3,
  "organization": "1112171214115068",
  "applicationName": "testapp"
}
```

## 响应 body 字段

| 参数      | 类型    | 描述   |
| :-------------------- | :------ | :------------------------------------------------ |
| `entities`                            | JSON Array   | 用户的离线推送通知的展示方式以及相关信息。        |
|  - `uuid`                             | String  | 用户的 UUID。系统为该请求中的 app 或用户生成的唯一内部标识，用于生成用户权限 token。   |
|  - `type`                             | String  | 用户类型，即 `user`。     |
|  - `created`                          | Long    | 用户创建的 Unix 时间戳，单位为毫秒。            |
|  - `modified`                         | Long    | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。      |
|  - `username`                         | String  | 用户 ID。用户登录的唯一账号。      |
|  - `activated`                        | Boolean | 用户是否为活跃状态：<ul><li>`true`：用户为活跃状态。</li><li>`false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户](/document/server-side/account_unban.html)解除封禁。</li></ul> |
|  - `notification_display_style`       | Int     | 离线推送通知的展示方式。      |
|  - `nickname`                         | String  | 离线推送通知收到时显示的昵称。    |
|  - `notifier_name`                    | String  | 推送证书名称。   |

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