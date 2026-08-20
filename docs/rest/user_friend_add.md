# Add a Friend

## Feature overview

- Add a friend. The friend must be a user under the same App Key as the current user.
- This API adds the friendship in both directions. After a friend is added, each user appears in the other's friend list.
- For the free EasyIM service, each user under an App Key can have up to 100 friends. This limit varies by service edition. For details, see [IM plan features](/product/product_package_feature.html).
- Calling this API triggers the post-delivery callback event for adding a friend. For details, see [Webhook events](callback_contact.html#send-a-friend-request).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users/{friend_username}
```

| Parameter       | Type   | Required | Description        |
| :--------- | :----- | :------- | :--------------- |
| `owner_username`  | String | Yes       | User ID for which to add a friend. |
| `friend_username` | String | Yes       | User ID to add as a friend. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/contacts/users/user2'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "post",
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
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `entities` field in the response body is described below:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `entities`           | JSON Array | Details of the added friend.                                                      |
|  - `uuid`      | String     | Unique identifier generated for the friend in the system. It does not require your attention.                      |
|  - `type`      | String     | Object type. The value is `user` or `group`.                                      |
|  - `created`   | Long       | User creation time as a Unix timestamp in milliseconds.                                 |
|  - `modified`  | Long       | Latest modification time of the friend's information, such as password or nickname, as a Unix timestamp in milliseconds.   |
|  - `username`  | String     | User ID of the added friend.                                                   |
|  - `activated` | Bool       | Whether the friend has a normal status:<br/> • `true`: Normal.<br/> • `false`: Banned. |
|  - `nickname`  | String     | Friend's user nickname.                                                        |

The other fields in the response body are described below:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `action`             | String | Request method. |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`                | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `organization`       | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName`    | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | exceed_limit | user contact number exceed limit | The friend limit has been reached. | Check whether the friend limits of both users have been reached. |
| 404     | service_resource_not_found | Service resource not found | The user ID of the user adding the friend or the friend being added does not exist. | Verify that both user IDs exist. | 
