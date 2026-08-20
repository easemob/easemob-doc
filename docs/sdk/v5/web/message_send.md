# Send Messages

## Feature overview

The EasyIM SDK supports sending text, image, voice, video, file, location, command, custom, and combined messages.

- `ChatManager` provides a unified message-sending feature. The standard process is to create a message object and then call `sendMessage` to send it.
- By default, users who are not friends can send one-to-one messages to each other. If your app allows one-to-one messages only between friends, [enable friend relationship checks](/product/console/basic_user.html#好友关系检查) in the Easemob Console.
- In a chat group or chat room, a user can send a message to only one group or chat room to which they belong at a time.

## Prerequisite

- Initialize the SDK. For details, see [Initialization](initialization.html).
- Register `ChatManager` during SDK initialization so that you can call conversation and message APIs through `client.chatManager`.
- Understand the EasyIM limitations. For details, see [Limitations](/product/limitation.html).

## Unified message sending process

The recommended process for sending a message is as follows:

1. Determine the message type, conversation ID, and conversation type.
2. Prepare the business data required for that message type, such as text content, a local file, remote URL, location coordinates, or a list of original messages to combine and forward.
3. Call `client.chatManager.create*Message()` to create a message object.
4. Call `client.chatManager.sendMessage(message, options?)` to send the message.
5. Monitor sending callbacks or the `Promise` result to update the UI, retry state, or upload progress.

The following example sends a text message:

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: "user2",
  // Use `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  content: "Hello!",
});

const sentMessage = await client.chatManager.sendMessage(message);
```

:::tip
- A successfully resolved `sendMessage` Promise indicates that the message has completed the SDK sending process.
- The recipient and the sender's other online devices receive the message through the `onMessage` event.
- For an attachment message, the attachment is uploaded before the message body is sent.
:::

## Cross-platform message examples

### Image and video message examples

The following examples apply to WeChat Mini Program, uni-app, Taro, and React Native. Text, location, command, custom, and other messages without local attachments use the same APIs on all platforms. Refer to the general `create*Message()` examples later in this document.

To send an image or video message, first obtain a local resource through the host framework's media selection API and convert it to an attachment object supported by the SDK:

- WeChat Mini Program, uni-app, and Taro Mini Program: `{ path, name?, type?, size? }`
- React Native: `{ uri, name?, type?, size? }`

The following examples assume that `client` has been initialized and logged in. They send one-to-one messages. To send a group or chat room message, change only `conversationId` and `conversationType`.

::: tabs#code

@tab WeChat Mini Program

```typescript
type MediaType = 'image' | 'video';

const chooseMedia = (mediaType: MediaType): Promise<WechatMiniprogram.MediaFile> =>
  new Promise((resolve, reject) => {
    wx.chooseMedia({
      count: 1,
      mediaType: [mediaType],
      sourceType: ['album', 'camera'],
      success: result => {
        const file = result.tempFiles[0];
        file ? resolve(file) : reject(new Error('未选择媒体文件'));
      },
      fail: reject,
    });
  });

// Send an image message.
const image = await chooseMedia('image');
const imageMessage = client.chatManager.createImageMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: image.tempFilePath,
    name: image.tempFilePath.split('/').pop() ?? 'image.jpg',
    type: 'image/jpeg',
    size: image.size,
  },
  width: image.width,
  height: image.height,
});
await client.chatManager.sendMessage(imageMessage);

// Send a video message.
const video = await chooseMedia('video');
const videoMessage = client.chatManager.createVideoMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: video.tempFilePath,
    name: video.tempFilePath.split('/').pop() ?? 'video.mp4',
    type: 'video/mp4',
    size: video.size,
  },
  duration: video.duration ?? 0,
  width: video.width,
  height: video.height,
});
await client.chatManager.sendMessage(videoMessage);
```

@tab uni-app

```typescript
const chooseImage = (): Promise<UniApp.ChooseImageSuccessCallbackResult> =>
  new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject,
    });
  });

const chooseVideo = (): Promise<UniApp.ChooseVideoSuccess> =>
  new Promise((resolve, reject) => {
    uni.chooseVideo({
      sourceType: ['album', 'camera'],
      success: resolve,
      fail: reject,
    });
  });

// Send an image message.
const imageResult = await chooseImage();
const image = imageResult.tempFiles?.[0];
const imagePath = image?.path ?? imageResult.tempFilePaths[0];
if (!imagePath) throw new Error('未选择图片');

// The uni-app demo also uses uni.getImageInfo() to obtain the image dimensions and actual format.
const imageInfo = await new Promise<{ width: number; height: number; type?: string }>(
  (resolve, reject) => {
    uni.getImageInfo({
      src: imagePath,
      success: resolve,
      fail: reject,
    });
  }
);

const imageMessage = client.chatManager.createImageMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: imagePath,
    name: imagePath.split('/').pop() ?? 'image.jpg',
    type: imageInfo.type ? `image/${imageInfo.type}` : undefined,
    size: image?.size,
  },
  width: imageInfo.width,
  height: imageInfo.height,
});
await client.chatManager.sendMessage(imageMessage);

// Send a video message.
const video = await chooseVideo();
const videoMessage = client.chatManager.createVideoMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: video.tempFilePath,
    name: video.name ?? video.tempFilePath.split('/').pop() ?? 'video.mp4',
    type: 'video/mp4',
    size: video.size,
  },
  duration: video.duration ?? 0,
  width: video.width,
  height: video.height,
});
await client.chatManager.sendMessage(videoMessage);
```

@tab Taro (Mini Program)

```typescript
import Taro from '@tarojs/taro';

// Send an image message.
const imageResult = await Taro.chooseImage({ count: 1 });
const image = imageResult.tempFiles[0];
const imagePath = imageResult.tempFilePaths[0];
if (!image || !imagePath) throw new Error('未选择图片');

// The Promise returned by getImageInfo() in @tarojs/taro 4.2.0 contains the original image dimensions and format.
const imageInfo = await Taro.getImageInfo({ src: imagePath });

const imageMessage = client.chatManager.createImageMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: imagePath,
    name: imagePath.split('/').pop() ?? 'image.jpg',
    type: image.type ?? `image/${imageInfo.type}`,
    size: image.size,
  },
  width: imageInfo.width,
  height: imageInfo.height,
});
await client.chatManager.sendMessage(imageMessage);

// Send a video message.
const video = await Taro.chooseVideo({ sourceType: ['album', 'camera'] });
const videoMessage = client.chatManager.createVideoMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    path: video.tempFilePath,
    name: video.tempFilePath.split('/').pop() ?? 'video.mp4',
    type: 'video/mp4',
    size: video.size,
  },
  duration: video.duration ?? 0,
  width: video.width,
  height: video.height,
});
await client.chatManager.sendMessage(videoMessage);
```

@tab React Native

```typescript
import { launchImageLibrary } from 'react-native-image-picker';

const chooseAsset = async (mediaType: 'photo' | 'video') => {
  const result = await launchImageLibrary({ mediaType, selectionLimit: 1 });
  const asset = result.assets?.[0];
  if (!asset?.uri) throw new Error('未选择媒体文件');
  return asset;
};

// Send an image message.
const image = await chooseAsset('photo');
const imageMessage = client.chatManager.createImageMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    uri: image.uri,
    name: image.fileName ?? 'image.jpg',
    type: image.type ?? 'image/jpeg',
    size: image.fileSize,
  },
  width: image.width,
  height: image.height,
});
await client.chatManager.sendMessage(imageMessage);

