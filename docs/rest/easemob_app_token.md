# Authenticate with an EasyIM App Token

<Toc />

The REST APIs provided by EasyIM require an app token, which is an admin-privilege token. You need to include an app token when sending an HTTP request. This section describes how to obtain an app token.

EasyIM Server SDKs also provide management capabilities for resources such as users, messages, chat groups, and chat rooms. For details, see [Java Server SDK](java_server_sdk.html) and [PHP Server SDK](php_server_sdk.html).

## Obtain an admin-privilege token

When you obtain a token, the server returns its validity period as the value of the `expires_in` field in the response. Due to network latency and other factors, the system does not guarantee that the token remains valid throughout this entire period. If token usage is abnormal, for example, if HTTP status code 401 is returned, obtain a new token.

:::tip
Do not frequently send token requests to the server. If an account sends these requests too frequently, it is banned by the server.
:::

### Request URL

```http
POST https://{host}/{org_name}/{app_name}/token
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

### Request example

```shell
curl -X POST 'https://a1.easemob.com/easemob-demo/testapp/token'    \
-H 'Content-Type: application/json'    \
-H 'Accept: application/json'     \
-d '{
   "grant_type": "client_credentials",
   "client_id": "YXA6i-Ak8Ol4Eei2l11ZjV-EAg",
   "client_secret": "YXA6VunqiNxoB7IwXHInk1cGiXOOJfc",
   "ttl": 1024000
 }' 
```

### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

### Request body fields

| Parameter            | Type   | Required | Description          |
| :-------------- | :----- | :------- | :---------------------------- |
| `grant_type`    | String | Yes       | Authorization method. Set this parameter to the fixed string `client_credentials`, indicating client credentials mode.        |
| `client_id`     | String | Yes       | App's `client_id`, used to generate an app token for calling REST APIs. See the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/).   |
| `client_secret` | String | Yes       | App's `client_secret`, used to generate an app token for calling REST APIs. See the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/).     |
| `ttl`           | Long   | No       | Token validity period, in seconds.<br/> - If you pass this parameter, the token validity period is the specified value.<br/> - If you do not pass this parameter, the token validity period is based on the setting on the **User Management** page of the [EasyIM Console](https://console.easyim.ai/user/login/).<br/> - If set to `0`, the token never expires. <br/>Note: On a VIP 5 cluster, this parameter is measured in milliseconds.|

### Response example

```json
{
  "access_token": "YWMte3bGuOukEeiTkNP4grL7iwAAAAAAAAAAAAAAAAAAAAGL4CTw6XgR6LaXXVmNX4QCAgXXXXXXXXX-ZgBPGgBFTrLhhyK8woMEI005emtrLJFJV6aoxsZSioSIZkr5kw",
  "expires_in": 1024000,
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402"
}
```

### Response body fields

If the returned HTTP status code is `200`, the token is returned successfully. The response body contains the following fields:

| Parameter           | Type   | Description                                                 |
| :------------- | :----- | :--------------------------------------------------- |
| `access_token` | String | Valid token string.                                |
| `expires_in`   | Long   | Token validity period, in seconds. You do not need to obtain another token during this period. |
| `application`  | String | UUID of the current app.                                |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](/rest/error.html) for possible causes.

### Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type     | Error message         | Possible cause           | Recommendation       |
| :---------- | :-------- | :-------------- | :------------ | :----|
| 400         | illegal_argument    | client_id must be provided.        | `client_id` is not passed in the request body.| See the **Client ID** parameter corresponding to the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/). |
| 400         | illegal_argument                   | client_secret must be provided    | `client_secret` is not passed in the request body. | See the **Client Secret** parameter corresponding to the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/). |
| 400         | invalid_grant                      | client_id does not match   | The `client_id` corresponding to the App Key does not match the `client_id` passed in the request body. | See the **Client ID** parameter corresponding to the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/), and ensure that it matches the value passed in the request body. |
| 400         | invalid_grant                      | client_secret does not match     | The `client_secret` corresponding to the App Key does not match the `client_secret` passed in the request body. | See the **Client Secret** parameter corresponding to the App Key on the **App Overview** page in the [EasyIM Console](https://console.easyim.ai/user/login/), and ensure that it matches the value passed in the request body. |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.  | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
