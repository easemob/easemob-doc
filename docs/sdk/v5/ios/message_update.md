# Update Messages

## Feature overview

The EasyIM iOS SDK supports updating existing messages in local memory and the local database on the current device. The app can modify a message's local state or content as required and refresh the message displayed in the conversation. The message ID cannot be modified.

Local message updates apply only to the current device. They do not modify messages stored on the server or synchronize changes to the recipient or other devices under the current account.

## Prerequisite

Before you start, make sure that the following requirements are met:

- The SDK is initialized and connected to the server. For details, see [Quickstart](quickstart.html).
- You understand the usage limits of EasyIM. For details, see [IM feature limits](/product/limitation.html).

## Update a message in the local database

Call `updateMessage` to asynchronously update a message in local memory and the local database. This operation does not modify the server-side message or notify the recipient or other devices under the current account.

```objectivec
// Asynchronous method.
[[EMClient sharedClient].chatManager updateMessage:message
                                        completion:^(EMChatMessage *updatedMessage, EMError *error) {
    if (!error) {
        // The local message update is complete.
    }
}];
```

## API list

| API name | Module/Type | Description |
| :--- | :--- | :--- |
| [`updateMessage:completion`](#update-a-message-in-the-local-database) | `IEMChatManager` | Asynchronously updates a message in local memory and the local database on the current device. |
