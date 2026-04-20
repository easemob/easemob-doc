# 获取单个用户在线状态

## 功能说明

- 查看单个用户是在线还是离线状态。
- 如果用户是多终端登录，则只要有一个终端的状态是在线状态（online），用户即为在线状态。

:::tip
该接口查询单个用户的在线或离线状态。若批量查询用户的在线状态，包括在线、离线或自定义状态，可使用 [批量获取在线状态信息](presence_get.html) 接口。
:::

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/status
```

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `username`  | String | 是       | 用户 ID。获取该用户的在线状态。   |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/status'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## 请求 header 参数

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 响应示例

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/status",
  "entities": [],
  "data": {
    "user1": "offline"
  },
  "timestamp": 1542601284531,
  "duration": 4
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的 `data` 字段如下：

| 字段   | 类型 | 描述         |
| :----- | :--- | :---------------------- |
| `data` | JSON | 用户的在线状态数据。<br/> 格式为："用户 ID": "当前在线状态"，例如，user1 的在线和离线状态分别为 "user1": "online" 和 "user1": "offline"。 <br/> - `online`：客户端登录后和即时通讯 IM 服务器成功建立了长连接。<br/> - `offline`：iOS 和 Android 进程被杀或因网络问题断开连接，进入 `offline` 状态，此时可以接收消息的离线推送通知（前提是在环信控制台上传了推送证书，集成了离线推送服务）。 |

响应体中的其他参数说明如下表所示：

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `uri`             | String | 请求 URL。                                                                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型   | 错误提示         | 可能原因      | 处理建议    |
| :----- | :----------- | :--| :-------------- | :---|
| 401         | unauthorized     | Unable to authenticate (OAuth)       | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。   |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在  | 检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |
| 404         | service_resource_not_found | Service resource not found | App 用户不存在  | 提供已经创建的用户 |