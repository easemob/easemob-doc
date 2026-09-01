# Import and Insert Messages

## Feature overview

This document describes how the EasyIM iOS SDK imports messages into the local database and inserts messages into a local conversation.

These operations update only local messages and conversation data on the current device. They do not send messages to the other party, upload messages to the server, or synchronize messages to other devices under the current account. Common use cases include migrating historical messages, restoring local message records, and inserting messages for local display only, such as message recall prompts and join notifications.

The iOS SDK provides the following methods:

- Batch import messages: Call `importMessages` to asynchronously import multiple messages sent or received by the current user into the local database.
- Insert a message into a specified conversation: Call `insertMessage` to insert a message into the specified conversation according to its Unix timestamp and update properties such as `latestMessage`.

## Prerequisite

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Understand the usage limits of EasyIM. For details, see [IM feature limits](/product/limitation.html).

## Batch import messages into the database

To batch import messages into local conversations, call `importMessages`, create `EMChatMessage` objects, and import the messages into the local database.

The current user can import only messages they sent or received. After import, messages are added to the corresponding conversations according to their timestamps.

We recommend importing no more than 1,000 messages at a time.

```objectivec
[[EMClient sharedClient].chatManager importMessages:messages completion:^(EMError *error) {
    // Handle the import result.
}];
```

## Insert a message

To add a message that does not need to be sent and is intended only for local display, such as “XXX recalled a message,” “XXX joined the group,” or “The other party is typing,” call `insertMessage` to insert it into a specified local conversation.

The message is inserted into the local database according to its Unix timestamp, and the SDK updates properties such as `latestMessage`. Before calling this method, ensure that the message conversation ID matches the target conversation ID.

```objectivec
EMConversation *conversation = [[EMClient sharedClient].chatManager getConversation:conversationId type:type createIfNotExist:YES];
EMError *error = nil;
[conversation insertMessage:message error:&error];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`importMessages`](#batch-import-messages-into-the-database) | `IEMChatManager` | Imports messages in bulk asynchronously. |
| [`getConversation`](#insert-a-message) | `IEMChatManager` | Retrieves or creates a local conversation. |
| [`insertMessage`](#insert-a-message) | `EMConversation` | Inserts a message into a local conversation synchronously. |
