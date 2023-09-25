# 发送和接收消息

<Toc />

登录即时通讯服务后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- 透传消息。
- 自定义消息。
- 合并消息。

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

本文介绍如何使用即时通讯 IM SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Flutter SDK 通过 `EMChatManager` 和 `EMMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 Create 方法创建文本、文件、附件等类型的消息；
2. 发送方再调用 `SendMessage` 发送消息；
3. 接收方通过 `EMChatEventHandler` 中的方法监听消息回调事件。在收到 `onMessagesReceived` 后，即表示成功接收到消息。

消息收发流程如下：

1. 用户 A 发送一条消息到环信的消息服务器;
2. 单聊消息时，服务器投递消息给用户 B；对于群聊时消息，服务器投递给群内其他每一个成员;
3. 用户收到消息。

![img](@static/images/android/sendandreceivemsg.png)

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送文本消息

1. 首先，利用 `EMMessage` 类构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。

示例代码：

```dart
// 创建一条文本消息。
final msg = EMMessage.createTxtSendMessage(
  // `targetId` 为接收方，单聊为对端用户 ID、群聊为群组 ID，聊天室为聊天室 ID。
  targetId: conversationId,
  // `content` 为消息文字内容。
  content: 'hello',
  // 会话类型：单聊为 `Chat`，群聊为 `GroupChat`, 聊天室为 `ChatRoom`，默认为单聊。
  chatType: ChatType.Chat,
);

// 发送消息。
EMClient.getInstance.chatManager.sendMessage(msg);
```

对于聊天室，可以设置消息优先级，示例代码树下：

```dart
final msg = EMMessage.createTxtSendMessage(
  targetId: conversationId,
  content: 'hello',
  chatType: ChatType.ChatRoom,
);

// 聊天室消息的优先级。如果不设置，默认值为 `Normal`，即“普通”优先级。
msg.chatroomMessagePriority = ChatRoomMessagePriority.High;
EMClient.getInstance.chatManager.sendMessage(msg);

```

2. 通过 `EMChatManager` 将消息发出。发送时可以设置 `ChatMessageEvent` ，获取消息发送状态。

```dart
// 添加消息状态监听器
EMClient.getInstance.chatManager.addMessageEvent(
  "UNIQUE_HANDLER_ID",
  ChatMessageEvent(
    // 收到成功回调之后，可以对发送的消息进行更新处理，或者其他操作。
    onSuccess: (msgId, msg) {
      // msgId 发送时消息 ID;
      // msg 发送成功的消息;
    },
    // 收到回调之后，可以将发送的消息状态进行更新，或者进行其他操作。
    onError: (msgId, msg, error) {
      // msgId 发送时的消息 ID;
      // msg 发送失败的消息;
      // error 失败原因;
    },
    // 对于附件类型的消息，如图片，语音，文件，视频类型，上传或下载文件时会收到相应的进度值，表示附件的上传或者下载进度。
    onProgress: (msgId, progress) {
      // msgId 发送时的消息ID;
      // progress 进度;
    },
  ),
);

void dispose() {
  // 移除消息状态监听器
  EMClient.getInstance.chatManager.removeMessageEvent("UNIQUE_HANDLER_ID");
  super.dispose();
}

// 消息发送结果会通过 ChatMessageEvent 回调对象返回，该返回结果仅表示该方法的调用结果，与实际消息发送状态无关。
EMClient.getInstance.chatManager.sendMessage(message).then((value) {
  // 消息发送动作完成。
});
```

### 接收消息

你可以添加 `EMChatEventHandler` 监听器接收消息。

该 `EMChatEventHandler` 可以多次添加。请记得在不需要的时候移除该监听器，如在 `dispose` 时。

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

### 撤回消息

发送方可以撤回一条发送成功的消息。默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。
```dart
try {
  await EMClient.getInstance.chatManager.recallMessage(msgId);
} on EMError catch (e) {
}
```

### 设置消息撤回监听

```dart
// 消息被撤回时触发的回调（此回调位于 EMChatEventHandler 中）。
void onMessagesRecalled(List<EMMessage> messages) {}
```


### 发送和接收附件类型的消息

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
3. 获取附件的服务器地址和本地路径。

此外，发送附件类型消息时，可以在 `ChatMessageEvent#onProgress` 回调中获取附件上传的进度（百分比），以 int 表示，范围为 [0, 100]，示例代码如下：

```dart

final handler = ChatMessageEvent(
  // 消息发送成功回调，msgId 为消息原始 ID，msg 为发送完成后的消息。
  onSuccess: (msgId, msg) {},
  // 附件上传进度回调，msgId 为消息原始 ID，progress 为消息发送进度（百分比）, 范围[0, 100]。
  onProgress: (msgId, progress) {},
  // 消息发送失败回调，msgId 为消息原始 ID，msg 为发送完成后的消息，error 为错误原因。
  onError: (msgId, msg, error) {},
);

/// 添加监听
EMClient.getInstance.chatManager.addMessageEvent(
  'UNIQUE_HANDLER_ID',
  handler,
);

/// 移除监听
EMClient.getInstance.chatManager.removeMessageEvent('UNIQUE_HANDLER_ID');

```

#### 发送和接收语音消息

发送和接收语音消息的过程如下：

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `EMMessage#createVoiceSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）,语音文件的 filePath 和语音时长创建语音消息，然后调用 `sendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

```dart
final voiceMsg = EMMessage.createVoiceSendMessage(
  targetId: targetId,
  filePath: filePath,
  duration: 30,
);

EMClient.getInstance.chatManager.sendMessage(msg);
```
3. 接收方收到语音消息时，自动下载语音文件。

