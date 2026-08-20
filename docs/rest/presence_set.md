# Set a User's Presence

Presence indicates a user's current status. In addition to the online and offline states built into EasyIM, you can add custom presence states such as Busy, Be right back, Away, On the phone, and Out to lunch. This section shows how to use the EasyIM RESTful APIs to manage presence subscriptions, including setting presence, subscribing to and retrieving presence in batches, unsubscribing, and querying the subscription list.

For definitions of online, offline, and custom presence states, see [User presence management](/product/product_user_presence.html).

## Feature overview

Set a user's presence on a specified device.

## Feature activation

Before using Presence, activate it in the [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#real-time-user-presence-status-synchronization).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{resource}/{status}
```

| Parameter       | Type  | Required | Description           | 
| :--------- | :----- | :---------------------- | :------- |
| `username`       | String  | Yes | Set the presence of this user ID.           | 
| `resource` | String | Yes     | Unique identifier assigned by the server to each device resource whose presence is to be set. The format is `{device type}_{resource ID}`, where `device type` can be `android`, `ios`, or `web`, and `resource ID` is assigned by the SDK. For example, `android_123423453246`. |
| `status`   | String | Yes     | User's presence:<br> - `0`: Offline.<br> - `1`: Online.<br> - Other numeric strings: Custom presence. | 

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/c1/presence/android/0' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"ext":"123"}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The request body is a JSON object containing the following fields:

| Parameter  | Type | Required  | Description             | 
| :---- | :----- | :---------------------- | :------- |
| `ext` | String | Yes | Presence extension information. We recommend that it not exceed 1024 bytes. | 

## Response example

```json
{"result":"ok"}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type   | Description                                                 |
| :------- | :----- | :--------------------------------------------------- |
| `result` | String | Whether the presence was set successfully. `ok` indicates success. Otherwise, troubleshoot based on the returned reason. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400   | illegal_argument | ext cannot be null | An empty value was passed for the presence extension parameter `ext`. | Ensure that a non-empty value is passed for `ext`. |
| 400   | illegal_argument | ext is too big | The presence extension information exceeds the 1024-byte limit. | Limit the presence extension information to no more than 1024 bytes. |
| 400   | service open exception | the app not open presence | The Presence service is not activated. | Contact the Easemob business team to activate the Presence service.|
| 401  | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token to access the API. |

For other errors, see [Error code](#error-code) for possible causes.
