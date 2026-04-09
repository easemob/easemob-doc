# 批量添加用户至群组黑名单

## 功能说明

- 将多个用户添加至群组黑名单，一次最多可以添加 100 个用户。
- 群主无法被加入群组的黑名单。
- 用户进入群组黑名单后，会被移出群组，无法查看该群组的信息，无法再收发群消息，只有先被移出黑名单才能重新加入群组。
- 用户加入黑名单会触发发送后回调，详见 [成员加入群黑名单事件](callback_group_room_blocklist.html#将成员加入黑名单)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/blocks/users
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users'   \
-H 'Content-Type: application/json'    \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'    \
-d '{
   "usernames": [
     "user3","user4"
   ]
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数        | 类型  | 是否必需 | 描述                               |
| :---------- | :---- | :------- | :--------------------------------- |
| `usernames` | Array | 是       | 要添加至群组黑名单的用户 ID 数组，每次最多可传 100 个用户 ID。 |

## 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/blocks/users",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "add_blocks",
      "reason": "user: user3 doesn't exist in group: 66XXXX85",
      "user": "user3",
      "groupid": "66XXXX85"
    },
    {
      "result": true,
      "action": "add_blocks",
      "user": "user4",
      "groupid": "66XXXX85"
    }
  ],
  "timestamp": 1542540095540,
  "duration": 16,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述        |
| :------------- | :----- | :-------------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result`  | Bool   | 添加结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。                 |
|  - `action`  | String | 执行的操作。在该响应中，该字段的值为 `add_blocks`，表示将群成员加入群组黑名单。 |
|  - `reason`  | String | 添加失败的原因。                                                                |
|  - `user`    | String | 添加的用户 ID。                                                                 |
|  - `groupid` | String | 群组 ID。                                                                       |

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | userNames is more than max limit : 100 | 批量添加的用户数超过了上限 100。 | 调整要移除的数量在限制以下。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。|
| 403     | forbidden_op | users [XX] are not members of this group! | 要添加黑名单的用户 ID 不在群组中。 | 使用群组成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。