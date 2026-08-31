# Send Chat Room Messages

## Feature overview

EasyIM supports sending text, image, voice, video, file, location, command, custom, and targeted messages from the server to chat room conversations. Targeted messages are sent only to specified members rather than all members.

### Basic sending method

In chat rooms, all message types use the same RESTful API. The main difference between message types is the structure of the `body` field in the request body.

- Text, location, command, and custom messages: Construct the message body directly and call the sending API.
- Image, voice, video, and file messages: To send an attachment message, you cannot directly use the original attachment URL from your business system. First call the [file upload](message_upload_file.html) API to upload the attachment, and then construct the message body with the returned attachment URL and related fields.

### Attachment message sending workflow

The sending process for attachment messages, such as image, voice, video, and file messages, is shown below:

![img](/images/server-side/message_send_room_attachment.png)

The steps are described below:

1. First, call the [file upload](message_upload_file.html) API to upload the attachment to the EasyIM file service.
2. Obtain the information required to send a chat room attachment message from the upload result, such as the file URL, `file_uuid`, and `share-secret`.
3. Call the [send chat room messages](message_chatroom.html) API and reference the uploaded attachment URL and related fields in the message body.
4. If needed, set chat-room-specific parameters, such as message priority.
5. If `restrict-access` was set to `true` during upload, subsequent downloads of the original file or thumbnail must include the returned `share-secret`. If restricted access was not enabled, the file can be downloaded directly.
6. To download the original attachment later, call the [download file](message_download_file.html) API and use `GET /chatfiles/{file_uuid}` to download the original file.
7. To download the thumbnail later, call the [download file thumbnail](message_download_thumbnail.html) API, use the same download URL, and pass `thumbnail: true`.

### Limitations and validation

