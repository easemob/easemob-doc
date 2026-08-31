# Implement a Typing Indicator Using Command Messages

A typing indicator shows the other user the "The other user is typing..." status in a one-to-one chat. The Web SDK currently does not provide a dedicated typing indicator API. This feature is typically implemented using command messages (CMD messages).

## Prerequisite

Before you start, ensure that the following requirements are met:

- The SDK has been initialized. For details, see [Quick Start](quickstart.html).
- `ChatManager` was registered during SDK initialization.
- You understand the EasyIM [limitations](/product/limitation.html).

## Implementation

You can implement a typing indicator using command messages. The following figure shows how a typing indicator works.

![img](/images/common/typing_indicator.png)

Monitor user A's typing status. As soon as user A starts entering text, your app sends user B a command message indicating that user A is typing. After receiving the message, user B can display a typing indicator on the current chat page with user A.

- User A sends user B a typing-status command message to indicate that user A has started typing.
- After receiving the message, user B can display a "The other user is typing" prompt if user B is currently on the one-to-one conversation page with user A.
- If user B does not receive another typing-status message within the configured period, the typing indicator should be hidden automatically.

:::tip
We recommend throttling typing-status command messages, for example, by sending no more than one every 5 seconds, to avoid sending them too frequently.
:::

### Send a typing-status command message

The following sample code shows how to send a typing-status command message.

```typescript
// Send a "typing" indicator.
function sendTypingIndicator(to: string): void {
  const message = client.chatManager.createCmdMessage({
    // Recipient user ID.
    conversationId: to,
    // Conversation type. Typing indicators are typically used only in one-to-one chats.
    conversationType: 'singleChat',
    // Command action agreed upon by the sender and recipient.
    action: 'TypingBegin',
    // Deliver only to online users to prevent expired typing statuses from being received while offline.
    deliverOnlineOnly: true,
  });

  void client.chatManager.sendMessage(message);
}
```

### Receive and parse a typing-status command message

The following sample code shows how to receive and parse a typing-status command message.

```typescript
client.chatManager.addEventHandler('typing', {
  onMessage: (message) => {
    // Process only one-to-one command messages.
    if (message.conversationType !== 'singleChat' || message.type !== 'cmd') {
      return;
    }
    // Determine whether this is a "typing" indicator based on the agreed-upon action.
    if (message.body.action === 'TypingBegin') {
      // `message.from` identifies the user who sent the typing status.
      console.log(message.from, 'is typing...');
      // Display a "typing" prompt here.

      // Set a timeout, for example, to hide the typing indicator automatically after 5 seconds.
      setTimeout(() => {
        console.log('Typing indicator timed out; hide the indicator');
      }, 5000);
    }
  },
});
```

## API list

| API name                                           | Module/Class   | Description                             |
| -------------------------------------------------- | ------------- | -------------------------------- |
| [`createCmdMessage`](#send-a-typing-status-command-message)      | `ChatManager` | Creates a typing-status command message.           |
| [`sendMessage`](#send-a-typing-status-command-message)           | `ChatManager` | Sends a typing-status command message.           |
