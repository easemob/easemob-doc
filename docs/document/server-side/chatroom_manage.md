# 聊天室管理

<Toc />

本文介绍聊天室管理相关接口，包括添加、获取、修改和解散聊天室等相关操作。

:::notice
仅聊天室超级管理员具有在客户端创建聊天室的权限。
:::

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见[接口频率限制](limitationapi.html)。
- 了解不同套餐版本支持的聊天室总数，详见[套餐包功能详情](/product/pricing.html#套餐包功能详情)。
## 公共参数

### 请求参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `chatroom_id` | String | 是       | 聊天室 ID。  |
| `username`    | String | 是       | 用户 ID。    |
| `name`        | String | 是       | 聊天室名称，最大长度为 128 个字符。       |
| `description` | String | 是       | 聊天室描述，最大长度为 512 个字符。    |
| `maxusers`    | Int    | 否       | 聊天室成员数上限，创建聊天室时设置。该参数的默认最大值为 10,000，如需调整请联系商务。  |

### 响应参数

| 参数                 | 类型   | 描述   |
| :------------------- | :----- | :------------ |
| `action`             | String | 请求方法。  |
| `host`               | String | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名，与请求参数 `host` 相同。    |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。      |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。  |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。   |
| `uri`                | String | 请求 URL。   |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。   |
| `id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。    |
| `entities`           | JSON   | 响应实体。  |
| `data`               | JSON   | 数据详情。 |
| `uuid`               | String | 系统内为用户或者应用生成的系统内唯一标识，开发者无需关心。   |
| `created`            | String | 用户、群组或聊天室的创建时间，Unix 时间戳，单位为毫秒。    |
| `username`           | String | 用户 ID。     |
| `affiliations_count` | Int    | 聊天室现有成员总数。     |
| `affiliations`       | Array  | 聊天室现有成员列表，数组类型，包含 `owner` 和 `member` 元素，即聊天室所有者和聊天室成员（包括聊天室管理员）。例如： “affiliations”:[{“owner”: “13800138001”},{“member”:”v3y0kf9arx”},{“member”:”xc6xrnbzci”}]。 |
| `owner`              | String | 聊天室所有者的用户 ID。例如：{“owner”: “13800138001”}。     |
| `member`             | String | 聊天室成员的用户 ID，包括聊天室管理员和普通成员的用户 ID。例如：{“member”:”xc6xrnbzci”}。    |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。   |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长，单位为毫秒。     |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 获取 app 中的聊天室

分页获取应用下的聊天室列表和信息。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms?limit={N}&cursor={cursor}
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                                                                      |
| :------- | :----- | :------- | :---------------------------------------------------------------------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的聊天室数量。取值范围为 [1,1000]，默认值为 `10`。该参数仅在分页获取时为必需。若传入的值超过了 `1000`，则返回 1000 个聊天室。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。   |

:::tip
若请求中均未设置 `limit` 和 `cursor`，环信服务器返回聊天室列表的第一页中前 10 个聊天室。
:::

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                      | 类型   | 描述                                                      |
| :------------------------ | :----- | :-------------------------------------------------------- |
| `data.id`                 | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
| `data.name`               | String | 聊天室名称。                                              |
| `data.owner`              | String | 聊天室创建者的用户 ID。例如：{“owner”: “user1”}。         |
| `data.affiliations_count` | Int    | 聊天室现有成员总数（包含聊天室创建者）。                  |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -L -X GET 'https://XXXX/XXXX/XXXX/chatrooms?limit=10' \
--header 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

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

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取用户加入的聊天室

根据用户 ID 分页获取该用户加入的聊天室。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/joined_chatrooms?pagenum={N}&pagesize={N}
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数       | 类型 | 是否必需 | 描述                                    |
| :--------- | :--- | :------- | :-------------------------------------- |
| `pagenum`  | Int  | 否       | 当前页码，默认值为 1。                  |
| `pagesize` | Int  | 否       | 每页返回的聊天室数量，取值范围为 [1,1000]，默认值为 `1000`。该参数仅在分页获取时为必需。若传入的值超过了 `1000`，则返回 1000 个聊天室。 |

:::notice
若查询参数 `pagenum` 和 `pagesize` 均不传，服务器返回用户最新加入的 500 个聊天室。
:::

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型   | 描述                                                      |
| :---------- | :----- | :-------------------------------------------------------- |
| `data` | JSON Array | 聊天室详情。 |
|  - `id`   | String | 聊天室 ID，聊天室唯一标识，由环信即时通讯 IM 服务器生成。 |
|  - `name` | String | 聊天室名称，最大长度为 128 字符。                         |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/joined_chatrooms?pagenum=1&pagesize=10'
```

#### 响应示例

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

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 查询聊天室详情

查询一个或多个聊天室的详情。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

#### 路径参数

| 参数          | 类型   | 是否必需 | 描述        |
| :------------ | :----- | :------- | :--------------------------------- |
| `chatroom_id` | String | 是       | 聊天室 ID，即时通讯服务分配给每个聊天室的唯一标识符，从[获取 app 中的聊天室](#获取-app-中的聊天室) 的响应 body 中获取。<br/> 每次最多可查询 100 个聊天室，聊天室 ID 之间用英文逗号（","）分隔，逗号在 URL 中转义为 "%2C"。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :-------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                      | 类型   | 描述      |
| :------------------------ | :----- | :----------------- |
| `data.id`                 | String | 聊天室 ID，聊天室唯一标识符，由环信即时通讯 IM 服务器生成。    |
| `data.name`               | String | 聊天室名称。    |
| `data.description`        | String | 聊天室描述。    |
| `data.membersonly`        | Bool   | 加入聊天室是否需要聊天室所有者或者聊天室管理员审批：<br/> - `true`：是。<br/> - `false`：否。    |
| `data.allowinvites`       | Bool   | 是否允许聊天室成员邀请其他用户加入该聊天室：<br/> - `true`：允许聊天室成员邀请他人加入该聊天室。<br/> - `false`：仅聊天室所有者和管理员可邀请他人加入该聊天室。 |
| `data.maxusers`           | Int    | 聊天室成员数上限，创建聊天室时设置。                                                                                                                            |
| `data.owner`              | String | 聊天室所有者的用户 ID。例如：{“owner”: “user1”}。                                                                                                               |
| `data.created`            | Long   | 创建聊天室时间，Unix 时间戳，单位为毫秒。                                                                                                                       |
| `data.custom`             | String | 聊天室扩展信息。 |
| `data.affiliations_count` | Int    | 现有聊天室成员总数。 |
| `data.affiliations`       | Array  | 现有聊天室成员列表，包含聊天室所有者和成员（包括聊天室管理员）。例如：“affiliations”:[{“owner”: “user1”},{“member”:”user2”},{“member”:”user3”}]。  |
| `data.public`             | Bool   | 预留字段，无需关注。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

#### 响应示例

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

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | do not find this group:XX | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 创建聊天室

创建一个聊天室，需设置聊天室名称、聊天室描述、聊天室成员最大人数（包括管理员）、聊天室管理员和普通成员以及聊天室扩展信息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :----------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数          | 类型   | 是否必需 | 描述                                                                            |
| :------------ | :----- | :------- | :------------------------------------------------------------------------------ |
| `name`        | String | 是       | 聊天室名称，最大长度为 128 个字符。                                             |
| `description` | String | 是       | 聊天室描述，最大长度为 512 个字符。                                             |
| `maxusers`    | Int    | 否       | 聊天室最大成员数（包括聊天室所有者）。取值范围为 [1,10,000]，默认值为 `1000`。如需调整请联系商务。 |
| `owner`       | String | 是       | 聊天室所有者。                                                                |
| `members`     | Array  | 否       | 聊天室普通成员和管理员的用户 ID 数组，不包含聊天室所有者的用户 ID。该数组可包含的元素数量不超过 `maxusers` 的值。若传该参数，确保至少设置一个数组元素。   |
| `custom`      | String | 否       | 聊天室扩展信息，例如可以给聊天室添加业务相关的标记，不要超过 1,024 个字符。     |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段      | 类型   | 描述                |
| :-------- | :----- | :------------------ |
| `data.id` | String | 创建的聊天室的 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

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

#### 响应示例

```json
{
  "data": {
    "id": "66XXXX33"
  }
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | XX 字段没有设置。 | 请传入必传字段。|
| 400     | illegal_argument | group ID XX already exists! | groupId 重复。 | 使用新的聊天室 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | appKey:XX#XX has create too many chatrooms! | appKey 创建聊天室达到上限。 | 删除不用的聊天室或联系商务调整上限。 |
| 403     | exceed_limit | user XX has joined too many chatrooms! | 用户加入的聊天室达到上限。 | 退出不用的聊天室组或联系商务调整上限。 |
| 403     | exceed_limit | members size is greater than max user size ! | 创建聊天室加入的人超过最大限制（取值范围为 [1,10,000]）。 | 可联系商务提升该限制。 |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | 创建聊天室时添加的用户不存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 修改聊天室信息

修改指定聊天室的信息。仅支持修改聊天室名称、聊天室描述和聊天室最大成员数。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :---------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。   |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。   |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

你只能修改聊天室名称、聊天室描述和聊天室最大成员数。

| 参数          | 类型   | 是否必需 | 描述        |
| :------------ | :----- | :------- | :------------- |
| `name`        | String | 是       | 聊天室名称，不能超过 128 个字符。     |
| `description` | String | 是       | 聊天室描述，不能超过 512 个字符。     |
| `maxusers`    | Int    | 是       | 聊天室最大成员数（包括聊天室所有者），默认可设置的最大人数为 10,000，如需调整请联系商务。 |

#### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述          |
| :----------------- | :--- | :---------------- |
| `data.groupname`   | Bool | 聊天室名称是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| `data.description` | Bool | 聊天室描述是否修改成功。<br/> - `true`：是。<br/> `false`：否。                           |
| `data.maxusers`    | Bool | 聊天室最大成员数（包括聊天室所有者）是否修改成功。<br/> - `true`：是。<br/> `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "name": "testchatroom",
   "description": "test",
   "maxusers": 300
 }' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

#### 响应示例

```json
{
  "data": {
    "description": true,
    "maxusers": true,
    "groupname": true
  }
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 403     | exceed_limit | title cannot exceed to XXXX| 聊天室名称超限。 | 传入长度在范围以内的聊天室名称。 |
| 403     | exceed_limit | desc cannot exceed to XXXX | 聊天室描述超限。 | 传入长度在范围以内的聊天室描述。 |
| 403     | exceed_limit | maxUsers cannot exceed XXXX | 聊天室最大成员数超限。 | 传入正确的最大成员数。 |
| 400     | invalid_parameter  | "some of [chatroom_id] are not valid fields"  | 修改的群组信息时，传入的参数不支持，例如修改 `chatroom_id`。仅支持修改聊天室名称、聊天室描述和聊天室最大成员数。| 

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 转让聊天室

修改聊天室所有者为同一聊天室中的其他成员。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

#### 路径参数

| 参数          | 类型   | 是否必需 | 描述  |
| :-------------- | :----- | :------- | :----------------------------------------- |
| `chatroom_id` | String | 是       | 要转让的聊天室 ID。  |

其他参数及描述详见[公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :----------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。       |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数       | 类型   | 描述                      |
| :--------- | :----- | :------------------------ |
| `newowner` | String | 聊天室新的所有者的用户 ID。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                 | 类型   | 描述   |
| :------------------- | :----- | :------------ |
| `data`               | JSON   | 数据详情。 |
| `data.newowner` | Boolean | 操作结果：<br/> - `true`：转让成功。<br/> - `false`：转让失败。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "newowner": "user2"
   }' 'https://XXXX/XXXX/XXXX/chatrooms/66XXXX85'
```

#### 响应示例

```json
{
  "action": "put",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/66XXXX85",
  "entities": [],
  "data": {
    "newowner": true
  },
  "timestamp": 1542537813420,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。|
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |
| 404     | resource_not_found | username XX doesn't exist! | 传入的聊天室新所有者的用户 ID 不存在。 | 传入存在的合法的用户 ID。|
| 403     | forbidden_op     | "new owner and old owner are the same" | 新的聊天室所有者和旧的所有者不能是同一聊天室成员。 | 传入的聊天室新所有者的用户 ID 不能与旧的所有者的用户 ID 相同。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 解散聊天室

解散单个聊天室。如果要解散的聊天室不存在，会返回错误。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :-------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

参数及描述详见 [公共参数](#公共参数)。

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数           | 类型   | 描述                                                          |
| :------------- | :----- | :------------------------------------------------------------ |
| `data.success` | Bool   | 是否成功解散聊天室：<br/> - `true`：是；<br/> - `false`：否。 |
| `data.id`      | String | 解散的聊天室的 ID。                                           |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'
```

#### 响应示例

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

### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。