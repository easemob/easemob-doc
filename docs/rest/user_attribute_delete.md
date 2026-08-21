# Delete User Attributes

User attributes are information about users in real-time messaging interactions, such as nicknames, avatars, email addresses, phone numbers, gender, signatures, and birthdays.

For example, in a recruitment scenario, user attributes can store gender, email address, user type such as interviewee, and job type such as web development. You can query the user attribute information stored on the server when viewing user information.

## Feature overview

- Delete all attributes of a user.
- If the specified user or user attributes do not exist, possibly because they have been deleted, the deletion is still considered successful.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/user/{username}
```

| Parameter       | Type   | Required | Description                   |
| :--------- | :----- | :------- | :--------------------- |
| `username` | String | Yes       | User ID whose attributes are to be deleted. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X DELETE 'https://XXXX/XXXX/XXXX/metadata/user/user1'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "timestamp": 1616573382270,
  "duration": 10,
  "data": true
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter   | Type | Description    |
| :----- | :--- | :----------- |
| `data` | Bool | Whether the deletion is successful:<br/> - `true`: Yes. If the specified user or user attributes do not exist, the deletion is still considered successful.<br/> - `false`: No. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | metadata_error          | auth error        | Authentication failed. | Use a valid token. |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow        | The user attribute feature is not activated. | Contact the business manager to activate the user attribute feature. |

For other errors, see [Response status codes](error.html) for possible causes.
