# Bulk Retrieve User Presence

## Feature overview

- Check whether multiple users are online or offline.
- You can check the presence of up to 100 users in a single request.
- This API does not validate user IDs. If you query the presence of a user ID that does not exist, the returned status is `offline`.

:::tip
This API queries whether multiple users are online or offline. To query multiple users' presence in bulk, including online, offline, or custom status, use the [Retrieve presence in bulk](presence_get.html) API.
:::

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/batch/status
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X POST https://XXXX/XXXX/XXXX/users/batch/status \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-d '{"usernames":["user1","user2"]}'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter        | Type  | Required | Description                                           |
| :---------- | :---- | :------- | :--------------------------------- |
| `usernames` | Array | Yes       | The user IDs whose presence you want to query. You can pass **up to 100 user IDs per request**. |

## Response example

This API does not validate user IDs. If a queried user ID does not exist, the returned status is `offline`.

```json
{
  "action": "get batch user status",
  "data": [
    {
      "user1": "offline"
    },
    {
      "user2": "offline"
    }
  ],
  "timestamp": 1552280231926,
  "duration": 4
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type      | Description       |
| :------- | :-------- | :-------------------------------------------------------------- |
| `action` | String    | The operation performed. In this response, the value is `get batch user status`, indicating that user presence is retrieved in bulk.                                                  |
| `data`   | JSON Array | The queried users' presence.<br/> The data is in the format `"user ID": "current status"`. For example, user1's online and offline states are `"user1": "online"` and `"user1": "offline"`, respectively.<br/> - `online`: The client has established a persistent connection to the EasyIM server after login.<br/> - `offline`: The iOS or Android process has been killed, or the connection has been interrupted due to network issues. The user enters the `offline` state and can receive offline push notifications for messages. |
| `timestamp`          | Long   | The Unix timestamp of the HTTP response, in milliseconds.       |
| `duration`           | Long   | The time elapsed from sending the HTTP request to receiving the response, in milliseconds.     |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message    | Possible cause      | Recommendation     |
| :-- | :------------ | :--------- | :--------- | :---------- |
| 400   | illegal_argument      | request body exceeds maximum limit, maximum limit is 100     | The number of users in `usernames` in the request body exceeds 100. | Reduce the number of user IDs passed in `usernames`. |
| 401 | unauthorized  | Unable to authenticate (OAuth)   | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.    |
| 404  | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist. | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |

For other errors and their possible causes, see [Error code](error.html).
