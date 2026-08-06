# 从聊天室黑名单移除单个用户

## 功能说明

- 从聊天室黑名单中删除单个用户。
- 聊天室黑名单中的用户要想在聊天室中正常发送和接收消息，需要先将用户从黑名单中移除，然后该用户重新加入聊天室。
- 将用户移出到聊天室黑名单，会触发发送后回调，详见 [将成员移出聊天室黑名单事件](callback_group_room_blocklist.html#将成员移出黑名单)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `username` | String | 是       | 要从聊天室黑名单中移除的用户 ID。   |

关于请求 URL 中的其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_blocks",
    "user": "user1",
    "chatroomid": "XXXX"
  },
  "timestamp": 1542540470679,
  "duration": 45,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 字段的说明如下：

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `data` | JSON | 响应数据。 |
| - `result` | Boolean | 用户是否成功从聊天室黑名单中删除。<br/> - `true`：是 <br/> - `false`：否 |
| - `action` | String | 执行的操作。`remove_blocks` 表示将用户从聊天室黑名单中移掉。  |
| - `user`   | String   | 从聊天室黑名单中删除的用户 ID。|
| - `chatroomid`   | String   | 聊天室 ID。|

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
| 400     | invalid_parameter | removeBlacklist: list size more than max limit : 60 | 批量删除超过上限 60。 | 调整要移除的数量在限制以下。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | forbidden_op | users [XX] are not members of this group! | 要移除黑名单的用户 ID 不在聊天室中。 | 传入聊天室黑名单中的成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室不存在。 | 使用合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
