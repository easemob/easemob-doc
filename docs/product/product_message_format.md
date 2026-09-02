# Message Format 

EasyIM currently supports the following message `type` values:

| Parameter   | Type   |
| :----- | :----- |
| `txt` | Text message |
| `loc`  | Location message |
| `cmd` | Command message |
| `img` | Image message |
| `audio` | Voice message  |
| `video` | Video message |
| `file` | File message |
| `custom` | Custom message |
| `combine` | Combined message |
| `markdown` | Streaming message |

## Message body

The message body is a JSONArray that contains the message type and content. Only the content of the `body` field differs between message types.

### Text message

The body of a text message contains the following field:

| Parameter   | Type   | Description                             |
| :----- | :----- | :------------------------------- |
| `msg`  | String | Message content.                       |

Example:

```json
{
  "msg": "testmessages"
}
```

### Location message

The body of a location message contains the following fields:

| Parameter   | Type   | Description                         |
| :----- | :----- | :--------------------------- |
| `lat`  | double   | Latitude of the location.                 |
| `lng`  | double   | Longitude of the location.                 |
| `addr` | String | Description of the location address.             |

Example:

```json
{
    "lat": 39.966,
    "lng": 116.322,
    "addr":"123 Main Street, Apt 4B, Los Angeles, CA"
}
```

### Command message

The body of a command message contains the following field:

| Parameter     | Type   | Description                         |
| :------- | :----- | :--------------------------- |
| `action` | String | Command content.                   |

Example:

```json
{
  "action":"action1"
}
```

### Image message

When sending an image message through a REST API, we recommend passing the `filename` parameter. Otherwise, the client cannot display the file name when receiving the image message. Also ensure that the image can be downloaded using the `url` parameter.

If access restrictions (`restrict-access`) are enabled when the image is uploaded, obtain `share-secret` from the [file upload](/rest/message_upload_file.html) response body after the upload and pass it when sending the image message. When you upload the original image, the EasyIM server automatically generates a thumbnail.

The body of an image message contains the following fields:

| Parameter          | Type   | Description        |
| :------------ | :----- | :------------------------ |
| `filename`    | String | Image file name, including the file extension.     |
| `secret`      | String | Image access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the image is uploaded successfully. This field is required when sending a message if access restrictions (`restrict-access`) were enabled when the image file was uploaded. |
| `url`         | String | Image URL: https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}, where `file_uuid` is the file ID obtained from the [file upload](/rest/message_upload_file.html) response body after the image file is uploaded successfully.  |
| `size`        | JSON   | Image dimensions in pixels.<br/> - `height`: Image height.<br/> - `width`: Image width.   |

Example:

```json
{
    "filename":"testimg.jpg",
    "secret":"VfXXXXNb_",
    "url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252",
    "size": {
      "width":480,
      "height":720
    }
}
```

### Voice message

When sending a voice message through a REST API, we recommend passing the `filename` parameter. Otherwise, the client cannot display the file name when receiving the voice message. Also ensure that the voice file can be downloaded using the `url` parameter.

If access restrictions (`restrict-access`) are enabled when the voice file is uploaded, obtain `share-secret` from the [file upload](/rest/message_upload_file.html) response body after the upload and pass it when sending the voice message. 

The body of a voice message contains the following fields:

| Parameter          | Type   | Description                                                                              |
| :------------ | :----- | :------------------------------------------ |
| `url`         | String | Voice file URL: https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}, where `file_uuid` is the file ID obtained from the [file upload](/rest/message_upload_file.html) response body after the voice file is uploaded successfully. |
| `filename`    | String | Voice file name, including the file extension.    |
| `length`      | Int    | Voice duration in seconds.    |
| `secret`      | String | Voice file access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the voice file is uploaded successfully. This field is required when sending a message if access restrictions (`restrict-access`) were enabled when the voice file was uploaded. |

Example:

```json
{
    "url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42",
    "filename": "testaudio.amr",
    "length": 10,
    "secret": "HfXXXXCjM"
}
```

### Video message

When sending a video message through a REST API, we recommend passing the `filename` parameter. Otherwise, the client cannot display the file name when receiving the video message. Also ensure that the video can be downloaded using the `url` parameter.

If access restrictions (`restrict-access`) are enabled when the video file is uploaded, obtain `share-secret` from the [file upload](/rest/message_upload_file.html) response body after the upload and pass it when sending the video message. The EasyIM server does not automatically generate a thumbnail for a video file. If you need a video thumbnail, first call the [file upload](/rest/message_upload_file.html) API to upload the thumbnail, and then call the API again to upload the original video file.

The body of a video message contains the following fields:

