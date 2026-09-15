# 接收消息

<Toc />

环信即时通讯 IM React Native SDK 通过 `ChatMessageEventListener` 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以用注册监听 `ChatMessageEventListener` 接收消息。该监听可添加多次，可在不需要的时移除。
- 在新消息到来时，你会收到 `onMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```typescript
// 继承并实现 ChatMessageEventListener
class ChatMessageEvent implements ChatMessageEventListener {
  onMessagesReceived(messages: ChatMessage[]): void {
    console.log(`onMessagesReceived: `, messages);
  }
  // 其他回调接收省略，实际开发中需要实现
}

// 注册监听器
const listener = new ChatMessageEvent();
ChatClient.getInstance().chatManager.addMessageListener(listener);

// 移除监听器
ChatClient.getInstance().chatManager.removeMessageListener(listener);

// 移除所有监听器
ChatClient.getInstance().chatManager.removeAllMessageListener();
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用下载附件方法。
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
2. 接收方收到 `onMessagesReceived` 回调，消息对象属性包括语音文件的服务器地址 `msg.body.remotePath` 或本地路径 `msg.body.localPath`，从而获取语音文件。

### 接收图片消息

自 React Native SDK 1.18.0 版本开始，图片消息支持以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 接收图片消息时，SDK 根据 `ChatOptions.isAutoDownload` 决定是否自动下载缩略图。该属性默认为 `true`。若设置为 `false`，需要调用 `downloadThumbnail` 手动下载缩略图。

```typescript
const autoDownloadThumbnail = false;

ChatClient.getInstance().init(
  new ChatOptions({
    appKey,
    isAutoDownload: autoDownloadThumbnail,
  })
);
```

2. SDK 通过 `onMessagesReceived` 回调传递图片消息。接收方可根据业务需要调用以下方法下载图片资源：

- `downloadThumbnail(message, callback)`：下载缩略图。
- `downloadAttachment(message, callback)`：下载图片附件，即下载 `remotePath` 对应的图片附件。`isOriginalImage` 为 `true` 时，该附件为原图；为 `false` 时，该附件为发送方压缩后上传的大图。
- `downloadBigImage(message, callback)`：下载大图。若 `downloadAttachment` 下载的图片附件本身已经是大图，通常无需再次调用。

如果消息体中已有相应的本地路径，建议直接复用本地文件，避免重复下载。

```typescript
const imageDownloadCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId: string, progress: number): void {
    console.log("图片下载进度：", localMsgId, progress);
  },

  onError(localMsgId: string, error: ChatError): void {
    console.log("图片下载失败：", localMsgId, error);
  },

  onSuccess(updatedMessage: ChatMessage): void {
    console.log("图片下载成功：", updatedMessage.msgId);
  },
};

// 按需下载图片附件。
function downloadImageAttachmentIfNeeded(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.IMAGE) {
    return;
  }

  const body = message.body as ChatImageMessageBody;
  if (body.localPath) {
    // 本地已有图片附件，直接复用。
    return;
  }

  void ChatClient.getInstance().chatManager
    .downloadAttachment(message, imageDownloadCallback)
    .catch((error) => console.log("发起图片附件下载失败：", error));
}

// 按需下载大图。
function downloadBigImageIfNeeded(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.IMAGE) {
    return;
  }

  const body = message.body as ChatImageMessageBody;
  if (body.bigImageLocalPath) {
    // 本地已有大图，直接复用。
    return;
  }

  void ChatClient.getInstance().chatManager
    .downloadBigImage(message, imageDownloadCallback)
    .catch((error) => console.log("发起大图下载失败：", error));
}

const imageMessageListener: ChatMessageEventListener = {
  onMessagesReceived(messages: ChatMessage[]): void {
    for (const message of messages) {
      if (message.body.type !== ChatMessageType.IMAGE) {
        continue;
      }

      const body = message.body as ChatImageMessageBody;

      if (body.thumbnailLocalPath) {
        // 本地已有缩略图，直接展示。
      } else if (!autoDownloadThumbnail) {
        // 仅在关闭自动下载缩略图时手动下载。
        void ChatClient.getInstance().chatManager
          .downloadThumbnail(message, imageDownloadCallback)
          .catch((error) => console.log("发起缩略图下载失败：", error));
      }

      // 用户查看清晰图片时，根据业务需要调用其中一个方法：
      // downloadBigImageIfNeeded(message);
      // downloadImageAttachmentIfNeeded(message);
    }
  },
};

ChatClient.getInstance().chatManager.addMessageListener(
  imageMessageListener
);
```

