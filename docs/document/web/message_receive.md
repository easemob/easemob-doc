# 接收消息

<Toc />

环信即时通讯 IM Web SDK 可以实现文本、图片、音频、视频和文件等类型的消息的接收。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，详见 [初始化文档](initialization.html)。
- 了解环信即时通讯 IM 的使用限制，详见 [使用限制](/product/limitation.html)。

## 接收文本消息

- 你可以通过 `addEventHandler` 注册监听器监听消息事件。你可以添加多个事件。当不再监听事件时，请确保删除监听器。
- 当消息到达时，接收方会收到 `onTextMessage` 回调。每个回调包含一条或多条消息。你可以遍历消息列表，并可以解析和展示回调中的消息。
- 对于聊天室消息，你可以通过消息的 `broadcast` 属性判断该消息是否为 [通过 REST API 发送的聊天室全局广播消息](/document/server-side/message_broadcast.html#发送聊天室全局广播消息)。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onTextMessage: function (message) {},
});
```

## 接收附件消息

语音、图片、视频和文件消息本质上是附件消息。

接收方可以自行下载语音、图片、图片缩略图、视频和文件。

自 SDK 4.14.0 开始，支持消息附件下载鉴权功能。该功能默认关闭，如要开通需联系环信商务。该功能开通后，用户须调用 SDK 的 API `EC.utils.download` 下载消息附件。

### 接收语音消息

接收方收到 `onAudioMessage` 回调，根据消息 `url` 字段获取语音文件的服务器地址，从而获取语音文件。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到语音消息。
  onAudioMessage: function (message) {
    // 语音文件在服务器的地址。
    console.log(message.url);
  },
});

```

### 接收图片消息

接收方收到 `onImageMessage` 回调，根据消息 `url` 字段获取图片文件的服务器地址，从而获取图片文件。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到图片消息。
  onImageMessage: function (message) {
    // 图片文件在服务器的地址。
    console.log(message.url);
    // 图片缩略图文件在服务器的地址。
    console.log(message.thumb);
  },
});

```

### 接收 GIF 图片消息

自 SDK 4.14.0 开始，支持接收 GIF 图片消息。

与普通消息相同，接收 GIF 图片消息时，接收方会收到 `onImageMessage` 回调方法。接收方收到消息后，读取消息体的 `isGif` 属性，若值是 `true`， 则为 GIF 图片消息。

```javascript
onImageMessage: (message) => {
    if(message.isGif){
        // 图片为GIF
    }
}
```

### 接收视频消息

接收方收到 `onVideoMessage` 回调，根据消息 `url` 字段获取视频文件的服务器地址，从而获取视频文件。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到视频消息。
  onVideoMessage: function (message) {
    // 视频文件在服务器的地址。
    console.log(message.url);
    // 视频首帧缩略图文件在服务器的地址。
    console.log(message.thumb);
  },
});

```

### 接收文件消息

接收方收到 `onFileMessage` 回调，根据消息 `url` 字段获取文件的服务器地址，从而获取文件。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到文件消息。
  onFileMessage: function (message) {
    // 文件在服务器的地址。
    console.log(message.url);
  },
});

```

## 接收位置消息

接收方收到 `onLocationMessage` 回调，需要将该位置的经纬度，借由第三方的地图服务，将位置在地图上显示出来。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  // 当前用户收到文件消息。
  onLocationMessage: function (message) {},
});
```

## 接收透传消息

透传消息是通知指定用户采取特定操作的命令消息。接收方自己处理透传消息。

:::tip
透传消息发送后，不支持撤回。
:::

接收方通过 `onCmdMessage` 回调接收透传消息。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onCmdMessage: function (message) {},
});
```

## 接收自定义消息

自定义消息为用户自定义的键值对，包括消息类型和消息内容。

接收方通过 `onCustomMessage` 回调接收自定义消息。

```javascript
// 使用 `addEventHandler` 监听回调事件
conn.addEventHandler("eventName", {
  onCustomMessage: function (message) {},
});
```

## 接收合并消息

为了方便消息互动，即时通讯 IM 自 4.2.0 版本开始支持将多个消息合并在一起进行转发。

接收合并消息与接收普通消息的操作相同，唯一不同是对于合并消息来说，消息接收事件为 `onCombineMessage`。
- 对于不支持合并转发消息的 SDK 版本，该类消息会被解析为文本消息，消息内容为 `compatibleText` 携带的内容，其他字段会被忽略。
- 合并消息实际上是一种附件消息。收到合并消息后，你可以调用 `downloadAndParseCombineMessage` 方法下载合并消息附件并解析出原始消息列表。

```javascript
connection
  .downloadAndParseCombineMessage({
    url: msg.url,
    secret: msg.secret,
  })
  .then((res) => {
    console.log("合并消息解析后的消息列表", res);
  });
```