# Recall a Message

## Feature overview

- Recall one successfully sent message at a time, including messages sent from a client or through the REST API.
- After you call this API, the message on the server, including the historical, offline, or roaming message, and the message in the memory and database of the sender and recipient are recalled.
- For attachment messages, including image, audio, video, and file messages, recalling the message also deletes the message attachment.
- Before recalling a message, obtain its message ID by calling the [Historical message API](https://doc.easemob.com/document/server-side/message_historical.html) or using a [message callback](https://doc.easemob.com/document/server-side/callback_overview.html).
- Use the `sync_device` parameter to specify whether to synchronize the recall of a one-to-one chat message to all online devices of the message sender.
- Recalling a message triggers a post-delivery callback. For details, see [Callback events](https://doc.easemob.com/document/server-side/callback_message_recall.html).
- If the recipient of a one-to-one chat, group chat, or chat room message is offline when the message is sent or recalled, the recipient is notified of the recall when they come online because the server sends an event notification to the client SDK.

#### Configure the recall period

By default, the sender can recall a message within 2 minutes after sending it. On the **Feature Configuration** > **Basic Features** > **Messages** page of the [Easemob Console](https://console.easemob.com/user/login), you can set a message recall period of up to 7 days.

#### Force recall

Force recall is supported, allowing you to recall expired messages.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/msg_recall
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -i -X POST "https://XXXX/XXXX/XXXX/messages/msg_recall"   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H "Authorization: Bearer <YourAppToken>"  \
-d '{
    "msg_id": "1028442084794698104",
    "to": "user2",
    "from": "user1",
    "chat_type": "chat",
    "force": true,
    "recallMessageExtensionInfo": "{\"type\": \"chat\"}"
}'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter    | Type   | Required | Description        |
| :---------- | :----- | :------- | :------------------ |
| `msg_id`    | String | Yes       | The message ID of the message to recall. Because you can recall only one message per request, pass only one message ID. |
| `to`        | String | Yes       | The recipient of the message to recall.<br/> - For a one-to-one chat, pass the recipient's user ID.<br/> - For a group chat, pass the chat group ID.<br/> - For a chat room, pass the chat room ID.<br/> The request fails if this parameter is not passed.        |
| `chat_type` | String | Yes       | The conversation type of the message to recall:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.<br/> - `chatroom`: Chat room.  |
| `from`      | String | No       | The user ID of the user recalling the message. If this parameter is not passed, it defaults to `admin`, indicating that the app admin recalls the message. |
| `sync_device`| Bool | No       | Whether to synchronize the recall of a one-to-one chat message to all online devices of the message sender:<br/> - (Default) `true`: Yes.<br/> - `false`: No.<Container type="tip" title="Tip">If `force` is set to `true` and the message has expired, set `from` to the message sender to synchronize the message recall to the sender.</Container>|
| `force`     | Bool   | Yes       | Whether to force recall the message.<br/> - `true`: Yes. You can recall the message whether or not it has expired. To recall an expired message, set `force` to `true`.<br/> - `false`: No. You can recall only messages that exist on the server and are within the recall period.  |
| `recallMessageExtensionInfo`    | String | No       | Extension information related to the message recall. |

## Response example

```json
{
  "path": "/messages/msg_recall",
  "uri": "https://XXXX/XXXX/XXXX/messages/msg_recall",
  "timestamp": 1657529588473,
  "organization": "XXXX",
  "application": "09ebbf8b-XXXX-XXXX-XXXX-d47c3b38e434",
  "action": "post",
  "data": {
    "recalled": "yes",
    "chattype": "chat",
    "from": "XXXX",
    "to": "XXXX",
    "msg_id": "1028442084794698104"
  },
  "duration": 8,
  "applicationName": "XXXX"
}
```

For example, if the message recall service is not enabled in the Easemob Console, the following response is returned:

```json
{
  "error": "forbidden_op",
  "exception": "EasemobForbiddenOpException",
  "timestamp": 1644402553845,
  "duration": 0,
  "error_description": "message recall service is unopened"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter       | Type   | Description             |
| :--------- | :----- | :-------------------------- |
| `msg_id`   | String | The message ID of the message to recall.      |
| `recalled` | String | The message recall result. `yes` indicates success.      |
| `from`     | String | The user ID of the user recalling the message.    |
| `to`       | String | The destination of the recalled message.<br/> - For a one-to-one chat, this is the destination user ID.<br/> - For a group chat, this is the chat group ID.<br/> - For a chat room, this is the chat room ID. |
| `chattype` | String | The conversation type of the recalled message:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.<br/> - `chatroom`: Chat room.     |

The other fields in the response body are described below:

| Field           | Type   | Description                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | The request path, which is part of the request URL. You do not need to pay attention to this field.       |
| `uri`             | String | The request URL.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `organization`    | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`. |
| `application`     | String | The unique identifier of the app in the system. The identifier is generated by the system. You do not need to pay attention to this field.                     |
| `action`          | String | The request method.                                                                     |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |
| `applicationName` | String | The app name you entered when creating the app in the Easemob Console. This value is the same as the request parameter `app_name`. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type               | Error message                  | Possible cause    | Recommendation      |
|:---------|:-------------------|:----------------------|:--------|:----------|
| 400      | message_recall_error | param msg_id can't be empty | The `msg_id` request parameter is an empty string. | Provide a valid `msg_id` request parameter. |
| 400      | message_recall_error | param to can't be empty | The `to` request parameter is an empty string.| Provide a valid `to` request parameter. |
| 400      | message_recall_error | param chat_type can't be empty | The `chat_type` request parameter is an empty string.| Provide a valid `chat_type` request parameter.  |
| 400      | message_recall_error | param force can't be empty | The `force` request parameter is empty. | Provide a valid `force` request parameter.  |
| 400      | message_recall_error | can't find msg to | The recipient of the message to recall cannot be found. | Pass the correct message recipient. |
| 403        | message_recall_error | exceed recall time limit | The message recall has timed out. | The default recall period is 2 minutes after the message is sent.  |
| 403      | message_recall_error | not_found msg | The message was deleted from the server because it expired, or it has already been recalled. | To recall an expired message, enable force recall by setting `force` to `true`. This recalls the message stored locally by the recipient, but the sender's local message remains.<br/>If the message has already been recalled, you do not need to recall it again.        |
| 403       | forbidden_op         | message recall service is unopened | The message recall service is not enabled in the Easemob Console.| Enable the service in the Easemob Console first. |
| 500      |                      | internal error | An exception occurred in the backend service. |      |

For other errors and their possible causes, see [Response status codes](error.html).
