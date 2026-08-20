# Modify a Keyword

## Feature overview

Modify a keyword.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`    | String | Yes       | Keyword list ID. The keyword in this list will be modified.  |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9", 
      "word": "music",
      "userId": "v1"
}' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `id`        | String | Yes | ID of the keyword to modify. |
| `word`        | String | Yes | Modified keyword.|
| `userId`        | String | Yes | ID of the user who modifies the keyword.|

## Response example

```json
{
    "status": "OK",
    "entity": {
        "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9",
        "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
        "word": "music",
        "userId": "v1",
        "listId": "1r14XXXXZ3iSBbR3WTczWj92qsq",
        "status": true,
        "createDateTime": 1752489316741,
        "updateDateTime": 1752490995382
    }
}
```

### Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type  | Description                      |
| :----- | :---- | :------------------------ |
| `status` | String | Request status. If the request succeeds, `OK` is returned. |
| `entity` | JSON | Details of the modified keyword. |
| - `id` | String | ID of the modified keyword. |
| - `appId` | String | App ID. You can ignore this parameter. |
| - `word` | String  | Modified keyword. |
| - `userId` | String | ID of the user who modified the keyword. |
| - `listId` | String | Keyword list ID. |
| - `status` | String | Keyword status. You can ignore this parameter. |
| - `createDateTime` | Long | Time when the keyword was created. |
| - `updateDateTime` | Long | Time when the keyword was modified.|

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad request  | textList id is empty           | The keyword list ID parameter `list_id` is empty, so the App Key cannot be associated with `list_id`. | Pass the correct keyword list ID `list_id`. |
| 400 | Bad request | the param can not be empty | The keyword ID `id` in the request body is empty, so the App Key cannot be associated with `id`. | Pass the correct keyword ID `id`. |

For other errors, see [Error codes](error.html) for possible causes.
