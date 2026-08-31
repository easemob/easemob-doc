# Download a Chat Group Shared File

## Feature overview

- Download a chat group shared file by chat group ID and file ID (`file_id`).
- Obtain the file ID from the response of the [Retrieve Chat Group Shared Files](group_shared_file_obtain.html) API.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/chatgroups/{group_id}/share_files/{file_id}
```

| Parameter            | Type   | Required | Description      |
| :-------------- | :----- | :------- | :------------------ |
| `group_id`           | String   | Yes | Chat group ID.      |
| `file_id`           | String   | Yes | The ID of the chat group shared file to download.      |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/chatgroups/6XXXX7/share_files/b30XXXX4f'  \
-H 'Content-Type: application/json'   \
-H 'Accept: application/json'   \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

Returns the contents of the uploaded file. For example, if the file contains "Hello world", the response returns "Hello world".

## Response body fields

If the returned HTTP status code is `200`, the request is successful and the response body contains the uploaded file's content. For example, if the file contains "Hello world", the response returns "Hello world".

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | RestGroupFeignException | grpID XX does not exist! | The chat group does not exist. | Use a valid chat group ID. |

For other errors, see [Response status codes](error.html) for possible causes.
