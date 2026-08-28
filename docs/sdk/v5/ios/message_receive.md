# Receive Messages

## Feature overview

The EasyIM iOS SDK receives text, image, voice, video, file, location, command, custom, combined, and other message types through `EMChatManagerDelegate`. In message delegate callbacks, the app identifies the message type, reads the corresponding message body, and displays or processes the message as required by the business.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Initialization](initialization.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Monitor message events

The app calls `addDelegate` to register a message delegate that implements `EMChatManagerDelegate`. `messagesDidReceive` is triggered when a regular message is received, and `cmdMessagesDidReceive` is triggered when a command message is received.

```objectivec
// Implement the message callbacks in EMChatManagerDelegate.
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    // Process text, attachment, location, custom, and combined messages.
}

- (void)cmdMessagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    // Process command messages.
}

// Register the message delegate.
[[EMClient sharedClient].chatManager addDelegate:self delegateQueue:nil];
// Remove the message delegate when it is no longer used.
[[EMClient sharedClient].chatManager removeDelegate:self];
```

## Common message information

After receiving a message, you can read common message information through the following `EMChatMessage` properties:

| Field or property | Description |
| :--- | :--- |
| `messageId` | The unique message ID. |
| `from` | The message sender's user ID. |
| `to` | The message target ID. |
| `chatType` | One-to-one chat, group chat, or chat room. |
| `body.type` | The message type, such as text, image, voice, video, or file. |
| `body` | Retrieve and cast the body to the corresponding `EMMessageBody` subclass. |
| `ext` | Read business extension fields set by the sender. |

## Receive text messages

After receiving the `messagesDidReceive` callback, iterate through the message list, cast the message body to `EMTextMessageBody`, and retrieve the text content through `text`. To read business extension fields, read `ext`.

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        if (message.body.type == EMMessageBodyTypeText) {
            // Cast the message body to a text message body.
            EMTextMessageBody *textBody = (EMTextMessageBody *)message.body;
            NSString *content = textBody.text;
            // Read an extension field set by the sender.
            NSString *value = message.ext[@"attribute"];
        }
    }
}
```

## Receive attachment messages

In addition to text messages, the SDK supports attachment messages, including voice, image, video, and file messages.

The process for receiving an attachment message is as follows:

1. Receive the attachment message. The SDK automatically downloads voice messages and, by default, image and video thumbnails. To download an original image, large image, video, or file, call the corresponding download API.
2. Retrieve the server URL and local path of the attachment.

### Receive voice messages

1. When the recipient receives a voice message, the voice file is downloaded automatically.

2. After receiving the [`messagesDidReceive`](#receive-text-messages) callback, the recipient calls `remotePath` or `localPath` to retrieve the server URL or local path of the voice file.

```objectivec
EMVoiceMessageBody *voiceBody = (EMVoiceMessageBody *)message.body;
// Retrieve the URL of the voice file on the server.
NSString *voiceRemotePath = voiceBody.remotePath;
// Local resource path of the voice file.
NSString *voiceLocalPath = voiceBody.localPath;
```

### Receive image messages

An image message typically contains three image resources:

- Original image: The original image file selected locally by the sender, typically used for viewing or saving the original image.
- Large image: An image proportionally compressed by the server from the original image. If the shorter side is greater than 720 pixels, the image is proportionally compressed until the shorter side is 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained without upscaling. This type of image is typically displayed on the chat details page.
- Thumbnail: An image proportionally compressed by the server from the original image. By default, if the shorter side is greater than 170 pixels, the image is proportionally compressed until the shorter side is 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained without upscaling. You can configure the thumbnail compression method and dimensions in the [EasyIM Console](/product/console/basic_message_conversation.html#image-message-thumbnails). This type of image is typically used for lightweight displays such as conversation lists and chat lists.

After receiving an image message, the SDK automatically downloads the thumbnail according to the configuration. If your business needs to display a clearer image, download the large or original image as required.

The process for receiving an image message is as follows:

1. When an image message is received, the SDK determines whether to automatically download the thumbnail according to the configuration:
   - Automatic downloading is enabled by default, which means `EMOptions#autoDownloadThumbnail` is `YES`.
   - If automatic downloading is disabled, which means `EMOptions#autoDownloadThumbnail` is `NO`, call `downloadMessageThumbnail` to download the thumbnail manually.
2. After receiving an image message, the recipient can process it in the `messagesDidReceive` callback and download the original or large image as required.
   - Call `downloadMessageAttachment` to download the original image.
   - Call `downloadBigImageAttachment` to download the large image.
 
If the corresponding local resource path already exists, reuse the local file to avoid duplicate downloads.

