# Kick a User Offline All Devices

## Feature overview

- Kicking a user offline changes the user's status to offline. The user must log in again to resume normal use.
- When the user comes online again, they can receive offline messages sent while they were banned. Note that offline messages are stored for up to 7 days by default. If the client does not come online within 7 days, the server discards the expired messages.
- If the user is logged in on multiple devices, calling this API forces the specified user offline on all logged-in devices. To kick the user offline on a specific device, call the [Kick a user offline on a specific device](account_offline_device_single.html) API.
  
## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/disconnect
```

| Parameter       | Type     | Description               |
|:---------|:-------|:-----------------|
| `username` | String | The user ID of the user to kick offline.|

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/disconnect'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/disconnect",
  "entities": [],
  "data": {
    "result": true
  },
  "timestamp": 1542602601332,
  "duration": 6
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field          | Type | Description                                                            |
| :------------ | :--- | :----------------------------------- |
| `data.result` | Bool | Whether the user has been forced offline:<br/> - `true`: Yes.<br/> - `false`: No. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | The request method.                                                                     |
| `uri`             | String | The request URL.                                                                     |
| `entities`        | JSON Array   | The response entity.      |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message    | Possible cause    | Recommendation     |
| :---------- | :-------| :------| :---------| :------------------|
| 401   | unauthorized     | Unable to authenticate (OAuth)   | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.  |
| 404   | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.    | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |

For other errors and their possible causes, see [Response status codes](error.html).
