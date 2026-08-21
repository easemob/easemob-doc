# Set the Storage Method for Specified Message Attachments

## Feature overview

- Set a storage method for a user's specified message attachments to extend their storage period or store them permanently.
- This API supports attachments, including image and video thumbnails, uploaded when sending image, voice, video, file, and combined messages through clients or the REST API.
- Users can retrieve permanently stored message attachments at any time.
- For message attachment storage limits, see [Message attachment storage](/product/message_store.html#historical-message-storage).
- To use this API, **contact the EasyIM business manager to enable it**.

## Call frequency limit

100 requests per second per App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/users/{username}/chatfiles/lifetime
```

| Parameter     | Type   | Required | Description                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `username`  | String    | Yes       | The user ID. Set the storage method for the specified message attachments of this user. |

For descriptions of the other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourUserToken> with your user token
curl -X PUT "https://localhost/{org}/{app}/users/{username}/chatfiles/lifetime" \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <YourUserToken>" \
-d '{
          "lifetime": "default",
          "chatfile_ids": [
            "2fe7f0b0-0b55-XXXX-XXXX-231441e42458"
          ]
    }'
```

## Request header fields

For descriptions of the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header field descriptions](overview.html#request-header-fields).
    
## Request body fields

| Parameter       | Type   | Required | Description          |
| :--------- | :----- | :------- | :-------------------------------------------- |
| `lifetime`      | String   | Yes | The message attachment storage period:<br/> - (Default) `default`: Use the configured default validity period for message attachments.<br/> - `refresh`: Refresh the validity period of the message attachments. This resets and extends the storage period. For example, assume a message attachment can be stored for 7 days. If you call this API on the fifth day and set the attachment storage period to 7 days, the attachment then has 7 days of storage remaining. You can use this setting to extend the storage period of combined message attachments. For example, if an original image has only 1 day of storage remaining when you send a combined message, you can extend its storage period with this setting.<br/> - `forever`: Store permanently. |
| `chatfile_ids`      | Array   | Yes | The file UUIDs of the message attachments. You can pass up to 100 UUIDs. | 

## Response example

```json
{
  "path": "/users/test/chatfiles/lifetime",
  "uri": "https://XXXX/XXXX/XXXX/users/test/chatfiles/lifetime",
  "timestamp": 1731382587142,
  "organization": "XXXX",
  "application": "2a8f5b13-XXXX-XXXX-958a-838fd47f1223",
  "action": "put",
  "data": {
      "359f9c50-XXXX-XXXX-92cd-07eff71e8a37": "success"
  },
  "duration": 102,
  "applicationName": "XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `data`               | JSON   | Whether the message attachment storage method was set successfully:<br/> - `success`: Success.<br/> - `failed`: Failure. |

The other fields in the response body are described below:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `path`               | String | The request path, which is part of the request URL. You do not need to pay attention to this field.       |
| `uri`                | String | The request URL.                |
| `timestamp`          | Long   | The Unix timestamp of the HTTP response, in milliseconds.       |
| `organization`       | String | The unique identifier that EasyIM assigns to each company or organization. This value is the same as the request parameter `org_name`.          |
| `application`        | String | The unique identifier generated for the app in the system. You do not need to pay attention to this field.          |
| `action`             | String | The request method.                                   |
| `duration`           | Long   | The time elapsed from sending the HTTP request to receiving the response, in milliseconds.     |
| `applicationName`    | String | The app name you entered when creating the app in the EasyIM Console. This value is the same as the request parameter `app_name`.    |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and may return the following error codes:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 403                 | forbidden_op        |                 | The message attachment storage feature is not enabled.          | Contact the EasyIM business manager to enable the feature.          |
| 400                 | illegal_argument   | chatfile_ids size is too large    | The number of message attachment file IDs passed in `chatfile_ids` exceeds the limit of 100.  | Pass no more than 100 message attachment file IDs.|
| 400               | illegal_argument   |  lifetime must be either 'forever' or 'default' or 'refresh'。     | The value passed in `lifetime` is not `forever`, `default`, or `refresh`.       | Set `lifetime` only to `forever`, `default`, or `refresh`.          |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid. It may have expired or be incorrect. | Use a new token to access the API. |

For other errors and their possible causes, see [Error code](error.html).
