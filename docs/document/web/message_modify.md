# 修改消息

你是否有过这样的经历：发送消息后发觉消息内容中包含错别字、遗漏了的关键、内容不够完善清晰、甚至临时想更改自己的想法。为解决这些需求，环信即时通讯 IM 提供修改消息功能，提高沟通效率和准确性。 

若使用该功能，**需联系环信商务开通**。SDK 4.13.0 之前的版本仅支持对单聊和群组聊天中的发送后的文本消息进行修改，SDK 4.13.0 及之后的版本中新增修改消息的支持类型：
 - 文本消息：支持修改消息内容字段 `msg` 和扩展字段 `ext`。
 - 自定义消息：支持修改 `customEvent` 、 `customExts` 和 扩展字段 `ext`。
 - 图片/语音/视频/文件/位置/合并消息：仅支持修改扩展字段 `ext`。
 - 命令消息：不支持修改。

## 技术原理

环信即时通讯 IM 通过 `modifyMessage` 方法实现消息修改。

### 消息修改流程

1. 用户调用 SDK 的 API 修改一条消息。
2. 服务端存储的该条消息，修改成功后回调给 SDK。
3. SDK 修改客户端上的该条消息。成功后，SDK 将修改后的消息回调给用户。

### 各类会话的消息修改权限

- 对于单聊会话，只有消息发送方才能对消息进行修改。
- 对于群组/聊天室会话，普通成员只能修改自己发送的消息。群主/聊天室所有者和管理员除了可以修改自己发送的消息，还可以修改普通成员发送的消息。这种情况下，消息的发送方不变，消息体中的修改者的用户 ID 属性为群主/聊天室所有者或管理员的用户 ID。

### 消息修改后的生命周期

修改消息没有时间限制，即只要这条消息仍在服务端存储就可以修改。消息修改后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）修改了消息，修改成功后该消息还可以在服务器上保存 180 天。

对于修改后的消息，消息体中除了内容或扩展字段变化，还新增了修改者的用户 ID、修改时间和修改次数属性。除消息体外，该消息的其他信息（例如，消息发送方、接收方）均不会发生变化。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html)文档。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系环信商务开通消息修改功能。

## 实现方法

你可以调用 `modifyMessage` 方法修改已经发送成功的消息。除消息体和消息扩展属性 `ext` 外，该消息的其他信息（例如，消息 ID、消息发送方、接收方）均不会发生变化。

SDK 4.13.0 及以后版本中修改消息成功后会返回 `modifiedInfo` 字段。你可以从`res.modifiedInfo` 中获取消息的最新修改时间（`operationTime`）、最新修改的操作者（`operatorId`）以及消息修改次数（`operationCount`）。

消息修改后，消息的接收方会收到 `onModifiedMessage` 事件，该事件中会携带修改后的消息对象、最新一次修改消息的用户以及消息的最新修改时间。对于群组和聊天室会话，除了修改消息的用户，群组/聊天室内的其他成员均会收到该事件。

:::tip
1. 一条消息默认最多可修改 10 次。
2. 若通过 RESTful API 修改自定义消息，消息的接收方也通过 `onModifiedMessage` 事件接收修改后的自定义消息。
:::

示例代码如下：

```javascript

// 注册修改消息事件
conn.addEventHandler("modifiedMessage", {
    onModifiedMessage: message => {
        console.log('onModifiedMessage', message)
    },
});


// 修改文本消息只支持修改 `msg` 和 `ext` 字段
const textMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'txt',
  to: 'to',
  msg: 'message content',
  ext: { key: 'new value' }
})

// 自定义消息支持修改 `customEvent`、`customExts` 和 `ext` 字段
const customMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'custom',
  to: 'to',
  customEvent: 'new event',
  customExts: { key: 'new value' },
  ext: { key: 'new value' }
})

// 图片/语音/视频/文件/位置/合并消息只支持修改 `ext` 字段
const imageMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'img',
  url: 'origin message url',
  to: 'to',
  ext: { key: 'new value' }
})

const videoMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'video',
  to: 'to',
  body: {
    url: 'origin message url'
  },
  ext: { key: 'new value' }
})

const fileMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'file',
  to: 'to',
  body: {
    url: 'origin message url'
  },
  ext: { key: 'new value' }
})

const audioMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'audio',
  to: 'to',
  body: {
    url: 'origin message url'
  },
  ext: { key: 'new value' }
})

const combineMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'combine',
  to: 'to',
  compatibleText: 'origin message compatibleText',
  title: 'origin message title',
  summary: 'origin message summary',
  messageList: [],
  ext: { key: 'new value' }
})

const locationMessage = WebIM.message.create({
  chatType: 'singleChat',
  type: 'loc',
  to: 'to',
  addr: 'origin message addr',
  buildingName: 'origin message buildingName',
  lat: 'origin message lat',
  lng: 'origin message lng',
  ext: { key: 'new value' }
})

conn
  .modifyMessage({
    messageId: 'origin message id',
    modifiedMessage: textMessage
  })
  .then((res) => {
    console.log('modify msg success', res.modifiedInfo)
  })
  .catch((e) => {
    console.log('modify failed', e)
  })


```





