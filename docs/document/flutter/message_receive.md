# 接收消息

环信即时通讯 IM Flutter SDK 通过 `EMChatEventHandler` 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以添加 `EMChatEventHandler` 监听器接收消息。`EMChatEventHandler` 可以多次添加。请记得在不需要的时候移除该监听器，如在 `dispose` 时。
- 在新消息到来时，你会收到 `onMessagesReceived` 事件，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。
- 若在初始化时打开了 `ChatOptions#messagesReceiveCallbackIncludeSend` 开关，则该回调中会返回发送成功的消息。
- 对于聊天室消息，你可以通过消息的 `EMMessage#isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_broadcast.html#发送聊天室全局广播消息)。

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

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
2. 获取附件的服务器地址和本地路径。
3. 自 4.15.0 版本开始，即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment` 方法下载消息附件。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
2. 接收方收到 [EMChatEventHandler#onMessagesReceived 回调](#接收文本消息)，调用 `remotePath` 或 `localPath` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```dart
if(msg.body.type == MessageType.VOICE) {
  EMVoiceMessageBody body = msg.body as EMVoiceMessageBody;
  body.duration; // 语音时长
  body.localPath; // 本地语音文件路径
  body.remotePath; // 远程语音文件路径
}

```

### 接收图片消息

1. 接收方收到图片消息，自动下载图片缩略图。
   
- 默认情况下，SDK 自动下载缩略图，即 `EMOptions#isAutoDownloadThumbnail` 设置为 `true`。
- 若设置为手动下载缩略图，即 `EMOptions#isAutoDownloadThumbnail` 设置为 `false`，需调用 `EMChatManager#downloadThumbnail` 下载。

2. 接收方收到 [EMChatEventHandler#onMessagesReceived 回调](#接收文本消息)，调用 `downloadAttachment` 下载原图。

```dart
EMClient.getInstance.chatManager.addMessageEvent(
  'UNIQUE_HANDLER_ID',
  ChatMessageEvent(
    onSuccess: (msgId, msg) {
      // 下载成功
    },
    onProgress: (msgId, progress) {
      // 下载进度
    },
    onError: (msgId, msg, error) {
      // 下载失败
    },
  ),
);

// 下载附件
EMClient.getInstance.chatManager.downloadAttachment(msg);
```

3. 下载成功后获取图片消息的缩略图和附件。

```dart
EMImageMessageBody body = msg.body as EMImageMessageBody;
// 本地大图路径
body.localPath;
// 本地缩略图路径
body.thumbnailLocalPath;
// 服务器大图路径。
body.remotePath;
// 服务器缩略图路径。
body.thumbnailRemotePath;
```

### 接收 GIF 图片消息

自 Flutter SDK 4.15.0 开始，支持接收 GIF 图片消息。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `onMessageReceived` 回调方法。接收方判断为图片消息后，读取消息体的 `isGif` 属性，若值是 `YES`， 则为 GIF 图片消息。

```java
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == Type.IMAGE && ) {
            EMImageMessageBody body = (EMImageMessageBody) msg.getBody();
            if(body.isGif()) {
                // 根据业务情况处理 gif message, 例如下载展示该消息
            }
        }
    }
    
}
```

### 接收视频消息

1. 接收方收到视频消息时，自动下载视频缩略图。你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见 [设置图片缩略图自动下载](#接收图片消息)。
2. 接收方收到 [EMChatEventHandler#onMessagesReceived 回调](#接收文本消息)，调用 `downloadAttachment` 下载视频文件。

```dart

EMClient.getInstance.chatManager.addMessageEvent(
  'UNIQUE_HANDLER_ID',
  ChatMessageEvent(
    onSuccess: (msgId, msg) {
      // 下载成功
    },
    onProgress: (msgId, progress) {
      // 下载进度
    },
    onError: (msgId, msg, error) {
      // 下载失败
    },
  ),
);

// 下载附件
EMClient.getInstance.chatManager.downloadAttachment(msg);

```

3. 获取视频缩略图和视频原文件。

```dart
EMVideoMessageBody body = msg.body as EMVideoMessageBody;
// 本地视频路径
body.localPath;
// 本地缩略图
body.thumbnailLocalPath;
// 服务器视频文件路径。
body.remotePath;
// 服务器缩略图路径。
body.thumbnailRemotePath;
```

### 接收文件消息

1. 接收方收到 [EMChatEventHandler#onMessagesReceived 回调](#接收文本消息)，调用 `downloadAttachment` 下载文件。

```dart
EMClient.getInstance.chatManager.addMessageEvent(
  'UNIQUE_HANDLER_ID',
  ChatMessageEvent(
    onSuccess: (msgId, msg) {
      // 下载成功
    },
    onProgress: (msgId, progress) {
      // 下载进度
    },
    onError: (msgId, msg, error) {
      // 下载失败
    },
  ),
);

// 下载附件
EMClient.getInstance.chatManager.downloadAttachment(msg);
```

2. 调用以下方法从服务器或本地获取文件附件：

```dart
EMFileMessageBody body = msg.body as EMFileMessageBody;
// 文件的本地路径
body.localPath;
// 文件的服务器路径
body.remotePath;
```

## 接收位置消息

接收位置消息与文本消息一致，详见 [接收文本消息](#接收文本消息)。
   
接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

## 接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

接收方通过 `onCmdMessagesReceived` 回调接收透传消息，方便用户进行不同的处理。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

```dart
final handler = EMChatEventHandler(
  onCmdMessagesReceived: (messages) {},
);

// 添加监听
EMClient.getInstance.chatManager.addEventHandler(
  "UNIQUE_HANDLER_ID",
  handler,
);

// ...

// 移除监听
EMClient.getInstance.chatManager.removeEventHandler(
  "UNIQUE_HANDLER_ID",
);
```

## 接收自定义类型消息

接收自定义消息与其他类型消息一致，详见 [接收文本消息](#接收文本消息)。

## 接收合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。

接收合并消息与接收普通消息的操作相同，详见 [接收文本消息](#接收文本消息)。
- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `EMChatManager#fetchCombineMessageDetail` 方法下载合并消息附件并解析出原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
  - 若附件已存在，该方法会直接解析附件并返回原始消息列表。
  - 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```dart

try {
  List<EMMessage> msgList =
      await EMClient.getInstance.chatManager.fetchCombineMessageDetail(
    message: combineMsg,
  );
} on EMError catch (e) {}

```