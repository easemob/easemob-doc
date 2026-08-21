# Delete a Message Thread

## Feature overview

- Delete a single message thread.
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/thread/{thread_id}
```

| Parameter        | Type   | Required | Description      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | Yes       | The ID of the message thread to be deleted. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X DELETE https://XXXX/XXXX/XXXX/thread/1XXXX7   \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "delete",
  "applicationName": "testapp",
  "duration": 4,
  "data": {
    "status": "ok"
  },
  "organization": "XXXX",
  "timestamp": 1650869972109,
  "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field          | Type   | Description                          |
| :------------ | :----- | :---------------------------- |
| `data.status` | String | Deletion result, `ok` indicates successful deletion. |

The other fields are described below:

| Field          | Type | Description                                                                              |
| :------------ | :--- | :-------------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |
| 404     | group_error | thread not found. | The message thread does not exist. | Enter the correct message thread ID.|

For other errors, see [Response status codes](error.html) for possible causes.
