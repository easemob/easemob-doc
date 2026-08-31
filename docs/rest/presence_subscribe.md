# Subscribe to Presence in Bulk

Presence indicates a user's current status. In addition to the online and offline states built into EasyIM, you can add custom presence states such as Busy, Be right back, Away, On the phone, and Out to lunch. This section shows how to use the EasyIM RESTful APIs to manage presence subscriptions, including setting presence, subscribing to and retrieving presence in bulk, unsubscribing, and querying the subscription list.

For definitions of online, offline, and custom presence states, see [User presence management](/product/product_user_presence.html).

## Feature overview

- Subscribe to the presence of multiple users at a time.
- After subscribing to a user's presence, the subscriber receives a presence change notification whenever that user's presence changes. For example, if user A subscribes to user B's presence, user A receives a presence change notification when user B's presence changes.
- You can subscribe to the presence of up to 100 users at a time.
- Each user can subscribe to the presence of up to 3000 users.
- Up to 3000 users can subscribe to each user.
- A subscription can last for up to 30 days and must be renewed after it expires. If you subscribe again before it expires, the new validity period overwrites the previous one.

## Feature activation

Before using Presence, activate it in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#presence).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence/{expiry}
```

| Parameter       | Type   | Required | Description                                                 |
| :--------- | :----- | :------- | :--------------------------------------------------- |
| `username` | String | Yes       | User for whom to subscribe to presence.                             |
| `expiry`   | String | Yes       | Subscription duration in seconds. The maximum value is `2,592,000`, or 30 days. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/wzy/presence/1000' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json' \
-d '{"usernames":["c2","c3"]}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The request body is a JSON object containing the following fields:

| Field        | Type    | Required   | Description                                                         |
| :---------- | :--------- | :--------------------- | :------- |
| `usernames` | Array | Yes  | Array of user IDs whose presence is to be subscribed to, for example, ["user1", "user2"]. The array can contain up to 100 user IDs.      |

## Response example

```json
{
"result":[
  {"uid":"",
  "last_time":"1644466063",
  "expiry":"1645500371",
  "ext":"123",
  "status":{"android":"1","android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    },
    {"uid":"c3",
    "last_time":"1645183991",
    "expiry":"1645500371",
    "ext":"",
    "status":{
        "android":"0",
        "android_6b5610ac-4e11-4661-82b3-dee17bc7b2cc":"0"}
    }]
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field        | Type       | Description                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | Whether the presence of multiple users was successfully subscribed to in bulk. If successful, the subscribed users' presence is returned. Otherwise, the corresponding error reason is returned. |
|  - `uid`       | String     | Unique ID of the subscribed user on the EasyIM server.                              |
|  - `last_time` | Long    | Unix timestamp of the subscribed user's most recent online time, in seconds. The server records this time when the subscribed user logs in or out. |
|  - `expiry`    | Long    | Unix timestamp when the subscription expires, in seconds.                                           |
|  - `ext`       | String     | Presence extension information of the subscribed user.                   |
|  - `status`    | JSON | Presence of the subscribed user on multiple devices:<br> - `0`: Offline.<br> - `1`: Online.<br/> - Other values: Custom presence set by the user. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type     | Error message    | Possible cause   | Recommendation     |
| :---------- | :--- | :----------- | :----- | :-------------- |
| 400         | illegal_argument       | usernames is empty   | The array of subscribed users' user IDs is empty.           | Ensure that the array of subscribed users' user IDs is not empty.  |
| 400         | illegal_argument       | too many sub presence   | The list of subscribed users exceeds the limit of 100 user IDs.    | Limit the list of subscribed users to no more than 100 user IDs. |
| 400         | illegal_argument       | you can't sub yourself  | The list of subscribed users includes the current user, that is, it contains the `username` in the request URL path. | Remove the current user from the list of subscribed users.  |
| 400         | service open exception | the app not open presence  | The Presence service is not activated.                 | Contact the EasyIM business manager to activate the Presence service.    |
| 401         | unauthorized           | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect.      | Use a new token to access the API.           |

For other errors, see [Response status codes](error.html) for possible causes.
