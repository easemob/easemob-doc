# Ban a User

## Feature overview

- Ban a single user. The ban takes effect immediately.
- After a user is banned, the ban is not lifted automatically after a period of time. The user can only be unbanned by calling the [Unban a user API](account_unban.html).
- Once a user is banned, they are immediately forced offline and will be unable to log in to EasyIM until they are unbanned.
- While the user is banned, other users can still send messages to them, but the banned user cannot receive those messages or push notifications. Once unbanned, the user can connect to and use EasyIM as usual. When the user gets online again, they can receive offline messages sent while they were banned. Note that offline messages are stored for up to 7 days by default. If the client does not get online within 7 days, the server discards the expired messages.
- This feature is commonly used to take immediate action against users who exhibit abnormal behavior.
- If the user is online, banning the user forces them offline.

## Call frequency limit

The aggregate call frequency limit for this API, other user management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/deactivate
```

| Parameter            | Type   | Required | Description      |
| :-------------- | :----- | :------- | :------------- |
| `username`            | String   | Yes | The user ID of the user to ban.      |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/deactivate'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "action": "Deactivate user",
  "entities": [
    {
      "uuid": "4759aa70-XXXX-XXXX-925f-6fa0510823ba",
      "type": "user",
      "created": 1542595573399,
      "modified": 1542597578147,
      "username": "user1",
      "activated": false,
      "nickname": "user"
    }
  ],
  "timestamp": 1542602157258,
  "duration": 12
}

```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `entities`           | JSON Array | The response entity.          |
|  - `uuid`      | String | The user's UUID. EasyIM generates this unique internal identifier for the app or user in the request. It is used to generate a user token.      |
|  - `type`      | String | The object type. You do not need to pay attention to this field.             |
|  - `created`   | Long   | The Unix timestamp when the user was registered, in milliseconds.      |
|  - `modified`  | Long   | The Unix timestamp when the user information was last modified, in milliseconds.       |
|  - `username`  | String | The user ID.            |
|  - `nickname`  | String | The nickname displayed in the push notification bar when a message is pushed.     |
|  - `activated` | Bool   | Whether the user is active:<br/> - `true`: The user is active.<br/> - `false`: The user is banned. To use a banned user account, call [Unban a user](account_unban.html) to unban the user. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`            | String | The operation performed. In this response, the value is `Deactivate user`, indicating that the user is banned. |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type      | Error message     | Possible cause       | Recommendation      |
| :---------- | :------------------| :-------------------| :------------------| :-------------|
| 401         | unauthorized     | Unable to authenticate (OAuth)   | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API. |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.    | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 404         | service_resource_not_found         | Service resource not found   | The user does not exist.  | [Register the user](account_register_open.html) first, or check whether the username is correct. |

For other errors and their possible causes, see [Response status codes](error.html).
