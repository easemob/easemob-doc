# 批量获取用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

## 功能说明

- 根据指定的用户 ID 列表和属性列表，查询用户属性。
- 每次最多可获取 100 个用户的属性。
- 如果指定的用户 ID 或用户属性不存在，返回空数据 {}。 

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/metadata/user/get
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/metadata/user/get'
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "properties": [
    "avatarurl",
    "ext",
    "nickname"
  ],
  "targets": [
    "user1",
    "user2",
    "user3"
  ]
}' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数         | 类型  | 是否必需 | 描述                                                                       |
| :----------- | :---- | :------- | :-------------------- |
| `targets`    | Array | 是       | 用户 ID 列表，最多可传 100 个用户 ID。                                     |
| `properties` | Array | 是       | 属性名列表，查询结果只返回该列表中包含的属性，不在该列表中的属性将被忽略。 |

## 响应示例

```json
{
  "timestamp": 1620448826647,
  "data": {
    "user1": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user2": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user3": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    }
  },
  "duration": 3
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                                                                |
| :----- | :----- | :---------------------------------------------------------------------------------- |
| `data` | Object | 用户属性键值对。<br/>如果 `data` 为空，请确认用户 ID 是否存在或用户是否有用户属性。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | BAD_REQUEST  | exceed allowed batch size %s   | 超过允许获取的用户数的用户属性。每次最多可获取 100 个用户的用户属性。  |  减少批量获取用户属性的用户数。   |
| 401     | metadata_error  | auth error        | 鉴权失败。   |     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。