# Check the Blocklist

## Feature overview

- Check in bulk whether users are on a user's blocklist.
- Before using this API, activate the blocklist feature for free in the EasyIM Console. For details, see [EasyIM Console documentation](/product/console/basic_user.html#user-blocklist).

## Feature activation

Before using this API, activate the blocklist feature for free in the EasyIM Console. For details, see [EasyIM Console documentation](/product/console/basic_user.html#user-blocklist).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/blocks/check
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/blocks/check'   \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "username": "user1", 
    "check_list": [ 
    "user2",
    "user3"
    ]
  }'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required<div style="width: 80px;"></div> | Description                   |
| :-------------- | :----- | :----------- | :------------------------------------------------------ |
| `username`  | String | Yes         | User ID whose blocklist is to be checked.         |
| `check_list`  | JSON Array | Yes         | List of blocklisted user IDs to check, with up to 100 user IDs per request. |

## Response example

```json
{
  "action": "post",
  "application": "8bXXXX402",
  "path": "/contacts/check",
  "uri": "https://XXXX/XXXX/XXXX/blocks/check",
  "entities": [
    {
        "username":"user2",
        "relation":"blacklist"
    },
    {
        "username":"user3",
        "relation":"not_blacklist"
    }
  ],
  "timestamp": 1542598913819,
  "duration": 63,
  "organization": "XXXX",
  "applicationName": "testapp"
}
```


## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field                 | Type       | Description              |
| :------------------- | :--------- | :------------------ |
| `entities`           | JSON Array | Details of the check result.     |
|  - `username`      | String     | User ID being checked.                      |
|  - `relation`      | String     | Whether the user is on the blocklist:<br/> - `blacklist`: Yes<br/> - `not_blacklist`: No | 

The other fields are described below:

| Field                 | Type       | Description              |
| :------------------- | :--------- | :------------------ |
| `action`             | String | Request method. |
| `application`        | String | Unique identifier generated for the app in the system. It does not require your attention. |
| `path`               | String | Request path, which is part of the request URL and does not require your attention. |
| `uri`                | String | Request URL. |
| `timestamp`          | Long   | Unix timestamp of the HTTP response, in milliseconds. |
| `duration`           | Long   | Duration from sending the HTTP request to receiving the response, in milliseconds. |
| `organization`       | String | Unique identifier assigned by EasyIM to each company (organization), identical to the `org_name` request parameter. |
| `applicationName`    | String | App name entered when you created the app in the EasyIM Console, identical to the `app_name` request parameter. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401 | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 429   | reach_limit | This request has reached api limit. | The API call frequency exceeds the limit. | Contact the business manager to adjust the limit or reduce the call rate. |
| 403   | forbidden_service_operation | Service operation not allowed | The app or user is banned. | Unban the app or user before calling this API. |
| 400   | illegal_argument | username cannot be blank | The `username` of the user to check cannot be empty. | Verify the `username` parameter. |
| 400   | illegal_argument | check_list size must be between 1 and 100 | The list of users to check can contain only 1 to 100 users. | Verify the `check_list` parameter. |

For other errors, see [Response status codes](error.html) for possible causes.

