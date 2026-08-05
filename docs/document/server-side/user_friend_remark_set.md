# 设置好友备注

## 功能说明

- 设置你在当前 app 下的单个好友的备注。
- 先添加为好友关系，然后再设置好友备注。
- 调用该接口会触发设置好友备注的发送后回调事件，详见 [回调事件文档](callback_contact.html)。

## 调用频率上限

100 次/秒/App Key
  
## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}
```

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `owner_username`  | String | 是       | 要设置哪个用户的好友备注。  |
| `friend_username` | String | 是       | 要设置备注的用户 ID。 |

关于请求 URL 中的其他参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X PUT 'https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "remark": <remark>
}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `remark`  | String | 是   | 好友备注。好友备注的长度不能超过 100 个字符。  |

## 响应示例

```json
{
  "action": "put",
  "duration": 22,
  "status": "ok",
  "timestamp": 1700633088329,
  "uri": "https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型     | 描述                                    |
| :------------------- |:-------|:--------------------------------------|
| `action`           | String | 请求方法。                                 |
| `status`      | String | 好友备注是否设置成功，`ok` 表示设置成功。                         |
| `timestamp`   | Long   | HTTP 响应的 UNIX 时间戳，单位为毫秒。                         |
| `uri`  | Long   | 请求 URL。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | illegal_argument | updateRemark they are not friends, please add as a friend first. | 要添加备注的两个用户不是好友关系。 | 先成为好友再设置好友备注。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要设置或被设置好友备注的用户 ID 不存在。 | 检查要设置和被设置好友备注的用户 ID 是否存在。| 