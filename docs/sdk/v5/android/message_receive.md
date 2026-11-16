# Receive Messages

## Feature overview

The EasyIM Android SDK receives text, image, voice, video, file, location, command, custom, combined, and other message types through `EMMessageListener`. In a message listener callback, your app identifies the message type, reads the corresponding message body, and displays or processes the message as required. Starting from SDK 5.2.1, you can also receive and display [multi-body messages](#receive-multi-body-messages) through the complete body list.

## Prerequisite

Before you begin, ensure that the following requirements are met:

- Initialize the SDK. See [Initialization](initialization.html).
- Understand the EasyIM usage restrictions. See [Limitations](/product/limitation.html).

## Monitor message events

Call `EMChatManager#addMessageListener` to register `EMMessageListener`. `onMessageReceived` is triggered when a regular message is received. When a command message is received, `onCmdMessageReceived` is also triggered.

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        // Process text, attachment, location, custom, and combined messages.
    }

    @Override
    public void onCmdMessageReceived(List<EMMessage> messages) {
        // Process command messages.
    }
};

EMClient.getInstance().chatManager().addMessageListener(messageListener);
// Remove the listener when it is no longer used.
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

## Common message information

After receiving a message, use the following `EMMessage` methods to read common message information:

| Field or attribute | Retrieval method | Description |
| :--- | :--- | :--- |
| Message ID | `EMMessage#getMsgId` | The unique message ID. |
| Sender | `EMMessage#getFrom` | The message sender's user ID. |
| Recipient | `EMMessage#getTo` | The message target ID. |
| Conversation type | `EMMessage#getChatType` | One-to-one chat, group chat, or chat room. |
| Message type | `EMMessage#getType` / `getContentType` | Returns the specific type for single-body messages, or `EMMessage.Type.MULTIBODY` for multi-body messages. |
| First body | `EMMessage#getBody` | Returns the first body. Using only this method for multi-body messages misses subsequent bodies. |
| Complete body list | `EMMessage#getBodies` | Returns an ordered body list with a read-only structure, for both single-body and multi-body messages. |
| Extension | `EMMessage#getStringAttribute`, etc. | Read business fields set by the sender through `setAttribute`. |

## Receive text messages

After receiving `onMessageReceived`, iterate through the message list. For a text message, cast the message body to `EMTextMessageBody` and call `getMessage()` to retrieve the text. To read business extensions, call `EMMessage#getExt()` to retrieve the extension map.