// Send a video message.
const video = await chooseAsset('video');
const videoMessage = client.chatManager.createVideoMessage({
  conversationId: 'user2',
  conversationType: 'singleChat',
  data: {
    uri: video.uri,
    name: video.fileName ?? 'video.mp4',
    type: video.type ?? 'video/mp4',
    size: video.fileSize,
  },
  duration: video.duration ?? 0,
  width: video.width,
  height: video.height,
});
await client.chatManager.sendMessage(videoMessage);
```

:::

:::tip
1. The React Native example uses the third-party library `react-native-image-picker` to obtain an image or video `uri`. The SDK does not require a particular media selection library. It only requires a readable local `uri` and correct file metadata.
2. The attachment `name` and `type` are used for multipart upload. If the host selection API does not return these fields, supply them based on the file path or actual file format. Do not assign the same inaccurate MIME type to every attachment.
3. `width` and `height` in `CreateImageMessageParams` are optional. If the local image dimensions are not passed, the SDK automatically retrieves them through `ImageProcessor.getImageInfo()` on the current platform before upload. The uni-app and Taro examples pass the dimensions explicitly, allowing the app to render an accurately sized message placeholder before calling `sendMessage()`.
:::

### File message limitations

The SDK's `createFileMessage()` and attachment upload layer support the attachment object formats described above. Some host frameworks cannot select arbitrary local files across platforms. This is a host file-access limitation and does not mean that the SDK can send only images and videos.

| Platform   | File selection limitation        | Recommendation                   |
| :-------------- | :----- | :------- |
| WeChat Mini Program   | `wx.chooseMessageFile()` can select only files in WeChat conversations and cannot browse arbitrary directories like a desktop browser. | For a file from a WeChat conversation, pass the returned temporary `path` to `createFileMessage()`. For a file from another source, upload it to your app server first and create a file message using `originalUrl`. |
| uni-app      | `uni.chooseFile()` is available only on some runtime platforms. WeChat Mini Program generally requires `wx.chooseMessageFile()`. | Detect platform capabilities through `uni.getSystemInfoSync().uniPlatform`. On unsupported platforms, integrate a native file selection plugin or use a remote `originalUrl`. |
| Taro         | `Taro.chooseMessageFile()` supports only some Mini Program targets. React Native targets generally do not provide this API. | Check whether the API is available first. If not, integrate a file selection plugin for the target platform, or upload the file first and create a file message using `originalUrl`. |
| React Native | React Native Core has no built-in document picker and cannot directly obtain an arbitrary file URI. | Integrate a native module such as `react-native-document-picker` or Expo DocumentPicker. Send the file after obtaining `{ uri, name, type, size }`. |

If the host does not provide a file picker and your app has not integrated a native plugin, do not display an entry point for regular file messages. For a file already hosted on your app server or CDN, pass its remote URL as `originalUrl` to `createFileMessage()`. The SDK does not need to upload a local file again.

## Common message creation parameters

All `create*Message()` methods support the following basic parameters:

| Parameter      | Type    | Required/Optional   | Use case     | Description     |
| :------- | :------- | :---- | :------ | :------------ |
| `conversationId`       | String                  | Required        | All messages              | Conversation ID. For a one-to-one chat, this is the peer user ID. For a group chat, this is the group ID. For a chat room, this is the chat room ID.                                 |
| `conversationType`     | `singleChat/groupChat/chatRoom`           | Required                                                                                                 | All messages   | Specifies a one-to-one chat, group chat, or chat room.             |
| `ext`                  | `Record<string, unknown>` | Optional        | All messages              | JSON-serializable extension. Store additional business information such as analytics data, card metadata, or fields excluded from moderation.                     |
| `timestamp`            | Number                  | Optional        | All messages              | Local timestamp in milliseconds. The SDK generates it automatically if omitted.                                                        |
| `deliverOnlineOnly`    | Boolean                 | Optional        | Text, command, custom, and other messages  | Whether to deliver the message only to online users. Suitable for typing states and transient control messages that do not require offline storage.                                   |
| `webhookEnv`           | String                  | Optional        | All messages              | Webhook routing environment identifier. The server matches callback routes based on this field. Use it to distinguish callback environments such as development, testing, or canary releases. |
| `priority`             | `high /normal/low`                | Optional                                                                                                 | Chat room messages | Raises the priority of important messages during high chat room concurrency. |
| `receiverList`         | String[]                | Optional        | Targeted group/chat room messages | Sends a group or chat room message only to specified members.    |
| `needReadReceipt` | Boolean                 | Optional        | Group messages              | Requests group message read statistics.                                                                       |

## API call frequency limit

If the server configures a sending frequency limit and a user exceeds it in a one-to-one chat, group chat, or chat room, the SDK may throw error code `509`, or `MESSAGE_CURRENT_LIMITING`.

## Send text messages

#### Sending process

To send a text message:

1. Call `createTextMessage` to create a text message.

For a regular chat message, pass only `conversationId`, `conversationType`, and `content`. You can also pass optional parameters required by your app, such as an extension or target translation languages. Some parameters take effect only for specific conversation types. For example, `needReadReceipt` applies only to group chats, and `receiverList` applies only when sending a [targeted message](message_target.html) in a group or chat room.

2. Call `sendMessage` to send the text message.
   Obtain the sending state through callbacks or the returned `Promise`.

Example code:

```typescript
const message = client.chatManager.createTextMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Text content of the message.
  content: "Hello!",
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter                   | Type                    | Required/Optional | Use case                     | Description                                                                                                             |
| :--------------------- | :---------------------- | :-------- | :--------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| `content`              | String                  | Required      | Regular chats, notification content, and explanatory text | Core text message content.                                                                                             |
| `targetLanguages`      | String[]                | Optional      | Translate on sending                   | Target translation languages included when sending, for text messages that require immediate translation.                                                       |
| `ext`                  | Record<string, unknown> | Optional      | Business extension information                 | Carries additional JSON-serializable business fields. Store additional business data here instead of writing complex business structures directly in the text content. |
| `deliverOnlineOnly`    | Boolean                 | Optional      | Transient messages and state notifications           | Whether to deliver the message only to online users.                                                                                           |
| `webhookEnv`           | String                  | Optional      | Multi-environment callback routing               | Distinguishes different Webhook callback environments.                                                                                  |
| `receiverList`         | String[]                | Optional      | Targeted group/chat room messages          | Specifies targeted recipients. Valid only for group chats and chat rooms.                                                                     |
| `needReadReceipt` | Boolean                 | Optional      | Group message read statistics               | Whether the group message requires read receipts. Valid only for group chats.                                                                             |
| `priority`             | String                  | Optional      | Chat room priority control             | Message priority. Used only for chat rooms.                                                                                   |

#### Example with group read receipts and an extension

For a text message with business attributes, carry the additional fields in `ext`. In a group chat, enable `needReadReceipt` to track which members have read the message.

```typescript
const message = client.chatManager.createTextMessage({
  conversationId: "group_001",
  conversationType: "groupChat",
  content: "大家好",
  // Extension
  ext: { bizType: "announcement" },
  // Whether the group message requires read receipts
  needReadReceipt: true,
});

await client.chatManager.sendMessage(message);
```

