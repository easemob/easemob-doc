# 添加聊天室管理员

## 功能说明

- 将一个聊天室成员设置为聊天室管理员。
- 聊天室管理员由聊天室创建者授权，协助聊天室管理，具有管理权限。 
- 聊天室创建者和管理员的数量之和不能超过 100，即管理员最多可添加 99 个。
- 添加聊天室管理员会触发发送后回调，详见 [添加聊天室管理员事件](callback_group_room_admin.html)。
- 关于聊天室成员的角色，详见 [聊天室成员角色说明](chatroom_member_list_obtain.html)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/admin
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{"newadmin":"user1"}' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 描述                                |
| :--------- | :---------------------------------- |
| `newadmin` | 要添加为聊天室管理员的成员用户 ID。 |

## 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin",
  "entities": [],
  "data": {
    "result": "success",
    "newadmin": "user1"
  },
  "timestamp": 1489073130083,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下所示：

| 参数            | 类型   | 描述                                                               |
| :-------------- | :----- | :----------------------------------------------------------------- |
| `data`   | JSON   | 响应数据。 |
| - `result`   | Bool   | 操作结果：<br/> - `success`：添加成功；<br/> - `false`：添加失败。 |
| - `newadmin` | String | 添加为聊天室管理员的成员用户 ID。                                  |

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 404     | resource_not_found | username XXX doesn't exist! | 要添加聊天室管理员的用户 ID 不存在。 | 传入聊天室中普通成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。