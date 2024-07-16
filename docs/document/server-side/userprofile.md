# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

环信 IM 提供 RESTful API 接口方便开发者管理服务端的用户属性信息。

:::notice
为保证用户信息安全，环信即时通讯 IM 仅支持用户本人或 app 管理员设置用户属性。
:::

可以调用以下 RESTful API 实现用户属性功能：

| 功能                       | 描述                                         |
| :------------------------- | :------------------------------------------- |
| 设置用户属性               | 设置指定的用户属性。                         |
| 获取指定用户的所有用户属性 | 获取指定用户的所有用户属性。                 |
| 批量获取用户属性           | 根据指定的用户名列表和属性列表查询用户属性。 |
| 删除用户属性               | 删除指定用户的所有属性。                     |
| 获取 app 下用户属性总大小  | 获取该 app 下所有用户的属性总大小。          |

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下条件：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                            |
| :--------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username` | String | 是       | 用户 ID。                                                                                                                                       |

### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `entities`        | Object | 响应实体。                                                                     |
| `username`        | String | 用户 ID。                                                                      |
| `data.nickname`   | String | 用户昵称。                                                                     |
| `data.ext`        | String | 自定义的用户属性扩展字段。                                                     |
| `data.avatarurl`  | String | 用户头像 URL。                                                                 |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。                                     |

## 认证方式

环信即时通讯 IM REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的 鉴权方式，详见 [使用环信 App Token 鉴权](easemob_app_token.html)。

## 设置用户属性

用户属性的内容为一个或多个纯文本键值对，默认单个用户的属性总长度不能超过 2 KB，默认单个 app 下所有用户的属性总长度不能超过 10 GB。利用该 API，每次只能设置一个用户的用户属性。

请求示例中使用的键为 `avatarurl`、`ext`、`nickname`，你可以根据实际使用场景确定键值。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/x-www-form-urlencoded`。                                                                 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

请求 body 为 `x-www-form-urlencoded` 类型，长度不得超过 4 KB，包含以下字段：

| 字段    | 类型   | 描述     | 是否必需 |
| :------ | :----- | :------- | :------- |
| `Key`   | String | 属性名称 | 是       |
| `Value` | String | 属性值   | 是       |

调用该 RESTful 接口设置用户昵称、头像、联系方式、邮箱、性别、签名、生日和扩展字段时，若要确保在客户端能够获取设置，请求中必须传以下键名，根据实际使用场景确定键值：

