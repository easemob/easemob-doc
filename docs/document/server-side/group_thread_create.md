# 创建子区

## 功能说明

- 群成员基于群组中的一条消息创建子区。该消息为子区的父消息。
- 子区创建者即子区所有者。
- 使用该接口前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通子区功能。

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

curl -X POST https://XXXX/XXXX/XXXX/thread -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type:application/json' -d '{
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
| `group_id` | String | 是       | 子区所在的群组 ID。                |
| `name`     | String | 是       | 子区名称，不能超过 64 个字符。     |
| `msg_id`   | String | 是       | 子区的父消息 ID。                  |
| `owner`    | String | 是       | 子区的所有者，即创建子区的群成员。 |

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
| `data.thread_id` | String | 创建的子区 ID。 |

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
| 400     | group_error | thread name limit reached. | 子区名称过长。 | 请提供长度范围内的子区名称。子区名称长度不能超过 64 个字符。 |
| 400     | param_illegal | Failed to read HTTP message | body 参数不合法。 | 检查 body 参数是否合法。 |
| 400     | group_error | msg not belong to app. | 消息不属于 app。 | 输入合法的消息 ID。 |
| 400     | group_error | msg not belong to group . | 消息不属于群。 | 输入合法的消息 ID。 |
| 400     | group_error | thread not nested. | 不允许在子区的消息上创建子区。 | 输入合法的消息 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread number has reached limit. | appKey 创建子区达到上限。 | 删除废弃的子区或者联系商务调整上限。单个 app 下的子区总数默认为 10 万。 |
| 403     | group_error | user join thread reach limit. | 用户加入的子区达到上限。 | 退出不用的子区或者联系商务调整上限。单个用户默认最多可以加入 100,000 个子区。 |
| 403     | group_error | msg already create thread.not allow to create. | 消息上已经创建子区。 | 传入其他消息 ID 或者查询该子区后加入。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信控制台开通子区服务。 |
| 404     | group_error | user not in group. | 子区所有者不在群里面。 | 输入已加入群的用户 ID。 |
| 404     | group_error | msg not exist. | 消息不存在。 | 输入存在的消息 ID。 |
| 404     | group_error | group not found. | 群组不存在。   | 检查创建子区的群组是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。