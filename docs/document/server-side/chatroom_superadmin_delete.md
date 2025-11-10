# 撤销超级管理员

## 功能说明

- 撤销超级管理员权限，用户将不能再创建聊天室。
- 仅聊天室超级管理员具有在客户端创建聊天室的权限。
- 撤销聊天室超级管理员，会触发发送后回调，详见 [移除超级管理员事件](callback_room_superadmin.html#移除超级管理员)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/super_admin/{superAdmin}
```

| 参数         | 类型   | 是否必需 | 描述                            |
| :----------- | :----- | :------- | :------------------------------ |
| `superAdmin` | String | 是       | 要撤销超级管理员权限的用户 ID。 |

关于请求 URL 中其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE 'https://XXXX/XXXX/XXXX/chatrooms/super_admin/XXXX'   \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "09XXXX34",
  "applicationName": "XXXX",
  "data": {
    "newSuperAdmin": "XXXX",
    "resource": ""
  },
  "duration": 0,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1656488154100,
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/super_admin/XXXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段说明如下：

| 字段                 | 类型   | 描述                            |
| :------------------- | :----- | :------------------------------ |
| `data` | JSON | 响应数据。 |
| - `newSuperAdmin` | String | 被撤销超级管理员权限的用户 ID。 |
| - `resource`      | String | 预留参数，开发者不用关注。      |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `properties`         | String | 预留参数，开发者不用关注。      |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | username XXX doesn't exist! | 要撤销的用户 ID 不存在。 | 传入存在的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。