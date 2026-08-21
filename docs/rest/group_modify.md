# Modify Chat Group Information

## Feature overview

- Modify the information of a single chat group.
- You can modify the `groupname`, `avatar`, `description`, `maxusers`, `membersonly`, `allowinvites`, `invite_need_confirm`, `public`, and `custom` fields. Passing an unsupported or nonexistent field results in an error.
- Modifying chat group information triggers a post-delivery callback. For details, see [Chat Group Information Modified](callback_group_room_info.html).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

| Parameter     | Type   | Required | Description                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  Yes       | The chat group ID to modify. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "groupname": "test groupname",
    "avatar": "https://www.XXXX.com/XXX/image",
    "description": "updategroupinfo12311",
    "maxusers": 1500,
    "membersonly": true,
    "allowinvites": false,
    "invite_need_confirm": true,
    "custom":"abc",
    "public": true
}'
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter                  | Type   | Required | Description           |
| :-------------------- | :----- | :------- | :---------------------------- |
| `groupname`           | String | No       | Chat group name. The maximum length is 128 characters. |
| `avatar`              | String | No       | Chat group avatar URL. The maximum length is 1024 characters.|
| `description`         | String | No       | Chat group description. The maximum length is 512 characters. |
| `maxusers`            | Int    | No       | Maximum number of chat group members, including the group owner. If the value exceeds `3000`, offline push is no longer supported by default. To enable offline push, contact the EasyIM business manager for activation. |
| `membersonly`         | Bool   | No       | Whether joining the chat group requires approval from the group owner or a chat group admin: <br/> - `true`: Yes; <br/> - `false`: No. |
| `allowinvites`        | Bool   | No       | Whether chat group members can invite other users to join the chat group: <br/> - `true`: Chat group members can invite users; <br/> - `false`: Only the group owner or a chat group admin can invite users. |
| `invite_need_confirm` | Bool   | No       | Whether an invited user must accept the group invitation before joining the chat group: <br/> - `true`: The user must accept the invitation; <br/> - `false`: The user joins directly without accepting the invitation. |
| `custom`              | String | No       | Chat group extension information, such as business-related tags. The maximum length is 8 KB. |
| `public`              | Bool   | No       | Is it a public group? <br/> - `true`: public group; <br/> - `false`: private group.                                                                   |

## Response example

```json
{
  "action": "put",
  "application": "XXXXXX",
  "applicationName": "XXXX",
  "data": {
    "allowinvites": true,
    "invite_need_confirm": true,
    "membersonly": true,
    "public": true,
    "custom": true,
    "description": true,
    "maxusers": true,
    "groupname": true,
    "avatar": true
  },
  "duration": 0,
  "entities": [],
  "organization": "XXXX",
  "properties": {},
  "timestamp": 1666062065529,
  "uri": "https://XXXX/XXXX/XXXX/chatgroups/6XXXX7"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                       | Type   | Description        |
| :------------------------- | :----- | :------------------------ |
| `data`         | JSON   | Response data.   |
| - `description`         | Bool   | Whether the chat group description was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `maxusers`            | Bool   | Whether the maximum number of chat group members was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `groupname`           | Bool   | Whether the chat group name was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `avatar`              | Bool   | Whether the chat group avatar was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure.|
| - `membersonly`         | Bool   | Whether the approval requirement was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `public`              | Bool   | Whether the public or private setting was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `allowinvites`        | Bool   | Whether the member invitation setting was modified successfully: <br/> - `true`: Success; <br/>- `false`: Failure. |
| - `invite_need_confirm` | Bool   | Whether the invitation confirmation setting was modified successfully: <br/> - `true`: Success; <br/> - `false`: Failure. |
| - `custom`              | Bool | Whether the chat group extension information was modified successfully: <br/> - `true`: Success; <br/>- `false`: Failure. |

The other fields are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `entities`        | JSON Array   | Response entities. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `properties`      | String | Response properties.                                                                     |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | group_name_violation | XX is violation, please change it. | The chat group name violates content requirements. | Use a chat group name that meets the content requirements. |
| 404     | resource_not_found | grpID XX does not exist! | The chat group does not exist. | Use a valid chat group ID. |
| 400     | invalid_parameter                  | "some of [groupid] are not valid fields"  | An unsupported field was specified, such as `groupid`.|

For other errors, see [Response status codes](error.html) for possible causes.
