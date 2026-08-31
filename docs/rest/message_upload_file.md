# Upload a File

This article describes how to call the REST API to upload message attachments to the EasyIM server.

## Feature overview

- Before sending an attachment message, such as an image, voice, video, or another type of file message, upload the file to your own server or the EasyIM server.
- The file ID (`file_uuid`), file URL (`uri`), and file access key (`share-secret`) returned in the upload response can be used to construct attachment messages and download attachments. For details, see [Attachment message sending workflow](message_single.html#attachment-message-sending-workflow) and [Download an attachment](message_download_file.html).

#### Image upload description

- After you upload an original image, the EasyIM server automatically generates a thumbnail.
- If the uploaded image is 10 KB or smaller, the thumbnail is the same as the original image.
- If the image exceeds 10 KB, the EasyIM server generates a thumbnail based on the image height and width set in the request through the `thumbnail-height` and `thumbnail-width` parameters. If neither parameter is passed, the thumbnail height and width both default to 170 pixels.

#### Video upload description

- The EasyIM server does not automatically generate thumbnails for video files. You must upload the source video file and, if needed, its thumbnail.
- When uploading a video file, you do not need to pass `thumbnail-height` or `thumbnail-width`.
- When uploading a video thumbnail, if the image is 10 KB or smaller, the uploaded image itself is used as the thumbnail.
- If the uploaded video thumbnail exceeds 10 KB, the EasyIM server generates a thumbnail based on `thumbnail-height` and `thumbnail-width`. If neither parameter is passed, the height and width both default to 170 pixels.

#### Other file upload description

- Voice files and other file types can be uploaded.
- For voice files and other ordinary files, the server does not generate thumbnails, and you do not need to pass `thumbnail-height` or `thumbnail-width`.

#### File restrictions

- By default, an uploaded file cannot exceed 10 MB. An upload fails if the file exceeds this limit.
- **Restricted file access is supported. To use this feature, contact the EasyIM business manager to enable it.** After this feature is enabled, you must use the `share-secret` returned in the file upload response to download a restricted file. When message callbacks, including pre-delivery and post-delivery callbacks, and historical message retrieval involve downloading files, append the key to the download URL as follows: `{{url}}?share-secret={{secret}}`.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/chatfiles
```

For descriptions of the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

The following example uploads an image. When uploading a video, voice file, or another file type, some request parameters and processing methods differ. For details, see [Feature overview](#feature-overview).

```shell
# Replace <YourAppToken> with the app token generated on your server, and replace the file path with the full local path of the file to upload
curl -X POST 'https://XXXX/XXXX/XXXX/chatfiles'  \
-H 'Authorization: Bearer <YourAppToken>'   \
-H 'Content-Type: multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW'   \
-H 'restrict-access: true'   \
-H 'thumbnail-height: 180' \
-H 'thumbnail-width: 180' \
-F 'file="@/Users/test/9.2/easemob/image/IMG_2953.JPG"'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).

| Parameter              | Type   | Required | Description      |
| :---------------- | :----- | :------- | :------------------------ |
| `restrict-access` | Bool   | No       | Whether to restrict access to the file:<br/> - `true`: Yes. The user needs the file access key (`share-secret`) obtained from the response body to download the file.<br/> - `false`: No. Access is not restricted, and the user can download the file directly.<br/><Container type="tip" title="Tip">To use restricted file access, contact the EasyIM business manager to enable it.</Container>|
| `thumbnail-height` | Int    | No       | The thumbnail height in pixels.<br/> - If the uploaded original image or video thumbnail is smaller than 10 KB, the uploaded image itself is used as the thumbnail.<br/> - If the uploaded image exceeds 10 KB, the thumbnail height depends on this parameter.<br/> - If this parameter is not passed, the thumbnail height defaults to 170 pixels. You can also modify the default value on the **Chat** > **Features > Message & Conversation** page of the [EasyIM Console](https://console.easyim.ai/user/login). |
| `thumbnail-width`  | Int    | No       | The thumbnail width in pixels.<br/> - If the uploaded original image or video thumbnail is smaller than 10 KB, the original image itself is used as the thumbnail.<br/> - If the uploaded image exceeds 10 KB, the thumbnail width depends on this parameter.<br/> - If this parameter is not passed, the thumbnail width defaults to 170 pixels. You can also modify the default on the **Chat** > **Features > Message & Conversation** page of the [EasyIM Console](https://console.easyim.ai/user/login).   |

## Request body fields

| Parameter               | Type   | Required | Description        |
| :----------------- | :----- | :------- | :--------------- |
| `file`             | String | Yes       | The local file path.    |

## Response example

```json
{
  "action": "post",
  "application": "8be024f0-XXXX-XXXX-b697-5d598d5f8402",
  "path": "/chatfiles",
  "uri": "https://XXXX/XXXX/XXXX/chatfiles",
  "entities": [
    {
      "uuid": "5fd74830-XXXX-XXXX-822a-81ea50bb049d",
      "type": "chatfile",
      "share-secret": "X9dXXXX7Yc"
    }
  ],
  "timestamp": 1554371126338,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                    | Type   | Description         |
| :---------------------- | :----- | :------------------ |
| `entities`       | JSON Array | The response data.                          |
|  - `uuid`         | String | The file ID, which is the unique identifier that EasyIM assigns to the file. This parameter is used in the following scenarios:<br/> - [Send an attachment message](message_single.html#attachment-message-sending-workflow)<br/> - [Download a message attachment](message_download_file.html)<br/> - [Download a message thumbnail](message_download_thumbnail.html).  |
|  - `type` | String | The file type. The fixed value is `chatfile`.   |
|  - `share-secret` | String | The file access key. Save `share-secret` so that you can use it when [downloading the file](message_download_file.html). |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | The request method.                                                                     |
| `application`     | String | The unique identifier of the app in the system. The identifier is generated by the system. You do not need to pay attention to this field.                     |
| `uri`             | String | The file URL.                                                                     |
| `timestamp`       | Long   | The Unix timestamp, in milliseconds.                                                      |
| `duration`        | Int    | The time elapsed from sending the request to receiving the response, in milliseconds.                                           |
| `organization`    | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`. |
| `applicationName` | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`. |

If the returned HTTP status code is not `200`, the request fails. See [Response status codes](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code | Error type    | Error message          | Possible cause          | Recommendation        |
|:---------|:-------------------|:---------------|:--------------|:------------|
| 400      | illegal_argument | file must be provided.   | The `file` request parameter is not passed.   | Enter the correct `file` request parameter. |
| 413      | file exceeding maximum limit | the file size exceeds the maximum limit.    | The uploaded file exceeds the maximum size. | Specify a `file` of the correct size. By default, message attachments such as images, audio, video, and other files cannot exceed 10 MB. To increase this limit, contact the EasyIM business manager. |

For other errors and their possible causes, see [Response status codes](error.html).
