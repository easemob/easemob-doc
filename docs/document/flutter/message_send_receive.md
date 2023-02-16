# 发送和接收消息

<Toc />

登录 Chat app 后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- 透传消息。
- 自定义消息。

:::tip
针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性 。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。
:::

本文介绍如何使用即时通讯 IM SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 和 `EMMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 Create 方法创建文本、文件、附件等类型的消息；
2. 发送方再调用 `SendMessage` 发送消息；
3. 接收方通过 `EMChatEventHandler` 中的方法监听消息回调事件。在收到 `onMessagesReceived` 后，即表示成功接收到消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送消息

1. 首先，利用 `EMMessage` 类构造一个消息。

示例代码：

```dart
// 设置发送的消息类型。消息类型共支持 8 种。具体详见 `MessageType` 枚举类型。
MessageType messageType = MessageType.TXT;
// 设置消息接收对象 ID。
String targetId = "tom";
// 设置消息接收对象类型。消息接收对象类型包括单人、群组和聊天室。具体详见 `ChatType` 枚举类型。
ChatType chatType = ChatType.Chat;
// 构造消息。构造不同类型的消息，需要不同的参数。
// 构造文本消息
EMMessage msg = EMMessage.createTxtSendMessage(
  targetId: targetId,
  content: "This is text message",
);

// 构建图片消息，需要图片的本地地址，长宽，和界面用来显示的名称。
String imgPath = "/data/.../image.jpg";
double imgWidth = 100;
double imgHeight = 100;
String imgName = "image.jpg";
int imgSize = 3000;
EMMessage msg = EMMessage.createImageSendMessage(
  targetId: targetId,
  filePath: imgPath,
  width: imgWidth,
  height: imgHeight,
  displayName: imgName,
  fileSize: imgSize,
);

// 构建命令消息。根据命令消息可以执行具体的命令，命令的内容格式自定义的。
String action = "writing";
EMMessage msg = EMMessage.createCmdSendMessage(
  targetId: targetId,
  action: action,
);

// 自定义消息。消息内容由两部分组成：消息事件和扩展字段。
// 扩展字段用户可以自行实现和使用。
String event = "gift";
Map<String, String> params = {"key": "value"};
EMMessage msg = EMMessage.createCustomSendMessage(
  targetId: targetId,
  event: event,
  params: params,
);

// 构建文件消息。文件消息主要需要本地文件地址和文件在页面显示的名称。
String filePath = "data/.../foo.zip";
String fileName = "foo.zip";
int fileSize = 6000;
EMMessage msg = EMMessage msg = EMMessage.createFileSendMessage(
  targetId: targetId,
  filePath: filePath,
  displayName: fileName,
  fileSize: fileSize,
);

// 构建位置消息。位置消息可以传递经纬度和地名信息。
// 当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。
double latitude = 114.78;
double longitude = 39.89;
String address = "darwin";
EMMessage msg = EMMessage.createLocationSendMessage(
  targetId: targetId,
  latitude: latitude,
  longitude: longitude,
  address: address,
);

// 构建视频消息。视频消息主要由视频和视频缩略图组成，视频消息支持输入视频的首帧作为缩略图。视频参数包括视频本地地址、视频长宽值，显示名称，播放时间长度。
// 视频的缩略图需要缩略图的本地地址。
// 视频消息相当于包含 2 个附件的消息。
String videoPath = "data/.../foo.mp4";
double videoWidth = 100;
double videoHeight = 100;
String videoName = "foo.mp4";
int videoDuration = 5;
int videoSize = 4000;
EMMessage msg = EMMessage.createVideoSendMessage(
  targetId: targetId,
  filePath: videoPath,
  width: videoWidth,
  height: videoHeight,
  duration: videoDuration,
  fileSize: videoSize,
  displayName: videoName,
);

// 构建语音消息。该消息需要本地语音文件地址、显示名称和播放时长。
String voicePath = "data/.../foo.wav";
String voiceName = "foo.wav";
int voiceDuration = 5;
int voiceSize = 1000;

