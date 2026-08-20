# Search Messages

This document describes how the EasyIM Android SDK searches local messages by keyword, search scope, message type, sender, timestamp, and other conditions. The APIs in this document query only the local database on the current user's device and do not send search requests to the server. Because command messages are not stored in the local database, they cannot be searched through these APIs.

:::tip
To search server-side messages, contact the Easemob business team to enable the feature. See [Server-side Message Search](/value-added/search/message_search_android.html).
:::

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and [open the current user's local database](login.html#登录完成前使用本地数据库). See [Quickstart](quickstart.html). Local message search does not require the client to remain connected to the server.
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Implementation

### Search messages sent by a user in a conversation by keyword

Call `EMConversation#searchMsgFromDB(String, long, int, String, EMSearchDirection)` to search messages sent by a specified user in a specified conversation by keyword.

`timeStamp` is the search start timestamp. Set it to a negative value to start searching from the current time. The result does not include messages whose timestamp is the same as `timeStamp`.

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    // The value range of maxCount is 1–400. UP indicates a search in descending order by timestamp.
    List<EMMessage> messages = conversation.searchMsgFromDB(
            keywords,
            timeStamp,
            maxCount,
            senderId,
            EMConversation.EMSearchDirection.UP);
}
```

### Search messages in all conversations by search scope 

Call `EMChatManager#searchMsgFromDB(String, long, int, String, EMSearchDirection, EMMessageSearchScope)` to search messages in all local conversations by keyword, start timestamp, maximum result count, sender, and search direction.

Use `searchScope` to search only message content, only message extensions, or both.

```java
String keyword = "123";
List<EMMessage> messages = EMClient.getInstance()
        .chatManager()
        .searchMsgFromDB(
                keyword,
                -1,
                200,
                null,
                EMConversation.EMSearchDirection.UP,
                EMConversation.EMMessageSearchScope.ALL);

```

### Search messages in the current conversation by search scope 

Call `EMConversation#asyncSearchMsgFromDB` to asynchronously search messages in the current conversation by keyword, start timestamp, maximum result count, one or more senders, search direction, and search scope.

```java
String keyword = "123";
String conversationId = "jack";
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    List<String> senders = Arrays.asList("user1", "user2");
    // `senders` can contain up to 10 user IDs. Pass `null` or an empty list to place no restriction on the sender. 
    conversation.asyncSearchMsgFromDB(
            keyword,
            -1,
            200,
            senders,
            EMConversation.EMSearchDirection.UP,
            EMConversation.EMMessageSearchScope.ALL,
            new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> messages) {
                    // messages contains the matching local messages in the current conversation.
                }

                @Override
                public void onError(
                        int errorCode,
                        String errorMessage) {
                }
            });
}

```

### Search messages in all conversations by message type

Call `EMChatManager#searchMsgFromDB(Set<EMMessage.Type>, long, int, String, EMSearchDirection)` to search messages in all local conversations by one or more message types, start timestamp, maximum result count, sender, and search direction.

```java
// count: The number of messages to query. The value range is [1,400].
// fromuser: The sender's user ID in the conversation. Pass an empty string to place no restriction on the sender.
Set<EMMessage.Type> types = new HashSet<>();
types.add(EMMessage.Type.TXT);
types.add(EMMessage.Type.VOICE);
List<EMMessage> messages = EMClient.getInstance()
        .chatManager()
        .searchMsgFromDB(
                types,
                -1,
                400,
                "xu",
                EMConversation.EMSearchDirection.UP);
for (EMMessage message : messages) {
    if (message.getBody() instanceof EMTextMessageBody) {
        EMTextMessageBody body = (EMTextMessageBody) message.getBody();
        EMLog.e(TAG, "message: " + body.getMessage() + ",time: " + message.getMsgTime());
    } else {
        EMLog.e(TAG, "message: " + message.getBody() + ",time: " + message.getMsgTime());
    }
}
``` 

### Search messages in the current conversation by message type

