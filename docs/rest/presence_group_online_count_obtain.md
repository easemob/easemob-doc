# Retrieve the Number of Online Members in a Chat Group

Presence indicates a user's current status. In addition to the online and offline states built into EasyIM, you can add custom presence states such as Busy, Be right back, Away, On the phone, and Out to lunch. This section shows how to use the EasyIM RESTful APIs to manage presence subscriptions, including setting presence, subscribing to and retrieving presence in bulk, unsubscribing, and querying the subscription list.

For definitions of online, offline, and custom presence states, see [User presence management](/product/product_user_presence.html).

## Feature overview

- Retrieve the number of online members in a chat group. **To use this API, contact the EasyIM business manager to activate it.**
- In this API, online indicates that the user's app has successfully established a connection to the server. It does not include custom presence states such as Busy or Be right back.

# Feature Activation

Before using this API, you need to activate Presence and activate this API separately:

1. Activate Presence in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_user.html#presence).
2. Contact the EasyIM business manager to activate this API.

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/presence/online/{group_id}/type/{query_type}
```

| Parameter   | Type   | Required | Description                                    |
| :----- | :----- | :------- | :-------------------------------------- |
| `group_id`   | String | Yes       | Chat group ID.                                |
| `query_type` | Int    | Yes       | Query type. To query the number of online members in a chat group, pass `1`. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

```shell
# 将 <YourAppToken> 替换为你在服务端生成的 App Token
curl -X GET 'https://XXX/XXX/XXX/presence/online/XXX/type/XXX'   \
-H 'Accept: application/json'    \
-H 'Authorization: Bearer <YourAppToken>' 
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
    "result": 100
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Field     | Type | Description               |
| :------- | :--- | :----------------- |
| `result` | Int  | Number of online members in the chat group. |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type               | Error message                 | Possible cause  | Recommendation   |
| :---------- | :--- | :--------- | :------------ | :-------------- |
| 400         | illegal_argument       | Id cannot be null.       | The chat group ID is empty. | Ensure that the chat group ID is not empty. |
| 400         | illegal_argument       | Type cannot be null.     | The query type is empty.    | Ensure that the query type is not empty. |
| 400         | illegal_argument       | Type must be 0 or 1.     | The query type (`query_type`) is neither 0 nor 1.  | To query the number of online members in a chat group, set the query type to `1`. Passing `0` retrieves the number of online members on a community server in a super community and is unrelated to chat groups. |
| 400         | service open exception | this appkey not open rest group online service | The service for counting online chat group members is not activated. | Contact the EasyIM business manager to activate the service for counting online chat group members. |
| 401         | unauthorized           | Unable to authenticate (OAuth)    | The token is invalid, expired, or incorrect. | Use a new token to access the API. |

For other errors, see [Response status codes](error.html) for possible causes.
