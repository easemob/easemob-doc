# 批量添加用户收藏

环信即时通讯 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可 [将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 功能说明

- 对单个用户添加多条收藏。
- 一次最多可添加 20 个收藏。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/collections
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X POST https://XXX/XXX/XXX/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
  "collections": [
    {
      "id": "string",
      "type": 0,
      "data": "string",
      "ext": "string",
      "createdAt": 0
    }
  ],
  "username": "string"
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `collections`  | Array | 是       | 要添加的收藏详情。最多可添加 20 个收藏。  |
| - `id`  | String | 是       | 收藏 ID。                       |
| - `data`   | String | 是       | 收藏内容。   |
| - `type` | Int | 是       | 收藏类型。 |
| - `ext` | String | 是       | 收藏的扩展信息。 |
| - `createdAt` | Long | 是       | 收藏的添加时间。 |
| `username`  | String | 是       | 为该用户 ID 添加收藏。  |

## 响应示例

```json
{
  "collections": [ 
    {
    "id": "id1",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }
    {
    "id": "id2",
    "type": 1,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }  
  ] 
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功。

响应包体中的参数描述详见 [请求 body 参数](#请求-body-参数)。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_register_open.html)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。