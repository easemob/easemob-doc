# Query Keywords

## Feature overview

- Query keywords in a keyword list.
- This API performs a fuzzy query. For example, if you pass the keyword `message`, the response returns entries in the keyword list that contain it, including `message``messageid`, `addmessage`, and `deletemessage`.
- You can also query keywords in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see [Keyword moderation](/value-added/moderation/moderation_keyword.html#configure-keyword-lists).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`    | String | Yes       | Keyword list ID. Keywords in this list are queried. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "word": "music",
      "size": "3",
      "page": "0"
    }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `word`        | String | Yes | Keyword to query. |
| `page` | Int   | No | Current page number. The default value is `0`.|
| `size` | Int   | No   | Number of keywords returned per page. The value range is [1,200], and the default value is `10`.|

## Response example

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1xXXXX7uZXqAfXzk0Y2OZ3JOhJt",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "musicvideo",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752501847581,
            "updateDateTime": 1752501847581
        },
        {
            "id": "1xXXXXUjdvN1LE68wFeILywpks2",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "musicraudio",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752501847581,
            "updateDateTime": 1752501847581
        },
        {
            "id": "1xXXXXNiiIOSZmGNMBGgNEZ6jj9",
            "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
            "word": "music",
            "userId": "v1",
            "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
            "status": true,
            "createDateTime": 1752489316741,
            "updateDateTime": 1752490995382
        }
    ],
    "first": true,
    "last": true,
    "size": 3,
    "number": 0,
    "numberOfElements": 3,
    "totalPages": 1,
    "totalElements": 3
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type  | Description                      |
| :----- | :---- | :------------------------ |
| `status` | String | Request status. If the request succeeds, `OK` is returned. |
| `entities` | JSON Array | Query details. |
| - `id` | String | Keyword ID. |
| - `word` | String  | Keyword. |
| - `userId` | String | User who queried the keyword. |
| - `listId` | String | Keyword list ID. |
| - `createDateTime` | Long  | Time when the keyword was added. |
| - `updateDateTime` | Long | Time when the keyword was modified.|
| `first` | Boolean | Whether the current page is the first page:<br/> - `true`: Yes <br/> - `false`: No  |
| `last` | Boolean | Whether the current page is the last page:<br/> - `true`: Yes <br/> - `false`: No |
| `size` | Int | Entries on the current page that fuzzily match the queried keyword.|
| `number` | Int | Current page number. |
| `numberOfElements` | Int | Number of entries retrieved on the current page. |
| `totalPages` | Int | Total number of pages. |
| `totalElements` | Int | Total number of entries matching the queried keyword. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad request | textList data is empty | `list_id` was not passed. | Pass a valid `list_id`. |
| 400 | Bad request | appkey is not exist | The App Key is a unique identifier assigned by EasyIM to each app and consists of the values of the `org_name` and `app_name` parameters. This error indicates that `org_name` or `app_name` is incorrect. | Pass the correct `org_name` and `app_name` parameters.|

For other errors, see [Response status codes](error.html) for possible causes.
