# 移除单个群组成员

## 功能说明

- 从群中移除单个成员。
- 如果被移除用户不是群成员，将移除失败，并返回错误。移除后，该成员也会被移除其在该群组中加入的消息话题。
- 移除群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 移除群成员会触发发送后回调，详见 [将用户踢出群组事件](callback_group_room_leave.html#被踢)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{username}?need_notify=false
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

查询参数的说明如下表所示：

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 要封禁的群组 ID。 |
| `username` | String | 是       | 要被移除的群成员的用户 ID。            |
| `need_notify` | Bool   | 否       | 添加群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3?need_notify=false'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_member",
    "user": "user3",
    "groupid": "66XXXX85"
  },
  "timestamp": 1542365943067,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段           | 类型   | 描述                                                                     |
| :------------- | :----- | :----------------------------------------------------------------------- |
| `data.result`  | Bool   | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。          |
| `data.groupid` | String | 群组 ID。                                                                |
| `data.action`  | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除群组成员。 |
| `data.user`    | String | 被移除的用户 ID。                                                        |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
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
| 403     | forbidden_op | users [XX] are not members of this group! | 用户不在群组中。 | 传入群组中成员的用户 ID。|
| 403     | forbidden_op | forbidden operation on group owner! | 群主不能被移除。 | 不要将群主移出群组。 |
| 403     | exceed_limit | user XX has joined too many groups! | 用户加入的群组数达到上限。 | 退出不用的群组或在 [环信控制台上调用户可加入群组数上限](/product/console/basic_conversation_group_chatroom.html#单个用户可加入群组数上限)。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。