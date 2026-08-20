# Query Keyword Lists

## Feature overview

- You can query a keyword list or query keyword lists with pagination.
- In the [Easemob Console](https://console.easemob.com/user/login), you can also [query keyword lists](/value-added/moderation/moderation_keyword.html#configure-keyword-lists).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list/search
```

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

- Query the keyword list with the specified name:

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "14"
    }' 
```

- Query keyword lists that match a specified chat group/chat room tag:

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "tagId": "111"
    }' 
```

- Query keyword lists on a specified page. For example, query keyword lists on page `1`:
  
```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list/search' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "page": 1,
      "size": 5
    }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

- If you pass only `name`, the keyword list with the specified name is returned.
- If you pass only `tagId`, keyword lists matching the specified tag are returned.
- If you pass only `size` and `page`, keyword lists on the specified page are returned.
- If you pass none of these four parameters, keyword lists on page `0` are returned by default, with 10 lists per page. If the app has fewer than 10 keyword lists, all of them are returned.

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | No       | Keyword list name. |
| `tagId`        | String | No       | ID of the chat group/chat room tag.|
| `size` | Int   | No   | Number of keywords returned per page. The value range is [1,200], and the default value is `10`.| 
| `page` | Int   | No | Current page number. The default value is `0`.|  

## Response example

- Return the keyword list with the specified name:

```json
{
    "status": "OK",
    "entities": [
        {
            "id": "1r14aXXXX2vv3ob5wctsjB970y6",
            "name": "14",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:24.888+00:00",
            "updateDataTime": "2025-02-28T08:50:24.888+00:00"
        }
    ],
    "first": true,
    "last": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 1,
    "totalPages": 1,
    "totalElements": 1
}
```

- Return keyword lists matching a specified chat group/chat room tag. For example, the following response indicates that no keyword list matches the specified tag:

```json
{
    "status": "OK",
    "entities": [],
    "first": true,
    "last": true,
    "size": 10,
    "number": 0,
    "numberOfElements": 0,
    "totalPages": 0,
    "totalElements": 0
}
```

- Return keyword lists on a specified page. For example, return keyword lists on page `1`, with 5 lists on the page:

```json 
{
    "status": "OK",
    "entities": [
        {
            "id": "1r1XXXX8f5zh3Tu9PMKIyu7AwED",
            "name": "8",
            "moderationId": "159XXXXL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:49:57.156+00:00",
            "updateDataTime": "2025-02-28T08:49:57.156+00:00"
        },
        {
            "id": "1r1XXXXUhZAQwknj7mJWUTlyFYP",
            "name": "9",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:04.228+00:00",
            "updateDataTime": "2025-02-28T08:50:04.228+00:00"
        },
        {
            "id": "1r14XXXXDxBnH3oMuSzhroY1shB",
            "name": "12",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:14.528+00:00",
            "updateDataTime": "2025-02-28T08:50:14.528+00:00"
        },
        {
            "id": "1r14XXXXeuqtBfaHcvJaZuandVR",
            "name": "13",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-02-28T08:50:20.616+00:00",
            "updateDataTime": "2025-02-28T08:50:20.616+00:00"
        },
        {
            "id": "1xXXXXmhFTjU2LvOooO1IEGpeut",
            "name": "111111",
            "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
            "appkey": "XXXX#XXXX",
            "category": "DEFAULT",
            "scope": "ALL",
            "tagId": null,
            "fullMatch": false,
            "suggestion": "PASS",
            "disposition": "PASS",
            "quantity": 0,
            "status": "ACTIVE",
            "createDataTime": "2025-07-22T09:44:12.917+00:00",
            "updateDataTime": "2025-07-22T09:44:12.917+00:00"
        }
    ],
    "first": true,
    "last": false,
    "size": 5,
    "number": 1,
    "numberOfElements": 5,
    "totalPages": 5,
    "totalElements": 24  
}   
```    

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type  | Description                      |
| :----- | :---- | :------------------------ |
| `status` | String | Request status. If the request succeeds, `OK` is returned. |
| `entities` | JSON Array | Keyword list details. |
| - `id` | String | Keyword list ID. |
| - `name` | String  | Keyword list name. |
| - `moderationId` | String | Moderation ID. You can ignore this parameter. |
| - `appkey` | String | App Key of the app. |
| - `category` | String | The value is `DEFAULT`, indicating a keyword list. |
| - `scope` | String | Scope of the keyword list.  |
| - `tagId` | String | Tag ID. |
| - `fullMatch` | Boolean | Whether to exactly match keywords against message content. |
| - `suggestion` | String | Recommended action for message content that matches a keyword. The values and their meanings are the same as those of the `disposition` field.  |
| - `disposition` | String | Action for message content that matches a keyword.  |
| - `quantity` | Int | Total number of keywords in the list. |
| - `status` | String | Keyword list status:<br> - `ACTIVE`: Enabled<br> - `CLOSE`: Disabled |
| - `createDataTime` | Long | Time when the keyword list was created.|
| - `updateDataTime` | Long | Time when the keyword list was modified.|
| `first` | Boolean | Whether the current page is the first page:<br/> - `true`: Yes <br/> - `false`: No|
| `last` | Boolean | Whether the current page is the last page:<br/> - `true`: Yes <br/> - `false`: No|
| `size` | Int | Number of keyword lists queried per page. |
| `number` | Int | Current page number. |
| `numberOfElements` | Int | Number of keyword lists retrieved on the current page.|
| `totalPages` | Int | Total number of pages.|
| `totalElements` | Int | Total number of keyword lists for the app.|

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |

For other errors, see [Error codes](error.html) for possible causes.
