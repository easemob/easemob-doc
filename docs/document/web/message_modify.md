# 编辑消息

## 功能说明

对于单聊、群组和聊天室聊天会话中已经发送成功的消息，SDK 支持对这些消息的内容进行编辑。

### 支持范围

该功能适用于单聊、群聊和聊天室，支持范围如下：

- 文本消息：支持编辑消息体中的 `body.content` 和扩展字段 `ext`。
- 自定义消息：支持编辑消息体中的 `body.event`、`body.params` 和扩展字段 `ext`。
- 图片/语音/视频/文件/位置/合并消息：仅支持编辑扩展字段 `ext`。
- 透传消息：不支持编辑。

### 消息编辑流程

1. 应用调用消息修改 API，传入待编辑的消息及修改后的内容。    
2. SDK 将消息修改请求发送至服务端；服务端完成消息更新后，将修改后的消息返回给 SDK。
3. SDK 更新本地消息缓存，并通过接口返回的 Promise 将修改后的消息返回给应用。
4. 消息所属会话的其他成员收到消息修改事件后，可通过消息监听器获取修改后的消息，并更新界面。

### 各类会话的消息编辑权限

- 对于单聊会话，只有消息发送方才能对消息进行编辑。
- 对于群组/聊天室会话，普通成员只能编辑自己发送的消息。群主/聊天室所有者和管理员除了可以编辑自己发送的消息，还可以编辑普通成员发送的消息。这种情况下，消息的发送方不变，消息体中的编辑者的用户 ID 属性为群主/聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，即只要这条消息仍在服务端存储就可以编辑。消息编辑后，消息生命周期（在服务端的保存时间）会重新计算，例如，消息可在服务器上保存 180 天，用户在消息发送后的第 30 天（服务器上的保存时间剩余 150 天）编辑了消息，编辑成功后该消息还可以在服务器上保存 180 天。

对于编辑后的消息，消息体中除了内容或扩展字段变化，还新增了编辑者的用户 ID、编辑时间和编辑次数属性。除消息体外，该消息的其他信息（例如，消息发送方、接收方）均不会发生变化。

## 功能开通

若使用消息编辑功能，**需联系环信商务开通**。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化，并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html)文档。
- 初始化 SDK 时已注册 `ChatManager`，能够通过 `client.chatManager` 调用消息相关接口。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 联系环信商务开通消息编辑功能。

## 编辑消息

你可以调用 `modifyMessage` 方法编辑已发送成功的消息。目前仅支持文本消息和自定义消息。编辑时可更新消息体内容及消息扩展属性 `ext`，但消息 ID、发送方、接收方以及会话信息等标识性字段不会变化。

消息编辑成功后，会触发 `onMessageUpdated` 事件。对于单聊、群聊和聊天室，会话中的相关成员都可以收到该事件。该事件会携带消息 ID、会话信息、编辑后的消息内容及 `modifiedInfo` 等数据。`modifiedInfo` 可用于查看本次编辑信息，例如编辑时间 `operationTime`、编辑操作者 `operatorId` 和编辑次数 `operationCount`。

:::tip
1. 一条消息默认最多可编辑 10 次。
2. 当前仅支持编辑文本消息和自定义消息。
:::

示例代码如下：

```typescript
// 注册消息编辑事件
client.addEventHandler('modify', {
  onMessageUpdated: event => {
    console.log('onMessageUpdated', event);
    console.log('编辑后的消息内容:', event.message);
    console.log('编辑者:', event.message.modifiedInfo?.operatorId);
    console.log('编辑时间:', event.message.modifiedInfo?.operationTime);
    console.log('编辑次数:', event.message.modifiedInfo?.operationCount);
  },
});

// 1. 文本消息：支持编辑 body.content 和 ext
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-text-123',
  message: {
    type: 'text',
    body: {
      content: '修改后的内容',
    },
    ext: {
      edited: true,
    },
  },
});

// 2. 自定义消息：支持编辑 body.event、body.params 和 ext
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-custom-123',
  message: {
    type: 'custom',
    body: {
      event: 'newEvent',
      params: {
        key: 'new value',
      },
    },
    ext: {
      edited: true,
    },
  },
});

// 3. 图片/语音/视频/文件/位置/合并消息：只支持编辑 ext 字段
// 图片消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-image-123',
  message: {
    type: 'image',
    body: {
      // 原图片消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});

// 语音消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-voice-123',
  message: {
    type: 'voice',
    body: {
      // 原语音消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});

// 视频消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-video-123',
  message: {
    type: 'video',
    body: {
      // 原视频消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});

// 文件消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-file-123',
  message: {
    type: 'file',
    body: {
      // 原文件消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});

// 位置消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-location-123',
  message: {
    type: 'location',
    body: {
      // 原位置消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});

// 合并消息
await client.chatManager.modifyMessage({
  conversationId: 'user-1',
  conversationType: 'singleChat',
  messageId: 'msg-combine-123',
  message: {
    type: 'combine',
    body: {
      // 原合并消息体
    } as any,
    ext: {
      edited: true,
    },
  },
});
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`modifyMessage`](#编辑消息) | `ChatManager` | 编辑消息。 |





