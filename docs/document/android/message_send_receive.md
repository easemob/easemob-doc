# 发送和接收消息

<Toc />

登录 Chat app 后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- CMD 消息。
- 自定义消息。

以及对以上消息进行自定义扩展。
本文介绍如何使用即时通讯 IM Android SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Android SDK 通过 `EMChatManager` 类和 `EMMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 Create 方法创建文本、文件、附件等类型的消息；
2. 发送方再调用 `SendMessage` 发送消息；
3. 发送方可通过 `recallMessage` 撤回自己发出的消息；
4. 通过 `addMessageListener` 添加消息接收的回调通知。

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

1. 首先，利用 `EMMessage` 类构造一个消息。

示例代码：

```java
// 创建一条文本消息，`content` 为消息文字内容，`toChatUsername` 为对方用户或者群聊的 ID，后文皆是如此。
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
// 设置消息类型，即设置 `Message` 类的 `ChatType` 属性。该属性的值为 `Chat`、`GroupChat` 和 `ChatRoom`，表明该消息是单聊，群聊或聊天室消息，默认为单聊。若为群聊，设置 `ChatType` 为 `GroupChat`。
message.setChatType(ChatType.GroupChat);
```

2. 通过 `EMChatManager` 将该消息发出。发送消息时可以设置 `EMCallBack` 的实例，获取消息发送状态。

```java
...
// 发送消息时可以设置 `EMCallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
message.setMessageStatusCallback(new EMCallBack() {
     @Override
     public void onSuccess() {
         // 发送消息成功
     }
     @Override
     public void onError(int code, String error) {
         // 发送消息失败
     }
     @Override
     public void onProgress(int progress, String status) {

     }

 });
 // 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

### 接收消息

你可以用注册监听 `EMMessageListener` 接收消息。

该 `EMMessageListener` 可以多次添加，请记得在不需要的时候移除 `listener`，如在 `activity` 的 `onDestroy()` 时。

在新消息到来时，你会收到 `onMessageReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```java
EMMessageListener msgListener = new EMMessageListener() {

   // 收到消息，遍历消息队列，解析和显示。
   @Override
   public void onMessageReceived(List<EMMessage> messages) {

   }
};
// 注册消息监听
EMClient.getInstance().chatManager().addMessageListener(msgListener);
// 解注册消息监听
EMClient.getInstance().chatManager().removeMessageListener(msgListener);
```

### 撤回消息

消息发送后 2 分钟之内，消息的发送方可以撤回该消息。如果需要调整可撤回时限，可以联系商务。

```java
try {
    EMClient.getInstance().chatManager().recallMessage(message);
    EMLog.d("TAG", "撤回消息成功");
} catch (EMException e) {
    e.printStackTrace();
    EMLog.e("TAG", "撤回消息失败的原因: "+e.getDescription());
}
```

或者用异步方法：

```java
EMClient.getInstance().chatManager().aysncRecallMessage(message, new CallBack() {
    @Override
    public void onSuccess() {
        EMLog.d("TAG", "撤回消息成功");
    }
    @Override
    public void onError(int errorCode, String errorMessage) {
        EMLog.e("TAG", "撤回消息失败的原因: "+errorMessage);
    }
    @Override
    public void onProgress(int i, String s) {
    }
});
```

### 设置消息撤回监听

```java
/**
 * \~chinese
 * 接收到消息被撤回时触发此回调。
 *
 * \~english
 * Occurs when a received message is recalled.
 */
void onMessageRecalled(List<ChatMessage> messages);
```

### 发送附件类型的消息

除文本消息外，还有几种其他类型的消息，其中语音，图片，短视频，文件等消息，是通过先将附件上传到消息服务器的方式实现。收到语音时，会自动下载，而图片和视频会自动下载缩略图。文件消息不会自动下载附件，接收方需调用下载附件的 API，具体实现参考下文。

#### 发送语音消息

发送语音消息时，应用层需完成语音文件录制的功能，提供语音文件的 URI 和语音时长。

```java
// `voiceUri` 为语音文件的本地资源标志符，`duration` 为语音时长（秒）。
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, duration, toChatUsername);
// 设置消息类型，即设置 `Message` 类的 `MessageType` 属性。
// 该属性的值为 `Chat`、`Group` 和 `Room`，表明该消息是单聊，群聊或聊天室消息，默认为单聊。
// 若为群聊，设置 `MessageType` 为 `Group`。
message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

接收方收到语音消息后，参考如下示例代码获取语音消息的附件：

```java
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) msg.getBody();
// 获取语音文件在服务器的地址。
String voiceRemoteUrl = voiceBody.getRemoteUrl();
// 本地语音文件的资源路径。
Uri voiceLocalUri = voiceBody.getLocalUri();
```

