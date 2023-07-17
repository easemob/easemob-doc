# 聊天室管理

<Toc />

本文介绍聊天室管理相关接口，包括添加、获取、修改和删改聊天室以及聊天室成员管理相关操作。

:::notice
仅聊天室超级管理员具有在客户端创建聊天室的权限。
:::

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见[接口频率限制](limitationapi.html)。

## 聊天室成员角色

| 成员角色     | 描述                                               | 管理权限                                                                       |
| :----------- | :------------------------------------------------- | :----------------------------------------------------------------------------- |
| 普通成员     | 不具备管理权限的聊天室成员。                       | 普通成员可以修改自己的聊天室信息。                                             |
| 聊天室管理员 | 由聊天室创建者授权，协助聊天室管理，具有管理权限。 | 管理员可以管理聊天室内的普通成员。 最多支持添加 99 个管理员。                  |
| 聊天室所有者 | 聊天室的创建者，具有聊天室最高权限。               | 聊天室所有者可以指定聊天室管理员、解散聊天室、更改聊天室信息、管理聊天室成员。 |

## 公共参数

### 请求参数

| 参数          | 类型   | 是否必需 | 描述                                                                                                                                            |
| :------------ | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `chatroom_id` | String | 是       | 聊天室 ID。                                                                                                                                     |
| `username`    | String | 是       | 用户 ID。                                                                                                                                       |
| `name`        | String | 是       | 聊天室名称，最大长度为 128 个字符。                                                                                                             |
| `description` | String | 是       | 聊天室描述，最大长度为 512 个字符。                                                                                                             |
| `maxusers`    | Int    | 否       | 聊天室成员数上限，创建聊天室时设置。该参数的默认最大值为 10,000，如需调整请联系商务。                                                           |

### 响应参数

| 参数                 | 类型   | 描述                                                                                                                                                                                                            |
| :------------------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `action`             | String | 请求方法。                                                                                                                                                                                                      |
| `host`               | String | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名，与请求参数 `host` 相同。                                                                                                                                     |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。                                                                                                                                  |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。                                                                                                                                                                    |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。                                                                                                                                  |
| `uri`                | String | 请求 URL。                                                                                                                                                                                                      |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                                                                                                                                                               |
| `id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。                                                                                                                                                       |
| `entities`           | JSON   | 响应实体。                                                                                                                                                                                                      |
| `data`               | JSON   | 数据详情。                                                                                                                                                                                                      |
| `uuid`               | String | 系统内为用户或者应用生成的系统内唯一标识，开发者无需关心。                                                                                                                                                      |
| `created`            | String | 用户、群组或聊天室的创建时间，Unix 时间戳，单位为毫秒。                                                                                                                                                         |
| `username`           | String | 用户 ID。                                                                                                                                                                                                       |
| `affiliations_count` | Int    | 聊天室现有成员总数。                                                                                                                                                                                            |
| `affiliations`       | Array  | 聊天室现有成员列表，数组类型，包含 `owner` 和 `member` 元素，即聊天室所有者和聊天室成员（包括聊天室管理员）。例如： “affiliations”:[{“owner”: “13800138001”},{“member”:”v3y0kf9arx”},{“member”:”xc6xrnbzci”}]。 |
| `owner`              | String | 聊天室所有者的用户 ID。例如：{“owner”: “13800138001”}。                                                                                                                                                         |
| `member`             | String | 聊天室成员的用户 ID，包括聊天室管理员和普通成员的用户 ID。例如：{“member”:”xc6xrnbzci”}。                                                                                                                       |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。                                                                                                                                                                           |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长，单位为毫秒。                                                                                                                                                                      |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 管理超级管理员

在即时通讯应用中，仅聊天室超级管理员具有在客户端创建聊天室的权限。

环信即时通讯 IM 提供多个管理超级管理员的接口，包括获取、添加、移除等操作。

### 添加超级管理员

添加一个聊天室超级管理员。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/super_admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述                                          |
| :----------- | :----- | :------- | :-------------------------------------------- |
| `superadmin` | String | 是       | 添加的超级管理员的用户 ID，每次只能添加一个。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                    |
| :---------------- | :----- | :---------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功添加聊天室超级管理员：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.properties` | String | 预留参数，开发者不用关注。                                              |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX//chatrooms/super_admin'
-H 'Authorization: Bearer <YourAppToken>'
-H 'Content-Type: application/json'
-d '{
    "superadmin": "user1"
}'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "09XXXX34",
  "applicationName": "XXXX",
  "data": {
    "result": "success",
    "resource": ""
  },
  "duration": 1,
  "entities": [],
  "organization": "XXXX",
  "timestamp": 1656488117703,
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/super_admin"
}
```

### 分页获取超级管理员列表

可以分页获取超级管理员列表的接口。

#### HTTP 请求

直接获取：

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/super_admin
```

