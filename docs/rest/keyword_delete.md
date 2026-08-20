# Delete a Keyword

## Feature overview

- Delete a keyword.
- In the [Easemob Console](https://console.easemob.com/user/login), you can also [delete keywords](/value-added/moderation/moderation_keyword.html#delete-keywords).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/moderation/text/list/(list_id)/word?wordId={word_id}
```

| Parameter          | Type   | Required | Description  |
| :------------ | :----- | :------- | :---------------- |
| `list_id`        | String | Yes       | Keyword list ID. |
| `word_id`  | String    | Yes       | ID of the keyword to delete.   |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X DELETE 'https://XXXX/XXXX/XXXX/moderation/text/list/{list_id}/word?wordId={word_id}' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "status": "OK",
  "entity": true
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type  | Description                      |
| :----- | :---- | :------------------------ |
| `status` | String | Request status. If the request succeeds, `OK` is returned. |
| `entity` | Boolean | Whether the deletion succeeded:<br/> - `true`: Success <br/> - `false`: Failure |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 400 | Bad Request | request data is empty | The keyword list ID does not exist. | Pass the correct keyword list ID. |

For other errors, see [Error codes](error.html) for possible causes.
