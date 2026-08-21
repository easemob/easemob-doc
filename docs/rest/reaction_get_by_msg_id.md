# Retrieve Reactions by Message ID

A Reaction is an emoji response to an individual message in a one-to-one or group chat, enriching user interactions during chats. Currently, **Reaction applies only to one-to-one chats and chat groups. Chat rooms do not support Reaction.**

## Feature overview

- This method retrieves Reaction information for one or more messages by message ID in a one-to-one or group chat. The information includes the Reaction ID, the emoji ID used, the IDs of users who used the Reaction, and the number of those users.
- The retrieved Reaction user list displays only the first three users who added the Reaction.
- For detailed Reaction usage limits, see [Product usage limits](limitation.html).

## Feature activation

To use Reaction, activate it in the [EasyIM Console](https://console.easyim.ai/user/login). For details, see the [EasyIM Console documentation](/product/console/basic_message.html#message-reactions).

## Call frequency limit

100 calls/second/App Key

## Request URL

```http
GET https://{host}/{org_name}/{app_name}/reaction/user/{userId}?msgIdList={N,M}&msgType={msgType}&groupId={groupId}
```

| Parameter        | Type   | Required | Description                                                                                 |
| :---------- | :----- | :------- | :----------------------------------------------------------------------------------- |
| `userId` | String | Yes       | User ID of the current user. |
| `msgIdList` | Array  | Yes       | List of message IDs to query. You can pass a maximum of 20 message IDs.                                      |
| `msgType`   | String | Yes       | Message conversation type:<br/> - `chat`: One-to-one chat.<br/> - `groupchat`: Group chat.                    |
| `groupId`   | String | No       | Chat group ID. If `msgType` is set to `groupchat` to retrieve Reactions in a chat group, you must specify the chat group ID. |

For details about other parameters in the request URL, see [Request URL parameters](overview.html#request-url).

## Request example

- Retrieve Reactions for one message:

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/XXXX?msgIdList=msgId1&msgType=chat'    \
-H 'Authorization: Bearer <YourAppToken>'
```

- Retrieve Reactions for multiple messages:

```shell
curl -g -X GET 'https://XXXX/XXXX/XXXX/reaction/user/XXXX?msgIdList=msgId1,msgId2&msgType=chat'    \
-H 'Authorization: Bearer <YourAppToken>'
```

## Request header fields

For a description of the `Authorization` field, see [Request header fields](overview.html#request-header-fields).

## Response example

The following example retrieves Reaction information for two messages:

```json
{
    "requestStatusCode": "ok",
    "timestamp": 1645774821181,
    "data": [
        {
            "msgId": "msg123",
            "reactionList": [
                {
                    "reactionId": "944330310986837168",
                    "reaction": "message123456",
                    "count": 3,
                    "state": false,
                    "userList": [
                        "test123",
                        "test456",
                        "test1"
                    ]
                }
            ]
        },
        {
            "msgId": "msg1234",
            "reactionList": [
                {
                    "reactionId": "945272584050659838",
                    "reaction": "message123456",
                    "count": 1,
                    "state": false,
                    "userList": [
                        "test5"
                    ]
                }
            ]
        }
    ]
}
```

## Response body fields

If the returned HTTP status code is `200`, the request is successful. The response body contains the following fields:

| Parameter                           | Type       | Description                                                                                                    |
| :----------------------------- | :--------- | :------------------------------------------------------------------------------------------------------ |
| `requestStatusCode`            | String     | API response code status. `OK` indicates success.                                                                 |
| `timestamp`                    | Long       | Request response time as a Unix timestamp in milliseconds.                                                               |
| `data`                         | JSON Array | Details of the Reactions added to an individual message.                                                                        |
| `data.msgId`                   | String     | ID of the message corresponding to the Reaction.                                                                                |
| `data.reactionList`            | JSON Array | Reaction list for an individual message.                                                                              |
| `data.reactionList.reactionId` | String     | Reaction ID.                                                                                           |
| `data.reactionList.reaction`   | String     | Emoji ID, consistent with the client. This value is the same as the `message` request parameter of the [Add a Reaction API](reaction_add.html). |
| `data.reactionList.count`      | Int        | Number of users who added the Reaction.                                                                            |
| `data.reactionList.state`      | Bool       | Whether the current requesting user has added the Reaction: <br/> - `true`: Yes. <br/> - `false`: No.                          |
| `data.reactionList.userList`   | Array      | List of user IDs that added the Reaction. Only the IDs of the first three users who operated on the Reaction are returned.                                 |

## Error code

If the returned HTTP status code is not `200`, the request fails and one of the following error codes may be returned:

| HTTP status code | Error type | Error message          | Possible cause            | Recommendation        |
|:---------| :--- | :------------- |:-----------------------------------|:------------|
| 400      | Bad Request          | msgIdList exceeds the maximum number limit   | The number of message IDs passed at one time exceeds the limit.  | Reduce the number of message IDs passed at one time. You can pass a maximum of 20 message IDs. |
| 400      | Bad Request          | groupId can not be null!        | For a group chat, where `msgType` is `groupchat`, the chat group ID parameter (`groupId`) is set to `null`. | Pass the chat group ID. |

For other errors, see [Response status codes](error.html) for possible causes.
