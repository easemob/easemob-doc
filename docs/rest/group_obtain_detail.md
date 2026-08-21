# Retrieve Chat Group Details

## Feature overview

- Retrieve details of one or more chat groups.
- Each chat group can return up to 10,000 members, including the group owner.
- You can retrieve details of up to 100 chat groups at a time.
- When multiple chat groups are specified, the response includes details of all existing chat groups. For a chat group that does not exist, the response returns "group id doesn't exist".

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}
```

| Parameter     | Type   | Required | Description                                                        |
| :------- | :----- | :------- | :---------------------------------------------------------- |
| `group_id`  | Int    |  Yes       | ID of the chat group whose details to retrieve. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/66XXXX85'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
    "action": "get",
    "application": "09ebbf8b-XXXX-XXXX-bd4b-d47c3b38e434",
    "applicationName": "XXXX",
    "count": 1,
    "data": [
        {
            "id": "XXXX",
            "name": "XXXX",
            "avatar": "https://www.XXXX.com",
            "description": "XXXX",
            "membersonly": true,
            "allowinvites": false,
            "maxusers": 2000,
            "owner": "XXXX",
            "created": 1682588716646,
            "custom": "",
            "mute": false,
            "affiliations_count": 2,
            "disabled": false,
            "affiliations": [
                {
                    "member": "XXXX"
                },
                {
                    "owner": "XXXX"
                }
            ],
            "public": false
        }
    ],
    "duration": 35,
    "entities": [],
    "organization": "XXXX",
    "properties": {},
    "timestamp": 1682588814419,
    "uri": "http://XXXX/XXXX/XXXX/chatgroups/XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                      | Type   | Description      |
| :---------- | :----- | :----------------- |
| `data` | JSON Array | Response data.|
|  - `id`                 | String | Chat group ID, which uniquely identifies the chat group. |
|  - `name`               | String | Chat group name. |
|  - `avatar`             | String | The URL of the group avatar.|
|  - `description`        | String | Chat group description. |
|  - `membersonly`        | Bool   | Whether joining the group requires approval from the group owner or chat group admin. <br/> - `true`: Yes; <br/> - `false`: No.      |
|  - `allowinvites`       | Bool   | Whether chat group members are allowed to invite other users to join this group. <br/> - `true`: Allow chat group members to invite other users to join the group; <br/> - `false`: Only the group owner can invite other users to the group. <br/> Note: This parameter is only valid for private groups, because public groups do not allow chat group members to invite other users to the group. |
|  - `maxusers`           | Int    | Maximum number of chat group members. This value is set when the chat group is created and can be modified. |
|  - `affiliations`       | Array | List of chat group members and their corresponding roles: <br/> - `owner`: group owners; <br/> - `member`: chat group admins and regular members. |
|  - `owner`              | String | The user ID of the group owner. For example: {"owner": "user1"}.    |
|  - `created`            | Long   | Unix timestamp when the chat group was created. |
|  - `affiliations_count` | int    | Current number of chat group members. |
|  - `disabled`           | Bool   | Whether the chat group is disabled: <br/> - `true`: The chat group is disabled; <br/> - `false`: The chat group is enabled. |
|  - `mute`               | Bool   | Whether it is in a muted state for all members. <br/> - `true`: Yes; <br/> - (Default) `false`: No.       |
|  - `public`             | Bool   | Whether it is a public group: <br/> - `true`: public group; <br/> - `false`: private group.    |
|  - `custom`             | String | Chat group extension information, such as business-related tags. The maximum length is 8 KB. |

The description of other parameters is shown in the following table:

| Field                      | Type   | Description      |
| :---------- | :----- | :----------------- |
| `action`          | String | Request method. |
| `application`     | String | Unique identifier of the app in the system. It is generated by the system and does not require your attention. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |
| `count`                 | Int | Number of chat groups whose details were returned. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `entities`        | JSON Array   | Response entities. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `properties` | JSON | You do not need to use this field. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | resource_not_found | grpID XX does not exist! | The chat group does not exist. | Use a valid chat group ID. |

For other errors, see [Response status codes](error.html) for possible causes.
