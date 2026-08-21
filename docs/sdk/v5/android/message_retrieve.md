# Retrieve Historical Messages

## Feature overview

EasyIM provides message roaming, which stores historical messages from all of a user's conversations on the message server. Users can retrieve historical messages on any device and maintain a consistent conversation experience when switching between devices.

The SDK uses SQLite internally to store local messages, which you can retrieve.

This document describes how the EasyIM SDK retrieves historical messages from the server.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Implementation

### Retrieve messages in a specified conversation from the server

Call `asyncFetchHistoryMessages` with the `EMFetchMessageOption` class to retrieve historical messages in one-to-one and group chats from the server by page. For reliability, we recommend retrieving 20 messages per page and no more than 50. If the total number of matching messages is greater than `pageSize`, a paginated query returns `pageSize` messages. If it is less than `pageSize`, the actual number is returned. When all messages have been retrieved, the number returned is less than `pageSize`.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | Conversation ID. Pass the peer user ID for one-to-one chat or the group ID for group chat. |
| `type` | `EMConversation.EMConversationType` | Conversation type. Pass `Chat` for one-to-one chat or `GroupChat` for group chat. |
| `pageSize` | `int` | The number of messages to retrieve per page. The recommended value is 20, and the maximum is 50. |
| `cursor` | `String` | Pagination cursor. Pass an empty string for the first retrieval and the cursor returned by `EMCursorResult#getCursor()` in the previous callback for subsequent retrievals. |
| `option` | `EMFetchMessageOption` | Retrieval options. You can set the following conditions:<br/> - Message sender;<br/> - Message type;<br/> - Message time range;<br/> - Message search direction;<br/> - Whether to save retrieved messages to the database;<br/> - For a group chat, set the `from` parameter to retrieve historical messages sent by a single group member. |
| `callBack` | `EMValueCallBack<EMCursorResult<EMMessage>>` | Result callback. On success, obtain the message list and next-page cursor through `EMCursorResult`. |

If `EMOptions#setRegardImportedMsgAsRead` was enabled during initialization, messages imported [through a server-side API](/document/server-side/message_import_single.html) and retrieved through this API are marked as read, and the conversation unread message count returned by `EMConversation#getUnreadMsgCount` does not change. If this setting is disabled, the value returned by `EMConversation#getUnreadMsgCount` increases.

:::tip
1. **By default, you can retrieve historical messages from one-to-one and group chats. To retrieve chat room historical messages, contact the EasyIM business manager.**
2. When retrieving one-to-one historical messages, the SDK can read the delivery and read states stored on the server. This feature is disabled by default. To enable it, contact the EasyIM business manager. 
3. The server-side retention period for historical messages depends on the product plan. See [EasyIM Plan Features](/product/product_package_feature.html).
:::

```java
String conversationId = " ";
EMConversation.EMConversationType type = EMConversation.EMConversationType.Chat;
EMFetchMessageOption option = new EMFetchMessageOption();
// For example, save the retrieved messages to the database.
//option.setIsSave(true);
// For example, retrieve messages in chronological order.
//option.setDirection(EMConversation.EMSearchDirection.DOWN);
int pageSize = 40;
String cursor = "";
List<EMMessage> messages = new ArrayList<>();
doAsyncFetchHistoryMessages(conversationId, type, pageSize, cursor, option, messages);

private void doAsyncFetchHistoryMessages(String conversationId,
        EMConversation.EMConversationType type,
int pageSize,String cursor,
        EMFetchMessageOption option,
        List<EMMessage> messages){
    EMClient.getInstance().chatManager().asyncFetchHistoryMessages(conversationId, type, pageSize, 
                                cursor, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
        @Override
        public void onSuccess(EMCursorResult<EMMessage> value) {
            if (value != null ) {
                List<EMMessage> list = value.getData();
                if (list != null && list.size() > 0) {
                    messages.addAll(list);
                }
                // An empty newCursor is returned when the last page is retrieved.
                String newCursor = value.getCursor();
                if( !TextUtils.isEmpty(newCursor)) {
                    doAsyncFetchHistoryMessages(conversationId, type, pageSize, newCursor, option, messages);
                }
            }
        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    });
}
```


### Retrieve messages sent by specified group members from the server

