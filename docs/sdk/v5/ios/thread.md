# Manage Message Threads

## Feature overview

A message thread is a subset of chat group members and is an instant messaging system that supports multi-user communication.

This page describes how to use the EasyIM iOS SDK to create and manage message threads in a real-time interactive app and implement message thread features.

## Feature activation

Before using message threads, contact the EasyIM business manager to activate the feature.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the iOS SDK. For details, see [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- Understand the limits on message threads and message thread members. For details, see [Limitations](/product/limitation.html).
- Contact the EasyIM business manager to activate message threads.

This section describes how to use the APIs provided by the EasyIM SDK to implement the preceding features.

## Create a message thread

All chat group members can call `createChatThread` to create a message thread based on a chat group message.

With single-device login, all members of the chat group to which the message thread belongs receive the `onChatThreadCreate` callback. With multi-device login, other devices also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadCreate` event.

The following is sample code:

```objectivec
// threadName: Message thread name, with a maximum length of 64 characters
// messageId: ID of the message on which the message thread is created
// parentId: Chat group ID
// Asynchronous method
[[EMClient sharedClient].threadManager createChatThread:self.threadName messageId:self.message.message.messageId parentId:self.message.message.to completion:^(EMChatThread *thread, EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

## Destroy a message thread

Only the owner and admins of the chat group containing the message thread can call `destroyChatThread` to destroy the message thread.

With single-device login, all members of the chat group to which the message thread belongs receive the `onChatThreadDestroy` callback. With multi-device login, other devices also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadDestroy` event.

:::tip
After a message thread is destroyed, the chat group-related information and chat group conversation in the local database and memory are deleted. Proceed with caution.
:::

The following is sample code:

```objectivec
// Asynchronous method
    [EMClient.sharedClient.threadManager destroyChatThread:self.conversationId completion:^(EMError *aError) {
        if (!aError) {
            
        } else {
            
        }
    }];
```

## Join a message thread

All members of the chat group containing a message thread can call `joinChatThread` to join the chat group.

Join a message thread as follows:

1. Obtain the ID of the message thread to join from an `onChatThreadCreate` or `onChatThreadUpdate` callback, or call `getChatThreadsFromServerWithParentId:cursor:pageSize:completion:` to retrieve the message thread list for a specified chat group from the server.
2. Call `joinChatThread` and pass the message thread ID to join the corresponding message thread.  

With multi-device login, other devices also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadJoin` event.

The following is sample code:

```objectivec
// Asynchronous method
[EMClient.sharedClient.threadManager joinChatThread:model.message.threadOverView.threadId completion:^(EMChatThread *thread,EMError *aError) {
    if (!aError || aError.code == EMErrorUserAlreadyExist) {
        
    }
}];
```

## Leave a message thread

#### Leave voluntarily

Message thread members can call `leaveChatThread` to leave voluntarily. After leaving, the member no longer receives messages in the message thread.

With multi-device login, other devices also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadLeave` event.

The following is sample code:

```objectivec
// Asynchronous method
[EMClient.sharedClient.threadManager leaveChatThread:self.conversationId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

### Be removed from a message thread

Only a chat group owner or admin can call `removeMemberFromChatThread` to remove a specified member (a chat group admin or regular member) from a message thread. The removed member no longer receives messages in the message thread.

The removed member receives the `onUserKickOutOfChatThread` callback. With multi-device login, the other devices of the member who performed the removal also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadKick` event.

The following is sample code:

```objectivec
// chatThreadId: Message thread ID
// member: User ID of the message thread member
// Asynchronous method
[EMClient.sharedClient.threadManager removeMemberFromChatThread:member threadId:self.threadId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

## Change a message thread name

Only the chat group owner, chat group admins, and message thread creator can call `updateChatThreadName` to change the message thread name.

With single-device login, all members of the chat group to which the message thread belongs receive the `onChatThreadUpdate` callback. With multi-device login, other devices also receive the `multiDevicesChatThreadEventDidReceive` callback with the `EMMultiDevicesEventChatThreadUpdate` event.

The following is sample code:

```objectivec
// threadId: Message thread ID
// ThreadName: New message thread name, with a maximum length of 64 characters
// Asynchronous method
[EMClient.sharedClient.threadManager updateChatThreadName:self.threadNameField.text threadId:self.threadId completion:^(EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

## Retrieve message thread details

All members of the chat group containing a message thread can call `getChatThreadFromSever:completion:` to retrieve the message thread details from the server.

The following is sample code:

```objectivec
// threadId: Message thread ID
// Asynchronous method
[EMClient.sharedClient.threadManager getChatThreadFromSever:self.currentConversation.conversationId completion:^(EMChatThread *thread, EMError *aError) {
    if (!aError) {
        
    } else {
        
    }
}];
```

## Retrieve the message thread member list

All members of the chat group containing a message thread can call `getChatThreadMemberListFromServerWithId` to retrieve the message thread member list from the server by page.

```objectivec
// threadId: Message thread ID
// pageSize: Number of members returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `nil` or an empty string for the first call.
// Asynchronous method
[[EMClient sharedClient].threadManager getChatThreadMemberListFromServerWithId:self.threadId cursor:aCursor pageSize:pageSize completion:^(EMCursorResult *aResult, EMError *aError) {
    if (!aError) { self.cursor = aResult; }
}];
```

## Retrieve message thread lists

1. Call `getJoinedChatThreadsFromServer` to retrieve the list of message threads the user has joined and created from the server by page:

```objectivec
// limit: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `nil` or an empty string for the first call. 
// Asynchronous method
[EMClient.sharedClient.threadManager getJoinedChatThreadsFromServerWithCursor:@"" pageSize:20 completion:^(EMCursorResult * _Nonnull result, EMError * _Nonnull aError) {
        
}];
```

2. Call `getJoinedChatThreadsFromServer` to retrieve the list of message threads the user has joined and created in a specified chat group from the server by page:

```objectivec
// parentId: Chat group ID
// pageSize: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `nil` or an empty string for the first call.
// Asynchronous method
[EMClient.sharedClient.threadManager getJoinedChatThreadsFromServerWithParentId:self.group.groupId cursor:self.cursor ? self.cursor.cursor:@"" pageSize:20 completion:^(EMCursorResult * _Nonnull result, EMError * _Nonnull aError) {
    if (!aError) {
        
    }
}];
```

3. Call `getChatThreadsFromServer` to retrieve the message thread list for a specified chat group from the server by page:

```objectivec
// parentId: Chat group ID
// pageSize: Number of message threads returned in a single request. The range is [1,50].
// cursor: Cursor position from which to start retrieving data. Pass `nil` or an empty string for the first call.
// Asynchronous method
[[EMClient sharedClient].threadManager getChatThreadsFromServerWithParentId:self.group.groupId cursor:self.cursor ? self.cursor.cursor:@"" pageSize:20 completion:^(EMCursorResult *result, EMError *aError) {
    if (!aError) {
        
    }
}];
```

## Bulk retrieve the latest messages in message threads

Call `getLastMessageFromSeverWithChatThreads` to retrieve the latest message in each message thread from the server.

The following is sample code:

```objectivec
// threadIds: List of message thread IDs to query. Pass up to 20 message thread IDs per call.
// Asynchronous method
[[EMClient sharedClient].threadManager getLastMessageFromSeverWithChatThreads:ids completion:^(NSDictionary<NSString *,EMChatMessage *> * _Nonnull messageMap, EMError * _Nonnull aError) {
    if (!aError) {
        
    }
}];
```

## Monitor message thread events

`EMChatThreadManager` provides a listener for message thread events. Set this listener to receive and handle message thread events. Remove it when it is no longer used to prevent memory leaks.

The following is sample code:

```objectivec
EMThreadManagerDelegate 

// A message thread is created. All members of the chat group to which it belongs receive this event.
- (void)onChatThreadCreate:(EMChatThreadEvent *)event;

// A message thread name changes, or a message is added to or recalled from a message thread. All members of the chat group to which it belongs receive this event.
- (void)onChatThreadUpdate:(EMChatThreadEvent *)event;

// A message thread is destroyed. All members of the chat group to which it belongs receive this event.
- (void)onChatThreadDestroy:(EMChatThreadEvent *)event;

// A message thread member is removed. The removed member receives this event.
- (void)onUserKickOutOfChatThread:(EMChatThreadEvent *)event;

// Register the listener.
[[EMClient sharedClient].threadManager addDelegate:self delegateQueue:nil];
// Remove the listener.
[[EMClient sharedClient].threadManager removeDelegate:self];
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
| [`getChatThreadFromSever`](#retrieve-message-thread-details) | `EMChatThreadManager` | Retrieves message thread details from the server. |
| [`getChatThreadMemberListFromServerWithId`](#retrieve-the-message-thread-member-list) | `EMChatThreadManager` | Retrieves the message thread member list by page. |
| [`getJoinedChatThreadsFromServerWithCursor`](#retrieve-message-thread-lists) | `EMChatThreadManager` | Retrieves the list of message threads the current user has joined or created by page. |
| [`getChatThreadsFromServerWithParentId`](#retrieve-message-thread-lists) | `EMChatThreadManager` | Retrieves the message thread list for a specified chat group by page. |
| [`getLastMessageFromSeverWithChatThreads`](#bulk-retrieve-the-latest-messages-in-message-threads) | `EMChatThreadManager` | Retrieves the latest message in each message thread. |