:::tip
`downloadThumbnail`、`downloadBigImage` 和 `downloadAttachment` 返回的 `Promise<void>` 用于报告方法调用错误。附件下载进度和最终结果通过 `ChatMessageStatusCallback` 返回；下载成功后，应从 `onSuccess` 参数 `updatedMessage` 的消息体中读取最新本地路径。
:::

1. 你可以通过 `ChatImageMessageBody` 获取图片附件、大图和缩略图的服务端地址或本地路径：

```typescript
if (message.body.type === ChatMessageType.IMAGE) {
  const imageBody = message.body as ChatImageMessageBody;

  // 图片附件的服务端地址和本地路径。
  // isOriginalImage 为 true 时，该附件为原图。
  const imageRemotePath = imageBody.remotePath;
  const imageLocalPath = imageBody.localPath;

  // 大图的服务端地址和本地路径。
  const bigImageRemotePath = imageBody.bigImageRemotePath;
  const bigImageLocalPath = imageBody.bigImageLocalPath;

  // 缩略图的服务端地址和本地路径。
  const thumbnailRemotePath = imageBody.thumbnailRemotePath;
  const thumbnailLocalPath = imageBody.thumbnailLocalPath;
}
```

除了上述图片资源的服务端地址和本地路径，图片消息体 `ChatImageMessageBody` 还提供以下主要属性：

| 属性                     | 类型                             | 描述                           |
| ------------------------ | -------------------------------- | ------------------------------ |
| `fileStatus`             | `ChatDownloadStatus`             | 图片附件的下载状态。           |
| `bigImageDownloadStatus` | `ChatDownloadStatus | undefined` | 大图的下载状态。               |
| `thumbnailStatus`        | `ChatDownloadStatus`             | 缩略图的下载状态。             |
| `isOriginalImage`        | `boolean | undefined`            | 图片附件是否为未经压缩的原图。 |
| `width`                  | `number`                         | 图片宽度，单位为像素。         |
| `height`                 | `number`                         | 图片高度，单位为像素。         |

:::tip
`ChatDownloadStatus` 的取值包括 `PENDING`、`DOWNLOADING`、`SUCCESS` 和 `FAILED`。
:::

### 接收 GIF 图片消息

自 React Native SDK 1.11.0 开始，支持接收 GIF 图片消息。

图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `onMessagesReceived` 事件。接收方判断为图片消息后，读取消息体的 `isGif` 属性，若值是 `YES`， 则为 GIF 图片消息。

```typescript
ChatClient.getInstance().chatManager.addMessageListener({
  // 重写 onMessagesReceived
  onMessagesReceived(messages) {
    for (let index = 0; index < messages.length; index++) {
      const element = messages[index];
      if (element?.body.type === ChatMessageType.IMAGE) {
        const body = element.body as ChatImageMessageBody;
        // 查看图片是否为 GIF 图片
        if (body.isGif === true) {
          // 下载附件
          ChatClient.getInstance().chatManager.downloadAttachment(element);
        }
      }
    }
  },
});
```

### 接收视频消息

