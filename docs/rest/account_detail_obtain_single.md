# Retrieve Details of a Single User

## Feature overview

Retrieve detailed information about a single app user, including the user ID, user UUID, user registration time, time when the user information was last modified, and push settings. Push settings include the push notification display mode, whether Do Not Disturb (DND) is enabled, DND start and end times, push certificate, push token, and whether offline push notifications for chat group messages are disabled.

## Call frequency limit

The aggregate call frequency limit for this API, other user account management APIs, and offline push APIs is 100 requests per second per App Key. For details, see [API call frequency limits](limitationapi.html#user-management).

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}
```

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :-------------------------- |
| `username`  | String  | Yes | The user whose details you want to retrieve.          |     

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X GET 'https://XXXX/XXXX/XXXX/users/XXXX'  \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'  
```

## Request header fields

For descriptions of the `Accept` and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "path": "/users",
  "uri": "https://XXXX/XXXX/XXXX/users/XXXX",
  "entities": [
    {
      "uuid": "0ffe2d80-XXXX-XXXX-8d66-279e3e1c214b",
      "type": "user",
      "created": 1542795196504,
      "modified": 1542795196504,
      "username": "XXXX",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542798985011,
  "duration": 6,
  "count": 1
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Field       | Type   | Description        |
| :------------ | :----- | :------------ |
| `entities` | JSON Array | The response entity. |
|  - `uuid`      | String | The user's UUID. EasyIM generates this unique internal identifier for the app or user in the request. It is used to generate a user token.      |
|  - `type`      | String | The object type. You do not need to pay attention to this field.             |
|  - `created`   | Long   | The Unix timestamp when the user was registered, in milliseconds.      |
|  - `modified`  | Long   | The Unix timestamp when the user information was last modified, in milliseconds.       |
|  - `username`  | String | The user ID.            |
|  - `nickname`  | String | The nickname displayed in the push notification bar when a message is pushed.     |
|  - `activated` | Bool   | Whether the user is active:<br/> - `true`: The user is active.<br/> - `false`: The user is banned. To use a banned user account, call [Unban a user](account_unban.html) to unban the user. |
|  - `notification_display_style`         | Int    | The push notification display mode:<br/> - `0`: Notification only. The push title is “You have a new message”, and the push content is “Tap to view”.<br/> - `1`: Notification with message details. The push title is “You have a new message”, and the push content consists of the sender's nickname and the offline message content.<br/>If the user has not set this parameter, it is not returned in the response. |
|  - `notification_no_disturbing`         | Boolean   | Whether Do Not Disturb (DND) is enabled.<br/> - `true`: DND is enabled. If the user has not set this parameter, it is not returned in the response.<br/> - `false`: DND is disabled. |
|  - `notification_no_disturbing_start`   | String | The DND start time. For example, “8” means that DND starts at 8:00 every day. If the user has not set this parameter, it is not returned in the response. |
|  - `notification_no_disturbing_end`     | String | The DND end time. For example, “18” means that DND ends at 18:00 every day. If the user has not set this parameter, it is not returned in the response.     |
|  - `notification_ignore_63112447328257` | Bool   | Whether offline push notifications for chat group messages are disabled. The number in the parameter, such as `63112447328257`, represents the chat group ID. <br/> -`true`: Disabled.<br/> - `false`: Not disabled. If the user has not set this parameter, it is not returned in the response.   |
|  - `notifier_name`                      | String | The client push certificate name. If the user has not set a push certificate name, it is not returned in the response.  |
|  - `device_token`                       | String | The push token. If the user does not have a push token, it is not returned in the response.   |

The other fields in the response body are described below:

| Field           | Type   | Description                        |
| :------------- | :----- | :---------------------- |
| `action`          | String | The request method.                                                                     |
| `path`               | String | The request path, which is part of the request URL. You do not need to pay attention to this field.       |
| `uri`             | String | The request URL.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |
| `count`   | Int    | The number of users.      |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message      | Possible cause      | Recommendation    |
| :---------- | :---------- | :--------- | :----------- | :---------- |
| 401         | unauthorized                       | Unable to authenticate (OAuth)    | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API.    |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.   | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |
| 404         | service_resource_not_found         | Service resource not found  | The user does not exist.  | Register the user first, or check whether the username is correct.  |

For other errors and their possible causes, see [Response status codes](error.html).
