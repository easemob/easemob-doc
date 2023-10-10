# 使用环信 User Token 鉴权

<Toc />

客户端 SDK 不提供获取 token 的 API。如果你的用户在客户端使用环信 token 登录和鉴权，你需要在应用服务器（App Server）集成环信服务端获取 token 的 API，实现获取 Token 的业务逻辑。

环信服务端支持以下三种方式获取用户 token：

- 通过“用户 ID”和“密码”获取：用户注册后，使用 “用户 ID” 和 “密码” 登录。登录成功后，你的 App Server 会为客户端提供一个用户 token。

- 通过“用户 ID”获取：用户在客户端上登录时，你的应用服务器会下发用户 token，SDK 使用用户 ID 和用户 token 进行登录。开发者可通过 RESTful API 在你的应用服务器上对用户 token 进行管理，设置有效期，并确定当用户不存在时是否自动创建用户。

- 基于 `AppKey、AppSecret` 和 `userId`（即注册用户时传入的 `username`）生成动态 Token。

## 前提条件

要调用环信即时通讯 RESTful API，请确保满足以下要求：

- 已在环信即时通讯控制台 [开通配置环信即时通讯 IM 服务](uc_configure.html)。
- 已从服务端获取 app token，详见 [App Token 鉴权](easemob_app_token.html)。

## 认证方式

环信即时通讯 RESTful API 要求 Bearer HTTP 认证。每次发送 HTTP 请求时，都必须在请求头部填入如下 `Authorization` 字段：

Authorization：`Bearer YourAppToken`

为提高项目的安全性，环信使用 token（动态密钥）对即将登录即时通讯系统的用户进行鉴权。即时通讯 RESTful API 推荐使用 app token 的鉴权方式，详见 [使用 App Token 鉴权](easemob_app_token.html)。

## 通过用户 ID 和密码获取用户 token

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/token
```

#### 路径参数

| 参数    | 类型   | 是否必需 | 描述         |
| :------------- | :----- | :------- | :--------------------- |
| `host`| String | 是    |  访问 RESTful API 的域名或服务器信息。<br/>-公有云集成为 环信即时通讯控制台的 `即时通讯->服务概览`页面下的 `域名配置- Rest Api`。 <br/> -私有化集成为部署后 `服务器地址:端口`。 |
| `org_name` | String | 是     | 每个公司（组织）分配的唯一标识。详见 环信即时通讯控制台的 `应用概览->应用详情`页面下的 `应用信息-Orgname`。  |
| `app_name` | String | 是    | 创建应用时填入的应用名称。详见 环信即时通讯控制台的 `应用概览->应用详情`页面下的 `应用信息-Appname`。|

#### 请求 header

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述 |
| :----------- | :----- | :------- | :------------------- |
| `grant_type` | String | 是       | 授权方式。<br/> - 若值为 `password`，通过用户 ID 和密码获取 token，需设置 `username` 和 `password` 参数。在该请求中，该参数需设置为 `password`。<br/> - 若值为 `inherit`，通过用户 ID 获取 token，只需设置 `username` 参数。        |
| `username`   | String | 是       | 用户 ID。                |
| `password`   | String | 是       | 用户的登录密码。   |
| `ttl`        | Long   | 否       | token 有效期，单位为秒。<br/> - 若传入该参数，token 有效期以传入的值为准。<br/> - 若不传该参数，以 详见环信即时通讯控制台的`用户认证`页面的 token 有效期的设置为准。<br/> - 若设置为 `0`，则 token 永久有效。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                               |
| :-------------- | :----- | :---------------- |
| `access_token`  | String | 有效的用户 token。                                     |
| `expires_in`    | Long   | token 有效期，单位为秒。在有效期内无需重复获取。 |
| `user`          | JSON   | 用户相关信息。                                             |
| `user.uuid`    | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成用户 token。   |
| `user.type`    | String | 对象类型，无需关注。       |
| `user.created`  | Long  | 注册用户的 Unix 时间戳，单位为毫秒。            |
| `user.modified`  | Long  | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。          |
| `user.username`  | String | 用户 ID。                                                       |
| `user.activated` | Bool  | 用户是否为活跃状态：<br/> - `true`：用户为活跃状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户账户，你需要调用[解禁用户的 API](/document/v1/server-side/account_system.html#账号解禁)对账号解除封禁。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考[响应状态码](/document/v1/server-side/error.html)了解可能的原因。

### 示例

#### 请求示例

```shell
curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -d '{
   "grant_type": "password",
   "username": "C",
   "password": "1",
   "ttl": "1024000"
 }' 'http://XXXX/XXXX/XXXX/token'
