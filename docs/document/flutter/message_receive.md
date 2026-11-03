# 接收消息

## 功能说明

环信即时通讯 IM Flutter SDK 通过 `ChatEventHandler` 接收文本、图片、GIF、语音、视频、文件、位置、透传、自定义、合并和流式消息。应用在回调中根据 `ChatMessage.body.type` 或消息体的实际类型读取内容，并按业务需要展示或处理消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 监听消息事件

应用通过 `ChatManager.addEventHandler` 注册 `ChatEventHandler`。同一 `ChatManager` 可以注册多个监听器，每个监听器使用唯一字符串 ID 管理；重复使用同一 ID 会覆盖原监听器。

收到普通消息时触发 `onMessagesReceived`；透传消息通过独立的 `onCmdMessagesReceived` 回调处理。不要直接套用 Android 的单数回调名称或假设透传消息必定同时进入这两个回调。

| 回调 | 说明 |
| :--- | :--- |
| `onMessagesReceived` | 接收文本、图片、语音、视频、文件、位置、自定义和合并等普通消息。一次可能返回一条或多条消息。 |
| `onStreamMessagesReceived` | 接收流式消息。流式消息内容通过消息的 `streamChunk` 等字段处理。 |
| `onCmdMessagesReceived` | 接收透传消息。透传消息通常不展示在 UI 中。 |
| `onMessageReadReceipts` | 收到消息已读回执。详见 [消息回执文档](message_receipt.html)。 |
| `onMessagesDelivered` | 接收消息送达回执。 |
| `onMessagesRecalledInfo` | 接收消息撤回通知，回调负载为 `RecallMessageInfo` 列表。 |

以下为业务聊天页面的 `State` 实现示例，`ChatPage` 为应用已有的页面组件。页面创建时注册监听器，不再使用时移除监听器：

本文示例需引入 `package:im_flutter_sdk/im_flutter_sdk.dart`；使用 Flutter 组件或 `debugPrint` 时还需引入 `package:flutter/material.dart`。各类型消息章节中的回调片段应配置到已注册的 `ChatEventHandler` 中，包含 `await` 的处理代码应放在异步方法或带 `async` 的回调中。

```dart
class _ChatPageState extends State<ChatPage> {
  // 监听器使用唯一标识，移除时使用同一标识
  static const String _handlerId = 'chat_page_event_handler';

  @override
  void initState() {
    super.initState();
    // 注册普通消息、流式消息、透传消息及相关事件回调
    ChatClient.getInstance.chatManager.addEventHandler(
      _handlerId,
      ChatEventHandler(
        onMessagesReceived: (List<ChatMessage> messages) {
          for (final ChatMessage message in messages) {
            // 根据 message.body.type 处理文本、附件、位置、自定义及合并消息
          }
        },
        onStreamMessagesReceived: (List<ChatMessage> messages) {
          // 处理流式消息，读取 message.streamChunk 等字段
        },
        onCmdMessagesReceived: (List<ChatMessage> messages) {
          // 处理透传消息，不将命令直接展示为聊天内容
        },
        onMessageReadReceipts: (
          List<ChatMessageReadReceipt> receipts,
        ) {
          // 处理单聊或群聊消息已读回执
        },
        onMessagesRecalledInfo: (List<RecallMessageInfo> infos) {
          // 处理消息撤回通知，infos 为 RecallMessageInfo 列表
        },
      ),
    );
  }

  @override
  void dispose() {
    // 页面销毁时移除监听器，避免重复处理消息
    ChatClient.getInstance.chatManager.removeEventHandler(_handlerId);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const SizedBox.shrink();
  }
}
```

## 消息通用信息

收到消息后，可通过 `ChatMessage` 读取以下通用信息：

