# Retrieve the Message Threads a User Has Joined in a Chat Group

## Feature overview

- Retrieve all message threads a user has joined in the specified chat group.
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/threads/chatgroups/{group_id}/user/{username}?limit={limit}&cursor={cursor}&sort={sort}
```

| Parameter     | Type   | Required | Description           |
| :------- | :----- | :------- | :---------------- |
| `group_id` | String | Yes       | ID of the chat group in which to retrieve the user's joined message threads. |
| `username` | String | Yes       | User ID whose joined message threads to retrieve. |
| `limit`  | Int    | No       | Number of message threads to return per page. The value range is [1,50], and the default is `50`. |
| `cursor` | String | No       | Cursor that specifies where to start the query. |
| `sort`   | String | No       | Sort order: <br/> - `asc`: Ascending by the time the user joined the message thread; <br/> - (Default) `desc`: Descending by the time the user joined the message thread. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET https://XXXX/XXXX/XXXX/threads/chatgroups/XXXX/user/XXXX   \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 4,
  "entities": [
    {
      "name": "1",
      "owner": "test4",
      "id": "17XXXX69",
      "msgId": "1920",
      "groupId": "17XXXX61",
      "created": 1650856033420
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXNzg"
  },
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/threads/user/test4"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields.

On the last page, the response still returns `cursor`, and the number of message threads is less than the requested `limit`. If a response returns no message thread data, all message threads in the chat group have been retrieved.

| Field                | Type   | Description                                    | 
| :------------------ | :----- | :-------------------------------------- |
| `entities`       | JSON Array | The response data.                          |
| - `name`     | String | Message thread name.                              |
| - `owner`    | String | Creator of the message thread.                          |
| - `id`       | String | Message thread ID.                               |
| - `msgId`    | String | The parent message ID of the message thread.                       |
| - `groupId`  | String | ID of the chat group to which the message thread belongs. |
| - `created`  | Long   | Message thread creation time as a Unix timestamp in milliseconds. |
| - `cursor` | String | Query cursor, specify the starting position of the next query.      |

The other fields are described below:

| Field          | Type | Description                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `properties.cursor` | String | Query cursor, specify the starting position of the next query. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |


## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | The value of the paging parameter `limit` is too large. | Check whether the query parameter `limit` is within the value range ([1,50]).  |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |

For other errors, see [Response status codes](error.html) for possible causes.
