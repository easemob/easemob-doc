# Forward Messages

## Feature overview

Forwarding a message sends a successfully sent or received message from the current conversation to another conversation. For example, after user A sends a message to user B, user B can forward it to user C, a chat group, a chat room, or a message thread.

The EasyIM SDK supports the following forwarding methods:

- **Forward a single message**: Create a new message based on the original message object, reuse its body and extension, and send the new message to a target one-to-one chat, group chat, chat room, or message thread. This method supports text, image, voice, video, file, location, command, custom, combined, and other message types.
- **Forward multiple messages**: Combine multiple messages into one combined message and send it to a target conversation. The recipient can expand the combined message to view its contents. For details, see [Send combined messages](message_send.html#send-combined-messages).

Forwarding creates and sends a new message with its own message ID, sender, recipient, and sending time. It does not change the original message or its conversation. For attachment messages, the SDK can reuse the server-side attachment URL from the original message without uploading the attachment again. If the original attachment has been deleted from the server after its storage period expired, the recipient cannot download it.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK and log in. For details, see [Quickstart](quickstart.html).
- Register `ChatManager` so that you can call APIs for message creation, historical-message retrieval, and message sending through `client.chatManager`.
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Forward a single message

To forward a single message, first obtain the original message object. Then, call the corresponding `create*Message()` method based on its message type to create a new message of the same type. When creating the new message, you can reuse the original message body and extension. After setting the target conversation and conversation type, call `ChatManager#sendMessage` to send the new message.

In practice, obtain the original message object from one of the following sources:

- A message object received through the `onMessage` event;
- An item in the message list on the current page;
- Historical messages retrieved by calling `getHistoryMessages`;
- Server-side search results retrieved by calling `searchMessages`.

A single message can be forwarded to a one-to-one chat, group chat, chat room, or message thread. To forward it to a message thread, set `conversationId` to the message thread ID, set `conversationType` to `groupChat`, and set `isChatThread: true`.

When forwarding an attachment message, the SDK can reuse the server-side attachment URL from the original message without uploading the attachment again. If the attachment has been deleted from the server after its storage period expired, the forwarded message can still contain the original attachment URL, but the recipient cannot download the attachment.

:::tip
A combined message can also be forwarded directly as a single message.
:::

```typescript
import type {
  ChatConversationType,
  CombineMessageBody,
  CustomMessageBody,
  CmdMessageBody,
  FileMessageBody,
  ImageMessageBody,
  LocationMessageBody,
  Message,
  TextMessageBody,
  VideoMessageBody,
  VoiceMessageBody,
} from 'easemob-websdk';

// The original message object generally comes from onMessage, the current message list, getHistoryMessages, or searchMessages.
const targetMessage: Message = sourceMessage;

// For a one-to-one chat, pass the peer user ID. For a group chat, pass the group ID. For a chat room, pass the chat room ID.
// To forward to a message thread, pass the message thread ID, set conversationType to groupChat,
// and set isChatThread: true.
const conversationId = 'conversationId';
const conversationType: ChatConversationType = 'groupChat';
const isChatThread = false;

async function buildForwardMessage(message: Message): Promise<Message> {
  switch (message.type) {
    case 'text': {
      const body = message.body as TextMessageBody;
      return client.chatManager.createTextMessage({
        conversationId,
        conversationType,
        isChatThread,
        content: body.content,
        targetLanguages: body.targetLanguages,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'image': {
      const body = message.body as ImageMessageBody;
      return client.chatManager.createImageMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.originalImageUrl || body.bigImageUrl,
        thumbnailUrl: body.thumbnailUrl,
        filename: body.filename,
        filetype: body.filetype,
        width: body.width,
        height: body.height,
        isGif: body.isGif,
        isOriginalImage: body.isOriginalImage,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'voice': {
      const body = message.body as VoiceMessageBody;
      return client.chatManager.createVoiceMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        filename: body.filename,
        filetype: body.filetype,
        duration: body.duration,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'video': {
      const body = message.body as VideoMessageBody;
      return client.chatManager.createVideoMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        thumbnailUrl: body.thumbnailUrl,
        filename: body.filename,
        filetype: body.filetype,
        duration: body.duration,
        width: body.width,
        height: body.height,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'file': {
      const body = message.body as FileMessageBody;
      return client.chatManager.createFileMessage({
        conversationId,
        conversationType,
        isChatThread,
        originalUrl: body.url,
        filename: body.filename,
        filetype: body.filetype,
        fileSize: body.fileSize,
        fileLength: body.fileLength,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'location': {
      const body = message.body as LocationMessageBody;
      return client.chatManager.createLocationMessage({
        conversationId,
        conversationType,
        isChatThread,
        latitude: body.latitude,
        longitude: body.longitude,
        address: body.address,
        buildingName: body.buildingName,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'cmd': {
      const body = message.body as CmdMessageBody;
      return client.chatManager.createCmdMessage({
        conversationId,
        conversationType,
        isChatThread,
        action: body.action,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'custom': {
      const body = message.body as CustomMessageBody;
      return client.chatManager.createCustomMessage({
        conversationId,
        conversationType,
        isChatThread,
        event: body.event,
        params: body.params,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    case 'combine': {
      const body = message.body as CombineMessageBody;
      const messageList =
        body.messageList ||
        (await client.chatManager.downloadAndParseCombineMessage({
          message,
        }));

      return client.chatManager.createCombineMessage({
        conversationId,
        conversationType,
        isChatThread,
        title: body.title,
        summary: body.summary,
        messageList,
        ext: message.ext,
        webhookEnv: message.webhookEnv,
        deliverOnlineOnly: message.deliverOnlineOnly,
        receiverList: message.receiverList,
        priority: message.priority,
        needReadReceipt: message.needReadReceipt,
      });
    }

    default:
      throw new Error(`Unsupported message type: ${message.type}`);
  }
}

const newMessage = await buildForwardMessage(targetMessage);
await client.chatManager.sendMessage(newMessage);
```

## Forward multiple messages

To forward multiple messages, the EasyIM SDK can combine them into a single message. For details, see [Send combined messages](message_send.html#send-combined-messages).

## Considerations

- A forwarded message is a new message. It has its own message ID, sender, recipient, and sending time and does not change the original message or its conversation.
- When the SDK receives a forwarded message, it still returns a standard message object and does not automatically indicate that the message was forwarded. If your app needs to distinguish regular messages from forwarded messages, add a custom marker to `ext` when forwarding and parse it upon receipt.
- When forwarding a single message, the recipient receives a newly created and sent message. Although its body generally matches the original message, its metadata has changed, so it should not be treated as the original message itself.
- Attachment messages generally reuse the server-side attachment URL from the original message without uploading the attachment again. If the original attachment has been deleted from the server after its storage period expired, the recipient may still receive the forwarded message but cannot download the attachment.
- For a combined message, the recipient first receives a message of the `combine` type. To view the original messages it contains, call `downloadAndParseCombineMessage` to download and parse them.
- If a message is forwarded to a message thread, the recipient can use `isChatThread`, `conversationId`, and `conversationType` to determine whether the message belongs to a message thread.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getHistoryMessages`](message_retrieve.html) | `ChatManager` | Retrieves historical messages from the server. When forwarding a single message, use the returned original message object. |
| [`searchMessages`](message_retrieve.html) | `ChatManager` | Searches historical messages by keyword and filters. Use this API to select an original message from the search results. |
| [`createTextMessage`](message_send.html#send-text-messages) | `ChatManager` | Creates the forwarded text message. |
| [`createImageMessage`](message_send.html#send-image-messages) | `ChatManager` | Creates the forwarded image message. |
| [`createVoiceMessage`](message_send.html#send-voice-messages) | `ChatManager` | Creates the forwarded voice message. |
| [`createVideoMessage`](message_send.html#send-video-messages) | `ChatManager` | Creates the forwarded video message. |
| [`createFileMessage`](message_send.html#send-file-messages) | `ChatManager` | Creates the forwarded file message. |
| [`createLocationMessage`](message_send.html#send-location-messages) | `ChatManager` | Creates the forwarded location message. |
| [`createCmdMessage`](message_send.html#send-command-messages) | `ChatManager` | Creates the forwarded command message. |
| [`createCustomMessage`](message_send.html#send-custom-messages) | `ChatManager` | Creates the forwarded custom message. |
| [`createCombineMessage`](message_send.html#send-combined-messages) | `ChatManager` | Creates the forwarded combined message. |
| [`downloadAndParseCombineMessage`](message_send.html#parse-combined-messages-on-the-recipient) | `ChatManager` | Downloads and parses the list of original child messages in a combined message. |
| [`sendMessage`](message_send.html#message-sending-callbacks) | `ChatManager` | Sends the forwarded message. |
