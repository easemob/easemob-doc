# Modify Chat Room Information

## Feature overview

- Modify information for the specified chat room.
- You can modify only the chat room name, description, and maximum number of members.
- Modifying chat room information triggers a post-delivery callback. For details, see [Chat Room Information Modified](callback_group_room_info.html).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/chatrooms/{chatroom_id}
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `chatroom_id` | String | Yes       | Chat room ID. The API modifies the information for this chat room.  |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/chatrooms/662XXXX13'  \
-H 'Content-Type: application/json'    \
-H 'Accept: application/json'      \
-H 'Authorization: Bearer <YourAppToken>'    \
-d '{
   "name": "testchatroom",
   "description": "test",
   "maxusers": 300
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

You can modify only the chat room name, description, and maximum number of members.

| Parameter          | Type   | Required | Description        |
| :------------ | :----- | :------- | :------------- |
| `name`        | String | Yes       | Chat room name. It cannot exceed 128 characters.     |
| `description` | String | Yes       | Chat room description. It cannot exceed 512 characters.     |
| `maxusers`    | Int    | Yes       | Maximum number of chat room members, including the chat room owner. The maximum value that can be set by default is 10,000. To adjust it, contact the EasyIM business manager. |

## Response example

```json
{
  "data": {
    "description": true,
    "maxusers": true,
    "groupname": true
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following `data` field:

| Field     | Type | Description          |
| :----------------- | :--- | :---------------- |
| `data`   | JSON | Actual response data.                         |
| - `groupname`   | Bool | Whether the chat room name was successfully modified.<br/> - `true`: Yes.<br/> `false`: No.                           |
| - `description` | Bool | Whether the chat room description was successfully modified.<br/> - `true`: Yes.<br/> `false`: No.                           |
| - `maxusers`    | Bool | Whether the maximum number of chat room members, including the chat room owner, was successfully modified.<br/> - `true`: Yes.<br/> `false`: No. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | resource_not_found | grpID XX does not exist! | The chat room ID does not exist. | Specify a valid chat room ID. |
| 403     | exceed_limit | title cannot exceed to XXXX| The chat room name exceeds the limit. | Specify a chat room name whose length is within the allowed range. |
| 403     | exceed_limit | desc cannot exceed to XXXX | The chat room description exceeds the limit. | Specify a chat room description whose length is within the allowed range. |
| 403     | exceed_limit | maxUsers cannot exceed XXXX | The maximum number of chat room members exceeds the limit. | Specify a valid maximum number of members. |
| 400     | invalid_parameter  | "some of [chatroom_id] are not valid fields"  | When modifying chat room information, an unsupported parameter is specified, such as modifying `chatroom_id`. You can modify only the chat room name, description, and maximum number of members.| 

For other errors, see [Response status codes](error.html) for possible causes.