## Send attachment messages

#### Overview

Image, voice, video, and file messages are attachment messages. When sending an attachment message, the SDK creates the message, uploads the attachment, and sends the message based on the resource type.

There are generally two ways to construct an attachment message:

- `data`: Pass a local file object and let the SDK upload the attachment.
- `originalUrl`: Pass a remote file URL when the attachment has already been uploaded to your app server or CDN. The SDK uses this URL to construct the message without uploading a local file. For details, see [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server). 

#### Sending process

All attachment messages use the following process:

1. **Prepare the resource**: Pass a local file object (`data`) or an existing remote file URL (`originalUrl`).
2. **Create the message**: Call `createImageMessage()`, `createVoiceMessage()`, `createVideoMessage()`, or `createFileMessage()` based on the attachment type.
3. **Send the message**: Call `sendMessage()`.
   - If you pass `data`, the SDK uploads the attachment before sending the message body.
   - If you pass `originalUrl`, the SDK sends the message using the remote URL directly.
     For an image message, the SDK uses `originalUrl` as the original image URL and generates the corresponding large-image and thumbnail URLs by default.

#### Resource processing

- After an image message is sent, the server automatically generates a thumbnail.
- After a video message is sent, the first video frame is generally used as the thumbnail.
- In addition to common conversation parameters, each attachment type requires its own business parameters when creating a message, such as image dimensions, voice duration, video duration, or filename.

