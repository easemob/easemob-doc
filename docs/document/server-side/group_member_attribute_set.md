# 设置群成员自定义属性

## 功能说明

设置群成员的自定义属性（key-value），例如在群组中的昵称和头像等。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  是       | 群组 ID。 |
| `username` | String | 是       | 用户 ID。设置该群成员的所有自定义属性。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/user/XXXX' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "metaData": {
          "key1": "value1"
    }
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数       | 类型 | 是否必需 | 描述        |
| :--------- | :--- | :------- | :----------------------------------------- |
| `metaData` | JSON | 是       | 要设置的群成员自定义属性，为 key-value 键值对。对于单个键值对：<br/> - key 表示属性名称，不能超过 16 字节。<br/> - value 表示属性值，不能超过 512 个字节。若 value 设置为空字符串即删除该自定义属性。<Container type="notice" title="注意">单个群成员的自定义属性总长度不能超过 4 KB。</Container> |

## 响应示例

```json
{
  "timestamp": 1678674135533,
  "data": {
    "key1": "value1"
  },
  "duration": 53
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `data` | JSON | 设置的群成员自定义属性。 |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | exceeds chatgroup user metadata single key limit | 添加的群成员属性的 key 过长。 | 调整群成员属性 key 的长度。属性 key 不能超过 16 字节。 |
| 400     | metadata_error | exceeds chatgroup user metadata single value limit | 添加的群成员属性的 value 过长。 | 调整群成员属性 value 的长度。value 不能超过 512 个字节。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。