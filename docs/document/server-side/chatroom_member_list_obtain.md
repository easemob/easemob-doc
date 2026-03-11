# 获取聊天室成员列表

## 功能说明

可以分页获取聊天室成员列表。

聊天室成员角色说明如下：

| 成员角色     | 描述       | 管理权限       |
| :----------- | :----------------------- | :----------------- |
| 普通成员     | 不具备管理权限的聊天室成员。                       | 普通成员可以修改自己的聊天室信息。   |
| 聊天室管理员 | 由聊天室创建者授权，协助聊天室管理，具有管理权限。 | 管理员可以管理聊天室内的普通成员。 最多支持添加 99 个管理员。  |
| 聊天室所有者 | 聊天室的创建者，具有聊天室最高权限。               | 聊天室所有者可以指定聊天室管理员、解散聊天室、更改聊天室信息、管理聊天室成员。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users?pagenum={N}&pagesize={N}
```

| 参数       | 类型 | 是否必需 | 描述      |
| :--------- | :--- | :------- | :-------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `pagenum`  | Int  | 否       | 查询页码。默认值为 `1`。                                         |
| `pagesize` | Int  | 否       | 每页显示的聊天室成员数量。默认值为 1000。取值范围为 [0,1000]。若传入的值超过了 1000，则返回 1000 个聊天室成员。 |

关于请求 URL 中其他参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users?pagenum=2&pagesize=2     \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "params": {
    "pagesize": ["2"],
    "pagenum": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users",
  "entities": [],
  "data": [
    {
      "owner": "user1"
    },
    {
      "member": "user2"
    }
  ],
  "timestamp": 1489074511416,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下所示：

| 参数                 | 类型   | 描述   |
| :------------------- | :----- | :------------ |
| `data` | JSON Array | 聊天室成员信息。服务器不对成员排序，因此，返回的成员列表不保证有序。  |
|  - `owner`  | String | 聊天室所有者的用户 ID。例如：{"owner": "user1"}。   |
|  - `member` | String | 普通聊天室成员或聊天室管理员的用户 ID。例如：{"member":"user2"}。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `params`          | JSON       | 查询参数。                                                   |
| - `pagesize`      | Array      | 每页期望显示的聊天室成员数量。                               |
| - `pagenum`       | Array      | 当前页码。                                                   |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `count` | Number | 本次调用实际获取的聊天室成员数量。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | do not find this group:XX | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。