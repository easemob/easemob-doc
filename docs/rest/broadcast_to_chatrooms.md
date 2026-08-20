# Send a Global Broadcast Message to Chat Rooms

## Feature overview

EasyIM supports sending broadcast messages of all message types to all active chat rooms in an app. An active chat room has at least one member and has had at least one message sent in it.

- Broadcast messages do not support offline storage, so offline users do not receive them.
- Broadcast messages are written to the server-side conversation list. Message roaming is not supported by default. **To enable it, contact the sales team.**
- Broadcast messages have a broadcast ID but no message ID.
- Broadcast messages do not trigger the [pre-delivery callback](callback_presending.html).
- When the client receives a message, it [uses the attribute fields in the message body](/document/android/message_receive.html#determine-whether-a-message-is-a-chat-room-broadcast-message) to identify and distinguish a chat room broadcast message.

## Feature activation

To use global chat room broadcast messaging, you must **upgrade EasyIM to the Enterprise edition**.

## Call frequency limit

- The API can be called 10 times per minute and once per second. Neither limit can be increased. Exceeding either limit returns the 429 error "This request has reached api limit".
- The API can be called 100 times per day. This limit can be increased. Exceeding it returns the 403 error "chatroom broadcast limit exceeded".

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/chatrooms/broadcast
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

- Send a text broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "txt",
        "msg": "send broadcast to all chatroom"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send an image broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "img",
        "filename":"testimg.jpg",
        "secret":"VfXXXXNb_",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/55f12940-XXXX-XXXX-8a5b-ff2336f03252",
        "size":{
           "width":480,
           "height":720
        }
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a voice broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "audio",
        "url": "https://XXXX/XXXX/XXXX/chatfiles/1dfc7f50-XXXX-XXXX-8a07-7d75b8fb3d42",
        "filename": "testaudio.amr",
        "length": 10,
        "secret": "HfXXXXCjM"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a video broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "video",
        "thumb" : "https://XXXX/XXXX/XXXX/chatfiles/67279b20-7f69-11e4-8eee-21d3334b3a97",
        "length" : 0,
        "secret":"VfXXXXNb_",
        "file_length" : 58103,
        "thumb_secret" : "ZyXXXX2I",
        "url" : "https://XXXX/XXXX/XXXX/chatfiles/671dfe30-XXXX-XXXX-ba67-8fef0d502f46"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a file broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "file",
        "filename":"test.txt",
        "secret":"1-g0XXXXua",
        "url":"https://XXXX/XXXX/XXXX/chatfiles/d7eXXXX7444"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a location broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "loc",
        "lat": "39.966",
        "lng":"116.322",
        "addr":"中国北京市海淀区中关村"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a command broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "cmd",
        "action":"action1"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

- Send a custom broadcast message

```bash
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "msg": {
        "type": "custom",
        "customEvent": "custom_event"
    },
    "from": "admin",
    "ext": {
        "extKey": "extValue"
    },
    "chatroom_msg_level": "low"
}'
```

## Request header fields

For details about the `Content-Type` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The following is the request body for sending a text broadcast message.

| Parameter | Type   | Required | Description |
| :-------------- | :----- | :------- | :--------------- |
| `from`          | String | No       | User ID of the broadcast message sender. If this field is omitted, the server sets it to the admin, "admin", by default. If the field is included but its value is an empty string (""), the request fails. |
| `chatroom_msg_level` | String | No       | Chat room message priority:<br/> - `high`: High.<br/> - (Default) `normal`: Normal.<br/> - `low`: Low. |
| `msg` | JSON | Yes | Information contained in the message body. |
| `msg.type` | String | Yes | Broadcast message type:<br/> - `txt`: Text message.<br/> - `img`: Image message.<br/> - `audio`: Voice message.<br/> - `video`: Video message.<br/> - `file`: File message.<br/> - `loc`: Location message.<br/> - `cmd`: Command message.<br/> - `custom`: Custom message. |
| `msg.msg` | String | Yes | Message content. |
| `ext`           | JSON   | No       | Broadcast messages support extension fields for adding custom information. This parameter cannot be `null`. Push notifications also support custom extension fields. For details, see [APNs custom display](/document/ios/push/push_display_field.md) and [Android push fields](/document/android/push/push_display_field.html). |

The request bodies for different message types differ only in the `msg` field; all other parameters are the same. Except for `type`, the parameters in `msg` have the same meanings as those in `body` for chat room messages. For details, see the parameters for each message type.
- [Send image messages](message_chatroom.html#send-image-messages)
- [Send voice messages](message_chatroom.html#send-voice-messages)
- [Send video messages](message_chatroom.html#send-video-messages)
- [Send file messages](message_chatroom.html#send-file-messages)
- [Send location messages](message_chatroom.html#send-location-messages)
- [Send command messages](message_chatroom.html#send-command-messages)
- [Send custom messages](message_chatroom.html#send-custom-messages)

## Response example

```json
{
  "path": "/messages/chatrooms/broadcast",
  "uri": "https://XXXX/XXXX/XXXX/messages/chatrooms/broadcast",
  "timestamp": 1699944653964,
  "organization": "easemob-demo",
  "application": "331d42e6-ad85-460f-b6b0-d1fb6fef9f12",
  "action": "post",
  "data": {
    "id": 1173998498812376874
   },
  "duration": 1,
  "applicationName": "wang"
}
```

## Response body fields

The response contains the same fields for all broadcast message types.

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter | Type | Description |
| :----- | :--- | :----------- |
| `data.id` | JSON | Broadcast ID. |

The other fields in the response body are described below:

| Field | Type   | Description |
| :------------- | :----- | :---------------------- |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `action`          | String | Request method.                                                                     |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `applicationName` | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

| HTTP status code | Error type   | Error message      | Possible cause    | Recommendation     |
|:---------|:-------------------|:-----------------|:-----------|:----------|
| 400      | invalid_request_body    | Request body is invalid. Please check body is correct. | The request body is incorrectly formatted. | Check whether the request body is valid, including the field types. |
| 400      | illegal_argument | from can't be empty  | The `from` request parameter is an empty string. | Enter a valid `from` request parameter. If this field is omitted, the server sets it to `admin` by default. |
| 400      | illegal_argument | ext must be JSONObject | The `ext` request parameter has an incorrect type. | Enter a valid `ext` request parameter in JSON format. |
| 403      | forbidden_op | chatroom broadcast limit exceeded  | The daily API call limit, 100 calls by default, has been exceeded. | Contact the sales team to increase the frequency limit. |
| 429     | - | This request has reached api limit | The API can be called 10 times per minute and once per second. | These limits cannot be increased. Reduce the call frequency. |
| 403      | forbidden_op | message broadcast service is unopened  | The broadcast messaging feature is not activated. | Contact the sales team for activation. |

For other errors, see [Response status codes](error.html) for possible causes.