Example code:

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        for (EMMessage message : messages) {
            if (message.getType() != EMMessage.Type.TXT) {
                continue;
            }

            // Retrieve the text message content.
            EMTextMessageBody textBody =
                    (EMTextMessageBody) message.getBody();
            String text = textBody.getMessage();

            // Read the message extension by business field name.
            // Return the default value null if the field does not exist.
            String businessValue = message.getStringAttribute(
                    "businessKey",
                    null);

            EMLog.d(
                    "Message",
                    "text: " + text
                            + ", businessValue: " + businessValue);
        }
    }

    // Implement other callbacks as required.
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);
```

## Receive attachment messages

In addition to text messages, the SDK supports attachment messages, including voice, image, video, and file messages.

The process for receiving an attachment message is as follows:

1. Receive the attachment message. The SDK automatically downloads voice messages and, by default, image and video thumbnails. To download the original image, large image, video, or file, call the corresponding download API.
2. Retrieve the server URL and local path of the attachment.

#### Attachment download APIs and callbacks

Call the following `EMChatManager` download APIs for the required resource, and obtain progress and results through `EMCallBack`.

| API | Main purpose | Progress callback |
| :--- | :--- | :--- |
| `downloadAttachment(message, callback)` | Downloads original attachments such as images, voice, video, or files. | `onProgress` reports download progress from 0–100. |
| `downloadBigImage(message, callback)` | Downloads large images. | `onProgress` reports download progress from 0–100. |
| `downloadThumbnail(message, callback)` | Downloads image or video thumbnails. | Does not trigger `onProgress`. |

Each request returns one final result through `onSuccess()` or `onError(int code, String error)`. After success, read the resource's local path and download status from the body to update its display.

Starting from SDK 5.2.1, these APIs also accept a whole multi-body message, without separate calls for each body. For body selection, message-level progress, and overall results, see [Download multi-body message attachments](#download-multi-body-message-attachments).

### Receive voice messages

1. When the recipient receives a voice message, the voice file is downloaded automatically.
2. After receiving the [onMessageReceived callback](#receive-text-messages), call `getRemoteUrl` or `getLocalUri` to retrieve the server URL or local path of the voice file.

```java
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) message.getBody();
// Retrieve the voice file URL on the server.
String voiceRemoteUrl = voiceBody.getRemoteUrl();
// Local voice file resource path.
Uri voiceLocalUri = voiceBody.getLocalUri();
```

### Receive image messages

An image message typically contains three image resources:

- Original image: The original image file selected locally by the sender, typically used for viewing or saving the original image.
- Large image: An image proportionally compressed from the original and uploaded by the SDK client. If the shorter side is greater than 720 pixels, it is proportionally compressed to 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained without upscaling. This image is typically displayed on the chat details page.
- Thumbnail: An image proportionally compressed by the server from the original. By default, if the shorter side is greater than 170 pixels, it is proportionally compressed to 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained without upscaling. You can configure the thumbnail compression method and dimensions in the [EasyIM Console](/product/console/basic_message_conversation.html#image-message-thumbnails). Thumbnails are typically used for lightweight displays such as conversation and chat lists.


After receiving an image message, the SDK automatically downloads the thumbnail according to the configuration. To display a clearer image, download the large or original image as required.

The process for receiving an image message is as follows:

1. When an image message is received, the SDK determines whether to automatically download the thumbnail according to the configuration:

- Automatic downloading is enabled by default with `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(true)`.
- If automatic downloading is disabled with `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`, call `EMClient.getInstance().chatManager().downloadThumbnail(message, callback)` to download the thumbnail manually.

2. After receiving an image message, the recipient can process it in `onMessageReceived` and download the original or large image as required.

- Call `downloadAttachment(message, callback)` to download the original image.
- Call `downloadBigImage(message, callback)` to download the large image.

If the corresponding local resource path exists, reuse the local file to avoid duplicate downloads.

Example code:

```java
@Override
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == EMMessage.Type.IMAGE) {
            EMCallBack callback = new EMCallBack() {
               @Override
               public void onSuccess() {
                   // The attachment was downloaded successfully.
               }

               @Override
               public void onError(int code, String error) {
                   // Failed to download the attachment.
               }

               @Override
               public void onProgress(int progress, String status) {
                   // Attachment download progress.
               }
           };
           // Download the original image.
           EMClient.getInstance().chatManager().downloadAttachment(message, callback);
           // Download the large image.
           EMClient.getInstance().chatManager().downloadBigImage(message, callback);
        }
    }
}
```

3. Use `EMImageMessageBody` to retrieve the server URL or local path of the original image, large image, and thumbnail:

```java
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
// Retrieve the original image from the server.
String imgRemoteUrl = imgBody.getRemoteUrl();
// Retrieve the large image from the server.
String bigImgRemoteUrl = imgBody.getBigImageRemoteUrl();
// Retrieve the image thumbnail from the server.
String thumbnailUrl = imgBody.getThumbnailUrl();
// Retrieve the original image locally.
Uri imgLocalUri = imgBody.getLocalUri();
// Retrieve the large image locally.
Uri bigImgLocalUri = imgBody.getBigImageLocalUri();
// Retrieve the image thumbnail locally.
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
```

The SDK also provides the following methods for determining the image resource state:

- `isOriginalImage()`: Determine whether the current message corresponds to the original image or the large image compressed by the sender.
- `getBigImageDownloadStatus()`: Retrieve the large image download state.
- `getWidth()` / `getHeight()`: Retrieve the image width and height.

### Receive GIF image messages

Downloading a GIF thumbnail is the same as downloading a regular image message thumbnail. See [Receive image messages](#receive-image-messages).

As with a regular message, the recipient receives `onMessageReceived` for a GIF image message. After determining that it is an image message, read the message body's `isGif` attribute. If `isGif()` returns `true`, it is a GIF image message. If it returns `false`, it is a regular image message.

```java
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == EMMessage.Type.IMAGE) {
            EMImageMessageBody body = (EMImageMessageBody) message.getBody();
            if(body.isGif()) {
                // Process the GIF message according to your business requirements, such as downloading and displaying it.
            }
        }
    }
    
}
```

### Receive video messages

After receiving a video message, your app typically displays the video thumbnail in the chat UI first and downloads or plays the original video file after the user taps the message.

The process for receiving a video message is as follows:

1. When the recipient receives a video message, the SDK determines whether to automatically download the video thumbnail according to the configuration.

   The video thumbnail download policy is the same as that for image thumbnails. By default, the SDK automatically downloads thumbnails. If automatic downloading is disabled, your business logic must download them manually. See [Configure automatic image thumbnail downloading](#receive-image-messages).

2. The SDK passes the video message to the recipient through `onMessageReceived`. The recipient can use the thumbnail or further download the original video file as required.

   - To display only a preview in the conversation list or chat UI, use the thumbnail first.
   - To play the video, call `EMClient.getInstance().chatManager().downloadAttachment(message, callback)` to download the original video file.

3. To avoid duplicate downloads, first check whether the corresponding local video file or thumbnail exists. If a local resource is available, reuse it.

```java
/**
 * Download the video file.
 */
