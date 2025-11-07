# 转让聊天室

## 功能说明

- 修改聊天室所有者为同一聊天室中的其他成员。
- 转让聊天室会触发发送后回调，详见 [变更聊天室所有者事件](callback_group_room_owner.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

| 参数          | 类型   | 是否必需 | 描述             |
| :------------ | :----- | :------- | :--------------- |
| `chatroom_id`        | String | 是       | 要转让的聊天室的 ID。                                             |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX85'   \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "newowner": "user2"
   }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型   | 描述                      |
| :--------- | :----- | :------------------------ |
| `newowner` | String | 聊天室新的所有者的用户 ID。 |

## 响应示例

```json
{
  "action": "put",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX85",
  "entities": [],
  "data": {
    "newowner": true
  },
  "timestamp": 1542537813420,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                 | 类型   | 描述   |
| :------------------- | :----- | :------------ |
| `data`               | JSON   | 数据详情。 |
| - `newowner` | Boolean | 操作结果：<br/> - `true`：转让成功。<br/> - `false`：转让失败。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。           |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。|
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 404     | resource_not_found | username XX doesn't exist! | 传入的聊天室新所有者的用户 ID 不存在。 | 传入存在的合法的用户 ID。|
| 403     | forbidden_op     | "new owner and old owner are the same" | 新的聊天室所有者和旧的所有者不能是同一聊天室成员。 | 传入的聊天室新所有者的用户 ID 不能与旧的所有者的用户 ID 相同。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。