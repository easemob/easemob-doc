# Delete Messages

## Feature overview

The SDK supports deleting server-side messages for the current user only:

- Clear server-side chat history for the current user: Clear the current user's server-side chat history, including messages and conversations in one-to-one chats, group chats, and chat rooms. After the operation succeeds, the SDK also clears locally cached conversation and message data and updates the local conversation list cache.
- Delete server-side historical messages for the current user: Delete historical messages stored for the current user on the server by message ID or timestamp. This operation does not automatically delete the local message cache on the current device. If your app has stored or displayed these messages locally, update the local message list after the API call succeeds.

After you clear server-side chat history or delete historical messages for the current user, you cannot retrieve the conversations or messages from the server. Other users are not affected.


## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and connect to the server. See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Clear chat history for the current user

Call `EMChatManager#asyncDeleteAllMsgsAndConversations` to clear all local conversations and their messages for the current user, including one-to-one, group chat, and chat room conversations. Use the `clearServerData` parameter to determine whether to also clear the current user's server-side conversations and messages:

- `true`: Clear all local conversations and messages and all server-side conversations and messages for the current user. After they are cleared, the current user cannot retrieve the data from the server. Other users are not affected.
- `false`: Clear only all local conversations and messages. Server-side data is retained.

After the operation succeeds, the SDK clears the conversation cache from memory. If the local conversation list changes, the SDK triggers `EMConversationListener#onConversationUpdate()`. Your app can reread the local conversation list and refresh the UI in this callback.

```java
// Asynchronous method.
 EMClient.getInstance().chatManager().asyncDeleteAllMsgsAndConversations(true, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }

    @Override
    public void onError(int code, String error) {
        
    }
    });
```

## Delete server-side historical messages for the current user

Call `removeMessagesFromServer` to delete historical messages stored for the current user on the server by message ID or timestamp. This operation affects only the current user. After deletion, the current user can no longer retrieve these messages from the server through message roaming. Other users in the same one-to-one chat, group chat, or chat room are not affected and can still retrieve the messages according to the roaming policy.

The following deletion methods are supported:

- Delete by message ID: Call `removeMessagesFromServer(List<String> msgIdList, EMCallBack callBack)`. You can delete up to 50 messages in each call.
- Delete by time: Call `removeMessagesFromServer(long beforeTimeStamp, EMCallBack callBack)` to delete historical messages whose server receipt time is earlier than the specified timestamp. The timestamp is in milliseconds.

With multi-device login, the current user's other online devices receive `EMMultiDeviceListener#onMessageRemoved` after deletion succeeds.

:::tip 
1. After `removeMessagesFromServer` succeeds, the SDK removes the corresponding messages from the current device's in-memory conversation cache. The primary purpose of this API is to delete historical messages stored for the current user on the server. Refresh the message list in the success callback to avoid continuing to display old data. 
2. Chat room message roaming is disabled by default. To enable it, contact the EasyIM business manager.
:::

Example code:

```java 
// Delete messages by time.
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);
if (conversation == null) {
    return;
}

conversation.removeMessagesFromServer(beforeTimeStamp, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String desc) {
    }
});

// Delete messages by message ID.
conversation.removeMessagesFromServer(msgIdList, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String desc) {
    }
});
```

## Delete all messages in a specified local conversation

You can delete all messages in a specified local conversation, as shown below:

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation != null) {
    conversation.clearAllMessages();
}
```

## Delete messages within a specified period from a local conversation

You can delete local messages within a specified period from a specified local conversation, as shown below:

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if(conversation != null) {
    conversation.removeMessages(startTime, endTime);
}
```

## Delete a specified message from a local conversation

Call `EMConversation#removeMessage` to delete a specified message from the local database and the conversation's in-memory cache. This operation does not delete the server-side message.

```java
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null && deleteMsg != null) {
    conversation.removeMessage(deleteMsg.getMsgId());
}
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`asyncDeleteAllMsgsAndConversations`](#clear-chat-history-for-the-current-user) | `EMChatManager` | Clear all local conversations and messages and, depending on the parameter, optionally clear server-side data for the current user. |
| [`getConversation`](#delete-server-side-historical-messages-for-the-current-user) | `EMChatManager` | Retrieve a local conversation object by conversation ID. |
| [`removeMessagesFromServer`](#delete-server-side-historical-messages-for-the-current-user) | `EMConversation` | Delete server-side historical messages for the current user by timestamp or message ID. |
| [`clearAllMessages`](#delete-all-messages-in-a-specified-local-conversation) | `EMConversation` | Delete all messages in a specified conversation from the local database and in-memory cache. |
| [`removeMessages`](#delete-messages-within-a-specified-period-from-a-local-conversation) | `EMConversation` | Delete local messages within a specified period. |
| [`removeMessage`](#delete-a-specified-message-from-a-local-conversation) | `EMConversation` | Delete a specified message from the local database and conversation cache. |


