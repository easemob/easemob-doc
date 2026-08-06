# 设置用户属性

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

环信 IM 提供 RESTful API 接口方便开发者管理服务端的用户属性信息。

:::tip
为保证用户信息安全，环信即时通讯 IM 仅支持用户本人或 app 管理员设置用户属性。 
:::

## 功能说明

- 设置单个用户的属性。
- 用户属性的内容为一个或多个纯文本键值对。
- 默认单个用户的属性总长度不能超过 2 KB，默认单个 app 下所有用户的属性总长度不能超过 10 GB。
- 请求示例中使用的键为 `avatarurl`、`ext`、`nickname`，你可以根据实际使用场景确定键值。

## 调用频率上限

100 次/秒/App Key

## 请求 URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| 参数              | 类型   | 是否必需 | 描述                |
| :---------------- | :----- | :------- | :------------------ |
| `username`  | String | 是       | 设置该用户 ID 的属性。 |

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

## 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/user/user1'  \
-H 'Content-Type: application/x-www-form-urlencoded'  \
-H 'Authorization: Bearer <YourAppToken>'   \
-d 'avatarurl=https://www.easemob.com/avatar.png&ext=ext&nickname=nickname' 
```

## 请求 header 参数

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/x-www-form-urlencoded`。          |

关于 `Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

## 请求 body

请求 body 为 `x-www-form-urlencoded` 类型，包含以下字段：

| 字段    | 类型   | 描述     | 是否必需 |
| :------ | :----- | :------- | :------- |
| `Key`   | String | 属性名称 | 是       |
| `Value` | String | 属性值   | 是       |

关于用户属性，客户端针对用户的昵称、头像 URL、联系方式、邮箱、性别、签名、生日和扩展字段默认使用以下键名。调用该 RESTful 接口设置用户属性时，若要确保在客户端能够获取设置，请求中必须传以下键名与客户端保持一致，键值可根据实际使用场景确定：

| 字段        | 描述             |
| :---------- | :-------------------------------------- |
| `nickname`  | 用户昵称。长度在 64 个字符内。                                                                    |
| `avatarurl` | 用户头像 URL 地址。长度在 256 个字符内。                                                          |
| `phone`     | 用户联系方式。长度在 32 个字符内。                                                                |
| `mail`      | 用户邮箱。长度在 64 个字符内。                                                                    |
| `gender`    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - `0`：未知。 |
| `sign`      | 用户签名。长度在 256 个字符内。                                                                   |
| `birth`     | 用户生日。长度在 64 个字符内。                                                                    |
| `ext`       | 扩展字段。                                                                                        |

## 响应示例

```json
{
  "timestamp": 1620445147011,
  "data": {
    "ext": "ext",
    "nickname": "nickname",
    "avatarurl": "https://www.easemob.com/avatar.png"
  },
  "duration": 166
}
```

## 响应 body 字段

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                                                       |
| :----- | :--- | :--------------------------------------------------------- |
| `data` | JSON | 响应中的数据详情，包含你在本次请求中设置的用户属性键值对。 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。                                     |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。    |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the user defined limit, {}Bytes        | 单个用户的用户属性用量超过限制。默认单个用户的属性总长度不得超过 2 KB。 | 调整用量或联系商务提升用量上限。 |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the current mysql column size, {}Bytes        | 单个用户的用户属性超过字段长度限制。关于用户属性字段（例如，用户昵称）的长度限制，详见[设置用户属性](/document/server-side/user_attribute_set.html)。  | 减少用户属性字段的长度。    |
| 403     | FORBIDDEN          | total size of user metadata for this app exceeds the user defined limit, {}Bytes        | 整个应用的用户属性用量超过限制。默认单个 app 下所有用户的属性总长度不得超过 10 GB。   | 调整用量或联系商务提升用量上限。    |
| 409 | CONFLICT | Failed to xxx. Concurrent xxx not allowed | 多个请求同时修改同一个资源的并发操作冲突。 | 减少并发请求操作。 |
| 415 | UNSUPPORTED_MEDIA_TYPE | Content-Type 'application/json;charset=UTF-8' is not supported. | 请求的 `Content-Type` 不受接口支持，使用了 JSON 请求体。 | 将 `Content-Type` 改为 `application/x-www-form-urlencoded`，并使用表单格式提交请求 body。 |
| 500     | INTERNAL_SERVER_ERROR          | update metadata failed        | 服务异常导致更新用户属性失败。  |     |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。