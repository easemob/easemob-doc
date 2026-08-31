# Retrieve a User's Offline Message Count

## Feature overview

- Retrieve the number of offline messages for an EasyIM user.
- For the number of offline messages stored and their retention period, see [Offline message storage](/product/product_message_overview.html#message-storage).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{owner_username}/offline_msg_count
```

| Parameter             | Type   | Required | Description                             |
| :--------------- | :----- | :------- | :------------------------------- |
| `owner_username` | String | Yes       | User ID whose offline message count to retrieve. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/offline_msg_count'  \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/offline_msg_count",
  "entities": [],
  "data": {
    "user1": 0
  },
  "timestamp": 1542601518137,
  "duration": 3,
  "count": 0
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field   | Type | Description                                                                                  |
| :----- | :--- | :------------------------------------------------------------------------------------ |
| `data` | JSON | User's offline message count. The data format is "user ID": "current offline message count", for example, "user1": "0". |

The other fields in the response body are described below:

| Parameter              | Type   | Description                                                                           |
| :---------------- | :----- | :----------------------------------------------------------------------------- |
| `action`          | String | Request method. |
| `uri`             | String | Request URL. |
| `entities`        | JSON Array   | Response entities. |
| `timestamp`       | Long   | Unix timestamp in milliseconds. |
| `duration`        | Int    | Duration from sending the request to receiving the response, in milliseconds. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type     | Error message     | Possible cause   | Recommendation   |
| :------ | :--------- | :----------- | :--------- | :--------- |
| 401         | unauthorized                       | Unable to authenticate (OAuth)  | The token is invalid, expired, or incorrect. | Use a new token to access the API.  |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist. | Verify `orgName` and `appName`, or [create an app](/product/console/app_create.html). |

For other errors, see [Error codes](error.html) for possible causes.
