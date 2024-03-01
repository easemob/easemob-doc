# 发送和接收消息

<Toc />

登录即时通讯服务后，用户可以在单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- 透传消息。
- 自定义消息。
- 合并消息。
- 定向消息。

对于单聊，环信即时通信 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要[开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

本文介绍如何使用即时通讯 IM Android SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM Android SDK 通过 `EMChatManager` 类和 `EMMessage` 类实现消息的发送和接收。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 Create 方法创建文本、文件、附件等类型的消息；
2. 发送方调用 `SendMessage` 发送消息；
3. 通过 `addMessageListener` 添加消息接收的回调通知。

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

```java
// 创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊时为对端用户 ID、群聊时为群组 ID，聊天室时为聊天室 ID。
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
// 会话类型：单聊为 EMMessage.ChatType.Chat，群聊为 EMMessage.ChatType.GroupChat, 聊天室为EMMessage.ChatType.ChatRoom，默认为单聊。
message.setChatType(EMMessage.ChatType.Chat);
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

对于聊天室消息，可设置消息优先级。示例代码如下：

```java
   EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
   message.setChatType(ChatType.ChatRoom);
   // 聊天室消息的优先级。如果不设置，默认值为 `PriorityNormal`，即“普通”优先级。
   message.setPriority(EMChatRoomMessagePriority.PriorityHigh);
   sendMessage(message);
```

2. 通过 `EMChatManager` 将该消息发出。发送消息时可以设置 `EMCallBack` 的实例，获取消息发送状态。

```java
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

若初始化时打开了 `EMOptions#setUseReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。

### 接收消息

你可以用注册监听 `EMMessageListener` 接收消息。该 `EMMessageListener` 可以多次添加，请记得在不需要的时候移除 `listener`，如在 `activity` 的 `onDestroy()` 时。

在新消息到来时，你会收到 `onMessageReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `EMOptions#setIncludeSendMessageInMessageListener` 开关，则该回调中会返回发送成功的消息。

对于聊天室消息，你可以通过消息的 `EMMessage#isBroadcast` 属性判断该消息是否为[通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_chatroom.html#发送聊天室全局广播消息)。

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

### 发送和接收附件类型的消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
3. 获取附件的服务器地址和本地路径。

此外，发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

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

#### 发送和接收语音消息

发送和接收语音消息的过程如下：

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `createVoiceSendMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息，然后调用 `sendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

```java
// `voiceUri` 为语音文件的本地资源标志符，`duration` 为语音时长（单位为秒）。
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, duration, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

3. 接收方收到语音消息时，自动下载语音文件。

4. 接收方收到 `onMessageReceived` 回调，调用 `getRemoteUrl` 或 `getLocalUri` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```java
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) msg.getBody();
// 获取语音文件在服务器的地址。
String voiceRemoteUrl = voiceBody.getRemoteUrl();
// 本地语音文件的资源路径。
Uri voiceLocalUri = voiceBody.getLocalUri();
```

#### 发送和接收图片消息

发送和接收图片消息的流程如下：

1. 发送方调用 `createImageSendMessage` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID （群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息，然后调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。
```java
// `imageUri` 为图片本地资源标志符，`false` 为不发送原图（默认超过 100 KB 的图片会压缩后发给对方），若需要发送原图传 `true`，即设置 `original` 参数为 `true`。
EMMessage message = EMMessage.createImageSendMessage(imageUri, false, toChatUsername);
// 会话类型，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
if (chatType == CHATTYPE_GROUP)
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

2. 接收方收到图片消息，自动下载图片缩略图。

SDK 默认自动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(true)`。若设置为手动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`，需调用 `EMClient.getInstance().chatManager().downloadThumbnail(message)` 下载。

3. 接收方收到 `onMessageReceived` 回调，调用 `downloadAttachment` 下载原图。

```java
@Override
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == Type.IMAGE) {
            message.setMessageStatusCallback(new EMCallBack() {
               @Override
               public void onSuccess() {
                   // 附件下载成功
               }
               @Override
               public void onError(int code, String error) {
                   // 附件下载失败
               }

               @Override
               public void onProgress(int progress, String status) {
                   // 附件下载进度
               }

           });
           // 下载附件
           EMClient.getInstance().chatManager().downloadAttachment(message);
        }
    }
}
```

4. 获取图片消息的缩略图和附件。

```java
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

#### 发送和接收视频消息

发送和接收视频消息的流程如下：

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。

2. 发送方调用 `createVideoSendMessage` 方法传入视频文件的本地资源标志符、缩略图的本地存储路径、视频时长以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID），然后调用 `sendMessage` 方法发送消息。SDK 会将视频文件上传至消息服务器。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `createVideoSendMessage` 方法。

```java
// 在应用层获取视频首帧
String thumbPath = getThumbPath(videoUri);
EMMessage message = EMMessage.createVideoSendMessage(videoUri, thumbPath, videoLength, toChatUsername);
// 会话类型，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
if (chatType == CHATTYPE_GROUP)
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

3. 接收方收到视频消息时，自动下载视频缩略图。

SDK 默认自动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(true)`。若设置为手动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`，需调用 `EMClient.getInstance().chatManager().downloadThumbnail(message)` 下载。

4. 接收方收到 `onMessageReceived` 回调，可以调用 `EMClient.getInstance().chatManager().downloadAttachment(message)` 方法下载视频原文件。

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

5. 获取视频缩略图和视频原文件。

```java
// 从服务器端获取视频文件。
String imgRemoteUrl = ((EMVideoMessageBody) body).getRemoteUrl();
// 从服务器获取视频缩略图文件。
String thumbnailUrl = ((EMVideoMessageBody) body).getThumbnailUrl();
// 从本地获取视频文件文件。
Uri localUri = ((EMVideoMessageBody) body).getLocalUri();
// 从本地获取视频缩略图文件。
Uri localThumbUri = ((EMVideoMessageBody) body).thumbnailLocalUri();
```

#### 发送和接收文件消息

发送和接收文件消息的流程如下：

1. 发送方调用 `createFileSendMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息，然后调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```java
// `fileLocalUri` 为本地资源标志符。
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
if (chatType == CHATTYPE_GROUP)    
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

2. 接收方收到 `onMessageReceived` 回调，调用 `downloadAttachment` 方法下载文件。

```java
/**
 * 下载文件。
 */
private void downloadFile(final EMMessage message) {
    message.setMessageStatusCallback(new CallBack() {
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

3. 调用以下方法从服务器或本地获取文件附件：

```java
EMNormalFileMessageBody fileMessageBody = (EMNormalFileMessageBody) message.getBody();
// 从服务器获取文件。
String fileRemoteUrl = fileMessageBody.getRemoteUrl();
// 从本地获取文件。
Uri fileLocalUri = fileMessageBody.getLocalUri();
```

### 发送和接收位置消息

当你要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```java
// `latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容。
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
if (chatType == CHATTYPE_GROUP)    
    message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送和接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。（透传消息不会存入本地数据库中，所以在 UI 上不会显示）。具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

:::tip
透传消息发送后，不支持撤回。
:::

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

:::tip
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

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。自定义消息内容为 String 类型的 key-value 格式，你需要自己添加并解析该内容。

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

### 发送和接收合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。合并消息转发后在接收端显示该消息的标题和预览图。

#### 创建和发送合并消息

你可以调用 `createCombinedSendMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `messageIdList` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |
| `userId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 子区会话：子区 ID；<br/> - 聊天室聊天：聊天室 ID。|

:::tip
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `EMOptions#setAutoTransferMessageAttachments` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
3. 合并消息不支持搜索。
:::

示例代码如下：

```java
String title = "A和B的聊天记录";
String summary = "A:这是A的消息内容\nB:这是B的消息内容";
String compatibleText = "您当前的版本不支持该消息，请升级到最新版本";
EMMessage message = EMMessage.createCombinedSendMessage(title, summary, compatibleText, msgIdList, receiverId);
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        // 消息发送成功的处理逻辑
    }

    @Override
    public void onError(int code, String error) {
        // 消息发送失败的处理逻辑
    }
});
EMClient.getInstance().chatManager().sendMessage(message);
```

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

#### 解析合并消息

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：

- 若附件已存在，该方法会直接解析附件并返回原始消息列表。
- 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```java
EMClient.getInstance().chatManager().downloadAndParseCombineMessage(combineMessage, new EMValueCallBack<List<EMMessage>>() {
    @Override
    public void onSuccess(List<EMMessage> value) {
        // 处理并展示消息列表
    }

    @Override
    public void onError(int error, String errorMsg) {
        // 处理出错信息
    }
});
```

### 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::tip
1. 仅 SDK 4.0.3 及以上版本支持。
2. 定向消息不写入服务端会话列表，不计入服务端会话的未读消息数。
3. 定向消息不支持消息漫游功能，因此从服务器拉取漫游消息时，不包含定向消息。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。 
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```java
// 创建一条文本消息。
EMMessage message = EMMessage.createTextSendMessage(content, groupId);
        // 会话类型：群组和聊天室聊天，分别为 `GroupChat` 和 `ChatRoom`。
        message.setChatType(EMMessage.ChatType.GroupChat);
        List<String> receives=new ArrayList<>();
        receives.add("张三");
        receives.add("李四");
        // 设置消息接收方列表。最多可传 20 个接收方的用户 ID。若传入 `null`，则消息发送给群组或聊天室的所有成员。
        message.setReceiverList(receives);
EMClient.getInstance().chatManager().sendMessage(message);
```

接收群定向消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

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
