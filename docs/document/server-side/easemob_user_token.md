# 使用环信 User Token 鉴权

<Toc />

## 概述

应用使用环信 SDK 提供的功能时，首先需完成用户登录。登录时，必须传入注册的环信即时通讯服务的用户 ID（下称 “userId”）和身份验证令牌（Token）。Token 是用户在即时通讯 IM 服务中的唯一身份标识，登录后使用即时通讯提供的 API 时，SDK 内部均需使用该 Token 与服务器交互。

在生产环境中，通常先实现应用自身账号体系的登录，成功后再使用自身应用服务器（App Server）返回的 userId 和 token 进行即时通讯 IM 登录。也就是说，你需要在 App Server 将 Token 分发给客户端。

:::tip
用户 ID 在应用内唯一，与其他用户通讯时必须传递 userId。因此，userId 可视为公开信息，建议不与应用自身账号相同，且不能是容易猜测（例如 1111）、按特定字符顺序排列（例如 12345 ）、或者具有明显特征（例如，姓名或生日）的字符串，以防止被恶意使用。用户 ID 的设置需求详见 [注册用户](/document/server-side/account_register_open.html)。
::: 

环信服务端支持以下两种方式获取用户 token：

- 在 App Server 调用环信提供的 RESTful API，传入 App 层定义的用户 ID 获取用户 Token。成功获取 Token 后，由你的 App Server 分发给客户端。该 RESTful API 可设置 Token 有效期，而且支持设置用户不存在时是否自动创建用户。

![img](/images/server-side/token_get_based_userid.png)

- 在 App Server 基于 `AppKey`、`ClientSecret` 和用户 ID（注册用户时传入的 `username`）生成动态 Token。生成 Token 后，由你的 App Server 将 Token 分发给客户端。环信服务器校验该 Token 的有效性。

若在登录过程中减少与环信服务器的交互，提高登录速度，或者想自行控制 Token 的签发，则推荐使用动态 Token。Token 有效期由你自行设置，建议不要太长。

![img](/images/server-side/token_generate_dynamic.png)

## 通过用户 ID 获取用户 token

你通过用户 ID 获取用户 token。若用户 ID 不存在，你可以确定是否自动创建用户。

### 请求 URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

关于请求 URL 中的参数说明，详见 [请求 URL 参数介绍](overview.html#请求-url)。

### 请求示例

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token

curl -X POST 'https://XXXX/XXXX/XXXX/token'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "username": "test2333",
    "grant_type": "inherit",
    "autoCreateUser": true,
    "ttl": 1024000
 }' 
