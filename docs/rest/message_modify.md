# Edit a Message

## Feature overview

EasyIM allows you to edit successfully sent messages in one-to-one chats, group chats, and chat rooms on the server:

 - Text messages: You can edit the message content field `msg` and extension field `ext`.
 - Custom messages: You can edit `customEvent`, `customExts`, and the extension field `ext`.
 - Image, voice, video, file, and location messages: You can edit only the extension field `ext`.
 - Command messages: Editing is not supported.

#### Message lifecycle after editing

There is no time limit for editing a message. You can edit a message as long as it is still stored on the server. After a message is edited, its lifecycle, or storage period on the server, is recalculated. For example, assume a message can be stored on the server for 180 days. The user edits it on day 30 after it was sent, when 150 days of storage remain. After the message is edited successfully, it can be stored on the server for another 180 days.

#### Changes after editing a message

For an edited message, in addition to changes to the content or extension fields, the message body includes new properties for the editor's user ID, edit time, and number of edits. Other message information outside the message body, such as the sender and recipient, does not change.

## Feature activation

To use this feature, **contact the EasyIM business manager to enable it**.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/messages/rewrite/{msg_id}
```

| Parameter            | Type   | Required | Description            |
| :-------------- | :----- | :------- | :------------------------------------------ |
| `msg_id`  | String | Yes  | The ID of the message to edit.     |

## Request example

- Edit a successfully sent text message. You can edit the `msg` and `ext` fields.

```bash
# Replace <YourAppToken> with the app token generated on your server

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "txt",
    "msg": "update message content"
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```

- Edit a successfully sent custom message. You can edit the `customEvent`, `customExts`, and `ext` fields.

```bash
# Replace <YourAppToken> with the app token generated on your server

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "custom",
    "customEvent": "custom_event",
    "customExts":{
      "ext_key1":"ext_value1"
    }
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```

- Edit a successfully sent location, image, audio, video, or file message. You can edit the `ext` field.
  
  The following example edits a sent image message. For other message types, only the value of `type` differs.

```bash
# Replace <YourAppToken> with the app token generated on your server

curl -X PUT -i 'https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "user": "user1",
  "new_msg": { 
    "type": "image"
  },
  "new_ext": { 
    "key1": "value1",
    "key2": "value2"
  },
  "is_combine_ext": true
}'
```


## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :--------------- |
| `user`| String | No | The user editing the message.|
| `new_msg` | JSON | Yes | The edited message.|
| `new_msg.type` | String | Yes | The type of message to edit:<br/> - `txt`: Text message.<br/> - `loc`: Location message.<br/> - `img`: Image message.<br/> - `audio`: Audio message.<br/> - `video`: Video message.<br/> - `file`: File message.<br/> - `custom`: Custom message.|
| `new_msg.msg` | String | Yes | The edited message content. **This field applies only to text messages.**|
| `new_msg.customEvent` | String | No      | The custom event type. The value must match the regular expression `[a-zA-Z0-9-_/\.]{1,32}` and contain 1-32 characters. **This field applies only to custom messages.**  |
| `new_msg.customExts`  | JSON   | No       | Custom event properties. The type must be `Map<String,String>`, with up to 16 elements. **This field applies only to custom messages.** |
| `new_ext` | JSON | No | The edited message extension information. This field applies to text, custom, location, image, audio, video, and file messages.|
| `is_combine_ext` | Boolean | No | Whether to merge the edited message extension information with the original extension information or replace it.<br/> - (Default) `true`: Merge.<br/> - `false`: Replace.|

## Response example

```json
{
  "path": "/messages/rewrite/1235807318835202004",
  "uri": "https://XXXX/XXXX/XXXX/messages/rewrite/1235807318835202004",
  "timestamp": 1705372388118,
  "organization": "XXXX",
  "application": "ff678832-XXXX-XXXX-8130-58ac38cb6c15",
  "action": "put",
  "data": "success",
  "duration": 49,
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter              | Type   | Description          |
| :---------------- | :----- | :------------------------------- |
| `data` | String | The value is `success`, indicating that the message was edited successfully.|

The other fields are described below:

| Parameter              | Type   | Description          |
| :---------------- | :----- | :------------------------------- |
| `path`            | String | The request path, which is part of the request URL. You do not need to pay attention to this field.      |
| `uri`             | String | The request URL.     |
| `timestamp`       | Long   | The Unix timestamp of the HTTP response, in milliseconds.  |
| `organization`    | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`. |
| `application`     | String | The unique identifier of the app in the system. The identifier is generated by the system. You do not need to pay attention to this field.                     |
| `action`          | String | The request method.     |
| `duration`        | Int    | The time elapsed from sending the HTTP request to receiving the response, in milliseconds. |
| `applicationName` | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

If the REST API returns an HTTP status code other than `200`, the request fails and may return the following error codes:

| HTTP status code | Error type   | Error message   | Possible cause      | Recommendation     |
|:---------|:-------------------|:----------------------|:------------------|:----------------------|
| 400      | invalid_request_body   | Request body is invalid. Please check body is correct.   | The request body format is incorrect. | Check whether the request body is valid, including whether the field types are correct. |
| 400      |  illegal_argument  | new_msg is required     | The `new_msg` request parameter is empty.  | Provide a valid `new_msg` request parameter. |
| 400      | message_rewrite_error    | The message is of a type that is currently not supported for modification. | The content of the `msg.type` request parameter is incorrect. | Provide a valid `msg.type` request parameter.|
| 400 | InvalidMessageIdException  | The provided message ID is not a valid number.  | The message ID must be numeric. | Pass only digits in the message ID.   |
| 404      | message_rewrite_error  | The message is unavailable or has expired.   | The `msg_id` request parameter does not exist. | Provide a valid `msg_id` request parameter.     |
| 401      | message_rewrite_error   | You are not authorized to edit this message.   | The `msg_id` request parameter is incorrect. | Provide a valid `msg_id` request parameter. |
| 403      | message_rewrite_error   | The message has reached its edit limit and cannot be modified further.   | The number of edits to message `msg_id` has reached the upper limit. | Limit the number of message edits to 10.   |
| 403      | message_rewrite_error   | The rewrite message feature is not open.   | The message editing feature is not enabled.  | Contact the EasyIM business manager to enable message editing.  |
| 404 | MessageUnavailableException  | The message is unavailable or has expired.   | The message to edit does not exist or has expired. | You can edit only messages stored on the server. If a message does not exist or has expired, it cannot be edited.|
| 409         | concurrent_operation_error         | The message has been edited by another.    | The message editing API was called concurrently to edit the same message. | Avoid sending simultaneous requests to edit the same message.  |
| 500 | RewriteMessageInternalErrorException | An unknown error occurred while processing the request.   | An internal service exception caused message editing to fail. |    |

For other exceptions and their possible causes, see [Response status codes](error.html).


