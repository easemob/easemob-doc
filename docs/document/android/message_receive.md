# 接收消息

## 功能说明

环信即时通讯 IM Android SDK 通过 `EMMessageListener` 接收文本、图片、语音、视频、文件、位置、透传、自定义和合并等类型的消息。应用在消息监听回调中识别消息类型，读取对应消息体并根据业务需要展示或处理消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 监听消息事件

应用通过 `EMChatManager#addMessageListener` 注册 `EMMessageListener`。收到普通消息时触发 `onMessageReceived`；收到透传消息时，还会触发 `onCmdMessageReceived`。

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        // 处理文本、附件、位置、自定义及合并消息。
    }

    @Override
    public void onCmdMessageReceived(List<EMMessage> messages) {
        // 处理透传消息。
    }
};

EMClient.getInstance().chatManager().addMessageListener(messageListener);
// 不再使用时移除监听器。
EMClient.getInstance().chatManager().removeMessageListener(messageListener);
```

## 消息通用信息

收到消息后，可通过以下 `EMMessage` 方法读取消息的通用信息：

| 字段或属性 | 获取方式 | 说明 |
| :--- | :--- | :--- |
| 消息 ID | `EMMessage#getMsgId` | 消息的唯一 ID。 |
| 发送方 | `EMMessage#getFrom` | 消息发送者的用户 ID。 |
| 接收方 | `EMMessage#getTo` | 消息目标 ID。 |
| 会话类型 | `EMMessage#getChatType` | 单聊、群聊或聊天室。 |
| 消息类型 | `EMMessage#getType` | 文本、图片、语音、视频、文件等类型。 |
| 消息体 | `EMMessage#getBody` | 获取并转换为对应的 `EMMessageBody` 子类。 |
| 扩展字段 | `EMMessage#getStringAttribute` 等 | 读取发送方通过 `setAttribute` 设置的业务字段。 |

## 接收文本消息

收到 `onMessageReceived` 回调后，遍历消息列表。对于文本消息，将消息体转换为 `EMTextMessageBody`，调用 `getMessage()` 获取文本内容；如需读取业务扩展字段，可调用 `EMMessage#getExt()` 获取扩展字段映射。

示例代码如下所示：

```java
EMMessageListener messageListener = new EMMessageListener() {
    @Override
    public void onMessageReceived(List<EMMessage> messages) {
        for (EMMessage message : messages) {
            if (message.getType() != EMMessage.Type.TXT) {
                continue;
            }

            // 获取文本消息内容。
            EMTextMessageBody textBody =
                    (EMTextMessageBody) message.getBody();
            String text = textBody.getMessage();

            // 按业务字段名读取消息扩展字段。
            // 字段不存在时返回默认值 null。
            String businessValue = message.getStringAttribute(
                    "businessKey",
                    null);

            EMLog.d(
                    "Message",
                    "text: " + text
                            + ", businessValue: " + businessValue);
        }
    }

    // 其他回调方法按需实现。
};

EMClient.getInstance()
        .chatManager()
        .addMessageListener(messageListener);
```

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、大图、视频和文件，需调用对应下载接口。
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `getRemoteUrl` 或 `getLocalUri` 方法获取语音文件的服务器地址或本地路径，从而获取语音文件。

```java
EMVoiceMessageBody voiceBody = (EMVoiceMessageBody) message.getBody();
// 获取语音文件在服务器的地址。
String voiceRemoteUrl = voiceBody.getRemoteUrl();
// 本地语音文件的资源路径。
Uri voiceLocalUri = voiceBody.getLocalUri();
```

### 接收图片消息

一条图片消息通常包含三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：服务端基于原图进行等比压缩后的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。


收到图片消息后，SDK 会根据配置自动下载缩略图。若业务需要显示更清晰的图片，可再按需下载大图或原图。

接收图片消息的流程如下：

1. 接收图片消息时，SDK 会根据配置决定是否自动下载缩略图：

