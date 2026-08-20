# Set Friend Remarks

## Feature overview

- Set remarks for one of your friends in the current app.
- Add the user as a friend before setting friend remarks.
- Calling this API triggers the post-delivery callback event for setting friend remarks. For details, see [Callback events](callback_contact.html).

## Call frequency limit

100 calls/second/App Key
  
## Request URL

```http
PUT https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}
```

| Parameter              | Type   | Required | Description           |
| :---------------- | :----- | :------- |:-------------|
| `owner_username`  | String | Yes       | User whose friend remarks are to be set. |
| `friend_username` | String | Yes       | User ID for whom to set friend remarks. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X PUT 'https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-H 'Authorization: Bearer <YourAppToken>' \
-d '{
  "remark": <remark>
}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter              | Type   | Required | Description           |
| :---------------- | :----- | :------- |:-------------|
| `remark`  | String | Yes   | Friend remarks.Friend remarks cannot exceed 100 characters.  |

## Response example

```json
{
  "action": "put",
  "duration": 22,
  "status": "ok",
  "timestamp": 1700633088329,
  "uri": "https://{host}/{org_name}/{app_name}/user/{owner_username}/contacts/users/{friend_username}"
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field                 | Type     | Description                                    |
| :------------------- |:-------|:--------------------------------------|
| `action`           | String | Request method.                                 |
| `status`      | String | Whether friend remarks were set successfully. `ok` indicates success.                         |
| `timestamp`   | Long   | UNIX timestamp of the HTTP response, in milliseconds.                         |
| `uri`  | Long   | Request URL. |

If the returned HTTP status code is not `200`, the request fails. See [Error code](#error-code) for possible causes.

## Error code

| HTTP status code        | Error type | Error message          | Possible cause | Recommendation |
| :----------- | :--- | :------------- | :----------- | :----------- |
| 400     | illegal_argument | updateRemark they are not friends, please add as a friend first. | The two users are not friends. | Add the user as a friend before setting friend remarks. |
| 401     | unauthorized | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token. |
| 404     | service_resource_not_found | Service resource not found | The user ID of the user setting friend remarks or the friend whose remarks are being set does not exist. | Verify that both user IDs exist.| 
