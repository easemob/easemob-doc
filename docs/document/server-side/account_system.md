# 用户体系集成

<Toc />

本文展示如何调用环信即时通讯 RESTful API 实现用户体系建立和管理，包括用户注册、获取、修改、删除、封禁、解禁、强制下线等。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用环信 app token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

以下表格列举了环信即时通讯 RESTful API 的公共请求参数和响应参数：

### 请求参数

| 参数       | 类型   | 描述                                                                                                                 |
| :--------- | :----- | :------------------------------------------------------------------------------------------------------------------- |
| `host`     | String | 你在环信即时通讯云控制台注册项目时所在的 [集群服务器地址](overview.html#请求域名)。 |
| `org_name` | String | 即时通讯服务分配给每个企业（组织）的唯一标识。你可以通过控制台获取该字段。                                           |
| `app_name` | String | 你在环信即时通讯云控制台注册项目时填入的应用名称。                                                                   |

### 响应参数

| 参数                 | 类型   | 描述                                                                                                                                          |
| :------------------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`             | String | 请求方式。                                                                                                                                    |
| `organization`       | String | 即 `org_name`，即时通讯服务分配给每个企业（组织）的唯一标识。你可以通过控制台获取该字段。                                                     |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。                                                                                                  |
| `applicationName`    | String | 即 `app_name`，你在环信即时通讯云控制台注册项目时填入的应用名称。                                                                             |
| `uri`                | String | 请求 URL。                                                                                                                                    |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                                                                                             |
| `entities`           | JSON   | 详细信息。                                                                                                                                    |
| `entities.uuid`      | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成 User Token。                                                     |
| `entities.type`      | String | 对象类型，无需关注。                                                                                                                          |
| `entities.created`   | Long   | 注册用户的 Unix 时间戳，单位为毫秒。                                                                                                          |
| `entities.modified`  | Long   | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。                                                                                              |
| `entities.username`  | String | 用户 ID，长度不可超过 64 个字节。                                                                                                             |
| `entities.activated` | Bool   | 用户是否为活跃状态：<br/> - `true`：用户为活跃状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用解禁用户解除封禁。 |
| `data`               | JSON   | 实际获取的数据详情。                                                                                                                          |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                                                                                         |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。                                                                                                    |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

Authorization：`Bearer ${YourAppToken}`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 REST API 均需使用 App Token 的鉴权方式，详见 [使用 Token 鉴权](easemob_app_token.html)。

## 注册用户

### 开放注册单个用户

用户可以在登录客户端 SDK 后自行通过账号密码注册账号的接口。一般在体验 Demo 和测试开发环境时使用，使用前需先在环信即时通讯 IM 管理后台开通相应应用的 [开放注册](https://console.easemob.com/app/im-service/detail) 开关。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users
```

##### 请求 Headers

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                          |

##### 请求 body

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                                                                                                    |
| :--------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `username` | String | 是       | 用户 ID，长度不可超过 64 个字节长度。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 26 个大写英文字母 A-Z；<br/>- 10 个数字 0-9；<br/>- “_”, “-”, “.”。 <br/>:::notice<br/>- 该参数不区分大小写，因此 `Aa` 和 `aa` 为相同用户名；<br/>- 请确保同一个 app 下，`username` 唯一；<br/>- `username` 用户 ID 是会公开的信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。::: |
| `password` | String | 是       | 用户的登录密码，长度不可超过 64 个字符。                                                                                                                                                                                                                                                                                                                |
| `nickname` | String | 否       | 推送消息时，在消息推送通知栏内显示的用户昵称，并非用户个人信息的昵称。长度不可超过 100 个字符。支持以下字符集：<br/> -  26 个小写英文字母 a-z；<br/> - 26 个大写英文字母 A-Z；<br/> - 10 个数字 0-9；<br/> - 中文；<br/> - 特殊字符。                                                                                                                   |

其他参数及说明详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                                           |
| :------------------ | :----- | :--------------------------------------------- |
| `entities.username` | String | 用户 ID。                                      |
| `entities.password` | String | 用户的登录密码。                               |
| `entities.nickname` | String | 推送消息时，在消息推送通知栏内显示的用户昵称。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
curl -X POST -i "https://XXXX.com/XXXX-demo/XXXX/users" -d '{"username":"user1","password":"123","nickname":"testuser"}'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-e978-XXXX-XXXX-5d598d5f8402",
  "path": "/users",
  "uri": "https://XXXX.com/XXXX-demo/XXXX/users",
  "entities": [
    {
      "uuid": "0ffe2d80-XXXX-XXXX-8d66-279e3e1c214b",
      "type": "user",
      "created": 1542795196504,
      "modified": 1542795196504,
      "username": "user1",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542795196515,
  "duration": 0,
  "organization": "XXXX-demo",
  "applicationName": "XXXX"
}
```

### 授权注册单个用户

注册单个用户，需要授权注册模式。推荐授权注册模式，即注册环信即时通讯 IM 账号时，必须携带管理员身份认证信息。利用授权注册模式，可防止已获取了注册 URL 和知晓注册流程的某些人恶意向服务器大量注册垃圾用户。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

##### 请求 body

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                                                                                                    |
| :--------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `username` | String | 是       | 用户 ID，长度不可超过 64 个字节长度。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 26 个大写英文字母 A-Z；<br/>- 10 个数字 0-9；<br/>- “_”, “-”, “.”。 <br/>:::notice<br/>- 该参数不区分大小写，因此 `Aa` 和 `aa` 为相同用户名；<br/>- 请确保同一个 app 下，`username` 唯一；<br/>- `username` 用户 ID 是会公开的信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。::: |
| `password` | String | 是       | 用户的登录密码，长度不可超过 64 个字符。                                                                                                                                                                                                                                                                                                                |
| `nickname` | String | 否       | 推送消息时，在消息推送通知栏内显示的用户昵称，并非用户个人信息的昵称。长度不可超过 100 个字符。支持以下字符集：<br/> -  26 个小写英文字母 a-z；<br/> - 26 个大写英文字母 A-Z；<br/> - 10 个数字 0-9；<br/> - 中文；<br/> - 特殊字符。                                                                                                                   |

其他参数及说明详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                                           |
| :------------------ | :----- | :--------------------------------------------- |
| `entities.username` | String | 用户 ID。                                      |
| `entities.password` | String | 用户的登录密码。                               |
| `entities.nickname` | String | 推送消息时，在消息推送通知栏内显示的用户昵称。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '[
   {
     "username": "user1",
     "password": "123",
     "nickname": "testuser"
   }
 ]' 'https://XXXX/XXXX/XXXX/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "0ffe2d80-XXXX-XXXX-8d66-279e3e1c214b",
      "type": "user",
      "created": 1542795196504,
      "modified": 1542795196504,
      "username": "user1",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542795196515,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

### 批量注册用户

批量注册是授权注册方式，服务端需要校验有效的 token 权限才能进行操作。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

##### 请求 body

:::notice
一个请求内最多可注册 60 个用户 ID。
:::

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                  |
| :--------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `username` | String | 是       | 用户 ID，长度不可超过 64 个字节长度。不可设置为空。支持以下字符集：<br/>- 26 个小写英文字母 a-z；<br/>- 26 个大写英文字母 A-Z；<br/>- 10 个数字 0-9；<br/>- “_”, “-”, “.”。 <br/>:::notice<br/>- 该参数不区分大小写，因此 `Aa` 和 `aa` 为相同用户名；<br/>- 请确保同一个 app 下，`username` 唯一；<br/>- `username` 用户 ID 是会公开的信息，请勿使用 UUID、邮箱地址、手机号等敏感信息。:::                 |
| `password` | String | 是       | 用户的登录密码，长度不可超过 64 个字符。                                                                                                                                                                                              |
| `nickname` | String | 否       | 推送消息时，在消息推送通知栏内显示的用户昵称，并非用户个人信息的昵称。长度不可超过 100 个字符。支持以下字符集：<br/> -  26 个小写英文字母 a-z；<br/> - 26 个大写英文字母 A-Z；<br/> - 10 个数字 0-9；<br/> - 中文；<br/> - 特殊字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                                           |
| :------------------ | :----- | :--------------------------------------------- |
| `entities.username` | String | 用户 ID。                                      |
| `entities.nickname` | String | 推送消息时，在消息推送通知栏内显示的用户昵称。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例一

注册 2 个用户：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H "Authorization: Bearer <YourAppToken>" -i  "https://XXXX/XXXX/XXXX/users" -d '[{"username":"user1", "password":"123","nickname":"testuser1"}, {"username":"user2", "password":"456","nickname":"testuser2"}]'
```

##### 响应示例一

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
      "type": "user",
      "created": 1541587920710,
      "modified": 1541587920710,
      "username": "user1",
      "activated": true,
      "nickname": "testuser1"
      },
    {
      "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
      "type": "user",
      "created": 1541587920712,
      "modified": 1541587920712,
      "username": "user2",
      "activated": true,
      "nickname": "testuser2"
      }  ],
  "timestamp": 1541587920714,
  "data": [],
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

