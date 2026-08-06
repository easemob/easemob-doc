# 批量添加用户至聊天室黑名单

## 功能说明

- 将多个用户添加到聊天室黑名单。
- 每次最多可添加 60 位用户到聊天室黑名单。
- 一旦添加到聊天室黑名单，用户将无法再加入聊天室，无法查看该聊天室的信息，无法再收发消息。
- 用户加入黑名单后，若要恢复在聊天室中正常收发消息，需要先手动将其移出黑名单，然后该用户重新加入聊天室。
- 聊天室所有者不能被添加到聊天室黑名单。
- 将用户添加到聊天室黑名单，会触发发送后回调，详见 [成员加入聊天室黑名单事件](callback_group_room_blocklist.html#将成员加入黑名单)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `username` | String | 是       | 要加入聊天室黑名单的用户 ID，最多可传 60 个，用户 ID 之间以英文逗号（","）分隔。   |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{  
   "usernames": [  
     "user3","user4"  
   ]  
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `usernames` | Array | 要添加到聊天室黑名单的用户名数组。每次最多可以指定 60 个用户名，以逗号（,）分隔。 |

## 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "uri": "http://XXXX/XXXX/XXXX/chatrooms/XXXX/blocks/users",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "add_blocks",
      "reason": "user: user3 doesn't exist in chatroom: XXXX",
      "user": "user3",
      "chatroomid": "XXXX"
    },
    {
      "result": true,
      "action": "add_blocks",
      "user": "user4",
      "chatroomid": "XXXX"
    }
  ],
  "timestamp": 1542540095540,
  "duration": 16,
  "organization": "XXXX",
  "applicationName": "XXXX"
}

```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中的 `data` 字段包含如下参数。

响应中如果 `result` 参数为 `true` 表示该用户添加成功，为 `false` 表示该用户添加失败，失败原因查请看 `reason` 参数。

| 参数 | 类型   | 描述     |
| :------ | :----- | :--------- |
| `data` | JSON | 响应数据。 |
|  - `result` | Boolean | 用户是否成功添加至聊天室黑名单。<br/> - `true`： 是<br/> - `false`：否 |
|  - `action`     | String | 执行的操作。在该响应中，该字段的值为 `add_blocks`，表示将用户加入聊天室黑名单。 |
|  - `reason` | String   | 用户无法加入聊天室黑名单的原因。    |
|  - `user`   | String   | 成功添加到聊天室黑名单的用户 ID。    |
|  - `chatroomid` | String | 聊天室 ID。                                                                                |

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

| HTTP 状态码 | 错误类型           | 错误提示        | 可能原因                              | 处理建议                     |
| :---------- | :---------- | :---------------------------------------- | :------------------------------------ | :--------------------------- |
| 400         | invalid_parameter  | userNames is more than max limit : 100     | 批量添加的用户数超过了上限 100。       | 调整要添加的数量在限制以下。 |
| 401         | unauthorized       | Unable to authenticate (OAuth)            | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。        |
| 403         | forbidden_op       | users [XX] are not members of this group! | 要添加黑名单的用户 ID 不在聊天室中。    | 使用聊天室成员的用户 ID。      |
| 404         | resource_not_found | grpID XX does not exist!                  | 聊天室不存在。                          | 使用合法的聊天室 ID。            |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