For attachment size and storage limitations, see [Message Attachment Limitations](limitation.html#消息存储).

### Send image messages

Image messages generally involve the following three image resources:

- Original image: The original image file selected locally by the sender, generally used to view or save the original image.
- Large image: An image proportionally compressed from the original image by the SDK client. If the shorter side is greater than 720 pixels, it is proportionally compressed to 720 pixels. If the shorter side is less than or equal to 720 pixels, the original dimensions are retained and the image is not enlarged. This image is generally displayed on the chat details page.
- Thumbnail: An image proportionally compressed from the original image by the server. By default, if the shorter side is greater than 170 pixels, it is proportionally compressed to 170 pixels. If the shorter side is less than or equal to 170 pixels, the original dimensions are retained and the image is not enlarged. Configure thumbnail compression and dimensions in the [Easemob Console](/product/console/basic_message.html#图片消息缩略图). Thumbnails are generally used for lightweight display in conversation lists and chat lists.

#### Sending process

To send an image message:

1. Prepare the image resource.
   For a local image, obtain the local image file. For an image uploaded to your app server or CDN, prepare its remote URL.
2. Create the image message.
   Call `createImageMessage` and pass the conversation information, image resource, image dimensions, whether the image is a GIF, whether to send it as the original image, and other parameters as needed.
3. Send the image message.
   Call `sendMessage`.
   - If you pass `data`, the SDK uploads the local image before sending the message.
   - If you pass `originalUrl`, the SDK constructs and sends the message using the remote URL without uploading a local file. It uses the URL as the original image URL and generates the corresponding large-image and thumbnail URLs by default. For details, see [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

The following example creates and sends an image message using a local image file:

```typescript
// Select a local image file.
const fileInput = document.getElementById("imageInput") as HTMLInputElement;
const file = fileInput.files?.[0];

if (!file) {
  throw new Error("No image file selected.");
}

// Create an image message.
const message = client.chatManager.createImageMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Local image file. For a remote image resource, pass `originalUrl`, not `originalImageUrl`.
  data: file,
  // Optional: Image width and height. Pass them when known to improve message-list and preview display.
  width: 800,
  height: 600,
  // Optional: Whether to send the original image.
  // `true` sends the original image; `false` sends the large image.
  // The default is `false`.
  isOriginalImage: false,
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter              | Type           | Required/Optional                   | Use case           | Description                                                              |
| :---------------- | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------------- |
| `data`            | CompatibleFile | Either this or `originalUrl` is required | Send a local image       | Local image file. The SDK uploads it.                             |
| `originalUrl`     | String         | Either this or `data` is required        | Send a remote image directly       | Use when the image is stored on your app server or CDN. The SDK does not upload a local file.       |
| `filename`        | String         | Optional                        | Preserve the filename     | Can be passed for both local and remote images.                                    |
| `filetype`        | String         | Optional                        | Specify a MIME type | For example, `image/png` or `image/gif`.                                   |
| `width`           | Number         | Optional                        | Chat list and preview display | Image width. Pass it when known.                                      |
| `height`          | Number         | Optional                        | Chat list and preview display | Image height. Generally used with `width`.                               |
| `isGif`           | Boolean        | Optional                        | Animated GIF           | Whether the current image is a GIF.                                          |
| `isOriginalImage` | Boolean        | Optional                        | Send original image           | `true` sends the original image and `false` sends the large image. The default is `false`. |
| `fileLength`      | Number         | Optional                        | Supply file size   | Pass when useful for UI display or business validation.                              |
| `thumbnailUrl`    | String         | Optional                        | Custom thumbnail resource   | Commonly used for remote image resources.                                        |

:::tip
- Pass at least one of `data` and `originalUrl`.
  - If you pass `data`, the SDK creates the message from the local file and uploads it automatically before sending.
  - If you pass `originalUrl`, the SDK constructs the image message using the existing remote URL and does not upload a local file.
- `isOriginalImage` indicates whether to send the original image. For a remote image, the SDK organizes image message information according to this value.
- Although `width` and `height` are optional, pass them when known to improve front-end rendering stability and consistency.
:::

### Send GIF images

A GIF image message is a special type of image message. It is created in the same way as a regular image message, but the resource must be identified as a GIF.

- Create a GIF image message through `createImageMessage`.
- Thumbnail generation for GIF images is the same as for regular image messages.
- A GIF image should not be compressed as a static image when sent.

#### Sending process

To send a GIF image:

1. Prepare the GIF image resource.
   Use a local GIF file or a remote URL for an uploaded GIF.
2. Create the image message.
   Call `createImageMessage` and set `isGif: true`.
3. Send the image message.
   Call `sendMessage` to send the GIF image message.

Example code:

```typescript
const message = client.chatManager.createImageMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Local GIF file object.
  data: gifFile,
  // Whether this is a GIF image. Set it to `true` when sending a GIF image.
  isGif: true,
});

await client.chatManager.sendMessage(message);
```

:::tip
- When sending a GIF, explicitly set `isGif: true` to avoid processing it as a regular static image.
- For parameter descriptions, see [Send image messages](#send-image-messages).
- If the GIF has been uploaded to your app server or CDN, send it through `originalUrl`. See [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server).
- If your app requires a unified attachment upload process, upload the GIF to your own server first and then send the message through `originalUrl`.
:::

### Send voice messages

A voice message generally contains a voice file and its duration and is used for voice chats, voice messages, and similar scenarios.

#### Sending process

To send a voice message:

1. Prepare the voice resource.
   For a local voice file, obtain the local file. For a voice file uploaded to your app server or CDN, prepare its remote URL. Also prepare the voice duration in seconds.
2. Create the voice message.
   Call `createVoiceMessage` and pass the conversation information, voice resource, duration, and other optional parameters as needed.
3. Send the voice message.
   Call `sendMessage`.
   - If you pass `data`, the SDK uploads the local voice file before sending the message.
   - If you pass `originalUrl`, the SDK constructs and sends the message using the remote URL without uploading a local file. See [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

The following examples send a local voice file in a browser, WeChat Mini Program, uni-app, Taro, and React Native. `duration` is required, is measured in seconds, and must be greater than `0`.

::: tabs#voice-code

@tab Browser

```typescript
const sendBrowserVoice = async (audioFile: File, durationSeconds: number): Promise<void> => {
  const message = client.chatManager.createVoiceMessage({
    conversationId: "user2",
    conversationType: "singleChat",
    // A Web File contains name, type, and size.
    data: audioFile,
    duration: durationSeconds,
  });

  await client.chatManager.sendMessage(message);
};
```

@tab WeChat Mini Program

```typescript
const recorder = wx.getRecorderManager();
let voiceRecordStartAt = 0;

recorder.onStart(() => {
  voiceRecordStartAt = Date.now();
});

recorder.onStop(async result => {
  if (!result.tempFilePath) throw new Error("录音结束但未返回 tempFilePath");

  const durationMs =
    typeof result.duration === "number" && result.duration > 0
      ? result.duration
      : Date.now() - voiceRecordStartAt;
  const durationSeconds = Math.max(1, Math.ceil(durationMs / 1000));

  const message = client.chatManager.createVoiceMessage({
    conversationId: "user2",
    conversationType: "singleChat",
    data: {
      path: result.tempFilePath,
      name: "wechat-record.mp3",
      type: "audio/mpeg",
      size: result.fileSize,
    },
    // WeChat RecorderManager returns milliseconds, while the SDK duration uses seconds.
    duration: durationSeconds,
  });

  await client.chatManager.sendMessage(message);
});

recorder.onError(error => console.error("录音失败", error));
recorder.start({ format: "mp3" });
// Call recorder.stop() when your app needs to stop recording.
```

@tab uni-app

```typescript
const recorder = uni.getRecorderManager();
let voiceRecordStartAt = 0;

recorder.onStart(() => {
  voiceRecordStartAt = Date.now();
});

recorder.onStop(async result => {
  if (!result.tempFilePath) throw new Error("录音结束但未返回 tempFilePath");

  const durationMs =
    typeof result.duration === "number" && result.duration > 0
      ? result.duration
      : Date.now() - voiceRecordStartAt;
  const durationSeconds = Math.max(1, Math.ceil(durationMs / 1000));
  const name = result.tempFilePath.split("/").pop() ?? `voice-${Date.now()}.mp3`;

  const message = client.chatManager.createVoiceMessage({
    conversationId: "user2",
    conversationType: "singleChat",
    data: {
      path: result.tempFilePath,
      name: /\.[a-z0-9]+$/i.test(name) ? name : `${name}.mp3`,
      type: "audio/mpeg",
      size: result.fileSize,
    },
    duration: durationSeconds,
  });

  await client.chatManager.sendMessage(message);
});

recorder.start({ format: "mp3" });
// Call recorder.stop() when your app needs to stop recording.
```

@tab Taro

```typescript
import Taro from "@tarojs/taro";

if (typeof Taro.getRecorderManager !== "function") {
  throw new Error("当前 Taro 目标不支持录音管理器");
}
const recorder = Taro.getRecorderManager();

recorder.onStop(async result => {
  const durationSeconds = result.duration / 1000;
  if (durationSeconds <= 0) throw new Error("录音时长必须大于 0 秒");

  const message = client.chatManager.createVoiceMessage({
    conversationId: "user2",
    conversationType: "singleChat",
    data: {
      path: result.tempFilePath,
      name: "taro-record.mp3",
      type: "audio/mpeg",
      size: result.fileSize,
    },
    // Taro RecorderManager returns milliseconds, while the SDK duration uses seconds.
    duration: durationSeconds,
  });

  await client.chatManager.sendMessage(message);
});

recorder.start({ format: "mp3" });
// Call recorder.stop() when your app needs to stop recording.
```

@tab React Native

```typescript
interface ReactNativeVoiceInput {
  readonly uri: string;
  readonly name?: string;
  readonly type?: string;
  readonly size?: number;
  readonly durationSeconds: number;
}

const sendReactNativeVoice = async (voice: ReactNativeVoiceInput): Promise<void> => {
  const message = client.chatManager.createVoiceMessage({
    conversationId: "user2",
    conversationType: "singleChat",
    data: {
      uri: voice.uri,
      name: voice.name,
      type: voice.type,
      size: voice.size,
    },
    duration: voice.durationSeconds,
  });

  await client.chatManager.sendMessage(message);
};
```

:::

:::tip

- In a browser, only a Web `File` can be used as local voice `data`. Mini Programs, uni-app, and Taro Mini Program use a file descriptor with `path`. React Native uses a file descriptor with `uri`.
- The `duration` option of `RecorderManager.start()` specifies the maximum recording time, not the final message duration. This example omits the option and uses the host's default limit, which is 60 seconds for WeChat Mini Program. Your app can call `stop()` at any time before automatic stopping and calculate the voice duration in seconds required by the SDK from the `onStop` result.
- `filename`, `filetype`, and `fileLength` are optional top-level fields. If local file metadata is already included in `data`, do not pass it again. Use these fields only as fallbacks when metadata is missing.
- For a remote voice file, pass `originalUrl` instead of local `data`. `duration` is still required.

:::

#### Key parameters

| Parameter          | Type           | Required/Optional                   | Use case           | Description                                                        |
| :------------ | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------- |
| `data`        | CompatibleFile | Either this or `originalUrl` is required | Send local voice       | Local voice file. The SDK uploads it.                       |
| `originalUrl` | String         | Either this or `data` is required        | Send remote voice directly       | Use when the voice file is stored on your app server or CDN. The SDK does not upload a local file. |
| `filename`    | String         | Optional                        | Preserve filename     | Can be passed for both local and remote voice files.                              |
| `filetype`    | String         | Optional                        | Specify MIME type | For example, `audio/amr` or `audio/mpeg`.                            |
| `duration`    | Number         | Required                        | Send voice message       | Voice duration in seconds.                                        |
| `fileLength`  | Number         | Optional                        | Supply file size   | Pass when useful for UI display or business validation.                        |

:::tip
- Pass at least one of `data` and `originalUrl`.
  - If you pass `data`, the SDK creates the message from the local file and uploads it automatically before sending.
  - If you pass `originalUrl`, the SDK constructs the voice message using the existing remote URL and does not upload a local file.
- `duration` is required when creating a voice message.
:::

### Send video messages

A video message generally contains a video file, its duration, and optional dimensions and thumbnail URL and is used for short videos and other video messages.

#### Sending process

To send a video message:

1. Prepare the video resource.
   For a local video, obtain the local video file. For a video uploaded to your app server or CDN, prepare its remote URL. Also prepare the video duration and, if known, its dimensions and thumbnail URL.
2. Create the video message.
   Call `createVideoMessage` and pass the conversation information, video resource, duration, dimensions, thumbnail URL, and other parameters as needed.
3. Send the video message.
   Call `sendMessage`.
   - If you pass `data`, the SDK uploads the local video before sending the message.
   - If you pass `originalUrl`, the SDK constructs and sends the message using the remote URL without uploading a local file. See [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

The following example creates and sends a video message using a local video file:

```typescript
// Local video file object.
const videoFile = selectedVideoFile;

// Create a video message.
const message = client.chatManager.createVideoMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Local video file. For a remote video resource, pass `originalUrl`.
  data: videoFile,
  // Video duration in seconds.
  duration: 30,
  // Optional: Video width.
  width: 1280,
  // Optional: Video height.
  height: 720,
  // Optional: Video filename.
  filename: "video.mp4",
  // Optional: Video file MIME type.
  filetype: "video/mp4",
  // Optional: Video thumbnail URL. Use when your app has generated a thumbnail.
  thumbnailUrl: "https://example.com/thumb.jpg",
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter           | Type           | Required/Optional                   | Use case             | Description                                                        |
| :------------- | :------------- | :-------------------------- | :------------------- | :---------------------------------------------------------- |
| `data`         | CompatibleFile | Either this or `originalUrl` is required | Send local video         | Local video file. The SDK uploads it.                       |
| `originalUrl`  | String         | Either this or `data` is required        | Send remote video directly         | Use when the video is stored on your app server or CDN. The SDK does not upload a local file. |
| `filename`     | String         | Optional                        | Preserve filename       | Can be passed for both local and remote videos.                              |
| `filetype`     | String         | Optional                        | Specify MIME type   | For example, `video/mp4`.                                          |
| `duration`     | Number         | Required                        | Send video message         | Video duration in seconds.                                        |
| `width`        | Number         | Optional                        | Chat list and preview display   | Video width. Pass it when known.                                |
| `height`       | Number         | Optional                        | Chat list and preview display   | Video height. Generally used with `width`.                         |
| `fileLength`   | Number         | Optional                        | Supply file size     | Pass when useful for UI display or business validation.                        |
| `thumbnailUrl` | String         | Optional                        | Custom video thumbnail | Use when your app has generated a video thumbnail.                              |

:::tip
- Pass at least one of `data` and `originalUrl`.
  - If you pass `data`, the SDK creates the message from the local file and uploads it automatically before sending.
  - If you pass `originalUrl`, the SDK constructs the video message using the existing remote URL and does not upload a local file.
- `duration` is required when creating a video message.
- Although `width` and `height` are optional, pass them when known to improve front-end rendering stability and consistency.
:::

### Send file messages

File messages are used to send documents, archives, spreadsheets, presentations, and other general file resources.

#### Sending process

To send a file message:

1. Prepare the file resource.
   For a local file, obtain the local file object. For a file uploaded to your app server or CDN, prepare its remote URL. You can also supply the filename, MIME type, and file size as needed.
2. Create the file message.
   Call `createFileMessage` and pass the conversation information, file resource, and optional parameters as needed.
3. Send the file message.
   Call `sendMessage`.
   - If you pass `data`, the SDK uploads the local file before sending the message.
   - If you pass `originalUrl`, the SDK constructs and sends the message using the remote URL without uploading a local file. See [Upload message attachments to your own server](#upload-message-attachments-to-your-own-server).

#### Use a local file with `data`

A Web `File` object already contains `name/type/size`. After you pass it through `data`, the SDK reads this metadata during upload, so you do not need to repeat the top-level `filename/filetype/fileSize` fields:

```typescript
// Local file object.
const selectedFile = fileInput.files?.[0];

if (!selectedFile) {
  throw new Error("No file selected.");
}

// Create a file message.
const message = client.chatManager.createFileMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // A Web File already contains name, type, and size.
  data: selectedFile,
});

await client.chatManager.sendMessage(message);
```

For a Mini Program `{ path }` or React Native `{ uri }` file descriptor, place the actual metadata returned by the host in `data`. The two descriptor structures are different:

::: tabs#file-source

@tab Mini Program/uni-app/Taro

```typescript
const message = client.chatManager.createFileMessage({
  conversationId: "user2",
  conversationType: "singleChat",
  data: {
    path: selectedFile.path,
    name: selectedFile.name,
    type: selectedFile.type,
    size: selectedFile.size,
  },
});

await client.chatManager.sendMessage(message);
```

@tab React Native

```typescript
const message = client.chatManager.createFileMessage({
  conversationId: "user2",
  conversationType: "singleChat",
  data: {
    uri: selectedFile.uri,
    name: selectedFile.name,
    type: selectedFile.type,
    size: selectedFile.size,
  },
});

await client.chatManager.sendMessage(message);
```

:::

When normalizing a local attachment, the SDK first reads `name/type/size` from `data`. If a Mini Program or React Native file lacks `name` or `type`, the SDK attempts to derive it from the last segment and extension of `path` or `uri`. Only if it still cannot obtain the value does it use the top-level `filename`, `filetype`, or `fileSize` as a fallback. Therefore, do not repeat metadata at the top level when it is already in `data`.

#### Use a remote file with `originalUrl`

A remote file is not uploaded or normalized as a local attachment by the SDK. Use `originalUrl` by itself. `filename`, `filetype`, and `fileLength` are optional in the type and validation rules, but the SDK cannot populate them automatically from a remote file object. If the recipient needs to display the filename, type, and size, pass them explicitly:

```typescript
const message = client.chatManager.createFileMessage({
  conversationId: "user2",
  conversationType: "singleChat",
  originalUrl: "https://static.example.com/files/document.pdf",
  filename: "document.pdf",
  filetype: "application/pdf",
  // Protocol encoding uses fileLength for the attachment size in bytes.
  fileLength: 102400,
});

await client.chatManager.sendMessage(message);
```

`fileSize` is the local file size field in `FileMessageBody`. The current MSync protocol encoding sends `fileLength`. When using `originalUrl` and sending the file size to the recipient, pass `fileLength`, not `fileSize`.

#### Key parameters

| Parameter          | Type           | Required/Optional                   | Use case           | Description                                                        |
| :------------ | :------------- | :-------------------------- | :----------------- | :---------------------------------------------------------- |
| `data`        | CompatibleFile | Either this or `originalUrl` is required | Send local file       | Local file. The SDK uploads it.                           |
| `originalUrl` | String         | Either this or `data` is required        | Send remote file directly       | Use when the file is stored on your app server or CDN. The SDK does not upload a local file. |
| `filename`    | String         | Optional                        | Metadata fallback and remote files | Fallback when local `data` lacks a filename. Pass explicitly for remote files.  |
| `filetype`    | String         | Optional                        | Metadata fallback and remote files | Fallback when local `data` lacks a MIME type. Pass explicitly for remote files. |
| `fileSize`    | Number         | Optional                        | Local file size       | Fallback for upload normalization when local `data` lacks `size`. It is not sent as the attachment size in the MSync protocol. |
| `fileLength`  | Number         | Optional                        | Protocol attachment size       | Attachment size field used by MSync protocol encoding. Use it to pass the size of a remote file. |

:::tip
- Pass at least one of `data` and `originalUrl`.
  - If you pass `data`, the SDK creates the message from the local file and uploads it automatically before sending.
  - If you pass `originalUrl`, the SDK constructs the file message using the existing remote URL and does not upload a local file.
- Metadata in local `data` takes precedence over top-level fallback fields. When using a Web `File` or a Mini Program or React Native file descriptor that already contains `name`, `type`, and `size`, do not repeat top-level metadata.
- The `originalUrl` flow does not include the upload stage, so the SDK does not automatically populate the remote filename, type, or size.
:::

### Upload message attachments to your own server

If message attachments must be uploaded to your own server or CDN instead of the EasyIM server, upload them in your app first and pass the remote URL when creating the message. This method applies when:

- Your app already has a unified attachment upload service;
- Attachments require authentication, transcoding, compression, or CDN distribution by your app;
- You do not want the SDK to upload local attachments directly to the EasyIM server.

Send the message as follows:

1. Upload the image, voice, video, or file to your own server in your app.
2. Obtain its remote access URL.
3. Enable `useCustomAttachmentUpload` in the SDK initialization configuration.
4. When creating the corresponding message type, pass the remote URL through `originalUrl` instead of passing local file `data`.
   The SDK constructs and sends the message using the remote URL without uploading a local file.
5. Call `sendMessage()`.

The following example creates and sends an image message after your app has uploaded the image to its own server.

```typescript
const message = client.chatManager.createImageMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // URL of the image uploaded to your own server.
  originalUrl: "https://static.example.com/chat/image_001.jpg",
  // Optional: Image width and height. Pass them when known to improve message-list and preview display.
  width: 800,
  height: 600,
  // Optional: Thumbnail URL generated by your own server.
  thumbnailUrl: "https://static.example.com/chat/thumb_001.jpg",
  // Optional: Image filename.
  filename: "image_001.jpg",
  // Optional: Image MIME type.
  filetype: "image/jpeg",
  // Optional: Whether to send the original image.
  isOriginalImage: true,
});

await client.chatManager.sendMessage(message);
```

## Send location messages

Location messages send geographical information, generally including the latitude, longitude, and address description of a location. This message type does not upload an attachment. Before sending one, integrate a third-party map or location service to obtain accurate coordinates. You can also include a location name, building name, or address description to improve the message display.

#### Sending process

To send a location message:

1. Prepare the location data.
   Integrate a map or location service and obtain the coordinates. Include an address description or building name as needed.
2. Create the location message.
   Call `createLocationMessage` and pass the conversation information, coordinates, location description, and other parameters.
3. Call `sendMessage`.

Example code:

```typescript
// Create a location message.
const message = client.chatManager.createLocationMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: 'user2',
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: 'singleChat',
  // Location latitude.
  latitude: 39.9042,
  // Location longitude.
  longitude: 116.4074,
  // Optional: Location address description.
  address: '北京市天安门广场',
  // Optional: Building name.
  buildingName: '天安门',
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter           | Type   | Required/Optional | Use case           | Description                             |
| :------------- | :----- | :-------- | :----------------- | :------------------------------- |
| `latitude`     | Number | Required      | Send location message       | Location latitude.                       |
| `longitude`    | Number | Required      | Send location message       | Location longitude.                       |
| `address`      | String | Optional      | Map and chat display | Location address description. Pass it when known. |
| `buildingName` | String | Optional      | Display landmark           | Building or place name.             |

#### Logic

- `latitude` and `longitude` are required when creating a location message.
- `address` and `buildingName` are optional, but pass them when known to improve message readability.
- Location messages do not upload attachments and can be sent immediately after creation.

## Send command messages

Command messages notify the recipient to perform a business action and are generally not displayed directly as regular chat content. Examples include typing indicators, control signals, and business commands.

Customize their functionality according to your business requirements, such as updating an avatar or nickname. Actions beginning with `em_` or `easemob::` are reserved for internal use. Do not use them.

:::tip
- Command messages cannot be recalled after sending.
- Command messages are not stored in the local database and are not displayed in the UI.
:::

#### Sending process

To send a command message:

1. Prepare the command action.
   Define the corresponding business action name, such as typing, stopped typing, or a business control command.
2. Create the command message.
   Call `createCmdMessage` and pass the conversation information, action name, and other optional parameters.
3. Send the command message.
   Call `sendMessage`.
   To deliver the message only to online users, set `deliverOnlineOnly: true`.

The recipient should process the command message in the app and should not display it as a regular text message.

Example code:

```typescript
// Create a command message.
const message = client.chatManager.createCmdMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: 'user2',
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: 'singleChat',
  // Command action name.
  action: 'TypingBegin',
  // Optional: Whether to deliver the message only to online users.
  deliverOnlineOnly: true,
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter                | Type                    | Required/Optional | Use case                     | Description                     |
| :------------------ | :---------------------- | :-------- | :--------------------------- | :----------------------- |
| `action`            | String                  | Required      | Typing states, control signals, and business commands | Command message action name.     |
| `deliverOnlineOnly` | Boolean                 | Optional      | Transient state notification                 | Whether to deliver the message only to online users.   |
| `ext`               | `Record<string, unknown>` | Optional      | Business extension information                 | Carries additional business context. |

## Send custom messages

Custom messages carry business events such as gifts, orders, cards, and interactive actions. They separate the event type and business parameters to facilitate business extension and message parsing.

#### Sending process

To send a custom message:

1. Prepare the custom event data.
   Define the business event name and prepare simple, serializable business parameters.
2. Create the custom message.
   Call `createCustomMessage` and pass the conversation information, event name, business parameters, and extension.
3. Send the custom message.
   Call `sendMessage`.

:::tip
Define the parsing and display logic for custom messages in your app.
:::

Example code:

```typescript
// Create a custom message.
const message = client.chatManager.createCustomMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: 'user2',
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: 'singleChat',
  // Custom event name.
  event: 'gift',
  // Optional: Custom business parameters.
  params: {
    giftId: '123',
    giftName: 'rose',
  },
  // Optional: Extension carrying more business context.
  ext: {
    source: 'web',
  },
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter     | Type                    | Required/Optional | Use case                       | Description                               |
| :------- | :---------------------- | :-------- | :----------------------------- | :--------------------------------- |
| `event`  | String                  | Required      | Gifts, orders, interactive actions, and business cards | Custom event name.                   |
| `params` | `Record<string, string>`  | Optional      | Pass business parameters                   | Custom business parameters. Keep the structure simple. |
| `ext`    | `Record<string, unknown>` | Optional      | Business extension information                   | Passes additional business context.           |

## Send combined messages

Combined messages are used to forward chat history or package and forward multiple messages. Rather than simply concatenating the text of multiple messages, this message type encodes a group of original messages into one combined message. After receiving it, the recipient can download and parse the original message list.

#### Sending process

To send a combined message:

1. Prepare the original message list.
   Collect the list of original message objects to combine and forward.
2. Create the combined message.
   Call `createCombineMessage` and pass the conversation information, title, summary, compatibility text, original message list, and other parameters.
3. Send the combined message.
   Call `sendMessage`.
4. Parse the combined message.
   After receiving the combined message, the recipient can call the parsing API to download and parse the original message list.

Example code:

```typescript
// Create a combined message.
const message = client.chatManager.createCombineMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Combined message title.
  title: "聊天记录",
  // Combined message summary, generally used for preview display in the message list.
  summary: "user1: Hello\nuser2: Hi",
  // Optional: Compatibility text. If omitted, the SDK uses `[版本过低]` by default.
  compatibleText: "[版本过低]",
  // List of original messages to combine.
  messageList: [msg1, msg2, msg3],
});

