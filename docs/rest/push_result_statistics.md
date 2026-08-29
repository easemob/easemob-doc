# Retrieve Offline Push Result Statistics

To retrieve offline push results, contact the EasyIM business manager to activate this feature. After activation, the EasyIM offline push service generates push result messages.

## Ways to retrieve offline push results

You can retrieve offline push results in the following ways:

- View IM message delivery queries in the [EasyIM Console](https://console.easyim.ai/user/login):
  - On the **Applications** page, click the App Key in the **AppKey-Dev** or **AppKey-Prod** column.
  - Select **Instant Messaging > Real-Time Query > IM Message Delivery Query** to view push result records, as shown below:

![img](/images/server-side/message_delivery_query.png)

- Push result callback: [Create a post-delivery callback rule](/product/console/basic_webhook.html#configure-webhook-rules). For the **Callback Type** parameter, select **Offline Push Event**, and then select **Push Succeeded**, **Push Failed**, or **Push Exception** to receive push result callback content. For details about offline push events, see [Post-delivery webhook events](/rest/callback_login_logout.html).

![img](/images/server-side/post_callback_push.png)

- Call the RESTful API to retrieve offline push result statistics.

## Retrieve offline push result statistics using the RESTful API

### Call frequency limit

10 calls/10 seconds/App Key

### Request URL

```shell
GET https://{host}/{org_name}/{app_name}/push/data/offline-push/begin/{startTime}/end/{endTime}?platform={ALL}
```

| Parameter       | Type   | Required | Description         |
| :--------- | :----- | :------- | :------------------------- |
| `startTime` | String |  Yes       | Start time of the data query in yyyy-MM-dd format, for example, `2024-04-01`. |
| `endTime`   | String |  Yes       | End time of the data query in yyyy-MM-dd format, for example, `2024-04-02`. |
| `platform` | enum |  Yes      | Platform to query:<br/> - (Default) `ALL`: Query push statistics for all push platforms.<br/> - `APNS`: APNs push.<br/> - `ANDROID`: FCM push.|

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

### Request example

```shell
# Replace <YourAppToken> with the app token generated on your server
curl -g -X GET 'https://XXXX/XXXX/XXXX/push/data/offline-push/begin/2024-04-01/end/2024-04-02?platform=ALL' \
-H 'Authorization: Bearer <YourAppToken>
```

### Request header fields

| Field            | Type   | Description        | Required |
| :-------------- | :----- | :------------------- | :------- |
| `Authorization` | String | App admin authentication token in the format `Bearer YourAppToken`, where `Bearer` is a fixed string followed by a space and the obtained app token. | Yes       |

### Response example

```json
{
    "status": "OK",
    "data": {
        "2024-04-02": {
            "APNS": {
                "successCount": 7218,
                "failCount": 239
            },
            "ANDROID": {
                "successCount": 48852,
                "failCount": 1969
            }
        },
        "2024-04-01": {
            "APNS": {
                "successCount": 8306,
                "failCount": 1208
            },
            "ANDROID": {
                "successCount": 55933,
                "failCount": 1335
            }
        }
    }
}
```

### Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field        | Type   | Description                                                         |
| :---------- | :----- | :----------------------------------------------------------- |
| `status`  | String | Request status. If the request is successful, `OK` is returned. |
| `data`  | JSON | Offline push results. |
| `data.successCount`  | Int | Number of offline push notifications sent successfully. |
| `data.failCount`  | Int | Number of offline push notifications that failed to be sent. |
| `data.arriveCount`  | Int | Number of offline push notifications delivered to recipients. |

If the returned HTTP status code is not 200, the request fails. See [Error code](#error-code) for possible causes.

### Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type         | Error message       | Possible cause            | Recommendation             |
| :---------- | :--------------- | :------------------ | :-------------- | :--------------- |
| 403         | forbidden_op     |        | The offline push result statistics feature is not activated.                               | Contact the EasyIM business manager to activate the feature.                                     |
| 401         | unauthorized     | Unable to authenticate (OAuth)                               | The token is invalid, expired, or incorrect.                        | Use a new token.                                        |

For other errors, see [Response status codes](error.html) for possible causes.
