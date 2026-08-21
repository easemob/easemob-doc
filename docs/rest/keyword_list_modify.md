# Modify a Keyword List

## Feature overview

- Modify a keyword list, including its name, scope, matching tag, moderation action for matching message content, whether to use exact matching, and other parameters.
- You can also modify a keyword list in the [EasyIM Console](https://console.easyim.ai/user/login): Select **EasyIM** > **Content Moderation** > **Text Moderation** > **Keyword Lists**.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/moderation/text/list/{list_id}
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`        | String | Yes       | Keyword list ID. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X PUT 'https://XXXX/XXXX/XXXX/moderation/text/list/1xXXXXVlodF52URYQk7rZmd5s8k' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
      "name": "list_1",
      "scope": "ALL",
      "disposition": "PASS",
      "fullMatch": true,
      "userId": "v1"
    }' 
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter            | Type   | Required | Description         |
| :-------------- | :----- | :------- | :----------------------- |
| `name`        | String | Yes       | Keyword list name, which cannot exceed 32 characters. |
| `scope` | String | Yes       | Scope of the keyword list:<br/> - `ALL`: Applies to all conversations.<br/> - `CHAT`: Applies only to one-to-one chat conversations.<br/> - `GROUP`: Applies only to chat group conversations.<br/> - `ROOM`: Applies only to chat room conversations.<br/> - `TAG`: Applies only to users, chat groups, or chat rooms under the specified tag.|
| `tagId`        | String | No       | Tag ID. This parameter is required only when `scope` is `TAG`.   |
| `disposition`        | String | Yes       | Moderation action for message content that matches a keyword:<br/> - `PASS`: Ignore the matched keyword and take no action.<br/> - `REJECT`: Block the message whose content matches the keyword and do not deliver it to the receiver.<br/> - `EXCHANGE`: Replace it with `***`.  |
| `fullMatch`        | Boolean | No       | Whether to exactly match keywords against message content:<br/> - `true`: Yes  <br/> - (Default) `false`: No  |
| `userId`        | String | No       | User ID.  |

## Response example

```json
{
    "status": "OK",
    "entity": {
        "id": "1xXXXXVlodF52URYQk7rZmd5s8k",
        "name": "list_1",
        "moderationId": "159XXXXL0ylUvcBfVAZ0IRQNwW",
        "appkey": "XXXX#XXXX",
        "category": "DEFAULT",
        "scope": "ALL",
        "tagId": null,
        "fullMatch": true,
        "suggestion": "PASS",
        "disposition": "PASS",
        "quantity": 3,
        "status": "ACTIVE",
        "createDataTime": "2025-07-16T02:04:07.613+00:00",
        "updateDataTime": "2025-07-16T03:57:04.193+00:00"
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
| - `moderationId` | String | Moderation ID. You can ignore this parameter. |
| - `appkey` | String | App Key of the app. |
| - `scope` | String | Scope of the keyword list.  |
| - `tagId` | String | User tag ID. |
| - `fullMatch` | Boolean | Whether to exactly match keywords against message content. |
| - `suggestion` | String | Recommended action for message content that matches a keyword. The values and their meanings are the same as those of the `disposition` field.  |
| - `disposition` | String | Action for message content that matches a keyword.  |
| - `quantity` | Int | Number of keywords. |
| - `status` | String | Keyword list status.<br> - `ACTIVE`: Enabled<br> - `CLOSE`: Disabled. |
| - `createDataTime` | Long | Time when the keyword list was created. |
| - `updateDataTime` | Long | Time when the keyword list was modified. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------: | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad request | textList data is empty | The keyword list ID parameter `list_id` passed in the request does not exist, so the App Key cannot be associated with `list_id `. | Pass the correct `list_id` parameter. |
| 400 | Bad request | The textList already exists | The keyword list name `name` passed in the request is duplicated. | Modify the value of `name`. |
| 400 | Bad request | textList id is empty | The keyword list ID parameter `list_id` passed in the request is empty. | Pass the correct `list_id`. |

For other errors, see [Error codes](error.html) for possible causes.
