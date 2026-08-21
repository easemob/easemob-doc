# Retrieve the Message Thread Member List

## Feature overview

- Retrieve the member list of the specified message thread.
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/thread/{thread_id}/users?limit={N}&cursor={cursor}
```

| Parameter     | Type   | Required | Description           |
| :------- | :----- | :------- | :-------------------------- |
| `thread_id` | String | Yes       | Message thread ID. |
| `limit`  | Int    | No       | Number of message thread members to return per page. The value range is [1,50], and the default is `50`. |
| `cursor` | String | No       | Cursor that specifies where to start the query. |

For descriptions of other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET https://XXXX/XXXX/XXXX/thread/1XXXX7/users   \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Request body fields

## Response example

```json
{
  "action": "get",
  "data": {
    "affiliations": ["test4"]
  },
  "duration": 4,
  "properties": {
    "cursor": "ZGNXXXXyMA"
  },
  "timestamp": 1650872048366,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                | Type   | Description                               |
| :------------------ | :----- | :--------------------------------- |
| `affiliations`      | Array  | User IDs of the message thread members. |

The other fields are described below:

| Field          | Type | Description                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `properties.cursor` | String | Query cursor, specify the starting position of the next query. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | The value of the paging parameter `limit` is too large. | Check whether the query parameter `limit` is within the value range.  |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |
| 404     | group_error | thread not found. | The message thread does not exist. | Specify a valid message thread ID. |

For other errors, see [Response status codes](error.html) for possible causes.