分页获取：

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/super_admin?pagenum={N}&pagesize={N}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数       | 类型 | 是否必需 | 描述                                    |
| :--------- | :--- | :------- | :-------------------------------------- |
| `pagenum`  | Int  | 否       | 当前页码，默认值为 1。                  |
| `pagesize` | Int  | 否       | 每页返回的超级管理员数量，默认值为 10。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型  | 描述                       |
| :---------------- | :---- | :------------------------- |
| `data`            | Array | 超级管理员的用户 ID 列表。 |
| `params.pagesize` | Int   | 每页返回的超级管理员数量。 |
| `params.pagenum`  | Int   | 当前页码。                 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/chatrooms/super_admin?pagenum=2&pagesize=2 -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "9fXXXX04",
  "params": {
    "pagesize": ["2"],
    "pagenum": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/super_admin",
  "entities": [],
  "data": ["hXXXX1", "hXXXX11", "hXXXX10"],
  "timestamp": 1596187292391,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 3
}
```

### 撤销超级管理员

撤销超级管理员权限，用户将不能再创建聊天室。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/super_admin/{superAdmin}
```

##### 路径参数

| 参数         | 类型   | 是否必需 | 描述                            |
| :----------- | :----- | :------- | :------------------------------ |
| `superAdmin` | String | 是       | 要撤销超级管理员权限的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型   | 描述                            |
| :------------------- | :----- | :------------------------------ |
| `data.newSuperAdmin` | String | 被撤销超级管理员权限的用户 ID。 |
| `data.resource`      | String | 预留参数，开发者不用关注。      |
| `properties`         | String | 预留参数，开发者不用关注。      |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl --location --request DELETE 'https://XXXX/XXXX/XXXX/chatrooms/super_admin/XXXX'
--header 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "09XXXX34",
  "applicationName": "XXXX",
  "data": {
    "newSuperAdmin": "XXXX",
    "resource": ""
  },
  "duration": 0,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1656488154100,
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/super_admin/XXXX"
}
```

## 管理聊天室

环信即时通讯 IM 提供多个接口实现聊天室管理，包括对聊天室的创建、获取、修改、移除等管理功能。

### 获取 app 中的聊天室

分页获取应用下的聊天室列表和信息。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms?limit={N}&cursor={cursor}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                                                                      |
| :------- | :----- | :------- | :---------------------------------------------------------------------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的聊天室数量。取值范围为 [1,100]，默认值为 `10`。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。                                          |

:::tip
若请求中均未设置 `limit` 和 `cursor`，环信服务器返回聊天室列表的第一页中前 10 个聊天室。
:::

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                      | 类型   | 描述                                                      |
| :------------------------ | :----- | :-------------------------------------------------------- |
| `data.id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
| `data.name`               | String | 聊天室名称。                                              |
| `data.owner`              | String | 聊天室创建者的用户 ID。例如：{“owner”: “user1”}。         |
| `data.affiliations_count` | Int    | 聊天室现有成员总数（包含聊天室创建者）。                  |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl --location --request GET 'https://XXXX/XXXX/XXXX/chatrooms?limit=10' \
--header 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "data": {
    "id": "662XXXX13",
    "name": "testchatroom1",
    "owner": "user1",
    "affiliations_count": 2
  }
}
```

### 获取用户加入的聊天室

根据用户 ID 分页获取该用户加入的聊天室。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/joined_chatrooms?pagenum={N}&pagesize={N}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数       | 类型 | 是否必需 | 描述                                    |
| :--------- | :--- | :------- | :-------------------------------------- |
| `pagenum`  | Int  | 否       | 当前页码，默认值为 1。                  |
| `pagesize` | Int  | 否       | 每页返回的聊天室数量，取值范围为 [1,1000]，默认值为 `1000`。 |

:::notice
若查询参数 `pagenum` 和 `pagesize` 均不传，服务器返回用户最新加入的 500 个聊天室。
:::

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型   | 描述                                                      |
| :---------- | :----- | :-------------------------------------------------------- |
| `data.id`   | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
| `data.name` | String | 聊天室名称，最大长度为 128 字符。                         |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/joined_chatrooms?pagenum=1&pagesize=10'
```

##### 响应示例

```json
{
    "action": "get",
    "application": "48472d89-5846-XXXX-XXXX-5fa4b79af9b1",
    "applicationName": "XXXX",
    "count": 2,
    "data": [
        {
            "id": "216295074234369",
            "name": "fd",
            "disabled": "false"
        },
        {
            "id": "216294461865985",
            "name": "testChatRoom",
            "disabled": "false"
        }
    ],
    "duration": 0,
    "entities": [],
    "organization": "XXXX",
    "params": {
        "pagesize": [
            "10"
        ],
        "pagenum": [
            "1"
        ]
    },
    "properties": {},
    "timestamp": 1685673568976,
    "uri": "http://XXXX/XXXX/XXXX/users/user2/joined_chatrooms"
}
```

### 查询聊天室详情

查询一个或多个聊天室的详情。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

##### 路径参数

