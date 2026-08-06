# 获取单个群组的在线成员数量

在线状态（Presence）表示用户的当前状态信息。除了环信 IM 内置的在线和离线状态，你还可以添加自定义在线状态，例如忙碌、马上回来、离开、接听电话、外出就餐等。本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态（Presence）订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。

关于用户的在线、离线和自定义状态的定义，详见[用户在线状态管理](/product/product_user_presence.html)。

## 功能说明

- 查询单个群组的在线成员数量。**如需使用该 API，需要联系环信商务开通。**
- 该 API 中的在线状态指用户的 app 与服务器成功建立连接，不包括用户的自定义在线状态，如忙碌、马上回来等。

# 功能开通

使用该 API 前，你需要开通 Presence 功能和单独开通该 API：

1. 开通 Presence 功能：在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。
2. 联系商务开通该 API 的使用。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/presence/online/{group_id}/type/{query_type}
```

| 参数   | 类型   | 是否必需 | 描述                                    |
| :----- | :----- | :------- | :-------------------------------------- |
| `group_id`   | String | 是       | 群组 ID。                                |
| `query_type` | Int    | 是       | 查询类型，查询群组的在线成员数量，传 `1` 即可。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXX/XXX/XXX/presence/online/XXX/type/XXX'   \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
    "result": 100
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `result` | Int  | 群组内的在线成员数量。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                 | 可能原因  | 处理建议   |
| :---------- | :--- | :--------- | :------------ | :-------------- |
| 400         | illegal_argument       | Id cannot be null.       | 群组 ID 为空。 | 保证群组 ID 为非空值。 |
| 400         | illegal_argument       | Type cannot be null.     | 查询类型为空。    | 保证查询类型为非空值。 |
| 400         | illegal_argument       | Type must be 0 or 1.     | 查询类型（`query_type`）不为 0 或 1。  | 若查询单个群组的在线成员数量，需保证查询类型为 `1`。若传 `0` 是获取超级社区中社区 server 在线成员数量，与群组不相关。 |
| 400         | service open exception | this appkey not open rest group online service | 没有开通统计群组在线人数服务。 | 联系商务开通统计群组在线人数服务。 |
| 401         | unauthorized           | Unable to authenticate (OAuth)    | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
