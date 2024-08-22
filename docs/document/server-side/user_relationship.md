# 管理用户关系

<Toc />

环信即时通讯 IM 支持通过 RESTful API 管理用户之间的关系，包括添加和移除联系人以及将用户添加至或移除黑名单。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 IM RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述                                                                                                                                            |
| :--------- | :----- | :------- | :------------------------------------ |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `username` | String | 是       | 用户 ID。     |

### 响应参数

| 参数              | 类型   | 描述      |
| :---------------- | :----- | :------------------- |
| `entities`        | Object | 响应实体。                                                                     |
| `data`            | Object | 实际获取的数据详情。                                                           |
| `uuid`            | String | 用户在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `username`        | String | 用户 ID。                                                                      |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `username`        | String | 用户 ID。                                                                      |
| `nickname`        | String | 用户昵称。                                                                     |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | String | 请求响应时间，单位为毫秒。                                                     |

用户关系管理的主要接口如下：

## 添加好友

添加好友，好友必须是和当前用户在一个 App Key 下的用户。

对于免费版即时通讯服务，单个 App Key 下的每个用户的好友数量上限为 100，不同服务版本的 App Key 的该数量上限不同，具体可参考[版本功能介绍](https://www.easemob.com/pricing/im)。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述                |
| :---------------- | :----- | :------- | :------------------ |
| `owner_username`  | String | 是       | 为哪个用户添加好友。 |
| `friend_username` | String | 是       | 要添加的用户 ID。   |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `Content-Type`  | String | 是         | 内容类型。请填 `application/json`。               |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。           |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型       | 描述                                                                    |
| :------------------- | :--------- | :---------------------------------------------------------------------- |
| `entities`           | JSON Array | 添加的好友的详情。                                                      |
|  - `uuid`      | String     | 系统内为好友生成的系统内唯一标识，开发者无需关心。                      |
|  - `type`      | String     | 对象类型，值为 `user` 或 `group`。                                      |
|  - `created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                 |
|  - `modified`  | Long       | 好友的用户信息如密码或者昵称等最新修改时间，Unix 时间戳，单位为毫秒。   |
|  - `username`  | String     | 添加的好友的用户 ID。                                                   |
|  - `activated` | Bool       | 好友是否为正常状态：<br/> • `true` 正常状态。<br/> • `false` 已被封禁。 |
|  - `nickname`  | String     | 好友的用户昵称。                                                        |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'
```

#### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "path": "/users/475XXXXba/contacts",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/contacts",
  "entities": [
    {
      "uuid": "b2aXXXXf1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | exceed_limit | user contact number exceed limit | 好友数量达到上限。对于免费版来说，单个用户的好友数上限为 100， 对于专业版和旗舰版 IM 来说，该上限为 3000。 | 检查添加的和被添的用户好友数量是否达到上限。 |
| 404     | service_resource_not_found | Service resource not found | 要添加的好友或被添加好友的用户 ID 不存在。 | 检查添加和被添加的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 移除好友

从用户的好友列表中移除一个用户。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述                  |
| :---------------- | :----- | :------- | :-------------------- |
| `owner_username`  | String | 是       | 移除哪个用户的好友。   |
| `friend_username` | String | 是       | 被移除好友的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述      |
| :-------------- | :----- | :--------------------------------------- | :------------------------- |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型       | 描述                                                                               |
| :------------------- | :--------- | :------------------------------------------------ |
| `entities`           | JSON Array | 被移除的好友的详情。                                                               |
| `entities.uuid`      | String     | 系统内为好友生成的系统内唯一标识，开发者无需关心。                                 |
| `entities.type`      | String     | 对象类型，值为 `user` 或 `group`。                                                 |
| `entities.created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                            |
| `entities.modified`  | Long       | 好友的用户信息如密码或者昵称等最近一次修改时间，Unix 时间戳，单位为毫秒。          |
| `entities.username`  | String     | 被移除好友的用户 ID。                                                              |
| `entities.activated` | Bool       | 好友是否为正常状态：<ul><li>`true` 正常状态。</li><li>`false` 已被封禁。</li></ul> |
| `entities.nickname`  | String     | 好友的用户昵称。                                                                   |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'
```

#### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/users/475XXXXba/contacts",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/contacts",
  "entities": [
    {
      "uuid": "b2aXXXXf1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542599266616,
  "duration": 350,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要移除或被移除好友的用户 ID 不存在。 | 检查要移除和被移除的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 设置好友备注

你可以调用该接口设置你在当前 app 下的好友的备注，即你和要设置备注的好友需在同一个 App Key 下。

对于免费版即时通讯服务，单个 App Key 下的每个用户的好友数量上限为 100，不同服务套餐包的 App Key 的该数量上限不同，详见[套餐包功能详情](/product/pricing.html#套餐包功能详情)。

### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `owner_username`  | String | 是       | 要设置哪个用户的好友备注。  |
| `friend_username` | String | 是       | 要设置备注的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述     |
| :-------------- | :----- | :--------------------------------------- | :------------------------ |
| `Content-Type`  | String | 是 | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是 | 内容类型。请填 `application/json`。  |
| `Authorization` | String | 是 | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `remark`  | String | 是   | 好友备注。好友备注的长度不能超过 100 个字符。  |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                 | 类型     | 描述                                    |
| :------------------- |:-------|:--------------------------------------|
| `action`           | String | 请求方法。                                 |
| `status`      | String | 好友备注是否设置成功，`ok` 表示设置成功。                         |
| `timestamp`   | Long   | HTTP 响应的 UNIX 时间戳，单位为毫秒。                         |
| `uri`  | Long   | 请求 URL。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X PUT 'https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "remark": <remark>
}'
```

#### 响应示例

```json
{
  "action": "put",
  "duration": 22,
  "status": "ok",
  "timestamp": 1700633088329,
  "uri": "https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | illegal_argument | updateRemark they are not friends, please add as a friend first. | 要添加备注的两个用户不是好友关系。 | 先成为好友再设置好友备注。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要设置或被设置好友备注的用户 ID 不存在。 | 检查要设置和被设置好友备注的用户 ID 是否存在。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 分页获取好友列表

分页获取指定用户的好友列表。 

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/user/{username}/contacts?limit={N}&cursor={cursor}&needReturnRemark={true/false} 
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `username`  | String | 是       | 要获取哪个用户的好友列表。  |

其他参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数      | 类型      | 是否必需 | 描述                                               |
|:--------|:--------|:-----|:-------------------------------------------------|
| `limit` | Int     | 否    | 每次期望返回的好友的数量。取值范围为 [1,50]。该参数仅在分页获取时为必需，默认为 `10`。 |
| `cursor` | String  | 否    | 数据查询的起始位置。该参数仅在分页获取时为必需。第一次调用该接口不传 `cursor`，获取 `limit` 指定的好友数量。| 
| `needReturnRemark` | Boolean | 否    | 是否需要返回好友备注：<br/> - `true`：返回；<br/> - （默认）`false`：不返回。|


#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述          |
| :-------------- | :----- | :--------------- | :-------------------- |
| `Content-Type`  | String | 是  | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是  | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是  | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述             |
|:-------------------------|:-------|:---------------|
| `count`                  | Int    | 当前页的好友数量。     | 
| `data`                   | Object | 返回的好友列表对象。     |
| `data.contacts`          | Array  | 返回的好友列表数据。      |
| `data.contacts.remark`   | String | 好友备注。           |
| `data.contacts.username` | String | 好友的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -L -X GET 'https://XXXX/XXXX/XXXX/user/XXXX/contacts?limit=10&needReturnRemark=true' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer  <YourAppToken>'
```

#### 响应示例

```json
{
  "uri": "http://XXXX/XXXX/XXXX/users/XXXX/rostersByPage",  
  "timestamp": 1706238297509,
  "entities": [],
  "count": 1,
  "action": "get",
  "data": {
    "contacts": [
      {
        "remark": null,
        "username": "username"
      }
    ]
  },
  "duration": 27
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型 | 错误提示          | 可能原因                               | 处理建议                 |
|:---------| :--- | :------------- |:-----------------------------------|:---------------------|
| 401      | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。       |
| 404      | service_resource_not_found | Service resource not found | 获取好友列表的用户 ID 不存在。   | 检查获取好友列表的用户 ID 是否存在。 |
| 400      | illegal_argument | getContacts | page size more than max limit : 50 | 传入的每页好友数 `limit` 超过 50。 | 下调 `limit` 参数的值。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 一次性获取好友列表

一次性获取指定用户的好友列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users
```

#### 路径参数

| 参数             | 类型   | 是否必需 | 描述                      |
| :--------------- | :----- | :------- | :------------------------ |
| `owner_username` | String | 是       | 好友列表所有者的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                                                                                 |
| :-------------- | :----- | :------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述                                    |
| :------ | :---- | :-------------------------------------- |
| `data`  | Array | 获取的好友列表，例如 "user1", "user2"。 |
| `count` | Int   | 好友数量。                              |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/contacts/users' \
-H 'Authorization: Bearer <YourAppToken>'
```

#### 响应示例

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/contacts/users",
  "entities": [],
  "data": ["user3", "user2"],
  "timestamp": 1543819826513,
  "duration": 12,
  "count": 2
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 获取好友列表的用户 ID 不存在。 | 检查获取好友列表的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 导入好友列表

你可以调用该接口导入好友列表。

**调用频率上限**：100 次/秒/App Key

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/contacts/import
```

#### 路径参数

| 参数              | 类型   | 是否必需 | 描述           |
| :---------------- | :----- | :------- |:-------------|
| `username`  | String | 是  | 为哪个用户导入好友列表。  |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求参数

| 参数      | 类型 | 是否必需 | 描述    |
|:--------|:--------|:-----|:----------------------|
| `isSendNotice` | Boolean | 否    | 好友导入后是否向 SDK 发送通知：<br/> - `true`：是；<br/> -（默认）`false`：否。 |

#### 请求 body

| 参数      | 类型    | 是否必需 | 描述                       |
|:--------|:------|:-----|:-------------------------|
| `usernames` | Array | 是    | 好友的用户 ID，一次最多可导入 10 个。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述   |
| :-------------- | :----- | :------------ | :------------- |
| `Content-Type`  | String | 是     | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是     | 内容类型。请填 `application/json`。   |
| `Authorization` | String | 是     | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                       | 类型     | 描述                |
|:-------------------------|:-------|:------------------|
| `status`                 | String | 返回 `ok` 表示好友导入成功。       |
| `timestamp`              | Long | 当前时间戳，单位为毫秒。             |
| `action`                 | String | 请求方法。  |
| `data`               | JSON   | 实际获取的数据详情。            |
| `data.UnKnowFailed`      | Array | 因系统异常添加失败的好友的用户 ID。 |
| `data.success`           | Array | 成功添加好友的用户 ID。     |
| `data.NotExistFailed`    | Array | 不存在的好友的用户 ID。 |
| `data.maxLimitFailed`    | Array | 因导入的好友已达上限而导入失败的好友的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。常见的异常类型如下表所示。

| 异常类型 |  HTTP 状态码  | 错误信息     | 错误描述    |
| :-------- | :----- | :------ |:----- |
| `illegal_argument` | 400  | `request user over flow limit:10.`  | 请求 body 中传入的用户 ID 数量超过了 10。  |
| `exceed_limit`  | 403   | `Inviter's contact max count.`  | 调用该接口的用户的好友数量已达上限。单个用户的好友数上限与你购买的套餐包相关，详见[套餐包功能详情](/product/pricing.html#套餐包功能详情)。 |

关于其他异常，你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl --location 'https://{host}/{org_name}/{app_name}/users/{username}/contacts/import' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "usernames":[
        "1",
        "2",
        "3"
    ]
}'
```

#### 响应示例

```json
{
  "status": "ok",
  "timestamp": 1712728623854,
  "action": "post",
  "data": {
    "UnKnowFailed": [],
    "success": [
      "username1",
      "username2",
      "username3"
    ],
    "NotExistFailed": [],
    "maxLimitFailed": []
  },
  "duration": 176
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 导入好友列表的用户 ID 不存在。 | 检查导入好友列表的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 添加用户至黑名单

将一个或多个用户添加用户到黑名单。用户被加入黑名单后，无法向你发送消息，也无法发送好友申请。

用户可以将任何其他用户添加到黑名单列表，无论该用户是否是好友。好友被加入黑名单后仍在好友列表上显示。

每个用户的黑名单人数上限为 500。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users
```

#### 路径参数

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `owner_username` | String | 是       | 添加到哪个用户的黑名单。 |

其他参数及描述详见[公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述                                                                                                                 |
| :-------------- | :----- | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `Content-Type`  | String | 是                                       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数        | 类型  | 是否必需 | 描述                                             |
| :---------- | :---- | :------- | :----------------------------------------------- |
| `usernames` | Array | 是       | 要加入黑名单的用户 ID，例如 ["user1", "user2"]。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型  | 描述                    |
| :----- | :---- | :---------------------- |
| `data` | Array | 添加至黑名单的用户 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "usernames": [
     "user2"
   ]
 }' 'https://XXXX/XXXX/XXXX/users/user1/blocks/users'
```

#### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "uri": "https://XXXX.com/XXXX/testapp",
  "entities": [],
  "data": ["user2"],
  "timestamp": 1542600372046,
  "duration": 11,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要添加或被添加的用户 ID 不存在。 | 检查添加和被添加的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取黑名单列表

获取加入黑名单的用户列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users?pageSize={N}&cursor={cursor}
```

#### 路径参数

| 参数             | 类型   | 是否必需 | 描述                |
| :--------------- | :----- | :------- | :------------------ |
| `owner_username` | String | 是       | 获取哪个用户的黑名单。 |

其他参数及描述详见[公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述                                  |
| :------- | :----- | :------- | :-------------------------- |
| `pageSize`  | Int    | 否       | 每次期望返回的黑名单用户的数量。取值范围为 [1,50]。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。     |

:::tip
如果 `pageSize` 和 `cursor` 参数均不传，获取最新加入黑名单的 500 个用户。若只传 `pageSize` 而不传 `cursor`，服务器返回第一页黑名单用户列表，即最新加入黑名单的用户，最多不超过 50 个。
:::

#### 请求 header

| 参数   | 类型   | 是否必需<div style="width: 80px;"></div> | 描述         |
| :-------------- | :----- | :------------------ | :---------------------- |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段    | 类型  | 描述         |
| :------ | :---- | :----------------------- |
| `data`  | Array | 获取的黑名单列表，例如 ["user1", "user2"]。 |
| `count` | Int   | 黑名单上用户的数量。                        |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/blocks/users?pageSize=2'
```

#### 响应示例

```json
{
    "uri": "https://XXXX/XXXX/XXXX/users/XXXX/blocks/users",
    "timestamp": 1682064422108,
    "entities": [],
    "cursor": "MTA5OTAwMzMwNDUzNTA2ODY1NA==",
    "count": 2,
    "action": "get",
    "data": [
        "tst05",
        "tst04"
    ],
    "duration": 52
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要查询的用户 ID 不存在。 | 检查查询的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 从黑名单中移除用户

从用户的黑名单中移除用户：

- 将好友从黑名单中移除后，恢复好友关系，可以正常收发消息；
- 将非好友从黑名单中移除后，恢复到未添加好友的状态。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users/{blocked_username}
```

#### 路径参数

| 参数               | 类型   | 是否必需 | 描述                    |
| :----------------- | :----- | :------- | :---------------------- |
| `owner_username`   | String | 是       | 从哪个用户的黑名单中移除用户。     |
| `blocked_username` | String | 是       | 要移出黑名单的用户 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需<div style="width: 80px;"></div> | 描述             |
| :-------------- | :----- | :---------------------- | :------------------------------------ |
| `Accept`        | String | 是                                       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是                                       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数                 | 类型       | 描述             |
| :------------------- | :--------- | :---------------------------------------- |
| `entities`           | JSON Array | 从黑名单中移除的用户的详细信息。                                                        |
| `entities.uuid`      | String     | 用户在系统内的唯一标识。系统自动生成，开发者无需关心。                                  |
| `entities.type`      | String     | 对象类型，值为 `user`。                                                                 |
| `entities.created`   | Long       | 用户创建时间，Unix 时间戳，单位为毫秒。                                                 |
| `entities.modified`  | Long       | 用户信息如密码或昵称等的最新修改时间，Unix 时间戳，单位为毫秒。                         |
| `entities.username`  | String     | 被移出黑名单的用户 ID。                                                                 |
| `entities.activated` | Bool       | 用户是否为正常状态：<br/> • `true` 该用户为正常状态。<br/> • `false` 该用户为封禁状态。 |
| `entities.nickname`  | String     | 被移出黑名单的用户的昵称。                                                              |

其他字段及描述详见[公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/users/user1/blocks/users/user2'
```

#### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/users/475XXXXba/blocks",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/blocks",
  "entities": [
    {
      "uuid": "b2aXXXXf1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542600712985,
  "duration": 20,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码    | 错误类型 | 错误提示     | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | service_resource_not_found | Service resource not found | 要移除或被移除的用户 ID 不存在。 | 检查要移除和被移除的用户 ID 是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
