# 批量添加群组成员

## 功能说明

- 一次为群组添加多个成员。
- 每次最多可以添加 100 位成员。如果所有用户均已是群成员，添加失败，返回错误 403。
- 添加群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 添加群成员会触发发送后回调，详见 [邀请用户入群事件](callback_group_room_join.html#邀请用户入群)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users?need_notify=false
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |
| `need_notify` | Bool   | 否       | 添加群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

关于请求 URL 中的其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users?need_notify=false'   \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
   "usernames": [
     "user4","user5"
   ]
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数        | 类型  | 是否必需 | 描述     |
| :---------- | :---- | :------- | :---------- |
| `usernames` | Array | 是   | 要添加为群组成员的用户 ID 数组，每次最多可传 100 个用户 ID。 |

## 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users",
  "entities": [],
  "data": {
    "newmembers": ["user5", "user4"],
    "groupid": "66XXXX85",
    "action": "add_member"
  },
  "timestamp": 1542365557942,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段              | 类型   | 描述          |
| :---------------- | :----- | :----------------- |
| `data.newmembers` | Array  | 添加的群组成员的用户 ID。   |
| `data.groupid`    | String | 群组 ID。  |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `add_member`，表示添加群成员。 |

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
| 403     | forbidden_op | an not join this group, reason:user: XX already in group: XX\n | 用户已经在群里。 | 不要重复加入。|
| 403     | exceed_limit | user XX has joined too many groups! | 用户可加入的群组数达到上限。 | 退出不用的群组或在 [环信控制台上调用户可加入群组数上限](/product/console/basic_conversation_group_chatroom.html#单个用户可加入群组数上限)。 |
| 403     | exceed_limit | members size is greater than max user size ! | 加入群成员的人数超过最大限制。每次最多可以添加 100 个用户。 | 调整创建群的加群人数。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 404     | resource_not_found | username XX doesn't exist! | 要添加的用户不存在。 | 使用合法的用户，即 `username` 传入存在的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。