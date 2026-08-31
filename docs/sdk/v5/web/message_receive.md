# Receive Messages

## Feature overview

The EasyIM SDK can receive text, image, voice, video, file, and other message types.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. For details, see [Initialization](initialization.html).
- Register `ChatManager` during SDK initialization so that you can call conversation and message APIs through `client.chatManager`.
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Monitor message events

Before receiving messages, register a message event listener:

1. Call `client.chatManager.addEventHandler()` to register a message event listener.
2. Receive regular messages in `onMessage`.
3. Determine the message type from `message.type` and run the corresponding business logic.

```typescript
const CHAT_HANDLER_ID = 'chat-message-listener';

client.chatManager.addEventHandler(CHAT_HANDLER_ID, {
  // Receive messages of various types.
  onMessage: message => {
    console.log('Message received:', message.msgServerId, message.type);
  },
});
```

## Common message fields

The `onMessage` callback returns a standardized `Message` object. The following fields are commonly used when receiving messages:

| Field | Type | Description |
| :--- | :--- | :--- |
| `msgServerId` | String | Server-side message ID. |
| `msgLocalId` | String | Local message ID. |
| `from` | String | User ID of the message sender. |
| `to` | String | Message recipient identifier. For a one-to-one chat, this is the peer user ID. For a group chat, this is the group ID. For a chat room, this is the chat room ID. |
| `sender` | Sender | Sender summary. |
| `conversationId` | String | ID of the conversation to which the message belongs. |
| `conversationType` | `'singleChat' \| 'groupChat' \| 'chatRoom'` | Conversation type. |
| `type` | MessageType | Message type. |
| `body` | MessageBody | Message body. Its structure varies by message type. |
| `ext` | `Record<string, unknown>` | Extension. |
| `timestamp` | Number | Message timestamp in milliseconds. |
| `direct` | `'SEND' \| 'RECEIVE'` | Message direction. |
| `isOnline` | Boolean | Whether this is an online message. `false` indicates a message obtained through offline synchronization. |
| `isBroadcast` | Boolean | Whether this is a chat room broadcast message. |
| `modifiedInfo` | MessageModifiedInfo | Message editing information. |

## Receive text messages

#### Receiving process

After receiving the `onMessage` callback, determine the message type from `type`. For a text message, the content is in `message.body.content`. Read business extension fields from `message.ext` as needed.

Example code:

