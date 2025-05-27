# 用户收藏

环信即时通讯云 IM 支持你收藏聊天过程中发送成功的各类消息或你的其他自定义内容。这些收藏的内容永久保存，你可以随时查看。例如，你若收藏指定的消息附件，可[将消息附件设置为永久存储](message_attachment_storage.html)，然后再收藏，即可随时查看这些附件内容。

## 公共参数

以下表格列举了环信 IM 的 RESTful 接口的公共请求参数和响应参数：

#### 请求参数

| 参数       | 类型   | 是否必需 | 描述         |
| :--------- | :----- | :------- | :------------------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |

#### 响应参数

| 参数                 | 类型   | 描述            |
| :------------------- | :----- | :-------------------------------------------- |
| `action`             | String | 请求方法。                                   |
| `organization`       | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。          |
| `application`        | String | 系统内为应用生成的唯一标识，开发者无需关心。          |
| `applicationName`    | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。    |
| `uri`                | String | 请求 URL。                |
| `path`               | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。       |
| `data`               | JSON   | 实际获取的数据详情。            |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。       |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长, 单位为毫秒。     |

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。本文介绍的即时通讯所有 REST API 均需使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 分页获取用户收藏

调用该接口获取指定用户的收藏。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/collections  
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `username`  | String | 是       | 要获取哪个用户的收藏。                         |

