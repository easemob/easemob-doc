# 发送消息

## 功能说明

环信即时通讯 IM Flutter SDK 通过 `ChatMessage` 创建消息，并通过 `ChatManager` 发送消息。SDK 支持文本、图片、GIF、语音、视频、文件、位置、透传、自定义和合并消息，可用于单聊、群聊和聊天室。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

各类消息均按照以下流程发送：

1. 调用 `ChatMessage` 对应的命名构造方法，设置消息内容、目标会话 ID 和会话类型。
2. 按业务需要设置扩展字段、已读回执、仅在线投递、定向接收成员、聊天室消息优先级或回调环境等可选属性。
3. 如需监听最终发送结果或附件上传进度，调用 `ChatManager.addMessageEvent` 注册 `ChatMessageEvent`。
4. 调用 `ChatManager.sendMessage` 发起发送。
5. 页面或组件销毁时，调用 `ChatManager.removeMessageEvent` 移除监听器。

:::tip
`await ChatManager.sendMessage(message)` 表示消息已提交给原生 SDK，并不表示服务端发送已经成功。最终的发送成功、失败和附件上传进度以 `ChatMessageEvent` 的 `onSuccess`、`onError` 和 `onProgress` 回调为准。
:::

## 通用消息创建参数

Flutter SDK 通过 `ChatMessage` 的不同命名构造方法创建各类消息。不同消息类型的构造参数不完全相同；创建消息后，还可以设置消息的通用属性。

| 参数或属性 | Flutter 设置方式 | 是否必需 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- |
| 目标会话 ID | 各 `create*SendMessage` 的 `targetId` 参数，或 `createSendMessage` 的 `to` 参数 | 必需 | 所有消息 | 单聊时传入对端用户 ID，群聊时传入群组 ID，聊天室时传入聊天室 ID。 |
| 消息内容 | 各消息构造方法的内容参数，或 `createSendMessage` 的 `body` 参数 | 必需 | 所有消息 | 参数随消息类型而不同，例如文本内容、附件路径、位置坐标、透传命令或自定义事件。 |
| 会话类型 | `chatType` 参数 | 群聊和聊天室必需 | 所有消息 | 单聊、群聊和聊天室分别为 `ChatType.Chat`、`ChatType.GroupChat` 和 `ChatType.ChatRoom`，默认值为 `ChatType.Chat`。 |
| 扩展字段 | `ChatMessage.attributes` | 可选 | 所有消息 | 类型为 `Map<String, dynamic>?`，用于携带业务附加信息；扩展字段会计入消息大小限制。 |
| 仅在线投递 | `ChatMessage.deliverOnlineOnly` | 可选 | 所有消息 | 设置为 `true` 时，消息仅投递给在线用户，离线用户不会收到该消息。透传消息也可通过 `createCmdSendMessage` 的同名参数设置。 |
| 回调路由环境 | `ChatMessage.webhookEnv` | 可选 | 所有消息 | 设置 Webhook 回调环境标识，服务端根据该值匹配回调路由。 |
| 聊天室消息优先级 | `ChatMessage.chatroomMessagePriority` | 可选 | 聊天室消息 | 可设为 `High`、`Normal` 或 `Low`；未设置时为普通优先级。 |
| 定向接收成员 | `ChatMessage.receiverList` | 可选 | 群聊和聊天室消息 | 类型为 `List<String>?`。是否可用还受相应服务端功能配置和使用限制约束。 |
| 是否需要已读回执 | `ChatMessage.isNeedReadReceipt` | 可选 | 单聊和群聊消息 | Flutter SDK 5.0.0 按消息设置是否需要已读回执；聊天室不支持消息已读回执。 |

## 接口频率限制

默认情况下，SDK 不限制单个用户发送消息的频率。如果已联系环信商务配置单用户发送频率限制，当用户在单聊、群聊或聊天室中的发送频率超过上限时，SDK 会返回错误码 `509`（`MESSAGE_CURRENT_LIMITING`）。

## 发送文本消息

#### 发送流程

1. 调用 `ChatMessage.createTxtSendMessage` 创建文本消息。

   创建消息时传入文本内容和目标会话 ID。单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。通过 `chatType` 设置会话类型，默认值为单聊 `ChatType.Chat`。

   创建消息时，还可通过 `targetLanguages` 指定自动翻译的目标语言。创建消息后，可根据业务需要设置扩展字段、仅在线投递、定向接收成员、已读回执、消息优先级和回调路由环境等属性。部分属性仅适用于特定会话类型，例如：

   - `ChatMessage.receiverList` 仅适用于群聊和聊天室定向消息。
   - `ChatMessage.chatroomMessagePriority` 仅适用于聊天室消息。
   - `ChatMessage.isNeedReadReceipt` 适用于单聊和群聊消息，不支持聊天室。
   - 群聊和聊天室消息需要将 `chatType` 分别设为 `ChatType.GroupChat` 和 `ChatType.ChatRoom`。

2. 调用 `ChatManager.sendMessage` 发送文本消息。

   如需获取发送结果，可在发送前调用 `ChatManager.addMessageEvent` 注册 `ChatMessageEvent`。通过回调中的本地消息 ID 匹配当前发送的消息，发送成功、失败分别由 `onSuccess` 和 `onError` 通知。

创建和发送文本消息的示例代码如下：

