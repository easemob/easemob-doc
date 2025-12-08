# 批量获取在线状态信息

## 功能说明

一次最多可获取 100 个用户的在线状态信息。

:::tip
默认情况下，若用户在 1 秒内进行多次登录和登出，服务器以最后一次操作为准向客户端 SDK 发送状态变更通知。
:::

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence
```

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `username` | String | 是       | 获取该用户 ID 订阅的在线状态。若传入的用户 ID 不存在或未订阅其他用户的在线状态，返回空列表。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/wzy/presence' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-d '{"usernames":["c2","c3"]}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求包体为 JSON Object 类型，仅支持以下字段：

| 参数        | 类型  | 是否必需 | 描述                                                       |
| :---------- | :---- | :------- | :----------------------------------------------------------- |
| `usernames` | JSON Array | 是    | 需要获取其在线状态的用户列表，例如 `["user1", "user2"]`，最多可传 100 个用户 ID。 |

## 响应示例

```json
{
  "result":[
    {"uid":"c2",
    "last_time":"1644466063",
    "ext":"",
    "status":{"android":"0"}
    },
    {"uid":"c3",
    "last_time":"1644475330",
    "ext":"",
    "status":{
      "android":"0",
      "android":"0"}
    }
  ]
 }
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 是否成功批量获取用户的在线状态信息。若成功获取，返回被订阅用户的在线状态信息，失败则返回相应的错误原因。 |
|  - `uid`       | String     | 用户在即时通讯服务器的唯一 ID。                              |
|  - `last_time` | Long       | 用户的最近在线时间，Unix 时间戳，单位为秒。                                           |
|  - `ext`       | String     | 用户的在线状态扩展信息。                 |
|  - `status`    | JSON | 用户在多个设备上的在线状态：<br/> - `0`： 离线。<br/> - `1`： 在线。<br/> - 其他值：用户自定义的在线状态。                                            |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示 | 可能原因                | 处理建议|  
| :---------- | :--- | :----------- | :-------- | :-------------- |
| 400         | illegal_argument       | too many get presences        | 获取在线状态用户列表超过了 100 个用户 ID 限制。 | 控制获取在线状态用户列表不超过 100 个用户 ID。 |
| 400         | service open exception | the app not open presence      | 没有开通 presence 服务。  | 联系商务开通 presence 服务。    |
| 401         | unauthorized           | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。   | 使用新的 token 访问。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。