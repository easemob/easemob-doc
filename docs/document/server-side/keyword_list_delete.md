# 删除关键词名单

## 功能说明

- 删除单个关键词名单。
- 关键词名单也可在 [环信控制台](https://console.easemob.com/user/login) 删除：选择 **即时通讯** > **内容审核** > **文本审核** > **关键词名单**。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
DELETE https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}
```

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`        | String | 是       | 要删除的关键词名单 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "status": "OK",
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `status` | String | 请求状态。若请求成功，返回 `OK`。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 400 | Bad request | textList data is empty | 名单不存在 | 检查传入的 `list_id` 参数是否正确。 |
| 400 | Bad request | appkey is not exist | App Key 不存在。 | 请传入正确的 `org_name` 和 `app_name` 参数。  |

关于其他错误，你可以参考 [错误码页面](error.html) 了解可能的原因。