```typescript
client.chatManager.addEventHandler('message-listener', {
  onMessage: message => {
    if (message.type === 'text') {
      console.log('Text content:', message.body.content);
      console.log('Extension fields:', message.ext);
    }
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `content` | String | Required | Regular chats, notification content, and explanatory text | Core text message content. |

## Receive image messages

An image message generally contains three types of image resources:

- Original image: The original image file selected locally by the sender. It is generally used to view or save the original image.
- Large image: An image proportionally compressed by the server from the original image. If the shorter side is greater than 720 pixels, the image is proportionally compressed so that the shorter side is 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained and the image is not enlarged. This image is generally displayed on the chat details page.
- Thumbnail: An image proportionally compressed by the server from the original image. By default, if the shorter side is greater than 170 pixels, the image is proportionally compressed so that the shorter side is 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained and the image is not enlarged. Configure the thumbnail compression method and dimensions in the [EasyIM Console](/product/console/basic_message_conversation.html#image-message-thumbnails). Thumbnails are generally used for lightweight display in conversation lists, chat lists, and similar interfaces.

#### Receiving process

To receive an image message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive image messages.
3. To download the original image file, call `client.chatManager.downloadAttachment({ message })`.
4. To use the large image or thumbnail, display `bigImageUrl` or `thumbnailUrl` directly, or download it in your app.

Example code:

```typescript
client.chatManager.addEventHandler('image-message-listener', {
  // Receive an image message.
  onMessage: message => {
    // Check whether this is an image message.
    if (message.type !== 'image') {
      return;
    }

    // Thumbnail URL, suitable for display in a conversation list or chat list.
    console.log('Thumbnail URL:', message.body.thumbnailUrl);
    // Large image URL, suitable for display on a chat details page.
    console.log('Large image URL:', message.body.bigImageUrl);
    // Original image URL, suitable for viewing or saving the original image.
    console.log('Original image URL:', message.body.originalImageUrl);
    // Image width and height.
    console.log('Image dimensions:', message.body.width, message.body.height);
    // Whether this is a GIF image.
    console.log('Is GIF:', message.body.isGif);
  },
});
```

#### Download the original image, large image, and thumbnail

After receiving an image message, obtain image resources in different sizes as follows:

1. Generally, display the thumbnail directly from `message.body.thumbnailUrl`.
2. Generally, display the large image directly from `message.body.bigImageUrl`.
3. Generally, display or save the original image directly from `message.body.originalImageUrl`.
4. To download the original image binary data, call `client.chatManager.downloadAttachment({ message })`.

```typescript
client.chatManager.addEventHandler('image-download-listener', {
  // Receive an image message.
  onMessage: async message => {
    // Check whether this is an image message.
    if (message.type !== 'image') {
      return;
    }

    // Read the thumbnail URL.
    const thumbnailUrl = message.body.thumbnailUrl;
    // Read the large image URL.
    const bigImageUrl = message.body.bigImageUrl;
    // Read the original image URL.
    const originalImageUrl = message.body.originalImageUrl;

    console.log('Thumbnail URL:', thumbnailUrl);
    console.log('Large image URL:', bigImageUrl);
    console.log('Original image URL:', originalImageUrl);

    // Download the original image attachment.
    const attachment = await client.chatManager.downloadAttachment({ message });

    console.log('Downloaded filename:', attachment.filename);
    console.log('Download URL:', attachment.downloadUrl);
    console.log('Original image binary data:', attachment.data);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `thumbnailUrl` | String | Optional | Conversation list and chat list | Thumbnail URL. |
| `bigImageUrl` | String | Optional | Chat details preview | Large image URL. |
| `originalImageUrl` | String | Optional | View or save the original image | Original image URL. |
| `width` | Number | Optional | Pre-layout and preview display | Image width. |
| `height` | Number | Optional | Pre-layout and preview display | Image height. |
| `isGif` | Boolean | Required | Identify animated GIF images | Whether the current image is a GIF. |
| `isOriginalImage` | Boolean | Required | Determine original-image semantics | Whether the sender sent the image as an original image. |
| `secret` | String | Optional | Download private attachments | Download authentication key. |
| `fileLength` | Number | Optional | Display file size | Image file size in bytes. |

## Receive GIF image messages

A GIF image message is still an image message and is processed through `onMessage`.

#### Receiving process

To receive a GIF image message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive GIF image messages.

Example code:

```typescript
client.chatManager.addEventHandler('gif-message-listener', {
  // Receive a GIF message.
  onMessage: message => {
    // Process only image messages.
    if (message.type !== 'image') {
      return;
    }

    // Check whether this is a GIF image.
    if (message.body.isGif !== true) {
      return;
    }

    // Read the GIF image resource URLs.
    console.log('GIF thumbnail:', message.body.thumbnailUrl);
    console.log('Original GIF:', message.body.originalImageUrl);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `isGif` | Boolean | Required | Identify animated GIF images | `true` indicates that the current image is a GIF. |
| `thumbnailUrl` | String | Optional | List preview | GIF thumbnail URL. |
| `originalImageUrl` | String | Optional | Original image display | Original GIF URL. |

## Receive voice messages

#### Receiving process

To receive a voice message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive voice messages.
3. To obtain the voice file, call `client.chatManager.downloadAttachment({ message })`.

Example code:

```typescript
client.chatManager.addEventHandler('voice-message-listener', {
  // Receive a voice message.
  onMessage: async message => {
    // Check whether this is a voice message.
    if (message.type !== 'voice') {
      return;
    }

    // Read the voice URL.
    console.log('Voice message URL:', message.body.url);
    // Read the voice duration.
    console.log('Voice message duration:', message.body.duration);
    // Read the voice filename.
    console.log('Filename:', message.body.filename);

    // Download the voice attachment.
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('Download URL:', attachment.downloadUrl);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | Optional | Online playback and download | Voice resource URL. |
| `duration` | Number | Required | Display voice playback duration | Voice duration in seconds. |
| `filename` | String | Optional | Display filename | Voice filename. |
| `filetype` | String | Optional | Identify type | Voice file MIME type. |
| `fileLength` | Number | Optional | Display file size | Voice file size in bytes. |
| `secret` | String | Optional | Download private attachments | Download authentication key. |

## Receive video messages

Video messages are used for short videos, screen recordings, and similar content. They generally contain both a video URL and a video thumbnail URL.

#### Receiving process

To receive a video message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive video messages.
3. To obtain the video file, call `client.chatManager.downloadAttachment({ message })`.

Example code:

```typescript
client.chatManager.addEventHandler('video-message-listener', {
  // Receive a video message.
  onMessage: async message => {
    // Check whether this is a video message.
    if (message.type !== 'video') {
      return;
    }

    // Read the video URL.
    console.log('Video URL:', message.body.url);
    // Read the video thumbnail URL.
    console.log('Thumbnail URL:', message.body.thumbnailUrl);
    // Read the video duration.
    console.log('Video duration:', message.body.duration);
    // Read the video dimensions.
    console.log('Video dimensions:', message.body.width, message.body.height);

    // Download the video attachment.
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('Download URL:', attachment.downloadUrl);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | Optional | Video playback and download | Video resource URL. |
| `thumbnailUrl` | String | Optional | List preview and cover display | Video thumbnail URL. |
| `duration` | Number | Required | Display duration | Video duration in seconds. |
| `width` | Number | Optional | Player layout | Video width. |
| `height` | Number | Optional | Player layout | Video height. |
| `filename` | String | Optional | Display filename | Video filename. |
| `fileLength` | Number | Optional | Display file size | Video file size in bytes. |
| `secret` | String | Optional | Download private attachments | Download authentication key. |

## Receive file messages

File messages are used to transfer documents, archives, spreadsheets, and other general files.

#### Receiving process

To receive a file message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive file messages.
3. To obtain the file, call `client.chatManager.downloadAttachment({ message })`.

Example code:

```typescript
client.chatManager.addEventHandler('file-message-listener', {
  // Receive a file message.
  onMessage: async message => {
    // Check whether this is a file message.
    if (message.type !== 'file') {
      return;
    }

    // Read the file URL.
    console.log('File URL:', message.body.url);
    // Read the filename.
    console.log('Filename:', message.body.filename);
    // Read the file type.
    console.log('File type:', message.body.filetype);
    // Read the file size.
    console.log('File size:', message.body.fileSize ?? message.body.fileLength);

    // Download the file attachment.
    const attachment = await client.chatManager.downloadAttachment({ message });
    console.log('Download URL:', attachment.downloadUrl);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `url` | String | Optional | Download file | File resource URL. |
| `filename` | String | Optional | Display file | Filename. |
| `filetype` | String | Optional | Identify type | File MIME type. |
| `fileSize` | Number | Optional | Display file size | File size. |
| `fileLength` | Number | Optional | Server compatibility field | File size in bytes. |
| `secret` | String | Optional | Download private attachments | Download authentication key. |

## Receive location messages

Location messages contain geographical information, generally including latitude, longitude, and a location description.

#### Receiving process

To receive a location message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive location messages. Render the location with a third-party map service or location display component.

Example code:

```typescript
client.chatManager.addEventHandler('location-message-listener', {
  // Receive a location message.
  onMessage: message => {
    // Check whether this is a location message.
    if (message.type !== 'location') {
      return;
    }

    // Read the latitude and longitude.
    console.log('Latitude:', message.body.latitude);
    console.log('Longitude:', message.body.longitude);
    // Read the address description.
    console.log('Address description:', message.body.address);
    // Read the building name.
    console.log('Building name:', message.body.buildingName);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `latitude` | Number | Required | Map location | Latitude. |
| `longitude` | Number | Required | Map location | Longitude. |
| `address` | String | Optional | Display address | Location description. |
| `buildingName` | String | Optional | Display place name | Building name. |

## Receive command messages

Command messages notify the recipient to perform a business action and are generally not displayed directly as regular chat content.

`action` is the action name of the command message and cannot be empty. Use a custom, semantically clear string. To avoid conflicts with internal SDK or server action names, avoid prefixes that may have internal meanings, such as `em_` and `easemob::`.

#### Receiving process

To receive a command message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive command messages.

Example code:

```typescript
client.chatManager.addEventHandler('cmd-message-listener', {
  // Receive a command message.
  onMessage: message => {
    // Check whether this is a command message.
    if (message.type !== 'cmd') {
      return;
    }

    // Read the command action.
    console.log('Command action:', message.body.action);
    // Read the command parameters.
    console.log('Command parameters:', message.body.params);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `action` | String | Required | Business command dispatch | Command action of the command message. |
| `params` | `Record<string, String>` | Optional | Protocol-compatible reading | Command parameters. Currently used primarily for receiving or protocol compatibility. |

## Receive custom messages

Custom messages are suitable for business events such as gifts, orders, cards, and interactive actions.

#### Receiving process

To receive a custom message:

1. [Call `addEventHandler` to register a message event listener](#monitor-message-events).
2. Monitor the `onMessage` callback to receive custom messages. Perform the corresponding UI rendering or business logic based on the event name and parameters.

Example code:

```typescript
client.chatManager.addEventHandler('custom-message-listener', {
  // Receive a custom message.
  onMessage: message => {
    // Check whether this is a custom message.
    if (message.type !== 'custom') {
      return;
    }

    // Read the custom event name.
    console.log('Event name:', message.body.event);
    // Read the custom parameters.
    console.log('Business parameters:', message.body.params);
  },
});
```

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `event` | String | Required | Business event dispatch | Custom message event name. |
| `params` | `Record<string, String>` | Optional | Read business parameters | Custom business parameters. |

## Receive combined messages

Combined messages are used to forward chat history or package and forward multiple messages. The recipient receives an outer combined message. To view the original messages it contains, download and parse the combined message details.

#### Receiving process

Receive a combined message in the same way as a regular message. In the `onMessage` callback, identify it using `message.type === 'combine'`.

A combined message contains a title, summary, compatibility text, and combined-message attachment information. After receiving one, read `title`, `summary`, and `compatibleText` directly from the message body. To retrieve the list of original messages in it, call `downloadAndParseCombineMessage` to download and parse the combined-message attachment. On the first call, the SDK downloads and parses the attachment based on its information in the combined message and returns the original message list. On subsequent calls, if the attachment data is available, the SDK can parse it directly and return the original message list.

:::tip
SDK versions that do not support combined forwarded messages display the compatibility text. When the current SDK receives a combined message, `message.body` does not contain the `compatibleText` field.
:::

Example code:

```typescript
client.chatManager.addEventHandler('combine-message-listener', {
  // Receive a combined message.
  onMessage: async message => {
    // Check whether this is a combined message.
    if (message.type !== 'combine') {
      return;
    }

    // Read the combined message title.
    console.log('Title:', message.body.title);
    // Read the combined message summary.
    console.log('Summary:', message.body.summary);
    // Read the compatibility text.
    console.log('Compatibility text:', message.body.compatibleText);

    // Download and parse the original child message list.
    const subMessages = await client.chatManager.downloadAndParseCombineMessage({
      message,
    });

    console.log('Submessage list:', subMessages);
  },
});
```

Alternatively, pass the minimum download parameters from the combined message body:

```typescript
const subMessages = await client.chatManager.downloadAndParseCombineMessage({
  url: combineMessage.body.url!,
  secret: combineMessage.body.secret,
});
```

`downloadAndParseCombineMessage()` supports two parameter forms: `{ message }` and `{ url, secret }`.

#### Key fields

| Field | Type | Required/Optional | Use case | Description |
| :--- | :--- | :--- | :--- | :--- |
| `title` | String | Required | Overview display | Combined message title. |
| `summary` | String | Required | Overview display | Combined message summary. Use it only for an overview. To display the original chat history, call `downloadAndParseCombineMessage()`. |
| `compatibleText` | String | Required | Compatibility display | Compatibility text displayed when complete combined-message rendering is not supported. |
| `url` | String | Optional | Download details | Download URL for combined message details. |
| `secret` | String | Optional | Download authentication | Download key for combined message details. |
| `messageList` | `ReadonlyArray<Message>` | Optional | Display parsed details | May appear only when sending a message or after parsing its details. |
| `combineLevel` | Number | Required | Determine nesting level | Current combined message nesting level. |

## Offline message synchronization events

Offline message synchronization events are `ChatClient`-level events. Monitor them through `client.addEventHandler()`, not `chatManager.addEventHandler()`.

#### Monitoring process

To monitor offline message synchronization events:

1. Call `client.addEventHandler()` to register a `ChatClient`-level event handler.
2. Monitor `onOfflineMessageSyncStart` to detect the start of offline message synchronization.
3. Monitor `onOfflineMessageSyncFinish` to detect the completion of offline message synchronization.
4. In the message-processing logic, use `message.isOnline` to determine whether the current message is an online message.

#### Example code

```typescript
client.addEventHandler('offline-sync', {
  // Triggered when offline message synchronization starts.
  onOfflineMessageSyncStart: () => {
    console.log('Offline message synchronization started');
  },
  // Triggered when offline message synchronization completes.
  onOfflineMessageSyncFinish: () => {
    console.log('Offline message synchronization completed');
  },
});
```

To further distinguish the message source, check `isOnline` when processing the message:

```typescript
client.chatManager.addEventHandler('online-flag-listener', {
  // Receive a regular message.
  onMessage: message => {
    // Check whether the current message was obtained through offline synchronization.
    if (message.isOnline === false) {
      console.log('Offline message received:', message.msgServerId);
      return;
    }

    console.log('Online message received:', message.msgServerId);
  },
});
```

:::tip
- The first parameter of `addEventHandler` is an event handler ID, not a fixed event name. Therefore, `'offline-sync'` in the example can be replaced with any unique string.
- Chat room messages support only online delivery, not offline messages. One-to-one and group chats support both online messages and offline message synchronization.
:::

## More information

#### Determine whether a message is a chat room broadcast message

For a downstream chat room message, use `message.isBroadcast` to determine whether it is a chat room broadcast message sent through the REST API.

```typescript
client.chatManager.addEventHandler('chatroom-broadcast-listener', {
  // Receive a regular message.
  onMessage: message => {
    // Check whether this is a chat room broadcast message.
    if (message.conversationType === 'chatRoom' && message.isBroadcast) {
      console.log('Chat room broadcast message received:', message.msgServerId);
    }
  },
});
```

#### Message receipts

For information about implementing message delivery receipts and read receipts, see [Message Receipts](message_receipt.html).

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`downloadAttachment`](#receive-image-messages) | `ChatManager` | Downloads the binary data of image, voice, video, file, and other attachment messages. |
| [`downloadAndParseCombineMessage`](#receive-combined-messages) | `ChatManager` | Downloads and parses the original message list in a combined message. |
