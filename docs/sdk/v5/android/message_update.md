# Update Messages

## Feature overview

The EasyIM Android SDK supports updating existing messages in local memory and the local database on the current device. Your app can update the local state or content of a message as required and refresh the message displayed in the conversation.
A local message update takes effect only on the current device. It does not modify the message stored on the server or synchronize the change to the recipient or the current account's other devices.
## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and ensure that the current user's [local database is open](login.html#登录完成前使用本地数据库). See [Quickstart](quickstart.html).
- Understand the EasyIM API usage restrictions. See [Limitations](/product/limitation.html).

## Update messages in the local database

You can update messages in the current device's local database in the following two ways. This operation does not modify messages on the server or notify the recipient or the current account's other devices.

- Call `EMChatManager#updateMessage` directly to update a message in the SDK's local database.

```java 
boolean success = EMClient.getInstance()
        .chatManager()
        .updateMessage(message);
```

- If you are using the `EMConversation` class, first obtain the conversation and then call `EMConversation#updateMessage` to update a message in the SDK's local database conversation.

```java
EMConversation conversation = EMClient.getInstance().chatManager().getConversation(conversationId);
if (conversation != null) {
    boolean success = conversation.updateMessage(message);
}
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`updateMessage`](#update-messages-in-the-local-database) | `EMChatManager` | Update a message in local memory and the local database on the current device. |
| [`getConversation`](#update-messages-in-the-local-database) | `EMChatManager` | Retrieve a local conversation object by conversation ID. |
| [`updateMessage`](#update-messages-in-the-local-database) | `EMConversation` | Update a message for a specified conversation in the local database and in-memory cache. |

