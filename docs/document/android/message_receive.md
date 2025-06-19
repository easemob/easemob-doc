# 接收消息

环信即时通讯 IM Android SDK 通过 [EMMessageListener](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_message_listener.html) 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以用注册监听 [EMMessageListener](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_message_listener.html) 接收消息。该 [EMMessageListener](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_message_listener.html) 可以多次添加，请记得在不需要的时候移除 `listener`，如在 `activity` 的 `onDestroy()` 时。
- 在新消息到来时，你会收到 `onMessageReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `EMOptions#setIncludeSendMessageInMessageListener` 开关，则该回调中会返回发送成功的消息。
- 对于聊天室消息，你可以通过消息的 `EMMessage#isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_broadcast.html#发送聊天室全局广播消息)。

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

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
2. 获取附件的服务器地址和本地路径。

自 4.14.0 版本开始，即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment` 方法下载消息附件。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `getRemoteUrl` 或 `getLocalUri` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```java
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) msg.getBody();
// 获取语音文件在服务器的地址。
String voiceRemoteUrl = voiceBody.getRemoteUrl();
// 本地语音文件的资源路径。
Uri voiceLocalUri = voiceBody.getLocalUri();
```

### 接收图片消息

1. 接收方收到图片消息，自动下载图片缩略图。

- 默认情况下，SDK 自动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(true)`。
- 若设置为手动下载缩略图，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`，需调用 `EMClient.getInstance().chatManager().downloadThumbnail(message)` 下载。

2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `downloadAttachment` 下载原图。

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

3. 获取图片消息的缩略图和附件。

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

### 接收 GIF 图片消息

自 Android SDK 4.14.0 开始，支持接收 GIF 图片消息。

图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `onMessageReceived` 回调方法。接收方判断为图片消息后，读取消息体的 `isGif` 属性，若值是 `YES`， 则为 GIF 图片消息。

```java
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == Type.IMAGE && ) {
            EMImageMessageBody body = (EMImageMessageBody) msg.getBody();
            if(body.isGif()) {
                // 根据业务情况处理gif message, 例如下载展示该消息
            }
        }
    }
    
}
```

### 接收视频消息

1. 接收方收到视频消息时，自动下载视频缩略图。你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见 [设置图片缩略图自动下载](#接收图片消息)。
2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，可以调用 `EMClient.getInstance().chatManager().downloadAttachment(message)` 方法下载视频原文件。

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

3. 获取视频缩略图和视频原文件。

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

### 接收文件消息

1. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `downloadAttachment` 方法下载文件。

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

2. 调用以下方法从服务器或本地获取文件附件：

```java
EMNormalFileMessageBody fileMessageBody = (EMNormalFileMessageBody) message.getBody();
// 从服务器获取文件。
String fileRemoteUrl = fileMessageBody.getRemoteUrl();
// 从本地获取文件。
Uri fileLocalUri = fileMessageBody.getLocalUri();
```

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

接收方通过 `onMessageReceived` 和 `onCmdMessageReceived` 回调接收透传消息，方便用户进行不同的处理。

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

## 接收自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，详见[接收文本消息](#接收文本消息)。

## 接收合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。

接收合并消息与接收普通消息的操作相同，详见[接收文本消息](#接收文本消息)。

- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
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