- 默认自动下载，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(true)`。
- 如果关闭自动下载，即 `EMClient.getInstance().getOptions().setAutoDownloadThumbnail(false)`，则需要调用 `EMClient.getInstance().chatManager().downloadThumbnail(message, callback)` 手动下载。

2. 收到图片消息后，接收方可以在 `onMessageReceived` 回调中处理图片消息，并根据业务需要下载原图或大图。

- 调用 `downloadAttachment(message, callback)` 下载原图。
- 调用 `downloadBigImage(message, callback)` 下载大图。

如果本地已存在对应资源路径，建议优先复用本地文件，避免重复下载。

示例代码如下所示：

```java
@Override
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == EMMessage.Type.IMAGE) {
            EMCallBack callback = new EMCallBack() {
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
           };
           // 下载原图
           EMClient.getInstance().chatManager().downloadAttachment(message, callback);
           // 下载大图
           EMClient.getInstance().chatManager().downloadBigImage(message, callback);
        }
    }
}
```

3. 你可以通过 `EMImageMessageBody` 获取原图、大图和缩略图的服务端地址或本地路径：

```java
EMImageMessageBody imgBody = (EMImageMessageBody) message.getBody();
// 从服务端获取原图
String imgRemoteUrl = imgBody.getRemoteUrl();
// 从服务端获取大图
String bigImgRemoteUrl = imgBody.getBigImageRemoteUrl();
// 从服务端获取图片缩略图
String thumbnailUrl = imgBody.getThumbnailUrl();
// 从本地获取原图
Uri imgLocalUri = imgBody.getLocalUri();
// 从本地获取大图
Uri bigImgLocalUri = imgBody.getBigImageLocalUri();
// 从本地获取图片缩略图
Uri thumbnailLocalUri = imgBody.thumbnailLocalUri();
```

此外，SDK 还支持通过以下方法判断图片资源状态：

- `isOriginalImage()`：判断当前消息对应的是原图还是发送方压缩后的大图资源。
- `getBigImageDownloadStatus()`：获取大图的下载状态。
- `getWidth()` / `getHeight()`：获取图片宽高。

### 接收 GIF 图片消息

GIF 图片缩略图的下载与普通图片消息相同，详见 [接收图片消息](#接收图片消息)。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `onMessageReceived` 回调方法。接收方判断为图片消息后，读取消息体的 `isGif` 属性，若 `isGif()` 返回 `true`，则为 GIF 图片消息；返回 `false` 时为普通图片消息。

```java
public void onMessageReceived(List<EMMessage> messages) {
    for(EMMessage message : messages) {
        if (message.getType() == EMMessage.Type.IMAGE) {
            EMImageMessageBody body = (EMImageMessageBody) message.getBody();
            if(body.isGif()) {
                // 根据业务情况处理gif message, 例如下载展示该消息
            }
        }
    }
    
}
```

### 接收视频消息

收到视频消息后，通常会先在聊天界面展示视频缩略图；当用户点击消息时，再下载或播放视频原文件。

接收视频消息的流程如下：

1. 接收方收到视频消息时，SDK 会根据配置决定是否自动下载视频缩略图。

   视频缩略图的下载策略与图片缩略图一致。默认情况下，SDK 自动下载缩略图；如果关闭自动下载，则需要在业务侧手动下载。详见 [设置图片缩略图自动下载](#接收图片消息)。

2. SDK 会通过 `onMessageReceived` 回调将视频消息传递给接收方。接收方可根据业务需要选择使用缩略图，或进一步下载视频原文件。

   - 如果只需要在会话列表或聊天界面展示预览图，可优先使用缩略图。
   - 如果用户需要播放视频，再调用 `EMClient.getInstance().chatManager().downloadAttachment(message, callback)` 下载视频原文件。

3. 为避免重复下载，建议优先检查本地是否已存在对应的视频文件或缩略图；如果本地已有可用资源，可直接复用。

```java
/**
 * 下载视频文件。
 */
private void downloadVideo(final EMMessage message) {
    EMCallBack callback = new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onProgress(final int progress,String status) {
        }

        @Override
        public void onError(final int error, String msg) {
        }
    };
    // 下载附件
    EMClient.getInstance().chatManager().downloadAttachment(message, callback);
}
```

4. 通过 `EMVideoMessageBody` 获取视频原文件和缩略图的服务端地址或本地路径。其中，缩略图适合用于预览展示，视频原文件适合用于播放或下载保存。

```java
EMVideoMessageBody videoBody =
        (EMVideoMessageBody) message.getBody();
