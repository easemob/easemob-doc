# Message Extensions

## Feature overview

When built-in message fields do not meet your business requirements, use the message extension field `ext` to carry custom business data, such as information about the message being replied to, display data for rich media messages, or business identifiers.

The SDK supports passing `ext` when creating any type of message. This optional field must be a JSON-serializable object. After receiving the message, the recipient can read custom data from `ext` in the message object and process it as needed.

## Example code

```typescript
async function sendTextMessage() {
  const message = client.chatManager.createTextMessage({
    conversationId: 'user2',
    conversationType: 'singleChat',
    content: 'message content',
    // Set the message extension. The extension must be a JSON-serializable object.
    ext: {
      key1: 'Self-defined value1',
      key2: {
        key3: 'Self-defined value3',
      },
    },
  });

  // Call `sendMessage` to send a message containing the extension.
  try {
    await client.chatManager.sendMessage(message);
    console.log('Send private text success.');
  } catch (e) {
    console.log('Send private text error.', e);
  }
}
```

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`createTextMessage`](#example-code) | `ChatManager` | Creates a text message containing an extension. |
| [`sendMessage`](#example-code) | `ChatManager` | Sends a message. |
