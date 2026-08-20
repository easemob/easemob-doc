# Retrieve the Delivery Status of an Offline Message

## Feature overview

- Retrieve the delivery status of a user's specified offline message to determine whether it has been delivered.
- "Delivered" indicates that the receiver received the message when they got online.
- "Undelivered" indicates that the receiver is offline and the message has not yet been delivered. It will be delivered after the receiver gets online.
- For the number of offline messages stored and their retention period, see [Offline message storage](/product/product_message_overview.html#message-storage).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/offline_msg_status/{msg_id}
```

| Parameter       | Type   | Required | Description                             |
| :--------- | :----- | :------- | :------------------------------- |
| `username` | String | Yes       | User ID whose offline message status to retrieve. |
| `msg_id`   | String | Yes       | ID of the offline message whose delivery status to retrieve. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# Replace <YourAppToken> with the App Token generated on your server

curl -X GET 'https://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123'   \
-H 'Accept: application/json'  \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For details about the `Accept` and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "action": "get",
  "uri": "https://XXXX/XXXX/XXXX/users/user1/offline_msg_status/123",
  "entities": [],
  "data": {
    "123": "delivered"
  },
  "timestamp": 1542601830084,
  "duration": 5
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The `data` field in the response body is described below:

| Field   | Type | Description     |
| :----- | :--- | :--------------- |
| `data` | JSON | Delivery status of the specified offline message. The data format is "message ID": "delivery status". There are two delivery statuses:<br/> - `delivered`: Delivered.<br/> - `undelivered`: Undelivered. |

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

| HTTP status code | Error type     | Error message           | Possible cause          | Recommendation     |
| :---------- | :------------ | :-------------- | :------------------| :----------- |
| 401         | unauthorized                       | Unable to authenticate (OAuth)   | The token is invalid, expired, or incorrect. | Use a new token to access the API.     |
| 404         | organization_application_not_found | Could not find application for XXX/XXX from URI: XXX/XXX/users | The App Key does not exist.    | Check whether `orgName` and `appName` are correct, or [create an app](/product/console/app_create.html). |

For other errors, see [Error codes](error.html) for possible causes.