| 字段或属性 | 类型 | 说明 |
| :--- | :--- | :--- |
| `msgId` | `String` | 消息 ID。 |
| `conversationId` | `String?` | 消息所属的会话 ID。 |
| `from` | `String?` | 消息发送方的用户 ID。 |
| `to` | `String?` | 消息目标 ID。 |
| `chatType` | `ChatType` | 会话类型：单聊、群聊或聊天室。 |
| `body.type` | `MessageType` | 消息类型，例如 `TXT`、`IMAGE`、`VOICE`、`VIDEO`、`FILE`、`LOCATION`、`CMD`、`CUSTOM` 或 `COMBINE`。 |
| `body` | `ChatMessageBody` | 消息体。应先判断类型，再转换为相应子类。 |
| `attributes` | `Map<String, dynamic>?` | 发送方设置的业务扩展字段。 |
| `serverTime` | `int` | 消息到达服务器的时间戳，单位为毫秒。 |
| `isNeedReadReceipt` | `bool` | 该消息是否需要已读回执。 |
| `isRead`、`isPeerRead` | `bool` | 消息的本地已读状态及对端已读状态。5.0.0 中均为只读属性。 |
| `groupReadReceiptCount` | `int` | 群消息的已读人数，5.0.0 中为同步只读属性。 |
| `isBroadcast` | `bool` | 是否为聊天室全局广播消息。 |
| `senderInfo` | `ChatMessageSenderInfo?` | 服务端下发的消息发送者信息，仅接收消息时有效。 |

## 接收文本消息

收到 `onMessagesReceived` 回调后，遍历消息列表。对于文本消息，将消息体转换为 `ChatTextMessageBody`，通过 `content` 获取文本内容；如需读取业务扩展字段，可从 `ChatMessage.attributes` 获取扩展字段映射。此外，可通过 `translations` 获取服务端返回的译文。

示例代码如下，回调应配置到已注册的 `ChatEventHandler` 中：

```dart
onMessagesReceived: (List<ChatMessage> messages) {
  for (final ChatMessage message in messages) {
    if (message.body.type != MessageType.TXT) {
      continue;
    }

    // 获取文本消息内容
    final ChatTextMessageBody body =
        message.body as ChatTextMessageBody;
    final String text = body.content;
    // 获取服务端返回的译文，未提供译文时可能为 null
    final Map<String, String>? translations = body.translations;
    // 按业务字段名读取消息扩展字段，字段不存在时返回 null
    // 此处 businessKey 的值由业务双方约定为字符串
    final String? businessValue =
        message.attributes?['businessKey'] as String?;

    debugPrint(
      'text=$text, translations=$translations, '
      'businessValue=$businessValue',
    );
  }
},
```

## 接收附件消息

除文本消息外，SDK 还支持接收语音、图片、GIF、视频和文件等附件消息。

附件消息的接收过程如下：

1. 接收附件消息。在默认附件传输配置下，SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若需下载图片主附件、大图、视频和文件，调用对应下载接口。
2. 从相应消息体获取附件的服务器地址、本地路径和下载状态，根据业务需要展示或使用附件。

`ChatOptions.serverTransfer` 默认为 `true`，图片和视频缩略图由 `ChatOptions.isAutoDownloadThumbnail` 控制是否自动下载，默认值为 `true`。若附件由应用上传至自有服务器，并将 `serverTransfer` 设为 `false`，接收端需要自行处理附件下载。

Flutter 的附件下载接口不直接接收回调参数。`await downloadAttachment(message)`、`await downloadThumbnail(message)` 和 `await downloadBigImage(message)` 表示下载任务已提交给原生 SDK，不表示资源已下载完成；最终的成功、失败和进度通过 `ChatManager.addMessageEvent` 注册的 `ChatMessageEvent` 返回。

以下示例为一条目标消息注册下载监听器，图片、视频和文件章节的示例可复用该方法。应先注册监听器，再调用下载接口：

