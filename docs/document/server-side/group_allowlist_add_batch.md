# 批量添加用户至群组白名单

## 功能说明

- 添加多个用户至群组白名单。
- 一次最多可添加 100 个用户。
- 群主和管理员默认会被加入群组白名单。
- 群组全员禁言时，群组白名单中的成员仍可以在群组中发送消息。
- 添加用户至群组白名单会触发发送后回调，详见 [群成员加入白名单事件](callback_group_room_allowlist.html#将成员加入白名单)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/white/users
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/{groupid}/white/users'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{"usernames" : ["user1"]}' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数        | 类型  | 描述           |
| :---------- | :---- | :----------------- |
| `usernames` | Array | 待添加至群组白名单中的用户 ID 数组，每次最多可传 100 个用户 ID。 |

## 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/12XXXX53/white/users",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzy_test",
      "groupid": "12XXXX53"
    },
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzXXXXzu",
      "groupid": "12XXXX53"
    }
  ],
  "timestamp": 1594724634191,
  "duration": 2,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段           | 类型   | 描述                                                                                |
| :------------- | :----- | :--------------- |
| `data` | JSON Array | 响应数据。|
|  - `result`  | Bool   | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。                     |
|  - `action`  | String | 执行的操作。在该响应中，该字段的值为 `add_user_whitelist`，表示将成员加入群白名单。 |
|  - `user`    | String | 添加的用户 ID。                                                                     |
|  - `groupid` | String | 群组 ID。                                                                           |
|  - `reason`  | String | 添加失败的原因。                                                                    |

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
| 400     | invalid_parameter | usernames size is more than max limit : 100 | 批量添加白名单的群成员超过了上限 100。 | 调整要添加的数量在限制（100）以下。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | forbidden_op | users [XX] are not members of this group! | 要添加白名单的用户 ID 不在群组中。 | 传入群组成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。