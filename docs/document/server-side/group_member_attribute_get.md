# 获取单个群成员的所有自定义属性

## 功能说明

获取单个群成员的所有自定义属性。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |
| `username` | String | 是       | 用户 ID。获取该群成员的所有自定义属性。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXX/XXX/XXX/metadata/chatgroup/XXXX/user/XXXX' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
-H 'Authorization: Bearer <YourAppToken>' \
--data-raw ''
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "timestamp": 1678674211840,
  "data": {
    "key1": "value1"
  },
  "duration": 6
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `data` | JSON | 获取的群成员自定义属性。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | MetadataException | user not in group | 用户不在群组内。 | 使用正确的群组成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。