```dart
// 创建文本消息：单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID
final ChatMessage message = ChatMessage.createTxtSendMessage(
  targetId: conversationId,
  content: 'Hello!',
  // 单聊默认为 Chat；群聊和聊天室需分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 保存发送前的本地消息 ID，用于筛选当前消息的状态回调
final String localMsgId = message.msgId;
const String handlerId = 'text_message_event';
final ChatManager chatManager = ChatClient.getInstance.chatManager;

// 注册发送状态监听器，应在发送消息前完成
chatManager.addMessageEvent(
  handlerId,
  ChatMessageEvent(
    onSuccess: (String msgId, ChatMessage sentMessage) {
      if (msgId != localMsgId) return;
      // 消息发送成功，sentMessage.msgId 为发送成功后的消息 ID
    },
    onError: (String msgId, ChatMessage failedMessage, ChatError error) {
      if (msgId != localMsgId) return;
      // 消息发送失败，根据 error.code 和 error.description 处理
    },
    onProgress: (String msgId, int progress) {
      if (msgId != localMsgId) return;
      // 文本消息通常不涉及附件上传进度
    },
  ),
);

// 发起发送，不将 Future 完成视为最终发送成功
try {
  await chatManager.sendMessage(message);
} on ChatError catch (error) {
  // 消息提交失败时处理此异常，不依赖后续状态回调
  print('提交文本消息失败：${error.code}，${error.description}');
}

// 在页面或组件销毁时调用，不要在 sendMessage 返回后立即移除
void disposeTextMessageEvent() {
  chatManager.removeMessageEvent(handlerId);
}
```

#### 关键参数和属性

| 参数或属性 | 类型 | 设置方式 | 必填/可选 | 适用场景 | 说明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 文本内容 | `String` | `content` | 必填 | 文本消息 | 文本消息正文。 |
| 目标会话 ID | `String` | `targetId` | 必填 | 所有会话类型 | 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| 会话类型 | `ChatType` | `chatType` | 群聊和聊天室必填 | 所有会话类型 | 默认为 `ChatType.Chat`。 |
| 目标翻译语言 | `List<String>?` | `targetLanguages` | 可选 | 文本消息 | 目标语言代码列表。 |
| 扩展字段 | `Map<String, dynamic>?` | `message.attributes` | 可选 | 业务扩展信息 | 用于携带业务附加信息。 |
| 仅在线投递 | `bool` | `message.deliverOnlineOnly` | 可选 | 瞬时消息、状态通知 | 设置为 `true` 时仅投递给在线用户。 |
| 回调路由环境 | `String?` | `message.webhookEnv` | 可选 | 多环境回调路由 | 设置 Webhook 回调环境标识。 |
| 定向接收成员 | `List<String>?` | `message.receiverList` | 可选 | 群聊、聊天室定向消息 | 指定群聊或聊天室消息的接收成员。 |
| 是否需要已读回执 | `bool` | `message.isNeedReadReceipt` | 可选 | 单聊、群聊 | 接收方发送回执前，该属性必须为 `true`。 |
| 消息优先级 | `ChatRoomMessagePriority` | `message.chatroomMessagePriority` | 可选 | 聊天室消息 | 设置聊天室消息优先级。 |

#### 带群消息已读回执和扩展字段的示例

对于带有业务属性的文本消息，可通过 `ChatMessage.attributes` 添加扩展字段。

群聊场景下，如需统计群成员的消息已读情况，在发送前将 `ChatMessage.isNeedReadReceipt` 设为 `true`。接收方需调用 `ChatManager.sendMessageReadReceipts` 批量发送消息已读回执。扩展字段和已读回执的具体使用方式，详见 [消息扩展文档](message_extension.html) 和 [消息回执文档](message_receipt.html)。

```dart
// 创建群聊文本消息，groupId 为群组 ID
final ChatMessage message = ChatMessage.createTxtSendMessage(
  targetId: groupId,
  content: '大家好',
  // 将会话类型设为群聊
  chatType: ChatType.GroupChat,
);
// 添加业务扩展字段
message.attributes = <String, dynamic>{
  'bizType': 'announcement',
};
// 设置该消息需要已读回执
message.isNeedReadReceipt = true;

// 发起发送，发送结果通过 ChatMessageEvent 监听
await ChatClient.getInstance.chatManager.sendMessage(message);
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括图片、GIF、语音、视频和文件消息。

#### 发送流程

发送附件消息分为以下两步：

1. 准备原生 Android 或 iOS 层可访问的本地附件路径，调用对应的 `ChatMessage.create*SendMessage` 创建消息，再调用 `ChatManager.sendMessage` 发起发送。
2. SDK 将附件上传到环信服务器，并通过 `ChatMessageEvent` 通知上传进度和最终发送结果。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

#### 资源处理说明

`ChatOptions.serverTransfer` 默认为 `true`。调用 `ChatManager.sendMessage` 后，SDK 会自动将本地附件上传至环信服务器；接收端也可由 SDK 自动下载附件。将该配置设为 `false` 后，需要应用自行上传和下载附件。消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息的流程如下：

1. 获取图片的本地文件路径。
2. 调用 `ChatMessage.createImageSendMessage` 创建图片消息。

   创建消息时，需要传入图片的本地文件路径、是否发送原图的标志，以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID，并设置对应的 `chatType`。

   `sendOriginalImage` 参数用于控制实际上传的图片资源：`true` 表示 SDK 上传原图，`false` 表示允许 SDK 按需压缩后上传大图。Flutter SDK 默认值为 `false`。

3. 调用 `ChatManager.sendMessage` 发送消息。
   
   `serverTransfer` 为 `true` 时，SDK 自动上传图片，服务器自动生成缩略图。关于图片的上传进度，详见 [获取发送附件消息的进度](#获取发送附件消息的进度)。

创建和发送图片消息的示例代码如下：

```dart
// filePath 为应用选取的图片文件路径，原生 Android 或 iOS 层必须可访问
if (filePath.isEmpty) {
  throw ArgumentError.value(filePath, 'filePath', '图片路径不能为空');
}

// 创建图片消息
final ChatMessage message = ChatMessage.createImageSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  filePath: filePath,
  displayName: displayName,
  // false 表示允许 SDK 按需压缩；true 表示发送原图
  sendOriginalImage: false,
  // 设置会话类型：单聊、群聊和聊天室分别为 Chat、GroupChat 和 ChatRoom
  // 单聊默认为 Chat；发送群聊或聊天室消息时，需要设置对应类型
  chatType: ChatType.Chat,
);