await client.chatManager.sendMessage(message);
```

#### Key parameters

| Parameter             | Type                   | Required/Optional | Use case         | Description                                             |
| :--------------- | :--------------------- | :-------- | :--------------- | :----------------------------------------------- |
| `title`          | String                 | Required      | Forward chat history     | Combined message title.                                   |
| `summary`        | String                 | Required      | Chat history preview     | Combined message summary, generally used for list previews.             |
| `compatibleText` | String                 | Optional      | Compatibility display         | Compatibility text. If omitted, the SDK uses `[版本过低]` by default. |
| `messageList`    | `ReadonlyArray<Message>` | Required      | Package and forward multiple messages | List of original messages to combine.                           |

#### Logic

- `messageList` is required and must be a list of message objects that can be combined.
- A combined message can contain up to 300 messages.
- Combined messages can be nested to a maximum of 10 levels. The SDK automatically calculates the current combination level from child messages and rejects creation if the limit is exceeded.
- Only messages with valid, encodable structures can be combined successfully.
- `summary` is displayed as the combined-message summary in a conversation or message list. It is not the original chat history content.
- To view the complete original message content, the recipient must call the download and parsing API.

#### Parse combined messages on the recipient

After receiving a combined message, download and parse its original message list.

Method 1: Pass the complete combined message object.

```typescript
const items = await client.chatManager.downloadAndParseCombineMessage({
  message: combineMessage,
});
```

Method 2: Pass the minimum download parameters from the combined message body.

```typescript
const items = await client.chatManager.downloadAndParseCombineMessage({
  url,
  secret,
});
```

#### Recommendations

- Combine and forward only messages that have been successfully sent or received to ensure stable display and parsing results.
- Use user-friendly text for `title` and `summary` to improve readability in conversation and message lists.
- To support clients that cannot fully display combined messages, explicitly pass `compatibleText`.

## Message sending callbacks

When calling `sendMessage(message, options)`, pass callbacks in the second parameter `options` to monitor message sending and attachment upload states. This parameter controls the sending process and does not carry message business fields.

#### Usage

Message sending callbacks are suitable for:

- Updating sending, sent, and failed states in the message list;
- Displaying upload progress for image, voice, video, file, and other attachment messages;
- Performing business processing after an upload completes, fails, or is canceled.

#### Example code

```typescript
await client.chatManager.sendMessage(message, {
  // Triggered when message sending starts.
  onSending: current => {
    console.log('sending', current.msgLocalId);
  },
  // Triggered when the message is sent successfully.
  onSuccess: sent => {
    console.log('success', sent.msgLocalId);
  },
  // Triggered when message sending fails.
  onFailed: (failed, error) => {
    console.error('failed', failed.msgLocalId, error);
  },
  // Triggered when attachment upload progress changes.
  onFileUploadProgress: progress => {
    console.log('upload progress', progress);
  },
});
```

#### Callback parameters

| Parameter                   | Type                       | Use case | Description                     |
| :--------------------- | :------------------------- | :------- | :----------------------- |
| `onSending`            | `(message) => void`        | All messages | Triggered when message sending starts.     |
| `onSuccess`            | `(message) => void`        | All messages | Triggered when the message is sent successfully.     |
| `onFailed`             | `(message, error) => void` | All messages | Triggered when message sending fails.     |
| `onFileUploadProgress` | `(progress) => void`       | Attachment messages | Triggered when attachment upload progress changes. |
| `onFileUploadComplete` | `(result) => void`         | Attachment messages | Triggered when attachment upload completes.     |
| `onFileUploadError`    | `(error) => void`          | Attachment messages | Triggered when attachment upload fails.     |
| `onFileUploadCanceled` | `() => void`               | Attachment messages | Triggered when attachment upload is canceled.     |

#### Logic

- `options` passes only sending-process callbacks and does not set message content or business fields.
- `onSending`, `onSuccess`, and `onFailed` apply to all message types.
- `onFileUploadProgress`, `onFileUploadComplete`, `onFileUploadError`, and `onFileUploadCanceled` mainly apply to image, voice, video, file, and other attachment messages.
- If you need only the final sending result, obtain it directly through `await sendMessage(...)` or the `then/catch` methods of the `Promise`. Callbacks are optional.

## More

#### Chat room message priority and message dropping

EasyIM supports high, normal, and low priorities for chat room messages. The Web SDK can set the priority of an individual chat room message through `priority` during message creation.

- `high`: High priority.
- `normal`: Normal priority and the default value.
- `low`: Low priority.

When chat room message concurrency or sending frequency is too high, the server processes high-priority messages first and drops low-priority messages first. Set important messages such as gifts and announcements to high priority.

Message priority only increases the likelihood that an important message is processed first and does not guarantee delivery. High-priority messages may still be dropped when chat room message concurrency is too high.

For a single chat room, message dropping may be triggered when more than 20 messages are sent per second by default:

1. The server drops low-priority messages first and attempts to retain high-priority messages.
2. When messages of the same priority exceed the limit, the server processes them in sending-time order, and later messages may be dropped.

```typescript
const roomId = 'roomId';

