# 解除成员禁言

## 功能说明

- 将一个或多个群成员移出禁言列表。
- 一次最多可对 60 个成员解除禁言。
- 移除后，群成员可以在群组中正常发送消息，同时也可以在该群组下的消息话题中发送消息。
- 将成员解除禁言会触发发送后回调，详见 [将成员移出禁言列表事件](callback_group_room_mute.html#将成员移出禁言列表)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)
```

| 参数     | 类型   | 是否必需 | 描述                                                         |
| :------- | :----- | :------- | :----------------------------------------------------------- |
| `group_id`  | Int    |  是       | 群组 ID。 |
| `member` | String | 是       | 要解除禁言的成员的用户 ID，每次最多可传 60 个，多个用户 ID 之间以英文逗号（","）分隔，例如 `{member1},{member2}`。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/chatgroups/10130212061185/mute/user1'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute/user1",
  "entities": [],
  "data": [
    {
      "result": true,
      "user": "user1"
    }
  ],
  "timestamp": 1489072695859,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型  | 描述                                                            |
| :------------ | :---- | :-------------------------------------------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result` | Bool  | 操作结果：<br/> - `true`：解除成功；<br/> - `false`：解除失败。 |
|  - `user`   | Array | 被移出禁言列表的用户 ID。                                       |

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
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | removeMute member size more than max limit : 60 | 批量移除禁言列表的用户数超过上限 60。 | 控制解除成员禁言数量在 60 以内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。