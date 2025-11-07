# 获取 app 中的聊天室

## 功能说明

分页获取应用下的聊天室列表和信息，包括聊天室 ID、聊天室名称、聊天室创建者的用户 ID 和聊天室现有成员总数（包含聊天室创建者）。

## 调用频率上限

50 次/秒/App Key

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/chatrooms?limit={N}&cursor={cursor}
```

| 参数     | 类型   | 是否必需 | 描述                                                                                      |
| :------- | :----- | :------- | :---------------------------------------------------------------------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的聊天室数量。取值范围为 [1,1000]，默认值为 `10`。该参数仅在分页获取时为必需。若传入的值超过了 `1000`，则返回 1000 个聊天室。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。   |

:::tip
若请求中均未设置 `limit` 和 `cursor`，环信服务器返回聊天室列表的第一页中前 10 个聊天室。
:::

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/chatrooms?limit=10' \
-H 'Authorization: Bearer <YourAppToken>'
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "data": {
    "id": "662XXXX13",
    "name": "testchatroom1",
    "owner": "user1",
    "affiliations_count": 2
  }
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段                      | 类型   | 描述                                                      |
| :------------------------ | :----- | :-------------------------------------------------------- |
| `data`                 | JSON | 实际获取的数据详情。 |
| - `id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
| - `name`               | String | 聊天室名称。                                              |
| - `owner`              | String | 聊天室创建者的用户 ID。例如：{"owner": "user1"}。         |
| - `affiliations_count` | Int    | 聊天室现有成员总数（包含聊天室创建者）。                  |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。