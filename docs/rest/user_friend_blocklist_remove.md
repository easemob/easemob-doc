# Remove Users from the Blocklist

## Feature overview

- Remove a user from another user's blocklist.
- Removing a friend from the blocklist restores the friendship and allows messages to be sent and received normally.
- Removing a non-friend from the blocklist restores the state in which the users are not friends. If friendship verification is disabled, the two users can send and receive messages normally.
- Calling this API triggers the post-delivery callback event for removing a user from the blocklist. For details, see [Callback events](callback_contact.html#remove-a-user-from-the-blocklist).

## Feature activation

Before using this API, activate the blocklist feature for free in the Easemob Console. For details, see [Easemob Console documentation](/product/console/basic_user.html#user-blocklist).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users/{blocked_username}
```

| Parameter       | Type   | Required | Description        |
| :--------- | :----- | :------- | :--------------- |
| `owner_username`   | String | Yes       | User whose blocklist the user is to be removed from.     |
| `blocked_username` | String | Yes       | User ID to remove from the blocklist. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X DELETE 'https://XXXX/XXXX/XXXX/users/user1/blocks/users/user2'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/users/475XXXXba/blocks",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/blocks",
  "entities": [
    {
      "uuid": "b2aXXXXf1",
      "type": "user",
      "created": 1542356523769,
      "modified": 1542597334500,
      "username": "user2",
      "activated": true,
      "nickname": "testuser"
    }
  ],
  "timestamp": 1542600712985,
  "duration": 20,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Parameter                 | Type       | Description             |
| :------------------- | :--------- | :---------------------------------------- |
| `entities`           | JSON Array | Details of users removed from the blocklist.                                                        |
|  - `uuid`      | String     | Unique identifier of the user in the system. It is automatically generated and does not require your attention.                                  |
|  - `type`      | String     | Object type. The value is `user`.                                                                 |
|  - `created`   | Long       | User creation time as a Unix timestamp in milliseconds.                                                 |
|  - `modified`  | Long       | Latest modification time of user information, such as password or nickname, as a Unix timestamp in milliseconds.                         |
|  - `username`  | String     | User ID of the user removed from the blocklist.                                                                 |
|  - `activated` | Bool       | Whether the user has a normal status:<br/> • `true`: The user has a normal status.<br/> • `false`: The user is banned. |
|  - `nickname`  | String     | Nickname of the user removed from the blocklist.                                                              |

The other fields in the response are described below:

| Parameter                 | Type       | Description             |
| :------------------- | :--------- | :---------------------------------------- |
| `action`             | String | Request method. |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`                | String | Request URL. |
| `timestamp`          | Long   | Unix timestamp of the HTTP response, in milliseconds. |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `organization`       | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName`    | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code    | Error type | Error message     | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID of the user performing the removal or the user being removed does not exist. | Verify that both user IDs exist. | 
