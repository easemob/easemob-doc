# 删除用户收藏

环信即时通讯 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可 [将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 功能说明

- 删除单个用户的收藏。
- 一次最多可删除 20 个收藏。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/collections
```

| 参数       | 类型   | 是否必需 | 描述                     |
| :--------- | :----- | :------- | ------------------------ |
| `username` | String | 是       | 要删除该用户 ID 的收藏。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X DELETE https://XXX/XXX/XXX/users/{username}/collections \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
  "collection_ids": [
  "string"
  ]
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `collection_ids`  | String | 是       | 收藏 ID。最多可传入 20 个收藏 ID。    |

## 响应示例

```json
{
  "result": true
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `result`   | String  | 是否成功删除收藏：<br/> - `true`：成功；<br/> - `false`：失败。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_register_open.html)。 |
| 400         |     | user collection not found  | 用户收藏找不到。  | 对 `collection_ids` 参数传入存在的用户收藏 ID。        |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。