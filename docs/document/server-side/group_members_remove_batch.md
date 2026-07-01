# 批量移除群组成员

## 功能说明

- 一次移除多名群成员，一次最多可移除 60 个。
- 如果所有被移除用户均不是群成员，将移除失败，并返回错误。移除后，这些成员也会被移除其在该群组中加入的消息话题。
- 移除群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 移除群成员会触发发送后回调，详见 [将用户踢出群组事件](callback_group_room_leave.html#被踢)。
- 被移除的群组成员仍能从服务器拉取到被移除前在群组中发送和接收的消息。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{members}?need_notify=false
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

查询参数的说明如下表所示：

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |
| `members` | String | 是       | 要移除的群成员的用户 ID，用户 ID 之间用英文逗号（","）分隔。建议每次最多传 60 个用户 ID，并且 URL 的长度不超过 4 KB。 |
| `need_notify` | Bool   | 否       | 移除群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/ttXXXX81,user2,user3?need_notify=false'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "9bXXXXf7",
  "uri": "https://XXXX/XXXX/XXXX",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "remove_member",
      "reason": "user ttXXXX81 doesn't exist.",
      "user": "user1",
      "groupid": "14XXXX79"
    },
    {
      "result": true,
      "action": "remove_member",
      "user": "user2",
      "groupid": "14XXXX79"
    },
    {
      "result": true,
      "action": "remove_member",
      "user": "user3",
      "groupid": "14XXXX79"
    }
  ],
  "timestamp": 1433492935318,
  "duration": 84,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段           | 类型   | 描述            |
| :------------- | :----- | :------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result`  | Bool   | 操作结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。          |
|  - `action`  | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除群组成员。 |
|  - `reason`  | String | 操作失败的原因。                                                         |
|  - `user`    | String | 被移除成员的用户 ID。                                                    |
|  - `groupid` | String | 操作的群组 ID。                                                          |

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
| 403     | forbidden_op | users [XX] are not members of this group! | 用户不在群组中。 | 传入群组中成员的用户 ID。 |
| 403     | forbidden_op | forbidden operation on group owner! | 群主不能被移除。 | 无。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | kickMember: kickMembers number more than maxSize : 60 | 批量移除群成员数量超过 60 人。 | 控制批量移除群成员数量在 60 以内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。