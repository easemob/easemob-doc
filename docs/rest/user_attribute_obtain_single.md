# Get User Attributes

User attributes are information about users in real-time messaging interactions, such as nicknames, avatars, email addresses, phone numbers, gender, signatures, and birthdays.

For example, in a recruitment scenario, user attributes can store gender, email address, user type such as interviewee, and job type such as web development. You can query the user attribute information stored on the server when viewing user information.

## Feature overview

Retrieve all user attribute key-value pairs for a user.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| Parameter       | Type   | Required | Description                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `username` | String | Yes       | User ID whose attributes are to be retrieved. If the specified user or user attributes do not exist, empty data `{}` is returned. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/metadata/user/user1'    \
-H 'Accept: application/json'     \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "timestamp": 1620445147011,
  "data": {
    "ext": "ext",
    "nickname": "nickname",
    "avatarurl": "http://easyim.ai/avatar.png"
  },
  "duration": 166
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type   | Description                                                                                  |
| :----- | :----- | :------------------------------------------------------------------------------------ |
| `data` | Object | User attribute key-value pairs.<br/>If `data` is empty, verify that the user ID exists and that the user has attributes. |
| - `ext`  | String      | Extension field. |
| - `nickname`  | User nickname, up to 64 characters. |
| - `avatarurl` | User avatar URL, up to 256 characters. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | Authentication failed. For example, the token does not match the `username` path parameter. | Use a valid token. |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | The user attribute feature is not activated. | Contact the business manager to activate the user attribute feature. |
| 500     | INTERNAL_SERVER_ERROR          |         | Unknown server error. |

For other errors, see [Response status codes](error.html) for possible causes.
