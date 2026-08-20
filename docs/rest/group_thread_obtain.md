# Retrieve Message Threads in an App

## Feature overview

- Retrieve the list of message threads in an app by page.
- By default, an app can have up to 100,000 message threads. To adjust this limit, contact the Easemob business team.
- Before using this API, contact the Easemob business team to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/thread?limit={limit}&cursor={cursor}&sort={sort}
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

The query parameters are described below:

| Parameter     | Type   | Required | Description                 |
| :------- | :----- | :------- | :---------------------- |
| `limit`  | Int    | No       | Number of message threads to return per page. The value range is [1,50], and the default is `50`. |
| `cursor` | String | No       | Cursor that specifies where to start the query. |
| `sort`   | String | No       | Sort order: <br/> - `asc`: Ascending by message thread creation time; <br/> - (Default) `desc`: Descending by message thread creation time. |

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET https://XXXX/XXXX/XXXX/thread   \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "applicationName": "testapp",
  "duration": 7,
  "entities": [
    {
      "id": "1XXXX8"
    }
  ],
  "organization": "XXXX",
  "properties": {
    "cursor": "ZGXXXXTE"
  },
  "timestamp": 1650869750247,
  "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Field                | Type   | Description                               |
| :------------------ | :----- | :--------------------------------- |
| `entities`       | JSON Array | The response data.                          |
| - `id`       | String | Message thread ID.                          |

The other fields are described below:

| Field          | Type | Description                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `applicationName` | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `properties.cursor` | String | Query cursor, specify the starting position of the next query. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | group_error | query param reaches limit. | The value of the paging parameter `limit` is too large.   | Check whether the query parameter `limit` is within the value range ([1,50]).   |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the Easemob business team to activate the message thread feature before calling this API. |

For other errors, see [Response status codes](error.html) for possible causes.