private void downloadVideo(final EMMessage message) {
    EMCallBack callback = new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onProgress(final int progress,String status) {
        }

        @Override
        public void onError(final int error, String msg) {
        }
    };
    // Download the attachment.
    EMClient.getInstance().chatManager().downloadAttachment(message, callback);
}
```

4. Use `EMVideoMessageBody` to retrieve the server URL or local path of the original video file and thumbnail. The thumbnail is suitable for previews, while the original video file is suitable for playback or download and storage.

```java
EMVideoMessageBody videoBody =
        (EMVideoMessageBody) message.getBody();
// Retrieve the video file from the server.
String videoRemoteUrl = videoBody.getRemoteUrl();
// Retrieve the video thumbnail file from the server.
String thumbnailUrl = videoBody.getThumbnailUrl();
// Retrieve the video file locally.
Uri localUri = videoBody.getLocalUri();
// Retrieve the video thumbnail file locally.
Uri localThumbUri = videoBody.getLocalThumbUri();
```

### Receive file messages

The process for receiving a file message is as follows:

1. After receiving the [onMessageReceived callback](#receive-text-messages), the recipient calls `downloadAttachment(message, callback)` to download the file.

```java
/**
 * Download the file.
 */
private void downloadFile(final EMMessage message) {
    EMCallBack callback = new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onProgress(final int progress,String status) {
        }

        @Override
        public void onError(final int error, String msg) {
        }
    };
    // Download the attachment.
    EMClient.getInstance().chatManager().downloadAttachment(message, callback);
}
```

2. Call the following methods to retrieve the file attachment from the server or locally:

```java
EMNormalFileMessageBody fileMessageBody = (EMNormalFileMessageBody) message.getBody();
// Retrieve the file from the server.
String fileRemoteUrl = fileMessageBody.getRemoteUrl();
// Retrieve the file locally.
Uri fileLocalUri = fileMessageBody.getLocalUri();
```

## Receive location messages

Receiving a location message is the same as receiving a text message. See [Receive text messages](#receive-text-messages).

When receiving a location message, the recipient must use a third-party map service to display the location based on its latitude and longitude.

Cast the message body to `EMLocationMessageBody` and call `getLatitude()`, `getLongitude()`, and `getAddress()` to retrieve the location coordinates and address.

```java
EMLocationMessageBody locationBody =
        (EMLocationMessageBody) message.getBody();
double latitude = locationBody.getLatitude();
double longitude = locationBody.getLongitude();
String address = locationBody.getAddress();
```

## Receive command messages

A command message can be considered an instruction sent to the peer to notify it of an operation to perform. The recipient can customize how the message is processed.

Customize the specific behavior according to your business requirements. Actions beginning with `em_` or `easemob::` are reserved internal fields and must not be used.

:::tip
- A command message cannot be recalled after it is sent.
- Command messages are not stored in the local database and do not create local conversations, so they are usually not displayed in the UI.
:::

The recipient receives command messages through both `onMessageReceived` and `onCmdMessageReceived` for different processing. Command messages are typically received through `onCmdMessageReceived`.

```java
EMMessageListener msgListener = new EMMessageListener(){
  // A message is received.
  @Override
  public void onMessageReceived(List<EMMessage> messages) {
  }
  // A command message is received.
  @Override
  public void onCmdMessageReceived(List<EMMessage> messages) {
  }
}
```

Cast the message body to `EMCmdMessageBody` and call `action()` to retrieve the command action. To pass structured parameters, define a business protocol in the command content or use a custom message instead.

## Receive custom messages

You can define message types for business processing by first setting a message type name and then adding various custom messages.

Receiving a custom message is the same as receiving other message types. Your app determines the message type and reads the body in `onMessageReceived`.

Cast the message body to `EMCustomMessageBody`, call `event()` to retrieve the custom event, and call `getParams()` to retrieve the custom parameters.

```java
EMCustomMessageBody customBody =
        (EMCustomMessageBody) message.getBody();
