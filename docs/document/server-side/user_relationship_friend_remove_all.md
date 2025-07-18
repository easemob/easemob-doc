# 删除用户的所有好友

## 功能说明

- 删除用户的所有好友。
- 该接口为双向删除好友，即该接口调用后，该当前用户以及被删除的好友在彼此的好友列表中都会删除。
- 若当前用户为好友设置了好友备注，调用该接口后，好友备注会从服务端删除。
- 该接口不影响黑名单。若有些用户被当前用户加入了黑名单，调用该接口后，这些用户仍在黑名单中。

**调用频率上限**：100 次/秒/App Key

## HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/contacts/users/{username}
```

### 路径参数

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `username`  | String | 是         | 要删除该用户 ID 的所有好友。               |

其他参数及描述详见 [公共参数](#公共参数)。

### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `Content-Type`  | String | 是         | 内容类型。请填 `application/json`。               |
| `Accept`        | String | 是         | 内容类型。请填 `application/json`。           |
| `Authorization` | String | 是         | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

## HTTP 响应

### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

## 示例

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/contacts/users/XXXX'
```

### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/contacts/users/XXXX",
  "uri": "https://XXXX/XXXX/XXXX/contacts/users/XXXX",
  "entities": [],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| 401  | unauthorized | Unable to authenticate (OAuth) | Token 不合法，可能过期或 Token 错误。 | 使用新的 Token 访问。 |
| 429 | reach_limit | This request has reached api limit. | 接口调用超过频率限制。 | 联系商务调整限流或者控制调用速率。 |
| 403   | forbidden_service_operation | Service operation not allowed | app 或用户被封禁。 | 先解禁 app 或用户后再调用该接口。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

