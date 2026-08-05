# 发送消息

## 功能说明

环信即时通讯 IM Android SDK 通过 `EMMessage` 创建消息，并通过 `EMChatManager` 发送消息。SDK 支持文本、图片、GIF、语音、视频、文件、位置、透传、自定义和合并消息，可用于单聊、群聊和聊天室。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/console/basic_user.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送消息统一流程

各类消息均按照以下流程发送：

1. 调用 `EMMessage` 对应的消息创建方法，设置消息内容和目标会话 ID。
2. 设置会话类型。单聊默认为 `EMMessage.ChatType.Chat`；群聊和聊天室需分别设置为 `GroupChat` 和 `ChatRoom`。
3. 按业务需要设置扩展字段、已读回执、聊天室消息优先级或回调环境等可选属性。
4. 调用 `EMMessage#setMessageStatusCallback` 监听发送结果和附件上传进度。
5. 调用 `EMChatManager#sendMessage` 发送消息。

## 通用消息创建参数

Android SDK 通过 `EMMessage` 的不同静态方法创建各类消息。不同消息类型的创建方法参数并不完全相同；创建消息后，还可以通过 `EMMessage` 提供的方法设置会话类型、扩展字段以及其他可选属性。

| 参数或属性       | Android 设置方式                                             | 是否必需         | 适用场景         | 说明                                                         |
| ---------------- | ------------------------------------------------------------ | ---------------- | ---------------- | ------------------------------------------------------------ |
| 目标会话 ID      | 各 `create*SendMessage()` 方法的接收方参数，或 `EMMessage#setTo` | 必需             | 所有消息         | 单聊时传入对端用户 ID，群聊时传入群组 ID，聊天室时传入聊天室 ID。 |
| 消息内容         | 各消息创建方法的内容参数，或 `EMMessage#setBody`             | 必需             | 所有消息         | 参数随消息类型而不同，例如文本内容、附件 URI、位置坐标、透传命令或自定义事件。 |
| 会话类型         | `EMMessage#setChatType`                                      | 群聊和聊天室必需 | 所有消息         | 单聊、群聊和聊天室分别设置为 `EMMessage.ChatType.Chat`、`GroupChat` 和 `ChatRoom`。默认值为 `Chat`。 |
| 扩展字段         | `EMMessage#setAttribute`                                     | 可选             | 所有消息         | 添加业务自定义信息。支持字符串、布尔值、数值、JSON 对象和 JSON 数组等类型；扩展字段会计入消息大小限制。 |
| 仅在线投递       | `EMMessage#deliverOnlineOnly`                                | 可选             | 所有消息         | 设置为 `true` 时，消息仅投递给在线用户，不进行离线存储。适用于输入状态、瞬时控制信息等场景。 |
| 回调路由环境     | `EMMessage#setWebhookEnv`                                    | 可选             | 所有消息         | 设置 Webhook 回调环境标识，服务端根据该值匹配回调路由。      |
| 聊天室消息优先级 | `EMMessage#setPriority`                                      | 可选             | 聊天室消息       | 设置聊天室消息的优先级，可选 `PriorityHigh`、`PriorityNormal` 和 `PriorityLow`，默认值为 `PriorityNormal`。 |
| 定向接收成员     | `EMMessage#setReceiverList`                                  | 可选             | 群聊和聊天室消息 | 设置群聊或聊天室消息的指定接收成员列表。是否可用还受相应服务端功能配置和使用限制约束。 |
| 是否需要已读回执 | `EMMessage#setIsNeedReadReceipt`                             | 可选             | 单聊和群聊消息   | 标记该消息是否需要已读回执。接收方发送已读回执前，消息的该属性必须为 `true`；聊天室不支持消息已读回执。 |

## 接口频率限制

默认情况下，SDK 不限制单个用户发送消息的频率。如果已联系环信商务配置单用户发送频率限制，当用户在单聊、群聊或聊天室中的发送频率超过上限时，SDK 会返回错误码 `509`（`MESSAGE_CURRENT_LIMITING`）。

## 发送文本消息

#### 发送流程