```dart
String registerAttachmentDownloadEvent(ChatMessage targetMessage) {
  // 接收消息的 ID 用于筛选当前消息的下载事件
  final String targetMsgId = targetMessage.msgId;
  final String handlerId = 'attachment_download_$targetMsgId';

  // 注册下载成功、失败和进度回调
  ChatClient.getInstance.chatManager.addMessageEvent(
    handlerId,
    ChatMessageEvent(
      onSuccess: (String msgId, ChatMessage downloadedMessage) {
        if (msgId != targetMsgId) return;
        // 附件下载成功，从回调返回的消息体重新读取本地路径和下载状态
        // downloadedMessage 不一定是最初接收回调中的同一 Dart 对象
        print('下载成功：${downloadedMessage.msgId}');
      },
      onProgress: (String msgId, int progress) {
        if (msgId != targetMsgId) return;
        // 附件下载进度，取值范围为 0-100
        print('下载进度：$progress%');
      },
      onError: (String msgId, ChatMessage message, ChatError error) {
        if (msgId != targetMsgId) return;
        // 附件下载失败，根据错误码和错误描述处理
        print('下载失败：${error.code}，${error.description}');
      },
    ),
  );
  return handlerId;
}

// 在页面或组件销毁时调用，传入注册方法返回的标识
void removeAttachmentDownloadEvent(String handlerId) {
  ChatClient.getInstance.chatManager.removeMessageEvent(handlerId);
}
```

`ChatMessageEvent` 同时承载消息发送和附件下载事件，所有已注册监听器都可能收到相关状态通知。业务应使用回调中的 `msgId` 匹配目标消息，并在页面或组件销毁时调用 `removeMessageEvent`。回调不区分同一图片的主附件、大图和缩略图下载任务，不要同时为同一消息发起这些下载；应按需选择，或在一个任务的最终成功/失败回调之后启动下一个任务。

:::warning
附件下载桥接层会按消息 ID 从本地数据库查找原生消息。请将接收回调或本地会话中加载出的 `ChatMessage` 传给下载接口，不要传入业务侧临时构造、尚未保存到本地的消息对象。
:::

### 接收语音消息

