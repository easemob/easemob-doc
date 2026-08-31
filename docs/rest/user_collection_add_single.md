# Add a Single Favorite

EasyIM lets you favorite successfully sent messages and other custom content. Favorites are stored permanently and can be viewed at any time. For example, to favorite a message attachment, first [set the message attachment to permanent storage](message_attachment_storage.html), and then add it to favorites so that its content remains available.

## Feature overview

Add one favorite for a user.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/collections
```

| Parameter       | Type   | Required | Description                     |
| :--------- | :----- | :------- | ------------------------ |
| `username` | String | Yes       | User ID for whom to add a favorite. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
Replace <YourAppToken> with the App Token generated on your server 
curl -X POST https://XXX/XXX/XXX/users/{username}/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' 
-d '{
  "id": "string",
  "data": "string",
  "type": 0,
  "ext": "info"
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `id`   | String | No       | Favorite ID, which uniquely identifies the favorite. If omitted, the EasyIM server assigns a random UUID. |
| `data` | String | Yes       | Favorite content, up to 20,480 characters. |
| `type` | Int    | Yes       | Favorite type. |
| `ext`  | String | No       | Favorite extension information, up to 1,024 characters. The default is `NULL`, indicating no extension information. |

## Response example

```json
{
  "collection": {
    "id": "string",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
  } 
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type | Description               |
| :------- | :--- | :----------------- |
| `id`   | String  | Favorite ID. |
| `type` | Int  | Favorite type. |
| `data` | String     | Favorite content. |
| `ext`  | String  | Favorite extension information. |
| `createdAt` | Long  | Favorite creation time. |
| `updatedAt` | Long  | Favorite update time. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | The user ID is invalid. | See the registered username [requirements](account_register_open.html). |

For other errors, see [Error codes](error.html) for possible causes.
