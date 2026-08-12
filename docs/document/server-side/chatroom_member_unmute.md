# 解除聊天室禁言成员

## 功能说明

- 将单个或多个聊天室成员移出聊天室禁言列表。
- 一次最多可对 60 个成员解除禁言。
- 解除禁言后，该成员可以正常在聊天室中发送消息。
- 解除聊天室成员禁言会触发发送后回调，详见 [解除聊天室成员禁言事件](callback_group_room_mute.html#将成员移出禁言列表)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/mute/{member1}(,{member2},…)
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `member1` | String | 是       | 待被移出禁言列表的聊天室成员的用户 ID。<br/>一次最多可传 60 个用户 ID，用户 ID 之间用英文逗号（","）隔开，逗号在 URL 中转义为 "%2C"。 |

关于请求 URL 中其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute/user1  \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute/user1",
  "entities": [],
  "data": [
    {
      "result": true,
      "user": "user1"
    }
  ],
  "timestamp": 1489072695859,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型    | 描述                                                                       |
| :------------ | :------ | :------------------------------------------------------------------------- |
| `data` | JSON Array | 响应数据。 |
|  - `result` | Boolean | 是否成功将指定用户移出禁言列表：<br/> - `true`：是； <br/> - `false`：否。 |
|  - `user`   | String  | 被解除禁言的聊天室成员的用户 ID。                                          |

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
| 400     | invalid_parameter | removeMute member size more than max limit :  60 | 批量移除禁言超过上限（60）。 | 调整要移除的数量在限制（60）以下. |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室不存在。 | 使用合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