String event = customBody.event();
Map<String, String> params = customBody.getParams();
```

## Receive combined messages

Receiving a combined message is the same as receiving a regular message. Your app identifies messages of the `EMMessage.Type.COMBINE` type in `onMessageReceived`.

- In SDK versions that do not support combined messages, the message is parsed as a text message whose content is the value of `compatibleText`. Other fields are ignored.
- A combined message is an attachment message. After receiving it, call `EMChatManager#downloadAndParseCombineMessage` to download and parse the combined message attachment and retrieve the original message list:
- On the first call to this method, the SDK downloads and parses the combined message attachment and returns the original message list through the callback.
- On subsequent calls:
  - If the combined message attachment exists, the SDK directly parses it and returns the original message list.
  - If the combined message attachment does not exist, the SDK downloads it first, parses it, and returns the original message list.

After casting the message body to `EMCombineMessageBody`, you can read the combined message title, summary, and compatibility text.

```java
EMClient.getInstance().chatManager().downloadAndParseCombineMessage(combineMessage, new EMValueCallBack<List<EMMessage>>() {
    @Override
    public void onSuccess(List<EMMessage> value) {
        // Process and display the message list.
    }

    @Override
    public void onError(int error, String errorMsg) {
        // Process the error information.
    }
});
```

## Receive multi-body messages

