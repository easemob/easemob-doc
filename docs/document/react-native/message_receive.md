# 接收消息

<Toc />

环信即时通讯 IM React Native SDK 通过 `ChatMessageEventListener` 类实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以用注册监听 `ChatMessageEventListener` 接收消息。该监听可添加多次，可在不需要的时移除。
- 在新消息到来时，你会收到 `onMessagesReceived` 的回调，消息接收时可能是一条，也可能是多条。你可以在该回调里遍历消息队列，解析并显示收到的消息。若在初始化时打开了 `ChatOptions#messagesReceiveCallbackIncludeSend` 开关，则该回调中会返回发送成功的消息。
- 对于聊天室消息，你可以通过消息的 `ChatMessage.isBroadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_broadcast.html#发送聊天室全局广播消息)。

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

## 接收附件消息

除文本消息外，SDK 还支持接收附件类型消息，包括语音、图片、视频和文件消息。

附件消息的接收过程如下：

1. 接收附件消息。SDK 自动下载语音消息，默认自动下载图片和视频的缩略图。若下载原图、视频和文件，需调用下载附件方法。
2. 获取附件的服务器地址和本地路径。

### 接收语音消息

1. 接收方收到语音消息时，自动下载语音文件。
2. 接收方收到 `onMessagesReceived` 回调，消息对象属性包括语音文件的服务器地址 `msg.body.remotePath` 或本地路径 `msg.body.localPath`，从而获取语音文件。

### 接收图片消息

1. 接收方收到图片消息，自动下载图片缩略图。

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

2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，调用 `downloadAttachment` 下载原图。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

4. 获取图片消息的附件信息可以通过图片消息的消息体对象 `body` 获取。

### 接收视频消息

1. 接收方收到视频消息时，自动下载视频缩略图。你可以设置自动或手动下载视频缩略图，该设置与图片缩略图相同，详见[设置图片缩略图自动下载](#接收图片消息)。

2. 接收方收到 [onMessageReceived 回调](#接收文本消息)，可以调用 `downloadAttachment` 方法下载视频原文件。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

3. 视频消息的信息可以通过消息体 `body` 对象获取。

### 接收文件消息

1. 接收方收到 [onMessagesReceived](#接收文本消息) 回调，调用 `downloadAttachment` 方法下载文件。

```typescript
ChatClient.getInstance()
  .chatManager.downloadAttachment(msg, callback)
  .then()
  .catch();
```

2. 通过文件消息对象的消息体对象 `body` 获取文件信息。

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

请注意透传消息的接收方，也是由单独的回调进行通知，方便用户进行不同的处理。

```typescript
let listener = new (class implements ChatMessageEventListener {
  onCmdMessagesReceived(messages: ChatMessage[]): void {
    // 这里接收透传消息数据
  }
})();
ChatClient.getInstance().chatManager.addMessageListener(listener);
```

## 接收自定义类型消息

除了几种消息之外，你可以自己定义消息类型，方便业务处理，即首先设置一个消息类型名称，然后可添加多种自定义消息。

接收自定义消息与其他类型消息一致，详见[接收文本消息](#接收文本消息)。

## 接收合并消息

为了方便消息互动，即时通讯 IM 自 1.2.0 版本开始支持将多个消息合并在一起进行转发，例如，发送聊天记录。

接收合并消息与接收普通消息的操作相同，详见[接收消息](#接收文本消息)。
- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `fetchCombineMessageDetail` 方法获取原始消息列表。
- 对于一条合并消息，首次调用该方法会下载和解析合并消息附件，然后返回原始消息列表，而后续调用会存在以下情况：
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