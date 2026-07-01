# 封禁群组

## 功能说明

- 封禁单个群组。
- 例如，群成员经常在群中发送违规消息，可以调用该 API 对该群进行封禁。
- 群组被封禁后，群中任何成员均无法在群组以及该群组下的消息话题中发送和接收消息，也无法进行群组和消息话题管理操作。
- 封禁群组后会触发发送后回调，详见 [群组封禁/解禁事件](callback_group_ban.html)。
- 群组封禁后，可调用 [解禁群组](group_ban.html) API 对该群组解禁。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/disable
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 要封禁的群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/XXXX/disable'   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "applicationName": "XXXX",
  "data": {
    "disabled": true
  },
  "duration": 740,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1672974260359,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/XXXX/disable"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `data` | JSON | 数据详情。 |
| - `disabled` | Bool | 群组是否为禁用状态：<br/> - `true`：群组被禁用；<br/> - `false`：群组为启用状态。 |

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
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。