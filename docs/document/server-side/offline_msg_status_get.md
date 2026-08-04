# 获取指定离线消息的投递状态

## 功能说明

- 获取用户的指定离线消息的投递状态，即查看该消息是否已投递。
- "已投递"状态表示接收方用户上线时收到了该消息。
- "未投递"状态表示接收方用户为离线状态，消息还未投递，等接收方上线后再投递。
- 离线消息的存储条数和天数，详见 [离线消息存储说明](/product/product_message_overview.html#消息存储)。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}
```

| 参数       | 类型   | 是否必需 | 描述                             |
| :--------- | :----- | :------- | :------------------------------- |
| `username` | String | 是       | 要获取该用户 ID 的离线消息状态。 |
| `msg_id`   | String | 是       | 要查看该离线消息 ID 的投递状态。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123",
  "entities": [],
  "data": {
    "123": "delivered"
  },
  "timestamp": 1542601830084,
  "duration": 5
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段说明如下：

| 字段   | 类型 | 描述     |
| :----- | :--- | :--------------- |
| `data` | JSON | 指定离线消息的投递状态。数据格式为 "消息 ID": "投递状态"。消息的投递状态有两种：<br/> - `delivered`：已投递；<br/> - `undelivered`：未投递。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示           | 可能原因          | 处理建议     |
| :---------- | :------------ | :-------------- | :------------------| :----------- |
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。     |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。    | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。