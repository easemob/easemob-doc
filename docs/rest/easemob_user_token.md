# Authenticate with a User Token

<Toc />

## Feature overview

Before an app can use the features provided by an EasyIM SDK, the user must log in. During login, you must pass the user ID registered with EasyIM, hereinafter referred to as "userId," and an authentication token. The token uniquely identifies the user in EasyIM. After login, the SDK uses this token internally to interact with the server when calling EasyIM APIs.

In a production environment, you typically first implement login for your app's own account system. After login succeeds, use the userId and token returned by your app server to log in to EasyIM. In other words, your app server needs to distribute the token to the client.

:::tip
A user ID is unique within an app, and the userId must be passed when communicating with other users. Therefore, userId can be considered public information. To prevent malicious use, we recommend that it differ from the app's own account identifier and that it not be an easily guessed string, such as 1111, a string in a particular character sequence, such as 12345, or a string with an obvious characteristic, such as a name or birthday. For user ID requirements, see [Register users](/rest/account_register_open.html).
::: 

The EasyIM server supports the following two methods for obtaining a user token:

- On the app server, call the RESTful API provided by EasyIM and pass the user ID defined at the app layer to obtain a user token. After obtaining the token, your app server distributes it to the client. This RESTful API lets you set the token validity period and whether to automatically create the user if the user does not exist.

![img](/images/server-side/token_get_based_userid.png)

- On the app server, generate a dynamic token based on `AppKey`, `ClientSecret`, and the user ID, which is the `username` passed when registering the user. After generating the token, your app server distributes it to the client. The EasyIM server verifies the token's validity.

To reduce interactions with the EasyIM server during login, improve login speed, or control token issuance yourself, we recommend using dynamic tokens. You set the token validity period yourself, and we recommend that it not be too long.

![img](/images/server-side/token_generate_dynamic.png)

## Obtain a user token by user ID

Obtain a user token by user ID. If the user ID does not exist, you can specify whether to create the user automatically.

### Request URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

### Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

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

### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

### Request body fields

| Parameter         | Type   | Required | Description |
| :----------- | :----- | :------- | :------------------- |
| `grant_type` | String | Yes       | Authorization method. Set it to `inherit` to obtain a user token by user ID. You must set the `username` parameter.  |
| `username`   | String | Yes       | User ID.                |
| `autoCreateUser`   | Boolean | Yes       | Whether to automatically create the user if the user does not exist.|
| `ttl`        | Long   | No       | User token validity period, in seconds. Set it to `0` so the token never expires. If this parameter is not passed, the default validity period is 60 days. You can also set it on the **User Management** page of the [EasyIM Console](https://console.easyim.ai/user/login/). The most recent setting takes precedence. |

### Response example

The response for automatically creating a user and obtaining a token is as follows:

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

### Response body fields

If the returned HTTP status code is 200, the token was obtained successfully. The response body contains the following fields:

| Field            | Type   | Description                                               |
| :-------------- | :----- | :---------------- |
| `access_token`  | String | Valid user token.                                     |
| `expires_in`    | Long   | Token validity period, in seconds. You do not need to obtain another token during this period.<br/> Note: On a VIP 5 cluster, this parameter is measured in milliseconds.|
| `user`          | JSON   | User-related information.                                             |
| `user.uuid`    | String | User UUID. The EasyIM service generates this unique internal identifier for the app or user in the request to generate a user token.   |
| `user.type`    | String | Object type, which does not require your attention.       |
| `user.created`  | Long  | Unix timestamp when the user was registered, in milliseconds.            |
| `user.modified`  | Long  | Unix timestamp when the user information was last modified, in milliseconds.          |
| `user.username`  | String | User ID.                                                       |
| `user.activated` | Bool  | Whether the user is active:<br/> - `true`: The user is active.<br/> - `false`: The user is banned. To use a banned user, call the [Unban a User API](/rest/account_unban.html). |

If the returned HTTP status code is not 200, the request fails. See [Response status codes](/rest/error.html) for possible causes.

### Error code

When you call the API to obtain a user token, if the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type       | Error message       | Possible cause    | Recommendation    |
| :---- | :------------| :------| :------| :-------|
| 400         | illegal_argument                   | username [XXX] is not legal  | If `grant_type` in the request body is `inherit` and `autoCreateUser` is `true`, when the user does not exist, the `username` used to register the user is invalid. | Register the user according to the username requirements.   |
| 400         | illegal_argument                   | USERNAME_TOO_LONG     | If `grant_type` in the request body is `inherit` and `autoCreateUser` is `true`, when the user does not exist, the `username` used to register the user exceeds the length limit. | Register the user according to the username requirements.  |
| 400         | invalid_grant                      | user not activated   | The user is banned.  | Unban the user before obtaining a user token. |
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | The token is invalid, expired, or incorrect.  | Use a new token to access the API.  |
| 401         | auth_bad_access_token              | Unable to authenticate due to corrupt access token           | The token has incorrect permissions, possibly because a user token was used, or the App Key used to generate the token differs from the App Key used in the request URL. | Ensure that the correct token is used.   |
| 404         | invalid_grant                      | user not found     | The user does not exist.  | Register the user first or check whether the username is correct.|
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist. | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html).|
| 404         | entity_not_found                   | User null not found     | The user does not exist.   | Register the user first or check whether the username is correct.    |
| 409         | concurrent_operation_error         | concurrency create app user failed    | Obtaining a user token multiple times within the same second while automatically creating the user, that is, when `grant_type` in the request body is `inherit` and `autoCreateUser` is `true`, causes concurrent user registration. | Avoid calling this API multiple times within the same second to automatically create a user and obtain a user token. If the user for whom the token is being obtained is already registered, concurrent calls to this API do not report an error.  |
| 429         | resource_limited    | You have exceeded the limit of the community edition,Please upgrade to the enterprise edition | If `grant_type` in the request body is `inherit` and `autoCreateUser` is `true`, meaning the user is automatically registered when they do not exist, the number of registered users exceeds the plan limit. | The free plan supports up to 100 registered users. You can [upgrade to a paid plan](/product/pricing_method.html#subscribe-to-or-upgrade-a-plan). The Professional and Flagship plans have no limit on the number of registered users. |

## Generate a dynamic user token

Generating a dynamic user token depends on `ClientSecret`. Therefore, you must implement the generation logic on your server to prevent `ClientSecret` from being exposed.

**A dynamic token is temporarily valid. You set its validity period yourself, and we recommend that it not be too long.**

Generate a dynamic user token as follows:

1. Create an app in the [EasyIM Console](https://console.easyim.ai/user/login) to generate `AppKey`, `Client ID`, and `ClientSecret`.

2. Generate a user token based on `AppKey`, `ClientSecret`, and `userId`, which is the `username` passed when registering the user, as shown in the following example.

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

3. After generating the token using the preceding method, the client SDK provides the token and logs in. Login succeeds after the server verifies the token.

## Token validity period

For both preceding methods, you can specify the user token validity period. We recommend that it not be too long.

The client SDK provides callbacks for a token that is about to expire and a token that has expired. In the callback for a token that is about to expire, obtain a new token and update it through the `renewToken` API.

```
void onTokenWillExpire() {
     // refresh token here
      
}
```
