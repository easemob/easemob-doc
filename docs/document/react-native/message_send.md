# 发送消息

<Toc />

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类和 `ChatMessage` 类实现文本、图片、音频、视频和文件等类型的消息的发送。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

1. 发送方调用 `ChatMessage#createTextMessage` 方法构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509。

示例代码：

```typescript
// 设置发送的消息类型。详见 `ChatMessageType` 枚举类型。
const messageType = ChatMessageType.TXT;
// 设置消息接收对象。单聊时为对端用户 ID、群聊时为群组 ID，聊天室时为聊天室 ID。
const targetId = "john";
// 设置会话类型。单聊为 `PeerChat`，群聊为 `GroupChat`，聊天室为 `ChatRoom`，默认为单聊。
// 具体详见 `ChatMessageChatType` 枚举类型。
const chatType = ChatMessageChatType.PeerChat;
let msg: ChatMessage;
// 构建文本消息。只需要消息文本内容。
const content = "This is text message";
msg = ChatMessage.createTextMessage(targetId, content, chatType);

// 设置消息发送回调，用来接收消息发送成功、失败、进度条信息。
const callback = {
  onError(localMsgId: string, error: ChatError): void {
    console.log("send message fail.");
  },
  onSuccess(message: ChatMessage): void {
    console.log("send message success.");
  },
  onProgress?(localMsgId: string, progress: number): void {
    console.log("send message progress.");
  },
} as ChatMessageStatusCallback;

ChatClient.getInstance()
  .chatManager.sendMessage(msg!, callback)
  .then(() => {
    // 消息发送动作完成，会在这里打印日志
    // 消息的发送结果通过回调返回
    console.log("send message operation success.");
  })
  .catch((reason) => {
    // 消息发送动作失败，会在这里打印日志
    console.log("send message operation fail.", reason);
  });
```

2. 发送方调用 `ChatManager#sendMessage` 方法将该消息发出。发送消息时可以设置 `EMCallBack` 的实例，获取消息发送状态。

```typescript
ChatClient.getInstance().chatManager.sendMessage(msg!, callback).then().catch();
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `createVoiceMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息。
3. 发送方调用发送消息方法发送消息。SDK 会将语音文件上传至环信服务器。

```typescript
// 构建语音消息
// 需传入本地语音文件地址、显示名称和播放时长（单位为秒）
// 传入的语音文件的路径时，不需要添加 file://。
const filePath = "data/.../foo.wav";
const displayName = "bar.mp4";
const duration = 5;
const msg = ChatMessage.createVoiceMessage(targetId, filePath, chatType, {
  displayName,
  duration,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

### 发送图片消息

图片消息包含以下三类图片资源，其中大图资源自 React Native SDK 1.18.0 版本开始支持：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：默认由服务器根据上传的图片附件生成。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息的流程如下：

1. 获取 Android 或 iOS 原生层可访问的图片本地文件路径。 

2. 调用 `ChatMessage#createImageMessage` 创建图片消息。
   
   传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID （群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息。

   通过 `sendOriginalImage` 控制上传的图片资源：`true` 表示 SDK 上传原图，`false` 表示上传大图。

3. 调用 `ChatManager#sendMessage` 发送消息。

   `ChatOptions#serverTransfer` 的默认值为 `true`，SDK 会自动上传图片附件，服务器会自动生成缩略图。可以通过 `ChatMessageStatusCallback#onProgress` 获取上传进度，并通过 `onSuccess` 或 `onError` 获取最终发送结果。若关闭自动上传，需由应用自行处理附件，详见 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

创建和发送单聊图片消息的示例代码如下：