##### 请求示例二

当请求 body 中存在已经注册过的用户 user 3 时，user 3 注册失败并在响应 body 中的 data 数组内返回，用户 user 1、user 2 仍然注册成功。

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H "Authorization: Bearer <YourAppToken>" -i  "https://XXXX/XXXX/XXXX/users" -d '[{"username":"user1", "password":"123","nickname":"testuser1"}, {"username":"user2", "password":"456","nickname":"testuser2"}, {"username":"user3", "password":"789","nickname":"testuser3"}]'
```

##### 响应示例二

```json
{
  "action": "post",
  "application": "22bcffa0-XXXX-XXXX-9df8-516f6df68c6d",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/testapp/users",
  "entities": [
  {
    "uuid": "278b5e60-XXXX-XXXX-8f9b-d5d83ebec806",
    "type": "user",
    "created": 1541587920710,
    "modified": 1541587920710,
    "username": "user1",
    "activated": true,
    "nickname": "testuser1"
    },
  {
    "uuid": "278bac80-XXXX-XXXX-b192-73e4cd5078a5",
    "type": "user",
    "created": 1541587920712,
    "modified": 1541587920712,
    "username": "user2",
    "activated": true,
    "nickname": "testuser2"    }  ],
    "timestamp": 1541587920714,
    "data": [        {
    "username": "user3",
    "registerUserFailReason":
    "the user3 already exists"
}    ],
"duration": 0,
"organization": "XXXX",
"applicationName": "XXXX"}
```

## 获取用户详情

### 获取单个用户的详情

获取单个应用用户的详细信息接口。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段                                          | 类型   | 描述                                                                                                                                             |
| :-------------------------------------------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `entities.username`                           | String | 用户 ID。                                                                                                                                        |
| `entities.nickname`                           | String | 推送消息时，在消息推送通知栏内显示的用户昵称。                                                                                                   |
| `entities.notification_display_style`         | Int    | 消息推送方式：<br/> - “0”：仅通知；<br/> - “1”：通知以及消息详情，没有设置返不会返回。                                                           |
| `entities.notification_no_disturbing`         | Bool   | 是否开启免打扰。<br/> - `true`：免打扰开启。若用户未设该参数，则响应中不返回。<br/> - `false`：免打扰关闭。                                      |
| `entities.notification_no_disturbing_start`   | String | 免打扰的开始时间。例如，“8” 代表每日 8:00 开启免打扰。若用户未设该参数，则响应中不返回。                                                         |
| `entities.notification_no_disturbing_end`     | String | 免打扰的结束时间。例如，“18” 代表每日 18:00 关闭免打扰。若用户未设该参数，则响应中不返回。                                                       |
| `entities.notification_ignore_63112447328257` | Bool   | 是否屏蔽了群组消息的离线推送的设置。参数中的数字表示群组 ID。 <br/> -`true`：已屏蔽。<br/> - `false`：未屏蔽。若用户未设该参数，则响应中不返回。 |
| `entities.notifier_name`                      | String | 客户端推送证书名称。若用户未设置推送证书名称，则响应中不返回。                                                                                   |
| `entities.device_token`                       | String | 推送 token。若用户没有推送 token，则响应中不返回。                                                                                               |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/XXXX'
```

