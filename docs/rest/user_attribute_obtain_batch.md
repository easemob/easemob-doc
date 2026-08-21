# Get User Attributes in Batches

User attributes are information about users in real-time messaging interactions, such as nicknames, avatars, email addresses, phone numbers, gender, signatures, and birthdays.

For example, in a recruitment scenario, user attributes can store gender, email address, user type such as interviewee, and job type such as web development. You can query the user attribute information stored on the server when viewing user information.

## Feature overview

- Query user attributes based on the specified user ID list and attribute list.
- You can retrieve attributes for up to 100 users per request.
- If the specified user ID or user attributes do not exist, empty data `{}` is returned.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/metadata/user/get
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/metadata/user/get'
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "properties": [
    "avatarurl",
    "ext",
    "nickname"
  ],
  "targets": [
    "user1",
    "user2",
    "user3"
  ]
}' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter         | Type  | Required | Description                                                                       |
| :----------- | :---- | :------- | :-------------------- |
| `targets`    | Array | Yes       | User ID list containing up to 100 user IDs. |
| `properties` | Array | Yes       | Attribute name list. The query result returns only attributes in this list and ignores other attributes. |

## Response example

```json
{
  "timestamp": 1620448826647,
  "data": {
    "user1": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user2": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    },
    "user3": {
      "ext": "ext",
      "nickname": "nickname",
      "avatarurl": "https://www.easemob.com/avatar.png"
    }
  },
  "duration": 3
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type   | Description                                                                                |
| :----- | :----- | :---------------------------------------------------------------------------------- |
| `data` | Object | User attribute key-value pairs.<br/>If `data` is empty, verify that the user ID exists and that the user has attributes. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | BAD_REQUEST  | exceed allowed batch size %s   | The number of users whose attributes are requested exceeds the limit. You can retrieve attributes for up to 100 users per request. | Reduce the number of users in the batch request. |
| 401     | metadata_error  | auth error        | Authentication failed. |     |
| 403     | FORBIDDEN       | {appkey} user metadata service not allow   | The user attribute feature is not activated. | Contact the business manager to activate the user attribute feature. |

For other errors, see [Response status codes](error.html) for possible causes.