Example code:

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)messages {
    for (EMChatMessage *message in messages) {
        if (message.body.type != EMMessageBodyTypeImage) {
            continue;
        }

        // Download the original image.
        [[EMClient sharedClient].chatManager downloadMessageAttachment:message
                                                              progress:^(int progress) {
            // Original image download progress, ranging from 0 to 100.
        }
                                                            completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // The original image was downloaded successfully.
            } else {
                // Failed to download the original image.
            }
        }];

        // Download the large image.
        [[EMClient sharedClient].chatManager downloadBigImageAttachment:message
                                                               progress:^(int progress) {
            // Large image download progress, ranging from 0 to 100.
        }
                                                             completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // The large image was downloaded successfully.
            } else {
                // Failed to download the large image.
            }
        }];
    }
}
```

3. You can retrieve the server URLs or local paths of the original image, large image, and thumbnail through `EMImageMessageBody`:

```objectivec
EMImageMessageBody *imageBody = (EMImageMessageBody *)message.body;

// Retrieve the URLs of the original image, large image, and thumbnail from the server.
NSString *remotePath = imageBody.remotePath;
NSString *bigImageRemotePath = imageBody.bigImageRemotePath;
NSString *thumbnailRemotePath = imageBody.thumbnailRemotePath;

// Retrieve the local paths of the original image, large image, and thumbnail.
NSString *localPath = imageBody.localPath;
NSString *bigImageLocalPath = imageBody.bigImageLocalPath;
NSString *thumbnailLocalPath = imageBody.thumbnailLocalPath;

// Determine whether remotePath corresponds to the original image or the large image compressed by the sender.
BOOL isOriginalImage = imageBody.isOriginalImage;

// Retrieve the download state of the large image.
EMDownloadStatus bigImageDownloadStatus = imageBody.bigImageDownloadStatus;

// Retrieve the image width and height.
CGSize imageSize = imageBody.size;
```

### Receive GIF image messages

Downloading a GIF thumbnail is the same as downloading a regular image message thumbnail. See [Receive image messages](#receive-image-messages).

As with a regular message, the recipient receives the `messagesDidReceive` callback when receiving a GIF image message. After determining that the message is an image message, the recipient reads the message body's `isGif` property. If the value is `YES`, the message is a GIF image message.

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage*> *)aMessages
{
  // A message is received. Iterate through the message list.
  for (EMChatMessage *message in aMessages) {
    // Parse and display the message.
    if (message.body.type == EMMessageBodyTypeImage) {
        EMImageMessageBody *body = (EMImageMessageBody *)message.body;
        if (body.isGif) {
            // This is a GIF image message.
        }
      }
   }
}
```

### Receive video messages

After receiving a video message, the app typically displays the video thumbnail in the chat UI first. When the user taps the message, the app downloads or plays the original video file.

The process for receiving a video message is as follows:

