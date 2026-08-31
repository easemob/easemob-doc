# Retrieve All Custom Attributes of a Chat Group Member

## Feature overview

Retrieve all custom attributes of a single chat group member.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  Yes       | Chat group ID. |
| `username` | String | Yes       | User ID of the chat group member whose custom attributes to retrieve. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X GET 'https://XXX/XXX/XXX/metadata/chatgroup/XXXX/user/XXXX' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
-H 'Authorization: Bearer <YourAppToken>' \
--data-raw ''
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "timestamp": 1678674211840,
  "data": {
    "key1": "value1"
  },
  "duration": 6
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `data` | JSON | Custom attributes of the chat group member. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | MetadataException | user not in group | The user is not in the chat group. | Specify the user ID of a chat group member. |

For other errors, see [Response status codes](error.html) for possible causes.
