# Import a Friend List

## Feature overview

- Import up to 10 friends in a batch.
- Ensure that the user's friend count does not exceed the limit after importing the friend list. If the limit is reached during import, the response returns the user IDs of friends that failed to import. The per-user friend limit depends on your plan. For details, see [IM plan features](/product/product_package_feature.html).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/contacts/import
```

| Parameter              | Type   | Required | Description           |
| :---------------- | :----- | :------- |:-------------|
| `username`  | String | Yes  | User ID for whom to import a friend list.  |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl --location 'https://{host}/{org_name}/{app_name}/users/{username}/contacts/import' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-d '{
    "usernames":[
        "1",
        "2",
        "3"
    ]
}'
```

## Request header fields

| Parameter      | Type | Required | Description    |
|:--------|:--------|:-----|:----------------------|
| `isSendNotice` | Boolean | No    | Whether to send a notification to the SDK after importing friends:<br/> - `true`: Yes.<br/> - (Default) `false`: No. |

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter      | Type    | Required | Description                       |
|:--------|:------|:-----|:-------------------------|
| `usernames` | Array | Yes    | Friend user IDs. You can import up to 10 per request. |

## Response example

```json
{
  "status": "ok",
  "timestamp": 1712728623854,
  "action": "post",
  "data": {
    "UnKnowFailed": [],
    "success": [
      "username1",
      "username2",
      "username3"
    ],
    "NotExistFailed": [],
    "maxLimitFailed": []
  },
  "duration": 176
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field                       | Type     | Description                |
|:-------------------------|:-------|:------------------|
| `status`                 | String | `ok` indicates that the friend list was imported successfully.       |
| `timestamp`              | Long | Current timestamp in milliseconds.             |
| `action`                 | String | Request method.  |
| `data`               | JSON   | Details of the retrieved data.            |
| `data.UnKnowFailed`      | Array | User IDs of friends that failed to be added due to a system error. |
| `data.success`           | Array | User IDs of successfully added friends. |
| `data.NotExistFailed`    | Array | User IDs of friends that do not exist. |
| `data.maxLimitFailed`    | Array | User IDs of friends that failed to import because the friend limit was reached. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID for importing the friend list does not exist. | Verify that the user ID for importing the friend list exists. | 
| 400     | illegal_argument   | request user over flow limit:10.          | The number of user IDs in the request body exceeds 10.           | The `usernames` parameter can contain up to 10 user IDs per request.         |
| 403     | exceed_limit   | Inviter's contact max count.          | The user calling this API has reached the friend limit. The per-user friend limit depends on your plan. For details, see [IM plan features](/product/product_package_feature.html). |            |
