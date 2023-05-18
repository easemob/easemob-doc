# 发送和接收消息

<Toc />

登录即时通讯服务后，用户可以在一对一单聊、群聊、聊天室中发送如下类型的消息：

- 文字消息，包含超链接和表情消息。
- 附件消息，包含图片、语音、视频及文件消息。
- 位置消息。
- 透传消息。
- 自定义消息。

本文介绍如何使用即时通讯 IM SDK 实现发送和接收这些类型的消息。

针对聊天室消息并发量较大的场景，即时通讯服务提供消息分级功能。你可以通过设置消息优先级，将消息划分为高、普通和低三种级别。你可以在创建消息时，将指定消息类型，或指定成员的所有消息设置为高优先级，确保此类消息优先送达。这种方式可以确保在聊天室内消息并发量较大或消息发送频率过高的情况下，服务器首先丢弃低优先级消息，将资源留给高优先级消息，确保重要消息（如打赏、公告等）优先送达，以此提升重要消息的可靠性。请注意，该功能并不保证高优先级消息必达。在聊天室内消息并发量过大的情况下，为保证用户实时互动的流畅性，即使是高优先级消息仍然会被丢弃。

## 技术原理

环信即时通讯 IM React Native SDK 通过 `ChatManager` 和 `ChatMessage` 类实现消息的发送、接收与撤回。

其中，发送和接收消息的逻辑如下：

