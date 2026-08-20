# Delete Group and Chat Room Roaming Messages for One User by Message ID

## Feature overview

- Delete one or more roaming messages, up to 50 per request, from a specified user's chat group or chat room conversation by message ID.
- Messages can only be deleted for that user:
  - The specified roaming messages are deleted from the server and the user's local device, and the user can no longer retrieve them from the EasyIM server. If all roaming messages in the conversation are deleted, the conversation is also cleared for that user on the server and is no longer returned when the user retrieves the conversation list.
  - Other users in the chat group or chat room are not affected and can still retrieve these roaming messages and the conversation.
- Before calling this API, you can obtain the message IDs to delete by [retrieving historical messages](message_historical.html). If you use [message webhooks](callback_overview.html), you can also obtain the message IDs from your server because the callback data sent to your server contains them.

:::tip
Chat room roaming messages are disabled by default. To use this feature, contact the Easemob business team to enable it.
:::

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/group/user/{userId}?groupId={groupId}&msgIdList={msgIdList}&isNotify={isNotify}
```

| Parameter      | Type     | Required | Description                                    |
|:--------|:-------|:-----|:----------------------|
| `userId` | String | Yes       | The user ID that owns the roaming messages to delete. |
| `groupId` | String | Yes    | The chat group ID or chat room ID.                                 |
| `msgIdList` | String | Yes    | The message IDs of the messages to delete. You can pass up to 50 message IDs per request, separated by commas, for example, message ID 1,message ID 2. |
| `isNotify` | Boolean | No       | Whether to synchronize the message deletion to all online devices of the user who owns the messages.<br/> - (Default) `true`: Yes.<br/> - `false`: No. |

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/group/user/XXXX?groupId=XXXX&msgIdList=XXXXisNotify=false' \
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
| `timestamp`          | Number | The Unix timestamp of the HTTP response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type     | Error message     | Possible cause    | Recommendation   |
|:---------|:----------|:-----------------------|:--------|:--------------|
| 400   | service open exception    | this appKey not open message roaming | Message roaming is not enabled. | Contact the Easemob business team to enable it. |
| 400      | param exception         | delete msg list limit can not greater than 50 | The number of message IDs to delete in a single request exceeds the limit of 50. | Reduce the number of message IDs in a single deletion request. |

For other errors and their possible causes, see [Response status codes](error.html).
