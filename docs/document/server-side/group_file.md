# 管理群组公告和共享文件

环信即时通讯 IM 提供了 RESTful API 管理群组公告和共享文件，包括修改和获取群组公告、上传、下载、获取和删除群组共享文件。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯 IM 管理后台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 了解环信 IM RESTful API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。
- 了解群组公告和群共享文件的大小限制，详见 [使用限制](limitation.html#群组)。

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

## 获取群组公告

获取指定群组 ID 的群组公告。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/announcement
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述             |
| :-------------- | :----- | :------- | :--------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段                | 类型   | 描述         |
| :------------------ | :----- | :----------- |
| `data.announcement` | String | 群公告内容。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement",
  "entities": [],
  "data": {
    "announcement": "群组公告..."
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
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 修改群组公告

修改指定群组 ID 的群组公告。群组公告不能超过 512 个字符。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/announcement
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述             |
| :-------------- | :----- | :------- | :---------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

##### 请求 body

| 参数            | 类型   | 是否必需 | 描述             |
| :-------------- | :----- | :------- | :---------------- |
| `announcement`  | String | 是       | 群组通告内容。   |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段          | 类型   | 描述                                                           |
| :------------ | :----- | :------------------------------------------------------------- |
| `data.id`     | String | 群组 ID。                                                      |
| `data.result` | Bool   | 修改结果：<br/> - `true`：修改成功；<br/>- `false`：修改失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{"announcement" : "群组公告…"}' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement'
```

##### 响应示例

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/announcement",
  "entities": [],
  "data": {
    "id": "6XXXX7",
    "result": true
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
| 400     | illegal_argument | announcement is null | 没有传递公告内容。 | 需传递公告内容。 |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | resource_not_found | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 403     | FORBIDDEN | announce info length exceeds limit! | 设置公告长度超限制。 | 设置较短的公告 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 获取群组共享文件

可以分页获取指定群组 ID 的群组共享文件。获取文件后，你可以根据响应中返回的文件 ID（`file_id`）调用 [下载群组共享文件](#下载群组共享文件) 接口下载文件，或调用 [删除群组共享文件](#删除群组共享文件) 接口删除文件。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files?pagenum={N}&pagesize={N}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 查询参数

| 参数       | 类型   | 是否必需 | 描述        |
| :--------- | :----- | :------- | :---------------- |
| `pagesize` | String | 否       | 每页期望返回的共享文件数。取值范围为 [1,1000]，默认为 `1000`。若传入的值超过 `1000`，返回 1000 个共享文件。  |
| `pagenum`  | Int    | 否       | 当前页码。默认从第 1 页开始获取。                              |

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述                  |
| :-------------- | :----- | :------- | :---------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段              | 类型   | 描述                                                    |
| :---------------- | :----- | :------------------------------------------------------ |
| `data` | JSON Array | 响应数据。 |
|  - `file_id`    | String | 群组共享文件的 ID，若要下载或删除该文件需要使用该参数。 |
|  - `file_name`  | String | 群组共享文件名称。                                      |
|  - `file_owner` | String | 上传群组共享文件的用户 ID。                             |
|  - `file_size`  | Long   | 群组共享文件大小，单位为字节。                          |
|  - `created`    | Long   | 上传群组共享文件的时间。                                |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files?pagenum=1&pagesize=10'
```

##### 响应示例

```json
{
  "action": "get",
  "application": "8bXXXX02",
  "params": {
    "pagesize": ["10"],
    "pagenum": ["1"]
  },
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities": [],
  "data": [
    {
      "file_id": "dbd88d20-e1d4-11ea-95fc-638fc2d59a8d",
      "file_name": "159781149272586.jpg",
      "file_owner": "u1",
      "file_size": 326127,
      "created": 1597811492594
    },
    {
      "file_id": "b30XXXX4f",
      "file_name": "159781141836993.jpg",
      "file_owner": "u1",
      "file_size": 326127,
      "created": 1597811424158
    }
  ],
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
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 上传群组共享文件

上传指定群组 ID 的群组共享文件。注意上传的文件大小不能超过 10 MB。

分页获取指定群组 ID 的群组共享文件，然后可以根据响应中返回的文件 ID（`file_id`）调用 [下载群组共享文件](#下载群组共享文件) 接口下载该文件，或调用 [删除群组共享文件](#删除群组共享文件) 接口删除该文件。

#### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数              | 类型   | 是否必需 | 描述            |
| :---------------- | :----- | :------- | :----------------------------- |
| `Accept`          | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization`   | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |
| `Content-Type`    | String | 是       | 内容类型。请填 `multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW`。      |
| `file`            | String | 是       | 待上传文件的本地路径。      |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段             | 类型   | 描述                                                       |
| :--------------- | :----- | :--------------------------------------------------------- |
| `data.file_url`  | String | 群组共享文件的 URL，在环信即时通讯 IM 服务器上保存的地址。 |
| `data.group_id`  | String | 群组 ID。                                                  |
| `data.file_name` | String | 群组共享文件名称。                                         |
| `data.created`   | Long   | 上传群组共享文件的时间。                                   |
| `data.file_id`   | String | 群组共享文件 ID，可以用于下载和删除共享文件。              |
| `data.file_size` | Long   | 群组共享文件大小，单位为字节。                             |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups/66021836783617/share_files' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -H 'Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' -F file=@/Users/test/image/IMG_3.JPG
```

##### 响应示例

```json
{
  "action": "post",
  "application": "7fXXXXef",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files",
  "entities": [],
  "data": {
    "file_url": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/c6XXXXc0",
    "group_id": "6XXXX7",
    "file_name": "img_3.jpg",
    "created": 1599050554954,
    "file_id": "c6XXXXc0",
    "file_size": 13512
  },
  "timestamp": 1599050554978,
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
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |
| 400     | IllegalArgumentException | file must be provided. | 群共享文件未提供 | 上传群共享文件 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 下载群组共享文件

根据指定的群组 ID 与文件 ID（`file_id`）下载群组共享文件，文件 ID 可从 [获取群组共享文件](#获取群组共享文件) 接口的响应中获取。

#### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

##### 路径参数

参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述      |
| :-------------- | :----- | :------- | :------------------ |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                                                                                  |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应体中为上传的文件的内容，例如，上传的文件内容为“Hello world”，响应中返回“Hello world”。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X GET -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'
```

##### 响应示例

返回上传的文件的内容。例如，上传的文件内容为“Hello world”，响应中返回“Hello world”。

#### 错误码

如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码        | 错误类型 | 错误提示          | 可能原因 | 处理建议 |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | token 不合法，可能过期或 token 错误。 | 使用新的 token 访问。 |
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

### 删除群组共享文件

根据指定的群组 ID 与 文件 ID（`file_id`）删除群组共享文件，文件 ID 可从 [获取群组共享文件](#获取群组共享文件) 接口的响应中获取。

#### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

##### 路径参数

| 参数      | 类型   | 是否必需 | 描述      |
| :-------- | :----- | :------- | :-------- |
| `file_id` | String | 是       | 文件 ID。 |

其他参数及描述详见 [公共参数](#公共参数)。

##### 请求 header

| 参数            | 类型   | 是否必需 | 描述         |
| :-------------- | :----- | :------- | :--------------------------------- |
| `Content-Type`  | String | 是       | 内容类型。请填 `application/json`。      |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。         |
| `Authorization` | String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### HTTP 响应

##### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                                                          |
| :-------------- | :----- | :---------------------------------------------------------------------------- |
| `data.group_id` | String | 群组 ID。                                                                     |
| `data.file_id`  | String | 群组共享文件 ID。在下载共享文件时需提供该参数。                               |
| `data.result`   | Bool   | 删除群组共享文件的结果：<br/> - `true`：删除成功；<br/> - `false`：删除失败。 |

其他字段及描述详见 [公共参数](#公共参数)。

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](#错误码) 了解可能的原因。

#### 示例

##### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X DELETE -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'
```

##### 响应示例

```json
{
  "action": "delete",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f",
  "entities": [],
  "data": {
    "group_id": "6XXXX7",
    "file_id": "b30XXXX4f",
    "result": true
  },
  "timestamp": 1599049350114,
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
| 404     | RestGroupFeignException | grpID XX does not exist! | 群组不存在。 | 使用合法的群 ID。 |

关于其他错误，你可以参考 [响应状态码](error.html) 了解可能的原因。

