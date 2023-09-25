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

本文介绍如何使用即时通讯 IM React Native SDK 实现发送和接收这些类型的消息。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 类和 `ChatMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应创建方法创建文本、文件、附件等类型的消息；
2. 发送方再调用发送方法发送消息；
3. 发送方可通过撤销方法撤回自己发出的消息；
4. 通过监听器接收消息。

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

1. 首先，利用 `ChatMessage` 类构造一条消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509。

示例代码：

```typescript
// 设置发送的消息类型。消息类型共支持 8 种。具体详见 `ChatMessageType` 枚举类型。
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

对于聊天室消息，可设置消息优先级。示例代码如下：

```typescript
// 对于聊天室消息，还可以设置消息优先级。
if (msg.chatType === ChatMessageChatType.ChatRoom) {
  msg.messagePriority = priority;
}
```

2. 通过 `ChatManager` 将该消息发出。发送消息时可以设置 `EMCallBack` 的实例，获取消息发送状态。

```typescript
ChatClient.getInstance().chatManager.sendMessage(msg!, callback).then().catch();
```

### 接收消息

你可以用注册监听 `ChatMessageEventListener` 接收消息。

该监听可添加多次，可在不需要的时移除。

在新消息到来时，你会收到 `onMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

```typescript
// 继承并实现 ChatMessageEventListener
class ChatMessageEvent implements ChatMessageEventListener {
  onMessagesReceived(messages: ChatMessage[]): void {
    console.log(`onMessagesReceived: `, messages);
  }
  // 其他回调接收省略，实际开发中需要实现
}

// 注册监听器
const listener = new ChatMessageEvent();
ChatClient.getInstance().chatManager.addMessageListener(listener);

// 移除监听器
ChatClient.getInstance().chatManager.removeMessageListener(listener);

// 移除所有监听器
ChatClient.getInstance().chatManager.removeAllMessageListener();
```

### 撤回消息

发送方可以撤回一条发送成功的消息。默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。

```typescript
ChatClient.getInstance()
  .chatManager.recallMessage(msgId)
  .then(() => {
    console.log("recall message success");
  })
  .catch((reason) => {
    console.log("recall message fail.", reason);
  });
