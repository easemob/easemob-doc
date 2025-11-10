# 删除聊天室自定义属性

## 功能说明

- 用户删除其设置的聊天室自定义属性。
- 只能删除当前用户设置的聊天室自定义属性，不能删除其他成员设置的自定义属性。
- 每次最多可删除 10 个自定义属性。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `username` | String | 是       | 要删除的聊天室自定义属性的所属用户 ID。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X DELETE POST 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1'   \
-H 'Content-Type: application/json'   \ 
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'   \ 
-d '{
    "keys": ["key1","key2"]
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数   | 类型  | 是否必需 | 描述                                                         |
| :----- | :---- | :------- | :----------------------------------------------------------- |
| `keys` | Array | 否       | 聊天室自定义属性名称列表。每次最多可传 10 个自定义属性名称。 |

## 响应示例

```json
{
  "uri":"https://XXXX/XXXX/XXXX/metadata/chatroom",
  "status":"ok",
  "timestamp":1716887320215,
  "action":"delete",
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data` | JSON  | 响应数据。                                         |
| - `successKeys` | Array  | 成功删除的聊天室属性名称列表。                                           |
| - `errorKeys`   | Object | 删除失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `uri`             | String | 请求 URL。                                                                     |
| `status`          | String | 请求状态。若请求成功，返回 `ok`。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `action`          | String | 请求方法。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要删除的 key 属性数量超过 10 个。 | 要删除的 key 的数量不超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 401     | MetadataException | user is not in chatroom | 用户不在聊天室内。 | 使用正确的聊天室成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。