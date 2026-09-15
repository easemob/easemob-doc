# 接收消息

环信即时通讯 IM HarmonyOS SDK 通过 [ChatMessageListener](https://sdkdocs.easemob.com/apidoc/harmony/chat3.0/modules/ChatMessageListener.html) 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

你可以用注册监听 `ChatMessageListener` 接收消息。该 `ChatMessageListener` 可以多次添加，请记得在不需要的时候移除 `listener`。

在新消息到来时，你会收到 `onMessageReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```typescript
let msgListener: ChatMessageListener = {
  onMessageReceived: (messages: ChatMessage[]): void => {
    // 收到消息，遍历消息队列，解析和显示。
  }
}
// 注册消息监听
ChatClient.getInstance().chatManager()?.addMessageListener(msgListener);
// 解注册消息监听
ChatClient.getInstance().chatManager()?.removeMessageListener(msgListener);
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载图片附件（原图或发送方上传的大图）、视频和文件，需调用 `downloadAttachment` 方法。
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。

2. 接收方收到 [onMessageReceived](#接收文本消息) 回调，调用 `getRemoteUrl` 或 `getLocalPath` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```typescript
let voiceBody = message.getBody() as VoiceMessageBody;
// 获取语音文件在服务器的地址。
let voiceRemoteUrl = voiceBody.getRemoteUrl();
// 本地语音文件的本地路径。
let voiceLocalPath = voiceBody.getLocalPath();
```

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。SDK 自 1.14.0 版本起支持大图功能。
- 缩略图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 接收图片消息时，SDK 会根据配置决定是否自动下载缩略图：

   - 默认自动下载，即 `ChatOptions#setAutoDownloadThumbnail(true)`。
   - 如果关闭自动下载，即设置为 `false`，则需要调用 `ChatManager#downloadThumbnail` 手动下载。

2. 收到图片消息后，接收方可以在 `onMessageReceived` 回调中处理图片消息，并根据业务需要下载图片附件或大图：

   - 调用 `ChatManager#downloadAttachment` 下载图片附件。该附件可能是原图，也可能是发送方上传的大图。
   - 调用 `ChatManager#downloadBigImage` 下载大图。

   `downloadThumbnail`、`downloadAttachment` 和 `downloadBigImage` 均返回 `Promise<void>`，并支持可选的下载进度回调。如果本地已存在对应资源路径，建议优先复用本地文件，避免重复下载。

示例代码如下所示：

```typescript
/**
 * 下载图片的大图或图片附件。
 * @param useBigImage true：下载大图；false：下载图片附件（原图或发送方上传的大图）。
 */
function downloadImage(message: ChatMessage, useBigImage: boolean): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }
  let downloadTask: Promise<void>;
  if (useBigImage) {
    downloadTask = chatManager.downloadBigImage(message, (progress: number): void => {
      // 大图下载进度
    });
  } else {
    downloadTask = chatManager.downloadAttachment(message, (progress: number): void => {
      // 图片附件下载进度
    });
  }
  downloadTask.then(() => {
    // 图片资源下载成功
  }).catch((error: ChatError) => {
    // 图片资源下载失败
  });
}

let msgListener: ChatMessageListener = {
  onMessageReceived: (messages: ChatMessage[]): void => {
    messages.forEach((message: ChatMessage): void => {
      if (message.getType() === ContentType.IMAGE) {
        // 优先使用已下载的缩略图展示；用户点击图片时再调用
        // downloadImage(message, true) 下载大图，或 downloadImage(message, false) 下载图片附件。
      }
    });
  }
};
```

3. 你可以通过 `ImageMessageBody` 获取原图、大图和缩略图的服务器地址或本地路径：

```typescript
let imgBody = message.getBody() as ImageMessageBody;

// 判断图片附件是否为原图。
// true：图片附件为原图；false：图片附件为发送方压缩后的大图。
let isOriginal = imgBody.isOriginalImage();

// 获取图片附件的服务器地址。
// isOriginal 为 true 时表示原图；为 false 时表示发送方上传的大图。
let imgRemoteUrl = imgBody.getRemoteUrl();

// 获取大图的服务器地址。
let bigImgRemoteUrl = imgBody.getBigImageRemoteUrl();

// 获取缩略图的服务器地址。
let thumbnailUrl = imgBody.getThumbnailRemoteUrl();

// 获取图片附件的本地路径。
// isOriginal 为 true 时表示原图；为 false 时表示发送方上传的大图。
let imgLocalPath = imgBody.getLocalPath();

// 获取大图的本地路径。
let bigImgLocalPath = imgBody.getBigImageLocalPath();

// 获取缩略图的本地路径。
let thumbnailLocalPath = imgBody.getThumbnailLocalPath();
```

此外，SDK 还支持通过以下方法判断图片资源状态：

- `isOriginalImage()`：判断消息中的图片资源是原图还是发送方压缩后的大图。
- `getBigImageDownloadStatus()`：获取大图的下载状态。
- `getThumbnailDownloadStatus()`：获取缩略图的下载状态。
- `getWidth()` / `getHeight()`：获取图片宽高。

### 接收 GIF 图片消息

自 HarmonyOS SDK 1.7.0 开始，支持接收 GIF 图片消息。

GIF 图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 [onMessageReceived](#接收文本消息) 回调方法。接收方判断为图片消息后，调用消息体的 `isGif()` 方法；若返回 `true`，则为 GIF 图片消息。

```typescript
ChatClient.getInstance().chatManager()?.addMessageListener({
  onMessageReceived: (messages) => {
    messages.forEach(message => {
      if (message.getType() === ContentType.IMAGE) {
        let body = message.getBody() as ImageMessageBody;
        if (body.isGif()) {
          // 根据业务情况处理gif message, 例如下载展示该消息
        }
      }
    })
  }
});
```

### 接收视频消息

收到视频消息后，通常先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. 接收方收到视频消息时，SDK 会根据配置决定是否自动下载视频缩略图。

   视频缩略图的下载策略与图片缩略图一致：默认情况下，SDK 自动下载缩略图，即 `ChatOptions#setAutoDownloadThumbnail(true)`；如果关闭自动下载，即设置为 `false`，则需要调用 `ChatManager#downloadThumbnail` 手动下载。详见[接收图片消息](#接收图片消息)。

2. SDK 会通过 `onMessageReceived` 回调将视频消息传递给接收方。接收方可根据业务需要选择使用缩略图，或进一步下载视频原文件。

   - 如果只需要在会话列表或聊天界面展示预览图，可优先使用缩略图。
   - 如果用户需要播放视频，再调用 `ChatManager#downloadAttachment` 下载视频原文件。

   `downloadThumbnail` 和 `downloadAttachment` 均返回 `Promise<void>`，并支持可选的下载进度回调。为避免重复下载，建议优先检查本地是否已存在对应的视频文件或缩略图；如果本地已有可用资源，可直接复用。

示例代码如下所示：

```typescript
/**
 * 下载视频原文件。
 */
function downloadVideo(message: ChatMessage): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }
  chatManager.downloadAttachment(message, (progress: number): void => {
    // 视频附件下载进度
  }).then(() => {
    // 视频附件下载成功，可播放或保存视频
  }).catch((error: ChatError) => {
    // 视频附件下载失败
  });
}

let msgListener: ChatMessageListener = {
  onMessageReceived: (messages: ChatMessage[]): void => {
    messages.forEach((message: ChatMessage): void => {
      if (message.getType() === ContentType.VIDEO) {
        // 先使用缩略图展示；用户点击视频时再调用 downloadVideo(message)。
      }
    });
  }
};
```

3. 通过 `VideoMessageBody` 获取视频原文件和缩略图的服务器地址或本地路径。其中，缩略图适合用于预览展示，视频原文件适合用于播放或下载保存。

```typescript
let body = message.getBody() as VideoMessageBody;
// 从服务器端获取视频文件。
let videoRemoteUrl = body.getRemoteUrl();
// 从服务器获取视频缩略图文件。
let thumbnailUrl = body.getThumbnailRemoteUrl();
// 从本地获取视频文件。
let videoLocalPath = body.getLocalPath();
// 从本地获取视频缩略图文件。
let videoThumbnailLocalPath = body.getThumbnailLocalPath();
```

### 接收文件消息

1. 接收方收到 [onMessageReceived](#接收文本消息) 回调，调用 `downloadAttachment` 方法下载文件。

```typescript
/**
 * 下载文件。
 */
function downloadFile(message: ChatMessage): void {
  let chatManager = ChatClient.getInstance().chatManager();
  if (!chatManager) {
    return;
  }
  chatManager.downloadAttachment(message, (progress: number): void => {
    // 附件下载进度
  }).then(() => {
    // 附件下载成功
  }).catch((error: ChatError) => {
    // 附件下载失败
  });
}
```

2. 调用以下方法从服务器或本地获取文件附件：

```typescript
let fileMessageBody = message.getBody() as FileMessageBody;
// 从服务器获取文件。
let fileRemoteUrl = fileMessageBody.getRemoteUrl();
// 从本地获取文件。
let fileLocalPath = fileMessageBody.getLocalPath();
```

## 接收位置消息

接收位置消息与文本消息一致，详见 [接收文本消息](#接收文本消息)。
   
接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

接收方通过 [onMessageReceived](#接收文本消息) 和 `onCmdMessageReceived` 回调接收透传消息，方便用户进行不同的处理。

```typescript
let msgListener: ChatMessageListener = {
  onMessageReceived: (messages: ChatMessage[]): void => {
    // 接收到消息
  },
  onCmdMessageReceived: (messages: ChatMessage[]): void => {
    // 接收到透传消息
  }
}
```

## 接收自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，详见 [接收文本消息](#接收文本消息)。

## 接收合并消息

为了方便消息互动，SDK 支持将多个消息合并在一起进行转发。

接收合并消息与接收普通消息的操作相同，详见 [接收文本消息](#接收文本消息)。
- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
  - 若附件已存在，该方法会直接解析附件并返回原始消息列表。
  - 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```typescript
ChatClient.getInstance().chatManager()?.downloadAndParseCombineMessage(message).then((result) => {
  // 处理并展示消息列表
}).catch((e: ChatError) => {
  // 处理出错信息
});
```

## 更多

### 消息附件下载鉴权

自 1.7.0 版本开始，即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment` 方法下载消息附件。

### 判断消息是否为聊天室广播消息

对于聊天室消息，你可以通过消息的 `ChatMessage#isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。