// Create a chat room text message and set its priority.
// If priority is omitted, the message is processed at normal priority by default.
const message = client.chatManager.createTextMessage({
  conversationId: roomId,
  conversationType: 'chatRoom',
  content: 'Hi',
  priority: 'high',
});

await client.chatManager.sendMessage(message, {
  onSuccess: sentMessage => {
    console.log('发送成功:', sentMessage.msgServerId);
  },
  onFailed: (failedMessage, error) => {
    console.log('发送失败:', failedMessage, error);
  },
});
```

:::tip 
`priority` is mainly used to control chat room message priority and is not recommended for one-to-one or group messages.
:::

#### Voice chat room seat management

Use [custom chat room attributes](room_attributes.html) to implement voice chat room seat-state management and multi-device synchronization, such as recording the seated user, seat state, and volume state.

Custom chat room attributes in the Web SDK use the `Record<string, string>` format:

```typescript
Record<string, string>
```

Therefore, a seat list or other structured data cannot be written directly as an array, object, or nested structure. Store it in one of the following ways:

- Use an independent attribute for each seat, with the attribute key representing the seat number and the value containing serialized seat information.
- Serialize the seat list as a JSON string and write it as a single attribute value.

For example, set an attribute for a single seat:

```typescript
const roomId = 'roomId';