1. 调用 `EMMessage#createTextSendMessage` 创建文本消息。

   创建消息时传入文本内容和目标会话 ID。单聊、群聊和聊天室的目标会话 ID 分别为对端用户 ID、群组 ID 和聊天室 ID。

   创建消息后，可根据业务需要设置扩展字段、目标翻译语言、仅在线投递、定向接收成员和消息优先级等属性。部分属性仅适用于特定会话类型，例如：

   - `EMMessage#setReceiverList` 仅适用于群聊和聊天室定向消息。
   - `EMMessage#setPriority` 仅适用于聊天室消息。
   - `EMMessage#setIsNeedReadReceipt` 适用于单聊和群聊消息，不支持聊天室。
   - 群聊和聊天室消息需要通过 `EMMessage#setChatType` 设置对应的会话类型。

2. 调用 `EMChatManager#sendMessage` 发送文本消息。

   如需获取发送结果，可在发送前调用 `EMMessage#setMessageStatusCallback` 设置回调。

创建和发送文本消息的示例代码如下所示：

```java
// 创建文本消息：单聊传入对端用户 ID，群聊传入群组 ID，
// 聊天室传入聊天室 ID。
EMMessage message = EMMessage.createTextSendMessage(
        "Hello!",
        conversationId);

// 设置会话类型。单聊默认为 Chat；群聊和聊天室需分别设置为
// GroupChat 和 ChatRoom。
message.setChatType(EMMessage.ChatType.Chat);

// 设置消息发送状态回调。
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        // 消息发送成功。
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        // 消息发送失败，根据错误码和错误信息处理。
    }

    @Override
    public void onProgress(int progress, String status) {
        // 文本消息通常不涉及附件上传进度。
    }
});

// 发送消息。
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

#### 关键参数和属性

| 参数或属性       | 类型                                  | 设置方式                                  | 必填/可选        | 适用场景             | 说明                                                         |
| ---------------- | ------------------------------------- | ----------------------------------------- | ---------------- | -------------------- | ------------------------------------------------------------ |
| 文本内容         | `String`                              | `createTextSendMessage` 的 `message` 参数 | 必填             | 文本消息             | 文本消息的正文。                                             |
| 目标会话 ID      | `String`                              | `createTextSendMessage` 的 `to` 参数      | 必填             | 所有会话类型         | 单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。  |
| 会话类型         | `EMMessage.ChatType`                  | `setChatType`                             | 群聊和聊天室必填 | 所有会话类型         | 单聊、群聊和聊天室分别为 `Chat`、`GroupChat` 和 `ChatRoom`。默认值为 `Chat`。 |
| 目标翻译语言     | `List<String>`                        | `EMTextMessageBody#setTargetLanguages`    | 可选             | 文本消息             | 从文本消息中获取 `EMTextMessageBody` 后设置目标翻译语言代码。 |
| 扩展字段         | 取决于字段值                          | `setAttribute`                            | 可选             | 业务扩展信息         | 用于携带业务附加信息。扩展字段会计入消息大小限制。           |
| 仅在线投递       | `boolean`                             | `deliverOnlineOnly`                       | 可选             | 瞬时消息、状态通知   | 设置为 `true` 时，消息仅投递给在线用户。                     |
| 回调路由环境     | `String`                              | `setWebhookEnv`                           | 可选             | 多环境回调路由       | 设置 Webhook 回调环境标识。                                  |
| 定向接收成员     | `List<String>`                        | `setReceiverList`                         | 可选             | 群聊、聊天室定向消息 | 指定群聊或聊天室消息的接收成员。                             |
| 是否需要已读回执 | `boolean`                             | `setIsNeedReadReceipt`                    | 可选             | 单聊、群聊           | 标记消息是否需要已读回执；聊天室不支持。                     |
| 消息优先级       | `EMMessage.EMChatRoomMessagePriority` | `setPriority`                             | 可选             | 聊天室消息           | 设置聊天室消息优先级。                                       |

#### 带群消息已读回执和扩展字段的示例

对于带有业务属性的文本消息，可通过 `EMMessage#setAttribute` 添加扩展字段。群聊场景下，如需统计群成员的消息已读情况，可调用 `EMMessage#setIsNeedReadReceipt(true)`。

