# Create a Chat Room

## Feature overview

- Create a chat room.
- **Only chat room superadmins have permission to create chat rooms on the client.**
- You can set the chat room name, description, maximum number of members (including admins), chat room admins and regular members, and chat room extension information.
- Creating a chat room triggers a post-delivery callback. For details, see [Chat room creation webhook event](callback_group_room_create.html).

## Call frequency limit

50 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/chatrooms
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/chatrooms' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
   "name": "testchatroom1",
   "description": "test",
   "maxusers": 300,
   "owner": "user1",
   "members": [
     "user2"
   ]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter          | Type   | Required | Description                                                                            |
| :------------ | :----- | :------- | :------------------------------------------------------------------------------ |
| `name`        | String | Yes       | Chat room name. The maximum length is 128 characters.                                             |
| `description` | String | Yes       | Chat room description. The maximum length is 512 characters.                                             |
| `maxusers`    | Int    | No       | Maximum number of chat room members, including the chat room owner. The value range is [1, 10,000], and the default value is `1000`. To adjust this limit, contact the EasyIM business manager. |
| `owner`       | String | Yes       | Chat room owner.                                                                |
| `members`     | Array  | No       | Array of user IDs of regular chat room members and admins, excluding the chat room owner's user ID. The number of elements in the array cannot exceed the value of `maxusers`. If you specify this parameter, include at least one array element.<Container type="tip" title="Tip"> Users added when the chat room is created remain in the chat room if they have never logged in.</Container>   |
| `custom`      | String | No       | Chat room extension information. For example, you can add business-related tags to the chat room. The value cannot exceed 8 KB.     |

:::tip
This API supports creating a chat room with a custom chat room ID by specifying the `roomid` parameter when calling the API.
1. Before using this feature, you must **contact the EasyIM business manager**. After the feature is activated, you can also [create a chat group with a custom group ID](group_create.html#request-body-fields).
2. The `roomid` parameter can contain up to 64 characters and supports only lowercase letters a-z and digits 0-9. **Do not use uppercase letters A-Z.**
:::

## Response example

```json
{
  "data": {
    "id": "66XXXX33"
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field      | Type   | Description                |
| :-------- | :----- | :------------------ |
| `data` | JSON | Actual response data. |
| - `id` | String | ID of the created chat room. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | The XX field is not set. | Specify all required fields.|
| 400     | illegal_argument | group ID XX already exists! | The groupId is duplicated. | Specify a new chat room ID. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | exceed_limit | appKey:XX#XX has create too many chatrooms! | The appKey has reached the limit on the number of chat rooms it can create. | Delete unused chat rooms or contact the EasyIM business manager to adjust the limit. |
| 403     | exceed_limit | user XX has joined too many chatrooms! | The user has reached the limit on the number of chat rooms they can join. | Leave unused chat rooms or contact the EasyIM business manager to adjust the limit. |
| 403     | exceed_limit | members size is greater than max user size ! | The number of users added when creating the chat room exceeds the maximum (value range: [1,10,000]). | Contact the EasyIM business manager to increase the limit. |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | A user added when the chat room was created does not exist. | Add an existing user when the chat room was created. |

For other errors, see [Response status codes](error.html) for possible causes.
