# 强制设置聊天室自定义属性

## 功能说明

- 用户强制设置指定聊天室的自定义属性信息。
- 该接口可覆盖其他用户设置的聊天室自定义属性。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID。 |
| `username` | String | 是       | 要强制设置的聊天室自定义属性的所属用户 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1/forced'   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "metaData": {
        "key1": "value1",
		    "key2": "value2"
    },
    "autoDelete": "DELETE"
 }' 
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数         | 类型   | 是否必需 | 描述   |
| :----------- | :----- | :------- | :---------- |
| `metaData`   | JSON   | 是       | 聊天室的自定义属性，存储为键值对（key-value pair）集合，即 Map<String,String>。该集合中最多可包含 10 个键值对，在每个键值对中，key 为属性名称，最多可包含 128 个字符；value 为属性值，不能超过 4096 个字符。每个聊天室最多可有 100 个自定义属性，每个应用的聊天室自定义属性总大小为 10 GB。<br/> key 支持以下字符集：<br/> • 26 个小写英文字母 a-z；<br/> • 26 个大写英文字母 A-Z；<br/> • 10 个数字 0-9；<br/> • "\_", "-", "."。 |
| `autoDelete` | String | 否   | 当前成员退出聊天室时是否自动删除该自定义属性。 <br/> • （默认）'DELETE'：是； <br/> • 'NO_DELETE'：否。    |

## 响应示例

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

由于该 API 批量设置聊天室自定义属性，一次可传入多个 key-value。即使其中有些 key-value 校验失败，也不会影响其他 key-value 正常写入，响应状态码仍为 `200`，示例如下：

```json
{
    "uri": "%s/easemob-demo/chatdemoui/metadata/chatroom",
    "timestamp": 1720769458528,
    "action": "put",
    "data": {
        "successKeys": [],
        "errorKeys": {
            "key1": "properties key 'key1' is exceeding maximum limit 128",
            "key2": "properties key 'key2' is exceeding maximum limit 128"
        }
    }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :---------------------------- |
| `data` | JSON  | 实际获取的响应数据。                                     |
| - `successKeys` | Array  | 设置成功的聊天室属性名称列表。                                           |
| - `errorKeys`   | Object | 设置失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要设置的 key 属性数量超过了 10 个。 | 要设置的 key 的数量不要超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 401     | MetadataException | user is not in chatroom | 用户不在聊天室内。 | 使用正确的聊天室成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。