| 参数          | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                        |
| :------------ | :----- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID，即时通讯服务分配给每个聊天室的唯一标识符，从[获取 app 中的聊天室](#获取-app-中的聊天室) 的响应 body 中获取。<br/> - 查询多个聊天室时，聊天室 ID 之间用逗号（","）分隔。<br/> - 一次请求最多查询 100 个聊天室。<br/> - 在 URL 中，需要将逗号（","）转义为 "%2C"。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                      | 类型   | 描述                                                                                                                                                            |
| :------------------------ | :----- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data.id`                 | String | 聊天室 ID，聊天室唯一标识符，由环信即时通讯 IM 服务器生成。                                                                                                     |
| `data.name`               | String | 聊天室名称。                                                                                                                                                    |
| `data.description`        | String | 聊天室描述。                                                                                                                                                    |
| `data.membersonly`        | Bool   | 加入聊天室是否需要群主或者群管理员审批：<br/> - `true`：是。<br/> - `false`：否。                                                                               |
| `data.allowinvites`       | Bool   | 是否允许聊天室成员邀请其他用户加入该聊天室：<br/> - `true`：允许聊天室成员邀请他人加入该聊天室。<br/> - `false`：仅聊天室所有者和管理员可邀请他人加入该聊天室。 |
| `data.maxusers`           | Int    | 聊天室成员数上限，创建聊天室时设置。                                                                                                                            |
| `data.owner`              | String | 聊天室所有者的用户 ID。例如：{“owner”: “user1”}。                                                                                                               |
| `data.created`            | Long   | 创建聊天室时间，Unix 时间戳，单位为毫秒。                                                                                                                       |
| `data.custom`             | String | 聊天室扩展信息。                                                                                                                                                |
| `data.affiliations_count` | Int    | 现有聊天室成员总数。                                                                                                                                            |
| `data.affiliations`       | Array  | 现有聊天室成员列表，包含聊天室所有者和成员（包括聊天室管理员）。例如：“affiliations”:[{“owner”: “user1”},{“member”:”user2”},{“member”:”user3”}]。               |
| `data.public`             | Bool   | 预留字段，无需关注。                                                                                                                                            |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

##### 响应示例

```json
{
  "data": {
    "id": "662XXXX13",
    "name": "testchatroom1",
    "description": "test",
    "membersonly": false,
    "allowinvites": false,
    "maxusers": 200,
    "owner": "user1",
    "created": 1542542951527,
    "custom": "",
    "affiliations_count": 2,
    "affiliations": [
      {
        "member": "user2"
      },
      {
        "owner": "user1"
      }
    ],
    "public": true
  }
}
```

### 创建聊天室

创建一个聊天室，需设置聊天室名称、聊天室描述、聊天室成员最大人数（包括管理员）、聊天室管理员和普通成员以及聊天室扩展信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数          | 类型   | 是否必需 | 描述                                                                            |
| :------------ | :----- | :------- | :------------------------------------------------------------------------------ |
| `name`        | String | 是       | 聊天室名称，最大长度为 128 个字符。                                             |
| `description` | String | 是       | 聊天室描述，最大长度为 512 个字符。                                             |
| `maxusers`    | Int    | 否       | 聊天室最大成员数（包括聊天室所有者），默认最大值为 10,000，如需调整请联系商务。 |
| `owner`       | String | 是       | 聊天室的管理员。                                                                |
| `members`     | Array  | 否       | 聊天室成员的用户 ID。若传该参数，确保至少设置一个数组元素。                     |
| `custom`      | String | 否       | 聊天室扩展信息，例如可以给聊天室添加业务相关的标记，不要超过 1,024 个字符。     |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `data.id` | String | 创建的聊天室的 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "name": "testchatroom1",
   "description": "test",
   "maxusers": 300,
   "owner": "user1",
   "members": [
     "user2"
   ]
 }' 'https://XXXX/XXXX/XXXX/chatrooms'
```

##### 响应示例

```json
{
  "data": {
    "id": "66XXXX33"
  }
}
```

### 修改聊天室信息

修改指定聊天室的信息。仅支持修改聊天室名称、聊天室描述和聊天室最大成员数。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

你只能修改聊天室名称、聊天室描述和聊天室最大成员数。

| 参数          | 类型   | 是否必需 | 描述                                                                                      |
| :------------ | :----- | :------- | :---------------------------------------------------------------------------------------- |
| `name`        | String | 是       | 聊天室名称，不能超过 128 个字符，不能包含斜杠(“/”)。                                      |
| `description` | String | 是       | 聊天室描述，不能超过 512 个字符，不能包含斜杠(“/”)。                                      |
| `maxusers`    | Int    | 是       | 聊天室最大成员数（包括聊天室所有者），默认可设置的最大人数为 10,000，如需调整请联系商务。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型 | 描述                                                                                      |
| :----------------- | :--- | :---------------------------------------------------------------------------------------- |
| `data.groupname`   | Bool | 聊天室名称是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| `data.description` | Bool | 聊天室描述是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| `data.maxusers`    | Bool | 聊天室最大成员数（包括聊天室所有者）是否修改成功。<br/> - `true`：是。<br/> `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "name": "testchatroom",
   "description": "test",
   "maxusers": 300
 }' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

##### 响应示例

```json
{
  "data": {
    "description": true,
    "maxusers": true,
    "groupname": true
  }
}
```

### 删除聊天室

删除单个聊天室。如果要删除的聊天室不存在，会返回错误。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

参数及描述详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数           | 类型   | 描述                                                          |
| :------------- | :----- | :------------------------------------------------------------ |
| `data.success` | Bool   | 是否成功删除聊天室：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.id`      | String | 删除的聊天室的 ID。                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/662XXXX13",
  "entities": [],
  "data": {
    "success": true,
    "id": "662XXXX13"
  },
  "timestamp": 1542545100474,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 获取聊天室公告

获取指定聊天室 ID 的聊天室公告。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

在返回值中查看 `data` 字段包含的信息，获取到的聊天室公告信息。

| 参数                | 类型   | 描述             |
| :------------------ | :----- | :--------------- |
| `data.announcement` | String | 聊天室公告内容。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/announcement'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/announcement",
  "entities": [],
  "data": {
    "announcement": "XXXX."
  },
  "timestamp": 1542363546590,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 修改聊天室公告

修改指定聊天室 ID 的聊天室公告。聊天室公告内容不能超过 512 个字符。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 字段           | 类型   | 是否必需 | 描述                 |
| :------------- | :----- | :------- | :------------------- |
| `announcement` | String | 是       | 修改后的聊天室公告。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                              |
| :------------ | :----- | :---------------------------------------------------------------- |
| `data.id`     | String | 聊天室 ID。                                                       |
| `data.result` | Bool   | 是否成功修改聊天室公告：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/announcement' -d '{"announcement" : "聊天室公告…"}'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/announcement",
  "entities": [],
  "data": {
    "id": "12XXXX11",
    "result": true
  },
  "timestamp": 1594808604236,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 设置聊天室自定义属性

指定用户设置特定聊天室的自定义属性。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                                                                                                                                                                          |
| :----------- | :----- | :------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metaData`   | JSON   | 是       | 聊天室的自定义属性，存储为键值对（key-value）集合，即 Map<String,String>。该集合中最多可包含 10 个键值对，在每个键值对中，key 为属性名称，最多可包含 128 个字符；value 为属性值，不能超过 4086 个字符。每个聊天室最多可有 100 个自定义属性，每个应用的聊天室自定义属性总大小为 10 GB。<br/> key 支持以下字符集：<br/> • 26 个小写英文字母 a-z；<br/> • 26 个大写英文字母 A-Z；<br/> • 10 个数字 0-9；<br/> • “\_”, “-”, “.”。 |
| `autoDelete` | String | 否       | 当前成员退出聊天室时是否自动删除该自定义属性。 <br/> • （默认）'DELETE'：是； <br/> • 'NO_DELETE'：否。                                                                                                                                                                                                                                                                                                                       |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data.successKeys` | Array  | 设置成功的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 设置失败的聊天室属性，返回键值对格式，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "metaData": {
  			"key1": "value1",
				"key2": "value2"
    },
    "autoDelete": "DELETE"
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1'
```

##### 响应示例

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

### 获取聊天室自定义属性

获取指定聊天室的自定义属性信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数   | 类型  | 是否必需 | 描述                       |
| :----- | :---- | :------- | :------------------------- |
| `keys` | Array | 否       | 聊天室自定义属性名称列表。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型   | 描述                                                             |
| :----- | :----- | :--------------------------------------------------------------- |
| `data` | Object | 聊天室自定义属性，为键值对格式，key 为属性名称，value 为属性值。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "keys": ["key1","key2"]
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13'
```

##### 响应示例

```json
{
  "data": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

### 删除聊天室自定义属性

用户删除其设置的聊天室自定义属性。该方法只能删除当前用户设置的聊天室自定义属性，不能删除其他成员设置的自定义属性。

该方法每次最多可删除 10 个自定义属性。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数   | 类型  | 是否必需 | 描述                                                         |
| :----- | :---- | :------- | :----------------------------------------------------------- |
| `keys` | Array | 否       | 聊天室自定义属性名称列表。每次最多可传 10 个自定义属性名称。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data.successKeys` | Array  | 成功删除的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 删除失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

DELETE -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "keys": ["key1","key2"]
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1'
```

##### 响应示例

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

### 强制设置聊天室自定义属性

用户强制设置指定聊天室的自定义属性信息，即该方法可覆盖其他用户设置的聊天室自定义属性。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述                                                                                                                                                                                                                                                                                                                                                                                                                               |
| :----------- | :----- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `metaData`   | JSON   | 是       | 聊天室的自定义属性，存储为键值对（key-value pair）集合，即 Map<String,String>。该集合中最多可包含 10 个键值对，在每个键值对中，key 为属性名称，最多可包含 128 个字符；value 为属性值，不能超过 4086 个字符。每个聊天室最多可有 100 个自定义属性，每个应用的聊天室自定义属性总大小为 10 GB。<br/> key 支持以下字符集：<br/> • 26 个小写英文字母 a-z；<br/> • 26 个大写英文字母 A-Z；<br/> • 10 个数字 0-9；<br/> • “\_”, “-”, “.”。 |
| `autoDelete` | String | 否       | 当前成员退出聊天室时是否自动删除该自定义属性。 <br/> • （默认）'DELETE'：是； <br/> • 'NO_DELETE'：否。                                                                                                                                                                                                                                                                                                                            |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data.successKeys` | Array  | 设置成功的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 设置失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "metaData": {
        "key1": "value1",
		"key2": "value2"
    },
    "autoDelete": "DELETE"
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1/forced'
```

##### 响应示例

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

### 强制删除聊天室自定义属性

用户强制删除聊天室的自定义属性信息，即该方法除了会删除当前用户设置的聊天室自定义属性，还可以删除其他用户设置的自定义属性。

该方法每次最多可删除 10 个自定义属性。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数   | 类型  | 是否必需 | 描述                                                           |
| :----- | :---- | :------- | :------------------------------------------------------------- |
| `keys` | Array | 否       | 聊天室自定义属性的名称列表。每次最多可传 10 个自定义属性名称。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data.successKeys` | Array  | 成功删除的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 删除失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

DELETE -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "keys": ["key1","key2"]
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1/forced'
```

##### 响应示例

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

## 管理聊天室成员

环信即时通讯 IM 提供多个接口实现聊天室成员管理，包括添加和移除聊天室成员、转让聊天室所有权以及聊天室黑名单、白名单和禁言列表相关操作。

### 分页获取聊天室成员列表

可以分页获取聊天室成员列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users?pagenum={N}&pagesize={N}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数       | 类型 | 是否必需 | 描述                                                           |
| :--------- | :--- | :------- | :------------------------------------------------------------- |
| `pagenum`  | Int  | 否       | 查询页码。默认值为 1。                                         |
| `pagesize` | Int  | 否       | 每页显示的聊天室成员数量。默认值为 1000。取值范围为 [0,1000]。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数          | 类型   | 描述            |
| :------------ | :----- | :-------------- |
| `data.owner`  | String | 聊天室所有者的用户 ID。例如：{“owner”: “user1”}。   |
| `data.member` | String | 普通聊天室成员或聊天室管理员的用户 ID。例如：{“member”:“user2”}。 |
| `count` | Number | 本次调用获取的聊天室成员数量。 | 

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users?pagenum=2&pagesize=2 -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "params": {
    "pagesize": ["2"],
    "pagenum": ["2"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users",
  "entities": [],
  "data": [
    {
      "owner": "user1"
    },
    {
      "member": "user2"
    }
  ],
  "timestamp": 1489074511416,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

### 添加单个聊天室成员

向聊天室添加一个成员。如果待添加的用户在 app 中不存在或已经在聊天室中，则请求失败并返回错误码 400。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroomid}/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数          | 类型   | 描述                                                        |
| :------------ | :----- | :---------------------------------------------------------- |
| `data.result` | Bool   | 是否添加成功：<br/> - `true`：是；<br/> - `false`：否。     |
| `data.action` | String | 执行的操作，`add_member` 表示向聊天室添加成员。             |
| `data.id`     | String | 聊天室 ID，聊天室唯一标识符，由环信即时通讯 IM 服务器生成。 |
| `data.user`   | String | 添加到聊天室的用户。                                        |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_member",
    "id": "66XXXX33",
    "user": "user1"
  },
  "timestamp": 1542554038353,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量添加聊天室成员

向聊天室添加多位用户，一次性最多可添加 60 位用户。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroomid}/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数        | 类型  | 是否必需 | 描述                 |
| :---------- | :---- | :------- | :------------------- |
| `usernames` | Array | 是       | 添加的用户 ID 数组。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数              | 类型   | 描述                                                                  |
| :---------------- | :----- | :-------------------------------------------------------------------- |
| `data.newmembers` | Array  | 添加成功的用户 ID 数组。                                              |
| `data.action`     | String | 执行的操作内容。在该响应中，该字段的值为 `add_member`，表示添加用户。 |
| `data.id`         | String | 聊天室 ID。                                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "usernames": [
     "user1","user2"
   ]
 }' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users",
  "entities": [],
  "data": {
    "newmembers": ["user1", "user2"],
    "action": "add_member",
    "id": "66XXXX33"
  },
  "timestamp": 1542554537237,
  "duration": 9,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 移除单个聊天室成员

从聊天室移除一个成员。如果被移除用户不在聊天室中或聊天室不存在，将返回错误。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroomid}/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数          | 类型   | 描述                                                                       |
| :------------ | :----- | :------------------------------------------------------------------------- |
| `data.result` | Bool   | 是否成功移出聊天室成员：<br/> - `true`：是；<br/> - `false`：否。          |
| `data.action` | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除聊天室成员。 |
| `data.user`   | String | 用户 ID。                                                                  |
| `data.id`     | String | 聊天室 ID。                                                                |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_member",
    "user": "user1",
    "id": "66XXXX33"
  },
  "timestamp": 1542555744726,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量移除聊天室成员

从聊天室移除多个成员，单次请求最多可移除 100 个成员。如果被移除用户不在聊天室中或聊天室不存在，将返回错误。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroomid}/users/{usernames}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                                                                                |
| :--------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------ |
| `username` | String | 是       | 一个或多个用户 ID，多个用户 ID 之间用逗号（“,”）分隔。在 URL 中，"," 需要转义为 "%2C"。一次最多可传 100 个用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数          | 类型   | 描述                                                                  |
| :------------ | :----- | :-------------------------------------------------------------------- |
| `data.result` | Bool   | 是否成功批量移除聊天室成员：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.action` | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除成员。  |
| `data.reason` | String | 移除失败的原因。                                                      |
| `data.user`   | String | 已删除成员的用户 ID 列表。                                            |
| `data.id`     | String | 聊天室 ID。                                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1%2Cuser2'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/users/user1%2Cuser2",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "remove_member",
      "reason": "user: user1 doesn't exist in group: 66XXXX33",
      "user": "user1",
      "id": "66XXXX33"
    },
    {
      "result": true,
      "action": "remove_member",
      "user": "user2",
      "id": "66XXXX33"
    }
  ],
  "timestamp": 1542556177147,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 获取聊天室管理员列表

