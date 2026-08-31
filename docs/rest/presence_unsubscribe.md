# Bulk Unsubscribe from Users' Presence

Presence indicates a user's current status. In addition to the online and offline states built into EasyIM, you can add custom presence states such as Busy, Be right back, Away, On the phone, and Out to lunch. This section shows how to use the EasyIM RESTful APIs to manage presence subscriptions, including setting presence, subscribing to and retrieving presence in bulk, unsubscribing, and querying the subscription list.

For definitions of online, offline, and custom presence states, see [User presence management](/product/product_user_presence.html).

## Feature overview

You can unsubscribe from the presence of up to 100 users at a time.

## Feature activation

Before using Presence, activate it in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#presence).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
DELETE https://{host}/{org_name}/{app_name}/users/{username}/presence
```

| Parameter       | Type   | Required | Description                             |
| :--------- | :----- | :------- | :------------------------------- |
| `username` | String | Yes       | User ID for whom to unsubscribe from presence. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X DELETE 'https://XXXX/XXXX/XXXX/users/wzy/presence' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-d '["c1"]'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

| Parameter    | Type  | Required | Description                                                         | 
| :------ | :---- | :--------------------------- | :------- |
| `users` | JSON Array |  Yes  | Array of user IDs whose presence is to be unsubscribed from, for example, ["user1", "user2"]. You can pass a maximum of 100 user IDs.      |

## Response example

```json
{"result":"ok"}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type   | Description                                           |
| :------- | :----- | :--------------------------------------------- |
| `result` | String | Whether the user's presence was successfully unsubscribed from. If successful, "ok" is returned. Otherwise, the corresponding error reason is returned. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type               | Error message | Possible cause| Recommendation      |
| :---------- | :--- | :----------- | :-------------- | :-- |
| 400         | illegal_argument       | usernames cannot be null       | The array of user IDs whose presence is to be unsubscribed from is empty.    | Ensure that the array of user IDs whose presence is to be unsubscribed from is not empty.  |
| 400         | illegal_argument       | too many unsub presences      | The list of users whose presence is to be unsubscribed from exceeds 100 user IDs. | Limit the list of users whose presence is to be unsubscribed from to no more than 100 user IDs. |
| 400         | service open exception | the app not open presence      | The Presence service is not activated.        | Contact the EasyIM business manager to activate the Presence service.   |
| 401         | unauthorized           | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect.  | Use a new token to access the API.  |

For other errors, see [Response status codes](error.html) for possible causes.
