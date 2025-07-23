# 发送消息

环信即时通讯 IM Android SDK 通过 [EMChatManager](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html)、[EMMessage](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_message.html) 和 [EMOptions](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_options.html) 类实现文本、图片、音频、视频和文件等类型的消息的发送和接收。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

1. 发送方调用 [EMMessage#createTextSendMessage](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_message.html) 方法构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。

```java
// 创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊时为对端用户 ID、群聊时为群组 ID，聊天室时为聊天室 ID。
EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
// 会话类型：单聊为 EMMessage.ChatType.Chat，群聊为 EMMessage.ChatType.GroupChat, 聊天室为EMMessage.ChatType.ChatRoom，默认为单聊。
message.setChatType(EMMessage.ChatType.Chat);
// 发送消息。
EMClient.getInstance().chatManager().sendMessage(message);
```

2. 发送方调用 [EMChatManager#sendMessage](https://sdkdocs.easemob.com/apidoc/android/chat3.0/classcom_1_1hyphenate_1_1chat_1_1_e_m_chat_manager.html) 发送消息。
   
   发送消息时可以设置 [EMCallBack](https://sdkdocs.easemob.com/apidoc/android/chat3.0/interfacecom_1_1hyphenate_1_1_e_m_call_back.html) 的实例，获取消息发送状态。

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

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `EMMessage#createVoiceSendMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息。
3. 发送方调用 `EMChatManager#sendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

```java
// `voiceUri` 为语音文件的本地资源标志符，`duration` 为语音时长（单位为秒）。
EMMessage message = EMMessage.createVoiceSendMessage(voiceUri, duration, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送图片消息

1. 发送方调用 `EMMessage#createImageSendMessage` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID （群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送该消息。
   
```java
// `imageUri` 为图片本地资源标志符，`false` 为不发送原图（默认超过 100 KB 的图片会压缩后发给对方），若需要发送原图传 `true`，即设置 `original` 参数为 `true`。
EMMessage message = EMMessage.createImageSendMessage(imageUri, false, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送 GIF 图片消息

- 自 Android SDK 4.14.0 开始，支持发送 GIF 图片消息。
- GIF 图片消息是一种特殊的图片消息，与普通图片消息不同，**GIF 图片发送时不能压缩**。

发送 GIF 图片消息的过程如下：

1. 发送方调用 `EMMessage#createGifImageMessage` 方法构造 GIF 图片消息体。
2. 发送方调用 `EMChatManager#sendMessage` 发送 GIF 图片消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```java
// `imageUri` 为图片本地资源标志符
EMMessage message = EMMessage.createGifImageMessage(imageUri, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送视频消息

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。
2. 发送方调用 `EMMessage#createVideoSendMessage` 方法传入视频文件的本地资源标志符、缩略图的本地存储路径、视频时长以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID） 创建视频消息。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `thumbPath` 方法。
3. 发送方调用 `EMChatManager#sendMessage` 方法发送视频消息。SDK 会将视频文件上传至消息服务器。

```java
// 在应用层获取视频首帧，你需要自己实现 getThumbPath 方法。
String thumbPath = getThumbPath(videoUri);
EMMessage message = EMMessage.createVideoSendMessage(videoUri, thumbPath, videoLength, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

### 发送文件消息

1. 发送方调用 `EMMessage#createFileSendMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```java
// `fileLocalUri` 为本地资源标志符。
EMMessage message = EMMessage.createFileSendMessage(fileLocalUri, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。 
// message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

## 发送位置消息

1. 发送方调用 `EMMessage#createLocationSendMessage` 方法创建位置消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送位置消息。

发送位置时，需要集成第三方地图服务，获取到位置点的经纬度信息。 

```java
// `latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容。
EMMessage message = EMMessage.createLocationSendMessage(latitude, longitude, locationAddress, toChatUsername);
// 设置会话类型，即`EMMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。 
//  message.setChatType(ChatType.GroupChat);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(message);
```

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `EMMessage#createSendMessage` 方法创建透传消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送透传消息。

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
cmdMsg.addBody(cmdBody);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(cmdMsg);
```

## 发送自定义类型消息

你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `EMMessage#createSendMessage` 方法创建自定义消息。
2. 发送方调用 `EMChatManager#sendMessage` 方法发送自定义消息。

```java
EMMessage customMessage = EMMessage.createSendMessage(EMMessage.Type.CUSTOM);
// `event` 为需要传递的自定义消息事件，比如礼物消息，可以设置：
String event = "gift";
EMCustomMessageBody customBody = new EMCustomMessageBody(event);
// `params` 类型为 `Map<String, String>`。
customBody.setParams(params);
customMessage.addBody(customBody);
// `to` 指定接收方，单聊、群聊和聊天室分别为对端用户 ID、群组 ID 和聊天室 ID。
customMessage.setTo(to);
// 对于单聊、群群聊或聊天室，`chatType` 分别为 `Chat`、`GroupChat` 和 `ChatRoom`，默认是单聊。
customMessage.setChatType(chatType);
// 发送消息
EMClient.getInstance().chatManager().sendMessage(customMessage);
```

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 4.1.0 版本开始支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。

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
4. 对于转发合并消息，例如，用户 A 向用户 B 发送了合并消息，用户 B 将该合并消息转发给用户 C，需要调用转发单条合并消息的 API。详见 [转发单条消息](message_forward.html#转发单条消息)。
:::

示例代码如下：

```java
String title = "A和B的聊天记录";
String summary = "A:这是A的消息内容\nB:这是B的消息内容";
String compatibleText = "您当前的版本不支持该消息，请升级到最新版本";
// 添加原消息 ID。
ArrayList<String> msgIdList = new ArrayList<>();
msgIdList.add("1390191369179366180");
msgIdList.add("1390191426268037924");
msgIdList.add("1390186040483906340");
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

## 更多

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```java
   EMMessage message = EMMessage.createTextSendMessage(content, conversationId);
   message.setChatType(ChatType.ChatRoom);
   // 聊天室消息的优先级。如果不设置，默认值为 `PriorityNormal`，即“普通”优先级。
   message.setPriority(EMChatRoomMessagePriority.PriorityHigh);
   sendMessage(message);
```

### 获取发送附件消息的进度

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

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `EMOptions#setUseReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。