| Parameter           | Type   | Description    |
| :------------- | :----- | :--------- |
| `filename`     | String | Video file name, including the file extension.  |
| `thumb`        | String | Video thumbnail URL in the format https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}, where `file_uuid` is the thumbnail UUID returned by the EasyIM server after the video thumbnail is uploaded. |
| `length`       | Int    | Video duration in seconds.   |
| `secret`       | String | Video file access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the video file is uploaded successfully. This field is required when sending a message if access restrictions (`restrict-access`) were enabled when the video file was uploaded.  |
| `file_length`  | Long   | Video file size in bytes.  |
| `thumb_secret` | String | Thumbnail file access key. This field is present if access restrictions were enabled when the file was uploaded. |
| `url`          | String | Video file URL: https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}, where `file_uuid` is the file ID obtained from the [file upload](/rest/message_upload_file.html) response body after the video file is uploaded successfully. |

Example:

```json
{
    "filename" : "test.avi",
    "thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
    "length" : 0,
    "secret":"VfXXXXNb_",
    "file_length" : 58103,
    "thumb_secret" : "ZyXXXX2I",
    "url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
}
```

### File message

When sending a file message through a REST API, we recommend passing the `filename` parameter. Otherwise, the client cannot display the file name when receiving the file message. Also ensure that the file can be downloaded using the `url` parameter.

If access restrictions (`restrict-access`) are enabled when the file is uploaded, obtain `share-secret` from the [file upload](/rest/message_upload_file.html) response body after the upload and pass it when sending the file message. 

The body of a file message contains the following fields:

| Parameter       | Type   | Required | Description     |
| :--------- | :----- | :------- | :------------ |
| `filename` | String | No       | File name. We recommend passing this parameter. Otherwise, the client cannot display the file name when receiving the file message.   |
| `secret`   | String | No       | File access key obtained from `share-secret` in the [file upload](/rest/message_upload_file.html) response body after the file is uploaded successfully. This field is required if access restrictions (`restrict-access`) were enabled when the file was uploaded.      |
| `url`      | String | Yes       | File URL: `https://{host}/{org_name}/{app_name}/chatfiles/{file_uuid}`, where `file_uuid` is the file ID obtained from the [file upload](/rest/message_upload_file.html) response body after the video file is uploaded successfully. |

Example:

```json
{
    "filename":"test.txt",
    "secret":"1-g0XXXXua",
    "url": "https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
}
```

### Custom message extension fields

You can store additional information in the message extension section `ext`. For example, `em_ignore_notification` in the following example specifies whether to send a silent message.

```json
"ext": {
      "em_ignore_notification": true
    }
```

| Parameter          | Type   | Description                                                                          |
| :------------ | :----- | :---------------------------------------------------------------------------- |
| `ext` | JSON | Messages support extension fields for custom information. You cannot pass `null` for this parameter. |

### Custom message

The body of a custom message contains the following fields:

| Parameter          | Type   | Description                                             |
| :------------ | :----- | :----------------------------------------------- |
| `customExts`  | JSON   | User-defined event attributes. The type must be `Map<String,String>`, and up to 16 elements are supported. `customExts` is optional and can be omitted when it is not required. |
| `customEvent` | String | User-defined event type. The value must match the regular expression [a-zA-Z0-9-_/\.]{1,32} and contain 1-32 characters. |
| `type`        | String | Message type. The value for a custom message is `custom`.                |

Example custom message format:

```json
[
  {
  "customExts":
    {
    "name":"flower",
    "size":"16",
    "price":"100"
    },
  "customEvent":"gift_1",
  "type":"custom"
 }
]
```

## Offline push extension fields

EasyIM supports APNs and FCM. When using offline push, you can implement push features through message extension fields, such as setting the push title and content in a push template or receiving push notifications only for messages that mention (`@`) specified users.

### Push extension fields

The structure of `payload.ext` is as follows:

| Field                   | Type         | Description  |
| ---------------------- | ------------ | ------------------ |
| `em_push_filter`     | Object       | Push filter.                                                   |
| `em_at_list`             | `List<String>` | `@` list.      |
| `em_push_template `      | Object       | Push template.     |
| `em_ignore_notification` | Boolean      | Silent message switch. `true` means that no push notification is sent.  |
| `em_force_notification`  | Boolean      | Forced push switch. If the value is `true`, the server does not check whether the user has enabled Do Not Disturb.  |
| `em_apns_ext`            | Object       | APNs configuration. |
| `em_android_push_ext`    | Object       | Android configuration. |
| `em_push_ext`            | Object       | General configuration. |

The structure of `em_push_filter` is as follows:

