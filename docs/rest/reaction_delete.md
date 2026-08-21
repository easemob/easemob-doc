# Delete a Reaction

A Reaction is an emoji response to an individual message in a one-to-one or group chat, enriching user interactions during chats.

## Feature overview

- Delete a Reaction added by the current user.
- Currently, **Reaction applies only to one-to-one chats and chat groups. Chat rooms do not support Reaction.**
- For detailed Reaction usage limits, see [Product usage limits](limitation.html).

## Feature activation

To use Reaction, activate it in the [EasyIM Console](https://console.easemob.com/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_message.html#message-reactions).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/reaction/user/{userId}?msgId={msgId}&message={message}
```

| Parameter      | Type   | Required | Description                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `userId`  | String | Yes       | User ID of the current user. |
| `msgId`   | String | Yes       | Message ID.                                                      |
| `message` | String | Yes       | Emoji ID. The length cannot exceed 128 characters. The value must be consistent with the client. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -g -X DELETE 'https://localhost:8089/easemob-demo/easeim/reaction/user/wz?msgId=997625372793113144&message=emoji_40'    \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                | Type   | Description                                      |
| :------------------ | :----- | :---------------------------------------- |
| `requestStatusCode` | String | Operation result. `ok` indicates that the Reaction was deleted successfully.    |
| `timestamp`         | Long   | Request response time as a Unix timestamp in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause                     | Recommendation        |
| :----------- | :--- | :------------- |:-------------------------|:------------|
| 400     | Bad Request   | the user operation is illegal!        | The specified user ID has not operated on the Reaction. | Specify the correct user ID. |
| 400      | Bad Request  | this appKey is not open reaction service!   | The Reaction service is not activated. | Activate the Reaction service in the EasyIM Console. |

For other errors, see [Response status codes](error.html) for possible causes.
