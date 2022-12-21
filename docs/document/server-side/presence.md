# 在线状态订阅 RESTful API

<Toc />

本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。调用以下方法前，请先参考 [使用限制](limitationapi.html) 了解即时通讯 RESTful API 的调用频率限制。

使用该特性前，你需要联系商务开通。

## 公共参数

以下表格列举了即时通讯 RESTful API 的公共请求参数和响应参数：

### 请求参数

| 参数    | 类型   | 是否必需 | 描述         |
| :------------ | :----- | :------ | :---------------- |
| `host`| String | 是    | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `org_name` | String | 是     | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是    | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `uid`      | String | 是 |用户在即时通讯服务器上的唯一 ID。                            | 

### 响应参数

| 参数        | 描述                                     |
| :---------- | :--------------------------------------- |
| `data`      | 实际取到的数据详情。                     |
| `username`  | 用户 ID。                                |
| `groupname` | 群组名。                                 |
| `timestamp` | 请求响应的时间，Unix 时间戳，单位为毫秒（ms）。 |

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 Authorization 字段：

```
Authorization: Bearer ${YourAppToken}
```

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 建议使用 App Token 的鉴权方式，详见 [使用 Token 鉴权](easemob_app_token.html)。

## 设置用户在线状态信息

根据用户的唯一 ID 设置在线状态信息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{uid}/presence/{resource}/{status}
```

#### 路径参数

| 参数       | 类型  | 是否必需 | 描述           | 
| :--------- | :----- | :---------------------- | :------- |
| `resource` | String | 是     | 设备来源，格式为“设备类型_resource ID”，例如，android_123423453246。   |
| `status`   | String | 是     | 端状态码。该参数的取值如下：<br> - `0`：离线；<br> - `1`：在线；<br> - 其他值：自定义在线状态。 | 

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                       | 
| :-------------- | :----- | :------------ | :------- |
| `Content-Type`  | String | 是    | 内容类型：`application/json`。                               | 
| `Authorization` | String | 是    | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 app token 的值。 | 

#### 请求体 body

请求包体为 JSON Object 类型，包含以下字段：

| 参数  | 类型 | 是否必需  | 描述             | 
| :---- | :----- | :---------------------- | :------- |
| `ext` | String | 是 | 在线状态扩展信息。建议不超过 64 字节。 | 

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型   | 描述                                                 |
| :------- | :----- | :--------------------------------------------------- |
| `result` | String | 操作结果。设置成功返回’ok’，否则返回相应的错误原因。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X POST 'a1-test.easemob.com:8089/5101220107132865/test/users/c1/presence/android/0' \
-H 'Authorization: Bearer YWMtnjEbUopPEeybKGMmN0wpeZsaLSh8UEgpirS4wNAM_qx8oS2wik8R7LE4Rclv5hu9AwMAAAF-4tr__wBPGgDWGAeO86wl2lHGeTnU030fpWuEDR015Vk6ULWGYGKccA' \
-H 'Content-Type: application/json' \
-d '{"ext":"123"}'
```

#### 响应示例

```json
{"result":"ok"}
```

## 批量订阅在线状态

你一次可订阅多个用户的在线状态。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{uid}/presence/{expiry}
```

#### 路径参数

| 参数     | 类型  | 是否必需 | 描述                                |
| :------- | :----- | :---------------- | :------- |
| `expiry` | String | 是  | 订阅时长，单位为秒，最长为 30 天。  |

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型  | 是否必需 | 描述                  | 
| :-------------- | :----- | :------------------------- | :------- |
| `Content-Type`  | String | 是   | 内容类型：`application/json`。                  |
| `Authorization` | String | 是   | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。      |

#### 请求 body

请求包体为 JSON Object 类型，包含以下字段：

| 字段        | 类型    | 是否必需   | 描述                                                         |
| :---------- | :--------- | :--------------------- | :------- |
| `usernames` | JSON ARRAY | 是  | 订阅对象的用户名数组，例如 [“user1”, “user2”]。该数组最多可包含 100 个用户名。      |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 订阅对象的在线状态信息，以数组形式返回。若订阅失败，返回相应的错误原因。 |
| `uid`       | String     | 用户在即时通讯服务器的唯一 ID。                              |
| `last_time` | Number     | 用户最近在线时间。服务端会在被订阅的用户登录和登出时记录该时间。 |
| `expiry`    | Number     | 订阅的过期时间戳。                                           |
| `ext`       | String     | 用户在线状态扩展信息，建议不超过 64 字节。                   |
| `status`    | JSON Array | 用户多端的状态。该参数的取值如下：<br> - `0`：离线；<br> - `1`：在线；<br> - 其他值：用户可设置其他值自定义在线状态。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X POST 'a1-test.easemob.com:8089/5101220107132865/test/users/wzy/presence/1000' \
-H 'Authorization: Bearer YWMtnjEbUopPEeybKGMmN0wpeZsaLSh8UEgpirS4wNAM_qx8oS2wik8R7LE4Rclv5hu9AwMAAAF-4tr__wBPGgDWGAeO86wl2lHGeTnU030fpWuEDR015Vk6ULWGYGKccA' \
-H 'Content-Type: application/json' \
-d '{"usernames":["c2","c3"]}'
```

#### 响应示例

```json
{"result":[{"uid":"","last_time":"1644466063","expiry":"1645500371","ext":"123","status":{"android":"1","android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}},{"uid":"c3","last_time":"1645183991","expiry":"1645500371","ext":"","status":{"android":"0","android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}}]}
```