4. 接收方收到 `EMChatEventHandler#onMessagesReceived` 回调，调用 `remotePath` 或 `localPath` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```dart
if(msg.body.type == MessageType.VOICE) {
  EMVoiceMessageBody body = msg.body as EMVoiceMessageBody;
  body.duration; // 语音时长
  body.localPath; // 本地语音文件路径
  body.remotePath; // 远程语音文件路径
}

```

#### 发送和接收图片消息

发送和接收图片消息的流程如下：

1. 发送方调用 `EMMessage#createImageSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）和图片文件的 filePath，创建图片消息，然后调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。


```dart
final imgMsg = EMMessage.createImageSendMessage(
  targetId: targetId,
  filePath: filePath,
);

EMClient.getInstance.chatManager.sendMessage(imgMsg);
```

2. 接收方收到图片消息，自动下载图片缩略图。

3. 接收方收到 `EMChatEventHandler#onMessagesReceived` 回调，调用 `downloadAttachment` 下载大图。

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

4. 下载成功后获取图片消息的缩略图和附件。

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

#### 发送和接收视频消息

发送和接收视频消息的流程如下：

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。

你可以设置发送消息结果回调，用于接收消息发送进度或者发送结果，如发送成功或失败。为此，需实现 `EMChatManager#addMessageEvent` 接口。

2. 发送方调用 `EMMessage#createVideoSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）,图片文件的 filePath、创建视频消息，然后调用 `sendMessage` 方法发送消息。SDK 会将视频文件上传至消息服务器。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `createVideoSendMessage` 方法。


```dart

final videoMsg = EMMessage.createVideoSendMessage(
  targetId: targetId,
  filePath: filePath,
  thumbnailLocalPath: thumbnailLocalPath,
  duration: 30,
);

EMClient.getInstance.chatManager.sendMessage(videoMsg);

```

3. 接收方收到视频消息时，自动下载视频缩略图。

4. 接收方收到 `EMChatEventHandler#onMessagesReceived` 回调，调用 `downloadAttachment` 下载视频文件。

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

5. 获取视频缩略图和视频原文件。

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

#### 发送和接收文件消息

发送和接收文件消息的流程如下：

1. 发送方调用 `EMMessage#createImageSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）,文件的 filePath、创建文件消息，然后调用 `sendMessage` 方法发送该消息。SDK 将文件上传至环信服务器。

```dart
final fileMsg = EMMessage.createFileSendMessage(
  targetId: targetId,
  filePath: filePath,
);

EMClient.getInstance.chatManager.sendMessage(fileMsg);
```

2. 接收方收到 `EMChatEventHandler#onMessagesReceived` 回调，调用 `downloadAttachment` 下载文件。

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

3. 调用以下方法从服务器或本地获取文件附件：

```dart
EMFileMessageBody body = msg.body as EMFileMessageBody;
// 文件的本地路径
body.localPath;
// 文件的服务器路径
body.remotePath;
```

### 发送和接收位置消息

当你要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```dart
final localMsg = EMMessage.createLocationSendMessage(
  targetId: targetId,
  latitude: 0,
  longitude: 0,
  address: 'address',
);

EMClient.getInstance.chatManager.sendMessage(localMsg);
```

### 发送和接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。（透传消息不会存入本地数据库中，所以在 UI 上不会显示）。具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

```dart
final cmdMsg = EMMessage.createCmdSendMessage(
  targetId: targetId,
  // `action` 可以自定义。
  action: action,
);

EMClient.getInstance.chatManager.sendMessage(cmdMsg);
```
请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

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
    // 将该透传消息只发送给在线用户
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

### 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。自定义消息内容为 String 类型的 key-value 格式，你需要自己添加并解析该内容。

```dart
final customMsg = EMMessage.createCustomSendMessage(
  targetId: targetId,
  // `event` 为需要传递的自定义消息事件，比如礼物消息，可以设置：
  event: 'gift',
  // `params` 类型为 `Map<String, String>`。
  params: {'k': 'v'},
);

EMClient.getInstance.chatManager.sendMessage(customMsg);
```

### 发送和接收合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

#### 创建和发送合并消息

你可以调用 `createCombineSendMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `msgIds` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |
| `targetId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 子区会话：子区 ID；<br/> - 聊天室聊天：聊天室 ID。|

:::notice
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `EMOptions#serverTransfer` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```dart
final combineMsg = EMMessage.createCombineSendMessage(
  targetId: targetId,
  title: 'A和B的聊天记录',
  summary: 'A:这是A的消息内容\nB:这是B的消息内容',
  compatibleText: compatibleText,
  msgIds: msgIds,
);

EMClient.getInstance.chatManager.sendMessage(combineMsg);
```
接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

#### 解析合并消息

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `EMChatManager#fetchCombineMessageDetail` 方法下载合并消息附件并解析出原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：

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

### 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::notice
1. 仅 SDK 4.1.0 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端群组会话的未读计数。
3. 发送定向消息后，会在端上会创建本地会话，计入本地群组会话的未读消息数。
4. 定向消息不支持消息漫游功能，因此从服务器拉取漫游消息时，不包含定向消息。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。 
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```dart

final msg = EMMessage.createTxtSendMessage(
  targetId: targetId,
  content: 'content',
  chatType: ChatType.GroupChat,
);
// 设置消息接收方列表。最多可传 20 个接收方的用户 ID。若传入 `null`，则消息发送给群组或聊天室的所有成员。
msg.receiverList = ['userId1', 'userId2'];
EMClient.getInstance.chatManager.sendMessage(msg);

```
接收群定向消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

### 使用消息的扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```dart
try {
  final msg = EMMessage.createTxtSendMessage(
    targetId: targetId,
    content: 'content',
  );

  msg.attributes = {'k': 'v'};
  EMClient.getInstance.chatManager.sendMessage(msg);
} on EMError catch (e) {}
```