// 发送图片消息，默认情况下 SDK 会自动上传图片附件
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

// TODO：`fileSize` 这个参数先不写，是吗？

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `filePath` | `String` | 必填 | 图片的本地路径，原生层必须可访问。 |
| `displayName` | `String?` | 可选 | 图片显示名称，建议传入。 |
| `thumbnailLocalPath` | `String?` | 可选 | 自定义缩略图的本地路径。 |
| `sendOriginalImage` | `bool` | 可选 | 是否发送原图，默认为 `false`。 |
| `isGif` | `bool` | 可选 | 是否为 GIF 图片，默认为 `false`。 |
| `fileSize` | `int?` | 可选 | 图片大小，单位为字节。5.0.0 的公开构造方法虽然保留该参数，但当前实现未将其写入 `ChatImageMessageBody`；不要依赖该参数设置图片大小。 |
| `width`、`height` | `double?` | 可选 | 图片宽度和高度，单位为像素。 |
| `chatType` | `ChatType` |  群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

### 发送 GIF 图片

GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。调用 `ChatMessage.createImageSendMessage` 创建消息时，将 `isGif` 设置为 `true`，SDK 会自动按原图发送，无需另行设置 `sendOriginalImage`。

#### 发送流程

发送 GIF 图片消息的过程如下：

1. 调用 `ChatMessage.createImageSendMessage` 创建 GIF 图片消息。

   传入原始 GIF 文件的本地路径和目标会话 ID，并将 `isGif` 设为 `true`。单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID；群聊或聊天室还需设置对应的 `chatType`。

2. 调用 `ChatManager.sendMessage` 发送 GIF 图片消息。

   默认情况下，SDK 将 GIF 原图上传至环信服务器，服务器自动生成图片缩略图。上传进度和最终发送结果通过 `ChatMessageEvent` 获取。

创建和发送 GIF 图片消息的示例代码如下：

```dart
// gifPath 为原始 GIF 文件的本地路径，不要先将 GIF 压缩成静态图片
final ChatMessage message = ChatMessage.createImageSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  filePath: gifPath,
  displayName: 'animation.gif',
  // 标记为 GIF，SDK 会自动按原图发送
  isGif: true,
  // 群聊和聊天室需分别设为 GroupChat 和 ChatRoom，默认是单聊 Chat
  chatType: ChatType.Chat,
);

// 发起发送，默认情况下 SDK 会自动上传 GIF 附件
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `filePath` | `String` | 必填 | GIF 文件的本地路径。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `isGif` | `bool` | 必填 | GIF 消息必须设置为 `true`。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

### 发送语音消息

#### 发送流程

1. 在应用层录制语音文件。

   应用需自行完成录音权限申请、录音和时长获取，并准备原生层可访问的本地文件路径。SDK 不提供录音功能。

2. 调用 `ChatMessage.createVoiceSendMessage` 创建语音消息。

   传入语音文件的本地路径、语音时长（单位为秒）和接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID，并设置对应的 `chatType`。建议填写实际录音时长，以便接收端正确展示。

3. 调用 `ChatManager.sendMessage` 发送语音消息。

   默认情况下，SDK 会将语音文件上传至环信服务器。通过 `ChatMessageEvent` 获取上传进度和最终发送结果，详见 [获取发送附件消息的进度](#获取发送附件消息的进度)。

创建和发送语音消息的示例代码如下：

```dart
// voicePath 为录制完成的语音文件路径，duration 为实际语音时长，单位为秒
final ChatMessage message = ChatMessage.createVoiceSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  filePath: voicePath,
  duration: duration,
  // 文件名建议包含与实际录音格式一致的后缀
  displayName: 'voice.m4a',
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送语音消息，默认情况下 SDK 会自动上传语音文件
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `filePath` | `String` | 必填 | 语音文件的本地路径。 |
| `duration` | `int` | 可选 | 语音时长，单位为秒，默认值为 `0`。 |
| `displayName` | `String?` | 可选 | 文件名，建议包含格式后缀。 |
| `fileSize` | `int?` | 可选 | 文件大小，单位为字节。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。|
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

### 发送视频消息

发送视频消息前，需要在应用层准备视频文件、视频时长以及可选的视频缩略图。缩略图通常使用视频首帧。其中，缩略图和时长主要用于消息展示。

#### 发送流程

发送视频消息的流程如下：

1. 在应用层完成视频文件的选取或录制，并准备视频文件的本地路径、视频时长和可选的缩略图路径。

   视频时长的单位为秒。若需要显示视频缩略图，你需要自行获取视频首帧，并准备原生层可访问的缩略图文件路径。

2. 调用 `ChatMessage.createVideoSendMessage` 创建视频消息。

   创建消息时，传入视频文件的本地路径、视频时长和接收方的用户 ID；通过 `thumbnailLocalPath` 传入缩略图路径。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID，并设置对应的 `chatType`。