## 批量获取在线状态信息

你一次可获取多个用户的在线状态信息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{uid}/presence
```

#### 路径参数

参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型  | 是否必需 | 描述               |
| :-------------- | :----- | :----------------- | :------- |
| `Content-Type`  | String | 是  | 内容类型：`application/json`。         |
| `Authorization` | String | 是  | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 | 

#### 请求 body

请求包体为 JSON Object 类型，仅支持以下字段：

| 参数        | 类型  | 是否必需 | 描述                                                       |
| :---------- | :---- | :------- | :----------------------------------------------------------- |
| `usernames` | Array | 是    | 订阅对象的用户名数组，例如 [“user1”, “user2”]。该数组最多可包含 100 个用户名。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 订阅对象的在线状态信息，以数组形式返回。若订阅失败，返回相应的错误原因。 |
| `uid`       | String     | 用户在即时通讯服务器的唯一 ID。                              |
| `last_time` | Long       | 用户最近在线时间。                                           |
| `ext`       | String     | 用户在线状态的扩展信息，建议不超过 64 字节。                 |
| `status`    | JSON Array | 用户多端的状态。                                             |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X POST 'a1-test.easemob.com:8089/5101220107132865/test/users/wzy/presence' \
-H 'Authorization: Bearer YWMtnjEbUopPEeybKGMmN0wpeZsaLSh8UEgpirS4wNAM_qx8oS2wik8R7LE4Rclv5hu9AwMAAAF-4tr__wBPGgDWGAeO86wl2lHGeTnU030fpWuEDR015Vk6ULWGYGKccA' \
-H 'Content-Type: application/json' \
-d '{"usernames":["c2","c3"]}'
```

#### 响应示例

```json
{
"result":[
  {"uid":"c2",
  "last_time":"1644466063",
  "ext":"",
  "status":{"android":"0"}
     },
   {"uid":"c3",
   "last_time":"1644475330",
   "ext":"",
   "status":{
       "android":"0",
       "android":"0"}
    }]
 }
```

## 取消订阅

你可以取消订阅用户的在线状态。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{uid}/presence
```

### 路径参数

参数及说明详见 [公共参数](#公共参数)。

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         | 
| :-------------- | :----- | :-------------------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型：`application/json`。                                   |
| `Authorization` | String | 是    | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |
### 请求 body

| 参数    | 类型  | 是否必需 | 描述                                                         | 
| :------ | :---- | :--------------------------- | :------- |
| `users` | Array | 是   | 订阅对象的用户名数组，例如 [“user1”, “user2”]。该数组最多可包含 100 个用户名。      |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数     | 类型   | 描述                                           |
| :------- | :----- | :--------------------------------------------- |
| `result` | String | 取消成功返回“ok”；取消失败返回相应的错误原因。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X DELETE 'a1-test.easemob.com:8089/5101220107132865/test/users/wzy/presence' \
-H 'Authorization: Bearer YWMtnjEbUopPEeybKGMmN0wpeZsaLSh8UEgpirS4wNAM_qx8oS2wik8R7LE4Rclv5hu9AwMAAAF-4tr__wBPGgDWGAeO86wl2lHGeTnU030fpWuEDR015Vk6ULWGYGKccA' \
-H 'Content-Type: application/json' \
-d '["c1"]'
```

#### 响应示例

```json
{"result":"ok"}
```

## 查询订阅列表

查询当前用户已订阅在线状态的用户列表。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/users/{uid}/presence/sublist?pageNum=1&pageSize=100
```

#### 路径参数

| 参数       | 类型 |  是否必需 | 描述                       |
| :--------- | :--- | :--------------- | :------- |
| `pageNum`  | Int  | 是       | 要查询的页码。该参数的值须大于等于 1。          |
| `pageSize` | Int  | 是       | 每页显示的订阅用户数量。 该参数的值不得超 500。 | 

其他参数及说明详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是     | 内容类型：`application/json`。                               |
| `Authorization` | String | 是     | `Bearer ${token}` Bearer 是固定字符，后面加英文空格，再加上获取到的 App Token 的值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 说明                                                         |
| :--------- | :----- | :----------------------------------------------------------- |
| `result`   | Object | 订阅对象在线状态信息，以数组形式返回。若查询失败，返回相应的错误原因。 |
| `totalnum` | String | 当前订阅的用户总数。                                         |
| `sublist`  | Object | 订阅对象的信息，以数组形式返回。                             |
| `uid`      | String | 用户在即时通讯服务器的唯一 ID。                              |
| `expiry`   | String | 订阅的过期时间戳。                                           |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考 [错误码](error.html) 了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X GET 'a1-test.easemob.com:8089/5101220107132865/test/users/wzy/presence/sublist?pageNum=1&pageSize=100' \
-H 'Authorization: Bearer YWMtnjEbUopPEeybKGMmN0wpeZsaLSh8UEgpirS4wNAM_qx8oS2wik8R7LE4Rclv5hu9AwMAAAF-4tr__wBPGgDWGAeO86wl2lHGeTnU030fpWuEDR015Vk6ULWGYGKccA' \
-H 'Content-Type: application/json'
```

#### 响应示例

```json
{
  "result":{
    "totalnum":"2",
    "sublist":[
      {
        "uid":"lxml2",
	"expiry":"1645822322"},
      {
        "uid":"lxml1",
	"expiry":"1645822322"}
    ]
  }
 }
```