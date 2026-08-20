# Retrieve the Blocklist

## Feature overview

Retrieve blocklisted users by page. The server returns users in reverse order by the time they were added, with the most recently blocklisted users first.

## Feature activation

Before using this API, activate the blocklist feature for free in the Easemob Console. For details, see [Easemob Console documentation](/product/console/basic_user.html#user-blocklist).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/blocks/users?pageSize={N}&cursor={cursor}
```

| Parameter     | Type   | Required | Description                                  |
| :------- | :----- | :------- | :-------------------------- |
| `pageSize`  | Int    | No       | Expected number of blocklisted users returned per request. The value range is [1,50]. This parameter is required only for paginated retrieval. |
| `cursor` | String | No       | Starting position of the query. This parameter is required only for paginated retrieval.     |
| `owner_username` | String | Yes       | User whose blocklist is to be retrieved. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/blocks/users?pageSize=2'  \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
    "uri": "https://XXXX/XXXX/XXXX/users/XXXX/blocks/users",
    "timestamp": 1682064422108,
    "entities": [],
    "cursor": "MTA5OTAwMzMwNDUzNTA2ODY1NA==",
    "count": 2,
    "action": "get",
    "data": [
        "tst05",
        "tst04"
    ],
    "duration": 52
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field    | Type  | Description         |
| :------ | :---- | :----------------------- |
| `data`  | Array | Retrieved blocklist, such as ["user1", "user2"]. |

The other fields are described below:

| Field    | Type  | Description         |
| :------ | :---- | :----------------------- |
| `uri`                | String | Request URL. |
| `timestamp`          | Long   | Unix timestamp of the HTTP response, in milliseconds. |
| `entities`        | Array | Response entities.            |
| `cursor`        | String | Cursor from which to retrieve data next time.            |
| `count` | Int   | Number of retrieved blocklisted users.                        |
| `action`          | String | Request method.          |
| `duration`        | Int | Request response time in milliseconds.         |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID to query does not exist. | Verify that the queried user ID exists. | 
