# Retrieve User Details in Batches

## Feature overview

- This API queries a list of information about multiple users and returns the users in order of creation time.
- You can specify the number of users to query.
- If the number of users in the database is greater than the number you specify in `limit`, the response includes the `cursor` that marks the starting position for the next query. You can retrieve user details by page until the response no longer contains `cursor`, indicating that you have reached the last page.

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-account-management).

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users?limit={N}&cursor={cursor}
```

| Parameter     | Type   | Required | Description  |
| :------- | :----- | :------- | :--------------- |
| `limit`  | Int    | No       | The number of users to query. The value range is [1,100], and the default value is 10. If the actual number of users exceeds 100, 100 users are returned.   |
| `cursor` | String | No       | The cursor position from which to start retrieving data, used to display the user list by page. For the first batch user query, if you do not set `cursor`, a successful request retrieves the earliest created users. Obtain `cursor` from the response body and pass it in the URL of the next request. When the response body no longer contains the `cursor` field, all users in the app have been retrieved. | 

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example 1

Query a list of information about 2 users in registration order:

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2'   \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>' 
```

Use the returned cursor to retrieve the next page:

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX2tB'    \
-H 'Accept: application/json'   \ 
-H 'Authorization: Bearer <YourAppToken>' 
```

## Response example 1

The response returns a list of information about the 2 earliest registered users:

```json
{
  "action": "get",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "ab90eff0-XXXX-XXXX-9174-8f161649a182",
      "type": "user",
      "created": 1542356511855,
      "modified": 1542356511855,
      "username": "XXXX",
      "activated": true,
      "nickname": "user1"
    },
    {
      "uuid": "b2aade90-XXXX-XXXX-a974-f3368f82e4f1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542356523769,
      "username": "user2",
      "activated": true,
      "nickname": "user2"
    }
  ],
  "timestamp": 1542558467056,
  "duration": 11,
  "cursor": "LTgzXXXX2tB",
  "count": 2
}
```

## Request example 2

Using the `cursor` from response example 1, continue querying the next page of users in registration order. This page contains 1 user:

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X GET 'https://XXXX/XXXX/XXXX/users?limit=2&cursor=LTgzXXXX2tB'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Response example 2

The response returns information about 1 user:

```json
{
  "action": "get",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users",
  "entities": [
    {
      "uuid": "fef7f250-XXXX-XXXX-ba39-0fed7dcc3cdd",
      "type": "user",
      "created": 1542361376245,
      "modified": 1542361376245,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542559337702,
  "cursor": "LTgzXXXX2tB",
  "duration": 2,
  "count": 1
}
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response body fields

| Field   | Type   | Description    |
| :-------------------------------------------- | :----- | :------------------------------- |
| `entities`| JSON Array | The response entity. |
|  - `uuid`      | String | The user's UUID. EasyIM generates this unique internal identifier for the app or user in the request. It is used to generate a user token.      |
|  - `type`      | String | The object type. You do not need to pay attention to this field.             |
|  - `created`   | Long   | The Unix timestamp when the user was registered, in milliseconds.      |
|  - `modified`  | Long   | The Unix timestamp when the user information was last modified, in milliseconds.       |
|  - `username`  | String | The user ID.            |
|  - `nickname`  | String | The nickname displayed in the push notification bar when a message is pushed.     |
|  - `activated` | Bool   | Whether the user is active:<br/> - `true`: The user is active.<br/> - `false`: The user is banned. To use a banned user account, call [Unban a user](account_unban.html) to unban the user. |
|  - `notification_display_style`         | Int    | The push notification display mode:<br/> - `0`: Notification only. The push title is “You have a new message”, and the push content is “Tap to view”.<br/> - `1`: Notification with message details. The push title is “You have a new message”, and the push content consists of the sender's nickname and the offline message content.<br/>If the user has not set this parameter, it is not returned in the response.   |
|  - `notification_no_disturbing`         | Bool   | Whether Do Not Disturb (DND) is enabled.<br/> - `true`: DND is enabled. If the user has not set this parameter, it is not returned in the response.<br/> - `false`: DND is disabled.     |
|  - `notification_no_disturbing_start`   | String | The DND start time. For example, `8` means that DND starts at 8:00 every day. If the user has not set this parameter, it is not returned in the response.     |
|  - `notification_no_disturbing_end`     | String | The DND end time. For example, `18` means that DND ends at 18:00 every day. If the user has not set this parameter, it is not returned in the response.  |
|  - `notification_ignore_63112447328257` | Bool   | Whether offline push notifications for chat group messages are disabled. The number represents the chat group ID. <br/> -`true`: Disabled. <br/> - `false`: Not disabled. If this parameter is not set, it is not returned.   |
|  - `notifier_name`                      | String | The client push certificate name. If the user has not set a push certificate name, it is not returned in the response.   |
|  - `device_token`                       | String | The push token. If the user does not have a push token, it is not returned in the response.   |
| `cursor`                                      | String | The cursor used to display the user list by page.<br>For the first batch user query, you do not need to set `cursor`. After a successful request, obtain `cursor` from the response body and pass it in the URL of the next request. When the response body no longer contains the `cursor` field, all users in the app have been retrieved. |
| `count`                                       | Number | The number of users returned.      |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type  | Error message     | Possible cause     | Recommendation   |
| :---------- | :---------- | :-------------- | :------------- | :--------------- |
| 401         | unauthorized       | Unable to authenticate (OAuth)     | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.|
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist. | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html).|

For other errors and their possible causes, see [Response status codes](error.html).
