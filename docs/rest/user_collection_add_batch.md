# Bulk Add User Favorites

EasyIM lets you favorite successfully sent messages and other custom content. Favorites are stored permanently and can be viewed at any time. For example, to favorite a message attachment, first [set the message attachment to permanent storage](message_attachment_storage.html), and then add it to favorites so that its content remains available.

## Feature overview

- Add multiple favorites for a user.
- You can add up to 20 favorites per request.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/collections
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
Replace <YourAppToken> with the App Token generated on your server 
curl -X POST https://XXX/XXX/XXX/collections
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>'  \
-d '{
  "collections": [
    {
      "id": "string",
      "type": 0,
      "data": "string",
      "ext": "string",
      "createdAt": 0
    }
  ],
  "username": "string"
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description                 |
| :-------------- | :----- | :------- | --------------------------------- |
| `collections`  | Array | Yes       | Details of the favorites to add. You can add up to 20 favorites. |
| - `id`  | String | Yes       | Favorite ID. |
| - `data`   | String | Yes       | Favorite content. |
| - `type` | Int | Yes       | Favorite type. |
| - `ext` | String | Yes       | Favorite extension information. |
| - `createdAt` | Long | Yes       | Time when the favorite was added. |
| `username`  | String | Yes       | User ID for whom to add favorites. |

## Response example

```json
{
  "collections": [ 
    {
    "id": "id1",
    "type": 0,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }
    {
    "id": "id2",
    "type": 1,
    "data": "string",
    "ext": "string",
    "createdAt": 0,
    "updatedAt": 0
    }  
  ] 
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful.

For response body parameter descriptions, see [Request body fields](#request-body-fields).

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400         | illegal_argument  | username XXX is not legal   | The user ID is invalid. | See the registered username [requirements](account_register_open.html). |

For other errors, see [Error codes](error.html) for possible causes.
