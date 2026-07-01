# 解散群组

## 功能说明

- 解散单个群组。
- 解散群组时会同时删除群组下所有的消息话题（Thread）。
- 解散群组后，会触发 [解散群组的回调事件](callback_group_room_delete.html)。
- 群组解散后，群组中的文件，无法下载。
- 群组解散后，服务端存储的群组信息不存在，群组会话不存在，但群消息仍然存在（与订阅的套餐包的消息存储时间有关）。客户端仍然能拉取到这个群组的漫游消息。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

| 参数     | 类型   | 是否必需 | 描述                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  是       | 要封禁的群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://a1.Agora.com/XXXX/testapp/chatgroups/6XXXX7'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7",
  "entities": [],
  "data": {
    "success": true,
    "groupid": "6XXXX7"
  },
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含的 `data` 字段说明如下：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `data` | JSON   | 响应数据。 |
| - `success` | Bool   | 群组解散结果: <br/> - `true`：成功； <br/> - `false`：失败。 |
| - `groupid` | String | 被解散的群组的 ID。                                                    |

其他字段的说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。    |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在 | 使用合法的群 ID。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。