| Field                 | Type         | Description                     |
| ----------------     | ------------ | ------------------------ |
| `accept_device_id`     | `List<String>` | List of device IDs that receive push notifications.   |
| `ignore_device_id`     | `List<String>` | List of device IDs that do not receive push notifications. |
| `accept_notifier_name` | `List<String>` | List of certificate names that receive push notifications.     |
| `ignore_notifier_name` | `List<String>` | List of certificate names that do not receive push notifications.   |

The structure of `em_push_template` is as follows:

| Field         | Type         | Description                                                         |
| ------------ | ------------ | ------------------------------------------------------------ |
| `name`         | String       | Push template name.                                                 |
| `title_args`   | `List<String>` | Push template title parameters. Built-in parameter: sender nickname `{$fromNickname}`.      |
| `content_args` | `List<String>` | Push template content parameters. Built-in parameter: message content `{$msg}`. If translation is activated, the displayed message content follows the translation result. |
| `directed_template` | Object        | Targeted push template. This type of template applies to offline push for chat group messages when one or more users in the chat group need to receive a different offline push notification from other users. Its fields are described in the following table.    |
| `disable_at_content` | Boolean        | Whether to disable the default @ content:<br/> - `true`: Disable<br/> - (Default) `false`: Do not disable  |

For information about configuring the `title_args` and `content_args` fields, see the [push template documentation](/rest/push_template_overview.html).

The structure of `em_push_ext` is as follows:

| Field                  | Type   | Description                                           |
| --------------------- | ------ | ---------------------------------------------- |
| `title`               | String | Custom push title.                                 |
| `content`             | String | Custom push content.                                 |
| `custom`              | Object | Content of e in the custom push extension parameters (t, f, m, g, e). |
| `group_user_nickname` | String | Sender's chat group nickname, used to replace sender information in the push notification.   |

The structure of `em_apns_ext` is as follows:

| Field                | Type             | Description   |
| -------------- | ---------------- | ------ |
| `em_push_category`           | String           | APNs push configuration: Push notification category.                                       |
| `em_push_mutable_content`    | Boolean          | APNs push configuration. `true` indicates a rich media push notification; `false` indicates a regular notification.             |
| `em_push_sound`              | String           | APNs push configuration: Custom ringtone. In the `Library/Sounds/` directory, use an `aiff`, `wav`, or `caf` file, such as `appsound.caf`. |
| `em_push_badge`              | Integer          | APNs push configuration: Custom badge count.      |
| `thread_id`         | String         | Notification grouping identifier.|
| `em_push_content_available`              | Integer          | A value of `1` indicates a background notification. For details, see Apple's [user notification documentation](https://developer.apple.com/documentation/usernotifications/pushing-background-updates-to-your-app?language=objc).  |


The structure of `em_android_push_ext` is as follows:

| Field                      | Type    | Description                                                         |
| ------------------------- | ------- | ------------------------------------------------------------ |
| `fcm_options`               | Object  | FCM SDK feature options.                                           |
| `fcm_channel_id`            | String  | FCM push channel with the highest priority.                                 |

The structure of `em_harmony_push_ext` is as follows:

| Field              | Type    | Description                                  |
| ----------------- | ------- | ------------------------------------- |
| `category`        | String  | Message category.                              |
| `click_action`    | String  | Click action that opens a page in the app.                      |
| `is_test_message` | Boolean | Whether this is a push test message. The beta version supports test messages only. |
| `notify_id`       | Integer | Notification ID. A notification with the same ID replaces the existing notification.             |
| `receipt_id`      | String  | Receipt ID.                                |

### Example

The message extension fields for offline push are as follows:

```json
{
    "ext": {
        "em_push_filter": {
            "accept_device_id": [

            ],
            "ignore_device_id": [

            ],
            "accept_notifier_name": [

            ],
            "ignore_notifier_name": [

            ]
        },
        "em_at_list": [
            "abc"
        ],
        "em_push_template": {
            "name": "test6",
            "title_args": [
                "test1"
            ],
            "content_args": [
                "{$fromNickname}",
                "{$msg}"
            ]
        },
        "em_push_ext": {
            "custom": {
                "test": 1
            },
            "group_user_nickname": "happy"
        },
        "em_ignore_notification": false,
        "em_force_notification": true,
        "em_apns_ext": {
            "em_push_title": "You've got a new message",
            "em_push_content": "You've got a new message",
            "em_push_category": "",
            "em_push_mutable_content": true,
            "em_push_sound": "appsound.mp3",
            "em_push_badge": 1,
            "thread_id": "abc"
        },
        "em_android_push_ext": {
            "fcm_options": {
                "key": "value"
            },
            "fcm_channel_id": "",
        },
        "em_harmony_push_ext": {
          "click_action": "com.a.b.shot",
          "category": "IM",
          "notify_id": 1,
          "receipt_id": "RCP78C959D4",
          "is_test_message":true
       }
    }
}
```





