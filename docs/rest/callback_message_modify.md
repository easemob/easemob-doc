# Message Editing Events

## Feature overview

After a message is edited, the EasyIM server sends a webhook request to your app server according to the [post-delivery webhook rules](callback_postsending.html#webhook-rules). Your app server can use the webhook to obtain the edited message and synchronize data.

## Prerequisite

- The post-delivery webhook service is activated. For details, see [Activate the message webhook service](/product/console/basic_webhook.html#activate-the-service) and [Webhook overview](/rest/callback_postsending.html).
- Post-delivery webhook rules are configured in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Configure webhook rules](/product/console/basic_webhook.html#configure-webhook-rules).

## Trigger conditions

- A [message is edited on the client](/sdk/v5/android/message_modify.html).
- A [RESTful API is called to edit a message](/rest/message_modify.html).

## Webhook request

The following table describes the editable content supported by each message type:

| Message type | Supported editable content        |
| :------- | :-------------------- |
| Text     | Text content and the `ext` field        |
| Image     | `ext` field                   |
| Voice     | `ext` field                   |
| Location     | `ext` field                   |
| File     | `ext` field                  |
| Video     | `ext` field                  |
| Combined     | `ext` field                   |
| Custom   | `customEvent`, `customExts`, and `ext` fields |

### Text message

```json
{
    "callId": "easemob-demo#support_1418038921190704764",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "19b85beee242a1266c87ab84c6c3883d",
    "payload": {
        "edit_message_id": "1418038712905770616",
        "ext": {
            "key1": "value_rewrite"
        },
        "bodies": [
            {
                "msg": "testmessages1",
                "type": "txt"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747727666259,
                "edit_time": 1747727714765,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1418038921190704764",
    "timestamp": 1747727714765
}
```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | Long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `bodies`         | JSON Array   | Specific edited message content, in the same format as content sent through the RESTful API. See [Historical message content](message_historical.html#historical-message-content). |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### Location message

```json
{
    "callId": "easemob-demo#support_1415008698962544248",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "36583253ca0d3a718388f1134b180baf",
    "payload": {
        "edit_message_id": "1415008466669405936",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "lng": 116.322,
                "addr": "123 Main Street, Apt 4B, Los Angeles, CA",
                "type": "loc",
                "lat": 39.966
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022132072,
                "edit_time": 1747022186159,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415008698962544248",
    "timestamp": 1747022186159
}
```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.         |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`  | JSON   | Message extension.                                       |
| `bodies`         | JSON Array   | Specific edited message content.<br/> - `lng`: String. Longitude.<br/> - `addr`: String. Text description of the location.<br/> - `type`: String. Message type. The value is `loc` for a location message.<br/> - `lat`: String. Latitude. |
| `from`            | String   | Sender of the edited message.                                               |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg_chat_type`            | String   | Conversation type of the message: one-to-one chat, group chat, or chat room.         |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.     |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `type`   | String   | Message editing event. The value is `edit`.       |


### Image message

```json
{
    "callId": "hx#hxdemo_1414991177169504212",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "78708dd54808525a8a4c0e51bacec2c2",
    "payload": {
        "edit_message_id": "1414988420945545172",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
           			"filename": "image5406881348368656892.jpg",
                "size": {
                    "width": 624,
                    "height": 832
                },
                "file_length": 96238,
                "secret": "vJkjMC7gEfC_Vjf9xuovCZm5-awdNh5rIdKZBvmBLpYreWTo",
                "thumbFilename": "image%3A1000156028",
                "type": "img",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/bc98fc20-2ee0-11f0-b174-0946be6f6fbc"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747017464831,
                "edit_time": 1747018106558,
                "sender": "wzy1",
                "count": 3,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "hx#hxdemo",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1414991177169504212",
    "timestamp": 1747018106558
}
```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `filename`: String. Image name.<br/> - `size`: JSON. Image dimensions in pixels, containing `height` for the image height and `width` for the image width. <br/> - `file_length`: String. Image file size.<br/> - `secret`: String. Image access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the image is uploaded successfully. <br/> - `thumbFilename`: String. Thumbnail size.<br/> - `type`: File type. `img` indicates an image message. <br/> - `url`: String. Image URL in the format `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the file ID. Obtain it from the [file upload](message_upload_file.html) response body after the image file is uploaded successfully. |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### Voice message

```json
{
    "callId": "easemob-demo#support_1415000359922828916",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "d2575840b44fb1b67f2911bd69a56473",
    "payload": {
        "edit_message_id": "1415000223524062680",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "filename": "wzy20250512T112327.amr",
                "length": 3,
                "file_length": 3282,
                "secret": "e4FRsC7gEfCk-ScLfMCJWdgzY621gM-Nwm_vnVcGwRL8SJYF",
                "type": "audio",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/7b810390-2ee0-11f0-b4c7-03224649d943"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747020212833,
                "edit_time": 1747020244585,
                "sender": "wzy",
                "count": 1,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy",
    "to": "wzy1",
    "msg_id": "1415000359922828916",
    "timestamp": 1747020244585
}

```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `filename`: String. Image name.<br/> - `length`: Int. Voice duration in the format of second. <br/> - `file_length`: String. Image file size.<br/> - `secret`: String. Image access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the image is uploaded successfully. <br/> - `type`: File type. `audio` indicates a voice message. <br/> - `url`: String. Voice URL in the format `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the file ID obtained from the [file upload](message_upload_file.html) response body after the image file is uploaded successfully. |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### Video message

```json
{
    "callId": "easemob-demo#support_1415009227012835056",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "9cf75f2e2dec09ab70df4ced8caa2148",
    "payload": {
        "edit_message_id": "1415009139259606640",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "thumb_secret": "ZyXXXX2I",
                "filename": "test.avi",
                "thumb": "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
                "length": 0,
                "file_length": 58103,
                "secret": "VfXXXXNb_",
                "type": "video",
                "url": "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022288686,
                "edit_time": 1747022309104,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415009227012835056",
    "timestamp": 1747022309104
}

```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `thumb_secret`: Video thumbnail access key obtained from `share-secret` in the [file upload](message_upload_file.html) response body after the video file is uploaded successfully. This field is required if access restrictions (`restrict-access`) were enabled when the thumbnail file was uploaded.<br/> - `filename`: String. Video file name.<br/> - `thumb`: String. Thumbnail URL.<br/> - `length`: Video duration, in seconds.<br/> - `secret`: String. Video file access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the video is uploaded successfully. <br/> - `type`: File type. `video` indicates a video message. <br/> - `url`: String. Video URL in the format `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the file ID. Obtain it from the [file upload](message_upload_file.html) response body after the video file is uploaded successfully. |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### File message

```json
{
    "callId": "easemob-demo#support_1415009628512585332",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "8ae190480ff8f4206eece47665e1eb49",
    "payload": {
        "edit_message_id": "1415009594568083068",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "filename": "test.txt",
                "secret": "1-g0XXXXua",
                "type": "file",
                "url": "https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022394696,
                "edit_time": 1747022402597,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415009628512585332",
    "timestamp": 1747022402597
}

```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `filename`: String. File name.<br/> - `secret`: String. File access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the file is uploaded successfully. <br/> - `type`: File type. `file` indicates a file message. <br/> - `url`: String. File URL in the format `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the file ID. Obtain it from the [file upload](message_upload_file.html) response body after the video file is uploaded successfully. |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### Combined message

```json
{
    "callId": "easemob-demo#support_1415001238604355312",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "3539b3b166e2f3401076664629d98ef1",
    "payload": {
        "edit_message_id": "1415001054172415464",
        "ext": {
            "new_ext": "test_rewrite"
        },
        "bodies": [
            {
                "combineLevel": 1,
                "msg": "Version too low to show this content.",
                "summary": "wzy1: [image]\nwzy: [voice]\nwzy: [image]",
                "filename": "17470204055850033",
                "subType": "sub_combine",
                "file_length": 701,
                "secret": "7sUSEC7gEfCYlE9p85BBKlYH1ZsF2VFN49QS85LJMTNIkBKw",
                "title": "Chat History",
                "type": "txt",
                "url": "https://a1.easemob.com/easemob-demo/support/chatfiles/eec4eb00-2ee0-11f0-8f24-b3ce6aa9421a"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:group",
                "send_time": 1747020406219,
                "edit_time": 1747020449159,
                "sender": "wzy",
                "count": 1,
                "operator": "wzy"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy",
    "to": "278265393643526",
    "msg_id": "1415001238604355312",
    "timestamp": 1747020449159
}
```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `combineLevel`: Int. Number of nesting levels in the combined message.<br/> - `msg`: String. Compatibility text of the combined message. When an SDK that supports combined messages sends a message to an earlier SDK that does not, the earlier SDK parses this property as text message content.<br/> - `summary`: String. Summary of the combined message.<br/> - `filename`: String. File name.<br/> -  `subType`: String. Message type. The value is `sub_combine` for a combined message.<br/> - `file_length`: Int. Size of the combined message attachment, in bytes.<br/> - `secret`: String. File access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the file is uploaded successfully. <br/> - `title`: String. Title of the combined message.<br/> - `type`: Message attachment type. `txt` indicates a text file. <br/> - `url`: String. URL of the combined message attachment. You can use the URL to download the attachment. |
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |

### Custom message

```json
{
    "callId": "easemob-demo#support_1415010565809505916",
    "eventType": "chat",
    "chat_type": "edit",
    "security": "989b921d92b411d3c30364ccda87aad4",
    "payload": {
        "edit_message_id": "1415010541239273084",
        "ext": {
            "key1": "value_rewrite"
        },
        "bodies": [
            {
                "customExts": [
                    {
                        "key1": "value_rewrite"
                    }
                ],
                "customEvent": "ce_rewrite",
                "v2:customExts": {
                    "key1": "value_rewrite"
                },
                "type": "custom"
            }
        ],
        "meta": {
            "edit_msg": {
                "chat_type": "chat:user",
                "send_time": 1747022615096,
                "edit_time": 1747022620834,
                "sender": "wzy1",
                "count": 1,
                "operator": "wzy1"
            }
        },
        "type": "edit"
    },
    "appkey": "easemob-demo#support",
    "from": "wzy1",
    "to": "wzy",
    "msg_id": "1415010565809505916",
    "timestamp": 1747022620834
}

```

Webhook request body fields:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `callId`          | String   | The `callId` field is the unique identifier of each webhook request. |
| `eventType`       | String | `chat`: Uplink message; `chat_offline`: Offline message.                      |
| `chat_type`       | String   | `edit`, indicating message editing. |
| `security`        | String   | Signature in the format MD5（callId+secret+timestamp）. For the Secret, see [Configure webhook rules in the EasyIM Console](callback_postsending.html#webhook-rules). |
| `appkey`          | String   | Unique identifier of the app registered in the EasyIM Console.                         |
| `from`            | String   | User ID of the message sender.                                     |
| `to`              | String   | Message recipient.<br/> - For a one-to-one chat, the recipient user ID;<br/> - For a group chat, the chat group ID;<br/> - For a chat room, the chat room ID.   |
| `msg_id`          | String   | Message ID of the message editing event.                                       |
| `timestamp`       | long     | Unix timestamp when the EasyIM server receives the message, in milliseconds.        |

`payload` contains the event content and the fields described in the following table:

| Field              | Type | Description                                                         |
| :---------------- | :------- | :----------------------------------------------------------- |
| `edit_message_id`  | String   | ID of the original message being edited.                                       |
| `ext`          | JSON  | Message extension field.                                       |
| `bodies`         | JSON Array   | Specific edited message content:<br/> - `customEvent`: String. User-defined event type. Its value must match the regular expression `[a-zA-Z0-9-_/\.]{1,32}` and be 1-32 characters long. <br/> - `customExts`/`v2:customExts`: Array/JSON. User-defined event attributes. `customExts` is the legacy array parameter and can contain up to 16 elements. `v2:customExts` is the new `Map<String,String>` parameter and can contain up to 16 elements. The new parameter is recommended.<br/> - `type`: Message type. `custom` indicates a custom message.|
| `meta.edit_msg`            | JSON   | Message editing details.                                               |
| `meta.edit_msg.chat_type`            | String   | Conversation type.     |
| `meta.edit_msg.count`            | JSON   | Number of message edits.                                               |
| `meta.edit_msg.edit_time`            | Long   | Message editing time.                                               |
| `meta.edit_msg.operator`          | String   | User who edits the message. `easemob_rest_app_admin` indicates an app admin.    |
| `meta.edit_msg.send_time`          | Long   | Time when the original message was sent.                                      |
| `meta.edit_msg.sender`          | String   | Sender of the original message.                                      |
| `type`            | String   | Message editing event. The value is `edit`.       |
