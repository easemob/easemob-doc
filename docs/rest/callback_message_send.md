# Message Sending Callback

## Feature overview

After a message is sent successfully, the EasyIM server sends a callback request to your app server according to the [post-delivery callback rules](/product/console/basic_webhook.html#configure-message-callback-rules). Your app server can use the callback to obtain the sent message and synchronize data.

Callback requests for one-to-one, chat group, and chat room messages contain a set of common parameters. For details, see [Common parameters](#common-parameters). The structure of the `payload` field varies by message type, as described below.

## Prerequisite

- The post-delivery callback service is activated. For details, see [Activate the message callback service](/product/console/basic_webhook.html#activate-the-service) and [Callback overview](/document/server-side/callback_postsending.html).
- Post-delivery callback rules are configured in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Configure callback rules](/product/console/basic_webhook.html#configure-message-callback-rules).

## Common parameters

The following table describes the common parameters in callback requests for messages sent in one-to-one chats, group chats, and chat rooms:

| Parameter | Type   | Description |
| :---------------- | :----- |:------------------------------------------------------------------|
| `callId`    | String   | Unique identifier of the callback request, in the format `{App Key}_{发送的消息的ID}`. | 
| `eventType`       | String | Event type: `chat` for an uplink message and `chat_offline` for an offline message.                    |
| `timestamp`       | long   | Unix timestamp when the EasyIM server receives the message, in milliseconds.                           |
| `chat_type`       | String | Conversation type. All types are selected by default:<br/> - `chat`: One-to-one chat callback;<br/> - `groupchat`: Group chat callback, including message callbacks for chat groups and chat rooms;<br/> - `notify`: Notification callback, including callbacks for message threads (Thread) and Reactions. Use `payload` and its `type` field to determine the specific type. |
| `group_id`        | String | Present when `chat_type` is `groupchat`. It indicates the chat group or chat room where the callback message occurs.                |
| `from`            | String | Message sender.     |
| `to`              | String | Message recipient.   |
| `msg_id`    | String   | ID of the sent message. | 
| `payload`         | object | Event content, in the same format as content sent through the REST API. See [Historical message content](message_historical.html#historical-message-content).      |
| `securityVersion` | String | Security verification version, currently `1.0.0`. Ignore this parameter. It will be configured in the Easemob Console in the future.                   |
| `security`        | String | Signature in the format `MD5（callId+secret+timestamp）`. For the `Secret`, see [Callback rule configuration](/product/console/basic_webhook.html#configure-message-callback-rules) in the Easemob Console.     |
| `appkey`          | String | Unique identifier of the app registered in the Easemob Console.        |
| `host`            | String | Server name.              |
| `content_type`            | String | Message type:<br/> - `chat:user:*`: One-to-one message  <br/> - `chat:group:*`: Chat group message   <br/> - `chat:room:*`: Chat room message  <br/>  For the specific parameter values of each message type, see [Send one-to-one messages](#send-one-to-one-messages), [Send chat group messages](#send-chat-group-messages), and [Send chat room messages](#send-chat-room-messages).   |

## Trigger conditions

- A [message is sent](/document/android/message_send.html#send-a-text-message) in a one-to-one chat, group chat, or chat room on the client.
- A REST API is called to send a message in a [one-to-one chat](/document/server-side/message_single.html#send-a-text-message), [group chat](/document/server-side/message_group.html#send-a-text-message), or [chat room](/document/server-side/message_chatroom.html#send-a-text-message).
- A message is sent through the console in a [one-to-one chat](/product/console/operation_user.html#send-a-rest-message), [group chat](/product/console/operation_group.html#send-a-rest-message), or [chat room](/product/console/operation_chatroom.html#chat-room-moderation-management).

## Send one-to-one messages

### Text and command messages

#### Request example

The following example shows the `payload` field in a callback request for sending a text message. The callback request for a command message has the same structure, with the `type` field set to `cmd`.

```json
"payload":{
    "ext":{},
    "bodies":[{"msg":"rr","type":"txt"}]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a text message:

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | Message extension field.                                             |
| `bodies` | object   | Callback body content containing the `msg` and `type` fields.           |
| `msg`    | String    | Message content.                                                   |
| `type`   | String   | Message type:<br/> - Text message: `txt` <br/> - Command message: `cmd` |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### Image message

#### Request example

The following example shows the `payload` field in a callback request for sending an image message:

```json
"payload":{
    "ext":{},
    "bodies":[{
        "filename":"image",
        "size":{"width":746,"height":1325},
        "secret":"EsYYqnkREeyZAUHNhFQyIhTJxWxvGOwyx1",
        "file_length":118179,
        "type":"img",
        "url":"https://XXXX.com/"
    }]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending an image message:

| Field          | Type   | Description                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | Json   | Message extension field.                                             |
| `bodies`      | object | Callback body content containing the `filename`, `secret`, `file_length`, `size`, `url`, and `type` fields. |
| `filename`    | String | Image name.                                                   |
| `secret`      | String | Access key returned after the file is uploaded successfully.                              |
| `file_length` | Int    | Image file size, in bytes.                                 |
| `size`        | Json   | Image dimensions: `height` for height and `width` for width.                    |
| `url`         | String | UUID returned after a file is uploaded successfully to the domain `/orgname/appname/chatfiles/`. See the request example. |
| `type`        | String | Message type: `img` |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### Voice message

#### Request example

The following example shows the `payload` field in a callback request for sending a voice message:

```json
"payload":{
    "ext":{},
    "bodies":[{
        "filename":"audio",
        "length":4,
        "secret":"anmSynkREey91e0Ksmmt2Ym6AzpRr9SxsUpF",
        "file_length":6374,
        "type":"audio",
        "url":"https://XXXX.com/"
    }]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a voice message:

| Field          | Type   | Description                                                        |
| :------------ | :----- | :----------------------------------------------------------- |
| `ext`         | JSON   | Message extension field.                                             |
| `bodies`      | object | Message body content containing the `filename`, `length`, `secret`, `file_length`, `type`, and `url` fields. |
| `filename`    | String | File name.                                                   |
| `secret`      | String | Secret returned after the file is uploaded successfully.                                |
| `file_length` | Long   | Voice file size, in bytes.                                 |
| `length`      | Int    | Voice message duration, in seconds.                                       |
| `url`         | String | UUID returned after a file is uploaded successfully to the domain `/org_name/app_name/chatfiles/`. |
| `type`        | String | Message type: `audio` |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### Video message

#### Request example

The following example shows the `payload` field in a callback request for sending a video message:

```json
"payload":{
    "ext":{},
    "bodies":[{
        "thumb_secret":"t1AECnqLEeyS81-d10_HOpjSZc8TD-ud40pFCkOStQrr7Mbc",
        "filename":"video.mp4",
        "size":{
          "width":360,
          "height":480},
        "thumb":"https://XXXX.com/XXXX/XXXX/chatfiles/b7500400-7a8b-11ec-8d83-7106bf6633e6",
        "length":10,
        "secret":"uFtZgHqLEeycBfuoalZCJPD7PVcoOu_RHTRa78bjU_KQAPr2",
        "file_length":601404,
        "type":"video",
        "url":"https://XXXX.com/XXXX/XXXX/chatfiles/b85b3270-7a8b-11ec-9735-6922a85eb891"
    }]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a video message:

| Field           | Type   | Description                                                         |
| :------------- | :----- | :----------------------------------------------------------- |
| `ext`          | JSON   | Message extension field.                                             |
| `bodies`       | object | Callback body content containing the following fields: `thumb_secret`, `thumb`, `filename`, `secret`, `file_length`, `size`, `url`, and `type`. |
| `thumb_secret` | String | Access key returned after the video thumbnail is uploaded successfully.                          |
| `filename`     | String | Video file name.                                                   |
| `size`         | JSON   | Thumbnail dimensions: `height` for height and `width` for width.              |
| `thumb`        | String | UUID returned after the video thumbnail is uploaded successfully.                              |
| `secret`       | String | Access key returned after the video file is uploaded successfully.                            |
| `length`       | Int    | Video playback duration.                                               |
| `file_length`  | Long   | Video file size, in bytes.                                 |
| `type`         | String | Message type. The value is `video` for a video message.   |
| `url`          | String | Video file URL in the format `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the video file ID. Obtain it from the file upload response body after the video file is uploaded successfully.  |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### File message

#### Request example

The following example shows the `payload` field in a callback request for sending a file message:

```json
"payload":{
    "ext":{},
    "bodies":[{
        "file_length":3279,
        "filename":"record.md",
        "secret":"2RNXCgeeEeeXXXX-XXXXbtZXJH4cgr2admVXn560He2PD3RX",
        "type":"file",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/d9135700-XXXX-XXXX-b000-a7039876610f"
    }]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a file message:

| Parameter          | Type   | Description         |
| :------------ | :----- | :---------------- |
| `ext`          | JSON   | Message extension field.     |
| `bodies`       | object | Callback body content containing the `file_length`, `filename`, `secret`, `type`, and `url` fields. |
| `file_length`  | Long   | File size, in bytes.   |
| `filename`     | String | File name, including the extension.     |
| `secret`       | String | File access key. This field is present if access restrictions are enabled during [file upload](message_upload_file.html). |
| `type`         | String | Message type. The value is `file` for a file message.  |
| `url`          | String | File URL. You can use the URL to download the historical message file.  |


For other parameters in the callback request, see [Common parameters](#common-parameters).

### Location message

#### Request example

The following example shows the `payload` field in a callback request for sending a location message:

```json
"payload":{
    "ext":{},
    "bodies":[{
        "lng":116.32309156766605,
        "type":"loc",
        "addr":"********",
        "lat":39.96612729238626
    }]
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a file message:

| Field   | Type   | Description             |
| :----- | :----- | :--------------- |
| `lat`  | String | Latitude.           |
| `type` | String   | Message type. The value is `loc` for a location message. |
| `lng`  | String | Longitude.           |
| `addr` | String | Text description of the location. |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### Custom message

#### Request example

The following example shows the `payload` field in a callback request for sending a custom message:

```json
"payload": {
    "ext": {}, 
    "bodies": [{ 
        "customExts": [ {"name": 1 } ],
        "v2:customExts":{"k":"v","k1":"v1"},
        "customEvent": "flower", 
        "type": "custom" 
    }] 
}
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a custom message:

| Parameter          | Type | Description                                                         |
| :------------ | :------- | :----------------------------------------------------------- |
| `customEvent` | String   | User-defined event type. It must be a string of 1–32 characters and match the regular expression `[a-zA-Z0-9-_/.]{1,32}`. |
| `customExts`/`v2:customExts`  | Array/JSON     | User-defined event attributes. This field is optional and can be omitted when unnecessary.<br/> - `customExts` is the legacy array parameter and can contain up to 16 elements.<br/> - `v2:customExts` is the new Map<String,String> parameter and can contain up to 16 elements. The new parameter is recommended. |
| `from`        | String   | Message sender. This field is optional and defaults to `admin` on the server if omitted. If it is passed as an empty string "", the request is rejected. |
| `ext`         | JSON     | Extension field for app-defined content. This field is optional and is ignored if omitted. If provided, its value cannot be the string `ext:null`; otherwise, an error occurs. |

For other parameters in the callback request, see [Common parameters](#common-parameters).

### Combined message

#### Request example

The following example shows the `payload` format of a combined message containing text, image, and file messages:

```json
  "payload": {
        "bodies": [
            {
                "combineLevel": 1,
                "file_length": 1059,
                "filename": "17326799853580001",
                "msg": "当前版本过低，无法展示对应内容。",
                "secret": "CeycYKx0Ee-I3fU0d5v4X9BduteO1RZNVsePAgkDQ9sxoVJM",
                "subType": "sub_combine",
                "summary": "wzy1: 你在哪里？\nwzy1: 你在哪里？\nwzy1: 你在哪里？",
                "title": "聊天记录",
                "type": "txt",
                "url": "https://a1-hsb.easemob.com/easemob-demo/testy/chatfiles/09ec7550-ac74-11ef-83ce-4719989e3c82"
            }
        ],
        "ext": {
            "ease_chat_uikit_user_info": {
                "nickname": "公子小白有点黑"
            }
        },
        "from": "user1",
        "to": "user2",
        "type": "chat"
    }
```

#### Request fields

The following table describes the `payload` field in a callback request for sending a combined message:

| Parameter          | Type   | Description                                             |
| :------------ | :----- | :----------------------------------------------- |
| `combineLevel`  | Int   | Number of nesting levels in the combined message. |
| `file_length` | Int | Size of the combined message attachment, in bytes.               |
| `filename`        | String | Name of the combined message attachment.     |
| `msg`        | String | Compatibility text of the combined message. When an SDK that supports combined messages sends a message to an earlier SDK that does not, the earlier SDK parses this property as text message content.      |
| `secret`        | String | Access key of the combined message attachment. This field is present if access restrictions are enabled during [file upload](message_upload_file.html).  |
| `subType`        | String | Message type. The value is `sub_combine` for a combined message.       |
| `summary`        | String | Summary of the combined message.                |
| `title`        | String | Title of the combined message.                |
| `url`        | String | URL of the combined message attachment.                |
| `ext`        | JSON | Extension information.                |
| `from`        | String | User ID of the combined message sender.                |
| `to`        | String | User ID of the recipient.                |
| `type`        | String | Conversation type:<br/> - `chat`: One-to-one chat;<br/> - `groupchat`: Group chat;<br/> - `chatroom`: Chat room.              |

For other parameters in the callback request, see [Common parameters](#common-parameters).

## Send chat group messages

This section provides an example callback request body sent by the EasyIM server to your app server after each type of message is sent in a chat group.

| content_type          | Type in payload                                      | Trigger event                 |
| :-------------------- | :-------------------------------------------------- | :----------------------- |
| `chat:group:*`        | -                                                   | Send any type of message in a chat group |
| `chat:group:text`     | `{"bodies":{"type":"txt"}}`                         | Send a text message in a chat group       |
| `chat:group:image`    | `{"bodies":{"type":"img"}}`                         | Send an image message in a chat group       |
| `chat:group:voice`    | `{"bodies":{"type":"audio"}}`                       | Send a voice message in a chat group       |
| `chat:group:location` | `{"bodies":{"type":"loc"}}`                         | Send a location message in a chat group       |
| `chat:group:video`    | `{"bodies":{"type":"video"}}`                       | Send a video message in a chat group       |
| `chat:group:file`     | `{"bodies":{"type":"file"}}`                        | Send a file message in a chat group       |
| `chat:group:command`  | `{"bodies":{"type":"cmd"}}`                         | Send a command message in a chat group       |
| `chat:group:custom`   | `{"bodies":{"type":"custom"}}`                      | Send a custom message in a chat group     |
| `chat:group:txt`      | `{"bodies":{"type":"txt","subType":"sub_combine"}}` | Send a combined message in a chat group       |
| `chat:group:unknown`  | `{"bodies":{"type":"unknown"}}`                     | Send an unknown message in a chat group       |

### Request example

```json
{
    "callId":"{appkey}_8924312242322", 
    "eventType":"chat_offline",
    "timestamp":1600060847294,
    "chat_type":"groupchat", 
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322",
    "payload":{
        // Specific message content
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
 }
```

### Request fields

| Field     | Type | Description                                                         |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | String   | Message extension field.                                             |
| `bodies` | object   | Callback body content containing the `msg` and `type` fields.           |
| `msg`    | String   | Message content.                                                   |
| `type`   | String   | Message type:<br/> - Text message: `txt`;<br/> - Image message: `img`;<br/> - Voice message: `audio`;<br/> - Location message: `loc`;<br/> - Video message: `video`;<br/> - File message: `file`;<br/> - Command message: `cmd`; <br/> - Custom message: `custom`;<br/> - Unknown message: `unknown`. |

For other parameters in the callback request, see [Common parameters](#common-parameters).

The payload of a chat group message is the same as that of a one-to-one message. For details, see [Send one-to-one messages](#send-one-to-one-messages).

## Send chat room messages

This section provides an example callback request body sent by the EasyIM server to your app server after each type of message is sent in a chat room.

| content_type         | Type in payload                                      | Trigger event                   |
| :------------------- | :-------------------------------------------------- | :------------------------- |
| `chat:room:*`        | -                                                   | Send any type of message in a chat room |
| `chat:room:text`     | `{"bodies":{"type":"txt"}}`                         | Send a text message in a chat room       |
| `chat:room:image`    | `{"bodies":{"type":"img"}}`                         | Send an image message in a chat room       |
| `chat:room:voice`    | `{"bodies":{"type":"audio"}}`                       | Send a voice message in a chat room       |
| `chat:room:location` | `{"bodies":{"type":"loc"}}`                         | Send a location message in a chat room       |
| `chat:room:video`    | `{"bodies":{"type":"video"}}`                       | Send a video message in a chat room       |
| `chat:room:file`     | `{"bodies":{"type":"file"}}`                        | Send a file message in a chat room       |
| `chat:room:command`  | `{"bodies":{"type":"cmd"}}`                         | Send a command message in a chat room       |
| `chat:room:custom`   | `{"bodies":{"type":"custom"}}`                      | Send a custom message in a chat room     |
| `chat:room:txt`      | `{"bodies":{"type":"txt","subType":"sub_combine"}}` | Send a combined message in a chat room       |
| `chat:room:unknown`  | `{"bodies":{"type":"unknown"}}`                     | Send an unknown message in a chat room       |

### Request example

```json
{
    "callId":"{appkey}_8924312242322",
    "eventType":"chat_offline",
    "timestamp":1600060847294,
    "chat_type":"groupchat", 
    "group_id":"16934809238921545",
    "from":"user1",
    "to":"user2",
    "msg_id":"8924312242322", 
    "payload":{
        // Specific message content, the same as the corresponding one-to-one message type
    },
    "securityVersion":"1.0.0",
    "security":"2ca02c394bef9e7abc83958bcc3156d3"
}
```

### Request fields

| Field     | Type | Description                                                       |
| :------- | :------- | :----------------------------------------------------------- |
| `ext`    | object   | Message extension field.                                             |
| `bodies` | object   | Callback body content containing the `msg` and `type` fields.           |
| `msg`    | String   | Message content.                                                   |
| `type`   | String   | Message type:<br/> - Text message: `txt`;<br/> - Image message: `img`;<br/> - Voice message: `audio`;<br/> - Location message: `loc`;<br/> - Video message: `video`;<br/> - File message: `file`;<br/> - Command message: `cmd`; <br/> - Custom message: `custom`;<br/> - Unknown message: `unknown`. |

For other parameters in the callback request, see [Common parameters](#common-parameters).

The `payload` structure of a chat room message is the same as that of a one-to-one message. For details, see [Send one-to-one messages](#send-one-to-one-messages).
