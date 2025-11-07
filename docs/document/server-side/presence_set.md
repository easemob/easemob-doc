# 设置用户在线状态

在线状态（Presence）表示用户的当前状态信息。除了环信 IM 内置的在线和离线状态，你还可以添加自定义在线状态，例如忙碌、马上回来、离开、接听电话、外出就餐等。本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态（Presence）订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。

关于用户的在线、离线和自定义状态的定义，详见[用户在线状态管理](/product/product_user_presence.html)。

## 功能说明

设置用户在指定设备的在线状态信息。

## 功能开通

使用 Presence 功能前，你需要在 [环信控制台](https://console.easemob.com/user/login) 开通。详见 [环信控制台文档](/product/console/basic_user.html#用户离在线状态实时同步)。

## 调用频率上限

100 次/秒/App Key 

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{resource}/{status}
```

| 参数       | 类型  | 是否必需 | 描述           | 
| :--------- | :----- | :---------------------- | :------- |
| `username`       | String  | 是 | 设置该用户 ID 的在线状态信息。           | 
| `resource` | String | 是     | 要设置用户在该设备的在线状态信息，即传入服务器分配给每个设备资源的唯一标识符，格式为 `{device type}_{resource ID}`，其中设备类型 `device type` 可以是 `android`、`ios` 或 `web`，资源 ID `resource ID` 由 SDK 分配。例如，`android_123423453246`。 |
| `status`   | String | 是     | 用户的在线状态：<br> - `0`：离线；<br> - `1`：在线；<br> - 其它数字字符串：自定义在线状态。 | 

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/c1/presence/android/0' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"ext":"123"}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

请求包体为 JSON Object 类型，包含以下字段：

| 参数  | 类型 | 是否必需  | 描述             | 
| :---- | :----- | :---------------------- | :------- |
| `ext` | String | 是 | 在线状态扩展信息。建议不超过 1024 字节。 | 

## 响应示例

```json
{"result":"ok"}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                 |
| :------- | :----- | :--------------------------------------------------- |
| `result` | String | 在线状态是否成功设置。`ok` 表示在线状态设置成功；否则，你可以根据返回的原因进行故障排除。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400   | illegal_argument | ext cannot be null | 在线状态扩展参数 `ext` 传了空值。 | 保证 `ext` 参数传非空值。 |
| 400   | illegal_argument | ext is too big | 在线状态扩展信息超过了 1024 字节长度限制。 | 控制在线状态扩展信息的长度不要超过 1024 字节。 |
| 400   | service open exception | the app not open presence | 没有开通在线状态 Presence 服务。 | 联系商务开通在线状态 Presence 服务。|
| 401  | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [错误码](#错误码) 了解可能的原因。