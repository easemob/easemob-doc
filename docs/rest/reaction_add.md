# Add a Reaction

A Reaction is an emoji response to an individual message in a one-to-one or group chat, enriching user interactions during chats.

## Feature overview

- Add a Reaction to an individual message in a one-to-one or group chat.
- Currently, **Reaction applies only to one-to-one chats and chat groups. Chat rooms do not support Reaction.**
- Adding a Reaction triggers a post-delivery callback. For details, see [Post-delivery webhook events](callback_group_room_create.html).
- For detailed Reaction usage limits, see [Product usage limits](limitation.html).

## Feature activation

To use Reaction, activate it in the [Easemob Console](https://console.easemob.com/user/login). For detailed steps, see the [Easemob Console documentation](/product/console/basic_message.html#message-reactions).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/reaction/user/{userId}
```

| Parameter     | Type   | Required | Description                      |
| :------- | :----- | :------- | :------------------------ |
| `userId` | String | Yes       | ID of the user who adds the Reaction. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -g -X POST 'https://localhost:8089/easemob-demo/easeim/reaction/user/e1'    \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type: application/json'   \
-d '{
    "msgId":"997625372793113144",
    "message":"emoji_40"
}'
```

## Request header fields

For details about the `Content-Type` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter      | Type   | Required<div style="width: 80px;"></div> | Description     |
| :-------- | :----- | :--------------------------------------- | :-------------- |
| `msgId`   | String | Yes                                       | Message ID. |
| `message` | String | Yes                                       | Emoji ID. The length cannot exceed 128 characters, and the value must be consistent with the client setting. There is no restriction on the supported character set. If special characters are used, URL-encode them when retrieving and deleting the Reaction. |

## Response example

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645774821181,
  "data": {
    "id": "946481033434607420",
    "msgId": "msg3333",
    "msgType": "chat",
    "groupId": null,
    "reaction": "emoji_40",
    "createdAt": "2022-02-24T10:57:43.138934Z",
    "updatedAt": "2022-02-24T10:57:43.138939Z"
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                | Type    | Description                                                                                              |
| :------------------ | :------ | :------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String  | Operation result. `ok` indicates that the Reaction was added successfully.                                                      |
| `timestamp`         | Long    | Request response time as a Unix timestamp in milliseconds.                                                         |
| `data`              | JSON    | Details of the added Reaction.                                                                          |
| `data.id`           | String  | Reaction ID.                                                                                     |
| `data.msgId`        | String  | ID of the message to which the Reaction was added.                                                                         |
| `data.msgType`      | String  | Message conversation type:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.                                 |
| `data.groupId`      | String  | Chat group ID. This parameter is null for a one-to-one chat.                                                                  |
| `data.reaction`     | String  | Emoji ID, consistent with the client. This value is the same as the `message` request parameter of the [Add a Reaction API](#add-a-reaction). |
| `data.createAt`     | Instant | Time when the Reaction was added.                                                                            |
| `data.updateAt`     | Instant | Time when the Reaction was modified.                                                                             |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type    | Error message      | Possible cause      | Recommendation        |
|:---------|:--------------------|:-----------|:----------|:------------|
| 400      | Bad Request         | this appKey is not open reaction service!   | Reaction is not activated. | Activate the Reaction service in the Easemob Console. |
| 400      | Bad Request         | The quantity has exceeded the limit!  | The number of Reactions on a message has reached the limit.| By default, you can add 20 Reactions to each message. To increase this limit, contact the Easemob business team.|
| 400      | Bad Request                | the user operation is illegal!                      | The user is not a participant in the conversation. | Only conversation participants can operate on Reactions.       |
| 400      | Bad Request                | the user is already operation this message                      | The same user added the same Reaction more than once. | A user cannot add the same Reaction more than once.     |

For other errors, see [Response status codes](error.html) for possible causes.
