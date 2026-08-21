# Delete One-to-One Chat Roaming Messages up to a Specific Time for One User

## Feature overview

- Delete roaming messages up to and including a specified time from one of a user's one-to-one chat conversations.
- Messages are deleted only for that user:
  - After you call this API, the user's roaming messages are cleared from the server and the user's local device, and the user can no longer retrieve them from the EasyIM server. If all roaming messages in the conversation are cleared, the conversation is also cleared for that user on the server and is no longer returned when the user retrieves the conversation list.
  - Other users in the conversation are not affected and can still retrieve the roaming messages and conversation with this user.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}/time?userId={peer_userId}&delTime={delTime}&isNotify={isNotify}
```

| Parameter      | Type     | Required | Description                                    |
|:--------|:-------|:-----|:----------------------|
| `userId` | String | Yes       | The user ID that owns the roaming messages to delete. |
| `peer_userId` | String | Yes       | The other user in the one-to-one chat conversation. Pass the user ID of the user whose conversation roaming messages you want to delete.  |
| `delTime`  | Long | Yes       | Delete one-to-one chat roaming messages up to and including this time. The value is a Unix timestamp in milliseconds. |
| `isNotify` | Boolean | No       | Whether to synchronize the message deletion to all online devices of the user who owns the messages.<br/> - (Default) `true`: Yes.<br/> - `false`: No. |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/chat/user/XXXX/time?userId=XXXX&delTime=1659014868000&isNotify=false' \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header field descriptions](overview.html#request-header-fields).

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
| `requestStatusCode`      | String | The operation result. `ok` indicates that the roaming messages were cleared successfully. |
| `timestamp`          | Number | The Unix timestamp of the HTTP response, in milliseconds.  |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message       | Possible cause    | Recommendation       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | Message roaming is not enabled. | Contact the EasyIM business manager to enable it. |

For other errors and their possible causes, see [Response status codes](error.html).