```typescript
// 图片选择完成后，将 URI 归一化为原生层可访问且不带 file:// 的本地路径。
const imagePath = '<local_image_path>';

if (imagePath.length === 0) {
  throw new Error('图片路径不能为空');
}

const imageMessage = ChatMessage.createImageMessage(
  'targetUserId',
  imagePath,
  ChatMessageChatType.PeerChat,
  {
    displayName: 'image.jpg',
    sendOriginalImage: false, // false 发送大图；true 发送原图。
    width: 1920,
    height: 1080,
  }
);

const imageCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId, progress) {
    console.log('图片上传进度：', localMsgId, progress);
  },
  onError(localMsgId, error) {
    console.error('图片消息发送失败：', localMsgId, error);
  },
  onSuccess(message) {
    console.log('图片消息发送成功：', message.msgId);
  },
};

try {
  await ChatClient.getInstance().chatManager.sendMessage(
    imageMessage,
    imageCallback
  );
} catch (error) {
  console.error('图片消息发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :---: | :--- |
| `targetId` | `string` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `filePath` | `string` | 必填 | 图片的本地文件路径。应确保 Android 或 iOS 原生层可以访问，建议传入不带 `file://` 前缀的真实本地路径。Android 选择器返回 `content://` URI 时，应先将文件复制到应用缓存等可访问目录，再传入复制后的本地路径。 |
| `chatType` | `ChatMessageChatType` | 可选 | 会话类型，默认值为 `ChatMessageChatType.PeerChat`。群聊和聊天室分别使用 `GroupChat` 和 `ChatRoom`。 |
| `displayName` | `string` | 可选 | 图片显示名称，建议包含文件扩展名。 |
| `sendOriginalImage` | `boolean` | 可选 | 是否发送原图，默认值为 `false`。`true` 上传原图，`false` 上传大图。 |
| `thumbnailLocalPath` | `string` | 可选 | 自定义缩略图的本地路径。通常无需设置，服务端会自动生成缩略图。 |
| `width` | `number` | 可选 | 图片宽度，单位为像素；未传入时消息体中的默认值为 `0`。 |
| `height` | `number` | 可选 | 图片高度，单位为像素；未传入时消息体中的默认值为 `0`。 |
| `fileSize` | `number` | 可选 | 图片文件大小，单位为字节。 |
| `isGif` | `boolean` | 可选 | 是否为 GIF 图片，默认值为 `false`。GIF 图片的发送方法详见 [发送 GIF 图片消息](#发送-gif-图片消息)。 |

:::tip
`sendOriginalImage` 是创建发送消息时使用的选项。`ChatImageMessageBody#isOriginalImage`、`bigImageLocalPath`、`bigImageRemotePath` 和 `bigImageDownloadStatus` 用于描述转换后的消息体或大图资源状态，不是 `createImageMessage` 的传入参数。
:::

### 发送 GIF 图片消息

- 自 React Native SDK 1.11.0 开始，支持发送 GIF 图片消息。
- GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。

发送 GIF 图片消息的过程如下：

1. 发送方调用 `ChatMessage#createImageMessage` 方法构造 GIF 图片消息体。
2. 发送方调用 `ChatManager#sendMessage` 发送 GIF 图片消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```typescript
const displayName = '<GIF_FILE_DISPLAY_NAME>';
const filePath = '<GIF_FILE_PATH>'; // GIF 文件的本地路径
const targetId = '<TARGET_ID>';
const chatType = ChatMessageChatType.PeerChat;
const message = ChatMessage.createImageMessage(
  targetId,
  filePath,
  chatType,
  { isGif: true, displayName: displayName, width: 100, height: 100 }
);
ChatClient.getInstance().chatManager.sendMessage(message, {
  onError(localMsgId, error) {
    console.log('Send message failed:', localMsgId, error);
  },
  onSuccess() {
    console.log('Send message succeeded');
  },
  onProgress(progress) {
    console.log('Send message progress:', progress);
  },
});
```

### 发送视频消息

发送视频消息前，需要在应用层选取或录制视频，并准备视频文件的本地路径和时长。为确保 Android 和 iOS 均能稳定展示视频缩略图，建议应用生成视频首帧缩略图并传入其本地路径。

#### 发送流程

发送视频消息的流程如下：

1. 在应用层选取或录制视频，获取原生层可访问且不带 `file://` 前缀的视频本地路径。
2. 按需生成视频首帧缩略图，并将其保存到原生层可访问的本地路径。
3. 调用 `ChatMessage#createVideoMessage` 创建视频消息。

   传入目标会话 ID、视频本地路径和会话类型，并通过可选参数设置显示名称、缩略图路径、视频时长（单位为秒）、缩略图尺寸和文件大小。

4. 调用 `ChatManager#sendMessage` 发送消息。

   当 `ChatOptions#serverTransfer` 为默认值 `true` 时，SDK 会自动上传视频附件；如果提供了缩略图，SDK 会一并处理缩略图，然后发送消息。可以通过 `ChatMessageStatusCallback` 获取上传进度和最终发送结果。

创建和发送单聊视频消息的示例代码如下：

```typescript
const videoPath = '<local_video_path>';
const thumbnailPath = '<local_thumbnail_path>';

if (videoPath.length === 0) {
  throw new Error('视频路径不能为空');
}

const videoMessage = ChatMessage.createVideoMessage(
  'targetUserId',
  videoPath,
  ChatMessageChatType.PeerChat,
  {
    displayName: 'video.mp4',
    thumbnailLocalPath: thumbnailPath,
    duration: 30,
    // RN 原生桥接将 width 和 height 设置为视频缩略图尺寸。
    width: 320,
    height: 180,
  }
);

const videoCallback: ChatMessageStatusCallback = {
  onProgress(localMsgId, progress) {
    console.log('视频上传进度：', localMsgId, progress);
  },
  onError(localMsgId, error) {
    console.error('视频消息发送失败：', localMsgId, error);
  },
  onSuccess(message) {
    console.log('视频消息发送成功：', message.msgId);
  },
};

try {
  await ChatClient.getInstance().chatManager.sendMessage(
    videoMessage,
    videoCallback
  );
} catch (error) {
  console.error('视频消息发送调用失败：', error);
}
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :---: | :--- |
| `targetId` | `string` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `filePath` | `string` | 必填 | 视频的本地文件路径。应确保 Android 或 iOS 原生层可以访问，建议不带 `file://` 前缀。 |
| `chatType` | `ChatMessageChatType` | 可选 | 会话类型，默认值为 `ChatMessageChatType.PeerChat`。群聊和聊天室分别使用 `GroupChat` 和 `ChatRoom`。 |
| `displayName` | `string` | 可选 | 视频附件的显示名称，建议包含文件扩展名。 |
| `thumbnailLocalPath` | `string` | 可选 | 视频缩略图的本地路径。为保证跨平台展示一致，建议传入应用生成的缩略图路径。 |
| `duration` | `number` | 可选 | 视频时长，单位为秒；未传入时消息体中的默认值为 `0`。业务展示视频时建议传入准确值。 |
| `width` | `number` | 可选 | 视频缩略图宽度，单位为像素；未传入时消息体中的默认值为 `0`。 |
| `height` | `number` | 可选 | 视频缩略图高度，单位为像素；未传入时消息体中的默认值为 `0`。 |
| `fileSize` | `number` | 可选 | 视频文件大小，单位为字节。 |

### 发送文件消息

1. 发送方调用 `createFileMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息。
2. 发送方调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```typescript
// 构建文件消息
// 文件消息主要需要本地文件地址和文件在页面显示的名称。
// 传入的文件路径时，不需要添加 file://。
const filePath = "data/.../foo.zip";
const displayName = "study_data.zip";
const msg = ChatMessage.createFileMessage(targetId, filePath, chatType, {
  displayName,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送位置消息

1. 发送方调用 `ChatMessage#createLocationMessage` 方法创建位置消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送位置消息。

当你要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。

```typescript
// 构建位置消息
// 位置消息可以传递经纬度和地名信息
const latitude = "114.78";
const longitude = "39,89";
const address = "darwin";
const msg = ChatMessage.createLocationMessage(
  targetId,
  latitude,
  longitude,
  chatType,
  { address }
);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `ChatMessage#createCmdMessage` 方法创建透传消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送透传消息。

```typescript
// 构建透传消息
// 根据透传消息可以执行具体的命令，命令的内容格式支持自定义
const action = "writing";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `ChatMessage#createCustomMessage` 方法创建自定义消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送自定义消息。

```typescript
// 构建自定义消息
// 消息内容由消息事件和扩展字段两部分组成，扩展字段用户可以自行实现和使用。
const event = "gift";
const ext = { key: "value" };
const msg = ChatMessage.createCustomMessage(targetId, event, chatType, {
  params: JSON.parse(ext),
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发，例如，发送聊天记录。

你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

你可以调用 `createCombineMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `chatType` | String | 会话类型：单聊、群聊或聊天室。  |
| `targetId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 消息话题会话：消息话题 ID；<br/> - 聊天室聊天：聊天室 ID。|
| `msgIdList` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |

:::tip

1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `ChatOptions.serverTransfer` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```typescript
// 构造合并消息。
const msg = ChatMessage.createCombineMessage(targetId, msgIdList, chatType, {
  title,
  summary,
  compatibleText,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 更多

### 上传消息附件至自有服务器

发消息时，若要将消息附件上传至你自己的服务器（而非环信服务器），需执行以下操作：

1. 在 SDK 初始化时将 `ChatOptions.serverTransfer` 设置为 `false`，使 SDK **不再自动上传或下载附件**。设置后，`ChatManager#sendMessage()` 将不再处理图片、视频等附件的自动处理与上传逻辑。
2. 图片上传到你的服务器后，将附件 URL 填入消息体，然后发送消息。
   以图片消息为例，图片上传到你的服务器后，将 `ChatImageMessageBody#remotePath` 设置为返回的图片 URL，然后调用 `sendMessage()` 发送消息。

```typescript
// 1) SDK 初始化时关闭“自动上传附件到环信服务器”
ChatClient.getInstance()
  .init(ChatOptions.withAppKey({ appKey: "test#test", serverTransfer: false }))
  .then()
  .catch();

// 自定义附件上传和发送消息方法
async function uploadAndSendImageMessage() {
  // 例如：图片服务器地址
  const remoteUrl = "https://www.example.com/path/to/your/image.jpg";
  const localPath = "/local/path/to/your/image.jpg";

  // 例如：上传图片到你的服务器
  // await yourUploadFunction(localPath, remoteUrl);

  // 上传图片完成，发送消息
  const targetId = "targetUserId";
  const filePath = localPath;
  const chatType = 0; // 0.singleChat, 1.groupChat, 2.chatRoom
  const message = ChatMessage.createImageMessage(targetId, filePath, chatType);
  (message.body as ChatImageMessageBody).remotePath = remoteUrl; // 设置远程 URL
  (message.body as ChatImageMessageBody).displayName = "image.jpg"; // 可选 设置显示名称
  const callback = {
    onError(localMsgId, error) {
      console.log("Failed to send image message:", localMsgId, error);
    },
    onSuccess(msg) {
      console.log("Image message sent successfully:", msg);
    },
  } as ChatMessageStatusCallback;
  ChatClient.getInstance()
    .chatManager.sendMessage(message, callback)
    .then()
    .catch();
}

// 2) 调用 uploadAndSendImageMessage 发送图片消息
uploadAndSendImageMessage();
```

:::tip
接收端收到消息后，可通过 `(message.body as ChatImageMessageBody).remotePath` 取到你的 URL，然后用你自己的下载/展示逻辑处理（因为你已关闭 SDK 自动附件传输）。
:::

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```typescript
// 对于聊天室消息，还可以设置消息优先级。
if (msg.chatType === ChatMessageChatType.ChatRoom) {
  msg.messagePriority = priority;
}
```

### 语聊房麦位管理

基于 [聊天室自定义属性](room_attributes.html)，实现语聊房的麦位状态管理与多端实时同步。将麦位列表（含用户信息、麦位状态、音量等字段）作为房间属性存储，任何麦位变更通过更新属性触发全房间广播，确保所有客户端状态一致。详见 [聊天室自定义属性](room_attributes.html)。

### 获取发送附件消息的进度

发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.sendMessage(msg, {
    onProgress(localMsgId: string, progress: number): void {
      console.log("send message progress.");
    },
  } as ChatMessageStatusCallback)
  .then()
  .catch();
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需 **联系环信商务开通权限**，并在初始化 SDK 时将 `ChatOptions#useReplacedMessageContents` 参数设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](/product/limitation.html#消息大小)。
