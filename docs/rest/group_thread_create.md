# Create a Message Thread

## Feature overview

- Chat group members create message threads from messages in the chat group. The source message becomes the parent message of the message thread.
- The message thread creator is the message thread owner.
- **By default, an app can have up to 100,000 message threads. To adjust this limit, contact the EasyIM business manager.**
- Before using this API, contact the EasyIM business manager to activate the message thread feature.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/thread
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST https://XXXX/XXXX/XXXX/thread   \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type:application/json'   \
-d '{
    "group_id": 179800091197441,
    "name": "1",
    "owner": "test4",
    "msg_id": 1234
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter       | Type   | Required | Description                               |
| :--------- | :----- | :------- | :--------------------------------- |
| `group_id` | String | Yes       | The chat group ID of the message thread.                |
| `name`     | String | Yes       | Message thread name. The maximum length is 64 characters. |
| `msg_id`   | String | Yes       | The parent message ID of the message thread.                  |
| `owner`    | String | Yes       | The owner of the message thread, that is, the chat group member who created the message thread. |

## Response example

```json
{
    "action": "post",
    "applicationName": "testapp",
    "duration": 4,
    "data": {
        "thread_id": "1XXXX7"
    },
    "organization": "XXXX",
    "timestamp": 1650869972109,
    "uri": "https://XXXX/XXXX/XXXX/thread"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field             | Type   | Description            |
| :--------------- | :----- | :-------------- |
| `data.thread_id` | String | Created message thread ID. |

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
| 400     | group_error | thread must on group message to create. | Message ID is not a group message. | Enter the correct group message ID. |
| 400     | group_error | thread name limit reached. | The message thread name is too long. | Use a message thread name of no more than 64 characters. |
| 400     | param_illegal | Failed to read HTTP message | The request body is invalid. | Check the request body. |
| 400     | group_error | msg not belong to app. | The message does not belong to the app. | Enter a valid message ID. |
| 400     | group_error | msg not belong to group . | The message does not belong to the group. | Enter a valid message ID. |
| 400     | group_error | thread not nested. | Creating a message thread on a message thread is not allowed. | Enter a valid message ID. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_error | thread number has reached limit. | The appKey has reached the message thread limit. | Delete unused message threads or contact the EasyIM business manager to adjust the limit. By default, an app can have up to 100,000 message threads. |
| 403     | group_error | user join thread reach limit. | The user has reached the limit on joined message threads. | Leave unused message threads or contact the EasyIM business manager to adjust the limit. By default, a user can join up to 100,000 message threads. |
| 403     | group_error | msg already create thread.not allow to create. | A message thread has already been created from the message. | Specify another message ID, or retrieve and join the existing message thread. |
| 403     | group_error | thread not open. | The message thread feature is not enabled. | Contact the EasyIM business manager to activate the message thread feature before calling this API. |
| 404     | group_error | user not in group. | The message thread owner is not in the chat group. | Specify the user ID of a chat group member. |
| 404     | group_error | msg not exist. | The message does not exist. | Enter an existing message ID. |
| 404     | group_error | group not found. | The chat group does not exist. | Check whether the chat group for the message thread exists. |

For other errors, see [Response status codes](error.html) for possible causes.
