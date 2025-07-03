# 单向删除会话

## 功能说明

- 你可以从服务器中单向删除会话，并且设置是否删除该会话在服务端的漫游消息。
- 删除会话后，该用户将从服务器获取不到该会话。该会话的其他参与聊天用户仍然可以从服务器获取会话内容。
- 该接口目前支持单聊会话和群组会话。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/user_channel
```

#### 路径参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username` | String | 是       | 要删除会话的用户的唯一标识符，即用户 ID。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                  |
| :-------------- | :----- | :------- | :----------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数          | 类型   | 是否必需 | 描述   |
| :------------ | :----- | :------- | :------------------------- |
| `channel`     | String | 是       | 要删除的会话 ID。该参数的值取决于会话类型 `type` 的值:<br/> - `type` 为 `chat`，即单聊时，会话 ID 为对端用户 ID；<br/> - `type` 为 `groupchat`，即群聊时，会话 ID 为群组 ID。 |
| `type`        | String | 是       | 会话类型。<br/> - `chat`：单聊会话；<br/> -`groupchat`：群聊会话。       |
| `delete_roam` | Bool   | 是       | 是否删除该会话在服务端的漫游消息。<br/> - `true`：是。若删除了该会话的服务端消息，则用户无法从服务器拉取该会话的漫游消息。<br/> - `false`：否。用户仍可以从服务器拉取该会话的漫游消息。 |

## HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数              | 类型   | 描述          |
| :---------------- | :----- | :------------------------------- |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `uri`             | String | 请求 URL。                                                                     |
| `timestamp`       | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                          |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `entities`        | JSON Array   | 响应实体。                                                                     |
| `action`          | String | 请求方法。                                                                     |
| `data`          | JSON | 删除结果详情。                                                                     |
| `data.result`          | String | 删除结果，`ok` 表示成功，失败则直接返回错误码和原因。            |
| `duration`        | Int    | 从发送 HTTP 请求到响应的时长，单位为毫秒。                                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

## 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE 'https://XXXX/XXXX/XXXX/users/u1/user_channel' \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-d '

{ "channel": "u2", "type": "chat", "delete_roam": true }
'
```

#### 响应示例

```json
{
  "path": "/users/user_channel",
  "uri": "https://XXXX/XXXX/XXXX/users/u1/user_channel",
  "timestamp": 1638440544078,
  "organization": "XXXX",
  "application": "c3624975-XXXX-XXXX-9da2-ee91ed4c5a76",
  "entities": [],
  "action": "delete",
  "data": {
    "result": "ok"
  },
  "duration": 3,
  "applicationName": "XXXX"
}
```

## 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型               | 错误提示                  | 可能原因             | 处理建议      |
|:---------|:-------------------|:----------------------|:-----------------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | 请求体格式不正确。  | 检查请求体内容是否合法(字段类型是否正确) 。    |
| 400      | illegal_argument | field channel cannot be null or empty | 请求参数 `channel` 是空字符串 | 输入正确的请求参数 `channel`。|
| 400      | illegal_argument | field type cannot be null or empty | 请求参数 `type` 是空字符串。 | 输入正确的请求参数 `type`。 |
| 400      | illegal_argument | field delete_roam cannot be null | 请求参数 `delete_roam` 是空。 | 输入正确的请求参数`delete_roam`。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。