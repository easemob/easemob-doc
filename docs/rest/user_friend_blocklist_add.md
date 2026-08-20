# Add Users to the Blocklist

## Feature overview

- Add one or more users to the blocklist.
- The user blocklist service restricts users from sending one-to-one messages to each other through the client.
- A user can add any other user to the blocklist, regardless of whether they are friends.
- Each user's blocklist can contain up to 500 users.
- A friend remains in the friend list after being added to the blocklist.
- Calling this API triggers the post-delivery callback event for adding a user to the blocklist. For details, see [Webhook events](callback_contact.html#add-a-user-to-the-blocklist).

## Feature activation

Before using this API, activate the blocklist feature for free in the Easemob Console. For details, see [Easemob Console documentation](/product/console/basic_user.html#user-blocklist).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users
```

| Parameter             | Type   | Required | Description                |
| :--------------- | :----- | :------- | :------------------ |
| `owner_username` | String | Yes       | User whose blocklist users are to be added to. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/user1/blocks/users'  \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
   "usernames": [
     "user2"
   ]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter        | Type  | Required | Description                                             |
| :---------- | :---- | :------- | :----------------------------------------------- |
| `usernames` | Array | Yes       | User IDs to add to the blocklist, such as ["user1", "user2"]. |

## Response example

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "uri": "https://XXXX.com/XXXX/testapp",
  "entities": [],
  "data": ["user2"],
  "timestamp": 1542600372046,
  "duration": 11,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field   | Type  | Description                    |
| :----- | :---- | :---------------------- |
| `data` | Array | User IDs added to the blocklist. |

The other fields are described below:

| Field   | Type  | Description                    |
| :----- | :---- | :---------------------- |
| `action`             | String | Request method. |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `uri`                | String | Request URL. |
| `entities`           | Array | Response entities.                                                      |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | String | Request response time in milliseconds.                                                     |
| `organization`    | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName` | String | App name entered when you created the app in the Easemob Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID of the user adding the friend or the friend being added does not exist. | Verify that both user IDs exist. | 
