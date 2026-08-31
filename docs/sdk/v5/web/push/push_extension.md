# Configure Push Extension Features

When sending a message, use message extension fields to implement push extension features, including force push and silent messages.

## Force push

After force push is configured, a user can send messages that override the recipient's Do Not Disturb settings. Regardless of whether the recipient is within a Do Not Disturb period, the server sends offline push notifications to the recipient as usual.

```typescript
// The following example uses a text message. Other message types are configured in the same way.
const message = client.chatManager.createTextMessage({
  conversationId: 'targetUserId',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    // Whether to use force push.
    // `YES` enables force push. If omitted or set to `NO`, the regular push rules apply.
    em_force_notification: 'YES',
  },
});

await client.chatManager.sendMessage(message);
```

## Send a silent message

To send a silent message, the sender configures the message not to trigger a push notification. When the user is offline, EasyIM does not send a message notification to the user's device through the push service, so the user does not receive a push notification for the message. Upon getting online again, the user still receives messages sent while offline.

Neither a silent message nor a message sent during Do Not Disturb triggers a push notification. The difference is that the sender configures a silent message when sending it, whereas the recipient configures Do Not Disturb to stop receiving push notifications during a specified period.

```typescript
// The following example uses a text message. Other message types are configured in the same way.
const message = client.chatManager.createTextMessage({
  conversationId: 'targetUserId',
  conversationType: 'singleChat',
  content: 'message content',
  ext: {
    // Whether to send a silent message. This field is defined by the server:
    // `true`: Send a silent message. `false` or omitted: Apply the regular message-push logic.
    em_ignore_notification: true,
  },
});

await client.chatManager.sendMessage(message);
```