```

### 请求 header 参数

关于 `Content-Type`、`Accept` 和 `Authorization` 字段的说明，详见 [请求 header 参数说明](overview.html#请求-header)。

### 请求 body 参数

| 参数         | 类型   | 是否必需 | 描述 |
| :----------- | :----- | :------- | :------------------- |
| `grant_type` | String | 是       | 授权方式。设置为 `inherit`，表示通过用户 ID 获取用户 Token，需设置 `username` 参数。  |
| `username`   | String | 是       | 用户 ID。                |
| `autoCreateUser`   | Boolean | 是       | 当用户不存在时，是否自动创建用户。|
| `ttl`        | Long   | 否       | 用户 Token 有效期，单位为秒。设置为 `0` 表示 Token 有效期为永久。若不传该参数，有效期默认为 60 天。此外，也可通过 [环信控制台](https://console.easemob.com/user/login/)的 **用户管理** 页面设置。该参数值以最新设置为准。 |

### 响应示例

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

### 响应 body 字段

如果返回的 HTTP 状态码为 200，表示成功获取 token，响应包体中包含以下字段：

| 字段            | 类型   | 描述                                               |
| :-------------- | :----- | :---------------- |
| `access_token`  | String | 有效的用户 token。                                     |
| `expires_in`    | Long   | token 有效期，单位为秒。有效期内无需重复获取。<br/> 注意：VIP 5 集群该参数单位为毫秒。|
| `user`          | JSON   | 用户相关信息。                                             |
| `user.uuid`    | String | 用户的 UUID。即时通讯服务为该请求中的 app 或用户生成的唯一内部标识，用于生成用户 token。   |
| `user.type`    | String | 对象类型，无需关注。       |
| `user.created`  | Long  | 注册用户的 Unix 时间戳，单位为毫秒。            |
| `user.modified`  | Long  | 最近一次修改用户信息的 Unix 时间戳，单位为毫秒。          |
| `user.username`  | String | 用户 ID。                                                       |
| `user.activated` | Bool  | 用户是否为活跃状态：<br/> - `true`：用户为活跃状态。<br/> - `false`：用户为封禁状态。如要使用已被封禁的用户，你需要调用 [解禁用户的 API](/document/server-side/account_unban.html)对用户解除封禁。 |

如果返回的 HTTP 状态码非 200，表示请求失败。你可以参考 [响应状态码](/document/server-side/error.html)了解可能的原因。

### 错误码

调用获取用户 token 接口时，如果返回的 HTTP 状态码非 `200`，表示请求失败，可能提示以下错误码：

| HTTP 状态码 | 错误类型       | 错误提示       | 可能原因    | 处理建议    |
| :---- | :------------| :------| :------| :-------|
| 400         | illegal_argument                   | username [XXX] is not legal  | 请求 body 中 `grant_type` 为 `inherit`，`autoCreateUser` 为 `true`时，若用户不存在，注册用户的 `username` 不合法。 | 请按照用户名的规范进行注册用户。   |
| 400         | illegal_argument                   | USERNAME_TOO_LONG     | 请求 body 中 `grant_type` 为 `inherit`，`autoCreateUser` 为 `true`，若用户不存在，注册用户的 `username` 长度超限。 | 请按照用户名的规范进行注册用户。  |
| 400         | invalid_grant                      | user not activated   | 用户被封禁。  | 解禁用户后，再获取用户 token。 |
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | token 不合法，可能过期或 token 错误。  | 使用新的 token 访问。  |
| 401         | auth_bad_access_token              | Unable to authenticate due to corrupt access token           | token 权限错误（可能使用的是用户 token）或生成 token 时使用的 app key 与 请求 url 中使用的 app key 不相同。 | 请保证使用的 token 正确。   |
| 404         | invalid_grant                      | user not found     | 用户不存在。  | 先注册用户或者检查用户名是否正确。|
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | App key  不存在。 | 检查 `orgName` 和 `appName` 是否正确或 [创建应用](/product/console/app_create.html)。|
| 404         | entity_not_found                   | User null not found     | 用户不存在。   | 先注册用户或者检查用户名是否正确。    |
| 409         | concurrent_operation_error         | concurrency create app user failed    | 同一秒内多次获取用户 token 时，若自动创建用户（即请求 body 中的 `grant_type` 为 `inherit`，`autoCreateUser` 为 `true`），引起的并发注册用户问题。 | 避免同一秒内多次调用该 API 自动创建用户获取用户 token。 如果获取 token 的用户已注册，并发调用该 API 则不会报错。  |
| 429         | resource_limited    | You have exceeded the limit of the community edition,Please upgrade to the enterprise edition | 请求 body 中 `grant_type` 为 `inherit`，`autoCreateUser` 为 `true`（用户不存在时，自动注册用户） ，在使用注册用户的数量超过版本的限制 | 免费套餐包最多支持 100 个注册用户。你可以 [升级至付费套餐包](/product/pricing_method.html#订阅-升级套餐包)。专业版和旗舰版对注册用户数量无限制。 |

## 生成动态的用户 Token

动态用户 Token 的生成依赖 `ClientSecret`，因此生成逻辑务必在客户的服务器侧完成，以免 `ClientSecret` 泄露。

**动态 Token 临时有效，有效期由你自行设置，建议不要太长。**

你可以按照如下步骤生成动态用户 token：

1. 在 [环信控制台](https://console.easemob.com/user/login) 创建应用，生成 `AppKey`、`Client ID` 和 `ClientSecret`。

2. 基于 `AppKey`、`ClientSecret` 和 `userId`（即注册用户时传入的 `username`），参考如下示例生成用户 Token。

```
a. 获取当前时间戳，单位为秒。
    CurTime = 1686207557
b. 设置过期时间，单位为秒。
    ttl = 600
c. 生成 signature，将 clientId、appkey、userId、curTime、ttl、clientSecret 六个字段拼成一个字符串，进行 sha256 编码并将编码内容得到的字节转换为十六进制字符串。
    str = clientId + appkey + userId + curTime + ttl + clientSecret
    sha256hash = sha256.Sum256([]byte(str))
    signature = fmt.Sprintf("%x", shaBytes)
d. 组装为 json。
     json = {"signature": "xx", "appkey":"xx#xx", "userId":"xx", "curTime":1686207557, "ttl": 600}
e. 将 token 类型 "dt-" 放到 json 转成的字符串前，生成最终的字符串。
    str = "dt-" + jsonStr
f. 进行 base64 编码，生成最终的 token。
    token = base64.urlEncode.encode(str)
```

3. 使用上述方法生成 Token 后，客户端 SDK 将该 Token 填入并登录，服务器校验成功后即登录成功。

## Token 有效期

上述两种方式下，用户 Token 的有效期均可自行指定，建议不要太长。

客户端的 SDK 中提供了即将过期和 token 过期的两种回调，你可以在即将过期的回调中，重新获取 token，并通过 `renewToken` 的 API 更新 Token。

```
void onTokenWillExpire() {
     // refresh token here
      
}
```