收到视频消息后，通常先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. SDK 根据 `ChatOptions.isAutoDownload` 决定是否自动下载视频缩略图。该属性默认为 `true`。若关闭自动下载，需要调用 `downloadThumbnail(message, callback)` 手动下载。该配置与图片缩略图相同，详见 [接收图片消息](#接收图片消息)。

2. SDK 通过 `onMessagesReceived` 回调传递视频消息。接收方可优先使用缩略图进行预览，并在用户需要播放视频时调用 `downloadAttachment(message, callback)` 下载视频原文件。

3. 下载前建议先检查 `thumbnailLocalPath` 或 `localPath`。本地已有可用路径时，直接复用对应文件。

```typescript
const videoDownloadCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId: string, progress: number): void {
    console.log("视频下载进度：", localMsgId, progress);
  },
  onError(localMsgId: string, error: ChatError): void {
    console.log("视频下载失败：", localMsgId, error);
  },
  onSuccess(updatedMessage: ChatMessage): void {
    if (updatedMessage.body.type !== ChatMessageType.VIDEO) {
      return;
    }
    const body = updatedMessage.body as ChatVideoMessageBody;
    // 从下载完成后返回的新消息对象中读取最新本地路径。
    console.log("视频本地路径：", body.localPath);
    console.log("视频缩略图本地路径：", body.thumbnailLocalPath);
  },
};

// 与初始化时的 ChatOptions.isAutoDownload 设置保持一致。
const isAutoDownloadVideoThumbnailEnabled = false;

function downloadVideo(message: ChatMessage): void {
  if (message.body.type !== ChatMessageType.VIDEO) {
    return;
  }

  const body = message.body as ChatVideoMessageBody;
  if (body.localPath) {
    // 本地已有视频文件，直接播放。
    console.log("播放本地视频：", body.localPath);
    return;
  }

  void ChatClient.getInstance().chatManager
    .downloadAttachment(message, videoDownloadCallback)
    .catch((error) => console.log("发起视频下载失败：", error));
}

const videoMessageListener: ChatMessageEventListener = {
  onMessagesReceived(messages: ChatMessage[]): void {
    for (const message of messages) {
      if (message.body.type !== ChatMessageType.VIDEO) {
        continue;
      }

      const body = message.body as ChatVideoMessageBody;
      if (body.thumbnailLocalPath) {
        // 本地已有视频缩略图，直接展示。
        console.log("视频缩略图本地路径：", body.thumbnailLocalPath);
      } else if (!isAutoDownloadVideoThumbnailEnabled) {
        // 仅在关闭自动下载缩略图时手动下载。
        void ChatClient.getInstance().chatManager
          .downloadThumbnail(message, videoDownloadCallback)
          .catch((error) =>
            console.log("发起视频缩略图下载失败：", error)
          );
      }

      // 用户点击视频消息时调用：downloadVideo(message);
    }
  },
};

ChatClient.getInstance().chatManager.addMessageListener(videoMessageListener);
```

4. 视频消息体 `ChatVideoMessageBody` 提供以下主要属性：

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| `remotePath` | `string` | 视频原文件在服务器的地址。 |
| `thumbnailRemotePath` | `string` | 视频缩略图在服务器的地址。 |
| `localPath` | `string` | 视频原文件的本地路径。路径为空字符串时，表示本地暂无可用文件。 |
| `thumbnailLocalPath` | `string` | 视频缩略图的本地路径。路径为空字符串时，表示本地暂无可用文件。 |
| `fileStatus` | `ChatDownloadStatus` | 视频原文件的下载状态。 |
| `thumbnailStatus` | `ChatDownloadStatus` | 视频缩略图的下载状态。 |
| `duration` | `number` | 视频时长，单位为秒。 |
| `width` / `height` | `number` | 视频缩略图宽高，单位为像素。 |

### 接收文件消息

1. 接收方收到 [onMessagesReceived](#接收文本消息) 回调，调用 `downloadAttachment` 方法下载文件。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

2. 通过文件消息对象的消息体对象 `body` 获取文件信息。

## 接收位置消息

接收位置消息与文本消息一致，详见[接收文本消息](#接收文本消息)。

接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 这里接收透传消息数据
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
```

## 接收自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，详见[接收文本消息](#接收文本消息)。

## 接收合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发，例如，发送聊天记录。

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收文本消息)。
- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `fetchCombineMessageDetail` 方法获取原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
  - 若附件已存在，该方法会直接解析附件并返回原始消息列表。
  - 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```typescript
// message: 合并消息对象
// 通过异步返回原始消息列表。
ChatClient.getInstance()
  .chatManager.fetchCombineMessageDetail(message)
  .then((messages: ChatMessage[]) => {
    console.log("success: ", messages);
  })
  .catch((error) => {
    console.log("fail: ", error);
  });
```

## 更多

### 消息接收回调返回发送成功的消息

自 1.4.0 版本开始，若初始化时开启了 `ChatOptions#messagesReceiveCallbackIncludeSend` 选项，发送成功的消息也会通过 `onMessagesReceived` 事件返回。

### 判断消息是否为聊天室广播消息

自 1.3.0 版本开始，对于聊天室消息，你可以通过消息的 `ChatMessage.isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

### 消息附件下载鉴权

自 1.11.0 版本开始，即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment` 方法下载消息附件。