const result = await client.chatRoomManager.setAttributes({
  chatRoomId: roomId,
  attributes: {
    // The value contains serialized seat information.
    seat_1: JSON.stringify({
      userId: 'user_001',
      state: 'open',
      volume: 0,
    }),
  },
  // Whether to automatically delete attributes set by a member when the member leaves the chat room. The default is true.
  autoDelete: false,
  // Whether to allow overwriting attributes set by other members. The default is false.
  isForced: false,
});

console.log('设置麦位属性结果:', result);
```

After custom chat room attributes are set or updated, other members in the chat room can monitor changes through `onAttributesUpdate` and update the local seat state:

```typescript
client.chatRoomManager.addEventHandler('room-attributes-listener', {
  onAttributesUpdate: event => {
    console.log('聊天室 ID:', event.chatRoomId);
    console.log('本次更新的属性:', event.attributes);
    console.log('操作者:', event.operatorId);

    const seat = event.attributes.seat_1
      ? JSON.parse(event.attributes.seat_1)
      : undefined;

    // Refresh the seat UI based on seat.
    console.log('麦位信息:', seat);
  },
  onAttributesRemoved: event => {
    console.log('被删除的属性:', event.keys);
  },
});
```

For implementation details and permission requirements, see [Custom Chat Room Attributes](room_attributes.html).

#### Retrieve attachment message sending progress

When sending an image, voice, video, file, or other attachment message, obtain attachment upload progress through the `onFileUploadProgress` callback passed to `sendMessage`.

In `onFileUploadProgress`, `loaded` is the number of bytes currently uploaded. Obtain the message sending result through `onSuccess` and `onFailed`:

- `onSuccess`: The message was sent successfully. The callback parameter is the sent message object.
- `onFailed`: Message sending failed. The callback parameters contain the failed message object and error information.
- `onFileUploadProgress`: Attachment upload progress callback.

```typescript
const file = document.querySelector<HTMLInputElement>('#file')?.files?.[0];