获取聊天室管理员列表的接口。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数   | 类型  | 描述                       |
| :----- | :---- | :------------------------- |
| `data` | Array | 聊天室管理员用户 ID 数组。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin",
  "entities": [],
  "data": ["user1"],
  "timestamp": 1489073361210,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 1
}
```

### 添加聊天室管理员

将一个聊天室成员设置为聊天室管理员。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/admin
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。填入 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。填入 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数       | 描述                                |
| :--------- | :---------------------------------- |
| `newadmin` | 要添加为聊天室管理员的成员用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数            | 类型   | 描述                                                               |
| :-------------- | :----- | :----------------------------------------------------------------- |
| `data.result`   | Bool   | 操作结果：<br/> - `success`：添加成功；<br/> - `false`：添加失败。 |
| `data.newadmin` | String | 添加为聊天室管理员的成员用户 ID。                                  |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin -d '{"newadmin":"user1"}' -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin",
  "entities": [],
  "data": {
    "result": "success",
    "newadmin": "user1"
  },
  "timestamp": 1489073130083,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 移除聊天室管理员

将用户的角色从聊天室管理员降为普通聊天室成员。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/admin/{oldadmin}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                            |
| :--------- | :----- | :------- | :------------------------------ |
| `oldadmin` | String | 是       | 被撤销管理权限的管理员用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。填入 `application/json`                                                                                    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                                                          |
| :-------------- | :----- | :---------------------------------------------------------------------------- |
| `data.result`   | Bool   | 是否成功撤销聊天室管理员的管理权限：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.oldadmin` | String | 被撤销管理权限的管理员用户 ID。                                               |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin/user1 -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/admin/user1",
  "entities": [],
  "data": {
    "result": "success",
    "oldadmin": "user1"
  },
  "timestamp": 1489073432732,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 管理黑名单

