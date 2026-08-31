# Retrieve Presence in Bulk

## Feature overview

You can retrieve the presence of up to 100 users at a time.

:::tip
By default, if a user logs in and out multiple times within 1 second, the server sends the client SDK a presence change notification based on the user's last action.
:::

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
POST https://{host}/{org_name}/{app_name}/users/{username}/presence
```

| Parameter       | Type   | Required | Description                                                         |
| :--------- | :----- | :------- | :----------------------------------------------------------- |
| `username` | String | Yes       | Retrieve the presence subscribed to by this user ID. If the specified user ID does not exist or has not subscribed to the presence of other users, an empty list is returned. |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X POST 'https://XXXX/XXXX/XXXX/users/wzy/presence' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'  \
-d '{"usernames":["c2","c3"]}'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Request body fields

The request body is a JSON object and supports only the following field:

| Parameter        | Type  | Required | Description                                                       |
| :---------- | :---- | :------- | :----------------------------------------------------------- |
| `usernames` | JSON Array | Yes    | List of users whose presence to retrieve, for example, `["user1", "user2"]`. You can pass a maximum of 100 user IDs. |

## Response example

```json
{
  "result":[
    {"uid":"c2",
    "last_time":"1644466063",
    "ext":"",
    "status":{"android":"0"}
    },
    {"uid":"c3",
    "last_time":"1644475330",
    "ext":"",
    "status":{
      "android":"0",
      "android":"0"}
    }
  ]
 }
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter        | Type       | Description                                                         |
| :---------- | :--------- | :----------------------------------------------------------- |
| `result`    | JSON Array | Whether users' presence was successfully retrieved in bulk. If successful, the presence of the subscribed users is returned. Otherwise, the corresponding error reason is returned. |
|  - `uid`       | String     | Unique ID of the user on the EasyIM server.                              |
|  - `last_time` | Long       | Unix timestamp of the user's most recent online time, in seconds.                                           |
|  - `ext`       | String     | User's presence extension information.                 |
|  - `status`    | JSON | User's presence on multiple devices:<br/> - `0`: Offline.<br/> - `1`: Online.<br/> - Other values: Custom presence set by the user.                                            |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type               | Error message | Possible cause                | Recommendation|  
| :---------- | :--- | :----------- | :-------- | :-------------- |
| 400         | illegal_argument       | too many get presences        | The list of users whose presence is to be retrieved exceeds the limit of 100 user IDs. | Limit the list to no more than 100 user IDs. |
| 400         | service open exception | the app not open presence      | The presence service is not activated.  | Contact the EasyIM business manager to activate the presence service.    |
| 401         | unauthorized           | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect.   | Use a new token to access the API.  |

For other errors, see [Response status codes](error.html) for possible causes.
