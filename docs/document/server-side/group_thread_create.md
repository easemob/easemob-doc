# 创建消息话题

## 功能说明

- 群成员基于群组中的一条消息创建消息话题。该消息为消息话题的父消息。
- 消息话题创建者即消息话题所有者。
- **单个 app 下的消息话题总数默认为 10 万，如需调整请联系商务。**
- 使用该接口前，你需要联系商务开通消息话题功能。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/thread
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/thread   \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type:application/json'   \
-d '{
    "group_id": 179800091197441,
    "name": "1",
    "owner": "test4",
    "msg_id": 1234
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型   | 是否必需 | 描述                               |
| :--------- | :----- | :------- | :--------------------------------- |
| `group_id` | String | 是       | 消息话题所在的群组 ID。                |
| `name`     | String | 是       | 消息话题名称，不能超过 64 个字符。     |
| `msg_id`   | String | 是       | 消息话题的父消息 ID。                  |
| `owner`    | String | 是       | 消息话题的所有者，即创建消息话题的群成员。 |

## 响应示例

```json
{
    "action": "post",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "thread_id": "1XXXX7"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段的说明如下：

| 字段             | 类型   | 描述            |
| :--------------- | :----- | :-------------- |
| `data.thread_id` | String | 创建的消息话题 ID。 |

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
| 400     | group_error | thread must on group message to create. | 消息 ID 不是群消息。 | 输入正确的群消息 ID。 |
| 400     | group_error | thread name limit reached. | 消息话题名称过长。 | 请提供长度范围内的消息话题名称。消息话题名称长度不能超过 64 个字符。 |
| 400     | param_illegal | Failed to read HTTP message | body 参数不合法。 | 检查 body 参数是否合法。 |
| 400     | group_error | msg not belong to app. | 消息不属于 app。 | 输入合法的消息 ID。 |
| 400     | group_error | msg not belong to group . | 消息不属于群。 | 输入合法的消息 ID。 |
| 400     | group_error | thread not nested. | 不允许在消息话题的消息上创建消息话题。 | 输入合法的消息 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread number has reached limit. | appKey 创建消息话题达到上限。 | 删除废弃的消息话题或者联系商务调整上限。单个 app 下的消息话题总数默认为 10 万。 |
| 403     | group_error | user join thread reach limit. | 用户加入的消息话题达到上限。 | 退出不用的消息话题或者联系商务调整上限。单个用户默认最多可以加入 100,000 个消息话题。 |
| 403     | group_error | msg already create thread.not allow to create. | 消息上已经创建消息话题。 | 传入其他消息 ID 或者查询该消息话题后加入。 |
| 403     | group_error | thread not open. | 消息话题功能未开通。 | 调用该接口前，你需要联系商务开通消息话题功能。 |
| 404     | group_error | user not in group. | 消息话题所有者不在群里面。 | 输入已加入群的用户 ID。 |
| 404     | group_error | msg not exist. | 消息不存在。 | 输入存在的消息 ID。 |
| 404     | group_error | group not found. | 群组不存在。   | 检查创建消息话题的群组是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。