##### 响应示例

```json
{
  "action": "get",
  "path": "/users",
  "uri": "http://XXXX/XXXX/XXXX/users/XXXX",
  "entities": [
    {
      "uuid": "0ffe2d80-XXXX-XXXX-8d66-279e3e1c214b",
      "type": "user",
      "created": 1542795196504,
      "modified": 1542795196504,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
      }  ],
 "timestamp": 1542798985011,
 "duration": 6,
 "count": 1
}
```

### 批量获取用户详情

该接口查询多个用户的信息列表，按照用户创建时间顺序返回。你可以指定要查询的用户数量（limit）。

若数据库中的用户数量大于你要查询的用户数量（limit），返回的信息中会携带游标 “cursor” 标示下次数据获取的开始位置。你可以分页获取多个用户的详情，直到返回的信息中不再包含 cursor，即已经达到最后一页。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users?limit={N}&{cursor}
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

##### 请求 body

| 参数     | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                    |
| :------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `limit`  | Int    | 否       | 请求查询用户的数量。取值范围[1,100]，默认值为 10。若实际用户数量超过 100，返回 100 个用户。                                                                                                                                                                             |
| `cursor` | String | 否       | 开始获取数据的游标位置，用于分页显示用户列表。第一次发起批量查询用户请求时若不设置 `cursor`，请求成功后会获得第一页用户列表。从响应 body 中获取 `cursor`，并在下一次请求的 URL 中传入该 `cursor`，直到响应 body 中不再有 `cursor` 字段，则表示已查询到 app 中所有用户。 |

