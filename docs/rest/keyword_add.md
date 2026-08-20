# Add Keywords

## Feature overview

- Add keywords.
- Each app can have up to 100 lists, and each list can contain up to 10,000 keywords. Therefore, each app can have up to 1,000,000 entries.
- You can also configure and use keywords in the [Easemob Console](https://console.easemob.com/user/login). For details, see [Keyword moderation](/value-added/moderation/moderation_keyword.html#add-keywords).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}/word/batch
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`    | String | Yes       | Keyword list ID. Keywords are added to this list.  |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word/batch' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "wordContents": [
      "music",
      "musicradio",
      "musicvideo"
      ],
      "userId": "v1"
    }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `wordContents`        | Array | Yes | List of keywords to add. You can add a maximum of 100 keywords at a time. |
| `userId`        | String | Yes       | ID of the user who adds the keywords. |

## Response example

```json
{
    "status": "OK",
    "entity": {
        "id": "1r14SOXXXXiSBbR3WTczWj92qsq",
        "name": "1",
        "moderationId": "159Rss4cL0XXXXcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": false,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 4,
        "status": "ACTIVE",
        "createDataTime": 1740732560873,
        "updateDataTime": 1752501847616,
        "textList": [
            {
                "id": "1xDQ86NiiXXXXmGNMBGgNEZ6jj9",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "music",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752489316741,
                "updateDateTime": 1752490995382
            },
            {
                "id": "1xXXXXUjdvN1LE68wFeILywpks2",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "musicradio",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752501847581,
                "updateDateTime": 1752501847581
            },
            {
                "id": "1xDpWuXXXXqAfXzk0Y2OZ3JOhJt",
                "appId": "1DHFtAi7XXXXqsrjCV449Kljh98",
                "word": "musicvideo",
                "userId": "v1",
                "listId": "1r14SOXXXXiSBbR3WTczWj92qsq",
                "status": true,
                "createDateTime": 1752501847581,
                "updateDateTime": 1752501847581
            }
        ]
    }
}
```

##  Response body fields

If the returned HTTP status code is `200`, the request succeeds. The fields in the response body are described as follows:

| Field   | Type  | Description                      |
| :----- | :---- | :------------------------ |
| `status` | String | Request status. If the request succeeds, `OK` is returned. |
| `entity` | JSON | Keyword list details. |
| - `id` | String | Keyword list ID. |
| - `name` | String  | Keyword list name. |
| - `moderationId` | String | Moderation ID. You can ignore this parameter.|
| - `appkey` | String | App Key of the app. |
| - `category` | String | The value is `DEFAULT`, indicating a keyword list. |
| - `scope` | String | Scope of the keyword list.  |
| - `tagId` | String | Tag ID. |
| - `fullMatch` | Boolean | Whether to exactly match keywords against message content. |
| - `disposition` | String | Action for message content that matches a keyword.|
| - `quantity` | Int | Total number of keywords in the keyword list.|
| - `status` | String | Keyword list status.<br> - `ACTIVE`: Enabled<br> - `CLOSE`: Disabled |
| - `createDataTime` | Long | Time when the keyword list was created.|
| - `updateDataTime` | Long | Time when the keyword list was modified.|
| - `textList` | JSON Array | Keyword list. Each keyword contains the following details:<br/> - `id`: String, keyword ID <br/> - `appId`: String, App ID <br/> - `word`: String, keyword <br/> - `userId`: String, ID of the user who added the keyword <br/> - `listId`: String, keyword list ID <br/> - `status`: String, keyword status. You can ignore this parameter.<br/> - `createDateTime`: Long, time when the keyword was added <br/> - `updateDateTime`: Long, time when the keyword was modified |

If the returned HTTP status code is not `200`, the request fails. See [Error code](error.html) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad Request | The text count exceeds the maximum number | The number of keywords exceeds the limit. | Reduce the number of keywords. Each list can contain up to 10,000 keywords, and each app can have up to 1,000,000 entries.|
| 400 | Bad Request | request data is empty | The list to be added is empty. | Add a keyword list. |
| 400 | Bad Request | textList data is empty | The keyword list does not exist. | Create a keyword list before performing the operation. |
| 400 | Bad Request | The textList already contains the text | A keyword is duplicated. | Remove duplicate keywords. |

For other errors, see [Error codes](error.html) for possible causes.
