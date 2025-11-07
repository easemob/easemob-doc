# 修改聊天室信息

## 功能说明

- 修改指定聊天室的信息。
- 仅支持修改聊天室名称、聊天室描述和聊天室最大成员数。
- 修改聊天室信息会触发发送后回调，详见 [修改聊天室信息的回调事件](callback_group_room_info.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。修改该聊天室的信息。  |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'  \
-H 'Content-Type: application/json'    \
-H 'Accept: application/json'      \
-H 'Authorization: Bearer <YourAppToken>'    \
-d '{
   "name": "testchatroom",
   "description": "test",
   "maxusers": 300
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

你只能修改聊天室名称、聊天室描述和聊天室最大成员数。

| 参数          | 类型   | 是否必需 | 描述        |
| :------------ | :----- | :------- | :------------- |
| `name`        | String | 是       | 聊天室名称，不能超过 128 个字符。     |
| `description` | String | 是       | 聊天室描述，不能超过 512 个字符。     |
| `maxusers`    | Int    | 是       | 聊天室最大成员数（包括聊天室所有者），默认可设置的最大人数为 10,000，如需调整请联系商务。 |

## 响应示例

```json
{
  "data": {
    "description": true,
    "maxusers": true,
    "groupname": true
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含的 `data` 字段如下：

| 字段     | 类型 | 描述          |
| :----------------- | :--- | :---------------- |
| `data`   | JSON | 实际获取的响应数据。                         |
| - `groupname`   | Bool | 聊天室名称是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| - `description` | Bool | 聊天室描述是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| - `maxusers`    | Bool | 聊天室最大成员数（包括聊天室所有者）是否修改成功。<br/> - `true`：是。<br/> `false`：否。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 403     | exceed_limit | title cannot exceed to XXXX| 聊天室名称超限。 | 传入长度在范围以内的聊天室名称。 |
| 403     | exceed_limit | desc cannot exceed to XXXX | 聊天室描述超限。 | 传入长度在范围以内的聊天室描述。 |
| 403     | exceed_limit | maxUsers cannot exceed XXXX | 聊天室最大成员数超限。 | 传入正确的最大成员数。 |
| 400     | invalid_parameter  | "some of [chatroom_id] are not valid fields"  | 修改的群组信息时，传入的参数不支持，例如修改 `chatroom_id`。仅支持修改聊天室名称、聊天室描述和聊天室最大成员数。| 

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。