环信即时通讯 IM 提供多个接口实现聊天室黑名单管理，包括查看黑名单中的用户以及将用户添加至和移出黑名单等操作。

### 查询聊天室黑名单

查询一个聊天室黑名单中的用户列表。黑名单中的用户无法查看或收到该聊天室的信息。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `data` | Array | 聊天室黑名单中的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users",
  "entities": [],
  "data": ["user2", "user3"],
  "timestamp": 1543466293681,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 2
}
```

### 添加单个用户至聊天室黑名单

将单个用户加入指定聊天室的黑名单。聊天室所有者无法被加入聊天室的黑名单。

用户进入聊天室黑名单后，无法查看和收发该聊天室的信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                              |
| :---------------- | :----- | :-------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将用户添加至聊天室黑名单：<br/> - `true`：是；<br/> - `false`：否。       |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `add_blocks`，表示向聊天室黑名单中添加用户。 |
| `data.user`       | String | 添加的用户 ID。                                                                   |
| `data.chatroomid` | String | 聊天室 ID。                                                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_blocks",
    "user": "user1",
    "chatroomid": "66XXXX33"
  },
  "timestamp": 1542539577124,
  "duration": 27,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量添加用户至聊天室黑名单

将多个用户加入指定聊天室的黑名单。你一次最多可以添加 60 个用户至聊天室黑名单。聊天室所有者无法被加入聊天室的黑名单。

用户进入聊天室黑名单后，无法查看和收发该聊天室的信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数        | 类型  | 描述                                                                |
| :---------- | :---- | :------------------------------------------------------------------ |
| `usernames` | Array | 待添加到聊天室黑名单的用户 ID，多个用户 ID 通过逗号（“，”）分隔，最多可添加 60 个。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                              |
| :---------------- | :----- | :-------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功批量添加用户至聊天室黑名单：<br/> - `true`：是；<br/> - `false`：否。     |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `add_blocks`，表示向聊天室黑名单中添加用户。 |
| `data.reason`     | String | 添加失败的原因。                                                                  |
| `data.user`       | String | 添加的用户 ID。                                                                   |
| `data.chatroomid` | String | 聊天室 ID。                                                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "usernames": [
     "user3","user4"
 }' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "add_blocks",
      "reason": "user: user3 doesn't exist in chatroom: 66XXXX33",
      "user": "user3",
      "chatroomid": "66XXXX33"
    },
    {
      "result": true,
      "action": "add_blocks",
      "user": "user4",
      "chatroomid": "66XXXX33"
    }
  ],
  "timestamp": 1542540095540,
  "duration": 16,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 从聊天室黑名单移出单个用户

将指定用户移出聊天室黑名单。对于聊天室黑名单中的用户，如果需要将其再次加入聊天室，需要先将其从聊天室黑名单中移除。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                               |
| :---------------- | :----- | :--------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将该用户移出聊天室黑名单：<br/> - `true`：是；<br/> - `false`：否。        |
| `data.chatroomid` | String | 聊天室 ID。                                                                        |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `remove_blocks`，表示将用户移出聊天室黑名单。 |
| `data.user`       | String | 被移除的用户 ID。                                                                  |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_blocks",
    "user": "user1",
    "chatroomid": "66XXXX33"
  },
  "timestamp": 1542540470679,
  "duration": 45,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 从聊天室黑名单批量移除用户

将多名指定用户从聊天室黑名单中移除。你每次最多可移除 60 个用户。对于聊天室黑名单中的用户，如果需要将其再次加入聊天室，需要先将其从聊天室黑名单中移除。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/blocks/users/{usernames}
```