1. 接收方收到语音消息时，在默认附件传输配置下，SDK 自动下载语音文件。
2. 接收方收到 [onMessagesReceived 回调](#接收文本消息)，将消息体转换为 `ChatVoiceMessageBody`，通过 `remotePath` 或 `localPath` 获取语音文件的服务器地址或本地路径，从而获取语音文件。

示例代码如下，`message` 为接收回调中的语音消息：

```dart
if (message.body.type == MessageType.VOICE) {
  final ChatVoiceMessageBody body =
      message.body as ChatVoiceMessageBody;

  // 获取语音时长，单位为秒
  final int duration = body.duration;
  // 获取语音文件在服务器的地址
  final String? remotePath = body.remotePath;
  // 获取本地语音文件的资源路径
  final String localPath = body.localPath;
  // 获取语音文件下载状态，收到消息不代表本地文件已下载完成
  final DownloadStatus status = body.fileStatus;
  // 获取服务端下发的语音转写文本，未提供时可能为 null
  final String? text = body.text;
}
```

播放前应检查下载状态和本地文件是否可用。若自动下载失败，可调用 `ChatManager.downloadAttachment(message)` 重试，并通过 `ChatMessageEvent` 监听最终结果。

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 接收图片消息时，SDK 会根据配置决定是否自动下载缩略图：

   - 默认自动下载，即初始化时 `ChatOptions.isAutoDownloadThumbnail` 为 `true`。
   - 如果关闭自动下载，即 `ChatOptions.isAutoDownloadThumbnail` 为 `false`，则需要调用 `ChatManager.downloadThumbnail(message)` 手动下载。

   初始化时设置缩略图自动下载策略的示例代码如下：

   ```dart
   // 初始化前设置缩略图下载策略，默认值为 true
   final ChatOptions options = ChatOptions.withAppKey(
     'your_app_key',
     isAutoDownloadThumbnail: false,
   );
   await ChatClient.getInstance.init(options);
   ```

   初始化后，如需动态更新该策略，可调用 `ChatClient.updateAutoDownloadAttachmentThumbnailSetting(false)`。手动下载前先注册 [附件下载事件](#接收附件消息)，再提交下载任务：

   ```dart
   // message 为接收回调或本地会话中加载出的图片消息
   // registerAttachmentDownloadEvent 为“接收附件消息”一节定义的示例方法
   final String downloadHandlerId = registerAttachmentDownloadEvent(message);
   try {
     // 手动下载图片缩略图，最终结果通过 ChatMessageEvent 获取
     await ChatClient.getInstance.chatManager.downloadThumbnail(message);
   } on ChatError catch (error) {
     // 处理提交下载任务时的异常
     print('提交缩略图下载失败：${error.code}，${error.description}');
   }
   // 页面销毁时调用 removeAttachmentDownloadEvent(downloadHandlerId)
   // 不要在 await 返回后立即移除监听器
   ```

2. 收到图片消息后，接收方可以在 `onMessagesReceived` 回调中处理图片消息，并根据业务需要下载原图或大图。

   - 调用 `ChatManager.downloadAttachment(message)` 下载图片主附件。发送方发送原图时，该附件为原图；发送方压缩发送时，该附件为压缩后的图片。
   - 调用 `ChatManager.downloadBigImage(message)` 下载大图，通过 `bigImageLocalPath` 读取相应本地资源。

   如果本地已存在对应资源路径，建议优先复用本地文件，避免重复下载。路径非空不代表文件已存在，应检查文件是否可用。

   以下示例在 `onMessagesReceived` 中识别图片消息后，按用户的展示需求调用。`downloadMainAttachment` 为 `true` 时下载主附件，为 `false` 时下载大图，不会同时下载所有资源；缩略图的下载应先完成，再按需下载另一种资源。调用前，按 [接收附件消息](#接收附件消息) 中的示例注册下载监听器，并保存返回的标识用于页面销毁时移除。

   ```dart

   /// 按需下载图片主附件或大图
   Future<void> downloadImage(
     ChatMessage message, {
     bool downloadMainAttachment = false,
   }) async {
     if (message.body.type != MessageType.IMAGE) return;
     final ChatImageMessageBody body = message.body as ChatImageMessageBody;

     // 主附件使用 localPath，大图使用 bigImageLocalPath
     final String? localPath =
         downloadMainAttachment ? body.localPath : body.bigImageLocalPath;
     if (localPath != null &&
         localPath.isNotEmpty &&
         await File(localPath).exists()) {
       // 本地已有对应图片文件，可直接复用
       return;
     }

     try {
       if (downloadMainAttachment) {
         // 下载图片主附件，是否为原图由发送方的 sendOriginalImage 决定
         await ChatClient.getInstance.chatManager.downloadAttachment(message);
       } else {
         // 下载用于清晰预览的大图
         await ChatClient.getInstance.chatManager.downloadBigImage(message);
       }
       // 这里只是任务已提交，下载完成后从 onSuccess 返回的消息读取路径
     } on ChatError catch (error) {
       // 处理提交下载任务时的异常
       print('提交图片下载失败：${error.code}，${error.description}');
     }
   ```

3. 通过 `ChatImageMessageBody` 获取原图（主附件）、大图和缩略图的服务端地址或本地路径：

```dart
// 将图片消息体转换为 ChatImageMessageBody
// 下载完成后，message 应使用 onSuccess 回调返回的消息对象
final ChatImageMessageBody body = message.body as ChatImageMessageBody;

// 获取图片主附件的服务端地址，发送原图时对应原图
final String? attachmentRemotePath = body.remotePath;
// 获取大图的服务端地址
final String? bigImageRemotePath = body.bigImageRemotePath;
// 获取图片缩略图的服务端地址
final String? thumbnailRemotePath = body.thumbnailRemotePath;

// 获取图片主附件的本地路径，需确认附件已下载且文件存在
final String attachmentLocalPath = body.localPath;
// 获取大图的本地路径，未提供或尚未下载时可能为空
final String? bigImageLocalPath = body.bigImageLocalPath;
// 获取图片缩略图的本地路径，需确认缩略图已下载且文件存在
final String? thumbnailLocalPath = body.thumbnailLocalPath;

// 获取图片主附件的下载状态
final DownloadStatus attachmentStatus = body.fileStatus;
// 获取大图的下载状态，未提供时可能为 null
final DownloadStatus? bigImageStatus = body.bigImageDownloadStatus;
// 获取图片缩略图的下载状态
final DownloadStatus thumbnailStatus = body.thumbnailStatus;

// 获取图片宽度，单位为像素
final double? width = body.width;
// 获取图片高度，单位为像素
final double? height = body.height;

// 判断当前消息主附件是否为发送方上传的原图
// 若发送方未上传原图，接收端不能通过下载接口恢复其本地原始图片
final bool isOriginalImage = body.sendOriginalImage;
// 判断是否为 GIF 图片消息
final bool isGif = body.isGif;

// 获取图片附件密钥，原图、大图和缩略图共用 secret
final String? attachmentSecret = body.secret;
```

### 接收 GIF 图片消息

GIF 图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

接收 GIF 图片消息时，接收方会收到 `onMessagesReceived` 回调。接收方判断为 `MessageType.IMAGE` 后，将消息体转换为 `ChatImageMessageBody`，读取 `isGif` 属性。值为 `true` 时，表示 GIF 图片消息；值为 `false` 时，为普通图片消息。

```dart
onMessagesReceived: (List<ChatMessage> messages) {
  for (final ChatMessage message in messages) {
    // GIF 与普通图片的消息类型均为 IMAGE
    if (message.body.type != MessageType.IMAGE) {
      continue;
    }

    final ChatImageMessageBody body =
        message.body as ChatImageMessageBody;
    // 通过 isGif 识别 GIF，不只根据缩略图或文件名判断
    if (body.isGif) {
      // 按业务需要下载 GIF 主附件并播放动画
      // 下载原始 GIF 使用 downloadAttachment，监听方式与图片一致
    }
  }
},
```

### 接收视频消息

收到视频消息后，通常会先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. 接收方收到视频消息时，SDK 会根据配置决定是否自动下载视频缩略图。

   视频缩略图的下载策略与图片缩略图一致。默认情况下，SDK 自动下载缩略图；如果关闭自动下载，则需要调用 `ChatManager.downloadThumbnail(message)` 手动下载，详见 [接收图片消息](#接收图片消息)。

2. SDK 通过 `onMessagesReceived` 回调将视频消息传递给接收方。接收方可根据业务需要选择使用缩略图，或进一步下载视频原文件。

   - 如果只需要在会话列表或聊天界面展示预览图，可优先使用缩略图。
   - 如果用户需要播放视频，再调用 `ChatManager.downloadAttachment(message)` 下载视频原文件。下载前注册 `ChatMessageEvent`，通过回调获取进度和最终结果。

3. 为避免重复下载，建议优先检查本地是否已存在对应的视频文件或缩略图；如果本地已有可用资源，可直接复用。

   以下示例用于用户需要播放视频时下载视频文件。调用前，按 [接收附件消息](#接收附件消息) 中的示例注册下载监听器，并保存返回的标识用于页面销毁时移除：

   ```dart
   /// 下载视频原文件
   Future<void> downloadVideo(ChatMessage message) async {
     if (message.body.type != MessageType.VIDEO) return;
     final ChatVideoMessageBody body =
         message.body as ChatVideoMessageBody;

     // 本地视频文件存在时直接复用，不重复下载
     if (body.localPath.isNotEmpty && await File(body.localPath).exists()) {
       return;
     }

     try {
       // 下载视频附件，最终成功、失败和进度通过 ChatMessageEvent 获取
       await ChatClient.getInstance.chatManager.downloadAttachment(message);
     } on ChatError catch (error) {
       // 处理提交下载任务时的异常
       print('提交视频下载失败：${error.code}，${error.description}');
     }
   ```

4. 通过 `ChatVideoMessageBody` 获取视频原文件和缩略图的服务端地址或本地路径。其中，缩略图适合用于预览展示，视频原文件适合用于播放或下载保存。

```dart
// message 为收到的视频消息，下载完成后使用 onSuccess 返回的消息
final ChatVideoMessageBody body = message.body as ChatVideoMessageBody;

// 获取视频原文件的服务端地址
final String? videoRemotePath = body.remotePath;
// 获取视频缩略图的服务端地址
final String? thumbnailRemotePath = body.thumbnailRemotePath;
// 获取视频原文件的本地路径，播放前需确认文件已下载且可用
final String videoLocalPath = body.localPath;
// 获取视频缩略图的本地路径，用于预览展示
final String? thumbnailLocalPath = body.thumbnailLocalPath;

// 获取视频原文件的下载状态
final DownloadStatus videoStatus = body.fileStatus;
// 获取视频缩略图的下载状态
final DownloadStatus thumbnailStatus = body.thumbnailStatus;
// 获取视频时长，单位为秒
final int duration = body.duration;
```

### 接收文件消息

接收文件消息的流程如下：

1. 接收方收到 [onMessagesReceived 回调](#接收文本消息)，识别 `MessageType.FILE` 后，调用 `ChatManager.downloadAttachment(message)` 下载文件。

   若本地已有可用文件，可直接复用。调用前先注册 `ChatMessageEvent`，获取下载成功、失败和进度，示例方法见 [接收附件消息](#接收附件消息)。应保存注册方法返回的监听器标识，并在页面销毁时移除。

   ```dart
   /// 下载文件消息中的附件
   Future<void> downloadFile(ChatMessage message) async {
     if (message.body.type != MessageType.FILE) return;
     final ChatFileMessageBody body = message.body as ChatFileMessageBody;

     // 本地文件存在时直接复用，不重复下载
     if (body.localPath.isNotEmpty && await File(body.localPath).exists()) {
       return;
     }

     try {
       // 下载文件附件，最终结果通过 ChatMessageEvent 获取
       await ChatClient.getInstance.chatManager.downloadAttachment(message);
     } on ChatError catch (error) {
       // 处理提交下载任务时的异常
       print('提交文件下载失败：${error.code}，${error.description}');
     }
   ```

2. 通过 `ChatFileMessageBody` 从服务器或本地获取文件附件，以及文件显示名称、大小和下载状态：

```dart
// message 为收到的文件消息，下载完成后使用 onSuccess 返回的消息
final ChatFileMessageBody body = message.body as ChatFileMessageBody;
// 获取文件附件的服务端地址
final String? remotePath = body.remotePath;
// 获取文件附件的本地路径，使用前需确认文件已下载且可用
final String localPath = body.localPath;
// 获取文件显示名称
final String? displayName = body.displayName;
// 获取文件大小，单位为字节
final int? fileSize = body.fileSize;
// 获取文件附件的下载状态
final DownloadStatus status = body.fileStatus;
```

## 接收位置消息

接收位置消息与文本消息一致，详见 [接收文本消息](#接收文本消息)。

接收方接收到位置消息时，需要读取位置的经纬度，借由第三方地图服务将位置在地图上显示出来。Flutter SDK 不提供定位或地图展示能力，应用需自行接入地图服务。

在 `onMessagesReceived` 中识别 `MessageType.LOCATION`，将消息体转换为 `ChatLocationMessageBody`，通过 `latitude`、`longitude`、`address` 和 `buildingName` 获取位置坐标、地址信息和建筑物名称：

```dart
if (message.body.type == MessageType.LOCATION) {
  final ChatLocationMessageBody body =
      message.body as ChatLocationMessageBody;

  // 获取纬度
  final double latitude = body.latitude;
  // 获取经度
  final double longitude = body.longitude;
  // 获取位置的文字描述，未设置时可能为 null
  final String? address = body.address;
  // 获取建筑物名称，未设置时可能为 null
  final String? buildingName = body.buildingName;

  // 使用应用接入的第三方地图服务展示位置
}
```

## 接收透传消息

可将透传消息理解为一条指令，通过发送这条指令给对方，通知对方要执行的操作，收到消息后可以自定义处理。

具体功能可以根据自身业务需求自定义，例如刷新头像或昵称。另外，以 `em_` 和 `easemob::` 开头的 `action` 为内部保留字段，请勿在业务中使用。

:::tip
- 透传消息发送后不支持撤回。
- 透传消息不会存入本地数据库，也不会创建本地会话，因此通常不在 UI 中显示。
:::

接收方通过 `ChatEventHandler.onCmdMessagesReceived` 接收透传消息。将消息体转换为 `ChatCmdMessageBody` 后，通过 `action` 获取命令动作，通过 `deliverOnlineOnly` 判断该命令是否仅投递给在线用户。

以下示例将普通消息和透传消息分开处理，透传消息不依赖 `onMessagesReceived` 再次通知：

```dart
final ChatEventHandler handler = ChatEventHandler(
  // 接收普通消息，根据消息体类型处理文本、附件等内容
  onMessagesReceived: (List<ChatMessage> messages) {
    // 处理普通消息，具体方式见各类型消息章节
  },
  // 接收透传消息
  onCmdMessagesReceived: (List<ChatMessage> messages) {
    for (final ChatMessage message in messages) {
      if (message.body.type != MessageType.CMD) {
        continue;
      }

      final ChatCmdMessageBody body =
          message.body as ChatCmdMessageBody;
      // 获取发送方约定的命令动作
      final String action = body.action;
      // 判断该命令是否仅投递给在线用户
      final bool onlineOnly = body.deliverOnlineOnly;

      // 根据 action 执行业务操作，不将命令直接作为聊天内容显示
    }
  },
);

// 注册透传及普通消息监听器
ChatClient.getInstance.chatManager.addEventHandler('cmd_message_handler', handler);

// 在页面或组件销毁时调用，移除同一标识的监听器
void disposeCmdMessageHandler() {
  ChatClient.getInstance.chatManager.removeEventHandler('cmd_message_handler');
}
```

如需传递结构化参数，应在命令内容中定义业务协议，或改用自定义消息。

## 接收自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后添加该类型的自定义消息。

接收自定义消息与其他类型消息一致，应用在 `onMessagesReceived` 回调中判断 `MessageType.CUSTOM`，并读取消息体。

将消息体转换为 `ChatCustomMessageBody`，通过 `event` 获取自定义事件，通过 `params` 获取字符串键值对参数：

```dart
if (message.body.type == MessageType.CUSTOM) {
  final ChatCustomMessageBody body =
      message.body as ChatCustomMessageBody;

  // 获取自定义事件，例如 gift 表示礼物消息
  final String event = body.event;
  // 获取自定义参数，键和值均为字符串，未设置时可能为 null
  final Map<String, String>? params = body.params;

  // 根据 event 和 params 处理业务事件
}
```

## 接收合并消息

接收合并消息与接收普通消息的流程相同。在 `onMessagesReceived` 中识别 `MessageType.COMBINE`，将消息体转换为 `CombineMessageBody`。

- 对于不支持合并消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为发送方设置的 `compatibleText`，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，调用 `ChatManager.fetchCombineMessageDetail(message: message)` 下载并解析附件，获取其中的原始消息列表。
- 首次调用该方法时，SDK 下载并解析合并消息附件，并通过返回的 `Future<List<ChatMessage>>` 提供原始消息列表。
- 后续调用该方法时：
  - 若合并消息附件已存在，SDK 直接解析附件并返回原始消息列表。
  - 若合并消息附件不存在，SDK 先下载附件，再解析并返回原始消息列表。

将消息体转换为 `CombineMessageBody` 后，可以读取合并消息的标题、摘要和附件下载状态。Flutter V5 未公开合并消息兼容文本的读取属性，不直接套用 Android 的消息体读取方法。

以下示例用于 `onMessagesReceived` 中识别合并消息后的处理。与普通附件下载接口不同，`fetchCombineMessageDetail` 的 `Future` 完成时会直接返回解析后的原始消息列表：

```dart
if (message.body.type == MessageType.COMBINE) {
  final CombineMessageBody body =
      message.body as CombineMessageBody;

  // 获取合并消息标题
  final String? title = body.title;
  // 获取合并消息摘要
  final String? summary = body.summary;
  // 获取合并消息附件的下载状态
  final DownloadStatus status = body.fileStatus;

  try {
    // 下载并解析合并消息附件，返回原始消息列表
    final List<ChatMessage> originalMessages =
        await ChatClient.getInstance.chatManager
            .fetchCombineMessageDetail(message: message);
    // 按消息类型处理并展示 originalMessages
  } on ChatError catch (error) {
    // 处理下载或解析失败，根据错误码和错误描述排查
    print('获取合并消息失败：${error.code}，${error.description}');
  }
}
```

## 更多

### 消息接收回调返回发送成功的消息

若初始化时将 `ChatOptions.messagesReceiveCallbackIncludeSend` 设为 `true`，当前用户发送成功的消息也会通过 `onMessagesReceived` 返回。默认值为 `false`。

```dart
// 初始化时允许发送成功的消息进入接收回调，默认值为 false
final ChatOptions options = ChatOptions.withAppKey(
  'your_app_key',
  messagesReceiveCallbackIncludeSend: true,
);
await ChatClient.getInstance.init(options);
```

初始化后也可以动态更新：

```dart
// 动态设置是否将当前用户发送成功的消息包含在 onMessagesReceived 中
await ChatClient.getInstance
    .updateMessagesReceiveCallbackIncludeSendSetting(true);
```

启用后，同一条发送成功的消息既会触发发送状态事件，也会进入 `onMessagesReceived`。业务应根据消息 ID 去重，避免重复插入消息列表。

### 判断消息是否为聊天室广播消息

对于聊天室消息，可通过 `ChatMessage.isBroadcast` 判断是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

```dart
if (message.chatType == ChatType.ChatRoom && message.isBroadcast) {
  // isBroadcast 为 true 表示通过 REST API 发送的聊天室全局广播消息
  // 按业务需要展示或处理广播内容
}
```

### 消息附件下载鉴权

环信即时通讯 IM 支持消息附件下载鉴权。该功能默认关闭，如需开通请联系环信商务。开通后，不能直接使用消息体中的服务端 URL 下载环信服务器上的附件，必须调用 SDK 提供的以下接口，以便 SDK 携带鉴权信息：

- `ChatManager.downloadAttachment(message)`：下载主附件。
- `ChatManager.downloadThumbnail(message)`：下载图片或视频缩略图。
- `ChatManager.downloadBigImage(message)`：下载图片大图。
- `ChatManager.fetchCombineMessageDetail(message: message)`：下载并解析合并消息。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`addEventHandler`](#监听消息事件) | `ChatManager` | 注册消息事件监听器。 |
| [`removeEventHandler`](#监听消息事件) | `ChatManager` | 移除消息事件监听器。 |
| [`downloadThumbnail`](#接收图片消息) | `ChatManager` | 下载图片或视频缩略图。 |
| [`downloadBigImage`](#接收图片消息) | `ChatManager` | 下载图片大图。 |
| [`downloadAttachment`](#接收附件消息) | `ChatManager` | 下载图片主附件、语音、视频或文件附件。 |
| [`fetchCombineMessageDetail`](#接收合并消息) | `ChatManager` | 下载并解析合并消息，返回原始消息列表。 |
| [`addMessageEvent`](#接收附件消息) | `ChatManager` | 注册附件下载成功、失败和进度监听器。 |
| [`removeMessageEvent`](#接收附件消息) | `ChatManager` | 移除附件下载状态监听器。 |
| [`updateAutoDownloadAttachmentThumbnailSetting`](#接收图片消息) | `ChatClient` | 动态更新缩略图自动下载设置。 |
| [`updateMessagesReceiveCallbackIncludeSendSetting`](#消息接收回调返回发送成功的消息) | `ChatClient` | 动态设置发送成功的消息是否进入接收回调。 |
| [`isAutoDownloadThumbnail`](#接收图片消息) | `ChatOptions` | 初始化时设置是否自动下载图片和视频缩略图。 |
| [`messagesReceiveCallbackIncludeSend`](#消息接收回调返回发送成功的消息) | `ChatOptions` | 初始化时设置是否在接收回调中包含发送成功的消息。 |
| [`serverTransfer`](#接收附件消息) | `ChatOptions` | 控制 SDK 是否自动传输消息附件。 |
