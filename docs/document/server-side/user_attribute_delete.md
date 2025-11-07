# 删除用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

## 功能说明

- 删除单个用户的所有属性。
- 如果指定的用户或用户属性不存在（可能已删除），也视为删除成功。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| 参数       | 类型   | 是否必需 | 描述                   |
| :--------- | :----- | :------- | :--------------------- |
| `username` | String | 是       | 删除该用户 ID 的属性。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/metadata/user/user1'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "timestamp": 1616573382270,
  "duration": 10,
  "data": true
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型 | 描述    |
| :----- | :--- | :----------- |
| `data` | Bool | 是否删除成功：<br/> - `true`：是。如果指定的用户不存在，或指定用户的用户属性不存在，也视为删除成功。<br/> - `false`：否。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | 鉴权失败。   |  使用正确的 token。    |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | 用户属性功能未开通。  | 联系商务开通用户属性功能。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。