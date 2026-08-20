# Unban a User

## Feature overview

- Unban a single user.
- After a user is banned, the ban is not lifted automatically after a period of time. Call this API to unban the user.
- Once unbanned, the user can connect to and use EasyIM as usual. When the user gets online again, they can receive offline messages sent while they were banned. Note that offline messages are stored for up to 7 days by default. If the client does not come online within 7 days, the server discards the expired messages.

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-account-management).

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/activate
```

| Parameter            | Type   | Required | Description      |
| :-------------- | :----- | :------- | :------------- |
| `username`            | String   | Yes | The user ID of the user to unban.      |

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/activate'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "action": "activate user",
  "timestamp": 1542602404132,
  "duration": 9
}
```

## Response body fields

| Field       | Type   | Description        |
| :------------ | :----- | :------------ |
| `action` | String | The operation performed. In this response, the value is `activate user`, indicating that the user is unbanned. |
| `timestamp` | Number | The response timestamp. |
| `duration` | Number | The server processing time. |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type     | Error message      | Possible cause       | Recommendation    |
| :---------- | :---------| :---------------------| :----------| :--------|
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.    |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.    | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 404         | service_resource_not_found         | Service resource not found   | The user does not exist.  | [Register the user](account_register_open.html) first, or check whether the username is correct. |

For other errors and their possible causes, see [Response status codes](error.html).
