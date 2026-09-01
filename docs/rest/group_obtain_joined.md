# Retrieve the Chat Groups a User Has Joined

## Feature overview

- Retrieve by page all chat groups a user has joined.
- For the number of chat groups a user can join, see [IM plan features](/product/product_package_feature.html).

## Call frequency limit

50 times/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/user/{username}?pagesize={}&pagenum={}
```

| Parameter            | Type   | Required    | Description                 |
|:--------------| :----- |:--------|:-------------------|
| `username`     | String | Yes       | User ID whose joined chat groups to retrieve.|
| `pagesize`     | String | No       | Number of chat groups to return per page. The value range is [1,20], and the default is `5`. If the value exceeds `20`, the server still returns `20` chat groups per page.|
| `pagenum`       | String | No       | Current page number. By default, it starts from page `0`. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/user/XXXX' \
-H 'Authorization: Bearer  <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "applicationName": "XXXX",
  "duration": 0,
  "entities": [
    {
      "name": "group name",
      "avatar": "https://www.XXXX.com/XXX/image",
      "owner": "group admin",
      "id": "2XXXX1",
      "groupId": "2XXXX1",
      "description": "group description",
      "disabled": false,
      "public": false,
      "allowinvites": false,
      "membersonly": true,
      "maxusers": 2000,
      "created": 1692687427254
    }
  ],
  "organization": "XXXX",
  "timestamp": 1692687427254,
  "total": 10,
  "uri": "http://XXXX/XXXX/XXXX/chatgroups/user/XXXX"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Parameter      | Type     | Description     |
|:-------------------------|:-------|:----------------------------|
| `entities`                 | JSON Array  | List of chat groups the user has joined. |
|  - `groupId `     | String | Chat group ID.             |
|  - `name`         | String | Chat group name. |
|  - `avatar`       | String | The URL of the group avatar.|
|  - `owner`        | String | The user ID of the group owner.      |
|  - `description`  | String | Chat group description. |
|  - `disabled`     | Bool | Whether the group is disabled: <br/> - `true`: Disabled. When disabled, no modifications can be made to the group. <br/> - `false`: Not disabled. |
|  - `public`       | Bool | Whether it is a public group: <br/> - `true`: public group. Public groups can be searched, and users can apply to join public groups. <br/> - `false`: private group. Private groups cannot be searched, and users need to be invited by the group owner or chat group admin before they can join.|
|  - `allowinvites` | Bool | Whether regular chat group members are allowed to invite users to join the group: <br/> - `true`: regular chat group members can add people to the group; <br/> - `false`: only the group owner or admin can add people to the group.         |
|  - `membersonly`  | Bool | Whether a user's application to join the group requires approval from the group owner or chat group admin. <br/> - `true`: required; <br/> - `false`: not required, users can directly join the group.                               |
|  - `maxusers`     | Int | The maximum number of members in the group (including the group owner).      |
|  - `created `     | Long | Group creation timestamp.      |

Other parameters and descriptions are as follows.

| Parameter      | Type     | Description     |
|:-------------------------|:-------|:----------------------------|
| `action`          | String | Request method. |
| `applicationName` | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `total`                    | Int  | Total number of chat groups the user has joined. |
| `uri`             | String | Request URL. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |

For other errors, see [Response status codes](error.html) for possible causes.
