# Retrieve Reaction Information by Message ID and Emoji ID

A Reaction is an emoji response to an individual message in a one-to-one or group chat, enriching user interactions during chats. Currently, **Reaction applies only to one-to-one chats and chat groups. Chat rooms do not support Reaction.**

## Feature overview

- This API retrieves the corresponding Reaction information by the specified message ID and emoji ID, including the IDs and number of users who used the Reaction.
- For detailed Reaction usage limits, see [Product usage limits](limitation.html).

## Feature activation

To use Reaction, activate it in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_message.html#message-reactions).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}/detail?msgId={msgId}&message={message}&limit={limit}&cursor={cursor}
```

| Parameter      | Type   | Required | Description                                                           |
| :-------- | :----- | :------- | :------------------------------------------------------------- |
| `userId` | String | Yes       | User ID of the current user. |
| `msgId`   | String | Yes       | Message ID.                                                      |
| `message` | String | Yes       | Emoji ID. The length cannot exceed 128 characters. The value must be consistent with the client. |
| `limit`   | Int    | No       | Number of users who added the Reaction to display per page. The value range is [1,50], and the default value is `50`.   |
| `cursor`  | String | No       | Query cursor that specifies where to start retrieving data during pagination.             |

For details about the parameters in the request URL, see [Request URL parameters](overview.html#request-url).

:::tip

During pagination, the server returns users in ascending order by the time they added the Reaction. If neither `limit` nor `cursor` is passed, the server returns the first 50 users who added the Reaction.

:::

## Request example

- Request the first page

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&limit=50'   \
-H 'Authorization: Bearer <YourAppToken>'
```

- Request page N

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/wz/detail?msgId=997627787730750008&message=emoji_40&cursor=944330529971449164&limit=50'   \
-H 'Authorization: Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

```json
{
  "requestStatusCode": "ok",
  "timestamp": 1645776986146,
  "data": {
    "reactionId": "946463470818405943",
    "reaction": "message123456",
    "count": 1,
    "state": true,
    "userList": ["wz1"],
    "cursor": "946463471296555192"
  }
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                | Type   | Description                                                                                                    |
| :------------------ | :----- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode` | String | Operation result. `ok` indicates that the Reaction information was retrieved successfully.                                                             |
| `timestamp`         | Long   | Request response time as a Unix timestamp in milliseconds.                                                               |
| `data`              | JSON   | Details of the Reaction added to the message.                                                                            |
| `data.reactionId`   | String | Reaction ID.                                                                                           |
| `data.reaction`     | String | Emoji ID, consistent with the client. This value is the same as the `message` request parameter of the [Add a Reaction API](reaction_add.html). |
| `data.count`        | Int    | Number of users who added the Reaction.                                                                            |
| `data.state`        | Bool   | Whether the current requesting user has added the Reaction. <br/> - `true`: Yes.<br/> - `false`: No.                           |
| `data.userList`     | Array  | List of user IDs returned in ascending order by the time they added the Reaction.                           |
| `data.cursor`       | String | Query cursor that specifies where to start the next query.                                                                      |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code        | Error type | Error message          | Possible cause           | Recommendation       |
| :----------- | :--- | :------------- |:---------------|:-----------|
| 400     | Bad Request    | Limit exceeds the maximum quantity limit    | The specified `limit` exceeds the per-request limit (50). | Specify a `limit` value in the range [1,50]. |

For other errors, see [Response status codes](error.html) for possible causes.
