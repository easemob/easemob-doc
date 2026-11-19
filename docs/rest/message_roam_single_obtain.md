# Retrieve One-to-One Chat Roaming Messages

## Feature overview

This API retrieves pages of roaming messages visible to a specified user in a one-to-one conversation from the IM server. Message roaming for one-to-one chats and group chats is enabled by default.

The API uses cursor-based pagination. Each request returns one page of messages. Use the returned cursor to query the next page until the query is complete. You can query a specified time range and retrieve messages from newest to oldest or oldest to newest.

**The results include one-to-one messages sent by the specified user and messages sent by the other participant that are visible to that user.** The query scope is subject to the message retention period and the user's deletion or clearing records:

- **[Message retention period](/product/pricing_policy.html#add-on-service-fees)**: Only roaming messages within the server-side retention period are returned.
- **[Deletion](message_delete_roam_single_msgid.html) and [clearing records](message_delete_roam_user.html)**: Roaming messages unilaterally deleted or cleared for that user are not returned.

To download hourly historical message record files for the app, see [Retrieve Historical Messages](message_historical.html).

To retrieve roaming messages in group conversations, see [Retrieve Group Chat Roaming Messages](message_roam_group_obtain.html).

## Call frequency limit

The default limit is 100 calls/second/App Key. Contact the EasyIM business manager to request a higher limit.

## Request URL

```http
POST https://{host}/api/server/v6/{org_name}/{app_name}/roaming/chat
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

#### Retrieve the first page

```bash
# Replace <YourAppToken> with the app token generated on your server
curl -X POST 'https://XXXX/api/server/v6/XXXX/XXXX/roaming/chat' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "username": "alice",
    "to": "bob",
    "limit": 20,
    "order": "down"
}'
```

#### Retrieve pages within a time range

For the first request, set `startTimestamp` and `endTimestamp` and omit `cursor`. If the response indicates that another page is available, use the following example for subsequent requests:

```bash
# Replace <YourAppToken> with the app token generated on your server
# Replace <cursor-from-previous-page> with data.pagination.cursor from the previous response
curl -X POST 'https://XXXX/api/server/v6/XXXX/XXXX/roaming/chat' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "username": "alice",
    "to": "bob",
    "limit": 20,
    "order": "down",
    "cursor": "<cursor-from-previous-page>",
    "startTimestamp": 1700000000000,
    "endTimestamp": 1700003600000
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The request body is a JSON object.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `username` | String | Yes | User ID whose roaming messages you want to query. This user determines message visibility; the query is not limited to messages sent by this user. |
| `to` | String | Yes | User ID of the other participant in the one-to-one conversation. |
| `limit` | Number | Yes | Number of messages to retrieve per page. The valid range is 1–20. |
| `order` | String | No | Query direction. Use lowercase values:<br/> - `up`: From oldest to newest, retrieving earlier messages first.<br/> - (Default) `down`: From newest to oldest, retrieving newer messages first. |
| `cursor` | String | No | Pagination cursor. Omit it in the first request. For subsequent requests, use the cursor returned in the previous response. See [Pagination](#pagination). |
| `startTimestamp` | Number | No | Start time of the query, expressed as a Unix timestamp in milliseconds. Only messages after this time are returned; the boundary is excluded. If omitted, no additional start-time condition is applied. |
| `endTimestamp` | Number | No | End time of the query, expressed as a Unix timestamp in milliseconds. Only messages before this time are returned; the boundary is excluded. If omitted, no additional end-time condition is applied. |

When using these parameters, note the following:

- `limit` is required. Omitting it causes the request to fail.
- If you specify both `startTimestamp` and `endTimestamp`, ensure that `startTimestamp` is less than `endTimestamp`.
- Omit optional parameters that you do not use. Do not set them to an empty string or `null`.

#### Pagination

1. For the first request, omit `cursor` and set `limit` to the number of messages per page. Set the time range or query direction if needed.
2. Read `data.pagination.finished` in the response. If it is `false`, pass `data.pagination.cursor` unchanged as `cursor` in the next request to continue querying.
3. When requesting subsequent pages, keep the request URL, `username`, `to`, `order`, `startTimestamp`, and `endTimestamp` unchanged.
4. When `data.pagination.finished` is `true`, stop the query.

Use the cursor returned by the server unchanged. Do not construct or parse it. Determine whether another page is available from `data.pagination.finished`, rather than only from the length of `data.list`.

#### Query behavior without a time range

If you provide the required parameters and set `"limit": 20` but omit `cursor`, `startTimestamp`, and `endTimestamp`, the query starts from the first page without an additional time-range restriction. The results depend on `order`:

- If you omit `order`, it defaults to `down` and retrieves **up to the 20 newest roaming messages** visible to the specified user in the current one-to-one conversation.
- If you set `"order": "up"`, it retrieves **up to the 20 oldest roaming messages** within the visible scope.

The query scope remains subject to the message retention period and the user's deletion or clearing records.

## Response example

The following text message examples show the message list and pagination information in the response.

- The query succeeds and another page is available:

```json
{
    "data": {
        "list": [
            {
                "msg_id": "1234567890123456789",
                "timestamp": 1700001800000,
                "chat_type": "chat",
                "payload": {
                    "from": "alice",
                    "to": "bob",
                    "bodies": [
                        {
                            "type": "txt",
                            "msg": "Hello"
                        }
                    ],
                    "ext": {
                        "businessId": "example"
                    }
                }
            }
        ],
        "pagination": {
            "finished": false,
            "cursor": "1234567890123456789"
        }
    }
}
```

- No messages match the query:

```json
{
    "data": {
        "list": [],
        "pagination": {
            "finished": true,
            "cursor": null
        }
    }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response message list and pagination information contain the following fields:

| Field | Type | Description |
| :--- | :--- | :--- |
| `data` | JSON | Data returned by this query. |
| `data.list` | Array | List of messages on this page. |
| `data.pagination` | JSON | Pagination information. |
| `data.pagination.finished` | Boolean | Whether the query is complete:<br/> - `true`: No next page is available.<br/> - `false`: Retrieve the next page. |
| `data.pagination.cursor` | String | Cursor required to query the next page. It is set to `null` when the query is complete and no longer needs to be used. |
| `data.list[].msg_id` | String | Message ID. |
| `data.list[].timestamp` | Number | Message timestamp in milliseconds. |
| `data.list[].chat_type` | String | Conversation type: `chat` for one-to-one chat and `groupchat` for group chat. |
| `data.list[].from` | String | Internal message routing information. You can ignore this field. Use `payload.from` to obtain the sender in your app. |
| `data.list[].to` | String | Internal message routing information. You can ignore this field. Use `payload.to` to obtain the recipient in your app. |
| `data.list[].meta_ext` | JSON | Message meta-extension information. |
| `data.list[].payload` | JSON | Message content. |
| `data.list[].payload.from` | String | User ID of the message sender. |
| `data.list[].payload.to` | String | Message recipient ID: the recipient user ID for one-to-one chat, or the chat group ID for group chat. |
| `data.list[].payload.bodies` | Array | List of message bodies. The fields differ by message type. |
| `data.list[].payload.bodies[].type` | String | Message type. For example, `txt` indicates a text message. |
| `data.list[].payload.bodies[].msg` | String | Text message content. Applies only to text messages. |
| `data.list[].payload.ext` | JSON | Custom extension information set when sending the message. |
| `data.list[].payload.type` | String | Message target type identifier. |
| `data.list[].payload.meta` | JSON | Message metadata. |

For the `payload.bodies` structure of each message type, see [Historical message content](message_historical.html#historical-message-content).

If no messages match the query, the message list is empty and the pagination information indicates that the query is complete. Even if a page has an empty message list, read the pagination information to decide whether to continue requesting pages.

If the returned HTTP status code is not `200`, the request has failed.

## Troubleshooting

#### FAQ

1. Can I still retrieve roaming messages from the original one-to-one conversation after deleting a friend?

Yes. Deleting a friend does not remove the roaming messages stored on the server. This API does not check whether the two participants are still friends. Removing only the friend relationship does not affect roaming message queries for the original conversation.

The results remain subject to the message retention period, the user's deletion or clearing records, and the request conditions. If your app also deletes or clears server-side roaming messages when deleting a friend, those messages can no longer be retrieved.

2. Must `username` and `to` be friends to retrieve one-to-one roaming messages?

No. This API does not check whether the participants are friends. The results depend on whether their conversation has roaming messages visible to `username`:

- **After deleting a friend**: Removing only the friend relationship does not affect the query. Retained roaming messages can still be retrieved.
- **The users are not friends but have chat history**: If the roaming messages are still stored on the IM server and visible to `username`, they can be retrieved, including messages sent by both participants.
- **The users are not friends and have no chat history**: If the server has no roaming messages for this conversation, a successful query returns an empty message list.

The results remain subject to the message retention period, the user's deletion or clearing records, and the request conditions. If your app also deletes or clears server-side roaming messages when deleting a friend, those messages can no longer be retrieved.

### Error code

If `error` in the response body is an object, read `error.code` and `error.message`. If it is a string, `error` indicates the error type and `error_description` provides the specific cause.

```json
{
    "meta": {
        "requestId": "18945493481988702",
        "timestamp": 1794549348260
    },
    "error": {
        "code": 4000005,
        "message": "Invalid request body format or missing required parameters"
    }
}
```

| HTTP status code | Error type | Error message | Possible causes | Recommended action |
| :--- | :--- | :--- | :--- | :--- |
| 400 | `4000005` | Invalid request body format or missing required parameters | `username` or `to` is missing, or the format of `order`, `limit`, or a timestamp is invalid. | Check the required fields, set `order` to `up` or `down`, and check the numeric parameters. |
| 401 | `4010103` | Authorization failed | The caller does not have administrative permission for the app specified in the request path. | Verify the organization and app in the request path and use an app token with the corresponding permission. |
| 403 | `4030201` | Feature not enabled | Message roaming is not enabled for the current app. | Contact the EasyIM business manager to confirm activation. |
| 500 | `Internal Server Error` | See `error_description` for the specific cause. | An exception without a dedicated handler occurred while the server was processing the request. | Retry later. If the issue persists, contact EasyIM technical support. |

For other errors, see [Response Status Codes](error.html).