3. 调用 `ChatManager.sendMessage` 发送消息。

   默认情况下，SDK 会先上传视频附件，上传完成后再发送消息。通过 `ChatMessageEvent` 获取附件上传进度和最终发送结果，详见 [获取发送附件消息的进度](#获取发送附件消息的进度)。

创建和发送视频消息的示例代码如下：

```dart
// videoPath 为选取或录制的视频文件路径，duration 为视频时长，单位为秒
// thumbnailPath 为应用自行生成的视频首帧缩略图路径，不是 SDK 提供的文件
final ChatMessage message = ChatMessage.createVideoSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  filePath: videoPath,
  displayName: 'video.mp4',
  duration: duration,
  // 如需展示缩略图，传入本地缩略图路径
  thumbnailLocalPath: thumbnailPath,
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送视频消息，默认情况下 SDK 会自动上传视频附件
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `filePath` | `String` | 必填 | 视频文件的本地路径。 |
| `thumbnailLocalPath` | `String?` | 可选 | 视频缩略图的本地路径，由应用层生成。 |
| `duration` | `int` | 可选 | 视频时长，单位为秒，默认值为 `0`。 |
| `displayName` | `String?` | 可选 | 视频文件名。 |
| `fileSize` | `int?` | 可选 | 视频文件大小，单位为字节。 |
| `width`、`height` | `double?` | 可选 | 缩略图宽度和高度，单位为像素。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

### 发送文件消息

#### 发送流程

1. 调用 `ChatMessage.createFileSendMessage` 创建文件消息。

   传入文件的本地路径和接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID，并设置对应的 `chatType`。文件路径需可由原生 Android 或 iOS 层访问；还可通过 `displayName` 和 `fileSize` 设置文件显示名称和大小（单位为字节）。

2. 调用 `ChatManager.sendMessage` 发送消息。

   默认情况下，SDK 会将文件上传至环信服务器。通过 `ChatMessageEvent` 获取附件上传进度和最终发送结果，详见 [获取发送附件消息的进度](#获取发送附件消息的进度)。

创建和发送文件消息的示例代码如下：

```dart
// filePath 为待发送文件的本地路径
final ChatMessage message = ChatMessage.createFileSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  filePath: filePath,
  // 可选：文件显示名称
  displayName: displayName,
  // 可选：文件大小，单位为字节
  fileSize: fileSize,
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送文件消息，默认情况下 SDK 会自动上传文件附件
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `filePath` | `String` | 必填 | 文件的本地路径。 |
| `displayName` | `String?` | 可选 | 文件显示名称，建议传入。 |
| `fileSize` | `int?` | 可选 | 文件大小，单位为字节。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

### 上传消息附件至自有服务器

若要将消息附件上传至自有服务器，而非环信服务器，可按以下方式处理：

1. SDK 初始化时将 `ChatOptions.serverTransfer` 设为 `false`，关闭 SDK 的附件自动上传和下载。
2. 应用自行上传附件，获取可访问的 URL。
3. 创建附件消息体，将 URL 赋给消息体的 `remotePath`，再通过 `ChatMessage.createSendMessage` 构造并发送消息。
4. 接收端从附件消息体的 `remotePath` 读取 URL，并自行下载和展示资源。

```dart
Future<void> initSDK() async {
  final ChatOptions options = ChatOptions.withAppKey(
    'your_app_key',
    serverTransfer: false,
  );
  await ChatClient.getInstance.init(options);
}

Future<void> sendUrlImage({
  required String targetId,
  required String imageUrl,
  String localPathForPreview = '',
}) async {
  final ChatImageMessageBody body = ChatImageMessageBody(
    localPath: localPathForPreview,
    displayName: 'image.png',
  )..remotePath = imageUrl;

  final ChatMessage message = ChatMessage.createSendMessage(
    to: targetId,
    chatType: ChatType.Chat,
    body: body,
  );

  await ChatClient.getInstance.chatManager.sendMessage(message);
}
```

:::tip
`serverTransfer` 是 SDK 初始化选项，应在调用 `ChatClient.getInstance.init(options)` 前确定。设为 `false` 后，发送端和接收端都需要自行处理附件传输；请不要仅设置 `remotePath` 却仍依赖 SDK 自动下载。
:::

## 发送位置消息

发送位置消息时，应用需要先集成第三方地图服务，获取经纬度和地址信息。Flutter SDK 只负责封装和发送位置消息，不提供定位或地图展示能力。

#### 发送流程

1. 调用 `ChatMessage.createLocationSendMessage` 创建位置消息。

   传入通过第三方地图服务获取的纬度 `latitude`、经度 `longitude` 和目标会话 ID。还可通过 `address` 和 `buildingName` 设置位置文字描述和建筑物名称。单聊、群聊和聊天室分别传入对端用户 ID、群组 ID 和聊天室 ID，并设置对应的 `chatType`。

2. 调用 `ChatManager.sendMessage` 发送消息。

   位置消息不上传地图图片或定位资源；经纬度和文字描述随消息发送。发送结果可通过 `ChatMessageEvent` 监听。

创建和发送位置消息的示例代码如下：

```dart
// latitude 为纬度，longitude 为经度，locationAddress 为具体位置描述
// 坐标和地址由应用接入的第三方地图服务提供
final ChatMessage message = ChatMessage.createLocationSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  latitude: latitude,
  longitude: longitude,
  address: locationAddress,
  // 可选：建筑物名称
  buildingName: buildingName,
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送位置消息
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `latitude` | `double` | 必填 | 纬度。 |
| `longitude` | `double` | 必填 | 经度。 |
| `address` | `String?` | 可选 | 位置文字描述。 |
| `buildingName` | `String?` | 可选 | 建筑物名称。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

#### 逻辑说明

应用需自行申请定位权限、获取坐标，并在接收端根据业务需要调用地图服务展示位置。不要将隐私或不必要的业务信息写入位置消息体。

## 发送透传消息

透传消息也称命令消息，可用于通知对方执行自定义操作，例如刷新头像或昵称。以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，请勿使用。

:::tip
- 透传消息发送后不支持撤回。
- 透传消息不会存入本地数据库，也不会创建本地会话，因此通常不在 UI 中显示。
:::

#### 发送流程

发送透传消息的过程如下：

1. 调用 `ChatMessage.createCmdSendMessage` 创建透传消息。

   通过 `action` 设置接收方需要处理的命令动作，例如 `refresh_profile`。传入目标会话 ID，并通过 `chatType` 设置会话类型：单聊、群聊和聊天室分别为 `ChatType.Chat`、`ChatType.GroupChat` 和 `ChatType.ChatRoom`。

   若命令只对在线用户有意义，可将 `deliverOnlineOnly` 设为 `true`；离线用户不会收到该消息。默认值为 `false`。

2. 调用 `ChatManager.sendMessage` 发送消息。

   接收端通过 `ChatEventHandler.onCmdMessagesReceived` 获取透传消息，并根据 `ChatCmdMessageBody.action` 执行业务操作，详见 [接收消息](message_receive.html)。

创建和发送透传消息的示例代码如下：

```dart
// 创建透传消息，命令动作由业务双方约定
final ChatMessage message = ChatMessage.createCmdSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  // 不使用以 em_ 或 easemob:: 开头的内部保留命令
  action: 'refresh_profile',
  // 可选：仅投递给在线用户，默认为 false
  deliverOnlineOnly: true,
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送透传消息
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `action` | `String` | 必填 | 命令动作；不能以 `em_` 或 `easemob::` 开头。 |
| `deliverOnlineOnly` | `bool` | 可选 | 是否仅投递给在线用户，默认为 `false`。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

## 发送自定义类型消息

自定义消息通过事件名称和字符串键值对承载业务数据，例如礼物、投票或互动事件。

#### 发送流程

1. 调用 `ChatMessage.createCustomSendMessage` 创建自定义消息。

   通过 `event` 设置业务约定的自定义事件类型，例如礼物消息使用 `gift`。通过 `params` 添加事件所需的键值对，类型为 `Map<String, String>`；若参数值包含数组或对象，需先序列化为字符串。

   传入目标会话 ID，并设置对应的 `chatType`。单聊、群聊和聊天室分别传入对端用户 ID、群组 ID 和聊天室 ID。

2. 调用 `ChatManager.sendMessage` 发送消息。

   接收端通过 `ChatEventHandler.onMessagesReceived` 获取消息，将消息体作为 `ChatCustomMessageBody` 读取，并根据 `event` 和 `params` 处理业务逻辑，详见 [接收消息](message_receive.html)。

创建和发送自定义消息的示例代码如下：

```dart
// 创建自定义消息，event 和 params 的含义由业务双方约定
final ChatMessage message = ChatMessage.createCustomSendMessage(
  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID
  targetId: conversationId,
  // 设置自定义事件类型，例如 gift 表示礼物消息
  event: 'gift',
  // params 类型为 Map<String, String>，键和值均为字符串
  params: <String, String>{
    'giftId': 'rose',
    'count': '1',
  },
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 发送自定义消息
await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `event` | `String` | 必填 | 自定义消息的事件类型。 |
| `params` | `Map<String, String>?` | 可选 | 自定义消息携带的字符串键值对。复杂结构需要先序列化为字符串。 |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

## 发送合并消息

合并消息可将多条已有消息作为聊天记录一起转发。

#### 发送流程

1. 准备需要合并转发的原始消息 ID 列表。
2. 调用 `ChatMessage.createCombineSendMessage` 利用原始消息列表创建合并消息。
3. 调用 `ChatManager.sendMessage` 发送消息。

```dart
final ChatMessage message = ChatMessage.createCombineSendMessage(
  targetId: conversationId,
  title: 'A 和 B 的聊天记录',
  summary: 'A：你好\nB：你好',
  compatibleText: '当前版本不支持合并消息，请升级到最新版本',
  msgIds: messageIds,
  chatType: ChatType.Chat,
);

await ChatClient.getInstance.chatManager.sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `targetId` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |
| `title` | `String?` | 可选 | 合并消息标题。 |
| `summary` | `String?` | 可选 | 合并消息概要。 |
| `compatibleText` | `String?` | 可选 | 低版本不支持合并消息时展示的兼容文本。 |
| `msgIds` | `List<String>` | 必填 | 原始消息 ID 列表，每层最多 300 条。 |
| `chatType` | `ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊。单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。 |

#### 逻辑说明

:::tip
1. 合并转发最多支持 10 层嵌套，每层最多 300 条消息。
2. 无论 `ChatOptions.serverTransfer` 为 `true` 还是 `false`，SDK 都会将合并消息附件上传至环信服务器。
3. 合并消息不支持搜索。
4. 将收到的合并消息继续转发给其他用户时，应使用转发单条消息的 API，详见 [转发单条消息](message_forward.html#转发单条消息)。
:::

#### 使用建议

合并消息适用于转发聊天记录等场景。创建合并消息前，应确认消息 ID 列表非空且不超过 300 条。为兼容不支持合并消息的旧版本，建议同时提供 `title`、`summary` 和 `compatibleText`。

## 发送过程回调

#### 使用说明

通过 `ChatManager.addMessageEvent` 注册 `ChatMessageEvent`，可以监听消息发送成功、失败和附件上传进度。监听器由字符串标识管理，同一监听器会收到消息通道上的相关状态事件；业务应使用回调中的 `msgId` 与发送前保存的本地消息 ID 进行匹配。

对于附件消息，`onProgress` 中的 `progress` 表示上传进度百分比。

#### 示例代码

```dart
const String handlerId = 'chat_page_message_event';
final ChatManager chatManager = ChatClient.getInstance.chatManager;

chatManager.addMessageEvent(
  handlerId,
  ChatMessageEvent(
    onSuccess: (String localMsgId, ChatMessage message) {
      // 发送成功。message.msgId 为服务端生成或更新后的消息 ID。
    },
    onError: (
      String localMsgId,
      ChatMessage message,
      ChatError error,
    ) {
      // 发送失败，根据 error.code 和 error.description 处理。
    },
    onProgress: (String localMsgId, int progress) {
      // 附件上传进度，取值范围为 0-100。
    },
  ),
);

final ChatMessage message = ChatMessage.createImageSendMessage(
  targetId: conversationId,
  filePath: filePath,
);
await chatManager.sendMessage(message);

// 在页面或组件的 dispose 生命周期中移除监听器，而不是在
// sendMessage 返回后立即移除。
void disposeMessageEvent() {
  chatManager.removeMessageEvent(handlerId);
}
```

#### 回调参数说明

| 回调 | 说明 |
| :--- | :--- |
| `onSuccess(String msgId, ChatMessage msg)` | 消息最终发送成功时触发。`msgId` 是发送前的本地消息 ID，`msg` 是发送完成后的消息对象。 |
| `onError(String msgId, ChatMessage msg, ChatError error)` | 消息最终发送失败时触发，`error` 包含错误码和错误描述。 |
| `onProgress(String msgId, int progress)` | 附件上传过程中触发，`progress` 为 `0-100` 的百分比。无附件消息通常不会产生有效进度。 |

#### 逻辑说明

`ChatManager.sendMessage` 不接收回调参数。应用应先注册消息事件监听器，再发送消息，并在不再需要监听时移除。不要把 `sendMessage` 返回的 `Future` 完成误当作服务端发送成功。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

聊天室消息支持高、普通和低三种优先级：

- `ChatRoomMessagePriority.High`：高优先级。
- `ChatRoomMessagePriority.Normal`：普通优先级，默认值。
- `ChatRoomMessagePriority.Low`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器会优先处理高优先级消息，并优先丢弃低优先级消息。优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。在聊天室消息并发量过大的情况下，高优先级消息仍可能被丢弃。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：

1. 服务器优先丢弃低优先级消息，尽量保留高优先级消息。
2. 同一优先级的消息超过限制时，服务器按照消息发送时间顺序处理，后发送的消息可能被丢弃。

```dart
// 创建文本消息。
final ChatMessage message = ChatMessage.createTxtSendMessage(
  targetId: roomId,
  content: '重要公告',
  chatType: ChatType.ChatRoom,
);
// 设置聊天室消息优先级。
// 未设置时，默认值为 Normal。
message.chatroomMessagePriority = ChatRoomMessagePriority.High;
await ChatClient.getInstance.chatManager.sendMessage(message);
```

:::tip
`chatroomMessagePriority` 仅对聊天室消息有效，不适用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步，例如记录麦位用户、麦位状态和音量状态等信息。

Flutter SDK 的聊天室自定义属性采用 `Map<String, String>` 格式，键和值均为字符串。因此，麦位列表或其他结构化数据不能直接作为数组、`Map` 或自定义对象写入。应用可以采用以下方式存储：

- 每个麦位使用一个独立属性，属性 Key 表示麦位编号，Value 为序列化后的麦位信息。
- 将麦位列表序列化为 JSON 字符串后，作为单个属性值写入。

例如，调用 `ChatRoomManager.addAttributes` 设置单个麦位属性。示例中的 `roomId` 为已加入的聊天室 ID，`userId` 为麦位用户 ID：

```dart
import 'dart:convert';
import 'package:im_flutter_sdk/im_flutter_sdk.dart';

Future<void> setSeatAttribute({
  required String roomId,
  required String userId,
}) async {
  // 属性值必须是字符串，将麦位用户、状态和音量序列化为 JSON
  final Map<String, String> attributes = <String, String>{
    'seat_1': jsonEncode(<String, dynamic>{
      'userId': userId,
      'state': 'open',
      'volume': 0,
    }),
  };

  try {
    // addAttributes 用于设置或更新聊天室自定义属性
    final Map<String, int>? failureKeys =
        await ChatClient.getInstance.chatRoomManager.addAttributes(
      roomId,
      attributes: attributes,
      // false：退出聊天室时不自动删除当前成员设置的属性
      deleteWhenLeft: false,
      // false：不强制覆盖其他成员设置的同名属性
      overwrite: false,
    );

    // 返回值只包含设置失败的属性，键为属性名，值为失败错误码
    // Future 完成不代表所有属性均设置成功，还需检查 failureKeys
    if (failureKeys != null && failureKeys.isNotEmpty) {
      failureKeys.forEach((String key, int code) {
        print('设置麦位属性失败：$key，错误码：$code');
      });
    } else {
      print('麦位属性设置成功');
    }
  } on ChatError catch (error) {
    // 处理请求整体失败，例如无权限或网络异常
    print('设置麦位属性失败：${error.code}，${error.description}');
  }
}
```

设置或更新聊天室自定义属性后，聊天室内其他成员可通过 `ChatRoomEventHandler.onAttributesUpdated` 监听属性变更，并更新本地麦位状态。调用 `ChatRoomManager.addEventHandler` 注册监听器，回调参数分别为聊天室 ID、本次更新的属性和操作成员的用户 ID：

```dart
import 'dart:convert';
import 'package:im_flutter_sdk/im_flutter_sdk.dart';

void registerSeatListener(String roomId) {
  // 使用唯一标识注册监听器，建议在设置属性前完成注册
  ChatClient.getInstance.chatRoomManager.addEventHandler(
    'voice_room_seat_event_$roomId',
    ChatRoomEventHandler(
      onAttributesUpdated: (
        String chatRoomId,
        Map<String, String> attributes,
        String from,
      ) {
        // 只处理当前聊天室的属性变化
        if (chatRoomId != roomId) return;

        // attributes 是本次更新的属性，不是聊天室的完整属性集合
        final String? seatJson = attributes['seat_1'];
        if (seatJson == null) return;

        try {
          final dynamic seat = jsonDecode(seatJson);
          if (seat is! Map<String, dynamic>) return;
          print('麦位用户：${seat['userId']}，麦位状态：${seat['state']}');
          // 将本次更新合并到本地麦位数据，并按业务需要刷新界面
        } on FormatException catch (error) {
          // 避免其他成员写入的非法 JSON 中断事件处理
          print('麦位属性格式错误：$error');
        }
      },
    ),
  );
}

// 在页面或组件销毁时调用，使用注册时的同一标识移除监听器
void removeSeatListener(String roomId) {
  ChatClient.getInstance.chatRoomManager.removeEventHandler(
    'voice_room_seat_event_$roomId',
  );
}
```

进入聊天室时，可调用 `fetchChatRoomAttributes` 获取初始属性；之后通过属性变更回调合并更新。若业务涉及移除麦位属性，还需处理 `onAttributesRemoved` 回调。具体实现方式、覆盖权限和使用限制，详见 [聊天室自定义属性](room_attributes.html)。

#### 获取发送附件消息的进度

发送图片、GIF、语音、视频或文件等附件消息时，可以通过 `ChatManager.addMessageEvent` 注册 `ChatMessageEvent`，在 `onProgress` 回调中获取附件上传进度。应先注册监听器，再调用 `ChatManager.sendMessage`。

`progress` 的取值范围为 `0-100`，表示附件上传百分比。通过 `onSuccess` 和 `onError` 回调可以获取消息最终发送结果：

- `onProgress(String msgId, int progress)`：上传附件时触发，`msgId` 为发送前的本地消息 ID。
- `onSuccess(String msgId, ChatMessage msg)`：消息发送成功，`msg` 为发送完成后的消息对象，可通过 `msg.msgId` 获取发送成功后的消息 ID。
- `onError(String msgId, ChatMessage msg, ChatError error)`：消息发送失败，通过 `error.code` 和 `error.description` 获取错误码和错误描述。

以下以图片消息为例，使用 `ValueNotifier` 保存上传进度和发送状态。应用可使用 `ValueListenableBuilder` 将这些状态绑定到消息气泡或进度条；语音、视频和文件消息可复用相同的监听方式：

```dart
import 'package:flutter/foundation.dart';
import 'package:im_flutter_sdk/im_flutter_sdk.dart';

// 创建待发送的附件消息，conversationId 和 filePath 由应用提供
final ChatMessage message = ChatMessage.createImageSendMessage(
  targetId: conversationId,
  filePath: filePath,
  // 单聊默认是 Chat；群聊和聊天室分别设置为 GroupChat 和 ChatRoom
  chatType: ChatType.Chat,
);

// 保存发送前的本地消息 ID，不能用发送后的消息 ID 筛选上传进度
final String localMsgId = message.msgId;
final String handlerId = 'attachment_upload_$localMsgId';
final ChatManager chatManager = ChatClient.getInstance.chatManager;
final ValueNotifier<int> uploadProgress = ValueNotifier<int>(0);
final ValueNotifier<String> sendStatus = ValueNotifier<String>('发送中');

// 注册监听器，在发起发送前监听进度和最终结果
chatManager.addMessageEvent(
  handlerId,
  ChatMessageEvent(
    onProgress: (String msgId, int progress) {
      // 监听器可能收到其他消息的事件，只更新当前附件的状态
      if (msgId != localMsgId) return;
      // progress 为附件上传百分比，取值范围为 0-100
      uploadProgress.value = progress;
      print('上传进度：$progress%');
    },
    onSuccess: (String msgId, ChatMessage sentMessage) {
      if (msgId != localMsgId) return;
      // 以 onSuccess 判断最终发送成功，不以进度达到 100 判断
      uploadProgress.value = 100;
      sendStatus.value = '发送成功';
      print('发送成功，消息 ID：${sentMessage.msgId}');
    },
    onError: (String msgId, ChatMessage failedMessage, ChatError error) {
      if (msgId != localMsgId) return;
      // onError 表示最终发送失败，包含错误码和错误描述
      sendStatus.value = '发送失败';
      print('发送失败：${error.code}，${error.description}');
    },
  ),
);

try {
  // 发起附件发送，默认情况下 SDK 自动上传附件
  await chatManager.sendMessage(message);
} on ChatError catch (error) {
  // 消息提交失败时处理此异常，不依赖后续状态回调
  sendStatus.value = '提交失败';
  print('提交附件消息失败：${error.code}，${error.description}');
}

// 在页面或组件的 dispose 生命周期中调用
// 先移除事件监听器，再释放用于界面展示的状态对象
void disposeAttachmentEvent() {
  chatManager.removeMessageEvent(handlerId);
  uploadProgress.dispose();
  sendStatus.dispose();
}
```

:::tip
文本、位置、透传和自定义消息通常不涉及附件上传，`onProgress` 一般不会触发。上传进度达到 `100` 不代表消息已发送成功，最终结果以 `onSuccess` 或 `onError` 为准。若附件由应用上传至自有服务器，应由应用获取该上传过程的进度。
:::

上述示例针对一条附件消息注册监听器。聊天页面发送多条消息时，建议只注册一次监听器，通过本地消息 ID 分别维护各条消息的进度和发送状态，并在页面销毁时移除监听器；不要在 `await sendMessage` 返回后立即移除。

#### 发送消息前的内容审核

- 内容审核关注消息 body。

  [内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，业务信息建议放在 `ChatMessage.attributes` 中，避免影响审核效果。

- 设置发送方收到内容审核替换后的内容。

  默认情况下，内容审核替换后的内容仅下发给接收方。发送方如需同步收到替换后的内容，需 **联系环信商务开通权限**，并在 SDK 初始化时将 `ChatOptions.useReplacedMessageContents` 设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

```dart
final ChatOptions options = ChatOptions.withAppKey(
  'your_app_key',
  useReplacedMessageContents: true,
);
await ChatClient.getInstance.init(options);
```

#### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](/product/limitation.html#消息大小)。消息扩展字段也会计入消息大小限制。

#### 发消息时设置回调路由

回调路由允许你在同一个 App Key 下，将不同消息按回调环境维度分别投递到不同的回调地址。发送消息时，你可以在消息中携带回调环境字段（如 `dev`、`test`、`prod`），环信服务器收到消息后，根据该字段匹配控制台中配置的 [回调路由规则](/product/console/basic_webhook.html#配置消息回调规则)，并将当前消息回调至对应的 [发送前回调](/document/server-side/callback_presending.html) 或 [发送后回调](/document/server-side/callback_postsending.html) 地址。

:::tip
目前，该功能仅面向国内 1 区和国内 2 区开放。
:::

**适用场景**

| 场景               | 说明                                                         |
| :----------------- | :----------------------------------------------------------- |
| 多环境隔离     | 同一 App Key 下区分开发、测试、生产环境，消息分别回调至各自的服务地址。 |
| 灰度发布      | 部分消息回调至新链路验证，其余消息仍走旧链路。               |
| 多业务线分流   | 不同业务模块的消息回调至各自的审核、风控或同步服务。         |
| 降低发送前时延 | 避免消息先统一回调至一个入口，再由业务服务器二次转发。       |

**适用范围**

| 回调类型    | 生效范围       | 说明      |
| :------------- | :------- | :---------------- |
| [发送前回调](/document/server-side/callback_presending.html) | 仅对 **SDK 发送的消息** 生效（不支持群组/聊天室的定向消息）。 | 消息下发给目标用户前，你的服务器可判断是否拦截或修改消息内容。 |
| [发送后回调](/document/server-side/callback_postsending.html) | 对 **SDK 和 REST API 发送的消息** 均生效。  | 消息成功发送后，通知你的服务器。   |

**工作流程**

1. 在控制台为发送前回调或发送后回调 [配置回调路由](/product/console/basic_webhook.html#配置消息回调规则)。
2. 客户端发送消息时，设置回调环境值。
3. 环信服务器收到消息后，根据消息中的回调环境值匹配当前阶段的回调地址。
4. 命中有效路由后，服务器将回调请求发送到对应地址。

**示例代码**

回调环境参数 `webhookEnv` 的说明如下：

| 参数 |类型 | 是否必需 | 说明 |
| :--- | :--- |  :--- | :--- |
| `webhookEnv` | String | 否 | 回调环境值。回调环境仅支持字母和数字，长度不超过 8 个字符。服务器根据该值匹配控制台中的回调地址。建议与控制台中配置的回调环境保持一致，例如 `dev`、`test`、`prod`。 |

```dart
final ChatMessage message = ChatMessage.createTxtSendMessage(
  targetId: 'toUser',
  content: 'hello',
);

message.webhookEnv = 'test';
await ChatClient.getInstance.chatManager.sendMessage(message);
```

**消息中的回调环境字段命中规则**

| 场景                                     | 路由结果                                                     |
| :--------------------------------------- | :----------------------------------------------------------- |
| 携带环境值且命中有效路由           | 按该环境值路由至对应的回调地址。                             |
| 携带环境值但未命中有效路由           | **不触发回调**，控制台中的 `default` 兜底配置在此场景下 **不生效**。 |
| 未携带环境值                         | 自动路由至 `default` 环境对应的回调地址。                    |
| 同一消息需同时触发发送前与发送后回调 | 两个阶段必须使用 **相同的环境值**。例如，发送前配置 `test -> url1`，发送后配置 `test -> url2`，则消息中携带 `test` 即可同时生效于两阶段。 |

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`createTxtSendMessage`](#发送文本消息) | `ChatMessage` | 创建文本消息。 |
| [`createImageSendMessage`](#发送图片消息) | `ChatMessage` | 创建图片或 GIF 消息。 |
| [`createVoiceSendMessage`](#发送语音消息) | `ChatMessage` | 创建语音消息。 |
| [`createVideoSendMessage`](#发送视频消息) | `ChatMessage` | 创建视频消息。 |
| [`createFileSendMessage`](#发送文件消息) | `ChatMessage` | 创建文件消息。 |
| [`createLocationSendMessage`](#发送位置消息) | `ChatMessage` | 创建位置消息。 |
| [`createCmdSendMessage`](#发送透传消息) | `ChatMessage` | 创建透传消息。 |
| [`createCustomSendMessage`](#发送自定义类型消息) | `ChatMessage` | 创建自定义消息。 |
| [`createCombineSendMessage`](#发送合并消息) | `ChatMessage` | 创建合并消息。 |
| [`createSendMessage`](#上传消息附件至自有服务器) | `ChatMessage` | 使用自定义消息体创建待发送消息。 |
| [`sendMessage`](#发送消息统一流程) | `ChatManager` | 发起发送消息。 |
| [`addMessageEvent`](#发送过程回调) | `ChatManager` | 注册发送状态和附件进度监听器。 |
| [`removeMessageEvent`](#发送过程回调) | `ChatManager` | 移除消息状态监听器。 |
| [`addAttributes`](#语聊房麦位管理) | `ChatRoomManager` | 设置或更新聊天室自定义属性。 |
| [`addEventHandler`](#语聊房麦位管理) | `ChatRoomManager` | 注册聊天室属性变更等事件监听器。 |
| [`removeEventHandler`](#语聊房麦位管理) | `ChatRoomManager` | 移除聊天室事件监听器。 |
| [`fetchCombineMessageDetail`](#发送合并消息) | `ChatManager` | 获取合并消息中的原始消息列表。 |
| [`sendMessageReadReceipts`](#带群消息已读回执和扩展字段的示例) | `ChatManager` | 批量发送单聊或群聊消息已读回执。 |
| [`serverTransfer`](#上传消息附件至自有服务器) | `ChatOptions` | 控制 SDK 是否自动上传和下载消息附件。 |
| [`useReplacedMessageContents`](#发送消息前的内容审核) | `ChatOptions` | 设置发送方是否接收审核替换后的消息内容。 |