其他参数及说明详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                                          | 类型   | 描述                                                                                                                        |
| :-------------------------------------------- | :----- | :-------------------------------------------------------------------------------------------------------------------------- |
| `entities.username`                           | String | 用户 ID。                                                                                                                   |
| `entities.nickname`                           | String | 推送消息时，在消息推送通知栏内显示的用户昵称。                                                                              |
| `entities.notification_display_style`         | Int    | 消息推送方式：<br/> - “0”：仅通知；<br/> - “1”：通知以及消息详情。若用户未设置该参数，则响应中不会返回。                    |
| `entities.notification_no_disturbing`         | Bool   | 是否开启免打扰模式。<br/> - `true`：免打扰开启。若用户未设置改参数，则响应中不返回。<br/> - `false`：代表免打扰关闭。       |
| `entities.notification_no_disturbing_start`   | String | 免打扰的开始时间。例如， “8” 代表每日 8:00 开启免打扰。若用户未设该参数，则响应中不返回。                                   |
| `entities.notification_no_disturbing_end`     | String | 免打扰的结束时间。例如， “18” 代表每日 18:00 关闭免打扰。若用户未设该参数，则响应中不返回。                                 |
| `entities.notification_ignore_63112447328257` | Bool   | 是否屏蔽了群组消息的离线推送的设置。数字表示群组 ID。 <br/> -`true`：已屏蔽。 <br/> - `false`：未屏蔽，没有设置则不会返回。 |
| `entities.notifier_name`                      | String | 客户端推送证书名称。若用户未设置推送证书名称，则响应中不返回。                                                              |
| `entities.device_token`                       | String | 推送 token。若用户没有推送 token，则响应中不返回。                                                                          |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例一

按照注册时间的顺序查询 2 个用户的信息列表：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users?limit=2'
```

使用返回的 cursor 获取下一页

```json
将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX2tB'
```

##### 响应示例一

返回注册时间较早的 2 个 用户的信息列表：

```json
{
  "action": "get",
  "params":
  {
    "limit": [      "2"    ]
    },
    "path": "/users",
    "uri": "http://XXXX/XXXX/XXXX/users",
    "entities": [
      {
        "uuid": "ab90eff0-XXXX-XXXX-9174-8f161649a182",
         "type": "user",
         "created": 1542356511855,
         "modified": 1542356511855,
         "username": "XXXX",
         "activated": true,
         "nickname": "user1"
         },
      {
        "uuid": "b2aade90-XXXX-XXXX-a974-f3368f82e4f1",
        "type": "user",
        "created": 1542356523769,
        "modified": 1542356523769,
        "username": "user2",
        "activated": true,
        "nickname": "user2"
        }  ],
"timestamp": 1542558467056,
"duration": 11,
"cursor": "LTgzXXXX2tB",
"count": 2
}
```

##### 请求示例二

使用响应示例一中的 cursor，继续按照注册时间的顺序查询下一页用户列表，该页面用户数量为 2：

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX  2tB'
```

