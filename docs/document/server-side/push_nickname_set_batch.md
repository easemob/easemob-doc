# 批量设置离线推送时显示的昵称

## 功能说明

- 批量设置用户离线推送时显示的昵称。
- 单次请求最多可对 50 个用户 ID 设置。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/push/nickname
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
curl -X PUT 'https://XXX/XXX/XXX/push/nickname'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '[
      {"username":"user1", "push_nickname":"推送昵称-1"}, 
      {"username":"user2", "push_nickname":"推送昵称-2"}
]'
```

## 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body 参数

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------------ |
| `username`      | String | 是       | 需要修改用户推送昵称的用户 ID。单次请求最多可对 50 个用户 ID 设置。    |
| `push_nickname` | String | 是       | 离线推送时在接收方的客户端推送通知栏中显示的发送方的昵称。你可以自定义该昵称，长度不能超过 100 个字符。<br/>支持以下字符集：<br/> - 26 个小写英文字母 a-z；<br/> - 26 个大写英文字母 A-Z；<br/> - 10 个数字 0-9；<br/> - 中文；<br/> - 特殊字符。<br/><Container type="tip" title="提示">1. 若不设置昵称，推送时会显示发送方的用户 ID，而非昵称。<br/>2. 该昵称可与用户属性中的昵称设置不同，不过我们建议这两种昵称的设置保持一致。因此，修改其中一个昵称时，也需调用相应方法对另一个进行更新，确保设置一致。更新用户属性中的昵称的方法，详见 [设置用户属性](user_attribute_set.html)。</Container>       |

## 响应示例

```json
{
    "path": "/push",
    "uri": "http://XXX/XXX/XXX/push",
    "timestamp": 1719542740148,
    "organization": "XXX",
    "application": "6b58d05d-99c0-XXX-XXX-1ff3e95a3dc0",
    "entities": [
        {
            "push_nickname": "推送昵称-1",
            "username": "user1"
        },
        {
            "push_nickname": "推送昵称-2",
            "username": "user2"
        }
    ],
    "action": "put",
    "duration": 0,
    "applicationName": "XXX"
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                                                         |
| :-------------- | :----- | :------- |
| `entities`           | JSON Array  | 用户在推送通知中显示的昵称以及用户相关信息。     |
| - `push_nickname`  | String | 离线推送时在接收方的客户端推送通知栏中显示的发送方的昵称。  |
| - `username`        | String | 为哪个用户设置离线推送时显示的发送方昵称。    |

响应体中的其他参数说明如下表所示：

| 字段           | 类型   | 描述                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `action`          | String | 请求方法。                                                                     |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `applicationName` | String | 你在环信控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败。常见的异常类型如下表所示。

| HTTP 状态码 | 错误类型  | 错误提示   | 可能原因 | 处理建议        |
| :----- | :------- | :-------------------- | :----------- | :----------- |
| 400         | illegal_argument | put user push nicknames illegal empty request body | 请求 body 中没有携带设置的推送昵称。 | 设置请求 body 中的 `push_nickname` 参数。  |
| 400         | illegal_argument | put user push nicknames exceeds the limit          | 修改推送昵称的用户数量超过限制（单次请求最多可对 50 个用户 ID 设置）。  | 控制修改推送昵称的用户不要超过 50 个用户 ID。 |
| 400         | illegal_argument | XXX push nickname length exceeds the limit         | 推送昵称的长度超过限制。 | 控制设置的推送昵称长度不要超过 100 个字符。        |
| 401         | unauthorized     | Unable to authenticate (OAuth)                     | token 不合法，可能过期或 token 错误。| 使用新的 token 访问。 |

关于其他错误码，你可以参考 [常见错误码](push_error.html) 了解可能的原因。