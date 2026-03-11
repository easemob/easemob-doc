# 修改用户收藏的扩展信息

环信即时通讯 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可 [将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 功能说明

修改单个用户的一条收藏的扩展信息。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/collections/{collectionId}
```

| 参数           | 类型   | 是否必需 | 描述                             |
| :------------- | :----- | :------- | -------------------------------- |
| `username`     | String | 是       | 要修改该用户 ID 的收藏扩展信息。 |
| `collectionId` | String | 是       | 收藏 ID。                        |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X PUT https://XXX/XXX/XXX/users/{username}/collections/{collectionId} \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "ext": "string" 
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `ext` | String | 是       | 收藏的扩展信息。如果设置为空，则表示取消现有的扩展字段。 |

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