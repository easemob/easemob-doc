# 添加超级管理员

## 功能说明

- 添加一个聊天室超级管理员。
- 仅聊天室超级管理员具有在客户端创建聊天室的权限。
- 添加聊天室超级管理员，会触发发送后回调，详见 [添加超级管理员事件](callback_room_superadmin.html#添加超级管理员)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/super_admin
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/chatrooms/super_admin'  \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "superadmin": "user1"
}'
```

## 请求 header 参数

关于 `Content-Type` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数         | 类型   | 是否必需 | 描述                                          |
| :----------- | :----- | :------- | :-------------------------------------------- |
| `superadmin` | String | 是       | 添加的超级管理员的用户 ID，每次只能添加一个。 |

## 响应示例

```json
{
  "action": "post",
  "application": "09XXXX34",
  "applicationName": "XXXX",
  "data": {
    "result": "success",
    "resource": ""
  },
  "duration": 1,
  "entities": [],
  "organization": "XXXX",
  "timestamp": 1656488117703,
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/super_admin"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下所示：

| 字段              | 类型   | 描述                                                                    |
| :---------------- | :----- | :---------------------------------------------------------------------- |
| `data`     | JSON   | 响应数据。 |
| - `result`     | Bool   | 是否成功添加聊天室超级管理员：<br/> - `true`：是；<br/> - `false`：否。 |
| - `resource` | String | 预留参数，开发者不用关注。                                              |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | username XXX doesn't exist! | 要添加的用户 ID 不存在。 | 传入存在的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。