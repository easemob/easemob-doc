# 查询离线推送设置

## 功能说明

查询用户指定的单聊、群聊或全局的离线推送设置。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org}/{app}/users/{userId}/notification/{chattype}/{key}
```

| 参数       | 类型   | 描述          | 是否必需 |
| :--------- | :----- | :--------------------------------- | :------- |
| `userId` | String | 要查询哪个用户的离线推送设置。传入该用户的用户 ID。    | 是       | 
| `chattype` | String | 对象类型，即会话类型：<br/> - `user`：用户，表示单聊；<br/> - `chatgroup`：群组，表示群聊。 | 是       |
| `key`      | String | 对象名称：<br/> - 单聊时为对端用户的用户 ID；<br/> - 群聊时为群组 ID。                      | 是       |

:::tip
若要查询某个用户的全局离线推送设置，需要将 `userId` 和 `key` 设置为该用户的用户 ID，`chattype` 传入 `user`。
:::

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
// 请将 <YourUserToken> 替换为你的用户 Token
curl -X GET 'https://XXXX/XXXX/XXXX/users/XXXX/notification/chatgroup/XXXX' \
-H 'Authorization: Bearer <YourUserToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/notification/chatgroup/12312312321",
  "timestamp": 1647503749918,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "get",
  "data": {
    "type": "NONE",
    "ignoreDuration": 1647590149924,
    "ignoreInterval": "21:30-08:00"
  },
  "duration": 20,
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数                  | 类型   | 描述                   |
| :-------------------- | :----- | :--------------------- |
| `data`                | JSON   | 离线推送通知的设置。   |
| `data.type`           | String | 离线推送通知方式。     |
| `data.ignoreInterval` | String | 离线推送免打扰时间段。 |
| `data.ignoreDuration` | Long   | 离线推送免打扰时长到期的时间戳。   |

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

## 错误码

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [常见错误码](push_error.html) 了解可能的原因。