if (!file) {
  throw new Error('请选择要发送的文件');
}

const message = client.chatManager.createImageMessage({
  conversationId: 'userId',
  conversationType: 'singleChat',
  data: file,
});

await client.chatManager.sendMessage(message, {
  onFileUploadProgress: progress => {
    console.log('已上传字节数:', progress.loaded);

    // If the current runtime can obtain the total file size, calculate the percentage in your app.
    const percent = Math.round((progress.loaded / file.size) * 100);
    console.log('上传进度:', `${percent}%`);
  },
  onSuccess: sentMessage => {
    console.log('发送成功，消息 ID:', sentMessage.msgServerId);
  },
  onFailed: (failedMessage, error) => {
    console.log('发送失败:', failedMessage, error);
  },
});
```

:::tip 
Text, location, command, and custom messages generally do not upload attachments, so `onFileUploadProgress` is generally not triggered. Update page data in callbacks based on the latest state.
:::

#### Content moderation before sending messages

- Content moderation checks the message body

[The content moderation service checks specified fields in the message body, with different fields checked for different message types](/value-added/moderation/moderation_mechanism.html). Storing a large amount of business information in these fields during message creation may affect moderation results. Ensure that fields subject to content moderation do not contain business information. Store business information in the extension instead.

- Configure the sender to receive content replaced by moderation

If `useReplacedMessageContents` is enabled during initialization and moderation replaces text message content, the sender receives the replaced content. If it is disabled, the sender does not receive the replaced content.

#### Message size and storage limitations

For size and storage limitations for all message types, see [Message Limitations](limitation.html#消息大小).

#### Set callback routing when sending a message

Callback routing uses the callback environment value carried by each message to route different messages under the same App Key to different callback URLs.

When creating a message, set `webhookEnv` to a value such as `dev`, `test`, or `prod`. After the message is sent, the EasyIM server matches the value against the [callback routing rules](/product/console/basic_webhook.html#配置消息回调规则) configured in the Easemob Console and routes the message to the corresponding [pre-delivery webhook](/document/server-side/callback_presending.html) or [post-delivery webhook](/document/server-side/callback_postsending.html) URL.

**Use cases**

| Use case             | Description                                                                  |
| :--------------- | :-------------------------------------------------------------------- |
| Multi-environment isolation       | Distinguishes development, testing, and production environments under the same App Key and sends callbacks to their respective service URLs. |
| Canary release         | Routes some messages through a new pipeline for validation while other messages continue using the existing pipeline.              |
| Routing by business line     | Routes messages from different business modules to their respective moderation, risk-control, or synchronization services.              |
| Reduce callback forwarding costs | Avoids sending all callbacks to one entry point and then distributing them again through the app server.        |

**Scope**

| Callback type                                                      | Scope                            | Description                                                       |
| :------------------------------------------------------------ | :---------------------------------- | :--------------------------------------------------------- |
| [Pre-delivery webhook](/document/server-side/callback_presending.html)  | Applies only to messages sent by the SDK             | Before the message is delivered to target users, the app server can intercept or modify its content as needed. |
| [Post-delivery webhook](/document/server-side/callback_postsending.html) | Applies to messages sent by both the SDK and REST API | After the message is sent, the app server receives a callback notification.                   |

**Process**

To send a message with callback routing:

1. Configure callback routing in the Easemob Console.
   Configure callback URLs for different environment values for pre-delivery or post-delivery callbacks.
2. Set the callback environment when creating the message.
   Call `client.chatManager.create*Message()` and pass `webhookEnv` in the creation parameters.
3. Send the message.
   Call `client.chatManager.sendMessage()`.
4. The server matches a route by environment value.
   The EasyIM server routes the current message to the corresponding callback URL according to `webhookEnv` in the message.

**Example code**

The following example creates and sends a text message with a callback environment:

```typescript
const message = client.chatManager.createTextMessage({
  // Recipient: the peer user ID for a one-to-one chat, group ID for a group chat, or chat room ID for a chat room.
  conversationId: "user2",
  // Conversation type: `singleChat` for a one-to-one chat, `groupChat` for a group chat, or `chatRoom` for a chat room.
  conversationType: "singleChat",
  // Text message content.
  content: "Hello!",
  // Optional: Callback environment value. The server uses this value to match callback routes configured in the Easemob Console.
  webhookEnv: "test",
});

await client.chatManager.sendMessage(message);
```

**Key parameter**

| Parameter         | Type   | Required/Optional | Use case                 | Description                                                                                   |
| :----------- | :----- | :-------- | :----------------------- | :------------------------------------------------------------------------------------- |
| `webhookEnv` | String | Optional      | Route callbacks by environment or business dimension | Callback environment identifier for the message. After it is passed during message creation, the SDK sends it with the message and the server uses it to match a callback route. |

**Matching rules**

| Scenario                                 | Routing result                                                                                                                                  |
| :----------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| Carries an environment value that matches a valid route             | Routes to the corresponding callback URL for that environment value.                                                                                                          |
| Carries an environment value that does not match a valid route           | **Does not trigger a callback.** The `default` fallback configuration in the Easemob Console **does not take effect** in this scenario.                                                                      |
| Does not carry an environment value                         | Automatically routes to the callback URL for the `default` environment.                                                                                                 |
| The same message must trigger both pre-delivery and post-delivery callbacks | Both stages must use the **same environment value**. For example, if pre-delivery is configured as `test -> url1` and post-delivery as `test -> url2`, carrying `test` in the message enables both stages. |

## API list

| API name | Module/Class | Description |
| :--- | :--- | :--- |
| [`addEventHandler`](#monitor-message-related-events) | `ChatClient` | Registers an event listener. |
| [`createTextMessage`](#send-text-messages) | `ChatManager` | Creates a text message. |
| [`createImageMessage`](#send-image-messages) | `ChatManager` | Creates an image message. GIF images are also created through this API. |
| [`createVoiceMessage`](#send-voice-messages) | `ChatManager` | Creates a voice message. |
| [`createVideoMessage`](#send-video-messages) | `ChatManager` | Creates a video message. |
| [`createFileMessage`](#send-file-messages) | `ChatManager` | Creates a file message. |
| [`createLocationMessage`](#send-location-messages) | `ChatManager` | Creates a location message. |
| [`createCmdMessage`](#send-command-messages) | `ChatManager` | Creates a command message. |
| [`createCustomMessage`](#send-custom-messages) | `ChatManager` | Creates a custom message. |
| [`createCombineMessage`](#send-combined-messages) | `ChatManager` | Creates a combined message. |
| [`downloadAndParseCombineMessage`](#parse-combined-messages-on-the-recipient) | `ChatManager` | Downloads and parses the original message list in a combined message. |
| [`sendMessage`](#message-sending-callbacks) | `ChatManager` | Sends a created message and supports sending-process callbacks. |
