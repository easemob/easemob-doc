# 聊天室用户标签禁言

<Toc />

环信即时通讯 IM 支持设置用户在聊天室中的标签，并按标签用户禁言。**要使用该功能，需联系环信商务开通。**

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM REST API 的调用频率限制，详见[接口频率限制](limitationapi.html)。
- 了解聊天室成员相关限制，详见[使用限制](/product/limitation.html#聊天室成员)。

## 公共参数

#### 请求参数

| 参数          | 类型   | 是否必需 | 描述  |
| :------------ | :----- | :------- | :---------------- |
| `host`        | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name`    | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name`    | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `chatroom_id` | String | 是       | 聊天室 ID。  |
| `username`    | String | 是       | 用户 ID。    |

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
| `created`            | String | 用户、群组或聊天室的创建时间，Unix 时间戳，单位为毫秒。    |
| `timestamp`          | Long   | HTTP 响应的 Unix 时间戳，单位为毫秒。   |
| `duration`           | Long   | 从发送 HTTP 请求到响应的时长，单位为毫秒。     |

## 认证方式

环信即时通讯 REST API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 REST API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 按用户在聊天室中的标签禁言

可以控制标签下的用户是否可以在聊天室中发言。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/tag/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                          |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `mute_duration` | Long   | 是       | 禁言时长，单位为秒。例如，传入 `60`，则禁言在 60 秒后到期。<br/>`0` 表示取消禁言，`-1` 表示永久禁言。 |
| `tag`           | String | 是       | 标签名称，标签名称长度不能超过32字符。                       |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型 | 描述                                                    |
| :------------ | :--- | :------------------------------------------------------ |
| `data.result` | Bool | 是否成功禁言：<br/> - `true`：是；<br/> - `false`：否。 |
| `properties` | JSON | 开发者无需关注该字段。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/tag/mute' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "tag": "t1",
    "mute_duration": 30
}
```

##### 响应示例

```json
{
  "action": "put",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/tag/mute",
  "entities":[],
  "data": {
    "result": true
  },
  "timestamp": 1489072189508,
  "duration": 0,
  "properties":{}, 
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型           | 错误提示                       | 可能原因                              | 处理建议     |
| :---------- | :----------------- | :--------- | :------------------------------------ | :----------------------------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。                |
| 404         | resource_not_found | grpID XX does not exist!       | 聊天室不存在。                        | 使用合法的聊天室 ID。                |
| 403         | forbidden_op       | Group tag mute is disabled     | 聊天室标签禁言功能没有开通。          | 联系环信商务开通聊天室标签禁言功能。 |
| 404         | resource_not_found | group tag not found            | 聊天室标签不存在。                    | 先为用户设置聊天室标签再进行操作。   |
| 403 | exceed_limit | tag length exceeds limit! | 标签名称长度超过限制。 | 控制标签名称长度。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 设置用户在聊天室中的标签 

设置用户在聊天室中的标签，一次最多设置 10 个，新设置的标签会覆盖原有标签。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}/tag 
```

##### 路径参数

| 参数            | 类型   | 描述                   | 是否必填 |
| :-------------- | :----- | :--------------------- | :------- |
| `chatroom_id`  | String | 聊天室 ID。     | 是       |
| `username` | String | 为哪个用户添加在该聊天室中的标签。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                          |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数   | 类型  | 是否必需 | 描述                                                         |
| :----- | :---- | :------- | :----------------------------------------------------------- |
| `tags` | Array | 是       | 设置用户在聊天室中的标签列表。最多可设置 10 个标签。传 "tags":[] 会删除用户的聊天室标签。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型 | 描述                                                    |
| :------------ | :--- | :------------------------------------------------------ |
| `data.result` | Bool | 是否修改成功：<br/> - `true`：是；<br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT -H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
    "tags": ["t1", "t2"]
}'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag'
```

##### 响应示例

```json
{
  "action": "put",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag",
  "entities":[],
  "data": {
    "result": true
  },
  "timestamp": 1489072189508,
  "properties":{},
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型     | 错误提示         | 可能原因           | 处理建议                                   |
| :---------- | :----------------- | :---------------- | :-------------------- | :------------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth)            | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。   |
| 400         | forbidden_op       | users [XX] are not members of this group! | 用户 ID 不在聊天室中。                | 传入聊天室中的用户 ID。  |
| 404         | resource_not_found | grpID XX does not exist!                  | 聊天室不存在。                        | 使用合法的聊天室 ID。  |
| 403         | forbidden_op       | Group tag mute is disabled                | 聊天室标签禁言功能没有开通。          | 联系环信商务开通聊天室标签禁言功能。       |
| 403         | exceed_limit       | user group tag count exceed limit | 用户聊天室标签设置的数量超过限制。    | 控制一次请求 `tags` 的标签个数不要超过限制（10 个）。 |
| 400         | invalid_parameter  | tags should be type of List               | 请求 body 中 `tags` 的类型错误。   | 请求 body 中的 `tags` 请使用数组类型 。|
| 403 | exceed_limit | tag length exceeds limit! | 标签名称长度超过限制。 | 控制标签名称长度不要超过32字符。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 获取用户聊天室标签

获取某个用户在指定聊天室中的标签。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}/users/{username}/tag 
```

##### 路径参数

| 参数            | 类型   | 描述                   | 是否必填 |
| :-------------- | :----- | :--------------------- | :------- |
| `chatroom_id`  | String | 聊天室 ID。     | 是       |
| `username` | String | 获取哪个用户在该聊天室中的标签。 | 是       |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                          |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段   | 类型 | 描述                                                         |
| :----- | :--- | :----------------------------------------------------------- |
| `data` | JSON | 响应数据，格式为<标签名称>:<标签过期时间戳(毫秒)>。`-1` 表示对该用户永久禁言。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatrooms/12XXXX11/users/u10/tag",
  "entities":[],
  "data": {
    "t2":"1730790248255"
  },
  "timestamp": 1489072189508,
  "properties":{},
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型           | 错误提示                                  | 可能原因                              | 处理建议                             |
| :---------- | :----------------- | :---------------------------------------- | :------------------------------------ | :----------------------------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth)            | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。                |
| 400         | forbidden_op       | users [XX] are not members of this group! | 用户 ID 不在聊天室中。                | 传入聊天室中的用户 ID。              |
| 404         | resource_not_found | grpID XX does not exist!                  | 聊天室不存在。                        | 使用合法的聊天室 ID。                |
| 403         | forbidden_op       | Group tag mute is disabled                | 聊天室标签禁言功能没有开通。          | 联系环信商务开通聊天室标签禁言功能。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

