# Manage Message Threads

## Feature overview

A message thread is a subset of chat group members and supports multi-user communication. Before using message threads, contact the Easemob business team to activate the feature.

This page describes how to use the EasyIM Android SDK to create and manage message threads in a real-time interactive app and implement message thread features. For message-related content, see [Manage Messages in Message Threads](thread_message.html).

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- Understand the limits on message threads and their members. For details, see [Feature Limitations](/product/limitation.html).
- Contact the Easemob business team to activate message threads.

## Create a message thread

All chat group members can call `createChatThread` to create a message thread based on a chat group message.

With single-device login, all members of the chat group to which the message thread belongs receive the `EMChatThreadChangeListener#onChatThreadCreated` callback. With multi-device login, other devices also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_CREATE` event.

The following is sample code:

```java
// parentId: Chat group ID
// messageId: ID of the message on which the message thread is created
// threadName: Message thread name, with a maximum length of 64 characters
EMClient.getInstance().chatThreadManager().createChatThread(parentId, messageId, threadName, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) {
        
    }
    @Override
    public void onError(int error, String errorMsg) {
        
    }
});
```

## Destroy a message thread

Only the owner and admins of the chat group containing the message thread can call `destroyChatThread` to destroy it.

With single-device login, all members of the chat group to which the message thread belongs receive the `EMChatThreadChangeListener#onChatThreadDestroyed` callback. With multi-device login, other devices also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_DESTROY` event.

:::tip
After a message thread or the chat group containing it is destroyed, all data about the message thread is deleted from the local database and memory. Proceed with caution.
:::

The following is sample code:

```java
EMClient.getInstance().chatThreadManager().destroyChatThread(chatThreadId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }
    @Override
    public void onError(int code, String error) {
    }
});
```

## Join a message thread

All members of the chat group containing a message thread can call `joinChatThread` to join it.

Join a message thread as follows:

1. Obtain the ID of the message thread to join from an `EMChatThreadChangeListener#onChatThreadCreated` or `EMChatThreadChangeListener#onChatThreadUpdated` callback, or call `getChatThreadsFromServer` to retrieve the message thread list for a specified chat group from the server.
2. Call `joinChatThread` and pass the message thread ID to join the corresponding message thread.  

With multi-device login, other devices also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_JOIN` event.

The following is sample code:

```java
EMClient.getInstance().chatThreadManager().joinChatThread(chatThreadId, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) {
        
    }
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Leave a message thread

### Leave voluntarily

Message thread members can call `leaveChatThread` to leave voluntarily. After leaving, the member no longer receives messages in the message thread.

With multi-device login, other devices also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_LEAVE` event.

The following is sample code:

```java
EMClient.getInstance().chatThreadManager().leaveChatThread(chatThreadId, new EMCallBack() {
    @Override
    public void onSuccess() {
        
    }
    @Override
    public void onError(int code, String error) {
    }
});
```

### Be removed from a message thread

Only a chat group owner or admin can call `removeMemberFromChatThread` to remove a specified member, whether a chat group admin or regular member, from a message thread. The removed member no longer receives messages in the message thread.

The removed member receives the `EMChatThreadChangeListener#onChatThreadUserRemoved` callback. With multi-device login, the other devices of the member who performed the removal also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_KICK` event.

The following is sample code:

```java
// chatThreadId: Message thread ID
// member: User ID of the message thread member
EMClient.getInstance().chatThreadManager().removeMemberFromChatThread(chatThreadId, member, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

## Change a message thread name

Only the chat group owner, chat group admins, and message thread creator can call `updateChatThreadName` to change the message thread name.

With single-device login, all members of the chat group to which the message thread belongs receive the `EMChatThreadChangeListener#onChatThreadUpdated` callback. With multi-device login, other devices also receive the `EMMultiDeviceListener#onChatThreadEvent` callback with the `THREAD_UPDATE` event.

The following is sample code:

```java
// chatThreadId: Message thread ID
// newChatThreadName: New message thread name, with a maximum length of 64 characters
EMClient.getInstance().chatThreadManager().updateChatThreadName(chatThreadId, newChatThreadName, new EMCallBack() {
    @Override
    public void onSuccess() {
    }

    @Override
    public void onError(int code, String error) {
    }
});
```

## Retrieve message thread details

All members of the chat group containing a message thread can call `getChatThreadFromServer` to retrieve its details from the server.

The following is sample code:

```java
// chatThreadID: Message thread ID
EMClient.getInstance().chatThreadManager().getChatThreadFromServer(chatThreadId, new EMValueCallBack<EMChatThread>() {
    @Override
    public void onSuccess(EMChatThread value) { 
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Retrieve the message thread member list

All members of the chat group containing a message thread can call `getChatThreadMembers` to retrieve the message thread member list from the server by page.

```java
// chatThreadId: Message thread ID
// limit: Number of members returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `null` or an empty string for the first call.
EMClient.getInstance().chatThreadManager().getChatThreadMembers(chatThreadId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<String>>() {
    @Override
    public void onSuccess(EMCursorResult<String> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Retrieve message thread lists

- Call `getJoinedChatThreadsFromServer` to retrieve the list of message threads the user has joined and created from the server by page:

```java
// limit: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `null` or an empty string for the first call.
EMClient.getInstance().chatThreadManager().getJoinedChatThreadsFromServer(limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

- Call `getJoinedChatThreadsFromServer` to retrieve the list of message threads the user has joined and created in a specified chat group from the server by page:

```java
// parentId: Chat group ID
// limit: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `null` or an empty string for the first call.
EMClient.getInstance().chatThreadManager().getJoinedChatThreadsFromServer(parentId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

- Call `getChatThreadsFromServer` to retrieve the message thread list for a specified chat group from the server by page:

```java
// parentId: Chat group ID
// limit: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `null` or an empty string for the first call.
EMClient.getInstance().chatThreadManager().getChatThreadsFromServer(parentId, limit, cursor, 
        new EMValueCallBack<EMCursorResult<EMChatThread>>() {
    @Override
    public void onSuccess(EMCursorResult<EMChatThread> value) {
    }

    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Batch retrieve the latest messages in message threads

Call `getChatThreadLatestMessage` to batch retrieve the latest messages in message threads from the server.

The following is sample code:

```java
// chatThreadIdList: List of message thread IDs to query. Pass up to 20 message thread IDs per call.
EMClient.getInstance().chatThreadManager().getChatThreadLatestMessage(chatThreadIdList, 
        new EMValueCallBack<Map<String, EMMessage>>() {
    @Override
    public void onSuccess(Map<String, EMMessage> value) {
    }
    
    @Override
    public void onError(int error, String errorMsg) {
    }
});
```

## Monitor message thread events

`EMChatThreadManager` provides a listener for message thread events. Set this listener to receive and handle message thread events. Remove it when it is no longer used to prevent memory leaks.

The following is sample code:

```java
EMChatThreadChangeListener chatThreadChangeListener = new EMChatThreadChangeListener() {
    @Override
    // A message thread is created. All members of the chat group to which it belongs receive this event.
    public void onChatThreadCreated(EMChatThreadEvent event) {}
    @Override
    // A message thread name changes, or a message is added to or recalled from a message thread. All members of the chat group to which it belongs receive this event.
    public void onChatThreadUpdated(EMChatThreadEvent event) {}
    @Override
    // A message thread is destroyed. All members of the chat group to which it belongs receive this event.
    public void onChatThreadDestroyed(EMChatThreadEvent event) {}
    @Override
    // A message thread member is removed. The removed member receives this event.
    public void onChatThreadUserRemoved(EMChatThreadEvent event) {}
};
// Register the listener.
EMClient.getInstance().chatThreadManager().addChatThreadChangeListener(chatThreadChangeListener);

// Remove the listener.
EMClient.getInstance().chatThreadManager().removeChatThreadChangeListener(chatThreadChangeListener);
```

## API list

| API | Module/Class | Description |
| :--- | :--- | :--- |
| [`createChatThread`](#create-a-message-thread) | `EMChatThreadManager` | Creates a message thread based on a chat group message. |
| [`destroyChatThread`](#destroy-a-message-thread) | `EMChatThreadManager` | Destroys a message thread. |
| [`joinChatThread`](#join-a-message-thread) | `EMChatThreadManager` | Joins a message thread. |
| [`leaveChatThread`](#leave-voluntarily) | `EMChatThreadManager` | Voluntarily leaves a message thread. |
| [`removeMemberFromChatThread`](#be-removed-from-a-message-thread) | `EMChatThreadManager` | Removes a member from a message thread. |
| [`updateChatThreadName`](#change-a-message-thread-name) | `EMChatThreadManager` | Changes a message thread name. |
| [`getChatThreadFromServer`](#retrieve-message-thread-details) | `EMChatThreadManager` | Retrieves message thread details from the server. |
| [`getChatThreadMembers`](#retrieve-the-message-thread-member-list) | `EMChatThreadManager` | Retrieves the message thread member list by page. |
| [`getJoinedChatThreadsFromServer`](#retrieve-message-thread-lists) | `EMChatThreadManager` | Retrieves the list of message threads the current user has joined or created by page. |
| [`getChatThreadsFromServer`](#retrieve-message-thread-lists) | `EMChatThreadManager` | Retrieves the message thread list for a specified chat group by page. |
| [`getChatThreadLatestMessage`](#batch-retrieve-the-latest-messages-in-message-threads) | `EMChatThreadManager` | Batch retrieves the latest messages in message threads. |