其它参数及说明详见 [公共参数](#公共参数)。

##### 查询参数

用户收藏可通过两种方式查询，如下所示。除了 `type` 和 `limit` 字段的设置，这两种方式的设置如下：
1. 按时间段：时间段字段和 `direction` 字段配合使用。这种方式下，你必须传入 `begin_time` 和 `end_time` 字段，`direction` 字段的默认值为 `desc`。
2. 从指定的收藏 ID 开始查询：`collection_id` 和 `direction` 字段配合使用。这种方式下，你必须传入 `collection_id`。

**注意：第二种查询方式的优先级高于第一种方式。也就是说，若你传入了 `collection_id` 字段，则设置的 `begin_time` 和 `end_time` 字段无效。**

| 参数     | 类型   | 是否必需 | 描述  |
| :------- | :----- | :------- | :--------------- |
| `begin_time`  | Number   | 否  | 查询开始时间，UNIX 时间戳。默认值为 `0`。该字段必须小于等于 `end_time`。单位为毫秒。  |
| `end_time`  | Number    | 否 | 查询结束时间，UNIX 时间戳。<br/> - 该字段必须大于等于 `begin_time`，默认为系统当前时间。单位为毫秒。<br/> - 若 `end_time` 等于 `begin_time`，服务器查询该时间点的收藏。  |
| `direction`  | String   | 否 | 查询方向：<br/> - （默认）`desc` ：按照收藏时间的降序排列；<br/> - `asc`： 按照收藏时间的升序排列。 |
| `type` | Int | 否       | 收藏类型。若该参数不传，则不限制收藏类型，返回满足查询条件的所有类型的收藏。 |
| `limit`  | Int    | 否       | 请求查询的收藏数量。取值范围为 [1,200]，默认值为 `100`。超过 `200` 则返回参数错误。   |
| `collection_id` | String | 否       | 收藏 ID。参数不为空的情况下：<br/> - `direction` 为 `desc` 时，服务器会将当前收藏的时间戳作为查询结束时间，查询当前收藏及其添加时间之前的所有收藏，按收藏时间的倒序返回。<br/> - `direction` 为 `asc` 时，服务器会将当前收藏的创建时间戳设置为查询开始时间，查询当前收藏及其创建时间之后的所有收藏，按收藏时间的正序返回。|

##### 请求 Header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | :--------------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `collections` | JSON Array   | 获取的用户收藏的详情。 |
| - `id` | String  | 收藏 ID。  |
| - `type` | Int  | 收藏类型。  |
| - `data` |  String    |  收藏内容。     |
| - `ext`| String  |   收藏的扩展信息   |
| - `createdAt` | Long  | 收藏创建时间。            |
| - `updatedAt` | Long  | 收藏更新时间。            |

响应字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X GET -H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' https://XXX/XXX/XXX/users/{username}/collections
```

##### 响应示例

```json
{
    "collections": [
    {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0 
    }
  ]
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_system.html#开放注册单个用户)。 |
| 400         | illegal_argument  | limit should be less than 200   | 传入的每页查询的收藏数量 `limit` 不能超过 200。  | 将 `limit` 的值控制在 200 以内。 |
| 400         | illegal_argument  | direction should be desc or asc   | `direction` 参数传错。  | `direction` 参数只能是 `desc` 或者 `asc`。 |
| 400         |     | user collection not found  | 用户收藏找不到。  | 对 `collection_id` 参数传入存在的用户收藏 ID。        |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。

## 添加一条收藏

调用该接口对指定用户添加一条收藏。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/collections
```

##### 路径参数 

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `username`  | String | 是       | 要对哪个用户添加收藏。                         |

其它参数及说明详见 [公共参数](#公共参数)。

##### 请求 Header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `id`   | String | 否       | 收藏 ID，收藏的唯一标识。若不传，环信服务器会设置随机的 UUID。     |
| `data` | String | 是       | 收藏内容。 |
| `type` | Int    | 是       | 收藏类型。 |
| `ext`  | String | 否       | 收藏的扩展信息。默认为 `NULL`，即无扩展信息。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `id`   | String  | 收藏 ID。  |
| `type` | Int  | 收藏类型。  |
| `data` | String     | 收藏内容。           |
| `ext`  | String  | 收藏的扩展信息。     |
| `createdAt` | Long  | 收藏创建时间。            |
| `updatedAt` | Long  | 收藏更新时间。            |

响应字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X POST https://XXX/XXX/XXX/users/{username}/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 
-d '{
  "id": "string",
  "data": "string",
  "type": 0,
  "ext": "info"
}'
```

##### 响应示例

```json
{
  "collection": {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
  } 
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_system.html#开放注册单个用户)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。

## 批量添加用户收藏

调用该接口对指定用户添加多条收藏。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/collections
```

##### 路径参数 

参数及说明详见 [公共参数](#公共参数)。

##### 请求 Header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `collections`  | Array | 是       | 要添加的收藏详情。最多可添加 20 个收藏。  |
| - `id`  | String | 是       | 收藏 ID。                         |
| - `data`   | String | 是       | 收藏内容。     |
| - `type` | Int | 是       | 收藏类型。 |
| - `ext` | String | 是       | 收藏的扩展信息。 |
| - `createdAt` | Long | 是       | 收藏的添加时间。 |
| `username`  | String | 是       | 为哪个用户添加收藏。  |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X POST https://XXX/XXX/XXX/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
  "collections": [
    {
      "id": "string",
      "type": 0,
      "data": "string",
      "ext": "string",
      "createdAt": 0
    }
  ],
  "username": "string"
}'
```

##### 响应示例

```json
{
  "collections": [ 
    {
    "id": "id1",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }
    {
    "id": "id2",
    "type": 1,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }  
  ] 
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_system.html#开放注册单个用户)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。

## 修改用户收藏的扩展信息

调用该接口修改指定用户的一条收藏的扩展信息。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/collections/{collectionId}
```

##### 路径参数 

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `username`  | String | 是       | 要修改哪个用户的收藏。                         |
| `collectionId`  | String | 是       | 收藏 ID。                         |

其它参数及说明详见 [公共参数](#公共参数)。

##### 请求 Header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `ext` | String | 是       | 收藏的扩展信息。如果设置为空，则表示取消现有的扩展字段。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `id`   | String  | 收藏 ID。  |
| `type` | Int  | 收藏类型。  |
| `data` | String     | 收藏内容。           |
| `ext`  | String  | 收藏的扩展信息。     |
| `createdAt` | Long  | 收藏创建时间。            |
| `updatedAt` | Long  | 收藏更新时间。            |

响应字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X PUT https://XXX/XXX/XXX/users/{username}/collections/{collectionId} \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "ext": "string" 
}'
```

##### 响应示例

```json
{
  "collection": {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
  } 
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_system.html#开放注册单个用户)。 |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。


## 删除用户收藏

调用该接口删除指定用户的收藏。

**调用频率上限**：100 次/秒/App Key 

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/collections
```

##### 路径参数 

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `username`  | String | 是       | 要删除哪个用户的收藏。                         |

其它参数及说明详见 [公共参数](#公共参数)。

##### 请求 Header

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                         |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `collection_ids`  | String | 是       | 收藏 ID。最多可传入 20 个收藏 ID。    |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `result`   | String  | 是否成功删除收藏：<br/> - `true`：成功；<br/> - `false`：失败。 |

响应字段及说明详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码)了解可能的原因。

#### 示例

##### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token 
curl -X DELETE https://XXX/XXX/XXX/users/{username}/collections \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
  "collection_ids": [
  "string"
  ]
}'
```

##### 响应示例

```json
{
  "result": true
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | 用户 ID 不合法。  | 查看注册用户名[规范](account_system.html#开放注册单个用户)。 |
| 400         |     | user collection not found  | 用户收藏找不到。  | 对 `collection_ids` 参数传入存在的用户收藏 ID。        |

关于其他错误，你可以参考 [错误码](error.html) 了解可能的原因。





