# Import and Insert Messages

## Feature overview

This document describes how the EasyIM Android SDK imports messages into the local database and inserts messages into local conversations.

These operations update only local message and conversation data on the current device. They do not send messages to the peer, upload messages to the server, or synchronize them to the current account's other devices. Common use cases include migrating historical messages, restoring local message records, and inserting locally displayed messages such as recall prompts, group joining notifications, and typing indicators.

The Android SDK provides the following methods:

- Import messages in bulk: Call `EMChatManager#importMessages` to import multiple messages sent or received by the current user into the local database.
- Insert a message into a specified conversation: Call `EMConversation#insertMessage` to insert a message into a specified conversation based on the message's Unix timestamp.
- Save a message directly: Call `EMChatManager#saveMessage` to save a message to memory and the local database. If the corresponding conversation does not exist, the SDK automatically creates it.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and [open the current user's local database](initialization.html#set-automatic-data-synchronization-after-login). See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).


## Import messages into the database in bulk

To insert messages into local conversations through a batch import, construct `EMMessage` objects and call `importMessages` to import them into the local database.

The current user can import only messages that they sent or received. After import, the messages are added to the corresponding conversations based on their timestamps.

We recommend importing no more than 1,000 messages at a time.

Example code:

```java
EMClient.getInstance()
        .chatManager()
        .importMessages(messages);
```

## Insert messages

To add a message to a local conversation without sending it, such as “XXX recalled a message”, “XXX joined the group”, or “The other user is typing”, use one of the following methods:

- Call `EMConversation#insertMessage` to insert the message into an existing specified conversation. The message is inserted into the local database based on its Unix timestamp, and the SDK also updates conversation attributes such as `latestMessage`. Before calling this method, ensure that the message's conversation ID matches the target conversation ID.
- Call `EMChatManager#saveMessage` to save the message to memory and the local database. The SDK determines the conversation based on the message's conversation type and direction. If the corresponding conversation does not exist, the SDK automatically creates it. Command messages are not saved locally.

Both APIs update only local data on the current device. They do not send the message to the server or peer or synchronize it to the current account's other devices.

Example code:

```java
// First method: Insert the message into an existing specified conversation.
EMConversation conversation = EMClient.getInstance()
        .chatManager()
        .getConversation(conversationId);

if (conversation != null) {
    // The message's conversation ID must match the target conversation ID.
    // The SDK determines the insertion position based on the message's Unix timestamp.
    boolean inserted = conversation.insertMessage(message);
}

// Second method: Save the message directly.
// The SDK determines the conversation from the message information and automatically creates it if it does not exist.
// Note: Command messages are not saved locally.
EMClient.getInstance()
        .chatManager()
        .saveMessage(message);
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`importMessages`](#import-messages-into-the-database-in-batches) | `EMChatManager` | Import messages sent or received by the current user into the local database in bulk. |
| [`getConversation`](#insert-messages) | `EMChatManager` | Retrieve a local conversation with a specified ID. Returns `null` if it is not found. |
| [`insertMessage`](#insert-messages) | `EMConversation` | Insert a message into a specified local conversation based on its Unix timestamp. |
| [`saveMessage`](#insert-messages) | `EMChatManager` | Save a message to memory and the local database, automatically creating a conversation if necessary. |
