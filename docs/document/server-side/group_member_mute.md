# 禁言指定群成员

## 功能说明

- 将一个或多个群成员加入禁言列表，即禁止群成员在一段时间内发言或永久禁言。
- 若禁言一段时间，时间到期，自动解除禁言。若设置为永久禁言，只能 [调用 API 解除禁言](group_member_unmute.html) 。
- 被禁言的用户可以接收和查看群组内其他用户发送的消息，但不能发送消息。
- 一次最多可禁言 100 个群组成员。
- 群成员被禁言后，将无法在群组中发送消息，也无法在该群组下的消息话题中发送消息。
- 群禁言列表上的成员即使其被加入群白名单也不能发言。
- 被禁言用户退出群组之后再进入同一群组，若禁言时间未到期，禁言仍然有效。
- 开启和关闭全员禁言，并不影响群组禁言列表。
- 群成员禁言会触发发送后回调，详见 [群成员禁言事件](callback_group_room_mute.html#将成员加入禁言列表)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute   \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{"usernames":["user1"], "mute_duration":1000}' 
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型  | 是否必需 | 描述                                                       |
| :-------------- | :---- | :------- | :--------------------------------------------------------- |
| `usernames`     | Array | 是       | 要添加到禁言列表的用户 ID 列表，每次最多可添加 100 个。 |
| `mute_duration` | Long  | 是       | 禁言时长，单位为毫秒。例如，传入 `1000`，则禁言在 1 秒后到期。<br/>`0` 表示取消禁言，`-1` 表示永久禁言。      |

## 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute",
  "entities": [],
  "data": [
    {
      "result": true,
      "expire": 1489158589481,
      "user": "user1"
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

| 字段          | 类型   | 描述                                                            |
| :------------ | :----- | :-------------------------------------------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result` | Bool   | 操作结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
|  - `expire` | Long   | 禁言到期的时间。该时间为 Unix 时间戳，单位为毫秒。              |
|  - `user`   | String | 被禁言用户的 ID。                                               |

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
| 403     | forbidden_op | users [XX] are not members of this group! | 要禁言的用户 ID 不在群组中。 | 传入群组中的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | userNames size is more than max limit : 100 | 批量禁言指定群成员数量超过 100 | 控制禁言指定群成员数量在 100 以内。 |
| 403    | forbidden_op   | "forbidden operation on group owner!"   | 无法对群主禁言。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