```java
// 创建群聊文本消息，groupId 为群组 ID。
EMMessage message = EMMessage.createTextSendMessage(
        "大家好",
        groupId);

// 设置为群聊消息。
message.setChatType(EMMessage.ChatType.GroupChat);

// 添加业务扩展字段。
message.setAttribute("bizType", "announcement");

// 设置该消息需要已读回执。
message.setIsNeedReadReceipt(true);

// 发送消息。
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

#### 发送流程

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。另外，你也可以 [上传消息附件至自有服务器](#上传消息附件至自有服务器)。

#### 资源处理说明

默认情况下，调用 `EMChatManager#sendMessage` 后，SDK 会自动将本地附件上传至环信服务器；接收方也可由 SDK 自动下载附件。你可以通过 `EMOptions#setAutoTransferMessageAttachments` 控制附件是否由 SDK 自动传输。消息附件大小和存储限制，详见 [消息附件限制说明](/product/limitation.html#消息存储)。

### 发送图片消息

图片消息通常涉及以下三类图片资源：

- 原图：发送方本地选择的原始图片文件，通常用于查看或保存原图。
- 大图：SDK 客户端基于原图进行等比压缩后上传的图片。压缩规则为：若图片短边大于 720 像素，则等比压缩至短边为 720 像素；若短边小于等于 720 像素，则保留原图尺寸，不做放大处理。此类图片通常用于聊天详情页展示。
- 缩略图：服务端基于原图进行等比压缩后的图片。压缩规则为：默认情况下，若图片短边大于 170 像素，则等比压缩至短边为 170 像素；若短边小于等于 170 像素，则保留原图尺寸，不做放大处理。缩略图的压缩方式和尺寸可在 [控制台进行配置](/product/console/basic_message.html#图片消息缩略图)。此类图片通常用于会话列表、聊天列表等轻量展示场景。

#### 发送流程

发送图片消息的流程如下：

1. 获取图片的本地 URI。
2. 调用 `EMMessage#createImageSendMessage` 创建图片消息。
   
   创建消息时，需要传入图片的本地 URI、是否发送原图的标志，以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID。

   `sendOriginalImage` 参数用于控制实际上传的图片资源：`true` 表示 SDK 上传原图，`false` 表示上传大图。

3. 调用 `EMChatManager#sendMessage` 发送消息。
   
   如果开启了 `EMOptions#setAutoTransferMessageAttachments(boolean)`，SDK 会自动上传图片附件。服务器自动生成缩略图。

创建和发送图片消息的示例代码如下所示： 

```java
// 获取图片的本地文件路径。
String imagePath = selectedImagePath;

if (imagePath == null || imagePath.isEmpty()) {
    throw new IllegalArgumentException("图片路径不能为空");
}

// 创建图片消息。
EMMessage message = EMMessage.createImageSendMessage(
        imagePath,
        false,          // false 表示发送大图；true 表示发送原图。
        conversationId  // 单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。
);

// 设置会话类型：单聊、群聊和聊天室分别为 Chat、GroupChat 和 ChatRoom。
// 单聊默认为 Chat；发送群聊或聊天室消息时，需要设置对应类型。
message.setChatType(EMMessage.ChatType.Chat);

// 发送图片消息。默认情况下，SDK 会自动上传图片附件。
EMClient.getInstance()
        .chatManager()
        .sendMessage(message);
```

#### 关键参数

| 参数                | 类型      | 必填/可选 | 说明                                                         |
| ------------------- | --------- | --------- | ------------------------------------------------------------ |
| `imagePath`          | `Uri`     | 必填      | 图片的本地 URI，通常通过系统相册或文件选择器获取。           |
| `sendOriginalImage` | `boolean` | 必填      | 是否发送原图。`true` 表示上传原图，`false` 表示上传大图。建议根据图片质量和上传流量需求设置。 |
| `conversationId`    | `String`  | 必填      | 目标会话 ID。单聊时为对端用户 ID，群聊时为群组 ID，聊天室时为聊天室 ID。 |

### 发送 GIF 图片

GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。

#### 发送流程

发送 GIF 图片消息的过程如下：

1. 发送方调用 `EMMessage#createGifImageMessage` 方法构造 GIF 图片消息体。
2. 发送方调用 `EMChatManager#sendMessage` 发送 GIF 图片消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

创建和发送 GIF 图片消息的示例代码如下所示：

```java
// `imagePath` 为 GIF 图片的本地文件路径（String 类型）
EMMessage message = EMMessage.createGifImageMessage(imagePath, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(EMMessage.ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `imagePath` | `Uri` | 必填 | GIF 图片的本地 URI。GIF 图片发送时不进行压缩。 |
| `toChatUsername` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

### 发送语音消息

#### 发送流程

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `EMMessage#createVoiceSendMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息。
3. 发送方调用 `EMChatManager#sendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

创建和发送语音消息的示例代码如下所示：

```java
// `voiceUri` 为语音文件的本地资源标志符，`duration` 为语音时长（单位为秒）。
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, duration, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(EMMessage.ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `voiceUri` | `Uri` | 必填 | 语音文件的本地 URI。 |
| `duration` | `int` | 必填 | 语音时长，单位为秒。 |
| `toChatUsername` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

### 发送视频消息

发送视频消息前，需要先准备视频文件、本地缩略图路径和视频时长。其中，缩略图和时长主要用于消息展示。

#### 发送流程

发送视频消息的流程如下：

1. 在应用层完成视频文件的选取或录制，并准备视频文件的本地 URI、视频时长和缩略图路径。

2. 调用 `EMMessage#createVideoSendMessage` 创建视频消息。

   创建消息时，需要传入视频文件的本地 URI、缩略图的本地路径、视频时长以及接收方的用户 ID。若为群聊或聊天室消息，则分别传入群组 ID 或聊天室 ID。

   如果需要显示视频缩略图，你需要在应用层自行获取视频首帧，并将对应路径作为 `thumbPath` 参数传入。

3. 调用 `EMChatManager#sendMessage` 发送消息。

   发送过程中，SDK 会先上传视频附件，上传完成后再发送消息。你可以结合消息状态或相关回调感知上传进度以及发送结果。

创建和发送视频消息的示例代码如下所示：

```java
// 在应用层获取视频首帧，你需要自己实现 getThumbPath 方法。
String thumbPath = getThumbPath(videoUri);
EMMessage message = EMMessage.createVideoSendMessage(videoUri, thumbPath, videoLength, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(EMMessage.ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `videoUri` | `Uri` | 必填 | 视频文件的本地 URI。 |
| `thumbPath` | `String` | 必填 | 视频缩略图的本地路径，由应用层生成。 |
| `videoLength` | `int` | 必填 | 视频时长，单位为秒。 |
| `toChatUsername` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

### 发送文件消息

#### 发送流程

1. 发送方调用 `EMMessage#createFileSendMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

创建和发送文件消息的示例代码如下所示：

```java
// `fileLocalUri` 为本地资源标志符。
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。 
// message.setChatType(EMMessage.ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `fileLocalUri` | `Uri` | 必填 | 文件的本地 URI。 |
| `toChatUsername` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

### 上传消息附件至自有服务器

发消息时，若要将消息附件上传至你自己的服务器（而非环信服务器），需执行以下操作：

1. 在 SDK 初始化时调用 `EMOptions#setAutoTransferMessageAttachments(false)`，使 SDK **不再自动上传或下载附件**。设置后，`EMChatManager#sendMessage()` 将不再处理图片、视频等附件的自动处理与上传逻辑。
2. 图片上传到你的服务器后，将附件 URL 填入消息体，然后发送消息。
   以图片消息为例，上传后获取其 URL，通过 `EMImageMessageBody#setRemoteUrl(String)` 设置到消息体中，然后调用 `sendMessage()` 发送消息。

```java
// 1) SDK 初始化时关闭“自动上传附件到环信服务器”
EMOptions options = new EMOptions();
options.setAutoTransferMessageAttachments(false);
EMClient.getInstance().init(appContext, options);

// 2) 你的业务：将图片上传到自有服务器，拿到可访问的 URL
// String urlPath = uploadToYourServerAndGetUrl(...);

// 3) 发送图片消息
public static void sendPrivateUrlImg(String toUserId,
                                     String urlPath,
                                     String localPathForPreview /*可选：用于本地预览/占位*/ ) {

    // 构造图片消息体（仍建议传一个本地路径用于本地展示；实际下载通过 urlPath 由你自己控制）
    EMImageMessageBody body = new EMImageMessageBody(new java.io.File(localPathForPreview));
    body.setRemoteUrl(urlPath);              // 图片远程 URL（你的服务器地址）
    body.setFileName("IMG_111.png");         // 可选：文件名
    // body.setFileLength(10000);            // 可选：文件大小（字节），不设置也可以

    // 构造消息
    EMMessage message = EMMessage.createSendMessage(EMMessage.Type.IMAGE);
    message.setTo(toUserId);
    message.setBody(body);

    // （可选）发送回调
    message.setMessageStatusCallback(new EMCallBack() {
        @Override public void onSuccess() { /* send success */ }
        @Override public void onError(int code, String error) { /* send fail */ }
        @Override public void onProgress(int progress, String status) { }
    });

    // 发送消息
    EMClient.getInstance().chatManager().sendMessage(message);
}
```

:::tip
接收端收到消息后，可通过 `((EMImageMessageBody)msg.getBody()).getRemoteUrl()` 取到你的 URL，然后用你自己的下载/展示逻辑处理（因为你已关闭 SDK 自动附件传输）。
:::

## 发送位置消息

发送位置消息时，应用需要先集成第三方地图服务，获取位置的经纬度和地址信息。

#### 发送流程

1. 发送方调用 `EMMessage#createLocationSendMessage` 方法创建位置消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送位置消息。

创建和发送位置消息的示例代码如下所示：

```java
// `latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容。
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。 
// message.setChatType(EMMessage.ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

| 参数 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `latitude` | `double` | 必填 | 纬度。 |
| `longitude` | `double` | 必填 | 经度。 |
| `locationAddress` | `String` | 必填 | 位置的文字描述。 |
| `toChatUsername` | `String` | 必填 | 目标会话 ID。单聊为对端用户 ID，群聊为群组 ID，聊天室为聊天室 ID。 |

#### 逻辑说明

Android SDK 只负责封装和发送位置消息，不提供地图定位或地图展示能力。应用需自行接入地图服务获取坐标，并在接收端根据业务需要展示位置。

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

#### 发送流程

发送透传消息的过程如下：

1. 发送方调用 `EMMessage#createSendMessage` 方法创建透传消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送透传消息。

创建和发送透传消息的示例代码如下所示：

```java
EMMessage cmdMsg = EMMessage.createSendMessage(EMMessage.Type.CMD);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// 若为群聊，添加下行代码。
// cmdMsg.setChatType(EMMessage.ChatType.GroupChat);
// 若为聊天室，添加下行代码。
// cmdMsg.setChatType(EMMessage.ChatType.ChatRoom);

String action="action1";
// `action` 可以自定义。
EMCmdMessageBody cmdBody = new EMCmdMessageBody(action);
String toUsername = "test1";
// 对于单聊，传入接收方的用户 ID，群聊传入群组 ID，聊天室传入聊天室 ID。
cmdMsg.setTo(toUsername);
cmdMsg.setBody(cmdBody);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(cmdMsg);
```

#### 关键参数

| 参数或属性 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `action` | `String` | 必填 | 命令动作。不能以 `em_` 或 `easemob::` 开头。 |
| `toUsername` | `String` | 必填 | 目标会话 ID。 |
| `chatType` | `EMMessage.ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊 `Chat`。 |

## 发送自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

#### 发送流程

1. 发送方调用 `EMMessage#createSendMessage` 方法创建自定义消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送自定义消息。

创建和发送自定义消息的示例代码如下所示：

```java
EMMessage customMessage = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
// `event` 为需要传递的自定义消息事件，比如礼物消息，可以设置：
String event = "gift";
EMCustomMessageBody customBody = new EMCustomMessageBody(event);
// `params` 类型为 `Map<String, String>`。
customBody.setParams(params);
customMessage.setBody(customBody);
// `to` 指定接收方，单聊、群聊和聊天室分别为对端用户 ID、群组 ID 和聊天室 ID。
customMessage.setTo(to);
// 对于单聊、群群聊或聊天室，`chatType` 分别为 `Chat`、`GroupChat` 和 `ChatRoom`，默认是单聊。
customMessage.setChatType(chatType);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(customMessage);
```

#### 关键参数

| 参数或属性 | 类型 | 必填/可选 | 说明 |
| :--- | :--- | :--- | :--- |
| `event` | `String` | 必填 | 自定义消息的事件类型，例如 `gift`。 |
| `params` | `Map<String, String>` | 可选 | 自定义消息携带的键值对参数。 |
| `to` | `String` | 必填 | 目标会话 ID。 |
| `chatType` | `EMMessage.ChatType` | 群聊和聊天室必填 | 会话类型，默认为单聊 `Chat`。 |

## 发送合并消息

环信即时通讯 IM 开始支持将多个消息合并在一起进行转发。

#### 发送流程

你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

你可以调用 `createCombinedSendMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建和发送合并消息的示例代码如下所示：

```java
String title = "A和B的聊天记录";
String summary = "A:这是A的消息内容\nB:这是B的消息内容";
String compatibleText = "您当前的版本不支持该消息，请升级到最新版本";

// 添加原消息 ID。
ArrayList<String> msgIdList = new ArrayList<>();
msgIdList.add("1390191369179366180");
msgIdList.add("1390191426268037924");
msgIdList.add("1390186040483906340");

EMMessage message = EMMessage.createCombinedSendMessage(
        title,
        summary,
        compatibleText,
        msgIdList,
        receiverId);

// 群聊或聊天室消息需设置相应的会话类型。
// message.setChatType(EMMessage.ChatType.GroupChat);

EMClient.getInstance().chatManager().sendMessage(message);
```

#### 关键参数

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `messageIdList` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |
| `userId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 消息话题会话：消息话题 ID；<br/> - 聊天室聊天：聊天室 ID。|

#### 逻辑说明

:::tip
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `EMOptions#setAutoTransferMessageAttachments` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
3. 对于转发合并消息，例如，用户 A 向用户 B 发送了合并消息，用户 B 将该合并消息转发给用户 C，需要调用转发单条合并消息的 API。详见 [转发单条消息](message_forward.html#转发单条消息)。
:::

#### 使用建议

合并消息适用于转发聊天记录等场景。创建合并消息前，应确认原始消息 ID 列表非空且不超过 300 条；展示合并消息时，应使用 `title`、`summary` 和 `compatibleText` 提供清晰的摘要及低版本兼容提示。

## 发送过程回调

#### 使用说明

发送消息前，可调用 `EMMessage#setMessageStatusCallback` 设置回调，以获取消息发送成功、发送失败以及附件上传进度。对于附件消息，`onProgress` 中的 `progress` 表示上传进度百分比。

#### 示例代码

```java
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        // 消息发送成功。
    }

    @Override
    public void onError(int errorCode, String errorMessage) {
        // 消息发送失败，根据错误码和错误信息处理。
    }

    @Override
    public void onProgress(int progress, String status) {
        // 附件上传进度，取值范围为 0-100。
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

#### 回调参数说明

| 回调 | 说明 |
| :--- | :--- |
| `onSuccess()` | 消息发送成功时触发。 |
| `onError(int, String)` | 消息发送失败时触发，返回错误码和错误信息。 |
| `onProgress(int, String)` | 上传附件时触发；`progress` 表示上传进度百分比。文本等无附件消息通常不会产生有效的上传进度。 |

#### 逻辑说明

`EMChatManager#sendMessage` 本身不接收回调参数。应用应先为待发送的 `EMMessage` 设置状态回调，再调用 `sendMessage`。同一个回调可同时用于更新消息发送状态和附件上传进度。

## 更多

#### 聊天室消息优先级与消息丢弃逻辑

对于聊天室消息，环信即时通讯 IM 支持高、普通和低三种消息优先级。你可以通过 `EMMessage#setPriority` 设置单条聊天室消息的优先级。

- `EMMessage.EMChatRoomMessagePriority.PriorityHigh`：高优先级。
- `EMMessage.EMChatRoomMessagePriority.PriorityNormal`：普通优先级，默认值。
- `EMMessage.EMChatRoomMessagePriority.PriorityLow`：低优先级。

当聊天室消息并发量过大或发送频率过高时，服务器会优先处理高优先级消息，并优先丢弃低优先级消息。因此，可以将打赏、公告等重要消息设置为高优先级。

消息优先级只能提高重要消息被优先处理的可能性，不能保证消息必达。在聊天室消息并发量过大的情况下，高优先级消息仍可能被丢弃。

对于单个聊天室，默认每秒发送的消息数量超过 20 条时，可能触发消息丢弃逻辑：

1. 服务器优先丢弃低优先级消息，尽量保留高优先级消息。
2. 同一优先级的消息超过限制时，服务器按照消息发送时间顺序处理，后发送的消息可能被丢弃。

```java
String roomId = "roomId";

// 创建文本消息。
EMMessage message = EMMessage.createTextSendMessage("Hi", roomId);

// 设置为聊天室消息。
message.setChatType(EMMessage.ChatType.ChatRoom);

// 设置聊天室消息优先级。
// 未设置时，默认值为 PriorityNormal。
message.setPriority(
        EMMessage.EMChatRoomMessagePriority.PriorityHigh
);

// 设置发送结果回调。
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onSuccess() {
        Log.d("Chat", "发送成功");
    }

    @Override
    public void onError(int code, String error) {
        Log.e("Chat", "发送失败：" + code + ", " + error);
    }

    @Override
    public void onProgress(int progress, String status) {
        // 文本消息通常不会触发该回调。
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

:::tip 
`setPriority` 仅对聊天室消息有效，不适用于单聊和群聊消息。
:::

#### 语聊房麦位管理

你可以基于 [聊天室自定义属性](room_attributes.html) 实现语聊房麦位状态管理和多端同步，例如记录麦位用户、麦位状态和音量状态等信息。

Android SDK 的聊天室自定义属性采用 `Map<String, String>` 格式：

```java
Map<String, String>
```

因此，麦位列表或其他结构化数据不能直接作为数组、`Map` 或自定义对象写入。应用可以采用以下方式存储：

- 每个麦位使用一个独立属性，属性 Key 表示麦位编号，Value 为序列化后的麦位信息。
- 将麦位列表序列化为 JSON 字符串后，作为单个属性值写入。

例如，设置单个麦位属性：

```java
String roomId = "roomId";
Map<String, String> attributes = new HashMap<>();

// Value 为序列化后的麦位信息。
attributes.put("seat_1", "{\"userId\":\"user_001\",\"state\":\"open\",\"volume\":0}");

EMClient.getInstance().chatroomManager()
        .asyncSetChatroomAttributes(
                roomId,
                attributes,
                false,
                new EMResultCallBack<Map<String, Integer>>() {
                    @Override
                    public void onSuccess(Map<String, Integer> result) {
                        // result 为各属性的设置结果。
                    }

                    @Override
                    public void onError(int errorCode, String errorMsg) {
                        Log.e("ChatRoom", "设置麦位属性失败：" + errorMsg);
                    }
                }
        );
```

设置或更新聊天室自定义属性后，聊天室内其他成员可以通过 `EMChatRoomChangeListener#onAttributesUpdate(String, Map<String, String>, String)` 监听属性变更，并更新本地麦位状态：

```java
@Override
public void onAttributesUpdate(
        String chatRoomId,
        Map<String, String> attributeMap,
        String from) {
    // attributeMap 为本次更新的属性。
    // 解析麦位数据并刷新界面。
}
```

通过 `EMClient.getInstance().chatroomManager().addChatRoomChangeListener(...)` 注册监听器。具体实现方式和权限要求，详见 [聊天室自定义属性](room_attributes.html)。

#### 获取发送附件消息的进度

发送图片、语音、视频或文件等附件消息时，可以通过 `EMMessage#setMessageStatusCallback(EMCallBack)` 的 `onProgress` 回调获取附件上传进度。

`progress` 的取值范围为 `0-100`，表示附件上传百分比。通过 `onSuccess` 和 `onError` 回调可以获取消息发送结果：

- `onSuccess`：消息发送成功。
- `onError`：消息发送失败，包含错误码和错误描述。
- `message`：发送前创建的 `EMMessage` 对象；发送成功后可通过 `message.getMsgId()` 获取消息 ID。

```java
// message 为已创建的图片、语音、视频或文件消息。
message.setMessageStatusCallback(new EMCallBack() {
    @Override
    public void onProgress(int progress, String status) {
        // 附件上传进度，取值范围为 0～100。
        runOnUiThread(() -> {
            Log.d("Chat", "上传进度：" + progress + "%");
            // progressBar.setProgress(progress);
        });
    }

    @Override
    public void onSuccess() {
        runOnUiThread(() -> {
            Log.d("Chat", "发送成功，消息 ID：" + message.getMsgId());
        });
    }

    @Override
    public void onError(int code, String error) {
        runOnUiThread(() -> {
            Log.e("Chat", "发送失败：" + code + ", " + error);
        });
    }
});

EMClient.getInstance().chatManager().sendMessage(message);
```

:::tip 
文本、位置、透传和自定义消息通常不涉及附件上传，`onProgress` 一般不会被触发。SDK 回调不保证在主线程执行，更新 Android UI 时需要切换到主线程。
:::

#### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/value-added/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

默认情况下，内容审核替换后的内容仅下发至接收方。发送方如需同步接收替换内容，需 **联系环信商务开通权限**，并在初始化 SDK 时将 `EMOptions#setUseReplacedMessageContents` 参数设为 `true`。开启后，发送方将在消息被审核替换时收到新内容；若开关关闭（默认状态），则发送方仍保留原始发送内容，不会感知替换结果。

#### 消息大小和存储限制

各类消息的大小和存储限制，详见 [消息限制说明](/product/limitation.html#消息大小)。

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

发消息时调用 `setWebhookEnv` 设置回调环境。

回调环境参数 `webhookEnv` 的说明如下：

| 参数 |类型 | 是否必需 | 说明 |
| :--- | :--- |  :--- | :--- |
| `webhookEnv` | String | 否 | 回调环境值。回调环境仅支持字母和数字，长度不超过 8 个字符。服务器根据该值匹配控制台中的回调地址。建议与控制台中配置的回调环境保持一致，例如 `dev`、`test`、`prod`。 |

调用 `setWebhookEnv` 设置回调环境：

```java
// 创建消息
EMMessage message = EMMessage.createTextSendMessage("hello", "toUser");

// 设置回调环境 
message.setWebhookEnv("test");

// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

调用 `getWebhookEnv` 读取当前消息设置的回调环境值：

```java
String webhookEnv = message.getWebhookEnv();
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
| [`createTextSendMessage`](#发送文本消息) | `EMMessage` | 创建文本消息。 |
| [`createImageSendMessage`](#发送图片消息) | `EMMessage` | 创建图片消息。 |
| [`createGifImageMessage`](#发送-gif-图片) | `EMMessage` | 创建 GIF 图片消息。 |
| [`createVoiceSendMessage`](#发送语音消息) | `EMMessage` | 创建语音消息。 |
| [`createVideoSendMessage`](#发送视频消息) | `EMMessage` | 创建视频消息。 |
| [`createFileSendMessage`](#发送文件消息) | `EMMessage` | 创建文件消息。 |
| [`createLocationSendMessage`](#发送位置消息) | `EMMessage` | 创建位置消息。 |
| [`createSendMessage`](#发送透传消息) | `EMMessage` | 创建指定类型的待发送消息。 |
| [`createCombinedSendMessage`](#发送合并消息) | `EMMessage` | 创建合并消息。 |
| [`deliverOnlineOnly`](#通用消息创建参数) | `EMMessage` | 设置消息是否仅投递给在线用户。 |
| [`sendMessage`](#发送消息统一流程) | `EMChatManager` | 发送消息。 |
| [`downloadAndParseCombineMessage`](#发送合并消息) | `EMChatManager` | 下载并解析合并消息附件。 |
| [`setAutoTransferMessageAttachments`](#上传消息附件至自有服务器) | `EMOptions` | 设置 SDK 是否自动上传和下载消息附件。 |
| [`setUseReplacedMessageContents`](#发送消息前的内容审核) | `EMOptions` | 设置发送方是否接收内容审核替换后的消息内容。 |



