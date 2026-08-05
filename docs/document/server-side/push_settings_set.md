# 设置离线推送

## 功能说明

你可以设置用户指定的单聊、群聊或全局的离线推送设置。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org}/{app}/users/{userId}/notification/{chattype}/{key}
```

| 参数       | 类型   | 描述          | 是否必需 |
| :--------- | :----- | :--------------------------------- | :------- |
| `userId` | String | 要设置哪个用户的离线推送设置。传入该用户的用户 ID。    | 是       | 
| `chattype` | String | 对象类型，即会话类型：<br/> - `user`：用户，表示单聊；<br/> - `chatgroup`：群组，表示群聊。 | 是       |
| `key`      | String | 对象名称：<br/> - 单聊时为对端用户的用户 ID；<br/> - 群聊时为群组 ID。                      | 是       |

:::tip
若要设置某个用户的全局离线推送设置，需要将 `userId` 和 `key` 设置为该用户的用户 ID，`chattype` 传入 `user`。
:::

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```bash
// 你需要将 <YourUserToken> 替换为你的用户 Token
curl -X PUT 'https://XXXX/XXXX/XXXX/users/XXXX/notification/user/XXXX' \
-H 'Authorization: Bearer <YourUserToken>' \
-H 'Content-Type: application/json' \
-d '{
    "type":"NONE",
    "ignoreInterval":"21:30-08:00",
    "ignoreDuration":86400000
}'
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数             | 类型   | 描述      | 是否必需 |
| :--------------- | :----- | :------------ | :------- |
| `type`           | String | 离线推送通知方式：<br/> - `DEFAULT`：指定的会话采用 app 的设置。该值仅对单聊或群聊会话有效，对 app 级别无效。<br/> - `ALL`：接收全部离线消息的推送通知；<br/> - `AT`：只接收提及当前用户的离线消息的推送通知。该字段推荐在群聊中使用。若提及一个或多个用户，需在创建消息时对 `ext` 字段传 "em_at_list":["user1", "user2" ...]；若提及所有人，对该字段传 "em_at_list":"all"。<br/> - `NONE`：不接收离线消息的推送通知。 <Container type="notice" title="注意">若 app 和指定会话均设置了该参数，则该会话采用自身的设置，其他会话采用 app 的设置。</Container> | 否      |
| `ignoreInterval` | String | 每天触发离线推送免打扰的时间段，精确到分钟，格式为 HH:MM-HH:MM，例如 08:30-10:00。该时间为 24 小时制，免打扰时间段的开始时间和结束时间中的小时数和分钟数的取值范围分别为 [00,23] 和 [00,59]。<br/> 该参数的设置说明如下：<br/> - 该参数仅针对 app 生效，对单聊或群聊不生效。<br/> - 该参数设置后，免打扰模式每天定时触发。例如，开始时间为 `08:00`，结束时间为 `10:00`，免打扰模式在每天的 8:00-10:00 内生效。若你在 11:00 设置开始时间为 `08:00`，结束时间为 `12:00`，则免打扰模式在当天的 11:00-12:00 生效，以后每天均在 8:00-12:00 生效。<br/> - 若开始时间和结束时间相同，则全天免打扰。<br/> - 若结束时间早于开始时间，则免打扰模式在每天的开始时间到次日的结束时间内生效。例如，开始时间为 `10:00`，结束时间为 `08:00`，则免打扰模式的在当天的 10:00 到次日的 8:00 生效。<br/> - 目前仅支持在每天的一个指定时间段内开启免打扰模式，不支持多个免打扰时间段，新的设置会覆盖之前的设置。<br/> - 若不设置该参数，传空字符串。<br/> - 若该参数和 `ignoreDuration` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `ignoreInterval` 设置为 8:00-10:00，`ignoreDuration` 设置为 14400000 毫秒（4 个小时），则 app 在今天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。| 否      |
| `ignoreDuration` | Long   | 离线推送免打扰时长，单位为毫秒。该参数的取值范围为 [0,604800000]，`0` 表示该参数无效，`604800000` 表示免打扰模式持续 7 天。<br/> - 该参数对 app 和单聊和群聊均生效。<br/> - 与 `ignoreInterval` 的设置每天生效不同，该参数为一次有效，设置后立即生效，例如，上午 8:00 将 app 层级的 `ignoreDuration` 设置为 14400000 毫秒（4 个小时），则 app 只在今天 8:00-12:00 处于免打扰模式。<br/> - 若该参数和 `ignoreInterval` 均设置，免打扰模式当日在这两个时间段均生效，例如，上午 8:00 将 app 级的 `ignoreInterval` 设置为 8:00-10:00，`ignoreDuration` 设置为 14400000 毫秒（4 个小时），则 app 在今天 8:00-12:00 和以后每天 8:00-10:00 处于免打扰模式。 | 否      |

## 响应示例

```json
{
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/notification/user/XXXX",
  "timestamp": 1647503749918,
  "organization": "hx",
  "application": "17fe201b-XXXX-XXXX-XXXX-1ed1ebd7b227",
  "action": "put",
  "data": {
    "type": "NONE",
    "ignoreDuration": 1647590149924,
    "ignoreInterval": "21:30-08:00"
  },
  "duration": 20,
  "applicationName": "hxdemo"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数                  | 类型   | 描述                   |
| :-------------------- | :----- | :--------------------- |
| `data`                | JSON   | 离线推送的设置。       |
| - `type`           | String | 离线推送通知方式。     |
| - `ignoreInterval` | String | 离线推送免打扰时间段。 |
| - `ignoreDuration` | Long   | 离线推送免打扰时长。   |

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