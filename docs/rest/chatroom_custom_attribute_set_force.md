# Force Set Chat Room Custom Attributes

## Feature overview

- Force set custom attributes for the specified chat room.
- This API can overwrite chat room custom attributes set by other users.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}/user/{username}/forced
```

| Parameter           | Type   | Required | Description                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | Yes       | Chat room ID. |
| `username` | String | Yes       | User ID of the user who owns the chat room custom attributes to force set. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13/user/user1/forced'   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "metaData": {
        "key1": "value1",
		    "key2": "value2"
    },
    "autoDelete": "DELETE"
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter         | Type   | Required | Description   |
| :----------- | :----- | :------- | :---------- |
| `metaData`   | JSON   | Yes       | Chat room custom attributes, stored as a collection of key-value pairs, that is, Map<String,String>. The collection can contain up to 10 key-value pairs. In each pair, the key is the attribute name and can contain up to 128 characters; the value is the attribute value and cannot exceed 4096 characters. Each chat room can have up to 100 custom attributes, and the total size of chat room custom attributes for each app is 10 GB.<br/> The key supports the following characters:<br/> • 26 lowercase letters a-z;<br/> • 26 uppercase letters A-Z;<br/> • 10 digits 0-9;<br/> • "\_", "-", ".". |
| `autoDelete` | String | No   | Whether to automatically delete this custom attribute when the current member leaves the chat room. <br/> • (Default) 'DELETE': Yes. <br/> • 'NO_DELETE': No.    |

## Response example

```json
{
  "data": {
    "successKeys": ["key1"],
    "errorKeys": { "key2": "errorDesc" }
  }
}
```

Because this API sets chat room custom attributes in batches, you can specify multiple key-value pairs at a time. Even if validation fails for some key-value pairs, the other pairs are still written normally, and the response status code remains `200`, as shown below:

```json
{
    "uri": "%s/easemob-demo/chatdemoui/metadata/chatroom",
    "timestamp": 1720769458528,
    "action": "put",
    "data": {
        "successKeys": [],
        "errorKeys": {
            "key1": "properties key 'key1' is exceeding maximum limit 128",
            "key2": "properties key 'key2' is exceeding maximum limit 128"
        }
    }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field               | Type   | Description                                                                     |
| :----------------- | :----- | :---------------------------- |
| `data` | JSON  | Actual response data.                                     |
| - `successKeys` | Array  | List of chat room attribute names successfully set.                                           |
| - `errorKeys`   | Object | Chat room attributes that failed to be set. The returned key-value pairs use the attribute name as the key and the reason for failure as the value. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     |  | exceed allowed batch size 10 | The number of attribute keys to set exceeds 10. | Specify no more than 10 keys. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 401     | MetadataException | user is not in chatroom | The user is not in the chat room. | Specify the correct user ID of a chat room member. |

For other errors, see [Response status codes](error.html) for possible causes.
