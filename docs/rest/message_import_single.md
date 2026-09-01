# Import a One-to-One Chat Message

## Feature overview

You can import one-to-one chat messages during data migration:
- **One message per import**: Each API call supports importing **only one one-to-one chat message**.
- **Conversation constraint**: Importing a message does not automatically create a one-to-one chat conversation. If no one-to-one chat conversation exists between the two users, importing the message still does not create one.
- **Order requirement**: Import messages in chronological order so that earlier messages are imported first.
- **Roaming retrieval**: After a message is imported successfully, the client must actively retrieve roaming messages to view it.
- **Attachment message description**: The process for importing attachment messages differs from the process for sending them. For details, see [Attachment message import workflow](#message-import-workflow) and [Attachment message import description](#attachment-message-import) below.

## Message import workflow

- Text, location, command, and custom messages: Call this API directly and pass the relevant parameters to import the message.
- Image, voice, video, and file messages: **Call this API directly and pass the attachment URL from your service. You do not need to call the file upload API first.** Set `need_download=true` to specify whether the attachment needs to be downloaded and uploaded to the server. Make sure the attachment URL has no access restrictions.

The attachment message import workflow is as follows:

![img](/images/server-side/message_import_single.png)

The steps are described below:

1. When calling the one-to-one chat message import API, you can pass the attachment URL from your service directly in `body.url` without first calling the upload API.
2. Decide whether to set `need_download` to `true` based on your business needs.
3. If `need_download=true`, the EasyIM server retrieves the attachment and saves it to the EasyIM file service.
4. If `need_download=false`, the attachment is not automatically saved to the EasyIM file service, and subsequent access continues to depend on the original URL from your service.
5. After the message is imported successfully, the client can retrieve roaming messages as needed to view the result. If the attachment has been saved to the EasyIM file service, it can subsequently be downloaded through `/chatfiles/{file_uuid}`.
6. If a file to be downloaded later has restricted access, include the corresponding access key as required by the download API.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/messages/users/import
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

Import a text message:

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -X POST "https://XXXX/XXXX/XXXX/messages/users/import"   \
-H "Authorization: Bearer <YourAppToken>"    \
-d '{
    "target": "username2",
    "type": "txt",
    "body": {
        "msg": "import message."
    },
    "ext": {
      "key1": "value1"
    },
    "from": "username1",
    "msg_timestamp": 1656906628428
}'
```

Import an image message:

```bash
# Replace <YourAppToken> with the app token generated on your server
curl -X POST "https://XXXX/XXXX/XXXX/messages/users/import"   \
-H "Authorization: Bearer <YourAppToken>"   \
-d '{
    "target": "username2",
    "type": "img",
    "body": {
        "url": "<YourImageUrl>",
        "filename": "<ImageFileName>",
        "size": {
            "width": 1080,
            "height": 1920
        }   
    },
    "ext": {
        "key1": "value1"
    }, 
    "from": "username1",
    "msg_timestamp": 1656906628428,
    "need_download": true
}'
```

## Request header fields

For a description of the `Authorization` field, see [Request header field descriptions](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description        |
| :-------------- | :----- | :------- | :------------------------------------------------ |
| `from`          | String | Yes       | The user ID of the message sender.        |
| `target`        | String | Yes       | The user ID of the message recipient.          |
| `type`          | String | Yes       | The message type:<br/> - `txt`: Text message.<br/> - `img`: Image message.<br/> - `audio`: Voice message.<br/> - `video`: Video message.<br/> - `file`: File message.<br/> - `loc`: Location message.<br/> - `cmd`: Command message.<br/> - `custom`: Custom message. |
| `body`          | JSON   | Yes       | The message content. Only the content of `body` differs among message types. This field has the same meaning as it does when sending one-to-one chat messages. For details, see the [body field descriptions for each one-to-one chat message type](message_single.html#request-body-fields).    |
| `ext`   | JSON   | No       | The message extension field, to which you can add custom information. For example, `"key1": "value1"`.  |
| `msg_timestamp` | Long   | No       | The timestamp of the message to import, in milliseconds.<br/> - If this parameter is not passed, the EasyIM server sets the import time to the current time.<br/> - The value cannot be `0` or less than 1000 milliseconds.<br/> - **Order constraint**: The value must be greater than the timestamp of the last message imported into the same one-to-one chat conversation. Import messages in chronological order.  |
| `need_download` | Bool   | No       | Whether the EasyIM server retrieves the attachment and saves it to the EasyIM file service.<br/> - `true`: Yes. Make sure that the EasyIM server can directly access `body.url` and that the URL returns actual, valid attachment content.<br/> - (Default) `false`: No. EasyIM does not actively save the attachment, and attachment access continues to depend on the original URL from your service.|

### Attachment message import

For attachment messages such as image, voice, video, and file messages, **importing an attachment message** uses a different process from **sending an attachment message**. When importing an attachment message, you can directly use the attachment URL from your service. When sending an attachment message, first call the file upload API, and then use the EasyIM file URL returned after upload to construct the message body.

When importing attachment messages, note the following:

- When calling this API to import an attachment message, you can pass the attachment URL from your service directly in `body.url`. **You do not need to call the file upload API first to upload the attachment to the EasyIM file service.**
- If `need_download` is set to `true`, the EasyIM server retrieves the attachment content at `body.url` and saves it to the EasyIM file service for subsequent download or playback by the client.
- The attachment URL supplied by your service must be **reliably accessible** to the EasyIM server and must **directly return actual, valid attachment content**. Avoid URLs that require login authentication, use short-lived temporary signatures, are accessible only in a browser, return an error page, or redirect to a restricted page.
- If the source URL cannot be accessed or does not return valid attachment content, the message might still be imported successfully, but the client might be unable to play, download, or display the attachment correctly.

## Response example

```json
{
  "path": "/messages/users/import",
  "uri": "https://XXXX/XXXX/XXXX/messages/users/import",
  "timestamp": 1638440544078,
  "organization": "XXXX",
  "application": "c3624975-XXXX-XXXX-9da2-ee91ed4c5a76",
  "entities": [],
  "action": "post",
  "data": {
    "msg_id": "10212123848595"
  },
  "duration": 3,
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body contains the following field:

| Field     | Type   | Description                    |
| :------- | :----- | :---------------------- |
| `msg_id` | String | The message ID returned for the imported message. |

The other fields in the response body are described below:

| Field           | Type   | Description                        |
| :------------- | :----- | :---------------------- |
| `path`               | String | The request path, which is part of the request URL. You do not need to pay attention to this field.       |
| `uri`             | String | The request URL.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `organization`    | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`. |
| `application`     | String | The unique identifier of the app in the system. It is generated by the system. You do not need to pay attention to this field.                     |
| `action`          | String | The request method.                                                                     |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |
| `applicationName` | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message       | Possible cause    | Recommendation       |
|:---------|:-------------------|:--------------|:--------------|:----------------------|
| 400      | invalid_request_body     | Request body is invalid. Please check body is correct.    | The request body format is incorrect.  | Check whether the request body is valid, such as whether the field types are correct. |
| 400      | illegal_argument   | message body not allow empty  | The `body` request parameter is empty.  | Provide a valid `body`.         |
| 400      | illegal_argument    | type not allow empty  | The `type` request parameter is an empty string. | Provide a valid `type` request parameter.         |

For other error codes and their possible causes, see [Response status codes](error.html).
