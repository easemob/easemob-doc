# 在线状态（Presence）订阅

<Toc />

在线状态（Presence）表示用户的当前状态信息。除了环信 IM 内置的在线和离线状态，你还可以添加自定义在线状态，例如忙碌、马上回来、离开、接听电话、外出就餐等。本文展示如何调用环信即时通讯 RESTful API 实现用户在线状态（Presence）订阅，包括设置用户在线状态信息、批量订阅和获取在线状态、取消订阅以及查询订阅列表。

:::notice
使用该特性前，你需要联系商务开通。
:::

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯云控制台 [开通配置环信即时通讯 IM 服务](enable_and_configure_IM.html)。
- 已从服务端获取 app token，详见 [使用 App Token 鉴权](easemob_app_token.html)。
- 了解环信 IM API 的调用频率限制，详见 [接口频率限制](limitationapi.html)。

## 公共参数

以下表格列举了即时通讯 RESTful API 的公共请求参数和响应参数：

### 请求参数

| 参数    | 类型   | 是否必需 | 描述         |
| :------------ | :----- | :------ | :---------------- |
| `host`| String | 是    | 环信即时通讯 IM 分配的用于访问 RESTful API 的域名。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `org_name` | String | 是     | 环信即时通讯 IM 为每个公司（组织）分配的唯一标识。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。  |
| `app_name` | String | 是    | 你在环信即时通讯云控制台创建应用时填入的应用名称。详见 [获取环信即时通讯 IM 的信息](enable_and_configure_IM.html#获取环信即时通讯-im-的信息)。|
| `username`      | String | 是 |用户在即时通讯服务器上的唯一 ID。                            | 

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

`Authorization: Bearer YourAppToken`

为提高项目的安全性，环信使用 Token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 建议使用 App Token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 设置用户在线状态信息

根据用户的唯一 ID 设置在线状态信息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{resource}/{status}
```

#### 路径参数

| 参数       | 类型  | 是否必需 | 描述           | 
| :--------- | :----- | :---------------------- | :------- |
| `resource` | String | 是     | 服务器分配给每个设备资源的唯一标识符，格式为 `{device type}_{resource ID}`，其中设备类型 `device type` 可以是 `android`、`ios` 或 `web`，资源 ID `resource ID` 由 SDK 分配。例如，`android_123423453246`。 |
| `status`   | String | 是     | 用户定义的在线状态：<br> - `0`：离线；<br> - `1`：在线；<br> - 其他值：自定义在线状态。 | 

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                       | 
| :-------------- | :----- | :------------ | :------- |
| `Content-Type`  | String | 是    | 内容类型：`application/json`。                               | 
| `Authorization` | String | 是    | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 | 

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
| `result` | String | 在线状态是否成功设置。`ok` 表示在线状态设置成功；否则，你可以根据返回的原因进行故障排除。 |

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

一次可订阅多个用户的在线状态。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{expiry}
```

#### 路径参数

| 参数     | 类型  | 是否必需 | 描述                                |
| :------- | :----- | :---------------- | :------- |
| `expiry` | String | 是  | 订阅时长，单位为秒，最大值为 `2,592,000`，即 30 天。  |

其他参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型  | 是否必需 | 描述                  | 
| :-------------- | :----- | :------------------------- | :------- |
| `Content-Type`  | String | 是   | 内容类型：`application/json`。                  |
| `Authorization` | String | 是   | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。      |

#### 请求 body

请求包体为 JSON Object 类型，包含以下字段：

| 字段        | 类型    | 是否必需   | 描述                                                         |
| :---------- | :--------- | :--------------------- | :------- |
| `usernames` | Array | 是  | 被订阅用户的用户 ID 数组，例如 ["user1", "user2"]。该数组最多可包含 100 个用户 ID。      |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 是否成功批量订阅了多个用户的在线状态。若成功，则返回被订阅用户的在线状态信息，失败则返回相应的错误原因。 |
| `result.uid`       | String     | 被订阅用户在即时通讯服务器的唯一 ID。                              |
| `result.last_time` | Long    | 被订阅用户的最近在线时间，Unix 时间戳，单位为秒。服务端会在被订阅的用户登录和登出时记录该时间。 |
| `result.expiry`    | Long    | 订阅过期的 Unix 时间戳，单位为秒。                                           |
| `result.ext`       | String     | 被订阅用户的在线状态扩展信息。                   |
| `result.status`    | JSON | 被订阅用户在多端的状态：<br> - `0`：离线；<br> - `1`：在线；<br/> - 其他值：用户可设置其他值自定义在线状态。 |

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
{
"result":[
  {"uid":"",
  "last_time":"1644466063",
  "expiry":"1645500371",
  "ext":"123",
  "status":{"android":"1","android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    },
    {"uid":"c3",
    "last_time":"1645183991",
    "expiry":"1645500371",
    "ext":"",
    "status":{
        "android":"0",
        "android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    }]
}
```

## 批量获取在线状态信息

你一次可获取多个用户的在线状态信息。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 请求 header

| 参数            | 类型  | 是否必需 | 描述               |
| :-------------- | :----- | :----------------- | :------- |
| `Content-Type`  | String | 是  | 内容类型。请填 `application/json`。         |
| `Authorization` | String | 是  | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 | 

#### 请求 body

请求包体为 JSON Object 类型，仅支持以下字段：

| 参数        | 类型  | 是否必需 | 描述                                                       |
| :---------- | :---- | :------- | :----------------------------------------------------------- |
| `usernames` | JSON Array | 是    | 需要获取其在线状态的用户列表，例如 `["user1", "user2"]`，最多可传 100 个用户 ID。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数        | 类型       | 描述                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | 是否成功批量获取用户的在线状态信息。若成功获取，返回被订阅用户的在线状态信息，失败则返回相应的错误原因。 |
| `result.uid`       | String     | 用户在即时通讯服务器的唯一 ID。                              |
| `result.last_time` | Long       | 用户的最近在线时间，Unix 时间戳，单位为秒。                                           |
| `result.ext`       | String     | 用户的在线状态扩展信息。                 |
| `result.status`    | JSON | 用户在多个设备上的在线状态：<br/> - `0`： 离线。<br/> - `1`： 在线。<br/> - 其他值：用户自定义的在线状态。                                            |

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
    }
  ]
 }
```

## 查询单个群组的在线成员数量

你可以查询单个群组的在线成员数量。如需使用该 API，需要联系环信商务开通。

这里的在线状态指用户的 app 与服务器成功建立连接，不包括用户的自定义在线状态，如忙碌、马上回来等。

### HTTP 请求

```http
GET https://{host}/{org_name}/{app_name}/presence/online/{group_id}/type/{query_type}
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数   | 类型   | 是否必需 | 描述                                    |
| :----- | :----- | :------- | :-------------------------------------- |
| `group_id`   | String | 是       | 群组 ID。                                |
| `query_type` | Int    | 是       | 查询类型，查询群组的在线成员数量，传 `1` 即可。 |

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :--------------- |
| `Accept`        | String | 是       | 内容类型。请填 `application/json`。                          |
| `Authorization` | String | 是       | 该管理员的鉴权 token，格式为 `Bearer ${YourAppToken}`，其中 `Bearer` 是固定字符，后面加英文空格，再加获取到的 token 值。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 字段     | 类型 | 描述               |
| :------- | :--- | :----------------- |
| `result` | Int  | 群组内的在线成员数量。 |

如果返回的 HTTP 状态码非 `200`，表示请求失败。你可以参考[响应状态码](error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' 'http://XXX/XXX/XXX/presence/online/XXX/type/XXX'
```

#### 响应示例

```json
{
    "result": 100
}
```


##  取消订阅多个用户的在线状态

取消订阅多个用户的在线状态。

### HTTP 请求

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/presence
```

### 路径参数

参数及描述详见 [公共参数](#公共参数)。

### 请求 header

| 参数            | 类型   | 是否必需 | 描述         | 
| :-------------- | :----- | :-------------------------- | :------- |
| `Content-Type`  | String | 是    | 内容类型。请填 `application/json`。                                   |
| `Authorization` | String | 是    | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |
### 请求 body

| 参数    | 类型  | 是否必需 | 描述                                                         | 
| :------ | :---- | :--------------------------- | :------- |
| `users` | JSON Array |  是  | 要取消订阅在线状态的用户 ID 数组，例如 ["user1", "user2"]，最多可传 100 个用户 ID。      |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数     | 类型   | 描述                                           |
| :------- | :----- | :--------------------------------------------- |
| `result` | String | 是否成功取消订阅用户的在线状态。若成功，返回 "ok"，失败则返回相应的错误原因。 |

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
GET https://{host}/{org_name}/{app_name}/users/{username}/presence/sublist?pageNum=1&pageSize=100
```

#### 路径参数

参数及描述详见 [公共参数](#公共参数)。

#### 查询参数

| 参数       | 类型 |  是否必需 | 描述                       |
| :--------- | :--- | :--------------- | :------- |
| `pageNum`  | Int  | 是       | 要查询的页码。该参数的值须大于等于 1。若不传，默认值为 `1`。          |
| `pageSize` | Int  | 是       | 每页显示的订阅用户数量。取值范围为 [1,500]，若不传默认值为 `1`。| 

#### 请求 header

| 参数            | 类型   | 是否必需 | 描述                                                         |
| :-------------- | :----- | :------- | :----------------------------------------------------------- |
| `Content-Type`  | String | 是     | 内容类型：`application/json`。                               |
| `Authorization` | String | 是     | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示请求成功，响应包体中包含以下字段：

| 参数       | 类型   | 描述                                                         |
| :--------- | :----- | :----------------------------------------------------------- |
| `result`   | JSON | 是否成功获取了订阅列表。若操作成功，返回被订阅用户的在线状态信息。若操作失败，返回相应的错误原因。 |
| `result.totalnum` | Int | 当前订阅的用户总数。                                         |
| `result.sublist`  | JSON Array | 订阅列表。列表中的每个对象均包含被订阅的用户的 ID 字段 `uid` 以及订阅过期字段 `expiry`。    |
| `result.sublist.uid`      | String | 被订阅用户在即时通讯服务器的唯一 ID。                              |
| `result.sublist.expiry`   | Int | 订阅的过期时间戳，单位为秒。                                           |

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