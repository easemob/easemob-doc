# Remove All Friends of a User

## Feature overview

- Remove all friends of a user.
- This API removes the friendship in both directions. After it is called, the current user and the removed friend are deleted from each other's friend lists.
- If the current user has set friend remarks, calling this API deletes those remarks from the server.
- This API does not affect the blocklist. Users added to the current user's blocklist remain on it after this API is called.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/contacts/users/{username}
```

| Parameter             | Type   | Required | Description                |
| :--------------- | :----- | :------- | :------------------ |
| `username`  | String | Yes         | User ID whose friends are all to be removed.               |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X DELETE 'https://XXXX/XXXX/XXXX/contacts/users/XXXX' \
-H 'Content-Type: application/json'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "delete",
  "application": "8bXXXX402",
  "path": "/contacts/users/XXXX",
  "uri": "https://XXXX/XXXX/XXXX/contacts/users/XXXX",
  "entities": [],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```

### Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                 | Type   | Description            |
| :------------------- | :----- | :-------------------------------------------- |
| `action`             | String | Response action. `delete` indicates removing a friend.                                   |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`                | String | Request URL. |
| `entities`           | Array  | Response entities.     |
| `timestamp`          | Long   | Unix timestamp of the HTTP response, in milliseconds. |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `organization`       | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName`    | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401  | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 429 | reach_limit | This request has reached api limit. | The API call frequency exceeds the limit. | Contact the business manager to adjust the limit or reduce the call rate. |
| 403   | forbidden_service_operation | Service operation not allowed | The app or user is banned. | Unban the app or user before calling this API. |

For other errors, see [Response status codes](error.html) for possible causes.