Starting from SDK 5.2.1, multi-body messages use the existing `EMMessageListener#onMessageReceived` callback. No additional listener is required. For registration, see [Monitor message events](#monitor-message-events).

First use `getContentType()` or `getType()` to determine whether the whole message is `EMMessage.Type.MULTIBODY`, then obtain the complete ordered list with `getBodies()`, and read content based on each body's actual subclass. The whole message's `MULTIBODY` type indicates multiple bodies; it does not mean that each body in the list has a multi-body type.

`getBody()` remains available but returns only the first body. If existing logic handles only whole-message types such as `TXT` and `IMAGE`, add a `MULTIBODY` branch to avoid missing the whole multi-body message or subsequent bodies.

This text-and-image example shows how to identify the type and process content in body order:

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        for (EMMessage message : messages) {
            if (message.getContentType() != EMMessage.Type.MULTIBODY) {
                // Process single-body messages with the existing logic.
                continue;
            }
            for (EMMessageBody body : message.getBodies()) {
                if (body instanceof EMTextMessageBody) {
                    String text = ((EMTextMessageBody) body).getMessage();
                    // Add the text to the current message display.
                } else if (body instanceof EMImageMessageBody) {
                    EMImageMessageBody imageBody = (EMImageMessageBody) body;
                    // Add the image at the current position. Download its attachment as needed, then update the display.
                } else {
                    // Handle video, voice, file, location, or custom bodies by their actual subclass.
                }
            }
        }
    }
};
EMClient.getInstance().chatManager().addMessageListener(messageListener);
```

For other body fields and display methods, see [video](#receive-video-messages), [voice](#receive-voice-messages), [file](#receive-file-messages), [location](#receive-location-messages), and [custom messages](#receive-custom-messages). When reusing these examples, read the current `body` in the iteration rather than calling `message.getBody()` again to obtain the first body.

#### Download multi-body message attachments

Pass the whole `EMMessage` to the download API. You do not need to request each body separately. For API purposes and basic callbacks, see [Attachment download APIs and callbacks](#attachment-download-apis-and-callbacks).

The SDK selects bodies in multi-body messages according to these rules:

| Body type | Original file download | Large image download | Thumbnail download |
| :--- | :--- | :--- | :--- |
| Image | Original image | Large image | Image thumbnail |
| Video | Original video | Skip | Video thumbnail |
| Voice | Original voice file | Original voice file | Original voice file |
| File | Original file | Skip | Skip |
| Text, location, custom | Skip | Skip | Skip |

Inapplicable bodies are skipped automatically. They are neither counted as failures nor included in progress calculations. If no bodies in the whole message are applicable, `onSuccess()` is triggered without downloading anything. This rule does not mean that missing applicable attachments or download failures also return success.

Original file and large image downloads report message-level overall progress through `onProgress(int progress, String status)`, weighted by each attachment's original file size, from 0–100. Individual attachment progress is not reported separately. Thumbnail downloads do not trigger progress callbacks. Each request returns one final result: `onSuccess()` after all applicable attachments download successfully, or `onError(int code, String error)` if any applicable attachment fails, stopping remaining downloads.

The following example downloads the original attachments in a multi-body message:

```java
EMCallBack downloadCallback = new EMCallBack() {
    @Override
    public void onSuccess() {
        // All applicable attachments in this request downloaded successfully. Update the display using local paths in the bodies.
    }

    @Override
    public void onError(int code, String error) {
        // This request failed. Remaining attachments will not be downloaded.
    }

    @Override
    public void onProgress(int progress, String status) {
        // Message-level overall progress for original file or large image downloads, from 0–100.
        // This callback is not triggered with downloadThumbnail.
    }
};
EMClient.getInstance().chatManager().downloadAttachment(message, downloadCallback);
```

After downloading, iterate through `message.getBodies()` again. Read `getLocalUri()` and the download status of each corresponding attachment body to update its display in the original message.

:::tip
The selection rules above apply only to multi-body messages. Single-body messages retain historical behavior: for example, `downloadBigImage` downloads the original video for a single video message. Unsupported resources or download types fail through `onError`, rather than succeeding as having no applicable bodies. We still recommend choosing the download API according to the actual resource type.
:::

#### Considerations

- **Sender content preparation**: The sender creates all bodies before assembling the message in reading order. The recipient displays them in the original `getBodies()` order. Add, remove, or replace bodies before sending, and keep local attachments requiring upload readable until sending completes. See [Send multi-body messages](message_send.html#send-multi-body-messages).
- **Attachment reuse and retries**: Retain server information for uploaded attachments as described in [Forward a single message](message_forward.html#forward-a-single-message) to avoid uploading again. Use the original message object to resend the same failed message. See [Resend failed messages](message_send.html#resend-failed-messages).
- **Body list and UI updates**: The list structure returned by `getBodies()` is read-only. The SDK may update attachment paths and download states in its bodies. Message receiving callbacks run on an SDK worker thread. Switch to the main thread before updating the Android UI, and avoid time-consuming synchronous operations in callbacks.
- **Conversation summaries**: After retrieving the last message with `EMConversation#getLastMessage()`, if its type is `MULTIBODY`, generate its summary from the complete body list to avoid displaying only the first body. See [Conversation List](conversation_list.html).
- **Forwarding**: Retain the complete ordered body list when forwarding a multi-body message, rather than copying only `getBody()`. See [Forward a single message](message_forward.html#forward-a-single-message).
- **Feature restrictions**: Multi-body messages do not support editing or translation. For creation and sending rules, see [Send multi-body messages](message_send.html#send-multi-body-messages).

## More

#### Return successfully sent messages through the message receipt callback

If `EMOptions#setIncludeSendMessageInMessageListener` is enabled during initialization, successfully sent messages are also returned through `onMessageReceived`.

#### Determine whether a message is a chat room broadcast message

For a chat room message, use the `EMMessage#isBroadcast` attribute to determine whether it is a [global chat room broadcast message sent through the REST API](/rest/broadcast_to_chatrooms.html).

#### Message attachment download authentication

EasyIM supports message attachment download authentication. This feature is disabled by default. To enable it, contact the EasyIM business manager. After it is enabled, users must call SDK download APIs such as `downloadAttachment(message, callback)` to download message attachments.

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`getContentType`](#receive-multi-body-messages) | `EMMessage` | Identifies multi-body messages, returning `MULTIBODY`. |
| [`getBodies`](#receive-multi-body-messages) | `EMMessage` | Retrieves the complete ordered body list. |
| [`downloadThumbnail`](#attachment-download-apis-and-callbacks) | `EMChatManager` | Downloads applicable thumbnails or original voice files, without progress callbacks. |
| [`downloadBigImage`](#attachment-download-apis-and-callbacks) | `EMChatManager` | Downloads applicable attachments such as large images, with message-level progress. |
| [`downloadAttachment`](#attachment-download-apis-and-callbacks) | `EMChatManager` | Downloads original attachments, with message-level progress. |
| [`downloadAndParseCombineMessage`](#receive-combined-messages) | `EMChatManager` | Download and parse a combined message. |
| [`thumbnailLocalUri`](#receive-image-messages) | `EMImageMessageBody` | Retrieve the local URI of an image thumbnail. |
