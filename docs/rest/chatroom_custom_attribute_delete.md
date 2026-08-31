# Delete Chat Room Custom Attributes

## Feature overview

- Delete the chat room custom attributes set by a user.
- You can delete only custom attributes set by the current user, not those set by other members.
- You can delete up to 10 custom attributes at a time.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}
```

| Parameter           | Type   | Required | Description                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | Yes       | Chat room ID. |
| `username` | String | Yes       | User ID of the user who owns the chat room custom attributes to delete. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X DELETE 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1'   \
-H 'Content-Type: application/json'   \ 
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'   \ 
-d '{
    "keys": ["key1","key2"]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter   | Type  | Required | Description                                                         |
| :----- | :---- | :------- | :----------------------------------------------------------- |
| `keys` | Array | No       | List of chat room custom attribute names. You can specify up to 10 custom attribute names at a time. |

## Response example

```json
{
  "uri":"https://XXXX/XXXX/XXXX/metadata/chatroom",
  "status":"ok",
  "timestamp":1716887320215,
  "action":"delete",
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field               | Type   | Description                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data` | JSON  | Response data.                                         |
| - `successKeys` | Array  | List of chat room attribute names successfully deleted.                                           |
| - `errorKeys`   | Object | Chat room attributes that failed to be deleted. The returned key-value pairs use the attribute name as the key and the reason for failure as the value. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `uri`             | String | Request URL. |
| `status`          | String | Request status. If the request is successful, `ok` is returned. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `action`          | String | Request method. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | The number of attribute keys to delete exceeds 10. | Specify no more than 10 keys. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 401     | MetadataException | user is not in chatroom | The user is not in the chat room. | Specify the correct user ID of a chat room member. |

For other errors, see [Response status codes](error.html) for possible causes.