#### 发送图片消息

图片消息默认会被压缩后发出，可通过设置 `original` 参数为 `true` 发送原图。
参考如下示例代码，创建并接收图片消息：

```java
// `imageUri` 为图片本地资源标志符，`false` 为不发送原图（默认超过 100 KB 的图片会压缩后发给对方），需要发送原图传 `true`。
EMMessage message = EMMessage.createImageSendMessage(imageUri, false, toChatUsername);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
if (chatType == CHATTYPE_GROUP)
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);

// 发送成功后，获取图片消息缩略图及附件。
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
// 从服务器端获取图片文件。
String imgRemoteUrl = imgBody.getRemoteUrl();
// 从服务器端获取图片缩略图。
String thumbnailUrl = imgBody.getThumbnailUrl();
// 从本地获取图片文件。
Uri imgLocalUri = imgBody.getLocalUri();
// 从本地获取图片缩略图。
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
```

接收方如果设置了自动下载，即 `EMClient.getInstance().getOptions().getAutodownloadThumbnail()` 为 `true`，SDK 接收到消息后会下载缩略图；如果未设置自动下载，需主动调用 `EMClient.getInstance().chatManager().downloadThumbnail(message`) 下载。

下载完成后，调用相应消息 `body` 的 `thumbnailLocalUri()` 去获取缩略图路径。

#### 发送短视频消息

发送短视频消息时，应用层需要完成视频文件的选取或者录制。视频消息支持输入视频的首帧作为缩略图，也支持给出视频的时长作为参数，发送给接收方。

```java
String thumbPath = getThumbPath(videoUri);
EMMessage message = EMMessage.createVideoSendMessage(videoUri, thumbPath, videoLength, toChatUsername);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

接收方收到短视频消息后，SDK 默认会下载该视频消息的缩略图。

使用 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)` 可以修改为不自动下载。

如果未设置自动下载，需主动调用 `EMClient.getInstance().chatManager().downloadThumbnail(message`) 下载。

短视频文件本身需要通过 `EMClient.getInstance().chatManager().downloadAttachment(message)` 下载，下载完成后，调用相应消息 body 的 `thumbnailLocalUri()` 获取缩略图路径。

```java
/**
 * 下载视频文件。
 */
private void downloadVideo(final EMMessage message) {
    message.setMessageStatusCallback(new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onProgress(final int progress,String status) {
        }

        @Override
        public void onError(final int error, String msg) {
        }
    });
    // 下载附件
    EMClient.getInstance().chatManager().downloadAttachment(message);
}
```

获取视频封面的服务器地址：

```java
String thumbnailUrl = ((EMVideoMessageBody) body).getThumbnailUrl();
```

获取视频封面的本地资源路径：

```java
Uri localThumbUri = ((EMVideoMessageBody) body).getLocalThumbUri();
```

#### 发送文件消息

```java
// `fileLocalUri` 为本地资源标志符。
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
if (chatType == CHATTYPE_GROUP)    
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

发送成功后，获取文件消息附件：

```java
EMNormalFileMessageBody fileMessageBody = (EMNormalFileMessageBody) message.getBody();
// 从服务器获取文件。
String fileRemoteUrl = fileMessageBody.getRemoteUrl();
// 从本地获取文件。
Uri fileLocalUri = fileMessageBody.getLocalUri();
```

发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```java
// 发送消息时可以设置 `EMCallBack` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如，消息发送失败后的提示等等。
 message.setMessageStatusCallback(new EMCallBack() {
     @Override
     public void onSuccess() {
         // 发送消息成功
          dialog.dismiss();
     }
     @Override
     public void onError(int code, String error) {
         // 发送消息失败
     }

     // 消息发送的状态，这里只用于附件类型的消息。
     @Override
     public void onProgress(int progress, String status) {

     }

 });
 // 发送消息
 EMClient.getInstance().chatManager().sendMessage(message);
```

#### 下载缩略图及附件

图片消息和视频消息默认会生成缩略图，接收到图片消息，视频消息默认会自动下载缩略图。语音消息接收到后会自动下载。如果不想自动下载附件，可以通过配置修改，即修改 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`。

如果未设置自动下载，需主动调用 `EMClient.getInstance().chatManager().downloadThumbnail(message)` 下载。

下载完成后，调用相应消息 body 的 `thumbnailLocalUri()` 获取缩略图路径。

```java
// 从服务器下载缩略图。
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
// 从本地获取图片缩略图。
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
```

下载附件

下载附件的方法为：`EMClient.getInstance().chatManager().downloadAttachment(message)`;

