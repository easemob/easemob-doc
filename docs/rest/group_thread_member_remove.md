# Remove Message Thread Members in Batches

## Feature overview

- Remove message thread members in batches.
- You can remove up to 10 message thread members at a time.
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

| Parameter        | Type   | Required | Description      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | Yes       | Message thread ID. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X DELETE https://XXXX/XXXX/XXXX/thread/1XXXX7/users \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "usernames": [
        "test2",
        "test3"
      ]
    }'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter        | Type | Required | Description                                                       |
| :---------- | :--- | :------- | :--------------------------------------------------------- |
| `usernames` | List | Yes       | User IDs of the message thread members to remove. You can specify up to 10 user IDs at a time. |

## Response example

```json
{
  "action": "delete",
  "applicationName": "testy",
  "duration": 12412,
  "entities": [
    {
      "result": false,
      "user": "test2"
    },
    {
      "result": false,
      "user": "test6"
    }
  ],
  "organization": "XXXX",
  "timestamp": 1650874050419,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/users"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type   | Description                                                    |
| :------- | :----- | :------------------------------------------------------ |
| `entities`       | JSON Array | The response data.                          |
| - `result` | Bool   | Whether the member was removed successfully: <br/> - `true`: The member was removed; <br/> - `false`: The member was not removed. |
| - `user`   | String | The user ID removed from the message thread. |

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
| 400     | group_error | request body reaches limit. | More than 10 user IDs were specified in `usernames`. | Check `usernames` and specify no more than 10 user IDs. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | group_error | thread not found. | The message thread does not exist. | Specify a valid message thread ID. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |

For other errors, see [Response status codes](error.html) for possible causes.
