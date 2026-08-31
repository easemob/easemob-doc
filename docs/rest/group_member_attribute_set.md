# Set Custom Attributes of a Chat Group Member

## Feature overview

Set custom attributes as key-value pairs for a chat group member, such as a nickname or avatar in the chat group.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/user/{username}
```

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  Yes       | Chat group ID. |
| `username` | String | Yes       | User ID. Set all custom properties for members of this group. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/user/XXXX' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
    "metaData": {
          "key1": "value1"
    }
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter       | Type | Required | Description        |
| :--------- | :--- | :------- | :----------------------------------------- |
| `metaData` | JSON | Yes       | Custom attributes to set as key-value pairs. For each pair: <br/> - The key is the attribute name and cannot exceed 16 bytes. <br/> - The value is the attribute value and cannot exceed 512 bytes. Setting the value to an empty string deletes the custom attribute. <Container type="notice" title="Note">The total length of a chat group member's custom attributes cannot exceed 4 KB. </Container> |

## Response example

```json
{
  "timestamp": 1678674135533,
  "data": {
    "key1": "value1"
  },
  "duration": 53
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `data` | JSON | Custom attributes set for the chat group member. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | exceeds chatgroup user metadata single key limit | The attribute key is too long. | Use an attribute key of no more than 16 bytes. |
| 400     | metadata_error | exceeds chatgroup user metadata single value limit | The attribute value is too long. | Use an attribute value of no more than 512 bytes. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |

For other errors, see [Response status codes](error.html) for possible causes.
