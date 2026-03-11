# 移除单个聊天室成员

## 功能说明

- 从聊天室移除一个成员。
- 如果被移除用户不在聊天室中或聊天室不存在，将返回错误。
- 移除聊天室成员会触发发送后回调，详见 [聊天室成员移除事件](callback_group_room_leave.html#被踢)。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `username` | String | 是 | 要移除的用户 ID。|

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1'     \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_member",
    "user": "user1",
    "id": "66XXXX33"
  },
  "timestamp": 1542555744726,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数          | 类型   | 描述                           |
| :------------ | :----- | :------------------------------------- |
| `data` | JSON   | 响应数据。          |
| - `result` | Bool   | 是否成功移出聊天室成员：<br/> - `true`：是；<br/> - `false`：否。          |
| - `action` | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除聊天室成员。 |
| - `user`   | String | 用户 ID。                                                                  |
| - `id`     | String | 聊天室 ID。                                                                |

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
| 400     | forbidden_op | users [XX] are not members of this group! | 用户不在聊天室中。 | 传入聊天室中成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 404     | resource_not_found | username XXX doesn't exist! | 要删除的用户 ID 不存在。 | 传入聊天室中成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。