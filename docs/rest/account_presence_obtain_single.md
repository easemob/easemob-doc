# Retrieve a User's Presence

## Feature overview

- Check whether a single user is online or offline.
- If the user is logged in on multiple devices, the user is considered online as long as at least one device is online.

:::tip
This API queries whether a single user is online or offline. To query users' presence in batches, including online, offline, or custom status, use the [Retrieve presence in batches](presence_get.html) API.
:::

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-account-management).

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/status
```

| Parameter     | Type   | Required | Description  |
| :------- | :----- | :------- | :--------------- |
| `username`  | String | Yes       | The user ID whose presence you want to retrieve.   |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/status'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/status",
  "entities": [],
  "data": {
    "user1": "offline"
  },
  "timestamp": 1542601284531,
  "duration": 4
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field   | Type | Description         |
| :----- | :--- | :---------------------- |
| `data` | JSON | The user's presence data.<br/> The data is in the format `"user ID": "current status"`. For example, user1's online and offline states are `"user1": "online"` and `"user1": "offline"`, respectively. <br/> - `online`: The client has established a persistent connection to the EasyIM server after login.<br/> - `offline`: The iOS or Android process has been killed, or the connection has been interrupted due to network issues. The user enters the `offline` state and can receive offline push notifications for messages, provided that a push certificate has been uploaded in the EasyIM Console and the offline push service has been integrated. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | The request method.                                                                     |
| `uri`             | String | The request URL.                                                                     |
| `entities`        | JSON Array   | The response entity.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type   | Error message         | Possible cause      | Recommendation    |
| :----- | :----------- | :--| :-------------- | :---|
| 401         | unauthorized     | Unable to authenticate (OAuth)       | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.   |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.  | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 404         | service_resource_not_found | Service resource not found | The app user does not exist.  | Provide an existing user. |
