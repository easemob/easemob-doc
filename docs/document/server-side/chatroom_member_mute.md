# 禁言聊天室成员

## 功能说明

- 将单个或多个聊天室成员加入聊天室禁言列表，即禁止聊天室成员在一段时间内发言或永久禁言。
- 若禁言一段时间，时间到期，自动解除禁言。若设置为永久禁言，只能 [调用 API 解除禁言](chatroom_member_unmute.html) 。
- 被禁言的用户可以接收和查看聊天室内其他用户发送的消息，但不能发送消息。
- 你一次最多可禁言 100 个成员。
- 用户被禁言后，将无法在聊天室中发送消息。
- 聊天室禁言列表上的成员即使加入了聊天室白名单也无法在聊天室中发送消息。
- 开启和关闭全员禁言，并不影响聊天室禁言列表。
- 被禁言用户退出聊天室之后再进入同一聊天室，若禁言时间未到期，禁言仍然有效。
- 聊天室成员禁言会触发发送后回调，详见 [聊天室成员禁言事件](callback_group_room_mute.html#将成员加入禁言列表)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/mute
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |

关于请求 URL 中其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute'   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "usernames": [
        "user1",
        "user2"
    ],
    "mute_duration": 1000
    }'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :----------------- |
| `mute_duration` | Long   | 是       | 禁言时长，单位为毫秒。例如，传入 `1000`，则禁言在 1 秒后到期。<br/>`0` 表示取消禁言，`-1` 表示永久禁言。 |
| `usernames`     | Array | 是       | 要被禁言的用户 ID，一次最多可传 100 个。                                           |

## 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute",
  "entities": [],
  "data": [
    {
      "result": true,
      "expire": 1642148173726,
      "user": "user1"
    },
    {
      "result": true,
      "expire": 1642148173726,
      "user": "user2"
    }
  ],
  "timestamp": 1489072189508,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述           |
| :------------ | :----- | :------------------- |
| `data` | JSON Array | 响应数据。 |
|  - `result` | Bool   | 是否成功禁言用户：<br/> - `true`：是；<br/> - `false`：否。 |
|  - `expire` | Long   | 禁言到期时间，Unix 时间戳，单位为毫秒。                     |
|  - `user`   | String | 被禁言的用户 ID。                                           |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400     | forbidden_op | users [XX] are not members of this group! | 要禁言的用户 ID 不在聊天室中。 | 传入聊天室中的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室不存在。 | 使用合法的聊天室 ID。 |
| 400     | invalid_parameter | userNames size is more than max limit : 100 | 批量禁言指定聊天室成员数量超过 100 | 控制禁言指定聊天室成员数量在 100 以内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。