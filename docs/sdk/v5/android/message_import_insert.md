# Import and Insert Messages

## Feature overview

This document describes how the EasyIM Android SDK imports messages into the local database and inserts messages into local conversations.

These operations update only local message and conversation data on the current device. They do not send messages to the peer, upload messages to the server, or synchronize them to the current account's other devices. Common use cases include migrating historical messages, restoring local message records, and inserting locally displayed messages such as recall prompts, group joining notifications, and typing indicators.

The Android SDK provides the following methods:

- Import messages in bulk: Call `EMChatManager#importMessages` to import multiple messages sent or received by the current user into the local database, without updating the corresponding conversation information, such as the latest message.
- Insert a message into a specified conversation: Call `EMConversation#insertMessage` to insert a message into a specified conversation based on the message's Unix timestamp.
- Save a message directly: Call `EMChatManager#saveMessage` to save a message to memory and the local database. If the corresponding conversation does not exist, the SDK automatically creates it.

When messages are imported in bulk, if the corresponding conversation has no latest message record, it is filtered out when conversations are loaded from the local database with empty conversations excluded. It does not appear in the returned conversation list. `EMOptions#setLoadEmptyConversations` defaults to `false`, which means that empty conversations are not loaded.

Therefore, we recommend grouping the messages to import by conversation, sorting each conversation's messages by message time, and setting aside the latest message in each conversation. Import the remaining messages in bulk through `EMChatManager#importMessages`. After the bulk import is complete, call `EMConversation#insertMessage` on the corresponding conversation to insert the reserved message and update the conversation information. Retrieve or create the corresponding conversation before inserting the message. "Latest" is determined by the timestamp used by the SDK's current message sorting configuration. For example, if a conversation has three messages to import at 10:00, 10:01, and 10:02, first import the first two through `EMChatManager#importMessages`, and then insert the 10:02 message through `EMConversation#insertMessage`. Do not first import all three messages in bulk and then insert the 10:02 message again. Otherwise, the SDK returns immediately because the message already exists and does not update the conversation information.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and [open the current user's local database](initialization.html#set-automatic-data-synchronization-after-login). See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).


## Import messages into the database

To import messages into local conversations in bulk, first convert the data to import into a list of `EMMessage` objects, and then call `EMChatManager#importMessages(List<EMMessage>)`.

The current user can import only messages that they sent or received. After import, the messages are stored in the local database, but the corresponding conversation information, such as the latest message, is not updated. We recommend importing no more than 1,000 messages at a time.

`importMessages` is synchronous, returns no value, and provides no result callback. Before calling it, ensure that the SDK is initialized and the current user's local database is open.

```java
// messages is a prepared message list of type List<EMMessage>.
EMClient.getInstance()
        .chatManager()
        .importMessages(messages);
```

:::tip
`EMOptions#setRegardImportedMsgAsRead` does not control whether local messages imported through `EMChatManager#importMessages` are marked as read. This configuration applies to historical messages imported through the [server-side message import API](/rest/message_import_single.html) and subsequently retrieved from the server by the client.
:::

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
| [`importMessages`](#import-messages-into-the-database) | `EMChatManager` | Import messages sent or received by the current user into the local database in bulk. |
| [`getConversation`](#insert-messages) | `EMChatManager` | Retrieve a local conversation with a specified ID. Returns `null` if it is not found. |
| [`insertMessage`](#insert-messages) | `EMConversation` | Insert a message into a specified local conversation based on its Unix timestamp. |
| [`saveMessage`](#insert-messages) | `EMChatManager` | Save a message to memory and the local database, automatically creating a conversation if necessary. |