1. 发送方调用相应 `Create` 方法创建文本、文件、附件等类型的消息；
2. 发送方再调用 `SendMessage` 发送消息；
3. 接收方通过 `ChatMessageEventListener` 方法监听消息回调事件。在收到 `onMessagesReceived` 后，即表示成功接收到消息。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [快速开始](quickstart.html) 及 [SDK 集成概述](overview.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 实现方法

### 发送消息

1. 首先，利用 `ChatMessage` 类构造一个消息。

默认情况下，SDK 对单个用户发送消息的频率未做限制。如果你联系了环信商务设置了该限制，一旦在单聊、群聊或聊天室中单个用户的消息发送频率超过设定的上限，SDK 会上报错误，即错误码 509。

示例代码：

```typescript
// 设置发送的消息类型。消息类型共支持 8 种。具体详见 `ChatMessageType` 枚举类型。
// 通过指定该值，可以发送不同类型的消息。
const messageType = ChatMessageType.TXT;

// 设置消息接收对象 ID。
const targetId = "tom";

// 设置消息接收对象类型。 消息接收对象类型包括 单人、群组和聊天室。具体详见 `ChatMessageChatType` 枚举类型
const chatType = ChatMessageChatType.PeerChat;

// 构造消息。构造不同类型的消息，需要不同的参数。
let msg: ChatMessage;
if (messageType === ChatMessageType.TXT) {
  // 构建文本消息。只需要消息文本内容。
  const content = "This is text message";
  msg = ChatMessage.createTextMessage(targetId, content, chatType);
} else if (messageType === ChatMessageType.IMAGE) {
  // 构建图片消息
  // 需要图片的本地地址，长宽，和界面用来显示的名称
  const filePath = "/data/.../image.jpg";
  const width = 100;
  const height = 100;
  const displayName = "test.jpg";
  msg = ChatMessage.createImageMessage(targetId, filePath, chatType, {
    displayName,
    width,
    height,
  });
} else if (messageType === ChatMessageType.CMD) {
  // 构建透传消息
  // 根据透传消息可以执行具体的命令，命令的内容格式支持自定义
  const action = "writing";
  msg = ChatMessage.createCmdMessage(targetId, action, chatType);
} else if (messageType === ChatMessageType.CUSTOM) {
  // 构建自定义消息
  // 消息内容由消息事件和扩展字段两部分组成，扩展字段用户可以自行实现和使用。
  const event = "gift";
  const ext = { key: "value" };
  msg = ChatMessage.createCustomMessage(targetId, event, chatType, {
    params: JSON.parse(ext),
  });
} else if (messageType === ChatMessageType.FILE) {
  // 构建文件消息
  // 文件消息主要需要本地文件地址和文件在页面显示的名称。
  const filePath = "data/.../foo.zip";
  const displayName = "study_data.zip";
  msg = ChatMessage.createFileMessage(targetId, filePath, chatType, {
    displayName,
  });
} else if (messageType === ChatMessageType.LOCATION) {
  // 构建位置消息
  // 位置消息可以传递经纬度和地名信息
  // 当你需要发送位置时，需要集成第三方的地图服务，获取到位置点的经纬度信息。接收方接收到位置消息时，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。
  const latitude = "114.78";
  const longitude = "39,89";
  const address = "darwin";
  msg = ChatMessage.createLocationMessage(
    targetId,
    latitude,
    longitude,
    chatType,
    { address }
  );
} else if (messageType === ChatMessageType.VIDEO) {
  // 构建视频消息
  // 视频消息相当于包含 2 个附件的消息，主要由视频和视频缩略图组成。视频参数包括视频本地地址、视频长宽值，显示名称，播放时间长度；视频的缩略图需要缩略图的本地地址。
  const filePath = "data/.../foo.mp4";
  const width = 100;
  const height = 100;
  const displayName = "bar.mp4";
  const thumbnailLocalPath = "data/.../zoo.jpg";
  const duration = 5;
  msg = ChatMessage.createVideoMessage(targetId, filePath, chatType, {
    displayName,
    thumbnailLocalPath,
    duration,
    width,
    height,
  });
} else if (messageType === ChatMessageType.VOICE) {
  // 构建语音消息
  // 该消息需求本地语音文件地址、显示名称和播放时长
  const filePath = "data/.../foo.wav";
  const displayName = "bar.mp4";
  const duration = 5;
  msg = ChatMessage.createVoiceMessage(targetId, filePath, chatType, {
    displayName,
    duration,
  });
} else {
  // 其他不支持的消息类型会在此处抛出异常
  throw new Error("Not implemented.");
}

对于聊天室消息，还可以设置消息优先级。
if (ret.chatType === ChatMessageChatType.ChatRoom) {
  ret.messagePriority = priority;
}

ChatClient.getInstance()
.chatManager.sendMessage(msg!, new ChatMessageCallback())
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

2. 通过 `ChatManager` 将该消息发出。

```typescript
ChatClient.getInstance().chatManager.sendMessage(
  msg!,
  new ChatMessageCallback()
);
```

你可以设置发送消息结果回调，用于接收消息发送进度或者发送结果，如发送成功或失败。需要实现 `ChatMessageStatusCallback` 接口。

对于透传消息可能并不需要结果，可以不用赋值。

```typescript
// 实现回调对象
class ChatMessageCallback implements ChatMessageStatusCallback {
  onProgress(localMsgId: string, progress: number): void {
    console.log(`sendMessage: onProgress: `, localMsgId, progress);
    // 对于附件类型的消息，如图片，语音，文件，视频类型，上传或下载文件时会收到相应的进度值，表示附件的上传或者下载进度
  }
  onError(localMsgId: string, error: ChatError): void {
    console.log(`sendMessage: onError: `, localMsgId, error);
    // 收到回调之后，可以将发送的消息状态进行更新，或者进行其他操作
  }
  onSuccess(message: ChatMessage): void {
    console.log(`sendMessage: onSuccess: `, message);
    // 收到成功回调之后，可以对发送的消息进行更新处理，或者其他操作
  }
}
```

#### 通过透传消息实现输入指示器

输入指示器显示其他用户何时输入消息。通过该功能，用户之间可进行有效沟通，设定对聊天应用程序中新交互的期望。你可以通过透传消息实现输入指示器。

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

发送输入状态的用户。

```typescript
// 创建输入状态消息并发送
const targetId = "<target id>";
const action = "TypingBegin";
const targetType = ChatMessageChatType.PeerChat;
const message = ChatMessage.createCmdMessage(targetId, action, targetType);
ChatClient.getInstance()
  .chatManager.sendMessage(
    message,
    new (class implements ChatMessageStatusCallback {
      onError(localMsgId: string, error: ChatError): void {
        console.log("send fail:", error);
      }
      onSuccess(message: ChatMessage): void {
        console.log("send success:", message.msgId);
      }
    })()
  )
  .then(() => {
    console.log("send operate success:");
  })
  .catch((result) => {
    console.log("send operate fail:", result);
  });
```

接收输入状态的用户。

```typescript
// 设置状态监听器
let timer;

ChatClient.getInstance().chatManager.removeAllMessageListener();
ChatClient.getInstance().chatManager.addMessageListener(
  new (class implements ChatMessageEventListener {
    onCmdMessagesReceived(messages: ChatMessage[]): void {
      if (messages.length > 0) {
        if (messages[0].body.action === "TypingBegin") {
          clearTimeout(timer);
          timer = setTimeout(() => {
            console.log("对方正在输入...");
          }, 0);
        }
      }
    }
  })()
);
```


### 接收消息

你可以用注册监听 `ChatMessageEventListener` 接收消息。

该 `ChatMessageEventListener` 可以多次添加，请记得在不需要的时候移除该监听。如在 `componentWillUnmount` 的卸载组件的时候。

在新消息到来时，你会收到 `OnMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。

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

文件消息不会自动下载。图片消息和视频消息默认会生成缩略图，接收到图片消息和视频消息，默认会自动下载缩略图。语音消息接收到后会自动下载。

若手动下载，需进行如下设置：

在初始化 SDK 时将 `isAutoDownload` 设置为 `false`。

```typescript
ChatClient.getInstance()
  .init(
    new ChatOptions({
      appKey: <your app key>,
      isAutoDownload: false,
    })
  )
  .then(() => {
    console.log("init success: ");
  })
  .catch((reason) => {
    console.log("init fail: ", reason);
  });
```

下载缩略图。

```typescript
// 收到的图片或者视频消息
const msg;
// 下载缩略图的回调
const callback = new ChatMessageCallback();
// 进行缩略图下载
ChatClient.getInstance()
  .chatManager.downloadThumbnail(msg, msgCallback)
  .then((result) => {
    console.log("success: ", result);
    // 可以获取文件下载到本地的地址
    const body = msg.body as ChatImageMessageBody;
    console.log("thumb picture address: ", body.localPath);
  })
  .catch((error) => {
    console.log("fail: ", error);
  });
```

下载附件。

```typescript
// 收到的图片、视频、音频、文件等消息
const msg;
// 下载附件的回调
const callback = new ChatMessageCallback();
// 进行附件下载
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, msgCallback)
  .then((result) => {
    console.log("success: ", result);
    // 可以获取文件下载到本地的地址
    const body = msg.body as ChatImageMessageBody;
    console.log("download success: ", body.localPath);
  })
  .catch((error) => {
    console.log("download fail: ", error);
  });
```

下载完成后，调用相应消息 body 的 `localPath` 获取附件路径。

### 撤回消息

发送方可以撤回一条发送成功的消息。默认情况下，发送方可撤回发出 2 分钟内的消息。你可以在[环信即时通讯云控制台](https://console.easemob.com/user/login)的**功能配置** > **功能配置总览** > **基础功能** 页面设置消息撤回时长，该时长不超过 7 天。

```typescript
ChatClient.getInstance()
  .chatManager.recallMessage(this.state.lastMessage.msgId)
  .then(() => {
    console.log("recall message success");
  })
  .catch((reason) => {
    console.log("recall message fail.", reason);
  });
```

设置消息撤回监听：

```typescript
// 接收到消息被撤回时触发此回调（此回调位于 `ChatMessageEventListener` 中）
class ChatMessageEvent implements ChatMessageEventListener {
  onMessagesRecalled(messages: ChatMessage[]): void {
    console.log(`onMessagesReceived: `, messages);
  }
  // 其他回调接收省略，实际开发中需要实现
}
```

### 监听器介绍

除了上述介绍的部分，还有如下：

```typescript
let msgListener = new (class implements ChatMessageEventListener {
  onMessagesReceived(messages: ChatMessage[]): void {
    // 这里接收除了透传消息之外的消息数组
  }
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 这里接收透传消息数据
  }
  onMessagesRead(messages: ChatMessage[]): void {
    // 这里接收个人类型消息已读回执通知，messages 为已经已读回执的消息数组
  }
  onGroupMessageRead(groupMessageAcks: ChatGroupMessageAck[]): void {
    // 这里接收群组类型的消息已读回执通知，messages 为已经已读回执的消息数组
  }
  onMessagesDelivered(messages: ChatMessage[]): void {
    // 消息送达回执通知，messages 为回执的消息数组
  }
  onMessagesRecalled(messages: ChatMessage[]): void {
    // 消息撤回通知，messages 为撤销的消息
  }
  onConversationsUpdate(): void {
    // 会话更新通知，通知会话列表发生了变化
  }
  onConversationRead(from: string, to?: string): void {
    // 会话已读通知，当前的会话消息已读
  }
  // reaction 和 thread 在对应章节进行详细介绍
})();
```