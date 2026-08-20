# Manage Messages in Message Threads

## Feature overview

Messages in a message thread are group message types. They differ from regular chat group messages in that they require the `isChatThreadMessage` flag. Before using messages in message threads, contact the Easemob business team to activate the feature.

This page describes how the EasyIM Android SDK sends, receives, and recalls messages in message threads.

## Message sending and receiving process

Messages are sent and received as follows:

Client A sends a message to client B. The message is sent to the EasyIM server, which delivers it to client B. For a message in a message thread, the server delivers it to every other member of the message thread. After client B receives the message, the SDK triggers an event. Client B monitors the event and obtains the message.

The following figure shows how a message thread is created and viewed:

![img](/images/android/threads.png)

## Feature activation

Before using message threads, contact the Easemob business team to activate the feature.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM [limitations](/product/limitation.html).
- Contact the Easemob business team to activate message threads.

## Send messages in a message thread

Sending a message in a message thread is essentially the same as sending a chat group message. For details, see [Send Messages](message_send.html). The only difference is that a message in a message thread requires `isChatThreadMessage` to be set to `true`.

The following is sample code:

```java
// Create a text message. `content` is the message text, and `chatThreadId` is the message thread ID.
EMMessage message = EMMessage.createTextSendMessage(content, chatThreadId); 
// Set the message type. For a message in a message thread, set `ChatType` to `GroupChat`.
message.setChatType(ChatType.GroupChat); 
// Set the `isChatThreadMessage` message flag to `true`.
message.setIsChatThreadMessage(true);
// Set an `EMCallBack` instance when sending the message to obtain its sending state. Update the message display state in this callback, such as displaying a notification after sending fails.
message.setMessageStatusCallback(new EMCallBack() {
     @Override
     public void onSuccess() {
     }

     @Override
     public void onError(int code, String error) {
     }

     @Override
     public void onProgress(int progress, String status) {
     }
});
// Send the message.
EMClient.getInstance().chatManager().sendMessage(message);
```

## Receive messages in a message thread

For the detailed message-receiving logic, see [Receive Messages](message_receive.html). This section describes only the differences between messages in a message thread and other messages.

When a message is added to a message thread, all members of the chat group to which the message thread belongs receive the `EMChatThreadChangeListener#onChatThreadUpdated` callback, and message thread members receive the `EMMessageListener#onMessageReceived` callback.

The following is sample code:

```java
EMMessageListener msgListener = new EMMessageListener() {
   // A message is received. Iterate through the message queue to parse and display messages.
   @Override
   public void onMessageReceived(List<EMMessage> messages) {
       for (EMMessage message : messages) {
           if(message.isChatThreadMessage()) {
               // A message in a message thread is received. Add the processing logic.
           }
       }
   }
   ...// Other callbacks are omitted here.
};
// Add the message listener.
EMClient.getInstance().chatManager().addMessageListener(msgListener);
// Remove the message listener.
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```

## Recall messages in a message thread

For the detailed message-recall logic, see [Recall Messages](message_recall.html). This section describes only the differences between messages in a message thread and other messages.

When a message in a message thread is recalled, all members of the chat group to which the message thread belongs receive the `EMChatThreadChangeListener#onChatThreadUpdated` callback, and message thread members receive the `EMMessageListener#onMessageRecalledWithExt` callback.

The following is sample code:

```java
EMMessageListener msgListener = new EMMessageListener() {
   // A recalled-message callback is received. Iterate through the message queue to parse and display messages.
   @Override
   public void onMessageRecalledWithExt(List<EMRecallMessageInfo> recallInfoList) {
       for (EMRecallMessageInfo recallInfo : recallInfoList) {
           EMMessage message = recallInfo.getRecallMessage();
           if(message != null && message.isChatThreadMessage()) {
               // A message in a message thread was recalled. Add the processing logic.
           }
       }
   }
   ...// Other callbacks are omitted here.
};
```

## Retrieve messages in a message thread

Whether to retrieve messages in a message thread from the server or the local database depends on your production environment.

Use `EMConversation#isChatThread()` to determine whether the current conversation is a message thread conversation.

### Retrieve messages in a message thread from the server (message roaming)

Call `asyncFetchHistoryMessages` to retrieve messages in a message thread from the server. The only difference from retrieving chat group messages is that you pass a message thread ID for the former and a chat group ID for the latter.

```java
String chatThreadId = "{your chatThreadId}";
EMConversation.EMConversationType type = EMConversation.EMConversationType.GroupChat;
int pageSize = 10;
String startMsgId = "";// ID of the message from which to start the query. If "" is passed, the SDK ignores this parameter and queries messages in the search direction.

EMFetchMessageOption option = new EMFetchMessageOption();
option.setDirection(EMConversation.EMSearchDirection.DOWN);

EMClient.getInstance().chatManager().asyncFetchHistoryMessages(chatThreadId, type,
        pageSize, startMsgId, option, new EMValueCallBack<EMCursorResult<EMMessage>>() {
    @Override
    public void onSuccess(EMCursorResult<EMMessage> value) {

    }

    @Override
    public void onError(int error, String errorMsg) {

    }
});
```

### Retrieve messages in a message thread locally

`EMChatManager#getAllConversations` retrieves only one-to-one or group conversations. Call the following methods to retrieve messages in a message thread locally:

```java
// Set the conversation type to `EMConversationType.GroupChat` and `isChatThread` to `true`.
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(chatThreadId, EMConversationType.GroupChat, createIfNotExists, isChatThread);
// Retrieve all messages in memory for this conversation.
List<EMMessage> messages = conversation.getAllMessages();
// To process messages in the local database, retrieve them from the database with the following method. The SDK automatically stores these messages in the conversation.
List<EMMessage> messages = conversation.loadMoreMsgFromDB(startMsgId, pagesize, searchDirection);
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextSendMessage`](#send-messages-in-a-message-thread) | `EMMessage` | Creates a text message. |
| [`sendMessage`](#send-messages-in-a-message-thread) | `EMChatManager` | Sends a message in a message thread. |
| [`asyncFetchHistoryMessages`](#retrieve-messages-in-a-message-thread-from-the-server-message-roaming) | `EMChatManager` | Retrieves historical messages in a message thread from the server by page. |
| [`getConversation`](#retrieve-messages-in-a-message-thread-locally) | `EMChatManager` | Retrieves a local message thread conversation. |
| [`getAllMessages`](#retrieve-messages-in-a-message-thread-locally) | `EMConversation` | Retrieves messages in the conversation that have been loaded into memory. |
| [`loadMoreMsgFromDB`](#retrieve-messages-in-a-message-thread-locally) | `EMConversation` | Loads more messages from the local database. |
