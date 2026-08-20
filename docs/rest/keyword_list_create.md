# Create a Keyword List

## Feature overview

- Create a keyword list.
- Keyword lists are applied in [text moderation rules](/value-added/moderation/moderation_rule_config.html#configure-moderation-rules). Before use, activate the [text moderation service](/value-added/moderation/moderation_enable.html) and configure [text moderation rules](/value-added/moderation/moderation_rule_config.html#configure-moderation-rules).
- Created lists are displayed in the Easemob Console, where you can edit or delete lists and add or delete keywords. For details, see [Keyword moderation](/value-added/moderation/moderation_keyword.html#configure-keyword-lists).
- Each app can have up to 100 lists, and each list can contain up to 10,000 keywords. Therefore, each app can have up to 1,000,000 entries.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/moderation/text/list
```

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server
curl -X POST 'https://XXXX/XXXX/XXXX/moderation/text/list' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "list_1",
      "scope": "ALL",
      "disposition": "PASS",
      "fullMatch": true,
      "userId": "v1",
      "textContexts": ["music", "sport", "entertainment"]
    }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | Yes       | Keyword list name, which cannot exceed 32 characters. |
| `scope` | String | Yes       | Scope of the keyword list:<br/> - `ALL`: Applies to all conversations.<br/> - `CHAT`: Applies only to one-to-one chat conversations.<br/> - `GROUP`: Applies only to chat group conversations.<br/> - `ROOM`: Applies only to chat room conversations.<br/> - `TAG`: Applies only to users, chat groups, or chat rooms under the specified tag.|
| `tagId`        | String | No       | Tag ID. This parameter is required only when `scope` is `TAG`.  |
| `disposition`        | String | Yes       | Moderation action for message content that matches a keyword:<br/> - `PASS`: Ignore the matched keyword and take no action.<br/> - `REJECT`: Block the message whose content matches the keyword and do not deliver it to the receiver.<br/> - `EXCHANGE`: Replace it with `***`.|
| `fullMatch`        | Boolean | No       | Whether to exactly match keywords against message content:<br/> - `true`: Yes  <br/> - (Default) `false`: No  |
| `userId`        | String | No       | ID of the user who creates the keyword list.   |
| `textContexts`        | Array | Yes       | Keywords. You can include up to 200 keywords at a time, and each keyword cannot exceed 128 characters.  |

## Response example

```json
{
    "status": "OK",
    "entity": {
        "id": "1xIXXXXlodF52URYQk7rZmd5s8k",
        "name": "list_1",
        "moderationId": "159XXXXcL0ylUvcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": true,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 3,
        "status": "ACTIVE",
        "createDataTime": 1752631447613,
        "updateDataTime": 1752631447613,
        "textList": [
            {
                "id": "1xXXXXzCd7dhlkbkgE9REtO760H",
                "appId": "1XXXXAi7wabrqsrjCV449Kljh98",
                "word": "music",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            },
            {
                "id": "1xXXXXSXWJyUAkatENR9VM9cM8H",
                "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
                "word": "entertainment",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            },
            {
                "id": "1xXXXXMwaoioOHkiGr74Ru6xArO",
                "appId": "1DHFtAi7wabrqsrjCV449Kljh98",
                "word": "sport",
                "userId": "v1",
                "listId": "1xXXXXlodF52URYQk7rZmd5s8k",
                "status": true,
                "createDateTime": 1752631447638,
                "updateDateTime": 1752631447638
            }
        ]
    }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

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
| - `suggestion` | String | Recommended action for message content that matches a keyword. The values and their meanings are the same as those of the `disposition` field.  |
| - `disposition` | String | Action for message content that matches a keyword. For details about this field, see `disposition` in [Request body fields](#request-body-fields). |
| - `quantity` | Int | Number of keywords. |
| - `status` | String | Keyword list status:<br> - `ACTIVE`: Enabled<br> - `CLOSE`: Disabled |
| - `createDataTime` | Long | Time when the keyword list was created.|
| - `updateDataTime` | Long | Time when the keyword list was modified. |
| - `textList` | Array | Keyword list.<br> - `id`: String, keyword ID. <br> - `appId`: String, app ID. <br> - `word`: String, keyword.  <br> - `userId`: String, ID of the user who added the keyword. <br/> - `listId`: String, keyword list ID. <br/> - `status`: String, keyword status. You can ignore this parameter.<br> - `createDateTime`: Long, time when the keyword was added. <br> - `updateDateTime`: Long, time when the keyword was updated. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad Request | request param is empty | The scope, keyword list name, or moderation action for message content matching a keyword is empty. | Check the required parameters. |
| 400 | Bad Request | The textList count exceeds the maximum number | The number of keyword lists exceeds the limit. Each app can have up to 100 lists. | Reduce the number of keyword lists. |
| 400 | Bad Request | The text count exceeds the maximum number | The number of keywords exceeds the limit. | Reduce the number of keywords. |
| 400 | Bad Request | The textList already exists | The keyword list name already exists. | Modify the keyword list name. |
| 400 | Bad Request | moderation org data is empty | The content moderation service is not activated. | Activate the content moderation service. |
| 400 | Bad Request | the number of words exceeds the limit | The total number of keywords under the app exceeds the limit. Each app can have up to 100 lists, and each list can contain up to 10,000 keywords. Therefore, each app can have up to 1,000,000 entries.| Reduce the number of keywords. |
| 400 | MODERATION_002 | "request param is empty | This error is reported if a required parameter, such as `name` or `scope`, is not set. | Pass the required parameters. |

For other errors, see [Error codes](error.html) for possible causes.
