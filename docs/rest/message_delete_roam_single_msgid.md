# Delete One-to-One Chat Roaming Messages for One User by Message ID

## Feature overview

- Delete one or more roaming messages, up to 50 per request, from a specified user's one-to-one chat conversation by message ID.
- Messages can only be deleted for that user:
  - The specified roaming messages are deleted from the server and the user's local device, and the user can no longer retrieve them on the client. If all roaming messages in the conversation are deleted, the conversation is also cleared for that user on the server and is no longer returned when the user retrieves the conversation list on the client.
  - The other user in the conversation is not affected and can still retrieve the roaming messages and conversation with this user.
- Before calling this API, you can obtain the message IDs to delete by [retrieving historical messages](message_historical.html). If you use [message callbacks](callback_overview.html), you can also obtain the message IDs from your server because the callback data sent to your server contains them.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/chat/user/{userId}?userId={peer_userId}&msgIdList={msgIdList}&isNotify={isNotify}
```

| Parameter     | Type   | Required | Description                                |
| :------- | :----- | :------- | :---------------------------------- |
| `userId` | String | Yes       | The user ID that owns the one-to-one chat roaming messages to delete. |
| `peer_userId` | String | Yes    | The user ID of the other user in the one-to-one chat conversation.     |
| `msgIdList` | String | Yes    | The message IDs of the messages to delete. You can pass up to 50 message IDs per request, separated by commas, for example, message ID 1,message ID 2. |
| `isNotify` | Boolean | No       | Whether to synchronize the message deletion to all online devices of the user who owns the messages.<br/> - (Default) `true`: Yes.<br/> - `false`: No. |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/chat/user/XXXX?userId=XXXX&msgIdList=XXXX&isNotify=false' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
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
| `requestStatusCode`      | String | `ok` indicates that the messages were deleted successfully. |
| `timestamp`          | Number | The Unix timestamp of the HTTP response, in milliseconds.    |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type      | Error message                                          | Possible cause            | Recommendation           |
|:---------|:-------------------|:----------------------------------------------|:----------------|:---------------|
| 400      | service open exception  | this appKey not open message roaming   | Message roaming is not enabled.  | Contact the Easemob business team to enable it.  |
| 400      | param exception  | delete msg list limit can not greater than 50 | The number of message IDs to delete in a single request exceeds the limit of 50. | Reduce the number of message IDs in a single deletion request. |
| 400      | Bad Request  | Bad Request    | A required parameter, such as the query parameter `userId` or `msgIdList`, is missing. | Check whether the parameters are passed correctly.  |

For other errors and their possible causes, see [Response status codes](error.html).
