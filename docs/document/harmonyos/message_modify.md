# 编辑消息

## 功能说明

环信即时通讯 IM 提供消息编辑功能。用户可以修改已发送成功的消息，服务端和本地存储的消息将同步更新，无需重新发送一条消息。

### 支持范围

该功能适用于单聊、群聊和聊天室，支持范围如下：

- 文本消息和自定义消息：支持修改消息体 `body` 和扩展字段 `ext`。
- 文件、视频、音频、图片、位置及合并转发消息：仅支持修改扩展字段 `ext`，不支持修改消息体。
- 透传消息：不支持编辑。

### 消息编辑流程

1. 应用调用消息编辑 API，传入待编辑消息的 ID 及修改后的内容。
2. SDK 将编辑请求发送至服务端；服务端完成消息更新后，将编辑后的消息返回给 SDK。
3. SDK 更新本地数据库中的对应消息，并通过 Promise 返回编辑后的消息。
4. 消息所属会话的其他成员收到消息编辑事件后，可通过消息监听器获取编辑后的消息并更新界面。

### 各类会话的消息编辑权限

- 对于单聊会话，只有消息发送方才能编辑消息。
- 对于群组或聊天室会话，普通成员只能编辑自己发送的消息。群主、聊天室所有者和管理员除了可以编辑自己发送的消息，还可以编辑普通成员发送的消息。此时，消息发送方不会改变，消息体中的编辑者用户 ID 为执行编辑操作的群主、聊天室所有者或管理员的用户 ID。

### 消息编辑后的生命周期

编辑消息没有时间限制，只要消息仍存储在服务端即可编辑。消息编辑后，其在服务端的保存时间会重新计算。例如，消息可在服务端保存 180 天，用户在消息发送后的第 30 天编辑该消息，编辑成功后，该消息还可以在服务端保存 180 天。

## 功能开通

使用消息编辑功能前，**需联系环信商务开通**。

## 前提条件

开始前，请确保满足以下条件：

- 完成 SDK 初始化并连接到服务器，详见 [快速开始](quickstart.html) 及 [初始化](initialization.html) 文档。
- 了解环信即时通讯 IM API 的使用限制，详见 [使用限制](/product/limitation.html)。
- 已联系环信商务开通消息编辑功能。

## 编辑消息

你可以调用 `ChatManager#modifyMessage` 编辑已发送成功的消息。该方法会同时更新服务端和本地消息，消息 ID 不会变化。编辑后的消息体中包含最后一次编辑者的用户 ID、编辑时间和累计编辑次数。除消息体和消息扩展字段 `ext` 外，消息的其他信息（例如消息 ID、发送方和接收方）均不会变化。

`modifiedBody` 和 `ext` 不能同时不传或同时为 `null`。传入非 `null` 的 `ext` 时，新的扩展字段会覆盖原消息的全部扩展字段；如需保留原有扩展字段，应先通过 `ChatMessage#ext` 获取原扩展字段，在其中合并新字段后再传入。扩展字段的值支持 `String`、`Number`、`Boolean` 和 `Object` 类型。

:::tip
一条消息默认最多可编辑 10 次。
:::

```typescript
const messageId: string = message.getMsgId();

// 文本消息：可以同时编辑消息体和消息扩展字段。
const textBody: TextMessageBody = new TextMessageBody('new content');
// 如需保留原扩展字段，先获取原字段，再添加或更新字段。
const textExt: Map<string, MessageExtType> = message.ext();
textExt.set('newKey', 'new value');

ChatClient.getInstance().chatManager()?.modifyMessage(messageId, textBody, textExt)
  .then((modifiedMessage: ChatMessage): void => {
    // modifiedMessage 为编辑后的消息。
  })
  .catch((error: ChatError): void => {
    // 编辑消息失败。
  });

// 自定义消息：可以同时编辑消息体和消息扩展字段。
const customBody: CustomMessageBody = new CustomMessageBody('new action');
const customExt: Map<string, MessageExtType> = new Map<string, MessageExtType>();
customExt.set('newKey1', 'new value');
customExt.set('newKey2', 123);

ChatClient.getInstance().chatManager()?.modifyMessage(messageId, customBody, customExt)
  .then((modifiedMessage: ChatMessage): void => {
    // modifiedMessage 为编辑后的消息。
  })
  .catch((error: ChatError): void => {
    // 编辑消息失败。
  });

// 文件、视频、音频、图片、位置和合并转发消息：
// 只能编辑消息扩展字段，因此 modifiedBody 传入 null。
const attachmentExt: Map<string, MessageExtType> = new Map<string, MessageExtType>();
attachmentExt.set('newKey1', false);
attachmentExt.set('newKey2', 'new value');

ChatClient.getInstance().chatManager()?.modifyMessage(messageId, null, attachmentExt)
  .then((modifiedMessage: ChatMessage): void => {
    // modifiedMessage 为编辑后的消息。
  })
  .catch((error: ChatError): void => {
    // 编辑消息失败。
  });
```

消息编辑后，消息接收方以及当前账号的其他在线设备会收到 `ChatMessageListener#onMessageContentChanged` 回调。该回调携带编辑后的消息、最后一次编辑消息的用户 ID 以及最新编辑时间。对于群组和聊天室会话，除执行编辑操作的用户外，群组或聊天室内的其他成员均会收到该回调。

:::tip
若 [通过 RESTful API 编辑自定义消息](/document/server-side/message_modify.html)，消息接收方也会通过 `ChatMessageListener#onMessageContentChanged` 回调接收编辑后的自定义消息。
:::

```typescript
const messageListener: ChatMessageListener = {
  // onMessageReceived 为必选回调。
  onMessageReceived: (messages: Array<ChatMessage>): void => {
  },
  onMessageContentChanged: (
    modifiedMessage: ChatMessage,
    operatorId: string,
    operationTime: number
  ): void => {
    const body: ChatMessageBody | undefined = modifiedMessage.getBody();
    if (body) {
      // 获取消息累计编辑次数。
      const operationCount: number = body.operationCount();

      // 也可以从消息体中获取最后一次编辑者和编辑时间；
      // 其值与回调参数 operatorId 和 operationTime 一致。
      const lastOperatorId: string = body.operatorId();
      const lastOperationTime: number = body.operationTime();
    }

    // 获取编辑后的消息扩展字段。
    const modifiedExt: Map<string, MessageExtType> = modifiedMessage.ext();
    modifiedExt.forEach((value: MessageExtType, key: string): void => {
      // 根据 key 和 value 更新业务数据。
    });
  }
};

const chatManager: ChatManager | undefined = ChatClient.getInstance().chatManager();
chatManager?.addMessageListener(messageListener);

// 不再需要监听时移除监听器。
chatManager?.removeMessageListener(messageListener);
```

## 接口列表

| API 名称 | 所属模块/类 | 说明 |
| :--- | :--- | :--- |
| [`modifyMessage`](#编辑消息) | `ChatManager` | 编辑服务端及本地消息的消息体或扩展字段。 |
| [`operationCount`](#编辑消息) | `ChatMessageBody` | 获取消息累计编辑次数。 |
| [`operatorId`](#编辑消息) | `ChatMessageBody` | 获取最后一次编辑消息的用户 ID。 |
| [`operationTime`](#编辑消息) | `ChatMessageBody` | 获取最后一次编辑消息的时间戳。 |
| [`ext`](#编辑消息) | `ChatMessage` | 获取编辑后的消息扩展字段。 |