| 字段        | 类型   | 描述                                                                                              |
| :---------- | :----- | :------------------------------------------------------------------------------------------------ |
| `nickname`  | String | 用户昵称。长度在 64 个字符内。                                                                    |
| `avatarurl` | String | 用户头像 URL 地址。长度在 256 个字符内。                                                          |
| `phone`     | String | 用户联系方式。长度在 32 个字符内。                                                                |
| `mail`      | String | 用户邮箱。长度在 64 个字符内。                                                                    |
| `gender`    | Int    | 用户性别：<br/> - `1`：男；<br/> - `2`：女；<br/> - （默认）`0`：未知；<br/> - 设置为其他值无效。 |
| `sign`      | String | 用户签名。长度在 256 个字符内。                                                                   |
| `birth`     | String | 用户生日。长度在 64 个字符内。                                                                    |
| `ext`       | String | 扩展字段。                                                                                        |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                                                       |
| :----- | :--- | :--------------------------------------------------------- |
| `data` | JSON | 响应中的数据详情，包含你在本次请求中设置的用户属性键值对。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/x-www-form-urlencoded' -H 'Authorization: Bearer <YourAppToken>' -d 'avatarurl=https://www.easemob.com/avatar.png&ext=ext&nickname=nickname' 'https://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。    |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the user defined limit, {}Bytes        | 单个用户的用户属性用量超过限制。默认单个用户的属性总长度不得超过 2 KB。 | 调整用量或联系商务提升用量上限。 |
| 403     | FORBIDDEN         | size of metadata for this single user exceeds the current mysql column size, {}Bytes        | 单个用户的用户属性超过字段长度限制。关于用户属性字段（例如，用户昵称）的长度限制，详见[设置用户属性](/document/server-side/userprofile.html#设置用户属性)。  | 减少用户属性字段的长度。    |
| 403     | FORBIDDEN          | total size of user metadata for this app exceeds the user defined limit, {}Bytes        | 整个应用的用户属性用量超过限制。默认单个 app 下所有用户的属性总长度不得超过 10 GB。   | 调整用量或联系商务提升用量上限。    |
| 500     | INTERNAL_SERVER_ERROR          | update metadata failed        | 服务异常导致更新用户属性失败。  |     |


## 获取用户属性

获取单个用户的全部用户属性键值对。需要在请求中填写 {username}，指定获取用户属性的用户 ID。

如果指定的用户或用户属性不存在，返回空数据 {}。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :---------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                                                                  |
| :----- | :----- | :------------------------------------------------------------------------------------ |
| `data` | Object | 用户属性键值对。<br/>如果 `data` 为空，请确认用户 ID 是否存在或该用户是否有用户属性。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | 鉴权失败。例如，使用的 token 与路径参数 `username` 不匹配。   | 使用正确的 token。     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | 用户属性功能未开通。  | 联系商务开通用户属性功能。 |
| 500     | INTERNAL_SERVER_ERROR          |         | 服务未知异常。  |    

## 批量获取用户属性

根据指定的用户 ID 列表和属性列表，查询用户属性。

如果指定的用户 ID 或用户属性不存在，返回空数据 {}。 每次最多可获取 100 个用户的属性。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/metadata/user/get
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述     |
| :-------------- | :----- | :--------------------- | :--------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是         | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型  | 是否必需 | 描述                                                                       |
| :----------- | :---- | :------- | :-------------------- |
| `targets`    | Array | 是       | 用户 ID 列表，最多可传 100 个用户 ID。                                     |
| `properties` | Array | 是       | 属性名列表，查询结果只返回该列表中包含的属性，不在该列表中的属性将被忽略。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                                                                |
| :----- | :----- | :---------------------------------------------------------------------------------- |
| `data` | Object | 用户属性键值对。<br/>如果 `data` 为空，请确认用户 ID 是否存在或用户是否有用户属性。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
  "properties": [
    "avatarurl",
    "ext",
    "nickname"
  ],
  "targets": [
    "user1",
    "user2",
    "user3"
  ]
}' 'https://XXXX/XXXX/XXXX/metadata/user/get'
```

#### 响应示例

```json
{
  "timestamp": 1620448826647,
  "data": {
    "user1": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user2": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user3": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    }
  },
  "duration": 3
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | BAD_REQUEST  | exceed allowed batch size %s   | 超过允许获取的用户数的用户属性。每次最多可获取 100 个用户的用户属性。  |  减少批量获取用户属性的用户数。   |
| 401     | metadata_error  | auth error        | 鉴权失败。   |     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。  |

## 获取 app 下用户属性总大小

获取该 app 下所有用户的属性数据大小，单位为字节。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/capacity
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :----------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型 | 描述                                          |
| :----- | :--- | :-------------------------------------------- |
| `data` | Long | 该 app 下所有用户属性的数据大小，单位为字节。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/metadata/user/capacity'
```

#### 响应示例

```json
{
  "timestamp": 1620447051368,
  "data": 1673,
  "duration": 55
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized          | unauthorized        | 鉴权失败。   | 获取应用容量时需要使用 app 级别权限。    |
| 401     | metadata_error          | auth error        | 鉴权失败。   | 使用正确的 token。     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | 用户属性功能未开通。  | 联系商务开通用户属性功能。   |

## 删除用户属性

删除单个用户的所有属性。如果指定的用户或用户属性不存在（可能已删除），也视为删除成功。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型 | 描述                                                                                                                      |
| :----- | :--- | :------------------------------------------------------------------------------------------------------------------------ |
| `data` | Bool | 是否删除成功：<br/> - `true`：是。如果指定的用户不存在，或指定用户的用户属性不存在，也视为删除成功。<br/> - `false`：否。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

```json
{
  "timestamp": 1616573382270,
  "duration": 10,
  "data": true
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | 鉴权失败。   |  使用正确的 token。    |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | 用户属性功能未开通。  | 联系商务开通用户属性功能。 |
