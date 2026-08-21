# Delete Group or Chat Room Roaming Messages up to a Specific Time for One User

## Feature overview

- Delete roaming messages up to and including a specified time from one of a specified user's chat group or chat room conversations.
- Messages are deleted only for that user:
  - After you call this API, the user's roaming messages are cleared from the server and the user's local device, and the user can no longer retrieve them from the EasyIM server. If all roaming messages in the conversation are cleared, the conversation is also cleared for that user on the server and is no longer returned when the user retrieves the conversation list.
  - Other users in the conversation are not affected and can still retrieve these roaming messages and the conversation.

:::tip
Chat room roaming messages are disabled by default. To use this feature, contact the EasyIM business manager to enable it.
:::

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/rest/message/roaming/group/user/{userId}/time?groupId={groupId}&delTime={delTime}&isNotify={isNotify}
```

| Parameter      | Type     | Required | Description                                    |
|:--------|:-------|:-----|:----------------------|
| `userId` | String | Yes       | The user ID that owns the roaming messages to delete. |
| `groupId` | String  | Yes    | The chat group or chat room whose roaming messages you want to delete. Pass a chat group ID or chat room ID.|
| `delTime` | Long  | Yes    | Delete chat group or chat room roaming messages up to and including this time. The value is a Unix timestamp in milliseconds. |
| `isNotify` | Boolean | No       | Whether to synchronize the message deletion to all online devices of the user who owns the messages.<br/> - (Default) `true`: Yes.<br/> - `false`: No. |

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X DELETE 'https://XXXX/XXXX/XXXX/rest/message/roaming/group/user/XXXX/time?groupId=XXXX&delTime=1659014868000&isNotify=false' \
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
| `timestamp`          | Number | The Unix timestamp of the HTTP response, in milliseconds.    |

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message       | Possible cause    | Recommendation       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | service open exception    | this appKey not open message roaming    | Message roaming is not enabled. | Contact the EasyIM business manager to enable it. |

For other errors and their possible causes, see [Response status codes](error.html).
