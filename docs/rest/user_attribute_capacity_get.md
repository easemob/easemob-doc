# Get the Total User Attribute Size for an App

User attributes are information about users in real-time messaging interactions, such as nicknames, avatars, email addresses, phone numbers, gender, signatures, and birthdays.

For example, in a recruitment scenario, user attributes can store gender, email address, user type such as interviewee, and job type such as web development. You can query the user attribute information stored on the server when viewing user information.

## Feature overview

Retrieve the size of all user attribute data in the app, in bytes.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/metadata/user/capacity
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/metadata/user/capacity'    \
-H 'Accept: application/json'     \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "timestamp": 1620447051368,
  "data": 1673,
  "duration": 55
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter   | Type | Description                                          |
| :----- | :--- | :-------------------------------------------- |
| `data` | Long | Size of all user attribute data in the app, in bytes. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized          | unauthorized        | Authentication failed. | Use app-level permissions to retrieve app capacity. |
| 401     | metadata_error          | auth error        | Authentication failed. | Use a valid token. |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | The user attribute feature is not activated. | Contact the sales team to activate the user attribute feature. |

For other errors, see [Response status codes](error.html) for possible causes.
