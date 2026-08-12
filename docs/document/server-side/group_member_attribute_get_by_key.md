# 根据属性 key 获取多个群成员的自定义属性

## 功能说明

- 根据指定的属性 key 获取多个群成员的自定义属性。
- 每次最多可获取 10 个群成员的自定义属性。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/get
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/get' \
-H 'Content-Type: application/json'\
-H 'Accept: application/json'\
-H 'Authorization: Bearer <YourAppToken>'\
-d '{
    "targets":["test1","test2"],
    "properties":["key1","key2"]
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数         | 类型       | 是否必需 | 描述                     |
| :----------- | :--------- | :------- | :--------------------------------- |
| `targets`    | JSON Array | 是       | 要获取自定义属性的群成员的用户 ID。一次最多可传 10 个用户 ID。                                |
| `properties` | JSON Array | 是       | 要获取自定义属性的 key 的数组。若该参数设置为空数组或不传，则获取这些群成员的所有自定义属性。 |

## 响应示例

```json
{
  "timestamp": 1678674292783,
  "data": {
    "test1": {
      "key1": "value1"
    },
    "test2": {
      "key1": "value1"
    }
  },
  "duration": 2
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述               |
| :----- | :--- | :------------------ |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `data` | JSON | 获取的群成员的自定义属性。如下响应示例中的 `test1` 和 `test2` 为自定义属性所属的群成员的用户 ID。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

其他字段及描述见上表。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | query param reaches limit. | 批量查询数量达到限制。 | 减少要查询的用户 ID。每次最多可获取 10 个群成员的自定义属性。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。