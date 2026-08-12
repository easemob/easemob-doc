# 添加群管理员

## 功能说明

- 将一个普通群成员设为群管理员。
- 群管理员有管理黑名单、禁言等权限。
- 最多可以添加 99 个群管理员。
- 添加管理员会触发发送后回调，详见 [添加群管理员事件](callback_group_room_admin.html#添加管理员)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/admin
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/admin    \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{"newadmin":"user1"}' 
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)

## 请求 body 参数

| 参数       | 类型   | 是否必需 | 描述                        |
| :--------- | :----- | :------- | :-------------------------- |
| `newadmin` | String | 是       | 要添加的新管理员的用户 ID。 |

## 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "applicationName": "demo",
  "data": {
    "result": "success",
    "newadmin": "man"
  },
  "duration": 0,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1680074570600,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/190141728620545/admin"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段            | 类型   | 描述                    |
| :-------------- | :----- | :---------------------- |
| `data`          | JSON   | 群管理员添加结果。      |
| `data.result`   | String | 群管理员是否添加成功。  |
| `data.newadmin` | String | 添加的管理员的用户 ID。 |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `properties` | JSON | 开发者无需关注该字段。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | user: XX doesn't exist in group: XXX | 用户不在群组中。 | 传入群组成员的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
