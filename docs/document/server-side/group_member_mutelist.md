# 群组成员禁言管理

<Toc />

环信即时通讯 IM 提供多个接口实现聊天室成员禁言，包括获取禁言列表、将成员添加或移出禁言列表，以及全员禁言和解除全员禁言。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 群成员的相关限制，详见 [使用限制](limitation.html#群组)。

## 公共参数

#### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。    |
| `username` | String | 是       | 用户 ID。             |

#### 响应参数

| 参数              | 类型   | 描述                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | 请求方法。                                                                     |
| `organization`    | String | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识，与请求参数 `org_name` 相同。 |
| `application`     | String | 应用在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `applicationName` | String | 你在环信即时通讯云控制台创建应用时填入的应用名称，与请求参数 `app_name` 相同。 |
| `uri`             | String | 请求 URL。                                                                     |
| `path`            | String | 请求路径，属于请求 URL 的一部分，开发者无需关注。                              |
| `entities`        | JSON   | 响应实体。                                                                     |
| `data`            | JSON   | 实际获取的数据详情。                                                           |
| `uuid`            | String | 用户在系统内的唯一标识。该标识由系统生成，开发者无需关心。                     |
| `created`         | Long   | 群组创建时间，Unix 时间戳，单位为毫秒。                                        |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `properties`      | String | 响应属性。                                                                     |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 获取禁言列表

#### 功能说明

- 根据群组 ID 获取群组的禁言用户列表，包括禁言用户 ID 和禁言到期时间。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述        |
| :-------------- | :----- | :------- | :--------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                         |
| :------------ | :----- | :--------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `expire` | Long   | 禁言到期的时间，单位为毫秒。 |
|  - `user`   | String | 被禁言用户的 ID。            |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute",
  "entities": [],
  "data": [
    {
      "expire": 1489158589481,
      "user": "user1"
    }
  ],
  "timestamp": 1489072802179,
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
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群组 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 禁言指定群成员

#### 功能说明

- 将一个或多个群成员加入禁言列表，即禁止群成员在一段时间内发言或永久禁言。
- 若禁言一段时间，时间到期，自动解除禁言。若设置为永久禁言，只能 [调用 API 解除禁言](#解除成员禁言) 。
- 被禁言的用户可以接收和查看群组内其他用户发送的消息，但不能发送消息。
- 一次最多可禁言 60 个群组成员。
- 群成员被禁言后，将无法在群组中发送消息，也无法在该群组下的子区中发送消息。
- 群禁言列表上的成员即使其被加入群白名单也不能发言。
- 被禁言用户退出群组之后再进入同一群组，若禁言时间未到期，禁言仍然有效。
- 开启和关闭全员禁言，并不影响群组禁言列表。
- 群成员禁言会触发发送后回调，详见 [群成员禁言事件](callback_group_room_mute.html#将成员加入禁言列表)。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :----------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型  | 是否必需 | 描述                                                       |
| :-------------- | :---- | :------- | :--------------------------------------------------------- |
| `mute_duration` | Long  | 是       | 禁言时长，单位为毫秒。例如，传入 `1000`，则禁言在 1 秒后到期。<br/>`0` 表示取消禁言，`-1` 表示永久禁言。      |
| `usernames`     | Array | 是       | 要添加到禁言列表的用户 ID 列表，每次最多可添加 60 个。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                            |
| :------------ | :----- | :-------------------------------------------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result` | Bool   | 操作结果：<br/> - `true`：添加成功；<br/> - `false`：添加失败。 |
|  - `expire` | Long   | 禁言到期的时间。该时间为 Unix 时间戳，单位为毫秒。              |
|  - `user`   | String | 被禁言用户的 ID。                                               |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST HTTP://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute -d '{"usernames":["user1"], "mute_duration":1000}' -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute",
  "entities": [],
  "data": [
    {
      "result": true,
      "expire": 1489158589481,
      "user": "user1"
    }
  ],
  "timestamp": 1489072189508,
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
| 403     | forbidden_op | users [XX] are not members of this group! | 要禁言的用户 ID 不在群组中。 | 传入群组中的用户 ID。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | userNames size is more than max limit : 60 | 批量禁言指定群成员数量超过60 | 控制禁言指定群成员数量在 60 以内。 |
| 403    | forbidden_op   | "forbidden operation on group owner!"   | 无法对群主禁言。  |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 禁言全体群成员

#### 功能说明

- 对所有群组成员一键禁言。
- 全员禁言不影响群组禁言列表，即一键禁言不会将群组中的所有成员加入群组禁言列表。
- 设置群组全员禁言后，仅群组白名单中的用户可在群组以及该群组下的子区内发送消息。
- 与加入禁言列表不同，群组全员禁言后，不会在一段时间内解除禁言，需要 [调用接口解除全员禁言](group_member_mutelist.html#解除全员禁言)。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述     |
| :-------------- | :----- | :------- | :---------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型 | 描述                                                            |
| :------------ | :--- | :-------------------------------------------------------------- |
| `data.mute` | Bool | 操作结果：<br/> - `true`：禁言成功；<br/> - `false`：禁言失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/{groupid}/ban'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "XXXX",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/12XXXX53/ban",
  "entities": [],
  "data": {
    "mute": true
  },
  "timestamp": 1594628861058,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 解除成员禁言

#### 功能说明

- 将一个或多个群成员移出禁言列表。
- 一次最多可对 60 个成员解除禁言。
- 移除后，群成员可以在群组中正常发送消息，同时也可以在该群组下的子区中发送消息。
- 将成员解除禁言会触发发送后回调，详见 [将成员移出禁言列表事件](callback_group_room_mute.html#将成员移出禁言列表)。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/mute/{member1}(,{member2},…)
```

##### 路径参数

| 参数     | 类型   | 是否必需 | 描述                                                                                      |
| :------- | :----- | :------- | :---------------------------------------------------------------------------------------- |
| `member` | String | 是       | 要解除禁言的成员的用户 ID，每次最多可传 60 个，多个用户 ID 之间以英文逗号（","）分隔，例如 `{member1},{member2}`。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述    |
| :-------------- | :----- | :------- | :------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型  | 描述                                                            |
| :------------ | :---- | :-------------------------------------------------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result` | Bool  | 操作结果：<br/> - `true`：解除成功；<br/> - `false`：解除失败。 |
|  - `user`   | Array | 被移出禁言列表的用户 ID。                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/10130212061185/mute/user1'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "52XXXXf0",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/10XXXX85/mute/user1",
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

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | removeMute member size more than max limit : 60 | 批量移除禁言列表的用户数超过上限 60。 | 控制解除成员禁言数量在 60 以内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 解除全员禁言

#### 功能说明

- 一键取消对群组全体成员的禁言。
- 解除禁言后，群成员可以在群组和该群组下的子区中正常发送消息。

**调用频率上限**：100 次/秒/App Key

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/ban
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述             |
| :-------------- | :----- | :------- | :------------------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型 | 描述                                                             |
| :---------- | :--- | :--------------------------------------------------------------- |
| `data.mute` | Bool | 是否处于全员禁言状态。<br/> - `true`：是； <br/> - `false`：否。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/{groupid}/ban'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "XXXX",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/12XXXX53/ban",
  "entities": [],
  "data": {
    "mute": false
  },
  "timestamp": 1594628899502,
  "duration": 1,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