```

#### 响应示例

```json
{
    "access_token": "YWMtrR6ECkz8Eeyx6Y9j1eX9kbsMrFep3U6BvVj7KSnNonWqRx7gTPwR7Kzl-Q_xISNOAwMAAAF9UPZqbQAPoAAtYK9fWgaTNyuWoB3-6nGf_TXBx3Nt3XRZST-elU0x2A",
    "expires_in": 1024000,
    "user": {
        "uuid": "aa471ee0-XXXX-XXXX-ace5-f90ff121234e",
        "type": "user",
        "created": 1637740861395,
        "modified": 1637740861395,
        "username": "c",
        "activated": true
    }
}
```

## 通过用户 ID 获取用户 token

你通过用户 ID 获取用户 token。若用户 ID 不存在，你可以确定是否自动创建用户。

### HTTP 请求

```http
POST https://{host}/{org_name}/{app_name}/token
```

#### 路径参数

| 参数    | 类型   | 是否必需 | 描述         |
| :------------- | :----- | :------- | :---------------------------------- |
| `host`| String | 是    | 访问 RESTful API 的域名或服务器信息。<br/>-公有云集成为 环信即时通讯控制台的 `即时通讯->服务概览`页面下的 `域名配置- Rest Api`。 <br/> -私有化集成为部署后 `服务器地址:端口`。 |
| `org_name` | String | 是     | 每个公司（组织）分配的唯一标识。详见 环信即时通讯控制台的 `应用概览->应用详情`页面下的 `应用信息-Orgname`。  |
| `app_name` | String | 是    | 创建应用时填入的应用名称。详见 环信即时通讯控制台的 `应用概览->应用详情`页面下的 `应用信息-Appname`。|

#### 请求 header

| 参数           | 类型   | 是否必需 | 描述                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `Content-Type` | String | 是       | 内容类型。请填 `application/json`。 |
| `Accept`       | String | 是       | 内容类型。请填 `application/json`。 |
| `Authorization`| String | 是       | App 管理员的鉴权 token，格式为 `Bearer YourAppToken`，其中 `Bearer` 为固定字符，后面为英文空格和获取到的 app token。 |

#### 请求 body

| 参数         | 类型   | 是否必需 | 描述 |
| :----------- | :----- | :------- | :------------------- |
| `grant_type` | String | 是       | 授权方式。<br/> - 若值为 `password`，通过用户 ID 和密码获取 token，需设置 `username` 和 `password` 参数。 <br/> - 若值为 `inherit`，通过用户 ID 获取 token，只需设置 `username` 参数。在该请求中，该参数需设置为 `inherit`。  |
| `username`   | String | 是       | 用户 ID。                |
| `autoCreateUser`   | Boolean | 是       | 当用户不存在时，是否自动创建用户。**自动创建用户时，需保证授权方式（`grant_type`）必须为 `inherit`，API 请求 header 中使用 App token 进行鉴权**。  |
| `ttl`        | Long   | 否       | token 有效期，单位为秒。<br/> - 若传入该参数，token 有效期以传入的值为准。<br/> - 若不传该参数，有效期默认为 60 天。此外，也可通过 环信即时通讯控制台的`用户认证`页面的 token 有效期的设置为准。<br/> - 若设置为 `0`，则 token 永久有效。 |

### HTTP 响应

#### 响应 body

如果返回的 HTTP 状态码为 `200`，表示成功获取 token。如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考[响应状态码](/document/v1/server-side/error.html)了解可能的原因。

关于响应包体中的字段的描述，详见[通过用户 ID 和密码获取 token 的 API](#通过用户 ID 和密码获取用户 token) 中的响应字段的描述。

### 示例

#### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'Authorization: Bearer <YourAppToken>' -d '{
    "username": "test2333",
    "grant_type": "inherit",
    "autoCreateUser": true,
    "ttl": 1024000
 }' 'http://XXXX/XXXX/XXXX/token'
```

#### 响应示例

自动创建用户并获取 token 的响应如下：

```json
{
    "access_token": "YWMthyeiFhbyEe2eMGeYZSLlT7sMrFep3U6BvVj7KSnNonUiDB-wFvIR7a5Ttx2-01MYAwMAAAGCfIeryQAPoAAsuveDfkUrePkEM2Hgy6SaOTeTx3ETgh5cnXcP_HfBPg",
    "expires_in": 1024000,
    "user": {
        "uuid": "220c1fb0-XXXX-XXXX-ae53-b71dbed35318",
        "type": "user",
        "created": 1659946472753,
        "modified": 1659946472753,
        "username": "test2333",
        "activated": true
    }
}
```

## 生成动态的用户 Token

动态 Token 的生成方法依赖 `AppSecret`，因此生成逻辑务必在客户的服务器侧完成，以免 `AppSecret` 泄露。

动态 Token 临时有效，有效期由你自行设置，建议不要太长。

你可以按照如下步骤生成动态用户 token：

1. 在环信即时通讯控制台 创建应用，生成 `AppKey`、`Client ID` 和 `ClientSecret`。

2. 基于 `AppKey、AppSecret` 和 `userId`（即注册用户时传入的 `username`），参考如下示例生成 token。

```
a. 获取当前时间戳，单位为秒。
    CurTime = 1686207557
b. 设置过期时间，单位为秒。
    ttl = 600
c. 生成 signature，将 clientId、appkey、userId、curTime、ttl、clientSecret 六个字段拼成一个字符串，进行 sha1 编码并将编码内容得到的字节转换为十六进制字符串。
    str = clientId + appkey + userId + curTime + ttl + clientSecret
    shaBytes = sha1(str)
    signature = fmt.Sprintf("%x", shaBytes)
d. 组装为 json。
     json = {"signature": "xx", "appkey":"xx#xx", "userId":"xx", "curTime":1686207557, "ttl": 600}
e. 将 token 类型 "dt-" 放到 json 转成的字符串前，生成最终的字符串。
    str = "dt-" + jsonStr
f. 进行 base64 编码，生成最终的 token。
    token = base64.urlEncode.encode(str)
```

3. 使用上述方法生成 Token 后，客户端 SDK 将该 Token 填入并登录，服务器校验成功后即登录成功。