EMMessage msg = EMMessage.createVoiceSendMessage(
  targetId: targetId,
  filePath: voicePath,
  duration: voiceDuration,
  fileSize: voiceSize,
  displayName: voiceName,
);

// 对于聊天室消息，还可以设置消息优先级。
if (msg.chatType == ChatType.ChatRoom) {
  msg.chatroomMessagePriority = ChatRoomMessagePriority.High;
}

```

2. 通过 `EMChatManager` 将该消息发出。

```dart
EMClient.getInstance.chatManager.sendMessage(message).then((value) {
});
```

你可以设置发送消息结果回调，用于接收消息发送进度或者发送结果，如发送成功或失败。为此，需实现 `EMChatManager#addMessageEvent` 接口。

对于命令消息可能并不需要结果，可以不用赋值。

```dart
// 添加消息状态监听器
EMClient.getInstance.chatManager.addMessageEvent(
  "UNIQUE_HANDLER_ID",
  ChatMessageEvent(
    // 收到成功回调之后，可以对发送的消息进行更新处理，或者其他操作。
    onSuccess: (msgId, msg) {
      // msgId 旧的消息id；
      // msg 发送成功的消息;
    },
    // 收到回调之后，可以将发送的消息状态进行更新，或者进行其他操作。
    onError: (msgId, msg, error) {
      // msgId 旧的消息id；
      // msg 发送失败的消息;
      // error 错误原因
    },
    // 对于附件类型的消息，如图片，语音，文件，视频类型，上传或下载文件时会收到相应的进度值，表示附件的上传或者下载进度。
    onProgress: (msgId, progress) {
      // msgId 消息id；
      // progress 进度;
    },
  ),
);

void dispose() {
  // 移除消息状态监听器
  EMClient.getInstance.chatManager.removeMessageEvent("UNIQUE_HANDLER_ID");
  super.dispose();
}

// 消息发送结果会通过回调对象返回，该返回结果仅表示该方法的调用结果，与实际消息发送状态无关。
EMClient.getInstance.chatManager.sendMessage(message).then((value) {
  // 消息发送动作完成。
});
```

#### 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，增加了用户对聊天应用中交互的期待感。

你可以通过透传消息实现输入指示器。下图为输入指示器的工作原理。

![img](@static/images/common/typing_indicator.png)


监听用户 A 的输入状态。一旦有文本输入，通过透传消息将输入状态发送给用户 B，用户 B 收到该消息，了解到用户 A 正在输入文本。

- 用户 A 向用户 B 发送消息，通知其开始输入文本。
- 收到消息后，如果用户 B 与用户 A 的聊天页面处于打开状态，则显示用户 A 的输入指示器。
- 如果用户 B 在几秒后未收到用户 A 的输入，则自动取消输入指示器。

:::notice 

用户 A 可根据需要设置透传消息发送间隔。

:::

以下示例代码展示如何发送输入状态的透传消息。

```dart
//发送表示正在输入的透传消息
final String msgTypingBegin = "TypingBegin";

void textChange() {
  int currentTimestamp = getCurrentTimestamp();
  if (currentTimestamp - _previousChangedTimeStamp > 5) {
    _sendBeginTyping();
    _previousChangedTimeStamp = currentTimestamp;
  }
}

void _sendBeginTyping() async {
  var msg = EMMessage.createCmdSendMessage(
    targetId: conversationId,
    action: msgTypingBegin,
    deliverOnlineOnly: true,
  );
  msg.chatType = ChatType.Chat;
  EMClient.getInstance.chatManager.sendMessage(msg);
}

```

以下示例代码展示如何接受和解析输入状态的透传消息。

```dart
final int typingTime = 10;
Timer? _timer;

void onCmdMessagesReceived(List<EMMessage> list) {
  for (var msg in list) {
    if (msg.conversationId != currentConversationId) {
      continue;
    }
    EMCmdMessageBody body = msg.body as EMCmdMessageBody;
    if (body.action == msgTypingBegin) {
      // 这里需更新 UI，显示“对方正在输入”
      beginTimer();
    }
  }
}

void beginTimer() {
  _timer = Timer.periodic(
    Duration(seconds: typingTime),
    (timer) {
      // 这里需更新 UI，显示“对方正在输入”
      cancelTimer();
    },
  );
}

void cancelTimer() {
  _timer?.cancel();
}
```

