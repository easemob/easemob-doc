# Retrieve the Friend List

## Feature overview

- The server returns friends in descending order by the time they were added.
- Retrieve up to 3,000 friends of a user per request.
- If a user has more than 3,000 friends, use the API to [retrieve the friend list by page](user_friend_list_paged.html).
- The retrieved friend list contains only friend user IDs and does not include user profiles.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/contacts/users
```

| Parameter             | Type   | Required | Description                      |
| :--------------- | :----- | :------- | :------------------------ |
| `owner_username` | String | Yes       | User ID of the friend list owner. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/contacts/users' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/contacts/users",
  "entities": [],
  "data": ["user3", "user2"],
  "timestamp": 1543819826513,
  "duration": 12,
  "count": 2
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field    | Type  | Description                                    |
| :------ | :---- | :-------------------------------------- |
| `action`             | String | Request method. |
| `uri`                | String | Request URL. |
| `entities`           | Array | Response entities.        |
| `data`  | Array | Retrieved friend list, such as "user1", "user2". |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `count` | Int   | Number of friends.                              |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID whose friend list is being retrieved does not exist. | Verify that the user ID whose friend list is being retrieved exists. | 