1. When the recipient receives a video message, the SDK determines whether to automatically download the video thumbnail according to the configuration.

   The video thumbnail download policy is the same as that for image thumbnails. By default, the SDK automatically downloads thumbnails. If automatic downloading is disabled, your business logic must download them manually. See [Configure automatic image thumbnail downloading](#receive-image-messages).

2. The SDK passes the video message to the recipient through the [messagesDidReceive callback](#receive-text-messages). The recipient can use the thumbnail or further download the original video file according to business requirements.
   
   - To display only a preview in the conversation list or chat UI, use the thumbnail first.
   - If the user needs to play the video, call `downloadMessageAttachment` to download the original video file.

   To avoid duplicate downloads, first check whether the corresponding local video file or thumbnail exists. If a local resource is available, reuse it.

```typescript
// Download the video file.
[[EMClient sharedClient].chatManager downloadMessageAttachment:message
                                                      progress:^(int progress) {
    // Attachment download progress, ranging from 0 to 100.
}
                                                    completion:^(EMChatMessage *message, EMError *error) {
    if (!error) {
        EMFileMessageBody *body = (EMFileMessageBody *)message.body;
        // Retrieve the local path of the attachment after it is downloaded successfully.
        NSString *localPath = body.localPath;
    } else {
        // Failed to download the attachment.
    }
}];
``` 
3. Use `EMVideoMessageBody` to retrieve the server URLs or local paths of the original video file and thumbnail. The thumbnail is suitable for previews, while the original video file is suitable for playback or downloading and storage.

```objectivec
// After the message is sent successfully, retrieve the video message thumbnail and attachment.
EMVideoMessageBody *body = (EMVideoMessageBody *)message.body;
// Retrieve the URL of the video file from the server.
NSString *remotePath = body.remotePath;
// Retrieve the video thumbnail from the server.
NSString *thumbnailPath = body.thumbnailRemotePath;
// Retrieve the video file locally.
NSString *localPath = body.localPath;
// Retrieve the video thumbnail locally.
NSString *thumbnailLocalPath = body.thumbnailLocalPath;
```

### Receive file messages

The process for receiving a file message is as follows:
1. After receiving the [messagesDidReceive](#receive-text-messages) callback, the recipient calls `downloadMessageAttachment` to download the file.

```objectivec
[[EMClient sharedClient].chatManager downloadMessageAttachment:message progress:nil completion:^(EMChatMessage *message, EMError *error) {
            if (!error) {
                // The attachment was downloaded successfully.
            }
        }];
```

2. Call the following methods to retrieve the file attachment from the server or locally:

```objectivec
EMFileMessageBody *body = (EMFileMessageBody *)message.body;
// Retrieve the file path from the server.
NSString *remotePath = body.remotePath;
// Retrieve the file path locally.
NSString *localPath = body.localPath;
```

## Receive location messages

Receiving a location message is the same as receiving a text message. See [Receive text messages](#receive-text-messages).
   
When receiving a location message, the recipient needs to use a third-party map service to display the location on a map based on its latitude and longitude.

Cast the message body to `EMLocationMessageBody` and retrieve the location coordinates and address through `latitude`, `longitude`, and `address`.

```objectivec
EMLocationMessageBody *locationBody = (EMLocationMessageBody *)message.body;

// Retrieve the location coordinates and address.
double latitude = locationBody.latitude;
double longitude = locationBody.longitude;
NSString *address = locationBody.address;
```

## Receive command messages

A command message can be considered an instruction sent to the peer to notify it of an operation to perform. The recipient can customize how the message is processed.

Customize the specific behavior according to your business requirements. In addition, `action` values beginning with `em_` or `easemob::` are reserved internal fields and must not be used.

:::tip
- A command message cannot be recalled after it is sent.
- Command messages are not stored in the local database and therefore are not displayed in the UI.
:::

The recipient receives command messages through the `cmdMessagesDidReceive` callback and can process them as needed.

```objectivec
// A command message is received.
- (void)cmdMessagesDidReceive:(NSArray *)aCmdMessages{
  for (EMChatMessage *message in aCmdMessages) {
        EMCmdMessageBody *body = (EMCmdMessageBody *)message.body;
        // Parse the command message body.
    }
  }
```

Cast the message body to `EMCmdMessageBody` and retrieve the command action through `action`. To pass structured parameters, define a business protocol in the command content or use a custom message instead.

## Receive custom messages

You can customize message types for business processing by setting an event name when creating a custom message and carrying business data through extension fields.

Receiving a custom message is the same as receiving other regular messages. The app determines the message type and reads the message body in the `messagesDidReceive` callback. See [Receive text messages](#receive-text-messages).

Cast the message body to `EMCustomMessageBody`, retrieve the custom event through `event`, and retrieve custom parameters through `customExt`.

```objectivec
EMCustomMessageBody *customBody = (EMCustomMessageBody *)message.body;

// Retrieve the custom event name.
NSString *event = customBody.event;

// Retrieve the custom extension fields.
NSDictionary<NSString *, NSString *> *customExt = customBody.customExt;
```

## Receive combined messages

Receiving a combined message is the same as receiving a regular message. See [Receive messages](#receive-text-messages).

- In SDK versions that do not support combined messages, the message is parsed as a text message whose content is the value of `compatibleText`. Other fields are ignored.
- A combined message is an attachment message. After receiving it, you can call `downloadAndParseCombineMessage` to download the combined message attachment and parse the original message list.
- The first call to this method downloads and parses the combined message attachment and returns the original message list:
  - If the attachment exists, the method directly parses it and returns the original message list.
  - If the attachment does not exist, the method downloads it first, parses it, and returns the original message list.

After casting the message body to `EMCombineMessageBody`, you can read the combined message title, summary, and compatibility text.

```objectivec
- (void)messagesDidReceive:(NSArray<EMChatMessage *> *)aMessages
{

    for (EMChatMessage* msg in aMessages) {
        if (msg.body.type == EMMessageBodyTypeCombine) {
            // This is a combined message. Parse the combined message.
            [EMClient.sharedClient.chatManager downloadAndParseCombineMessage:msg completion:^(NSArray<EMChatMessage *> * _Nullable messages, EMError * _Nullable error) {

            }];
        }
    }
}
```

## More information

### Return successfully sent messages through the message receiving callback

If `EMOptions#includeSendMessageInMessageListener` is enabled during initialization, successfully sent messages are also returned through `messagesDidReceive`.

### Determine whether a message is a chat room broadcast message

For a chat room message, you can use the message's `EMChatMessage#broadcast` property to determine whether it is a [global chat room broadcast message sent through the REST API](/rest/broadcast_to_chatrooms.html).

### Message attachment download authentication

EasyIM supports message attachment download authentication. This feature is disabled by default. To enable it, contact the EasyIM business manager. After it is enabled, users must call the SDK API `downloadMessageAttachment` to download message attachments.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`addDelegate`](#receive-text-messages) | `IEMChatManager` | Register a message delegate. |
| [`removeDelegate`](#receive-text-messages) | `IEMChatManager` | Remove a message delegate. |
| [`downloadMessageThumbnail`](#receive-image-messages) | `IEMChatManager` | Download an image or video thumbnail. |
| [`downloadBigImageAttachment`](#receive-image-messages) | `IEMChatManager` | Download a large image. |
| [`downloadMessageAttachment`](#receive-attachment-messages) | `IEMChatManager` | Download an original image, video, or file attachment. |
| [`downloadAndParseCombineMessage`](#receive-combined-messages) | `IEMChatManager` | Download and parse a combined message. |