### 接收消息

你可以添加 `EMChatEventHandler` 监听器接收消息。

该 `EMChatEventHandler` 可以多次添加。请记得在不需要的时候移除该监听器，如在 `dispose` 的卸载组件的时候。

在新消息到来时，你会收到 `onMessagesReceived` 的事件，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```dart
// 继承并实现 EMChatEventHandler
class _ChatMessagesPageState extends State<ChatMessagesPage> {
  @override
  void initState() {
    super.initState();
    // 添加监听器
    EMClient.getInstance.chatManager.addEventHandler(
      "UNIQUE_HANDLER_ID",
      EMChatEventHandler(
        onMessagesReceived: (list) => {},
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container();
  }

  @override
  void dispose() {
    // 移除监听器
    EMClient.getInstance.chatManager.removeEventHandler("UNIQUE_HANDLER_ID");
    super.dispose();
  }
}
```

文件消息不会自动下载。图片消息和视频消息默认会生成缩略图，接收到图片消息和视频消息，默认会自动下载缩略图。语音消息接收到后会自动下载。

若手动下载附件，需进行如下设置：

1. 在初始化 SDK 时将 `isAutoDownloadThumbnail` 设置为 `false`。

```dart
EMOptions options = EMOptions(
  appKey: appKey,
  isAutoDownloadThumbnail: false,
);
```

2. 设置下载监听器。

```dart
// 添加消息状态监听器
EMClient.getInstance.chatManager.addMessageEvent(
    "UNIQUE_HANDLER_ID",
    ChatMessageEvent(
        // 收到成功回调表示消息已经下载成功。
        onSuccess: (msgId, msg) {
        // msgId 消息ID；
        // msg 下载成功的消息;
        },
        // 收到失败回调，表示消息下载失败。
        onError: (msgId, msg, error) {
        // msgId 消息ID；
        // msg 下载失败的消息；
        // error 失败原因
        },
        // 对于附件类型的消息，如图片，语音，文件，视频类型，上传或下载文件时会收到相应的进度值，表示附件的上传或者下载进度。
        onProgress: (msgId, progress) {
        // msgId 消息ID；
        // progress 进度;
        },
    ),
);

void dispose() {
    // 移除消息状态监听器
    EMClient.getInstance.chatManager.removeMessageEvent("UNIQUE_HANDLER_ID");
    super.dispose();
}
```

3. 下载缩略图。

```dart
EMClient.getInstance.chatManager.downloadThumbnail(message);
```

下载完成后，调用相应消息 body 的 `thumbnailLocalPath` 获取缩略图路径。

```dart
// 获取图片消息 body。
EMImageMessageBody imgBody = message.body as EMImageMessageBody;
// 从本地获取图片缩略图路径。
String? thumbnailLocalPath = imgBody.thumbnailLocalPath;
```

4. 下载附件。

```dart
EMClient.getInstance.chatManager.downloadAttachment(message);
```

下载完成后，调用相应消息 body 的 `localPath` 获取附件路径。

示例代码如下：

```dart
// 获取文件消息 body。
EMFileMessageBody fileBody = message.body as EMFileMessageBody;
// 从本地获取文件路径。
String? localPath = fileBody.localPath;
```

### 撤回消息

消息发送后 2 分钟之内，消息的发送方可以撤回该消息。如果需要调整可撤回时限，可以联系商务。

```dart
try {
  await EMClient.getInstance.chatManager.recallMessage(msgId);
} on EMError catch (e) {
}
```

设置消息撤回监听器：

```dart
// 消息被撤回时触发的回调（此回调位于 EMChatEventHandler 中）。
void onMessagesRecalled(List<EMMessage> messages) {}
```