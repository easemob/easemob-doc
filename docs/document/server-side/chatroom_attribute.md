# 聊天室属性管理

<Toc />

本文介绍聊天室属性管理相关接口，包括获取和修改聊天室公告以及设置、获取、删除、强制设置和强制删改聊天室自定义属性。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见[接口频率限制](limitationapi.html)。
- 了解聊天室属性相关限制，详见[使用限制](/product/limitation.html#聊天室基本属性)。

## 公共参数

#### 请求参数

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

#### 响应参数

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

## 获取聊天室公告

获取指定聊天室 ID 的聊天室公告。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

在返回值中查看 `data` 字段包含的信息，获取到的聊天室公告信息。

| 参数                | 类型   | 描述             |
| :------------------ | :----- | :--------------- |
| `data.announcement` | String | 聊天室公告内容。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 修改聊天室公告

修改指定聊天室 ID 的聊天室公告。聊天室公告内容不能超过 512 个字符。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :-------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 字段           | 类型   | 是否必需 | 描述                 |
| :------------- | :----- | :------- | :------------------- |
| `announcement` | String | 是       | 修改后的聊天室公告。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述              |
| :------------ | :----- | :-------------------- |
| `data.id`     | String | 聊天室 ID。        |
| `data.result` | Bool   | 是否成功修改聊天室公告：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | forbidden_op | announce info length exceeds limit! | 聊天室公告长度超过上限（不能超过 512 字符）。 | 修改公告长度在限制（ 最大 512 字符）以下。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 设置聊天室自定义属性

指定用户设置特定聊天室的自定义属性。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `username`    | String | 是       | 要设置的聊天室自定义属性的所属用户 ID。   |

其它参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。    |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。    |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数         | 类型   | 是否必需 | 描述             |
| :----------- | :----- | :------- | :----------------------- |
| `metaData`   | JSON   | 是       | 聊天室的自定义属性，存储为键值对（key-value）集合，即 Map<String,String>。该集合中最多可包含 10 个键值对，在每个键值对中，key 为属性名称，最多可包含 128 个字符；value 为属性值，不能超过 4096 个字符。每个聊天室最多可有 100 个自定义属性，每个应用的聊天室自定义属性总大小为 10 GB。<br/> key 支持以下字符集：<br/> • 26 个小写英文字母 a-z；<br/> • 26 个大写英文字母 A-Z；<br/> • 10 个数字 0-9；<br/> • “\_”, “-”, “.”。 |
| `autoDelete` | String | 否       | 当前成员退出聊天室时是否自动删除该自定义属性。 <br/> • （默认）'DELETE'：是； <br/> • 'NO_DELETE'：否。   |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data.successKeys` | Array  | 设置成功的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 设置失败的聊天室属性，返回键值对格式，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

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
  "uri":"https://XXXX/XXXX/XXXX/metadata/chatroom",  
  "timestamp":1716887320215,
  "action":"put",
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要设置的 key 属性数量超过了 10 个。| 要设置的 key 的数量不要超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 401     | MetadataException | user is not in chatroom | 用户不在聊天室内。 | 使用正确的聊天室成员的用户 ID。|
| 400   |  | others are not allowed to be set | 不允许更新他人的聊天室属性。 | 无权更新其他人的聊天室属性。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

由于该 API 批量设置聊天室自定义属性，一次可传入多个 key-value。即使其中有些 key-value 校验失败，也不会影响其他 key-value 正常写入，响应状态码仍为 `200`，示例如下：

```json
{
    "uri": "%s/easemob-demo/chatdemoui/metadata/chatroom",
    "timestamp": 1720769458528,
    "action": "put",
    "data": {
        "successKeys": [],
        "errorKeys": {
            "key1": "properties key 'key1' is exceeding maximum limit 128",
            "key2": "properties key 'key2' is exceeding maximum limit 128"
        }
    }
}
```

## 获取聊天室自定义属性

获取指定聊天室的自定义属性信息。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :----------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。     |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。   |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

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
  "uri": "https://XXXX/XXXX/XXXX/metadata/chatroom", 
  "timestamp": 1716891388636, 
  "action": "post", 
  "data": {
    "key1": "value1", 
    "key2": "value2"
  }
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 聊天室 ID 不存在。 | 传入存在的合法的聊天室 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 删除聊天室自定义属性

用户删除其设置的聊天室自定义属性。该方法只能删除当前用户设置的聊天室自定义属性，不能删除其他成员设置的自定义属性。

该方法每次最多可删除 10 个自定义属性。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `username`    | String | 是       | 要删除的聊天室自定义属性的所属用户 ID。    |

其它参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述            |
| :-------------- | :----- | :------- | :------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。          |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。          |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "keys": ["key1","key2"]
 }' 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1'
```

##### 响应示例

```json
{
  "uri":"https://XXXX/XXXX/XXXX/metadata/chatroom",
  "status":"ok",
  "timestamp":1716887320215,
  "action":"delete",
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要删除的 key 属性数量超过 10 个。 | 要删除的 key 的数量不超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 401     | MetadataException | user is not in chatroom | 用户不在聊天室内。 | 使用正确的聊天室成员的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 强制设置聊天室自定义属性

用户强制设置指定聊天室的自定义属性信息，即该方法可覆盖其他用户设置的聊天室自定义属性。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `username`    | String | 是       | 强制设置的聊天室自定义属性的所属用户 ID。    |

其它参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述   |
| :----------- | :----- | :------- | :---------- |
| `metaData`   | JSON   | 是       | 聊天室的自定义属性，存储为键值对（key-value pair）集合，即 Map<String,String>。该集合中最多可包含 10 个键值对，在每个键值对中，key 为属性名称，最多可包含 128 个字符；value 为属性值，不能超过 4096 个字符。每个聊天室最多可有 100 个自定义属性，每个应用的聊天室自定义属性总大小为 10 GB。<br/> key 支持以下字符集：<br/> • 26 个小写英文字母 a-z；<br/> • 26 个大写英文字母 A-Z；<br/> • 10 个数字 0-9；<br/> • “\_”, “-”, “.”。 |
| `autoDelete` | String | 否   | 当前成员退出聊天室时是否自动删除该自定义属性。 <br/> • （默认）'DELETE'：是； <br/> • 'NO_DELETE'：否。    |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段               | 类型   | 描述                                                                     |
| :----------------- | :----- | :---------------------------- |
| `data.successKeys` | Array  | 设置成功的聊天室属性名称列表。                                           |
| `data.errorKeys`   | Object | 设置失败的聊天室属性。这里返回键值对，key 为属性名称，value 为失败原因。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要设置的 key 属性数量超过了 10 个。 | 要设置的 key 的数量不要超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 401     | MetadataException | user is not in chatroom | 用户不在聊天室内。 | 使用正确的聊天室成员的用户 ID。 |

由于该 API 批量设置聊天室自定义属性，一次可传入多个 key-value。即使其中有些 key-value 校验失败，也不会影响其他 key-value 正常写入，响应状态码仍为 `200`，示例如下：

```json
{
    "uri": "%s/easemob-demo/chatdemoui/metadata/chatroom",
    "timestamp": 1720769458528,
    "action": "put",
    "data": {
        "successKeys": [],
        "errorKeys": {
            "key1": "properties key 'key1' is exceeding maximum limit 128",
            "key2": "properties key 'key2' is exceeding maximum limit 128"
        }
    }
}
```

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 强制删除聊天室自定义属性

用户强制删除聊天室的自定义属性信息，即该方法除了会删除当前用户设置的聊天室自定义属性，还可以删除其他用户设置的自定义属性。

该方法每次最多可删除 10 个自定义属性。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :-------------------- |
| `username`    | String | 是       | 强制删除的聊天室自定义属性的所属用户 ID。    |

其它参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :-------------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

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

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl  -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | 要删除的 key 属性数量超过 10 个。 | 要删除的 key 的数量不要超过 10 个。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。