# Force Delete Chat Room Custom Attributes

## Feature overview

- Force delete chat room custom attributes. In addition to custom attributes set by the current user, this method can delete those set by other users.
- You can delete up to 10 custom attributes at a time.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

| Parameter           | Type   | Required | Description                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | Yes       | Chat room ID. |
| `username` | String | Yes       | User ID of the user who owns the chat room custom attributes to force delete. |

For instructions on other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl  -X DELETE 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1/forced'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "keys": ["key1","key2"]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter   | Type  | Required | Description                                                           |
| :----- | :---- | :------- | :------------------------------------------------------------- |
| `keys` | Array | No       | List of chat room custom attribute names. You can specify up to 10 custom attribute names at a time. |

## Response example

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field               | Type   | Description                                                                     |
| :----------------- | :----- | :----------------------------------------------------------------------- |
| `data` | JSON  | Actual response data.                                     |
| - `successKeys` | Array  | List of chat room attribute names successfully deleted.                                           |
| - `errorKeys`   | Object | Chat room attributes that failed to be deleted. The returned key-value pairs use the attribute name as the key and the reason for failure as the value. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | The number of attribute keys to delete exceeds 10. | Specify no more than 10 keys. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |

For other errors, see [Response status codes](error.html) for possible causes.
