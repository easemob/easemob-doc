# Remove a Friend

## Feature overview

- Remove a user from another user's friend list and end their friendship. For example, after user A removes user B, each user disappears from the other's friend list.
- Calling this API triggers the post-delivery callback event for removing a friend. For details, see [Webhook events](callback_contact.html#remove-a-friend).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

| Parameter              | Type   | Required | Description                  |
| :---------------- | :----- | :------- | :-------------------- |
| `owner_username`  | String | Yes       | User whose friend is to be removed.   |
| `friend_username` | String | Yes       | User ID of the removed friend. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X DELETE 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'  \
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
  "path": "/users/475XXXXba/contacts",
  "uri": "https://XXXX/XXXX/XXXX/users/475XXXXba/contacts",
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
  "timestamp": 1542599266616,
  "duration": 350,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Field                 | Type       | Description                                                                               |
| :------------------- | :--------- | :------------------------------------------------ |
| `entities`           | JSON Array | Details of the removed friend.                                                               |
| `entities.uuid`      | String     | Unique identifier generated for the friend in the system. It does not require your attention.                                 |
|  - `type`      | String     | Object type. The value is `user` or `group`.                                                 |
|  - `created`   | Long       | User creation time as a Unix timestamp in milliseconds.                                            |
|  - `modified`  | Long       | Most recent modification time of the friend's information, such as password or nickname, as a Unix timestamp in milliseconds.          |
|  - `username`  | String     | User ID of the removed friend.                                                              |
|  - `activated` | Bool       | Whether the friend has a normal status:<ul><li>`true`: Normal.</li><li>`false`: Banned.</li></ul> |
|  - `nickname`  | String     | Friend's user nickname.                                                                   |

The other fields in the response body are described below:

| Field                 | Type       | Description       |
| :------------------- | :--------- | :------------------------------------------------ |
| `action`             | String | Response action. `delete` indicates removing a friend.                                   |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`                | String | Request URL. |
| `timestamp`          | Long   | Unix timestamp in milliseconds.                                                      |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `organization`       | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName`    | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID of the user removing the friend or the friend being removed does not exist. | Verify that both user IDs exist. | 