##### 路径参数

| 参数       | 类型   | 是否必需 | 描述                                                          |
| :--------- | :----- | :------- | :------------------------------------------------------------ |
| `username` | String | 是       | 用户 ID，多个用户 ID 以逗号（“，”）分隔，每次最多可传 60 个。 |

其他字段及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                               |
| :---------------- | :----- | :--------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将用户批量移出聊天室黑名单：<br/> - `true`：是；<br/> - `false`：否。      |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `remove_blocks`，表示将用户移出聊天室黑名单。 |
| `data.user`       | String | 被移除的用户 ID。                                                                  |
| `data.chatroomid` | String | 聊天室 ID。                                                                        |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1%2Cuser2'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8beXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/blocks/users/user1%2Cuser2",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user1",
      "chatroomid": "66XXXX33"
    },
    {
      "result": true,
      "action": "remove_blocks",
      "user": "user2",
      "chatroomid": "66XXXX33"
    }
  ],
  "timestamp": 1542541014655,
  "duration": 29,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## 管理白名单

环信即时通讯 IM 提供多个接口实现聊天室白名单管理，包括查看白名单中的用户以及将用户添加至和移出白名单等。

聊天室白名单中的成员在聊天室中发送的消息为高优先级，会优先送达，但不保证必达。当负载较高时，服务器会优先丢弃低优先级的消息。若即便如此负载仍很高，服务器也会丢弃高优先级消息。