##### 响应示例二

继续返回 2 个 用户的信息列表：

```json
{
  "action": "get",
  "params":
  {
    "cursor": [
      "LTgzXXXX2tB"
      ],
    "limit": [
      "2"    ]
    },
  "path": "/users",
  "uri": "http://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "fef7f250-XXXX-XXXX-ba39-0fed7dcc3cdd",
      "type": "user",
      "created": 1542361376245,
      "modified": 1542361376245,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
      }  ],
  "timestamp": 1542559337702,
  "duration": 2,
  "count": 1
}
```

## 删除用户账号

### 删除单个用户

删除一个用户。如果此用户是群主或者聊天室所有者，系统会同时删除对应的群组和聊天室。请在操作时进行确认。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 参数                | 类型   | 描述               |
| :------------------ | :----- | :----------------- |
| `entities.username` | String | 删除的用户的 ID。  |
| `entities.nickname` | String | 删除的用户的昵称。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "ab90eff0-XXXX-XXXX-9174-8f161649a182",
      "type": "user",
      "created": 1542356511855,
      "modified": 1542356511855,
      "username": "XXXX",
      "activated": true,
      "nickname": "user1"
      }  ],
  "timestamp": 1542559539776,
  "duration": 39,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

### 批量删除用户

删除某个 App 下指定数量的用户账号。建议一次删除的用户数量不要超过 100。需要注意的是，这里只指定了要删除的用户数量，并未指定要删除的具体用户，你可以在响应中查看删除的用户。

如果删除的多个用户中包含群组或者聊天室的管理员，该用户管理的群组和聊天室也会相应被删除。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述               |
| :------------------ | :----- | :----------------- |
| `entities.username` | String | 删除的用户的 ID。  |
| `entities.nickname` | String | 删除的用户的昵称。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users?limit=2'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "params": {
    "limit": [
      "2"
    ]
  },
  "path": "/users",
  "uri": "https://XXXX/XXXX/testapp/users",
  "entities": [
    {
      "uuid": "b2aade90-XXXX-XXXX-a974-f3368f82e4f1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    },
    {
      "uuid": "b98ad170-XXXX-XXXX-XXXX-7f76daa76557",
      "type": "user",
      "created": 1542356535303,
      "modified": 1542356535303,
      "username": "user3",
      "activated": true,
      "nickname": "user3"
    }
  ],
  "timestamp": 1542867197779,
  "duration": 504,
  "organization": "XXXX",
  "applicationName": "testapp",
  "cursor": "LTgXXXXDNR"
}
```

## 修改用户密码

### 修改用户密码

可以通过服务端接口修改用户的登录密码，不需要提供原密码。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/password
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

##### 请求 body

请求包体为 JSON Object 类型，包含以下字段：

| 参数          | 类型   | 是否必需 | 描述                  |
| :------------ | :----- | :------- | :-------------------- |
| `newpassword` | String | 是       | ${新密码指定的字符串} |

其他参数及说明详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token，<YourPassword> 替换为你设置的新密码

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{     "newpassword": "<YourPassword>"   }' 'http://XXXX/XXXX/XXXX/users/user1/password'
```

##### 响应示例

```json
{
  "action": "set user password",
  "timestamp": 1542595598924,
  "duration": 8}
```

## 获取用户在线状态（status）

### 获取单个用户在线状态（status）

