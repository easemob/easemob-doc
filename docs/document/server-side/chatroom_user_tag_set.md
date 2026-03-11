# 设置用户在聊天室中的标签

## 功能说明

- 设置用户在聊天室中的标签，一次最多设置 10 个。
- 新设置的标签会覆盖原有标签。

## 开通功能

环信即时通讯 IM 支持设置用户在聊天室中的标签，并按标签用户禁言。要使用该 API，需联系环信商务开通。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}/tag 
```

| 参数            | 类型   | 描述                   | 是否必填 |
| :-------------- | :----- | :--------------------- | :------- |
| `chatroom_id`  | String | 聊天室 ID。     | 是       |
| `username` | String | 用户 ID。为该用户添加在聊天室中的标签。 | 是       |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "tags": ["t1", "t2"]
}
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数   | 类型  | 是否必需 | 描述                                                         |
| :----- | :---- | :------- | :----------------------------------------------------------- |
| `tags` | Array | 是       | 设置用户在聊天室中的标签列表。最多可设置 10 个标签。传 "tags":[] 会删除用户的聊天室标签。 |

## 响应示例

```json
{
  "action": "put",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag",
  "entities":[],
  "data": {
    "result": true
  },
  "timestamp": 1489072189508,
  "properties":{},
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含的 `data` 字段如下：

| 字段          | 类型 | 描述                                                    |
| :------------ | :--- | :------------------------------------------------------ |
| `data` | JSON| 响应数据。 |
| - `result` | Bool | 是否修改成功：<br/> - `true`：是；<br/> - `false`：否。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `properties`      | String | 响应属性。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示         | 可能原因           | 处理建议                                   |
| :---------- | :----------------- | :---------------- | :-------------------- | :------------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth)            | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。   |
| 400         | forbidden_op       | users [XX] are not members of this group! | 用户 ID 不在聊天室中。                | 传入聊天室中的用户 ID。  |
| 404         | resource_not_found | grpID XX does not exist!                  | 聊天室不存在。                        | 使用合法的聊天室 ID。  |
| 403         | forbidden_op       | Group tag mute is disabled                | 聊天室标签禁言功能没有开通。          | 联系环信商务开通聊天室标签禁言功能。       |
| 403         | exceed_limit       | user group tag count exceed limit | 用户聊天室标签设置的数量超过限制。    | 控制一次请求 `tags` 的标签个数不要超过限制（10 个）。 |
| 400         | invalid_parameter  | tags should be type of List               | 请求 body 中 `tags` 的类型错误。   | 请求 body 中的 `tags` 请使用数组类型 。|
| 403 | exceed_limit | tag length exceeds limit! | 标签名称长度超过限制。 | 控制标签名称长度不要超过32字符。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。