// 从服务器端获取视频文件。
String videoRemoteUrl = videoBody.getRemoteUrl();
// 从服务器获取视频缩略图文件。
String thumbnailUrl = videoBody.getThumbnailUrl();
// 从本地获取视频文件文件。
Uri localUri = videoBody.getLocalUri();
// 从本地获取视频缩略图文件。
Uri localThumbUri = videoBody.getLocalThumbUri();
```

### 接收文件消息

接收文件消息的流程如下所示：

1. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `downloadAttachment(message, callback)` 方法下载文件。

```java
/**
 * 下载文件。
 */
private void downloadFile(final EMMessage message) {
    EMCallBack callback = new EMCallBack() {
        @Override
        public void onSuccess() {
        }

        @Override
        public void onProgress(final int progress,String status) {
        }

        @Override
        public void onError(final int error, String msg) {
        }
    };
    // 下载附件
    EMClient.getInstance().chatManager().downloadAttachment(message, callback);
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

将消息体转换为 `EMLocationMessageBody`，通过 `getLatitude()`、`getLongitude()` 和 `getAddress()` 获取位置坐标及地址信息。

```java
EMLocationMessageBody locationBody =
        (EMLocationMessageBody) message.getBody();
double latitude = locationBody.getLatitude();
double longitude = locationBody.getLongitude();
String address = locationBody.getAddress();
```

## 接收透传消息

可将透传消息理解为一条指令，通过发送这条指令给对方，通知对方要执行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

接收方通过 `onMessageReceived` 和 `onCmdMessageReceived` 回调接收透传消息，方便用户进行不同的处理。透传消息通常通过 `onCmdMessageReceived` 接收。

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

将消息体转换为 `EMCmdMessageBody`，通过 `action()` 获取命令动作。如需传递结构化参数，应在命令内容中定义业务协议，或改用自定义消息。

## 接收自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，应用在 `onMessageReceived` 回调中判断消息类型并读取消息体。

将消息体转换为 `EMCustomMessageBody`，通过 `event()` 获取自定义事件，通过 `getParams()` 获取自定义参数。

```java
EMCustomMessageBody customBody =
        (EMCustomMessageBody) message.getBody();
String event = customBody.event();
Map<String, String> params = customBody.getParams();
```

## 接收合并消息

接收合并消息与接收普通消息的操作相同，应用在 `onMessageReceived` 回调中识别 `EMMessage.Type.COMBINE` 消息。

- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，可以调用 `EMChatManager#downloadAndParseCombineMessage` 下载并解析合并消息附件，获取原始消息列表：
- 首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表：
  - 若附件已存在，该方法会直接解析附件并返回原始消息列表。
  - 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

将消息体转换为 `EMCombineMessageBody` 后，可以读取合并消息的标题、摘要和兼容文本。

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

## 更多

### 消息接收回调返回发送成功的消息

若初始化时开启了 `EMOptions#setIncludeSendMessageInMessageListener` 选项，发送成功的消息也会通过 `onMessageReceived` 事件返回。

### 判断消息是否为聊天室广播消息

对于聊天室消息，你可以通过消息的 `EMMessage#isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/broadcast_to_chatrooms.html)。

### 消息附件下载鉴权

环信即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment(message, callback)` 等下载接口下载消息附件。

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`downloadThumbnail`](#接收图片消息) | `EMChatManager` | 下载图片或视频缩略图。 |
| [`downloadBigImage`](#接收图片消息) | `EMChatManager` | 下载图片大图。 |
| [`downloadAttachment`](#接收附件消息) | `EMChatManager` | 下载原图、视频或文件附件。 |
| [`downloadAndParseCombineMessage`](#接收合并消息) | `EMChatManager` | 下载并解析合并消息。 |
| [`thumbnailLocalUri`](#接收图片消息) | `EMImageMessageBody` | 获取图片缩略图本地 URI。 |
