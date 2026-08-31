# Retrieve Custom Attributes of Chat Group Members by Attribute Key

## Feature overview

- Retrieve the custom attributes of multiple chat group members by the specified attribute key.
- You can retrieve the custom attributes of up to 10 chat group members at a time.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/get
```

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  Yes       | Chat group ID. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/get' \
-H 'Content-Type: application/json'\
-H 'Accept: application/json'\
-H 'Authorization: Bearer <YourAppToken>'\
-d '{
    "targets":["test1","test2"],
    "properties":["key1","key2"]
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter         | Type       | Required | Description                     |
| :----------- | :--------- | :------- | :--------------------------------- |
| `targets`    | JSON Array | Yes       | User IDs of the chat group members whose custom attributes to retrieve. You can specify up to 10 user IDs at a time. |
| `properties` | JSON Array | Yes       | Array of attribute keys to retrieve. If this parameter is omitted or set to an empty array, all custom attributes of the specified chat group members are returned. |

## Response example

```json
{
  "timestamp": 1678674292783,
  "data": {
    "test1": {
      "key1": "value1"
    },
    "test2": {
      "key1": "value1"
    }
  },
  "duration": 2
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description               |
| :----- | :--- | :------------------ |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `data` | JSON | Custom attributes of the chat group members. In the response example, `test1` and `test2` are the user IDs of the members associated with the custom attributes. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

See the table above for other fields and descriptions.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | query param reaches limit. | The number of batch queries has reached the limit. | Reduce the number of user IDs to query. Custom attributes of up to 10 chat group members can be obtained at a time. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |

For other errors, see [Response status codes](error.html) for possible causes.
