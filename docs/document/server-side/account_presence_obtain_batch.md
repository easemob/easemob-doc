# 批量获取用户在线状态

## 功能说明

- 批量查看用户是在线还是离线状态。
- 单次请求最多可查看 100 个用户的在线状态。
- 该接口不对用户 ID 进行校验。若查询不存在的用户 ID 的状态，则返回的状态为 `offline`。

:::tip
该接口批量查询用户的在线或离线状态。若批量查询用户的在线状态，包括在线、离线或自定义状态，可使用 [批量获取在线状态信息](presence_get.html) 接口。
:::

## 调用频率上限

该 API、用户账户管理的其他接口、以及离线推送的相关接口的总调用频率上限为 100 次/秒/App Key，详见 [接口频率限制文档](limitationapi.html#用户体系管理)。

## 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/users/batch/status
```

关于请求 URL 中的参数的说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X POST https://XXXX/XXXX/XXXX/users/batch/status \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-d '{"usernames":["user1","user2"]}'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数        | 类型  | 是否必需 | 描述                                           |
| :---------- | :---- | :------- | :--------------------------------- |
| `usernames` | Array | 是       | 要查询状态的用户 ID，**每次最多能传 100 个**。 |

## 响应示例

该接口不对用户 ID 进行校验。若查询的用户 ID 不存在，则返回的状态为 `offline`。

```json
{
  "action": "get batch user status",
  "data": [
    {
      "user1": "offline"
    },
    {
      "user2": "offline"
    }
  ],
  "timestamp": 1552280231926,
  "duration": 4
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述       |
| :------- | :-------- | :-------------------------------------------------------------- |
| `action` | String    | 执行的操作。在该响应中，该参数的值为 `get batch user status`，表示批量获取用户在线状态。                                                  |
| `data`   | JSON Array | 查询的用户的在线状态。<br/> 数据格式为："用户 ID": "当前在线状态"，例如，user1 的在线和离线状态分别为 "user1": "online" 和 "user1": "offline"。<br/> - `online`：客户端登录后和即时通讯 IM 服务器成功建立了长连接。<br/> - `offline`：iOS 和 Android 进程被杀或因网络问题断开连接，进入 `offline` 状态，此时可以接收消息的离线推送通知。 |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型    | 错误提示    | 可能原因      | 处理建议     |
| :-- | :------------ | :--------- | :--------- | :---------- |
| 400   | illegal_argument      | request body exceeds maximum limit, maximum limit is 100     | 请求 body 中 `usernames` 的用户数量超过 100 个。 | 请调整`usernames` 中传入的用户 ID 数量。 |
| 401 | unauthorized  | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。    |
| 404  | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key 不存在。 |  检查 `orgName` 和 `appName` 是否正确或[创建应用](/product/console/app_create.html)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。