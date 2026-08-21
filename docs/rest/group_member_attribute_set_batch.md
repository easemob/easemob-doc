# Set Custom Attributes of Chat Group Members in Batches

## Feature overview

- Set custom attributes as key-value pairs for chat group members in batches, such as nicknames and avatars in the chat group.
- Multiple attributes can be set for up to 20 chat group members per request, and different attributes can be set for different chat group members.
- For the same user ID, new attribute names are added and existing attribute names are updated.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/metadata/chatgroup/{group_id}/users/batch
```

| Parameter            | Type   | Required | Description       |
| :-------------- | :----- | :------- | :------------ |
| `group_id`  | Int    |  Yes       | Chat group ID. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X PUT 'https://XXXX/XXXX/XXXX/metadata/chatgroup/XXXX/users/batch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '[
    {
        "username": "user1",
        "metadata": {
            "metadataKey1": "value1",
            "metadataKey2": "value2"
        }
    },
    {
        "username": "user2",
        "metadata": {
            "metadataKey3": "value3",
            "metadataKey4": ""
        }
    }
]'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter       | Type | Required | Description        |
| :--------- | :--- | :------- | :-------------- |
| `username` | JSON | Yes       | User ID of the chat group member whose custom attributes to set, represented as a key-value pair: <br/> - The key must be `username`. <br/> - The value is the user ID and cannot be empty. |
| `metadata` | JSON | Yes       | Custom attributes to set for the user as key-value pairs. For each pair: <br/> - The key is the attribute name, cannot be empty, and cannot exceed 16 bytes. <br/> - The value is the attribute value and cannot exceed 512 bytes. Setting the value to an empty string deletes the custom attribute. <Container type="tip" title="Note">The total length of a chat group member's custom attributes cannot exceed 4 KB. </Container> |

## Response example

```json
{
    "timestamp": 1727593257722,
    "data": {
        "updateMetadataFailed:": [],
        "updateMetadataSucceeded:": [
            {
                "username": "user1",
                "metadata": {
                    "metadataKey1": "value1",
                    "metadataKey2": "value2"
                }
            },
            {
                "username": "user2",
                "metadata": {
                    "metadataKey3": "value3"
                }
            }
        ]
    },
    "duration": 483
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description                     |
| :----- | :--- | :----------------------- |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `data` | JSON | Custom attribute update results for the chat group members. |
| `data.updateMetadataFailed` | JSON Array | Failed update records, including each user ID and the corresponding error message. |
| `data.updateMetadataSucceeded` | JSON Array | Successful update records, including each user ID and the user's custom attributes in the current chat group. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | metadata_error | exceeds chatgroup user metadata single key limit | The attribute key is too long. | Use an attribute key of no more than 16 bytes. |
| 400     | metadata_error | exceeds chatgroup user metadata single value limit | The attribute value is too long. | Use an attribute value of no more than 512 bytes. |
| 400     | metadata_error | Some users are not in the group: user99 | Some users are not in the chat group. | Add the users to the group chat or remove them from the request. |
| 400     | metadata_error | exceeds chatgroup metadata batch put users limit | The batch size exceeds the limit. | Specify no more than 20 chat group members in a request. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 403     | metadata_error | chatgroup user metadata service not allow | The function of customizing chat group member attributes is not enabled. | Contact the EasyIM business manager for activation. |
| 404     | metadata_error | group not exists | The chat group does not exist. | Check whether the group_id in the request is valid. |
| 409     | metadata_error | Failed to operate user metadata. Concurrent operation not allowed | Concurrent requests attempted to modify the same user's metadata. | Avoid concurrent operations on the same user. Pass all metadata required for a user in a single request. |

For other errors, see [Response status codes](error.html) for possible causes.
