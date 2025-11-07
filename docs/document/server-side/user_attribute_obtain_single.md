# 获取用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

## 功能说明

获取单个用户的全部用户属性键值对。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `username` | String | 是       | 获取该用户 ID 的用户属性。如果指定的用户或用户属性不存在，返回空数据 {}。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/metadata/user/user1'    \
-H 'Accept: application/json'     \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "timestamp": 1620445147011,
  "data": {
    "ext": "ext",
    "nickname": "nickname",
    "avatarurl": "https://www.easemob.com/avatar.png"
  },
  "duration": 166
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                                                                  |
| :----- | :----- | :------------------------------------------------------------------------------------ |
| `data` | Object | 用户属性键值对。<br/>如果 `data` 为空，请确认用户 ID 是否存在或该用户是否有用户属性。 |
| - `ext`  | String      | 扩展字段。    |
| - `nickname`  | 用户昵称。长度在 64 个字符内。      |
| - `avatarurl` | 用户头像 URL 地址。长度在 256 个字符内。    |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | 鉴权失败。例如，使用的 token 与路径参数 `username` 不匹配。   | 使用正确的 token。     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | 用户属性功能未开通。  | 联系商务开通用户属性功能。 |
| 500     | INTERNAL_SERVER_ERROR          |         | 服务未知异常。  | 

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。