- The combined length of the request body and extension fields cannot exceed 5 KB. For other message limitations, see [Message limitations](/product/limitation.html#message-size).
- This API does not validate the specified sender user ID or recipient chat room ID. Even if either ID does not exist, the server does not return an error and sends the message as usual.
- This API does not check whether the recipient is on the blocklist or whether the sender is muted.

### Sending behavior and related notes

- Messages sent in a chat room are not synchronized to the sender.
- Messages sent through the RESTful API are not written to the conversation list by default. To write them to the conversation list, [activate this feature in the EasyIM Console](/product/console/basic_message_conversation.html#add-messages-sent-through-rest-apis-to-the-conversation-list).
- Calling this API triggers a post-delivery callback event. For details, see [Webhook events](callback_message_send.html#send-chat-group-messages).
- You can use common optional message parameters to specify which users cannot retrieve the message when fetching roaming messages and to add extension parameters. For details, see [Common optional message parameters](#common-optional-message-parameters).
<!--
- [The content moderation service checks specific fields in the message `body`; the fields checked vary by message type](/value-added/moderation/moderation_mechanism.html). Passing too much business information in these fields may reduce moderation effectiveness. Avoid placing business information in fields subject to moderation and use the `ext` extension field instead.
-->

### Chat room message priority

EasyIM provides message prioritization for chat room messages, with high, normal, and low priorities. High-priority messages are delivered first. When creating a message, you can assign high priority to a specified message type or messages from specified members so that these messages are delivered first. When chat room concurrency or the sending frequency is high, the server discards low-priority messages first and reserves resources for high-priority messages. This improves the reliability of important messages such as rewards and announcements. This feature does not guarantee delivery of high-priority messages. When chat room message concurrency is excessive, even high-priority messages may be discarded to maintain smooth real-time interaction.

### Chat room message discard logic

By default, sending more than 20 messages per second to a single chat room triggers message discarding. Low-priority messages are discarded first, while high-priority messages are retained. If more than 20 prioritized messages are sent per second, messages are processed in sending order and later messages are discarded.

## Call frequency limit

For a single app, this RESTful API has the following three limits:

<table>
<tbody>
<tr>
<td width="110">
<p><strong>Limit</strong></p>
</td>
<td>
<p><strong>Description</strong></p>
</td>
<td>
<p><strong>Limit exceeded error</strong></p>
</td>
<td>
<p><strong>Adjustable</strong></p>
</td>
</tr>
<tr>
<td>
<p>100 calls/second</p>
</td>
<td>
<p>Up to 100 calls per second.</p>
</td>
<td>
<p>The 101st call returns the 429 error &ldquo;This request has reached api limit&rdquo;.</p>
</td>
<td rowspan="2">
<p>Both limits are <strong>adjustable</strong>. Increasing one automatically increases the other proportionally.</p>
<p>For example, increasing the limit from 100 to 200 calls/second automatically increases the sending limit to 200 messages/second. Conversely, increasing the limit from 100 to 200 messages/second automatically increases the call limit to 200 calls/second.</p>
</td>
</tr>
<tr>
<td>
<p>100 messages/second</p>
</td>
<td>
<p>Up to 100 messages can be sent per second.</p>
</td>
<td>
<p>For example, if each call sends a message to 10 chat rooms, it counts as 10 messages and you can call the API up to 10 times per second. The 11th call returns the 403 error " message send reach limit".</p>
</td>
</tr>
<tr>
<td>
<p>10 chat rooms/call</p>
</td>
<td>
For example, if each call sends a message to 10 chat rooms, it counts as 10 messages.
</td>
<td>
<p>Exceeding the limit returns the 400 error "param to exceed limit".</p>
</td>
<td>
<p>No</p>
</td>
</tr>
</tbody>
</table>

## Send messages to all chat room members

### Send text messages

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "txt",
  "body": {
    "msg": "testmessages"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

The following table describes the common request body for all message types. It is a JSON object that forms the outer structure of every message. As with one-to-one messages, only the content of `body` differs by message type.

:::tip
The parameters in the common request body for chat room messages are similar to those for [one-to-one messages](message_single.html). The differences are that `to` is an array of recipient chat room IDs and `chatroom_msg_level` sets message priority.<br/>
:::

| Parameter | Type | Required | Description |
| :-------------- | :----- | :------- | :--------------- |
| `from`          | String | No       | User ID of the message sender. If this field is omitted, the server sets it to `admin` by default.<Container type="tip" title="Note">1. The server does not validate whether the specified user ID exists. If the user ID does not exist, the server does not return an error and sends the message as usual.<br/>2. If the field is included but its value is an empty string (“”), the request fails.</Container>   |
| `to`            | Array   | Yes       | Array of recipient chat room IDs. Each call can send messages to up to 10 chat rooms.<Container type="tip" title="Note">The server does not validate whether a specified chat room ID exists. If the ID does not exist, the server does not return an error and sends the message as usual.</Container> |
| `type`          | String | Yes       | Message type:<br/> - `txt`: Text message.<br/> - `img`: Image message.<br/> - `audio`: Voice message.<br/> - `video`: Video message.<br/> - `file`: File message.<br/> - `loc`: Location message.<br/> - `cmd`: Command message.<br/> - `custom`: Custom message.    |
| `body`          | JSON   | Yes       | Message content. The fields in `body` are described below.       |

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :---- | :----- | :------- | :--------- |
| `msg` | String | Yes       | Message content. |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

Example response for a successful message send:

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

Example response for a failed message send:

```json
{
    "error": "message_send_error",
    "exception": "MessageSendException",
    "timestamp": 1748574587817,
    "duration": 0,
    "error_code": 14007,
    "error_description": "message is too large"
}
```


#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send image messages

Before sending an image message, call the [file upload](message_upload_file.html) API to upload the image file. `body.url` must be the EasyIM file URL returned after upload, not the original image URL from your business system.

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "img",
  "body": {
    "filename":"testimg.jpg",
    "secret":"VfXXXXNb_",
    "url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252",
    "size":{
      "width":480,
      "height":720
    }
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :--------- | :----- | :------- | :------- |
| `filename` | String | No       | Image name. We recommend including this parameter; otherwise, the client cannot display the image name when it receives the image message.           |
| `secret`   | String | No       | Image access key, which is the `share-secret` obtained from the response body of [file upload](message_upload_file.html) after the image is uploaded successfully. This field is required if file access restrictions (`restrict-access`) were set during upload. |
| `size`     | JSON   | No       | Image dimensions in pixels, including:<br/> - `height`: Image height.<br/> - `width`: Image width. |
| `url`      | String | Yes       | Image URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`. `file_uuid` is the file ID and is obtained from the response body of [file upload](message_upload_file.html) after the image is uploaded successfully.  |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send voice messages

Before sending a voice message, call the [file upload](message_upload_file.html) API to upload the voice file. `body.url` must be the EasyIM file URL returned after upload, not the original voice file URL from your business system.

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "audio",
  "body": {
    "url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42",
    "filename": "testaudio.amr",
    "length": 10,
    "secret": "HfXXXXCjM"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :--------- | :----- | :------- | :---------- |
| `filename` | String | No       | Voice filename. We recommend including this parameter; otherwise, the client cannot display the voice filename when it receives the voice message. |
| `secret`   | String | No       | Voice file access key, which is the `share-secret` obtained from the response body of [file upload](message_upload_file.html) after the voice file is uploaded successfully. This field is required if file access restrictions (`restrict-access`) were set during upload. |
| `Length`   | Int    | No      | Voice message duration in seconds.         |
| `url`      | String | Yes       | Voice file URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`. `file_uuid` is the file ID and is obtained from the response body of [file upload](message_upload_file.html) after the voice file is uploaded successfully.  |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send video messages

Before sending a video message, call the [file upload](message_upload_file.html) API to upload the video file. `body.url` must be the EasyIM file URL returned after upload, not the original video URL from your business system.

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "video",
  "body": {
    "thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
    "length" : 0,"secret":"VfXXXXNb_",
    "file_length" : 58103,
    "thumb_secret" : "ZyXXXX2I",
    "url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :------------- | :----- | :------- | :---------------- |
| `filename` | String | No | Video filename. We recommend including this parameter; otherwise, the client cannot display the video filename when it receives the video message.|
| `thumb`        | String | No       | Video thumbnail URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`. `file_uuid` is the unique identifier of the video thumbnail and is obtained from the response body of [file upload](message_upload_file.html) after the thumbnail is uploaded successfully. |
| `length`       | Int    | No       | Video duration in seconds. |
| `secret`       | String | No       | Video file access key, which is the `share-secret` obtained from the response body of [file upload](message_upload_file.html) after the video is uploaded successfully. This field is required if file access restrictions (`restrict-access`) were set during upload. |
| `file_length`  | Long   | No       | Video file size in bytes.  |
| `thumb_secret` | String | No       | Video thumbnail access key, which is the `share-secret` obtained from the response body of [file upload](message_upload_file.html) after the thumbnail is uploaded successfully. This field is required if file access restrictions (`restrict-access`) were set during upload. |
| `url`          | String | Yes       | Video file URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`. `file_uuid` is the file ID and is obtained from the response body of [file upload](message_upload_file.html) after the video is uploaded successfully. |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send file messages

Before sending a file message, call the [file upload](message_upload_file.html) API to upload the file. `body.url` must be the EasyIM file URL returned after upload, not the original file URL from your business system.

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "file",
  "body": {
    "filename":"test.txt",
    "secret":"1-g0XXXXua",
    "url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :--------- | :----- | :------- | :------------ |
| `filename` | String | No      | Filename. We recommend including this parameter; otherwise, the client cannot display the filename when it receives the file message.   |
| `secret`   | String | No       | File access key, which is the `share-secret` obtained from the response body of [file upload](message_upload_file.html) after the file is uploaded successfully. This field is required if file access restrictions (`restrict-access`) were set during upload. |
| `url`      | String | Yes       | File URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`. `file_uuid` is the file ID and is obtained from the response body of [file upload](message_upload_file.html) after the video file is uploaded successfully. |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send location messages

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms"  \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "loc",
  "body":{
    "lat": "39.966",
    "lng":"116.322",
    "addr":"中国北京市海淀区中关村"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :----- | :----- | :------- | :--------------------- |
| `lat`  | String | Yes       | Latitude of the location in degrees. |
| `lng`  | String | Yes       | Longitude of the location in degrees. |
| `addr` | String | Yes       | Text description of the location. |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send command messages

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \ 
-H "Authorization:Bearer <YourAppToken>" \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "cmd",
  "body":{
    "action":"action1"
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :------- | :----- | :------- | :--------- |
| `action` | String | Yes       | Command content. |

#### Common optional message parameters

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

### Send custom messages

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

```bash
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST -i "https://XXXX/XXXX/XXXX/messages/chatrooms" \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H "Authorization:Bearer <YourAppToken>" \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "custom",
  "body": {
    "customEvent": "custom_event",
    "customExts":{
            "ext_key1":"ext_value1"
        }
  }
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

For the common request body, see [Send text messages](#send-text-messages).

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :------------ | :----- | :------- | :-------------------------------- |
| `customEvent` | String | No       | User-defined event type. The value must match the regular expression `[a-zA-Z0-9-_/\.]{1,32}` and contain 1-32 characters. |
| `customExts`  | JSON   | No       | User-defined event attributes. The type must be `Map<String,String>`, with up to 16 elements. `customExts` is optional and can be omitted. |

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Send targeted messages

You can send a message to one or more specified members of a chat room, but each call can send a targeted message to only **20 users** in **one chat room**. Only specified recipients can see a targeted message; other chat room members cannot.

:::tip
1. Targeted messages are not written to the conversation list or included in the unread message count of the chat room conversation.
2. Roaming for targeted chat room messages is disabled by default. Before use, contact the business manager to activate chat room message roaming and targeted message roaming.
:::

#### Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms/users
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

#### Request example

The following request example sends a targeted text message in a chat group:

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms/users' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "txt",
  "body": {
    "msg": "testmessages"
  },
  "users": ["user2", "user3"]
}'
```

#### Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

#### Request body fields

The following table describes the common request body for all message types. It is a JSON object that forms the outer structure of every message. Only the content of `body` differs by message type.

| Parameter | Type | Required | Description |
| :-------------- | :----- | :------- | :--------------- |
| `from`          | String | No       | User ID of the message sender. If this field is omitted, the server sets it to the admin, “admin”, by default. If the field is included but its value is an empty string (“”), the request fails.  |
| `to`            | Array   | Yes       | ID of the recipient chat room. You can specify up to 1 chat room ID per request. |
| `chatroom_msg_level` | String | No       | Chat room message priority:<br/> - `high`: High.<br/> - (Default) `normal`: Normal.<br/> - `low`: Low. |
| `type`          | String | Yes       | Message type:<br/> - `txt`: Text message.<br/> - `img`: Image message.<br/> - `audio`: Voice message.<br/> - `video`: Video message.<br/> - `file`: File message.<br/> - `loc`: Location message.<br/> - `cmd`: Command message.<br/> - `custom`: Custom message.    |
| `body`          | JSON   | Yes       | Message content. The fields in `body` are described below.       |
| `ext`           | JSON   | No       | Messages support extension fields for adding custom information. This parameter cannot be `null`. Push notifications also support custom extension fields. For details, see [APNs custom display](/sdk/v5/ios/push/push_display_field.md) and [Android push fields](/sdk/v5/android/push/push_display_field.html). |
| `users` | Array | Yes       | Array of user IDs of chat room members who receive the message. You can specify up to 20 user IDs per request. |

The fields in `body` in the request body are described below.

| Parameter | Type   | Required | Description |
| :---- | :----- | :------- | :--------- |
| `msg` | String | Yes       | Message content. |

For other message types, see the `body` field descriptions in the request bodies for the corresponding ordinary group message types.

In addition to the required and standard fields above, you can pass optional parameters for roaming visibility, message priority, and extension information. For details, see [Common optional message parameters](#common-optional-message-parameters).

#### Response example

```json
{
  "path": "/messages/chatrooms",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms",
  "timestamp": 1657254052191,
  "organization": "XXXX",
  "application": "e82bcc5f-XXXX-XXXX-a7c1-92de917ea2b0",
  "action": "post",
  "data": {
    "185145305923585": "1029545553039460728"
  },
  "duration": 0,
  "applicationName": "XXXX"
}
```

#### Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data` | JSON | Response data details. The value is a key-value pair containing the chat room ID and the ID of the sent message.<br/>For example, "185145305923585": "1029545553039460728" indicates that message ID 1029545553039460728 was sent in chat room 184524748161025. |

The other fields in the response body are described below:

| Field | Type | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

1. When you use the chat room messaging API to send any message type, an HTTP status code other than `200` indicates that the request failed. One of the following error codes may be returned:

| HTTP status code | Error type  | Error message      | Possible cause             | Recommendation    |
|:---------|:-----------|:-----------------|:-----------------|:---------|
| 400      | invalid_request_body  | Request body is invalid. Please check body is correct. | The request body is incorrectly formatted.| Check whether the request body is valid, including the field types.|
| 400      | message_send_error | param from can't be empty  | The `from` request parameter is an empty string.| Enter a valid `from` request parameter. If this field is omitted, the server sets it to `admin` by default. |
| 400      | message_send_error | param to can't be empty  | The `to` request parameter is an empty array. | Enter a valid `to` request parameter.|
| 400      | message_send_error | param type can't be empty  | The `type` request parameter is an empty string. | Enter a valid `type` request parameter.|
| 400      | message_send_error | param body can't be empty  | The `body` request parameter is an empty JSON object. | Enter a valid `body` request parameter.|
| 400      | message_send_error | param ext must be JSONObject   | The `ext` request parameter has an incorrect type.| Enter a valid `ext` request parameter in JSON format. |
| 400      | message_send_error | params to's size can't exceed limit 10 | The number of entries in the `to` request parameter exceeds the maximum of 10 chat room IDs. | Enter a valid `to` request parameter with no more than 10 chat room IDs. |
| 400      | message_send_error | message is too large | The content of the `body` and `ext` fields in the request body is too large. | Limit the content of `body` and `ext` to 5 KB. |
| 403      | message_send_error | message send reach limit  | The API call frequency exceeds the limit. | Reduce the API call frequency. For details, see [this document](message_chatroom.html).|
| 405       |  |   | The request method is incorrect. | The request method for this REST API is POST. Do not use GET, PUT, DELETE, or another method. |

2. For targeted messages, an HTTP status code other than `200` indicates that the request failed. One of the following error codes may be returned:

| HTTP status code | Error type      | Error message          | Possible cause       | Recommendation       |
|:---------|:-------------------|:-------------------|:-----------|:----------------------|
| 400      | invalid_request_body     | Request body is invalid. Please check body is correct. | The request body is incorrectly formatted.  | Check whether the request body is valid, including the field types. |
| 400      | message_send_error | param from can't be empty      | The `from` request parameter is an empty string. | Enter a valid `from` request parameter.If this field is omitted, the server sets it to `admin` by default. |
| 400      | message_send_error | param to can't be empty   | The `to` request parameter is an empty array.  | Enter a valid `to` request parameter.  |
| 400      | message_send_error | param type can't be empty | The `type` request parameter is an empty string. | Enter a valid `type` request parameter.         |
| 400      | message_send_error | param body can't be empty  | The `body` request parameter is an empty JSON object. | Enter a valid `body` request parameter.         |
| 400      | message_send_error | param ext must be JSONObject  | The `ext` request parameter has an incorrect type. | Enter a valid `ext` request parameter in JSON format.  |
| 400      | message_send_error | param users can't be empty    | The `users` request parameter is an empty array. | Enter a valid `users` request parameter. |
| 400      | message_send_error | params to's size can't exceed limit 10 | The number of entries in the `to` request parameter exceeds the maximum of 10. | Enter a valid `to` request parameter. You can specify up to 10 chat room IDs per request. |
| 400      | message_send_error | message is too large | The content of the `body` and `ext` fields in the request body is too large. | Limit the content of `body` and `ext`. |
| 403      | message_send_error | message send reach limit  | The message sending frequency exceeds the limit, which is 100 chat room messages per second by default. | Reduce the message sending frequency. For details, see [this document](message_group.html#send-targeted-messages).  |

## Common optional message parameters

Common optional message parameters control roaming visibility, message priority, and extension information. They are used in the same way for all message types: add the corresponding fields to the common request body.

The following parameters apply to all message types and can be combined as needed with text, image, voice, video, file, location, command, and custom messages.

#### Request example

The following text message example shows how to combine these common optional parameters when sending a message:

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST -i 'https://XXXX/XXXX/XXXX/messages/chatrooms' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "from": "user1",
  "to": ["185145305923585"],
  "type": "txt",
  "body": {
    "msg": "testmessages"
  },
  `chatroom_msg_level`: "high",
  "roam_ignore_users": [],
  "ext": {
       "key1": "value1"
    },

}'
```

#### Request parameters

| Parameter | Type | Required | Description |
| :-------------- | :----- | :------- | :--------------- |
| `chatroom_msg_level` | String | No       | Chat room message priority:<br/> - `high`: High.<br/> - (Default) `normal`: Normal.<br/> - `low`: Low. |
| `roam_ignore_users`   | List   | No | Specifies which users cannot retrieve this message when fetching roaming messages. You can specify up to 20 user IDs per request.|
| `ext`           | JSON   | No       | Messages support extension fields for adding custom information. This parameter cannot be `null`. |

#### Response description

The request method, response example, and response field descriptions in this section are the same as for other message types. See "Response example" and "Response body fields" in [Send text messages](#send-text-messages).

## Optional enhancements

### Set callback routing when sending messages

Callback routing lets you deliver different messages under the same App Key to different callback addresses by callback environment. When sending a message, include a callback environment field such as `dev`, `test`, or `prod`. After the EasyIM server receives the message, it uses this field to match a [callback routing rule](/product/console/basic_webhook.html#configure-webhook-rules) configured in the console and routes the message to the corresponding [pre-delivery webhook](/rest/callback_presending.html) or [post-delivery webhook](/rest/callback_postsending.html) address.

:::tip
This feature is currently available only in China regions 1 and 2.
:::

For a detailed description and request example, see [Set callback routing when sending messages](message_single.html#set-callback-routing-when-sending-messages).
