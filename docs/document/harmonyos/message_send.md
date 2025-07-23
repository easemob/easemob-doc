# 发送消息

环信即时通讯 IM HarmonyOS SDK 通过 [`ChatManager`](https://sdkdocs.easemob.com/apidoc/harmony/chat3.0/classes/ChatManager.ChatManager.html) 类和 [`ChatMessage`](https://sdkdocs.easemob.com/apidoc/harmony/chat3.0/classes/message_ChatMessage.ChatMessage.html) 类实现文本、图片、音频、视频和文件等类型的消息的发送。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

1. 发送方调用 `ChatMessage#createTextSendMessage` 类构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509 `MESSAGE_CURRENT_LIMITING`。

```typescript
// 创建一条文本消息，`content` 为消息文字内容。
// `conversationId` 为消息接收方，单聊时为对端用户 ID、群聊时为群组 ID，聊天室时为聊天室 ID。
let message = ChatMessage.createTextSendMessage(conversationId, content);
if (!message) {
    return;
}
// 会话类型：单聊为 ChatType.Chat，群聊为 ChatType.GroupChat, ChatType.ChatRoom，默认为单聊。
message.setChatType(ChatType.Chat);
// 发送消息。
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

2. 通过 `ChatManager#sendMessage` 将该消息发出。发送消息时可以设置 `ChatCallback` 的实例，获取消息发送状态。

```typescript
// 发送消息时可以设置 `ChatCallback` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如消息发送失败后的提示等等。
let callback: ChatCallback = {
  onSuccess: (): void => {
    // 发送消息成功
  },
  onError: (code: number, error: string): void => {
    // 发送消息失败
  },
  onProgress: (progress: number): void => {
    // 附件消息附件的上传进度
  }
}
message.setMessageStatusCallback(callback);
 // 发送消息。
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用 `downloadAttachment` 方法。
   
自 1.7.0 版本开始，即时通讯 IM 支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户必须调用 SDK 的 `downloadAttachment` 方法下载消息附件。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `createVoiceSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）、语音文件的路径和语音时长创建语音消息，然后调用 `sendMessage` 方法发送消息。SDK 会将语音文件上传至环信服务器。

```typescript
// `filePathOrUri` 为语音文件的本地路径或者文件的 URI，`duration` 为语音时长（单位为秒）。
let message = ChatMessage.createVoiceSendMessage(to, filePathOrUri, duration);
if (!message) {
    return;
}
// 设置会话类型，即`ChatMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 发送图片消息

1. 发送方调用 `createImageSendMessage` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息。
2. 发送方调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

**目前，HarmonyOS SDK 尚不支持压缩原图后发给接收方。**
   
```typescript
// `imageFilePathOrUri` 为图片本地路径或者Uri。
let message = ChatMessage.createImageSendMessage(toChatUsername, imageFilePathOrUri);
// 会话类型，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 发送 GIF 图片消息

- 自 HarmonyOS SDK 1.7.0 开始，支持发送 GIF 图片消息。
- GIF 图片缩略图的生成和下载与普通图片消息相同，详见 [发送](#发送图片消息) 和 [接收图片消息](message_receive.html#接收图片消息)。

**目前，HarmonyOS SDK 尚不支持压缩原图后发给接收方。**

发送 GIF 图片消息的过程如下：

- 发送方调用 `ChatMessage#createImageSendMessage` 方法构造 GIF 图片消息体。
- 发送方调用 `ChatManager#sendMessage` 方法发送消息。

```typescript
// `imageUri` 为图片本地资源标志符
let isGif = true; // 是否为 GIF 图片，默认为 false。
let message = ChatMessage.createImageSendMessage(this.to, this.imageUri, isGif);
// 设置会话类型，即`ChatMessage` 类的 `ChatType` 属性，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
// message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 发送视频消息

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。
2. 发送方调用 `ChatMessage#createVideoSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）、视频文件的本地路径、视频时长以及缩略图的本地存储路径。
3. 发送方调用 `ChatManager#sendMessage` 方法发送消息。SDK 会将视频文件上传至消息服务器。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `createVideoSendMessage` 方法。

```typescript
// 在应用层获取视频首帧
let thumbPath = this.getThumbPath(videoPath);
let message = ChatMessage.createVideoSendMessage(toChatUsername, videoPath, videoLength, thumbPath);
if (!message) {
    return;
}
// 会话类型，包含 `Chat`、`GroupChat` 和 `ChatRoom`，表示单聊、群聊或聊天室，默认为单聊。
message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 发送文件消息

1. 发送方调用 `ChatMessage#createFileSendMessage` 方法传入接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）和文件的本地路径创建文件消息。
2. 发送方调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```typescript
// `fileLocalPathOrUri` 为本地文件路径或者本地文件Uri。
let message = ChatMessage.createFileSendMessage(toChatUsername, fileLocalPathOrUri);
if (!message) {
    return;
}
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

## 发送位置消息

1. 发送方调用 `ChatMessage#createLocationSendMessage` 方法创建位置消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送位置消息
  
发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。

```typescript
// `latitude` 为纬度，`longitude` 为经度，`locationAddress` 为具体位置内容。
let message = ChatMessage.createLocationSendMessage(toChatUsername, latitude, longitude, locationAddress);
if (!message) {
    return;
}
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
message.setChatType(ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `ChatMessage#createSendMessage` 方法创建透传消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送透传消息。

```typescript
let action = "action1";
// `action` 可以自定义。
let cmdBody = new CmdMessageBody(action);
let toUsername = "test1";
// 支持单聊、群聊和聊天室，默认为单聊。
let cmdMsg = ChatMessage.createSendMessage(toUsername, cmdBody, ChatType.GroupChat);
if (!cmdMsg) {
    return;
}
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(cmdMsg);
```

## 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `ChatMessage#createSendMessage` 方法创建自定义消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送自定义消息。

```typescript
// `event` 为需要传递的自定义消息事件，比如礼物消息，可以设置：
let event = "gift";
let customBody = new CustomMessageBody(event);
// `params` 类型为 `Map<string, string>`。
customBody.setParams(params);
// 创建一条发送消息，`to` 指另一方环信用户 ID（或者群组 ID，聊天室 ID）；
// 如果是群聊，设置 `ChatType` 为 `GroupChat`，该参数默认是单聊（`Chat`）。
let customMessage = ChatMessage.createSendMessage(to, customBody, ChatType.GroupChat);
// 发送消息
ChatClient.getInstance().chatManager()?.sendMessage(customMessage);
```

## 发送合并消息

为了方便消息互动，SDK 支持将多个消息合并在一起进行转发。你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
   
:::tip
对于转发合并消息，例如，用户 A 向 用户 B 发送了合并消息，用户 B 将该合并消息转发给用户 C，需要调用转发单条合并消息的 API。详见 [转发单条消息](message_forward.html#转发单条消息)。
:::

你可以调用 `createCombinedSendMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `messageIds` | Array      | 合并消息的原始消息 ID 数组。该数组最多包含 300 个消息 ID。  |
| `to` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 聊天室聊天：聊天室 ID。|

:::tip
1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `ChatOptions#setAutoTransferMessageAttachments` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
3. 合并消息不支持搜索。
:::

示例代码如下：

```typescript
let title = "A和B的聊天记录";
let summary = "A:这是A的消息内容\nB:这是B的消息内容";
let compatibleText = "您当前的版本不支持该消息，请升级到最新版本";
let message = ChatMessage.createCombinedSendMessage(title, {summary: summary, compatibleText: compatibleText, messageIds: ["msgId1", "msgId2"]});
let messageCallback: ChatCallback = {
  onSuccess: () => {
    // 消息发送成功的处理逻辑
  },
  onError: (code: number, error: string) => {
    // 消息发送失败的处理逻辑
  }
}
message.setMessageStatusCallback(messageCallback);
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

## 更多

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```typescript
let message = ChatMessage.createTextSendMessage(conversationId, content);
if (!message) {
    return;
}
message.setChatType(ChatType.ChatRoom);
// 聊天室消息的优先级。如果不设置，默认值为 `PriorityNormal`，即“普通”优先级。
message.setPriority(ChatroomMessagePriority.PriorityHigh);
sendMessage(message);
```

### 获取发送附件消息的进度

发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```typescript
// 发送消息时可以设置 `ChatCallback` 的实例，获得消息发送的状态。可以在该回调中更新消息的显示状态。例如，消息发送失败后的提示等等。
 let callback: ChatCallback = {
  onSuccess: (): void => {
    // 发送消息成功
  },
  onError: (code: number, error: string): void => {
    // 发送消息失败
  },
  onProgress: (progress: number): void => {
    // 消息发送的状态，这里只用于附件类型的消息。
  }
}
message.setMessageStatusCallback(callback);
 // 发送消息。
ChatClient.getInstance().chatManager()?.sendMessage(message);
```

### 发送消息前的内容审核

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

