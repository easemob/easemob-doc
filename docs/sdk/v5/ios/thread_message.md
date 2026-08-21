# Manage Messages in Message Threads

Messages in a message thread are group messages. They differ from regular group messages in that the `isChatThread` flag must be added.

This document describes how the EasyIM iOS SDK sends, receives, and recalls messages in message threads.

## Feature activation

Before using messages in message threads, contact the EasyIM business manager to activate message threads.

## Understand the tech

The EasyIM iOS SDK provides the `EMManager`, `EMChatMessage`, and `EMChatThreadInfo` classes for managing messages in message threads. By calling APIs, you can send, receive, recall, and retrieve messages in message threads in your project.

Messages are sent and received as follows:

Client A sends a message to Client B. The message is sent to the EasyIM server, which delivers it to Client B. For a message in a message thread, the server delivers it to every other member of the message thread. After Client B receives the message, the SDK triggers an event. Client B monitors the event and retrieves the message.

The following figure shows how a message thread is created and viewed:

![img](/images/ios/threads.png)

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the iOS SDK. See [Quickstart](quickstart.html).
- Understand the EasyIM API [limitations](/product/limitation.html).
- Understand the limits on message threads and the number of message thread members. See [Limitations](/product/limitation.html).
- Contact the EasyIM business manager to activate message threads.

## Send messages in a message thread

Sending a message in a message thread is essentially the same as sending a group message. For details, see [Send Messages](message_send.html). The only difference is that for a message in a message thread, the `isChatThread` flag must be set to `YES`.

With single-device login, all members of the chat group to which the message thread belongs receive the `onChatThreadUpdate` callback.

Example code:

```objectivec
// Create a text message. `content` is the message text, and `chatThreadId` is the message thread ID.
NSString *from = [[EMClient sharedClient] currentUsername];
NSString *chatThreadId = self.currentConversation.conversationId;
EMChatMessage *message = [[EMChatMessage alloc] initWithConversationID:chatThreadId from:from to:chatThreadId body:aBody ext:aExt];
// Whether a message read receipt is required.
if([aExt objectForKey:MSG_EXT_READ_RECEIPT]) {
    message.isNeedReadReceipt = YES;
}
message.chatType = (EMChatType)self.conversationType;
message.isChatThread = self.isChatThread;
// Send the message.
[[EMClient sharedClient].chatManager sendMessage:message progress:nil completion:^(EMChatMessage *message, EMError *error) {

}];
```

## Receive messages in a message thread

For the detailed message receiving logic, see [Receive Messages](message_receive.html). This section describes only the differences between messages in a message thread and other messages.

Message thread members can set the `messagesDidReceive` message callback to monitor messages received in the message thread.

Example code:

```objectivec
- (void)messagesDidReceive:(NSArray *)aMessages
{
    // Perform the relevant processing.
}
// Add the message delegate.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
// Remove the message delegate.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## Recall messages in a message thread

For the detailed message recall logic, see [Recall Messages](message_recall.html). This section describes only the differences between messages in a message thread and other messages.

Message thread members can set the `messagesInfoDidRecall` message callback to monitor message recalls in the message thread.

Example code:

```objectivec
- (void)messagesInfoDidRecall:(NSArray<EMRecallMessageInfo *> *)aRecallMessagesInfo
{}
```

## Retrieve messages in a message thread

Whether to retrieve messages in a message thread from the server or the local database depends on your production environment.

You can use the `isChatThread` property to determine whether the current conversation is a message thread conversation.

### Retrieve messages in a message thread from the server (message roaming)

Call `fetchMessagesFromServerBy:conversationType:cursor:pageSize:option:completion:` to retrieve messages in a message thread from the server. The only difference from retrieving group messages is that you pass a message thread ID for the former and a group ID for the latter.

```objectivec
[EMClient.sharedClient.chatManager fetchMessagesFromServerBy:@"threadId" conversationType:EMConversationTypeGroupChat cursor:nil pageSize:20 option:nil completion:^(EMCursorResult<EMChatMessage *> * _Nullable aResult, EMError * _Nullable aError) {
            
    }];
```

### Retrieve messages in a message thread locally

`getAllConversations` retrieves only one-to-one or group conversations. To retrieve messages from a single local message thread conversation, see the following sample code:

```objectivec
// Set the conversation type to `EMConversationTypeGroupChat` and `isThread` to `YES`.
EMConversation* conversation = [EMClient.sharedClient.chatManager getConversation:conversationId type:EMConversationTypeGroupChat createIfNotExist:NO isThread:YES];
// Retrieve messages in the message thread conversation.
[conversation loadMessagesStartFromId:@"" count:20 searchDirection:EMMessageSearchDirectionUp completion:^(NSArray<EMChatMessage *> * _Nullable aMessages, EMError * _Nullable aError) {
            
}];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`sendMessage`](#send-messages-in-a-message-thread) | `EMChatManager` | Send a message in a message thread with the `isChatThread` flag. |
| [`fetchMessagesFromServerBy`](#retrieve-messages-in-a-message-thread-from-the-server-message-roaming) | `EMChatManager` | Retrieve historical messages in a specified message thread from the server by page. |
| [`getConversation`](#retrieve-messages-in-a-message-thread-locally) | `EMChatManager` | Retrieve a local message thread conversation. |
| [`loadMessagesStartFromId`](#retrieve-messages-in-a-message-thread-locally) | `EMConversation` | Load messages in a message thread from a local conversation. |