```

### 设置消息撤回监听

```typescript
let listener = new (class implements ChatMessageEventListener {
  onMessagesRecalled(messages: ChatMessage[]): void {
    // 消息撤回通知，messages 为撤销的消息
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
```

### 发送和接收附件类型的消息

除文本消息外，SDK 还支持发送附件类型消息，包括语音、图片、视频和文件消息。

附件消息的发送和接收过程如下：

1. 创建和发送附件类型消息。SDK 将附件上传到环信服务器。
2. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用下载附件方法。
3. 获取附件的服务器地址和本地路径。

此外，发送附件类型消息时，可以在 `onProgress` 回调中获取附件上传的进度，以百分比表示，示例代码如下：

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

#### 发送和接收语音消息

发送和接收语音消息的过程如下：

1. 发送语音消息前，在应用层录制语音文件。
2. 发送方调用 `createVoiceMessage` 方法传入语音文件的 URI、语音时长和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建语音消息，然后调用发送消息方法发送消息。SDK 会将语音文件上传至环信服务器。

```typescript
// 构建语音消息
// 需传入本地语音文件地址、显示名称和播放时长（单位为秒）
const filePath = "data/.../foo.wav";
const displayName = "bar.mp4";
const duration = 5;
const msg = ChatMessage.createVoiceMessage(targetId, filePath, chatType, {
  displayName,
  duration,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

3. 接收方收到语音消息时，自动下载语音文件。

4. 接收方收到 `onMessagesReceived` 回调，消息对象属性包括语音文件的服务器地址 `msg.body.remotePath`或本地路径 `msg.body.localPath`，从而获取语音文件。

#### 发送和接收图片消息

发送和接收图片消息的流程如下：

1. 发送方调用 `createImageMessage` 方法传入图片的本地资源标志符 URI、设置是否发送原图以及接收方的用户 ID （群聊或聊天室分别为群组 ID 或聊天室 ID）创建图片消息，然后调用 `sendMessage` 方法发送该消息。SDK 会将图片上传至环信服务器，服务器自动生成图片缩略图。

```typescript
// 构建图片消息
// 需要图片的本地地址，长宽，和界面用来显示的名称
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

2. 接收方收到图片消息，自动下载图片缩略图。

```typescript
ChatClient.getInstance().init(
  new ChatOptions({
    appKey,
    isAutoDownload: true,
  })
);
```

如果设置为手动下载，则需要设置 `isAutoDownload` 为 `false`，并且调用方法 `downloadThumbnail`。

```typescript
ChatClient.getInstance()
  .chatManager.downloadThumbnail(msg, callback)
  .then()
  .catch();
```

3. 对于接收方，收到 `onMessagesReceived` 回调，调用 `downloadAttachment` 下载原图。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

4. 获取图片消息的附件信息可以通过图片消息的消息体对象 `body` 获取。

#### 发送和接收视频消息

发送和接收视频消息的流程如下：

1. 发送视频消息前，在应用层完成视频文件的选取或者录制。

2. 发送方调用 `createVideoMessage` 方法传入视频文件的本地资源标志符、缩略图的本地存储路径、视频时长以及接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID），然后调用 `sendMessage` 方法发送消息。SDK 会将视频文件上传至消息服务器。若需要视频缩略图，你需自行获取视频首帧的路径，将该路径传入 `createVideoMessage` 方法。

```typescript
// 构建视频消息
// 视频消息相当于包含 2 个附件的消息，主要由视频和视频缩略图组成。视频参数包括视频本地地址、视频长宽值，显示名称，播放时间长度；
// 如果设置缩略图，需指定缩略图的本地地址。
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

3. 接收方收到视频消息时，自动下载视频缩略图，和[图片消息缩略图](#发送和接收图片消息)类似。

4. 对于接收方，收到 `onMessagesReceived` 回调，可以调用 `downloadAttachment` 方法下载视频原文件，和[图片消息附件下载](#发送和接收图片消息)类似。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

5. 视频消息的信息可以通过消息体 `body` 对象获取。

#### 发送和接收文件消息

发送和接收文件消息的流程如下：

1. 发送方调用 `createFileMessage` 方法传入文件的本地资源标志符和接收方的用户 ID（群聊或聊天室分别为群组 ID 或聊天室 ID）创建文件消息，然后调用 `sendMessage` 方法发送文件消息。SDK 将文件上传至环信服务器。

```typescript
// 构建文件消息
// 文件消息主要需要本地文件地址和文件在页面显示的名称。
const filePath = "data/.../foo.zip";
const displayName = "study_data.zip";
const msg = ChatMessage.createFileMessage(targetId, filePath, chatType, {
  displayName,
});
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

2. 接收方收到 `onMessagesReceived` 回调，调用 `downloadAttachment` 方法下载文件。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

3. 通过文件消息对象的消息体对象 `body`获取文件信息。

### 发送和接收位置消息

当你要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```typescript
// 构建位置消息
// 位置消息可以传递经纬度和地名信息
// 当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。
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

### 发送和接收透传消息

透传消息可视为命令消息，通过发送这条命令给对方，通知对方要进行的操作，收到消息可以自定义处理。（透传消息不会存入本地数据库中，所以在 UI 上不会显示）。具体功能可以根据自身业务需求自定义，例如实现头像、昵称的更新等。另外，以 “em_” 和 “easemob::” 开头的 action 为内部保留字段，注意不要使用。

```typescript
// 构建透传消息
// 根据透传消息可以执行具体的命令，命令的内容格式支持自定义
const action = "writing";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 这里接收透传消息数据
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
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

```typescript
// 发送自己在输入状态中的命令消息
const action = "inputting";
const msg = ChatMessage.createCmdMessage(targetId, action, chatType);
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```

以下示例代码展示如何接受和解析输入状态的透传消息。

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 收到命令消息
    for (msg of messages) {
      // 过略消息
      if (msg.body.action === "inputting") {
        // todo: 界面显示正在输入中的状态
      }
    }
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
```

### 发送自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。自定义消息内容为 String 类型的 key-value 格式，你需要自己添加并解析该内容。

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

### 发送和接收合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发，例如，发送聊天记录。

你可以采取以下步骤进行消息的合并转发：

1. 利用原始消息列表创建一条合并消息。
2. 发送合并消息。
3. 对端收到合并消息后进行解析，获取原始消息列表。

#### 创建和发送合并消息

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

:::notice

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

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。

#### 解析合并消息

合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `fetchCombineMessageDetail` 方法获取原始消息列表。

对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
- 若附件已存在，该方法会直接解析附件并返回原始消息列表。
- 若附件不存在，该方法首先下载附件，然后解析附件并返回原始消息列表。

```typescript
// message: 合并消息对象
// 通过异步返回原始消息列表。
ChatClient.getInstance()
  .chatManager.fetchCombineMessageDetail(message)
  .then((messages: ChatMessage[]) => {
    console.log("success: ", messages);
  })
  .catch((error) => {
    console.log("fail: ", error);
  });
```

### 发送和接收定向消息

发送定向消息是指向群组或聊天室的单个或多个指定的成员发送消息，其他成员不会收到该消息。

该功能适用于文本消息、图片消息和音视频消息等全类型消息，最多可向群组或聊天室的 20 个成员发送定向消息。

:::notice
1. 仅 SDK 1.2.0 及以上版本支持该功能。
2. 定向消息不计入群组会话或聊天室会话的未读计数。
:::

发送定向消息的流程与发送普通消息相似，唯一区别是需要设置消息的接收方，具体操作如下：

1. 创建一条群组或聊天室消息。
2. 设置消息的接收方。
3. 发送定向消息。

下面以文本消息为例介绍如何发送定向消息，示例代码如下：

```typescript
const content = "This is text message";
msg = ChatMessage.createTextMessage(targetId, content, chatType);
msg.receiverList = ["001", "002"];
ChatClient.getInstance().chatManager.sendMessage(msg, {
  onSuccess: () => {},
  onError: () => {},
} as ChatMessageStatusCallback);
```

接收群定向消息与接收普通消息的操作相同，详见[接收消息](#接收消息)。

### 使用消息的扩展字段

当 SDK 提供的消息类型不满足需求时，你可以通过消息扩展字段传递自定义的内容，从而生成自己需要的消息类型。

当目前消息类型不满足用户需求时，可以在扩展部分保存更多信息，例如消息中需要携带被回复的消息内容或者是图文消息等场景。

```typescript
const msg = ChatMessage.createTextMessage(targetId, '文本消息', chatType);
msg.attributes = {
  key: "value",
  {
    key2: 100
  }
};
EMClient.getInstance().chatManager().sendMessage(msg, callback).then().catch();
```
