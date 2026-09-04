# Create a Chat Group

## Feature overview

- Create a chat group.
- Configure the chat group name, description, public or private status, maximum number of members (including the group owner), whether approval is required to join a public group, group owner, members, and extension information.
- Creating a chat group triggers a post-delivery callback. For details, see [Chat Group Created](callback_group_room_create.html).
- For details about the number of chat groups supported by an app, the number of members supported by a chat group, and chat group size tiers, see [Chat group limitations](/product/limitation.html#number-of-chat-groups-and-chat-group-members).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/chatgroups
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/chatgroups'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
   "groupname": "testgroup",
   "avatar": "https://www.XXXX.com/XXX/image",
   "description": "test",
   "public": true,
   "maxusers": 300,
   "owner": "testuser",
   "members": [
     "user2"
   ]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter                  | Type   | Required | Description          |
| :------------ | :----- | :------- | :------------------------------------------- |
| `groupname`           | String | No       | Chat group name. The maximum length is 128 characters.|
| `avatar`           | String | No       | Chat group avatar URL. The maximum length is 1024 characters.|
| `description`         | String | No       | Chat group description. The maximum length is 512 characters.|
| `public`              | Bool   | Yes       | Whether the chat group is public. Public groups are searchable and users can apply to join them. Private groups are not searchable, and the group owner or a chat group admin must add users. <br/> - `true`: Public group; <br/> - `false`: Private group. |
| `maxusers`            | Int    | No       | Maximum number of chat group members, including the group owner. The default is `200`. If the value exceeds `3000`, offline push is no longer supported by default. To enable offline push, contact the EasyIM business manager for activation.|
| `allowinvites`        | Bool   | No       | Whether regular chat group members can invite users to join the chat group: <br/> - `true`: Regular chat group members can invite users; <br/> - (Default) `false`: Only the group owner and chat group admins can invite users. <br/><Container type="notice" title="Note"><br/>When creating a chat group, this parameter applies only to private groups. For a public group (`public` is `true`), even if `allowinvites` is `true`, the setting is automatically changed to `false`. To allow regular members of a public group to invite users, create the group and then call the [Modify Chat Group Information](group_modify.html) API to set `allowinvites` to `true`. </Container> |
| `membersonly`         | Bool   | No       | Whether an application to join the chat group requires approval from the group owner or a chat group admin. <br/> - `true`: Approval is required; <br/> - (Default) `false`: Approval is not required, and users join directly. <br/> This parameter applies only to public groups. Users cannot apply to join private groups and can join only through a chat group member's invitation. |
| `invite_need_confirm` | Bool   | No       | Whether an invited user must accept the invitation before joining the chat group. <br/> - (Default) `true`: Yes; <br/> - `false`: No. |
| `owner`               | String | Yes       | The user ID of the group owner.  |
| `members`             | Array  | No       | An array of user IDs for chat group members, excluding the user ID of the group owner. The array can contain no more than the value `maxusers`.        |
| `custom`              | String | No       | Chat group extension information, such as business-related tags. The maximum length is 8 KB. |

:::tip
This API supports creating a chat group with a custom chat group ID by passing the `groupid` parameter.
1. Before using this feature, **contact the EasyIM business manager** for activation. After activation, you can also [create a chat room with a custom chat room ID](chatroom_create.html#request-body-fields).
2. The `groupid` parameter can contain up to 64 characters and supports only lowercase letters a-z and digits 0-9. **Do not use uppercase letters A-Z.**
:::

## Response example

```json
{
  "action": "post",
  "application": "8bXXXX02",
  "uri": "https://XXXX/XXXX/XXXX/chatgroups",
  "entities": [],
  "data": {
    "groupid": "6XXXX7"
  },
  "timestamp": 1542361730243,
  "duration": 0,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` parameter description in the response body is as shown in the following table:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `data`            | JSON   | Response data. |
| - `groupid` | String | Chat group ID. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `uri`             | String | Request URL. |
| `entities`        | JSON Array   | Response entities. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | invalid_parameter | XX must be provided | A required field is not set. | Specify the required field. |
| 400     | invalid_parameter | avatar length is too big | The avatar field exceeds the length limit. | Shorten the avatar field value. |
| 400     | invalid_parameter | group must contain public field! | The `public` field must be set when creating a chat group. | Set the `public` field. |
| 400     | illegal_argument | group ID XX already exists! | The groupId value already exists. | Use a new chat group ID. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | exceed_limit | appKey:XX#XX has create too many groups! | The appKey has reached its chat group limit. | Delete unused chat groups or contact the EasyIM business manager to adjust the limit. For details, see [IM Package Function Details](/product/product_package_feature.html). |
| 403     | exceed_limit | user XX has joined too many groups! | The user has reached the limit on joined chat groups. | Leave unused chat groups or increase the limit in the [EasyIM Console](/product/console/basic_single_group_chat.html#maximum-chat-groups-per-user). |
| 403     | exceed_limit | members size is greater than max user size ! | The number of people joining when creating a group exceeds the maximum limit. | Adjust the number of people who can join the created group. For details about this upper limit, see [IM Package Function Details](/product/product_package_feature.html).|
| 403     | group_name_violation | XX is violation, please change it. | The chat group name violates content requirements. | Use a chat group name that meets the content requirements. |
| 404     |  resource_not_found  | username XXXX doesn't exist!       | A user specified when creating the chat group does not exist. | Add an existing user when creating the chat group.|

For other errors, see [Response status codes](error.html) for possible causes.