For a single group conversation, you can retrieve messages sent by specified members, instead of all members, from the server.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | Chat group ID. |
| `type` | `EMConversation.EMConversationType` | Conversation type. Pass `GroupChat` when retrieving group messages. |
| `pageSize` | `int` | The number of messages to retrieve per page. The recommended value is 20, and the maximum is 50. |
| `cursor` | `String` | Pagination cursor. Pass an empty string for the first retrieval and the cursor returned by the previous callback for subsequent retrievals. |
| `option` | `EMFetchMessageOption` | Retrieval options. Call `setFromIds(List<String>)` to set the group member IDs to query. You can set up to 10 IDs. |
| `callBack` | `EMValueCallBack<EMCursorResult<EMMessage>>` | Result callback. |

```java
String conversationId = " ";
EMConversation.EMConversationType type = EMConversation.EMConversationType.Chat;
EMFetchMessageOption option = new EMFetchMessageOption();
// For example, save the retrieved messages to the database.
//option.setIsSave(true);
// For example, retrieve messages in chronological order.
//option.setDirection(EMConversation.EMSearchDirection.DOWN);
// For example, retrieve messages sent by 2 users in the group.
//List<String> fromIds = new ArrayList<String>();
//fromIds.add("user1");
//fromIds.add("user2");
//option.setFromIds(fromIds);
int pageSize = 40;
String cursor = "";
List<EMMessage> messages = new ArrayList<>();
doAsyncFetchHistoryMessages(conversationId, type, pageSize, cursor, option, messages);

private void doAsyncFetchHistoryMessages(String conversationId,
        EMConversation.EMConversationType type,
int pageSize,String cursor,
        EMFetchMessageOption option,
        List<EMMessage> messages){
    EMClient.getInstance().chatManager().asyncFetchHistoryMessages(conversationId, type, pageSize, 
                                cursor, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
        @Override
        public void onSuccess(EMCursorResult<EMMessage> value) {
            if (value != null ) {
                List<EMMessage> list = value.getData();
                if (list != null && list.size() > 0) {
                    messages.addAll(list);
                }
                String newCursor = value.getCursor();
                if( !TextUtils.isEmpty(newCursor)) {
                    doAsyncFetchHistoryMessages(conversationId, type, pageSize, newCursor, option, messages);
                }
            }
        }

        @Override
        public void onError(int error, String errorMsg) {

        }
    });
}

```

### Retrieve messages in a local conversation by keyword

Set a keyword to retrieve specified messages in conversations from the local database. The SDK returns a mapping between conversation IDs and message ID lists. Message IDs are listed in chronological or reverse chronological order by message timestamp based on the `direction` parameter.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `keyword` | `String` | The keyword to search. |
| `timestamp` | `long` | The search start timestamp in milliseconds. Pass a negative value to start searching from the current time. |
| `sender` | `String` | The sender's user ID. Pass `null` to apply no sender filter. |
| `direction` | `EMConversation.EMSearchDirection` | Search direction: `UP` searches in reverse chronological order by message timestamp, and `DOWN` searches in chronological order. |
| `scope` | `EMConversation.EMMessageSearchScope` | Search scope. For example, `CONTENT` searches message content. |
| `callBack` | `EMValueCallBack<Map<String, List<String>>>` | Search result callback. On success, a mapping between conversation IDs and message ID lists is returned. |

```java
String keyword="时间";
EMClient.getInstance().chatManager().asyncLoadConversationMessagesWithKeyword(keyword, -1, null, EMConversation.EMSearchDirection.UP, EMConversation.EMMessageSearchScope.CONTENT, new EMValueCallBack<Map<String, List<String>>>() {
    @Override
    public void onSuccess(Map<String, List<String>> value) {
        EMLog.e(TAG, "asyncLoadConversationMessagesWithKeyword onSuccess value:" + value);
    }

    @Override
    public void onError(int error, String errorMsg) {
        EMLog.e(TAG,"asyncLoadConversationMessagesWithKeyword onError error:" + error + " errorMsg:" + errorMsg);
    }
});

```

### Retrieve local messages by message ID

Pass one or more message IDs to retrieve messages in a local conversation.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `messageIds` | `List<String>` | A list of the message IDs to query. You can pass up to 20 message IDs in each call. |
| `conversationId` | `String` | The ID of the conversation containing the messages. |
| `callback` | `EMValueCallBack<List<EMMessage>>` | Query result callback. On success, the list of local messages found is returned. |

```java
// messageIds: A list of message IDs. You can pass up to 20 message IDs in each call.
EMClient.getInstance().chatManager().asyncLoadMessages(messageIds, conversationId, new EMValueCallBack<List<EMMessage>>() {
        @Override
        public void onSuccess(List<EMMessage> value) {
            EMLog.e(TAG, "asyncLoadMessages onSuccess value:" + value);
        }

        @Override
        public void onError(int error, String errorMsg) {
            EMLog.e(TAG, "asyncLoadMessages onError error:" + error + " errorMsg:" + errorMsg);
        }
    });
```