### 查询聊天室白名单

查询一个聊天室白名单中的用户列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                      |
| :----- | :---- | :------------------------ |
| `data` | Array | 聊天室白名单中的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/white/users'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/white/users",
  "entities": [],
  "data": ["wzy_test", "wzy_vivo", "wzy_huawei", "wzy_xiaomi", "wzy_meizu"],
  "timestamp": 1594724947117,
  "duration": 3,
  "organization": "XXXX",
  "applicationName": "testapp",
  "count": 5
}
```

### 添加单个用户至聊天室白名单

将单个用户添加至聊天室白名单。用户添加至聊天室白名单后，当聊天室全员禁言时，仍可以在聊天室中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                                      |
| :---------------- | :----- | :---------------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将单个用户添加至聊天室白名单：<br/> - `true`：是；<br/> - `false`：否。           |
| `data.chatroomid` | String | 聊天室 ID。                                                                               |
| `data.action`     | String | 执行操作。在该响应中，该字段的值为 `add_user_whitelist`，表示将用户添加至聊天室白名单中。 |
| `data.user`       | String | 添加的用户 ID。                                                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/{66XXXX33}/white/users/{username}'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/white/users/wzy_xiaomi",
  "entities": [],
  "data": {
    "result": true,
    "action": "add_user_whitelist",
    "user": "wzy_xiaomi",
    "chatroomid": "66XXXX33"
  },
  "timestamp": 1594724293063,
  "duration": 4,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 批量添加用户至聊天室白名单

添加多个用户至聊天室白名单。你一次最多可添加 60 个用户。用户添加至聊天室白名单后，在聊天室全员禁言时，仍可以在聊天室中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数        | 类型  | 描述                                                                                  |
| :---------- | :---- | :------------------------------------------------------------------------------------ |
| `usernames` | Array | 待添加至聊天室白名单中的用户 ID，每次最多可传 60 个，用户 ID 之间以逗号（“，”）分隔。 |

其他字段及描述详见 [公共参数](#公共参数)。

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                                    |
| :---------------- | :----- | :-------------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将用户批量添加至聊天室白名单：<br/> - `true`：是；<br/> - `false`：否。         |
| `data.reason`     | String | 添加失败的原因。                                                                        |
| `data.chatroomid` | String | 聊天室 ID。                                                                             |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `add_user_whitelist`，表示添加用户至聊天室白名单。 |
| `data.user`       | String | 添加至聊天室白名单中的用户 ID。                                                         |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"usernames" : ["user1"]}' 'https://XXXX/XXXX/XXXX/chatrooms/{chatroomid}/white/users'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/white/users",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzy_test",
      "chatroomid": "66XXXX33"
    },
    {
      "result": true,
      "action": "add_user_whitelist",
      "user": "wzy_meizu",
      "chatroomid": "66XXXX33"
    }
  ],
  "timestamp": 1594724634191,
  "duration": 2,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 将用户移出聊天室白名单

将指定用户从聊天室白名单移除。你每次最多可移除 60 个用户。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/white/users/{username}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                                                       |
| :---------------- | :----- | :----------------------------------------------------------------------------------------- |
| `data.result`     | Bool   | 是否成功将用户移出聊天室白名单：<br/> - `true`：是；<br/> - `false`：否。                  |
| `data.chatroomid` | String | 聊天室 ID。                                                                                |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `remove_user_whitelist`，表示将用户移出聊天室白名单。 |
| `data.user`       | String | 添加的用户 ID，多个用户 ID 以逗号（“，”）分隔，最多可添加 60 个。                                            |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/{66XXXX33}/white/users/{username}'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX33/white/users/wzy_huawei,wzy_meizu",
  "entities": [],
  "data": [
    {
      "result": true,
      "action": "remove_user_whitelist",
      "user": "wzy_huawei",
      "chatroomid": "66XXXX33"
    },
    {
      "result": true,
      "action": "remove_user_whitelist",
      "user": "wzy_meizu",
      "chatroomid": "66XXXX33"
    }
  ],
  "timestamp": 1594725137704,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## 管理禁言

环信即时通讯 IM 提供多个管理聊天室禁言列表的接口，包括获取禁言列表以及将用户添加至或移出禁言列表等。

### 获取禁言列表

获取当前聊天室的禁言用户列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                 |
| :------------ | :----- | :----------------------------------- |
| `data.expire` | Long   | 禁言到期的 Unix 时间戳，单位为毫秒。 |
| `data.user`   | String | 被禁言的用户 ID。                    |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute",
  "entities": [],
  "data": [
    {
      "expire": 1489158589481,
      "user": "user1"
    },
    {
      "expire": 1489158589481,
      "user": "user2"
    }
  ],
  "timestamp": 1489072802179,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 禁言聊天室成员

禁言单个或多个聊天室成员。你一次最多可禁言 60 个成员。

用户被禁言后，将无法在聊天室中发送消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述                                                          |
| :-------------- | :----- | :------- | :------------------------------------------------------------ |
| `mute_duration` | Long   | 是       | 禁言时长，从当前时间开始计算。单位为毫秒。`-1` 表示永久禁言。 |
| `usernames`     | String | 是       | 要被禁言的用户 ID，一次最多可传 60 个。                                           |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                        |
| :------------ | :----- | :---------------------------------------------------------- |
| `data.result` | Bool   | 是否成功禁言用户：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.expire` | Long   | 禁言到期时间，Unix 时间戳，单位为毫秒。                     |
| `data.user`   | String | 被禁言的用户 ID。                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d
'{
    "usernames": [
        "user1",
        "user2"
    ],
    "mute_duration": 86400000
}'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute",
  "entities": [],
  "data": [
    {
      "result": true,
      "expire": 1642148173726,
      "user": "user1"
    },
    {
      "result": true,
      "expire": 1642148173726,
      "user": "user2"
    }
  ],
  "timestamp": 1489072189508,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 禁言聊天室全体成员

