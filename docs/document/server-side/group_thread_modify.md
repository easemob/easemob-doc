# 修改消息话题

## 功能说明

- 修改指定消息话题的名称。
- 使用该接口前，你需要联系商务开通消息话题功能。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 要修改的消息话题 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT https://XXXX/XXXX/XXXX/thread/1XXXX7   \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{"name": "test4"}'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数   | 类型   | 是否必需 | 描述           |
| :----- | :----- | :------- | :----------------- |
| `name` | String | 是       | 新的消息话题名称。修改后的消息话题名称不能超过 64 个字符。 |

## 响应示例

```json
{
    "action": "put",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "name": "test4"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段        | 类型   | 描述           |
| :---------- | :----- | :------------- |
| `data.name` | String | 修改后的名称。 |

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
| 400     | group_error | thread name limit reached. | 消息话题名称过长。 | 请提供长度范围内的消息话题名称。消息话题名称长度不能超过 64 个字符。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 消息话题功能未开通。 | 调用该接口前，你需要联系商务开通消息话题功能。 |
| 404     | group_error | thread not found. | 消息话题不存在。 | 输入正确的消息话题 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。