# Delete All Roaming Messages for One User

## Feature overview

- Delete all roaming messages for a user up to the current time.
- Messages are deleted only for that user:
  - After you call this API, the user's roaming messages are cleared from the server and the user's local device. The user can no longer retrieve roaming messages from the server, and all conversations for the user are cleared and no longer returned in the conversation list.
  - Other users in the conversations are not affected and can still retrieve the roaming messages and conversations with this user.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/rest/message/roaming/user/{userId}/delete/all
```

| Parameter     | Type   | Required | Description                         |
| :------- | :----- | :------- | :--------------------------- |
| `userId` | String | Yes       | The user ID whose roaming messages you want to delete. |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X POST 'https://XXXX/XXXX/XXXX/rest/message/roaming/user/XXXX/delete/all' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Response example

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1710309184114
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field                       | Type     | Description         |
|:-------------------------|:-------|:-----------|
| `requestStatusCode`      | String | The operation result. `ok` indicates that the user's roaming messages were cleared successfully. |
| `timestamp`          | Long | The Unix timestamp of the HTTP response, in milliseconds.|

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message       | Possible cause    | Recommendation       |
|:---------|:-----------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | Message roaming is not enabled. | Contact the Easemob business team to enable it. |

For other errors and their possible causes, see [Response status codes](error.html).