下载完成后，调用相应消息 body 的 `getLocalUri()` 获取附件路径。

例如：

```java
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
// 从本地获取图片文件。
Uri imgLocalUri = imgBody.getLocalUri();
```

### 发送位置消息

当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```java
// `latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容。
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
if (chatType == CHATTYPE_GROUP)    
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。（透传消息不会存入本地数据库中，所以在 UI 上不会显示）。具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

```java
EMMessage cmdMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
// 支持单聊、群聊和聊天室，默认为单聊。
// 若为群聊，添加下行代码。
cmdMsg.setChatType(EMMessage.ChatType.GroupChat);
// 若为聊天室，添加下行代码。
// cmdMsg.setChatType(EMMessage.ChatType.ChatRoom);

String action="action1";
// `action` 可以自定义。
EMCmdMessageBody cmdBody = new EMCmdMessageBody(action);
String toUsername = "test1";
// 发送给特定用户。
cmdMsg.setTo(toUsername);
cmdMsg.addBody(cmdBody);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(cmdMsg);
```

请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

```java
EMMessageListener msgListener = new EMMessageListener(){
  // 收到消息。
  @Override
  public void onMessageReceived(List<EMMessage> messages) {
  }
  // 收到透传消息。
  @Override
  public void onCmdMessageReceived(List<EMMessage> messages) {
  }
}
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

```java
//发送表示正在输入的透传消息
private static final String MSG_TYPING_BEGIN = "TypingBegin";
private long previousChangedTimeStamp;

private void textChange() {
    long currentTimestamp = System.currentTimeMillis();
    if(currentTimestamp - previousChangedTimeStamp > 5) {
        sendBeginTyping();
        previousChangedTimeStamp = currentTimestamp;
    }
}

private void sendBeginTyping() {
    EMMessage beginMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
    EMCmdMessageBody body = new EMCmdMessageBody(MSG_TYPING_BEGIN);
    // 将该透传消息只发送给在线用户
    body.deliverOnlineOnly(true);
    beginMsg.addBody(body);
    beginMsg.setTo(toChatUsername);
    EMClient.getInstance().chatManager().sendMessage(beginMsg);
}
```

以下示例代码展示如何接受和解析输入状态的透传消息。

```java
private static final int TYPING_SHOW_TIME = 10000;
private static final int MSG_TYPING_END = 1;
private Handler typingHandler;

private void initTypingHandler() {
    typingHandler = new Handler(Looper.myLooper()) {
        @Override
        public void handleMessage(@NonNull Message msg) {
            switch (msg.what) {
                case MSG_TYPING_END :
                    cancelTimer();
                    break;
            }
        }
    };
}

@Override
public void onCmdMessageReceived(List<EMMessage> messages) {
    for (EMMessage msg : messages) {
        if(!TextUtils.equals(msg.conversationId(), currentConversationId)) {
            return;
        }
        EMCmdMessageBody body = (EMCmdMessageBody) msg.getBody();
        if(TextUtils.equals(body.action(), MSG_TYPING_BEGIN)) {
            // 这里需更新 UI，显示“对方正在输入”
            beginTimer();
        }
    }
}

private void beginTimer() {
    if(typingHandler != null) {
        typingHandler.removeMessages(MSG_TYPING_END);
        typingHandler.sendEmptyMessageDelayed(MSG_TYPING_END, TYPING_SHOW_TIME);
    }
}

private void cancelTimer() {
    // 这里需更新 UI，不再显示“对方正在输入”
    if(typingHandler != null) {
        typingHandler.removeCallbacksAndMessages(null);
    }
}

```

### 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。自定义消息内容是 key，value 格式，你需要自己添加并解析该内容。

```java
EMMessage customMessage = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
// `event` 为需要传递的自定义消息事件，比如礼物消息，可以设置：
String event = "gift";
EMCustomMessageBody customBody = new EMCustomMessageBody(event);
// `params` 类型为 `Map<String, String>`。
customBody.setParams(params);
customMessage.addBody(customBody);
// `to` 指另一方环信用户 ID（或者群组 ID，聊天室 ID）
customMessage.setTo(to);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
customMessage.setChatType(chatType);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(customMessage);
```

### 使用消息的扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```java
EMMessage message = EMMessage.createTxtSendMessage(content, toChatUsername);
// 增加自定义属性。
message.setAttribute("attribute1", "value");
message.setAttribute("attribute2", true);
// 接收消息的时候获取扩展属性。
EMClient.getInstance().chatManager().sendMessage(message);
// 获取自定义属性，第 2 个参数为没有此定义的属性时返回的默认值。
message.getStringAttribute("attribute1",null);
message.getBooleanAttribute("attribute2", false)
```
