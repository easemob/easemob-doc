# Retrieve the Subscription List

Presence indicates a user's current status. In addition to the online and offline states built into EasyIM, you can add custom presence states such as Busy, Be right back, Away, On the phone, and Out to lunch. This section shows how to use the EasyIM RESTful APIs to manage presence subscriptions, including setting presence, subscribing to and retrieving presence in batches, unsubscribing, and querying the subscription list.

For definitions of online, offline, and custom presence states, see [User presence management](/product/product_user_presence.html).

## Feature overview

Query, with pagination, the list of users whose presence the current user has subscribed to.

## Feature activation

Before using Presence, activate it in the [Easemob Console](https://console.easemob.com/user/login). For details, see the [Easemob Console documentation](/product/console/basic_user.html#real-time-user-presence-status-synchronization).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/users/{username}/presence/sublist?pageNum={pagenumber}&pageSize={pagesize}
```

| Parameter       | Type |  Required | Description                       |
| :--------- | :--- | :--------------- | :------- |
| `username` | String | Yes       | Query this user ID's subscription list. If the specified user ID does not exist or has not subscribed to the presence of other users, an empty list is returned. |
| `pageNum`  | Int  | Yes       | Page number to query. The value must be greater than or equal to 1. If this parameter is not passed, the default value is `1`.          |
| `pageSize` | Int  | Yes       | Number of subscribed users displayed per page. The value range is [1,100]. If this parameter is not passed, the default value is `1`.|

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
curl -X GET 'https://XXXX/XXXX/XXXX/users/wzy/presence/sublist?pageNum=1&pageSize=100' \
-H 'Authorization: Bearer <YourAppToken>' \
-H 'Content-Type: application/json' \
-H 'Accept: application/json'
```

## Request header fields

For details about the `Content-Type`, `Accept`, and `Authorization` fields, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "result":{
    "totalnum":"2",
    "sublist":[
     {
        "uid":"lxml2",
        "expiry":"1645822322"},
      {
        "uid":"lxml1",
        "expiry":"1645822322"
      }
    ]
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter       | Type   | Description                                                         |
| :--------- | :----- | :----------------------------------------------------------- |
| `result`   | JSON | Whether the subscription list was retrieved successfully. If successful, the subscribed users' presence is returned. Otherwise, the corresponding error reason is returned. |
| `result.totalnum` | Int | Total number of users currently subscribed to.                                         |
| `result.sublist`  | JSON Array | Subscription list. Each object in the list contains the subscribed user's ID field `uid` and the subscription expiration field `expiry`.    |
| `result.sublist.uid`      | String | Unique ID of the subscribed user on the EasyIM server.                              |
| `result.sublist.expiry`   | Int | Subscription expiration timestamp, in seconds.                                           |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type   | Error message | Possible cause  | Recommendation      |
| :---------- | :--- | :----------- | :------------ | :----- |
| 400         | service open exception | the app not open presence   | The presence service is not activated.  | Contact the Easemob business team to activate the presence service. |
| 401         | unauthorized           | Unable to authenticate (OAuth) | The token is invalid, expired, or incorrect. | Use a new token to access the API.|

For other errors, see [Response status codes](error.html) for possible causes.
