# 发送消息

<Toc />

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类和 `ChatMessage` 类实现文本、图片、音频、视频和文件等类型的消息的发送。

- 对于单聊，环信即时通讯 IM 默认支持陌生人之间发送消息，即无需添加好友即可聊天。若仅允许好友之间发送单聊消息，你需要 [开启好友关系检查](/product/enable_and_configure_IM.html#好友关系检查)。
- 对于群组和聊天室，用户每次只能向所属的单个群组和聊天室发送消息。
- 关于消息发送控制，详见 [单聊](/product/message_single_chat.html#单聊消息发送控制)、[群组聊天](/product/message_group.html#群组消息发送控制) 和 [聊天室](/product/message_chatroom.html#聊天室消息发送控制) 的 相关文档。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 发送文本消息

1. 发送方调用 `ChatMessage#createTextMessage` 方法构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509。

示例代码：

```typescript
// 设置发送的消息类型。详见 `ChatMessageType` 枚举类型。
const messageType = ChatMessageType.TXT;
// 设置消息接收对象。单聊时为对端用户 ID、群聊时为群组 ID，聊天室时为聊天室 ID。
const targetId = "john";
// 设置会话类型。单聊为 `PeerChat`，群聊为 `GroupChat`，聊天室为 `ChatRoom`，默认为单聊。
// 具体详见 `ChatMessageChatType` 枚举类型。
const chatType = ChatMessageChatType.PeerChat;
let msg: ChatMessage;
// 构建文本消息。只需要消息文本内容。
const content = "This is text message";
msg = ChatMessage.createTextMessage(targetId, content, chatType);

// 设置消息发送回调，用来接收消息发送成功、失败、进度条信息。
const callback = {
  onError(localMsgId: string, error: ChatError): void {
    console.log("send message fail.");
  },
  onSuccess(message: ChatMessage): void {
    console.log("send message success.");
  },
  onProgress?(localMsgId: string, progress: number): void {
    console.log("send message progress.");
  },
} as ChatMessageStatusCallback;

ChatClient.getInstance()
  .chatManager.sendMessage(msg!, callback)
  .then(() => {
    // 消息发送动作完成，会在这里打印日志
    // 消息的发送结果通过回调返回
    console.log("send message operation success.");
  })
  .catch((reason) => {
    // 消息发送动作失败，会在这里打印日志
    console.log("send message operation fail.", reason);
  });
```

2. 发送方调用 `ChatManager#sendMessage` 方法将该消息发出。发送消息时可以设置 `EMCallBack` 的实例，获取消息发送状态。

```typescript
ChatClient.getInstance().chatManager.sendMessage(msg!, callback).then().catch();
```

## 发送附件消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

发送附件消息分为以下两步：

1. 创建和发送附件类型消息。
2. SDK 将附件上传到环信服务器。

### 发送语音消息

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `createVoiceMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息。
3. 发送方调用发送消息方法发送消息。SDK 会将语音文件上传至环信服务器。

```typescript
// 构建语音消息
// 需传入本地语音文件地址、显示名称和播放时长（单位为秒）
// 传入的语音文件的路径时，不需要添加 file://。
const filePath = "data/.../foo.wav";
const displayName = "bar.mp4";
const duration = 5;
const msg = ChatMessage.createVoiceMessage(targetId, filePath, chatType, {
  displayName,
  duration,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

### 发送图片消息

1. 发送方调用 `createImageMessage` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID （群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息。
2. 发送方调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```typescript
// 构建图片消息
// 需要图片的本地地址，长宽，和界面用来显示的名称
// 传入的图片路径时，不需要添加 file://。
const filePath = "/data/.../image.jpg";
const width = 100;
const height = 100;
const displayName = "test.jpg";
const msg = ChatMessage.createImageMessage(targetId, filePath, chatType, {
  displayName,
  width,
  height,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```


### 发送视频消息

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。
2. 发送方调用 `createVideoMessage` 方法传入视频文件的本地资源标志符、缩略图的本地存储路径、视频时长以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）。
3. 发送方调用 `sendMessage` 方法发送消息。SDK 会将视频文件上传至消息服务器。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `createVideoMessage` 方法。

```typescript
// 构建视频消息
// 视频消息相当于包含 2 个附件的消息，主要由视频和视频缩略图组成。视频参数包括视频本地地址、视频长宽值，显示名称，播放时间长度；
// 如果设置缩略图，需指定缩略图的本地地址。
// 传入的视频文件的路径和视频缩略图的路径时，不需要添加 file://。
const filePath = "data/.../foo.mp4";
const width = 100;
const height = 100;
const displayName = "bar.mp4";
const thumbnailLocalPath = "data/.../zoo.jpg";
const duration = 5;
const msg = ChatMessage.createVideoMessage(targetId, filePath, chatType, {
  displayName,
  thumbnailLocalPath,
  duration,
  width,
  height,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

### 发送文件消息

1. 发送方调用 `createFileMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息。
2. 发送方调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```typescript
// 构建文件消息
// 文件消息主要需要本地文件地址和文件在页面显示的名称。
// 传入的文件路径时，不需要添加 file://。
const filePath = "data/.../foo.zip";
const displayName = "study_data.zip";
const msg = ChatMessage.createFileMessage(targetId, filePath, chatType, {
  displayName,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送位置消息

1. 发送方调用 `ChatMessage#createLocationMessage` 方法创建位置消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送位置消息。

当你要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。

```typescript
// 构建位置消息
// 位置消息可以传递经纬度和地名信息
const latitude = "114.78";
const longitude = "39,89";
const address = "darwin";
const msg = ChatMessage.createLocationMessage(
  targetId,
  latitude,
  longitude,
  chatType,
  { address }
);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。

具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 `em_` 和 `easemob::` 开头的 action 为内部保留字段，注意不要使用。

:::tip
- 透传消息发送后，不支持撤回。
- 透传消息不会存入本地数据库中，所以在 UI 上不会显示。
:::

发送透传消息的过程如下：

1. 发送方调用 `ChatMessage#createCmdMessage` 方法创建透传消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送透传消息。

```typescript
// 构建透传消息
// 根据透传消息可以执行具体的命令，命令的内容格式支持自定义
const action = "writing";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

1. 发送方调用 `ChatMessage#createCustomMessage` 方法创建自定义消息。
2. 发送方调用 `ChatManager#sendMessage` 方法发送自定义消息。

```typescript
// 构建自定义消息
// 消息内容由消息事件和扩展字段两部分组成，扩展字段用户可以自行实现和使用。
const event = "gift";
const ext = { key: "value" };
const msg = ChatMessage.createCustomMessage(targetId, event, chatType, {
  params: JSON.parse(ext),
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 发送合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发，例如，发送聊天记录。

你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

你可以调用 `createCombineMessage` 方法创建一条合并消息，然后调用 `sendMessage` 方法发送该条消息。

创建合并消息时，需要设置以下参数：

| 属性   | 类型        | 描述    |
| :-------------- | :-------------------- | :-------------------- |
| `title`  | String    | 合并消息的标题。    |
| `summary` | String       | 合并消息的概要。   |
| `compatibleText` | String       | 合并消息的兼容文本。<br/>兼容文本起向下兼容不支持消息合并转发的版本的作用。当支持合并消息的 SDK 向不支持合并消息的低版本 SDK 发送消息时，低版本的 SDK 会将该属性解析为文本消息的消息内容。  |
| `chatType` | String | 会话类型：单聊、群聊或聊天室。  |
| `targetId` | String     | 消息接收方。该字段的设置取决于会话类型：<br/> - 单聊：对方用户 ID；<br/> - 群聊：群组 ID；<br/> - 子区会话：子区 ID；<br/> - 聊天室聊天：聊天室 ID。|
| `msgIdList` | List      | 合并消息的原始消息 ID 列表。该列表最多包含 300 个消息 ID。  |

:::tip

1. 合并转发支持嵌套，最多支持 10 层嵌套，每层最多 300 条消息。
2. 不论 `ChatOptions.serverTransfer` 设置为 `false` 或 `true`，SDK 都会将合并消息附件上传到环信服务器。
:::

示例代码如下：

```typescript
// 构造合并消息。
const msg = ChatMessage.createCombineMessage(targetId, msgIdList, chatType, {
  title,
  summary,
  compatibleText,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

## 更多

### 聊天室消息优先级与消息丢弃逻辑

- **消息优先级**：对于聊天室消息，环信即时通讯提供消息分级功能，支持高、普通和低三种优先级，高优先级的消息会优先送达。你可以在创建消息时对指定消息类型或指定成员的消息设置为高优先级，确保这些消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

- **消息丢弃逻辑**：对于单个聊天室，每秒发送的消息数量默认超过 20 条，则会触发消息丢弃逻辑，即首先丢弃低优先级的消息，优先保留高优先级的消息。若带有优先级的消息超过了 20 条/秒，则按照消息发送时间顺序处理，丢弃后发送的消息。

```typescript
// 对于聊天室消息，还可以设置消息优先级。
if (msg.chatType === ChatMessageChatType.ChatRoom) {
  msg.messagePriority = priority;
}
```

### 获取发送附件消息的进度

发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

```typescript
ChatClient.getInstance()
  .chatManager.sendMessage(msg, {
    onProgress(localMsgId: string, progress: number): void {
      console.log("send message progress.");
    },
  } as ChatMessageStatusCallback)
  .then()
  .catch();
```

### 发送消息前的内容审核

- 内容审核关注消息 body

[内容审核服务会关注消息 body 中指定字段的内容，不同类型的消息审核不同的字段](/product/moderation/moderation_mechanism.html)，若创建消息时在这些字段中传入了很多业务信息，可能会影响审核效果。因此，创建消息时需要注意内容审核的字段不涉及业务信息，建议业务信息放在扩展字段中。

- 设置发送方收到内容审核替换后的内容

若初始化时打开了 `ChatOptions#useReplacedMessageContents` 开关，发送文本消息时如果被内容审核（Moderation）进行了内容替换，发送方会收到替换后的内容。若该开关为关闭状态，则发送方不会收到替换后的内容。