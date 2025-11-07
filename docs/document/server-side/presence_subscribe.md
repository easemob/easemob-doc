# 批量订阅在线状态

在线状态（Presence）表示用户的当前状态信息。除了环信 IM 内置的在线和离线状态，你还可以添加自定义在线状态，例如忙碌、马上回来、离开、接听电话、外出就餐等。本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态（Presence）订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。

关于用户的在线、离线和自定义状态的定义，详见 [用户在线状态管理](/product/product_user_presence.html)。

## 功能说明

- 一次订阅多个用户的在线状态。
- 订阅用户状态后，若被订阅的用户的在线状态更新，订阅者会收到状态变更通知，例如，用户 A 订阅了用户 B 的在线状态，若用户 B 的状态变更，A 会收到状态变更通知。
- 每次最多可订阅 100 个用户的在线状态。
- 每个用户最多可订阅 3000 个用户的在线状态。
- 每个用户最多可被 3000 个用户订阅。
- 订阅时长最长为 30 天，过期需重新订阅。如果未过期的情况下重复订阅，新设置的有效期会覆盖之前的有效期。

## 功能开通

使用 Presence 功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{expiry}
```

| 参数       | 类型   | 是否必需 | 描述                                                 |
| :--------- | :----- | :------- | :--------------------------------------------------- |
| `username` | String | 是       | 为哪个用户订阅在线状态。                             |
| `expiry`   | String | 是       | 订阅时长，单位为秒，最大值为 `2,592,000`，即 30 天。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/wzy/presence/1000' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"usernames":["c2","c3"]}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求包体为 JSON Object 类型，包含以下字段：

| 字段        | 类型    | 是否必需   | 描述                                                         |
| :---------- | :--------- | :--------------------- | :------- |
| `usernames` | Array | 是  | 被订阅用户的用户 ID 数组，例如 ["user1", "user2"]。该数组最多可包含 100 个用户 ID。      |

## 响应示例

```json
{
"result":[
  {"uid":"",
  "last_time":"1644466063",
  "expiry":"1645500371",
  "ext":"123",
  "status":{"android":"1","android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    },
    {"uid":"c3",
    "last_time":"1645183991",
    "expiry":"1645500371",
    "ext":"",
    "status":{
        "android":"0",
        "android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    }]
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 是否成功批量订阅了多个用户的在线状态。若成功，则返回被订阅用户的在线状态信息，失败则返回相应的错误原因。 |
|  - `uid`       | String     | 被订阅用户在即时通讯服务器的唯一 ID。                              |
|  - `last_time` | Long    | 被订阅用户的最近在线时间，Unix 时间戳，单位为秒。服务端会在被订阅的用户登录和登出时记录该时间。 |
|  - `expiry`    | Long    | 订阅过期的 Unix 时间戳，单位为秒。                                           |
|  - `ext`       | String     | 被订阅用户的在线状态扩展信息。                   |
|  - `status`    | JSON | 被订阅用户在多端的状态：<br> - `0`：离线；<br> - `1`：在线；<br/> - 其他值：用户可设置其他值自定义在线状态。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示    | 可能原因   | 处理建议     |
| :---------- | :--- | :----------- | :----- | :-------------- |
| 400         | illegal_argument       | usernames is empty   | 被订阅用户的用户 ID 数组为空。           | 保证被订阅用户的用户 ID 数组非空值。  |
| 400         | illegal_argument       | too many sub presence   | 被订阅用户的用户列表超过了 100 个用户 ID 限制。    | 控制被订阅用户的用户列表不要超过 100 个用户 ID 限制。 |
| 400         | illegal_argument       | you can't sub yourself  | 被订阅用户的用户列表中包含了自己（被订阅用户列表中包含了请求 URL 路径中的 `username`）。 | 将自己从被订阅用户的用户列表中移除。  |
| 400         | service open exception | the app not open presence  | 没有开通 Presence 服务。                 | 联系商务开通 Presence 服务。    |
| 401         | unauthorized           | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。      | 使用新的 token 访问。           |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。