### Retrieve messages sent by specified group members locally

For a single group conversation, you can retrieve locally stored messages sent by specified members instead of all members.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `keywords` | `String` | The keyword to search. |
| `timeStamp` | `long` | The search start timestamp in milliseconds. Pass a negative value to start searching from the current time. |
| `maxCount` | `int` | The maximum number of messages returned in each call. The value range is `[1,400]`. |
| `senders` | `List<String>` | The sender user IDs to filter by. You can specify up to 10. Pass `null` or an empty list to apply no sender filter. |
| `direction` | `EMConversation.EMSearchDirection` | Search direction: `UP` searches in reverse chronological order by message timestamp, and `DOWN` searches in chronological order. |
| `searchScope` | `EMConversation.EMMessageSearchScope` | Search scope. For example, `CONTENT` searches message content. |
| `callback` | `EMValueCallBack<List<EMMessage>>` | Search result callback. |

```java
String conversationId = "user_or_group_id";
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);
if (conversation != null) {
    String keywords = "hello";
    long timeStamp = -1; // A value less than 0 starts the search from the current time.
    int maxCount = 20;
    // Restrict the senders to a maximum of 10. Pass null or an empty list to apply no sender restriction.
    List<String> senders = Arrays.asList("user1", "user2");
    conversation.asyncSearchMsgFromDB(
            keywords,
            timeStamp,
            maxCount,
            senders,
            EMConversation.EMSearchDirection.UP,
            EMConversation.EMMessageSearchScope.CONTENT,
            new EMValueCallBack<List<EMMessage>>() {
                @Override
                public void onSuccess(List<EMMessage> messages) {
                    for (EMMessage message : messages) {
                        String msgId = message.getMsgId();
                        String from = message.getFrom();
                        long msgTime = message.getMsgTime();
                        // TODO: Process the search results.
                    }
                }
                @Override
                public void onError(int code, String error) {
                    // TODO: Handle the error.
                }
            }
    );
}
```

### Read messages in a specified conversation locally

Call `getAllMessages` to retrieve all messages in a specified conversation from memory. If memory is empty, the SDK loads the latest message from the local database.

