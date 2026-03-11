# 添加一条收藏

环信即时通讯 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可[将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 功能说明

对单个用户添加一条收藏。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/collections
```

| 参数       | 类型   | 是否必需 | 描述                     |
| :--------- | :----- | :------- | ------------------------ |
| `username` | String | 是       | 要对该用户 ID 添加收藏。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X POST https://XXX/XXX/XXX/users/{username}/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 
-d '{
  "id": "string",
  "data": "string",
  "type": 0,
  "ext": "info"
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `id`   | String | 否       | 收藏 ID，收藏的唯一标识。若不传，环信服务器会设置随机的 UUID。  |
| `data` | String | 是       | 收藏内容，不能超过 20480 字符。 |
| `type` | Int    | 是       | 收藏类型。 |
| `ext`  | String | 否       | 收藏的扩展信息，不能超过 1024 字符。默认为 `NULL`，即无扩展信息。|

## 响应示例

```json
{
  "collection": {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
  } 
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `id`   | String  | 收藏 ID。  |
| `type` | Int  | 收藏类型。  |
| `data` | String     | 收藏内容。           |
| `ext`  | String  | 收藏的扩展信息。     |
| `createdAt` | Long  | 收藏创建时间。            |
| `updatedAt` | Long  | 收藏更新时间。            |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_register_open.html)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。