# 管理用户属性

<Toc />

用户属性指实时消息互动用户的信息，如用户昵称、头像、邮箱、电话、性别、签名、生日等。

例如，在招聘场景下，利用用户属性功能，可以存储性别、邮箱、用户类型（面试者）、职位类型（web 研发）等。当查看用户信息时，可以直接查询服务器存储的用户属性信息。

环信即时通讯提供给开发者从服务端 REST API 接口管理相关用户属性信息的方式。

:::notice
为保证用户信息安全，环信即时通讯 IM 仅支持用户本人或 app 管理员设置用户属性。
:::

可以调用以下 REST API 来实现用户属性功能：

| 功能                   | 描述                                     |
| :------------------------- | :------------------------------------------- |
| 设置用户属性               | 设置指定的用户的属性。                   |
| 获取指定用户的所有用户属性 | 获取指定用户的所有属性。                 |
| 批量获取用户属性           | 根据指定的用户名列表和属性列表查询用户属性。 |
| 删除用户属性               | 删除指定用户的所有属性。             |
| 获取用户属性总量大小       | 获取该 app 下所有用户的属性总大小。  |

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `host`| String | 是    | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `org_name` | String | 是     | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是    | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `username` | String | 是   | 用户 ID。         |

### 响应参数

| 参数       | 类型         | 描述                                                         |
| :----------| :--------------| :-------------------------------------- |
| `action`    | String | 请求方式，即接口方法名。                                     |
| `organization`   | String   | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`  | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。   |
| `applicationName` | String| 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`           | String  | 请求 URL。                                                   |
| `path`       | String   | 请求路径，属于请求 URL 的一部分，开发者无需关注。            |
| `entities`    | Object   | 详细信息。                                                   |
| `data`       | Object | 实际获取的数据详情。                                         |
| `username`  | String | 用户 ID。                                                     |
| `data.nickname`    | String    | 用户昵称。                                                   |
| `data.ext`      | String  | 你自定义的用户属性扩展字段。                   |
| `data.avatarurl`   | String   | 用户头像 URL。                                                   |
| `timestamp`   | Long  | Unix 时间戳，单位为毫秒。                                    |
| `duration`  | Long  | 请求响应时间，单位为毫秒。                                   |

## 认证方式

环信即时通讯 IM REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的 鉴权方式，详见 [使用环信 App Token 鉴权](easemob_app_token.html)。

## 设置用户属性

用户属性的内容为一个或多个纯文本键值对，默认单一用户的属性总长不得超过 2 KB，默认一个 app 下所有用户的所有属性总长不得超过 10 GB。

请求示例中使用的键是 `avatarurl`、`ext`、`nickname`，你可以根据实际使用场景决定键值。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   |是否必需 | 描述      |
 | :-------------- | :----- | :---------------- | :------- |
 | `Content-Type`  | String | 是    | 内容类型。请填 `application/x-www-form-urlencoded`。 |
 |`Authorization`| String | 是    |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### 请求 body

请求 body 为 `x-www-form-urlencoded` 类型，发送请求时数据类型为 JSON String，长度不得超过 4 KB，包含以下字段：

| 字段    | 类型   | 描述   | 是否必填 |
| :------ | :----- | :----- | :------- |
| `Key`   | String | 属性名 | 是       |
| `Value` | String | 属性值 | 是       |

比如:

requestBody = ‘name=ken&employer=easemob&title=developer’

JSONString = ‘{“name”:“ken”, “employer”:“easemob”, “title”:“developer”}’

这个 JSONString 的总长度不得超过 4 KB。

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述                       |
| :---------| :------------ | :------------------------- |
| `data`    | JSON | 返回数据详情。包含你在本次请求中设置的用户属性键值对。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X PUT -H 'Content-Type: application/x-www-form-urlencoded' -H 'Authorization: Bearer <YourToken>' -d 'avatarurl=http://www.easemob.com/avatar.png&ext=ext&nickname=nickname' 'http://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