You can also call `loadMoreMsgFromDB` to load messages from the local database by page. The loaded messages are placed in the current conversation's memory based on their timestamps.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `username` | `String` | Conversation ID. Pass the peer user ID for one-to-one chat, the group ID for group chat, or the chat room ID for a chat room. |
| `startMsgId` | `String` | The start message ID for pagination. Pass `null` or an empty string to start loading from the latest message. |
| `pageSize` | `int` | The number of messages loaded per page. The value range is `[1,400]`. |

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(username);
List<EMMessage> messages = conversation.getAllMessages();
// startMsgId: The start message ID for the query. The SDK loads messages in reverse chronological order by timestamp starting from this message ID. If the passed message ID is empty, the SDK retrieves messages in reverse chronological order from the latest message.
// pageSize: The expected number of messages loaded per page. The value range is [1,400].
List<EMMessage> pagedMessages = conversation.loadMoreMsgFromDB(startMsgId, pagesize);
```

### Retrieve a local message by message ID

Call `getMessage` to retrieve a specified locally stored message by message ID. If the message does not exist, an empty value is returned.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `msgId` | `String` | The message ID to retrieve. |

```java
// msgId: The ID of the message to retrieve.
EMMessage msg = EMClient.getInstance().chatManager().getMessage(msgId);
```

### Retrieve messages of a specified type in a local conversation

Call `searchMsgFromDB(Type type, long timeStamp, int maxCount, String from, EMConversation.EMSearchDirection direction)` to retrieve messages of a specified type in a specified conversation from local storage.

You can retrieve up to 400 messages in each call. If no messages are found, the SDK returns an empty list.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | The conversation ID to search. |
| `type` | `EMMessage.Type` | The message type to search, such as `TXT`. |
| `timeStamp` | `long` | The search start timestamp in milliseconds. Pass a negative value to start searching from the current time. |
| `maxCount` | `int` | The number of messages retrieved in each call. The value range is `[1,400]`. |
| `from` | `String` | The sender's user ID. Pass `null` to apply no sender filter. |
| `direction` | `EMConversation.EMSearchDirection` | Search direction: `UP` searches in reverse chronological order by message timestamp, and `DOWN` searches in chronological order. |

```java
//conversationId: Conversation ID.
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// Type: Message type. timeStamp: The message search start timestamp in milliseconds. After this parameter is set, the SDK searches messages from the specified timestamp in the search direction. If it is negative, the SDK searches from the current time in reverse chronological order by message timestamp.
// maxCount: The number of messages retrieved in each call. The value range is [1,400]. direction: Message search direction: `UP` (default) searches in reverse chronological order by message timestamp, and `DOWN` searches in chronological order.
List<EMMessage> emMessages = conversation.searchMsgFromDB(EMMessage.Type.TXT, System.currentTimeMillis(), maxCount, from, EMConversation.EMSearchDirection.UP);
```

### Retrieve messages in a local conversation within a specified period

Call `searchMsgFromDB(long startTimeStamp, long endTimeStamp, int maxCount)` to search local storage for messages sent and received in a specified conversation within a specified period.

You can retrieve up to 400 messages in each call.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | The conversation ID to search. |
| `startTimeStamp` | `long` | The search start timestamp in milliseconds. |
| `endTimeStamp` | `long` | The search end timestamp in milliseconds. |
| `maxCount` | `int` | The number of messages retrieved in each call. The value range is `[1,400]`. |

```java
//conversationId: Conversation ID.
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
// startTimeStamp: The search start timestamp. endTimeStamp: The search end timestamp. maxCount: The number of messages retrieved in each call. The value range is [1,400].
List<EMMessage> messageList = conversation.searchMsgFromDB(startTimeStamp,endTimeStamp, maxCount);
```

### Retrieve the message count in a conversation within a specified period

Call `getAllMsgCount` to retrieve from the SDK's local database the total number of messages in a conversation within a specified period.

The parameters are described below:

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `conversationId` | `String` | The conversation ID for which to count messages. |
| `startTimestamp` | `long` | The count start timestamp in milliseconds. |
| `endTimestamp` | `long` | The count end timestamp in milliseconds. |

```java
String conversationId = "pu";
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation!=null) {
    long startTimestamp = System.currentTimeMillis() - 24 * 60 * 60 * 1000;
    int count = conversation.getAllMsgCount(startTimestamp, System.currentTimeMillis());
    EMLog.i(TAG, "queryMsgCountWithDuration count:" + count);
}
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncFetchHistoryMessages`](#retrieve-messages-in-a-specified-conversation-from-the-server) | `EMChatManager` | Retrieve historical messages in a specified conversation from the server by page. |
| [`setDirection`](#retrieve-messages-in-a-specified-conversation-from-the-server) | `EMFetchMessageOption` | Set the server-side historical message query direction. |
| [`setIsSave`](#retrieve-messages-in-a-specified-conversation-from-the-server) | `EMFetchMessageOption` | Set whether to save retrieved historical messages to the local database. |
| [`setFromIds`](#retrieve-messages-sent-by-specified-group-members-from-the-server) | `EMFetchMessageOption` | Set the specified senders for group chat historical messages. |
| [`asyncLoadConversationMessagesWithKeyword`](#retrieve-messages-in-a-local-conversation-by-keyword) | `EMChatManager` | Search messages in the local database by keyword. |
| [`asyncLoadMessages`](#retrieve-local-messages-by-message-id) | `EMChatManager` | Retrieve local messages by message ID. |
| [`asyncSearchMsgFromDB`](#retrieve-messages-sent-by-specified-group-members-locally) | `EMConversation` | Search a local conversation by keyword and sender. |
| [`getAllMessages`](#read-messages-in-a-specified-conversation-locally) | `EMConversation` | Retrieve all messages in conversation memory. |
| [`loadMoreMsgFromDB`](#read-messages-in-a-specified-conversation-locally) | `EMConversation` | Load conversation messages from the local database by page. |
| [`getMessage`](#retrieve-a-local-message-by-message-id) | `EMChatManager` | Retrieve a local message by message ID. |
| [`searchMsgFromDB`](#retrieve-messages-of-a-specified-type-in-a-local-conversation) | `EMConversation` | Search local messages by message type, time, and sender. |
| [`searchMsgFromDB`](#retrieve-messages-in-a-local-conversation-within-a-specified-period) | `EMConversation` | Search local conversation messages by time range. |
| [`getAllMsgCount`](#retrieve-the-message-count-in-a-conversation-within-a-specified-period) | `EMConversation` | Count local messages within a specified time range. |