查看一个用户的在线状态。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/status
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                                                                                            |
| :-------------- | :----- | :-------------------------------------------------------------------------------------------------------------- |
| `data.username` | String | 数据格式为：“用户名：当前在线状态”，例如，user1 的在线和离线状态分别为 “user1”: “online” 和”user1”: “offline”。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/status'
```

##### 响应示例

```json
{
  "action": "get",
  "uri": "http://XXXX/XXXX/XXXX/users/user1/status",
  "entities": [],
  "data": {
    "user1": "offline"
  },
  "timestamp": 1542601284531,
  "duration": 4,
  "count": 0
}
```

### 批量获取用户在线状态（status）

批量查看用户的在线状态，最多可同时查看 100 个用户的状态。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/batch/status
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                           |
| :---------- | :----- | :------- | :------------------------------------------------------------- |
| `usernames` | String | 是       | 要查询状态的用户 ID，以数组方式提交，**最多不能超过 100 个**。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 200，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                                                                                             |
| :-------------- | :----- | :--------------------------------------------------------------------------------------------------------------- |
| `data.username` | String | 数据格式为：“用户 ID：当前在线状态”，例如，user1 的在线和离线状态分别为 “user1”: “online” 和”user1”: “offline”。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST http://XXXX/XXXX/chatdemoui/users/batch/status -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type: application/json' -d '{"usernames":["user1","user2"]}'
```

##### 响应示例

该接口不对用户 ID 进行校验。若查询不存在的用户 ID 的状态，则返回的状态为 offline。

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

## 用户全局禁言

随着监管机制日益完善，对 app 的监管不断加强，安全合规逐渐成为 app 的生命线。

为加强 app 管理，环信即时通讯提供全局禁言功能，对 app 提供用户 ID 级别的禁言管理，支持在管理员发现用户违规后进行全局禁言，以维护 app 良好的内容生态环境。禁言到期后，服务器会自动解除禁言，恢复该用户发送消息的权限。

你可以对单个用户 ID 设置单聊、群组或聊天室消息全局禁言。禁言后，该用户将无法在对应的单聊、群组或聊天室发送消息；无论通过调用客户端 API，还是使用服务端 RESTful API 都不行。

该功能可广泛应用于实时互动 app 中，例如发现某用户频繁向多个聊天室发送违规广告，则可以对该用户开启全局聊天室禁言 15 天；发现某用户发表触犯红线的政治言论，则可以全局永久禁言，用户申诉通过后可以解禁。

### 设置用户全局禁言

设置单个用户 ID 的单聊、群组、聊天室消息全局禁言。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/mutes
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                     |
| :-------------- | :----- | :------- | :--------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | 鉴权 token，管理员 token（含）以上权限。 |

##### 请求 body

| 参数        | 类型   | 是否必需 | 描述                                                                                                                                                                                                          |
| :---------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `username`  | String | 是       | 设置禁言配置的用户 ID。                                                                                                                                                                                       |
| `chat`      | Int    | 否       | 单聊消息禁言时长，单位为秒，最大值为 2147483647。<br/> - > 0：该用户 ID 具体的单聊消息禁言时长。 <br/> -  `0`：取消该用户的单聊消息禁言。<br/> - `-1`：该用户被设置永久单聊消息禁言。<br/> - 其他负值无效。 |
| `groupchat` | Int    | 否       | 群组消息禁言时长，单位为秒，规则同上。                                                                                                                                                                        |
| `chatroom`  | Int    | 否       | 聊天室消息禁言时长，单位为秒，规则同上。                                                                                                                                                                      |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                |
| :------------ | :----- | :---------------------------------- |
| `data.result` | String | 该方法调用结果。`ok` 表示设置成功。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L -X POST 'https://XXXX/XXXX/XXXX/mutes' \
-H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "username": "zs1",
    "chat": 100,
    "groupchat": 100,
    "chatroom": 100
}'
```

##### 响应示例

```json
{
    "path": "/mutes",
    "uri": "https://XXXX/XXXX/XXXX/mutes",
    "timestamp": 1631609754727,
    "organization": "XXXX",
    "application": "357169f0-XXXX-XXXX-9b3a-f1af649cc48d",
    "action": "post",
    "data": {
        "result": "ok"
    },
    "duration": 74,
    "applicationName": "XXXX"
}
```

### 查询单个用户 ID 全局禁言

查询单个用户的单聊、群聊和聊天室消息的禁言。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/mutes/{username}
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                      |
| :-------------- | :----- | :------- | :---------------------------------------- |
| `Content-Type`  | String | 是       | `application/json` 内容类型。             |
| `Authorization` | String | 是       | 鉴权 token，管理员 token （含）以上权限。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述                                                                                                                                                                                       |
| :--------------- | :----- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data.userid`    | String | 设置禁言的用户 ID。                                                                                                                                                                        |
| `data.chat`      | Int    | 单聊消息剩余禁言时间，单位为秒。最大值为 2147483647。<br/> - > 0：该用户 ID 具体的单聊消息禁言时长。<br/> - `0`：该用户的单聊消息禁言已取消。 <br/> - `-1`：该用户被设置永久单聊消息禁言。 |
| `data.groupchat` | Int    | 群组消息剩余禁言时长，单位为秒，规则同上。                                                                                                                                                 |
| `data.chatroom`  | Int    | 聊天室消息剩余禁言时长，单位为秒，规则同上。                                                                                                                                               |
| `data.unixtime`  | Int    | 当前操作的 Unix 时间戳。                                                                                                                                                                   |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L -X GET 'https://XXXX/XXXX/XXXX/mutes/zs1' \
-H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json'
```

##### 响应示例

```json
{
    "path": "/mutes",
    "uri": "https://XXXX/XXXX/XXXX/mutes",
    "timestamp": 1631609831800,
    "organization": "XXXX",
    "application": "357169f0-XXXX-XXXX-9b3a-f1af649cc48d",
    "action": "get",
    "data": {
        "userid": "XXXX#restys_zs1",
        "chat": 96,
        "groupchat": 96,
        "chatroom": 96,
        "unixtime": 1631609831
    },
    "duration": 13,
    "applicationName": "XXXX"
}
```

### 查询 app 下的所有全局禁言的用户

该方法查询 app 下所有全局禁言的用户及其禁言剩余时间。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users
```

