# Retrieve Chat Room Custom Attributes

## Feature overview

Retrieves custom attribute information for the specified chat room.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/metadata/chatroom/{chatroom_id}
```

| Parameter           | Type   | Required | Description                                |
| :------------- | :----- | :------- | :---------------------------------- |
| `chatroom_id` | String | Yes       | Chat room ID. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/metadata/chatroom/662XXXX13'   \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>'   \
-d '{
    "keys": ["key1","key2"]
 }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter   | Type  | Required | Description                       |
| :----- | :---- | :------- | :------------------------- |
| `keys` | Array | No       | List of chat room custom attribute names. |

## Response example

```json
{
  "uri": "https://XXXX/XXXX/XXXX/metadata/chatroom", 
  "timestamp": 1716891388636, 
  "action": "post", 
  "data": {
    "key1": "value1", 
    "key2": "value2"
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field   | Type   | Description                                                             |
| :----- | :----- | :--------------------------------------------------------------- |
| `data` | Object | Chat room custom attributes in key-value pairs, where each key is an attribute name and each value is the corresponding attribute value. |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `uri`             | String | Request URL. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `action`          | String | Request method. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | resource_not_found | grpID XX does not exist! | The chat room ID does not exist. | Specify a valid chat room ID. |

For other errors, see [Response status codes](error.html) for possible causes.
