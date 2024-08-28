# 子区管理

环信即时通讯 IM 提供多个接口实现子区管理，包括子区的创建、获取、修改和删除等。

单个 app 下的子区总数默认为 10 万，如需调整请联系商务。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 子区相关的限制，详见 [使用限制](limitation.html#子区)。

## 公共参数

### 请求参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :--------------- |
| `host`     | String | 是       | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。 |
| `org_name` | String | 是       | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是       | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `group_id` | String | 是       | 群组 ID。    |
| `username` | String | 是       | 用户 ID。             |

### 响应参数

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

## 管理子区

### 获取 app 中的子区

分页获取应用下的子区列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/thread?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述                 |
| :------- | :----- | :------- | :---------------------- |
| `limit`  | Int    | 否       | 每次期望返回的子区数量，取值范围为 [1,50]，默认值为 `50`。    |
| `cursor` | String | 否       | 数据查询的起始位置。                                                                                      |
| `sort`   | String | 否       | 获取的子区的排序顺序：<br/> - `asc`：按子区创建时间的正序；<br/> - （默认）`desc`：按子区创建时间的倒序。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :------------------------ |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                               |
| :------------------ | :----- | :--------------------------------- |
| `entities`       | JSON Array | 响应数据。                          |
|  - `id`       | String | 子区 ID。                          |
| `properties.cursor` | String | 查询游标，指定下次查询的起始位置。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/thread -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 7,
  "entities": [
    {
      "id": "1XXXX8"
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXTE"
  },
  "timestamp": 1650869750247,
  "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。   | 检查查询参数 `limit` 是否在取值范围（[1,50]）内。   |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 获取单个用户加入的所有子区（分页获取）

根据用户 ID 获取该用户加入的所有子区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/threads/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述      |
| :------- | :----- | :------- | :------------------ |
| `limit`  | Int    | 否       | 每次期望返回的子区数量，取值范围为 [1,50]，默认值为 `50`。                                                                           |
| `cursor` | String | 否       | 数据查询的起始位置。                                                                                                  |
| `sort`   | String | 否       | 获取的子区的排序顺序：<br/> - `asc`：按用户加入子区的时间的正序；<br/> - （默认）`desc`：按用户加入子区的时间的倒序。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :--------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述                                     |
| :------------------ | :----- | :--------------------------------------- |
| `entities`       | JSON Array | 响应数据。                          |
|  - `name`     | String | 子区名称。                               |
|  - `owner`    | String | 子区创建者的用户 ID。                    |
|  - `entities.id`       | String | 子区 ID。                                |
|  - `entities.msgId`    | String | 子区的父消息 ID。                        |
|  - `entities.groupId`  | String | 子区所属群组 ID。                        |
|  - `entities.created`  | Long   | 子区创建时间，Unix 时间戳。              |
| `properties.cursor` | String | 查询游标，指定服务器下次查询的起始位置。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/threads/user/test4 -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 4,
  "entities": [
    {
      "name": "1",
      "owner": "test4",
      "id": "17XXXX69",
      "msgId": "1920",
      "groupId": "17XXXX61",
      "created": 1650856033420
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXzg"
  },
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/threads/user/test4"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。   | 检查查询参数 `limit` 是否在取值范围（[1,50]）内。   |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 获取单个用户在指定群组中加入的所有子区 (分页获取)

根据用户 ID 获取该用户在指定群组中加入的所有子区。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/threads/chatgroups/{group_id}/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述           |
| :------- | :----- | :------- | :---------------- |
| `limit`  | Int    | 否       | 每次期望返回的子区数量，取值范围为 [1,50]，默认值为 `50`。该参数仅在分页获取时为必需。                                               |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。                                                                      |
| `sort`   | String | 否       | 获取的子区的排序顺序：<br/> - `asc`：按用户加入子区的时间的正序；<br/> - （默认）`desc`：按用户加入子区的时间的倒序。 |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :------------------------ |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段。

若为最后一页数据，响应中仍会返回 `cursor`，而且获取的子区数量小于请求中的 `limit` 的值；若响应中不再返回子区数据，表示你已经获取该群组下的所有子区数据。

| 字段                | 类型   | 描述                                    | 
| :------------------ | :----- | :-------------------------------------- |
| `entities`       | JSON Array | 响应数据。                          |
|  - `name`     | String | 子区名称。                              |
|  - `owner`    | String | 子区的创建者。                          |
|  - `id`       | String | 子区 ID。                               |
|  - `msgId`    | String | 子区的父消息 ID。                       |
|  - `groupId`  | String | 子区所属群组 ID。                       |
|  - `created`  | Long   | 子区创建时间，Unix 时间戳，单位为毫秒。 |
|  - `cursor` | String | 查询游标，指定下次查询的起始位置。      |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/threads/chatgroups/XXXX/user/XXXX -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 4,
  "entities": [
    {
      "name": "1",
      "owner": "test4",
      "id": "17XXXX69",
      "msgId": "1920",
      "groupId": "17XXXX61",
      "created": 1650856033420
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXNzg"
  },
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/threads/user/test4"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。 | 检查查询参数 `limit` 是否在取值范围（[1,50]）内。  |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 创建子区

创建子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/thread
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述          |
| :-------------- | :----- | :------- | :----------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数       | 类型   | 是否必需 | 描述                               |
| :--------- | :----- | :------- | :--------------------------------- |
| `group_id` | String | 是       | 子区所在的群组 ID。                |
| `name`     | String | 是       | 子区名称，不能超过 64 个字符。     |
| `msg_id`   | String | 是       | 子区的父消息 ID。                  |
| `owner`    | String | 是       | 子区的所有者，即创建子区的群成员。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述            |
| :--------------- | :----- | :-------------- |
| `data.thread_id` | String | 创建的子区 ID。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/thread -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type:application/json' -d '{
    "group_id": 179800091197441,
    "name": "1",
    "owner": "test4",
    "msg_id": 1234
}'
```

##### 响应示例

```json
{
    "action": "post",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "thread_id": "1XXXX7"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | thread must on group message to create. | 消息 ID 不是群消息。 | 输入正确的群消息 ID。 |
| 400     | group_error | thread name limit reached. | 子区名称过长。 | 请提供长度范围内的子区名称。子区名称长度不能超过 64 个字符。 |
| 400     | param_illegal | Failed to read HTTP message | body 参数不合法。 | 检查 body 参数是否合法。 |
| 400     | group_error | msg not belong to app. | 消息不属于 app。 | 输入合法的消息 ID。 |
| 400     | group_error | msg not belong to group . | 消息不属于群。 | 输入合法的消息 ID。 |
| 400     | group_error | thread not nested. | 不允许在子区的消息上创建子区。 | 输入合法的消息 ID。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread number has reached limit. | appKey 创建子区达到上限。 | 删除废弃的子区或者联系商务调整上限。单个 app 下的子区总数默认为 10 万。 |
| 403     | group_error | user join thread reach limit. | 用户加入的子区达到上限。 | 退出不用的子区或者联系商务调整上限。单个用户默认最多可以加入 100,000 个子区。 |
| 403     | group_error | msg already create thread.not allow to create. | 消息上已经创建子区。 | 传入其他消息 ID 或者查询该子区后加入。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 404     | group_error | user not in group. | 子区所有者不在群里面。 | 输入已加入群的用户 ID。 |
| 404     | group_error | msg not exist. | 消息不存在。 | 输入存在的消息 ID。 |
| 404     | group_error | group not found. | 群组不存在。   | 检查创建子区的群组是否存在。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 修改子区

修改指定子区。

#### HTTP 请求

```http
PUT https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

##### 路径参数

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :------------------ |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数   | 类型   | 是否必需 | 描述           |
| :----- | :----- | :------- | :----------------- |
| `name` | String | 是       | 要修改的子区的名称。修改后的子区名称不能超过 64 个字符。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型   | 描述           |
| :---------- | :----- | :------------- |
| `data.name` | String | 修改后的名称。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X PUT https://XXXX/XXXX/XXXX/thread/1XXXX7 -H 'Authorization: Bearer <YourAppToken>' -d '{"name": "test4"}'
```

##### 响应示例

```json
{
    "action": "put",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "name": "test4"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | thread name limit reached. | 子区名称过长。 | 请提供长度范围内的子区名称。子区名称长度不能超过 64 个字符。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 404     | group_error | thread not found. | 子区不存在。 | 输入正确的子区 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 删除子区

删除指定子区。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

##### 路径参数

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述    |
| :-------------- | :----- | :------- | :----------------------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中包含以下字段：

| 字段          | 类型   | 描述                          |
| :------------ | :----- | :---------------------------- |
| `data.status` | String | 删除结果，`ok` 表示成功删除。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE https://XXXX/XXXX/XXXX/thread/1XXXX7 -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "delete",
  "applicationName": "testapp",
  "duration": 4,
  "data": {
    "status": "ok"
  },
  "organization": "XXXX",
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 404     | group_error | thread not found. | 子区不存在。 | 输入正确的子区 ID。|

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

## 管理子区成员

环信即时通讯 IM 提供多个接口实现子区成员管理，包括对加入和踢出子区等管理功能。

### 获取子区成员列表(分页)

获取指定子区的成员列表。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/thread/{thread_id}/users?limit={N}&cursor={cursor}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数     | 类型   | 是否必需 | 描述           |
| :------- | :----- | :------- | :-------------------------- |
| `limit`  | Int    | 否       | 每次期望返回的子区成员数量，取值范围为 [1,50]，默认值为  `50`。该参数仅在分页获取时为必需。 |
| `cursor` | String | 否       | 数据查询的起始位置。该参数仅在分页获取时为必需。                            |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述               |
| :-------------- | :----- | :------- | :---------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中包含以下字段：

| 字段                | 类型   | 描述                               |
| :------------------ | :----- | :--------------------------------- |
| `affiliations`      | Array  | 子区成员的用户 ID 列表。           |
| `properties.cursor` | String | 查询游标，指定下次查询的起始位置。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET https://XXXX/XXXX/XXXX/thread/1XXXX7/users -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "get",
  "data": {
    "affiliations": ["test4"]
  },
  "duration": 4,
  "properties": {
    "cursor": "ZGNXXXXyMA"
  },
  "timestamp": 1650872048366,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | 分页参数 `limit` 的值过大。 | 检查查询参数 `limit` 是否在取值范围内。  |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. |  子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 404     | group_error | thread not found. | 子区不存在。 | 输入正确的子区 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 用户批量加入子区

用户批量加入指定的子区。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

##### 路径参数

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述       |
| :-------------- | :----- | :------- | :------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数        | 类型 | 是否必需 | 备注                                                         |
| :---------- | :--- | :------- | :---------- |
| `usernames` | List | 是       | 批量加入子区的用户 ID 列表。每次最多支持 10 个用户加入子区。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中包含以下字段：

| 字段          | 类型   | 描述                          |
| :------------ | :----- | :---------------------------- |
| `data.status` | String | 添加结果，`ok` 表示成功添加。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST https://XXXX/XXXX/XXXX/thread/1XXXX7/users -d '{
"usernames": [
"test2",
"test3"
]
}' -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "post",
  "applicationName": "testapp",
  "data": {
    "status": "ok"
  },
  "duration": 1069,
  "organization": "XXXX",
  "timestamp": 1650872649160,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/joined_thread"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | request body reaches limit. | 请求 body 中的 `usernames` 参数的值已超过上限。 | 请检查请求 body 中的 `usernames` 参数的值是否超过了 10。每次最多支持 10 个用户加入子区。  |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |
| 403     | group_error | user join thread reach limit. | 用户加入的子区达到上限。 | 退出不用的子区或者联系商务调整上限。 |
| 404     | group_error | thread not found. | 子区不存在 | 输入正确的子区 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 批量踢出子区成员

批量踢出子区成员。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

##### 路径参数

| 参数        | 类型   | 是否必需 | 描述      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | 是       | 子区 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述    |
| :-------------- | :----- | :------- | :----------------------- |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数        | 类型 | 是否必需 | 备注                                                       |
| :---------- | :--- | :------- | :--------------------------------------------------------- |
| `usernames` | List | 是       | 批量踢出子区的用户 ID 列表。每次最多可踢出 10 个子区成员。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功。响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                    |
| :------- | :----- | :------------------------------------------------------ |
| `entities`       | JSON Array | 响应数据。                          |
|  - `result` | Bool   | 操作结果。<br/> - `true`：成功；<br/> - `false`：失败。 |
|  - `user`   | String | 被踢出子区的用户 ID。                                   |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE https://XXXX/XXXX/XXXX/thread/1XXXX7/users -H 'Authorization: Bearer <YourAppToken>'
```

##### 响应示例

```json
{
  "action": "delete",
  "applicationName": "testy",
  "duration": 12412,
  "entities": [
    {
      "result": false,
      "user": "test2"
    },
    {
      "result": false,
      "user": "test6"
    }
  ],
  "organization": "XXXX",
  "timestamp": 1650874050419,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | request body reaches limit. | 请求 body 中的 `usernames` 参数的值已超过上限。 | 请检查请求 body 中的 `usernames` 参数的值是否超过了 10。每次最多可踢出 10 个子区成员。   |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | group_error | thread not found. | 子区不存在 | 输入正确的子区 ID。 |
| 403     | group_error | thread not open. | 子区功能未开通。 | 请在环信即时通讯控制台开通子区服务。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。