```json
{
    "timestamp":1620445147011,
    "data":{
        "ext":"ext",
        "nickname":"nickname",
        "avatarurl":"http://www.easemob.com/avatar.png"
    },
    "duration":166
}
```

## 获取用户属性

获取指定用户的所有用户属性键值对。需要在请求时对应填写 {username}，需要获取用户属性的用户 ID。

如果指定的用户或用户属性不存在，返回空数据 {}。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   |是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
|`Authorization`| String | 是   |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述                       |
| :---------| :------------ | :------------------------- |
| `data`    | Object | 用户属性键值对。|

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Content-Type: application/json' -H 'Authorization: Bearer <YourToken>' 'http://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

```json
{
    "timestamp":1620445147011,
    "data":{
        "ext":"ext",
        "nickname":"nickname",
        "avatarurl":"http://www.easemob.com/avatar.png"
    },
    "duration":166
}
```

## 批量获取用户属性

根据指定的用户名列表和属性列表，查询用户属性。

如果指定的用户或用户属性不存在，返回空数据 {}。 每次最多指定 100 个用户。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/metadata/user/get
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   |是否必需<div style="width: 80px;"></div> | 描述      |
| :-------------- | :----- | :---------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。 |
| `Authorization`| String | 是   | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

#### 请求 body

| 参数         | 类型  | 是否必需 | 描述                                                         |
| :----------- | :---- | :------- | :----------------------------------------------------------- |
| `targets`    | Array | 是   | 用户名列表，最多 100 个用户名。                              |
| `properties` | Array | 是   | 属性名列表，查询结果只返回该列表中包含的属性，不在该列表中的属性将被忽略。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型      | 描述                       |
| :---------| :------------ | :------------------------- |
| `data`    | Object | 用户属性键值对。|

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X POST -H 'Content-Type:  application/json' -H 'Authorization: Bearer <YourToken>' -d '{
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
}' 'http://XXXX/XXXX/XXXX/metadata/user/get'
```

#### 响应示例

```json
{
    "timestamp":1620448826647,
    "data":{
        "user1":{
            "ext":"ext",
            "nickname":"nickname",
            "avatarurl":"http://www.easemob.com/avatar.png"
        },
        "user2":{
            "ext":"ext",
            "nickname":"nickname",
            "avatarurl":"http://www.easemob.com/avatar.png"
        },
        "user3":{
            "ext":"ext",
            "nickname":"nickname",
            "avatarurl":"http://www.easemob.com/avatar.png"
        }
    },
    "duration":3
}
```

## 获取用户属性总量大小

获取该 app 下所有用户的属性数据大小，单位为字节。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/capacity
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   |是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是   | 该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数     | 类型  | 描述                                           |
| :---------- | :-------------| :------------------------- |
| `data`   |  Long   | 该 app 下所有用户属性的数据大小，单位为字节。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X GET -H 'Authorization: Bearer <YourToken>' 'http://XXXX/XXXX/XXXX/metadata/user/capacity'
```

#### 响应示例

```json
{
    "timestamp": 1620447051368,
    "data": 1673,
    "duration": 55
}
```

## 删除用户属性

删除指定用户的所有属性。如果指定的用户或用户属性不存在（可能已删除），也视为删除成功。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数    | 类型   |是否必需 | 描述      |
| :-------------- | :----- | :---------------- | :------- |
|`Authorization`| String | 是  |该用户或管理员的鉴权 token，格式为 `Bearer ${token}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。|

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型 | 描述                       |
| :------| :----- | :------------------------- |
| `data`   | Bool |  是否删除成功：<br/> - `true`：是；<br/> - `false`：否。    |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourToken> 替换为你在服务端生成的 Token

curl -X DELETE -H 'Authorization: Bearer <YourToken>' 'http://XXXX/XXXX/XXXX/metadata/user/user1'
```

#### 响应示例

```json
{
    "timestamp": 1616573382270,
    "duration": 10,
    "data": true
}
```