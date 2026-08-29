# Recall Messages in Batches

## Feature overview

- Recall multiple successfully sent messages at a time, including messages sent from a client or through the REST API. **You can recall up to 30 messages per request.** 
- After you call this API, the messages on the server, including historical, offline, or roaming messages, and the messages in the memory and database of the senders and recipients are recalled.
- For attachment messages, including image, audio, video, and file messages, recalling the messages also deletes the message attachments.
- Before recalling messages, obtain their message IDs by calling the [Historical message API](message_historical.html) or using a [message webhook](callback_overview.html).
- Use the `sync_device` parameter to specify whether to synchronize the recall of a one-to-one chat message to all online devices of the message sender.
- Recalling messages triggers a post-delivery callback. For details, see [Webhook events](callback_message_recall.html).
- If the recipient of a one-to-one chat, group chat, or chat room message is offline when the message is sent or recalled, the recipient is notified of the recall when they come online because the server sends an event notification to the client SDK.

#### Configure the recall period

By default, the sender can recall a message within 2 minutes after sending it. You can set the message recall period, up to 7 days, on the **Chat** > **Features > Message & Conversation** page of the [EasyIM Console](https://console.easyim.ai/user/login).

#### Force recall

Force recall is supported, allowing you to recall expired messages.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/batch_recall
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the app token generated on your server

curl -X POST --location "https://XXXX/XXXX/XXXX/messages/batch_recall" \
-H 'Authorization: Bearer <YourAppToken>'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-d '{
  "msgs": [
   {
    "msg_id": "7126XXXX2581", 
    "to": "d95XXXX81c64",      
    "from": "18XXXXebf262",   
    "chat_type": "chatroom",
    "force": false,
    "sync_device": false
    },
    {
    "msg_id": "10436XXXX4564398104",
    "to": "d9571XXXXc64",
    "from": "18e4XXXXf262",
    "chat_type": "chat",
    "force": false,
    "sync_device": false
    }
  ]
}'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter    | Type   | Required | Description        |
| :---------- | :----- | :------- | :------------------ |
| `msgs`    | JSON Array | Yes       | The details of the messages to recall. You can recall up to 30 messages in a single request. |
| - `msg_id`    | String | Yes       | The message ID of the message to recall.|
| - `to`        | String | Yes       | The recipient of the message to recall.<br/> - For a one-to-one chat, pass the recipient's user ID.<br/> - For a group chat, pass the chat group ID.<br/> - For a chat room, pass the chat room ID.<br/> The request fails if this parameter is not passed.        |
| - `from`      | String | No       | The user ID of the user recalling the message. If this parameter is not passed, it defaults to `admin`.    |
| - `chat_type` | String | Yes       | The conversation type of the message to recall:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.<br/> - `chatroom`: Chat room.  |
| - `sync_device`| Bool | No       | Whether to synchronize the recall of a one-to-one chat message to all online devices of the message sender:<br/> - (Default) `true`: Yes.<br/> - `false`: No.<Container type="tip" title="Tip">If `force` is set to `true` and the message has expired, set `from` to the message sender to synchronize the message recall to the sender.</Container>|
| - `force`     | Bool   | Yes       | Whether to force recall the message.<br/> - `true`: Yes. You can recall the message whether or not it has expired. To recall an expired message, set `force` to `true`.<br/> - `false`: No. You can recall only messages that exist on the server and are within the recall period.  |
| `recallMessageExtensionInfo`    | String | No       | Extension information related to the message recall. |

## Response example

```json
{
  "path": "/messages/batch_recall",
  "uri": "https://XXXX/XXXX/XXXX/messages/batch_recall",
  "timestamp": 1657529588473,
  "organization": "XXXX",
  "application": "09ebbf8b-XXXX-XXXX-XXXX-d47c3b38e434",
  "action": "post",
  "data": [
    {
      "recalled": "yes",
      "chattype": "chat",
      "from": "XXXX",
      "to": "XXXX",
      "msg_id": "1028442XXXX94698104"
    },
    {
      "recalled": "yes",
      "chattype": "chat",
      "from": "XXXX",
      "to": "XXXX",
      "msg_id": "104367XXXX564398104"
    }
  ], 
  "duration": 8,
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body contains the following fields:

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
| `applicationName` | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

For details, see [Recall a message](message_recall_single.html#error-code).
