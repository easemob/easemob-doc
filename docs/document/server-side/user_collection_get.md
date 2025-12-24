# 分页获取用户收藏

环信即时通讯 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可 [将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 功能说明

调用该接口获取指定用户的收藏。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/collections  
```

| 参数       | 类型   | 是否必需 | 描述                     |
| :--------- | :----- | :------- | ------------------------ |
| `username` | String | 是       | 要获取该用户 ID 的收藏。 |

查询参数的说明如下表所示：

用户收藏可通过两种方式查询，如下所示。除了 `type` 和 `limit` 字段的设置，这两种方式的设置如下：
1. 按时间段：时间段字段和 `direction` 字段配合使用。这种方式下，你必须传入 `begin_time` 和 `end_time` 字段，`direction` 字段的默认值为 `desc`（按照收藏时间的降序排列）。
2. 从指定的收藏 ID 开始查询：`collection_id` 和 `direction` 字段配合使用。这种方式下，你必须传入 `collection_id`。

**注意：第二种查询方式的优先级高于第一种方式。也就是说，若你传入了 `collection_id` 字段，则设置的 `begin_time` 和 `end_time` 字段无效。**

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `begin_time`  | Number   | 否  | 查询开始时间，UNIX 时间戳。默认值为 `0`。该字段必须小于等于 `end_time`。单位为毫秒。  |
| `end_time`  | Number    | 否 | 查询结束时间，UNIX 时间戳。<br/> - 该字段必须大于等于 `begin_time`，默认为系统当前时间。单位为毫秒。<br/> - 若 `end_time` 等于 `begin_time`，服务器查询该时间点的收藏。  |
| `direction`  | String   | 否 | 查询方向：<br/> - （默认）`desc` ：按照收藏时间的降序排列；<br/> - `asc`： 按照收藏时间的升序排列。 |
| `type` | Int | 否       | 收藏类型。若该参数不传，则不限制收藏类型，返回满足查询条件的所有类型的收藏。 |
| `limit`  | Int    | 否       | 请求查询的收藏数量。取值范围为 [1,200]，默认值为 `100`。超过 `200` 则返回参数错误。   |
| `collection_id` | String | 否       | 收藏 ID。参数不为空的情况下：<br/> - `direction` 为 `desc` 时，服务器会将当前收藏的时间戳作为查询结束时间，查询当前收藏及其添加时间之前的所有收藏，按收藏时间的倒序返回。<br/> - `direction` 为 `asc` 时，服务器会将当前收藏的创建时间戳设置为查询开始时间，查询当前收藏及其创建时间之后的所有收藏，按收藏时间的正序返回。|

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X GET https://XXX/XXX/XXX/users/{username}/collections    \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
    "collections": [
    {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0 
    }
  ]
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `collections` | JSON Array   | 获取的用户收藏的详情。 |
| - `id` | String  | 收藏 ID。  |
| - `type` | Int  | 收藏类型。  |
| - `data` |  String    |  收藏内容。     |
| - `ext`| String  |   收藏的扩展信息   |
| - `createdAt` | Long  | 收藏创建时间。            |
| - `updatedAt` | Long  | 收藏更新时间。            |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_register_open.html)。 |
| 400         | illegal_argument  | limit should be less than 200   | 传入的每页查询的收藏数量 `limit` 不能超过 200。  | 将 `limit` 的值控制在 200 以内。 |
| 400         | illegal_argument  | direction should be desc or asc   | `direction` 参数传错。  | `direction` 参数只能是 `desc` 或者 `asc`。 |
| 400         |     | user collection not found  | 用户收藏找不到。  | 对 `collection_id` 参数传入存在的用户收藏 ID。        |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。