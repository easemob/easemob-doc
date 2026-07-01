# 批量用户加入消息话题

## 功能说明

- 批量用户加入指定的消息话题。
- 每次最多支持 10 个用户加入消息话题。
- 使用该接口前，你需要联系商务开通消息话题功能。

## 调用频率上限

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 要加入的消息话题 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/thread/1XXXX7/users   \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
"usernames": [
"test2",
"test3"
]
}' 
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数        | 类型 | 是否必需 | 备注                                                         |
| :---------- | :--- | :------- | :---------- |
| `usernames` | List | 是       | 加入消息话题的用户 ID 列表。每次最多支持 10 个用户加入消息话题。 |

## 响应示例

```json
{
  "action": "post",
  "applicationName": "testapp",
  "data": {
    "status": "ok"
  },
  "duration": 1069,
  "organization": "XXXX",
  "timestamp": 1650872649160,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/joined_thread"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中 `data` 字段的说明如下：

| 字段          | 类型   | 描述                          |
| :------------ | :----- | :---------------------------- |
| `data.status` | String | 添加结果，`ok` 表示成功添加。 |

其他字段的说明如下：

| 字段          | 类型 | 描述                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `uri`             | String | 请求 URL。                                                                     |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | request body reaches limit. | 请求 body 中的 `usernames` 参数的值已超过上限。 | 请检查请求 body 中的 `usernames` 参数的值是否超过了 10。每次最多支持 10 个用户加入消息话题。  |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 消息话题功能未开通。 | 调用该接口前，你需要联系商务开通消息话题功能。 |
| 403     | group_error | user join thread reach limit. | 用户加入的消息话题达到上限。 | 退出不用的消息话题或者联系商务调整上限。 |
| 404     | group_error | thread not found. | 消息话题不存在 | 输入正确的消息话题 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。