对所有聊天室成员一键禁言。该操作不影响聊天室禁言列表，即一键禁言不会将聊天室所有成员加入聊天室禁言列表。

设置聊天室全员禁言后，仅聊天室白名单中的用户可在聊天室内发消息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型 | 描述                                                                  |
| :---------- | :--- | :-------------------------------------------------------------------- |
| `data.mute` | Bool | 是否处于聊天室全员禁言状态：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/ban'
```

##### 响应示例

```json
{
  "action": "put",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/ban",
  "entities": [],
  "data": {
    "mute": true
  },
  "timestamp": 1594628861058,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 解除聊天室禁言成员

解除对一个或多个聊天室成员的禁言。你一次最多可对 60 个成员解除禁言。

解除禁言后，该成员可以正常在聊天室中发送消息。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/mute/{member1}(,{member2},…)
```

##### 路径参数

| 参数      | 类型   | 是否必需 | 描述                                                                                                                                              |
| :-------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| `member1` | String | 是       | 待被移出禁言列表的聊天室成员的用户 ID。<br/>一次最多可传 60 个用户 ID，用户 ID 之间用逗号（","）隔开。在 URL 中，需要将 "," 转义为 "%2C"。 |

其他字段及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型    | 描述                                                                       |
| :------------ | :------ | :------------------------------------------------------------------------- |
| `data.result` | Boolean | 是否成功将指定用户移出禁言列表：<br/> - `true`：是； <br/> - `false`：否。 |
| `data.user`   | String  | 被解除禁言的聊天室成员的用户 ID。                                          |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE HTTP://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute/user1  -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/mute/user1",
  "entities": [],
  "data": [
    {
      "result": true,
      "user": "user1"
    }
  ],
  "timestamp": 1489072695859,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 解除聊天室全员禁言

一键取消对聊天室全体成员的禁言。解除禁言后，聊天室成员可以在聊天室中正常发送消息。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型 | 描述                                                                  |
| :---------- | :--- | :-------------------------------------------------------------------- |
| `data.mute` | Bool | 是否处于聊天室全员禁言状态：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [响应状态码](error.html) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/ban'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "5cXXXX75d",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/ban",
  "entities": [],
  "data": {
    "mute": false
  },
  "timestamp": 1594628899502,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```
