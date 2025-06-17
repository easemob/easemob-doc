# 添加/移除群组成员

<Toc />

环信即时通讯 IM 提供了多个 RESTful API 接口实现群组成员的添加和移除，包括添加单个或批量添加成员和移除单个或批量移除成员。

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
| `created`         | Long   | 群组创建时间，Unix 时间戳，单位为毫秒。                                        |
| `timestamp`       | Long   | Unix 时间戳，单位为毫秒。                                                      |
| `duration`        | Int    | 从发送请求到响应的时长，单位为毫秒。                                           |
| `properties`      | String | 响应属性。                                                                     |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 添加单个群组成员

#### 功能说明

- 每次添加一个群成员。
- 若添加的用户已是群成员，则添加失败，返回错误 403。
- 添加单个群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 添加群成员会触发发送后回调，详见 [邀请用户入群事件](callback_group_room_join.html#邀请用户入群)。

**调用频率上限**：100 次/秒/App Key   

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{username}?need_notify=false
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `username` | String | 是       | 要添加为群成员的用户 ID。             |

其他参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `need_notify` | Bool   | 否       | 添加群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述                                                                  |
| :------------- | :----- | :-------------------------------------------------------------------- |
| `data.result`  | Bool   | 添加结果：<br/> - `true`：成功。<br/> - `false`：失败。               |
| `data.groupid` | String | 群组 ID。                                                             |
| `data.action`  | String | 执行的操作。在该响应中，该字段的值为 `add_member`，表示添加群组成员。 |
| `data.user`    | String | 添加的用户 ID。                                                       |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user4?need_notify=false'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user4",
  "entities": [],
  "data": {
    "result": true,
    "groupid": "66XXXX85",
    "action": "add_member",
    "user": "user4"
  },
  "timestamp": 1542364958405,
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
| 403     | forbidden_op | can not join this group, reason:user: XX already in group: XX\n | 用户已经在群里。 | 不要重复加入。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 404     | resource_not_found | username XX doesn't exist! | 要添加的用户不存在 | 使用合法的用户，即 `username` 传入存在的用户 ID。|
| 403     | exceed_limit | user XX has joined too many groups! | 用户可加入的群组数达到上限。 | 退出不用的群组或联系商务调整上限。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 批量添加群组成员

#### 功能说明

- 一次为群组添加多个成员。
- 每次最多可以添加 60 位成员。如果所有用户均已是群成员，添加失败，返回错误 403。
- 添加群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 添加群成员会触发发送后回调，详见 [邀请用户入群事件](callback_group_room_join.html#邀请用户入群)。

**调用频率上限**：100 次/秒/App Key   

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users?need_notify=false
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `need_notify` | Bool   | 否       | 添加群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。        |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。      |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数        | 类型  | 是否必需 | 描述     |
| :---------- | :---- | :------- | :---------- |
| `usernames` | Array | 是   | 要添加为群组成员的用户 ID 数组，每次最多可传 60 个用户 ID。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述          |
| :---------------- | :----- | :----------------- |
| `data.newmembers` | Array  | 添加的群组成员的用户 ID。   |
| `data.groupid`    | String | 群组 ID。  |
| `data.action`     | String | 执行的操作。在该响应中，该字段的值为 `add_member`，表示添加群成员。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
   "usernames": [
     "user4","user5"
   ]
 }' 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users?need_notify=false'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users",
  "entities": [],
  "data": {
    "newmembers": ["user5", "user4"],
    "groupid": "66XXXX85",
    "action": "add_member"
  },
  "timestamp": 1542365557942,
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
| 403     | forbidden_op | an not join this group, reason:user: XX already in group: XX\n | 用户已经在群里。 | 不要重复加入。|
| 403     | exceed_limit | user XX has joined too many groups! | 用户可加入的群组数达到上限。 | 退出不用的群组或联系商务调整上限。 |
| 403     | exceed_limit | members size is greater than max user size ! | 加入群成员的人数超过最大限制。每次最多可以添加 60 位成员。 | 调整创建群的加群人数。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 404     | resource_not_found | username XX doesn't exist! | 要添加的用户不存在。 | 使用合法的用户，即 `username` 传入存在的用户 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 移除单个群组成员

#### 功能说明

- 从群中移除单个成员。
- 如果被移除用户不是群成员，将移除失败，并返回错误。移除后，该成员也会被移除其在该群组中加入的子区。
- 移除群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 移除群成员会触发发送后回调，详见 [将用户踢出群组事件](callback_group_room_leave.html#被踢)。

**调用频率上限**：100 次/秒/App Key   

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{username}?need_notify=false
```

##### 路径参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `username` | String | 是       | 要被移除的群成员的用户 ID。            |

其他参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `need_notify` | Bool   | 否       | 添加群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :---------------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。     |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述                                                                     |
| :------------- | :----- | :----------------------------------------------------------------------- |
| `data.result`  | Bool   | 移除结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。          |
| `data.groupid` | String | 群组 ID。                                                                |
| `data.action`  | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除群组成员。 |
| `data.user`    | String | 被移除的用户 ID。                                                        |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3?need_notify=false'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/user3",
  "entities": [],
  "data": {
    "result": true,
    "action": "remove_member",
    "user": "user3",
    "groupid": "66XXXX85"
  },
  "timestamp": 1542365943067,
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
| 403     | forbidden_op | users [XX] are not members of this group! | 用户不在群组中。 | 传入群组中成员的用户 ID。|
| 403     | forbidden_op | forbidden operation on group owner! | 群主不能被移除。 | 不要将群主移出群组。 |
| 403     | exceed_limit | user XX has joined too many groups! | 用户加入的群组数达到上限。 | 退出不用的群组或联系商务调整上限。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 批量移除群组成员

#### 功能说明

- 一次移除多名群成员，一次最多可移除 60 个。
- 如果所有被移除用户均不是群成员，将移除失败，并返回错误。移除后，这些成员也会被移除其在该群组中加入的子区。
- 移除群成员后，服务器默认向群内成员发送系统通知。你可以设置是否发送该通知。
- 移除群成员会触发发送后回调，详见 [将用户踢出群组事件](callback_group_room_leave.html#被踢)。
- 被移除的群组成员仍能从服务器拉取到被移除前在群组中发送和接收的消息。

**调用频率上限**：100 次/秒/App Key   

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/users/{members}?need_notify=false
```

##### 路径参数

| 参数      | 类型   | 是否必需 | 描述                                                                                                            |
| :-------- | :----- | :------- | :-------------------------------------------------------------------------------------------------------------- |
| `members` | String | 是       | 要移除的群成员的用户 ID，用户 ID 之间用英文逗号（","）分隔。建议每次最多传 60 个用户 ID，并且 URL 的长度不超过 4 KB。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------ |
| `need_notify` | Bool   | 否       | 移除群成员后是否向群内成员发送系统通知。<br/> - （默认）`true`：是；<br/> - `false`：否。   |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述           |
| :-------------- | :----- | :------- | :-------------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段           | 类型   | 描述            |
| :------------- | :----- | :------------------- |
| `data` | JSON Array | 响应数据。|
|  - `result`  | Bool   | 操作结果：<br/> - `true`：移除成功；<br/> - `false`：移除失败。          |
|  - `action`  | String | 执行的操作。在该响应中，该字段的值为 `remove_member`，表示移除群组成员。 |
|  - `reason`  | String | 操作失败的原因。                                                         |
|  - `user`    | String | 被移除成员的用户 ID。                                                    |
|  - `groupid` | String | 操作的群组 ID。                                                          |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85/users/ttXXXX81,user2,user3?need_notify=false'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "9bXXXXf7",
  "uri": "https://XXXX/XXXX/XXXX",
  "entities": [],
  "data": [
    {
      "result": false,
      "action": "remove_member",
      "reason": "user ttXXXX81 doesn't exist.",
      "user": "user1",
      "groupid": "14XXXX79"
    },
    {
      "result": true,
      "action": "remove_member",
      "user": "user2",
      "groupid": "14XXXX79"
    },
    {
      "result": true,
      "action": "remove_member",
      "user": "user3",
      "groupid": "14XXXX79"
    }
  ],
  "timestamp": 1433492935318,
  "duration": 84,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | forbidden_op | users [XX] are not members of this group! | 用户不在群组中。 | 传入群组中成员的用户 ID。 |
| 403     | forbidden_op | forbidden operation on group owner! | 群主不能被移除。 | 无。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | invalid_parameter | kickMember: kickMembers number more than maxSize : 60 | 批量移除群成员数量超过 60 人。 | 控制批量移除群成员数量在 60 以内。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。