Call `EMConversation#searchMsgFromDB(Set<EMMessage.Type>, long, int, String, EMSearchDirection)` to search messages in a specified conversation by one or more message types, start timestamp, maximum result count, sender, and search direction.

```java
// count: The number of messages to query. The value range is [1,400].
// fromuser: The sender's user ID in the current conversation. Pass an empty string to place no restriction on the sender.
Set<EMMessage.Type> types = new HashSet<>();
types.add(EMMessage.Type.TXT);
types.add(EMMessage.Type.VOICE);
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation("xu");

if (conversation != null) {
    List<EMMessage> messages = conversation.searchMsgFromDB(
            types,
            -1,
            400,
            "xu",
            EMConversation.EMSearchDirection.UP);

    for (EMMessage message : messages) {
        if (message.getBody() instanceof EMTextMessageBody) {
            EMTextMessageBody body =
                    (EMTextMessageBody) message.getBody();
            EMLog.e(TAG, "message: " + body.getMessage()
                    + ",time: " + message.getMsgTime());
        } else {
            EMLog.e(TAG, "message: " + message.getBody()
                    + ",time: " + message.getMsgTime());
        }
    }
}
```   

## Keyword search rules

When the following message search APIs search different message types, the `keywords` parameter corresponds to different content.

- [Search messages sent by a specified user in a single conversation in the local database by keyword](#search-messages-sent-by-a-user-in-a-conversation-by-keyword).
- [Search messages in all conversations by keyword and search scope](#search-messages-in-all-conversations-by-search-scope).
- [Search messages in the current conversation by keyword and search scope](#search-messages-in-the-current-conversation-by-search-scope).

### Search message content only

| Message type | Message content matched by the keyword | Keyword search content example |
| :-------------- | :----- |:----- |
| Text message  |  `EMTextMessageBody#getMessage`   | The actual text message content, “Hello world”.|
| Image message  | `EMImageMessageBody#getFileName`       | The image file name, “photo.jpg”.|
| Voice message  | `EMVoiceMessageBody#getFileName`       | The voice file name, “audio.amr”.|
| Video message  | `EMVideoMessageBody#getFileName`       | The video file name, “video.mp4”.|
| File message  |  `EMFileMessageBody#getFileName`  | The file name, “report.pdf”.|
| Location message  | `EMLocationMessageBody#getAddress` and `EMLocationMessageBody#getBuildingName` | The address or building name, such as “Chaoyang District, Beijing” or “China World Trade Center”.|
| Custom message |   `EMCustomMessageBody#event`     | The custom event name, “gift”.|
| Combined message  | `EMCombineMessageBody#getTitle` and `EMCombineMessageBody#getSummary` | The title or summary, such as “Chat history” or “Contains 5 messages”.|

### Search extensions only

When searching only the JSON string of message extensions (`ext`), the `keywords` field matches custom extensions added by the user, for example:

```json
{"key1":"value1", "key2":"value2"}
```

### Search all content

Search both message content and extensions. A message is returned if either matches.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getConversation`](#search-messages-sent-by-a-user-in-a-conversation-by-keyword) | `EMChatManager` | Retrieve a local conversation with a specified ID. Returns `null` if it is not found. |
| [`searchMsgFromDB`](#search-messages-sent-by-a-user-in-a-conversation-by-keyword) | `EMConversation` | Search local messages sent by a specified user in a specified conversation by keyword. |
| [`searchMsgFromDB`](#search-messages-in-all-conversations-by-search-scope) | `EMChatManager` | Search messages in all local conversations by keyword and search scope. |
| [`asyncSearchMsgFromDB`](#search-messages-in-the-current-conversation-by-search-scope) | `EMConversation` | Asynchronously search messages in a specified conversation by keyword, sender list, and search scope. |
| [`searchMsgFromDB`](#search-messages-in-all-conversations-by-message-type) | `EMChatManager` | Search messages in all local conversations by one or more message types. |
| [`searchMsgFromDB`](#search-messages-in-the-current-conversation-by-message-type) | `EMConversation` | Search messages in a specified conversation by one or more message types. |

