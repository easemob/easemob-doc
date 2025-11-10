# 查看指定用户是否已加入群组

## 功能说明

查看单个用户是否已加入了指定的群组。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/user/{username}/is_joined
```

| 参数     | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :------------------ |
| `group_id`        | String | 是       | 群组 ID。         |
| `username` | String | 是       | 用户 ID。该 API 查询该用户 ID 是否加入了指定群组。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求 header

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/XXXX/user/XXXX/is_joined'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 响应示例

```json
{
    "action": "get",
    "application": "8bXXXX02",
    "data": false,
    "duration": 0,
    "organization": "XXXX",
    "timestamp": 1691547476492
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中 `data` 字段说明如下：

| 字段           | 类型   | 描述      |
| :------------- | :----- | :-------- |
| `data` | Boolean | 该用户是否已加入群组：<br/> - `true`：用户已加入该群组；<br/> - `false`：用户未加入该群组。 |

其他字段的说明如下：

| 字段           | 类型   | 描述      |
| :------------- | :----- | :-------- |
| `action`          | String | 请求方法。                                                                     |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。