# Bulk Add Users to a Message Thread

## Feature overview

- Add users to a specified message thread in bulk.
- Up to 10 users can join the message thread at a time.
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/thread/{thread_id}/users
```

| Parameter        | Type   | Required | Description      |
| :---------- | :----- | :------- | :-------- |
| `thread_id` | String | Yes       | ID of the message thread to which users are added. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST https://XXXX/XXXX/XXXX/thread/1XXXX7/users   \
-H 'Authorization: Bearer <YourAppToken>'  \
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

| Parameter        | Type | Required | Description                                                         |
| :---------- | :--- | :------- | :---------- |
| `usernames` | List | Yes       | List of user IDs added to the message thread. A maximum of 10 users can join the message thread at a time. |

## Response example

```json
{
  "action": "post",
  "applicationName": "testapp",
  "data": {
    "status": "ok"
  },
  "duration": 1069,
  "organization": "XXXX",
  "timestamp": 1650872649160,
  "uri": "https://XXXX/XXXX/XXXX/thread/1XXXX8/joined_thread"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field          | Type   | Description                          |
| :------------ | :----- | :---------------------------- |
| `data.status` | String | Addition result. `ok` indicates that the users were added successfully. |

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
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |
| 403     | group_error | user join thread reach limit. | The number of message threads added by the user has reached the upper limit. | Exit unused message threads or contact the EasyIM business manager to adjust the limit. |
| 404     | group_error | thread not found. | The message thread does not exist. | Specify a valid message thread ID. |

For other errors, see [Response status codes](error.html) for possible causes.