##### 路径参数

参数及说明详见[公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                     |
| :-------------- | :----- | :------- | :--------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | 鉴权 token，管理员 token（含）以上权限。 |

##### 请求 body

| 参数       | 类型 | 是否必需 | 描述                               |
| :--------- | :--- | :------- | :--------------------------------- |
| `pageNum`  | Int  | 是       | 请求查询的页码。                   |
| `pageSize` | Int  | 是       | 请求查询每页显示的禁言用户的数量。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型   | 描述                                                                                                                                                                                         |
| :---------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `username`  | String | 设置禁言的用户 ID。                                                                                                                                                                          |
| `chat`      | Int    | 单聊消息剩余禁言时间，单位为秒。最大值为 2147483647。 <br/> - > 0：该用户 ID 具体的单聊消息禁言时长。 <br/> - `0`：该用户的单聊消息禁言已取消。 <br/> - `-1`：该用户被设置永久单聊消息禁言。 |
| `groupchat` | Int    | 群组消息剩余禁言时长，单位为秒，规则同上。                                                                                                                                                   |
| `chatroom`  | Int    | 聊天室消息剩余禁言时长，单位为秒，规则同上。                                                                                                                                                 |
| `unixtime`  | Int    | 当前操作的 Unix 时间戳。                                                                                                                                                                     |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L -X GET 'https://XXXX/XXXX/XXXX/mutes?pageNum=1&pageSize=10' \
-H 'Authorization: Bearer {{token}}' \
-H 'Content-Type: application/json'
```

##### 响应示例

```json
{
    "path": "/mutes",
    "uri": "https://XXXX/XXXX/XXXX/mutes",
    "timestamp": 1631609858771,
    "organization": "XXXX",
    "application": "357169f0-XXXX-XXXX-9b3a-f1af649cc48d",
    "action": "get",
    "data": {
        "data": [
            {
                "username": "zs2",
                "chatroom": 0
            },
            {
                "username": "zs1",
                "groupchat": 69
            },
            {
                "username": "zs1",
                "chat": 69
            },
            {
                "username": "zs1",
                "chatroom": 69
            },
            {
                "username": "h2",
                "chatroom": 0
            },
            {
                "username": "h2",
                "groupchat": 0
            },
            {
                "username": "h2",
                "chat": 0
            }
        ],
        "unixtime": 1631609858
    },
    "duration": 17,
    "applicationName": "XXXX"
}
```

## 获取用户离线消息数据

### 获取用户离线消息数量

获取环信 IM 用户的离线消息数量。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/offline_msg_count
```

##### 路径参数

|       参数       | 类型   | 是否必需 | 描述                        |
| :--------------: | :----- | :------- | :-------------------------- |
| `owner_username` | String | 是       | 要获取离线消息数的用户 ID。 |

其他参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段       | 类型   | 描述                                                          |
| :--------- | :----- | :------------------------------------------------------------ |
| `username` | String | 数据格式为：“用户 ID：当前离线消息的数量“，例如，”user1: 0”。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/offline_msg_count'
```

##### 响应示例

```json
{
  "action": "get",
  "uri": "http://XXXX/XXXX/XXXX/users/user1/offline_msg_count",
  "entities": [],
  "data": {
    "user1": 0
  },
  "timestamp": 1542601518137,
  "duration": 3,
  "count": 0
}
```

### 获取某条离线消息状态

获取用户的离线消息的状态，即查看该消息是否已投递。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                          |
| :--------- | :----- | :------- | :---------------------------- |
| `username` | String | 是       | 要获取离线消息状态的用户 ID。 |
| `msg_id`   | String | 是       | 要查看状态的离线消息 ID。     |

其他参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中的字段如下：

| 字段     | 类型   | 描述                                                                                                                |
| :------- | :----- | :------------------------------------------------------------------------------------------------------------------ |
| `msg_id` | String | 数据格式为“消息 ID”：“离线状态”。消息的离线状态有两种：<br/> - `delivered`：已投递；<br/> - `undelivered`：未投递。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123'
```

##### 响应示例

```json
{
  "action": "get",
  "uri": "http://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123",
  "entities": [],
  "data": {
    "123": "delivered"
  },
  "timestamp": 1542601830084,
  "duration": 5,
  "count": 0
}
```

## 用户账号封禁、解禁和强制下线

### 账号封禁

环信即时通讯 IM 提供了对用户的禁用以及解禁接口操作，用户若被禁用将立即下线并无法登录进入环信即时通讯 IM，直到被解禁后才能恢复登录。常用在对异常用户的即时处理场景使用。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/deactivate
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述               |
| :--------- | :----- | :----------------- |
| `username` | String | 被封禁的用户 ID。  |
| `nickname` | String | 被封禁的用户昵称。 |

其他字段及说明详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考[响应状态码](error.html)了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/deactivate'
```

##### 响应示例

```json
{
  "action": "Deactivate user",
  "entities": [
    {
      "uuid": "4759aa70-XXXX-XXXX-925f-6fa0510823ba",
      "type": "user",
      "created": 1542595573399,
      "modified": 1542597578147,
      "username": "user1",
      "activated": false,
      "nickname": "user"
      }  ],
      "timestamp": 1542602157258,
      "duration": 12}
```

### 账号解禁

环信即时通讯 IM 提供了对用户的禁用以及解禁接口操作。对用户禁用后，用户将立即下线并无法登录进入环信即时通讯 IM，直到被解禁后才能恢复登录。该功能常于对异常用户的即时处理场景。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/activate
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                     |
| :------- | :----- | :--------------------------------------- |
| `action` | String | 执行的操作。账号解禁为 `activate user`。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/activate'
```

##### 响应示例

```json
{
  "action": "activate user",
  "timestamp": 1542602404132,
  "duration": 9}
```

### 强制下线

强制用户即把用户状态改为离线，用户需要重新登录才能正常使用。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/disconnect
```

##### 路径参数

参数及说明详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                        |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                         |
| `Authorization` | String | 是       | `Bearer ${YourAppToken}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述                                                            |
| :------- | :--- | :-------------------------------------------------------------- |
| `result` | Bool | 用户是否已被强制下线：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXXX/XXXX/XXXX/users/user1/disconnect'
```

##### 响应示例

```json
{
  "action": "get",
  "uri": "http://XXXX/XXXX/XXXX/users/user1/disconnect",
  "entities": [],
  "data": {
    "result": true
    },
  "timestamp": 1542602601332,
  "duration": 6,
  "count": 0}
```